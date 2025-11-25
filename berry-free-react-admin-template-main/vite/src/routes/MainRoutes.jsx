import { lazy } from 'react';
import RequireAuth from '../routes/RequireAuth';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
const SmsManagement = Loadable(lazy(() => import('views/sms/SmsManagement')));

const MainRoutes = {
  path: '/',
  element: <RequireAuth />,   // 🔒 proteger todas las rutas internas
  children: [
    {
      element: <MainLayout />, // tu layout solo si está autenticado
      children: [
        {
          path: '/',
          element: <DashboardDefault />
        },
        {
          path: 'dashboard',
          children: [
            {
              path: 'default',
              element: <DashboardDefault />
            }
          ]
        },
        {
          path: 'sms',
          children: [
            {
              path: 'management',
              element: <SmsManagement />
            }
          ]
        }
      ]
    }
  ]
};

export default MainRoutes;
