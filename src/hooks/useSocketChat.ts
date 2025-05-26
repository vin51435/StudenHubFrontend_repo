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
  const socket = useSocket()?.socket!;
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket) return;
    socket.on('receiveMessage', receiveMessage);
    return () => {
      socket.off('receiveMessage', receiveMessage);
    };
  }, [socket]);

  const chatNotifications = useMemo(() => {
    return groupArrayOfObjects<ChatMessage>(
      newMessageNotifications.filter((n) => n.isRead === false) as unknown as ChatMessage[],
      'relatedChatId'
    );
  }, [newMessageNotifications]);

  const receiveMessage = useCallback((receiveMessageData: ChatMessage) => {
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
  }, []);

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

  async function loadChatFn() {
    setChatLoaded(true);
    joinChat();
    await fetchMessagesForChat();
    setChatLoaded(false);
  }

  async function fetchMessagesForChat() {
    if (!chatId || !recipientId) return;
    if (messages?.[chatId]) return;
    const res = await post<{ chatId: string; messages: ResponseMessages[] }>(
      'GET_MESSAGES_BY_CHAT_ID',
      {
        BASE_URLS: 'user',
        data: { chatId, oldesMessageDat: null },
        queries: [{ sortOrder: 'asc' }],
      }
    );
    if (res?.data?.chatId) {
      setMessages((prev) => {
        const messages = res?.data?.messages
          ?.map((msg) => {
            return {
              ...msg,
              role: msg.senderId === userId ? 'local' : ('remote' as MessageAgency),
              recipientId: msg.senderId === userId ? recipientId : userId,
              timestamp: msg.createdAt,
            } as ChatMessage;
          })
          .sort((a, b) => new Date(a!.timestamp).getTime() - new Date(b!.timestamp).getTime()); // ascending

        return { ...prev, [res.data!.chatId]: messages } as Record<string, ChatMessage[]>;
      });
    }
  }

  function joinChat() {
    if (socket?.connected) {
      socket.emit('joinChat', chatId);
    }
  }

  function leaveChat() {
    if (socket?.connected) {
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

    if (socket?.connected) {
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
    messages,
    chatLoaded,
    chatNotifications,
  };
}
