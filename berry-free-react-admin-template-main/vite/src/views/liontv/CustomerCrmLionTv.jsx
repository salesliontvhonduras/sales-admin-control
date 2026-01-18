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
import LinkIcon from '@mui/icons-material/Link';
import WifiTetheringIcon from '@mui/icons-material/WifiTethering';
import LanguageIcon from '@mui/icons-material/Language';
import PriceChangeIcon from '@mui/icons-material/PriceChange';
import AppShortcutIcon from '@mui/icons-material/AppShortcut';
import SmartDisplayIcon from '@mui/icons-material/SmartDisplay';

import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { lionTvApi } from 'utils/api';

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
    notes: item.notes ?? '',
    serviceId: item.serviceId ?? null
  };
}

function normalizeLicense(item = {}) {
  return {
    licenseId: item.licenseId ?? item.license_id ?? null,
    customerId: item.customerId ?? item.customer_id ?? null,
    macAddress: item.macAddress ?? item.mac_address ?? '',
    app: item.app ?? '',
    status: (item.status ?? '').toUpperCase(),
    typeLicense: (item.typeLicense ?? item.type_license ?? '').toUpperCase(),
    expireAt: item.expireAt ?? item.expire_at ?? null,
    price: Number(item.price ?? 0),
    createdAt: item.createdAt ?? item.created_at ?? null,
    licensePeriod: item.licensePeriod ?? item.license_period ?? '',
    name: item.name ?? '',
    currentOwnerSince: item.currentOwnerSince ?? item.current_owner_since ?? null
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
        bgcolor: (theme) => `${(theme.palette[color]?.main ?? theme.palette.grey[500])}08`,
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
          <Typography variant="caption" color="text.secondary">
            {helper}
          </Typography>
        ) : null}
      </Box>
    </Box>
  );
}

function TableSection({ title, rows, columns, emptyMessage, onDetail }) {
  return (
    <MainCard title={title}>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.field}>{col.title}</TableCell>
              ))}
              {onDetail ? <TableCell align="right">Detalle</TableCell> : null}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id || row.subscriptionId || row.invoiceId || row.licenseId}>
                {columns.map((col) => (
                  <TableCell key={col.field}>
                    {typeof col.render === 'function' ? col.render(row) : row[col.field] ?? '-'}
                  </TableCell>
                ))}
                {onDetail ? (
                  <TableCell align="right">
                    <Tooltip title="Ver detalle">
                      <IconButton size="small" onClick={() => onDetail(row)}>
                        <VisibilityOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                ) : null}
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length + (onDetail ? 1 : 0)} align="center">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </MainCard>
  );
}

export default function CustomerCrmLionTv() {
  const { enqueueSnackbar } = useSnackbar();
  const { accessToken } = useAuth();

  const [customers, setCustomers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [licenses, setLicenses] = useState([]);
  const [packages, setPackages] = useState([]);
  const [lines, setLines] = useState([]);
  const [loading, setLoading] = useState({
    customers: false,
    subscriptions: false,
    invoices: false,
    licenses: false,
    packages: false,
    lines: false
  });
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [detail, setDetail] = useState({ open: false, type: null, row: null });

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
          enqueueSnackbar(err?.response?.data?.message || 'No se pudo cargar la información.', { variant: 'error' });
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

  return (
    <Box sx={{ width: '100%', maxWidth: 1400, mx: 'auto' }}>
      <MainCard
        title="CRM de clientes"
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
                  label="Buscar cliente"
                  placeholder="Nombre, correo o usuario"
                  size="small"
                  sx={fieldSx}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
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
            >
              Recargar
            </Button>
          </Stack>
        }
      >
        {!selectedCustomer ? (
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <Typography variant="h6">Selecciona un cliente para ver su panorama 360°</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Encontrarás sus suscripciones, facturación, licencias y métricas clave.
            </Typography>
          </Box>
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
                        display: 'flex',
                        gap: 2,
                        alignItems: 'center'
                      }}
                    >
                      <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                        {initials(selectedCustomer.fullName)}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1">{selectedCustomer.fullName}</Typography>
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
                              Canal: {selectedCustomer.channel || '-'} • Estatus:{' '}
                              <StatusChip status={selectedCustomer.status} />
                            </Typography>
                          </Stack>
                        </Stack>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={4}>
                        <StatCard
                          icon={<CreditCardIcon />}
                          title="Total facturado"
                          value={formatCurrency(totals.billed)}
                          helper={`Facturas: ${totals.totalInvoices}`}
                          color="success"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <StatCard
                          icon={<ReceiptLongIcon />}
                          title="Suscripciones"
                          value={`${customerSubscriptions.length}`}
                          helper={`Activas: ${totals.activeSubs}`}
                          color="info"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <StatCard
                          icon={<LayersIcon />}
                          title="Licencias"
                          value={`${customerLicenses.length}`}
                          helper={`Activas: ${totals.activeLicenses}`}
                          color="warning"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <StatCard
                          icon={<CalendarMonthIcon />}
                          title="Próxima renovación"
                          value={totals.nextRenewal ? formatDate(totals.nextRenewal) : 'Sin definir'}
                          helper="Fecha más cercana"
                          color="primary"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <StatCard
                          icon={<MonetizationOnIcon />}
                          title="Último pago"
                          value={totals.lastInvoice ? formatDate(totals.lastInvoice) : 'No hay pagos'}
                          helper="Fecha de la última factura"
                          color="secondary"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <StatCard
                          icon={<PersonIcon />}
                          title="Referido por"
                          value={selectedCustomer.refererBy || 'Sin referencia'}
                          helper={selectedCustomer.openingDate ? `Alta: ${formatDate(selectedCustomer.openingDate)}` : ''}
                          color="default"
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </MainCard>

            <Grid container spacing={gridSpacing}>
              <Grid item xs={12} md={6}>
                <TableSection
                  title="Suscripciones"
                  rows={customerSubscriptions.slice(0, 6)}
                  emptyMessage="Sin suscripciones para este cliente."
                  onDetail={(row) => setDetail({ open: true, type: 'subscription', row })}
                  columns={[
                    { field: 'lineLabel', title: 'Línea' },
                    {
                      field: 'packageName',
                      title: 'Paquete',
                      render: (row) => (
                        <Stack spacing={0.25}>
                          <Typography variant="body2">{row.packageName || row.packageId || '-'}</Typography>
                          {row.packageDescription ? (
                            <Typography variant="caption" color="text.secondary" noWrap>
                              {row.packageDescription}
                            </Typography>
                          ) : null}
                        </Stack>
                      )
                    },
                    { field: 'billing', title: 'Billing' },
                    { field: 'status', title: 'Estado', render: (row) => <StatusChip status={row.status} /> },
                    { field: 'startDate', title: 'Inicio', render: (row) => formatDate(row.startDate) },
                    { field: 'renewalDate', title: 'Renovación', render: (row) => formatDate(row.renewalDate) }
                  ]}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TableSection
                  title="Licencias"
                  rows={customerLicenses.slice(0, 6)}
                  emptyMessage="Sin licencias para este cliente."
                  onDetail={(row) => setDetail({ open: true, type: 'license', row })}
                  columns={[
                    { field: 'macAddress', title: 'MAC' },
                    { field: 'app', title: 'App' },
                    { field: 'typeLicense', title: 'Tipo', render: (row) => <StatusChip status={row.typeLicense} /> },
                    { field: 'status', title: 'Estado', render: (row) => <StatusChip status={row.status} /> },
                    { field: 'expireAt', title: 'Expira', render: (row) => formatDate(row.expireAt) }
                  ]}
                />
              </Grid>
            </Grid>

            <Grid container spacing={gridSpacing}>
              <Grid item xs={12}>
                <TableSection
                  title="Historial de facturación"
                  rows={customerInvoices.slice(0, 8)}
                  emptyMessage="Sin facturas para este cliente."
                  onDetail={(row) => setDetail({ open: true, type: 'invoice', row })}
                  columns={[
                    { field: 'paymentDate', title: 'Fecha', render: (row) => formatDate(row.paymentDate) },
                    { field: 'paymentMethod', title: 'Método' },
                    { field: 'status', title: 'Estado', render: (row) => <StatusChip status={row.status} /> },
                    {
                      field: 'amountPaid',
                      title: 'Total',
                      render: (row) => formatCurrency(Number(row.amountPaid || 0) - Number(row.amountDiscount || 0))
                    }
                  ]}
                />
              </Grid>
            </Grid>
          </Stack>
        )}
      </MainCard>
      <Divider sx={{ my: 3 }} />
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="flex-end">
        <Chip
          label={`Clientes cargados: ${customers.length}`}
          color="primary"
          variant="outlined"
          size="small"
        />
        <Chip
          label={`Datasets: ${loading.customers || loading.subscriptions || loading.invoices || loading.licenses ? 'Cargando...' : 'Listos'}`}
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
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <VisibilityOutlinedIcon color="primary" />
          {detail.type === 'subscription' && 'Detalle de suscripción'}
          {detail.type === 'invoice' && 'Detalle de factura'}
          {detail.type === 'license' && 'Detalle de licencia'}
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            bgcolor: 'background.default',
            backgroundImage: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light}12, ${theme.palette.secondary.light}10)`
          }}
        >
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
              {detail.type === 'subscription' && 'Resumen de la suscripción'}
              {detail.type === 'license' && 'Resumen de la licencia'}
              {detail.type === 'invoice' && 'Resumen de la factura'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {detail.type === 'subscription' &&
                'Visualiza línea, paquete, fechas y estado de pago automático de la suscripción seleccionada.'}
              {detail.type === 'license' &&
                'Información clave de la licencia: aplicación, tipo, ciclo, vigencia y propietario actual.'}
              {detail.type === 'invoice' &&
                'Monto pagado en Lps, método, banco y notas relevantes para la factura elegida.'}
            </Typography>
          </Box>

          {detail.type === 'subscription' && detail.row ? (
            <Stack spacing={2}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <StatCard
                    icon={<WifiTetheringIcon />}
                    title="Línea"
                    value={detail.row.lineId || '-'}
                    helper={`Usuario: ${detail.row.username_line || detail.row.username || '-'}`}
                    color="info"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StatCard
                    icon={<PriceChangeIcon />}
                    title="Monto"
                    value={formatCurrency(detail.row.amount)}
                    helper={`Descuento: ${formatCurrency(detail.row.discount)}`}
                    color="success"
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <MainCard title="Fechas">
                    <Stack spacing={1}>
                      <Typography variant="body2">Inicio: {formatDate(detail.row.startDate)}</Typography>
                      <Typography variant="body2">Renovación: {formatDate(detail.row.renewalDate)}</Typography>
                      <Typography variant="body2">Billing: {detail.row.billing || '-'}</Typography>
                    </Stack>
                  </MainCard>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MainCard title="Estado">
                    <Stack spacing={1}>
                      <StatusChip status={detail.row.status} />
                      <Typography variant="body2">
                        Paquete: {detail.row.packageName || detail.row.packageId || '-'}
                      </Typography>
                      {detail.row.packageDescription ? (
                        <FormHelperText sx={{ m: 0 }}>{detail.row.packageDescription}</FormHelperText>
                      ) : null}
                      <Typography variant="body2">
                        Pago automático: {detail.row.automaticPay ? 'Sí' : 'No'}
                      </Typography>
                      {detail.row.linkAutomatic ? (
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <LinkIcon fontSize="small" color="action" />
                          <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                            {detail.row.linkAutomatic}
                          </Typography>
                        </Stack>
                      ) : null}
                    </Stack>
                  </MainCard>
                </Grid>
              </Grid>
            </Stack>
          ) : null}

          {detail.type === 'license' && detail.row ? (
            <Stack spacing={2}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <StatCard
                    icon={<SmartDisplayIcon />}
                    title="Aplicación"
                    value={detail.row.app || '-'}
                    helper={`Tipo: ${detail.row.typeLicense || '-'}`}
                    color="info"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StatCard
                    icon={<PriceChangeIcon />}
                    title="Precio"
                    value={formatCurrency(detail.row.price)}
                    helper={`Periodo: ${detail.row.licensePeriod || '-'}`}
                    color="success"
                  />
                </Grid>
              </Grid>
              <MainCard title="Detalles de licencia">
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={1}>
                      <Typography variant="body2">MAC: {detail.row.macAddress || '-'}</Typography>
                      <Typography variant="body2">Nombre: {detail.row.name || '-'}</Typography>
                      <Typography variant="body2">Estado: <StatusChip status={detail.row.status} /></Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={1}>
                      <Typography variant="body2">Creada: {formatDate(detail.row.createdAt)}</Typography>
                      <Typography variant="body2">Expira: {formatDate(detail.row.expireAt)}</Typography>
                      <Typography variant="body2">
                        Owner desde: {formatDate(detail.row.currentOwnerSince)}
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </MainCard>
            </Stack>
          ) : null}

          {detail.type === 'invoice' && detail.row ? (
            <Stack spacing={2}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <StatCard
                    icon={<CreditCardIcon />}
                    title="Total pagado"
                    value={formatCurrency(Number(detail.row.amountPaid) - Number(detail.row.amountDiscount))}
                    helper={`Descuento: ${formatCurrency(detail.row.amountDiscount)}`}
                    color="success"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StatCard
                    icon={<LanguageIcon />}
                    title="Método"
                    value={detail.row.paymentMethod || '-'}
                    helper={`Estado: ${detail.row.status || '-'}`}
                    color="info"
                  />
                </Grid>
              </Grid>
              <MainCard title="Información de factura">
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={1}>
                      <Typography variant="body2">Fecha: {formatDate(detail.row.paymentDate)}</Typography>
                      <Typography variant="body2">Servicio: {detail.row.serviceId || '-'}</Typography>
                      <Typography variant="body2">
                        Paquete: {packageMap[String(detail.row.packageId ?? '')]?.name || detail.row.packageId || '-'}
                      </Typography>
                      {packageMap[String(detail.row.packageId ?? '')]?.description ? (
                        <FormHelperText sx={{ m: 0 }}>
                          {packageMap[String(detail.row.packageId ?? '')].description}
                        </FormHelperText>
                      ) : null}
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={1}>
                      <Typography variant="body2">Banco: {detail.row.bankId || '-'}</Typography>
                      <Typography variant="body2">
                        Notas: {detail.row.notes ? detail.row.notes : 'Sin notas'}
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </MainCard>
            </Stack>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetail({ open: false, type: null, row: null })}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
