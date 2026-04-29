import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import useAuth from 'hooks/useAuth';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
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
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
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
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
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
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';

import MainCard from 'ui-component/cards/MainCard';
import LionMetricCard from 'ui-component/cards/LionMetricCard';
import DialogTitleWithClose from 'ui-component/dialogs/DialogTitleWithClose';
import MobileFieldGrid from 'ui-component/responsive/MobileFieldGrid';
import MobileSummaryCard from 'ui-component/responsive/MobileSummaryCard';
import ResponsiveActionBar from 'ui-component/responsive/ResponsiveActionBar';
import ResponsiveEntityView from 'ui-component/responsive/ResponsiveEntityView';
import ResponsiveFilters from 'ui-component/responsive/ResponsiveFilters';
import ResponsiveMetricGrid from 'ui-component/responsive/ResponsiveMetricGrid';
import { gridSpacing } from 'store/constant';
import { listLicenseApps } from 'api/catalog-admin';
import { lionTvApi } from 'utils/api';
import {
  clearLicenseBobSession,
  completeLicenseBobCaptcha,
  listLicenseBobPlaylists,
  startLicenseBobCaptcha,
  syncLicenseBobPlaylist
} from 'api/liontv-license-bob';

const UNKNOWN_RANDOM_APP = 'UNKNOWN_RANDOM';

function isRandomLicenseApp(value) {
  return String(value || '').trim().toUpperCase() === UNKNOWN_RANDOM_APP;
}

function isManagedLicenseRecord(record = {}) {
  return Boolean(record) && !Boolean(record?.randomLicense) && !isRandomLicenseApp(record?.app);
}

function isBobLicenseRecord(record = {}) {
  return String(record?.app || '').trim().toUpperCase() === 'BOB_PLAYER';
}

function hasSubscriptionLink(record = {}) {
  return Boolean(record?.subscriptionId);
}

function requiresSubscriptionLink(record = {}) {
  return isManagedLicenseRecord(record) && !hasSubscriptionLink(record);
}

function RowActions({ row, onEdit, onTransfer, onServer, onRemovePlaylists, onHistory, onDelete, onBobAuth, onBobSync, t }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const supportsRemoteActions = isManagedLicenseRecord(row) && hasSubscriptionLink(row);
  const supportsBobAuth = isBobLicenseRecord(row);
  const supportsBobSync = supportsBobAuth && hasSubscriptionLink(row);
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
        {supportsBobAuth ? (
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              onBobAuth?.(row);
            }}
          >
            <VpnKeyOutlinedIcon fontSize="small" style={{ marginRight: 8, color: '#ef6c00' }} />
            {t('licenses.actions.authenticateBob', 'Authenticate Bob Player')}
          </MenuItem>
        ) : null}
        {supportsBobSync ? (
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              onBobSync?.(row);
            }}
          >
            <LinkIcon fontSize="small" style={{ marginRight: 8, color: '#00897b' }} />
            {t('licenses.actions.syncBobPlaylist', 'Sync Bob playlist')}
          </MenuItem>
        ) : null}
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
          disabled={!supportsRemoteActions}
          onClick={() => {
            setAnchorEl(null);
            if (supportsRemoteActions) {
              onServer?.(row);
            }
          }}
        >
          <AppsIcon fontSize="small" style={{ marginRight: 8, color: '#7b1fa2' }} />
          {t('licenses.actions.server', 'Change server')}
        </MenuItem>
        <MenuItem
          disabled={!supportsRemoteActions}
          onClick={() => {
            setAnchorEl(null);
            if (supportsRemoteActions) {
              onRemovePlaylists?.(row);
            }
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

function parseCatalogStatus(value) {
  if (value === true || value === 1 || value === '1') return true;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    return normalized === 'true' || normalized === '1';
  }
  return false;
}

const LEGACY_LICENSE_APP_LABELS = Object.freeze({
  VIVO_PLAYER: 'Vivo Player',
  SMART_ONE: 'Smart One',
  IBO_PRO: 'IboPro Player',
  BOB_PLAYER: 'Bob Player',
  NINEXTREAM: '9xtream4k',
  UNKNOWN_RANDOM: 'Unknown / external app'
});

function normalizeLicenseApp(item = {}) {
  const licenseAppName = item.licenseAppName ?? item.license_app_name ?? item.name ?? '';
  const licenseAppCode = item.licenseAppCode ?? item.license_app_code ?? item.code ?? licenseAppName;

  return {
    licenseAppId: item.licenseAppId ?? item.license_app_id ?? item.id ?? null,
    licenseAppCode: typeof licenseAppCode === 'string' ? licenseAppCode.trim() : licenseAppCode ?? '',
    licenseAppName: typeof licenseAppName === 'string' ? licenseAppName.trim() : '',
    status: parseCatalogStatus(item.status)
  };
}

function idsMatch(left, right) {
  return String(left ?? '') === String(right ?? '');
}

function formatSubscriptionLabel(subscription) {
  if (!subscription) return '-';
  const id = subscription.id ?? subscription.subscriptionId ?? '-';
  const lineId = subscription.lineId || '-';
  const linePlusId = subscription.linePlusId || '';
  const lineUsername = subscription.lineUsername || subscription.usernameLine || subscription.username_line || '';
  const status = subscription.status || '-';
  const provider = subscription.provider || '';
  const parts = [lineUsername ? `#${id} - ${lineUsername}` : `#${id} - Line ${lineId}`];
  if (lineId) parts.push(`Main ${lineId}`);
  if (linePlusId) parts.push(`Plus ${linePlusId}`);
  if (provider) parts.push(provider);
  parts.push(status);
  return parts.join(' · ');
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

function formatDateTime(value) {
  if (!value) return '-';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString();
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
    remotePlaylistId: item.remotePlaylistId ?? item.remote_playlist_id ?? '',
    bobSessionStatus: item.bobSessionStatus ?? item.bob_session_status ?? '',
    bobSessionRefreshedAt: item.bobSessionRefreshedAt ?? item.bob_session_refreshed_at ?? null,
    bobLastAuthError: item.bobLastAuthError ?? item.bob_last_auth_error ?? '',
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

function bobSessionColor(status) {
  const normalized = String(status || '').trim().toUpperCase();
  if (normalized === 'READY') return 'success';
  if (normalized === 'CAPTCHA_REQUIRED') return 'warning';
  if (normalized === 'AUTH_BLOCKED' || normalized === 'INVALID') return 'error';
  return 'default';
}

function bobSessionLabel(status, t) {
  const normalized = String(status || '').trim().toUpperCase();
  if (normalized === 'READY') return t('licenses.bob.session.ready', 'Ready');
  if (normalized === 'CAPTCHA_REQUIRED') return t('licenses.bob.session.captchaRequired', 'Captcha required');
  if (normalized === 'AUTH_BLOCKED') return t('licenses.bob.session.authBlocked', 'Auth blocked');
  if (normalized === 'INVALID') return t('licenses.bob.session.invalid', 'Invalid session');
  return t('licenses.bob.session.notConfigured', 'Not configured');
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
  const [customerFilter, setCustomerFilter] = useState('');

  const [customers, setCustomers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [lines, setLines] = useState([]);
  const [customersLoading, setCustomersLoading] = useState(false);
  const [licenseApps, setLicenseApps] = useState([]);
  const [licenseAppsLoading, setLicenseAppsLoading] = useState(false);

  const [form, setForm] = useState({
    licenseId: null,
    randomLicense: false,
    macAddress: '',
    name: '',
    deviceKey: '',
    customerId: '',
    subscriptionId: '',
    status: 'ACTIVE',
    app: '',
    price: '',
    isPaid: false,
    expireAt: '',
    licensePeriod: 'ANNUAL',
    typeLicense: 'PRIMARY'
  });

  const [openModal, setOpenModal] = useState(false);
  const [openDelete, setOpenDelete] = useState({ open: false, row: null });
  const [openTransfer, setOpenTransfer] = useState({
    open: false,
    row: null,
    toCustomerId: '',
    destinationSubscriptionId: '',
    typeLicense: 'USED'
  });

  const [history, setHistory] = useState([]);
  const [historyOpen, setHistoryOpen] = useState({ open: false, row: null });
  const [openServerChange, setOpenServerChange] = useState({ open: false, row: null });
  const [openRemovePlaylists, setOpenRemovePlaylists] = useState({ open: false, row: null });
  const [bobSyncDialog, setBobSyncDialog] = useState({
    open: false,
    row: null,
    playlists: [],
    selectedPlaylistId: '',
    loading: false
  });
  const [bobAuthDialog, setBobAuthDialog] = useState({
    open: false,
    row: null,
    challengeId: '',
    captchaSvg: '',
    captchaAnswer: '',
    session: null,
    loading: false
  });
  const [serverForm, setServerForm] = useState({
    serverKey: '',
    subscriptionId: '',
    lineId: '',
    linePlusId: '',
    effectiveLineId: '',
    lineSource: 'MAIN',
    provider: '',
    username: '',
    password: '',
    country: '',
    playlistName: 'Principal'
  });
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
        linePlusId: s.linePlusId ?? s.line_plus_id ?? '',
        lineUsername: s.usernameLine ?? s.username_line ?? s.usernameEncode ?? s.username_encode ?? '',
        packageId: s.packageId,
        renewalDate: s.renewalDate,
        status: s.status,
        username: s.username,
        provider: s.provider ?? ''
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
        usernameEncode: l.username_encode ?? l.usernameEncode ?? '',
        passwordEncode: l.password_encode ?? l.passwordEncode ?? '',
        packageId: l.package_id ?? l.packageId,
        provider: l.provider ?? '',
        lineCountry: l.line_country ?? l.lineCountry ?? '',
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
      let reportedTotal = null;
      while (true) {
        const res = await lionTvApi.get('/licenses/v1', {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: { index, size: pageSize, ...(customerFilter ? { customerId: customerFilter } : {}) },
          skipAuthRedirect: true
        });
        const payload = res?.data?.data ?? res?.data ?? {};
        if (reportedTotal === null && payload?.total != null) reportedTotal = Number(payload.total);
        const raw = payload.data ?? payload.items ?? payload.content ?? payload ?? [];
        const batch = Array.isArray(raw) ? raw : [];
        all.push(...batch);
        if (batch.length < pageSize) break;
        index += 1;
      }
      const normalized = all.map(normalizeLicense);
      setRows(normalized);
      setTotal(reportedTotal ?? normalized.length);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(t('licenses.messages.loadError'), { variant: 'error' });
      }
    } finally {
      setLoading(false);
    }
  }, [accessToken, customerFilter, enqueueSnackbar, t]);

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

  const loadLicenseApps = useCallback(async () => {
    if (!accessToken) return;
    setLicenseAppsLoading(true);
    try {
      const response = await listLicenseApps({
        headers: { Authorization: `Bearer ${accessToken}` },
        skipAuthRedirect: true
      });
      const items = Array.isArray(response) ? response : [];
      setLicenseApps(items.map(normalizeLicenseApp));
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(t('licenses.messages.appsLoadError', 'Could not load license apps.'), { variant: 'warning' });
      }
    } finally {
      setLicenseAppsLoading(false);
    }
  }, [accessToken, enqueueSnackbar, t]);

  useEffect(() => {
    loadLicenses();
    loadCustomers();
    loadSubscriptions();
    loadLines();
    loadServers();
    loadLicenseApps();
  }, [loadLicenses, loadCustomers, loadSubscriptions, loadLines, loadServers, loadLicenseApps, refreshKey]);

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

  const lineMap = useMemo(() => {
    const map = {};
    lines.forEach((line) => {
      const id = line?.id ?? line?.lineId;
      if (id == null || id === '') return;
      map[String(id)] = line;
    });
    return map;
  }, [lines]);

  const resolveServerLineContext = useCallback(
    (subscription, lineSource = 'MAIN') => {
      if (!subscription) {
        return {
          source: 'MAIN',
          lineId: '',
          linePlusId: '',
          effectiveLineId: '',
          line: null,
          provider: '',
          username: '',
          password: '',
          valid: false
        };
      }

      const safeSource = lineSource === 'PLUS' && subscription.linePlusId ? 'PLUS' : 'MAIN';
      const lineId = subscription.lineId || '';
      const linePlusId = subscription.linePlusId || '';
      const effectiveLineId = safeSource === 'PLUS' ? linePlusId : lineId;
      const line = effectiveLineId ? lineMap[String(effectiveLineId)] ?? null : null;
      const provider = line?.provider || subscription.provider || '';

      return {
        source: safeSource,
        lineId,
        linePlusId,
        effectiveLineId,
        line,
        provider,
        username: line?.username || '',
        password: line?.password || '',
        valid: Boolean(effectiveLineId && line)
      };
    },
    [lineMap]
  );

  const customerSubscriptions = useMemo(
    () =>
      subscriptions
        .filter((subscription) => idsMatch(subscription.customerId, form.customerId))
        .sort((a, b) => Number(b.id ?? 0) - Number(a.id ?? 0)),
    [form.customerId, subscriptions]
  );

  const transferCustomerSubscriptions = useMemo(
    () =>
      subscriptions
        .filter((subscription) => idsMatch(subscription.customerId, openTransfer.toCustomerId))
        .sort((a, b) => Number(b.id ?? 0) - Number(a.id ?? 0)),
    [openTransfer.toCustomerId, subscriptions]
  );

  const licenseAppLabelMap = useMemo(
    () => new Map(licenseApps.filter((item) => item.licenseAppCode).map((item) => [item.licenseAppCode, item.licenseAppName])),
    [licenseApps]
  );

  const getLicenseAppLabel = useCallback(
    (value) => {
      if (!value) return '-';
      if (isRandomLicenseApp(value)) {
        return t('licenses.form.randomAppLabel', 'Unknown / external app');
      }
      return licenseAppLabelMap.get(value) || LEGACY_LICENSE_APP_LABELS[value] || value;
    },
    [licenseAppLabelMap, t]
  );

  const activeLicenseAppOptions = useMemo(
    () =>
      licenseApps
        .filter((item) => item.status && item.licenseAppCode)
        .map((item) => ({ value: item.licenseAppCode, label: item.licenseAppName })),
    [licenseApps]
  );

  const defaultLicenseApp = activeLicenseAppOptions[0]?.value ?? '';

  const formHasLegacyApp = useMemo(
    () => Boolean(form.licenseId && form.app && !form.randomLicense && !activeLicenseAppOptions.some((option) => option.value === form.app)),
    [activeLicenseAppOptions, form.app, form.licenseId, form.randomLicense]
  );

  const formLicenseAppOptions = useMemo(() => {
    if (!formHasLegacyApp) {
      return activeLicenseAppOptions;
    }

    return [{ value: form.app, label: `${getLicenseAppLabel(form.app)} (legacy)` }, ...activeLicenseAppOptions];
  }, [activeLicenseAppOptions, form.app, formHasLegacyApp, getLicenseAppLabel]);

  // Nota: busca en todas las licencias cargadas, incluye filtro por status y pago
  const filteredRows = useMemo(() => {
    if (!search && !statusFilter && !paymentFilter && !customerFilter) return rows;
    const term = search.toLowerCase();
    return rows.filter((row) => {
      if (statusFilter && (row.status || '').toLowerCase() !== statusFilter.toLowerCase()) return false;
      if (paymentFilter === 'PAID' && !row.isPaid) return false;
      if (paymentFilter === 'PENDING' && row.isPaid) return false;
      if (customerFilter && !idsMatch(row.customerId, customerFilter)) return false;
      const paidLabel = row.isPaid ? 'paid pagada' : 'pending pendiente no pagada';
      const subscription = row.subscriptionId ? subscriptionMap[String(row.subscriptionId)] : null;
      const subscriptionSearch = `${row.subscriptionId || ''} ${subscription?.lineId || ''} ${subscription?.lineUsername || ''} ${subscription?.status || ''}`.toLowerCase();
      const licenseAppLabel = getLicenseAppLabel(row.app).toLowerCase();
      return (
        (row.macAddress || '').toLowerCase().includes(term) ||
        (row.name || '').toLowerCase().includes(term) ||
        (row.deviceKey || '').toLowerCase().includes(term) ||
        (row.app || '').toLowerCase().includes(term) ||
        licenseAppLabel.includes(term) ||
        (row.status || '').toLowerCase().includes(term) ||
        (row.typeLicense || '').toLowerCase().includes(term) ||
        paidLabel.includes(term) ||
        subscriptionSearch.includes(term) ||
        (row.customerName || customerNameMap[row.customerId] || '').toLowerCase().includes(term)
      );
    });
  }, [rows, search, customerNameMap, statusFilter, paymentFilter, customerFilter, subscriptionMap, getLicenseAppLabel]);

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

  const resetForm = useCallback(() =>
    setForm({
      licenseId: null,
      randomLicense: false,
      macAddress: '',
      name: '',
      deviceKey: '',
      customerId: '',
      subscriptionId: '',
      status: 'ACTIVE',
      app: defaultLicenseApp,
      price: 125,
      isPaid: false,
      expireAt: computeExpireDate('ANNUAL'),
      licensePeriod: 'ANNUAL',
      typeLicense: 'PRIMARY'
    }),
  [defaultLicenseApp]);

  useEffect(() => {
    if (openModal && !form.licenseId && !form.app && defaultLicenseApp) {
      setForm((prev) => ({ ...prev, app: defaultLicenseApp }));
    }
  }, [defaultLicenseApp, form.app, form.licenseId, openModal]);

  const handleFormChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    if (field === 'randomLicense') {
      setForm((prev) => ({
        ...prev,
        randomLicense: Boolean(value),
        app: value ? UNKNOWN_RANDOM_APP : isRandomLicenseApp(prev.app) ? defaultLicenseApp : prev.app,
        macAddress: value ? '' : isRandomLicenseApp(prev.app) ? '' : prev.macAddress,
        subscriptionId: value ? '' : prev.subscriptionId
      }));
      return;
    }
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
      randomLicense: isRandomLicenseApp(row.app),
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
    if (!form.randomLicense && !form.licenseId && !activeLicenseAppOptions.length) {
      enqueueSnackbar(t('licenses.messages.noActiveApps', 'No active apps available in the catalog.'), { variant: 'warning' });
      return;
    }
    if (
      !form.name ||
      !form.customerId ||
      !form.status ||
      !form.licensePeriod ||
      !form.typeLicense ||
      (!form.randomLicense && (!form.macAddress || !form.app || !form.subscriptionId))
    ) {
      enqueueSnackbar(t('licenses.messages.required'), { variant: 'warning' });
      return;
    }
    const normalizedMacAddress = maskMacAddressInput(form.macAddress);
    if (!form.randomLicense && !isValidMacAddress(normalizedMacAddress)) {
      enqueueSnackbar(t('licenses.messages.invalidMac', 'Invalid MAC format. Use aa:bb:cc:dd:ee:ff.'), { variant: 'warning' });
      return;
    }

    const normalizeExpireAt = (val) => {
      if (!val) return null;
      // si viene solo YYYY-MM-DD, agrega T00:00:00 para satisfacer LocalDateTime en backend
      return val.includes('T') ? val : `${val}T00:00:00`;
    };

    const payload = {
      randomLicense: Boolean(form.randomLicense),
      macAddress: form.randomLicense ? null : normalizedMacAddress,
      name: form.name,
      deviceKey: form.deviceKey?.trim() || null,
      customerId: Number(form.customerId),
      subscriptionId: form.subscriptionId ? Number(form.subscriptionId) : null,
      status: form.status,
      app: form.randomLicense ? UNKNOWN_RANDOM_APP : form.app,
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
    setOpenTransfer({ open: true, row, toCustomerId: '', destinationSubscriptionId: '', typeLicense: 'USED' });
  };

  const handleOpenServerChange = (row) => {
    if (requiresSubscriptionLink(row)) {
      enqueueSnackbar(t('licenses.labels.requiresSubscriptionLink', 'Requires subscription link'), { variant: 'warning' });
      return;
    }
    const customer = customers.find((c) => (c.customerId || c.id) === row.customerId);
    const country = countryFromPhone(customer?.customerPhone || customer?.customer_phone || '');
    const linkedSubscription = row.subscriptionId ? subscriptionMap[String(row.subscriptionId)] : null;
    const linkedContext = resolveServerLineContext(linkedSubscription, 'MAIN');
    setServerForm({
      serverKey: '',
      subscriptionId: linkedSubscription?.id ?? '',
      lineId: linkedContext.lineId,
      linePlusId: linkedContext.linePlusId,
      effectiveLineId: linkedContext.effectiveLineId,
      lineSource: linkedContext.source,
      provider: linkedContext.provider,
      username: linkedContext.username,
      password: linkedContext.password,
      country,
      playlistName: 'Lion Tv Premium'
    });
    setOpenServerChange({ open: true, row });
  };

  const handleOpenRemovePlaylists = (row) => {
    if (requiresSubscriptionLink(row)) {
      enqueueSnackbar(t('licenses.labels.requiresSubscriptionLink', 'Requires subscription link'), { variant: 'warning' });
      return;
    }
    setOpenRemovePlaylists({ open: true, row });
  };

  const handleLineSourceSelect = (value) => {
    const subscription = serverForm.subscriptionId ? subscriptionMap[String(serverForm.subscriptionId)] : null;
    const context = resolveServerLineContext(subscription, value);
    setServerForm((prev) => ({
      ...prev,
      lineId: context.lineId,
      linePlusId: context.linePlusId,
      effectiveLineId: context.effectiveLineId,
      lineSource: context.source,
      provider: context.provider,
      username: context.username,
      password: context.password,
      playlistName: context.source === 'PLUS' ? 'Plus' : prev.playlistName === 'Plus' ? 'Lion Tv Premium' : prev.playlistName
    }));
  };

  const handleServerSubmit = async () => {
    const { serverKey, lineSource, playlistName } = {
      ...serverForm,
    };
    const licenseId = openServerChange.row?.licenseId;
    if (!licenseId || !serverKey) {
      enqueueSnackbar(t('licenses.server.required', 'Select server before continuing.'), { variant: 'warning' });
      return;
    }
    if (lineSource === 'PLUS' && !selectedServerContext.valid) {
      enqueueSnackbar(
        t('licenses.server.plusMetadataRequired', 'Line plus metadata is incomplete. Check line plus, credentials, and provider before continuing.'),
        { variant: 'warning' }
      );
    return;
    }
    setSending(true);
    try {
      const res = await lionTvApi.post(
        `/licenses/v1/${licenseId}/change-server`,
        {
          serverKey,
          lineSource,
          playlistName
        },
        { headers: { Authorization: `Bearer ${accessToken}` }, skipAuthRedirect: true }
      );
      const msg = res?.data?.data?.message || res?.data?.message || t('licenses.server.updated');
      enqueueSnackbar(msg, { variant: 'success' });
      setOpenServerChange({ open: false, row: null });
      setRefreshKey((v) => v + 1);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        const isBob = isBobLicenseRecord(openServerChange.row);
        enqueueSnackbar(
          err?.response?.data?.message || err.message || (isBob ? t('licenses.server.bobError', 'Could not save Bob playlist.') : t('licenses.server.error')),
          { variant: 'error' }
        );
      }
    } finally {
      setSending(false);
    }
  };

  const confirmRemovePlaylists = async () => {
    const licenseId = openRemovePlaylists.row?.licenseId;
    if (!licenseId) {
      enqueueSnackbar(t('licenses.server.removeRequired', 'License id is required.'), { variant: 'warning' });
      return;
    }

    setSending(true);
    try {
      const res = await lionTvApi.post(
        `/licenses/v1/${licenseId}/remove-playlists`,
        {},
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
        const isBob = isBobLicenseRecord(openRemovePlaylists.row);
        const fallback =
          status === 404
            ? t('licenses.server.removeNotAvailable', 'This action is not available yet in backend.')
            : isBob
              ? t('licenses.server.removeBobError', 'Could not remove Bob playlists from this device.')
              : t('licenses.server.removeError', 'Could not remove playlists from device.');
        enqueueSnackbar(err?.response?.data?.message || err.message || fallback, { variant: 'error' });
      }
    } finally {
      setSending(false);
    }
  };

  const handleRemovePlaylistsDirect = async () => {
    const licenseId = openServerChange.row?.licenseId;
    if (!licenseId) {
      enqueueSnackbar(t('licenses.server.removeRequired', 'License id is required.'), { variant: 'warning' });
      return;
    }

    setSending(true);
    try {
      const res = await lionTvApi.post(
        `/licenses/v1/${licenseId}/remove-playlists`,
        {},
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
        const isBob = isBobLicenseRecord(openServerChange.row);
        const fallback =
          status === 404
            ? t('licenses.server.removeNotAvailable', 'This action is not available yet in backend.')
            : isBob
              ? t('licenses.server.removeBobError', 'Could not remove Bob playlists from this device.')
              : t('licenses.server.removeError', 'Could not remove playlists from device.');
        enqueueSnackbar(err?.response?.data?.message || err.message || fallback, { variant: 'error' });
      }
    } finally {
      setSending(false);
    }
  };

  const submitTransfer = async () => {
    const { row, toCustomerId, destinationSubscriptionId, typeLicense } = openTransfer;
    const managedLicense = isManagedLicenseRecord(row);
    if (!row?.licenseId || !toCustomerId || !typeLicense || (managedLicense && !destinationSubscriptionId)) {
      enqueueSnackbar(t('licenses.transfer.required', 'Select customer and type.'), { variant: 'warning' });
      return;
    }
    setSending(true);
    try {
      await lionTvApi.post(
        `/licenses/v1/${row.licenseId}/transfer`,
        {
          toCustomerId: Number(toCustomerId),
          destinationSubscriptionId: managedLicense ? Number(destinationSubscriptionId) : null,
          typeLicense
        },
        { headers: { Authorization: `Bearer ${accessToken}` }, skipAuthRedirect: true }
      );
      enqueueSnackbar(t('licenses.transfer.done', 'License transferred.'), { variant: 'success' });
      setOpenTransfer({ open: false, row: null, toCustomerId: '', destinationSubscriptionId: '', typeLicense: 'USED' });
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

  const closeBobAuth = () => {
    setBobAuthDialog({
      open: false,
      row: null,
      challengeId: '',
      captchaSvg: '',
      captchaAnswer: '',
      session: null,
      loading: false
    });
  };

  const closeBobSync = () => {
    setBobSyncDialog({
      open: false,
      row: null,
      playlists: [],
      selectedPlaylistId: '',
      loading: false
    });
  };

  const openBobAuth = async (row) => {
    if (!row?.licenseId) return;
    setBobAuthDialog({
      open: true,
      row,
      challengeId: '',
      captchaSvg: '',
      captchaAnswer: '',
      session: null,
      loading: true
    });
    try {
      const response = await startLicenseBobCaptcha(row.licenseId, accessToken);
      setBobAuthDialog((prev) => ({
        ...prev,
        challengeId: response.challengeId || '',
        captchaSvg: response.captchaSvg || '',
        session: response,
        loading: false
      }));
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || err.message || t('licenses.bob.messages.startError', 'Could not start Bob Player authentication.'), {
          variant: 'error'
        });
      }
      closeBobAuth();
    }
  };

  const openBobSync = async (row) => {
    if (!row?.licenseId) return;
    setBobSyncDialog({
      open: true,
      row,
      playlists: [],
      selectedPlaylistId: row.remotePlaylistId || '',
      loading: true
    });
    try {
      const playlists = await listLicenseBobPlaylists(row.licenseId, accessToken);
      setBobSyncDialog((prev) => ({
        ...prev,
        playlists: Array.isArray(playlists) ? playlists : [],
        selectedPlaylistId: row.remotePlaylistId || (Array.isArray(playlists) && playlists[0]?.playlistId) || '',
        loading: false
      }));
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || err.message || t('licenses.bob.messages.listError', 'Could not load Bob Player playlists.'), {
          variant: 'error'
        });
      }
      closeBobSync();
    }
  };

  const handleCompleteBobCaptcha = async () => {
    const licenseId = bobAuthDialog.row?.licenseId;
    if (!licenseId || !bobAuthDialog.challengeId || !bobAuthDialog.captchaAnswer) {
      enqueueSnackbar(t('licenses.bob.messages.captchaRequired', 'Enter the captcha before continuing.'), { variant: 'warning' });
      return;
    }

    setBobAuthDialog((prev) => ({ ...prev, loading: true }));
    try {
      const response = await completeLicenseBobCaptcha(
        licenseId,
        {
          challengeId: bobAuthDialog.challengeId,
          captchaAnswer: bobAuthDialog.captchaAnswer
        },
        accessToken
      );
      enqueueSnackbar(t('licenses.bob.messages.success', 'Bob Player session authenticated successfully.'), { variant: 'success' });
      setBobAuthDialog((prev) => ({
        ...prev,
        session: response,
        captchaAnswer: '',
        loading: false
      }));
      setRefreshKey((value) => value + 1);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || err.message || t('licenses.bob.messages.completeError', 'Could not complete Bob Player authentication.'), {
          variant: 'error'
        });
      }
      setBobAuthDialog((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleClearBobSession = async () => {
    const licenseId = bobAuthDialog.row?.licenseId;
    if (!licenseId) return;

    setBobAuthDialog((prev) => ({ ...prev, loading: true }));
    try {
      const response = await clearLicenseBobSession(licenseId, accessToken);
      enqueueSnackbar(t('licenses.bob.messages.cleared', 'Bob Player session cleared.'), { variant: 'success' });
      setBobAuthDialog((prev) => ({
        ...prev,
        session: response,
        captchaAnswer: '',
        loading: false
      }));
      setRefreshKey((value) => value + 1);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || err.message || t('licenses.bob.messages.clearError', 'Could not clear Bob Player session.'), {
          variant: 'error'
        });
      }
      setBobAuthDialog((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleConfirmBobSync = async () => {
    const licenseId = bobSyncDialog.row?.licenseId;
    if (!licenseId || !bobSyncDialog.selectedPlaylistId) {
      enqueueSnackbar(t('licenses.bob.messages.syncRequired', 'Select one Bob playlist before continuing.'), { variant: 'warning' });
      return;
    }

    setBobSyncDialog((prev) => ({ ...prev, loading: true }));
    try {
      await syncLicenseBobPlaylist(
        licenseId,
        { playlistId: bobSyncDialog.selectedPlaylistId },
        accessToken
      );
      enqueueSnackbar(t('licenses.bob.messages.syncSuccess', 'Bob playlist linked to this license.'), { variant: 'success' });
      closeBobSync();
      setRefreshKey((value) => value + 1);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || err.message || t('licenses.bob.messages.syncError', 'Could not sync Bob playlist.'), {
          variant: 'error'
        });
      }
      setBobSyncDialog((prev) => ({ ...prev, loading: false }));
    }
  };

  const selectedServerSubscription = useMemo(
    () => (serverForm.subscriptionId ? subscriptionMap[String(serverForm.subscriptionId)] ?? null : null),
    [serverForm.subscriptionId, subscriptionMap]
  );

  const selectedServerContext = useMemo(
    () => resolveServerLineContext(selectedServerSubscription, serverForm.lineSource),
    [resolveServerLineContext, selectedServerSubscription, serverForm.lineSource]
  );

  useEffect(() => {
    if (!openServerChange.open || !selectedServerSubscription) {
      return;
    }

    setServerForm((prev) => {
      const effectiveLineChanged = prev.effectiveLineId !== selectedServerContext.effectiveLineId;
      const sourceChanged = prev.lineSource !== selectedServerContext.source;
      const metadataChanged =
        prev.lineId !== selectedServerContext.lineId ||
        prev.linePlusId !== selectedServerContext.linePlusId ||
        prev.provider !== selectedServerContext.provider;

      if (!effectiveLineChanged && !sourceChanged && !metadataChanged) {
        return prev;
      }

      return {
        ...prev,
        lineId: selectedServerContext.lineId,
        linePlusId: selectedServerContext.linePlusId,
        effectiveLineId: selectedServerContext.effectiveLineId,
        lineSource: selectedServerContext.source,
        provider: selectedServerContext.provider,
        username: selectedServerContext.username || prev.username,
        password: selectedServerContext.password || prev.password,
        playlistName:
          selectedServerContext.source === 'PLUS'
            ? 'Plus'
            : prev.playlistName === 'Plus'
              ? 'Lion Tv Premium'
              : prev.playlistName
      };
    });
  }, [openServerChange.open, selectedServerContext, selectedServerSubscription]);

  const isBobServerChange = isBobLicenseRecord(openServerChange.row);
  const isBobRemoveDialog = isBobLicenseRecord(openRemovePlaylists.row);
  const selectedBobPlaylist = useMemo(
    () => bobSyncDialog.playlists.find((playlist) => playlist.playlistId === bobSyncDialog.selectedPlaylistId) || null,
    [bobSyncDialog.playlists, bobSyncDialog.selectedPlaylistId]
  );

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
        <ResponsiveMetricGrid columns={{ xs: 1, md: 2, lg: 3, xl: 6 }}>
          {[
            { title: t('licenses.title'), value: total, helper: t('licenses.search'), color: 'primary', icon: <SecurityIcon fontSize="small" /> },
            { title: t('licenses.status.ACTIVE', 'ACTIVE'), value: rows.filter((r) => r.status === 'ACTIVE').length, helper: t('licenses.filters.status'), color: 'success', icon: <SecurityIcon fontSize="small" /> },
            { title: t('licenses.status.INACTIVE', 'INACTIVE'), value: rows.filter((r) => r.status === 'INACTIVE').length, helper: t('licenses.filters.status'), color: 'warning', icon: <SecurityIcon fontSize="small" /> },
            { title: t('licenses.status.EXPIRED', 'EXPIRED'), value: rows.filter((r) => r.status === 'EXPIRED').length, helper: t('licenses.filters.status'), color: 'error', icon: <SecurityIcon fontSize="small" /> },
            { title: t('licenses.status.AVAILABLE', 'AVAILABLE'), value: rows.filter((r) => r.status === 'AVAILABLE').length, helper: t('licenses.filters.status'), color: 'info', icon: <SecurityIcon fontSize="small" /> },
            { title: t('licenses.status.EMERGENCY', 'EMERGENCY'), value: rows.filter((r) => r.status === 'EMERGENCY').length, helper: t('licenses.filters.status'), color: 'secondary', icon: <SecurityIcon fontSize="small" /> }
          ].map((item, idx) => (
            <LionMetricCard {...item} key={idx} />
          ))}
        </ResponsiveMetricGrid>
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

            <FormControl
              size="small"
              sx={{
                minWidth: 220,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'background.paper'
                }
              }}
            >
              <InputLabel>{t('licenses.filters.customer', 'Customer')}</InputLabel>
              <Select
                value={customerFilter}
                label={t('licenses.filters.customer', 'Customer')}
                onChange={(e) => setCustomerFilter(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <PersonOutlineIcon fontSize="small" color="action" />
                  </InputAdornment>
                }
              >
                <MenuItem value="">
                  <em>{t('licenses.filters.allCustomers', 'All customers')}</em>
                </MenuItem>
                {customers.map((customer) => {
                  const value = customer.customerId ?? customer.id;
                  if (!value) return null;
                  return (
                    <MenuItem key={value} value={value}>
                      {customer.customerFullname || customer.fullName || customer.username || customer.customerMail || `#${value}`}
                    </MenuItem>
                  );
                })}
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
                      <Chip key="app" size="small" variant="outlined" label={getLicenseAppLabel(row.app)} />,
                      isBobLicenseRecord(row) ? (
                        <Chip
                          key="bob-session"
                          size="small"
                          variant="outlined"
                          color={bobSessionColor(row.bobSessionStatus)}
                          label={bobSessionLabel(row.bobSessionStatus, t)}
                        />
                      ) : null,
                      requiresSubscriptionLink(row) ? (
                        <Chip
                          key="subscription-warning"
                          size="small"
                          color="warning"
                          variant="outlined"
                          label={t('licenses.labels.requiresSubscriptionLink', 'Requires subscription link')}
                        />
                      ) : null
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
                          onBobAuth={openBobAuth}
                          onBobSync={openBobSync}
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
                            : requiresSubscriptionLink(row)
                              ? t('licenses.labels.requiresSubscriptionLink', 'Requires subscription link')
                              : '-'
                        },
                        ...(isBobLicenseRecord(row)
                          ? [
                              { label: t('licenses.bob.session.title', 'Bob session'), value: bobSessionLabel(row.bobSessionStatus, t) },
                              { label: t('licenses.bob.remotePlaylist', 'Remote playlist'), value: row.remotePlaylistId || '-' }
                            ]
                          : []),
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
                        ) : requiresSubscriptionLink(row) ? (
                          <Chip
                            size="small"
                            color="warning"
                            variant="outlined"
                            label={t('licenses.labels.requiresSubscriptionLink', 'Requires subscription link')}
                          />
                        ) : (
                          '-'
                        )}
                      </TableCell>

                      <TableCell>
                        <Stack spacing={0.75} alignItems="flex-start">
                          <Chip
                            size="small"
                            icon={<AppsIcon fontSize="small" />}
                            label={getLicenseAppLabel(row.app)}
                            sx={(theme) => ({
                              bgcolor: isRandomLicenseApp(row.app) ? theme.palette.warning.lighter : theme.palette.info.lighter,
                              color: isRandomLicenseApp(row.app) ? theme.palette.warning.darker : theme.palette.info.darker,
                              fontWeight: 600
                            })}
                          />
                          {isBobLicenseRecord(row) ? (
                            <>
                              <Chip
                                size="small"
                                variant="outlined"
                                color={bobSessionColor(row.bobSessionStatus)}
                                label={bobSessionLabel(row.bobSessionStatus, t)}
                              />
                              <Typography variant="caption" color="text.secondary">
                                {`${t('licenses.bob.lastRefreshed', 'Last refreshed')}: ${formatDateTime(row.bobSessionRefreshedAt)}`}
                              </Typography>
                              {row.remotePlaylistId ? (
                                <Typography variant="caption" color="text.secondary">
                                  {`${t('licenses.bob.remotePlaylist', 'Remote playlist')}: ${row.remotePlaylistId}`}
                                </Typography>
                              ) : null}
                            </>
                          ) : null}
                        </Stack>
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
                          onBobAuth={openBobAuth}
                          onBobSync={openBobSync}
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
              <Box
                sx={(theme) => ({
                  mb: 2,
                  p: 1.5,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: form.randomLicense ? theme.palette.warning.light : theme.palette.divider,
                  bgcolor: form.randomLicense ? theme.palette.warning.lighter : theme.palette.background.paper
                })}
              >
                <Stack spacing={0.5}>
                  <FormControlLabel
                    control={<Switch checked={Boolean(form.randomLicense)} onChange={handleFormChange('randomLicense')} color="warning" />}
                    label={t('licenses.form.randomLicense', 'Unknown / external app')}
                    sx={{ m: 0, '& .MuiFormControlLabel-label': { fontWeight: 700 } }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {t(
                      'licenses.form.randomLicenseHelper',
                      'Use this when the customer uses their own app and you only need to keep the license slot occupied.'
                    )}
                  </Typography>
                </Stack>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={3}>
                  <TextField
                    required={!form.randomLicense}
                    label={t('licenses.form.mac', 'Mac Address')}
                    value={form.macAddress}
                    onChange={handleFormChange('macAddress')}
                    placeholder={t('licenses.form.macPlaceholder', 'aa:bb:cc:dd:ee:ff')}
                    helperText={
                      form.randomLicense
                        ? t('licenses.form.randomMacHelper', 'The system will generate a synthetic MAC to reserve this license.')
                        : t('licenses.form.macHelper', 'Format: aa:bb:cc:dd:ee:ff')
                    }
                    fullWidth
                    sx={fieldSx}
                    inputProps={{ maxLength: 17 }}
                    disabled={form.randomLicense}
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
                    helperText={
                      form.randomLicense
                        ? t('licenses.form.randomDeviceKeyHelper', 'Optional note or external identifier. If empty, the system creates one.')
                        : t('licenses.form.deviceKeyHelper', 'Optional key for this device')
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth required sx={fieldSx} disabled={customersLoading || Boolean(form.licenseId)}>
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
                      {form.licenseId
                        ? t('licenses.form.customerLocked', 'Use transfer to change the customer of an existing license.')
                        : customersLoading
                        ? t('licenses.form.loadingCustomers', 'Loading customers...')
                        : t('licenses.form.customerHelper', 'Customer linked to this license')}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required={!form.randomLicense} sx={fieldSx} disabled={!form.customerId}>
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
                      {form.randomLicense ? (
                        <MenuItem value="">
                          <em>{t('licenses.form.subscriptionNone', 'No related subscription')}</em>
                        </MenuItem>
                      ) : null}
                      {customerSubscriptions.map((subscription) => (
                        <MenuItem key={subscription.id} value={subscription.id}>
                          {formatSubscriptionLabel(subscription)}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {!form.customerId
                        ? t('licenses.form.subscriptionSelectCustomer', 'Select a customer first.')
                        : form.randomLicense
                          ? t('licenses.form.subscriptionRandomHelper', 'External licenses may stay without a subscription link.')
                        : customerSubscriptions.length
                          ? t('licenses.form.subscriptionRequiredHelper', 'Managed licenses must stay linked to one customer subscription.')
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
                  {form.randomLicense ? (
                    <FormControl fullWidth sx={fieldSx}>
                      <TextField
                        label={t('licenses.form.app', 'App')}
                        value={t('licenses.form.randomAppLabel', 'Unknown / external app')}
                        fullWidth
                        disabled
                        sx={fieldSx}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AppsIcon fontSize="small" color="warning" />
                            </InputAdornment>
                          )
                        }}
                        helperText={t(
                          'licenses.form.randomAppHelper',
                          'Remote playlist actions are disabled because this record only reserves the occupied slot.'
                        )}
                      />
                    </FormControl>
                  ) : (
                    <FormControl fullWidth required sx={fieldSx} disabled={licenseAppsLoading || (!activeLicenseAppOptions.length && !formHasLegacyApp)}>
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
                        {!formHasLegacyApp ? (
                          <MenuItem value="">
                            <em>{t('licenses.form.select', 'Select')}</em>
                          </MenuItem>
                        ) : null}
                        {formLicenseAppOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>
                        {licenseAppsLoading
                          ? t('licenses.form.loadingApps', 'Loading apps...')
                          : !activeLicenseAppOptions.length && !formHasLegacyApp
                            ? t('licenses.form.appEmpty', 'No active apps available. Configure the catalog first.')
                            : formHasLegacyApp
                              ? t('licenses.form.appLegacyHelper', 'This license uses an inactive app from the catalog. Choose an active app to replace it.')
                              : t('licenses.form.appHelper', 'Associated application')}
                      </FormHelperText>
                    </FormControl>
                  )}
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
            disabled={sending || (!form.licenseId && !activeLicenseAppOptions.length)}
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

      <Dialog
        open={bobAuthDialog.open}
        onClose={closeBobAuth}
        fullWidth
        maxWidth="sm"
        fullScreen={isMobile}
      >
        <DialogTitleWithClose onClose={closeBobAuth}>
          {t('licenses.bob.dialog.title', 'Authenticate Bob Player')}
        </DialogTitleWithClose>
        <DialogContent dividers>
          <Stack spacing={2}>
            <Typography variant="body2" color="text.secondary">
              {t(
                'licenses.bob.dialog.helper',
                'The system uses the MAC address and device key saved on this license, requests the live captcha from Bob Player and only asks you to enter the captcha answer.'
              )}
            </Typography>

            <Grid container spacing={1.5}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  disabled
                  label={t('licenses.form.mac', 'Mac Address')}
                  value={bobAuthDialog.session?.macAddress || bobAuthDialog.row?.macAddress || '-'}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  disabled
                  label={t('licenses.bob.deviceKeyMasked', 'Stored device key')}
                  value={bobAuthDialog.session?.deviceKeyMasked || bobAuthDialog.row?.deviceKey || '-'}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  disabled
                  label={t('licenses.bob.session.title', 'Bob session')}
                  value={bobSessionLabel(bobAuthDialog.session?.sessionStatus, t)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  disabled
                  label={t('licenses.bob.remotePlaylist', 'Remote playlist')}
                  value={bobAuthDialog.session?.remotePlaylistId || bobAuthDialog.row?.remotePlaylistId || '-'}
                />
              </Grid>
            </Grid>

            {bobAuthDialog.session?.lastAuthError ? <Alert severity="warning">{bobAuthDialog.session.lastAuthError}</Alert> : null}

            <Box
              sx={(theme) => ({
                p: 2,
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                bgcolor: theme.palette.background.default,
                '& svg': { maxWidth: '100%', height: 'auto', display: 'block', mx: 'auto' }
              })}
            >
              {bobAuthDialog.captchaSvg ? (
                <Box dangerouslySetInnerHTML={{ __html: bobAuthDialog.captchaSvg }} />
              ) : (
                <Typography variant="body2" color="text.secondary">
                  {t('licenses.bob.messages.captchaUnavailable', 'Captcha preview unavailable. Refresh the challenge.')}
                </Typography>
              )}
            </Box>

            <TextField
              label={t('licenses.bob.captchaAnswer', 'Captcha')}
              value={bobAuthDialog.captchaAnswer}
              onChange={(event) => setBobAuthDialog((prev) => ({ ...prev, captchaAnswer: event.target.value }))}
              fullWidth
              autoFocus
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'flex-start', sm: 'center' }}>
              <Chip
                size="small"
                variant="outlined"
                color={bobSessionColor(bobAuthDialog.session?.sessionStatus)}
                label={bobSessionLabel(bobAuthDialog.session?.sessionStatus, t)}
              />
              <Typography variant="caption" color="text.secondary">
                {`${t('licenses.bob.lastRefreshed', 'Last refreshed')}: ${formatDateTime(bobAuthDialog.session?.sessionRefreshedAt)}`}
              </Typography>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <ResponsiveActionBar>
            <Button onClick={closeBobAuth}>{t('actions.cancel', 'Cancel')}</Button>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => bobAuthDialog.row && openBobAuth(bobAuthDialog.row)}
              disabled={bobAuthDialog.loading}
            >
              {t('licenses.actions.refreshCaptcha', 'Refresh captcha')}
            </Button>
            <Button
              variant="outlined"
              color="warning"
              onClick={handleClearBobSession}
              disabled={bobAuthDialog.loading}
            >
              {t('licenses.actions.clearBobSession', 'Clear session')}
            </Button>
            <Button
              variant="contained"
              startIcon={<VpnKeyOutlinedIcon fontSize="small" />}
              onClick={handleCompleteBobCaptcha}
              disabled={bobAuthDialog.loading}
            >
              {t('licenses.actions.completeBobLogin', 'Complete login')}
            </Button>
          </ResponsiveActionBar>
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
          {isBobServerChange ? t('licenses.server.bobTitle', 'Create or update Bob playlist') : t('licenses.server.title', 'Change server')}
        </DialogTitleWithClose>
        <DialogContent dividers>
          <Stack spacing={2}>
            <Typography variant="body2" color="text.secondary">
              {isBobServerChange
                ? t(
                    'licenses.server.bobHelper',
                    'This action uses the authenticated Bob session on this license to create or update the remote playlist with the line and server you select below.'
                  )
                : t('licenses.server.helper', 'Select target server')}
            </Typography>
            <Typography variant="body2">
              {t('licenses.server.mac', 'Mac')}: <strong>{openServerChange.row?.macAddress}</strong>
            </Typography>
            <Typography variant="body2">
              {t('licenses.server.customer', 'Customer')}: <strong>{customerNameMap[openServerChange.row?.customerId] || '-'}</strong>
            </Typography>
            <Typography variant="body2">
              {t('licenses.server.country', 'Country (phone)')}: <strong>{serverForm.country}</strong>
            </Typography>
            {isBobServerChange ? (
              <Alert severity={openServerChange.row?.bobSessionStatus === 'READY' ? 'info' : 'warning'}>
                {`${t('licenses.bob.session.title', 'Bob session')}: ${bobSessionLabel(openServerChange.row?.bobSessionStatus, t)}. ${
                  openServerChange.row?.remotePlaylistId
                    ? `${t('licenses.bob.remotePlaylist', 'Remote playlist')}: ${openServerChange.row.remotePlaylistId}`
                    : t('licenses.server.bobNoRemotePlaylist', 'No remote playlist is linked yet. Saving will create one.')
                }`}
              </Alert>
            ) : null}

            <Box
              sx={(theme) => ({
                p: 1.75,
                borderRadius: 2.5,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: theme.palette.mode === 'dark' ? 'background.default' : 'grey.50'
              })}
            >
              <Stack spacing={0.75}>
                <Typography variant="subtitle2">{t('licenses.server.summaryTitle', 'Selected line context')}</Typography>
                <Typography variant="body2">
                  {t('licenses.server.subscription', 'Subscription')}: <strong>{selectedServerSubscription ? formatSubscriptionLabel(selectedServerSubscription) : '-'}</strong>
                </Typography>
                <Typography variant="body2">
                  {t('licenses.server.lineSource', 'Line source')}: <strong>{selectedServerContext.source === 'PLUS' ? t('licenses.server.lineSourcePlus', 'Line plus') : t('licenses.server.lineSourceMain', 'Main line')}</strong>
                </Typography>
                <Typography variant="body2">
                  {t('licenses.server.effectiveLine', 'Effective line')}: <strong>{selectedServerContext.effectiveLineId || '-'}</strong>
                </Typography>
                <Typography variant="body2">
                  {t('licenses.server.provider', 'Provider')}: <strong>{selectedServerContext.provider || t('licenses.server.noProvider', 'Not available')}</strong>
                </Typography>
              </Stack>
            </Box>

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
              <FormHelperText>
                {isBobServerChange
                  ? t('licenses.server.bobServerHelper', 'This server choice defines the M3U URL that Bob Player will save on the device.')
                  : t('licenses.server.helper', 'Select target server')}
              </FormHelperText>
            </FormControl>

            {selectedServerSubscription ? (
              <FormControl fullWidth sx={fieldSx}>
                <InputLabel>{t('licenses.server.lineSource', 'Line source')}</InputLabel>
                <Select
                  value={serverForm.lineSource}
                  label={t('licenses.server.lineSource', 'Line source')}
                  onChange={(e) => handleLineSourceSelect(e.target.value)}
                >
                  <MenuItem value="MAIN">{t('licenses.server.lineSourceMain', 'Main line')}</MenuItem>
                  {selectedServerSubscription.linePlusId ? (
                    <MenuItem value="PLUS">{t('licenses.server.lineSourcePlus', 'Line plus')}</MenuItem>
                  ) : null}
                </Select>
                <FormHelperText>
                  {selectedServerSubscription.linePlusId
                    ? t('licenses.server.lineSourceHelper', 'Choose whether the change applies to the main line or the line plus.')
                    : t('licenses.server.lineSourceMainOnly', 'This subscription only has main line available.')}
                </FormHelperText>
              </FormControl>
            ) : null}

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
            {serverForm.lineSource === 'PLUS' && !selectedServerContext.valid ? (
              <FormHelperText error>
                {t(
                  'licenses.server.plusLineMissing',
                  'Line plus could not be resolved from current metadata. Review the selected subscription before submitting.'
                )}
              </FormHelperText>
            ) : null}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button color="warning" variant="outlined" onClick={handleRemovePlaylistsDirect} disabled={sending}>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <PlaylistRemoveIcon fontSize="small" />
              <span>
                {sending
                  ? t('actions.sending', 'Sending...')
                  : isBobServerChange
                    ? t('licenses.server.removeBobSubmit', 'Remove all Bob playlists')
                    : t('licenses.server.removeSubmit', 'Remove playlists')}
              </span>
            </Stack>
          </Button>
          <Button onClick={() => setOpenServerChange({ open: false, row: null })}>
            {t('actions.cancel', 'Cancel')}
          </Button>
          <Button variant="contained" onClick={handleServerSubmit} disabled={sending}>
            {sending
              ? t('actions.sending', 'Sending...')
              : isBobServerChange
                ? t('licenses.server.bobSubmit', 'Save Bob playlist')
                : t('licenses.server.submit', 'Change server')}
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
          {isBobRemoveDialog ? t('licenses.server.removeBobTitle', 'Remove all Bob playlists') : t('licenses.server.removeTitle', 'Remove all playlists')}
        </DialogTitleWithClose>
        <DialogContent dividers>
          <Stack spacing={1.5}>
            <Typography variant="body2">
              {isBobRemoveDialog
                ? t(
                    'licenses.server.removeBobBody',
                    'This will remove every playlist currently saved on this authenticated Bob Player device, not only the playlist linked to this license.'
                  )
                : t('licenses.server.removeBody', 'This will remove every playlist from this device.')}
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
            {sending
              ? t('actions.sending', 'Sending...')
              : isBobRemoveDialog
                ? t('licenses.server.removeBobSubmit', 'Remove all Bob playlists')
                : t('licenses.server.removeSubmit', 'Remove playlists')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={bobSyncDialog.open} onClose={closeBobSync} fullWidth maxWidth="sm" fullScreen={isMobile}>
        <DialogTitleWithClose onClose={closeBobSync}>
          {t('licenses.bob.sync.title', 'Sync Bob playlist')}
        </DialogTitleWithClose>
        <DialogContent dividers>
          <Stack spacing={2}>
            <Typography variant="body2" color="text.secondary">
              {t(
                'licenses.bob.sync.helper',
                'Select one playlist already stored on this Bob device to link it with the current license. The system will keep that remote playlist id for future updates and automatic removal.'
              )}
            </Typography>
            <Grid container spacing={1.5}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth disabled label={t('licenses.form.mac', 'Mac Address')} value={bobSyncDialog.row?.macAddress || '-'} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  disabled
                  label={t('licenses.bob.session.title', 'Bob session')}
                  value={bobSessionLabel(bobSyncDialog.row?.bobSessionStatus, t)}
                />
              </Grid>
            </Grid>

            <FormControl fullWidth sx={fieldSx} disabled={bobSyncDialog.loading || bobSyncDialog.playlists.length === 0}>
              <InputLabel>{t('licenses.bob.sync.selectLabel', 'Remote playlist')}</InputLabel>
              <Select
                value={bobSyncDialog.selectedPlaylistId}
                label={t('licenses.bob.sync.selectLabel', 'Remote playlist')}
                onChange={(event) => setBobSyncDialog((prev) => ({ ...prev, selectedPlaylistId: event.target.value }))}
              >
                {bobSyncDialog.playlists.map((playlist) => (
                  <MenuItem key={playlist.playlistId} value={playlist.playlistId}>
                    {playlist.playlistName || playlist.playlistId}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                {bobSyncDialog.loading
                  ? t('licenses.bob.sync.loading', 'Loading playlists from Bob Player...')
                  : bobSyncDialog.playlists.length === 0
                    ? t('licenses.bob.sync.empty', 'No playlists were found on this Bob device.')
                    : t('licenses.bob.sync.selectHelper', 'Pick the exact remote playlist that belongs to this license.')}
              </FormHelperText>
            </FormControl>

            {selectedBobPlaylist ? (
              <Box
                sx={(theme) => ({
                  p: 2,
                  borderRadius: 2.5,
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: theme.palette.mode === 'dark' ? 'background.default' : 'grey.50'
                })}
              >
                <Stack spacing={0.75}>
                  <Typography variant="subtitle2">{selectedBobPlaylist.playlistName || selectedBobPlaylist.playlistId}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedBobPlaylist.url || '-'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {`${t('licenses.bob.sync.remoteId', 'Remote id')}: ${selectedBobPlaylist.playlistId}`}
                  </Typography>
                </Stack>
              </Box>
            ) : null}
          </Stack>
        </DialogContent>
        <DialogActions>
          <ResponsiveActionBar>
            <Button onClick={closeBobSync} disabled={bobSyncDialog.loading}>
              {t('actions.cancel', 'Cancel')}
            </Button>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => bobSyncDialog.row && openBobSync(bobSyncDialog.row)}
              disabled={bobSyncDialog.loading}
            >
              {t('actions.refresh', 'Refresh')}
            </Button>
            <Button
              variant="contained"
              startIcon={<LinkIcon fontSize="small" />}
              onClick={handleConfirmBobSync}
              disabled={bobSyncDialog.loading || !bobSyncDialog.selectedPlaylistId}
            >
              {bobSyncDialog.loading ? t('actions.sending', 'Sending...') : t('licenses.actions.syncBobPlaylist', 'Sync Bob playlist')}
            </Button>
          </ResponsiveActionBar>
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
        onClose={() => setOpenTransfer({ open: false, row: null, toCustomerId: '', destinationSubscriptionId: '', typeLicense: 'USED' })}
        fullWidth
        maxWidth="sm"
        fullScreen={isMobile}
      >
        <DialogTitleWithClose
          onClose={() => setOpenTransfer({ open: false, row: null, toCustomerId: '', destinationSubscriptionId: '', typeLicense: 'USED' })}
        >
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
                onChange={(e) => setOpenTransfer((p) => ({ ...p, toCustomerId: e.target.value, destinationSubscriptionId: '' }))}
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

            {isManagedLicenseRecord(openTransfer.row) ? (
              <FormControl fullWidth sx={fieldSx} disabled={!openTransfer.toCustomerId}>
                <InputLabel>{t('licenses.transfer.subscription', 'Destination subscription')}</InputLabel>
                <Select
                  value={openTransfer.destinationSubscriptionId}
                  label={t('licenses.transfer.subscription', 'Destination subscription')}
                  onChange={(e) => setOpenTransfer((p) => ({ ...p, destinationSubscriptionId: e.target.value }))}
                >
                  <MenuItem value="">
                    <em>{t('licenses.form.select', 'Select')}</em>
                  </MenuItem>
                  {transferCustomerSubscriptions.map((subscription) => (
                    <MenuItem key={subscription.id} value={subscription.id}>
                      {formatSubscriptionLabel(subscription)}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  {!openTransfer.toCustomerId
                    ? t('licenses.transfer.subscriptionSelectCustomer', 'Select the new customer first.')
                    : transferCustomerSubscriptions.length
                      ? t('licenses.transfer.subscriptionHelper', 'Choose the subscription that will own this managed license.')
                      : t('licenses.transfer.subscriptionEmpty', 'This customer has no subscriptions available.')}
                </FormHelperText>
              </FormControl>
            ) : null}

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
          <Button
            onClick={() => setOpenTransfer({ open: false, row: null, toCustomerId: '', destinationSubscriptionId: '', typeLicense: 'USED' })}
            disabled={sending}
          >
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
