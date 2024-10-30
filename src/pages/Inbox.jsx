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
      console.log('receiveMessage', message);
      setMessages((prevMessages) => {
        // Find the index of the object with the matching user ID
        const index = prevMessages.findIndex(
          (msg) => msg.user === selectedUserId.user
        );

        // If no matching user is found, return the array unchanged
        if (index === -1) {
          // Optionally, you can create a new entry if the user is not found
          return [
            ...prevMessages,
            {
              user: selectedUserId.user,
              chatId: selectedUserId.chatId,
              messages: [message], // Initialize messages array with the new message
            },
          ];
        }

        // Create a shallow copy of the array and update the `messages` field for the specific object
        const updatedMessages = [...prevMessages];
        updatedMessages[index] = {
          ...updatedMessages[index],
          messages: [
            ...updatedMessages[index].messages,
            message,
          ],
        };

        return updatedMessages;
      });
    };

    socket.on('receiveMessage', handleMessage);

    return () => {
      socket.off('receiveMessage', handleMessage);
    };
  }, [socket, selectedUserId]);
  ;

  useEffect(() => {
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

    try {
      // Fetch the chat ID
      const chatIdResponse = await postData('CHAT_ID', {
        baseURL: 'user',
        data: { userBId },
      });
      console.log('chatId:', chatIdResponse);

      const { chatId, userB } = chatIdResponse?.data;
      const newUser = { user: userB._id, chatId };

      // Set the selected user ID and chat ID
      setSelectedUserId(newUser);

      // Check if messages for this user are not already in the state
      if (messages.every((msg) => msg.user !== newUser.user)) {
        // Fetch messages for the chat ID
        const messagesResponse = await postData('MESSAGES', {
          baseURL: 'user',
          data: { chatId },
        });
        console.log('response Message:', messagesResponse);

        const { messages: fetchedMessages } = messagesResponse.data;

        // Update messages state
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            user: newUser.user,
            chatId: newUser.chatId,
            messages: fetchedMessages,
          },
        ]);
      }

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

    console.log('socket from sendmessage', socket);
    if (socket && socket.connected) {
      console.log('message send');
      socket.emit('sendMessage', messageData); // Emit the message to the server
      setMessageContent(''); // Clear the input field
    } else {
      console.error('Socket not connected.');
    }
  };

  console.log('messages', messages);
  console.log('setSelectedUserId', selectedUserId);

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
              className={`user-item p-2 ${selectedUserId.user === user.userId ? 'bg-primary-subtle' : ''}`}
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
              {messages
                .filter((msg) => msg.user === selectedUserId.user)
                .map((msg, index) =>
                  msg.messages.map((singleMsg, msgIndex) => (
                    <div key={`${index}-${msgIndex}`} className={`${singleMsg.senderId === _id ? 'text-end' : ''}`}>
                      <strong>
                        {singleMsg.senderId !== _id && '>>>'}
                        {singleMsg.content}
                        {singleMsg.senderId === _id && '<<<'}
                      </strong>
                    </div>
                  ))
                )}
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