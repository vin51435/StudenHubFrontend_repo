import { useRoutes, BrowserRouter } from 'react-router-dom';
import { publicRoutes } from './routing/publicRoutes.routes';
import { protectedRoutes } from './routing/protectedRoutes.routes';
import { Suspense } from 'react';
import { Spin } from 'antd';
import { authRoutes } from '@src/routes/routing/authRoutes.routes';

const AppRoutes = () => {
  const routes = [...publicRoutes, ...authRoutes, ...protectedRoutes];
  return <Suspense fallback={<Spin fullscreen />}>{useRoutes(routes)}</Suspense>;
};

const RouterWrapper = () => (
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
);

export default RouterWrapper;
