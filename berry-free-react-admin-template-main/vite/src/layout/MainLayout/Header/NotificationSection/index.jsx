import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import Chip from '@mui/material/Chip';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import useAuth from 'hooks/useAuth';
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import { useLionTvOverview } from 'api/liontv-overview';
import NotificationList from './NotificationList';

// assets
import { IconBell } from '@tabler/icons-react';
import RefreshIcon from '@mui/icons-material/Refresh';

const ROUTES = {
  licenses: '/liontv/licenses',
  subscriptions: '/liontv/subscriptions',
  lines: '/liontv/lines',
  managedAccounts: '/liontv/managed-accounts',
  invoices: '/liontv/invoices',
  commitments: '/liontv/payment-commitments'
};

const IGNORED_STATUSES = new Set(['CANCELLED', 'REMOVED']);
const REFRESH_INTERVAL_MS = 180000;

function pickFirst(item, keys, fallback = null) {
  for (const key of keys) {
    const value = item?.[key];
    if (value !== undefined && value !== null && value !== '') {
      return value;
    }
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

function startOfDay(date = new Date()) {
  const cloned = new Date(date);
  cloned.setHours(0, 0, 0, 0);
  return cloned;
}

function daysUntil(value) {
  const target = parseDate(value);
  if (!target) return null;
  const today = startOfDay(new Date());
  const due = startOfDay(target);
  return Math.round((due.getTime() - today.getTime()) / 86400000);
}

function money(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function formatMoney(value) {
  return new Intl.NumberFormat('es-HN', {
    style: 'currency',
    currency: 'HNL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(money(value));
}

function buildCustomerNameMap(customers = []) {
  return customers.reduce((acc, item) => {
    const customerId = pickFirst(item, ['customerId', 'id', 'customer_id']);
    if (!customerId) return acc;
    const name = pickFirst(
      item,
      ['customerFullname', 'fullName', 'customer_name', 'username', 'customerMail', 'email'],
      String(customerId)
    );
    acc[customerId] = name;
    return acc;
  }, {});
}

function buildTodayAlerts({
  customers = [],
  subscriptions = [],
  licenses = [],
  lines = [],
  managedAccounts = [],
  invoices = [],
  commitments = []
}) {
  const customerNameMap = buildCustomerNameMap(customers);
  const queue = [];

  const pushExpiryAlert = (item, type, route, options) => {
    const status = toUpper(options.statusResolver ? options.statusResolver(item) : pickFirst(item, [options.statusField || 'status'], ''));
    if (IGNORED_STATUSES.has(status)) return;

    const dateValue = pickFirst(item, options.dateFields, null);
    const days = daysUntil(dateValue);
    if (days !== 0) return;

    const customerId = pickFirst(item, ['customerId', 'customer_id'], null);
    const customerName = customerNameMap[customerId] || (options.fallbackName ? options.fallbackName(item) : '-');
    const entityId = pickFirst(item, options.idFields, '-');

    queue.push({
      key: `${type}-${entityId}-${String(dateValue || 'today')}`,
      type,
      route,
      entityId,
      reference: options.reference(item, entityId),
      customerName,
      status,
      detail: 'Vence hoy',
      targetDate: dateValue,
      days,
      severity: 'CRITICAL'
    });
  };

  licenses.forEach((item) => {
    pushExpiryAlert(item, 'Licencia', ROUTES.licenses, {
      idFields: ['licenseId', 'id', 'license_id'],
      dateFields: ['expireAt', 'expire_at', 'expDate', 'exp_date'],
      statusField: 'status',
      reference: (it, id) => `${pickFirst(it, ['app'], 'APP')} #${id}`
    });
  });

  subscriptions.forEach((item) => {
    pushExpiryAlert(item, 'Suscripción', ROUTES.subscriptions, {
      idFields: ['subscriptionId', 'id'],
      dateFields: ['renewalDate', 'renewal_date', 'expDate', 'exp_date'],
      statusField: 'status',
      reference: (it, id) => `${pickFirst(it, ['packageName', 'package_name'], 'Plan')} #${id}`
    });
  });

  lines.forEach((item) => {
    pushExpiryAlert(item, 'Línea', ROUTES.lines, {
      idFields: ['id', 'lineId', 'line_id'],
      dateFields: ['exp_date', 'expDate'],
      statusResolver: (it) => {
        const rawStatus = pickFirst(it, ['status'], null);
        if (rawStatus) return rawStatus;
        return pickFirst(it, ['enabled']) === false ? 'INACTIVE' : 'ACTIVE';
      },
      reference: (it, id) => `${pickFirst(it, ['username'], 'line')} #${id}`
    });
  });

  managedAccounts.forEach((item) => {
    pushExpiryAlert(item, 'Managed Account', ROUTES.managedAccounts, {
      idFields: ['id', 'managedAccountId', 'managed_account_id'],
      dateFields: ['expirationDate', 'expiration_date'],
      statusResolver: (it) => pickFirst(it, ['accountStatus', 'status'], ''),
      reference: (it, id) =>
        `${pickFirst(it, ['accountCode', 'account_code'], 'ACC')} · ${pickFirst(it, ['aliasEmail', 'alias_email', 'displayName', 'display_name'], id)}`,
      fallbackName: (it) => pickFirst(it, ['displayName', 'display_name'], '-')
    });
  });

  invoices.forEach((item) => {
    const amountDue = money(pickFirst(item, ['amountDue', 'amount_due', 'totalAmount', 'total_amount'], 0));
    const amountPaid = money(pickFirst(item, ['amountPaid', 'amount_paid'], 0));
    const pendingAmount = money(pickFirst(item, ['pendingAmount', 'pending_amount'], Math.max(amountDue - amountPaid, 0)));
    const status = toUpper(pickFirst(item, ['status'], ''));
    if (!(status === 'PENDING' || pendingAmount > 0)) return;

    const dueDate = pickFirst(item, ['dueDate', 'due_date', 'expirationDate', 'expiration_date'], null);
    if (daysUntil(dueDate) !== 0) return;

    const invoiceId = pickFirst(item, ['invoiceId', 'id', 'invoice_id'], '-');
    const customerId = pickFirst(item, ['customerId', 'customer_id'], null);
    queue.push({
      key: `Factura-${invoiceId}-${String(dueDate || 'today')}`,
      type: 'Factura pendiente',
      route: ROUTES.invoices,
      entityId: invoiceId,
      reference: `Factura #${invoiceId}`,
      customerName: customerNameMap[customerId] || '-',
      status,
      detail: `Vence hoy · ${formatMoney(pendingAmount)}`,
      targetDate: dueDate,
      days: 0,
      severity: 'CRITICAL'
    });
  });

  commitments.forEach((item) => {
    const amountDue = money(pickFirst(item, ['amountDue', 'amount_due'], 0));
    const amountPaid = money(pickFirst(item, ['amountPaid', 'amount_paid'], 0));
    const pendingAmount = money(pickFirst(item, ['pendingAmount', 'pending_amount'], Math.max(amountDue - amountPaid, 0)));
    const status = toUpper(pickFirst(item, ['status'], 'PENDING'));
    if (!(pendingAmount > 0 || status === 'PENDING')) return;

    const promisedDate = pickFirst(item, ['promisedPaymentDate', 'promised_payment_date', 'commitmentDate', 'commitment_date'], null);
    if (daysUntil(promisedDate) !== 0) return;

    const commitmentId = pickFirst(item, ['paymentCommitmentId', 'payment_commitment_id', 'id'], '-');
    const customerId = pickFirst(item, ['customerId', 'customer_id'], null);
    queue.push({
      key: `Compromiso-${commitmentId}-${String(promisedDate || 'today')}`,
      type: 'Compromiso de pago',
      route: ROUTES.commitments,
      entityId: commitmentId,
      reference: `Compromiso #${commitmentId}`,
      customerName: customerNameMap[customerId] || '-',
      status,
      detail: `Vence hoy · ${formatMoney(pendingAmount)}`,
      targetDate: promisedDate,
      days: 0,
      severity: 'CRITICAL'
    });
  });

  queue.sort((a, b) => String(a.type).localeCompare(String(b.type)) || String(a.reference).localeCompare(String(b.reference)));
  return queue;
}

// ==============================|| NOTIFICATION ||============================== //

export default function NotificationSection() {
  const theme = useTheme();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  const [open, setOpen] = useState(false);
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

  const alerts = useMemo(
    () =>
      buildTodayAlerts({
        customers: overviewData?.customers || [],
        subscriptions: overviewData?.subscriptions || [],
        licenses: overviewData?.licenses || [],
        lines: overviewData?.lines || [],
        managedAccounts: overviewData?.managedAccounts || [],
        invoices: overviewData?.invoices || [],
        commitments: overviewData?.commitments || []
      }),
    [overviewData]
  );

  const lastSyncAt = useMemo(() => {
    const fetchedAt = overviewData?.meta?.fetchedAt;
    return fetchedAt ? new Date(fetchedAt) : null;
  }, [overviewData?.meta?.fetchedAt]);

  const errorMessage = useMemo(() => {
    if (!accessToken) return '';
    if (overviewData?.meta?.partial) return 'Se cargaron alertas parciales.';

    const status = overviewError?.response?.status || overviewError?.request?.status;
    if (overviewError && status !== 401) {
      return overviewError?.response?.data?.message || 'No se pudieron cargar las alertas de hoy.';
    }

    return '';
  }, [accessToken, overviewData?.meta?.partial, overviewError]);

  /**
   * anchorRef is used on different componets and specifying one type leads to other components throwing an error
   * */
  const anchorRef = useRef(null);

  const handleToggle = () => {
    const nextOpen = !open;
    setOpen(nextOpen);
    if (nextOpen) {
      refresh();
    }
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  const badgeCount = useMemo(() => {
    if (alerts.length > 99) return '99+';
    return alerts.length;
  }, [alerts.length]);

  const handleOpenAlert = useCallback(
    (alert) => {
      setOpen(false);
      if (alert?.route) navigate(alert.route);
    },
    [navigate]
  );

  const handleOpenDashboard = useCallback(() => {
    setOpen(false);
    navigate('/liontv/dashboard');
  }, [navigate]);

  return (
    <>
      <Box sx={{ ml: 2 }}>
        <Badge color="error" badgeContent={badgeCount} invisible={alerts.length === 0}>
          <Avatar
            variant="rounded"
            sx={{
              ...theme.typography.commonAvatar,
              ...theme.typography.mediumAvatar,
              transition: 'all .2s ease-in-out',
              color: theme.vars.palette.warning.dark,
              background: theme.vars.palette.warning.light,
              '&:hover, &[aria-controls="menu-list-grow"]': {
                color: theme.vars.palette.warning.light,
                background: theme.vars.palette.warning.dark
              }
            }}
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
          >
            <IconBell stroke={1.5} size="20px" />
          </Avatar>
        </Badge>
      </Box>
      <Popper
        placement={downMD ? 'bottom' : 'bottom-end'}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        modifiers={[{ name: 'offset', options: { offset: [downMD ? 5 : 0, 20] } }]}
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={handleClose}>
            <Transitions position={downMD ? 'top' : 'top-right'} in={open} {...TransitionProps}>
              <Paper>
                {open && (
                  <MainCard
                    border={false}
                    elevation={16}
                    content={false}
                    boxShadow
                    shadow={theme.shadows[16]}
                    sx={{ width: 420, maxWidth: '95vw' }}
                  >
                    <Stack sx={{ gap: 2 }}>
                      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', pt: 2, px: 2 }}>
                        <Stack direction="row" sx={{ gap: 2 }}>
                          <Typography variant="subtitle1">Alertas de hoy</Typography>
                          <Chip
                            size="small"
                            label={alerts.length}
                            variant="filled"
                            sx={{ color: 'background.default', bgcolor: alerts.length > 0 ? 'error.main' : 'success.main' }}
                          />
                        </Stack>
                        <Button
                          variant="text"
                          size="small"
                          startIcon={loading ? <CircularProgress size={12} color="inherit" /> : <RefreshIcon fontSize="small" />}
                          onClick={() => refresh()}
                          disabled={loading}
                        >
                          Recargar
                        </Button>
                      </Stack>
                      <Box sx={{ height: 1, maxHeight: 'calc(100vh - 205px)', overflowX: 'hidden', '&::-webkit-scrollbar': { width: 5 } }}>
                        <Box sx={{ px: 2 }}>
                          {errorMessage ? (
                            <Alert severity="warning" variant="outlined" sx={{ mb: 1 }}>
                              {errorMessage}
                            </Alert>
                          ) : null}
                          {lastSyncAt ? (
                            <Typography variant="caption" color="text.secondary">
                              Actualizado: {lastSyncAt.toLocaleTimeString('es-HN')}
                            </Typography>
                          ) : null}
                        </Box>
                        <Divider sx={{ mt: 1 }} />
                        <NotificationList notifications={alerts} loading={loading} onOpenItem={handleOpenAlert} />
                      </Box>
                    </Stack>
                    <CardActions sx={{ p: 1.25, justifyContent: 'center' }}>
                      <Button size="small" disableElevation onClick={handleOpenDashboard}>
                        Ver seguimiento completo
                      </Button>
                    </CardActions>
                  </MainCard>
                )}
              </Paper>
            </Transitions>
          </ClickAwayListener>
        )}
      </Popper>
    </>
  );
}
