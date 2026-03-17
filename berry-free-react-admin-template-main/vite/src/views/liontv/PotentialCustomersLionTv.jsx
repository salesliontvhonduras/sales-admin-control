import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import useAuth from 'hooks/useAuth';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Card from '@mui/material/Card';
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
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import { useTheme, useMediaQuery } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import PublicIcon from '@mui/icons-material/Public';
import CategoryIcon from '@mui/icons-material/Category';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import GroupIcon from '@mui/icons-material/Group';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ContactPhoneOutlinedIcon from '@mui/icons-material/ContactPhoneOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';

import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { lionTvApi } from 'utils/api';

const categoryOptions = [
  { value: 'GENERAL', label: 'General' },
  { value: 'IPTV', label: 'IPTV' },
  { value: 'SPORTS_BAR', label: 'Sports Bar' },
  { value: 'BAR_RESTAURANT', label: 'Bar / Restaurant' },
  { value: 'RESTAURANT', label: 'Restaurant' },
  { value: 'CAFE', label: 'Cafe' },
  { value: 'BARBERSHOP', label: 'Barbershop' },
  { value: 'BEAUTY_SALON', label: 'Beauty Salon' },
  { value: 'HOTEL', label: 'Hotel' },
  { value: 'MOTEL', label: 'Motel' },
  { value: 'HOSTEL', label: 'Hostel' },
  { value: 'GYM', label: 'Gym' },
  { value: 'CLINIC_WAITING_ROOM', label: 'Clinic Waiting Room' },
  { value: 'DENTAL_CLINIC', label: 'Dental Clinic' },
  { value: 'AUTO_WORKSHOP', label: 'Auto Workshop' },
  { value: 'CAR_DEALERSHIP', label: 'Car Dealership' },
  { value: 'SUPERMARKET', label: 'Supermarket' },
  { value: 'CONVENIENCE_STORE', label: 'Convenience Store' },
  { value: 'OFFICE', label: 'Office' },
  { value: 'CALL_CENTER', label: 'Call Center' },
  { value: 'EVENT_HALL', label: 'Event Hall' },
  { value: 'BILLIARD_CLUB', label: 'Billiard Club' },
  { value: 'NIGHTCLUB', label: 'Nightclub' },
  { value: 'SOCIAL_MEDIA', label: 'Social Media' },
  { value: 'REFERRAL', label: 'Referral' },
  { value: 'WEB', label: 'Web' },
  { value: 'OTHER', label: 'Other' }
];

const statusOptions = [
  { value: 'NEW', label: 'New' },
  { value: 'CONTACTED', label: 'Contacted' },
  { value: 'NEGOTIATION', label: 'Negotiation' },
  { value: 'CONVERTED', label: 'Converted' },
  { value: 'LOST', label: 'Lost' }
];

const EMAIL_FALLBACK = 'nomail@gmail.com';
const ISO_CODE_REGEX = /^[A-Z]{2}$/;
const fallbackIsoCountries = [
  { value: 'AR', label: 'Argentina' },
  { value: 'CA', label: 'Canada' },
  { value: 'CO', label: 'Colombia' },
  { value: 'CR', label: 'Costa Rica' },
  { value: 'ES', label: 'Spain' },
  { value: 'GT', label: 'Guatemala' },
  { value: 'HN', label: 'Honduras' },
  { value: 'MX', label: 'Mexico' },
  { value: 'NI', label: 'Nicaragua' },
  { value: 'PA', label: 'Panama' },
  { value: 'SV', label: 'El Salvador' },
  { value: 'US', label: 'United States' }
];

function buildIsoCountryOptions() {
  const hasIntlDisplayNames = typeof Intl !== 'undefined' && typeof Intl.DisplayNames === 'function';
  const locale = typeof navigator !== 'undefined' ? navigator.language || 'en' : 'en';

  if (!hasIntlDisplayNames) {
    return [...fallbackIsoCountries]
      .sort((a, b) => a.label.localeCompare(b.label))
      .map((country) => ({ ...country, label: `${country.label} (${country.value})` }));
  }

  const displayNames = new Intl.DisplayNames([locale, 'en'], { type: 'region' });
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const generated = [];

  for (const first of letters) {
    for (const second of letters) {
      const code = `${first}${second}`;
      if (!ISO_CODE_REGEX.test(code)) continue;

      let localizedName = '';
      try {
        localizedName = displayNames.of(code) || '';
      } catch (error) {
        localizedName = '';
      }

      if (!localizedName || localizedName.toUpperCase() === code) continue;
      generated.push({ value: code, label: `${localizedName} (${code})` });
    }
  }

  if (!generated.length) {
    return [...fallbackIsoCountries]
      .sort((a, b) => a.label.localeCompare(b.label))
      .map((country) => ({ ...country, label: `${country.label} (${country.value})` }));
  }

  return generated.sort((a, b) => a.label.localeCompare(b.label));
}

const isoCountryOptions = buildIsoCountryOptions();

const fieldSx = {
  '& .MuiInputBase-root': { borderRadius: 2, minHeight: 48 },
  '& .MuiInputLabel-root': { fontWeight: 500 }
};

const glassCard = (theme) => ({
  p: 2,
  borderRadius: 2.5,
  border: '1px solid',
  borderColor: 'divider',
  boxShadow: '0 14px 34px rgba(0,0,0,0.10)',
  background:
    theme.palette.mode === 'light'
      ? `linear-gradient(135deg, ${theme.palette.primary.light}24 0%, ${theme.palette.secondary.main}12 45%, #ffffff 100%)`
      : theme.palette.background.default
});

const sectionSx = {
  p: 2,
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
  bgcolor: 'background.paper'
};

function optionLabel(options, value, fallback = '-') {
  if (!value) return fallback;
  return options.find((opt) => opt.value === value)?.label || value;
}

function formatDateTime(value) {
  if (!value) return '-';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

function formatCountryLabel(value) {
  const isoValue = (value || '').toUpperCase();
  if (!isoValue) return '-';
  return isoCountryOptions.find((country) => country.value === isoValue)?.label || isoValue;
}

function normalizePotential(item = {}) {
  return {
    potentialCustomerId: item.potentialCustomerId ?? item.id ?? item.potential_customer_id ?? null,
    fullName: item.fullName ?? item.full_name ?? '',
    email: item.email ?? '',
    phone: item.phone ?? '',
    country: (item.country ?? '').toUpperCase(),
    category: (item.category ?? 'GENERAL').toUpperCase(),
    status: (item.status ?? 'NEW').toUpperCase(),
    createdAt: item.createdAt ?? item.created_at ?? null
  };
}

const WHATSAPP_MESSAGE = `Hola, ¿qué tal?

Te escribo porque creo que mi servicio te puede servir muy bien en tu negocio. Es una solución de entretenimiento para TV que ayuda a que tus clientes estén más cómodos y entretenidos mientras esperan o se atienden.

Puedes tener deportes, Peliculas , Series, canales en vivo y contenido variado, haciendo que tu negocio se vea más moderno y con mejor ambiente.

Puedes conocer más sobre nuestro servicio en www.liontvpremium.com

Si gustas, te comparto una demo sin compromiso para que veas cómo se mira en tu local.`;

const countryPhonePrefixMap = {
  AR: '54',
  CA: '1',
  CO: '57',
  CR: '506',
  ES: '34',
  GT: '502',
  HN: '504',
  MX: '52',
  NI: '505',
  PA: '507',
  SV: '503',
  US: '1'
};

function normalizePhoneForWhatsApp(phone, countryIso = '') {
  let digits = String(phone || '').replace(/\D/g, '');
  if (!digits) return '';

  if (digits.startsWith('00')) {
    digits = digits.slice(2);
  }

  const iso = (countryIso || '').toUpperCase();
  const prefix = countryPhonePrefixMap[iso];

  if (prefix && digits.length <= 10 && !digits.startsWith(prefix)) {
    return `${prefix}${digits}`;
  }

  return digits;
}

function StatusChip({ status }) {
  const map = {
    NEW: 'info',
    CONTACTED: 'warning',
    NEGOTIATION: 'secondary',
    CONVERTED: 'success',
    LOST: 'error'
  };
  return <Chip size="small" color={map[status] || 'default'} label={status || '-'} />;
}

function RowActions({ row, onEdit, onDelete, onWhatsApp, onMarkContacted }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { t } = useTranslation();

  return (
    <>
      <IconButton
        size="small"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={(theme) => ({
          bgcolor: theme.palette.primary.lighter,
          color: theme.palette.primary.main,
          '&:hover': {
            bgcolor: theme.palette.primary.light
          },
          boxShadow: '0 6px 14px rgba(0,0,0,0.12)'
        })}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            onEdit?.(row);
          }}
        >
          <EditOutlinedIcon fontSize="small" style={{ marginRight: 8, color: '#1e88e5' }} />
          {t('actions.edit')}
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            onWhatsApp?.(row);
          }}
        >
          <WhatsAppIcon fontSize="small" style={{ marginRight: 8, color: '#25D366' }} />
          {t('actions.whatsapp', 'WhatsApp')}
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            onMarkContacted?.(row);
          }}
        >
          <CheckCircleOutlineIcon fontSize="small" style={{ marginRight: 8, color: '#2e7d32' }} />
          {t('potentialCustomers.actions.markContacted', 'Mark as Contacted')}
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            onDelete?.(row);
          }}
        >
          <DeleteOutlineIcon fontSize="small" style={{ marginRight: 8, color: '#e53935' }} />
          {t('actions.delete')}
        </MenuItem>
      </Menu>
    </>
  );
}

function FormSection({ title, helper, children }) {
  return (
    <Box
      sx={(theme) => ({
        ...sectionSx,
        position: 'relative',
        overflow: 'hidden',
        borderLeft: `4px solid ${theme.palette.primary.main}44`,
        background:
          theme.palette.mode === 'light'
            ? `linear-gradient(135deg, ${theme.palette.primary.light}08 0%, ${theme.palette.secondary.light}08 100%)`
            : theme.palette.background.paper
      })}
    >
      <Stack spacing={1.5}>
        <Box>
          <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {title}
          </Typography>
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

const defaultForm = {
  potentialCustomerId: null,
  fullName: '',
  email: '',
  phone: '',
  country: '',
  category: 'GENERAL',
  status: 'NEW'
};

export default function PotentialCustomersLionTv() {
  const { enqueueSnackbar } = useSnackbar();
  const { accessToken } = useAuth();
  const { t } = useTranslation();
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

  const handleUnauthorized = (err) => {
    const status = err?.response?.status || err?.request?.status;
    return status === 401;
  };

  const loadPotentialCustomers = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const response = await lionTvApi.get('/potential-customers/v1', {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { index: 0, size: 5000 },
        skipAuthRedirect: true
      });

      const payload = response?.data?.data ?? response?.data ?? {};
      const collection = payload.data ?? payload.items ?? payload.content ?? [];
      const normalized = (Array.isArray(collection) ? collection : []).map(normalizePotential);
      setRows(normalized);
      setTotal(payload.total ?? normalized.length);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || err.message || 'No se pudieron cargar los clientes potenciales.', {
          variant: 'error'
        });
      }
    } finally {
      setLoading(false);
    }
  }, [accessToken, enqueueSnackbar]);

  useEffect(() => {
    loadPotentialCustomers();
  }, [loadPotentialCustomers, refreshKey]);

  const filteredRows = useMemo(() => {
    if (!search && !statusFilter) return rows;
    const term = search.toLowerCase();
    return rows.filter((row) => {
      if (statusFilter && (row.status || '').toLowerCase() !== statusFilter.toLowerCase()) return false;
      return (
        (row.fullName || '').toLowerCase().includes(term) ||
        (row.email || '').toLowerCase().includes(term) ||
        (row.phone || '').toLowerCase().includes(term) ||
        (row.country || '').toLowerCase().includes(term) ||
        (row.category || '').toLowerCase().includes(term) ||
        (row.status || '').toLowerCase().includes(term)
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

  const summary = useMemo(
    () =>
      rows.reduce(
        (acc, row) => {
          if (row.status === 'NEW') acc.newCount += 1;
          if (row.status === 'CONTACTED') acc.contacted += 1;
          if (row.status === 'CONVERTED') acc.converted += 1;
          return acc;
        },
        { newCount: 0, contacted: 0, converted: 0 }
      ),
    [rows]
  );

  const handleFormChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const resetForm = () => setForm(defaultForm);

  const handleEdit = (row) => {
    setForm({
      potentialCustomerId: row.potentialCustomerId || null,
      fullName: row.fullName || '',
      email: row.email || '',
      phone: row.phone || '',
      country: (row.country || '').toUpperCase(),
      category: row.category || 'GENERAL',
      status: row.status || 'NEW'
    });
    setOpenModal(true);
  };

  const handleDelete = (row) => {
    setOpenDelete({ open: true, row });
  };

  const buildPayload = (source) => ({
    fullName: source?.fullName?.trim() || '',
    email: source?.email?.trim() || EMAIL_FALLBACK,
    phone: source?.phone?.trim() || null,
    country: (source?.country || '').toUpperCase() || null,
    category: source?.category || 'GENERAL',
    status: source?.status || 'NEW'
  });

  const handleMarkContacted = async (row) => {
    const id = row?.potentialCustomerId;
    if (!id) return;

    if ((row?.status || '').toUpperCase() === 'CONTACTED') {
      enqueueSnackbar('Este prospecto ya está en Contacted.', { variant: 'info' });
      return;
    }

    setSending(true);
    try {
      await lionTvApi.put(
        `/potential-customers/v1/${id}`,
        {
          ...buildPayload(row),
          status: 'CONTACTED'
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          skipAuthRedirect: true
        }
      );
      enqueueSnackbar('Estado actualizado a Contacted.', { variant: 'success' });
      setRefreshKey((v) => v + 1);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || err.message || 'No se pudo actualizar el estado.', {
          variant: 'error'
        });
      }
    } finally {
      setSending(false);
    }
  };

  const handleWhatsApp = (row) => {
    const phone = normalizePhoneForWhatsApp(row?.phone, row?.country);
    if (!phone) {
      enqueueSnackbar('Este prospecto no tiene teléfono válido para WhatsApp.', { variant: 'warning' });
      return;
    }

    const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleSave = async () => {
    if (!form.fullName) {
      enqueueSnackbar('Completa el nombre.', { variant: 'warning' });
      return;
    }

    const payload = {
      fullName: form.fullName.trim(),
      email: form.email?.trim() || EMAIL_FALLBACK,
      phone: form.phone?.trim() || null,
      country: (form.country || '').toUpperCase() || null,
      category: form.category || 'GENERAL',
      status: form.status || 'NEW'
    };

    setSending(true);
    try {
      if (form.potentialCustomerId) {
        await lionTvApi.put(`/potential-customers/v1/${form.potentialCustomerId}`, payload, {
          headers: { Authorization: `Bearer ${accessToken}` },
          skipAuthRedirect: true
        });
        enqueueSnackbar('Cliente potencial actualizado.', { variant: 'success' });
      } else {
        await lionTvApi.post('/potential-customers/v1', payload, {
          headers: { Authorization: `Bearer ${accessToken}` },
          skipAuthRedirect: true
        });
        enqueueSnackbar('Cliente potencial creado.', { variant: 'success' });
      }
      setOpenModal(false);
      resetForm();
      setRefreshKey((v) => v + 1);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || err.message || 'No se pudo guardar el cliente potencial.', {
          variant: 'error'
        });
      }
    } finally {
      setSending(false);
    }
  };

  const confirmDelete = async () => {
    const id = openDelete.row?.potentialCustomerId;
    if (!id) {
      setOpenDelete({ open: false, row: null });
      return;
    }
    setSending(true);
    try {
      await lionTvApi.delete(`/potential-customers/v1/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        skipAuthRedirect: true
      });
      enqueueSnackbar('Cliente potencial eliminado.', { variant: 'success' });
      setOpenDelete({ open: false, row: null });
      setRefreshKey((v) => v + 1);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || err.message || 'No se pudo eliminar el cliente potencial.', {
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
        title={t('potentialCustomers.title', 'Potential Customers')}
        secondary={
          <Stack direction="row" spacing={1.25}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => setRefreshKey((v) => v + 1)}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                px: 2
              }}
            >
              {t('actions.refresh')}
            </Button>
            <Button
              variant="contained"
              startIcon={<PersonAddAlt1Icon />}
              onClick={() => {
                resetForm();
                setOpenModal(true);
              }}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                px: 2.5,
                boxShadow: '0 10px 24px rgba(0,0,0,0.12)'
              }}
            >
              {t('potentialCustomers.actions.new', 'Nuevo potencial')}
            </Button>
          </Stack>
        }
      >
        <Grid container spacing={gridSpacing}>
          {[
            { icon: GroupIcon, label: 'Total', value: total, color: 'primary.main' },
            { icon: InfoOutlinedIcon, label: 'Nuevos', value: summary.newCount, color: 'info.main' },
            { icon: ContactPhoneOutlinedIcon, label: 'Contactados', value: summary.contacted, color: 'warning.main' },
            { icon: TrendingUpOutlinedIcon, label: 'Convertidos', value: summary.converted, color: 'success.main' }
          ].map((item, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Card
                sx={(theme) => ({
                  ...glassCard(theme),
                  py: 1.5,
                  px: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  background:
                    theme.palette.mode === 'light'
                      ? `linear-gradient(155deg, ${theme.palette.primary.main}1F 0%, ${theme.palette.secondary.main}20 55%, #ffffff 100%)`
                      : theme.palette.background.paper
                })}
              >
                <Avatar
                  sx={(theme) => ({
                    width: 40,
                    height: 40,
                    bgcolor: item.color,
                    color: theme.palette.getContrastText(theme.palette.primary.main),
                    boxShadow: 3,
                    border: '2px solid',
                    borderColor: 'background.paper'
                  })}
                >
                  <item.icon fontSize="small" />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {item.value}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item.label}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </MainCard>

      <MainCard title={t('potentialCustomers.search', 'Buscar potenciales')}>
        <Box
          sx={(theme) => ({
            mb: 2,
            p: 2,
            borderRadius: 2.5,
            border: '1px solid',
            borderColor: theme.palette.divider,
            background:
              theme.palette.mode === 'light'
                ? `linear-gradient(135deg, ${theme.palette.primary.light}12 0%, ${theme.palette.secondary.light}10 100%)`
                : theme.palette.background.paper,
            boxShadow: '0 10px 28px rgba(0,0,0,0.08)'
          })}
        >
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
            <TextField
              size="small"
              placeholder={t('potentialCustomers.searchPlaceholder', 'Buscar por nombre, correo, teléfono, país')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
              sx={{ '& .MuiOutlinedInput-root': { minHeight: 46, borderRadius: 2 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                )
              }}
            />
            <FormControl size="small" sx={{ minWidth: 220, '& .MuiOutlinedInput-root': { minHeight: 46, borderRadius: 2 } }}>
              <InputLabel>{t('potentialCustomers.filters.status', 'Estado')}</InputLabel>
              <Select value={statusFilter} label={t('potentialCustomers.filters.status', 'Estado')} onChange={(e) => setStatusFilter(e.target.value)}>
                <MenuItem value="">
                  <em>{t('invoices.filters.all', 'All')}</em>
                </MenuItem>
                {statusOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Box>

        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 14px 32px rgba(0,0,0,0.08)' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t('potentialCustomers.headers.name', 'Nombre')}</TableCell>
                <TableCell>{t('potentialCustomers.headers.email', 'Correo')}</TableCell>
                <TableCell>{t('potentialCustomers.headers.phone', 'Teléfono')}</TableCell>
                <TableCell>{t('potentialCustomers.headers.country', 'País')}</TableCell>
                <TableCell>{t('potentialCustomers.headers.category', 'Categoría')}</TableCell>
                <TableCell>{t('potentialCustomers.headers.status', 'Estado')}</TableCell>
                <TableCell>{t('potentialCustomers.headers.createdAt', 'Creado')}</TableCell>
                <TableCell align="right">{t('potentialCustomers.headers.actions', 'Acciones')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading &&
                Array.from({ length: 4 }).map((_, idx) => (
                  <TableRow key={`skeleton-${idx}`}>
                    {Array.from({ length: 8 }).map((__, cidx) => (
                      <TableCell key={cidx}>
                        <Skeleton variant="text" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}

              {!loading &&
                paginatedRows.map((row) => (
                  <TableRow key={row.potentialCustomerId} hover>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar sx={{ width: 30, height: 30, bgcolor: 'primary.light', color: 'primary.dark' }}>
                          <AutoAwesomeIcon fontSize="small" />
                        </Avatar>
                        <Typography variant="subtitle2">{row.fullName || '-'}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <MailOutlineIcon fontSize="small" color="action" />
                        <Typography variant="body2">{row.email || '-'}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <PhoneIphoneIcon fontSize="small" color="action" />
                        <Typography variant="body2">{row.phone || '-'}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <PublicIcon fontSize="small" color="action" />
                        <Typography variant="body2">{formatCountryLabel(row.country)}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip size="small" variant="outlined" label={optionLabel(categoryOptions, row.category, row.category || '-')} />
                    </TableCell>
                    <TableCell>
                      <StatusChip status={row.status} />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <CalendarMonthIcon fontSize="small" color="action" />
                        <Typography variant="body2">{formatDateTime(row.createdAt)}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="right">
                      <RowActions
                        row={row}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onWhatsApp={handleWhatsApp}
                        onMarkContacted={handleMarkContacted}
                      />
                    </TableCell>
                  </TableRow>
                ))}

              {!loading && paginatedRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    {t('potentialCustomers.empty', 'No hay clientes potenciales registrados.')}
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

      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        fullWidth
        maxWidth="md"
        fullScreen={isMobile}
        PaperProps={{
          sx: (theme) => ({
            borderRadius: 3,
            boxShadow: '0 18px 40px rgba(0,0,0,0.18)',
            border: '1px solid',
            borderColor: form.potentialCustomerId ? theme.palette.warning.light : theme.palette.primary.light,
            backgroundImage:
              theme.palette.mode === 'light'
                ? `linear-gradient(150deg, ${theme.palette.primary.light}18 0%, ${theme.palette.secondary.light}10 45%, #ffffff 100%)`
                : undefined
          })
        }}
      >
        <DialogTitle
          sx={(theme) => ({
            position: 'relative',
            pb: 1,
            background: form.potentialCustomerId
              ? `linear-gradient(135deg, ${theme.palette.warning.light}40 0%, ${theme.palette.secondary.light}20 45%, ${theme.palette.background.paper} 100%)`
              : `linear-gradient(135deg, ${theme.palette.primary.light}40 0%, ${theme.palette.secondary.light}20 45%, ${theme.palette.background.paper} 100%)`
          })}
        >
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Avatar
              sx={{
                bgcolor: form.potentialCustomerId ? 'warning.main' : 'primary.main',
                color: 'primary.contrastText',
                width: 40,
                height: 40,
                boxShadow: 3
              }}
            >
              <PersonAddAlt1Icon fontSize="small" />
            </Avatar>
            <Box>
              <Typography variant="h6">
                {form.potentialCustomerId
                  ? t('potentialCustomers.actions.edit', 'Editar cliente potencial')
                  : t('potentialCustomers.actions.new', 'Nuevo cliente potencial')}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t('potentialCustomers.subtitle', 'Registra y da seguimiento a contactos interesados.')}
              </Typography>
            </Box>
            <Chip
              label={form.potentialCustomerId ? t('common.edit', 'Edit') : t('common.new', 'New')}
              size="small"
              color={form.potentialCustomerId ? 'warning' : 'primary'}
              variant="filled"
              sx={{ ml: 'auto', fontWeight: 700, borderRadius: 1.5 }}
            />
          </Stack>
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            bgcolor: 'background.default',
            px: { xs: 1.5, sm: 3 },
            py: { xs: 1.5, sm: 2 },
            background: (theme) =>
              theme.palette.mode === 'light'
                ? `linear-gradient(180deg, ${theme.palette.primary.light}18 0%, ${theme.palette.secondary.light}10 60%, ${theme.palette.background.paper} 85%)`
                : theme.palette.background.default,
            position: 'relative',
            '&:before': {
              content: '""',
              position: 'absolute',
              inset: 12,
              zIndex: 0,
              borderRadius: 20,
              background:
                'radial-gradient(circle at 18% 18%, rgba(33,150,243,0.10), transparent 45%), radial-gradient(circle at 82% 0%, rgba(156,39,176,0.10), transparent 35%)'
            }
          }}
        >
          <Stack spacing={2} sx={{ position: 'relative', zIndex: 1 }}>
            <FormSection title={t('potentialCustomers.form.identity', 'Identidad')} helper={t('potentialCustomers.form.identityHelper', 'Datos principales del contacto')}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    label={t('potentialCustomers.headers.name', 'Nombre')}
                    value={form.fullName}
                    onChange={handleFormChange('fullName')}
                    fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonAddAlt1Icon fontSize="small" color="primary" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label={t('potentialCustomers.headers.email', 'Correo')}
                    value={form.email}
                    onChange={handleFormChange('email')}
                    helperText={t('potentialCustomers.emailDefault', 'Si lo dejas vacío se guardará nomail@gmail.com')}
                    fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MailOutlineIcon fontSize="small" color="secondary" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label={t('potentialCustomers.headers.phone', 'Teléfono')}
                    value={form.phone}
                    onChange={handleFormChange('phone')}
                    fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIphoneIcon fontSize="small" color="info" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth sx={fieldSx}>
                    <InputLabel>{t('potentialCustomers.headers.country', 'País (ISO)')}</InputLabel>
                    <Select
                      value={form.country || ''}
                      label={t('potentialCustomers.headers.country', 'País (ISO)')}
                      onChange={handleFormChange('country')}
                      startAdornment={
                        <InputAdornment position="start">
                          <PublicIcon fontSize="small" color="success" />
                        </InputAdornment>
                      }
                      MenuProps={{ PaperProps: { sx: { maxHeight: 320 } } }}
                    >
                      <MenuItem value="">
                        <em>{t('potentialCustomers.selectCountry', 'Seleccionar país')}</em>
                      </MenuItem>
                      {form.country && !isoCountryOptions.some((country) => country.value === form.country) ? (
                        <MenuItem value={form.country}>{form.country}</MenuItem>
                      ) : null}
                      {isoCountryOptions.map((country) => (
                        <MenuItem key={country.value} value={country.value}>
                          {country.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </FormSection>

            <FormSection
              title={t('potentialCustomers.form.classification', 'Clasificación')}
              helper={t('potentialCustomers.form.classificationHelper', 'Categoriza y define estado comercial')}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth sx={fieldSx}>
                    <InputLabel>{t('potentialCustomers.headers.category', 'Categoría')}</InputLabel>
                    <Select
                      value={form.category}
                      label={t('potentialCustomers.headers.category', 'Categoría')}
                      onChange={handleFormChange('category')}
                      startAdornment={
                        <InputAdornment position="start">
                          <CategoryIcon fontSize="small" color="warning" />
                        </InputAdornment>
                      }
                    >
                      {categoryOptions.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth sx={fieldSx}>
                    <InputLabel>{t('potentialCustomers.headers.status', 'Estado')}</InputLabel>
                    <Select
                      value={form.status}
                      label={t('potentialCustomers.headers.status', 'Estado')}
                      onChange={handleFormChange('status')}
                      startAdornment={
                        <InputAdornment position="start">
                          <InfoOutlinedIcon fontSize="small" color="action" />
                        </InputAdornment>
                      }
                    >
                      {statusOptions.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </FormSection>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button variant="outlined" onClick={resetForm} disabled={sending} sx={{ borderRadius: 2 }} startIcon={<RefreshIcon />}>
            {t('actions.clear', 'Limpiar')}
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={sending}
            startIcon={<RocketLaunchIcon />}
            sx={{ borderRadius: 2, boxShadow: '0 12px 28px rgba(0,0,0,0.16)', px: 2.4 }}
          >
            {sending ? t('actions.saving', 'Guardando...') : form.potentialCustomerId ? t('actions.save', 'Guardar cambios') : t('actions.create', 'Crear')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDelete.open} onClose={() => setOpenDelete({ open: false, row: null })} maxWidth="xs" fullWidth fullScreen={isMobile}>
        <DialogTitle>
          <Typography variant="h6">{t('potentialCustomers.deleteTitle', 'Eliminar cliente potencial')}</Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Typography>
            {t('potentialCustomers.deleteBody', {
              defaultValue: '¿Eliminar a {{name}}?',
              name: openDelete.row?.fullName || ''
            })}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete({ open: false, row: null })} disabled={sending}>
            {t('actions.cancel', 'Cancelar')}
          </Button>
          <Button color="error" variant="contained" onClick={confirmDelete} disabled={sending}>
            {sending ? t('actions.deleting', 'Eliminando...') : t('actions.delete', 'Eliminar')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
