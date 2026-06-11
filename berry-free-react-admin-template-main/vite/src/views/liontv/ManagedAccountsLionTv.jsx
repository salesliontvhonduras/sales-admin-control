import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import useAuth from 'hooks/useAuth';
import { useTranslation } from 'react-i18next';

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
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
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
import LionMetricCard from 'ui-component/cards/LionMetricCard';
import DialogTitleWithClose from 'ui-component/dialogs/DialogTitleWithClose';
import ResponsiveMetricGrid from 'ui-component/responsive/ResponsiveMetricGrid';
import { gridSpacing } from 'store/constant';
import { lionTvApi } from 'utils/api';
import { hasPermissionExact, isResellerConsoleUser } from 'utils/rbac';
import CustomerAutocomplete from 'views/liontv/components/CustomerAutocomplete';

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
  borderColor: withAlpha(theme.vars?.palette?.divider || theme.palette.divider, 0.95),
  boxShadow:
    theme.palette.mode === 'dark'
      ? `0 14px 34px ${withAlpha('#020817', 0.48)}`
      : `0 10px 24px ${withAlpha('#0f172a', 0.1)}`,
  backgroundColor: theme.vars?.palette?.surface?.card || theme.palette.background.paper,
  backgroundImage:
    theme.palette.mode === 'dark'
      ? `linear-gradient(150deg, ${withAlpha(theme.vars?.palette?.primary?.main || theme.palette.primary.main, 0.16)} 0%, ${withAlpha(theme.vars?.palette?.secondary?.main || theme.palette.secondary.main, 0.12)} 52%, ${theme.vars?.palette?.surface?.card || theme.palette.background.paper} 100%)`
      : `linear-gradient(150deg, ${withAlpha(theme.vars?.palette?.primary?.main || theme.palette.primary.main, 0.09)} 0%, ${withAlpha(theme.vars?.palette?.secondary?.main || theme.palette.secondary.main, 0.07)} 52%, ${theme.vars?.palette?.surface?.card || theme.palette.background.paper} 100%)`
});

const modalPaperSx = (theme) => ({
  borderRadius: 3,
  border: `1px solid ${withAlpha(theme.vars?.palette?.divider || theme.palette.divider, 0.95)}`,
  boxShadow:
    theme.palette.mode === 'dark'
      ? `0 26px 56px ${withAlpha('#020617', 0.62)}`
      : `0 20px 44px ${withAlpha('#0f172a', 0.2)}`,
  backgroundColor: theme.vars?.palette?.surface?.card || theme.palette.background.paper,
  overflow: 'hidden'
});

const modalHeaderSx = (theme) => ({
  px: 3,
  py: 2.2,
  borderBottom: `1px solid ${withAlpha(theme.vars?.palette?.divider || theme.palette.divider, 0.95)}`,
  background:
    theme.palette.mode === 'dark'
      ? `linear-gradient(135deg, ${withAlpha(theme.vars?.palette?.primary?.main || theme.palette.primary.main, 0.2)} 0%, ${withAlpha(theme.vars?.palette?.secondary?.main || theme.palette.secondary.main, 0.12)} 55%, ${theme.vars?.palette?.surface?.card || theme.palette.background.paper} 100%)`
      : `linear-gradient(135deg, ${withAlpha(theme.vars?.palette?.primary?.main || theme.palette.primary.main, 0.1)} 0%, ${withAlpha(theme.vars?.palette?.info?.main || theme.palette.info.main, 0.06)} 100%)`
});

const modalContentSx = {
  px: 3,
  py: 2.5
};

const modalActionsSx = (theme) => ({
  px: 3,
  py: 2,
  borderTop: `1px solid ${withAlpha(theme.vars?.palette?.divider || theme.palette.divider, 0.95)}`,
  backgroundColor: withAlpha(theme.vars?.palette?.surface?.muted || theme.palette.background.default, theme.palette.mode === 'dark' ? 0.9 : 0.7)
});

const modalSectionSx = (theme) => ({
  p: 2,
  borderRadius: 2,
  border: `1px solid ${withAlpha(theme.vars?.palette?.divider || theme.palette.divider, 0.95)}`,
  background:
    theme.palette.mode === 'dark'
      ? `linear-gradient(180deg, ${withAlpha(theme.vars?.palette?.primary?.main || theme.palette.primary.main, 0.1)} 0%, ${withAlpha(theme.vars?.palette?.surface?.card || theme.palette.background.paper, 0.92)} 100%)`
      : `linear-gradient(180deg, ${withAlpha(theme.vars?.palette?.primary?.main || theme.palette.primary.main, 0.05)} 0%, ${withAlpha(theme.vars?.palette?.surface?.card || theme.palette.background.paper, 0.92)} 100%)`
});

const panelCardSx = (theme) => ({
  border: '1px solid',
  borderColor: withAlpha(theme.vars?.palette?.divider || theme.palette.divider, 0.95),
  backgroundColor: theme.vars?.palette?.surface?.card || theme.palette.background.paper,
  boxShadow:
    theme.palette.mode === 'dark'
      ? `0 14px 34px ${withAlpha('#020817', 0.42)}`
      : `0 10px 24px ${withAlpha('#0f172a', 0.08)}`
});

const tableContainerSx = (theme) => ({
  ...panelCardSx(theme),
  borderRadius: 2.4,
  overflow: 'hidden'
});

const tableHeadRowSx = (theme) => ({
  bgcolor: theme.vars?.palette?.surface?.sunken || theme.palette.action.hover,
  borderBottom: `1px solid ${withAlpha(theme.vars?.palette?.divider || theme.palette.divider, 0.95)}`
});

const fieldSx = (theme) => ({
  '& .MuiInputBase-root': {
    borderRadius: 1.8,
    backgroundColor: withAlpha(theme.vars?.palette?.surface?.sunken || theme.palette.background.default, theme.palette.mode === 'dark' ? 0.8 : 0.55)
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: withAlpha(theme.vars?.palette?.divider || theme.palette.divider, 0.95)
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: withAlpha(theme.vars?.palette?.primary?.main || theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.54 : 0.34)
  },
  '& .MuiInputLabel-root': {
    fontWeight: 500,
    color: theme.palette.text.secondary
  }
});

const tabsSx = (theme) => ({
  borderRadius: 2.4,
  border: '1px solid',
  borderColor: withAlpha(theme.vars?.palette?.divider || theme.palette.divider, 0.95),
  backgroundColor: withAlpha(theme.vars?.palette?.surface?.sunken || theme.palette.background.default, theme.palette.mode === 'dark' ? 0.78 : 0.58),
  px: 0.8,
  '& .MuiTab-root': {
    minHeight: 42,
    borderRadius: 1.6,
    color: theme.palette.text.secondary,
    fontWeight: 600
  },
  '& .MuiTab-root.Mui-selected': {
    color: theme.palette.text.primary
  },
  '& .MuiTabs-indicator': {
    height: 34,
    borderRadius: 1.4,
    backgroundColor: withAlpha(theme.vars?.palette?.primary?.main || theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.2 : 0.12),
    zIndex: 0,
    marginBottom: 4
  },
  '& .MuiTab-root > *': {
    position: 'relative',
    zIndex: 1
  }
});

const tablePaginationSx = (theme) => ({
  borderTop: `1px solid ${withAlpha(theme.vars?.palette?.divider || theme.palette.divider, 0.95)}`,
  backgroundColor: withAlpha(theme.vars?.palette?.surface?.sunken || theme.palette.background.default, theme.palette.mode === 'dark' ? 0.84 : 0.62),
  '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
    color: theme.palette.text.secondary,
    fontWeight: 500
  },
  '& .MuiTablePagination-toolbar': {
    minHeight: 54
  },
  '& .MuiTablePagination-actions .MuiIconButton-root': {
    color: theme.palette.text.secondary
  }
});

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

function formatDate(value, locale = 'es-HN') {
  const date = parseDateValue(value);
  if (!date) return '-';
  return date.toLocaleDateString(locale);
}

function formatDateTime(value, locale = 'es-HN') {
  const date = parseDateValue(value);
  if (!date) return '-';
  return date.toLocaleString(locale);
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
    return { days: null, state: 'NO_DATE', chipColor: 'default', rank: 5 };
  }
  if (days < 0) {
    return { days, state: 'EXPIRED', chipColor: 'error', rank: 0 };
  }
  if (days === 0) {
    return { days, state: 'TODAY', chipColor: 'error', rank: 1 };
  }
  if (days <= 7) {
    return { days, state: 'DUE', chipColor: 'warning', rank: 2 };
  }
  if (days <= 30) {
    return { days, state: 'DUE', chipColor: 'info', rank: 3 };
  }
  return { days, state: 'DUE', chipColor: 'success', rank: 4 };
}

function expirationLabel(meta, t) {
  if (!meta) return '-';
  if (meta.state === 'NO_DATE') return t('managedAccounts.expiration.noDate', 'No date');
  if (meta.state === 'EXPIRED') return t('managedAccounts.expiration.expiredAgo', { defaultValue: 'Expired {{days}}d ago', days: Math.abs(meta.days ?? 0) });
  if (meta.state === 'TODAY') return t('managedAccounts.expiration.today', 'Due today');
  return t('managedAccounts.expiration.inDays', { defaultValue: 'Due in {{days}}d', days: meta.days ?? 0 });
}

function expirationChipSx(meta) {
  return (theme) => {
    if (!meta) return { fontWeight: 700 };

    const paletteByState = {
      EXPIRED: theme.palette.error,
      TODAY: theme.palette.error,
      DUE: meta.days !== null && meta.days <= 7 ? theme.palette.warning : meta.days !== null && meta.days <= 30 ? theme.palette.info : theme.palette.success,
      NO_DATE: theme.palette.grey
    };

    const palette = paletteByState[meta.state] || theme.palette.info;

    if (meta.state === 'NO_DATE') {
      return {
        fontWeight: 700,
        bgcolor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[200],
        color: theme.palette.mode === 'dark' ? theme.palette.grey[100] : theme.palette.grey[900],
        border: '1px solid',
        borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[300]
      };
    }

    return {
      fontWeight: 700,
      bgcolor: theme.palette.mode === 'dark' ? palette.main : palette.lighter || palette.light,
      color: theme.palette.mode === 'dark' ? palette.contrastText : palette.dark || palette.main,
      border: '1px solid',
      borderColor: theme.palette.mode === 'dark' ? withAlpha(palette.main, 0.9) : withAlpha(palette.main, 0.3)
    };
  };
}

function MetricCard({ title, value, helper, color = 'primary', icon }) {
  return <LionMetricCard title={title} value={value} helper={helper} color={color} icon={icon} sx={(theme) => cardGlassSx(theme)} />;
}

export default function ManagedAccountsLionTv() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { accessToken, user, lionTvViewMode } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const { t, i18n } = useTranslation();
  const dateLocale = useMemo(
    () => (String(i18n.resolvedLanguage || i18n.language || '').toLowerCase().startsWith('es') ? 'es-HN' : 'en-US'),
    [i18n.language, i18n.resolvedLanguage]
  );
  const isResellerOwner = hasPermissionExact(user, { any: ['ROLE_LIONTV_RESELLER_OWNER', 'LIONTV_RESELLER_OWNER'] });
  const isResellerScopedView = isResellerOwner && isResellerConsoleUser(user, lionTvViewMode);
  const canManageAccounts = !isResellerScopedView;

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
    const res = await lionTvApi.get('/customers/v1', { headers, params: { index: 0, size: 100 }, skipAuthRedirect: true });
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
      if (isResellerScopedView) {
        await loadAccounts();
        return;
      }
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
      onError(error, t('managedAccounts.messages.loadModuleError', 'Could not load managed accounts module.'));
    } finally {
      setLoading(false);
    }
  }, [accessToken, isResellerScopedView, tab, loadProviders, loadAccounts, loadCustomers, loadEvents, loadReports, onError, t]);

  useEffect(() => {
    reload();
  }, [reload]);

  useEffect(() => {
    if (isResellerScopedView && tab > 1) {
      setTab(0);
    }
  }, [isResellerScopedView, tab]);

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
      enqueueSnackbar(t('managedAccounts.messages.providerRequired', 'Code and Name are required.'), { variant: 'warning' });
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
      enqueueSnackbar(t('managedAccounts.messages.providerSaved', 'Provider saved.'), { variant: 'success' });
      await loadProviders();
    } catch (error) {
      onError(error, t('managedAccounts.messages.providerSaveError', 'Could not save provider.'));
    } finally {
      setProviderSaving(false);
    }
  };

  const patchProviderStatus = async (id, status) => {
    try {
      await lionTvApi.patch(`/providers/v1/${id}/status`, { status }, { headers, skipAuthRedirect: true });
      await loadProviders();
    } catch (error) {
      onError(error, t('managedAccounts.messages.providerStatusError', 'Could not change provider status.'));
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
      enqueueSnackbar(t('managedAccounts.messages.accountRequired', 'Complete required fields.'), { variant: 'warning' });
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
      enqueueSnackbar(t('managedAccounts.messages.accountSaved', 'Managed account saved.'), { variant: 'success' });
      await loadAccounts();
    } catch (error) {
      onError(error, t('managedAccounts.messages.accountSaveError', 'Could not save managed account.'));
    } finally {
      setAccountSaving(false);
    }
  };

  const patchAccountStatus = async (id, status) => {
    try {
      await lionTvApi.patch(`/managed-accounts/v1/${id}/status`, { status }, { headers, skipAuthRedirect: true });
      await loadAccounts();
    } catch (error) {
      onError(error, t('managedAccounts.messages.accountStatusError', 'Could not change account status.'));
    }
  };

  const patchDistribution = async (id, allowDistribution) => {
    try {
      await lionTvApi.patch(`/managed-accounts/v1/${id}/distribution`, { allowDistribution }, { headers, skipAuthRedirect: true });
      await loadAccounts();
    } catch (error) {
      onError(error, t('managedAccounts.messages.distributionUpdateError', 'Could not update distribution setting.'));
    }
  };

  const processInbound = async () => {
    if (!inboundForm.mailboxAccount || !inboundForm.rawMessageId || !inboundForm.fromEmail || !inboundForm.receivedAt) {
      enqueueSnackbar(t('managedAccounts.messages.inboundRequired', 'mailboxAccount, rawMessageId, fromEmail and receivedAt are required.'), {
        variant: 'warning'
      });
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
      enqueueSnackbar(t('managedAccounts.messages.inboundProcessed', 'Inbound event processed.'), { variant: 'success' });
      await loadEvents();
    } catch (error) {
      onError(error, t('managedAccounts.messages.inboundProcessError', 'Could not process inbound event.'));
    } finally {
      setInboundProcessing(false);
    }
  };

  const retryDistribution = async (eventId) => {
    try {
      const mode = retryModeById[eventId] || 'FORWARD_ALL';
      const res = await lionTvApi.post(`/inbound-emails/v1/${eventId}/retry-distribution`, { mode }, { headers, skipAuthRedirect: true });
      setLastProcessResult(unwrap(res));
      enqueueSnackbar(t('managedAccounts.messages.retryExecuted', 'Retry executed successfully.'), { variant: 'success' });
      await loadEvents();
    } catch (error) {
      onError(error, t('managedAccounts.messages.retryError', 'Could not retry distribution.'));
    }
  };

  const providerById = useMemo(() => {
    const map = new Map();
    providers.forEach((provider) => map.set(provider.id, provider));
    return map;
  }, [providers]);

  const accountProviderOptions = useMemo(() => {
    if (!isResellerScopedView) return providers;

    return Array.from(
      accounts.reduce((map, row) => {
        const id = row.providerId;
        if (!id || map.has(id)) return map;
        map.set(id, {
          id,
          code: row.providerCode || String(id),
          name: row.providerName || ''
        });
        return map;
      }, new Map())
    ).map(([, value]) => value);
  }, [accounts, isResellerScopedView, providers]);

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
      title={t('managedAccounts.title', 'Managed Accounts Control Center')}
      secondary={
        <Button variant="contained" startIcon={<RefreshIcon />} onClick={reload}>
          {t('managedAccounts.actions.refresh', 'Refresh')}
        </Button>
      }
    >
      <Stack spacing={2.5}>
        <Card sx={(theme) => cardGlassSx(theme)}>
          <CardContent>
            <Stack spacing={1.2}>
              <Typography variant="h3">{t('managedAccounts.hero.title', 'Operational tracking for accounts, expirations and mail distribution')}</Typography>
              <Typography variant="body2" color="text.secondary">
                {t(
                  'managedAccounts.hero.subtitle',
                  'Unified panel to control providers, alias-based accounts, and inbound flow. Prioritize due/expiring accounts and failed events.'
                )}
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip
                  variant="outlined"
                  color="warning"
                  icon={<WarningAmberIcon />}
                  label={t('managedAccounts.hero.chips.due7', { defaultValue: 'Due in 7 days: {{count}}', count: accountMetrics.dueIn7 })}
                />
                <Chip
                  variant="outlined"
                  color="error"
                  icon={<ReportProblemOutlinedIcon />}
                  label={t('managedAccounts.hero.chips.expired', { defaultValue: 'Expired: {{count}}', count: accountMetrics.expired })}
                />
                <Chip
                  variant="outlined"
                  color="success"
                  icon={<CheckCircleOutlineIcon />}
                  label={t('managedAccounts.hero.chips.distributionOn', {
                    defaultValue: 'Distribution ON: {{count}}',
                    count: accountMetrics.distributionOn
                  })}
                />
                {!isResellerScopedView ? (
                  <Chip
                    variant="outlined"
                    color="info"
                    icon={<EmailOutlinedIcon />}
                    label={t('managedAccounts.hero.chips.inbound', { defaultValue: 'Inbound events: {{count}}', count: eventMetrics.total })}
                  />
                ) : null}
              </Stack>
              {isResellerScopedView ? (
                <Alert severity="info" variant="outlined">
                  {t(
                    'managedAccounts.resellerScopeInfo',
                    'This view is scoped to the managed accounts linked to your authenticated reseller user.'
                  )}
                </Alert>
              ) : null}
            </Stack>
          </CardContent>
        </Card>

        <Tabs value={tab} onChange={(_, next) => setTab(next)} variant="scrollable" scrollButtons="auto" sx={tabsSx}>
          <Tab label={t('managedAccounts.tabs.overview', 'Overview')} />
          <Tab label={t('managedAccounts.tabs.accounts', 'Managed Accounts')} />
          {!isResellerScopedView ? <Tab label={t('managedAccounts.tabs.providers', 'Providers')} /> : null}
          {!isResellerScopedView ? <Tab label={t('managedAccounts.tabs.inbound', 'Inbound')} /> : null}
          {!isResellerScopedView ? <Tab label={t('managedAccounts.tabs.reports', 'Reports')} /> : null}
        </Tabs>

        {loading ? <LinearProgress /> : null}

        {tab === 0 ? (
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
              <ResponsiveMetricGrid columns={{ xs: 1, md: 2, lg: 4 }}>
                <MetricCard
                  title={t('managedAccounts.metrics.totalAccounts', 'Total Accounts')}
                  value={accountMetrics.total}
                  helper={t('managedAccounts.metrics.totalAccountsHelper', 'Registered accounts')}
                  icon={<HubOutlinedIcon />}
                  color="primary"
                />
                <MetricCard
                  title={t('managedAccounts.metrics.active', 'Active')}
                  value={accountMetrics.active}
                  helper={t('managedAccounts.metrics.activeHelper', 'ACTIVE status')}
                  icon={<CheckCircleOutlineIcon />}
                  color="success"
                />
                <MetricCard
                  title={t('managedAccounts.metrics.dueToday', 'Due Today')}
                  value={accountMetrics.dueToday}
                  helper={t('managedAccounts.metrics.dueTodayHelper', 'Immediate action')}
                  icon={<HourglassTopIcon />}
                  color="warning"
                />
                <MetricCard
                  title={t('managedAccounts.metrics.expired', 'Expired')}
                  value={accountMetrics.expired}
                  helper={t('managedAccounts.metrics.expiredHelper', 'Potential churn risk')}
                  icon={<ReportProblemOutlinedIcon />}
                  color="error"
                />
              </ResponsiveMetricGrid>
            </Grid>

            <Grid item xs={12} md={8}>
              <Card sx={(theme) => panelCardSx(theme)}>
                <CardContent>
                  <Typography variant="h4">{t('managedAccounts.overview.expiringTitle', 'Accounts with near expiration')}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t('managedAccounts.overview.expiringSubtitle', 'Next 30 days, sorted by criticality')}
                  </Typography>
                  <Divider sx={{ my: 1.5 }} />

                  <TableContainer sx={(theme) => tableContainerSx(theme)}>
                    <Table size="small" sx={{ minWidth: { xs: 920, md: '100%' } }}>
                      <TableHead>
                        <TableRow sx={(theme) => tableHeadRowSx(theme)}>
                          <TableCell>{t('managedAccounts.table.account', 'Account')}</TableCell>
                          <TableCell>{t('managedAccounts.table.alias', 'Alias')}</TableCell>
                          <TableCell>{t('managedAccounts.table.provider', 'Provider')}</TableCell>
                          <TableCell>{t('managedAccounts.table.expiration', 'Expiration')}</TableCell>
                          <TableCell>{t('managedAccounts.table.status', 'Status')}</TableCell>
                          <TableCell>{t('managedAccounts.table.distribution', 'Distribution')}</TableCell>
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
                                  <Typography variant="body2">{formatDate(row.expirationDate, dateLocale)}</Typography>
                                  <Chip size="small" color={meta.chipColor} label={expirationLabel(meta, t)} sx={expirationChipSx(meta)} />
                                </Stack>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  size="small"
                                  color={statusColor(row.accountStatus)}
                                  label={t(`managedAccounts.statusValues.${row.accountStatus}`, row.accountStatus || '-')}
                                />
                              </TableCell>
                              <TableCell>
                                <Chip
                                  size="small"
                                  color={row.allowDistribution ? 'success' : 'default'}
                                  label={row.allowDistribution ? t('managedAccounts.options.on', 'ON') : t('managedAccounts.options.off', 'OFF')}
                                />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                        {!topExpiringAccounts.length ? (
                          <TableRow>
                            <TableCell colSpan={6}>{t('managedAccounts.empty.noExpiring', 'No accounts due within 30 days')}</TableCell>
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
                {isResellerScopedView ? (
                  <>
                    <MetricCard
                      title={t('managedAccounts.metrics.distributionOn', 'Distribution ON')}
                      value={accountMetrics.distributionOn}
                      helper={t('managedAccounts.metrics.distributionOnHelper', 'Accounts currently enabled for distribution')}
                      icon={<MarkEmailReadOutlinedIcon />}
                      color="success"
                    />
                    <MetricCard
                      title={t('managedAccounts.metrics.dueIn7', 'Due in 7 Days')}
                      value={accountMetrics.dueIn7}
                      helper={t('managedAccounts.metrics.dueIn7Helper', 'Accounts that need follow-up soon')}
                      icon={<ReportProblemOutlinedIcon />}
                      color="warning"
                    />
                  </>
                ) : (
                  <>
                    <MetricCard
                      title={t('managedAccounts.metrics.inboundDistributed', 'Inbound Distributed')}
                      value={eventMetrics.distributed}
                      helper={t('managedAccounts.metrics.failedCount', { defaultValue: 'Failed: {{count}}', count: eventMetrics.failed })}
                      icon={<MarkEmailReadOutlinedIcon />}
                      color="success"
                    />
                    <MetricCard
                      title={t('managedAccounts.metrics.inboundUnresolved', 'Inbound Unresolved')}
                      value={eventMetrics.unresolved}
                      helper={t('managedAccounts.metrics.inboundUnresolvedHelper', 'Without resolved alias')}
                      icon={<ReportProblemOutlinedIcon />}
                      color="warning"
                    />
                  </>
                )}
                <MetricCard
                  title={t('managedAccounts.metrics.dueIn30', 'Due in 30 Days')}
                  value={accountMetrics.dueIn30}
                  helper={t('managedAccounts.metrics.dueIn30Helper', 'Includes accounts due today')}
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
              <Card sx={(theme) => panelCardSx(theme)}>
                <CardContent>
                  <Grid container spacing={1.5} alignItems="center">
                    <Grid item xs={12} md={3.3}>
                      <TextField
                        fullWidth
                        size="small"
                        label={t('managedAccounts.filters.searchAccount', 'Search account')}
                        sx={fieldSx}
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
                        label={t('managedAccounts.table.status', 'Status')}
                        sx={fieldSx}
                        value={accountStatusFilter}
                        onChange={(event) => setAccountStatusFilter(event.target.value)}
                      >
                        <MenuItem value="ALL">{t('managedAccounts.options.all', 'All')}</MenuItem>
                        {accountStatusOptions.map((it) => (
                          <MenuItem key={it} value={it}>
                            {t(`managedAccounts.statusValues.${it}`, it)}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} md={2.2}>
                      <TextField
                        fullWidth
                        select
                        size="small"
                        label={t('managedAccounts.table.provider', 'Provider')}
                        sx={fieldSx}
                        value={accountProviderFilter}
                        onChange={(event) => setAccountProviderFilter(event.target.value)}
                      >
                        <MenuItem value="ALL">{t('managedAccounts.options.all', 'All')}</MenuItem>
                        {accountProviderOptions.map((p) => (
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
                        label={t('managedAccounts.filters.expiration', 'Expiration')}
                        sx={fieldSx}
                        value={accountExpiryFilter}
                        onChange={(event) => setAccountExpiryFilter(event.target.value)}
                      >
                        <MenuItem value="ALL">{t('managedAccounts.options.all', 'All')}</MenuItem>
                        <MenuItem value="EXPIRED">{t('managedAccounts.options.expired', 'Expired')}</MenuItem>
                        <MenuItem value="TODAY">{t('managedAccounts.options.dueToday', 'Due today')}</MenuItem>
                        <MenuItem value="7D">{t('managedAccounts.options.next7Days', 'Next 7 days')}</MenuItem>
                        <MenuItem value="30D">{t('managedAccounts.options.next30Days', 'Next 30 days')}</MenuItem>
                        <MenuItem value="NO_DATE">{t('managedAccounts.options.noDate', 'No date')}</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} md={1.8}>
                      <TextField
                        fullWidth
                        select
                        size="small"
                        label={t('managedAccounts.table.distribution', 'Distribution')}
                        sx={fieldSx}
                        value={accountDistributionFilter}
                        onChange={(event) => setAccountDistributionFilter(event.target.value)}
                      >
                        <MenuItem value="ALL">{t('managedAccounts.options.all', 'All')}</MenuItem>
                        <MenuItem value="ON">{t('managedAccounts.options.on', 'ON')}</MenuItem>
                        <MenuItem value="OFF">{t('managedAccounts.options.off', 'OFF')}</MenuItem>
                      </TextField>
                    </Grid>
                    {canManageAccounts ? (
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
                            {t('managedAccounts.actions.newAccount', 'New')}
                          </Button>
                        </Stack>
                      </Grid>
                    ) : null}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <TableContainer component={Card} sx={(theme) => tableContainerSx(theme)}>
                <Table size="small" sx={{ minWidth: { xs: 1220, md: '100%' } }}>
                  <TableHead>
                    <TableRow sx={(theme) => tableHeadRowSx(theme)}>
                      <TableCell>{t('managedAccounts.table.id', 'ID')}</TableCell>
                      <TableCell>{t('managedAccounts.table.accountName', 'Account')}</TableCell>
                      <TableCell>{t('managedAccounts.table.alias', 'Alias')}</TableCell>
                      <TableCell>{t('managedAccounts.table.provider', 'Provider')}</TableCell>
                      <TableCell>{t('managedAccounts.table.customer', 'Customer')}</TableCell>
                      <TableCell>{t('managedAccounts.table.expiration', 'Expiration')}</TableCell>
                      <TableCell>{t('managedAccounts.table.lastEmail', 'Last email')}</TableCell>
                      <TableCell>{t('managedAccounts.table.status', 'Status')}</TableCell>
                      <TableCell>{t('managedAccounts.table.distribution', 'Distribution')}</TableCell>
                      <TableCell>{t('managedAccounts.table.createdBy', 'Created by')}</TableCell>
                      {canManageAccounts ? <TableCell>{t('managedAccounts.table.actions', 'Actions')}</TableCell> : null}
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
                              <Typography variant="body2">{formatDate(row.expirationDate, dateLocale)}</Typography>
                              <Chip size="small" color={exp.chipColor} label={expirationLabel(exp, t)} sx={expirationChipSx(exp)} />
                            </Stack>
                          </TableCell>
                          <TableCell>{formatDateTime(row.lastEmailReceivedAt, dateLocale)}</TableCell>
                          <TableCell>
                            <Chip
                              size="small"
                              color={statusColor(row.accountStatus)}
                              label={t(`managedAccounts.statusValues.${row.accountStatus}`, row.accountStatus || '-')}
                            />
                          </TableCell>
                          <TableCell>
                            <FormControlLabel
                              sx={{ m: 0 }}
                              control={
                                <Switch
                                  checked={Boolean(row.allowDistribution)}
                                  disabled={!canManageAccounts}
                                  onChange={(_, checked) => patchDistribution(row.id, checked)}
                                />
                              }
                              label={row.allowDistribution ? t('managedAccounts.options.on', 'ON') : t('managedAccounts.options.off', 'OFF')}
                            />
                          </TableCell>
                          <TableCell>{row.createdBy || '-'}</TableCell>
                          {canManageAccounts ? (
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
                                  {t('actions.edit', 'Edit')}
                                </Button>
                                <TextField
                                  select
                                  size="small"
                                  value={row.accountStatus || 'ACTIVE'}
                                  onChange={(event) => patchAccountStatus(row.id, event.target.value)}
                                  sx={(theme) => ({ ...fieldSx(theme), minWidth: 140 })}
                                >
                                  {accountStatusOptions.map((it) => (
                                    <MenuItem key={it} value={it}>
                                      {t(`managedAccounts.statusValues.${it}`, it)}
                                    </MenuItem>
                                  ))}
                                </TextField>
                              </Stack>
                            </TableCell>
                          ) : null}
                        </TableRow>
                      );
                    })}
                    {!pagedAccounts.length ? (
                      <TableRow>
                        <TableCell colSpan={canManageAccounts ? 11 : 10}>
                          {t('managedAccounts.empty.noAccounts', 'No accounts for selected filters')}
                        </TableCell>
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
                  sx={tablePaginationSx}
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

        {!isResellerScopedView && tab === 2 ? (
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
              <Card sx={(theme) => panelCardSx(theme)}>
                <CardContent>
                  <Grid container spacing={1.5} alignItems="center">
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        size="small"
                        label={t('managedAccounts.filters.searchProvider', 'Search provider')}
                        sx={fieldSx}
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
                          {t('managedAccounts.actions.newProvider', 'New Provider')}
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <TableContainer component={Card} sx={(theme) => tableContainerSx(theme)}>
                <Table size="small" sx={{ minWidth: { xs: 1080, md: '100%' } }}>
                  <TableHead>
                    <TableRow sx={(theme) => tableHeadRowSx(theme)}>
                      <TableCell>{t('managedAccounts.table.id', 'ID')}</TableCell>
                      <TableCell>{t('managedAccounts.provider.code', 'Code')}</TableCell>
                      <TableCell>{t('managedAccounts.provider.name', 'Name')}</TableCell>
                      <TableCell>{t('managedAccounts.provider.description', 'Description')}</TableCell>
                      <TableCell>{t('managedAccounts.table.status', 'Status')}</TableCell>
                      <TableCell>{t('managedAccounts.table.createdBy', 'Created by')}</TableCell>
                      <TableCell>{t('managedAccounts.table.actions', 'Actions')}</TableCell>
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
                          <Chip size="small" color={statusColor(row.status)} label={t(`managedAccounts.statusValues.${row.status}`, row.status || '-')} />
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
                              {t('actions.edit', 'Edit')}
                            </Button>
                            <TextField
                              select
                              size="small"
                              value={row.status || 'ACTIVE'}
                              onChange={(event) => patchProviderStatus(row.id, event.target.value)}
                              sx={(theme) => ({ ...fieldSx(theme), minWidth: 130 })}
                            >
                              {providerStatusOptions.map((it) => (
                                <MenuItem key={it} value={it}>
                                  {t(`managedAccounts.statusValues.${it}`, it)}
                                </MenuItem>
                              ))}
                            </TextField>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                    {!pagedProviders.length ? (
                      <TableRow>
                        <TableCell colSpan={7}>{t('managedAccounts.empty.noProviders', 'No providers for selected filters')}</TableCell>
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
                  sx={tablePaginationSx}
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

        {!isResellerScopedView && tab === 3 ? (
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12} md={4.5}>
              <Card sx={(theme) => panelCardSx(theme)}>
                <CardContent>
                  <Stack spacing={1.2}>
                    <Typography variant="h4">{t('managedAccounts.inbound.processTitle', 'Process Inbound')}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t('managedAccounts.inbound.processSubtitle', 'Manual process for tests or specific reprocessing')}
                    </Typography>
                    <Divider />
                    <TextField
                      label={t('managedAccounts.inbound.mailbox', 'Mailbox')}
                      size="small"
                      sx={fieldSx}
                      value={inboundForm.mailboxAccount}
                      onChange={(event) => setInboundForm((prev) => ({ ...prev, mailboxAccount: event.target.value }))}
                    />
                    <TextField
                      label={t('managedAccounts.inbound.rawMessageId', 'Raw Message ID')}
                      size="small"
                      sx={fieldSx}
                      value={inboundForm.rawMessageId}
                      onChange={(event) => setInboundForm((prev) => ({ ...prev, rawMessageId: event.target.value }))}
                    />
                    <TextField
                      label={t('managedAccounts.inbound.fromEmail', 'From Email')}
                      size="small"
                      sx={fieldSx}
                      value={inboundForm.fromEmail}
                      onChange={(event) => setInboundForm((prev) => ({ ...prev, fromEmail: event.target.value }))}
                    />
                    <TextField
                      label={t('managedAccounts.inbound.toEmail', 'To Email')}
                      size="small"
                      sx={fieldSx}
                      value={inboundForm.toEmail}
                      onChange={(event) => setInboundForm((prev) => ({ ...prev, toEmail: event.target.value }))}
                    />
                    <TextField
                      label={t('managedAccounts.inbound.subject', 'Subject')}
                      size="small"
                      sx={fieldSx}
                      value={inboundForm.subject}
                      onChange={(event) => setInboundForm((prev) => ({ ...prev, subject: event.target.value }))}
                    />
                    <TextField
                      label={t('managedAccounts.inbound.receivedAt', 'Received At')}
                      type="datetime-local"
                      size="small"
                      sx={fieldSx}
                      value={inboundForm.receivedAt}
                      onChange={(event) => setInboundForm((prev) => ({ ...prev, receivedAt: event.target.value }))}
                      InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                      label={t('managedAccounts.inbound.rawHeaders', 'Raw Headers')}
                      size="small"
                      multiline
                      minRows={4}
                      sx={fieldSx}
                      value={inboundForm.rawHeaders}
                      onChange={(event) => setInboundForm((prev) => ({ ...prev, rawHeaders: event.target.value }))}
                    />
                    <TextField
                      label={t('managedAccounts.inbound.bodyPlain', 'Body Plain')}
                      size="small"
                      multiline
                      minRows={4}
                      sx={fieldSx}
                      value={inboundForm.bodyPlain}
                      onChange={(event) => setInboundForm((prev) => ({ ...prev, bodyPlain: event.target.value }))}
                    />

                    <Button variant="contained" onClick={processInbound} disabled={inboundProcessing}>
                      {inboundProcessing
                        ? t('managedAccounts.actions.processing', 'Processing...')
                        : t('managedAccounts.actions.processInbound', 'Process inbound')}
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={7.5}>
              <Stack spacing={2}>
                <Grid container spacing={1.5}>
                  <Grid item xs={12} sm={12} md={6} lg={3}>
                    <MetricCard title={t('managedAccounts.metrics.total', 'Total')} value={eventMetrics.total} icon={<EmailOutlinedIcon />} color="info" />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={3}>
                    <MetricCard
                      title={t('managedAccounts.metrics.distributed', 'Distributed')}
                      value={eventMetrics.distributed}
                      icon={<MarkEmailReadOutlinedIcon />}
                      color="success"
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={3}>
                    <MetricCard title={t('managedAccounts.metrics.failed', 'Failed')} value={eventMetrics.failed} icon={<ReportProblemOutlinedIcon />} color="error" />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={3}>
                    <MetricCard
                      title={t('managedAccounts.metrics.unresolved', 'Unresolved')}
                      value={eventMetrics.unresolved}
                      icon={<WarningAmberIcon />}
                      color="warning"
                    />
                  </Grid>
                </Grid>

                <Card sx={(theme) => panelCardSx(theme)}>
                  <CardContent>
                    <Stack spacing={1.5}>
                      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
                        <TextField
                          fullWidth
                          size="small"
                          label={t('managedAccounts.filters.searchEvent', 'Search event')}
                          sx={fieldSx}
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
                          label={t('managedAccounts.table.status', 'Status')}
                          value={eventStatusFilter}
                          onChange={(event) => setEventStatusFilter(event.target.value)}
                          sx={(theme) => ({ ...fieldSx(theme), minWidth: 200 })}
                        >
                          <MenuItem value="ALL">{t('managedAccounts.options.all', 'All')}</MenuItem>
                          {Array.from(new Set(events.map((it) => String(it.processingStatus || '').toUpperCase()).filter(Boolean))).map(
                            (status) => (
                              <MenuItem key={status} value={status}>
                                {t(`managedAccounts.statusValues.${status}`, status)}
                              </MenuItem>
                            )
                          )}
                        </TextField>
                      </Stack>

                      {lastProcessResult ? (
                        <Alert severity={lastProcessResult.processingStatus === 'FAILED' ? 'error' : 'success'}>
                          {lastProcessResult.message || t('managedAccounts.messages.processExecuted', 'Process executed')}
                        </Alert>
                      ) : null}

                      <TableContainer sx={(theme) => tableContainerSx(theme)}>
                        <Table size="small" sx={{ minWidth: { xs: 980, md: '100%' } }}>
                          <TableHead>
                            <TableRow sx={(theme) => tableHeadRowSx(theme)}>
                              <TableCell>{t('managedAccounts.table.id', 'ID')}</TableCell>
                              <TableCell>{t('managedAccounts.inbound.received', 'Received')}</TableCell>
                              <TableCell>{t('managedAccounts.table.alias', 'Alias')}</TableCell>
                              <TableCell>{t('managedAccounts.table.status', 'Status')}</TableCell>
                              <TableCell>{t('managedAccounts.inbound.error', 'Error')}</TableCell>
                              <TableCell>{t('managedAccounts.inbound.retryMode', 'Retry Mode')}</TableCell>
                              <TableCell>{t('managedAccounts.inbound.retry', 'Retry')}</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {pagedEvents.map((row) => (
                              <TableRow key={row.id}>
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{formatDateTime(row.receivedAt || row.createdAt, dateLocale)}</TableCell>
                                <TableCell>{row.resolvedAlias || t('managedAccounts.options.unresolved', 'UNRESOLVED')}</TableCell>
                                <TableCell>
                                  <Chip
                                    size="small"
                                    color={statusColor(row.processingStatus)}
                                    label={t(`managedAccounts.statusValues.${row.processingStatus}`, row.processingStatus || '-')}
                                  />
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
                                    sx={(theme) => ({ ...fieldSx(theme), minWidth: 165 })}
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
                                    {t('managedAccounts.inbound.retry', 'Retry')}
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                            {!pagedEvents.length ? (
                              <TableRow>
                                <TableCell colSpan={7}>{t('managedAccounts.empty.noEvents', 'No events for selected filters')}</TableCell>
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
                        sx={tablePaginationSx}
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

        {!isResellerScopedView && tab === 4 ? (
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <MetricCard title={t('managedAccounts.metrics.inboundTotal', 'Inbound Total')} value={inboundSummary?.total || 0} icon={<EmailOutlinedIcon />} color="info" />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <MetricCard
                title={t('managedAccounts.metrics.inboundDistributed', 'Inbound Distributed')}
                value={inboundSummary?.distributed || 0}
                icon={<CheckCircleOutlineIcon />}
                color="success"
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <MetricCard title={t('managedAccounts.metrics.sent', 'Sent')} value={distributionSummary?.sent || 0} icon={<MarkEmailReadOutlinedIcon />} color="success" />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <MetricCard title={t('managedAccounts.metrics.failed', 'Failed')} value={distributionSummary?.failed || 0} icon={<ReportProblemOutlinedIcon />} color="error" />
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={(theme) => panelCardSx(theme)}>
                <CardContent>
                  <Typography variant="h4">{t('managedAccounts.reports.byProvider', 'Inbound by Provider')}</Typography>
                  <Divider sx={{ my: 1.5 }} />
                  <Table size="small" sx={{ minWidth: { xs: 760, md: '100%' } }}>
                    <TableHead>
                      <TableRow sx={(theme) => tableHeadRowSx(theme)}>
                        <TableCell>{t('managedAccounts.table.provider', 'Provider')}</TableCell>
                        <TableCell align="right">{t('managedAccounts.reports.inbound', 'Inbound')}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {providerSummary.map((it, idx) => (
                        <TableRow key={`${it.providerId || idx}-${it.providerCode || 'x'}`}>
                          <TableCell>{it.providerCode || t('managedAccounts.options.unassigned', 'UNASSIGNED')}</TableCell>
                          <TableCell align="right">{it.totalInbound}</TableCell>
                        </TableRow>
                      ))}
                      {!providerSummary.length ? (
                        <TableRow>
                          <TableCell colSpan={2}>{t('managedAccounts.empty.noData', 'No data')}</TableCell>
                        </TableRow>
                      ) : null}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={(theme) => panelCardSx(theme)}>
                <CardContent>
                  <Typography variant="h4">{t('managedAccounts.reports.byAlias', 'Inbound by Alias')}</Typography>
                  <Divider sx={{ my: 1.5 }} />
                  <Table size="small" sx={{ minWidth: { xs: 760, md: '100%' } }}>
                    <TableHead>
                      <TableRow sx={(theme) => tableHeadRowSx(theme)}>
                        <TableCell>{t('managedAccounts.table.alias', 'Alias')}</TableCell>
                        <TableCell align="right">{t('managedAccounts.reports.inbound', 'Inbound')}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {aliasSummary.map((it, idx) => (
                        <TableRow key={`${it.resolvedAlias || idx}`}>
                          <TableCell>{it.resolvedAlias || t('managedAccounts.options.unresolved', 'UNRESOLVED')}</TableCell>
                          <TableCell align="right">{it.totalInbound}</TableCell>
                        </TableRow>
                      ))}
                      {!aliasSummary.length ? (
                        <TableRow>
                          <TableCell colSpan={2}>{t('managedAccounts.empty.noData', 'No data')}</TableCell>
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
        fullScreen={isMobile}
        maxWidth="sm"
        PaperProps={{ sx: modalPaperSx }}
      >
        <DialogTitleWithClose sx={modalHeaderSx} onClose={() => setProviderModalOpen(false)}>
          <Stack spacing={0.5}>
            <Typography variant="h4">
              {providerForm.id ? t('managedAccounts.provider.editTitle', 'Edit Provider') : t('managedAccounts.provider.newTitle', 'New Provider')}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t('managedAccounts.provider.subtitle', 'Define the provider that groups aliases and managed accounts.')}
            </Typography>
          </Stack>
        </DialogTitleWithClose>
        <DialogContent sx={modalContentSx}>
          <Box sx={modalSectionSx}>
            <Stack spacing={1.6}>
              <TextField
                size="small"
                label={t('managedAccounts.provider.code', 'Code')}
                sx={fieldSx}
                value={providerForm.code}
                onChange={(event) => setProviderForm((prev) => ({ ...prev, code: event.target.value }))}
              />
              <TextField
                size="small"
                label={t('managedAccounts.provider.name', 'Name')}
                sx={fieldSx}
                value={providerForm.name}
                onChange={(event) => setProviderForm((prev) => ({ ...prev, name: event.target.value }))}
              />
              <TextField
                size="small"
                label={t('managedAccounts.provider.description', 'Description')}
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
            {t('managedAccounts.actions.cancel', 'Cancel')}
          </Button>
          <Button variant="contained" onClick={saveProvider} disabled={providerSaving}>
            {providerSaving ? t('managedAccounts.actions.saving', 'Saving...') : t('managedAccounts.actions.saveProvider', 'Save Provider')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={accountModalOpen} onClose={() => setAccountModalOpen(false)} fullWidth fullScreen={isMobile} maxWidth="md" PaperProps={{ sx: modalPaperSx }}>
        <DialogTitleWithClose sx={modalHeaderSx} onClose={() => setAccountModalOpen(false)}>
          <Stack spacing={0.5}>
            <Typography variant="h4">
              {accountForm.id
                ? t('managedAccounts.account.editTitle', 'Edit Managed Account')
                : t('managedAccounts.account.newTitle', 'New Managed Account')}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t('managedAccounts.account.subtitle', 'Configure identity, expiration and alias distribution rules.')}
            </Typography>
          </Stack>
        </DialogTitleWithClose>
        <DialogContent sx={modalContentSx}>
          <Stack spacing={2}>
            <Box sx={modalSectionSx}>
              <Stack spacing={1.6}>
                <Typography variant="subtitle2">{t('managedAccounts.account.sectionIdentity', 'Identity and relationship')}</Typography>
                <Grid container spacing={1.6}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label={t('managedAccounts.account.accountCode', 'Account Code')}
                      sx={fieldSx}
                      value={accountForm.accountCode}
                      onChange={(event) => setAccountForm((prev) => ({ ...prev, accountCode: event.target.value }))}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label={t('managedAccounts.account.displayName', 'Display Name')}
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
                      label={t('managedAccounts.table.provider', 'Provider')}
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
                    <CustomerAutocomplete
                      value={accountForm.customerId}
                      onChange={(_, id) => setAccountForm((prev) => ({ ...prev, customerId: id }))}
                      label={t('managedAccounts.table.customer', 'Customer')}
                      textFieldSx={fieldSx}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label={t('managedAccounts.account.aliasEmail', 'Alias Email')}
                      sx={fieldSx}
                      value={accountForm.aliasEmail}
                      onChange={(event) => setAccountForm((prev) => ({ ...prev, aliasEmail: event.target.value }))}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label={t('managedAccounts.account.principalReference', 'Principal Reference')}
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
                <Typography variant="subtitle2">{t('managedAccounts.account.sectionOperation', 'Validity and operation')}</Typography>
                <Grid container spacing={1.6}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      size="small"
                      select
                      label={t('managedAccounts.table.status', 'Status')}
                      sx={fieldSx}
                      value={accountForm.accountStatus}
                      onChange={(event) => setAccountForm((prev) => ({ ...prev, accountStatus: event.target.value }))}
                    >
                      {accountStatusOptions.map((it) => (
                        <MenuItem key={it} value={it}>
                          {t(`managedAccounts.statusValues.${it}`, it)}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      size="small"
                      type="date"
                      label={t('managedAccounts.account.expirationDate', 'Expiration Date')}
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
                      label={t('managedAccounts.account.renewalDate', 'Renewal Date')}
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
                        border: `1px dashed ${withAlpha(theme.vars?.palette?.divider || theme.palette.divider, 0.95)}`,
                        backgroundColor: withAlpha(theme.vars?.palette?.success?.main || theme.palette.success.main, theme.palette.mode === 'dark' ? 0.14 : 0.08)
                      })}
                    >
                      <FormControlLabel
                        control={
                          <Switch
                            checked={Boolean(accountForm.allowDistribution)}
                            onChange={(_, checked) => setAccountForm((prev) => ({ ...prev, allowDistribution: checked }))}
                          />
                        }
                        label={t('managedAccounts.account.allowDistribution', 'Allow Distribution')}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      multiline
                      minRows={3}
                      label={t('managedAccounts.account.notes', 'Notes')}
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
            {t('managedAccounts.actions.cancel', 'Cancel')}
          </Button>
          <Button variant="contained" onClick={saveAccount} disabled={accountSaving}>
            {accountSaving ? t('managedAccounts.actions.saving', 'Saving...') : t('managedAccounts.actions.saveAccount', 'Save Account')}
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
}
