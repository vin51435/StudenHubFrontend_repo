import { useSocket } from '@src/context/SocketContext';
import { postData } from '@src/config/apiConfig';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

const Inbox = () => {
  const [selectedUser, setSelectedUser] = useState({ userId: null, chatId: null });
  const [usersData, setUsersData] = useState([]);
  const { notifications } = useSelector(state => state.notification);
  const { isAuthenticated, user, token } = useSelector(state => state.auth);
  const location = useLocation();
  const { socket, handleReadNotification } = useSocket();
  const { username, _id, chats } = user;

  useEffect(() => {
    if (!socket) return;
    const handleNewMessage = (newMessage) => {
      if (!selectedUser?.userId || !selectedUser?.chatId) return;

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

    return () => {
      socket.off('receiveMessage', handleNewMessage);
    };
  }, [socket, selectedUser]);

  useEffect(() => {
    if (chats?.chatIds) {
      postData('GET_INBOX_PARTICIPANTS', {
        baseURL: 'user',
        data: { chatIds: chats.chatIds },
      })
        .then(response => {
          const userB = response.data.map(
            ({ chatId, secondParticipant: { _id, firstName, lastName, username } }) => ({
              chatId,
              userId: _id,
              firstName,
              lastName,
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
  }, [location.pathname, user]);

  useEffect(() => {
    updateUsersDataAndNotifications();
  }, [notifications]);


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

  async function handleChatConnection(event, userBId) {
    event.preventDefault();

    const { data: { chatId } } = await postData('CHAT_ID', {
      baseURL: 'user',
      data: { userBId },
    });
    if (!chatId) {
      throw new Error('Chat ID is null or undefined');
    }
    const userB = { userBId, chatId };
    setSelectedUser({ userId: userB.userBId, chatId });

    if (!usersData.every((msg) => msg.userId === userB.userBId).messages) {
      const { data: { messages: fetchedMessages } } = await postData('MESSAGES', {
        baseURL: 'user',
        data: { chatId },
      });

      if (!fetchedMessages) throw new Error('Messages is null or undefined');

      setUsersData(prev => {
        return prev.map((user) =>
          user.userId === userB.userBId
            ? { ...user, messages: fetchedMessages }
            : user
        );
      });

      markAsReadNotification(userBId);
    }

    if (socket && chatId) {
      socket.emit('joinChat', chatId);
    }
  }

  async function sendMessage(e) {
    e.preventDefault();

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

  return (
    <div className="inbox_container d-flex h-100 w-100">
      <div className="users-pane border-end py-3">
        <h3>Users</h3>
        <ul className="list-unstyled">
          {usersData.map((user) => (
            <li
              key={user.userId}
              onClick={(e) => {
                handleChatConnection(e, user.userId);
              }}
              className={`user-item p-2 ${user.notification.newMessage ? 'bg-primary-subtle' : ''} ${selectedUser.userId === user.userId ? 'bg-primary text-white' : ''}`}
            >
              {user.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="messages-pane flex-grow-1 p-3">
        <h3>Messages</h3>
        {selectedUser ? (
          <div>
            <div className='messages'>
              {usersData.find(user => user.userId === selectedUser.userId)?.messages?.map((singleMsg, msgIndex) => (
                <div key={`${msgIndex}`} className={`${singleMsg.senderId === _id ? 'text-end' : ''}`}>
                  <strong>
                    {singleMsg.senderId !== _id && '>>>'}
                    {singleMsg.content}
                    {singleMsg.senderId === _id && '<<<'}
                  </strong>
                </div>
              ))}
            </div>
            <div>
              <input
                type='text'
                value={usersData.find(user => user.userId === selectedUser.userId)?.inboxInput || ""}
                onChange={(e) => setUsersData(prev =>
                  prev.map(user =>
                    user.userId === selectedUser.userId
                      ? { ...user, inboxInput: e.target.value }
                      : user
                  )
                )}
                placeholder='Type a message...'
              />
              <button role='submit' onClick={sendMessage}>Send</button>
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