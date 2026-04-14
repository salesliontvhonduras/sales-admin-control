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
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import FormHelperText from '@mui/material/FormHelperText';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import { useTheme, useMediaQuery } from '@mui/material';
import Menu from '@mui/material/Menu';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PriceChangeIcon from '@mui/icons-material/PriceChange';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import WifiTetheringIcon from '@mui/icons-material/WifiTethering';
import BoltIcon from '@mui/icons-material/Bolt';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import Skeleton from '@mui/material/Skeleton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LinkIcon from '@mui/icons-material/Link';
import EmailIcon from '@mui/icons-material/Email';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';

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
import { lionTvApi } from 'utils/api';
import { withAlpha } from 'utils/colorUtils';

const statusColors = {
  ACTIVE: 'success',
  INACTIVE: 'default',
  EXPIRED: 'error',
  CANCELLED: 'error'
};

const fieldSx = {
  '& .MuiInputBase-root': { borderRadius: 2, minHeight: 48 },
  '& .MuiInputLabel-root': { fontWeight: 500 }
};

const sectionSx = {
  p: 2,
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
  bgcolor: 'background.paper'
};

const glassCard = (theme) => ({
  p: 2,
  borderRadius: 2.5,
  border: '1px solid',
  borderColor: withAlpha(theme.vars.palette.divider, 0.95),
  boxShadow:
    theme.palette.mode === 'dark'
      ? `0 16px 36px ${withAlpha('#020817', 0.52)}`
      : `0 14px 34px ${withAlpha('#0f172a', 0.12)}`,
  backgroundColor: theme.vars.palette.surface.card,
  backgroundImage:
    theme.palette.mode === 'dark'
      ? `linear-gradient(150deg, ${withAlpha(theme.vars.palette.primary.main, 0.22)} 0%, ${withAlpha(theme.vars.palette.secondary.main, 0.14)} 52%, ${theme.vars.palette.surface.card} 100%)`
      : `linear-gradient(150deg, ${withAlpha(theme.vars.palette.primary.main, 0.14)} 0%, ${withAlpha(theme.vars.palette.secondary.main, 0.1)} 52%, ${theme.vars.palette.surface.card} 100%)`
});

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
}

function StatusChip({ status }) {
  const color = statusColors[status] || 'default';
  return <Chip size="small" color={color} label={status || '-'} />;
}

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

function normalizeSubscription(item = {}) {
  return {
    subscriptionId: item.subscriptionId ?? item.id ?? null,
    customerId: item.customerId ?? null,
    lineId: item.lineId ?? '',
    linePlusId: item.linePlusId ?? item.line_plus_id ?? '',
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
    customer_name: item.customer_name ?? '',
    username_line: item.username_line ?? '',
    provider: item.provider ?? item.lineProvider ?? item.line_provider ?? '',
    sharingRole: String(item.sharingRole || 'NONE').toUpperCase(),
    isSharedCluster: Boolean(item.isSharedCluster),
    sharedHostSubscriptionId: item.sharedHostSubscriptionId ?? null,
    sharedClusterSize: Number(item.sharedClusterSize || 0)
  };
}

function RowActions({ row, onEdit, onDelete, onNotifyExpiration, onNotifyReengage, onNotifyRenewed, onCopyWhatsapp, onCopyM3u, onCopyLinePlusM3u, busy }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { t } = useTranslation();
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
          <EditOutlinedIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
          {t('actions.edit', 'Edit')}
        </MenuItem>
        <MenuItem
          disabled={busy}
          onClick={() => {
            setAnchorEl(null);
            onNotifyExpiration?.(row);
          }}
        >
          <EmailIcon fontSize="small" sx={{ mr: 1, color: 'warning.main' }} />
          {t('subscriptions.actions.notifyExpiration', 'Enviar aviso vencimiento')}
        </MenuItem>
        <MenuItem
          disabled={busy}
          onClick={() => {
            setAnchorEl(null);
            onNotifyReengage?.(row);
          }}
        >
          <EmailIcon fontSize="small" sx={{ mr: 1, color: 'secondary.main' }} />
          {t('subscriptions.actions.notifyReengage', 'Notificar reenganche')}
        </MenuItem>
        <MenuItem
          disabled={busy}
          onClick={() => {
            setAnchorEl(null);
            onNotifyRenewed?.(row);
          }}
        >
          <EmailIcon fontSize="small" sx={{ mr: 1, color: 'success.main' }} />
          {t('subscriptions.actions.notifyRenewed', 'Notificar renovación exitosa')}
        </MenuItem>
        <MenuItem
          disabled={busy}
          onClick={() => {
            setAnchorEl(null);
            onCopyWhatsapp?.(row);
          }}
        >
          <ContentCopyRoundedIcon fontSize="small" sx={{ mr: 1, color: 'info.main' }} />
          {t('subscriptions.actions.copyWhatsapp', 'Copiar WhatsApp')}
        </MenuItem>
        <MenuItem
          disabled={busy}
          onClick={() => {
            setAnchorEl(null);
            onCopyM3u?.(row);
          }}
        >
          <LinkIcon fontSize="small" sx={{ mr: 1, color: 'info.dark' }} />
          {t('subscriptions.actions.copyM3u', 'Copiar M3U')}
        </MenuItem>
        <MenuItem
          disabled={busy || !row?.linePlusId}
          onClick={() => {
            setAnchorEl(null);
            onCopyLinePlusM3u?.(row);
          }}
        >
          <LinkIcon fontSize="small" sx={{ mr: 1, color: 'secondary.dark' }} />
          {t('subscriptions.actions.copyM3uPlus', 'Copiar M3U Plus')}
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            onDelete?.(row);
          }}
        >
          <DeleteOutlineIcon fontSize="small" sx={{ mr: 1, color: 'error.main' }} />
          {t('actions.delete', 'Delete')}
        </MenuItem>
      </Menu>
    </>
  );
}

function formatDateInput(value) {
  if (!value) return '';

  // 1) Intento nativo
  const native = new Date(value);
  if (!Number.isNaN(native.getTime())) return native.toISOString().slice(0, 10);

  // 2) Formatos dd-MM-yyyy o dd/MM/yyyy, con o sin hora
  if (typeof value === 'string') {
    const trimmed = value.trim();
    const match = trimmed.match(/^(\d{2})[-/](\d{2})[-/](\d{4})/);
    if (match) {
      const [, dd, MM, yyyy] = match;
      return `${yyyy}-${MM}-${dd}`; // yyyy-MM-dd
    }
    // fallback: primeros 10 caracteres si parecen fecha
    if (trimmed.length >= 10) return trimmed.slice(0, 10);
  }

  return '';
}

function normalizeDateOnly(value) {
  const iso = formatDateInput(value);
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  d.setHours(0, 0, 0, 0);
  return d;
}

function parseLineEnabled(line = {}) {
  if (typeof line.enabled === 'boolean') return line.enabled;
  if (line.enabled === 1 || line.enabled === '1') return true;
  if (line.enabled === 0 || line.enabled === '0') return false;

  const label = String(line.enabled_label ?? line.status ?? '').trim().toUpperCase();
  if (label.includes('ACTIVE') || label.includes('ACTIVA')) return true;
  if (label.includes('INACTIVE') || label.includes('INACTIVA') || label.includes('DISABLED')) return false;
  return false;
}

function hasActiveExpiredLine(row, lineMetaById, todayMs) {
  const key = String(row.lineId ?? '');
  const meta = lineMetaById[key];
  if (!meta || !meta.enabled || !meta.expDate) return false;
  return meta.expDate.getTime() < todayMs;
}

function getSubscriptionRowKey(row = {}) {
  const subscriptionId = row.subscriptionId ?? row.id ?? null;
  if (subscriptionId !== null && subscriptionId !== undefined && subscriptionId !== '') return String(subscriptionId);
  const lineId = row.lineId ?? row.username_line ?? '';
  const customerId = row.customerId ?? '';
  return `${customerId}-${lineId}`;
}

const defaultForm = {
  subscriptionId: null,
  customerId: '',
  lineId: '',
  linePlusId: '',
  billing: '',
  amount: '',
  discount: '',
  status: 'ACTIVE',
  startDate: '',
  renewalDate: '',
  packageId: '',
  automaticPay: false,
  linkAutomatic: ''
};

export default function SubscriptionsLionTv() {
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
  const [refreshKey, setRefreshKey] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [customerFilter, setCustomerFilter] = useState('');
  const [renewalFilter, setRenewalFilter] = useState(''); // '', 'yesterday', 'today', 'tomorrow'
  const [renewalSort, setRenewalSort] = useState('asc'); // asc | desc
  const [lineHealthFilter, setLineHealthFilter] = useState(''); // '' | 'activeExpired'

  const [openModal, setOpenModal] = useState(false);
  const [openDelete, setOpenDelete] = useState({ open: false, row: null });
  const [form, setForm] = useState(defaultForm);
  const [sending, setSending] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [customersLoading, setCustomersLoading] = useState(false);
  const [packages, setPackages] = useState([]);
  const [packagesLoading, setPackagesLoading] = useState(false);
  const [lines, setLines] = useState([]);
  const [linesLoading, setLinesLoading] = useState(false);
  const [notifLoadingId, setNotifLoadingId] = useState(null);

  const customerNameMap = useMemo(() => {
    const map = {};
    customers.forEach((c) => {
      const id = c.customerId ?? c.id;
      if (!id) return;
      map[id] = c.customerFullname ?? c.fullName ?? c.username ?? c.customerMail ?? '';
    });
    return map;
  }, [customers]);

  const customerEmailMap = useMemo(() => {
    const map = {};
    customers.forEach((c) => {
      const id = c.customerId ?? c.id;
      if (!id) return;
      map[id] = c.customerMail || c.email || c.mail || '';
    });
    return map;
  }, [customers]);

  const packageMap = useMemo(() => {
    const map = {};
    packages.forEach((p) => {
      const rawId = p.id ?? p.packageId ?? p.package_id ?? p.packageID;
      if (!rawId) return;
      const id = String(rawId);
      map[id] = {
        name: p.name || p.packageName || t('subscriptions.labels.packageFallback', { id }),
        description: p.description || p.packageDescription || ''
      };
    });
    return map;
  }, [packages, t]);

  const lineNameMap = useMemo(() => {
    const map = {};
    lines.forEach((l) => {
      const rawId = l.id ?? l.lineId ?? l.line_id ?? l.username;
      if (!rawId) return;
      const id = String(rawId);
      map[id] = l.username || l.username_line || l.usernameLine || l.name || id;
    });
    return map;
  }, [lines]);

  const plusLines = useMemo(() => {
    return lines.filter((line) => {
      const provider = (line.provider ?? line.line_provider ?? line.lineProvider ?? '').toString().trim().toUpperCase();
      return provider === 'LION_PLUS+';
    });
  }, [lines]);

  const lineMetaById = useMemo(() => {
    const map = {};
    lines.forEach((line) => {
      const rawId = line.id ?? line.lineId ?? line.line_id ?? null;
      if (rawId === null || rawId === undefined || rawId === '') return;
      const key = String(rawId);
      map[key] = {
        enabled: parseLineEnabled(line),
        expDate: normalizeDateOnly(line.exp_date ?? line.expDate ?? line.expirationDate ?? null)
      };
    });
    return map;
  }, [lines]);

  const handleUnauthorized = (err) => {
    const status = err?.response?.status || err?.request?.status;
    return status === 401;
  };

  const loadPackages = useCallback(async () => {
    setPackagesLoading(true);
    try {
      const response = await lionTvApi.get('/packages/v1/list-packages', {
        params: { index: 0, size: 100, start: 0, filters: '', sorting: '' }
      });
      const list = response?.data?.data?.data || [];
      // Omitir los que empiezan con "DEMO"
      const filtered = (Array.isArray(list) ? list : []).filter(
        (pkg) => !String(pkg?.name || '').trim().toUpperCase().startsWith('DEMO')
      );
      setPackages(filtered);
    } catch (err) {
      enqueueSnackbar(t('subscriptions.messages.packagesLoadError'), { variant: 'warning' });
    } finally {
      setPackagesLoading(false);
    }
  }, [enqueueSnackbar, t]);

  const loadLines = useCallback(async () => {
    if (!accessToken) return;
    setLinesLoading(true);
    try {
      const res = await lionTvApi.get('/lines/v1/list-lines', {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { index: 0, size: 1000 },
        skipAuthRedirect: true
      });
      const payload = res?.data?.data ?? res?.data ?? {};
      const raw = payload.data ?? payload.items ?? payload.content ?? payload ?? [];
      const list = Array.isArray(raw) ? raw : [];
      const sorted = list.sort((a, b) => {
        const aName = (a.username || a.user_name || '').toString().toLowerCase();
        const bName = (b.username || b.user_name || '').toString().toLowerCase();
        return aName.localeCompare(bName);
      });
      setLines(sorted);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(t('subscriptions.messages.linesLoadError'), { variant: 'warning' });
      }
    } finally {
      setLinesLoading(false);
    }
  }, [accessToken, enqueueSnackbar, t]);

  const loadCustomers = useCallback(async () => {
    if (!accessToken) return;
    setCustomersLoading(true);
    try {
      const res = await lionTvApi.get('/customers/v1', {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { index: 0, size: 5000 },
        skipAuthRedirect: true
      });
      const payload = res?.data?.data ?? res?.data ?? {};
      const raw = payload.data ?? payload.items ?? payload.content ?? payload ?? [];
      const list = Array.isArray(raw) ? raw : [];
      setCustomers(list);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(t('subscriptions.messages.customersLoadError'), { variant: 'warning' });
      }
    } finally {
      setCustomersLoading(false);
    }
  }, [accessToken, enqueueSnackbar, t]);

  const loadSubscriptions = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const res = await lionTvApi.get('/subscriptions/v1', {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { index: 0, size: 5000, ...(customerFilter ? { customerId: customerFilter } : {}) },
        skipAuthRedirect: true
      });
      const payload = res?.data?.data ?? res?.data ?? {};
      const raw = payload.data ?? payload.items ?? payload.content ?? payload ?? [];
      const items = Array.isArray(raw) ? raw : [];
      const normalized = items.map(normalizeSubscription);
      setRows(normalized);
      setTotal(payload?.total ?? normalized.length);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || err.message || t('subscriptions.messages.loadError'), {
          variant: 'error'
        });
      }
    } finally {
      setLoading(false);
    }
  }, [accessToken, customerFilter, enqueueSnackbar]);

  useEffect(() => {
    loadSubscriptions();
    loadCustomers();
    loadPackages();
    loadLines();
  }, [loadSubscriptions, loadCustomers, loadPackages, loadLines, refreshKey]);

  const fetchCustomerContact = useCallback(
    async (customerId) => {
      if (!customerId) return { email: '', name: '' };
      const cachedEmail = customerEmailMap[customerId] || '';
      const cachedName = customerNameMap[customerId] || '';
      if (cachedEmail || cachedName) return { email: cachedEmail, name: cachedName };

      if (!accessToken) return { email: '', name: '' };
      try {
        const res = await lionTvApi.get(`/customers/v1/${customerId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          skipAuthRedirect: true
        });
        const data = res?.data?.data ?? res?.data ?? {};
        return {
          email: data.customerMail || data.email || data.mail || '',
          name: data.customerFullname || data.fullName || data.username || ''
        };
      } catch (err) {
        if (!handleUnauthorized(err)) {
          enqueueSnackbar(t('subscriptions.messages.customerEmailError'), { variant: 'warning' });
        }
        return { email: '', name: '' };
      }
    },
    [accessToken, customerEmailMap, customerNameMap, enqueueSnackbar, t]
  );

  // enriquecer filas con nombres de línea y paquete cuando lleguen los catálogos
  useEffect(() => {
    if ((!lineNameMap || Object.keys(lineNameMap).length === 0) && (!packageMap || Object.keys(packageMap).length === 0)) return;
    setRows((prev) =>
      prev.map((row) => {
        const lineLabel =
          lineNameMap[String(row.lineId ?? row.username_line ?? '')] ||
          row.username_line ||
          row.lineId ||
          '';
        const pkgInfo = packageMap[String(row.packageId ?? '')] || {};
        return {
          ...row,
          username_line: lineLabel,
          packageName: pkgInfo.name || row.packageId,
          packageDescription: pkgInfo.description || ''
        };
      })
    );
  }, [lineNameMap, packageMap]);

  useEffect(() => {
    if (!customerNameMap || Object.keys(customerNameMap).length === 0) return;
    setRows((prev) =>
      prev.map((row) => ({
        ...row,
        customerName: row.customerName || customerNameMap[row.customerId] || row.customer_name || ''
      }))
    );
  }, [customerNameMap]);

  const filteredRows = useMemo(() => {
    const term = search.toLowerCase();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayMs = today.getTime();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const filtered = rows.filter((row) => {
      if (statusFilter && (row.status || '').toLowerCase() !== statusFilter.toLowerCase()) return false;
      if (customerFilter && String(row.customerId || '') !== String(customerFilter)) return false;
      if (lineHealthFilter === 'activeExpired' && !hasActiveExpiredLine(row, lineMetaById, todayMs)) return false;
      const matchesSearch =
        !term ||
        String(row.customerId || '').toLowerCase().includes(term) ||
        (row.customerName || row.customer_name || '').toLowerCase().includes(term) ||
        (row.lineId || '').toLowerCase().includes(term) ||
        (row.billing || '').toLowerCase().includes(term) ||
        (row.status || '').toLowerCase().includes(term) ||
        String(row.packageId || '').toLowerCase().includes(term);
      if (!matchesSearch) return false;

      if (!renewalFilter) return true;
      const d = normalizeDateOnly(row.renewalDate);
      if (!d) return false;
      if (renewalFilter === 'yesterday') return d.getTime() === yesterday.getTime();
      if (renewalFilter === 'today') return d.getTime() === today.getTime();
      if (renewalFilter === 'tomorrow') return d.getTime() === tomorrow.getTime();
      return true;
    });

    const sorted = [...filtered].sort((a, b) => {
      const da = normalizeDateOnly(a.renewalDate);
      const db = normalizeDateOnly(b.renewalDate);
      const ta = da ? da.getTime() : Number.POSITIVE_INFINITY;
      const tb = db ? db.getTime() : Number.POSITIVE_INFINITY;
      return renewalSort === 'asc' ? ta - tb : tb - ta;
    });

    return sorted;
  }, [rows, search, statusFilter, customerFilter, renewalFilter, renewalSort, lineHealthFilter, lineMetaById]);

  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredRows.slice(start, start + rowsPerPage);
  }, [filteredRows, page, rowsPerPage]);

  useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(filteredRows.length / rowsPerPage) - 1);
    if (page > maxPage) {
      setPage(0);
    }
  }, [filteredRows.length, page, rowsPerPage]);

  const activeLineExpiredCount = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayMs = today.getTime();
    return rows.reduce((acc, row) => (hasActiveExpiredLine(row, lineMetaById, todayMs) ? acc + 1 : acc), 0);
  }, [rows, lineMetaById]);

  const activeExpiredRowKeys = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayMs = today.getTime();
    const set = new Set();
    rows.forEach((row) => {
      if (hasActiveExpiredLine(row, lineMetaById, todayMs)) {
        set.add(getSubscriptionRowKey(row));
      }
    });
    return set;
  }, [rows, lineMetaById]);

  const resetForm = () => setForm(defaultForm);

  const handleFormChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleLineChange = (event) => {
    const value = event.target.value;
    const found = lines.find((l) => (l.id ?? l.lineId) === value);
    setForm((prev) => ({
      ...prev,
      lineId: value,
      startDate: found ? formatDateInput(found.created_at || found.createdAt) || prev.startDate : prev.startDate,
      renewalDate: found ? formatDateInput(found.exp_date || found.expDate) || prev.renewalDate : prev.renewalDate,
      packageId: found?.package_id ?? found?.packageId ?? prev.packageId
    }));
  };

  const handleEdit = (row) => {
    setForm({
      subscriptionId: row.subscriptionId,
      customerId: row.customerId ?? '',
      lineId: row.lineId ?? '',
      linePlusId: row.linePlusId ?? '',
      billing: row.billing ?? '',
      amount: row.amount ?? '',
      discount: row.discount ?? '',
      status: row.status || 'ACTIVE',
      startDate: row.startDate || '',
      renewalDate: row.renewalDate || '',
      packageId: row.packageId ?? '',
      automaticPay: Boolean(row.automaticPay),
      linkAutomatic: row.linkAutomatic ?? ''
    });
    setOpenModal(true);
  };

  const handleDelete = (row) => {
    setOpenDelete({ open: true, row });
  };

  const handleNotifyExpiration = async (row) => {
    if (!row?.subscriptionId) return;
    setNotifLoadingId(row.subscriptionId);
    try {
      const { email, name } = await fetchCustomerContact(row.customerId);
      const emailNormalized = (email || '').trim().toLowerCase();
      if (!emailNormalized || emailNormalized === 'nomail@gmail.com') {
        enqueueSnackbar(t('subscriptions.messages.invalidCustomerEmail'), { variant: 'error' });
        return;
      }
      const expirationDate = row.renewalDate || row.startDate || null;
      await lionTvApi.post(
        '/notifications/line-expiration',
        { email, expirationDate },
        { headers: { Authorization: `Bearer ${accessToken}` }, skipAuthRedirect: true }
      );
      enqueueSnackbar(t('subscriptions.messages.expirationSent'), { variant: 'success' });
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || t('subscriptions.messages.notificationError'), { variant: 'error' });
      }
    } finally {
      setNotifLoadingId(null);
    }
  };

  const handleNotifyReengage = async (row) => {
    if (!row?.subscriptionId) return;
    setNotifLoadingId(row.subscriptionId);
    try {
      const { email, name } = await fetchCustomerContact(row.customerId);
      const emailNormalized = (email || '').trim().toLowerCase();
      if (!emailNormalized || emailNormalized === 'nomail@gmail.com') {
        enqueueSnackbar(t('subscriptions.messages.invalidCustomerEmail'), { variant: 'error' });
        return;
      }
      await lionTvApi.post(
        '/notifications/reengage',
        { email, customerName: name || row.customerName || row.customer_name || '' },
        { headers: { Authorization: `Bearer ${accessToken}` }, skipAuthRedirect: true }
      );
      enqueueSnackbar(t('subscriptions.messages.reengageSent'), { variant: 'success' });
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || t('subscriptions.messages.notificationError'), { variant: 'error' });
      }
    } finally {
      setNotifLoadingId(null);
    }
  };

  const handleCopyWhatsapp = async (row) => {
    if (!row?.subscriptionId) return;
    setNotifLoadingId(row.subscriptionId);
    try {
      const res = await lionTvApi.get(`/subscriptions/v1/${row.subscriptionId}/whatsapp-copy`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        skipAuthRedirect: true
      });
      const data = res?.data?.data ?? res?.data ?? {};
      const textToCopy = data.copyText || [data.title, data.whatsappText].filter(Boolean).join('\n\n');
      await navigator.clipboard.writeText(textToCopy || '');
      enqueueSnackbar(t('subscriptions.messages.copySuccess', 'Resumen de suscripción copiado.'), { variant: 'success' });
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || t('subscriptions.messages.copyError', 'No se pudo generar el resumen de la suscripción.'), { variant: 'error' });
      }
    } finally {
      setNotifLoadingId(null);
    }
  };

  const handleCopyM3u = async (row) => {
    if (!row?.subscriptionId) return;
    setNotifLoadingId(row.subscriptionId);
    try {
      const res = await lionTvApi.get(`/subscriptions/v1/${row.subscriptionId}/m3u-copy`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        skipAuthRedirect: true
      });
      const data = res?.data?.data ?? res?.data ?? {};
      const textToCopy = data.copyText || data.m3uUrl || '';
      await navigator.clipboard.writeText(textToCopy || '');
      enqueueSnackbar(t('subscriptions.messages.m3uCopySuccess', 'Lista M3U copiada.'), { variant: 'success' });
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || t('subscriptions.messages.m3uCopyError', 'No se pudo generar la lista M3U.'), { variant: 'error' });
      }
    } finally {
      setNotifLoadingId(null);
    }
  };

  const handleCopyLinePlusM3u = async (row) => {
    if (!row?.subscriptionId || !row?.linePlusId) return;
    setNotifLoadingId(row.subscriptionId);
    try {
      const res = await lionTvApi.get(`/subscriptions/v1/${row.subscriptionId}/line-plus-m3u-copy`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        skipAuthRedirect: true
      });
      const data = res?.data?.data ?? res?.data ?? {};
      const textToCopy = data.copyText || data.m3uUrl || '';
      await navigator.clipboard.writeText(textToCopy || '');
      enqueueSnackbar(t('subscriptions.messages.m3uPlusCopySuccess', 'Lista M3U Plus copiada.'), { variant: 'success' });
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || t('subscriptions.messages.m3uPlusCopyError', 'No se pudo generar la lista M3U Plus.'), { variant: 'error' });
      }
    } finally {
      setNotifLoadingId(null);
    }
  };

  const handleNotifyRenewed = async (row) => {
    if (!row?.subscriptionId) return;
    setNotifLoadingId(row.subscriptionId);
    try {
      const { email } = await fetchCustomerContact(row.customerId);
      const emailNormalized = (email || '').trim().toLowerCase();
      if (!emailNormalized || emailNormalized === 'nomail@gmail.com') {
        enqueueSnackbar(t('subscriptions.messages.invalidCustomerEmail'), { variant: 'error' });
        return;
      }
      await lionTvApi.post(
        `/subscriptions/v1/${row.subscriptionId}/notify-renewed`,
        {},
        { headers: { Authorization: `Bearer ${accessToken}` }, skipAuthRedirect: true }
      );
      enqueueSnackbar(t('subscriptions.messages.renewalSent'), { variant: 'success' });
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || t('subscriptions.messages.notificationError'), { variant: 'error' });
      }
    } finally {
      setNotifLoadingId(null);
    }
  };

  const handleSave = async () => {
    if (!form.customerId || !form.lineId || !form.packageId || !form.status || !form.startDate) {
      enqueueSnackbar(t('subscriptions.messages.required'), { variant: 'warning' });
      return;
    }

    const payload = {
      customerId: Number(form.customerId),
      lineId: form.lineId,
      linePlusId: form.linePlusId || null,
      billing: form.billing,
      amount: form.amount ? Number(form.amount) : 0,
      discount: form.discount ? Number(form.discount) : 0,
      status: form.status,
      startDate: form.startDate || null,
      renewalDate: form.renewalDate || null,
      packageId: form.packageId ? Number(form.packageId) : null,
      automaticPay: Boolean(form.automaticPay),
      linkAutomatic: form.linkAutomatic
    };

    setSending(true);
    try {
      if (form.subscriptionId) {
        await lionTvApi.put(`/subscriptions/v1/${form.subscriptionId}`, payload, {
          headers: { Authorization: `Bearer ${accessToken}` },
          skipAuthRedirect: true
        });
        enqueueSnackbar(t('subscriptions.messages.updated'), { variant: 'success' });
      } else {
        await lionTvApi.post('/subscriptions/v1', payload, {
          headers: { Authorization: `Bearer ${accessToken}` },
          skipAuthRedirect: true
        });
        enqueueSnackbar(t('subscriptions.messages.created'), { variant: 'success' });
      }
      setOpenModal(false);
      resetForm();
      setRefreshKey((v) => v + 1);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || err.message || t('subscriptions.messages.saveError'), {
          variant: 'error'
        });
      }
    } finally {
      setSending(false);
    }
  };

  const confirmDelete = async () => {
    const row = openDelete.row;
    if (!row?.subscriptionId) {
      setOpenDelete({ open: false, row: null });
      return;
    }
    setSending(true);
    try {
      await lionTvApi.delete(`/subscriptions/v1/${row.subscriptionId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        skipAuthRedirect: true
      });
      enqueueSnackbar(t('subscriptions.messages.deleted'), { variant: 'success' });
      setOpenDelete({ open: false, row: null });
      setRefreshKey((v) => v + 1);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || err.message || t('subscriptions.messages.deleteError'), {
          variant: 'error'
        });
      }
    } finally {
      setSending(false);
    }
  };

  const kpiCards = [
    {
      title: t('subscriptions.title'),
      value: total,
      helper: t('subscriptions.search'),
      color: 'primary',
      icon: <CreditCardIcon fontSize="small" />
    },
    {
      title: t('subscriptions.headers.status', 'Status'),
      value: rows.filter((r) => r.status === 'ACTIVE').length,
      helper: t('subscriptions.kpi.activeStatus', { count: rows.filter((r) => r.status === 'ACTIVE').length }),
      color: 'success',
      icon: <AutoAwesomeIcon fontSize="small" />
    },
    {
      title: t('subscriptions.headers.autopay'),
      value: rows.filter((r) => r.automaticPay).length,
      helper: t('subscriptions.headers.autopay'),
      color: 'warning',
      icon: <PriceChangeIcon fontSize="small" />
    },
    {
      title: t('subscriptions.kpi.sharedLabel', 'Shared'),
      value: rows.filter((r) => r.sharingRole && r.sharingRole !== 'NONE').length,
      helper: t('subscriptions.kpi.sharedStatus', { count: rows.filter((r) => r.sharingRole && r.sharingRole !== 'NONE').length }),
      color: 'info',
      icon: <LinkIcon fontSize="small" />
    },
    {
      title: t('subscriptions.kpi.activeLineExpiredLabel', 'Line risk'),
      value: activeLineExpiredCount,
      helper: t('subscriptions.kpi.activeLineExpired', { count: activeLineExpiredCount }),
      color: 'error',
      icon: <ReportProblemOutlinedIcon fontSize="small" />
    }
  ];

  return (
    <Box sx={{ width: '100%', maxWidth: 1400, mx: 'auto' }}>
      <MainCard
        title={t('subscriptions.title')}
        secondary={
          <ResponsiveActionBar>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => setRefreshKey((v) => v + 1)}
              sx={{
                borderRadius: 3,
                borderWidth: 2,
                textTransform: 'none',
                fontWeight: 700,
                px: 2.5
              }}
            >
              {t('actions.refresh', 'Refresh')}
            </Button>
            <Button
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
              onClick={() => setOpenModal(true)}
              sx={(theme) => ({
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 700,
                px: 2.8,
                boxShadow: `0 12px 24px ${withAlpha(theme.vars.palette.primary.main, theme.palette.mode === 'dark' ? 0.42 : 0.32)}`
              })}
              fullWidth={isMobile}
            >
              {t('subscriptions.actions.new', 'New subscription')}
            </Button>
          </ResponsiveActionBar>
        }
      >
        <ResponsiveMetricGrid columns={{ xs: 1, md: 2, lg: 4 }}>
          {kpiCards.map((item, idx) => (
            <LionMetricCard {...item} key={idx} />
          ))}
        </ResponsiveMetricGrid>
      </MainCard>

      <MainCard title={null}>
        <ResponsiveFilters paperSx={{ mb: 2 }}>
            <TextField
              size="small"
              placeholder={t('subscriptions.search')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
              sx={{ '& .MuiOutlinedInput-root': { minHeight: 46, borderRadius: 2 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                )
              }}
            />
            <FormControl size="small" sx={{ minWidth: { xs: '100%', md: 200 }, '& .MuiOutlinedInput-root': { minHeight: 46, borderRadius: 2 } }}>
              <InputLabel>{t('subscriptions.filters.status')}</InputLabel>
              <Select
                value={statusFilter}
                label={t('subscriptions.filters.status')}
                onChange={(e) => setStatusFilter(e.target.value)}
                startAdornment={
                  <InputAdornment position="start" sx={{ pl: 1 }}>
                    <FilterAltOutlinedIcon fontSize="small" color="action" />
                  </InputAdornment>
                }
              >
                <MenuItem value="">
                  <em>{t('subscriptions.filters.all')}</em>
                </MenuItem>
                {[...new Set(rows.map((r) => r.status).filter(Boolean))].map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: { xs: '100%', md: 240 }, '& .MuiOutlinedInput-root': { minHeight: 46, borderRadius: 2 } }}>
              <InputLabel>{t('subscriptions.filters.customer', 'Customer')}</InputLabel>
              <Select
                value={customerFilter}
                label={t('subscriptions.filters.customer', 'Customer')}
                onChange={(e) => setCustomerFilter(e.target.value)}
                startAdornment={
                  <InputAdornment position="start" sx={{ pl: 1 }}>
                    <PersonOutlineIcon fontSize="small" color="action" />
                  </InputAdornment>
                }
              >
                <MenuItem value="">
                  <em>{t('subscriptions.filters.allCustomers', 'All customers')}</em>
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
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} flexShrink={0}>
              <Button
                variant={renewalFilter === 'yesterday' ? 'contained' : 'outlined'}
                color="info"
                onClick={() => setRenewalFilter((v) => (v === 'yesterday' ? '' : 'yesterday'))}
                startIcon={<CalendarMonthIcon />}
                sx={{ minHeight: 46, borderRadius: 2, textTransform: 'none' }}
              >
                {t('subscriptions.filters.yesterday', 'Venció ayer')}
              </Button>
              <Button
                variant={renewalFilter === 'today' ? 'contained' : 'outlined'}
                color="error"
                onClick={() => setRenewalFilter((v) => (v === 'today' ? '' : 'today'))}
                startIcon={<CalendarMonthIcon />}
                sx={{ minHeight: 46, borderRadius: 2, textTransform: 'none' }}
              >
                {t('subscriptions.filters.today', 'Vence hoy')}
              </Button>
              <Button
                variant={renewalFilter === 'tomorrow' ? 'contained' : 'outlined'}
                color="warning"
                onClick={() => setRenewalFilter((v) => (v === 'tomorrow' ? '' : 'tomorrow'))}
                startIcon={<CalendarMonthIcon />}
                sx={{ minHeight: 46, borderRadius: 2, textTransform: 'none' }}
              >
                {t('subscriptions.filters.tomorrow', 'Vence mañana')}
              </Button>
              <Button
                variant={lineHealthFilter === 'activeExpired' ? 'contained' : 'outlined'}
                color="error"
                onClick={() => setLineHealthFilter((v) => (v === 'activeExpired' ? '' : 'activeExpired'))}
                startIcon={<ReportProblemOutlinedIcon />}
                sx={{ minHeight: 46, borderRadius: 2, textTransform: 'none' }}
              >
                {t('subscriptions.filters.activeLineExpired', 'Línea activa vencida')}
              </Button>
              <FormControl size="small" sx={{ minWidth: { xs: '100%', md: 160 }, '& .MuiOutlinedInput-root': { minHeight: 46, borderRadius: 2 } }}>
                <InputLabel>{t('subscriptions.filters.sortRenewal', 'Orden fecha')}</InputLabel>
                <Select
                  value={renewalSort}
                  label={t('subscriptions.filters.sortRenewal', 'Orden fecha')}
                  onChange={(e) => setRenewalSort(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start" sx={{ pl: 1 }}>
                      <CalendarMonthIcon fontSize="small" color="action" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="asc">{t('subscriptions.filters.asc', 'Más cercanas')}</MenuItem>
                  <MenuItem value="desc">{t('subscriptions.filters.desc', 'Más lejanas')}</MenuItem>
                </Select>
              </FormControl>
            </Stack>
        </ResponsiveFilters>
        <ResponsiveEntityView
          isMobile={isMobile}
          mobileContent={
            loading ? (
              <Stack spacing={1.5}>
                {Array.from({ length: 4 }).map((_, idx) => (
                  <Skeleton key={`sub-mobile-${idx}`} variant="rounded" height={230} />
                ))}
              </Stack>
            ) : paginatedRows.length ? (
              <Stack spacing={1.5}>
                {paginatedRows.map((row) => {
                  const isActiveExpired = activeExpiredRowKeys.has(getSubscriptionRowKey(row));
                  return (
                    <MobileSummaryCard
                      key={row.subscriptionId || row.lineId}
                      title={`${row.customerName || row.customer_name || '-'} · #${row.subscriptionId || '-'}`}
                      subtitle={lineNameMap[String(row.lineId ?? row.username_line ?? '')] || row.username_line || row.lineId || '-'}
                      chips={[
                        <StatusChip key="status" status={row.status} />,
                        <Chip key="provider" size="small" variant="outlined" label={row.provider || t('subscriptions.labels.providerFallback')} />,
                        row.sharingRole === 'HOST' ? (
                          <Chip key="host" size="small" color="warning" label={t('subscriptions.sharing.host', 'HOST')} />
                        ) : row.sharingRole === 'SHARED' ? (
                          <Chip key="shared" size="small" color="info" label={t('subscriptions.sharing.shared', 'SHARED')} />
                        ) : null,
                        isActiveExpired ? (
                          <Chip key="expired" size="small" color="error" label={t('subscriptions.labels.activeLineExpiredChip', 'Línea activa vencida')} />
                        ) : null
                      ].filter(Boolean)}
                      actions={
                        <ResponsiveActionBar>
                          <Button size="small" variant="outlined" onClick={() => handleEdit(row)}>
                            {t('actions.edit', 'Edit')}
                          </Button>
                          <RowActions
                            row={row}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onNotifyExpiration={handleNotifyExpiration}
                            onNotifyReengage={handleNotifyReengage}
                            onNotifyRenewed={handleNotifyRenewed}
                            onCopyWhatsapp={handleCopyWhatsapp}
                            onCopyM3u={handleCopyM3u}
                            onCopyLinePlusM3u={handleCopyLinePlusM3u}
                            busy={notifLoadingId === row.subscriptionId}
                          />
                        </ResponsiveActionBar>
                      }
                    >
                      <MobileFieldGrid
                        fields={[
                          {
                            label: t('subscriptions.headers.line'),
                            value: lineNameMap[String(row.lineId ?? row.username_line ?? '')] || row.username_line || row.lineId || '-'
                          },
                          {
                            label: t('subscriptions.headers.linePlus', 'Line plus'),
                            value: lineNameMap[String(row.linePlusId ?? '')] || row.linePlusId || '-'
                          },
                          {
                            label: t('subscriptions.headers.package'),
                            value: row.packageName || packageMap[String(row.packageId ?? '')]?.name || row.packageId || '-'
                          },
                          {
                            label: t('subscriptions.headers.amount'),
                            value: Number(row.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 }),
                            emphasis: true
                          },
                          { label: t('subscriptions.headers.start'), value: row.startDate || '-' },
                          { label: t('subscriptions.headers.renewal'), value: row.renewalDate || '-' },
                          { label: t('subscriptions.headers.autopay'), value: row.automaticPay ? t('common.yes', 'Yes') : t('common.no', 'No') }
                        ]}
                      />
                    </MobileSummaryCard>
                  );
                })}
              </Stack>
            ) : (
              <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
                <Typography variant="subtitle1">{t('subscriptions.empty', 'No subscriptions found.')}</Typography>
              </Paper>
            )
          }
          desktopContent={
            <TableContainer component={Paper}>
              <Table size="small" sx={{ minWidth: { xs: 1180, md: '100%' } }}>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('subscriptions.headers.id')}</TableCell>
                    <TableCell>{t('subscriptions.headers.customer')}</TableCell>
                    <TableCell>{t('subscriptions.headers.line')}</TableCell>
                    <TableCell>{t('subscriptions.headers.linePlus', 'Line plus')}</TableCell>
                    <TableCell>{t('subscriptions.headers.package')}</TableCell>
                    <TableCell>{t('subscriptions.headers.provider', 'Provider')}</TableCell>
                    <TableCell>{t('subscriptions.headers.status')}</TableCell>
                    <TableCell>{t('subscriptions.headers.amount')}</TableCell>
                    <TableCell>{t('subscriptions.headers.start')}</TableCell>
                    <TableCell>{t('subscriptions.headers.renewal')}</TableCell>
                    <TableCell>{t('subscriptions.headers.autopay')}</TableCell>
                    <TableCell>{t('subscriptions.headers.actions')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading &&
                    Array.from({ length: 4 }).map((_, idx) => (
                      <TableRow key={`sub-skel-${idx}`}>
                        {Array.from({ length: 12 }).map((__, cidx) => (
                          <TableCell key={cidx}>
                            <Skeleton variant="text" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  {!loading &&
                    paginatedRows.map((row) => (
                      <TableRow
                        key={row.subscriptionId || row.lineId}
                        hover
                        sx={(theme) => {
                          const isActiveExpired = activeExpiredRowKeys.has(getSubscriptionRowKey(row));
                          if (!isActiveExpired) return undefined;
                          return {
                            backgroundColor: withAlpha(theme.vars.palette.error.main, theme.palette.mode === 'dark' ? 0.08 : 0.05),
                            '&:hover': {
                              backgroundColor: withAlpha(theme.vars.palette.error.main, theme.palette.mode === 'dark' ? 0.14 : 0.1)
                            }
                          };
                        }}
                      >
                        <TableCell>
                          <Stack direction="row" spacing={0.75} alignItems="center">
                            <CreditCardIcon fontSize="small" sx={{ color: 'primary.main' }} />
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                              {row.subscriptionId}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={0.75} alignItems="center">
                            <PersonOutlineIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                            <Typography variant="body2">{row.customerName || row.customer_name || '-'}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap">
                            <WifiTetheringIcon fontSize="small" sx={{ color: 'success.main' }} />
                            <Typography variant="body2">
                              {lineNameMap[String(row.lineId ?? row.username_line ?? '')] || row.username_line || row.lineId || '-'}
                            </Typography>
                            {activeExpiredRowKeys.has(getSubscriptionRowKey(row)) && (
                              <Chip
                                size="small"
                                color="error"
                                variant="filled"
                                label={t('subscriptions.labels.activeLineExpiredChip', 'Línea activa vencida')}
                                sx={{ fontWeight: 700 }}
                              />
                            )}
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={0.75} alignItems="center">
                            <WifiTetheringIcon fontSize="small" sx={{ color: 'secondary.main' }} />
                            <Typography variant="body2">
                              {lineNameMap[String(row.linePlusId ?? '')] || row.linePlusId || '-'}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Stack spacing={0.25}>
                            <Stack direction="row" spacing={0.5} alignItems="center">
                              <Avatar sx={{ width: 22, height: 22, bgcolor: 'warning.main', color: 'warning.contrastText' }}>
                                <BoltIcon fontSize="inherit" />
                              </Avatar>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {row.packageName || packageMap[String(row.packageId ?? '')]?.name || row.packageId || '-'}
                              </Typography>
                            </Stack>
                            {row.packageDescription || packageMap[String(row.packageId ?? '')]?.description ? (
                              <Typography variant="caption" color="text.secondary" noWrap>
                                {row.packageDescription || packageMap[String(row.packageId ?? '')]?.description}
                              </Typography>
                            ) : null}
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={row.provider || t('subscriptions.labels.providerFallback')}
                            color="info"
                            variant="outlined"
                            sx={{ fontWeight: 700, borderRadius: 1.5 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={0.75} alignItems="center">
                            <StatusChip status={row.status} />
                            {row.sharingRole === 'HOST' && (
                              <Chip
                                size="small"
                                color="warning"
                                variant="filled"
                                label={t('subscriptions.sharing.host', 'HOST')}
                                sx={{ fontWeight: 700 }}
                              />
                            )}
                            {row.sharingRole === 'SHARED' && (
                              <Chip
                                size="small"
                                color="info"
                                variant="filled"
                                label={t('subscriptions.sharing.shared', 'SHARED')}
                                sx={{ fontWeight: 700 }}
                              />
                            )}
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <PriceChangeIcon fontSize="small" sx={{ color: 'success.main' }} />
                            <Typography variant="body2">
                              {Number(row.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <CalendarMonthIcon fontSize="small" color="primary" />
                            <Typography variant="body2">{row.startDate || '-'}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <CalendarMonthIcon fontSize="small" color="primary" />
                            <Typography variant="body2">{row.renewalDate || '-'}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={row.automaticPay ? t('common.yes', 'Yes') : t('common.no', 'No')}
                            color={row.automaticPay ? 'success' : 'default'}
                            variant={row.automaticPay ? 'filled' : 'outlined'}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <RowActions
                            row={row}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onNotifyExpiration={handleNotifyExpiration}
                            onNotifyReengage={handleNotifyReengage}
                            onNotifyRenewed={handleNotifyRenewed}
                            onCopyWhatsapp={handleCopyWhatsapp}
                            onCopyM3u={handleCopyM3u}
                            onCopyLinePlusM3u={handleCopyLinePlusM3u}
                            busy={notifLoadingId === row.subscriptionId}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  {!loading && filteredRows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={12} align="center">
                        {t('subscriptions.empty', 'No subscriptions found.')}
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

      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        fullWidth
        maxWidth="md"
        fullScreen={isMobile}
        PaperProps={{
          sx: (theme) => ({
            borderRadius: 3,
            boxShadow:
              theme.palette.mode === 'dark'
                ? `0 18px 40px ${withAlpha('#020817', 0.58)}`
                : `0 18px 40px ${withAlpha('#0f172a', 0.2)}`,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: form.subscriptionId
              ? withAlpha(theme.vars.palette.warning.main, 0.45)
              : withAlpha(theme.vars.palette.primary.main, 0.45),
            backgroundColor: theme.vars.palette.surface.card,
            backgroundImage:
              theme.palette.mode === 'light'
                ? `linear-gradient(150deg, ${theme.palette.primary.light}16 0%, ${theme.palette.secondary.light}10 45%, ${theme.palette.background.paper} 100%)`
                : `linear-gradient(150deg, ${withAlpha(theme.vars.palette.primary.main, 0.16)} 0%, ${withAlpha(theme.vars.palette.secondary.main, 0.1)} 45%, ${theme.vars.palette.surface.card} 100%)`
          })
        }}
      >
        <DialogTitleWithClose
          onClose={() => setOpenModal(false)}
          sx={(theme) => ({
            background:
              theme.palette.mode === 'dark'
                ? `linear-gradient(135deg, ${withAlpha(theme.vars.palette.primary.main, 0.25)} 0%, ${withAlpha(theme.vars.palette.secondary.main, 0.18)} 45%, ${theme.vars.palette.surface.card} 100%)`
                : `linear-gradient(135deg, ${theme.palette.primary.light}28 0%, ${theme.palette.secondary.light}20 45%, ${theme.palette.background.paper} 100%)`,
            pb: 1
          })}
        >
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Avatar
              sx={{
                bgcolor: form.subscriptionId ? 'warning.main' : 'primary.main',
                color: 'common.white',
                width: 40,
                height: 40,
                boxShadow: 4
              }}
            >
              <CreditCardIcon fontSize="small" />
            </Avatar>
            <Box>
              <Typography variant="h6">
                {form.subscriptionId ? t('subscriptions.form.editTitle', 'Edit subscription') : t('subscriptions.actions.new', 'New subscription')}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t('subscriptions.form.subtitle', 'Complete customer, package and billing details.')}
              </Typography>
            </Box>
              <Chip
              label={form.subscriptionId ? t('common.edit', 'Edit') : t('common.new', 'New')}
              size="small"
              color={form.subscriptionId ? 'warning' : 'success'}
              sx={{ ml: 'auto', fontWeight: 700, borderRadius: 1.5 }}
            />
          </Stack>
        </DialogTitleWithClose>
        <DialogContent
          dividers
          sx={{
            bgcolor: 'background.default',
            px: { xs: 1.5, sm: 3 },
            py: { xs: 1.5, sm: 2 },
            background: (theme) =>
              theme.palette.mode === 'light'
                ? `linear-gradient(180deg, ${theme.palette.primary.light}14 0%, ${theme.palette.secondary.light}10 50%, ${theme.palette.background.paper} 82%)`
                : `linear-gradient(180deg, ${withAlpha(theme.vars.palette.primary.main, 0.15)} 0%, ${withAlpha(theme.vars.palette.secondary.main, 0.1)} 50%, ${theme.vars.palette.surface.card} 82%)`,
            position: 'relative',
            '&::before': {
              content: '\"\"',
              position: 'absolute',
              inset: 12,
              zIndex: 0,
              borderRadius: 20,
              background: (theme) =>
                `radial-gradient(circle at 20% 20%, ${withAlpha(theme.vars.palette.primary.main, theme.palette.mode === 'dark' ? 0.18 : 0.1)}, transparent 45%), radial-gradient(circle at 78% 0%, ${withAlpha(theme.vars.palette.secondary.main, theme.palette.mode === 'dark' ? 0.16 : 0.1)}, transparent 35%)`
            }
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1, position: 'relative', zIndex: 1 }}>
            <Chip
              icon={<AutoAwesomeIcon fontSize="small" color={form.subscriptionId ? 'warning' : 'primary'} />}
              label={form.subscriptionId ? t('subscriptions.badge.edit', 'Editing') : t('subscriptions.badge.new', 'New')}
              color={form.subscriptionId ? 'warning' : 'primary'}
              variant="outlined"
              sx={{ fontWeight: 700, borderRadius: 1.5, boxShadow: 1 }}
            />
            <Typography variant="caption" color="text.secondary">
              {t('subscriptions.form.helperTone', 'Complete the key fields before saving.')}
            </Typography>
          </Stack>

          <Stack spacing={2} sx={{ position: 'relative', zIndex: 1 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} flexWrap="wrap">
              <Chip
                icon={<PersonOutlineIcon fontSize="small" />}
                label={
                  form.customerId
                    ? customerNameMap[form.customerId] || form.customerId
                    : t('subscriptions.form.customer', 'Customer')
                }
                variant="outlined"
                color={form.customerId ? 'primary' : 'default'}
              />
              <Chip
                icon={<WifiTetheringIcon fontSize="small" />}
                label={form.lineId || t('subscriptions.form.line', 'Line')}
                variant="outlined"
                color={form.lineId ? 'success' : 'default'}
              />
              <Chip
                icon={<BoltIcon fontSize="small" />}
                label={
                  form.packageId
                    ? packageMap[String(form.packageId)]?.name || form.packageId
                    : t('subscriptions.form.package', 'Package')
                }
                variant="outlined"
                color={form.packageId ? 'warning' : 'default'}
              />
            </Stack>

            <SectionCard
              title={t('subscriptions.form.sections.main', 'Main data')}
              helper={t('subscriptions.form.sections.mainHelper', 'Customer, package and status.')}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4} md={4}>
                  <FormControl fullWidth required sx={fieldSx} disabled={customersLoading}>
                    <InputLabel shrink>{t('subscriptions.form.customer', 'Customer')}</InputLabel>
                    <Select
                      displayEmpty
                      value={form.customerId}
                      label={t('subscriptions.form.customer', 'Customer')}
                      onChange={handleFormChange('customerId')}
                      renderValue={(value) => {
                        const c = customers.find((cust) => (cust.customerId || cust.id) === value);
                        const label =
                          c?.customerFullname || c?.fullName || c?.username || c?.customerMail || value || t('common.selectOption', 'Select an option');
                        return (
                          <Stack direction="row" spacing={1} alignItems="center">
                            <PersonOutlineIcon fontSize="small" color="primary" />
                            <Typography variant="body2" color={value ? 'text.primary' : 'text.secondary'}>
                              {label}
                            </Typography>
                          </Stack>
                        );
                      }}
                    >
                      <MenuItem value="">
                        <em>{t('common.selectOption', 'Select an option')}</em>
                      </MenuItem>
                      {customers.length === 0 ? (
                        <MenuItem value="" disabled>
                          {t('subscriptions.form.noCustomers', 'No customers available')}
                        </MenuItem>
                      ) : (
                        customers.map((c) => (
                          <MenuItem key={c.customerId || c.id} value={c.customerId || c.id}>
                            <ListItemIcon>
                              <PersonOutlineIcon fontSize="small" color="primary" />
                            </ListItemIcon>
                            <Typography variant="body2">
                              {c.customerFullname || c.fullName || c.username || c.customerMail}
                            </Typography>
                          </MenuItem>
                        ))
                      )}
                    </Select>
                    <FormHelperText>
                      {customersLoading
                        ? t('subscriptions.form.loadingCustomers', 'Loading customers...')
                        : t('subscriptions.form.customerHint', 'Choose the subscription customer.')}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4} md={4}>
                  <FormControl fullWidth required sx={fieldSx} disabled={packagesLoading}>
                    <InputLabel shrink>{t('subscriptions.form.package', 'Package')}</InputLabel>
                    <Select
                      displayEmpty
                      value={form.packageId}
                      label={t('subscriptions.form.package', 'Package')}
                      onChange={handleFormChange('packageId')}
                      renderValue={(value) => {
                        const pkg = packages.find((p) => p.id === value);
                        const label = pkg ? pkg.name || `Package ${pkg.id}` : value || t('common.selectOption', 'Select an option');
                        return (
                          <Stack direction="row" spacing={1} alignItems="center">
                            <BoltIcon fontSize="small" color="warning" />
                            <Typography variant="body2" color={value ? 'text.primary' : 'text.secondary'}>
                              {label}
                            </Typography>
                          </Stack>
                        );
                      }}
                    >
                      <MenuItem value="">
                        <em>{t('common.selectOption', 'Select an option')}</em>
                      </MenuItem>
                      {packages.length === 0 ? (
                        <MenuItem value="" disabled>
                          {t('subscriptions.form.noPackages', 'No packages available')}
                        </MenuItem>
                      ) : (
                        packages.map((p) => (
                          <MenuItem key={p.id} value={p.id}>
                            <Stack spacing={0.25}>
                              <Stack direction="row" spacing={0.75} alignItems="center">
                                <Avatar sx={{ width: 22, height: 22, bgcolor: 'warning.main', color: 'warning.contrastText' }}>
                                  <BoltIcon fontSize="inherit" />
                                </Avatar>
                                <Typography variant="body2" color="text.primary">
                                  {p.name || t('subscriptions.labels.packageFallback', { id: p.id })}
                                </Typography>
                              </Stack>
                              {p.description ? (
                                <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'normal' }}>
                                  {p.description}
                                </Typography>
                              ) : null}
                            </Stack>
                          </MenuItem>
                        ))
                      )}
                    </Select>
                    <FormHelperText>
                      {packagesLoading
                        ? t('subscriptions.form.loadingPackages', 'Loading packages...')
                        : t('subscriptions.form.packagesHint', 'Packages (DEMO excluded)')}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4} md={4}>
                  <FormControl fullWidth required sx={fieldSx}>
                    <InputLabel shrink>{t('subscriptions.form.status', 'Status')}</InputLabel>
                    <Select
                      displayEmpty
                      value={form.status}
                      label={t('subscriptions.form.status', 'Status')}
                      onChange={handleFormChange('status')}
                      renderValue={(value) => (
                        <Stack direction="row" spacing={1} alignItems="center">
                          <AutoAwesomeIcon fontSize="small" color="success" />
                          <Typography variant="body2" color={value ? 'text.primary' : 'text.secondary'}>
                            {value || t('subscriptions.form.statusPlaceholder', 'Status')}
                          </Typography>
                        </Stack>
                      )}
                    >
                      <MenuItem value="ACTIVE">
                        <ListItemIcon>
                          <AutoAwesomeIcon fontSize="small" color="success" />
                        </ListItemIcon>
                        <Typography variant="body2">{t('status.active', 'Active')}</Typography>
                      </MenuItem>
                      <MenuItem value="INACTIVE">
                        <ListItemIcon>
                          <AutoAwesomeIcon fontSize="small" color="disabled" />
                        </ListItemIcon>
                        <Typography variant="body2">{t('status.inactive', 'Inactive')}</Typography>
                      </MenuItem>
                      <MenuItem value="CANCELLED">
                        <ListItemIcon>
                          <DeleteOutlineIcon fontSize="small" color="error" />
                        </ListItemIcon>
                        <Typography variant="body2">{t('status.cancelled', 'Cancelled')}</Typography>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </SectionCard>

            <SectionCard
              title={t('subscriptions.form.sections.billing', 'Billing')}
              helper={t('subscriptions.form.sections.billingHelper', 'Line, billing and amounts.')}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4} md={4}>
                  <FormControl fullWidth required sx={fieldSx} disabled={linesLoading}>
                    <InputLabel shrink>{t('subscriptions.form.line', 'Line')}</InputLabel>
                    <Select
                      displayEmpty
                      value={form.lineId}
                      label={t('subscriptions.form.line', 'Line')}
                      onChange={handleLineChange}
                      renderValue={(value) => {
                        const found = lines.find((l) => (l.id ?? l.lineId) === value);
                        const lineLabel = found?.username || lineNameMap[String(value)] || value || t('common.selectOption', 'Select an option');
                        return (
                          <Stack direction="row" spacing={1} alignItems="center">
                            <WifiTetheringIcon fontSize="small" color="primary" />
                            <Typography variant="body2" color={value ? 'text.primary' : 'text.secondary'} sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                              {lineLabel}
                            </Typography>
                          </Stack>
                        );
                      }}
                    >
                      <MenuItem value="">
                        <em>{t('common.selectOption', 'Select an option')}</em>
                      </MenuItem>
                      {lines.length === 0 ? (
                        <MenuItem value="" disabled>
                          {t('subscriptions.form.noLines', 'No lines available')}
                        </MenuItem>
                      ) : (
                        lines.map((l) => (
                          <MenuItem key={l.id} value={l.id} sx={{ py: 0.7 }}>
                            <Stack direction="row" spacing={0.8} alignItems="center">
                              <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.lighter', color: 'primary.main', fontSize: 12 }}>
                                <WifiTetheringIcon fontSize="inherit" />
                              </Avatar>
                              <Stack spacing={0.2}>
                                <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                                  {l.username || l.user_name || l.id}
                                </Typography>
                                <Chip
                                  size="small"
                                  label={l.provider || t('subscriptions.labels.providerFallback')}
                                  color="info"
                                  variant="outlined"
                                  sx={{ height: 18, fontWeight: 700, letterSpacing: 0.25, borderRadius: 1.2, fontSize: 11, px: 0.6, width: 'fit-content' }}
                                />
                              </Stack>
                            </Stack>
                          </MenuItem>
                        ))
                      )}
                    </Select>
                    <FormHelperText>
                    {linesLoading
                        ? t('subscriptions.form.loadingLines', 'Loading lines...')
                        : t('subscriptions.form.linesHint', 'Description shows username')}
                  </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4} md={4}>
                  <FormControl fullWidth sx={fieldSx} disabled={linesLoading}>
                    <InputLabel shrink>{t('subscriptions.form.linePlus', 'Line plus')}</InputLabel>
                    <Select
                      displayEmpty
                      value={form.linePlusId}
                      label={t('subscriptions.form.linePlus', 'Line plus')}
                      onChange={(e) => setForm((p) => ({ ...p, linePlusId: e.target.value }))}
                      renderValue={(value) => {
                        const found = lines.find((l) => l.id === value || l.lineId === value);
                        const lineLabel = found?.username || lineNameMap[String(value)] || value || t('common.selectOption', 'Select an option');
                        return (
                          <Stack direction="row" spacing={1} alignItems="center">
                            <WifiTetheringIcon fontSize="small" color="primary" />
                            <Typography variant="body2" color={value ? 'text.primary' : 'text.secondary'} sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                              {lineLabel}
                            </Typography>
                          </Stack>
                        );
                      }}
                    >
                      <MenuItem value="">
                        <em>{t('common.selectOption', 'Select an option')}</em>
                      </MenuItem>
                      {plusLines.length === 0 ? (
                        <MenuItem value="" disabled>
                          {t('subscriptions.form.noPlusLines', 'No LION_PLUS+ lines available')}
                        </MenuItem>
                      ) : (
                        plusLines.map((l) => (
                          <MenuItem key={l.id} value={l.id} sx={{ py: 0.7 }}>
                            <Stack direction="row" spacing={0.8} alignItems="center">
                              <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.lighter', color: 'primary.main', fontSize: 12 }}>
                                <WifiTetheringIcon fontSize="inherit" />
                              </Avatar>
                              <Stack spacing={0.2}>
                                <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                                  {l.username || l.user_name || l.id}
                                </Typography>
                                <Chip
                                  size="small"
                                  label={l.provider || t('subscriptions.labels.providerFallback')}
                                  color="info"
                                  variant="outlined"
                                  sx={{ height: 18, fontWeight: 700, letterSpacing: 0.25, borderRadius: 1.2, fontSize: 11, px: 0.6, width: 'fit-content' }}
                                />
                              </Stack>
                            </Stack>
                          </MenuItem>
                        ))
                      )}
                    </Select>
                    <FormHelperText>
                      {t('subscriptions.form.linesPlusHint', 'Only LION_PLUS+ lines (optional)')}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4} md={4}>
                  <FormControl fullWidth sx={fieldSx}>
                    <InputLabel shrink>{t('subscriptions.form.billing', 'Billing')}</InputLabel>
                    <Select
                      displayEmpty
                      value={form.billing}
                      label={t('subscriptions.form.billing', 'Billing')}
                      onChange={handleFormChange('billing')}
                      renderValue={(value) => (
                        <Stack direction="row" spacing={1} alignItems="center">
                          <PriceChangeIcon fontSize="small" color="info" />
                          <Typography variant="body2" color={value ? 'text.primary' : 'text.secondary'}>
                            {value || t('common.selectOption', 'Select an option')}
                          </Typography>
                        </Stack>
                      )}
                    >
                      <MenuItem value="">
                        <em>{t('common.selectOption', 'Select an option')}</em>
                      </MenuItem>
                      <MenuItem value="Monthly">
                        <ListItemIcon>
                          <CalendarMonthIcon fontSize="small" color="primary" />
                        </ListItemIcon>
                        <Typography variant="body2">{t('billing.monthly', 'Monthly')}</Typography>
                      </MenuItem>
                      <MenuItem value="Quarterly">
                        <ListItemIcon>
                          <CalendarMonthIcon fontSize="small" color="info" />
                        </ListItemIcon>
                        <Typography variant="body2">{t('billing.quarterly', 'Quarterly')}</Typography>
                      </MenuItem>
                      <MenuItem value="Biannual">
                        <ListItemIcon>
                          <CalendarMonthIcon fontSize="small" color="warning" />
                        </ListItemIcon>
                        <Typography variant="body2">{t('billing.biannual', 'Biannual')}</Typography>
                      </MenuItem>
                      <MenuItem value="Annual">
                        <ListItemIcon>
                          <CalendarMonthIcon fontSize="small" color="success" />
                        </ListItemIcon>
                        <Typography variant="body2">{t('billing.annual', 'Annual')}</Typography>
                      </MenuItem>
                    </Select>
                    <FormHelperText>{t('subscriptions.form.billingHint', 'Billing frequency')}</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={2} md={2}>
                  <TextField
                    label={t('subscriptions.form.amount', 'Amount')}
                    type="number"
                    value={form.amount}
                    onChange={handleFormChange('amount')}
                    fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PriceChangeIcon fontSize="small" color="info" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={2} md={2}>
                  <TextField
                    label={t('subscriptions.form.discount', 'Discount')}
                    type="number"
                    value={form.discount}
                    onChange={handleFormChange('discount')}
                    fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PriceChangeIcon fontSize="small" color="info" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
              </Grid>
            </SectionCard>

            <SectionCard
              title={t('subscriptions.form.sections.dates', 'Dates')}
              helper={t('subscriptions.form.sections.datesHelper', 'Subscription start and renewal.')}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={6}>
                  <TextField
                    required
                    label={t('subscriptions.form.start', 'Start')}
                    type="date"
                    value={form.startDate}
                    onChange={handleFormChange('startDate')}
                    fullWidth
                    sx={fieldSx}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarMonthIcon fontSize="small" color="primary" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <TextField
                    label={t('subscriptions.form.renewal', 'Renewal')}
                    type="date"
                    value={form.renewalDate}
                    onChange={handleFormChange('renewalDate')}
                    fullWidth
                    sx={fieldSx}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarMonthIcon fontSize="small" color="primary" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
              </Grid>
            </SectionCard>

            <SectionCard
              title={t('subscriptions.form.sections.automation', 'Automation')}
              helper={t('subscriptions.form.sections.automationHelper', 'Automatic payments and activation link.')}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={3} md={3} display="flex" alignItems="center">
                  <FormControlLabel
                    control={<Switch checked={form.automaticPay} onChange={handleFormChange('automaticPay')} color="success" />}
                    label={t('subscriptions.form.autopay', 'Automatic payment')}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <TextField
                    label={t('subscriptions.form.autopayLink', 'Automatic payment link')}
                    value={form.linkAutomatic}
                    onChange={handleFormChange('linkAutomatic')}
                    fullWidth
                    sx={fieldSx}
                    placeholder={t('subscriptions.form.autopayLinkPlaceholder', 'https://...')}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LinkIcon fontSize="small" color="primary" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
              </Grid>
            </SectionCard>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button variant="outlined" onClick={resetForm} disabled={sending} sx={{ borderRadius: 2 }} startIcon={<RefreshIcon />}>
            {t('common.clear', 'Clear')}
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={sending}
            startIcon={<RocketLaunchIcon />}
            sx={(theme) => ({
              borderRadius: 2,
              boxShadow:
                theme.palette.mode === 'dark'
                  ? `0 12px 28px ${withAlpha('#020817', 0.46)}`
                  : `0 12px 28px ${withAlpha('#0f172a', 0.18)}`,
              px: 2.4
            })}
          >
            {sending
              ? t('common.saving', 'Saving...')
              : form.subscriptionId
                ? t('common.saveChanges', 'Save changes')
                : t('common.create', 'Create')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDelete.open}
        onClose={() => setOpenDelete({ open: false, row: null })}
        maxWidth="xs"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitleWithClose onClose={() => setOpenDelete({ open: false, row: null })}>
          {t('subscriptions.delete.title', 'Delete subscription')}
        </DialogTitleWithClose>
        <DialogContent dividers>
          <Typography>
            {t('subscriptions.delete.message', 'Delete subscription')} <strong>{openDelete.row?.subscriptionId ?? ''}</strong>? {t('subscriptions.delete.warning', 'This action cannot be undone.')}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete({ open: false, row: null })} disabled={sending}>
            {t('common.cancel', 'Cancel')}
          </Button>
          <Button color="error" variant="contained" onClick={confirmDelete} disabled={sending}>
            {sending ? t('subscriptions.delete.deleting', 'Deleting...') : t('subscriptions.delete.confirm', 'Delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
