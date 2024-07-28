import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import fetchUserInfo from '@src/utils/fetchUserInfo';


const ProtectedRoutes = () => {
  const { isAuthenticated, token, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('isAuthenticated:', isAuthenticated);
    if (!isAuthenticated && user !== null && Object.keys(user).length === 0 && token !== null) {
      fetchUserInfo(dispatch);
    }
  }, [isAuthenticated, token, user, dispatch]);

  return (
    token ? <Outlet /> : <Navigate to='/login' />
  );
};

export default ProtectedRoutes;
