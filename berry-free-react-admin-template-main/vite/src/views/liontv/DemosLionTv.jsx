import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import useAuth from 'hooks/useAuth';

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
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import { useTheme, useMediaQuery } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import PublicIcon from '@mui/icons-material/Public';
import LanIcon from '@mui/icons-material/Lan';
import AppsIcon from '@mui/icons-material/Apps';
import NoteAltOutlinedIcon from '@mui/icons-material/NoteAltOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined';
import MailOutlineIcon from '@mui/icons-material/MailOutline';

import MainCard from 'ui-component/cards/MainCard';
import LionMetricCard from 'ui-component/cards/LionMetricCard';
import DialogTitleWithClose from 'ui-component/dialogs/DialogTitleWithClose';
import MobileFieldGrid from 'ui-component/responsive/MobileFieldGrid';
import MobileSummaryCard from 'ui-component/responsive/MobileSummaryCard';
import ResponsiveActionBar from 'ui-component/responsive/ResponsiveActionBar';
import ResponsiveEntityView from 'ui-component/responsive/ResponsiveEntityView';
import ResponsiveFilters from 'ui-component/responsive/ResponsiveFilters';
import ResponsiveMetricGrid from 'ui-component/responsive/ResponsiveMetricGrid';
import { gridSpacing } from 'store/constant';
import { lionTvApi, shopifyDemosApi } from 'utils/api';

const fieldSx = {
  '& .MuiInputBase-root': { borderRadius: 2, minHeight: 48 },
  '& .MuiInputLabel-root': { fontWeight: 500 }
};

const glassCard = (theme) => ({
  p: 2,
  borderRadius: 2.5,
  border: '1px solid',
  borderColor: 'divider',
  boxShadow: '0 14px 34px rgba(2,8,23,0.34)',
  background: `linear-gradient(135deg, ${theme.vars.palette.surface.card} 0%, ${theme.vars.palette.surface.muted} 100%)`,
  ...theme.applyStyles('light', {
    boxShadow: '0 14px 34px rgba(0,0,0,0.10)',
    background: `linear-gradient(135deg, ${theme.vars.palette.primary.light}24 0%, ${theme.vars.palette.secondary.main}12 45%, ${theme.vars.palette.background.paper} 100%)`
  })
});

const sectionSx = {
  p: 2,
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
  bgcolor: 'background.paper'
};

const statusTokens = (theme) => ({
  ACTIVE: {
    bg: theme.palette.success.lighter,
    color: theme.palette.success.darker,
    border: theme.palette.success.main,
    icon: <CheckCircleOutlineIcon fontSize="small" />
  },
  ACTIVATED: {
    bg: theme.palette.success.lighter,
    color: theme.palette.success.darker,
    border: theme.palette.success.main,
    icon: <CheckCircleOutlineIcon fontSize="small" />
  },
  PENDING: {
    bg: theme.palette.info.lighter,
    color: theme.palette.info.darker,
    border: theme.palette.info.main,
    icon: <PendingOutlinedIcon fontSize="small" />
  },
  EXPIRED: {
    bg: theme.palette.warning.lighter,
    color: theme.palette.warning.darker,
    border: theme.palette.warning.main,
    icon: <AccessTimeIcon fontSize="small" />
  },
  CANCELLED: {
    bg: theme.palette.error.lighter,
    color: theme.palette.error.darker,
    border: theme.palette.error.main,
    icon: <HighlightOffIcon fontSize="small" />
  }
});

const appOptions = [
  { value: 'VIVO_PLAYER', label: 'Vivo Player' },
  { value: 'SMART_ONE', label: 'Smart One IPTV' },
  { value: 'IBO_PRO', label: 'IboPro Player' }
];

const defaultForm = {
  macAddress: '',
  cellphone: '',
  customerName: '',
  email: '',
  appCode: 'VIVO_PLAYER',
  status: 'PENDING',
  note: '',
  originalMac: ''
};

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

function initialsFromName(name = '') {
  const parts = name.trim().split(' ').filter(Boolean);
  if (!parts.length) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function flagFromPhone(phone = '') {
  const clean = phone.replace(/[^\d+]/g, '');
  if (clean.startsWith('+504') || clean.startsWith('504')) return '🇭🇳';
  if (clean.startsWith('+502') || clean.startsWith('502')) return '🇬🇹';
  if (clean.startsWith('+503') || clean.startsWith('503')) return '🇸🇻';
  if (clean.startsWith('+505') || clean.startsWith('505')) return '🇳🇮';
  if (clean.startsWith('+506') || clean.startsWith('506')) return '🇨🇷';
  if (clean.startsWith('+507') || clean.startsWith('507')) return '🇵🇦';
  if (clean.startsWith('+1') || clean.startsWith('1')) return '🇺🇸';
  if (clean.startsWith('+57') || clean.startsWith('57')) return '🇨🇴';
  if (clean.startsWith('+34') || clean.startsWith('34')) return '🇪🇸';
  return null;
}

function demoStatusLabel(t, status) {
  return t(`demos.status.${status}`, status || '-');
}

function StatusChip({ status }) {
  const theme = useTheme();
  const { t } = useTranslation();
  const map = statusTokens(theme);
  const cfg =
    map[status] || {
      bg: theme.palette.surface?.muted || theme.palette.background.paper,
      color: theme.palette.text.secondary,
      border: theme.palette.divider,
      icon: <PendingOutlinedIcon fontSize="small" />
    };
  return (
    <Chip
      size="small"
      icon={cfg.icon}
      label={demoStatusLabel(t, status)}
      sx={{
        fontWeight: 700,
        bgcolor: cfg.bg,
        color: cfg.color,
        borderColor: cfg.border,
        borderWidth: 1,
        borderStyle: 'solid',
        px: 0.5
      }}
      variant="outlined"
    />
  );
}

function RowActions({ row, onEdit, onDelete, onEmail }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const { t } = useTranslation();
  const open = Boolean(anchorEl);

  const openWhatsApp = () => {
    const digits = (row.cellphone || '').replace(/\D/g, '');
    if (!digits) return;
    const message =
      '¡Hola! Soy del equipo Lion TV Premium. Tu demo ha finalizado. ¿Te gustaría activar un plan completo y seguir disfrutando del contenido? Responde este mensaje y te ayudamos a elegir la mejor opción.';
    const url = `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <IconButton
        size="small"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={(theme) => ({
          bgcolor: theme.palette.primary.lighter,
          color: theme.palette.primary.main,
          '&:hover': { bgcolor: theme.palette.primary.light },
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
            onEmail?.(row);
          }}
        >
          <MailOutlineIcon fontSize="small" style={{ marginRight: 8, color: '#0284c7' }} />
          {t('actions.sendEmail', 'Enviar email')}
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            openWhatsApp();
          }}
        >
          <PhoneIphoneIcon fontSize="small" style={{ marginRight: 8, color: '#25D366' }} />
          WhatsApp
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

function SectionCard({ title, helper, children }) {
  return (
    <Box
      sx={(theme) => ({
        ...sectionSx,
        position: 'relative',
        overflow: 'hidden',
        borderLeft: `4px solid ${theme.palette.primary.main}44`,
        background: theme.vars.palette.surface.card,
        ...theme.applyStyles('light', {
          background: `linear-gradient(135deg, ${theme.vars.palette.primary.light}08 0%, ${theme.vars.palette.secondary.light}08 100%)`
        })
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

function normalizeDemo(item = {}) {
  return {
    id: item.id ?? item.demoId ?? item.demo_id ?? null,
    macAddress: item.macAddress ?? item.mac_address ?? '',
    cellphone: item.cellphone ?? item.phone ?? '',
    customerName: item.customerName ?? item.name ?? '',
    email: item.email ?? '',
    appCode: item.appCode ?? item.app_code ?? '',
    status: (item.status ?? '').toUpperCase(),
    note: item.note ?? '',
    createdAt: item.createdAt ?? item.created_at ?? null,
    expiresAt: item.expiresAt ?? item.expires_at ?? null
  };
}

function normalizeLineOption(item = {}) {
  const id = String(item.id ?? item.lineId ?? item.line_id ?? '').trim();
  const lineId = String(item.lineId ?? item.line_id ?? item.id ?? '').trim();
  const usernameEncode = String(item.username_encode ?? item.usernameEncode ?? item.username ?? '').trim();
  const provider = String(item.provider ?? '').trim();
  return {
    value: id || lineId,
    id,
    lineId,
    usernameEncode,
    provider,
    label: `${lineId || id || '-'}${usernameEncode ? ` · ${usernameEncode}` : ''}${provider ? ` · ${provider}` : ''}`
  };
}

export default function DemosLionTv() {
  const { enqueueSnackbar } = useSnackbar();
  const { accessToken } = useAuth();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [refreshKey, setRefreshKey] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [lineOptions, setLineOptions] = useState([]);
  const [loadingLineOptions, setLoadingLineOptions] = useState(false);
  const [sourceConfig, setSourceConfig] = useState(null);
  const [sourceConfigForm, setSourceConfigForm] = useState('');
  const [loadingSourceConfig, setLoadingSourceConfig] = useState(false);
  const [savingSourceConfig, setSavingSourceConfig] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState({ open: false, row: null });
  const [form, setForm] = useState(defaultForm);
  const [sending, setSending] = useState(false);

  const handleUnauthorized = (err) => {
    const status = err?.response?.status || err?.request?.status;
    return status === 401;
  };

  const loadLineOptions = useCallback(async () => {
    setLoadingLineOptions(true);
    try {
      const response = await lionTvApi.get('/lines/v1/list-lines', {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { index: 0, start: 0, size: 1000, filters: '', sorting: '' },
        skipAuthRedirect: true
      });
      const data = response?.data?.data ?? response?.data ?? [];
      const normalized = (Array.isArray(data) ? data : [])
        .map(normalizeLineOption)
        .filter((item) => item.value)
        .sort((a, b) => a.label.localeCompare(b.label));
      setLineOptions(normalized);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || err.message || 'No se pudieron cargar las líneas disponibles para demos.', {
          variant: 'error'
        });
      }
    } finally {
      setLoadingLineOptions(false);
    }
  }, [accessToken, enqueueSnackbar]);

  const loadSourceConfig = useCallback(async () => {
    setLoadingSourceConfig(true);
    try {
      const response = await shopifyDemosApi.get('/demos/source-config', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const data = response?.data?.data ?? null;
      setSourceConfig(data);
      setSourceConfigForm(data?.sourceLineIdentifier ? String(data.sourceLineIdentifier) : '');
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || err.message || 'No se pudo cargar la configuración de demos.', {
          variant: 'error'
        });
      }
    } finally {
      setLoadingSourceConfig(false);
    }
  }, [accessToken, enqueueSnackbar]);

  const loadDemos = useCallback(async () => {
    setLoading(true);
    try {
      const response = await shopifyDemosApi.get('/demos/all', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const list = response?.data?.data ?? [];
      const normalized = (Array.isArray(list) ? list : []).map(normalizeDemo);
      setRows(normalized);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || err.message || 'No se pudieron cargar las demos.', { variant: 'error' });
      }
    } finally {
      setLoading(false);
    }
  }, [accessToken, enqueueSnackbar]);

  useEffect(() => {
    loadDemos();
  }, [refreshKey, loadDemos]);

  useEffect(() => {
    loadLineOptions();
    loadSourceConfig();
  }, [loadLineOptions, loadSourceConfig]);

  useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(rows.length / rowsPerPage) - 1);
    if (page > maxPage) setPage(0);
  }, [rows.length, page, rowsPerPage]);

  const filteredRows = useMemo(() => {
    const term = search.toLowerCase();
    return rows.filter((row) => {
      if (statusFilter && (row.status || '').toLowerCase() !== statusFilter.toLowerCase()) return false;
      return (
        (row.cellphone || '').toLowerCase().includes(term) ||
        (row.customerName || '').toLowerCase().includes(term) ||
        (row.macAddress || '').toLowerCase().includes(term) ||
        (row.email || '').toLowerCase().includes(term) ||
        (row.appCode || '').toLowerCase().includes(term)
      );
    });
  }, [rows, search, statusFilter]);

  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredRows.slice(start, start + rowsPerPage);
  }, [filteredRows, page, rowsPerPage]);

  const summary = useMemo(
    () =>
      rows.reduce(
        (acc, row) => {
          if (row.status === 'ACTIVE' || row.status === 'ACTIVATED') acc.active += 1;
          if (row.status === 'PENDING') acc.pending += 1;
          if (row.status === 'EXPIRED') acc.expired += 1;
          return acc;
        },
        { active: 0, pending: 0, expired: 0 }
      ),
    [rows]
  );

  const resetForm = () => setForm(defaultForm);

  const selectedSourceLine = useMemo(
    () =>
      lineOptions.find(
        (item) => String(item.value) === String(sourceConfigForm || '') || String(item.lineId) === String(sourceConfigForm || '')
      ) || null,
    [lineOptions, sourceConfigForm]
  );

  const demoSourceReady = Boolean(sourceConfig?.configured);
  const requiresDemoSourceSetup = !loadingSourceConfig && !demoSourceReady;

  const handleMacChange = (event) => {
    const raw = (event.target.value || '').replace(/[^a-fA-F0-9]/g, '').slice(0, 12);
    const formatted = raw.match(/.{1,2}/g)?.join(':') ?? raw;
    setForm((prev) => ({ ...prev, macAddress: formatted.toLowerCase() }));
  };

  const openCreateModal = () => {
    if (requiresDemoSourceSetup) {
      enqueueSnackbar('Configura primero la línea que usarás para demos antes de crear una demo directa.', { variant: 'warning' });
      return;
    }
    resetForm();
    setIsEdit(false);
    setOpenModal(true);
  };

  const handleSaveSourceConfig = async () => {
    if (!sourceConfigForm) {
      enqueueSnackbar('Selecciona una línea para demos.', { variant: 'warning' });
      return;
    }

    setSavingSourceConfig(true);
    try {
      const response = await shopifyDemosApi.put(
        '/demos/source-config',
        { sourceLineIdentifier: sourceConfigForm },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const data = response?.data?.data ?? null;
      setSourceConfig(data);
      setSourceConfigForm(data?.sourceLineIdentifier ? String(data.sourceLineIdentifier) : sourceConfigForm);
      enqueueSnackbar(data?.message || 'Configuración demo actualizada.', { variant: 'success' });
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || err.message || 'No se pudo guardar la configuración demo.', { variant: 'error' });
      }
    } finally {
      setSavingSourceConfig(false);
    }
  };

  const openEditModal = (row) => {
    setForm({
      macAddress: row.macAddress || '',
      originalMac: row.macAddress || '',
      cellphone: row.cellphone || '',
      customerName: row.customerName || '',
      email: row.email || '',
      appCode: row.appCode || 'VIVO_PLAYER',
      status: row.status || 'PENDING',
      note: row.note || ''
    });
    setIsEdit(true);
    setOpenModal(true);
  };

  const handleDelete = async () => {
    const mac = openDelete.row?.macAddress;
    if (!mac) return;
    setSending(true);
    try {
      await shopifyDemosApi.delete(`/demos/${encodeURIComponent(mac)}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      enqueueSnackbar(t('demos.messages.deleted', 'Demo eliminada'), { variant: 'success' });
      setRefreshKey((v) => v + 1);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || err.message || 'No se pudo eliminar la demo.', { variant: 'error' });
      }
    } finally {
      setSending(false);
      setOpenDelete({ open: false, row: null });
    }
  };

  const handleSave = async () => {
    if (!form.cellphone || !form.macAddress || !form.customerName || !form.email) {
      enqueueSnackbar(t('demos.messages.required', 'Completa celular, MAC, nombre y correo.'), { variant: 'warning' });
      return;
    }

    const payload = {
      cellphone: form.cellphone,
      macAddress: form.macAddress,
      customerName: form.customerName,
      email: form.email,
      appCode: form.appCode,
      status: form.status,
      note: form.note
    };

    setSending(true);
    try {
      if (isEdit) {
        const mac = form.originalMac || form.macAddress;
        await shopifyDemosApi.put(`/demos/${encodeURIComponent(mac)}`, payload, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        enqueueSnackbar(t('demos.messages.updated', 'Demo actualizada'), { variant: 'success' });
      } else {
        await shopifyDemosApi.post('/demos/create-direct', payload, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        enqueueSnackbar(t('demos.messages.created', 'Demo creada'), { variant: 'success' });
      }
      setOpenModal(false);
      resetForm();
      setRefreshKey((v) => v + 1);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        const isExpireAttempt = (form.status || '').toUpperCase() === 'EXPIRED';
        const fallbackMessage = isExpireAttempt
          ? 'No se pudo marcar la demo como expirada porque falló la limpieza en Vivo Player.'
          : 'No se pudo guardar la demo.';
        enqueueSnackbar(err?.response?.data?.message || err.message || fallbackMessage, { variant: 'error' });
      }
    } finally {
      setSending(false);
    }
  };

  const handleSendEmail = async (row) => {
    const email = row?.email || '';
    if (!email) {
      enqueueSnackbar(t('demos.messages.emailMissing', 'Esta demo no tiene email'), { variant: 'warning' });
      return;
    }
    try {
      await shopifyDemosApi.post(
        '/demos/send-end-email',
        null,
        { params: { email }, headers: { Authorization: `Bearer ${accessToken}` } }
      );
      enqueueSnackbar(t('demos.messages.emailSent', 'Correo enviado'), { variant: 'success' });
    } catch (err) {
      enqueueSnackbar(err?.response?.data?.message || err.message || t('demos.messages.emailError', 'No se pudo enviar el correo'), {
        variant: 'error'
      });
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 1400, mx: 'auto' }}>
      <MainCard
        title={t('demos.title', 'Demos')}
        secondary={
          <ResponsiveActionBar>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => setRefreshKey((v) => v + 1)}
              sx={{ borderRadius: 2, textTransform: 'none', px: 2 }}
            >
              {t('actions.refresh')}
            </Button>
            <Button
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
              onClick={openCreateModal}
              disabled={requiresDemoSourceSetup}
              sx={{ borderRadius: 2, textTransform: 'none', px: 2.5, boxShadow: '0 10px 24px rgba(0,0,0,0.12)' }}
              fullWidth={isMobile}
            >
              {t('demos.new', 'Nueva demo')}
            </Button>
          </ResponsiveActionBar>
        }
      >
        <ResponsiveMetricGrid columns={{ xs: 1, md: 2, lg: 4 }}>
          {[
            { title: t('demos.cards.total', 'Demos'), value: rows.length, helper: t('demos.title', 'Demos'), color: 'primary', icon: <AppsIcon fontSize="small" /> },
            {
              title: t('demos.status.ACTIVE', 'ACTIVE'),
              value: summary.active,
              helper: t('demos.headers.status'),
              color: 'success',
              icon: <CheckCircleOutlineIcon fontSize="small" />
            },
            {
              title: t('demos.status.PENDING', 'PENDING'),
              value: summary.pending,
              helper: t('demos.headers.status'),
              color: 'info',
              icon: <PendingOutlinedIcon fontSize="small" />
            },
            {
              title: t('demos.status.EXPIRED', 'EXPIRED'),
              value: summary.expired,
              helper: t('demos.headers.status'),
              color: 'warning',
              icon: <AccessTimeIcon fontSize="small" />
            }
          ].map((item, idx) => (
            <LionMetricCard {...item} key={idx} />
          ))}
        </ResponsiveMetricGrid>
      </MainCard>

      <MainCard title="Configuración de línea demo">
        <Stack spacing={2}>
          <Typography variant="body2" color="text.secondary">
            Cada reseller debe definir su propia línea para demos directas. Esa configuración queda asociada al usuario autenticado y las demos creadas desde este módulo respetan ese aislamiento.
          </Typography>

          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={7}>
              <FormControl fullWidth size="small" sx={fieldSx}>
                <InputLabel id="demo-source-line-label">Línea para demos</InputLabel>
                <Select
                  labelId="demo-source-line-label"
                  label="Línea para demos"
                  value={sourceConfigForm}
                  onChange={(event) => setSourceConfigForm(event.target.value)}
                  disabled={loadingLineOptions || loadingSourceConfig}
                >
                  {lineOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={5}>
              <ResponsiveActionBar>
                <Button
                  variant="outlined"
                  onClick={loadSourceConfig}
                  disabled={loadingSourceConfig || savingSourceConfig}
                  sx={{ borderRadius: 2, textTransform: 'none' }}
                >
                  Recargar configuración
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSaveSourceConfig}
                  disabled={!sourceConfigForm || savingSourceConfig}
                  sx={{ borderRadius: 2, textTransform: 'none' }}
                >
                  Guardar línea demo
                </Button>
              </ResponsiveActionBar>
            </Grid>
          </Grid>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.25} flexWrap="wrap">
            <Chip
              color={demoSourceReady ? 'success' : sourceConfig?.legacyFallback ? 'warning' : 'default'}
              label={
                demoSourceReady
                  ? 'Configuración activa'
                  : sourceConfig?.legacyFallback
                    ? 'Modo legado'
                    : 'Falta configuración'
              }
            />
            <Chip label={`Línea: ${sourceConfig?.lineId || selectedSourceLine?.lineId || '-'}`} variant="outlined" />
            <Chip label={`Cuenta: ${sourceConfig?.usernameEncode || selectedSourceLine?.usernameEncode || '-'}`} variant="outlined" />
            <Chip label={`Provider: ${sourceConfig?.provider || selectedSourceLine?.provider || '-'}`} variant="outlined" />
          </Stack>

          {sourceConfig?.message ? (
            <Typography
              variant="caption"
              color={sourceConfig?.configured ? 'success.main' : sourceConfig?.legacyFallback ? 'warning.main' : 'error.main'}
              sx={{ fontWeight: 700 }}
            >
              {sourceConfig.message}
            </Typography>
          ) : null}
        </Stack>
      </MainCard>

      <MainCard
        title={t('demos.search', 'Búsqueda')}
        secondary={
          <ResponsiveFilters
            paperSx={{
              width: { xs: '100%', sm: 560 }
            }}
          >
            <TextField
              size="small"
              placeholder={t('demos.search', 'Buscar demo')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'background.paper'
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                )
              }}
            />
            <FormControl
              size="small"
              sx={{
                minWidth: 160,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'background.paper'
                }
              }}
            >
              <InputLabel>{t('demos.headers.status')}</InputLabel>
              <Select
                value={statusFilter}
                label={t('demos.headers.status')}
                onChange={(e) => setStatusFilter(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <AppsIcon fontSize="small" color="action" />
                  </InputAdornment>
                }
              >
                <MenuItem value="">
                  <em>{t('invoices.filters.all', 'Todos')}</em>
                </MenuItem>
                {['ACTIVE', 'ACTIVATED', 'PENDING', 'EXPIRED', 'CANCELLED']
                  .filter((status) => rows.some((r) => r.status === status))
                  .map((s) => (
                    <MenuItem key={s} value={s}>
                      {demoStatusLabel(t, s)}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </ResponsiveFilters>
        }
      >
        <ResponsiveEntityView
          isMobile={isMobile}
          mobileContent={
            loading ? (
              <Stack spacing={1.5}>
                {Array.from({ length: 4 }).map((_, idx) => (
                  <Skeleton key={`demos-mobile-${idx}`} variant="rounded" height={210} />
                ))}
              </Stack>
            ) : paginatedRows.length ? (
              <Stack spacing={1.5}>
                {paginatedRows.map((row) => (
                  <MobileSummaryCard
                    key={row.macAddress || row.cellphone}
                    icon={
                      <Avatar sx={{ width: 40, height: 40, bgcolor: 'secondary.light', color: 'secondary.dark', fontWeight: 700 }}>
                        {initialsFromName(row.customerName || row.email)}
                      </Avatar>
                    }
                    title={row.customerName || '-'}
                    subtitle={row.email || '-'}
                    chips={[
                      <StatusChip key="status" status={row.status} />,
                      <Chip key="app" size="small" variant="outlined" label={row.appCode || '-'} />,
                      <Chip key="expires" size="small" variant="outlined" label={`${t('demos.headers.expires', 'Expira')}: ${formatDate(row.expiresAt)}`} />
                    ]}
                    actions={
                      <ResponsiveActionBar>
                        <Button size="small" variant="outlined" onClick={() => openEditModal(row)}>
                          {t('actions.edit')}
                        </Button>
                        <RowActions
                          row={row}
                          onEdit={openEditModal}
                          onDelete={(r) => setOpenDelete({ open: true, row: r })}
                          onEmail={(r) => handleSendEmail(r)}
                        />
                      </ResponsiveActionBar>
                    }
                  >
                    <MobileFieldGrid
                      fields={[
                        { label: t('demos.headers.phone', 'Teléfono'), value: row.cellphone || '-' },
                        { label: t('demos.headers.mac', 'MAC'), value: row.macAddress || '-' },
                        { label: t('demos.headers.created', 'Creado'), value: formatDate(row.createdAt) }
                      ]}
                    />
                  </MobileSummaryCard>
                ))}
              </Stack>
            ) : (
              <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
                <Stack spacing={1} alignItems="center">
                  <Avatar sx={{ bgcolor: 'primary.lighter', color: 'primary.main' }}>
                    <AppsIcon />
                  </Avatar>
                  <Typography variant="subtitle1">{t('demos.table.empty', 'No hay demos registradas')}</Typography>
                  <Button variant="contained" onClick={openCreateModal} size="small" fullWidth>
                    {t('demos.new', 'Nueva demo')}
                  </Button>
                </Stack>
              </Paper>
            )
          }
          desktopContent={
            <TableContainer
              component={Paper}
              sx={{
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: '0 12px 24px rgba(0,0,0,0.06)',
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Table size="small" sx={{ minWidth: { xs: 1040, md: '100%' } }}>
                <TableHead>
                  <TableRow
                    sx={(theme) => ({
                      bgcolor: theme.palette.surface.sunken,
                      borderBottom: `1px solid ${theme.palette.divider}`
                    })}
                  >
                    <TableCell>{t('customers.headers.customer')}</TableCell>
                    <TableCell>{t('demos.headers.phone', 'Teléfono')}</TableCell>
                    <TableCell>{t('demos.headers.mac', 'MAC')}</TableCell>
                    <TableCell>{t('demos.headers.app', 'App')}</TableCell>
                    <TableCell>{t('demos.headers.status', 'Estado')}</TableCell>
                    <TableCell>{t('demos.headers.created', 'Creado')}</TableCell>
                    <TableCell>{t('demos.headers.expires', 'Expira')}</TableCell>
                    <TableCell>{t('invoices.headers.actions')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedRows.map((row) => (
                    <TableRow
                      key={row.macAddress || row.cellphone}
                      hover
                      sx={{
                        '&:nth-of-type(odd)': { bgcolor: 'background.default' },
                        transition: 'background 0.2s ease',
                        cursor: 'pointer'
                      }}
                    >
                      <TableCell>
                        <Stack direction="row" spacing={1.25} alignItems="center">
                          <Avatar
                            sx={{
                              width: 34,
                              height: 34,
                              bgcolor: (theme) => theme.palette.secondary.light,
                              color: (theme) => theme.palette.secondary.dark,
                              fontWeight: 700,
                              boxShadow: 2,
                              border: '1px solid',
                              borderColor: 'divider'
                            }}
                          >
                            {initialsFromName(row.customerName || row.email)}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2">{row.customerName || '-'}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {row.email || '-'}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.75} alignItems="center">
                          <Avatar
                            sx={{
                              width: 26,
                              height: 26,
                              bgcolor: 'grey.100',
                              color: 'text.secondary',
                              fontSize: 14,
                              fontWeight: 700
                            }}
                          >
                            {flagFromPhone(row.cellphone) || <PublicIcon fontSize="small" />}
                          </Avatar>
                          <Typography variant="body2">{row.cellphone || '-'}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.75} alignItems="center">
                          <LanIcon fontSize="small" color="action" />
                          <Typography variant="body2">{row.macAddress || '-'}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          icon={<AppsIcon fontSize="small" />}
                          label={row.appCode || '-'}
                          sx={(theme) => ({
                            bgcolor: theme.palette.info.lighter,
                            color: theme.palette.info.darker,
                            fontWeight: 700
                          })}
                        />
                      </TableCell>
                      <TableCell>
                        <StatusChip status={row.status} />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <AccessTimeIcon fontSize="inherit" color="action" />
                          <Typography variant="body2">{formatDate(row.createdAt)}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <AccessTimeIcon fontSize="inherit" color="warning" />
                          <Typography variant="body2">{formatDate(row.expiresAt)}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="right">
                        <RowActions
                          row={row}
                          onEdit={openEditModal}
                          onDelete={(r) => setOpenDelete({ open: true, row: r })}
                          onEmail={(r) => handleSendEmail(r)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  {!loading && filteredRows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                        <Stack spacing={1} alignItems="center">
                          <Avatar sx={{ bgcolor: 'primary.lighter', color: 'primary.main' }}>
                            <AppsIcon />
                          </Avatar>
                          <Typography variant="subtitle1">{t('demos.table.empty', 'No hay demos registradas')}</Typography>
                          <Button variant="contained" onClick={openCreateModal} size="small">
                            {t('demos.new', 'Nueva demo')}
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )}
                  {loading && (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                        <Stack spacing={1} alignItems="center">
                          <Skeleton variant="circular" width={40} height={40} />
                          <Typography variant="body2" color="text.secondary">
                            {t('demos.table.loading', 'Cargando demos...')}
                          </Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          }
          pagination={
            <TablePagination
              component="div"
              count={filteredRows.length}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={(e, p) => setPage(p)}
              onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
            />
          }
          showDivider={!isMobile}
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
            borderColor: theme.palette.primary.light,
            backgroundImage: `linear-gradient(150deg, ${theme.vars.palette.surface.card} 0%, ${theme.vars.palette.surface.muted} 100%)`,
            ...theme.applyStyles('light', {
              backgroundImage: `linear-gradient(150deg, ${theme.vars.palette.primary.light}18 0%, ${theme.vars.palette.secondary.light}08 40%, ${theme.vars.palette.background.paper} 100%)`
            })
          })
        }}
      >
        <DialogTitleWithClose
          onClose={() => setOpenModal(false)}
          sx={(theme) => ({
            pb: 1,
            background: `linear-gradient(135deg, ${theme.vars.palette.primary.main}33 0%, ${theme.vars.palette.secondary.main}1F 45%, ${theme.vars.palette.surface.card} 100%)`
          })}
        >
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Avatar
              sx={{
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                width: 40,
                height: 40,
                boxShadow: 3
              }}
            >
              {isEdit ? <EditOutlinedIcon fontSize="small" /> : <AddCircleOutlineIcon fontSize="small" />}
            </Avatar>
            <Box>
              <Typography variant="h6">
                {isEdit ? t('demos.editTitle', 'Editar demo') : t('demos.new', 'Nueva demo')}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t('demos.infoSubtitle', 'Provisiona acceso temporal con los datos del cliente.')}
              </Typography>
            </Box>
            <Chip
              label={isEdit ? t('common.edit', 'Editar') : t('common.new', 'Nueva')}
              size="small"
              color={isEdit ? 'warning' : 'success'}
              sx={{ ml: 'auto', fontWeight: 700, borderRadius: 1.5 }}
            />
          </Stack>
        </DialogTitleWithClose>

        <DialogContent
          dividers
          sx={{
            bgcolor: 'background.default',
            px: { xs: 1.5, sm: 3 },
            py: { xs: 1.5, sm: 2 },
            position: 'relative',
            background: (theme) => `linear-gradient(180deg, ${theme.vars.palette.surface.card} 0%, ${theme.vars.palette.surface.muted} 80%)`,
            ...theme.applyStyles('light', {
              background: `linear-gradient(180deg, ${theme.vars.palette.primary.light}18 0%, ${theme.vars.palette.secondary.light}10 50%, ${theme.vars.palette.background.paper} 80%)`
            }),
            '&:before': {
              content: '""',
              position: 'absolute',
              inset: 12,
              zIndex: 0,
              borderRadius: 20,
              background:
                'radial-gradient(circle at 20% 20%, rgba(33,150,243,0.10), transparent 45%), radial-gradient(circle at 80% 0%, rgba(156,39,176,0.10), transparent 35%)'
            }
          }}
        >
          <Stack spacing={2} sx={{ position: 'relative', zIndex: 1 }}>
            <SectionCard title="Configuración demo activa" helper="La demo directa usará la línea configurada para este reseller.">
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} flexWrap="wrap">
                <Chip size="small" label={`Línea: ${sourceConfig?.lineId || '-'}`} />
                <Chip size="small" label={`Cuenta: ${sourceConfig?.usernameEncode || '-'}`} />
                <Chip size="small" label={`Provider: ${sourceConfig?.provider || '-'}`} />
              </Stack>
            </SectionCard>

            <SectionCard title={t('demos.form.customer', 'Cliente')} helper={t('demos.form.customerHelper', 'Datos de contacto')}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    required
                    label={t('demos.headers.phone', 'Teléfono')}
                    value={form.cellphone}
                    onChange={(e) => setForm((p) => ({ ...p, cellphone: e.target.value }))}
                    fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIphoneIcon color="primary" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    required
                    label={t('customers.form.name', 'Nombre')}
                    value={form.customerName}
                    onChange={(e) => setForm((p) => ({ ...p, customerName: e.target.value }))}
                    fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonOutlineIcon color="secondary" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    required
                    label={t('demos.headers.email', 'Email')}
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PublicIcon color="info" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
              </Grid>
            </SectionCard>

            <SectionCard title={t('demos.form.device', 'Dispositivo')} helper={t('demos.form.deviceHelper', 'Identificador de acceso')}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    label={t('demos.form.macAddress', 'MAC Address')}
                    value={form.macAddress}
                    onChange={handleMacChange}
                    placeholder={t('demos.form.macPlaceholder', 'aa:bb:cc:dd:ee:ff')}
                    fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LanIcon color="action" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required sx={fieldSx}>
                    <InputLabel>{t('demos.headers.app', 'Aplicación')}</InputLabel>
                    <Select
                      value={form.appCode}
                      label={t('demos.headers.app', 'Aplicación')}
                      onChange={(e) => setForm((p) => ({ ...p, appCode: e.target.value }))}
                      renderValue={(val) => appOptions.find((o) => o.value === val)?.label || val}
                      startAdornment={
                        <InputAdornment position="start">
                          <AppsIcon fontSize="small" color="primary" />
                        </InputAdornment>
                      }
                    >
                      {appOptions.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </SectionCard>

            <SectionCard title={t('demos.headers.status', 'Estado')} helper={t('demos.form.stateHelper', 'Control de vigencia y notas')}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth required sx={fieldSx}>
                    <InputLabel>{t('demos.headers.status', 'Estado')}</InputLabel>
                    <Select
                      value={form.status}
                      label={t('demos.headers.status', 'Estado')}
                      onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
                    >
                      {['ACTIVE', 'ACTIVATED', 'PENDING', 'EXPIRED', 'CANCELLED'].map((s) => (
                        <MenuItem key={s} value={s}>
                          {demoStatusLabel(t, s)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={8}>
                  <TextField
                    label={t('demos.form.note', 'Nota')}
                    value={form.note}
                    onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))}
                    fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <NoteAltOutlinedIcon color="warning" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
              </Grid>
            </SectionCard>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={resetForm} startIcon={<RefreshIcon />} disabled={sending}>
            {t('actions.clear', 'Limpiar')}
          </Button>
          <Button variant="contained" onClick={handleSave} disabled={sending}>
            {sending ? t('actions.saving', 'Guardando...') : isEdit ? t('actions.saveChanges', 'Guardar cambios') : t('actions.create', 'Crear')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDelete.open} onClose={() => setOpenDelete({ open: false, row: null })} maxWidth="xs" fullWidth>
        <DialogTitleWithClose onClose={() => setOpenDelete({ open: false, row: null })}>
          {t('demos.delete.title', 'Eliminar demo')}
        </DialogTitleWithClose>
        <DialogContent dividers>
          <Typography>
            {t('demos.delete.body', '¿Eliminar la demo con MAC {{mac}}?', { mac: openDelete.row?.macAddress })}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete({ open: false, row: null })}>{t('actions.cancel')}</Button>
          <Button color="error" variant="contained" onClick={handleDelete} disabled={sending}>
            {sending ? t('actions.deleting', 'Eliminando...') : t('actions.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
