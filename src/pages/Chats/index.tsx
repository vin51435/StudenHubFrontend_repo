import { useEffect, useState } from 'react';
import InboxList from './components/Inbox';
import Chat from './components/Chat';
import { useSocketChat } from '@src/hooks/useSocketChat';
import { useAppDispatch, useAppSelector } from '@src/redux/hook';
import { fetchInbox, InboxState } from '@src/redux/reducers/cache/inbox.slice';

const Chats = () => {
  const chatData = useAppSelector((state) => state.chatInboxCache);
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const { chatNotifications } = useSocketChat();
  const dispatch = useAppDispatch();

  const [selectedChat, setSelectedChat] = useState<InboxState | null>(null);

  const chatIds = currentUser?.chats?.chatIds || [];

  // 1. Load all chat participants
  useEffect(() => {
    // would be better to match cached chatIds to new chatIds
    if (!chatIds || !chatIds.length) return;
    console.log('chatIds', chatIds);
    dispatch(fetchInbox(chatIds));
  }, [chatIds]);

  const handleUserSelect = (chat?: InboxState) => {
    setSelectedChat(chat ?? null);
  };

  return (
    <div className="chat-inbox_container flex !max-h-full !min-h-full rounded-lg bg-[var(--white)] pb-2 shadow-md dark:bg-transparent">
      <InboxList
        chats={chatData.chats}
        notifications={chatNotifications}
        selectedChat={selectedChat}
        onSelect={handleUserSelect}
        loading={chatData.chatsLoading}
      />
      <div className="flex-1 rounded-r-lg border border-gray-200">
        {selectedChat?.chatId ? (
          <Chat
            chatId={selectedChat.chatId}
            handleUserSelect={handleUserSelect}
            height={600}
            userB={selectedChat?.participantData} // optional: for showing name/picture
            userA={currentUser!}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default Chats;
