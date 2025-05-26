import { useEffect, useState, useCallback } from 'react';
import { post } from '@src/libs/apiConfig';
import { useSelector } from 'react-redux';
import { RootState } from '@src/redux/store';
import { useSocket } from '@src/contexts/Socket.context';

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
  deleted: {
    status: boolean;
    by: string | null;
  }; // no use
  reactions: []; // not use
  createdAt: string;
  updatedAt: string;
};

export function useSocketChat(chatId: string, recipientId: string) {
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});
  const [chatLoaded, setChatLoaded] = useState(true);
  const userId = useSelector((state: RootState) => state.auth.user!._id);
  const socket = useSocket()?.socket!;

  useEffect(() => {
    if (!socket) return;
    socket.on('receiveMessage', receiveMessage);
    return () => {
      console.log('reciveMessage off');
      socket.off('receiveMessage', receiveMessage);
    };
  }, [socket]);

  const receiveMessage = useCallback((receiveMessageData: ChatMessage) => {
    console.log('receiveMessagehandler hit');
    const message = {
      ...receiveMessageData,
      role: receiveMessageData.senderId === userId ? 'local' : ('remote' as MessageAgency),
    };

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
      console.log('updatedMessages', updatedMessages);
      return {
        ...prev,
        [chatId]: updatedMessages,
      };
    });
  }, []);

  const sendMessage = useCallback(
    (content: string) => {
      if (!socket) return;

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
          ?.map(
            (msg) =>
              ({
                ...msg,
                role: msg.senderId === userId ? 'local' : ('remote' as MessageAgency),
                recipientId: msg.senderId === userId ? recipientId : userId,
                timestamp: msg.createdAt,
              } as ChatMessage)
          )
          .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()); // ascending

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

  return { messages, sendMessage, loadChatFn, joinChat, leaveChat, chatLoaded };
}
