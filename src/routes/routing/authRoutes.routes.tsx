import { RouteObject } from 'react-router-dom';
import ProtectAuthRoutes from '@src/routes/components/ProtectAuthRoutes';
import SignupAddDetails from '@src/pages/Auth/SignupDetails';
import SignupInterests from '@src/pages/Auth/SignupInterest';
// import { Login, Signup } from '@src/routes/lazyPages';
import Login from '@src/pages/Auth/Login';
import Signup from '@src/pages/Auth/Signup';
import { getExactRoutePath, getRoutePath } from '@src/utils/getRoutePath';
import ResetPassword from '@src/pages/Auth/ResetPassword';

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
