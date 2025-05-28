import React, { memo } from 'react';
import { ChatDataType } from '..';
import { Avatar, Badge, Col, Row } from 'antd';
import DefaultAvatar from '/profile-default.svg';
import { ChatMessage } from '@src/hooks/useSocketChat';

type InboxProps = {
  chats: ChatDataType[] | null;
  selectedChat: ChatDataType | null;
  onSelect: (chatId: ChatDataType) => void;
  notifications?: Record<string, ChatMessage[]>;
};

const InboxList = memo(
  ({ chats, selectedChat, onSelect, notifications }: InboxProps) => {
    return (
      <>
        {chats && chats.length > 0 ? (
          <div className="w-4/12 overflow-y-auto overflow-x-hidden ">
            {chats.map((chat) => (
              <Row
                key={chat.chatId}
                onClick={() => {
                  onSelect(chat);
                }}
                className={`cursor-pointer  px-1 py-1.5`}
              >
                <Badge
                  className={`!w-full !flex items-center !mr-4  border border-indigo-100 !px-2 !py-1 rounded-lg  ${
                    selectedChat && selectedChat.chatId === chat.chatId ? 'selected-chat' : ''
                  }  hover:bg-gray-100 dark:hover:bg-zinc-800`}
                  key={chat.chatId}
                  count={notifications?.[chat?.chatId!]?.length || 0}
                  offset={[0, 0]}
                >
                  <Col span={4}>
                    <Avatar src={chat.participantData?.profilePicture ?? DefaultAvatar} size={40} />
                  </Col>
                  <Col span={20}>
                    <div className="font-medium line-clamp-1">{chat.participantData!.fullName}</div>
                  </Col>
                </Badge>
              </Row>
            ))}
          </div>
        ) : (
          <div className="w-64 overflow-y-auto border-r">No Chats</div>
        )}
      </>
    );
  }
  // (prevProps, nextProps) => prevProps.chats?.length === nextProps.chats?.length
);

export default InboxList;
