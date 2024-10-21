import React, { useState } from 'react';

const Inbox = () => {
  const usersData = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' },
    { id: 4, name: 'David' },
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

  return (
    <div className="d-flex h-100 w-100">
      <div className="users-pane border-end p-3">
        <h3>Users</h3>
        <ul className="list-unstyled">
          {usersData.map((user) => (
            <li
              key={user.id}
              onClick={() => handleUserClick(user.id)}
              className={`user-item p-2 ${selectedUserId === user.id ? 'active' : ''}`}
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