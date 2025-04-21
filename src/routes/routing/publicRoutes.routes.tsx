import NotFoundPage from '@src/pages/NotFound';
import { RouteObject } from 'react-router-dom';

export const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <div>Website</div>,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];
