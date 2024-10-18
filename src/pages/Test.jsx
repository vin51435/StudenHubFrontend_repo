import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001'); // Backend URL

function Test() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function receiveMessage(obj) {
      setChat((prevChat) => [...prevChat, obj.text]);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('receiveMessage', receiveMessage);
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('receiveMessage', receiveMessage);
    };
  }, []);
  const sendMessage = (e) => {
    e.preventDefault();
    socket.emit('sendMessage', message);
    setMessage('');
  };

  function connect() {
    socket.connect();
  }

  function disconnect() {
    socket.disconnect();
  }

  return (
    <div className='mt-5 pt-5'>
      <p>State: {'' + isConnected}</p>
      <ul>
        {chat.map((msg, idx) => (
          <p key={idx}>{msg}</p>
        ))}
      </ul>
      <>
        <button onClick={connect}>Connect</button>
        <button onClick={disconnect}>Disconnect</button>
      </>
      <form>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </form>
    </div>
  );
}

export default Test;