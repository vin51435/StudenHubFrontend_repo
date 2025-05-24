import React from 'react';
import { ChatDataType } from '..';
import { Avatar, Col, Row } from 'antd';
import DefaultAvatar from '/profile-default.svg'

type InboxProps = {
  chats: ChatDataType[] | null;
  selectedChat: ChatDataType | null;
  onSelect: (chatId: ChatDataType) => void;
}

const InboxList = ({ chats, selectedChat, onSelect }: InboxProps) => {
  return (
    <>
      {chats && chats.length > 0 ? <div className="w-64 overflow-y-auto border-r">
        {chats.map((chat) => (
          <Row
            key={chat.chatId}
            onClick={() => onSelect(chat)}
            className={`cursor-pointer p-4 flex items-center hover:bg-gray-100 dark:hover:bg-zinc-800 ${selectedChat && selectedChat.chatId === chat.chatId ? 'bg-gray-200 dark:bg-zinc-700' : ''
              }`}
          >
            <Col span={4}>
              <Avatar src={chat.participantData?.profilePicture ?? DefaultAvatar} size={40} />
            </Col>
            <Col span={20}>
              <div className="font-medium line-clamp-1">{chat.participantData!.fullName}</div>
            </Col>
          </Row>
        ))}
      </div>
        : <div className="w-64 overflow-y-auto border-r">No Chats</div>}</>
  );
};

export default InboxList;