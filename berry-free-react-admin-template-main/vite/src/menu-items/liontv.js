import { IconDeviceTv } from '@tabler/icons-react';

const icons = {
  IconDeviceTv
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
    }
  ]
};

export default liontv;
