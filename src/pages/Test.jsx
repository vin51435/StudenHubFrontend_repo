import { generateChatId } from '@src/utils';
import { getCookie } from '@src/utils/cookieGetterSetter';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';

const ChatComponent = () => {
  const [chatUserID, setChatUserID] = useState({ chatId: '', oppName: '' });
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState('');
  const [socket, setSocket] = useState(null); // Track socket instance in state
  const { isAuthenticated, user: { username }, token } = useSelector(state => state.auth);

  useEffect(() => {
    const newSocket = io('http://192.168.0.155:3001', {
      auth: {
        token: getCookie('accessToken')
      },
      transports: ['websocket']
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
      console.log(err.data);
      console.log(err);
    });

    return () => {
      console.log('Cleaning up socket connection');
      newSocket.disconnect(); // Disconnect the socket
    };
  }, []);

  const sendMessage = () => {
    if (!messageContent) return; // Prevent empty messages

    const messageData = {
      chatId: chatUserID.chatId,
      senderId: username,
      content: messageContent,
    };

    // Emit the message to the server
    socket.emit('sendMessage', messageData);
    setMessageContent(''); // Clear input field
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

  return (
    <div className='mt-5 p-5 pt-5'>
      <div>
        <h3>{username}</h3>
        <h5>{chatUserID.chatId}</h5>
        <input
          type='text'
          value={chatUserID.oppName}
          name='oppName'
          onChange={(e) => setChatUserID(prev => ({ ...prev, [e.target.name]: e.target.value }))}
        />
        <div>
          <button onClick={(e) => {
            e.preventDefault();
            setMessages([]);
            setChatUserID(prev => {
              const id = generateChatId(username, prev.oppName);
              if (socket) {
                console.log('Joining chat:', id);
                socket.emit('joinChat', id);
              }
              return { ...prev, chatId: id };
            });
          }}>Connect to chat</button>
        </div>
      </div>
      <>
        <button onClick={connect}>Connect</button>
        <button onClick={disconnect}>Disconnect</button>
      </>
      <br />
      <input
        type="text"
        value={messageContent}
        onChange={(e) => setMessageContent(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.sendUsername}: </strong> {msg.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatComponent;
