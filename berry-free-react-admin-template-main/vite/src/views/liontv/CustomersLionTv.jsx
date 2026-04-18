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
import Card from '@mui/material/Card';
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
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';
import FormHelperText from '@mui/material/FormHelperText';
import { useTheme, useMediaQuery } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';

import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import PublicIcon from '@mui/icons-material/Public';
import ShareIcon from '@mui/icons-material/Share';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WcIcon from '@mui/icons-material/Wc';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import RouteIcon from '@mui/icons-material/Route';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import Diversity1Icon from '@mui/icons-material/Diversity1';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import BlockIcon from '@mui/icons-material/Block';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';

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
import { listLoyaltyCustomers, listVipCustomers } from 'api/liontv-engagement';

const buildChannelOptions = (t) => [
  { value: 'red social', label: t('customers.channels.social') },
  { value: 'google', label: t('customers.channels.google') },
  { value: 'familiares', label: t('customers.channels.family') },
  { value: 'amigos', label: t('customers.channels.friends') }
];

const fieldSx = {
  '& .MuiInputBase-root': { borderRadius: 2, minHeight: 48 },
  '& .MuiInputLabel-root': { fontWeight: 500 }
};

const glassCard = (theme) => ({
  p: 2,
  borderRadius: 2.5,
  border: '1px solid',
  borderColor: 'divider',
  boxShadow: '0 14px 34px rgba(2,8,23,0.34)',
  background: `linear-gradient(135deg, ${theme.vars.palette.surface.card} 0%, ${theme.vars.palette.surface.muted} 100%)`,
  ...theme.applyStyles('light', {
    boxShadow: '0 14px 34px rgba(0,0,0,0.10)',
    background: `linear-gradient(135deg, ${theme.vars.palette.primary.light}24 0%, ${theme.vars.palette.secondary.main}12 45%, ${theme.vars.palette.background.paper} 100%)`
  })
});

const sectionSx = {
  p: 2,
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
  bgcolor: 'background.paper'
};

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
}

function StatusChip({ status }) {
  const theme = useTheme();
  const { t } = useTranslation();
  const map = {
    ACTIVE: {
      bg: theme.palette.success.lighter || `${theme.palette.success.main}22`,
      color: theme.palette.success.darker || theme.palette.success.dark,
      border: theme.palette.success.main,
      icon: <CheckCircleOutlineIcon fontSize="small" />
    },
    INACTIVE: {
      bg: theme.palette.error.lighter || `${theme.palette.error.main}18`,
      color: theme.palette.error.darker || theme.palette.error.dark,
      border: theme.palette.error.main,
      icon: <BlockIcon fontSize="small" />
    },
    BLOCKED: {
      bg: theme.palette.error.lighter || `${theme.palette.error.main}18`,
      color: theme.palette.error.darker || theme.palette.error.dark,
      border: theme.palette.error.main,
      icon: <BlockIcon fontSize="small" />
    },
    SUSPENDED: {
      bg: theme.palette.warning.lighter || `${theme.palette.warning.main}18`,
      color: theme.palette.warning.darker || theme.palette.warning.dark,
      border: theme.palette.warning.main,
      icon: <PauseCircleOutlineIcon fontSize="small" />
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
      label={status ? t(`customers.status.${status}`, { defaultValue: status }) : '-'}
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

function normalizeCustomer(item = {}) {
  return {
    id: item.customerId ?? item.id ?? item.customer_id ?? null,
    fullName: item.customerFullname ?? item.fullName ?? item.customer_name ?? '',
    gender: (item.gender ?? '').toUpperCase(),
    openingDate: item.openingDate ?? item.open_date ?? null,
    closeDate: item.closeDate ?? item.close_date ?? null,
    isReferred: Boolean(item.isReferered ?? item.isReferred ?? false),
    refererBy: item.refererBy ?? item.referredBy ?? '',
    phone: item.customerPhone ?? item.phone ?? '',
    mail: item.customerMail ?? item.email ?? '',
    status: (item.customerStatus ?? item.status ?? '').toUpperCase(),
    username: item.username ?? item.userName ?? '',
    channel: item.channel ?? item.canal ?? ''
  };
}

function initialsFromName(name = '') {
  const parts = name.trim().split(' ').filter(Boolean);
  if (!parts.length) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ''}${parts[parts.length - 1][0] ?? ''}`.toUpperCase();
}

function flagFromPhone(phone = '') {
  const clean = phone.replace(/[^\d+]/g, '');
  if (clean.startsWith('+504') || clean.startsWith('504')) return '🇭🇳';
  if (clean.startsWith('+502') || clean.startsWith('502')) return '🇬🇹';
  if (clean.startsWith('+503') || clean.startsWith('503')) return '🇸🇻';
  if (clean.startsWith('+505') || clean.startsWith('505')) return '🇳🇮';
  if (clean.startsWith('+506') || clean.startsWith('506')) return '🇨🇷';
  if (clean.startsWith('+507') || clean.startsWith('507')) return '🇵🇦';
  if (clean.startsWith('+509') || clean.startsWith('509')) return '🇭🇹';
  if (clean.startsWith('+501') || clean.startsWith('501')) return '🇧🇿';
  if (clean.startsWith('+58') || clean.startsWith('58')) return '🇻🇪';
  if (clean.startsWith('+54') || clean.startsWith('54')) return '🇦🇷';
  if (clean.startsWith('+52') || clean.startsWith('52')) return '🇲🇽';
  if (clean.startsWith('+1') || clean.startsWith('1')) return '🇺🇸';
  if (clean.startsWith('+34') || clean.startsWith('34')) return '🇪🇸';
  if (clean.startsWith('+57') || clean.startsWith('57')) return '🇨🇴';
  if (clean.startsWith('+48') || clean.startsWith('48')) return '🇵🇱';
  return null;
}

function vipColor(code) {
  switch (String(code || '').toUpperCase()) {
    case 'BLACK':
      return { bg: '#11182722', color: '#111827', border: '#11182755' };
    case 'GOLD':
      return { bg: '#f59e0b22', color: '#b45309', border: '#f59e0b55' };
    case 'SILVER':
      return { bg: '#94a3b822', color: '#64748b', border: '#94a3b855' };
    case 'BRONZE':
      return { bg: '#9c6b3f22', color: '#9c6b3f', border: '#9c6b3f55' };
    default:
      return { bg: 'rgba(148,163,184,0.15)', color: '#64748b', border: 'rgba(148,163,184,0.35)' };
  }
}

function VipTierChip({ tierCode }) {
  const palette = vipColor(tierCode);
  return (
    <Chip
      size="small"
      label={tierCode || '-'}
      sx={{
        bgcolor: palette.bg,
        color: palette.color,
        border: '1px solid',
        borderColor: palette.border,
        fontWeight: 700
      }}
    />
  );
}

function LoyaltyPointsChip({ points }) {
  const safePoints = Number(points || 0);
  return <Chip size="small" color={safePoints > 0 ? 'warning' : 'default'} label={`${safePoints} pts`} sx={{ fontWeight: 700 }} />;
}

function RowActions({ row, onEdit, onDelete, onWelcome, welcomeLoading }) {
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
          '&:hover': {
            bgcolor: theme.palette.primary.light
          },
          boxShadow: '0 6px 14px rgba(0,0,0,0.12)'
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
          {t('actions.edit')}
        </MenuItem>
        <MenuItem
          disabled={welcomeLoading}
          onClick={() => {
            setAnchorEl(null);
            onWelcome?.(row);
          }}
        >
          <AutoAwesomeIcon fontSize="small" style={{ marginRight: 8, color: '#43a047' }} />
          {welcomeLoading
            ? t('customers.actions.sendingWelcome', 'Enviando bienvenida...')
            : t('customers.actions.sendWelcome', 'Enviar bienvenida')}
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            onDelete?.(row);
          }}
        >
          <DeleteOutlineIcon fontSize="small" style={{ marginRight: 8, color: '#e53935' }} />
          {t('actions.delete')}
        </MenuItem>
      </Menu>
    </>
  );
}

function FormSection({ title, helper, children }) {
  return (
    <Box
      sx={(theme) => ({
        ...sectionSx,
        position: 'relative',
        overflow: 'hidden',
        borderLeft: `4px solid ${theme.palette.primary.main}44`,
        background: theme.vars.palette.surface.card,
        ...theme.applyStyles('light', {
          background: `linear-gradient(135deg, ${theme.vars.palette.primary.light}08 0%, ${theme.vars.palette.secondary.light}08 100%)`
        })
      })}
    >
      <Stack spacing={1.5}>
        <Box>
          <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {title}
          </Typography>
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

export default function CustomersLionTv() {
  const { enqueueSnackbar } = useSnackbar();
  const { accessToken } = useAuth();
  const { t } = useTranslation();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const createDefaultForm = () => {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    const todayStr = today.toISOString().slice(0, 10);
    return {
      customerId: null,
      customerFullname: '',
      gender: 'M',
      openingDate: todayStr,
      closeDate: '',
      isReferered: false,
      refererBy: '',
      customerPhone: '',
      customerMail: '',
      customerStatus: 'INACTIVE',
      channel: 'red social'
    };
  };

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState({ open: false, row: null });
  const [form, setForm] = useState(() => createDefaultForm());
  const [sending, setSending] = useState(false);
  const [sendingWelcomeId, setSendingWelcomeId] = useState(null);
  const [referers, setReferers] = useState([]);
  const [referersLoading, setReferersLoading] = useState(false);
  const [referersFetched, setReferersFetched] = useState(false);
  const [vipSummaryByCustomerId, setVipSummaryByCustomerId] = useState({});
  const [loyaltySummaryByCustomerId, setLoyaltySummaryByCustomerId] = useState({});
  const channelOptions = useMemo(() => buildChannelOptions(t), [t]);

  const handleUnauthorized = (err) => {
    const status = err?.response?.status || err?.request?.status;
    return status === 401;
  };

  const loadCustomers = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);

    try {
      const response = await lionTvApi.get('/customers/v1', {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { index: 0, size: 5000 },
        skipAuthRedirect: true
      });

      const payload = response?.data?.data ?? response?.data ?? {};
      const collection = payload.data ?? payload.items ?? payload.content ?? [];
      const normalized = collection.map(normalizeCustomer);

      setRows(normalized);
      setTotal(normalized.length);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || err.message || t('customers.messages.loadError'), {
          variant: 'error'
        });
      }
    } finally {
      setLoading(false);
    }
  }, [accessToken, enqueueSnackbar]);

  const loadReferers = useCallback(async () => {
    if (!accessToken) return;
    setReferersLoading(true);
    try {
      const response = await lionTvApi.get('/customers/v1', {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { index: 0, size: 500 },
        skipAuthRedirect: true
      });
      const payload = response?.data?.data ?? response?.data ?? {};
      const collection = payload.data ?? payload.items ?? payload.content ?? [];
      const normalized = collection.map(normalizeCustomer);
      setReferers(normalized);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(t('customers.messages.referersLoadError'), { variant: 'warning' });
      }
    } finally {
      setReferersLoading(false);
      setReferersFetched(true);
    }
  }, [accessToken, enqueueSnackbar]);

  useEffect(() => {
    loadCustomers();
  }, [refreshKey, loadCustomers]);

  useEffect(() => {
    setReferersFetched(false);
  }, [refreshKey]);

  useEffect(() => {
    if ((openCreate || openEdit) && !referersFetched && !referersLoading) {
      loadReferers();
    }
  }, [openCreate, openEdit, referersFetched, referersLoading, loadReferers]);

  const filteredRows = useMemo(() => {
    if (!search && !statusFilter) return rows;
    const term = search.toLowerCase();
    return rows.filter((row) => {
      if (statusFilter && (row.status || '').toLowerCase() !== statusFilter.toLowerCase()) return false;
      return (
        (row.fullName || '').toLowerCase().includes(term) ||
        (row.username || '').toLowerCase().includes(term) ||
        (row.mail || '').toLowerCase().includes(term) ||
        (row.phone || '').toLowerCase().includes(term) ||
        (row.status || '').toLowerCase().includes(term) ||
        (row.channel || '').toLowerCase().includes(term)
      );
    });
  }, [rows, search, statusFilter]);

  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredRows.slice(start, start + rowsPerPage);
  }, [filteredRows, page, rowsPerPage]);

  const loadEngagementSummaries = useCallback(
    async (customerIds) => {
      if (!customerIds.length) {
        setVipSummaryByCustomerId({});
        setLoyaltySummaryByCustomerId({});
        return;
      }

      try {
        const [vipResponse, loyaltyResponse] = await Promise.all([
          listVipCustomers({ customerIds: customerIds.join(','), index: 0, size: customerIds.length }),
          listLoyaltyCustomers({ customerIds: customerIds.join(','), index: 0, size: customerIds.length })
        ]);

        setVipSummaryByCustomerId(
          Object.fromEntries((vipResponse?.data || []).map((row) => [row.customerId, row]))
        );
        setLoyaltySummaryByCustomerId(
          Object.fromEntries((loyaltyResponse?.data || []).map((row) => [row.customerId, row]))
        );
      } catch (err) {
        if (!handleUnauthorized(err)) {
          enqueueSnackbar(err?.response?.data?.message || err.message || 'No se pudo cargar el resumen VIP/lealtad.', {
            variant: 'warning'
          });
        }
      }
    },
    [enqueueSnackbar]
  );

  useEffect(() => {
    const customerIds = paginatedRows.map((row) => row.id || row.customerId).filter(Boolean);
    loadEngagementSummaries(customerIds);
  }, [loadEngagementSummaries, paginatedRows]);

  const customerStatusLabel = useCallback(
    (val) => {
      if (!val) return t('invoices.filters.all');
      return val === 'ACTIVE' ? t('customers.form.states.active') : t('customers.form.states.inactive');
    },
    [t]
  );

  useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(filteredRows.length / rowsPerPage) - 1);
    if (page > maxPage) {
      setPage(0);
    }
  }, [filteredRows.length, page, rowsPerPage]);

  const summary = useMemo(
    () =>
      rows.reduce(
        (acc, row) => {
          if (row.status === 'ACTIVE') acc.active += 1;
          if (row.status === 'INACTIVE') acc.inactive += 1;
          if (row.isReferred || row.refererBy) acc.referred += 1;
          return acc;
        },
        { active: 0, inactive: 0, referred: 0 }
      ),
    [rows]
  );

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (row) => {
    openEditModal(row);
  };

  const handleDelete = (row) => {
    setOpenDelete({ open: true, row });
  };

  const handleSendWelcome = async (row) => {
    const customerId = row?.customerId || row?.id;
    const email = row?.mail;

    if (!customerId || !email) {
      enqueueSnackbar(t('customers.messages.missingEmail', 'El cliente no tiene correo registrado.'), { variant: 'warning' });
      return;
    }

    setSendingWelcomeId(customerId);
    try {
      await lionTvApi.post(
        '/notifications/welcome',
        {
          email,
          customerName: row?.fullName || ''
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          skipAuthRedirect: true
        }
      );
      enqueueSnackbar(t('customers.messages.welcomeSent', 'Correo de bienvenida enviado.'), { variant: 'success' });
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || err.message || t('customers.messages.welcomeError', 'No se pudo enviar la bienvenida.'), {
          variant: 'error'
        });
      }
    } finally {
      setSendingWelcomeId(null);
    }
  };

  const handleFormChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm((prev) => {
      // If status changes to INACTIVE, set closing date to today (local timezone)
      if (field === 'customerStatus') {
        if (value === 'INACTIVE') {
          const today = new Date();
          today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
          return { ...prev, [field]: value, closeDate: today.toISOString().slice(0, 10) };
        }
        // if goes back to ACTIVE, keep closeDate as-is (could clear if desired)
        return { ...prev, [field]: value };
      }
      return { ...prev, [field]: value };
    });
  };

  const resetForm = () => setForm(createDefaultForm());

  const handleCreateCustomer = async () => {
    if (!form.customerFullname || !form.gender || !form.customerPhone || !form.customerMail || !form.channel) {
      enqueueSnackbar(t('customers.messages.required'), { variant: 'warning' });
      return;
    }

    const payload = {
      customerFullname: form.customerFullname,
      gender: form.gender,
      openingDate: form.openingDate || null,
      closeDate: form.closeDate || null,
      isReferered: Boolean(form.isReferered),
      refererBy: form.refererBy,
      customerPhone: form.customerPhone,
      customerMail: form.customerMail,
      customerStatus: form.customerStatus || 'INACTIVE',
      channel: form.channel
    };

    setSending(true);
    try {
      await lionTvApi.post('/customers/v1', payload, {
        headers: { Authorization: `Bearer ${accessToken}` },
        skipAuthRedirect: true
      });
      enqueueSnackbar(t('customers.messages.created'), { variant: 'success' });
      setOpenCreate(false);
      resetForm();
      setRefreshKey((v) => v + 1);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || err.message || t('customers.messages.createError'), {
          variant: 'error'
        });
      }
    } finally {
      setSending(false);
    }
  };

  const openEditModal = (row) => {
    setForm({
      customerId: row.customerId || row.id || null,
      customerFullname: row.fullName || '',
      gender: row.gender || 'M',
      openingDate: row.openingDate || '',
      closeDate: row.closeDate || '',
      isReferered: Boolean(row.isReferred),
      refererBy: row.refererBy || '',
      customerPhone: row.phone || '',
      customerMail: row.mail || '',
      customerStatus: row.status || 'INACTIVE',
      channel: row.channel || 'red social'
    });
    setOpenEdit(true);
  };

  const handleUpdateCustomer = async () => {
    if (!form.customerId) {
      enqueueSnackbar(t('customers.messages.missingCustomerId'), { variant: 'error' });
      return;
    }
    if (!form.customerFullname || !form.gender || !form.customerPhone || !form.customerMail || !form.channel) {
      enqueueSnackbar(t('customers.messages.required'), { variant: 'warning' });
      return;
    }

    const payload = {
      customerFullname: form.customerFullname,
      gender: form.gender,
      openingDate: form.openingDate || null,
      closeDate: form.closeDate || null,
      isReferered: Boolean(form.isReferered),
      refererBy: form.refererBy,
      customerPhone: form.customerPhone,
      customerMail: form.customerMail,
      customerStatus: form.customerStatus || 'INACTIVE',
      channel: form.channel
    };

    setSending(true);
    try {
      await lionTvApi.put(`/customers/v1/${form.customerId}`, payload, {
        headers: { Authorization: `Bearer ${accessToken}` },
        skipAuthRedirect: true
      });
      enqueueSnackbar(t('customers.messages.updated'), { variant: 'success' });
      setOpenEdit(false);
      resetForm();
      setRefreshKey((v) => v + 1);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || err.message || t('customers.messages.updateError'), {
          variant: 'error'
        });
      }
    } finally {
      setSending(false);
    }
  };

  const handleDeleteCustomer = async () => {
    const row = openDelete.row;
    if (!row?.customerId && !row?.id) {
      enqueueSnackbar(t('customers.messages.missingDeleteId'), { variant: 'error' });
      return;
    }
    const id = row.customerId || row.id;
    setSending(true);
    try {
      await lionTvApi.delete(`/customers/v1/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        skipAuthRedirect: true
      });
      enqueueSnackbar(t('customers.messages.deleted'), { variant: 'success' });
      setOpenDelete({ open: false, row: null });
      setRefreshKey((v) => v + 1);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || err.message || t('customers.messages.deleteError'), {
          variant: 'error'
        });
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 1400, mx: 'auto' }}>
      <MainCard
        title={t('customers.title')}
        secondary={
          <ResponsiveActionBar>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => setRefreshKey((v) => v + 1)}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                px: 2
              }}
            >
              {t('actions.refresh')}
            </Button>
            <Button
              variant="contained"
              startIcon={<PersonAddAlt1Icon />}
              onClick={() => setOpenCreate(true)}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                px: 2.5,
                boxShadow: '0 10px 24px rgba(0,0,0,0.12)'
              }}
              fullWidth={isMobile}
            >
              {t('actions.newCustomer')}
            </Button>
          </ResponsiveActionBar>
        }
      >
        <ResponsiveMetricGrid columns={{ xs: 1, md: 2, lg: 4 }}>
          {[
            {
              title: t('customers.title'),
              value: total,
              helper: t('customers.search', 'Search customers'),
              color: 'primary',
              icon: <PeopleAltIcon fontSize="small" />
            },
            {
              title: t('customers.status.ACTIVE'),
              value: summary.active,
              helper: t('customers.headers.status'),
              color: 'success',
              icon: <CheckCircleOutlineIcon fontSize="small" />
            },
            {
              title: t('customers.status.INACTIVE'),
              value: summary.inactive,
              helper: t('customers.headers.status'),
              color: 'default',
              icon: <BlockIcon fontSize="small" />
            },
            {
              title: t('customers.headers.referred'),
              value: summary.referred,
              helper: t('customers.form.fields.referredBy', 'Referral tracking'),
              color: 'secondary',
              icon: <ShareIcon fontSize="small" />
            }
          ].map((item, idx) => (
            <LionMetricCard {...item} key={idx} />
          ))}
        </ResponsiveMetricGrid>
      </MainCard>

      <MainCard
        title={t('customers.search')}
        secondary={
          <ResponsiveFilters
            paperSx={{
              width: { xs: '100%', sm: 560 }
            }}
          >
            <TextField
              size="small"
              placeholder={t('customers.search')}
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
              <InputLabel>{t('customers.headers.status')}</InputLabel>
              <Select
                value={statusFilter}
                label={t('customers.headers.status')}
                onChange={(e) => setStatusFilter(e.target.value)}
                renderValue={(val) => customerStatusLabel(val)}
                startAdornment={
                  <InputAdornment position="start">
                    <PeopleAltIcon fontSize="small" color="action" />
                  </InputAdornment>
                }
              >
                <MenuItem value="">
                  <em>{t('invoices.filters.all')}</em>
                </MenuItem>
                {[...new Set(rows.map((r) => r.status).filter(Boolean))].map((s) => (
                  <MenuItem key={s} value={s}>
                    {customerStatusLabel(s)}
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
                  <Skeleton key={`customer-mobile-${idx}`} variant="rounded" height={220} />
                ))}
              </Stack>
            ) : paginatedRows.length ? (
              <Stack spacing={1.5}>
                {paginatedRows.map((row) => (
                  <MobileSummaryCard
                    key={row.id || row.username || row.mail}
                    icon={
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: (theme) => theme.palette.secondary.light,
                          color: (theme) => theme.palette.secondary.dark,
                          fontWeight: 700
                        }}
                      >
                        {initialsFromName(row.fullName)}
                      </Avatar>
                    }
                    title={row.fullName || '-'}
                    subtitle={row.mail || '-'}
                    chips={[
                      <StatusChip key="status" status={row.status} />,
                      <Chip
                        key="gender"
                        size="small"
                        label={row.gender || '-'}
                        icon={row.gender === 'F' ? <FemaleIcon fontSize="small" /> : row.gender === 'M' ? <MaleIcon fontSize="small" /> : null}
                      />,
                      <Chip key="channel" size="small" variant="outlined" label={row.channel || '-'} />,
                      <VipTierChip key="vip" tierCode={vipSummaryByCustomerId[row.id || row.customerId]?.finalTierCode} />,
                      <LoyaltyPointsChip
                        key="loyalty"
                        points={loyaltySummaryByCustomerId[row.id || row.customerId]?.availablePoints}
                      />
                    ]}
                    actions={
                      <ResponsiveActionBar>
                        <Button size="small" variant="outlined" onClick={() => handleEdit(row)}>
                          {t('actions.edit')}
                        </Button>
                        <RowActions
                          row={row}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                          onWelcome={handleSendWelcome}
                          welcomeLoading={sendingWelcomeId === (row.customerId || row.id)}
                        />
                      </ResponsiveActionBar>
                    }
                  >
                    <MobileFieldGrid
                      fields={[
                        { label: t('customers.headers.phone'), value: row.phone || '-' },
                        { label: t('customers.headers.referred'), value: row.refererBy || (row.isReferred ? t('common.yes') : t('common.no')) },
                        { label: t('customers.headers.channel'), value: row.channel || '-' },
                        { label: t('customers.headers.gender'), value: row.gender || '-' },
                        { label: 'VIP', value: vipSummaryByCustomerId[row.id || row.customerId]?.finalTierCode || '-' },
                        { label: 'Puntos', value: loyaltySummaryByCustomerId[row.id || row.customerId]?.availablePoints || 0 }
                      ]}
                    />
                  </MobileSummaryCard>
                ))}
              </Stack>
            ) : (
              <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
                <Stack spacing={1} alignItems="center">
                  <Avatar sx={{ bgcolor: 'primary.lighter', color: 'primary.main' }}>
                    <PeopleAltIcon />
                  </Avatar>
                  <Typography variant="subtitle1">{t('customers.table.emptyTitle')}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('customers.table.emptyText')}
                  </Typography>
                  <Button variant="contained" onClick={() => setOpenCreate(true)} size="small" fullWidth>
                    {t('actions.newCustomer')}
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
              <Table size="small" sx={{ minWidth: { xs: 1080, md: '100%' } }}>
                <TableHead>
                  <TableRow
                    sx={(theme) => ({
                      bgcolor: theme.palette.surface.sunken,
                      borderBottom: `1px solid ${theme.palette.divider}`
                    })}
                  >
                    <TableCell>{t('customers.headers.customer')}</TableCell>
                    <TableCell>{t('customers.headers.email')}</TableCell>
                    <TableCell>{t('customers.headers.phone')}</TableCell>
                    <TableCell>{t('customers.headers.gender')}</TableCell>
                    <TableCell>{t('customers.headers.status')}</TableCell>
                    <TableCell>VIP</TableCell>
                    <TableCell>Puntos</TableCell>
                    <TableCell>{t('customers.headers.referred')}</TableCell>
                    <TableCell>{t('customers.headers.channel')}</TableCell>
                    <TableCell>{t('invoices.headers.actions')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedRows.map((row) => (
                    <TableRow
                      key={row.id || row.username || row.mail}
                      hover
                      sx={{
                        '&:nth-of-type(odd)': { bgcolor: 'background.default' },
                        transition: 'background 0.2s ease',
                        cursor: 'pointer'
                      }}
                    >
                      <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center">
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
                            {initialsFromName(row.fullName)}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2">{row.fullName || '-'}</Typography>
                            {row.refererBy ? (
                              <Typography variant="caption" color="text.secondary">
                                {t('customers.headers.referred')}: {row.refererBy}
                              </Typography>
                            ) : null}
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.75} alignItems="center">
                          <MailOutlineIcon fontSize="small" color="info" />
                          <Typography variant="body2">{row.mail || '-'}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.75} alignItems="center">
                          <Avatar
                            sx={{
                              width: 26,
                              height: 26,
                              bgcolor: 'grey.100',
                              color: 'text.secondary',
                              fontSize: 14,
                              fontWeight: 700
                            }}
                          >
                            {flagFromPhone(row.phone) || <PublicIcon fontSize="small" />}
                          </Avatar>
                          <Typography variant="body2">{row.phone || '-'}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          icon={
                            row.gender === 'F' ? (
                              <FemaleIcon fontSize="small" />
                            ) : row.gender === 'M' ? (
                              <MaleIcon fontSize="small" />
                            ) : null
                          }
                          label={row.gender || '-'}
                          sx={(theme) => ({
                            bgcolor:
                              row.gender === 'F'
                                ? theme.palette.secondary.lighter
                                : row.gender === 'M'
                                  ? theme.palette.primary.lighter
                                  : theme.palette.surface?.muted || theme.palette.background.paper,
                            color:
                              row.gender === 'F'
                                ? theme.palette.secondary.dark
                                : row.gender === 'M'
                                  ? theme.palette.primary.dark
                                  : theme.palette.text.secondary,
                            fontWeight: 600
                          })}
                        />
                      </TableCell>
                      <TableCell>
                        <StatusChip status={row.status} />
                      </TableCell>
                      <TableCell>
                        <VipTierChip tierCode={vipSummaryByCustomerId[row.id || row.customerId]?.finalTierCode} />
                      </TableCell>
                      <TableCell>
                        <LoyaltyPointsChip points={loyaltySummaryByCustomerId[row.id || row.customerId]?.availablePoints} />
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={
                            <Box
                              component="span"
                              sx={{
                                color: row.isReferred || row.refererBy ? '#0B1F3A !important' : isDarkMode ? '#F8FAFC !important' : 'inherit',
                                fontWeight: 700
                              }}
                            >
                              {row.isReferred || row.refererBy ? t('common.yes') : t('common.no')}
                            </Box>
                          }
                          sx={(theme) => {
                            const referred = row.isReferred || row.refererBy;
                            const darkMode = theme.palette.mode === 'dark';
                            const chipColor = referred ? '#0B1F3A' : darkMode ? '#F8FAFC' : theme.palette.text.secondary;

                            return {
                              bgcolor: referred ? (darkMode ? '#7DD3FC' : theme.palette.info.lighter) : theme.palette.surface?.muted || theme.palette.background.paper,
                              color: `${chipColor} !important`,
                              fontWeight: 700,
                              border: '1px solid',
                              borderColor: referred ? (darkMode ? '#38BDF8' : theme.palette.info.light) : theme.palette.divider,
                              '& .MuiChip-label': { color: `${chipColor} !important`, fontWeight: 700 },
                              '& .MuiChip-icon': { color: `${chipColor} !important` },
                              '& .MuiSvgIcon-root': { color: `${chipColor} !important` }
                            };
                          }}
                          icon={
                            <PeopleAltIcon
                              fontSize="small"
                              sx={{
                                color:
                                  row.isReferred || row.refererBy ? '#0B1F3A !important' : isDarkMode ? '#F8FAFC !important' : `${theme.palette.info.dark} !important`
                              }}
                            />
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          icon={
                            <ShareIcon
                              fontSize="small"
                              sx={{
                                color: isDarkMode ? '#FFFFFF !important' : `${theme.palette.info.darker} !important`
                              }}
                            />
                          }
                          label={
                            <Box component="span" sx={{ color: isDarkMode ? '#FFFFFF !important' : 'inherit', fontWeight: 700 }}>
                              {row.channel || '-'}
                            </Box>
                          }
                          sx={(theme) => {
                            const darkMode = theme.palette.mode === 'dark';
                            const channelColor = darkMode ? '#FFFFFF' : theme.palette.info.darker;
                            return {
                              bgcolor: darkMode ? 'rgba(2, 136, 209, 0.42)' : theme.palette.info.lighter,
                              color: `${channelColor} !important`,
                              border: '1px solid',
                              borderColor: darkMode ? 'rgba(125, 211, 252, 0.45)' : theme.palette.info.light,
                              fontWeight: 700,
                              '& .MuiChip-label': {
                                color: `${channelColor} !important`,
                                fontWeight: 700
                              },
                              '& .MuiChip-icon': {
                                color: `${channelColor} !important`
                              },
                              '& .MuiSvgIcon-root': {
                                color: `${channelColor} !important`
                              }
                            };
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <RowActions
                          row={row}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                          onWelcome={handleSendWelcome}
                          welcomeLoading={sendingWelcomeId === (row.customerId || row.id)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  {!loading && filteredRows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={10} align="center" sx={{ py: 6 }}>
                        <Stack spacing={1} alignItems="center">
                          <Avatar sx={{ bgcolor: 'primary.lighter', color: 'primary.main' }}>
                            <PeopleAltIcon />
                          </Avatar>
                          <Typography variant="subtitle1">{t('customers.table.emptyTitle')}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {t('customers.table.emptyText')}
                          </Typography>
                          <Button variant="contained" onClick={() => setOpenCreate(true)} size="small">
                            {t('actions.newCustomer')}
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )}
                  {loading && (
                    <TableRow>
                      <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                        <Stack spacing={1} alignItems="center">
                          <Skeleton variant="circular" width={40} height={40} />
                          <Typography variant="body2" color="text.secondary">
                            {t('customers.table.loading')}
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
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          }
          showDivider={!isMobile}
        />
      </MainCard>

      <Dialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        fullWidth
        maxWidth="md"
        fullScreen={isMobile}
        PaperProps={{
          sx: (theme) => ({
            borderRadius: 3,
            boxShadow: '0 18px 40px rgba(0,0,0,0.18)',
            border: '1px solid',
            borderColor: theme.palette.primary.light,
            backgroundImage: `linear-gradient(150deg, ${theme.vars.palette.surface.card} 0%, ${theme.vars.palette.surface.muted} 100%)`,
            ...theme.applyStyles('light', {
              backgroundImage: `linear-gradient(150deg, ${theme.vars.palette.primary.light}18 0%, ${theme.vars.palette.secondary.light}08 40%, ${theme.vars.palette.background.paper} 100%)`
            })
          })
        }}
      >
        <DialogTitleWithClose
          onClose={() => setOpenCreate(false)}
          sx={(theme) => ({
            pb: 1,
            background: `linear-gradient(135deg, ${theme.vars.palette.primary.main}33 0%, ${theme.vars.palette.secondary.main}1F 45%, ${theme.vars.palette.surface.card} 100%)`
          })}
        >
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Avatar
              sx={{
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                width: 40,
                height: 40,
                boxShadow: 3
              }}
            >
              <PersonAddAlt1Icon fontSize="small" />
            </Avatar>
            <Box>
              <Typography variant="h6">{t('customers.form.createTitle')}</Typography>
              <Typography variant="caption" color="text.secondary">
                {t('customers.form.createSubtitle')}
              </Typography>
            </Box>
            <Chip
              label={t('customers.badge.new')}
              size="small"
              color="primary"
              variant="filled"
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
            position: 'relative',
            background: (theme) =>
              `linear-gradient(180deg, ${theme.vars.palette.surface.card} 0%, ${theme.vars.palette.surface.muted} 80%)`,
            ...theme.applyStyles('light', {
              background: `linear-gradient(180deg, ${theme.vars.palette.primary.light}18 0%, ${theme.vars.palette.secondary.light}10 50%, ${theme.vars.palette.background.paper} 80%)`
            }),
            '&:before': {
              content: '\"\"',
              position: 'absolute',
              inset: 12,
              zIndex: 0,
              borderRadius: 20,
              background:
                'radial-gradient(circle at 20% 20%, rgba(33,150,243,0.10), transparent 45%), radial-gradient(circle at 80% 0%, rgba(156,39,176,0.10), transparent 35%)'
            }
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1, position: 'relative', zIndex: 1 }}>
            <Chip
              icon={<AutoAwesomeIcon fontSize="small" color="warning" />}
              label={t('customers.badge.new')}
              color="primary"
              variant="outlined"
              sx={{ fontWeight: 700, borderRadius: 1.5, boxShadow: 1 }}
            />
            <Typography variant="caption" color="text.secondary">
              {t('customers.form.tone.create', 'Add personality: complete data helps your team.')}
            </Typography>
          </Stack>
          <Box
            sx={{
              mb: 2,
              p: 2,
              borderRadius: 2,
              background: (theme) =>
                `linear-gradient(135deg, ${theme.palette.primary.light}22, ${theme.palette.secondary.light}1A)`
            }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              {t('customers.form.createTitle')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('customers.form.createSubtitle')}
            </Typography>
          </Box>
          <Box
            sx={(theme) => ({
              mb: 2,
              p: 1.25,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              bgcolor: theme.palette.info.lighter,
              color: theme.palette.info.dark,
              border: '1px dashed',
              borderColor: theme.palette.info.main
            })}
          >
              <InfoOutlinedIcon fontSize="small" />
              <Typography variant="caption">{t('customers.tips.new')}</Typography>
          </Box>

          <Stack spacing={2}>
            <FormSection title={t('customers.form.sections.identification')} helper={t('customers.form.sections.identificationHelper')}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4} md={4}>
                  <TextField
                    required
                    label={t('customers.form.name')}
                    value={form.customerFullname}
                    onChange={handleFormChange('customerFullname')}
                    fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonAddAlt1Icon fontSize="small" color="secondary" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4} md={4}>
                  <FormControl fullWidth required sx={fieldSx}>
                    <InputLabel>{t('customers.form.gender')}</InputLabel>
                    <Select
                      value={form.gender}
                      label={t('customers.form.gender')}
                      onChange={handleFormChange('gender')}
                      startAdornment={
                        <InputAdornment position="start">
                          <WcIcon fontSize="small" color="primary" />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="M">{t('customers.form.states.male')}</MenuItem>
                      <MenuItem value="F">{t('customers.form.states.female')}</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={4} md={4}>
                  <FormControl fullWidth required sx={fieldSx}>
                    <InputLabel>{t('customers.form.status')}</InputLabel>
                    <Select
                      value={form.customerStatus}
                      label={t('customers.form.status')}
                      onChange={handleFormChange('customerStatus')}
                      startAdornment={
                        <InputAdornment position="start">
                          <SignalCellularAltIcon fontSize="small" color="warning" />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="ACTIVE">{t('customers.form.states.active')}</MenuItem>
                      <MenuItem value="INACTIVE">{t('customers.form.states.inactive')}</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
               
              </Grid>
            </FormSection>

            <FormSection title={t('customers.form.sections.contact')} helper={t('customers.form.sections.contactHelper')}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    label={t('customers.form.email')}
                    type="email"
                    value={form.customerMail}
                    onChange={handleFormChange('customerMail')}
                    fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MailOutlineIcon fontSize="small" color="info" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    label={t('customers.form.phone')}
                    value={form.customerPhone}
                    onChange={handleFormChange('customerPhone')}
                    fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIphoneIcon fontSize="small" color="success" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={2.5}>
                  <FormControl fullWidth required sx={fieldSx}>
                    <InputLabel>{t('customers.form.channel')}</InputLabel>
                    <Select
                      value={form.channel}
                      label={t('customers.form.channel')}
                      onChange={handleFormChange('channel')}
                      startAdornment={
                        <InputAdornment position="start">
                          <ShareIcon fontSize="small" color="info" />
                        </InputAdornment>
                      }
                    >
                      {channelOptions.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </FormSection>

            <FormSection title={t('customers.form.sections.dates')} helper={t('customers.form.sections.datesHelper')}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label={t('customers.form.opening')}
                    type="date"
                    value={form.openingDate}
                    onChange={handleFormChange('openingDate')}
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
                <Grid item xs={12} md={6}>
                  <TextField
                    label={t('customers.form.closing')}
                    type="date"
                    value={form.closeDate}
                    onChange={handleFormChange('closeDate')}
                    fullWidth
                    sx={fieldSx}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarMonthIcon fontSize="small" color="warning" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
              </Grid>
            </FormSection>

            <FormSection title={t('customers.form.sections.referred')} helper={t('customers.form.sections.referredHelper')}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    control={<Switch checked={form.isReferered} onChange={handleFormChange('isReferered')} />}
                    label={t('customers.form.referredToggle')}
                  />
                </Grid>
                <Grid item xs={12} md={8}>
                  <FormControl
                    fullWidth
                    disabled={!form.isReferered || referersLoading || referers.length === 0}
                    sx={fieldSx}
                  >
                    <InputLabel>{t('customers.form.referredBy')}</InputLabel>
                    <Select
                      value={form.refererBy}
                      label={t('customers.form.referredBy')}
                      onChange={handleFormChange('refererBy')}
                      startAdornment={
                        <InputAdornment position="start">
                          <Diversity1Icon fontSize="small" color="info" />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="">
                        <em>{t('customers.form.placeholderSelect')}</em>
                      </MenuItem>
                      {referers.length === 0 ? (
                        <MenuItem value="" disabled>
                          {t('customers.form.noReferrers')}
                        </MenuItem>
                      ) : (
                        referers.map((c) => (
                          <MenuItem key={c.id || c.mail || c.username} value={c.fullName || c.username || c.mail}>
                            {c.fullName || c.username || c.mail}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                    <FormHelperText>
                      {referersLoading
                        ? t('customers.form.helperLoading')
                        : !form.isReferered
                          ? t('customers.form.helperOff')
                          : referers.length === 0
                            ? t('customers.form.helperNone')
                            : t('customers.form.helperPick')}
                    </FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
            </FormSection>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1, position: 'relative', zIndex: 1 }}>
          <Button variant="outlined" onClick={resetForm} disabled={sending} sx={{ borderRadius: 2 }} startIcon={<RefreshIcon />}>
            {t('customers.form.buttons.clear')}
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateCustomer}
            disabled={sending}
            startIcon={<RocketLaunchIcon />}
            sx={{
              borderRadius: 2,
              boxShadow: '0 12px 28px rgba(0,0,0,0.16)',
              px: 2.4
            }}
          >
            {sending ? t('customers.form.buttons.creating') : t('customers.form.buttons.create')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        fullWidth
        maxWidth="md"
        fullScreen={isMobile}
        PaperProps={{
          sx: (theme) => ({
            borderRadius: 3,
            boxShadow: '0 18px 40px rgba(0,0,0,0.18)',
            border: '1px solid',
            borderColor: theme.palette.warning.light,
            backgroundImage: `linear-gradient(155deg, ${theme.vars.palette.surface.card} 0%, ${theme.vars.palette.surface.muted} 100%)`,
            ...theme.applyStyles('light', {
              backgroundImage: `linear-gradient(155deg, ${theme.vars.palette.warning.light}18 0%, ${theme.vars.palette.secondary.light}08 40%, ${theme.vars.palette.background.paper} 100%)`
            })
          })
        }}
      >
        <DialogTitleWithClose
          onClose={() => setOpenEdit(false)}
          sx={(theme) => ({
            pb: 1,
            background: `linear-gradient(135deg, ${theme.vars.palette.warning.main}33 0%, ${theme.vars.palette.secondary.main}1F 45%, ${theme.vars.palette.surface.card} 100%)`
          })}
        >
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Avatar
              sx={{
                bgcolor: 'warning.main',
                color: 'warning.contrastText',
                width: 40,
                height: 40,
                boxShadow: 3
              }}
            >
              <EditOutlinedIcon fontSize="small" />
            </Avatar>
            <Box>
              <Typography variant="h6">{t('customers.form.editTitle')}</Typography>
              <Typography variant="caption" color="text.secondary">
                {t('customers.form.editSubtitle')}
              </Typography>
            </Box>
            <Chip
              label={t('customers.badge.edit')}
              size="small"
              color="warning"
              variant="filled"
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
            position: 'relative',
            background: (theme) =>
              `linear-gradient(180deg, ${theme.vars.palette.surface.card} 0%, ${theme.vars.palette.surface.muted} 80%)`,
            ...theme.applyStyles('light', {
              background: `linear-gradient(180deg, ${theme.vars.palette.warning.light}18 0%, ${theme.vars.palette.secondary.light}12 55%, ${theme.vars.palette.background.paper} 80%)`
            }),
            '&:before': {
              content: '\"\"',
              position: 'absolute',
              inset: 12,
              zIndex: 0,
              borderRadius: 20,
              background:
                'radial-gradient(circle at 15% 15%, rgba(255,193,7,0.14), transparent 40%), radial-gradient(circle at 90% 5%, rgba(156,39,176,0.10), transparent 35%)'
            }
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1, position: 'relative', zIndex: 1 }}>
            <Chip
              icon={<AutoAwesomeIcon fontSize="small" color="warning" />}
              label={t('customers.badge.edit')}
              color="warning"
              variant="outlined"
              sx={{ fontWeight: 700, borderRadius: 1.5, boxShadow: 1 }}
            />
            <Typography variant="caption" color="text.secondary">
              {t('customers.form.tone.edit', 'Adjust key data and confirm before saving.')}
            </Typography>
          </Stack>
          <Box
            sx={{
              mb: 2,
              p: 2,
              borderRadius: 2,
              background: (theme) =>
                `linear-gradient(135deg, ${theme.palette.warning.light}22, ${theme.palette.secondary.light}18)`
            }}
          >
              <Typography variant="subtitle2" color="text.secondary">
                {t('customers.form.editTitle')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('customers.form.editSubtitle')}
              </Typography>
          </Box>
          <Box
            sx={(theme) => ({
              mb: 2,
              p: 1.25,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              bgcolor: theme.palette.info.lighter,
              color: theme.palette.info.dark,
              border: '1px dashed',
              borderColor: theme.palette.info.main
            })}
          >
            <InfoOutlinedIcon fontSize="small" />
            <Typography variant="caption">{t('customers.tips.edit')}</Typography>
          </Box>
          {/* Reuso el mismo formulario */}
          <Stack spacing={2}>
            <FormSection
              title={t('customers.form.sections.identification')}
              helper={t('customers.form.sections.identificationHelper')}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={3} md={3}>
                  <TextField
                    required
                    label={t('customers.form.name')}
                    value={form.customerFullname}
                    onChange={handleFormChange('customerFullname')}
                    fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonAddAlt1Icon fontSize="small" color="secondary" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={3} md={3}>
                  <FormControl fullWidth required sx={fieldSx}>
                    <InputLabel>{t('customers.form.gender')}</InputLabel>
                    <Select
                      value={form.gender}
                      label={t('customers.form.gender')}
                      onChange={handleFormChange('gender')}
                      startAdornment={
                        <InputAdornment position="start">
                          <WcIcon fontSize="small" color="primary" />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="M">{t('customers.form.states.male')}</MenuItem>
                      <MenuItem value="F">{t('customers.form.states.female')}</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3} md={3}>
                  <FormControl fullWidth required sx={fieldSx}>
                    <InputLabel>{t('customers.form.status')}</InputLabel>
                    <Select
                      value={form.customerStatus}
                      label={t('customers.form.status')}
                      onChange={handleFormChange('customerStatus')}
                      startAdornment={
                        <InputAdornment position="start">
                          <SignalCellularAltIcon fontSize="small" color="warning" />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="ACTIVE">{t('customers.form.states.active')}</MenuItem>
                      <MenuItem value="INACTIVE">{t('customers.form.states.inactive')}</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3} md={3}>
                  <FormControl fullWidth required sx={fieldSx}>
                    <InputLabel>{t('customers.form.channel')}</InputLabel>
                    <Select
                      value={form.channel}
                      label={t('customers.form.channel')}
                      onChange={handleFormChange('channel')}
                      startAdornment={
                        <InputAdornment position="start">
                          <ShareIcon fontSize="small" color="info" />
                        </InputAdornment>
                      }
                    >
                      {channelOptions.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </FormSection>

            <FormSection title={t('customers.form.sections.contact')} helper={t('customers.form.sections.contactHelper')}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    label={t('customers.form.email')}
                    type="email"
                    value={form.customerMail}
                    onChange={handleFormChange('customerMail')}
                    fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MailOutlineIcon fontSize="small" color="info" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    label={t('customers.form.phone')}
                    value={form.customerPhone}
                    onChange={handleFormChange('customerPhone')}
                    fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIphoneIcon fontSize="small" color="success" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
              </Grid>
            </FormSection>

            <FormSection title={t('customers.form.sections.dates')} helper={t('customers.form.sections.datesHelper')}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label={t('customers.form.opening')}
                    type="date"
                    value={form.openingDate}
                    onChange={handleFormChange('openingDate')}
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
                <Grid item xs={12} md={6}>
                  <TextField
                    label={t('customers.form.closing')}
                    type="date"
                    value={form.closeDate}
                    onChange={handleFormChange('closeDate')}
                    fullWidth
                    sx={fieldSx}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarMonthIcon fontSize="small" color="warning" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
              </Grid>
            </FormSection>

            <FormSection title={t('customers.form.sections.referred')} helper={t('customers.form.sections.referredHelper')}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    control={<Switch checked={form.isReferered} onChange={handleFormChange('isReferered')} />}
                    label={t('customers.form.referredToggle')}
                  />
                </Grid>
                <Grid item xs={12} md={8}>
                  <FormControl
                    fullWidth
                    disabled={!form.isReferered || referersLoading || referers.length === 0}
                    sx={fieldSx}
                  >
                    <InputLabel>{t('customers.form.referredBy')}</InputLabel>
                    <Select
                      value={form.refererBy}
                      label={t('customers.form.referredBy')}
                      onChange={handleFormChange('refererBy')}
                    >
                      <MenuItem value="">
                        <em>{t('customers.form.placeholderSelect')}</em>
                      </MenuItem>
                      {referers.length === 0 ? (
                        <MenuItem value="" disabled>
                          {t('customers.form.noReferrers')}
                        </MenuItem>
                      ) : (
                        referers.map((c) => (
                          <MenuItem key={c.id || c.mail || c.username} value={c.fullName || c.username || c.mail}>
                            {c.fullName || c.username || c.mail}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                    <FormHelperText>
                      {referersLoading
                        ? t('customers.form.helperLoading')
                        : !form.isReferered
                          ? t('customers.form.helperOff')
                          : referers.length === 0
                            ? t('customers.form.helperNone')
                            : t('customers.form.helperPick')}
                    </FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
            </FormSection>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1, position: 'relative', zIndex: 1 }}>
          <Button variant="outlined" onClick={resetForm} disabled={sending} sx={{ borderRadius: 2 }} startIcon={<RefreshIcon />}>
            {t('customers.form.buttons.clear')}
          </Button>
          <Button
            variant="contained"
            onClick={handleUpdateCustomer}
            disabled={sending}
            startIcon={<RocketLaunchIcon />}
            sx={{ borderRadius: 2, boxShadow: '0 12px 28px rgba(0,0,0,0.16)', px: 2.4 }}
          >
            {sending ? t('customers.form.buttons.saving') : t('customers.form.buttons.save')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDelete.open}
        onClose={() => setOpenDelete({ open: false, row: null })}
        maxWidth="xs"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: (theme) => ({
            borderRadius: 3,
            boxShadow: '0 18px 40px rgba(0,0,0,0.2)',
            border: '1px solid',
            borderColor: theme.palette.error.light,
            backgroundImage: `linear-gradient(160deg, ${theme.vars.palette.surface.card} 0%, ${theme.vars.palette.surface.muted} 100%)`,
            ...theme.applyStyles('light', {
              backgroundImage: `linear-gradient(160deg, ${theme.vars.palette.error.light}20 0%, ${theme.vars.palette.secondary.light}08 50%, ${theme.vars.palette.background.paper} 100%)`
            })
          })
        }}
      >
        <DialogTitleWithClose
          onClose={() => setOpenDelete({ open: false, row: null })}
          sx={(theme) => ({
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            background: `linear-gradient(135deg, ${theme.vars.palette.error.main}38 0%, ${theme.vars.palette.secondary.main}1A 60%, ${theme.vars.palette.surface.card} 100%)`
          })}
        >
          <Avatar sx={{ bgcolor: 'error.main', color: 'error.contrastText', width: 40, height: 40, boxShadow: 3 }}>
            <WarningAmberIcon fontSize="small" />
          </Avatar>
          <Box>
            <Typography variant="h6">{t('customers.form.deleteTitle')}</Typography>
            <Typography variant="caption" color="text.secondary">
              {t('customers.form.deleteSubtitle')}
            </Typography>
          </Box>
        </DialogTitleWithClose>
        <DialogContent dividers>
            <Stack spacing={1.25}>
              <Box
                sx={(theme) => ({
                  p: 1.25,
                  borderRadius: 2,
                  border: '1px dashed',
                  borderColor: theme.palette.error.light,
                  bgcolor: theme.palette.error.lighter,
                  color: theme.palette.error.dark,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                })}
              >
                <WarningAmberIcon fontSize="small" color="error" />
                <Typography variant="body2" fontWeight={700}>
                  {t('customers.form.deleteTitle')}
                </Typography>
              </Box>
              <Typography variant="body2">
                {t('customers.form.deleteBody', {
                  name: openDelete.row?.fullName || openDelete.row?.username || openDelete.row?.mail || t('customers.form.buttons.delete')
                })}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('customers.form.deleteSubtitle')}
              </Typography>
            </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setOpenDelete({ open: false, row: null })} disabled={sending} sx={{ borderRadius: 2 }} startIcon={<RefreshIcon />}>
            {t('customers.form.buttons.cancel')}
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleDeleteCustomer}
            disabled={sending}
            startIcon={<DeleteOutlineIcon />}
            sx={{ borderRadius: 2, boxShadow: '0 12px 28px rgba(0,0,0,0.18)' }}
          >
            {sending ? t('customers.form.buttons.deleting') : t('customers.form.buttons.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
