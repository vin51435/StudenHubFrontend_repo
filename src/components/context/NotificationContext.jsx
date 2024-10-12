import React, { createContext, useContext, useState } from 'react';

// Create Notification Context
const NotificationContext = createContext();

// Custom hook to use the NotificationContext
export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Function to trigger a notification
  const notif = (header, message, { timeOut = 1000, type = 'error' }) => {
    const id = Date.now(); // Unique ID for each notification

    setNotifications((prev) => {
      // Create new notification object
      const newNotification = { id, header, message, removing: false, type };

      // If there are already 3 notifications, slide out the top one
      if (prev.length >= 3) {
        startRemoveNotification(prev[0].id); // Slide out the oldest notification
      }

      // Add the new notification to the stack
      return [...prev, newNotification];
    });

    // Auto hide after 3 seconds
    setTimeout(() => {
      startRemoveNotification(id);
    }, timeOut !== 0 ? timeOut : 2147483647); // 2^31-1, approx. 24.8 days

    return id; // This allows the caller to manage the notification's lifecycle
  };

  // Function to start removing the notification with a fade out
  const startRemoveNotification = (id, timeOut = 1000) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, removing: true } : notif))
    );

    // Complete removal after fade-out animation
    setTimeout(() => {
      removeNotification(id);
    }, timeOut); // Match this with CSS fade-out duration
  };

  // Function to manually remove a notification
  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notif, startRemoveNotification }}>
      {children}
      <div className="notification-container">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`notification ${notification.removing ? 'slide-out' : ''}`}
          >
            <div className="notification-header">
              {notification.header}
            </div>
            <div className="notification-message">{notification.message}</div>
            <button onClick={() => startRemoveNotification(notification.id, 0)} className="close-btn">×</button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};
