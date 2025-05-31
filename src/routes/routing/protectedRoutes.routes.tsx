import Home from '@src/pages/Home';
import { Profile } from '@src/pages/Profile';
import ProtectedRoutes from '@src/routes/components/ProtectRoutes';
import { getExactRoutePath, getRoutePath } from '@src/utils/getRoutePath';
import { RouteObject } from 'react-router-dom';
import Chats from '@src/pages/Chats';
import AppLayout from '@src/layouts/Index';
import Community from '@src/pages/Community';
import CreatePost from '@src/components/Post/CreatePost';

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
          {
            path: getExactRoutePath('COMMUNITY'),
            children: [
              { path: '', element: <Community /> },
              { path: getExactRoutePath('CREATE_POST'), element: <CreatePost /> },
            ],
          },
          { path: getExactRoutePath('PROFILE'), element: <Profile /> },
          { path: getExactRoutePath('CHATS'), element: <Chats /> },
        ],
      },
    ],
  },
];
