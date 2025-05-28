import Home from '@src/pages/Home';
import { Profile } from '@src/pages/Profile';
import ProtectedRoutes from '@src/routes/components/ProtectRoutes';
import { getExactRoutePath } from '@src/utils/getRoutePath';
import { RouteObject } from 'react-router-dom';
import Chats from '@src/pages/Chats';
import AppLayout from '@src/layouts/Index';

export const protectedRoutes: RouteObject[] = [
  {
    element: <ProtectedRoutes />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: '/home',
            children: [
              { path: '', element: <Home /> },
              { path: 'settings', element: <div>Settings</div> },
            ],
          },
          { path: getExactRoutePath('PROFILE'), element: <Profile /> },
          { path: getExactRoutePath('CHATS'), element: <Chats /> },
        ],
      },
    ],
  },
];
