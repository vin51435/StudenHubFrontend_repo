import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSocket } from './Socket.context';
import { post } from '@src/libs/apiConfig';
import { useSelector } from 'react-redux';
import { RootState } from '@src/redux/store';

type MessageStatus = 'local' | 'sent' | 'delivered' | 'read';

export interface ChatMessage {
  id?: string;
  chatId: string;
  recipientId: string;
  senderId?: string;
  senderUsername?: string;
  content: string;
  timestamp: string;
  status: MessageStatus;
}

export interface InboxChats {
  [chatId: string]: ChatMessage[];
}

export function useSocketChat(chatId: string, recipientId: string) {
  const [messages, setMessages] = useState<InboxChats>();
  const [loadChat, setLoadChat] = useState(true);
  const { _id: userId } = useSelector((state: RootState) => state.auth.user);
  const socket = useSocket()?.socket!;

  useEffect(() => {
    socket.on('receiveMessage', receiveMessage);

    return () => {
      socket.off('receiveMessage', receiveMessage);
      if (socket.connected) {
        socket.emit('leaveChat', chatId);
      }
    };
  }, [socket, chatId]);

  const receiveMessage = useCallback((receiveMessageData: ChatMessage) => {
    console.log('recieveMessage', receiveMessageData);
    setMessages((prev) => ({
      ...prev,
      [receiveMessageData.chatId]: [...(prev?.[receiveMessageData.chatId] || []), receiveMessageData],
    }))
  }, [socket])

  const sendMessage = useCallback((content: string) => {
    if (!socket) return;

    const localId = `local_${Date.now()}`;
    const message: ChatMessage = {
      id: localId,
      chatId,
      recipientId,
      content,
      timestamp: new Date().toISOString(),
      status: 'local',
    };

    // Add local message immediately
    setMessages((prev) => ({ ...prev, [chatId]: [...(prev?.[chatId] || []), message] }));
    // Emit to server
    socket.emit('sendMessage', { ...message, status: 'sent' });
  }, [socket]);

  async function loadChatFn() {
    setLoadChat(true)
    await joinChat();
    await fetchMessagesForChat().finally(() => setLoadChat(false))
  }

  async function joinChat() {
    if (socket.connected) {
      socket.emit('joinChat', chatId);
    }
  }

  async function fetchMessagesForChat() {
    if (messages?.[chatId]) return
    const res = await post('GET_MESSAGES_BY_CHAT_ID', { BASE_URLS: 'user', data: { chatId, oldesMessageDat: null } })
    console.log('fetchMessagesForChat', res.data);
    // setChatMessages({ ...chatMessages, [chatId]: res.data });
  }

  return { messages, sendMessage, loadChatFn };
}