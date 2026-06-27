import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import HubRoundedIcon from '@mui/icons-material/HubRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import WifiTetheringRoundedIcon from '@mui/icons-material/WifiTetheringRounded';

export const PLAN_OPTIONS = [
  { value: 'INDIVIDUAL', label: 'Plan Individual', monthlyUnits: 100 },
  { value: 'FAMILY', label: 'Plan Family', monthlyUnits: 125 }
];

export const PACKAGE_OPTIONS = [
  { value: 'MONTHLY', label: 'Mensual', months: 1 },
  { value: 'QUARTERLY', label: 'Trimestral', months: 3 },
  { value: 'SEMIANNUAL', label: 'Semestral', months: 6 },
  { value: 'ANNUAL', label: 'Anual', months: 12 }
];

export const DEMO_OPTIONS = [
  { value: 1, label: '1 hora', packageCode: 'DEMO_1H' },
  { value: 3, label: '3 horas', packageCode: 'DEMO_3H' },
  { value: 6, label: '6 horas', packageCode: 'DEMO_6H' }
];

export const EXTRA_DEVICE_MONTHLY_UNITS = 50;

export const NAV_ITEMS = [
  { value: 'dashboard', label: 'Dashboard', icon: DashboardRoundedIcon },
  { value: 'accounts', label: 'Cuentas Premium', icon: PeopleAltRoundedIcon },
  { value: 'sessions', label: 'Sesiones', icon: WifiTetheringRoundedIcon },
  { value: 'credits', label: 'Créditos', icon: AccountBalanceWalletRoundedIcon },
  { value: 'notifications', label: 'Notificaciones', icon: NotificationsRoundedIcon },
  { value: 'network', label: 'Red de Resellers', icon: HubRoundedIcon, superOnly: true }
];

export const EMPTY_ACCOUNT_FORM = {
  name: '',
  email: '',
  password: '',
  planCode: 'INDIVIDUAL',
  packageCode: 'MONTHLY',
  deviceLimit: 1
};

export const EMPTY_RENEW_FORM = {
  planCode: 'INDIVIDUAL',
  packageCode: 'MONTHLY',
  deviceLimit: 1
};

export function rowsOf(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.content)) return payload.content;
  return [];
}

export function firstValue(source, keys, fallback = undefined) {
  for (const key of keys) {
    if (source?.[key] !== undefined && source?.[key] !== null) return source[key];
  }
  return fallback;
}

export function planLabel(value) {
  return PLAN_OPTIONS.find((item) => item.value === value)?.label || value || 'Plan Individual';
}

export function packageLabel(value) {
  const demo = DEMO_OPTIONS.find((item) => item.packageCode === value);
  if (demo) return `Demo ${demo.label}`;
  return PACKAGE_OPTIONS.find((item) => item.value === value)?.label || value || 'Mensual';
}

export function quoteCostUnits(form) {
  const plan = PLAN_OPTIONS.find((item) => item.value === form?.planCode) || PLAN_OPTIONS[0];
  const pack = PACKAGE_OPTIONS.find((item) => item.value === form?.packageCode) || PACKAGE_OPTIONS[0];
  const deviceLimit = Math.max(Number(form?.deviceLimit || 1), 1);
  const extraDevices = Math.max(deviceLimit - 1, 0);
  return (plan.monthlyUnits + extraDevices * EXTRA_DEVICE_MONTHLY_UNITS) * pack.months;
}

export function quoteDeviceLimitChangeUnits(currentLimit, nextLimit) {
  const current = Math.max(Number(currentLimit || 1), 1);
  const next = Math.max(Number(nextLimit || 1), 1);
  return Math.max(next - current, 0) * EXTRA_DEVICE_MONTHLY_UNITS;
}

export function unitsToCredits(value) {
  const numeric = Number(value || 0);
  return numeric / 100;
}

export function formatCreditsFromUnits(value) {
  return unitsToCredits(value).toLocaleString('es-HN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatCredits(value) {
  return Number(value || 0).toLocaleString('es-HN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function walletCreditUnits(wallet) {
  const units = firstValue(wallet, ['availableCreditUnits', 'balanceCreditUnits', 'creditUnits']);
  if (units !== undefined) return Number(units || 0);
  const credits = firstValue(wallet, ['availableCredits', 'balanceCredits', 'credits'], 0);
  return Number(credits || 0) * 100;
}

export function resellerCreditUnits(row) {
  const units = firstValue(row, ['availableCreditUnits', 'available_credits', 'balanceCreditUnits', 'creditUnits']);
  if (units !== undefined) return Number(units || 0);
  const credits = firstValue(row, ['availableCredits', 'balanceCredits', 'credits'], 0);
  return Number(credits || 0) * 100;
}

export function ledgerDeltaUnits(row) {
  const units = firstValue(row, ['creditUnitsDelta', 'unitsDelta', 'deltaUnits']);
  if (units !== undefined) return Number(units || 0);
  const credits = firstValue(row, ['creditsDelta', 'creditDelta', 'amount'], 0);
  return Number(credits || 0) * 100;
}

export function ledgerMovementLabel(value) {
  const normalized = String(value || '').trim().toUpperCase();
  if (normalized.includes('CUSTOMER_CREATE') || normalized.includes('RESELLER_CREATE')) return 'Venta YouTube Premium';
  if (normalized.includes('CUSTOMER_DEMO') || normalized.includes('RESELLER_DEMO')) return 'Demo YouTube Premium';
  if (normalized.includes('CUSTOMER_RENEW') || normalized.includes('RESELLER_RENEW')) return 'Renovación YouTube Premium';
  if (normalized.includes('DEVICE_LIMIT')) return 'Cambio de dispositivos';
  if (normalized.includes('OPERATION_REFUND')) return 'Reverso YouTube Premium';
  return value || 'Movimiento';
}

export function cleanProductText(value) {
  const legacyProductName = ['Smart', 'Tube'].join('');
  const mixedProductPattern = new RegExp(`YouTube/${legacyProductName} Premium`, 'gi');
  const legacyPremiumPattern = new RegExp(`${legacyProductName} Premium`, 'gi');
  const legacyProductPattern = new RegExp(legacyProductName, 'gi');

  return String(value || '-')
    .replace(mixedProductPattern, 'YouTube Premium')
    .replace(legacyPremiumPattern, 'YouTube Premium')
    .replace(legacyProductPattern, 'YouTube Premium');
}

export function displayDate(value) {
  if (!value) return '-';
  return String(value).replace('T', ' ').slice(0, 16);
}

export function shortDate(value) {
  if (!value) return '-';
  return String(value).slice(0, 10);
}

export function accountId(row) {
  return row?.userId || row?.id || row?.accountId || row?.email;
}

export function accountName(row) {
  return row?.name || row?.displayName || row?.email || 'Cuenta Premium';
}

export function accountStatus(row) {
  if (row?.active === false) return 'SUSPENDED';
  return String(row?.licenseStatus || row?.status || 'ACTIVE').toUpperCase();
}

export function statusLabel(status) {
  const normalized = String(status || '').toUpperCase();
  if (normalized === 'ACTIVE') return 'Activa';
  if (normalized === 'EXPIRED') return 'Expirada';
  if (normalized === 'SUSPENDED' || normalized === 'INACTIVE') return 'Suspendida';
  if (normalized === 'REVOKED') return 'Revocada';
  if (normalized === 'READ') return 'Leída';
  if (normalized === 'UNREAD') return 'Nueva';
  return normalized || 'N/A';
}

export function statusTone(status) {
  const normalized = String(status || '').toUpperCase();
  if (normalized === 'ACTIVE' || normalized === 'READ') return 'success';
  if (normalized === 'EXPIRED' || normalized === 'UNREAD') return 'warning';
  if (normalized === 'REVOKED' || normalized === 'SUSPENDED' || normalized === 'INACTIVE') return 'error';
  return 'default';
}

export function isSuperReseller(permissions) {
  return (
    permissions.has('LIONTV_SUPER_RESELLER_MANAGE') ||
    permissions.has('ROLE_LIONTV_SUPER_RESELLER') ||
    permissions.has('ROLE_LIONTV_SUPER_RESELLER_MANAGE')
  );
}

export function copyText(value) {
  if (!value || !navigator?.clipboard) return Promise.resolve(false);
  return navigator.clipboard.writeText(String(value)).then(() => true);
}

export function backendMessage(error, fallback) {
  return error?.response?.data?.message || error?.message || fallback;
}
