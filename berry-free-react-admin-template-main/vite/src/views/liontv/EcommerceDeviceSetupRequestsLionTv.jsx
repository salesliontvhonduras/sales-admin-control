import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import useAuth from 'hooks/useAuth';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import Skeleton from '@mui/material/Skeleton';
import { useTheme, useMediaQuery } from '@mui/material';

import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ReplayIcon from '@mui/icons-material/Replay';
import DevicesOtherIcon from '@mui/icons-material/DevicesOther';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import PaidIcon from '@mui/icons-material/Paid';

import MainCard from 'ui-component/cards/MainCard';
import LionMetricCard from 'ui-component/cards/LionMetricCard';
import ResponsiveActionBar from 'ui-component/responsive/ResponsiveActionBar';
import ResponsiveFilters from 'ui-component/responsive/ResponsiveFilters';
import ResponsiveEntityView from 'ui-component/responsive/ResponsiveEntityView';
import ResponsiveMetricGrid from 'ui-component/responsive/ResponsiveMetricGrid';
import MobileSummaryCard from 'ui-component/responsive/MobileSummaryCard';
import MobileFieldGrid from 'ui-component/responsive/MobileFieldGrid';
import {
  confirmAdminDeviceSetupPayment,
  listAdminDeviceSetupRequests,
  retryAdminDeviceSetupRequest
} from 'api/liontv-ecommerce-site';

const STATUS_OPTIONS = ['', 'PAYMENT_REQUIRED', 'PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'];
const APP_OPTIONS = [
  { value: '', label: 'Todas las apps' },
  { value: 'VIVO_PLAYER', label: 'Vivo Player' },
  { value: 'NINEXTREAM', label: '9Xtream' },
  { value: 'IPTV_4K_SMARTERS', label: 'IPTV 4K Smarters' }
];
const DATE_FILTER_OPTIONS = [
  { value: 'ALL', labelKey: 'deviceSetupRequests.filters.allDates', fallback: 'Todas' },
  { value: 'TODAY', labelKey: 'deviceSetupRequests.filters.today', fallback: 'Hoy' },
  { value: 'YESTERDAY', labelKey: 'deviceSetupRequests.filters.yesterday', fallback: 'Ayer' },
  { value: 'LAST_7_DAYS', labelKey: 'deviceSetupRequests.filters.last7Days', fallback: 'Últimos 7 días' },
  { value: 'CUSTOM', labelKey: 'deviceSetupRequests.filters.customRange', fallback: 'Rango personalizado' }
];
const HONDURAS_TIME_ZONE = 'America/Tegucigalpa';

const getHondurasDateString = () => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: HONDURAS_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.filter((part) => part.type !== 'literal').map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
};

const addDaysToDateString = (value, days) => {
  if (!value) return '';
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));
  return date.toISOString().slice(0, 10);
};

const resolveDateFilterRange = (preset, customFrom, customTo) => {
  const today = getHondurasDateString();
  if (preset === 'TODAY') return { createdFrom: today, createdTo: today };
  if (preset === 'YESTERDAY') {
    const yesterday = addDaysToDateString(today, -1);
    return { createdFrom: yesterday, createdTo: yesterday };
  }
  if (preset === 'LAST_7_DAYS') return { createdFrom: addDaysToDateString(today, -6), createdTo: today };
  if (preset === 'CUSTOM') return { createdFrom: customFrom || undefined, createdTo: customTo || undefined };
  return {};
};

const statusColor = (status) => {
  const value = String(status || '').toUpperCase();
  if (value === 'COMPLETED') return 'success';
  if (value === 'FAILED') return 'error';
  if (value === 'PAYMENT_REQUIRED') return 'warning';
  if (value === 'PROCESSING') return 'info';
  return 'default';
};

const statusIcon = (status) => {
  const value = String(status || '').toUpperCase();
  if (value === 'COMPLETED') return <CheckCircleOutlineIcon fontSize="small" />;
  if (value === 'FAILED') return <ErrorOutlineIcon fontSize="small" />;
  if (value === 'PAYMENT_REQUIRED') return <PaidIcon fontSize="small" />;
  return <HourglassTopIcon fontSize="small" />;
};

const formatDateTime = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString();
};

const safeJsonPreview = (value) => {
  if (!value) return '-';
  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    return String(value);
  }
};

export default function EcommerceDeviceSetupRequestsLionTv() {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { accessToken } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sendingId, setSendingId] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [appCode, setAppCode] = useState('');
  const [datePreset, setDatePreset] = useState('ALL');
  const [customDateFrom, setCustomDateFrom] = useState('');
  const [customDateTo, setCustomDateTo] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const loadRows = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const dateParams = resolveDateFilterRange(datePreset, customDateFrom, customDateTo);
      const payload = await listAdminDeviceSetupRequests(
        {
          index: page,
          size: rowsPerPage,
          status: status || undefined,
          appCode: appCode || undefined,
          search: search || undefined,
          ...dateParams
        },
        { skipAuthRedirect: true }
      );
      setRows(Array.isArray(payload?.data) ? payload.data : []);
      setTotal(Number(payload?.total || 0));
    } catch (err) {
      enqueueSnackbar(err?.response?.data?.message || err.message || 'No se pudieron cargar las solicitudes de dispositivos.', {
        variant: 'error'
      });
    } finally {
      setLoading(false);
    }
  }, [accessToken, appCode, customDateFrom, customDateTo, datePreset, enqueueSnackbar, page, rowsPerPage, search, status]);

  useEffect(() => {
    loadRows();
  }, [loadRows, refreshKey]);

  const metrics = useMemo(() => {
    const counts = rows.reduce((acc, row) => {
      const key = String(row.status || 'PENDING').toUpperCase();
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    return [
      { title: 'Solicitudes', value: total, helper: 'Total filtrado', color: 'primary', icon: <DevicesOtherIcon fontSize="small" /> },
      { title: 'Pago requerido', value: counts.PAYMENT_REQUIRED || 0, helper: 'Esperando confirmación manual', color: 'warning', icon: <PaidIcon fontSize="small" /> },
      { title: 'Pendientes', value: counts.PENDING || 0, helper: 'En cola automática', color: 'info', icon: <HourglassTopIcon fontSize="small" /> },
      { title: 'Fallidas', value: counts.FAILED || 0, helper: 'Requieren revisión', color: 'error', icon: <ErrorOutlineIcon fontSize="small" /> }
    ];
  }, [rows, total]);

  const runAction = async (row, action) => {
    if (!row?.id) return;
    setSendingId(`${action}-${row.id}`);
    try {
      if (action === 'confirm') {
        await confirmAdminDeviceSetupPayment(row.id, { skipAuthRedirect: true });
        enqueueSnackbar('Pago confirmado. La solicitud vuelve a cola automática.', { variant: 'success' });
      } else {
        await retryAdminDeviceSetupRequest(row.id, { skipAuthRedirect: true });
        enqueueSnackbar('Solicitud enviada nuevamente a cola automática.', { variant: 'success' });
      }
      setRefreshKey((value) => value + 1);
    } catch (err) {
      enqueueSnackbar(err?.response?.data?.message || err.message || 'No se pudo actualizar la solicitud.', { variant: 'error' });
    } finally {
      setSendingId('');
    }
  };

  const renderActions = (row) => {
    const normalized = String(row.status || '').toUpperCase();
    return (
      <Stack direction="row" spacing={0.75} justifyContent="flex-end">
        {normalized === 'PAYMENT_REQUIRED' ? (
          <Tooltip title="Confirmar pago">
            <span>
              <IconButton
                color="success"
                size="small"
                disabled={Boolean(sendingId)}
                onClick={() => runAction(row, 'confirm')}
              >
                <CheckCircleOutlineIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        ) : null}
        {normalized === 'FAILED' ? (
          <Tooltip title="Reintentar">
            <span>
              <IconButton color="primary" size="small" disabled={Boolean(sendingId)} onClick={() => runAction(row, 'retry')}>
                <ReplayIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        ) : null}
      </Stack>
    );
  };

  const statusChip = (row) => (
    <Chip
      size="small"
      color={statusColor(row.status)}
      icon={statusIcon(row.status)}
      label={row.status || 'PENDING'}
      variant={String(row.status || '').toUpperCase() === 'COMPLETED' ? 'filled' : 'outlined'}
      sx={{ fontWeight: 700 }}
    />
  );

  return (
    <Box sx={{ width: '100%', maxWidth: 1400, mx: 'auto' }}>
      <MainCard
        title={t('menu.deviceSetupRequests', 'Solicitudes de dispositivos')}
        secondary={
          <ResponsiveActionBar>
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => setRefreshKey((value) => value + 1)} disabled={loading}>
              {t('actions.refresh', 'Refresh')}
            </Button>
          </ResponsiveActionBar>
        }
      >
        <Stack spacing={2}>
          <Alert severity="info">
            Revisa solicitudes creadas desde el ecommerce. Si el cliente pagó una licencia adicional, confirma el pago para que el worker configure el dispositivo.
          </Alert>
          <ResponsiveMetricGrid columns={{ xs: 1, md: 2, lg: 4 }}>
            {metrics.map((item) => (
              <LionMetricCard key={item.title} {...item} />
            ))}
          </ResponsiveMetricGrid>
        </Stack>
      </MainCard>

      <MainCard
        title="Bandeja de solicitudes"
        secondary={
          <ResponsiveFilters paperSx={{ width: { xs: '100%', md: 1180 } }}>
            <TextField
              size="small"
              fullWidth
              placeholder="Buscar por email, MAC, alias, suscripción o app"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(0);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                )
              }}
            />
            <TextField
              select
              size="small"
              label="Estado"
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(0);
              }}
              sx={{ minWidth: { xs: '100%', sm: 210 } }}
            >
              {STATUS_OPTIONS.map((option) => (
                <MenuItem key={option || 'ALL'} value={option}>
                  {option || 'Todos'}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              size="small"
              label={t('deviceSetupRequests.filters.app', 'Aplicación')}
              value={appCode}
              onChange={(event) => {
                setAppCode(event.target.value);
                setPage(0);
              }}
              sx={{ minWidth: { xs: '100%', sm: 230 } }}
            >
              {APP_OPTIONS.map((option) => (
                <MenuItem key={option.value || 'ALL'} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              size="small"
              label={t('deviceSetupRequests.filters.date', 'Fecha')}
              value={datePreset}
              onChange={(event) => {
                setDatePreset(event.target.value);
                setPage(0);
              }}
              sx={{ minWidth: { xs: '100%', sm: 210 } }}
            >
              {DATE_FILTER_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {t(option.labelKey, option.fallback)}
                </MenuItem>
              ))}
            </TextField>
            {datePreset === 'CUSTOM' ? (
              <>
                <TextField
                  size="small"
                  type="date"
                  label={t('deviceSetupRequests.filters.from', 'Desde')}
                  value={customDateFrom}
                  onChange={(event) => {
                    setCustomDateFrom(event.target.value);
                    setPage(0);
                  }}
                  InputLabelProps={{ shrink: true }}
                  sx={{ minWidth: { xs: '100%', sm: 170 } }}
                />
                <TextField
                  size="small"
                  type="date"
                  label={t('deviceSetupRequests.filters.to', 'Hasta')}
                  value={customDateTo}
                  onChange={(event) => {
                    setCustomDateTo(event.target.value);
                    setPage(0);
                  }}
                  InputLabelProps={{ shrink: true }}
                  sx={{ minWidth: { xs: '100%', sm: 170 } }}
                />
              </>
            ) : null}
          </ResponsiveFilters>
        }
      >
        <ResponsiveEntityView
          isMobile={isMobile}
          mobileContent={
            loading ? (
              <Stack spacing={1.5}>
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} variant="rounded" height={210} />
                ))}
              </Stack>
            ) : rows.length ? (
              <Stack spacing={1.5}>
                {rows.map((row) => (
                  <MobileSummaryCard
                    key={row.id}
                    icon={
                      <Avatar sx={{ bgcolor: 'primary.lighter', color: 'primary.main' }}>
                        <DevicesOtherIcon />
                      </Avatar>
                    }
                    title={row.alias || row.macAddress || `Solicitud #${row.id}`}
                    subtitle={`${row.email || '-'} · #${row.subscriptionId || '-'}`}
                    chips={[statusChip(row), <Chip key="app" size="small" variant="outlined" label={row.appCode || '-'} />]}
                    actions={renderActions(row)}
                  >
                    <MobileFieldGrid
                      fields={[
                        { label: 'MAC', value: row.macAddress || '-' },
                        { label: 'Device key', value: row.deviceKey || '-' },
                        { label: 'Licencia', value: `${row.licensePeriod || '-'}${row.paidLicense ? ' · pagada' : ' · incluida'}` },
                        { label: 'Cliente', value: row.customerName || '-' },
                        { label: 'Creada', value: formatDateTime(row.createdAt) },
                        { label: 'Error', value: row.errorMessage || '-' }
                      ]}
                    />
                  </MobileSummaryCard>
                ))}
              </Stack>
            ) : (
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="subtitle1">No hay solicitudes con los filtros actuales.</Typography>
              </Paper>
            )
          }
          desktopContent={
            <TableContainer component={Paper} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
              <Table size="small" sx={{ minWidth: 1240 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Cliente</TableCell>
                    <TableCell>Suscripción</TableCell>
                    <TableCell>App</TableCell>
                    <TableCell>Dispositivo</TableCell>
                    <TableCell>Licencia</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Fechas</TableCell>
                    <TableCell>Resultado / error</TableCell>
                    <TableCell align="right">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow hover key={row.id}>
                      <TableCell>#{row.id}</TableCell>
                      <TableCell>
                        <Stack spacing={0.25}>
                          <Typography variant="subtitle2">{row.customerName || '-'}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {row.email || '-'}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack spacing={0.25}>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            #{row.subscriptionId || '-'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {row.subscriptionStatus || '-'}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>{row.appCode || '-'}</TableCell>
                      <TableCell>
                        <Stack spacing={0.25}>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {row.alias || '-'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {row.macAddress || '-'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {row.deviceKey || '-'}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack spacing={0.5} alignItems="flex-start">
                          <Chip size="small" variant="outlined" label={row.licensePeriod || '-'} />
                          <Chip size="small" color={row.paidLicense ? 'success' : 'default'} label={row.paidLicense ? 'Pagada' : 'Incluida'} />
                        </Stack>
                      </TableCell>
                      <TableCell>{statusChip(row)}</TableCell>
                      <TableCell>
                        <Stack spacing={0.25}>
                          <Typography variant="caption">Creada: {formatDateTime(row.createdAt)}</Typography>
                          <Typography variant="caption">Procesada: {formatDateTime(row.processedAt)}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ maxWidth: 280 }}>
                        <Typography variant="caption" component="pre" sx={{ whiteSpace: 'pre-wrap', m: 0 }}>
                          {row.errorMessage || safeJsonPreview(row.automaticResultJson)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">{renderActions(row)}</TableCell>
                    </TableRow>
                  ))}
                  {!loading && rows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} align="center" sx={{ py: 5 }}>
                        No hay solicitudes con los filtros actuales.
                      </TableCell>
                    </TableRow>
                  ) : null}
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={10} align="center" sx={{ py: 5 }}>
                        Cargando solicitudes...
                      </TableCell>
                    </TableRow>
                  ) : null}
                </TableBody>
              </Table>
            </TableContainer>
          }
          pagination={
            <TablePagination
              component="div"
              count={total}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={(_, nextPage) => setPage(nextPage)}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setPage(0);
              }}
            />
          }
          showDivider={!isMobile}
        />
      </MainCard>
    </Box>
  );
}
