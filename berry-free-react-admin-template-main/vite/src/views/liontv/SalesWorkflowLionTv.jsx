import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import Alert from '@mui/material/Alert';
import Autocomplete from '@mui/material/Autocomplete';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Switch from '@mui/material/Switch';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import DevicesIcon from '@mui/icons-material/Devices';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import LanIcon from '@mui/icons-material/Lan';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import RefreshIcon from '@mui/icons-material/Refresh';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import SearchIcon from '@mui/icons-material/Search';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { lionTvApi } from 'utils/api';
import { listBanks, listServices } from 'api/catalog-admin';
import {
  executeActivation,
  executeRenewal,
  getSalesWorkflowOptions,
  lookupSalesWorkflow,
  previewActivation,
  previewRenewal
} from 'api/liontv-sales-workflow';

const activationSteps = ['Cliente', 'Línea y plan', 'Pago y confirmación'];
const renewalSteps = ['Buscar', 'Seleccionar plan', 'Pago y confirmación'];

const today = () => new Date().toISOString().slice(0, 10);

const plusMonths = (date, months = 1) => {
  const parsed = new Date(`${date || today()}T00:00:00`);
  parsed.setMonth(parsed.getMonth() + months);
  return parsed.toISOString().slice(0, 10);
};

const nowForInput = () => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
};

const newIdempotencyKey = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    minHeight: 56,
    alignItems: 'center',
    overflow: 'visible'
  },
  '& .MuiOutlinedInput-input': {
    py: 1.45,
    minWidth: 0
  },
  '& .MuiInputBase-input': {
    minWidth: 0
  },
  '& .MuiInputAdornment-root': {
    mt: '0 !important'
  },
  '& .MuiInputLabel-root': {
    fontWeight: 600,
    maxWidth: 'calc(100% - 28px)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  '& .MuiInputLabel-root.MuiInputLabel-shrink': {
    maxWidth: 'calc(133% - 32px)'
  },
  '& textarea.MuiInputBase-input': {
    py: 0.5
  }
};

const sectionSx = {
  p: { xs: 1.5, sm: 2.25 },
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: 2.5,
  bgcolor: 'background.paper',
  overflow: 'visible',
  '& .MuiGrid-item': {
    minWidth: 0
  }
};

const summaryCardSx = {
  p: { xs: 1.5, sm: 2 },
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
  bgcolor: 'background.paper',
  height: '100%',
  minWidth: 0
};

const stepperSx = {
  p: { xs: 1.5, sm: 2 },
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: 2.5,
  bgcolor: 'background.paper',
  '& .MuiStepLabel-label': {
    mt: { xs: 0, sm: 0.75 },
    fontSize: { xs: '0.8rem', sm: '0.875rem' },
    fontWeight: 800,
    lineHeight: 1.25
  },
  '& .MuiStepIcon-root': {
    fontSize: { xs: 24, sm: 28 }
  },
  '& .MuiStepConnector-line': {
    minHeight: { xs: 28, sm: 'auto' }
  }
};

const actionButtonSx = {
  width: { xs: '100%', sm: 'auto' },
  minHeight: 44,
  whiteSpace: 'nowrap'
};

const defaultOptions = {
  packages: [],
  banks: [],
  services: [],
  paymentMethods: [
    { code: 'Bank Transfer', label: 'Transferencia bancaria', requiresBank: true, active: true, order: 10 },
    { code: 'Paypal', label: 'PayPal', requiresBank: false, active: true, order: 20 },
    { code: 'Ecommerce', label: 'Ecommerce', requiresBank: false, active: true, order: 30 },
    { code: 'Link pago', label: 'Link de pago', requiresBank: false, active: true, order: 40 },
    { code: 'Debito Automatico', label: 'Débito automático', requiresBank: false, active: true, order: 50 },
    { code: 'Cryptocurrency', label: 'Criptomoneda', requiresBank: false, active: true, order: 60 },
    { code: 'Loyalty Points', label: 'Puntos de lealtad', requiresBank: false, active: true, order: 70 }
  ],
  defaults: {
    serviceId: 1,
    billing: 'MONTHLY',
    customerStatus: 'ACTIVE',
    paymentStatus: 'PAID',
    paymentMethod: 'Ecommerce'
  }
};

const defaultActivation = (options = defaultOptions) => ({
  customer: {
    customerFullname: '',
    gender: 'M',
    customerMail: '',
    customerPhone: '',
    customerStatus: options.defaults?.customerStatus || 'ACTIVE',
    openingDate: today(),
    channel: 'SALES_WORKFLOW',
    isReferered: false,
    refererBy: ''
  },
  line: {
    lineId: '',
    username: '',
    password: '',
    packageId: '',
    packageName: '',
    expDate: plusMonths(today()),
    enabled: true,
    maxConnections: 1,
    provider: 'LION_TV',
    lineCountry: 'GLOBAL'
  },
  linePlusEnabled: false,
  linePlus: {
    lineId: '',
    username: '',
    password: '',
    packageId: '',
    packageName: '',
    expDate: plusMonths(today()),
    enabled: true,
    maxConnections: 1,
    provider: 'LION_TV',
    lineCountry: 'GLOBAL'
  },
  subscription: {
    billing: options.defaults?.billing || 'MONTHLY',
    amount: '',
    discount: 0,
    status: 'ACTIVE',
    startDate: today(),
    renewalDate: plusMonths(today()),
    packageId: '',
    automaticPay: false,
    linkAutomatic: ''
  },
  invoice: {
    serviceId: options.defaults?.serviceId || 1,
    paymentDate: nowForInput(),
    amountPaid: '',
    amountDiscount: 0,
    loyaltyPointsUsed: 0,
    loyaltyAmountRedeemed: 0,
    status: options.defaults?.paymentStatus || 'PAID',
    packageId: '',
    paymentMethod: options.defaults?.paymentMethod || 'Ecommerce',
    bankId: '',
    notes: ''
  },
  desiredDeviceCount: 1
});

const defaultRenewal = (options = defaultOptions) => ({
  subscriptionId: '',
  currentDeviceCount: 0,
  desiredDeviceCount: 1,
  renewalBaseMode: '',
  subscription: {
    billing: options.defaults?.billing || 'MONTHLY',
    amount: '',
    discount: 0,
    status: 'ACTIVE',
    renewalDate: '',
    packageId: '',
    automaticPay: false,
    linkAutomatic: ''
  },
  invoice: {
    serviceId: options.defaults?.serviceId || 1,
    paymentDate: nowForInput(),
    amountPaid: '',
    amountDiscount: 0,
    loyaltyPointsUsed: 0,
    loyaltyAmountRedeemed: 0,
    status: options.defaults?.paymentStatus || 'PAID',
    packageId: '',
    paymentMethod: options.defaults?.paymentMethod || 'Ecommerce',
    bankId: '',
    notes: ''
  }
});

function unwrapArray(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.content)) return payload.content;
  return [];
}

function normalizeCustomer(item = {}) {
  return {
    id: item.customerId ?? item.id ?? item.customer_id ?? null,
    label: item.customerFullname ?? item.fullName ?? item.customer_name ?? item.name ?? '',
    email: item.customerMail ?? item.email ?? item.mail ?? '',
    phone: item.customerPhone ?? item.phone ?? '',
    status: item.customerStatus ?? item.status ?? ''
  };
}

function normalizeCatalogOption(item = {}, fallbackPrefix = 'Opción') {
  const id = item.id ?? item.bankId ?? item.serviceId ?? item.value ?? item.code ?? null;
  return {
    id,
    label: item.label ?? item.name ?? item.bankName ?? item.serviceName ?? item.description ?? `${fallbackPrefix} ${id ?? ''}`.trim(),
    active: item.active ?? item.enabled ?? item.status !== 'INACTIVE'
  };
}

function toNumberOrNull(value) {
  if (value === '' || value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function cleanMoney(value) {
  const parsed = toNumberOrNull(value);
  return parsed === null ? null : parsed;
}

function normalizeText(value) {
  return String(value || '').trim().toLowerCase();
}

function normalizePhone(value) {
  return String(value || '').replace(/\D/g, '');
}

function formatMoney(value) {
  const amount = Number(value ?? 0);
  return Number.isNaN(amount) ? '$0.00' : `$${amount.toFixed(2)}`;
}

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(`${String(value).slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
}

function extractError(error, fallback) {
  return error?.response?.data?.message || error?.message || fallback;
}

function selectedPaymentMethod(options, code) {
  return (options.paymentMethods || []).find((item) => item.code === code) || null;
}

function paymentRequiresBank(options, code) {
  const method = selectedPaymentMethod(options, code);
  return Boolean(method?.requiresBank) || code === 'Bank Transfer';
}

function setNestedValue(setState, section, field, value) {
  setState((prev) => ({
    ...prev,
    [section]: {
      ...prev[section],
      [field]: value
    }
  }));
}

function makeLicenses(count, billing) {
  const safeCount = Math.max(Number(count || 0), 0);
  return Array.from({ length: safeCount }).map((_, index) => ({
    randomLicense: true,
    name: `Dispositivo ${index + 1}`,
    status: 'ACTIVE',
    isPaid: true,
    price: 0,
    licensePeriod: billing || 'MONTHLY',
    typeLicense: 'STANDARD'
  }));
}

function buildInvoice(invoice, packageId, amount, options) {
  const requiresBank = paymentRequiresBank(options, invoice.paymentMethod);
  return {
    ...invoice,
    serviceId: toNumberOrNull(invoice.serviceId) || options.defaults?.serviceId || 1,
    packageId: toNumberOrNull(invoice.packageId) || toNumberOrNull(packageId),
    amountPaid: cleanMoney(invoice.amountPaid) ?? cleanMoney(amount) ?? 0,
    amountDiscount: cleanMoney(invoice.amountDiscount) ?? 0,
    loyaltyPointsUsed: toNumberOrNull(invoice.loyaltyPointsUsed) || 0,
    loyaltyAmountRedeemed: cleanMoney(invoice.loyaltyAmountRedeemed) ?? 0,
    bankId: requiresBank ? toNumberOrNull(invoice.bankId) : null
  };
}

function buildActivationPayload(form, options, withIdempotency = false) {
  const packageId = toNumberOrNull(form.subscription.packageId) || toNumberOrNull(form.line.packageId);
  const amount = cleanMoney(form.subscription.amount);
  return {
    ...(withIdempotency ? { idempotencyKey: newIdempotencyKey() } : {}),
    customer: form.customer,
    line: {
      ...form.line,
      packageId: toNumberOrNull(form.line.packageId),
      maxConnections: toNumberOrNull(form.line.maxConnections) || toNumberOrNull(form.desiredDeviceCount) || 1,
      enabled: true
    },
    linePlus: form.linePlusEnabled && form.linePlus.lineId
      ? {
          ...form.linePlus,
          packageId: toNumberOrNull(form.linePlus.packageId) || packageId,
          packageName: form.linePlus.packageName || form.line.packageName,
          maxConnections: toNumberOrNull(form.linePlus.maxConnections) || toNumberOrNull(form.desiredDeviceCount) || 1,
          enabled: true
        }
      : null,
    subscription: {
      ...form.subscription,
      packageId,
      amount: amount ?? 0,
      discount: cleanMoney(form.subscription.discount) ?? 0,
      automaticPay: Boolean(form.subscription.automaticPay)
    },
    invoice: buildInvoice(form.invoice, packageId, amount, options),
    licenses: makeLicenses(form.desiredDeviceCount, form.subscription.billing)
  };
}

function buildRenewalPayload(form, options, withIdempotency = false) {
  const packageId = toNumberOrNull(form.subscription.packageId);
  const amount = cleanMoney(form.subscription.amount);
  return {
    ...(withIdempotency ? { idempotencyKey: newIdempotencyKey() } : {}),
    subscriptionId: toNumberOrNull(form.subscriptionId),
    desiredDeviceCount: toNumberOrNull(form.desiredDeviceCount) || 0,
    renewalBaseMode: form.renewalBaseMode || null,
    subscription: {
      ...form.subscription,
      packageId,
      amount: amount ?? 0,
      discount: cleanMoney(form.subscription.discount) ?? 0,
      renewalDate: form.subscription.renewalDate || null,
      automaticPay: Boolean(form.subscription.automaticPay)
    },
    invoice: buildInvoice(form.invoice, packageId, amount, options),
    newLicenses: []
  };
}

function Section({ title, helper, children }) {
  return (
    <Box sx={sectionSx}>
      <Stack spacing={1.5}>
        <Box>
          <Typography variant="subtitle1" fontWeight={800}>
            {title}
          </Typography>
          {helper ? (
            <Typography variant="body2" color="text.secondary">
              {helper}
            </Typography>
          ) : null}
        </Box>
        {children}
      </Stack>
    </Box>
  );
}

function MiniMetric({ label, value, icon }) {
  return (
    <Paper variant="outlined" sx={summaryCardSx}>
      <Stack direction="row" spacing={1.25} alignItems="center">
        <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}>{icon}</Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="caption" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="subtitle2" fontWeight={800} sx={{ lineHeight: 1.25, overflowWrap: 'anywhere' }}>
            {value || '-'}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}

function PackageCard({ option, selected, onClick }) {
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 2,
        borderColor: selected ? 'primary.main' : 'divider',
        boxShadow: selected ? '0 0 0 2px rgba(229,9,20,0.18)' : 'none',
        height: '100%'
      }}
    >
      <CardActionArea onClick={onClick} sx={{ p: 2, height: '100%' }}>
        <Stack spacing={1}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
            <Typography variant="subtitle1" fontWeight={900} sx={{ lineHeight: 1.2, overflowWrap: 'anywhere' }}>
              {option?.name || '-'}
            </Typography>
            {selected ? <CheckCircleOutlineIcon color="primary" /> : null}
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {option?.roleCount || 1} dispositivo(s) sugeridos
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {option?.type ? <Chip size="small" label={option.type} /> : null}
            {option?.officialDuration ? <Chip size="small" label={`${option.officialDuration} ${option.officialDurationIn || ''}`} /> : null}
          </Stack>
        </Stack>
      </CardActionArea>
    </Card>
  );
}

function PreviewCard({ preview }) {
  if (!preview) return null;

  return (
    <Card variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
      <Stack spacing={1.5}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ sm: 'center' }} justifyContent="space-between">
          <Box>
            <Typography variant="subtitle1" fontWeight={900}>
              Resumen antes de confirmar
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {preview.customerName || 'Cliente'} · Suscripción {preview.subscriptionId || 'nueva'}
            </Typography>
          </Box>
          <Chip color="primary" label={preview.workflowType === 'RENEWAL' ? 'Renovación' : 'Nueva cuenta'} />
        </Stack>
        <Divider />
        <Grid container spacing={1.5}>
          <Grid item xs={12} sm={6} md={3}>
            <MiniMetric label="Plan" value={preview.newPackageName || preview.newPackageId} icon={<Inventory2Icon fontSize="small" />} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MiniMetric label="Fecha nueva" value={formatDate(preview.newRenewalDate)} icon={<AutorenewIcon fontSize="small" />} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MiniMetric
              label="Dispositivos"
              value={`${preview.desiredDeviceCount ?? 0} deseados · ${preview.additionalLicensesToCreate ?? 0} nuevas`}
              icon={<DevicesIcon fontSize="small" />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MiniMetric label="Monto factura" value={formatMoney(preview.invoiceAmount ?? preview.amount)} icon={<PaidOutlinedIcon fontSize="small" />} />
          </Grid>
        </Grid>
        {preview.currentPackageName && preview.currentPackageName !== preview.newPackageName ? (
          <Alert severity="info">
            Cambio de plan: {preview.currentPackageName} → {preview.newPackageName}
          </Alert>
        ) : null}
        {preview.warnings?.length ? (
          <Alert severity="warning">
            <Stack component="ul" sx={{ m: 0, pl: 2 }}>
              {preview.warnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </Stack>
          </Alert>
        ) : null}
      </Stack>
    </Card>
  );
}

function ResultCard({ result }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  if (!result) return null;

  const copyMessage = async () => {
    const summary = result.summary || {};
    const message = `Hola ${summary.customerName || ''}, tu ${result.workflowType === 'RENEWAL' ? 'renovación' : 'activación'} Lion TV Premium quedó registrada. Nueva fecha: ${formatDate(summary.newRenewalDate)}.`;
    await navigator.clipboard?.writeText(message);
    enqueueSnackbar('Mensaje copiado para WhatsApp.', { variant: 'success' });
  };

  return (
    <Card variant="outlined" sx={{ p: 2, borderRadius: 2, borderColor: 'success.main' }}>
      <Stack spacing={1.5}>
        <Stack direction="row" spacing={1} alignItems="center">
          <CheckCircleOutlineIcon color="success" />
          <Typography variant="subtitle1" fontWeight={900}>
            Flujo ejecutado
          </Typography>
        </Stack>
        <Grid container spacing={1.5}>
          {[
            ['Cliente', result.customerId],
            ['Línea', result.lineId],
            ['Suscripción', result.subscriptionId],
            ['Factura', result.invoiceId],
            ['Licencias nuevas', result.createdLicenseIds?.length || 0]
          ].map(([label, value]) => (
            <Grid item xs={12} sm={6} md={2.4} key={label}>
              <Typography variant="caption" color="text.secondary">
                {label}
              </Typography>
              <Typography variant="body2" fontWeight={800}>
                {value || '-'}
              </Typography>
            </Grid>
          ))}
        </Grid>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Button size="small" onClick={() => navigate('/liontv/customers')}>
            Abrir cliente
          </Button>
          <Button size="small" onClick={() => navigate('/liontv/subscriptions')}>
            Abrir suscripción
          </Button>
          <Button size="small" onClick={() => navigate('/liontv/invoices')}>
            Abrir factura
          </Button>
          <Button size="small" onClick={() => navigate('/liontv/licenses')}>
            Abrir licencias
          </Button>
          <Button size="small" startIcon={<ContentCopyIcon />} onClick={copyMessage}>
            Copiar WhatsApp
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}

export default function SalesWorkflowLionTv() {
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [tab, setTab] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [renewalStep, setRenewalStep] = useState(0);
  const [options, setOptions] = useState(defaultOptions);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [activation, setActivation] = useState(() => defaultActivation(defaultOptions));
  const [renewal, setRenewal] = useState(() => defaultRenewal(defaultOptions));
  const [lookupQuery, setLookupQuery] = useState('');
  const [lookup, setLookup] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);

  const packages = options.packages || [];
  const paymentMethods = (options.paymentMethods || []).filter((item) => item.active !== false).sort((a, b) => (a.order || 0) - (b.order || 0));
  const banks = (options.banks || []).filter((item) => item.active !== false);
  const services = (options.services || []).filter((item) => item.active !== false);

  const selectedActivationPackage = useMemo(
    () => packages.find((item) => String(item.packageId) === String(activation.subscription.packageId || activation.line.packageId)) || null,
    [activation.line.packageId, activation.subscription.packageId, packages]
  );
  const selectedRenewalPackage = useMemo(
    () => packages.find((item) => String(item.packageId) === String(renewal.subscription.packageId)) || null,
    [packages, renewal.subscription.packageId]
  );
  const selectedSubscription = useMemo(
    () => lookup?.subscriptions?.find((item) => String(item.subscriptionId) === String(renewal.subscriptionId)),
    [lookup?.subscriptions, renewal.subscriptionId]
  );
  const duplicateCustomers = useMemo(() => {
    const email = normalizeText(activation.customer.customerMail);
    const phone = normalizePhone(activation.customer.customerPhone);
    if (!email && !phone) return [];
    return customers.filter((customer) => {
      const sameEmail = email && normalizeText(customer.email) === email;
      const samePhone = phone && normalizePhone(customer.phone) === phone;
      return sameEmail || samePhone;
    });
  }, [activation.customer.customerMail, activation.customer.customerPhone, customers]);
  const activationRequiresBank = paymentRequiresBank(options, activation.invoice.paymentMethod);
  const renewalRequiresBank = paymentRequiresBank(options, renewal.invoice.paymentMethod);

  const loadOptions = useCallback(async () => {
    setOptionsLoading(true);
    try {
      const [workflowResult, bankResult, serviceResult, customerResult] = await Promise.allSettled([
        getSalesWorkflowOptions(),
        listBanks(),
        listServices(),
        lionTvApi.get('/customers/v1', { params: { index: 0, size: 5000 } })
      ]);

      const workflowOptions = workflowResult.status === 'fulfilled' && workflowResult.value ? workflowResult.value : defaultOptions;
      const loadedBanks =
        bankResult.status === 'fulfilled'
          ? unwrapArray(bankResult.value).map((item) => normalizeCatalogOption(item, 'Banco'))
          : workflowOptions.banks || [];
      const loadedServices =
        serviceResult.status === 'fulfilled'
          ? unwrapArray(serviceResult.value).map((item) => normalizeCatalogOption(item, 'Servicio'))
          : workflowOptions.services || [];
      const customersPayload =
        customerResult.status === 'fulfilled'
          ? customerResult.value?.data?.data ?? customerResult.value?.data ?? {}
          : [];
      const normalizedCustomers = unwrapArray(customersPayload).map(normalizeCustomer);

      const nextOptions = {
        ...defaultOptions,
        ...workflowOptions,
        banks: loadedBanks,
        services: loadedServices.length ? loadedServices : workflowOptions.services || [],
        paymentMethods: workflowOptions.paymentMethods?.length ? workflowOptions.paymentMethods : defaultOptions.paymentMethods,
        defaults: { ...defaultOptions.defaults, ...(workflowOptions.defaults || {}) }
      };

      setOptions(nextOptions);
      setCustomers(normalizedCustomers);
      setActivation((prev) => ({
        ...prev,
        customer: {
          ...prev.customer,
          customerStatus: prev.customer.customerStatus || nextOptions.defaults.customerStatus
        },
        subscription: {
          ...prev.subscription,
          billing: prev.subscription.billing || nextOptions.defaults.billing
        },
        invoice: {
          ...prev.invoice,
          serviceId: prev.invoice.serviceId || nextOptions.defaults.serviceId,
          status: prev.invoice.status || nextOptions.defaults.paymentStatus,
          paymentMethod: prev.invoice.paymentMethod || nextOptions.defaults.paymentMethod
        }
      }));
      setRenewal((prev) => ({
        ...prev,
        subscription: {
          ...prev.subscription,
          billing: prev.subscription.billing || nextOptions.defaults.billing
        },
        invoice: {
          ...prev.invoice,
          serviceId: prev.invoice.serviceId || nextOptions.defaults.serviceId,
          status: prev.invoice.status || nextOptions.defaults.paymentStatus,
          paymentMethod: prev.invoice.paymentMethod || nextOptions.defaults.paymentMethod
        }
      }));
    } catch (error) {
      enqueueSnackbar(extractError(error, 'No se pudieron cargar las opciones del workflow.'), { variant: 'error' });
    } finally {
      setOptionsLoading(false);
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    loadOptions();
  }, [loadOptions]);

  const clearPreview = () => {
    setPreview(null);
    setResult(null);
  };

  const applyActivationPackage = (pkg) => {
    if (!pkg) return;
    const devices = pkg.roleCount || 1;
    setActivation((prev) => ({
      ...prev,
      desiredDeviceCount: devices,
      line: {
        ...prev.line,
        packageId: pkg.packageId,
        packageName: pkg.name,
        maxConnections: devices
      },
      linePlus: {
        ...prev.linePlus,
        packageId: pkg.packageId,
        packageName: pkg.name,
        maxConnections: devices
      },
      subscription: {
        ...prev.subscription,
        packageId: pkg.packageId
      },
      invoice: {
        ...prev.invoice,
        packageId: pkg.packageId
      }
    }));
    clearPreview();
  };

  const applyRenewalPackage = (pkg) => {
    if (!pkg) return;
    const devices = pkg.roleCount || renewal.currentDeviceCount || 1;
    setRenewal((prev) => ({
      ...prev,
      desiredDeviceCount: devices,
      subscription: {
        ...prev.subscription,
        packageId: pkg.packageId
      },
      invoice: {
        ...prev.invoice,
        packageId: pkg.packageId
      }
    }));
    clearPreview();
  };

  const handleLookup = async () => {
    if (!lookupQuery.trim()) return;
    setBusy(true);
    try {
      const response = await lookupSalesWorkflow(lookupQuery.trim());
      setLookup(response || { customers: [], subscriptions: [] });
      setRenewalStep(1);
      clearPreview();
    } catch (error) {
      enqueueSnackbar(extractError(error, 'No se pudo buscar el cliente.'), { variant: 'error' });
    } finally {
      setBusy(false);
    }
  };

  const handleSelectSubscription = (subscription) => {
    const pkg = packages.find((item) => String(item.packageId) === String(subscription.packageId));
    const devices = subscription.configuredDevices || pkg?.roleCount || 1;
    setRenewal({
      ...defaultRenewal(options),
      subscriptionId: subscription.subscriptionId,
      currentDeviceCount: subscription.configuredDevices || 0,
      desiredDeviceCount: devices,
      subscription: {
        billing: subscription.billing || options.defaults.billing || 'MONTHLY',
        amount: subscription.amount ?? '',
        discount: subscription.discount ?? 0,
        status: 'ACTIVE',
        renewalDate: '',
        packageId: subscription.packageId || '',
        automaticPay: false,
        linkAutomatic: ''
      },
      invoice: {
        ...defaultRenewal(options).invoice,
        amountPaid: subscription.amount ?? '',
        amountDiscount: subscription.discount ?? 0,
        packageId: subscription.packageId || ''
      }
    });
    setRenewalStep(2);
    clearPreview();
  };

  const handleActivationPreview = async () => {
    setBusy(true);
    setResult(null);
    try {
      const response = await previewActivation(buildActivationPayload(activation, options));
      setPreview(response);
    } catch (error) {
      enqueueSnackbar(extractError(error, 'No se pudo generar el preview.'), { variant: 'error' });
    } finally {
      setBusy(false);
    }
  };

  const handleActivationExecute = async () => {
    setBusy(true);
    try {
      const response = await executeActivation(buildActivationPayload(activation, options, true));
      setResult(response);
      setPreview(response?.summary || preview);
      enqueueSnackbar('Nueva cuenta creada correctamente.', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(extractError(error, 'No se pudo ejecutar la activación.'), { variant: 'error' });
    } finally {
      setBusy(false);
    }
  };

  const handleRenewalPreview = async () => {
    setBusy(true);
    setResult(null);
    try {
      const response = await previewRenewal(buildRenewalPayload(renewal, options));
      setPreview(response);
    } catch (error) {
      enqueueSnackbar(extractError(error, 'No se pudo generar el preview.'), { variant: 'error' });
    } finally {
      setBusy(false);
    }
  };

  const handleRenewalExecute = async () => {
    setBusy(true);
    try {
      const response = await executeRenewal(buildRenewalPayload(renewal, options, true));
      setResult(response);
      setPreview(response?.summary || preview);
      enqueueSnackbar('Renovación ejecutada correctamente.', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(extractError(error, 'No se pudo ejecutar la renovación.'), { variant: 'error' });
    } finally {
      setBusy(false);
    }
  };

  const canGoActivationNext = () => {
    if (activeStep === 0) return Boolean(activation.customer.customerFullname && (activation.customer.customerMail || activation.customer.customerPhone));
    if (activeStep === 1) return Boolean(activation.line.lineId && activation.line.username && activation.line.password && activation.subscription.packageId);
    return true;
  };

  const resetFlow = () => {
    setActivation(defaultActivation(options));
    setRenewal(defaultRenewal(options));
    setLookup(null);
    setLookupQuery('');
    setActiveStep(0);
    setRenewalStep(0);
    clearPreview();
  };

  return (
    <MainCard
      title="Ventas y Renovaciones"
      secondary={
        <Stack direction="row" spacing={1}>
          {optionsLoading ? <CircularProgress size={22} /> : null}
          <Button startIcon={<RefreshIcon />} onClick={loadOptions} disabled={busy || optionsLoading}>
            Recargar opciones
          </Button>
        </Stack>
      }
    >
      <Stack spacing={3}>
        <Alert severity="info">
          Flujo guiado para activaciones y renovaciones. Los paquetes, bancos, servicios y métodos salen de catálogos/API; el CRUD manual queda como respaldo.
        </Alert>

        <Tabs
          value={tab}
          variant={isMobile ? 'scrollable' : 'standard'}
          scrollButtons={isMobile ? 'auto' : false}
          onChange={(_, value) => {
            setTab(value);
            clearPreview();
          }}
        >
          <Tab label="Nueva cuenta" icon={<AddCircleOutlineIcon />} iconPosition="start" />
          <Tab label="Renovar cliente" icon={<CreditScoreIcon />} iconPosition="start" />
        </Tabs>

        {tab === 0 ? (
          <Stack spacing={2.5}>
            <Stepper
              activeStep={activeStep}
              alternativeLabel={!isMobile}
              orientation={isMobile ? 'vertical' : 'horizontal'}
              sx={stepperSx}
            >
              {activationSteps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {activeStep === 0 ? (
              <Grid container spacing={gridSpacing}>
                <Grid item xs={12} md={8}>
                  <Section title="Datos del cliente" helper="Captura lo mínimo para crear el cliente y validar duplicados antes de continuar.">
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          required
                          label="Nombre completo"
                          sx={fieldSx}
                          value={activation.customer.customerFullname}
                          onChange={(e) => setNestedValue(setActivation, 'customer', 'customerFullname', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth sx={fieldSx}>
                          <InputLabel>Género</InputLabel>
                          <Select
                            label="Género"
                            value={activation.customer.gender}
                            onChange={(e) => setNestedValue(setActivation, 'customer', 'gender', e.target.value)}
                          >
                            <MenuItem value="M">Masculino</MenuItem>
                            <MenuItem value="F">Femenino</MenuItem>
                            <MenuItem value="O">Otro</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          fullWidth
                          type="date"
                          label="Fecha alta"
                          sx={fieldSx}
                          value={activation.customer.openingDate}
                          onChange={(e) => setNestedValue(setActivation, 'customer', 'openingDate', e.target.value)}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Correo"
                          sx={fieldSx}
                          value={activation.customer.customerMail}
                          onChange={(e) => setNestedValue(setActivation, 'customer', 'customerMail', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Teléfono / WhatsApp"
                          sx={fieldSx}
                          value={activation.customer.customerPhone}
                          onChange={(e) => setNestedValue(setActivation, 'customer', 'customerPhone', e.target.value)}
                        />
                      </Grid>
                    </Grid>
                    {duplicateCustomers.length ? (
                      <Alert severity="warning" icon={<WarningAmberIcon />}>
                        Posible cliente existente: {duplicateCustomers.map((item) => `${item.label || item.email} (#${item.id})`).join(', ')}.
                      </Alert>
                    ) : null}
                  </Section>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Section title="Estado inicial" helper="Valores operativos que se enviarán al backend.">
                    <Stack spacing={1.5}>
                      <MiniMetric label="Estado" value={activation.customer.customerStatus} icon={<CheckCircleOutlineIcon fontSize="small" />} />
                      <MiniMetric label="Canal" value="SALES_WORKFLOW" icon={<LanIcon fontSize="small" />} />
                    </Stack>
                  </Section>
                </Grid>
              </Grid>
            ) : null}

            {activeStep === 1 ? (
              <Grid container spacing={gridSpacing}>
                <Grid item xs={12} md={5}>
                  <Section title="Paquete" helper="Selecciona un paquete real; se autocompletan conexiones y nombre.">
                    <Autocomplete
                      options={packages}
                      loading={optionsLoading}
                      value={selectedActivationPackage}
                      onChange={(_, value) => applyActivationPackage(value)}
                      getOptionLabel={(option) => option?.displayName || option?.name || ''}
                      isOptionEqualToValue={(option, value) => String(option?.packageId) === String(value?.packageId)}
                      renderInput={(params) => <TextField {...params} label="Buscar paquete" sx={fieldSx} />}
                    />
                    <Grid container spacing={1.5}>
                      {packages.slice(0, 6).map((pkg) => (
                        <Grid item xs={12} sm={6} key={pkg.packageId}>
                          <PackageCard
                            option={pkg}
                            selected={String(pkg.packageId) === String(activation.subscription.packageId)}
                            onClick={() => applyActivationPackage(pkg)}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Section>
                </Grid>
                <Grid item xs={12} md={7}>
                  <Section title="Línea principal" helper="La línea queda asociada al cliente y a la suscripción en el execute transaccional.">
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} lg={4}>
                        <TextField fullWidth required label="Line ID" sx={fieldSx} value={activation.line.lineId} onChange={(e) => setNestedValue(setActivation, 'line', 'lineId', e.target.value)} />
                      </Grid>
                      <Grid item xs={12} sm={6} lg={4}>
                        <TextField fullWidth required label="Usuario línea" sx={fieldSx} value={activation.line.username} onChange={(e) => setNestedValue(setActivation, 'line', 'username', e.target.value)} />
                      </Grid>
                      <Grid item xs={12} sm={6} lg={4}>
                        <TextField fullWidth required label="Password" sx={fieldSx} value={activation.line.password} onChange={(e) => setNestedValue(setActivation, 'line', 'password', e.target.value)} />
                      </Grid>
                      <Grid item xs={12} sm={6} lg={4}>
                        <TextField fullWidth label="Expira" type="date" sx={fieldSx} value={activation.line.expDate} onChange={(e) => setNestedValue(setActivation, 'line', 'expDate', e.target.value)} InputLabelProps={{ shrink: true }} />
                      </Grid>
                      <Grid item xs={12} sm={6} lg={4}>
                        <TextField
                          fullWidth
                          label="Dispositivos deseados"
                          type="number"
                          sx={fieldSx}
                          value={activation.desiredDeviceCount}
                          onChange={(e) =>
                            setActivation((prev) => ({
                              ...prev,
                              desiredDeviceCount: e.target.value,
                              line: { ...prev.line, maxConnections: e.target.value },
                              linePlus: { ...prev.linePlus, maxConnections: e.target.value }
                            }))
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} lg={4}>
                        <TextField fullWidth label="Paquete" sx={fieldSx} value={activation.line.packageName} disabled />
                      </Grid>
                    </Grid>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={activation.linePlusEnabled}
                          onChange={(e) => setActivation((prev) => ({ ...prev, linePlusEnabled: e.target.checked }))}
                        />
                      }
                      label="Agregar línea Plus"
                    />
                    {activation.linePlusEnabled ? (
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} lg={4}>
                          <TextField fullWidth label="Line Plus ID" sx={fieldSx} value={activation.linePlus.lineId} onChange={(e) => setNestedValue(setActivation, 'linePlus', 'lineId', e.target.value)} />
                        </Grid>
                        <Grid item xs={12} sm={6} lg={4}>
                          <TextField fullWidth label="Usuario plus" sx={fieldSx} value={activation.linePlus.username} onChange={(e) => setNestedValue(setActivation, 'linePlus', 'username', e.target.value)} />
                        </Grid>
                        <Grid item xs={12} sm={6} lg={4}>
                          <TextField fullWidth label="Password plus" sx={fieldSx} value={activation.linePlus.password} onChange={(e) => setNestedValue(setActivation, 'linePlus', 'password', e.target.value)} />
                        </Grid>
                      </Grid>
                    ) : null}
                  </Section>
                </Grid>
              </Grid>
            ) : null}

            {activeStep === 2 ? (
              <Grid container spacing={gridSpacing}>
                <Grid item xs={12} md={7}>
                  <Section title="Pago y suscripción" helper="El monto sigue editable para manejar descuentos, promociones y ajustes comerciales.">
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} lg={4}>
                        <FormControl fullWidth sx={fieldSx}>
                          <InputLabel>Billing</InputLabel>
                          <Select label="Billing" value={activation.subscription.billing} onChange={(e) => setNestedValue(setActivation, 'subscription', 'billing', e.target.value)}>
                            <MenuItem value="MONTHLY">Mensual</MenuItem>
                            <MenuItem value="QUARTERLY">Trimestral</MenuItem>
                            <MenuItem value="BIANNUAL">Semestral</MenuItem>
                            <MenuItem value="ANNUAL">Anual</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6} lg={4}>
                        <TextField
                          fullWidth
                          label="Inicio"
                          type="date"
                          sx={fieldSx}
                          value={activation.subscription.startDate}
                          onChange={(e) => setNestedValue(setActivation, 'subscription', 'startDate', e.target.value)}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} lg={4}>
                        <TextField
                          fullWidth
                          label="Renueva"
                          type="date"
                          sx={fieldSx}
                          value={activation.subscription.renewalDate}
                          onChange={(e) => {
                            setNestedValue(setActivation, 'subscription', 'renewalDate', e.target.value);
                            setNestedValue(setActivation, 'line', 'expDate', e.target.value);
                          }}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} lg={4}>
                        <TextField
                          fullWidth
                          label="Monto"
                          type="number"
                          sx={fieldSx}
                          value={activation.subscription.amount}
                          onChange={(e) => {
                            setNestedValue(setActivation, 'subscription', 'amount', e.target.value);
                            setNestedValue(setActivation, 'invoice', 'amountPaid', e.target.value);
                          }}
                          InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} lg={4}>
                        <TextField
                          fullWidth
                          label="Descuento"
                          type="number"
                          sx={fieldSx}
                          value={activation.subscription.discount}
                          onChange={(e) => {
                            setNestedValue(setActivation, 'subscription', 'discount', e.target.value);
                            setNestedValue(setActivation, 'invoice', 'amountDiscount', e.target.value);
                          }}
                          InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} lg={4}>
                        <Autocomplete
                          options={services}
                          value={services.find((item) => String(item.id) === String(activation.invoice.serviceId)) || null}
                          onChange={(_, value) => setNestedValue(setActivation, 'invoice', 'serviceId', value?.id || '')}
                          getOptionLabel={(option) => option?.label || ''}
                          renderInput={(params) => <TextField {...params} label="Servicio" sx={fieldSx} />}
                        />
                      </Grid>
                      <Grid item xs={12} sm={activationRequiresBank ? 6 : 12}>
                        <FormControl fullWidth sx={fieldSx}>
                          <InputLabel>Método de pago</InputLabel>
                          <Select label="Método de pago" value={activation.invoice.paymentMethod} onChange={(e) => setNestedValue(setActivation, 'invoice', 'paymentMethod', e.target.value)}>
                            {paymentMethods.map((method) => (
                              <MenuItem key={method.code} value={method.code}>
                                {method.label || method.code}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      {activationRequiresBank ? (
                        <Grid item xs={12} sm={6}>
                          <Autocomplete
                            options={banks}
                            value={banks.find((item) => String(item.id) === String(activation.invoice.bankId)) || null}
                            onChange={(_, value) => setNestedValue(setActivation, 'invoice', 'bankId', value?.id || '')}
                            getOptionLabel={(option) => option?.label || ''}
                            renderInput={(params) => <TextField {...params} required label="Banco" sx={fieldSx} />}
                          />
                        </Grid>
                      ) : null}
                      <Grid item xs={12}>
                        <TextField fullWidth multiline minRows={2} label="Notas factura" sx={fieldSx} value={activation.invoice.notes} onChange={(e) => setNestedValue(setActivation, 'invoice', 'notes', e.target.value)} />
                      </Grid>
                    </Grid>
                  </Section>
                </Grid>
                <Grid item xs={12} md={5}>
                  <Section title="Resumen de activación" helper="Revisa antes de generar el preview o ejecutar.">
                    <Grid container spacing={1.5}>
                      <Grid item xs={12} sm={6}>
                        <MiniMetric label="Cliente" value={activation.customer.customerFullname} icon={<PersonSearchIcon fontSize="small" />} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <MiniMetric label="Plan" value={selectedActivationPackage?.name} icon={<Inventory2Icon fontSize="small" />} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <MiniMetric label="Línea" value={activation.line.lineId} icon={<LanIcon fontSize="small" />} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <MiniMetric label="Dispositivos" value={activation.desiredDeviceCount} icon={<DevicesIcon fontSize="small" />} />
                      </Grid>
                    </Grid>
                  </Section>
                </Grid>
              </Grid>
            ) : null}

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="space-between">
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                <Button sx={actionButtonSx} disabled={activeStep === 0 || busy} onClick={() => setActiveStep((step) => step - 1)}>
                  Atrás
                </Button>
                {activeStep < activationSteps.length - 1 ? (
                  <Button
                    sx={actionButtonSx}
                    variant="contained"
                    disabled={!canGoActivationNext() || busy}
                    onClick={() => setActiveStep((step) => step + 1)}
                  >
                    Continuar
                  </Button>
                ) : null}
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                <Button sx={actionButtonSx} variant="outlined" onClick={resetFlow} disabled={busy}>
                  Reiniciar
                </Button>
                {activeStep === activationSteps.length - 1 ? (
                  <>
                    <Button sx={actionButtonSx} variant="outlined" startIcon={<SearchIcon />} onClick={handleActivationPreview} disabled={busy}>
                      Vista previa
                    </Button>
                    <Button sx={actionButtonSx} variant="contained" startIcon={<RocketLaunchIcon />} onClick={handleActivationExecute} disabled={busy}>
                      Confirmar activación
                    </Button>
                  </>
                ) : null}
              </Stack>
            </Stack>
          </Stack>
        ) : (
          <Stack spacing={2.5}>
            <Stepper
              activeStep={renewalStep}
              alternativeLabel={!isMobile}
              orientation={isMobile ? 'vertical' : 'horizontal'}
              sx={stepperSx}
            >
              {renewalSteps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {renewalStep === 0 ? (
              <Section title="Buscar cliente o suscripción" helper="Puedes buscar por nombre, correo, teléfono, lineId o subscriptionId.">
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={1}>
                  <TextField
                    fullWidth
                    label="Buscar"
                    sx={fieldSx}
                    value={lookupQuery}
                    onChange={(e) => setLookupQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleLookup();
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      )
                    }}
                  />
                  <Button sx={actionButtonSx} variant="contained" startIcon={<PersonSearchIcon />} onClick={handleLookup} disabled={busy}>
                    Buscar
                  </Button>
                </Stack>
              </Section>
            ) : null}

            {renewalStep === 1 ? (
              <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                  <Section title="Selecciona la suscripción" helper="La renovación usa el cliente existente; no se crea cliente nuevo.">
                    {lookup?.customers?.length ? (
                      <Alert severity="info">
                        Clientes encontrados: {lookup.customers.map((item) => `${item.customerFullname || item.customerMail} (#${item.customerId})`).join(', ')}
                      </Alert>
                    ) : null}
                    <Grid container spacing={2}>
                      {(lookup?.subscriptions || []).map((subscription) => (
                        <Grid item xs={12} md={6} lg={4} key={subscription.subscriptionId}>
                          <Card
                            variant="outlined"
                            sx={{
                              borderRadius: 2,
                              borderColor: String(renewal.subscriptionId) === String(subscription.subscriptionId) ? 'primary.main' : 'divider'
                            }}
                          >
                            <CardActionArea onClick={() => handleSelectSubscription(subscription)} sx={{ p: 2 }}>
                              <Stack spacing={1}>
                                <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                                  <Typography variant="subtitle1" fontWeight={900}>
                                    {subscription.customerName || 'Cliente'}
                                  </Typography>
                                  <Chip size="small" color={subscription.status === 'ACTIVE' ? 'success' : 'warning'} label={subscription.status || '-'} />
                                </Stack>
                                <Typography variant="body2" color="text.secondary">
                                  Suscripción #{subscription.subscriptionId} · Línea {subscription.lineId || '-'}
                                </Typography>
                                <Grid container spacing={1}>
                                  <Grid item xs={6}>
                                    <MiniMetric label="Plan actual" value={subscription.packageName || subscription.packageId} icon={<Inventory2Icon fontSize="small" />} />
                                  </Grid>
                                  <Grid item xs={6}>
                                    <MiniMetric label="Expira" value={formatDate(subscription.renewalDate)} icon={<AutorenewIcon fontSize="small" />} />
                                  </Grid>
                                  <Grid item xs={6}>
                                    <MiniMetric label="Dispositivos" value={subscription.configuredDevices || 0} icon={<DevicesIcon fontSize="small" />} />
                                  </Grid>
                                  <Grid item xs={6}>
                                    <MiniMetric label="Monto" value={formatMoney(subscription.amount)} icon={<PaidOutlinedIcon fontSize="small" />} />
                                  </Grid>
                                </Grid>
                              </Stack>
                            </CardActionArea>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                    {lookup && !lookup.subscriptions?.length ? <Alert severity="warning">No se encontraron suscripciones para esa búsqueda.</Alert> : null}
                  </Section>
                </Grid>
              </Grid>
            ) : null}

            {renewalStep === 2 ? (
              <Grid container spacing={gridSpacing}>
                <Grid item xs={12} md={5}>
                  <Section title="Suscripción seleccionada" helper="Ajusta paquete, base de renovación y dispositivos.">
                    {selectedSubscription ? (
                      <Alert severity="info">
                        {selectedSubscription.customerName || 'Cliente'} · suscripción #{selectedSubscription.subscriptionId} · fecha actual {formatDate(selectedSubscription.renewalDate)}
                      </Alert>
                    ) : (
                      <Alert severity="warning">Selecciona una suscripción antes de renovar.</Alert>
                    )}
                    <Autocomplete
                      options={packages}
                      value={selectedRenewalPackage}
                      onChange={(_, value) => applyRenewalPackage(value)}
                      getOptionLabel={(option) => option?.displayName || option?.name || ''}
                      isOptionEqualToValue={(option, value) => String(option?.packageId) === String(value?.packageId)}
                      renderInput={(params) => <TextField {...params} label="Plan / paquete" sx={fieldSx} />}
                    />
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Dispositivos deseados"
                          type="number"
                          sx={fieldSx}
                          value={renewal.desiredDeviceCount}
                          onChange={(e) => setRenewal((prev) => ({ ...prev, desiredDeviceCount: e.target.value }))}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth sx={fieldSx}>
                          <InputLabel>Base si venció</InputLabel>
                          <Select label="Base si venció" value={renewal.renewalBaseMode} onChange={(e) => setRenewal((prev) => ({ ...prev, renewalBaseMode: e.target.value }))}>
                            <MenuItem value="">Desde vencimiento actual</MenuItem>
                            <MenuItem value="TODAY">Desde hoy</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth sx={fieldSx}>
                          <InputLabel>Billing</InputLabel>
                          <Select label="Billing" value={renewal.subscription.billing} onChange={(e) => setNestedValue(setRenewal, 'subscription', 'billing', e.target.value)}>
                            <MenuItem value="MONTHLY">Mensual</MenuItem>
                            <MenuItem value="QUARTERLY">Trimestral</MenuItem>
                            <MenuItem value="BIANNUAL">Semestral</MenuItem>
                            <MenuItem value="ANNUAL">Anual</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Fecha manual opcional"
                          type="date"
                          sx={fieldSx}
                          value={renewal.subscription.renewalDate}
                          onChange={(e) => setNestedValue(setRenewal, 'subscription', 'renewalDate', e.target.value)}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                    </Grid>
                  </Section>
                </Grid>
                <Grid item xs={12} md={7}>
                  <Section title="Pago y confirmación" helper="El preview muestra fecha nueva, cambio de plan y licencias faltantes antes de ejecutar.">
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} lg={4}>
                        <TextField
                          fullWidth
                          label="Monto"
                          type="number"
                          sx={fieldSx}
                          value={renewal.subscription.amount}
                          onChange={(e) => {
                            setNestedValue(setRenewal, 'subscription', 'amount', e.target.value);
                            setNestedValue(setRenewal, 'invoice', 'amountPaid', e.target.value);
                          }}
                          InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} lg={4}>
                        <TextField
                          fullWidth
                          label="Descuento"
                          type="number"
                          sx={fieldSx}
                          value={renewal.subscription.discount}
                          onChange={(e) => {
                            setNestedValue(setRenewal, 'subscription', 'discount', e.target.value);
                            setNestedValue(setRenewal, 'invoice', 'amountDiscount', e.target.value);
                          }}
                          InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} lg={4}>
                        <Autocomplete
                          options={services}
                          value={services.find((item) => String(item.id) === String(renewal.invoice.serviceId)) || null}
                          onChange={(_, value) => setNestedValue(setRenewal, 'invoice', 'serviceId', value?.id || '')}
                          getOptionLabel={(option) => option?.label || ''}
                          renderInput={(params) => <TextField {...params} label="Servicio" sx={fieldSx} />}
                        />
                      </Grid>
                      <Grid item xs={12} sm={renewalRequiresBank ? 6 : 12}>
                        <FormControl fullWidth sx={fieldSx}>
                          <InputLabel>Método de pago</InputLabel>
                          <Select label="Método de pago" value={renewal.invoice.paymentMethod} onChange={(e) => setNestedValue(setRenewal, 'invoice', 'paymentMethod', e.target.value)}>
                            {paymentMethods.map((method) => (
                              <MenuItem key={method.code} value={method.code}>
                                {method.label || method.code}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      {renewalRequiresBank ? (
                        <Grid item xs={12} sm={6}>
                          <Autocomplete
                            options={banks}
                            value={banks.find((item) => String(item.id) === String(renewal.invoice.bankId)) || null}
                            onChange={(_, value) => setNestedValue(setRenewal, 'invoice', 'bankId', value?.id || '')}
                            getOptionLabel={(option) => option?.label || ''}
                            renderInput={(params) => <TextField {...params} required label="Banco" sx={fieldSx} />}
                          />
                        </Grid>
                      ) : null}
                      <Grid item xs={12}>
                        <TextField fullWidth multiline minRows={2} label="Notas factura" sx={fieldSx} value={renewal.invoice.notes} onChange={(e) => setNestedValue(setRenewal, 'invoice', 'notes', e.target.value)} />
                      </Grid>
                    </Grid>
                    {Number(renewal.desiredDeviceCount || 0) < Number(renewal.currentDeviceCount || 0) ? (
                      <Alert severity="warning">
                        Estás bajando dispositivos. El sistema no elimina licencias automáticamente; quedará para revisión manual.
                      </Alert>
                    ) : null}
                  </Section>
                </Grid>
              </Grid>
            ) : null}

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="space-between">
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                <Button sx={actionButtonSx} disabled={renewalStep === 0 || busy} onClick={() => setRenewalStep((step) => step - 1)}>
                  Atrás
                </Button>
                {renewalStep < renewalSteps.length - 1 ? (
                  <Button
                    sx={actionButtonSx}
                    variant="contained"
                    disabled={(renewalStep === 1 && !renewal.subscriptionId) || busy}
                    onClick={() => setRenewalStep((step) => step + 1)}
                  >
                    Continuar
                  </Button>
                ) : null}
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                <Button sx={actionButtonSx} variant="outlined" onClick={resetFlow} disabled={busy}>
                  Reiniciar
                </Button>
                {renewalStep === renewalSteps.length - 1 ? (
                  <>
                    <Button sx={actionButtonSx} variant="outlined" startIcon={<SearchIcon />} onClick={handleRenewalPreview} disabled={busy || !renewal.subscriptionId}>
                      Vista previa
                    </Button>
                    <Button sx={actionButtonSx} variant="contained" startIcon={<RocketLaunchIcon />} onClick={handleRenewalExecute} disabled={busy || !renewal.subscriptionId}>
                      Confirmar renovación
                    </Button>
                  </>
                ) : null}
              </Stack>
            </Stack>
          </Stack>
        )}

        <PreviewCard preview={preview} />
        <ResultCard result={result} />
      </Stack>
    </MainCard>
  );
}
