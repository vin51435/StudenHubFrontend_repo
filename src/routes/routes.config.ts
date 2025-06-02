import { RouteConfig } from '@src/types/app';

const ROUTES = [
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
    title: 'Home',
    children: [
      { name: 'PROFILE', title: 'Profile', path: '/profile' },
      { name: 'CHATS', path: '/chats' },
      { name: 'CREATE_COMMUNITY', path: '/create' },
    ],
  },
  {
    name: 'COMMUNITY',
    path: '/community/:slug',
    title: 'Community',
    children: [
      { name: 'COMMUNITY_POSTS', path: ':sort/:range' },
      { name: 'POST', path: 'post/:postSlug' },
      { name: 'CREATE_POST', title: 'Create Post', path: 'create' },
    ],
  },
] as const;

export default ROUTES;
