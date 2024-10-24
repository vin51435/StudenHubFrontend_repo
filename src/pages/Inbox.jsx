import { postData } from '@src/config/apiConfig';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const Inbox = () => {
  const [usersData, setUsersData] = useState([]);
  const { isAuthenticated, user, token } = useSelector(state => state.auth);
  const { username, _id, chats: userChats } = user;

  const dummyUsersData = [
    { userId: 1, name: 'Alice' },
    { userId: 2, name: 'Bob' },
    { userId: 3, name: 'Charlie' },
    { userId: 4, name: 'David' },
  ];

  const messagesData = {
    1: [{ sender: 'Alice', text: 'Hi there!' }, { sender: 'You', text: 'Hello!' }],
    2: [{ sender: 'Bob', text: 'How are you?' }, { sender: 'You', text: 'I’m good, thanks!' }],
    3: [{ sender: 'Charlie', text: 'What’s up?' }, { sender: 'You', text: 'Not much, you?' }],
    4: [{ sender: 'David', text: 'Let’s catch up soon!' }, { sender: 'You', text: 'Definitely!' }],
  };

  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleUserClick = (userId) => {
    setSelectedUserId(userId);
  };

  useEffect(() => {
    if (userChats?.chatIds) {
      postData('GET_INBOX_PARTICIPANTS', {
        baseURL: 'user',
        data: { chatIds: userChats.chatIds },
      }).
        then(response => {
          console.log(response);
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

  console.log(usersData);

  return (
    <div className="d-flex h-100 w-100">
      <div className="users-pane border-end p-3">
        <h3>Users</h3>
        <ul className="list-unstyled">
          {usersData.map((user) => (
            <li
              key={user.userId}
              onClick={() => handleUserClick(user.userId)}
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
            {messagesData[selectedUserId]?.map((message, index) => (
              <div key={index} className="message">
                <strong>{message.sender}: </strong>
                <span>{message.text}</span>
              </div>
            ))}
          </div>
        ) : (
          <p>Select a user to view messages.</p>
        )}
      </div>
    </div>
  );
};

export default Inbox;