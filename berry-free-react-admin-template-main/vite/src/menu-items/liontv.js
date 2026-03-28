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
  children: [
    {
      id: 'liontv-overview',
      title: 'Resumen',
      caption: 'Control diario y prioridades',
      type: 'collapse',
      icon: icons.IconDashboard,
      children: [
        {
          id: 'liontv-dashboard',
          title: 'menu.liontvDashboard',
          type: 'item',
          url: '/liontv/dashboard',
          breadcrumbs: true
        }
      ]
    },
    {
      id: 'liontv-commercial',
      title: 'Clientes y Ventas',
      caption: 'CRM, cobros y relación comercial',
      type: 'collapse',
      icon: icons.IconUsers,
      children: [
        {
          id: 'liontv-customers',
          title: 'menu.customers',
          type: 'item',
          url: '/liontv/customers',
          breadcrumbs: true
        },
        {
          id: 'liontv-potential-customers',
          title: 'menu.potentialCustomers',
          type: 'item',
          url: '/liontv/potential-customers',
          breadcrumbs: true
        },
        {
          id: 'liontv-crm',
          title: 'menu.crm',
          type: 'item',
          url: '/liontv/crm',
          breadcrumbs: true
        },
        {
          id: 'liontv-subscriptions',
          title: 'menu.subscriptions',
          type: 'item',
          url: '/liontv/subscriptions',
          breadcrumbs: true
        },
        {
          id: 'liontv-invoices',
          title: 'menu.invoices',
          type: 'item',
          url: '/liontv/invoices',
          breadcrumbs: true
        },
        {
          id: 'liontv-payment-commitments',
          title: 'menu.paymentCommitments',
          type: 'item',
          url: '/liontv/payment-commitments',
          breadcrumbs: true
        },
        {
          id: 'liontv-business-purchases',
          title: 'menu.businessPurchases',
          type: 'item',
          url: '/liontv/business-purchases',
          breadcrumbs: true
        }
      ]
    },
    {
      id: 'liontv-operations',
      title: 'Operación Técnica',
      caption: 'Inventario, líneas y cuentas',
      type: 'collapse',
      icon: icons.IconRouter,
      children: [
        {
          id: 'liontv-lines',
          title: 'menu.lines',
          type: 'item',
          url: '/liontv/lines',
          breadcrumbs: true
        },
        {
          id: 'liontv-plus-lines',
          title: 'Plus lines',
          type: 'item',
          url: '/liontv/plus-lines',
          breadcrumbs: true
        },
        {
          id: 'liontv-licenses',
          title: 'menu.licenses',
          type: 'item',
          url: '/liontv/licenses',
          breadcrumbs: true
        },
        {
          id: 'liontv-managed-accounts',
          title: 'Managed Accounts',
          type: 'item',
          url: '/liontv/managed-accounts',
          breadcrumbs: true
        }
      ]
    },
    {
      id: 'liontv-content',
      title: 'Contenido y Feed',
      caption: 'Demos y catálogo visible',
      type: 'collapse',
      icon: icons.IconDeviceTv,
      children: [
        {
          id: 'liontv-demos',
          title: 'menu.demos',
          type: 'item',
          url: '/liontv/demos',
          breadcrumbs: true
        },
        {
          id: 'liontv-movies-feed',
          title: 'Movies Feed',
          type: 'item',
          url: '/liontv/movies-feed',
          breadcrumbs: true
        },
        {
          id: 'liontv-series-feed',
          title: 'Series Feed',
          type: 'item',
          url: '/liontv/series-feed',
          breadcrumbs: true
        },
        {
          id: 'liontv-futbol-events-feed',
          title: 'Futbol Events Feed',
          type: 'item',
          url: '/liontv/futbol-events-feed',
          breadcrumbs: true
        }
      ]
    }
  ]
};

export default liontv;
