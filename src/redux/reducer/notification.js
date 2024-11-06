import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: {
    newChat: [],
    newMessage: [],
  },
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    receiveNotification: (state, action) => {
      const { type, _id } = action.payload;
      const notifications = state.notifications[type] || [];
      const existingIndex = notifications.findIndex(notification => notification._id === _id);

      if (existingIndex !== -1) {
        notifications[existingIndex] = action.payload;
      } else {
        notifications.unshift(action.payload);
      }
      state.notifications[type] = notifications;
    },

    deleteNotification: (state, action) => {
      const { type, userId, notificationId } = action.payload;

      if (!state.notifications[type]) return;

      state.notifications[type] = state.notifications[type].filter((notification) => {
        switch (type) {
          case 'newMessage':
            // Delete all notifications with matching senderId for type 'newMessage'
            return notification.senderId !== userId;

          default:
            // Delete specific notification by notificationId for other types
            return notification._id !== notificationId;
        }
      });
    },

    markAsRead: (state, action) => {
      const { type, notificationId, userId } = action.payload;
      const notifications = state.notifications[type];

      if (!notifications) {
        return;
      }

      switch (type) {
        case 'newMessage':
          // Mark all notifications with matching senderId as read
          notifications.forEach((notification) => {
            if (notification.senderId === userId) {
              notification.isRead = true;
            }
          });
          break;

        default:
          // Mark a single notification as read using notificationId
          const notificationToUpdate = notifications.find(
            (notification) => notification._id === notificationId
          );
          if (notificationToUpdate) {
            notificationToUpdate.isRead = true;
          }
          break;
      }
    },

    clearNotifications: (state, action) => {
      const { type } = action.payload || {};
      if (type && state.notifications[type]) {
        state.notifications[type] = [];
      } else {
        Object.keys(state.notifications).forEach((key) => {
          state.notifications[key] = [];
        });
      }
    },

    loadNotifications: (state, action) => {
      const notificationsArray = action.payload;

      Object.keys(state.notifications).forEach((key) => {
        state.notifications[key] = [];
      });

      notificationsArray.forEach((notification) => {
        const { type, _id } = notification;

        if (state.notifications[type]) {
          const existingIndex = state.notifications[type].findIndex(
            (notif) => notif._id === _id
          );

          if (existingIndex !== -1) {
            state.notifications[type][existingIndex] = notification;
          } else {
            state.notifications[type].push(notification);
          }
        } else {
          state.notifications[type] = [notification];
        }
      });
    },
  },
});

export const {
  receiveNotification,
  deleteNotification,
  markAsRead,
  clearNotifications,
  loadNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
