import { postData } from '@src/config/apiConfig';
import { getCookie } from '@src/utils/cookieGetterSetter';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';

const ChatComponent = () => {
  const [chatUserId, setchatUserId] = useState({ chatId: '', oppName: '' });
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState('');
  const [socket, setSocket] = useState(null); // Track socket instance in state
  const { isAuthenticated, user: { username, _id }, token } = useSelector(state => state.auth);

  useEffect(() => {
    const newSocket = io('http://192.168.0.155:3001', {
      auth: {
        token: getCookie('accessToken'),
      },
      transports: ['websocket'],
    });

    setSocket(newSocket);
    console.log('Socket created and connected');

    newSocket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    newSocket.on('error', (error) => {
      console.error('Socket Error:', error.message);
      if (error.statusCode === 401) {
        // Handle 401 errors (e.g., redirect to login page)
      }
    });

    newSocket.on('connect_error', (err) => {
      console.log(err.message); // not authorized
    });

    return () => {
      console.log('Cleaning up socket connection');
      newSocket.disconnect(); // Disconnect the socket
    };
  }, []);

  console.log(messages);

  const sendMessage = () => {
    if (!messageContent || !chatUserId.chatId) return; // Prevent sending empty messages or when no chatId

    const messageData = {
      chatId: chatUserId.chatId,
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

  const connect = () => {
    if (socket && !socket.connected) {
      socket.connect(); // Reconnect the socket
      console.log('Reconnected', socket.id);
    }
  };

  const disconnect = () => {
    if (socket) {
      socket.disconnect(); // Disconnect the socket manually
      console.log('Disconnected');
    }
  };

  const connectChat = async (e) => {
    e.preventDefault();
    setMessages([]); // Clear previous messages

    try {
      // Fetch the chat ID
      const response = await postData('CHAT_ID', {
        baseURL: 'user',
        data: { userBId: chatUserId.oppName }, // Correct data to send
      });

      const chatId = response?.data?.chatId; // Extract the chatId from response

      // Update chatUserId state with the new chatId
      setchatUserId((prev) => ({
        ...prev,
        chatId,
      }));

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

  return (
    <>
      <div className='mt-5 p-5 pt-5'>
        <div>
          <h3>{username} : {_id}</h3>
          <h5>{chatUserId.chatId}</h5>
          <input
            type='text'
            value={chatUserId.oppName}
            name='oppName'
            placeholder="Enter opponent's name"
            onChange={(e) =>
              setchatUserId((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }))
            }
          />
          <div>
            <button onClick={connectChat}>Connect to chat</button>
          </div>
        </div>
        <>
          <button onClick={connect}>Connect</button>
          <button onClick={disconnect}>Disconnect</button>
        </>
        <br />
        <input
          type='text'
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          placeholder='Type a message...'
        />
        <button onClick={sendMessage}>Send</button>
        <div className='messages'>
          {messages.map((msg, index) => (
            <div key={index} className={`${msg.senderId === _id ? 'text-end' : ''}`}>
              <strong>{msg.content}</strong>
            </div>
          ))}
        </div>
      </div>
      <div>
      </div>
    </>
  );
};

export default ChatComponent;
