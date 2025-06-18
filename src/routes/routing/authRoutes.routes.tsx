import { RouteObject } from 'react-router-dom';
import ProtectAuthRoutes from '@src/routes/components/ProtectAuthRoutes';
import { getRoutePath } from '@src/utils/getRoutePath';
import {
  Login,
  ResetPassword,
  Signup,
  SignupAddDetails,
  SignupInterests,
} from '@src/routes/routing/lazyPages';

export const authRoutes: RouteObject[] = [
  {
    element: <ProtectAuthRoutes />,
    children: [
      { path: '/login', element: <Login /> },
      { path: getRoutePath('RESET_PASSWORD_TOKEN'), element: <ResetPassword /> },
      { path: getRoutePath('AUTH.OAUTH_CALLBACK.GOOGLE'), element: <Login /> },
      { path: getRoutePath('AUTH.OAUTH_CALLBACK.GITHUB'), element: <Login /> },
      {
        path: '/signup',
        element: <Signup />,
      },
      { path: '/signup/details', element: <SignupAddDetails /> },
      { path: '/signup/interests', element: <SignupInterests /> },
    ],
  },
];
