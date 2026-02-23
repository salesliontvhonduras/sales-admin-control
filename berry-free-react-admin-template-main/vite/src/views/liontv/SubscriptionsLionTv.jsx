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
import Card from '@mui/material/Card';
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
import Menu from '@mui/material/Menu';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PriceChangeIcon from '@mui/icons-material/PriceChange';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import WifiTetheringIcon from '@mui/icons-material/WifiTethering';
import BoltIcon from '@mui/icons-material/Bolt';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import Skeleton from '@mui/material/Skeleton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';
import LinkIcon from '@mui/icons-material/Link';

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

const glassCard = (theme) => ({
  p: 2,
  borderRadius: 2.5,
  border: '1px solid',
  borderColor: 'divider',
  boxShadow: '0 14px 34px rgba(0,0,0,0.10)',
  background:
    theme.palette.mode === 'light'
      ? `linear-gradient(135deg, ${theme.palette.primary.light}18 0%, ${theme.palette.secondary.light}12 45%, #ffffff 100%)`
      : theme.palette.background.default
});

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

function RowActions({ row, onEdit, onDelete }) {
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
          '&:hover': { bgcolor: theme.palette.primary.light },
          boxShadow: '0 6px 12px rgba(0,0,0,0.12)'
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
          {t('actions.edit', 'Edit')}
        </MenuItem>
        <MenuItem
          onClick={() => {
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

function formatDateInput(value) {
  if (!value) return '';

  // 1) Intento nativo
  const native = new Date(value);
  if (!Number.isNaN(native.getTime())) return native.toISOString().slice(0, 10);

  // 2) Formatos dd-MM-yyyy o dd/MM/yyyy, con o sin hora
  if (typeof value === 'string') {
    const trimmed = value.trim();
    const match = trimmed.match(/^(\d{2})[-/](\d{2})[-/](\d{4})/);
    if (match) {
      const [, dd, MM, yyyy] = match;
      return `${yyyy}-${MM}-${dd}`; // yyyy-MM-dd
    }
    // fallback: primeros 10 caracteres si parecen fecha
    if (trimmed.length >= 10) return trimmed.slice(0, 10);
  }

  return '';
}

function normalizeDateOnly(value) {
  const iso = formatDateInput(value);
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  d.setHours(0, 0, 0, 0);
  return d;
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
  const [renewalFilter, setRenewalFilter] = useState(''); // '', 'today', 'tomorrow'
  const [renewalSort, setRenewalSort] = useState('asc'); // asc | desc

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

  const packageMap = useMemo(() => {
    const map = {};
    packages.forEach((p) => {
      const rawId = p.id ?? p.packageId ?? p.package_id ?? p.packageID;
      if (!rawId) return;
      const id = String(rawId);
      map[id] = {
        name: p.name || p.packageName || `Package ${id}`,
        description: p.description || p.packageDescription || ''
      };
    });
    return map;
  }, [packages]);

  const lineNameMap = useMemo(() => {
    const map = {};
    lines.forEach((l) => {
      const rawId = l.id ?? l.lineId ?? l.line_id ?? l.username;
      if (!rawId) return;
      const id = String(rawId);
      map[id] = l.username || l.username_line || l.usernameLine || l.name || id;
    });
    return map;
  }, [lines]);

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

  // enriquecer filas con nombres de línea y paquete cuando lleguen los catálogos
  useEffect(() => {
    if ((!lineNameMap || Object.keys(lineNameMap).length === 0) && (!packageMap || Object.keys(packageMap).length === 0)) return;
    setRows((prev) =>
      prev.map((row) => {
        const lineLabel =
          lineNameMap[String(row.lineId ?? row.username_line ?? '')] ||
          row.username_line ||
          row.lineId ||
          '';
        const pkgInfo = packageMap[String(row.packageId ?? '')] || {};
        return {
          ...row,
          username_line: lineLabel,
          packageName: pkgInfo.name || row.packageId,
          packageDescription: pkgInfo.description || ''
        };
      })
    );
  }, [lineNameMap, packageMap]);

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
    const term = search.toLowerCase();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const filtered = rows.filter((row) => {
      if (statusFilter && (row.status || '').toLowerCase() !== statusFilter.toLowerCase()) return false;
      const matchesSearch =
        !term ||
        String(row.customerId || '').toLowerCase().includes(term) ||
        (row.customerName || row.customer_name || '').toLowerCase().includes(term) ||
        (row.lineId || '').toLowerCase().includes(term) ||
        (row.billing || '').toLowerCase().includes(term) ||
        (row.status || '').toLowerCase().includes(term) ||
        String(row.packageId || '').toLowerCase().includes(term);
      if (!matchesSearch) return false;

      if (!renewalFilter) return true;
      const d = normalizeDateOnly(row.renewalDate);
      if (!d) return false;
      if (renewalFilter === 'today') return d.getTime() === today.getTime();
      if (renewalFilter === 'tomorrow') return d.getTime() === tomorrow.getTime();
      return true;
    });

    const sorted = [...filtered].sort((a, b) => {
      const da = normalizeDateOnly(a.renewalDate);
      const db = normalizeDateOnly(b.renewalDate);
      const ta = da ? da.getTime() : Number.POSITIVE_INFINITY;
      const tb = db ? db.getTime() : Number.POSITIVE_INFINITY;
      return renewalSort === 'asc' ? ta - tb : tb - ta;
    });

    return sorted;
  }, [rows, search, statusFilter, renewalFilter, renewalSort]);

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
        enqueueSnackbar(t('messages.welcome'), { variant: 'success' });
      } else {
        await lionTvApi.post('/subscriptions/v1', payload, {
          headers: { Authorization: `Bearer ${accessToken}` },
          skipAuthRedirect: true
        });
        enqueueSnackbar(t('messages.welcome'), { variant: 'success' });
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
      enqueueSnackbar(t('messages.welcome'), { variant: 'success' });
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
        title={t('subscriptions.title')}
        secondary={
          <Stack direction="row" spacing={1}>
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
              onClick={() => setOpenModal(true)}
              sx={{
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 700,
                px: 2.8,
                boxShadow: '0 12px 24px rgba(0,133,255,0.35)'
              }}
            >
              {t('subscriptions.actions.new', 'New subscription')}
            </Button>
          </Stack>
        }
      >
        <Grid container spacing={gridSpacing}>
            {[
              { label: `${total} ${t('subscriptions.title').toLowerCase()}`, color: '#1e88ff', icon: <CreditCardIcon fontSize="small" /> },
              { label: `STATUS: ACTIVE ${rows.filter((r) => r.status === 'ACTIVE').length}`, color: '#00c853', icon: <AutoAwesomeIcon fontSize="small" /> },
              { label: `${t('subscriptions.headers.autopay')}: ${rows.filter((r) => r.automaticPay).length}`, color: '#ffd54f', icon: <PriceChangeIcon fontSize="small" /> }
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
                      : theme.palette.background.paper,
                  boxShadow: '0 14px 34px rgba(0,0,0,0.10)',
                  borderRadius: 2.5,
                  border: '1px solid',
                  borderColor: 'divider'
                })}
              >
                <Avatar
                  sx={(theme) => ({
                    width: 40,
                    height: 40,
                    bgcolor: item.color,
                    color: '#fff',
                    boxShadow: '0 10px 18px rgba(0,0,0,0.16)',
                    border: '2px solid',
                    borderColor: 'background.paper'
                  })}
                >
                  {item.icon}
                </Avatar>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#2d3748' }}>
                  {item.label}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </MainCard>

      <MainCard title={null}>
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
              placeholder={t('subscriptions.search')}
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
            <FormControl size="small" sx={{ minWidth: { xs: '100%', md: 200 }, '& .MuiOutlinedInput-root': { minHeight: 46, borderRadius: 2 } }}>
              <InputLabel>{t('subscriptions.filters.status')}</InputLabel>
              <Select
                value={statusFilter}
                label={t('subscriptions.filters.status')}
                onChange={(e) => setStatusFilter(e.target.value)}
                startAdornment={
                  <InputAdornment position="start" sx={{ pl: 1 }}>
                    <FilterAltOutlinedIcon fontSize="small" color="action" />
                  </InputAdornment>
                }
              >
                <MenuItem value="">
                  <em>{t('subscriptions.filters.all')}</em>
                </MenuItem>
                {[...new Set(rows.map((r) => r.status).filter(Boolean))].map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} flexShrink={0}>
              <Button
                variant={renewalFilter === 'today' ? 'contained' : 'outlined'}
                color="error"
                onClick={() => setRenewalFilter((v) => (v === 'today' ? '' : 'today'))}
                startIcon={<CalendarMonthIcon />}
                sx={{ minHeight: 46, borderRadius: 2, textTransform: 'none' }}
              >
                {t('subscriptions.filters.today', 'Vence hoy')}
              </Button>
              <Button
                variant={renewalFilter === 'tomorrow' ? 'contained' : 'outlined'}
                color="warning"
                onClick={() => setRenewalFilter((v) => (v === 'tomorrow' ? '' : 'tomorrow'))}
                startIcon={<CalendarMonthIcon />}
                sx={{ minHeight: 46, borderRadius: 2, textTransform: 'none' }}
              >
                {t('subscriptions.filters.tomorrow', 'Vence mañana')}
              </Button>
              <FormControl size="small" sx={{ minWidth: { xs: '100%', md: 160 }, '& .MuiOutlinedInput-root': { minHeight: 46, borderRadius: 2 } }}>
                <InputLabel>{t('subscriptions.filters.sortRenewal', 'Orden fecha')}</InputLabel>
                <Select
                  value={renewalSort}
                  label={t('subscriptions.filters.sortRenewal', 'Orden fecha')}
                  onChange={(e) => setRenewalSort(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start" sx={{ pl: 1 }}>
                      <CalendarMonthIcon fontSize="small" color="action" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="asc">{t('subscriptions.filters.asc', 'Más cercanas')}</MenuItem>
                  <MenuItem value="desc">{t('subscriptions.filters.desc', 'Más lejanas')}</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Stack>
        </Box>
        <TableContainer component={Paper}>
          <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t('subscriptions.headers.id')}</TableCell>
                  <TableCell>{t('subscriptions.headers.customer')}</TableCell>
                  <TableCell>{t('subscriptions.headers.line')}</TableCell>
                  <TableCell>{t('subscriptions.headers.package')}</TableCell>
                  <TableCell>{t('subscriptions.headers.status')}</TableCell>
                  <TableCell>{t('subscriptions.headers.amount')}</TableCell>
                  <TableCell>{t('subscriptions.headers.start')}</TableCell>
                  <TableCell>{t('subscriptions.headers.renewal')}</TableCell>
                  <TableCell>{t('subscriptions.headers.autopay')}</TableCell>
                  <TableCell>{t('subscriptions.headers.actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading &&
                  Array.from({ length: 4 }).map((_, idx) => (
                    <TableRow key={`sub-skel-${idx}`}>
                      {Array.from({ length: 10 }).map((__, cidx) => (
                        <TableCell key={cidx}>
                          <Skeleton variant="text" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                {!loading &&
                  paginatedRows.map((row) => (
                    <TableRow key={row.subscriptionId || row.lineId} hover>
                      <TableCell>
                        <Stack direction="row" spacing={0.75} alignItems="center">
                          <CreditCardIcon fontSize="small" sx={{ color: '#1e88ff' }} />
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {row.subscriptionId}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.75} alignItems="center">
                          <PersonOutlineIcon fontSize="small" sx={{ color: '#607d8b' }} />
                          <Typography variant="body2">{row.customerName || row.customer_name || '-'}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.75} alignItems="center">
                          <WifiTetheringIcon fontSize="small" sx={{ color: '#00c853' }} />
                          <Typography variant="body2">
                            {lineNameMap[String(row.lineId ?? row.username_line ?? '')] || row.username_line || row.lineId || '-'}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack spacing={0.25}>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <Avatar sx={{ width: 22, height: 22, bgcolor: '#ffd54f', color: '#bf8f00' }}>
                              <BoltIcon fontSize="inherit" />
                            </Avatar>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {row.packageName || packageMap[String(row.packageId ?? '')]?.name || row.packageId || '-'}
                            </Typography>
                          </Stack>
                          {row.packageDescription || packageMap[String(row.packageId ?? '')]?.description ? (
                            <Typography variant="caption" color="text.secondary" noWrap>
                              {row.packageDescription || packageMap[String(row.packageId ?? '')]?.description}
                            </Typography>
                          ) : null}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <StatusChip status={row.status} />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <PriceChangeIcon fontSize="small" sx={{ color: '#43a047' }} />
                          <Typography variant="body2">
                            {Number(row.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <CalendarMonthIcon fontSize="small" color="primary" />
                          <Typography variant="body2">{row.startDate || '-'}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <CalendarMonthIcon fontSize="small" color="primary" />
                          <Typography variant="body2">{row.renewalDate || '-'}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={row.automaticPay ? t('common.yes', 'Yes') : t('common.no', 'No')}
                          color={row.automaticPay ? 'success' : 'default'}
                          variant={row.automaticPay ? 'filled' : 'outlined'}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <RowActions row={row} onEdit={handleEdit} onDelete={handleDelete} />
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
            overflow: 'hidden',
            border: '1px solid',
            borderColor: form.subscriptionId ? theme.palette.warning.light : theme.palette.primary.light,
            backgroundImage:
              theme.palette.mode === 'light'
                ? `linear-gradient(150deg, ${theme.palette.primary.light}16 0%, ${theme.palette.secondary.light}10 45%, #ffffff 100%)`
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
                bgcolor: form.subscriptionId ? 'warning.main' : 'primary.main',
                color: '#fff',
                width: 40,
                height: 40,
                boxShadow: 4
              }}
            >
              <CreditCardIcon fontSize="small" />
            </Avatar>
            <Box>
              <Typography variant="h6">
                {form.subscriptionId ? t('subscriptions.form.editTitle', 'Edit subscription') : t('subscriptions.actions.new', 'New subscription')}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t('subscriptions.form.subtitle', 'Complete customer, package and billing details.')}
              </Typography>
            </Box>
              <Chip
              label={form.subscriptionId ? t('common.edit', 'Edit') : t('common.new', 'New')}
              size="small"
              color={form.subscriptionId ? 'warning' : 'success'}
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
                : theme.palette.background.default,
            position: 'relative',
            '&:before': {
              content: '\"\"',
              position: 'absolute',
              inset: 12,
              zIndex: 0,
              borderRadius: 20,
              background:
                'radial-gradient(circle at 20% 20%, rgba(33,150,243,0.10), transparent 45%), radial-gradient(circle at 78% 0%, rgba(156,39,176,0.10), transparent 35%)'
            }
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1, position: 'relative', zIndex: 1 }}>
            <Chip
              icon={<AutoAwesomeIcon fontSize="small" color={form.subscriptionId ? 'warning' : 'primary'} />}
              label={form.subscriptionId ? t('subscriptions.badge.edit', 'Editing') : t('subscriptions.badge.new', 'New')}
              color={form.subscriptionId ? 'warning' : 'primary'}
              variant="outlined"
              sx={{ fontWeight: 700, borderRadius: 1.5, boxShadow: 1 }}
            />
            <Typography variant="caption" color="text.secondary">
              {t('subscriptions.form.helperTone', 'Complete the key fields before saving.')}
            </Typography>
          </Stack>

          <Stack spacing={2} sx={{ position: 'relative', zIndex: 1 }}>
            <SectionCard
              title={t('subscriptions.form.sections.main', 'Main data')}
              helper={t('subscriptions.form.sections.mainHelper', 'Customer, package and status.')}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4} md={4}>
                  <FormControl fullWidth required sx={fieldSx} disabled={customersLoading}>
                    <InputLabel shrink>{t('subscriptions.form.customer', 'Customer')}</InputLabel>
                    <Select
                      displayEmpty
                      value={form.customerId}
                      label={t('subscriptions.form.customer', 'Customer')}
                      onChange={handleFormChange('customerId')}
                      renderValue={(value) => {
                        const c = customers.find((cust) => (cust.customerId || cust.id) === value);
                        const label =
                          c?.customerFullname || c?.fullName || c?.username || c?.customerMail || value || t('common.selectOption', 'Select an option');
                        return (
                          <Stack direction="row" spacing={1} alignItems="center">
                            <PersonOutlineIcon fontSize="small" color="primary" />
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
                      {customers.length === 0 ? (
                        <MenuItem value="" disabled>
                          {t('subscriptions.form.noCustomers', 'No customers available')}
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
                      {customersLoading
                        ? t('subscriptions.form.loadingCustomers', 'Loading customers...')
                        : t('subscriptions.form.customerHint', 'Choose the subscription customer.')}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4} md={4}>
                  <FormControl fullWidth required sx={fieldSx} disabled={packagesLoading}>
                    <InputLabel shrink>{t('subscriptions.form.package', 'Package')}</InputLabel>
                    <Select
                      displayEmpty
                      value={form.packageId}
                      label="Package"
                      onChange={handleFormChange('packageId')}
                      renderValue={(value) => {
                        const pkg = packages.find((p) => p.id === value);
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
                      {packages.length === 0 ? (
                        <MenuItem value="" disabled>
                          {t('subscriptions.form.noPackages', 'No packages available')}
                        </MenuItem>
                      ) : (
                        packages.map((p) => (
                          <MenuItem key={p.id} value={p.id}>
                            <Stack spacing={0.25}>
                              <Stack direction="row" spacing={0.75} alignItems="center">
                                <Avatar sx={{ width: 22, height: 22, bgcolor: '#ffd54f', color: '#bf8f00' }}>
                                  <BoltIcon fontSize="inherit" />
                                </Avatar>
                                <Typography variant="body2">{p.name || `Paquete ${p.id}`}</Typography>
                              </Stack>
                              {p.description ? (
                                <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'normal' }}>
                                  {p.description}
                                </Typography>
                              ) : null}
                            </Stack>
                          </MenuItem>
                        ))
                      )}
                    </Select>
                    <FormHelperText>
                      {packagesLoading
                        ? t('subscriptions.form.loadingPackages', 'Loading packages...')
                        : t('subscriptions.form.packagesHint', 'Packages (DEMO excluded)')}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4} md={4}>
                  <FormControl fullWidth required sx={fieldSx}>
                    <InputLabel shrink>{t('subscriptions.form.status', 'Status')}</InputLabel>
                    <Select
                      displayEmpty
                      value={form.status}
                      label={t('subscriptions.form.status', 'Status')}
                      onChange={handleFormChange('status')}
                      renderValue={(value) => (
                        <Stack direction="row" spacing={1} alignItems="center">
                          <AutoAwesomeIcon fontSize="small" color="success" />
                          <Typography variant="body2" color={value ? 'text.primary' : 'text.secondary'}>
                            {value || t('subscriptions.form.statusPlaceholder', 'Status')}
                          </Typography>
                        </Stack>
                      )}
                    >
                      <MenuItem value="ACTIVE">{t('status.active', 'Active')}</MenuItem>
                      <MenuItem value="INACTIVE">{t('status.inactive', 'Inactive')}</MenuItem>
                      <MenuItem value="CANCELLED">{t('status.cancelled', 'Cancelled')}</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </SectionCard>

            <SectionCard
              title={t('subscriptions.form.sections.billing', 'Billing')}
              helper={t('subscriptions.form.sections.billingHelper', 'Line, billing and amounts.')}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4} md={4}>
                  <FormControl fullWidth required sx={fieldSx} disabled={linesLoading}>
                    <InputLabel shrink>{t('subscriptions.form.line', 'Line')}</InputLabel>
                    <Select
                      displayEmpty
                      value={form.lineId}
                      label={t('subscriptions.form.line', 'Line')}
                      onChange={handleLineChange}
                      renderValue={(value) => {
                        const lineLabel = lineNameMap[String(value)] || value || t('common.selectOption', 'Select an option');
                        return (
                          <Stack direction="row" spacing={1} alignItems="center">
                            <WifiTetheringIcon fontSize="small" color="primary" />
                            <Typography variant="body2" color={value ? 'text.primary' : 'text.secondary'}>
                              {lineLabel}
                            </Typography>
                          </Stack>
                        );
                      }}
                    >
                      <MenuItem value="">
                        <em>{t('common.selectOption', 'Select an option')}</em>
                      </MenuItem>
                      {lines.length === 0 ? (
                        <MenuItem value="" disabled>
                          {t('subscriptions.form.noLines', 'No lines available')}
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
                    {linesLoading
                        ? t('subscriptions.form.loadingLines', 'Loading lines...')
                        : t('subscriptions.form.linesHint', 'Description shows username')}
                  </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4} md={4}>
                  <FormControl fullWidth sx={fieldSx}>
                    <InputLabel shrink>{t('subscriptions.form.billing', 'Billing')}</InputLabel>
                    <Select
                      displayEmpty
                      value={form.billing}
                      label="Billing"
                      onChange={handleFormChange('billing')}
                      renderValue={(value) => (
                        <Stack direction="row" spacing={1} alignItems="center">
                          <PriceChangeIcon fontSize="small" color="info" />
                          <Typography variant="body2" color={value ? 'text.primary' : 'text.secondary'}>
                            {value || t('common.selectOption', 'Select an option')}
                          </Typography>
                        </Stack>
                      )}
                    >
                      <MenuItem value="">
                        <em>{t('common.selectOption', 'Select an option')}</em>
                      </MenuItem>
                      <MenuItem value="Monthly">{t('billing.monthly', 'Monthly')}</MenuItem>
                      <MenuItem value="Quarterly">{t('billing.quarterly', 'Quarterly')}</MenuItem>
                      <MenuItem value="Biannual">{t('billing.biannual', 'Biannual')}</MenuItem>
                      <MenuItem value="Annual">{t('billing.annual', 'Annual')}</MenuItem>
                    </Select>
                    <FormHelperText>{t('subscriptions.form.billingHint', 'Billing frequency')}</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={2} md={2}>
                  <TextField
                    label={t('subscriptions.form.amount', 'Amount')}
                    type="number"
                    value={form.amount}
                    onChange={handleFormChange('amount')}
                    fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PriceChangeIcon fontSize="small" color="info" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={2} md={2}>
                  <TextField
                    label={t('subscriptions.form.discount', 'Discount')}
                    type="number"
                    value={form.discount}
                    onChange={handleFormChange('discount')}
                    fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PriceChangeIcon fontSize="small" color="info" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
              </Grid>
            </SectionCard>

            <SectionCard
              title={t('subscriptions.form.sections.dates', 'Dates')}
              helper={t('subscriptions.form.sections.datesHelper', 'Subscription start and renewal.')}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={6}>
                  <TextField
                    required
                    label={t('subscriptions.form.start', 'Start')}
                    type="date"
                    value={form.startDate}
                    onChange={handleFormChange('startDate')}
                    fullWidth
                    sx={fieldSx}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarMonthIcon fontSize="small" color="primary" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <TextField
                    label={t('subscriptions.form.renewal', 'Renewal')}
                    type="date"
                    value={form.renewalDate}
                    onChange={handleFormChange('renewalDate')}
                    fullWidth
                    sx={fieldSx}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarMonthIcon fontSize="small" color="primary" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
              </Grid>
            </SectionCard>

            <SectionCard
              title={t('subscriptions.form.sections.automation', 'Automation')}
              helper={t('subscriptions.form.sections.automationHelper', 'Automatic payments and activation link.')}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={3} md={3} display="flex" alignItems="center">
                  <FormControlLabel
                    control={<Switch checked={form.automaticPay} onChange={handleFormChange('automaticPay')} color="success" />}
                    label={t('subscriptions.form.autopay', 'Automatic payment')}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <TextField
                    label={t('subscriptions.form.autopayLink', 'Automatic payment link')}
                    value={form.linkAutomatic}
                    onChange={handleFormChange('linkAutomatic')}
                    fullWidth
                    sx={fieldSx}
                    placeholder="https://..."
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LinkIcon fontSize="small" color="primary" />
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
          <Button variant="outlined" onClick={resetForm} disabled={sending} sx={{ borderRadius: 2 }} startIcon={<RefreshIcon />}>
            {t('common.clear', 'Clear')}
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={sending}
            startIcon={<RocketLaunchIcon />}
            sx={{ borderRadius: 2, boxShadow: '0 12px 28px rgba(0,0,0,0.16)', px: 2.4 }}
          >
            {sending
              ? t('common.saving', 'Saving...')
              : form.subscriptionId
                ? t('common.saveChanges', 'Save changes')
                : t('common.create', 'Create')}
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
        <DialogTitle>{t('subscriptions.delete.title', 'Delete subscription')}</DialogTitle>
        <DialogContent dividers>
          <Typography>
            {t('subscriptions.delete.message', 'Delete subscription')} <strong>{openDelete.row?.subscriptionId ?? ''}</strong>? {t('subscriptions.delete.warning', 'This action cannot be undone.')}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete({ open: false, row: null })} disabled={sending}>
            {t('common.cancel', 'Cancel')}
          </Button>
          <Button color="error" variant="contained" onClick={confirmDelete} disabled={sending}>
            {sending ? t('subscriptions.delete.deleting', 'Deleting...') : t('subscriptions.delete.confirm', 'Delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
