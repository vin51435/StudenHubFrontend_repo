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
  const { isAuthenticated, token, redirectUrl, user } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();

  const verifyUserAuthenticity = async () => {
    if (token && !redirectUrl) {
      await fetchUserInfo();
      dispatch(setLoading(false));

      // Fetch user notifications
      const response = await get('NOTIFICATIONS', {
        BASE_URLS: 'user',
      });
      const { data } = response;
      dispatch(loadNotifications(data));
    }
  };

  useEffect(() => {
    dispatch(setLoading(true));
    verifyUserAuthenticity();
  }, []);
  // Adding any of the token,isAuthenticated,redirectUrl,dispatch dependency, makes it run twice

  if (isAuthenticated && (!redirectUrl || redirectUrl === location.pathname)) {
    return <Outlet />;
  }

  if (!isAuthenticated && !token) {
    return <Navigate to={getRoutePath('LOGIN')} state={{ from: location }} replace />;
  }

  return null;
};

export default ProtectedRoutes;
