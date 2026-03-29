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
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import FormHelperText from '@mui/material/FormHelperText';
import Skeleton from '@mui/material/Skeleton';
import { useTheme, useMediaQuery } from '@mui/material';

import RefreshIcon from '@mui/icons-material/Refresh';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import GroupIcon from '@mui/icons-material/Group';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import MainCard from 'ui-component/cards/MainCard';
import DialogTitleWithClose from 'ui-component/dialogs/DialogTitleWithClose';
import { gridSpacing } from 'store/constant';
import { lionTvApi } from 'utils/api';

const buildStatusOptions = (t) => [
  { value: '', label: t('paymentCommitments.filters.all') },
  { value: 'PENDING', label: t('paymentCommitments.status.pending') },
  { value: 'PARTIAL', label: t('paymentCommitments.status.partial') },
  { value: 'PAID', label: t('paymentCommitments.status.paid') },
  { value: 'CANCELLED', label: t('paymentCommitments.status.cancelled') }
];

const viewModes = {
  ALL: 'ALL',
  DEBTORS: 'DEBTORS'
};

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
      ? `linear-gradient(135deg, ${theme.palette.primary.light}24 0%, ${theme.palette.secondary.main}12 45%, ${theme.palette.background.paper} 100%)`
      : theme.palette.surface.sunken
});

const sectionSx = {
  p: 2,
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
  bgcolor: 'background.paper'
};

function normalizeMoney(value) {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function formatMoney(value) {
  const amount = normalizeMoney(value);
  return new Intl.NumberFormat('es-HN', {
    style: 'currency',
    currency: 'HNL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
}

function formatDateTime(value) {
  if (!value) return '-';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

function normalizeCommitment(item = {}) {
  const amountDue = normalizeMoney(item.amountDue ?? item.amount_due);
  const amountPaid = normalizeMoney(item.amountPaid ?? item.amount_paid);
  const pendingAmount = normalizeMoney(item.pendingAmount ?? item.pending_amount ?? Math.max(amountDue - amountPaid, 0));

  return {
    paymentCommitmentId: item.paymentCommitmentId ?? item.payment_commitment_id ?? item.id ?? null,
    customerId: item.customerId ?? item.customer_id ?? null,
    promisedPaymentDate: item.promisedPaymentDate ?? item.promised_payment_date ?? '',
    amountDue,
    amountPaid,
    pendingAmount,
    status: String(item.status ?? 'PENDING').toUpperCase(),
    notes: item.notes ?? '',
    fulfilledAt: item.fulfilledAt ?? item.fulfilled_at ?? null,
    createdAt: item.createdAt ?? item.created_at ?? null,
    updatedAt: item.updatedAt ?? item.updated_at ?? null,
    customerFullname: item.customerFullname ?? item.customer_fullname ?? '-',
    overdue: Boolean(item.overdue ?? item.isOverdue ?? item.is_overdue)
  };
}

function computeStatusPreview(amountDue, amountPaid, cancelled) {
  if (cancelled) return 'CANCELLED';
  const due = normalizeMoney(amountDue);
  const paid = normalizeMoney(amountPaid);
  if (paid >= due && due > 0) return 'PAID';
  if (paid > 0) return 'PARTIAL';
  return 'PENDING';
}

function StatusChip({ status }) {
  const { t } = useTranslation();
  const normalized = (status || '').toUpperCase();
  const config = {
    PAID: { color: 'success', icon: <CheckCircleOutlineIcon fontSize="small" />, label: t('paymentCommitments.status.paid') },
    PARTIAL: { color: 'info', icon: <PendingActionsIcon fontSize="small" />, label: t('paymentCommitments.status.partial') },
    CANCELLED: { color: 'default', icon: <RemoveCircleOutlineIcon fontSize="small" />, label: t('paymentCommitments.status.cancelled') },
    PENDING: { color: 'warning', icon: <PendingActionsIcon fontSize="small" />, label: t('paymentCommitments.status.pending') }
  }[normalized] || { color: 'default', label: normalized || '-' };

  return <Chip size="small" color={config.color} icon={config.icon} label={config.label} />;
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

function RowActions({ row, onEdit, onDelete }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { t } = useTranslation();

  return (
    <>
      <IconButton
        size="small"
        onClick={(event) => setAnchorEl(event.currentTarget)}
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
          {t('actions.edit', 'Editar')}
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            onDelete?.(row);
          }}
        >
          <DeleteOutlineIcon fontSize="small" style={{ marginRight: 8, color: '#e53935' }} />
          {t('actions.delete', 'Eliminar')}
        </MenuItem>
      </Menu>
    </>
  );
}

function defaultFormValues() {
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  return {
    paymentCommitmentId: null,
    customerId: '',
    promisedPaymentDate: today.toISOString().slice(0, 10),
    amountDue: '',
    amountPaid: 0,
    notes: '',
    cancelled: false
  };
}

export default function PaymentCommitmentsLionTv() {
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
  const [viewMode, setViewMode] = useState(viewModes.ALL);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  const [openModal, setOpenModal] = useState(false);
  const [openDelete, setOpenDelete] = useState({ open: false, row: null });
  const [form, setForm] = useState(defaultFormValues);
  const [sending, setSending] = useState(false);

  const [customers, setCustomers] = useState([]);
  const [customersLoading, setCustomersLoading] = useState(false);
  const statusOptions = useMemo(() => buildStatusOptions(t), [t]);

  const handleUnauthorized = (error) => {
    const status = error?.response?.status || error?.request?.status;
    return status === 401;
  };

  const endpointPath = viewMode === viewModes.DEBTORS ? '/payment-commitments/v1/debtors' : '/payment-commitments/v1';

  const loadPaymentCommitments = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const response = await lionTvApi.get(endpointPath, {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { index: 0, size: 5000 },
        skipAuthRedirect: true
      });

      const payload = response?.data?.data ?? response?.data ?? {};
      const collection = payload.data ?? payload.items ?? payload.content ?? [];
      const normalized = (Array.isArray(collection) ? collection : []).map(normalizeCommitment);
      setRows(normalized);
    } catch (error) {
      if (!handleUnauthorized(error)) {
        enqueueSnackbar(error?.response?.data?.message || error.message || t('paymentCommitments.messages.loadError'), {
          variant: 'error'
        });
      }
    } finally {
      setLoading(false);
    }
  }, [accessToken, endpointPath, enqueueSnackbar]);

  const loadCustomers = useCallback(async () => {
    if (!accessToken) return;
    setCustomersLoading(true);
    try {
      const response = await lionTvApi.get('/customers/v1', {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { index: 0, size: 5000 },
        skipAuthRedirect: true
      });
      const payload = response?.data?.data ?? response?.data ?? {};
      const collection = payload.data ?? payload.items ?? payload.content ?? [];
      const list = Array.isArray(collection) ? collection : [];

      const normalizedCustomers = list
        .map((item) => ({
          customerId: item.customerId ?? item.id ?? null,
          customerFullname: item.customerFullname ?? item.fullName ?? item.customer_mail ?? item.username ?? '-'
        }))
        .filter((item) => item.customerId)
        .sort((a, b) => a.customerFullname.localeCompare(b.customerFullname));

      setCustomers(normalizedCustomers);
    } catch (error) {
      if (!handleUnauthorized(error)) {
        enqueueSnackbar(t('paymentCommitments.messages.customersLoadWarning'), { variant: 'warning' });
      }
    } finally {
      setCustomersLoading(false);
    }
  }, [accessToken, enqueueSnackbar]);

  useEffect(() => {
    loadPaymentCommitments();
  }, [loadPaymentCommitments, refreshKey]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers, refreshKey]);

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();

    return rows.filter((row) => {
      if (statusFilter && row.status !== statusFilter) return false;
      if (!term) return true;

      return (
        String(row.paymentCommitmentId || '').toLowerCase().includes(term) ||
        String(row.customerId || '').toLowerCase().includes(term) ||
        String(row.customerFullname || '').toLowerCase().includes(term) ||
        String(row.status || '').toLowerCase().includes(term) ||
        String(row.notes || '').toLowerCase().includes(term)
      );
    });
  }, [rows, search, statusFilter]);

  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredRows.slice(start, start + rowsPerPage);
  }, [filteredRows, page, rowsPerPage]);

  useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(filteredRows.length / rowsPerPage) - 1);
    if (page > maxPage) setPage(0);
  }, [filteredRows.length, page, rowsPerPage]);

  const summary = useMemo(() => {
    return rows.reduce(
      (acc, row) => {
        acc.total += 1;
        acc.totalPending += normalizeMoney(row.pendingAmount);

        if (row.pendingAmount > 0 && row.status !== 'PAID' && row.status !== 'CANCELLED') {
          acc.debtorsCount += 1;
        }

        if (row.overdue) {
          acc.overdueCount += 1;
        }

        return acc;
      },
      {
        total: 0,
        totalPending: 0,
        debtorsCount: 0,
        overdueCount: 0
      }
    );
  }, [rows]);

  const resetForm = () => setForm(defaultFormValues());

  const handleFormChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleEdit = (row) => {
    setForm({
      paymentCommitmentId: row.paymentCommitmentId,
      customerId: row.customerId ? String(row.customerId) : '',
      promisedPaymentDate: row.promisedPaymentDate ? String(row.promisedPaymentDate).slice(0, 10) : '',
      amountDue: row.amountDue,
      amountPaid: row.amountPaid,
      notes: row.notes || '',
      cancelled: row.status === 'CANCELLED'
    });
    setOpenModal(true);
  };

  const handleDelete = (row) => {
    setOpenDelete({ open: true, row });
  };

  const validatePayload = () => {
    if (!form.customerId) {
      enqueueSnackbar(t('paymentCommitments.messages.selectCustomer'), { variant: 'warning' });
      return false;
    }

    if (!form.promisedPaymentDate) {
      enqueueSnackbar(t('paymentCommitments.messages.selectDate'), { variant: 'warning' });
      return false;
    }

    const amountDue = normalizeMoney(form.amountDue);
    const amountPaid = normalizeMoney(form.amountPaid);

    if (amountDue <= 0) {
      enqueueSnackbar(t('paymentCommitments.messages.amountDuePositive'), { variant: 'warning' });
      return false;
    }

    if (amountPaid < 0) {
      enqueueSnackbar(t('paymentCommitments.messages.amountPaidNegative'), { variant: 'warning' });
      return false;
    }

    if (amountPaid > amountDue) {
      enqueueSnackbar(t('paymentCommitments.messages.amountPaidGreaterThanDue'), { variant: 'warning' });
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validatePayload()) return;

    const payload = {
      customerId: Number(form.customerId),
      promisedPaymentDate: form.promisedPaymentDate,
      amountDue: normalizeMoney(form.amountDue),
      amountPaid: normalizeMoney(form.amountPaid),
      status: form.cancelled ? 'CANCELLED' : null,
      notes: form.notes?.trim() || null
    };

    setSending(true);
    try {
      if (form.paymentCommitmentId) {
        await lionTvApi.put(`/payment-commitments/v1/${form.paymentCommitmentId}`, payload, {
          headers: { Authorization: `Bearer ${accessToken}` },
          skipAuthRedirect: true
        });
        enqueueSnackbar(t('paymentCommitments.messages.updated'), { variant: 'success' });
      } else {
        await lionTvApi.post('/payment-commitments/v1', payload, {
          headers: { Authorization: `Bearer ${accessToken}` },
          skipAuthRedirect: true
        });
        enqueueSnackbar(t('paymentCommitments.messages.created'), { variant: 'success' });
      }

      setOpenModal(false);
      resetForm();
      setRefreshKey((value) => value + 1);
    } catch (error) {
      if (!handleUnauthorized(error)) {
        enqueueSnackbar(error?.response?.data?.message || error.message || t('paymentCommitments.messages.saveError'), {
          variant: 'error'
        });
      }
    } finally {
      setSending(false);
    }
  };

  const confirmDelete = async () => {
    const id = openDelete.row?.paymentCommitmentId;
    if (!id) {
      setOpenDelete({ open: false, row: null });
      return;
    }

    setSending(true);
    try {
      await lionTvApi.delete(`/payment-commitments/v1/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        skipAuthRedirect: true
      });
      enqueueSnackbar(t('paymentCommitments.messages.deleted'), { variant: 'success' });
      setOpenDelete({ open: false, row: null });
      setRefreshKey((value) => value + 1);
    } catch (error) {
      if (!handleUnauthorized(error)) {
        enqueueSnackbar(error?.response?.data?.message || error.message || t('paymentCommitments.messages.deleteError'), {
          variant: 'error'
        });
      }
    } finally {
      setSending(false);
    }
  };

  const statusPreview = computeStatusPreview(form.amountDue, form.amountPaid, form.cancelled);

  return (
    <Box sx={{ width: '100%', maxWidth: 1400, mx: 'auto' }}>
      <MainCard
        title={t('paymentCommitments.title', 'Compromisos de pago')}
        secondary={
          <Stack direction="row" spacing={1.25}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => setRefreshKey((value) => value + 1)}
              sx={{ borderRadius: 2, textTransform: 'none', px: 2 }}
            >
              {t('actions.refresh', 'Recargar')}
            </Button>
            <Button
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
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
              {t('paymentCommitments.actions.new', 'Nuevo compromiso')}
            </Button>
          </Stack>
        }
      >
        <Grid container spacing={gridSpacing}>
          {[
            { label: t('paymentCommitments.kpi.total', { count: summary.total }), icon: AssignmentTurnedInIcon, color: 'primary.main' },
            { label: t('paymentCommitments.kpi.debtors', { count: summary.debtorsCount }), icon: GroupIcon, color: 'secondary.main' },
            { label: t('paymentCommitments.kpi.pendingAmount', { amount: formatMoney(summary.totalPending) }), icon: AccountBalanceWalletIcon, color: 'warning.main' },
            { label: t('paymentCommitments.kpi.overdue', { count: summary.overdueCount }), icon: WarningAmberIcon, color: 'error.main' }
          ].map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={(muiTheme) => ({
                  ...glassCard(muiTheme),
                  py: 1.5,
                  px: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  background:
                    muiTheme.palette.mode === 'light'
                      ? `linear-gradient(155deg, ${muiTheme.palette.primary.main}1F 0%, ${muiTheme.palette.secondary.main}20 55%, ${muiTheme.palette.background.paper} 100%)`
                      : muiTheme.palette.background.paper
                })}
              >
                <Avatar
                  sx={(muiTheme) => ({
                    width: 40,
                    height: 40,
                    bgcolor: item.color,
                    color: muiTheme.palette.getContrastText(muiTheme.palette.primary.main),
                    boxShadow: 3,
                    border: '2px solid',
                    borderColor: 'background.paper'
                  })}
                >
                  <item.icon fontSize="small" />
                </Avatar>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {item.label}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </MainCard>

      <MainCard
        title={t('paymentCommitments.filters.title', 'Control de deuda')}
        secondary={
          <Paper
            elevation={0}
            sx={(muiTheme) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              width: { xs: '100%', sm: 560 },
              p: 1,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              background:
                muiTheme.palette.mode === 'light'
                  ? `linear-gradient(120deg, ${muiTheme.palette.primary.light}12 0%, ${muiTheme.palette.secondary.light}12 100%)`
                  : muiTheme.palette.background.paper,
              boxShadow: '0 8px 18px rgba(0,0,0,0.05)'
            })}
          >
            <TextField
              size="small"
              placeholder={t('paymentCommitments.filters.search', 'Buscar por cliente, estado, nota o ID')}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              fullWidth
              variant="outlined"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: 'background.paper' } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" color="action" />
                  </InputAdornment>
                )
              }}
            />
            <FormControl size="small" sx={{ minWidth: 170 }}>
              <InputLabel>{t('paymentCommitments.filters.status', 'Estado')}</InputLabel>
              <Select
                label={t('paymentCommitments.filters.status', 'Estado')}
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value);
                  setPage(0);
                }}
                sx={{ borderRadius: 2, bgcolor: 'background.paper' }}
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value || 'ALL'} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>
        }
      >
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} alignItems={{ xs: 'stretch', sm: 'center' }} sx={{ mb: 1.5 }}>
          <Button
            variant={viewMode === viewModes.ALL ? 'contained' : 'outlined'}
            onClick={() => {
              setViewMode(viewModes.ALL);
              setPage(0);
            }}
            startIcon={<AssignmentTurnedInIcon />}
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            {t('paymentCommitments.filters.all', 'Todos')}
          </Button>
          <Button
            variant={viewMode === viewModes.DEBTORS ? 'contained' : 'outlined'}
            color="warning"
            onClick={() => {
              setViewMode(viewModes.DEBTORS);
              setPage(0);
            }}
            startIcon={<WarningAmberIcon />}
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            {t('paymentCommitments.filters.debtorsOnly', 'Solo deudores')}
          </Button>
        </Stack>

        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
          <Table size={isMobile ? 'small' : 'medium'}>
            <TableHead>
              <TableRow>
                <TableCell>{t('paymentCommitments.table.headers.id')}</TableCell>
                <TableCell>{t('paymentCommitments.table.headers.customer')}</TableCell>
                <TableCell>{t('paymentCommitments.table.headers.promisedDate')}</TableCell>
                <TableCell align="right">{t('paymentCommitments.table.headers.amountDue')}</TableCell>
                <TableCell align="right">{t('paymentCommitments.table.headers.amountPaid')}</TableCell>
                <TableCell align="right">{t('paymentCommitments.table.headers.pendingAmount')}</TableCell>
                <TableCell>{t('paymentCommitments.table.headers.status')}</TableCell>
                <TableCell>{t('paymentCommitments.table.headers.risk')}</TableCell>
                <TableCell>{t('paymentCommitments.table.headers.note')}</TableCell>
                <TableCell align="right">{t('paymentCommitments.table.headers.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading
                ? Array.from({ length: rowsPerPage }).map((_, index) => (
                    <TableRow key={`skeleton-${index}`}>
                      <TableCell colSpan={10}>
                        <Skeleton variant="rounded" height={38} />
                      </TableCell>
                    </TableRow>
                  ))
                : paginatedRows.map((row) => (
                    <TableRow hover key={row.paymentCommitmentId}>
                      <TableCell>
                        <Typography variant="body2" fontWeight={700}>
                          #{row.paymentCommitmentId}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack spacing={0.25}>
                          <Typography variant="body2" fontWeight={600}>
                            {row.customerFullname || '-'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {t('paymentCommitments.labels.customerId', { id: row.customerId || '-' })}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack spacing={0.35}>
                          <Typography variant="body2">{formatDate(row.promisedPaymentDate)}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDateTime(row.createdAt)}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="right">{formatMoney(row.amountDue)}</TableCell>
                      <TableCell align="right">{formatMoney(row.amountPaid)}</TableCell>
                      <TableCell align="right">
                        <Typography
                          variant="body2"
                          fontWeight={700}
                          color={row.pendingAmount > 0 ? 'warning.dark' : 'success.dark'}
                        >
                          {formatMoney(row.pendingAmount)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <StatusChip status={row.status} />
                      </TableCell>
                      <TableCell>
                        {row.overdue ? (
                          <Chip size="small" color="error" label={t('paymentCommitments.risk.overdue')} />
                        ) : (
                          <Chip size="small" color="success" label={t('paymentCommitments.risk.onTime')} />
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            maxWidth: 240,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {row.notes || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <RowActions row={row} onEdit={handleEdit} onDelete={handleDelete} />
                      </TableCell>
                    </TableRow>
                  ))}

              {!loading && paginatedRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 6 }}>
                    <Stack spacing={1.25} alignItems="center">
                      <Avatar sx={{ bgcolor: 'warning.lighter', color: 'warning.main', width: 56, height: 56 }}>
                        <WarningAmberIcon />
                      </Avatar>
                      <Typography variant="subtitle1">{t('paymentCommitments.table.emptyTitle')}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t('paymentCommitments.table.emptyText')}
                      </Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filteredRows.length}
          page={page}
          onPageChange={(_, value) => setPage(value)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 20, 50]}
          labelRowsPerPage={t('paymentCommitments.table.rowsPerPage', 'Filas por página')}
        />
      </MainCard>

      <Dialog open={openModal} onClose={() => !sending && setOpenModal(false)} fullWidth maxWidth="md">
        <DialogTitleWithClose sx={{ pb: 1 }} onClose={() => !sending && setOpenModal(false)}>
          <Stack direction="row" spacing={1.25} alignItems="center">
            <Avatar sx={{ bgcolor: 'primary.lighter', color: 'primary.main' }}>
              {form.paymentCommitmentId ? <AutoAwesomeIcon /> : <RocketLaunchIcon />}
            </Avatar>
            <Box>
              <Typography variant="h4">
                {form.paymentCommitmentId ? t('paymentCommitments.dialog.editTitle') : t('paymentCommitments.dialog.createTitle')}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t('paymentCommitments.dialog.subtitle')}
              </Typography>
            </Box>
          </Stack>
        </DialogTitleWithClose>

        <DialogContent dividers>
          <Stack spacing={2}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormSection title={t('paymentCommitments.form.main.title')} helper={t('paymentCommitments.form.main.helper')}>
                  <Stack spacing={2}>
                    <FormControl fullWidth sx={fieldSx}>
                      <InputLabel id="customer-select-label">{t('paymentCommitments.form.customer')}</InputLabel>
                      <Select
                        labelId="customer-select-label"
                        value={form.customerId}
                        label={t('paymentCommitments.form.customer')}
                        onChange={handleFormChange('customerId')}
                      >
                        {customersLoading ? (
                          <MenuItem value="" disabled>
                            {t('paymentCommitments.form.loadingCustomers')}
                          </MenuItem>
                        ) : customers.length ? (
                          customers.map((customer) => (
                            <MenuItem key={customer.customerId} value={String(customer.customerId)}>
                              #{customer.customerId} - {customer.customerFullname}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem value="" disabled>
                            {t('paymentCommitments.form.noCustomers')}
                          </MenuItem>
                        )}
                      </Select>
                      <FormHelperText>{t('paymentCommitments.form.customerHelper')}</FormHelperText>
                    </FormControl>

                    <TextField
                      label={t('paymentCommitments.form.promisedDate')}
                      type="date"
                      value={form.promisedPaymentDate}
                      onChange={handleFormChange('promisedPaymentDate')}
                      fullWidth
                      sx={fieldSx}
                      InputLabelProps={{ shrink: true }}
                    />

                    <TextField
                      label={t('paymentCommitments.form.amountDue')}
                      type="number"
                      value={form.amountDue}
                      onChange={handleFormChange('amountDue')}
                      fullWidth
                      sx={fieldSx}
                      inputProps={{ min: 0, step: '0.01' }}
                    />

                    <TextField
                      label={t('paymentCommitments.form.amountPaid')}
                      type="number"
                      value={form.amountPaid}
                      onChange={handleFormChange('amountPaid')}
                      fullWidth
                      sx={fieldSx}
                      inputProps={{ min: 0, step: '0.01' }}
                    />
                  </Stack>
                </FormSection>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormSection title={t('paymentCommitments.form.tracking.title')} helper={t('paymentCommitments.form.tracking.helper')}>
                  <Stack spacing={2}>
                    <TextField
                      label={t('paymentCommitments.form.notes')}
                      value={form.notes}
                      onChange={handleFormChange('notes')}
                      multiline
                      minRows={4}
                      fullWidth
                      sx={fieldSx}
                    />

                    <FormControlLabel
                      control={<Switch checked={form.cancelled} onChange={handleFormChange('cancelled')} color="warning" />}
                      label={t('paymentCommitments.form.markCancelled')}
                    />

                    <Card
                      variant="outlined"
                      sx={(muiTheme) => ({
                        p: 1.5,
                        borderRadius: 2,
                        borderColor: 'divider',
                        background:
                          muiTheme.palette.mode === 'light'
                            ? `linear-gradient(140deg, ${muiTheme.palette.primary.light}10 0%, ${muiTheme.palette.secondary.light}10 100%)`
                            : muiTheme.palette.surface.card
                      })}
                    >
                      <Stack spacing={1.25}>
                        <Typography variant="subtitle2">{t('paymentCommitments.form.projectedStatus')}</Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <StatusChip status={statusPreview} />
                          <Typography variant="caption" color="text.secondary">
                            {t('paymentCommitments.form.pendingBalance', {
                              amount: formatMoney(Math.max(normalizeMoney(form.amountDue) - normalizeMoney(form.amountPaid), 0))
                            })}
                          </Typography>
                        </Stack>
                        <Divider />
                        <Stack direction="row" spacing={0.75} alignItems="center">
                          <InfoOutlinedIcon fontSize="small" color="info" />
                          <Typography variant="caption" color="text.secondary">
                            {t('paymentCommitments.form.statusHint')}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Card>
                  </Stack>
                </FormSection>
              </Grid>
            </Grid>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 1.5 }}>
          <Button
            onClick={() => {
              resetForm();
              setOpenModal(false);
            }}
            disabled={sending}
            variant="outlined"
          >
            {t('actions.cancel', 'Cancelar')}
          </Button>
          <Button onClick={handleSave} disabled={sending} variant="contained">
            {sending
              ? form.paymentCommitmentId
                ? t('common.saving', 'Saving...')
                : t('common.creating', 'Creating...')
              : form.paymentCommitmentId
                ? t('common.saveChanges', 'Save changes')
                : t('paymentCommitments.actions.create')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDelete.open} onClose={() => !sending && setOpenDelete({ open: false, row: null })} maxWidth="xs" fullWidth>
        <DialogTitleWithClose onClose={() => !sending && setOpenDelete({ open: false, row: null })}>
          {t('paymentCommitments.delete.title')}
        </DialogTitleWithClose>
        <DialogContent dividers>
          <Typography>
            {t('paymentCommitments.delete.body', {
              id: openDelete.row?.paymentCommitmentId || '-',
              customer: openDelete.row?.customerFullname || t('paymentCommitments.labels.thisCustomer')
            })}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete({ open: false, row: null })} disabled={sending}>
            {t('actions.cancel', 'Cancelar')}
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained" disabled={sending}>
            {sending ? t('common.deleting', 'Deleting...') : t('actions.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
