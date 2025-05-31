import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@src/redux/store';
import fetchUserInfo from '@src/api/fetchUser';
import { get } from '@src/libs/apiConfig';
import { loadNotifications } from '@src/redux/reducers/notifications';
import { setLoading } from '@src/redux/reducers/uiSlice';
import { useLogout } from '@src/hooks/useLogout';
import { useNotification } from '@src/contexts/NotificationContext';

const ProtectedRoutes: React.FC = () => {
  const [checkingAuth, setCheckingAuth] = useState(true);

  const { isAuthenticated, redirectUrl, user } = useSelector((state: RootState) => state.auth);
  const loading = useSelector((state: RootState) => state.ui.loading);
  const { notif, startRemoveNotification } = useNotification();
  const dispatch = useDispatch<AppDispatch>();
  const logout = useLogout();

  useEffect(() => {
    // dispatch(setLoading(true));
    Promise.all([verifyUserAuthenticity()]).finally(() => {
      setTimeout(() => {
        setCheckingAuth(false);
        // dispatch(setLoading(false));
      }, 0);
    });
  }, []);

  const verifyUserAuthenticity = async () => {
    let notifId: string | null = null;
    const timeoutId = setTimeout(() => {
      notifId = notif('Please wait while we connect to the server...', null, {
        key: 'connecting_server',
      });
    }, 5000);

    if (!redirectUrl) {
      try {
        await fetchUserInfo();

        // Fetch user notifications only if fetchUserInfo is successful
        const response = await get('NOTIFICATIONS', {
          BASE_URLS: 'user',
        });

        const { data } = response;
        dispatch(loadNotifications(data));
      } catch (error) {
        // navigate(getRoutePath('LOGIN'));
        logout();
      } finally {
        clearTimeout(timeoutId);
        if (notifId) startRemoveNotification(notifId);
      }
    }
  };

  useLayoutEffect(() => {
    dispatch(setLoading(false));
  }, []);

  if (checkingAuth || loading) return null;

  if (isAuthenticated) {
    return <Outlet />;
  }

  return null;
};

export default ProtectedRoutes;
