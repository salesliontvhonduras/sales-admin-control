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
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import WifiTetheringIcon from '@mui/icons-material/WifiTethering';

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

      <MainCard title={null}>
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
        </Box>
      </MainCard>

      <MainCard title={t('subscriptionSharing.sections.sharedClusters', 'Shared clusters (host + beneficiaries)')}>
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
                <Card key={`host-${host.subscriptionId}`} sx={sectionCardSx}>
                  <Stack spacing={1.25}>
                    <Stack
                      direction={{ xs: 'column', md: 'row' }}
                      spacing={1}
                      alignItems={{ xs: 'flex-start', md: 'center' }}
                      useFlexGap
                      flexWrap="wrap"
                    >
                      <Stack direction="row" spacing={0.75} alignItems="center">
                        <Avatar sx={{ width: 30, height: 30, bgcolor: 'warning.main', color: 'warning.contrastText' }}>
                          <HubIcon fontSize="small" />
                        </Avatar>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                          {t('subscriptionSharing.card.hostSubscription', 'Host subscription')} #{host.subscriptionId}
                        </Typography>
                      </Stack>
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
                      <Chip
                        size="small"
                        variant="outlined"
                        label={`${t('subscriptionSharing.card.provider', 'Provider')}: ${host.provider || '-'}`}
                      />
                    </Stack>

                    <Grid container spacing={1.25}>
                      <Grid item xs={12} md={4}>
                        <Stack direction="row" spacing={0.75} alignItems="center">
                          <PersonOutlineIcon fontSize="small" color="action" />
                          <Typography variant="body2">{host.customerName || '-'}</Typography>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Stack direction="row" spacing={0.75} alignItems="center">
                          <WifiTetheringIcon fontSize="small" color="action" />
                          <Typography variant="body2">
                            {t('subscriptionSharing.card.line', 'Line')}: {host.lineId || '-'}
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Stack direction="row" spacing={0.75} alignItems="center">
                          <CalendarMonthIcon fontSize="small" color="action" />
                          <Typography variant="body2">
                            {t('subscriptionSharing.card.renewal', 'Renewal')}: {formatDate(host.renewalDate)}
                          </Typography>
                        </Stack>
                      </Grid>
                    </Grid>

                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} useFlexGap flexWrap="wrap">
                      <Chip
                        size="small"
                        variant="outlined"
                        label={t('subscriptionSharing.card.capacity', {
                          activated: host.activatedScreens,
                          used: host.estimatedCustomerUsage,
                          available: host.availableCapacity,
                          defaultValue: 'Capacity {{activated}} · Usage {{used}} · Available {{available}}'
                        })}
                      />
                      <Chip
                        size="small"
                        variant="outlined"
                        label={t('subscriptionSharing.card.term', {
                          months: host.termMonths || 0,
                          defaultValue: 'Term {{months}} months'
                        })}
                      />
                      <Chip size="small" variant="outlined" label={`${t('subscriptionSharing.card.status', 'Status')}: ${host.subscriptionStatus || '-'}`} />
                      <Button size="small" variant="text" onClick={() => loadDiagnostics(host.subscriptionId)} sx={{ textTransform: 'none', fontWeight: 700 }}>
                        {t('subscriptionSharing.actions.viewDiagnostics', 'View diagnostics')}
                      </Button>
                    </Stack>

                    <Divider />
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {t('subscriptionSharing.card.beneficiaries', 'Beneficiaries')}
                    </Typography>

                    {beneficiaries.length === 0 ? (
                      <Alert severity="warning">{t('subscriptionSharing.card.noBeneficiaries', 'No SHARED subscriptions linked to this host.')}</Alert>
                    ) : (
                      <Stack spacing={1}>
                        {beneficiaries.map((item) => (
                          <Box
                            key={`beneficiary-${item.subscriptionId}`}
                            sx={(muiTheme) => ({
                              p: 1.25,
                              borderRadius: 2,
                              border: '1px solid',
                              borderColor: 'divider',
                              bgcolor: muiTheme.vars?.palette?.surface?.sunken || muiTheme.palette.background.default
                            })}
                          >
                            <Stack
                              direction={{ xs: 'column', md: 'row' }}
                              spacing={1}
                              alignItems={{ xs: 'flex-start', md: 'center' }}
                              useFlexGap
                              flexWrap="wrap"
                            >
                              <Stack direction="row" spacing={0.75} alignItems="center">
                                <Avatar sx={{ width: 24, height: 24, bgcolor: 'info.main', color: 'info.contrastText' }}>
                                  <LinkIcon fontSize="inherit" />
                                </Avatar>
                                <Typography variant="body2" sx={{ fontWeight: 700 }}>
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
                              <Chip size="small" variant="outlined" label={`${t('subscriptionSharing.card.status', 'Status')}: ${item.subscriptionStatus || '-'}`} />
                              <Chip size="small" variant="outlined" label={`${t('subscriptionSharing.card.provider', 'Provider')}: ${item.provider || '-'}`} />
                              <Chip
                                size="small"
                                variant="outlined"
                                label={t('subscriptionSharing.card.renewal', 'Renewal') + ': ' + formatDate(item.renewalDate)}
                              />
                              <Button
                                size="small"
                                variant="text"
                                onClick={() => loadDiagnostics(item.subscriptionId)}
                                sx={{ textTransform: 'none', fontWeight: 700 }}
                              >
                                {t('subscriptionSharing.actions.viewDiagnostics', 'View diagnostics')}
                              </Button>
                            </Stack>
                          </Box>
                        ))}
                      </Stack>
                    )}
                  </Stack>
                </Card>
              );
            })}
          </Stack>
        )}
      </MainCard>

      <MainCard title={t('subscriptionSharing.sections.eligibleNotShared', 'Eligible and not shared')}>
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
              <Card key={`eligible-${row.subscriptionId}`} sx={sectionCardSx}>
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  spacing={1}
                  alignItems={{ xs: 'flex-start', md: 'center' }}
                  useFlexGap
                  flexWrap="wrap"
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                    #{row.subscriptionId} · {row.customerName || '-'}
                  </Typography>
                  <RoleChip role={row.sharingRole} t={t} />
                  <EligibilityChips
                    eligible={row.eligible}
                    eligibilityReason={row.eligibilityReason}
                    minimumEligibleMonths={row.minimumEligibleMonths}
                    t={t}
                  />
                  <Chip size="small" variant="outlined" label={`${t('subscriptionSharing.card.line', 'Line')}: ${row.lineId || '-'}`} />
                  <Chip size="small" variant="outlined" label={`${t('subscriptionSharing.card.provider', 'Provider')}: ${row.provider || '-'}`} />
                  <Chip
                    size="small"
                    variant="outlined"
                    label={t('subscriptionSharing.card.capacity', {
                      activated: row.activatedScreens,
                      used: row.estimatedCustomerUsage,
                      available: row.availableCapacity,
                      defaultValue: 'Capacity {{activated}} · Usage {{used}} · Available {{available}}'
                    })}
                  />
                  <Button size="small" variant="text" onClick={() => loadDiagnostics(row.subscriptionId)} sx={{ textTransform: 'none', fontWeight: 700 }}>
                    {t('subscriptionSharing.actions.viewDiagnostics', 'View diagnostics')}
                  </Button>
                </Stack>
              </Card>
            ))}
          </Stack>
        )}
      </MainCard>

      <MainCard title={t('subscriptionSharing.sections.notEligible', 'Not eligible right now')}>
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
              <Card key={`not-eligible-${row.subscriptionId}`} sx={sectionCardSx}>
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  spacing={1}
                  alignItems={{ xs: 'flex-start', md: 'center' }}
                  useFlexGap
                  flexWrap="wrap"
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                    #{row.subscriptionId} · {row.customerName || '-'}
                  </Typography>
                  <RoleChip role={row.sharingRole} t={t} />
                  <EligibilityChips
                    eligible={row.eligible}
                    eligibilityReason={row.eligibilityReason}
                    minimumEligibleMonths={row.minimumEligibleMonths}
                    t={t}
                  />
                  <Chip size="small" variant="outlined" label={`${t('subscriptionSharing.card.line', 'Line')}: ${row.lineId || '-'}`} />
                  <Chip size="small" variant="outlined" label={`${t('subscriptionSharing.card.provider', 'Provider')}: ${row.provider || '-'}`} />
                  <Chip size="small" variant="outlined" label={`${t('subscriptionSharing.card.status', 'Status')}: ${row.subscriptionStatus || '-'}`} />
                  <Chip
                    size="small"
                    variant="outlined"
                    label={t('subscriptionSharing.card.capacity', {
                      activated: row.activatedScreens,
                      used: row.estimatedCustomerUsage,
                      available: row.availableCapacity,
                      defaultValue: 'Capacity {{activated}} · Usage {{used}} · Available {{available}}'
                    })}
                  />
                  <Button size="small" variant="text" onClick={() => loadDiagnostics(row.subscriptionId)} sx={{ textTransform: 'none', fontWeight: 700 }}>
                    {t('subscriptionSharing.actions.viewDiagnostics', 'View diagnostics')}
                  </Button>
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
      >
        <DialogTitleWithClose
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

        <DialogContent dividers sx={{ px: { xs: 1.5, sm: 3 }, py: { xs: 1.5, sm: 2 } }}>
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
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} useFlexGap flexWrap="wrap">
                <RoleChip role={diagnosticsData.sharingRole} t={t} />
                <EligibilityChips
                  eligible={diagnosticsData.eligible}
                  eligibilityReason={diagnosticsData.eligibilityReason}
                  minimumEligibleMonths={diagnosticsData.minimumEligibleMonths}
                  t={t}
                />
                <Chip
                  size="small"
                  variant="outlined"
                  color={diagnosticsData.sharingActive ? 'success' : 'default'}
                  label={
                    diagnosticsData.sharingActive
                      ? t('subscriptionSharing.diagnostics.sharingActive', 'Active for sharing')
                      : t('subscriptionSharing.diagnostics.sharingInactive', 'Inactive for sharing')
                  }
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
                />
              </Stack>

              <Grid container spacing={1.25}>
                <Grid item xs={12} sm={6} md={4}>
                  <Card sx={sectionCardSx}>
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
                  <Card sx={sectionCardSx}>
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
                  <Card sx={sectionCardSx}>
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
                  <Card sx={sectionCardSx}>
                    <Typography variant="caption" color="text.secondary">
                      {t('subscriptionSharing.diagnostics.billing', 'Billing')}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      {diagnosticsData.billing || '-'}
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={sectionCardSx}>
                    <Typography variant="caption" color="text.secondary">
                      {t('subscriptionSharing.diagnostics.startDate', 'Start date')}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      {formatDate(diagnosticsData.startDate)}
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={sectionCardSx}>
                    <Typography variant="caption" color="text.secondary">
                      {t('subscriptionSharing.diagnostics.renewalDate', 'Renewal date')}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      {formatDate(diagnosticsData.renewalDate)}
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={sectionCardSx}>
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
                  <Card sx={sectionCardSx}>
                    <Typography variant="caption" color="text.secondary">
                      {t('subscriptionSharing.diagnostics.activatedScreens', 'Activated screens')}
                    </Typography>
                    <Typography variant="h4">{diagnosticsData.activatedScreens || 0}</Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card sx={sectionCardSx}>
                    <Typography variant="caption" color="text.secondary">
                      {t('subscriptionSharing.diagnostics.estimatedUsage', 'Estimated usage')}
                    </Typography>
                    <Typography variant="h4">{diagnosticsData.estimatedUsage || 0}</Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card sx={sectionCardSx}>
                    <Typography variant="caption" color="text.secondary">
                      {t('subscriptionSharing.diagnostics.availableCapacity', 'Available capacity')}
                    </Typography>
                    <Typography variant="h4">{diagnosticsData.availableCapacity || 0}</Typography>
                  </Card>
                </Grid>
              </Grid>

              <Stack spacing={1}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                  {t('subscriptionSharing.diagnostics.summaryTitle', 'Sharing summary')}
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} useFlexGap flexWrap="wrap">
                  <Chip
                    size="small"
                    variant="outlined"
                    label={`${t('subscriptionSharing.card.provider', 'Provider')}: ${diagnosticsData.provider || '-'}`}
                  />
                  <Chip
                    size="small"
                    variant="outlined"
                    label={`${t('subscriptionSharing.card.line', 'Line')}: ${diagnosticsData.lineId || '-'}`}
                  />
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
              </Stack>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: { xs: 1.5, sm: 3 }, py: 1.5 }}>
          <Button
            onClick={() => {
              setDiagnosticsOpen(false);
              setDiagnosticsData(null);
            }}
            variant="outlined"
            sx={{ textTransform: 'none', fontWeight: 700 }}
          >
            {t('actions.cancel', 'Cancel')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
