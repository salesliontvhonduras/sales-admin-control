import { useCallback, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useSnackbar } from 'notistack';
import MainCard from 'ui-component/cards/MainCard';
import { adminCreditReseller, listResellerProfiles, sendResellerNotification, upsertResellerProfile } from 'api/reseller-portal';

const emptyReseller = { username: '', displayName: '', resellerType: 'RESELLER', parentUsername: '', active: true };
const emptyNotification = { title: '', message: '', targetType: 'ALL', targetUsername: '' };

function formatCredits(units = 0) {
  return (Number(units || 0) / 100).toFixed(2);
}

export default function ResellerAdminLionTv() {
  const { enqueueSnackbar } = useSnackbar();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resellerOpen, setResellerOpen] = useState(false);
  const [resellerForm, setResellerForm] = useState(emptyReseller);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationForm, setNotificationForm] = useState(emptyNotification);
  const [creditTarget, setCreditTarget] = useState(null);
  const [creditValue, setCreditValue] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await listResellerProfiles({ index: 0, size: 100 });
      setRows(Array.isArray(response?.data) ? response.data : []);
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || 'No se pudieron cargar resellers.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    load();
  }, [load]);

  const saveReseller = async () => {
    try {
      await upsertResellerProfile(resellerForm);
      enqueueSnackbar('Reseller guardado.', { variant: 'success' });
      setResellerOpen(false);
      setResellerForm(emptyReseller);
      await load();
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || 'No se pudo guardar reseller.', { variant: 'error' });
    }
  };

  const sendNotification = async () => {
    try {
      await sendResellerNotification(notificationForm);
      enqueueSnackbar('Notificación enviada.', { variant: 'success' });
      setNotificationOpen(false);
      setNotificationForm(emptyNotification);
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || 'No se pudo enviar notificación.', { variant: 'error' });
    }
  };

  const creditReseller = async (row) => {
    setCreditTarget(row);
    setCreditValue('');
  };

  const submitCredit = async () => {
    if (!creditTarget || !creditValue) return;
    try {
      await adminCreditReseller(creditTarget.username, { credits: Number(creditValue), reason: 'Acreditación admin' });
      enqueueSnackbar('Créditos acreditados.', { variant: 'success' });
      setCreditTarget(null);
      setCreditValue('');
      await load();
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || 'No se pudo acreditar.', { variant: 'error' });
    }
  };

  return (
    <MainCard
      title="Resellers SmartTube Premium"
      secondary={
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={() => setNotificationOpen(true)}>Notificación</Button>
          <Button variant="contained" onClick={() => setResellerOpen(true)}>Crear reseller</Button>
        </Stack>
      }
    >
      <Stack spacing={2}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="caption">Resellers registrados</Typography>
              <Typography variant="h2">{rows.length}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="caption">Superresellers</Typography>
              <Typography variant="h2">{rows.filter((item) => item.reseller_type === 'SUPER_RESELLER').length}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="caption">Estado</Typography>
              <Typography variant="h2">{loading ? '...' : 'Activo'}</Typography>
            </Paper>
          </Grid>
        </Grid>

        <Paper sx={{ overflow: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Reseller</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Parent</TableCell>
                <TableCell>Saldo</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.username}>
                  <TableCell>{row.display_name || row.username}<br /><Typography variant="caption">{row.username}</Typography></TableCell>
                  <TableCell>{row.reseller_type}</TableCell>
                  <TableCell>{row.parent_username || '-'}</TableCell>
                  <TableCell>{formatCredits(row.available_credits)}</TableCell>
                  <TableCell>{Number(row.active) === 1 ? 'Activo' : 'Deshabilitado'}</TableCell>
                  <TableCell><Button size="small" onClick={() => creditReseller(row)}>Acreditar</Button></TableCell>
                </TableRow>
              ))}
              {!rows.length ? <TableRow><TableCell colSpan={6}>Sin resellers.</TableCell></TableRow> : null}
            </TableBody>
          </Table>
        </Paper>
      </Stack>

      <Dialog open={resellerOpen} onClose={() => setResellerOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Reseller</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField label="Username/email" value={resellerForm.username} onChange={(e) => setResellerForm((p) => ({ ...p, username: e.target.value }))} fullWidth />
            <TextField label="Nombre comercial" value={resellerForm.displayName} onChange={(e) => setResellerForm((p) => ({ ...p, displayName: e.target.value }))} fullWidth />
            <TextField select label="Tipo" value={resellerForm.resellerType} onChange={(e) => setResellerForm((p) => ({ ...p, resellerType: e.target.value }))} fullWidth>
              <MenuItem value="RESELLER">Reseller</MenuItem>
              <MenuItem value="SUPER_RESELLER">Superreseller</MenuItem>
            </TextField>
            <TextField label="Parent username" value={resellerForm.parentUsername} onChange={(e) => setResellerForm((p) => ({ ...p, parentUsername: e.target.value }))} fullWidth />
          </Stack>
        </DialogContent>
        <DialogActions><Button onClick={() => setResellerOpen(false)}>Cancelar</Button><Button variant="contained" onClick={saveReseller}>Guardar</Button></DialogActions>
      </Dialog>

      <Dialog open={notificationOpen} onClose={() => setNotificationOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Notificación reseller</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField label="Título" value={notificationForm.title} onChange={(e) => setNotificationForm((p) => ({ ...p, title: e.target.value }))} fullWidth />
            <TextField label="Mensaje" value={notificationForm.message} onChange={(e) => setNotificationForm((p) => ({ ...p, message: e.target.value }))} fullWidth multiline rows={4} />
            <TextField select label="Destino" value={notificationForm.targetType} onChange={(e) => setNotificationForm((p) => ({ ...p, targetType: e.target.value }))} fullWidth>
              <MenuItem value="ALL">Todos</MenuItem>
              <MenuItem value="RESELLER">Reseller específico</MenuItem>
              <MenuItem value="SUPER_RESELLER_TREE">Árbol superreseller</MenuItem>
            </TextField>
            {notificationForm.targetType !== 'ALL' ? (
              <TextField label="Username destino" value={notificationForm.targetUsername} onChange={(e) => setNotificationForm((p) => ({ ...p, targetUsername: e.target.value }))} fullWidth />
            ) : null}
          </Stack>
        </DialogContent>
        <DialogActions><Button onClick={() => setNotificationOpen(false)}>Cancelar</Button><Button variant="contained" onClick={sendNotification}>Enviar</Button></DialogActions>
      </Dialog>

      <Dialog open={Boolean(creditTarget)} onClose={() => setCreditTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Acreditar créditos</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            label={`Créditos para ${creditTarget?.username || ''}`}
            type="number"
            value={creditValue}
            onChange={(event) => setCreditValue(event.target.value)}
            fullWidth
            autoFocus
          />
        </DialogContent>
        <DialogActions><Button onClick={() => setCreditTarget(null)}>Cancelar</Button><Button variant="contained" onClick={submitCredit}>Acreditar</Button></DialogActions>
      </Dialog>
    </MainCard>
  );
}
