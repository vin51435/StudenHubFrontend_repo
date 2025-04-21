import { RouteConfig } from '@src/types/app';

const ROUTES: RouteConfig = [
  {
    name: 'WEBSITE',
    path: '/',
  },
  {
    name: 'AUTH',
    path: '',
    children: [
      {
        name: 'LOGIN',
        path: '/login',
        children: [
          {
            name: 'CALLBACK',
            path: '/auth',
            children: [
              { name: 'GOOGLE', path: '/google/callback' },
              { name: 'GITHUB', path: '/github/callback' },
            ],
          },
        ],
      },
      {
        name: 'SIGNUP',
        path: '/signup',
        children: [
          {
            name: 'CALLBACK',
            path: '/auth',
            children: [
              { name: 'GOOGLE', path: '/google/callback' },
              { name: 'GITHUB', path: '/github/callback' },
            ],
          },
          { name: 'DETAILS', path: '/details' },
          { name: 'INTERESTS', path: '/interests' },
        ],
      },
    ],
  },
  {
    name: 'APP',
    path: '/home',
    children: [
      { name: 'PROFILE', path: '/profile' },
      { name: 'INBOX', path: '/inbox' },
    ],
  },
] as const;

export default ROUTES;
