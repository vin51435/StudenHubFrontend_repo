import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@src/redux/store';
import fetchUserInfo from '@src/api/fetchUser';
import { get } from '@src/libs/apiConfig';
import { loadNotifications } from '@src/redux/reducers/notifications';
import { Spin } from 'antd';
import { getRoutePath } from '@src/utils/getRoutePath';
import { setLoading } from '@src/redux/reducers/uiSlice';

const ProtectedRoutes: React.FC = () => {
  const { isAuthenticated, redirectUrl, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();

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
        // Error is automatically handled
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

  if (!isAuthenticated) {
    return <Navigate to={getRoutePath('LOGIN')} state={{ from: location }} replace />;
  }

  return null;
};

export default ProtectedRoutes;
