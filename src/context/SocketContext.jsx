import { activeHost, postData } from '@src/config/apiConfig';
import { markAsRead, receiveNotification } from '@src/redux/reducer/notification';
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';

const WEBPUSH_PUBLIC_KEY = import.meta.env.VITE_WEBPUSH_PUBLICKEY;
const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const hasSubscribed = useRef(false); // Track whether we have subscribed to notifications
  const dispatch = useDispatch();
  const notifications = useSelector(state => state.notification);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    // Initialize a new socket connection only if there's a token
    if (token) {
      const newSocket = io(activeHost, {
        auth: { token },
        transports: ['websocket'],
      });

      setSocket(newSocket);

      newSocket.on("newNotification", (notification) => {
        console.log('New message notification received:', notification);
        dispatch(receiveNotification(notification));
      });

      // newSocket.on("readNotification", (notification) => {
      //   console.log('New message notification received:', notification);
      //   dispatch(receiveNotification(notification));
      // });

      newSocket.on('disconnect', () => {
        console.log('Socket disconnected');
      });

      newSocket.on("connect_error", (error) => {
        console.log('Socket connection error:', error.message);
      });

      newSocket.on("socketError", (error) => {
        console.log('Socket error:', error);
      });

      // Cleanup socket on component unmount or when token changes
      return () => {
        newSocket.disconnect();
        // console.log('Socket disconnected on tab close or token change');
      };
    }
  }, [token]); // Runs only when the token changes

  useEffect(() => {
    // Subscribe to push notifications only on initial load or when the token changes
    const subscribeToPushNotifications = async () => {
      if (hasSubscribed.current) return; // Prevent multiple subscriptions

      const permissionGranted = await requestNotificationPermission();
      if (!permissionGranted) {
        // console.log('Notification permission denied');
        return;
      }

      if ('serviceWorker' in navigator && 'PushManager' in window) {
        try {
          const registration = await navigator.serviceWorker.register("/service-worker.js");
          // console.log('Service Worker registered');

          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: WEBPUSH_PUBLIC_KEY,
          });

          await postData('/subscribe', {
            baseURL: 'user',
            data: subscription,
          });

          // console.log('Subscribed to push notifications');
          hasSubscribed.current = true; // Mark as subscribed
        } catch (error) {
          // console.error('Push notification subscription failed:', error);
        }
      }
    };

    subscribeToPushNotifications();
  }, []);

  function readNotification(notification) {
    socket.emit('readNotification', notification._id);
    dispatch(markAsRead(notification));
  }

  async function requestNotificationPermission() {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  };

  return <SocketContext.Provider value={{ socket, readNotification }}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
