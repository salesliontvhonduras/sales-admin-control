import { IconDeviceTv, IconUsers, IconReceipt2, IconFileInvoice, IconRouter } from '@tabler/icons-react';

const icons = {
  IconDeviceTv,
  IconUsers,
  IconReceipt2,
  IconFileInvoice,
  IconRouter
};

const liontv = {
  id: 'liontv',
  title: 'Lion TV',
  type: 'group',
  children: [
    {
      id: 'liontv-demos',
      title: 'Demos Lion Tv',
      type: 'item',
      url: '/liontv/demos',
      icon: icons.IconDeviceTv,
      breadcrumbs: true
    },
    {
      id: 'liontv-subscriptions',
      title: 'Suscripciones',
      type: 'item',
      url: '/liontv/subscriptions',
      icon: icons.IconReceipt2,
      breadcrumbs: true
    },
    {
      id: 'liontv-invoices',
      title: 'Facturas',
      type: 'item',
      url: '/liontv/invoices',
      icon: icons.IconFileInvoice,
      breadcrumbs: true
    },
    {
      id: 'liontv-customers',
      title: 'Clientes',
      type: 'item',
      url: '/liontv/customers',
      icon: icons.IconUsers,
      breadcrumbs: true
    },
    {
      id: 'liontv-lines',
      title: 'Líneas',
      type: 'item',
      url: '/liontv/lines',
      icon: icons.IconRouter,
      breadcrumbs: true
    }
  ]
};

export default liontv;
