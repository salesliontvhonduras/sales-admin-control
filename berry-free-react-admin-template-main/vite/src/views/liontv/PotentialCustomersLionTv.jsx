import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import { useTheme, useMediaQuery } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import PublicIcon from '@mui/icons-material/Public';
import CategoryIcon from '@mui/icons-material/Category';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import GroupIcon from '@mui/icons-material/Group';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ContactPhoneOutlinedIcon from '@mui/icons-material/ContactPhoneOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';

import MainCard from 'ui-component/cards/MainCard';
import LionMetricCard from 'ui-component/cards/LionMetricCard';
import DialogTitleWithClose from 'ui-component/dialogs/DialogTitleWithClose';
import MobileFieldGrid from 'ui-component/responsive/MobileFieldGrid';
import MobileSummaryCard from 'ui-component/responsive/MobileSummaryCard';
import ResponsiveActionBar from 'ui-component/responsive/ResponsiveActionBar';
import ResponsiveEntityView from 'ui-component/responsive/ResponsiveEntityView';
import ResponsiveFilters from 'ui-component/responsive/ResponsiveFilters';
import ResponsiveMetricGrid from 'ui-component/responsive/ResponsiveMetricGrid';
import { gridSpacing } from 'store/constant';
import { lionTvApi } from 'utils/api';

const buildCategoryOptions = (t) => [
  { value: 'GENERAL', label: t('potentialCustomers.categories.GENERAL') },
  { value: 'IPTV', label: t('potentialCustomers.categories.IPTV') },
  { value: 'SPORTS_BAR', label: t('potentialCustomers.categories.SPORTS_BAR') },
  { value: 'BAR_RESTAURANT', label: t('potentialCustomers.categories.BAR_RESTAURANT') },
  { value: 'RESTAURANT', label: t('potentialCustomers.categories.RESTAURANT') },
  { value: 'CAFE', label: t('potentialCustomers.categories.CAFE') },
  { value: 'BARBERSHOP', label: t('potentialCustomers.categories.BARBERSHOP') },
  { value: 'BEAUTY_SALON', label: t('potentialCustomers.categories.BEAUTY_SALON') },
  { value: 'HOTEL', label: t('potentialCustomers.categories.HOTEL') },
  { value: 'MOTEL', label: t('potentialCustomers.categories.MOTEL') },
  { value: 'HOSTEL', label: t('potentialCustomers.categories.HOSTEL') },
  { value: 'GYM', label: t('potentialCustomers.categories.GYM') },
  { value: 'CLINIC_WAITING_ROOM', label: t('potentialCustomers.categories.CLINIC_WAITING_ROOM') },
  { value: 'DENTAL_CLINIC', label: t('potentialCustomers.categories.DENTAL_CLINIC') },
  { value: 'AUTO_WORKSHOP', label: t('potentialCustomers.categories.AUTO_WORKSHOP') },
  { value: 'CAR_DEALERSHIP', label: t('potentialCustomers.categories.CAR_DEALERSHIP') },
  { value: 'SUPERMARKET', label: t('potentialCustomers.categories.SUPERMARKET') },
  { value: 'CONVENIENCE_STORE', label: t('potentialCustomers.categories.CONVENIENCE_STORE') },
  { value: 'OFFICE', label: t('potentialCustomers.categories.OFFICE') },
  { value: 'CALL_CENTER', label: t('potentialCustomers.categories.CALL_CENTER') },
  { value: 'EVENT_HALL', label: t('potentialCustomers.categories.EVENT_HALL') },
  { value: 'BILLIARD_CLUB', label: t('potentialCustomers.categories.BILLIARD_CLUB') },
  { value: 'NIGHTCLUB', label: t('potentialCustomers.categories.NIGHTCLUB') },
  { value: 'SOCIAL_MEDIA', label: t('potentialCustomers.categories.SOCIAL_MEDIA') },
  { value: 'REFERRAL', label: t('potentialCustomers.categories.REFERRAL') },
  { value: 'WEB', label: t('potentialCustomers.categories.WEB') },
  { value: 'OTHER', label: t('potentialCustomers.categories.OTHER') }
];

const buildStatusOptions = (t) => [
  { value: 'NEW', label: t('potentialCustomers.status.NEW') },
  { value: 'CONTACTED', label: t('potentialCustomers.status.CONTACTED') },
  { value: 'NEGOTIATION', label: t('potentialCustomers.status.NEGOTIATION') },
  { value: 'CONVERTED', label: t('potentialCustomers.status.CONVERTED') },
  { value: 'LOST', label: t('potentialCustomers.status.LOST') }
];

const EMAIL_FALLBACK = 'nomail@gmail.com';
const ISO_CODE_REGEX = /^[A-Z]{2}$/;
const fallbackIsoCountries = [
  { value: 'AR', labels: { en: 'Argentina', es: 'Argentina' } },
  { value: 'CA', labels: { en: 'Canada', es: 'Canadá' } },
  { value: 'CO', labels: { en: 'Colombia', es: 'Colombia' } },
  { value: 'CR', labels: { en: 'Costa Rica', es: 'Costa Rica' } },
  { value: 'ES', labels: { en: 'Spain', es: 'España' } },
  { value: 'GT', labels: { en: 'Guatemala', es: 'Guatemala' } },
  { value: 'HN', labels: { en: 'Honduras', es: 'Honduras' } },
  { value: 'MX', labels: { en: 'Mexico', es: 'México' } },
  { value: 'NI', labels: { en: 'Nicaragua', es: 'Nicaragua' } },
  { value: 'PA', labels: { en: 'Panama', es: 'Panamá' } },
  { value: 'SV', labels: { en: 'El Salvador', es: 'El Salvador' } },
  { value: 'US', labels: { en: 'United States', es: 'Estados Unidos' } }
];

function normalizeUiLanguage(language) {
  return String(language || '').toLowerCase().startsWith('es') ? 'es' : 'en';
}

function buildIsoCountryOptions(language) {
  const normalizedLanguage = normalizeUiLanguage(language);
  const hasIntlDisplayNames = typeof Intl !== 'undefined' && typeof Intl.DisplayNames === 'function';

  if (!hasIntlDisplayNames) {
    return [...fallbackIsoCountries]
      .map((country) => ({
        value: country.value,
        label: `${country.labels[normalizedLanguage] || country.labels.en} (${country.value})`
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }

  const displayNames = new Intl.DisplayNames([normalizedLanguage, 'en'], { type: 'region' });
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const generated = [];

  for (const first of letters) {
    for (const second of letters) {
      const code = `${first}${second}`;
      if (!ISO_CODE_REGEX.test(code)) continue;

      let localizedName = '';
      try {
        localizedName = displayNames.of(code) || '';
      } catch (error) {
        localizedName = '';
      }

      if (!localizedName || localizedName.toUpperCase() === code) continue;
      generated.push({ value: code, label: `${localizedName} (${code})` });
    }
  }

  if (!generated.length) {
    return [...fallbackIsoCountries]
      .map((country) => ({
        value: country.value,
        label: `${country.labels[normalizedLanguage] || country.labels.en} (${country.value})`
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }

  return generated.sort((a, b) => a.label.localeCompare(b.label));
}

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

function optionLabel(options, value, fallback = '-') {
  if (!value) return fallback;
  return options.find((opt) => opt.value === value)?.label || value;
}

function formatDateTime(value, language) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const locale = normalizeUiLanguage(language);
  try {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  } catch (error) {
    return date.toLocaleString(locale);
  }
}

function formatCountryLabel(value, countryOptions) {
  const isoValue = (value || '').toUpperCase();
  if (!isoValue) return '-';
  return countryOptions.find((country) => country.value === isoValue)?.label || isoValue;
}

function normalizePotential(item = {}) {
  return {
    potentialCustomerId: item.potentialCustomerId ?? item.id ?? item.potential_customer_id ?? null,
    fullName: item.fullName ?? item.full_name ?? '',
    email: item.email ?? '',
    phone: item.phone ?? '',
    country: (item.country ?? '').toUpperCase(),
    category: (item.category ?? 'GENERAL').toUpperCase(),
    status: (item.status ?? 'NEW').toUpperCase(),
    createdAt: item.createdAt ?? item.created_at ?? null
  };
}

function sanitizeCsvCell(value) {
  return String(value ?? '')
    .replace(/[\r\n]+/g, ' ')
    .replace(/,/g, ' ')
    .trim();
}

function parseCsvLine(line) {
  const columns = [];
  let current = '';
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];

    if (character === '"') {
      if (inQuotes && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (character === ',' && !inQuotes) {
      columns.push(current);
      current = '';
      continue;
    }

    current += character;
  }

  columns.push(current);
  return columns.map((value) => value.trim());
}

function isImportHeaderRow(firstColumn, secondColumn) {
  const first = String(firstColumn || '')
    .trim()
    .toLowerCase();
  const second = String(secondColumn || '')
    .trim()
    .toLowerCase();

  const phoneHeader = ['phone', 'telefono', 'teléfono', 'celular', 'numero', 'número', 'mobile'];
  const labelHeader = ['group', 'grupo', 'label', 'etiqueta', 'name', 'nombre', 'category', 'categoria', 'categoría'];

  return phoneHeader.includes(first) && labelHeader.includes(second);
}

function parseWhatsAppImportCsv(text) {
  const rows = [];

  String(text || '')
    .split(/\r?\n/)
    .forEach((rawLine, index) => {
      const trimmedLine = rawLine.trim();
      if (!trimmedLine) return;

      const columns = parseCsvLine(trimmedLine);
      const phone = String(columns[0] || '')
        .replace(/^\uFEFF/, '')
        .trim();
      const label = columns.slice(1).join(',').trim();

      if (index === 0 && isImportHeaderRow(phone, label)) {
        return;
      }

      if (!phone && !label) return;
      rows.push({ phone, label });
    });

  return rows;
}

const countryPhonePrefixMap = {
  AR: '54',
  CA: '1',
  CO: '57',
  CR: '506',
  ES: '34',
  GT: '502',
  HN: '504',
  MX: '52',
  NI: '505',
  PA: '507',
  SV: '503',
  US: '1'
};

function normalizePhoneForWhatsApp(phone, countryIso = '') {
  let digits = String(phone || '').replace(/\D/g, '');
  if (!digits) return '';

  if (digits.startsWith('00')) {
    digits = digits.slice(2);
  }

  const iso = (countryIso || '').toUpperCase();
  const prefix = countryPhonePrefixMap[iso];

  if (prefix && digits.length <= 10 && !digits.startsWith(prefix)) {
    return `${prefix}${digits}`;
  }

  return digits;
}

function StatusChip({ status }) {
  const { t, i18n } = useTranslation();
  const map = {
    NEW: 'info',
    CONTACTED: 'warning',
    NEGOTIATION: 'secondary',
    CONVERTED: 'success',
    LOST: 'error'
  };
  return (
    <Chip
      size="small"
      label={t(`potentialCustomers.status.${status}`, { defaultValue: status || '-' })}
      sx={(theme) => {
        const paletteKey = map[status];
        if (!paletteKey) {
          return {
            fontWeight: 700,
            bgcolor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[200],
            color: theme.palette.mode === 'dark' ? theme.palette.grey[100] : theme.palette.grey[900]
          };
        }

        const palette = theme.palette[paletteKey];
        return {
          fontWeight: 700,
          bgcolor: theme.palette.mode === 'dark' ? palette.main : palette.lighter || palette.light,
          color: theme.palette.mode === 'dark' ? palette.contrastText : palette.dark || palette.main,
          border: '1px solid',
          borderColor: theme.palette.mode === 'dark' ? palette.main : palette.light || palette.main
        };
      }}
    />
  );
}

function RowActions({ row, onEdit, onDelete, onWhatsApp, onMarkContacted, onSendPaymentFailedEmail, onSendAbandonedCartEmail }) {
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
          onClick={() => {
            setAnchorEl(null);
            onWhatsApp?.(row);
          }}
        >
          <WhatsAppIcon fontSize="small" style={{ marginRight: 8, color: '#25D366' }} />
          {t('actions.whatsapp', 'WhatsApp')}
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            onSendPaymentFailedEmail?.(row);
          }}
        >
          <PaymentsOutlinedIcon fontSize="small" style={{ marginRight: 8, color: '#ef6c00' }} />
          {t('potentialCustomers.actions.sendPaymentFailedEmail', 'Send payment failed email')}
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            onSendAbandonedCartEmail?.(row);
          }}
        >
          <ShoppingCartOutlinedIcon fontSize="small" style={{ marginRight: 8, color: '#8e24aa' }} />
          {t('potentialCustomers.actions.sendAbandonedCartEmail', 'Send abandoned cart email')}
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            onMarkContacted?.(row);
          }}
        >
          <CheckCircleOutlineIcon fontSize="small" style={{ marginRight: 8, color: '#2e7d32' }} />
          {t('potentialCustomers.actions.markContacted', 'Mark as Contacted')}
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

const defaultForm = {
  potentialCustomerId: null,
  fullName: '',
  email: '',
  phone: '',
  country: '',
  category: 'GENERAL',
  status: 'NEW'
};

export default function PotentialCustomersLionTv() {
  const { enqueueSnackbar } = useSnackbar();
  const { accessToken } = useAuth();
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const uiLanguage = i18n.resolvedLanguage || i18n.language || 'en';
  const fileInputRef = useRef(null);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [groupNameFilter, setGroupNameFilter] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [openDelete, setOpenDelete] = useState({ open: false, row: null });
  const [form, setForm] = useState(defaultForm);
  const [sending, setSending] = useState(false);
  const [exportAnchorEl, setExportAnchorEl] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importDialog, setImportDialog] = useState({ open: false, fileName: '', rows: [] });
  const [importDefaults, setImportDefaults] = useState({
    defaultCountry: 'HN',
    defaultCategory: 'SOCIAL_MEDIA'
  });
  const [groupNameOptions, setGroupNameOptions] = useState([]);
  const [summary, setSummary] = useState({ newCount: 0, contacted: 0, converted: 0 });
  const categoryOptions = useMemo(() => buildCategoryOptions(t), [t]);
  const statusOptions = useMemo(() => buildStatusOptions(t), [t]);
  const isoCountryOptions = useMemo(() => buildIsoCountryOptions(uiLanguage), [uiLanguage]);
  const whatsAppMessage = useMemo(() => t('potentialCustomers.whatsappMessage'), [t]);
  const exportMenuOpen = Boolean(exportAnchorEl);
  const importPreview = useMemo(() => {
    const grouped = new Map();
    importDialog.rows.forEach((row) => {
      const label = sanitizeCsvCell(row?.label || t('potentialCustomers.import.fallbackName', 'WhatsApp Lead'));
      if (!label) return;
      grouped.set(label, (grouped.get(label) || 0) + 1);
    });

    return {
      detectedRows: importDialog.rows.length,
      detectedGroups: grouped.size,
      topGroups: [...grouped.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 8)
    };
  }, [importDialog.rows, t]);

  const handleUnauthorized = (err) => {
    const status = err?.response?.status || err?.request?.status;
    return status === 401;
  };

  const loadPotentialCustomers = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const response = await lionTvApi.get('/potential-customers/v1', {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: {
          index: page,
          size: rowsPerPage,
          search: debouncedSearch || undefined,
          status: statusFilter || undefined,
          category: categoryFilter || undefined,
          groupName: groupNameFilter || undefined
        },
        skipAuthRedirect: true
      });

      const payload = response?.data?.data ?? response?.data ?? {};
      const collection = payload.data ?? payload.items ?? payload.content ?? [];
      const normalized = (Array.isArray(collection) ? collection : []).map(normalizePotential);
      setRows(normalized);
      setTotal(payload.total ?? normalized.length);
      setSummary({
        newCount: payload.newCount ?? 0,
        contacted: payload.contactedCount ?? 0,
        converted: payload.convertedCount ?? 0
      });
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || err.message || t('potentialCustomers.messages.loadError'), {
          variant: 'error'
        });
      }
    } finally {
      setLoading(false);
    }
  }, [accessToken, categoryFilter, debouncedSearch, enqueueSnackbar, groupNameFilter, page, rowsPerPage, statusFilter, t]);

  const loadGroupNames = useCallback(async () => {
    if (!accessToken) return;
    try {
      const response = await lionTvApi.get('/potential-customers/v1/groups', {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: {
          search: debouncedSearch || undefined,
          status: statusFilter || undefined,
          category: categoryFilter || undefined
        },
        skipAuthRedirect: true
      });

      const payload = response?.data?.data ?? response?.data ?? {};
      const collection = Array.isArray(payload) ? payload : payload.data ?? payload.items ?? payload.content ?? [];
      setGroupNameOptions((Array.isArray(collection) ? collection : []).filter(Boolean));
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || err.message || t('potentialCustomers.messages.groupLoadError', 'Could not load name groups.'), {
          variant: 'error'
        });
      }
    }
  }, [accessToken, categoryFilter, debouncedSearch, enqueueSnackbar, statusFilter, t]);

  useEffect(() => {
    loadPotentialCustomers();
  }, [loadPotentialCustomers, refreshKey]);

  useEffect(() => {
    loadGroupNames();
  }, [loadGroupNames, refreshKey]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    if (page !== 0) {
      setPage(0);
    }
  }, [debouncedSearch, statusFilter, categoryFilter, groupNameFilter]);

  const handleFormChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const resetForm = () => setForm(defaultForm);

  const handleEdit = (row) => {
    setForm({
      potentialCustomerId: row.potentialCustomerId || null,
      fullName: row.fullName || '',
      email: row.email || '',
      phone: row.phone || '',
      country: (row.country || '').toUpperCase(),
      category: row.category || 'GENERAL',
      status: row.status || 'NEW'
    });
    setOpenModal(true);
  };

  const handleDelete = (row) => {
    setOpenDelete({ open: true, row });
  };

  const buildPayload = (source) => ({
    fullName: source?.fullName?.trim() || '',
    email: source?.email?.trim() || EMAIL_FALLBACK,
    phone: source?.phone?.trim() || null,
    country: (source?.country || '').toUpperCase() || null,
    category: source?.category || 'GENERAL',
    status: source?.status || 'NEW'
  });

  const handleMarkContacted = async (row) => {
    const id = row?.potentialCustomerId;
    if (!id) return;

    if ((row?.status || '').toUpperCase() === 'CONTACTED') {
      enqueueSnackbar(t('potentialCustomers.messages.alreadyContacted'), { variant: 'info' });
      return;
    }

    setSending(true);
    try {
      await lionTvApi.put(
        `/potential-customers/v1/${id}`,
        {
          ...buildPayload(row),
          status: 'CONTACTED'
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          skipAuthRedirect: true
        }
      );
      enqueueSnackbar(t('potentialCustomers.messages.markContactedSuccess'), { variant: 'success' });
      setRefreshKey((v) => v + 1);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || err.message || t('potentialCustomers.messages.markContactedError'), {
          variant: 'error'
        });
      }
    } finally {
      setSending(false);
    }
  };

  const handleWhatsApp = (row) => {
    const phone = normalizePhoneForWhatsApp(row?.phone, row?.country);
    if (!phone) {
      enqueueSnackbar(t('potentialCustomers.messages.invalidWhatsAppPhone'), { variant: 'warning' });
      return;
    }

    const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(whatsAppMessage)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const downloadWhatsAppCsv = useCallback(
    async (groupBy) => {
      setExportAnchorEl(null);
      setExporting(true);

      try {
        const response = await lionTvApi.get('/potential-customers/v1/export', {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: {
            search: debouncedSearch || undefined,
            status: statusFilter || undefined,
            category: categoryFilter || undefined,
            groupName: groupNameFilter || undefined
          },
          skipAuthRedirect: true
        });

        const payload = response?.data?.data ?? response?.data ?? [];
        const exportRows = (Array.isArray(payload) ? payload : []).map(normalizePotential);

        if (!exportRows.length) {
          enqueueSnackbar(t('potentialCustomers.messages.exportEmpty', 'There are no records to export with the current filters.'), {
            variant: 'warning'
          });
          return;
        }

        const csvContent = exportRows
          .map((row) => {
            const phone = normalizePhoneForWhatsApp(row?.phone, row?.country);
            if (!phone) return null;

            const label =
              groupBy === 'category'
                ? optionLabel(categoryOptions, row.category, row.category || 'GENERAL')
                : sanitizeCsvCell(row.fullName || t('potentialCustomers.export.fallbackName', 'Prospect'));

            return `${sanitizeCsvCell(phone)},${sanitizeCsvCell(label)}`;
          })
          .filter(Boolean)
          .join('\n');

        if (!csvContent) {
          enqueueSnackbar(
            t(
              'potentialCustomers.messages.exportNoPhones',
              'The filtered records do not have valid phones to export or they already belong to registered customers.'
            ),
            {
              variant: 'warning'
            }
          );
          return;
        }

        const fileSuffix =
          groupBy === 'category'
            ? t('potentialCustomers.export.fileSuffixCategory', 'by-category')
            : t('potentialCustomers.export.fileSuffixName', 'by-name');
        const fileName = `potential-customers-whatsapp-${fileSuffix}-${new Date().toISOString().slice(0, 10)}.csv`;
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        enqueueSnackbar(
          t('potentialCustomers.messages.exportSuccess', {
            count: csvContent.split('\n').filter(Boolean).length,
            defaultValue: 'CSV exported with {{count}} records.'
          }),
          { variant: 'success' }
        );
      } catch (err) {
        if (!handleUnauthorized(err)) {
          enqueueSnackbar(err?.response?.data?.message || err.message || t('potentialCustomers.messages.exportError', 'Could not export the WhatsApp CSV.'), {
            variant: 'error'
          });
        }
      } finally {
        setExporting(false);
      }
    },
    [accessToken, categoryFilter, categoryOptions, debouncedSearch, enqueueSnackbar, groupNameFilter, statusFilter, t]
  );

  const handleOpenImportPicker = () => {
    fileInputRef.current?.click();
  };

  const handleImportDefaultChange = (field) => (event) => {
    setImportDefaults((previous) => ({ ...previous, [field]: event.target.value }));
  };

  const handleImportFileSelected = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;

    try {
      const text = await file.text();
      const parsedRows = parseWhatsAppImportCsv(text);

      if (!parsedRows.length) {
        enqueueSnackbar(t('potentialCustomers.messages.importInvalidFile', 'The selected file does not contain valid WhatsApp rows.'), {
          variant: 'warning'
        });
        return;
      }

      setImportDialog({
        open: true,
        fileName: file.name,
        rows: parsedRows
      });
    } catch (error) {
      enqueueSnackbar(
        t('potentialCustomers.messages.importParsingError', 'The CSV file could not be parsed. Check the format and try again.'),
        { variant: 'error' }
      );
    }
  };

  const handleCloseImportDialog = () => {
    if (importing) return;
    setImportDialog({ open: false, fileName: '', rows: [] });
  };

  const handleConfirmImport = async () => {
    if (!importDialog.rows.length) {
      enqueueSnackbar(t('potentialCustomers.messages.importInvalidFile', 'The selected file does not contain valid WhatsApp rows.'), {
        variant: 'warning'
      });
      return;
    }

    setImporting(true);
    try {
      const response = await lionTvApi.post(
        '/potential-customers/v1/import',
        {
          rows: importDialog.rows,
          defaultCountry: importDefaults.defaultCountry || 'HN',
          defaultCategory: importDefaults.defaultCategory || 'SOCIAL_MEDIA',
          defaultStatus: 'NEW',
          fallbackName: t('potentialCustomers.import.fallbackName', 'WhatsApp Lead')
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          skipAuthRedirect: true
        }
      );

      const payload = response?.data?.data ?? response?.data ?? {};
      enqueueSnackbar(
        t('potentialCustomers.messages.importSuccess', {
          inserted: payload.insertedRows ?? 0,
          skipped: payload.skippedExistingRows ?? 0,
          skippedCustomers: payload.skippedCustomerRows ?? 0,
          invalid: payload.invalidRows ?? 0,
          defaultValue:
            'Import finished. Inserted {{inserted}}, skipped existing leads {{skipped}}, skipped customers {{skippedCustomers}}, invalid {{invalid}}.'
        }),
        { variant: 'success' }
      );

      handleCloseImportDialog();
      setRefreshKey((value) => value + 1);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || err.message || t('potentialCustomers.messages.importError'), {
          variant: 'error'
        });
      }
    } finally {
      setImporting(false);
    }
  };

  const handleSave = async () => {
    if (!form.fullName) {
      enqueueSnackbar(t('potentialCustomers.messages.requiredName'), { variant: 'warning' });
      return;
    }

    const payload = {
      fullName: form.fullName.trim(),
      email: form.email?.trim() || EMAIL_FALLBACK,
      phone: form.phone?.trim() || null,
      country: (form.country || '').toUpperCase() || null,
      category: form.category || 'GENERAL',
      status: form.status || 'NEW'
    };

    setSending(true);
    try {
      if (form.potentialCustomerId) {
        await lionTvApi.put(`/potential-customers/v1/${form.potentialCustomerId}`, payload, {
          headers: { Authorization: `Bearer ${accessToken}` },
          skipAuthRedirect: true
        });
        enqueueSnackbar(t('potentialCustomers.messages.updated'), { variant: 'success' });
      } else {
        await lionTvApi.post('/potential-customers/v1', payload, {
          headers: { Authorization: `Bearer ${accessToken}` },
          skipAuthRedirect: true
        });
        enqueueSnackbar(t('potentialCustomers.messages.created'), { variant: 'success' });
      }
      setOpenModal(false);
      resetForm();
      setRefreshKey((v) => v + 1);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || err.message || t('potentialCustomers.messages.saveError'), {
          variant: 'error'
        });
      }
    } finally {
      setSending(false);
    }
  };

  const hasUsableEmail = (row) => {
    const email = String(row?.email || '')
      .trim()
      .toLowerCase();
    return Boolean(email) && email !== EMAIL_FALLBACK.toLowerCase() && email.includes('@');
  };

  const handlePotentialEmailAction = async (row, notificationKey) => {
    const id = row?.potentialCustomerId;
    if (!id) return;

    if (!hasUsableEmail(row)) {
      enqueueSnackbar(t('potentialCustomers.messages.missingRealEmail', 'This prospect does not have a usable email.'), {
        variant: 'warning'
      });
      return;
    }

    const path =
      notificationKey === 'paymentFailed'
        ? `/potential-customers/v1/${id}/notifications/payment-failed`
        : `/potential-customers/v1/${id}/notifications/abandoned-cart`;

    const successKey =
      notificationKey === 'paymentFailed'
        ? 'potentialCustomers.messages.paymentFailedSent'
        : 'potentialCustomers.messages.abandonedCartSent';

    const errorKey =
      notificationKey === 'paymentFailed'
        ? 'potentialCustomers.messages.paymentFailedError'
        : 'potentialCustomers.messages.abandonedCartError';

    setSending(true);
    try {
      await lionTvApi.post(
        path,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          skipAuthRedirect: true
        }
      );
      enqueueSnackbar(t(successKey), { variant: 'success' });
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || err.message || t(errorKey), {
          variant: 'error'
        });
      }
    } finally {
      setSending(false);
    }
  };

  const handleSendPaymentFailedEmail = (row) => handlePotentialEmailAction(row, 'paymentFailed');

  const handleSendAbandonedCartEmail = (row) => handlePotentialEmailAction(row, 'abandonedCart');

  const confirmDelete = async () => {
    const id = openDelete.row?.potentialCustomerId;
    if (!id) {
      setOpenDelete({ open: false, row: null });
      return;
    }
    setSending(true);
    try {
      await lionTvApi.delete(`/potential-customers/v1/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        skipAuthRedirect: true
      });
      enqueueSnackbar(t('potentialCustomers.messages.deleted'), { variant: 'success' });
      setOpenDelete({ open: false, row: null });
      setRefreshKey((v) => v + 1);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || err.message || t('potentialCustomers.messages.deleteError'), {
          variant: 'error'
        });
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 1400, mx: 'auto' }}>
      <input ref={fileInputRef} type="file" accept=".csv,text/csv" hidden onChange={handleImportFileSelected} />
      <MainCard
        title={t('potentialCustomers.title', 'Potential Customers')}
        secondary={
          <ResponsiveActionBar>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => setRefreshKey((v) => v + 1)}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                px: 2
              }}
            >
              {t('actions.refresh')}
            </Button>
            <Button
              variant="outlined"
              startIcon={<FileDownloadOutlinedIcon />}
              onClick={(event) => setExportAnchorEl(event.currentTarget)}
              disabled={exporting}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                px: 2
              }}
            >
              {t('potentialCustomers.actions.exportWhatsappCsv', 'Exportar CSV WhatsApp')}
            </Button>
            <Button
              variant="outlined"
              startIcon={<CloudUploadOutlinedIcon />}
              onClick={handleOpenImportPicker}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                px: 2
              }}
            >
              {t('potentialCustomers.actions.importWhatsappCsv', 'Import WhatsApp CSV')}
            </Button>
            <Button
              variant="contained"
              startIcon={<PersonAddAlt1Icon />}
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
              fullWidth={isMobile}
            >
              {t('potentialCustomers.actions.new', 'Nuevo potencial')}
            </Button>
          </ResponsiveActionBar>
        }
      >
        <ResponsiveMetricGrid columns={{ xs: 1, md: 2, lg: 4 }}>
          {[
            { icon: <GroupIcon fontSize="small" />, title: t('potentialCustomers.kpi.total'), value: total, helper: t('potentialCustomers.title'), color: 'primary' },
            {
              icon: <InfoOutlinedIcon fontSize="small" />,
              title: t('potentialCustomers.kpi.new'),
              value: summary.newCount,
              helper: t('potentialCustomers.filters.status', 'Status'),
              color: 'info'
            },
            {
              icon: <ContactPhoneOutlinedIcon fontSize="small" />,
              title: t('potentialCustomers.kpi.contacted'),
              value: summary.contacted,
              helper: t('potentialCustomers.headers.phone', 'Phone activity'),
              color: 'warning'
            },
            {
              icon: <TrendingUpOutlinedIcon fontSize="small" />,
              title: t('potentialCustomers.kpi.converted'),
              value: summary.converted,
              helper: t('potentialCustomers.headers.category', 'Category pipeline'),
              color: 'success'
            }
          ].map((item, idx) => (
            <LionMetricCard {...item} key={idx} />
          ))}
        </ResponsiveMetricGrid>
      </MainCard>

      <MainCard title={t('potentialCustomers.search', 'Buscar potenciales')}>
        <ResponsiveFilters paperSx={{ mb: 2 }}>
            <TextField
              size="small"
              placeholder={t('potentialCustomers.searchPlaceholder', 'Buscar por nombre, correo, teléfono, país')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
              sx={{ '& .MuiOutlinedInput-root': { minHeight: 46, borderRadius: 2 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                )
              }}
            />
            <FormControl size="small" sx={{ minWidth: 220, '& .MuiOutlinedInput-root': { minHeight: 46, borderRadius: 2 } }}>
              <InputLabel>{t('potentialCustomers.filters.status', 'Estado')}</InputLabel>
              <Select value={statusFilter} label={t('potentialCustomers.filters.status', 'Estado')} onChange={(e) => setStatusFilter(e.target.value)}>
                <MenuItem value="">
                  <em>{t('invoices.filters.all', 'All')}</em>
                </MenuItem>
                {statusOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 220, '& .MuiOutlinedInput-root': { minHeight: 46, borderRadius: 2 } }}>
              <InputLabel>{t('potentialCustomers.filters.category', 'Categoría')}</InputLabel>
              <Select value={categoryFilter} label={t('potentialCustomers.filters.category', 'Categoría')} onChange={(e) => setCategoryFilter(e.target.value)}>
                <MenuItem value="">
                  <em>{t('invoices.filters.all', 'All')}</em>
                </MenuItem>
                {categoryOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 240, '& .MuiOutlinedInput-root': { minHeight: 46, borderRadius: 2 } }}>
              <InputLabel>{t('potentialCustomers.filters.groupName', 'Grupo por nombre')}</InputLabel>
              <Select value={groupNameFilter} label={t('potentialCustomers.filters.groupName', 'Grupo por nombre')} onChange={(e) => setGroupNameFilter(e.target.value)}>
                <MenuItem value="">
                  <em>{t('invoices.filters.all', 'All')}</em>
                </MenuItem>
                {groupNameOptions.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
        </ResponsiveFilters>

        <ResponsiveEntityView
          isMobile={isMobile}
          mobileContent={
            loading ? (
              <Stack spacing={1.5}>
                {Array.from({ length: 4 }).map((_, idx) => (
                  <Skeleton key={`potential-mobile-${idx}`} variant="rounded" height={210} />
                ))}
              </Stack>
            ) : rows.length ? (
              <Stack spacing={1.5}>
                {rows.map((row) => (
                  <MobileSummaryCard
                    key={row.potentialCustomerId}
                    icon={
                      <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.light', color: 'primary.dark' }}>
                        <AutoAwesomeIcon fontSize="small" />
                      </Avatar>
                    }
                    title={row.fullName || '-'}
                    subtitle={row.email || '-'}
                    chips={[
                      <StatusChip key="status" status={row.status} />,
                      <Chip key="category" size="small" variant="outlined" label={optionLabel(categoryOptions, row.category, row.category || '-')} />
                    ]}
                    actions={
                      <ResponsiveActionBar>
                        <Button size="small" variant="outlined" onClick={() => handleEdit(row)}>
                          {t('actions.edit')}
                        </Button>
                        <RowActions
                          row={row}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                          onWhatsApp={handleWhatsApp}
                          onMarkContacted={handleMarkContacted}
                          onSendPaymentFailedEmail={handleSendPaymentFailedEmail}
                          onSendAbandonedCartEmail={handleSendAbandonedCartEmail}
                        />
                      </ResponsiveActionBar>
                    }
                  >
                    <MobileFieldGrid
                      fields={[
                        { label: t('potentialCustomers.headers.phone', 'Teléfono'), value: row.phone || '-' },
                        { label: t('potentialCustomers.headers.country', 'País'), value: formatCountryLabel(row.country, isoCountryOptions) },
                        { label: t('potentialCustomers.headers.createdAt', 'Creado'), value: formatDateTime(row.createdAt, uiLanguage) }
                      ]}
                    />
                  </MobileSummaryCard>
                ))}
              </Stack>
            ) : (
              <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
                <Typography variant="subtitle1">{t('potentialCustomers.empty', 'No hay clientes potenciales registrados.')}</Typography>
              </Paper>
            )
          }
          desktopContent={
            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 14px 32px rgba(0,0,0,0.08)' }}>
              <Table size="small" sx={{ minWidth: { xs: 1020, md: '100%' } }}>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('potentialCustomers.headers.name', 'Nombre')}</TableCell>
                    <TableCell>{t('potentialCustomers.headers.email', 'Correo')}</TableCell>
                    <TableCell>{t('potentialCustomers.headers.phone', 'Teléfono')}</TableCell>
                    <TableCell>{t('potentialCustomers.headers.country', 'País')}</TableCell>
                    <TableCell>{t('potentialCustomers.headers.category', 'Categoría')}</TableCell>
                    <TableCell>{t('potentialCustomers.headers.status', 'Estado')}</TableCell>
                    <TableCell>{t('potentialCustomers.headers.createdAt', 'Creado')}</TableCell>
                    <TableCell align="right">{t('potentialCustomers.headers.actions', 'Acciones')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading &&
                    Array.from({ length: 4 }).map((_, idx) => (
                      <TableRow key={`skeleton-${idx}`}>
                        {Array.from({ length: 8 }).map((__, cidx) => (
                          <TableCell key={cidx}>
                            <Skeleton variant="text" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}

                  {!loading &&
                    rows.map((row) => (
                      <TableRow key={row.potentialCustomerId} hover>
                        <TableCell>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Avatar sx={{ width: 30, height: 30, bgcolor: 'primary.light', color: 'primary.dark' }}>
                              <AutoAwesomeIcon fontSize="small" />
                            </Avatar>
                            <Typography variant="subtitle2">{row.fullName || '-'}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <MailOutlineIcon fontSize="small" color="action" />
                            <Typography variant="body2">{row.email || '-'}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <PhoneIphoneIcon fontSize="small" color="action" />
                            <Typography variant="body2">{row.phone || '-'}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <PublicIcon fontSize="small" color="action" />
                            <Typography variant="body2">{formatCountryLabel(row.country, isoCountryOptions)}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Chip size="small" variant="outlined" label={optionLabel(categoryOptions, row.category, row.category || '-')} />
                        </TableCell>
                        <TableCell>
                          <StatusChip status={row.status} />
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <CalendarMonthIcon fontSize="small" color="action" />
                            <Typography variant="body2">{formatDateTime(row.createdAt, uiLanguage)}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="right">
                          <RowActions
                            row={row}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onWhatsApp={handleWhatsApp}
                            onMarkContacted={handleMarkContacted}
                            onSendPaymentFailedEmail={handleSendPaymentFailedEmail}
                            onSendAbandonedCartEmail={handleSendAbandonedCartEmail}
                          />
                        </TableCell>
                      </TableRow>
                    ))}

                  {!loading && rows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        {t('potentialCustomers.empty', 'No hay clientes potenciales registrados.')}
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
              count={total}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={(e, p) => setPage(p)}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
            />
          }
          showDivider={!isMobile}
        />
      </MainCard>

      <Menu anchorEl={exportAnchorEl} open={exportMenuOpen} onClose={() => setExportAnchorEl(null)}>
        <MenuItem onClick={() => downloadWhatsAppCsv('name')}>
          {t('potentialCustomers.export.byName', 'Exportar agrupado por nombre')}
        </MenuItem>
        <MenuItem onClick={() => downloadWhatsAppCsv('category')}>
          {t('potentialCustomers.export.byCategory', 'Exportar agrupado por categoría')}
        </MenuItem>
      </Menu>

      <Dialog open={importDialog.open} onClose={handleCloseImportDialog} fullWidth maxWidth="sm" fullScreen={isMobile}>
        <DialogTitleWithClose onClose={handleCloseImportDialog}>
          <Stack spacing={0.5}>
            <Typography variant="h6">{t('potentialCustomers.import.title', 'Import WhatsApp CSV')}</Typography>
            <Typography variant="body2" color="text.secondary">
              {t(
                'potentialCustomers.import.subtitle',
                'Upload a phone,group file and the platform will create prospects only for the authenticated user.'
              )}
            </Typography>
          </Stack>
        </DialogTitleWithClose>
        <DialogContent dividers sx={{ bgcolor: 'background.default' }}>
          <Stack spacing={2}>
            <Card sx={{ ...sectionSx, p: 2 }}>
              <Stack spacing={1.5}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
                  <Typography variant="subtitle2">{t('potentialCustomers.import.fileName', 'Selected file')}</Typography>
                  <Chip size="small" color="primary" label={importDialog.fileName || '-'} />
                </Stack>
                <Grid container spacing={1.5}>
                  <Grid item xs={12} sm={6}>
                    <Card sx={{ ...glassCard(theme), p: 1.75 }}>
                      <Typography variant="caption" color="text.secondary">
                        {t('potentialCustomers.import.rowsDetected', 'Rows detected')}
                      </Typography>
                      <Typography variant="h4">{importPreview.detectedRows}</Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Card sx={{ ...glassCard(theme), p: 1.75 }}>
                      <Typography variant="caption" color="text.secondary">
                        {t('potentialCustomers.import.groupsDetected', 'Groups detected')}
                      </Typography>
                      <Typography variant="h4">{importPreview.detectedGroups}</Typography>
                    </Card>
                  </Grid>
                </Grid>
                <Typography variant="caption" color="text.secondary">
                  {t(
                    'potentialCustomers.import.helper',
                    'Existing phones for the same user are skipped automatically. Categories are inferred from the group label when possible.'
                  )}
                </Typography>
              </Stack>
            </Card>

            <Card sx={{ ...sectionSx, p: 2 }}>
              <Stack spacing={1.5}>
                <Typography variant="subtitle2">{t('potentialCustomers.import.defaults', 'Import defaults')}</Typography>
                <Grid container spacing={1.5}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel>{t('potentialCustomers.import.defaultCountry', 'Default country')}</InputLabel>
                      <Select
                        value={importDefaults.defaultCountry}
                        label={t('potentialCustomers.import.defaultCountry', 'Default country')}
                        onChange={handleImportDefaultChange('defaultCountry')}
                      >
                        {isoCountryOptions.map((country) => (
                          <MenuItem key={country.value} value={country.value}>
                            {country.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel>{t('potentialCustomers.import.defaultCategory', 'Default category')}</InputLabel>
                      <Select
                        value={importDefaults.defaultCategory}
                        label={t('potentialCustomers.import.defaultCategory', 'Default category')}
                        onChange={handleImportDefaultChange('defaultCategory')}
                      >
                        {categoryOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Stack>
            </Card>

            <Card sx={{ ...sectionSx, p: 2 }}>
              <Stack spacing={1.25}>
                <Typography variant="subtitle2">{t('potentialCustomers.import.preview', 'Preview groups')}</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {importPreview.topGroups.length ? (
                    importPreview.topGroups.map(([label, count]) => (
                      <Chip key={label} variant="outlined" label={`${label} · ${count}`} />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      {t('potentialCustomers.import.noGroups', 'No groups detected in the file.')}
                    </Typography>
                  )}
                </Stack>
              </Stack>
            </Card>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button variant="outlined" onClick={handleOpenImportPicker} disabled={importing}>
            {t('potentialCustomers.import.changeFile', 'Choose another file')}
          </Button>
          <Button onClick={handleCloseImportDialog} disabled={importing}>
            {t('actions.cancel', 'Cancel')}
          </Button>
          <Button
            variant="contained"
            startIcon={<CloudUploadOutlinedIcon />}
            onClick={handleConfirmImport}
            disabled={importing || !importDialog.rows.length}
          >
            {importing ? t('potentialCustomers.import.importing', 'Importing...') : t('potentialCustomers.import.confirm', 'Import now')}
          </Button>
        </DialogActions>
      </Dialog>

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
            borderColor: form.potentialCustomerId ? theme.palette.warning.light : theme.palette.primary.light,
            backgroundImage:
              theme.palette.mode === 'light'
                ? `linear-gradient(150deg, ${theme.palette.primary.light}18 0%, ${theme.palette.secondary.light}10 45%, ${theme.palette.background.paper} 100%)`
                : undefined
          })
        }}
      >
        <DialogTitleWithClose
          onClose={() => setOpenModal(false)}
          sx={(theme) => ({
            position: 'relative',
            pb: 1,
            background: form.potentialCustomerId
              ? `linear-gradient(135deg, ${theme.palette.warning.light}40 0%, ${theme.palette.secondary.light}20 45%, ${theme.palette.background.paper} 100%)`
              : `linear-gradient(135deg, ${theme.palette.primary.light}40 0%, ${theme.palette.secondary.light}20 45%, ${theme.palette.background.paper} 100%)`
          })}
        >
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Avatar
              sx={{
                bgcolor: form.potentialCustomerId ? 'warning.main' : 'primary.main',
                color: 'primary.contrastText',
                width: 40,
                height: 40,
                boxShadow: 3
              }}
            >
              <PersonAddAlt1Icon fontSize="small" />
            </Avatar>
            <Box>
              <Typography variant="h6">
                {form.potentialCustomerId
                  ? t('potentialCustomers.actions.edit', 'Editar cliente potencial')
                  : t('potentialCustomers.actions.new', 'Nuevo cliente potencial')}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t('potentialCustomers.subtitle', 'Registra y da seguimiento a contactos interesados.')}
              </Typography>
            </Box>
            <Chip
              label={form.potentialCustomerId ? t('common.edit', 'Edit') : t('common.new', 'New')}
              size="small"
              color={form.potentialCustomerId ? 'warning' : 'primary'}
              variant="filled"
              sx={{ ml: 'auto', fontWeight: 700, borderRadius: 1.5 }}
            />
          </Stack>
        </DialogTitleWithClose>

        <DialogContent
          dividers
          sx={{
            bgcolor: 'background.default',
            px: { xs: 1.5, sm: 3 },
            py: { xs: 1.5, sm: 2 },
            background: (theme) =>
              theme.palette.mode === 'light'
                ? `linear-gradient(180deg, ${theme.palette.primary.light}18 0%, ${theme.palette.secondary.light}10 60%, ${theme.palette.background.paper} 85%)`
                : theme.palette.surface.card,
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
          <Stack spacing={2} sx={{ position: 'relative', zIndex: 1 }}>
            <FormSection title={t('potentialCustomers.form.identity', 'Identidad')} helper={t('potentialCustomers.form.identityHelper', 'Datos principales del contacto')}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    label={t('potentialCustomers.headers.name', 'Nombre')}
                    value={form.fullName}
                    onChange={handleFormChange('fullName')}
                    fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonAddAlt1Icon fontSize="small" color="primary" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label={t('potentialCustomers.headers.email', 'Correo')}
                    value={form.email}
                    onChange={handleFormChange('email')}
                    helperText={t('potentialCustomers.emailDefault', 'Si lo dejas vacío se guardará nomail@gmail.com')}
                    fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MailOutlineIcon fontSize="small" color="secondary" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label={t('potentialCustomers.headers.phone', 'Teléfono')}
                    value={form.phone}
                    onChange={handleFormChange('phone')}
                    fullWidth
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIphoneIcon fontSize="small" color="info" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth sx={fieldSx}>
                    <InputLabel>{t('potentialCustomers.headers.country', 'País (ISO)')}</InputLabel>
                    <Select
                      value={form.country || ''}
                      label={t('potentialCustomers.headers.country', 'País (ISO)')}
                      onChange={handleFormChange('country')}
                      startAdornment={
                        <InputAdornment position="start">
                          <PublicIcon fontSize="small" color="success" />
                        </InputAdornment>
                      }
                      MenuProps={{ PaperProps: { sx: { maxHeight: 320 } } }}
                    >
                      <MenuItem value="">
                        <em>{t('potentialCustomers.selectCountry', 'Seleccionar país')}</em>
                      </MenuItem>
                      {form.country && !isoCountryOptions.some((country) => country.value === form.country) ? (
                        <MenuItem value={form.country}>{form.country}</MenuItem>
                      ) : null}
                      {isoCountryOptions.map((country) => (
                        <MenuItem key={country.value} value={country.value}>
                          {country.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </FormSection>

            <FormSection
              title={t('potentialCustomers.form.classification', 'Clasificación')}
              helper={t('potentialCustomers.form.classificationHelper', 'Categoriza y define estado comercial')}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth sx={fieldSx}>
                    <InputLabel>{t('potentialCustomers.headers.category', 'Categoría')}</InputLabel>
                    <Select
                      value={form.category}
                      label={t('potentialCustomers.headers.category', 'Categoría')}
                      onChange={handleFormChange('category')}
                      startAdornment={
                        <InputAdornment position="start">
                          <CategoryIcon fontSize="small" color="warning" />
                        </InputAdornment>
                      }
                    >
                      {categoryOptions.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth sx={fieldSx}>
                    <InputLabel>{t('potentialCustomers.headers.status', 'Estado')}</InputLabel>
                    <Select
                      value={form.status}
                      label={t('potentialCustomers.headers.status', 'Estado')}
                      onChange={handleFormChange('status')}
                      startAdornment={
                        <InputAdornment position="start">
                          <InfoOutlinedIcon fontSize="small" color="action" />
                        </InputAdornment>
                      }
                    >
                      {statusOptions.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </FormSection>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button variant="outlined" onClick={resetForm} disabled={sending} sx={{ borderRadius: 2 }} startIcon={<RefreshIcon />}>
            {t('actions.clear', 'Limpiar')}
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={sending}
            startIcon={<RocketLaunchIcon />}
            sx={{ borderRadius: 2, boxShadow: '0 12px 28px rgba(0,0,0,0.16)', px: 2.4 }}
          >
            {sending ? t('actions.saving', 'Guardando...') : form.potentialCustomerId ? t('actions.save', 'Guardar cambios') : t('actions.create', 'Crear')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDelete.open} onClose={() => setOpenDelete({ open: false, row: null })} maxWidth="xs" fullWidth fullScreen={isMobile}>
        <DialogTitleWithClose onClose={() => setOpenDelete({ open: false, row: null })}>
          <Typography variant="h6">{t('potentialCustomers.deleteTitle', 'Eliminar cliente potencial')}</Typography>
        </DialogTitleWithClose>
        <DialogContent dividers>
          <Typography>
            {t('potentialCustomers.deleteBody', {
              defaultValue: '¿Eliminar a {{name}}?',
              name: openDelete.row?.fullName || ''
            })}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete({ open: false, row: null })} disabled={sending}>
            {t('actions.cancel', 'Cancelar')}
          </Button>
          <Button color="error" variant="contained" onClick={confirmDelete} disabled={sending}>
            {sending ? t('actions.deleting', 'Eliminando...') : t('actions.delete', 'Eliminar')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
