import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import useAuth from 'hooks/useAuth';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import Skeleton from '@mui/material/Skeleton';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import HubIcon from '@mui/icons-material/Hub';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import LinkIcon from '@mui/icons-material/Link';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RuleIcon from '@mui/icons-material/Rule';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import BlockIcon from '@mui/icons-material/Block';
import TuneIcon from '@mui/icons-material/Tune';
import ViewTimelineIcon from '@mui/icons-material/ViewTimeline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import MainCard from 'ui-component/cards/MainCard';
import DialogTitleWithClose from 'ui-component/dialogs/DialogTitleWithClose';
import ResponsiveMetricGrid from 'ui-component/responsive/ResponsiveMetricGrid';
import { lionTvApi } from 'utils/api';
import { withAlpha } from 'utils/colorUtils';

function normalizeRow(item = {}) {
  return {
    subscriptionId: item.subscriptionId ?? null,
    customerId: item.customerId ?? null,
    customerName: item.customerName ?? item.customer_name ?? '-',
    lineId: item.lineId ?? '-',
    lineName: item.lineName ?? item.line_name ?? '',
    linePlusId: item.linePlusId ?? '-',
    provider: item.provider ?? '-',
    subscriptionStatus: String(item.subscriptionStatus || item.status || '').toUpperCase(),
    billing: item.billing ?? '-',
    startDate: item.startDate ?? null,
    renewalDate: item.renewalDate ?? null,
    termMonths: Number(item.termMonths || 0),
    activatedScreens: Number(item.activatedScreens || 0),
    estimatedCustomerUsage: Number(item.estimatedCustomerUsage || 0),
    availableCapacity: Number(item.availableCapacity || 0),
    eligible: Boolean(item.eligible),
    eligibilityReason: String(item.eligibilityReason || 'ELIGIBLE').toUpperCase(),
    minimumEligibleMonths: Number(item.minimumEligibleMonths || 3),
    sharingRole: String(item.sharingRole || 'NONE').toUpperCase(),
    rolePreference: String(item.rolePreference || 'AUTO').toUpperCase(),
    sharedCluster: Boolean(item.sharedCluster),
    sharedHostSubscriptionId: item.sharedHostSubscriptionId ?? null,
    sharedClusterSize: Number(item.sharedClusterSize || 0),
    hostRenewalDate: item.hostRenewalDate ?? item.renewalDate ?? null,
    hostRenewalDayOfMonth: item.hostRenewalDayOfMonth != null ? Number(item.hostRenewalDayOfMonth) : null,
    hostDaysToRenewal: item.hostDaysToRenewal != null ? Number(item.hostDaysToRenewal) : null,
    hostRiskBucket: String(item.hostRiskBucket || 'UNKNOWN').toUpperCase(),
    hostAtRisk: Boolean(item.hostAtRisk),
    requiredScreensToMove: item.requiredScreensToMove != null ? Number(item.requiredScreensToMove) : null,
    moveRecommendationAvailable: Boolean(item.moveRecommendationAvailable),
    moveRecommendationPriority: String(item.moveRecommendationPriority || 'NONE').toUpperCase(),
    moveRecommendationReason: String(item.moveRecommendationReason || '').toUpperCase(),
    recommendedDestinationSubscriptionId: item.recommendedDestinationSubscriptionId ?? null,
    recommendedDestinationCustomerId: item.recommendedDestinationCustomerId ?? null,
    recommendedDestinationCustomerName: item.recommendedDestinationCustomerName ?? '-',
    recommendedDestinationLineId: item.recommendedDestinationLineId ?? null,
    recommendedDestinationLineName: item.recommendedDestinationLineName ?? '',
    recommendedDestinationLinePlusId: item.recommendedDestinationLinePlusId ?? null,
    recommendedDestinationHostRenewalDate: item.recommendedDestinationHostRenewalDate ?? null,
    recommendedDestinationHostRenewalDayOfMonth:
      item.recommendedDestinationHostRenewalDayOfMonth != null ? Number(item.recommendedDestinationHostRenewalDayOfMonth) : null,
    recommendedDestinationHostDaysToRenewal:
      item.recommendedDestinationHostDaysToRenewal != null ? Number(item.recommendedDestinationHostDaysToRenewal) : null,
    recommendedDestinationHostRiskBucket: String(item.recommendedDestinationHostRiskBucket || 'UNKNOWN').toUpperCase()
  };
}

function normalizeDiagnostics(item = {}) {
  return {
    subscriptionId: item.subscriptionId ?? null,
    customerId: item.customerId ?? null,
    customerName: item.customerName ?? item.customer_name ?? '-',
    lineId: item.lineId ?? '-',
    lineName: item.lineName ?? item.line_name ?? '',
    linePlusId: item.linePlusId ?? '-',
    provider: item.provider ?? '-',
    subscriptionStatus: String(item.subscriptionStatus || item.status || '').toUpperCase(),
    billing: item.billing ?? '-',
    startDate: item.startDate ?? null,
    renewalDate: item.renewalDate ?? null,
    termMonths: Number(item.termMonths || 0),
    minimumEligibleMonths: Number(item.minimumEligibleMonths || 3),
    activatedScreens: Number(item.activatedScreens || 0),
    estimatedUsage: Number(item.estimatedUsage || item.estimatedCustomerUsage || 0),
    availableCapacity: Number(item.availableCapacity || 0),
    sharingActive: Boolean(item.sharingActive),
    eligible: Boolean(item.eligible),
    eligibilityReason: String(item.eligibilityReason || 'ELIGIBLE').toUpperCase(),
    sharingRole: String(item.sharingRole || 'NONE').toUpperCase(),
    rolePreference: String(item.rolePreference || 'AUTO').toUpperCase(),
    sharedCluster: Boolean(item.sharedCluster),
    sharedHostSubscriptionId: item.sharedHostSubscriptionId ?? null,
    sharedClusterSize: Number(item.sharedClusterSize || 0),
    hostRenewalDate: item.hostRenewalDate ?? item.renewalDate ?? null,
    hostRenewalDayOfMonth: item.hostRenewalDayOfMonth != null ? Number(item.hostRenewalDayOfMonth) : null,
    hostDaysToRenewal: item.hostDaysToRenewal != null ? Number(item.hostDaysToRenewal) : null,
    hostRiskBucket: String(item.hostRiskBucket || 'UNKNOWN').toUpperCase(),
    hostAtRisk: Boolean(item.hostAtRisk),
    requiredScreensToMove: item.requiredScreensToMove != null ? Number(item.requiredScreensToMove) : null,
    moveRecommendationAvailable: Boolean(item.moveRecommendationAvailable),
    moveRecommendationPriority: String(item.moveRecommendationPriority || 'NONE').toUpperCase(),
    moveRecommendationReason: String(item.moveRecommendationReason || '').toUpperCase(),
    recommendedDestinationSubscriptionId: item.recommendedDestinationSubscriptionId ?? null,
    recommendedDestinationCustomerId: item.recommendedDestinationCustomerId ?? null,
    recommendedDestinationCustomerName: item.recommendedDestinationCustomerName ?? '-',
    recommendedDestinationLineId: item.recommendedDestinationLineId ?? null,
    recommendedDestinationLineName: item.recommendedDestinationLineName ?? '',
    recommendedDestinationLinePlusId: item.recommendedDestinationLinePlusId ?? null,
    recommendedDestinationHostRenewalDate: item.recommendedDestinationHostRenewalDate ?? null,
    recommendedDestinationHostRenewalDayOfMonth:
      item.recommendedDestinationHostRenewalDayOfMonth != null ? Number(item.recommendedDestinationHostRenewalDayOfMonth) : null,
    recommendedDestinationHostDaysToRenewal:
      item.recommendedDestinationHostDaysToRenewal != null ? Number(item.recommendedDestinationHostDaysToRenewal) : null,
    recommendedDestinationHostRiskBucket: String(item.recommendedDestinationHostRiskBucket || 'UNKNOWN').toUpperCase()
  };
}

function formatDate(value) {
  if (!value) return '-';
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? String(value) : parsed.toLocaleDateString();
}

function formatLineDisplay(lineName, lineId) {
  const safeLineId = String(lineId || '').trim();
  const safeLineName = String(lineName || '').trim();
  if (!safeLineName || safeLineName === safeLineId) return safeLineId || '-';
  return `${safeLineName} · ${safeLineId}`;
}

function normalizeFilterValue(value, allowedValues, fallback = 'ALL') {
  const normalized = String(value || '')
    .trim()
    .toUpperCase();
  return allowedValues.includes(normalized) ? normalized : fallback;
}

function parseRenewalDayFilter(value) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 1 && parsed <= 31 ? String(parsed) : 'ALL';
}

function roleColor(role) {
  if (role === 'HOST') return 'warning';
  if (role === 'SHARED') return 'info';
  return 'default';
}

function riskBucketMeta(bucket, t) {
  switch (String(bucket || '').toUpperCase()) {
    case 'OVERDUE':
      return {
        label: t('subscriptionSharing.risk.overdue', 'Overdue'),
        color: 'error'
      };
    case '0_7':
      return {
        label: t('subscriptionSharing.risk.zeroToSeven', '0-7 days'),
        color: 'warning'
      };
    case '8_15':
      return {
        label: t('subscriptionSharing.risk.eightToFifteen', '8-15 days'),
        color: 'info'
      };
    case '16_30':
      return {
        label: t('subscriptionSharing.risk.sixteenToThirty', '16-30 days'),
        color: 'primary'
      };
    case '31_PLUS':
      return {
        label: t('subscriptionSharing.risk.thirtyOnePlus', '31+ days'),
        color: 'success'
      };
    default:
      return {
        label: t('subscriptionSharing.risk.unknown', 'No renewal date'),
        color: 'default'
      };
  }
}

function formatHostRenewalDay(day, t) {
  return day ? t('subscriptionSharing.risk.dayOfMonth', { day, defaultValue: 'Day {{day}}' }) : t('subscriptionSharing.risk.dayUnknown', 'Without date');
}

function formatHostDays(days, t) {
  if (days == null) return t('subscriptionSharing.risk.unknownDays', 'Missing date');
  if (days < 0) return t('subscriptionSharing.risk.overdueDays', { days: Math.abs(days), defaultValue: 'Overdue {{days}}d' });
  if (days === 0) return t('subscriptionSharing.risk.today', 'Due today');
  return t('subscriptionSharing.risk.inDays', { days, defaultValue: 'In {{days}}d' });
}

function subscriptionStatusColor(status) {
  const normalized = String(status || '').toUpperCase();
  if (normalized === 'ACTIVE') return 'success';
  if (normalized === 'PENDING') return 'warning';
  if (normalized === 'CANCELLED' || normalized === 'EXPIRED' || normalized === 'INACTIVE') return 'default';
  return 'info';
}

function eligibilityReasonMeta(reason, minimumEligibleMonths, t) {
  switch (String(reason || '').toUpperCase()) {
    case 'INACTIVE_STATUS':
      return {
        label: t('subscriptionSharing.reason.inactive', 'Inactive'),
        color: 'default'
      };
    case 'TERM_BELOW_MINIMUM':
      return {
        label: t('subscriptionSharing.reason.minimumTerm', {
          count: minimumEligibleMonths || 3,
          defaultValue: 'Minimum {{count}} months'
        }),
        color: 'warning'
      };
    case 'NO_AVAILABLE_CAPACITY':
      return {
        label: t('subscriptionSharing.reason.noCapacity', 'No available capacity'),
        color: 'error'
      };
    default:
      return {
        label: t('subscriptionSharing.card.eligible', 'Eligible'),
        color: 'success'
      };
  }
}

function RoleChip({ role, t }) {
  return (
    <Chip
      size="small"
      label={
        role === 'HOST'
          ? t('subscriptionSharing.role.host', 'HOST')
          : role === 'SHARED'
            ? t('subscriptionSharing.role.shared', 'SHARED')
            : t('subscriptionSharing.role.none', 'NONE')
      }
      color={roleColor(role)}
      variant={role === 'NONE' ? 'outlined' : 'filled'}
      sx={{ fontWeight: 700 }}
    />
  );
}

function StatusChip({ status, t }) {
  return (
    <Chip
      size="small"
      color={subscriptionStatusColor(status)}
      variant="outlined"
      label={`${t('subscriptionSharing.card.status', 'Status')}: ${status || '-'}`}
      sx={{ fontWeight: 700 }}
    />
  );
}

function EligibilityChips({ eligible, eligibilityReason, minimumEligibleMonths, t }) {
  const reason = eligibilityReasonMeta(eligibilityReason, minimumEligibleMonths, t);

  return (
    <Stack direction="row" spacing={0.75} alignItems="center" useFlexGap flexWrap="wrap">
      <Chip
        size="small"
        label={
          eligible
            ? t('subscriptionSharing.card.eligible', 'Eligible')
            : t('subscriptionSharing.card.notEligible', 'Not eligible')
        }
        color={eligible ? 'success' : 'default'}
        variant={eligible ? 'filled' : 'outlined'}
        sx={{ fontWeight: 700 }}
      />
      {!eligible ? <Chip size="small" color={reason.color} variant="outlined" label={reason.label} sx={{ fontWeight: 700 }} /> : null}
    </Stack>
  );
}

function RiskChip({ bucket, t }) {
  const meta = riskBucketMeta(bucket, t);
  return <Chip size="small" color={meta.color} variant="outlined" label={meta.label} sx={{ fontWeight: 700 }} />;
}

function movePriorityMeta(priority, t) {
  switch (String(priority || '').toUpperCase()) {
    case 'URGENT':
      return { label: t('subscriptionSharing.move.priority.urgent', 'Urgent move'), color: 'error' };
    case 'REVIEW':
      return { label: t('subscriptionSharing.move.priority.review', 'Review move'), color: 'warning' };
    default:
      return { label: t('subscriptionSharing.move.priority.none', 'No move'), color: 'default' };
  }
}

function moveReasonLabel(reason, t) {
  switch (String(reason || '').toUpperCase()) {
    case 'RECOMMENDED':
      return t('subscriptionSharing.move.reason.recommended', 'Recommended destination ready.');
    case 'STABLE_HOST':
      return t('subscriptionSharing.move.reason.stableHost', 'Current host is stable for now.');
    case 'NO_CAPACITY':
      return t('subscriptionSharing.move.reason.noCapacity', 'No compatible destination has enough capacity.');
    case 'NO_COMPATIBLE_HOST':
      return t('subscriptionSharing.move.reason.noCompatibleHost', 'No compatible destination was found.');
    default:
      return t('subscriptionSharing.move.reason.none', 'No move recommendation yet.');
  }
}

function MovePriorityChip({ priority, t }) {
  const meta = movePriorityMeta(priority, t);
  return <Chip size="small" color={meta.color} variant="outlined" label={meta.label} sx={{ fontWeight: 700 }} />;
}

function RolePreferenceSelector({ value, loading, onChange, t }) {
  return (
    <FormControl size="small" sx={{ minWidth: 140 }}>
      <InputLabel>{t('subscriptionSharing.actions.rolePreference', 'Role')}</InputLabel>
      <Select
        value={value || 'AUTO'}
        label={t('subscriptionSharing.actions.rolePreference', 'Role')}
        onChange={(event) => onChange?.(event.target.value)}
        disabled={loading}
        sx={{ borderRadius: 2 }}
      >
        <MenuItem value="AUTO">{t('subscriptionSharing.actions.roleAuto', 'Auto')}</MenuItem>
        <MenuItem value="HOST">{t('subscriptionSharing.actions.roleHost', 'Host')}</MenuItem>
        <MenuItem value="SHARED">{t('subscriptionSharing.actions.roleShared', 'Shared')}</MenuItem>
      </Select>
    </FormControl>
  );
}

function SectionTitle({ title, count, subtitle }) {
  return (
    <Stack spacing={0.35}>
      <Stack direction="row" spacing={1} alignItems="center" useFlexGap flexWrap="wrap">
        <Typography variant="h4">{title}</Typography>
        <Chip size="small" variant="outlined" label={count} sx={{ fontWeight: 700 }} />
      </Stack>
      {subtitle ? (
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      ) : null}
    </Stack>
  );
}

function KpiCard({ icon, label, value, color }) {
  return (
    <Card
      variant="outlined"
      sx={(theme) => ({
        borderRadius: 3,
        p: 2,
        borderColor: withAlpha(color, theme.palette.mode === 'dark' ? 0.42 : 0.24),
        backgroundColor: theme.vars?.palette?.surface?.card || theme.palette.background.paper,
        backgroundImage:
          theme.palette.mode === 'dark'
            ? `linear-gradient(145deg, ${withAlpha(color, 0.2)} 0%, ${withAlpha(theme.palette.background.default, 0.88)} 100%)`
            : `linear-gradient(145deg, ${withAlpha(color, 0.12)} 0%, ${theme.palette.background.paper} 100%)`
      })}
    >
      <Stack direction="row" spacing={1.25} alignItems="center">
        <Avatar sx={{ bgcolor: withAlpha(color, 0.22), color }}>{icon}</Avatar>
        <Box>
          <Typography variant="h4" sx={{ lineHeight: 1.1 }}>
            {value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {label}
          </Typography>
        </Box>
      </Stack>
    </Card>
  );
}

function MetricTile({ label, value, helper, color }) {
  return (
    <Card
      variant="outlined"
      sx={(theme) => ({
        borderRadius: 2.5,
        p: 1.35,
        minHeight: '100%',
        borderColor: withAlpha(color || theme.palette.divider, theme.palette.mode === 'dark' ? 0.36 : 0.24),
        backgroundColor: theme.vars?.palette?.surface?.sunken || theme.palette.background.default
      })}
    >
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h5" sx={{ mt: 0.35, lineHeight: 1.1 }}>
        {value}
      </Typography>
      {helper ? (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.35 }}>
          {helper}
        </Typography>
      ) : null}
    </Card>
  );
}

export default function SubscriptionSharingLionTv() {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { accessToken } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchParams] = useSearchParams();

  const headers = useMemo(() => ({ Authorization: `Bearer ${accessToken}` }), [accessToken]);

  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(() => normalizeFilterValue(searchParams.get('status'), ['ALL', 'HOST', 'SHARED', 'NONE']));
  const [eligibleFilter, setEligibleFilter] = useState(() => normalizeFilterValue(searchParams.get('eligible'), ['ALL', 'YES', 'NO']));
  const [riskBucketFilter, setRiskBucketFilter] = useState(() =>
    normalizeFilterValue(searchParams.get('riskBucket'), ['ALL', 'OVERDUE', '0_7', '8_15', '16_30', '31_PLUS', 'UNKNOWN'])
  );
  const [atRiskFilter, setAtRiskFilter] = useState(() =>
    normalizeFilterValue(
      searchParams.get('hostAtRisk') === 'true' ? 'YES' : searchParams.get('hostAtRisk') === 'false' ? 'NO' : searchParams.get('hostAtRisk'),
      ['ALL', 'YES', 'NO']
    )
  );
  const [renewalDayFilter, setRenewalDayFilter] = useState(() => parseRenewalDayFilter(searchParams.get('hostRenewalDay')));
  const [recommendationFilter, setRecommendationFilter] = useState('ALL');
  const [rows, setRows] = useState([]);
  const [kpi, setKpi] = useState({
    totalSubscriptions: 0,
    activeSubscriptions: 0,
    sharedClusters: 0,
    hostSubscriptions: 0,
    sharedSubscriptions: 0,
    eligibleSubscriptions: 0,
    overdueClusters: 0,
    criticalClusters: 0,
    atRiskSubscriptions: 0
  });
  const [diagnosticsOpen, setDiagnosticsOpen] = useState(false);
  const [diagnosticsLoading, setDiagnosticsLoading] = useState(false);
  const [diagnosticsData, setDiagnosticsData] = useState(null);
  const [roleSavingBySubscriptionId, setRoleSavingBySubscriptionId] = useState({});
  const [moveDialogRow, setMoveDialogRow] = useState(null);
  const [moveSaving, setMoveSaving] = useState(false);

  const loadOverview = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const params = {
        index: 0,
        size: 5000
      };
      if (statusFilter && statusFilter !== 'ALL') {
        params.status = statusFilter;
      }
      if (eligibleFilter === 'YES') {
        params.eligible = true;
      } else if (eligibleFilter === 'NO') {
        params.eligible = false;
      }
      if (riskBucketFilter && riskBucketFilter !== 'ALL') {
        params.riskBucket = riskBucketFilter;
      }
      if (atRiskFilter === 'YES') {
        params.hostAtRisk = true;
      } else if (atRiskFilter === 'NO') {
        params.hostAtRisk = false;
      }
      if (renewalDayFilter && renewalDayFilter !== 'ALL') {
        params.hostRenewalDay = Number(renewalDayFilter);
      }

      const res = await lionTvApi.get('/subscription-sharing/v1/overview', {
        headers,
        params,
        skipAuthRedirect: true
      });

      const payload = res?.data?.data ?? res?.data ?? {};
      const rowsPayload = payload.rows ?? {};
      const data = Array.isArray(rowsPayload?.data) ? rowsPayload.data : [];

      setRows(data.map(normalizeRow));
      setKpi({
        totalSubscriptions: Number(payload?.kpi?.totalSubscriptions || 0),
        activeSubscriptions: Number(payload?.kpi?.activeSubscriptions || 0),
        sharedClusters: Number(payload?.kpi?.sharedClusters || 0),
        hostSubscriptions: Number(payload?.kpi?.hostSubscriptions || 0),
        sharedSubscriptions: Number(payload?.kpi?.sharedSubscriptions || 0),
        eligibleSubscriptions: Number(payload?.kpi?.eligibleSubscriptions || 0),
        overdueClusters: Number(payload?.kpi?.overdueClusters || 0),
        criticalClusters: Number(payload?.kpi?.criticalClusters || 0),
        atRiskSubscriptions: Number(payload?.kpi?.atRiskSubscriptions || 0)
      });
    } catch (err) {
      enqueueSnackbar(err?.response?.data?.message || t('subscriptionSharing.errors.loadError', 'Could not load shared overview.'), {
        variant: 'error'
      });
    } finally {
      setLoading(false);
    }
  }, [accessToken, atRiskFilter, eligibleFilter, headers, renewalDayFilter, riskBucketFilter, statusFilter, t, enqueueSnackbar]);

  useEffect(() => {
    loadOverview();
  }, [loadOverview, refreshKey]);

  const loadDiagnostics = useCallback(
    async (subscriptionId) => {
      if (!subscriptionId || !accessToken) return;
      setDiagnosticsOpen(true);
      setDiagnosticsLoading(true);
      setDiagnosticsData(null);
      try {
        const res = await lionTvApi.get(`/subscription-sharing/v1/subscriptions/${subscriptionId}/diagnostics`, {
          headers,
          skipAuthRedirect: true
        });
        const payload = res?.data?.data ?? res?.data ?? {};
        setDiagnosticsData(normalizeDiagnostics(payload));
      } catch (err) {
        setDiagnosticsData(null);
        enqueueSnackbar(
          err?.response?.data?.message || t('subscriptionSharing.errors.loadDiagnostics', 'Could not load subscription diagnostics.'),
          {
            variant: 'error'
          }
        );
      } finally {
        setDiagnosticsLoading(false);
      }
    },
    [accessToken, enqueueSnackbar, headers, t]
  );

  const handleRolePreferenceChange = useCallback(
    async (subscriptionId, sharingRole) => {
      if (!subscriptionId || !accessToken) return;

      setRoleSavingBySubscriptionId((prev) => ({ ...prev, [subscriptionId]: true }));
      try {
        await lionTvApi.patch(
          `/subscription-sharing/v1/subscriptions/${subscriptionId}/role`,
          { sharingRole },
          { headers, skipAuthRedirect: true }
        );

        enqueueSnackbar(t('subscriptionSharing.messages.roleUpdated', 'Sharing role preference updated.'), {
          variant: 'success'
        });

        await loadOverview();
        if (diagnosticsOpen && diagnosticsData?.subscriptionId === subscriptionId) {
          await loadDiagnostics(subscriptionId);
        }
      } catch (err) {
        enqueueSnackbar(
          err?.response?.data?.message || t('subscriptionSharing.errors.updateRole', 'Could not update sharing role preference.'),
          { variant: 'error' }
        );
      } finally {
        setRoleSavingBySubscriptionId((prev) => {
          const next = { ...prev };
          delete next[subscriptionId];
          return next;
        });
      }
    },
    [accessToken, diagnosticsData?.subscriptionId, diagnosticsOpen, enqueueSnackbar, headers, loadDiagnostics, loadOverview, t]
  );

  const handleMoveSubscription = useCallback(async () => {
    if (!moveDialogRow?.subscriptionId || !moveDialogRow?.recommendedDestinationSubscriptionId || !accessToken) return;
    setMoveSaving(true);
    try {
      const res = await lionTvApi.post(
        `/subscription-sharing/v1/subscriptions/${moveDialogRow.subscriptionId}/move`,
        { destinationSubscriptionId: moveDialogRow.recommendedDestinationSubscriptionId },
        { headers, skipAuthRedirect: true }
      );

      const payload = res?.data?.data ?? {};
      enqueueSnackbar(
        t('subscriptionSharing.messages.moveCompleted', {
          sourceId: moveDialogRow.subscriptionId,
          destinationId: payload.destinationSubscriptionId || moveDialogRow.recommendedDestinationSubscriptionId,
          defaultValue: 'Subscription #{{sourceId}} moved to host #{{destinationId}}.'
        }),
        { variant: 'success' }
      );

      setMoveDialogRow(null);
      await loadOverview();
      if (diagnosticsOpen && diagnosticsData?.subscriptionId === moveDialogRow.subscriptionId) {
        await loadDiagnostics(moveDialogRow.subscriptionId);
      }
    } catch (err) {
      enqueueSnackbar(
        err?.response?.data?.message || t('subscriptionSharing.errors.moveSubscription', 'Could not move the shared subscription.'),
        { variant: 'error' }
      );
    } finally {
      setMoveSaving(false);
    }
  }, [accessToken, diagnosticsData?.subscriptionId, diagnosticsOpen, enqueueSnackbar, headers, loadDiagnostics, loadOverview, moveDialogRow, t]);

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((row) => {
      return (
        String(row.subscriptionId || '').toLowerCase().includes(term) ||
        String(row.customerName || '').toLowerCase().includes(term) ||
        String(row.lineId || '').toLowerCase().includes(term) ||
        String(row.lineName || '').toLowerCase().includes(term) ||
        String(row.linePlusId || '').toLowerCase().includes(term) ||
        String(row.provider || '').toLowerCase().includes(term) ||
        String(row.billing || '').toLowerCase().includes(term) ||
        String(row.subscriptionStatus || '').toLowerCase().includes(term) ||
        String(row.eligibilityReason || '').toLowerCase().includes(term) ||
        String(row.hostRiskBucket || '').toLowerCase().includes(term) ||
        String(row.hostRenewalDayOfMonth || '').toLowerCase().includes(term)
      );
    });
  }, [rows, search]);

  const hostRows = useMemo(() => filteredRows.filter((row) => row.sharingRole === 'HOST'), [filteredRows]);
  const eligibleNotSharedRows = useMemo(() => (recommendationFilter === 'YES' ? [] : filteredRows.filter((row) => row.eligible && row.sharingRole === 'NONE')), [filteredRows, recommendationFilter]);
  const notEligibleRows = useMemo(() => (recommendationFilter === 'YES' ? [] : filteredRows.filter((row) => !row.eligible && row.sharingRole === 'NONE')), [filteredRows, recommendationFilter]);
  const beneficiariesByHost = useMemo(() => {
    const map = {};
    filteredRows.forEach((row) => {
      if (row.sharingRole !== 'SHARED') return;
      if (recommendationFilter === 'YES' && !row.moveRecommendationAvailable) return;
      const hostId = row.sharedHostSubscriptionId;
      if (!hostId) return;
      if (!map[hostId]) map[hostId] = [];
      map[hostId].push(row);
    });
    return map;
  }, [filteredRows, recommendationFilter]);

  const filteredSummary = useMemo(
    () => {
      const visibleHostCount =
        recommendationFilter === 'YES'
          ? hostRows.filter((row) => (beneficiariesByHost[row.subscriptionId] || []).length > 0).length
          : hostRows.length;
      const visibleBeneficiaries =
        recommendationFilter === 'YES'
          ? Object.values(beneficiariesByHost).reduce((sum, items) => sum + items.length, 0)
          : filteredRows.filter((row) => row.sharingRole === 'SHARED').length;

      return {
        total: recommendationFilter === 'YES' ? visibleHostCount + visibleBeneficiaries : filteredRows.length,
        hosts: visibleHostCount,
        beneficiaries: visibleBeneficiaries,
        recommendedMoves: filteredRows.filter((row) => row.sharingRole === 'SHARED' && row.moveRecommendationAvailable).length,
        eligibleStandalone: eligibleNotSharedRows.length,
        blockedStandalone: notEligibleRows.length,
        criticalHosts: recommendationFilter === 'YES'
          ? hostRows.filter((row) => (beneficiariesByHost[row.subscriptionId] || []).length > 0 && (row.hostRiskBucket === 'OVERDUE' || row.hostRiskBucket === '0_7')).length
          : hostRows.filter((row) => row.hostRiskBucket === 'OVERDUE' || row.hostRiskBucket === '0_7').length,
        overdueHosts: recommendationFilter === 'YES'
          ? hostRows.filter((row) => (beneficiariesByHost[row.subscriptionId] || []).length > 0 && row.hostRiskBucket === 'OVERDUE').length
          : hostRows.filter((row) => row.hostRiskBucket === 'OVERDUE').length
      };
    },
    [beneficiariesByHost, eligibleNotSharedRows.length, filteredRows, hostRows, notEligibleRows.length, recommendationFilter]
  );

  const hostDayBuckets = useMemo(() => {
    const groups = new Map();

    hostRows.forEach((host) => {
      const key = host.hostRenewalDayOfMonth != null ? String(host.hostRenewalDayOfMonth) : 'UNKNOWN';
      const beneficiaries = (beneficiariesByHost[host.subscriptionId] || []).slice().sort((left, right) => {
        const leftPriority = left.moveRecommendationAvailable ? 0 : 1;
        const rightPriority = right.moveRecommendationAvailable ? 0 : 1;
        if (leftPriority !== rightPriority) return leftPriority - rightPriority;
        return String(left.customerName || '').localeCompare(String(right.customerName || ''));
      });
      if (recommendationFilter === 'YES' && beneficiaries.length === 0) {
        return;
      }
      const current = groups.get(key) || {
        key,
        day: host.hostRenewalDayOfMonth,
        hosts: [],
        hostCount: 0,
        sharedCount: 0,
        recommendedMoves: 0,
        nearestDate: null,
        hasCritical: false,
        hasOverdue: false
      };

      current.hosts.push({ ...host, beneficiaries });
      current.hostCount += 1;
      current.sharedCount += beneficiaries.length;
      current.recommendedMoves += beneficiaries.filter((item) => item.moveRecommendationAvailable).length;
      current.hasCritical = current.hasCritical || Boolean(host.hostAtRisk);
      current.hasOverdue = current.hasOverdue || host.hostRiskBucket === 'OVERDUE';
      if (host.hostRenewalDate && (!current.nearestDate || new Date(host.hostRenewalDate) < new Date(current.nearestDate))) {
        current.nearestDate = host.hostRenewalDate;
      }

      groups.set(key, current);
    });

    return Array.from(groups.values()).sort((a, b) => {
      if (a.day == null && b.day == null) return 0;
      if (a.day == null) return 1;
      if (b.day == null) return -1;
      return a.day - b.day;
    });
  }, [beneficiariesByHost, hostRows, recommendationFilter]);

  const sectionCardSx = {
    borderRadius: 3,
    border: '1px solid',
    borderColor: 'divider',
    bgcolor: 'background.paper',
    p: { xs: 1.5, sm: 2 }
  };
  const diagnosticsSurfaceSx = {
    borderRadius: 3,
    border: '1px solid',
    borderColor: 'divider',
    bgcolor: 'background.paper',
    p: { xs: 1.5, sm: 2 }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: { xs: '100%', xl: 1450 }, mx: 'auto' }}>
      <MainCard
        title={t('subscriptionSharing.title', 'Shared subscriptions monitoring')}
        secondary={
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => setRefreshKey((prev) => prev + 1)}
            sx={{ borderRadius: 2.5, textTransform: 'none', fontWeight: 700 }}
            fullWidth={isMobile}
          >
            {t('actions.refresh', 'Refresh')}
          </Button>
        }
      >
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {t(
            'subscriptionSharing.subtitle',
            'Visual monitoring based on subscriptions that reuse the same line_id across different customers.'
          )}
        </Typography>

        <ResponsiveMetricGrid columns={{ xs: 1, md: 2, lg: 3, xl: 6 }}>
          <KpiCard
            icon={<RuleIcon />}
            label={t('subscriptionSharing.kpi.totalSubscriptions', 'Total subscriptions')}
            value={kpi.totalSubscriptions}
            color={theme.vars?.palette?.primary?.main || theme.palette.primary.main}
          />
          <KpiCard
            icon={<CheckCircleOutlineIcon />}
            label={t('subscriptionSharing.kpi.activeSubscriptions', 'Active')}
            value={kpi.activeSubscriptions}
            color={theme.vars?.palette?.success?.main || theme.palette.success.main}
          />
          <KpiCard
            icon={<HubIcon />}
            label={t('subscriptionSharing.kpi.sharedClusters', 'Shared clusters')}
            value={kpi.sharedClusters}
            color={theme.vars?.palette?.warning?.main || theme.palette.warning.main}
          />
          <KpiCard
            icon={<GroupWorkIcon />}
            label={t('subscriptionSharing.kpi.hosts', 'Hosts')}
            value={kpi.hostSubscriptions}
            color={theme.vars?.palette?.secondary?.main || theme.palette.secondary.main}
          />
          <KpiCard
            icon={<LinkIcon />}
            label={t('subscriptionSharing.kpi.sharedSubscriptions', 'Shared subscriptions')}
            value={kpi.sharedSubscriptions}
            color={theme.vars?.palette?.info?.main || theme.palette.info.main}
          />
          <KpiCard
            icon={<SignalCellularAltIcon />}
            label={t('subscriptionSharing.kpi.eligibleSubscriptions', 'Eligible')}
            value={kpi.eligibleSubscriptions}
            color={theme.vars?.palette?.success?.main || theme.palette.success.main}
          />
          <KpiCard
            icon={<BlockIcon />}
            label={t('subscriptionSharing.kpi.overdueClusters', 'Overdue hosts')}
            value={kpi.overdueClusters}
            color={theme.vars?.palette?.error?.main || theme.palette.error.main}
          />
          <KpiCard
            icon={<WarningAmberIcon />}
            label={t('subscriptionSharing.kpi.criticalClusters', 'Critical hosts')}
            value={kpi.criticalClusters}
            color={theme.vars?.palette?.warning?.main || theme.palette.warning.main}
          />
          <KpiCard
            icon={<CalendarMonthIcon />}
            label={t('subscriptionSharing.kpi.atRiskSubscriptions', 'Subscriptions affected')}
            value={kpi.atRiskSubscriptions}
            color={theme.vars?.palette?.error?.main || theme.palette.error.main}
          />
        </ResponsiveMetricGrid>
      </MainCard>

      <MainCard
        title={
          <SectionTitle
            title={t('subscriptionSharing.filters.title', 'Filters and quick reading')}
            count={filteredSummary.total}
            subtitle={t(
              'subscriptionSharing.filters.subtitle',
              'Use the current filters to isolate hosts, beneficiaries or blocked subscriptions and open diagnostics from the same screen.'
            )}
          />
        }
      >
        <Box
          sx={(muiTheme) => ({
            p: 2,
            borderRadius: 2.5,
            border: '1px solid',
            borderColor: withAlpha(muiTheme.vars?.palette?.divider || muiTheme.palette.divider, 0.95),
            backgroundColor: muiTheme.vars?.palette?.surface?.sunken || muiTheme.palette.background.default
          })}
        >
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.25}>
            <TextField
              fullWidth
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('subscriptionSharing.filters.searchPlaceholder', 'Search by subscription, customer, line, provider, status')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                )
              }}
            />
            <FormControl size="small" sx={{ minWidth: { xs: '100%', md: 200 } }}>
              <InputLabel>{t('subscriptionSharing.filters.status', 'Sharing role')}</InputLabel>
              <Select value={statusFilter} label={t('subscriptionSharing.filters.status', 'Sharing role')} onChange={(e) => setStatusFilter(e.target.value)}>
                <MenuItem value="ALL">{t('subscriptionSharing.filters.options.all', 'All')}</MenuItem>
                <MenuItem value="HOST">{t('subscriptionSharing.filters.options.host', 'Host')}</MenuItem>
                <MenuItem value="SHARED">{t('subscriptionSharing.filters.options.shared', 'Shared')}</MenuItem>
                <MenuItem value="NONE">{t('subscriptionSharing.filters.options.none', 'None')}</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: { xs: '100%', md: 200 } }}>
              <InputLabel>{t('subscriptionSharing.filters.eligible', 'Eligible')}</InputLabel>
              <Select
                value={eligibleFilter}
                label={t('subscriptionSharing.filters.eligible', 'Eligible')}
                onChange={(e) => setEligibleFilter(e.target.value)}
              >
                <MenuItem value="ALL">{t('subscriptionSharing.filters.eligibleOptions.all', 'All')}</MenuItem>
                <MenuItem value="YES">{t('subscriptionSharing.filters.eligibleOptions.yes', 'Yes')}</MenuItem>
                <MenuItem value="NO">{t('subscriptionSharing.filters.eligibleOptions.no', 'No')}</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: { xs: '100%', md: 210 } }}>
              <InputLabel>{t('subscriptionSharing.filters.riskBucket', 'Risk bucket')}</InputLabel>
              <Select
                value={riskBucketFilter}
                label={t('subscriptionSharing.filters.riskBucket', 'Risk bucket')}
                onChange={(e) => setRiskBucketFilter(e.target.value)}
              >
                <MenuItem value="ALL">{t('subscriptionSharing.filters.riskOptions.all', 'All')}</MenuItem>
                <MenuItem value="OVERDUE">{t('subscriptionSharing.risk.overdue', 'Overdue')}</MenuItem>
                <MenuItem value="0_7">{t('subscriptionSharing.risk.zeroToSeven', '0-7 days')}</MenuItem>
                <MenuItem value="8_15">{t('subscriptionSharing.risk.eightToFifteen', '8-15 days')}</MenuItem>
                <MenuItem value="16_30">{t('subscriptionSharing.risk.sixteenToThirty', '16-30 days')}</MenuItem>
                <MenuItem value="31_PLUS">{t('subscriptionSharing.risk.thirtyOnePlus', '31+ days')}</MenuItem>
                <MenuItem value="UNKNOWN">{t('subscriptionSharing.risk.unknown', 'No renewal date')}</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: { xs: '100%', md: 190 } }}>
              <InputLabel>{t('subscriptionSharing.filters.atRiskOnly', 'At risk')}</InputLabel>
              <Select value={atRiskFilter} label={t('subscriptionSharing.filters.atRiskOnly', 'At risk')} onChange={(e) => setAtRiskFilter(e.target.value)}>
                <MenuItem value="ALL">{t('subscriptionSharing.filters.atRiskOptions.all', 'All')}</MenuItem>
                <MenuItem value="YES">{t('subscriptionSharing.filters.atRiskOptions.yes', 'Yes')}</MenuItem>
                <MenuItem value="NO">{t('subscriptionSharing.filters.atRiskOptions.no', 'No')}</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: { xs: '100%', md: 170 } }}>
              <InputLabel>{t('subscriptionSharing.filters.renewalDay', 'Renewal day')}</InputLabel>
              <Select
                value={renewalDayFilter}
                label={t('subscriptionSharing.filters.renewalDay', 'Renewal day')}
                onChange={(e) => setRenewalDayFilter(e.target.value)}
              >
                <MenuItem value="ALL">{t('subscriptionSharing.filters.renewalDayAll', 'All days')}</MenuItem>
                {Array.from({ length: 31 }, (_, idx) => idx + 1).map((day) => (
                  <MenuItem key={`renewal-day-${day}`} value={String(day)}>
                    {formatHostRenewalDay(day, t)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: { xs: '100%', md: 210 } }}>
              <InputLabel>{t('subscriptionSharing.filters.recommendedMoves', 'Recommended moves')}</InputLabel>
              <Select
                value={recommendationFilter}
                label={t('subscriptionSharing.filters.recommendedMoves', 'Recommended moves')}
                onChange={(e) => setRecommendationFilter(e.target.value)}
              >
                <MenuItem value="ALL">{t('subscriptionSharing.filters.recommendationOptions.all', 'All')}</MenuItem>
                <MenuItem value="YES">{t('subscriptionSharing.filters.recommendationOptions.yes', 'Recommended only')}</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} alignItems={{ xs: 'stretch', md: 'center' }} sx={{ mt: 1.5 }}>
            <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
              <Chip size="small" icon={<ViewTimelineIcon />} label={t('subscriptionSharing.filters.visible', { count: filteredSummary.total, defaultValue: 'Visible: {{count}}' })} />
              <Chip size="small" icon={<HubIcon />} label={t('subscriptionSharing.filters.hostsVisible', { count: filteredSummary.hosts, defaultValue: 'Hosts: {{count}}' })} />
              <Chip
                size="small"
                color="info"
                variant="outlined"
                icon={<LinkIcon />}
                label={t('subscriptionSharing.filters.sharedVisible', { count: filteredSummary.beneficiaries, defaultValue: 'Shared: {{count}}' })}
              />
              <Chip
                size="small"
                color="success"
                variant="outlined"
                icon={<CheckCircleOutlineIcon />}
                label={t('subscriptionSharing.filters.eligibleVisible', {
                  count: filteredSummary.eligibleStandalone,
                  defaultValue: 'Standalone eligible: {{count}}'
                })}
              />
              <Chip
                size="small"
                color={filteredSummary.blockedStandalone > 0 ? 'warning' : 'default'}
                variant="outlined"
                icon={<BlockIcon />}
                label={t('subscriptionSharing.filters.blockedVisible', {
                  count: filteredSummary.blockedStandalone,
                  defaultValue: 'Blocked: {{count}}'
                })}
              />
              <Chip
                size="small"
                color={filteredSummary.criticalHosts > 0 ? 'warning' : 'default'}
                variant="outlined"
                icon={<WarningAmberIcon />}
                label={t('subscriptionSharing.filters.criticalVisible', {
                  count: filteredSummary.criticalHosts,
                  defaultValue: 'Critical hosts: {{count}}'
                })}
              />
              <Chip
                size="small"
                color={filteredSummary.overdueHosts > 0 ? 'error' : 'default'}
                variant="outlined"
                icon={<BlockIcon />}
                label={t('subscriptionSharing.filters.overdueVisible', {
                  count: filteredSummary.overdueHosts,
                  defaultValue: 'Overdue hosts: {{count}}'
                })}
              />
              <Chip
                size="small"
                color={filteredSummary.recommendedMoves > 0 ? 'secondary' : 'default'}
                variant="outlined"
                icon={<LinkIcon />}
                label={t('subscriptionSharing.filters.recommendedVisible', {
                  count: filteredSummary.recommendedMoves,
                  defaultValue: 'Recommended moves: {{count}}'
                })}
              />
            </Stack>
            <Box sx={{ flexGrow: 1 }} />
            <Button
              variant="text"
              startIcon={<TuneIcon />}
              onClick={() => {
                setSearch('');
                setStatusFilter('ALL');
                setEligibleFilter('ALL');
                setRiskBucketFilter('ALL');
                setAtRiskFilter('ALL');
                setRenewalDayFilter('ALL');
                setRecommendationFilter('ALL');
              }}
              sx={{ textTransform: 'none', fontWeight: 700, alignSelf: { xs: 'flex-start', md: 'center' } }}
            >
              {t('subscriptionSharing.filters.reset', 'Reset filters')}
            </Button>
          </Stack>

          {filteredSummary.blockedStandalone > 0 ? (
            <Alert severity="warning" sx={{ mt: 1.5 }}>
              {t(
                'subscriptionSharing.filters.blockedHint',
                'There are blocked subscriptions in this view. Open diagnostics to confirm if the cause is inactive status, minimum term or no available capacity.'
              )}
            </Alert>
          ) : null}
        </Box>
      </MainCard>

      <MainCard
        title={
          <SectionTitle
            title={t('subscriptionSharing.sections.sharedClusters', 'Shared clusters grouped by host renewal day')}
            count={hostDayBuckets.length}
            subtitle={t(
              'subscriptionSharing.sections.sharedClustersHint',
              'Hosts are grouped by their renewal day of month so you can see in advance which shared clusters are affected when a host gets close to expiration.'
            )}
          />
        }
      >
        {loading ? (
          <Stack spacing={1.25}>
            {Array.from({ length: 4 }).map((_, idx) => (
              <Skeleton key={`shared-skel-${idx}`} variant="rounded" height={120} />
            ))}
          </Stack>
        ) : hostDayBuckets.length === 0 ? (
          <Alert severity="info">{t('subscriptionSharing.sections.noSharedClusters', 'No shared clusters found with current filters.')}</Alert>
        ) : (
          <Stack spacing={1.5}>
            {hostDayBuckets.map((bucket) => (
              <Card
                key={`host-day-${bucket.key}`}
                sx={(muiTheme) => ({
                  ...sectionCardSx,
                  backgroundImage:
                    bucket.hasOverdue
                      ? `linear-gradient(160deg, ${withAlpha(muiTheme.palette.error.main, muiTheme.palette.mode === 'dark' ? 0.16 : 0.08)} 0%, ${withAlpha(
                          muiTheme.palette.background.paper,
                          0.98
                        )} 54%)`
                      : bucket.hasCritical
                        ? `linear-gradient(160deg, ${withAlpha(muiTheme.palette.warning.main, muiTheme.palette.mode === 'dark' ? 0.16 : 0.08)} 0%, ${withAlpha(
                            muiTheme.palette.background.paper,
                            0.98
                          )} 54%)`
                        : 'none'
                })}
              >
                <Stack spacing={1.5}>
                  <Stack direction={{ xs: 'column', lg: 'row' }} spacing={1.1} justifyContent="space-between">
                    <Stack spacing={0.6}>
                      <Stack direction="row" spacing={0.75} alignItems="center" useFlexGap flexWrap="wrap">
                        <Avatar sx={{ width: 34, height: 34, bgcolor: bucket.hasCritical ? 'warning.main' : 'primary.main', color: 'common.white' }}>
                          <CalendarMonthIcon fontSize="small" />
                        </Avatar>
                        <Typography variant="h5" sx={{ fontWeight: 800 }}>
                          {formatHostRenewalDay(bucket.day, t)}
                        </Typography>
                        <Chip
                          size="small"
                          variant="outlined"
                          label={t('subscriptionSharing.bucket.hostCount', { count: bucket.hostCount, defaultValue: 'Hosts: {{count}}' })}
                        />
                        <Chip
                          size="small"
                          variant="outlined"
                          color="info"
                          label={t('subscriptionSharing.bucket.sharedCount', { count: bucket.sharedCount, defaultValue: 'Shared: {{count}}' })}
                        />
                        <Chip
                          size="small"
                          variant="outlined"
                          color={bucket.recommendedMoves > 0 ? 'secondary' : 'default'}
                          label={t('subscriptionSharing.bucket.recommendedCount', {
                            count: bucket.recommendedMoves,
                            defaultValue: 'Recommended: {{count}}'
                          })}
                        />
                        {bucket.hasOverdue ? <RiskChip bucket="OVERDUE" t={t} /> : bucket.hasCritical ? <RiskChip bucket="0_7" t={t} /> : null}
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        {bucket.nearestDate
                          ? t('subscriptionSharing.bucket.nearestDate', {
                              date: formatDate(bucket.nearestDate),
                              defaultValue: 'Nearest host renewal: {{date}}'
                            })
                          : t('subscriptionSharing.bucket.nearestDateUnknown', 'Hosts without renewal date in this bucket.')}
                      </Typography>
                    </Stack>
                    {bucket.hasCritical ? (
                      <Alert severity={bucket.hasOverdue ? 'error' : 'warning'} sx={{ py: 0 }}>
                        {bucket.hasOverdue
                          ? t('subscriptionSharing.bucket.overdueAlert', 'This renewal bucket already has overdue hosts affecting shared subscriptions.')
                          : t('subscriptionSharing.bucket.criticalAlert', 'This renewal bucket includes hosts that will affect shared subscriptions within 7 days.')}
                      </Alert>
                    ) : null}
                  </Stack>

                  <Stack spacing={1.25}>
                    {bucket.hosts.map((host) => {
                      const beneficiaries = host.beneficiaries || [];
                      const recommendedBeneficiaries = beneficiaries.filter((item) => item.moveRecommendationAvailable);
                      return (
                        <Card
                          key={`host-${host.subscriptionId}`}
                          sx={(muiTheme) => ({
                            ...sectionCardSx,
                            backgroundImage:
                              muiTheme.palette.mode === 'dark'
                                ? `linear-gradient(160deg, ${withAlpha(muiTheme.palette.warning.main, 0.12)} 0%, ${withAlpha(muiTheme.palette.background.paper, 0.96)} 48%)`
                                : `linear-gradient(160deg, ${withAlpha(muiTheme.palette.warning.main, 0.08)} 0%, ${muiTheme.palette.background.paper} 48%)`
                          })}
                        >
                          <Stack spacing={1.5}>
                            <Stack direction={{ xs: 'column', lg: 'row' }} spacing={1.25} justifyContent="space-between">
                              <Stack spacing={1}>
                                <Stack direction="row" spacing={0.75} alignItems="center" useFlexGap flexWrap="wrap">
                                  <Avatar sx={{ width: 34, height: 34, bgcolor: 'warning.main', color: 'warning.contrastText' }}>
                                    <HubIcon fontSize="small" />
                                  </Avatar>
                                  <Typography variant="h5" sx={{ fontWeight: 800 }}>
                                    {t('subscriptionSharing.card.hostSubscription', 'Host subscription')} #{host.subscriptionId}
                                  </Typography>
                                  <RoleChip role={host.sharingRole} t={t} />
                                  <EligibilityChips
                                    eligible={host.eligible}
                                    eligibilityReason={host.eligibilityReason}
                                    minimumEligibleMonths={host.minimumEligibleMonths}
                                    t={t}
                                  />
                                  <RiskChip bucket={host.hostRiskBucket} t={t} />
                                  <Chip
                                    size="small"
                                    color={host.hostAtRisk ? 'warning' : 'default'}
                                    variant="outlined"
                                    label={t('subscriptionSharing.card.affectsShared', {
                                      count: beneficiaries.length,
                                      defaultValue: 'Affects {{count}} shared'
                                    })}
                                  />
                                  <StatusChip status={host.subscriptionStatus} t={t} />
                                </Stack>
                                <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
                                  <Chip size="small" variant="outlined" label={`${t('subscriptionSharing.card.customer', 'Customer')}: ${host.customerName || '-'}`} />
                                  <Chip
                                    size="small"
                                    variant="outlined"
                                    label={`${t('subscriptionSharing.card.line', 'Line')}: ${formatLineDisplay(host.lineName, host.lineId)}`}
                                  />
                                  {host.linePlusId && host.linePlusId !== '-' ? (
                                    <Chip size="small" variant="outlined" label={`${t('subscriptionSharing.card.linePlus', 'Line plus')}: ${host.linePlusId}`} />
                                  ) : null}
                                  <Chip size="small" variant="outlined" label={`${t('subscriptionSharing.card.provider', 'Provider')}: ${host.provider || '-'}`} />
                                </Stack>
                              </Stack>
                              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'stretch', lg: 'flex-start' }}>
                                <RolePreferenceSelector
                                  value={host.rolePreference}
                                  loading={Boolean(roleSavingBySubscriptionId[host.subscriptionId])}
                                  onChange={(value) => handleRolePreferenceChange(host.subscriptionId, value)}
                                  t={t}
                                />
                                <Button
                                  size="small"
                                  variant="contained"
                                  onClick={() => loadDiagnostics(host.subscriptionId)}
                                  sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2, alignSelf: { xs: 'stretch', lg: 'flex-start' } }}
                                >
                                  {t('subscriptionSharing.actions.viewDiagnostics', 'View diagnostics')}
                                </Button>
                              </Stack>
                            </Stack>

                            <Grid container spacing={1.25}>
                              <Grid item xs={6} md={2}>
                                <MetricTile
                                  label={t('subscriptionSharing.card.hostRenewal', 'Host renewal')}
                                  value={formatDate(host.hostRenewalDate)}
                                  color={theme.palette.primary.main}
                                />
                              </Grid>
                              <Grid item xs={6} md={2}>
                                <MetricTile
                                  label={t('subscriptionSharing.card.renewalDay', 'Renewal day')}
                                  value={formatHostRenewalDay(host.hostRenewalDayOfMonth, t)}
                                  color={theme.palette.info.main}
                                />
                              </Grid>
                              <Grid item xs={6} md={2}>
                                <MetricTile
                                  label={t('subscriptionSharing.card.daysLeft', 'Days left')}
                                  value={formatHostDays(host.hostDaysToRenewal, t)}
                                  color={host.hostAtRisk ? theme.palette.warning.main : theme.palette.success.main}
                                />
                              </Grid>
                              <Grid item xs={6} md={2}>
                                <MetricTile
                                  label={t('subscriptionSharing.card.termLabel', 'Term')}
                                  value={t('subscriptionSharing.card.termValue', { months: host.termMonths || 0, defaultValue: '{{months}} months' })}
                                  helper={t('subscriptionSharing.card.minimumHint', {
                                    count: host.minimumEligibleMonths || 3,
                                    defaultValue: 'Minimum {{count}} months'
                                  })}
                                  color={theme.palette.warning.main}
                                />
                              </Grid>
                              <Grid item xs={6} md={2}>
                                <MetricTile
                                  label={t('subscriptionSharing.card.usageLabel', 'Usage pressure')}
                                  value={`${host.estimatedCustomerUsage || 0} / ${host.activatedScreens || 0}`}
                                  helper={t('subscriptionSharing.card.capacityShort', {
                                    available: host.availableCapacity || 0,
                                    defaultValue: 'Available {{available}}'
                                  })}
                                  color={host.availableCapacity > 0 ? theme.palette.success.main : theme.palette.error.main}
                                />
                              </Grid>
                              <Grid item xs={6} md={2}>
                                <MetricTile
                                  label={t('subscriptionSharing.card.clusterMembers', 'Beneficiaries')}
                                  value={String(beneficiaries.length)}
                                  helper={t('subscriptionSharing.card.sharedClusterSize', {
                                    count: host.sharedClusterSize || 0,
                                    defaultValue: 'Cluster size {{count}}'
                                  })}
                                  color={theme.palette.info.main}
                                />
                              </Grid>
                            </Grid>

                            <Divider />
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'flex-start', sm: 'center' }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                                {t('subscriptionSharing.card.beneficiaries', 'Beneficiaries')}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {t(
                                  'subscriptionSharing.card.beneficiariesHint',
                                  'These subscriptions inherit the operational risk from the host and reuse the same shared capacity.'
                                )}
                              </Typography>
                            </Stack>

                            {recommendedBeneficiaries.length > 0 ? (
                              <Alert severity={host.hostRiskBucket === 'OVERDUE' ? 'error' : 'warning'}>
                                {t('subscriptionSharing.move.hostAlert', {
                                  count: recommendedBeneficiaries.length,
                                  defaultValue: '{{count}} beneficiary(ies) should be moved from this host to a safer renewal day.'
                                })}
                              </Alert>
                            ) : null}

                            {beneficiaries.length === 0 ? (
                              <Alert severity="warning">{t('subscriptionSharing.card.noBeneficiaries', 'No SHARED subscriptions linked to this host.')}</Alert>
                            ) : (
                              <Grid container spacing={1.1}>
                                {beneficiaries.map((item) => (
                                  <Grid item xs={12} lg={6} key={`beneficiary-${item.subscriptionId}`}>
                                    <Box
                                      sx={(muiTheme) => ({
                                        p: 1.25,
                                        borderRadius: 2.25,
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        minHeight: '100%',
                                        bgcolor: muiTheme.vars?.palette?.surface?.sunken || muiTheme.palette.background.default
                                      })}
                                    >
                                      <Stack spacing={1}>
                                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={0.9} alignItems={{ xs: 'flex-start', sm: 'center' }} useFlexGap flexWrap="wrap">
                                          <Stack direction="row" spacing={0.75} alignItems="center">
                                            <Avatar sx={{ width: 24, height: 24, bgcolor: 'info.main', color: 'info.contrastText' }}>
                                              <LinkIcon fontSize="inherit" />
                                            </Avatar>
                                            <Typography variant="body2" sx={{ fontWeight: 800 }}>
                                              #{item.subscriptionId} · {item.customerName || '-'}
                                            </Typography>
                                          </Stack>
                                          <RoleChip role={item.sharingRole} t={t} />
                                          <EligibilityChips
                                            eligible={item.eligible}
                                            eligibilityReason={item.eligibilityReason}
                                            minimumEligibleMonths={item.minimumEligibleMonths}
                                            t={t}
                                          />
                                          <RiskChip bucket={item.hostRiskBucket} t={t} />
                                          <MovePriorityChip priority={item.moveRecommendationPriority} t={t} />
                                          <StatusChip status={item.subscriptionStatus} t={t} />
                                        </Stack>
                                        <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
                                          <Chip
                                            size="small"
                                            color="warning"
                                            variant="outlined"
                                            label={t('subscriptionSharing.card.inheritedRisk', {
                                              hostId: item.sharedHostSubscriptionId || '-',
                                              defaultValue: 'Inherited risk from host #{{hostId}}'
                                            })}
                                          />
                                          <Chip size="small" variant="outlined" label={`${t('subscriptionSharing.card.hostRenewal', 'Host renewal')}: ${formatDate(item.hostRenewalDate)}`} />
                                          <Chip size="small" variant="outlined" label={`${t('subscriptionSharing.card.daysLeft', 'Days left')}: ${formatHostDays(item.hostDaysToRenewal, t)}`} />
                                          <Chip
                                            size="small"
                                            variant="outlined"
                                            label={`${t('subscriptionSharing.card.line', 'Line')}: ${formatLineDisplay(item.lineName, item.lineId)}`}
                                          />
                                          {item.moveRecommendationAvailable ? (
                                            <Chip
                                              size="small"
                                              color="secondary"
                                              variant="outlined"
                                              label={t('subscriptionSharing.move.recommendedBadge', 'Recommended move')}
                                            />
                                          ) : null}
                                        </Stack>
                                        <Card
                                          variant="outlined"
                                          sx={(muiTheme) => ({
                                            p: 1.1,
                                            borderRadius: 2,
                                            borderColor: item.moveRecommendationAvailable
                                              ? withAlpha(muiTheme.palette.secondary.main, muiTheme.palette.mode === 'dark' ? 0.5 : 0.28)
                                              : 'divider',
                                            bgcolor: muiTheme.vars?.palette?.surface?.card || muiTheme.palette.background.paper
                                          })}
                                        >
                                          <Stack spacing={0.8}>
                                            <Stack direction="row" spacing={0.75} alignItems="center" useFlexGap flexWrap="wrap">
                                              <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                                                {t('subscriptionSharing.move.title', 'Move recommendation')}
                                              </Typography>
                                              {item.moveRecommendationAvailable ? <RiskChip bucket={item.recommendedDestinationHostRiskBucket} t={t} /> : null}
                                            </Stack>
                                            <Typography variant="body2" color="text.secondary">
                                              {moveReasonLabel(item.moveRecommendationReason, t)}
                                            </Typography>
                                            {item.moveRecommendationAvailable ? (
                                              <Grid container spacing={1}>
                                                <Grid item xs={6} md={4}>
                                                  <MetricTile
                                                    label={t('subscriptionSharing.move.currentDay', 'Current host day')}
                                                    value={formatHostRenewalDay(item.hostRenewalDayOfMonth, t)}
                                                    helper={formatHostDays(item.hostDaysToRenewal, t)}
                                                    color={theme.palette.warning.main}
                                                  />
                                                </Grid>
                                                <Grid item xs={6} md={4}>
                                                  <MetricTile
                                                    label={t('subscriptionSharing.move.recommendedDay', 'Recommended day')}
                                                    value={formatHostRenewalDay(item.recommendedDestinationHostRenewalDayOfMonth, t)}
                                                    helper={formatHostDays(item.recommendedDestinationHostDaysToRenewal, t)}
                                                    color={theme.palette.success.main}
                                                  />
                                                </Grid>
                                                <Grid item xs={12} md={4}>
                                                  <MetricTile
                                                    label={t('subscriptionSharing.move.requiredScreens', 'Screens to move')}
                                                    value={String(item.requiredScreensToMove || 1)}
                                                    helper={t('subscriptionSharing.move.recommendedHost', {
                                                      id: item.recommendedDestinationSubscriptionId || '-',
                                                      defaultValue: 'Host #{{id}}'
                                                    })}
                                                    color={theme.palette.secondary.main}
                                                  />
                                                </Grid>
                                              </Grid>
                                            ) : null}
                                            {item.moveRecommendationAvailable ? (
                                              <Stack direction={{ xs: 'column', md: 'row' }} spacing={0.75} useFlexGap flexWrap="wrap">
                                                <Chip
                                                  size="small"
                                                  variant="outlined"
                                                  label={t('subscriptionSharing.move.recommendedLine', {
                                                    line: formatLineDisplay(item.recommendedDestinationLineName, item.recommendedDestinationLineId),
                                                    defaultValue: 'Line: {{line}}'
                                                  })}
                                                />
                                                {item.recommendedDestinationLinePlusId ? (
                                                  <Chip
                                                    size="small"
                                                    variant="outlined"
                                                    label={t('subscriptionSharing.move.recommendedLinePlus', {
                                                      value: item.recommendedDestinationLinePlusId,
                                                      defaultValue: 'Plus: {{value}}'
                                                    })}
                                                  />
                                                ) : null}
                                                <Chip
                                                  size="small"
                                                  variant="outlined"
                                                  label={t('subscriptionSharing.move.recommendedCustomer', {
                                                    customer: item.recommendedDestinationCustomerName || '-',
                                                    defaultValue: 'Customer: {{customer}}'
                                                  })}
                                                />
                                              </Stack>
                                            ) : null}
                                          </Stack>
                                        </Card>
                                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'stretch', sm: 'center' }}>
                                          <RolePreferenceSelector
                                            value={item.rolePreference}
                                            loading={Boolean(roleSavingBySubscriptionId[item.subscriptionId])}
                                            onChange={(value) => handleRolePreferenceChange(item.subscriptionId, value)}
                                            t={t}
                                          />
                                          {item.moveRecommendationAvailable ? (
                                            <Button
                                              size="small"
                                              variant="contained"
                                              color="secondary"
                                              onClick={() => setMoveDialogRow(item)}
                                              sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2, alignSelf: 'flex-start' }}
                                            >
                                              {t('subscriptionSharing.actions.moveToDay', {
                                                day: item.recommendedDestinationHostRenewalDayOfMonth || '-',
                                                defaultValue: 'Move to day {{day}}'
                                              })}
                                            </Button>
                                          ) : null}
                                          <Button
                                            size="small"
                                            variant="text"
                                            onClick={() => loadDiagnostics(item.subscriptionId)}
                                            sx={{ textTransform: 'none', fontWeight: 700, alignSelf: 'flex-start' }}
                                          >
                                            {t('subscriptionSharing.actions.viewDiagnostics', 'View diagnostics')}
                                          </Button>
                                        </Stack>
                                      </Stack>
                                    </Box>
                                  </Grid>
                                ))}
                              </Grid>
                            )}
                          </Stack>
                        </Card>
                      );
                    })}
                  </Stack>
                </Stack>
              </Card>
            ))}
          </Stack>
        )}
      </MainCard>

      <MainCard
        title={
          <SectionTitle
            title={t('subscriptionSharing.sections.eligibleNotShared', 'Eligible and not shared')}
            count={eligibleNotSharedRows.length}
            subtitle={t(
              'subscriptionSharing.sections.eligibleHint',
              'These subscriptions already satisfy the sharing rule and still are not part of any shared cluster.'
            )}
          />
        }
      >
        {loading ? (
          <Stack spacing={1.25}>
            {Array.from({ length: 3 }).map((_, idx) => (
              <Skeleton key={`eligible-skel-${idx}`} variant="rounded" height={90} />
            ))}
          </Stack>
        ) : eligibleNotSharedRows.length === 0 ? (
          <Alert severity="info">{t('subscriptionSharing.sections.noEligible', 'No eligible subscriptions pending share.')}</Alert>
        ) : (
          <Stack spacing={1}>
            {eligibleNotSharedRows.map((row) => (
              <Card
                key={`eligible-${row.subscriptionId}`}
                sx={(muiTheme) => ({
                  ...sectionCardSx,
                  backgroundImage:
                    muiTheme.palette.mode === 'dark'
                      ? `linear-gradient(160deg, ${withAlpha(muiTheme.palette.success.main, 0.1)} 0%, ${withAlpha(muiTheme.palette.background.paper, 0.96)} 54%)`
                      : `linear-gradient(160deg, ${withAlpha(muiTheme.palette.success.main, 0.08)} 0%, ${muiTheme.palette.background.paper} 54%)`
                })}
              >
                <Stack spacing={1.4}>
                  <Stack direction={{ xs: 'column', lg: 'row' }} spacing={1.1} justifyContent="space-between">
                    <Stack spacing={1}>
                      <Stack direction="row" spacing={0.75} alignItems="center" useFlexGap flexWrap="wrap">
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>
                          #{row.subscriptionId} · {row.customerName || '-'}
                        </Typography>
                        <RoleChip role={row.sharingRole} t={t} />
                        <EligibilityChips
                          eligible={row.eligible}
                          eligibilityReason={row.eligibilityReason}
                          minimumEligibleMonths={row.minimumEligibleMonths}
                          t={t}
                        />
                        <RiskChip bucket={row.hostRiskBucket} t={t} />
                        <StatusChip status={row.subscriptionStatus} t={t} />
                      </Stack>
                      <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
                        <Chip
                          size="small"
                          variant="outlined"
                          label={`${t('subscriptionSharing.card.line', 'Line')}: ${formatLineDisplay(row.lineName, row.lineId)}`}
                        />
                        {row.linePlusId && row.linePlusId !== '-' ? (
                          <Chip size="small" variant="outlined" label={`${t('subscriptionSharing.card.linePlus', 'Line plus')}: ${row.linePlusId}`} />
                        ) : null}
                        <Chip size="small" variant="outlined" label={`${t('subscriptionSharing.card.provider', 'Provider')}: ${row.provider || '-'}`} />
                      </Stack>
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'stretch', lg: 'flex-start' }}>
                      <RolePreferenceSelector
                        value={row.rolePreference}
                        loading={Boolean(roleSavingBySubscriptionId[row.subscriptionId])}
                        onChange={(value) => handleRolePreferenceChange(row.subscriptionId, value)}
                        t={t}
                      />
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => loadDiagnostics(row.subscriptionId)}
                        sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2, alignSelf: { xs: 'stretch', lg: 'flex-start' } }}
                      >
                        {t('subscriptionSharing.actions.viewDiagnostics', 'View diagnostics')}
                      </Button>
                    </Stack>
                  </Stack>

                    <Grid container spacing={1.25}>
                    <Grid item xs={6} md={3}>
                      <MetricTile label={t('subscriptionSharing.card.hostRenewal', 'Host renewal')} value={formatDate(row.hostRenewalDate)} color={theme.palette.primary.main} />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <MetricTile
                        label={t('subscriptionSharing.card.renewalDay', 'Renewal day')}
                        value={formatHostRenewalDay(row.hostRenewalDayOfMonth, t)}
                        helper={formatHostDays(row.hostDaysToRenewal, t)}
                        color={row.hostAtRisk ? theme.palette.warning.main : theme.palette.info.main}
                      />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <MetricTile
                        label={t('subscriptionSharing.card.termLabel', 'Term')}
                        value={t('subscriptionSharing.card.termValue', { months: row.termMonths || 0, defaultValue: '{{months}} months' })}
                        color={theme.palette.success.main}
                      />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <MetricTile
                        label={t('subscriptionSharing.card.usageLabel', 'Usage pressure')}
                        value={`${row.estimatedCustomerUsage || 0} / ${row.activatedScreens || 0}`}
                        helper={t('subscriptionSharing.card.capacityShort', {
                          available: row.availableCapacity || 0,
                          defaultValue: 'Available {{available}}'
                        })}
                        color={theme.palette.success.main}
                      />
                    </Grid>
                  </Grid>
                </Stack>
                </Card>
              ))}
          </Stack>
        )}
      </MainCard>

      <MainCard
        title={
          <SectionTitle
            title={t('subscriptionSharing.sections.notEligible', 'Not eligible right now')}
            count={notEligibleRows.length}
            subtitle={t(
              'subscriptionSharing.sections.notEligibleHint',
              'This list surfaces subscriptions that stay outside sharing and explains whether the block is status, term or available capacity.'
            )}
          />
        }
      >
        {loading ? (
          <Stack spacing={1.25}>
            {Array.from({ length: 3 }).map((_, idx) => (
              <Skeleton key={`not-eligible-skel-${idx}`} variant="rounded" height={90} />
            ))}
          </Stack>
        ) : notEligibleRows.length === 0 ? (
          <Alert severity="info">{t('subscriptionSharing.sections.noNotEligible', 'No non-eligible subscriptions matched current filters.')}</Alert>
        ) : (
          <Stack spacing={1}>
            {notEligibleRows.map((row) => (
              <Card
                key={`not-eligible-${row.subscriptionId}`}
                sx={(muiTheme) => ({
                  ...sectionCardSx,
                  backgroundImage:
                    muiTheme.palette.mode === 'dark'
                      ? `linear-gradient(160deg, ${withAlpha(muiTheme.palette.error.main, 0.1)} 0%, ${withAlpha(muiTheme.palette.background.paper, 0.96)} 54%)`
                      : `linear-gradient(160deg, ${withAlpha(muiTheme.palette.error.main, 0.06)} 0%, ${muiTheme.palette.background.paper} 54%)`
                })}
              >
                <Stack spacing={1.4}>
                  <Stack direction={{ xs: 'column', lg: 'row' }} spacing={1.1} justifyContent="space-between">
                    <Stack spacing={1}>
                      <Stack direction="row" spacing={0.75} alignItems="center" useFlexGap flexWrap="wrap">
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>
                          #{row.subscriptionId} · {row.customerName || '-'}
                        </Typography>
                        <RoleChip role={row.sharingRole} t={t} />
                        <EligibilityChips
                          eligible={row.eligible}
                          eligibilityReason={row.eligibilityReason}
                          minimumEligibleMonths={row.minimumEligibleMonths}
                          t={t}
                        />
                        <RiskChip bucket={row.hostRiskBucket} t={t} />
                        <StatusChip status={row.subscriptionStatus} t={t} />
                      </Stack>
                      <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
                        <Chip
                          size="small"
                          variant="outlined"
                          label={`${t('subscriptionSharing.card.line', 'Line')}: ${formatLineDisplay(row.lineName, row.lineId)}`}
                        />
                        {row.linePlusId && row.linePlusId !== '-' ? (
                          <Chip size="small" variant="outlined" label={`${t('subscriptionSharing.card.linePlus', 'Line plus')}: ${row.linePlusId}`} />
                        ) : null}
                        <Chip size="small" variant="outlined" label={`${t('subscriptionSharing.card.provider', 'Provider')}: ${row.provider || '-'}`} />
                      </Stack>
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'stretch', lg: 'flex-start' }}>
                      <RolePreferenceSelector
                        value={row.rolePreference}
                        loading={Boolean(roleSavingBySubscriptionId[row.subscriptionId])}
                        onChange={(value) => handleRolePreferenceChange(row.subscriptionId, value)}
                        t={t}
                      />
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => loadDiagnostics(row.subscriptionId)}
                        sx={{
                          textTransform: 'none',
                          fontWeight: 700,
                          borderRadius: 2,
                          alignSelf: { xs: 'stretch', lg: 'flex-start' },
                          color: 'common.white',
                          backgroundImage: `linear-gradient(135deg, ${withAlpha(theme.palette.error.main, 0.92)} 0%, ${withAlpha(theme.palette.warning.dark, 0.92)} 100%)`,
                          boxShadow: `0 10px 24px ${withAlpha(theme.palette.error.main, 0.24)}`,
                          '&:hover': {
                            backgroundImage: `linear-gradient(135deg, ${theme.palette.error.dark} 0%, ${theme.palette.warning.main} 100%)`
                          }
                        }}
                      >
                        {t('subscriptionSharing.actions.viewDiagnostics', 'View diagnostics')}
                      </Button>
                    </Stack>
                  </Stack>

                    <Grid container spacing={1.25}>
                    <Grid item xs={6} md={3}>
                      <MetricTile label={t('subscriptionSharing.card.hostRenewal', 'Host renewal')} value={formatDate(row.hostRenewalDate)} color={theme.palette.primary.main} />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <MetricTile
                        label={t('subscriptionSharing.card.renewalDay', 'Renewal day')}
                        value={formatHostRenewalDay(row.hostRenewalDayOfMonth, t)}
                        helper={formatHostDays(row.hostDaysToRenewal, t)}
                        color={row.hostAtRisk ? theme.palette.warning.main : theme.palette.info.main}
                      />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <MetricTile
                        label={t('subscriptionSharing.card.termLabel', 'Term')}
                        value={t('subscriptionSharing.card.termValue', { months: row.termMonths || 0, defaultValue: '{{months}} months' })}
                        helper={eligibilityReasonMeta(row.eligibilityReason, row.minimumEligibleMonths, t).label}
                        color={theme.palette.warning.main}
                      />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <MetricTile
                        label={t('subscriptionSharing.card.usageLabel', 'Usage pressure')}
                        value={`${row.estimatedCustomerUsage || 0} / ${row.activatedScreens || 0}`}
                        helper={t('subscriptionSharing.card.capacityShort', {
                          available: row.availableCapacity || 0,
                          defaultValue: 'Available {{available}}'
                        })}
                        color={row.availableCapacity > 0 ? theme.palette.warning.main : theme.palette.error.main}
                      />
                    </Grid>
                    </Grid>
                  </Stack>
                </Card>
              ))}
          </Stack>
        )}
      </MainCard>

      <Dialog
        open={Boolean(moveDialogRow)}
        onClose={() => {
          if (!moveSaving) {
            setMoveDialogRow(null);
          }
        }}
        fullWidth
        maxWidth="sm"
        fullScreen={isMobile}
      >
        <DialogTitleWithClose
          onClose={() => {
            if (!moveSaving) {
              setMoveDialogRow(null);
            }
          }}
        >
          <Stack spacing={0.35}>
            <Typography variant="h4">{t('subscriptionSharing.move.confirmTitle', 'Move beneficiary to a safer host')}</Typography>
            <Typography variant="body2" color="text.secondary">
              {moveDialogRow
                ? t('subscriptionSharing.move.confirmSubtitle', {
                    subscriptionId: moveDialogRow.subscriptionId,
                    defaultValue: 'Subscription #{{subscriptionId}}'
                  })
                : t('subscriptionSharing.move.confirmSubtitleFallback', 'Confirm the recommended move')}
            </Typography>
          </Stack>
        </DialogTitleWithClose>
        <DialogContent dividers>
          {!moveDialogRow ? null : (
            <Stack spacing={1.5}>
              <DialogContentText>
                {t(
                  'subscriptionSharing.move.confirmBody',
                  'This will update the subscription line to the recommended host account and keep the destination pinned as HOST.'
                )}
              </DialogContentText>
              <Grid container spacing={1.2}>
                <Grid item xs={12} sm={6}>
                  <Card sx={diagnosticsSurfaceSx}>
                    <Typography variant="overline" color="text.secondary">
                      {t('subscriptionSharing.move.currentAssignment', 'Current assignment')}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      #{moveDialogRow.subscriptionId} · {moveDialogRow.customerName || '-'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('subscriptionSharing.move.currentHost', {
                        id: moveDialogRow.sharedHostSubscriptionId || '-',
                        defaultValue: 'Host #{{id}}'
                      })}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('subscriptionSharing.move.currentLine', {
                        line: formatLineDisplay(moveDialogRow.lineName, moveDialogRow.lineId),
                        defaultValue: 'Line: {{line}}'
                      })}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('subscriptionSharing.move.currentDayValue', {
                        day: formatHostRenewalDay(moveDialogRow.hostRenewalDayOfMonth, t),
                        defaultValue: 'Day: {{day}}'
                      })}
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Card sx={diagnosticsSurfaceSx}>
                    <Typography variant="overline" color="text.secondary">
                      {t('subscriptionSharing.move.destinationAssignment', 'Recommended destination')}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      {t('subscriptionSharing.move.recommendedHost', {
                        id: moveDialogRow.recommendedDestinationSubscriptionId || '-',
                        defaultValue: 'Host #{{id}}'
                      })}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {moveDialogRow.recommendedDestinationCustomerName || '-'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('subscriptionSharing.move.recommendedLine', {
                        line: formatLineDisplay(moveDialogRow.recommendedDestinationLineName, moveDialogRow.recommendedDestinationLineId),
                        defaultValue: 'Line: {{line}}'
                      })}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('subscriptionSharing.move.currentDayValue', {
                        day: formatHostRenewalDay(moveDialogRow.recommendedDestinationHostRenewalDayOfMonth, t),
                        defaultValue: 'Day: {{day}}'
                      })}
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
              <Alert severity="warning">
                {t(
                  'subscriptionSharing.move.confirmWarning',
                  'This action changes lineId/linePlusId of the beneficiary subscription and immediately affects how the shared cluster is organized.'
                )}
              </Alert>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMoveDialogRow(null)} disabled={moveSaving} sx={{ textTransform: 'none', fontWeight: 700 }}>
            {t('actions.cancel', 'Cancel')}
          </Button>
          <Button
            onClick={handleMoveSubscription}
            disabled={moveSaving || !moveDialogRow?.moveRecommendationAvailable}
            variant="contained"
            color="secondary"
            sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
          >
            {moveSaving ? t('subscriptionSharing.actions.moving', 'Moving...') : t('subscriptionSharing.actions.confirmMove', 'Move beneficiary')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={diagnosticsOpen}
        onClose={() => {
          setDiagnosticsOpen(false);
          setDiagnosticsData(null);
        }}
        fullWidth
        maxWidth="md"
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: { xs: 0, sm: 4 },
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
            backgroundImage: (muiTheme) =>
              muiTheme.palette.mode === 'dark'
                ? `linear-gradient(180deg, ${withAlpha(muiTheme.palette.primary.main, 0.12)} 0%, ${withAlpha(
                    muiTheme.palette.background.paper,
                    0.98
                  )} 18%, ${muiTheme.palette.background.paper} 100%)`
                : `linear-gradient(180deg, ${withAlpha(muiTheme.palette.primary.main, 0.08)} 0%, ${muiTheme.palette.background.paper} 18%, ${muiTheme.palette.background.paper} 100%)`
          }
        }}
      >
        <DialogTitleWithClose
          sx={{
            borderBottom: '1px solid',
            borderColor: 'divider',
            backgroundColor: (muiTheme) => withAlpha(muiTheme.palette.background.default, muiTheme.palette.mode === 'dark' ? 0.72 : 0.82)
          }}
          closeButtonSx={{
            bgcolor: (muiTheme) => withAlpha(muiTheme.palette.background.paper, muiTheme.palette.mode === 'dark' ? 0.96 : 0.92)
          }}
          onClose={() => {
            setDiagnosticsOpen(false);
            setDiagnosticsData(null);
          }}
        >
          <Stack spacing={0.25}>
            <Typography variant="h4">{t('subscriptionSharing.diagnostics.title', 'Subscription diagnostics')}</Typography>
            <Typography variant="body2" color="text.secondary">
              {diagnosticsData?.subscriptionId
                ? t('subscriptionSharing.diagnostics.subtitle', {
                    subscriptionId: diagnosticsData.subscriptionId,
                    defaultValue: 'Subscription #{{subscriptionId}}'
                  })
                : t('subscriptionSharing.diagnostics.subtitleFallback', 'Live eligibility snapshot')}
            </Typography>
          </Stack>
        </DialogTitleWithClose>

        <DialogContent
          dividers
          sx={{
            px: { xs: 1.5, sm: 3 },
            py: { xs: 1.5, sm: 2 },
            backgroundColor: (muiTheme) => withAlpha(muiTheme.palette.background.default, muiTheme.palette.mode === 'dark' ? 0.26 : 0.4)
          }}
        >
          {diagnosticsLoading ? (
            <Stack spacing={1.25}>
              {Array.from({ length: 6 }).map((_, idx) => (
                <Skeleton key={`diag-skel-${idx}`} variant="rounded" height={48} />
              ))}
            </Stack>
          ) : !diagnosticsData ? (
            <Alert severity="warning">{t('subscriptionSharing.diagnostics.empty', 'No diagnostics available for this subscription.')}</Alert>
          ) : (
            <Stack spacing={2}>
              <Box
                sx={(muiTheme) => ({
                  p: { xs: 1.6, sm: 2 },
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: withAlpha(muiTheme.palette.primary.main, muiTheme.palette.mode === 'dark' ? 0.4 : 0.18),
                  backgroundImage:
                    muiTheme.palette.mode === 'dark'
                      ? `linear-gradient(135deg, ${withAlpha(muiTheme.palette.primary.main, 0.18)} 0%, ${withAlpha(
                          muiTheme.palette.info.main,
                          0.12
                        )} 56%, ${withAlpha(muiTheme.palette.background.paper, 0.96)} 100%)`
                      : `linear-gradient(135deg, ${withAlpha(muiTheme.palette.primary.main, 0.1)} 0%, ${withAlpha(
                          muiTheme.palette.info.main,
                          0.06
                        )} 56%, ${muiTheme.palette.background.paper} 100%)`
                })}
              >
                <Stack spacing={1.2}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
                    <Box>
                      <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1.1 }}>
                        {t('subscriptionSharing.diagnostics.summaryTitle', 'Sharing summary')}
                      </Typography>
                      <Typography variant="h4" sx={{ lineHeight: 1.15 }}>
                        #{diagnosticsData.subscriptionId} · {diagnosticsData.customerName || '-'}
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
                      <RoleChip role={diagnosticsData.sharingRole} t={t} />
                      <EligibilityChips
                        eligible={diagnosticsData.eligible}
                        eligibilityReason={diagnosticsData.eligibilityReason}
                        minimumEligibleMonths={diagnosticsData.minimumEligibleMonths}
                        t={t}
                      />
                      <RiskChip bucket={diagnosticsData.hostRiskBucket} t={t} />
                    </Stack>
                  </Stack>
                  <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
                    <Chip
                      size="small"
                      variant="outlined"
                      color={diagnosticsData.sharingActive ? 'success' : 'default'}
                      label={
                        diagnosticsData.sharingActive
                          ? t('subscriptionSharing.diagnostics.sharingActive', 'Active for sharing')
                          : t('subscriptionSharing.diagnostics.sharingInactive', 'Inactive for sharing')
                      }
                      sx={{ fontWeight: 700 }}
                    />
                    <Chip
                      size="small"
                      variant="outlined"
                      color={diagnosticsData.sharedCluster ? 'info' : 'default'}
                      label={
                        diagnosticsData.sharedCluster
                          ? t('subscriptionSharing.diagnostics.sharedCluster', {
                              count: diagnosticsData.sharedClusterSize || 0,
                              defaultValue: 'Shared cluster · {{count}}'
                            })
                          : t('subscriptionSharing.diagnostics.standalone', 'Standalone subscription')
                      }
                      sx={{ fontWeight: 700 }}
                    />
                    <Chip
                      size="small"
                      variant="outlined"
                      color={diagnosticsData.hostAtRisk ? 'warning' : 'default'}
                      label={
                        diagnosticsData.hostAtRisk
                          ? t('subscriptionSharing.diagnostics.hostAtRisk', 'Host risk affects shared subscriptions')
                          : t('subscriptionSharing.diagnostics.hostStable', 'Host currently stable')
                      }
                      sx={{ fontWeight: 700 }}
                    />
                    <Chip
                      size="small"
                      variant="outlined"
                      color={diagnosticsData.rolePreference === 'AUTO' ? 'default' : 'secondary'}
                      label={t('subscriptionSharing.actions.roleCurrent', {
                        role:
                          diagnosticsData.rolePreference === 'HOST'
                            ? t('subscriptionSharing.actions.roleHost', 'Host')
                            : diagnosticsData.rolePreference === 'SHARED'
                              ? t('subscriptionSharing.actions.roleShared', 'Shared')
                              : t('subscriptionSharing.actions.roleAuto', 'Auto'),
                        defaultValue: 'Role mode: {{role}}'
                      })}
                      sx={{ fontWeight: 700 }}
                    />
                    <Chip size="small" variant="outlined" label={`${t('subscriptionSharing.card.provider', 'Provider')}: ${diagnosticsData.provider || '-'}`} />
                    <Chip
                      size="small"
                      variant="outlined"
                      label={`${t('subscriptionSharing.card.line', 'Line')}: ${formatLineDisplay(diagnosticsData.lineName, diagnosticsData.lineId)}`}
                    />
                  </Stack>
                </Stack>
              </Box>

              <Card sx={diagnosticsSurfaceSx}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {t('subscriptionSharing.actions.rolePreference', 'Role')}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      {t(
                        'subscriptionSharing.actions.roleHelp',
                        'Choose who should behave as host inside this shared line. Auto keeps the system decision.'
                      )}
                    </Typography>
                  </Box>
                  <RolePreferenceSelector
                    value={diagnosticsData.rolePreference}
                    loading={Boolean(roleSavingBySubscriptionId[diagnosticsData.subscriptionId])}
                    onChange={(value) => handleRolePreferenceChange(diagnosticsData.subscriptionId, value)}
                    t={t}
                  />
                </Stack>
              </Card>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} useFlexGap flexWrap="wrap">
                <Chip size="small" variant="outlined" label={`Sub #${diagnosticsData.subscriptionId || '-'}`} />
                <Chip size="small" variant="outlined" label={`Cust #${diagnosticsData.customerId || '-'}`} />
                {diagnosticsData.sharedHostSubscriptionId ? (
                  <Chip
                    size="small"
                    variant="outlined"
                    label={t('subscriptionSharing.diagnostics.hostSubscription', {
                      id: diagnosticsData.sharedHostSubscriptionId,
                      defaultValue: 'Host #{{id}}'
                    })}
                  />
                ) : null}
              </Stack>

              <Grid container spacing={1.25}>
                <Grid item xs={12} sm={6} md={4}>
                  <Card sx={diagnosticsSurfaceSx}>
                    <Typography variant="caption" color="text.secondary">
                      {t('subscriptionSharing.diagnostics.customer', 'Customer')}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      {diagnosticsData.customerName || '-'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      #{diagnosticsData.customerId || '-'}
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Card sx={diagnosticsSurfaceSx}>
                    <Typography variant="caption" color="text.secondary">
                      {t('subscriptionSharing.diagnostics.line', 'Line')}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      {formatLineDisplay(diagnosticsData.lineName, diagnosticsData.lineId)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('subscriptionSharing.diagnostics.linePlus', { value: diagnosticsData.linePlusId || '-', defaultValue: 'Plus: {{value}}' })}
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Card sx={diagnosticsSurfaceSx}>
                    <Typography variant="caption" color="text.secondary">
                      {t('subscriptionSharing.diagnostics.provider', 'Provider')}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      {diagnosticsData.provider || '-'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('subscriptionSharing.diagnostics.status', { value: diagnosticsData.subscriptionStatus || '-', defaultValue: 'Status: {{value}}' })}
                    </Typography>
                  </Card>
                </Grid>
              </Grid>

              <Grid container spacing={1.25}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={diagnosticsSurfaceSx}>
                    <Typography variant="caption" color="text.secondary">
                      {t('subscriptionSharing.diagnostics.hostRenewalDate', 'Host renewal date')}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      {formatDate(diagnosticsData.hostRenewalDate)}
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={diagnosticsSurfaceSx}>
                    <Typography variant="caption" color="text.secondary">
                      {t('subscriptionSharing.diagnostics.hostRenewalDay', 'Renewal day')}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      {formatHostRenewalDay(diagnosticsData.hostRenewalDayOfMonth, t)}
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={diagnosticsSurfaceSx}>
                    <Typography variant="caption" color="text.secondary">
                      {t('subscriptionSharing.diagnostics.hostDaysToRenewal', 'Days to host renewal')}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      {formatHostDays(diagnosticsData.hostDaysToRenewal, t)}
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={diagnosticsSurfaceSx}>
                    <Typography variant="caption" color="text.secondary">
                      {t('subscriptionSharing.diagnostics.hostRiskBucket', 'Host risk bucket')}
                    </Typography>
                    <Box sx={{ mt: 0.8 }}>
                      <RiskChip bucket={diagnosticsData.hostRiskBucket} t={t} />
                    </Box>
                  </Card>
                </Grid>
              </Grid>

              <Grid container spacing={1.25}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={diagnosticsSurfaceSx}>
                    <Typography variant="caption" color="text.secondary">
                      {t('subscriptionSharing.diagnostics.billing', 'Billing')}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      {diagnosticsData.billing || '-'}
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={diagnosticsSurfaceSx}>
                    <Typography variant="caption" color="text.secondary">
                      {t('subscriptionSharing.diagnostics.startDate', 'Start date')}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      {formatDate(diagnosticsData.startDate)}
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={diagnosticsSurfaceSx}>
                    <Typography variant="caption" color="text.secondary">
                      {t('subscriptionSharing.diagnostics.renewalDate', 'Renewal date')}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      {formatDate(diagnosticsData.renewalDate)}
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={diagnosticsSurfaceSx}>
                    <Typography variant="caption" color="text.secondary">
                      {t('subscriptionSharing.diagnostics.termMonths', 'Calculated months')}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      {diagnosticsData.termMonths || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('subscriptionSharing.diagnostics.minimumEligibleMonths', {
                        count: diagnosticsData.minimumEligibleMonths || 3,
                        defaultValue: 'Minimum: {{count}}'
                      })}
                    </Typography>
                  </Card>
                </Grid>
              </Grid>

              <Grid container spacing={1.25}>
                <Grid item xs={12} sm={4}>
                  <Card sx={diagnosticsSurfaceSx}>
                    <Typography variant="caption" color="text.secondary">
                      {t('subscriptionSharing.diagnostics.activatedScreens', 'Activated screens')}
                    </Typography>
                    <Typography variant="h4">{diagnosticsData.activatedScreens || 0}</Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card sx={diagnosticsSurfaceSx}>
                    <Typography variant="caption" color="text.secondary">
                      {t('subscriptionSharing.diagnostics.estimatedUsage', 'Estimated usage')}
                    </Typography>
                    <Typography variant="h4">{diagnosticsData.estimatedUsage || 0}</Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card sx={diagnosticsSurfaceSx}>
                    <Typography variant="caption" color="text.secondary">
                      {t('subscriptionSharing.diagnostics.availableCapacity', 'Available capacity')}
                    </Typography>
                    <Typography variant="h4">{diagnosticsData.availableCapacity || 0}</Typography>
                  </Card>
                </Grid>
              </Grid>

              {diagnosticsData.sharingRole === 'SHARED' ? (
                <Card sx={diagnosticsSurfaceSx}>
                  <Stack spacing={1.15}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                          {t('subscriptionSharing.move.title', 'Move recommendation')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {moveReasonLabel(diagnosticsData.moveRecommendationReason, t)}
                        </Typography>
                      </Box>
                      <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
                        <MovePriorityChip priority={diagnosticsData.moveRecommendationPriority} t={t} />
                        {diagnosticsData.moveRecommendationAvailable ? (
                          <RiskChip bucket={diagnosticsData.recommendedDestinationHostRiskBucket} t={t} />
                        ) : null}
                      </Stack>
                    </Stack>

                    <Grid container spacing={1.25}>
                      <Grid item xs={12} sm={4}>
                        <Card sx={diagnosticsSurfaceSx}>
                          <Typography variant="caption" color="text.secondary">
                            {t('subscriptionSharing.move.requiredScreens', 'Screens to move')}
                          </Typography>
                          <Typography variant="h4">{diagnosticsData.requiredScreensToMove || 1}</Typography>
                        </Card>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Card sx={diagnosticsSurfaceSx}>
                          <Typography variant="caption" color="text.secondary">
                            {t('subscriptionSharing.move.currentDay', 'Current host day')}
                          </Typography>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                            {formatHostRenewalDay(diagnosticsData.hostRenewalDayOfMonth, t)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {formatHostDays(diagnosticsData.hostDaysToRenewal, t)}
                          </Typography>
                        </Card>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Card sx={diagnosticsSurfaceSx}>
                          <Typography variant="caption" color="text.secondary">
                            {t('subscriptionSharing.move.recommendedDay', 'Recommended day')}
                          </Typography>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                            {formatHostRenewalDay(diagnosticsData.recommendedDestinationHostRenewalDayOfMonth, t)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {formatHostDays(diagnosticsData.recommendedDestinationHostDaysToRenewal, t)}
                          </Typography>
                        </Card>
                      </Grid>
                    </Grid>

                    {diagnosticsData.moveRecommendationAvailable ? (
                      <>
                        <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
                          <Chip
                            size="small"
                            variant="outlined"
                            label={t('subscriptionSharing.move.recommendedHost', {
                              id: diagnosticsData.recommendedDestinationSubscriptionId || '-',
                              defaultValue: 'Host #{{id}}'
                            })}
                          />
                          <Chip
                            size="small"
                            variant="outlined"
                            label={t('subscriptionSharing.move.recommendedCustomer', {
                              customer: diagnosticsData.recommendedDestinationCustomerName || '-',
                              defaultValue: 'Customer: {{customer}}'
                            })}
                          />
                          <Chip
                            size="small"
                            variant="outlined"
                            label={t('subscriptionSharing.move.recommendedLine', {
                              line: formatLineDisplay(diagnosticsData.recommendedDestinationLineName, diagnosticsData.recommendedDestinationLineId),
                              defaultValue: 'Line: {{line}}'
                            })}
                          />
                        </Stack>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => setMoveDialogRow(normalizeRow(diagnosticsData))}
                          sx={{ textTransform: 'none', fontWeight: 700, alignSelf: 'flex-start', borderRadius: 2 }}
                        >
                          {t('subscriptionSharing.actions.confirmMove', 'Move beneficiary')}
                        </Button>
                      </>
                    ) : null}
                  </Stack>
                </Card>
              ) : null}

              <Card
                sx={(muiTheme) => ({
                  ...diagnosticsSurfaceSx,
                  backgroundColor: muiTheme.vars?.palette?.surface?.sunken || muiTheme.palette.background.default
                })}
              >
                <Stack spacing={0.75}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                    {t('subscriptionSharing.diagnostics.readingTitle', 'How to read this result')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {diagnosticsData.eligible
                      ? t(
                          'subscriptionSharing.diagnostics.readingEligible',
                          'This subscription is active, meets the minimum term and still has available capacity to be considered for sharing.'
                        )
                      : t(
                          'subscriptionSharing.diagnostics.readingBlocked',
                          'This subscription is blocked by the main reason shown above. Review term, status and available capacity before trying to share it.'
                        )}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {diagnosticsData.sharedCluster
                      ? t(
                          'subscriptionSharing.diagnostics.readingHostImpact',
                          'For shared clusters, the host renewal date controls the operational bucket. If the host expires, all linked shared subscriptions are affected.'
                        )
                      : t(
                          'subscriptionSharing.diagnostics.readingStandalone',
                          'This subscription is not linked to a shared cluster, so its own renewal date drives the operational bucket.'
                        )}
                  </Typography>
                </Stack>
              </Card>
            </Stack>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            px: { xs: 1.5, sm: 3 },
            py: 1.5,
            borderTop: '1px solid',
            borderColor: 'divider',
            backgroundColor: (muiTheme) => withAlpha(muiTheme.palette.background.default, muiTheme.palette.mode === 'dark' ? 0.72 : 0.82)
          }}
        >
          <Button
            onClick={() => {
              setDiagnosticsOpen(false);
              setDiagnosticsData(null);
            }}
            variant="contained"
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: 2,
              backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.info.main} 100%)`
            }}
          >
            {t('subscriptionSharing.actions.closeDiagnostics', 'Close diagnostics')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
