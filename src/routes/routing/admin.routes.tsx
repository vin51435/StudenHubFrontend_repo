import AppLayout from '@src/layouts/Index';
import AccessLogDashboard from '@src/pages/Dash';
import { getRoutePath } from '@src/utils/getRoutePath';
import { RouteObject } from 'react-router-dom';

export const adminRoutes: RouteObject[] = [
  {
    path: '/admin',
    element: <AppLayout />,
    children: [
      {
        path: getRoutePath('DASHBOARD'),
        element: <AccessLogDashboard />,
      },
    ],
  },
];
