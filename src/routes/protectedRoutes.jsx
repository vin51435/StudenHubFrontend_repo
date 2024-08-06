import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import fetchUserInfo from '@src/utils/fetchUserInfo';
import { PageLoadingSpinner } from '@src/components/common/LoadingSpinner';

const ProtectedRoutes = () => {
  const { isAuthenticated, token, user } = useSelector((state) => state.auth);
  const { userEdProfile } = useSelector((state) => state.userEdProfile);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated && !user) {
      fetchUserInfo(dispatch).finally(() => setLoading(false));
    }
  }, [isAuthenticated, token, user, dispatch]);

  console.log({ isAuthenticated }, { userEdProfile });

  if (isAuthenticated) {
    return (
      userEdProfile ? <Outlet /> : 'form'
    );
  }

  if (loading) {
    return <PageLoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' />;
  }
};

export default ProtectedRoutes;
