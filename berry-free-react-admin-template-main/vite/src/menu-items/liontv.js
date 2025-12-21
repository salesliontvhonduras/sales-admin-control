import { IconDeviceTv, IconUsers } from '@tabler/icons-react';

const icons = {
  IconDeviceTv,
  IconUsers
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
