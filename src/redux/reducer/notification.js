import { createSlice } from '@reduxjs/toolkit';

// Initial state with separated notification types
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
    // Action to receive and add a new notification of a specific type
    receiveNotification: (state, action) => {
      const { type, payload } = action.payload; 
      if (state.notifications[type]) {
        state.notifications[type].push({
          ...payload,
          read: false, // default read status
        });
      }
    },

    // Action to delete a notification by its type and index
    deleteNotification: (state, action) => {
      const { type, index } = action.payload; 
      if (state.notifications[type]) {
        state.notifications[type].splice(index, 1);
      }
    },

    // Action to mark a notification as read
    markAsRead: (state, action) => {
      const { type, index } = action.payload; 
      const notification = state.notifications[type]?.[index];
      if (notification) {
        notification.read = true;
      }
    },

    // Action to clear all notifications of a specific type
    clearNotifications: (state, action) => {
      const { type } = action.payload; 
      if (state.notifications[type]) {
        state.notifications[type] = [];
      }
    },
  },
});

// Export actions for use in components
export const {
  receiveNotification,
  deleteNotification,
  markAsRead,
  clearNotifications,
} = notificationSlice.actions;

// Export the reducer to be used in the store
export default notificationSlice.reducer;
