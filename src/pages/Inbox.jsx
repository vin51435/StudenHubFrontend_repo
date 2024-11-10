import { useSocket } from '@src/context/SocketContext';
import { postData } from '@src/config/apiConfig';
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import defaultUserImg from '@src/assets/svg/default-user.svg';

const Inbox = () => {
  const [selectedUser, setSelectedUser] = useState({ userId: null, chatId: null, chatLoaded: false, userFullName: null, userPicture: null });
  const [usersData, setUsersData] = useState([]);
  const [messageContainer, setMessageContainer] = useState({ isAtBottom: null, newMessage: false, scrollHeight: null });
  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const { notifications } = useSelector(state => state.notification);
  const { user } = useSelector(state => state.auth);
  const location = useLocation();
  const { socket, handleReadNotification } = useSocket();
  const { username, _id, chats, fullName } = user;

  // IntersectionObserver callback to detect visibility of the last message
  const observerCallback = (entries) => {
    const entry = entries[0];
    setMessageContainer(prev => {
      return ({ ...prev, isAtBottom: entry.isIntersecting, });
    });
  };

  const selectedUserData = useMemo(() => usersData.find((user) => user.userId === selectedUser.userId), [selectedUser.userId, usersData]);

  const scrollToBottom = () => {
    messagesEndRef?.current.scrollIntoView();
    // setMessageContainer(prev => {
    //   return ({ ...prev, newMessage: false });
    // });
  };

  useLayoutEffect(() => {
    const container = messagesContainerRef.current;
    if (!messageContainer.scrollHeight && messagesEndRef.current && (messageContainer.isAtBottom)) {
      scrollToBottom();
    }
    if (messageContainer.scrollHeight && container) {
      if (!messageContainer.isAtBottom) {
        const newScrollHeight = container.scrollHeight;
        container.scrollTop = newScrollHeight - messageContainer.scrollHeight;
      }
      setMessageContainer(prev => {
        return ({ ...prev, scrollHeight: null });
      });
    }
  }, [messageContainer.isAtBottom]);

  useLayoutEffect(() => {
    if (selectedUserData?.messages?.length > 0 && !messageContainer.scrollHeight) {
      scrollToBottom();
    }
  }, [selectedUserData?.messages]);

  useEffect(() => {

    setMessageContainer({ isAtBottom: null, newMessage: false, scrollHeight: null });
    handleChatConnection();

    // Set up IntersectionObserver to observe the last message
    const observer = new IntersectionObserver(observerCallback, {
      root: null, // observe relative to the viewport
      threshold: 1.0, // trigger when the whole element is in view
    });

    if (messagesEndRef.current) {
      observer.observe(messagesEndRef.current);
    }

    return () => {

      if (messagesEndRef.current) {
        observer.unobserve(messagesEndRef.current);
      }
    };
  }, [selectedUser.userId]);

  useEffect(() => {
    if (!socket) return;
    const handleNewMessage = (newMessage) => {
      if (_id === newMessage.senderId) return;
      if (!selectedUser?.userId || !selectedUser?.chatId) return;
      // if (!messageContainer.isAtBottom) {
      //   setMessageContainer(prev => {
      //     return ({ ...prev, newMessage: true });
      //   });
      // }
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
    socket.on('receiveMessage', handleNewMessage);

    const chatId = selectedUser.chatId;
    if (socket && chatId) {
      socket.emit('joinChat', chatId);
    }
    return () => {
      socket.off('receiveMessage', handleNewMessage);
      if (socket && selectedUser.chatId) {
        socket.emit('leaveChat', selectedUser.chatId); // Always use the latest chatId from selectedUser
      }
    };
  }, [selectedUser.chatId]);

  useEffect(() => {
    // Get all chat participants
    // !When the newChat is received set desired state
    const chatIdsArr = [...notifications.newChat.map(chat => chat.relatedChatId), ...chats?.chatIds];
    if (chatIdsArr) {
      postData('GET_INBOX_PARTICIPANTS', {
        baseURL: 'user',
        data: { chatIds: chatIdsArr },
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
  }, [location.pathname === '/inbox', notifications.newChat.length]);

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

    postData('CHAT_ID', {
      baseURL: 'user',
      data: { userBId },
    })
      .then(({ data: { chatId } }) => {
        if (!chatId) {
          setSelectedUserHandler({ userId: null, chatLoaded: true, userBPicture: null });
          throw new Error('Chat ID is null or undefined');
        }
        setSelectedUserHandler({ chatId, chatLoaded: true });
        return chatId;
      })
      .then((chatId) => {
        getMessagesByChatId(chatId);
        markAsReadNotification(userBId);

      });
  }

  async function getMessagesByChatId(chatIdPara) {
    if (selectedUserData?.hasReachedEndOfConversation) return;

    const userBId = selectedUser.userId;
    const chatId = chatIdPara ?? selectedUser.chatId;

    let oldestMessageDate = selectedUserData?.oldestMessageDate ?? null;
    let hasReachedEndOfConversation = false;

    const { data: { messages: fetchedMessages, oldestMessageDate: newOldestMessageDate }, results } = await postData('GET_MESSAGES_BY_CHAT_ID', {
      baseURL: 'user',
      data: { chatId, oldestMessageDate },
    });

    if (results === 0) {
      hasReachedEndOfConversation = true;
    };
    if (!fetchedMessages) throw new Error('Messages is null or undefined');

    setUsersData(prev =>
      prev.map(user => {
        if (user.userId !== userBId) return user;

        const combinedMessages = [
          ...(user.messages || []),
          ...fetchedMessages.filter(
            newMessage =>
              !(user.messages || []).some(
                existingMessage => existingMessage._id === newMessage._id
              )
          )
        ];

        return {
          ...user,
          hasReachedEndOfConversation,
          oldestMessageDate: newOldestMessageDate,
          messages: combinedMessages.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          )
        };
      })
    );
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
      createdAt: new Date().toISOString(),
    };

    setUsersData(prev =>
      prev.map(user =>
        user.userId === selectedUser.userId
          ? {
            ...user,
            inboxInput: '',
            messages: [...(user.messages || []), messagePayload],
          }
          : user
      )
    );
    // if (!messageContainer.isAtBottom) {
    // setMessageContainer(prev => {
    //   const updated = ({ ...prev, newMessage: true });
    //   console.log('handlemessage isAtbottomnewMessage', updated);
    //   return updated;
    // });
    // }
    try {
      if (socket?.connected) {
        socket.emit('sendMessage', messagePayload);
      } else {
        console.error('Socket connection is unavailable.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  const handleScroll = () => {
    const containerElement = messagesContainerRef.current;
    if (!containerElement) return;

    const { scrollTop, scrollHeight } = containerElement;

    if (scrollTop === 0) {
      setMessageContainer((prevState) => {

        const updated = {
          ...prevState,
          scrollHeight,
        };
        return updated;
      });
      getMessagesByChatId();
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
        {(selectedUser.userId) ? (
          <>
            <div className={`${selectedUserData?.messages ? '' : 'd-none'} chat-container m-3 mt-0`}>
              <div
                ref={messagesContainerRef}
                className="messages thin-scrollbar"
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
                <div className='messagesEndRef' ref={messagesEndRef} />
                {!messageContainer.isAtBottom && (
                  <span role='button' className={`scroll-to-bottom`}
                    onClick={() => scrollToBottom()}
                  >
                    <img className='scroll-to-bottom-icon'
                      src={selectedUser?.profilePicture ?? defaultUserImg}
                      alt="avatar" />
                  </span>
                )}
              </div>

              <div className="input-container ">
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
            <div className={`${!selectedUserData?.messages ? '' : 'd-none'} chat-loading`}>
              {
                Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className={`bubble placeholder ${i % 2 === 0 ? 'received' : 'sent'}`}
                  ></div>
                ))
              }
            </div>
          </>
        ) : (
          <p className='mt-auto p-3 text-center'>Select a user to view messages.</p>
        )}
      </div>
    </div>
  );
};

export default Inbox;