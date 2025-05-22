import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@src/redux/store';
import fetchUserInfo from '@src/api/fetchUser';
import { get } from '@src/libs/apiConfig';
import { loadNotifications } from '@src/redux/reducers/notifications';
import { setLoading } from '@src/redux/reducers/uiSlice';
import { useLogout } from '@src/hooks/useLogout';

const ProtectedRoutes: React.FC = () => {
  const { isAuthenticated, redirectUrl, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const logout = useLogout();

  const verifyUserAuthenticity = async () => {
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
        logout();
      } finally {
        dispatch(setLoading(false));
      }
    }
  };

  useEffect(() => {
    dispatch(setLoading(true));
    verifyUserAuthenticity();
  }, []);
  // Adding any of the isAuthenticated,redirectUrl,dispatch dependency, makes it run twice

  if (isAuthenticated && (!redirectUrl || redirectUrl === location.pathname)) {
    return <Outlet />;
  }

  return null;
};

export default ProtectedRoutes;
