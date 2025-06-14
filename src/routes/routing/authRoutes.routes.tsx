import { RouteObject } from 'react-router-dom';
import ProtectAuthRoutes from '@src/routes/components/ProtectAuthRoutes';
import SignupAddDetails from '@src/pages/Auth/SignupDetails';
import SignupInterests from '@src/pages/Auth/SignupInterest';
// import { Login, Signup } from '@src/routes/lazyPages';
import Login from '@src/pages/Auth/Login';
import Signup from '@src/pages/Auth/Signup';
import { getExactRoutePath, getRoutePath } from '@src/utils/getRoutePath';

export const authRoutes: RouteObject[] = [
  {
    element: <ProtectAuthRoutes />,
    children: [
      { path: '/login', element: <Login /> },
      {
        path: '/signup',
        element: <Signup />,
      },
      {
        path: getRoutePath('LOGIN.CALLBACK'),
        children: [
          { path: getExactRoutePath('LOGIN.CALLBACK.GOOGLE'), element: <Login /> },
          { path: getExactRoutePath('LOGIN.CALLBACK.GITHUB'), element: <Login /> },
        ],
      },
      {
        path: getRoutePath('SIGNUP.CALLBACK.GOOGLE'),
        children: [
          { path: getExactRoutePath('SIGNUP.CALLBACK.GITHUB'), element: <Signup /> },
          { path: getExactRoutePath('SIGNUP.CALLBACK.GOOGLE'), element: <Signup /> },
        ],
      },
      { path: '/signup/details', element: <SignupAddDetails /> },
      { path: '/signup/interests', element: <SignupInterests /> },
    ],
  },
];
