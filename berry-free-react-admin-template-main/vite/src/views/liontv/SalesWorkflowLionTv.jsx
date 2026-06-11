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
import Grid from '@mui/material/GridLegacy';
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
import { alpha, useTheme } from '@mui/material/styles';

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
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { lionTvApi } from 'utils/api';
import { listBanks, listServices } from 'api/catalog-admin';
import { getLoyaltyConfig, getLoyaltyCustomerBalance } from 'api/liontv-engagement';
import {
  executeActivation,
  executeRenewal,
  getNextSalesWorkflowLineId,
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
    borderRadius: 1.75,
    minHeight: 56,
    alignItems: 'center',
    overflow: 'visible',
    bgcolor: 'background.default',
    transition: 'border-color 160ms ease, box-shadow 160ms ease, background-color 160ms ease',
    '& fieldset': {
      borderColor: 'divider'
    },
    '&:hover fieldset': {
      borderColor: 'primary.light'
    },
    '&.Mui-focused': {
      boxShadow: '0 0 0 3px rgba(80, 150, 255, 0.14)'
    },
    '&.Mui-focused fieldset': {
      borderColor: 'primary.main',
      borderWidth: 1.5
    },
    '&.Mui-disabled': {
      opacity: 0.82
    }
  },
  '& .MuiOutlinedInput-input': {
    py: 1.3,
    minWidth: 0,
    fontWeight: 650
  },
  '& .MuiInputBase-input': {
    minWidth: 0
  },
  '& .MuiInputAdornment-root': {
    mt: '0 !important'
  },
  '& .MuiInputLabel-root': {
    fontWeight: 750,
    fontSize: '0.86rem',
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
  },
  '& .MuiFormHelperText-root': {
    ml: 0,
    fontWeight: 600
  }
};

const sectionSx = {
  p: { xs: 2, sm: 2.5, md: 3 },
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: 3,
  bgcolor: 'background.paper',
  overflow: 'hidden',
  position: 'relative',
  width: '100%',
  height: '100%',
  '& .MuiGrid-item': {
    minWidth: 0
  }
};

const balancedFormGridSx = {
  display: 'grid',
  gridTemplateColumns: {
    xs: '1fr',
    sm: 'repeat(2, minmax(0, 1fr))',
    lg: 'repeat(3, minmax(220px, 1fr))'
  },
  gap: 2,
  alignItems: 'start',
  minWidth: 0,
  '& > *': {
    minWidth: 0
  }
};

const summaryCardSx = {
  p: { xs: 1.35, sm: 1.5 },
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
  height: '100%',
  minHeight: 82,
  minWidth: 0,
  overflow: 'hidden'
};

const stepperSx = {
  p: { xs: 1.25, sm: 1.75 },
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: 3,
  bgcolor: 'background.paper',
  overflow: 'visible',
  boxShadow: '0 14px 42px rgba(2, 8, 23, 0.06)',
  '& .MuiStepLabel-label': {
    mt: { xs: 0, sm: 0.6 },
    fontSize: { xs: '0.78rem', sm: '0.86rem' },
    fontWeight: 800,
    lineHeight: 1.25
  },
  '& .MuiStepIcon-root': {
    fontSize: { xs: 24, sm: 26 }
  },
  '& .MuiStepConnector-line': {
    minHeight: { xs: 28, sm: 'auto' }
  }
};

const actionButtonSx = {
  width: { xs: '100%', sm: 'auto' },
  minHeight: 44,
  borderRadius: 1.75,
  px: 2.25,
  fontWeight: 800,
  whiteSpace: 'nowrap'
};

const actionBarSx = {
  p: { xs: 1.25, sm: 1.5 },
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: 2.5,
  bgcolor: 'background.paper',
  boxShadow: '0 18px 48px rgba(2, 8, 23, 0.08)'
};

const STATIC_PALETTE_FALLBACKS = {
  primary: '#5096ff',
  secondary: '#7c4dff',
  info: '#0288d1',
  success: '#2e7d32',
  warning: '#ed6c02',
  error: '#d32f2f'
};

const isCssVarColor = (value) => typeof value === 'string' && value.trim().startsWith('var(');

const paletteMain = (theme, color = 'primary') => {
  const value = theme.palette[color]?.main || theme.palette.primary.main;
  return isCssVarColor(value) ? STATIC_PALETTE_FALLBACKS[color] || STATIC_PALETTE_FALLBACKS.primary : value;
};

const dividerBorderColor = (theme) =>
  theme.palette.mode === 'light' ? 'rgba(15, 23, 42, 0.16)' : 'rgba(255, 255, 255, 0.22)';

const workflowTabsSx = {
  minHeight: 52,
  borderBottom: '1px solid',
  borderColor: 'divider',
  '& .MuiTab-root': {
    minHeight: 52,
    px: { xs: 1.5, sm: 2.5 },
    fontWeight: 850,
    textTransform: 'none'
  }
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
  customerChannels: [
    { code: 'red social', label: 'Red social', active: true },
    { code: 'google', label: 'Google', active: true },
    { code: 'familiares', label: 'Familiares', active: true },
    { code: 'amigos', label: 'Amigos', active: true }
  ],
  lineProviders: [
    { code: 'LION_TV', label: 'LION_TV', active: true },
    { code: 'TITAN', label: 'TITAN', active: true },
    { code: 'NEXOLAT', label: 'NEXOLAT', active: true },
    { code: 'GOL TV', label: 'GOL TV', active: true },
    { code: 'LION_PLUS+', label: 'LION_PLUS+', active: true },
    { code: 'SPOTIFY', label: 'SPOTIFY', active: true },
    { code: 'NETFLIX', label: 'NETFLIX', active: true },
    { code: 'AMAZON_PRIME', label: 'AMAZON_PRIME', active: true },
    { code: 'YOUTUBE_PREMIUM', label: 'YOUTUBE_PREMIUM', active: true },
    { code: 'DISNEY_PLUS_PREMIUM', label: 'DISNEY_PLUS_PREMIUM', active: true }
  ],
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
    channel: '',
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
    provider: '',
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
    provider: '',
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
  const code = item.code ?? item.value ?? item.key ?? id ?? '';
  return {
    id,
    code,
    label: item.label ?? item.name ?? item.bankName ?? item.serviceName ?? item.description ?? `${fallbackPrefix} ${id ?? ''}`.trim(),
    active: item.active ?? item.enabled ?? item.status !== 'INACTIVE'
  };
}

function normalizeBankOption(item = {}, fallbackPrefix = 'Banco') {
  const id = item.id ?? item.bankId ?? item.bank_id ?? item.value ?? item.code ?? null;
  const code = item.code ?? item.value ?? id ?? '';
  return {
    id,
    code,
    label: item.bank ?? item.name ?? item.description ?? item.bankName ?? item.label ?? `${fallbackPrefix} ${id ?? ''}`.trim(),
    active: item.active ?? item.enabled ?? item.status !== 'INACTIVE'
  };
}

function normalizeServiceOption(item = {}, fallbackPrefix = 'Servicio') {
  return normalizeCatalogOption(item, fallbackPrefix);
}

function normalizeWorkflowOption(item = {}, fallbackPrefix = 'Opción') {
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

function buildInvoice(invoice, packageId, amount, options, overrides = {}) {
  const requiresBank = paymentRequiresBank(options, invoice.paymentMethod);
  return {
    ...invoice,
    ...overrides,
    serviceId: toNumberOrNull(invoice.serviceId) || options.defaults?.serviceId || 1,
    packageId: toNumberOrNull(invoice.packageId) || toNumberOrNull(packageId),
    amountPaid: cleanMoney(invoice.amountPaid) ?? cleanMoney(amount) ?? 0,
    amountDiscount: cleanMoney(invoice.amountDiscount) ?? 0,
    loyaltyPointsUsed: toNumberOrNull(overrides.loyaltyPointsUsed ?? invoice.loyaltyPointsUsed) || 0,
    loyaltyAmountRedeemed: cleanMoney(overrides.loyaltyAmountRedeemed ?? invoice.loyaltyAmountRedeemed) ?? 0,
    bankId: requiresBank ? toNumberOrNull(invoice.bankId) : null
  };
}

function buildActivationPayload(form, options, withIdempotency = false) {
  const subscriptionPackageId = toNumberOrNull(form.subscription.packageId);
  const amount = cleanMoney(form.subscription.amount);
  return {
    ...(withIdempotency ? { idempotencyKey: newIdempotencyKey() } : {}),
    mainLineMode: form.mainLineMode || MAIN_LINE_CREATE_NEW,
    customer: form.customer,
    line: {
      ...form.line,
      packageId: toNumberOrNull(form.line.packageId),
      maxConnections: toNumberOrNull(form.line.maxConnections),
      enabled: true
    },
    linePlus: form.linePlusEnabled
      ? {
          ...form.linePlus,
          packageId: toNumberOrNull(form.linePlus.packageId),
          maxConnections: toNumberOrNull(form.linePlus.maxConnections),
          enabled: true
        }
      : null,
    subscription: {
      ...form.subscription,
      packageId: subscriptionPackageId,
      amount: amount ?? 0,
      discount: cleanMoney(form.subscription.discount) ?? 0,
      automaticPay: Boolean(form.subscription.automaticPay)
    },
    invoice: buildInvoice(form.invoice, subscriptionPackageId, amount, options),
    licenses: makeLicenses(form.desiredDeviceCount, form.subscription.billing)
  };
}

function buildRenewalPayload(form, options, withIdempotency = false, invoiceOverrides = {}) {
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
    invoice: buildInvoice(form.invoice, packageId, amount, options, invoiceOverrides),
    newLicenses: []
  };
}

function Section({ title, helper, icon, color = 'primary', children }) {
  return (
    <Paper
      variant="outlined"
      sx={(theme) => {
        const mainColor = paletteMain(theme, color);
        return {
          ...sectionSx,
          borderColor: alpha(mainColor, theme.palette.mode === 'light' ? 0.22 : 0.35),
          background:
            theme.palette.mode === 'light'
              ? `linear-gradient(180deg, ${alpha(mainColor, 0.055)}, ${theme.palette.background.paper} 118px)`
              : `linear-gradient(180deg, ${alpha(mainColor, 0.12)}, ${theme.palette.background.paper} 130px)`,
          boxShadow: theme.palette.mode === 'light' ? '0 18px 44px rgba(15, 23, 42, 0.07)' : '0 18px 48px rgba(0, 0, 0, 0.22)',
          '&:before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            backgroundColor: mainColor
          }
        };
      }}
    >
      <Stack spacing={2.25}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'flex-start', sm: 'center' }}>
          {icon ? (
            <Avatar
              sx={(theme) => ({
                width: 42,
                height: 42,
                bgcolor: alpha(paletteMain(theme, color), 0.12),
                color: paletteMain(theme, color),
                flexShrink: 0
              })}
            >
              {icon}
            </Avatar>
          ) : null}
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h4" fontWeight={900} sx={{ lineHeight: 1.18, fontSize: { xs: '1rem', sm: '1.08rem' } }}>
              {title}
            </Typography>
            {helper ? (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.35, maxWidth: 820 }}>
                {helper}
              </Typography>
            ) : null}
          </Box>
        </Stack>
        <Divider />
        <Stack spacing={2}>{children}</Stack>
      </Stack>
    </Paper>
  );
}

function MiniMetric({ label, value, icon, color = 'primary' }) {
  return (
    <Paper
      variant="outlined"
      sx={(theme) => {
        const mainColor = paletteMain(theme, color);
        return {
          ...summaryCardSx,
          borderColor: alpha(mainColor, theme.palette.mode === 'light' ? 0.18 : 0.32),
          background:
            theme.palette.mode === 'light'
              ? `linear-gradient(145deg, ${alpha(mainColor, 0.075)}, ${theme.palette.background.paper})`
              : `linear-gradient(145deg, ${alpha(mainColor, 0.12)}, ${theme.palette.background.paper})`
        };
      }}
    >
      <Stack direction="row" spacing={1.25} alignItems="center">
        <Avatar
          sx={(theme) => ({
            width: 36,
            height: 36,
            bgcolor: alpha(paletteMain(theme, color), 0.13),
            color: paletteMain(theme, color),
            flexShrink: 0
          })}
        >
          {icon}
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 750, lineHeight: 1.25 }}>
            {label}
          </Typography>
          <Typography variant="subtitle2" fontWeight={900} sx={{ lineHeight: 1.25, overflowWrap: 'anywhere', mt: 0.35 }}>
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
      sx={(theme) => {
        const primaryMain = paletteMain(theme, 'primary');
        return {
          borderRadius: 2.25,
          borderColor: selected ? primaryMain : dividerBorderColor(theme),
          boxShadow: selected ? `0 18px 34px ${alpha(primaryMain, 0.18)}` : '0 10px 26px rgba(2, 8, 23, 0.04)',
          height: '100%',
          overflow: 'hidden',
          background:
            theme.palette.mode === 'light'
              ? selected
                ? `linear-gradient(145deg, ${alpha(primaryMain, 0.1)}, ${theme.palette.background.paper})`
                : theme.palette.background.paper
              : `linear-gradient(145deg, ${alpha(primaryMain, selected ? 0.16 : 0.06)}, ${theme.palette.background.paper})`
        };
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
          <Grid item xs={12} sm={6} md={4}>
            <MiniMetric label={t('salesWorkflow.metrics.subscriptionPackage', 'Subscription package')} value={preview.newPackageName || preview.newPackageId} icon={<Inventory2Icon fontSize="small" />} color="primary" />
          </Grid>
          {preview.linePackageName || preview.linePackageId ? (
            <Grid item xs={12} sm={6} md={4}>
              <MiniMetric label={t('salesWorkflow.metrics.linePackage', 'Line package')} value={preview.linePackageName || preview.linePackageId} icon={<LanIcon fontSize="small" />} color="info" />
            </Grid>
          ) : null}
          <Grid item xs={12} sm={6} md={4}>
            <MiniMetric label={t('salesWorkflow.metrics.newDate', 'New date')} value={formatDate(preview.newRenewalDate)} icon={<AutorenewIcon fontSize="small" />} color="info" />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
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
          <Grid item xs={12} sm={6} md={4}>
            <MiniMetric label={t('salesWorkflow.metrics.subscriptionAmount', 'Subscription amount')} value={formatMoney(preview.amount)} icon={<PaidOutlinedIcon fontSize="small" />} color="warning" />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <MiniMetric label={t('salesWorkflow.metrics.invoiceAmount', 'Invoice amount')} value={formatMoney(preview.invoiceAmount ?? preview.amount)} icon={<PaidOutlinedIcon fontSize="small" />} color="success" />
          </Grid>
          {Number(preview.loyaltyPointsUsed || 0) > 0 ? (
            <Grid item xs={12} sm={6} md={4}>
              <MiniMetric
                label={t('salesWorkflow.metrics.loyaltyApplied', 'Points applied')}
                value={`${Number(preview.loyaltyPointsUsed || 0).toLocaleString()} pts · ${formatMoney(preview.loyaltyAmountRedeemed || 0)}`}
                icon={<AutoAwesomeIcon fontSize="small" />}
                color="secondary"
              />
            </Grid>
          ) : null}
          {preview.invoiceNetAmount !== null && preview.invoiceNetAmount !== undefined ? (
            <Grid item xs={12} sm={6} md={4}>
              <MiniMetric label={t('salesWorkflow.metrics.invoiceNetAmount', 'Net invoice')} value={formatMoney(preview.invoiceNetAmount)} icon={<PaidOutlinedIcon fontSize="small" />} color="info" />
            </Grid>
          ) : null}
        </Grid>
        {preview.currentPackageName && preview.currentPackageName !== preview.newPackageName ? (
          <Alert severity="info">
            {t('salesWorkflow.messages.changedPlan', 'Subscription package change')}: {preview.currentPackageName} → {preview.newPackageName}
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

function LoyaltyRedemptionPanel({
  t,
  config,
  configLoading,
  balanceLoading,
  customerId,
  availablePoints,
  pointsValue,
  onPointsChange,
  previewAmount,
  netAmount,
  pointsExceeded,
  amountExceeded,
  programInactive,
  disabledInfo = false
}) {
  const isActive = Boolean(config?.active);
  const disabled = disabledInfo || !customerId || configLoading || !isActive;

  return (
    <Paper
      variant="outlined"
      sx={(theme) => {
        const mainColor = paletteMain(theme, 'secondary');
        return {
          p: { xs: 1.5, sm: 2 },
          borderRadius: 2.5,
          borderColor:
            pointsExceeded || amountExceeded
              ? theme.palette.error.main
              : alpha(mainColor, theme.palette.mode === 'light' ? 0.22 : 0.34),
          background:
            theme.palette.mode === 'light'
              ? `linear-gradient(145deg, ${alpha(mainColor, 0.08)}, ${theme.palette.background.paper})`
              : `linear-gradient(145deg, ${alpha(mainColor, 0.13)}, ${theme.palette.background.paper})`,
          overflow: 'hidden'
        };
      }}
    >
      <Stack spacing={2}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between">
          <Stack direction="row" spacing={1.25} alignItems="center" sx={{ minWidth: 0 }}>
            <Avatar
              sx={(theme) => ({
                width: 40,
                height: 40,
                bgcolor: alpha(paletteMain(theme, 'secondary'), 0.14),
                color: paletteMain(theme, 'secondary'),
                flexShrink: 0
              })}
            >
              <AutoAwesomeIcon fontSize="small" />
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h4" fontWeight={900} sx={{ lineHeight: 1.18, fontSize: { xs: '1rem', sm: '1.05rem' } }}>
                {t('salesWorkflow.sections.loyaltyTitle', 'Loyalty points')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {disabledInfo
                  ? t('salesWorkflow.sections.loyaltyActivationHelper', 'Points apply only to existing customers during renewals.')
                  : t('salesWorkflow.sections.loyaltyHelper', 'Apply available points to this renewal invoice.')}
              </Typography>
            </Box>
          </Stack>
          <Chip
            size="small"
            color={isActive && !disabledInfo ? 'secondary' : 'default'}
            variant={isActive && !disabledInfo ? 'light' : 'outlined'}
            label={
              disabledInfo
                ? t('salesWorkflow.messages.loyaltyExistingOnly', 'Existing customers only')
                : isActive
                  ? t('salesWorkflow.messages.loyaltyReady', 'Ready to apply')
                  : t('salesWorkflow.messages.loyaltyDisabled', 'Loyalty disabled')
            }
            sx={{ fontWeight: 800 }}
          />
        </Stack>

        {disabledInfo ? (
          <Alert severity="info" icon={<InfoOutlinedIcon />}>
            {t('salesWorkflow.messages.loyaltyActivationInfo', 'New accounts start without a points balance. Apply points later from a renewal or invoice.')}
          </Alert>
        ) : null}

        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <MiniMetric
              label={t('salesWorkflow.metrics.availablePoints', 'Available points')}
              value={customerId ? Number(availablePoints || 0).toLocaleString() : '--'}
              icon={<AutoAwesomeIcon fontSize="small" />}
              color="secondary"
            />
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, fontWeight: 650 }}>
              {isActive
                ? t('salesWorkflow.messages.loyaltyConversion', '{{points}} point(s) = ${{amount}}', {
                    points: Number(config?.pointsPerUnit || 1),
                    amount: Number(config?.amountUnit || 10).toLocaleString(undefined, { minimumFractionDigits: 2 })
                  })
                : t('salesWorkflow.messages.loyaltyDisabled', 'Loyalty disabled')}
            </Typography>
            {balanceLoading ? (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                {t('salesWorkflow.messages.loadingPoints', 'Loading points...')}
              </Typography>
            ) : null}
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label={t('salesWorkflow.fields.loyaltyPointsUsed', 'Points to use')}
              type="number"
              sx={fieldSx}
              value={pointsValue}
              onChange={onPointsChange}
              disabled={disabled}
              error={pointsExceeded}
              inputProps={{ min: 0, step: 1 }}
              helperText={
                !customerId
                  ? t('salesWorkflow.messages.loyaltySelectSubscription', 'Select a subscription first.')
                  : pointsExceeded
                    ? t('salesWorkflow.messages.loyaltyExceeded', 'The customer does not have enough available points.')
                    : t('salesWorkflow.messages.loyaltyMaxAvailable', 'Available: {{count}} pts', {
                        count: Number(availablePoints || 0).toLocaleString()
                      })
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AutoAwesomeIcon fontSize="small" sx={{ color: 'secondary.main' }} />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label={t('salesWorkflow.fields.loyaltyAmountRedeemed', 'Redeemed amount')}
              sx={fieldSx}
              value={previewAmount}
              disabled
              error={amountExceeded}
              helperText={
                amountExceeded
                  ? t('salesWorkflow.messages.loyaltyAmountExceeded', 'Points exceed the net invoice amount.')
                  : t('salesWorkflow.messages.loyaltyNetAfter', 'Net after discount and points: ${{amount}}', {
                      amount: Number(netAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })
                    })
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography variant="subtitle2" color="secondary.main" sx={{ fontWeight: 800 }}>
                      $
                    </Typography>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
        </Grid>

        <Box
          sx={(theme) => ({
            p: 1.35,
            borderRadius: 2,
            border: '1px solid',
            borderColor:
              pointsExceeded || amountExceeded
                ? theme.palette.error.main
                : theme.palette.mode === 'dark'
                  ? 'rgba(148, 163, 184, 0.22)'
                  : 'rgba(148, 163, 184, 0.32)',
            bgcolor:
              programInactive && Number(pointsValue || 0) > 0
                ? theme.palette.error.lighter
                : theme.palette.mode === 'dark'
                  ? 'rgba(15, 23, 42, 0.54)'
                  : 'rgba(248, 250, 252, 0.92)'
          })}
        >
          <Stack direction="row" spacing={1} alignItems="flex-start">
            <InfoOutlinedIcon
              fontSize="small"
              sx={(theme) => ({
                mt: '2px',
                color: pointsExceeded || amountExceeded ? theme.palette.error.main : paletteMain(theme, 'primary')
              })}
            />
            <Typography variant="caption" color={pointsExceeded || amountExceeded ? 'error.main' : 'text.secondary'} sx={{ fontWeight: 650 }}>
              {programInactive
                ? t('salesWorkflow.messages.loyaltyInactiveHelp', 'The loyalty program is inactive. Activate it before applying points.')
                : t(
                    'salesWorkflow.messages.loyaltyHelper',
                    'The redeemed points are sent to the invoice and the loyalty ledger applies the deduction when the invoice is saved.'
                  )}
            </Typography>
          </Stack>
        </Box>
      </Stack>
    </Paper>
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
  const [lineIdLoading, setLineIdLoading] = useState({ main: false, plus: false });
  const [activation, setActivation] = useState(() => defaultActivation(defaultOptions));
  const [renewal, setRenewal] = useState(() => defaultRenewal(defaultOptions));
  const [lookupQuery, setLookupQuery] = useState('');
  const [lookup, setLookup] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [loyaltyConfig, setLoyaltyConfig] = useState(null);
  const [loyaltyConfigLoading, setLoyaltyConfigLoading] = useState(false);
  const [loyaltyByCustomerId, setLoyaltyByCustomerId] = useState({});
  const [loyaltyCustomerLoading, setLoyaltyCustomerLoading] = useState(false);

  const packages = options.packages || [];
  const paymentMethods = (options.paymentMethods || []).filter((item) => item.active !== false).sort((a, b) => (a.order || 0) - (b.order || 0));
  const banks = (options.banks || []).filter((item) => item.active !== false);
  const services = (options.services || []).filter((item) => item.active !== false);
  const customerChannelOptions = (options.customerChannels || defaultOptions.customerChannels)
    .map((item) => normalizeWorkflowOption(item, t('salesWorkflow.fallbacks.channel', 'Channel')))
    .filter((item) => item.active !== false);
  const lineProviderOptions = (options.lineProviders || defaultOptions.lineProviders)
    .map((item) => normalizeWorkflowOption(item, t('salesWorkflow.fallbacks.provider', 'Provider')))
    .filter((item) => item.active !== false);

  const selectedActivationPackage = useMemo(
    () => packages.find((item) => String(item.packageId) === String(activation.subscription.packageId)) || null,
    [activation.subscription.packageId, packages]
  );
  const selectedActivationLinePackage = useMemo(
    () => packages.find((item) => String(item.packageId) === String(activation.line.packageId)) || null,
    [activation.line.packageId, packages]
  );
  const selectedActivationLinePlusPackage = useMemo(
    () => packages.find((item) => String(item.packageId) === String(activation.linePlus.packageId)) || null,
    [activation.linePlus.packageId, packages]
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
  const selectedRenewalCustomerId = Number(selectedSubscription?.customerId || 0);
  const selectedRenewalLoyalty = selectedRenewalCustomerId ? loyaltyByCustomerId[selectedRenewalCustomerId] || null : null;
  const renewalLoyaltyPointsRequested = useMemo(() => {
    const parsed = Number(renewal.invoice.loyaltyPointsUsed || 0);
    if (!Number.isFinite(parsed) || parsed <= 0) return 0;
    return Math.floor(parsed);
  }, [renewal.invoice.loyaltyPointsUsed]);
  const selectedRenewalAvailablePoints = Number(selectedRenewalLoyalty?.availablePoints || 0);
  const renewalLoyaltyPreviewAmount = useMemo(() => {
    if (!loyaltyConfig?.active || renewalLoyaltyPointsRequested <= 0) return 0;
    const pointsPerUnit = Math.max(Number(loyaltyConfig?.pointsPerUnit || 1), 1);
    const amountUnit = Number(loyaltyConfig?.amountUnit || 10);
    return Number(((renewalLoyaltyPointsRequested * amountUnit) / pointsPerUnit).toFixed(2));
  }, [loyaltyConfig, renewalLoyaltyPointsRequested]);
  const renewalInvoiceNetAfterLoyalty = useMemo(() => {
    const gross = Number(renewal.invoice.amountPaid || 0);
    const discount = Number(renewal.invoice.amountDiscount || 0);
    return Number((gross - discount - renewalLoyaltyPreviewAmount).toFixed(2));
  }, [renewal.invoice.amountDiscount, renewal.invoice.amountPaid, renewalLoyaltyPreviewAmount]);
  const renewalLoyaltyPointsExceeded = renewalLoyaltyPointsRequested > selectedRenewalAvailablePoints;
  const renewalLoyaltyProgramInactive = Boolean(selectedRenewalCustomerId) && !loyaltyConfigLoading && !loyaltyConfig?.active;
  const renewalLoyaltyAmountExceeded = renewalInvoiceNetAfterLoyalty < 0;
  const renewalInvoiceLoyaltyOverrides = useMemo(
    () => ({
      loyaltyPointsUsed: renewalLoyaltyPointsRequested,
      loyaltyAmountRedeemed: renewalLoyaltyPreviewAmount
    }),
    [renewalLoyaltyPointsRequested, renewalLoyaltyPreviewAmount]
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
  const customerChannelLabel = useCallback(
    (value) => {
      const option = customerChannelOptions.find((item) => String(item.code) === String(value));
      return value ? t(`salesWorkflow.customerChannels.${value}`, option?.label || value) : t('salesWorkflow.messages.selectCustomerChannel', 'Select a channel');
    },
    [customerChannelOptions, t]
  );
  const lineProviderLabel = useCallback(
    (value) => {
      const option = lineProviderOptions.find((item) => String(item.code) === String(value));
      return value ? option?.label || value : t('salesWorkflow.messages.selectLineProvider', 'Select a provider');
    },
    [lineProviderOptions, t]
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

  const generateActivationLineId = useCallback(
    async (target = 'line') => {
      const loadingKey = target === 'linePlus' ? 'plus' : 'main';
      setLineIdLoading((prev) => ({ ...prev, [loadingKey]: true }));
      try {
        const reserved = target === 'linePlus' ? [activation.line.lineId].filter(Boolean) : [activation.linePlus.lineId].filter(Boolean);
        const response = await getNextSalesWorkflowLineId(reserved);
        const nextLineId = response?.lineId || '';
        if (!nextLineId) {
          throw new Error('missing lineId');
        }
        setActivation((prev) => ({
          ...prev,
          [target]: {
            ...prev[target],
            lineId: nextLineId
          }
        }));
        setPreview(null);
        setResult(null);
      } catch (error) {
        enqueueSnackbar(t('salesWorkflow.messages.lineIdGenerateError', 'Could not generate Line ID.'), { variant: 'error' });
      } finally {
        setLineIdLoading((prev) => ({ ...prev, [loadingKey]: false }));
      }
    },
    [activation.line.lineId, activation.linePlus.lineId, enqueueSnackbar, t]
  );

  const loadLoyaltyConfig = useCallback(async () => {
    setLoyaltyConfigLoading(true);
    try {
      const config = await getLoyaltyConfig();
      setLoyaltyConfig(config || null);
    } catch (error) {
      enqueueSnackbar(extractError(error, t('salesWorkflow.messages.loyaltyConfigError', 'Could not load loyalty configuration.')), {
        variant: 'warning'
      });
    } finally {
      setLoyaltyConfigLoading(false);
    }
  }, [enqueueSnackbar, t]);

  const loadCustomerLoyalty = useCallback(
    async (customerId) => {
      const safeId = Number(customerId);
      if (!safeId || loyaltyByCustomerId[safeId]) return;
      setLoyaltyCustomerLoading(true);
      try {
        const summary = await getLoyaltyCustomerBalance(safeId);
        setLoyaltyByCustomerId((prev) => ({
          ...prev,
          [safeId]: summary || {
            customerId: safeId,
            availablePoints: 0,
            lifetimeEarned: 0,
            lifetimeAdjusted: 0
          }
        }));
      } catch (error) {
        enqueueSnackbar(extractError(error, t('salesWorkflow.messages.loyaltyBalanceError', 'Could not load customer points balance.')), {
          variant: 'warning'
        });
      } finally {
        setLoyaltyCustomerLoading(false);
      }
    },
    [enqueueSnackbar, loyaltyByCustomerId, t]
  );

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
        customerChannels: workflowOptions.customerChannels?.length ? workflowOptions.customerChannels : defaultOptions.customerChannels,
        lineProviders: workflowOptions.lineProviders?.length ? workflowOptions.lineProviders : defaultOptions.lineProviders,
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
    loadLoyaltyConfig();
  }, [loadLoyaltyConfig]);

  useEffect(() => {
    if (!selectedRenewalCustomerId || loyaltyConfigLoading || !loyaltyConfig?.active) return;
    loadCustomerLoyalty(selectedRenewalCustomerId);
  }, [loadCustomerLoyalty, loyaltyConfig?.active, loyaltyConfigLoading, selectedRenewalCustomerId]);

  useEffect(() => {
    if (loyaltyConfigLoading || loyaltyConfig?.active) return;
    if (!renewal.invoice.loyaltyPointsUsed && !Number(renewal.invoice.loyaltyAmountRedeemed || 0)) return;
    setRenewal((prev) => ({
      ...prev,
      invoice: {
        ...prev.invoice,
        loyaltyPointsUsed: 0,
        loyaltyAmountRedeemed: 0
      }
    }));
  }, [loyaltyConfig?.active, loyaltyConfigLoading, renewal.invoice.loyaltyAmountRedeemed, renewal.invoice.loyaltyPointsUsed]);

  useEffect(() => {
    if (tab === 0 && activeStep === 1 && activation.mainLineMode === MAIN_LINE_USE_EXISTING && !lineOptions.length && !linesLoading) {
      loadLineOptions();
    }
  }, [activation.mainLineMode, activeStep, lineOptions.length, linesLoading, loadLineOptions, tab]);

  const clearPreview = () => {
    setPreview(null);
    setResult(null);
  };

  useEffect(() => {
    if (tab !== 0 || activeStep !== 1 || activation.mainLineMode !== MAIN_LINE_CREATE_NEW) return;
    if (activation.line.lineId || lineIdLoading.main) return;
    generateActivationLineId('line');
  }, [activation.line.lineId, activation.mainLineMode, activeStep, generateActivationLineId, lineIdLoading.main, tab]);

  useEffect(() => {
    if (tab !== 0 || activeStep !== 1 || activation.mainLineMode !== MAIN_LINE_CREATE_NEW || !activation.linePlusEnabled) return;
    if (activation.linePlus.lineId || lineIdLoading.plus) return;
    generateActivationLineId('linePlus');
  }, [
    activation.linePlus.lineId,
    activation.linePlusEnabled,
    activation.mainLineMode,
    activeStep,
    generateActivationLineId,
    lineIdLoading.plus,
    tab
  ]);

  const applyActivationSubscriptionPackage = (pkg) => {
    if (!pkg) return;
    const devices = pkg.roleCount || 1;
    setActivation((prev) => ({
      ...prev,
      desiredDeviceCount: devices,
      line: {
        ...prev.line,
        packageId: prev.line.packageId || pkg.packageId,
        packageName: prev.line.packageName || pkg.name,
        maxConnections: prev.line.packageId ? prev.line.maxConnections || devices : devices
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

  const applyActivationLinePackage = (pkg) => {
    if (!pkg) return;
    const devices = pkg.roleCount || activation.desiredDeviceCount || 1;
    setActivation((prev) => ({
      ...prev,
      line: {
        ...prev.line,
        packageId: pkg.packageId,
        packageName: pkg.name,
        maxConnections: devices
      }
    }));
    clearPreview();
  };

  const applyActivationLinePlusPackage = (pkg) => {
    if (!pkg) return;
    const devices = pkg.roleCount || activation.desiredDeviceCount || 1;
    setActivation((prev) => ({
      ...prev,
      linePlus: {
        ...prev.linePlus,
        packageId: pkg.packageId,
        packageName: pkg.name,
        maxConnections: devices
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

  const validateRenewalLoyalty = () => {
    if (renewalLoyaltyProgramInactive && renewalLoyaltyPointsRequested > 0) {
      enqueueSnackbar(t('salesWorkflow.messages.loyaltyInactive', 'The loyalty program is inactive for this account.'), {
        variant: 'warning'
      });
      return false;
    }
    if (renewalLoyaltyPointsExceeded) {
      enqueueSnackbar(t('salesWorkflow.messages.loyaltyExceeded', 'The customer does not have enough available points.'), {
        variant: 'warning'
      });
      return false;
    }
    if (renewalLoyaltyAmountExceeded) {
      enqueueSnackbar(t('salesWorkflow.messages.loyaltyAmountExceeded', 'Points exceed the net invoice amount.'), {
        variant: 'warning'
      });
      return false;
    }
    return true;
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
    if (!validateRenewalLoyalty()) return;
    setBusy(true);
    setResult(null);
    try {
      const response = await previewRenewal(buildRenewalPayload(renewal, options, false, renewalInvoiceLoyaltyOverrides));
      setPreview(response);
    } catch (error) {
      enqueueSnackbar(extractError(error, t('salesWorkflow.messages.previewError', 'Could not generate preview.')), { variant: 'error' });
    } finally {
      setBusy(false);
    }
  };

  const handleRenewalExecute = async () => {
    if (!validateRenewalLoyalty()) return;
    setBusy(true);
    try {
      const response = await executeRenewal(buildRenewalPayload(renewal, options, true, renewalInvoiceLoyaltyOverrides));
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
    if (activeStep === 0) return Boolean(activation.customer.customerFullname && activation.customer.channel && (activation.customer.customerMail || activation.customer.customerPhone));
    if (activeStep === 1) {
      if (activation.linePlusEnabled && !Boolean(activation.linePlus.provider && activation.linePlus.packageId)) return false;
      if (activation.mainLineMode === MAIN_LINE_USE_EXISTING) {
        return Boolean(activation.line.lineId && activation.subscription.packageId);
      }
      return Boolean(activation.line.provider && activation.line.username && activation.line.password && activation.line.packageId && activation.subscription.packageId);
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
        <Alert severity="info" sx={{ borderRadius: 2.5, alignItems: 'center' }}>
          {t(
            'salesWorkflow.messages.flowInfo',
            'Guided flow for activations and renewals. Packages, banks, services and payment methods come from catalogs/API; manual CRUD remains as backup.'
          )}
        </Alert>

        <Tabs
          value={tab}
          variant={isMobile ? 'scrollable' : 'standard'}
          scrollButtons={isMobile ? 'auto' : false}
          sx={workflowTabsSx}
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
                <Grid item xs={12} lg={8}>
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
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth required sx={fieldSx}>
                          <InputLabel shrink>{t('salesWorkflow.fields.customerChannel', 'Customer channel')}</InputLabel>
                          <Select
                            label={t('salesWorkflow.fields.customerChannel', 'Customer channel')}
                            value={activation.customer.channel}
                            onChange={(e) => setNestedValue(setActivation, 'customer', 'channel', e.target.value)}
                            displayEmpty
                          >
                            <MenuItem value="" disabled>
                              {t('salesWorkflow.messages.selectCustomerChannel', 'Select a channel')}
                            </MenuItem>
                            {customerChannelOptions.map((option) => (
                              <MenuItem key={option.code} value={option.code}>
                                {customerChannelLabel(option.code)}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
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
                <Grid item xs={12} lg={4}>
                  <Section
                    title={t('salesWorkflow.sections.initialStatusTitle', 'Initial status')}
                    helper={t('salesWorkflow.sections.initialStatusHelper', 'Operational values that will be sent to the backend.')}
                    icon={<CheckCircleOutlineIcon fontSize="small" />}
                    color="success"
                  >
                    <Stack spacing={1.5}>
                      <MiniMetric label={t('salesWorkflow.metrics.status', 'Status')} value={activation.customer.customerStatus} icon={<CheckCircleOutlineIcon fontSize="small" />} color="success" />
                      <MiniMetric label={t('salesWorkflow.metrics.channel', 'Channel')} value={customerChannelLabel(activation.customer.channel)} icon={<LanIcon fontSize="small" />} color="info" />
                    </Stack>
                  </Section>
                </Grid>
              </Grid>
            ) : null}

            {activeStep === 1 ? (
              <Grid container spacing={gridSpacing}>
                <Grid item xs={12} lg={4}>
                  <Section
                    title={t('salesWorkflow.sections.subscriptionPackageTitle', 'Subscription package')}
                    helper={t('salesWorkflow.sections.subscriptionPackageHelper', 'This package is used for the subscription, invoice, credits and renewal.')}
                    icon={<Inventory2Icon fontSize="small" />}
                    color="secondary"
                  >
                    <Autocomplete
                      options={packages}
                      loading={optionsLoading}
                      value={selectedActivationPackage}
                      onChange={(_, value) => applyActivationSubscriptionPackage(value)}
                      getOptionLabel={(option) => option?.displayName || option?.name || ''}
                      isOptionEqualToValue={(option, value) => String(option?.packageId) === String(value?.packageId)}
                      renderInput={(params) => <TextField {...params} label={t('salesWorkflow.fields.searchSubscriptionPackage', 'Search subscription package')} sx={fieldSx} />}
                    />
                    <Grid container spacing={1.5}>
                      {packages.slice(0, 6).map((pkg) => (
                        <Grid item xs={12} key={pkg.packageId}>
                          <PackageCard
                            option={pkg}
                            selected={String(pkg.packageId) === String(activation.subscription.packageId)}
                            onClick={() => applyActivationSubscriptionPackage(pkg)}
                            t={t}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Section>
                </Grid>
                <Grid item xs={12} lg={8}>
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
                                  <MiniMetric label={t('salesWorkflow.metrics.lineProvider', 'Line provider')} value={lineProviderLabel(selectedExistingLine.provider)} icon={<LanIcon fontSize="small" />} color="info" />
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
                    <Box sx={balancedFormGridSx}>
                      {activation.mainLineMode === MAIN_LINE_CREATE_NEW ? (
                        <FormControl fullWidth required sx={fieldSx}>
                          <InputLabel shrink>{t('salesWorkflow.fields.lineProvider', 'Line provider')}</InputLabel>
                          <Select
                            label={t('salesWorkflow.fields.lineProvider', 'Line provider')}
                            value={activation.line.provider}
                            onChange={(e) => setNestedValue(setActivation, 'line', 'provider', e.target.value)}
                            displayEmpty
                          >
                            <MenuItem value="" disabled>
                              {t('salesWorkflow.messages.selectLineProvider', 'Select a provider')}
                            </MenuItem>
                            {lineProviderOptions.map((option) => (
                              <MenuItem key={option.code} value={option.code}>
                                {lineProviderLabel(option.code)}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      ) : (
                        <TextField
                          fullWidth
                          label={t('salesWorkflow.fields.lineProvider', 'Line provider')}
                          sx={fieldSx}
                          value={lineProviderLabel(activation.line.provider)}
                          disabled
                        />
                      )}
                      {activation.mainLineMode === MAIN_LINE_CREATE_NEW ? (
                        <Box
                          sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: 'minmax(0, 1fr) auto' },
                            gap: 1,
                            alignItems: 'flex-start'
                          }}
                        >
                          <TextField
                            fullWidth
                            label={t('salesWorkflow.fields.lineId', 'Line ID')}
                            sx={fieldSx}
                            value={activation.line.lineId || ''}
                            helperText={t('salesWorkflow.messages.generatedLineIdHelper', 'Line ID generated automatically and validated against the database.')}
                            InputProps={{ readOnly: true }}
                          />
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => generateActivationLineId('line')}
                            disabled={lineIdLoading.main}
                            startIcon={lineIdLoading.main ? <CircularProgress size={16} color="inherit" /> : activation.line.lineId ? <RefreshIcon /> : <AutoAwesomeIcon />}
                            sx={{ minHeight: 56, whiteSpace: 'nowrap', width: { xs: '100%', sm: 'auto' } }}
                          >
                            {activation.line.lineId
                              ? t('salesWorkflow.buttons.regenerateLineId', 'Regenerate')
                              : t('salesWorkflow.buttons.generateLineId', 'Generate Line ID')}
                          </Button>
                        </Box>
                      ) : (
                        <TextField fullWidth label={t('salesWorkflow.fields.lineId', 'Line ID')} sx={fieldSx} value={activation.line.lineId} disabled />
                      )}
                      <TextField fullWidth required={activation.mainLineMode === MAIN_LINE_CREATE_NEW} label={t('salesWorkflow.fields.lineUsername', 'Line username')} sx={fieldSx} value={activation.line.username} disabled={activation.mainLineMode === MAIN_LINE_USE_EXISTING} onChange={(e) => setNestedValue(setActivation, 'line', 'username', e.target.value)} />
                      <TextField fullWidth required={activation.mainLineMode === MAIN_LINE_CREATE_NEW} label={t('salesWorkflow.fields.password', 'Password')} sx={fieldSx} value={activation.line.password} disabled={activation.mainLineMode === MAIN_LINE_USE_EXISTING} onChange={(e) => setNestedValue(setActivation, 'line', 'password', e.target.value)} />
                      <TextField fullWidth label={t('salesWorkflow.fields.expires', 'Expires')} type="date" sx={fieldSx} value={activation.line.expDate} disabled={activation.mainLineMode === MAIN_LINE_USE_EXISTING} onChange={(e) => setNestedValue(setActivation, 'line', 'expDate', e.target.value)} InputLabelProps={{ shrink: true }} />
                      {activation.mainLineMode === MAIN_LINE_CREATE_NEW ? (
                        <Autocomplete
                          options={packages}
                          loading={optionsLoading}
                          value={selectedActivationLinePackage}
                          onChange={(_, value) => applyActivationLinePackage(value)}
                          getOptionLabel={(option) => option?.displayName || option?.name || ''}
                          isOptionEqualToValue={(option, value) => String(option?.packageId) === String(value?.packageId)}
                          renderInput={(params) => <TextField {...params} required label={t('salesWorkflow.fields.linePackage', 'Line package')} sx={fieldSx} />}
                        />
                      ) : (
                        <TextField
                          fullWidth
                          label={t('salesWorkflow.fields.linePackage', 'Line package')}
                          sx={fieldSx}
                          value={activation.line.packageName || activation.line.packageId || ''}
                          disabled
                        />
                      )}
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
                    </Box>
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
                      <Box sx={balancedFormGridSx}>
                        <FormControl fullWidth required sx={fieldSx}>
                          <InputLabel shrink>{t('salesWorkflow.fields.linePlusProvider', 'Plus line provider')}</InputLabel>
                          <Select
                            label={t('salesWorkflow.fields.linePlusProvider', 'Plus line provider')}
                            value={activation.linePlus.provider}
                            onChange={(e) => setNestedValue(setActivation, 'linePlus', 'provider', e.target.value)}
                            displayEmpty
                          >
                            <MenuItem value="" disabled>
                              {t('salesWorkflow.messages.selectLineProvider', 'Select a provider')}
                            </MenuItem>
                            {lineProviderOptions.map((option) => (
                              <MenuItem key={option.code} value={option.code}>
                                {lineProviderLabel(option.code)}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <Box
                          sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: 'minmax(0, 1fr) auto' },
                            gap: 1,
                            alignItems: 'flex-start'
                          }}
                        >
                          <TextField
                            fullWidth
                            label={t('salesWorkflow.fields.linePlusId', 'Line Plus ID')}
                            sx={fieldSx}
                            value={activation.linePlus.lineId || ''}
                            helperText={t('salesWorkflow.messages.generatedLineIdHelper', 'Line ID generated automatically and validated against the database.')}
                            InputProps={{ readOnly: true }}
                          />
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => generateActivationLineId('linePlus')}
                            disabled={lineIdLoading.plus}
                            startIcon={lineIdLoading.plus ? <CircularProgress size={16} color="inherit" /> : activation.linePlus.lineId ? <RefreshIcon /> : <AutoAwesomeIcon />}
                            sx={{ minHeight: 56, whiteSpace: 'nowrap', width: { xs: '100%', sm: 'auto' } }}
                          >
                            {activation.linePlus.lineId
                              ? t('salesWorkflow.buttons.regenerateLineId', 'Regenerate')
                              : t('salesWorkflow.buttons.generateLineId', 'Generate Line ID')}
                          </Button>
                        </Box>
                        <TextField fullWidth label={t('salesWorkflow.fields.plusUsername', 'Plus username')} sx={fieldSx} value={activation.linePlus.username} onChange={(e) => setNestedValue(setActivation, 'linePlus', 'username', e.target.value)} />
                        <TextField fullWidth label={t('salesWorkflow.fields.plusPassword', 'Plus password')} sx={fieldSx} value={activation.linePlus.password} onChange={(e) => setNestedValue(setActivation, 'linePlus', 'password', e.target.value)} />
                        <Autocomplete
                          options={packages}
                          loading={optionsLoading}
                          value={selectedActivationLinePlusPackage}
                          onChange={(_, value) => applyActivationLinePlusPackage(value)}
                          getOptionLabel={(option) => option?.displayName || option?.name || ''}
                          isOptionEqualToValue={(option, value) => String(option?.packageId) === String(value?.packageId)}
                          renderInput={(params) => <TextField {...params} required label={t('salesWorkflow.fields.linePlusPackage', 'Line Plus package')} sx={fieldSx} />}
                        />
                      </Box>
                    ) : null}
                  </Section>
                </Grid>
              </Grid>
            ) : null}

            {activeStep === 2 ? (
              <Grid container spacing={gridSpacing}>
                <Grid item xs={12} lg={8}>
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
	                          label={t('salesWorkflow.fields.subscriptionAmount', 'Subscription amount')}
	                          type="number"
	                          sx={fieldSx}
	                          value={activation.subscription.amount}
	                          onChange={(e) => setNestedValue(setActivation, 'subscription', 'amount', e.target.value)}
	                          InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
	                        />
	                      </Grid>
	                      <Grid item xs={12} sm={6} lg={4}>
	                        <TextField
	                          fullWidth
	                          label={t('salesWorkflow.fields.invoiceAmount', 'Invoice amount')}
	                          type="number"
	                          sx={fieldSx}
	                          value={activation.invoice.amountPaid}
	                          onChange={(e) => setNestedValue(setActivation, 'invoice', 'amountPaid', e.target.value)}
	                          InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
	                        />
	                      </Grid>
	                      <Grid item xs={12} sm={6} lg={4}>
	                        <TextField
	                          fullWidth
	                          label={t('salesWorkflow.fields.invoiceDiscount', 'Invoice discount')}
	                          type="number"
	                          sx={fieldSx}
	                          value={activation.invoice.amountDiscount}
	                          onChange={(e) => setNestedValue(setActivation, 'invoice', 'amountDiscount', e.target.value)}
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
                      <Grid item xs={12} sm={activationRequiresBank ? 6 : 12} lg={activationRequiresBank ? 3 : 6}>
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
                        <Grid item xs={12} sm={6} lg={3}>
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
                    <LoyaltyRedemptionPanel
                      t={t}
                      config={loyaltyConfig}
                      configLoading={loyaltyConfigLoading}
                      balanceLoading={false}
                      customerId={null}
                      availablePoints={0}
                      pointsValue={0}
                      onPointsChange={() => {}}
                      previewAmount={0}
                      netAmount={Number(activation.invoice.amountPaid || 0) - Number(activation.invoice.amountDiscount || 0)}
                      pointsExceeded={false}
                      amountExceeded={false}
                      programInactive={false}
                      disabledInfo
                    />
	                  </Section>
                </Grid>
                <Grid item xs={12} lg={4}>
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
                        <MiniMetric label={t('salesWorkflow.metrics.channel', 'Channel')} value={customerChannelLabel(activation.customer.channel)} icon={<LanIcon fontSize="small" />} color="info" />
                      </Grid>
	                      <Grid item xs={12} sm={6}>
		                        <MiniMetric label={t('salesWorkflow.metrics.subscriptionPackage', 'Subscription package')} value={selectedActivationPackage?.name} icon={<Inventory2Icon fontSize="small" />} color="secondary" />
	                      </Grid>
	                      <Grid item xs={12} sm={6}>
		                        <MiniMetric label={t('salesWorkflow.metrics.linePackage', 'Line package')} value={activation.line.packageName || activation.line.packageId} icon={<LanIcon fontSize="small" />} color="info" />
	                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <MiniMetric label={t('salesWorkflow.metrics.lineProvider', 'Line provider')} value={lineProviderLabel(activation.line.provider)} icon={<LanIcon fontSize="small" />} color="info" />
                      </Grid>
	                      <Grid item xs={12} sm={6}>
		                        <MiniMetric label={t('salesWorkflow.metrics.line', 'Line')} value={activation.line.lineId} icon={<LanIcon fontSize="small" />} color="info" />
                      </Grid>
                      <Grid item xs={12} sm={6}>
	                        <MiniMetric label={t('salesWorkflow.metrics.devices', 'Devices')} value={activation.desiredDeviceCount} icon={<DevicesIcon fontSize="small" />} color="success" />
                      </Grid>
                      {activation.linePlusEnabled ? (
                        <Grid item xs={12} sm={6}>
                          <MiniMetric label={t('salesWorkflow.metrics.linePlusProvider', 'Plus line provider')} value={lineProviderLabel(activation.linePlus.provider)} icon={<LanIcon fontSize="small" />} color="info" />
                        </Grid>
                      ) : null}
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

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="space-between" sx={actionBarSx}>
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
	                            sx={(theme) => {
	                              const selected = String(renewal.subscriptionId) === String(subscription.subscriptionId);
                                const primaryMain = paletteMain(theme, 'primary');
	                              return {
	                                borderRadius: 2.25,
	                                borderColor: selected ? primaryMain : dividerBorderColor(theme),
	                                boxShadow: selected ? `0 18px 34px ${alpha(primaryMain, 0.18)}` : '0 10px 26px rgba(2, 8, 23, 0.04)',
	                                height: '100%',
	                                overflow: 'hidden',
	                                background:
	                                  theme.palette.mode === 'light'
	                                    ? selected
	                                      ? `linear-gradient(145deg, ${alpha(primaryMain, 0.1)}, ${theme.palette.background.paper})`
	                                      : theme.palette.background.paper
	                                    : `linear-gradient(145deg, ${alpha(primaryMain, selected ? 0.16 : 0.06)}, ${theme.palette.background.paper})`
	                              };
	                            }}
	                          >
                            <CardActionArea onClick={() => handleSelectSubscription(subscription)} sx={{ p: 2, height: '100%' }}>
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
	                                    <MiniMetric label={t('salesWorkflow.metrics.subscriptionAmount', 'Subscription amount')} value={formatMoney(subscription.amount)} icon={<PaidOutlinedIcon fontSize="small" />} color="success" />
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
                <Grid item xs={12}>
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
                      renderInput={(params) => <TextField {...params} label={t('salesWorkflow.fields.subscriptionPackage', 'Subscription package')} sx={fieldSx} />}
                    />
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} lg={3}>
                        <TextField
                          fullWidth
	                          label={t('salesWorkflow.fields.desiredDevices', 'Desired devices')}
                          type="number"
                          sx={fieldSx}
                          value={renewal.desiredDeviceCount}
                          onChange={(e) => setRenewal((prev) => ({ ...prev, desiredDeviceCount: e.target.value }))}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} lg={3}>
                        <FormControl fullWidth sx={fieldSx}>
                          <InputLabel>{t('salesWorkflow.fields.renewalBase', 'Base if expired')}</InputLabel>
                          <Select label={t('salesWorkflow.fields.renewalBase', 'Base if expired')} value={renewal.renewalBaseMode} onChange={(e) => setRenewal((prev) => ({ ...prev, renewalBaseMode: e.target.value }))}>
                            <MenuItem value={RENEWAL_BASE_CURRENT_EXPIRATION}>{t('salesWorkflow.options.currentExpiration', 'From current expiration')}</MenuItem>
                            <MenuItem value={RENEWAL_BASE_TODAY}>{t('salesWorkflow.options.today', 'From today')}</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6} lg={3}>
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
                      <Grid item xs={12} sm={6} lg={3}>
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
                <Grid item xs={12}>
                  <Section
                    title={t('salesWorkflow.sections.renewalPaymentTitle', 'Payment and confirmation')}
                    helper={t('salesWorkflow.sections.renewalPaymentHelper', 'Preview shows the new date, plan change and missing licenses before executing.')}
                    icon={<PaidOutlinedIcon fontSize="small" />}
                    color="success"
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} lg={3}>
                        <TextField
	                          fullWidth
	                          label={t('salesWorkflow.fields.subscriptionAmount', 'Subscription amount')}
	                          type="number"
	                          sx={fieldSx}
	                          value={renewal.subscription.amount}
	                          onChange={(e) => setNestedValue(setRenewal, 'subscription', 'amount', e.target.value)}
	                          InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
	                        />
	                      </Grid>
	                      <Grid item xs={12} sm={6} lg={3}>
	                        <TextField
	                          fullWidth
	                          label={t('salesWorkflow.fields.invoiceAmount', 'Invoice amount')}
	                          type="number"
	                          sx={fieldSx}
	                          value={renewal.invoice.amountPaid}
	                          onChange={(e) => setNestedValue(setRenewal, 'invoice', 'amountPaid', e.target.value)}
	                          InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
	                        />
	                      </Grid>
	                      <Grid item xs={12} sm={6} lg={3}>
	                        <TextField
	                          fullWidth
	                          label={t('salesWorkflow.fields.invoiceDiscount', 'Invoice discount')}
	                          type="number"
	                          sx={fieldSx}
	                          value={renewal.invoice.amountDiscount}
	                          onChange={(e) => setNestedValue(setRenewal, 'invoice', 'amountDiscount', e.target.value)}
	                          InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
	                        />
	                      </Grid>
                      <Grid item xs={12} sm={6} lg={3}>
                        <Autocomplete
                          options={services}
                          value={services.find((item) => String(item.id) === String(renewal.invoice.serviceId)) || null}
                          onChange={(_, value) => setNestedValue(setRenewal, 'invoice', 'serviceId', value?.id || '')}
                          getOptionLabel={(option) => option?.label || ''}
	                          renderInput={(params) => <TextField {...params} label={t('salesWorkflow.fields.service', 'Service')} sx={fieldSx} />}
                        />
                      </Grid>
                      <Grid item xs={12} sm={renewalRequiresBank ? 6 : 12} lg={renewalRequiresBank ? 3 : 6}>
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
                        <Grid item xs={12} sm={6} lg={3}>
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
                    <LoyaltyRedemptionPanel
                      t={t}
                      config={loyaltyConfig}
                      configLoading={loyaltyConfigLoading}
                      balanceLoading={loyaltyCustomerLoading}
                      customerId={selectedRenewalCustomerId}
                      availablePoints={selectedRenewalAvailablePoints}
                      pointsValue={renewal.invoice.loyaltyPointsUsed}
                      onPointsChange={(e) => setNestedValue(setRenewal, 'invoice', 'loyaltyPointsUsed', e.target.value)}
                      previewAmount={renewalLoyaltyPreviewAmount}
                      netAmount={renewalInvoiceNetAfterLoyalty}
                      pointsExceeded={renewalLoyaltyPointsExceeded}
                      amountExceeded={renewalLoyaltyAmountExceeded}
                      programInactive={renewalLoyaltyProgramInactive}
                    />
                    {Number(renewal.desiredDeviceCount || 0) < Number(renewal.currentDeviceCount || 0) ? (
                      <Alert severity="warning">
                        {t('salesWorkflow.messages.decreaseDevicesWarning', 'You are reducing devices. The system does not remove licenses automatically; this will remain for manual review.')}
                      </Alert>
                    ) : null}
                  </Section>
                </Grid>
              </Grid>
            ) : null}

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="space-between" sx={actionBarSx}>
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
