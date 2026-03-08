import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import useAuth from 'hooks/useAuth';
import { useTranslation } from 'react-i18next';

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
import SearchIcon from '@mui/icons-material/Search';
import CircularProgress from '@mui/material/CircularProgress';
import Avatar from '@mui/material/Avatar';
import { useTheme, useMediaQuery } from '@mui/material';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloseIcon from '@mui/icons-material/Close';
import NoteAltOutlinedIcon from '@mui/icons-material/NoteAltOutlined';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import DevicesOtherOutlinedIcon from '@mui/icons-material/DevicesOtherOutlined';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';

import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { catalogsApi, sagaApi, lionTvApi, shopifyDemosApi } from 'utils/api';

const statusColors = {
  ACTIVE: 'success',
  EXPIRED: 'warning',
  CANCELLED: 'error',
  PENDING: 'info'
};

const defaultForm = {
  cellphone: '',
  email: '',
  name: '',
  packageId: '',
  deviceName: '',
  playlistName: '',
  countryCode: '504',
  macAddress: '',
  appCode: '1',
  note: '',
  otp: ''
};

const APP_CODE_STATIC = [
  { value: 'VIVO_PLAYER', label: 'Vivo Player' },
  { value: 'SMART_ONE', label: 'Smart One IPTV' },
  { value: 'IBO_PRO', label: 'IboPro Player' }
];

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
  return isNaN(date.getTime()) ? value : date.toLocaleString();
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useTranslation();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [search, setSearch] = useState('');

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
        params: { index: 0, size: 50, start: 0, filters: '', sorting: '' }
      });
      const list = response?.data?.data?.data || [];
      const filtered = (Array.isArray(list) ? list : []).filter((pkg) =>
        String(pkg?.name || '').trim().toUpperCase().startsWith('DEMO')
      );
      setPackages(filtered.map((pkg) => ({ id: pkg.id, name: pkg.name })));
    } catch (err) {
      enqueueSnackbar(err?.response?.data?.message || err?.message || 'No se pudieron cargar los paquetes.', { variant: 'error' });
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

  const loadDemos = useCallback(async () => {
    setLoading(true);
    try {
      const response = await shopifyDemosApi.get('/demos', { params: {} });
      const list = response?.data ?? [];
      const normalized = (Array.isArray(list) ? list : []).map((item) => ({
        ...item,
        status: (item.status || '').toUpperCase()
      }));
      setRows(normalized);
      setTotal(normalized.length);
    } catch (err) {
      enqueueSnackbar(err?.response?.data?.message || err.message || 'No se pudieron cargar las demos.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  const filteredRows = useMemo(() => {
    if (!search) return rows;
    const term = search.toLowerCase();
    return rows.filter((row) => {
      return (
        (row.cellphone || '').toLowerCase().includes(term) ||
        (row.customerName || '').toLowerCase().includes(term) ||
        (row.macAddress || '').toLowerCase().includes(term) ||
        (row.status || '').toLowerCase().includes(term) ||
        (row.appCode || '').toLowerCase().includes(term)
      );
    });
  }, [rows, search]);

  useEffect(() => {
    loadPackages();
    loadCountries();
    loadAppCodes();
  }, []);

  useEffect(() => {
    loadDemos();
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

  const sendOtp = async () => {
    if (!form.cellphone || !form.macAddress || !form.name || !form.email) {
      enqueueSnackbar('Completa celular, MAC, nombre y correo para enviar OTP.', { variant: 'warning' });
      return;
    }
    setSending(true);
    try {
      const params = new URLSearchParams();
      params.append('phone', form.cellphone);
      params.append('mac', form.macAddress);
      params.append('name', form.name);
      params.append('email', form.email);
      await shopifyDemosApi.post('/proxy/lion-demo/send-otp', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      enqueueSnackbar('OTP enviado. Revisa tu correo.', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar(err?.response?.data?.message || err.message || 'No se pudo enviar el OTP.', { variant: 'error' });
    } finally {
      setSending(false);
    }
  };

  const handleCreateDemo = async () => {
    if (!form.cellphone || !form.macAddress || !form.name || !form.email || !form.otp) {
      enqueueSnackbar('Completa celular, MAC, nombre, correo y OTP.', { variant: 'warning' });
      return;
    }

    const params = new URLSearchParams();
    params.append('phone', form.cellphone);
    params.append('mac', form.macAddress);
    params.append('name', form.name);
    params.append('email', form.email);
    params.append('otp', form.otp);
    params.append('shop', 'SHOPIFY');

    setSending(true);

    try {
      await shopifyDemosApi.post('/proxy/lion-demo/submit', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      enqueueSnackbar('Demo creada correctamente.', { variant: 'success' });
      setOpenModal(false);
      resetForm();
      setRefreshKey((x) => x + 1);
    } catch (err) {
      enqueueSnackbar(err?.response?.data?.message || err.message || 'No se pudo crear la demo.', { variant: 'error' });
    } finally {
      setSending(false);
    }
  };

  const handleMacChange = (event) => {
    const raw = (event.target.value || '').replace(/[^a-fA-F0-9]/g, '').slice(0, 12);
    const formatted = raw.match(/.{1,2}/g)?.join(':') ?? raw;
    setForm((prev) => ({ ...prev, macAddress: formatted.toLowerCase() }));
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 1400, mx: 'auto' }}>
      {/* -------------------- HEADER ---------------------- */}
      <MainCard
        title={t('demos.title')}
        secondary={
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => setRefreshKey((v) => v + 1)}>
              {t('actions.refresh')}
            </Button>
            <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={() => setOpenModal(true)}>
              {t('demos.new')}
            </Button>
          </Stack>
        }
      >
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} sm={6} md={3}>
            <Chip label={t('demos.summary.total', { count: total })} color="primary" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Chip label={t('demos.summary.packages', { count: packages.length })} color="success" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Chip label={t('demos.summary.countries', { count: countries.length })} color="secondary" />
          </Grid>
        </Grid>
      </MainCard>

      {/* -------------------- TABLE ---------------------- */}
      <MainCard
        title={t('demos.listTitle')}
        secondary={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: { xs: '100%', sm: 360 } }}>
            <TextField
              size="small"
              placeholder={t('demos.search')}
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
                <TableCell>{t('demos.headers.phone')}</TableCell>
                <TableCell>{t('demos.headers.country')}</TableCell>
                <TableCell>{t('demos.headers.package')}</TableCell>
                <TableCell>{t('demos.headers.app')}</TableCell>
                <TableCell>{t('demos.headers.status')}</TableCell>
                <TableCell>{t('demos.headers.created')}</TableCell>
                <TableCell>{t('demos.headers.expires')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows.map((row) => (
                <TableRow key={row.macAddress || row.cellphone}>
                  <TableCell>{row.cellphone}</TableCell>
                  <TableCell>{row.countryCode}</TableCell>
                  <TableCell>{row.macAddress}</TableCell>
                  <TableCell>{row.appCode}</TableCell>
                  <TableCell><StatusChip status={row.status} /></TableCell>
                  <TableCell>{formatDate(row.createdAt)}</TableCell>
                  <TableCell>{formatDate(row.expiresAt)}</TableCell>
                </TableRow>
              ))}
              {!loading && filteredRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">{t('demos.table.empty')}</TableCell>
                </TableRow>
              )}
              {loading && (
                <TableRow>
                  <TableCell colSpan={7} align="center">{t('demos.table.loading')}</TableCell>
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
      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="md" fullScreen={isMobile}>
        <DialogTitle sx={{ position: 'relative', pr: 5 }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Avatar
              sx={{
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                width: 36,
                height: 36,
                boxShadow: 3
              }}
            >
              <AddCircleOutlineIcon fontSize="small" />
            </Avatar>
            <Box>
              <Typography variant="h6">{t('demos.new')}</Typography>
              <Typography variant="caption" color="text.secondary">
                {t('demos.infoSubtitle')}
              </Typography>
            </Box>
          </Stack>
          <IconButton
            aria-label="Cerrar"
            onClick={() => setOpenModal(false)}
            size="small"
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            bgcolor: 'background.default',
            px: { xs: 1.5, sm: 3 },
            py: { xs: 1.5, sm: 2 }
          }}
        >
          <Box
            sx={{
              mb: 2,
              p: 2,
              borderRadius: 2,
              background: (theme) =>
                `linear-gradient(135deg, ${theme.palette.primary.light}1A, ${theme.palette.primary.main}12)`
            }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              {t('demos.infoTitle')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('demos.infoSubtitle')}
            </Typography>
          </Box>

          <Stack spacing={2}>
            <SectionCard title="Cliente y app" helper="Celular, país, correo y aplicación.">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    required
                    label="Celular"
                    value={form.cellphone}
                    onChange={handleFormChange('cellphone')}
                    fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIphoneIcon />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth required sx={fieldSx}>
                    <InputLabel>País</InputLabel>
                    <Select value={form.countryCode} onChange={handleFormChange('countryCode')} disabled={countriesLoading} label="País">
                      {countries.map((c) => (
                        <MenuItem key={c.code} value={c.code}>
                          {c.name} (+{c.code})
                        </MenuItem>
                      ))}
                    </Select>
                    {countriesLoading && <FormHelperText>Cargando países...</FormHelperText>}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
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
                          <PersonIcon />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    required
                    label="Correo"
                    value={form.email}
                    onChange={handleFormChange('email')}
                    fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PublicOutlinedIcon />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth required sx={fieldSx}>
                    <InputLabel>Aplicación</InputLabel>
                    <Select value={form.appCode} onChange={handleAppCodeChange} disabled={appCodesLoading} label="Aplicación">
                      {appCodes.map((a) => (
                        <MenuItem key={a.value} value={a.value}>
                          {a.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {appCodesLoading && (
                      <FormHelperText>
                        <CircularProgress size={14} sx={{ mr: 1 }} />
                        Cargando…
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="OTP"
                    value={form.otp}
                    onChange={handleFormChange('otp')}
                    fullWidth
                    sx={fieldSx}
                    placeholder="123456"
                  />
                </Grid>
              </Grid>
            </SectionCard>

            <SectionCard title="Dispositivo y playlist" helper="Datos del dispositivo y playlist a provisionar.">
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Nombre del dispositivo"
                    required
                    value={form.deviceName}
                    onChange={handleFormChange('deviceName')}
                    fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DevicesOtherOutlinedIcon />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="MAC Address"
                    required
                    value={form.macAddress}
                    onChange={handleMacChange}
                    placeholder="aa:bb:cc:dd:ee:ff"
                    fullWidth
                    sx={fieldSx}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Playlist"
                    required
                    value={form.playlistName}
                    onChange={handleFormChange('playlistName')}
                    fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <QueueMusicIcon />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
              </Grid>
            </SectionCard>

            <SectionCard title="Servicio" helper="Selecciona el paquete demo y agrega notas si aplica.">
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required sx={fieldSx}>
                    <InputLabel>Package ID</InputLabel>
                    <Select value={form.packageId} onChange={handleFormChange('packageId')} disabled={packagesLoading} label="Package ID">
                      {packages.map((p) => (
                        <MenuItem key={p.id} value={p.id}>
                          {p.name} ({p.id})
                        </MenuItem>
                      ))}
                    </Select>
                    {packagesLoading && <FormHelperText>Cargando paquetes…</FormHelperText>}
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Nota"
                    value={form.note}
                    onChange={handleFormChange('note')}
                    fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <NoteAltOutlinedIcon />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
              </Grid>
            </SectionCard>
          </Stack>
        </DialogContent>

        {/* BOTONES */}
        <DialogActions sx={{ gap: 1 }}>
          <Button variant="outlined" onClick={resetForm} disabled={sending}>
            Limpiar
          </Button>
          <Button variant="outlined" color="secondary" onClick={sendOtp} disabled={sending}>
            {sending ? 'Enviando OTP...' : 'Enviar OTP'}
          </Button>
          <Button variant="contained" onClick={handleCreateDemo} disabled={sending}>
            {sending ? 'Creando...' : 'Crear Demo'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
