import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import useAuth from 'hooks/useAuth';
import { useTranslation } from 'react-i18next';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Switch from '@mui/material/Switch';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useMediaQuery, useTheme } from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CancelScheduleSendRoundedIcon from '@mui/icons-material/CancelScheduleSendRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PersonSearchRoundedIcon from '@mui/icons-material/PersonSearchRounded';
import PreviewRoundedIcon from '@mui/icons-material/PreviewRounded';
import RefreshIcon from '@mui/icons-material/Refresh';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import ScheduleSendRoundedIcon from '@mui/icons-material/ScheduleSendRounded';
import SearchIcon from '@mui/icons-material/Search';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';

import MainCard from 'ui-component/cards/MainCard';
import DialogTitleWithClose from 'ui-component/dialogs/DialogTitleWithClose';
import MobileSummaryCard from 'ui-component/responsive/MobileSummaryCard';
import ResponsiveActionBar from 'ui-component/responsive/ResponsiveActionBar';
import ResponsiveFilters from 'ui-component/responsive/ResponsiveFilters';
import ResponsiveMetricGrid from 'ui-component/responsive/ResponsiveMetricGrid';
import {
  createEmailCampaign,
  getEmailCampaign,
  getEmailTemplate,
  listEmailCampaignRecipients,
  listEmailCampaigns,
  listEmailTemplates,
  previewEmailCampaign,
  queueEmailCampaign,
  cancelEmailCampaign,
  searchEmailCampaignCustomers,
  sendEmailCampaignTest,
  updateEmailCampaign
} from 'api/email-campaigns';
import { lionTvApi, shopifyDemosApi } from 'utils/api';

const fieldSx = {
  '& .MuiInputBase-root': { borderRadius: 2, minHeight: 48 },
  '& .MuiInputLabel-root': { fontWeight: 500 }
};

const campaignStatuses = ['ALL', 'DRAFT', 'READY', 'SENDING', 'SENT', 'FAILED', 'CANCELLED'];
const recipientStatuses = ['ALL', 'PENDING', 'SENT', 'FAILED', 'SKIPPED'];
const sendTypes = ['IMMEDIATE', 'SCHEDULED'];
const customerModes = ['MIXED', 'FILTERED', 'SELECTED'];
const customerStatusOptions = ['', 'ACTIVE', 'INACTIVE', 'SUSPENDED', 'BLOCKED'];
const commonChannels = ['', 'WEB', 'SOCIAL_MEDIA', 'REFERRAL', 'GOOGLE', 'WHATSAPP'];
const IMPORTABLE_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
const BLOCKED_IMPORTED_EMAILS = new Set(['nomail@gmail.com', 'notiene@gmail.com']);

function createEmptyAudience() {
  return {
    customerSelection: {
      mode: 'MIXED',
      filters: {
        status: '',
        channel: '',
        search: '',
        fromDate: '',
        toDate: ''
      },
      selectedCustomerIds: []
    },
    externalRecipients: []
  };
}

function createEmptyCampaignForm() {
  return {
    name: '',
    templateId: '',
    sendType: 'IMMEDIATE',
    scheduledAt: '',
    variableValues: {},
    audience: createEmptyAudience(),
    externalRecipientsText: '',
    testEmail: ''
  };
}

function normalizeTextValue(value) {
  if (value === null || value === undefined) return '';
  const normalized = String(value).trim();
  if (!normalized) return '';
  const lower = normalized.toLowerCase();
  if (lower === 'null' || lower === 'undefined') return '';
  return normalized;
}

function normalizeOptionValue(value, allowedOptions = []) {
  const normalized = normalizeTextValue(value).toUpperCase();
  if (!normalized || normalized === 'ALL') return '';
  return allowedOptions.includes(normalized) ? normalized : '';
}

function normalizeDateFilterValue(value) {
  if (!value) return '';
  if (Array.isArray(value) && value.length >= 3) {
    const [year, month, day] = value.map((item) => Number(item));
    if ([year, month, day].every((item) => Number.isInteger(item) && item > 0)) {
      return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
    return '';
  }
  if (typeof value === 'object') {
    const year = Number(value.year);
    const month = Number(value.monthValue ?? value.month);
    const day = Number(value.dayOfMonth ?? value.day);
    if ([year, month, day].every((item) => Number.isInteger(item) && item > 0)) {
      return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
    return '';
  }
  const normalized = normalizeTextValue(value);
  if (!normalized) return '';
  const match = normalized.match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : '';
}

function normalizeSelectedCustomerIds(values) {
  return Array.from(
    new Set(
      (Array.isArray(values) ? values : [])
        .map((value) => Number(value))
        .filter((value) => Number.isInteger(value) && value > 0)
    )
  );
}

function normalizeExternalRecipients(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((recipient) => ({
      email: normalizeTextValue(recipient?.email).toLowerCase(),
      fullName: normalizeTextValue(recipient?.fullName) || null
    }))
    .filter((recipient) => recipient.email);
}

function parseAudienceDefinition(audienceDefinitionJson) {
  if (!audienceDefinitionJson) return createEmptyAudience();
  try {
    const parsed = typeof audienceDefinitionJson === 'string' ? JSON.parse(audienceDefinitionJson) : audienceDefinitionJson;
    const filters = parsed?.customerSelection?.filters || {};
    const mode = normalizeOptionValue(parsed?.customerSelection?.mode, customerModes) || 'MIXED';
    return {
      customerSelection: {
        mode,
        filters: {
          status: normalizeOptionValue(filters.status, customerStatusOptions),
          channel: normalizeOptionValue(filters.channel, commonChannels),
          search: normalizeTextValue(filters.search),
          fromDate: normalizeDateFilterValue(filters.fromDate),
          toDate: normalizeDateFilterValue(filters.toDate)
        },
        selectedCustomerIds: normalizeSelectedCustomerIds(parsed?.customerSelection?.selectedCustomerIds)
      },
      externalRecipients: normalizeExternalRecipients(parsed?.externalRecipients)
    };
  } catch {
    return createEmptyAudience();
  }
}

function parseExternalRecipients(text = '') {
  const seen = new Set();
  const rows = [];
  String(text)
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean)
    .forEach((item) => {
      let email = item;
      let fullName = '';
      const match = item.match(/^(.*)<([^>]+)>$/);
      if (match) {
        fullName = match[1].trim().replace(/^"|"$/g, '');
        email = match[2].trim();
      }
      const normalizedEmail = String(email || '').trim().toLowerCase();
      if (!normalizedEmail || seen.has(normalizedEmail)) return;
      seen.add(normalizedEmail);
      rows.push({ email: normalizedEmail, fullName: fullName || null });
    });
  return rows;
}

function buildExternalRecipientsText(externalRecipients = []) {
  return externalRecipients
    .map((recipient) => (recipient?.fullName ? `${recipient.fullName} <${recipient.email}>` : recipient?.email || ''))
    .filter(Boolean)
    .join('\n');
}

function normalizeImportedRecipient(email, fullName) {
  const normalizedEmail = normalizeTextValue(email).toLowerCase();
  if (!normalizedEmail || !IMPORTABLE_EMAIL_PATTERN.test(normalizedEmail) || BLOCKED_IMPORTED_EMAILS.has(normalizedEmail)) return null;
  const normalizedFullName = normalizeTextValue(fullName);
  return {
    email: normalizedEmail,
    fullName: normalizedFullName || null
  };
}

function mergeExternalRecipientCollections(...collections) {
  const merged = new Map();
  collections.flat().forEach((recipient) => {
    const normalized = normalizeImportedRecipient(recipient?.email, recipient?.fullName);
    if (!normalized || merged.has(normalized.email)) return;
    merged.set(normalized.email, normalized);
  });
  return Array.from(merged.values());
}

function toDatetimeLocal(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (item) => String(item).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatDateTime(value) {
  if (!value) return '-';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

function normalizeTemplateOption(item = {}) {
  return {
    templateId: item.templateId ?? item.template_id ?? null,
    code: item.code ?? '',
    name: item.name ?? '',
    active: Boolean(item.active),
    variables: (item.variables || []).map((variable) => ({
      templateVariableId: variable.templateVariableId ?? variable.template_variable_id ?? null,
      variableName: variable.variableName ?? variable.variable_name ?? '',
      label: variable.label ?? '',
      inputType: variable.inputType ?? variable.input_type ?? 'text',
      valueSource: (variable.valueSource ?? variable.value_source ?? 'MANUAL').toUpperCase(),
      bindingKey: variable.bindingKey ?? variable.binding_key ?? '',
      required: Boolean(variable.required),
      defaultValue: variable.defaultValue ?? variable.default_value ?? '',
      helpText: variable.helpText ?? variable.help_text ?? '',
      sortOrder: Number(variable.sortOrder ?? variable.sort_order ?? 0) || 0
    }))
  };
}

function normalizeCampaign(item = {}) {
  return {
    campaignId: item.campaignId ?? item.campaign_id ?? null,
    name: item.name ?? '',
    templateId: item.templateId ?? item.template_id ?? null,
    templateCodeSnapshot: item.templateCodeSnapshot ?? item.template_code_snapshot ?? '',
    templateNameSnapshot: item.templateNameSnapshot ?? item.template_name_snapshot ?? '',
    subjectTemplateSnapshot: item.subjectTemplateSnapshot ?? item.subject_template_snapshot ?? '',
    htmlTemplateSnapshot: item.htmlTemplateSnapshot ?? item.html_template_snapshot ?? '',
    subjectResolvedPreview: item.subjectResolvedPreview ?? item.subject_resolved_preview ?? '',
    htmlResolvedPreview: item.htmlResolvedPreview ?? item.html_resolved_preview ?? '',
    audienceDefinitionJson: item.audienceDefinitionJson ?? item.audience_definition_json ?? '',
    status: (item.status ?? 'DRAFT').toUpperCase(),
    sendType: (item.sendType ?? item.send_type ?? 'IMMEDIATE').toUpperCase(),
    scheduledAt: item.scheduledAt ?? item.scheduled_at ?? null,
    queuedAt: item.queuedAt ?? item.queued_at ?? null,
    startedAt: item.startedAt ?? item.started_at ?? null,
    sentAt: item.sentAt ?? item.sent_at ?? null,
    totalRecipients: Number(item.totalRecipients ?? item.total_recipients ?? 0) || 0,
    customerRecipientCount: Number(item.customerRecipientCount ?? item.customer_recipient_count ?? 0) || 0,
    externalRecipientCount: Number(item.externalRecipientCount ?? item.external_recipient_count ?? 0) || 0,
    sentSuccessCount: Number(item.sentSuccessCount ?? item.sent_success_count ?? 0) || 0,
    sentFailureCount: Number(item.sentFailureCount ?? item.sent_failure_count ?? 0) || 0,
    createdAt: item.createdAt ?? item.created_at ?? null,
    updatedAt: item.updatedAt ?? item.updated_at ?? null,
    createdBy: item.createdBy ?? item.created_by ?? '',
    updatedBy: item.updatedBy ?? item.updated_by ?? '',
    variables: (item.variables || []).map((variable) => ({
      campaignVariableId: variable.campaignVariableId ?? variable.campaign_variable_id ?? null,
      variableName: variable.variableName ?? variable.variable_name ?? '',
      variableValue: variable.variableValue ?? variable.variable_value ?? ''
    }))
  };
}

function normalizeCustomer(item = {}) {
  return {
    customerId: item.customerId ?? item.customer_id ?? item.id ?? null,
    customerFullname: item.customerFullname ?? item.fullName ?? item.customer_name ?? '',
    customerMail: item.customerMail ?? item.email ?? '',
    customerPhone: item.customerPhone ?? item.phone ?? '',
    customerStatus: item.customerStatus ?? item.status ?? '',
    channel: item.channel ?? '',
    username: item.username ?? ''
  };
}

function normalizeRecipientsList(payload) {
  const data = payload?.data ?? payload?.recipients ?? [];
  return {
    data: (Array.isArray(data) ? data : []).map((item) => ({
      campaignRecipientId: item.campaignRecipientId ?? item.campaign_recipient_id ?? null,
      recipientType: item.recipientType ?? item.recipient_type ?? '',
      customerId: item.customerId ?? item.customer_id ?? null,
      email: item.email ?? '',
      fullName: item.fullName ?? item.full_name ?? '',
      sendStatus: item.sendStatus ?? item.send_status ?? '',
      errorMessage: item.errorMessage ?? item.error_message ?? '',
      sentAt: item.sentAt ?? item.sent_at ?? null
    })),
    total: Number(payload?.total ?? data?.length ?? 0) || 0
  };
}

function campaignStatusColor(status) {
  switch (status) {
    case 'DRAFT':
      return 'default';
    case 'READY':
      return 'info';
    case 'SENDING':
      return 'warning';
    case 'SENT':
      return 'success';
    case 'FAILED':
      return 'error';
    case 'CANCELLED':
      return 'default';
    default:
      return 'default';
  }
}

function recipientStatusColor(status) {
  switch (status) {
    case 'SENT':
      return 'success';
    case 'FAILED':
      return 'error';
    case 'SKIPPED':
      return 'warning';
    case 'PENDING':
      return 'info';
    default:
      return 'default';
  }
}

function DynamicVariableField({ variable, value, onChange, disabled = false }) {
  const { t } = useTranslation();
  const commonProps = {
    fullWidth: true,
    disabled,
    label: variable.label || variable.variableName,
    helperText: variable.helpText || '',
    sx: fieldSx,
    required: Boolean(variable.required)
  };

  switch (variable.inputType) {
    case 'textarea':
      return <TextField {...commonProps} multiline minRows={4} value={value || ''} onChange={(event) => onChange(event.target.value)} />;
    case 'number':
      return <TextField {...commonProps} type="number" value={value || ''} onChange={(event) => onChange(event.target.value)} />;
    case 'date':
      return <TextField {...commonProps} type="date" InputLabelProps={{ shrink: true }} value={value || ''} onChange={(event) => onChange(event.target.value)} />;
    case 'url':
      return <TextField {...commonProps} type="url" value={value || ''} onChange={(event) => onChange(event.target.value)} />;
    case 'email':
      return <TextField {...commonProps} type="email" value={value || ''} onChange={(event) => onChange(event.target.value)} />;
    case 'color':
      return <TextField {...commonProps} type="color" InputLabelProps={{ shrink: true }} value={value || '#000000'} onChange={(event) => onChange(event.target.value)} />;
    case 'boolean':
      return (
        <FormControlLabel
          control={<Switch disabled={disabled} checked={String(value) === 'true'} onChange={(event) => onChange(event.target.checked ? 'true' : 'false')} />}
          label={t('emailCampaigns.form.booleanValue', { defaultValue: variable.label || variable.variableName })}
        />
      );
    default:
      return <TextField {...commonProps} value={value || ''} onChange={(event) => onChange(event.target.value)} />;
  }
}

function CampaignStatusChip({ status }) {
  const { t } = useTranslation();
  return (
    <Chip
      size="small"
      color={campaignStatusColor(status)}
      variant="outlined"
      label={t(`emailCampaigns.status.${status}`, { defaultValue: status || '-' })}
      sx={{ fontWeight: 700 }}
    />
  );
}

function RecipientStatusChip({ status }) {
  const { t } = useTranslation();
  return (
    <Chip
      size="small"
      color={recipientStatusColor(status)}
      variant="outlined"
      label={t(`emailCampaigns.recipientStatus.${status}`, { defaultValue: status || '-' })}
      sx={{ fontWeight: 700 }}
    />
  );
}

function CustomerPickerDialog({ open, onClose, filters, selectedCustomerIds, onSelectionChange }) {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!open) return;
    setPage(0);
  }, [open, filters.search, filters.status, filters.channel, filters.fromDate, filters.toDate]);

  useEffect(() => {
    if (!open) return undefined;
    let active = true;
    setLoading(true);
    searchEmailCampaignCustomers({
      search: filters.search || undefined,
      status: filters.status || undefined,
      channel: filters.channel || undefined,
      fromDate: filters.fromDate || undefined,
      toDate: filters.toDate || undefined,
      index: page,
      size: rowsPerPage
    })
      .then((payload) => {
        if (!active) return;
        setRows((payload?.data || []).map(normalizeCustomer));
        setTotal(Number(payload?.total ?? 0));
      })
      .catch((error) => {
        if (!active) return;
        enqueueSnackbar(error?.response?.data?.message || t('emailCampaigns.messages.customerSearchError', { defaultValue: 'Unable to search customers.' }), {
          variant: 'error'
        });
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [open, filters, page, rowsPerPage, enqueueSnackbar, t]);

  const selectedSet = useMemo(() => new Set((selectedCustomerIds || []).map((value) => Number(value))), [selectedCustomerIds]);

  const toggleSelection = (customerId) => {
    const normalizedId = Number(customerId);
    const nextSet = new Set(selectedSet);
    if (nextSet.has(normalizedId)) nextSet.delete(normalizedId);
    else nextSet.add(normalizedId);
    onSelectionChange(Array.from(nextSet));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitleWithClose onClose={onClose}>
        <Stack spacing={0.35}>
          <Typography variant="h4">{t('emailCampaigns.audience.customerPicker.title', { defaultValue: 'Select customers' })}</Typography>
          <Typography variant="body2" color="text.secondary">
            {t('emailCampaigns.audience.customerPicker.subtitle', {
              defaultValue: 'Search customers with the current filters and choose the ones you want to include in the campaign.'
            })}
          </Typography>
        </Stack>
      </DialogTitleWithClose>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Alert severity="info">
            {t('emailCampaigns.audience.customerPicker.selectedCount', {
              defaultValue: '{{count}} customer(s) selected.',
              count: selectedSet.size
            })}
          </Alert>
          <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox" />
                    <TableCell>{t('emailCampaigns.customerHeaders.customer', { defaultValue: 'Customer' })}</TableCell>
                    <TableCell>{t('emailCampaigns.customerHeaders.email', { defaultValue: 'Email' })}</TableCell>
                    <TableCell>{t('emailCampaigns.customerHeaders.status', { defaultValue: 'Status' })}</TableCell>
                    <TableCell>{t('emailCampaigns.customerHeaders.channel', { defaultValue: 'Channel' })}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5}>
                        <Skeleton variant="rounded" height={64} />
                      </TableCell>
                    </TableRow>
                  ) : rows.length ? (
                    rows.map((row) => (
                      <TableRow hover key={row.customerId} onClick={() => toggleSelection(row.customerId)} sx={{ cursor: 'pointer' }}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedSet.has(Number(row.customerId))} />
                        </TableCell>
                        <TableCell>
                          <Stack spacing={0.25}>
                            <Typography variant="subtitle2">{row.customerFullname || '-'}</Typography>
                            <Typography variant="caption" color="text.secondary">#{row.customerId}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>{row.customerMail || '-'}</TableCell>
                        <TableCell>{row.customerStatus || '-'}</TableCell>
                        <TableCell>{row.channel || '-'}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5}>
                        <Alert severity="info">{t('emailCampaigns.messages.noCustomers', { defaultValue: 'No customers match the current search.' })}</Alert>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={total}
              page={page}
              onPageChange={(_, nextPage) => setPage(nextPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(Number(event.target.value));
                setPage(0);
              }}
              rowsPerPageOptions={[10, 20, 50]}
            />
          </Paper>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('common.done', { defaultValue: 'Done' })}</Button>
      </DialogActions>
    </Dialog>
  );
}

function CampaignDetailDialog({ open, onClose, campaign }) {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [tab, setTab] = useState(0);
  const [loadingRecipients, setLoadingRecipients] = useState(false);
  const [recipientSearch, setRecipientSearch] = useState('');
  const [recipientStatus, setRecipientStatus] = useState('ALL');
  const [recipientPage, setRecipientPage] = useState(0);
  const [recipientRowsPerPage, setRecipientRowsPerPage] = useState(10);
  const [recipients, setRecipients] = useState([]);
  const [recipientsTotal, setRecipientsTotal] = useState(0);

  useEffect(() => {
    if (!open || !campaign) return undefined;
    let active = true;
    setLoadingRecipients(true);
    listEmailCampaignRecipients(campaign.campaignId, {
      search: recipientSearch || undefined,
      sendStatus: recipientStatus === 'ALL' ? undefined : recipientStatus,
      index: recipientPage,
      size: recipientRowsPerPage
    })
      .then((payload) => {
        if (!active) return;
        const normalized = normalizeRecipientsList(payload);
        setRecipients(normalized.data);
        setRecipientsTotal(normalized.total);
      })
      .catch((error) => {
        if (!active) return;
        enqueueSnackbar(error?.response?.data?.message || t('emailCampaigns.messages.recipientsLoadError', { defaultValue: 'Unable to load recipient history.' }), {
          variant: 'error'
        });
      })
      .finally(() => {
        if (active) setLoadingRecipients(false);
      });

    return () => {
      active = false;
    };
  }, [open, campaign, recipientSearch, recipientStatus, recipientPage, recipientRowsPerPage, enqueueSnackbar, t]);

  if (!campaign) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xl">
      <DialogTitleWithClose onClose={onClose}>
        <Stack spacing={0.35}>
          <Typography variant="h4">{campaign.name}</Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <CampaignStatusChip status={campaign.status} />
            <Typography variant="body2" color="text.secondary">
              {campaign.templateNameSnapshot || '-'}
            </Typography>
          </Stack>
        </Stack>
      </DialogTitleWithClose>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Tabs value={tab} onChange={(_, value) => setTab(value)} variant="scrollable" allowScrollButtonsMobile>
            <Tab label={t('emailCampaigns.detail.summary', { defaultValue: 'Summary' })} />
            <Tab label={t('emailCampaigns.detail.variables', { defaultValue: 'Variables' })} />
            <Tab label={t('emailCampaigns.detail.preview', { defaultValue: 'Preview' })} />
            <Tab label={t('emailCampaigns.detail.recipients', { defaultValue: 'Recipients' })} />
          </Tabs>

          {tab === 0 && (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' }, gap: 2 }}>
              <Card sx={{ p: 2.25, borderRadius: 3 }}>
                <Typography variant="overline" color="text.secondary">{t('emailCampaigns.headers.sendType', { defaultValue: 'Send type' })}</Typography>
                <Typography variant="h4">{campaign.sendType}</Typography>
              </Card>
              <Card sx={{ p: 2.25, borderRadius: 3 }}>
                <Typography variant="overline" color="text.secondary">{t('emailCampaigns.headers.totalRecipients', { defaultValue: 'Total recipients' })}</Typography>
                <Typography variant="h4">{campaign.totalRecipients}</Typography>
              </Card>
              <Card sx={{ p: 2.25, borderRadius: 3 }}>
                <Typography variant="overline" color="text.secondary">{t('emailCampaigns.headers.sentSuccessCount', { defaultValue: 'Sent successfully' })}</Typography>
                <Typography variant="h4">{campaign.sentSuccessCount}</Typography>
              </Card>
              <Card sx={{ p: 2.25, borderRadius: 3 }}>
                <Typography variant="subtitle2">{t('emailCampaigns.headers.createdAt', { defaultValue: 'Created' })}</Typography>
                <Typography variant="body2">{formatDateTime(campaign.createdAt)}</Typography>
              </Card>
              <Card sx={{ p: 2.25, borderRadius: 3 }}>
                <Typography variant="subtitle2">{t('emailCampaigns.headers.queuedAt', { defaultValue: 'Queued' })}</Typography>
                <Typography variant="body2">{formatDateTime(campaign.queuedAt)}</Typography>
              </Card>
              <Card sx={{ p: 2.25, borderRadius: 3 }}>
                <Typography variant="subtitle2">{t('emailCampaigns.headers.sentAt', { defaultValue: 'Completed' })}</Typography>
                <Typography variant="body2">{formatDateTime(campaign.sentAt)}</Typography>
              </Card>
            </Box>
          )}

          {tab === 1 && (
            <Paper variant="outlined" sx={{ borderRadius: 3 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('emailCampaigns.variableHeaders.name', { defaultValue: 'Variable' })}</TableCell>
                      <TableCell>{t('emailCampaigns.variableHeaders.value', { defaultValue: 'Value' })}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {campaign.variables?.length ? (
                      campaign.variables.map((variable) => (
                        <TableRow key={variable.campaignVariableId || variable.variableName}>
                          <TableCell>{variable.variableName}</TableCell>
                          <TableCell>{variable.variableValue || '-'}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2}>
                          <Alert severity="info">{t('emailCampaigns.messages.noVariablesUsed', { defaultValue: 'This campaign does not have manual variables.' })}</Alert>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}

          {tab === 2 && (
            <Stack spacing={2}>
              <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
                <Typography variant="overline" color="text.secondary">{t('emailCampaigns.preview.subject', { defaultValue: 'Resolved subject' })}</Typography>
                <Typography variant="h4" sx={{ mt: 0.75 }}>{campaign.subjectResolvedPreview || '-'}</Typography>
              </Paper>
              <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
                <Typography variant="overline" color="text.secondary">{t('emailCampaigns.preview.html', { defaultValue: 'Resolved HTML' })}</Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ '& img': { maxWidth: '100%' } }} dangerouslySetInnerHTML={{ __html: campaign.htmlResolvedPreview || '<p>-</p>' }} />
              </Paper>
            </Stack>
          )}

          {tab === 3 && (
            <Stack spacing={2}>
              <ResponsiveFilters>
                <TextField
                  fullWidth
                  label={t('emailCampaigns.detail.recipientSearch', { defaultValue: 'Search recipients' })}
                  value={recipientSearch}
                  onChange={(event) => {
                    setRecipientPage(0);
                    setRecipientSearch(event.target.value);
                  }}
                  sx={fieldSx}
                />
                <FormControl fullWidth sx={fieldSx}>
                  <InputLabel>{t('emailCampaigns.detail.recipientStatus', { defaultValue: 'Send status' })}</InputLabel>
                  <Select
                    label={t('emailCampaigns.detail.recipientStatus', { defaultValue: 'Send status' })}
                    value={recipientStatus}
                    onChange={(event) => {
                      setRecipientPage(0);
                      setRecipientStatus(event.target.value);
                    }}
                  >
                    {recipientStatuses.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status === 'ALL' ? t('common.all', { defaultValue: 'All' }) : t(`emailCampaigns.recipientStatus.${status}`, { defaultValue: status })}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </ResponsiveFilters>

              <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>{t('emailCampaigns.recipientHeaders.email', { defaultValue: 'Email' })}</TableCell>
                        <TableCell>{t('emailCampaigns.recipientHeaders.fullName', { defaultValue: 'Full name' })}</TableCell>
                        <TableCell>{t('emailCampaigns.recipientHeaders.type', { defaultValue: 'Type' })}</TableCell>
                        <TableCell>{t('emailCampaigns.recipientHeaders.status', { defaultValue: 'Status' })}</TableCell>
                        <TableCell>{t('emailCampaigns.recipientHeaders.sentAt', { defaultValue: 'Sent at' })}</TableCell>
                        <TableCell>{t('emailCampaigns.recipientHeaders.error', { defaultValue: 'Error' })}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {loadingRecipients ? (
                        <TableRow>
                          <TableCell colSpan={6}><Skeleton variant="rounded" height={64} /></TableCell>
                        </TableRow>
                      ) : recipients.length ? (
                        recipients.map((recipient) => (
                          <TableRow key={recipient.campaignRecipientId}>
                            <TableCell>{recipient.email}</TableCell>
                            <TableCell>{recipient.fullName || '-'}</TableCell>
                            <TableCell>{recipient.recipientType || '-'}</TableCell>
                            <TableCell><RecipientStatusChip status={recipient.sendStatus} /></TableCell>
                            <TableCell>{formatDateTime(recipient.sentAt)}</TableCell>
                            <TableCell>{recipient.errorMessage || '-'}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6}><Alert severity="info">{t('emailCampaigns.messages.noRecipientsHistory', { defaultValue: 'No recipients found for the current filter.' })}</Alert></TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  component="div"
                  count={recipientsTotal}
                  page={recipientPage}
                  onPageChange={(_, nextPage) => setRecipientPage(nextPage)}
                  rowsPerPage={recipientRowsPerPage}
                  onRowsPerPageChange={(event) => {
                    setRecipientRowsPerPage(Number(event.target.value));
                    setRecipientPage(0);
                  }}
                  rowsPerPageOptions={[10, 20, 50]}
                />
              </Paper>
            </Stack>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('actions.cancel')}</Button>
      </DialogActions>
    </Dialog>
  );
}

function CampaignWizardDialog({ open, onClose, templates, refreshTemplates, editingCampaignId, onSaved }) {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { accessToken } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [savingDraft, setSavingDraft] = useState(false);
  const [sending, setSending] = useState(false);
  const [loadingCampaign, setLoadingCampaign] = useState(false);
  const [loadingTemplate, setLoadingTemplate] = useState(false);
  const [templateCache, setTemplateCache] = useState({});
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [campaignId, setCampaignId] = useState(null);
  const [preview, setPreview] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [customerPickerOpen, setCustomerPickerOpen] = useState(false);
  const [importingExternalRecipients, setImportingExternalRecipients] = useState(false);
  const [formState, setFormState] = useState(createEmptyCampaignForm);

  const stepLabels = useMemo(
    () => [
      t('emailCampaigns.steps.template', { defaultValue: 'Template' }),
      t('emailCampaigns.steps.variables', { defaultValue: 'Variables' }),
      t('emailCampaigns.steps.audience', { defaultValue: 'Audience' }),
      t('emailCampaigns.steps.preview', { defaultValue: 'Preview & Send' })
    ],
    [t]
  );

  const manualVariables = useMemo(
    () =>
      (selectedTemplate?.variables || [])
        .filter((variable) => variable.valueSource === 'MANUAL')
        .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)),
    [selectedTemplate]
  );

  useEffect(() => {
    if (!open) return;
    setActiveStep(0);
    setPreview(null);
    setCustomerPickerOpen(false);
    if (!editingCampaignId) {
      setCampaignId(null);
      setSelectedTemplate(null);
      setFormState(createEmptyCampaignForm());
      return;
    }

    let active = true;
    setCampaignId(null);
    setSelectedTemplate(null);
    setFormState(createEmptyCampaignForm());
    setLoadingCampaign(true);
    getEmailCampaign(editingCampaignId)
      .then(async (payload) => {
        if (!active) return;
        const campaign = normalizeCampaign(payload);
        const audience = parseAudienceDefinition(campaign.audienceDefinitionJson);
        const nextForm = {
          name: campaign.name,
          templateId: campaign.templateId || '',
          sendType: campaign.sendType || 'IMMEDIATE',
          scheduledAt: toDatetimeLocal(campaign.scheduledAt),
          variableValues: Object.fromEntries((campaign.variables || []).map((variable) => [variable.variableName, variable.variableValue || ''])),
          audience,
          externalRecipientsText: buildExternalRecipientsText(audience.externalRecipients || []),
          testEmail: ''
        };
        setCampaignId(campaign.campaignId);
        setFormState(nextForm);
        const template = await ensureTemplateLoaded(campaign.templateId);
        if (!active) return;
        setSelectedTemplate(template);
      })
      .catch((error) => {
        if (!active) return;
        enqueueSnackbar(error?.response?.data?.message || t('emailCampaigns.messages.loadCampaignError', { defaultValue: 'Unable to load campaign detail.' }), {
          variant: 'error'
        });
      })
      .finally(() => {
        if (active) setLoadingCampaign(false);
      });

    return () => {
      active = false;
    };
  }, [open, editingCampaignId, t, enqueueSnackbar]);

  const ensureTemplateLoaded = async (templateId) => {
    if (!templateId) return null;
    const normalizedId = Number(templateId);
    if (templateCache[normalizedId]) return templateCache[normalizedId];
    setLoadingTemplate(true);
    try {
      const payload = await getEmailTemplate(normalizedId);
      const normalized = normalizeTemplateOption(payload);
      setTemplateCache((current) => ({ ...current, [normalizedId]: normalized }));
      return normalized;
    } finally {
      setLoadingTemplate(false);
    }
  };

  useEffect(() => {
    if (!open || !formState.templateId) return;
    let active = true;
    ensureTemplateLoaded(formState.templateId)
      .then((template) => {
        if (!active || !template) return;
        setSelectedTemplate(template);
        setFormState((current) => {
          const mergedValues = { ...current.variableValues };
          template.variables
            .filter((variable) => variable.valueSource === 'MANUAL')
            .forEach((variable) => {
              if (mergedValues[variable.variableName] === undefined) {
                mergedValues[variable.variableName] = variable.defaultValue || '';
              }
            });
          return { ...current, variableValues: mergedValues };
        });
      })
      .catch((error) => {
        if (!active) return;
        enqueueSnackbar(error?.response?.data?.message || t('emailCampaigns.messages.loadTemplateError', { defaultValue: 'Unable to load selected template.' }), {
          variant: 'error'
        });
      });

    return () => {
      active = false;
    };
  }, [open, formState.templateId, t, enqueueSnackbar]);

  const setAudienceField = (field, value) => {
    setFormState((current) => ({
      ...current,
      audience: {
        ...current.audience,
        customerSelection: {
          ...current.audience.customerSelection,
          [field]: value
        }
      }
    }));
  };

  const setAudienceFilter = (field, value) => {
    setFormState((current) => ({
      ...current,
      audience: {
        ...current.audience,
        customerSelection: {
          ...current.audience.customerSelection,
          filters: {
            ...current.audience.customerSelection.filters,
            [field]: value
          }
        }
      }
    }));
  };

  const buildPayload = () => {
    const filters = formState.audience.customerSelection.filters || {};
    const normalizedStatus = normalizeOptionValue(filters.status, customerStatusOptions);
    const normalizedChannel = normalizeOptionValue(filters.channel, commonChannels);
    const normalizedSearch = normalizeTextValue(filters.search);
    const normalizedFromDate = normalizeDateFilterValue(filters.fromDate);
    const normalizedToDate = normalizeDateFilterValue(filters.toDate);

    return {
      name: formState.name.trim(),
      templateId: Number(formState.templateId),
      sendType: formState.sendType,
      scheduledAt: formState.sendType === 'SCHEDULED' && formState.scheduledAt ? formState.scheduledAt : null,
      variableValues: formState.variableValues,
      audience: {
        customerSelection: {
          mode: normalizeOptionValue(formState.audience.customerSelection.mode, customerModes) || 'MIXED',
          filters: {
            status: normalizedStatus || null,
            channel: normalizedChannel || null,
            search: normalizedSearch || null,
            fromDate: normalizedFromDate || null,
            toDate: normalizedToDate || null
          },
          selectedCustomerIds: normalizeSelectedCustomerIds(formState.audience.customerSelection.selectedCustomerIds)
        },
        externalRecipients: parseExternalRecipients(formState.externalRecipientsText)
      }
    };
  };

  const validateCurrentStep = () => {
    if (activeStep === 0) {
      if (!formState.name.trim() || !formState.templateId || !formState.sendType) {
        enqueueSnackbar(t('emailCampaigns.messages.requiredHeader', { defaultValue: 'Campaign name, template and send type are required.' }), {
          variant: 'warning'
        });
        return false;
      }
      if (formState.sendType === 'SCHEDULED' && !formState.scheduledAt) {
        enqueueSnackbar(t('emailCampaigns.messages.scheduleRequired', { defaultValue: 'Choose a scheduled date and time.' }), { variant: 'warning' });
        return false;
      }
    }
    if (activeStep === 1) {
      const missingRequired = manualVariables
        .filter((variable) => variable.required)
        .filter((variable) => !String(formState.variableValues?.[variable.variableName] || variable.defaultValue || '').trim())
        .map((variable) => variable.label || variable.variableName);
      if (missingRequired.length) {
        enqueueSnackbar(
          t('emailCampaigns.messages.missingManualVariables', {
            defaultValue: `Complete required variables: ${missingRequired.join(', ')}`
          }),
          { variant: 'warning' }
        );
        return false;
      }
    }
    return true;
  };

  const handleSaveDraft = async () => {
    const payload = buildPayload();
    if (!payload.name || !payload.templateId) {
      enqueueSnackbar(t('emailCampaigns.messages.requiredHeader', { defaultValue: 'Campaign name, template and send type are required.' }), {
        variant: 'warning'
      });
      return null;
    }
    setSavingDraft(true);
    try {
      const saved = campaignId ? await updateEmailCampaign(campaignId, payload) : await createEmailCampaign(payload);
      const normalized = normalizeCampaign(saved);
      setCampaignId(normalized.campaignId);
      enqueueSnackbar(
        campaignId
          ? t('emailCampaigns.messages.draftUpdated', { defaultValue: 'Campaign draft updated.' })
          : t('emailCampaigns.messages.draftCreated', { defaultValue: 'Campaign draft created.' }),
        { variant: 'success' }
      );
      onSaved?.();
      return normalized;
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || t('emailCampaigns.messages.saveDraftError', { defaultValue: 'Unable to save campaign draft.' }), {
        variant: 'error'
      });
      return null;
    } finally {
      setSavingDraft(false);
    }
  };

  const handleLoadPreview = async () => {
    const payload = buildPayload();
    setPreviewLoading(true);
    try {
      const response = await previewEmailCampaign({
        templateId: payload.templateId,
        variableValues: payload.variableValues,
        audience: payload.audience,
        sampleRecipientEmail: parseExternalRecipients(formState.externalRecipientsText)[0]?.email || formState.testEmail || undefined,
        sampleRecipientFullName: parseExternalRecipients(formState.externalRecipientsText)[0]?.fullName || undefined
      });
      setPreview(response);
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || t('emailCampaigns.messages.previewError', { defaultValue: 'Unable to build campaign preview.' }), {
        variant: 'error'
      });
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleSendTest = async () => {
    const payload = buildPayload();
    if (!formState.testEmail.trim()) {
      enqueueSnackbar(t('emailCampaigns.messages.testEmailRequired', { defaultValue: 'Enter a test email address.' }), { variant: 'warning' });
      return;
    }
    try {
      await sendEmailCampaignTest({
        templateId: payload.templateId,
        variableValues: payload.variableValues,
        audience: payload.audience,
        testEmail: formState.testEmail.trim()
      });
      enqueueSnackbar(t('emailCampaigns.messages.testSent', { defaultValue: 'Test email sent.' }), { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || t('emailCampaigns.messages.testSendError', { defaultValue: 'Unable to send test email.' }), {
        variant: 'error'
      });
    }
  };

  const handleQueueCampaign = async () => {
    const saved = await handleSaveDraft();
    if (!saved?.campaignId) return;
    setSending(true);
    try {
      await queueEmailCampaign(saved.campaignId);
      enqueueSnackbar(
        formState.sendType === 'SCHEDULED'
          ? t('emailCampaigns.messages.scheduled', { defaultValue: 'Campaign scheduled successfully.' })
          : t('emailCampaigns.messages.queued', { defaultValue: 'Campaign queued for sending.' }),
        { variant: 'success' }
      );
      onSaved?.();
      onClose();
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || t('emailCampaigns.messages.queueError', { defaultValue: 'Unable to queue campaign.' }), {
        variant: 'error'
      });
    } finally {
      setSending(false);
    }
  };

  const nextStep = async () => {
    if (!validateCurrentStep()) return;
    if (activeStep === 2) {
      await handleLoadPreview();
    }
    setActiveStep((current) => Math.min(current + 1, stepLabels.length - 1));
  };

  const handleImportLeadEmails = useCallback(async () => {
    setImportingExternalRecipients(true);
    try {
      const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined;
      const loadAllCustomerEmails = async () => {
        const size = 1000;
        let index = 0;
        let total = 0;
        const emails = new Set();

        do {
          const response = await lionTvApi.get('/customers/v1', {
            headers,
            params: { index, size },
            skipAuthRedirect: true
          });
          const payload = response?.data?.data ?? response?.data ?? {};
          const collection = payload.data ?? payload.items ?? payload.content ?? [];
          total = Number(payload.total ?? 0);

          (Array.isArray(collection) ? collection : []).forEach((item) => {
            const email = normalizeTextValue(item?.customerMail ?? item?.customer_mail ?? item?.email).toLowerCase();
            if (email) emails.add(email);
          });

          index += 1;
          if (!Array.isArray(collection) || collection.length < size) break;
        } while (index * size < total);

        return emails;
      };

      const [potentialResponse, demosResponse, customerEmailSet] = await Promise.all([
        lionTvApi.get('/potential-customers/v1', {
          headers,
          params: { index: 0, size: 5000 },
          skipAuthRedirect: true
        }),
        shopifyDemosApi.get('/demos/all', {
          headers,
          skipAuthRedirect: true
        }),
        loadAllCustomerEmails()
      ]);

      const potentialPayload = potentialResponse?.data?.data ?? potentialResponse?.data ?? {};
      const potentialCollection = potentialPayload.data ?? potentialPayload.items ?? potentialPayload.content ?? [];
      const potentialRecipients = (Array.isArray(potentialCollection) ? potentialCollection : [])
        .filter((item) => normalizeTextValue(item?.status ?? item?.customerStatus ?? '').toUpperCase() !== 'CONVERTED')
        .map((item) => normalizeImportedRecipient(
          item?.email,
          item?.fullName ?? item?.full_name ?? item?.customerFullname ?? item?.customer_fullname
        ))
        .filter((item) => item && !customerEmailSet.has(item.email));

      const demosCollection = demosResponse?.data?.data ?? [];
      const demoRecipients = (Array.isArray(demosCollection) ? demosCollection : [])
        .filter((item) => normalizeTextValue(item?.status).toUpperCase() !== 'ACTIVATED')
        .map((item) => normalizeImportedRecipient(item?.email, item?.customerName ?? item?.customer_name))
        .filter((item) => item && !customerEmailSet.has(item.email));

      const existingRecipients = parseExternalRecipients(formState.externalRecipientsText);
      const sanitizedExistingRecipients = existingRecipients.filter((item) => !customerEmailSet.has(item.email));
      const mergedRecipients = mergeExternalRecipientCollections(sanitizedExistingRecipients, potentialRecipients, demoRecipients)
        .filter((item) => !customerEmailSet.has(item.email));
      const addedCount = Math.max(0, mergedRecipients.length - sanitizedExistingRecipients.length);

      setFormState((current) => ({
        ...current,
        externalRecipientsText: buildExternalRecipientsText(mergedRecipients)
      }));

      enqueueSnackbar(
        addedCount
          ? t('emailCampaigns.messages.externalRecipientsImported', {
              defaultValue: '{{count}} external recipient(s) imported.',
              count: addedCount
            })
          : t('emailCampaigns.messages.externalRecipientsImportedEmpty', {
              defaultValue: 'No new external recipients were found to import.'
            }),
        { variant: addedCount ? 'success' : 'info' }
      );
    } catch (error) {
      enqueueSnackbar(
        error?.response?.data?.message || t('emailCampaigns.messages.externalRecipientsImportError', {
          defaultValue: 'Unable to import external recipients from potential customers and demos.'
        }),
        { variant: 'error' }
      );
    } finally {
      setImportingExternalRecipients(false);
    }
  }, [accessToken, enqueueSnackbar, formState.externalRecipientsText, t]);

  const selectedCustomerCount = formState.audience.customerSelection.selectedCustomerIds?.length || 0;
  const externalRecipientsCount = parseExternalRecipients(formState.externalRecipientsText).length;

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="xl">
        <DialogTitleWithClose onClose={onClose}>
          <Stack spacing={0.5}>
            <Typography variant="h4">
              {editingCampaignId
                ? t('emailCampaigns.dialog.editTitle', { defaultValue: 'Edit email campaign' })
                : t('emailCampaigns.dialog.createTitle', { defaultValue: 'Create email campaign' })}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('emailCampaigns.dialog.subtitle', {
                defaultValue: 'Build a reusable campaign from a template, resolve manual variables, choose the audience and send or schedule it.'
              })}
            </Typography>
          </Stack>
        </DialogTitleWithClose>
        <DialogContent dividers>
          {loadingCampaign ? (
            <Skeleton variant="rounded" height={320} />
          ) : (
            <Stack spacing={2.5}>
              <Stepper activeStep={activeStep} alternativeLabel>
                {stepLabels.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              {activeStep === 0 && (
                <Stack spacing={2}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' }, gap: 2 }}>
                    <TextField
                      label={t('emailCampaigns.form.name', { defaultValue: 'Campaign name' })}
                      value={formState.name}
                      onChange={(event) => setFormState((current) => ({ ...current, name: event.target.value }))}
                      sx={fieldSx}
                    />
                    <FormControl fullWidth sx={fieldSx}>
                      <InputLabel>{t('emailCampaigns.form.template', { defaultValue: 'Template' })}</InputLabel>
                      <Select
                        label={t('emailCampaigns.form.template', { defaultValue: 'Template' })}
                        value={formState.templateId || ''}
                        onChange={(event) => {
                          const nextId = Number(event.target.value) || '';
                          setPreview(null);
                          setFormState((current) => ({ ...current, templateId: nextId }));
                        }}
                      >
                        {templates.map((template) => (
                          <MenuItem key={template.templateId} value={template.templateId}>
                            {template.name} · {template.code}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl fullWidth sx={fieldSx}>
                      <InputLabel>{t('emailCampaigns.form.sendType', { defaultValue: 'Send type' })}</InputLabel>
                      <Select
                        label={t('emailCampaigns.form.sendType', { defaultValue: 'Send type' })}
                        value={formState.sendType}
                        onChange={(event) => setFormState((current) => ({ ...current, sendType: event.target.value }))}
                      >
                        {sendTypes.map((type) => (
                          <MenuItem key={type} value={type}>
                            {t(`emailCampaigns.sendType.${type}`, { defaultValue: type })}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      label={t('emailCampaigns.form.scheduledAt', { defaultValue: 'Scheduled at' })}
                      type="datetime-local"
                      value={formState.scheduledAt}
                      disabled={formState.sendType !== 'SCHEDULED'}
                      onChange={(event) => setFormState((current) => ({ ...current, scheduledAt: event.target.value }))}
                      sx={fieldSx}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Box>
                  {selectedTemplate && (
                    <Alert severity="info">
                      {t('emailCampaigns.form.templateHint', {
                        defaultValue: `Selected template: ${selectedTemplate.name} (${selectedTemplate.code}).`
                      })}
                    </Alert>
                  )}
                </Stack>
              )}

              {activeStep === 1 && (
                <Stack spacing={2}>
                  {loadingTemplate ? (
                    <Skeleton variant="rounded" height={120} />
                  ) : manualVariables.length ? (
                    manualVariables.map((variable) => (
                      <DynamicVariableField
                        key={variable.variableName}
                        variable={variable}
                        value={formState.variableValues?.[variable.variableName] ?? variable.defaultValue ?? ''}
                        onChange={(nextValue) =>
                          setFormState((current) => ({
                            ...current,
                            variableValues: {
                              ...current.variableValues,
                              [variable.variableName]: nextValue
                            }
                          }))
                        }
                      />
                    ))
                  ) : (
                    <Alert severity="info">
                      {t('emailCampaigns.messages.noManualVariables', {
                        defaultValue: 'This template only uses recipient-bound variables. You can continue to audience selection.'
                      })}
                    </Alert>
                  )}
                </Stack>
              )}

              {activeStep === 2 && (
                <Stack spacing={2}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' }, gap: 2 }}>
                    <FormControl fullWidth sx={fieldSx}>
                      <InputLabel>{t('emailCampaigns.audience.mode', { defaultValue: 'Customer mode' })}</InputLabel>
                      <Select
                        label={t('emailCampaigns.audience.mode', { defaultValue: 'Customer mode' })}
                        value={formState.audience.customerSelection.mode}
                        onChange={(event) => setAudienceField('mode', event.target.value)}
                      >
                        {customerModes.map((mode) => (
                          <MenuItem key={mode} value={mode}>
                            {t(`emailCampaigns.customerMode.${mode}`, { defaultValue: mode })}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl fullWidth sx={fieldSx}>
                      <InputLabel>{t('emailCampaigns.audience.customerStatus', { defaultValue: 'Customer status' })}</InputLabel>
                      <Select
                        label={t('emailCampaigns.audience.customerStatus', { defaultValue: 'Customer status' })}
                        value={formState.audience.customerSelection.filters.status}
                        onChange={(event) => setAudienceFilter('status', event.target.value)}
                      >
                        {customerStatusOptions.map((status) => (
                          <MenuItem key={status || 'all'} value={status}>
                            {status ? status : t('common.all', { defaultValue: 'All' })}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl fullWidth sx={fieldSx}>
                      <InputLabel>{t('emailCampaigns.audience.channel', { defaultValue: 'Channel' })}</InputLabel>
                      <Select
                        label={t('emailCampaigns.audience.channel', { defaultValue: 'Channel' })}
                        value={formState.audience.customerSelection.filters.channel}
                        onChange={(event) => setAudienceFilter('channel', event.target.value)}
                      >
                        {commonChannels.map((channel) => (
                          <MenuItem key={channel || 'all'} value={channel}>
                            {channel || t('common.all', { defaultValue: 'All' })}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      label={t('emailCampaigns.audience.search', { defaultValue: 'Customer search' })}
                      value={formState.audience.customerSelection.filters.search}
                      onChange={(event) => setAudienceFilter('search', event.target.value)}
                      sx={fieldSx}
                    />
                    <TextField
                      label={t('emailCampaigns.audience.fromDate', { defaultValue: 'From date' })}
                      type="date"
                      value={formState.audience.customerSelection.filters.fromDate}
                      onChange={(event) => setAudienceFilter('fromDate', event.target.value)}
                      sx={fieldSx}
                      InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                      label={t('emailCampaigns.audience.toDate', { defaultValue: 'To date' })}
                      type="date"
                      value={formState.audience.customerSelection.filters.toDate}
                      onChange={(event) => setAudienceFilter('toDate', event.target.value)}
                      sx={fieldSx}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Box>
                  <ResponsiveActionBar justifyContent="flex-start">
                    <Button variant="outlined" startIcon={<PersonSearchRoundedIcon />} onClick={() => setCustomerPickerOpen(true)}>
                      {t('emailCampaigns.audience.selectCustomers', { defaultValue: 'Select customers' })}
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      startIcon={<MailOutlineRoundedIcon />}
                      onClick={handleImportLeadEmails}
                      disabled={importingExternalRecipients}
                    >
                      {importingExternalRecipients
                        ? t('emailCampaigns.actions.importingExternalRecipients', { defaultValue: 'Importing emails...' })
                        : t('emailCampaigns.actions.importExternalRecipients', { defaultValue: 'Import leads and demos' })}
                    </Button>
                    <Chip label={t('emailCampaigns.audience.selectedCustomers', { defaultValue: '{{count}} selected', count: selectedCustomerCount })} color="primary" variant="outlined" />
                  </ResponsiveActionBar>
                  <TextField
                    label={t('emailCampaigns.audience.externalRecipients', { defaultValue: 'External recipients' })}
                    value={formState.externalRecipientsText}
                    onChange={(event) => setFormState((current) => ({ ...current, externalRecipientsText: event.target.value }))}
                    multiline
                    minRows={6}
                    sx={fieldSx}
                    helperText={t('emailCampaigns.audience.externalHelper', {
                      defaultValue: 'Paste emails separated by commas or lines. You can also use Name <email@example.com> format.'
                    })}
                  />
                  <Chip label={t('emailCampaigns.audience.externalCount', { defaultValue: '{{count}} external recipient(s)', count: externalRecipientsCount })} color="info" variant="outlined" />
                </Stack>
              )}

              {activeStep === 3 && (
                <Stack spacing={2}>
                  <ResponsiveActionBar justifyContent="space-between">
                    <Button variant="outlined" startIcon={<PreviewRoundedIcon />} onClick={handleLoadPreview} disabled={previewLoading}>
                      {t('emailCampaigns.actions.refreshPreview', { defaultValue: 'Refresh preview' })}
                    </Button>
                    <Button variant="outlined" startIcon={<RefreshIcon />} onClick={refreshTemplates}>
                      {t('emailCampaigns.actions.refreshTemplates', { defaultValue: 'Refresh templates' })}
                    </Button>
                  </ResponsiveActionBar>
                  {previewLoading ? (
                    <Skeleton variant="rounded" height={240} />
                  ) : preview ? (
                    <>
                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' }, gap: 2 }}>
                        <Card sx={{ p: 2.25, borderRadius: 3 }}>
                          <Typography variant="overline" color="text.secondary">{t('emailCampaigns.preview.totalRecipients', { defaultValue: 'Total recipients' })}</Typography>
                          <Typography variant="h3">{preview.totalRecipients || 0}</Typography>
                        </Card>
                        <Card sx={{ p: 2.25, borderRadius: 3 }}>
                          <Typography variant="overline" color="text.secondary">{t('emailCampaigns.preview.customerRecipients', { defaultValue: 'Customers' })}</Typography>
                          <Typography variant="h3">{preview.customerRecipients || 0}</Typography>
                        </Card>
                        <Card sx={{ p: 2.25, borderRadius: 3 }}>
                          <Typography variant="overline" color="text.secondary">{t('emailCampaigns.preview.externalRecipients', { defaultValue: 'External' })}</Typography>
                          <Typography variant="h3">{preview.externalRecipients || 0}</Typography>
                        </Card>
                      </Box>
                      {(preview.warnings || []).length > 0 && (
                        <Alert severity="warning">
                          <Stack spacing={0.5}>
                            {(preview.warnings || []).map((warning, index) => (
                              <Typography key={index} variant="body2">{warning}</Typography>
                            ))}
                          </Stack>
                        </Alert>
                      )}
                      <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
                        <Typography variant="overline" color="text.secondary">{t('emailCampaigns.preview.subject', { defaultValue: 'Resolved subject' })}</Typography>
                        <Typography variant="h4" sx={{ mt: 0.75 }}>{preview.subjectFinal || '-'}</Typography>
                      </Paper>
                      <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
                        <Typography variant="overline" color="text.secondary">{t('emailCampaigns.preview.html', { defaultValue: 'Resolved HTML' })}</Typography>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ '& img': { maxWidth: '100%' } }} dangerouslySetInnerHTML={{ __html: preview.htmlFinal || '<p>-</p>' }} />
                      </Paper>
                    </>
                  ) : (
                    <Alert severity="info">
                      {t('emailCampaigns.messages.previewPending', { defaultValue: 'Move to this step or click refresh preview to resolve the final email.' })}
                    </Alert>
                  )}
                  <Divider />
                  <ResponsiveActionBar justifyContent="flex-start">
                    <TextField
                      label={t('emailCampaigns.preview.testEmail', { defaultValue: 'Send test email to' })}
                      value={formState.testEmail}
                      onChange={(event) => setFormState((current) => ({ ...current, testEmail: event.target.value }))}
                      sx={{ ...fieldSx, minWidth: { xs: '100%', md: 320 } }}
                    />
                    <Button variant="outlined" startIcon={<MailOutlineRoundedIcon />} onClick={handleSendTest}>
                      {t('emailCampaigns.actions.sendTest', { defaultValue: 'Send test email' })}
                    </Button>
                  </ResponsiveActionBar>
                </Stack>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <ResponsiveActionBar justifyContent="space-between">
            <Stack direction="row" spacing={1}>
              <Button onClick={onClose}>{t('actions.cancel')}</Button>
              <Button disabled={activeStep === 0} onClick={() => setActiveStep((current) => Math.max(current - 1, 0))}>
                {t('common.back', { defaultValue: 'Back' })}
              </Button>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" startIcon={<SaveOutlinedIcon />} onClick={handleSaveDraft} disabled={savingDraft || sending}>
                {t('emailCampaigns.actions.saveDraft', { defaultValue: 'Save draft' })}
              </Button>
              {activeStep < stepLabels.length - 1 ? (
                <Button variant="contained" onClick={nextStep} disabled={savingDraft || sending}>
                  {t('common.next', { defaultValue: 'Next' })}
                </Button>
              ) : (
                <Button variant="contained" startIcon={formState.sendType === 'SCHEDULED' ? <ScheduleSendRoundedIcon /> : <SendRoundedIcon />} onClick={handleQueueCampaign} disabled={savingDraft || sending}>
                  {sending
                    ? t('actions.sending')
                    : formState.sendType === 'SCHEDULED'
                      ? t('emailCampaigns.actions.schedule', { defaultValue: 'Schedule campaign' })
                      : t('emailCampaigns.actions.sendNow', { defaultValue: 'Queue campaign' })}
                </Button>
              )}
            </Stack>
          </ResponsiveActionBar>
        </DialogActions>
      </Dialog>

      <CustomerPickerDialog
        open={customerPickerOpen}
        onClose={() => setCustomerPickerOpen(false)}
        filters={formState.audience.customerSelection.filters}
        selectedCustomerIds={formState.audience.customerSelection.selectedCustomerIds}
        onSelectionChange={(selectedCustomerIds) => setAudienceField('selectedCustomerIds', selectedCustomerIds)}
      />
    </>
  );
}

function CampaignRowActions({ row, onEdit, onView, onQueue, onCancel }) {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const isDraft = row.status === 'DRAFT';
  const isCancellable = !['SENT', 'CANCELLED'].includes(row.status);

  return (
    <>
      <IconButton size="small" onClick={(event) => setAnchorEl(event.currentTarget)}>
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
        <MenuItem onClick={() => { setAnchorEl(null); onView(row); }}>
          <VisibilityRoundedIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
          {t('emailCampaigns.actions.view', { defaultValue: 'View detail' })}
        </MenuItem>
        {isDraft && (
          <MenuItem onClick={() => { setAnchorEl(null); onEdit(row); }}>
            <EditOutlinedIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
            {t('actions.edit')}
          </MenuItem>
        )}
        {isDraft && (
          <MenuItem onClick={() => { setAnchorEl(null); onQueue(row); }}>
            <SendRoundedIcon fontSize="small" sx={{ mr: 1, color: 'success.main' }} />
            {t('emailCampaigns.actions.queue', { defaultValue: 'Queue now' })}
          </MenuItem>
        )}
        {isCancellable && (
          <MenuItem onClick={() => { setAnchorEl(null); onCancel(row); }}>
            <CancelScheduleSendRoundedIcon fontSize="small" sx={{ mr: 1, color: 'error.main' }} />
            {t('emailCampaigns.actions.cancelCampaign', { defaultValue: 'Cancel campaign' })}
          </MenuItem>
        )}
      </Menu>
    </>
  );
}

export default function EmailCampaignsLionTv() {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [templates, setTemplates] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [templateFilter, setTemplateFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [editingCampaignId, setEditingCampaignId] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const loadTemplates = async () => {
    setTemplatesLoading(true);
    try {
      const payload = await listEmailTemplates({ active: true, index: 0, size: 200 });
      const data = payload?.data ?? payload?.templates ?? [];
      setTemplates((Array.isArray(data) ? data : []).map(normalizeTemplateOption));
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || t('emailCampaigns.messages.templatesLoadError', { defaultValue: 'Unable to load active templates.' }), {
        variant: 'error'
      });
    } finally {
      setTemplatesLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    listEmailCampaigns({
      search: searchText || undefined,
      status: statusFilter === 'ALL' ? undefined : statusFilter,
      templateId: templateFilter || undefined,
      from: fromDate || undefined,
      to: toDate || undefined,
      index: page,
      size: rowsPerPage
    })
      .then((payload) => {
        if (!active) return;
        const data = payload?.data ?? payload?.campaigns ?? [];
        setCampaigns((Array.isArray(data) ? data : []).map(normalizeCampaign));
        setTotal(Number(payload?.total ?? 0));
      })
      .catch((error) => {
        if (!active) return;
        enqueueSnackbar(error?.response?.data?.message || t('emailCampaigns.messages.loadError', { defaultValue: 'Unable to load email campaigns.' }), {
          variant: 'error'
        });
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [searchText, statusFilter, templateFilter, fromDate, toDate, page, rowsPerPage, refreshKey, enqueueSnackbar, t]);

  const metrics = useMemo(() => ({
    drafts: campaigns.filter((item) => item.status === 'DRAFT').length,
    sent: campaigns.filter((item) => item.status === 'SENT').length,
    failed: campaigns.filter((item) => item.status === 'FAILED').length
  }), [campaigns]);

  const openCreate = () => {
    setEditingCampaignId(null);
    setWizardOpen(true);
  };

  const openEdit = (row) => {
    setEditingCampaignId(row.campaignId);
    setWizardOpen(true);
  };

  const openDetail = async (row) => {
    try {
      const payload = await getEmailCampaign(row.campaignId);
      setSelectedCampaign(normalizeCampaign(payload));
      setDetailOpen(true);
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || t('emailCampaigns.messages.loadCampaignError', { defaultValue: 'Unable to load campaign detail.' }), {
        variant: 'error'
      });
    }
  };

  const handleQueue = async (row) => {
    if (!window.confirm(t('emailCampaigns.messages.queueConfirm', { defaultValue: `Queue campaign ${row.name}?` }))) return;
    try {
      await queueEmailCampaign(row.campaignId);
      enqueueSnackbar(t('emailCampaigns.messages.queued', { defaultValue: 'Campaign queued for sending.' }), { variant: 'success' });
      setRefreshKey((value) => value + 1);
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || t('emailCampaigns.messages.queueError', { defaultValue: 'Unable to queue campaign.' }), {
        variant: 'error'
      });
    }
  };

  const handleCancelCampaign = async (row) => {
    if (!window.confirm(t('emailCampaigns.messages.cancelConfirm', { defaultValue: `Cancel campaign ${row.name}?` }))) return;
    try {
      await cancelEmailCampaign(row.campaignId);
      enqueueSnackbar(t('emailCampaigns.messages.cancelled', { defaultValue: 'Campaign cancelled.' }), { variant: 'success' });
      setRefreshKey((value) => value + 1);
      if (selectedCampaign?.campaignId === row.campaignId) {
        setSelectedCampaign((current) => (current ? { ...current, status: 'CANCELLED' } : current));
      }
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || t('emailCampaigns.messages.cancelError', { defaultValue: 'Unable to cancel campaign.' }), {
        variant: 'error'
      });
    }
  };

  return (
    <>
      <MainCard
        title={t('emailCampaigns.title', { defaultValue: 'Email Campaigns' })}
        secondary={
          <ResponsiveActionBar>
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => setRefreshKey((value) => value + 1)}>
              {t('actions.refresh')}
            </Button>
            <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
              {t('emailCampaigns.actions.new', { defaultValue: 'New campaign' })}
            </Button>
          </ResponsiveActionBar>
        }
      >
        <Stack spacing={2.5}>
          <ResponsiveMetricGrid>
            <Card sx={{ p: 2.25, borderRadius: 3 }}>
              <Typography variant="overline" color="text.secondary">{t('emailCampaigns.metrics.totalOnPage', { defaultValue: 'Campaigns on page' })}</Typography>
              <Typography variant="h3">{campaigns.length}</Typography>
            </Card>
            <Card sx={{ p: 2.25, borderRadius: 3 }}>
              <Typography variant="overline" color="text.secondary">{t('emailCampaigns.metrics.drafts', { defaultValue: 'Drafts on page' })}</Typography>
              <Typography variant="h3">{metrics.drafts}</Typography>
            </Card>
            <Card sx={{ p: 2.25, borderRadius: 3 }}>
              <Typography variant="overline" color="text.secondary">{t('emailCampaigns.metrics.sent', { defaultValue: 'Sent on page' })}</Typography>
              <Typography variant="h3">{metrics.sent}</Typography>
            </Card>
            <Card sx={{ p: 2.25, borderRadius: 3 }}>
              <Typography variant="overline" color="text.secondary">{t('emailCampaigns.metrics.failed', { defaultValue: 'Failed on page' })}</Typography>
              <Typography variant="h3">{metrics.failed}</Typography>
            </Card>
          </ResponsiveMetricGrid>

          <ResponsiveFilters>
            <TextField
              fullWidth
              label={t('emailCampaigns.filters.search', { defaultValue: 'Search campaigns' })}
              value={searchText}
              onChange={(event) => {
                setPage(0);
                setSearchText(event.target.value);
              }}
              sx={fieldSx}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                )
              }}
            />
            <FormControl fullWidth sx={fieldSx}>
              <InputLabel>{t('emailCampaigns.filters.status', { defaultValue: 'Status' })}</InputLabel>
              <Select
                label={t('emailCampaigns.filters.status', { defaultValue: 'Status' })}
                value={statusFilter}
                onChange={(event) => {
                  setPage(0);
                  setStatusFilter(event.target.value);
                }}
              >
                {campaignStatuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status === 'ALL' ? t('common.all', { defaultValue: 'All' }) : t(`emailCampaigns.status.${status}`, { defaultValue: status })}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={fieldSx}>
              <InputLabel>{t('emailCampaigns.filters.template', { defaultValue: 'Template' })}</InputLabel>
              <Select
                label={t('emailCampaigns.filters.template', { defaultValue: 'Template' })}
                value={templateFilter}
                onChange={(event) => {
                  setPage(0);
                  setTemplateFilter(event.target.value);
                }}
              >
                <MenuItem value="">{t('common.all', { defaultValue: 'All' })}</MenuItem>
                {templates.map((template) => (
                  <MenuItem key={template.templateId} value={template.templateId}>
                    {template.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label={t('emailCampaigns.filters.from', { defaultValue: 'From' })}
              type="date"
              value={fromDate}
              onChange={(event) => {
                setPage(0);
                setFromDate(event.target.value);
              }}
              sx={fieldSx}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label={t('emailCampaigns.filters.to', { defaultValue: 'To' })}
              type="date"
              value={toDate}
              onChange={(event) => {
                setPage(0);
                setToDate(event.target.value);
              }}
              sx={fieldSx}
              InputLabelProps={{ shrink: true }}
            />
          </ResponsiveFilters>

          {loading || templatesLoading ? (
            <Stack spacing={1.5}>
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} variant="rounded" height={72} />
              ))}
            </Stack>
          ) : isMobile ? (
            <Stack spacing={2}>
              {campaigns.map((row) => (
                <MobileSummaryCard
                  key={row.campaignId}
                  title={row.name}
                  subtitle={row.templateNameSnapshot || row.templateCodeSnapshot || '-'}
                  status={<CampaignStatusChip status={row.status} />}
                  actions={<CampaignRowActions row={row} onEdit={openEdit} onView={openDetail} onQueue={handleQueue} onCancel={handleCancelCampaign} />}
                  fields={[
                    { label: t('emailCampaigns.headers.sendType', { defaultValue: 'Send type' }), value: row.sendType },
                    { label: t('emailCampaigns.headers.totalRecipients', { defaultValue: 'Recipients' }), value: row.totalRecipients },
                    { label: t('emailCampaigns.headers.sentAt', { defaultValue: 'Sent at' }), value: formatDateTime(row.sentAt) }
                  ]}
                />
              ))}
            </Stack>
          ) : (
            <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('emailCampaigns.headers.name', { defaultValue: 'Campaign' })}</TableCell>
                      <TableCell>{t('emailCampaigns.headers.template', { defaultValue: 'Template' })}</TableCell>
                      <TableCell>{t('emailCampaigns.headers.status', { defaultValue: 'Status' })}</TableCell>
                      <TableCell>{t('emailCampaigns.headers.sendType', { defaultValue: 'Send type' })}</TableCell>
                      <TableCell>{t('emailCampaigns.headers.totalRecipients', { defaultValue: 'Recipients' })}</TableCell>
                      <TableCell>{t('emailCampaigns.headers.sentSuccessCount', { defaultValue: 'Sent' })}</TableCell>
                      <TableCell>{t('emailCampaigns.headers.sentFailureCount', { defaultValue: 'Failed' })}</TableCell>
                      <TableCell>{t('emailCampaigns.headers.createdAt', { defaultValue: 'Created' })}</TableCell>
                      <TableCell align="right">{t('common.actions', { defaultValue: 'Actions' })}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {campaigns.length ? (
                      campaigns.map((row) => (
                        <TableRow hover key={row.campaignId}>
                          <TableCell>
                            <Stack spacing={0.35}>
                              <Typography variant="subtitle2">{row.name}</Typography>
                              <Typography variant="caption" color="text.secondary">#{row.campaignId}</Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>{row.templateNameSnapshot || row.templateCodeSnapshot || '-'}</TableCell>
                          <TableCell><CampaignStatusChip status={row.status} /></TableCell>
                          <TableCell>{t(`emailCampaigns.sendType.${row.sendType}`, { defaultValue: row.sendType })}</TableCell>
                          <TableCell>{row.totalRecipients}</TableCell>
                          <TableCell>{row.sentSuccessCount}</TableCell>
                          <TableCell>{row.sentFailureCount}</TableCell>
                          <TableCell>{formatDateTime(row.createdAt)}</TableCell>
                          <TableCell align="right">
                            <CampaignRowActions row={row} onEdit={openEdit} onView={openDetail} onQueue={handleQueue} onCancel={handleCancelCampaign} />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9}><Alert severity="info">{t('emailCampaigns.messages.empty', { defaultValue: 'No campaigns found for the current filters.' })}</Alert></TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={total}
                page={page}
                onPageChange={(_, nextPage) => setPage(nextPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(event) => {
                  setRowsPerPage(Number(event.target.value));
                  setPage(0);
                }}
                rowsPerPageOptions={[10, 20, 50]}
              />
            </Paper>
          )}
        </Stack>
      </MainCard>

      <CampaignWizardDialog
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        templates={templates}
        refreshTemplates={loadTemplates}
        editingCampaignId={editingCampaignId}
        onSaved={() => setRefreshKey((value) => value + 1)}
      />

      <CampaignDetailDialog open={detailOpen} onClose={() => setDetailOpen(false)} campaign={selectedCampaign} />
    </>
  );
}
