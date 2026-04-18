import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import useAuth from 'hooks/useAuth';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Autocomplete from '@mui/material/Autocomplete';
import TablePagination from '@mui/material/TablePagination';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import LayersIcon from '@mui/icons-material/Layers';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import WifiTetheringIcon from '@mui/icons-material/WifiTethering';
import LanguageIcon from '@mui/icons-material/Language';
import PriceChangeIcon from '@mui/icons-material/PriceChange';
import SmartDisplayIcon from '@mui/icons-material/SmartDisplay';
import CallIcon from '@mui/icons-material/Call';
import LinkIcon from '@mui/icons-material/Link';
import Skeleton from '@mui/material/Skeleton';
import AppsIcon from '@mui/icons-material/Apps';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import ChecklistIcon from '@mui/icons-material/Checklist';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import MemoryIcon from '@mui/icons-material/Memory';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import PaidIcon from '@mui/icons-material/Paid';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import DownloadIcon from '@mui/icons-material/Download';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DeselectIcon from '@mui/icons-material/Deselect';
import TimelineIcon from '@mui/icons-material/Timeline';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';
import { useTranslation } from 'react-i18next';

import MainCard from 'ui-component/cards/MainCard';
import LionMetricCard from 'ui-component/cards/LionMetricCard';
import DialogTitleWithClose from 'ui-component/dialogs/DialogTitleWithClose';
import ResponsiveActionBar from 'ui-component/responsive/ResponsiveActionBar';
import ResponsiveFilters from 'ui-component/responsive/ResponsiveFilters';
import ResponsiveMetricGrid from 'ui-component/responsive/ResponsiveMetricGrid';
import { gridSpacing } from 'store/constant';
import { lionTvApi, catalogsApi } from 'utils/api';
import { listLoyaltyCustomers, listLoyaltyLedger, listVipCustomers } from 'api/liontv-engagement';

const fieldSx = {
  '& .MuiInputBase-root': { borderRadius: 2, minHeight: 48 },
  '& .MuiInputLabel-root': { fontWeight: 500 }
};

const statusColors = {
  ACTIVE: 'success',
  INACTIVE: 'default',
  EXPIRED: 'error',
  CANCELLED: 'error',
  AVAILABLE: 'info',
  PENDING: 'warning',
  PAID: 'success'
};

function StatusChip({ status }) {
  const color = statusColors[status] || 'default';
  return <Chip size="small" color={color} label={status || '-'} />;
}

function formatDate(value) {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString();
}

function formatDateTime(value) {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleString('es-HN');
}

function formatCurrency(value) {
  const n = Number(value) || 0;
  return n.toLocaleString('es-HN', { style: 'currency', currency: 'HNL', minimumFractionDigits: 2 });
}

function dateValue(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

function getRowKey(row = {}) {
  const base =
    row.managedAccountId ??
    row.subscriptionId ??
    row.invoiceId ??
    row.licenseId ??
    row.id ??
    row.accountCode ??
    row.aliasEmail ??
    row.macAddress;
  if (base !== undefined && base !== null && base !== '') return String(base);
  return JSON.stringify(row);
}

function csvCell(value) {
  const stringValue = String(value ?? '');
  const escaped = stringValue.replace(/"/g, '""');
  return `"${escaped}"`;
}

function channelLabelFromValue(channel, t) {
  const normalized = String(channel ?? '').trim().toLowerCase();
  if (normalized === 'red social') return t('customers.channels.social');
  if (normalized === 'google') return t('customers.channels.google');
  if (normalized === 'familiares') return t('customers.channels.family');
  if (normalized === 'amigos') return t('customers.channels.friends');
  return channel || '-';
}

function ContactActions({ phone, mail }) {
  const { t } = useTranslation();
  if (!phone && !mail) return null;
  const cleanPhone = (phone || '').replace(/\D/g, '');
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={1}
      useFlexGap
      sx={{
        mt: 1,
        flexWrap: 'wrap',
        width: '100%',
        '& .MuiButton-root': {
          width: { xs: '100%', sm: 'auto' }
        }
      }}
    >
      {phone ? (
        <Button size="small" variant="outlined" startIcon={<CallIcon />} component="a" href={`tel:${cleanPhone}`} sx={{ borderRadius: 2 }}>
          {t('crm.contact.call', 'Llamar')}
        </Button>
      ) : null}
      {phone ? (
        <Button
          size="small"
          variant="contained"
          startIcon={<WhatsAppIcon />}
          component="a"
          href={`https://wa.me/${cleanPhone}`}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ borderRadius: 2, bgcolor: '#25D366', '&:hover': { bgcolor: '#1ebe5d' } }}
        >
          WhatsApp
        </Button>
      ) : null}
      {mail ? (
        <Button size="small" variant="text" startIcon={<MailOutlineIcon />} component="a" href={`mailto:${mail}`} sx={{ borderRadius: 2 }}>
          {t('crm.contact.email', 'Email')}
        </Button>
      ) : null}
    </Stack>
  );
}

function normalizeCustomer(item = {}) {
  return {
    id: item.customerId ?? item.id ?? item.customer_id ?? null,
    fullName: item.customerFullname ?? item.fullName ?? item.customer_name ?? '',
    mail: item.customerMail ?? item.email ?? '',
    phone: item.customerPhone ?? item.phone ?? '',
    gender: (item.gender ?? '').toUpperCase(),
    status: (item.customerStatus ?? item.status ?? '').toUpperCase(),
    channel: item.channel ?? item.canal ?? '',
    openingDate: item.openingDate ?? item.open_date ?? null,
    refererBy: item.refererBy ?? item.referredBy ?? ''
  };
}

function normalizeSubscription(item = {}) {
  return {
    subscriptionId: item.subscriptionId ?? item.id ?? null,
    customerId: item.customerId ?? null,
    lineId: item.lineId ?? '',
    billing: item.billing ?? '',
    amount: item.amount ?? item.totalAmount ?? 0,
    discount: item.discount ?? 0,
    status: (item.status ?? '').toUpperCase(),
    startDate: item.startDate ?? null,
    renewalDate: item.renewalDate ?? null,
    packageId: item.packageId ?? null,
    automaticPay: Boolean(item.automaticPay),
    linkAutomatic: item.linkAutomatic ?? '',
    username: item.username ?? '',
    customerName: item.customerName ?? item.customer_name ?? '',
    username_line: item.username_line ?? ''
  };
}

function normalizeInvoice(item = {}) {
  return {
    invoiceId: item.invoiceId ?? item.id ?? null,
    customerId: item.customerId ?? null,
    paymentDate: item.paymentDate ?? null,
    amountPaid: Number(item.amountPaid ?? 0),
    amountDiscount: Number(item.amountDiscount ?? 0),
    status: (item.status ?? '').toUpperCase(),
    paymentMethod: item.paymentMethod ?? '',
    packageId: item.packageId ?? null,
    bankId: item.bankId ?? null,
    bankName: item.bankName ?? item.bank_name ?? item.bank?.name ?? '',
    notes: item.notes ?? '',
    serviceId: item.serviceId ?? null,
    serviceName: item.serviceName ?? item.service_name ?? item.service?.name ?? ''
  };
}

function parsePaidFlag(value) {
  if (value === true || value === 1 || value === '1') return true;
  if (typeof value === 'string' && value.trim().toLowerCase() === 'true') return true;
  return false;
}

function normalizeLicense(item = {}) {
  return {
    licenseId: item.licenseId ?? item.license_id ?? null,
    customerId: item.customerId ?? item.customer_id ?? null,
    macAddress: item.macAddress ?? item.mac_address ?? '',
    deviceKey: item.deviceKey ?? item.device_key ?? '',
    app: item.app ?? '',
    status: (item.status ?? '').toUpperCase(),
    typeLicense: (item.typeLicense ?? item.type_license ?? '').toUpperCase(),
    expireAt: item.expireAt ?? item.expire_at ?? null,
    price: Number(item.price ?? 0),
    createdAt: item.createdAt ?? item.created_at ?? null,
    licensePeriod: item.licensePeriod ?? item.license_period ?? '',
    name: item.name ?? '',
    currentOwnerSince: item.currentOwnerSince ?? item.current_owner_since ?? null,
    isPaid: parsePaidFlag(item.isPaid ?? item.is_paid ?? item.paid)
  };
}

function normalizeManagedAccount(item = {}) {
  return {
    managedAccountId: item.id ?? item.managedAccountId ?? null,
    customerId: item.customerId ?? item.customer_id ?? null,
    accountCode: item.accountCode ?? item.account_code ?? '',
    displayName: item.displayName ?? item.display_name ?? '',
    providerCode: item.providerCode ?? item.provider_code ?? '',
    providerName: item.providerName ?? item.provider_name ?? '',
    aliasEmail: item.aliasEmail ?? item.alias_email ?? '',
    expirationDate: item.expirationDate ?? item.expiration_date ?? null,
    renewalDate: item.renewalDate ?? item.renewal_date ?? null,
    accountStatus: (item.accountStatus ?? item.account_status ?? '').toUpperCase(),
    allowDistribution: Boolean(item.allowDistribution ?? item.allow_distribution),
    lastEmailReceivedAt: item.lastEmailReceivedAt ?? item.last_email_received_at ?? null,
    createdBy: item.createdBy ?? item.created_by ?? '',
    notes: item.notes ?? ''
  };
}

function initials(name = '') {
  const parts = name.trim().split(' ').filter(Boolean);
  if (!parts.length) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ''}${parts[parts.length - 1][0] ?? ''}`.toUpperCase();
}

function StatCard({ icon, title, value, helper, color = 'primary' }) {
  return <LionMetricCard title={title} value={value} helper={helper} color={color} icon={icon} />;
}

function LabelWithIcon({ icon, label, color = 'primary' }) {
  return (
    <Chip
      icon={icon}
      label={label}
      size="small"
      sx={{
        maxWidth: '100%',
        height: 'auto',
        borderRadius: 2,
        bgcolor: (theme) => `${theme.palette[color]?.light}26`,
        color: (theme) => theme.palette[color]?.darker || theme.palette[color]?.dark,
        justifyContent: 'flex-start',
        '& .MuiChip-icon': {
          color: (theme) => theme.palette[color]?.main,
          alignSelf: 'flex-start',
          mt: 0.4
        },
        '& .MuiChip-label': {
          display: 'block',
          whiteSpace: 'normal',
          overflowWrap: 'anywhere',
          lineHeight: 1.35,
          paddingTop: '6px',
          paddingBottom: '6px'
        }
      }}
      variant="outlined"
    />
  );
}

function InfoBlock({ title, icon, color = 'primary', children, helper }) {
  return (
    <Box
      sx={(theme) => ({
        borderRadius: 2,
        border: '1px solid',
        borderColor: theme.palette[color]?.light || theme.palette.divider,
        background:
          theme.palette.mode === 'light'
            ? `linear-gradient(135deg, ${theme.palette[color]?.light}18, ${theme.palette.background.paper})`
            : theme.palette.surface.card,
        p: { xs: 1.5, sm: 2 },
        boxShadow: 2,
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 1.5
      })}
    >
      <Avatar
        sx={(theme) => ({
          bgcolor: theme.palette[color]?.main,
          color: theme.palette[color]?.contrastText,
          width: { xs: 36, sm: 40 },
          height: { xs: 36, sm: 40 },
          boxShadow: 3
        })}
      >
        {icon}
      </Avatar>
      <Stack spacing={0.75} sx={{ flex: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        {helper ? (
          <Typography variant="caption" color="text.secondary">
            {helper}
          </Typography>
        ) : null}
        {children}
      </Stack>
    </Box>
  );
}

function ActionableState({ icon, title, subtitle, actions = [] }) {
  return (
    <Box
      sx={{
        py: 4,
        px: 2,
        textAlign: 'center',
        border: '1px dashed',
        borderColor: 'divider',
        borderRadius: 2,
        background: (theme) =>
          theme.palette.mode === 'light'
            ? `linear-gradient(145deg, ${theme.palette.primary.light}10, ${theme.palette.secondary.light}10)`
            : theme.palette.surface.card
      }}
    >
      <Avatar sx={{ mx: 'auto', mb: 1.5, bgcolor: 'primary.main', color: 'primary.contrastText' }}>{icon}</Avatar>
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        {subtitle}
      </Typography>
      {actions.length ? (
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="center" sx={{ mt: 2 }}>
          {actions.map((action) => (
            <Button
              key={action.id}
              variant={action.variant || 'outlined'}
              color={action.color || 'primary'}
              startIcon={action.icon || null}
              onClick={action.onClick}
              disabled={Boolean(action.disabled)}
              fullWidth
              sx={{ textTransform: 'none', borderRadius: 2 }}
            >
              {action.label}
            </Button>
          ))}
        </Stack>
      ) : null}
    </Box>
  );
}

function CompactInfoTile({ icon, label, value, color = 'primary' }) {
  return (
    <Box
      sx={(theme) => ({
        minWidth: 0,
        p: 1.25,
        borderRadius: 2.5,
        border: '1px solid',
        borderColor: theme.palette[color]?.light || theme.palette.divider,
        background:
          theme.palette.mode === 'light'
            ? `linear-gradient(145deg, ${theme.palette[color]?.light}18, ${theme.palette.background.paper})`
            : theme.palette.surface.card
      })}
    >
      <Stack direction="row" spacing={1.1} alignItems="flex-start">
        <Avatar
          sx={(theme) => ({
            width: 34,
            height: 34,
            bgcolor: `${theme.palette[color]?.main || theme.palette.primary.main}20`,
            color: theme.palette[color]?.main || theme.palette.primary.main,
            flexShrink: 0
          })}
        >
          {icon}
        </Avatar>
        <Stack spacing={0.35} sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, lineHeight: 1.35 }}>
            {label}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.35, overflowWrap: 'anywhere' }}>
            {value || '-'}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}

export default function CustomerCrmLionTv() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { enqueueSnackbar } = useSnackbar();
  const { accessToken } = useAuth();
  const { t } = useTranslation();

  const [customers, setCustomers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [licenses, setLicenses] = useState([]);
  const [managedAccounts, setManagedAccounts] = useState([]);
  const [packages, setPackages] = useState([]);
  const [lines, setLines] = useState([]);
  const [banks, setBanks] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState({
    customers: false,
    subscriptions: false,
    invoices: false,
    licenses: false,
    managedAccounts: false,
    packages: false,
    lines: false,
    banks: false,
    services: false
  });
  const [loadErrors, setLoadErrors] = useState({
    customers: '',
    subscriptions: '',
    invoices: '',
    licenses: '',
    managedAccounts: '',
    packages: '',
    lines: '',
    banks: '',
    services: ''
  });
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [timelineFilter, setTimelineFilter] = useState('ALL');
  const [detail, setDetail] = useState({ open: false, type: null, row: null });
  const [tableDialog, setTableDialog] = useState({
    open: false,
    title: '',
    description: '',
    rows: [],
    columns: [],
    onDetail: null
  });
  const [tablePage, setTablePage] = useState(0);
  const [tableRpp, setTableRpp] = useState(10);
  const [tableSelectedKeys, setTableSelectedKeys] = useState([]);
  const [vipSummary, setVipSummary] = useState(null);
  const [loyaltySummary, setLoyaltySummary] = useState(null);
  const [loyaltyLedger, setLoyaltyLedger] = useState([]);
  const [engagementLoading, setEngagementLoading] = useState(false);

  const handleUnauthorized = (err) => {
    const status = err?.response?.status || err?.request?.status;
    return status === 401;
  };

  const fetchCollection = useCallback(
    async (path, setter, normalizer, key, params = {}) => {
      if (!accessToken) return;
      setLoading((prev) => ({ ...prev, [key]: true }));
      try {
        const res = await lionTvApi.get(path, {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: { index: 0, size: 5000, ...params },
          skipAuthRedirect: true
        });
        const payload = res?.data?.data ?? res?.data ?? {};
        const raw = payload.data ?? payload.items ?? payload.content ?? payload ?? [];
        const normalized = (Array.isArray(raw) ? raw : []).map(normalizer);
        setter(normalized);
        setLoadErrors((prev) => ({ ...prev, [key]: '' }));
      } catch (err) {
        if (!handleUnauthorized(err)) {
          const message = err?.response?.data?.message || t('crm.errors.load', 'No se pudo cargar la información.');
          enqueueSnackbar(message, { variant: 'error' });
          setLoadErrors((prev) => ({ ...prev, [key]: message }));
        }
      } finally {
        setLoading((prev) => ({ ...prev, [key]: false }));
      }
    },
    [accessToken, enqueueSnackbar, t]
  );

  useEffect(() => {
    fetchCollection('/customers/v1', setCustomers, normalizeCustomer, 'customers');
    fetchCollection('/subscriptions/v1', setSubscriptions, normalizeSubscription, 'subscriptions');
    fetchCollection('/invoices/v1', setInvoices, normalizeInvoice, 'invoices');
    fetchCollection('/licenses/v1', setLicenses, normalizeLicense, 'licenses');
    fetchCollection('/managed-accounts/v1', setManagedAccounts, normalizeManagedAccount, 'managedAccounts');
    fetchCollection('/packages/v1/list-packages', setPackages, (p) => p, 'packages', {
      start: 0,
      filters: '',
      sorting: '',
      size: 1000
    });
    fetchCollection('/lines/v1/list-lines', setLines, (l) => l, 'lines', { start: 0, filters: '', sorting: '', size: 1000 });
  }, [fetchCollection, refreshKey]);

  // Catálogos externos (bancos y servicios)
  const loadBanks = useCallback(async () => {
    if (!accessToken) return;
    setLoading((prev) => ({ ...prev, banks: true }));
    try {
      const res = await catalogsApi.get('/banks/v1', { headers: { Authorization: `Bearer ${accessToken}` } });
      const payload = res?.data?.data ?? res?.data ?? [];
      setBanks(Array.isArray(payload) ? payload : []);
      setLoadErrors((prev) => ({ ...prev, banks: '' }));
    } catch {
      const message = t('crm.errors.banks', 'No se pudieron cargar los bancos.');
      enqueueSnackbar(message, { variant: 'warning' });
      setLoadErrors((prev) => ({ ...prev, banks: message }));
    } finally {
      setLoading((prev) => ({ ...prev, banks: false }));
    }
  }, [accessToken, enqueueSnackbar, t]);

  const loadServices = useCallback(async () => {
    if (!accessToken) return;
    setLoading((prev) => ({ ...prev, services: true }));
    try {
      const res = await catalogsApi.get('/services/v1', { headers: { Authorization: `Bearer ${accessToken}` } });
      const payload = res?.data?.data ?? res?.data ?? [];
      setServices(Array.isArray(payload) ? payload : []);
      setLoadErrors((prev) => ({ ...prev, services: '' }));
    } catch {
      const message = t('crm.errors.services', 'No se pudieron cargar los servicios.');
      enqueueSnackbar(message, { variant: 'warning' });
      setLoadErrors((prev) => ({ ...prev, services: message }));
    } finally {
      setLoading((prev) => ({ ...prev, services: false }));
    }
  }, [accessToken, enqueueSnackbar, t]);

  useEffect(() => {
    loadBanks();
    loadServices();
  }, [loadBanks, loadServices, refreshKey]);

  const lineNameMap = useMemo(() => {
    const map = {};
    lines.forEach((l) => {
      const rawId = l.id ?? l.lineId ?? l.line_id ?? l.username;
      if (!rawId) return;
      const id = String(rawId);
      map[id] = l.username || l.user_name || l.username_line || l.name || id;
    });
    return map;
  }, [lines]);

  const packageMap = useMemo(() => {
    const map = {};
    packages.forEach((p) => {
      const rawId = p.id ?? p.packageId ?? p.package_id ?? p.packageID;
      if (!rawId) return;
      const id = String(rawId);
      map[id] = {
        name: p.name || p.packageName || `Paquete ${id}`,
        description: p.description || p.packageDescription || ''
      };
    });
    return map;
  }, [packages]);

  const bankMap = useMemo(() => {
    const map = {};
    banks.forEach((b) => {
      const id = String(b.id ?? b.bankId ?? b.bank_id ?? b.code ?? '');
      if (!id) return;
      map[id] = b.name || b.bank || b.description || id;
    });
    return map;
  }, [banks]);

  const serviceMap = useMemo(() => {
    const map = {};
    services.forEach((s) => {
      const id = String(s.id ?? s.serviceId ?? s.service_id ?? s.code ?? '');
      if (!id) return;
      map[id] = s.name || s.description || s.serviceName || id;
    });
    return map;
  }, [services]);

  const customerId = selectedCustomer?.id ?? selectedCustomer?.customerId ?? null;

  const customerSubscriptions = useMemo(
    () =>
      subscriptions
        .filter((s) => (s.customerId || s.customer_id) === customerId)
        .map((s) => {
          const lineLabel = lineNameMap[String(s.lineId ?? s.username_line ?? '')] || s.username_line || s.lineId || '';
          const pkg = packageMap[String(s.packageId ?? '')] || {};
          return {
            ...s,
            lineLabel,
            packageName: pkg.name || s.packageId,
            packageDescription: pkg.description || ''
          };
        }),
    [subscriptions, customerId, lineNameMap, packageMap]
  );

  const customerInvoices = useMemo(
    () => invoices.filter((inv) => (inv.customerId || inv.customer_id) === customerId),
    [invoices, customerId]
  );

  const customerLicenses = useMemo(
    () => licenses.filter((lic) => (lic.customerId || lic.customer_id) === customerId),
    [licenses, customerId]
  );

  const customerManagedAccounts = useMemo(
    () => managedAccounts.filter((account) => (account.customerId || account.customer_id) === customerId),
    [managedAccounts, customerId]
  );

  const totals = useMemo(() => {
    const billed = customerInvoices.reduce((acc, inv) => acc + Number(inv.amountPaid || 0) - Number(inv.amountDiscount || 0), 0);
    const activeSubs = customerSubscriptions.filter((s) => s.status === 'ACTIVE').length;
    const activeLicenses = customerLicenses.filter((l) => l.status === 'ACTIVE').length;
    const activeManagedAccounts = customerManagedAccounts.filter((a) => a.accountStatus === 'ACTIVE').length;
    const nextManagedExpiration = customerManagedAccounts
      .map((a) => a.expirationDate)
      .filter(Boolean)
      .sort((a, b) => new Date(a) - new Date(b))[0];
    const nextRenewal = customerSubscriptions
      .map((s) => s.renewalDate)
      .filter(Boolean)
      .sort((a, b) => new Date(a) - new Date(b))[0];
    const lastInvoice = customerInvoices
      .map((inv) => inv.paymentDate)
      .filter(Boolean)
      .sort((a, b) => new Date(b) - new Date(a))[0];
    return {
      billed,
      activeSubs,
      activeLicenses,
      activeManagedAccounts,
      totalInvoices: customerInvoices.length,
      totalManagedAccounts: customerManagedAccounts.length,
      nextRenewal,
      nextManagedExpiration,
      lastInvoice
    };
  }, [customerSubscriptions, customerLicenses, customerInvoices, customerManagedAccounts]);

  const hasBlockingErrors = useMemo(() => Object.values(loadErrors).some(Boolean), [loadErrors]);

  const customerHasRecords = useMemo(
    () =>
      customerSubscriptions.length > 0 || customerInvoices.length > 0 || customerLicenses.length > 0 || customerManagedAccounts.length > 0,
    [customerSubscriptions.length, customerInvoices.length, customerLicenses.length, customerManagedAccounts.length]
  );

  useEffect(() => {
    const activeCustomerId = selectedCustomer?.id ?? selectedCustomer?.customerId ?? null;
    if (!activeCustomerId) {
      setVipSummary(null);
      setLoyaltySummary(null);
      setLoyaltyLedger([]);
      return;
    }

    let cancelled = false;
    setEngagementLoading(true);

    Promise.all([
      listVipCustomers({ customerIds: String(activeCustomerId), index: 0, size: 1 }),
      listLoyaltyCustomers({ customerIds: String(activeCustomerId), index: 0, size: 1 }),
      listLoyaltyLedger(activeCustomerId, { index: 0, size: 5 })
    ])
      .then(([vipResponse, loyaltyResponse, ledgerResponse]) => {
        if (cancelled) return;
        setVipSummary(vipResponse?.data?.[0] || null);
        setLoyaltySummary(loyaltyResponse?.data?.[0] || null);
        setLoyaltyLedger(ledgerResponse?.data || []);
      })
      .catch((error) => {
        if (cancelled || handleUnauthorized(error)) return;
        enqueueSnackbar(error?.response?.data?.message || t('crm.errors.engagementLoad'), { variant: 'warning' });
      })
      .finally(() => {
        if (!cancelled) setEngagementLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [enqueueSnackbar, selectedCustomer, t]);

  const retryAll = useCallback(() => {
    setRefreshKey((value) => value + 1);
  }, []);

  const timelineItems = useMemo(() => {
    if (!selectedCustomer) return [];

    const events = [];
    const pushEvent = ({ id, date, kind, title, subtitle, status, source }) => {
      const parsedDate = dateValue(date);
      events.push({
        id,
        date: parsedDate,
        rawDate: date,
        kind,
        title,
        subtitle,
        status,
        source
      });
    };

    if (selectedCustomer.openingDate) {
      pushEvent({
        id: `customer-open-${selectedCustomer.id}`,
        date: selectedCustomer.openingDate,
        kind: 'ACTIVITY',
        title: t('crm.timeline.events.customerOpened.title', 'Cliente creado'),
        subtitle: t('crm.timeline.events.customerOpened.subtitle', 'Fecha de alta del cliente'),
        status: selectedCustomer.status || 'ACTIVE',
        source: 'CUSTOMER'
      });
    }

    customerSubscriptions.forEach((item) => {
      if (item.startDate) {
        pushEvent({
          id: `sub-start-${item.subscriptionId}`,
          date: item.startDate,
          kind: 'ACTIVITY',
          title: t('crm.timeline.events.subscriptionStart.title', 'Suscripción iniciada'),
          subtitle: `${item.packageName || item.packageId || '-'} · ${item.lineLabel || item.lineId || '-'}`,
          status: item.status,
          source: 'SUBSCRIPTION'
        });
      }

      if (item.renewalDate) {
        pushEvent({
          id: `sub-renew-${item.subscriptionId}`,
          date: item.renewalDate,
          kind: 'EXPIRATIONS',
          title: t('crm.timeline.events.subscriptionRenewal.title', 'Renovación programada'),
          subtitle: `${item.packageName || item.packageId || '-'} · ${item.lineLabel || item.lineId || '-'}`,
          status: item.status,
          source: 'SUBSCRIPTION'
        });
      }
    });

    customerInvoices.forEach((item) => {
      if (!item.paymentDate) return;
      pushEvent({
        id: `inv-${item.invoiceId}`,
        date: item.paymentDate,
        kind: 'PAYMENTS',
        title: t('crm.timeline.events.invoicePayment.title', 'Movimiento de factura'),
        subtitle: `${item.paymentMethod || '-'} · ${formatCurrency(Number(item.amountPaid || 0) - Number(item.amountDiscount || 0))}`,
        status: item.status,
        source: 'INVOICE'
      });
    });

    customerLicenses.forEach((item) => {
      if (item.createdAt) {
        pushEvent({
          id: `license-created-${item.licenseId}`,
          date: item.createdAt,
          kind: 'ACTIVITY',
          title: t('crm.timeline.events.licenseCreated.title', 'Licencia creada'),
          subtitle: `${item.app || '-'} · ${item.macAddress || '-'}`,
          status: item.status,
          source: 'LICENSE'
        });
      }
      if (item.expireAt) {
        pushEvent({
          id: `license-expire-${item.licenseId}`,
          date: item.expireAt,
          kind: 'EXPIRATIONS',
          title: t('crm.timeline.events.licenseExpiration.title', 'Vencimiento de licencia'),
          subtitle: `${item.app || '-'} · ${item.macAddress || '-'}`,
          status: item.status,
          source: 'LICENSE'
        });
      }
    });

    customerManagedAccounts.forEach((item) => {
      if (item.expirationDate) {
        pushEvent({
          id: `account-expire-${item.managedAccountId}`,
          date: item.expirationDate,
          kind: 'EXPIRATIONS',
          title: t('crm.timeline.events.managedAccountExpiration.title', 'Vencimiento de managed account'),
          subtitle: `${item.aliasEmail || '-'} · ${item.accountCode || '-'}`,
          status: item.accountStatus,
          source: 'MANAGED_ACCOUNT'
        });
      }

      if (item.lastEmailReceivedAt) {
        pushEvent({
          id: `account-email-${item.managedAccountId}`,
          date: item.lastEmailReceivedAt,
          kind: 'ACTIVITY',
          title: t('crm.timeline.events.managedAccountEmail.title', 'Último correo recibido'),
          subtitle: `${item.aliasEmail || '-'} · ${item.providerCode || item.providerName || '-'}`,
          status: item.accountStatus,
          source: 'MANAGED_ACCOUNT'
        });
      }
    });

    return events.sort((a, b) => {
      const left = a.date ? a.date.getTime() : 0;
      const right = b.date ? b.date.getTime() : 0;
      return right - left;
    });
  }, [selectedCustomer, customerSubscriptions, customerInvoices, customerLicenses, customerManagedAccounts, t]);

  const timelineFilteredItems = useMemo(() => {
    if (timelineFilter === 'ALL') return timelineItems;
    return timelineItems.filter((item) => item.kind === timelineFilter);
  }, [timelineFilter, timelineItems]);

  const paginatedTableRows = useMemo(
    () => tableDialog.rows.slice(tablePage * tableRpp, tablePage * tableRpp + tableRpp),
    [tableDialog.rows, tablePage, tableRpp]
  );

  const selectedTableRows = useMemo(() => {
    if (!tableSelectedKeys.length) return [];
    return tableDialog.rows.filter((row) => tableSelectedKeys.includes(getRowKey(row)));
  }, [tableDialog.rows, tableSelectedKeys]);

  const allVisibleRowsSelected = useMemo(() => {
    if (!paginatedTableRows.length) return false;
    return paginatedTableRows.every((row) => tableSelectedKeys.includes(getRowKey(row)));
  }, [paginatedTableRows, tableSelectedKeys]);

  const toggleRowSelection = useCallback((row) => {
    const key = getRowKey(row);
    setTableSelectedKeys((prev) => (prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]));
  }, []);

  const toggleVisibleRowsSelection = useCallback(() => {
    const visibleKeys = paginatedTableRows.map((row) => getRowKey(row));
    setTableSelectedKeys((prev) => {
      const allSelected = visibleKeys.every((key) => prev.includes(key));
      if (allSelected) return prev.filter((key) => !visibleKeys.includes(key));
      const next = new Set([...prev, ...visibleKeys]);
      return Array.from(next);
    });
  }, [paginatedTableRows]);

  const clearTableSelection = useCallback(() => {
    setTableSelectedKeys([]);
  }, []);

  const copySelectedIds = useCallback(async () => {
    if (!selectedTableRows.length) {
      enqueueSnackbar(t('crm.bulk.emptySelection', 'Selecciona al menos un registro.'), { variant: 'warning' });
      return;
    }
    const ids = selectedTableRows.map((row) => getRowKey(row));
    try {
      await navigator.clipboard.writeText(ids.join('\n'));
      enqueueSnackbar(t('crm.bulk.copySuccess', 'IDs copiados al portapapeles.'), { variant: 'success' });
    } catch {
      enqueueSnackbar(t('crm.bulk.copyFailed', 'No se pudo copiar al portapapeles.'), { variant: 'error' });
    }
  }, [enqueueSnackbar, selectedTableRows, t]);

  const exportSelectedToCsv = useCallback(() => {
    const rows = selectedTableRows.length ? selectedTableRows : tableDialog.rows;
    if (!rows.length) {
      enqueueSnackbar(t('crm.bulk.emptyExport', 'No hay registros para exportar.'), { variant: 'warning' });
      return;
    }

    const headers = [t('crm.bulk.id', 'ID'), ...tableDialog.columns.map((column) => column.title || column.field)];
    const csvRows = rows.map((row) => [
      getRowKey(row),
      ...tableDialog.columns.map((column) => {
        const raw = row[column.field];
        if (raw === null || raw === undefined) return '';
        if (typeof raw === 'object') return JSON.stringify(raw);
        return String(raw);
      })
    ]);

    const csv = [headers, ...csvRows].map((line) => line.map(csvCell).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const baseName = (tableDialog.title || 'crm-export').toLowerCase().replace(/[^a-z0-9]+/gi, '-');
    link.href = url;
    link.setAttribute('download', `${baseName}-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    enqueueSnackbar(
      t('crm.bulk.exportSuccess', {
        defaultValue: 'Exportación completada ({{count}} registros).',
        count: rows.length
      }),
      { variant: 'success' }
    );
  }, [enqueueSnackbar, selectedTableRows, tableDialog.columns, tableDialog.rows, tableDialog.title, t]);

  const openFullModule = (type) => {
    setTableSelectedKeys([]);
    setTablePage(0);
    if (type === 'subscriptions') {
      setTableDialog({
        open: true,
        title: t('crm.tables.subscriptions.title', 'Todas las suscripciones'),
        description: t('crm.tables.subscriptions.desc', 'Vista completa de líneas, paquetes, billing y fechas del cliente.'),
        rows: customerSubscriptions,
        columns: [
          {
            field: 'lineLabel',
            title: t('crm.headers.line', 'Línea'),
            render: (row) => <LabelWithIcon icon={<WifiTetheringIcon fontSize="small" />} label={row.lineLabel || '-'} color="info" />
          },
          {
            field: 'packageName',
            title: t('crm.headers.package', 'Paquete'),
            render: (row) => <LabelWithIcon icon={<Inventory2Icon fontSize="small" />} label={row.packageName || '-'} color="secondary" />
          },
          {
            field: 'billing',
            title: t('crm.headers.billing', 'Billing'),
            render: (row) => <LabelWithIcon icon={<ChecklistIcon fontSize="small" />} label={row.billing || '-'} color="warning" />
          },
          { field: 'status', title: t('crm.headers.status', 'Estado'), render: (row) => <StatusChip status={row.status} /> },
          { field: 'startDate', title: t('crm.headers.start', 'Inicio'), render: (row) => formatDate(row.startDate) },
          { field: 'renewalDate', title: t('crm.headers.renewal', 'Renovación'), render: (row) => formatDate(row.renewalDate) }
        ],
        onDetail: (row) => setDetail({ open: true, type: 'subscription', row })
      });
    }
    if (type === 'licenses') {
      setTableDialog({
        open: true,
        title: t('crm.tables.licenses.title', 'Todas las licencias'),
        description: t('crm.tables.licenses.desc', 'Detalle de licencias: app, tipo, vigencia y estado actual.'),
        rows: customerLicenses,
        columns: [
          {
            field: 'macAddress',
            title: t('crm.headers.mac', 'MAC'),
            render: (row) => <LabelWithIcon icon={<SmartDisplayIcon fontSize="small" />} label={row.macAddress || '-'} color="info" />
          },
          {
            field: 'deviceKey',
            title: t('licenses.headers.deviceKey', 'Device key'),
            render: (row) => <LabelWithIcon icon={<LinkIcon fontSize="small" />} label={row.deviceKey || '-'} color="info" />
          },
          {
            field: 'app',
            title: t('crm.headers.app', 'App'),
            render: (row) => <LabelWithIcon icon={<AppsIcon fontSize="small" />} label={row.app || '-'} color="primary" />
          },
          {
            field: 'typeLicense',
            title: t('crm.headers.type', 'Tipo'),
            render: (row) => <LabelWithIcon icon={<LayersIcon fontSize="small" />} label={row.typeLicense || '-'} color="secondary" />
          },
          { field: 'status', title: t('crm.headers.status', 'Estado'), render: (row) => <StatusChip status={row.status} /> },
          {
            field: 'isPaid',
            title: t('licenses.headers.paid', 'Pagada'),
            render: (row) => <StatusChip status={row.isPaid ? 'PAID' : 'PENDING'} />
          },
          { field: 'expireAt', title: t('crm.headers.expire', 'Expira'), render: (row) => formatDate(row.expireAt) }
        ],
        onDetail: (row) => setDetail({ open: true, type: 'license', row })
      });
    }
    if (type === 'managedAccounts') {
      setTableDialog({
        open: true,
        title: t('crm.tables.managedAccounts.title', 'Cuentas gestionadas'),
        description: t(
          'crm.tables.managedAccounts.desc',
          'Vista completa de aliases, provider, vigencia, estado y distribución de cuentas gestionadas.'
        ),
        rows: customerManagedAccounts,
        columns: [
          {
            field: 'accountCode',
            title: t('crm.headers.accountCode', 'Account'),
            render: (row) => (
              <LabelWithIcon
                icon={<ManageAccountsIcon fontSize="small" />}
                label={`${row.accountCode || '-'} ${row.displayName ? `• ${row.displayName}` : ''}`}
                color="primary"
              />
            )
          },
          {
            field: 'aliasEmail',
            title: t('crm.headers.alias', 'Alias'),
            render: (row) => <LabelWithIcon icon={<AlternateEmailIcon fontSize="small" />} label={row.aliasEmail || '-'} color="info" />
          },
          {
            field: 'provider',
            title: t('crm.headers.provider', 'Provider'),
            render: (row) => row.providerCode || row.providerName || '-'
          },
          { field: 'accountStatus', title: t('crm.headers.status', 'Estado'), render: (row) => <StatusChip status={row.accountStatus} /> },
          {
            field: 'allowDistribution',
            title: t('crm.headers.distribution', 'Distribución'),
            render: (row) => <StatusChip status={row.allowDistribution ? 'ACTIVE' : 'INACTIVE'} />
          },
          { field: 'expirationDate', title: t('crm.headers.expire', 'Expira'), render: (row) => formatDate(row.expirationDate) }
        ],
        onDetail: (row) => setDetail({ open: true, type: 'managedAccount', row })
      });
    }
    if (type === 'invoices') {
      setTableDialog({
        open: true,
        title: t('crm.tables.invoices.title', 'Todas las facturas'),
        description: t('crm.tables.invoices.desc', 'Historial completo de facturación en Lempiras con método y estado.'),
        rows: customerInvoices,
        columns: [
          { field: 'paymentDate', title: t('crm.headers.date', 'Fecha'), render: (row) => formatDate(row.paymentDate) },
          {
            field: 'paymentMethod',
            title: t('crm.headers.method', 'Método'),
            render: (row) => <LabelWithIcon icon={<CreditCardIcon fontSize="small" />} label={row.paymentMethod || '-'} color="info" />
          },
          { field: 'status', title: t('crm.headers.status', 'Estado'), render: (row) => <StatusChip status={row.status} /> },
          {
            field: 'amountPaid',
            title: t('crm.headers.total', 'Total'),
            render: (row) => formatCurrency(Number(row.amountPaid || 0) - Number(row.amountDiscount || 0))
          }
        ],
        onDetail: (row) => setDetail({ open: true, type: 'invoice', row })
      });
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 1400, mx: 'auto', pb: 3 }}>
      <Stack spacing={{ xs: 2, md: 3 }}>
        <MainCard
          title={t('crm.title', 'CRM de clientes')}
          contentSX={{ display: 'flex', flexDirection: 'column', gap: 2, p: { xs: 1.5, sm: 2.5 } }}
        >
          <Stack spacing={1}>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 760 }}>
              {t(
                'crm.search.helper',
                'Busca un cliente y obtén una vista 360 con suscripciones, licencias, managed accounts, timeline comercial y facturación.'
              )}
            </Typography>
          </Stack>
          <ResponsiveFilters paperSx={{ width: '100%' }}>
            <Box sx={{ width: '100%', minWidth: 0, flex: 1 }}>
              <Autocomplete
                fullWidth
                options={customers}
                value={selectedCustomer}
                onChange={(e, value) => setSelectedCustomer(value)}
                getOptionLabel={(option) => option?.fullName || option?.mail || option?.username || option?.id?.toString() || ''}
                isOptionEqualToValue={(opt, val) => (opt?.id ?? opt?.customerId) === (val?.id ?? val?.customerId)}
                sx={{
                  width: '100%',
                  minWidth: 0,
                  '& .MuiOutlinedInput-root': {
                    minHeight: 50,
                    borderRadius: 2.5
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t('crm.search.label', 'Buscar cliente')}
                    placeholder={t('crm.search.placeholder', 'Nombre, correo o usuario')}
                    size="small"
                    sx={fieldSx}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon color="primary" />
                        </InputAdornment>
                      )
                    }}
                  />
                )}
              />
            </Box>
            <ResponsiveActionBar sx={{ width: { xs: '100%', md: 'auto' }, flexShrink: 0 }}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={() => setRefreshKey((v) => v + 1)}
                disabled={Object.values(loading).some(Boolean)}
                sx={{ px: 2.5 }}
              >
                {t('actions.refresh', 'Recargar')}
              </Button>
            </ResponsiveActionBar>
          </ResponsiveFilters>

          {hasBlockingErrors ? (
            <Alert
              severity="warning"
              action={
                <Button color="inherit" size="small" startIcon={<RefreshIcon />} onClick={retryAll}>
                  {t('crm.actions.retry', 'Reintentar')}
                </Button>
              }
            >
              {t('crm.errors.partialData', 'Algunas fuentes fallaron. Puedes reintentar para completar la vista 360.')}
            </Alert>
          ) : null}
        </MainCard>

        {!selectedCustomer ? (
          <MainCard contentSX={{ p: { xs: 1.5, sm: 2.5 } }}>
            <ActionableState
              icon={<PersonIcon />}
              title={t('crm.empty.title', 'Selecciona un cliente para ver su panorama 360°')}
              subtitle={t('crm.empty.subtitle', 'Encontrarás sus suscripciones, managed accounts, facturación, licencias y métricas clave.')}
              actions={[
                {
                  id: 'select-first-customer',
                  label: t('crm.actions.selectFirstCustomer', 'Seleccionar primer cliente'),
                  icon: <DoneAllIcon />,
                  disabled: customers.length === 0,
                  onClick: () => {
                    if (customers[0]) setSelectedCustomer(customers[0]);
                  }
                },
                {
                  id: 'retry-data',
                  label: t('actions.refresh', 'Recargar'),
                  icon: <RefreshIcon />,
                  variant: 'outlined',
                  onClick: retryAll
                }
              ]}
            />
          </MainCard>
        ) : loading.customers ? (
          <Stack spacing={3}>
            <Skeleton variant="rounded" height={180} />
            <Skeleton variant="rounded" height={140} />
          </Stack>
        ) : (
          <Stack spacing={{ xs: 2, md: 3 }}>
            <MainCard title={t('crm.summary.title', 'Resumen del cliente')} contentSX={{ p: { xs: 1.5, sm: 2.5 } }}>
              <Stack spacing={2.25}>
                <Box
                  sx={(theme) => ({
                    p: { xs: 1.5, sm: 2 },
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: theme.palette.mode === 'dark' ? '0 16px 36px rgba(2,8,23,0.34)' : '0 12px 30px rgba(15,23,42,0.08)',
                    background:
                      theme.palette.mode === 'light'
                        ? `linear-gradient(150deg, ${theme.palette.primary.light}18 0%, ${theme.palette.secondary.light}12 80%)`
                        : `linear-gradient(145deg, ${theme.palette.surface.card} 0%, ${theme.palette.surface.muted} 100%)`
                  })}
                >
                  <Stack spacing={2}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'flex-start', sm: 'center' }}>
                      <Avatar
                        sx={{
                          width: { xs: 56, sm: 60 },
                          height: { xs: 56, sm: 60 },
                          bgcolor: 'primary.main',
                          color: 'primary.contrastText',
                          boxShadow: 3
                        }}
                      >
                        {initials(selectedCustomer.fullName)}
                      </Avatar>
                      <Stack spacing={1} sx={{ minWidth: 0, flex: 1, width: '100%' }}>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="h4" sx={{ fontWeight: 800, overflowWrap: 'anywhere' }}>
                            {selectedCustomer.fullName}
                          </Typography>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            flexWrap="wrap"
                            useFlexGap
                            sx={{ mt: 0.75, minWidth: 0 }}
                          >
                            <StatusChip status={selectedCustomer.status} />
                            {selectedCustomer.gender ? <StatusChip status={selectedCustomer.gender} /> : null}
                            {selectedCustomer.channel ? (
                              <LabelWithIcon
                                icon={<LoyaltyIcon fontSize="small" />}
                                label={channelLabelFromValue(selectedCustomer.channel, t)}
                                color="secondary"
                              />
                            ) : null}
                          </Stack>
                        </Box>
                      </Stack>
                    </Stack>

                    <Box
                      sx={{
                        display: 'grid',
                        gap: 1.1,
                        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' }
                      }}
                    >
                      <CompactInfoTile
                        icon={<MailOutlineIcon fontSize="small" />}
                        label={t('crm.contact.email', 'Email')}
                        value={selectedCustomer.mail || '-'}
                        color="info"
                      />
                      <CompactInfoTile
                        icon={<PhoneIphoneIcon fontSize="small" />}
                        label={t('crm.contact.phone', 'Teléfono')}
                        value={selectedCustomer.phone || '-'}
                        color="primary"
                      />
                      <CompactInfoTile
                        icon={<CalendarMonthIcon fontSize="small" />}
                        label={t('crm.stats.openingLabel', 'Fecha de alta')}
                        value={selectedCustomer.openingDate ? formatDate(selectedCustomer.openingDate) : '-'}
                        color="warning"
                      />
                      <CompactInfoTile
                        icon={<PersonIcon fontSize="small" />}
                        label={t('crm.stats.referredBy', 'Referido por')}
                        value={selectedCustomer.refererBy || t('crm.stats.noRef', 'Sin referencia')}
                        color="secondary"
                      />
                    </Box>

                    <ContactActions phone={selectedCustomer.phone} mail={selectedCustomer.mail} />

                    <Paper
                      sx={{
                        p: 1.75,
                        borderRadius: 2.5,
                        border: '1px solid',
                        borderColor: 'divider',
                        bgcolor: 'background.paper'
                      }}
                    >
                      <Stack spacing={1.5}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ sm: 'center' }} justifyContent="space-between">
                          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                            {t('crm.engagement.title')}
                          </Typography>
                          {engagementLoading ? <Chip size="small" label={t('crm.engagement.updating')} /> : null}
                        </Stack>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          <Chip
                            size="small"
                            color="warning"
                            icon={<WorkspacePremiumRoundedIcon fontSize="small" />}
                            label={t('crm.engagement.vip', { value: vipSummary?.finalTierCode || '-' })}
                          />
                          <Chip size="small" color="secondary" label={t('crm.engagement.score', { value: Number(vipSummary?.computedScore || 0).toFixed(2) })} />
                          <Chip size="small" color="success" label={t('crm.engagement.points', { value: Number(loyaltySummary?.availablePoints || 0) })} />
                        </Stack>
                        <Stack spacing={0.75}>
                          <Typography variant="caption" color="text.secondary">
                            {t('crm.engagement.latestLedger')}
                          </Typography>
                          {loyaltyLedger.length ? (
                            loyaltyLedger.map((entry) => (
                              <Box
                                key={entry.id}
                                sx={{
                                  p: 1,
                                  borderRadius: 2,
                                  border: '1px solid',
                                  borderColor: 'divider',
                                  bgcolor: 'background.default'
                                }}
                              >
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="space-between">
                                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                    {entry.movementType || '-'} ·{' '}
                                    {t('crm.engagement.movement', {
                                      sign: entry.pointsDelta > 0 ? '+' : '',
                                      value: entry.pointsDelta || 0
                                    })}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {t('crm.engagement.balance', { value: entry.balanceAfter || 0 })}
                                  </Typography>
                                </Stack>
                                <Typography variant="caption" color="text.secondary">
                                  {entry.reason || '-'} · {formatDateTime(entry.createdAt)}
                                </Typography>
                              </Box>
                            ))
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              {t('crm.engagement.empty')}
                            </Typography>
                          )}
                        </Stack>
                      </Stack>
                    </Paper>
                  </Stack>
                </Box>

                <ResponsiveMetricGrid columns={{ xs: 1, sm: 2, xl: 3 }} gap={1.5}>
                  <StatCard
                    icon={<CreditCardIcon />}
                    title={t('crm.stats.billed', 'Total facturado')}
                    value={formatCurrency(totals.billed)}
                    helper={t('crm.stats.invoices', { defaultValue: 'Facturas: {{val}}', val: totals.totalInvoices })}
                    color="success"
                  />
                  <StatCard
                    icon={<ReceiptLongIcon />}
                    title={t('crm.stats.subscriptions', 'Suscripciones')}
                    value={`${customerSubscriptions.length}`}
                    helper={t('crm.stats.subscriptionsActive', { defaultValue: 'Activas: {{val}}', val: totals.activeSubs })}
                    color="info"
                  />
                  <StatCard
                    icon={<LayersIcon />}
                    title={t('crm.stats.licenses', 'Licencias')}
                    value={`${customerLicenses.length}`}
                    helper={t('crm.stats.licensesActive', { defaultValue: 'Activas: {{val}}', val: totals.activeLicenses })}
                    color="warning"
                  />
                  <StatCard
                    icon={<ManageAccountsIcon />}
                    title={t('crm.stats.managedAccounts', 'Managed Accounts')}
                    value={`${totals.totalManagedAccounts}`}
                    helper={t('crm.stats.managedAccountsActive', {
                      defaultValue: 'Activas: {{val}}',
                      val: totals.activeManagedAccounts
                    })}
                    color="secondary"
                  />
                  <StatCard
                    icon={<CalendarMonthIcon />}
                    title={t('crm.stats.nextRenewal', 'Próxima renovación')}
                    value={totals.nextRenewal ? formatDate(totals.nextRenewal) : t('crm.stats.none', 'Sin definir')}
                    helper={t('crm.stats.closest', 'Fecha más cercana')}
                    color="primary"
                  />
                  <StatCard
                    icon={<AlternateEmailIcon />}
                    title={t('crm.stats.nextManagedExpiration', 'Próx. vencimiento account')}
                    value={totals.nextManagedExpiration ? formatDate(totals.nextManagedExpiration) : t('crm.stats.none', 'Sin definir')}
                    helper={t('crm.stats.managedAccountsAlias', 'Basado en alias gestionados')}
                    color="info"
                  />
                  <StatCard
                    icon={<MonetizationOnIcon />}
                    title={t('crm.stats.lastPayment', 'Último pago')}
                    value={totals.lastInvoice ? formatDate(totals.lastInvoice) : t('crm.stats.noPayments', 'No hay pagos')}
                    helper={t('crm.stats.lastInvoice', 'Fecha de la última factura')}
                    color="secondary"
                  />
                  <StatCard
                    icon={<PersonIcon />}
                    title={t('crm.stats.referredBy', 'Referido por')}
                    value={selectedCustomer.refererBy || t('crm.stats.noRef', 'Sin referencia')}
                    helper={
                      selectedCustomer.openingDate
                        ? t('crm.stats.opening', { defaultValue: 'Alta: {{date}}', date: formatDate(selectedCustomer.openingDate) })
                        : ''
                    }
                    color="default"
                  />
                </ResponsiveMetricGrid>
              </Stack>
            </MainCard>

            {!customerHasRecords ? (
              <MainCard contentSX={{ p: { xs: 1.5, sm: 2.5 } }}>
                <ActionableState
                  icon={<TimelineIcon />}
                  title={t('crm.emptyRecords.title', 'El cliente aún no tiene movimientos')}
                  subtitle={t('crm.emptyRecords.subtitle', 'No encontramos suscripciones, facturas, licencias ni managed accounts para este cliente.')}
                  actions={[
                    {
                      id: 'refresh-customer-records',
                      label: t('actions.refresh', 'Recargar'),
                      icon: <RefreshIcon />,
                      onClick: retryAll
                    }
                  ]}
                />
              </MainCard>
            ) : (
              <MainCard
                title={t('crm.timeline.title', 'Timeline 360 del cliente')}
                secondary={
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {[
                      { value: 'ALL', label: t('crm.timeline.filters.all', 'Todo') },
                      { value: 'EXPIRATIONS', label: t('crm.timeline.filters.expirations', 'Vencimientos') },
                      { value: 'PAYMENTS', label: t('crm.timeline.filters.payments', 'Pagos') },
                      { value: 'ACTIVITY', label: t('crm.timeline.filters.activity', 'Actividad') }
                    ].map((option) => (
                      <Chip
                        key={option.value}
                        size="small"
                        label={option.label}
                        color={timelineFilter === option.value ? 'primary' : 'default'}
                        variant={timelineFilter === option.value ? 'filled' : 'outlined'}
                        onClick={() => setTimelineFilter(option.value)}
                      />
                    ))}
                  </Stack>
                }
                contentSX={{ p: { xs: 1.5, sm: 2.5 } }}
              >
                <Stack spacing={2}>
                  <Typography variant="body2" color="text.secondary">
                    {t('crm.timeline.subtitle', 'Cronología unificada con eventos comerciales y operativos del cliente seleccionado.')}
                  </Typography>

                  <Stack spacing={1.2}>
                    {timelineFilteredItems.length === 0 ? (
                      <ActionableState
                        icon={<WarningAmberIcon />}
                        title={t('crm.timeline.empty.title', 'No hay eventos para este filtro')}
                        subtitle={t('crm.timeline.empty.subtitle', 'Prueba cambiar el filtro o recargar datos para actualizar la cronología.')}
                        actions={[
                          {
                            id: 'timeline-reset-filter',
                            label: t('crm.timeline.actions.resetFilter', 'Ver todo'),
                            icon: <DoneAllIcon />,
                            onClick: () => setTimelineFilter('ALL')
                          },
                          {
                            id: 'timeline-refresh',
                            label: t('actions.refresh', 'Recargar'),
                            icon: <RefreshIcon />,
                            variant: 'outlined',
                            onClick: retryAll
                          }
                        ]}
                      />
                    ) : (
                      timelineFilteredItems.slice(0, 18).map((event) => {
                        const icon =
                          event.kind === 'EXPIRATIONS' ? (
                            <WarningAmberIcon fontSize="small" />
                          ) : event.kind === 'PAYMENTS' ? (
                            <AttachMoneyIcon fontSize="small" />
                          ) : (
                            <TrendingUpIcon fontSize="small" />
                          );

                        const accentColor = event.kind === 'EXPIRATIONS' ? 'warning' : event.kind === 'PAYMENTS' ? 'success' : 'info';
                        const kindLabel =
                          event.kind === 'EXPIRATIONS'
                            ? t('crm.timeline.filters.expirations', 'Vencimientos')
                            : event.kind === 'PAYMENTS'
                              ? t('crm.timeline.filters.payments', 'Pagos')
                              : t('crm.timeline.filters.activity', 'Actividad');

                        return (
                          <Box
                            key={event.id}
                            sx={(theme) => ({
                              borderRadius: 2.5,
                              border: '1px solid',
                              borderColor: 'divider',
                              p: { xs: 1.4, sm: 1.6 },
                              background:
                                theme.palette.mode === 'light'
                                  ? `linear-gradient(140deg, ${theme.palette[accentColor].light}1A, ${theme.palette.background.paper})`
                                  : theme.palette.surface.card
                            })}
                          >
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2} alignItems={{ sm: 'center' }}>
                              <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: { sm: 170 }, flexShrink: 0 }}>
                                <Avatar
                                  sx={(theme) => ({
                                    width: 30,
                                    height: 30,
                                    bgcolor: theme.palette[accentColor].main,
                                    color: theme.palette[accentColor].contrastText
                                  })}
                                >
                                  {icon}
                                </Avatar>
                                <Typography variant="caption" color="text.secondary">
                                  {formatDateTime(event.rawDate)}
                                </Typography>
                              </Stack>
                              <Stack spacing={0.4} sx={{ flex: 1, minWidth: 0 }}>
                                <Typography variant="body2" sx={{ fontWeight: 700, overflowWrap: 'anywhere' }}>
                                  {event.title}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ overflowWrap: 'anywhere' }}>
                                  {event.subtitle}
                                </Typography>
                              </Stack>
                              <Stack
                                direction="row"
                                spacing={0.8}
                                alignItems="center"
                                flexWrap="wrap"
                                useFlexGap
                                sx={{ minWidth: { xs: 0, sm: 190 } }}
                              >
                                <Chip size="small" label={kindLabel} color={accentColor} variant="outlined" />
                                <StatusChip status={event.status} />
                              </Stack>
                            </Stack>
                          </Box>
                        );
                      })
                    )}
                  </Stack>
                </Stack>
              </MainCard>
            )}

            <MainCard
              title={t('crm.modules.title', 'Módulos detallados')}
              sx={{
                borderRadius: 2.5,
                background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.light}20, ${theme.palette.secondary.light}18)`
              }}
              contentSX={{ p: { xs: 1.5, sm: 2.5 } }}
            >
              <Stack spacing={2}>
                <Typography variant="body2" color="text.secondary">
                  {t('crm.modules.subtitle', 'Abre submódulos dedicados con contexto, iconos y colores para identificar cada entidad.')}
                </Typography>
                <ResponsiveMetricGrid columns={{ xs: 1, md: 2, xl: 4 }} gap={1.25}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<WifiTetheringIcon />}
                    onClick={() => openFullModule('subscriptions')}
                    fullWidth
                    sx={{ minHeight: 48, borderRadius: 2.5, boxShadow: 3, textTransform: 'none' }}
                  >
                    {t('crm.modules.subscriptions', 'Ver suscripciones')}
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<ReceiptLongIcon />}
                    onClick={() => openFullModule('invoices')}
                    fullWidth
                    sx={{
                      minHeight: 48,
                      borderRadius: 2.5,
                      boxShadow: 2,
                      textTransform: 'none',
                      backgroundColor: (theme) => `${theme.palette.secondary.light}16`
                    }}
                  >
                    {t('crm.modules.invoices', 'Ver facturación')}
                  </Button>
                  <Button
                    variant="outlined"
                    color="info"
                    startIcon={<ManageAccountsIcon />}
                    onClick={() => openFullModule('managedAccounts')}
                    fullWidth
                    sx={{
                      minHeight: 48,
                      borderRadius: 2.5,
                      boxShadow: 2,
                      textTransform: 'none',
                      backgroundColor: (theme) => `${theme.palette.info.light}16`
                    }}
                  >
                    {t('crm.modules.managedAccounts', 'Ver managed accounts')}
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<SmartDisplayIcon />}
                    onClick={() => openFullModule('licenses')}
                    fullWidth
                    sx={{
                      minHeight: 48,
                      borderRadius: 2.5,
                      boxShadow: 2,
                      textTransform: 'none',
                      backgroundColor: (theme) => `${theme.palette.error.light}16`
                    }}
                  >
                    {t('crm.modules.licenses', 'Ver licencias')}
                  </Button>
                </ResponsiveMetricGrid>
              </Stack>
            </MainCard>
          </Stack>
        )}

        <Stack
          direction="row"
          spacing={1}
          flexWrap="wrap"
          useFlexGap
          justifyContent={{ xs: 'flex-start', sm: 'flex-end' }}
          sx={{ px: { xs: 0.25, sm: 0 } }}
        >
          <Chip
            label={t('crm.datasets.customers', { defaultValue: 'Clientes cargados: {{count}}', count: customers.length })}
            color="primary"
            variant="outlined"
            size="small"
          />
          <Chip
            label={t('crm.datasets.managedAccounts', {
              defaultValue: 'Managed accounts: {{count}}',
              count: managedAccounts.length
            })}
            color="info"
            variant="outlined"
            size="small"
          />
          <Chip
            label={t('crm.datasets.label', {
              defaultValue: 'Datasets: {{state}}',
              state:
                loading.customers || loading.subscriptions || loading.invoices || loading.licenses || loading.managedAccounts
                  ? t('crm.datasets.loading', 'Cargando...')
                  : t('crm.datasets.ready', 'Listos')
            })}
            color={
              loading.customers || loading.subscriptions || loading.invoices || loading.licenses || loading.managedAccounts
                ? 'warning'
                : 'success'
            }
            variant="outlined"
            size="small"
          />
        </Stack>
      </Stack>

      <Dialog
        open={detail.open}
        onClose={() => setDetail({ open: false, type: null, row: null })}
        fullWidth
        fullScreen={isMobile}
        maxWidth="md"
        PaperProps={{
          sx: (theme) => ({
            borderRadius: 3,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: theme.palette.mode === 'light' ? theme.palette.primary.light : theme.palette.primary.dark,
            boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
            background: theme.palette.background.paper
          })
        }}
      >
        <DialogTitleWithClose
          onClose={() => setDetail({ open: false, type: null, row: null })}
          sx={(theme) => ({
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            py: 2,
            px: 2.5,
            background:
              theme.palette.mode === 'light'
                ? `linear-gradient(135deg, ${theme.palette.primary.light}30 0%, ${theme.palette.secondary.light}25 60%, ${theme.palette.background.paper} 100%)`
                : `linear-gradient(135deg, ${theme.palette.primary.dark}60 0%, ${theme.palette.secondary.dark}40 70%, ${theme.palette.background.default} 100%)`,
            borderBottom: `1px solid ${theme.palette.divider}`
          })}
        >
          <Avatar
            sx={(theme) => ({
              bgcolor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              width: 40,
              height: 40,
              boxShadow: 4
            })}
          >
            <VisibilityOutlinedIcon />
          </Avatar>
          <Stack spacing={0.2}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, letterSpacing: 0.2 }}>
              {detail.type === 'subscription' && t('crm.detail.subscription', 'Detalle de suscripción')}
              {detail.type === 'managedAccount' && t('crm.detail.managedAccount', 'Detalle de managed account')}
              {detail.type === 'invoice' && t('crm.detail.invoice', 'Detalle de factura')}
              {detail.type === 'license' && t('crm.detail.license', 'Detalle de licencia')}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t('crm.detail.helper', 'Visualización enriquecida con íconos y descripciones.')}
            </Typography>
          </Stack>
        </DialogTitleWithClose>
        <DialogContent
          dividers
          sx={{
            bgcolor: 'background.default'
          }}
        >
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
              {detail.type === 'subscription' && t('crm.detail.summary.subscription', 'Resumen de la suscripción')}
              {detail.type === 'managedAccount' && t('crm.detail.summary.managedAccount', 'Resumen de la cuenta gestionada')}
              {detail.type === 'license' && t('crm.detail.summary.license', 'Resumen de la licencia')}
              {detail.type === 'invoice' && t('crm.detail.summary.invoice', 'Resumen de la factura')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {detail.type === 'subscription' &&
                t(
                  'crm.detail.summary.subscriptionHelper',
                  'Visualiza línea, paquete, fechas y estado de pago automático de la suscripción seleccionada.'
                )}
              {detail.type === 'managedAccount' &&
                t(
                  'crm.detail.summary.managedAccountHelper',
                  'Visualiza alias, proveedor, vigencia y reglas de distribución de la cuenta gestionada seleccionada.'
                )}
              {detail.type === 'license' &&
                t(
                  'crm.detail.summary.licenseHelper',
                  'Información clave de la licencia: aplicación, tipo, ciclo, vigencia y propietario actual.'
                )}
              {detail.type === 'invoice' &&
                t('crm.detail.summary.invoiceHelper', 'Monto pagado en Lps, método, banco y notas relevantes para la factura elegida.')}
            </Typography>
          </Box>

          {detail.type === 'managedAccount' && detail.row ? (
            <Stack spacing={2}>
              <InfoBlock
                title={t('crm.managedAccount.block.identity.title', 'Identidad de la cuenta')}
                icon={<ManageAccountsIcon />}
                color="info"
                helper={t('crm.managedAccount.block.identity.helper', 'Código interno, alias y proveedor asociado.')}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={0.75}>
                      <LabelWithIcon
                        icon={<ManageAccountsIcon fontSize="small" color="info" />}
                        label={t('crm.managedAccount.accountCode', {
                          defaultValue: 'Account code: {{value}}',
                          value: detail.row.accountCode || '-'
                        })}
                        color="info"
                      />
                      <LabelWithIcon
                        icon={<PersonIcon fontSize="small" color="primary" />}
                        label={t('crm.managedAccount.displayName', {
                          defaultValue: 'Nombre: {{value}}',
                          value: detail.row.displayName || '-'
                        })}
                        color="primary"
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={0.75}>
                      <LabelWithIcon
                        icon={<AlternateEmailIcon fontSize="small" color="secondary" />}
                        label={t('crm.managedAccount.alias', {
                          defaultValue: 'Alias: {{value}}',
                          value: detail.row.aliasEmail || '-'
                        })}
                        color="secondary"
                      />
                      <LabelWithIcon
                        icon={<Inventory2Icon fontSize="small" color="warning" />}
                        label={t('crm.managedAccount.provider', {
                          defaultValue: 'Provider: {{value}}',
                          value: detail.row.providerCode || detail.row.providerName || '-'
                        })}
                        color="warning"
                      />
                    </Stack>
                  </Grid>
                </Grid>
              </InfoBlock>

              <InfoBlock
                title={t('crm.managedAccount.block.status.title', 'Estado y vigencia')}
                icon={<CalendarMonthIcon />}
                color="secondary"
                helper={t('crm.managedAccount.block.status.helper', 'Control de vencimiento y distribución por alias.')}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={0.9}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <ChecklistIcon fontSize="small" color="action" />
                        <StatusChip status={detail.row.accountStatus} />
                      </Stack>
                      <LabelWithIcon
                        icon={<CalendarMonthIcon fontSize="small" color="warning" />}
                        label={t('crm.managedAccount.expirationDate', {
                          defaultValue: 'Expira: {{value}}',
                          value: formatDate(detail.row.expirationDate)
                        })}
                        color="warning"
                      />
                      <LabelWithIcon
                        icon={<CalendarMonthIcon fontSize="small" color="primary" />}
                        label={t('crm.managedAccount.renewalDate', {
                          defaultValue: 'Renueva: {{value}}',
                          value: formatDate(detail.row.renewalDate)
                        })}
                        color="primary"
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={0.9}>
                      <LabelWithIcon
                        icon={<ChecklistIcon fontSize="small" color={detail.row.allowDistribution ? 'success' : 'error'} />}
                        label={t('crm.managedAccount.allowDistribution', {
                          defaultValue: 'Distribución: {{value}}',
                          value: detail.row.allowDistribution ? t('common.enabled', 'Habilitada') : t('common.disabled', 'Deshabilitada')
                        })}
                        color={detail.row.allowDistribution ? 'success' : 'error'}
                      />
                      <LabelWithIcon
                        icon={<MailOutlineIcon fontSize="small" color="info" />}
                        label={t('crm.managedAccount.lastEmail', {
                          defaultValue: 'Último correo: {{value}}',
                          value: formatDate(detail.row.lastEmailReceivedAt)
                        })}
                        color="info"
                      />
                      <LabelWithIcon
                        icon={<PersonIcon fontSize="small" color="secondary" />}
                        label={t('crm.managedAccount.createdBy', {
                          defaultValue: 'Creada por: {{value}}',
                          value: detail.row.createdBy || '-'
                        })}
                        color="secondary"
                      />
                    </Stack>
                  </Grid>
                  {detail.row.notes ? (
                    <Grid item xs={12}>
                      <LabelWithIcon
                        icon={<NoteAltIcon fontSize="small" color="secondary" />}
                        label={t('crm.managedAccount.notes', {
                          defaultValue: 'Notas: {{value}}',
                          value: detail.row.notes
                        })}
                        color="secondary"
                      />
                    </Grid>
                  ) : null}
                </Grid>
              </InfoBlock>
            </Stack>
          ) : null}

          {detail.type === 'subscription' && detail.row ? (
            <Stack spacing={2}>
              <InfoBlock
                title={t('crm.subscription.block.line.title', 'Línea y cobro')}
                icon={<WifiTetheringIcon />}
                color="info"
                helper={t('crm.subscription.block.line.helper', 'Identificador de línea y montos asociados.')}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={0.75}>
                      <LabelWithIcon
                        icon={<WifiTetheringIcon fontSize="small" color="info" />}
                        label={t('crm.subscription.line', { defaultValue: 'Línea: {{line}}', line: detail.row.lineId || '-' })}
                        color="info"
                      />
                      <LabelWithIcon
                        icon={<PersonIcon fontSize="small" color="primary" />}
                        label={t('crm.subscription.user', {
                          defaultValue: 'Usuario: {{user}}',
                          user: detail.row.username_line || detail.row.username || '-'
                        })}
                        color="primary"
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={0.75}>
                      <LabelWithIcon
                        icon={<MonetizationOnIcon fontSize="small" color="success" />}
                        label={t('crm.subscription.amount', {
                          defaultValue: 'Monto: {{amount}}',
                          amount: formatCurrency(detail.row.amount)
                        })}
                        color="success"
                      />
                      <LabelWithIcon
                        icon={<PriceChangeIcon fontSize="small" color="warning" />}
                        label={t('crm.subscription.discount', {
                          defaultValue: 'Descuento: {{discount}}',
                          discount: formatCurrency(detail.row.discount)
                        })}
                        color="warning"
                      />
                    </Stack>
                  </Grid>
                </Grid>
              </InfoBlock>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <InfoBlock
                    title={t('crm.subscription.block.dates.title', 'Fechas y billing')}
                    icon={<CalendarMonthIcon />}
                    color="primary"
                    helper={t('crm.subscription.block.dates.helper', 'Ciclo actual y próxima renovación.')}
                  >
                    <Stack spacing={1}>
                      <LabelWithIcon
                        icon={<CalendarMonthIcon fontSize="small" color="primary" />}
                        label={t('crm.subscription.start', { defaultValue: 'Inicio: {{date}}', date: formatDate(detail.row.startDate) })}
                        color="primary"
                      />
                      <LabelWithIcon
                        icon={<CalendarMonthIcon fontSize="small" color="warning" />}
                        label={t('crm.subscription.renewal', {
                          defaultValue: 'Renovación: {{date}}',
                          date: formatDate(detail.row.renewalDate)
                        })}
                        color="warning"
                      />
                      <LabelWithIcon
                        icon={<ChecklistIcon fontSize="small" color="info" />}
                        label={t('crm.subscription.billing', {
                          defaultValue: 'Billing: {{billing}}',
                          billing: detail.row.billing || '-'
                        })}
                        color="info"
                      />
                    </Stack>
                  </InfoBlock>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InfoBlock
                    title={t('crm.subscription.block.status.title', 'Estado y paquete')}
                    icon={<LayersIcon />}
                    color="secondary"
                    helper={t('crm.subscription.block.status.helper', 'Estado, paquete y pago automático.')}
                  >
                    <Stack spacing={1}>
                      <StatusChip status={detail.row.status} />
                      <LabelWithIcon
                        icon={<Inventory2Icon fontSize="small" color="secondary" />}
                        label={t('crm.subscription.package', {
                          defaultValue: 'Paquete: {{pkg}}',
                          pkg: detail.row.packageName || detail.row.packageId || '-'
                        })}
                        color="secondary"
                      />
                      {detail.row.packageDescription ? (
                        <FormHelperText sx={{ m: 0 }}>{detail.row.packageDescription}</FormHelperText>
                      ) : null}
                      <LabelWithIcon
                        icon={<ChecklistIcon fontSize="small" color="success" />}
                        label={t('crm.subscription.autoPay', {
                          defaultValue: 'Pago automático: {{val}}',
                          val: detail.row.automaticPay ? t('common.yes', 'Sí') : t('common.no', 'No')
                        })}
                        color="success"
                      />
                      {detail.row.linkAutomatic ? (
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <LinkIcon fontSize="small" color="action" />
                          <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                            {detail.row.linkAutomatic}
                          </Typography>
                        </Stack>
                      ) : null}
                    </Stack>
                  </InfoBlock>
                </Grid>
              </Grid>
            </Stack>
          ) : null}

          {detail.type === 'license' && detail.row ? (
            <Stack spacing={2}>
              <InfoBlock
                title={t('crm.license.block.app.title', 'Aplicación y plan')}
                icon={<SmartDisplayIcon />}
                color="info"
                helper={t('crm.license.block.app.helper', 'Resumen de la licencia seleccionada.')}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={0.75}>
                      <LabelWithIcon
                        icon={<SmartDisplayIcon fontSize="small" color="info" />}
                        label={t('crm.license.app', { defaultValue: 'Aplicación: {{app}}', app: detail.row.app || '-' })}
                        color="info"
                      />
                      <LabelWithIcon
                        icon={<LinkIcon fontSize="small" color="info" />}
                        label={t('crm.license.deviceKey', { defaultValue: 'Device Key: {{value}}', value: detail.row.deviceKey || '-' })}
                        color="info"
                      />
                      <LabelWithIcon
                        icon={<LayersIcon fontSize="small" color="secondary" />}
                        label={t('crm.license.type', { defaultValue: 'Tipo: {{type}}', type: detail.row.typeLicense || '-' })}
                        color="secondary"
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={0.75}>
                      <LabelWithIcon
                        icon={<PriceChangeIcon fontSize="small" color="success" />}
                        label={t('crm.license.price', { defaultValue: 'Precio: {{price}}', price: formatCurrency(detail.row.price) })}
                        color="success"
                      />
                      <LabelWithIcon
                        icon={<CalendarMonthIcon fontSize="small" color="primary" />}
                        label={t('crm.license.period', { defaultValue: 'Periodo: {{period}}', period: detail.row.licensePeriod || '-' })}
                        color="primary"
                      />
                      <LabelWithIcon
                        icon={<PaidIcon fontSize="small" color={detail.row.isPaid ? 'success' : 'warning'} />}
                        label={t('crm.license.paid', {
                          defaultValue: 'Pago: {{status}}',
                          status: detail.row.isPaid ? 'PAGADA' : 'PENDIENTE'
                        })}
                        color={detail.row.isPaid ? 'success' : 'warning'}
                      />
                    </Stack>
                  </Grid>
                </Grid>
              </InfoBlock>

              <InfoBlock
                title={t('crm.license.block.details.title', 'Detalles de licencia')}
                icon={<Inventory2Icon />}
                color="secondary"
                helper={t('crm.license.block.details.helper', 'Estado, fechas y propietario.')}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={1}>
                      <LabelWithIcon
                        icon={<MemoryIcon fontSize="small" color="info" />}
                        label={t('crm.license.mac', { defaultValue: 'MAC: {{mac}}', mac: detail.row.macAddress || '-' })}
                        color="info"
                      />
                      <LabelWithIcon
                        icon={<PersonIcon fontSize="small" color="primary" />}
                        label={t('crm.license.name', { defaultValue: 'Nombre: {{name}}', name: detail.row.name || '-' })}
                        color="primary"
                      />
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Inventory2Icon fontSize="small" color="secondary" />
                        <StatusChip status={detail.row.status} />
                      </Stack>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={1}>
                      <LabelWithIcon
                        icon={<CalendarMonthIcon fontSize="small" color="primary" />}
                        label={t('crm.license.created', { defaultValue: 'Creada: {{date}}', date: formatDate(detail.row.createdAt) })}
                        color="primary"
                      />
                      <LabelWithIcon
                        icon={<CalendarMonthIcon fontSize="small" color="warning" />}
                        label={t('crm.license.expires', { defaultValue: 'Expira: {{date}}', date: formatDate(detail.row.expireAt) })}
                        color="warning"
                      />
                      <LabelWithIcon
                        icon={<CalendarMonthIcon fontSize="small" color="secondary" />}
                        label={t('crm.license.ownerSince', {
                          defaultValue: 'Owner desde: {{date}}',
                          date: formatDate(detail.row.currentOwnerSince)
                        })}
                        color="secondary"
                      />
                    </Stack>
                  </Grid>
                </Grid>
              </InfoBlock>
            </Stack>
          ) : null}

          {detail.type === 'invoice' && detail.row ? (
            <Stack spacing={2}>
              <InfoBlock
                title={t('crm.invoice.block.amount.title', 'Cobro y estado')}
                icon={<CreditCardIcon />}
                color="success"
                helper={t('crm.invoice.block.amount.helper', 'Importe total y método de pago.')}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={0.75}>
                      <LabelWithIcon
                        icon={<MonetizationOnIcon fontSize="small" color="success" />}
                        label={t('crm.invoice.totalPaid', {
                          defaultValue: 'Total pagado: {{amount}}',
                          amount: formatCurrency(Number(detail.row.amountPaid) - Number(detail.row.amountDiscount))
                        })}
                        color="success"
                      />
                      <LabelWithIcon
                        icon={<PriceChangeIcon fontSize="small" color="warning" />}
                        label={t('crm.invoice.discount', {
                          defaultValue: 'Descuento: {{discount}}',
                          discount: formatCurrency(detail.row.amountDiscount)
                        })}
                        color="warning"
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={0.75}>
                      <LabelWithIcon
                        icon={<LanguageIcon fontSize="small" color="info" />}
                        label={t('crm.invoice.method', { defaultValue: 'Método: {{method}}', method: detail.row.paymentMethod || '-' })}
                        color="info"
                      />
                      <LabelWithIcon
                        icon={<ChecklistIcon fontSize="small" color="primary" />}
                        label={t('crm.invoice.status', { defaultValue: 'Estado: {{status}}', status: detail.row.status || '-' })}
                        color="primary"
                      />
                    </Stack>
                  </Grid>
                </Grid>
              </InfoBlock>

              <InfoBlock
                title={t('crm.invoice.block.info.title', 'Información de factura')}
                icon={<LanguageIcon />}
                color="info"
                helper={t('crm.invoice.block.info.helper', 'Servicio, paquete, banco y notas.')}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={1}>
                      <LabelWithIcon
                        icon={<CalendarMonthIcon fontSize="small" color="primary" />}
                        label={t('crm.invoice.date', { defaultValue: 'Fecha: {{date}}', date: formatDate(detail.row.paymentDate) })}
                        color="primary"
                      />
                      <LabelWithIcon
                        icon={<HomeRepairServiceIcon fontSize="small" color="info" />}
                        label={t('crm.invoice.service', {
                          defaultValue: 'Servicio: {{service}}',
                          service: serviceMap[String(detail.row.serviceId ?? '')] || detail.row.serviceName || detail.row.serviceId || '-'
                        })}
                        color="info"
                      />
                      <LabelWithIcon
                        icon={<Inventory2Icon fontSize="small" color="secondary" />}
                        label={t('crm.invoice.package', {
                          defaultValue: 'Paquete: {{pkg}}',
                          pkg: packageMap[String(detail.row.packageId ?? '')]?.name || detail.row.packageId || '-'
                        })}
                        color="secondary"
                      />
                      {packageMap[String(detail.row.packageId ?? '')]?.description ? (
                        <FormHelperText sx={{ m: 0 }}>{packageMap[String(detail.row.packageId ?? '')].description}</FormHelperText>
                      ) : null}
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={1}>
                      <LabelWithIcon
                        icon={<AccountBalanceIcon fontSize="small" color="success" />}
                        label={t('crm.invoice.bank', {
                          defaultValue: 'Banco: {{bank}}',
                          bank: bankMap[String(detail.row.bankId ?? '')] || detail.row.bankName || detail.row.bankId || '-'
                        })}
                        color="success"
                      />
                      <LabelWithIcon
                        icon={<NoteAltIcon fontSize="small" color="secondary" />}
                        label={t('crm.invoice.notes', {
                          defaultValue: 'Notas: {{notes}}',
                          notes: detail.row.notes ? detail.row.notes : t('crm.invoice.noNotes', 'Sin notas')
                        })}
                        color="secondary"
                      />
                    </Stack>
                  </Grid>
                </Grid>
              </InfoBlock>
            </Stack>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetail({ open: false, type: null, row: null })}>{t('common.close', 'Cerrar')}</Button>
        </DialogActions>
      </Dialog>

      {/* Dialogo para ver tablas completas cuando hay muchos registros */}
      <Dialog
        open={tableDialog.open}
        onClose={() => {
          setTableDialog({ open: false, title: '', description: '', rows: [], columns: [], onDetail: null });
          setTablePage(0);
          setTableSelectedKeys([]);
        }}
        fullWidth
        fullScreen={isMobile}
        maxWidth="lg"
        PaperProps={{
          sx: (theme) => ({
            borderRadius: 3,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: theme.palette.secondary.light,
            boxShadow: '0 22px 60px rgba(0,0,0,0.22)',
            background: theme.palette.background.paper
          })
        }}
      >
        <DialogTitleWithClose
          onClose={() => {
            setTableDialog({ open: false, title: '', description: '', rows: [], columns: [], onDetail: null });
            setTablePage(0);
            setTableSelectedKeys([]);
          }}
          sx={(theme) => ({
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            py: 2,
            px: 2.5,
            background:
              theme.palette.mode === 'light'
                ? `linear-gradient(135deg, ${theme.palette.secondary.light}35, ${theme.palette.primary.light}25)`
                : `linear-gradient(135deg, ${theme.palette.secondary.dark}45, ${theme.palette.primary.dark}35)`,
            color: theme.palette.getContrastText(theme.palette.secondary.main),
            borderBottom: `1px solid ${theme.palette.divider}`
          })}
        >
          <Avatar
            sx={(theme) => ({
              bgcolor: theme.palette.secondary.main,
              color: theme.palette.secondary.contrastText,
              width: 40,
              height: 40,
              boxShadow: 4
            })}
          >
            <VisibilityOutlinedIcon />
          </Avatar>
          <Stack spacing={0}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
              {tableDialog.title}
            </Typography>
            {tableDialog.description ? (
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                {tableDialog.description}
              </Typography>
            ) : null}
          </Stack>
        </DialogTitleWithClose>
        <DialogContent dividers sx={{ p: 2.5 }}>
          {tableDialog.description ? (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
              {tableDialog.description}
            </Typography>
          ) : null}
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={1}
            justifyContent="space-between"
            alignItems={{ md: 'center' }}
            sx={{ mb: 1.5 }}
          >
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
              <Chip
                size="small"
                color={tableSelectedKeys.length ? 'primary' : 'default'}
                label={t('crm.bulk.selected', {
                  defaultValue: 'Seleccionados: {{count}}',
                  count: tableSelectedKeys.length
                })}
              />
              <Chip
                size="small"
                variant="outlined"
                label={t('crm.bulk.visible', {
                  defaultValue: 'Visibles: {{count}}',
                  count: paginatedTableRows.length
                })}
              />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
              <Button size="small" variant="outlined" startIcon={<DoneAllIcon />} onClick={toggleVisibleRowsSelection}>
                {allVisibleRowsSelected
                  ? t('crm.bulk.unselectVisible', 'Deseleccionar visibles')
                  : t('crm.bulk.selectVisible', 'Seleccionar visibles')}
              </Button>
              <Button size="small" variant="outlined" startIcon={<DeselectIcon />} onClick={clearTableSelection}>
                {t('crm.bulk.clearSelection', 'Limpiar selección')}
              </Button>
              <Button
                size="small"
                variant="outlined"
                startIcon={<ContentCopyIcon />}
                onClick={copySelectedIds}
                disabled={tableSelectedKeys.length === 0}
              >
                {t('crm.bulk.copyIds', 'Copiar IDs')}
              </Button>
              <Button size="small" variant="contained" startIcon={<DownloadIcon />} onClick={exportSelectedToCsv}>
                {t('crm.bulk.exportCsv', 'Exportar CSV')}
              </Button>
            </Stack>
          </Stack>

          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 2.5,
              boxShadow: 4,
              border: '1px solid',
              borderColor: 'divider',
              overflow: 'hidden'
            }}
          >
            <Table size="small" stickyHeader sx={{ minWidth: { xs: 960, md: '100%' } }}>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      size="small"
                      checked={allVisibleRowsSelected}
                      indeterminate={tableSelectedKeys.length > 0 && !allVisibleRowsSelected}
                      onChange={toggleVisibleRowsSelection}
                    />
                  </TableCell>
                  {tableDialog.columns.map((col) => (
                    <TableCell key={col.field}>{col.title}</TableCell>
                  ))}
                  {tableDialog.onDetail ? <TableCell align="right">{t('crm.table.detail', 'Detalle')}</TableCell> : null}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedTableRows.map((row) => (
                  <TableRow key={getRowKey(row)}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        size="small"
                        checked={tableSelectedKeys.includes(getRowKey(row))}
                        onChange={() => toggleRowSelection(row)}
                      />
                    </TableCell>
                    {tableDialog.columns.map((col) => (
                      <TableCell key={col.field}>{typeof col.render === 'function' ? col.render(row) : (row[col.field] ?? '-')}</TableCell>
                    ))}
                    {tableDialog.onDetail ? (
                      <TableCell align="right">
                        <Tooltip title={t('crm.table.detail', 'Detalle')}>
                          <IconButton size="small" onClick={() => tableDialog.onDetail(row)}>
                            <VisibilityOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    ) : null}
                  </TableRow>
                ))}
                {tableDialog.rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={tableDialog.columns.length + (tableDialog.onDetail ? 2 : 1)} align="center" sx={{ py: 4 }}>
                      <ActionableState
                        icon={<TimelineIcon />}
                        title={t('crm.table.empty', 'No hay datos')}
                        subtitle={t('crm.table.emptyHelp', 'No hay registros para este cliente en este módulo.')}
                        actions={[
                          {
                            id: 'table-retry',
                            label: t('actions.refresh', 'Recargar'),
                            icon: <RefreshIcon />,
                            onClick: retryAll
                          }
                        ]}
                      />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between' }}>
          <TablePagination
            component="div"
            count={tableDialog.rows.length}
            page={tablePage}
            onPageChange={(e, p) => setTablePage(p)}
            rowsPerPage={tableRpp}
            onRowsPerPageChange={(e) => {
              setTableRpp(parseInt(e.target.value, 10));
              setTablePage(0);
            }}
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
          />
          <Button
            onClick={() => {
              setTableDialog({ open: false, title: '', rows: [], columns: [], onDetail: null });
              setTableSelectedKeys([]);
            }}
          >
            {t('common.close', 'Cerrar')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
