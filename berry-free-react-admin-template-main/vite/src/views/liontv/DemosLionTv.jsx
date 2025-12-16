import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import useAuth from 'hooks/useAuth';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import CircularProgress from '@mui/material/CircularProgress';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloseIcon from '@mui/icons-material/Close';
import NoteAltOutlinedIcon from '@mui/icons-material/NoteAltOutlined';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';

import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { catalogsApi, lionTvApi } from 'utils/api';

const statusColors = {
  ACTIVE: 'success',
  EXPIRED: 'warning',
  CANCELLED: 'error'
};

const defaultForm = {
  cellphone: '50494350587',
  packageId: '',
  deviceName: 'Patu|Honduras|Alejandro Rosales',
  playlistName: 'Alejandro',
  countryCode: '504',
  macAddress: '2b:10:79:3c:d3:e2',
  appCode: '1',
  note: 'nada'
};

const APP_CODE_STATIC = [
  { value: '1', label: '1 - Vivo Player' },
  { value: '2', label: '2 - Smart One IPTV' }
];

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  return isNaN(date.getTime()) ? value : date.toLocaleString();
}

function StatusChip({ status }) {
  const color = statusColors[status] || 'default';
  return <Chip size="small" color={color} label={status || '-'} />;
}

function SectionCard({ title, children }) {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Typography variant="subtitle1" gutterBottom>
        {title}
      </Typography>
      {children}
    </Box>
  );
}

function normalizeDemo(item = {}) {
  return {
    id: item.id ?? item.demoId ?? item.demo_id ?? null,
    sagaId: item.sagaId ?? item.saga_id ?? '',
    username: item.username ?? '',
    cellphone: item.cellphone ?? item.phone ?? '',
    countryCode: item.countryCode ?? item.country_code ?? '',
    deviceId: item.deviceId ?? item.device_id ?? '',
    playlistId: item.playlistId ?? item.playlist_id ?? '',
    packageId: item.packageId ?? item.package_id ?? '',
    note: item.note ?? '',
    appCode: item.appCode ?? item.app_code ?? '',
    status: (item.status ?? '').toUpperCase(),
    createdAt: item.createdAt ?? item.created_at ?? null,
    expiresAt: item.expiresAt ?? item.expires_at ?? null
  };
}

export default function DemosLionTv() {
  const { enqueueSnackbar } = useSnackbar();
  const { accessToken } = useAuth();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  const [openModal, setOpenModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState(defaultForm);

  const [packages, setPackages] = useState([]);
  const [packagesLoading, setPackagesLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const [countriesLoading, setCountriesLoading] = useState(false);
  const [appCodes, setAppCodes] = useState(APP_CODE_STATIC);
  const [appCodesLoading, setAppCodesLoading] = useState(false);

  const defaultPackageId = useMemo(() => (packages.length ? String(packages[0].id) : ''), [packages]);
  const defaultCountryCode = useMemo(() => (countries.length ? String(countries[0].code) : ''), [countries]);

  const handleUnauthorized = (err) => {
    const status = err?.response?.status || err?.request?.status;
    return status === 401;
  };

  const loadPackages = useCallback(async () => {
  setPackagesLoading(true);

  try {
    const response = await lionTvApi.get('/packages/v1/list-packages', {
      params: {
        index: 0,
        size: 50,
        start: 0,
        filters: '',
        sorting: ''
      }
    });

    // Response: { success: true, data: { rowCount, rowTotal, data: [...] } }
    const list = response?.data?.data?.data || [];

    // Filtra SOLO los que empiezan con "DEMO" (case-insensitive)
    const filtered = (Array.isArray(list) ? list : []).filter((pkg) =>
      String(pkg?.name || '')
        .trim()
        .toUpperCase()
        .startsWith('DEMO')
    );

    // Lo que usa tu Select: { id, name }
    setPackages(filtered.map((pkg) => ({ id: pkg.id, name: pkg.name })));
  } catch (err) {
    enqueueSnackbar(
      err?.response?.data?.message || err?.message || 'No se pudieron cargar los paquetes.',
      { variant: 'error' }
    );
  } finally {
    setPackagesLoading(false);
  }
}, [enqueueSnackbar]);

 const loadCountries = useCallback(async () => {
  setCountriesLoading(true);

  try {
    const response = await catalogsApi.get('/countries/v1/list-all');

    // response = { success: true, data: [...] }
    const list = response?.data?.data || [];

    const normalized = list.map((item) => ({
      code: String(item.phoneCode),
      name: item.country,
      continent: item.continent
    }));

    setCountries(normalized);
  } catch (err) {
    enqueueSnackbar(
      err?.response?.data?.message || err?.message || 'No se pudieron cargar los países.',
      { variant: 'error' }
    );
  } finally {
    setCountriesLoading(false);
  }
}, [enqueueSnackbar]);

  const loadAppCodes = useCallback(async () => {
    setAppCodesLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 300));
      setAppCodes(APP_CODE_STATIC);
    } finally {
      setAppCodesLoading(false);
    }
  }, []);

//   const loadDemos = useCallback(async () => {
//     if (!accessToken) return;
//     setLoading(true);

//     try {
//       const response = await eventBusApi.get('/saga/v1/demos', {
//         headers: { Authorization: `Bearer ${accessToken}` },
//         params: { page, size: rowsPerPage },
//         skipAuthRedirect: true
//       });

//       const payload = response?.data?.data ?? response?.data;
//       const items = payload.data ?? payload.content ?? payload.items ?? payload ?? [];

//       const normalized = items.map(normalizeDemo);

//       setRows(normalized);
//       setTotal(payload.total ?? payload.totalElements ?? normalized.length);
//     } catch (err) {
//       if (!handleUnauthorized(err)) {
//         enqueueSnackbar(err?.response?.data?.message || err.message, { variant: 'error' });
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, [accessToken, page, rowsPerPage]);

  useEffect(() => {
    loadPackages();
    loadCountries();
    loadAppCodes();
  }, []);

  useEffect(() => {
   // loadDemos();
  }, [page, rowsPerPage, refreshKey]);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      packageId: prev.packageId || defaultPackageId,
      countryCode: prev.countryCode || defaultCountryCode
    }));
  }, [defaultPackageId, defaultCountryCode]);

  const handleFormChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleAppCodeChange = (event) => {
    setForm((prev) => ({ ...prev, appCode: event.target.value }));
  };

  const resetForm = () => {
    setForm({
      ...defaultForm,
      packageId: defaultPackageId,
      countryCode: defaultCountryCode
    });
  };

  const handleCreateDemo = async () => {
    if (!form.cellphone || !form.packageId || !form.deviceName || !form.playlistName || !form.countryCode || !form.macAddress) {
      enqueueSnackbar('Completa los campos requeridos.', { variant: 'warning' });
      return;
    }

    const payload = {
      cellphone: form.cellphone,
      packageId: String(form.packageId),
      deviceName: form.deviceName,
      playlistName: form.playlistName,
      countryCode: form.countryCode,
      macAddress: form.macAddress,
      appCode: form.appCode,
      note: form.note
    };

    setSending(true);

    try {
      await eventBusApi.post('/saga/v1/create-demo', payload, {
        headers: { Authorization: `Bearer ${accessToken}` },
        skipAuthRedirect: true
      });

      enqueueSnackbar('Demo creada correctamente.', { variant: 'success' });
      setOpenModal(false);
      resetForm();
      setRefreshKey((x) => x + 1);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || err.message, { variant: 'error' });
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 1400, mx: 'auto' }}>
      {/* -------------------- HEADER ---------------------- */}
      <MainCard
        title="Demos Lion Tv"
        secondary={
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => setRefreshKey((v) => v + 1)}>
              Recargar
            </Button>
            <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={() => setOpenModal(true)}>
              Crear Demo
            </Button>
          </Stack>
        }
      >
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} sm={6} md={3}>
            <Chip label={`${total} demos`} color="primary" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Chip label={`Paquetes demo: ${packages.length}`} color="success" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Chip label={`Países: ${countries.length}`} color="secondary" />
          </Grid>
        </Grid>
      </MainCard>

      {/* -------------------- TABLE ---------------------- */}
      <MainCard title="Listado de demos">
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Celular</TableCell>
                <TableCell>Cod. País</TableCell>
                <TableCell>Package ID</TableCell>
                <TableCell>App</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Creado</TableCell>
                <TableCell>Expira</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id || row.cellphone}>
                  <TableCell>{row.cellphone}</TableCell>
                  <TableCell>{row.countryCode}</TableCell>
                  <TableCell>{row.packageId}</TableCell>
                  <TableCell>{row.appCode}</TableCell>
                  <TableCell><StatusChip status={row.status} /></TableCell>
                  <TableCell>{formatDate(row.createdAt)}</TableCell>
                  <TableCell>{formatDate(row.expiresAt)}</TableCell>
                </TableRow>
              ))}
              {!loading && rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">No hay demos registradas.</TableCell>
                </TableRow>
              )}
              {loading && (
                <TableRow>
                  <TableCell colSpan={7} align="center">Cargando...</TableCell>
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
          onPageChange={(e, p) => setPage(p)}
          onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value))}
        />
      </MainCard>

      {/* -------------------- MODAL ---------------------- */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="md">
        <DialogTitle>
          Crear Demo
          <IconButton onClick={() => setOpenModal(false)}><CloseIcon /></IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Stack spacing={3}>
            {/* DATOS DEL CLIENTE */}
            <SectionCard title="Datos del cliente">
              <Stack spacing={2}>
                <TextField
                  required
                  label="Celular"
                  value={form.cellphone}
                  onChange={handleFormChange('cellphone')}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><PhoneIphoneIcon /></InputAdornment>
                  }}
                />

                <FormControl fullWidth required>
                  <InputLabel>País</InputLabel>
                  <Select value={form.countryCode} onChange={handleFormChange('countryCode')} disabled={countriesLoading}>
                    {countries.map((c) => (
                      <MenuItem key={c.code} value={c.code}>{c.name} (+{c.code})</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            </SectionCard>

            {/* DISPOSITIVO */}
            <SectionCard title="Dispositivo y playlist">
              <Stack spacing={2}>
                <TextField label="Nombre del dispositivo" required value={form.deviceName} onChange={handleFormChange('deviceName')} />
                <TextField label="MAC Address" required value={form.macAddress} onChange={handleFormChange('macAddress')} />
                <TextField label="Playlist" required value={form.playlistName} onChange={handleFormChange('playlistName')} />

                <FormControl fullWidth required>
                  <InputLabel>Package ID</InputLabel>
                  <Select value={form.packageId} onChange={handleFormChange('packageId')} disabled={packagesLoading}>
                    {packages.map((p) => (
                      <MenuItem key={p.id} value={p.id}>{p.name} ({p.id})</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            </SectionCard>

            {/* METADATOS */}
            <SectionCard title="Metadatos">
              <Stack spacing={2}>
                {/* SELECT APLICACIÓN */}
                <FormControl fullWidth required>
                  <InputLabel>Aplicación</InputLabel>
                  <Select
                    value={form.appCode}
                    onChange={handleAppCodeChange}
                    disabled={appCodesLoading}
                  >
                    {appCodes.map((a) => (
                      <MenuItem key={a.value} value={a.value}>{a.label}</MenuItem>
                    ))}
                  </Select>
                  {appCodesLoading && <FormHelperText><CircularProgress size={14} /> Cargando…</FormHelperText>}
                </FormControl>

                <TextField
                  label="Nota"
                  value={form.note}
                  onChange={handleFormChange('note')}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><NoteAltOutlinedIcon /></InputAdornment>
                  }}
                />
              </Stack>
            </SectionCard>
          </Stack>
        </DialogContent>

        {/* BOTONES */}
        <DialogActions>
          <Button variant="outlined" onClick={resetForm}>Limpiar</Button>
          <Button variant="contained" onClick={handleCreateDemo} disabled={sending}>
            {sending ? 'Creando...' : 'Crear Demo'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
