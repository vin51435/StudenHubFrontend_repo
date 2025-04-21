import ProtectedRoutes from '@src/routes/components/ProtectRoutes';
import { RouteObject } from 'react-router-dom';

export const protectedRoutes: RouteObject[] = [
  {
    element: <ProtectedRoutes />,
    children: [
      {
        path: '/home',
        children: [
          { path: '', element: <div>Profile</div> },
          { path: 'settings', element: <div>Settings</div> },
        ],
      },
    ],
  },
];
