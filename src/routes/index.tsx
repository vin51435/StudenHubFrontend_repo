import { useRoutes, BrowserRouter } from 'react-router-dom';
import { publicRoutes } from './routing/publicRoutes.routes';
import { protectedRoutes } from './routing/protectedRoutes.routes';
import { Suspense, useEffect } from 'react';
import { authRoutes } from '@src/routes/routing/authRoutes.routes';
import { useDispatch } from 'react-redux';
import { setLoading } from '@src/redux/reducers/uiSlice';
import ScrollRestoration from '@src/components/ScrollRestoration';
import { Spin } from 'antd';
import PageTransitionWrapper from '@src/components/PageTransitionWrapper';

const AppRoutes = () => {
  const dispatch = useDispatch();
  const routes = [...publicRoutes, ...authRoutes, ...protectedRoutes];

  const routeLoaded = useRoutes(routes);
  useEffect(() => {
    if (routeLoaded) {
      dispatch(setLoading(false));
    }
  }, [routeLoaded]);

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
