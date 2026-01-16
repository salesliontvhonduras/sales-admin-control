import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import useAuth from 'hooks/useAuth';

import Box from '@mui/material/Box';
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
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import FormHelperText from '@mui/material/FormHelperText';
import { useTheme, useMediaQuery } from '@mui/material';

import RefreshIcon from '@mui/icons-material/Refresh';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SearchIcon from '@mui/icons-material/Search';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SecurityIcon from '@mui/icons-material/Security';
import HistoryIcon from '@mui/icons-material/History';
import MemoryIcon from '@mui/icons-material/Memory';
import PersonIcon from '@mui/icons-material/Person';
import AppsIcon from '@mui/icons-material/Apps';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { lionTvApi } from 'utils/api';

const STATUS_OPTIONS = ['ACTIVE', 'EXPIRED'];
const APPS = ['Vivo Player', 'Smart One'];
const LICENSE_PERIOD = ['ANNUAL', 'LIFETIME'];
const TYPE_LICENSE = ['PRIMARY', 'USED'];

const fieldSx = {
  '& .MuiInputBase-root': { borderRadius: 2, minHeight: 48 },
  '& .MuiInputLabel-root': { fontWeight: 500 }
};

const sectionSx = {
  p: 2,
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
  bgcolor: 'background.paper'
};

function SectionCard({ title, helper, children }) {
  return (
    <Box sx={sectionSx}>
      <Stack spacing={1.5}>
        <Box>
          <Typography variant="subtitle2">{title}</Typography>
          {helper ? (
            <Typography variant="caption" color="text.secondary">
              {helper}
            </Typography>
          ) : null}
        </Box>
        {children}
      </Stack>
    </Box>
  );
}

function normalizeLicense(item = {}) {
  return {
    licenseId: item.licenseId ?? item.license_id ?? null,
    macAddress: item.macAddress ?? item.mac_address ?? '',
    name: item.name ?? '',
    customerId: item.customerId ?? item.customer_id ?? null,
    status: (item.status ?? '').toUpperCase(),
    app: item.app ?? '',
    price: item.price ?? 0,
    createdAt: item.createdAt ?? item.created_at ?? null,
    expireAt: item.expireAt ?? item.expire_at ?? null,
    licensePeriod: item.licensePeriod ?? item.license_period ?? '',
    typeLicense: (item.typeLicense ?? item.type_license ?? '').toUpperCase(),
    username: item.username ?? '',
    currentOwnerSince: item.currentOwnerSince ?? item.current_owner_since ?? null,
    customerName: item.customerFullname ?? item.customer_fullname ?? ''
  };
}

export default function LicensesLionTv() {
  const { enqueueSnackbar } = useSnackbar();
  const { accessToken } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const [customers, setCustomers] = useState([]);
  const [customersLoading, setCustomersLoading] = useState(false);

  const [form, setForm] = useState({
    licenseId: null,
    macAddress: '',
    name: '',
    customerId: '',
    status: 'ACTIVE',
    app: 'Vivo Player',
    price: '',
    expireAt: '',
    licensePeriod: 'ANNUAL',
    typeLicense: 'PRIMARY'
  });

  const [openModal, setOpenModal] = useState(false);
  const [openDelete, setOpenDelete] = useState({ open: false, row: null });
  const [openTransfer, setOpenTransfer] = useState({ open: false, row: null, toCustomerId: '', typeLicense: 'USED' });

  const [history, setHistory] = useState([]);
  const [historyOpen, setHistoryOpen] = useState({ open: false, row: null });

  const [sending, setSending] = useState(false);

  const handleUnauthorized = (err) => {
    const status = err?.response?.status || err?.request?.status;
    return status === 401;
  };

  const loadLicenses = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const all = [];
      const pageSize = 5000;
      let index = 0;
      while (true) {
        const res = await lionTvApi.get('/licenses/v1', {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: { index, size: pageSize },
          skipAuthRedirect: true
        });
        const payload = res?.data?.data ?? res?.data ?? {};
        const raw = payload.data ?? payload.items ?? payload.content ?? payload ?? [];
        const batch = Array.isArray(raw) ? raw : [];
        all.push(...batch);
        if (batch.length < pageSize) break;
        index += 1;
      }
      const normalized = all.map(normalizeLicense);
      setRows(normalized);
      setTotal(normalized.length);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar('No se pudieron cargar las licencias.', { variant: 'error' });
      }
    } finally {
      setLoading(false);
    }
  }, [accessToken, enqueueSnackbar]);

  const loadCustomers = useCallback(async () => {
    if (!accessToken) return;
    setCustomersLoading(true);
    try {
      const all = [];
      let idx = 0;
      const size = 5000;
      while (true) {
        const res = await lionTvApi.get('/customers/v1', {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: { index: idx, size },
          skipAuthRedirect: true
        });
        const payload = res?.data?.data ?? res?.data ?? {};
        const raw = payload.data ?? payload.items ?? payload.content ?? payload ?? [];
        const batch = Array.isArray(raw) ? raw : [];
        all.push(...batch);
        if (batch.length < size) break;
        idx += 1;
      }
      const sorted = all.sort((a, b) => {
        const aName = (a.customerFullname || a.fullName || a.username || a.customerMail || '').toString().toLowerCase();
        const bName = (b.customerFullname || b.fullName || b.username || b.customerMail || '').toString().toLowerCase();
        return aName.localeCompare(bName);
      });
      setCustomers(sorted);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar('No se pudieron cargar los clientes.', { variant: 'warning' });
      }
    } finally {
      setCustomersLoading(false);
    }
  }, [accessToken, enqueueSnackbar]);

  useEffect(() => {
    loadLicenses();
    loadCustomers();
  }, [loadLicenses, loadCustomers, refreshKey]);

  const customerNameMap = useMemo(() => {
    const map = {};
    customers.forEach((c) => {
      const id = c.customerId ?? c.id;
      if (!id) return;
      map[id] = c.customerFullname || c.fullName || c.username || c.customerMail || '';
    });
    return map;
  }, [customers]);

  // Nota: esto filtra solo la página actual (porque el backend pagina).
  const filteredRows = useMemo(() => {
    if (!search) return rows;
    const term = search.toLowerCase();
    return rows.filter((row) => {
      return (
        (row.macAddress || '').toLowerCase().includes(term) ||
        (row.name || '').toLowerCase().includes(term) ||
        (row.app || '').toLowerCase().includes(term) ||
        (row.status || '').toLowerCase().includes(term) ||
        (row.typeLicense || '').toLowerCase().includes(term) ||
        (row.customerName || customerNameMap[row.customerId] || '').toLowerCase().includes(term)
      );
    });
  }, [rows, search, customerNameMap]);

  const resetForm = () =>
    setForm({
      licenseId: null,
      macAddress: '',
      name: '',
      customerId: '',
      status: 'ACTIVE',
      app: 'Vivo Player',
      price: '',
      expireAt: '',
      licensePeriod: 'ANNUAL',
      typeLicense: 'PRIMARY'
    });

  const handleFormChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleEdit = (row) => {
    setForm({
      licenseId: row.licenseId,
      macAddress: row.macAddress,
      name: row.name,
      customerId: row.customerId,
      status: row.status,
      app: row.app,
      price: row.price,
      expireAt: row.expireAt ? String(row.expireAt).slice(0, 16) : '',
      licensePeriod: row.licensePeriod,
      typeLicense: row.typeLicense
    });
    setOpenModal(true);
  };

  const handleDelete = (row) => setOpenDelete({ open: true, row });

  const handleSave = async () => {
    if (!form.macAddress || !form.name || !form.customerId || !form.status || !form.app || !form.licensePeriod || !form.typeLicense) {
      enqueueSnackbar('Completa los campos requeridos.', { variant: 'warning' });
      return;
    }

    const payload = {
      macAddress: form.macAddress,
      name: form.name,
      customerId: Number(form.customerId),
      status: form.status,
      app: form.app,
      price: form.price ? Number(form.price) : 0,
      expireAt: form.expireAt || null,
      licensePeriod: form.licensePeriod,
      typeLicense: form.typeLicense
    };

    setSending(true);
    try {
      if (form.licenseId) {
        await lionTvApi.put(`/licenses/v1/${form.licenseId}`, payload, {
          headers: { Authorization: `Bearer ${accessToken}` },
          skipAuthRedirect: true
        });
        enqueueSnackbar('Licencia actualizada.', { variant: 'success' });
      } else {
        await lionTvApi.post('/licenses/v1', payload, {
          headers: { Authorization: `Bearer ${accessToken}` },
          skipAuthRedirect: true
        });
        enqueueSnackbar('Licencia creada.', { variant: 'success' });
      }
      setOpenModal(false);
      resetForm();
      setRefreshKey((v) => v + 1);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || err.message || 'No se pudo guardar la licencia.', { variant: 'error' });
      }
    } finally {
      setSending(false);
    }
  };

  const confirmDelete = async () => {
    const row = openDelete.row;
    if (!row?.licenseId) {
      setOpenDelete({ open: false, row: null });
      return;
    }
    setSending(true);
    try {
      await lionTvApi.delete(`/licenses/v1/${row.licenseId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        skipAuthRedirect: true
      });
      enqueueSnackbar('Licencia eliminada.', { variant: 'success' });
      setOpenDelete({ open: false, row: null });
      setRefreshKey((v) => v + 1);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || err.message || 'No se pudo eliminar.', { variant: 'error' });
      }
    } finally {
      setSending(false);
    }
  };

  const handleTransfer = (row) => {
    setOpenTransfer({ open: true, row, toCustomerId: '', typeLicense: 'USED' });
  };

  const submitTransfer = async () => {
    const { row, toCustomerId, typeLicense } = openTransfer;
    if (!row?.licenseId || !toCustomerId || !typeLicense) {
      enqueueSnackbar('Selecciona cliente y tipo.', { variant: 'warning' });
      return;
    }
    setSending(true);
    try {
      await lionTvApi.post(
        `/licenses/v1/${row.licenseId}/transfer`,
        { toCustomerId: Number(toCustomerId), typeLicense },
        { headers: { Authorization: `Bearer ${accessToken}` }, skipAuthRedirect: true }
      );
      enqueueSnackbar('Licencia trasladada.', { variant: 'success' });
      setOpenTransfer({ open: false, row: null, toCustomerId: '', typeLicense: 'USED' });
      setRefreshKey((v) => v + 1);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || err.message || 'No se pudo trasladar.', { variant: 'error' });
      }
    } finally {
      setSending(false);
    }
  };

  const openHistory = async (row) => {
    setHistoryOpen({ open: true, row });
    try {
      const res = await lionTvApi.get(`/licenses/v1/${row.licenseId}/transfers`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        skipAuthRedirect: true
      });
      const list = res?.data?.data ?? res?.data ?? [];
      setHistory(Array.isArray(list) ? list : []);
    } catch {
      setHistory([]);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 1400, mx: 'auto' }}>
      <MainCard
        title="Licencias"
        secondary={
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => setRefreshKey((v) => v + 1)}>
              Recargar
            </Button>
            <Button
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
              onClick={() => {
                resetForm();
                setOpenModal(true);
              }}
            >
              Nueva licencia
            </Button>
          </Stack>
        }
      >
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} sm={4}>
            <Chip label={`${total} licencias`} color="primary" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Chip label={`Activas: ${rows.filter((r) => r.status === 'ACTIVE').length}`} color="success" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Chip label={`Expiradas: ${rows.filter((r) => r.status === 'EXPIRED').length}`} color="warning" />
          </Grid>
        </Grid>
      </MainCard>

      <MainCard
        title="Listado de licencias"
        secondary={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: { xs: '100%', sm: 360 } }}>
            <TextField
              size="small"
              placeholder="Buscar (mac, cliente, app)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
          </Box>
        }
      >
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Mac</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>App</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Periodo</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Precio</TableCell>
                <TableCell>Expira</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows.map((row) => (
                <TableRow key={row.licenseId}>
                  <TableCell>{row.macAddress}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.customerName || customerNameMap[row.customerId] || '-'}</TableCell>
                  <TableCell>{row.app}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>{row.licensePeriod}</TableCell>
                  <TableCell>{row.typeLicense}</TableCell>
                  <TableCell>{Number(row.price || 0).toFixed(2)}</TableCell>
                  <TableCell>{row.expireAt ? String(row.expireAt).slice(0, 10) : '-'}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1}>
                      <IconButton size="small" onClick={() => handleEdit(row)}>
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleTransfer(row)}>
                        <SwapHorizIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => openHistory(row)}>
                        <HistoryIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(row)}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}

              {!loading && filteredRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    No hay licencias registradas.
                  </TableCell>
                </TableRow>
              )}

              {loading && (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    Cargando...
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider sx={{ my: 1 }} />

        <TablePagination
          component="div"
          count={total}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(e, p) => setPage(p)}
          onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
        />
      </MainCard>

      {/* MODAL CREATE/EDIT */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="md" fullScreen={isMobile}>
        <DialogTitle sx={{ position: 'relative', pr: 5 }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Avatar
              sx={{
                bgcolor: form.licenseId ? 'warning.main' : 'primary.main',
                color: 'primary.contrastText',
                width: 36,
                height: 36,
                boxShadow: 3
              }}
            >
              <SecurityIcon fontSize="small" />
            </Avatar>

            <Box>
              <Typography variant="h6">{form.licenseId ? 'Editar licencia' : 'Nueva licencia'}</Typography>
              <Typography variant="caption" color="text.secondary">
                Ingresa los datos de la licencia y su propiedad.
              </Typography>
            </Box>
          </Stack>
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            bgcolor: 'background.default',
            px: { xs: 1.5, sm: 3 },
            py: { xs: 1.5, sm: 2 }
          }}
        >
          <Stack spacing={2}>
            <SectionCard title="Identidad" helper="Mac, nombre y cliente dueño.">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    required
                    label="Mac Address"
                    value={form.macAddress}
                    onChange={handleFormChange('macAddress')}
                    fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MemoryIcon fontSize="small" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    required
                    label="Nombre"
                    value={form.name}
                    onChange={handleFormChange('name')}
                    fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon fontSize="small" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth required sx={fieldSx} disabled={customersLoading}>
                    <InputLabel>Cliente</InputLabel>
                    <Select value={form.customerId} label="Cliente" onChange={handleFormChange('customerId')}>
                      <MenuItem value="">
                        <em>Selecciona un cliente</em>
                      </MenuItem>
                      {(customers || []).map((c) => (
                        <MenuItem key={c.customerId || c.id} value={c.customerId || c.id}>
                          {c.customerFullname || c.fullName || c.username || c.customerMail}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{customersLoading ? 'Cargando clientes...' : 'Cliente asociado a la licencia'}</FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
            </SectionCard>

            <SectionCard title="Atributos" helper="App, estado, tipo y periodo.">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth required sx={fieldSx}>
                    <InputLabel>Status</InputLabel>
                    <Select value={form.status} label="Status" onChange={handleFormChange('status')}>
                      {STATUS_OPTIONS.map((s) => (
                        <MenuItem key={s} value={s}>
                          {s}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>Estado actual</FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth required sx={fieldSx}>
                    <InputLabel>Tipo</InputLabel>
                    <Select value={form.typeLicense} label="Tipo" onChange={handleFormChange('typeLicense')}>
                      {TYPE_LICENSE.map((s) => (
                        <MenuItem key={s} value={s}>
                          {s}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>PRIMARY / USED</FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth required sx={fieldSx}>
                    <InputLabel>App</InputLabel>
                    <Select value={form.app} label="App" onChange={handleFormChange('app')}>
                      {APPS.map((s) => (
                        <MenuItem key={s} value={s}>
                          {s}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>Aplicación asociada</FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth required sx={fieldSx}>
                    <InputLabel>Periodo</InputLabel>
                    <Select value={form.licensePeriod} label="Periodo" onChange={handleFormChange('licensePeriod')}>
                      {LICENSE_PERIOD.map((s) => (
                        <MenuItem key={s} value={s}>
                          {s}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>Vigencia</FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
            </SectionCard>

            <SectionCard title="Precio y expiración" helper="Monto y fecha de vencimiento (si aplica).">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Precio"
                    type="number"
                    value={form.price}
                    onChange={handleFormChange('price')}
                    fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Expira"
                    type="datetime-local"
                    value={form.expireAt}
                    onChange={handleFormChange('expireAt')}
                    fullWidth
                    sx={fieldSx}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccessTimeIcon fontSize="small" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
              </Grid>
            </SectionCard>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={resetForm} disabled={sending}>
            Limpiar
          </Button>
          <Button variant="contained" onClick={handleSave} disabled={sending}>
            {sending ? 'Guardando...' : form.licenseId ? 'Guardar cambios' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* DELETE */}
      <Dialog
        open={openDelete.open}
        onClose={() => setOpenDelete({ open: false, row: null })}
        maxWidth="xs"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>Eliminar licencia</DialogTitle>
        <DialogContent dividers>
          <Typography>
            ¿Eliminar la licencia <strong>{openDelete.row?.name ?? ''}</strong>? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete({ open: false, row: null })} disabled={sending}>
            Cancelar
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained" disabled={sending}>
            {sending ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* TRANSFER */}
      <Dialog
        open={openTransfer.open}
        onClose={() => setOpenTransfer({ open: false, row: null, toCustomerId: '', typeLicense: 'USED' })}
        fullWidth
        maxWidth="sm"
        fullScreen={isMobile}
      >
        <DialogTitle>Trasladar licencia</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <Typography variant="body2">Licencia: {openTransfer.row?.name}</Typography>

            <FormControl fullWidth sx={fieldSx} disabled={customersLoading}>
              <InputLabel>Nuevo cliente</InputLabel>
              <Select
                value={openTransfer.toCustomerId}
                label="Nuevo cliente"
                onChange={(e) => setOpenTransfer((p) => ({ ...p, toCustomerId: e.target.value }))}
              >
                <MenuItem value="">
                  <em>Selecciona un cliente</em>
                </MenuItem>
                {(customers || []).map((c) => (
                  <MenuItem key={c.customerId || c.id} value={c.customerId || c.id}>
                    {c.customerFullname || c.fullName || c.username || c.customerMail}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{customersLoading ? 'Cargando clientes...' : 'Nuevo dueño de la licencia'}</FormHelperText>
            </FormControl>

            <FormControl fullWidth sx={fieldSx}>
              <InputLabel>Tipo</InputLabel>
              <Select
                value={openTransfer.typeLicense}
                label="Tipo"
                onChange={(e) => setOpenTransfer((p) => ({ ...p, typeLicense: e.target.value }))}
              >
                {TYPE_LICENSE.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Tipo a asignar en el nuevo cliente</FormHelperText>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTransfer({ open: false, row: null, toCustomerId: '', typeLicense: 'USED' })} disabled={sending}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={submitTransfer} disabled={sending}>
            {sending ? 'Trasladando...' : 'Trasladar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ✅ HISTORY (MEJORADO PRO) */}
      <Dialog
        open={historyOpen.open}
        onClose={() => setHistoryOpen({ open: false, row: null })}
        fullWidth
        maxWidth="md"
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ position: 'relative', pr: 5 }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Avatar
              sx={{
                bgcolor: 'info.main',
                color: 'info.contrastText',
                width: 36,
                height: 36,
                boxShadow: 3
              }}
            >
              <HistoryIcon fontSize="small" />
            </Avatar>

            <Box>
              <Typography variant="h6">Historial de movimientos</Typography>
              <Typography variant="caption" color="text.secondary">
                Cambios de dueño y tipo de licencia.
              </Typography>
            </Box>
          </Stack>
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            bgcolor: 'background.default',
            px: { xs: 1.5, sm: 3 },
            py: { xs: 1.5, sm: 2 }
          }}
        >
          <Stack spacing={2}>
            {/* Resumen de la licencia */}
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper'
              }}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <Typography variant="caption" color="text.secondary">
                    Licencia
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {historyOpen.row?.name || '-'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {historyOpen.row?.macAddress || ''}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Typography variant="caption" color="text.secondary">
                    Cliente actual
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {historyOpen.row?.customerName ||
                      customerNameMap[historyOpen.row?.customerId] ||
                      '-'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ID: {historyOpen.row?.customerId ?? '-'}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Stack direction="row" spacing={1} justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
                    <Chip
                      size="small"
                      label={`Total movimientos: ${history?.length || 0}`}
                      color="info"
                      variant="outlined"
                    />
                    <Chip
                      size="small"
                      label={`Tipo actual: ${historyOpen.row?.typeLicense || '-'}`}
                      color="primary"
                      variant="outlined"
                    />
                  </Stack>
                </Grid>
              </Grid>
            </Box>

            {/* Movimientos */}
            <Box
              sx={{
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                overflow: 'hidden'
              }}
            >
              <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  Movimientos
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  El más reciente aparece arriba.
                </Typography>
              </Box>

              {(!history || history.length === 0) && (
                <Box sx={{ p: 2 }}>
                  <Typography variant="body2">Sin movimientos registrados.</Typography>
                </Box>
              )}

              {(history || []).length > 0 && (
                <Stack sx={{ p: 2 }} spacing={1.5}>
                  {[...(history || [])]
                    .slice()
                    .reverse()
                    .map((h, idx) => {
                      const fromName =
                        h.fromCustomerName ||
                        customerNameMap[h.fromCustomerId] ||
                        h.fromCustomerId ||
                        '-';
                      const toName =
                        h.toCustomerName ||
                        customerNameMap[h.toCustomerId] ||
                        h.toCustomerId ||
                        '-';
                      const dateLabel = h.createdAt ? String(h.createdAt) : '-';

                      return (
                        <Box
                          key={h.transferId ?? `${h.toCustomerId}-${idx}`}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            bgcolor: 'background.default'
                          }}
                        >
                          <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={7}>
                              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                                <Chip size="small" label={`#${(history || []).length - idx}`} variant="outlined" />
                                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                  {fromName}
                                </Typography>
                                <SwapHorizIcon fontSize="small" />
                                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                  {toName}
                                </Typography>
                              </Stack>

                              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                De ID: <strong>{h.fromCustomerId ?? '-'}</strong> → A ID:{' '}
                                <strong>{h.toCustomerId ?? '-'}</strong>
                              </Typography>
                            </Grid>

                            <Grid item xs={12} md={5}>
                              <Stack
                                direction="row"
                                spacing={1}
                                justifyContent={{ xs: 'flex-start', md: 'flex-end' }}
                                alignItems="center"
                                flexWrap="wrap"
                              >
                                <Chip
                                  size="small"
                                  color={String(h.typeLicense || '').toUpperCase() === 'PRIMARY' ? 'success' : 'warning'}
                                  label={`Tipo: ${h.typeLicense || '-'}`}
                                />
                                <Chip size="small" variant="outlined" icon={<AccessTimeIcon />} label={dateLabel} />
                              </Stack>
                            </Grid>
                          </Grid>
                        </Box>
                      );
                    })}
                </Stack>
              )}
            </Box>

            {/* Nota */}
            <Box sx={{ px: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                Tip: si quieres mostrar nombres exactos en “De/A”, tu API puede enviar{' '}
                <code>fromCustomerName</code> y <code>toCustomerName</code>. Si no, se usa el mapa local de clientes
                cuando coincide el ID.
              </Typography>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setHistoryOpen({ open: false, row: null })}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
