import { useEffect, useState, useCallback, useMemo } from 'react';
import { post } from '@src/libs/apiConfig';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@src/redux/store';
import { useSocket } from '@src/contexts/Socket.context';
import { groupArrayOfObjects } from '@src/utils/common';
import { deleteNotification } from '@src/redux/reducers/notifications';

type MessageStatus = 'local' | 'sent' | 'delivered' | 'read';
type MessageAgency = 'local' | 'remote';

export interface ChatMessage {
  role: MessageAgency;
  localId?: string;
  _id?: string;
  chatId: string;
  recipientId: string;
  senderId?: string;
  senderUsername?: string;
  content: string;
  timestamp: string;
  status: MessageStatus;
}

export type ResponseMessages = {
  _id: string;
  chatId: string;
  senderId: string;
  senderUsername: string;
  content: string;
  status: MessageStatus; // No use
  isRead: boolean;
  deleted: {
    status: boolean;
    by: string | null;
  }; // no use
  reactions: []; // not use
  createdAt: string;
  updatedAt: string;
};

export function useSocketChat(chatId?: string, recipientId?: string) {
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});
  const [chatLoaded, setChatLoaded] = useState(true);
  const userId = useSelector((state: RootState) => state.auth.user!._id);
  const { newMessage: newMessageNotifications } = useSelector(
    (state: RootState) => state.notification.notifications
  );
  const dispatch = useDispatch();
  const socketContext = useSocket();
  const socket = socketContext?.socket;

  useEffect(() => {
    if (!socket || !socket.connected) return;

    socket?.on('receiveMessage', receiveMessage);

    return () => {
      socket?.off('receiveMessage', receiveMessage);
    };
  }, [socket]);

  const chatNotifications = useMemo(() => {
    return groupArrayOfObjects<ChatMessage>(
      newMessageNotifications.filter((n) => n.isRead === false) as unknown as ChatMessage[],
      'relatedChatId'
    );
  }, [newMessageNotifications]);

  const receiveMessage = (receiveMessageData: ChatMessage) => {
    console.log('receiveMessage', receiveMessageData);
    const message = {
      ...receiveMessageData,
      role: receiveMessageData.senderId === userId ? 'local' : ('remote' as MessageAgency),
    };

    const chatId = message.chatId;

    setMessages((prev) => {
      const existingMessages = prev?.[chatId] || [];
      const index = existingMessages.findIndex(
        (msg) =>
          (msg.localId && msg.localId === message.localId) || (msg._id && msg._id === message._id)
      );

      let updatedMessages;
      if (index !== -1) {
        // Replace local message with server-confirmed message (ensure _id replaces localId)
        updatedMessages = [...existingMessages];
        updatedMessages[index] = {
          ...updatedMessages[index],
          ...message,
          localId: undefined, // remove localId to avoid key conflicts
        };
      } else {
        updatedMessages = [...existingMessages, message];
      }
      return {
        ...prev,
        [chatId]: updatedMessages,
      };
    });
  };

  const sendMessage = useCallback(
    (content: string) => {
      if (!socket || !chatId || !recipientId) return;

      const localId = `local_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

      const message: ChatMessage = {
        localId,
        chatId,
        recipientId,
        content,
        timestamp: new Date().toISOString(),
        status: 'local',
        role: 'local',
      };

      setMessages((prev) => {
        const existingMessages = prev?.[chatId] || [];
        return {
          ...prev,
          [chatId]: [...existingMessages, message],
        };
      });

      socket.emit('sendMessage', message);
    },
    [socket, chatId, recipientId]
  );

  const loadChatFn = useCallback(async () => {
    setChatLoaded(true);
    async function connectToChat() {
      joinChat();
      await fetchMessagesForChat();
      setChatLoaded(false);
    }

    async function retryConnect() {
      await connectToChat();
      setTimeout(() => {
        socket?.emit('check-room', chatId, (isInRoom: boolean) => {
          console.log('In room?', isInRoom);
          if (!isInRoom) retryConnect();
        });
      }, 500);
    }

    retryConnect();
  }, [chatId, socket]);

  async function fetchMessagesForChat(oldestMessageDate?: string) {
    if (!chatId || !recipientId) return;
    if (messages?.[chatId] && !oldestMessageDate) return;

    const data: any = { chatId };
    if (oldestMessageDate) data.oldestMessageDate = oldestMessageDate;

    const res = await post<{ chatId: string; messages: ResponseMessages[] }>(
      'GET_MESSAGES_BY_CHAT_ID',
      {
        BASE_URLS: 'user',
        data,
        queries: [{ sortOrder: 'asc' }],
      }
    );
    if (res?.data?.chatId) {
      setMessages((prev) => {
        const newMessages = res?.data?.messages?.map((msg) => ({
          ...msg,
          role: msg.senderId === userId ? 'local' : ('remote' as MessageAgency),
          recipientId: msg.senderId === userId ? recipientId : userId,
          timestamp: msg.createdAt,
        })) as ChatMessage[];

        const existingMessages = prev[res.data!.chatId] ?? [];

        // Merge and deduplicate (by _id or localId if _id is missing), then sort by timestamp
        const mergedMessages = [...newMessages, ...existingMessages].filter((msg, index, self) => {
          const id = msg._id ?? msg.localId;
          return self.findIndex((m) => (m._id ?? m.localId) === id) === index;
        });

        mergedMessages.sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );

        return {
          ...prev,
          [res.data!.chatId]: mergedMessages,
        } as Record<string, ChatMessage[]>;
      });
    }
  }

  function joinChat() {
    if (socket) {
      socket.emit('joinChat', chatId);
    }
  }

  function leaveChat() {
    if (socket) {
      socket.emit('leaveChat', chatId);
    }
  }

  function markChatMessageNotificationsAsRead() {
    console.log('markChatMessageNotificationsAsRead');
    if (!socket || !chatId || !chatNotifications?.[chatId]) return;
    const chatMessageIds = chatNotifications?.[chatId]?.map((msg) => msg._id) as string[];
    if (!chatMessageIds?.length) return;

    console.log('chatMessageIds', chatMessageIds);

    dispatch(
      deleteNotification({
        type: 'newMessage',
        notificationIds: chatMessageIds,
      })
    );

    if (socket) {
      socket.emit('deleteNotification', chatMessageIds);
    }
  }

  return {
    sendMessage,
    loadChatFn,
    joinChat,
    leaveChat,
    receiveMessage,
    markChatMessageNotificationsAsRead,
    fetchMessagesForChat,
    messages,
    chatLoaded,
    chatNotifications,
  };
}
