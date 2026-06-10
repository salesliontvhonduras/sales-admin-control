import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  listSalesWorkflowLines,
  lookupSalesWorkflow,
  previewActivation,
  previewRenewal
} from 'api/liontv-sales-workflow';

const MAIN_LINE_CREATE_NEW = 'CREATE_NEW';
const MAIN_LINE_USE_EXISTING = 'USE_EXISTING';
const RENEWAL_BASE_CURRENT_EXPIRATION = 'CURRENT_EXPIRATION';
const RENEWAL_BASE_TODAY = 'TODAY';

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
  p: { xs: 1.25, sm: 1.5 },
  borderRadius: 2.5,
  border: '1px solid',
  borderColor: 'divider',
  height: '100%',
  minWidth: 0,
  overflow: 'hidden'
};

const stepperSx = {
  p: { xs: 1.5, sm: 2 },
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: 2.5,
  bgcolor: 'background.paper',
  overflow: 'visible',
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

const optionChipSx = {
  height: 24,
  fontWeight: 700,
  '& .MuiChip-label': {
    px: 1
  }
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
  mainLineMode: MAIN_LINE_CREATE_NEW,
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
  renewalBaseMode: RENEWAL_BASE_CURRENT_EXPIRATION,
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

function normalizeBankOption(item = {}, fallbackPrefix = 'Banco') {
  const id = item.id ?? item.bankId ?? item.bank_id ?? item.value ?? item.code ?? null;
  return {
    id,
    label: item.bank ?? item.name ?? item.description ?? item.bankName ?? item.label ?? `${fallbackPrefix} ${id ?? ''}`.trim(),
    active: item.active ?? item.enabled ?? item.status !== 'INACTIVE'
  };
}

function normalizeServiceOption(item = {}, fallbackPrefix = 'Servicio') {
  return normalizeCatalogOption(item, fallbackPrefix);
}

function normalizeLineOption(item = {}) {
  const maxConnections = Number(item.max_connections ?? item.maxConnections ?? 0) || 0;
  const activeConnections = Number(item.active_connections ?? item.activeConnections ?? 0) || 0;
  const lineId = item.id ?? item.lineId ?? item.line_id ?? '';
  const packageId = item.package_id ?? item.packageId ?? null;
  const packageName = item.package_name ?? item.packageName ?? '';
  return {
    lineId,
    username: item.username ?? '',
    password: item.password ?? '',
    packageId,
    packageName,
    expDate: item.exp_date ?? item.expDate ?? '',
    enabled: item.enabled !== false,
    expired: Boolean(item.is_expired ?? item.isExpired),
    maxConnections,
    activeConnections,
    availableSlots: Math.max(maxConnections - activeConnections, 0),
    provider: item.provider ?? '',
    lineCountry: item.line_country ?? item.lineCountry ?? '',
    label: [lineId, item.username, packageName].filter(Boolean).join(' · ')
  };
}

function buildLineOptionLabel(option = {}) {
  return option.label || [option.lineId, option.username, option.packageName].filter(Boolean).join(' · ') || '';
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
    mainLineMode: form.mainLineMode || MAIN_LINE_CREATE_NEW,
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
    renewalBaseMode: form.renewalBaseMode || RENEWAL_BASE_CURRENT_EXPIRATION,
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

function Section({ title, helper, icon, color = 'primary', children }) {
  return (
    <Box
      sx={(theme) => ({
        ...sectionSx,
        borderColor: theme.palette[color]?.light || theme.palette.divider,
        background:
          theme.palette.mode === 'light'
            ? `linear-gradient(145deg, ${theme.palette[color]?.light || theme.palette.primary.light}18, ${theme.palette.background.paper} 42%)`
            : theme.palette.surface?.card || theme.palette.background.paper,
        boxShadow: theme.palette.mode === 'light' ? '0 12px 30px rgba(15, 23, 42, 0.06)' : 'none'
      })}
    >
      <Stack spacing={1.5}>
        <Stack direction="row" spacing={1.5} alignItems="flex-start">
          {icon ? (
            <Avatar
              sx={(theme) => ({
                width: 38,
                height: 38,
                bgcolor: `${theme.palette[color]?.main || theme.palette.primary.main}18`,
                color: theme.palette[color]?.main || theme.palette.primary.main,
                flexShrink: 0
              })}
            >
              {icon}
            </Avatar>
          ) : null}
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle1" fontWeight={900} sx={{ lineHeight: 1.25 }}>
              {title}
            </Typography>
            {helper ? (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                {helper}
              </Typography>
            ) : null}
          </Box>
        </Stack>
        {children}
      </Stack>
    </Box>
  );
}

function MiniMetric({ label, value, icon, color = 'primary' }) {
  return (
    <Paper
      variant="outlined"
      sx={(theme) => ({
        ...summaryCardSx,
        borderColor: theme.palette[color]?.light || theme.palette.divider,
        background:
          theme.palette.mode === 'light'
            ? `linear-gradient(145deg, ${theme.palette[color]?.light || theme.palette.primary.light}16, ${theme.palette.background.paper})`
            : theme.palette.surface?.card || theme.palette.background.paper
      })}
    >
      <Stack direction="row" spacing={1.25} alignItems="center">
        <Avatar
          sx={(theme) => ({
            width: 34,
            height: 34,
            bgcolor: `${theme.palette[color]?.main || theme.palette.primary.main}18`,
            color: theme.palette[color]?.main || theme.palette.primary.main,
            flexShrink: 0
          })}
        >
          {icon}
        </Avatar>
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

function PackageCard({ option, selected, onClick, t }) {
  return (
    <Card
      variant="outlined"
      sx={(theme) => ({
        borderRadius: 2,
        borderColor: selected ? 'primary.main' : 'divider',
        boxShadow: selected ? '0 12px 28px rgba(229,9,20,0.16)' : 'none',
        height: '100%',
        background:
          theme.palette.mode === 'light'
            ? selected
              ? `linear-gradient(145deg, ${theme.palette.primary.light}18, ${theme.palette.background.paper})`
              : theme.palette.background.paper
            : theme.palette.surface?.card || theme.palette.background.paper
      })}
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
            {t('salesWorkflow.messages.packageDevices', '{{count}} suggested device(s)', { count: option?.roleCount || 1 })}
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {option?.type ? <Chip size="small" label={option.type} sx={optionChipSx} /> : null}
            {option?.officialDuration ? <Chip size="small" label={`${option.officialDuration} ${option.officialDurationIn || ''}`} sx={optionChipSx} /> : null}
          </Stack>
        </Stack>
      </CardActionArea>
    </Card>
  );
}

function PreviewCard({ preview }) {
  const { t } = useTranslation();
  if (!preview) return null;

  return (
    <Card variant="outlined" sx={{ p: { xs: 1.5, sm: 2 }, borderRadius: 2.5 }}>
      <Stack spacing={1.5}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ sm: 'center' }} justifyContent="space-between">
          <Box>
            <Typography variant="subtitle1" fontWeight={900}>
              {t('salesWorkflow.preview.title', 'Review before confirming')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {preview.customerName || t('salesWorkflow.common.customerFallback', 'Customer')} ·{' '}
              {t('salesWorkflow.preview.subscription', 'Subscription')} {preview.subscriptionId || t('salesWorkflow.preview.newSubscription', 'new')}
            </Typography>
          </Box>
          <Chip
            color="primary"
            label={preview.workflowType === 'RENEWAL' ? t('salesWorkflow.tabs.renewal', 'Renew customer') : t('salesWorkflow.tabs.activation', 'New account')}
            sx={optionChipSx}
          />
        </Stack>
        <Divider />
        <Grid container spacing={1.5}>
          <Grid item xs={12} sm={6} md={3}>
            <MiniMetric label={t('salesWorkflow.metrics.plan', 'Plan')} value={preview.newPackageName || preview.newPackageId} icon={<Inventory2Icon fontSize="small" />} color="primary" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MiniMetric label={t('salesWorkflow.metrics.newDate', 'New date')} value={formatDate(preview.newRenewalDate)} icon={<AutorenewIcon fontSize="small" />} color="info" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MiniMetric
              label={t('salesWorkflow.metrics.devices', 'Devices')}
              value={t('salesWorkflow.preview.devicesValue', '{{desired}} desired · {{newLicenses}} new', {
                desired: preview.desiredDeviceCount ?? 0,
                newLicenses: preview.additionalLicensesToCreate ?? 0
              })}
              icon={<DevicesIcon fontSize="small" />}
              color="secondary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MiniMetric label={t('salesWorkflow.metrics.invoiceAmount', 'Invoice amount')} value={formatMoney(preview.invoiceAmount ?? preview.amount)} icon={<PaidOutlinedIcon fontSize="small" />} color="success" />
          </Grid>
        </Grid>
        {preview.currentPackageName && preview.currentPackageName !== preview.newPackageName ? (
          <Alert severity="info">
            {t('salesWorkflow.messages.changedPlan', 'Plan change')}: {preview.currentPackageName} → {preview.newPackageName}
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
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  if (!result) return null;

  const copyMessage = async () => {
    const summary = result.summary || {};
    const message = t('salesWorkflow.messages.whatsappMessage', {
      customer: summary.customerName || '',
      workflow: result.workflowType === 'RENEWAL' ? t('salesWorkflow.workflowTypes.renewal', 'renewal') : t('salesWorkflow.workflowTypes.activation', 'activation'),
      date: formatDate(summary.newRenewalDate)
    });
    await navigator.clipboard?.writeText(message);
    enqueueSnackbar(t('salesWorkflow.messages.copiedWhatsapp', 'WhatsApp message copied.'), { variant: 'success' });
  };

  return (
    <Card
      variant="outlined"
      sx={(theme) => ({
        p: { xs: 1.5, sm: 2 },
        borderRadius: 2.5,
        borderColor: 'success.light',
        background:
          theme.palette.mode === 'light'
            ? `linear-gradient(145deg, ${theme.palette.success.light}1f, ${theme.palette.background.paper})`
            : theme.palette.surface?.card || theme.palette.background.paper
      })}
    >
      <Stack spacing={1.5}>
        <Stack direction="row" spacing={1} alignItems="center">
          <CheckCircleOutlineIcon color="success" />
          <Typography variant="subtitle1" fontWeight={900}>
            {t('salesWorkflow.result.title', 'Workflow executed')}
          </Typography>
        </Stack>
        <Grid container spacing={1.5}>
          {[
            [t('salesWorkflow.result.customer', 'Customer'), result.customerId],
            [t('salesWorkflow.result.line', 'Line'), result.lineId],
            [t('salesWorkflow.result.subscription', 'Subscription'), result.subscriptionId],
            [t('salesWorkflow.result.invoice', 'Invoice'), result.invoiceId],
            [t('salesWorkflow.result.newLicenses', 'New licenses'), result.createdLicenseIds?.length || 0]
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
          <Button size="small" sx={actionButtonSx} onClick={() => navigate('/liontv/customers')}>
            {t('salesWorkflow.buttons.openCustomer', 'Open customer')}
          </Button>
          <Button size="small" sx={actionButtonSx} onClick={() => navigate('/liontv/subscriptions')}>
            {t('salesWorkflow.buttons.openSubscription', 'Open subscription')}
          </Button>
          <Button size="small" sx={actionButtonSx} onClick={() => navigate('/liontv/invoices')}>
            {t('salesWorkflow.buttons.openInvoice', 'Open invoice')}
          </Button>
          <Button size="small" sx={actionButtonSx} onClick={() => navigate('/liontv/licenses')}>
            {t('salesWorkflow.buttons.openLicenses', 'Open licenses')}
          </Button>
          <Button size="small" sx={actionButtonSx} startIcon={<ContentCopyIcon />} onClick={copyMessage}>
            {t('salesWorkflow.buttons.copyWhatsapp', 'Copy WhatsApp')}
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}

export default function SalesWorkflowLionTv() {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [tab, setTab] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [renewalStep, setRenewalStep] = useState(0);
  const [options, setOptions] = useState(defaultOptions);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [lineOptions, setLineOptions] = useState([]);
  const [linesLoading, setLinesLoading] = useState(false);
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
  const selectedExistingLine = useMemo(
    () => lineOptions.find((item) => String(item.lineId) === String(activation.line.lineId)) || null,
    [activation.line.lineId, lineOptions]
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
  const activationSteps = useMemo(
    () => [
      t('salesWorkflow.steps.activation.customer', 'Customer'),
      t('salesWorkflow.steps.activation.linePlan', 'Line & plan'),
      t('salesWorkflow.steps.activation.paymentConfirm', 'Payment & confirmation')
    ],
    [t]
  );
  const renewalSteps = useMemo(
    () => [
      t('salesWorkflow.steps.renewal.search', 'Search'),
      t('salesWorkflow.steps.renewal.selectPlan', 'Select plan'),
      t('salesWorkflow.steps.renewal.paymentConfirm', 'Payment & confirmation')
    ],
    [t]
  );
  const paymentMethodLabel = useCallback(
    (method) => t(`salesWorkflow.paymentMethods.${method.code}`, method.label || method.code),
    [t]
  );

  const loadLineOptions = useCallback(async () => {
    setLinesLoading(true);
    try {
      const payload = await listSalesWorkflowLines();
      const normalized = unwrapArray(payload).map(normalizeLineOption);
      setLineOptions(normalized);
    } catch (error) {
      enqueueSnackbar(extractError(error, t('salesWorkflow.messages.linesLoadError', 'Could not load lines.')), { variant: 'error' });
    } finally {
      setLinesLoading(false);
    }
  }, [enqueueSnackbar, t]);

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
          ? unwrapArray(bankResult.value).map((item) => normalizeBankOption(item, t('salesWorkflow.fallbacks.bank', 'Bank')))
          : workflowOptions.banks || [];
      const loadedServices =
        serviceResult.status === 'fulfilled'
          ? unwrapArray(serviceResult.value).map((item) => normalizeServiceOption(item, t('salesWorkflow.fallbacks.service', 'Service')))
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
      enqueueSnackbar(extractError(error, t('salesWorkflow.messages.optionsLoadError', 'Could not load workflow options.')), { variant: 'error' });
    } finally {
      setOptionsLoading(false);
    }
  }, [enqueueSnackbar, t]);

  useEffect(() => {
    loadOptions();
  }, [loadOptions]);

  useEffect(() => {
    if (tab === 0 && activeStep === 1 && activation.mainLineMode === MAIN_LINE_USE_EXISTING && !lineOptions.length && !linesLoading) {
      loadLineOptions();
    }
  }, [activation.mainLineMode, activeStep, lineOptions.length, linesLoading, loadLineOptions, tab]);

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

  const handleMainLineModeChange = (mode) => {
    setActivation((prev) => ({
      ...prev,
      mainLineMode: mode,
      line:
        mode === MAIN_LINE_CREATE_NEW
          ? { ...defaultActivation(options).line, packageId: prev.line.packageId, packageName: prev.line.packageName, maxConnections: prev.desiredDeviceCount || 1 }
          : {
              ...prev.line,
              lineId: '',
              username: '',
              password: '',
              expDate: prev.line.expDate,
              maxConnections: prev.line.maxConnections || prev.desiredDeviceCount || 1
            }
    }));
    clearPreview();
    if (mode === MAIN_LINE_USE_EXISTING && !lineOptions.length) {
      loadLineOptions();
    }
  };

  const handleExistingLineSelect = (line) => {
    setActivation((prev) => {
      const nextPackageId = prev.subscription.packageId || line?.packageId || '';
      return {
        ...prev,
        line: {
          ...prev.line,
          lineId: line?.lineId || '',
          username: line?.username || '',
          password: line?.password || '',
          packageId: line?.packageId || prev.line.packageId || '',
          packageName: line?.packageName || prev.line.packageName || '',
          expDate: line?.expDate ? String(line.expDate).slice(0, 10) : prev.line.expDate,
          enabled: line?.enabled ?? prev.line.enabled,
          maxConnections: line?.maxConnections || prev.line.maxConnections || prev.desiredDeviceCount || 1,
          provider: line?.provider || prev.line.provider,
          lineCountry: line?.lineCountry || prev.line.lineCountry
        },
        subscription: {
          ...prev.subscription,
          packageId: nextPackageId
        },
        invoice: {
          ...prev.invoice,
          packageId: nextPackageId
        }
      };
    });
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
      enqueueSnackbar(extractError(error, t('salesWorkflow.messages.lookupError', 'Could not search customer.')), { variant: 'error' });
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
      enqueueSnackbar(extractError(error, t('salesWorkflow.messages.previewError', 'Could not generate preview.')), { variant: 'error' });
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
      enqueueSnackbar(t('salesWorkflow.messages.created', 'New account created successfully.'), { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(extractError(error, t('salesWorkflow.messages.activationError', 'Could not execute activation.')), { variant: 'error' });
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
      enqueueSnackbar(extractError(error, t('salesWorkflow.messages.previewError', 'Could not generate preview.')), { variant: 'error' });
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
      enqueueSnackbar(t('salesWorkflow.messages.renewed', 'Renewal executed successfully.'), { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(extractError(error, t('salesWorkflow.messages.renewalError', 'Could not execute renewal.')), { variant: 'error' });
    } finally {
      setBusy(false);
    }
  };

  const canGoActivationNext = () => {
    if (activeStep === 0) return Boolean(activation.customer.customerFullname && (activation.customer.customerMail || activation.customer.customerPhone));
    if (activeStep === 1) {
      if (activation.mainLineMode === MAIN_LINE_USE_EXISTING) {
        return Boolean(activation.line.lineId && activation.subscription.packageId);
      }
      return Boolean(activation.line.lineId && activation.line.username && activation.line.password && activation.subscription.packageId);
    }
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
      title={t('salesWorkflow.title', 'Sales & Renewals')}
      secondary={
        <Stack direction="row" spacing={1}>
          {optionsLoading ? <CircularProgress size={22} /> : null}
          <Button startIcon={<RefreshIcon />} onClick={loadOptions} disabled={busy || optionsLoading}>
            {t('salesWorkflow.buttons.reloadOptions', 'Reload options')}
          </Button>
        </Stack>
      }
    >
      <Stack spacing={3}>
        <Alert severity="info">
          {t(
            'salesWorkflow.messages.flowInfo',
            'Guided flow for activations and renewals. Packages, banks, services and payment methods come from catalogs/API; manual CRUD remains as backup.'
          )}
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
          <Tab label={t('salesWorkflow.tabs.activation', 'New account')} icon={<AddCircleOutlineIcon />} iconPosition="start" />
          <Tab label={t('salesWorkflow.tabs.renewal', 'Renew customer')} icon={<CreditScoreIcon />} iconPosition="start" />
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
                  <Section
                    title={t('salesWorkflow.sections.customerTitle', 'Customer details')}
                    helper={t('salesWorkflow.sections.customerHelper', 'Capture the minimum details to create the customer and validate duplicates before continuing.')}
                    icon={<PersonSearchIcon fontSize="small" />}
                    color="primary"
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          required
	                          label={t('salesWorkflow.fields.fullName', 'Full name')}
                          sx={fieldSx}
                          value={activation.customer.customerFullname}
                          onChange={(e) => setNestedValue(setActivation, 'customer', 'customerFullname', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth sx={fieldSx}>
                          <InputLabel>{t('salesWorkflow.fields.gender', 'Gender')}</InputLabel>
                          <Select
                            label={t('salesWorkflow.fields.gender', 'Gender')}
                            value={activation.customer.gender}
                            onChange={(e) => setNestedValue(setActivation, 'customer', 'gender', e.target.value)}
                          >
                            <MenuItem value="M">{t('salesWorkflow.options.male', 'Male')}</MenuItem>
                            <MenuItem value="F">{t('salesWorkflow.options.female', 'Female')}</MenuItem>
                            <MenuItem value="O">{t('salesWorkflow.options.other', 'Other')}</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          fullWidth
                          type="date"
                          label={t('salesWorkflow.fields.openingDate', 'Opening date')}
                          sx={fieldSx}
                          value={activation.customer.openingDate}
                          onChange={(e) => setNestedValue(setActivation, 'customer', 'openingDate', e.target.value)}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label={t('salesWorkflow.fields.email', 'Email')}
                          sx={fieldSx}
                          value={activation.customer.customerMail}
                          onChange={(e) => setNestedValue(setActivation, 'customer', 'customerMail', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label={t('salesWorkflow.fields.phone', 'Phone / WhatsApp')}
                          sx={fieldSx}
                          value={activation.customer.customerPhone}
                          onChange={(e) => setNestedValue(setActivation, 'customer', 'customerPhone', e.target.value)}
                        />
                      </Grid>
                    </Grid>
                    {duplicateCustomers.length ? (
                      <Alert severity="warning" icon={<WarningAmberIcon />}>
                        {t('salesWorkflow.messages.possibleExistingCustomer', 'Possible existing customer')}: {duplicateCustomers.map((item) => `${item.label || item.email} (#${item.id})`).join(', ')}.
                      </Alert>
                    ) : null}
                  </Section>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Section
                    title={t('salesWorkflow.sections.initialStatusTitle', 'Initial status')}
                    helper={t('salesWorkflow.sections.initialStatusHelper', 'Operational values that will be sent to the backend.')}
                    icon={<CheckCircleOutlineIcon fontSize="small" />}
                    color="success"
                  >
                    <Stack spacing={1.5}>
                      <MiniMetric label={t('salesWorkflow.metrics.status', 'Status')} value={activation.customer.customerStatus} icon={<CheckCircleOutlineIcon fontSize="small" />} color="success" />
                      <MiniMetric label={t('salesWorkflow.metrics.channel', 'Channel')} value="SALES_WORKFLOW" icon={<LanIcon fontSize="small" />} color="info" />
                    </Stack>
                  </Section>
                </Grid>
              </Grid>
            ) : null}

            {activeStep === 1 ? (
              <Grid container spacing={gridSpacing}>
                <Grid item xs={12} md={5}>
                  <Section
                    title={t('salesWorkflow.sections.packageTitle', 'Package')}
                    helper={t('salesWorkflow.sections.packageHelper', 'Select a real package; connections and name are filled automatically.')}
                    icon={<Inventory2Icon fontSize="small" />}
                    color="secondary"
                  >
                    <Autocomplete
                      options={packages}
                      loading={optionsLoading}
                      value={selectedActivationPackage}
                      onChange={(_, value) => applyActivationPackage(value)}
                      getOptionLabel={(option) => option?.displayName || option?.name || ''}
                      isOptionEqualToValue={(option, value) => String(option?.packageId) === String(value?.packageId)}
                      renderInput={(params) => <TextField {...params} label={t('salesWorkflow.fields.searchPackage', 'Search package')} sx={fieldSx} />}
                    />
                    <Grid container spacing={1.5}>
                      {packages.slice(0, 6).map((pkg) => (
                        <Grid item xs={12} sm={6} key={pkg.packageId}>
                          <PackageCard
                            option={pkg}
                            selected={String(pkg.packageId) === String(activation.subscription.packageId)}
                            onClick={() => applyActivationPackage(pkg)}
                            t={t}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Section>
                </Grid>
                <Grid item xs={12} md={7}>
                  <Section
                    title={t('salesWorkflow.sections.lineTitle', 'Main line')}
                    helper={t('salesWorkflow.sections.lineHelper', 'The line is associated with the customer and subscription in the transactional execute.')}
                    icon={<LanIcon fontSize="small" />}
                    color="info"
                  >
                    <FormControl fullWidth sx={fieldSx}>
                      <InputLabel>{t('salesWorkflow.fields.mainLineMode', 'Line mode')}</InputLabel>
                      <Select
                        label={t('salesWorkflow.fields.mainLineMode', 'Line mode')}
                        value={activation.mainLineMode}
                        onChange={(e) => handleMainLineModeChange(e.target.value)}
                      >
                        <MenuItem value={MAIN_LINE_CREATE_NEW}>{t('salesWorkflow.options.createNewLine', 'Create new line')}</MenuItem>
                        <MenuItem value={MAIN_LINE_USE_EXISTING}>{t('salesWorkflow.options.useExistingLine', 'Use existing line')}</MenuItem>
                      </Select>
                    </FormControl>
                    {activation.mainLineMode === MAIN_LINE_USE_EXISTING ? (
                      <Stack spacing={1.5}>
                        <Autocomplete
                          fullWidth
                          options={lineOptions}
                          loading={linesLoading}
                          value={selectedExistingLine}
                          onOpen={() => {
                            if (!lineOptions.length) loadLineOptions();
                          }}
                          onChange={(_, value) => handleExistingLineSelect(value)}
                          getOptionLabel={buildLineOptionLabel}
                          isOptionEqualToValue={(option, value) => option.lineId === value?.lineId}
                          renderOption={(props, option) => (
                            <Box component="li" {...props}>
                              <Stack spacing={0.25} sx={{ minWidth: 0 }}>
                                <Typography variant="body2" fontWeight={800} sx={{ overflowWrap: 'anywhere' }}>
                                  {option.lineId} · {option.username || '-'}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {option.packageName || t('salesWorkflow.common.noPackage', 'No package')} ·{' '}
                                  {t('salesWorkflow.metrics.expires', 'Expires')}: {formatDate(option.expDate)} ·{' '}
                                  {t('salesWorkflow.metrics.availableSlots', 'Available slots')}: {option.availableSlots}
                                </Typography>
                              </Stack>
                            </Box>
                          )}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label={t('salesWorkflow.fields.searchExistingLine', 'Search existing line')}
                              placeholder={t('salesWorkflow.fields.searchExistingLinePlaceholder', 'Line ID, username or package')}
                              sx={fieldSx}
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <>
                                    {linesLoading ? <CircularProgress color="inherit" size={18} /> : null}
                                    {params.InputProps.endAdornment}
                                  </>
                                )
                              }}
                            />
                          )}
                        />
                        {selectedExistingLine ? (
                          <Paper
                            variant="outlined"
                            sx={(theme) => ({
                              p: 1.5,
                              borderRadius: 2,
                              borderColor: theme.palette.info.light,
                              background:
                                theme.palette.mode === 'light'
                                  ? `linear-gradient(145deg, ${theme.palette.info.light}1c, ${theme.palette.background.paper})`
                                  : theme.palette.surface?.card || theme.palette.background.paper
                            })}
                          >
                            <Stack spacing={1}>
                              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ sm: 'center' }} justifyContent="space-between">
                                <Typography variant="subtitle2" fontWeight={900}>
                                  {t('salesWorkflow.messages.existingLineSelected', 'Existing line selected')}
                                </Typography>
                                <Chip
                                  size="small"
                                  color={selectedExistingLine.enabled && !selectedExistingLine.expired ? 'success' : 'warning'}
                                  label={
                                    selectedExistingLine.enabled && !selectedExistingLine.expired
                                      ? t('salesWorkflow.status.available', 'Available')
                                      : t('salesWorkflow.status.review', 'Review')
                                  }
                                  sx={optionChipSx}
                                />
                              </Stack>
                              <Grid container spacing={1.5}>
                                <Grid item xs={12} sm={6}>
                                  <MiniMetric label={t('salesWorkflow.fields.lineId', 'Line ID')} value={selectedExistingLine.lineId} icon={<LanIcon fontSize="small" />} color="info" />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                  <MiniMetric label={t('salesWorkflow.metrics.currentPlan', 'Current plan')} value={selectedExistingLine.packageName} icon={<Inventory2Icon fontSize="small" />} color="secondary" />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                  <MiniMetric label={t('salesWorkflow.metrics.expires', 'Expires')} value={formatDate(selectedExistingLine.expDate)} icon={<AutorenewIcon fontSize="small" />} color="warning" />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                  <MiniMetric
                                    label={t('salesWorkflow.metrics.capacity', 'Capacity')}
                                    value={t('salesWorkflow.messages.capacityValue', '{{active}} active / {{max}} max · {{available}} free', {
                                      active: selectedExistingLine.activeConnections,
                                      max: selectedExistingLine.maxConnections,
                                      available: selectedExistingLine.availableSlots
                                    })}
                                    icon={<DevicesIcon fontSize="small" />}
                                    color="success"
                                  />
                                </Grid>
                              </Grid>
                              <Alert severity="info">
                                {t(
                                  'salesWorkflow.messages.existingLineNoMutation',
                                  'This line will not be modified. The workflow only creates the customer, subscription, invoice and licenses.'
                                )}
                              </Alert>
                            </Stack>
                          </Paper>
                        ) : (
                          <Alert severity="info">{t('salesWorkflow.messages.selectExistingLine', 'Select one existing line from inventory to continue.')}</Alert>
                        )}
                      </Stack>
                    ) : null}
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} lg={4}>
                        <TextField fullWidth required label={t('salesWorkflow.fields.lineId', 'Line ID')} sx={fieldSx} value={activation.line.lineId} disabled={activation.mainLineMode === MAIN_LINE_USE_EXISTING} onChange={(e) => setNestedValue(setActivation, 'line', 'lineId', e.target.value)} />
                      </Grid>
                      <Grid item xs={12} sm={6} lg={4}>
                        <TextField fullWidth required={activation.mainLineMode === MAIN_LINE_CREATE_NEW} label={t('salesWorkflow.fields.lineUsername', 'Line username')} sx={fieldSx} value={activation.line.username} disabled={activation.mainLineMode === MAIN_LINE_USE_EXISTING} onChange={(e) => setNestedValue(setActivation, 'line', 'username', e.target.value)} />
                      </Grid>
                      <Grid item xs={12} sm={6} lg={4}>
                        <TextField fullWidth required={activation.mainLineMode === MAIN_LINE_CREATE_NEW} label={t('salesWorkflow.fields.password', 'Password')} sx={fieldSx} value={activation.line.password} disabled={activation.mainLineMode === MAIN_LINE_USE_EXISTING} onChange={(e) => setNestedValue(setActivation, 'line', 'password', e.target.value)} />
                      </Grid>
                      <Grid item xs={12} sm={6} lg={4}>
                        <TextField fullWidth label={t('salesWorkflow.fields.expires', 'Expires')} type="date" sx={fieldSx} value={activation.line.expDate} disabled={activation.mainLineMode === MAIN_LINE_USE_EXISTING} onChange={(e) => setNestedValue(setActivation, 'line', 'expDate', e.target.value)} InputLabelProps={{ shrink: true }} />
                      </Grid>
                      <Grid item xs={12} sm={6} lg={4}>
                        <TextField
                          fullWidth
	                          label={t('salesWorkflow.fields.desiredDevices', 'Desired devices')}
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
                        <TextField fullWidth label={t('salesWorkflow.fields.package', 'Package')} sx={fieldSx} value={activation.line.packageName} disabled />
                      </Grid>
                    </Grid>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={activation.linePlusEnabled}
                          onChange={(e) => setActivation((prev) => ({ ...prev, linePlusEnabled: e.target.checked }))}
                        />
                      }
                      label={t('salesWorkflow.options.addPlusLine', 'Add Plus line')}
                    />
                    {activation.linePlusEnabled ? (
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} lg={4}>
	                          <TextField fullWidth label={t('salesWorkflow.fields.linePlusId', 'Line Plus ID')} sx={fieldSx} value={activation.linePlus.lineId} onChange={(e) => setNestedValue(setActivation, 'linePlus', 'lineId', e.target.value)} />
                        </Grid>
                        <Grid item xs={12} sm={6} lg={4}>
	                          <TextField fullWidth label={t('salesWorkflow.fields.plusUsername', 'Plus username')} sx={fieldSx} value={activation.linePlus.username} onChange={(e) => setNestedValue(setActivation, 'linePlus', 'username', e.target.value)} />
                        </Grid>
                        <Grid item xs={12} sm={6} lg={4}>
	                          <TextField fullWidth label={t('salesWorkflow.fields.plusPassword', 'Plus password')} sx={fieldSx} value={activation.linePlus.password} onChange={(e) => setNestedValue(setActivation, 'linePlus', 'password', e.target.value)} />
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
                  <Section
                    title={t('salesWorkflow.sections.paymentTitle', 'Payment and subscription')}
                    helper={t('salesWorkflow.sections.paymentHelper', 'The amount remains editable to handle discounts, promotions and commercial adjustments.')}
                    icon={<PaidOutlinedIcon fontSize="small" />}
                    color="success"
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} lg={4}>
                        <FormControl fullWidth sx={fieldSx}>
                          <InputLabel>{t('salesWorkflow.fields.billing', 'Billing')}</InputLabel>
                          <Select label={t('salesWorkflow.fields.billing', 'Billing')} value={activation.subscription.billing} onChange={(e) => setNestedValue(setActivation, 'subscription', 'billing', e.target.value)}>
                            <MenuItem value="MONTHLY">{t('salesWorkflow.options.monthly', 'Monthly')}</MenuItem>
                            <MenuItem value="QUARTERLY">{t('salesWorkflow.options.quarterly', 'Quarterly')}</MenuItem>
                            <MenuItem value="BIANNUAL">{t('salesWorkflow.options.biannual', 'Biannual')}</MenuItem>
                            <MenuItem value="ANNUAL">{t('salesWorkflow.options.annual', 'Annual')}</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6} lg={4}>
                        <TextField
                          fullWidth
	                          label={t('salesWorkflow.fields.start', 'Start')}
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
	                          label={t('salesWorkflow.fields.renewalDate', 'Renews')}
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
	                          label={t('salesWorkflow.fields.amount', 'Amount')}
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
	                          label={t('salesWorkflow.fields.discount', 'Discount')}
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
	                          renderInput={(params) => <TextField {...params} label={t('salesWorkflow.fields.service', 'Service')} sx={fieldSx} />}
                        />
                      </Grid>
                      <Grid item xs={12} sm={activationRequiresBank ? 6 : 12}>
                        <FormControl fullWidth sx={fieldSx}>
	                          <InputLabel>{t('salesWorkflow.fields.paymentMethod', 'Payment method')}</InputLabel>
	                          <Select label={t('salesWorkflow.fields.paymentMethod', 'Payment method')} value={activation.invoice.paymentMethod} onChange={(e) => setNestedValue(setActivation, 'invoice', 'paymentMethod', e.target.value)}>
	                            {paymentMethods.map((method) => (
	                              <MenuItem key={method.code} value={method.code}>
	                                {paymentMethodLabel(method)}
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
	                            renderInput={(params) => <TextField {...params} required label={t('salesWorkflow.fields.bank', 'Bank')} sx={fieldSx} />}
                          />
                        </Grid>
                      ) : null}
                      <Grid item xs={12}>
	                        <TextField fullWidth multiline minRows={2} label={t('salesWorkflow.fields.notes', 'Invoice notes')} sx={fieldSx} value={activation.invoice.notes} onChange={(e) => setNestedValue(setActivation, 'invoice', 'notes', e.target.value)} />
                      </Grid>
                    </Grid>
                  </Section>
                </Grid>
                <Grid item xs={12} md={5}>
	                  <Section
	                    title={t('salesWorkflow.sections.activationSummaryTitle', 'Activation summary')}
	                    helper={t('salesWorkflow.sections.activationSummaryHelper', 'Review before generating the preview or executing.')}
	                    icon={<RocketLaunchIcon fontSize="small" />}
	                    color="primary"
	                  >
                    <Grid container spacing={1.5}>
                      <Grid item xs={12} sm={6}>
	                        <MiniMetric label={t('salesWorkflow.metrics.client', 'Customer')} value={activation.customer.customerFullname} icon={<PersonSearchIcon fontSize="small" />} color="primary" />
                      </Grid>
                      <Grid item xs={12} sm={6}>
	                        <MiniMetric label={t('salesWorkflow.metrics.plan', 'Plan')} value={selectedActivationPackage?.name} icon={<Inventory2Icon fontSize="small" />} color="secondary" />
                      </Grid>
                      <Grid item xs={12} sm={6}>
	                        <MiniMetric label={t('salesWorkflow.metrics.line', 'Line')} value={activation.line.lineId} icon={<LanIcon fontSize="small" />} color="info" />
                      </Grid>
                      <Grid item xs={12} sm={6}>
	                        <MiniMetric label={t('salesWorkflow.metrics.devices', 'Devices')} value={activation.desiredDeviceCount} icon={<DevicesIcon fontSize="small" />} color="success" />
                      </Grid>
                    </Grid>
                    {activation.mainLineMode === MAIN_LINE_USE_EXISTING ? (
                      <Alert severity="info">
                        <Stack spacing={0.5}>
                          <Typography variant="body2" fontWeight={800}>
                            {t('salesWorkflow.messages.existingLineSelected', 'Existing line selected')}: {activation.line.lineId || '-'}
                          </Typography>
                          <Typography variant="body2">
                            {t('salesWorkflow.messages.existingLineNoMutation', 'This line will not be modified. The workflow only creates the customer, subscription, invoice and licenses.')}
                          </Typography>
                        </Stack>
                      </Alert>
                    ) : null}
                  </Section>
                </Grid>
              </Grid>
            ) : null}

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="space-between">
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                <Button sx={actionButtonSx} disabled={activeStep === 0 || busy} onClick={() => setActiveStep((step) => step - 1)}>
                  {t('salesWorkflow.buttons.back', 'Back')}
                </Button>
                {activeStep < activationSteps.length - 1 ? (
                  <Button
                    sx={actionButtonSx}
                    variant="contained"
                    disabled={!canGoActivationNext() || busy}
                    onClick={() => setActiveStep((step) => step + 1)}
                  >
                    {t('salesWorkflow.buttons.continue', 'Continue')}
                  </Button>
                ) : null}
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                <Button sx={actionButtonSx} variant="outlined" onClick={resetFlow} disabled={busy}>
                  {t('salesWorkflow.buttons.reset', 'Reset')}
                </Button>
                {activeStep === activationSteps.length - 1 ? (
                  <>
                    <Button sx={actionButtonSx} variant="outlined" startIcon={<SearchIcon />} onClick={handleActivationPreview} disabled={busy}>
                      {t('salesWorkflow.buttons.preview', 'Preview')}
                    </Button>
                    <Button sx={actionButtonSx} variant="contained" startIcon={<RocketLaunchIcon />} onClick={handleActivationExecute} disabled={busy}>
                      {t('salesWorkflow.buttons.confirmActivation', 'Confirm activation')}
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
              <Section
                title={t('salesWorkflow.sections.searchTitle', 'Search customer or subscription')}
                helper={t('salesWorkflow.sections.searchHelper', 'Search by name, email, phone, lineId or subscriptionId.')}
                icon={<SearchIcon fontSize="small" />}
                color="primary"
              >
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={1}>
                  <TextField
                    fullWidth
                    label={t('salesWorkflow.fields.search', 'Search')}
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
                    {t('salesWorkflow.buttons.search', 'Search')}
                  </Button>
                </Stack>
              </Section>
            ) : null}

            {renewalStep === 1 ? (
              <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                  <Section
                    title={t('salesWorkflow.sections.selectSubscriptionTitle', 'Select subscription')}
                    helper={t('salesWorkflow.sections.selectSubscriptionHelper', 'The renewal uses the existing customer; it does not create a new customer.')}
                    icon={<CreditScoreIcon fontSize="small" />}
                    color="secondary"
                  >
                    {lookup?.customers?.length ? (
                      <Alert severity="info">
                        {t('salesWorkflow.messages.customersFound', 'Customers found')}: {lookup.customers.map((item) => `${item.customerFullname || item.customerMail} (#${item.customerId})`).join(', ')}
                      </Alert>
                    ) : null}
                    <Grid container spacing={2}>
                      {(lookup?.subscriptions || []).map((subscription) => (
                        <Grid item xs={12} md={6} lg={4} key={subscription.subscriptionId}>
                          <Card
                            variant="outlined"
                            sx={{
                              borderRadius: 2,
	                              borderColor: String(renewal.subscriptionId) === String(subscription.subscriptionId) ? 'primary.main' : 'divider',
	                              boxShadow: String(renewal.subscriptionId) === String(subscription.subscriptionId) ? '0 12px 28px rgba(229,9,20,0.16)' : 'none'
	                            }}
	                          >
                            <CardActionArea onClick={() => handleSelectSubscription(subscription)} sx={{ p: 2 }}>
                              <Stack spacing={1}>
                                <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                                  <Typography variant="subtitle1" fontWeight={900}>
	                                    {subscription.customerName || t('salesWorkflow.common.customerFallback', 'Customer')}
	                                  </Typography>
	                                  <Chip size="small" color={subscription.status === 'ACTIVE' ? 'success' : 'warning'} label={subscription.status || '-'} sx={optionChipSx} />
	                                </Stack>
	                                <Typography variant="body2" color="text.secondary">
	                                  {t('salesWorkflow.preview.subscription', 'Subscription')} #{subscription.subscriptionId} · {t('salesWorkflow.metrics.line', 'Line')} {subscription.lineId || '-'}
	                                </Typography>
	                                <Grid container spacing={1}>
	                                  <Grid item xs={6}>
	                                    <MiniMetric label={t('salesWorkflow.metrics.currentPlan', 'Current plan')} value={subscription.packageName || subscription.packageId} icon={<Inventory2Icon fontSize="small" />} color="primary" />
	                                  </Grid>
	                                  <Grid item xs={6}>
	                                    <MiniMetric label={t('salesWorkflow.metrics.expires', 'Expires')} value={formatDate(subscription.renewalDate)} icon={<AutorenewIcon fontSize="small" />} color="info" />
	                                  </Grid>
	                                  <Grid item xs={6}>
	                                    <MiniMetric label={t('salesWorkflow.metrics.devices', 'Devices')} value={subscription.configuredDevices || 0} icon={<DevicesIcon fontSize="small" />} color="secondary" />
	                                  </Grid>
	                                  <Grid item xs={6}>
	                                    <MiniMetric label={t('salesWorkflow.metrics.amount', 'Amount')} value={formatMoney(subscription.amount)} icon={<PaidOutlinedIcon fontSize="small" />} color="success" />
	                                  </Grid>
                                </Grid>
                              </Stack>
                            </CardActionArea>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                    {lookup && !lookup.subscriptions?.length ? <Alert severity="warning">{t('salesWorkflow.messages.noSubscriptions', 'No subscriptions were found for this search.')}</Alert> : null}
                  </Section>
                </Grid>
              </Grid>
            ) : null}

            {renewalStep === 2 ? (
              <Grid container spacing={gridSpacing}>
                <Grid item xs={12} md={5}>
                  <Section
                    title={t('salesWorkflow.sections.selectedSubscriptionTitle', 'Selected subscription')}
                    helper={t('salesWorkflow.sections.selectedSubscriptionHelper', 'Adjust package, renewal base and devices.')}
                    icon={<AutorenewIcon fontSize="small" />}
                    color="info"
                  >
                    {selectedSubscription ? (
                      <Alert severity="info">
                        {t('salesWorkflow.messages.selectedRenewal', '{{customer}} · subscription #{{subscriptionId}} · current date {{date}}', {
                          customer: selectedSubscription.customerName || t('salesWorkflow.common.customerFallback', 'Customer'),
                          subscriptionId: selectedSubscription.subscriptionId,
                          date: formatDate(selectedSubscription.renewalDate)
                        })}
                      </Alert>
                    ) : (
                      <Alert severity="warning">{t('salesWorkflow.messages.noSubscriptionSelected', 'Select a subscription before renewing.')}</Alert>
                    )}
                    <Autocomplete
                      options={packages}
                      value={selectedRenewalPackage}
                      onChange={(_, value) => applyRenewalPackage(value)}
                      getOptionLabel={(option) => option?.displayName || option?.name || ''}
                      isOptionEqualToValue={(option, value) => String(option?.packageId) === String(value?.packageId)}
                      renderInput={(params) => <TextField {...params} label={t('salesWorkflow.fields.planPackage', 'Plan / package')} sx={fieldSx} />}
                    />
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
	                          label={t('salesWorkflow.fields.desiredDevices', 'Desired devices')}
                          type="number"
                          sx={fieldSx}
                          value={renewal.desiredDeviceCount}
                          onChange={(e) => setRenewal((prev) => ({ ...prev, desiredDeviceCount: e.target.value }))}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth sx={fieldSx}>
                          <InputLabel>{t('salesWorkflow.fields.renewalBase', 'Base if expired')}</InputLabel>
                          <Select label={t('salesWorkflow.fields.renewalBase', 'Base if expired')} value={renewal.renewalBaseMode} onChange={(e) => setRenewal((prev) => ({ ...prev, renewalBaseMode: e.target.value }))}>
                            <MenuItem value={RENEWAL_BASE_CURRENT_EXPIRATION}>{t('salesWorkflow.options.currentExpiration', 'From current expiration')}</MenuItem>
                            <MenuItem value={RENEWAL_BASE_TODAY}>{t('salesWorkflow.options.today', 'From today')}</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth sx={fieldSx}>
                          <InputLabel>{t('salesWorkflow.fields.billing', 'Billing')}</InputLabel>
                          <Select label={t('salesWorkflow.fields.billing', 'Billing')} value={renewal.subscription.billing} onChange={(e) => setNestedValue(setRenewal, 'subscription', 'billing', e.target.value)}>
                            <MenuItem value="MONTHLY">{t('salesWorkflow.options.monthly', 'Monthly')}</MenuItem>
                            <MenuItem value="QUARTERLY">{t('salesWorkflow.options.quarterly', 'Quarterly')}</MenuItem>
                            <MenuItem value="BIANNUAL">{t('salesWorkflow.options.biannual', 'Biannual')}</MenuItem>
                            <MenuItem value="ANNUAL">{t('salesWorkflow.options.annual', 'Annual')}</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label={t('salesWorkflow.fields.manualRenewalDate', 'Optional manual date')}
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
                  <Section
                    title={t('salesWorkflow.sections.renewalPaymentTitle', 'Payment and confirmation')}
                    helper={t('salesWorkflow.sections.renewalPaymentHelper', 'Preview shows the new date, plan change and missing licenses before executing.')}
                    icon={<PaidOutlinedIcon fontSize="small" />}
                    color="success"
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} lg={4}>
                        <TextField
                          fullWidth
                          label={t('salesWorkflow.fields.amount', 'Amount')}
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
                          label={t('salesWorkflow.fields.discount', 'Discount')}
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
	                          renderInput={(params) => <TextField {...params} label={t('salesWorkflow.fields.service', 'Service')} sx={fieldSx} />}
                        />
                      </Grid>
                      <Grid item xs={12} sm={renewalRequiresBank ? 6 : 12}>
                        <FormControl fullWidth sx={fieldSx}>
                          <InputLabel>{t('salesWorkflow.fields.paymentMethod', 'Payment method')}</InputLabel>
                          <Select label={t('salesWorkflow.fields.paymentMethod', 'Payment method')} value={renewal.invoice.paymentMethod} onChange={(e) => setNestedValue(setRenewal, 'invoice', 'paymentMethod', e.target.value)}>
                            {paymentMethods.map((method) => (
                              <MenuItem key={method.code} value={method.code}>
                                {paymentMethodLabel(method)}
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
                            renderInput={(params) => <TextField {...params} required label={t('salesWorkflow.fields.bank', 'Bank')} sx={fieldSx} />}
                          />
                        </Grid>
                      ) : null}
                      <Grid item xs={12}>
                        <TextField fullWidth multiline minRows={2} label={t('salesWorkflow.fields.notes', 'Invoice notes')} sx={fieldSx} value={renewal.invoice.notes} onChange={(e) => setNestedValue(setRenewal, 'invoice', 'notes', e.target.value)} />
                      </Grid>
                    </Grid>
                    {Number(renewal.desiredDeviceCount || 0) < Number(renewal.currentDeviceCount || 0) ? (
                      <Alert severity="warning">
                        {t('salesWorkflow.messages.decreaseDevicesWarning', 'You are reducing devices. The system does not remove licenses automatically; this will remain for manual review.')}
                      </Alert>
                    ) : null}
                  </Section>
                </Grid>
              </Grid>
            ) : null}

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="space-between">
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                <Button sx={actionButtonSx} disabled={renewalStep === 0 || busy} onClick={() => setRenewalStep((step) => step - 1)}>
                  {t('salesWorkflow.buttons.back', 'Back')}
                </Button>
                {renewalStep < renewalSteps.length - 1 ? (
                  <Button
                    sx={actionButtonSx}
                    variant="contained"
                    disabled={(renewalStep === 1 && !renewal.subscriptionId) || busy}
                    onClick={() => setRenewalStep((step) => step + 1)}
                  >
                    {t('salesWorkflow.buttons.continue', 'Continue')}
                  </Button>
                ) : null}
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                <Button sx={actionButtonSx} variant="outlined" onClick={resetFlow} disabled={busy}>
                  {t('salesWorkflow.buttons.reset', 'Reset')}
                </Button>
                {renewalStep === renewalSteps.length - 1 ? (
                  <>
                    <Button sx={actionButtonSx} variant="outlined" startIcon={<SearchIcon />} onClick={handleRenewalPreview} disabled={busy || !renewal.subscriptionId}>
                      {t('salesWorkflow.buttons.preview', 'Preview')}
                    </Button>
                    <Button sx={actionButtonSx} variant="contained" startIcon={<RocketLaunchIcon />} onClick={handleRenewalExecute} disabled={busy || !renewal.subscriptionId}>
                      {t('salesWorkflow.buttons.confirmRenewal', 'Confirm renewal')}
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
