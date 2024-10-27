import { activeHost, postData } from '@src/config/apiConfig';
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';

const WEBPUSH_PUBLIC_KEY = import.meta.env.VITE_WEBPUSH_PUBLICKEY;
const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { token } = useSelector((state) => state.auth);
  const hasSubscribed = useRef(false); // Track whether we have subscribed to notifications

  useEffect(() => {
    // Initialize a new socket connection only if there's a token
    if (token) {
      const newSocket = io(activeHost, {
        auth: { token },
        transports: ['websocket'],
      });

      setSocket(newSocket);
      // console.log('Socket initialized and connected for this tab');

      newSocket.on('disconnect', () => {
        // console.log('Socket disconnected');
      });

      newSocket.on("connect_error", (error) => {
        // console.log('Socket connection error:', error.message);
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
  }, []); // Empty dependency array to run only on initial load

  const requestNotificationPermission = async () => {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  };

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
