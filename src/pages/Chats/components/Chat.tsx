import React, { useEffect, useRef, useState } from 'react';
import { DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { Bubble, Sender } from '@ant-design/x';
import { Avatar, Button, Flex, Popconfirm } from 'antd';
import { ChatMessage, useSocketChat } from '@src/hooks/useSocketChat';
import DefaultAvatar from '/profile-default.svg';
import { useSocket } from '@src/contexts/Socket.context';
import { IUser } from '@src/types/app';
import { useAppDispatch } from '@src/redux/hook';
import { deleteChat } from '@src/redux/reducers/cache/inbox.slice';
import useScrollTopDetection from '@src/hooks/useScrollTopDetection';

const roles = {
  remote: {
    placement: 'start' as const,
    avatar: { icon: <UserOutlined />, style: { background: '#fde3cf' } },
  },
  local: {
    placement: 'end' as const,
    avatar: { icon: <UserOutlined />, style: { background: '#87d068' } },
  },
};

interface ChatProps {
  chatId: string;
  userB: IUser | null;
  height?: number;
  userA: IUser;
}

const Chat: React.FC<ChatProps> = ({ chatId, userB, height = 400, userA }) => {
  const dispatch = useAppDispatch();
  const [content, setContent] = useState('');
  const socket = useSocket()?.socket;
  const {
    messages,
    chatLoaded,
    sendMessage,
    loadChatFn,
    leaveChat,
    markChatMessageNotificationsAsRead,
    fetchMessagesForChat,
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
  }, [chatId, socket]);

  const currentMessages = messages?.[chatId] || [];

  useScrollTopDetection('.chat-bubble-list', async ({ scrollHeight, element }) => {
    const prevScrollHeight = scrollHeight;

    await fetchMessagesForChat(currentMessages[0]?.timestamp ?? new Date().toISOString());

    requestAnimationFrame(() => {
      const newScrollHeight = element.scrollHeight;
      const diff = newScrollHeight - prevScrollHeight;
      element.scrollTop = diff;
    });
  });

  return (
    <div className="chat_container h-full flex flex-col">
      <div className="p-4 flex items-center font-semibold border-b text-start">
        <span className="w-full flex items-center">
          <Avatar className="!mr-2" src={userB?.profilePicture ?? DefaultAvatar} />
          <span className="truncate w-full">{userB?.username}</span>
        </span>
        <Popconfirm
          title="Are you sure you want to delete this chat?"
          onConfirm={() => dispatch(deleteChat(chatId))}
          okText="Yes"
          cancelText="No"
          placement="bottom"
        >
          <Button type="text" icon={<DeleteOutlined />} />
        </Popconfirm>
      </div>

      <Flex vertical gap="middle" className="flex-1 p-4 overflow-y-auto">
        {chatLoaded ? (
          <div>loading...</div>
        ) : currentMessages.length ? (
          <Bubble.List
            className="p-2"
            roles={roles}
            style={{ maxHeight: height, overflowY: 'auto' }}
            rootClassName="chat-bubble-list"
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
