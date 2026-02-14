// assets
import { IconMessages } from '@tabler/icons-react';

const icons = { IconMessages };

const sms = {
  id: 'sms',
  title: 'menu.sms',
  type: 'group',
  children: [
    {
      id: 'sms-management',
      title: 'menu.smsManagement',
      type: 'item',
      url: '/sms/management',
      icon: icons.IconMessages,
      breadcrumbs: true
    }
  ]
};

export default sms;
