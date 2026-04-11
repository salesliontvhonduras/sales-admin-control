import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import useAuth from 'hooks/useAuth';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Tooltip from '@mui/material/Tooltip';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import SearchIcon from '@mui/icons-material/Search';
import MapIcon from '@mui/icons-material/Map';
import PublicIcon from '@mui/icons-material/Public';
import LinkIcon from '@mui/icons-material/Link';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CancelIcon from '@mui/icons-material/Cancel';
import RefreshIcon from '@mui/icons-material/Refresh';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import LanIcon from '@mui/icons-material/Lan';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TrafficIcon from '@mui/icons-material/Traffic';

import MainCard from 'ui-component/cards/MainCard';
import LionMetricCard from 'ui-component/cards/LionMetricCard';
import { gridSpacing } from 'store/constant';
import { lionTvApi } from 'utils/api';

const glassCard = (theme) => ({
  p: 2,
  borderRadius: 2.5,
  border: '1px solid',
  borderColor: theme.palette.divider,
  boxShadow: '0 18px 38px rgba(0,0,0,0.10)',
  backdropFilter: 'blur(6px)',
  background:
    theme.palette.mode === 'light'
      ? `linear-gradient(135deg, ${theme.palette.primary.light}22 0%, ${theme.palette.secondary.light}12 45%, ${theme.palette.background.paper} 100%)`
      : `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.primary.dark}30 100%)`
});

const countryOptions = [
  { code: 'GLOBAL', label: 'Global', flag: '🌐' },
  { code: 'HN', label: 'Honduras', flag: '🇭🇳' },
  { code: 'SV', label: 'El Salvador', flag: '🇸🇻' },
  { code: 'GT', label: 'Guatemala', flag: '🇬🇹' },
  { code: 'NI', label: 'Nicaragua', flag: '🇳🇮' },
  { code: 'BZ', label: 'Belice', flag: '🇧🇿' },
  { code: 'PA', label: 'Panamá', flag: '🇵🇦' },
  { code: 'CR', label: 'Costa Rica', flag: '🇨🇷' },
  { code: 'MX', label: 'México', flag: '🇲🇽' },
  { code: 'AR', label: 'Argentina', flag: '🇦🇷' },
  { code: 'CA', label: 'Canadá', flag: '🇨🇦' },
  { code: 'US', label: 'Estados Unidos', flag: '🇺🇸' },
  { code: 'ES', label: 'España', flag: '🇪🇸' },
  { code: 'CO', label: 'Colombia', flag: '🇨🇴' }
];

const statusIcon = {
  ACTIVE: <CheckCircleOutlineIcon fontSize="small" color="success" />,
  ACTIVATED: <CheckCircleOutlineIcon fontSize="small" color="success" />,
  INACTIVE: <CancelIcon fontSize="small" color="warning" />,
  PENDING: <PendingActionsIcon fontSize="small" color="warning" />,
  EXPIRED: <CancelIcon fontSize="small" color="error" />,
  CANCELLED: <CancelIcon fontSize="small" color="error" />
};

const countryLabel = (code) => countryOptions.find((c) => c.code === code)?.label || code || 'Global';
const countryFlag = (code) => countryOptions.find((c) => c.code === code)?.flag || '🌐';
const formatDate = (val) => {
  if (!val) return '-';
  const d = new Date(val.replace(' ', 'T'));
  return Number.isNaN(d.getTime()) ? val : d.toLocaleDateString();
};

const normalizePlusStatus = (value) => {
  const raw = String(value ?? '').trim().toUpperCase();
  if (!raw) return 'UNKNOWN';
  if (raw === '1' || raw === 'TRUE' || raw === 'ACTIVE' || raw === 'ACTIVA' || raw === 'ENABLED') return 'ACTIVE';
  if (raw === '0' || raw === 'FALSE' || raw === 'INACTIVE' || raw === 'INACTIVA' || raw === 'DISABLED') return 'INACTIVE';
  if (raw.includes('EXPIRED') || raw.includes('EXPIR')) return 'EXPIRED';
  if (raw.includes('CANCEL')) return 'CANCELLED';
  if (raw.includes('PEND')) return 'PENDING';
  return raw;
};

const statusLabelOf = (value, t) => {
  const normalized = normalizePlusStatus(value);
  if (normalized === 'ACTIVE') return t('lines.status.active', 'Active');
  if (normalized === 'INACTIVE') return t('lines.status.inactive', 'Inactive');
  if (normalized === 'EXPIRED') return t('lines.status.expired', 'Expired');
  if (normalized === 'PENDING') return t('plusLines.status.pending', 'Pending');
  if (normalized === 'CANCELLED') return t('plusLines.status.cancelled', 'Cancelled');
  return String(value ?? 'UNKNOWN');
};

const activeSubscriptionsOf = (item) => Number(item?.activeSubscriptions ?? item?.subscriptions ?? 0);
const totalSubscriptionsRawOf = (item) => Number(item?.totalSubscriptions ?? item?.subscriptions ?? Number.NaN);
const inactiveSubscriptionsOf = (item) => {
  const inactiveRaw = Number(item?.inactiveSubscriptions ?? Number.NaN);
  const active = activeSubscriptionsOf(item);
  const totalRaw = totalSubscriptionsRawOf(item);
  if (Number.isFinite(totalRaw)) {
    const byDiff = Math.max(totalRaw - active, 0);
    if (!Number.isFinite(inactiveRaw)) return byDiff;
    return Math.min(Math.max(inactiveRaw, 0), byDiff);
  }
  return Number.isFinite(inactiveRaw) ? Math.max(inactiveRaw, 0) : 0;
};
const totalSubscriptionsOf = (item) => {
  const totalRaw = totalSubscriptionsRawOf(item);
  if (Number.isFinite(totalRaw)) {
    return Math.max(totalRaw, activeSubscriptionsOf(item) + inactiveSubscriptionsOf(item));
  }
  return activeSubscriptionsOf(item) + inactiveSubscriptionsOf(item);
};
const isUnusedPlusLine = (item) => activeSubscriptionsOf(item) === 0;

// Semáforo: estima uso real aplicando 30% de concurrencia sobre la suma de primarias.
function semaphoreColor(maxConnectionsPlus, sumPrimaryConnections, t) {
  const plus = maxConnectionsPlus || 1; // evita /0
  const primaries = sumPrimaryConnections || 0;
  const estimatedActive = primaries * 0.3; // 30% concurrencia
  const pct = Math.min(100, Math.round((estimatedActive / plus) * 100));
  if (pct <= 30) return { color: 'success', label: t('plusLines.semaphore.green', 'Green · {{pct}}%', { pct }) };
  if (pct <= 60) return { color: 'warning', label: t('plusLines.semaphore.yellow', 'Yellow · {{pct}}%', { pct }) };
  return { color: 'error', label: t('plusLines.semaphore.red', 'Red · {{pct}}%', { pct }) };
}

export default function PlusLinesExplorer() {
  const { enqueueSnackbar } = useSnackbar();
  const { accessToken } = useAuth();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [summary, setSummary] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [lines, setLines] = useState([]);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingLines, setLoadingLines] = useState(false);
  const [search, setSearch] = useState('');
  const [lineSearch, setLineSearch] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUnauthorized = (err) => {
    const status = err?.response?.status || err?.request?.status;
    return status === 401;
  };

  const loadSummary = useCallback(async () => {
    if (!accessToken) return;
    setLoadingSummary(true);
      try {
        const res = await lionTvApi.get('/plus-lines/summary', {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: { q: search || undefined },
          skipAuthRedirect: true
        });
        setSummary(Array.isArray(res?.data?.data) ? res.data.data : []);
      } catch (err) {
        if (!handleUnauthorized(err)) {
          enqueueSnackbar(err?.response?.data?.message || err.message || t('plusLines.errors.summaryLoad', 'Could not load summary.'), {
            variant: 'error'
          });
        }
      } finally {
        setLoadingSummary(false);
      }
  }, [accessToken, enqueueSnackbar, search, t]);

  const loadLines = useCallback(async () => {
    if (!selectedCountry) {
      setLines([]);
      return;
    }
    setLoadingLines(true);
      try {
        const res = await lionTvApi.get('/plus-lines/by-country', {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: { country: selectedCountry, q: lineSearch || undefined },
          skipAuthRedirect: true
        });
        setLines(Array.isArray(res?.data?.data) ? res.data.data : []);
      } catch (err) {
        if (!handleUnauthorized(err)) {
          enqueueSnackbar(err?.response?.data?.message || err.message || t('plusLines.errors.linesLoad', 'Could not load plus lines.'), {
            variant: 'error'
          });
        }
      } finally {
        setLoadingLines(false);
      }
  }, [accessToken, enqueueSnackbar, selectedCountry, lineSearch, t]);

  useEffect(() => {
    loadSummary();
  }, [loadSummary, refreshKey]);

  useEffect(() => {
    loadLines();
  }, [loadLines]);

  const summaryWithFlags = useMemo(() => {
    if (!summary.length) {
      return countryOptions.map((c) => ({
        country: c.code,
        plusLines: 0,
        subscriptions: 0,
        activeSubscriptions: 0,
        inactiveSubscriptions: 0,
        unusedPlusLines: 0,
        flag: c.flag
      }));
    }
    return summary.map((s) => ({ ...s, flag: countryFlag(s.country) }));
  }, [summary]);

  const totalLines = summary.reduce((acc, s) => acc + (s.plusLines || 0), 0);
  const totalActiveSubs = summary.reduce((acc, s) => acc + activeSubscriptionsOf(s), 0);
  const totalInactiveSubs = summary.reduce((acc, s) => acc + inactiveSubscriptionsOf(s), 0);
  const totalUnusedLines = summary.reduce((acc, s) => acc + Number(s.unusedPlusLines || 0), 0);
  const unusedLines = useMemo(() => lines.filter((line) => isUnusedPlusLine(line)), [lines]);
  const activeLines = useMemo(() => lines.filter((line) => !isUnusedPlusLine(line)), [lines]);

  return (
    <Box sx={{ width: '100%', maxWidth: { xs: '100%', xl: 1400 }, mx: 'auto' }}>
      <MainCard title={t('plusLines.title', 'Plus Lines Explorer')} secondary={null}>
        <Grid container spacing={gridSpacing}>
          {[
            { title: t('plusLines.cards.countries', 'Países con líneas plus'), value: summary.length, icon: <MapIcon />, color: '#1e88e5' },
            { title: t('plusLines.cards.lines', 'Líneas plus'), value: totalLines, icon: <LanIcon />, color: '#7e57c2' },
            { title: t('plusLines.cards.activeSubs', 'Suscripciones activas'), value: totalActiveSubs, icon: <PeopleAltIcon />, color: '#039be5' },
            { title: t('plusLines.cards.unusedLines', 'Líneas sin uso activo'), value: totalUnusedLines, icon: <PendingActionsIcon />, color: '#fb8c00' },
            { title: t('plusLines.cards.inactiveSubs', 'Suscripciones inactivas'), value: totalInactiveSubs, icon: <CancelIcon />, color: '#ef5350' }
          ].map((item, idx) => (
            <Grid item xs={12} sm={6} md={4} lg={2} key={idx}>
              <LionMetricCard {...item} />
            </Grid>
          ))}
        </Grid>
      </MainCard>

      <MainCard title={t('plusLines.mapTitle', 'Mapa por país')}>
        <Grid container spacing={2}>
          {loadingSummary &&
            Array.from({ length: 6 }).map((_, idx) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
                <Skeleton variant="rectangular" height={90} sx={{ borderRadius: 2 }} />
              </Grid>
            ))}

          {!loadingSummary &&
            summaryWithFlags.map((item) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={item.country}>
                <Card
                  onClick={() => setSelectedCountry(item.country)}
                  sx={(theme) => ({
                    cursor: 'pointer',
                    ...glassCard(theme),
                    p: 1.5,
                    borderColor: selectedCountry === item.country ? theme.palette.primary.main : 'divider',
                    boxShadow: selectedCountry === item.country ? '0 12px 28px rgba(0,0,0,0.16)' : glassCard(theme).boxShadow,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 14px 32px rgba(0,0,0,0.16)'
                    }
                  })}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar sx={{ bgcolor: 'primary.lighter', color: 'primary.dark', boxShadow: 2 }}>{item.flag}</Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                        {countryLabel(item.country)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {t('plusLines.countryItemSummary', {
                          defaultValue: '{{lines}} lines · {{active}} active subs · {{unused}} unused lines',
                          lines: item.plusLines || 0,
                          active: activeSubscriptionsOf(item),
                          unused: Number(item.unusedPlusLines || 0)
                        })}
                      </Typography>
                    </Box>
                  </Stack>
                </Card>
              </Grid>
            ))}
        </Grid>
      </MainCard>

      <MainCard
        title={
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'flex-start', sm: 'center' }}>
            <PublicIcon color="primary" />
            <Typography variant="h6">
              {selectedCountry ? countryLabel(selectedCountry) : t('plusLines.pickCountry', 'Elige un país')}
            </Typography>
          </Stack>
        }
        secondary={
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ width: { xs: '100%', sm: 'auto' } }}>
            <TextField
              size="small"
              placeholder={t('plusLines.searchLine', 'Buscar línea plus u owner en este país')}
              value={lineSearch}
              onChange={(e) => setLineSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                )
              }}
              sx={{ minWidth: { xs: '100%', sm: 260 }, width: { xs: '100%', sm: 'auto' } }}
              helperText={t('plusLines.searchLineHelper', 'Filtra las tarjetas de líneas de este país')}
            />
          </Stack>
        }
      >
        {!selectedCountry && (
          <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3, border: '1px dashed', borderColor: 'divider' }}>
            <Typography variant="subtitle1">{t('plusLines.emptyCountry', 'Selecciona un país para ver sus líneas plus')}</Typography>
          </Paper>
        )}

        {selectedCountry && loadingLines && (
          <Grid container spacing={2}>
            {Array.from({ length: 4 }).map((_, idx) => (
              <Grid item xs={12} md={6} key={idx}>
                <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 2 }} />
              </Grid>
            ))}
          </Grid>
        )}

        {selectedCountry && !loadingLines && lines.length === 0 && (
          <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3, border: '1px dashed', borderColor: 'divider' }}>
            <Typography variant="subtitle1">{t('plusLines.emptyLines', 'No hay líneas plus en este país')}</Typography>
          </Paper>
        )}

        {selectedCountry && !loadingLines && lines.length > 0 && (
          <Stack spacing={2}>
            <Alert severity={unusedLines.length > 0 ? 'warning' : 'success'} variant="outlined">
              {t('plusLines.usageSummary', {
                defaultValue: 'En uso activo: {{active}} · Sin uso activo: {{idle}} · Total líneas plus: {{total}}',
                active: activeLines.length,
                idle: unusedLines.length,
                total: lines.length
              })}
            </Alert>

            {unusedLines.length > 0 && (
              <Paper sx={{ p: 2, borderRadius: 2.5, border: '1px solid', borderColor: 'warning.main' }}>
                <Stack spacing={1}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                    {t('plusLines.unusedTitle', 'Líneas plus sin uso activo')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t(
                      'plusLines.unusedSubtitle',
                      'Estas líneas están creadas pero no tienen suscripciones activas. Pueden reutilizarse de inmediato.'
                    )}
                  </Typography>
                  <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                    {unusedLines.map((line) => (
                      <Chip
                        key={`unused-${line.linePlusId}`}
                        icon={<LanIcon fontSize="small" />}
                        label={`${line.linePlusId} · ${t('plusLines.chips.unusedLine', 'unused line')}`}
                        color="warning"
                        variant="outlined"
                      />
                    ))}
                  </Stack>
                </Stack>
              </Paper>
            )}

            <Grid container spacing={2}>
              {lines.map((line) => {
                const activeSubs = activeSubscriptionsOf(line);
                const inactiveSubs = inactiveSubscriptionsOf(line);
                const totalSubs = totalSubscriptionsOf(line);
                const isUnused = activeSubs === 0;
                const normalizedStatus = normalizePlusStatus(line.status);
                return (
                  <Grid item xs={12} md={6} key={line.linePlusId}>
                    <Card
                      sx={(theme) => ({
                        ...glassCard(theme),
                        p: 2,
                        borderLeft: `4px solid ${isUnused ? theme.palette.warning.main : theme.palette.primary.main}`,
                        minHeight: 240,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1
                      })}
                    >
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={1.5}
                        alignItems={{ xs: 'flex-start', sm: 'center' }}
                        sx={{ mb: 1 }}
                      >
                        <Avatar sx={{ bgcolor: isUnused ? 'warning.main' : 'primary.main', color: 'common.white' }}>
                          {countryFlag(line.country)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                            {line.lineName || line.linePlusId}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {line.linePlusId}
                          </Typography>
                        </Box>
                        <Chip
                          size="small"
                          icon={statusIcon[normalizedStatus] || <PendingActionsIcon fontSize="small" />}
                          label={statusLabelOf(line.status, t)}
                          sx={{ ml: { xs: 0, sm: 'auto' }, fontWeight: 700 }}
                        />
                      </Stack>

                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1, flexWrap: 'wrap' }}>
                        <Chip
                          size="small"
                          icon={<SignalCellularAltIcon fontSize="small" />}
                          label={`${t('plusLines.max', 'Máx. conexiones')}: ${line.maxConnections ?? '-'}`}
                          variant="outlined"
                        />
                        <Chip
                          size="small"
                          icon={<PersonIcon fontSize="small" />}
                          label={line.ownerName || t('plusLines.labels.ownerNA', 'No owner')}
                          variant="outlined"
                        />
                        <Chip
                          size="small"
                          icon={<LinkIcon fontSize="small" />}
                          label={t('plusLines.chips.activeSubs', { defaultValue: '{{count}} active', count: activeSubs })}
                          color="secondary"
                        />
                        <Chip
                          size="small"
                          icon={<CancelIcon fontSize="small" />}
                          label={t('plusLines.chips.inactiveHistorical', {
                            defaultValue: '{{count}} inactive history',
                            count: inactiveSubs
                          })}
                          color={inactiveSubs > 0 ? 'warning' : 'default'}
                        />
                        {isUnused ? (
                          <Chip size="small" icon={<PendingActionsIcon fontSize="small" />} label={t('plusLines.unusedChip', 'Disponible para reutilizar')} color="warning" />
                        ) : null}
                        {line.expDate ? (
                          <Chip
                            size="small"
                            icon={<AccessTimeIcon fontSize="small" />}
                            label={`${t('plusLines.exp', 'Expira')}: ${formatDate(line.expDate)}`}
                            variant="outlined"
                          />
                        ) : null}
                        {(() => {
                          const s = semaphoreColor(line.maxConnections, line.potentialConnections, t);
                          return (
                            <Chip
                              size="small"
                              icon={<TrafficIcon fontSize="small" />}
                              label={s.label}
                              color={s.color}
                              variant="outlined"
                              sx={{ fontWeight: 700 }}
                              title={`Primarias activas: ${line.potentialConnections ?? 0} · Est. activo 30% · Máx plus: ${line.maxConnections ?? 1}`}
                            />
                          );
                        })()}
                      </Stack>

                      <Divider sx={{ my: 1 }} />

                      <SubscriptionsInline linePlusId={line.linePlusId} totalSubscriptions={totalSubs} />
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Stack>
        )}
      </MainCard>
    </Box>
  );
}

function SubscriptionsInline({ linePlusId, totalSubscriptions = 0 }) {
  const { accessToken } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const loadSubs = useCallback(async () => {
    if (!linePlusId) return;
    setLoading(true);
    try {
      const res = await lionTvApi.get(`/plus-lines/${linePlusId}/subscriptions`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { status: 'ACTIVE' },
        skipAuthRedirect: true
      });
      setRows(Array.isArray(res?.data?.data) ? res.data.data : []);
    } catch (err) {
      enqueueSnackbar(err?.response?.data?.message || err.message || t('plusLines.errors.subscriptionsLoad', 'Could not load subscriptions.'), {
        variant: 'error'
      });
    } finally {
      setLoading(false);
    }
  }, [accessToken, enqueueSnackbar, linePlusId, t]);

  useEffect(() => {
    loadSubs();
  }, [loadSubs]);

  if (loading) {
    return <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2 }} />;
  }

  if (!rows.length) {
    return (
      <Stack spacing={0.4}>
        <Typography variant="caption" color="text.secondary">
          {t('plusLines.noActiveSubscriptions', 'Sin suscripciones activas asociadas.')}
        </Typography>
        {totalSubscriptions > 0 ? (
          <Typography variant="caption" color="warning.main">
            {t('plusLines.onlyInactiveSubscriptions', {
              defaultValue: 'Tiene {{count}} suscripción(es) total, pero ninguna activa.',
              count: totalSubscriptions
            })}
          </Typography>
        ) : null}
      </Stack>
    );
  }

  const visible = expanded ? rows : rows.slice(0, 3);

  return (
    <Stack spacing={1}>
      {visible.map((sub) => (
        <Paper key={sub.subscriptionId} variant="outlined" sx={{ p: 1, borderRadius: 2 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'flex-start', sm: 'center' }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ width: '100%', minWidth: 0 }}>
              <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.lighter', color: 'primary.main', fontSize: 12, fontWeight: 700 }}>
                #{sub.subscriptionId}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                  {sub.customerName || sub.customerId}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {sub.startDate || '-'}
                </Typography>
                {sub.primaryMaxConnections ? (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    {t('plusLines.subscription.primaryMax', {
                      defaultValue: 'Primary line max connections: {{count}}',
                      count: sub.primaryMaxConnections
                    })}
                  </Typography>
                ) : null}
              </Box>
            </Stack>
            <Chip
              size="small"
              icon={statusIcon[sub.status] || <PendingActionsIcon fontSize="small" />}
              label={statusLabelOf(sub.status, t)}
              sx={{ fontWeight: 700, alignSelf: { xs: 'flex-start', sm: 'center' } }}
            />
          </Stack>
        </Paper>
      ))}
      {rows.length > 3 && (
        <Button
          size="small"
          onClick={() => setExpanded((v) => !v)}
          sx={{ textTransform: 'none', alignSelf: 'flex-start', width: { xs: '100%', sm: 'auto' } }}
          fullWidth={isMobile}
        >
          {expanded ? t('plusLines.seeLess', 'Ver menos') : t('plusLines.seeMore', { defaultValue: 'Ver más ({{count}})', count: rows.length - 3 })}
        </Button>
      )}
    </Stack>
  );
}
