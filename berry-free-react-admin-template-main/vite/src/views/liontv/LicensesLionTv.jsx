import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import useAuth from 'hooks/useAuth';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import FormHelperText from '@mui/material/FormHelperText';
import { useTheme, useMediaQuery } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

import RefreshIcon from '@mui/icons-material/Refresh';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SearchIcon from '@mui/icons-material/Search';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SecurityIcon from '@mui/icons-material/Security';
import HistoryIcon from '@mui/icons-material/History';
import MemoryIcon from '@mui/icons-material/Memory';
import PersonIcon from '@mui/icons-material/Person';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AppsIcon from '@mui/icons-material/Apps';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DnsIcon from '@mui/icons-material/Dns';
import LinkIcon from '@mui/icons-material/Link';
import ShieldMoonIcon from '@mui/icons-material/ShieldMoon';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import FlagCircleIcon from '@mui/icons-material/FlagCircle';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PaidIcon from '@mui/icons-material/Paid';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';

import MainCard from 'ui-component/cards/MainCard';
import LionMetricCard from 'ui-component/cards/LionMetricCard';
import DialogTitleWithClose from 'ui-component/dialogs/DialogTitleWithClose';
import MobileFieldGrid from 'ui-component/responsive/MobileFieldGrid';
import MobileSummaryCard from 'ui-component/responsive/MobileSummaryCard';
import ResponsiveActionBar from 'ui-component/responsive/ResponsiveActionBar';
import ResponsiveEntityView from 'ui-component/responsive/ResponsiveEntityView';
import ResponsiveFilters from 'ui-component/responsive/ResponsiveFilters';
import { gridSpacing } from 'store/constant';
import { lionTvApi } from 'utils/api';

function RowActions({ row, onEdit, onTransfer, onServer, onRemovePlaylists, onHistory, onDelete, t }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  return (
    <>
      <IconButton
        size="small"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={(theme) => ({
          bgcolor: theme.palette.primary.lighter,
          color: theme.palette.primary.main,
          '&:hover': { bgcolor: theme.palette.primary.light },
          boxShadow: '0 6px 12px rgba(0,0,0,0.12)'
        })}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            onEdit?.(row);
          }}
        >
          <EditOutlinedIcon fontSize="small" style={{ marginRight: 8, color: '#1e88e5' }} />
          {t('actions.edit', 'Edit')}
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            onTransfer?.(row);
          }}
        >
          <SwapHorizIcon fontSize="small" style={{ marginRight: 8, color: '#6d4c41' }} />
          {t('licenses.actions.transfer', 'Transfer')}
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            onServer?.(row);
          }}
        >
          <AppsIcon fontSize="small" style={{ marginRight: 8, color: '#7b1fa2' }} />
          {t('licenses.actions.server', 'Change server')}
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            onRemovePlaylists?.(row);
          }}
        >
          <PlaylistRemoveIcon fontSize="small" style={{ marginRight: 8, color: '#fb8c00' }} />
          {t('licenses.actions.removePlaylists', 'Remove all playlists')}
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            onHistory?.(row);
          }}
        >
          <HistoryIcon fontSize="small" style={{ marginRight: 8, color: '#546e7a' }} />
          {t('licenses.actions.history', 'History')}
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            onDelete?.(row);
          }}
        >
          <DeleteOutlineIcon fontSize="small" style={{ marginRight: 8, color: '#e53935' }} />
          {t('actions.delete', 'Delete')}
        </MenuItem>
      </Menu>
    </>
  );
}

const STATUS_OPTIONS = ['ACTIVE', 'INACTIVE', 'EXPIRED', 'AVAILABLE', 'EMERGENCY', 'NOT_TRANSFERRABLE'];
const APPS = ['Vivo Player', 'Smart One', 'IboPro Player', 'Bob Player', '9xtream4k'];
const LICENSE_PERIOD = ['ANNUAL', 'LIFETIME'];
const TYPE_LICENSE = ['PRIMARY', 'USED'];
const PAYMENT_FILTER_OPTIONS = ['PAID', 'PENDING'];
const fieldSx = {
  '& .MuiInputBase-root': { borderRadius: 2, minHeight: 48 },
  '& .MuiInputLabel-root': { fontWeight: 500 }
};
const MAC_ADDRESS_REGEX = /^[0-9a-f]{2}(:[0-9a-f]{2}){5}$/;

function maskMacAddressInput(value) {
  const hex = String(value ?? '')
    .toLowerCase()
    .replace(/[^0-9a-f]/g, '')
    .slice(0, 12);
  if (!hex) return '';
  return hex.match(/.{1,2}/g)?.join(':') ?? '';
}

function isValidMacAddress(value) {
  return MAC_ADDRESS_REGEX.test(String(value ?? '').toLowerCase());
}

function parsePaidValue(value) {
  if (value === true || value === 1 || value === '1') return true;
  if (typeof value === 'string' && value.trim().toLowerCase() === 'true') return true;
  return false;
}

function idsMatch(left, right) {
  return String(left ?? '') === String(right ?? '');
}

function formatSubscriptionLabel(subscription) {
  if (!subscription) return '-';
  const id = subscription.id ?? subscription.subscriptionId ?? '-';
  const lineId = subscription.lineId || '-';
  const lineUsername = subscription.lineUsername || subscription.usernameLine || subscription.username_line || '';
  const status = subscription.status || '-';
  return lineUsername ? `#${id} - ${lineUsername} - ${status}` : `#${id} - Line ${lineId} - ${status}`;
}

function parseToDay(value) {
  if (!value) return null;
  const raw = String(value).trim();
  if (!raw) return null;
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) {
    const date = new Date(`${raw.slice(0, 10)}T00:00:00`);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return null;
  date.setHours(0, 0, 0, 0);
  return date;
}

function resolveDisplayStatus(statusRaw, expireAt) {
  const normalized = (statusRaw ?? '').toUpperCase();
  if (normalized === 'EXPIRED') return 'EXPIRED';

  const expDate = parseToDay(expireAt);
  if (!expDate) return normalized;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (expDate < today) return 'EXPIRED';

  return normalized;
}

function LicenseStatusChip({ status }) {
  const theme = useTheme();
  const map = {
    ACTIVE: {
      bg: theme.palette.success.lighter || `${theme.palette.success.main}22`,
      color: theme.palette.success.darker || theme.palette.success.dark,
      border: theme.palette.success.main,
      icon: <CheckCircleOutlineIcon fontSize="small" />
    },
    INACTIVE: {
      bg: theme.palette.warning.lighter || `${theme.palette.warning.main}18`,
      color: theme.palette.warning.darker || theme.palette.warning.dark,
      border: theme.palette.warning.main,
      icon: <PauseCircleOutlineIcon fontSize="small" />
    },
    EXPIRED: {
      bg: theme.palette.error.lighter || `${theme.palette.error.main}18`,
      color: theme.palette.error.darker || theme.palette.error.dark,
      border: theme.palette.error.main,
      icon: <ErrorOutlineIcon fontSize="small" />
    },
    AVAILABLE: {
      bg: theme.palette.info.lighter || `${theme.palette.info.main}18`,
      color: theme.palette.info.darker || theme.palette.info.dark,
      border: theme.palette.info.main,
      icon: <PauseCircleOutlineIcon fontSize="small" />
    },
    EMERGENCY: {
      bg: theme.palette.secondary.lighter || `${theme.palette.secondary.main}18`,
      color: theme.palette.secondary.darker || theme.palette.secondary.dark,
      border: theme.palette.secondary.main,
      icon: <ShieldMoonIcon fontSize="small" />
    }
  };

  const cfg =
    map[status] || {
      bg: theme.palette.surface?.muted || theme.palette.background.paper,
      color: theme.palette.text.secondary,
      border: theme.palette.divider,
      icon: <PauseCircleOutlineIcon fontSize="small" />
    };

  return (
    <Chip
      size="small"
      icon={cfg.icon}
      label={status || '-'}
      variant="outlined"
      sx={{
        fontWeight: 700,
        bgcolor: cfg.bg,
        color: cfg.color,
        borderColor: cfg.border,
        px: 0.5,
        letterSpacing: 0.2
      }}
    />
  );
}

const sectionSx = {
  p: 2,
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
  bgcolor: 'background.paper'
};

function SectionCard({ title, helper, children }) {
  return (
    <Box sx={sectionSx}>
      <Stack spacing={1.5}>
        <Box>
          <Typography variant="subtitle2">{title}</Typography>
          {helper ? (
            <Typography variant="caption" color="text.secondary">
              {helper}
            </Typography>
          ) : null}
        </Box>
        {children}
      </Stack>
    </Box>
  );
}

function normalizeLicense(item = {}) {
  const statusRaw = (item.status ?? '').toUpperCase();
  const expireAt = item.expireAt ?? item.expire_at ?? null;

  return {
    licenseId: item.licenseId ?? item.license_id ?? null,
    subscriptionId: item.subscriptionId ?? item.subscription_id ?? null,
    macAddress: item.macAddress ?? item.mac_address ?? '',
    name: item.name ?? '',
    deviceKey: item.deviceKey ?? item.device_key ?? '',
    customerId: item.customerId ?? item.customer_id ?? null,
    status: resolveDisplayStatus(statusRaw, expireAt),
    statusRaw,
    app: item.app ?? '',
    price: item.price ?? 0,
    isPaid: parsePaidValue(item.isPaid ?? item.is_paid ?? item.paid),
    createdAt: item.createdAt ?? item.created_at ?? null,
    expireAt,
    licensePeriod: item.licensePeriod ?? item.license_period ?? '',
    typeLicense: (item.typeLicense ?? item.type_license ?? '').toUpperCase(),
    username: item.username ?? '',
    currentOwnerSince: item.currentOwnerSince ?? item.current_owner_since ?? null,
    customerName: item.customerFullname ?? item.customer_fullname ?? ''
  };
}

function LicensePaidChip({ isPaid, t }) {
  return (
    <Chip
      size="small"
      icon={<PaidIcon fontSize="small" />}
      label={isPaid ? t('licenses.paid.paid', 'Paid') : t('licenses.paid.pending', 'Pending')}
      color={isPaid ? 'success' : 'warning'}
      variant={isPaid ? 'filled' : 'outlined'}
      sx={{ fontWeight: 700 }}
    />
  );
}

export default function LicensesLionTv() {
  const { enqueueSnackbar } = useSnackbar();
  const { accessToken } = useAuth();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');

  const [customers, setCustomers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [lines, setLines] = useState([]);
  const [customersLoading, setCustomersLoading] = useState(false);

  const [form, setForm] = useState({
    licenseId: null,
    macAddress: '',
    name: '',
    deviceKey: '',
    customerId: '',
    subscriptionId: '',
    status: 'ACTIVE',
    app: 'Vivo Player',
    price: '',
    isPaid: false,
    expireAt: '',
    licensePeriod: 'ANNUAL',
    typeLicense: 'PRIMARY'
  });

  const [openModal, setOpenModal] = useState(false);
  const [openDelete, setOpenDelete] = useState({ open: false, row: null });
  const [openTransfer, setOpenTransfer] = useState({ open: false, row: null, toCustomerId: '', typeLicense: 'USED' });

  const [history, setHistory] = useState([]);
  const [historyOpen, setHistoryOpen] = useState({ open: false, row: null });
  const [openServerChange, setOpenServerChange] = useState({ open: false, row: null });
  const [openRemovePlaylists, setOpenRemovePlaylists] = useState({ open: false, row: null });
  const [serverForm, setServerForm] = useState({ serverKey: '', subscriptionId: '', lineId: '', username: '', password: '', country: '', playlistName: 'Principal' });
  const [serverOptions, setServerOptions] = useState([]);

  const [sending, setSending] = useState(false);

  const handleUnauthorized = (err) => {
    const status = err?.response?.status || err?.request?.status;
    return status === 401;
  };

  const countryFromPhone = (phone) => {
    if (!phone) return 'N/D';
    const clean = phone.replace(/[^0-9+]/g, '');
    if (clean.startsWith('+34') || clean.startsWith('34')) return 'España';
    if (clean.startsWith('+1') || clean.startsWith('1')) return 'EE.UU.';
    if (clean.startsWith('+504') || clean.startsWith('504')) return 'Honduras';
    if (clean.startsWith('+503') || clean.startsWith('503')) return 'El Salvador';
    if (clean.startsWith('+502') || clean.startsWith('502')) return 'Guatemala';
    if (clean.startsWith('+57') || clean.startsWith('57')) return 'Colombia';
    if (clean.startsWith('+58') || clean.startsWith('58')) return 'Venezuela';
    return 'Otro';
  };

  const loadSubscriptions = useCallback(async () => {
    if (!accessToken) return;
    try {
      const res = await lionTvApi.get('/subscriptions/v1', {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { index: 0, size: 5000 },
        skipAuthRedirect: true
      });
      const payload = res?.data?.data ?? res?.data ?? {};
      const raw = payload.data ?? payload.items ?? payload.content ?? payload ?? [];
      const items = Array.isArray(raw) ? raw : [];
      setSubscriptions(items.map((s) => ({
        id: s.subscriptionId ?? s.id,
        customerId: s.customerId,
        lineId: s.lineId,
        lineUsername: s.usernameLine ?? s.username_line ?? s.usernameEncode ?? s.username_encode ?? '',
        packageId: s.packageId,
        renewalDate: s.renewalDate,
        status: s.status,
        username: s.username
      })));
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(t('licenses.messages.subscriptionsLoadError'), { variant: 'warning' });
      }
    }
  }, [accessToken, enqueueSnackbar, t]);

  const loadLines = useCallback(async () => {
    if (!accessToken) return;
    try {
      const res = await lionTvApi.get('/lines/v1/list-lines', {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { index: 0, size: 5000, start: 0, filters: '', sorting: '' },
        skipAuthRedirect: true
      });
      const payload = res?.data?.data ?? res?.data ?? {};
      const raw = payload.data ?? payload.items ?? payload.content ?? payload ?? [];
      const list = Array.isArray(raw) ? raw : [];
      setLines(list.map((l) => ({
        id: l.id ?? l.lineId,
        username: l.username,
        password: l.password,
        packageId: l.package_id ?? l.packageId,
        owner: l.owner_name ?? l.owner,
        phone: l.phone ?? '',
        customerId: l.customer_id ?? l.customerId
      })));
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(t('licenses.messages.linesLoadError'), { variant: 'warning' });
      }
    }
  }, [accessToken, enqueueSnackbar, t]);

  const loadServers = useCallback(async () => {
    if (!accessToken) return;
    try {
      const res = await lionTvApi.get('/licenses/v1/servers', {
        headers: { Authorization: `Bearer ${accessToken}` },
        skipAuthRedirect: true
      });
      const list = res?.data?.data ?? res?.data ?? [];
      const normalized = Array.isArray(list)
        ? list.map((s) => ({ value: s.key, label: s.label || s.key }))
        : [];
      setServerOptions(normalized);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(t('licenses.messages.serversLoadError'), { variant: 'warning' });
      }
    }
  }, [accessToken, enqueueSnackbar, t]);

  const loadLicenses = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const all = [];
      const pageSize = 5000;
      let index = 0;
      while (true) {
        const res = await lionTvApi.get('/licenses/v1', {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: { index, size: pageSize },
          skipAuthRedirect: true
        });
        const payload = res?.data?.data ?? res?.data ?? {};
        const raw = payload.data ?? payload.items ?? payload.content ?? payload ?? [];
        const batch = Array.isArray(raw) ? raw : [];
        all.push(...batch);
        if (batch.length < pageSize) break;
        index += 1;
      }
      const normalized = all.map(normalizeLicense);
      setRows(normalized);
      setTotal(normalized.length);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(t('licenses.messages.loadError'), { variant: 'error' });
      }
    } finally {
      setLoading(false);
    }
  }, [accessToken, enqueueSnackbar, t]);

  const loadCustomers = useCallback(async () => {
    if (!accessToken) return;
    setCustomersLoading(true);
    try {
      const all = [];
      let idx = 0;
      const size = 5000;
      while (true) {
        const res = await lionTvApi.get('/customers/v1', {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: { index: idx, size },
          skipAuthRedirect: true
        });
        const payload = res?.data?.data ?? res?.data ?? {};
        const raw = payload.data ?? payload.items ?? payload.content ?? payload ?? [];
        const batch = Array.isArray(raw) ? raw : [];
        all.push(...batch);
        if (batch.length < size) break;
        idx += 1;
      }
      const sorted = all.sort((a, b) => {
        const aName = (a.customerFullname || a.fullName || a.username || a.customerMail || '').toString().toLowerCase();
        const bName = (b.customerFullname || b.fullName || b.username || b.customerMail || '').toString().toLowerCase();
        return aName.localeCompare(bName);
      });
      setCustomers(sorted);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(t('licenses.messages.customersLoadError'), { variant: 'warning' });
      }
    } finally {
      setCustomersLoading(false);
    }
  }, [accessToken, enqueueSnackbar, t]);

  useEffect(() => {
    loadLicenses();
    loadCustomers();
    loadSubscriptions();
    loadLines();
    loadServers();
  }, [loadLicenses, loadCustomers, loadSubscriptions, loadLines, loadServers, refreshKey]);

  const customerNameMap = useMemo(() => {
    const map = {};
    customers.forEach((c) => {
      const id = c.customerId ?? c.id;
      if (!id) return;
      map[id] = c.customerFullname || c.fullName || c.username || c.customerMail || '';
    });
    return map;
  }, [customers]);

  const subscriptionMap = useMemo(() => {
    const map = {};
    subscriptions.forEach((subscription) => {
      const id = subscription?.id ?? subscription?.subscriptionId;
      if (id == null) return;
      map[String(id)] = subscription;
    });
    return map;
  }, [subscriptions]);

  const customerSubscriptions = useMemo(
    () =>
      subscriptions
        .filter((subscription) => idsMatch(subscription.customerId, form.customerId))
        .sort((a, b) => Number(b.id ?? 0) - Number(a.id ?? 0)),
    [form.customerId, subscriptions]
  );

  // Nota: busca en todas las licencias cargadas, incluye filtro por status y pago
  const filteredRows = useMemo(() => {
    if (!search && !statusFilter && !paymentFilter) return rows;
    const term = search.toLowerCase();
    return rows.filter((row) => {
      if (statusFilter && (row.status || '').toLowerCase() !== statusFilter.toLowerCase()) return false;
      if (paymentFilter === 'PAID' && !row.isPaid) return false;
      if (paymentFilter === 'PENDING' && row.isPaid) return false;
      const paidLabel = row.isPaid ? 'paid pagada' : 'pending pendiente no pagada';
      const subscription = row.subscriptionId ? subscriptionMap[String(row.subscriptionId)] : null;
      const subscriptionSearch = `${row.subscriptionId || ''} ${subscription?.lineId || ''} ${subscription?.lineUsername || ''} ${subscription?.status || ''}`.toLowerCase();
      return (
        (row.macAddress || '').toLowerCase().includes(term) ||
        (row.name || '').toLowerCase().includes(term) ||
        (row.deviceKey || '').toLowerCase().includes(term) ||
        (row.app || '').toLowerCase().includes(term) ||
        (row.status || '').toLowerCase().includes(term) ||
        (row.typeLicense || '').toLowerCase().includes(term) ||
        paidLabel.includes(term) ||
        subscriptionSearch.includes(term) ||
        (row.customerName || customerNameMap[row.customerId] || '').toLowerCase().includes(term)
      );
    });
  }, [rows, search, customerNameMap, statusFilter, paymentFilter, subscriptionMap]);

  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredRows.slice(start, start + rowsPerPage);
  }, [filteredRows, page, rowsPerPage]);

  useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(filteredRows.length / rowsPerPage) - 1);
    if (page > maxPage) setPage(0);
  }, [filteredRows.length, page, rowsPerPage]);

  const computeExpireDate = (period) => {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    if (period === 'LIFETIME') return '2199-12-31';
    if (period === 'ANNUAL') {
      const next = new Date(today);
      next.setFullYear(next.getFullYear() + 1);
      return next.toISOString().slice(0, 10);
    }
    return '';
  };

  const resetForm = () =>
    setForm({
      licenseId: null,
      macAddress: '',
      name: '',
      deviceKey: '',
      customerId: '',
      subscriptionId: '',
      status: 'ACTIVE',
      app: 'Vivo Player',
      price: 125,
      isPaid: false,
      expireAt: computeExpireDate('ANNUAL'),
      licensePeriod: 'ANNUAL',
      typeLicense: 'PRIMARY'
    });

  const handleFormChange = (field) => (e) => {
    const value = e.target.value;
    if (field === 'macAddress') {
      setForm((prev) => ({ ...prev, macAddress: maskMacAddressInput(value) }));
      return;
    }
    if (field === 'licensePeriod') {
      setForm((prev) => ({
        ...prev,
        licensePeriod: value,
        expireAt: computeExpireDate(value),
        price: 125
      }));
      return;
    }
    if (field === 'isPaid') {
      setForm((prev) => ({ ...prev, isPaid: parsePaidValue(value) }));
      return;
    }
    if (field === 'customerId') {
      setForm((prev) => ({ ...prev, customerId: value, subscriptionId: '' }));
      return;
    }
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleEdit = (row) => {
    setForm({
      licenseId: row.licenseId,
      macAddress: maskMacAddressInput(row.macAddress),
      name: row.name,
      deviceKey: row.deviceKey || '',
      customerId: row.customerId,
      subscriptionId: row.subscriptionId ?? '',
      status: row.statusRaw || row.status,
      app: row.app,
      price: row.price,
      isPaid: Boolean(row.isPaid),
      expireAt: row.expireAt ? String(row.expireAt).slice(0, 10) : '',
      licensePeriod: row.licensePeriod,
      typeLicense: row.typeLicense
    });
    setOpenModal(true);
  };

  const handleDelete = (row) => setOpenDelete({ open: true, row });

  const handleSave = async () => {
    if (!form.macAddress || !form.name || !form.customerId || !form.status || !form.app || !form.licensePeriod || !form.typeLicense) {
      enqueueSnackbar(t('licenses.messages.required'), { variant: 'warning' });
      return;
    }
    const normalizedMacAddress = maskMacAddressInput(form.macAddress);
    if (!isValidMacAddress(normalizedMacAddress)) {
      enqueueSnackbar(t('licenses.messages.invalidMac', 'Invalid MAC format. Use aa:bb:cc:dd:ee:ff.'), { variant: 'warning' });
      return;
    }

    const normalizeExpireAt = (val) => {
      if (!val) return null;
      // si viene solo YYYY-MM-DD, agrega T00:00:00 para satisfacer LocalDateTime en backend
      return val.includes('T') ? val : `${val}T00:00:00`;
    };

    const payload = {
      macAddress: normalizedMacAddress,
      name: form.name,
      deviceKey: form.deviceKey?.trim() || null,
      customerId: Number(form.customerId),
      subscriptionId: form.subscriptionId ? Number(form.subscriptionId) : null,
      status: form.status,
      app: form.app,
      price: form.price ? Number(form.price) : 0,
      isPaid: Boolean(form.isPaid),
      expireAt: normalizeExpireAt(form.expireAt),
      licensePeriod: form.licensePeriod,
      typeLicense: form.typeLicense
    };

    setSending(true);
    try {
      if (form.licenseId) {
        await lionTvApi.put(`/licenses/v1/${form.licenseId}`, payload, {
          headers: { Authorization: `Bearer ${accessToken}` },
          skipAuthRedirect: true
        });
      enqueueSnackbar(t('licenses.messages.updated', 'License updated.'), { variant: 'success' });
      } else {
        await lionTvApi.post('/licenses/v1', payload, {
          headers: { Authorization: `Bearer ${accessToken}` },
          skipAuthRedirect: true
        });
      enqueueSnackbar(t('licenses.messages.created', 'License created.'), { variant: 'success' });
      }
      setOpenModal(false);
      resetForm();
      setRefreshKey((v) => v + 1);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || err.message || t('licenses.messages.saveError'), { variant: 'error' });
      }
    } finally {
      setSending(false);
    }
  };

  const confirmDelete = async () => {
    const row = openDelete.row;
    if (!row?.licenseId) {
      setOpenDelete({ open: false, row: null });
      return;
    }
    setSending(true);
    try {
      await lionTvApi.delete(`/licenses/v1/${row.licenseId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        skipAuthRedirect: true
      });
      enqueueSnackbar(t('licenses.messages.deleted', 'License deleted.'), { variant: 'success' });
      setOpenDelete({ open: false, row: null });
      setRefreshKey((v) => v + 1);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || err.message || t('licenses.messages.deleteError'), { variant: 'error' });
      }
    } finally {
      setSending(false);
    }
  };

  const handleTransfer = (row) => {
    setOpenTransfer({ open: true, row, toCustomerId: '', typeLicense: 'USED' });
  };

  const handleOpenServerChange = (row) => {
    const customer = customers.find((c) => (c.customerId || c.id) === row.customerId);
    const country = countryFromPhone(customer?.customerPhone || customer?.customer_phone || '');
    const linkedSubscription = row.subscriptionId ? subscriptionMap[String(row.subscriptionId)] : null;
    const linkedLineId = linkedSubscription?.lineId || '';
    const linkedLine = lines.find((line) => idsMatch(line.id || line.lineId, linkedLineId));
    setServerForm({
      serverKey: '',
      subscriptionId: linkedSubscription?.id ?? '',
      lineId: linkedLineId,
      username: linkedLine?.username || '',
      password: linkedLine?.password || '',
      country,
      playlistName: 'Principal'
    });
    setOpenServerChange({ open: true, row });
  };

  const handleOpenRemovePlaylists = (row) => {
    setOpenRemovePlaylists({ open: true, row });
  };

  const handleSubscriptionSelect = (value) => {
    const sub = subscriptions.find((s) => idsMatch(s.id || s.subscriptionId, value));
    const lineId = sub?.lineId;
    const line = lines.find((l) => idsMatch(l.id || l.lineId, lineId));
    setServerForm((prev) => ({
      ...prev,
      subscriptionId: value,
      lineId: lineId || '',
      username: line?.username || '',
      password: line?.password || ''
    }));
  };

  const handleServerSubmit = async () => {
    const { serverKey, macAddress = openServerChange.row?.macAddress, lineId, playlistName, username, password } = {
      ...serverForm,
      macAddress: openServerChange.row?.macAddress
    };
    if (!serverKey || !macAddress || !lineId) {
      enqueueSnackbar(t('licenses.server.required', 'Select server and subscription (line).'), { variant: 'warning' });
      return;
    }
    setSending(true);
    try {
      const res = await lionTvApi.post(
        '/licenses/v1/change-server',
        { serverKey, macAddress, lineId, playlistName, username, password },
        { headers: { Authorization: `Bearer ${accessToken}` }, skipAuthRedirect: true }
      );
      const msg = res?.data?.data?.message || res?.data?.message || t('licenses.server.updated');
      enqueueSnackbar(msg, { variant: 'success' });
      setOpenServerChange({ open: false, row: null });
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || err.message || t('licenses.server.error'), { variant: 'error' });
      }
    } finally {
      setSending(false);
    }
  };

  const confirmRemovePlaylists = async () => {
    const macAddress = openRemovePlaylists.row?.macAddress;
    if (!macAddress) {
      enqueueSnackbar(t('licenses.server.removeRequired', 'Device MAC is required.'), { variant: 'warning' });
      return;
    }

    setSending(true);
    try {
      const res = await lionTvApi.post(
        '/licenses/v1/change-server',
        { serverKey: 'remove-all-device-playlists', macAddress, lineId: '' },
        { headers: { Authorization: `Bearer ${accessToken}` }, skipAuthRedirect: true }
      );
      const msg =
        res?.data?.data?.message || res?.data?.message || t('licenses.server.removeSuccess', 'All playlists removed from device.');
      enqueueSnackbar(msg, { variant: 'success' });
      setOpenRemovePlaylists({ open: false, row: null });
      setRefreshKey((v) => v + 1);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        const status = err?.response?.status;
        const fallback =
          status === 404
            ? t('licenses.server.removeNotAvailable', 'This action is not available yet in backend.')
            : t('licenses.server.removeError', 'Could not remove playlists from device.');
        enqueueSnackbar(err?.response?.data?.message || err.message || fallback, { variant: 'error' });
      }
    } finally {
      setSending(false);
    }
  };

  const handleRemovePlaylistsDirect = async () => {
    const macAddress = openServerChange.row?.macAddress;
    if (!macAddress) {
      enqueueSnackbar(t('licenses.server.removeRequired', 'Device MAC is required.'), { variant: 'warning' });
      return;
    }

    setSending(true);
    try {
      const res = await lionTvApi.post(
        '/licenses/v1/change-server',
        { serverKey: 'remove-all-device-playlists', macAddress, lineId: '' },
        { headers: { Authorization: `Bearer ${accessToken}` }, skipAuthRedirect: true }
      );
      const msg =
        res?.data?.data?.message || res?.data?.message || t('licenses.server.removeSuccess', 'All playlists removed from device.');
      enqueueSnackbar(msg, { variant: 'success' });
      setOpenServerChange({ open: false, row: null });
      setRefreshKey((v) => v + 1);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        const status = err?.response?.status;
        const fallback =
          status === 404
            ? t('licenses.server.removeNotAvailable', 'This action is not available yet in backend.')
            : t('licenses.server.removeError', 'Could not remove playlists from device.');
        enqueueSnackbar(err?.response?.data?.message || err.message || fallback, { variant: 'error' });
      }
    } finally {
      setSending(false);
    }
  };

  const submitTransfer = async () => {
    const { row, toCustomerId, typeLicense } = openTransfer;
    if (!row?.licenseId || !toCustomerId || !typeLicense) {
      enqueueSnackbar(t('licenses.transfer.required', 'Select customer and type.'), { variant: 'warning' });
      return;
    }
    setSending(true);
    try {
      await lionTvApi.post(
        `/licenses/v1/${row.licenseId}/transfer`,
        { toCustomerId: Number(toCustomerId), typeLicense },
        { headers: { Authorization: `Bearer ${accessToken}` }, skipAuthRedirect: true }
      );
      enqueueSnackbar(t('licenses.transfer.done', 'License transferred.'), { variant: 'success' });
      setOpenTransfer({ open: false, row: null, toCustomerId: '', typeLicense: 'USED' });
      setRefreshKey((v) => v + 1);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || err.message || t('licenses.transfer.error'), { variant: 'error' });
      }
    } finally {
      setSending(false);
    }
  };

  const openHistory = async (row) => {
    setHistoryOpen({ open: true, row });
    try {
      const res = await lionTvApi.get(`/licenses/v1/${row.licenseId}/transfers`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        skipAuthRedirect: true
      });
      const list = res?.data?.data ?? res?.data ?? [];
      setHistory(Array.isArray(list) ? list : []);
    } catch {
      setHistory([]);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 1400, mx: 'auto' }}>
      <MainCard
        title={t('licenses.title')}
        secondary={
          <ResponsiveActionBar>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => setRefreshKey((v) => v + 1)}
              sx={{ borderRadius: 3, borderWidth: 2, textTransform: 'none', fontWeight: 700, px: 2.5 }}
            >
              {t('actions.refresh', 'Refresh')}
            </Button>
            <Button
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
              onClick={() => {
                resetForm();
                setOpenModal(true);
              }}
              sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 700, px: 2.8, boxShadow: '0 12px 24px rgba(0,133,255,0.35)' }}
              fullWidth={isMobile}
            >
              {t('actions.add', 'Add')}
            </Button>
          </ResponsiveActionBar>
        }
      >
        <Grid container spacing={gridSpacing}>
          {[
            { title: t('licenses.title'), value: total, helper: t('licenses.search'), color: 'primary', icon: <SecurityIcon fontSize="small" /> },
            { title: 'ACTIVE', value: rows.filter((r) => r.status === 'ACTIVE').length, helper: t('licenses.filters.status'), color: 'success', icon: <SecurityIcon fontSize="small" /> },
            { title: 'INACTIVE', value: rows.filter((r) => r.status === 'INACTIVE').length, helper: t('licenses.filters.status'), color: 'warning', icon: <SecurityIcon fontSize="small" /> },
            { title: 'EXPIRED', value: rows.filter((r) => r.status === 'EXPIRED').length, helper: t('licenses.filters.status'), color: 'error', icon: <SecurityIcon fontSize="small" /> },
            { title: 'AVAILABLE', value: rows.filter((r) => r.status === 'AVAILABLE').length, helper: t('licenses.filters.status'), color: 'info', icon: <SecurityIcon fontSize="small" /> },
            { title: 'EMERGENCY', value: rows.filter((r) => r.status === 'EMERGENCY').length, helper: t('licenses.filters.status'), color: 'secondary', icon: <SecurityIcon fontSize="small" /> }
          ].map((item, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <LionMetricCard {...item} />
            </Grid>
          ))}
        </Grid>
      </MainCard>

      {/* ✅ SEARCH + TABLE (ESTILO CUSTOMERS) */}
      <MainCard
        title={t('licenses.search')}
        secondary={
          <ResponsiveFilters
            paperSx={{
              width: { xs: '100%', sm: 760 }
            }}
          >
            <TextField
              size="small"
              placeholder={t('licenses.search')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'background.paper'
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                )
              }}
            />

            <FormControl
              size="small"
              sx={{
                minWidth: 160,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'background.paper'
                }
              }}
            >
              <InputLabel>{t('licenses.filters.status')}</InputLabel>
              <Select
                value={statusFilter}
                label={t('licenses.filters.status')}
                onChange={(e) => setStatusFilter(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <SecurityIcon fontSize="small" color="action" />
                  </InputAdornment>
                }
              >
                <MenuItem value="">
                  <em>{t('licenses.filters.all')}</em>
                </MenuItem>
                {STATUS_OPTIONS.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              size="small"
              sx={{
                minWidth: 170,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'background.paper'
                }
              }}
            >
              <InputLabel>{t('licenses.filters.payment', 'Payment')}</InputLabel>
              <Select
                value={paymentFilter}
                label={t('licenses.filters.payment', 'Payment')}
                onChange={(e) => setPaymentFilter(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <PaidIcon fontSize="small" color="action" />
                  </InputAdornment>
                }
              >
                <MenuItem value="">
                  <em>{t('licenses.filters.all')}</em>
                </MenuItem>
                {PAYMENT_FILTER_OPTIONS.map((value) => (
                  <MenuItem key={value} value={value}>
                    {value === 'PAID' ? t('licenses.paid.paid', 'Paid') : t('licenses.paid.pending', 'Pending')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </ResponsiveFilters>
        }
      >
        <ResponsiveEntityView
          isMobile={isMobile}
          mobileContent={
            loading ? (
              <Stack spacing={1.5}>
                {Array.from({ length: 4 }).map((_, idx) => (
                  <Skeleton key={`licenses-mobile-${idx}`} variant="rounded" height={220} />
                ))}
              </Stack>
            ) : paginatedRows.length ? (
              <Stack spacing={1.5}>
                {paginatedRows.map((row) => (
                  <MobileSummaryCard
                    key={row.licenseId}
                    icon={
                      <Avatar sx={{ width: 40, height: 40, bgcolor: 'secondary.light', color: 'secondary.dark' }}>
                        <MemoryIcon fontSize="small" />
                      </Avatar>
                    }
                    title={row.macAddress || '-'}
                    subtitle={row.name || '-'}
                    chips={[
                      <LicenseStatusChip key="status" status={row.status} />,
                      <LicensePaidChip key="paid" isPaid={row.isPaid} t={t} />,
                      <Chip key="app" size="small" variant="outlined" label={row.app || '-'} />
                    ]}
                    actions={
                      <ResponsiveActionBar>
                        <Button size="small" variant="outlined" onClick={() => handleEdit(row)}>
                          {t('actions.edit', 'Edit')}
                        </Button>
                        <RowActions
                          row={row}
                          t={t}
                          onEdit={handleEdit}
                          onTransfer={handleTransfer}
                          onServer={handleOpenServerChange}
                          onRemovePlaylists={handleOpenRemovePlaylists}
                          onHistory={openHistory}
                          onDelete={handleDelete}
                        />
                      </ResponsiveActionBar>
                    }
                  >
                    <MobileFieldGrid
                      fields={[
                        { label: t('licenses.headers.deviceKey', 'Device Key'), value: row.deviceKey || '-' },
                        { label: t('licenses.headers.customer'), value: row.customerName || customerNameMap[row.customerId] || '-' },
                        {
                          label: t('licenses.headers.subscription', 'Subscription'),
                          value: row.subscriptionId
                            ? `#${row.subscriptionId} · ${
                                subscriptionMap[String(row.subscriptionId)]?.lineUsername ||
                                (subscriptionMap[String(row.subscriptionId)]?.lineId
                                  ? `Line ${subscriptionMap[String(row.subscriptionId)]?.lineId}`
                                  : '-')
                              }`
                            : '-'
                        },
                        { label: t('licenses.headers.period'), value: row.licensePeriod || '-' }
                      ]}
                    />
                  </MobileSummaryCard>
                ))}
              </Stack>
            ) : (
              <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
                <Stack spacing={1} alignItems="center">
                  <Avatar sx={{ bgcolor: 'primary.lighter', color: 'primary.main' }}>
                    <SecurityIcon />
                  </Avatar>
                  <Typography variant="subtitle1">{t('licenses.table.emptyTitle', 'No licenses found')}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('licenses.table.emptyText', 'Try adjusting filters or add a new license.')}
                  </Typography>
                  <Button variant="contained" onClick={() => setOpenModal(true)} size="small" fullWidth>
                    {t('actions.add', 'Add')}
                  </Button>
                </Stack>
              </Paper>
            )
          }
          desktopContent={
            <TableContainer
              component={Paper}
              sx={{
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: '0 12px 24px rgba(0,0,0,0.06)',
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Table size="small" sx={{ minWidth: { xs: 1120, md: '100%' } }}>
                <TableHead>
                  <TableRow
                    sx={(theme) => ({
                      bgcolor: theme.palette.surface.sunken,
                      borderBottom: `1px solid ${theme.palette.divider}`
                    })}
                  >
                    <TableCell>{t('licenses.headers.mac')}</TableCell>
                    <TableCell>{t('licenses.headers.deviceKey', 'Device Key')}</TableCell>
                    <TableCell>{t('licenses.headers.customer')}</TableCell>
                    <TableCell>{t('licenses.headers.subscription', 'Subscription')}</TableCell>
                    <TableCell>{t('licenses.headers.app')}</TableCell>
                    <TableCell>{t('licenses.headers.status')}</TableCell>
                    <TableCell>{t('licenses.headers.paid', 'Paid')}</TableCell>
                    <TableCell>{t('licenses.headers.period')}</TableCell>
                    <TableCell>{t('licenses.headers.actions')}</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {paginatedRows.map((row) => (
                    <TableRow
                      key={row.licenseId}
                      hover
                      sx={{
                        '&:nth-of-type(odd)': { bgcolor: 'background.default' },
                        transition: 'background 0.2s ease',
                        cursor: 'pointer'
                      }}
                    >
                      <TableCell>
                        <Stack direction="row" spacing={1.25} alignItems="center">
                          <Avatar
                            sx={{
                              width: 34,
                              height: 34,
                              bgcolor: (theme) => theme.palette.secondary.light,
                              color: (theme) => theme.palette.secondary.dark,
                              fontWeight: 700,
                              boxShadow: 2,
                              border: '1px solid',
                              borderColor: 'divider'
                            }}
                          >
                            <MemoryIcon fontSize="small" />
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2">{row.macAddress || '-'}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {row.name || '-'}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>

                      <TableCell>{row.deviceKey || '-'}</TableCell>

                      <TableCell>{row.customerName || customerNameMap[row.customerId] || '-'}</TableCell>

                      <TableCell>
                        {row.subscriptionId ? (
                          <Stack spacing={0.25}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              #{row.subscriptionId}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {subscriptionMap[String(row.subscriptionId)]?.lineUsername ||
                                (subscriptionMap[String(row.subscriptionId)]?.lineId
                                  ? `Line ${subscriptionMap[String(row.subscriptionId)]?.lineId}`
                                  : '-')}
                            </Typography>
                          </Stack>
                        ) : (
                          '-'
                        )}
                      </TableCell>

                      <TableCell>
                        <Chip
                          size="small"
                          icon={<AppsIcon fontSize="small" />}
                          label={row.app || '-'}
                          sx={(theme) => ({
                            bgcolor: theme.palette.info.lighter,
                            color: theme.palette.info.darker,
                            fontWeight: 600
                          })}
                        />
                      </TableCell>

                      <TableCell>
                        <LicenseStatusChip status={row.status} />
                      </TableCell>

                      <TableCell>
                        <LicensePaidChip isPaid={row.isPaid} t={t} />
                      </TableCell>

                      <TableCell>
                        <Stack direction="row" spacing={0.75} alignItems="center">
                          <AccessTimeIcon fontSize="small" color="action" />
                          <Typography variant="body2">{row.licensePeriod || '-'}</Typography>
                        </Stack>
                      </TableCell>

                      <TableCell align="right">
                        <RowActions
                          row={row}
                          t={t}
                          onEdit={handleEdit}
                          onTransfer={handleTransfer}
                          onServer={handleOpenServerChange}
                          onRemovePlaylists={handleOpenRemovePlaylists}
                          onHistory={openHistory}
                          onDelete={handleDelete}
                        />
                      </TableCell>
                    </TableRow>
                  ))}

                  {!loading && filteredRows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                        <Stack spacing={1} alignItems="center">
                          <Avatar sx={{ bgcolor: 'primary.lighter', color: 'primary.main' }}>
                            <SecurityIcon />
                          </Avatar>
                          <Typography variant="subtitle1">
                            {t('licenses.table.emptyTitle', 'No licenses found')}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {t('licenses.table.emptyText', 'Try adjusting filters or add a new license.')}
                          </Typography>
                          <Button variant="contained" onClick={() => setOpenModal(true)} size="small">
                            {t('actions.add', 'Add')}
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )}

                  {loading && (
                    <TableRow>
                      <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                        <Stack spacing={1} alignItems="center">
                          <Skeleton variant="circular" width={40} height={40} />
                          <Typography variant="body2" color="text.secondary">
                            {t('licenses.table.loading', 'Loading licenses...')}
                          </Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          }
          pagination={
            <TablePagination
              component="div"
              count={filteredRows.length}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={(e, p) => setPage(p)}
              onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
            />
          }
          showDivider={!isMobile}
        />
      </MainCard>

      {/* MODAL CREATE/EDIT */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        fullWidth
        maxWidth="md"
        fullScreen={isMobile}
        PaperProps={{
          sx: (theme) => ({
            borderRadius: 3,
            boxShadow: '0 18px 40px rgba(0,0,0,0.18)',
            border: '1px solid',
            borderColor: form.licenseId ? theme.palette.warning.light : theme.palette.primary.light,
            backgroundImage: `linear-gradient(150deg, ${theme.vars.palette.surface.card} 0%, ${theme.vars.palette.surface.muted} 100%)`,
            ...theme.applyStyles('light', {
              backgroundImage: `linear-gradient(150deg, ${theme.vars.palette.primary.light}18 0%, ${theme.vars.palette.secondary.light}08 40%, ${theme.vars.palette.background.paper} 100%)`
            })
          })
        }}
      >
        <DialogTitleWithClose sx={{ position: 'relative', pr: 5 }} onClose={() => setOpenModal(false)}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Avatar
              sx={{
                bgcolor: form.licenseId ? 'warning.main' : 'primary.main',
                color: 'primary.contrastText',
                width: 36,
                height: 36,
                boxShadow: 3
              }}
            >
              <SecurityIcon fontSize="small" />
            </Avatar>

            <Box>
              <Typography variant="h6">{form.licenseId ? t('licenses.modal.editTitle', 'Edit license') : t('licenses.modal.newTitle', 'New license')}</Typography>
              <Typography variant="caption" color="text.secondary">
                {t('licenses.modal.subtitle', 'Enter license data and ownership.')}
              </Typography>
            </Box>
          </Stack>
        </DialogTitleWithClose>

        <DialogContent
          dividers
          sx={{
            bgcolor: 'background.default',
            px: { xs: 1.5, sm: 3 },
            py: { xs: 1.5, sm: 2 },
            position: 'relative',
            background: (theme) => `linear-gradient(180deg, ${theme.vars.palette.surface.card} 0%, ${theme.vars.palette.surface.muted} 85%)`,
            ...theme.applyStyles('light', {
              background: `linear-gradient(180deg, ${theme.vars.palette.primary.light}16 0%, ${theme.vars.palette.secondary.light}10 55%, ${theme.vars.palette.background.paper} 85%)`
            }),
            '&:before': {
              content: '\"\"',
              position: 'absolute',
              inset: 12,
              zIndex: 0,
              borderRadius: 20,
              background:
                'radial-gradient(circle at 18% 18%, rgba(33,150,243,0.10), transparent 40%), radial-gradient(circle at 82% 0%, rgba(156,39,176,0.10), transparent 35%)'
            }
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1, position: 'relative', zIndex: 1 }}>
            <Chip
              icon={<AutoAwesomeIcon fontSize="small" color={form.licenseId ? 'warning' : 'primary'} />}
              label={form.licenseId ? t('licenses.badge.edit', 'Editing') : t('licenses.badge.new', 'New')}
              color={form.licenseId ? 'warning' : 'primary'}
              variant="outlined"
              sx={{ fontWeight: 700, borderRadius: 1.5, boxShadow: 1 }}
            />
            <Typography variant="caption" color="text.secondary">
              {t('licenses.modal.helper', 'Complete key data before saving.')}
            </Typography>
          </Stack>

          <Stack spacing={2} sx={{ position: 'relative', zIndex: 1 }}>
            <SectionCard title={t('licenses.form.identity', 'Identity')} helper={t('licenses.form.identityHelper', 'Mac, name and owner')}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={3}>
                  <TextField
                    required
                    label={t('licenses.form.mac', 'Mac Address')}
                    value={form.macAddress}
                    onChange={handleFormChange('macAddress')}
                    placeholder={t('licenses.form.macPlaceholder', 'aa:bb:cc:dd:ee:ff')}
                    helperText={t('licenses.form.macHelper', 'Format: aa:bb:cc:dd:ee:ff')}
                    fullWidth
                    sx={fieldSx}
                    inputProps={{ maxLength: 17 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MemoryIcon fontSize="small" color="primary" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <TextField
                    required
                    label={t('licenses.form.name', 'Name')}
                    value={form.name}
                    onChange={handleFormChange('name')}
                    fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon fontSize="small" color="secondary" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <TextField
                    label={t('licenses.form.deviceKey', 'Device key')}
                    value={form.deviceKey || ''}
                    onChange={handleFormChange('deviceKey')}
                    fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LinkIcon fontSize="small" color="info" />
                        </InputAdornment>
                      )
                    }}
                    helperText={t('licenses.form.deviceKeyHelper', 'Optional key for this device')}
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth required sx={fieldSx} disabled={customersLoading}>
                    <InputLabel>{t('licenses.form.customer', 'Customer')}</InputLabel>
                    <Select
                      value={form.customerId}
                      label={t('licenses.form.customer', 'Customer')}
                      onChange={handleFormChange('customerId')}
                      startAdornment={
                        <InputAdornment position="start">
                          <PersonIcon fontSize="small" color="secondary" />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="">
                        <em>{t('licenses.form.select', 'Select')}</em>
                      </MenuItem>
                      {(customers || []).map((c) => (
                        <MenuItem key={c.customerId || c.id} value={c.customerId || c.id}>
                          {c.customerFullname || c.fullName || c.username || c.customerMail}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {customersLoading
                        ? t('licenses.form.loadingCustomers', 'Loading customers...')
                        : t('licenses.form.customerHelper', 'Customer linked to this license')}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={fieldSx} disabled={!form.customerId}>
                    <InputLabel>{t('licenses.form.subscription', 'Subscription')}</InputLabel>
                    <Select
                      value={form.subscriptionId}
                      label={t('licenses.form.subscription', 'Subscription')}
                      onChange={handleFormChange('subscriptionId')}
                      startAdornment={
                        <InputAdornment position="start">
                          <LinkIcon fontSize="small" color="primary" />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="">
                        <em>{t('licenses.form.subscriptionNone', 'No related subscription')}</em>
                      </MenuItem>
                      {customerSubscriptions.map((subscription) => (
                        <MenuItem key={subscription.id} value={subscription.id}>
                          {formatSubscriptionLabel(subscription)}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {!form.customerId
                        ? t('licenses.form.subscriptionSelectCustomer', 'Select a customer first.')
                        : customerSubscriptions.length
                          ? t('licenses.form.subscriptionHelper', 'Optional relation to one customer subscription.')
                          : t('licenses.form.subscriptionEmpty', 'This customer has no subscriptions available.')}
                    </FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
            </SectionCard>

            <SectionCard title={t('licenses.form.attributes', 'Attributes')} helper={t('licenses.form.attributesHelper', 'App, status, type and period')}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth required sx={fieldSx}>
                    <InputLabel>{t('licenses.form.status', 'Status')}</InputLabel>
                      <Select
                      value={form.status}
                      label={t('licenses.form.status', 'Status')}
                      onChange={handleFormChange('status')}
                      startAdornment={
                        <InputAdornment position="start">
                          <SecurityIcon fontSize="small" color="primary" />
                        </InputAdornment>
                      }
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <MenuItem key={s} value={s}>
                          {s}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{t('licenses.form.statusHelper', 'Current status')}</FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth required sx={fieldSx}>
                    <InputLabel>{t('licenses.form.type', 'Type')}</InputLabel>
                    <Select
                      value={form.typeLicense}
                      label={t('licenses.form.type', 'Type')}
                      onChange={handleFormChange('typeLicense')}
                      startAdornment={
                        <InputAdornment position="start">
                          <ShieldOutlinedIcon fontSize="small" color="secondary" />
                        </InputAdornment>
                      }
                    >
                      {TYPE_LICENSE.map((s) => (
                        <MenuItem key={s} value={s}>
                          {s}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{t('licenses.form.typeHelper', 'PRIMARY / USED')}</FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth required sx={fieldSx}>
                    <InputLabel>{t('licenses.form.app', 'App')}</InputLabel>
                    <Select
                      value={form.app}
                      label={t('licenses.form.app', 'App')}
                      onChange={handleFormChange('app')}
                      startAdornment={
                        <InputAdornment position="start">
                          <AppsIcon fontSize="small" color="primary" />
                        </InputAdornment>
                      }
                    >
                      {APPS.map((s) => (
                        <MenuItem key={s} value={s}>
                          {s}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{t('licenses.form.appHelper', 'Associated application')}</FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth required sx={fieldSx}>
                    <InputLabel>{t('licenses.form.period', 'Period')}</InputLabel>
                      <Select
                      value={form.licensePeriod}
                      label={t('licenses.form.period', 'Period')}
                      onChange={handleFormChange('licensePeriod')}
                      startAdornment={
                        <InputAdornment position="start">
                          <AccessTimeIcon fontSize="small" color="warning" />
                        </InputAdornment>
                      }
                    >
                      {LICENSE_PERIOD.map((s) => (
                        <MenuItem key={s} value={s}>
                          {s}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{t('licenses.form.periodHelper', 'Validity')}</FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
            </SectionCard>

            <SectionCard title={t('licenses.form.billing', 'Billing & expiration')} helper={t('licenses.form.billingHelper', 'Amount and expiry date')}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label={t('licenses.form.price', 'Price')}
                    type="number"
                    value={form.price}
                    onChange={handleFormChange('price')}
                    fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoneyIcon fontSize="small" color="success" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    label={t('licenses.form.expire', 'Expire')}
                    type="date"
                    value={form.expireAt || ''}
                    onChange={handleFormChange('expireAt')}
                    fullWidth
                    sx={fieldSx}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccessTimeIcon fontSize="small" color="info" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth sx={fieldSx}>
                    <InputLabel>{t('licenses.form.paid', 'Payment status')}</InputLabel>
                    <Select
                      value={Boolean(form.isPaid)}
                      label={t('licenses.form.paid', 'Payment status')}
                      onChange={handleFormChange('isPaid')}
                      startAdornment={
                        <InputAdornment position="start">
                          <PaidIcon fontSize="small" color={form.isPaid ? 'success' : 'warning'} />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value={true}>{t('licenses.paid.paid', 'Paid')}</MenuItem>
                      <MenuItem value={false}>{t('licenses.paid.pending', 'Pending')}</MenuItem>
                    </Select>
                    <FormHelperText>{t('licenses.form.paidHelper', 'Track if this license was already paid')}</FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
            </SectionCard>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button variant="outlined" onClick={resetForm} disabled={sending} startIcon={<RefreshIcon />}>
            {t('actions.clear', 'Clear')}
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={sending}
            startIcon={<RocketLaunchIcon />}
            sx={{ borderRadius: 2, boxShadow: '0 12px 28px rgba(0,0,0,0.16)', px: 2.4 }}
          >
            {sending
              ? t('actions.saving', 'Saving...')
              : form.licenseId
                ? t('licenses.form.buttons.save', 'Save changes')
                : t('licenses.form.buttons.create', 'Create')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* CHANGE SERVER */}
      <Dialog
        open={openServerChange.open}
        onClose={() => setOpenServerChange({ open: false, row: null })}
        fullWidth
        maxWidth="sm"
        fullScreen={isMobile}
      >
        <DialogTitleWithClose onClose={() => setOpenServerChange({ open: false, row: null })}>
          {t('licenses.server.title', 'Change server')}
        </DialogTitleWithClose>
        <DialogContent dividers>
          <Stack spacing={2}>
            <Typography variant="body2">
              {t('licenses.server.mac', 'Mac')}: <strong>{openServerChange.row?.macAddress}</strong>
            </Typography>
            <Typography variant="body2">
              {t('licenses.server.customer', 'Customer')}: <strong>{customerNameMap[openServerChange.row?.customerId] || '-'}</strong>
            </Typography>
            <Typography variant="body2">
              {t('licenses.server.country', 'Country (phone)')}: <strong>{serverForm.country}</strong>
            </Typography>

            <FormControl fullWidth sx={fieldSx}>
              <InputLabel>{t('licenses.server.server', 'Server')}</InputLabel>
              <Select
                value={serverForm.serverKey}
                label={t('licenses.server.server', 'Server')}
                onChange={(e) => setServerForm((p) => ({ ...p, serverKey: e.target.value }))}
                startAdornment={
                  <InputAdornment position="start">
                    <DnsIcon fontSize="small" color="primary" />
                  </InputAdornment>
                }
              >
                {serverOptions.map((s) => (
                  <MenuItem key={s.value} value={s.value}>
                    {s.label}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{t('licenses.server.helper', 'Select target server')}</FormHelperText>
            </FormControl>

            <FormControl fullWidth sx={fieldSx}>
              <InputLabel>{t('licenses.server.subscription', 'Subscription')}</InputLabel>
              <Select
                value={serverForm.subscriptionId}
                label={t('licenses.server.subscription', 'Subscription')}
                onChange={(e) => handleSubscriptionSelect(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <LinkIcon fontSize="small" color="secondary" />
                  </InputAdornment>
                }
              >
                <MenuItem value="">
                  <em>{t('licenses.form.select', 'Select')}</em>
                </MenuItem>
                {subscriptions
                  .filter((s) => idsMatch(s.customerId, openServerChange.row?.customerId))
                  .map((s) => (
                    <MenuItem key={s.id} value={s.id}>
                      {formatSubscriptionLabel(s)}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{t('licenses.server.subscriptionHelper', 'Filter by customer subscriptions')}</FormHelperText>
            </FormControl>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={t('licenses.server.username', 'Username')}
                  value={serverForm.username}
                  onChange={(e) => setServerForm((p) => ({ ...p, username: e.target.value }))}
                  fullWidth
                  sx={fieldSx}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={t('licenses.server.password', 'Password')}
                  value={serverForm.password}
                  onChange={(e) => setServerForm((p) => ({ ...p, password: e.target.value }))}
                  fullWidth
                  sx={fieldSx}
                />
              </Grid>
            </Grid>

            <TextField
              label={t('licenses.server.playlist', 'Playlist name')}
              value={serverForm.playlistName}
              onChange={(e) => setServerForm((p) => ({ ...p, playlistName: e.target.value }))}
              fullWidth
              sx={fieldSx}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FlagCircleIcon fontSize="small" color="warning" />
                  </InputAdornment>
                )
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button color="warning" variant="outlined" onClick={handleRemovePlaylistsDirect} disabled={sending}>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <PlaylistRemoveIcon fontSize="small" />
              <span>{sending ? t('actions.sending', 'Sending...') : t('licenses.server.removeSubmit', 'Remove playlists')}</span>
            </Stack>
          </Button>
          <Button onClick={() => setOpenServerChange({ open: false, row: null })}>
            {t('actions.cancel', 'Cancel')}
          </Button>
          <Button variant="contained" onClick={handleServerSubmit} disabled={sending}>
            {sending ? t('actions.sending', 'Sending...') : t('licenses.server.submit', 'Change server')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* REMOVE DEVICE PLAYLISTS */}
      <Dialog
        open={openRemovePlaylists.open}
        onClose={() => setOpenRemovePlaylists({ open: false, row: null })}
        maxWidth="xs"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitleWithClose onClose={() => setOpenRemovePlaylists({ open: false, row: null })}>
          {t('licenses.server.removeTitle', 'Remove all playlists')}
        </DialogTitleWithClose>
        <DialogContent dividers>
          <Stack spacing={1.5}>
            <Typography variant="body2">
              {t('licenses.server.removeBody', 'This will remove every playlist from this device.')}
            </Typography>
            <Typography variant="body2">
              {t('licenses.server.mac', 'Mac')}: <strong>{openRemovePlaylists.row?.macAddress || '-'}</strong>
            </Typography>
            <Typography variant="body2">
              {t('licenses.server.customer', 'Customer')}:{' '}
              <strong>{customerNameMap[openRemovePlaylists.row?.customerId] || '-'}</strong>
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRemovePlaylists({ open: false, row: null })} disabled={sending}>
            {t('actions.cancel', 'Cancel')}
          </Button>
          <Button onClick={confirmRemovePlaylists} color="warning" variant="contained" disabled={sending}>
            {sending ? t('actions.sending', 'Sending...') : t('licenses.server.removeSubmit', 'Remove playlists')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* DELETE */}
      <Dialog
        open={openDelete.open}
        onClose={() => setOpenDelete({ open: false, row: null })}
        maxWidth="xs"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitleWithClose onClose={() => setOpenDelete({ open: false, row: null })}>
          {t('licenses.delete.title', 'Delete license')}
        </DialogTitleWithClose>
        <DialogContent dividers>
          <Typography>
            {t('licenses.delete.body', 'Delete license {{name}}? This action cannot be undone.', {
              name: openDelete.row?.name ?? ''
            })}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete({ open: false, row: null })} disabled={sending}>
            {t('actions.cancel', 'Cancel')}
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained" disabled={sending}>
            {sending ? t('actions.deleting', 'Deleting...') : t('actions.delete', 'Delete')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* TRANSFER */}
      <Dialog
        open={openTransfer.open}
        onClose={() => setOpenTransfer({ open: false, row: null, toCustomerId: '', typeLicense: 'USED' })}
        fullWidth
        maxWidth="sm"
        fullScreen={isMobile}
      >
        <DialogTitleWithClose onClose={() => setOpenTransfer({ open: false, row: null, toCustomerId: '', typeLicense: 'USED' })}>
          {t('licenses.transfer.title', 'Transfer license')}
        </DialogTitleWithClose>
        <DialogContent dividers>
          <Stack spacing={2}>
            <Typography variant="body2">
              {t('licenses.transfer.license', 'License')}: {openTransfer.row?.name}
            </Typography>

            <FormControl fullWidth sx={fieldSx} disabled={customersLoading}>
              <InputLabel>{t('licenses.transfer.newCustomer', 'New customer')}</InputLabel>
              <Select
                value={openTransfer.toCustomerId}
                label={t('licenses.transfer.newCustomer', 'New customer')}
                onChange={(e) => setOpenTransfer((p) => ({ ...p, toCustomerId: e.target.value }))}
              >
                <MenuItem value="">
                  <em>{t('licenses.form.select', 'Select')}</em>
                </MenuItem>
                {(customers || []).map((c) => (
                  <MenuItem key={c.customerId || c.id} value={c.customerId || c.id}>
                    {c.customerFullname || c.fullName || c.username || c.customerMail}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                {customersLoading
                  ? t('licenses.transfer.loadingCustomers', 'Loading customers...')
                  : t('licenses.transfer.helperCustomer', 'New license owner')}
              </FormHelperText>
            </FormControl>

            <FormControl fullWidth sx={fieldSx}>
              <InputLabel>{t('licenses.transfer.type', 'Type')}</InputLabel>
              <Select
                value={openTransfer.typeLicense}
                label={t('licenses.transfer.type', 'Type')}
                onChange={(e) => setOpenTransfer((p) => ({ ...p, typeLicense: e.target.value }))}
              >
                {TYPE_LICENSE.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{t('licenses.transfer.typeHelper', 'Type to assign in new customer')}</FormHelperText>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTransfer({ open: false, row: null, toCustomerId: '', typeLicense: 'USED' })} disabled={sending}>
            {t('actions.cancel', 'Cancel')}
          </Button>
          <Button variant="contained" onClick={submitTransfer} disabled={sending}>
            {sending ? t('licenses.transfer.sending', 'Transferring...') : t('licenses.transfer.submit', 'Transfer')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ✅ HISTORY (MEJORADO PRO) */}
      <Dialog
        open={historyOpen.open}
        onClose={() => setHistoryOpen({ open: false, row: null })}
        fullWidth
        maxWidth="md"
        fullScreen={isMobile}
      >
        <DialogTitleWithClose sx={{ position: 'relative', pr: 5 }} onClose={() => setHistoryOpen({ open: false, row: null })}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Avatar
              sx={{
                bgcolor: 'info.main',
                color: 'info.contrastText',
                width: 36,
                height: 36,
                boxShadow: 3
              }}
            >
              <HistoryIcon fontSize="small" />
            </Avatar>

            <Box>
              <Typography variant="h6">{t('licenses.history.title', 'License history')}</Typography>
              <Typography variant="caption" color="text.secondary">
                {t('licenses.history.subtitle', 'Owner and type changes.')}
              </Typography>
            </Box>
          </Stack>
        </DialogTitleWithClose>

        <DialogContent
          dividers
          sx={{
            bgcolor: 'background.default',
            px: { xs: 1.5, sm: 3 },
            py: { xs: 1.5, sm: 2 }
          }}
        >
          <Stack spacing={2}>
            {/* Resumen de la licencia */}
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper'
              }}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <Typography variant="caption" color="text.secondary">
                    {t('licenses.history.license', 'License')}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {historyOpen.row?.name || '-'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {historyOpen.row?.macAddress || ''}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Typography variant="caption" color="text.secondary">
                    {t('licenses.history.currentCustomer', 'Current customer')}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {historyOpen.row?.customerName ||
                      customerNameMap[historyOpen.row?.customerId] ||
                      '-'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ID: {historyOpen.row?.customerId ?? '-'}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Stack direction="row" spacing={1} justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
                    <Chip
                      size="small"
                      label={`${t('licenses.history.total', 'Total moves')}: ${history?.length || 0}`}
                      color="info"
                      variant="outlined"
                    />
                    <Chip
                      size="small"
                      label={`${t('licenses.history.currentType', 'Current type')}: ${historyOpen.row?.typeLicense || '-'}`}
                      color="primary"
                      variant="outlined"
                    />
                  </Stack>
                </Grid>
              </Grid>
            </Box>

            {/* Movimientos */}
            <Box
              sx={{
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                overflow: 'hidden'
              }}
            >
              <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  {t('licenses.history.movements', 'Movements')}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t('licenses.history.helper', 'Most recent on top.')}
                </Typography>
              </Box>

              {(!history || history.length === 0) && (
                <Box sx={{ p: 2 }}>
                  <Typography variant="body2">{t('licenses.history.empty', 'No movements recorded.')}</Typography>
                </Box>
              )}

              {(history || []).length > 0 && (
                <Stack sx={{ p: 2 }} spacing={1.5}>
                  {[...(history || [])]
                    .slice()
                    .reverse()
                    .map((h, idx) => {
                      const fromName =
                        h.fromCustomerName ||
                        customerNameMap[h.fromCustomerId] ||
                        h.fromCustomerId ||
                        '-';
                      const toName =
                        h.toCustomerName ||
                        customerNameMap[h.toCustomerId] ||
                        h.toCustomerId ||
                        '-';
                      const dateLabel = h.createdAt ? String(h.createdAt) : '-';

                      return (
                        <Box
                          key={h.transferId ?? `${h.toCustomerId}-${idx}`}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            bgcolor: 'background.default'
                          }}
                        >
                          <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={7}>
                              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                                <Chip size="small" label={`#${(history || []).length - idx}`} variant="outlined" />
                                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                  {fromName}
                                </Typography>
                                <SwapHorizIcon fontSize="small" />
                                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                  {toName}
                                </Typography>
                              </Stack>

                              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                De ID: <strong>{h.fromCustomerId ?? '-'}</strong> → A ID:{' '}
                                <strong>{h.toCustomerId ?? '-'}</strong>
                              </Typography>
                            </Grid>

                            <Grid item xs={12} md={5}>
                              <Stack
                                direction="row"
                                spacing={1}
                                justifyContent={{ xs: 'flex-start', md: 'flex-end' }}
                                alignItems="center"
                                flexWrap="wrap"
                              >
                                <Chip
                                  size="small"
                                  color={String(h.typeLicense || '').toUpperCase() === 'PRIMARY' ? 'success' : 'warning'}
                                  label={`${t('licenses.history.type', 'Type')}: ${h.typeLicense || '-'}`}
                                />
                                <Chip size="small" variant="outlined" icon={<AccessTimeIcon color="info" />} label={dateLabel} />
                              </Stack>
                            </Grid>
                          </Grid>
                        </Box>
                      );
                    })}
                </Stack>
              )}
            </Box>

            {/* Nota */}
            <Box sx={{ px: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                {t(
                  'licenses.history.tip',
                  'Tip: API can send fromCustomerName/toCustomerName to show exact names; otherwise local map is used.'
                )}
              </Typography>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setHistoryOpen({ open: false, row: null })}>{t('actions.close', 'Close')}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
