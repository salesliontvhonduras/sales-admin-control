import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';

import useAuth from 'hooks/useAuth';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import LinearProgress from '@mui/material/LinearProgress';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import AddIcon from '@mui/icons-material/Add';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DevicesOtherIcon from '@mui/icons-material/DevicesOther';
import KeyIcon from '@mui/icons-material/Key';
import LogoutIcon from '@mui/icons-material/Logout';
import PaymentIcon from '@mui/icons-material/Payment';
import RefreshIcon from '@mui/icons-material/Refresh';
import SmartDisplayIcon from '@mui/icons-material/SmartDisplay';
import UpdateIcon from '@mui/icons-material/Update';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import MainCard from 'ui-component/cards/MainCard';
import LionMetricCard from 'ui-component/cards/LionMetricCard';
import DialogTitleWithClose from 'ui-component/dialogs/DialogTitleWithClose';
import ResponsiveActionBar from 'ui-component/responsive/ResponsiveActionBar';
import ResponsiveMetricGrid from 'ui-component/responsive/ResponsiveMetricGrid';
import { hasPermissionExact } from 'utils/rbac';
import {
  confirmSmartTubePremiumAccountRequest,
  createSmartTubePremiumUser,
  listSmartTubePremiumAccountRequests,
  listSmartTubePremiumDevices,
  listSmartTubePremiumSessions,
  listSmartTubePremiumUsers,
  rejectSmartTubePremiumAccountRequest,
  renewSmartTubePremiumLicense,
  resetSmartTubePremiumDevices,
  resetSmartTubePremiumPassword,
  revokeSmartTubePremiumDevice,
  revokeSmartTubePremiumSession,
  updateSmartTubePremiumDeviceLimit,
  updateSmartTubePremiumUserStatus
} from 'api/smarttube-premium-admin';

import SmartTubePremiumRequestsTab from './SmartTubePremiumRequestsTab';
import SmartTubePremiumSessionsTab from './SmartTubePremiumSessionsTab';
import SmartTubePremiumUsersTab from './SmartTubePremiumUsersTab';
import {
  formatDateTime,
  getErrorMessage,
  maskDeviceHash,
  modalActionsSx,
  modalContentSx,
  modalPaperSx,
  sessionStatusColor,
  statusColor,
  statusUpdatePermissions,
  surfaceSx,
  tableContainerSx,
  tabsSx
} from './shared';

const defaultCreateForm = {
  name: '',
  email: '',
  password: '',
  durationDays: 30,
  expiresAt: '',
  deviceLimit: 1,
  active: true
};

const defaultLicenseForm = { durationDays: 30, expiresAt: '', deviceLimit: 1 };

function PasswordInput({ label, value, onChange, disabled }) {
  const [visible, setVisible] = useState(false);

  return (
    <TextField
      label={label}
      type={visible ? 'text' : 'password'}
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Tooltip title={visible ? 'Ocultar password' : 'Mostrar password'}>
              <IconButton edge="end" onClick={() => setVisible((next) => !next)} disabled={disabled}>
                {visible ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
          </InputAdornment>
        )
      }}
    />
  );
}

function CustomerSummary({ row, helper }) {
  if (!row) return null;
  return (
    <Card variant="outlined" sx={(theme) => surfaceSx(theme)}>
      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Stack spacing={0.75}>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }} noWrap>
                {row.name || '-'}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {row.email}
              </Typography>
            </Box>
            {row.licenseStatus ? <Chip size="small" color={statusColor(row.licenseStatus)} label={row.licenseStatus} /> : null}
          </Stack>
          {helper ? (
            <Typography variant="caption" color="text.secondary">
              {helper}
            </Typography>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function SmartTubePremiumAdmin() {
  const { i18n } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();
  const theme = useTheme();
  const locale = (i18n?.resolvedLanguage || i18n?.language || 'es').startsWith('en') ? 'en-US' : 'es-HN';
  const canUpdateStatus = hasPermissionExact(user, { any: statusUpdatePermissions });

  const [tab, setTab] = useState('users');
  const [saving, setSaving] = useState(false);

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [resellerUsername, setResellerUsername] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const [requestRows, setRequestRows] = useState([]);
  const [requestTotal, setRequestTotal] = useState(0);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [requestPage, setRequestPage] = useState(0);
  const [requestRowsPerPage, setRequestRowsPerPage] = useState(10);
  const [requestSearch, setRequestSearch] = useState('');
  const [requestStatus, setRequestStatus] = useState('PENDING_PAYMENT');
  const [requestRefreshKey, setRequestRefreshKey] = useState(0);

  const [sessionRows, setSessionRows] = useState([]);
  const [sessionTotal, setSessionTotal] = useState(0);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [sessionPage, setSessionPage] = useState(0);
  const [sessionRowsPerPage, setSessionRowsPerPage] = useState(10);
  const [sessionSearch, setSessionSearch] = useState('');
  const [sessionStatus, setSessionStatus] = useState('ACTIVE');
  const [sessionUserId, setSessionUserId] = useState('');
  const [sessionRefreshKey, setSessionRefreshKey] = useState(0);

  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState(defaultCreateForm);
  const [confirmRequestTarget, setConfirmRequestTarget] = useState(null);
  const [confirmRequestForm, setConfirmRequestForm] = useState(defaultLicenseForm);
  const [rejectRequestTarget, setRejectRequestTarget] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [renewTarget, setRenewTarget] = useState(null);
  const [renewForm, setRenewForm] = useState(defaultLicenseForm);
  const [passwordTarget, setPasswordTarget] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [deviceTarget, setDeviceTarget] = useState(null);
  const [devices, setDevices] = useState([]);
  const [devicesLoading, setDevicesLoading] = useState(false);
  const [limitTarget, setLimitTarget] = useState(null);
  const [deviceLimitValue, setDeviceLimitValue] = useState(1);
  const [sessionRevokeTarget, setSessionRevokeTarget] = useState(null);

  const loadRows = useCallback(async () => {
    setLoading(true);
    try {
      const payload = await listSmartTubePremiumUsers(
        { index: page, size: rowsPerPage, search: search || undefined, status: status || undefined, resellerUsername: resellerUsername || undefined },
        { skipAuthRedirect: true }
      );
      setRows(Array.isArray(payload?.data) ? payload.data : []);
      setTotal(Number(payload?.total || 0));
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error, 'No se pudieron cargar cuentas SmartTube.'), { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar, page, rowsPerPage, search, status, resellerUsername]);

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
      enqueueSnackbar(getErrorMessage(error, 'No se pudieron cargar solicitudes SmartTube.'), { variant: 'error' });
    } finally {
      setRequestsLoading(false);
    }
  }, [enqueueSnackbar, requestPage, requestRowsPerPage, requestSearch, requestStatus]);

  const loadSessions = useCallback(async () => {
    setSessionsLoading(true);
    try {
      const payload = await listSmartTubePremiumSessions(
        {
          index: sessionPage,
          size: sessionRowsPerPage,
          search: sessionSearch || undefined,
          status: sessionStatus || undefined,
          userId: sessionUserId ? Number(sessionUserId) : undefined
        },
        { skipAuthRedirect: true }
      );
      setSessionRows(Array.isArray(payload?.data) ? payload.data : []);
      setSessionTotal(Number(payload?.total || 0));
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error, 'No se pudieron cargar sesiones SmartTube.'), { variant: 'error' });
    } finally {
      setSessionsLoading(false);
    }
  }, [enqueueSnackbar, sessionPage, sessionRowsPerPage, sessionSearch, sessionStatus, sessionUserId]);

  useEffect(() => {
    loadRows();
  }, [loadRows, refreshKey]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests, requestRefreshKey]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions, sessionRefreshKey]);

  const metrics = useMemo(() => {
    const counts = rows.reduce((acc, row) => {
      const key = String(row.licenseStatus || 'UNKNOWN').toUpperCase();
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    const pendingRequests = requestStatus === 'PENDING_PAYMENT' ? requestTotal : requestRows.filter((row) => row.status === 'PENDING_PAYMENT').length;
    const activeSessions = sessionStatus === 'ACTIVE' ? sessionTotal : sessionRows.filter((row) => row.status === 'ACTIVE').length;

    return [
      { title: 'Cuentas', value: total, helper: 'Total filtrado', color: 'primary', icon: <SmartDisplayIcon fontSize="small" /> },
      { title: 'Activas', value: counts.ACTIVE || 0, helper: 'Licencias vigentes visibles', color: 'success', icon: <VerifiedUserIcon fontSize="small" /> },
      { title: 'Vencidas', value: counts.EXPIRED || 0, helper: 'Requieren renovación', color: 'warning', icon: <UpdateIcon fontSize="small" /> },
      { title: 'Suspendidas', value: counts.SUSPENDED || 0, helper: 'Usuarios bloqueados', color: 'default', icon: <BlockIcon fontSize="small" /> },
      { title: 'Solicitudes', value: pendingRequests, helper: 'Pendientes visibles', color: 'info', icon: <PaymentIcon fontSize="small" /> },
      { title: 'Sesiones', value: activeSessions, helper: 'Conexiones activas', color: 'secondary', icon: <LogoutIcon fontSize="small" /> }
    ];
  }, [requestRows, requestStatus, requestTotal, rows, sessionRows, sessionStatus, sessionTotal, total]);

  const refreshAll = () => {
    setRefreshKey((value) => value + 1);
    setRequestRefreshKey((value) => value + 1);
    setSessionRefreshKey((value) => value + 1);
  };

  const resetCreateForm = () => setCreateForm(defaultCreateForm);

  const handleCreate = async () => {
    setSaving(true);
    try {
      await createSmartTubePremiumUser(
        {
          name: createForm.name,
          email: createForm.email,
          password: createForm.password,
          active: createForm.active,
          durationDays: createForm.expiresAt ? undefined : Number(createForm.durationDays || 30),
          expiresAt: createForm.expiresAt || undefined,
          deviceLimit: Number(createForm.deviceLimit || 1)
        },
        { skipAuthRedirect: true }
      );
      enqueueSnackbar('Cuenta SmartTube creada.', { variant: 'success' });
      setCreateOpen(false);
      resetCreateForm();
      refreshAll();
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error, 'No se pudo crear la cuenta.'), { variant: 'error' });
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
      refreshAll();
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error, 'No se pudo confirmar el pago.'), { variant: 'error' });
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
      enqueueSnackbar(getErrorMessage(error, 'No se pudo rechazar la solicitud.'), { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const openRenew = (row) => {
    setRenewTarget(row);
    setRenewForm({ durationDays: 30, expiresAt: '', deviceLimit: Number(row.deviceLimit || 1) });
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
      refreshAll();
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error, 'No se pudo renovar la licencia.'), { variant: 'error' });
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
      enqueueSnackbar(getErrorMessage(error, 'No se pudo actualizar el password.'), { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const copyPassword = async () => {
    if (!newPassword) return;
    try {
      await navigator.clipboard.writeText(newPassword);
      enqueueSnackbar('Password copiado.', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('No se pudo copiar el password.', { variant: 'warning' });
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
      enqueueSnackbar(row.active ? 'Cuenta suspendida.' : 'Cuenta activada.', { variant: 'success' });
      refreshAll();
    } catch (error) {
      const responseStatus = error?.response?.status || error?.request?.status;
      enqueueSnackbar(
        responseStatus === 403 ? 'No tienes permiso para cambiar el estado de esta cuenta.' : getErrorMessage(error, 'No se pudo actualizar la cuenta.'),
        { variant: 'error' }
      );
    } finally {
      setSaving(false);
    }
  };

  const openLimit = (row) => {
    setLimitTarget(row);
    setDeviceLimitValue(Number(row.deviceLimit || 1));
  };

  const handleUpdateDeviceLimit = async () => {
    if (!limitTarget?.userId) return;
    setSaving(true);
    try {
      await updateSmartTubePremiumDeviceLimit(limitTarget.userId, Number(deviceLimitValue || 1), { skipAuthRedirect: true });
      enqueueSnackbar('Límite de dispositivos actualizado.', { variant: 'success' });
      setLimitTarget(null);
      refreshAll();
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error, 'No se pudo actualizar el límite.'), { variant: 'error' });
    } finally {
      setSaving(false);
    }
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
        enqueueSnackbar(getErrorMessage(error, 'No se pudieron cargar dispositivos.'), { variant: 'error' });
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
      await loadDevices(deviceTarget);
      refreshAll();
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error, 'No se pudo desvincular el dispositivo.'), { variant: 'error' });
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
      await loadDevices(deviceTarget);
      refreshAll();
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error, 'No se pudieron resetear los dispositivos.'), { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const openSessionsForUser = (row) => {
    setTab('sessions');
    setSessionUserId(String(row.userId || ''));
    setSessionPage(0);
    setDeviceTarget(null);
  };

  const handleRevokeSession = async () => {
    if (!sessionRevokeTarget?.sessionId) return;
    setSaving(true);
    try {
      const updated = await revokeSmartTubePremiumSession(sessionRevokeTarget.sessionId, { skipAuthRedirect: true });
      enqueueSnackbar('Sesión desconectada. La APK saldrá en el próximo heartbeat.', { variant: 'success' });
      setSessionRows((current) =>
        current.map((row) => (row.sessionId === updated?.sessionId ? { ...row, ...updated } : row))
      );
      setSessionRevokeTarget(null);
      setSessionRefreshKey((value) => value + 1);
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error, 'No se pudo desconectar la sesión.'), { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const openPassword = (row) => {
    setPasswordTarget(row);
    setNewPassword('');
  };

  const anyLoading = loading || requestsLoading || sessionsLoading;

  return (
    <MainCard
      title="SmartTube Premium"
      secondary={
        <ResponsiveActionBar>
          <Button startIcon={<RefreshIcon />} variant="outlined" onClick={refreshAll} disabled={anyLoading}>
            Actualizar
          </Button>
          <Button startIcon={<AddIcon />} variant="contained" onClick={() => setCreateOpen(true)}>
            Crear cuenta
          </Button>
        </ResponsiveActionBar>
      }
    >
      <Stack spacing={2.5}>
        <Card variant="outlined" sx={(themeValue) => surfaceSx(themeValue)}>
          <CardContent sx={{ p: { xs: 1.75, sm: 2.25 }, '&:last-child': { pb: { xs: 1.75, sm: 2.25 } } }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', md: 'center' }} justifyContent="space-between">
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="h3" sx={{ fontWeight: 850 }}>
                  Centro operativo SmartTube Premium
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Administra cuentas, solicitudes, dispositivos y sesiones activas de la APK desde una sola vista.
                </Typography>
              </Box>
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                <Chip size="small" color="success" label={`${sessionStatus === 'ACTIVE' ? sessionTotal : sessionRows.filter((row) => row.status === 'ACTIVE').length} sesiones activas`} />
                <Chip size="small" color="warning" label={`${requestStatus === 'PENDING_PAYMENT' ? requestTotal : requestRows.filter((row) => row.status === 'PENDING_PAYMENT').length} solicitudes pendientes`} />
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <ResponsiveMetricGrid columns={{ xs: 1, sm: 2, lg: 3, xl: 6 }}>
          {metrics.map((metric) => (
            <LionMetricCard key={metric.title} {...metric} />
          ))}
        </ResponsiveMetricGrid>

        <Tabs value={tab} onChange={(event, next) => setTab(next)} variant="scrollable" scrollButtons="auto" sx={tabsSx(theme)}>
          <Tab value="users" label={`Cuentas (${total})`} />
          <Tab value="requests" label={`Solicitudes (${requestTotal})`} />
          <Tab value="sessions" label={`Sesiones (${sessionTotal})`} />
        </Tabs>

        {anyLoading ? <LinearProgress /> : null}

        {tab === 'users' ? (
          <SmartTubePremiumUsersTab
            rows={rows}
            total={total}
            loading={loading}
            page={page}
            rowsPerPage={rowsPerPage}
            search={search}
            status={status}
            resellerUsername={resellerUsername}
            locale={locale}
            canUpdateStatus={canUpdateStatus}
            onSearchChange={(value) => {
              setSearch(value);
              setPage(0);
            }}
            onStatusChange={(value) => {
              setStatus(value);
              setPage(0);
            }}
            onResellerUsernameChange={(value) => {
              setResellerUsername(value);
              setPage(0);
            }}
            onPageChange={setPage}
            onRowsPerPageChange={(value) => {
              setRowsPerPage(value);
              setPage(0);
            }}
            onOpenDevices={loadDevices}
            onOpenRenew={openRenew}
            onOpenPassword={openPassword}
            onOpenLimit={openLimit}
            onToggleStatus={toggleStatus}
          />
        ) : null}

        {tab === 'requests' ? (
          <SmartTubePremiumRequestsTab
            rows={requestRows}
            total={requestTotal}
            loading={requestsLoading}
            page={requestPage}
            rowsPerPage={requestRowsPerPage}
            search={requestSearch}
            status={requestStatus}
            locale={locale}
            onSearchChange={(value) => {
              setRequestSearch(value);
              setRequestPage(0);
            }}
            onStatusChange={(value) => {
              setRequestStatus(value);
              setRequestPage(0);
            }}
            onPageChange={setRequestPage}
            onRowsPerPageChange={(value) => {
              setRequestRowsPerPage(value);
              setRequestPage(0);
            }}
            onConfirm={openConfirmRequest}
            onReject={setRejectRequestTarget}
          />
        ) : null}

        {tab === 'sessions' ? (
          <SmartTubePremiumSessionsTab
            rows={sessionRows}
            total={sessionTotal}
            loading={sessionsLoading}
            page={sessionPage}
            rowsPerPage={sessionRowsPerPage}
            search={sessionSearch}
            status={sessionStatus}
            userId={sessionUserId}
            locale={locale}
            canRevokeSession={canUpdateStatus}
            onSearchChange={(value) => {
              setSessionSearch(value);
              setSessionPage(0);
            }}
            onStatusChange={(value) => {
              setSessionStatus(value);
              setSessionPage(0);
            }}
            onUserIdChange={(value) => {
              setSessionUserId(value);
              setSessionPage(0);
            }}
            onPageChange={setSessionPage}
            onRowsPerPageChange={(value) => {
              setSessionRowsPerPage(value);
              setSessionPage(0);
            }}
            onRevoke={setSessionRevokeTarget}
          />
        ) : null}
      </Stack>

      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} fullWidth maxWidth="sm" PaperProps={{ sx: modalPaperSx }}>
        <DialogTitleWithClose onClose={() => setCreateOpen(false)}>
          <Stack spacing={0.4}>
            <Typography variant="h4">Crear cuenta SmartTube</Typography>
            <Typography variant="body2" color="text.secondary">
              Crea credenciales premium y licencia inicial para la APK.
            </Typography>
          </Stack>
        </DialogTitleWithClose>
        <DialogContent sx={modalContentSx}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField label="Nombre" value={createForm.name} onChange={(event) => setCreateForm((form) => ({ ...form, name: event.target.value }))} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Correo" value={createForm.email} onChange={(event) => setCreateForm((form) => ({ ...form, email: event.target.value }))} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <PasswordInput label="Password" value={createForm.password} onChange={(value) => setCreateForm((form) => ({ ...form, password: value }))} disabled={saving} />
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
                helperText="Cantidad máxima de conexiones/dispositivos permitidos."
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
          <Button variant="contained" onClick={handleCreate} disabled={saving || createForm.password.length < 8}>
            Crear cuenta
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(confirmRequestTarget)} onClose={() => setConfirmRequestTarget(null)} fullWidth maxWidth="sm" PaperProps={{ sx: modalPaperSx }}>
        <DialogTitleWithClose onClose={() => setConfirmRequestTarget(null)}>
          <Typography variant="h4">Confirmar pago SmartTube</Typography>
        </DialogTitleWithClose>
        <DialogContent sx={modalContentSx}>
          <Stack spacing={2}>
            <CustomerSummary row={confirmRequestTarget} helper="Al confirmar, se crea o renueva la licencia con estos datos." />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Duración en días"
                  type="number"
                  value={confirmRequestForm.durationDays}
                  onChange={(event) => setConfirmRequestForm((form) => ({ ...form, durationDays: event.target.value }))}
                  disabled={Boolean(confirmRequestForm.expiresAt)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Límite de dispositivos"
                  type="number"
                  value={confirmRequestForm.deviceLimit}
                  onChange={(event) => setConfirmRequestForm((form) => ({ ...form, deviceLimit: event.target.value }))}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Vencimiento exacto"
                  type="datetime-local"
                  value={confirmRequestForm.expiresAt}
                  onChange={(event) => setConfirmRequestForm((form) => ({ ...form, expiresAt: event.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  helperText="Opcional. Si lo llenas, reemplaza la duración en días."
                />
              </Grid>
            </Grid>
          </Stack>
        </DialogContent>
        <DialogActions sx={modalActionsSx}>
          <Button onClick={() => setConfirmRequestTarget(null)}>Cancelar</Button>
          <Button color="success" variant="contained" onClick={handleConfirmRequest} disabled={saving || Number(confirmRequestForm.deviceLimit || 0) < 1}>
            Confirmar y activar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(rejectRequestTarget)} onClose={() => setRejectRequestTarget(null)} fullWidth maxWidth="xs" PaperProps={{ sx: modalPaperSx }}>
        <DialogTitleWithClose onClose={() => setRejectRequestTarget(null)}>
          <Typography variant="h4">Rechazar solicitud</Typography>
        </DialogTitleWithClose>
        <DialogContent sx={modalContentSx}>
          <Stack spacing={2}>
            <CustomerSummary row={rejectRequestTarget} />
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

      <Dialog open={Boolean(renewTarget)} onClose={() => setRenewTarget(null)} fullWidth maxWidth="sm" PaperProps={{ sx: modalPaperSx }}>
        <DialogTitleWithClose onClose={() => setRenewTarget(null)}>
          <Typography variant="h4">Renovar licencia</Typography>
        </DialogTitleWithClose>
        <DialogContent sx={modalContentSx}>
          <Stack spacing={2}>
            <CustomerSummary row={renewTarget} helper={`Vencimiento actual: ${formatDateTime(renewTarget?.expiresAt, locale)}`} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Duración en días"
                  type="number"
                  value={renewForm.durationDays}
                  onChange={(event) => setRenewForm((form) => ({ ...form, durationDays: event.target.value }))}
                  disabled={Boolean(renewForm.expiresAt)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Límite de dispositivos"
                  type="number"
                  value={renewForm.deviceLimit}
                  onChange={(event) => setRenewForm((form) => ({ ...form, deviceLimit: event.target.value }))}
                  helperText={`Uso actual: ${Number(renewTarget?.deviceCount || 0)} de ${Number(renewTarget?.deviceLimit || 1)}.`}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Vencimiento exacto"
                  type="datetime-local"
                  value={renewForm.expiresAt}
                  onChange={(event) => setRenewForm((form) => ({ ...form, expiresAt: event.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  helperText="Opcional. Si lo llenas, reemplaza la duración en días."
                />
              </Grid>
            </Grid>
          </Stack>
        </DialogContent>
        <DialogActions sx={modalActionsSx}>
          <Button onClick={() => setRenewTarget(null)}>Cancelar</Button>
          <Button variant="contained" onClick={handleRenew} disabled={saving || Number(renewForm.deviceLimit || 0) < 1}>
            Renovar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(limitTarget)} onClose={() => setLimitTarget(null)} fullWidth maxWidth="xs" PaperProps={{ sx: modalPaperSx }}>
        <DialogTitleWithClose onClose={() => setLimitTarget(null)}>
          <Typography variant="h4">Límite de dispositivos</Typography>
        </DialogTitleWithClose>
        <DialogContent sx={modalContentSx}>
          <Stack spacing={2}>
            <CustomerSummary row={limitTarget} helper={`Uso actual: ${Number(limitTarget?.deviceCount || 0)} de ${Number(limitTarget?.deviceLimit || 1)} dispositivos.`} />
            <TextField
              label="Nuevo límite"
              type="number"
              value={deviceLimitValue}
              onChange={(event) => setDeviceLimitValue(event.target.value)}
              helperText="Si reduces el límite, las sesiones activas se controlan por heartbeat de la APK."
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
        <DialogTitleWithClose onClose={() => setPasswordTarget(null)}>
          <Typography variant="h4">Resetear password</Typography>
        </DialogTitleWithClose>
        <DialogContent sx={modalContentSx}>
          <Stack spacing={2}>
            <CustomerSummary row={passwordTarget} />
            <PasswordInput label="Nuevo password" value={newPassword} onChange={setNewPassword} disabled={saving} />
            <Button startIcon={<ContentCopyIcon />} variant="outlined" onClick={copyPassword} disabled={!newPassword}>
              Copiar password
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions sx={modalActionsSx}>
          <Button onClick={() => setPasswordTarget(null)}>Cancelar</Button>
          <Button variant="contained" onClick={handleResetPassword} disabled={saving || newPassword.length < 8}>
            Guardar password
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(deviceTarget)} onClose={() => setDeviceTarget(null)} fullWidth maxWidth="md" PaperProps={{ sx: modalPaperSx }}>
        <DialogTitleWithClose onClose={() => setDeviceTarget(null)}>
          <Stack spacing={0.4}>
            <Typography variant="h4">Dispositivos vinculados</Typography>
            <Typography variant="body2" color="text.secondary">
              Desvincular libera la licencia del dispositivo. Para cerrar una conexión temporal usa la tab Sesiones.
            </Typography>
          </Stack>
        </DialogTitleWithClose>
        <DialogContent sx={modalContentSx}>
          <Stack spacing={2}>
            <CustomerSummary row={deviceTarget} helper={`${Number(deviceTarget?.deviceCount || 0)} de ${Number(deviceTarget?.deviceLimit || 1)} dispositivos activos.`} />
            <TableContainer sx={tableContainerSx(theme)}>
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
                      <TableCell>{device.deviceName || 'Dispositivo Android'}</TableCell>
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
                        <Button size="small" color="warning" variant="outlined" disabled={saving || device.status !== 'ACTIVE'} onClick={() => handleRevokeDevice(device)}>
                          Desvincular
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!devicesLoading && devices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <Box sx={{ py: 4, textAlign: 'center' }}>
                          <Typography color="text.secondary">Este usuario aún no tiene dispositivos vinculados.</Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : null}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        </DialogContent>
        <DialogActions sx={modalActionsSx}>
          <Button onClick={() => openSessionsForUser(deviceTarget)} disabled={!deviceTarget}>
            Ver sesiones
          </Button>
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => deviceTarget && loadDevices(deviceTarget)} disabled={devicesLoading}>
            Actualizar
          </Button>
          <Button color="warning" variant="contained" onClick={handleResetDevices} disabled={saving || !deviceTarget}>
            Resetear dispositivos
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(sessionRevokeTarget)} onClose={() => setSessionRevokeTarget(null)} fullWidth maxWidth="xs" PaperProps={{ sx: modalPaperSx }}>
        <DialogTitleWithClose onClose={() => setSessionRevokeTarget(null)}>
          <Typography variant="h4">Desconectar sesión</Typography>
        </DialogTitleWithClose>
        <DialogContent sx={modalContentSx}>
          <Stack spacing={2}>
            <Alert severity="warning" variant="outlined">
              Esto no desvincula el dispositivo. Solo cierra esta conexión activa; la APK volverá a login cuando el heartbeat detecte la revocación.
            </Alert>
            <CustomerSummary row={sessionRevokeTarget} helper={`Sesión #${sessionRevokeTarget?.sessionId} · ${sessionRevokeTarget?.deviceName || 'Dispositivo Android'} · ${maskDeviceHash(sessionRevokeTarget?.deviceIdHash)}`} />
            <Chip size="small" color={sessionStatusColor(sessionRevokeTarget?.status)} label={sessionRevokeTarget?.status || '-'} sx={{ alignSelf: 'flex-start' }} />
          </Stack>
        </DialogContent>
        <DialogActions sx={modalActionsSx}>
          <Button onClick={() => setSessionRevokeTarget(null)}>Cancelar</Button>
          <Button color="warning" variant="contained" startIcon={<LogoutIcon />} onClick={handleRevokeSession} disabled={saving || sessionRevokeTarget?.status !== 'ACTIVE'}>
            Desconectar
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
}
