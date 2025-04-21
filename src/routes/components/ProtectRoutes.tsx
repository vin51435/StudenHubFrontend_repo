import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@src/redux/store';
import fetchUserInfo from '@src/api/fetchUser';
import { get } from '@src/libs/apiConfig';
import { loadNotifications } from '@src/redux/reducers/notifications';
import { Spin } from 'antd';
import { getRoutePath } from '@src/utils/getRoutePath';

const ProtectedRoutes: React.FC = () => {
  const { isAuthenticated, token, redirectUrl, user } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !isAuthenticated) {
      fetchUserInfo().finally(() => setLoading(false));
    }

    if (token && isAuthenticated && !redirectUrl) {
      get('NOTIFICATIONS', {
        BASE_URLS: 'user',
      }).then((response) => {
        const { data } = response;
        dispatch(loadNotifications(data));
      });
    }
  }, []);
  // Adding any of the token,isAuthenticated,redirectUrl,dispatch dependency, makes it run twice

  if (loading) return <Spin fullscreen />;

  if (isAuthenticated && (!redirectUrl || redirectUrl === location.pathname)) {
    return <Outlet />;
  }

  if (!isAuthenticated) {
    return <Navigate to={getRoutePath('LOGIN')} state={{ from: location }} replace />;
  }

  return null;
};

export default ProtectedRoutes;
