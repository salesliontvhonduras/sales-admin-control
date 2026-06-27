import { useCallback, useEffect, useMemo, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import KeyIcon from '@mui/icons-material/Key';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import RefreshIcon from '@mui/icons-material/Refresh';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import WifiTetheringIcon from '@mui/icons-material/WifiTethering';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useSnackbar } from 'notistack';
import useAuth from 'hooks/useAuth';
import { getUserPermissions } from 'utils/rbac';
import {
  createYoutubePremiumAccount,
  getYoutubePremiumDashboard,
  getYoutubePremiumWallet,
  getYoutubePremiumWalletLedger,
  listYoutubePremiumAccounts,
  listYoutubePremiumChildResellers,
  listYoutubePremiumNotifications,
  listYoutubePremiumSessions,
  renewYoutubePremiumAccount,
  resetYoutubePremiumAccountPassword,
  revokeYoutubePremiumSession,
  transferYoutubePremiumCredits,
  updateYoutubePremiumAccountStatus,
  upsertYoutubePremiumChildReseller
} from 'api/reseller-youtube-premium';

const emptyAccount = { name: '', email: '', password: '', planCode: 'INDIVIDUAL', packageCode: 'MONTHLY', deviceLimit: 1 };
const emptyRenewal = { planCode: 'INDIVIDUAL', packageCode: 'MONTHLY', deviceLimit: 1 };
const emptyNetworkAccount = { username: '', displayName: '', resellerType: 'RESELLER', active: true };

const tabs = [
  { value: 'dashboard', label: 'Dashboard' },
  { value: 'accounts', label: 'Cuentas Premium' },
  { value: 'sessions', label: 'Sesiones' },
  { value: 'credits', label: 'Créditos' },
  { value: 'notifications', label: 'Notificaciones' }
];

function rowsOf(payload) {
  return Array.isArray(payload?.data) ? payload.data : [];
}

function unitsToCredits(value = 0) {
  return (Number(value || 0) / 100).toFixed(2);
}

function displayDate(value) {
  if (!value) return '-';
  return String(value).replace('T', ' ').slice(0, 16);
}

function statusLabel(row) {
  if (row?.active === false) return 'Suspendida';
  const raw = String(row?.licenseStatus || row?.status || '').toUpperCase();
  if (raw === 'ACTIVE') return 'Activa';
  if (raw === 'EXPIRED') return 'Expirada';
  if (raw === 'REVOKED') return 'Revocada';
  if (raw === 'SUSPENDED') return 'Suspendida';
  return raw || 'N/A';
}

function StatusChip({ row, value }) {
  const label = value || statusLabel(row);
  const normalized = String(label).toUpperCase();
  const color = normalized.includes('ACTIVA') || normalized === 'ACTIVE' ? 'success' : normalized.includes('EXPIR') ? 'warning' : 'default';
  return <Chip size="small" label={label} color={color} sx={{ fontWeight: 700 }} />;
}

function MetricCard({ icon, label, value, helper }) {
  return (
    <Paper sx={{ p: 2.25, bgcolor: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 2 }}>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
        <Box sx={{ color: '#fff', display: 'grid', placeItems: 'center' }}>{icon}</Box>
        <Box>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.58)' }}>
            {label}
          </Typography>
          <Typography variant="h2" sx={{ color: '#fff', lineHeight: 1.1 }}>
            {value}
          </Typography>
          {helper ? <Typography sx={{ color: 'rgba(255,255,255,0.48)', fontSize: 12 }}>{helper}</Typography> : null}
        </Box>
      </Stack>
    </Paper>
  );
}

function Panel({ title, helper, action, children }) {
  return (
    <Paper sx={{ bgcolor: '#0d0d0d', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ justifyContent: 'space-between', gap: 1.5, p: 2, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Box>
          <Typography variant="h3" sx={{ color: '#fff' }}>{title}</Typography>
          {helper ? <Typography sx={{ color: 'rgba(255,255,255,0.56)' }}>{helper}</Typography> : null}
        </Box>
        {action}
      </Stack>
      <Box sx={{ p: 2 }}>{children}</Box>
    </Paper>
  );
}

function AccountCard({ row, onRenew, onToggle, onPassword }) {
  return (
    <Paper sx={{ p: 2, bgcolor: '#121212', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 2 }}>
      <Stack spacing={1.25}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ color: '#fff' }}>{row.name || 'Cuenta Premium'}</Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.56)' }}>{row.email}</Typography>
          </Box>
          <StatusChip row={row} />
        </Stack>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
          <Chip size="small" label={row.planCode === 'FAMILY' ? 'Plan Family' : 'Plan Individual'} />
          <Chip size="small" label={row.packageCode || 'MONTHLY'} />
          <Chip size="small" label={`${row.deviceCount || 0}/${row.deviceLimit || 1} dispositivos`} />
          <Chip size="small" label={`Expira ${row.expiresAt ? String(row.expiresAt).slice(0, 10) : '-'}`} />
        </Stack>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
          <Button size="small" variant="contained" startIcon={<RefreshIcon />} onClick={() => onRenew(row)}>Renovar</Button>
          <Button size="small" variant="outlined" startIcon={<PowerSettingsNewIcon />} onClick={() => onToggle(row)}>
            {row.active ? 'Suspender' : 'Activar'}
          </Button>
          <Button size="small" variant="text" startIcon={<KeyIcon />} onClick={() => onPassword(row)}>Password</Button>
        </Stack>
      </Stack>
    </Paper>
  );
}

export default function ResellerPortal() {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const permissions = useMemo(() => getUserPermissions(user), [user]);
  const canSuper = permissions.has('LIONTV_SUPER_RESELLER_MANAGE') || permissions.has('ROLE_LIONTV_SUPER_RESELLER_MANAGE');

  const [tab, setTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [dashboard, setDashboard] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [sessions, setSessions] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [ledger, setLedger] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [network, setNetwork] = useState(null);
  const [accountDialog, setAccountDialog] = useState(false);
  const [accountForm, setAccountForm] = useState(emptyAccount);
  const [renewDialog, setRenewDialog] = useState(null);
  const [renewForm, setRenewForm] = useState(emptyRenewal);
  const [passwordDialog, setPasswordDialog] = useState(null);
  const [passwordValue, setPasswordValue] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [networkDialog, setNetworkDialog] = useState(false);
  const [networkForm, setNetworkForm] = useState(emptyNetworkAccount);
  const [transferDialog, setTransferDialog] = useState(null);
  const [transferValue, setTransferValue] = useState('');

  const visibleTabs = useMemo(() => (canSuper ? [...tabs, { value: 'network', label: 'Red de Resellers' }] : tabs), [canSuper]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      if (tab === 'dashboard') setDashboard(await getYoutubePremiumDashboard());
      if (tab === 'accounts') setAccounts(await listYoutubePremiumAccounts({ index: 0, size: 60 }));
      if (tab === 'sessions') setSessions(await listYoutubePremiumSessions({ status: 'ACTIVE', index: 0, size: 60 }));
      if (tab === 'credits') {
        const [summary, history] = await Promise.all([
          getYoutubePremiumWallet(),
          getYoutubePremiumWalletLedger({ index: 0, size: 50 })
        ]);
        setWallet(summary);
        setLedger(history);
      }
      if (tab === 'notifications') setNotifications(await listYoutubePremiumNotifications({ index: 0, size: 50 }));
      if (tab === 'network' && canSuper) setNetwork(await listYoutubePremiumChildResellers({ index: 0, size: 60 }));
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || 'No se pudo cargar el portal YouTube Premium.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [tab, canSuper, enqueueSnackbar]);

  useEffect(() => {
    load();
  }, [load]);

  const submitAccount = async () => {
    try {
      await createYoutubePremiumAccount(accountForm, `ytp-account-${accountForm.email}-${Date.now()}`);
      enqueueSnackbar('Cuenta Premium creada.', { variant: 'success' });
      setAccountDialog(false);
      setAccountForm(emptyAccount);
      setTab('accounts');
      await load();
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || 'No se pudo crear la cuenta.', { variant: 'error' });
    }
  };

  const submitRenewal = async () => {
    try {
      await renewYoutubePremiumAccount(renewDialog.userId, renewForm, `ytp-renew-${renewDialog.userId}-${Date.now()}`);
      enqueueSnackbar('Cuenta renovada.', { variant: 'success' });
      setRenewDialog(null);
      await load();
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || 'No se pudo renovar la cuenta.', { variant: 'error' });
    }
  };

  const toggleAccount = async (row) => {
    try {
      await updateYoutubePremiumAccountStatus(row.userId, !row.active);
      enqueueSnackbar('Estado actualizado.', { variant: 'success' });
      await load();
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || 'No se pudo actualizar el estado.', { variant: 'error' });
    }
  };

  const submitPasswordReset = async () => {
    if (!passwordDialog || !passwordValue) return;
    try {
      await resetYoutubePremiumAccountPassword(passwordDialog.userId, passwordValue);
      enqueueSnackbar('Contraseña actualizada.', { variant: 'success' });
      setPasswordDialog(null);
      setPasswordValue('');
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || 'No se pudo actualizar la contraseña.', { variant: 'error' });
    }
  };

  const disconnectSession = async (row) => {
    try {
      await revokeYoutubePremiumSession(row.sessionId);
      enqueueSnackbar('Sesión desconectada.', { variant: 'success' });
      await load();
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || 'No se pudo desconectar la sesión.', { variant: 'error' });
    }
  };

  const saveNetworkAccount = async () => {
    try {
      await upsertYoutubePremiumChildReseller(networkForm);
      enqueueSnackbar('Reseller guardado.', { variant: 'success' });
      setNetworkDialog(false);
      setNetworkForm(emptyNetworkAccount);
      await load();
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || 'No se pudo guardar el reseller.', { variant: 'error' });
    }
  };

  const submitTransfer = async () => {
    if (!transferDialog || !transferValue) return;
    try {
      await transferYoutubePremiumCredits(transferDialog.username, { credits: Number(transferValue), reason: 'Transferencia YouTube Premium' });
      enqueueSnackbar('Créditos transferidos.', { variant: 'success' });
      setTransferDialog(null);
      setTransferValue('');
      await load();
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || 'No se pudieron transferir los créditos.', { variant: 'error' });
    }
  };

  const openRenew = (row) => {
    setRenewDialog(row);
    setRenewForm({ ...emptyRenewal, deviceLimit: row.deviceLimit || 1 });
  };

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', md: 'row' }} sx={{ justifyContent: 'space-between', gap: 2 }}>
          <Box>
            <Typography variant="h1" sx={{ color: '#fff' }}>YouTube Premium Reseller</Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.62)' }}>
              Portal aislado para vender cuentas premium, renovar, revisar sesiones y administrar créditos.
            </Typography>
          </Box>
          <Button variant="contained" size="large" startIcon={<AddIcon />} onClick={() => setAccountDialog(true)}>
            Nueva cuenta premium
          </Button>
        </Stack>

        <Tabs
          value={tab}
          onChange={(_, value) => setTab(value)}
          variant="scrollable"
          sx={{
            minHeight: 44,
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            '& .MuiTab-root': { minHeight: 44, color: 'rgba(255,255,255,0.66)', textTransform: 'none', fontWeight: 700 },
            '& .Mui-selected': { color: '#fff !important' }
          }}
        >
          {visibleTabs.map((item) => <Tab key={item.value} value={item.value} label={item.label} />)}
        </Tabs>

        {loading ? <CircularProgress sx={{ color: '#fff' }} /> : null}

        {tab === 'dashboard' ? (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard icon={<AccountBalanceWalletIcon />} label="Saldo disponible" value={unitsToCredits(dashboard?.wallet?.availableCreditUnits ?? dashboard?.wallet?.availableCredits)} helper="créditos" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard icon={<SupervisorAccountIcon />} label="Cuentas creadas" value={dashboard?.totalCustomers || 0} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard icon={<RefreshIcon />} label="Expiran en 7 días" value={dashboard?.expiringThisWeek || 0} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard icon={<WifiTetheringIcon />} label="Sesiones online" value={dashboard?.onlineSessions || 0} />
            </Grid>
            <Grid item xs={12}>
              <Panel title="Actividad reciente" helper="Últimas cuentas YouTube Premium gestionadas por tu portal.">
                <Stack spacing={1.5}>
                  {Array.isArray(dashboard?.recentCustomers) && dashboard.recentCustomers.length ? dashboard.recentCustomers.slice(0, 6).map((row) => (
                    <AccountCard key={row.userId} row={row} onRenew={openRenew} onToggle={toggleAccount} onPassword={setPasswordDialog} />
                  )) : <EmptyState text="Aún no hay cuentas premium creadas." />}
                </Stack>
              </Panel>
            </Grid>
          </Grid>
        ) : null}

        {tab === 'accounts' ? (
          <Panel title="Cuentas Premium" helper="Crea, renueva y administra cuentas YouTube/SmartTube Premium." action={<Button startIcon={<RefreshIcon />} onClick={load}>Actualizar</Button>}>
            <Stack spacing={1.5}>
              {rowsOf(accounts).length ? rowsOf(accounts).map((row) => (
                <AccountCard key={row.userId} row={row} onRenew={openRenew} onToggle={toggleAccount} onPassword={setPasswordDialog} />
              )) : <EmptyState text="No hay cuentas premium para mostrar." />}
            </Stack>
          </Panel>
        ) : null}

        {tab === 'sessions' ? (
          <Panel title="Sesiones online" helper="Desconecta una sesión activa sin desvincular el dispositivo completo." action={<Button startIcon={<RefreshIcon />} onClick={load}>Actualizar</Button>}>
            <Grid container spacing={1.5}>
              {rowsOf(sessions).length ? rowsOf(sessions).map((row) => (
                <Grid item xs={12} md={6} key={row.sessionId}>
                  <Paper sx={{ p: 2, bgcolor: '#121212', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 2 }}>
                    <Stack spacing={1}>
                      <Stack direction="row" sx={{ justifyContent: 'space-between', gap: 2 }}>
                        <Box>
                          <Typography variant="h4" sx={{ color: '#fff' }}>{row.name || 'Cuenta Premium'}</Typography>
                          <Typography sx={{ color: 'rgba(255,255,255,0.56)' }}>{row.email}</Typography>
                        </Box>
                        <StatusChip value={row.status || 'ACTIVE'} />
                      </Stack>
                      <Typography sx={{ color: 'rgba(255,255,255,0.72)' }}>{row.deviceName || 'Dispositivo sin nombre'}</Typography>
                      <Typography sx={{ color: 'rgba(255,255,255,0.48)', fontSize: 13 }}>Último heartbeat: {displayDate(row.lastSeenAt)}</Typography>
                      <Button color="error" variant="outlined" startIcon={<PowerSettingsNewIcon />} onClick={() => disconnectSession(row)}>
                        Desconectar sesión
                      </Button>
                    </Stack>
                  </Paper>
                </Grid>
              )) : <Grid item xs={12}><EmptyState text="No hay sesiones online activas." /></Grid>}
            </Grid>
          </Panel>
        ) : null}

        {tab === 'credits' ? (
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <MetricCard icon={<AccountBalanceWalletIcon />} label="Saldo actual" value={unitsToCredits(wallet?.availableCreditUnits ?? wallet?.availableCredits)} helper="créditos" />
            </Grid>
            <Grid item xs={12} md={8}>
              <Panel title="Historial de créditos" helper="Cada venta o renovación genera un movimiento de consumo.">
                <Stack spacing={1.25}>
                  {rowsOf(ledger).length ? rowsOf(ledger).map((row) => (
                    <Paper key={row.id} sx={{ p: 1.5, bgcolor: '#121212', borderRadius: 2 }}>
                      <Stack direction="row" sx={{ justifyContent: 'space-between', gap: 2 }}>
                        <Box>
                          <Typography sx={{ color: '#fff', fontWeight: 700 }}>{row.movementType || 'Movimiento'}</Typography>
                          <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{row.reason || '-'} · {displayDate(row.createdAt)}</Typography>
                        </Box>
                        <Typography sx={{ color: Number(row.creditUnitsDelta ?? row.creditsDelta) < 0 ? '#ff8a80' : '#69f0ae', fontWeight: 800 }}>
                          {unitsToCredits(row.creditUnitsDelta ?? row.creditsDelta)}
                        </Typography>
                      </Stack>
                    </Paper>
                  )) : <EmptyState text="No hay movimientos de créditos." />}
                </Stack>
              </Panel>
            </Grid>
          </Grid>
        ) : null}

        {tab === 'notifications' ? (
          <Panel title="Notificaciones" helper="Mensajes enviados por el administrador del servicio.">
            <Stack spacing={1.5}>
              {notifications.length ? notifications.map((item) => (
                <Paper key={item.id} sx={{ p: 2, bgcolor: '#121212', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 2 }}>
                  <Stack direction="row" spacing={1.5}>
                    <NotificationsIcon sx={{ color: '#fff' }} />
                    <Box>
                      <Typography variant="h4" sx={{ color: '#fff' }}>{item.title}</Typography>
                      <Typography sx={{ color: 'rgba(255,255,255,0.66)' }}>{item.message}</Typography>
                    </Box>
                  </Stack>
                </Paper>
              )) : <EmptyState text="No tienes notificaciones." />}
            </Stack>
          </Panel>
        ) : null}

        {tab === 'network' && canSuper ? (
          <Panel title="Red de Resellers" helper="Crea resellers hijos y transfiere créditos desde tu saldo." action={<Button variant="contained" startIcon={<AddIcon />} onClick={() => setNetworkDialog(true)}>Nuevo reseller</Button>}>
            <Stack spacing={1.5}>
              {rowsOf(network).length ? rowsOf(network).map((row) => (
                <Paper key={row.username} sx={{ p: 2, bgcolor: '#121212', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 2 }}>
                  <Stack direction={{ xs: 'column', md: 'row' }} sx={{ justifyContent: 'space-between', gap: 1.5 }}>
                    <Box>
                      <Typography variant="h4" sx={{ color: '#fff' }}>{row.display_name || row.username}</Typography>
                      <Typography sx={{ color: 'rgba(255,255,255,0.56)' }}>{row.username} · {row.reseller_type}</Typography>
                    </Box>
                    <Stack direction="row" spacing={1}>
                      <Chip label={`${unitsToCredits(row.available_credits)} créditos`} />
                      <Button onClick={() => setTransferDialog(row)}>Transferir</Button>
                    </Stack>
                  </Stack>
                </Paper>
              )) : <EmptyState text="Todavía no tienes resellers en tu red." />}
            </Stack>
          </Panel>
        ) : null}
      </Stack>

      <AccountDialog open={accountDialog} form={accountForm} setForm={setAccountForm} onClose={() => setAccountDialog(false)} onSubmit={submitAccount} showPassword={showPassword} setShowPassword={setShowPassword} />
      <PlanDialog open={Boolean(renewDialog)} form={renewForm} setForm={setRenewForm} onClose={() => setRenewDialog(null)} onSubmit={submitRenewal} />
      <ValueDialog
        open={Boolean(passwordDialog)}
        title="Cambiar contraseña de cuenta premium"
        label="Nueva contraseña"
        value={passwordValue}
        type="password"
        onChange={setPasswordValue}
        onClose={() => setPasswordDialog(null)}
        onSubmit={submitPasswordReset}
      />
      <NetworkDialog open={networkDialog} form={networkForm} setForm={setNetworkForm} onClose={() => setNetworkDialog(false)} onSubmit={saveNetworkAccount} />
      <ValueDialog
        open={Boolean(transferDialog)}
        title={`Transferir créditos a ${transferDialog?.username || ''}`}
        label="Créditos"
        value={transferValue}
        type="number"
        onChange={setTransferValue}
        onClose={() => setTransferDialog(null)}
        onSubmit={submitTransfer}
      />
    </Box>
  );
}

function EmptyState({ text }) {
  return (
    <Box sx={{ p: 3, textAlign: 'center', color: 'rgba(255,255,255,0.56)', border: '1px dashed rgba(255,255,255,0.12)', borderRadius: 2 }}>
      {text}
    </Box>
  );
}

function PlanFields({ form, setForm }) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4}>
        <TextField select label="Plan" value={form.planCode} onChange={(e) => setForm((p) => ({ ...p, planCode: e.target.value }))} fullWidth>
          <MenuItem value="INDIVIDUAL">Plan Individual</MenuItem>
          <MenuItem value="FAMILY">Plan Family</MenuItem>
        </TextField>
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField select label="Paquete" value={form.packageCode} onChange={(e) => setForm((p) => ({ ...p, packageCode: e.target.value }))} fullWidth>
          <MenuItem value="MONTHLY">Mensual</MenuItem>
          <MenuItem value="QUARTERLY">Trimestral</MenuItem>
          <MenuItem value="SEMIANNUAL">Semestral</MenuItem>
          <MenuItem value="ANNUAL">Anual</MenuItem>
        </TextField>
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          label="Dispositivos"
          type="number"
          value={form.deviceLimit}
          onChange={(e) => setForm((p) => ({ ...p, deviceLimit: Math.max(Number(e.target.value || 1), 1) }))}
          fullWidth
        />
      </Grid>
    </Grid>
  );
}

function AccountDialog({ open, form, setForm, onClose, onSubmit, showPassword, setShowPassword }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Nueva cuenta YouTube Premium</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField label="Nombre de la cuenta" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} fullWidth />
          <TextField label="Correo de acceso" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} fullWidth />
          <TextField
            label="Contraseña temporal"
            value={form.password}
            type={showPassword ? 'text' : 'password'}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <PlanFields form={form} setForm={setForm} />
          <Typography sx={{ color: 'rgba(255,255,255,0.56)', fontSize: 13 }}>
            Individual cuesta 1.00 crédito por mes. Family cuesta 1.25 créditos por mes. Cada dispositivo adicional suma 0.50 crédito por mes.
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={onSubmit}>Crear cuenta</Button>
      </DialogActions>
    </Dialog>
  );
}

function PlanDialog({ open, form, setForm, onClose, onSubmit }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Renovar cuenta premium</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <PlanFields form={form} setForm={setForm} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={onSubmit}>Renovar</Button>
      </DialogActions>
    </Dialog>
  );
}

function ValueDialog({ open, title, label, value, type = 'text', onChange, onClose, onSubmit }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <TextField label={label} value={value} type={type} onChange={(e) => onChange(e.target.value)} fullWidth autoFocus />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={onSubmit}>Confirmar</Button>
      </DialogActions>
    </Dialog>
  );
}

function NetworkDialog({ open, form, setForm, onClose, onSubmit }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Nuevo reseller de tu red</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField label="Username/email" value={form.username} onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))} fullWidth />
          <TextField label="Nombre comercial" value={form.displayName} onChange={(e) => setForm((p) => ({ ...p, displayName: e.target.value }))} fullWidth />
          <Typography sx={{ color: 'rgba(255,255,255,0.56)', fontSize: 13 }}>
            Esta cuenta quedará vinculada automáticamente a tu red de superreseller.
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={onSubmit}>Guardar</Button>
      </DialogActions>
    </Dialog>
  );
}
