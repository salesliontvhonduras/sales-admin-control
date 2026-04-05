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
const SubscriptionSharingLionTv = Loadable(lazy(() => import('views/liontv/SubscriptionSharingLionTv')));
const InvoicesLionTv = Loadable(lazy(() => import('views/liontv/InvoicesLionTv')));
const BusinessPurchasesLionTv = Loadable(lazy(() => import('views/liontv/BusinessPurchasesLionTv')));
const LicensesLionTv = Loadable(lazy(() => import('views/liontv/LicensesLionTv')));
const LinesLionTv = Loadable(lazy(() => import('views/liontv/LinesLionTv')));
const PlusLinesExplorer = Loadable(lazy(() => import('views/liontv/PlusLinesExplorer')));
const UserAccessAdmin = Loadable(lazy(() => import('views/security/UserAccessAdmin')));
const PanelAuthMultiAppAdmin = Loadable(lazy(() => import('views/security/PanelAuthMultiAppAdmin')));

const protectPage = (permission, element, fallbackPath = '/dashboard/default') => (
  <RequirePermission permission={permission} fallbackPath={fallbackPath}>
    {element}
  </RequirePermission>
);

const MainRoutes = {
  path: '/',
  element: <RequireAuth />, // 🔒 proteger todas las rutas internas
  children: [
    {
      element: <MainLayout />, // tu layout solo si está autenticado
      children: [
        {
          path: '/',
          element: protectPage({ any: ['DASHBOARD_VIEW', 'ROLE_DASHBOARD_VIEW'] }, <DashboardDefault />, '/liontv/dashboard')
        },
        {
          path: 'dashboard',
          children: [
            {
              path: 'default',
              element: protectPage({ any: ['DASHBOARD_VIEW', 'ROLE_DASHBOARD_VIEW'] }, <DashboardDefault />, '/liontv/dashboard')
            }
          ]
        },
        {
          path: '/liontv/dashboard',
          element: protectPage({ any: ['LIONTV_DASHBOARD_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] }, <LionTvDashboard />)
        },
        {
          path: '/liontv/demos',
          element: protectPage({ any: ['LIONTV_DEMOS_VIEW', 'LIONTV_CONTENT_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] }, <DemosLionTv />)
        },
        {
          path: '/liontv/customers',
          element: protectPage({ any: ['LIONTV_CUSTOMERS_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] }, <CustomersLionTv />)
        },
        {
          path: '/liontv/potential-customers',
          element: protectPage(
            { any: ['LIONTV_POTENTIAL_CUSTOMERS_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] },
            <PotentialCustomersLionTv />
          )
        },
        {
          path: '/liontv/payment-commitments',
          element: protectPage(
            { any: ['LIONTV_PAYMENT_COMMITMENTS_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] },
            <PaymentCommitmentsLionTv />
          )
        },
        {
          path: '/liontv/movies-feed',
          element: protectPage(
            { any: ['LIONTV_FEED_VIEW', 'LIONTV_CONTENT_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] },
            <MoviesFeedLionTv />
          )
        },
        {
          path: '/liontv/series-feed',
          element: protectPage(
            { any: ['LIONTV_FEED_VIEW', 'LIONTV_CONTENT_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] },
            <SeriesFeedLionTv />
          )
        },
        {
          path: '/liontv/futbol-events-feed',
          element: protectPage(
            { any: ['LIONTV_FEED_VIEW', 'LIONTV_CONTENT_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] },
            <FutbolEventsFeedLionTv />
          )
        },
        {
          path: '/liontv/managed-accounts',
          element: protectPage({ any: ['LIONTV_MANAGED_ACCOUNTS_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] }, <ManagedAccountsLionTv />)
        },
        {
          path: '/liontv/crm',
          element: protectPage({ any: ['LIONTV_CRM_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] }, <CustomerCrmLionTv />)
        },
        {
          path: '/liontv/subscriptions',
          element: protectPage({ any: ['LIONTV_SUBSCRIPTIONS_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] }, <SubscriptionsLionTv />)
        },
        {
          path: '/liontv/subscription-sharing',
          element: protectPage(
            { any: ['LIONTV_SUBSCRIPTION_SHARING_VIEW', 'LIONTV_SUBSCRIPTIONS_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] },
            <SubscriptionSharingLionTv />
          )
        },
        {
          path: '/liontv/invoices',
          element: protectPage({ any: ['LIONTV_INVOICES_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] }, <InvoicesLionTv />)
        },
        {
          path: '/liontv/business-purchases',
          element: protectPage({ any: ['LIONTV_BUSINESS_PURCHASES_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] }, <BusinessPurchasesLionTv />)
        },
        {
          path: '/liontv/licenses',
          element: protectPage({ any: ['LIONTV_LICENSES_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] }, <LicensesLionTv />)
        },
        {
          path: '/liontv/lines',
          element: protectPage({ any: ['LIONTV_LINES_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] }, <LinesLionTv />)
        },
        {
          path: '/liontv/plus-lines',
          element: protectPage(
            { any: ['LIONTV_PLUS_LINES_VIEW', 'LIONTV_LINES_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] },
            <PlusLinesExplorer />
          )
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
            },
            {
              path: '/admin/panel-auths',
              element: <PanelAuthMultiAppAdmin />
            }
          ]
        }
      ]
    }
  ]
};

export default MainRoutes;
