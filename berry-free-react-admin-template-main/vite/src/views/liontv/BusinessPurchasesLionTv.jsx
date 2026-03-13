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
import Menu from '@mui/material/Menu';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Avatar from '@mui/material/Avatar';
import { useMediaQuery, useTheme } from '@mui/material';

import RefreshIcon from '@mui/icons-material/Refresh';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SearchIcon from '@mui/icons-material/Search';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CategoryIcon from '@mui/icons-material/Category';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import BusinessIcon from '@mui/icons-material/Business';

import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { lionTvApi } from 'utils/api';

const statusColors = {
  PAID: 'success',
  PENDING: 'warning',
  PARTIAL: 'info',
  CANCELLED: 'error'
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

const purchaseTypeOptions = [
  'VIVO_PLAYER_CREDITS',
  'IBO_PLAYER_CREDITS',
  'SMART_ONE_CREDITS',
  'PANEL_TITAN_CREDITS',
  'LION_TV_CREDITS',
  'SHOPIFY_PAYMENT',
  'BANRURAL_POS_PAYMENT',
  'DOMAIN_PAYMENT',
  'DEMO_LICENSE_PAYMENT',
  'HOUSE_MONTHLY_LICENSE',
  'OTHER'
];

const categoryOptions = ['CREDITS', 'PLATFORM_PAYMENT', 'DOMAIN', 'LICENSE', 'POS', 'OTHER'];
const currencyOptions = ['HNL', 'USD', 'GTQ', 'EUR'];
const paymentMethodOptions = ['CASH', 'BANK_TRANSFER', 'CARD', 'PAYPAL', 'BANRURAL_POS', 'SHOPIFY', 'CRYPTO', 'OTHER'];
const businessAreaOptions = ['IPTV', 'WEB', 'BILLING', 'MARKETING', 'OPERATIONS', 'OTHER'];
const statusOptions = ['PENDING', 'PAID', 'PARTIAL', 'CANCELLED'];
const recurrenceOptions = ['NONE', 'MONTHLY', 'YEARLY', 'WEEKLY'];

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

function formatDateTimeInput(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

function StatusChip({ status }) {
  const color = statusColors[status] || 'default';
  return <Chip size="small" color={color} label={status || '-'} />;
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

function normalizePurchase(item = {}) {
  return {
    id: item.id ?? null,
    purchaseCode: item.purchaseCode ?? item.purchase_code ?? '',
    purchaseType: item.purchaseType ?? item.purchase_type ?? 'OTHER',
    category: item.category ?? 'OTHER',
    providerName: item.providerName ?? item.provider_name ?? '',
    itemName: item.itemName ?? item.item_name ?? '',
    description: item.description ?? '',
    quantity: item.quantity ?? 1,
    unitCost: item.unitCost ?? item.unit_cost ?? 0,
    totalAmount: item.totalAmount ?? item.total_amount ?? 0,
    currency: item.currency ?? 'HNL',
    exchangeRate: item.exchangeRate ?? item.exchange_rate ?? null,
    purchaseDate: item.purchaseDate ?? item.purchase_date ?? '',
    dueDate: item.dueDate ?? item.due_date ?? '',
    paidAt: item.paidAt ?? item.paid_at ?? null,
    paymentMethod: item.paymentMethod ?? item.payment_method ?? '',
    paymentReference: item.paymentReference ?? item.payment_reference ?? '',
    invoiceNumber: item.invoiceNumber ?? item.invoice_number ?? '',
    businessArea: item.businessArea ?? item.business_area ?? 'IPTV',
    status: (item.status ?? 'PAID').toUpperCase(),
    isRecurring: Boolean(item.isRecurring ?? item.is_recurring),
    recurrenceType: item.recurrenceType ?? item.recurrence_type ?? 'NONE',
    notes: item.notes ?? '',
    username: item.username ?? '',
    createdAt: item.createdAt ?? item.created_at ?? null,
    updatedAt: item.updatedAt ?? item.updated_at ?? null
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

const createDefaultForm = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return {
    id: null,
    purchaseCode: '',
    purchaseType: 'OTHER',
    category: 'OTHER',
    providerName: '',
    itemName: '',
    description: '',
    quantity: 1,
    unitCost: 0,
    totalAmount: 0,
    currency: 'HNL',
    exchangeRate: '',
    purchaseDate: now.toISOString().slice(0, 10),
    dueDate: '',
    paidAt: '',
    paymentMethod: '',
    paymentReference: '',
    invoiceNumber: '',
    businessArea: 'IPTV',
    status: 'PAID',
    isRecurring: false,
    recurrenceType: 'NONE',
    notes: ''
  };
};

export default function BusinessPurchasesLionTv() {
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
  const [categoryFilter, setCategoryFilter] = useState('');

  const [openModal, setOpenModal] = useState(false);
  const [openDelete, setOpenDelete] = useState({ open: false, row: null });
  const [form, setForm] = useState(() => createDefaultForm());
  const [sending, setSending] = useState(false);

  const handleUnauthorized = (err) => {
    const status = err?.response?.status || err?.request?.status;
    return status === 401;
  };

  const loadBusinessPurchases = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const res = await lionTvApi.get('/business-purchases/v1', {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { index: 0, size: 5000 },
        skipAuthRedirect: true
      });
      const payload = res?.data?.data ?? res?.data ?? {};
      const raw = payload.data ?? payload.items ?? payload.content ?? payload ?? [];
      const list = Array.isArray(raw) ? raw : [];
      setRows(list.map(normalizePurchase));
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || err.message || 'No se pudieron cargar las compras.', {
          variant: 'error'
        });
      }
    } finally {
      setLoading(false);
    }
  }, [accessToken, enqueueSnackbar]);

  useEffect(() => {
    loadBusinessPurchases();
  }, [loadBusinessPurchases, refreshKey]);

  const filteredRows = useMemo(() => {
    if (!search && !statusFilter && !categoryFilter) return rows;
    const term = search.toLowerCase();
    return rows.filter((row) => {
      if (statusFilter && (row.status || '').toUpperCase() !== statusFilter.toUpperCase()) return false;
      if (categoryFilter && (row.category || '').toUpperCase() !== categoryFilter.toUpperCase()) return false;
      return (
        (row.purchaseCode || '').toLowerCase().includes(term) ||
        (row.itemName || '').toLowerCase().includes(term) ||
        (row.providerName || '').toLowerCase().includes(term) ||
        (row.purchaseType || '').toLowerCase().includes(term) ||
        (row.category || '').toLowerCase().includes(term) ||
        (row.paymentReference || '').toLowerCase().includes(term) ||
        (row.invoiceNumber || '').toLowerCase().includes(term)
      );
    });
  }, [rows, search, statusFilter, categoryFilter]);

  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredRows.slice(start, start + rowsPerPage);
  }, [filteredRows, page, rowsPerPage]);

  useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(filteredRows.length / rowsPerPage) - 1);
    if (page > maxPage) setPage(0);
  }, [filteredRows.length, page, rowsPerPage]);

  const summary = useMemo(
    () => ({
      total: rows.length,
      paid: rows.filter((r) => r.status === 'PAID').length,
      pending: rows.filter((r) => r.status === 'PENDING').length,
      totalAmount: rows.reduce((acc, row) => acc + Number(row.totalAmount || 0), 0)
    }),
    [rows]
  );

  const resetForm = () => setForm(createDefaultForm());

  const handleFormChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'quantity' || field === 'unitCost') {
        const qty = Number(field === 'quantity' ? value : next.quantity || 0);
        const cost = Number(field === 'unitCost' ? value : next.unitCost || 0);
        next.totalAmount = qty * cost;
      }
      if (field === 'isRecurring' && !value) {
        next.recurrenceType = 'NONE';
      }
      return next;
    });
  };

  const handleEdit = (row) => {
    setForm({
      id: row.id,
      purchaseCode: row.purchaseCode || '',
      purchaseType: row.purchaseType || 'OTHER',
      category: row.category || 'OTHER',
      providerName: row.providerName || '',
      itemName: row.itemName || '',
      description: row.description || '',
      quantity: row.quantity ?? 1,
      unitCost: row.unitCost ?? 0,
      totalAmount: row.totalAmount ?? 0,
      currency: row.currency || 'HNL',
      exchangeRate: row.exchangeRate ?? '',
      purchaseDate: formatDateInput(row.purchaseDate),
      dueDate: formatDateInput(row.dueDate),
      paidAt: formatDateTimeInput(row.paidAt),
      paymentMethod: row.paymentMethod || '',
      paymentReference: row.paymentReference || '',
      invoiceNumber: row.invoiceNumber || '',
      businessArea: row.businessArea || 'IPTV',
      status: row.status || 'PAID',
      isRecurring: Boolean(row.isRecurring),
      recurrenceType: row.recurrenceType || 'NONE',
      notes: row.notes || ''
    });
    setOpenModal(true);
  };

  const handleDelete = (row) => setOpenDelete({ open: true, row });

  const handleSave = async () => {
    if (!form.purchaseCode || !form.purchaseType || !form.category || !form.itemName || !form.purchaseDate) {
      enqueueSnackbar('Completa los campos requeridos.', { variant: 'warning' });
      return;
    }

    const paidAt = form.paidAt ? (String(form.paidAt).length === 16 ? `${form.paidAt}:00` : form.paidAt) : null;
    const quantity = Number(form.quantity || 0);
    const unitCost = Number(form.unitCost || 0);
    const totalAmount = form.totalAmount === '' || form.totalAmount === null ? quantity * unitCost : Number(form.totalAmount || 0);

    const payload = {
      purchaseCode: form.purchaseCode,
      purchaseType: form.purchaseType,
      category: form.category,
      providerName: form.providerName || null,
      itemName: form.itemName,
      description: form.description || null,
      quantity,
      unitCost,
      totalAmount,
      currency: form.currency,
      exchangeRate: form.exchangeRate ? Number(form.exchangeRate) : null,
      purchaseDate: form.purchaseDate || null,
      dueDate: form.dueDate || null,
      paidAt,
      paymentMethod: form.paymentMethod || null,
      paymentReference: form.paymentReference || null,
      invoiceNumber: form.invoiceNumber || null,
      businessArea: form.businessArea,
      status: form.status,
      isRecurring: Boolean(form.isRecurring),
      recurrenceType: form.isRecurring ? form.recurrenceType || 'NONE' : 'NONE',
      notes: form.notes || null
    };

    setSending(true);
    try {
      if (form.id) {
        await lionTvApi.put(`/business-purchases/v1/${form.id}`, payload, {
          headers: { Authorization: `Bearer ${accessToken}` },
          skipAuthRedirect: true
        });
        enqueueSnackbar('Compra actualizada.', { variant: 'success' });
      } else {
        await lionTvApi.post('/business-purchases/v1', payload, {
          headers: { Authorization: `Bearer ${accessToken}` },
          skipAuthRedirect: true
        });
        enqueueSnackbar('Compra registrada.', { variant: 'success' });
      }
      setOpenModal(false);
      resetForm();
      setRefreshKey((v) => v + 1);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || err.message || 'No se pudo guardar la compra.', {
          variant: 'error'
        });
      }
    } finally {
      setSending(false);
    }
  };

  const confirmDelete = async () => {
    const row = openDelete.row;
    if (!row?.id) {
      setOpenDelete({ open: false, row: null });
      return;
    }
    setSending(true);
    try {
      await lionTvApi.delete(`/business-purchases/v1/${row.id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        skipAuthRedirect: true
      });
      enqueueSnackbar('Compra eliminada.', { variant: 'success' });
      setOpenDelete({ open: false, row: null });
      setRefreshKey((v) => v + 1);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || err.message || 'No se pudo eliminar la compra.', {
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
        title={t('businessPurchases.title', 'Business Purchases')}
        secondary={
          <Stack direction="row" spacing={1.25}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => setRefreshKey((v) => v + 1)}
              sx={{ borderRadius: 2, textTransform: 'none', px: 2 }}
            >
              {t('actions.refresh', 'Refresh')}
            </Button>
            <Button
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
              onClick={() => setOpenModal(true)}
              sx={{ borderRadius: 2, textTransform: 'none', px: 2.5, boxShadow: '0 10px 24px rgba(0,0,0,0.12)' }}
            >
              {t('businessPurchases.actions.new', 'New purchase')}
            </Button>
          </Stack>
        }
      >
        <Grid container spacing={gridSpacing}>
          {[
            {
              label: t('businessPurchases.summary.total', { defaultValue: '{{count}} purchases', count: summary.total }),
              icon: ShoppingCartIcon,
              color: 'primary.main'
            },
            {
              label: t('businessPurchases.summary.paid', { defaultValue: 'Paid: {{count}}', count: summary.paid }),
              icon: PaidOutlinedIcon,
              color: 'success.main'
            },
            {
              label: t('businessPurchases.summary.pending', { defaultValue: 'Pending: {{count}}', count: summary.pending }),
              icon: PendingActionsIcon,
              color: 'warning.main'
            },
            {
              label: t('businessPurchases.summary.totalAmount', {
                defaultValue: 'Total: L {{amount}}',
                amount: summary.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })
              }),
              icon: LocalAtmIcon,
              color: 'secondary.main'
            }
          ].map((item, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
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
                      ? `linear-gradient(155deg, ${muiTheme.palette.primary.main}1F 0%, ${muiTheme.palette.secondary.main}20 55%, #ffffff 100%)`
                      : muiTheme.palette.background.paper
                })}
              >
                <Avatar
                  sx={(muiTheme) => ({
                    width: 40,
                    height: 40,
                    bgcolor: muiTheme.palette.mode === 'light' ? `${item.color}` : muiTheme.palette.primary.dark,
                    color: muiTheme.palette.getContrastText(muiTheme.palette.primary.main),
                    fontWeight: 700,
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
        title={t('businessPurchases.searchTitle', 'Search purchases')}
        secondary={
          <Paper
            elevation={0}
            sx={(muiTheme) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              width: { xs: '100%', sm: 760 },
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
              placeholder={t('businessPurchases.search', 'Search by code, item, provider, reference')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
              variant="outlined"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: 'background.paper' } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                )
              }}
            />
            <FormControl size="small" sx={{ minWidth: 170, '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: 'background.paper' } }}>
              <InputLabel>{t('businessPurchases.filters.category', 'Category')}</InputLabel>
              <Select
                value={categoryFilter}
                label={t('businessPurchases.filters.category', 'Category')}
                onChange={(e) => setCategoryFilter(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <CategoryIcon fontSize="small" />
                  </InputAdornment>
                }
              >
                <MenuItem value="">
                  <em>{t('businessPurchases.filters.all', 'All')}</em>
                </MenuItem>
                {categoryOptions.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 150, '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: 'background.paper' } }}>
              <InputLabel>{t('businessPurchases.filters.status', 'Status')}</InputLabel>
              <Select
                value={statusFilter}
                label={t('businessPurchases.filters.status', 'Status')}
                onChange={(e) => setStatusFilter(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <PaidOutlinedIcon fontSize="small" />
                  </InputAdornment>
                }
              >
                <MenuItem value="">
                  <em>{t('businessPurchases.filters.all', 'All')}</em>
                </MenuItem>
                {statusOptions.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>
        }
      >
        <TableContainer
          component={Paper}
          sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: '0 12px 24px rgba(0,0,0,0.06)', border: '1px solid', borderColor: 'divider' }}
        >
          <Table size="small">
            <TableHead>
              <TableRow
                sx={(muiTheme) => ({
                  bgcolor: muiTheme.palette.mode === 'light' ? '#f7f9fc' : muiTheme.palette.background.default,
                  borderBottom: `1px solid ${muiTheme.palette.divider}`
                })}
              >
                <TableCell>{t('businessPurchases.headers.code', 'Code')}</TableCell>
                <TableCell>{t('businessPurchases.headers.item', 'Item')}</TableCell>
                <TableCell>{t('businessPurchases.headers.type', 'Type')}</TableCell>
                <TableCell>{t('businessPurchases.headers.category', 'Category')}</TableCell>
                <TableCell>{t('businessPurchases.headers.amount', 'Amount')}</TableCell>
                <TableCell>{t('businessPurchases.headers.date', 'Purchase date')}</TableCell>
                <TableCell>{t('businessPurchases.headers.method', 'Method')}</TableCell>
                <TableCell>{t('businessPurchases.headers.status', 'Status')}</TableCell>
                <TableCell>{t('businessPurchases.headers.actions', 'Actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.map((row) => (
                <TableRow key={row.id} hover sx={{ '&:nth-of-type(odd)': { bgcolor: 'background.paper' }, transition: 'background 0.2s ease' }}>
                  <TableCell>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar sx={{ width: 34, height: 34, bgcolor: 'secondary.light', color: 'secondary.dark', boxShadow: 2 }}>
                        <ReceiptLongIcon fontSize="small" />
                      </Avatar>
                      <Stack spacing={0.2}>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {row.purchaseCode || '-'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          #{row.id}
                        </Typography>
                      </Stack>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack spacing={0.25}>
                      <Typography variant="subtitle2">{row.itemName || '-'}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {row.providerName || '-'}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{row.purchaseType || '-'}</TableCell>
                  <TableCell>
                    <Chip size="small" label={row.category || '-'} variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      variant="outlined"
                      icon={<AccountBalanceWalletIcon fontSize="small" color="success" />}
                      label={`${row.currency || 'HNL'} ${Number(row.totalAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack spacing={0.25}>
                      <Typography variant="body2">{formatDate(row.purchaseDate)}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {row.dueDate ? `${t('businessPurchases.labels.due', 'Due')}: ${formatDate(row.dueDate)}` : '-'}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{row.paymentMethod || '-'}</TableCell>
                  <TableCell>
                    <StatusChip status={row.status} />
                  </TableCell>
                  <TableCell align="right">
                    <RowActions row={row} onEdit={handleEdit} onDelete={handleDelete} />
                  </TableCell>
                </TableRow>
              ))}

              {!loading && filteredRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                    <Stack spacing={1} alignItems="center">
                      <Avatar sx={{ bgcolor: 'primary.lighter', color: 'primary.main' }}>
                        <ShoppingCartIcon />
                      </Avatar>
                      <Typography variant="subtitle1">{t('businessPurchases.empty.title', 'No purchases yet')}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t('businessPurchases.empty.description', 'Create your first purchase record to see it here.')}
                      </Typography>
                      <Button variant="contained" onClick={() => setOpenModal(true)} size="small">
                        {t('businessPurchases.actions.new', 'New purchase')}
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              )}

              {loading && (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                    <Stack spacing={1} alignItems="center">
                      <Avatar sx={{ bgcolor: 'primary.lighter', color: 'primary.main' }}>
                        <RefreshIcon />
                      </Avatar>
                      <Typography variant="body2" color="text.secondary">
                        {t('businessPurchases.loading', 'Loading purchases...')}
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
          onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
        />
      </MainCard>

      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        fullWidth
        maxWidth="lg"
        fullScreen={isMobile}
        PaperProps={{
          sx: (muiTheme) => ({
            borderRadius: 3,
            boxShadow: '0 18px 40px rgba(0,0,0,0.18)',
            border: '1px solid',
            borderColor: form.id ? muiTheme.palette.warning.light : muiTheme.palette.primary.light,
            backgroundImage:
              muiTheme.palette.mode === 'light'
                ? `linear-gradient(150deg, ${muiTheme.palette.primary.light}18 0%, ${muiTheme.palette.secondary.light}10 45%, #ffffff 100%)`
                : undefined
          })
        }}
      >
        <DialogTitle
          sx={(muiTheme) => ({
            position: 'relative',
            pb: 1,
            background: form.id
              ? `linear-gradient(135deg, ${muiTheme.palette.warning.light}40 0%, ${muiTheme.palette.secondary.light}20 45%, ${muiTheme.palette.background.paper} 100%)`
              : `linear-gradient(135deg, ${muiTheme.palette.primary.light}40 0%, ${muiTheme.palette.secondary.light}20 45%, ${muiTheme.palette.background.paper} 100%)`
          })}
        >
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Avatar sx={{ bgcolor: form.id ? 'warning.main' : 'primary.main', color: '#fff', width: 40, height: 40, boxShadow: 3 }}>
              <ShoppingCartIcon fontSize="small" />
            </Avatar>
            <Box>
              <Typography variant="h6">{form.id ? t('businessPurchases.actions.edit', 'Edit purchase') : t('businessPurchases.actions.new', 'New purchase')}</Typography>
              <Typography variant="caption" color="text.secondary">
                {t('businessPurchases.subtitle', 'Register business purchases and operational payments.')}
              </Typography>
            </Box>
            <Chip
              label={form.id ? t('businessPurchases.badge.edit', 'Edit') : t('businessPurchases.badge.new', 'New')}
              size="small"
              color={form.id ? 'warning' : 'primary'}
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
            background: (muiTheme) =>
              muiTheme.palette.mode === 'light'
                ? `linear-gradient(180deg, ${muiTheme.palette.primary.light}18 0%, ${muiTheme.palette.secondary.light}10 60%, ${muiTheme.palette.background.paper} 85%)`
                : muiTheme.palette.background.default,
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
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1, position: 'relative', zIndex: 1 }}>
            <Chip
              icon={<AutoAwesomeIcon fontSize="small" color={form.id ? 'warning' : 'primary'} />}
              label={form.id ? t('businessPurchases.badge.edit', 'Edit') : t('businessPurchases.badge.new', 'New')}
              color={form.id ? 'warning' : 'primary'}
              variant="outlined"
              sx={{ fontWeight: 700, borderRadius: 1.5, boxShadow: 1 }}
            />
            <Typography variant="caption" color="text.secondary">
              {t('businessPurchases.helper', 'Validate amounts and dates before saving.')}
            </Typography>
          </Stack>

          <Box
            sx={(muiTheme) => ({
              mb: 2,
              p: 1.25,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              bgcolor: muiTheme.palette.info.lighter,
              color: muiTheme.palette.info.dark,
              border: '1px dashed',
              borderColor: muiTheme.palette.info.main
            })}
          >
            <InfoOutlinedIcon fontSize="small" />
            <Typography variant="caption">
              {t('businessPurchases.tip', 'Purchase code, type, category, item and purchase date are required.')}
            </Typography>
          </Box>

          <Stack spacing={2} sx={{ position: 'relative', zIndex: 1 }}>
            <FormSection title={t('businessPurchases.sections.classification', 'Classification')} helper={t('businessPurchases.sections.classificationHelper', 'Identify the purchase and accounting context.') }>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={3}>
                  <TextField
                    required
                    label={t('businessPurchases.form.purchaseCode', 'Purchase code')}
                    value={form.purchaseCode}
                    onChange={handleFormChange('purchaseCode')}
                    fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <ReceiptLongIcon fontSize="small" color="primary" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth required sx={fieldSx}>
                    <InputLabel>{t('businessPurchases.form.purchaseType', 'Purchase type')}</InputLabel>
                    <Select value={form.purchaseType} label={t('businessPurchases.form.purchaseType', 'Purchase type')} onChange={handleFormChange('purchaseType')}>
                      {purchaseTypeOptions.map((opt) => (
                        <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <FormControl fullWidth required sx={fieldSx}>
                    <InputLabel>{t('businessPurchases.form.category', 'Category')}</InputLabel>
                    <Select value={form.category} label={t('businessPurchases.form.category', 'Category')} onChange={handleFormChange('category')}>
                      {categoryOptions.map((opt) => (
                        <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <FormControl fullWidth sx={fieldSx}>
                    <InputLabel>{t('businessPurchases.form.status', 'Status')}</InputLabel>
                    <Select value={form.status} label={t('businessPurchases.form.status', 'Status')} onChange={handleFormChange('status')}>
                      {statusOptions.map((opt) => (
                        <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <FormControl fullWidth sx={fieldSx}>
                    <InputLabel>{t('businessPurchases.form.businessArea', 'Business area')}</InputLabel>
                    <Select value={form.businessArea} label={t('businessPurchases.form.businessArea', 'Business area')} onChange={handleFormChange('businessArea')}>
                      {businessAreaOptions.map((opt) => (
                        <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </FormSection>

            <FormSection title={t('businessPurchases.sections.item', 'Item & amount')} helper={t('businessPurchases.sections.itemHelper', 'Cost detail and provider information.') }>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label={t('businessPurchases.form.providerName', 'Provider')}
                    value={form.providerName}
                    onChange={handleFormChange('providerName')}
                    fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BusinessIcon fontSize="small" color="action" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={8}>
                  <TextField
                    required
                    label={t('businessPurchases.form.itemName', 'Item name')}
                    value={form.itemName}
                    onChange={handleFormChange('itemName')}
                    fullWidth
                    sx={fieldSx}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label={t('businessPurchases.form.description', 'Description')}
                    value={form.description}
                    onChange={handleFormChange('description')}
                    fullWidth
                    sx={fieldSx}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField label={t('businessPurchases.form.quantity', 'Quantity')} type="number" value={form.quantity} onChange={handleFormChange('quantity')} fullWidth sx={fieldSx} />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField label={t('businessPurchases.form.unitCost', 'Unit cost')} type="number" value={form.unitCost} onChange={handleFormChange('unitCost')} fullWidth sx={fieldSx} />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField label={t('businessPurchases.form.totalAmount', 'Total amount')} type="number" value={form.totalAmount} onChange={handleFormChange('totalAmount')} fullWidth sx={fieldSx} />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <FormControl fullWidth sx={fieldSx}>
                    <InputLabel>{t('businessPurchases.form.currency', 'Currency')}</InputLabel>
                    <Select value={form.currency} label={t('businessPurchases.form.currency', 'Currency')} onChange={handleFormChange('currency')}>
                      {currencyOptions.map((opt) => (
                        <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField label={t('businessPurchases.form.exchangeRate', 'Exchange rate')} type="number" value={form.exchangeRate} onChange={handleFormChange('exchangeRate')} fullWidth sx={fieldSx} />
                </Grid>
              </Grid>
            </FormSection>

            <FormSection title={t('businessPurchases.sections.payment', 'Dates & payment')} helper={t('businessPurchases.sections.paymentHelper', 'Purchase lifecycle, due date and references.') }>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={3}>
                  <TextField
                    required
                    label={t('businessPurchases.form.purchaseDate', 'Purchase date')}
                    type="date"
                    value={form.purchaseDate}
                    onChange={handleFormChange('purchaseDate')}
                    fullWidth
                    sx={fieldSx}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EventAvailableIcon fontSize="small" color="primary" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    label={t('businessPurchases.form.dueDate', 'Due date')}
                    type="date"
                    value={form.dueDate}
                    onChange={handleFormChange('dueDate')}
                    fullWidth
                    sx={fieldSx}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    label={t('businessPurchases.form.paidAt', 'Paid at')}
                    type="datetime-local"
                    value={form.paidAt}
                    onChange={handleFormChange('paidAt')}
                    fullWidth
                    sx={fieldSx}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth sx={fieldSx}>
                    <InputLabel>{t('businessPurchases.form.paymentMethod', 'Payment method')}</InputLabel>
                    <Select value={form.paymentMethod} label={t('businessPurchases.form.paymentMethod', 'Payment method')} onChange={handleFormChange('paymentMethod')}>
                      <MenuItem value="">
                        <em>{t('businessPurchases.form.none', 'None')}</em>
                      </MenuItem>
                      {paymentMethodOptions.map((opt) => (
                        <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label={t('businessPurchases.form.paymentReference', 'Payment reference')} value={form.paymentReference} onChange={handleFormChange('paymentReference')} fullWidth sx={fieldSx} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label={t('businessPurchases.form.invoiceNumber', 'Invoice number')} value={form.invoiceNumber} onChange={handleFormChange('invoiceNumber')} fullWidth sx={fieldSx} />
                </Grid>
              </Grid>
            </FormSection>

            <FormSection title={t('businessPurchases.sections.recurring', 'Recurring setup')} helper={t('businessPurchases.sections.recurringHelper', 'Monthly/yearly recurring purchase flags.') }>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <FormControlLabel
                    control={<Switch checked={form.isRecurring} onChange={handleFormChange('isRecurring')} color="success" />}
                    label={t('businessPurchases.form.isRecurring', 'Recurring purchase')}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth sx={fieldSx} disabled={!form.isRecurring}>
                    <InputLabel>{t('businessPurchases.form.recurrenceType', 'Recurrence')}</InputLabel>
                    <Select value={form.recurrenceType} label={t('businessPurchases.form.recurrenceType', 'Recurrence')} onChange={handleFormChange('recurrenceType')}>
                      {recurrenceOptions.map((opt) => (
                        <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{t('businessPurchases.form.recurrenceHelper', 'Use NONE for one-time purchases.')}</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    label={t('businessPurchases.form.notes', 'Notes')}
                    value={form.notes}
                    onChange={handleFormChange('notes')}
                    fullWidth
                    multiline
                    minRows={3}
                    sx={fieldSx}
                  />
                </Grid>
              </Grid>
            </FormSection>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button variant="outlined" onClick={resetForm} disabled={sending} sx={{ borderRadius: 2 }} startIcon={<RefreshIcon />}>
            {t('businessPurchases.actions.clear', 'Clear')}
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={sending}
            startIcon={<RocketLaunchIcon />}
            sx={{ borderRadius: 2, boxShadow: '0 12px 28px rgba(0,0,0,0.16)', px: 2.4 }}
          >
            {sending
              ? t('businessPurchases.actions.saving', 'Saving...')
              : form.id
                ? t('businessPurchases.actions.save', 'Save changes')
                : t('businessPurchases.actions.create', 'Create')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDelete.open} onClose={() => setOpenDelete({ open: false, row: null })} maxWidth="xs" fullWidth fullScreen={isMobile}>
        <DialogTitle>
          <Typography variant="h6">{t('businessPurchases.delete.title', 'Delete purchase')}</Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Typography>
            {t('businessPurchases.delete.body', {
              defaultValue: 'Delete purchase {{code}}?',
              code: openDelete.row?.purchaseCode || ''
            })}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete({ open: false, row: null })} disabled={sending}>
            {t('businessPurchases.actions.cancel', 'Cancel')}
          </Button>
          <Button color="error" variant="contained" onClick={confirmDelete} disabled={sending}>
            {sending ? t('businessPurchases.actions.deleting', 'Deleting...') : t('businessPurchases.actions.delete', 'Delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
