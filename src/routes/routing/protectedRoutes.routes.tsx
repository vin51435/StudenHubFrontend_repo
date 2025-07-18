import { RouteObject } from 'react-router-dom';
import ProtectedRoutes from '@src/routes/components/ProtectRoutes';
import { getExactRoutePath, getRoutePath } from '@src/utils/getRoutePath';
import AppLayout from '@src/layouts/Index';
import {
  Chats,
  Community,
  CreatePost,
  Home,
  NotFoundPage,
  Popular,
  PostDetailPage,
  Profile,
  Settings,
} from '@src/routes/routing/lazyPages';
import SearchPage from '@src/pages/Search';

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
          { path: getExactRoutePath('SEARCH'), element: <SearchPage /> },
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
