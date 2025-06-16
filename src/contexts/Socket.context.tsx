import { post } from '@src/libs/apiConfig';
import { activeHost } from '@src/libs/apiEndpoints';
import {
  markAsRead,
  NotificationType,
  receiveNotification,
} from '@src/redux/reducers/notifications';
import { SocketContextType } from '@src/types/SocketContext.type';
import { useContext, createContext, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { io, Socket } from 'socket.io-client';

const WEBPUSH_PUBLIC_KEY = import.meta.env.VITE_WEBPUSH_PUBLICKEY;
const SocketContext = createContext<SocketContextType | null>(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const hasSubscribed = useRef(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const s = io(activeHost, {
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
    });

    socketRef.current = s;
    setSocket(s);

    s.on('connect', () => {
      console.log('Socket connected', s);
    });

    s.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    s.on('connect_error', (error) => {
      console.log('Socket connection error:', error.message);
    });

    s.on('socketError', (error) => {
      console.log('Socket error:', error);
    });

    s.on('newNotification', (notification) => {
      console.log('New message notification received:', notification);
      dispatch(receiveNotification(notification));
    });

    subscribeToPushNotifications();

    return () => {
      s.disconnect();
      socketRef.current = null;
      setSocket(null);
    };
  }, []);

  async function subscribeToPushNotifications() {
    if (hasSubscribed.current) return;

    const permissionGranted = await requestNotificationPermission();
    if (!permissionGranted) return;

    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.register('/service-worker.js', {
          scope: '/',
        });

        const existingSubscription = await registration.pushManager.getSubscription();
        if (existingSubscription) {
          await existingSubscription.unsubscribe();
        }

        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: WEBPUSH_PUBLIC_KEY,
        });

        await post('NOTIFICATION_SUBSCRIBE', {
          BASE_URLS: 'user',
          data: subscription,
        });

        hasSubscribed.current = true;
        console.log('Subscribed to push notifications');
      } catch (error) {
        console.error('Push notification subscription failed:', error);
      }
    }
  }

  function readNotification(notificationIds: string[], type: NotificationType) {
    if (socketRef.current) {
      socketRef.current.emit('readNotification', notificationIds);
      dispatch(markAsRead({ type, notificationIds }));
    }
  }

  async function requestNotificationPermission() {
    const permission = await Notification.requestPermission();
    console.log('Notification permission:', permission);
    return permission === 'granted';
  }

  return (
    <SocketContext.Provider value={{ socket, readNotification }}>{children}</SocketContext.Provider>
  );
};
