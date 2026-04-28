import { useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
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
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PreviewRoundedIcon from '@mui/icons-material/PreviewRounded';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import SyncAltRoundedIcon from '@mui/icons-material/SyncAltRounded';

import MainCard from 'ui-component/cards/MainCard';
import DialogTitleWithClose from 'ui-component/dialogs/DialogTitleWithClose';
import MobileSummaryCard from 'ui-component/responsive/MobileSummaryCard';
import ResponsiveActionBar from 'ui-component/responsive/ResponsiveActionBar';
import ResponsiveFilters from 'ui-component/responsive/ResponsiveFilters';
import ResponsiveMetricGrid from 'ui-component/responsive/ResponsiveMetricGrid';
import {
  createEmailTemplate,
  deleteEmailTemplate,
  getEmailTemplate,
  listEmailTemplates,
  updateEmailTemplate,
  updateEmailTemplateStatus
} from 'api/email-campaigns';
import { buildImportantMatchTemplatePreset } from './emailTemplatePresets';

const fieldSx = {
  '& .MuiInputBase-root': { borderRadius: 2, minHeight: 48 },
  '& .MuiInputLabel-root': { fontWeight: 500 }
};

const INPUT_TYPE_OPTIONS = ['text', 'textarea', 'number', 'date', 'url', 'email', 'color', 'boolean'];
const VALUE_SOURCE_OPTIONS = ['MANUAL', 'RECIPIENT'];
const BINDING_KEY_OPTIONS = [
  'customerName',
  'customerEmail',
  'customerStatus',
  'channel',
  'customerPhone',
  'customerId',
  'fullName',
  'email',
  'username',
  'supportWhatsappUrl',
  'supportPhoneDisplay'
];
const ACTIVE_FILTERS = ['ALL', 'ACTIVE', 'INACTIVE'];
const PLACEHOLDER_REGEX = /{{\s*([a-zA-Z0-9_]+)\s*}}/g;

const SAMPLE_RECIPIENT_CONTEXT = {
  customerName: 'Alejandro Rosales',
  customerEmail: 'alejandro@example.com',
  customerStatus: 'ACTIVE',
  channel: 'WEB',
  customerPhone: '+50499999999',
  customerId: '101',
  fullName: 'Alejandro Rosales',
  email: 'alejandro@example.com',
  username: 'arosales',
  supportWhatsappUrl: 'https://wa.me/50499887766',
  supportPhoneDisplay: '50499887766'
};

const defaultVariable = (sortOrder = 1) => ({
  variableName: '',
  label: '',
  inputType: 'text',
  valueSource: 'MANUAL',
  bindingKey: '',
  required: false,
  defaultValue: '',
  helpText: '',
  sortOrder
});

const createDefaultFormState = () => ({
  code: '',
  name: '',
  subjectTemplate: '',
  htmlTemplate: '',
  description: '',
  category: '',
  active: true,
  variables: []
});

function extractPlaceholders(subjectTemplate = '', htmlTemplate = '') {
  const found = new Set();
  [subjectTemplate, htmlTemplate].forEach((template) => {
    if (!template) return;
    for (const match of template.matchAll(PLACEHOLDER_REGEX)) {
      if (match?.[1]) found.add(match[1]);
    }
  });
  return Array.from(found);
}

function humanizeVariableName(name = '') {
  if (!name) return '';
  return name
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^./, (char) => char.toUpperCase());
}

function syncVariablesWithTemplate(formState) {
  const placeholders = extractPlaceholders(formState.subjectTemplate, formState.htmlTemplate);
  const existingMap = new Map((formState.variables || []).map((variable) => [variable.variableName, variable]));
  return placeholders.map((placeholder, index) => {
    const existing = existingMap.get(placeholder);
    if (existing) {
      return {
        ...existing,
        variableName: placeholder,
        label: existing.label || humanizeVariableName(placeholder),
        sortOrder: index + 1
      };
    }
    return {
      ...defaultVariable(index + 1),
      variableName: placeholder,
      label: humanizeVariableName(placeholder)
    };
  });
}

function renderPreview(formState) {
  const values = {};
  (formState.variables || []).forEach((variable) => {
    if (!variable?.variableName) return;
    if ((variable.valueSource || 'MANUAL').toUpperCase() === 'RECIPIENT') {
      values[variable.variableName] = SAMPLE_RECIPIENT_CONTEXT[variable.bindingKey] || SAMPLE_RECIPIENT_CONTEXT[variable.variableName] || '';
    } else {
      values[variable.variableName] = variable.defaultValue || `[${variable.variableName}]`;
    }
  });

  const replace = (template = '') =>
    String(template).replace(PLACEHOLDER_REGEX, (_, variableName) => values[variableName] ?? '');

  return {
    subject: replace(formState.subjectTemplate),
    html: replace(formState.htmlTemplate)
  };
}

function normalizeTemplate(item = {}) {
  return {
    templateId: item.templateId ?? item.template_id ?? null,
    code: item.code ?? '',
    name: item.name ?? '',
    subjectTemplate: item.subjectTemplate ?? item.subject_template ?? '',
    htmlTemplate: item.htmlTemplate ?? item.html_template ?? '',
    description: item.description ?? '',
    category: item.category ?? '',
    active: Boolean(item.active),
    createdAt: item.createdAt ?? item.created_at ?? null,
    updatedAt: item.updatedAt ?? item.updated_at ?? null,
    createdBy: item.createdBy ?? item.created_by ?? '',
    updatedBy: item.updatedBy ?? item.updated_by ?? '',
    variables: (item.variables || []).map((variable, index) => ({
      templateVariableId: variable.templateVariableId ?? variable.template_variable_id ?? null,
      variableName: variable.variableName ?? variable.variable_name ?? '',
      label: variable.label ?? '',
      inputType: variable.inputType ?? variable.input_type ?? 'text',
      valueSource: (variable.valueSource ?? variable.value_source ?? 'MANUAL').toUpperCase(),
      bindingKey: variable.bindingKey ?? variable.binding_key ?? '',
      required: Boolean(variable.required),
      defaultValue: variable.defaultValue ?? variable.default_value ?? '',
      helpText: variable.helpText ?? variable.help_text ?? '',
      sortOrder: Number(variable.sortOrder ?? variable.sort_order ?? index + 1) || index + 1,
      active: variable.active ?? true
    }))
  };
}

function formatDateTime(value) {
  if (!value) return '-';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

function TemplateStatusChip({ active }) {
  const { t } = useTranslation();
  return (
    <Chip
      size="small"
      color={active ? 'success' : 'default'}
      variant="outlined"
      label={active ? t('emailTemplates.status.active', { defaultValue: 'Active' }) : t('emailTemplates.status.inactive', { defaultValue: 'Inactive' })}
      sx={{ fontWeight: 700 }}
    />
  );
}

function TemplateActions({ row, onEdit, onToggleStatus, onDelete, onCopyCode }) {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton size="small" onClick={(event) => setAnchorEl(event.currentTarget)}>
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            onEdit(row);
          }}
        >
          <EditOutlinedIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
          {t('actions.edit')}
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            onToggleStatus(row);
          }}
        >
          <SyncAltRoundedIcon fontSize="small" sx={{ mr: 1, color: 'warning.main' }} />
          {row.active
            ? t('emailTemplates.actions.deactivate', { defaultValue: 'Deactivate' })
            : t('emailTemplates.actions.activate', { defaultValue: 'Activate' })}
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            onCopyCode(row.code);
          }}
        >
          <ContentCopyRoundedIcon fontSize="small" sx={{ mr: 1, color: 'info.main' }} />
          {t('emailTemplates.actions.copyCode', { defaultValue: 'Copy code' })}
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            onDelete(row);
          }}
        >
          <DeleteOutlineIcon fontSize="small" sx={{ mr: 1, color: 'error.main' }} />
          {t('actions.delete')}
        </MenuItem>
      </Menu>
    </>
  );
}

export default function EmailTemplatesLionTv() {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [refreshKey, setRefreshKey] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTab, setDialogTab] = useState(0);
  const [editingTemplateId, setEditingTemplateId] = useState(null);
  const [formState, setFormState] = useState(() => createDefaultFormState());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);

    listEmailTemplates({
      search: searchText || undefined,
      category: categoryFilter || undefined,
      active: activeFilter === 'ALL' ? undefined : activeFilter === 'ACTIVE',
      index: page,
      size: rowsPerPage
    })
      .then((payload) => {
        if (!active) return;
        const data = payload?.data ?? payload?.templates ?? [];
        setRows((Array.isArray(data) ? data : []).map(normalizeTemplate));
        setTotal(Number(payload?.total ?? data?.length ?? 0));
      })
      .catch((error) => {
        if (!active) return;
        enqueueSnackbar(error?.response?.data?.message || t('emailTemplates.messages.loadError', { defaultValue: 'Unable to load email templates.' }), {
          variant: 'error'
        });
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [searchText, categoryFilter, activeFilter, page, rowsPerPage, refreshKey, enqueueSnackbar, t]);

  const metrics = useMemo(() => {
    const activeCount = rows.filter((item) => item.active).length;
    const inactiveCount = rows.filter((item) => !item.active).length;
    const variableCount = rows.reduce((acc, item) => acc + (item.variables?.length || 0), 0);
    return { activeCount, inactiveCount, variableCount };
  }, [rows]);

  const preview = useMemo(() => renderPreview(formState), [formState]);

  const openCreateDialog = () => {
    setEditingTemplateId(null);
    setFormState(createDefaultFormState());
    setDialogTab(0);
    setDialogOpen(true);
  };

  const openImportantMatchPresetDialog = () => {
    setEditingTemplateId(null);
    setFormState(buildImportantMatchTemplatePreset());
    setDialogTab(0);
    setDialogOpen(true);
    enqueueSnackbar(
      t('emailTemplates.messages.presetLoaded', {
        defaultValue: 'Important match preset loaded. Review the variables and save it.'
      }),
      { variant: 'info' }
    );
  };

  const openEditDialog = async (row) => {
    try {
      const payload = await getEmailTemplate(row.templateId);
      setEditingTemplateId(row.templateId);
      setFormState(normalizeTemplate(payload));
      setDialogTab(0);
      setDialogOpen(true);
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || t('emailTemplates.messages.loadOneError', { defaultValue: 'Unable to load template detail.' }), {
        variant: 'error'
      });
    }
  };

  const handleSave = async () => {
    if (!formState.code.trim() || !formState.name.trim() || !formState.subjectTemplate.trim() || !formState.htmlTemplate.trim()) {
      enqueueSnackbar(t('emailTemplates.messages.required', { defaultValue: 'Code, name, subject and HTML are required.' }), {
        variant: 'warning'
      });
      return;
    }

    const syncedVariables = syncVariablesWithTemplate(formState);
    const payload = {
      ...formState,
      code: formState.code.trim(),
      name: formState.name.trim(),
      subjectTemplate: formState.subjectTemplate,
      htmlTemplate: formState.htmlTemplate,
      description: formState.description?.trim() || '',
      category: formState.category?.trim() || '',
      variables: syncedVariables.map((variable, index) => ({
        variableName: variable.variableName.trim(),
        label: variable.label.trim(),
        inputType: variable.inputType,
        valueSource: variable.valueSource,
        bindingKey: variable.valueSource === 'RECIPIENT' ? variable.bindingKey || variable.variableName : null,
        required: Boolean(variable.required),
        defaultValue: variable.defaultValue || '',
        helpText: variable.helpText || '',
        sortOrder: index + 1
      }))
    };

    if (payload.variables.some((item) => !item.variableName || !item.label)) {
      enqueueSnackbar(t('emailTemplates.messages.variableRequired', { defaultValue: 'Every detected variable needs a name and label.' }), {
        variant: 'warning'
      });
      return;
    }

    setSaving(true);
    try {
      if (editingTemplateId) {
        await updateEmailTemplate(editingTemplateId, payload);
        enqueueSnackbar(t('emailTemplates.messages.updated', { defaultValue: 'Template updated successfully.' }), { variant: 'success' });
      } else {
        await createEmailTemplate(payload);
        enqueueSnackbar(t('emailTemplates.messages.created', { defaultValue: 'Template created successfully.' }), { variant: 'success' });
      }
      setDialogOpen(false);
      setRefreshKey((value) => value + 1);
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || t('emailTemplates.messages.saveError', { defaultValue: 'Unable to save template.' }), {
        variant: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (row) => {
    try {
      await updateEmailTemplateStatus(row.templateId, !row.active);
      enqueueSnackbar(
        row.active
          ? t('emailTemplates.messages.deactivated', { defaultValue: 'Template deactivated.' })
          : t('emailTemplates.messages.activated', { defaultValue: 'Template activated.' }),
        { variant: 'success' }
      );
      setRefreshKey((value) => value + 1);
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || t('emailTemplates.messages.statusError', { defaultValue: 'Unable to update template status.' }), {
        variant: 'error'
      });
    }
  };

  const handleDelete = async (row) => {
    if (
      !window.confirm(
        t('emailTemplates.messages.deleteConfirm', {
          name: row.name,
          defaultValue: `Delete template ${row.name}?`
        })
      )
    ) {
      return;
    }
    try {
      await deleteEmailTemplate(row.templateId);
      enqueueSnackbar(t('emailTemplates.messages.deleted', { defaultValue: 'Template removed successfully.' }), { variant: 'success' });
      setRefreshKey((value) => value + 1);
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || t('emailTemplates.messages.deleteError', { defaultValue: 'Unable to delete template.' }), {
        variant: 'error'
      });
    }
  };

  const handleCopyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code || '');
      enqueueSnackbar(t('emailTemplates.messages.codeCopied', { defaultValue: 'Template code copied.' }), { variant: 'success' });
    } catch {
      enqueueSnackbar(t('emailTemplates.messages.copyError', { defaultValue: 'Unable to copy template code.' }), { variant: 'warning' });
    }
  };

  const handleFormChange = (field, value) => {
    setFormState((current) => ({ ...current, [field]: value }));
  };

  const handleVariableChange = (index, field, value) => {
    setFormState((current) => ({
      ...current,
      variables: current.variables.map((variable, variableIndex) => {
        if (variableIndex !== index) return variable;
        const next = { ...variable, [field]: value };
        if (field === 'valueSource' && value !== 'RECIPIENT') {
          next.bindingKey = '';
        }
        return next;
      })
    }));
  };

  const addVariableRow = () => {
    setFormState((current) => ({
      ...current,
      variables: [...current.variables, defaultVariable(current.variables.length + 1)]
    }));
  };

  const removeVariableRow = (index) => {
    setFormState((current) => ({
      ...current,
      variables: current.variables.filter((_, variableIndex) => variableIndex !== index).map((variable, order) => ({ ...variable, sortOrder: order + 1 }))
    }));
  };

  const handleSyncVariables = () => {
    setFormState((current) => ({
      ...current,
      variables: syncVariablesWithTemplate(current)
    }));
  };

  const categoryOptions = useMemo(() => {
    const unique = new Set(rows.map((row) => row.category).filter(Boolean));
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [rows]);

  const renderMetrics = (
    <ResponsiveMetricGrid>
      <Card sx={{ p: 2.25, borderRadius: 3 }}>
        <Typography variant="overline" color="text.secondary">
          {t('emailTemplates.metrics.total', { defaultValue: 'Templates on page' })}
        </Typography>
        <Typography variant="h3">{rows.length}</Typography>
      </Card>
      <Card sx={{ p: 2.25, borderRadius: 3 }}>
        <Typography variant="overline" color="text.secondary">
          {t('emailTemplates.metrics.active', { defaultValue: 'Active' })}
        </Typography>
        <Typography variant="h3">{metrics.activeCount}</Typography>
      </Card>
      <Card sx={{ p: 2.25, borderRadius: 3 }}>
        <Typography variant="overline" color="text.secondary">
          {t('emailTemplates.metrics.variables', { defaultValue: 'Variables on page' })}
        </Typography>
        <Typography variant="h3">{metrics.variableCount}</Typography>
      </Card>
    </ResponsiveMetricGrid>
  );

  return (
    <>
      <MainCard
        title={t('emailTemplates.title', { defaultValue: 'Email Templates' })}
        secondary={
          <ResponsiveActionBar>
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => setRefreshKey((value) => value + 1)}>
              {t('actions.refresh')}
            </Button>
            <Button variant="outlined" startIcon={<AddIcon />} onClick={openImportantMatchPresetDialog}>
              {t('emailTemplates.actions.importantMatchPreset', { defaultValue: 'Important match preset' })}
            </Button>
            <Button variant="contained" startIcon={<AddIcon />} onClick={openCreateDialog}>
              {t('emailTemplates.actions.new', { defaultValue: 'New template' })}
            </Button>
          </ResponsiveActionBar>
        }
      >
        <Stack spacing={2.5}>
          {renderMetrics}

          <ResponsiveFilters>
            <TextField
              fullWidth
              label={t('emailTemplates.filters.search', { defaultValue: 'Search templates' })}
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
              <InputLabel>{t('emailTemplates.filters.category', { defaultValue: 'Category' })}</InputLabel>
              <Select
                label={t('emailTemplates.filters.category', { defaultValue: 'Category' })}
                value={categoryFilter}
                onChange={(event) => {
                  setPage(0);
                  setCategoryFilter(event.target.value);
                }}
              >
                <MenuItem value="">{t('common.all', { defaultValue: 'All' })}</MenuItem>
                {categoryOptions.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={fieldSx}>
              <InputLabel>{t('emailTemplates.filters.active', { defaultValue: 'Status' })}</InputLabel>
              <Select
                label={t('emailTemplates.filters.active', { defaultValue: 'Status' })}
                value={activeFilter}
                onChange={(event) => {
                  setPage(0);
                  setActiveFilter(event.target.value);
                }}
              >
                {ACTIVE_FILTERS.map((value) => (
                  <MenuItem key={value} value={value}>
                    {value === 'ALL'
                      ? t('common.all', { defaultValue: 'All' })
                      : value === 'ACTIVE'
                        ? t('emailTemplates.status.active', { defaultValue: 'Active' })
                        : t('emailTemplates.status.inactive', { defaultValue: 'Inactive' })}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </ResponsiveFilters>

          {loading ? (
            <Stack spacing={1.5}>
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} variant="rounded" height={72} />
              ))}
            </Stack>
          ) : isMobile ? (
            <Stack spacing={2}>
              {rows.map((row) => (
                <MobileSummaryCard
                  key={row.templateId}
                  title={row.name}
                  subtitle={row.code}
                  status={<TemplateStatusChip active={row.active} />}
                  actions={<TemplateActions row={row} onEdit={openEditDialog} onToggleStatus={handleToggleStatus} onDelete={handleDelete} onCopyCode={handleCopyCode} />}
                  fields={[
                    { label: t('emailTemplates.headers.category', { defaultValue: 'Category' }), value: row.category || '-' },
                    { label: t('emailTemplates.headers.variables', { defaultValue: 'Variables' }), value: row.variables?.length || 0 },
                    { label: t('emailTemplates.headers.updatedAt', { defaultValue: 'Updated' }), value: formatDateTime(row.updatedAt) }
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
                      <TableCell>{t('emailTemplates.headers.name', { defaultValue: 'Template' })}</TableCell>
                      <TableCell>{t('emailTemplates.headers.category', { defaultValue: 'Category' })}</TableCell>
                      <TableCell>{t('emailTemplates.headers.variables', { defaultValue: 'Variables' })}</TableCell>
                      <TableCell>{t('emailTemplates.headers.status', { defaultValue: 'Status' })}</TableCell>
                      <TableCell>{t('emailTemplates.headers.updatedAt', { defaultValue: 'Updated' })}</TableCell>
                      <TableCell align="right">{t('common.actions', { defaultValue: 'Actions' })}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.length ? (
                      rows.map((row) => (
                        <TableRow hover key={row.templateId}>
                          <TableCell>
                            <Stack spacing={0.35}>
                              <Typography variant="subtitle2">{row.name}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {row.code}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>{row.category || '-'}</TableCell>
                          <TableCell>{row.variables?.length || 0}</TableCell>
                          <TableCell>
                            <TemplateStatusChip active={row.active} />
                          </TableCell>
                          <TableCell>{formatDateTime(row.updatedAt)}</TableCell>
                          <TableCell align="right">
                            <TemplateActions row={row} onEdit={openEditDialog} onToggleStatus={handleToggleStatus} onDelete={handleDelete} onCopyCode={handleCopyCode} />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6}>
                          <Alert severity="info">{t('emailTemplates.messages.empty', { defaultValue: 'No templates found for the current filters.' })}</Alert>
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
          )}
        </Stack>
      </MainCard>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="xl">
        <DialogTitleWithClose onClose={() => setDialogOpen(false)}>
          <Stack spacing={0.5}>
            <Typography variant="h4">
              {editingTemplateId
                ? t('emailTemplates.dialog.editTitle', { defaultValue: 'Edit email template' })
                : t('emailTemplates.dialog.createTitle', { defaultValue: 'Create email template' })}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('emailTemplates.dialog.subtitle', {
                defaultValue: 'Manage reusable HTML templates and declare which variables will be filled dynamically in campaigns.'
              })}
            </Typography>
          </Stack>
        </DialogTitleWithClose>
        <DialogContent dividers>
          <Stack spacing={2}>
            <Tabs value={dialogTab} onChange={(_, value) => setDialogTab(value)} variant="scrollable" allowScrollButtonsMobile>
              <Tab label={t('emailTemplates.tabs.general', { defaultValue: 'General' })} />
              <Tab label={t('emailTemplates.tabs.html', { defaultValue: 'HTML' })} />
              <Tab label={t('emailTemplates.tabs.variables', { defaultValue: 'Variables' })} />
              <Tab label={t('emailTemplates.tabs.preview', { defaultValue: 'Preview' })} icon={<PreviewRoundedIcon fontSize="small" />} iconPosition="start" />
            </Tabs>

            {dialogTab === 0 && (
              <Stack spacing={2}>
                {!editingTemplateId && (
                  <Alert
                    severity="info"
                    action={
                      <Button color="inherit" size="small" onClick={openImportantMatchPresetDialog}>
                        {t('emailTemplates.actions.loadPreset', { defaultValue: 'Load preset' })}
                      </Button>
                    }
                  >
                    {t('emailTemplates.messages.presetHelp', {
                      defaultValue: 'You can start from a reusable preset for important matches and adjust the copy before saving.'
                    })}
                  </Alert>
                )}
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' }, gap: 2 }}>
                  <TextField
                    label={t('emailTemplates.form.code', { defaultValue: 'Code' })}
                    value={formState.code}
                    onChange={(event) => handleFormChange('code', event.target.value.toUpperCase())}
                    sx={fieldSx}
                    helperText={t('emailTemplates.form.codeHelper', { defaultValue: 'Unique identifier per owner.' })}
                  />
                  <TextField
                    label={t('emailTemplates.form.name', { defaultValue: 'Name' })}
                    value={formState.name}
                    onChange={(event) => handleFormChange('name', event.target.value)}
                    sx={fieldSx}
                  />
                  <TextField
                    label={t('emailTemplates.form.category', { defaultValue: 'Category' })}
                    value={formState.category}
                    onChange={(event) => handleFormChange('category', event.target.value)}
                    sx={fieldSx}
                  />
                  <FormControlLabel
                    sx={{ alignSelf: 'center' }}
                    control={<Switch checked={Boolean(formState.active)} onChange={(event) => handleFormChange('active', event.target.checked)} />}
                    label={t('emailTemplates.form.active', { defaultValue: 'Template active' })}
                  />
                </Box>
                <TextField
                  label={t('emailTemplates.form.subjectTemplate', { defaultValue: 'Subject template' })}
                  value={formState.subjectTemplate}
                  onChange={(event) => handleFormChange('subjectTemplate', event.target.value)}
                  sx={fieldSx}
                  helperText={t('emailTemplates.form.placeholderHint', { defaultValue: 'Use placeholders like {{customerName}}.' })}
                />
                <TextField
                  label={t('emailTemplates.form.description', { defaultValue: 'Description' })}
                  value={formState.description}
                  onChange={(event) => handleFormChange('description', event.target.value)}
                  sx={fieldSx}
                  multiline
                  minRows={3}
                />
              </Stack>
            )}

            {dialogTab === 1 && (
              <Stack spacing={2}>
                <Alert severity="info">
                  {t('emailTemplates.form.htmlHelp', {
                    defaultValue: 'Paste the full HTML and subject placeholders. Then sync variables to define labels, types and defaults.'
                  })}
                </Alert>
                <TextField
                  label={t('emailTemplates.form.htmlTemplate', { defaultValue: 'HTML template' })}
                  value={formState.htmlTemplate}
                  onChange={(event) => handleFormChange('htmlTemplate', event.target.value)}
                  multiline
                  minRows={18}
                  sx={fieldSx}
                />
              </Stack>
            )}

            {dialogTab === 2 && (
              <Stack spacing={2}>
                <ResponsiveActionBar justifyContent="space-between">
                  <Button variant="outlined" startIcon={<SyncAltRoundedIcon />} onClick={handleSyncVariables}>
                    {t('emailTemplates.actions.syncVariables', { defaultValue: 'Detect placeholders' })}
                  </Button>
                  <Button variant="text" startIcon={<AddIcon />} onClick={addVariableRow}>
                    {t('emailTemplates.actions.addVariable', { defaultValue: 'Add variable row' })}
                  </Button>
                </ResponsiveActionBar>
                {!formState.variables.length ? (
                  <Alert severity="warning">
                    {t('emailTemplates.messages.noVariables', {
                      defaultValue: 'No variables detected yet. Use placeholders in subject/HTML and click Detect placeholders.'
                    })}
                  </Alert>
                ) : (
                  formState.variables.map((variable, index) => (
                    <Paper key={`${variable.variableName || 'variable'}-${index}`} variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
                      <Stack spacing={2}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                          <Stack spacing={0.25}>
                            <Typography variant="subtitle2">{variable.variableName || t('emailTemplates.form.variable', { defaultValue: 'Variable' })}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {t('emailTemplates.form.variableOrder', { defaultValue: 'Sort order' })}: {variable.sortOrder || index + 1}
                            </Typography>
                          </Stack>
                          <Tooltip title={t('actions.delete')}>
                            <IconButton color="error" onClick={() => removeVariableRow(index)}>
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' }, gap: 2 }}>
                          <TextField label={t('emailTemplates.form.variableName', { defaultValue: 'Variable name' })} value={variable.variableName} onChange={(event) => handleVariableChange(index, 'variableName', event.target.value)} sx={fieldSx} />
                          <TextField label={t('emailTemplates.form.label', { defaultValue: 'Label' })} value={variable.label} onChange={(event) => handleVariableChange(index, 'label', event.target.value)} sx={fieldSx} />
                          <TextField label={t('emailTemplates.form.helpText', { defaultValue: 'Help text' })} value={variable.helpText} onChange={(event) => handleVariableChange(index, 'helpText', event.target.value)} sx={fieldSx} />
                          <FormControl fullWidth sx={fieldSx}>
                            <InputLabel>{t('emailTemplates.form.inputType', { defaultValue: 'Input type' })}</InputLabel>
                            <Select label={t('emailTemplates.form.inputType', { defaultValue: 'Input type' })} value={variable.inputType} onChange={(event) => handleVariableChange(index, 'inputType', event.target.value)}>
                              {INPUT_TYPE_OPTIONS.map((option) => (
                                <MenuItem key={option} value={option}>
                                  {option}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          <FormControl fullWidth sx={fieldSx}>
                            <InputLabel>{t('emailTemplates.form.valueSource', { defaultValue: 'Value source' })}</InputLabel>
                            <Select label={t('emailTemplates.form.valueSource', { defaultValue: 'Value source' })} value={variable.valueSource} onChange={(event) => handleVariableChange(index, 'valueSource', event.target.value)}>
                              {VALUE_SOURCE_OPTIONS.map((option) => (
                                <MenuItem key={option} value={option}>
                                  {option}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          {variable.valueSource === 'RECIPIENT' ? (
                            <FormControl fullWidth sx={fieldSx}>
                              <InputLabel>{t('emailTemplates.form.bindingKey', { defaultValue: 'Recipient binding' })}</InputLabel>
                              <Select label={t('emailTemplates.form.bindingKey', { defaultValue: 'Recipient binding' })} value={variable.bindingKey || ''} onChange={(event) => handleVariableChange(index, 'bindingKey', event.target.value)}>
                                {BINDING_KEY_OPTIONS.map((option) => (
                                  <MenuItem key={option} value={option}>
                                    {option}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          ) : (
                            <TextField
                              label={t('emailTemplates.form.defaultValue', { defaultValue: 'Default value' })}
                              value={variable.defaultValue || ''}
                              onChange={(event) => handleVariableChange(index, 'defaultValue', event.target.value)}
                              sx={fieldSx}
                            />
                          )}
                        </Box>
                        <FormControlLabel
                          control={<Switch checked={Boolean(variable.required)} onChange={(event) => handleVariableChange(index, 'required', event.target.checked)} />}
                          label={t('emailTemplates.form.required', { defaultValue: 'Required variable' })}
                        />
                      </Stack>
                    </Paper>
                  ))
                )}
              </Stack>
            )}

            {dialogTab === 3 && (
              <Stack spacing={2}>
                <Alert severity="info">
                  {t('emailTemplates.preview.note', {
                    defaultValue: 'This preview uses default values for manual variables and a sample customer context for recipient-bound variables.'
                  })}
                </Alert>
                <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
                  <Typography variant="overline" color="text.secondary">
                    {t('emailTemplates.preview.subject', { defaultValue: 'Resolved subject' })}
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 0.75 }}>
                    {preview.subject || '-'}
                  </Typography>
                </Paper>
                <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
                  <Typography variant="overline" color="text.secondary">
                    {t('emailTemplates.preview.html', { defaultValue: 'Resolved HTML' })}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ '& img': { maxWidth: '100%' } }} dangerouslySetInnerHTML={{ __html: preview.html || '<p>-</p>' }} />
                </Paper>
              </Stack>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setDialogOpen(false)}>{t('actions.cancel')}</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? t('actions.saving') : editingTemplateId ? t('actions.save') : t('actions.create')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
