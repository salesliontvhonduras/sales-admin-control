import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import useAuth from 'hooks/useAuth';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
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
      ? `linear-gradient(135deg, ${theme.palette.primary.light}22 0%, ${theme.palette.secondary.light}12 45%, #ffffff 100%)`
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

function semaphoreColor(maxConnections, potentialConnections) {
  const max = maxConnections || 1;
  const potential = potentialConnections || 0;
  const pct = Math.min(100, Math.round((potential / max) * 100));
  if (pct <= 30) return { color: 'success', label: `Verde · ${pct}%` };
  if (pct <= 60) return { color: 'warning', label: `Amarillo · ${pct}%` };
  return { color: 'error', label: `Rojo · ${pct}%` };
}

export default function PlusLinesExplorer() {
  const { enqueueSnackbar } = useSnackbar();
  const { accessToken } = useAuth();
  const { t } = useTranslation();

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
        enqueueSnackbar(err?.response?.data?.message || err.message || 'No se pudo cargar el resumen.', { variant: 'error' });
      }
    } finally {
      setLoadingSummary(false);
    }
  }, [accessToken, enqueueSnackbar, search]);

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
        enqueueSnackbar(err?.response?.data?.message || err.message || 'No se pudieron cargar las líneas plus.', { variant: 'error' });
      }
    } finally {
      setLoadingLines(false);
    }
  }, [accessToken, enqueueSnackbar, selectedCountry, lineSearch]);

  useEffect(() => {
    loadSummary();
  }, [loadSummary, refreshKey]);

  useEffect(() => {
    loadLines();
  }, [loadLines]);

  const summaryWithFlags = useMemo(() => {
    if (!summary.length) return countryOptions.map((c) => ({ country: c.code, plusLines: 0, subscriptions: 0, flag: c.flag }));
    return summary.map((s) => ({ ...s, flag: countryFlag(s.country) }));
  }, [summary]);

  const totalLines = summary.reduce((acc, s) => acc + (s.plusLines || 0), 0);
  const totalSubs = summary.reduce((acc, s) => acc + (s.subscriptions || 0), 0);

  return (
    <Box sx={{ width: '100%', maxWidth: 1400, mx: 'auto' }}>
      <MainCard title={t('plusLines.title', 'Plus Lines Explorer')} secondary={null}>
        <Grid container spacing={gridSpacing}>
          {[
            { label: t('plusLines.cards.countries', 'Países con líneas plus'), value: summary.length, icon: <MapIcon />, color: '#1e88e5' },
            { label: t('plusLines.cards.lines', 'Líneas plus'), value: totalLines, icon: <LanIcon />, color: '#7e57c2' },
            { label: t('plusLines.cards.subs', 'Suscripciones'), value: totalSubs, icon: <PeopleAltIcon />, color: '#039be5' }
          ].map((item, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Card
                sx={{
                  borderRadius: 3,
                  p: 2.2,
                  display: 'flex',
                  gap: 1.5,
                  alignItems: 'center',
                  background: `linear-gradient(135deg, ${item.color}12 0%, #ffffff 100%)`,
                  border: '1px solid rgba(0,0,0,0.06)',
                  boxShadow: '0 12px 28px rgba(0,0,0,0.08)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    background: `radial-gradient(circle at 20% 30%, ${item.color}18 0, transparent 45%), radial-gradient(circle at 85% 10%, ${item.color}10 0, transparent 35%)`,
                    pointerEvents: 'none'
                  }}
                />
                <Avatar
                  sx={{
                    bgcolor: item.color,
                    color: '#fff',
                    width: 52,
                    height: 52,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                    border: '2px solid #fff',
                    position: 'relative',
                    zIndex: 1
                  }}
                >
                  {item.icon}
                </Avatar>
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Typography variant="h5" sx={{ fontWeight: 900, lineHeight: 1 }}>
                    {item.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    {item.label}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </MainCard>

      <MainCard title={t('plusLines.mapTitle', 'Mapa por país')}>
        <Grid container spacing={2}>
          {loadingSummary &&
            Array.from({ length: 6 }).map((_, idx) => (
              <Grid item xs={6} sm={4} md={3} key={idx}>
                <Skeleton variant="rectangular" height={90} sx={{ borderRadius: 2 }} />
              </Grid>
            ))}

          {!loadingSummary &&
            summaryWithFlags.map((item) => (
              <Grid item xs={6} sm={4} md={3} key={item.country}>
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
                        {item.plusLines || 0} líneas · {item.subscriptions || 0} subs
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
          <Stack direction="row" spacing={1} alignItems="center">
            <PublicIcon color="primary" />
            <Typography variant="h6">
              {selectedCountry ? countryLabel(selectedCountry) : t('plusLines.pickCountry', 'Elige un país')}
            </Typography>
          </Stack>
        }
        secondary={
          <Stack direction="row" spacing={1}>
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
              sx={{ minWidth: 260 }}
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
          <Grid container spacing={2}>
            {lines.map((line) => (
              <Grid item xs={12} md={6} key={line.linePlusId}>
                <Card
                  sx={(theme) => ({
                    ...glassCard(theme),
                    p: 2,
                    borderLeft: `4px solid ${theme.palette.primary.main}`,
                    minHeight: 240,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1
                  })}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', color: '#fff' }}>{countryFlag(line.country)}</Avatar>
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
                      icon={statusIcon[line.status] || <PendingActionsIcon fontSize="small" />}
                      label={line.status || 'UNKNOWN'}
                      sx={{ ml: 'auto', fontWeight: 700 }}
                    />
                  </Stack>

                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1, flexWrap: 'wrap' }}>
                    <Chip
                      size="small"
                      icon={<SignalCellularAltIcon fontSize="small" />}
                      label={`${t('plusLines.max', 'Máx. conexiones')}: ${line.maxConnections ?? '-'}`}
                      variant="outlined"
                    />
                    <Chip size="small" icon={<PersonIcon fontSize="small" />} label={line.ownerName || 'N/A'} variant="outlined" />
                    <Chip size="small" icon={<LinkIcon fontSize="small" />} label={`${line.subscriptions} subs`} color="secondary" />
                    {line.expDate ? (
                      <Chip
                        size="small"
                        icon={<AccessTimeIcon fontSize="small" />}
                        label={`${t('plusLines.exp', 'Expira')}: ${formatDate(line.expDate)}`}
                        variant="outlined"
                      />
                    ) : null}
                    {(() => {
                      const s = semaphoreColor(line.maxConnections, line.potentialConnections);
                      return (
                        <Chip
                          size="small"
                          icon={<TrafficIcon fontSize="small" />}
                          label={s.label}
                          color={s.color}
                          variant="outlined"
                          sx={{ fontWeight: 700 }}
                        />
                      );
                    })()}
                  </Stack>

                  <Divider sx={{ my: 1 }} />

                  <SubscriptionsInline linePlusId={line.linePlusId} />
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </MainCard>
    </Box>
  );
}

function SubscriptionsInline({ linePlusId }) {
  const { accessToken } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const loadSubs = useCallback(async () => {
    if (!linePlusId) return;
    setLoading(true);
    try {
      const res = await lionTvApi.get(`/plus-lines/${linePlusId}/subscriptions`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        skipAuthRedirect: true
      });
      setRows(Array.isArray(res?.data?.data) ? res.data.data : []);
    } catch (err) {
      enqueueSnackbar(err?.response?.data?.message || err.message || 'No se pudieron cargar suscripciones.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [accessToken, enqueueSnackbar, linePlusId]);

  useEffect(() => {
    loadSubs();
  }, [loadSubs]);

  if (loading) {
    return <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2 }} />;
  }

  if (!rows.length) {
    return (
      <Typography variant="caption" color="text.secondary">
        Sin suscripciones asociadas.
      </Typography>
    );
  }

  const visible = expanded ? rows : rows.slice(0, 3);

  return (
    <Stack spacing={1}>
      {visible.map((sub) => (
        <Paper
          key={sub.subscriptionId}
          variant="outlined"
          sx={{
            p: 1,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.lighter', color: 'primary.main', fontSize: 12, fontWeight: 700 }}>
            #{sub.subscriptionId}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2">{sub.customerName || sub.customerId}</Typography>
            <Typography variant="caption" color="text.secondary">
              {sub.startDate || '-'}
            </Typography>
            {sub.primaryMaxConnections ? (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                Max conexiones línea primaria: {sub.primaryMaxConnections}
              </Typography>
            ) : null}
          </Box>
          <Chip
            size="small"
            icon={statusIcon[sub.status] || <PendingActionsIcon fontSize="small" />}
            label={sub.status}
            sx={{ fontWeight: 700 }}
          />
        </Paper>
      ))}
      {rows.length > 3 && (
        <Button size="small" onClick={() => setExpanded((v) => !v)} sx={{ textTransform: 'none', alignSelf: 'flex-start' }}>
          {expanded ? 'Ver menos' : `Ver más (${rows.length - 3})`}
        </Button>
      )}
    </Stack>
  );
}
