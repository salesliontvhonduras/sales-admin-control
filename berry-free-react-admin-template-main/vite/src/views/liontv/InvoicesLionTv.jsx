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
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { useTheme, useMediaQuery } from '@mui/material';
import Avatar from '@mui/material/Avatar';

import RefreshIcon from '@mui/icons-material/Refresh';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SearchIcon from '@mui/icons-material/Search';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';

import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { lionTvApi, catalogsApi } from 'utils/api';

const statusColors = {
  PAID: 'success',
  PENDING: 'warning'
};

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

const PAYMENT_METHODS = ['Bank Transfer', 'Paypal', 'Ecommerce', 'Link pago'];
const STATUS_OPTIONS = ['Paid', 'Pending'];

function formatDate(value) {
  if (!value) return '-';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString();
}

function formatDateInput(value) {
  if (!value) return '';
  const d = new Date(value);
  if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  if (typeof value === 'string' && value.length >= 10) return value.slice(0, 10);
  return '';
}

function formatDateTimePayload(value) {
  if (!value) return null;
  // value esperado: yyyy-MM-dd (desde input date)
  const base = value.slice(0, 10);
  return `${base}T00:00:00`;
}

function StatusChip({ status }) {
  const color = statusColors[status] || 'default';
  return <Chip size="small" color={color} label={status || '-'} />;
}

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

function normalizeInvoice(item = {}) {
  return {
    invoiceId: item.invoiceId ?? item.id ?? null,
    serviceId: item.serviceId ?? null,
    paymentDate: item.paymentDate ?? null,
    amountPaid: item.amountPaid ?? 0,
    amountDiscount: item.amountDiscount ?? 0,
    status: (item.status ?? '').toUpperCase(),
    packageId: item.packageId ?? null,
    customerId: item.customerId ?? null,
    paymentMethod: item.paymentMethod ?? '',
    bankId: item.bankId ?? null,
    notes: item.notes ?? '',
    createdAt: item.createdAt ?? null,
    updatedAt: item.updatedAt ?? null
  };
}

const defaultForm = {
  invoiceId: null,
  serviceId: '',
  paymentDate: '',
  amountPaid: '',
  amountDiscount: '',
  status: 'Pending',
  packageId: '',
  customerId: '',
  paymentMethod: '',
  bankId: '',
  notes: ''
};

export default function InvoicesLionTv() {
  const { enqueueSnackbar } = useSnackbar();
  const { accessToken } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [search, setSearch] = useState('');

  const [openModal, setOpenModal] = useState(false);
  const [openDelete, setOpenDelete] = useState({ open: false, row: null });
  const [form, setForm] = useState(defaultForm);
  const [sending, setSending] = useState(false);

  const [customers, setCustomers] = useState([]);
  const [customersLoading, setCustomersLoading] = useState(false);
  const [packages, setPackages] = useState([]);
  const [packagesLoading, setPackagesLoading] = useState(false);
  const [banks, setBanks] = useState([]);
  const [banksLoading, setBanksLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);

  const handleUnauthorized = (err) => {
    const status = err?.response?.status || err?.request?.status;
    return status === 401;
  };

  const loadInvoices = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const res = await lionTvApi.get('/invoices/v1', {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { index: page, size: rowsPerPage },
        skipAuthRedirect: true
      });
      const payload = res?.data?.data ?? res?.data ?? {};
      const raw = payload.data ?? payload.items ?? payload.content ?? payload ?? [];
      const items = Array.isArray(raw) ? raw : [];
      const normalized = items.map(normalizeInvoice);
      setRows(normalized);
      setTotal(payload.total ?? payload.totalElements ?? normalized.length);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || err.message || 'No se pudieron cargar las facturas.', {
          variant: 'error'
        });
      }
    } finally {
      setLoading(false);
    }
  }, [accessToken, enqueueSnackbar, page, rowsPerPage]);

  const loadCustomers = useCallback(async () => {
    if (!accessToken) return;
    setCustomersLoading(true);
    try {
      const res = await lionTvApi.get('/customers/v1', {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { index: 0, size: 300 },
        skipAuthRedirect: true
      });
      const payload = res?.data?.data ?? res?.data ?? {};
      const raw = payload.data ?? payload.items ?? payload.content ?? payload ?? [];
      setCustomers(Array.isArray(raw) ? raw : []);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar('No se pudieron cargar los clientes.', { variant: 'warning' });
      }
    } finally {
      setCustomersLoading(false);
    }
  }, [accessToken, enqueueSnackbar]);

  const loadPackages = useCallback(async () => {
    setPackagesLoading(true);
    try {
      const response = await lionTvApi.get('/packages/v1/list-packages', {
        params: { index: 0, size: 200, start: 0, filters: '', sorting: '' }
      });
      const list = response?.data?.data?.data || [];
      setPackages(Array.isArray(list) ? list : []);
    } catch (err) {
      enqueueSnackbar('No se pudieron cargar los paquetes.', { variant: 'warning' });
    } finally {
      setPackagesLoading(false);
    }
  }, [enqueueSnackbar]);

  const loadBanks = useCallback(async () => {
    setBanksLoading(true);
    try {
      const response = await catalogsApi.get('/banks/v1');
      const list = response?.data?.data ?? response?.data ?? [];
      setBanks(Array.isArray(list) ? list : []);
    } catch (err) {
      enqueueSnackbar('No se pudieron cargar los bancos.', { variant: 'warning' });
    } finally {
      setBanksLoading(false);
    }
  }, [enqueueSnackbar]);

  const loadServices = useCallback(async () => {
    setServicesLoading(true);
    try {
      const response = await catalogsApi.get('/services/v1');
      const list = response?.data?.data ?? response?.data ?? [];
      setServices(Array.isArray(list) ? list : []);
    } catch (err) {
      enqueueSnackbar('No se pudieron cargar los servicios.', { variant: 'warning' });
    } finally {
      setServicesLoading(false);
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    loadInvoices();
    loadCustomers();
    loadPackages();
    loadBanks();
    loadServices();
  }, [loadInvoices, loadCustomers, loadPackages, loadBanks, loadServices, page, rowsPerPage, refreshKey]);

  const filteredRows = useMemo(() => {
    if (!search) return rows;
    const term = search.toLowerCase();
    return rows.filter((row) => {
      return (
        String(row.invoiceId || '').toLowerCase().includes(term) ||
        String(row.customerId || '').toLowerCase().includes(term) ||
        String(row.packageId || '').toLowerCase().includes(term) ||
        (row.status || '').toLowerCase().includes(term) ||
        (row.paymentMethod || '').toLowerCase().includes(term)
      );
    });
  }, [rows, search]);

  const resetForm = () => setForm(defaultForm);

  const handleFormChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleEdit = (row) => {
    setForm({
      invoiceId: row.invoiceId,
      serviceId: row.serviceId ?? '',
      paymentDate: formatDateInput(row.paymentDate),
      amountPaid: row.amountPaid ?? '',
      amountDiscount: row.amountDiscount ?? '',
      status: row.status ? row.status.charAt(0) + row.status.slice(1).toLowerCase() : 'Pending',
      packageId: row.packageId ?? '',
      customerId: row.customerId ?? '',
      paymentMethod: row.paymentMethod ?? '',
      bankId: row.bankId ?? '',
      notes: row.notes ?? ''
    });
    setOpenModal(true);
  };

  const handleDelete = (row) => {
    setOpenDelete({ open: true, row });
  };

  const handleSave = async () => {
    if (!form.serviceId || !form.paymentDate || !form.packageId || !form.customerId || !form.paymentMethod) {
      enqueueSnackbar('Completa los campos requeridos.', { variant: 'warning' });
      return;
    }

    if (form.paymentMethod === 'Bank Transfer' && !form.bankId) {
      enqueueSnackbar('Selecciona un banco para pagos Bank Transfer.', { variant: 'warning' });
      return;
    }

    const payload = {
      serviceId: Number(form.serviceId),
      paymentDate: formatDateTimePayload(form.paymentDate),
      amountPaid: form.amountPaid ? Number(form.amountPaid) : 0,
      amountDiscount: form.amountDiscount ? Number(form.amountDiscount) : 0,
      status: form.status || 'Pending',
      packageId: Number(form.packageId),
      customerId: Number(form.customerId),
      paymentMethod: form.paymentMethod,
      bankId: form.paymentMethod === 'Bank Transfer' && form.bankId ? Number(form.bankId) : null,
      notes: form.notes
    };

    setSending(true);
    try {
      if (form.invoiceId) {
        await lionTvApi.put(`/invoices/v1/${form.invoiceId}`, payload, {
          headers: { Authorization: `Bearer ${accessToken}` },
          skipAuthRedirect: true
        });
        enqueueSnackbar('Factura actualizada.', { variant: 'success' });
      } else {
        await lionTvApi.post('/invoices/v1', payload, {
          headers: { Authorization: `Bearer ${accessToken}` },
          skipAuthRedirect: true
        });
        enqueueSnackbar('Factura creada.', { variant: 'success' });
      }
      setOpenModal(false);
      resetForm();
      setRefreshKey((v) => v + 1);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || err.message || 'No se pudo guardar la factura.', {
          variant: 'error'
        });
      }
    } finally {
      setSending(false);
    }
  };

  const confirmDelete = async () => {
    const row = openDelete.row;
    if (!row?.invoiceId) {
      setOpenDelete({ open: false, row: null });
      return;
    }
    setSending(true);
    try {
      await lionTvApi.delete(`/invoices/v1/${row.invoiceId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        skipAuthRedirect: true
      });
      enqueueSnackbar('Factura eliminada.', { variant: 'success' });
      setOpenDelete({ open: false, row: null });
      setRefreshKey((v) => v + 1);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || err.message || 'No se pudo eliminar la factura.', {
          variant: 'error'
        });
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 1400, mx: 'auto' }}>
      <MainCard
        title="Facturación"
        secondary={
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => setRefreshKey((v) => v + 1)}>
              Recargar
            </Button>
            <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={() => setOpenModal(true)}>
              Nueva factura
            </Button>
          </Stack>
        }
      >
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} sm={4}>
            <Chip label={`${total} facturas`} color="primary" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Chip label={`Pagadas: ${rows.filter((r) => r.status === 'PAID').length}`} color="success" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Chip label={`Pendientes: ${rows.filter((r) => r.status === 'PENDING').length}`} color="warning" />
          </Grid>
        </Grid>
      </MainCard>

      <MainCard
        title="Listado de facturas"
        secondary={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: { xs: '100%', sm: 360 } }}>
            <TextField
              size="small"
              placeholder="Buscar (cliente, paquete, estado)"
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
                <TableCell>ID</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Servicio</TableCell>
                <TableCell>Paquete</TableCell>
                <TableCell>Banco</TableCell>
                <TableCell>Método</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Pago</TableCell>
                <TableCell>Descuento</TableCell>
                <TableCell>Fecha pago</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows.map((row) => (
                <TableRow key={row.invoiceId}>
                  <TableCell>{row.invoiceId}</TableCell>
                  <TableCell>{row.customerId}</TableCell>
                  <TableCell>{row.serviceId}</TableCell>
                  <TableCell>{row.packageId}</TableCell>
                  <TableCell>{row.bankId || '-'}</TableCell>
                  <TableCell>{row.paymentMethod || '-'}</TableCell>
                  <TableCell>
                    <StatusChip status={row.status} />
                  </TableCell>
                  <TableCell>{Number(row.amountPaid || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell>{Number(row.amountDiscount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell>{formatDate(row.paymentDate)}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1}>
                      <IconButton size="small" onClick={() => handleEdit(row)}>
                        <EditOutlinedIcon fontSize="small" />
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
                  <TableCell colSpan={11} align="center">
                    No hay facturas registradas.
                  </TableCell>
                </TableRow>
              )}
              {loading && (
                <TableRow>
                  <TableCell colSpan={11} align="center">
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

      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="md" fullScreen={isMobile}>
        <DialogTitle sx={{ position: 'relative', pr: 5 }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Avatar
              sx={{
                bgcolor: form.invoiceId ? 'warning.main' : 'primary.main',
                color: 'primary.contrastText',
                width: 36,
                height: 36,
                boxShadow: 3
              }}
            >
              <ReceiptLongIcon fontSize="small" />
            </Avatar>
            <Box>
              <Typography variant="h6">{form.invoiceId ? 'Editar factura' : 'Nueva factura'}</Typography>
              <Typography variant="caption" color="text.secondary">
                Ingresa los datos de pago y asignación.
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
            <SectionCard title="Asignaciones" helper="Cliente, paquete, servicio y banco.">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={3} md={3}>
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
                    <FormHelperText>{customersLoading ? 'Cargando clientes...' : 'Cliente asociado'}</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3} md={3}>
                  <FormControl fullWidth required sx={fieldSx} disabled={servicesLoading}>
                    <InputLabel>Servicio</InputLabel>
                    <Select value={form.serviceId} label="Servicio" onChange={handleFormChange('serviceId')}>
                      <MenuItem value="">
                        <em>Selecciona un servicio</em>
                      </MenuItem>
                      {(services || []).map((s) => (
                        <MenuItem key={s.id || s.serviceId} value={s.id || s.serviceId}>
                          {s.name || s.description || s.serviceName || s.id}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{servicesLoading ? 'Cargando servicios...' : 'Servicio del paquete'}</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3} md={3}>
                  <FormControl fullWidth required sx={fieldSx} disabled={packagesLoading}>
                    <InputLabel>Paquete</InputLabel>
                    <Select value={form.packageId} label="Paquete" onChange={handleFormChange('packageId')}>
                      <MenuItem value="">
                        <em>Selecciona un paquete</em>
                      </MenuItem>
                      {(packages || []).map((p) => (
                        <MenuItem key={p.id} value={p.id}>
                          {p.name || p.id}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{packagesLoading ? 'Cargando paquetes...' : 'Paquete asignado'}</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3} md={3}>
                  <FormControl
                    fullWidth
                    sx={fieldSx}
                    disabled={banksLoading || form.paymentMethod !== 'Bank Transfer'}
                    required={form.paymentMethod === 'Bank Transfer'}
                  >
                    <InputLabel>Banco</InputLabel>
                    <Select value={form.bankId} label="Banco" onChange={handleFormChange('bankId')}>
                      <MenuItem value="">
                        <em>Selecciona banco</em>
                      </MenuItem>
                      {(banks || []).map((b) => (
                        <MenuItem key={b.id || b.bankId} value={b.id || b.bankId}>
                          {b.bank || b.bank || b.id}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{banksLoading ? 'Cargando bancos...' : 'Banco usado en el pago'}</FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
            </SectionCard>

            <SectionCard title="Pago" helper="Fechas y montos pagados.">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4} md={4}>
                  <TextField
                    required
                    label="Fecha pago"
                    type="date"
                    value={form.paymentDate}
                    onChange={handleFormChange('paymentDate')}
                    fullWidth
                    sx={fieldSx}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EventAvailableIcon fontSize="small" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4} md={4}>
                  <TextField
                    label="Monto pagado"
                    type="number"
                    value={form.amountPaid}
                    onChange={handleFormChange('amountPaid')}
                    fullWidth
                    sx={fieldSx}
                    InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                  />
                </Grid>
                <Grid item xs={12} sm={4} md={4}>
                  <TextField
                    label="Descuento"
                    type="number"
                    value={form.amountDiscount}
                    onChange={handleFormChange('amountDiscount')}
                    fullWidth
                    sx={fieldSx}
                    InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                  />
                </Grid>
              </Grid>
            </SectionCard>

            <SectionCard title="Método y estado" helper="Forma de pago y estado del comprobante.">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4} md={4}>
                  <FormControl fullWidth required sx={fieldSx}>
                
                    <Select
                      value={form.paymentMethod}
                      onChange={handleFormChange('paymentMethod')}
                      displayEmpty
                      renderValue={(value) => (value ? value : 'Selecciona método')}
                    >
                      <MenuItem value="">
                        <em>Selecciona</em>
                      </MenuItem>
                      {PAYMENT_METHODS.map((m) => (
                        <MenuItem key={m} value={m}>
                          {m}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4} md={4}>
                  <FormControl fullWidth required sx={fieldSx}>
                    <InputLabel>Estado</InputLabel>
                    <Select value={form.status} label="Estado" onChange={handleFormChange('status')}>
                      {STATUS_OPTIONS.map((st) => (
                        <MenuItem key={st} value={st}>
                          {st}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4} md={4}>
                  <TextField
                    label="Notas"
                    value={form.notes}
                    onChange={handleFormChange('notes')}
                    fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EventRepeatIcon fontSize="small" />
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
            {sending ? 'Guardando...' : form.invoiceId ? 'Guardar cambios' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDelete.open}
        onClose={() => setOpenDelete({ open: false, row: null })}
        maxWidth="xs"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>Eliminar factura</DialogTitle>
        <DialogContent dividers>
          <Typography>
            ¿Eliminar la factura <strong>{openDelete.row?.invoiceId ?? ''}</strong>? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete({ open: false, row: null })} disabled={sending}>
            Cancelar
          </Button>
          <Button color="error" variant="contained" onClick={confirmDelete} disabled={sending}>
            {sending ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
