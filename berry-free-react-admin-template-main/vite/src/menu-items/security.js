import { IconDatabase, IconKey, IconShieldLock } from '@tabler/icons-react';

const icons = {
  IconShieldLock,
  IconKey,
  IconDatabase
};

const security = {
  id: 'security',
  title: 'menu.security',
  type: 'group',
  resellerVisible: false,
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
    },
    {
      id: 'security-catalogs',
      title: 'menu.catalogs',
      caption: 'menu.catalogsCaption',
      type: 'collapse',
      icon: icons.IconDatabase,
      permission: { any: ['USER_MANAGEMENT_VIEW', 'ROLE_USER_MANAGEMENT_VIEW', 'ROLE_ADMIN', 'ADMIN'] },
      children: [
        {
          id: 'security-catalogs-banks',
          title: 'menu.catalogBanks',
          type: 'item',
          url: '/admin/catalogs/banks',
          breadcrumbs: true,
          permission: { any: ['USER_MANAGEMENT_VIEW', 'ROLE_USER_MANAGEMENT_VIEW', 'ROLE_ADMIN', 'ADMIN'] }
        },
        {
          id: 'security-catalogs-services',
          title: 'menu.catalogServices',
          type: 'item',
          url: '/admin/catalogs/services',
          breadcrumbs: true,
          permission: { any: ['USER_MANAGEMENT_VIEW', 'ROLE_USER_MANAGEMENT_VIEW', 'ROLE_ADMIN', 'ADMIN'] }
        },
        {
          id: 'security-catalogs-license-apps',
          title: 'menu.catalogLicenseApps',
          type: 'item',
          url: '/admin/catalogs/license-apps',
          breadcrumbs: true,
          permission: { any: ['USER_MANAGEMENT_VIEW', 'ROLE_USER_MANAGEMENT_VIEW', 'ROLE_ADMIN', 'ADMIN'] }
        },
        {
          id: 'security-catalogs-country-phone-codes',
          title: 'menu.catalogCountryPhoneCodes',
          type: 'item',
          url: '/admin/catalogs/country-phone-codes',
          breadcrumbs: true,
          permission: { any: ['USER_MANAGEMENT_VIEW', 'ROLE_USER_MANAGEMENT_VIEW', 'ROLE_ADMIN', 'ADMIN'] }
        },
        {
          id: 'security-catalogs-packages',
          title: 'menu.catalogPackages',
          type: 'item',
          url: '/admin/catalogs/packages',
          breadcrumbs: true,
          permission: { any: ['USER_MANAGEMENT_VIEW', 'ROLE_USER_MANAGEMENT_VIEW', 'ROLE_ADMIN', 'ADMIN'] }
        }
      ]
    }
  ]
};

export default security;
