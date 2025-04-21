import { RouteObject } from 'react-router-dom';
import ProtectAuthRoutes from '@src/routes/components/ProtectAuthRoutes';
import { Login, Signup } from '@src/routes/lazyPages';
import SignupAddDetails from '@src/pages/Auth/SignupDetails';
import SignupInterests from '@src/pages/Auth/SignupInterest';

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
  // { path: '/signup/details', element: <SignupAddDetails /> },
  // { path: '/signup/interests', element: <SignupInterests /> },
];
