import { withAlpha } from 'utils/colorUtils';

export const statusOptions = [
  { value: '', label: 'Todos' },
  { value: 'ACTIVE', label: 'Activas' },
  { value: 'EXPIRED', label: 'Vencidas' },
  { value: 'SUSPENDED', label: 'Suspendidas' }
];

export const requestStatusOptions = [
  { value: '', label: 'Todas' },
  { value: 'PENDING_PAYMENT', label: 'Pendientes de pago' },
  { value: 'ACTIVATED', label: 'Activadas' },
  { value: 'REJECTED', label: 'Rechazadas' }
];

export const sessionStatusOptions = [
  { value: '', label: 'Todas' },
  { value: 'ACTIVE', label: 'Activas' },
  { value: 'REVOKED', label: 'Desconectadas' }
];

export const statusUpdatePermissions = [
  'ROLE_ADMIN',
  'ADMIN',
  'USER_MANAGEMENT_DISABLE_USER',
  'ROLE_USER_MANAGEMENT_DISABLE_USER',
  'USER_MANAGEMENT_EDIT_USER',
  'ROLE_USER_MANAGEMENT_EDIT_USER',
  'USER_MANAGEMENT_CREATE_USER',
  'ROLE_USER_MANAGEMENT_CREATE_USER'
];

export const viewPermissions = ['ROLE_ADMIN', 'ADMIN', 'USER_MANAGEMENT_VIEW', 'ROLE_USER_MANAGEMENT_VIEW'];

export function statusColor(status) {
  const value = String(status || '').toUpperCase();
  if (value === 'ACTIVE') return 'success';
  if (value === 'EXPIRED') return 'warning';
  if (value === 'SUSPENDED') return 'default';
  return 'info';
}

export function requestStatusColor(status) {
  const value = String(status || '').toUpperCase();
  if (value === 'PENDING_PAYMENT') return 'warning';
  if (value === 'ACTIVATED') return 'success';
  if (value === 'REJECTED') return 'default';
  return 'info';
}

export function sessionStatusColor(status) {
  const value = String(status || '').toUpperCase();
  if (value === 'ACTIVE') return 'success';
  if (value === 'REVOKED') return 'default';
  return 'info';
}

export function formatDateTime(value, locale = 'es-HN') {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString(locale);
}

export function maskDeviceHash(value) {
  const text = String(value || '');
  if (!text) return '-';
  return `...${text.slice(-8).toUpperCase()}`;
}

export function getErrorMessage(error, fallback) {
  return error?.response?.data?.message || error?.message || fallback;
}

export const surfaceSx = (theme) => ({
  borderRadius: 2,
  border: '1px solid',
  borderColor: withAlpha(theme.palette.divider, 0.92),
  backgroundColor: theme.vars?.palette?.surface?.card || theme.palette.background.paper,
  boxShadow: theme.palette.mode === 'dark' ? `0 14px 30px ${withAlpha('#020617', 0.36)}` : `0 12px 24px ${withAlpha('#0f172a', 0.08)}`
});

export const tableContainerSx = (theme) => ({
  ...surfaceSx(theme),
  overflowX: 'auto'
});

export const modalPaperSx = (theme) => ({
  borderRadius: 2,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.vars?.palette?.surface?.card || theme.palette.background.paper,
  overflow: 'hidden'
});

export const modalContentSx = {
  px: { xs: 1.5, sm: 3 },
  py: { xs: 1.75, sm: 2.5 },
  '& .MuiFormControl-root, & .MuiTextField-root': {
    width: '100%',
    minWidth: 0
  }
};

export const modalActionsSx = (theme) => ({
  px: { xs: 1.5, sm: 3 },
  py: { xs: 1.5, sm: 2 },
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: withAlpha(theme.vars?.palette?.surface?.muted || theme.palette.background.default, 0.86),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column-reverse',
    alignItems: 'stretch',
    gap: 1,
    '& > .MuiButton-root': {
      width: '100%'
    }
  }
});

export const tabsSx = (theme) => ({
  minHeight: 44,
  borderRadius: 2,
  border: '1px solid',
  borderColor: withAlpha(theme.palette.divider, 0.92),
  backgroundColor: withAlpha(theme.vars?.palette?.surface?.muted || theme.palette.background.default, theme.palette.mode === 'dark' ? 0.78 : 0.58),
  px: 0.75,
  '& .MuiTab-root': {
    minHeight: 42,
    borderRadius: 1.5,
    textTransform: 'none',
    fontWeight: 700,
    color: theme.palette.text.secondary
  },
  '& .MuiTab-root.Mui-selected': {
    color: theme.palette.text.primary
  },
  '& .MuiTabs-indicator': {
    height: 32,
    borderRadius: 1.4,
    backgroundColor: withAlpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.22 : 0.14),
    marginBottom: 5,
    zIndex: 0
  },
  '& .MuiTab-root > *': {
    position: 'relative',
    zIndex: 1
  }
});
