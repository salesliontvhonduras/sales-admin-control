import { useCallback, useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useSnackbar } from 'notistack';
import useAuth from 'hooks/useAuth';
import { getUserPermissions } from 'utils/rbac';
import {
  createResellerCustomer,
  getResellerDashboard,
  getResellerWalletLedger,
  listResellerCustomers,
  listResellerNotifications,
  listResellerProfiles,
  listResellerSessions,
  renewResellerCustomer,
  resetResellerCustomerPassword,
  revokeResellerSession,
  sendResellerNotification,
  transferResellerCredits,
  updateResellerCustomerStatus,
  upsertResellerProfile
} from 'api/reseller-portal';

const emptyCustomer = { name: '', email: '', password: '', planCode: 'INDIVIDUAL', packageCode: 'MONTHLY', deviceLimit: 1 };
const emptyRenewal = { planCode: 'INDIVIDUAL', packageCode: 'MONTHLY', deviceLimit: 1 };

function formatCredits(units = 0) {
  return (Number(units || 0) / 100).toFixed(2);
}

function rowsOf(payload) {
  return Array.isArray(payload?.data) ? payload.data : [];
}

function totalOf(payload) {
  return Number(payload?.total || 0);
}

function StatusChip({ value }) {
  const status = String(value || '').toUpperCase();
  const color = status === 'ACTIVE' ? 'success' : status === 'EXPIRED' ? 'warning' : 'default';
  return <Chip size="small" label={status || 'N/A'} color={color} />;
}

function MetricCard({ label, value, helper }) {
  return (
    <Paper sx={{ p: 2.5, bgcolor: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 2 }}>
      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.56)' }}>
        {label}
      </Typography>
      <Typography variant="h2" sx={{ color: '#fff', mt: 0.5 }}>
        {value}
      </Typography>
      {helper ? (
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.48)' }}>
          {helper}
        </Typography>
      ) : null}
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
  const [customers, setCustomers] = useState(null);
  const [sessions, setSessions] = useState(null);
  const [ledger, setLedger] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [resellers, setResellers] = useState(null);
  const [customerDialog, setCustomerDialog] = useState(false);
  const [customerForm, setCustomerForm] = useState(emptyCustomer);
  const [renewDialog, setRenewDialog] = useState(null);
  const [renewForm, setRenewForm] = useState(emptyRenewal);
  const [passwordDialog, setPasswordDialog] = useState(null);
  const [passwordValue, setPasswordValue] = useState('');
  const [transferDialog, setTransferDialog] = useState(null);
  const [transferValue, setTransferValue] = useState('');
  const [resellerDialog, setResellerDialog] = useState(false);
  const [resellerForm, setResellerForm] = useState({ username: '', displayName: '', resellerType: 'RESELLER', parentUsername: '', active: true });
  const [notificationDialog, setNotificationDialog] = useState(false);
  const [notificationForm, setNotificationForm] = useState({ title: '', message: '', targetType: 'ALL', targetUsername: '' });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      if (tab === 'dashboard') setDashboard(await getResellerDashboard());
      if (tab === 'customers') setCustomers(await listResellerCustomers({ index: 0, size: 50 }));
      if (tab === 'sessions') setSessions(await listResellerSessions({ status: 'ACTIVE', index: 0, size: 50 }));
      if (tab === 'credits') setLedger(await getResellerWalletLedger({ index: 0, size: 40 }));
      if (tab === 'notifications') setNotifications(await listResellerNotifications({ index: 0, size: 40 }));
      if (tab === 'super' && canSuper) setResellers(await listResellerProfiles({ index: 0, size: 50 }));
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || 'No se pudo cargar la información.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [tab, canSuper, enqueueSnackbar]);

  useEffect(() => {
    load();
  }, [load]);

  const submitCustomer = async () => {
    try {
      await createResellerCustomer(customerForm, `create-${customerForm.email}-${Date.now()}`);
      enqueueSnackbar('Cliente creado correctamente.', { variant: 'success' });
      setCustomerDialog(false);
      setCustomerForm(emptyCustomer);
      setTab('customers');
      await load();
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || 'No se pudo crear el cliente.', { variant: 'error' });
    }
  };

  const submitRenewal = async () => {
    try {
      await renewResellerCustomer(renewDialog.userId, renewForm, `renew-${renewDialog.userId}-${Date.now()}`);
      enqueueSnackbar('Cliente renovado correctamente.', { variant: 'success' });
      setRenewDialog(null);
      await load();
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || 'No se pudo renovar.', { variant: 'error' });
    }
  };

  const toggleCustomer = async (row) => {
    try {
      await updateResellerCustomerStatus(row.userId, !row.active);
      enqueueSnackbar('Estado actualizado.', { variant: 'success' });
      await load();
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || 'No se pudo actualizar.', { variant: 'error' });
    }
  };

  const resetPassword = async (row) => {
    setPasswordDialog(row);
    setPasswordValue('');
  };

  const submitPasswordReset = async () => {
    if (!passwordDialog || !passwordValue) return;
    try {
      await resetResellerCustomerPassword(passwordDialog.userId, passwordValue);
      enqueueSnackbar('Contraseña actualizada.', { variant: 'success' });
      setPasswordDialog(null);
      setPasswordValue('');
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || 'No se pudo actualizar contraseña.', { variant: 'error' });
    }
  };

  const disconnectSession = async (row) => {
    try {
      await revokeResellerSession(row.sessionId);
      enqueueSnackbar('Sesión desconectada.', { variant: 'success' });
      await load();
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || 'No se pudo desconectar.', { variant: 'error' });
    }
  };

  const saveReseller = async () => {
    try {
      await upsertResellerProfile(resellerForm);
      enqueueSnackbar('Reseller guardado.', { variant: 'success' });
      setResellerDialog(false);
      await load();
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || 'No se pudo guardar reseller.', { variant: 'error' });
    }
  };

  const transferCredits = async (row) => {
    setTransferDialog(row);
    setTransferValue('');
  };

  const submitTransferCredits = async () => {
    if (!transferDialog || !transferValue) return;
    try {
      await transferResellerCredits(transferDialog.username, { credits: Number(transferValue), reason: 'Transferencia superreseller' });
      enqueueSnackbar('Créditos transferidos.', { variant: 'success' });
      setTransferDialog(null);
      setTransferValue('');
      await load();
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || 'No se pudo transferir.', { variant: 'error' });
    }
  };

  const sendNotification = async () => {
    try {
      await sendResellerNotification(notificationForm);
      enqueueSnackbar('Notificación enviada.', { variant: 'success' });
      setNotificationDialog(false);
      setNotificationForm({ title: '', message: '', targetType: 'ALL', targetUsername: '' });
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || 'No se pudo enviar.', { variant: 'error' });
    }
  };

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', md: 'row' }} sx={{ justifyContent: 'space-between', gap: 2 }}>
          <Box>
            <Typography variant="h1" sx={{ color: '#fff' }}>
              Consola reseller
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.58)' }}>Ventas, sesiones, créditos y clientes SmartTube Premium.</Typography>
          </Box>
          <Button variant="contained" onClick={() => setCustomerDialog(true)}>
            Nuevo cliente
          </Button>
        </Stack>

        <Tabs
          value={tab}
          onChange={(_, value) => setTab(value)}
          variant="scrollable"
          sx={{ borderBottom: '1px solid rgba(255,255,255,0.08)', '& .MuiTab-root': { color: 'rgba(255,255,255,0.68)' } }}
        >
          <Tab value="dashboard" label="Dashboard" />
          <Tab value="customers" label="Clientes" />
          <Tab value="sessions" label="Sesiones" />
          <Tab value="credits" label="Créditos" />
          <Tab value="notifications" label="Notificaciones" />
          {canSuper ? <Tab value="super" label="Superreseller" /> : null}
        </Tabs>

        {loading ? <CircularProgress /> : null}

        {tab === 'dashboard' && dashboard ? (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard label="Saldo" value={formatCredits(dashboard.wallet?.availableCreditUnits ?? dashboard.wallet?.availableCredits)} helper="créditos" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard label="Clientes" value={dashboard.totalCustomers || 0} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard label="Expiran esta semana" value={dashboard.expiringThisWeek || 0} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard label="En línea" value={dashboard.onlineSessions || 0} />
            </Grid>
          </Grid>
        ) : null}

        {tab === 'customers' ? (
          <TablePanel
            columns={['Cliente', 'Licencia', 'Plan', 'Dispositivos', 'Expira', 'Estado', 'Acciones']}
            rows={rowsOf(customers)}
            renderRow={(row) => (
              <TableRow key={row.userId}>
                <TableCell>{row.name}<br /><Typography variant="caption">{row.email}</Typography></TableCell>
                <TableCell>{row.serialCode}</TableCell>
                <TableCell>{row.planCode || '-'} / {row.packageCode || '-'}</TableCell>
                <TableCell>{row.deviceCount || 0}/{row.deviceLimit || 1}</TableCell>
                <TableCell>{row.expiresAt ? String(row.expiresAt).slice(0, 10) : '-'}</TableCell>
                <TableCell><StatusChip value={row.licenseStatus} /></TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button size="small" onClick={() => { setRenewDialog(row); setRenewForm({ ...emptyRenewal, deviceLimit: row.deviceLimit || 1 }); }}>Renovar</Button>
                    <Button size="small" onClick={() => toggleCustomer(row)}>{row.active ? 'Suspender' : 'Activar'}</Button>
                    <Button size="small" onClick={() => resetPassword(row)}>Password</Button>
                  </Stack>
                </TableCell>
              </TableRow>
            )}
          />
        ) : null}

        {tab === 'sessions' ? (
          <TablePanel
            columns={['Cliente', 'Dispositivo', 'Último heartbeat', 'Estado', 'Acciones']}
            rows={rowsOf(sessions)}
            renderRow={(row) => (
              <TableRow key={row.sessionId}>
                <TableCell>{row.name}<br /><Typography variant="caption">{row.email}</Typography></TableCell>
                <TableCell>{row.deviceName || row.deviceIdHash}</TableCell>
                <TableCell>{row.lastSeenAt ? String(row.lastSeenAt).replace('T', ' ').slice(0, 16) : '-'}</TableCell>
                <TableCell><StatusChip value={row.status} /></TableCell>
                <TableCell><Button size="small" color="error" onClick={() => disconnectSession(row)}>Desconectar</Button></TableCell>
              </TableRow>
            )}
          />
        ) : null}

        {tab === 'credits' ? (
          <TablePanel
            columns={['Movimiento', 'Créditos', 'Saldo', 'Razón', 'Fecha']}
            rows={rowsOf(ledger)}
            renderRow={(row) => (
              <TableRow key={row.id}>
                <TableCell>{row.movementType}</TableCell>
                <TableCell>{formatCredits(row.creditUnitsDelta ?? row.creditsDelta)}</TableCell>
                <TableCell>{formatCredits(row.balanceUnitsAfter ?? row.balanceAfter)}</TableCell>
                <TableCell>{row.reason}</TableCell>
                <TableCell>{row.createdAt ? String(row.createdAt).replace('T', ' ').slice(0, 16) : '-'}</TableCell>
              </TableRow>
            )}
          />
        ) : null}

        {tab === 'notifications' ? (
          <Stack spacing={2}>
            <Button sx={{ alignSelf: 'flex-start' }} variant="outlined" onClick={() => setNotificationDialog(true)}>
              Enviar notificación
            </Button>
            {notifications.map((item) => (
              <Paper key={item.id} sx={{ p: 2, bgcolor: '#111', border: '1px solid rgba(255,255,255,0.08)' }}>
                <Stack direction="row" sx={{ justifyContent: 'space-between', gap: 2 }}>
                  <Box>
                    <Typography variant="h4" sx={{ color: '#fff' }}>{item.title}</Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.66)' }}>{item.message}</Typography>
                  </Box>
                  <Chip size="small" label={Number(item.read_flag) === 1 ? 'Leída' : 'Nueva'} color={Number(item.read_flag) === 1 ? 'default' : 'primary'} />
                </Stack>
              </Paper>
            ))}
          </Stack>
        ) : null}

        {tab === 'super' && canSuper ? (
          <Stack spacing={2}>
            <Button sx={{ alignSelf: 'flex-start' }} variant="contained" onClick={() => setResellerDialog(true)}>
              Crear reseller
            </Button>
            <TablePanel
              columns={['Reseller', 'Tipo', 'Parent', 'Saldo', 'Estado', 'Acciones']}
              rows={rowsOf(resellers)}
              renderRow={(row) => (
                <TableRow key={row.username}>
                  <TableCell>{row.display_name || row.username}<br /><Typography variant="caption">{row.username}</Typography></TableCell>
                  <TableCell>{row.reseller_type}</TableCell>
                  <TableCell>{row.parent_username || '-'}</TableCell>
                  <TableCell>{formatCredits(row.available_credits)}</TableCell>
                  <TableCell><StatusChip value={Number(row.active) === 1 ? 'ACTIVE' : 'SUSPENDED'} /></TableCell>
                  <TableCell><Button size="small" onClick={() => transferCredits(row)}>Acreditar</Button></TableCell>
                </TableRow>
              )}
            />
          </Stack>
        ) : null}
      </Stack>

      <CustomerDialog open={customerDialog} form={customerForm} setForm={setCustomerForm} onClose={() => setCustomerDialog(false)} onSubmit={submitCustomer} />
      <PlanDialog open={Boolean(renewDialog)} title="Renovar cliente" form={renewForm} setForm={setRenewForm} onClose={() => setRenewDialog(null)} onSubmit={submitRenewal} />
      <ValueDialog
        open={Boolean(passwordDialog)}
        title="Cambiar contraseña"
        label="Nueva contraseña"
        value={passwordValue}
        type="password"
        onChange={setPasswordValue}
        onClose={() => setPasswordDialog(null)}
        onSubmit={submitPasswordReset}
      />
      <ValueDialog
        open={Boolean(transferDialog)}
        title={`Acreditar a ${transferDialog?.username || ''}`}
        label="Créditos"
        value={transferValue}
        type="number"
        onChange={setTransferValue}
        onClose={() => setTransferDialog(null)}
        onSubmit={submitTransferCredits}
      />
      <ResellerDialog open={resellerDialog} form={resellerForm} setForm={setResellerForm} onClose={() => setResellerDialog(false)} onSubmit={saveReseller} />
      <NotificationDialog open={notificationDialog} form={notificationForm} setForm={setNotificationForm} onClose={() => setNotificationDialog(false)} onSubmit={sendNotification} />
    </Box>
  );
}

function TablePanel({ columns, rows, renderRow }) {
  return (
    <Paper sx={{ overflow: 'auto', bgcolor: '#0d0d0d', border: '1px solid rgba(255,255,255,0.08)' }}>
      <Table>
        <TableHead>
          <TableRow>{columns.map((column) => <TableCell key={column}>{column}</TableCell>)}</TableRow>
        </TableHead>
        <TableBody>
          {rows.length ? rows.map(renderRow) : (
            <TableRow><TableCell colSpan={columns.length}>Sin registros.</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </Paper>
  );
}

function PlanFields({ form, setForm }) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4}>
        <TextField select label="Plan" value={form.planCode} onChange={(e) => setForm((p) => ({ ...p, planCode: e.target.value }))} fullWidth>
          <MenuItem value="INDIVIDUAL">Individual</MenuItem>
          <MenuItem value="FAMILY">Family</MenuItem>
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
        <TextField label="Dispositivos" type="number" value={form.deviceLimit} onChange={(e) => setForm((p) => ({ ...p, deviceLimit: Number(e.target.value) }))} fullWidth />
      </Grid>
    </Grid>
  );
}

function CustomerDialog({ open, form, setForm, onClose, onSubmit }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Nuevo cliente</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField label="Nombre" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} fullWidth />
          <TextField label="Correo" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} fullWidth />
          <TextField label="Contraseña" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} fullWidth />
          <PlanFields form={form} setForm={setForm} />
        </Stack>
      </DialogContent>
      <DialogActions><Button onClick={onClose}>Cancelar</Button><Button variant="contained" onClick={onSubmit}>Crear</Button></DialogActions>
    </Dialog>
  );
}

function PlanDialog({ open, title, form, setForm, onClose, onSubmit }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent sx={{ pt: 2 }}><PlanFields form={form} setForm={setForm} /></DialogContent>
      <DialogActions><Button onClick={onClose}>Cancelar</Button><Button variant="contained" onClick={onSubmit}>Confirmar</Button></DialogActions>
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
      <DialogActions><Button onClick={onClose}>Cancelar</Button><Button variant="contained" onClick={onSubmit}>Confirmar</Button></DialogActions>
    </Dialog>
  );
}

function ResellerDialog({ open, form, setForm, onClose, onSubmit }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Reseller</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField label="Username/email" value={form.username} onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))} fullWidth />
          <TextField label="Nombre comercial" value={form.displayName} onChange={(e) => setForm((p) => ({ ...p, displayName: e.target.value }))} fullWidth />
          <TextField select label="Tipo" value={form.resellerType} onChange={(e) => setForm((p) => ({ ...p, resellerType: e.target.value }))} fullWidth>
            <MenuItem value="RESELLER">Reseller</MenuItem>
            <MenuItem value="SUPER_RESELLER">Superreseller</MenuItem>
          </TextField>
          <TextField label="Parent username" value={form.parentUsername} onChange={(e) => setForm((p) => ({ ...p, parentUsername: e.target.value }))} fullWidth />
        </Stack>
      </DialogContent>
      <DialogActions><Button onClick={onClose}>Cancelar</Button><Button variant="contained" onClick={onSubmit}>Guardar</Button></DialogActions>
    </Dialog>
  );
}

function NotificationDialog({ open, form, setForm, onClose, onSubmit }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Enviar notificación</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField label="Título" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} fullWidth />
          <TextField label="Mensaje" value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))} fullWidth multiline rows={4} />
          <TextField select label="Destino" value={form.targetType} onChange={(e) => setForm((p) => ({ ...p, targetType: e.target.value }))} fullWidth>
            <MenuItem value="ALL">Todos</MenuItem>
            <MenuItem value="RESELLER">Reseller específico</MenuItem>
            <MenuItem value="SUPER_RESELLER_TREE">Árbol superreseller</MenuItem>
          </TextField>
          {form.targetType !== 'ALL' ? (
            <TextField label="Username destino" value={form.targetUsername} onChange={(e) => setForm((p) => ({ ...p, targetUsername: e.target.value }))} fullWidth />
          ) : null}
        </Stack>
      </DialogContent>
      <DialogActions><Button onClick={onClose}>Cancelar</Button><Button variant="contained" onClick={onSubmit}>Enviar</Button></DialogActions>
    </Dialog>
  );
}
