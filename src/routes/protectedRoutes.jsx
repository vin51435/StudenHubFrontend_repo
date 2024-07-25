import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoutes = () => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  console.log({ isAuthenticated });

  useEffect(() => {
    console.log('isAuthenticated changed:', isAuthenticated);
  }, [isAuthenticated]);

  return (
    isAuthenticated ? <Outlet /> : <Navigate to='/login' />
  );
};

export default ProtectedRoutes;