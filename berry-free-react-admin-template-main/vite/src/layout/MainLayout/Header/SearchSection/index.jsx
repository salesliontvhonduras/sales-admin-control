import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import LinearProgress from '@mui/material/LinearProgress';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import OutlinedInput from '@mui/material/OutlinedInput';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import useAuth from 'hooks/useAuth';
import Transitions from 'ui-component/extended/Transitions';
import { useLionTvOverview } from 'api/liontv-overview';

// assets
import { IconAdjustmentsHorizontal, IconSearch, IconX } from '@tabler/icons-react';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import NorthEastRoundedIcon from '@mui/icons-material/NorthEastRounded';
import PaidRoundedIcon from '@mui/icons-material/PaidRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import RouterRoundedIcon from '@mui/icons-material/RouterRounded';
import VpnKeyRoundedIcon from '@mui/icons-material/VpnKeyRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';

const RECENT_SEARCH_KEY = 'liontv_header_search_recent_v1';
const REFRESH_INTERVAL_MS = 180000;
const MAX_RECENT = 6;

const ROUTES = {
  dashboard: '/liontv/dashboard',
  customers: '/liontv/customers',
  subscriptions: '/liontv/subscriptions',
  licenses: '/liontv/licenses',
  lines: '/liontv/lines',
  managedAccounts: '/liontv/managed-accounts',
  invoices: '/liontv/invoices',
  commitments: '/liontv/payment-commitments',
  crm: '/liontv/crm',
  demos: '/liontv/demos',
  plusLines: '/liontv/plus-lines'
};

const QUICK_COMMANDS_CONFIG = [
  {
    id: 'cmd-dashboard',
    kind: 'comando',
    titleKey: 'headerSearch.quickCommands.dashboard.title',
    subtitleKey: 'headerSearch.quickCommands.dashboard.subtitle',
    route: ROUTES.dashboard,
    keywords: ['dashboard', 'kpi', 'seguimiento', 'alertas']
  },
  {
    id: 'cmd-customers',
    kind: 'comando',
    titleKey: 'headerSearch.quickCommands.customers.title',
    subtitleKey: 'headerSearch.quickCommands.customers.subtitle',
    route: ROUTES.customers,
    keywords: ['clientes', 'customer', 'crm']
  },
  {
    id: 'cmd-subscriptions',
    kind: 'comando',
    titleKey: 'headerSearch.quickCommands.subscriptions.title',
    subtitleKey: 'headerSearch.quickCommands.subscriptions.subtitle',
    route: ROUTES.subscriptions,
    keywords: ['suscripciones', 'planes', 'renewal']
  },
  {
    id: 'cmd-invoices',
    kind: 'comando',
    titleKey: 'headerSearch.quickCommands.invoices.title',
    subtitleKey: 'headerSearch.quickCommands.invoices.subtitle',
    route: ROUTES.invoices,
    keywords: ['facturas', 'invoice', 'cobros']
  },
  {
    id: 'cmd-commitments',
    kind: 'comando',
    titleKey: 'headerSearch.quickCommands.commitments.title',
    subtitleKey: 'headerSearch.quickCommands.commitments.subtitle',
    route: ROUTES.commitments,
    keywords: ['compromisos', 'promesas', 'pago']
  },
  {
    id: 'cmd-managed-accounts',
    kind: 'comando',
    titleKey: 'headerSearch.quickCommands.managedAccounts.title',
    subtitleKey: 'headerSearch.quickCommands.managedAccounts.subtitle',
    route: ROUTES.managedAccounts,
    keywords: ['managed', 'accounts', 'alias', 'mail']
  },
  {
    id: 'cmd-licenses',
    kind: 'comando',
    titleKey: 'headerSearch.quickCommands.licenses.title',
    subtitleKey: 'headerSearch.quickCommands.licenses.subtitle',
    route: ROUTES.licenses,
    keywords: ['licencias', 'keys', 'device']
  },
  {
    id: 'cmd-lines',
    kind: 'comando',
    titleKey: 'headerSearch.quickCommands.lines.title',
    subtitleKey: 'headerSearch.quickCommands.lines.subtitle',
    route: ROUTES.lines,
    keywords: ['lineas', 'lines', 'plus']
  }
];

const KIND_LABEL_KEYS = {
  cliente: 'customer',
  suscripcion: 'subscription',
  licencia: 'license',
  linea: 'line',
  account: 'account',
  factura: 'invoice',
  compromiso: 'commitment',
  comando: 'command'
};

function buildQuickCommands(t) {
  return QUICK_COMMANDS_CONFIG.map((command) => ({
    ...command,
    typeLabel: t('headerSearch.kinds.command'),
    title: t(command.titleKey),
    subtitle: t(command.subtitleKey)
  }));
}

function getStoredRecents() {
  try {
    const raw = localStorage.getItem(RECENT_SEARCH_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistRecents(value) {
  try {
    localStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(value));
  } catch {
    // noop
  }
}

function pickFirst(item, keys, fallback = null) {
  for (const key of keys) {
    const value = item?.[key];
    if (value !== undefined && value !== null && value !== '') return value;
  }
  return fallback;
}

function toUpper(value) {
  return String(value || '')
    .trim()
    .toUpperCase();
}

function parseDate(value) {
  if (!value) return null;
  const raw = String(value).trim();
  if (!raw) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    const date = new Date(`${raw}T00:00:00`);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date;
}

function startOfDay(date = new Date()) {
  const cloned = new Date(date);
  cloned.setHours(0, 0, 0, 0);
  return cloned;
}

function daysUntil(value) {
  const date = parseDate(value);
  if (!date) return null;
  return Math.round((startOfDay(date).getTime() - startOfDay(new Date()).getTime()) / 86400000);
}

function isStatusActive(status) {
  const normalized = toUpper(status);
  return !['CANCELLED', 'REMOVED', 'INACTIVE', 'EXPIRED'].includes(normalized);
}

function normalizeString(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function itemSearchBlob(item) {
  return normalizeString(
    [
      item.title,
      item.subtitle,
      item.code,
      item.customerName,
      item.status,
      item.typeLabel,
      Array.isArray(item.keywords) ? item.keywords.join(' ') : ''
    ].join(' ')
  );
}

function buildSearchIndex(payload = {}, t) {
  const kindLabel = (kind) => t(`headerSearch.kinds.${KIND_LABEL_KEYS[kind] || 'result'}`);
  const customers = payload.customers || [];
  const customerNameMap = customers.reduce((acc, customer) => {
    const id = pickFirst(customer, ['customerId', 'id', 'customer_id']);
    if (!id) return acc;
    const name = pickFirst(customer, ['customerFullname', 'fullName', 'customer_name', 'username', 'customerMail', 'email'], String(id));
    acc[id] = name;
    return acc;
  }, {});

  const customerItems = customers.map((customer) => {
    const id = pickFirst(customer, ['customerId', 'id', 'customer_id'], '-');
    const customerName = pickFirst(
      customer,
      ['customerFullname', 'fullName', 'customer_name', 'username'],
      t('headerSearch.labels.customerById', { id })
    );
    const email = pickFirst(customer, ['customerMail', 'email'], '');
    return {
      id: `customer-${id}`,
      kind: 'cliente',
      typeLabel: kindLabel('cliente'),
      title: customerName,
      subtitle: email || t('headerSearch.labels.idValue', { id }),
      code: String(id),
      route: ROUTES.customers,
      status: toUpper(pickFirst(customer, ['status'], 'ACTIVE')),
      dueDays: null,
      customerName,
      keywords: [email, customerName]
    };
  });

  const subscriptionItems = (payload.subscriptions || []).map((subscription) => {
    const id = pickFirst(subscription, ['subscriptionId', 'id'], '-');
    const customerId = pickFirst(subscription, ['customerId', 'customer_id']);
    const customerName = customerNameMap[customerId] || '-';
    const packageName = pickFirst(subscription, ['packageName', 'package_name'], t('headerSearch.labels.planFallback'));
    const dueDate = pickFirst(subscription, ['renewalDate', 'renewal_date', 'expDate', 'exp_date']);
    return {
      id: `subscription-${id}`,
      kind: 'suscripcion',
      typeLabel: kindLabel('suscripcion'),
      title: `${packageName} #${id}`,
      subtitle: t('headerSearch.labels.customerValue', { customer: customerName }),
      code: String(id),
      route: ROUTES.subscriptions,
      status: toUpper(pickFirst(subscription, ['status'], 'ACTIVE')),
      dueDays: daysUntil(dueDate),
      customerName,
      keywords: [packageName, customerName]
    };
  });

  const licenseItems = (payload.licenses || []).map((license) => {
    const id = pickFirst(license, ['licenseId', 'id', 'license_id'], '-');
    const customerId = pickFirst(license, ['customerId', 'customer_id']);
    const customerName = customerNameMap[customerId] || '-';
    const appName = pickFirst(license, ['app'], t('headerSearch.labels.licenseFallback'));
    const dueDate = pickFirst(license, ['expireAt', 'expire_at', 'expDate', 'exp_date']);
    return {
      id: `license-${id}`,
      kind: 'licencia',
      typeLabel: kindLabel('licencia'),
      title: `${appName} #${id}`,
      subtitle: t('headerSearch.labels.customerValue', { customer: customerName }),
      code: String(id),
      route: ROUTES.licenses,
      status: toUpper(pickFirst(license, ['status'], 'ACTIVE')),
      dueDays: daysUntil(dueDate),
      customerName,
      keywords: [appName, customerName, pickFirst(license, ['macAddress', 'deviceKey'], '')]
    };
  });

  const lineItems = (payload.lines || []).map((line) => {
    const id = pickFirst(line, ['lineId', 'line_id', 'id'], '-');
    const username = pickFirst(line, ['username'], `line-${id}`);
    const provider = pickFirst(line, ['provider', 'lineProvider', 'line_provider'], '');
    const dueDate = pickFirst(line, ['exp_date', 'expDate']);
    const enabled = pickFirst(line, ['enabled'], true);
    return {
      id: `line-${id}`,
      kind: 'linea',
      typeLabel: kindLabel('linea'),
      title: `${username} #${id}`,
      subtitle: provider || t('headerSearch.labels.noProvider'),
      code: String(id),
      route: ROUTES.lines,
      status: toUpper(pickFirst(line, ['status'], enabled ? 'ACTIVE' : 'INACTIVE')),
      dueDays: daysUntil(dueDate),
      customerName: '-',
      keywords: [username, provider]
    };
  });

  const accountItems = (payload.managedAccounts || []).map((account) => {
    const id = pickFirst(account, ['id', 'managedAccountId', 'managed_account_id'], '-');
    const alias = pickFirst(account, ['aliasEmail', 'alias_email'], '-');
    const accountCode = pickFirst(account, ['accountCode', 'account_code'], `ACC-${id}`);
    const displayName = pickFirst(account, ['displayName', 'display_name'], alias);
    const dueDate = pickFirst(account, ['expirationDate', 'expiration_date']);
    return {
      id: `account-${id}`,
      kind: 'account',
      typeLabel: kindLabel('account'),
      title: `${accountCode} · ${alias}`,
      subtitle: displayName,
      code: String(id),
      route: ROUTES.managedAccounts,
      status: toUpper(pickFirst(account, ['accountStatus', 'status'], 'ACTIVE')),
      dueDays: daysUntil(dueDate),
      customerName: displayName,
      keywords: [accountCode, alias, displayName]
    };
  });

  const invoiceItems = (payload.invoices || []).map((invoice) => {
    const id = pickFirst(invoice, ['invoiceId', 'invoice_id', 'id'], '-');
    const customerId = pickFirst(invoice, ['customerId', 'customer_id']);
    const customerName = customerNameMap[customerId] || '-';
    const dueDate = pickFirst(invoice, ['dueDate', 'due_date', 'expirationDate', 'expiration_date']);
    return {
      id: `invoice-${id}`,
      kind: 'factura',
      typeLabel: kindLabel('factura'),
      title: t('headerSearch.reference.invoice', { id }),
      subtitle: t('headerSearch.labels.customerValue', { customer: customerName }),
      code: String(id),
      route: ROUTES.invoices,
      status: toUpper(pickFirst(invoice, ['status'], 'PENDING')),
      dueDays: daysUntil(dueDate),
      customerName,
      keywords: [customerName]
    };
  });

  const commitmentItems = (payload.commitments || []).map((commitment) => {
    const id = pickFirst(commitment, ['paymentCommitmentId', 'payment_commitment_id', 'id'], '-');
    const customerId = pickFirst(commitment, ['customerId', 'customer_id']);
    const customerName = customerNameMap[customerId] || '-';
    const dueDate = pickFirst(commitment, ['promisedPaymentDate', 'promised_payment_date', 'commitmentDate', 'commitment_date']);
    return {
      id: `commitment-${id}`,
      kind: 'compromiso',
      typeLabel: kindLabel('compromiso'),
      title: t('headerSearch.reference.commitment', { id }),
      subtitle: t('headerSearch.labels.customerValue', { customer: customerName }),
      code: String(id),
      route: ROUTES.commitments,
      status: toUpper(pickFirst(commitment, ['status'], 'PENDING')),
      dueDays: daysUntil(dueDate),
      customerName,
      keywords: [customerName]
    };
  });

  return [
    ...buildQuickCommands(t),
    ...customerItems,
    ...subscriptionItems,
    ...licenseItems,
    ...lineItems,
    ...accountItems,
    ...invoiceItems,
    ...commitmentItems
  ];
}

function kindIcon(kind, theme) {
  if (kind === 'comando') return <BoltRoundedIcon fontSize="small" sx={{ color: theme.palette.warning.main }} />;
  if (kind === 'cliente') return <PeopleAltRoundedIcon fontSize="small" sx={{ color: theme.palette.info.main }} />;
  if (kind === 'suscripcion') return <ReceiptLongRoundedIcon fontSize="small" sx={{ color: theme.palette.success.main }} />;
  if (kind === 'licencia') return <VpnKeyRoundedIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />;
  if (kind === 'linea') return <RouterRoundedIcon fontSize="small" sx={{ color: theme.palette.secondary.main }} />;
  if (kind === 'account') return <MailOutlineRoundedIcon fontSize="small" sx={{ color: theme.palette.warning.main }} />;
  if (kind === 'factura') return <PaidRoundedIcon fontSize="small" sx={{ color: theme.palette.error.main }} />;
  if (kind === 'compromiso') return <WarningAmberRoundedIcon fontSize="small" sx={{ color: theme.palette.warning.dark }} />;
  return <DashboardRoundedIcon fontSize="small" />;
}

function statusColor(status) {
  const normalized = toUpper(status);
  if (['ACTIVE', 'PAID', 'PROCESSED', 'DISTRIBUTED'].includes(normalized)) return 'success';
  if (['PENDING', 'SUSPENDED', 'ALIAS_RESOLVED'].includes(normalized)) return 'warning';
  if (['EXPIRED', 'FAILED', 'CANCELLED', 'INACTIVE'].includes(normalized)) return 'error';
  return 'default';
}

function dueChipLabel(days, t) {
  if (days === null || days === undefined || Number.isNaN(Number(days))) return null;
  const normalizedDays = Number(days);
  if (normalizedDays < 0) return t('headerSearch.due.overdue', { days: Math.abs(normalizedDays) });
  if (normalizedDays === 0) return t('headerSearch.due.today');
  if (normalizedDays === 1) return t('headerSearch.due.tomorrow');
  return t('headerSearch.due.inDays', { days: normalizedDays });
}

function parseQueryFilters(query) {
  const rawTerms = normalizeString(query).split(/\s+/).filter(Boolean);
  const filters = { kind: '', status: '', due: '' };
  const terms = [];

  rawTerms.forEach((term) => {
    if (term.startsWith('tipo:')) {
      filters.kind = term.replace('tipo:', '');
      return;
    }
    if (term.startsWith('estado:')) {
      filters.status = term.replace('estado:', '');
      return;
    }
    if (term.startsWith('vence:')) {
      filters.due = term.replace('vence:', '');
      return;
    }
    terms.push(term);
  });

  return { filters, terms };
}

function matchDueFilter(item, dueFilter) {
  if (!dueFilter) return true;
  const days = item.dueDays;
  if (days === null) return false;
  if (dueFilter === 'hoy') return days === 0;
  if (dueFilter === 'manana' || dueFilter === 'mañana') return days === 1;
  if (dueFilter === '7d') return days >= 0 && days <= 7;
  if (dueFilter === 'vencido') return days < 0;
  return true;
}

function HeaderAvatar({ children, ...others }) {
  const theme = useTheme();

  return (
    <Avatar
      variant="rounded"
      sx={{
        ...theme.typography.commonAvatar,
        ...theme.typography.mediumAvatar,
        color: theme.vars.palette.primary.main,
        background: theme.palette.mode === 'dark' ? theme.vars.palette.surface.muted : theme.vars.palette.surface.sunken,
        border: '1px solid',
        borderColor: 'divider',
        '&:hover': {
          color: theme.vars.palette.primary.contrastText,
          background: theme.vars.palette.primary.main
        }
      }}
      {...others}
    >
      {children}
    </Avatar>
  );
}

function SearchInput({
  inputId = 'input-search-header',
  value,
  onChange,
  onFocus,
  inputRef,
  autoFocus = false,
  fullWidth = false,
  showShortcut = true,
  placeholder
}) {
  const theme = useTheme();

  return (
    <OutlinedInput
      id={inputId}
      value={value}
      autoFocus={autoFocus}
      onChange={onChange}
      onFocus={onFocus}
      inputRef={inputRef}
      placeholder={placeholder}
      startAdornment={
        <InputAdornment position="start">
          <IconSearch stroke={1.5} size="16px" />
        </InputAdornment>
      }
      endAdornment={
        <InputAdornment position="end">
          <Stack direction="row" spacing={0.8} alignItems="center">
            <Box sx={{ display: 'inline-flex', color: 'text.secondary', opacity: 0.88 }}>
              <IconAdjustmentsHorizontal stroke={1.5} size="20px" />
            </Box>
            {showShortcut ? (
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: 0.25 }}>
                Ctrl + K
              </Typography>
            ) : null}
          </Stack>
        </InputAdornment>
      }
      sx={(theme) => ({
        width: fullWidth ? '100%' : { md: 280, lg: 470 },
        ml: fullWidth ? 0 : 2,
        px: 0.2,
        borderRadius: 12,
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.surface.muted : theme.palette.surface.sunken,
        '&:hover': {
          backgroundColor: theme.palette.mode === 'dark' ? theme.palette.surface.muted : theme.palette.surface.sunken
        },
        '&.Mui-focused': {
          backgroundColor: theme.palette.mode === 'dark' ? theme.palette.surface.card : theme.palette.background.paper
        },
        '& .MuiInputBase-input': {
          py: 1.25
        },
        [theme.breakpoints.down('lg')]: {
          width: fullWidth ? '100%' : { md: 240, lg: 400 }
        }
      })}
    />
  );
}

function ResultRow({ item, onSelect }) {
  const theme = useTheme();
  const { t } = useTranslation();
  const dueLabel = dueChipLabel(item.dueDays, t);

  return (
    <ListItemButton
      onClick={() => onSelect(item)}
      sx={{
        borderRadius: 1.5,
        border: '1px solid transparent',
        '&:hover': {
          borderColor: theme.palette.divider,
          backgroundColor: theme.palette.action.hover
        }
      }}
    >
      <ListItemIcon sx={{ minWidth: 36 }}>{kindIcon(item.kind, theme)}</ListItemIcon>
      <ListItemText
        primary={
          <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
            <Typography variant="subtitle2" noWrap sx={{ maxWidth: { xs: 180, md: 320 } }}>
              {item.title}
            </Typography>
            <Chip size="small" label={item.typeLabel || t('headerSearch.labels.result')} variant="outlined" />
          </Stack>
        }
        secondary={
          <Stack direction="row" spacing={0.8} alignItems="center" flexWrap="wrap" useFlexGap>
            <Typography variant="caption" color="text.secondary">
              {item.subtitle || '-'}
            </Typography>
            {item.status ? <Chip size="small" label={item.status} color={statusColor(item.status)} variant="outlined" /> : null}
            {dueLabel ? <Chip size="small" label={dueLabel} color={item.dueDays <= 1 ? 'error' : 'default'} variant="outlined" /> : null}
          </Stack>
        }
      />
      <NorthEastRoundedIcon fontSize="small" sx={{ color: theme.palette.text.secondary }} />
    </ListItemButton>
  );
}

function SearchPanel({
  query,
  loading,
  errorMessage,
  lastSyncAt,
  recents,
  quickResults,
  recentResults,
  urgentResults,
  filteredResults,
  onSelect,
  onRefresh,
  onClearRecents
}) {
  const { t, i18n } = useTranslation();
  const hasQuery = normalizeString(query).length > 0;

  const Section = ({ title, children, action = null }) => (
    <Stack spacing={0.75}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.6 }}>
          {title}
        </Typography>
        {action}
      </Stack>
      {children}
    </Stack>
  );

  return (
    <Stack spacing={1.5} sx={{ p: 1.5 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
          <Chip size="small" color="primary" variant="outlined" label={t('headerSearch.summary.results', { count: filteredResults.length })} />
          <Chip size="small" color="warning" variant="outlined" label={t('headerSearch.summary.todayAlerts', { count: urgentResults.length })} />
          {lastSyncAt ? (
            <Typography variant="caption" color="text.secondary">
              {t('headerSearch.summary.sync', { time: lastSyncAt.toLocaleTimeString(i18n.language || undefined) })}
            </Typography>
          ) : null}
        </Stack>
        <Button variant="text" size="small" startIcon={<RefreshRoundedIcon fontSize="small" />} onClick={onRefresh}>
          {t('actions.refresh')}
        </Button>
      </Stack>

      {loading ? <LinearProgress /> : null}
      {errorMessage ? (
        <Typography variant="caption" color="error">
          {errorMessage}
        </Typography>
      ) : null}

      <Divider />

      <Box sx={{ maxHeight: 420, overflowY: 'auto', pr: 0.5 }}>
        {!hasQuery ? (
          <Stack spacing={1.5}>
            <Section title={t('headerSearch.sections.quickActions')}>
              <List disablePadding sx={{ display: 'grid', gap: 0.4 }}>
                {quickResults.slice(0, 6).map((item) => (
                  <ResultRow key={item.id} item={item} onSelect={onSelect} />
                ))}
              </List>
            </Section>

            <Section
              title={t('headerSearch.sections.recents')}
              action={
                recents.length > 0 ? (
                  <Button size="small" color="inherit" onClick={onClearRecents}>
                    {t('actions.clear', 'Clear')}
                  </Button>
                ) : null
              }
            >
              {recentResults.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  {t('headerSearch.messages.noRecents')}
                </Typography>
              ) : (
                <List disablePadding sx={{ display: 'grid', gap: 0.4 }}>
                  {recentResults.map((item) => (
                    <ResultRow key={`recent-${item.id}`} item={item} onSelect={onSelect} />
                  ))}
                </List>
              )}
            </Section>

            <Section title={t('headerSearch.sections.todayPending')}>
              {urgentResults.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  {t('headerSearch.messages.noTodayDue')}
                </Typography>
              ) : (
                <List disablePadding sx={{ display: 'grid', gap: 0.4 }}>
                  {urgentResults.slice(0, 8).map((item) => (
                    <ResultRow key={`urgent-${item.id}`} item={item} onSelect={onSelect} />
                  ))}
                </List>
              )}
            </Section>
          </Stack>
        ) : (
          <Stack spacing={1}>
            <Typography variant="caption" color="text.secondary">
              {t('headerSearch.messages.filtersHelp')}
            </Typography>
            <List disablePadding sx={{ display: 'grid', gap: 0.4 }}>
              {filteredResults.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ p: 1 }}>
                  {t('headerSearch.messages.noResults')}
                </Typography>
              ) : (
                filteredResults.slice(0, 40).map((item) => <ResultRow key={`result-${item.id}`} item={item} onSelect={onSelect} />)
              )}
            </List>
          </Stack>
        )}
      </Box>
    </Stack>
  );
}

// ==============================|| SEARCH INPUT ||============================== //

export default function SearchSection() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));
  const { accessToken } = useAuth();

  const desktopAnchorRef = useRef(null);
  const desktopInputRef = useRef(null);
  const mobileInputRef = useRef(null);

  const [query, setQuery] = useState('');
  const [openDesktop, setOpenDesktop] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [indexItems, setIndexItems] = useState(buildQuickCommands(t));
  const [recents, setRecents] = useState(getStoredRecents);
  const [lastSyncAt, setLastSyncAt] = useState(null);

  const {
    data: overviewData,
    error: overviewError,
    isLoading: loading,
    refresh
  } = useLionTvOverview({
    enabled: Boolean(accessToken),
    scope: 'core',
    refreshInterval: REFRESH_INTERVAL_MS
  });

  useEffect(() => {
    if (!accessToken) {
      setIndexItems(buildQuickCommands(t));
      setErrorMessage('');
      setLastSyncAt(null);
      return;
    }

    setIndexItems(buildSearchIndex(overviewData, t));

    const fetchedAt = overviewData?.meta?.fetchedAt;
    setLastSyncAt(fetchedAt ? new Date(fetchedAt) : null);

    if (overviewData?.meta?.partial) {
      setErrorMessage(t('headerSearch.messages.partialData'));
      return;
    }

    const status = overviewError?.response?.status || overviewError?.request?.status;
    if (overviewError && status !== 401) {
      setErrorMessage(overviewError?.response?.data?.message || t('headerSearch.messages.loadError'));
      return;
    }

    setErrorMessage('');
  }, [accessToken, overviewData, overviewError, t]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const isShortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k';
      if (!isShortcut) return;
      event.preventDefault();
      if (downMD) {
        setOpenMobile(true);
        setTimeout(() => mobileInputRef.current?.focus(), 0);
      } else {
        setOpenDesktop(true);
        setTimeout(() => desktopInputRef.current?.focus(), 0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [downMD]);

  const filtered = useMemo(() => {
    const { filters, terms } = parseQueryFilters(query);
    const hasTerms = terms.length > 0;

    const byText = indexItems.filter((item) => {
      if (filters.kind && normalizeString(item.kind) !== normalizeString(filters.kind)) return false;
      if (filters.status && normalizeString(item.status) !== normalizeString(filters.status)) return false;
      if (!matchDueFilter(item, filters.due)) return false;
      if (!hasTerms) return true;
      const blob = itemSearchBlob(item);
      return terms.every((term) => blob.includes(term));
    });

    return byText.sort((a, b) => {
      if (a.kind === 'comando' && b.kind !== 'comando') return -1;
      if (a.kind !== 'comando' && b.kind === 'comando') return 1;
      const aDue = a.dueDays === null ? Number.POSITIVE_INFINITY : a.dueDays;
      const bDue = b.dueDays === null ? Number.POSITIVE_INFINITY : b.dueDays;
      if (aDue !== bDue) return aDue - bDue;
      return String(a.title).localeCompare(String(b.title));
    });
  }, [indexItems, query]);

  const quickResults = useMemo(() => indexItems.filter((item) => item.kind === 'comando'), [indexItems]);

  const urgentResults = useMemo(() => {
    return indexItems
      .filter((item) => item.kind !== 'comando' && item.dueDays === 0 && isStatusActive(item.status))
      .sort((a, b) => String(a.typeLabel).localeCompare(String(b.typeLabel)));
  }, [indexItems]);

  const recentResults = useMemo(() => {
    if (!recents.length) return [];
    const mapById = indexItems.reduce((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {});
    return recents
      .map((recent) => mapById[recent.id])
      .filter(Boolean)
      .slice(0, MAX_RECENT);
  }, [indexItems, recents]);

  const pushRecent = useCallback(
    (item) => {
      const next = [{ id: item.id }, ...recents.filter((recent) => recent.id !== item.id)].slice(0, MAX_RECENT);
      setRecents(next);
      persistRecents(next);
    },
    [recents]
  );

  const clearRecents = useCallback(() => {
    setRecents([]);
    persistRecents([]);
  }, []);

  const handleSelect = useCallback(
    (item) => {
      pushRecent(item);
      setOpenDesktop(false);
      setOpenMobile(false);
      navigate(item.route || ROUTES.dashboard);
    },
    [navigate, pushRecent]
  );

  const desktopActive = openDesktop && !downMD;
  const hasQuery = normalizeString(query).length > 0;

  return (
    <>
      <Box sx={{ display: { xs: 'none', md: 'block' } }} ref={desktopAnchorRef}>
        <SearchInput
          inputId="input-search-header-desktop"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpenDesktop(true);
          }}
          onFocus={() => {
            setOpenDesktop(true);
            refresh();
          }}
          placeholder={t('headerSearch.placeholder')}
          inputRef={desktopInputRef}
        />
      </Box>

      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        <Box sx={{ ml: 2 }}>
          <HeaderAvatar
            onClick={() => {
              setOpenMobile(true);
              refresh();
            }}
          >
            <IconSearch stroke={1.5} size="19.2px" />
          </HeaderAvatar>
        </Box>
      </Box>

      <Popper
        open={desktopActive}
        anchorEl={desktopAnchorRef.current}
        placement="bottom-start"
        transition
        disablePortal
        modifiers={[{ name: 'offset', options: { offset: [0, 12] } }]}
        sx={{ zIndex: 1201 }}
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={() => setOpenDesktop(false)}>
            <Transitions type="zoom" {...TransitionProps} sx={{ transformOrigin: 'center top' }}>
              <Paper
                sx={{
                  width: 'min(680px, calc(100vw - 24px))',
                  maxWidth: 'calc(100vw - 24px)',
                  borderRadius: 2.5,
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'surface.card'
                }}
              >
                <SearchPanel
                  query={query}
                  loading={loading}
                  errorMessage={errorMessage}
                  lastSyncAt={lastSyncAt}
                  recents={recents}
                  quickResults={quickResults}
                  recentResults={recentResults}
                  urgentResults={urgentResults}
                  filteredResults={hasQuery ? filtered : quickResults}
                  onSelect={handleSelect}
                  onRefresh={() => refresh()}
                  onClearRecents={clearRecents}
                />
              </Paper>
            </Transitions>
          </ClickAwayListener>
        )}
      </Popper>

      <Dialog
        open={openMobile}
        onClose={() => setOpenMobile(false)}
        fullScreen
        sx={{
          '& .MuiDialog-paper': {
            backgroundColor: theme.palette.background.default
          }
        }}
      >
        <DialogTitle sx={{ pb: 1.2 }}>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
            <Typography variant="h4">{t('headerSearch.dialogTitle')}</Typography>
            <IconButton onClick={() => setOpenMobile(false)}>
              <IconX stroke={1.5} size="18px" />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ pt: 0 }}>
          <Stack spacing={1.5}>
            <SearchInput
              inputId="input-search-header-mobile"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => refresh()}
              inputRef={mobileInputRef}
              autoFocus
              fullWidth
              showShortcut={false}
              placeholder={t('headerSearch.placeholder')}
            />

            <SearchPanel
              query={query}
              loading={loading}
              errorMessage={errorMessage}
              lastSyncAt={lastSyncAt}
              recents={recents}
              quickResults={quickResults}
              recentResults={recentResults}
              urgentResults={urgentResults}
              filteredResults={hasQuery ? filtered : quickResults}
              onSelect={handleSelect}
              onRefresh={() => refresh()}
              onClearRecents={clearRecents}
            />
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}
