import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { INotif, INotifType } from '@src/types/app';

interface NotificationState {
  notifications: {
    [key in INotifType]: INotif[];
  };
}

const initialState: NotificationState = {
  notifications: {
    newChat: [],
    newMessage: [],
  },
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    receiveNotification: (state, action: PayloadAction<INotif>) => {
      const { type, _id } = action.payload;
      const existing = state.notifications[type] || [];
      const existingIndex = existing.findIndex((n) => n._id === _id);

      if (existingIndex !== -1) {
        existing[existingIndex] = action.payload;
      } else {
        existing.unshift(action.payload);
      }

      state.notifications[type] = existing;
    },

    deleteNotification: (
      state,
      action: PayloadAction<{
        type: INotifType;
        notificationIds: string[];
      }>
    ) => {
      console.log('DELETE NOTIFICATION', action.payload);
      const { type, notificationIds } = action.payload;
      if (!state.notifications[type].length) return;

      const updatedNotifications = state.notifications[type].filter((notification) => {
        return !notificationIds.includes(notification._id);
      });
      return { ...state, notifications: { ...state.notifications, [type]: updatedNotifications } };
    },

    markAsRead: (
      state,
      action: PayloadAction<{
        type: INotifType;
        notificationIds: string[];
      }>
    ) => {
      const { type, notificationIds } = action.payload;
      const notifications = state.notifications[type];
      if (!notifications || !notificationIds) return;

      if (type === 'newMessage' && notificationIds) {
        const updatedNotifications = notifications.map((n) => {
          if (notificationIds.includes(n._id)) {
            return { ...n, isRead: true };
          }
          return n;
        });
        return {
          ...state,
          notifications: { ...state.notifications, [type]: updatedNotifications },
        };
      }
      return state;
    },

    clearNotifications: (state, action: PayloadAction<{ type?: INotifType }>) => {
      const { type } = action.payload || {};
      if (type && state.notifications[type]) {
        state.notifications[type] = [];
      } else {
        Object.keys(state.notifications).forEach((key) => {
          state.notifications[key] = [];
        });
      }
    },

    loadNotifications: (state, action: PayloadAction<INotif[]>) => {
      const notificationsArray = action.payload;

      // Reset existing
      Object.keys(state.notifications).forEach((key) => {
        state.notifications[key] = [];
      });

      notificationsArray?.forEach((notification) => {
        const { type, _id } = notification;
        const existingList = state.notifications[type] || [];

        const existingIndex = existingList.findIndex((n) => n._id === _id);
        if (existingIndex !== -1) {
          existingList[existingIndex] = notification;
        } else {
          existingList.push(notification);
        }

        state.notifications[type] = existingList;
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

const notificationReducer = notificationSlice.reducer;
export default notificationReducer;
