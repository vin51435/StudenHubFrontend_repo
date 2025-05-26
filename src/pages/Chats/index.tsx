import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@src/redux/store';
import { User } from '@src/types';
import { post } from '@src/libs/apiConfig';
import InboxList from './components/Inbox';
import Chat from './components/Chat';
import { useSocketChat } from '@src/hooks/useSocketChat';

export type ChatDataType = {
  chatId: string | null;
  participantData: User | null;
};

const Chats = () => {
  const [chatData, setChatData] = useState<ChatDataType[] | null>(null);
  const [selectedChat, setSelectedChat] = useState<ChatDataType | null>(null);
  const [loading, setLoading] = useState({ loadingInbox: true, loadingChat: false });

  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const chatIds = currentUser?.chats?.chatIds || [];

  const { chatNotifications } = useSocketChat();

  // 1. Load all chat participants
  useEffect(() => {
    (async () => {
      await fetchInbox();
      setLoading({ ...loading, loadingInbox: false });
    })();
  }, [chatIds]);

  async function fetchInbox() {
    if (chatIds.length > 0) {
      const res = await post<{ chats: { chatId: string; secondParticipant: User }[] }>(
        'GET_INBOX_PARTICIPANTS',
        {
          BASE_URLS: 'user',
          data: { chatIds },
        }
      );
      const chatData =
        res.data?.chats?.map((chat: any) => ({
          chatId: chat.chatId,
          participantData: chat.secondParticipant,
        })) ?? [];
      setChatData(chatData as ChatDataType[] | null);
    }
  }

  const handleUserSelect = (chat: ChatDataType) => {
    setSelectedChat(chat ?? null);
  };

  return (
    <div className="flex h-[80vh] bg-white dark:bg-zinc-900 rounded-lg shadow-md">
      <InboxList
        chats={chatData}
        notifications={chatNotifications}
        selectedChat={selectedChat}
        onSelect={handleUserSelect}
      />
      <div className="flex-1 border border-gray-200 rounded-r-lg">
        {selectedChat?.chatId ? (
          <Chat
            chatId={selectedChat.chatId}
            height={600}
            userB={selectedChat?.participantData} // optional: for showing name/picture
            userA={currentUser!}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default Chats;
