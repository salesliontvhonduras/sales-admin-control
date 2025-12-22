import { IconDeviceTv, IconUsers, IconReceipt2 } from '@tabler/icons-react';

const icons = {
  IconDeviceTv,
  IconUsers,
  IconReceipt2
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
      id: 'liontv-customers',
      title: 'Clientes',
      type: 'item',
      url: '/liontv/customers',
      icon: icons.IconUsers,
      breadcrumbs: true
    }
  ]
};

export default liontv;
