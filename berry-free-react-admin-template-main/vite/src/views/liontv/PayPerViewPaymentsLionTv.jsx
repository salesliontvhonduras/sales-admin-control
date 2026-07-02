import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import useAuth from 'hooks/useAuth';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import {
  confirmAdminPayPerViewPurchase,
  listAdminPayPerViewPurchases,
  revokeAdminPayPerViewPurchase
} from 'api/liontv-ecommerce-site';
import MainCard from 'ui-component/cards/MainCard';
import { PageErrorState, PageLoadingState } from 'ui-component/feedback/PageState';
import { gridSpacing } from 'store/constant';

const PAGE_SIZE = 25;

const STATUS_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'PENDING', label: 'Pendientes' },
  { value: 'PAID', label: 'Pagados' },
  { value: 'REVOKED', label: 'Revocados' },
  { value: 'EXPIRED', label: 'Expirados' }
];

function statusLabel(status) {
  return STATUS_OPTIONS.find((option) => option.value === status)?.label || status || 'Sin estado';
}

function statusColor(status) {
  if (status === 'PAID') return 'success';
  if (status === 'PENDING') return 'warning';
  if (status === 'REVOKED') return 'error';
  return 'default';
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

function MetricCard({ label, value, tone = 'default' }) {
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <Stack spacing={0.5}>
          <Typography variant="caption" color="text.secondary" fontWeight={700} textTransform="uppercase">
            {label}
          </Typography>
          <Typography variant="h3" color={tone === 'warning' ? 'warning.main' : tone === 'success' ? 'success.main' : tone === 'error' ? 'error.main' : 'text.primary'}>
            {value}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function PayPerViewPaymentsLionTv() {
  const { enqueueSnackbar } = useSnackbar();
  const { accessToken } = useAuth();

  const [filters, setFilters] = useState({ status: '', search: '', eventId: '' });
  const [purchases, setPurchases] = useState({ data: [], total: 0, index: 0, size: PAGE_SIZE, hasNext: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionId, setActionId] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);

  const currentPageStats = useMemo(() => {
    const data = purchases.data || [];
    return data.reduce(
      (totals, purchase) => {
        totals[purchase.status] = (totals[purchase.status] || 0) + 1;
        return totals;
      },
      { PENDING: 0, PAID: 0, REVOKED: 0, EXPIRED: 0 }
    );
  }, [purchases.data]);

  const loadPurchases = useCallback(
    async (overrides = {}) => {
      if (!accessToken) return;
      setLoading(true);
      setError('');
      try {
        const params = {
          ...filters,
          ...overrides,
          index: overrides.index ?? 0,
          size: overrides.size ?? PAGE_SIZE
        };
        const payload = await listAdminPayPerViewPurchases(params, { skipAuthRedirect: true });
        setPurchases({
          data: payload?.data || [],
          total: Number(payload?.total || 0),
          index: Number(payload?.index || 0),
          size: Number(payload?.size || PAGE_SIZE),
          hasNext: Boolean(payload?.hasNext)
        });
      } catch (err) {
        const message = err?.response?.data?.message || 'No se pudieron cargar los pagos Pay Per View.';
        setError(message);
        enqueueSnackbar(message, { variant: 'error' });
      } finally {
        setLoading(false);
      }
    },
    [accessToken, enqueueSnackbar, filters]
  );

  useEffect(() => {
    loadPurchases({ index: 0 });
  }, [loadPurchases]);

  const updateFilter = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPurchases((prev) => ({ ...prev, index: 0 }));
  };

  const handlePurchaseAction = async () => {
    if (!confirmDialog?.purchase?.id || !confirmDialog?.action) return;
    const { purchase, action } = confirmDialog;
    setActionId(purchase.id);
    try {
      if (action === 'confirm') {
        await confirmAdminPayPerViewPurchase(purchase.id, { skipAuthRedirect: true });
        enqueueSnackbar('Pago Pay Per View confirmado.', { variant: 'success' });
      } else {
        await revokeAdminPayPerViewPurchase(purchase.id, { skipAuthRedirect: true });
        enqueueSnackbar('Acceso Pay Per View revocado.', { variant: 'success' });
      }
      setConfirmDialog(null);
      loadPurchases();
    } catch (err) {
      enqueueSnackbar(err?.response?.data?.message || 'No se pudo actualizar el pago Pay Per View.', { variant: 'error' });
    } finally {
      setActionId(null);
    }
  };

  if (loading && !(purchases.data || []).length) {
    return <PageLoadingState label="Cargando pagos Pay Per View" />;
  }

  if (error && !(purchases.data || []).length) {
    return <PageErrorState message={error} onRetry={() => loadPurchases({ index: 0 })} />;
  }

  return (
    <Stack spacing={gridSpacing}>
      <MainCard
        title="Pagos Pay Per View"
        secondary={
          <Button startIcon={<RefreshIcon />} variant="outlined" onClick={() => loadPurchases({ index: purchases.index })} disabled={loading}>
            Actualizar
          </Button>
        }
      >
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Control de accesos pagados
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Confirma pagos manuales, revoca accesos y revisa qué clientes tienen eventos pendientes o desbloqueados. La APK solo recibe el stream cuando el acceso está pagado y vigente.
            </Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={6} md={3}>
              <MetricCard label="Total filtrado" value={purchases.total || 0} />
            </Grid>
            <Grid item xs={6} md={3}>
              <MetricCard label="Pendientes" value={currentPageStats.PENDING || 0} tone="warning" />
            </Grid>
            <Grid item xs={6} md={3}>
              <MetricCard label="Pagados" value={currentPageStats.PAID || 0} tone="success" />
            </Grid>
            <Grid item xs={6} md={3}>
              <MetricCard label="Revocados" value={currentPageStats.REVOKED || 0} tone="error" />
            </Grid>
          </Grid>
        </Stack>
      </MainCard>

      <MainCard title="Filtros">
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField fullWidth select label="Estado" value={filters.status} onChange={(event) => updateFilter('status', event.target.value)}>
              {STATUS_OPTIONS.map((option) => (
                <MenuItem value={option.value} key={option.value || 'all'}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField fullWidth label="Evento" value={filters.eventId} onChange={(event) => updateFilter('eventId', event.target.value)} />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField fullWidth label="Buscar email/licencia" value={filters.search} onChange={(event) => updateFilter('search', event.target.value)} />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button fullWidth variant="contained" onClick={() => loadPurchases({ index: 0 })} disabled={loading}>
              Buscar
            </Button>
          </Grid>
        </Grid>
      </MainCard>

      <MainCard
        title="Compras"
        secondary={
          <Typography variant="caption" color="text.secondary">
            Página {Number(purchases.index || 0) + 1}
          </Typography>
        }
      >
        <Stack spacing={1.5}>
          {(purchases.data || []).map((purchase) => (
            <Card key={purchase.id} variant="outlined">
              <CardContent>
                <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2} alignItems={{ xs: 'stretch', lg: 'center' }} justifyContent="space-between">
                  <Stack spacing={1}>
                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                      <Typography variant="h5">{purchase.email || `Usuario ${purchase.userId || '-'}`}</Typography>
                      <Chip size="small" label={statusLabel(purchase.status)} color={statusColor(purchase.status)} />
                    </Stack>
                    <Grid container spacing={1.5}>
                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="caption" color="text.secondary">
                          Evento
                        </Typography>
                        <Typography variant="body2">{purchase.eventId || '-'}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="caption" color="text.secondary">
                          Licencia
                        </Typography>
                        <Typography variant="body2">{purchase.licenseId || '-'}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="caption" color="text.secondary">
                          Actualizado
                        </Typography>
                        <Typography variant="body2">{formatDate(purchase.updatedAt)}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="caption" color="text.secondary">
                          Expira acceso
                        </Typography>
                        <Typography variant="body2">{formatDate(purchase.accessExpiresAt)}</Typography>
                      </Grid>
                    </Grid>
                  </Stack>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ minWidth: { lg: 300 } }}>
                    <Button
                      fullWidth
                      startIcon={<CheckCircleOutlineIcon />}
                      variant="contained"
                      disabled={actionId === purchase.id || purchase.status === 'PAID'}
                      onClick={() => setConfirmDialog({ purchase, action: 'confirm' })}
                    >
                      Confirmar pago
                    </Button>
                    <Button
                      fullWidth
                      startIcon={<RemoveCircleOutlineIcon />}
                      color="error"
                      variant="outlined"
                      disabled={actionId === purchase.id || purchase.status === 'REVOKED'}
                      onClick={() => setConfirmDialog({ purchase, action: 'revoke' })}
                    >
                      Revocar
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          ))}

          {!loading && !(purchases.data || []).length && (
            <Alert severity="info">No hay compras Pay Per View con los filtros actuales.</Alert>
          )}

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              Mostrando {(purchases.data || []).length} de {purchases.total || 0} registros filtrados.
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                disabled={loading || Number(purchases.index || 0) <= 0}
                onClick={() => loadPurchases({ index: Math.max(0, Number(purchases.index || 0) - 1) })}
              >
                Anterior
              </Button>
              <Button
                variant="outlined"
                disabled={loading || !purchases.hasNext}
                onClick={() => loadPurchases({ index: Number(purchases.index || 0) + 1 })}
              >
                Siguiente
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </MainCard>

      <Dialog open={Boolean(confirmDialog)} onClose={() => setConfirmDialog(null)} fullWidth maxWidth="sm">
        <DialogTitle>{confirmDialog?.action === 'confirm' ? 'Confirmar pago Pay Per View' : 'Revocar acceso Pay Per View'}</DialogTitle>
        <DialogContent>
          <Stack spacing={1.5} sx={{ pt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {confirmDialog?.action === 'confirm'
                ? 'El cliente podrá reproducir el evento desde la APK hasta la fecha de expiración configurada.'
                : 'El cliente perderá el acceso a este evento aunque vuelva a verificar el pago.'}
            </Typography>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" fontWeight={700}>
                  {confirmDialog?.purchase?.email || `Usuario ${confirmDialog?.purchase?.userId || '-'}`}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Evento: {confirmDialog?.purchase?.eventId || '-'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Licencia: {confirmDialog?.purchase?.licenseId || '-'}
                </Typography>
              </CardContent>
            </Card>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setConfirmDialog(null)} disabled={Boolean(actionId)}>
            Cancelar
          </Button>
          <Button
            variant={confirmDialog?.action === 'confirm' ? 'contained' : 'outlined'}
            color={confirmDialog?.action === 'confirm' ? 'primary' : 'error'}
            onClick={handlePurchaseAction}
            disabled={Boolean(actionId)}
          >
            {confirmDialog?.action === 'confirm' ? 'Confirmar pago' : 'Revocar acceso'}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
