import { useRoutes, BrowserRouter, useNavigate } from 'react-router-dom';
import { publicRoutes } from './routing/publicRoutes.routes';
import { protectedRoutes } from './routing/protectedRoutes.routes';
import { Suspense, useEffect } from 'react';
import { authRoutes } from '@src/routes/routing/authRoutes.routes';
import { useDispatch } from 'react-redux';
import { setLoading } from '@src/redux/reducers/uiSlice';
import ScrollRestoration from '@src/components/ScrollRestoration';
import { Spin } from 'antd';
import PageTransitionWrapper from '@src/components/PageTransitionWrapper';
import { setNavigator } from '@src/utils/navigate';

const AppRoutes = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const routes = [...publicRoutes, ...authRoutes, ...protectedRoutes];

  const routeLoaded = useRoutes(routes);

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
