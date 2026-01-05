import { lazy } from 'react';
import RequireAuth from '../routes/RequireAuth';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import DemosLionTv from 'views/liontv/DemosLionTv';
import CustomersLionTv from 'views/liontv/CustomersLionTv';
import SubscriptionsLionTv from 'views/liontv/SubscriptionsLionTv';
import InvoicesLionTv from 'views/liontv/InvoicesLionTv';


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
          path: '/liontv/demos',
          element: <DemosLionTv />
        },
        {
          path: '/liontv/customers',
          element: <CustomersLionTv />
        },
        {
          path: '/liontv/subscriptions',
          element: <SubscriptionsLionTv />
        },
        {
          path: '/liontv/invoices',
          element: <InvoicesLionTv />
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
