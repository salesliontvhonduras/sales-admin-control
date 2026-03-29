import {
  IconDeviceTv,
  IconUsers,
  IconReceipt2,
  IconFileInvoice,
  IconRouter,
  IconLink,
  IconUserPlus,
  IconMailCog,
  IconDashboard,
  IconUserSearch,
  IconKey
} from '@tabler/icons-react';

const icons = {
  IconDeviceTv,
  IconUsers,
  IconReceipt2,
  IconFileInvoice,
  IconRouter,
  IconKey,
  IconUserSearch,
  IconLink,
  IconUserPlus,
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
      title: 'Resumen',
      caption: 'Control diario y prioridades',
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
      title: 'Clientes y Ventas',
      caption: 'CRM, cobros y relación comercial',
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
          id: 'liontv-crm',
          title: 'menu.crm',
          type: 'item',
          url: '/liontv/crm',
          breadcrumbs: true,
          permission: { any: ['LIONTV_CRM_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] }
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
      id: 'liontv-operations',
      title: 'Operación Técnica',
      caption: 'Inventario, líneas y cuentas',
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
          title: 'Plus lines',
          type: 'item',
          url: '/liontv/plus-lines',
          breadcrumbs: true,
          permission: { any: ['LIONTV_PLUS_LINES_VIEW', 'LIONTV_LINES_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] }
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
          title: 'Managed Accounts',
          type: 'item',
          url: '/liontv/managed-accounts',
          breadcrumbs: true,
          permission: { any: ['LIONTV_MANAGED_ACCOUNTS_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] }
        }
      ]
    },
    {
      id: 'liontv-content',
      title: 'Contenido y Feed',
      caption: 'Demos y catálogo visible',
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
          title: 'Movies Feed',
          type: 'item',
          url: '/liontv/movies-feed',
          breadcrumbs: true,
          permission: { any: ['LIONTV_FEED_VIEW', 'LIONTV_CONTENT_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] }
        },
        {
          id: 'liontv-series-feed',
          title: 'Series Feed',
          type: 'item',
          url: '/liontv/series-feed',
          breadcrumbs: true,
          permission: { any: ['LIONTV_FEED_VIEW', 'LIONTV_CONTENT_VIEW', 'LIONTV_VIEW', 'ROLE_LIONTV_VIEW'] }
        },
        {
          id: 'liontv-futbol-events-feed',
          title: 'Futbol Events Feed',
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
