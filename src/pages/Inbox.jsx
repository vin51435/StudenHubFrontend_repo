import { useSocket } from '@src/context/SocketContext';
import { postData } from '@src/config/apiConfig';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import defaultUserImg from '@src/assets/svg/default-user.svg';

const Inbox = () => {
  const [selectedUser, setSelectedUser] = useState({ userId: null, chatId: null, chatLoaded: false, userFullName: null, userPicture: null });
  const [usersData, setUsersData] = useState([]);
  const { notifications } = useSelector(state => state.notification);
  const { isAuthenticated, user, token } = useSelector(state => state.auth);
  const location = useLocation();
  const { socket, handleReadNotification } = useSocket();
  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [messageContainer, setMessageContainer] = useState({ isAtBottom: true, newMessage: false, });
  const { username, _id, chats, fullName } = user;

  // IntersectionObserver callback to detect visibility of the last message
  const observerCallback = (entries) => {
    const entry = entries[0];
    setMessageContainer({ isAtBottom: entry.isIntersecting, newMessage: false, });
  };

  const selectedUserData = usersData.find(user => user.userId === selectedUser.userId);

  useLayoutEffect(() => {
    if (messageContainer.isAtBottom && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedUserData?.messages, messageContainer.isAtBottom]);

  useEffect(() => {
    if (!socket) return;

    handleChatConnection();

    const handleNewMessage = (newMessage) => {
      if (!selectedUser?.userId || !selectedUser?.chatId) return;
      if (!messageContainer.isAtBottom) setMessageContainer(prev => ({ ...prev, newMessage: true }));
      try {
        setUsersData((prev) => {
          const existingUserIndex = prev.findIndex(
            (user) => user.chatId === newMessage.chatId
          );

          if (existingUserIndex === -1) return prev;

          const updatedUserMessages = [...prev];
          const existingUser = updatedUserMessages[existingUserIndex];

          if (!existingUser?.messages) {
            throw new Error('User messages is null or undefined.');
          }

          updatedUserMessages[existingUserIndex] = {
            ...existingUser,
            messages: [
              ...(existingUser.messages || []),
              newMessage,
            ],
          };

          return updatedUserMessages;
        });
      } catch (error) {
        console.error('Error handling new message:', error);
      }
    };

    // Set up IntersectionObserver to observe the last message
    const observer = new IntersectionObserver(observerCallback, {
      root: null, // observe relative to the viewport
      threshold: 1.0, // trigger when the whole element is in view
    });

    if (messagesEndRef.current) {
      observer.observe(messagesEndRef.current);
    }

    socket.on('receiveMessage', handleNewMessage);

    return () => {
      socket.off('receiveMessage', handleNewMessage);

      if (messagesEndRef.current) {
        observer.unobserve(messagesEndRef.current);
      }
    };
  }, [selectedUser.userId, selectedUser.chatId]);

  useEffect(() => {
    // Get all chat participants
    if (chats?.chatIds) {
      postData('GET_INBOX_PARTICIPANTS', {
        baseURL: 'user',
        data: { chatIds: chats.chatIds },
      })
        .then(response => {
          const userB = response.data.map(
            ({ chatId, secondParticipant: { _id, firstName, lastName, username, fullName, profilePicture } }) => ({
              chatId,
              userId: _id,
              profilePicture,
              firstName,
              lastName,
              fullName,
              name: `${firstName} ${lastName}`,
              username,
              notification: { newMessage: false, newMessageNotificationId: null },
            })
          );
          return userB;
        })
        .then((userB) => {
          updateUsersDataAndNotifications(userB);
        });
    }
  }, [location.pathname === '/inbox', notifications.newChat]);

  useEffect(() => {
    updateUsersDataAndNotifications();
  }, [notifications.newMessage]);

  function updateUsersDataAndNotifications(data) {
    setUsersData(prev => {
      let usersArray;

      if (data) {
        const uniqueUsers = new Map(data.map(user => [user.userId + user.chatId, user]));
        usersArray = Array.from(uniqueUsers.values());
      } else {
        usersArray = prev;
      }

      if (notifications) {
        const newMessageNotifications = notifications.newMessage.filter((n) => !n.isRead);

        usersArray = usersArray.map((user) => {
          const newMessageNotification = newMessageNotifications.find(
            (n) => n.senderId === user.userId
          );

          return {
            ...user,
            notification: {
              newMessage: !!newMessageNotification,
              newMessageNotificationId: newMessageNotification?._id,
            },
          };
        });
      }
      return usersArray;
    });
  }

  function markAsReadNotification(userBId) {
    handleReadNotification({ userId: userBId, type: 'newMessage' });
  }

  const setSelectedUserHandler = (update) => {
    setSelectedUser(prev => Object.assign({}, prev, update));
  };

  async function handleChatConnection() {
    const { userId: userBId, } = selectedUser;
    if (!userBId) return;

    const { data: { chatId } } = await postData('CHAT_ID', {
      baseURL: 'user',
      data: { userBId },
    });
    if (!chatId) {
      setSelectedUserHandler({ userId: null, chatLoaded: true, userBPicture: null });
      throw new Error('Chat ID is null or undefined');
    }
    setSelectedUserHandler({ chatId, chatLoaded: true });

    getMessagesByChatId(userBId, chatId);

    markAsReadNotification(userBId);

    if (socket && chatId) {
      socket.emit('joinChat', chatId);
    }
  }

  async function getMessagesByChatId(userBId, chatId) {
    if (!userBId || !chatId) {
      userBId = selectedUser.userId;
      chatId = selectedUser.chatId;
    }
    if (!usersData.every((msg) => msg.userId === userBId).messages) {
      const { data: { messages: fetchedMessages } } = await postData('GET_MESSAGES_BY_CHAT_ID', {
        baseURL: 'user',
        data: { chatId },
      });

      if (!fetchedMessages) throw new Error('Messages is null or undefined');

      setUsersData(prev => {
        return prev.map((user) =>
          user.userId === userBId
            ? {
              ...user,
              messages: [
                ...fetchedMessages.reverse(),  // Reverse the fetchedMessages to append the newest message at the end
                ...(user.messages || [])        // Ensure we keep existing messages in order
              ]
            }
            : user
        );
      });

    }
  }

  async function sendMessage(e) {
    e?.preventDefault();

    const messageContent = usersData.find(user => user.userId === selectedUser.userId)?.inboxInput;
    if (!messageContent || !selectedUser?.chatId) return;

    const messagePayload = {
      chatId: selectedUser.chatId,
      recipientId: selectedUser.userId,
      senderId: _id,
      senderUsername: username,
      content: messageContent,
      status: { sent: false, delivered: false, read: false },
    };

    try {
      if (socket?.connected) {
        socket.emit('sendMessage', messagePayload);
        // Clear input field
        setUsersData(prev =>
          prev.map(user =>
            user.userId === selectedUser.userId
              ? { ...user, inboxInput: '' }
              : user
          )
        );
      } else {
        console.error('Socket connection is unavailable.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (container.scrollTop === 0) {
      console.log('you reached the top');
      // loadMoreMessages(); // Trigger function to load more messages
    }
  };

  return (
    <div className="inbox_container d-flex h-100 w-100">
      <div className="users-pane border-end py-3">
        <h3 className='m-2'>{fullName}</h3>
        <ul className="list-unstyled">
          {usersData.map((user) => (
            <li
              key={user.userId}
              onClick={(e) => {
                e.preventDefault();
                setSelectedUserHandler({ userId: user.userId, userFullName: user?.fullName, userPicture: user?.profilePicture });
              }}
              className={`user-item p-2 ${user.notification.newMessage ? 'bg-primary-subtle' : ''} ${selectedUser.userId === user.userId ? 'bg-primary text-white' : ''}`}
            >
              {user.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="messages-pane flex-grow-1 ">
        <h3 className="header mt-3 mx-3 mb-0">{selectedUser?.userFullName ?? 'Messages'}</h3>
        {selectedUser ? (
          <div className="chat-container m-3 mt-0">
            <div
              ref={messagesContainerRef}
              className="messages hidden-scrollbar"
              onScroll={handleScroll}
            >
              {selectedUserData?.messages?.map((singleMsg, msgIndex) => (
                <div
                  key={`${msgIndex}`}
                  className={`message ${singleMsg.senderId === _id ? 'sent' : 'received'}`}
                >
                  <strong>
                    {singleMsg.senderId !== _id && '>>>'}
                    {singleMsg.content}
                    {singleMsg.senderId === _id && '<<<'}
                  </strong>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="input-container ">
              {messageContainer.newMessage && (
                <span role='button' className={`scroll-to-bottom`}
                  onClick={() => setMessageContainer(prev => ({ ...prev, isAtBottom: true }))}
                >
                  <img className='scroll-to-bottom-icon'
                    src={selectedUser?.profilePicture ?? defaultUserImg}
                    alt="avatar" />
                </span>
              )}
              <input
                className="message-input"
                type="text"
                value={selectedUserData?.inboxInput || ""}
                onChange={(e) => setUsersData(prev =>
                  prev.map(user =>
                    user.userId === selectedUser.userId
                      ? { ...user, inboxInput: e.target.value }
                      : user
                  )
                )}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    sendMessage();
                  }
                }}
                placeholder="Type a message..."
              />
              <button className="send-button" onClick={sendMessage}>
                Send
              </button>
            </div>
          </div>
        ) : (
          <p>Select a user to view messages.</p>
        )}
      </div>
    </div>
  );
};

export default Inbox;