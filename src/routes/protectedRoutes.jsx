import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import fetchUserInfo from '@src/utils/fetchUserInfo';
import { PageLoadingSpinner } from '@src/components/common/LoadingSpinner';
import { getData } from '@src/config/apiConfig';
import { loadNotifications } from '@src/redux/reducer/notification';

const ProtectedRoutes = () => {
  const { isAuthenticated, token, redirectUrl, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    if (!token || !isAuthenticated) {
      fetchUserInfo(dispatch)
        .finally(() => {
          setTimeout(() => setLoading(false), 300); // Delay to fade out spinner
          // setLoading(false)
        });
    } else {
      setTimeout(() => setLoading(false), 300); // Delay to fade out spinner
      // setLoading(false);
    }

    if (token && isAuthenticated && !redirectUrl) {
      getData('USER_NOTIFICATIONS', {
        baseURL: 'user'
      })
        .then(response => {
          const { data } = response;
          dispatch(loadNotifications(data));
        });
    }
  }, [isAuthenticated, token, redirectUrl]);

  if (loading) {
    return <PageLoadingSpinner load={loading} />;
  }

  if (isAuthenticated && (!redirectUrl || redirectUrl === location.pathname)) {
    return <Outlet />;
    // return user ? <Outlet /> : 'No user'; //* Replace 'form' with the actual component or redirect if needed
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' />;
  }

  return null; // Safeguard for rendering
};

export default ProtectedRoutes;
