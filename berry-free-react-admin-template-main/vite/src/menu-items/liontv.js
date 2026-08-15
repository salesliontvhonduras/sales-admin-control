import {
  IconDeviceTv,
  IconCrown,
  IconUsers,
  IconReceipt2,
  IconFileInvoice,
  IconRouter,
  IconMailCog,
  IconDashboard,
  IconUserSearch,
  IconKey,
  IconAlertTriangle
} from '@tabler/icons-react';

const icons = {
  IconCrown,
  IconDeviceTv,
  IconUsers,
  IconReceipt2,
  IconFileInvoice,
  IconRouter,
  IconKey,
  IconUserSearch,
  IconMailCog,
  IconDashboard,
  IconAlertTriangle
};

const liontv = {
  id: 'liontv',
  title: 'menu.liontv',
  type: 'group',
  permission: { any: ['LIONTV_VIEW', 'ROLE_LIONTV_VIEW', 'LIONTV_DEMOS_VIEW', 'ROLE_LIONTV_DEMOS_VIEW'] },
  children: [
    {
      id: 'liontv-overview',
      title: 'menu.liontvOverview',
      caption: 'menu.liontvOverviewCaption',
      type: 'collapse',
      icon: icons.IconDashboard,
      permission: { any: ['LIONTV_DASHBOARD_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] },
      children: [
        {
          id: 'liontv-dashboard',
          title: 'menu.liontvDashboard',
          type: 'item',
          url: '/liontv/dashboard',
          breadcrumbs: true,
          permission: { any: ['LIONTV_DASHBOARD_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] }
        },
        {
          id: 'liontv-reseller-admin',
          title: 'Resellers',
          type: 'item',
          url: '/liontv/resellers',
          resellerVisible: false,
          breadcrumbs: true,
          permission: { any: ['ROLE_ADMIN', 'ADMIN', 'LIONTV_SUPER_RESELLER_MANAGE', 'ROLE_LIONTV_SUPER_RESELLER_MANAGE'] }
        },
        {
          id: 'liontv-reseller-wallet',
          title: 'menu.resellerWallet',
          type: 'item',
          url: '/liontv/reseller-wallet',
          resellerOnly: true,
          breadcrumbs: true,
          permission: {
            any: [
              'LIONTV_RESELLER_WALLET_VIEW',
              'ROLE_LIONTV_RESELLER_WALLET_VIEW',
              'ROLE_ADMIN',
              'ADMIN'
            ]
          }
        },
        {
          id: 'liontv-reseller-support',
          title: 'menu.resellerSupport',
          type: 'item',
          url: '/liontv/support',
          resellerOnly: true,
          breadcrumbs: true,
          permission: {
            any: [
              'LIONTV_RESELLER_SUPPORT_VIEW',
              'ROLE_LIONTV_RESELLER_SUPPORT_VIEW',
              'ROLE_ADMIN',
              'ADMIN'
            ]
          }
        },
        {
          id: 'liontv-ecommerce-contact-routing',
          title: 'menu.ecommerceContactRouting',
          type: 'item',
          url: '/liontv/ecommerce-contact-routing',
          resellerVisible: false,
          breadcrumbs: true,
          permission: { any: ['ROLE_ADMIN', 'ADMIN'] }
        },
        {
          id: 'liontv-ecommerce-settings',
          title: 'menu.ecommerceSettings',
          type: 'item',
          url: '/liontv/ecommerce-settings',
          resellerVisible: false,
          breadcrumbs: true,
          permission: { any: ['ROLE_ADMIN', 'ADMIN'] }
        },
        {
          id: 'liontv-pay-per-view-payments',
          title: 'menu.payPerViewPayments',
          type: 'item',
          url: '/liontv/pay-per-view-payments',
          resellerVisible: false,
          breadcrumbs: true,
          permission: { any: ['ROLE_ADMIN', 'ADMIN'] }
        },
        {
          id: 'liontv-paypal-checkout',
          title: 'Checkout Online',
          type: 'item',
          url: '/liontv/paypal-checkout',
          resellerVisible: false,
          breadcrumbs: true,
          permission: { any: ['ROLE_ADMIN', 'ADMIN'] }
        }
      ]
    },
    {
      id: 'liontv-commercial',
      title: 'menu.liontvCommercial',
      caption: 'menu.liontvCommercialCaption',
      type: 'collapse',
      icon: icons.IconUsers,
      permission: { any: ['LIONTV_CRM_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] },
      children: [
        {
          id: 'liontv-customers',
          title: 'menu.customers',
          type: 'item',
          url: '/liontv/customers',
          breadcrumbs: true,
          permission: { any: ['LIONTV_CUSTOMERS_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] }
        },
        {
          id: 'liontv-sales-workflow',
          title: 'menu.salesWorkflow',
          type: 'item',
          url: '/liontv/sales-workflow',
          breadcrumbs: true,
          permission: { any: ['LIONTV_CUSTOMERS_VIEW', 'LIONTV_SUBSCRIPTIONS_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] }
        },
        {
          id: 'liontv-potential-customers',
          title: 'menu.potentialCustomers',
          type: 'item',
          url: '/liontv/potential-customers',
          resellerVisible: false,
          breadcrumbs: true,
          permission: { any: ['LIONTV_POTENTIAL_CUSTOMERS_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] }
        },
        {
          id: 'liontv-referrals',
          title: 'menu.referrals',
          type: 'item',
          url: '/liontv/referrals',
          resellerVisible: false,
          breadcrumbs: true,
          permission: { any: ['LIONTV_POTENTIAL_CUSTOMERS_VIEW', 'LIONTV_CRM_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] }
        },
        {
          id: 'liontv-crm',
          title: 'menu.crm',
          type: 'item',
          url: '/liontv/crm',
          breadcrumbs: true,
          permission: { any: ['LIONTV_CRM_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] }
        },
        {
          id: 'liontv-vip-customers',
          title: 'menu.vipCustomers',
          type: 'item',
          url: '/liontv/vip-customers',
          breadcrumbs: true,
          permission: { any: ['LIONTV_VIP_VIEW', 'LIONTV_CRM_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] }
        },
        {
          id: 'liontv-loyalty',
          title: 'menu.loyalty',
          type: 'item',
          url: '/liontv/loyalty',
          breadcrumbs: true,
          permission: { any: ['LIONTV_LOYALTY_VIEW', 'LIONTV_CRM_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] }
        },
        {
          id: 'liontv-raffles',
          title: 'menu.raffles',
          type: 'item',
          url: '/liontv/raffles',
          resellerVisible: false,
          breadcrumbs: true,
          permission: { any: ['LIONTV_RAFFLES_VIEW', 'LIONTV_CRM_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] }
        },
        {
          id: 'liontv-subscriptions',
          title: 'menu.subscriptions',
          type: 'item',
          url: '/liontv/subscriptions',
          breadcrumbs: true,
          permission: { any: ['LIONTV_SUBSCRIPTIONS_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] }
        },
        {
          id: 'liontv-subscription-sharing',
          title: 'menu.subscriptionSharing',
          type: 'item',
          url: '/liontv/subscription-sharing',
          breadcrumbs: true,
          permission: { any: ['LIONTV_SUBSCRIPTION_SHARING_VIEW', 'LIONTV_SUBSCRIPTIONS_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] }
        },
        {
          id: 'liontv-invoices',
          title: 'menu.invoices',
          type: 'item',
          url: '/liontv/invoices',
          breadcrumbs: true,
          permission: { any: ['LIONTV_INVOICES_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] }
        },
        {
          id: 'liontv-payment-commitments',
          title: 'menu.paymentCommitments',
          type: 'item',
          url: '/liontv/payment-commitments',
          breadcrumbs: true,
          permission: { any: ['LIONTV_PAYMENT_COMMITMENTS_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] }
        },
        {
          id: 'liontv-business-purchases',
          title: 'menu.businessPurchases',
          type: 'item',
          url: '/liontv/business-purchases',
          breadcrumbs: true,
          permission: { any: ['LIONTV_BUSINESS_PURCHASES_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] }
        },
        {
          id: 'liontv-credit-requests',
          title: 'menu.creditRequests',
          type: 'item',
          url: '/liontv/credit-requests',
          resellerVisible: false,
          breadcrumbs: true,
          permission: { any: ['ROLE_ADMIN', 'ADMIN'] }
        }
      ]
    },
    {
      id: 'liontv-marketing',
      title: 'menu.liontvMarketing',
      caption: 'menu.liontvMarketingCaption',
      type: 'collapse',
      icon: icons.IconMailCog,
      permission: {
        any: [
          'LIONTV_EMAIL_TEMPLATES_VIEW',
          'LIONTV_EMAIL_CAMPAIGNS_VIEW',
          'LIONTV_CONTENT_AUTOMATION_VIEW',
          'ROLE_LIONTV_CONTENT_AUTOMATION_VIEW',
          'LIONTV_MARKETING_VIEW',
          'LIONTV_VIEW',
          'ROLE_LIONTV_VIEW'
        ]
      },
      children: [
        {
          id: 'liontv-email-templates',
          title: 'menu.emailTemplates',
          type: 'item',
          url: '/liontv/email-templates',
          breadcrumbs: true,
          permission: { any: ['LIONTV_EMAIL_TEMPLATES_VIEW', 'LIONTV_MARKETING_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] }
        },
        {
          id: 'liontv-email-campaigns',
          title: 'menu.emailCampaigns',
          type: 'item',
          url: '/liontv/email-campaigns',
          breadcrumbs: true,
          permission: { any: ['LIONTV_EMAIL_CAMPAIGNS_VIEW', 'LIONTV_MARKETING_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] }
        },
        {
          id: 'liontv-content-automation',
          title: 'menu.contentAutomation',
          type: 'item',
          url: '/liontv/content-automation',
          breadcrumbs: true,
          permission: {
            any: [
              'LIONTV_CONTENT_AUTOMATION_VIEW',
              'ROLE_LIONTV_CONTENT_AUTOMATION_VIEW',
              'ROLE_ADMIN',
              'ADMIN'
            ]
          }
        },
        {
          id: 'liontv-movies-series-posts',
          title: 'menu.moviesSeriesPosts',
          type: 'item',
          url: '/liontv/movies-series-posts',
          breadcrumbs: true,
          permission: {
            any: [
              'LIONTV_CONTENT_AUTOMATION_VIEW',
              'ROLE_LIONTV_CONTENT_AUTOMATION_VIEW',
              'ROLE_ADMIN',
              'ADMIN'
            ]
          }
        }
      ]
    },
    {
      id: 'liontv-operations',
      title: 'menu.liontvOperations',
      caption: 'menu.liontvOperationsCaption',
      type: 'collapse',
      icon: icons.IconRouter,
      permission: { any: ['LIONTV_TECH_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW', 'LIONTV_DEMOS_VIEW', 'ROLE_LIONTV_DEMOS_VIEW'] },
      children: [
        {
          id: 'liontv-lines',
          title: 'menu.lines',
          type: 'item',
          url: '/liontv/lines',
          breadcrumbs: true,
          permission: { any: ['LIONTV_LINES_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] }
        },
        {
          id: 'liontv-plus-lines',
          title: 'menu.plusLines',
          type: 'item',
          url: '/liontv/plus-lines',
          breadcrumbs: true,
          permission: { any: ['LIONTV_PLUS_LINES_VIEW', 'LIONTV_LINES_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] }
        },
        {
          id: 'liontv-m3u-backup-links',
          title: 'menu.m3uBackupLinks',
          type: 'item',
          url: '/liontv/m3u-backup-links',
          resellerVisible: false,
          breadcrumbs: true,
          permission: { any: ['LIONTV_LINES_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] }
        },
        {
          id: 'liontv-licenses',
          title: 'menu.licenses',
          type: 'item',
          url: '/liontv/licenses',
          breadcrumbs: true,
          permission: { any: ['LIONTV_LICENSES_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] }
        },
        {
          id: 'liontv-smarttube-premium',
          title: 'menu.smartTubePremium',
          type: 'item',
          url: '/liontv/smarttube-premium',
          resellerVisible: false,
          breadcrumbs: true,
          permission: {
            any: [
              'ROLE_ADMIN',
              'ADMIN',
              'ROLE_SUPER_ADMIN',
              'SUPER_ADMIN',
              'USER_MANAGEMENT_VIEW',
              'ROLE_USER_MANAGEMENT_VIEW',
              'USER_MANAGEMENT_CREATE_USER',
              'ROLE_USER_MANAGEMENT_CREATE_USER',
              'USER_MANAGEMENT_EDIT_USER',
              'ROLE_USER_MANAGEMENT_EDIT_USER',
              'USER_MANAGEMENT_DISABLE_USER',
              'ROLE_USER_MANAGEMENT_DISABLE_USER'
            ]
          }
        },
        {
          id: 'liontv-youtube-premium-demos',
          title: 'menu.youtubePremiumDemos',
          type: 'item',
          url: '/liontv/youtube-premium-demos',
          resellerVisible: false,
          breadcrumbs: true,
          permission: {
            any: [
              'ROLE_ADMIN',
              'ADMIN',
              'ROLE_SUPER_ADMIN',
              'SUPER_ADMIN',
              'LIONTV_DEMOS_VIEW',
              'ROLE_LIONTV_DEMOS_VIEW'
            ]
          }
        },
        {
          id: 'liontv-device-setup-requests',
          title: 'menu.deviceSetupRequests',
          type: 'item',
          url: '/liontv/device-setup-requests',
          resellerVisible: false,
          breadcrumbs: true,
          permission: { any: ['ROLE_ADMIN', 'ADMIN'] }
        },
        {
          id: 'liontv-managed-accounts',
          title: 'menu.managedAccounts',
          type: 'item',
          url: '/liontv/managed-accounts',
          breadcrumbs: true,
          permission: { any: ['LIONTV_MANAGED_ACCOUNTS_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] }
        },
        {
          id: 'liontv-subscription-expiration',
          title: 'menu.subscriptionExpiration',
          caption: 'menu.subscriptionExpirationCaption',
          type: 'item',
          url: '/liontv/subscription-expiration',
          breadcrumbs: true,
          permission: { any: ['LIONTV_SUBSCRIPTION_EXPIRATION_VIEW', 'LIONTV_TECH_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] }
        }
      ]
    },
    {
      id: 'liontv-content',
      title: 'menu.liontvContent',
      caption: 'menu.liontvContentCaption',
      type: 'collapse',
      icon: icons.IconDeviceTv,
      permission: { any: ['LIONTV_CONTENT_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] },
      children: [
        {
          id: 'liontv-demos',
          title: 'menu.demos',
          type: 'item',
          url: '/liontv/demos',
          breadcrumbs: true,
          permission: { any: ['LIONTV_DEMOS_VIEW', 'LIONTV_CONTENT_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] }
        },
        {
          id: 'liontv-movies-feed',
          title: 'menu.moviesFeed',
          type: 'item',
          url: '/liontv/movies-feed',
          resellerVisible: false,
          breadcrumbs: true,
          permission: { any: ['LIONTV_FEED_VIEW', 'LIONTV_CONTENT_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] }
        },
        {
          id: 'liontv-series-feed',
          title: 'menu.seriesFeed',
          type: 'item',
          url: '/liontv/series-feed',
          resellerVisible: false,
          breadcrumbs: true,
          permission: { any: ['LIONTV_FEED_VIEW', 'LIONTV_CONTENT_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] }
        },
        {
          id: 'liontv-futbol-events-feed',
          title: 'menu.futbolEventsFeed',
          type: 'item',
          url: '/liontv/futbol-events-feed',
          resellerVisible: false,
          breadcrumbs: true,
          permission: { any: ['LIONTV_FEED_VIEW', 'LIONTV_CONTENT_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] }
        }
      ]
    }
  ]
};

export default liontv;
