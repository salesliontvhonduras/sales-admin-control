import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuth from 'hooks/useAuth';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Skeleton from '@mui/material/Skeleton';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import RefreshIcon from '@mui/icons-material/Refresh';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import SyncProblemIcon from '@mui/icons-material/SyncProblem';
import TroubleshootIcon from '@mui/icons-material/Troubleshoot';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ScheduleIcon from '@mui/icons-material/Schedule';

import MainCard from 'ui-component/cards/MainCard';
import { PageErrorState, PageLoadingState } from 'ui-component/feedback/PageState';
import { gridSpacing } from 'store/constant';
import { withAlpha } from 'utils/colorUtils';
import { hasPermission } from 'utils/rbac';
import {
  enqueueSubscriptionExpiration,
  getSubscriptionExpirationJobDetail,
  listSubscriptionExpirationJobs,
  retrySubscriptionExpirationJob,
  runSubscriptionExpirationDetector,
  runSubscriptionExpirationWorker,
  useSubscriptionExpirationOverview
} from 'api/liontv-subscription-expiration';

const STATUS_OPTIONS = ['ATTENTION', 'PENDING', 'RETRY', 'MANUAL_PENDING', 'FAILED', 'COMPLETED', 'SKIPPED', 'IN_PROGRESS'];
const ATTENTION_STATUSES = new Set(['RETRY', 'MANUAL_PENDING', 'FAILED']);

function formatDateTime(value) {
  if (!value) return '-';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString();
}

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString();
}

function statusColor(status) {
  const normalized = String(status || '').toUpperCase();
  if (normalized === 'COMPLETED') return 'success';
  if (normalized === 'FAILED') return 'error';
  if (normalized === 'MANUAL_PENDING') return 'warning';
  if (normalized === 'RETRY') return 'info';
  if (normalized === 'IN_PROGRESS') return 'secondary';
  if (normalized === 'SKIPPED') return 'default';
  return 'primary';
}

function CycleCard({ title, cycle, stale, loading, onRun, runLabel, disabled }) {
  if (loading && !cycle) {
    return (
      <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
        <CardContent>
          <Skeleton variant="text" width="38%" height={30} />
          <Skeleton variant="text" width="62%" />
          <Skeleton variant="rectangular" height={86} sx={{ mt: 2, borderRadius: 2 }} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      variant="outlined"
      sx={(theme) => ({
        borderRadius: 3,
        height: '100%',
        borderColor: stale ? withAlpha(theme.palette.error.main, 0.45) : 'divider',
        backgroundImage: stale
          ? `linear-gradient(145deg, ${withAlpha(theme.palette.error.main, theme.palette.mode === 'dark' ? 0.18 : 0.1)} 0%, transparent 100%)`
          : 'none'
      })}
    >
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
          <Box>
            <Typography variant="overline" color="text.secondary">
              {title}
            </Typography>
            <Typography variant="h4">{cycle?.status || 'NO_DATA'}</Typography>
          </Box>
          <Chip
            size="small"
            color={stale ? 'error' : 'success'}
            label={stale ? 'STALE' : 'OK'}
            icon={stale ? <WarningAmberIcon fontSize="small" /> : <CheckCircleOutlineIcon fontSize="small" />}
          />
        </Stack>

        <Stack spacing={0.75} sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {`Inicio: ${formatDateTime(cycle?.startedAt)}`}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {`Fin: ${formatDateTime(cycle?.finishedAt)}`}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {`Estado: ${cycle?.status || '-'}`}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {`Error: ${cycle?.errorMessage || '-'}`}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} sx={{ mt: 2 }} flexWrap="wrap" useFlexGap>
          {typeof cycle?.candidatesFound === 'number' ? <Chip size="small" label={`Candidatos ${cycle.candidatesFound}`} variant="outlined" /> : null}
          {typeof cycle?.jobsEnqueued === 'number' ? <Chip size="small" label={`Encolados ${cycle.jobsEnqueued}`} variant="outlined" /> : null}
          {typeof cycle?.claimedJobs === 'number' ? <Chip size="small" label={`Tomados ${cycle.claimedJobs}`} variant="outlined" /> : null}
          {typeof cycle?.completedJobs === 'number' ? <Chip size="small" label={`OK ${cycle.completedJobs}`} variant="outlined" /> : null}
          {typeof cycle?.manualPendingJobs === 'number' ? <Chip size="small" label={`Manual ${cycle.manualPendingJobs}`} variant="outlined" /> : null}
          {typeof cycle?.retriedJobs === 'number' ? <Chip size="small" label={`Retry ${cycle.retriedJobs}`} variant="outlined" /> : null}
          {typeof cycle?.failedJobs === 'number' ? <Chip size="small" label={`Failed ${cycle.failedJobs}`} variant="outlined" /> : null}
          {typeof cycle?.staleReleased === 'number' ? <Chip size="small" label={`Locks ${cycle.staleReleased}`} variant="outlined" /> : null}
        </Stack>

        <Button
          variant="contained"
          color={stale ? 'error' : 'primary'}
          startIcon={<PlayArrowIcon />}
          onClick={onRun}
          disabled={disabled}
          sx={{ mt: 2.5, borderRadius: 2.5, textTransform: 'none', fontWeight: 700 }}
        >
          {runLabel}
        </Button>
      </CardContent>
    </Card>
  );
}

function JobStatusChip({ status }) {
  return <Chip size="small" color={statusColor(status)} label={String(status || '-').toUpperCase()} sx={{ fontWeight: 700 }} />;
}

export default function SubscriptionExpirationLionTv() {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { accessToken, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const canOperate = hasPermission(user, { any: ['LIONTV_SUBSCRIPTION_EXPIRATION_OPERATE', 'ROLE_LIONTV_SUBSCRIPTION_EXPIRATION_OPERATE'] });

  const seededSubscriptionId = searchParams.get('subscriptionId') || '';
  const [filters, setFilters] = useState({
    status: 'ATTENTION',
    subscriptionId: seededSubscriptionId,
    customerId: '',
    username: '',
    dateFrom: '',
    dateTo: ''
  });
  const [jobsPayload, setJobsPayload] = useState({ data: [], total: 0 });
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsError, setJobsError] = useState('');
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [actionKey, setActionKey] = useState('');

  const {
    data: overview,
    error: overviewError,
    isLoading: overviewLoading,
    refresh: refreshOverview
  } = useSubscriptionExpirationOverview({
    enabled: Boolean(accessToken)
  });

  const loadJobs = useCallback(async () => {
    if (!accessToken) return;
    setJobsLoading(true);
    setJobsError('');
    try {
      const payload = await listSubscriptionExpirationJobs({
        status: filters.status !== 'ATTENTION' ? filters.status : undefined,
        subscriptionId: filters.subscriptionId || undefined,
        customerId: filters.customerId || undefined,
        username: filters.username || undefined,
        dateFrom: filters.dateFrom || undefined,
        dateTo: filters.dateTo || undefined,
        index: 0,
        size: 200
      });
      setJobsPayload(payload || { data: [], total: 0 });
    } catch (error) {
      const message = error?.response?.data?.message || t('subscriptionExpiration.errors.loadJobs', 'No se pudieron cargar los jobs.');
      setJobsError(message);
    } finally {
      setJobsLoading(false);
    }
  }, [accessToken, filters, t]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const filteredJobs = useMemo(() => {
    const rows = Array.isArray(jobsPayload?.data) ? jobsPayload.data : [];
    if (filters.status !== 'ATTENTION') return rows;
    return rows.filter((item) => ATTENTION_STATUSES.has(String(item.status || '').toUpperCase()));
  }, [filters.status, jobsPayload?.data]);

  const criticalCount = Number(overview?.statusCounts?.failed || 0) + Number(overview?.statusCounts?.manualPending || 0);
  const stale = Boolean(overview?.detectorStale || overview?.workerStale);

  const openDetail = useCallback(
    async (jobId) => {
      if (!jobId) return;
      setDrawerOpen(true);
      setDetailLoading(true);
      try {
        const payload = await getSubscriptionExpirationJobDetail(jobId);
        setDetail(payload);
      } catch (error) {
        enqueueSnackbar(error?.response?.data?.message || t('subscriptionExpiration.errors.loadDetail', 'No se pudo cargar el detalle del job.'), {
          variant: 'error'
        });
        setDrawerOpen(false);
      } finally {
        setDetailLoading(false);
      }
    },
    [enqueueSnackbar, t]
  );

  const runAction = useCallback(
    async (key, handler, successMessage) => {
      setActionKey(key);
      try {
        await handler();
        enqueueSnackbar(successMessage, { variant: 'success' });
        refreshOverview();
        loadJobs();
        if (detail?.job?.jobId) {
          const updatedDetail = await getSubscriptionExpirationJobDetail(detail.job.jobId);
          setDetail(updatedDetail);
        }
      } catch (error) {
        enqueueSnackbar(error?.response?.data?.message || t('subscriptionExpiration.errors.actionFailed', 'No se pudo completar la acción.'), {
          variant: 'error'
        });
      } finally {
        setActionKey('');
      }
    },
    [detail?.job?.jobId, enqueueSnackbar, loadJobs, refreshOverview, t]
  );

  const handleRetryJob = useCallback(
    async (jobId) => {
      await runAction(
        `retry:${jobId}`,
        () => retrySubscriptionExpirationJob(jobId),
        t('subscriptionExpiration.actions.retrySuccess', 'Job reintentado correctamente.')
      );
    },
    [runAction, t]
  );

  const handleEnqueueSubscription = useCallback(
    async (subscriptionId) => {
      if (!subscriptionId) {
        enqueueSnackbar(t('subscriptionExpiration.errors.subscriptionRequired', 'Indica un subscriptionId para reencolar.'), { variant: 'warning' });
        return;
      }
      await runAction(
        `enqueue:${subscriptionId}`,
        () => enqueueSubscriptionExpiration(subscriptionId),
        t('subscriptionExpiration.actions.enqueueSuccess', 'Suscripción reencolada correctamente.')
      );
    },
    [enqueueSnackbar, runAction, t]
  );

  if (overviewLoading && !overview) {
    return <PageLoadingState label={t('subscriptionExpiration.loading', 'Cargando monitoreo de expiraciones...')} />;
  }

  if (overviewError && !overview) {
    return (
      <PageErrorState
        message={overviewError?.response?.data?.message || t('subscriptionExpiration.errors.loadOverview', 'No se pudo cargar el overview.')}
        onRetry={() => refreshOverview()}
      />
    );
  }

  return (
    <Box sx={{ width: '100%', maxWidth: { xs: '100%', xl: 1500 }, mx: 'auto' }}>
      <MainCard
        title={t('subscriptionExpiration.title', 'Subscription expiration monitoring')}
        secondary={
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => {
                refreshOverview();
                loadJobs();
              }}
              sx={{ borderRadius: 2.5, textTransform: 'none', fontWeight: 700 }}
            >
              {t('actions.refresh', 'Refresh')}
            </Button>
            <Button
              variant="contained"
              color="secondary"
              startIcon={actionKey === 'run:detector' ? <CircularProgress size={14} color="inherit" /> : <SyncProblemIcon />}
              onClick={() => runAction('run:detector', runSubscriptionExpirationDetector, t('subscriptionExpiration.actions.detectorSuccess', 'Detector ejecutado correctamente.'))}
              disabled={!canOperate || Boolean(actionKey)}
              sx={{ borderRadius: 2.5, textTransform: 'none', fontWeight: 700 }}
            >
              {t('subscriptionExpiration.actions.runDetector', 'Run detector')}
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={actionKey === 'run:worker' ? <CircularProgress size={14} color="inherit" /> : <TroubleshootIcon />}
              onClick={() => runAction('run:worker', runSubscriptionExpirationWorker, t('subscriptionExpiration.actions.workerSuccess', 'Worker ejecutado correctamente.'))}
              disabled={!canOperate || Boolean(actionKey)}
              sx={{ borderRadius: 2.5, textTransform: 'none', fontWeight: 700 }}
            >
              {t('subscriptionExpiration.actions.runWorker', 'Run worker')}
            </Button>
          </Stack>
        }
      >
        <Stack spacing={2.25}>
          <Alert severity="info" variant="outlined">
            {t(
              'subscriptionExpiration.subtitle',
              'Panel operativo para saber por qué una subscription no expiró, no removió playlists o quedó pendiente de acción manual.'
            )}
          </Alert>

          {stale ? (
            <Alert severity="error" icon={<WarningAmberIcon />} sx={{ borderRadius: 2.5 }}>
              {t(
                'subscriptionExpiration.staleBanner',
                'El scheduler está stale. Revisa los ciclos del detector y worker; este proceso es crítico para expirar subscriptions y remover playlists.'
              )}
            </Alert>
          ) : null}

          <Grid container spacing={gridSpacing}>
            <Grid size={{ xs: 12, md: 6 }}>
              <CycleCard
                title={t('subscriptionExpiration.cards.detector', 'Detector')}
                cycle={overview?.detector}
                stale={Boolean(overview?.detectorStale)}
                loading={overviewLoading}
                onRun={() =>
                  runAction('run:detector', runSubscriptionExpirationDetector, t('subscriptionExpiration.actions.detectorSuccess', 'Detector ejecutado correctamente.'))
                }
                runLabel={t('subscriptionExpiration.actions.runDetector', 'Run detector')}
                disabled={!canOperate || Boolean(actionKey)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <CycleCard
                title={t('subscriptionExpiration.cards.worker', 'Worker')}
                cycle={overview?.worker}
                stale={Boolean(overview?.workerStale)}
                loading={overviewLoading}
                onRun={() =>
                  runAction('run:worker', runSubscriptionExpirationWorker, t('subscriptionExpiration.actions.workerSuccess', 'Worker ejecutado correctamente.'))
                }
                runLabel={t('subscriptionExpiration.actions.runWorker', 'Run worker')}
                disabled={!canOperate || Boolean(actionKey)}
              />
            </Grid>
          </Grid>

          <Grid container spacing={gridSpacing}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="overline" color="text.secondary">
                      {t('subscriptionExpiration.metrics.attention', 'Attention jobs')}
                    </Typography>
                    <ErrorOutlineIcon color="error" fontSize="small" />
                  </Stack>
                  <Typography variant="h2" sx={{ mt: 1 }}>
                    {criticalCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('subscriptionExpiration.metrics.attentionHelper', 'FAILED + MANUAL_PENDING')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="overline" color="text.secondary">
                      {t('subscriptionExpiration.metrics.retry', 'Retry queue')}
                    </Typography>
                    <RestartAltIcon color="info" fontSize="small" />
                  </Stack>
                  <Typography variant="h2" sx={{ mt: 1 }}>
                    {overview?.statusCounts?.retry ?? 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('subscriptionExpiration.metrics.retryHelper', 'Jobs listos para otro intento')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="overline" color="text.secondary">
                      {t('subscriptionExpiration.metrics.blockers', 'Blockers')}
                    </Typography>
                    <WarningAmberIcon color="warning" fontSize="small" />
                  </Stack>
                  <Typography variant="h2" sx={{ mt: 1 }}>
                    {(overview?.blockerCounts?.missingCredentials ?? 0) + (overview?.blockerCounts?.unsupportedProvider ?? 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('subscriptionExpiration.metrics.blockersHelper', 'Credenciales faltantes + provider no soportado')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="overline" color="text.secondary">
                      {t('subscriptionExpiration.metrics.noLicenses', 'No licenses')}
                    </Typography>
                    <ScheduleIcon color="secondary" fontSize="small" />
                  </Stack>
                  <Typography variant="h2" sx={{ mt: 1 }}>
                    {overview?.blockerCounts?.noLicenses ?? 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('subscriptionExpiration.metrics.noLicensesHelper', 'Eventos auditados sin licencias ligadas')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              <Grid container spacing={gridSpacing}>
                <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                  <TextField
                    select
                    label={t('common.status', 'Status')}
                    value={filters.status}
                    onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value }))}
                    fullWidth
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                  <TextField
                    label={t('subscriptions.fields.subscriptionId', 'Subscription ID')}
                    value={filters.subscriptionId}
                    onChange={(event) => setFilters((prev) => ({ ...prev, subscriptionId: event.target.value }))}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                  <TextField
                    label={t('customers.customerId', 'Customer ID')}
                    value={filters.customerId}
                    onChange={(event) => setFilters((prev) => ({ ...prev, customerId: event.target.value }))}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                  <TextField
                    label={t('common.username', 'Username')}
                    value={filters.username}
                    onChange={(event) => setFilters((prev) => ({ ...prev, username: event.target.value }))}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                  <TextField
                    type="date"
                    label={t('common.dateFrom', 'Date from')}
                    value={filters.dateFrom}
                    onChange={(event) => setFilters((prev) => ({ ...prev, dateFrom: event.target.value }))}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                  <TextField
                    type="date"
                    label={t('common.dateTo', 'Date to')}
                    value={filters.dateTo}
                    onChange={(event) => setFilters((prev) => ({ ...prev, dateTo: event.target.value }))}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid size={12}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                    <Button
                      variant="contained"
                      startIcon={jobsLoading ? <CircularProgress size={14} color="inherit" /> : <RefreshIcon />}
                      onClick={loadJobs}
                      disabled={jobsLoading}
                      sx={{ borderRadius: 2.5, textTransform: 'none', fontWeight: 700 }}
                    >
                      {t('actions.search', 'Search')}
                    </Button>
                    <Button
                      variant="outlined"
                      color="warning"
                      startIcon={actionKey === `enqueue:${filters.subscriptionId}` ? <CircularProgress size={14} color="inherit" /> : <PlayArrowIcon />}
                      onClick={() => handleEnqueueSubscription(filters.subscriptionId)}
                      disabled={!canOperate || !filters.subscriptionId || Boolean(actionKey)}
                      sx={{ borderRadius: 2.5, textTransform: 'none', fontWeight: 700 }}
                    >
                      {t('subscriptionExpiration.actions.enqueueSubscription', 'Enqueue subscription')}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {jobsError ? <Alert severity="error">{jobsError}</Alert> : null}

          <Card variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <CardContent sx={{ p: 0 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 2, py: 1.5 }}>
                <Typography variant="h4">{t('subscriptionExpiration.table.title', 'Critical jobs queue')}</Typography>
                <Chip label={`${filteredJobs.length}`} color={filteredJobs.length > 0 ? 'warning' : 'success'} />
              </Stack>
              <Divider />
              {jobsLoading ? (
                <Box sx={{ p: 2 }}>
                  <PageLoadingState label={t('subscriptionExpiration.loadingJobs', 'Cargando jobs críticos...')} />
                </Box>
              ) : filteredJobs.length === 0 ? (
                <Box sx={{ p: 3 }}>
                  <Alert severity="success" variant="outlined">
                    {t('subscriptionExpiration.states.empty', 'No hay jobs críticos con los filtros actuales.')}
                  </Alert>
                </Box>
              ) : isMobile ? (
                <Stack spacing={1.5} sx={{ p: 2 }}>
                  {filteredJobs.map((job) => (
                    <Card key={job.jobId} variant="outlined" sx={{ borderRadius: 2.5 }}>
                      <CardContent>
                        <Stack spacing={1}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="subtitle1">{`Job #${job.jobId}`}</Typography>
                            <JobStatusChip status={job.status} />
                          </Stack>
                          <Typography variant="body2" color="text.secondary">{`Sub #${job.subscriptionId} · Cust #${job.customerId}`}</Typography>
                          <Typography variant="body2" color="text.secondary">{`Renewal ${formatDate(job.renewalDate)}`}</Typography>
                          <Typography variant="body2" color="text.secondary">{job.manualReason || job.lastErrorCode || '-'}</Typography>
                          <Stack direction="row" spacing={1}>
                            <Button size="small" startIcon={<VisibilityOutlinedIcon />} onClick={() => openDetail(job.jobId)}>
                              {t('actions.view', 'View')}
                            </Button>
                            <Button
                              size="small"
                              color="warning"
                              startIcon={<RestartAltIcon />}
                              onClick={() => handleRetryJob(job.jobId)}
                              disabled={!canOperate || Boolean(actionKey)}
                            >
                              {t('subscriptionExpiration.actions.retry', 'Retry')}
                            </Button>
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              ) : (
                <TableContainer component={Paper} elevation={0}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>{t('common.job', 'Job')}</TableCell>
                        <TableCell>{t('subscriptions.fields.subscriptionId', 'Subscription')}</TableCell>
                        <TableCell>{t('customers.customerId', 'Customer')}</TableCell>
                        <TableCell>{t('common.status', 'Status')}</TableCell>
                        <TableCell>{t('common.reason', 'Reason')}</TableCell>
                        <TableCell>{t('common.error', 'Error')}</TableCell>
                        <TableCell>{t('common.nextAttempt', 'Next attempt')}</TableCell>
                        <TableCell align="right">{t('common.actions', 'Actions')}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredJobs.map((job) => (
                        <TableRow hover key={job.jobId}>
                          <TableCell>{job.jobId}</TableCell>
                          <TableCell>{job.subscriptionId}</TableCell>
                          <TableCell>{job.customerId}</TableCell>
                          <TableCell>
                            <JobStatusChip status={job.status} />
                          </TableCell>
                          <TableCell>{job.manualReason || '-'}</TableCell>
                          <TableCell>{job.lastErrorCode || job.lastErrorMessage || '-'}</TableCell>
                          <TableCell>{formatDateTime(job.nextAttemptAt)}</TableCell>
                          <TableCell align="right">
                            <Stack direction="row" justifyContent="flex-end" spacing={1}>
                              <Button size="small" startIcon={<VisibilityOutlinedIcon />} onClick={() => openDetail(job.jobId)}>
                                {t('actions.view', 'View')}
                              </Button>
                              <Button
                                size="small"
                                color="warning"
                                startIcon={<RestartAltIcon />}
                                onClick={() => handleRetryJob(job.jobId)}
                                disabled={!canOperate || Boolean(actionKey)}
                              >
                                {t('subscriptionExpiration.actions.retry', 'Retry')}
                              </Button>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Stack>
      </MainCard>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)} PaperProps={{ sx: { width: { xs: '100%', md: 560 } } }}>
        <Box sx={{ p: 2.5 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Box>
              <Typography variant="h4">{t('subscriptionExpiration.drawer.title', 'Job diagnostics')}</Typography>
              <Typography variant="body2" color="text.secondary">
                {detail?.job?.jobId ? `Job #${detail.job.jobId}` : ''}
              </Typography>
            </Box>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Stack>

          {detailLoading ? (
            <PageLoadingState label={t('subscriptionExpiration.loadingDetail', 'Cargando detalle del job...')} />
          ) : !detail ? (
            <Alert severity="info">{t('subscriptionExpiration.states.noDetail', 'Selecciona un job para ver su timeline y snapshot operativo.')}</Alert>
          ) : (
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <JobStatusChip status={detail.job?.status} />
                <Chip size="small" label={`Sub #${detail.subscriptionId}`} />
                <Chip size="small" label={`Cust #${detail.customerId}`} />
                <Chip size="small" label={detail.username || '-'} />
              </Stack>

              <Alert severity={detail.providerSupported && detail.credentialFound && detail.licensesFound ? 'success' : 'warning'} variant="outlined">
                {`licensesFound=${detail.licensesFound} · providerSupported=${detail.providerSupported} · credentialFound=${detail.credentialFound}`}
              </Alert>

              <Card variant="outlined" sx={{ borderRadius: 2.5 }}>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    {t('subscriptionExpiration.drawer.summary', 'Subscription snapshot')}
                  </Typography>
                  <Stack spacing={0.75}>
                    <Typography variant="body2" color="text.secondary">{`Status: ${detail.subscriptionStatus || '-'}`}</Typography>
                    <Typography variant="body2" color="text.secondary">{`Line: ${detail.lineId || '-'}`}</Typography>
                    <Typography variant="body2" color="text.secondary">{`Customer: ${detail.customerName || '-'} · ${detail.customerEmail || '-'}`}</Typography>
                    <Typography variant="body2" color="text.secondary">{`Reason: ${detail.job?.manualReason || detail.job?.lastErrorCode || '-'}`}</Typography>
                    <Typography variant="body2" color="text.secondary">{`Error: ${detail.job?.lastErrorMessage || '-'}`}</Typography>
                  </Stack>
                </CardContent>
              </Card>

              <Card variant="outlined" sx={{ borderRadius: 2.5 }}>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    {t('subscriptionExpiration.drawer.licenses', 'Licenses affected')}
                  </Typography>
                  <Stack spacing={1}>
                    {detail.licenses?.length ? (
                      detail.licenses.map((license) => (
                        <Box
                          key={license.licenseId}
                          sx={{
                            p: 1.25,
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            bgcolor: 'background.default'
                          }}
                        >
                          <Stack direction="row" justifyContent="space-between" spacing={1}>
                            <Box>
                              <Typography variant="subtitle2">{`${license.app || '-'} · #${license.licenseId}`}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {`${license.provider} · ${license.macAddress || 'sin MAC'}`}
                              </Typography>
                            </Box>
                            <Chip size="small" label={license.status || '-'} color={statusColor(license.status)} />
                          </Stack>
                          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
                            <Chip size="small" variant="outlined" label={`providerSupported=${license.providerSupported}`} />
                            <Chip size="small" variant="outlined" label={`credentialFound=${license.credentialFound}`} />
                            <Chip size="small" variant="outlined" label={`contextValid=${license.contextValid}`} />
                          </Stack>
                        </Box>
                      ))
                    ) : (
                      <Alert severity="warning" variant="outlined">
                        {t('subscriptionExpiration.drawer.noLicenses', 'No hay licencias ligadas a esta subscription.')}
                      </Alert>
                    )}
                  </Stack>
                </CardContent>
              </Card>

              <Card variant="outlined" sx={{ borderRadius: 2.5 }}>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    {t('subscriptionExpiration.drawer.timeline', 'Audit timeline')}
                  </Typography>
                  <Stack spacing={1}>
                    {detail.audit?.length ? (
                      detail.audit.map((entry) => (
                        <Box
                          key={entry.auditId}
                          sx={{
                            p: 1.25,
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: withAlpha(theme.palette.primary.main, 0.18),
                            bgcolor: 'background.default'
                          }}
                        >
                          <Stack direction="row" justifyContent="space-between" spacing={1} alignItems="center">
                            <Typography variant="subtitle2">{entry.eventType}</Typography>
                            <Chip size="small" label={entry.eventStatus} color={statusColor(entry.eventStatus)} />
                          </Stack>
                          <Typography variant="caption" color="text.secondary">
                            {`${formatDateTime(entry.createdAt)} · ${entry.entityType} · ${entry.providerApp || '-'}`}
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 0.75 }}>
                            {entry.message || '-'}
                          </Typography>
                          {entry.payloadJson ? (
                            <Typography component="pre" variant="caption" sx={{ mt: 1, whiteSpace: 'pre-wrap', wordBreak: 'break-word', m: 0 }}>
                              {entry.payloadJson}
                            </Typography>
                          ) : null}
                        </Box>
                      ))
                    ) : (
                      <Alert severity="info" variant="outlined">
                        {t('subscriptionExpiration.drawer.noAudit', 'No hay auditoría registrada para este job.')}
                      </Alert>
                    )}
                  </Stack>
                </CardContent>
              </Card>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                <Button
                  variant="contained"
                  color="warning"
                  startIcon={actionKey === `retry:${detail.job?.jobId}` ? <CircularProgress size={14} color="inherit" /> : <RestartAltIcon />}
                  onClick={() => handleRetryJob(detail.job?.jobId)}
                  disabled={!canOperate || !detail.job?.jobId || Boolean(actionKey)}
                  sx={{ borderRadius: 2.5, textTransform: 'none', fontWeight: 700 }}
                >
                  {t('subscriptionExpiration.actions.retry', 'Retry')}
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={
                    actionKey === `enqueue:${detail.subscriptionId}` ? <CircularProgress size={14} color="inherit" /> : <PlayArrowIcon />
                  }
                  onClick={() => handleEnqueueSubscription(detail.subscriptionId)}
                  disabled={!canOperate || !detail.subscriptionId || Boolean(actionKey)}
                  sx={{ borderRadius: 2.5, textTransform: 'none', fontWeight: 700 }}
                >
                  {t('subscriptionExpiration.actions.enqueueSubscription', 'Enqueue subscription')}
                </Button>
                <Button
                  variant="text"
                  startIcon={<VisibilityOutlinedIcon />}
                  onClick={() => navigate(`/liontv/subscriptions?subscriptionId=${detail.subscriptionId}`)}
                  sx={{ borderRadius: 2.5, textTransform: 'none', fontWeight: 700 }}
                >
                  {t('subscriptionExpiration.actions.openSubscription', 'Open subscription')}
                </Button>
              </Stack>
            </Stack>
          )}
        </Box>
      </Drawer>
    </Box>
  );
}
