import { post } from "@src/libs/apiConfig";
import { activeHost } from "@src/libs/apiEndpoints";
import { markAsRead, receiveNotification } from "@src/redux/reducers/notifications";
import { HandleReadNotificationType, SocketContextType } from "@src/types/SocketContext.type";
import { useContext, createContext, useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { io, Socket } from "socket.io-client";

const WEBPUSH_PUBLIC_KEY = import.meta.env.VITE_WEBPUSH_PUBLICKEY;
const SocketContext = createContext<SocketContextType | null>(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socketRef = useRef<Socket | null>(null);
  const hasSubscribed = useRef(false); // Track whether we have subscribed to notifications
  const dispatch = useDispatch();

  useEffect(() => {
    connectToSocket();
    subscribeToPushNotifications();

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, []);

  function connectToSocket() {
    if (!socketRef.current) {
      const socket = io(activeHost, {
        transports: ['websocket'],
      });

      socket.on("newNotification", (notification) => {
        console.log('New message notification received:', notification);
        dispatch(receiveNotification(notification));
      });

      socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });

      socket.on("connect_error", (error) => {
        console.log('Socket connection error:', error.message);
      });

      socket.on("socketError", (error) => {
        console.log('Socket error:', error);
      });

      socketRef.current = socket;
      console.log('Connected to socket', socket);
    }
  }

  async function subscribeToPushNotifications() {
    if (hasSubscribed.current) return;

    const permissionGranted = await requestNotificationPermission();
    if (!permissionGranted) {
      return;
    }

    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.register("/service-worker.js");

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

  const handleReadNotification = ({ userId, type, notificationId = null }: HandleReadNotificationType) => {
    console.log('handleReadNotification called with:', { userId, type, notificationId });
    if (socketRef.current) {
      socketRef.current.emit('readNotification', { userBId: userId, type, notificationId });
      dispatch(markAsRead({ userId, type, notificationId }));
    } else {
      connectToSocket();
      console.log('Socket is not connected, cannot emit readNotification event');
    }
  };

  async function requestNotificationPermission() {
    const permission = await Notification.requestPermission();
    console.log('Notification permission:', permission);
    return permission === 'granted';
  }

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, handleReadNotification }}>
      {children}
    </SocketContext.Provider>
  );
};