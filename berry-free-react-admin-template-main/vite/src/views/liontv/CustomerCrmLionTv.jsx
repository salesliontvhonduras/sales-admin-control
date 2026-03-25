import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import useAuth from 'hooks/useAuth';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Autocomplete from '@mui/material/Autocomplete';
import TablePagination from '@mui/material/TablePagination';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormHelperText from '@mui/material/FormHelperText';

import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import LayersIcon from '@mui/icons-material/Layers';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import WifiTetheringIcon from '@mui/icons-material/WifiTethering';
import LanguageIcon from '@mui/icons-material/Language';
import PriceChangeIcon from '@mui/icons-material/PriceChange';
import SmartDisplayIcon from '@mui/icons-material/SmartDisplay';
import CallIcon from '@mui/icons-material/Call';
import LinkIcon from '@mui/icons-material/Link';
import Skeleton from '@mui/material/Skeleton';
import AppsIcon from '@mui/icons-material/Apps';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import ChecklistIcon from '@mui/icons-material/Checklist';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import MemoryIcon from '@mui/icons-material/Memory';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import PaidIcon from '@mui/icons-material/Paid';
import { useTranslation } from 'react-i18next';

import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { lionTvApi, catalogsApi } from 'utils/api';

const fieldSx = {
  '& .MuiInputBase-root': { borderRadius: 2, minHeight: 48 },
  '& .MuiInputLabel-root': { fontWeight: 500 }
};

const statusColors = {
  ACTIVE: 'success',
  INACTIVE: 'default',
  EXPIRED: 'error',
  CANCELLED: 'error',
  AVAILABLE: 'info',
  PENDING: 'warning',
  PAID: 'success'
};

function StatusChip({ status }) {
  const color = statusColors[status] || 'default';
  return <Chip size="small" color={color} label={status || '-'} />;
}

function formatDate(value) {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString();
}

function formatCurrency(value) {
  const n = Number(value) || 0;
  return n.toLocaleString('es-HN', { style: 'currency', currency: 'HNL', minimumFractionDigits: 2 });
}

function ContactActions({ phone, mail }) {
  const { t } = useTranslation();
  if (!phone && !mail) return null;
  const cleanPhone = (phone || '').replace(/\D/g, '');
  return (
    <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
      {phone ? (
        <Button
          size="small"
          variant="outlined"
          startIcon={<CallIcon />}
        component="a"
        href={`tel:${cleanPhone}`}
        sx={{ borderRadius: 2 }}
      >
          {t('crm.contact.call', 'Llamar')}
      </Button>
    ) : null}
      {phone ? (
        <Button
          size="small"
          variant="contained"
          startIcon={<WhatsAppIcon />}
          component="a"
          href={`https://wa.me/${cleanPhone}`}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ borderRadius: 2, bgcolor: '#25D366', '&:hover': { bgcolor: '#1ebe5d' } }}
        >
          WhatsApp
        </Button>
      ) : null}
      {mail ? (
        <Button
          size="small"
          variant="text"
          startIcon={<MailOutlineIcon />}
        component="a"
        href={`mailto:${mail}`}
        sx={{ borderRadius: 2 }}
      >
          {t('crm.contact.email', 'Email')}
      </Button>
    ) : null}
  </Stack>
);
}

function normalizeCustomer(item = {}) {
  return {
    id: item.customerId ?? item.id ?? item.customer_id ?? null,
    fullName: item.customerFullname ?? item.fullName ?? item.customer_name ?? '',
    mail: item.customerMail ?? item.email ?? '',
    phone: item.customerPhone ?? item.phone ?? '',
    gender: (item.gender ?? '').toUpperCase(),
    status: (item.customerStatus ?? item.status ?? '').toUpperCase(),
    channel: item.channel ?? item.canal ?? '',
    openingDate: item.openingDate ?? item.open_date ?? null,
    refererBy: item.refererBy ?? item.referredBy ?? ''
  };
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
    customerName: item.customerName ?? item.customer_name ?? '',
    username_line: item.username_line ?? ''
  };
}

function normalizeInvoice(item = {}) {
  return {
    invoiceId: item.invoiceId ?? item.id ?? null,
    customerId: item.customerId ?? null,
    paymentDate: item.paymentDate ?? null,
    amountPaid: Number(item.amountPaid ?? 0),
    amountDiscount: Number(item.amountDiscount ?? 0),
    status: (item.status ?? '').toUpperCase(),
    paymentMethod: item.paymentMethod ?? '',
    packageId: item.packageId ?? null,
    bankId: item.bankId ?? null,
    bankName: item.bankName ?? item.bank_name ?? item.bank?.name ?? '',
    notes: item.notes ?? '',
    serviceId: item.serviceId ?? null,
    serviceName: item.serviceName ?? item.service_name ?? item.service?.name ?? ''
  };
}

function parsePaidFlag(value) {
  if (value === true || value === 1 || value === '1') return true;
  if (typeof value === 'string' && value.trim().toLowerCase() === 'true') return true;
  return false;
}

function normalizeLicense(item = {}) {
  return {
    licenseId: item.licenseId ?? item.license_id ?? null,
    customerId: item.customerId ?? item.customer_id ?? null,
    macAddress: item.macAddress ?? item.mac_address ?? '',
    deviceKey: item.deviceKey ?? item.device_key ?? '',
    app: item.app ?? '',
    status: (item.status ?? '').toUpperCase(),
    typeLicense: (item.typeLicense ?? item.type_license ?? '').toUpperCase(),
    expireAt: item.expireAt ?? item.expire_at ?? null,
    price: Number(item.price ?? 0),
    createdAt: item.createdAt ?? item.created_at ?? null,
    licensePeriod: item.licensePeriod ?? item.license_period ?? '',
    name: item.name ?? '',
    currentOwnerSince: item.currentOwnerSince ?? item.current_owner_since ?? null,
    isPaid: parsePaidFlag(item.isPaid ?? item.is_paid ?? item.paid)
  };
}

function initials(name = '') {
  const parts = name.trim().split(' ').filter(Boolean);
  if (!parts.length) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ''}${parts[parts.length - 1][0] ?? ''}`.toUpperCase();
}

function StatCard({ icon, title, value, helper, color = 'primary' }) {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: (theme) => `${(theme.palette[color]?.main ?? theme.palette.grey[500])}10`,
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: 2,
        display: 'flex',
        gap: 1.5,
        alignItems: 'center',
        minHeight: 110
      }}
    >
      <Avatar
        sx={{
          bgcolor: (theme) => theme.palette[color]?.light ?? theme.palette.grey[200],
          color: (theme) => theme.palette[color]?.contrastText ?? theme.palette.text.primary,
          width: 42,
          height: 42,
          boxShadow: 3
        }}
      >
        {icon}
      </Avatar>
      <Box sx={{ flex: 1 }}>
        <Typography variant="caption" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {value}
        </Typography>
        {helper ? (
          <Stack direction="row" spacing={0.75} alignItems="center">
            <InfoOutlinedIcon fontSize="inherit" color="action" />
            <Typography variant="caption" color="text.secondary">
              {helper}
            </Typography>
          </Stack>
        ) : null}
      </Box>
    </Box>
  );
}

function LabelWithIcon({ icon, label, color = 'primary' }) {
  return (
    <Chip
      icon={icon}
      label={label}
      size="small"
      sx={{
        borderRadius: 2,
        bgcolor: (theme) => `${theme.palette[color]?.light}26`,
        color: (theme) => theme.palette[color]?.darker || theme.palette[color]?.dark,
        '& .MuiChip-icon': { color: (theme) => theme.palette[color]?.main }
      }}
      variant="outlined"
    />
  );
}

function InfoBlock({ title, icon, color = 'primary', children, helper }) {
  return (
    <Box
      sx={(theme) => ({
        borderRadius: 2,
        border: '1px solid',
        borderColor: theme.palette[color]?.light || theme.palette.divider,
        background:
          theme.palette.mode === 'light'
            ? `linear-gradient(135deg, ${theme.palette[color]?.light}18, ${theme.palette.background.paper})`
            : theme.palette.background.default,
        p: 2,
        boxShadow: 2,
        display: 'flex',
        gap: 1.5
      })}
    >
      <Avatar
        sx={(theme) => ({
          bgcolor: theme.palette[color]?.main,
          color: theme.palette[color]?.contrastText,
          width: 40,
          height: 40,
          boxShadow: 3
        })}
      >
        {icon}
      </Avatar>
      <Stack spacing={0.75} sx={{ flex: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        {helper ? (
          <Typography variant="caption" color="text.secondary">
            {helper}
          </Typography>
        ) : null}
        {children}
      </Stack>
    </Box>
  );
}

export default function CustomerCrmLionTv() {
  const { enqueueSnackbar } = useSnackbar();
  const { accessToken } = useAuth();
  const { t } = useTranslation();

  const [customers, setCustomers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [licenses, setLicenses] = useState([]);
  const [packages, setPackages] = useState([]);
  const [lines, setLines] = useState([]);
  const [banks, setBanks] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState({
    customers: false,
    subscriptions: false,
    invoices: false,
    licenses: false,
    packages: false,
    lines: false,
    banks: false,
    services: false
  });
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [detail, setDetail] = useState({ open: false, type: null, row: null });
  const [tableDialog, setTableDialog] = useState({
    open: false,
    title: '',
    description: '',
    rows: [],
    columns: [],
    onDetail: null
  });
  const [tablePage, setTablePage] = useState(0);
  const [tableRpp, setTableRpp] = useState(10);

  const handleUnauthorized = (err) => {
    const status = err?.response?.status || err?.request?.status;
    return status === 401;
  };

  const fetchCollection = useCallback(
    async (path, setter, normalizer, key, params = {}) => {
      if (!accessToken) return;
      setLoading((prev) => ({ ...prev, [key]: true }));
      try {
        const res = await lionTvApi.get(path, {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: { index: 0, size: 5000, ...params },
          skipAuthRedirect: true
        });
        const payload = res?.data?.data ?? res?.data ?? {};
        const raw = payload.data ?? payload.items ?? payload.content ?? payload ?? [];
        const normalized = (Array.isArray(raw) ? raw : []).map(normalizer);
        setter(normalized);
      } catch (err) {
        if (!handleUnauthorized(err)) {
          enqueueSnackbar(
            err?.response?.data?.message || t('crm.errors.load', 'No se pudo cargar la información.'),
            { variant: 'error' }
          );
        }
      } finally {
        setLoading((prev) => ({ ...prev, [key]: false }));
      }
    },
    [accessToken, enqueueSnackbar]
  );

  useEffect(() => {
    fetchCollection('/customers/v1', setCustomers, normalizeCustomer, 'customers');
    fetchCollection('/subscriptions/v1', setSubscriptions, normalizeSubscription, 'subscriptions');
    fetchCollection('/invoices/v1', setInvoices, normalizeInvoice, 'invoices');
    fetchCollection('/licenses/v1', setLicenses, normalizeLicense, 'licenses');
    fetchCollection('/packages/v1/list-packages', setPackages, (p) => p, 'packages', {
      start: 0,
      filters: '',
      sorting: '',
      size: 1000
    });
    fetchCollection('/lines/v1/list-lines', setLines, (l) => l, 'lines', { start: 0, filters: '', sorting: '', size: 1000 });
  }, [fetchCollection, refreshKey]);

  // Catálogos externos (bancos y servicios)
  const loadBanks = useCallback(async () => {
    if (!accessToken) return;
    setLoading((prev) => ({ ...prev, banks: true }));
    try {
      const res = await catalogsApi.get('/banks/v1', { headers: { Authorization: `Bearer ${accessToken}` } });
      const payload = res?.data?.data ?? res?.data ?? [];
      setBanks(Array.isArray(payload) ? payload : []);
    } catch (err) {
      enqueueSnackbar(t('crm.errors.banks', 'No se pudieron cargar los bancos.'), { variant: 'warning' });
    } finally {
      setLoading((prev) => ({ ...prev, banks: false }));
    }
  }, [accessToken, enqueueSnackbar]);

  const loadServices = useCallback(async () => {
    if (!accessToken) return;
    setLoading((prev) => ({ ...prev, services: true }));
    try {
      const res = await catalogsApi.get('/services/v1', { headers: { Authorization: `Bearer ${accessToken}` } });
      const payload = res?.data?.data ?? res?.data ?? [];
      setServices(Array.isArray(payload) ? payload : []);
    } catch (err) {
      enqueueSnackbar(t('crm.errors.services', 'No se pudieron cargar los servicios.'), { variant: 'warning' });
    } finally {
      setLoading((prev) => ({ ...prev, services: false }));
    }
  }, [accessToken, enqueueSnackbar]);

  useEffect(() => {
    loadBanks();
    loadServices();
  }, [loadBanks, loadServices, refreshKey]);

  const lineNameMap = useMemo(() => {
    const map = {};
    lines.forEach((l) => {
      const rawId = l.id ?? l.lineId ?? l.line_id ?? l.username;
      if (!rawId) return;
      const id = String(rawId);
      map[id] = l.username || l.user_name || l.username_line || l.name || id;
    });
    return map;
  }, [lines]);

  const packageMap = useMemo(() => {
    const map = {};
    packages.forEach((p) => {
      const rawId = p.id ?? p.packageId ?? p.package_id ?? p.packageID;
      if (!rawId) return;
      const id = String(rawId);
      map[id] = {
        name: p.name || p.packageName || `Paquete ${id}`,
        description: p.description || p.packageDescription || ''
      };
    });
    return map;
  }, [packages]);

  const bankMap = useMemo(() => {
    const map = {};
    banks.forEach((b) => {
      const id = String(b.id ?? b.bankId ?? b.bank_id ?? b.code ?? '');
      if (!id) return;
      map[id] = b.name || b.bank || b.description || id;
    });
    return map;
  }, [banks]);

  const serviceMap = useMemo(() => {
    const map = {};
    services.forEach((s) => {
      const id = String(s.id ?? s.serviceId ?? s.service_id ?? s.code ?? '');
      if (!id) return;
      map[id] = s.name || s.description || s.serviceName || id;
    });
    return map;
  }, [services]);

  const customerId = selectedCustomer?.id ?? selectedCustomer?.customerId ?? null;

  const customerSubscriptions = useMemo(
    () =>
      subscriptions
        .filter((s) => (s.customerId || s.customer_id) === customerId)
        .map((s) => {
          const lineLabel =
            lineNameMap[String(s.lineId ?? s.username_line ?? '')] || s.username_line || s.lineId || '';
          const pkg = packageMap[String(s.packageId ?? '')] || {};
          return {
            ...s,
            lineLabel,
            packageName: pkg.name || s.packageId,
            packageDescription: pkg.description || ''
          };
        }),
    [subscriptions, customerId, lineNameMap, packageMap]
  );

  const customerInvoices = useMemo(
    () => invoices.filter((inv) => (inv.customerId || inv.customer_id) === customerId),
    [invoices, customerId]
  );

  const customerLicenses = useMemo(
    () => licenses.filter((lic) => (lic.customerId || lic.customer_id) === customerId),
    [licenses, customerId]
  );

  const totals = useMemo(() => {
    const billed = customerInvoices.reduce(
      (acc, inv) => acc + Number(inv.amountPaid || 0) - Number(inv.amountDiscount || 0),
      0
    );
    const activeSubs = customerSubscriptions.filter((s) => s.status === 'ACTIVE').length;
    const activeLicenses = customerLicenses.filter((l) => l.status === 'ACTIVE').length;
    const nextRenewal = customerSubscriptions
      .map((s) => s.renewalDate)
      .filter(Boolean)
      .sort((a, b) => new Date(a) - new Date(b))[0];
    const lastInvoice = customerInvoices
      .map((inv) => inv.paymentDate)
      .filter(Boolean)
      .sort((a, b) => new Date(b) - new Date(a))[0];
    return {
      billed,
      activeSubs,
      activeLicenses,
      totalInvoices: customerInvoices.length,
      nextRenewal,
      lastInvoice
    };
  }, [customerSubscriptions, customerLicenses, customerInvoices]);

  const openFullModule = (type) => {
    if (type === 'subscriptions') {
      setTableDialog({
        open: true,
        title: t('crm.tables.subscriptions.title', 'Todas las suscripciones'),
        description: t('crm.tables.subscriptions.desc', 'Vista completa de líneas, paquetes, billing y fechas del cliente.'),
        rows: customerSubscriptions,
        columns: [
          { field: 'lineLabel', title: t('crm.headers.line', 'Línea'), render: (row) => <LabelWithIcon icon={<WifiTetheringIcon fontSize="small" />} label={row.lineLabel || '-'} color="info" /> },
          { field: 'packageName', title: t('crm.headers.package', 'Paquete'), render: (row) => <LabelWithIcon icon={<Inventory2Icon fontSize="small" />} label={row.packageName || '-'} color="secondary" /> },
          { field: 'billing', title: t('crm.headers.billing', 'Billing'), render: (row) => <LabelWithIcon icon={<ChecklistIcon fontSize="small" />} label={row.billing || '-'} color="warning" /> },
          { field: 'status', title: t('crm.headers.status', 'Estado'), render: (row) => <StatusChip status={row.status} /> },
          { field: 'startDate', title: t('crm.headers.start', 'Inicio'), render: (row) => formatDate(row.startDate) },
          { field: 'renewalDate', title: t('crm.headers.renewal', 'Renovación'), render: (row) => formatDate(row.renewalDate) }
        ],
        onDetail: (row) => setDetail({ open: true, type: 'subscription', row })
      });
    }
    if (type === 'licenses') {
      setTableDialog({
        open: true,
        title: t('crm.tables.licenses.title', 'Todas las licencias'),
        description: t('crm.tables.licenses.desc', 'Detalle de licencias: app, tipo, vigencia y estado actual.'),
        rows: customerLicenses,
        columns: [
          { field: 'macAddress', title: t('crm.headers.mac', 'MAC'), render: (row) => <LabelWithIcon icon={<SmartDisplayIcon fontSize="small" />} label={row.macAddress || '-'} color="info" /> },
          { field: 'deviceKey', title: t('licenses.headers.deviceKey', 'Device key'), render: (row) => <LabelWithIcon icon={<LinkIcon fontSize="small" />} label={row.deviceKey || '-'} color="info" /> },
          { field: 'app', title: t('crm.headers.app', 'App'), render: (row) => <LabelWithIcon icon={<AppsIcon fontSize="small" />} label={row.app || '-'} color="primary" /> },
          { field: 'typeLicense', title: t('crm.headers.type', 'Tipo'), render: (row) => <LabelWithIcon icon={<LayersIcon fontSize="small" />} label={row.typeLicense || '-'} color="secondary" /> },
          { field: 'status', title: t('crm.headers.status', 'Estado'), render: (row) => <StatusChip status={row.status} /> },
          { field: 'isPaid', title: t('licenses.headers.paid', 'Pagada'), render: (row) => <StatusChip status={row.isPaid ? 'PAID' : 'PENDING'} /> },
          { field: 'expireAt', title: t('crm.headers.expire', 'Expira'), render: (row) => formatDate(row.expireAt) }
        ],
        onDetail: (row) => setDetail({ open: true, type: 'license', row })
      });
    }
    if (type === 'invoices') {
      setTableDialog({
        open: true,
        title: t('crm.tables.invoices.title', 'Todas las facturas'),
        description: t('crm.tables.invoices.desc', 'Historial completo de facturación en Lempiras con método y estado.'),
        rows: customerInvoices,
        columns: [
          { field: 'paymentDate', title: t('crm.headers.date', 'Fecha'), render: (row) => formatDate(row.paymentDate) },
          { field: 'paymentMethod', title: t('crm.headers.method', 'Método'), render: (row) => <LabelWithIcon icon={<CreditCardIcon fontSize="small" />} label={row.paymentMethod || '-'} color="info" /> },
          { field: 'status', title: t('crm.headers.status', 'Estado'), render: (row) => <StatusChip status={row.status} /> },
          {
            field: 'amountPaid',
            title: t('crm.headers.total', 'Total'),
            render: (row) => formatCurrency(Number(row.amountPaid || 0) - Number(row.amountDiscount || 0))
          }
        ],
        onDetail: (row) => setDetail({ open: true, type: 'invoice', row })
      });
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 1400, mx: 'auto' }}>
      <MainCard
        title={t('crm.title', 'CRM de clientes')}
        secondary={
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'stretch', sm: 'center' }}>
            <Autocomplete
              sx={{ minWidth: { xs: 240, sm: 360 } }}
              options={customers}
              value={selectedCustomer}
              onChange={(e, value) => setSelectedCustomer(value)}
              getOptionLabel={(option) =>
                option?.fullName || option?.mail || option?.username || option?.id?.toString() || ''
              }
              isOptionEqualToValue={(opt, val) => (opt?.id ?? opt?.customerId) === (val?.id ?? val?.customerId)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t('crm.search.label', 'Buscar cliente')}
                  placeholder={t('crm.search.placeholder', 'Nombre, correo o usuario')}
                  size="small"
                  sx={fieldSx}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="primary" />
                      </InputAdornment>
                    )
                  }}
                />
              )}
            />
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => setRefreshKey((v) => v + 1)}
              disabled={Object.values(loading).some(Boolean)}
              sx={{ minHeight: 48, px: 2.5 }}
            >
              {t('actions.refresh', 'Recargar')}
            </Button>
          </Stack>
        }
      >
        {!selectedCustomer ? (
          <Box
            sx={{
              py: 6,
              textAlign: 'center',
              border: '1px dashed',
              borderColor: 'divider',
              borderRadius: 2,
              background: (theme) =>
                theme.palette.mode === 'light'
                  ? `linear-gradient(145deg, ${theme.palette.primary.light}12, ${theme.palette.secondary.light}10)`
                  : theme.palette.background.default
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {t('crm.empty.title', 'Selecciona un cliente para ver su panorama 360°')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {t('crm.empty.subtitle', 'Encontrarás sus suscripciones, facturación, licencias y métricas clave.')}
            </Typography>
          </Box>
        ) : loading.customers ? (
          <Stack spacing={3}>
            <Skeleton variant="rounded" height={160} />
            <Skeleton variant="rounded" height={120} />
          </Stack>
        ) : (
          <Stack spacing={3}>
            <MainCard content={false}>
              <Box sx={{ p: { xs: 2, sm: 3 } }}>
                <Grid container spacing={gridSpacing}>
                  <Grid item xs={12} md={4}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        boxShadow: 3,
                        display: 'flex',
                        gap: 2,
                        alignItems: 'center',
                        background: (theme) =>
                          theme.palette.mode === 'light'
                            ? `linear-gradient(150deg, ${theme.palette.primary.light}18 0%, ${theme.palette.secondary.light}12 80%)`
                            : theme.palette.background.paper
                      }}
                    >
                      <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                        {initials(selectedCustomer.fullName)}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                          {selectedCustomer.fullName}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                          <StatusChip status={selectedCustomer.status} />
                          {selectedCustomer.channel ? (
                            <LabelWithIcon icon={<LoyaltyIcon fontSize="small" />} label={selectedCustomer.channel} color="secondary" />
                          ) : null}
                        </Stack>
                        <Stack spacing={0.5} sx={{ mt: 0.5 }}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <MailOutlineIcon fontSize="small" color="action" />
                            <Typography variant="body2">{selectedCustomer.mail || '-'}</Typography>
                          </Stack>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <PhoneIphoneIcon fontSize="small" color="action" />
                            <Typography variant="body2">{selectedCustomer.phone || '-'}</Typography>
                          </Stack>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <LoyaltyIcon fontSize="small" color="action" />
                            <Typography variant="body2">
                              {t('crm.stats.opening', {
                                date: selectedCustomer.openingDate ? formatDate(selectedCustomer.openingDate) : '-'
                              })}
                            </Typography>
                          </Stack>
                        </Stack>
                        <ContactActions phone={selectedCustomer.phone} mail={selectedCustomer.mail} />
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                        <StatCard
                          icon={<CreditCardIcon />}
                          title={t('crm.stats.billed', 'Total facturado')}
                          value={formatCurrency(totals.billed)}
                          helper={t('crm.stats.invoices', { defaultValue: 'Facturas: {{val}}', val: totals.totalInvoices })}
                          color="success"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <StatCard
                          icon={<ReceiptLongIcon />}
                          title={t('crm.stats.subscriptions', 'Suscripciones')}
                          value={`${customerSubscriptions.length}`}
                          helper={t('crm.stats.subscriptionsActive', {
                            defaultValue: 'Activas: {{val}}',
                            val: totals.activeSubs
                          })}
                          color="info"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <StatCard
                          icon={<LayersIcon />}
                          title={t('crm.stats.licenses', 'Licencias')}
                          value={`${customerLicenses.length}`}
                          helper={t('crm.stats.licensesActive', {
                            defaultValue: 'Activas: {{val}}',
                            val: totals.activeLicenses
                          })}
                          color="warning"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <StatCard
                          icon={<CalendarMonthIcon />}
                          title={t('crm.stats.nextRenewal', 'Próxima renovación')}
                          value={totals.nextRenewal ? formatDate(totals.nextRenewal) : t('crm.stats.none', 'Sin definir')}
                          helper={t('crm.stats.closest', 'Fecha más cercana')}
                          color="primary"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <StatCard
                          icon={<MonetizationOnIcon />}
                          title={t('crm.stats.lastPayment', 'Último pago')}
                          value={
                            totals.lastInvoice
                              ? formatDate(totals.lastInvoice)
                              : t('crm.stats.noPayments', 'No hay pagos')
                          }
                          helper={t('crm.stats.lastInvoice', 'Fecha de la última factura')}
                          color="secondary"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <StatCard
                          icon={<PersonIcon />}
                          title={t('crm.stats.referredBy', 'Referido por')}
                          value={selectedCustomer.refererBy || t('crm.stats.noRef', 'Sin referencia')}
                          helper={
                            selectedCustomer.openingDate
                              ? t('crm.stats.opening', {
                                  defaultValue: 'Alta: {{date}}',
                                  date: formatDate(selectedCustomer.openingDate)
                                })
                              : ''
                          }
                          color="default"
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </MainCard>

            

            <MainCard
              sx={{
                borderRadius: 2,
                background: (theme) =>
                  `linear-gradient(135deg, ${theme.palette.primary.light}26, ${theme.palette.secondary.light}1F)`
              }}
            >
              <Stack spacing={2}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <AppsIcon color="primary" />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {t('crm.modules.title', 'Módulos detallados')}
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {t(
                    'crm.modules.subtitle',
                    'Abre submódulos dedicados con contexto, iconos y colores para identificar cada entidad.'
                  )}
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<WifiTetheringIcon />}
                    onClick={() => openFullModule('subscriptions')}
                    sx={{ flex: 1, borderRadius: 2, boxShadow: 3, textTransform: 'none' }}
                  >
                    {t('crm.modules.subscriptions', 'Ver suscripciones')}
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<ReceiptLongIcon />}
                    onClick={() => openFullModule('invoices')}
                    sx={{
                      flex: 1,
                      borderRadius: 2,
                      boxShadow: 2,
                      textTransform: 'none',
                      backgroundColor: (theme) => `${theme.palette.secondary.light}16`
                    }}
                  >
                    {t('crm.modules.invoices', 'Ver facturación')}
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<SmartDisplayIcon />}
                    onClick={() => openFullModule('licenses')}
                    sx={{
                      flex: 1,
                      borderRadius: 2,
                      boxShadow: 2,
                      textTransform: 'none',
                      backgroundColor: (theme) => `${theme.palette.error.light}16`
                    }}
                  >
                    {t('crm.modules.licenses', 'Ver licencias')}
                  </Button>
                </Stack>
              </Stack>
            </MainCard>
          </Stack>
        )}
      </MainCard>
      <Divider sx={{ my: 3 }} />
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="flex-end">
        <Chip
          label={t('crm.datasets.customers', { defaultValue: 'Clientes cargados: {{count}}', count: customers.length })}
          color="primary"
          variant="outlined"
          size="small"
        />
        <Chip
          label={t('crm.datasets.label', {
            defaultValue: 'Datasets: {{state}}',
            state:
              loading.customers || loading.subscriptions || loading.invoices || loading.licenses
                ? t('crm.datasets.loading', 'Cargando...')
                : t('crm.datasets.ready', 'Listos')
          })}
          color={(loading.customers || loading.subscriptions || loading.invoices || loading.licenses) ? 'warning' : 'success'}
          variant="outlined"
          size="small"
        />
      </Stack>

      <Dialog
        open={detail.open}
        onClose={() => setDetail({ open: false, type: null, row: null })}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: (theme) => ({
            borderRadius: 3,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: theme.palette.mode === 'light' ? theme.palette.primary.light : theme.palette.primary.dark,
            boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
            background: theme.palette.background.paper
          })
        }}
      >
        <DialogTitle
          sx={(theme) => ({
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            py: 2,
            px: 2.5,
            background: theme.palette.mode === 'light'
              ? `linear-gradient(135deg, ${theme.palette.primary.light}30 0%, ${theme.palette.secondary.light}25 60%, ${theme.palette.background.paper} 100%)`
              : `linear-gradient(135deg, ${theme.palette.primary.dark}60 0%, ${theme.palette.secondary.dark}40 70%, ${theme.palette.background.default} 100%)`,
            borderBottom: `1px solid ${theme.palette.divider}`
          })}
        >
          <Avatar
            sx={(theme) => ({
              bgcolor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              width: 40,
              height: 40,
              boxShadow: 4
            })}
          >
            <VisibilityOutlinedIcon />
          </Avatar>
          <Stack spacing={0.2}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, letterSpacing: 0.2 }}>
              {detail.type === 'subscription' && t('crm.detail.subscription', 'Detalle de suscripción')}
              {detail.type === 'invoice' && t('crm.detail.invoice', 'Detalle de factura')}
              {detail.type === 'license' && t('crm.detail.license', 'Detalle de licencia')}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t('crm.detail.helper', 'Visualización enriquecida con íconos y descripciones.')}
            </Typography>
          </Stack>
        </DialogTitle>
      <DialogContent
        dividers
        sx={{
          bgcolor: 'background.default'
        }}
      >
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
            {detail.type === 'subscription' && t('crm.detail.summary.subscription', 'Resumen de la suscripción')}
            {detail.type === 'license' && t('crm.detail.summary.license', 'Resumen de la licencia')}
            {detail.type === 'invoice' && t('crm.detail.summary.invoice', 'Resumen de la factura')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {detail.type === 'subscription' &&
              t(
                'crm.detail.summary.subscriptionHelper',
                'Visualiza línea, paquete, fechas y estado de pago automático de la suscripción seleccionada.'
              )}
            {detail.type === 'license' &&
              t('crm.detail.summary.licenseHelper', 'Información clave de la licencia: aplicación, tipo, ciclo, vigencia y propietario actual.')}
            {detail.type === 'invoice' &&
              t('crm.detail.summary.invoiceHelper', 'Monto pagado en Lps, método, banco y notas relevantes para la factura elegida.')}
          </Typography>
        </Box>

          {detail.type === 'subscription' && detail.row ? (
            <Stack spacing={2}>
              <InfoBlock
                title={t('crm.subscription.block.line.title', 'Línea y cobro')}
                icon={<WifiTetheringIcon />}
                color="info"
                helper={t('crm.subscription.block.line.helper', 'Identificador de línea y montos asociados.')}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={0.75}>
                      <LabelWithIcon
                        icon={<WifiTetheringIcon fontSize="small" color="info" />}
                        label={t('crm.subscription.line', { defaultValue: 'Línea: {{line}}', line: detail.row.lineId || '-' })}
                        color="info"
                      />
                      <LabelWithIcon
                        icon={<PersonIcon fontSize="small" color="primary" />}
                        label={t('crm.subscription.user', {
                          defaultValue: 'Usuario: {{user}}',
                          user: detail.row.username_line || detail.row.username || '-'
                        })}
                        color="primary"
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={0.75}>
                      <LabelWithIcon
                        icon={<MonetizationOnIcon fontSize="small" color="success" />}
                        label={t('crm.subscription.amount', {
                          defaultValue: 'Monto: {{amount}}',
                          amount: formatCurrency(detail.row.amount)
                        })}
                        color="success"
                      />
                      <LabelWithIcon
                        icon={<PriceChangeIcon fontSize="small" color="warning" />}
                        label={t('crm.subscription.discount', {
                          defaultValue: 'Descuento: {{discount}}',
                          discount: formatCurrency(detail.row.discount)
                        })}
                        color="warning"
                      />
                    </Stack>
                  </Grid>
                </Grid>
              </InfoBlock>

              <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <InfoBlock
                    title={t('crm.subscription.block.dates.title', 'Fechas y billing')}
                    icon={<CalendarMonthIcon />}
                    color="primary"
                    helper={t('crm.subscription.block.dates.helper', 'Ciclo actual y próxima renovación.')}
                  >
                    <Stack spacing={1}>
                      <LabelWithIcon
                        icon={<CalendarMonthIcon fontSize="small" color="primary" />}
                        label={t('crm.subscription.start', { defaultValue: 'Inicio: {{date}}', date: formatDate(detail.row.startDate) })}
                        color="primary"
                      />
                      <LabelWithIcon
                        icon={<CalendarMonthIcon fontSize="small" color="warning" />}
                        label={t('crm.subscription.renewal', {
                          defaultValue: 'Renovación: {{date}}',
                          date: formatDate(detail.row.renewalDate)
                        })}
                        color="warning"
                      />
                      <LabelWithIcon
                        icon={<ChecklistIcon fontSize="small" color="info" />}
                        label={t('crm.subscription.billing', {
                          defaultValue: 'Billing: {{billing}}',
                          billing: detail.row.billing || '-'
                        })}
                        color="info"
                      />
                    </Stack>
                  </InfoBlock>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InfoBlock
                    title={t('crm.subscription.block.status.title', 'Estado y paquete')}
                    icon={<LayersIcon />}
                    color="secondary"
                    helper={t('crm.subscription.block.status.helper', 'Estado, paquete y pago automático.')}
                  >
                    <Stack spacing={1}>
                      <StatusChip status={detail.row.status} />
                      <LabelWithIcon
                        icon={<Inventory2Icon fontSize="small" color="secondary" />}
                        label={t('crm.subscription.package', {
                          defaultValue: 'Paquete: {{pkg}}',
                          pkg: detail.row.packageName || detail.row.packageId || '-'
                        })}
                        color="secondary"
                      />
                      {detail.row.packageDescription ? (
                        <FormHelperText sx={{ m: 0 }}>{detail.row.packageDescription}</FormHelperText>
                      ) : null}
                      <LabelWithIcon
                        icon={<ChecklistIcon fontSize="small" color="success" />}
                        label={t('crm.subscription.autoPay', {
                          defaultValue: 'Pago automático: {{val}}',
                          val: detail.row.automaticPay ? t('common.yes', 'Sí') : t('common.no', 'No')
                        })}
                        color="success"
                      />
                      {detail.row.linkAutomatic ? (
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <LinkIcon fontSize="small" color="action" />
                          <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                            {detail.row.linkAutomatic}
                          </Typography>
                        </Stack>
                      ) : null}
                    </Stack>
                  </InfoBlock>
                </Grid>
              </Grid>
            </Stack>
          ) : null}

          {detail.type === 'license' && detail.row ? (
            <Stack spacing={2}>
              <InfoBlock
                title={t('crm.license.block.app.title', 'Aplicación y plan')}
                icon={<SmartDisplayIcon />}
                color="info"
                helper={t('crm.license.block.app.helper', 'Resumen de la licencia seleccionada.')}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={0.75}>
                      <LabelWithIcon
                        icon={<SmartDisplayIcon fontSize="small" color="info" />}
                        label={t('crm.license.app', { defaultValue: 'Aplicación: {{app}}', app: detail.row.app || '-' })}
                        color="info"
                      />
                      <LabelWithIcon
                        icon={<LinkIcon fontSize="small" color="info" />}
                        label={t('crm.license.deviceKey', { defaultValue: 'Device Key: {{value}}', value: detail.row.deviceKey || '-' })}
                        color="info"
                      />
                      <LabelWithIcon
                        icon={<LayersIcon fontSize="small" color="secondary" />}
                        label={t('crm.license.type', { defaultValue: 'Tipo: {{type}}', type: detail.row.typeLicense || '-' })}
                        color="secondary"
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={0.75}>
                      <LabelWithIcon
                        icon={<PriceChangeIcon fontSize="small" color="success" />}
                        label={t('crm.license.price', { defaultValue: 'Precio: {{price}}', price: formatCurrency(detail.row.price) })}
                        color="success"
                      />
                      <LabelWithIcon
                        icon={<CalendarMonthIcon fontSize="small" color="primary" />}
                        label={t('crm.license.period', { defaultValue: 'Periodo: {{period}}', period: detail.row.licensePeriod || '-' })}
                        color="primary"
                      />
                      <LabelWithIcon
                        icon={<PaidIcon fontSize="small" color={detail.row.isPaid ? 'success' : 'warning'} />}
                        label={t('crm.license.paid', { defaultValue: 'Pago: {{status}}', status: detail.row.isPaid ? 'PAGADA' : 'PENDIENTE' })}
                        color={detail.row.isPaid ? 'success' : 'warning'}
                      />
                    </Stack>
                  </Grid>
                </Grid>
              </InfoBlock>

              <InfoBlock
                title={t('crm.license.block.details.title', 'Detalles de licencia')}
                icon={<Inventory2Icon />}
                color="secondary"
                helper={t('crm.license.block.details.helper', 'Estado, fechas y propietario.')}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={1}>
                      <LabelWithIcon
                        icon={<MemoryIcon fontSize="small" color="info" />}
                        label={t('crm.license.mac', { defaultValue: 'MAC: {{mac}}', mac: detail.row.macAddress || '-' })}
                        color="info"
                      />
                      <LabelWithIcon
                        icon={<PersonIcon fontSize="small" color="primary" />}
                        label={t('crm.license.name', { defaultValue: 'Nombre: {{name}}', name: detail.row.name || '-' })}
                        color="primary"
                      />
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Inventory2Icon fontSize="small" color="secondary" />
                        <StatusChip status={detail.row.status} />
                      </Stack>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={1}>
                      <LabelWithIcon
                        icon={<CalendarMonthIcon fontSize="small" color="primary" />}
                        label={t('crm.license.created', { defaultValue: 'Creada: {{date}}', date: formatDate(detail.row.createdAt) })}
                        color="primary"
                      />
                      <LabelWithIcon
                        icon={<CalendarMonthIcon fontSize="small" color="warning" />}
                        label={t('crm.license.expires', { defaultValue: 'Expira: {{date}}', date: formatDate(detail.row.expireAt) })}
                        color="warning"
                      />
                      <LabelWithIcon
                        icon={<CalendarMonthIcon fontSize="small" color="secondary" />}
                        label={t('crm.license.ownerSince', { defaultValue: 'Owner desde: {{date}}', date: formatDate(detail.row.currentOwnerSince) })}
                        color="secondary"
                      />
                    </Stack>
                  </Grid>
                </Grid>
              </InfoBlock>
            </Stack>
          ) : null}

          {detail.type === 'invoice' && detail.row ? (
            <Stack spacing={2}>
              <InfoBlock
                title={t('crm.invoice.block.amount.title', 'Cobro y estado')}
                icon={<CreditCardIcon />}
                color="success"
                helper={t('crm.invoice.block.amount.helper', 'Importe total y método de pago.')}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={0.75}>
                      <LabelWithIcon
                        icon={<MonetizationOnIcon fontSize="small" color="success" />}
                        label={t('crm.invoice.totalPaid', {
                          defaultValue: 'Total pagado: {{amount}}',
                          amount: formatCurrency(Number(detail.row.amountPaid) - Number(detail.row.amountDiscount))
                        })}
                        color="success"
                      />
                      <LabelWithIcon
                        icon={<PriceChangeIcon fontSize="small" color="warning" />}
                        label={t('crm.invoice.discount', {
                          defaultValue: 'Descuento: {{discount}}',
                          discount: formatCurrency(detail.row.amountDiscount)
                        })}
                        color="warning"
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={0.75}>
                      <LabelWithIcon
                        icon={<LanguageIcon fontSize="small" color="info" />}
                        label={t('crm.invoice.method', { defaultValue: 'Método: {{method}}', method: detail.row.paymentMethod || '-' })}
                        color="info"
                      />
                      <LabelWithIcon
                        icon={<ChecklistIcon fontSize="small" color="primary" />}
                        label={t('crm.invoice.status', { defaultValue: 'Estado: {{status}}', status: detail.row.status || '-' })}
                        color="primary"
                      />
                    </Stack>
                  </Grid>
                </Grid>
              </InfoBlock>

              <InfoBlock
                title={t('crm.invoice.block.info.title', 'Información de factura')}
                icon={<LanguageIcon />}
                color="info"
                helper={t('crm.invoice.block.info.helper', 'Servicio, paquete, banco y notas.')}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={1}>
                      <LabelWithIcon
                        icon={<CalendarMonthIcon fontSize="small" color="primary" />}
                        label={t('crm.invoice.date', { defaultValue: 'Fecha: {{date}}', date: formatDate(detail.row.paymentDate) })}
                        color="primary"
                      />
                      <LabelWithIcon
                        icon={<HomeRepairServiceIcon fontSize="small" color="info" />}
                        label={t('crm.invoice.service', {
                          defaultValue: 'Servicio: {{service}}',
                          service:
                            serviceMap[String(detail.row.serviceId ?? '')] ||
                            detail.row.serviceName ||
                            detail.row.serviceId ||
                            '-'
                        })}
                        color="info"
                      />
                      <LabelWithIcon
                        icon={<Inventory2Icon fontSize="small" color="secondary" />}
                        label={t('crm.invoice.package', {
                          defaultValue: 'Paquete: {{pkg}}',
                          pkg: packageMap[String(detail.row.packageId ?? '')]?.name || detail.row.packageId || '-'
                        })}
                        color="secondary"
                      />
                      {packageMap[String(detail.row.packageId ?? '')]?.description ? (
                        <FormHelperText sx={{ m: 0 }}>
                          {packageMap[String(detail.row.packageId ?? '')].description}
                        </FormHelperText>
                      ) : null}
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={1}>
                      <LabelWithIcon
                        icon={<AccountBalanceIcon fontSize="small" color="success" />}
                        label={t('crm.invoice.bank', {
                          defaultValue: 'Banco: {{bank}}',
                          bank:
                            bankMap[String(detail.row.bankId ?? '')] ||
                            detail.row.bankName ||
                            detail.row.bankId ||
                            '-'
                        })}
                        color="success"
                      />
                      <LabelWithIcon
                        icon={<NoteAltIcon fontSize="small" color="secondary" />}
                        label={t('crm.invoice.notes', {
                          defaultValue: 'Notas: {{notes}}',
                          notes: detail.row.notes ? detail.row.notes : t('crm.invoice.noNotes', 'Sin notas')
                        })}
                        color="secondary"
                      />
                    </Stack>
                  </Grid>
                </Grid>
              </InfoBlock>
            </Stack>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetail({ open: false, type: null, row: null })}>
            {t('common.close', 'Cerrar')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialogo para ver tablas completas cuando hay muchos registros */}
      <Dialog
        open={tableDialog.open}
        onClose={() => {
          setTableDialog({ open: false, title: '', description: '', rows: [], columns: [], onDetail: null });
          setTablePage(0);
        }}
        fullWidth
        maxWidth="lg"
        PaperProps={{
          sx: (theme) => ({
            borderRadius: 3,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: theme.palette.secondary.light,
            boxShadow: '0 22px 60px rgba(0,0,0,0.22)',
            background: theme.palette.background.paper
          })
        }}
      >
        <DialogTitle
          sx={(theme) => ({
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            py: 2,
            px: 2.5,
            background: theme.palette.mode === 'light'
              ? `linear-gradient(135deg, ${theme.palette.secondary.light}35, ${theme.palette.primary.light}25)`
              : `linear-gradient(135deg, ${theme.palette.secondary.dark}45, ${theme.palette.primary.dark}35)`,
            color: theme.palette.getContrastText(theme.palette.secondary.main),
            borderBottom: `1px solid ${theme.palette.divider}`
          })}
        >
          <Avatar
            sx={(theme) => ({
              bgcolor: theme.palette.secondary.main,
              color: theme.palette.secondary.contrastText,
              width: 40,
              height: 40,
              boxShadow: 4
            })}
          >
            <VisibilityOutlinedIcon />
          </Avatar>
          <Stack spacing={0}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
              {tableDialog.title}
            </Typography>
            {tableDialog.description ? (
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                {tableDialog.description}
              </Typography>
            ) : null}
          </Stack>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 2.5 }}>
          {tableDialog.description ? (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
              {tableDialog.description}
            </Typography>
          ) : null}
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 2.5,
              boxShadow: 4,
              border: '1px solid',
              borderColor: 'divider',
              overflow: 'hidden'
            }}
          >
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  {tableDialog.columns.map((col) => (
                    <TableCell key={col.field}>{col.title}</TableCell>
                  ))}
                  {tableDialog.onDetail ? <TableCell align="right">{t('crm.table.detail', 'Detalle')}</TableCell> : null}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableDialog.rows
                  .slice(tablePage * tableRpp, tablePage * tableRpp + tableRpp)
                  .map((row) => (
                    <TableRow key={row.id || row.subscriptionId || row.invoiceId || row.licenseId}>
                      {tableDialog.columns.map((col) => (
                        <TableCell key={col.field}>
                          {typeof col.render === 'function' ? col.render(row) : row[col.field] ?? '-'}
                        </TableCell>
                      ))}
                      {tableDialog.onDetail ? (
                        <TableCell align="right">
                          <Tooltip title={t('crm.table.detail', 'Detalle')}>
                            <IconButton
                              size="small"
                              onClick={() => tableDialog.onDetail(row)}
                            >
                              <VisibilityOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      ) : null}
                    </TableRow>
                  ))}
                {tableDialog.rows.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={tableDialog.columns.length + (tableDialog.onDetail ? 1 : 0)}
                      align="center"
                    >
                      {t('crm.table.empty', 'No hay datos')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between' }}>
          <TablePagination
            component="div"
            count={tableDialog.rows.length}
            page={tablePage}
            onPageChange={(e, p) => setTablePage(p)}
            rowsPerPage={tableRpp}
            onRowsPerPageChange={(e) => {
              setTableRpp(parseInt(e.target.value, 10));
              setTablePage(0);
            }}
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
          />
          <Button onClick={() => setTableDialog({ open: false, title: '', rows: [], columns: [], onDetail: null })}>
            {t('common.close', 'Cerrar')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
