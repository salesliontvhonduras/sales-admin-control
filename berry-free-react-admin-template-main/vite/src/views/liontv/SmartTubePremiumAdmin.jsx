import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';

import useAuth from 'hooks/useAuth';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import AddIcon from '@mui/icons-material/Add';
import BlockIcon from '@mui/icons-material/Block';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DevicesOtherIcon from '@mui/icons-material/DevicesOther';
import KeyIcon from '@mui/icons-material/Key';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PaymentIcon from '@mui/icons-material/Payment';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import SmartDisplayIcon from '@mui/icons-material/SmartDisplay';
import UpdateIcon from '@mui/icons-material/Update';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

import MainCard from 'ui-component/cards/MainCard';
import LionMetricCard from 'ui-component/cards/LionMetricCard';
import DialogTitleWithClose from 'ui-component/dialogs/DialogTitleWithClose';
import ResponsiveActionBar from 'ui-component/responsive/ResponsiveActionBar';
import ResponsiveFilters from 'ui-component/responsive/ResponsiveFilters';
import ResponsiveMetricGrid from 'ui-component/responsive/ResponsiveMetricGrid';
import { withAlpha } from 'utils/colorUtils';
import { hasPermissionExact } from 'utils/rbac';
import {
  confirmSmartTubePremiumAccountRequest,
  createSmartTubePremiumUser,
  listSmartTubePremiumAccountRequests,
  listSmartTubePremiumDevices,
  listSmartTubePremiumUsers,
  rejectSmartTubePremiumAccountRequest,
  renewSmartTubePremiumLicense,
  resetSmartTubePremiumDevices,
  resetSmartTubePremiumPassword,
  revokeSmartTubePremiumDevice,
  updateSmartTubePremiumDeviceLimit,
  updateSmartTubePremiumUserStatus
} from 'api/smarttube-premium-admin';

const defaultCreateForm = {
  name: '',
  email: '',
  password: '',
  durationDays: 30,
  expiresAt: '',
  deviceLimit: 1,
  active: true
};

const statusOptions = [
  { value: '', label: 'Todos' },
  { value: 'ACTIVE', label: 'Activas' },
  { value: 'EXPIRED', label: 'Vencidas' },
  { value: 'SUSPENDED', label: 'Suspendidas' }
];

const requestStatusOptions = [
  { value: '', label: 'Todas' },
  { value: 'PENDING_PAYMENT', label: 'Pendientes de pago' },
  { value: 'ACTIVATED', label: 'Activadas' },
  { value: 'REJECTED', label: 'Rechazadas' }
];

const statusUpdatePermissions = [
  'ROLE_ADMIN',
  'ADMIN',
  'USER_MANAGEMENT_DISABLE_USER',
  'ROLE_USER_MANAGEMENT_DISABLE_USER',
  'USER_MANAGEMENT_EDIT_USER',
  'ROLE_USER_MANAGEMENT_EDIT_USER',
  'USER_MANAGEMENT_CREATE_USER',
  'ROLE_USER_MANAGEMENT_CREATE_USER'
];

const statusColor = (status) => {
  const value = String(status || '').toUpperCase();
  if (value === 'ACTIVE') return 'success';
  if (value === 'EXPIRED') return 'warning';
  if (value === 'SUSPENDED') return 'default';
  return 'info';
};

const requestStatusColor = (status) => {
  const value = String(status || '').toUpperCase();
  if (value === 'PENDING_PAYMENT') return 'warning';
  if (value === 'ACTIVATED') return 'success';
  if (value === 'REJECTED') return 'default';
  return 'info';
};

const formatDateTime = (value, locale = 'es-HN') => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString(locale);
};

const maskDeviceHash = (value) => {
  const text = String(value || '');
  if (!text) return '-';
  return `...${text.slice(-8).toUpperCase()}`;
};

const modalPaperSx = (theme) => ({
  borderRadius: 3,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.vars.palette.surface.card,
  overflow: 'hidden'
});

const modalContentSx = {
  px: { xs: 1.5, sm: 3 },
  py: { xs: 1.75, sm: 2.5 },
  '& .MuiFormControl-root, & .MuiTextField-root': {
    width: '100%',
    minWidth: 0
  }
};

const modalActionsSx = (theme) => ({
  px: { xs: 1.5, sm: 3 },
  py: { xs: 1.5, sm: 2 },
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: withAlpha(theme.vars.palette.surface.muted, 0.86),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column-reverse',
    alignItems: 'stretch',
    gap: 1,
    '& > .MuiButton-root': {
      width: '100%'
    }
  }
});

export default function SmartTubePremiumAdmin() {
  const { t, i18n } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();
  const theme = useTheme();
  const locale = (i18n?.resolvedLanguage || i18n?.language || 'es').startsWith('en') ? 'en-US' : 'es-HN';
  const canUpdateStatus = hasPermissionExact(user, { any: statusUpdatePermissions });

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState(defaultCreateForm);
  const [renewTarget, setRenewTarget] = useState(null);
  const [renewForm, setRenewForm] = useState({ durationDays: 30, expiresAt: '', deviceLimit: 1 });
  const [passwordTarget, setPasswordTarget] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [deviceTarget, setDeviceTarget] = useState(null);
  const [devices, setDevices] = useState([]);
  const [devicesLoading, setDevicesLoading] = useState(false);
  const [limitTarget, setLimitTarget] = useState(null);
  const [deviceLimitValue, setDeviceLimitValue] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [requestRows, setRequestRows] = useState([]);
  const [requestTotal, setRequestTotal] = useState(0);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [requestPage, setRequestPage] = useState(0);
  const [requestRowsPerPage, setRequestRowsPerPage] = useState(10);
  const [requestSearch, setRequestSearch] = useState('');
  const [requestStatus, setRequestStatus] = useState('PENDING_PAYMENT');
  const [requestRefreshKey, setRequestRefreshKey] = useState(0);
  const [confirmRequestTarget, setConfirmRequestTarget] = useState(null);
  const [confirmRequestForm, setConfirmRequestForm] = useState({ durationDays: 30, expiresAt: '', deviceLimit: 1 });
  const [rejectRequestTarget, setRejectRequestTarget] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const loadRows = useCallback(async () => {
    setLoading(true);
    try {
      const payload = await listSmartTubePremiumUsers(
        {
          index: page,
          size: rowsPerPage,
          search: search || undefined,
          status: status || undefined
        },
        { skipAuthRedirect: true }
      );
      setRows(Array.isArray(payload?.data) ? payload.data : []);
      setTotal(Number(payload?.total || 0));
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || error.message || 'No se pudieron cargar usuarios SmartTube.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar, page, rowsPerPage, search, status]);

  useEffect(() => {
    loadRows();
  }, [loadRows, refreshKey]);

  const loadRequests = useCallback(async () => {
    setRequestsLoading(true);
    try {
      const payload = await listSmartTubePremiumAccountRequests(
        {
          index: requestPage,
          size: requestRowsPerPage,
          search: requestSearch || undefined,
          status: requestStatus || undefined
        },
        { skipAuthRedirect: true }
      );
      setRequestRows(Array.isArray(payload?.data) ? payload.data : []);
      setRequestTotal(Number(payload?.total || 0));
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || error.message || 'No se pudieron cargar solicitudes SmartTube.', { variant: 'error' });
    } finally {
      setRequestsLoading(false);
    }
  }, [enqueueSnackbar, requestPage, requestRowsPerPage, requestSearch, requestStatus]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests, requestRefreshKey]);

  const metrics = useMemo(() => {
    const counts = rows.reduce((acc, row) => {
      const key = String(row.licenseStatus || 'UNKNOWN').toUpperCase();
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    return [
      { title: 'Usuarios', value: total, helper: 'Total filtrado', color: 'primary', icon: <SmartDisplayIcon fontSize="small" /> },
      { title: 'Activas', value: counts.ACTIVE || 0, helper: 'Licencias vigentes', color: 'success', icon: <VerifiedUserIcon fontSize="small" /> },
      { title: 'Vencidas', value: counts.EXPIRED || 0, helper: 'Requieren renovación', color: 'warning', icon: <UpdateIcon fontSize="small" /> },
      { title: 'Suspendidas', value: counts.SUSPENDED || 0, helper: 'Usuarios bloqueados', color: 'default', icon: <BlockIcon fontSize="small" /> }
    ];
  }, [rows, total]);

  const resetCreateForm = () => setCreateForm(defaultCreateForm);

  const handleCreate = async () => {
    setSaving(true);
    try {
      const payload = {
        name: createForm.name,
        email: createForm.email,
        password: createForm.password,
        active: createForm.active,
        durationDays: createForm.expiresAt ? undefined : Number(createForm.durationDays || 30),
        expiresAt: createForm.expiresAt || undefined,
        deviceLimit: Number(createForm.deviceLimit || 1)
      };
      await createSmartTubePremiumUser(payload, { skipAuthRedirect: true });
      enqueueSnackbar('Usuario SmartTube creado.', { variant: 'success' });
      setCreateOpen(false);
      resetCreateForm();
      setRefreshKey((value) => value + 1);
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || error.message || 'No se pudo crear el usuario.', { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const openConfirmRequest = (row) => {
    setConfirmRequestTarget(row);
    setConfirmRequestForm({
      durationDays: Number(row.requestedDurationDays || 30),
      expiresAt: '',
      deviceLimit: Number(row.requestedDeviceLimit || 1)
    });
  };

  const handleConfirmRequest = async () => {
    if (!confirmRequestTarget?.requestId) return;
    setSaving(true);
    try {
      await confirmSmartTubePremiumAccountRequest(
        confirmRequestTarget.requestId,
        {
          durationDays: confirmRequestForm.expiresAt ? undefined : Number(confirmRequestForm.durationDays || 30),
          expiresAt: confirmRequestForm.expiresAt || undefined,
          deviceLimit: Number(confirmRequestForm.deviceLimit || 1)
        },
        { skipAuthRedirect: true }
      );
      enqueueSnackbar('Pago confirmado. Licencia SmartTube activada.', { variant: 'success' });
      setConfirmRequestTarget(null);
      setRefreshKey((value) => value + 1);
      setRequestRefreshKey((value) => value + 1);
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || error.message || 'No se pudo confirmar el pago.', { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleRejectRequest = async () => {
    if (!rejectRequestTarget?.requestId) return;
    setSaving(true);
    try {
      await rejectSmartTubePremiumAccountRequest(rejectRequestTarget.requestId, rejectReason, { skipAuthRedirect: true });
      enqueueSnackbar('Solicitud rechazada.', { variant: 'success' });
      setRejectRequestTarget(null);
      setRejectReason('');
      setRequestRefreshKey((value) => value + 1);
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || error.message || 'No se pudo rechazar la solicitud.', { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleRenew = async () => {
    if (!renewTarget?.userId) return;
    setSaving(true);
    try {
      await renewSmartTubePremiumLicense(
        renewTarget.userId,
        {
          durationDays: renewForm.expiresAt ? undefined : Number(renewForm.durationDays || 30),
          expiresAt: renewForm.expiresAt || undefined,
          deviceLimit: Number(renewForm.deviceLimit || renewTarget.deviceLimit || 1)
        },
        { skipAuthRedirect: true }
      );
      enqueueSnackbar('Licencia renovada.', { variant: 'success' });
      setRenewTarget(null);
      setRefreshKey((value) => value + 1);
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || error.message || 'No se pudo renovar la licencia.', { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleResetPassword = async () => {
    if (!passwordTarget?.userId) return;
    setSaving(true);
    try {
      await resetSmartTubePremiumPassword(passwordTarget.userId, newPassword, { skipAuthRedirect: true });
      enqueueSnackbar('Password actualizado.', { variant: 'success' });
      setPasswordTarget(null);
      setNewPassword('');
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || error.message || 'No se pudo actualizar el password.', { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (row) => {
    if (!canUpdateStatus) {
      enqueueSnackbar('No tienes permiso para cambiar el estado de esta cuenta.', { variant: 'warning' });
      return;
    }

    setSaving(true);
    try {
      await updateSmartTubePremiumUserStatus(row.userId, !row.active, { skipAuthRedirect: true });
      enqueueSnackbar(row.active ? 'Usuario suspendido.' : 'Usuario activado.', { variant: 'success' });
      setRefreshKey((value) => value + 1);
    } catch (error) {
      const status = error?.response?.status || error?.request?.status;
      enqueueSnackbar(
        status === 403
          ? 'No tienes permiso para cambiar el estado de esta cuenta.'
          : error?.response?.data?.message || error.message || 'No se pudo actualizar el usuario.',
        { variant: 'error' }
      );
    } finally {
      setSaving(false);
    }
  };

  const openRenew = (row) => {
    setRenewTarget(row);
    setRenewForm({ durationDays: 30, expiresAt: '', deviceLimit: Number(row.deviceLimit || 1) });
  };

  const openLimit = (row) => {
    setLimitTarget(row);
    setDeviceLimitValue(Number(row.deviceLimit || 1));
  };

  const loadDevices = useCallback(
    async (row) => {
      if (!row?.userId) return;
      setDeviceTarget(row);
      setDevices([]);
      setDevicesLoading(true);
      try {
        const payload = await listSmartTubePremiumDevices(row.userId, { skipAuthRedirect: true });
        setDevices(Array.isArray(payload) ? payload : []);
      } catch (error) {
        enqueueSnackbar(error?.response?.data?.message || error.message || 'No se pudieron cargar dispositivos.', { variant: 'error' });
      } finally {
        setDevicesLoading(false);
      }
    },
    [enqueueSnackbar]
  );

  const handleRevokeDevice = async (device) => {
    if (!deviceTarget?.userId || !device?.id) return;
    setSaving(true);
    try {
      await revokeSmartTubePremiumDevice(deviceTarget.userId, device.id, { skipAuthRedirect: true });
      enqueueSnackbar('Dispositivo desvinculado.', { variant: 'success' });
      const updatedTarget = { ...deviceTarget, deviceCount: Math.max(Number(deviceTarget.deviceCount || 0) - 1, 0) };
      setDeviceTarget(updatedTarget);
      await loadDevices(updatedTarget);
      setRefreshKey((value) => value + 1);
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || error.message || 'No se pudo desvincular el dispositivo.', { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleResetDevices = async () => {
    if (!deviceTarget?.userId) return;
    setSaving(true);
    try {
      await resetSmartTubePremiumDevices(deviceTarget.userId, { skipAuthRedirect: true });
      enqueueSnackbar('Dispositivos reseteados.', { variant: 'success' });
      const updatedTarget = { ...deviceTarget, deviceCount: 0 };
      setDeviceTarget(updatedTarget);
      await loadDevices(updatedTarget);
      setRefreshKey((value) => value + 1);
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || error.message || 'No se pudieron resetear los dispositivos.', { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateDeviceLimit = async () => {
    if (!limitTarget?.userId) return;
    setSaving(true);
    try {
      await updateSmartTubePremiumDeviceLimit(limitTarget.userId, Number(deviceLimitValue || 1), { skipAuthRedirect: true });
      enqueueSnackbar('Límite de dispositivos actualizado.', { variant: 'success' });
      setLimitTarget(null);
      setRefreshKey((value) => value + 1);
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || error.message || 'No se pudo actualizar el límite.', { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <MainCard
      title="SmartTube Premium"
      secondary={
        <ResponsiveActionBar>
          <Button startIcon={<RefreshIcon />} variant="outlined" onClick={() => setRefreshKey((value) => value + 1)} disabled={loading}>
            Actualizar
          </Button>
          <Button startIcon={<AddIcon />} variant="contained" onClick={() => setCreateOpen(true)}>
            Crear usuario
          </Button>
        </ResponsiveActionBar>
      }
    >
      <Stack spacing={2.5}>
        <Alert severity="info" variant="outlined">
          Administra usuarios y vencimientos de la APK Lion TV Premium SmartTube. Las credenciales viven en backend; la APK solo guarda token de sesión.
        </Alert>

        <ResponsiveMetricGrid>
          {metrics.map((metric) => (
            <LionMetricCard key={metric.title} {...metric} />
          ))}
        </ResponsiveMetricGrid>

        <Divider />

        <Stack spacing={1.75}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} alignItems={{ xs: 'stretch', sm: 'center' }} justifyContent="space-between">
            <Box>
              <Typography variant="h4">Solicitudes de creación</Typography>
              <Typography variant="body2" color="text.secondary">
                Clientes que pagaron o están por pagar desde Banrural/PayPal y esperan activación.
              </Typography>
            </Box>
            <Button
              startIcon={<RefreshIcon />}
              variant="outlined"
              onClick={() => setRequestRefreshKey((value) => value + 1)}
              disabled={requestsLoading}
            >
              Actualizar solicitudes
            </Button>
          </Stack>

          <ResponsiveFilters>
            <TextField
              label="Buscar solicitud"
              value={requestSearch}
              onChange={(event) => {
                setRequestSearch(event.target.value);
                setRequestPage(0);
              }}
              placeholder="Nombre o correo"
              InputProps={{ startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} /> }}
            />
            <TextField
              select
              label="Estado de solicitud"
              value={requestStatus}
              onChange={(event) => {
                setRequestStatus(event.target.value);
                setRequestPage(0);
              }}
            >
              {requestStatusOptions.map((option) => (
                <MenuItem key={option.value || 'all'} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </ResponsiveFilters>

          <TableContainer sx={{ borderRadius: 2, border: `1px solid ${theme.palette.divider}`, overflowX: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Pago</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Solicitado</TableCell>
                  <TableCell>Dispositivos</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requestRows.map((row) => (
                  <TableRow key={row.requestId} hover>
                    <TableCell>
                      <Stack spacing={0.2}>
                        <Typography variant="subtitle2">{row.name || '-'}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {row.email}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack spacing={0.4}>
                        <Chip size="small" icon={<PaymentIcon />} label={row.paymentMethod || 'PENDING'} />
                        {row.paymentUrl ? (
                          <Link href={row.paymentUrl} target="_blank" rel="noreferrer" underline="hover" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.4 }}>
                            Abrir link <OpenInNewIcon sx={{ fontSize: 14 }} />
                          </Link>
                        ) : (
                          <Typography variant="caption" color="text.secondary">
                            Link no seleccionado
                          </Typography>
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip size="small" color={requestStatusColor(row.status)} label={row.status || '-'} />
                    </TableCell>
                    <TableCell>{formatDateTime(row.createdAt, locale)}</TableCell>
                    <TableCell>{Number(row.requestedDeviceLimit || 1)}</TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={0.75} justifyContent="flex-end" flexWrap="wrap">
                        <Button
                          size="small"
                          startIcon={<CheckCircleIcon />}
                          color="success"
                          variant="outlined"
                          disabled={row.status !== 'PENDING_PAYMENT'}
                          onClick={() => openConfirmRequest(row)}
                        >
                          Confirmar pago
                        </Button>
                        <Button
                          size="small"
                          startIcon={<CancelIcon />}
                          color="warning"
                          variant="outlined"
                          disabled={row.status !== 'PENDING_PAYMENT'}
                          onClick={() => setRejectRequestTarget(row)}
                        >
                          Rechazar
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
                {!requestsLoading && requestRows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Box sx={{ py: 4, textAlign: 'center' }}>
                        <Typography color="text.secondary">No hay solicitudes SmartTube Premium.</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={requestTotal}
            page={requestPage}
            rowsPerPage={requestRowsPerPage}
            onPageChange={(event, nextPage) => setRequestPage(nextPage)}
            onRowsPerPageChange={(event) => {
              setRequestRowsPerPage(parseInt(event.target.value, 10));
              setRequestPage(0);
            }}
          />
        </Stack>

        <Divider />

        <ResponsiveFilters>
          <TextField
            label="Buscar usuario"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(0);
            }}
            placeholder="Nombre o correo"
            InputProps={{ startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} /> }}
          />
          <TextField
            select
            label="Estado"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(0);
            }}
          >
            {statusOptions.map((option) => (
              <MenuItem key={option.value || 'all'} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </ResponsiveFilters>

        <TableContainer
          sx={{
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
            overflowX: 'auto'
          }}
        >
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Usuario</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Vence</TableCell>
                <TableCell>Dispositivos</TableCell>
                <TableCell>Último acceso</TableCell>
                <TableCell>Serial</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.userId} hover>
                  <TableCell>
                    <Stack spacing={0.2}>
                      <Typography variant="subtitle2">{row.name || '-'}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {row.email}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip size="small" color={statusColor(row.licenseStatus)} label={row.licenseStatus || '-'} />
                  </TableCell>
                  <TableCell>{formatDateTime(row.expiresAt, locale)}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap">
                      <Chip
                        size="small"
                        color={Number(row.deviceCount || 0) >= Number(row.deviceLimit || 1) ? 'warning' : 'success'}
                        label={`${Number(row.deviceCount || 0)} / ${Number(row.deviceLimit || 1)}`}
                      />
                      <Button size="small" variant="text" onClick={() => openLimit(row)}>
                        Límite
                      </Button>
                    </Stack>
                  </TableCell>
                  <TableCell>{formatDateTime(row.lastDeviceSeenAt, locale)}</TableCell>
                  <TableCell>
                    <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                      {row.serialCode || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={0.75} justifyContent="flex-end" flexWrap="wrap">
                      <Button size="small" startIcon={<DevicesOtherIcon />} variant="outlined" onClick={() => loadDevices(row)}>
                        Devices
                      </Button>
                      <Button size="small" startIcon={<UpdateIcon />} variant="outlined" onClick={() => openRenew(row)}>
                        Renovar
                      </Button>
                      <Button size="small" startIcon={<KeyIcon />} variant="outlined" onClick={() => setPasswordTarget(row)}>
                        Password
                      </Button>
                      <Button
                        size="small"
                        color={row.active ? 'warning' : 'success'}
                        variant="outlined"
                        disabled={!canUpdateStatus}
                        title={!canUpdateStatus ? 'No tienes permiso para cambiar el estado de esta cuenta.' : undefined}
                        onClick={() => toggleStatus(row)}
                      >
                        {row.active ? 'Suspender' : 'Activar'}
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7}>
                    <Box sx={{ py: 4, textAlign: 'center' }}>
                      <Typography color="text.secondary">No hay usuarios SmartTube Premium.</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={total}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(event, nextPage) => setPage(nextPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </Stack>

      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} fullWidth maxWidth="sm" PaperProps={{ sx: modalPaperSx }}>
        <DialogTitleWithClose onClose={() => setCreateOpen(false)} title="Crear usuario SmartTube" />
        <DialogContent sx={modalContentSx}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField label="Nombre" value={createForm.name} onChange={(event) => setCreateForm((form) => ({ ...form, name: event.target.value }))} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Correo" value={createForm.email} onChange={(event) => setCreateForm((form) => ({ ...form, email: event.target.value }))} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Password"
                type="password"
                value={createForm.password}
                onChange={(event) => setCreateForm((form) => ({ ...form, password: event.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Duración en días"
                type="number"
                value={createForm.durationDays}
                onChange={(event) => setCreateForm((form) => ({ ...form, durationDays: event.target.value }))}
                disabled={Boolean(createForm.expiresAt)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Límite de dispositivos"
                type="number"
                value={createForm.deviceLimit}
                onChange={(event) => setCreateForm((form) => ({ ...form, deviceLimit: event.target.value }))}
                helperText="Cantidad de Android TV permitidos para esta licencia."
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Vencimiento exacto"
                type="datetime-local"
                value={createForm.expiresAt}
                onChange={(event) => setCreateForm((form) => ({ ...form, expiresAt: event.target.value }))}
                InputLabelProps={{ shrink: true }}
                helperText="Opcional. Si lo llenas, reemplaza la duración en días."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={modalActionsSx}>
          <Button onClick={() => setCreateOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleCreate} disabled={saving}>
            Crear usuario
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(confirmRequestTarget)} onClose={() => setConfirmRequestTarget(null)} fullWidth maxWidth="xs" PaperProps={{ sx: modalPaperSx }}>
        <DialogTitleWithClose onClose={() => setConfirmRequestTarget(null)} title="Confirmar pago SmartTube" />
        <DialogContent sx={modalContentSx}>
          <Stack spacing={2}>
            <Alert severity="warning" variant="outlined">
              Al confirmar, se creará o renovará el usuario y la licencia quedará activa.
            </Alert>
            <Typography variant="body2" color="text.secondary">
              {confirmRequestTarget?.email}
            </Typography>
            <TextField
              label="Duración en días"
              type="number"
              value={confirmRequestForm.durationDays}
              onChange={(event) => setConfirmRequestForm((form) => ({ ...form, durationDays: event.target.value }))}
              disabled={Boolean(confirmRequestForm.expiresAt)}
            />
            <TextField
              label="Vencimiento exacto"
              type="datetime-local"
              value={confirmRequestForm.expiresAt}
              onChange={(event) => setConfirmRequestForm((form) => ({ ...form, expiresAt: event.target.value }))}
              InputLabelProps={{ shrink: true }}
              helperText="Opcional. Si lo llenas, reemplaza la duración en días."
            />
            <TextField
              label="Límite de dispositivos"
              type="number"
              value={confirmRequestForm.deviceLimit}
              onChange={(event) => setConfirmRequestForm((form) => ({ ...form, deviceLimit: event.target.value }))}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={modalActionsSx}>
          <Button onClick={() => setConfirmRequestTarget(null)}>Cancelar</Button>
          <Button
            color="success"
            variant="contained"
            onClick={handleConfirmRequest}
            disabled={saving || Number(confirmRequestForm.deviceLimit || 0) < 1}
          >
            Confirmar y activar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(rejectRequestTarget)} onClose={() => setRejectRequestTarget(null)} fullWidth maxWidth="xs" PaperProps={{ sx: modalPaperSx }}>
        <DialogTitleWithClose onClose={() => setRejectRequestTarget(null)} title="Rechazar solicitud" />
        <DialogContent sx={modalContentSx}>
          <Stack spacing={2}>
            <Typography variant="body2" color="text.secondary">
              {rejectRequestTarget?.email}
            </Typography>
            <TextField
              label="Motivo"
              multiline
              minRows={3}
              value={rejectReason}
              onChange={(event) => setRejectReason(event.target.value)}
              placeholder="Pago no encontrado, datos incorrectos, etc."
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={modalActionsSx}>
          <Button onClick={() => setRejectRequestTarget(null)}>Cancelar</Button>
          <Button color="warning" variant="contained" onClick={handleRejectRequest} disabled={saving}>
            Rechazar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(renewTarget)} onClose={() => setRenewTarget(null)} fullWidth maxWidth="xs" PaperProps={{ sx: modalPaperSx }}>
        <DialogTitleWithClose onClose={() => setRenewTarget(null)} title="Renovar licencia" />
        <DialogContent sx={modalContentSx}>
          <Stack spacing={2}>
            <Typography variant="body2" color="text.secondary">
              {renewTarget?.email}
            </Typography>
            <TextField
              label="Duración en días"
              type="number"
              value={renewForm.durationDays}
              onChange={(event) => setRenewForm((form) => ({ ...form, durationDays: event.target.value }))}
              disabled={Boolean(renewForm.expiresAt)}
            />
            <TextField
              label="Vencimiento exacto"
              type="datetime-local"
              value={renewForm.expiresAt}
              onChange={(event) => setRenewForm((form) => ({ ...form, expiresAt: event.target.value }))}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Límite de dispositivos"
              type="number"
              value={renewForm.deviceLimit}
              onChange={(event) => setRenewForm((form) => ({ ...form, deviceLimit: event.target.value }))}
              helperText="Mantén o ajusta cuántos Android TV puede usar esta licencia."
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={modalActionsSx}>
          <Button onClick={() => setRenewTarget(null)}>Cancelar</Button>
          <Button variant="contained" onClick={handleRenew} disabled={saving}>
            Renovar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(deviceTarget)} onClose={() => setDeviceTarget(null)} fullWidth maxWidth="md" PaperProps={{ sx: modalPaperSx }}>
        <DialogTitleWithClose onClose={() => setDeviceTarget(null)} title="Dispositivos vinculados" />
        <DialogContent sx={modalContentSx}>
          <Stack spacing={2}>
            <Alert severity="info" variant="outlined">
              {deviceTarget?.email} · {Number(deviceTarget?.deviceCount || 0)} de {Number(deviceTarget?.deviceLimit || 1)} dispositivos activos.
            </Alert>
            <TableContainer sx={{ borderRadius: 2, border: `1px solid ${theme.palette.divider}`, overflowX: 'auto' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Dispositivo</TableCell>
                    <TableCell>ID</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Primer acceso</TableCell>
                    <TableCell>Último acceso</TableCell>
                    <TableCell align="right">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {devices.map((device) => (
                    <TableRow key={device.id} hover>
                      <TableCell>{device.deviceName || 'Android TV'}</TableCell>
                      <TableCell>
                        <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                          {maskDeviceHash(device.deviceIdHash)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip size="small" color={device.status === 'ACTIVE' ? 'success' : 'default'} label={device.status || '-'} />
                      </TableCell>
                      <TableCell>{formatDateTime(device.firstSeenAt, locale)}</TableCell>
                      <TableCell>{formatDateTime(device.lastSeenAt, locale)}</TableCell>
                      <TableCell align="right">
                        <Button
                          size="small"
                          color="warning"
                          variant="outlined"
                          disabled={saving || device.status !== 'ACTIVE'}
                          onClick={() => handleRevokeDevice(device)}
                        >
                          Desvincular
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!devicesLoading && devices.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <Box sx={{ py: 4, textAlign: 'center' }}>
                          <Typography color="text.secondary">Este usuario aún no tiene dispositivos vinculados.</Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        </DialogContent>
        <DialogActions sx={modalActionsSx}>
          <Button onClick={() => setDeviceTarget(null)}>Cerrar</Button>
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => deviceTarget && loadDevices(deviceTarget)} disabled={devicesLoading}>
            Actualizar
          </Button>
          <Button color="warning" variant="contained" onClick={handleResetDevices} disabled={saving || !deviceTarget}>
            Resetear dispositivos
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(limitTarget)} onClose={() => setLimitTarget(null)} fullWidth maxWidth="xs" PaperProps={{ sx: modalPaperSx }}>
        <DialogTitleWithClose onClose={() => setLimitTarget(null)} title="Límite de dispositivos" />
        <DialogContent sx={modalContentSx}>
          <Stack spacing={2}>
            <Typography variant="body2" color="text.secondary">
              {limitTarget?.email}
            </Typography>
            <TextField
              label="Límite de dispositivos"
              type="number"
              value={deviceLimitValue}
              onChange={(event) => setDeviceLimitValue(event.target.value)}
              helperText={`Uso actual: ${Number(limitTarget?.deviceCount || 0)} dispositivos activos.`}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={modalActionsSx}>
          <Button onClick={() => setLimitTarget(null)}>Cancelar</Button>
          <Button variant="contained" onClick={handleUpdateDeviceLimit} disabled={saving || Number(deviceLimitValue || 0) < 1}>
            Guardar límite
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(passwordTarget)} onClose={() => setPasswordTarget(null)} fullWidth maxWidth="xs" PaperProps={{ sx: modalPaperSx }}>
        <DialogTitleWithClose onClose={() => setPasswordTarget(null)} title="Resetear password" />
        <DialogContent sx={modalContentSx}>
          <Stack spacing={2}>
            <Typography variant="body2" color="text.secondary">
              {passwordTarget?.email}
            </Typography>
            <TextField label="Nuevo password" type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} />
          </Stack>
        </DialogContent>
        <DialogActions sx={modalActionsSx}>
          <Button onClick={() => setPasswordTarget(null)}>Cancelar</Button>
          <Button variant="contained" onClick={handleResetPassword} disabled={saving || newPassword.length < 8}>
            Guardar password
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
}
