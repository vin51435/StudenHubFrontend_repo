import React, { createContext, useContext, ReactNode } from 'react';
import { notification } from 'antd';
import type { ArgsProps } from 'antd/es/notification';

interface NotifOptions {
  timeOut?: number;
  type?: 'success' | 'info' | 'warning' | 'error';
  key?: string;
}

interface NotificationContextType {
  notif: (header: string, message?: string | null, options?: NotifOptions) => string;
  startRemoveNotification: (key: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const notif = (
    header: string = 'Header',
    message?: string | null,
    options?: NotifOptions
  ): string => {
    const { timeOut = 5000, type = 'error', key = `notif_${Date.now()}` } = options || {};

    const config: ArgsProps = {
      message: header,
      description: message,
      duration: timeOut / 1000,
      key,
    };

    notification[type](config);

    return key;
  };

  const startRemoveNotification = (key: string) => {
    notification.destroy(key);
  };

  return (
    <NotificationContext.Provider value={{ notif, startRemoveNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

/* 
const { notif, startRemoveNotification } = useNotification();

const key = notif('Connecting...', 'Please wait', {
  type: 'info',
  timeOut: 0,
  key: 'connecting_server',
});

// Later, update it by calling notif again with the same key
setTimeout(() => {
  notif('Connected', 'You are now connected to the server.', {
    type: 'success',
    timeOut: 3000,
    key: 'connecting_server', // Same key, so it updates instead of creating new
  });
}, 5000);

setTimeout(() => {
  startRemoveNotification(key);
}, 5000);
 */
