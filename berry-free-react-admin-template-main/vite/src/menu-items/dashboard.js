// assets
import { IconDashboard } from '@tabler/icons-react';

// constant
const icons = { IconDashboard };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  id: 'dashboard',
  title: 'menu.dashboard',
  type: 'group',
  permission: { any: ['DASHBOARD_VIEW', 'ROLE_DASHBOARD_VIEW'] },
  children: [
    {
      id: 'default',
      title: 'menu.dashboard',
      type: 'item',
      url: '/dashboard/default',
      icon: icons.IconDashboard,
      breadcrumbs: false,
      permission: { any: ['DASHBOARD_VIEW', 'ROLE_DASHBOARD_VIEW'] }
    }
  ]
};

export default dashboard;
