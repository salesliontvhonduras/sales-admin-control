import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import useAuth from 'hooks/useAuth';

import AndroidOutlinedIcon from '@mui/icons-material/AndroidOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import DevicesOtherOutlinedIcon from '@mui/icons-material/DevicesOtherOutlined';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import HourglassBottomOutlinedIcon from '@mui/icons-material/HourglassBottomOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import TimelapseOutlinedIcon from '@mui/icons-material/TimelapseOutlined';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { alpha, useTheme } from '@mui/material/styles';

import { listYoutubePremiumAppDemos } from 'api/smarttube-premium-admin';
import MainCard from 'ui-component/cards/MainCard';
import { PageErrorState, PageLoadingState } from 'ui-component/feedback/PageState';
import { gridSpacing } from 'store/constant';

const PAGE_SIZE = 25;

const STATUS_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'ACTIVE', label: 'Activas' },
  { value: 'EXPIRED', label: 'Expiradas' },
  { value: 'BLOCKED', label: 'Bloqueadas' },
  { value: 'CONVERTED', label: 'Convertidas' }
];

const FLAVOR_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'owner', label: 'Owner' },
  { value: 'reseller', label: 'Reseller' }
];

const premium = {
  page: '#050505',
  surface: '#101010',
  surface2: '#151515',
  surface3: '#1f1f1f',
  border: 'rgba(255,255,255,0.08)',
  strongBorder: 'rgba(255,255,255,0.16)',
  text: '#ffffff',
  muted: 'rgba(255,255,255,0.62)',
  dim: 'rgba(255,255,255,0.42)',
  accent: '#ef2b2b',
  success: '#63d471',
  warning: '#f6c76b',
  danger: '#ff6b6b'
};

function statusLabel(status) {
  return STATUS_OPTIONS.find((option) => option.value === status)?.label || status || 'Sin estado';
}

function statusTone(status) {
  if (status === 'ACTIVE') return 'success';
  if (status === 'EXPIRED') return 'warning';
  if (status === 'BLOCKED') return 'error';
  if (status === 'CONVERTED') return 'default';
  return 'default';
}

function statusChipSx(status) {
  const tone = statusTone(status);
  const styles = {
    success: { color: premium.success, bgcolor: 'rgba(99,212,113,0.12)', borderColor: 'rgba(99,212,113,0.28)' },
    warning: { color: premium.warning, bgcolor: 'rgba(246,199,107,0.12)', borderColor: 'rgba(246,199,107,0.28)' },
    error: { color: premium.danger, bgcolor: 'rgba(255,107,107,0.12)', borderColor: 'rgba(255,107,107,0.28)' },
    default: { color: premium.muted, bgcolor: 'rgba(255,255,255,0.06)', borderColor: premium.border }
  };
  return {
    height: 26,
    borderRadius: '8px',
    fontWeight: 800,
    letterSpacing: 0,
    ...styles[tone]
  };
}

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('es-HN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date);
}

function formatRemaining(seconds) {
  const value = Number(seconds || 0);
  if (value <= 0) return '0 min';
  const days = Math.floor(value / 86400);
  const hours = Math.floor((value % 86400) / 3600);
  const minutes = Math.floor((value % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${Math.max(minutes, 1)}m`;
}

function compactHash(value) {
  if (!value) return '-';
  const text = String(value);
  if (text.length <= 18) return text;
  return `${text.slice(0, 8)}...${text.slice(-6)}`;
}

function flavorLabel(value) {
  if (!value) return 'Sin flavor';
  const normalized = String(value).toLowerCase();
  if (normalized === 'owner') return 'Owner';
  if (normalized === 'reseller') return 'Reseller';
  return value;
}

function getErrorMessage(err, fallback) {
  if (err?.response?.status === 403) return 'No tienes permiso para ver demos de YouTube Premium.';
  return err?.response?.data?.message || err?.message || fallback;
}

function MetricTile({ icon, label, value, helper, tone = 'default' }) {
  const toneColor = tone === 'success' ? premium.success : tone === 'warning' ? premium.warning : tone === 'error' ? premium.danger : premium.text;

  return (
    <Box
      sx={{
        height: '100%',
        p: { xs: 1.5, sm: 2 },
        borderRadius: '8px',
        border: `1px solid ${premium.border}`,
        bgcolor: premium.surface,
        minHeight: 112
      }}
    >
      <Stack spacing={1} sx={{ height: '100%', justifyContent: 'space-between' }}>
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
          <Typography variant="caption" sx={{ color: premium.muted, fontWeight: 800, textTransform: 'uppercase' }}>
            {label}
          </Typography>
          <Box sx={{ color: toneColor, display: 'flex' }}>{icon}</Box>
        </Stack>
        <Box>
          <Typography variant="h2" sx={{ color: toneColor, lineHeight: 1, fontWeight: 900 }}>
            {value}
          </Typography>
          {helper ? (
            <Typography variant="caption" sx={{ color: premium.dim }}>
              {helper}
            </Typography>
          ) : null}
        </Box>
      </Stack>
    </Box>
  );
}

function FieldBlock({ label, value, mono = false }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="caption" sx={{ color: premium.dim, fontWeight: 800, textTransform: 'uppercase' }}>
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: premium.text,
          fontFamily: mono ? 'monospace' : 'inherit',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
        title={String(value || '-')}
      >
        {value || '-'}
      </Typography>
    </Box>
  );
}

function CopyHashButton({ value, label, onCopy }) {
  return (
    <Tooltip title={value ? `Copiar ${label}` : `${label} no reportado`}>
      <span>
        <IconButton
          size="small"
          disabled={!value}
          onClick={() => onCopy(value, label)}
          sx={{
            color: premium.text,
            bgcolor: 'rgba(255,255,255,0.06)',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.12)' }
          }}
        >
          <ContentCopyOutlinedIcon fontSize="small" />
        </IconButton>
      </span>
    </Tooltip>
  );
}

function DemoMobileCard({ demo, onCopy }) {
  const effectiveStatus = demo.effectiveStatus || demo.status;

  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: '8px',
        border: `1px solid ${premium.border}`,
        bgcolor: premium.surface,
        '& + &': { mt: 1.25 }
      }}
    >
      <Stack spacing={1.5}>
        <Stack direction="row" spacing={1} alignItems="flex-start" justifyContent="space-between">
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle1" sx={{ color: premium.text, fontWeight: 900, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {demo.deviceName || 'Dispositivo sin nombre'}
            </Typography>
            <Typography variant="caption" sx={{ color: premium.muted }}>
              Demo #{demo.demoId || '-'} | {flavorLabel(demo.appFlavor)}
            </Typography>
          </Box>
          <Chip size="small" variant="outlined" label={statusLabel(effectiveStatus)} sx={statusChipSx(effectiveStatus)} />
        </Stack>

        <Grid container spacing={1.25}>
          <Grid item xs={6}>
            <FieldBlock label="Inicio" value={formatDate(demo.startedAt)} />
          </Grid>
          <Grid item xs={6}>
            <FieldBlock label="Expira" value={formatDate(demo.expiresAt)} />
          </Grid>
          <Grid item xs={6}>
            <FieldBlock label="Restante" value={formatRemaining(demo.remainingSeconds)} />
          </Grid>
          <Grid item xs={6}>
            <FieldBlock label="Ultimo reporte" value={formatDate(demo.updatedAt)} />
          </Grid>
          <Grid item xs={12}>
            <FieldBlock label="Hash dispositivo" value={compactHash(demo.deviceIdHash)} mono />
          </Grid>
          <Grid item xs={12}>
            <FieldBlock label="Hash legacy" value={compactHash(demo.legacyDeviceIdHash)} mono />
          </Grid>
        </Grid>

        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <CopyHashButton value={demo.deviceIdHash} label="hash del dispositivo" onCopy={onCopy} />
          <CopyHashButton value={demo.legacyDeviceIdHash} label="hash legacy" onCopy={onCopy} />
        </Stack>
      </Stack>
    </Box>
  );
}

export default function YoutubePremiumAppDemosLionTv() {
  const { enqueueSnackbar } = useSnackbar();
  const { accessToken } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [draftFilters, setDraftFilters] = useState({ status: '', appFlavor: '', search: '' });
  const [queryFilters, setQueryFilters] = useState({ status: '', appFlavor: '', search: '' });
  const [demos, setDemos] = useState({
    data: [],
    total: 0,
    index: 0,
    size: PAGE_SIZE,
    hasNext: false,
    metrics: { total: 0, active: 0, expired: 0, blocked: 0, converted: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const metrics = demos.metrics || {};
  const visibleStats = useMemo(() => {
    const data = demos.data || [];
    return data.reduce(
      (totals, demo) => {
        const status = demo.effectiveStatus || demo.status || 'UNKNOWN';
        totals[status] = (totals[status] || 0) + 1;
        return totals;
      },
      { ACTIVE: 0, EXPIRED: 0, BLOCKED: 0, CONVERTED: 0 }
    );
  }, [demos.data]);

  const loadDemos = useCallback(
    async (overrides = {}) => {
      if (!accessToken) return;
      setLoading(true);
      setError('');
      try {
        const params = {
          ...queryFilters,
          ...overrides,
          index: overrides.index ?? 0,
          size: overrides.size ?? demos.size ?? PAGE_SIZE
        };
        const payload = await listYoutubePremiumAppDemos(params, { skipAuthRedirect: true });
        setDemos({
          data: payload?.data || [],
          total: Number(payload?.total || 0),
          index: Number(payload?.index || 0),
          size: Number(payload?.size || PAGE_SIZE),
          hasNext: Boolean(payload?.hasNext),
          metrics: payload?.metrics || { total: 0, active: 0, expired: 0, blocked: 0, converted: 0 }
        });
      } catch (err) {
        const message = getErrorMessage(err, 'No se pudieron cargar las demos de YouTube Premium.');
        setError(message);
        enqueueSnackbar(message, { variant: 'error' });
      } finally {
        setLoading(false);
      }
    },
    [accessToken, demos.size, enqueueSnackbar, queryFilters]
  );

  useEffect(() => {
    loadDemos({ index: 0 });
  }, [loadDemos]);

  const updateFilter = (field, value) => {
    setDraftFilters((prev) => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => {
    setQueryFilters(draftFilters);
    setDemos((prev) => ({ ...prev, index: 0 }));
  };

  const clearFilters = () => {
    const empty = { status: '', appFlavor: '', search: '' };
    setDraftFilters(empty);
    setQueryFilters(empty);
  };

  const copyText = async (value, label) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      enqueueSnackbar(`${label} copiado.`, { variant: 'success' });
    } catch (_err) {
      enqueueSnackbar(`No se pudo copiar ${label}.`, { variant: 'error' });
    }
  };

  const inputSx = {
    '& .MuiInputBase-root': { minHeight: 46, borderRadius: '8px', bgcolor: premium.surface2, color: premium.text },
    '& .MuiInputLabel-root': { color: premium.muted },
    '& .MuiOutlinedInput-notchedOutline': { borderColor: premium.border },
    '& .MuiSvgIcon-root': { color: premium.muted }
  };

  const pageBgSx = {
    '& .MuiCard-root': {
      backgroundImage: 'none'
    }
  };

  if (loading && !(demos.data || []).length) {
    return <PageLoadingState label="Cargando demos YouTube Premium" />;
  }

  if (error && !(demos.data || []).length) {
    return <PageErrorState message={error} onRetry={() => loadDemos({ index: 0 })} />;
  }

  return (
    <Stack spacing={gridSpacing} sx={pageBgSx}>
      <MainCard
        contentSX={{
          p: { xs: 2, sm: 2.5 },
          bgcolor: premium.page,
          color: premium.text,
          borderRadius: '8px'
        }}
      >
        <Stack spacing={2.5}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'stretch', md: 'center' }} justifyContent="space-between">
            <Stack direction="row" spacing={1.25} alignItems="center">
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: '8px',
                  display: 'grid',
                  placeItems: 'center',
                  bgcolor: alpha(premium.accent, 0.16),
                  color: premium.accent
                }}
              >
                <AndroidOutlinedIcon />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="h2" sx={{ color: premium.text, fontSize: { xs: 24, sm: 30 }, fontWeight: 900, lineHeight: 1.1 }}>
                  Demos YouTube Premium
                </Typography>
                <Typography variant="body2" sx={{ color: premium.muted }}>
                  Dispositivos que iniciaron demo desde la APK LionTV Premium.
                </Typography>
              </Box>
            </Stack>
            <Button
              startIcon={<RefreshIcon />}
              variant="contained"
              onClick={() => loadDemos({ index: demos.index })}
              disabled={loading}
              sx={{ minHeight: 44, borderRadius: '8px', textTransform: 'none', fontWeight: 900 }}
            >
              Actualizar
            </Button>
          </Stack>

          <Grid container spacing={1.5}>
            <Grid item xs={6} md={2.4}>
              <MetricTile icon={<DevicesOtherOutlinedIcon />} label="Total" value={metrics.total || 0} helper="Segun filtros" />
            </Grid>
            <Grid item xs={6} md={2.4}>
              <MetricTile icon={<TimelapseOutlinedIcon />} label="Activas" value={metrics.active || 0} tone="success" helper="Aun vigentes" />
            </Grid>
            <Grid item xs={6} md={2.4}>
              <MetricTile icon={<HourglassBottomOutlinedIcon />} label="Expiradas" value={metrics.expired || 0} tone="warning" helper="Tiempo agotado" />
            </Grid>
            <Grid item xs={6} md={2.4}>
              <MetricTile icon={<BlockOutlinedIcon />} label="Bloqueadas" value={metrics.blocked || 0} tone="error" helper="Sin acceso demo" />
            </Grid>
            <Grid item xs={12} md={2.4}>
              <MetricTile icon={<CheckCircleOutlineIcon />} label="Convertidas" value={metrics.converted || 0} helper="Pasaron a pago" />
            </Grid>
          </Grid>
        </Stack>
      </MainCard>

      <MainCard
        contentSX={{
          p: { xs: 2, sm: 2.5 },
          bgcolor: premium.surface,
          color: premium.text,
          borderRadius: '8px'
        }}
      >
        <Stack spacing={2}>
          <Stack direction="row" spacing={1} alignItems="center">
            <FilterAltOutlinedIcon sx={{ color: premium.accent }} />
            <Box>
              <Typography variant="h4" sx={{ color: premium.text }}>
                Filtros
              </Typography>
              <Typography variant="caption" sx={{ color: premium.muted }}>
                Busca por nombre del dispositivo o hashes para soporte tecnico.
              </Typography>
            </Box>
          </Stack>
          <Grid container spacing={1.5} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField fullWidth select label="Estado" value={draftFilters.status} onChange={(event) => updateFilter('status', event.target.value)} size="small" sx={inputSx}>
                {STATUS_OPTIONS.map((option) => (
                  <MenuItem value={option.value} key={option.value || 'all'}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField fullWidth select label="Flavor" value={draftFilters.appFlavor} onChange={(event) => updateFilter('appFlavor', event.target.value)} size="small" sx={inputSx}>
                {FLAVOR_OPTIONS.map((option) => (
                  <MenuItem value={option.value} key={option.value || 'all'}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Buscar dispositivo/hash"
                value={draftFilters.search}
                onChange={(event) => updateFilter('search', event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') applyFilters();
                }}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchOutlinedIcon sx={{ color: premium.muted }} />
                    </InputAdornment>
                  )
                }}
                sx={inputSx}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Stack direction={{ xs: 'column', sm: 'row', md: 'column' }} spacing={1}>
                <Button fullWidth variant="contained" onClick={applyFilters} disabled={loading} sx={{ minHeight: 44, borderRadius: '8px', textTransform: 'none', fontWeight: 900 }}>
                  Buscar
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={clearFilters}
                  disabled={loading}
                  sx={{ minHeight: 44, borderRadius: '8px', textTransform: 'none', fontWeight: 900, color: premium.text, borderColor: premium.strongBorder }}
                >
                  Limpiar
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </MainCard>

      <MainCard
        contentSX={{
          p: { xs: 1.5, sm: 2.5 },
          bgcolor: premium.surface,
          color: premium.text,
          borderRadius: '8px'
        }}
      >
        <Stack spacing={2}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'stretch', sm: 'center' }} justifyContent="space-between">
            <Box>
              <Typography variant="h4" sx={{ color: premium.text }}>
                Dispositivos demo
              </Typography>
              <Typography variant="caption" sx={{ color: premium.muted }}>
                Pagina {Number(demos.index || 0) + 1}. Mostrando {(demos.data || []).length} de {demos.total || 0} registros.
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} alignItems="center">
              {loading ? <Chip size="small" label="Actualizando..." sx={{ color: premium.warning, bgcolor: 'rgba(246,199,107,0.12)' }} /> : null}
              <Chip
                size="small"
                label={`Visibles activas: ${visibleStats.ACTIVE || 0}`}
                sx={{ color: premium.success, bgcolor: 'rgba(99,212,113,0.12)', borderRadius: '8px' }}
              />
            </Stack>
          </Stack>

          {isMobile ? (
            <Box>
              {(demos.data || []).map((demo) => (
                <DemoMobileCard key={demo.demoId} demo={demo} onCopy={copyText} />
              ))}
            </Box>
          ) : (
            <TableContainer
              sx={{
                border: `1px solid ${premium.border}`,
                borderRadius: '8px',
                overflow: 'hidden',
                bgcolor: premium.surface
              }}
            >
              <Table sx={{ minWidth: 1120 }}>
                <TableHead>
                  <TableRow
                    sx={{
                      '& th': {
                        bgcolor: premium.surface2,
                        color: premium.muted,
                        borderColor: premium.border,
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        fontSize: 12,
                        letterSpacing: 0
                      }
                    }}
                  >
                    <TableCell>Dispositivo</TableCell>
                    <TableCell>Flavor</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Demo</TableCell>
                    <TableCell>Hashes</TableCell>
                    <TableCell align="right">Soporte</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(demos.data || []).map((demo) => {
                    const effectiveStatus = demo.effectiveStatus || demo.status;
                    return (
                      <TableRow
                        key={demo.demoId}
                        hover
                        sx={{
                          '& td': { borderColor: premium.border, color: premium.text },
                          '&:hover td': { bgcolor: 'rgba(255,255,255,0.03)' }
                        }}
                      >
                        <TableCell sx={{ maxWidth: 280 }}>
                          <Stack direction="row" spacing={1.25} alignItems="center">
                            <Box
                              sx={{
                                width: 38,
                                height: 38,
                                borderRadius: '8px',
                                display: 'grid',
                                placeItems: 'center',
                                bgcolor: 'rgba(255,255,255,0.06)',
                                color: premium.text
                              }}
                            >
                              <AndroidOutlinedIcon fontSize="small" />
                            </Box>
                            <Box sx={{ minWidth: 0 }}>
                              <Typography variant="subtitle2" sx={{ color: premium.text, fontWeight: 900, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {demo.deviceName || 'Dispositivo sin nombre'}
                              </Typography>
                              <Typography variant="caption" sx={{ color: premium.dim }}>
                                Demo #{demo.demoId || '-'}
                              </Typography>
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ color: premium.text, fontWeight: 800 }}>
                            {flavorLabel(demo.appFlavor)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip size="small" variant="outlined" label={statusLabel(effectiveStatus)} sx={statusChipSx(effectiveStatus)} />
                        </TableCell>
                        <TableCell sx={{ minWidth: 260 }}>
                          <Stack spacing={0.25}>
                            <Typography variant="caption" sx={{ color: premium.muted }}>
                              Inicio: {formatDate(demo.startedAt)}
                            </Typography>
                            <Typography variant="caption" sx={{ color: premium.muted }}>
                              Expira: {formatDate(demo.expiresAt)}
                            </Typography>
                            <Typography variant="caption" sx={{ color: premium.dim }}>
                              Restante: {formatRemaining(demo.remainingSeconds)} | Ultimo reporte: {formatDate(demo.updatedAt)}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell sx={{ maxWidth: 290 }}>
                          <Stack spacing={0.25}>
                            <Typography variant="caption" sx={{ color: premium.muted, fontFamily: 'monospace' }} title={demo.deviceIdHash || ''}>
                              Device: {compactHash(demo.deviceIdHash)}
                            </Typography>
                            <Typography variant="caption" sx={{ color: premium.dim, fontFamily: 'monospace' }} title={demo.legacyDeviceIdHash || ''}>
                              Legacy: {compactHash(demo.legacyDeviceIdHash)}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="right">
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <CopyHashButton value={demo.deviceIdHash} label="hash del dispositivo" onCopy={copyText} />
                            <CopyHashButton value={demo.legacyDeviceIdHash} label="hash legacy" onCopy={copyText} />
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {!loading && !(demos.data || []).length && (
            <Alert
              icon={<DevicesOtherOutlinedIcon />}
              severity="info"
              sx={{ borderRadius: '8px', bgcolor: 'rgba(255,255,255,0.06)', color: premium.text, border: `1px solid ${premium.border}` }}
            >
              Aun no hay demos creadas desde la APK.
            </Alert>
          )}

          <Divider sx={{ borderColor: premium.border }} />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }}>
            <Typography variant="caption" sx={{ color: premium.muted }}>
              Mostrando {(demos.data || []).length} de {demos.total || 0} registros filtrados.
            </Typography>
            <Stack direction="row" spacing={1} sx={{ '& .MuiButton-root': { minHeight: 42, borderRadius: '8px', textTransform: 'none', fontWeight: 900 } }}>
              <Button
                variant="outlined"
                fullWidth={isMobile}
                disabled={loading || Number(demos.index || 0) <= 0}
                onClick={() => loadDemos({ index: Math.max(0, Number(demos.index || 0) - 1) })}
                sx={{ color: premium.text, borderColor: premium.strongBorder }}
              >
                Anterior
              </Button>
              <Button
                variant="outlined"
                fullWidth={isMobile}
                disabled={loading || !demos.hasNext}
                onClick={() => loadDemos({ index: Number(demos.index || 0) + 1 })}
                sx={{ color: premium.text, borderColor: premium.strongBorder }}
              >
                Siguiente
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </MainCard>
    </Stack>
  );
}
