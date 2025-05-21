import { RouteObject } from 'react-router-dom';
import ProtectAuthRoutes from '@src/routes/components/ProtectAuthRoutes';
import { Login, Signup } from '@src/routes/lazyPages';

export const authRoutes: RouteObject[] = [
  {
    element: <ProtectAuthRoutes />,
    children: [
      { path: '/login', element: <Login /> },
      {
        path: '/signup',
        element: <Signup />,
      },
    ],
  },
];
