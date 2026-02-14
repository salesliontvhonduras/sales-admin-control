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
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';
import FormHelperText from '@mui/material/FormHelperText';
import { useTheme, useMediaQuery } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';

import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import PublicIcon from '@mui/icons-material/Public';
import ShareIcon from '@mui/icons-material/Share';

import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { lionTvApi } from 'utils/api';

const statusColors = {
  ACTIVE: 'success',
  INACTIVE: 'error',
  BLOCKED: 'error',
  SUSPENDED: 'warning'
};

const channelOptions = [
  { value: 'red social', label: 'Red social' },
  { value: 'google', label: 'Google' },
  { value: 'familiares', label: 'Familiares' },
  { value: 'amigos', label: 'Amigos' }
];

const fieldSx = {
  '& .MuiInputBase-root': { borderRadius: 2, minHeight: 48 },
  '& .MuiInputLabel-root': { fontWeight: 500 }
};

const glassCard = (theme) => ({
  p: 2,
  borderRadius: 2.5,
  border: '1px solid',
  borderColor: 'divider',
  boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
  background:
    theme.palette.mode === 'light'
      ? `linear-gradient(135deg, ${theme.palette.primary.lighter} 0%, ${theme.palette.secondary.lighter} 50%, #ffffff 100%)`
      : theme.palette.background.default
});

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

function normalizeCustomer(item = {}) {
  return {
    id: item.customerId ?? item.id ?? item.customer_id ?? null,
    fullName: item.customerFullname ?? item.fullName ?? item.customer_name ?? '',
    gender: (item.gender ?? '').toUpperCase(),
    openingDate: item.openingDate ?? item.open_date ?? null,
    closeDate: item.closeDate ?? item.close_date ?? null,
    isReferred: Boolean(item.isReferered ?? item.isReferred ?? false),
    refererBy: item.refererBy ?? item.referredBy ?? '',
    phone: item.customerPhone ?? item.phone ?? '',
    mail: item.customerMail ?? item.email ?? '',
    status: (item.customerStatus ?? item.status ?? '').toUpperCase(),
    username: item.username ?? item.userName ?? '',
    channel: item.channel ?? item.canal ?? ''
  };
}

function initialsFromName(name = '') {
  const parts = name.trim().split(' ').filter(Boolean);
  if (!parts.length) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ''}${parts[parts.length - 1][0] ?? ''}`.toUpperCase();
}

function flagFromPhone(phone = '') {
  const clean = phone.replace(/[^\d+]/g, '');
  if (clean.startsWith('+504') || clean.startsWith('504')) return '🇭🇳';
  if (clean.startsWith('+502') || clean.startsWith('502')) return '🇬🇹';
  if (clean.startsWith('+503') || clean.startsWith('503')) return '🇸🇻';
  if (clean.startsWith('+505') || clean.startsWith('505')) return '🇳🇮';
  if (clean.startsWith('+506') || clean.startsWith('506')) return '🇨🇷';
  if (clean.startsWith('+507') || clean.startsWith('507')) return '🇵🇦';
  if (clean.startsWith('+509') || clean.startsWith('509')) return '🇭🇹';
  if (clean.startsWith('+501') || clean.startsWith('501')) return '🇧🇿';
  if (clean.startsWith('+58') || clean.startsWith('58')) return '🇻🇪';
  if (clean.startsWith('+54') || clean.startsWith('54')) return '🇦🇷';
  if (clean.startsWith('+52') || clean.startsWith('52')) return '🇲🇽';
  if (clean.startsWith('+1') || clean.startsWith('1')) return '🇺🇸';
  if (clean.startsWith('+34') || clean.startsWith('34')) return '🇪🇸';
  if (clean.startsWith('+57') || clean.startsWith('57')) return '🇨🇴';
  if (clean.startsWith('+48') || clean.startsWith('48')) return '🇵🇱';
  return null;
}

function RowActions({ row, onEdit, onDelete }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)}>
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
          <EditOutlinedIcon fontSize="small" style={{ marginRight: 8 }} />
          Editar
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            onDelete?.(row);
          }}
        >
          <DeleteOutlineIcon fontSize="small" style={{ marginRight: 8 }} />
          Eliminar
        </MenuItem>
      </Menu>
    </>
  );
}

function FormSection({ title, helper, children }) {
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

export default function CustomersLionTv() {
  const { enqueueSnackbar } = useSnackbar();
  const { accessToken } = useAuth();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const defaultForm = {
    customerId: null,
    customerFullname: '',
    gender: 'M',
    openingDate: '',
    closeDate: '',
    isReferered: false,
    refererBy: '',
    customerPhone: '',
    customerMail: '',
    customerStatus: 'INACTIVE',
    channel: 'red social'
  };

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState({ open: false, row: null });
  const [form, setForm] = useState(defaultForm);
  const [sending, setSending] = useState(false);
  const [referers, setReferers] = useState([]);
  const [referersLoading, setReferersLoading] = useState(false);
  const [referersFetched, setReferersFetched] = useState(false);

  const handleUnauthorized = (err) => {
    const status = err?.response?.status || err?.request?.status;
    return status === 401;
  };

  const loadCustomers = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);

    try {
      const response = await lionTvApi.get('/customers/v1', {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { index: 0, size: 5000 },
        skipAuthRedirect: true
      });

      const payload = response?.data?.data ?? response?.data ?? {};
      const collection = payload.data ?? payload.items ?? payload.content ?? [];
      const normalized = collection.map(normalizeCustomer);

      setRows(normalized);
      setTotal(normalized.length);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || err.message || 'No se pudieron cargar los clientes.', {
          variant: 'error'
        });
      }
    } finally {
      setLoading(false);
    }
  }, [accessToken, enqueueSnackbar]);

  const loadReferers = useCallback(async () => {
    if (!accessToken) return;
    setReferersLoading(true);
    try {
      const response = await lionTvApi.get('/customers/v1', {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { index: 0, size: 500 },
        skipAuthRedirect: true
      });
      const payload = response?.data?.data ?? response?.data ?? {};
      const collection = payload.data ?? payload.items ?? payload.content ?? [];
      const normalized = collection.map(normalizeCustomer);
      setReferers(normalized);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar('No se pudieron cargar los referidores.', { variant: 'warning' });
      }
    } finally {
      setReferersLoading(false);
      setReferersFetched(true);
    }
  }, [accessToken, enqueueSnackbar]);

  useEffect(() => {
    loadCustomers();
  }, [refreshKey, loadCustomers]);

  useEffect(() => {
    setReferersFetched(false);
  }, [refreshKey]);

  useEffect(() => {
    if ((openCreate || openEdit) && !referersFetched && !referersLoading) {
      loadReferers();
    }
  }, [openCreate, openEdit, referersFetched, referersLoading, loadReferers]);

  const filteredRows = useMemo(() => {
    if (!search && !statusFilter) return rows;
    const term = search.toLowerCase();
    return rows.filter((row) => {
      if (statusFilter && (row.status || '').toLowerCase() !== statusFilter.toLowerCase()) return false;
      return (
        (row.fullName || '').toLowerCase().includes(term) ||
        (row.username || '').toLowerCase().includes(term) ||
        (row.mail || '').toLowerCase().includes(term) ||
        (row.phone || '').toLowerCase().includes(term) ||
        (row.status || '').toLowerCase().includes(term) ||
        (row.channel || '').toLowerCase().includes(term)
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
          if (row.status === 'ACTIVE') acc.active += 1;
          if (row.status === 'INACTIVE') acc.inactive += 1;
          if (row.isReferred || row.refererBy) acc.referred += 1;
          return acc;
        },
        { active: 0, inactive: 0, referred: 0 }
      ),
    [rows]
  );

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (row) => {
    openEditModal(row);
  };

  const handleDelete = (row) => {
    setOpenDelete({ open: true, row });
  };

  const handleFormChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => setForm(defaultForm);

  const handleCreateCustomer = async () => {
    if (!form.customerFullname || !form.gender || !form.customerPhone || !form.customerMail || !form.channel) {
      enqueueSnackbar('Completa los campos requeridos.', { variant: 'warning' });
      return;
    }

    const payload = {
      customerFullname: form.customerFullname,
      gender: form.gender,
      openingDate: form.openingDate || null,
      closeDate: form.closeDate || null,
      isReferered: Boolean(form.isReferered),
      refererBy: form.refererBy,
      customerPhone: form.customerPhone,
      customerMail: form.customerMail,
      customerStatus: form.customerStatus || 'INACTIVE',
      channel: form.channel
    };

    setSending(true);
    try {
      await lionTvApi.post('/customers/v1', payload, {
        headers: { Authorization: `Bearer ${accessToken}` },
        skipAuthRedirect: true
      });
      enqueueSnackbar('Cliente creado correctamente.', { variant: 'success' });
      setOpenCreate(false);
      resetForm();
      setRefreshKey((v) => v + 1);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || err.message || 'No se pudo crear el cliente.', {
          variant: 'error'
        });
      }
    } finally {
      setSending(false);
    }
  };

  const openEditModal = (row) => {
    setForm({
      customerId: row.customerId || row.id || null,
      customerFullname: row.fullName || '',
      gender: row.gender || 'M',
      openingDate: row.openingDate || '',
      closeDate: row.closeDate || '',
      isReferered: Boolean(row.isReferred),
      refererBy: row.refererBy || '',
      customerPhone: row.phone || '',
      customerMail: row.mail || '',
      customerStatus: row.status || 'INACTIVE',
      channel: row.channel || 'red social'
    });
    setOpenEdit(true);
  };

  const handleUpdateCustomer = async () => {
    if (!form.customerId) {
      enqueueSnackbar('No se pudo identificar el cliente.', { variant: 'error' });
      return;
    }
    if (!form.customerFullname || !form.gender || !form.customerPhone || !form.customerMail || !form.channel) {
      enqueueSnackbar('Completa los campos requeridos.', { variant: 'warning' });
      return;
    }

    const payload = {
      customerFullname: form.customerFullname,
      gender: form.gender,
      openingDate: form.openingDate || null,
      closeDate: form.closeDate || null,
      isReferered: Boolean(form.isReferered),
      refererBy: form.refererBy,
      customerPhone: form.customerPhone,
      customerMail: form.customerMail,
      customerStatus: form.customerStatus || 'INACTIVE',
      channel: form.channel
    };

    setSending(true);
    try {
      await lionTvApi.put(`/customers/v1/${form.customerId}`, payload, {
        headers: { Authorization: `Bearer ${accessToken}` },
        skipAuthRedirect: true
      });
      enqueueSnackbar('Cliente actualizado correctamente.', { variant: 'success' });
      setOpenEdit(false);
      resetForm();
      setRefreshKey((v) => v + 1);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || err.message || 'No se pudo actualizar el cliente.', {
          variant: 'error'
        });
      }
    } finally {
      setSending(false);
    }
  };

  const handleDeleteCustomer = async () => {
    const row = openDelete.row;
    if (!row?.customerId && !row?.id) {
      enqueueSnackbar('No se pudo identificar el cliente a eliminar.', { variant: 'error' });
      return;
    }
    const id = row.customerId || row.id;
    setSending(true);
    try {
      await lionTvApi.delete(`/customers/v1/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        skipAuthRedirect: true
      });
      enqueueSnackbar('Cliente eliminado correctamente.', { variant: 'success' });
      setOpenDelete({ open: false, row: null });
      setRefreshKey((v) => v + 1);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || err.message || 'No se pudo eliminar el cliente.', {
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
        title={t('customers.title')}
        secondary={
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => setRefreshKey((v) => v + 1)}>
              {t('actions.refresh')}
            </Button>
            <Button variant="contained" onClick={() => setOpenCreate(true)}>
              {t('actions.newCustomer')}
            </Button>
          </Stack>
        }
      >
        <Grid container spacing={gridSpacing}>
          {[
            { label: `${total} ${t('customers.title').toLowerCase()}`, color: 'primary.main' },
            { label: `${t('customers.headers.status')}: ACTIVE ${summary.active}`, color: 'success.main' },
            { label: `${t('customers.headers.status')}: INACTIVE ${summary.inactive}`, color: 'text.secondary' },
            { label: `${t('customers.headers.referred')}: ${summary.referred}`, color: 'secondary.main' }
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
                      ? `linear-gradient(150deg, ${theme.palette.primary.light}1F 0%, ${theme.palette.secondary.light}26 60%, #ffffff 100%)`
                      : theme.palette.background.paper
                })}
              >
                <Avatar
                  sx={(theme) => ({
                    width: 40,
                    height: 40,
                    bgcolor: theme.palette.mode === 'light' ? `${item.color}` : theme.palette.primary.dark,
                    color: theme.palette.getContrastText(theme.palette.primary.main),
                    fontWeight: 700,
                    boxShadow: 3,
                    border: '2px solid',
                    borderColor: 'background.paper'
                  })}
                >
                  <PeopleAltIcon fontSize="small" />
                </Avatar>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  {item.label}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </MainCard>

      <MainCard
        title={t('customers.title')}
        secondary={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: { xs: '100%', sm: 480 } }}>
            <TextField
              size="small"
              placeholder={t('customers.search')}
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
              <InputLabel>{t('customers.headers.status')}</InputLabel>
              <Select value={statusFilter} label={t('customers.headers.status')} onChange={(e) => setStatusFilter(e.target.value)}>
                <MenuItem value="">
                  <em>{t('invoices.filters.all')}</em>
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
        <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'background.default' }}>
                <TableCell>{t('customers.headers.customer')}</TableCell>
                <TableCell>{t('customers.headers.email')}</TableCell>
                <TableCell>{t('customers.headers.phone')}</TableCell>
                <TableCell>{t('customers.headers.gender')}</TableCell>
                <TableCell>{t('customers.headers.status')}</TableCell>
                <TableCell>{t('customers.headers.opening')}</TableCell>
                <TableCell>{t('customers.headers.closing')}</TableCell>
                <TableCell>{t('customers.headers.referred')}</TableCell>
                <TableCell>{t('customers.headers.channel')}</TableCell>
                <TableCell>{t('invoices.headers.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.map((row) => (
                <TableRow
                  key={row.id || row.username || row.mail}
                  hover
                  sx={{
                    '&:nth-of-type(odd)': { bgcolor: 'background.default' },
                    transition: 'background 0.2s ease',
                    cursor: 'pointer'
                  }}
                >
                  <TableCell>
                    <Stack direction="row" spacing={1.5} alignItems="center">
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
                        {initialsFromName(row.fullName)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2">{row.fullName || '-'}</Typography>
                        {row.refererBy ? (
                          <Typography variant="caption" color="text.secondary">
                            {t('customers.headers.referred')}: {row.refererBy}
                          </Typography>
                        ) : null}
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>{row.mail || '-'}</TableCell>
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
                        {flagFromPhone(row.phone) || <PublicIcon fontSize="small" />}
                      </Avatar>
                      <Typography variant="body2">{row.phone || '-'}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      icon={
                        row.gender === 'F' ? (
                          <FemaleIcon fontSize="small" />
                        ) : row.gender === 'M' ? (
                          <MaleIcon fontSize="small" />
                        ) : null
                      }
                      label={row.gender || '-'}
                      sx={(theme) => ({
                        bgcolor:
                          row.gender === 'F'
                            ? theme.palette.secondary.lighter
                            : row.gender === 'M'
                              ? theme.palette.primary.lighter
                              : theme.palette.grey[100],
                        color:
                          row.gender === 'F'
                            ? theme.palette.secondary.dark
                            : row.gender === 'M'
                              ? theme.palette.primary.dark
                              : theme.palette.text.secondary,
                        fontWeight: 600
                      })}
                    />
                  </TableCell>
                  <TableCell>
                    <StatusChip status={row.status} />
                  </TableCell>
                  <TableCell>{row.openingDate}</TableCell>
                  <TableCell>{row.closeDate ?? '-'}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={row.isReferred || row.refererBy ? 'Sí' : 'No'}
                      sx={(theme) => ({
                        bgcolor: row.isReferred || row.refererBy ? theme.palette.info.lighter : theme.palette.grey[100],
                        color: row.isReferred || row.refererBy ? theme.palette.info.dark : theme.palette.text.secondary,
                        fontWeight: 600
                      })}
                      icon={<PeopleAltIcon fontSize="small" />}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      icon={<ShareIcon fontSize="small" />}
                      label={row.channel || '-'}
                      sx={(theme) => ({
                        bgcolor: theme.palette.mode === 'light' ? theme.palette.info.lighter : theme.palette.info.dark,
                        color: theme.palette.mode === 'light' ? theme.palette.info.darker : theme.palette.info.contrastText,
                        fontWeight: 600
                      })}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <RowActions row={row} onEdit={handleEdit} onDelete={handleDelete} />
                  </TableCell>
                </TableRow>
              ))}
              {!loading && filteredRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={11} align="center" sx={{ py: 6 }}>
                    <Stack spacing={1} alignItems="center">
                      <Avatar sx={{ bgcolor: 'primary.lighter', color: 'primary.main' }}>
                        <PeopleAltIcon />
                      </Avatar>
                      <Typography variant="subtitle1">No hay clientes registrados.</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Crea tu primer cliente para verlo aquí.
                      </Typography>
                      <Button variant="contained" onClick={() => setOpenCreate(true)} size="small">
                        {t('actions.newCustomer')}
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              )}
              {loading && (
                <TableRow>
                  <TableCell colSpan={11} align="center" sx={{ py: 4 }}>
                    <Stack spacing={1} alignItems="center">
                      <Skeleton variant="circular" width={40} height={40} />
                      <Typography variant="body2" color="text.secondary">
                        Cargando clientes...
                      </Typography>
                    </Stack>
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
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </MainCard>

      <Dialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        fullWidth
        maxWidth="md"
        fullScreen={isMobile}
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle
          sx={(theme) => ({
            pb: 1,
            background: `linear-gradient(135deg, ${theme.palette.primary.light}33 0%, ${theme.palette.primary.main}20 45%, ${theme.palette.background.paper} 100%)`
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
              <PersonAddAlt1Icon fontSize="small" />
            </Avatar>
            <Box>
              <Typography variant="h6">Nuevo cliente</Typography>
              <Typography variant="caption" color="text.secondary">
                Registra un cliente con la información básica y fechas clave.
              </Typography>
            </Box>
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
                ? `linear-gradient(180deg, ${theme.palette.primary.light}12 0%, ${theme.palette.background.paper} 70%)`
                : theme.palette.background.default
          }}
        >
          <Box
            sx={{
              mb: 2,
              p: 2,
              borderRadius: 2,
              background: (theme) =>
                `linear-gradient(135deg, ${theme.palette.primary.light}1F, ${theme.palette.secondary.light}14)`
            }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              Datos del cliente
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Completa los campos requeridos; puedes dejar las fechas vacías si no aplican.
            </Typography>
          </Box>

          <Stack spacing={2}>
            <FormSection title="Identificación" helper="Nombre, género y estado del cliente.">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4} md={4}>
                  <TextField
                    required
                    label="Nombre completo"
                    value={form.customerFullname}
                    onChange={handleFormChange('customerFullname')}
                    fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonAddAlt1Icon fontSize="small" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4} md={4}>
                  <FormControl fullWidth required sx={fieldSx}>
                    <InputLabel>Genero</InputLabel>
                    <Select value={form.gender} label="Genero" onChange={handleFormChange('gender')}>
                      <MenuItem value="M">Masculino</MenuItem>
                      <MenuItem value="F">Femenino</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={4} md={4}>
                  <FormControl fullWidth required sx={fieldSx}>
                    <InputLabel>Estado</InputLabel>
                    <Select value={form.customerStatus} label="Estado" onChange={handleFormChange('customerStatus')}>
                      <MenuItem value="ACTIVE">Activo</MenuItem>
                      <MenuItem value="INACTIVE">Inactivo</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
               
              </Grid>
            </FormSection>

            <FormSection title="Contacto" helper="Cómo comunicarnos con el cliente.">
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    label="Correo"
                    type="email"
                    value={form.customerMail}
                    onChange={handleFormChange('customerMail')}
                    fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MailOutlineIcon fontSize="small" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    label="Telefono"
                    value={form.customerPhone}
                    onChange={handleFormChange('customerPhone')}
                    fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIphoneIcon fontSize="small" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                 <Grid item xs={12} md={2}>
                  <FormControl fullWidth required sx={fieldSx}>
                    <InputLabel>Canal</InputLabel>
                    <Select value={form.channel} label="Canal" onChange={handleFormChange('channel')}>
                      {channelOptions.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </FormSection>

            <FormSection title="Fechas" helper="Control de apertura y cierre (opcional).">
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Fecha de apertura"
                    type="date"
                    value={form.openingDate}
                    onChange={handleFormChange('openingDate')}
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
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Fecha de cierre"
                    type="date"
                    value={form.closeDate}
                    onChange={handleFormChange('closeDate')}
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
            </FormSection>

            <FormSection title="Referido" helper="Marca si el cliente viene referido y quién lo recomendó.">
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    control={<Switch checked={form.isReferered} onChange={handleFormChange('isReferered')} />}
                    label="Es referido"
                  />
                </Grid>
                <Grid item xs={12} md={8}>
                  <FormControl
                    fullWidth
                    disabled={!form.isReferered || referersLoading || referers.length === 0}
                    sx={fieldSx}
                  >
                    <InputLabel>Referido por</InputLabel>
                    <Select
                      value={form.refererBy}
                      label="Referido por"
                      onChange={handleFormChange('refererBy')}
                    >
                      <MenuItem value="">
                        <em>Selecciona un cliente</em>
                      </MenuItem>
                      {referers.length === 0 ? (
                        <MenuItem value="" disabled>
                          No hay clientes disponibles
                        </MenuItem>
                      ) : (
                        referers.map((c) => (
                          <MenuItem key={c.id || c.mail || c.username} value={c.fullName || c.username || c.mail}>
                            {c.fullName || c.username || c.mail}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                    <FormHelperText>
                      {referersLoading
                        ? 'Cargando clientes...'
                        : !form.isReferered
                          ? 'Activa "Es referido" para seleccionar.'
                          : referers.length === 0
                            ? 'No hay clientes para referir aún.'
                            : 'Escoge entre los clientes existentes.'}
                    </FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
            </FormSection>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button variant="outlined" onClick={resetForm} disabled={sending}>
            Limpiar
          </Button>
          <Button variant="contained" onClick={handleCreateCustomer} disabled={sending}>
            {sending ? 'Creando...' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        fullWidth
        maxWidth="md"
        fullScreen={isMobile}
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle
          sx={(theme) => ({
            pb: 1,
            background: `linear-gradient(135deg, ${theme.palette.warning.light}33 0%, ${theme.palette.warning.main}20 45%, ${theme.palette.background.paper} 100%)`
          })}
        >
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Avatar
              sx={{
                bgcolor: 'warning.main',
                color: 'warning.contrastText',
                width: 40,
                height: 40,
                boxShadow: 3
              }}
            >
              <EditOutlinedIcon fontSize="small" />
            </Avatar>
            <Box>
              <Typography variant="h6">Editar cliente</Typography>
              <Typography variant="caption" color="text.secondary">
                Actualiza los datos del cliente seleccionado.
              </Typography>
            </Box>
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
                ? `linear-gradient(180deg, ${theme.palette.warning.light}12 0%, ${theme.palette.background.paper} 70%)`
                : theme.palette.background.default
          }}
        >
          <Box
            sx={{
              mb: 2,
              p: 2,
              borderRadius: 2,
              background: (theme) =>
                `linear-gradient(135deg, ${theme.palette.warning.light}1F, ${theme.palette.secondary.light}12)`
            }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              Datos del cliente
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Modifica sólo los campos necesarios; guarda los cambios para aplicarlos.
            </Typography>
          </Box>
          {/* Reuso el mismo formulario */}
          <Stack spacing={2}>
            <FormSection title="Identificación" helper="Nombre, género, estado y canal.">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={3} md={3}>
                  <TextField
                    required
                    label="Nombre completo"
                    value={form.customerFullname}
                    onChange={handleFormChange('customerFullname')}
                    fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonAddAlt1Icon fontSize="small" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={3} md={3}>
                  <FormControl fullWidth required sx={fieldSx}>
                    <InputLabel>Genero</InputLabel>
                    <Select value={form.gender} label="Genero" onChange={handleFormChange('gender')}>
                      <MenuItem value="M">Masculino</MenuItem>
                      <MenuItem value="F">Femenino</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3} md={3}>
                  <FormControl fullWidth required sx={fieldSx}>
                    <InputLabel>Estado</InputLabel>
                    <Select value={form.customerStatus} label="Estado" onChange={handleFormChange('customerStatus')}>
                      <MenuItem value="ACTIVE">Activo</MenuItem>
                      <MenuItem value="INACTIVE">Inactivo</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3} md={3}>
                  <FormControl fullWidth required sx={fieldSx}>
                    <InputLabel>Canal</InputLabel>
                    <Select value={form.channel} label="Canal" onChange={handleFormChange('channel')}>
                      {channelOptions.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </FormSection>

            <FormSection title="Contacto" helper="Cómo comunicarnos con el cliente.">
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    label="Correo"
                    type="email"
                    value={form.customerMail}
                    onChange={handleFormChange('customerMail')}
                    fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MailOutlineIcon fontSize="small" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    label="Telefono"
                    value={form.customerPhone}
                    onChange={handleFormChange('customerPhone')}
                    fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIphoneIcon fontSize="small" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
              </Grid>
            </FormSection>

            <FormSection title="Fechas" helper="Control de apertura y cierre (opcional).">
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Fecha de apertura"
                    type="date"
                    value={form.openingDate}
                    onChange={handleFormChange('openingDate')}
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
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Fecha de cierre"
                    type="date"
                    value={form.closeDate}
                    onChange={handleFormChange('closeDate')}
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
            </FormSection>

            <FormSection title="Referido" helper="Marca si el cliente viene referido y quién lo recomendó.">
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    control={<Switch checked={form.isReferered} onChange={handleFormChange('isReferered')} />}
                    label="Es referido"
                  />
                </Grid>
                <Grid item xs={12} md={8}>
                  <FormControl
                    fullWidth
                    disabled={!form.isReferered || referersLoading || referers.length === 0}
                    sx={fieldSx}
                  >
                    <InputLabel>Referido por</InputLabel>
                    <Select
                      value={form.refererBy}
                      label="Referido por"
                      onChange={handleFormChange('refererBy')}
                    >
                      <MenuItem value="">
                        <em>Selecciona un cliente</em>
                      </MenuItem>
                      {referers.length === 0 ? (
                        <MenuItem value="" disabled>
                          No hay clientes disponibles
                        </MenuItem>
                      ) : (
                        referers.map((c) => (
                          <MenuItem key={c.id || c.mail || c.username} value={c.fullName || c.username || c.mail}>
                            {c.fullName || c.username || c.mail}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                    <FormHelperText>
                      {referersLoading
                        ? 'Cargando clientes...'
                        : !form.isReferered
                          ? 'Activa "Es referido" para seleccionar.'
                          : referers.length === 0
                            ? 'No hay clientes para referir aún.'
                            : 'Escoge entre los clientes existentes.'}
                    </FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
            </FormSection>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button variant="outlined" onClick={resetForm} disabled={sending}>
            Limpiar
          </Button>
          <Button variant="contained" onClick={handleUpdateCustomer} disabled={sending}>
            {sending ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDelete.open}
        onClose={() => setOpenDelete({ open: false, row: null })}
        maxWidth="xs"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle
          sx={(theme) => ({
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            background: `linear-gradient(135deg, ${theme.palette.error.light}33 0%, ${theme.palette.background.paper} 100%)`
          })}
        >
          <Avatar sx={{ bgcolor: 'error.main', color: 'error.contrastText', width: 40, height: 40, boxShadow: 3 }}>
            <WarningAmberIcon fontSize="small" />
          </Avatar>
          <Box>
            <Typography variant="h6">Eliminar cliente</Typography>
            <Typography variant="caption" color="text.secondary">
              Esta acción no se puede deshacer.
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" sx={{ mb: 1 }}>
            ¿Estás seguro de eliminar a{' '}
            <strong>{openDelete.row?.fullName || openDelete.row?.username || openDelete.row?.mail || 'este cliente'}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Se eliminarán también sus referencias asociadas.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setOpenDelete({ open: false, row: null })} disabled={sending}>
            Cancelar
          </Button>
          <Button color="error" variant="contained" onClick={handleDeleteCustomer} disabled={sending}>
            {sending ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
