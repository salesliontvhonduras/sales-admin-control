import { useEffect, useMemo, useRef, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import useAuth from 'hooks/useAuth';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import LinearProgress from '@mui/material/LinearProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';

import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import RouterIcon from '@mui/icons-material/Router';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import RefreshIcon from '@mui/icons-material/Refresh';
import LaunchIcon from '@mui/icons-material/Launch';

import MainCard from 'ui-component/cards/MainCard';
import { PageEmptyState, PageErrorState, PageLoadingState } from 'ui-component/feedback/PageState';
import { gridSpacing } from 'store/constant';
import { useLionTvOverview } from 'api/liontv-overview';

const ROUTES = {
  licenses: '/liontv/licenses',
  subscriptions: '/liontv/subscriptions',
  lines: '/liontv/lines',
  managedAccounts: '/liontv/managed-accounts',
  invoices: '/liontv/invoices',
  commitments: '/liontv/payment-commitments'
};

const HORIZON_OPTIONS = [7, 15, 30, 60];
const IGNORED_STATUSES = new Set(['CANCELLED', 'REMOVED']);
const LOST_THRESHOLD_DAYS = -45;

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

function formatDate(value) {
  const date = parseDate(value);
  if (!date) return '-';
  return date.toLocaleDateString('es-HN');
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

function isTruthyFlag(raw) {
  return raw === true || raw === 1 || raw === '1' || String(raw).toLowerCase() === 'true';
}

function normalizeCustomer(item = {}) {
  return {
    id: item.customerId ?? item.id ?? item.customer_id ?? null,
    name: item.customerFullname ?? item.fullName ?? item.customer_name ?? item.username ?? item.customerMail ?? '',
    email: item.customerMail ?? item.email ?? ''
  };
}

function normalizeSubscription(item = {}) {
  return {
    id: item.subscriptionId ?? item.id ?? null,
    customerId: item.customerId ?? item.customer_id ?? null,
    status: toUpper(item.status),
    renewalDate: item.renewalDate ?? item.renewal_date ?? item.expDate ?? item.exp_date ?? null,
    amount: money(item.amount ?? item.totalAmount),
    packageName: item.packageName ?? item.package_name ?? ''
  };
}

function normalizeLicense(item = {}) {
  return {
    id: item.licenseId ?? item.id ?? item.license_id ?? null,
    customerId: item.customerId ?? item.customer_id ?? null,
    status: toUpper(item.status),
    expireAt: item.expireAt ?? item.expire_at ?? item.expDate ?? item.exp_date ?? null,
    app: item.app ?? '',
    isPaid: isTruthyFlag(item.isPaid ?? item.is_paid ?? item.paid)
  };
}

function normalizeLine(item = {}) {
  return {
    id: item.id ?? item.lineId ?? null,
    username: item.username ?? '',
    provider: item.provider ?? item.line_provider ?? item.lineProvider ?? '',
    enabled: item.enabled === true || item.enabled === 1 || item.enabled === '1',
    status: toUpper(item.status ?? (item.enabled === false ? 'INACTIVE' : 'ACTIVE')),
    expDate: item.exp_date ?? item.expDate ?? null
  };
}

function normalizeManagedAccount(item = {}) {
  return {
    id: item.id ?? item.managedAccountId ?? null,
    customerId: item.customerId ?? item.customer_id ?? null,
    accountCode: item.accountCode ?? item.account_code ?? '',
    displayName: item.displayName ?? item.display_name ?? '',
    aliasEmail: item.aliasEmail ?? item.alias_email ?? '',
    status: toUpper(item.accountStatus ?? item.status),
    expirationDate: item.expirationDate ?? item.expiration_date ?? null
  };
}

function normalizeInvoice(item = {}) {
  const amountDue = money(item.amountDue ?? item.amount_due ?? item.totalAmount ?? item.total_amount);
  const amountPaid = money(item.amountPaid ?? item.amount_paid);
  const pendingAmount = money(item.pendingAmount ?? item.pending_amount ?? Math.max(amountDue - amountPaid, 0));
  return {
    id: item.invoiceId ?? item.id ?? null,
    customerId: item.customerId ?? item.customer_id ?? null,
    status: toUpper(item.status),
    amountPaid,
    amountDue,
    amountDiscount: money(item.amountDiscount ?? item.amount_discount),
    pendingAmount,
    paymentDate: item.paymentDate ?? item.payment_date ?? null,
    dueDate: item.dueDate ?? item.due_date ?? item.expirationDate ?? item.expiration_date ?? null,
    createdAt: item.createdAt ?? item.created_at ?? null
  };
}

function normalizeCommitment(item = {}) {
  const amountDue = money(item.amountDue ?? item.amount_due);
  const amountPaid = money(item.amountPaid ?? item.amount_paid);
  const pendingAmount = money(item.pendingAmount ?? item.pending_amount ?? Math.max(amountDue - amountPaid, 0));
  return {
    id: item.paymentCommitmentId ?? item.payment_commitment_id ?? item.id ?? null,
    customerId: item.customerId ?? item.customer_id ?? null,
    status: toUpper(item.status ?? 'PENDING'),
    pendingAmount,
    promisedDate: item.promisedPaymentDate ?? item.promised_payment_date ?? item.commitmentDate ?? item.commitment_date ?? null
  };
}

function severityFromDays(days) {
  if (days !== null && days <= LOST_THRESHOLD_DAYS) return 'LOST';
  if (days === null) return 'HIGH';
  if (days === 0 || days === 1) return 'CRITICAL';
  if (days < 0) {
    return 'HIGH';
  }
  if (days <= 3) return 'HIGH';
  if (days <= 7) return 'MEDIUM';
  return 'LOW';
}

function severityRank(level) {
  if (level === 'CRITICAL') return 5;
  if (level === 'HIGH') return 4;
  if (level === 'MEDIUM') return 3;
  if (level === 'LOW') return 2;
  return 1;
}

function severityMeta(level) {
  if (level === 'CRITICAL') return { label: 'Crítico', color: 'error' };
  if (level === 'HIGH') return { label: 'Alto', color: 'warning' };
  if (level === 'MEDIUM') return { label: 'Medio', color: 'info' };
  if (level === 'LOST') return { label: 'Perdido', color: 'default' };
  return { label: 'Bajo', color: 'default' };
}

function describeDays(days) {
  if (days === null) return 'Sin fecha';
  if (days < 0) return `Vencido hace ${Math.abs(days)}d`;
  if (days === 0) return 'Vence hoy';
  return `Vence en ${days}d`;
}

function radarStats(items, dateField, statusField = 'status') {
  const out = { expired: 0, today: 0, next7: 0, next30: 0, withoutDate: 0 };
  items.forEach((item) => {
    if (IGNORED_STATUSES.has(toUpper(item[statusField]))) return;
    const days = daysUntil(item[dateField]);
    if (days === null) {
      out.withoutDate += 1;
      return;
    }
    if (days < 0) out.expired += 1;
    else if (days === 0) out.today += 1;
    else if (days <= 7) out.next7 += 1;
    else if (days <= 30) out.next30 += 1;
  });
  return out;
}

function metricCardStyle(theme, color = 'primary') {
  return {
    ...theme.applyStyles('light', {
      boxShadow: '0 10px 24px rgba(15, 23, 42, 0.08)',
      background: `linear-gradient(135deg, ${theme.vars.palette[color]?.light || theme.vars.palette.primary.light}1f 0%, ${theme.vars.palette.background.paper} 70%)`
    }),
    borderRadius: 2.5,
    border: '1px solid',
    borderColor: 'divider',
    boxShadow: '0 12px 26px rgba(2, 8, 23, 0.38)',
    background: `linear-gradient(135deg, ${theme.vars.palette.surface.card} 0%, ${theme.vars.palette.surface.muted} 100%)`
  };
}

function MetricCard({ title, value, helper, icon, color = 'primary' }) {
  return (
    <Card sx={(theme) => metricCardStyle(theme, color)}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1.5}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {title}
            </Typography>
            <Typography variant="h2" sx={{ mt: 0.5 }}>
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

function RadarCard({ title, stats, icon, color = 'primary', onOpen }) {
  return (
    <Card sx={(theme) => metricCardStyle(theme, color)}>
      <CardContent>
        <Stack spacing={1.2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" alignItems="center" spacing={0.8}>
              {icon}
              <Typography variant="h4">{title}</Typography>
            </Stack>
            <Button variant="outlined" size="small" onClick={onOpen} endIcon={<LaunchIcon fontSize="small" />}>
              Abrir
            </Button>
          </Stack>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Chip size="small" color="error" variant="outlined" label={`Vencidos: ${stats.expired}`} />
            <Chip size="small" color="warning" variant="outlined" label={`Hoy: ${stats.today}`} />
            <Chip size="small" color="info" variant="outlined" label={`7 días: ${stats.next7}`} />
            <Chip size="small" color="primary" variant="outlined" label={`30 días: ${stats.next30}`} />
            <Chip size="small" color="default" variant="outlined" label={`Sin fecha: ${stats.withoutDate}`} />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

function AlertsBucketCard({ title, helper, alerts, onOpenAlert }) {
  return (
    <Card sx={{ borderRadius: 2.5, border: '1px solid', borderColor: 'divider', height: '100%' }}>
      <CardContent>
        <Stack spacing={1.2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h4">{title}</Typography>
            <Chip size="small" color="primary" variant="outlined" label={`${alerts.length} alertas`} />
          </Stack>
          {helper ? (
            <Typography variant="caption" color="text.secondary">
              {helper}
            </Typography>
          ) : null}
          <Divider />
          <Stack spacing={1}>
            {alerts.slice(0, 8).map((alert) => {
              const sev = severityMeta(alert.severity);
              return (
                <Card key={`${title}-${alert.type}-${alert.entityId}-${alert.reference}`} variant="outlined" sx={{ borderRadius: 2 }}>
                  <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                    <Stack spacing={1}>
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        alignItems={{ xs: 'flex-start', sm: 'center' }}
                        gap={1}
                      >
                        <Stack direction="row" spacing={0.8} flexWrap="wrap" useFlexGap>
                          <Chip size="small" color={sev.color} variant="outlined" label={sev.label} />
                          <Chip size="small" color="primary" variant="outlined" label={alert.type} />
                        </Stack>
                        <Button
                          size="small"
                          variant="outlined"
                          endIcon={<LaunchIcon fontSize="small" />}
                          onClick={() => onOpenAlert(alert)}
                        >
                          Ver
                        </Button>
                      </Stack>
                      <Typography variant="subtitle2" sx={{ wordBreak: 'break-word' }}>
                        {alert.reference}
                      </Typography>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} useFlexGap>
                        <Typography variant="caption" color="text.secondary">
                          Cliente: {alert.customerName || '-'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Estado: {alert.status || '-'}
                        </Typography>
                      </Stack>
                      <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-word' }}>
                        {alert.detail}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              );
            })}
            {alerts.length === 0 ? (
              <Alert severity="success" variant="outlined">
                Sin alertas en este bloque.
              </Alert>
            ) : null}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function LionTvDashboard() {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  const [horizonDays, setHorizonDays] = useState(30);
  const [criticalOnly, setCriticalOnly] = useState(false);

  const [customers, setCustomers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [licenses, setLicenses] = useState([]);
  const [lines, setLines] = useState([]);
  const [managedAccounts, setManagedAccounts] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [commitments, setCommitments] = useState([]);
  const lastToastRef = useRef('');

  const {
    data: overviewData,
    error: overviewError,
    isLoading: loading,
    refresh
  } = useLionTvOverview({
    enabled: Boolean(accessToken),
    scope: 'core'
  });

  const customerNameMap = useMemo(() => {
    const map = {};
    customers.forEach((it) => {
      if (!it.id) return;
      map[it.id] = it.name || it.email || String(it.id);
    });
    return map;
  }, [customers]);

  useEffect(() => {
    if (!accessToken) {
      setCustomers([]);
      setSubscriptions([]);
      setLicenses([]);
      setLines([]);
      setManagedAccounts([]);
      setInvoices([]);
      setCommitments([]);
      return;
    }

    setCustomers((overviewData?.customers || []).map(normalizeCustomer));
    setSubscriptions((overviewData?.subscriptions || []).map(normalizeSubscription));
    setLicenses((overviewData?.licenses || []).map(normalizeLicense));
    setLines((overviewData?.lines || []).map(normalizeLine));
    setManagedAccounts((overviewData?.managedAccounts || []).map(normalizeManagedAccount));
    setInvoices((overviewData?.invoices || []).map(normalizeInvoice));
    setCommitments((overviewData?.commitments || []).map(normalizeCommitment));
  }, [accessToken, overviewData]);

  useEffect(() => {
    if (!accessToken) return;

    if (overviewData?.meta?.partial) {
      const key = 'partial';
      if (lastToastRef.current !== key) {
        enqueueSnackbar(t('liontvDashboard.partialLoad', 'Se cargaron datos parciales para seguimiento.'), { variant: 'warning' });
        lastToastRef.current = key;
      }
      return;
    }

    const status = overviewError?.response?.status || overviewError?.request?.status;
    if (overviewError && status !== 401) {
      const message =
        overviewError?.response?.data?.message || t('liontvDashboard.loadError', 'No se pudo cargar el módulo de seguimiento.');
      const key = `error:${message}`;
      if (lastToastRef.current !== key) {
        enqueueSnackbar(message, { variant: 'error' });
        lastToastRef.current = key;
      }
      return;
    }

    lastToastRef.current = '';
  }, [accessToken, enqueueSnackbar, overviewData?.meta?.partial, overviewError, t]);

  const tracking = useMemo(() => {
    const queue = [];

    const pushExpiryAlert = (item, type, route, options) => {
      const status = toUpper(item[options.statusField] ?? item.status);
      if (IGNORED_STATUSES.has(status)) return;

      const dateValue = item[options.dateField];
      const days = daysUntil(dateValue);
      const shouldInclude = days === null ? status === 'PENDING' : days <= horizonDays || days < 0;
      if (!shouldInclude) return;

      const severity = severityFromDays(days);
      const customerId = item.customerId ?? null;
      const customerName = customerNameMap[customerId] || (options.fallbackName ? options.fallbackName(item) : '-');

      queue.push({
        severity,
        type,
        route,
        entityId: item.id ?? '-',
        reference: options.reference ? options.reference(item) : `${type} #${item.id ?? '-'}`,
        customerName,
        status,
        targetDate: dateValue,
        days,
        detail: describeDays(days)
      });
    };

    licenses.forEach((item) => {
      pushExpiryAlert(item, 'Licencia', ROUTES.licenses, {
        dateField: 'expireAt',
        statusField: 'status',
        reference: (it) => `${it.app || 'APP'} #${it.id ?? '-'}`,
        fallbackName: () => '-'
      });
    });

    subscriptions.forEach((item) => {
      pushExpiryAlert(item, 'Suscripción', ROUTES.subscriptions, {
        dateField: 'renewalDate',
        statusField: 'status',
        reference: (it) => `${it.packageName || 'Plan'} #${it.id ?? '-'}`,
        fallbackName: () => '-'
      });
    });

    lines.forEach((item) => {
      pushExpiryAlert(item, 'Línea', ROUTES.lines, {
        dateField: 'expDate',
        statusField: 'status',
        reference: (it) => `${it.username || 'line'} #${it.id ?? '-'}`,
        fallbackName: () => '-'
      });
    });

    managedAccounts.forEach((item) => {
      pushExpiryAlert(item, 'Managed Account', ROUTES.managedAccounts, {
        dateField: 'expirationDate',
        statusField: 'status',
        reference: (it) => `${it.accountCode || 'ACC'} · ${it.aliasEmail || it.displayName || it.id}`,
        fallbackName: (it) => it.displayName || '-'
      });
    });

    const pendingInvoices = invoices.filter((inv) => inv.status === 'PENDING' || inv.pendingAmount > 0);
    pendingInvoices.forEach((inv) => {
      const days = daysUntil(inv.dueDate);
      queue.push({
        severity: severityFromDays(days),
        type: 'Factura pendiente',
        route: ROUTES.invoices,
        entityId: inv.id ?? '-',
        reference: `Factura #${inv.id ?? '-'}`,
        customerName: customerNameMap[inv.customerId] || '-',
        status: inv.status,
        targetDate: inv.dueDate ?? inv.createdAt ?? inv.paymentDate ?? null,
        days,
        detail: `${describeDays(days)} · ${formatMoney(inv.pendingAmount)}`
      });
    });

    const pendingCommitments = commitments.filter((it) => it.pendingAmount > 0 || it.status === 'PENDING');
    pendingCommitments.forEach((item) => {
      const days = daysUntil(item.promisedDate);
      queue.push({
        severity: severityFromDays(days),
        type: 'Compromiso de pago',
        route: ROUTES.commitments,
        entityId: item.id ?? '-',
        reference: `Compromiso #${item.id ?? '-'}`,
        customerName: customerNameMap[item.customerId] || '-',
        status: item.status,
        targetDate: item.promisedDate,
        days,
        detail: `${describeDays(days)} · ${formatMoney(item.pendingAmount)}`
      });
    });

    queue.sort((a, b) => {
      const bySeverity = severityRank(b.severity) - severityRank(a.severity);
      if (bySeverity !== 0) return bySeverity;
      const ad = a.days === null ? Number.POSITIVE_INFINITY : a.days;
      const bd = b.days === null ? Number.POSITIVE_INFINITY : b.days;
      if (ad !== bd) return ad - bd;
      return String(a.type).localeCompare(String(b.type));
    });

    const queueFiltered = criticalOnly ? queue.filter((it) => it.severity === 'CRITICAL') : queue;

    const invoicesPendingAmount = pendingInvoices.reduce((acc, it) => acc + money(it.pendingAmount), 0);
    const commitmentsPendingAmount = pendingCommitments.reduce((acc, it) => acc + money(it.pendingAmount), 0);

    const criticalCount = queue.filter((it) => it.severity === 'CRITICAL').length;
    const highCount = queue.filter((it) => it.severity === 'HIGH').length;
    const lostCount = queue.filter((it) => it.severity === 'LOST').length;
    const todayAlerts = queue.filter((it) => it.days === 0);
    const tomorrowAlerts = queue.filter((it) => it.days === 1);
    const in7DaysAlerts = queue.filter((it) => it.days !== null && it.days >= 2 && it.days <= 7);
    const todayCount = todayAlerts.length;
    const tomorrowCount = tomorrowAlerts.length;
    const in7DaysCount = in7DaysAlerts.length;
    const todayOrTomorrowCount = queue.filter((it) => it.days === 0 || it.days === 1).length;
    const next7Count = queue.filter((it) => it.days !== null && it.days > 0 && it.days <= 7).length;
    const overdueCount = queue.filter((it) => it.days !== null && it.days < 0).length;
    const overdueActiveCount = queue.filter((it) => it.days !== null && it.days < 0 && it.severity !== 'LOST').length;

    return {
      queue,
      queueFiltered,
      pendingInvoices,
      pendingCommitments,
      invoicesPendingAmount,
      commitmentsPendingAmount,
      criticalCount,
      highCount,
      lostCount,
      todayAlerts,
      tomorrowAlerts,
      in7DaysAlerts,
      todayCount,
      tomorrowCount,
      in7DaysCount,
      todayOrTomorrowCount,
      next7Count,
      overdueCount,
      overdueActiveCount,
      radar: {
        licenses: radarStats(licenses, 'expireAt', 'status'),
        subscriptions: radarStats(subscriptions, 'renewalDate', 'status'),
        lines: radarStats(lines, 'expDate', 'status'),
        managed: radarStats(managedAccounts, 'expirationDate', 'status')
      }
    };
  }, [licenses, subscriptions, lines, managedAccounts, invoices, commitments, horizonDays, criticalOnly, customerNameMap]);
  const hasSourceData =
    customers.length +
      subscriptions.length +
      licenses.length +
      lines.length +
      managedAccounts.length +
      invoices.length +
      commitments.length >
    0;

  return (
    <MainCard
      title={t('menu.liontvDashboard', 'Seguimiento Operativo')}
      secondary={
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" size="small" startIcon={<RefreshIcon fontSize="small" />} onClick={() => refresh()} disabled={loading}>
            {t('actions.refresh', 'Recargar')}
          </Button>
        </Stack>
      }
    >
      <Stack spacing={2.2}>
        <Alert severity="info" variant="outlined">
          Módulo de seguimiento para no olvidar nada: vencimientos, pendientes, riesgos y próximos eventos del negocio.
        </Alert>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} alignItems={{ xs: 'flex-start', md: 'center' }}>
          <Typography variant="subtitle2" color="text.secondary">
            Horizonte de alertas:
          </Typography>
          <Stack direction="row" spacing={1}>
            {HORIZON_OPTIONS.map((days) => (
              <Chip
                key={days}
                label={`${days} días`}
                clickable
                color={horizonDays === days ? 'primary' : 'default'}
                variant={horizonDays === days ? 'filled' : 'outlined'}
                onClick={() => setHorizonDays(days)}
              />
            ))}
          </Stack>
          <Chip
            label="Solo críticos"
            clickable
            color={criticalOnly ? 'error' : 'default'}
            variant={criticalOnly ? 'filled' : 'outlined'}
            onClick={() => setCriticalOnly((prev) => !prev)}
          />
        </Stack>

        {loading && !hasSourceData ? <PageLoadingState label={t('liontvDashboard.loading', 'Cargando seguimiento operativo...')} /> : null}
        {overviewError && !hasSourceData ? (
          <PageErrorState
            message={
              overviewError?.response?.data?.message || t('liontvDashboard.loadError', 'No se pudo cargar el módulo de seguimiento.')
            }
            onRetry={() => refresh()}
          />
        ) : null}
        {!loading && !overviewError && !hasSourceData ? (
          <PageEmptyState message={t('liontvDashboard.empty', 'No hay datos suficientes para construir alertas todavía.')} />
        ) : null}

        {loading && hasSourceData ? <LinearProgress /> : null}

        {hasSourceData ? (
          <Grid container spacing={gridSpacing}>
            <Grid size={12}>
              <Typography variant="h4">Seguimiento por fecha</Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <MetricCard
                title="Alertas de hoy"
                value={tracking.todayCount}
                helper="vence hoy"
                color="error"
                icon={<CalendarMonthIcon fontSize="small" />}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <MetricCard
                title="Alertas de mañana"
                value={tracking.tomorrowCount}
                helper="vence en 1 día"
                color="warning"
                icon={<CalendarMonthIcon fontSize="small" />}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <MetricCard
                title="Alertas a 7 días"
                value={tracking.in7DaysCount}
                helper="desde 2 hasta 7 días"
                color="info"
                icon={<CalendarMonthIcon fontSize="small" />}
              />
            </Grid>

            <Grid size={12}>
              <Divider />
            </Grid>

            <Grid size={12}>
              <Typography variant="h4">Detalle por fecha</Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <AlertsBucketCard
                title="Detalle de hoy"
                helper="Casos que vencen hoy"
                alerts={tracking.todayAlerts}
                onOpenAlert={(alert) => navigate(alert.route)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <AlertsBucketCard
                title="Detalle de mañana"
                helper="Casos que vencen en 1 día"
                alerts={tracking.tomorrowAlerts}
                onOpenAlert={(alert) => navigate(alert.route)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <AlertsBucketCard
                title="Detalle próximos 7 días"
                helper="Casos que vencen entre 2 y 7 días"
                alerts={tracking.in7DaysAlerts}
                onOpenAlert={(alert) => navigate(alert.route)}
              />
            </Grid>

            <Grid size={12}>
              <Divider />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
              <MetricCard
                title="Alertas críticas"
                value={tracking.criticalCount}
                helper={`${tracking.todayOrTomorrowCount} vencen hoy/1 día`}
                color="error"
                icon={<ErrorOutlineIcon fontSize="small" />}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
              <MetricCard
                title="Alertas altas"
                value={tracking.highCount}
                helper={`${tracking.overdueActiveCount} vencidas recientes`}
                color="warning"
                icon={<WarningAmberIcon fontSize="small" />}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
              <MetricCard
                title={`Próximos ${horizonDays} días`}
                value={tracking.queue.length}
                helper={`${tracking.next7Count} en 7 días`}
                color="info"
                icon={<NotificationsActiveIcon fontSize="small" />}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
              <MetricCard
                title="Facturas pendientes"
                value={tracking.pendingInvoices.length}
                helper={formatMoney(tracking.invoicesPendingAmount)}
                color="secondary"
                icon={<ReceiptLongIcon fontSize="small" />}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
              <MetricCard
                title="Compromisos pendientes"
                value={tracking.pendingCommitments.length}
                helper={formatMoney(tracking.commitmentsPendingAmount)}
                color="warning"
                icon={<PriceCheckIcon fontSize="small" />}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
              <MetricCard
                title="Clientes perdidos"
                value={tracking.lostCount}
                helper={`vencidos > ${Math.abs(LOST_THRESHOLD_DAYS)} días`}
                color="secondary"
                icon={<FactCheckIcon fontSize="small" />}
              />
            </Grid>

            <Grid size={12}>
              <Typography variant="h4">Radar de vencimientos</Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <RadarCard
                title="Licencias"
                icon={<VpnKeyIcon fontSize="small" />}
                color="secondary"
                stats={tracking.radar.licenses}
                onOpen={() => navigate(ROUTES.licenses)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <RadarCard
                title="Suscripciones"
                icon={<CreditCardIcon fontSize="small" />}
                color="success"
                stats={tracking.radar.subscriptions}
                onOpen={() => navigate(ROUTES.subscriptions)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <RadarCard
                title="Líneas"
                icon={<RouterIcon fontSize="small" />}
                color="info"
                stats={tracking.radar.lines}
                onOpen={() => navigate(ROUTES.lines)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <RadarCard
                title="Managed Accounts"
                icon={<MarkEmailReadIcon fontSize="small" />}
                color="primary"
                stats={tracking.radar.managed}
                onOpen={() => navigate(ROUTES.managedAccounts)}
              />
            </Grid>

            <Grid size={12}>
              <Card sx={{ borderRadius: 2.5, border: '1px solid', borderColor: 'divider' }}>
                <CardContent>
                  <Stack spacing={1.4}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="h4">Cola de alertas priorizada</Typography>
                      <Chip size="small" color="primary" variant="outlined" label={`${tracking.queueFiltered.length} alertas`} />
                    </Stack>
                    <Divider />
                    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Prioridad</TableCell>
                            <TableCell>Tipo</TableCell>
                            <TableCell>Referencia</TableCell>
                            <TableCell>Cliente</TableCell>
                            <TableCell>Fecha objetivo</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Detalle</TableCell>
                            <TableCell align="right">Acción</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {tracking.queueFiltered.slice(0, 200).map((row) => {
                            const sev = severityMeta(row.severity);
                            return (
                              <TableRow key={`${row.type}-${row.entityId}-${row.reference}`}>
                                <TableCell>
                                  <Chip size="small" color={sev.color} variant="outlined" label={sev.label} />
                                </TableCell>
                                <TableCell>{row.type}</TableCell>
                                <TableCell>{row.reference}</TableCell>
                                <TableCell>{row.customerName || '-'}</TableCell>
                                <TableCell>{formatDate(row.targetDate)}</TableCell>
                                <TableCell>
                                  <Chip size="small" variant="outlined" label={row.status || '-'} />
                                </TableCell>
                                <TableCell>{row.detail}</TableCell>
                                <TableCell align="right">
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    endIcon={<LaunchIcon fontSize="small" />}
                                    onClick={() => navigate(row.route)}
                                  >
                                    Ver
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                          {tracking.queueFiltered.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={8}>
                                <Alert severity="success" variant="outlined">
                                  No hay alertas en este rango. Todo está bajo control.
                                </Alert>
                              </TableCell>
                            </TableRow>
                          ) : null}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ borderRadius: 2.5, border: '1px solid', borderColor: 'divider', height: '100%' }}>
                <CardContent>
                  <Stack spacing={1.2}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="h4">Facturas pendientes</Typography>
                      <Button size="small" variant="outlined" onClick={() => navigate(ROUTES.invoices)}>
                        Abrir facturas
                      </Button>
                    </Stack>
                    <Divider />
                    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Cliente</TableCell>
                            <TableCell>Monto pendiente</TableCell>
                            <TableCell>Vence</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {tracking.pendingInvoices.slice(0, 10).map((row) => (
                            <TableRow key={`inv-${row.id}`}>
                              <TableCell>#{row.id}</TableCell>
                              <TableCell>{customerNameMap[row.customerId] || '-'}</TableCell>
                              <TableCell>{formatMoney(row.pendingAmount)}</TableCell>
                              <TableCell>{formatDate(row.dueDate || row.createdAt || row.paymentDate)}</TableCell>
                            </TableRow>
                          ))}
                          {tracking.pendingInvoices.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={4}>No hay facturas pendientes.</TableCell>
                            </TableRow>
                          ) : null}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ borderRadius: 2.5, border: '1px solid', borderColor: 'divider', height: '100%' }}>
                <CardContent>
                  <Stack spacing={1.2}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="h4">Compromisos de pago pendientes</Typography>
                      <Button size="small" variant="outlined" onClick={() => navigate(ROUTES.commitments)}>
                        Abrir compromisos
                      </Button>
                    </Stack>
                    <Divider />
                    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Cliente</TableCell>
                            <TableCell>Monto pendiente</TableCell>
                            <TableCell>Fecha promesa</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {tracking.pendingCommitments.slice(0, 10).map((row) => (
                            <TableRow key={`commit-${row.id}`}>
                              <TableCell>#{row.id}</TableCell>
                              <TableCell>{customerNameMap[row.customerId] || '-'}</TableCell>
                              <TableCell>{formatMoney(row.pendingAmount)}</TableCell>
                              <TableCell>{formatDate(row.promisedDate)}</TableCell>
                            </TableRow>
                          ))}
                          {tracking.pendingCommitments.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={4}>No hay compromisos pendientes.</TableCell>
                            </TableRow>
                          ) : null}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={12}>
              <Alert severity="warning" variant="outlined" icon={<FactCheckIcon />}>
                Recomendación operativa: revisa primero alertas <strong>Críticas</strong> y luego <strong>Altas</strong>. Los vencidos muy
                antiguos pasan a <strong>Perdido</strong> para seguimiento comercial y ya no saturan la prioridad crítica.
              </Alert>
            </Grid>
          </Grid>
        ) : null}
      </Stack>
    </MainCard>
  );
}
