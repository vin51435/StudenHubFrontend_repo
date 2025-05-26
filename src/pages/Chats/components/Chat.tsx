import React, { useEffect, useRef, useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Bubble, Sender } from '@ant-design/x';
import { Avatar, Flex } from 'antd';
import { User } from '@src/types';
import { ChatMessage, useSocketChat } from '@src/hooks/useSocketChat';
import DefaultAvatar from '/profile-default.svg';

const roles = {
  remote: {
    placement: 'start' as const,
    avatar: { icon: <UserOutlined />, style: { background: '#fde3cf' } },
    // typing: { step: 5, interval: 20 }, // optional
    // style: { maxWidth: 600 },
  },
  local: {
    placement: 'end' as const,
    avatar: { icon: <UserOutlined />, style: { background: '#87d068' } },
  },
};

interface ChatProps {
  chatId: string;
  userB: User | null;
  height?: number;
  userA: User;
}

const Chat: React.FC<ChatProps> = ({ chatId, userB, height = 400, userA }) => {
  const [content, setContent] = useState('');
  const {
    messages,
    sendMessage,
    loadChatFn,
    leaveChat,
    markChatMessageNotificationsAsRead,
    chatLoaded,
  } = useSocketChat(chatId, userB?._id!);
  const joinedRef = useRef(false);

  useEffect(() => {
    if (!joinedRef.current) {
      loadChatFn();
      markChatMessageNotificationsAsRead();
      joinedRef.current = true;
    }
    return () => {
      if (joinedRef.current) {
        leaveChat();
        joinedRef.current = false;
      }
    };
  }, [chatId]);

  const currentMessages = messages?.[chatId] || [];

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 flex items-center font-semibold border-b text-start">
        <Avatar className="!mr-2" src={userB?.profilePicture ?? DefaultAvatar} />
        {userB?.fullName}
      </div>
      <Flex vertical gap="middle" className="flex-1 p-4 overflow-y-auto">
        {chatLoaded ? (
          <div>loading...</div>
        ) : currentMessages.length ? (
          <Bubble.List
            className="p-2"
            roles={roles}
            style={{ maxHeight: height, overflowY: 'auto' }}
            items={currentMessages.map((msg: ChatMessage) => ({
              key: msg._id || msg.localId,
              role: msg.role,
              content: msg.content,
            }))}
          />
        ) : (
          <div>No Messages</div>
        )}
      </Flex>
      <Sender
        className="m-4 !w-auto bg-transparent"
        value={content}
        onChange={setContent}
        onSubmit={(val: string) => {
          sendMessage(val);
          setContent('');
        }}
      />
    </div>
  );
};

export default Chat;
