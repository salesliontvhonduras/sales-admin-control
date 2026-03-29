import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

const QUICK_COMMANDS = [
  {
    id: 'cmd-dashboard',
    kind: 'comando',
    typeLabel: 'Comando',
    title: 'Ir a Seguimiento Operativo',
    subtitle: 'KPIs, alertas y prioridades del día.',
    route: ROUTES.dashboard,
    keywords: ['dashboard', 'kpi', 'seguimiento', 'alertas']
  },
  {
    id: 'cmd-customers',
    kind: 'comando',
    typeLabel: 'Comando',
    title: 'Abrir clientes',
    subtitle: 'Gestión de cartera y datos del cliente.',
    route: ROUTES.customers,
    keywords: ['clientes', 'customer', 'crm']
  },
  {
    id: 'cmd-subscriptions',
    kind: 'comando',
    typeLabel: 'Comando',
    title: 'Abrir suscripciones',
    subtitle: 'Estado y renovaciones de planes.',
    route: ROUTES.subscriptions,
    keywords: ['suscripciones', 'planes', 'renewal']
  },
  {
    id: 'cmd-invoices',
    kind: 'comando',
    typeLabel: 'Comando',
    title: 'Abrir facturas',
    subtitle: 'Cobros pendientes y pagos.',
    route: ROUTES.invoices,
    keywords: ['facturas', 'invoice', 'cobros']
  },
  {
    id: 'cmd-commitments',
    kind: 'comando',
    typeLabel: 'Comando',
    title: 'Abrir compromisos de pago',
    subtitle: 'Promesas y seguimiento de cobranza.',
    route: ROUTES.commitments,
    keywords: ['compromisos', 'promesas', 'pago']
  },
  {
    id: 'cmd-managed-accounts',
    kind: 'comando',
    typeLabel: 'Comando',
    title: 'Abrir managed accounts',
    subtitle: 'Aliases, bandeja y forwarding.',
    route: ROUTES.managedAccounts,
    keywords: ['managed', 'accounts', 'alias', 'mail']
  },
  {
    id: 'cmd-licenses',
    kind: 'comando',
    typeLabel: 'Comando',
    title: 'Abrir licencias',
    subtitle: 'Estado de licencias por cliente.',
    route: ROUTES.licenses,
    keywords: ['licencias', 'keys', 'device']
  },
  {
    id: 'cmd-lines',
    kind: 'comando',
    typeLabel: 'Comando',
    title: 'Abrir líneas',
    subtitle: 'Control de líneas y expiración.',
    route: ROUTES.lines,
    keywords: ['lineas', 'lines', 'plus']
  }
];

const KIND_LABELS = {
  cliente: 'Cliente',
  suscripcion: 'Suscripción',
  licencia: 'Licencia',
  linea: 'Línea',
  account: 'Managed Account',
  factura: 'Factura',
  compromiso: 'Compromiso',
  comando: 'Comando'
};

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

function buildSearchIndex(payload = {}) {
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
    const customerName = pickFirst(customer, ['customerFullname', 'fullName', 'customer_name', 'username'], `Cliente #${id}`);
    const email = pickFirst(customer, ['customerMail', 'email'], '');
    return {
      id: `customer-${id}`,
      kind: 'cliente',
      typeLabel: KIND_LABELS.cliente,
      title: customerName,
      subtitle: email || `ID ${id}`,
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
    const packageName = pickFirst(subscription, ['packageName', 'package_name'], 'Plan');
    const dueDate = pickFirst(subscription, ['renewalDate', 'renewal_date', 'expDate', 'exp_date']);
    return {
      id: `subscription-${id}`,
      kind: 'suscripcion',
      typeLabel: KIND_LABELS.suscripcion,
      title: `${packageName} #${id}`,
      subtitle: `Cliente: ${customerName}`,
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
    const appName = pickFirst(license, ['app'], 'Licencia');
    const dueDate = pickFirst(license, ['expireAt', 'expire_at', 'expDate', 'exp_date']);
    return {
      id: `license-${id}`,
      kind: 'licencia',
      typeLabel: KIND_LABELS.licencia,
      title: `${appName} #${id}`,
      subtitle: `Cliente: ${customerName}`,
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
      typeLabel: KIND_LABELS.linea,
      title: `${username} #${id}`,
      subtitle: provider || 'Sin provider',
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
      typeLabel: KIND_LABELS.account,
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
      typeLabel: KIND_LABELS.factura,
      title: `Factura #${id}`,
      subtitle: `Cliente: ${customerName}`,
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
      typeLabel: KIND_LABELS.compromiso,
      title: `Compromiso #${id}`,
      subtitle: `Cliente: ${customerName}`,
      code: String(id),
      route: ROUTES.commitments,
      status: toUpper(pickFirst(commitment, ['status'], 'PENDING')),
      dueDays: daysUntil(dueDate),
      customerName,
      keywords: [customerName]
    };
  });

  return [
    ...QUICK_COMMANDS,
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

function dueChipLabel(days) {
  if (days === null || days === undefined || Number.isNaN(Number(days))) return null;
  const normalizedDays = Number(days);
  if (normalizedDays < 0) return `Vencido ${Math.abs(normalizedDays)}d`;
  if (normalizedDays === 0) return 'Hoy';
  if (normalizedDays === 1) return 'Mañana';
  return `${normalizedDays}d`;
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
  value,
  onChange,
  onFocus,
  inputRef,
  autoFocus = false,
  fullWidth = false,
  showShortcut = true,
  placeholder = 'Buscar global (tipo:, estado:, vence:)'
}) {
  const theme = useTheme();

  return (
    <OutlinedInput
      id="input-search-header"
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
            <HeaderAvatar>
              <IconAdjustmentsHorizontal stroke={1.5} size="20px" />
            </HeaderAvatar>
            {showShortcut ? (
              <Chip
                size="small"
                label="Ctrl + K"
                variant="outlined"
                sx={{
                  borderStyle: 'dashed',
                  color: theme.palette.text.secondary
                }}
              />
            ) : null}
          </Stack>
        </InputAdornment>
      }
      sx={(theme) => ({
        width: fullWidth ? '100%' : { md: 280, lg: 470 },
        ml: fullWidth ? 0 : 2,
        px: 1.6,
        borderRadius: 12,
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.surface.muted : theme.palette.surface.sunken,
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.divider
        }
      })}
    />
  );
}

function ResultRow({ item, onSelect }) {
  const theme = useTheme();
  const dueLabel = dueChipLabel(item.dueDays);

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
            <Chip size="small" label={item.typeLabel || 'Resultado'} variant="outlined" />
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
          <Chip size="small" color="primary" variant="outlined" label={`${filteredResults.length} resultados`} />
          <Chip size="small" color="warning" variant="outlined" label={`${urgentResults.length} alertas hoy`} />
          {lastSyncAt ? (
            <Typography variant="caption" color="text.secondary">
              Sync: {lastSyncAt.toLocaleTimeString('es-HN')}
            </Typography>
          ) : null}
        </Stack>
        <Button variant="text" size="small" startIcon={<RefreshRoundedIcon fontSize="small" />} onClick={onRefresh}>
          Actualizar
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
            <Section title="Acciones rápidas">
              <List disablePadding sx={{ display: 'grid', gap: 0.4 }}>
                {quickResults.slice(0, 6).map((item) => (
                  <ResultRow key={item.id} item={item} onSelect={onSelect} />
                ))}
              </List>
            </Section>

            <Section
              title="Recientes"
              action={
                recents.length > 0 ? (
                  <Button size="small" color="inherit" onClick={onClearRecents}>
                    Limpiar
                  </Button>
                ) : null
              }
            >
              {recentResults.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Sin recientes todavía.
                </Typography>
              ) : (
                <List disablePadding sx={{ display: 'grid', gap: 0.4 }}>
                  {recentResults.map((item) => (
                    <ResultRow key={`recent-${item.id}`} item={item} onSelect={onSelect} />
                  ))}
                </List>
              )}
            </Section>

            <Section title="Pendientes de hoy">
              {urgentResults.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No hay vencimientos de hoy en el índice actual.
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
              Usa filtros: <b>tipo:</b>cliente|suscripcion|licencia|linea|account|factura|compromiso|comando, <b>estado:</b>
              pending|active|expired,
              <b> vence:</b>hoy|manana|7d|vencido
            </Typography>
            <List disablePadding sx={{ display: 'grid', gap: 0.4 }}>
              {filteredResults.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ p: 1 }}>
                  No se encontraron resultados.
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
  const downMD = useMediaQuery(theme.breakpoints.down('md'));
  const { accessToken } = useAuth();

  const desktopAnchorRef = useRef(null);
  const desktopInputRef = useRef(null);
  const mobileInputRef = useRef(null);

  const [query, setQuery] = useState('');
  const [openDesktop, setOpenDesktop] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [indexItems, setIndexItems] = useState([...QUICK_COMMANDS]);
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
      setIndexItems([...QUICK_COMMANDS]);
      setErrorMessage('');
      setLastSyncAt(null);
      return;
    }

    setIndexItems(buildSearchIndex(overviewData));

    const fetchedAt = overviewData?.meta?.fetchedAt;
    setLastSyncAt(fetchedAt ? new Date(fetchedAt) : null);

    if (overviewData?.meta?.partial) {
      setErrorMessage('Datos parciales cargados en búsqueda global.');
      return;
    }

    const status = overviewError?.response?.status || overviewError?.request?.status;
    if (overviewError && status !== 401) {
      setErrorMessage(overviewError?.response?.data?.message || 'No se pudo cargar el índice global.');
      return;
    }

    setErrorMessage('');
  }, [accessToken, overviewData, overviewError]);

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
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpenDesktop(true);
          }}
          onFocus={() => {
            setOpenDesktop(true);
            refresh();
          }}
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
                  width: 620,
                  maxWidth: 'calc(100vw - 32px)',
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
            <Typography variant="h4">Búsqueda Global</Typography>
            <IconButton onClick={() => setOpenMobile(false)}>
              <IconX stroke={1.5} size="18px" />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ pt: 0 }}>
          <Stack spacing={1.5}>
            <SearchInput
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => refresh()}
              inputRef={mobileInputRef}
              autoFocus
              fullWidth
              showShortcut={false}
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
