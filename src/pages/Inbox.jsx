import { useSocket } from '@src/components/context/SocketContext';
import { postData } from '@src/config/apiConfig';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const Inbox = () => {
  const [usersData, setUsersData] = useState([]);
  const { isAuthenticated, user, token } = useSelector(state => state.auth);
  const { username, _id, chats } = user;
  const [selectedUserId, setSelectedUserId] = useState({ user: null, chatId: null });
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState('');
  const socket = useSocket();

  const dummyUsersData = [
    { userId: 1, name: 'Alice' },
    { userId: 2, name: 'Bob' },
    { userId: 3, name: 'Charlie' },
    { userId: 4, name: 'David' },
  ];

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    socket.on('receiveMessage', handleMessage);

    return () => {
      socket.off('receiveMessage', handleMessage);
    };
  }, [socket]);

  useEffect(() => {
    console.log('useEffrect ran ', user);
    if (chats?.chatIds) {
      postData('GET_INBOX_PARTICIPANTS', {
        baseURL: 'user',
        data: { chatIds: chats.chatIds },
      }).
        then(response => {
          const data = response.data.map(ele => ({
            chatId: ele.chatId,
            userId: ele.secondParticipant?._id,
            firstName: ele.secondParticipant?.firstName,
            lastName: ele.secondParticipant?.lastName,
            name: `${ele.secondParticipant?.firstName} ${ele.secondParticipant?.lastName}`,
            username: ele.secondParticipant?.username,
          }));

          setUsersData([...dummyUsersData, ...data]);
        })
        .catch(err => console.log(err));

    }
  }, []);

  const connectChat = async (e, userBId) => {
    e.preventDefault();
    setMessages([]); // Clear previous messages

    try {
      // Fetch the chat ID
      const response = await postData('CHAT_ID', {
        baseURL: 'user',
        data: { userBId },
      });

      const { chatId, userB } = response?.data; // Extract the chatId from response
      console.log(response);
      setSelectedUserId({ user: userB._id, chatId });

      // Fetch messages for the chatId
      const messagesResponse = await postData('MESSAGES', {
        baseURL: 'user',
        data: { chatId },
      });

      console.log(messagesResponse);

      const { messages } = messagesResponse.data;

      // Update messages state
      setMessages((prevMessages) => [...prevMessages, ...messages]);

      // Join the chat room on the server
      if (socket && chatId) {
        console.log('Joining chat:', chatId);
        socket.emit('joinChat', chatId);
      }

    } catch (err) {
      console.error('Unforeseen error:', err);
    }
  };

  const sendMessage = () => {
    if (!messageContent || !selectedUserId.chatId) return; // Prevent sending empty messages or when no chatId

    const messageData = {
      chatId: selectedUserId.chatId,
      recipientId: selectedUserId.user,
      senderId: _id,
      senderUsername: username,
      content: messageContent,
      status: { sent: false, delivered: false, read: false }
    };

    if (socket && socket.connected) {
      socket.emit('sendMessage', messageData); // Emit the message to the server
      setMessageContent(''); // Clear the input field
    } else {
      console.error('Socket not connected.');
    }
  };

  console.log(messages);

  return (
    <div className="d-flex h-100 w-100">
      <div className="users-pane border-end p-3">
        <h3>Users</h3>
        <ul className="list-unstyled">
          {usersData.map((user) => (
            <li
              key={user.userId}
              onClick={(e) => {
                connectChat(e, user.userId);
              }}
              className={`user-item p-2 ${selectedUserId === user.userId ? 'active' : ''}`}
            >
              {user.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="messages-pane flex-grow-1 p-3">
        <h3>Messages</h3>
        {selectedUserId ? (
          <div>
            <div className='messages'>
              {messages.map((msg, index) => (
                <div key={index} className={`${msg.senderId === _id ? 'text-end' : ''}`}>
                  <strong>{msg.senderId !== _id && '>>>'}{msg.content}{msg.senderId === _id && '<<<'}</strong>
                </div>
              ))}
            </div>
            <div>
              <input
                type='text'
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder='Type a message...'
              />
              <button onClick={sendMessage}>Send</button>
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