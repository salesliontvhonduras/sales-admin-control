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
import Skeleton from '@mui/material/Skeleton';
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
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import TagIcon from '@mui/icons-material/Tag';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import DescriptionIcon from '@mui/icons-material/Description';
import NumbersIcon from '@mui/icons-material/Numbers';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PaymentIcon from '@mui/icons-material/Payment';
import PinIcon from '@mui/icons-material/Pin';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import RepeatIcon from '@mui/icons-material/Repeat';
import NoteAltIcon from '@mui/icons-material/NoteAlt';

import MainCard from 'ui-component/cards/MainCard';
import LionMetricCard from 'ui-component/cards/LionMetricCard';
import DialogTitleWithClose from 'ui-component/dialogs/DialogTitleWithClose';
import MobileFieldGrid from 'ui-component/responsive/MobileFieldGrid';
import MobileSummaryCard from 'ui-component/responsive/MobileSummaryCard';
import ResponsiveActionBar from 'ui-component/responsive/ResponsiveActionBar';
import ResponsiveEntityView from 'ui-component/responsive/ResponsiveEntityView';
import ResponsiveFilters from 'ui-component/responsive/ResponsiveFilters';
import { gridSpacing } from 'store/constant';
import { lionTvApi } from 'utils/api';
import { withAlpha } from 'utils/colorUtils';

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
  borderColor: withAlpha(theme.vars?.palette?.divider || theme.palette.divider, 0.95),
  boxShadow:
    theme.palette.mode === 'dark'
      ? `0 16px 36px ${withAlpha('#020817', 0.52)}`
      : `0 14px 34px ${withAlpha('#0f172a', 0.12)}`,
  backgroundColor: theme.vars?.palette?.surface?.card || theme.palette.background.paper,
  backgroundImage:
    theme.palette.mode === 'dark'
      ? `linear-gradient(150deg, ${withAlpha(theme.vars?.palette?.primary?.main || theme.palette.primary.main, 0.22)} 0%, ${withAlpha(theme.vars?.palette?.secondary?.main || theme.palette.secondary.main, 0.14)} 52%, ${theme.vars?.palette?.surface?.card || theme.palette.background.paper} 100%)`
      : `linear-gradient(150deg, ${withAlpha(theme.vars?.palette?.primary?.main || theme.palette.primary.main, 0.1)} 0%, ${withAlpha(theme.vars?.palette?.secondary?.main || theme.palette.secondary.main, 0.08)} 52%, ${theme.vars?.palette?.surface?.card || theme.palette.background.paper} 100%)`
});

const sectionSx = {
  p: 2,
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
  bgcolor: 'background.paper'
};

const purchaseTypeOptions = [
  { value: 'VIVO_PLAYER_CREDITS', label: 'Vivo Player Credits' },
  { value: 'IBO_PLAYER_CREDITS', label: 'Ibo Player Credits' },
  { value: 'SMART_ONE_CREDITS', label: 'Smart One Credits' },
  { value: 'PANEL_TITAN_CREDITS', label: 'Panel Titan Credits' },
  { value: 'LION_TV_CREDITS', label: 'Lion TV Credits' },
  { value: 'SHOPIFY_PAYMENT', label: 'Shopify Payment' },
  { value: 'BANRURAL_POS_PAYMENT', label: 'Banrural POS Payment' },
  { value: 'DOMAIN_PAYMENT', label: 'Domain Payment' },
  { value: 'DEMO_LICENSE_PAYMENT', label: 'Demo License Payment' },
  { value: 'HOUSE_MONTHLY_LICENSE', label: 'House Monthly License' },
  { value: 'OTHER', label: 'Other' }
];

const categoryOptions = [
  { value: 'CREDITS', label: 'Credits' },
  { value: 'PLATFORM_PAYMENT', label: 'Platform Payment' },
  { value: 'DOMAIN', label: 'Domain' },
  { value: 'LICENSE', label: 'License' },
  { value: 'POS', label: 'POS' },
  { value: 'OTHER', label: 'Other' }
];
const currencyOptions = [
  { value: 'HNL', label: 'HNL' },
  { value: 'USD', label: 'USD' },
  { value: 'GTQ', label: 'GTQ' },
  { value: 'EUR', label: 'EUR' }
];
const paymentMethodOptions = [
  { value: 'CASH', label: 'Cash' },
  { value: 'BANK_TRANSFER', label: 'Bank transfer' },
  { value: 'CARD', label: 'Card' },
  { value: 'PAYPAL', label: 'PayPal' },
  { value: 'BANRURAL_POS', label: 'Banrural POS' },
  { value: 'SHOPIFY', label: 'Shopify' },
  { value: 'CRYPTO', label: 'Crypto' },
  { value: 'OTHER', label: 'Other' }
];
const businessAreaOptions = [
  { value: 'IPTV', label: 'IPTV' },
  { value: 'WEB', label: 'Web' },
  { value: 'BILLING', label: 'Billing' },
  { value: 'MARKETING', label: 'Marketing' },
  { value: 'OPERATIONS', label: 'Operations' },
  { value: 'OTHER', label: 'Other' }
];
const statusOptions = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'PAID', label: 'Paid' },
  { value: 'PARTIAL', label: 'Partial' },
  { value: 'CANCELLED', label: 'Cancelled' }
];
const recurrenceOptions = [
  { value: 'NONE', label: 'None' },
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'YEARLY', label: 'Yearly' },
  { value: 'WEEKLY', label: 'Weekly' }
];

const paymentMethodChipColors = {
  CASH: 'success',
  BANK_TRANSFER: 'info',
  CARD: 'secondary',
  PAYPAL: 'primary',
  BANRURAL_POS: 'warning',
  SHOPIFY: 'info',
  CRYPTO: 'secondary',
  OTHER: 'default'
};

function optionLabel(options, value, fallback = '-') {
  if (!value) return fallback;
  const item = options.find((opt) => opt.value === value);
  return item?.label || value;
}

function toSafeNumber(value) {
  if (value === null || value === undefined || value === '') return 0;
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;

  let normalized = String(value).trim();
  if (!normalized) return 0;
  normalized = normalized.replace(/[^\d,.-]/g, '');

  if (normalized.includes(',') && normalized.includes('.')) {
    normalized = normalized.replace(/,/g, '');
  } else if (normalized.includes(',') && !normalized.includes('.')) {
    normalized = normalized.replace(',', '.');
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

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
  const { t } = useTranslation();
  const color = statusColors[status] || 'default';
  return <Chip size="small" color={color} label={t(`businessPurchases.enums.status.${status}`, optionLabel(statusOptions, status, '-'))} />;
}

function FormSection({ title, helper, icon: Icon, children }) {
  return (
    <Box
      sx={(theme) => ({
        ...sectionSx,
        position: 'relative',
        overflow: 'hidden',
        borderLeft: `4px solid ${withAlpha(theme.vars?.palette?.primary?.main || theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.62 : 0.36)}`,
        borderColor: withAlpha(theme.vars?.palette?.divider || theme.palette.divider, 0.9),
        backgroundColor: theme.vars?.palette?.surface?.card || theme.palette.background.paper,
        backgroundImage:
          theme.palette.mode === 'dark'
            ? `linear-gradient(145deg, ${withAlpha(theme.vars?.palette?.primary?.main || theme.palette.primary.main, 0.08)} 0%, ${withAlpha(theme.vars?.palette?.secondary?.main || theme.palette.secondary.main, 0.04)} 100%)`
            : `linear-gradient(145deg, ${withAlpha(theme.vars?.palette?.primary?.main || theme.palette.primary.main, 0.05)} 0%, ${withAlpha(theme.vars?.palette?.secondary?.main || theme.palette.secondary.main, 0.03)} 100%)`
      })}
    >
      <Stack spacing={1.5}>
        <Box>
          <Stack direction="row" spacing={1} alignItems="center">
            {Icon ? (
              <Avatar
                sx={(theme) => ({
                  width: 24,
                  height: 24,
                  bgcolor: withAlpha(theme.vars?.palette?.primary?.main || theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.24 : 0.12),
                  color: theme.vars?.palette?.primary?.main || theme.palette.primary.main
                })}
              >
                <Icon fontSize="small" />
              </Avatar>
            ) : null}
            <Typography variant="subtitle2">{title}</Typography>
          </Stack>
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
  const quantity = item.quantity === null || item.quantity === undefined || item.quantity === '' ? 1 : toSafeNumber(item.quantity);
  const unitCost = toSafeNumber(item.unitCost ?? item.unit_cost);
  const totalAmount = toSafeNumber(item.totalAmount ?? item.total_amount);

  return {
    id: item.id ?? null,
    purchaseCode: item.purchaseCode ?? item.purchase_code ?? '',
    purchaseType: item.purchaseType ?? item.purchase_type ?? 'OTHER',
    category: item.category ?? 'OTHER',
    providerName: item.providerName ?? item.provider_name ?? '',
    itemName: item.itemName ?? item.item_name ?? '',
    description: item.description ?? '',
    quantity,
    unitCost,
    totalAmount,
    currency: item.currency ?? 'HNL',
    exchangeRate: toSafeNumber(item.exchangeRate ?? item.exchange_rate) || null,
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
          bgcolor: withAlpha(theme.vars?.palette?.primary?.main || theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.22 : 0.12),
          color: theme.vars?.palette?.primary?.main || theme.palette.primary.main,
          '&:hover': {
            bgcolor: withAlpha(theme.vars?.palette?.primary?.main || theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.34 : 0.2)
          },
          boxShadow:
            theme.palette.mode === 'dark'
              ? `0 10px 20px ${withAlpha('#020617', 0.46)}`
              : `0 8px 16px ${withAlpha('#0f172a', 0.12)}`
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
          <EditOutlinedIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
          {t('actions.edit', 'Edit')}
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            onDelete?.(row);
          }}
        >
          <DeleteOutlineIcon fontSize="small" sx={{ mr: 1, color: 'error.main' }} />
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
  const [purchaseTypeFilter, setPurchaseTypeFilter] = useState('');

  const [openModal, setOpenModal] = useState(false);
  const [openDelete, setOpenDelete] = useState({ open: false, row: null });
  const [form, setForm] = useState(() => createDefaultForm());
  const [sending, setSending] = useState(false);

  const purchaseTypeOptionsT = useMemo(
    () => purchaseTypeOptions.map((opt) => ({ ...opt, label: t(`businessPurchases.enums.purchaseType.${opt.value}`, opt.label) })),
    [t]
  );
  const categoryOptionsT = useMemo(
    () => categoryOptions.map((opt) => ({ ...opt, label: t(`businessPurchases.enums.category.${opt.value}`, opt.label) })),
    [t]
  );
  const currencyOptionsT = useMemo(
    () => currencyOptions.map((opt) => ({ ...opt, label: t(`businessPurchases.enums.currency.${opt.value}`, opt.label) })),
    [t]
  );
  const paymentMethodOptionsT = useMemo(
    () => paymentMethodOptions.map((opt) => ({ ...opt, label: t(`businessPurchases.enums.paymentMethod.${opt.value}`, opt.label) })),
    [t]
  );
  const businessAreaOptionsT = useMemo(
    () => businessAreaOptions.map((opt) => ({ ...opt, label: t(`businessPurchases.enums.businessArea.${opt.value}`, opt.label) })),
    [t]
  );
  const statusOptionsT = useMemo(
    () => statusOptions.map((opt) => ({ ...opt, label: t(`businessPurchases.enums.status.${opt.value}`, opt.label) })),
    [t]
  );
  const recurrenceOptionsT = useMemo(
    () => recurrenceOptions.map((opt) => ({ ...opt, label: t(`businessPurchases.enums.recurrence.${opt.value}`, opt.label) })),
    [t]
  );

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
        enqueueSnackbar(err?.response?.data?.message || err.message || t('businessPurchases.messages.loadError', 'Could not load purchases.'), {
          variant: 'error'
        });
      }
    } finally {
      setLoading(false);
    }
  }, [accessToken, enqueueSnackbar, t]);

  useEffect(() => {
    loadBusinessPurchases();
  }, [loadBusinessPurchases, refreshKey]);

  const filteredRows = useMemo(() => {
    if (!search && !statusFilter && !categoryFilter && !purchaseTypeFilter) return rows;
    const term = search.toLowerCase();
    return rows.filter((row) => {
      if (statusFilter && (row.status || '').toUpperCase() !== statusFilter.toUpperCase()) return false;
      if (categoryFilter && (row.category || '').toUpperCase() !== categoryFilter.toUpperCase()) return false;
      if (purchaseTypeFilter && (row.purchaseType || '').toUpperCase() !== purchaseTypeFilter.toUpperCase()) return false;
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
  }, [rows, search, statusFilter, categoryFilter, purchaseTypeFilter]);

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
      recurring: rows.filter((r) => r.isRecurring).length,
      totalAmount: rows.reduce((acc, row) => acc + toSafeNumber(row.totalAmount), 0)
    }),
    [rows]
  );

  const hasFilters = Boolean(search || statusFilter || categoryFilter || purchaseTypeFilter);

  const resetForm = () => setForm(createDefaultForm());

  const handleFormChange = (field) => (event) => {
      const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
      setForm((prev) => {
        const next = { ...prev, [field]: value };
        if (field === 'quantity' || field === 'unitCost') {
          const qty = toSafeNumber(field === 'quantity' ? value : next.quantity);
          const cost = toSafeNumber(field === 'unitCost' ? value : next.unitCost);
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
      enqueueSnackbar(t('businessPurchases.messages.required', 'Complete required fields.'), { variant: 'warning' });
      return;
    }

    const paidAt = form.paidAt ? (String(form.paidAt).length === 16 ? `${form.paidAt}:00` : form.paidAt) : null;
    const quantity = toSafeNumber(form.quantity);
    const unitCost = toSafeNumber(form.unitCost);
    const totalAmount = form.totalAmount === '' || form.totalAmount === null ? quantity * unitCost : toSafeNumber(form.totalAmount);

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
      exchangeRate: form.exchangeRate ? toSafeNumber(form.exchangeRate) : null,
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
        enqueueSnackbar(t('businessPurchases.messages.updated', 'Purchase updated.'), { variant: 'success' });
      } else {
        await lionTvApi.post('/business-purchases/v1', payload, {
          headers: { Authorization: `Bearer ${accessToken}` },
          skipAuthRedirect: true
        });
        enqueueSnackbar(t('businessPurchases.messages.created', 'Purchase created.'), { variant: 'success' });
      }
      setOpenModal(false);
      resetForm();
      setRefreshKey((v) => v + 1);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || err.message || t('businessPurchases.messages.saveError', 'Could not save purchase.'), {
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
      enqueueSnackbar(t('businessPurchases.messages.deleted', 'Purchase deleted.'), { variant: 'success' });
      setOpenDelete({ open: false, row: null });
      setRefreshKey((v) => v + 1);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || err.message || t('businessPurchases.messages.deleteError', 'Could not delete purchase.'), {
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
          <ResponsiveActionBar>
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
              sx={(muiTheme) => ({
                borderRadius: 2,
                textTransform: 'none',
                px: 2.5,
                boxShadow:
                  muiTheme.palette.mode === 'dark'
                    ? `0 12px 26px ${withAlpha(muiTheme.vars?.palette?.primary?.main || muiTheme.palette.primary.main, 0.35)}`
                    : `0 10px 22px ${withAlpha(muiTheme.vars?.palette?.primary?.main || muiTheme.palette.primary.main, 0.24)}`
              })}
              fullWidth={isMobile}
            >
              {t('businessPurchases.actions.new', 'New purchase')}
            </Button>
          </ResponsiveActionBar>
        }
      >
        <Grid container spacing={gridSpacing}>
          {[
            {
              title: t('businessPurchases.summary.totalLabel', 'Compras'),
              value: summary.total,
              helper: t('businessPurchases.summary.total', { defaultValue: '{{count}} purchases', count: summary.total }),
              icon: <ShoppingCartIcon fontSize="small" />,
              color: 'primary'
            },
            {
              title: t('businessPurchases.summary.paidLabel', 'Pagadas'),
              value: summary.paid,
              helper: t('businessPurchases.summary.paid', { defaultValue: 'Paid: {{count}}', count: summary.paid }),
              icon: <PaidOutlinedIcon fontSize="small" />,
              color: 'success'
            },
            {
              title: t('businessPurchases.summary.pendingLabel', 'Pendientes'),
              value: summary.pending,
              helper: t('businessPurchases.summary.pending', {
                defaultValue: 'Pending: {{count}} · Recurring: {{recurring}}',
                count: summary.pending,
                recurring: summary.recurring
              }),
              icon: <PendingActionsIcon fontSize="small" />,
              color: 'warning'
            },
            {
              title: t('businessPurchases.summary.totalAmountLabel', 'Monto total'),
              value: `L ${summary.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
              helper: t('businessPurchases.summary.totalAmount', {
                defaultValue: 'Total: L {{amount}}',
                amount: summary.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })
              }),
              icon: <LocalAtmIcon fontSize="small" />,
              color: 'secondary'
            }
          ].map((item, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <LionMetricCard {...item} />
            </Grid>
          ))}
        </Grid>
      </MainCard>

      <MainCard
        title={t('businessPurchases.searchTitle', 'Search purchases')}
        secondary={
          <Stack spacing={1.25} sx={{ width: { xs: '100%', md: 900 } }}>
            <ResponsiveFilters paperSx={{ width: '100%' }}>
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
              <FormControl size="small" sx={{ minWidth: 160, '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: 'background.paper' } }}>
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
                  {categoryOptionsT.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 160, '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: 'background.paper' } }}>
                <InputLabel>{t('businessPurchases.filters.type', 'Type')}</InputLabel>
                <Select
                  value={purchaseTypeFilter}
                  label={t('businessPurchases.filters.type', 'Type')}
                  onChange={(e) => setPurchaseTypeFilter(e.target.value)}
                >
                  <MenuItem value="">
                    <em>{t('businessPurchases.filters.all', 'All')}</em>
                  </MenuItem>
                  {purchaseTypeOptionsT.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
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
                  {statusOptionsT.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  setSearch('');
                  setCategoryFilter('');
                  setStatusFilter('');
                  setPurchaseTypeFilter('');
                }}
                startIcon={<RestartAltIcon />}
                disabled={!hasFilters}
                sx={{ borderRadius: 2, textTransform: 'none', whiteSpace: 'nowrap' }}
              >
                {t('businessPurchases.filters.clear', 'Clear')}
              </Button>
            </ResponsiveFilters>

            {hasFilters ? (
              <Stack direction="row" spacing={0.75} flexWrap="wrap">
                {search ? (
                  <Chip
                    size="small"
                    label={t('businessPurchases.filters.searchChip', { defaultValue: 'Search: {{value}}', value: search })}
                    color="primary"
                    variant="outlined"
                  />
                ) : null}
                {categoryFilter ? (
                  <Chip
                    size="small"
                    label={t('businessPurchases.filters.categoryChip', {
                      defaultValue: 'Category: {{value}}',
                      value: optionLabel(categoryOptionsT, categoryFilter)
                    })}
                    color="primary"
                    variant="outlined"
                  />
                ) : null}
                {purchaseTypeFilter ? (
                  <Chip
                    size="small"
                    label={t('businessPurchases.filters.typeChip', {
                      defaultValue: 'Type: {{value}}',
                      value: optionLabel(purchaseTypeOptionsT, purchaseTypeFilter)
                    })}
                    color="primary"
                    variant="outlined"
                  />
                ) : null}
                {statusFilter ? (
                  <Chip
                    size="small"
                    label={t('businessPurchases.filters.statusChip', {
                      defaultValue: 'Status: {{value}}',
                      value: optionLabel(statusOptionsT, statusFilter)
                    })}
                    color="primary"
                    variant="outlined"
                  />
                ) : null}
              </Stack>
            ) : null}
          </Stack>
        }
      >
        <ResponsiveEntityView
          isMobile={isMobile}
          mobileContent={
            loading ? (
              <Stack spacing={1.5}>
                {Array.from({ length: 4 }).map((_, idx) => (
                  <Skeleton key={`purchase-mobile-${idx}`} variant="rounded" height={240} />
                ))}
              </Stack>
            ) : paginatedRows.length ? (
              <Stack spacing={1.5}>
                {paginatedRows.map((row) => (
                  <MobileSummaryCard
                    key={row.id}
                    icon={
                      <Avatar sx={{ width: 40, height: 40, bgcolor: 'secondary.light', color: 'secondary.main' }}>
                        <ReceiptLongIcon fontSize="small" />
                      </Avatar>
                    }
                    title={row.itemName || '-'}
                    subtitle={`${row.purchaseCode || '-'} · ${row.providerName || '-'}`}
                    chips={[
                      <StatusChip key="status" status={row.status} />,
                      <Chip key="type" size="small" variant="outlined" label={optionLabel(purchaseTypeOptionsT, row.purchaseType)} />,
                      <Chip key="category" size="small" variant="outlined" label={optionLabel(categoryOptionsT, row.category)} />
                    ]}
                    actions={
                      <ResponsiveActionBar>
                        <Button size="small" variant="outlined" onClick={() => handleEdit(row)}>
                          {t('actions.edit', 'Edit')}
                        </Button>
                        <RowActions row={row} onEdit={handleEdit} onDelete={handleDelete} />
                      </ResponsiveActionBar>
                    }
                  >
                    <MobileFieldGrid
                      fields={[
                        {
                          label: t('businessPurchases.headers.amount', 'Amount'),
                          value: `${row.currency || 'HNL'} ${toSafeNumber(row.totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
                          emphasis: true
                        },
                        {
                          label: t('businessPurchases.headers.date', 'Purchase date'),
                          value: row.paidAt
                            ? `${formatDate(row.purchaseDate)} · ${t('businessPurchases.labels.paidAt', 'Paid')}: ${formatDate(row.paidAt)}`
                            : row.dueDate
                              ? `${formatDate(row.purchaseDate)} · ${t('businessPurchases.labels.due', 'Due')}: ${formatDate(row.dueDate)}`
                              : formatDate(row.purchaseDate)
                        },
                        { label: t('businessPurchases.headers.method', 'Method'), value: optionLabel(paymentMethodOptionsT, row.paymentMethod) }
                      ]}
                    />
                  </MobileSummaryCard>
                ))}
              </Stack>
            ) : (
              <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
                <Stack spacing={1} alignItems="center">
                  <Avatar sx={{ bgcolor: 'primary.lighter', color: 'primary.main' }}>
                    <ShoppingCartIcon />
                  </Avatar>
                  <Typography variant="subtitle1">{t('businessPurchases.empty.title', 'No purchases yet')}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('businessPurchases.empty.description', 'Create your first purchase record to see it here.')}
                  </Typography>
                  <Button variant="contained" onClick={() => setOpenModal(true)} size="small" fullWidth>
                    {t('businessPurchases.actions.new', 'New purchase')}
                  </Button>
                </Stack>
              </Paper>
            )
          }
          desktopContent={
            <TableContainer
              component={Paper}
              sx={(muiTheme) => ({
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow:
                  muiTheme.palette.mode === 'dark'
                    ? `0 16px 34px ${withAlpha('#020617', 0.44)}`
                    : `0 12px 24px ${withAlpha('#0f172a', 0.08)}`,
                border: '1px solid',
                borderColor: withAlpha(muiTheme.vars?.palette?.divider || muiTheme.palette.divider, 0.95),
                backgroundColor: muiTheme.vars?.palette?.surface?.card || muiTheme.palette.background.paper
              })}
            >
              <Table size="small" sx={{ minWidth: { xs: 1320, md: '100%' } }}>
                <TableHead>
                  <TableRow
                    sx={(muiTheme) => ({
                      bgcolor: muiTheme.palette.surface.sunken,
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
                    <TableRow
                      key={row.id}
                      hover
                      sx={(muiTheme) => ({
                        bgcolor: muiTheme.vars?.palette?.surface?.card || muiTheme.palette.background.paper,
                        '&:nth-of-type(odd)': {
                          bgcolor: withAlpha(
                            muiTheme.vars?.palette?.surface?.muted || muiTheme.palette.action.hover,
                            muiTheme.palette.mode === 'dark' ? 0.84 : 0.44
                          )
                        },
                        '&:hover': {
                          bgcolor: withAlpha(
                            muiTheme.vars?.palette?.primary?.main || muiTheme.palette.primary.main,
                            muiTheme.palette.mode === 'dark' ? 0.12 : 0.06
                          )
                        },
                        transition: 'background-color 0.2s ease'
                      })}
                    >
                      <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar
                            sx={(muiTheme) => ({
                              width: 34,
                              height: 34,
                              bgcolor: withAlpha(
                                muiTheme.vars?.palette?.secondary?.main || muiTheme.palette.secondary.main,
                                muiTheme.palette.mode === 'dark' ? 0.26 : 0.18
                              ),
                              color: muiTheme.vars?.palette?.secondary?.main || muiTheme.palette.secondary.main,
                              boxShadow:
                                muiTheme.palette.mode === 'dark'
                                  ? `0 8px 16px ${withAlpha('#020617', 0.4)}`
                                  : `0 6px 12px ${withAlpha('#0f172a', 0.12)}`
                            })}
                          >
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
                      <TableCell>
                        <Chip
                          size="small"
                          variant="outlined"
                          icon={<ShoppingCartIcon fontSize="small" />}
                          label={optionLabel(purchaseTypeOptionsT, row.purchaseType)}
                          sx={{ maxWidth: 240, '& .MuiChip-label': { overflow: 'hidden', textOverflow: 'ellipsis' } }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip size="small" label={optionLabel(categoryOptionsT, row.category)} variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Stack spacing={0.25}>
                          <Chip
                            size="small"
                            variant="outlined"
                            icon={<AccountBalanceWalletIcon fontSize="small" color="success" />}
                            label={`${row.currency || 'HNL'} ${toSafeNumber(row.totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                            sx={{ fontWeight: 600 }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {toSafeNumber(row.quantity).toLocaleString()} x {toSafeNumber(row.unitCost).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack spacing={0.25}>
                          <Typography variant="body2">{formatDate(row.purchaseDate)}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {row.paidAt
                              ? `${t('businessPurchases.labels.paidAt', 'Paid')}: ${formatDate(row.paidAt)}`
                              : row.dueDate
                                ? `${t('businessPurchases.labels.due', 'Due')}: ${formatDate(row.dueDate)}`
                                : '-'}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          variant="outlined"
                          color={paymentMethodChipColors[row.paymentMethod] || 'default'}
                          label={optionLabel(paymentMethodOptionsT, row.paymentMethod)}
                        />
                      </TableCell>
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
                          <Avatar
                            sx={(muiTheme) => ({
                              bgcolor: withAlpha(
                                muiTheme.vars?.palette?.primary?.main || muiTheme.palette.primary.main,
                                muiTheme.palette.mode === 'dark' ? 0.24 : 0.12
                              ),
                              color: muiTheme.vars?.palette?.primary?.main || muiTheme.palette.primary.main
                            })}
                          >
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
                          <Avatar
                            sx={(muiTheme) => ({
                              bgcolor: withAlpha(
                                muiTheme.vars?.palette?.primary?.main || muiTheme.palette.primary.main,
                                muiTheme.palette.mode === 'dark' ? 0.24 : 0.12
                              ),
                              color: muiTheme.vars?.palette?.primary?.main || muiTheme.palette.primary.main
                            })}
                          >
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
        maxWidth="lg"
        fullScreen={isMobile}
        PaperProps={{
          sx: (muiTheme) => ({
            borderRadius: 3,
            boxShadow:
              muiTheme.palette.mode === 'dark'
                ? `0 26px 56px ${withAlpha('#020617', 0.6)}`
                : `0 18px 40px ${withAlpha('#0f172a', 0.2)}`,
            border: '1px solid',
            borderColor: withAlpha(
              form.id
                ? muiTheme.vars?.palette?.warning?.main || muiTheme.palette.warning.main
                : muiTheme.vars?.palette?.primary?.main || muiTheme.palette.primary.main,
              muiTheme.palette.mode === 'dark' ? 0.5 : 0.3
            ),
            backgroundColor: muiTheme.vars?.palette?.surface?.card || muiTheme.palette.background.paper,
            backgroundImage:
              muiTheme.palette.mode === 'dark'
                ? `linear-gradient(155deg, ${withAlpha(muiTheme.vars?.palette?.primary?.main || muiTheme.palette.primary.main, 0.2)} 0%, ${withAlpha(muiTheme.vars?.palette?.secondary?.main || muiTheme.palette.secondary.main, 0.12)} 56%, ${muiTheme.vars?.palette?.surface?.card || muiTheme.palette.background.paper} 100%)`
                : `linear-gradient(155deg, ${withAlpha(muiTheme.vars?.palette?.primary?.main || muiTheme.palette.primary.main, 0.09)} 0%, ${withAlpha(muiTheme.vars?.palette?.secondary?.main || muiTheme.palette.secondary.main, 0.06)} 56%, ${muiTheme.vars?.palette?.surface?.card || muiTheme.palette.background.paper} 100%)`
          })
        }}
      >
        <DialogTitleWithClose
          onClose={() => setOpenModal(false)}
          sx={(muiTheme) => ({
            position: 'relative',
            pb: 1,
            borderBottom: `1px solid ${withAlpha(muiTheme.vars?.palette?.divider || muiTheme.palette.divider, 0.9)}`,
            background:
              form.id
                ? `linear-gradient(135deg, ${withAlpha(muiTheme.vars?.palette?.warning?.main || muiTheme.palette.warning.main, muiTheme.palette.mode === 'dark' ? 0.2 : 0.12)} 0%, ${withAlpha(muiTheme.vars?.palette?.secondary?.main || muiTheme.palette.secondary.main, muiTheme.palette.mode === 'dark' ? 0.14 : 0.08)} 55%, ${muiTheme.vars?.palette?.surface?.card || muiTheme.palette.background.paper} 100%)`
                : `linear-gradient(135deg, ${withAlpha(muiTheme.vars?.palette?.primary?.main || muiTheme.palette.primary.main, muiTheme.palette.mode === 'dark' ? 0.2 : 0.12)} 0%, ${withAlpha(muiTheme.vars?.palette?.secondary?.main || muiTheme.palette.secondary.main, muiTheme.palette.mode === 'dark' ? 0.14 : 0.08)} 55%, ${muiTheme.vars?.palette?.surface?.card || muiTheme.palette.background.paper} 100%)`
          })}
        >
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Avatar
              sx={(muiTheme) => ({
                bgcolor: form.id ? 'warning.main' : 'primary.main',
                color: 'common.white',
                width: 40,
                height: 40,
                boxShadow:
                  muiTheme.palette.mode === 'dark'
                    ? `0 12px 24px ${withAlpha('#020617', 0.5)}`
                    : `0 10px 20px ${withAlpha('#0f172a', 0.18)}`
              })}
            >
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
        </DialogTitleWithClose>

        <DialogContent
          dividers
          sx={(muiTheme) => ({
            bgcolor: 'background.default',
            px: { xs: 1.5, sm: 3 },
            py: { xs: 1.5, sm: 2 },
            backgroundColor: muiTheme.vars?.palette?.surface?.card || muiTheme.palette.background.paper,
            backgroundImage:
              muiTheme.palette.mode === 'dark'
                ? `linear-gradient(180deg, ${withAlpha(muiTheme.vars?.palette?.primary?.main || muiTheme.palette.primary.main, 0.12)} 0%, ${withAlpha(muiTheme.vars?.palette?.secondary?.main || muiTheme.palette.secondary.main, 0.08)} 54%, ${muiTheme.vars?.palette?.surface?.card || muiTheme.palette.background.paper} 100%)`
                : `linear-gradient(180deg, ${withAlpha(muiTheme.vars?.palette?.primary?.main || muiTheme.palette.primary.main, 0.08)} 0%, ${withAlpha(muiTheme.vars?.palette?.secondary?.main || muiTheme.palette.secondary.main, 0.05)} 54%, ${muiTheme.vars?.palette?.surface?.card || muiTheme.palette.background.paper} 100%)`,
            position: 'relative',
            '&:before': {
              content: '""',
              position: 'absolute',
              inset: 12,
              zIndex: 0,
              borderRadius: 20,
              background:
                muiTheme.palette.mode === 'dark'
                  ? `radial-gradient(circle at 18% 18%, ${withAlpha(muiTheme.vars?.palette?.primary?.main || muiTheme.palette.primary.main, 0.16)} 0%, transparent 45%), radial-gradient(circle at 82% 0%, ${withAlpha(muiTheme.vars?.palette?.secondary?.main || muiTheme.palette.secondary.main, 0.14)} 0%, transparent 35%)`
                  : `radial-gradient(circle at 18% 18%, ${withAlpha(muiTheme.vars?.palette?.primary?.main || muiTheme.palette.primary.main, 0.08)} 0%, transparent 45%), radial-gradient(circle at 82% 0%, ${withAlpha(muiTheme.vars?.palette?.secondary?.main || muiTheme.palette.secondary.main, 0.07)} 0%, transparent 35%)`
            }
          })}
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
              bgcolor: withAlpha(muiTheme.vars?.palette?.info?.main || muiTheme.palette.info.main, muiTheme.palette.mode === 'dark' ? 0.18 : 0.1),
              color: muiTheme.vars?.palette?.info?.main || muiTheme.palette.info.main,
              border: '1px dashed',
              borderColor: withAlpha(muiTheme.vars?.palette?.info?.main || muiTheme.palette.info.main, 0.8)
            })}
          >
            <InfoOutlinedIcon fontSize="small" />
            <Typography variant="caption">
              {t('businessPurchases.tip', 'Purchase code, type, category, item and purchase date are required.')}
            </Typography>
          </Box>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
            <Chip
              size="small"
              color={form.purchaseCode ? 'primary' : 'default'}
              variant="outlined"
              icon={<TagIcon fontSize="small" />}
              label={`${t('businessPurchases.form.purchaseCode', 'Purchase code')}: ${form.purchaseCode || '-'}`}
              sx={{ bgcolor: 'background.paper' }}
            />
            <Chip
              size="small"
              color="default"
              variant="outlined"
              icon={<ReceiptLongIcon fontSize="small" color="info" />}
              label={`${t('businessPurchases.form.purchaseType', 'Purchase type')}: ${optionLabel(purchaseTypeOptionsT, form.purchaseType, '-')}`}
              sx={{ bgcolor: 'background.paper' }}
            />
            <Chip
              size="small"
              color="default"
              variant="outlined"
              icon={<CategoryIcon fontSize="small" color="secondary" />}
              label={`${t('businessPurchases.form.category', 'Category')}: ${optionLabel(categoryOptionsT, form.category, '-')}`}
              sx={{ bgcolor: 'background.paper' }}
            />
            <Chip
              size="small"
              color={statusColors[form.status] || 'default'}
              icon={<PaidOutlinedIcon fontSize="small" />}
              label={`${t('businessPurchases.form.status', 'Status')}: ${optionLabel(statusOptionsT, form.status, '-')}`}
              sx={{ bgcolor: 'background.paper' }}
            />
          </Stack>

          <Stack spacing={2} sx={{ position: 'relative', zIndex: 1 }}>
            <FormSection
              title={t('businessPurchases.sections.classification', 'Classification')}
              helper={t('businessPurchases.sections.classificationHelper', 'Identify the purchase and accounting context.')}
              icon={CategoryIcon}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
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
                          <TagIcon fontSize="small" color="primary" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth required sx={fieldSx}>
                    <InputLabel>{t('businessPurchases.form.purchaseType', 'Purchase type')}</InputLabel>
                    <Select
                      value={form.purchaseType}
                      label={t('businessPurchases.form.purchaseType', 'Purchase type')}
                      onChange={handleFormChange('purchaseType')}
                      startAdornment={
                        <InputAdornment position="start">
                          <ReceiptLongIcon fontSize="small" color="info" />
                        </InputAdornment>
                      }
                    >
                      {purchaseTypeOptionsT.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <FormControl fullWidth required sx={fieldSx}>
                    <InputLabel>{t('businessPurchases.form.category', 'Category')}</InputLabel>
                    <Select
                      value={form.category}
                      label={t('businessPurchases.form.category', 'Category')}
                      onChange={handleFormChange('category')}
                      startAdornment={
                        <InputAdornment position="start">
                          <CategoryIcon fontSize="small" color="secondary" />
                        </InputAdornment>
                      }
                    >
                      {categoryOptionsT.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <FormControl fullWidth sx={fieldSx}>
                    <InputLabel>{t('businessPurchases.form.status', 'Status')}</InputLabel>
                    <Select
                      value={form.status}
                      label={t('businessPurchases.form.status', 'Status')}
                      onChange={handleFormChange('status')}
                      startAdornment={
                        <InputAdornment position="start">
                          <PaidOutlinedIcon fontSize="small" color="success" />
                        </InputAdornment>
                      }
                    >
                      {statusOptionsT.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <FormControl fullWidth sx={fieldSx}>
                    <InputLabel>{t('businessPurchases.form.businessArea', 'Business area')}</InputLabel>
                    <Select
                      value={form.businessArea}
                      label={t('businessPurchases.form.businessArea', 'Business area')}
                      onChange={handleFormChange('businessArea')}
                      startAdornment={
                        <InputAdornment position="start">
                          <BusinessIcon fontSize="small" color="primary" />
                        </InputAdornment>
                      }
                    >
                      {businessAreaOptionsT.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </FormSection>

            <FormSection
              title={t('businessPurchases.sections.item', 'Item & amount')}
              helper={t('businessPurchases.sections.itemHelper', 'Cost detail and provider information.')}
              icon={AccountBalanceWalletIcon}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label={t('businessPurchases.form.providerName', 'Provider')}
                    value={form.providerName}
                    onChange={handleFormChange('providerName')}
                    fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BusinessIcon fontSize="small" color="info" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={8}>
                  <TextField
                    required
                    label={t('businessPurchases.form.itemName', 'Item name')}
                    value={form.itemName}
                    onChange={handleFormChange('itemName')}
                    fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Inventory2Icon fontSize="small" color="primary" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label={t('businessPurchases.form.description', 'Description')}
                    value={form.description}
                    onChange={handleFormChange('description')}
                    fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DescriptionIcon fontSize="small" color="secondary" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <TextField
                    label={t('businessPurchases.form.quantity', 'Quantity')}
                    type="number"
                    value={form.quantity}
                    onChange={handleFormChange('quantity')}
                    fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <NumbersIcon fontSize="small" color="info" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <TextField
                    label={t('businessPurchases.form.unitCost', 'Unit cost')}
                    type="number"
                    value={form.unitCost}
                    onChange={handleFormChange('unitCost')}
                    fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocalAtmIcon fontSize="small" color="warning" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <TextField
                    label={t('businessPurchases.form.totalAmount', 'Total amount')}
                    type="number"
                    value={form.totalAmount}
                    onChange={handleFormChange('totalAmount')}
                    fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccountBalanceWalletIcon fontSize="small" color="success" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth sx={fieldSx}>
                    <InputLabel>{t('businessPurchases.form.currency', 'Currency')}</InputLabel>
                    <Select
                      value={form.currency}
                      label={t('businessPurchases.form.currency', 'Currency')}
                      onChange={handleFormChange('currency')}
                      startAdornment={
                        <InputAdornment position="start">
                          <PaidOutlinedIcon fontSize="small" color="success" />
                        </InputAdornment>
                      }
                    >
                      {currencyOptionsT.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label={t('businessPurchases.form.exchangeRate', 'Exchange rate')}
                    type="number"
                    value={form.exchangeRate}
                    onChange={handleFormChange('exchangeRate')}
                    fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CurrencyExchangeIcon fontSize="small" color="info" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
              </Grid>
            </FormSection>

            <FormSection
              title={t('businessPurchases.sections.payment', 'Dates & payment')}
              helper={t('businessPurchases.sections.paymentHelper', 'Purchase lifecycle, due date and references.')}
              icon={EventAvailableIcon}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
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
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label={t('businessPurchases.form.dueDate', 'Due date')}
                    type="date"
                    value={form.dueDate}
                    onChange={handleFormChange('dueDate')}
                    fullWidth
                    sx={fieldSx}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EventBusyIcon fontSize="small" color="warning" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label={t('businessPurchases.form.paidAt', 'Paid at')}
                    type="datetime-local"
                    value={form.paidAt}
                    onChange={handleFormChange('paidAt')}
                    fullWidth
                    sx={fieldSx}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccessTimeIcon fontSize="small" color="info" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth sx={fieldSx}>
                    <InputLabel>{t('businessPurchases.form.paymentMethod', 'Payment method')}</InputLabel>
                    <Select
                      value={form.paymentMethod}
                      label={t('businessPurchases.form.paymentMethod', 'Payment method')}
                      onChange={handleFormChange('paymentMethod')}
                      startAdornment={
                        <InputAdornment position="start">
                          <PaymentIcon fontSize="small" color="success" />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="">
                        <em>{t('businessPurchases.form.none', 'None')}</em>
                      </MenuItem>
                      {paymentMethodOptionsT.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label={t('businessPurchases.form.paymentReference', 'Payment reference')}
                    value={form.paymentReference}
                    onChange={handleFormChange('paymentReference')}
                    fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PinIcon fontSize="small" color="secondary" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label={t('businessPurchases.form.invoiceNumber', 'Invoice number')}
                    value={form.invoiceNumber}
                    onChange={handleFormChange('invoiceNumber')}
                    fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <ConfirmationNumberIcon fontSize="small" color="primary" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
              </Grid>
            </FormSection>

            <FormSection
              title={t('businessPurchases.sections.recurring', 'Recurring setup')}
              helper={t('businessPurchases.sections.recurringHelper', 'Monthly/yearly recurring purchase flags.')}
              icon={RepeatIcon}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <FormControlLabel
                    control={<Switch checked={form.isRecurring} onChange={handleFormChange('isRecurring')} color="success" />}
                    label={
                      <Stack direction="row" spacing={0.75} alignItems="center">
                        <RepeatIcon fontSize="small" color="secondary" />
                        <Typography variant="body2">{t('businessPurchases.form.isRecurring', 'Recurring purchase')}</Typography>
                      </Stack>
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={8}>
                  <FormControl fullWidth sx={fieldSx} disabled={!form.isRecurring}>
                    <InputLabel>{t('businessPurchases.form.recurrenceType', 'Recurrence')}</InputLabel>
                    <Select
                      value={form.recurrenceType}
                      label={t('businessPurchases.form.recurrenceType', 'Recurrence')}
                      onChange={handleFormChange('recurrenceType')}
                      startAdornment={
                        <InputAdornment position="start">
                          <RepeatIcon fontSize="small" color="secondary" />
                        </InputAdornment>
                      }
                    >
                      {recurrenceOptionsT.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </MenuItem>
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
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <NoteAltIcon fontSize="small" color="info" />
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
            {t('businessPurchases.actions.clear', 'Clear')}
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={sending}
            startIcon={<RocketLaunchIcon />}
            sx={(muiTheme) => ({
              borderRadius: 2,
              boxShadow:
                muiTheme.palette.mode === 'dark'
                  ? `0 14px 30px ${withAlpha(muiTheme.vars?.palette?.primary?.main || muiTheme.palette.primary.main, 0.34)}`
                  : `0 12px 26px ${withAlpha(muiTheme.vars?.palette?.primary?.main || muiTheme.palette.primary.main, 0.24)}`,
              px: 2.4
            })}
          >
            {sending
              ? t('businessPurchases.actions.saving', 'Saving...')
              : form.id
                ? t('businessPurchases.actions.save', 'Save changes')
                : t('businessPurchases.actions.create', 'Create')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDelete.open}
        onClose={() => setOpenDelete({ open: false, row: null })}
        maxWidth="xs"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: (muiTheme) => ({
            border: '1px solid',
            borderColor: withAlpha(muiTheme.vars?.palette?.error?.main || muiTheme.palette.error.main, muiTheme.palette.mode === 'dark' ? 0.5 : 0.25),
            backgroundColor: muiTheme.vars?.palette?.surface?.card || muiTheme.palette.background.paper
          })
        }}
      >
        <DialogTitleWithClose onClose={() => setOpenDelete({ open: false, row: null })}>
          <Typography variant="h6">{t('businessPurchases.delete.title', 'Delete purchase')}</Typography>
        </DialogTitleWithClose>
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
