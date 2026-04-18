import {
  IconDeviceTv,
  IconCrown,
  IconGift,
  IconUsers,
  IconReceipt2,
  IconFileInvoice,
  IconRouter,
  IconMailCog,
  IconDashboard,
  IconUserSearch,
  IconKey
} from '@tabler/icons-react';

const icons = {
  IconCrown,
  IconDeviceTv,
  IconGift,
  IconUsers,
  IconReceipt2,
  IconFileInvoice,
  IconRouter,
  IconKey,
  IconUserSearch,
  IconMailCog,
  IconDashboard
};

const liontv = {
  id: 'liontv',
  title: 'menu.liontv',
  type: 'group',
  permission: { any: ['LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] },
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
          id: 'liontv-potential-customers',
          title: 'menu.potentialCustomers',
          type: 'item',
          url: '/liontv/potential-customers',
          breadcrumbs: true,
          permission: { any: ['LIONTV_POTENTIAL_CUSTOMERS_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] }
        },
        {
          id: 'liontv-referrals',
          title: 'menu.referrals',
          type: 'item',
          url: '/liontv/referrals',
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
        }
      ]
    },
    {
      id: 'liontv-marketing',
      title: 'menu.liontvMarketing',
      caption: 'menu.liontvMarketingCaption',
      type: 'collapse',
      icon: icons.IconMailCog,
      permission: { any: ['LIONTV_EMAIL_TEMPLATES_VIEW', 'LIONTV_EMAIL_CAMPAIGNS_VIEW', 'LIONTV_MARKETING_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] },
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
        }
      ]
    },
    {
      id: 'liontv-operations',
      title: 'menu.liontvOperations',
      caption: 'menu.liontvOperationsCaption',
      type: 'collapse',
      icon: icons.IconRouter,
      permission: { any: ['LIONTV_TECH_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] },
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
          id: 'liontv-managed-accounts',
          title: 'menu.managedAccounts',
          type: 'item',
          url: '/liontv/managed-accounts',
          breadcrumbs: true,
          permission: { any: ['LIONTV_MANAGED_ACCOUNTS_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] }
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
          breadcrumbs: true,
          permission: { any: ['LIONTV_FEED_VIEW', 'LIONTV_CONTENT_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] }
        },
        {
          id: 'liontv-series-feed',
          title: 'menu.seriesFeed',
          type: 'item',
          url: '/liontv/series-feed',
          breadcrumbs: true,
          permission: { any: ['LIONTV_FEED_VIEW', 'LIONTV_CONTENT_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] }
        },
        {
          id: 'liontv-futbol-events-feed',
          title: 'menu.futbolEventsFeed',
          type: 'item',
          url: '/liontv/futbol-events-feed',
          breadcrumbs: true,
          permission: { any: ['LIONTV_FEED_VIEW', 'LIONTV_CONTENT_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] }
        }
      ]
    }
  ]
};

export default liontv;
