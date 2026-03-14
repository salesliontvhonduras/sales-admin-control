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
import { useTheme, useMediaQuery } from '@mui/material';
import Avatar from '@mui/material/Avatar';

import RefreshIcon from '@mui/icons-material/Refresh';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SearchIcon from '@mui/icons-material/Search';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import LanIcon from '@mui/icons-material/Lan';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import LinkIcon from '@mui/icons-material/Link';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';

import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { lionTvApi, catalogsApi } from 'utils/api';

const statusColors = {
  PAID: 'success',
  PENDING: 'warning'
};
const statusIcons = {
  PAID: PaidOutlinedIcon,
  PENDING: PendingActionsIcon
};
const paymentMethodIcons = {
  'Bank Transfer': AccountBalanceIcon,
  Paypal: PaidOutlinedIcon,
  Ecommerce: ShoppingCartIcon,
  'Link pago': LinkIcon,
  'Debito Automatico': AutorenewIcon
};
const paymentMethodColors = {
  'Bank Transfer': 'info.main',
  Paypal: 'success.main',
  Ecommerce: 'secondary.main',
  'Link pago': 'info.main',
  'Debito Automatico': 'warning.main'
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

function formatDateTimePayload(value) {
  if (!value) return null;
  // value esperado: yyyy-MM-dd (desde input date)
  const base = value.slice(0, 10);
  return `${base}T00:00:00`;
}

function StatusChip({ status, label }) {
  const color = statusColors[status] || 'default';
  const Icon = statusIcons[status];
  return <Chip size="small" color={color} icon={Icon ? <Icon fontSize="small" /> : undefined} label={label || status || '-'} />;
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

function RowActions({ row, onEdit, onDelete, onSendInvoice, sendingInvoice }) {
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
          disabled={sendingInvoice}
          onClick={() => {
            setAnchorEl(null);
            onSendInvoice?.(row);
          }}
        >
          <MarkEmailReadIcon fontSize="small" style={{ marginRight: 8, color: '#2e7d32' }} />
          {sendingInvoice ? t('invoices.actions.sendingInvoice', 'Enviando factura...') : t('invoices.actions.sendInvoice', 'Enviar factura')}
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

function normalizeInvoice(item = {}) {
  return {
    invoiceId: item.invoiceId ?? item.id ?? null,
    serviceId: item.serviceId ?? null,
    paymentDate: item.paymentDate ?? null,
    amountPaid: item.amountPaid ?? 0,
    amountDiscount: item.amountDiscount ?? 0,
    status: (item.status ?? '').toUpperCase(),
    packageId: item.packageId ?? null,
    customerId: item.customerId ?? null,
    paymentMethod: item.paymentMethod ?? '',
    bankId: item.bankId ?? null,
    notes: item.notes ?? '',
    createdAt: item.createdAt ?? null,
    updatedAt: item.updatedAt ?? null,
    customer_name: item.customer_name ?? '',
    customerName: item.customerName ?? item.customer_name ?? ''
  };
}

const createDefaultForm = () => {
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  const todayStr = today.toISOString().slice(0, 10);
  return {
    invoiceId: null,
    serviceId: '',
    paymentDate: todayStr,
    amountPaid: '',
    amountDiscount: '',
    status: 'PENDING',
    packageId: '',
    customerId: '',
    paymentMethod: '',
    bankId: '',
    notes: ''
  };
};

export default function InvoicesLionTv() {
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

  const [openModal, setOpenModal] = useState(false);
  const [openDelete, setOpenDelete] = useState({ open: false, row: null });
  const [form, setForm] = useState(() => createDefaultForm());
  const [sending, setSending] = useState(false);
  const [sendingInvoiceId, setSendingInvoiceId] = useState(null);

  const [customers, setCustomers] = useState([]);
  const [customersLoading, setCustomersLoading] = useState(false);
  const [packages, setPackages] = useState([]);
  const [packagesLoading, setPackagesLoading] = useState(false);
  const [banks, setBanks] = useState([]);
  const [banksLoading, setBanksLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);

  const statusOptions = useMemo(() => ['PAID', 'PENDING'], []);

  const statusLabel = useCallback(
    (value) => (value === 'PAID' ? t('invoices.form.states.paid') : t('invoices.form.states.pending')),
    [t]
  );

  const paymentMethodLabel = useCallback(
    (value) => {
      switch (value) {
        case 'Bank Transfer':
          return t('invoices.form.paymentMethods.bank');
        case 'Paypal':
          return t('invoices.form.paymentMethods.paypal');
        case 'Ecommerce':
          return t('invoices.form.paymentMethods.ecommerce');
        case 'Link pago':
          return t('invoices.form.paymentMethods.link');
        case 'Debito Automatico':
          return t('invoices.form.paymentMethods.debit');
        default:
          return value || t('invoices.form.placeholderSelect');
      }
    },
    [t]
  );

  const paymentMethodOptions = useMemo(
    () => [
      { value: 'Bank Transfer', label: t('invoices.form.paymentMethods.bank') },
      { value: 'Paypal', label: t('invoices.form.paymentMethods.paypal') },
      { value: 'Ecommerce', label: t('invoices.form.paymentMethods.ecommerce') },
      { value: 'Link pago', label: t('invoices.form.paymentMethods.link') },
      { value: 'Debito Automatico', label: t('invoices.form.paymentMethods.debit') }
    ],
    [t]
  );

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

  const loadInvoices = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const res = await lionTvApi.get('/invoices/v1', {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { index: 0, size: 5000 },
        skipAuthRedirect: true
      });
      const payload = res?.data?.data ?? res?.data ?? {};
      const raw = payload.data ?? payload.items ?? payload.content ?? payload ?? [];
      const items = Array.isArray(raw) ? raw : [];
      const normalized = items.map(normalizeInvoice).map((inv) => ({
        ...inv,
        customerName: inv.customerName || customerNameMap[inv.customerId] || inv.customer_name || ''
      }));
      setRows(normalized);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || err.message || t('invoices.table.loading'), {
          variant: 'error'
        });
      }
    } finally {
      setLoading(false);
    }
  }, [accessToken, enqueueSnackbar, t]);

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
      const sorted = list.sort((a, b) => {
        const aName = (a.customerFullname || a.fullName || a.username || a.customerMail || '').toString().toLowerCase();
        const bName = (b.customerFullname || b.fullName || b.username || b.customerMail || '').toString().toLowerCase();
        return aName.localeCompare(bName);
      });
      setCustomers(sorted);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(t('invoices.table.loading'), { variant: 'warning' });
      }
    } finally {
      setCustomersLoading(false);
    }
  }, [accessToken, enqueueSnackbar, t]);

  const loadPackages = useCallback(async () => {
    setPackagesLoading(true);
    try {
      const response = await lionTvApi.get('/packages/v1/list-packages', {
        params: { index: 0, size: 200, start: 0, filters: '', sorting: '' }
      });
      const list = response?.data?.data?.data || [];
      const filtered = (Array.isArray(list) ? list : []).filter(
        (pkg) => !String(pkg?.name || '').trim().toUpperCase().startsWith('DEMO')
      );
      setPackages(filtered);
    } catch (err) {
      enqueueSnackbar(t('invoices.table.loading'), { variant: 'warning' });
    } finally {
      setPackagesLoading(false);
    }
  }, [enqueueSnackbar, t]);

  const loadBanks = useCallback(async () => {
    setBanksLoading(true);
    try {
      const response = await catalogsApi.get('/banks/v1');
      const list = response?.data?.data ?? response?.data ?? [];
      setBanks(Array.isArray(list) ? list : []);
    } catch (err) {
      enqueueSnackbar(t('invoices.table.loading'), { variant: 'warning' });
    } finally {
      setBanksLoading(false);
    }
  }, [enqueueSnackbar, t]);

  const loadServices = useCallback(async () => {
    setServicesLoading(true);
    try {
      const response = await catalogsApi.get('/services/v1');
      const list = response?.data?.data ?? response?.data ?? [];
      setServices(Array.isArray(list) ? list : []);
    } catch (err) {
      enqueueSnackbar(t('invoices.table.loading'), { variant: 'warning' });
    } finally {
      setServicesLoading(false);
    }
  }, [enqueueSnackbar, t]);

  useEffect(() => {
    loadInvoices();
    loadCustomers();
    loadPackages();
    loadBanks();
    loadServices();
  }, [loadInvoices, loadCustomers, loadPackages, loadBanks, loadServices, refreshKey]);

  useEffect(() => {
    if (!customerNameMap || Object.keys(customerNameMap).length === 0) return;
    let changed = false;
    const updated = rows.map((row) => {
      const name = row.customerName || customerNameMap[row.customerId] || row.customer_name || '';
      if (name !== row.customerName) {
        changed = true;
        return { ...row, customerName: name };
      }
      return row;
    });
    if (changed) setRows(updated);
  }, [customerNameMap, rows]);
  const filteredRows = useMemo(() => {
    if (!search && !statusFilter) return rows;
    const term = search.toLowerCase();
    return rows.filter((row) => {
      if (statusFilter && (row.status || '').toUpperCase() !== statusFilter.toUpperCase()) return false;
      return (
        String(row.invoiceId || '').toLowerCase().includes(term) ||
        String(row.customerId || '').toLowerCase().includes(term) ||
        (row.customerName || row.customer_name || '').toLowerCase().includes(term) ||
        String(row.packageId || '').toLowerCase().includes(term) ||
        (row.status || '').toLowerCase().includes(term) ||
        (row.paymentMethod || '').toLowerCase().includes(term)
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
    () => ({
      total: rows.length,
      paid: rows.filter((r) => r.status === 'PAID').length,
      pending: rows.filter((r) => r.status === 'PENDING').length
    }),
    [rows]
  );

  const resetForm = () => setForm(createDefaultForm());

  const handleFormChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleEdit = (row) => {
    setForm({
      invoiceId: row.invoiceId,
      serviceId: row.serviceId ?? '',
      paymentDate: formatDateInput(row.paymentDate),
      amountPaid: row.amountPaid ?? '',
      amountDiscount: row.amountDiscount ?? '',
      status: row.status ? row.status.toUpperCase() : 'PENDING',
      packageId: row.packageId ?? '',
      customerId: row.customerId ?? '',
      paymentMethod: row.paymentMethod ?? '',
      bankId: row.bankId ?? '',
      notes: row.notes ?? ''
    });
    setOpenModal(true);
  };

  const handleDelete = (row) => {
    setOpenDelete({ open: true, row });
  };

  const handleSendInvoice = async (row) => {
    const invoiceId = row?.invoiceId;
    if (!invoiceId) {
      enqueueSnackbar(t('invoices.actions.sendInvoiceError', 'No se pudo identificar la factura.'), { variant: 'error' });
      return;
    }

    setSendingInvoiceId(invoiceId);
    try {
      await lionTvApi.post(
        `/invoices/v1/${invoiceId}/send-invoice`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          skipAuthRedirect: true
        }
      );
      enqueueSnackbar(t('invoices.actions.sendInvoiceSuccess', 'Factura enviada por correo.'), { variant: 'success' });
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || err.message || t('invoices.actions.sendInvoiceError', 'No se pudo enviar la factura.'), {
          variant: 'error'
        });
      }
    } finally {
      setSendingInvoiceId(null);
    }
  };

  const handleSave = async () => {
    if (!form.serviceId || !form.paymentDate || !form.packageId || !form.customerId || !form.paymentMethod) {
      enqueueSnackbar(t('invoices.messages.required'), { variant: 'warning' });
      return;
    }

    if (form.paymentMethod === 'Bank Transfer' && !form.bankId) {
      enqueueSnackbar(t('invoices.messages.needBank'), { variant: 'warning' });
      return;
    }

    const payload = {
      serviceId: Number(form.serviceId),
      paymentDate: formatDateTimePayload(form.paymentDate),
      amountPaid: form.amountPaid ? Number(form.amountPaid) : 0,
      amountDiscount: form.amountDiscount ? Number(form.amountDiscount) : 0,
      status: form.status || 'Pending',
      packageId: Number(form.packageId),
      customerId: Number(form.customerId),
      paymentMethod: form.paymentMethod,
      bankId: form.paymentMethod === 'Bank Transfer' && form.bankId ? Number(form.bankId) : null,
      notes: form.notes
    };

    setSending(true);
    try {
      if (form.invoiceId) {
        await lionTvApi.put(`/invoices/v1/${form.invoiceId}`, payload, {
          headers: { Authorization: `Bearer ${accessToken}` },
          skipAuthRedirect: true
        });
        enqueueSnackbar(t('invoices.messages.updated'), { variant: 'success' });
      } else {
        await lionTvApi.post('/invoices/v1', payload, {
          headers: { Authorization: `Bearer ${accessToken}` },
          skipAuthRedirect: true
        });
        enqueueSnackbar(t('invoices.messages.created'), { variant: 'success' });
      }
      setOpenModal(false);
      resetForm();
      setRefreshKey((v) => v + 1);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || err.message || t('invoices.messages.required'), {
          variant: 'error'
        });
      }
    } finally {
      setSending(false);
    }
  };

  const confirmDelete = async () => {
    const row = openDelete.row;
    if (!row?.invoiceId) {
      setOpenDelete({ open: false, row: null });
      return;
    }
    setSending(true);
    try {
      await lionTvApi.delete(`/invoices/v1/${row.invoiceId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        skipAuthRedirect: true
      });
      enqueueSnackbar(t('invoices.messages.deleted'), { variant: 'success' });
      setOpenDelete({ open: false, row: null });
      setRefreshKey((v) => v + 1);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || err.message || t('invoices.messages.deleted'), {
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
        title={t('invoices.title')}
        secondary={
          <Stack direction="row" spacing={1.25}>
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
              onClick={() => setOpenModal(true)}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                px: 2.5,
                boxShadow: '0 10px 24px rgba(0,0,0,0.12)'
              }}
            >
              {t('actions.newInvoice')}
            </Button>
          </Stack>
        }
      >
        <Grid container spacing={gridSpacing}>
          {[
            { label: t('invoices.summary.total', { count: summary.total }), icon: ReceiptLongIcon, color: 'primary.main' },
            { label: t('invoices.summary.paid', { count: summary.paid }), icon: PaidOutlinedIcon, color: 'success.main' },
            { label: t('invoices.summary.pending', { count: summary.pending }), icon: PendingActionsIcon, color: 'warning.main' }
          ].map((item, idx) => (
            <Grid item xs={12} sm={4} md={4} key={idx}>
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
                    bgcolor: theme.palette.mode === 'light' ? `${item.color}` : theme.palette.primary.dark,
                    color: theme.palette.getContrastText(theme.palette.primary.main),
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
        title={t('invoices.search')}
        secondary={
          <Paper
            elevation={0}
            sx={(theme) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              width: { xs: '100%', sm: 520 },
              p: 1,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              background:
                theme.palette.mode === 'light'
                  ? `linear-gradient(120deg, ${theme.palette.primary.light}12 0%, ${theme.palette.secondary.light}12 100%)`
                  : theme.palette.background.paper,
              boxShadow: '0 8px 18px rgba(0,0,0,0.05)'
            })}
          >
            <TextField
              size="small"
              placeholder={t('invoices.search')}
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
              <InputLabel>{t('invoices.filters.status')}</InputLabel>
              <Select
                value={statusFilter}
                label={t('invoices.filters.status')}
                onChange={(e) => setStatusFilter(e.target.value)}
                renderValue={(val) => (val ? statusLabel(val) : t('invoices.filters.all'))}
                startAdornment={
                  <InputAdornment position="start">
                    <PaidOutlinedIcon fontSize="small" />
                  </InputAdornment>
                }
              >
                <MenuItem value="">
                  <em>{t('invoices.filters.all')}</em>
                </MenuItem>
                {statusOptions.map((s) => (
                  <MenuItem key={s} value={s}>
                    {statusLabel(s)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>
        }
      >
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
          <Table size="small">
            <TableHead>
              <TableRow
                sx={(theme) => ({
                  bgcolor: theme.palette.mode === 'light' ? '#f7f9fc' : theme.palette.background.default,
                  borderBottom: `1px solid ${theme.palette.divider}`
                })}
              >
                <TableCell>{t('invoices.headers.id')}</TableCell>
                <TableCell>{t('invoices.headers.customer')}</TableCell>
                <TableCell>{t('invoices.headers.service')}</TableCell>
                <TableCell>{t('invoices.headers.package')}</TableCell>
                <TableCell>{t('invoices.headers.bank')}</TableCell>
                <TableCell>{t('invoices.headers.method')}</TableCell>
                <TableCell>{t('invoices.headers.status')}</TableCell>
                <TableCell>{t('invoices.headers.payment')}</TableCell>
                <TableCell>{t('invoices.headers.discount')}</TableCell>
                <TableCell>{t('invoices.headers.paymentDate')}</TableCell>
                <TableCell>{t('invoices.headers.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.map((row) => (
                <TableRow
                  key={row.invoiceId}
                  hover
                  sx={{
                    '&:nth-of-type(odd)': { bgcolor: 'background.paper' },
                    transition: 'background 0.2s ease'
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
                        <ReceiptLongIcon fontSize="small" />
                      </Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        #{row.invoiceId}
                      </Typography>
                    </Stack>
                  </TableCell>
                <TableCell>
                  <Typography variant="subtitle2">{row.customerName || row.customer_name || '-'}</Typography>
                </TableCell>
                  <TableCell>{row.serviceId || '-'}</TableCell>
                  <TableCell>{row.packageId || '-'}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      variant="outlined"
                      icon={<AccountBalanceIcon fontSize="small" color="info" />}
                      label={row.bankId || '-'}
                      sx={{
                        fontWeight: 600,
                        borderColor: 'divider',
                        bgcolor: 'background.paper',
                        color: 'text.primary'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      variant="outlined"
                      icon={
                        (() => {
                          const IconComp = paymentMethodIcons[row.paymentMethod] || CreditScoreIcon;
                          return <IconComp fontSize="small" color="info" />;
                        })()
                      }
                      label={paymentMethodLabel(row.paymentMethod)}
                      sx={{
                        fontWeight: 600,
                        borderColor: 'divider',
                        bgcolor: 'background.paper',
                        color: 'text.primary'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <StatusChip status={row.status} label={statusLabel(row.status)} />
                  </TableCell>
                  <TableCell>
                  <Chip
                    size="small"
                    variant="outlined"
                    icon={<MonetizationOnIcon fontSize="small" color="success" />}
                    label={`L ${Number(row.amountPaid || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                    sx={{
                      fontWeight: 600,
                      borderColor: 'divider',
                      bgcolor: 'background.paper',
                      color: 'text.primary'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                  <Chip
                    size="small"
                    variant="outlined"
                    icon={<MonetizationOnIcon fontSize="small" color="warning" />}
                    label={`L ${Number(row.amountDiscount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                    sx={{
                      fontWeight: 600,
                      borderColor: 'divider',
                      bgcolor: 'background.paper',
                      color: 'text.primary'
                      }}
                    />
                  </TableCell>
                  <TableCell>{formatDate(row.paymentDate)}</TableCell>
                  <TableCell align="right">
                    <RowActions
                      row={row}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onSendInvoice={handleSendInvoice}
                      sendingInvoice={sendingInvoiceId === row.invoiceId}
                    />
                  </TableCell>
                </TableRow>
              ))}
              {!loading && filteredRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={11} align="center" sx={{ py: 6 }}>
                    <Stack spacing={1} alignItems="center">
                      <Avatar sx={{ bgcolor: 'primary.lighter', color: 'primary.main' }}>
                        <ReceiptLongIcon />
                      </Avatar>
                      <Typography variant="subtitle1">{t('invoices.table.emptyTitle')}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t('invoices.table.emptyText')}
                      </Typography>
                      <Button variant="contained" onClick={() => setOpenModal(true)} size="small">
                        {t('actions.newInvoice')}
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              )}
              {loading && (
                <TableRow>
                  <TableCell colSpan={11} align="center" sx={{ py: 4 }}>
                    <Stack spacing={1} alignItems="center">
                      <Avatar sx={{ bgcolor: 'primary.lighter', color: 'primary.main' }}>
                        <RefreshIcon />
                      </Avatar>
                      <Typography variant="body2" color="text.secondary">
                        {t('invoices.table.loading')}
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
        maxWidth="md"
        fullScreen={isMobile}
        PaperProps={{
          sx: (theme) => ({
            borderRadius: 3,
            boxShadow: '0 18px 40px rgba(0,0,0,0.18)',
            border: '1px solid',
            borderColor: form.invoiceId ? theme.palette.warning.light : theme.palette.primary.light,
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
            background: form.invoiceId
              ? `linear-gradient(135deg, ${theme.palette.warning.light}40 0%, ${theme.palette.secondary.light}20 45%, ${theme.palette.background.paper} 100%)`
              : `linear-gradient(135deg, ${theme.palette.primary.light}40 0%, ${theme.palette.secondary.light}20 45%, ${theme.palette.background.paper} 100%)`
          })}
        >
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Avatar
              sx={{
                bgcolor: form.invoiceId ? 'warning.main' : 'primary.main',
                color: 'primary.contrastText',
                width: 40,
                height: 40,
                boxShadow: 3
              }}
            >
              <ReceiptLongIcon fontSize="small" />
            </Avatar>
            <Box>
              <Typography variant="h6">{form.invoiceId ? t('invoices.edit') : t('actions.newInvoice')}</Typography>
              <Typography variant="caption" color="text.secondary">
                {t('invoices.dialogSubtitle')}
              </Typography>
            </Box>
            <Chip
              label={form.invoiceId ? t('invoices.badge.edit') : t('invoices.badge.new')}
              size="small"
              color={form.invoiceId ? 'warning' : 'primary'}
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
              content: '\"\"',
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
              icon={<AutoAwesomeIcon fontSize="small" color={form.invoiceId ? 'warning' : 'primary'} />}
              label={form.invoiceId ? t('invoices.badge.edit') : t('invoices.badge.new')}
              color={form.invoiceId ? 'warning' : 'primary'}
              variant="outlined"
              sx={{ fontWeight: 700, borderRadius: 1.5, boxShadow: 1 }}
            />
            <Typography variant="caption" color="text.secondary">
              {t('invoices.form.helperTone', 'Revisa montos y fechas antes de guardar.')}
            </Typography>
          </Stack>

          <Box
            sx={(theme) => ({
              mb: 2,
              p: 1.25,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              bgcolor: theme.palette.info.lighter,
              color: theme.palette.info.dark,
              border: '1px dashed',
              borderColor: theme.palette.info.main
            })}
          >
            <InfoOutlinedIcon fontSize="small" />
            <Typography variant="caption">
              {form.invoiceId ? t('invoices.form.tips.edit') : t('invoices.form.tips.new')}
            </Typography>
          </Box>

          <Stack spacing={2} sx={{ position: 'relative', zIndex: 1 }}>
            <FormSection title={t('invoices.form.sections.assignment')} helper={t('invoices.form.sections.assignmentHelper')}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={3} md={3}>
                  <FormControl fullWidth required sx={fieldSx} disabled={customersLoading}>
                    <InputLabel>{t('invoices.form.customer')}</InputLabel>
                    <Select
                      value={form.customerId}
                      label={t('invoices.form.customer')}
                      onChange={handleFormChange('customerId')}
                      startAdornment={
                        <InputAdornment position="start">
                          <PersonAddAlt1Icon fontSize="small" color="secondary" />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="">
                        <em>{t('invoices.form.placeholderSelect')}</em>
                      </MenuItem>
                      {(customers || []).map((c) => (
                        <MenuItem key={c.customerId || c.id} value={c.customerId || c.id}>
                          {c.customerFullname || c.fullName || c.username || c.customerMail}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {customersLoading ? t('invoices.form.helperLoading') : t('invoices.form.helperCustomer')}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3} md={3}>
                  <FormControl fullWidth required sx={fieldSx} disabled={servicesLoading}>
                    <InputLabel>{t('invoices.form.service')}</InputLabel>
                    <Select
                      value={form.serviceId}
                      label={t('invoices.form.service')}
                      onChange={handleFormChange('serviceId')}
                      startAdornment={
                        <InputAdornment position="start">
                          <LanIcon fontSize="small" color="primary" />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="">
                        <em>{t('invoices.form.placeholderSelect')}</em>
                      </MenuItem>
                      {(services || []).map((s) => (
                        <MenuItem key={s.id || s.serviceId} value={s.id || s.serviceId}>
                          {s.name || s.description || s.serviceName || s.id}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {servicesLoading ? t('invoices.form.helperLoading') : t('invoices.form.helperService')}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3} md={3}>
                  <FormControl fullWidth required sx={fieldSx} disabled={packagesLoading}>
                    <InputLabel>{t('invoices.form.package')}</InputLabel>
                    <Select
                      value={form.packageId}
                      label={t('invoices.form.package')}
                      onChange={handleFormChange('packageId')}
                      startAdornment={
                        <InputAdornment position="start">
                          <Inventory2Icon fontSize="small" color="warning" />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="">
                        <em>{t('invoices.form.placeholderSelect')}</em>
                      </MenuItem>
                      {(packages || []).map((p) => (
                        <MenuItem key={p.id} value={p.id}>
                          {p.name || p.id}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {packagesLoading ? t('invoices.form.helperLoading') : t('invoices.form.helperPackage')}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3} md={3}>
                  <FormControl
                    fullWidth
                    sx={fieldSx}
                    disabled={banksLoading || form.paymentMethod !== 'Bank Transfer'}
                    required={form.paymentMethod === 'Bank Transfer'}
                  >
                    <InputLabel>{t('invoices.form.bank')}</InputLabel>
                    <Select
                      value={form.bankId}
                      label={t('invoices.form.bank')}
                      onChange={handleFormChange('bankId')}
                      startAdornment={
                        <InputAdornment position="start">
                          <AccountBalanceIcon fontSize="small" color="info" />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="">
                        <em>{t('invoices.form.placeholderSelect')}</em>
                      </MenuItem>
                      {(banks || []).map((b) => (
                        <MenuItem key={b.id || b.bankId} value={b.id || b.bankId}>
                          {b.bank || b.name || b.id}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {banksLoading ? t('invoices.form.helperLoading') : t('invoices.form.helperBank')}
                    </FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
            </FormSection>

            <FormSection title={t('invoices.form.sections.payment')} helper={t('invoices.form.sections.paymentHelper')}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4} md={4}>
                  <TextField
                    required
                    label={t('invoices.form.paymentDate')}
                    type="date"
                    value={form.paymentDate}
                    onChange={handleFormChange('paymentDate')}
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
                <Grid item xs={12} sm={4} md={4}>
                  <TextField
                    label={t('invoices.form.amountPaid')}
                    type="number"
                    value={form.amountPaid}
                    onChange={handleFormChange('amountPaid')}
                    fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Typography variant="subtitle2" color="success.main" sx={{ fontWeight: 700 }}>
                            L
                          </Typography>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4} md={4}>
                  <TextField
                    label={t('invoices.form.amountDiscount')}
                    type="number"
                    value={form.amountDiscount}
                    onChange={handleFormChange('amountDiscount')}
                    fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Typography variant="subtitle2" color="warning.main" sx={{ fontWeight: 700 }}>
                            L
                          </Typography>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
              </Grid>
            </FormSection>

            <FormSection title={t('invoices.form.sections.method')} helper={t('invoices.form.sections.methodHelper')}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4} md={4}>
                  <FormControl fullWidth required sx={fieldSx}>
                    <InputLabel shrink id="payment-method-label">
                      {t('invoices.form.paymentMethod')}
                    </InputLabel>
                    <Select
                      labelId="payment-method-label"
                      id="payment-method-select"
                      value={form.paymentMethod}
                      label={t('invoices.form.paymentMethod')}
                      onChange={handleFormChange('paymentMethod')}
                      displayEmpty
                      sx={(theme) => {
                        const currentColor =
                          paymentMethodColors[form.paymentMethod] || theme.palette.primary.main;
                        return {
                          '& .MuiSelect-select': {
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.75,
                            py: 1
                          },
                          '& .MuiSelect-icon': {
                            color: currentColor
                          }
                        };
                      }}
                      renderValue={(val) => {
                        const IconComp = paymentMethodIcons[val] || CreditScoreIcon;
                        const color = paymentMethodColors[val] || 'primary.main';
                        if (!val) {
                          return (
                            <Stack direction="row" spacing={1} alignItems="center">
                              <IconComp fontSize="small" sx={{ color }} />
                              <span>{t('invoices.form.placeholderSelect')}</span>
                            </Stack>
                          );
                        }
                        return (
                          <Stack direction="row" spacing={1} alignItems="center">
                            <IconComp fontSize="small" sx={{ color }} />
                            <span>{paymentMethodLabel(val)}</span>
                          </Stack>
                        );
                      }}
                    >
                      <MenuItem value="">
                        <em>{t('invoices.form.placeholderSelect')}</em>
                      </MenuItem>
                      {paymentMethodOptions.map((m) => (
                        <MenuItem key={m.value} value={m.value}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            {(() => {
                              const IconComp = paymentMethodIcons[m.value] || CreditScoreIcon;
                              return (
                                <IconComp
                                  fontSize="small"
                                  sx={{ color: paymentMethodColors[m.value] || 'primary.main' }}
                                />
                              );
                            })()}
                            <span>{m.label}</span>
                          </Stack>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4} md={4}>
                  <FormControl fullWidth required sx={fieldSx}>
                    <InputLabel>{t('invoices.form.status')}</InputLabel>
                    <Select
                      value={form.status}
                      label={t('invoices.form.status')}
                      onChange={handleFormChange('status')}
                      startAdornment={
                        <InputAdornment position="start">
                          <PaidOutlinedIcon fontSize="small" color="success" />
                        </InputAdornment>
                      }
                    >
                      {statusOptions.map((st) => (
                        <MenuItem key={st} value={st}>
                          {st === 'PAID' ? t('invoices.form.states.paid') : t('invoices.form.states.pending')}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4} md={4}>
                  <TextField
                    label={t('invoices.form.notes')}
                    value={form.notes}
                    onChange={handleFormChange('notes')}
                    fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EventRepeatIcon fontSize="small" color="secondary" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
              </Grid>
            </FormSection>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button variant="outlined" onClick={resetForm} disabled={sending} sx={{ borderRadius: 2 }} startIcon={<RefreshIcon />}>
            {t('invoices.form.buttons.clear')}
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={sending}
            startIcon={<RocketLaunchIcon />}
            sx={{ borderRadius: 2, boxShadow: '0 12px 28px rgba(0,0,0,0.16)', px: 2.4 }}
          >
            {sending
              ? t('invoices.form.buttons.saving')
              : form.invoiceId
                ? t('invoices.form.buttons.save')
                : t('invoices.form.buttons.create')}
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
        <DialogTitle
          sx={(theme) => ({
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            background: `linear-gradient(135deg, ${theme.palette.error.light}45 0%, ${theme.palette.secondary.light}15 60%, ${theme.palette.background.paper} 100%)`
          })}
        >
          <Avatar sx={{ bgcolor: 'error.main', color: 'error.contrastText', width: 40, height: 40, boxShadow: 3 }}>
            <WarningAmberIcon fontSize="small" />
          </Avatar>
          <Typography variant="h6">{t('invoices.delete.title')}</Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" sx={{ mb: 1 }}>
            {t('invoices.delete.body', { id: openDelete.row?.invoiceId || '' })}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('customers.form.deleteSubtitle')}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setOpenDelete({ open: false, row: null })} disabled={sending} sx={{ borderRadius: 2 }}>
            {t('invoices.form.buttons.cancel')}
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={confirmDelete}
            disabled={sending}
            sx={{ borderRadius: 2, boxShadow: '0 10px 24px rgba(0,0,0,0.16)' }}
          >
            {sending ? t('invoices.form.buttons.deleting') : t('invoices.form.buttons.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
