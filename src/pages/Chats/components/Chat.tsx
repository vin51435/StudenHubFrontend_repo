import React, { useEffect, useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Bubble, Sender, useXAgent, useXChat } from '@ant-design/x';
import { Flex } from 'antd';
import { useSocket } from '@src/contexts/Socket.context';
import { User } from '@src/types';
import { MessageType } from 'antd/es/message/interface';
import { post } from '@src/libs/apiConfig';
import { useSocketChat } from '@src/contexts/useSocketChat';

const roles = {
  ai: {
    placement: 'start' as const,
    avatar: { icon: <UserOutlined />, style: { background: '#fde3cf' } },
    typing: { step: 5, interval: 20 },
    style: { maxWidth: 600 },
  },
  local: {
    placement: 'end' as const,
    avatar: { icon: <UserOutlined />, style: { background: '#87d068' } },
  },
};

interface ChatProps {
  chatId: string; // chat identifier
  userB: User | null;
  height?: number;
  userA: User;
}

const Chat: React.FC<ChatProps> = ({ chatId, userB, height = 400, userA }) => {
  const [loadChat, setLoadChat] = useState(true);
  const [content, setContent] = useState('');
  const socket = useSocket()?.socket!;
  const { messages, sendMessage, loadChatFn } = useSocketChat(chatId, userB?._id!);

  useEffect(() => {
    loadChatFn().then(() => setLoadChat(false));
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 font-semibold border-b">{userB?.fullName}</div>
      <Flex vertical gap="middle" className="flex-1 p-4 overflow-y-auto">
        {!loadChat ? <Bubble.List
          roles={roles}
          style={{ maxHeight: height, overflowY: 'auto' }}
          items={messages?.[chatId].map(({ id, content, status }) => ({
            key: id,
            // loading: status === 'loading',
            role: status === 'local' ? 'local' : 'ai',
            content,
          }))}
        /> : (!loadChat && !messages?.[chatId].length) ? <div>No Messages</div> : <div>loading...</div>}
      </Flex>
      <Sender
        // loading={agent.isRequesting()}
        value={content}
        onChange={setContent}
        onSubmit={(val) => {
          sendMessage(val);
          setContent('');
        }}
      />
    </div>
  );
};

export default Chat;