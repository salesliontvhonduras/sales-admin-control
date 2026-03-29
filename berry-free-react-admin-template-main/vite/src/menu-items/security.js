import { IconShieldLock } from '@tabler/icons-react';

const icons = {
  IconShieldLock
};

const security = {
  id: 'security',
  title: 'Seguridad',
  type: 'group',
  permission: { any: ['USER_MANAGEMENT_VIEW', 'ROLE_USER_MANAGEMENT_VIEW', 'ROLE_ADMIN', 'ADMIN'] },
  children: [
    {
      id: 'security-user-access',
      title: 'Usuarios y Accesos',
      caption: 'Roles y permisos',
      type: 'item',
      url: '/admin/users-access',
      icon: icons.IconShieldLock,
      breadcrumbs: true,
      permission: { any: ['USER_MANAGEMENT_VIEW', 'ROLE_USER_MANAGEMENT_VIEW', 'ROLE_ADMIN', 'ADMIN'] }
    }
  ]
};

export default security;
