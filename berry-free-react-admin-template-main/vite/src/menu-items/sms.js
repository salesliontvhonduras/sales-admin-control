// assets
import { IconMessages } from '@tabler/icons-react';

const icons = { IconMessages };

const sms = {
  id: 'sms',
  title: 'menu.sms',
  type: 'group',
  permission: { any: ['SMS_VIEW', 'ROLE_SMS_VIEW'] },
  children: [
    {
      id: 'sms-management',
      title: 'menu.smsManagement',
      type: 'item',
      url: '/sms/management',
      icon: icons.IconMessages,
      breadcrumbs: true,
      permission: { any: ['SMS_VIEW', 'ROLE_SMS_VIEW', 'SMS_MANAGEMENT_VIEW'] }
    }
  ]
};

export default sms;
