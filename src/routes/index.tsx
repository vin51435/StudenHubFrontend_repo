import { useRoutes, BrowserRouter, useNavigate } from 'react-router-dom';
import { publicRoutes } from './routing/publicRoutes.routes';
import { protectedRoutes } from './routing/protectedRoutes.routes';
import { Suspense, useEffect } from 'react';
import { authRoutes } from '@src/routes/routing/authRoutes.routes';
import { useDispatch } from 'react-redux';
import { setLoading } from '@src/redux/reducers/uiSlice';
import ScrollRestoration from '@src/components/ScrollRestoration';
import { Spin } from 'antd';
import { setNavigator } from '@src/utils/navigate';
import { useAppSelector } from '@src/redux/hook';
import { AccType } from '@src/types/enum';
import { adminRoutes } from '@src/routes/routing/admin.routes';

const AppRoutes = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const finalRoutes = [
    ...publicRoutes,
    ...authRoutes,
    ...protectedRoutes,
    ...(user?.role === AccType.Admin ? adminRoutes : []),
  ];

  const routeLoaded = useRoutes(finalRoutes);

  useEffect(() => {
    if (routeLoaded) {
      dispatch(setLoading(false));
    }
  }, [routeLoaded]);

  useEffect(() => {
    setNavigator(navigate); // ✅ assign global nav function
  }, [navigate]);

  return routeLoaded;
};

const RouterWrapper = () => (
  <BrowserRouter>
    <Suspense fallback={<Spin fullscreen className="dark:bg-[var(--primary-dark)]" />}>
      <ScrollRestoration />
      {/* <PageTransitionWrapper> */}
      <AppRoutes />
      {/* </PageTransitionWrapper> */}
    </Suspense>
  </BrowserRouter>
);

export default RouterWrapper;
