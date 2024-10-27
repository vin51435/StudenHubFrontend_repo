import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import fetchUserInfo from '@src/utils/fetchUserInfo';
import { PageLoadingSpinner } from '@src/components/common/LoadingSpinner';

const ProtectedRoutes = () => {
  const { isAuthenticated, token, redirectUrl, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !isAuthenticated) {
      fetchUserInfo(dispatch)
        .then(response => {
          return response;
        })
        .catch(() => console.error('Error fetching user'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [dispatch, navigate]);

  if (loading) {
    return <PageLoadingSpinner />;
  }

  if (isAuthenticated && (!redirectUrl || redirectUrl === location.pathname)) {
    return <Outlet />;
    // return user ? <Outlet /> : 'No user'; //* Replace 'form' with the actual component or redirect if needed
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' />;
  }
};

export default ProtectedRoutes;
