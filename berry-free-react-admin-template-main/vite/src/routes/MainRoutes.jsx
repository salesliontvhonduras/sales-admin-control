import { lazy } from 'react';
import RequireAuth from '../routes/RequireAuth';
import RequirePermission from '../routes/RequirePermission';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
const SmsManagement = Loadable(lazy(() => import('views/sms/SmsManagement')));
const LionTvDashboard = Loadable(lazy(() => import('views/liontv/LionTvDashboard')));
const DemosLionTv = Loadable(lazy(() => import('views/liontv/DemosLionTv')));
const CustomersLionTv = Loadable(lazy(() => import('views/liontv/CustomersLionTv')));
const PotentialCustomersLionTv = Loadable(lazy(() => import('views/liontv/PotentialCustomersLionTv')));
const PaymentCommitmentsLionTv = Loadable(lazy(() => import('views/liontv/PaymentCommitmentsLionTv')));
const MoviesFeedLionTv = Loadable(lazy(() => import('views/liontv/MoviesFeedLionTv')));
const SeriesFeedLionTv = Loadable(lazy(() => import('views/liontv/SeriesFeedLionTv')));
const FutbolEventsFeedLionTv = Loadable(lazy(() => import('views/liontv/FutbolEventsFeedLionTv')));
const ManagedAccountsLionTv = Loadable(lazy(() => import('views/liontv/ManagedAccountsLionTv')));
const CustomerCrmLionTv = Loadable(lazy(() => import('views/liontv/CustomerCrmLionTv')));
const SubscriptionsLionTv = Loadable(lazy(() => import('views/liontv/SubscriptionsLionTv')));
const InvoicesLionTv = Loadable(lazy(() => import('views/liontv/InvoicesLionTv')));
const BusinessPurchasesLionTv = Loadable(lazy(() => import('views/liontv/BusinessPurchasesLionTv')));
const LicensesLionTv = Loadable(lazy(() => import('views/liontv/LicensesLionTv')));
const LinesLionTv = Loadable(lazy(() => import('views/liontv/LinesLionTv')));
const PlusLinesExplorer = Loadable(lazy(() => import('views/liontv/PlusLinesExplorer')));
const UserAccessAdmin = Loadable(lazy(() => import('views/security/UserAccessAdmin')));

const MainRoutes = {
  path: '/',
  element: <RequireAuth />, // 🔒 proteger todas las rutas internas
  children: [
    {
      element: <MainLayout />, // tu layout solo si está autenticado
      children: [
        {
          element: <RequirePermission permission={{ any: ['DASHBOARD_VIEW', 'ROLE_DASHBOARD_VIEW'] }} />,
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
            }
          ]
        },
        {
          element: <RequirePermission permission={{ any: ['LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] }} />,
          children: [
            {
              path: '/liontv/dashboard',
              element: <LionTvDashboard />
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
              path: '/liontv/potential-customers',
              element: <PotentialCustomersLionTv />
            },
            {
              path: '/liontv/payment-commitments',
              element: <PaymentCommitmentsLionTv />
            },
            {
              path: '/liontv/movies-feed',
              element: <MoviesFeedLionTv />
            },
            {
              path: '/liontv/series-feed',
              element: <SeriesFeedLionTv />
            },
            {
              path: '/liontv/futbol-events-feed',
              element: <FutbolEventsFeedLionTv />
            },
            {
              path: '/liontv/managed-accounts',
              element: <ManagedAccountsLionTv />
            },
            {
              path: '/liontv/crm',
              element: <CustomerCrmLionTv />
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
              path: '/liontv/business-purchases',
              element: <BusinessPurchasesLionTv />
            },
            {
              path: '/liontv/licenses',
              element: <LicensesLionTv />
            },
            {
              path: '/liontv/lines',
              element: <LinesLionTv />
            },
            {
              path: '/liontv/plus-lines',
              element: <PlusLinesExplorer />
            }
          ]
        },
        {
          element: <RequirePermission permission={{ any: ['SMS_VIEW', 'ROLE_SMS_VIEW'] }} />,
          children: [
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
        },
        {
          element: <RequirePermission permission={{ any: ['USER_MANAGEMENT_VIEW', 'ROLE_USER_MANAGEMENT_VIEW', 'ROLE_ADMIN', 'ADMIN'] }} />,
          children: [
            {
              path: '/admin/users-access',
              element: <UserAccessAdmin />
            }
          ]
        }
      ]
    }
  ]
};

export default MainRoutes;
