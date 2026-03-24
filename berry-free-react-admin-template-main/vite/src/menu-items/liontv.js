import { IconDeviceTv, IconUsers, IconReceipt2, IconFileInvoice, IconRouter, IconLink, IconUserPlus } from '@tabler/icons-react';
import { IconKey, IconUserSearch } from '@tabler/icons-react';

const icons = {
  IconDeviceTv,
  IconUsers,
  IconReceipt2,
  IconFileInvoice,
  IconRouter,
  IconKey,
  IconUserSearch,
  IconLink,
  IconUserPlus
};

const liontv = {
  id: 'liontv',
  title: 'menu.liontv',
  type: 'group',
  children: [
    {
      id: 'liontv-demos',
      title: 'menu.demos',
      type: 'item',
      url: '/liontv/demos',
      icon: icons.IconDeviceTv,
      breadcrumbs: true
    },
    {
      id: 'liontv-subscriptions',
      title: 'menu.subscriptions',
      type: 'item',
      url: '/liontv/subscriptions',
      icon: icons.IconReceipt2,
      breadcrumbs: true
    },
    {
      id: 'liontv-invoices',
      title: 'menu.invoices',
      type: 'item',
      url: '/liontv/invoices',
      icon: icons.IconFileInvoice,
      breadcrumbs: true
    },
    {
      id: 'liontv-business-purchases',
      title: 'menu.businessPurchases',
      type: 'item',
      url: '/liontv/business-purchases',
      icon: icons.IconFileInvoice,
      breadcrumbs: true
    },
    {
      id: 'liontv-customers',
      title: 'menu.customers',
      type: 'item',
      url: '/liontv/customers',
      icon: icons.IconUsers,
      breadcrumbs: true
    },
    {
      id: 'liontv-potential-customers',
      title: 'menu.potentialCustomers',
      type: 'item',
      url: '/liontv/potential-customers',
      icon: icons.IconUserPlus,
      breadcrumbs: true
    },
    {
      id: 'liontv-payment-commitments',
      title: 'menu.paymentCommitments',
      type: 'item',
      url: '/liontv/payment-commitments',
      icon: icons.IconFileInvoice,
      breadcrumbs: true
    },
    {
      id: 'liontv-movies-feed',
      title: 'Movies Feed',
      type: 'item',
      url: '/liontv/movies-feed',
      icon: icons.IconDeviceTv,
      breadcrumbs: true
    },
    {
      id: 'liontv-series-feed',
      title: 'Series Feed',
      type: 'item',
      url: '/liontv/series-feed',
      icon: icons.IconLink,
      breadcrumbs: true
    },
    {
      id: 'liontv-futbol-events-feed',
      title: 'Futbol Events Feed',
      type: 'item',
      url: '/liontv/futbol-events-feed',
      icon: icons.IconDeviceTv,
      breadcrumbs: true
    },
    {
      id: 'liontv-crm',
      title: 'menu.crm',
      type: 'item',
      url: '/liontv/crm',
      icon: icons.IconUserSearch,
      breadcrumbs: true
    },
    {
      id: 'liontv-lines',
      title: 'menu.lines',
      type: 'item',
      url: '/liontv/lines',
      icon: icons.IconRouter,
      breadcrumbs: true
    },
    {
      id: 'liontv-plus-lines',
      title: 'Plus lines',
      type: 'item',
      url: '/liontv/plus-lines',
      icon: icons.IconLink,
      breadcrumbs: true
    },
    {
      id: 'liontv-licenses',
      title: 'menu.licenses',
      type: 'item',
      url: '/liontv/licenses',
      icon: icons.IconKey,
      breadcrumbs: true
    }
  ]
};

export default liontv;
