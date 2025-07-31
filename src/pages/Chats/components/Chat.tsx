import React, { useEffect, useRef, useState } from 'react';
import { MdDelete } from 'react-icons/md';
import { FaUser } from 'react-icons/fa6';
import { Bubble, Sender } from '@ant-design/x';
import { Avatar, Button, Flex, Popconfirm } from 'antd';
import { ChatMessage, useSocketChat } from '@src/hooks/useSocketChat';
import DefaultAvatar from '/profile-default.svg';
import { useSocket } from '@src/contexts/Socket.context';
import { IUser } from '@src/types/app';
import { useAppDispatch } from '@src/redux/hook';
import { deleteChat, InboxState } from '@src/redux/reducers/cache/inbox.slice';
import useScrollTopDetection from '@src/hooks/useScrollTopDetection';
import { useNavigate } from 'react-router-dom';
import { getRoutePath } from '@src/utils/getRoutePath';

const roles = {
  remote: {
    placement: 'start' as const,
    avatar: { icon: <FaUser />, style: { background: '#fde3cf' } },
  },
  local: {
    placement: 'end' as const,
    avatar: { icon: <FaUser />, style: { background: '#87d068' } },
  },
};

interface ChatProps {
  chatId: string;
  userB: IUser | null;
  handleUserSelect: (chat?: InboxState) => void;
  height?: number;
  userA: IUser;
}

const Chat: React.FC<ChatProps> = ({ chatId, userB, height = 400, userA, handleUserSelect }) => {
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
  const navigate = useNavigate();

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
    <div className="chat_container flex h-full flex-col">
      <div className="flex items-center border-b p-4 text-start font-semibold">
        <span
          className="flex w-full cursor-pointer items-center"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            navigate(getRoutePath('USER_PROFILE').replace(':username', userB?.username!));
          }}
        >
          <Avatar className="!mr-2" src={userB?.profilePicture ?? DefaultAvatar} />
          <span className="w-full truncate">{userB?.username}</span>
        </span>
        <Popconfirm
          title="Are you sure you want to delete this chat?"
          onConfirm={() => {
            handleUserSelect();
            dispatch(deleteChat(chatId));
          }}
          okText="Yes"
          cancelText="No"
          placement="bottom"
        >
          <Button
            className="!text-red"
            classNames={{ icon: ' !w-full' }}
            icon={<MdDelete className="!text-red" size="middle" color="red" />}
          />
        </Popconfirm>
      </div>

      <Flex vertical gap="middle" className="flex-1 overflow-y-auto p-4">
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
