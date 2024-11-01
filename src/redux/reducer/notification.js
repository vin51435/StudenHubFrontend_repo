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
      const { type, sendId } = action.payload;

      if (state.notifications[type]) {
        const existingIndex = state.notifications[type].findIndex(
          (notification) => notification.sendId === sendId
        );

        if (existingIndex !== -1) {
          state.notifications[type][existingIndex] = action.payload;
        } else {
          state.notifications[type].push(action.payload);
        }
      } else {
        state.notifications[type] = [action.payload];
      }
    },

    deleteNotification: (state, action) => {
      const { type, sendId } = action.payload;
      if (state.notifications[type]) {
        state.notifications[type] = state.notifications[type].filter(
          (notification) => notification.sendId !== sendId
        );
      }
    },

    markAsRead: (state, action) => {
      const { type, sendId } = action.payload;
      const notification = state.notifications[type]?.find(
        (notif) => notif.sendId === sendId
      );
      if (notification) {
        notification.isRead = true;
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
        const { type, sendId } = notification;

        if (state.notifications[type]) {
          const existingIndex = state.notifications[type].findIndex(
            (notif) => notif.sendId === sendId
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
