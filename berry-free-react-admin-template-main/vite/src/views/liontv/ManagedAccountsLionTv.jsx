import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import useAuth from 'hooks/useAuth';

import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import LinearProgress from '@mui/material/LinearProgress';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { withAlpha } from 'utils/colorUtils';

import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import HubOutlinedIcon from '@mui/icons-material/HubOutlined';

import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { lionTvApi } from 'utils/api';

const providerStatusOptions = ['ACTIVE', 'INACTIVE'];
const accountStatusOptions = ['ACTIVE', 'SUSPENDED', 'EXPIRED', 'PENDING', 'CANCELLED'];
const retryModes = ['FORWARD_ALL', 'FORWARD_SUMMARY', 'FORWARD_EXTRACTED_TEXT', 'STORE_ONLY'];

const defaultProviderForm = { id: null, code: '', name: '', description: '' };
const defaultAccountForm = {
  id: null,
  accountCode: '',
  displayName: '',
  providerId: '',
  customerId: '',
  principalReference: '',
  aliasEmail: '',
  expirationDate: '',
  renewalDate: '',
  accountStatus: 'ACTIVE',
  allowDistribution: true,
  notes: ''
};
const defaultInboundForm = {
  mailboxAccount: 'principal@gmail.com',
  rawMessageId: '',
  gmailMessageId: '',
  internetMessageId: '',
  fromEmail: '',
  toEmail: 'principal@gmail.com',
  subject: '',
  bodyPlain: '',
  bodyHtml: '',
  rawHeaders: '',
  receivedAt: new Date().toISOString().slice(0, 16)
};

const cardGlassSx = (theme) => ({
  borderRadius: 2.5,
  border: '1px solid',
  borderColor: 'divider',
  boxShadow: '0 10px 26px rgba(18, 38, 63, 0.08)',
  background:
    theme.palette.mode === 'light'
      ? `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${withAlpha(theme.palette.primary.light, 0.11)} 46%, ${withAlpha(theme.palette.success.light, 0.08)} 100%)`
      : theme.palette.surface.sunken
});

const modalPaperSx = (theme) => ({
  borderRadius: 3,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: '0 24px 60px rgba(16, 24, 40, 0.2)',
  overflow: 'hidden'
});

const modalHeaderSx = (theme) => ({
  px: 3,
  py: 2.2,
  borderBottom: `1px solid ${theme.palette.divider}`,
  background:
    theme.palette.mode === 'light'
      ? `linear-gradient(135deg, ${withAlpha(theme.palette.primary.light, 0.2)} 0%, ${withAlpha(theme.palette.info.light, 0.1)} 100%)`
      : withAlpha(theme.palette.background.paper, 0.9)
});

const modalContentSx = {
  px: 3,
  py: 2.5
};

const modalActionsSx = (theme) => ({
  px: 3,
  py: 2,
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: withAlpha(theme.palette.background.default, 0.6)
});

const modalSectionSx = (theme) => ({
  p: 2,
  borderRadius: 2,
  border: `1px solid ${theme.palette.divider}`,
  background:
    theme.palette.mode === 'light'
      ? `linear-gradient(180deg, ${withAlpha(theme.palette.primary.light, 0.06)} 0%, ${withAlpha(theme.palette.background.paper, 0.9)} 100%)`
      : withAlpha(theme.palette.background.paper, 0.5)
});

const fieldSx = {
  '& .MuiInputBase-root': {
    borderRadius: 1.8
  },
  '& .MuiInputLabel-root': {
    fontWeight: 500
  }
};

function unwrap(res) {
  return res?.data?.data ?? res?.data ?? null;
}

function statusColor(status) {
  const value = String(status || '').toUpperCase();
  if (['ACTIVE', 'SENT', 'DISTRIBUTED', 'PROCESSED'].includes(value)) return 'success';
  if (['FAILED', 'EXPIRED', 'CANCELLED'].includes(value)) return 'error';
  if (['PENDING', 'ALIAS_RESOLVED', 'ACCOUNT_MATCHED', 'RECEIVED', 'SUSPENDED'].includes(value)) return 'warning';
  if (['IGNORED'].includes(value)) return 'default';
  return 'info';
}

function parseDateValue(value) {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;

  const raw = String(value).trim();
  if (!raw) return null;

  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    const date = new Date(`${raw}T00:00:00`);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(value) {
  const date = parseDateValue(value);
  if (!date) return '-';
  return date.toLocaleDateString('es-HN');
}

function formatDateTime(value) {
  const date = parseDateValue(value);
  if (!date) return '-';
  return date.toLocaleString('es-HN');
}

function daysUntil(dateValue) {
  const target = parseDateValue(dateValue);
  if (!target) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(target);
  due.setHours(0, 0, 0, 0);

  return Math.round((due.getTime() - today.getTime()) / 86400000);
}

function expirationMeta(expirationDate) {
  const days = daysUntil(expirationDate);

  if (days === null) {
    return { days: null, label: 'Sin fecha', chipColor: 'default', rank: 5 };
  }
  if (days < 0) {
    return { days, label: `Vencida hace ${Math.abs(days)}d`, chipColor: 'error', rank: 0 };
  }
  if (days === 0) {
    return { days, label: 'Vence hoy', chipColor: 'error', rank: 1 };
  }
  if (days <= 7) {
    return { days, label: `Vence en ${days}d`, chipColor: 'warning', rank: 2 };
  }
  if (days <= 30) {
    return { days, label: `Vence en ${days}d`, chipColor: 'info', rank: 3 };
  }
  return { days, label: `Vence en ${days}d`, chipColor: 'success', rank: 4 };
}

function MetricCard({ title, value, helper, color = 'primary', icon }) {
  return (
    <Card sx={(theme) => cardGlassSx(theme)}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1.5}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {title}
            </Typography>
            <Typography variant="h2" sx={{ mt: 0.75 }}>
              {value}
            </Typography>
            {helper ? (
              <Typography variant="caption" color="text.secondary">
                {helper}
              </Typography>
            ) : null}
          </Box>
          <Avatar
            variant="rounded"
            sx={(theme) => ({
              width: 46,
              height: 46,
              bgcolor: theme.palette[color]?.lighter || theme.palette.primary.lighter,
              color: theme.palette[color]?.main || theme.palette.primary.main
            })}
          >
            {icon}
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function ManagedAccountsLionTv() {
  const { accessToken } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);

  const [providers, setProviders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [events, setEvents] = useState([]);

  const [inboundSummary, setInboundSummary] = useState(null);
  const [distributionSummary, setDistributionSummary] = useState(null);
  const [providerSummary, setProviderSummary] = useState([]);
  const [aliasSummary, setAliasSummary] = useState([]);

  const [providerSearch, setProviderSearch] = useState('');
  const [accountSearch, setAccountSearch] = useState('');
  const [accountStatusFilter, setAccountStatusFilter] = useState('ALL');
  const [accountProviderFilter, setAccountProviderFilter] = useState('ALL');
  const [accountExpiryFilter, setAccountExpiryFilter] = useState('ALL');
  const [accountDistributionFilter, setAccountDistributionFilter] = useState('ALL');
  const [eventSearch, setEventSearch] = useState('');
  const [eventStatusFilter, setEventStatusFilter] = useState('ALL');

  const [providerPage, setProviderPage] = useState(0);
  const [providerRowsPerPage, setProviderRowsPerPage] = useState(10);
  const [accountPage, setAccountPage] = useState(0);
  const [accountRowsPerPage, setAccountRowsPerPage] = useState(10);
  const [eventPage, setEventPage] = useState(0);
  const [eventRowsPerPage, setEventRowsPerPage] = useState(10);

  const [providerModalOpen, setProviderModalOpen] = useState(false);
  const [providerForm, setProviderForm] = useState(defaultProviderForm);
  const [providerSaving, setProviderSaving] = useState(false);

  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [accountForm, setAccountForm] = useState(defaultAccountForm);
  const [accountSaving, setAccountSaving] = useState(false);

  const [inboundForm, setInboundForm] = useState(defaultInboundForm);
  const [inboundProcessing, setInboundProcessing] = useState(false);
  const [lastProcessResult, setLastProcessResult] = useState(null);
  const [retryModeById, setRetryModeById] = useState({});

  const headers = useMemo(() => ({ Authorization: `Bearer ${accessToken}` }), [accessToken]);

  const onError = useCallback(
    (error, fallback) => {
      if ((error?.response?.status || error?.request?.status) === 401) return;
      enqueueSnackbar(error?.response?.data?.message || error?.message || fallback, { variant: 'error' });
    },
    [enqueueSnackbar]
  );

  const loadProviders = useCallback(async () => {
    const res = await lionTvApi.get('/providers/v1', { headers, params: { index: 0, size: 300 }, skipAuthRedirect: true });
    const payload = unwrap(res) || {};
    setProviders(Array.isArray(payload.data) ? payload.data : []);
  }, [headers]);

  const loadAccounts = useCallback(async () => {
    const res = await lionTvApi.get('/managed-accounts/v1', { headers, params: { index: 0, size: 500 }, skipAuthRedirect: true });
    const payload = unwrap(res) || {};
    setAccounts(Array.isArray(payload.data) ? payload.data : []);
  }, [headers]);

  const loadCustomers = useCallback(async () => {
    const res = await lionTvApi.get('/customers/v1', { headers, params: { index: 0, size: 5000 }, skipAuthRedirect: true });
    const payload = unwrap(res) || {};
    const rows = Array.isArray(payload.data) ? payload.data : [];
    const normalized = rows.map((row) => ({
      customerId: row.customerId || row.customer_id || row.id,
      customerFullname: row.customerFullname || row.customer_fullname || row.displayName || row.name || ''
    }));
    setCustomers(normalized);
  }, [headers]);

  const loadEvents = useCallback(async () => {
    const res = await lionTvApi.get('/inbound-emails/v1', { headers, params: { index: 0, size: 200 }, skipAuthRedirect: true });
    const payload = unwrap(res) || {};
    setEvents(Array.isArray(payload.data) ? payload.data : []);
  }, [headers]);

  const loadReports = useCallback(async () => {
    const responses = await Promise.allSettled([
      lionTvApi.get('/reports/v1/inbound-emails/summary', { headers, skipAuthRedirect: true }),
      lionTvApi.get('/reports/v1/distribution/summary', { headers, skipAuthRedirect: true }),
      lionTvApi.get('/reports/v1/inbound-emails/by-provider', { headers, skipAuthRedirect: true }),
      lionTvApi.get('/reports/v1/inbound-emails/by-alias', { headers, skipAuthRedirect: true })
    ]);

    setInboundSummary(responses[0].status === 'fulfilled' ? unwrap(responses[0].value) : null);
    setDistributionSummary(responses[1].status === 'fulfilled' ? unwrap(responses[1].value) : null);
    setProviderSummary(responses[2].status === 'fulfilled' && Array.isArray(unwrap(responses[2].value)) ? unwrap(responses[2].value) : []);
    setAliasSummary(responses[3].status === 'fulfilled' && Array.isArray(unwrap(responses[3].value)) ? unwrap(responses[3].value) : []);
  }, [headers]);

  const reload = useCallback(async () => {
    if (!accessToken) return;

    setLoading(true);
    try {
      if (tab === 0) {
        await Promise.all([loadProviders(), loadAccounts(), loadCustomers(), loadEvents()]);
      }
      if (tab === 1) {
        await Promise.all([loadProviders(), loadAccounts(), loadCustomers()]);
      }
      if (tab === 2) {
        await loadProviders();
      }
      if (tab === 3) {
        await Promise.all([loadEvents(), loadAccounts()]);
      }
      if (tab === 4) {
        await Promise.all([loadReports(), loadAccounts()]);
      }
    } catch (error) {
      onError(error, 'No se pudo cargar el módulo');
    } finally {
      setLoading(false);
    }
  }, [accessToken, tab, loadProviders, loadAccounts, loadCustomers, loadEvents, loadReports, onError]);

  useEffect(() => {
    reload();
  }, [reload]);

  useEffect(() => {
    setAccountPage(0);
  }, [accountSearch, accountStatusFilter, accountProviderFilter, accountExpiryFilter, accountDistributionFilter]);

  useEffect(() => {
    setProviderPage(0);
  }, [providerSearch]);

  useEffect(() => {
    setEventPage(0);
  }, [eventSearch, eventStatusFilter]);

  const saveProvider = async () => {
    if (!providerForm.code || !providerForm.name) {
      enqueueSnackbar('Code y Name son requeridos', { variant: 'warning' });
      return;
    }

    setProviderSaving(true);
    try {
      const payload = {
        code: providerForm.code,
        name: providerForm.name,
        description: providerForm.description || null
      };

      if (providerForm.id) {
        await lionTvApi.put(`/providers/v1/${providerForm.id}`, payload, { headers, skipAuthRedirect: true });
      } else {
        await lionTvApi.post('/providers/v1', payload, { headers, skipAuthRedirect: true });
      }

      setProviderModalOpen(false);
      setProviderForm(defaultProviderForm);
      enqueueSnackbar('Provider guardado', { variant: 'success' });
      await loadProviders();
    } catch (error) {
      onError(error, 'No se pudo guardar provider');
    } finally {
      setProviderSaving(false);
    }
  };

  const patchProviderStatus = async (id, status) => {
    try {
      await lionTvApi.patch(`/providers/v1/${id}/status`, { status }, { headers, skipAuthRedirect: true });
      await loadProviders();
    } catch (error) {
      onError(error, 'No se pudo cambiar estado del provider');
    }
  };

  const saveAccount = async () => {
    if (
      !accountForm.accountCode ||
      !accountForm.displayName ||
      !accountForm.providerId ||
      !accountForm.customerId ||
      !accountForm.aliasEmail ||
      !accountForm.expirationDate
    ) {
      enqueueSnackbar('Completa campos obligatorios', { variant: 'warning' });
      return;
    }

    setAccountSaving(true);
    try {
      const payload = {
        accountCode: accountForm.accountCode,
        displayName: accountForm.displayName,
        providerId: Number(accountForm.providerId),
        customerId: Number(accountForm.customerId),
        principalReference: accountForm.principalReference || null,
        aliasEmail: accountForm.aliasEmail,
        expirationDate: accountForm.expirationDate,
        renewalDate: accountForm.renewalDate || null,
        accountStatus: accountForm.accountStatus,
        allowDistribution: Boolean(accountForm.allowDistribution),
        notes: accountForm.notes || null
      };

      if (accountForm.id) {
        await lionTvApi.put(`/managed-accounts/v1/${accountForm.id}`, payload, { headers, skipAuthRedirect: true });
      } else {
        await lionTvApi.post('/managed-accounts/v1', payload, { headers, skipAuthRedirect: true });
      }

      setAccountModalOpen(false);
      setAccountForm(defaultAccountForm);
      enqueueSnackbar('Cuenta guardada', { variant: 'success' });
      await loadAccounts();
    } catch (error) {
      onError(error, 'No se pudo guardar cuenta gestionada');
    } finally {
      setAccountSaving(false);
    }
  };

  const patchAccountStatus = async (id, status) => {
    try {
      await lionTvApi.patch(`/managed-accounts/v1/${id}/status`, { status }, { headers, skipAuthRedirect: true });
      await loadAccounts();
    } catch (error) {
      onError(error, 'No se pudo cambiar estado de la cuenta');
    }
  };

  const patchDistribution = async (id, allowDistribution) => {
    try {
      await lionTvApi.patch(`/managed-accounts/v1/${id}/distribution`, { allowDistribution }, { headers, skipAuthRedirect: true });
      await loadAccounts();
    } catch (error) {
      onError(error, 'No se pudo cambiar distribución');
    }
  };

  const processInbound = async () => {
    if (!inboundForm.mailboxAccount || !inboundForm.rawMessageId || !inboundForm.fromEmail || !inboundForm.receivedAt) {
      enqueueSnackbar('mailboxAccount, rawMessageId, fromEmail y receivedAt son obligatorios', { variant: 'warning' });
      return;
    }

    setInboundProcessing(true);
    try {
      const payload = {
        ...inboundForm,
        receivedAt: inboundForm.receivedAt.includes('T') ? inboundForm.receivedAt : inboundForm.receivedAt.replace(' ', 'T')
      };
      const res = await lionTvApi.post('/internal/inbound-emails/v1/process', payload, { headers, skipAuthRedirect: true });
      setLastProcessResult(unwrap(res));
      enqueueSnackbar('Inbound procesado', { variant: 'success' });
      await loadEvents();
    } catch (error) {
      onError(error, 'No se pudo procesar inbound');
    } finally {
      setInboundProcessing(false);
    }
  };

  const retryDistribution = async (eventId) => {
    try {
      const mode = retryModeById[eventId] || 'FORWARD_ALL';
      const res = await lionTvApi.post(`/inbound-emails/v1/${eventId}/retry-distribution`, { mode }, { headers, skipAuthRedirect: true });
      setLastProcessResult(unwrap(res));
      enqueueSnackbar('Retry ejecutado', { variant: 'success' });
      await loadEvents();
    } catch (error) {
      onError(error, 'No se pudo reintentar distribución');
    }
  };

  const providerById = useMemo(() => {
    const map = new Map();
    providers.forEach((provider) => map.set(provider.id, provider));
    return map;
  }, [providers]);

  const filteredProviders = useMemo(() => {
    const needle = providerSearch.trim().toLowerCase();
    if (!needle) return providers;

    return providers.filter((row) =>
      [row.code, row.name, row.description, row.createdBy].filter(Boolean).join(' ').toLowerCase().includes(needle)
    );
  }, [providers, providerSearch]);

  const sortedAccounts = useMemo(() => {
    return [...accounts].sort((a, b) => {
      const aMeta = expirationMeta(a.expirationDate);
      const bMeta = expirationMeta(b.expirationDate);

      if (aMeta.rank !== bMeta.rank) return aMeta.rank - bMeta.rank;
      if (aMeta.days === null && bMeta.days === null) return 0;
      if (aMeta.days === null) return 1;
      if (bMeta.days === null) return -1;
      return aMeta.days - bMeta.days;
    });
  }, [accounts]);

  const filteredAccounts = useMemo(() => {
    const needle = accountSearch.trim().toLowerCase();

    return sortedAccounts.filter((row) => {
      const rowStatus = String(row.accountStatus || '').toUpperCase();
      const rowProviderId = String(row.providerId || '');
      const rowAllowDistribution = Boolean(row.allowDistribution);
      const meta = expirationMeta(row.expirationDate);

      if (accountStatusFilter !== 'ALL' && rowStatus !== accountStatusFilter) return false;
      if (accountProviderFilter !== 'ALL' && rowProviderId !== String(accountProviderFilter)) return false;

      if (accountDistributionFilter === 'ON' && !rowAllowDistribution) return false;
      if (accountDistributionFilter === 'OFF' && rowAllowDistribution) return false;

      if (accountExpiryFilter === 'EXPIRED' && !(meta.days !== null && meta.days < 0)) return false;
      if (accountExpiryFilter === 'TODAY' && meta.days !== 0) return false;
      if (accountExpiryFilter === '7D' && !(meta.days !== null && meta.days >= 0 && meta.days <= 7)) return false;
      if (accountExpiryFilter === '30D' && !(meta.days !== null && meta.days >= 0 && meta.days <= 30)) return false;
      if (accountExpiryFilter === 'NO_DATE' && meta.days !== null) return false;

      if (!needle) return true;

      return [
        row.accountCode,
        row.displayName,
        row.aliasEmail,
        row.providerCode,
        row.providerName,
        row.customerFullname,
        row.createdBy,
        row.updatedBy,
        row.notes
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(needle);
    });
  }, [sortedAccounts, accountSearch, accountStatusFilter, accountProviderFilter, accountDistributionFilter, accountExpiryFilter]);

  const filteredEvents = useMemo(() => {
    const needle = eventSearch.trim().toLowerCase();

    return events.filter((row) => {
      const rowStatus = String(row.processingStatus || '').toUpperCase();
      if (eventStatusFilter !== 'ALL' && rowStatus !== eventStatusFilter) return false;

      if (!needle) return true;

      return [
        row.id,
        row.rawMessageId,
        row.resolvedAlias,
        row.fromEmail,
        row.toEmail,
        row.subject,
        row.processingError,
        row.aliasResolutionSource
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(needle);
    });
  }, [events, eventSearch, eventStatusFilter]);

  const pagedProviders = useMemo(() => {
    const start = providerPage * providerRowsPerPage;
    return filteredProviders.slice(start, start + providerRowsPerPage);
  }, [filteredProviders, providerPage, providerRowsPerPage]);

  const pagedAccounts = useMemo(() => {
    const start = accountPage * accountRowsPerPage;
    return filteredAccounts.slice(start, start + accountRowsPerPage);
  }, [filteredAccounts, accountPage, accountRowsPerPage]);

  const pagedEvents = useMemo(() => {
    const start = eventPage * eventRowsPerPage;
    return filteredEvents.slice(start, start + eventRowsPerPage);
  }, [filteredEvents, eventPage, eventRowsPerPage]);

  const accountMetrics = useMemo(() => {
    const total = accounts.length;
    const active = accounts.filter((it) => String(it.accountStatus || '').toUpperCase() === 'ACTIVE').length;
    const expired = accounts.filter((it) => {
      const days = daysUntil(it.expirationDate);
      return (days !== null && days < 0) || String(it.accountStatus || '').toUpperCase() === 'EXPIRED';
    }).length;
    const dueToday = accounts.filter((it) => daysUntil(it.expirationDate) === 0).length;
    const dueIn7 = accounts.filter((it) => {
      const days = daysUntil(it.expirationDate);
      return days !== null && days >= 0 && days <= 7;
    }).length;
    const dueIn30 = accounts.filter((it) => {
      const days = daysUntil(it.expirationDate);
      return days !== null && days >= 0 && days <= 30;
    }).length;
    const distributionOn = accounts.filter((it) => Boolean(it.allowDistribution)).length;

    return { total, active, expired, dueToday, dueIn7, dueIn30, distributionOn };
  }, [accounts]);

  const eventMetrics = useMemo(() => {
    const total = events.length;
    const distributed = events.filter((it) => String(it.processingStatus || '').toUpperCase() === 'DISTRIBUTED').length;
    const failed = events.filter((it) => String(it.processingStatus || '').toUpperCase() === 'FAILED').length;
    const unresolved = events.filter((it) => !it.resolvedAlias).length;
    return { total, distributed, failed, unresolved };
  }, [events]);

  const topExpiringAccounts = useMemo(() => {
    return sortedAccounts
      .filter((it) => {
        const days = daysUntil(it.expirationDate);
        return days !== null && days <= 30;
      })
      .slice(0, 8);
  }, [sortedAccounts]);

  return (
    <MainCard
      title="Managed Accounts Control Center"
      secondary={
        <Button variant="contained" startIcon={<RefreshIcon />} onClick={reload}>
          Refrescar
        </Button>
      }
    >
      <Stack spacing={2.5}>
        <Card sx={(theme) => cardGlassSx(theme)}>
          <CardContent>
            <Stack spacing={1.2}>
              <Typography variant="h3">Monitoreo operativo de cuentas, vencimientos y distribución de correos</Typography>
              <Typography variant="body2" color="text.secondary">
                Panel unificado para controlar providers, cuentas por alias y flujo inbound. Prioriza cuentas que vencen hoy/pronto y
                eventos fallidos.
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip variant="outlined" color="warning" icon={<WarningAmberIcon />} label={`Vencen en 7 días: ${accountMetrics.dueIn7}`} />
                <Chip variant="outlined" color="error" icon={<ReportProblemOutlinedIcon />} label={`Vencidas: ${accountMetrics.expired}`} />
                <Chip
                  variant="outlined"
                  color="success"
                  icon={<CheckCircleOutlineIcon />}
                  label={`Distribución ON: ${accountMetrics.distributionOn}`}
                />
                <Chip variant="outlined" color="info" icon={<EmailOutlinedIcon />} label={`Eventos inbound: ${eventMetrics.total}`} />
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Tabs value={tab} onChange={(_, next) => setTab(next)} variant="scrollable" scrollButtons="auto">
          <Tab label="Overview" />
          <Tab label="Managed Accounts" />
          <Tab label="Providers" />
          <Tab label="Inbound" />
          <Tab label="Reports" />
        </Tabs>

        {loading ? <LinearProgress /> : null}

        {tab === 0 ? (
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12} sm={6} lg={3}>
              <MetricCard
                title="Total Accounts"
                value={accountMetrics.total}
                helper="Cuentas registradas"
                icon={<HubOutlinedIcon />}
                color="primary"
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <MetricCard
                title="Active"
                value={accountMetrics.active}
                helper="Estado ACTIVE"
                icon={<CheckCircleOutlineIcon />}
                color="success"
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <MetricCard
                title="Due Today"
                value={accountMetrics.dueToday}
                helper="Acción inmediata"
                icon={<HourglassTopIcon />}
                color="warning"
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <MetricCard
                title="Expired"
                value={accountMetrics.expired}
                helper="Riesgo de pérdida"
                icon={<ReportProblemOutlinedIcon />}
                color="error"
              />
            </Grid>

            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h4">Cuentas con vencimiento cercano</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Próximos 30 días, ordenadas por criticidad
                  </Typography>
                  <Divider sx={{ my: 1.5 }} />

                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Account</TableCell>
                          <TableCell>Alias</TableCell>
                          <TableCell>Provider</TableCell>
                          <TableCell>Vence</TableCell>
                          <TableCell>Estado</TableCell>
                          <TableCell>Distribución</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {topExpiringAccounts.map((row) => {
                          const meta = expirationMeta(row.expirationDate);
                          return (
                            <TableRow key={row.id}>
                              <TableCell>
                                <Stack spacing={0.3}>
                                  <Typography variant="subtitle2">{row.accountCode}</Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {row.displayName}
                                  </Typography>
                                </Stack>
                              </TableCell>
                              <TableCell>{row.aliasEmail}</TableCell>
                              <TableCell>{row.providerCode || row.providerName || row.providerId || '-'}</TableCell>
                              <TableCell>
                                <Stack spacing={0.3}>
                                  <Typography variant="body2">{formatDate(row.expirationDate)}</Typography>
                                  <Chip size="small" color={meta.chipColor} label={meta.label} />
                                </Stack>
                              </TableCell>
                              <TableCell>
                                <Chip size="small" color={statusColor(row.accountStatus)} label={row.accountStatus || '-'} />
                              </TableCell>
                              <TableCell>
                                <Chip
                                  size="small"
                                  color={row.allowDistribution ? 'success' : 'default'}
                                  label={row.allowDistribution ? 'ON' : 'OFF'}
                                />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                        {!topExpiringAccounts.length ? (
                          <TableRow>
                            <TableCell colSpan={6}>Sin cuentas por vencer en 30 días</TableCell>
                          </TableRow>
                        ) : null}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Stack spacing={2}>
                <MetricCard
                  title="Inbound Distributed"
                  value={eventMetrics.distributed}
                  helper={`Fallidos: ${eventMetrics.failed}`}
                  icon={<MarkEmailReadOutlinedIcon />}
                  color="success"
                />
                <MetricCard
                  title="Inbound Unresolved"
                  value={eventMetrics.unresolved}
                  helper="Sin alias resuelto"
                  icon={<ReportProblemOutlinedIcon />}
                  color="warning"
                />
                <MetricCard
                  title="Due in 30 Days"
                  value={accountMetrics.dueIn30}
                  helper="Incluye las que vencen hoy"
                  icon={<HourglassTopIcon />}
                  color="info"
                />
              </Stack>
            </Grid>
          </Grid>
        ) : null}

        {tab === 1 ? (
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Grid container spacing={1.5} alignItems="center">
                    <Grid item xs={12} md={3.3}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Buscar cuenta"
                        value={accountSearch}
                        onChange={(event) => setAccountSearch(event.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon fontSize="small" />
                            </InputAdornment>
                          )
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={2.2}>
                      <TextField
                        fullWidth
                        select
                        size="small"
                        label="Status"
                        value={accountStatusFilter}
                        onChange={(event) => setAccountStatusFilter(event.target.value)}
                      >
                        <MenuItem value="ALL">Todos</MenuItem>
                        {accountStatusOptions.map((it) => (
                          <MenuItem key={it} value={it}>
                            {it}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} md={2.2}>
                      <TextField
                        fullWidth
                        select
                        size="small"
                        label="Provider"
                        value={accountProviderFilter}
                        onChange={(event) => setAccountProviderFilter(event.target.value)}
                      >
                        <MenuItem value="ALL">Todos</MenuItem>
                        {providers.map((p) => (
                          <MenuItem key={p.id} value={String(p.id)}>
                            {p.code} - {p.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField
                        fullWidth
                        select
                        size="small"
                        label="Vencimiento"
                        value={accountExpiryFilter}
                        onChange={(event) => setAccountExpiryFilter(event.target.value)}
                      >
                        <MenuItem value="ALL">Todos</MenuItem>
                        <MenuItem value="EXPIRED">Vencidas</MenuItem>
                        <MenuItem value="TODAY">Vence hoy</MenuItem>
                        <MenuItem value="7D">Próx. 7 días</MenuItem>
                        <MenuItem value="30D">Próx. 30 días</MenuItem>
                        <MenuItem value="NO_DATE">Sin fecha</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} md={1.8}>
                      <TextField
                        fullWidth
                        select
                        size="small"
                        label="Distribución"
                        value={accountDistributionFilter}
                        onChange={(event) => setAccountDistributionFilter(event.target.value)}
                      >
                        <MenuItem value="ALL">Todos</MenuItem>
                        <MenuItem value="ON">ON</MenuItem>
                        <MenuItem value="OFF">OFF</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} md={0.5}>
                      <Stack direction="row" justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
                        <Button
                          variant="contained"
                          startIcon={<AddCircleOutlineIcon />}
                          onClick={() => {
                            setAccountForm({
                              ...defaultAccountForm,
                              providerId: providers[0]?.id || '',
                              customerId: customers[0]?.customerId || ''
                            });
                            setAccountModalOpen(true);
                          }}
                        >
                          Nueva
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <TableContainer component={Card}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Cuenta</TableCell>
                      <TableCell>Alias</TableCell>
                      <TableCell>Provider</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Vencimiento</TableCell>
                      <TableCell>Último correo</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Distribución</TableCell>
                      <TableCell>Created By</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pagedAccounts.map((row) => {
                      const exp = expirationMeta(row.expirationDate);
                      const rowAlert = exp.rank <= 2;

                      return (
                        <TableRow
                          key={row.id}
                          sx={(theme) => ({
                            bgcolor: rowAlert
                              ? exp.chipColor === 'error'
                                ? withAlpha(theme.palette.error.main, 0.09)
                                : withAlpha(theme.palette.warning.main, 0.1)
                              : 'transparent'
                          })}
                        >
                          <TableCell>{row.id}</TableCell>
                          <TableCell>
                            <Stack spacing={0.2}>
                              <Typography variant="subtitle2">{row.accountCode}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {row.displayName}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>{row.aliasEmail}</TableCell>
                          <TableCell>
                            {row.providerCode || row.providerName || providerById.get(row.providerId)?.code || row.providerId || '-'}
                          </TableCell>
                          <TableCell>{row.customerFullname || row.customerId || '-'}</TableCell>
                          <TableCell>
                            <Stack spacing={0.4}>
                              <Typography variant="body2">{formatDate(row.expirationDate)}</Typography>
                              <Chip size="small" color={exp.chipColor} label={exp.label} />
                            </Stack>
                          </TableCell>
                          <TableCell>{formatDateTime(row.lastEmailReceivedAt)}</TableCell>
                          <TableCell>
                            <Chip size="small" color={statusColor(row.accountStatus)} label={row.accountStatus || '-'} />
                          </TableCell>
                          <TableCell>
                            <FormControlLabel
                              sx={{ m: 0 }}
                              control={
                                <Switch
                                  checked={Boolean(row.allowDistribution)}
                                  onChange={(_, checked) => patchDistribution(row.id, checked)}
                                />
                              }
                              label={row.allowDistribution ? 'ON' : 'OFF'}
                            />
                          </TableCell>
                          <TableCell>{row.createdBy || '-'}</TableCell>
                          <TableCell>
                            <Stack spacing={1}>
                              <Button
                                size="small"
                                onClick={() => {
                                  setAccountForm({
                                    ...row,
                                    providerId: row.providerId,
                                    customerId: row.customerId || '',
                                    expirationDate: row.expirationDate || '',
                                    renewalDate: row.renewalDate || ''
                                  });
                                  setAccountModalOpen(true);
                                }}
                              >
                                Editar
                              </Button>
                              <TextField
                                select
                                size="small"
                                value={row.accountStatus || 'ACTIVE'}
                                onChange={(event) => patchAccountStatus(row.id, event.target.value)}
                                sx={{ minWidth: 140 }}
                              >
                                {accountStatusOptions.map((it) => (
                                  <MenuItem key={it} value={it}>
                                    {it}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {!pagedAccounts.length ? (
                      <TableRow>
                        <TableCell colSpan={11}>Sin cuentas para los filtros seleccionados</TableCell>
                      </TableRow>
                    ) : null}
                  </TableBody>
                </Table>
                <TablePagination
                  component="div"
                  rowsPerPageOptions={[10, 25, 50]}
                  count={filteredAccounts.length}
                  rowsPerPage={accountRowsPerPage}
                  page={accountPage}
                  onPageChange={(_, nextPage) => setAccountPage(nextPage)}
                  onRowsPerPageChange={(event) => {
                    setAccountRowsPerPage(Number(event.target.value));
                    setAccountPage(0);
                  }}
                />
              </TableContainer>
            </Grid>
          </Grid>
        ) : null}

        {tab === 2 ? (
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Grid container spacing={1.5} alignItems="center">
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Buscar provider"
                        value={providerSearch}
                        onChange={(event) => setProviderSearch(event.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon fontSize="small" />
                            </InputAdornment>
                          )
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack direction="row" justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
                        <Button
                          variant="contained"
                          startIcon={<AddCircleOutlineIcon />}
                          onClick={() => {
                            setProviderForm(defaultProviderForm);
                            setProviderModalOpen(true);
                          }}
                        >
                          Nuevo Provider
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <TableContainer component={Card}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Code</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Created By</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pagedProviders.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>{row.id}</TableCell>
                        <TableCell>{row.code}</TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.description || '-'}</TableCell>
                        <TableCell>
                          <Chip size="small" color={statusColor(row.status)} label={row.status || '-'} />
                        </TableCell>
                        <TableCell>{row.createdBy || '-'}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <Button
                              size="small"
                              onClick={() => {
                                setProviderForm({
                                  id: row.id,
                                  code: row.code,
                                  name: row.name,
                                  description: row.description || ''
                                });
                                setProviderModalOpen(true);
                              }}
                            >
                              Editar
                            </Button>
                            <TextField
                              select
                              size="small"
                              value={row.status || 'ACTIVE'}
                              onChange={(event) => patchProviderStatus(row.id, event.target.value)}
                              sx={{ minWidth: 130 }}
                            >
                              {providerStatusOptions.map((it) => (
                                <MenuItem key={it} value={it}>
                                  {it}
                                </MenuItem>
                              ))}
                            </TextField>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                    {!pagedProviders.length ? (
                      <TableRow>
                        <TableCell colSpan={7}>Sin providers para los filtros seleccionados</TableCell>
                      </TableRow>
                    ) : null}
                  </TableBody>
                </Table>
                <TablePagination
                  component="div"
                  rowsPerPageOptions={[10, 25, 50]}
                  count={filteredProviders.length}
                  rowsPerPage={providerRowsPerPage}
                  page={providerPage}
                  onPageChange={(_, nextPage) => setProviderPage(nextPage)}
                  onRowsPerPageChange={(event) => {
                    setProviderRowsPerPage(Number(event.target.value));
                    setProviderPage(0);
                  }}
                />
              </TableContainer>
            </Grid>
          </Grid>
        ) : null}

        {tab === 3 ? (
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12} md={4.5}>
              <Card>
                <CardContent>
                  <Stack spacing={1.2}>
                    <Typography variant="h4">Process Inbound</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Proceso manual para pruebas o reprocesos puntuales
                    </Typography>
                    <Divider />
                    <TextField
                      label="Mailbox"
                      size="small"
                      value={inboundForm.mailboxAccount}
                      onChange={(event) => setInboundForm((prev) => ({ ...prev, mailboxAccount: event.target.value }))}
                    />
                    <TextField
                      label="Raw Message ID"
                      size="small"
                      value={inboundForm.rawMessageId}
                      onChange={(event) => setInboundForm((prev) => ({ ...prev, rawMessageId: event.target.value }))}
                    />
                    <TextField
                      label="From Email"
                      size="small"
                      value={inboundForm.fromEmail}
                      onChange={(event) => setInboundForm((prev) => ({ ...prev, fromEmail: event.target.value }))}
                    />
                    <TextField
                      label="To Email"
                      size="small"
                      value={inboundForm.toEmail}
                      onChange={(event) => setInboundForm((prev) => ({ ...prev, toEmail: event.target.value }))}
                    />
                    <TextField
                      label="Subject"
                      size="small"
                      value={inboundForm.subject}
                      onChange={(event) => setInboundForm((prev) => ({ ...prev, subject: event.target.value }))}
                    />
                    <TextField
                      label="Received At"
                      type="datetime-local"
                      size="small"
                      value={inboundForm.receivedAt}
                      onChange={(event) => setInboundForm((prev) => ({ ...prev, receivedAt: event.target.value }))}
                      InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                      label="Raw Headers"
                      size="small"
                      multiline
                      minRows={4}
                      value={inboundForm.rawHeaders}
                      onChange={(event) => setInboundForm((prev) => ({ ...prev, rawHeaders: event.target.value }))}
                    />
                    <TextField
                      label="Body Plain"
                      size="small"
                      multiline
                      minRows={4}
                      value={inboundForm.bodyPlain}
                      onChange={(event) => setInboundForm((prev) => ({ ...prev, bodyPlain: event.target.value }))}
                    />

                    <Button variant="contained" onClick={processInbound} disabled={inboundProcessing}>
                      {inboundProcessing ? 'Procesando...' : 'Procesar inbound'}
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={7.5}>
              <Stack spacing={2}>
                <Grid container spacing={1.5}>
                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard title="Total" value={eventMetrics.total} icon={<EmailOutlinedIcon />} color="info" />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard title="Distributed" value={eventMetrics.distributed} icon={<MarkEmailReadOutlinedIcon />} color="success" />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard title="Failed" value={eventMetrics.failed} icon={<ReportProblemOutlinedIcon />} color="error" />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <MetricCard title="Unresolved" value={eventMetrics.unresolved} icon={<WarningAmberIcon />} color="warning" />
                  </Grid>
                </Grid>

                <Card>
                  <CardContent>
                    <Stack spacing={1.5}>
                      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Buscar evento"
                          value={eventSearch}
                          onChange={(event) => setEventSearch(event.target.value)}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchIcon fontSize="small" />
                              </InputAdornment>
                            )
                          }}
                        />
                        <TextField
                          select
                          size="small"
                          label="Status"
                          value={eventStatusFilter}
                          onChange={(event) => setEventStatusFilter(event.target.value)}
                          sx={{ minWidth: 200 }}
                        >
                          <MenuItem value="ALL">Todos</MenuItem>
                          {Array.from(new Set(events.map((it) => String(it.processingStatus || '').toUpperCase()).filter(Boolean))).map(
                            (status) => (
                              <MenuItem key={status} value={status}>
                                {status}
                              </MenuItem>
                            )
                          )}
                        </TextField>
                      </Stack>

                      {lastProcessResult ? (
                        <Alert severity={lastProcessResult.processingStatus === 'FAILED' ? 'error' : 'success'}>
                          {lastProcessResult.message || 'Proceso ejecutado'}
                        </Alert>
                      ) : null}

                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>ID</TableCell>
                              <TableCell>Recibido</TableCell>
                              <TableCell>Alias</TableCell>
                              <TableCell>Status</TableCell>
                              <TableCell>Error</TableCell>
                              <TableCell>Retry Mode</TableCell>
                              <TableCell>Retry</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {pagedEvents.map((row) => (
                              <TableRow key={row.id}>
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{formatDateTime(row.receivedAt || row.createdAt)}</TableCell>
                                <TableCell>{row.resolvedAlias || 'UNRESOLVED'}</TableCell>
                                <TableCell>
                                  <Chip size="small" color={statusColor(row.processingStatus)} label={row.processingStatus || '-'} />
                                </TableCell>
                                <TableCell>
                                  <Typography variant="caption" color="text.secondary">
                                    {row.processingError || '-'}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <TextField
                                    select
                                    size="small"
                                    value={retryModeById[row.id] || 'FORWARD_ALL'}
                                    onChange={(event) => setRetryModeById((prev) => ({ ...prev, [row.id]: event.target.value }))}
                                    sx={{ minWidth: 165 }}
                                  >
                                    {retryModes.map((it) => (
                                      <MenuItem key={it} value={it}>
                                        {it}
                                      </MenuItem>
                                    ))}
                                  </TextField>
                                </TableCell>
                                <TableCell>
                                  <Button
                                    size="small"
                                    disabled={String(row.processingStatus || '').toUpperCase() !== 'FAILED'}
                                    onClick={() => retryDistribution(row.id)}
                                  >
                                    Retry
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                            {!pagedEvents.length ? (
                              <TableRow>
                                <TableCell colSpan={7}>Sin eventos para los filtros seleccionados</TableCell>
                              </TableRow>
                            ) : null}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      <TablePagination
                        component="div"
                        rowsPerPageOptions={[10, 25, 50]}
                        count={filteredEvents.length}
                        rowsPerPage={eventRowsPerPage}
                        page={eventPage}
                        onPageChange={(_, nextPage) => setEventPage(nextPage)}
                        onRowsPerPageChange={(event) => {
                          setEventRowsPerPage(Number(event.target.value));
                          setEventPage(0);
                        }}
                      />
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
          </Grid>
        ) : null}

        {tab === 4 ? (
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard title="Inbound Total" value={inboundSummary?.total || 0} icon={<EmailOutlinedIcon />} color="info" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Inbound Distributed"
                value={inboundSummary?.distributed || 0}
                icon={<CheckCircleOutlineIcon />}
                color="success"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard title="Sent" value={distributionSummary?.sent || 0} icon={<MarkEmailReadOutlinedIcon />} color="success" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard title="Failed" value={distributionSummary?.failed || 0} icon={<ReportProblemOutlinedIcon />} color="error" />
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h4">Inbound por Provider</Typography>
                  <Divider sx={{ my: 1.5 }} />
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Provider</TableCell>
                        <TableCell align="right">Inbound</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {providerSummary.map((it, idx) => (
                        <TableRow key={`${it.providerId || idx}-${it.providerCode || 'x'}`}>
                          <TableCell>{it.providerCode || 'UNASSIGNED'}</TableCell>
                          <TableCell align="right">{it.totalInbound}</TableCell>
                        </TableRow>
                      ))}
                      {!providerSummary.length ? (
                        <TableRow>
                          <TableCell colSpan={2}>Sin datos</TableCell>
                        </TableRow>
                      ) : null}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h4">Inbound por Alias</Typography>
                  <Divider sx={{ my: 1.5 }} />
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Alias</TableCell>
                        <TableCell align="right">Inbound</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {aliasSummary.map((it, idx) => (
                        <TableRow key={`${it.resolvedAlias || idx}`}>
                          <TableCell>{it.resolvedAlias || 'UNRESOLVED'}</TableCell>
                          <TableCell align="right">{it.totalInbound}</TableCell>
                        </TableRow>
                      ))}
                      {!aliasSummary.length ? (
                        <TableRow>
                          <TableCell colSpan={2}>Sin datos</TableCell>
                        </TableRow>
                      ) : null}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        ) : null}
      </Stack>

      <Dialog
        open={providerModalOpen}
        onClose={() => setProviderModalOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: modalPaperSx }}
      >
        <DialogTitle sx={modalHeaderSx}>
          <Stack spacing={0.5}>
            <Typography variant="h4">{providerForm.id ? 'Editar Provider' : 'Nuevo Provider'}</Typography>
            <Typography variant="caption" color="text.secondary">
              Define el proveedor que agrupará cuentas y aliases.
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent sx={modalContentSx}>
          <Box sx={modalSectionSx}>
            <Stack spacing={1.6}>
              <TextField
                size="small"
                label="Code"
                sx={fieldSx}
                value={providerForm.code}
                onChange={(event) => setProviderForm((prev) => ({ ...prev, code: event.target.value }))}
              />
              <TextField
                size="small"
                label="Name"
                sx={fieldSx}
                value={providerForm.name}
                onChange={(event) => setProviderForm((prev) => ({ ...prev, name: event.target.value }))}
              />
              <TextField
                size="small"
                label="Description"
                multiline
                minRows={3}
                sx={fieldSx}
                value={providerForm.description}
                onChange={(event) => setProviderForm((prev) => ({ ...prev, description: event.target.value }))}
              />
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions sx={modalActionsSx}>
          <Button color="inherit" onClick={() => setProviderModalOpen(false)}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={saveProvider} disabled={providerSaving}>
            {providerSaving ? 'Guardando...' : 'Guardar Provider'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={accountModalOpen} onClose={() => setAccountModalOpen(false)} fullWidth maxWidth="md" PaperProps={{ sx: modalPaperSx }}>
        <DialogTitle sx={modalHeaderSx}>
          <Stack spacing={0.5}>
            <Typography variant="h4">{accountForm.id ? 'Editar Cuenta Gestionada' : 'Nueva Cuenta Gestionada'}</Typography>
            <Typography variant="caption" color="text.secondary">
              Configura identidad, vencimiento y reglas de distribución del alias.
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent sx={modalContentSx}>
          <Stack spacing={2}>
            <Box sx={modalSectionSx}>
              <Stack spacing={1.6}>
                <Typography variant="subtitle2">Identidad y Relación</Typography>
                <Grid container spacing={1.6}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Account Code"
                      sx={fieldSx}
                      value={accountForm.accountCode}
                      onChange={(event) => setAccountForm((prev) => ({ ...prev, accountCode: event.target.value }))}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Display Name"
                      sx={fieldSx}
                      value={accountForm.displayName}
                      onChange={(event) => setAccountForm((prev) => ({ ...prev, displayName: event.target.value }))}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      select
                      label="Provider"
                      sx={fieldSx}
                      value={accountForm.providerId}
                      onChange={(event) => setAccountForm((prev) => ({ ...prev, providerId: event.target.value }))}
                    >
                      {providers.map((p) => (
                        <MenuItem key={p.id} value={p.id}>
                          {p.code} - {p.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      select
                      label="Customer"
                      sx={fieldSx}
                      value={accountForm.customerId}
                      onChange={(event) => setAccountForm((prev) => ({ ...prev, customerId: event.target.value }))}
                    >
                      {customers.map((c) => (
                        <MenuItem key={c.customerId} value={c.customerId}>
                          {c.customerId} - {c.customerFullname}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Alias Email"
                      sx={fieldSx}
                      value={accountForm.aliasEmail}
                      onChange={(event) => setAccountForm((prev) => ({ ...prev, aliasEmail: event.target.value }))}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Principal Reference"
                      sx={fieldSx}
                      value={accountForm.principalReference}
                      onChange={(event) => setAccountForm((prev) => ({ ...prev, principalReference: event.target.value }))}
                    />
                  </Grid>
                </Grid>
              </Stack>
            </Box>

            <Box sx={modalSectionSx}>
              <Stack spacing={1.6}>
                <Typography variant="subtitle2">Vigencia y Operación</Typography>
                <Grid container spacing={1.6}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      size="small"
                      select
                      label="Status"
                      sx={fieldSx}
                      value={accountForm.accountStatus}
                      onChange={(event) => setAccountForm((prev) => ({ ...prev, accountStatus: event.target.value }))}
                    >
                      {accountStatusOptions.map((it) => (
                        <MenuItem key={it} value={it}>
                          {it}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      size="small"
                      type="date"
                      label="Expiration Date"
                      sx={fieldSx}
                      InputLabelProps={{ shrink: true }}
                      value={accountForm.expirationDate}
                      onChange={(event) => setAccountForm((prev) => ({ ...prev, expirationDate: event.target.value }))}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      size="small"
                      type="date"
                      label="Renewal Date"
                      sx={fieldSx}
                      InputLabelProps={{ shrink: true }}
                      value={accountForm.renewalDate}
                      onChange={(event) => setAccountForm((prev) => ({ ...prev, renewalDate: event.target.value }))}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box
                      sx={(theme) => ({
                        px: 1.5,
                        py: 1,
                        borderRadius: 1.5,
                        border: `1px dashed ${theme.palette.divider}`,
                        backgroundColor: withAlpha(theme.palette.success.main, 0.04)
                      })}
                    >
                      <FormControlLabel
                        control={
                          <Switch
                            checked={Boolean(accountForm.allowDistribution)}
                            onChange={(_, checked) => setAccountForm((prev) => ({ ...prev, allowDistribution: checked }))}
                          />
                        }
                        label="Allow Distribution"
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      multiline
                      minRows={3}
                      label="Notes"
                      sx={fieldSx}
                      value={accountForm.notes}
                      onChange={(event) => setAccountForm((prev) => ({ ...prev, notes: event.target.value }))}
                    />
                  </Grid>
                </Grid>
              </Stack>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={modalActionsSx}>
          <Button color="inherit" onClick={() => setAccountModalOpen(false)}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={saveAccount} disabled={accountSaving}>
            {accountSaving ? 'Guardando...' : 'Guardar Cuenta'}
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
}
