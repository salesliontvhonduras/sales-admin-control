import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import useAuth from 'hooks/useAuth';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import EventRepeatOutlinedIcon from '@mui/icons-material/EventRepeatOutlined';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import ReplayIcon from '@mui/icons-material/Replay';
import SearchIcon from '@mui/icons-material/Search';
import SyncIcon from '@mui/icons-material/Sync';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

import {
  getPayPalCheckoutOverview,
  listPayPalPlans,
  listPayPalProducts,
  listPayPalSessions,
  listPayPalWebhooks,
  refreshPayPalSession,
  reprocessPayPalWebhook,
  syncPayPalPlan
} from 'api/paypal-checkout-admin';
import MainCard from 'ui-component/cards/MainCard';
import LionMetricCard from 'ui-component/cards/LionMetricCard';
import ResponsiveActionBar from 'ui-component/responsive/ResponsiveActionBar';
import ResponsiveEntityView from 'ui-component/responsive/ResponsiveEntityView';
import ResponsiveFilters from 'ui-component/responsive/ResponsiveFilters';
import ResponsiveMetricGrid from 'ui-component/responsive/ResponsiveMetricGrid';
import MobileFieldGrid from 'ui-component/responsive/MobileFieldGrid';
import MobileSummaryCard from 'ui-component/responsive/MobileSummaryCard';

const SITE_OPTIONS = [
  { value: 'LIONTV_PREMIUM', label: 'LionTV Premium' },
  { value: 'VIVAPLAYER_VIP', label: 'Viva Player VIP' }
];

const SESSION_STATUS_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'CREATED', label: 'Creado' },
  { value: 'PAYPAL_CREATED', label: 'Pendiente PayPal' },
  { value: 'APPROVED', label: 'Aprobado' },
  { value: 'ACTIVE', label: 'Activo' },
  { value: 'FAILED', label: 'Fallido' },
  { value: 'CANCELLED', label: 'Cancelado' }
];

const WEBHOOK_STATUS_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'RECEIVED', label: 'Recibido' },
  { value: 'PROCESSED', label: 'Procesado' },
  { value: 'FAILED', label: 'Fallido' },
  { value: 'IGNORED', label: 'Ignorado' }
];

function formatMoney(value, currency = 'USD') {
  const amount = Number(value || 0);
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString('es-HN', { dateStyle: 'medium', timeStyle: 'short' });
}

function valueOrDash(value) {
  return value === null || value === undefined || value === '' ? '-' : String(value);
}

function statusColor(status) {
  const value = String(status || '').toUpperCase();
  if (value === 'ACTIVE' || value === 'PROCESSED') return 'success';
  if (value === 'PAYPAL_CREATED' || value === 'CREATED' || value === 'RECEIVED' || value === 'APPROVED') return 'warning';
  if (value === 'FAILED') return 'error';
  if (value === 'CANCELLED' || value === 'IGNORED') return 'default';
  return 'info';
}

function safeJsonPreview(value) {
  if (!value) return '{}';
  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch (_err) {
    return String(value);
  }
}

function errorMessage(err, fallback) {
  return err?.response?.data?.message || err?.message || fallback;
}

export default function PayPalCheckoutAdmin() {
  const { accessToken } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [siteCode, setSiteCode] = useState('LIONTV_PREMIUM');
  const [tab, setTab] = useState(0);
  const [overview, setOverview] = useState({});
  const [products, setProducts] = useState([]);
  const [plans, setPlans] = useState([]);
  const [sessions, setSessions] = useState({ items: [], total: 0, page: 0, size: 10 });
  const [webhooks, setWebhooks] = useState({ items: [], total: 0, page: 0, size: 10 });
  const [sessionStatus, setSessionStatus] = useState('');
  const [webhookStatus, setWebhookStatus] = useState('');
  const [sessionSearch, setSessionSearch] = useState('');
  const [webhookSearch, setWebhookSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [workingId, setWorkingId] = useState('');
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadOverviewAndCatalog = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError('');
    try {
      const [overviewPayload, productsPayload, plansPayload] = await Promise.all([
        getPayPalCheckoutOverview({ siteCode }),
        listPayPalProducts({ siteCode }),
        listPayPalPlans({ siteCode })
      ]);
      setOverview(overviewPayload || {});
      setProducts(productsPayload);
      setPlans(plansPayload);
    } catch (err) {
      const message = errorMessage(err, 'No se pudo cargar PayPal Checkout.');
      setError(message);
      enqueueSnackbar(message, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [accessToken, enqueueSnackbar, siteCode]);

  const loadSessions = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError('');
    try {
      const payload = await listPayPalSessions({
        siteCode,
        status: sessionStatus || undefined,
        search: sessionSearch || undefined,
        page: sessions.page,
        size: sessions.size
      });
      setSessions(payload);
    } catch (err) {
      const message = errorMessage(err, 'No se pudieron cargar las sesiones PayPal.');
      setError(message);
      enqueueSnackbar(message, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [accessToken, enqueueSnackbar, sessionSearch, sessionStatus, sessions.page, sessions.size, siteCode]);

  const loadWebhooks = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError('');
    try {
      const payload = await listPayPalWebhooks({
        siteCode,
        processingStatus: webhookStatus || undefined,
        search: webhookSearch || undefined,
        page: webhooks.page,
        size: webhooks.size
      });
      setWebhooks(payload);
    } catch (err) {
      const message = errorMessage(err, 'No se pudieron cargar los webhooks PayPal.');
      setError(message);
      enqueueSnackbar(message, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [accessToken, enqueueSnackbar, siteCode, webhookSearch, webhookStatus, webhooks.page, webhooks.size]);

  useEffect(() => {
    if (tab <= 2) {
      loadOverviewAndCatalog();
    } else if (tab === 3) {
      loadSessions();
    } else {
      loadWebhooks();
    }
  }, [loadOverviewAndCatalog, loadSessions, loadWebhooks, refreshKey, tab]);

  const metrics = useMemo(
    () => [
      {
        title: 'Sesiones',
        value: overview.totalSessions ?? 0,
        helper: 'Total historico filtrado',
        color: 'primary',
        icon: <CreditCardOutlinedIcon fontSize="small" />
      },
      {
        title: 'Activas',
        value: overview.activeSessions ?? 0,
        helper: formatMoney(overview.activeRevenue, 'USD'),
        color: 'success',
        icon: <PaidOutlinedIcon fontSize="small" />
      },
      {
        title: 'Pendientes',
        value: overview.pendingSessions ?? 0,
        helper: 'Esperando confirmacion PayPal',
        color: 'warning',
        icon: <EventRepeatOutlinedIcon fontSize="small" />
      },
      {
        title: 'Webhooks fallidos',
        value: overview.failedWebhooks ?? 0,
        helper: `${overview.totalWebhooks ?? 0} eventos recibidos`,
        color: 'error',
        icon: <ErrorOutlineIcon fontSize="small" />
      }
    ],
    [overview]
  );

  const refreshCurrent = () => setRefreshKey((value) => value + 1);

  const runSyncPlan = async (plan) => {
    setWorkingId(`sync-${plan.planCode}`);
    try {
      await syncPayPalPlan(plan.planCode, { siteCode: plan.siteCode || siteCode });
      enqueueSnackbar('Plan sincronizado con PayPal.', { variant: 'success' });
      refreshCurrent();
    } catch (err) {
      enqueueSnackbar(errorMessage(err, 'No se pudo sincronizar el plan.'), { variant: 'error' });
    } finally {
      setWorkingId('');
    }
  };

  const runRefreshSession = async (row) => {
    setWorkingId(`refresh-${row.checkoutId}`);
    try {
      await refreshPayPalSession(row.checkoutId);
      enqueueSnackbar('Sesion actualizada desde PayPal.', { variant: 'success' });
      refreshCurrent();
    } catch (err) {
      enqueueSnackbar(errorMessage(err, 'No se pudo refrescar la sesion.'), { variant: 'error' });
    } finally {
      setWorkingId('');
    }
  };

  const runReprocessWebhook = async (row) => {
    setWorkingId(`webhook-${row.eventId}`);
    try {
      await reprocessPayPalWebhook(row.eventId);
      enqueueSnackbar('Webhook reprocesado.', { variant: 'success' });
      refreshCurrent();
    } catch (err) {
      enqueueSnackbar(errorMessage(err, 'No se pudo reprocesar el webhook.'), { variant: 'error' });
    } finally {
      setWorkingId('');
    }
  };

  const renderStatus = (value) => (
    <Chip label={valueOrDash(value)} color={statusColor(value)} size="small" variant="outlined" sx={{ fontWeight: 700 }} />
  );

  const renderProducts = () => (
    <ResponsiveEntityView
      isMobile={isMobile}
      desktopContent={
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Sitio</TableCell>
                <TableCell>Producto local</TableCell>
                <TableCell>Producto PayPal</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Actualizado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((row) => (
                <TableRow hover key={`${row.siteCode}-${row.productCode}`}>
                  <TableCell>{row.siteCode}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{valueOrDash(row.paypalProductId)}</TableCell>
                  <TableCell>{renderStatus(row.status)}</TableCell>
                  <TableCell>{formatDate(row.updatedAt || row.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      }
      mobileContent={
        <Stack spacing={1.25}>
          {products.map((row) => (
            <MobileSummaryCard key={`${row.siteCode}-${row.productCode}`} title={row.name} subtitle={row.siteCode} chips={renderStatus(row.status)}>
              <MobileFieldGrid
                fields={[
                  { label: 'Producto local', value: row.productCode },
                  { label: 'Producto PayPal', value: row.paypalProductId },
                  { label: 'Actualizado', value: formatDate(row.updatedAt || row.createdAt) }
                ]}
              />
            </MobileSummaryCard>
          ))}
        </Stack>
      }
    />
  );

  const renderPlans = () => (
    <ResponsiveEntityView
      isMobile={isMobile}
      desktopContent={
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Plan</TableCell>
                <TableCell>Sitio</TableCell>
                <TableCell>Plan PayPal</TableCell>
                <TableCell>Precio</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="right">Accion</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {plans.map((row) => {
                const disabled = Number(row.price || 0) <= 0 || Boolean(workingId);
                return (
                  <TableRow hover key={`${row.siteCode}-${row.planCode}`}>
                    <TableCell>
                      <Typography variant="subtitle2">{row.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {row.profileCount} perfil(es)
                      </Typography>
                    </TableCell>
                    <TableCell>{row.siteCode}</TableCell>
                    <TableCell>{valueOrDash(row.paypalPlanId)}</TableCell>
                    <TableCell>{formatMoney(row.price, row.currencyCode)}</TableCell>
                    <TableCell>{renderStatus(row.status)}</TableCell>
                    <TableCell align="right">
                      <Tooltip title={disabled ? 'Plan no activo para sincronizar' : 'Sincronizar con PayPal'}>
                        <span>
                          <IconButton disabled={disabled} onClick={() => runSyncPlan(row)} size="small">
                            <SyncIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      }
      mobileContent={
        <Stack spacing={1.25}>
          {plans.map((row) => {
            const disabled = Number(row.price || 0) <= 0 || Boolean(workingId);
            return (
              <MobileSummaryCard
                key={`${row.siteCode}-${row.planCode}`}
                title={row.name}
                subtitle={`${row.siteCode} / ${formatMoney(row.price, row.currencyCode)}`}
                chips={renderStatus(row.status)}
                actions={
                  <ResponsiveActionBar justifyContent="flex-start">
                    <Button disabled={disabled} onClick={() => runSyncPlan(row)} size="small" startIcon={<SyncIcon />}>
                      Sincronizar
                    </Button>
                  </ResponsiveActionBar>
                }
              >
                <MobileFieldGrid
                  fields={[
                    { label: 'Plan local', value: row.planCode },
                    { label: 'Plan PayPal', value: row.paypalPlanId },
                    { label: 'Perfiles', value: row.profileCount }
                  ]}
                />
              </MobileSummaryCard>
            );
          })}
        </Stack>
      }
    />
  );

  const renderSessions = () => (
    <ResponsiveEntityView
      isMobile={isMobile}
      desktopContent={
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Checkout</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Plan</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Suscripcion PayPal</TableCell>
                <TableCell>Creado</TableCell>
                <TableCell align="right">Accion</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sessions.items.map((row) => (
                <TableRow hover key={row.checkoutId}>
                  <TableCell>{row.checkoutId}</TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">{row.customerName}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {row.email} / {row.phone}
                    </Typography>
                  </TableCell>
                  <TableCell>{row.planName}</TableCell>
                  <TableCell>{renderStatus(row.status)}</TableCell>
                  <TableCell>{valueOrDash(row.paypalSubscriptionId)}</TableCell>
                  <TableCell>{formatDate(row.createdAt)}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Refrescar desde PayPal">
                      <span>
                        <IconButton
                          disabled={!row.paypalSubscriptionId || Boolean(workingId)}
                          onClick={() => runRefreshSession(row)}
                          size="small"
                        >
                          <RefreshIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      }
      mobileContent={
        <Stack spacing={1.25}>
          {sessions.items.map((row) => (
            <MobileSummaryCard
              key={row.checkoutId}
              title={row.customerName}
              subtitle={`${row.planName} / ${row.checkoutId}`}
              chips={renderStatus(row.status)}
              actions={
                <ResponsiveActionBar justifyContent="flex-start">
                  <Button
                    disabled={!row.paypalSubscriptionId || Boolean(workingId)}
                    onClick={() => runRefreshSession(row)}
                    size="small"
                    startIcon={<RefreshIcon />}
                  >
                    Refrescar
                  </Button>
                </ResponsiveActionBar>
              }
            >
              <MobileFieldGrid
                fields={[
                  { label: 'Email', value: row.email },
                  { label: 'Telefono', value: row.phone },
                  { label: 'Suscripcion PayPal', value: row.paypalSubscriptionId },
                  { label: 'Creado', value: formatDate(row.createdAt) }
                ]}
              />
            </MobileSummaryCard>
          ))}
        </Stack>
      }
      pagination={
        <TablePagination
          component="div"
          count={sessions.total}
          onPageChange={(_, nextPage) => setSessions((current) => ({ ...current, page: nextPage }))}
          onRowsPerPageChange={(event) => setSessions((current) => ({ ...current, page: 0, size: Number(event.target.value) }))}
          page={sessions.page}
          rowsPerPage={sessions.size}
          rowsPerPageOptions={[10, 25, 50]}
        />
      }
    />
  );

  const renderWebhooks = () => (
    <ResponsiveEntityView
      isMobile={isMobile}
      desktopContent={
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Evento</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Checkout</TableCell>
                <TableCell>Suscripcion PayPal</TableCell>
                <TableCell>Recibido</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {webhooks.items.map((row) => (
                <TableRow hover key={row.eventId}>
                  <TableCell>{row.eventId}</TableCell>
                  <TableCell>{row.eventType}</TableCell>
                  <TableCell>{renderStatus(row.processingStatus)}</TableCell>
                  <TableCell>{valueOrDash(row.checkoutId)}</TableCell>
                  <TableCell>{valueOrDash(row.paypalSubscriptionId)}</TableCell>
                  <TableCell>{formatDate(row.receivedAt)}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Ver payload">
                      <IconButton onClick={() => setPreview(row)} size="small">
                        <VisibilityOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Reprocesar">
                      <span>
                        <IconButton disabled={Boolean(workingId)} onClick={() => runReprocessWebhook(row)} size="small">
                          <ReplayIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      }
      mobileContent={
        <Stack spacing={1.25}>
          {webhooks.items.map((row) => (
            <MobileSummaryCard
              key={row.eventId}
              title={row.eventType}
              subtitle={row.eventId}
              chips={renderStatus(row.processingStatus)}
              actions={
                <ResponsiveActionBar justifyContent="flex-start">
                  <Button onClick={() => setPreview(row)} size="small" startIcon={<VisibilityOutlinedIcon />}>
                    Payload
                  </Button>
                  <Button disabled={Boolean(workingId)} onClick={() => runReprocessWebhook(row)} size="small" startIcon={<ReplayIcon />}>
                    Reprocesar
                  </Button>
                </ResponsiveActionBar>
              }
            >
              <MobileFieldGrid
                fields={[
                  { label: 'Checkout', value: row.checkoutId },
                  { label: 'Suscripcion PayPal', value: row.paypalSubscriptionId },
                  { label: 'Recibido', value: formatDate(row.receivedAt) },
                  { label: 'Error', value: row.errorMessage }
                ]}
              />
            </MobileSummaryCard>
          ))}
        </Stack>
      }
      pagination={
        <TablePagination
          component="div"
          count={webhooks.total}
          onPageChange={(_, nextPage) => setWebhooks((current) => ({ ...current, page: nextPage }))}
          onRowsPerPageChange={(event) => setWebhooks((current) => ({ ...current, page: 0, size: Number(event.target.value) }))}
          page={webhooks.page}
          rowsPerPage={webhooks.size}
          rowsPerPageOptions={[10, 25, 50]}
        />
      }
    />
  );

  const emptyVisible =
    (tab === 1 && !products.length) ||
    (tab === 2 && !plans.length) ||
    (tab === 3 && !sessions.items.length) ||
    (tab === 4 && !webhooks.items.length);

  return (
    <Stack spacing={2.5}>
      <MainCard
        title="PayPal Checkout"
        secondary={
          <Button disabled={loading} onClick={refreshCurrent} startIcon={<RefreshIcon />} variant="outlined">
            Actualizar
          </Button>
        }
      >
        <Stack spacing={2}>
          <Typography color="text.secondary">
            Catalogo multi-sitio para monitorear productos, planes, sesiones y webhooks de PayPal.
          </Typography>
          <ResponsiveFilters>
            <TextField label="Sitio" select value={siteCode} onChange={(event) => setSiteCode(event.target.value)}>
              {SITE_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            {tab === 3 ? (
              <>
                <TextField label="Estado" select value={sessionStatus} onChange={(event) => setSessionStatus(event.target.value)}>
                  {SESSION_STATUS_OPTIONS.map((option) => (
                    <MenuItem key={option.value || 'all'} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Buscar sesion"
                  value={sessionSearch}
                  onChange={(event) => {
                    setSessionSearch(event.target.value);
                    setSessions((current) => ({ ...current, page: 0 }));
                  }}
                  InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
                />
              </>
            ) : null}
            {tab === 4 ? (
              <>
                <TextField label="Estado webhook" select value={webhookStatus} onChange={(event) => setWebhookStatus(event.target.value)}>
                  {WEBHOOK_STATUS_OPTIONS.map((option) => (
                    <MenuItem key={option.value || 'all'} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Buscar webhook"
                  value={webhookSearch}
                  onChange={(event) => {
                    setWebhookSearch(event.target.value);
                    setWebhooks((current) => ({ ...current, page: 0 }));
                  }}
                  InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
                />
              </>
            ) : null}
          </ResponsiveFilters>
        </Stack>
      </MainCard>

      {error ? <Alert severity="error">{error}</Alert> : null}

      <ResponsiveMetricGrid columns={{ xs: 1, sm: 2, lg: 4 }}>
        {metrics.map((metric) => (
          <LionMetricCard key={metric.title} {...metric} />
        ))}
      </ResponsiveMetricGrid>

      <MainCard content={false}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: { xs: 1, sm: 2 } }}>
          <Tabs value={tab} onChange={(_, value) => setTab(value)} variant="scrollable" scrollButtons="auto">
            <Tab icon={<AccountTreeOutlinedIcon />} iconPosition="start" label="Resumen" />
            <Tab icon={<CreditCardOutlinedIcon />} iconPosition="start" label="Productos" />
            <Tab icon={<PaidOutlinedIcon />} iconPosition="start" label="Planes" />
            <Tab icon={<EventRepeatOutlinedIcon />} iconPosition="start" label="Sesiones" />
            <Tab icon={<ErrorOutlineIcon />} iconPosition="start" label="Webhooks" />
          </Tabs>
        </Box>
        <Box sx={{ p: { xs: 1.25, sm: 2 } }}>
          {loading ? <Alert severity="info">Cargando informacion de PayPal Checkout...</Alert> : null}
          {!loading && emptyVisible ? <Alert severity="info">No hay registros para los filtros actuales.</Alert> : null}
          {tab === 0 ? (
            <Stack spacing={1.5}>
              <Typography variant="h4">Resumen operativo</Typography>
              <Typography color="text.secondary">
                Viva Player VIP esta activo para checkout publico. LionTV Premium queda preparado para sincronizar cuando se definan sus planes.
              </Typography>
            </Stack>
          ) : null}
          {tab === 1 ? renderProducts() : null}
          {tab === 2 ? renderPlans() : null}
          {tab === 3 ? renderSessions() : null}
          {tab === 4 ? renderWebhooks() : null}
        </Box>
      </MainCard>

      <Dialog fullWidth maxWidth="md" open={Boolean(preview)} onClose={() => setPreview(null)}>
        <DialogTitle>Payload webhook</DialogTitle>
        <DialogContent>
          <Box
            component="pre"
            sx={{
              m: 0,
              p: 2,
              borderRadius: 2,
              bgcolor: 'background.default',
              overflow: 'auto',
              fontSize: 12,
              whiteSpace: 'pre-wrap'
            }}
          >
            {safeJsonPreview(preview?.payloadJson)}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreview(null)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
