import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import HubIcon from '@mui/icons-material/Hub';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import RouterIcon from '@mui/icons-material/Router';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import RefreshIcon from '@mui/icons-material/Refresh';
import LaunchIcon from '@mui/icons-material/Launch';
import { alpha } from '@mui/material/styles';

import MainCard from 'ui-component/cards/MainCard';
import { PageEmptyState, PageErrorState, PageLoadingState } from 'ui-component/feedback/PageState';
import { gridSpacing } from 'store/constant';
import { useLionTvOverview } from 'api/liontv-overview';
import { useSubscriptionExpirationOverview } from 'api/liontv-subscription-expiration';
import { lionTvApi } from 'utils/api';
import { isResellerConsoleUser } from 'utils/rbac';
import { withAlpha } from 'utils/colorUtils';
import ResellerDashboardLionTv from 'views/liontv/ResellerDashboardLionTv';

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

function formatDate(value, locale = 'es-HN') {
  const date = parseDate(value);
  if (!date) return '-';
  return date.toLocaleDateString(locale);
}

function money(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function formatMoney(value, locale = 'es-HN') {
  return new Intl.NumberFormat(locale, {
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

function severityMeta(level, t) {
  if (level === 'CRITICAL') return { label: t('liontvDashboard.severity.critical', 'Crítico'), color: 'error' };
  if (level === 'HIGH') return { label: t('liontvDashboard.severity.high', 'Alto'), color: 'warning' };
  if (level === 'MEDIUM') return { label: t('liontvDashboard.severity.medium', 'Medio'), color: 'info' };
  if (level === 'LOST') return { label: t('liontvDashboard.severity.lost', 'Perdido'), color: 'default' };
  return { label: t('liontvDashboard.severity.low', 'Bajo'), color: 'default' };
}

function describeDays(days, t) {
  if (days === null) return t('liontvDashboard.due.noDate', 'Sin fecha');
  if (days < 0) return t('liontvDashboard.due.overdueAgo', { days: Math.abs(days), defaultValue: 'Vencido hace {{days}}d' });
  if (days === 0) return t('liontvDashboard.due.today', 'Vence hoy');
  return t('liontvDashboard.due.inDays', { days, defaultValue: 'Vence en {{days}}d' });
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

function premiumSurface(theme, color = 'primary') {
  const palette = theme.palette[color] || theme.palette.primary;
  const paletteMain = theme.vars?.palette?.[color]?.main || palette.main;
  const paletteLight = theme.vars?.palette?.[color]?.light || palette.light;
  const surfaceCard = theme.vars?.palette?.surface?.card || theme.palette.background.paper;
  return {
    borderRadius: 3.5,
    border: '1px solid',
    borderColor:
      theme.palette.mode === 'dark' ? withAlpha(paletteMain, 0.18) : withAlpha(paletteMain, 0.14),
    overflow: 'hidden',
    boxShadow:
      theme.palette.mode === 'dark'
        ? '0 22px 44px rgba(2, 8, 23, 0.34)'
        : `0 18px 34px ${alpha(theme.palette.common.black, 0.08)}`,
    background:
      theme.palette.mode === 'dark'
        ? `linear-gradient(155deg, rgba(15, 23, 42, 0.98) 0%, rgba(11, 18, 32, 0.94) 60%, rgba(7, 15, 28, 0.98) 100%)`
        : `linear-gradient(155deg, ${surfaceCard} 0%, ${withAlpha(paletteLight, 0.14)} 100%)`,
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      background: `radial-gradient(circle at top right, ${withAlpha(paletteMain, theme.palette.mode === 'dark' ? 0.14 : 0.1)} 0%, transparent 54%)`
    }
  };
}

function softSurface(theme, color = 'primary') {
  const palette = theme.palette[color] || theme.palette.primary;
  const paletteMain = theme.vars?.palette?.[color]?.main || palette.main;
  const paletteLight = theme.vars?.palette?.[color]?.light || palette.light;
  const surfaceCard = theme.vars?.palette?.surface?.card || theme.palette.background.paper;
  return {
    borderRadius: 3.5,
    border: '1px solid',
    borderColor:
      theme.palette.mode === 'dark' ? withAlpha(paletteMain, 0.18) : withAlpha(paletteMain, 0.12),
    boxShadow:
      theme.palette.mode === 'dark'
        ? '0 18px 36px rgba(2, 8, 23, 0.28)'
        : `0 16px 28px ${alpha(theme.palette.common.black, 0.06)}`,
    background:
      theme.palette.mode === 'dark'
        ? 'linear-gradient(180deg, rgba(11,18,32,0.96) 0%, rgba(10,16,29,0.98) 100%)'
        : `linear-gradient(180deg, ${surfaceCard} 0%, ${withAlpha(paletteLight, 0.1)} 100%)`
  };
}

function heroInsetSurface(theme, tint) {
  const surfaceCard = theme.vars?.palette?.surface?.card || theme.palette.background.paper;
  const primaryMain = theme.vars?.palette?.primary?.main || theme.palette.primary.main;
  const primaryLight = theme.vars?.palette?.primary?.light || theme.palette.primary.light;
  return {
    height: '100%',
    borderRadius: 3,
    border: `1px solid ${withAlpha(primaryMain, theme.palette.mode === 'dark' ? 0.2 : 0.18)}`,
    backdropFilter: 'blur(14px)',
    background:
      theme.palette.mode === 'dark'
        ? `linear-gradient(180deg, ${withAlpha(surfaceCard, 0.95)} 0%, ${tint} 100%)`
        : `linear-gradient(180deg, ${surfaceCard} 0%, ${withAlpha(primaryLight, 0.14)} 100%)`,
    boxShadow:
      theme.palette.mode === 'dark'
        ? `0 12px 24px ${alpha(theme.palette.common.black, 0.24)}`
        : `0 10px 22px ${alpha(theme.palette.common.black, 0.1)}`
  };
}

function metricCardStyle(theme, color = 'primary') {
  return premiumSurface(theme, color);
}

function MetricCard({ title, value, helper, icon, color = 'primary' }) {
  return (
    <Card sx={(theme) => metricCardStyle(theme, color)}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1.5}>
          <Box>
            <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: '0.12em', fontWeight: 700 }}>
              {title}
            </Typography>
            <Typography variant="h2" sx={{ mt: 0.8, lineHeight: 1.05 }}>
              {value}
            </Typography>
            {helper ? (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.6, maxWidth: 220 }}>
                {helper}
              </Typography>
            ) : null}
          </Box>
          <Avatar
            variant="rounded"
            sx={(theme) => ({
              width: 54,
              height: 54,
              borderRadius: 2.8,
              bgcolor: `${theme.palette[color]?.main || theme.palette.primary.main}18`,
              color: theme.palette[color]?.main || theme.palette.primary.main,
              border: '1px solid',
              borderColor: `${theme.palette[color]?.main || theme.palette.primary.main}26`
            })}
          >
            {icon}
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
}

function RadarCard({ title, stats, icon, color = 'primary', onOpen, t }) {
  return (
    <Card sx={(theme) => metricCardStyle(theme, color)}>
      <CardContent>
        <Stack spacing={1.5}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" alignItems="center" spacing={0.8}>
              <Avatar
                variant="rounded"
                sx={(theme) => ({
                  width: 40,
                  height: 40,
                  borderRadius: 2.4,
                  bgcolor: `${theme.palette[color]?.main || theme.palette.primary.main}18`,
                  color: theme.palette[color]?.main || theme.palette.primary.main
                })}
              >
                {icon}
              </Avatar>
              <Typography variant="h4">{title}</Typography>
            </Stack>
            <Button variant="outlined" size="small" onClick={onOpen} endIcon={<LaunchIcon fontSize="small" />}>
              {t('liontvDashboard.actions.open', 'Abrir')}
            </Button>
          </Stack>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Chip
              size="small"
              color="error"
              variant="outlined"
              label={t('liontvDashboard.radar.overdue', { count: stats.expired, defaultValue: 'Vencidos: {{count}}' })}
            />
            <Chip
              size="small"
              color="warning"
              variant="outlined"
              label={t('liontvDashboard.radar.today', { count: stats.today, defaultValue: 'Hoy: {{count}}' })}
            />
            <Chip
              size="small"
              color="info"
              variant="outlined"
              label={t('liontvDashboard.radar.next7', { count: stats.next7, defaultValue: '7 días: {{count}}' })}
            />
            <Chip
              size="small"
              color="primary"
              variant="outlined"
              label={t('liontvDashboard.radar.next30', { count: stats.next30, defaultValue: '30 días: {{count}}' })}
            />
            <Chip
              size="small"
              color="default"
              variant="outlined"
              label={t('liontvDashboard.radar.noDate', { count: stats.withoutDate, defaultValue: 'Sin fecha: {{count}}' })}
            />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

function SectionHeader({ eyebrow, title, description, action }) {
  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      justifyContent="space-between"
      alignItems={{ xs: 'flex-start', md: 'flex-end' }}
      spacing={1.2}
      sx={{ mb: 0.2 }}
    >
      <Box>
        {eyebrow ? (
          <Typography variant="overline" color="primary.main" sx={{ letterSpacing: '0.16em', fontWeight: 800 }}>
            {eyebrow}
          </Typography>
        ) : null}
        <Typography variant="h3" sx={{ mt: 0.25 }}>
          {title}
        </Typography>
        {description ? (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, maxWidth: 780 }}>
            {description}
          </Typography>
        ) : null}
      </Box>
      {action ? <Box>{action}</Box> : null}
    </Stack>
  );
}

function AlertsBucketCard({ title, helper, alerts, onOpenAlert, t }) {
  return (
    <Card sx={(theme) => ({ ...softSurface(theme, 'info'), height: '100%' })}>
      <CardContent>
        <Stack spacing={1.5}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h4">{title}</Typography>
            <Chip
              size="small"
              color="primary"
              variant="outlined"
              label={t('liontvDashboard.labels.alertsCount', { count: alerts.length, defaultValue: '{{count}} alertas' })}
            />
          </Stack>
          {helper ? (
            <Typography variant="caption" color="text.secondary">
              {helper}
            </Typography>
          ) : null}
          <Divider />
          <Stack spacing={1}>
            {alerts.slice(0, 8).map((alert) => {
              const sev = severityMeta(alert.severity, t);
              return (
                <Card
                  key={`${title}-${alert.type}-${alert.entityId}-${alert.reference}`}
                  variant="outlined"
                  sx={(theme) => ({
                    borderRadius: 3,
                    borderColor:
                      sev.color === 'error'
                        ? `${theme.palette.error.main}30`
                        : sev.color === 'warning'
                          ? `${theme.palette.warning.main}30`
                          : sev.color === 'info'
                            ? `${theme.palette.info.main}30`
                            : 'divider',
                    background:
                      theme.palette.mode === 'dark'
                        ? 'linear-gradient(180deg, rgba(15,23,42,0.76) 0%, rgba(10,16,29,0.82) 100%)'
                        : `linear-gradient(180deg, ${theme.vars?.palette?.surface?.card || theme.palette.background.paper} 0%, ${withAlpha(
                            theme.vars?.palette?.[sev.color === 'default' ? 'primary' : sev.color]?.light ||
                              theme.palette[sev.color === 'default' ? 'primary' : sev.color].light,
                            0.14
                          )} 100%)`
                  })}
                >
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
                          {t('liontvDashboard.actions.view', 'Ver')}
                        </Button>
                      </Stack>
                      <Typography variant="subtitle1" sx={{ wordBreak: 'break-word', fontWeight: 700 }}>
                        {alert.reference}
                      </Typography>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} useFlexGap>
                        <Typography variant="caption" color="text.secondary">
                          {t('liontvDashboard.labels.customer', 'Cliente')}: {alert.customerName || '-'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {t('liontvDashboard.labels.status', 'Estado')}: {alert.status || '-'}
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
                {t('liontvDashboard.messages.noAlertsInBucket', 'Sin alertas en este bloque.')}
              </Alert>
            ) : null}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function LionTvDashboard() {
  const { t, i18n } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { accessToken, user, lionTvViewMode } = useAuth();
  const navigate = useNavigate();
  const resellerMode = isResellerConsoleUser(user, lionTvViewMode);
  const [horizonDays, setHorizonDays] = useState(30);
  const [criticalOnly, setCriticalOnly] = useState(false);
  const locale = useMemo(() => {
    const lang = String(i18n?.resolvedLanguage || i18n?.language || 'es').toLowerCase();
    return lang.startsWith('en') ? 'en-US' : 'es-HN';
  }, [i18n?.language, i18n?.resolvedLanguage]);
  const isEnglish = locale === 'en-US';
  const dashboardCopy = useMemo(
    () =>
      isEnglish
        ? {
            heroBadge: 'Operations command center',
            heroTitle: 'Professional tracking for renewals, collections and service risk',
            heroSubtitle:
              'This view is now designed like an executive console: immediate alerts first, revenue exposure second, and operational radar after that.',
            heroSignals: {
              critical: 'Critical now',
              revenue: 'Revenue exposed',
              expiration: 'Expiration queue',
              shared: 'Shared risk'
            },
            sections: {
              pulseEyebrow: 'Immediate response',
              pulseTitle: 'What needs action in the next 7 days',
              pulseDescription: 'Read this block first. It isolates what expires today, tomorrow or in the next week so operations can react before customers notice.',
              metricsEyebrow: 'Command metrics',
              metricsTitle: 'Portfolio pressure and commercial leakage',
              metricsDescription:
                'These KPIs summarize operational pressure, overdue exposure and collections still open. They are meant to be scanned in seconds.',
              radarEyebrow: 'Coverage radar',
              radarTitle: 'Expiration radar by resource',
              radarDescription: 'Every resource keeps its own expiry rhythm. This radar shows where operational debt is accumulating.',
              queueEyebrow: 'Priority queue',
              queueTitle: 'Prioritized workbench',
              queueDescription:
                'The queue is sorted by urgency so support and operations can attack the most dangerous cases first without losing context.',
              financeEyebrow: 'Collections watch',
              financeTitle: 'Money still pending',
              financeDescription: 'Keep these tables close. They show what is still open and where revenue can leak if follow-up slows down.'
            }
          }
        : {
            heroBadge: 'Centro de mando operativo',
            heroTitle: 'Tracking profesional para renovaciones, cobros y riesgo de servicio',
            heroSubtitle:
              'Esta vista ahora funciona como una consola ejecutiva: primero alertas inmediatas, después dinero expuesto y luego radar operativo por recurso.',
            heroSignals: {
              critical: 'Crítico ahora',
              revenue: 'Dinero expuesto',
              expiration: 'Cola expiración',
              shared: 'Riesgo shared'
            },
            sections: {
              pulseEyebrow: 'Respuesta inmediata',
              pulseTitle: 'Qué necesita acción en los próximos 7 días',
              pulseDescription:
                'Lee este bloque primero. Aísla lo que vence hoy, mañana y en la próxima semana para que operaciones reaccione antes de que el cliente lo sienta.',
              metricsEyebrow: 'Métricas de mando',
              metricsTitle: 'Presión del portafolio y fugas comerciales',
              metricsDescription:
                'Estos KPI resumen presión operativa, exposición vencida y cobros todavía abiertos. Deben poder leerse en segundos.',
              radarEyebrow: 'Radar de cobertura',
              radarTitle: 'Radar de vencimientos por recurso',
              radarDescription:
                'Cada recurso tiene su propio ritmo de vencimiento. Este radar muestra dónde se está acumulando deuda operativa.',
              queueEyebrow: 'Cola priorizada',
              queueTitle: 'Mesa de trabajo priorizada',
              queueDescription:
                'La cola está ordenada por urgencia para que soporte y operaciones ataquen primero los casos más peligrosos sin perder contexto.',
              financeEyebrow: 'Seguimiento de cobros',
              financeTitle: 'Dinero todavía pendiente',
              financeDescription:
                'Mantén estas tablas cerca. Aquí ves qué sigue abierto y dónde se puede escapar ingreso si el seguimiento se enfría.'
            }
          },
    [isEnglish, locale]
  );

  const [customers, setCustomers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [licenses, setLicenses] = useState([]);
  const [lines, setLines] = useState([]);
  const [managedAccounts, setManagedAccounts] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [commitments, setCommitments] = useState([]);
  const [sharedRiskKpi, setSharedRiskKpi] = useState({
    overdueClusters: 0,
    criticalClusters: 0,
    atRiskSubscriptions: 0
  });
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
  const { data: expirationOverview } = useSubscriptionExpirationOverview({ enabled: Boolean(accessToken), refreshInterval: 60000 });

  const expirationAttentionCount =
    Number(expirationOverview?.statusCounts?.failed || 0) + Number(expirationOverview?.statusCounts?.manualPending || 0);
  const expirationStale = Boolean(expirationOverview?.detectorStale || expirationOverview?.workerStale);

  const loadSharedRiskOverview = useCallback(async () => {
    if (!accessToken) {
      setSharedRiskKpi({
        overdueClusters: 0,
        criticalClusters: 0,
        atRiskSubscriptions: 0
      });
      return;
    }

    try {
      const response = await lionTvApi.get('/subscription-sharing/v1/overview', {
        params: { index: 0, size: 1 },
        skipAuthRedirect: true
      });
      const payload = response?.data?.data ?? response?.data ?? {};
      setSharedRiskKpi({
        overdueClusters: Number(payload?.kpi?.overdueClusters || 0),
        criticalClusters: Number(payload?.kpi?.criticalClusters || 0),
        atRiskSubscriptions: Number(payload?.kpi?.atRiskSubscriptions || 0)
      });
    } catch (error) {
      setSharedRiskKpi({
        overdueClusters: 0,
        criticalClusters: 0,
        atRiskSubscriptions: 0
      });
    }
  }, [accessToken]);

  useEffect(() => {
    let active = true;

    const safeLoad = async () => {
      if (!active) return;
      await loadSharedRiskOverview();
    };

    safeLoad();
    const intervalId = window.setInterval(safeLoad, 60000);

    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, [loadSharedRiskOverview]);

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
        detail: describeDays(days, t)
      });
    };

    licenses.forEach((item) => {
      pushExpiryAlert(item, t('liontvDashboard.types.license', 'Licencia'), ROUTES.licenses, {
        dateField: 'expireAt',
        statusField: 'status',
        reference: (it) => `${it.app || t('liontvDashboard.labels.appFallback', 'APP')} #${it.id ?? '-'}`,
        fallbackName: () => '-'
      });
    });

    subscriptions.forEach((item) => {
      pushExpiryAlert(item, t('liontvDashboard.types.subscription', 'Suscripción'), ROUTES.subscriptions, {
        dateField: 'renewalDate',
        statusField: 'status',
        reference: (it) => `${it.packageName || t('liontvDashboard.labels.planFallback', 'Plan')} #${it.id ?? '-'}`,
        fallbackName: () => '-'
      });
    });

    lines.forEach((item) => {
      pushExpiryAlert(item, t('liontvDashboard.types.line', 'Línea'), ROUTES.lines, {
        dateField: 'expDate',
        statusField: 'status',
        reference: (it) => `${it.username || 'line'} #${it.id ?? '-'}`,
        fallbackName: () => '-'
      });
    });

    managedAccounts.forEach((item) => {
      pushExpiryAlert(item, t('liontvDashboard.types.managedAccount', 'Managed Account'), ROUTES.managedAccounts, {
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
        type: t('liontvDashboard.types.pendingInvoice', 'Factura pendiente'),
        route: ROUTES.invoices,
        entityId: inv.id ?? '-',
        reference: t('liontvDashboard.reference.invoice', { id: inv.id ?? '-', defaultValue: 'Factura #{{id}}' }),
        customerName: customerNameMap[inv.customerId] || '-',
        status: inv.status,
        targetDate: inv.dueDate ?? inv.createdAt ?? inv.paymentDate ?? null,
        days,
        detail: `${describeDays(days, t)} · ${formatMoney(inv.pendingAmount, locale)}`
      });
    });

    const pendingCommitments = commitments.filter((it) => it.pendingAmount > 0 || it.status === 'PENDING');
    pendingCommitments.forEach((item) => {
      const days = daysUntil(item.promisedDate);
      queue.push({
        severity: severityFromDays(days),
        type: t('liontvDashboard.types.paymentCommitment', 'Compromiso de pago'),
        route: ROUTES.commitments,
        entityId: item.id ?? '-',
        reference: t('liontvDashboard.reference.commitment', { id: item.id ?? '-', defaultValue: 'Compromiso #{{id}}' }),
        customerName: customerNameMap[item.customerId] || '-',
        status: item.status,
        targetDate: item.promisedDate,
        days,
        detail: `${describeDays(days, t)} · ${formatMoney(item.pendingAmount, locale)}`
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
  }, [licenses, subscriptions, lines, managedAccounts, invoices, commitments, horizonDays, criticalOnly, customerNameMap, locale, t]);

  if (resellerMode) {
    return (
      <ResellerDashboardLionTv
        customers={customers}
        subscriptions={subscriptions}
        licenses={licenses}
        invoices={invoices}
        expirationAttentionCount={expirationAttentionCount}
        sharedRiskKpi={sharedRiskKpi}
        loadingCore={loading}
        errorMessage={overviewError?.response?.data?.message || ''}
        onRefresh={() => {
          refresh();
          loadSharedRiskOverview();
        }}
      />
    );
  }

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
      title={t('menu.liontvDashboard', 'Operational Tracking')}
      secondary={
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<RefreshIcon fontSize="small" />}
            onClick={() => {
              refresh();
              loadSharedRiskOverview();
            }}
            disabled={loading}
          >
            {t('actions.refresh', 'Recargar')}
          </Button>
        </Stack>
      }
    >
      <Stack spacing={3}>
        <Card
          sx={(theme) => ({
            borderRadius: 4,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: theme.palette.mode === 'dark' ? 'rgba(148, 163, 184, 0.12)' : 'rgba(15, 23, 42, 0.08)',
            color: 'common.white',
            background:
              theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, #07111f 0%, #0f172a 28%, #10233c 62%, #0f3a4a 100%)'
                : 'linear-gradient(135deg, #0f172a 0%, #183b5b 38%, #0b5e72 72%, #22c55e 120%)',
            boxShadow: theme.palette.mode === 'dark' ? '0 28px 52px rgba(2, 8, 23, 0.42)' : '0 24px 46px rgba(15, 23, 42, 0.18)'
          })}
        >
          <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
            <Grid container spacing={3} alignItems="stretch">
              <Grid size={{ xs: 12, lg: 7 }}>
                <Stack spacing={2}>
                  <Chip
                    label={dashboardCopy.heroBadge}
                    sx={{
                      alignSelf: 'flex-start',
                      bgcolor: 'rgba(255,255,255,0.14)',
                      color: 'common.white',
                      fontWeight: 700,
                      letterSpacing: '0.04em'
                    }}
                  />
                  <Typography variant="h2" sx={{ fontSize: { xs: '1.9rem', md: '2.75rem' }, maxWidth: 780 }}>
                    {dashboardCopy.heroTitle}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.78)', maxWidth: 720, lineHeight: 1.7 }}>
                    {dashboardCopy.heroSubtitle}
                  </Typography>

                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.2} alignItems={{ xs: 'flex-start', md: 'center' }}>
                    <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.75)' }}>
                      {t('liontvDashboard.horizonLabel', 'Horizonte de alertas:')}
                    </Typography>
                    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                      {HORIZON_OPTIONS.map((days) => (
                        <Chip
                          key={days}
                          label={t('liontvDashboard.daysChip', { days, defaultValue: '{{days}} días' })}
                          clickable
                          color={horizonDays === days ? 'primary' : 'default'}
                          variant={horizonDays === days ? 'filled' : 'outlined'}
                          onClick={() => setHorizonDays(days)}
                          sx={{
                            bgcolor: horizonDays === days ? 'common.white' : 'rgba(255,255,255,0.06)',
                            color: horizonDays === days ? 'primary.main' : 'common.white',
                            borderColor: 'rgba(255,255,255,0.18)'
                          }}
                        />
                      ))}
                      <Chip
                        label={t('liontvDashboard.criticalOnly', 'Solo críticos')}
                        clickable
                        color={criticalOnly ? 'error' : 'default'}
                        variant={criticalOnly ? 'filled' : 'outlined'}
                        onClick={() => setCriticalOnly((prev) => !prev)}
                        sx={{
                          bgcolor: criticalOnly ? 'error.main' : 'rgba(255,255,255,0.06)',
                          color: 'common.white',
                          borderColor: criticalOnly ? 'error.main' : 'rgba(255,255,255,0.18)'
                        }}
                      />
                    </Stack>
                  </Stack>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, lg: 5 }}>
                <Grid container spacing={1.5}>
                  {[
                    {
                      title: dashboardCopy.heroSignals.critical,
                      value: tracking.criticalCount,
                      helper: t('liontvDashboard.metrics.todayAlerts.helper', 'vence hoy'),
                      color: 'rgba(248, 113, 113, 0.22)'
                    },
                    {
                      title: dashboardCopy.heroSignals.revenue,
                      value: formatMoney(tracking.invoicesPendingAmount + tracking.commitmentsPendingAmount, locale),
                      helper: t('liontvDashboard.table.pendingAmount', 'Monto pendiente'),
                      color: 'rgba(250, 204, 21, 0.2)'
                    },
                    {
                      title: dashboardCopy.heroSignals.expiration,
                      value: expirationAttentionCount,
                      helper: expirationStale ? t('liontvDashboard.expirationAlert.stale', 'Proceso stale') : t('liontvDashboard.expirationAlert.open', 'Abrir expiraciones'),
                      color: 'rgba(96, 165, 250, 0.18)'
                    },
                    {
                      title: dashboardCopy.heroSignals.shared,
                      value: sharedRiskKpi.criticalClusters,
                      helper: t('liontvDashboard.metrics.sharedRisk.helper', {
                        overdue: sharedRiskKpi.overdueClusters,
                        defaultValue: '{{overdue}} overdue hosts'
                      }),
                      color: 'rgba(52, 211, 153, 0.16)'
                    }
                  ].map((item) => (
                    <Grid key={item.title} size={{ xs: 12, sm: 6 }}>
                      <Card sx={(theme) => heroInsetSurface(theme, item.color)}>
                        <CardContent>
                          <Stack spacing={0.8}>
                            <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.72)', letterSpacing: '0.12em' }}>
                              {item.title}
                            </Typography>
                            <Typography variant="h3" color="common.white" sx={{ lineHeight: 1.05, wordBreak: 'break-word' }}>
                              {item.value}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.74)' }}>
                              {item.helper}
                            </Typography>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {expirationAttentionCount > 0 || expirationStale ? (
          <Alert
            severity={expirationStale ? 'error' : 'warning'}
            variant="outlined"
            action={
              <Button color="inherit" size="small" onClick={() => navigate('/liontv/subscription-expiration')} startIcon={<LaunchIcon />}>
                {t('liontvDashboard.expirationAlert.open', 'Abrir expiraciones')}
              </Button>
            }
          >
            {expirationStale
              ? t(
                  'liontvDashboard.expirationAlert.stale',
                  'El scheduler de expiración está stale. Revisa el detector/worker porque este proceso es crítico.'
                )
              : t('liontvDashboard.expirationAlert.jobs', {
                  count: expirationAttentionCount,
                  defaultValue: `Hay ${expirationAttentionCount} jobs críticos de expiración para revisar.`
                })}
          </Alert>
        ) : null}

        {sharedRiskKpi.criticalClusters > 0 ? (
          <Alert
            severity={sharedRiskKpi.overdueClusters > 0 ? 'error' : 'warning'}
            variant="outlined"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() =>
                  navigate(
                    `/liontv/subscription-sharing?status=HOST&hostAtRisk=true${
                      sharedRiskKpi.overdueClusters > 0 ? '&riskBucket=OVERDUE' : ''
                    }`
                  )
                }
                startIcon={<LaunchIcon />}
              >
                {t('liontvDashboard.sharedRisk.open', 'Abrir shared risk')}
              </Button>
            }
          >
            {sharedRiskKpi.overdueClusters > 0
              ? t('liontvDashboard.sharedRisk.overdue', {
                  overdue: sharedRiskKpi.overdueClusters,
                  critical: sharedRiskKpi.criticalClusters,
                  defaultValue:
                    '{{overdue}} hosts compartidos ya vencidos y {{critical}} buckets críticos en shared subscriptions.'
                })
              : t('liontvDashboard.sharedRisk.critical', {
                  critical: sharedRiskKpi.criticalClusters,
                  affected: sharedRiskKpi.atRiskSubscriptions,
                  defaultValue:
                    '{{critical}} hosts vencen en 7 días o menos y ya ponen en riesgo {{affected}} suscripciones dentro de shared subscriptions.'
                })}
          </Alert>
        ) : null}

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} alignItems={{ xs: 'flex-start', md: 'center' }}>
          <Typography variant="subtitle2" color="text.secondary">
            {t('liontvDashboard.horizonLabel', 'Horizonte de alertas:')}
          </Typography>
          <Stack direction="row" spacing={1}>
            {HORIZON_OPTIONS.map((days) => (
              <Chip
                key={days}
                label={t('liontvDashboard.daysChip', { days, defaultValue: '{{days}} días' })}
                clickable
                color={horizonDays === days ? 'primary' : 'default'}
                variant={horizonDays === days ? 'filled' : 'outlined'}
                onClick={() => setHorizonDays(days)}
              />
            ))}
          </Stack>
          <Chip
            label={t('liontvDashboard.criticalOnly', 'Solo críticos')}
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
              <SectionHeader
                eyebrow={dashboardCopy.sections.pulseEyebrow}
                title={dashboardCopy.sections.pulseTitle}
                description={dashboardCopy.sections.pulseDescription}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <MetricCard
                title={t('liontvDashboard.metrics.todayAlerts.title', 'Alertas de hoy')}
                value={tracking.todayCount}
                helper={t('liontvDashboard.metrics.todayAlerts.helper', 'vence hoy')}
                color="error"
                icon={<CalendarMonthIcon fontSize="small" />}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <MetricCard
                title={t('liontvDashboard.metrics.tomorrowAlerts.title', 'Alertas de mañana')}
                value={tracking.tomorrowCount}
                helper={t('liontvDashboard.metrics.tomorrowAlerts.helper', 'vence en 1 día')}
                color="warning"
                icon={<CalendarMonthIcon fontSize="small" />}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <MetricCard
                title={t('liontvDashboard.metrics.next7Alerts.title', 'Alertas a 7 días')}
                value={tracking.in7DaysCount}
                helper={t('liontvDashboard.metrics.next7Alerts.helper', 'desde 2 hasta 7 días')}
                color="info"
                icon={<CalendarMonthIcon fontSize="small" />}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <MetricCard
                title={isEnglish ? 'Revenue exposed' : 'Dinero expuesto'}
                value={formatMoney(tracking.invoicesPendingAmount + tracking.commitmentsPendingAmount, locale)}
                helper={isEnglish ? 'Pending invoices + commitments' : 'Facturas pendientes + compromisos'}
                color="secondary"
                icon={<PriceCheckIcon fontSize="small" />}
              />
            </Grid>

            <Grid size={12}>
              <Divider />
            </Grid>

            <Grid size={12}>
              <SectionHeader
                eyebrow={isEnglish ? 'Daily windows' : 'Ventanas diarias'}
                title={isEnglish ? 'Detailed buckets by day' : 'Buckets detallados por día'}
                description={
                  isEnglish
                    ? 'Each bucket isolates concrete work. Open from here and jump straight to the module that needs attention.'
                    : 'Cada bucket aísla trabajo concreto. Desde aquí puedes saltar directo al módulo que necesita atención.'
                }
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <AlertsBucketCard
                title={t('liontvDashboard.buckets.today.title', 'Detalle de hoy')}
                helper={t('liontvDashboard.buckets.today.helper', 'Casos que vencen hoy')}
                alerts={tracking.todayAlerts}
                onOpenAlert={(alert) => navigate(alert.route)}
                t={t}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <AlertsBucketCard
                title={t('liontvDashboard.buckets.tomorrow.title', 'Detalle de mañana')}
                helper={t('liontvDashboard.buckets.tomorrow.helper', 'Casos que vencen en 1 día')}
                alerts={tracking.tomorrowAlerts}
                onOpenAlert={(alert) => navigate(alert.route)}
                t={t}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <AlertsBucketCard
                title={t('liontvDashboard.buckets.next7.title', 'Detalle próximos 7 días')}
                helper={t('liontvDashboard.buckets.next7.helper', 'Casos que vencen entre 2 y 7 días')}
                alerts={tracking.in7DaysAlerts}
                onOpenAlert={(alert) => navigate(alert.route)}
                t={t}
              />
            </Grid>

            <Grid size={12}>
              <Divider />
            </Grid>

            <Grid size={12}>
              <SectionHeader
                eyebrow={dashboardCopy.sections.metricsEyebrow}
                title={dashboardCopy.sections.metricsTitle}
                description={dashboardCopy.sections.metricsDescription}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4, xl: 2 }}>
              <MetricCard
                title={t('liontvDashboard.metrics.criticalAlerts.title', 'Alertas críticas')}
                value={tracking.criticalCount}
                helper={t('liontvDashboard.metrics.criticalAlerts.helper', {
                  count: tracking.todayOrTomorrowCount,
                  defaultValue: '{{count}} vencen hoy/1 día'
                })}
                color="error"
                icon={<ErrorOutlineIcon fontSize="small" />}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4, xl: 2 }}>
              <MetricCard
                title={t('liontvDashboard.metrics.highAlerts.title', 'Alertas altas')}
                value={tracking.highCount}
                helper={t('liontvDashboard.metrics.highAlerts.helper', {
                  count: tracking.overdueActiveCount,
                  defaultValue: '{{count}} vencidas recientes'
                })}
                color="warning"
                icon={<WarningAmberIcon fontSize="small" />}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4, xl: 2 }}>
              <MetricCard
                title={t('liontvDashboard.metrics.horizonAlerts.title', {
                  days: horizonDays,
                  defaultValue: 'Próximos {{days}} días'
                })}
                value={tracking.queue.length}
                helper={t('liontvDashboard.metrics.horizonAlerts.helper', {
                  count: tracking.next7Count,
                  defaultValue: '{{count}} en 7 días'
                })}
                color="info"
                icon={<NotificationsActiveIcon fontSize="small" />}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4, xl: 2 }}>
              <MetricCard
                title={t('liontvDashboard.metrics.pendingInvoices.title', 'Facturas pendientes')}
                value={tracking.pendingInvoices.length}
                helper={formatMoney(tracking.invoicesPendingAmount, locale)}
                color="secondary"
                icon={<ReceiptLongIcon fontSize="small" />}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4, xl: 2 }}>
              <MetricCard
                title={t('liontvDashboard.metrics.pendingCommitments.title', 'Compromisos pendientes')}
                value={tracking.pendingCommitments.length}
                helper={formatMoney(tracking.commitmentsPendingAmount, locale)}
                color="warning"
                icon={<PriceCheckIcon fontSize="small" />}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4, xl: 2 }}>
              <MetricCard
                title={t('liontvDashboard.metrics.lostCustomers.title', 'Clientes perdidos')}
                value={tracking.lostCount}
                helper={t('liontvDashboard.metrics.lostCustomers.helper', {
                  days: Math.abs(LOST_THRESHOLD_DAYS),
                  defaultValue: 'vencidos > {{days}} días'
                })}
                color="secondary"
                icon={<FactCheckIcon fontSize="small" />}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4, xl: 2 }}>
              <MetricCard
                title={t('liontvDashboard.metrics.sharedRisk.title', 'Shared risk')}
                value={sharedRiskKpi.criticalClusters}
                helper={t('liontvDashboard.metrics.sharedRisk.helper', {
                  overdue: sharedRiskKpi.overdueClusters,
                  defaultValue: '{{overdue}} overdue hosts'
                })}
                color="warning"
                icon={<HubIcon fontSize="small" />}
              />
            </Grid>

            <Grid size={12}>
              <SectionHeader
                eyebrow={dashboardCopy.sections.radarEyebrow}
                title={dashboardCopy.sections.radarTitle}
                description={dashboardCopy.sections.radarDescription}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <RadarCard
                title={t('liontvDashboard.types.licensePlural', 'Licencias')}
                icon={<VpnKeyIcon fontSize="small" />}
                color="secondary"
                stats={tracking.radar.licenses}
                onOpen={() => navigate(ROUTES.licenses)}
                t={t}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <RadarCard
                title={t('liontvDashboard.types.subscriptionPlural', 'Suscripciones')}
                icon={<CreditCardIcon fontSize="small" />}
                color="success"
                stats={tracking.radar.subscriptions}
                onOpen={() => navigate(ROUTES.subscriptions)}
                t={t}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <RadarCard
                title={t('liontvDashboard.types.linePlural', 'Líneas')}
                icon={<RouterIcon fontSize="small" />}
                color="info"
                stats={tracking.radar.lines}
                onOpen={() => navigate(ROUTES.lines)}
                t={t}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <RadarCard
                title={t('liontvDashboard.types.managedAccountPlural', 'Managed Accounts')}
                icon={<MarkEmailReadIcon fontSize="small" />}
                color="primary"
                stats={tracking.radar.managed}
                onOpen={() => navigate(ROUTES.managedAccounts)}
                t={t}
              />
            </Grid>

            <Grid size={12}>
              <SectionHeader
                eyebrow={dashboardCopy.sections.queueEyebrow}
                title={dashboardCopy.sections.queueTitle}
                description={dashboardCopy.sections.queueDescription}
                action={
                  <Chip
                    size="small"
                    color="primary"
                    variant="outlined"
                    label={t('liontvDashboard.labels.alertsCount', {
                      count: tracking.queueFiltered.length,
                      defaultValue: '{{count}} alertas'
                    })}
                  />
                }
              />
            </Grid>

            <Grid size={{ xs: 12, xl: 8 }}>
              <Card sx={(theme) => softSurface(theme, 'primary')}>
                <CardContent>
                  <Stack spacing={1.4}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="h4">{t('liontvDashboard.sections.priorityQueue', 'Cola de alertas priorizada')}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {criticalOnly
                          ? isEnglish
                            ? 'Critical filter enabled'
                            : 'Filtro crítico activado'
                          : isEnglish
                            ? 'Showing full operational queue'
                            : 'Mostrando cola operativa completa'}
                      </Typography>
                    </Stack>
                    <Divider />
                    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                      <Table size="small" sx={{ minWidth: { xs: 760, md: '100%' } }}>
                        <TableHead>
                          <TableRow>
                            <TableCell>{t('liontvDashboard.table.priority', 'Prioridad')}</TableCell>
                            <TableCell>{t('liontvDashboard.table.type', 'Tipo')}</TableCell>
                            <TableCell>{t('liontvDashboard.table.reference', 'Referencia')}</TableCell>
                            <TableCell>{t('liontvDashboard.table.customer', 'Cliente')}</TableCell>
                            <TableCell>{t('liontvDashboard.table.targetDate', 'Fecha objetivo')}</TableCell>
                            <TableCell>{t('liontvDashboard.table.status', 'Estado')}</TableCell>
                            <TableCell>{t('liontvDashboard.table.detail', 'Detalle')}</TableCell>
                            <TableCell align="right">{t('liontvDashboard.table.action', 'Acción')}</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {tracking.queueFiltered.slice(0, 200).map((row) => {
                            const sev = severityMeta(row.severity, t);
                            return (
                              <TableRow key={`${row.type}-${row.entityId}-${row.reference}`}>
                                <TableCell>
                                  <Chip size="small" color={sev.color} variant="outlined" label={sev.label} />
                                </TableCell>
                                <TableCell>{row.type}</TableCell>
                                <TableCell>{row.reference}</TableCell>
                                <TableCell>{row.customerName || '-'}</TableCell>
                                <TableCell>{formatDate(row.targetDate, locale)}</TableCell>
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
                                    {t('liontvDashboard.actions.view', 'Ver')}
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                          {tracking.queueFiltered.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={8}>
                                <Alert severity="success" variant="outlined">
                                  {t('liontvDashboard.messages.queueEmpty', 'No hay alertas en este rango. Todo está bajo control.')}
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

            <Grid size={{ xs: 12, xl: 4 }}>
              <Stack spacing={gridSpacing}>
                <SectionHeader
                  eyebrow={dashboardCopy.sections.financeEyebrow}
                  title={dashboardCopy.sections.financeTitle}
                  description={dashboardCopy.sections.financeDescription}
                />

                <Card sx={(theme) => softSurface(theme, 'warning')}>
                  <CardContent>
                    <Stack spacing={1.2}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h4">{t('liontvDashboard.sections.pendingInvoices', 'Facturas pendientes')}</Typography>
                        <Button size="small" variant="outlined" onClick={() => navigate(ROUTES.invoices)}>
                          {t('liontvDashboard.actions.openInvoices', 'Abrir facturas')}
                        </Button>
                      </Stack>
                      <Divider />
                      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>{t('liontvDashboard.table.id', 'ID')}</TableCell>
                              <TableCell>{t('liontvDashboard.table.customer', 'Cliente')}</TableCell>
                              <TableCell>{t('liontvDashboard.table.pendingAmount', 'Monto pendiente')}</TableCell>
                              <TableCell>{t('liontvDashboard.table.dueDate', 'Vence')}</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {tracking.pendingInvoices.slice(0, 6).map((row) => (
                              <TableRow key={`inv-${row.id}`}>
                                <TableCell>#{row.id}</TableCell>
                                <TableCell>{customerNameMap[row.customerId] || '-'}</TableCell>
                                <TableCell>{formatMoney(row.pendingAmount, locale)}</TableCell>
                                <TableCell>{formatDate(row.dueDate || row.createdAt || row.paymentDate, locale)}</TableCell>
                              </TableRow>
                            ))}
                            {tracking.pendingInvoices.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={4}>{t('liontvDashboard.messages.noPendingInvoices', 'No hay facturas pendientes.')}</TableCell>
                              </TableRow>
                            ) : null}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Stack>
                  </CardContent>
                </Card>

                <Card sx={(theme) => softSurface(theme, 'info')}>
                  <CardContent>
                    <Stack spacing={1.2}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h4">{t('liontvDashboard.sections.pendingCommitments', 'Compromisos de pago pendientes')}</Typography>
                        <Button size="small" variant="outlined" onClick={() => navigate(ROUTES.commitments)}>
                          {t('liontvDashboard.actions.openCommitments', 'Abrir compromisos')}
                        </Button>
                      </Stack>
                      <Divider />
                      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>{t('liontvDashboard.table.id', 'ID')}</TableCell>
                              <TableCell>{t('liontvDashboard.table.customer', 'Cliente')}</TableCell>
                              <TableCell>{t('liontvDashboard.table.pendingAmount', 'Monto pendiente')}</TableCell>
                              <TableCell>{t('liontvDashboard.table.promisedDate', 'Fecha promesa')}</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {tracking.pendingCommitments.slice(0, 6).map((row) => (
                              <TableRow key={`commit-${row.id}`}>
                                <TableCell>#{row.id}</TableCell>
                                <TableCell>{customerNameMap[row.customerId] || '-'}</TableCell>
                                <TableCell>{formatMoney(row.pendingAmount, locale)}</TableCell>
                                <TableCell>{formatDate(row.promisedDate, locale)}</TableCell>
                              </TableRow>
                            ))}
                            {tracking.pendingCommitments.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={4}>
                                  {t('liontvDashboard.messages.noPendingCommitments', 'No hay compromisos pendientes.')}
                                </TableCell>
                              </TableRow>
                            ) : null}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>

            <Grid size={12}>
              <Alert severity="warning" variant="outlined" icon={<FactCheckIcon />}>
                {t(
                  'liontvDashboard.messages.operationalRecommendation',
                  'Recomendación operativa: revisa primero alertas críticas y luego altas. Los vencidos muy antiguos pasan a perdido para seguimiento comercial y ya no saturan la prioridad crítica.'
                )}
              </Alert>
            </Grid>
          </Grid>
        ) : null}
      </Stack>
    </MainCard>
  );
}
