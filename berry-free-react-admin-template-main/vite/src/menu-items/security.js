import { IconKey, IconShieldLock } from '@tabler/icons-react';

const icons = {
  IconShieldLock,
  IconKey
};

const security = {
  id: 'security',
  title: 'menu.security',
  type: 'group',
  permission: { any: ['USER_MANAGEMENT_VIEW', 'ROLE_USER_MANAGEMENT_VIEW', 'ROLE_ADMIN', 'ADMIN'] },
  children: [
    {
      id: 'security-user-access',
      title: 'menu.userAccess',
      caption: 'menu.userAccessCaption',
      type: 'item',
      url: '/admin/users-access',
      icon: icons.IconShieldLock,
      breadcrumbs: true,
      permission: { any: ['USER_MANAGEMENT_VIEW', 'ROLE_USER_MANAGEMENT_VIEW', 'ROLE_ADMIN', 'ADMIN'] }
    },
    {
      id: 'security-panel-auths',
      title: 'menu.panelAuths',
      caption: 'menu.panelAuthsCaption',
      type: 'item',
      url: '/admin/panel-auths',
      icon: icons.IconKey,
      breadcrumbs: true,
      permission: { any: ['USER_MANAGEMENT_VIEW', 'ROLE_USER_MANAGEMENT_VIEW', 'ROLE_ADMIN', 'ADMIN'] }
    }
  ]
};

export default security;
