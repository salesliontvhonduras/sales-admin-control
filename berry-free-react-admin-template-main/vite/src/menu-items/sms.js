// assets
import { IconMessages } from '@tabler/icons-react';

const icons = { IconMessages };

const sms = {
  id: 'sms',
  title: 'Sms',
  type: 'group',
  children: [
    {
      id: 'sms-management',
      title: 'Sms Management',
      type: 'item',
      url: '/sms/management',
      icon: icons.IconMessages,
      breadcrumbs: true
    }
  ]
};

export default sms;
