import { useCallback, useEffect, useMemo, useState } from 'react';
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
    sharedCluster: Boolean(item.sharedCluster),
    sharedHostSubscriptionId: item.sharedHostSubscriptionId ?? null,
    sharedClusterSize: Number(item.sharedClusterSize || 0)
  };
}

function normalizeDiagnostics(item = {}) {
  return {
    subscriptionId: item.subscriptionId ?? null,
    customerId: item.customerId ?? null,
    customerName: item.customerName ?? item.customer_name ?? '-',
    lineId: item.lineId ?? '-',
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
    sharedCluster: Boolean(item.sharedCluster),
    sharedHostSubscriptionId: item.sharedHostSubscriptionId ?? null,
    sharedClusterSize: Number(item.sharedClusterSize || 0)
  };
}

function formatDate(value) {
  if (!value) return '-';
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? String(value) : parsed.toLocaleDateString();
}

function roleColor(role) {
  if (role === 'HOST') return 'warning';
  if (role === 'SHARED') return 'info';
  return 'default';
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

  const headers = useMemo(() => ({ Authorization: `Bearer ${accessToken}` }), [accessToken]);

  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [eligibleFilter, setEligibleFilter] = useState('ALL');
  const [rows, setRows] = useState([]);
  const [kpi, setKpi] = useState({
    totalSubscriptions: 0,
    activeSubscriptions: 0,
    sharedClusters: 0,
    hostSubscriptions: 0,
    sharedSubscriptions: 0,
    eligibleSubscriptions: 0
  });
  const [diagnosticsOpen, setDiagnosticsOpen] = useState(false);
  const [diagnosticsLoading, setDiagnosticsLoading] = useState(false);
  const [diagnosticsData, setDiagnosticsData] = useState(null);

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
        eligibleSubscriptions: Number(payload?.kpi?.eligibleSubscriptions || 0)
      });
    } catch (err) {
      enqueueSnackbar(err?.response?.data?.message || t('subscriptionSharing.errors.loadError', 'Could not load shared overview.'), {
        variant: 'error'
      });
    } finally {
      setLoading(false);
    }
  }, [accessToken, eligibleFilter, headers, statusFilter, t, enqueueSnackbar]);

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

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((row) => {
      return (
        String(row.subscriptionId || '').toLowerCase().includes(term) ||
        String(row.customerName || '').toLowerCase().includes(term) ||
        String(row.lineId || '').toLowerCase().includes(term) ||
        String(row.linePlusId || '').toLowerCase().includes(term) ||
        String(row.provider || '').toLowerCase().includes(term) ||
        String(row.billing || '').toLowerCase().includes(term) ||
        String(row.subscriptionStatus || '').toLowerCase().includes(term) ||
        String(row.eligibilityReason || '').toLowerCase().includes(term)
      );
    });
  }, [rows, search]);

  const hostRows = useMemo(() => filteredRows.filter((row) => row.sharingRole === 'HOST'), [filteredRows]);
  const eligibleNotSharedRows = useMemo(
    () => filteredRows.filter((row) => row.eligible && row.sharingRole === 'NONE'),
    [filteredRows]
  );
  const notEligibleRows = useMemo(
    () => filteredRows.filter((row) => !row.eligible && row.sharingRole === 'NONE'),
    [filteredRows]
  );
  const filteredSummary = useMemo(
    () => ({
      total: filteredRows.length,
      hosts: hostRows.length,
      beneficiaries: filteredRows.filter((row) => row.sharingRole === 'SHARED').length,
      eligibleStandalone: eligibleNotSharedRows.length,
      blockedStandalone: notEligibleRows.length
    }),
    [eligibleNotSharedRows.length, filteredRows, hostRows.length, notEligibleRows.length]
  );

  const beneficiariesByHost = useMemo(() => {
    const map = {};
    filteredRows.forEach((row) => {
      if (row.sharingRole !== 'SHARED') return;
      const hostId = row.sharedHostSubscriptionId;
      if (!hostId) return;
      if (!map[hostId]) map[hostId] = [];
      map[hostId].push(row);
    });
    return map;
  }, [filteredRows]);

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
            </Stack>
            <Box sx={{ flexGrow: 1 }} />
            <Button
              variant="text"
              startIcon={<TuneIcon />}
              onClick={() => {
                setSearch('');
                setStatusFilter('ALL');
                setEligibleFilter('ALL');
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
            title={t('subscriptionSharing.sections.sharedClusters', 'Shared clusters (host + beneficiaries)')}
            count={hostRows.length}
            subtitle={t(
              'subscriptionSharing.sections.sharedClustersHint',
              'Each host card shows the reusable line, current pressure on capacity and every beneficiary linked to that cluster.'
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
        ) : hostRows.length === 0 ? (
          <Alert severity="info">{t('subscriptionSharing.sections.noSharedClusters', 'No shared clusters found with current filters.')}</Alert>
        ) : (
          <Stack spacing={1.5}>
            {hostRows.map((host) => {
              const beneficiaries = beneficiariesByHost[host.subscriptionId] || [];
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
                          <Chip
                            size="small"
                            color="info"
                            variant="outlined"
                            label={t('subscriptionSharing.card.clusterSize', { count: host.sharedClusterSize || 0, defaultValue: 'Cluster: {{count}}' })}
                          />
                          <StatusChip status={host.subscriptionStatus} t={t} />
                        </Stack>
                        <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
                          <Chip size="small" variant="outlined" label={`${t('subscriptionSharing.card.customer', 'Customer')}: ${host.customerName || '-'}`} />
                          <Chip size="small" variant="outlined" label={`${t('subscriptionSharing.card.line', 'Line')}: ${host.lineId || '-'}`} />
                          {host.linePlusId && host.linePlusId !== '-' ? (
                            <Chip size="small" variant="outlined" label={`${t('subscriptionSharing.card.linePlus', 'Line plus')}: ${host.linePlusId}`} />
                          ) : null}
                          <Chip size="small" variant="outlined" label={`${t('subscriptionSharing.card.provider', 'Provider')}: ${host.provider || '-'}`} />
                        </Stack>
                      </Stack>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => loadDiagnostics(host.subscriptionId)}
                        sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2, alignSelf: { xs: 'stretch', lg: 'flex-start' } }}
                      >
                        {t('subscriptionSharing.actions.viewDiagnostics', 'View diagnostics')}
                      </Button>
                    </Stack>

                    <Grid container spacing={1.25}>
                      <Grid item xs={6} md={3}>
                        <MetricTile label={t('subscriptionSharing.card.renewal', 'Renewal')} value={formatDate(host.renewalDate)} color={theme.palette.primary.main} />
                      </Grid>
                      <Grid item xs={6} md={3}>
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
                      <Grid item xs={6} md={3}>
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
                      <Grid item xs={6} md={3}>
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
                          'These subscriptions reuse the same line and push against the same shared capacity.'
                        )}
                      </Typography>
                    </Stack>

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
                                  <StatusChip status={item.subscriptionStatus} t={t} />
                                </Stack>
                                <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
                                  <Chip size="small" variant="outlined" label={`${t('subscriptionSharing.card.provider', 'Provider')}: ${item.provider || '-'}`} />
                                  <Chip size="small" variant="outlined" label={`${t('subscriptionSharing.card.renewal', 'Renewal')}: ${formatDate(item.renewalDate)}`} />
                                  {item.linePlusId && item.linePlusId !== '-' ? (
                                    <Chip size="small" variant="outlined" label={`${t('subscriptionSharing.card.linePlus', 'Line plus')}: ${item.linePlusId}`} />
                                  ) : null}
                                </Stack>
                                <Button
                                  size="small"
                                  variant="text"
                                  onClick={() => loadDiagnostics(item.subscriptionId)}
                                  sx={{ textTransform: 'none', fontWeight: 700, alignSelf: 'flex-start' }}
                                >
                                  {t('subscriptionSharing.actions.viewDiagnostics', 'View diagnostics')}
                                </Button>
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
                        <StatusChip status={row.subscriptionStatus} t={t} />
                      </Stack>
                      <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
                        <Chip size="small" variant="outlined" label={`${t('subscriptionSharing.card.line', 'Line')}: ${row.lineId || '-'}`} />
                        {row.linePlusId && row.linePlusId !== '-' ? (
                          <Chip size="small" variant="outlined" label={`${t('subscriptionSharing.card.linePlus', 'Line plus')}: ${row.linePlusId}`} />
                        ) : null}
                        <Chip size="small" variant="outlined" label={`${t('subscriptionSharing.card.provider', 'Provider')}: ${row.provider || '-'}`} />
                      </Stack>
                    </Stack>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => loadDiagnostics(row.subscriptionId)}
                      sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2, alignSelf: { xs: 'stretch', lg: 'flex-start' } }}
                    >
                      {t('subscriptionSharing.actions.viewDiagnostics', 'View diagnostics')}
                    </Button>
                  </Stack>

                  <Grid container spacing={1.25}>
                    <Grid item xs={6} md={3}>
                      <MetricTile label={t('subscriptionSharing.card.renewal', 'Renewal')} value={formatDate(row.renewalDate)} color={theme.palette.primary.main} />
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
                    <Grid item xs={6} md={3}>
                      <MetricTile label={t('subscriptionSharing.card.customerId', 'Customer ID')} value={`#${row.customerId || '-'}`} color={theme.palette.info.main} />
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
                        <StatusChip status={row.subscriptionStatus} t={t} />
                      </Stack>
                      <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
                        <Chip size="small" variant="outlined" label={`${t('subscriptionSharing.card.line', 'Line')}: ${row.lineId || '-'}`} />
                        {row.linePlusId && row.linePlusId !== '-' ? (
                          <Chip size="small" variant="outlined" label={`${t('subscriptionSharing.card.linePlus', 'Line plus')}: ${row.linePlusId}`} />
                        ) : null}
                        <Chip size="small" variant="outlined" label={`${t('subscriptionSharing.card.provider', 'Provider')}: ${row.provider || '-'}`} />
                      </Stack>
                    </Stack>
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

                  <Grid container spacing={1.25}>
                    <Grid item xs={6} md={3}>
                      <MetricTile label={t('subscriptionSharing.card.renewal', 'Renewal')} value={formatDate(row.renewalDate)} color={theme.palette.primary.main} />
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
                    <Grid item xs={6} md={3}>
                      <MetricTile label={t('subscriptionSharing.card.customerId', 'Customer ID')} value={`#${row.customerId || '-'}`} color={theme.palette.info.main} />
                    </Grid>
                  </Grid>
                </Stack>
              </Card>
            ))}
          </Stack>
        )}
      </MainCard>

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
                    <Chip size="small" variant="outlined" label={`${t('subscriptionSharing.card.provider', 'Provider')}: ${diagnosticsData.provider || '-'}`} />
                    <Chip size="small" variant="outlined" label={`${t('subscriptionSharing.card.line', 'Line')}: ${diagnosticsData.lineId || '-'}`} />
                  </Stack>
                </Stack>
              </Box>

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
                      {diagnosticsData.lineId || '-'}
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
