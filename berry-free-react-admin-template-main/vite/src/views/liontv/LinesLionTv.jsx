import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import useAuth from 'hooks/useAuth';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
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
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
// duplicate removed
// duplicate removed
// duplicate removed
import Card from '@mui/material/Card';
import Skeleton from '@mui/material/Skeleton';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import WifiTetheringIcon from '@mui/icons-material/WifiTethering';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import KeyIcon from '@mui/icons-material/Key';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LanIcon from '@mui/icons-material/Lan';
import BoltIcon from '@mui/icons-material/Bolt';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

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
import { lionTvApi } from 'utils/api';
import SpeedIcon from '@mui/icons-material/Speed';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import ShieldMoonIcon from '@mui/icons-material/ShieldMoon';
import PublicIcon from '@mui/icons-material/Public';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FormHelperText from '@mui/material/FormHelperText';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

const detailCardSx = {
  p: 2,
  borderRadius: 2.5,
  border: '1px solid',
  borderColor: 'divider',
  bgcolor: 'background.paper',
  boxShadow: '0 10px 24px rgba(0,0,0,0.08)',
  width: '100%',
  minWidth: 0
};

const infoCardBase = (theme) => ({
  ...detailCardSx,
  p: 2.25,
  height: '100%',
  display: 'flex',
  alignItems: 'stretch',
  width: '100%',
  background: `linear-gradient(160deg, ${theme.palette.background.paper} 0%, ${theme.palette.primary.light}08 100%)`
});

const heroCardSx = (theme) => ({
  p: 2.5,
  borderRadius: 3,
  border: '1px solid',
  borderColor: theme.palette.primary.main,
  background: `linear-gradient(135deg, ${theme.palette.primary.light}30 0%, ${theme.palette.secondary.light}18 60%, ${theme.palette.background.paper} 100%)`,
  boxShadow: '0 18px 44px rgba(0,0,0,0.14)',
  display: 'flex',
  gap: 2,
  alignItems: 'center',
  flexDirection: 'column',
  width: '100%',
  minWidth: 0
});

const pillSx = {
  borderRadius: 999,
  px: 1.5,
  py: 0.25,
  fontWeight: 700,
  letterSpacing: 0.2
};

const countryOptions = [
  { code: 'GLOBAL', label: 'Global' },
  { code: 'HN', label: 'Honduras' },
  { code: 'SV', label: 'El Salvador' },
  { code: 'GT', label: 'Guatemala' },
  { code: 'NI', label: 'Nicaragua' },
  { code: 'BZ', label: 'Belice' },
  { code: 'PA', label: 'Panamá' },
  { code: 'CR', label: 'Costa Rica' },
  { code: 'MX', label: 'México' },
  { code: 'AR', label: 'Argentina' },
  { code: 'CA', label: 'Canadá' },
  { code: 'US', label: 'Estados Unidos' },
  { code: 'ES', label: 'España' },
  { code: 'CO', label: 'Colombia' }
];

const lineProviderOptions = [
  'LION_TV',
  'TITAN',
  'NEXOLAT',
  'LION_PLUS+',
  'SPOTIFY',
  'NETFLIX',
  'AMAZON_PRIME',
  'YOUTUBE_PREMIUM',
  'DISNEY_PLUS_PREMIUM'
];

const countryLabel = (code) => countryOptions.find((c) => c.code === code)?.label || code || 'Global';

const glassCard = (theme) => ({
  p: 2.5,
  borderRadius: 3,
  border: '1px solid',
  borderColor: theme.palette.divider,
  boxShadow: '0 16px 42px rgba(0,0,0,0.14)',
  background: theme.palette.mode === 'light'
    ? `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.primary.light}15 60%, ${theme.palette.background.paper} 100%)`
    : `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.primary.dark}30 100%)`
});

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

function formatDate(value) {
  if (!value) return '-';
  const d = new Date(value.replace(' ', 'T'));
  if (!Number.isNaN(d.getTime())) return d.toLocaleString();
  return value;
}

function formatDateInput(value) {
  if (!value) return '';
  const native = new Date(value);
  if (!Number.isNaN(native.getTime())) return native.toISOString().slice(0, 10);
  if (typeof value === 'string') {
    const trimmed = value.trim();
    const match = trimmed.match(/^(\d{4})[-/](\d{2})[-/](\d{2})/);
    if (match) {
      const [, yyyy, MM, dd] = match;
      return `${yyyy}-${MM}-${dd}`;
    }
    const alt = trimmed.match(/^(\d{2})[-/](\d{2})[-/](\d{4})/);
    if (alt) {
      const [, dd, MM, yyyy] = alt;
      return `${yyyy}-${MM}-${dd}`;
    }
  }
  return '';
}

function flagFromCountry(code = '') {
  const c = (code || '').toUpperCase();
  const map = {
    HN: '🇭🇳',
    SV: '🇸🇻',
    GT: '🇬🇹',
    NI: '🇳🇮',
    BZ: '🇧🇿',
    PA: '🇵🇦',
    CR: '🇨🇷',
    MX: '🇲🇽',
    AR: '🇦🇷',
    CA: '🇨🇦',
    US: '🇺🇸',
    ES: '🇪🇸',
    CO: '🇨🇴'
  };
  return map[c] || '🌐';
}

function normalizeLine(item = {}) {
  return {
    id: item.id ?? '',
    username: item.username ?? '',
    password: item.password ?? '',
    provider: item.provider ?? 'LION_TV',
    usernameEncode: item.username_encode ?? '',
    passwordEncode: item.password_encode ?? '',
    expDate: item.exp_date ?? '',
    enabled: Boolean(item.enabled),
    enabledLabel: item.enabled_label ?? '',
    maxConnections: item.max_connections ?? 0,
    type: item.type ?? '',
    resellerNotes: item.reseller_notes ?? '',
    packageId: item.package_id ?? null,
    packageName: item.package_name ?? '',
    createdAt: item.created_at ?? '',
    ownerName: item.owner_name ?? '',
    lineCountry: item.line_country ?? item.lineCountry ?? 'GLOBAL',
    lastWatchedIp: item.last_watched_from_ip ?? '',
    lastWatchedTime: item.last_watched_stream_time ?? '',
    lastWatchedName: item.last_watched_stream_name ?? '',
    expired: Boolean(item._expired),
    trial: Boolean(item._trial)
  };
}

function StatusChip({ enabled, expired, t }) {
  const color = enabled ? (expired ? 'warning' : 'success') : 'default';
  const label = expired ? t('lines.status.expired') : enabled ? t('lines.status.active') : t('lines.status.inactive');
  return <Chip size="small" color={color} label={label} />;
}

function LineRowActions({ row, onEdit, onDelete, onDetail }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { t } = useTranslation();
  return (
    <>
      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          setAnchorEl(e.currentTarget);
        }}
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
          onClick={(e) => {
            e.stopPropagation();
            setAnchorEl(null);
            onEdit?.(row);
          }}
        >
          <EditOutlinedIcon fontSize="small" style={{ marginRight: 8, color: '#1e88e5' }} />
          {t('actions.edit', 'Edit')}
        </MenuItem>
        {onDetail ? (
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              setAnchorEl(null);
              onDetail?.(row);
            }}
          >
            <InfoOutlinedIcon fontSize="small" style={{ marginRight: 8, color: '#6d4c41' }} />
            {t('lines.detail.title', 'Detail')}
          </MenuItem>
        ) : null}
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            setAnchorEl(null);
            onDelete?.(row);
          }}
        >
          <DeleteOutlineIcon fontSize="small" style={{ marginRight: 8, color: '#e53935' }} />
          {t('actions.delete', 'Delete')}
        </MenuItem>
      </Menu>
    </>
  );
}

const defaultForm = {
  lineId: '',
  username: '',
  password: '',
  packageId: '',
  packageName: '',
  expDate: '',
  enabled: true,
  lineCountry: 'GLOBAL',
  maxConnections: '',
  resellerNotes: '',
  provider: 'LION_TV',
  _isEdit: false
};

export default function LinesLionTv() {
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
  const [search, setSearch] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [providerFilter, setProviderFilter] = useState('');
  const [detail, setDetail] = useState({ open: false, row: null });
  const [showPassword, setShowPassword] = useState(false);
  const [visibleRowPassword, setVisibleRowPassword] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [openDelete, setOpenDelete] = useState({ open: false, row: null });
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [packages, setPackages] = useState([]);
  const [packagesLoading, setPackagesLoading] = useState(false);

  const copyCredentials = useCallback(
    (row) => {
      if (!row) return;
      const text = `${row.username || ''}\n${row.password || ''}`;
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(text);
        enqueueSnackbar(t('lines.detail.copied', 'Credenciales copiadas'), { variant: 'success' });
      } else {
        enqueueSnackbar(t('lines.detail.copyFallback', 'No se pudo copiar, inténtalo manualmente'), { variant: 'warning' });
      }
    },
    [enqueueSnackbar, t]
  );

  const resetForm = () => setForm(defaultForm);

  const handleOpenCreate = () => {
    resetForm();
    setOpenModal(true);
  };

  const handleOpenEdit = (row) => {
    setForm({
      lineId: row.id || '',
      username: row.username || '',
      password: row.password || '',
      provider: row.provider || 'LION_TV',
      packageId: row.packageId || row.package_id || '',
      packageName: row.packageName || row.package_name || '',
      expDate: formatDateInput(row.expDate || row.exp_date),
      enabled: Boolean(row.enabled),
      lineCountry: row.lineCountry || 'GLOBAL',
      maxConnections: row.maxConnections || '',
      resellerNotes: row.resellerNotes || '',
      _isEdit: true
    });
    setOpenModal(true);
  };

  const handleSave = async () => {
    if (!form.lineId || !form.username || !form.password) {
      enqueueSnackbar(t('lines.form.required', 'Completa id, usuario y contraseña'), { variant: 'warning' });
      return;
    }
    setSaving(true);
    const payload = {
      lineId: form.lineId,
      username: form.username,
      password: form.password,
      provider: form.provider || 'LION_TV',
      lineCountry: form.lineCountry || 'GLOBAL',
      packageId: form.packageId ? Number(form.packageId) : null,
      packageName: form.packageName,
      expDate: form.expDate || null,
      enabled: Boolean(form.enabled),
      maxConnections: form.maxConnections ? Number(form.maxConnections) : null,
      resellerNotes: form.resellerNotes
    };
    try {
      if (form._isEdit || rows.some((r) => r.id === form.lineId)) {
        await lionTvApi.put(`/lines/v1/${form.lineId}`, payload, { headers: { Authorization: `Bearer ${accessToken}` }, skipAuthRedirect: true });
      } else {
        await lionTvApi.post('/lines/v1', payload, { headers: { Authorization: `Bearer ${accessToken}` }, skipAuthRedirect: true });
      }
      enqueueSnackbar(t('lines.form.saved', 'Línea guardada'), { variant: 'success' });
      setOpenModal(false);
      resetForm();
      setRefreshKey((v) => v + 1);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || err.message || t('lines.errors.save', 'No se pudo guardar la línea'), { variant: 'error' });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!openDelete.row?.id) {
      setOpenDelete({ open: false, row: null });
      return;
    }
    setSaving(true);
    try {
      await lionTvApi.delete(`/lines/v1/${openDelete.row.id}`, { headers: { Authorization: `Bearer ${accessToken}` }, skipAuthRedirect: true });
      enqueueSnackbar(t('lines.delete.done', 'Línea eliminada'), { variant: 'success' });
      setRefreshKey((v) => v + 1);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || err.message || t('lines.errors.delete', 'No se pudo eliminar la línea'), {
          variant: 'error'
        });
      }
    } finally {
      setSaving(false);
      setOpenDelete({ open: false, row: null });
    }
  };

  const handleUnauthorized = (err) => {
    const status = err?.response?.status || err?.request?.status;
    return status === 401;
  };

  const loadLines = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const res = await lionTvApi.get('/lines/v1/list-lines', {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { index: 0, size: 5000, start: 0, filters: '', sorting: '' },
        skipAuthRedirect: true
      });
      const payload = res?.data?.data ?? res?.data ?? {};
      const raw = payload.data ?? payload.items ?? payload.content ?? payload ?? [];
      const list = Array.isArray(raw) ? raw : [];
      const normalized = list.map(normalizeLine);
      setRows(normalized);
      setTotal(payload.rowCount ?? payload.rowTotal ?? normalized.length);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || err.message || t('lines.errors.load', 'No se pudieron cargar las líneas.'), {
          variant: 'error'
        });
      }
    } finally {
      setLoading(false);
    }
  }, [accessToken, enqueueSnackbar]);

  const loadPackages = useCallback(async () => {
    setPackagesLoading(true);
    try {
      const response = await lionTvApi.get('/packages/v1/list-packages', {
        params: { index: 0, size: 200, start: 0, filters: '', sorting: '' },
        headers: { Authorization: `Bearer ${accessToken}` },
        skipAuthRedirect: true
      });
      const list = response?.data?.data?.data || [];
      const filtered = (Array.isArray(list) ? list : []).filter(
        (pkg) => !String(pkg?.name || '').trim().toUpperCase().startsWith('DEMO')
      );
      setPackages(filtered);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(t('packages.error', 'No se pudieron cargar paquetes'), { variant: 'warning' });
      }
    } finally {
      setPackagesLoading(false);
    }
  }, [accessToken, enqueueSnackbar, t]);

  useEffect(() => {
    loadLines();
    loadPackages();
  }, [loadLines, loadPackages, refreshKey]);

  const filteredRows = useMemo(() => {
    if (!search && !statusFilter && !providerFilter) return rows;
    const term = search.toLowerCase();
    return rows.filter((row) => {
      const statusValue = row.enabled ? (row.expired ? 'EXPIRED' : 'ACTIVE') : 'INACTIVE';
      if (statusFilter && statusValue.toLowerCase() !== statusFilter.toLowerCase()) return false;
      if (providerFilter && (row.provider || '').toLowerCase() !== providerFilter.toLowerCase()) return false;
      return (
        (row.username || '').toLowerCase().includes(term) ||
        (row.packageName || '').toLowerCase().includes(term) ||
        (row.ownerName || '').toLowerCase().includes(term) ||
        (row.lastWatchedIp || '').toLowerCase().includes(term) ||
        (row.lineCountry || '').toLowerCase().includes(term) ||
        (row.enabledLabel || '').toLowerCase().includes(term)
      );
    });
  }, [rows, search, statusFilter, providerFilter]);

  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredRows.slice(start, start + rowsPerPage);
  }, [filteredRows, page, rowsPerPage]);

  useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(filteredRows.length / rowsPerPage) - 1);
    if (page > maxPage) setPage(0);
  }, [filteredRows.length, page, rowsPerPage]);

  const summary = useMemo(
    () =>
      rows.reduce(
        (acc, row) => {
          if (row.enabled) acc.enabled += 1;
          if (row.expired) acc.expired += 1;
          return acc;
        },
        { enabled: 0, expired: 0 }
      ),
    [rows]
  );

  return (
    <Box sx={{ width: '100%', maxWidth: 1400, mx: 'auto' }}>
      <MainCard
        title={t('lines.title')}
        secondary={
          <ResponsiveActionBar>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => setRefreshKey((v) => v + 1)}
              sx={{
                borderRadius: 3,
                borderWidth: 2,
                textTransform: 'none',
                fontWeight: 700,
                px: 2.5
              }}
            >
              {t('actions.refresh', 'Refresh')}
            </Button>
            <Button
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
              onClick={handleOpenCreate}
              sx={{
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 700,
                px: 2.8,
                boxShadow: '0 12px 24px rgba(0,133,255,0.35)'
              }}
              fullWidth={isMobile}
            >
              {t('lines.actions.new', 'Nueva línea')}
            </Button>
          </ResponsiveActionBar>
        }
      >
        <ResponsiveMetricGrid columns={{ xs: 1, md: 2, lg: 3 }}>
            {[
              { icon: <SpeedIcon fontSize="small" />, title: t('lines.summary.totalLabel', 'Líneas totales'), value: total, helper: t('lines.title'), color: 'primary' },
              { icon: <CloudDoneIcon fontSize="small" />, title: t('lines.summary.activeLabel', 'Activas'), value: summary.enabled, helper: t('lines.filters.status'), color: 'success' },
              { icon: <ErrorOutlineIcon fontSize="small" />, title: t('lines.summary.expiredLabel', 'Expiradas'), value: summary.expired, helper: t('lines.filters.status'), color: 'warning' }
            ].map((item, idx) => (
              <LionMetricCard {...item} key={idx} />
          ))}
        </ResponsiveMetricGrid>
      </MainCard>

      <MainCard title={null}>
        <ResponsiveFilters paperSx={{ mb: 2 }}>
            <TextField
              size="small"
              placeholder={t('lines.search')}
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
            <FormControl size="small" sx={{ minWidth: isMobile ? '100%' : 200, '& .MuiOutlinedInput-root': { minHeight: 46, borderRadius: 2 } }}>
              <InputLabel>{t('lines.filters.status')}</InputLabel>
              <Select
                value={statusFilter}
                label={t('lines.filters.status')}
                onChange={(e) => setStatusFilter(e.target.value)}
                startAdornment={
                  <InputAdornment position="start" sx={{ pl: 1 }}>
                    <FilterAltOutlinedIcon fontSize="small" color="action" />
                  </InputAdornment>
                }
              >
              <MenuItem value="">
                <em>{t('lines.filters.all')}</em>
              </MenuItem>
              {['ACTIVE', 'EXPIRED', 'INACTIVE'].map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {t(`lines.status.${opt.toLowerCase()}`, opt)}
                </MenuItem>
              ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: isMobile ? '100%' : 200, '& .MuiOutlinedInput-root': { minHeight: 46, borderRadius: 2 } }}>
              <InputLabel>{t('lines.filters.provider', 'Provider')}</InputLabel>
              <Select
                value={providerFilter}
                label={t('lines.filters.provider', 'Provider')}
                onChange={(e) => setProviderFilter(e.target.value)}
                startAdornment={
                  <InputAdornment position="start" sx={{ pl: 1 }}>
                    <FilterAltOutlinedIcon fontSize="small" color="action" />
                  </InputAdornment>
                }
              >
                <MenuItem value="">
                  <em>{t('lines.filters.all')}</em>
                </MenuItem>
                {[...new Set(rows.map((r) => r.provider).filter(Boolean))].map((p) => (
                  <MenuItem key={p} value={p}>
                    {p}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
        </ResponsiveFilters>
        <ResponsiveEntityView
          isMobile={isMobile}
          mobileContent={
            loading ? (
              <Stack spacing={1.5}>
                {Array.from({ length: 4 }).map((_, idx) => (
                  <Skeleton key={`line-mobile-${idx}`} variant="rounded" height={230} />
                ))}
              </Stack>
            ) : paginatedRows.length ? (
              <Stack spacing={1.5}>
                {paginatedRows.map((row) => (
                  <MobileSummaryCard
                    key={row.id || row.username}
                    icon={
                      <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.light', color: 'primary.dark' }}>
                        <WifiTetheringIcon fontSize="small" />
                      </Avatar>
                    }
                    title={row.username}
                    subtitle={row.usernameEncode || row.provider || 'LION_TV'}
                    chips={[
                      <StatusChip key="status" enabled={row.enabled} expired={row.expired} t={t} />,
                      <Chip key="provider" size="small" variant="outlined" label={row.provider || 'LION_TV'} />,
                      <Chip key="country" size="small" variant="outlined" label={countryLabel(row.lineCountry || 'GLOBAL')} />
                    ]}
                    actions={
                      <ResponsiveActionBar>
                        <Button size="small" variant="outlined" onClick={() => setDetail({ open: true, row })}>
                          {t('common.view', 'View')}
                        </Button>
                        <LineRowActions
                          row={row}
                          onEdit={() => handleOpenEdit(row)}
                          onDelete={() => setOpenDelete({ open: true, row })}
                          onDetail={() => setDetail({ open: true, row })}
                        />
                      </ResponsiveActionBar>
                    }
                  >
                    <MobileFieldGrid
                      fields={[
                        { label: t('lines.headers.expires'), value: formatDate(row.expDate) },
                        { label: t('lines.headers.max'), value: row.maxConnections ?? '-' },
                        { label: t('lines.headers.created'), value: formatDate(row.createdAt) },
                        { label: t('lines.detail.password'), value: row.passwordEncode || '••••••' }
                      ]}
                    />
                  </MobileSummaryCard>
                ))}
              </Stack>
            ) : (
              <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
                <Typography variant="subtitle1">{t('lines.table.empty')}</Typography>
              </Paper>
            )
          }
          desktopContent={
            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 14px 32px rgba(0,0,0,0.08)' }}>
              <Table size="small" sx={{ minWidth: { xs: 1320, md: '100%' } }}>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('lines.headers.user')}</TableCell>
                    <TableCell>{t('lines.headers.provider', 'Provider')}</TableCell>
                    <TableCell>{t('lines.headers.country', 'País')}</TableCell>
                    <TableCell>{t('lines.headers.status')}</TableCell>
                    <TableCell>{t('lines.headers.expires')}</TableCell>
                    <TableCell>{t('lines.headers.max')}</TableCell>
                    <TableCell>{t('lines.headers.created')}</TableCell>
                    <TableCell>{t('lines.headers.actions')}</TableCell>
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
                      <TableRow key={row.id || row.username} hover sx={{ cursor: 'pointer' }} onClick={() => setDetail({ open: true, row })}>
                        <TableCell>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light', color: 'primary.dark' }}>
                              <WifiTetheringIcon fontSize="small" />
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2">{row.username}</Typography>
                              <Tooltip title={`${t('lines.detail.password')}: ${visibleRowPassword[row.id || row.username] ? row.password : '••••••'}`}>
                                <Stack direction="row" spacing={0.5} alignItems="center">
                                  <KeyIcon fontSize="inherit" color="action" />
                                  <Typography variant="caption" color="text.secondary">
                                    {visibleRowPassword[row.id || row.username] ? row.passwordEncode || row.password : '••••••'}
                                  </Typography>
                                  <IconButton
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setVisibleRowPassword((prev) => ({
                                        ...prev,
                                        [row.id || row.username]: !prev[row.id || row.username]
                                      }));
                                    }}
                                  >
                                    {visibleRowPassword[row.id || row.username] ? (
                                      <VisibilityOffIcon fontSize="inherit" />
                                    ) : (
                                      <VisibilityIcon fontSize="inherit" />
                                    )}
                                  </IconButton>
                                </Stack>
                              </Tooltip>
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={row.provider || 'LION_TV'}
                            variant="outlined"
                            sx={(theme) => ({
                              fontWeight: 700,
                              letterSpacing: 0.35,
                              textTransform: 'uppercase',
                              borderRadius: 1.5,
                              borderColor: theme.palette.info.main,
                              color: theme.palette.info.main,
                              background: theme.palette.mode === 'light' ? theme.palette.info.light + '1f' : theme.palette.background.paper,
                              height: 22,
                              px: 0.9
                            })}
                          />
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
                              {flagFromCountry(row.lineCountry)}
                            </Avatar>
                            <Typography variant="body2">{countryLabel(row.lineCountry || 'GLOBAL')}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <StatusChip enabled={row.enabled} expired={row.expired} t={t} />
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <CalendarMonthIcon fontSize="small" color="error" />
                            <Typography variant="body2">{formatDate(row.expDate)}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <SpeedIcon fontSize="small" color="secondary" />
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                              {row.maxConnections ?? '-'}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <CalendarMonthIcon fontSize="small" color="action" />
                            <Typography variant="body2">{formatDate(row.createdAt)}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="right">
                          <LineRowActions
                            row={row}
                            onEdit={() => handleOpenEdit(row)}
                            onDelete={() => setOpenDelete({ open: true, row })}
                            onDetail={() => setDetail({ open: true, row })}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  {!loading && paginatedRows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        {t('lines.table.empty')}
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
        open={detail.open}
        onClose={() => setDetail({ open: false, row: null })}
        fullWidth
        maxWidth="md"
        fullScreen={isMobile}
        PaperProps={{
          sx: (theme) => ({
            borderRadius: 3,
            boxShadow: '0 18px 40px rgba(0,0,0,0.18)',
            border: '1px solid',
            borderColor: theme.palette.primary.light,
            backgroundImage:
              theme.palette.mode === 'light'
                ? `linear-gradient(150deg, ${theme.palette.primary.light}18 0%, ${theme.palette.secondary.light}08 45%, ${theme.palette.background.paper} 100%)`
                : undefined
          })
        }}
      >
        <DialogTitleWithClose
          onClose={() => setDetail({ open: false, row: null })}
          sx={(theme) => ({
            pb: 1,
            background: `linear-gradient(135deg, ${theme.palette.primary.light}36 0%, ${theme.palette.secondary.light}26 40%, ${theme.palette.background.paper} 100%)`
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
              <WifiTetheringIcon fontSize="small" />
            </Avatar>
            <Box>
              <Typography variant="h6">{t('lines.detail.title')}</Typography>
              <Typography variant="caption" color="text.secondary">
                {detail.row?.username || '-'}
              </Typography>
            </Box>
            <Chip
              label={detail.row?.trial ? t('lines.status.trial') : t('lines.status.active')}
              size="small"
              color={detail.row?.trial ? 'info' : 'success'}
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
            background: (theme) =>
              theme.palette.mode === 'light'
                ? `linear-gradient(180deg, ${theme.palette.primary.light}14 0%, ${theme.palette.secondary.light}10 50%, ${theme.palette.background.paper} 80%)`
                : theme.palette.surface.card,
            position: 'relative',
            '&:before': {
              content: '\"\"',
              position: 'absolute',
              inset: 12,
              zIndex: 0,
              borderRadius: 20,
              background:
                'radial-gradient(circle at 20% 20%, rgba(33,150,243,0.10), transparent 45%), radial-gradient(circle at 82% 0%, rgba(156,39,176,0.10), transparent 35%)'
            }
          }}
        >
          <Stack spacing={2.25} sx={{ position: 'relative', zIndex: 1 }}>
            <Box
              sx={(theme) => ({
                ...heroCardSx(theme),
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: { xs: 'flex-start', md: 'center' }
              })}
            >
              <Avatar
                sx={{
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  width: 52,
                  height: 52,
                  boxShadow: 5
                }}
              >
                <KeyIcon fontSize="medium" />
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0, width: '100%' }}>
                <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1 }}>
                  {t('lines.detail.user')}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1.1, overflowWrap: 'anywhere' }}>
                  {detail.row?.username || '-'}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" useFlexGap sx={{ mt: 0.5, flexWrap: 'wrap', minWidth: 0 }}>
                  <Chip
                    label={`${t('lines.detail.password')}: ${showPassword ? detail.row?.password || '-' : '••••••'}`}
                    size="small"
                    variant="outlined"
                    color="secondary"
                    sx={{ borderRadius: 2 }}
                    icon={
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowPassword((v) => !v);
                        }}
                      >
                        {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                      </IconButton>
                    }
                  />
                  {detail.row?.ownerName ? (
                    <Chip
                      icon={<PersonOutlineIcon fontSize="small" />}
                      label={detail.row.ownerName}
                      size="small"
                      variant="outlined"
                      sx={{ borderRadius: 2 }}
                    />
                  ) : null}
                </Stack>
              </Box>
              <Stack
                spacing={1}
                direction="column"
                alignItems={{ xs: 'stretch', md: 'flex-end' }}
                justifyContent="center"
                sx={{ width: { xs: '100%', md: 'auto' } }}
              >
                <Chip
                  label={detail.row?.enabled ? t('lines.status.active') : t('lines.status.inactive')}
                  color={detail.row?.enabled ? 'success' : 'default'}
                  size="small"
                  sx={{ ...pillSx, alignSelf: { xs: 'flex-start', md: 'auto' } }}
                />
                {detail.row?.trial ? (
                  <Chip size="small" color="info" label={t('lines.status.trial')} sx={{ ...pillSx, alignSelf: { xs: 'flex-start', md: 'auto' } }} />
                ) : null}
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<ContentCopyIcon fontSize="small" />}
                  onClick={() => copyCredentials(detail.row)}
                  sx={{ borderRadius: 2, textTransform: 'none', width: { xs: '100%', md: 'auto' } }}
                >
                  {t('lines.detail.copy', 'Copiar')}
                </Button>
              </Stack>
            </Box>

            <Box
              sx={{
                display: 'grid',
                gap: 2,
                width: '100%',
                minWidth: 0,
                justifyItems: 'stretch',
                gridTemplateColumns: { xs: '1fr', xl: 'repeat(2, minmax(0, 1fr))' }
              }}
            >
              <Box sx={{ width: '100%', minWidth: 0 }}>
                <Box
                  sx={(theme) => ({
                    ...infoCardBase(theme),
                    background: `linear-gradient(160deg, ${theme.palette.warning.light}22 0%, ${theme.palette.background.paper} 90%)`
                  })}
                >
                  <Stack direction="row" alignItems="center" spacing={1.5} sx={{ width: '100%' }}>
                    <Avatar sx={{ bgcolor: 'warning.light', color: 'warning.dark', width: 36, height: 36 }}>
                      <BoltIcon fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography variant="overline" color="text.secondary">
                        {t('lines.detail.package')}
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                        {detail.row?.packageName || t('lines.detail.noPackage', 'No package')}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5, flexWrap: 'wrap' }}>
                        <Chip size="small" label={`${t('common.id', 'ID')}: ${detail.row?.packageId ?? '-'}`} variant="outlined" />
                        <Chip size="small" label={`${t('lines.detail.type')}: ${detail.row?.type || '-'}`} color="primary" variant="outlined" />
                      </Stack>
                    </Box>
                  </Stack>
                </Box>
              </Box>

              <Box sx={{ width: '100%', minWidth: 0 }}>
                <Box
                  sx={(theme) => ({
                    ...infoCardBase(theme),
                    background: `linear-gradient(160deg, ${theme.palette.success.light}18 0%, ${theme.palette.background.paper} 92%)`
                  })}
                >
                  <Stack direction="row" alignItems="center" spacing={1.5} sx={{ width: '100%' }}>
                    <Avatar sx={{ bgcolor: 'success.light', color: 'success.dark', width: 36, height: 36 }}>
                      <LanIcon fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography variant="overline" color="text.secondary">
                        {t('lines.headers.max')}
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                        {detail.row?.maxConnections ?? '-'}
                      </Typography>
                      <Chip
                        size="small"
                        label={`${t('lines.headers.status')}: ${detail.row?.enabledLabel || '-'}`}
                        variant="outlined"
                        color={detail.row?.enabled ? 'success' : 'default'}
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                  </Stack>
                </Box>
              </Box>

              <Box sx={{ width: '100%', minWidth: 0 }}>
                <Box
                  sx={(theme) => ({
                    ...infoCardBase(theme),
                    background: `linear-gradient(160deg, ${theme.palette.info.light}18 0%, ${theme.palette.background.paper} 92%)`
                  })}
                >
                  <Stack direction="row" alignItems="center" spacing={1.5} sx={{ width: '100%' }}>
                    <Avatar sx={{ bgcolor: 'info.light', color: 'info.dark', width: 36, height: 36 }}>
                      <AccessTimeIcon fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography variant="overline" color="text.secondary">
                        {t('lines.detail.expires')}
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                        {formatDate(detail.row?.expDate)}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Box>

              <Box sx={{ width: '100%', minWidth: 0 }}>
                <Box
                  sx={(theme) => ({
                    ...infoCardBase(theme),
                    background: `linear-gradient(160deg, ${theme.palette.secondary.light}18 0%, ${theme.palette.background.paper} 92%)`
                  })}
                >
                  <Stack direction="row" alignItems="center" spacing={1.5} sx={{ width: '100%' }}>
                    <Avatar sx={{ bgcolor: 'secondary.light', color: 'secondary.dark', width: 36, height: 36 }}>
                      <CalendarMonthIcon fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography variant="overline" color="text.secondary">
                        {t('lines.detail.created')}
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                        {formatDate(detail.row?.createdAt)}
                      </Typography>
                      <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mt: 0.25 }}>
                        <PersonOutlineIcon fontSize="inherit" color="action" />
                        <Typography variant="caption" color="text.secondary">
                          {t('lines.detail.owner')}: {detail.row?.ownerName || '-'}
                        </Typography>
                      </Stack>
                    </Box>
                  </Stack>
                </Box>
              </Box>
            </Box>

            <Box
              sx={(theme) => ({
                ...detailCardSx,
                borderStyle: 'dashed',
                mt: 2,
                p: 2.25,
                background: `linear-gradient(145deg, ${theme.palette.primary.light}10 0%, ${theme.palette.background.paper} 100%)`
              })}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar sx={{ bgcolor: 'primary.lighter', color: 'primary.dark', width: 36, height: 36 }}>
                  <AccessTimeIcon fontSize="small" />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="overline" color="text.secondary">
                    {t('lines.detail.lastStreamLabel')}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                    {detail.row?.lastWatchedName || t('lines.detail.noStream', 'No recent stream')}
                  </Typography>
                  <Stack direction="row" spacing={1.5} useFlexGap sx={{ mt: 0.5, flexWrap: 'wrap' }}>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <AccessTimeIcon fontSize="inherit" color="action" />
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(detail.row?.lastWatchedTime)}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <PublicIcon fontSize="inherit" color="action" />
                      <Typography variant="caption" color="text.secondary">
                        {detail.row?.lastWatchedIp || '-'}
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>
              </Stack>
            </Box>

            {detail.row?.resellerNotes ? (
              <Box
                sx={{
                  ...detailCardSx,
                  borderStyle: 'dashed',
                  gap: 0.5,
                  mt: 2
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  {t('lines.detail.notes')}
                </Typography>
                <Typography variant="body2">{detail.row.resellerNotes}</Typography>
              </Box>
            ) : null}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setDetail({ open: false, row: null })} variant="outlined" startIcon={<CloseIcon />}>
            {t('lines.detail.close')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* CREATE / EDIT LINE */}
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
            overflow: 'hidden',
            border: '1px solid',
            borderColor: form._isEdit ? theme.palette.warning.light : theme.palette.primary.light,
            backgroundImage:
              theme.palette.mode === 'light'
                ? `linear-gradient(150deg, ${theme.palette.primary.light}16 0%, ${theme.palette.secondary.light}10 45%, ${theme.palette.background.paper} 100%)`
                : undefined
          })
        }}
      >
        <DialogTitle
          sx={(theme) => ({
            position: 'relative',
            pr: 5,
            background: `linear-gradient(135deg, ${theme.palette.primary.light}28 0%, ${theme.palette.secondary.light}20 45%, ${theme.palette.background.paper} 100%)`,
            pb: 1
          })}
        >
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Avatar
              sx={{
                bgcolor: form._isEdit ? 'warning.main' : 'primary.main',
                color: 'common.white',
                width: 40,
                height: 40,
                boxShadow: 4
              }}
            >
              <LanIcon fontSize="small" />
            </Avatar>
            <Box>
              <Typography variant="h6">
                {form._isEdit ? t('lines.actions.edit', 'Editar línea') : t('lines.actions.new', 'Nueva línea')}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t('lines.form.helper', 'Credenciales y paquete de la línea')}
              </Typography>
            </Box>
            <Chip
              label={form._isEdit ? t('common.edit', 'Edit') : t('common.new', 'New')}
              size="small"
              color={form._isEdit ? 'warning' : 'success'}
              sx={{ ml: 'auto', fontWeight: 700, borderRadius: 1.5 }}
            />
            <IconButton
              size="small"
              onClick={() => setOpenModal(false)}
              sx={{ position: 'absolute', right: 12, top: 12 }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
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
                ? `linear-gradient(180deg, ${theme.palette.primary.light}14 0%, ${theme.palette.secondary.light}10 50%, ${theme.palette.background.paper} 82%)`
                : theme.palette.surface.card,
            position: 'relative',
            '&:before': {
              content: '\"\"',
              position: 'absolute',
              inset: 12,
              zIndex: 0,
              borderRadius: 20,
              background:
                'radial-gradient(circle at 20% 20%, rgba(33,150,243,0.10), transparent 45%), radial-gradient(circle at 82% 0%, rgba(156,39,176,0.10), transparent 35%)'
            }
          }}
        >
          <Stack spacing={2} sx={{ position: 'relative', zIndex: 1 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                icon={<AutoAwesomeIcon fontSize="small" color={form._isEdit ? 'warning' : 'primary'} />}
                label={form._isEdit ? t('subscriptions.badge.edit', 'Editing') : t('subscriptions.badge.new', 'New')}
                color={form._isEdit ? 'warning' : 'primary'}
                variant="outlined"
                sx={{ fontWeight: 700, borderRadius: 1.5, boxShadow: 1 }}
              />
              <Typography variant="caption" color="text.secondary">
                {t('lines.form.helper', 'Credenciales y paquete de la línea')}
              </Typography>
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} flexWrap="wrap">
              <Chip
                icon={<LanIcon fontSize="small" />}
                label={form.lineId || t('lines.form.id', 'Line ID')}
                variant="outlined"
                color={form.lineId ? 'primary' : 'default'}
              />
              <Chip
                icon={<BoltIcon fontSize="small" />}
                label={form.packageId ? form.packageName || form.packageId : t('lines.form.packageId', 'Package')}
                variant="outlined"
                color={form.packageId ? 'warning' : 'default'}
              />
              <Chip
                icon={<ShieldMoonIcon fontSize="small" />}
                label={form.enabled ? t('lines.status.active') : t('lines.status.inactive')}
                variant="outlined"
                color={form.enabled ? 'success' : 'default'}
              />
              <Chip
                icon={<LanIcon fontSize="small" />}
                label={form.provider || 'LION_TV'}
                variant="outlined"
                color="info"
              />
            </Stack>

            <SectionCard
              title={t('lines.form.access', 'Acceso')}
              helper={t('lines.form.accessHelper', 'ID, usuario, contraseña y estado')}
            >
              <Box
                sx={{
                  display: 'grid',
                  gap: 2,
                  gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, minmax(0, 1fr))' }
                }}
              >
                <Box>
                  <FormControl fullWidth required sx={fieldSx}>
                    <InputLabel shrink>{t('lines.form.provider', 'Provider')}</InputLabel>
                    <Select
                      displayEmpty
                      value={form.provider}
                      label={t('lines.form.provider', 'Provider')}
                      onChange={(e) => setForm((p) => ({ ...p, provider: e.target.value }))}
                      renderValue={(value) => (
                        <Stack direction="row" spacing={1} alignItems="center">
                          <LanIcon fontSize="small" color="info" />
                          <Typography variant="body2" color={value ? 'text.primary' : 'text.secondary'}>
                            {value || 'LION_TV'}
                          </Typography>
                        </Stack>
                      )}
                    >
                      {lineProviderOptions.map((providerOption) => (
                        <MenuItem key={providerOption} value={providerOption}>
                          {providerOption}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <Box>
                  <TextField
                    label={t('lines.form.id', 'Line ID')}
                    value={form.lineId}
                    onChange={(e) => setForm((p) => ({ ...p, lineId: e.target.value }))}
                    fullWidth
                    required
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LanIcon color="primary" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FormControlLabel
                    control={<Switch checked={form.enabled} onChange={(e) => setForm((p) => ({ ...p, enabled: e.target.checked }))} color="success" />}
                    label={form.enabled ? t('lines.status.active') : t('lines.status.inactive')}
                  />
                </Box>
                <Box>
                  <FormControl fullWidth sx={fieldSx}>
                    <InputLabel shrink>{t('lines.form.country', 'País')}</InputLabel>
                    <Select
                      displayEmpty
                      value={form.lineCountry}
                      label={t('lines.form.country', 'País')}
                      onChange={(e) => setForm((p) => ({ ...p, lineCountry: e.target.value }))}
                      renderValue={(value) => (
                        <Stack direction="row" spacing={1} alignItems="center">
                          <PublicIcon fontSize="small" color="primary" />
                          <Typography variant="body2" color={value ? 'text.primary' : 'text.secondary'}>
                            {countryLabel(value || 'GLOBAL')}
                          </Typography>
                        </Stack>
                      )}
                    >
                      {countryOptions.map((opt) => (
                        <MenuItem key={opt.code} value={opt.code}>
                          {opt.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <Box>
                  <TextField
                    label={t('lines.form.username', 'Username')}
                    value={form.username}
                    onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
                    fullWidth
                    required
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonOutlineIcon color="action" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Box>
                <Box>
                  <TextField
                    label={t('lines.form.password', 'Password')}
                    value={form.password}
                    onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                    fullWidth
                    required
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <KeyIcon color="action" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Box>
              </Box>
            </SectionCard>

            <SectionCard
              title={t('lines.form.packageId', 'Paquete')}
              helper={t('lines.form.packageHelper', 'Selecciona el paquete y conexiones máximas')}
            >
              <Box
                sx={{
                  display: 'grid',
                  gap: 2,
                  gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, minmax(0, 1fr))' }
                }}
              >
                <Box>
                  <FormControl fullWidth required sx={fieldSx} disabled={packagesLoading}>
                    <InputLabel shrink>{t('lines.form.packageId', 'Package')}</InputLabel>
                    <Select
                      displayEmpty
                      value={form.packageId}
                      label={t('lines.form.packageId', 'Package')}
                      onChange={(e) => {
                        const pkg = packages.find((p) => String(p.id ?? p.packageId ?? p.package_id) === String(e.target.value));
                        setForm((p) => ({
                          ...p,
                          packageId: e.target.value,
                          packageName: pkg?.name || pkg?.packageName || pkg?.package_name || p.packageName
                        }));
                      }}
                      renderValue={(value) => {
                        const pkg = packages.find((p) => String(p.id ?? p.packageId ?? p.package_id) === String(value));
                        const label = pkg ? pkg.name || `Package ${pkg.id}` : value || t('common.selectOption', 'Select an option');
                        return (
                          <Stack direction="row" spacing={1} alignItems="center">
                            <BoltIcon fontSize="small" color="warning" />
                            <Typography variant="body2" color={value ? 'text.primary' : 'text.secondary'}>
                              {label}
                            </Typography>
                          </Stack>
                        );
                      }}
                    >
                      <MenuItem value="">
                        <em>{t('common.selectOption', 'Select an option')}</em>
                      </MenuItem>
                      {packages.map((pkg) => {
                        const id = pkg.id ?? pkg.packageId ?? pkg.package_id;
                        const name = pkg.name ?? pkg.packageName ?? pkg.package_name ?? `Package ${id}`;
                        return (
                          <MenuItem key={id} value={String(id)}>
                            <Stack direction="row" spacing={0.75} alignItems="center">
                              <Avatar sx={{ width: 22, height: 22, bgcolor: '#ffd54f', color: '#bf8f00' }}>
                                <BoltIcon fontSize="inherit" />
                              </Avatar>
                              <Typography variant="body2">{name}</Typography>
                            </Stack>
                          </MenuItem>
                        );
                      })}
                    </Select>
                    <FormHelperText>
                      {packagesLoading
                        ? t('subscriptions.form.loadingPackages', 'Loading packages...')
                        : t('subscriptions.form.packagesHint', 'Packages (DEMO excluded)')}
                    </FormHelperText>
                  </FormControl>
                </Box>
                <Box>
                  <TextField
                    label={t('lines.form.maxConnections', 'Max connections')}
                    type="number"
                    value={form.maxConnections}
                    onChange={(e) => setForm((p) => ({ ...p, maxConnections: e.target.value }))}
                    fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SpeedIcon color="secondary" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Box>
              </Box>
            </SectionCard>

            <SectionCard
              title={t('lines.form.meta', 'Vigencia y notas')}
              helper={t('lines.form.metaHelper', 'Fecha de expiración y notas internas')}
            >
              <Box
                sx={{
                  display: 'grid',
                  gap: 2,
                  gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, minmax(0, 1fr))' }
                }}
              >
                <Box>
                  <TextField
                    label={t('lines.form.expDate', 'Expire date')}
                    type="date"
                    value={form.expDate}
                    onChange={(e) => setForm((p) => ({ ...p, expDate: e.target.value }))}
                    fullWidth
                    sx={fieldSx}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarMonthIcon color="action" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Box>
              </Box>
              <TextField
                label={t('lines.form.notes', 'Reseller notes')}
                value={form.resellerNotes}
                onChange={(e) => setForm((p) => ({ ...p, resellerNotes: e.target.value }))}
                fullWidth
                multiline
                minRows={2}
                sx={{ mt: 2, ...fieldSx }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <NoteAltIcon color="primary" />
                    </InputAdornment>
                  )
                }}
              />
            </SectionCard>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button variant="outlined" onClick={resetForm} disabled={saving} sx={{ borderRadius: 2 }} startIcon={<RefreshIcon />}>
            {t('common.clear', 'Clear')}
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving}
            startIcon={<RocketLaunchIcon />}
            sx={{ borderRadius: 2, boxShadow: '0 12px 28px rgba(0,0,0,0.16)', px: 2.4 }}
          >
            {saving
              ? t('common.saving', 'Saving...')
              : form._isEdit
                ? t('common.saveChanges', 'Save changes')
                : t('common.create', 'Create')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDelete.open} onClose={() => setOpenDelete({ open: false, row: null })} maxWidth="xs" fullWidth>
        <DialogTitleWithClose onClose={() => setOpenDelete({ open: false, row: null })}>
          {t('lines.delete.title', 'Eliminar línea')}
        </DialogTitleWithClose>
        <DialogContent dividers>
          <Typography>{t('lines.delete.body', '¿Eliminar la línea {{id}}?', { id: openDelete.row?.id })}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete({ open: false, row: null })}>{t('actions.cancel')}</Button>
          <Button color="error" variant="contained" onClick={handleDelete} disabled={saving}>
            {saving ? t('actions.deleting', 'Eliminando...') : t('actions.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
