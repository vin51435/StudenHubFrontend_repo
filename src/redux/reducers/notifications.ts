import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type NotificationType = 'newChat' | 'newMessage' | string;

interface Notification {
  _id: string;
  type: NotificationType;
  senderId?: string;
  isRead?: boolean;
  [key: string]: unknown;
}

interface NotificationState {
  notifications: {
    [key: string]: Notification[];
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
    receiveNotification: (state, action: PayloadAction<Notification>) => {
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
        type: NotificationType;
        userId?: string;
        notificationId?: string;
      }>,
    ) => {
      const { type, userId, notificationId } = action.payload;
      if (!state.notifications[type]) return;

      state.notifications[type] = state.notifications[type].filter(
        (notification) => {
          if (type === 'newMessage') {
            return notification.senderId !== userId;
          } else {
            return notification._id !== notificationId;
          }
        },
      );
    },

    markAsRead: (
      state,
      action: PayloadAction<{
        type: NotificationType;
        userId?: string;
        notificationId?: string | null;
      }>,
    ) => {
      const { type, userId, notificationId } = action.payload;
      const notifications = state.notifications[type];
      if (!notifications) return;

      if (type === 'newMessage' && userId) {
        notifications.forEach((notif) => {
          if (notif.senderId === userId) notif.isRead = true;
        });
      } else if (notificationId) {
        const notificationToUpdate = notifications.find(
          (n) => n._id === notificationId,
        );
        if (notificationToUpdate) notificationToUpdate.isRead = true;
      }
    },

    clearNotifications: (
      state,
      action: PayloadAction<{ type?: NotificationType }>,
    ) => {
      const { type } = action.payload || {};
      if (type && state.notifications[type]) {
        state.notifications[type] = [];
      } else {
        Object.keys(state.notifications).forEach((key) => {
          state.notifications[key] = [];
        });
      }
    },

    loadNotifications: (state, action: PayloadAction<Notification[]>) => {
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

