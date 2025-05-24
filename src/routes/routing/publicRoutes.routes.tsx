import NotFoundPage from '@src/pages/NotFound';
import { getRoutePath } from '@src/utils/getRoutePath';
import { Navigate, RouteObject } from 'react-router-dom';

export const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to={getRoutePath('APP')} />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];
