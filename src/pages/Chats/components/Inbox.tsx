import React, { memo } from 'react';
import { Avatar, Badge } from 'antd';
import DefaultAvatar from '/profile-default.svg';
import { ChatMessage } from '@src/hooks/useSocketChat';
import { InboxState } from '@src/redux/reducers/cache/inbox.slice';

type InboxProps = {
  chats: InboxState[] | null;
  selectedChat: InboxState | null;
  notifications?: Record<string, ChatMessage[]>;
  loading?: boolean;
  onSelect: (chatId: InboxState) => void;
};

const InboxList = memo(({ chats, selectedChat, onSelect, notifications, loading }: InboxProps) => {
  if (loading) {
    return <div className="w-64 overflow-y-auto border-r">Loading...</div>;
  }

  return (
    <>
      {chats && chats.length > 0 ? (
        <div className="w-4/12 overflow-y-auto overflow-x-hidden ">
          {chats.map((chat) => (
            <div
              key={chat.chatId}
              onClick={() => onSelect(chat)}
              className={`cursor-pointer px-2 py-2 mr-4 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg ${
                selectedChat?.chatId === chat.chatId ? 'bg-indigo-100 dark:bg-zinc-700' : ''
              }`}
            >
              <Badge
                count={notifications?.[chat?.chatId!]?.length || 0}
                offset={[-4, 4]}
                className="!w-full"
              >
                <div className="flex items-center space-x-3">
                  <Avatar
                    className="min-w-fit !mr-2"
                    src={chat.participantData?.profilePicture ?? DefaultAvatar}
                    size={40}
                  />
                  <div className="font-medium truncate">{chat.participantData?.fullName}</div>
                </div>
              </Badge>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-64 overflow-y-auto border-r">No Chats</div>
      )}
    </>
  );
});

export default InboxList;
