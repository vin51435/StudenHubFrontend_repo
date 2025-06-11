import Home from '@src/pages/Home';
import ProtectedRoutes from '@src/routes/components/ProtectRoutes';
import { getExactRoutePath, getRoutePath } from '@src/utils/getRoutePath';
import { RouteObject } from 'react-router-dom';
import Chats from '@src/pages/Chats';
import AppLayout from '@src/layouts/Index';
import Community from '@src/pages/Community';
import CreatePost from '@src/components/Post/CreatePost';
import PostDetailPage from '@src/components/Post/PostDetails';
import Popular from '@src/pages/Popular/Index';
import Profile from '@src/pages/User/Profile';
import { Settings } from '@src/pages/User/settings';
import NotFoundPage from '@src/pages/NotFound';

export const protectedRoutes: RouteObject[] = [
  {
    element: <ProtectedRoutes />,
    children: [
      {
        path: '',
        element: <NotFoundPage />,
      },
      { path: getExactRoutePath('USER'), element: <NotFoundPage /> },
      { path: getExactRoutePath('COMMUNITY'), element: <NotFoundPage /> },
      {
        element: <AppLayout />,
        children: [
          {
            path: '/home',
            children: [{ path: '', element: <Home /> }],
          },
          {
            path: getRoutePath('USER'),
            children: [
              { path: getRoutePath('USER_PROFILE'), element: <Profile /> },
              { path: getRoutePath('USER_SETTINGS'), element: <Settings /> },
            ],
          },
          { path: getExactRoutePath('CHATS'), element: <Chats /> },
          { path: getRoutePath('POPULAR'), element: <Popular /> },
          {
            path: getExactRoutePath('COMMUNITY'), // /community/:slug
            children: [
              { path: getExactRoutePath('POST'), element: <PostDetailPage /> },
              {
                index: true,
                element: <Community />, // Handles just `/community/:slug`
              },
              {
                path: ':sort', // /community/:slug/:sort
                element: <Community />,
              },
              {
                path: ':sort/:range', // /community/:slug/:sort/:range
                element: <Community />,
              },
              { path: getExactRoutePath('CREATE_POST'), element: <CreatePost /> },
            ],
          },
        ],
      },
    ],
  },
];
