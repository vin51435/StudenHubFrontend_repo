import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const Notifications = () => {
  const [notificationData, setNotificationData] = useState({ unread: 0 });
  const { notifications } = useSelector(state => state.notification);

  useEffect(() => {
    console.log(Object.entries(notifications));
  }, [notifications]);

  return (
    <div>
      <h2>Number of unread notifications: {
        Object.values(notifications).reduce((count, value) => {
          return count + value.reduce((subCount, ele) => subCount + (ele?.isRead ? 0 : 1), 0);
        }, 0)
      }
      </h2>
      <div>
        {Object.entries(notifications).map(([key, value]) => {
          if (value.length > 0) {
            return (
              <div key={key} className='p-1 m-1 border'>
                <h5>{key}</h5>
                {value.map((item) => (
                  <p key={item._id}>
                    {`${item?.content}`}
                  </p>
                ))}
              </div>
            );
          }
        })}

      </div>
    </div>
  );
};

export default Notifications;