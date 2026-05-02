import { lazy } from 'react';
import RequireAuth from '../routes/RequireAuth';
import RequirePermission from '../routes/RequirePermission';
import RequireInternalLionTv from '../routes/RequireInternalLionTv';

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
const ReferralLeadsLionTv = Loadable(lazy(() => import('views/liontv/ReferralLeadsLionTv')));
const EmailTemplatesLionTv = Loadable(lazy(() => import('views/liontv/EmailTemplatesLionTv')));
const EmailCampaignsLionTv = Loadable(lazy(() => import('views/liontv/EmailCampaignsLionTv')));
const ContentAutomationLionTv = Loadable(lazy(() => import('views/liontv/ContentAutomationLionTv')));
const VodPostsLionTv = Loadable(lazy(() => import('views/liontv/VodPostsLionTv')));
const PaymentCommitmentsLionTv = Loadable(lazy(() => import('views/liontv/PaymentCommitmentsLionTv')));
const MoviesFeedLionTv = Loadable(lazy(() => import('views/liontv/MoviesFeedLionTv')));
const SeriesFeedLionTv = Loadable(lazy(() => import('views/liontv/SeriesFeedLionTv')));
const FutbolEventsFeedLionTv = Loadable(lazy(() => import('views/liontv/FutbolEventsFeedLionTv')));
const CatalogCurationLionTv = Loadable(lazy(() => import('views/liontv/CatalogCurationLionTv')));
const M3uLineSourcesLionTv = Loadable(lazy(() => import('views/liontv/M3uLineSourcesLionTv')));
const M3uBackupLinksLionTv = Loadable(lazy(() => import('views/liontv/M3uBackupLinksLionTv')));
const ManagedAccountsLionTv = Loadable(lazy(() => import('views/liontv/ManagedAccountsLionTv')));
const CustomerCrmLionTv = Loadable(lazy(() => import('views/liontv/CustomerCrmLionTv')));
const SubscriptionsLionTv = Loadable(lazy(() => import('views/liontv/SubscriptionsLionTv')));
const SubscriptionSharingLionTv = Loadable(lazy(() => import('views/liontv/SubscriptionSharingLionTv')));
const InvoicesLionTv = Loadable(lazy(() => import('views/liontv/InvoicesLionTv')));
const ResellerWalletLionTv = Loadable(lazy(() => import('views/liontv/ResellerWalletLionTv')));
const ResellerSupportLionTv = Loadable(lazy(() => import('views/liontv/ResellerSupportLionTv')));
const VipCustomersLionTv = Loadable(lazy(() => import('views/liontv/VipCustomersLionTv')));
const LoyaltyLionTv = Loadable(lazy(() => import('views/liontv/LoyaltyLionTv')));
const RafflesLionTv = Loadable(lazy(() => import('views/liontv/RafflesLionTv')));
const BusinessPurchasesLionTv = Loadable(lazy(() => import('views/liontv/BusinessPurchasesLionTv')));
const CreditRequestsLionTv = Loadable(lazy(() => import('views/liontv/CreditRequestsLionTv')));
const LicensesLionTv = Loadable(lazy(() => import('views/liontv/LicensesLionTv')));
const LinesLionTv = Loadable(lazy(() => import('views/liontv/LinesLionTv')));
const SubscriptionExpirationLionTv = Loadable(lazy(() => import('views/liontv/SubscriptionExpirationLionTv')));
const PlusLinesExplorer = Loadable(lazy(() => import('views/liontv/PlusLinesExplorer')));
const UserAccessAdmin = Loadable(lazy(() => import('views/security/UserAccessAdmin')));
const PanelAuthMultiAppAdmin = Loadable(lazy(() => import('views/security/PanelAuthMultiAppAdmin')));
const BanksCatalogAdmin = Loadable(lazy(() => import('views/security/catalogs/BanksCatalogAdmin')));
const ServicesCatalogAdmin = Loadable(lazy(() => import('views/security/catalogs/ServicesCatalogAdmin')));
const LicenseAppsCatalogAdmin = Loadable(lazy(() => import('views/security/catalogs/LicenseAppsCatalogAdmin')));
const CountryPhoneCodesCatalogAdmin = Loadable(lazy(() => import('views/security/catalogs/CountryPhoneCodesCatalogAdmin')));
const PackagesCatalogAdmin = Loadable(lazy(() => import('views/security/catalogs/PackagesCatalogAdmin')));

const protectPage = (permission, element, fallbackPath = '/dashboard/default', hideForReseller = false) => (
  <RequirePermission permission={permission} fallbackPath={fallbackPath}>
    {hideForReseller ? <RequireInternalLionTv>{element}</RequireInternalLionTv> : element}
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
          element: protectPage(
            { any: ['LIONTV_DASHBOARD_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW', 'ROLE_LIONTV_RESELLER_OWNER', 'LIONTV_RESELLER_OWNER'] },
            <LionTvDashboard />
          )
        },
        {
          path: '/liontv/demos',
          element: protectPage(
            { any: ['LIONTV_DEMOS_VIEW', 'LIONTV_CONTENT_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] },
            <DemosLionTv />
          )
        },
        {
          path: '/liontv/customers',
          element: protectPage({ any: ['LIONTV_CUSTOMERS_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] }, <CustomersLionTv />)
        },
        {
          path: '/liontv/potential-customers',
          element: protectPage(
            { any: ['LIONTV_POTENTIAL_CUSTOMERS_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] },
            <PotentialCustomersLionTv />,
            '/liontv/dashboard',
            true
          )
        },
        {
          path: '/liontv/referrals',
          element: protectPage(
            { any: ['LIONTV_POTENTIAL_CUSTOMERS_VIEW', 'LIONTV_CRM_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] },
            <ReferralLeadsLionTv />,
            '/liontv/dashboard',
            true
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
            <MoviesFeedLionTv />,
            '/liontv/dashboard',
            true
          )
        },
        {
          path: '/liontv/series-feed',
          element: protectPage(
            { any: ['LIONTV_FEED_VIEW', 'LIONTV_CONTENT_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] },
            <SeriesFeedLionTv />,
            '/liontv/dashboard',
            true
          )
        },
        {
          path: '/liontv/futbol-events-feed',
          element: protectPage(
            { any: ['LIONTV_FEED_VIEW', 'LIONTV_CONTENT_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] },
            <FutbolEventsFeedLionTv />,
            '/liontv/dashboard',
            true
          )
        },
        {
          path: '/liontv/catalog-curation',
          element: protectPage(
            { any: ['LIONTV_FEED_VIEW', 'LIONTV_CONTENT_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] },
            <CatalogCurationLionTv />,
            '/liontv/dashboard',
            true
          )
        },
        {
          path: '/liontv/m3u-line-sources',
          element: protectPage(
            { any: ['LIONTV_FEED_VIEW', 'LIONTV_CONTENT_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] },
            <M3uLineSourcesLionTv />,
            '/liontv/dashboard',
            true
          )
        },
        {
          path: '/liontv/m3u-backup-links',
          element: protectPage(
            { any: ['LIONTV_LINES_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] },
            <M3uBackupLinksLionTv />,
            '/liontv/dashboard',
            true
          )
        },
        {
          path: '/liontv/managed-accounts',
          element: protectPage(
            { any: ['LIONTV_MANAGED_ACCOUNTS_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW', 'ROLE_LIONTV_RESELLER_OWNER', 'LIONTV_RESELLER_OWNER'] },
            <ManagedAccountsLionTv />
          )
        },
        {
          path: '/liontv/subscription-expiration',
          element: protectPage(
            { any: ['LIONTV_SUBSCRIPTION_EXPIRATION_VIEW', 'LIONTV_TECH_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] },
            <SubscriptionExpirationLionTv />
          )
        },
        {
          path: '/liontv/crm',
          element: protectPage({ any: ['LIONTV_CRM_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] }, <CustomerCrmLionTv />)
        },
        {
          path: '/liontv/email-templates',
          element: protectPage(
            { any: ['LIONTV_EMAIL_TEMPLATES_VIEW', 'LIONTV_MARKETING_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] },
            <EmailTemplatesLionTv />
          )
        },
        {
          path: '/liontv/email-campaigns',
          element: protectPage(
            { any: ['LIONTV_EMAIL_CAMPAIGNS_VIEW', 'LIONTV_MARKETING_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] },
            <EmailCampaignsLionTv />
          )
        },
        {
          path: '/liontv/content-automation',
          element: protectPage(
            {
              any: [
                'LIONTV_CONTENT_AUTOMATION_VIEW',
                'ROLE_LIONTV_CONTENT_AUTOMATION_VIEW',
                'ROLE_ADMIN',
                'ADMIN',
                'ROLE_LIONTV_RESELLER_OWNER',
                'LIONTV_RESELLER_OWNER'
              ]
            },
            <ContentAutomationLionTv />
          )
        },
        {
          path: '/liontv/movies-series-posts',
          element: protectPage(
            {
              any: [
                'LIONTV_CONTENT_AUTOMATION_VIEW',
                'ROLE_LIONTV_CONTENT_AUTOMATION_VIEW',
                'ROLE_ADMIN',
                'ADMIN',
                'ROLE_LIONTV_RESELLER_OWNER',
                'LIONTV_RESELLER_OWNER'
              ]
            },
            <VodPostsLionTv />
          )
        },
        {
          path: '/liontv/subscriptions',
          element: protectPage({ any: ['LIONTV_SUBSCRIPTIONS_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] }, <SubscriptionsLionTv />)
        },
        {
          path: '/liontv/vip-customers',
          element: protectPage(
            { any: ['LIONTV_VIP_VIEW', 'LIONTV_CRM_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] },
            <VipCustomersLionTv />
          )
        },
        {
          path: '/liontv/loyalty',
          element: protectPage(
            { any: ['LIONTV_LOYALTY_VIEW', 'LIONTV_CRM_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] },
            <LoyaltyLionTv />
          )
        },
        {
          path: '/liontv/raffles',
          element: protectPage(
            { any: ['LIONTV_RAFFLES_VIEW', 'LIONTV_CRM_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] },
            <RafflesLionTv />,
            '/liontv/dashboard',
            true
          )
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
          path: '/liontv/reseller-wallet',
          element: protectPage(
            {
              any: [
                'LIONTV_RESELLER_WALLET_VIEW',
                'ROLE_LIONTV_RESELLER_WALLET_VIEW',
                'ROLE_ADMIN',
                'ADMIN',
                'ROLE_LIONTV_RESELLER_OWNER',
                'LIONTV_RESELLER_OWNER'
              ]
            },
            <ResellerWalletLionTv />
          )
        },
        {
          path: '/liontv/support',
          element: protectPage(
            {
              any: [
                'LIONTV_RESELLER_SUPPORT_VIEW',
                'ROLE_LIONTV_RESELLER_SUPPORT_VIEW',
                'ROLE_ADMIN',
                'ADMIN',
                'ROLE_LIONTV_RESELLER_OWNER',
                'LIONTV_RESELLER_OWNER'
              ]
            },
            <ResellerSupportLionTv />
          )
        },
        {
          path: '/liontv/business-purchases',
          element: protectPage(
            { any: ['LIONTV_BUSINESS_PURCHASES_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] },
            <BusinessPurchasesLionTv />
          )
        },
        {
          path: '/liontv/credit-requests',
          element: protectPage({ any: ['ROLE_ADMIN', 'ADMIN'] }, <CreditRequestsLionTv />, '/liontv/dashboard', true)
        },
        {
          path: '/liontv/licenses',
          element: protectPage({ any: ['LIONTV_LICENSES_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] }, <LicensesLionTv />)
        },
        {
          path: '/liontv/lines',
          element: protectPage({ any: ['LIONTV_LINES_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] }, <LinesLionTv />, '/liontv/dashboard')
        },
        {
          path: '/liontv/plus-lines',
          element: protectPage(
            { any: ['LIONTV_PLUS_LINES_VIEW', 'LIONTV_LINES_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] },
            <PlusLinesExplorer />,
            '/liontv/dashboard'
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
              path: '/admin/catalogs/banks',
              element: <BanksCatalogAdmin />
            },
            {
              path: '/admin/catalogs/services',
              element: <ServicesCatalogAdmin />
            },
            {
              path: '/admin/catalogs/license-apps',
              element: <LicenseAppsCatalogAdmin />
            },
            {
              path: '/admin/catalogs/country-phone-codes',
              element: <CountryPhoneCodesCatalogAdmin />
            },
            {
              path: '/admin/catalogs/packages',
              element: <PackagesCatalogAdmin />
            }
          ]
        },
        {
          element: (
            <RequirePermission
              permission={{
                any: [
                  'USER_MANAGEMENT_VIEW',
                  'ROLE_USER_MANAGEMENT_VIEW',
                  'ROLE_ADMIN',
                  'ADMIN',
                  'ROLE_LIONTV_RESELLER_OWNER',
                  'LIONTV_RESELLER_OWNER'
                ]
              }}
            />
          ),
          children: [
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
