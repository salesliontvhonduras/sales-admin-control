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
import Avatar from '@mui/material/Avatar';
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
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import { useTheme, useMediaQuery } from '@mui/material';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PriceChangeIcon from '@mui/icons-material/PriceChange';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { lionTvApi } from 'utils/api';

const statusColors = {
  ACTIVE: 'success',
  INACTIVE: 'default',
  EXPIRED: 'error',
  CANCELLED: 'error'
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

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
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

function normalizeSubscription(item = {}) {
  return {
    subscriptionId: item.subscriptionId ?? item.id ?? null,
    customerId: item.customerId ?? null,
    lineId: item.lineId ?? '',
    billing: item.billing ?? '',
    amount: item.amount ?? item.totalAmount ?? 0,
    discount: item.discount ?? 0,
    status: (item.status ?? '').toUpperCase(),
    startDate: item.startDate ?? null,
    renewalDate: item.renewalDate ?? null,
    packageId: item.packageId ?? null,
    automaticPay: Boolean(item.automaticPay),
    linkAutomatic: item.linkAutomatic ?? '',
    username: item.username ?? '',
    customer_name: item.customer_name ?? '',
    username_line: item.username_line ?? '',
  };
}

function formatDateInput(value) {
  if (!value) return '';
  const dateObj = new Date(value);
  if (!Number.isNaN(dateObj.getTime())) {
    return dateObj.toISOString().slice(0, 10);
  }
  if (typeof value === 'string' && value.length >= 10) {
    return value.slice(0, 10);
  }
  return '';
}

const defaultForm = {
  subscriptionId: null,
  customerId: '',
  lineId: '',
  billing: '',
  amount: '',
  discount: '',
  status: 'ACTIVE',
  startDate: '',
  renewalDate: '',
  packageId: '',
  automaticPay: false,
  linkAutomatic: ''
};

export default function SubscriptionsLionTv() {
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
  const [statusFilter, setStatusFilter] = useState('');

  const [openModal, setOpenModal] = useState(false);
  const [openDelete, setOpenDelete] = useState({ open: false, row: null });
  const [form, setForm] = useState(defaultForm);
  const [sending, setSending] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [customersLoading, setCustomersLoading] = useState(false);
  const [packages, setPackages] = useState([]);
  const [packagesLoading, setPackagesLoading] = useState(false);
  const [lines, setLines] = useState([]);
  const [linesLoading, setLinesLoading] = useState(false);

  const customerNameMap = useMemo(() => {
    const map = {};
    customers.forEach((c) => {
      const id = c.customerId ?? c.id;
      if (!id) return;
      map[id] = c.customerFullname ?? c.fullName ?? c.username ?? c.customerMail ?? '';
    });
    return map;
  }, [customers]);

  const handleUnauthorized = (err) => {
    const status = err?.response?.status || err?.request?.status;
    return status === 401;
  };

  const loadPackages = useCallback(async () => {
    setPackagesLoading(true);
    try {
      const response = await lionTvApi.get('/packages/v1/list-packages', {
        params: { index: 0, size: 100, start: 0, filters: '', sorting: '' }
      });
      const list = response?.data?.data?.data || [];
      // Omitir los que empiezan con "DEMO"
      const filtered = (Array.isArray(list) ? list : []).filter(
        (pkg) => !String(pkg?.name || '').trim().toUpperCase().startsWith('DEMO')
      );
      setPackages(filtered);
    } catch (err) {
      enqueueSnackbar('No se pudieron cargar los paquetes.', { variant: 'warning' });
    } finally {
      setPackagesLoading(false);
    }
  }, [enqueueSnackbar]);

  const loadLines = useCallback(async () => {
    if (!accessToken) return;
    setLinesLoading(true);
    try {
      const res = await lionTvApi.get('/lines/v1/list-lines', {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { index: 0, size: 200 },
        skipAuthRedirect: true
      });
      const payload = res?.data?.data ?? res?.data ?? {};
      const raw = payload.data ?? payload.items ?? payload.content ?? payload ?? [];
      const list = Array.isArray(raw) ? raw : [];
      const sorted = list.sort((a, b) => {
        const aName = (a.username || a.user_name || '').toString().toLowerCase();
        const bName = (b.username || b.user_name || '').toString().toLowerCase();
        return aName.localeCompare(bName);
      });
      setLines(sorted);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar('No se pudieron cargar las líneas.', { variant: 'warning' });
      }
    } finally {
      setLinesLoading(false);
    }
  }, [accessToken, enqueueSnackbar]);

  const loadCustomers = useCallback(async () => {
    if (!accessToken) return;
    setCustomersLoading(true);
    try {
      const res = await lionTvApi.get('/customers/v1', {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { index: 0, size: 5000 },
        skipAuthRedirect: true
      });
      const payload = res?.data?.data ?? res?.data ?? {};
      const raw = payload.data ?? payload.items ?? payload.content ?? payload ?? [];
      const list = Array.isArray(raw) ? raw : [];
      setCustomers(list);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar('No se pudieron cargar los clientes.', { variant: 'warning' });
      }
    } finally {
      setCustomersLoading(false);
    }
  }, [accessToken, enqueueSnackbar]);

  const loadSubscriptions = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const res = await lionTvApi.get('/subscriptions/v1', {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { index: 0, size: 5000 },
        skipAuthRedirect: true
      });
      const payload = res?.data?.data ?? res?.data ?? {};
      const raw = payload.data ?? payload.items ?? payload.content ?? payload ?? [];
      const items = Array.isArray(raw) ? raw : [];
      const normalized = items.map(normalizeSubscription);
      setRows(normalized);
      setTotal(normalized.length);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || err.message || 'No se pudieron cargar las suscripciones.', {
          variant: 'error'
        });
      }
    } finally {
      setLoading(false);
    }
  }, [accessToken, enqueueSnackbar]);

  useEffect(() => {
    loadSubscriptions();
    loadCustomers();
    loadPackages();
    loadLines();
  }, [loadSubscriptions, loadCustomers, loadPackages, loadLines, refreshKey]);

  useEffect(() => {
    if (!customerNameMap || Object.keys(customerNameMap).length === 0) return;
    setRows((prev) =>
      prev.map((row) => ({
        ...row,
        customerName: row.customerName || customerNameMap[row.customerId] || row.customer_name || ''
      }))
    );
  }, [customerNameMap]);

  const filteredRows = useMemo(() => {
    if (!search && !statusFilter) return rows;
    const term = search.toLowerCase();
    return rows.filter((row) => {
      if (statusFilter && (row.status || '').toLowerCase() !== statusFilter.toLowerCase()) return false;
      return (
        String(row.customerId || '').toLowerCase().includes(term) ||
        (row.customerName || row.customer_name || '').toLowerCase().includes(term) ||
        (row.lineId || '').toLowerCase().includes(term) ||
        (row.billing || '').toLowerCase().includes(term) ||
        (row.status || '').toLowerCase().includes(term) ||
        String(row.packageId || '').toLowerCase().includes(term)
      );
    });
  }, [rows, search, statusFilter]);

  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredRows.slice(start, start + rowsPerPage);
  }, [filteredRows, page, rowsPerPage]);

  useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(filteredRows.length / rowsPerPage) - 1);
    if (page > maxPage) {
      setPage(0);
    }
  }, [filteredRows.length, page, rowsPerPage]);

  const resetForm = () => setForm(defaultForm);

  const handleFormChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleLineChange = (event) => {
    const value = event.target.value;
    const found = lines.find((l) => (l.id ?? l.lineId) === value);
    setForm((prev) => ({
      ...prev,
      lineId: value,
      startDate: found ? formatDateInput(found.created_at || found.createdAt) || prev.startDate : prev.startDate,
      renewalDate: found ? formatDateInput(found.exp_date || found.expDate) || prev.renewalDate : prev.renewalDate,
      packageId: found?.package_id ?? found?.packageId ?? prev.packageId
    }));
  };

  const handleEdit = (row) => {
    setForm({
      subscriptionId: row.subscriptionId,
      customerId: row.customerId ?? '',
      lineId: row.lineId ?? '',
      billing: row.billing ?? '',
      amount: row.amount ?? '',
      discount: row.discount ?? '',
      status: row.status || 'ACTIVE',
      startDate: row.startDate || '',
      renewalDate: row.renewalDate || '',
      packageId: row.packageId ?? '',
      automaticPay: Boolean(row.automaticPay),
      linkAutomatic: row.linkAutomatic ?? ''
    });
    setOpenModal(true);
  };

  const handleDelete = (row) => {
    setOpenDelete({ open: true, row });
  };

  const handleSave = async () => {
    if (!form.customerId || !form.lineId || !form.packageId || !form.status || !form.startDate) {
      enqueueSnackbar('Completa los campos requeridos.', { variant: 'warning' });
      return;
    }

    const payload = {
      customerId: Number(form.customerId),
      lineId: form.lineId,
      billing: form.billing,
      amount: form.amount ? Number(form.amount) : 0,
      discount: form.discount ? Number(form.discount) : 0,
      status: form.status,
      startDate: form.startDate || null,
      renewalDate: form.renewalDate || null,
      packageId: form.packageId ? Number(form.packageId) : null,
      automaticPay: Boolean(form.automaticPay),
      linkAutomatic: form.linkAutomatic
    };

    setSending(true);
    try {
      if (form.subscriptionId) {
        await lionTvApi.put(`/subscriptions/v1/${form.subscriptionId}`, payload, {
          headers: { Authorization: `Bearer ${accessToken}` },
          skipAuthRedirect: true
        });
        enqueueSnackbar('Suscripción actualizada.', { variant: 'success' });
      } else {
        await lionTvApi.post('/subscriptions/v1', payload, {
          headers: { Authorization: `Bearer ${accessToken}` },
          skipAuthRedirect: true
        });
        enqueueSnackbar('Suscripción creada.', { variant: 'success' });
      }
      setOpenModal(false);
      resetForm();
      setRefreshKey((v) => v + 1);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || err.message || 'No se pudo guardar la suscripción.', {
          variant: 'error'
        });
      }
    } finally {
      setSending(false);
    }
  };

  const confirmDelete = async () => {
    const row = openDelete.row;
    if (!row?.subscriptionId) {
      setOpenDelete({ open: false, row: null });
      return;
    }
    setSending(true);
    try {
      await lionTvApi.delete(`/subscriptions/v1/${row.subscriptionId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        skipAuthRedirect: true
      });
      enqueueSnackbar('Suscripción eliminada.', { variant: 'success' });
      setOpenDelete({ open: false, row: null });
      setRefreshKey((v) => v + 1);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || err.message || 'No se pudo eliminar la suscripción.', {
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
        title="Suscripciones"
        secondary={
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => setRefreshKey((v) => v + 1)}>
              Recargar
            </Button>
            <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={() => setOpenModal(true)}>
              Nueva
            </Button>
          </Stack>
        }
      >
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} sm={4}>
            <Chip label={`${total} suscripciones`} color="primary" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Chip label={`Activas: ${rows.filter((r) => r.status === 'ACTIVE').length}`} color="success" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Chip label={`Automático: ${rows.filter((r) => r.automaticPay).length}`} color="secondary" />
          </Grid>
        </Grid>
      </MainCard>

      <MainCard
        title="Listado de suscripciones"
        secondary={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: { xs: '100%', sm: 480 } }}>
            <TextField
              size="small"
              placeholder="Buscar (cliente, línea, paquete, estado)"
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
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Status</InputLabel>
              <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
                <MenuItem value="">
                  <em>Todos</em>
                </MenuItem>
                {[...new Set(rows.map((r) => r.status).filter(Boolean))].map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        }
      >
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Línea</TableCell>
                <TableCell>Package</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Monto</TableCell>
                <TableCell>Inicio</TableCell>
                <TableCell>Renovación</TableCell>
                <TableCell>Auto pay</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.map((row) => (
                <TableRow key={row.subscriptionId || row.lineId}>
                  <TableCell>{row.subscriptionId}</TableCell>
                  <TableCell>{row.customerName || row.customer_name}</TableCell>
                  <TableCell>{row.username_line}</TableCell>
                  <TableCell>{row.packageId}</TableCell>
                  <TableCell>
                    <StatusChip status={row.status} />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <PriceChangeIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        {Number(row.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{row.startDate}</TableCell>
                  <TableCell>{row.renewalDate}</TableCell>
                  <TableCell>{row.automaticPay ? 'Sí' : 'No'}</TableCell>
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
                  <TableCell colSpan={10} align="center">
                    No hay suscripciones registradas.
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
          count={filteredRows.length}
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
                bgcolor: form.subscriptionId ? 'warning.main' : 'primary.main',
                color: 'primary.contrastText',
                width: 36,
                height: 36,
                boxShadow: 3
              }}
            >
              <CreditCardIcon fontSize="small" />
            </Avatar>
            <Box>
              <Typography variant="h6">
                {form.subscriptionId ? 'Editar suscripción' : 'Nueva suscripción'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Completa los datos del cliente, paquete y facturación.
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
            <SectionCard title="Datos principales" helper="Cliente, paquete y estado.">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4} md={4}>
                  <FormControl fullWidth required sx={fieldSx} disabled={customersLoading}>
                    <InputLabel>Cliente</InputLabel>
                    <Select
                      value={form.customerId}
                      label="Cliente"
                      onChange={handleFormChange('customerId')}
                    >
                      <MenuItem value="">
                        <em>Selecciona un cliente</em>
                      </MenuItem>
                      {customers.length === 0 ? (
                        <MenuItem value="" disabled>
                          No hay clientes disponibles
                        </MenuItem>
                      ) : (
                        customers.map((c) => (
                          <MenuItem key={c.customerId || c.id} value={c.customerId || c.id}>
                            {c.customerFullname || c.fullName || c.username || c.customerMail}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                    <FormHelperText>
                      {customersLoading ? 'Cargando clientes...' : 'Elige el cliente de la suscripción.'}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4} md={4}>
                  <FormControl fullWidth required sx={fieldSx} disabled={packagesLoading}>
                    <InputLabel>Package</InputLabel>
                    <Select
                      value={form.packageId}
                      label="Package"
                      onChange={handleFormChange('packageId')}
                    >
                      <MenuItem value="">
                        <em>Selecciona un paquete</em>
                      </MenuItem>
                      {packages.length === 0 ? (
                        <MenuItem value="" disabled>
                          No hay paquetes disponibles
                        </MenuItem>
                      ) : (
                        packages.map((p) => (
                          <MenuItem key={p.id} value={p.id}>
                            {p.name} ({p.id})
                          </MenuItem>
                        ))
                      )}
                    </Select>
                    <FormHelperText>
                      {packagesLoading ? 'Cargando paquetes...' : 'Paquetes (excluye los DEMO)'}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4} md={4}>
                  <FormControl fullWidth required sx={fieldSx}>
                    <InputLabel>Estado</InputLabel>
                    <Select value={form.status} label="Estado" onChange={handleFormChange('status')}>
                      <MenuItem value="ACTIVE">Activo</MenuItem>
                      <MenuItem value="INACTIVE">Inactivo</MenuItem>
                      <MenuItem value="CANCELLED">Cancelado</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </SectionCard>

            <SectionCard title="Facturación" helper="Detalle de línea, billing y montos.">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4} md={4}>
                  <FormControl fullWidth required sx={fieldSx} disabled={linesLoading}>
                    <InputLabel>Línea</InputLabel>
                    <Select value={form.lineId} label="Línea" onChange={handleLineChange}>
                      <MenuItem value="">
                        <em>Selecciona una línea</em>
                      </MenuItem>
                      {lines.length === 0 ? (
                        <MenuItem value="" disabled>
                          No hay líneas disponibles
                        </MenuItem>
                      ) : (
                        lines.map((l) => (
                          <MenuItem key={l.id} value={l.id}>
                            {l.username || l.user_name || l.id}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                    <FormHelperText>
                      {linesLoading ? 'Cargando líneas...' : 'Se muestra la descripción con el username'}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4} md={4}>
                  <FormControl fullWidth sx={fieldSx}>
                    <InputLabel>Billing</InputLabel>
                    <Select value={form.billing} label="Billing" onChange={handleFormChange('billing')}>
                      <MenuItem value="">
                        <em>Selecciona</em>
                      </MenuItem>
                      <MenuItem value="Monthly">Monthly</MenuItem>
                      <MenuItem value="Quarterly">Quarterly</MenuItem>
                      <MenuItem value="Biannual">Biannual</MenuItem>
                      <MenuItem value="Annual">Annual</MenuItem>
                    </Select>
                    <FormHelperText>Frecuencia de facturación</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={2} md={2}>
                  <TextField
                    label="Monto"
                    type="number"
                    value={form.amount}
                    onChange={handleFormChange('amount')}
                    fullWidth
                    sx={fieldSx}
                    InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                  />
                </Grid>
                <Grid item xs={12} sm={2} md={2}>
                  <TextField
                    label="Descuento"
                    type="number"
                    value={form.discount}
                    onChange={handleFormChange('discount')}
                    fullWidth
                    sx={fieldSx}
                    InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                  />
                </Grid>
              </Grid>
            </SectionCard>

            <SectionCard title="Fechas" helper="Inicio y renovación de la suscripción.">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={6}>
                  <TextField
                    required
                    label="Inicio"
                    type="date"
                    value={form.startDate}
                    onChange={handleFormChange('startDate')}
                    fullWidth
                    sx={fieldSx}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarMonthIcon fontSize="small" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <TextField
                    label="Renovación"
                    type="date"
                    value={form.renewalDate}
                    onChange={handleFormChange('renewalDate')}
                    fullWidth
                    sx={fieldSx}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarMonthIcon fontSize="small" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
              </Grid>
            </SectionCard>

            <SectionCard title="Automatización" helper="Pagos automáticos y enlace de activación.">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={3} md={3} display="flex" alignItems="center">
                  <FormControlLabel
                    control={<Switch checked={form.automaticPay} onChange={handleFormChange('automaticPay')} />}
                    label="Pago automático"
                  />
                </Grid>
                <Grid item xs={12} sm={9} md={9}>
                  <TextField
                    label="Link de pago automático"
                    value={form.linkAutomatic}
                    onChange={handleFormChange('linkAutomatic')}
                    fullWidth
                    sx={fieldSx}
                    placeholder="https://..."
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
            {sending ? 'Guardando...' : form.subscriptionId ? 'Guardar cambios' : 'Crear'}
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
        <DialogTitle>Eliminar suscripción</DialogTitle>
        <DialogContent dividers>
          <Typography>
            ¿Eliminar la suscripción <strong>{openDelete.row?.subscriptionId ?? ''}</strong>? Esta acción no se puede
            deshacer.
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
