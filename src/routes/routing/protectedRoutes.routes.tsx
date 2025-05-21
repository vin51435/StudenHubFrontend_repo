import DefaultLayout from '@src/layouts/test.layout';
import SignupAddDetails from '@src/pages/Auth/SignupDetails';
import SignupInterests from '@src/pages/Auth/SignupInterest';
import Home from '@src/pages/Home';
import ProtectedRoutes from '@src/routes/components/ProtectRoutes';
import { RouteObject } from 'react-router-dom';

export const protectedRoutes: RouteObject[] = [
  {
    element: <ProtectedRoutes />,
    children: [
      {
        element: <DefaultLayout />,
        children: [
          { path: '/signup/details', element: <SignupAddDetails /> },
          { path: '/signup/interests', element: <SignupInterests /> },
          {
            path: '/home',
            children: [
              { path: '', element: <Home /> },
              { path: 'settings', element: <div>Settings</div> },
            ],
          },
        ],
      },
    ],
  },
];
