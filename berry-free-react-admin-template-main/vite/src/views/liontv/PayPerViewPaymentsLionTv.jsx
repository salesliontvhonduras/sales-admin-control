import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import useAuth from 'hooks/useAuth';

import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
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
  if (status === 'PAID') return 'success';
  if (status === 'PENDING') return 'warning';
  if (status === 'REVOKED') return 'error';
  if (status === 'EXPIRED') return 'default';
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

function compactId(value) {
  if (value === null || value === undefined || value === '') return '-';
  return String(value);
}

function urlHost(value) {
  if (!value) return 'Sin link';
  try {
    return new URL(value).host;
  } catch (_err) {
    return 'Link configurado';
  }
}

function inferPaymentMethod(value) {
  const url = String(value || '').toLowerCase();
  if (!url) return 'Sin link';
  if (url.includes('paypal')) return 'PayPal';
  if (url.includes('stripe') || url.includes('card') || url.includes('tarjeta') || url.includes('checkout')) return 'Tarjeta';
  return 'Link de pago';
}

function getErrorMessage(err, fallback) {
  if (err?.response?.status === 403) return 'No tienes permiso para realizar esta accion en Pay Per View.';
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

function PaymentLinkActions({ purchase, onCopy, size = 'medium' }) {
  const hasPaymentUrl = Boolean(purchase?.paymentUrl);

  return (
    <Stack direction="row" spacing={0.5} alignItems="center">
      <Tooltip title={hasPaymentUrl ? 'Abrir link de pago' : 'Sin link de pago'}>
        <span>
          <IconButton
            size={size}
            disabled={!hasPaymentUrl}
            onClick={() => window.open(purchase.paymentUrl, '_blank', 'noopener,noreferrer')}
            sx={{ color: premium.text, bgcolor: 'rgba(255,255,255,0.06)', '&:hover': { bgcolor: 'rgba(255,255,255,0.12)' } }}
          >
            <OpenInNewOutlinedIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title={hasPaymentUrl ? 'Copiar link de pago' : 'Sin link de pago'}>
        <span>
          <IconButton
            size={size}
            disabled={!hasPaymentUrl}
            onClick={() => onCopy(purchase.paymentUrl)}
            sx={{ color: premium.text, bgcolor: 'rgba(255,255,255,0.06)', '&:hover': { bgcolor: 'rgba(255,255,255,0.12)' } }}
          >
            <ContentCopyOutlinedIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
    </Stack>
  );
}

function PurchaseMobileCard({ purchase, actionId, onConfirm, onRevoke, onCopy }) {
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
              {purchase.email || `Usuario ${compactId(purchase.userId)}`}
            </Typography>
            <Typography variant="caption" sx={{ color: premium.muted }}>
              Evento {compactId(purchase.eventId)}
            </Typography>
          </Box>
          <Chip size="small" variant="outlined" label={statusLabel(purchase.status)} sx={statusChipSx(purchase.status)} />
        </Stack>

        <Grid container spacing={1.25}>
          <Grid item xs={6}>
            <FieldBlock label="Licencia" value={compactId(purchase.licenseId)} mono />
          </Grid>
          <Grid item xs={6}>
            <FieldBlock label="Usuario" value={compactId(purchase.userId)} mono />
          </Grid>
          <Grid item xs={6}>
            <FieldBlock label="Pago" value={inferPaymentMethod(purchase.paymentUrl)} />
          </Grid>
          <Grid item xs={6}>
            <FieldBlock label="Link" value={urlHost(purchase.paymentUrl)} />
          </Grid>
          <Grid item xs={6}>
            <FieldBlock label="Pagado" value={formatDate(purchase.paidAt)} />
          </Grid>
          <Grid item xs={6}>
            <FieldBlock label="Expira" value={formatDate(purchase.accessExpiresAt)} />
          </Grid>
        </Grid>

        <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
          <PaymentLinkActions purchase={purchase} onCopy={onCopy} size="small" />
          <Typography variant="caption" sx={{ color: premium.dim }}>
            Actualizado {formatDate(purchase.updatedAt)}
          </Typography>
        </Stack>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 1,
            '& .MuiButton-root': {
              minHeight: 46,
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 900
            }
          }}
        >
          <Button
            startIcon={<CheckCircleOutlineIcon />}
            variant="contained"
            disabled={actionId === purchase.id || purchase.status === 'PAID'}
            onClick={() => onConfirm(purchase)}
          >
            Confirmar
          </Button>
          <Button
            startIcon={<RemoveCircleOutlineIcon />}
            color="error"
            variant="outlined"
            disabled={actionId === purchase.id || purchase.status === 'REVOKED'}
            onClick={() => onRevoke(purchase)}
          >
            Revocar
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}

function ConfirmationDialog({ open, dialog, actionId, isMobile, onClose, onSubmit }) {
  const isConfirm = dialog?.action === 'confirm';
  const purchase = dialog?.purchase;

  return (
    <Dialog
      open={open}
      onClose={actionId ? undefined : onClose}
      fullWidth
      maxWidth="sm"
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          bgcolor: premium.surface,
          color: premium.text,
          borderRadius: isMobile ? 0 : '8px',
          border: `1px solid ${premium.border}`,
          backgroundImage: 'none',
          overflow: 'hidden'
        }
      }}
      BackdropProps={{ sx: { bgcolor: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(6px)' } }}
    >
      <DialogTitle sx={{ px: { xs: 2, sm: 2.5 }, py: 2, borderBottom: `1px solid ${premium.border}` }}>
        <Typography variant="h3" sx={{ color: premium.text, fontSize: { xs: 20, sm: 22 } }}>
          {isConfirm ? 'Confirmar pago Pay Per View' : 'Revocar acceso Pay Per View'}
        </Typography>
        <Typography variant="body2" sx={{ color: premium.muted, mt: 0.5 }}>
          {isConfirm ? 'Desbloquea el stream para la licencia seleccionada.' : 'Bloquea el acceso aunque el cliente vuelva a verificar desde la APK.'}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ p: { xs: 2, sm: 2.5 }, bgcolor: premium.surface }}>
        <Stack spacing={2}>
          <Alert severity={isConfirm ? 'success' : 'warning'} sx={{ borderRadius: '8px' }}>
            {isConfirm
              ? 'La APK recibira el stream mientras el acceso siga vigente.'
              : 'Esta accion no elimina la compra, solo revoca el acceso al evento.'}
          </Alert>
          <Box sx={{ p: 2, borderRadius: '8px', border: `1px solid ${premium.border}`, bgcolor: premium.surface2 }}>
            <Stack spacing={1.5}>
              <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                <Typography variant="subtitle1" sx={{ color: premium.text, fontWeight: 900 }}>
                  {purchase?.email || `Usuario ${compactId(purchase?.userId)}`}
                </Typography>
                <Chip size="small" variant="outlined" label={statusLabel(purchase?.status)} sx={statusChipSx(purchase?.status)} />
              </Stack>
              <Grid container spacing={1.5}>
                <Grid item xs={6}>
                  <FieldBlock label="Evento" value={compactId(purchase?.eventId)} />
                </Grid>
                <Grid item xs={6}>
                  <FieldBlock label="Licencia" value={compactId(purchase?.licenseId)} mono />
                </Grid>
                <Grid item xs={6}>
                  <FieldBlock label="Pago" value={inferPaymentMethod(purchase?.paymentUrl)} />
                </Grid>
                <Grid item xs={6}>
                  <FieldBlock label="Expira" value={formatDate(purchase?.accessExpiresAt)} />
                </Grid>
              </Grid>
            </Stack>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions
        sx={{
          p: { xs: 2, sm: 2.5 },
          pt: 1.5,
          borderTop: `1px solid ${premium.border}`,
          bgcolor: 'rgba(16,16,16,0.96)',
          '& .MuiButton-root': { minHeight: 44, borderRadius: '8px', textTransform: 'none', fontWeight: 900 }
        }}
      >
        <Button onClick={onClose} disabled={Boolean(actionId)} fullWidth={isMobile} sx={{ color: premium.text }}>
          Cancelar
        </Button>
        <Button
          variant={isConfirm ? 'contained' : 'outlined'}
          color={isConfirm ? 'primary' : 'error'}
          onClick={onSubmit}
          disabled={Boolean(actionId)}
          fullWidth={isMobile}
        >
          {isConfirm ? 'Confirmar pago' : 'Revocar acceso'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function PayPerViewPaymentsLionTv() {
  const { enqueueSnackbar } = useSnackbar();
  const { accessToken } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [draftFilters, setDraftFilters] = useState({ status: '', search: '', eventId: '' });
  const [queryFilters, setQueryFilters] = useState({ status: '', search: '', eventId: '' });
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
          ...queryFilters,
          ...overrides,
          index: overrides.index ?? 0,
          size: overrides.size ?? purchases.size ?? PAGE_SIZE
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
        const message = getErrorMessage(err, 'No se pudieron cargar los pagos Pay Per View.');
        setError(message);
        enqueueSnackbar(message, { variant: 'error' });
      } finally {
        setLoading(false);
      }
    },
    [accessToken, enqueueSnackbar, purchases.size, queryFilters]
  );

  useEffect(() => {
    loadPurchases({ index: 0 });
  }, [loadPurchases]);

  const updateFilter = (field, value) => {
    setDraftFilters((prev) => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => {
    setQueryFilters(draftFilters);
    setPurchases((prev) => ({ ...prev, index: 0 }));
  };

  const clearFilters = () => {
    const empty = { status: '', search: '', eventId: '' };
    setDraftFilters(empty);
    setQueryFilters(empty);
  };

  const copyText = async (value) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      enqueueSnackbar('Link de pago copiado.', { variant: 'success' });
    } catch (_err) {
      enqueueSnackbar('No se pudo copiar el link.', { variant: 'error' });
    }
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
      await loadPurchases({ index: purchases.index });
    } catch (err) {
      enqueueSnackbar(getErrorMessage(err, 'No se pudo actualizar el pago Pay Per View.'), { variant: 'error' });
    } finally {
      setActionId(null);
    }
  };

  const pageBgSx = {
    '& .MuiCard-root': {
      backgroundImage: 'none'
    }
  };

  if (loading && !(purchases.data || []).length) {
    return <PageLoadingState label="Cargando pagos Pay Per View" />;
  }

  if (error && !(purchases.data || []).length) {
    return <PageErrorState message={error} onRetry={() => loadPurchases({ index: 0 })} />;
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
            <Box sx={{ minWidth: 0 }}>
              <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 1 }}>
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
                  <PaymentsOutlinedIcon />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="h2" sx={{ color: premium.text, fontSize: { xs: 24, sm: 30 }, fontWeight: 900, lineHeight: 1.1 }}>
                    Pagos Pay Per View
                  </Typography>
                  <Typography variant="body2" sx={{ color: premium.muted }}>
                    Confirma pagos, revoca accesos y audita eventos comprados desde la APK.
                  </Typography>
                </Box>
              </Stack>
            </Box>
            <Button
              startIcon={<RefreshIcon />}
              variant="contained"
              onClick={() => loadPurchases({ index: purchases.index })}
              disabled={loading}
              sx={{ minHeight: 44, borderRadius: '8px', textTransform: 'none', fontWeight: 900 }}
            >
              Actualizar
            </Button>
          </Stack>

          <Grid container spacing={1.5}>
            <Grid item xs={6} md={3}>
              <MetricTile icon={<EventAvailableOutlinedIcon />} label="Total filtrado" value={purchases.total || 0} helper="Compras que cumplen el filtro" />
            </Grid>
            <Grid item xs={6} md={3}>
              <MetricTile icon={<PaymentsOutlinedIcon />} label="Pendientes visibles" value={currentPageStats.PENDING || 0} tone="warning" helper="Esperan confirmacion" />
            </Grid>
            <Grid item xs={6} md={3}>
              <MetricTile icon={<CheckCircleOutlineIcon />} label="Pagados visibles" value={currentPageStats.PAID || 0} tone="success" helper="Acceso desbloqueado" />
            </Grid>
            <Grid item xs={6} md={3}>
              <MetricTile icon={<RemoveCircleOutlineIcon />} label="Revocados visibles" value={currentPageStats.REVOKED || 0} tone="error" helper="Acceso bloqueado" />
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
                Busca por cliente, licencia o evento sin recargar toda la consola.
              </Typography>
            </Box>
          </Stack>
          <Grid container spacing={1.5} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                select
                label="Estado"
                value={draftFilters.status}
                onChange={(event) => updateFilter('status', event.target.value)}
                size="small"
                sx={{
                  '& .MuiInputBase-root': { minHeight: 46, borderRadius: '8px', bgcolor: premium.surface2, color: premium.text },
                  '& .MuiInputLabel-root': { color: premium.muted },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: premium.border },
                  '& .MuiSvgIcon-root': { color: premium.muted }
                }}
              >
                {STATUS_OPTIONS.map((option) => (
                  <MenuItem value={option.value} key={option.value || 'all'}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Evento"
                value={draftFilters.eventId}
                onChange={(event) => updateFilter('eventId', event.target.value)}
                size="small"
                sx={{
                  '& .MuiInputBase-root': { minHeight: 46, borderRadius: '8px', bgcolor: premium.surface2, color: premium.text },
                  '& .MuiInputLabel-root': { color: premium.muted },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: premium.border }
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Buscar email/licencia"
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
                sx={{
                  '& .MuiInputBase-root': { minHeight: 46, borderRadius: '8px', bgcolor: premium.surface2, color: premium.text },
                  '& .MuiInputLabel-root': { color: premium.muted },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: premium.border }
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Stack direction={{ xs: 'column', sm: 'row', md: 'column' }} spacing={1}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={applyFilters}
                  disabled={loading}
                  sx={{ minHeight: 44, borderRadius: '8px', textTransform: 'none', fontWeight: 900 }}
                >
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
                Compras
              </Typography>
              <Typography variant="caption" sx={{ color: premium.muted }}>
                Pagina {Number(purchases.index || 0) + 1}. Mostrando {(purchases.data || []).length} de {purchases.total || 0} registros.
              </Typography>
            </Box>
            {loading ? <Chip size="small" label="Actualizando..." sx={{ color: premium.warning, bgcolor: 'rgba(246,199,107,0.12)' }} /> : null}
          </Stack>

          {isMobile ? (
            <Box>
              {(purchases.data || []).map((purchase) => (
                <PurchaseMobileCard
                  key={purchase.id}
                  purchase={purchase}
                  actionId={actionId}
                  onConfirm={(row) => setConfirmDialog({ purchase: row, action: 'confirm' })}
                  onRevoke={(row) => setConfirmDialog({ purchase: row, action: 'revoke' })}
                  onCopy={copyText}
                />
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
                    <TableCell>Cliente</TableCell>
                    <TableCell>Evento</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Pago</TableCell>
                    <TableCell>Fechas</TableCell>
                    <TableCell align="right">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(purchases.data || []).map((purchase) => (
                    <TableRow
                      key={purchase.id}
                      hover
                      sx={{
                        '& td': { borderColor: premium.border, color: premium.text },
                        '&:hover td': { bgcolor: 'rgba(255,255,255,0.03)' }
                      }}
                    >
                      <TableCell sx={{ maxWidth: 260 }}>
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
                            <AccountCircleOutlinedIcon fontSize="small" />
                          </Box>
                          <Box sx={{ minWidth: 0 }}>
                            <Typography variant="subtitle2" sx={{ color: premium.text, fontWeight: 900, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {purchase.email || `Usuario ${compactId(purchase.userId)}`}
                            </Typography>
                            <Typography variant="caption" sx={{ color: premium.dim }}>
                              Lic. {compactId(purchase.licenseId)} | User {compactId(purchase.userId)}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack spacing={0.25}>
                          <Typography variant="body2" sx={{ color: premium.text, fontWeight: 800 }}>
                            {compactId(purchase.eventId)}
                          </Typography>
                          <Typography variant="caption" sx={{ color: premium.dim }}>
                            Compra #{compactId(purchase.id)}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip size="small" variant="outlined" label={statusLabel(purchase.status)} sx={statusChipSx(purchase.status)} />
                      </TableCell>
                      <TableCell sx={{ maxWidth: 220 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Box sx={{ minWidth: 0 }}>
                            <Typography variant="body2" sx={{ color: premium.text, fontWeight: 800 }}>
                              {inferPaymentMethod(purchase.paymentUrl)}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ color: premium.dim, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 150 }}
                              title={purchase.paymentUrl || ''}
                            >
                              {urlHost(purchase.paymentUrl)}
                            </Typography>
                          </Box>
                          <PaymentLinkActions purchase={purchase} onCopy={copyText} size="small" />
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ minWidth: 240 }}>
                        <Stack spacing={0.25}>
                          <Typography variant="caption" sx={{ color: premium.muted }}>
                            Pagado: {formatDate(purchase.paidAt)}
                          </Typography>
                          <Typography variant="caption" sx={{ color: premium.muted }}>
                            Expira: {formatDate(purchase.accessExpiresAt)}
                          </Typography>
                          <Typography variant="caption" sx={{ color: premium.dim }}>
                            Actualizado: {formatDate(purchase.updatedAt)}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Button
                            size="small"
                            startIcon={<CheckCircleOutlineIcon />}
                            variant="contained"
                            disabled={actionId === purchase.id || purchase.status === 'PAID'}
                            onClick={() => setConfirmDialog({ purchase, action: 'confirm' })}
                            sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 900 }}
                          >
                            Confirmar
                          </Button>
                          <Button
                            size="small"
                            startIcon={<RemoveCircleOutlineIcon />}
                            color="error"
                            variant="outlined"
                            disabled={actionId === purchase.id || purchase.status === 'REVOKED'}
                            onClick={() => setConfirmDialog({ purchase, action: 'revoke' })}
                            sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 900 }}
                          >
                            Revocar
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {!loading && !(purchases.data || []).length && (
            <Alert
              icon={<LinkOutlinedIcon />}
              severity="info"
              sx={{ borderRadius: '8px', bgcolor: 'rgba(255,255,255,0.06)', color: premium.text, border: `1px solid ${premium.border}` }}
            >
              No hay compras Pay Per View con los filtros actuales.
            </Alert>
          )}

          <Divider sx={{ borderColor: premium.border }} />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }}>
            <Typography variant="caption" sx={{ color: premium.muted }}>
              Mostrando {(purchases.data || []).length} de {purchases.total || 0} registros filtrados.
            </Typography>
            <Stack direction="row" spacing={1} sx={{ '& .MuiButton-root': { minHeight: 42, borderRadius: '8px', textTransform: 'none', fontWeight: 900 } }}>
              <Button
                variant="outlined"
                fullWidth={isMobile}
                disabled={loading || Number(purchases.index || 0) <= 0}
                onClick={() => loadPurchases({ index: Math.max(0, Number(purchases.index || 0) - 1) })}
                sx={{ color: premium.text, borderColor: premium.strongBorder }}
              >
                Anterior
              </Button>
              <Button
                variant="outlined"
                fullWidth={isMobile}
                disabled={loading || !purchases.hasNext}
                onClick={() => loadPurchases({ index: Number(purchases.index || 0) + 1 })}
                sx={{ color: premium.text, borderColor: premium.strongBorder }}
              >
                Siguiente
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </MainCard>

      <ConfirmationDialog
        open={Boolean(confirmDialog)}
        dialog={confirmDialog}
        actionId={actionId}
        isMobile={isMobile}
        onClose={() => setConfirmDialog(null)}
        onSubmit={handlePurchaseAction}
      />
    </Stack>
  );
}
