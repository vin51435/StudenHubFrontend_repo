import { RouteObject } from 'react-router-dom';
import ProtectAuthRoutes from '@src/routes/components/ProtectAuthRoutes';
import SignupAddDetails from '@src/pages/Auth/SignupDetails';
import SignupInterests from '@src/pages/Auth/SignupInterest';
// import { Login, Signup } from '@src/routes/lazyPages';
import Login from '@src/pages/Auth/Login';
import Signup from '@src/pages/Auth/Signup';

export const authRoutes: RouteObject[] = [
  {
    element: <ProtectAuthRoutes />,
    children: [
      { path: '/login', element: <Login /> },
      {
        path: '/signup',
        element: <Signup />,
      },
      { path: '/signup/details', element: <SignupAddDetails /> },
      { path: '/signup/interests', element: <SignupInterests /> },
    ],
  },
];
