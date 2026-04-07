import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import { alpha } from '@mui/material/styles';
import useAuth from 'hooks/useAuth';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RefreshIcon from '@mui/icons-material/Refresh';
import RouteOutlinedIcon from '@mui/icons-material/RouteOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';

import MainCard from 'ui-component/cards/MainCard';
import {
  downloadM3uByLineId,
  getLineSourceByLine,
  getProviderTemplate,
  importCatalogByLineId,
  listLineOptions,
  listProviderTemplates,
  upsertLineSource,
  upsertProviderTemplate
} from 'api/m3u-catalog';

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString();
}

function buildDownloadFilename(lineId, contentDisposition) {
  const fromHeader = /filename="?([^"]+)"?/i.exec(contentDisposition || '')?.[1];
  if (fromHeader) return fromHeader;
  return `playlist_${String(lineId || 'line').replace(/[^a-zA-Z0-9_-]/g, '_')}.m3u`;
}

function triggerBrowserDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function extractErrorMessage(error, fallback) {
  return error?.response?.data?.message || error?.message || fallback;
}

function buildTemplatePreview(template) {
  const baseUrl = String(template?.baseUrl || '').trim().replace(/\/+$/, '');
  if (!baseUrl) return '-';
  const playlistType = String(template?.playlistType || 'm3u_plus').trim() || 'm3u_plus';
  const outputFormat = String(template?.outputFormat || 'ts').trim() || 'ts';
  return `${baseUrl}/get.php?username={username_encode}&password={password_encode}&type=${playlistType}&output=${outputFormat}`;
}

function StatusCard({ label, value, helper, tone = 'primary' }) {
  return (
    <Paper
      variant="outlined"
      sx={(theme) => ({
        p: 1.75,
        height: '100%',
        borderColor: alpha(theme.palette[tone].main, 0.25),
        backgroundColor: alpha(theme.palette[tone].main, 0.06)
      })}
    >
      <Stack spacing={0.5}>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.15, wordBreak: 'break-word' }}>
          {value}
        </Typography>
        {helper ? (
          <Typography variant="caption" color="text.secondary">
            {helper}
          </Typography>
        ) : null}
      </Stack>
    </Paper>
  );
}

function FlowCard({ step, title, description, complete, readyLabel = 'Ready', pendingLabel = 'Pending' }) {
  return (
    <Paper
      variant="outlined"
      sx={(theme) => ({
        p: 1.75,
        borderRadius: 2,
        borderColor: complete ? alpha(theme.palette.success.main, 0.35) : alpha(theme.palette.warning.main, 0.28),
        backgroundColor: complete ? alpha(theme.palette.success.main, 0.06) : alpha(theme.palette.warning.main, 0.06)
      })}
    >
      <Stack direction="row" spacing={1.5} alignItems="flex-start">
        <Box
          sx={(theme) => ({
            minWidth: 32,
            height: 32,
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            fontSize: 13,
            fontWeight: 700,
            color: complete ? theme.palette.success.dark : theme.palette.warning.dark,
            backgroundColor: complete ? alpha(theme.palette.success.main, 0.14) : alpha(theme.palette.warning.main, 0.14)
          })}
        >
          {step}
        </Box>
        <Stack spacing={0.5} sx={{ minWidth: 0 }}>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              {title}
            </Typography>
            <Chip
              size="small"
              color={complete ? 'success' : 'warning'}
              variant={complete ? 'filled' : 'outlined'}
              label={complete ? readyLabel : pendingLabel}
            />
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
}

function ChecklistItem({ done, label }) {
  const Icon = done ? CheckCircleOutlineIcon : RadioButtonUncheckedIcon;
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Icon color={done ? 'success' : 'disabled'} fontSize="small" />
      <Typography variant="body2" color={done ? 'text.primary' : 'text.secondary'}>
        {label}
      </Typography>
    </Stack>
  );
}

const defaultLineSourceForm = {
  lineId: '',
  usernameEncode: '',
  sourceProviderName: '',
  cacheTtlMinutes: 30,
  active: true,
  lastDownloadedAt: null,
  updatedAt: null
};

const defaultProviderTemplateForm = {
  providerCode: '',
  baseUrl: '',
  playlistType: 'm3u_plus',
  outputFormat: 'ts',
  active: true,
  createdAt: null,
  updatedAt: null
};

export default function M3uLineSourcesLionTv() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const { accessToken } = useAuth();

  const [lineOptions, setLineOptions] = useState([]);
  const [loadingLineOptions, setLoadingLineOptions] = useState(false);
  const [selectedLineId, setSelectedLineId] = useState('');

  const [providerTemplates, setProviderTemplates] = useState([]);
  const [loadingProviderTemplates, setLoadingProviderTemplates] = useState(false);
  const [selectedProviderCode, setSelectedProviderCode] = useState('');

  const [lineSourceForm, setLineSourceForm] = useState(defaultLineSourceForm);
  const [providerTemplateForm, setProviderTemplateForm] = useState(defaultProviderTemplateForm);

  const [loadingLineSource, setLoadingLineSource] = useState(false);
  const [savingLineSource, setSavingLineSource] = useState(false);
  const [loadingProviderTemplate, setLoadingProviderTemplate] = useState(false);
  const [savingProviderTemplate, setSavingProviderTemplate] = useState(false);

  const [importing, setImporting] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [fullTestLoading, setFullTestLoading] = useState(false);

  const selectedLineOption = useMemo(
    () => lineOptions.find((option) => option.lineId === selectedLineId) || null,
    [lineOptions, selectedLineId]
  );

  const providerOptions = useMemo(() => {
    const values = new Set();
    lineOptions.forEach((option) => {
      if (option.provider) values.add(option.provider);
    });
    providerTemplates.forEach((template) => {
      if (template.providerCode) values.add(template.providerCode);
    });
    if (lineSourceForm.sourceProviderName) values.add(lineSourceForm.sourceProviderName);
    if (selectedLineOption?.provider) values.add(selectedLineOption.provider);
    if (selectedProviderCode) values.add(selectedProviderCode);
    return Array.from(values).sort((a, b) => a.localeCompare(b));
  }, [lineOptions, providerTemplates, lineSourceForm.sourceProviderName, selectedLineOption?.provider, selectedProviderCode]);

  const refreshLineOptions = useCallback(async () => {
    if (!accessToken) return;
    setLoadingLineOptions(true);
    try {
      const options = await listLineOptions({ accessToken });
      const normalized = options.map((option) => ({
        ...option,
        provider: option.provider || '',
        label: `${option.lineId} / ${option.usernameEncode || option.lineId}${option.provider ? ` (${option.provider})` : ''}`
      }));
      setLineOptions(normalized);
    } catch (error) {
      enqueueSnackbar(extractErrorMessage(error, t('catalog.messages.lineOptionsLoadError', 'Could not load active lines.')), {
        variant: 'error'
      });
    } finally {
      setLoadingLineOptions(false);
    }
  }, [accessToken, enqueueSnackbar, t]);

  const refreshProviderTemplates = useCallback(async () => {
    if (!accessToken) return;
    setLoadingProviderTemplates(true);
    try {
      const items = await listProviderTemplates({ accessToken });
      setProviderTemplates(items);
    } catch (error) {
      enqueueSnackbar(extractErrorMessage(error, t('catalog.messages.providerTemplatesLoadError', 'Could not load Xtream templates.')), {
        variant: 'error'
      });
    } finally {
      setLoadingProviderTemplates(false);
    }
  }, [accessToken, enqueueSnackbar, t]);

  const loadProviderTemplateConfig = useCallback(
    async (providerCodeValue) => {
      const providerCode = String(providerCodeValue || '').trim();
      if (!providerCode) {
        setProviderTemplateForm(defaultProviderTemplateForm);
        return;
      }

      setLoadingProviderTemplate(true);
      try {
        const template = await getProviderTemplate({ accessToken, providerCode });
        setProviderTemplateForm({
          providerCode: template.providerCode || providerCode,
          baseUrl: template.baseUrl || '',
          playlistType: template.playlistType || 'm3u_plus',
          outputFormat: template.outputFormat || 'ts',
          active: template.active !== undefined ? Boolean(template.active) : true,
          createdAt: template.createdAt || null,
          updatedAt: template.updatedAt || null
        });
      } catch (error) {
        if (error?.response?.status === 404) {
          setProviderTemplateForm({
            providerCode,
            baseUrl: '',
            playlistType: 'm3u_plus',
            outputFormat: 'ts',
            active: true,
            createdAt: null,
            updatedAt: null
          });
          enqueueSnackbar(t('catalog.messages.providerTemplateNotFound', 'No template found for selected provider.'), {
            variant: 'info'
          });
        } else {
          enqueueSnackbar(
            extractErrorMessage(error, t('catalog.messages.providerTemplateLoadError', 'Could not load Xtream template.')),
            {
              variant: 'error'
            }
          );
        }
      } finally {
        setLoadingProviderTemplate(false);
      }
    },
    [accessToken, enqueueSnackbar, t]
  );

  const loadLineSourceConfig = useCallback(
    async (lineIdValue) => {
      const lineId = String(lineIdValue || lineSourceForm.lineId || '').trim();
      if (!lineId) {
        enqueueSnackbar(t('catalog.messages.lineRequired', 'Line ID is required.'), { variant: 'warning' });
        return;
      }

      const fallbackProvider = selectedLineOption?.provider || '';
      const fallbackName = selectedLineOption?.usernameEncode || '';

      setLoadingLineSource(true);
      try {
        const source = await getLineSourceByLine({ accessToken, lineId });
        const resolvedProvider = source.sourceProviderName || fallbackProvider;
        setLineSourceForm({
          lineId: source.lineId || lineId,
          usernameEncode: source.usernameEncode || fallbackName,
          sourceProviderName: resolvedProvider,
          cacheTtlMinutes: source.cacheTtlMinutes ?? 30,
          active: source.active !== undefined ? Boolean(source.active) : true,
          lastDownloadedAt: source.lastDownloadedAt || null,
          updatedAt: source.updatedAt || null
        });
        if (resolvedProvider) {
          setSelectedProviderCode(resolvedProvider);
        }
      } catch (error) {
        if (error?.response?.status === 404) {
          setLineSourceForm({
            lineId,
            usernameEncode: fallbackName,
            sourceProviderName: fallbackProvider,
            cacheTtlMinutes: 30,
            active: true,
            lastDownloadedAt: null,
            updatedAt: null
          });
          if (fallbackProvider) {
            setSelectedProviderCode(fallbackProvider);
          }
          enqueueSnackbar(t('catalog.messages.lineSourceNotFound', 'No source config found for selected line.'), { variant: 'info' });
        } else {
          enqueueSnackbar(extractErrorMessage(error, t('catalog.messages.lineSourceLoadError', 'Could not load line source config.')), {
            variant: 'error'
          });
        }
      } finally {
        setLoadingLineSource(false);
      }
    },
    [accessToken, enqueueSnackbar, lineSourceForm.lineId, selectedLineOption?.provider, selectedLineOption?.usernameEncode, t]
  );

  const saveLineSourceConfig = useCallback(async () => {
    const lineId = String(lineSourceForm.lineId || '').trim();
    const sourceProviderName = String(lineSourceForm.sourceProviderName || '').trim();
    if (!lineId || !sourceProviderName) {
      enqueueSnackbar(t('catalog.messages.lineSourceRequiredFields', 'Line ID and provider are required.'), {
        variant: 'warning'
      });
      return;
    }

    setSavingLineSource(true);
    try {
      const saved = await upsertLineSource({
        accessToken,
        payload: {
          lineId,
          sourceProviderName,
          cacheTtlMinutes: Number(lineSourceForm.cacheTtlMinutes) || 30,
          active: Boolean(lineSourceForm.active)
        }
      });

      setLineSourceForm((previous) => ({
        ...previous,
        lineId: saved.lineId || lineId,
        usernameEncode: saved.usernameEncode || previous.usernameEncode,
        sourceProviderName: saved.sourceProviderName || sourceProviderName,
        cacheTtlMinutes: saved.cacheTtlMinutes ?? 30,
        active: saved.active !== undefined ? Boolean(saved.active) : true,
        lastDownloadedAt: saved.lastDownloadedAt || null,
        updatedAt: saved.updatedAt || null
      }));
      setSelectedProviderCode(saved.sourceProviderName || sourceProviderName);
      enqueueSnackbar(t('catalog.messages.lineSourceSaved', 'Line source saved successfully.'), { variant: 'success' });
      await refreshLineOptions();
    } catch (error) {
      enqueueSnackbar(extractErrorMessage(error, t('catalog.messages.lineSourceSaveError', 'Could not save line source.')), {
        variant: 'error'
      });
    } finally {
      setSavingLineSource(false);
    }
  }, [accessToken, enqueueSnackbar, lineSourceForm.active, lineSourceForm.cacheTtlMinutes, lineSourceForm.lineId, lineSourceForm.sourceProviderName, refreshLineOptions, t]);

  const saveProviderTemplateConfig = useCallback(async () => {
    const providerCode = String(providerTemplateForm.providerCode || '').trim();
    const baseUrl = String(providerTemplateForm.baseUrl || '').trim();
    if (!providerCode || !baseUrl) {
      enqueueSnackbar(t('catalog.messages.providerTemplateRequiredFields', 'Provider and baseUrl are required.'), {
        variant: 'warning'
      });
      return;
    }

    setSavingProviderTemplate(true);
    try {
      const saved = await upsertProviderTemplate({
        accessToken,
        providerCode,
        payload: {
          baseUrl,
          playlistType: providerTemplateForm.playlistType?.trim() || 'm3u_plus',
          outputFormat: providerTemplateForm.outputFormat?.trim() || 'ts',
          active: Boolean(providerTemplateForm.active)
        }
      });

      setProviderTemplateForm({
        providerCode: saved.providerCode || providerCode,
        baseUrl: saved.baseUrl || baseUrl,
        playlistType: saved.playlistType || 'm3u_plus',
        outputFormat: saved.outputFormat || 'ts',
        active: saved.active !== undefined ? Boolean(saved.active) : true,
        createdAt: saved.createdAt || null,
        updatedAt: saved.updatedAt || null
      });
      setSelectedProviderCode(saved.providerCode || providerCode);
      enqueueSnackbar(t('catalog.messages.providerTemplateSaved', 'Xtream template saved successfully.'), { variant: 'success' });
      await refreshProviderTemplates();
    } catch (error) {
      enqueueSnackbar(
        extractErrorMessage(error, t('catalog.messages.providerTemplateSaveError', 'Could not save Xtream template.')),
        { variant: 'error' }
      );
    } finally {
      setSavingProviderTemplate(false);
    }
  }, [accessToken, enqueueSnackbar, providerTemplateForm.active, providerTemplateForm.baseUrl, providerTemplateForm.outputFormat, providerTemplateForm.playlistType, providerTemplateForm.providerCode, refreshProviderTemplates, t]);

  const handleImportCatalog = useCallback(async () => {
    const lineId = String(selectedLineId || lineSourceForm.lineId || '').trim();
    if (!lineId) {
      enqueueSnackbar(t('catalog.messages.lineRequiredForImport', 'Select a line to import.'), { variant: 'warning' });
      return;
    }

    setImporting(true);
    try {
      const result = await importCatalogByLineId({ accessToken, lineId });
      enqueueSnackbar(
        t('catalog.messages.importSuccess', 'Import completed.') +
          ` parsed=${result?.parsedItems ?? 0}, inserted=${result?.insertedItems ?? 0}, updated=${result?.updatedItems ?? 0}`,
        { variant: 'success' }
      );
      await loadLineSourceConfig(lineId);
    } catch (error) {
      enqueueSnackbar(extractErrorMessage(error, t('catalog.messages.importError', 'Could not import catalog.')), {
        variant: 'error'
      });
    } finally {
      setImporting(false);
    }
  }, [accessToken, enqueueSnackbar, lineSourceForm.lineId, loadLineSourceConfig, selectedLineId, t]);

  const handleDownloadPlaylist = useCallback(async () => {
    const lineId = String(selectedLineId || lineSourceForm.lineId || '').trim();
    if (!lineId) {
      enqueueSnackbar(t('catalog.messages.lineRequiredForDownload', 'Select a line to download playlist.'), {
        variant: 'warning'
      });
      return;
    }

    setDownloading(true);
    try {
      const { blob, contentDisposition } = await downloadM3uByLineId({ accessToken, lineId });
      triggerBrowserDownload(blob, buildDownloadFilename(lineId, contentDisposition));
      enqueueSnackbar(t('catalog.messages.downloadSuccess', 'Playlist downloaded successfully.'), { variant: 'success' });
      await loadLineSourceConfig(lineId);
    } catch (error) {
      enqueueSnackbar(extractErrorMessage(error, t('catalog.messages.downloadError', 'Could not download playlist.')), {
        variant: 'error'
      });
    } finally {
      setDownloading(false);
    }
  }, [accessToken, enqueueSnackbar, lineSourceForm.lineId, loadLineSourceConfig, selectedLineId, t]);

  const handleFullFlowTest = useCallback(async () => {
    const lineId = String(selectedLineId || lineSourceForm.lineId || '').trim();
    if (!lineId) {
      enqueueSnackbar(t('catalog.messages.lineRequiredForImport', 'Select a line to import.'), { variant: 'warning' });
      return;
    }

    setFullTestLoading(true);
    try {
      const importResult = await importCatalogByLineId({ accessToken, lineId });
      const { blob, contentDisposition } = await downloadM3uByLineId({ accessToken, lineId });
      triggerBrowserDownload(blob, buildDownloadFilename(lineId, contentDisposition));
      enqueueSnackbar(
        t('catalog.messages.fullFlowSuccess', 'Full flow OK: import + download.') + ` parsed=${importResult?.parsedItems ?? 0}`,
        { variant: 'success' }
      );
      await loadLineSourceConfig(lineId);
    } catch (error) {
      enqueueSnackbar(extractErrorMessage(error, t('catalog.messages.fullFlowError', 'Full flow test failed.')), {
        variant: 'error'
      });
    } finally {
      setFullTestLoading(false);
    }
  }, [accessToken, enqueueSnackbar, lineSourceForm.lineId, loadLineSourceConfig, selectedLineId, t]);

  useEffect(() => {
    refreshLineOptions();
    refreshProviderTemplates();
  }, [refreshLineOptions, refreshProviderTemplates]);

  useEffect(() => {
    if (!selectedLineOption) {
      return;
    }

    setLineSourceForm((previous) => ({
      ...previous,
      lineId: selectedLineOption.lineId,
      usernameEncode: selectedLineOption.usernameEncode || '',
      sourceProviderName: selectedLineOption.provider || ''
    }));
    setSelectedProviderCode(selectedLineOption.provider || '');
    loadLineSourceConfig(selectedLineOption.lineId);
  }, [loadLineSourceConfig, selectedLineOption]);

  useEffect(() => {
    if (!selectedProviderCode) {
      setProviderTemplateForm(defaultProviderTemplateForm);
      return;
    }
    loadProviderTemplateConfig(selectedProviderCode);
  }, [loadProviderTemplateConfig, selectedProviderCode]);

  const activeLineId = String(selectedLineId || lineSourceForm.lineId || '').trim();
  const activeProviderCode = String(lineSourceForm.sourceProviderName || selectedProviderCode || selectedLineOption?.provider || '').trim();
  const lineSelected = Boolean(activeLineId);
  const lineConfigured = Boolean(lineSourceForm.lineId && lineSourceForm.sourceProviderName);
  const templateConfigured = Boolean(activeProviderCode && providerTemplateForm.baseUrl.trim());
  const flowReady = Boolean(lineSelected && lineConfigured && templateConfigured);
  const templatePreview = buildTemplatePreview(providerTemplateForm);
  const operationalChecklist = [
    { key: 'line', done: lineSelected, label: t('catalog.flow.linePickBody', 'Pick the line you want to operate.') },
    { key: 'source', done: lineConfigured, label: t('catalog.flow.lineAssignBody', 'Save provider and TTL for the selected line.') },
    { key: 'template', done: templateConfigured, label: t('catalog.flow.templateBody', 'Save an Xtream template for the assigned provider.') }
  ];

  const workflowSteps = [
    {
      step: '01',
      title: t('catalog.flow.linePickTitle', 'Choose the line'),
      description: t('catalog.flow.linePickBody', 'Pick the line you want to operate.'),
      complete: lineSelected
    },
    {
      step: '02',
      title: t('catalog.flow.lineAssignTitle', 'Save line settings'),
      description: t('catalog.flow.lineAssignBody', 'Assign provider and cache TTL for the selected line.'),
      complete: lineConfigured
    },
    {
      step: '03',
      title: t('catalog.flow.templateTitle', 'Tune provider template'),
      description: t('catalog.flow.templateBody', 'Define the common Xtream host, type and output for this provider.'),
      complete: templateConfigured
    },
    {
      step: '04',
      title: t('catalog.flow.runTitle', 'Import and download'),
      description: t('catalog.flow.runBody', 'Run catalog import and download the final M3U by lineId.'),
      complete: flowReady
    }
  ];

  const summaryCards = [
    {
      label: t('catalog.status.selectedLine', 'Selected line'),
      value: activeLineId || t('catalog.status.pendingValue', 'Pending'),
      helper: lineSourceForm.usernameEncode || t('catalog.lineSources.lineSelectPlaceholder', 'Select line...'),
      tone: lineSelected ? 'primary' : 'warning'
    },
    {
      label: t('catalog.status.provider', 'Provider'),
      value: activeProviderCode || t('catalog.status.pendingValue', 'Pending'),
      helper: lineSourceForm.active ? t('catalog.status.activeValue', 'Source active') : t('catalog.status.inactiveValue', 'Source inactive'),
      tone: activeProviderCode ? 'info' : 'warning'
    },
    {
      label: t('catalog.status.template', 'Template'),
      value: templateConfigured ? t('catalog.status.readyValue', 'Ready') : t('catalog.status.missingValue', 'Missing'),
      helper: providerTemplateForm.baseUrl || t('catalog.status.templateHelper', 'Save base URL to enable imports.'),
      tone: templateConfigured ? 'success' : 'warning'
    },
    {
      label: t('catalog.status.actionsReady', 'Actions ready'),
      value: flowReady ? t('catalog.status.readyValue', 'Ready') : t('catalog.status.pendingValue', 'Pending'),
      helper: t('catalog.import.lineIdHelper', 'Select a line above to operate the complete flow.'),
      tone: flowReady ? 'success' : 'warning'
    }
  ];

  return (
    <Box sx={{ width: '100%', maxWidth: 1480, mx: 'auto' }}>
      <MainCard
        title={t('catalog.lineSources.title', 'M3U Per-Line Configuration')}
        secondary={
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={refreshLineOptions} disabled={loadingLineOptions}>
              {loadingLineOptions ? t('catalog.actions.loading', 'Loading...') : t('catalog.actions.refresh', 'Refresh')}
            </Button>
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={refreshProviderTemplates} disabled={loadingProviderTemplates}>
              {loadingProviderTemplates ? t('catalog.actions.loading', 'Loading...') : t('catalog.actions.refreshProviders', 'Refresh providers')}
            </Button>
          </Stack>
        }
      >
        <Stack spacing={2.5}>
          <Paper
            variant="outlined"
            sx={(theme) => ({
              p: { xs: 2.25, md: 3 },
              borderRadius: 3,
              borderColor: alpha(theme.palette.primary.main, 0.2),
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.12)} 0%, ${alpha(
                theme.palette.info.main,
                0.12
              )} 55%, ${theme.palette.background.paper} 100%)`
            })}
          >
            <Grid container spacing={2.5} alignItems="stretch">
              <Grid item xs={12} lg={7}>
                <Stack spacing={1.25} sx={{ height: '100%', justifyContent: 'space-between' }}>
                  <Stack spacing={1.25}>
                    <Chip
                      color="primary"
                      variant="outlined"
                      label={t('catalog.overview.lineEyebrow', 'Per-line Xtream workflow')}
                      sx={{ alignSelf: 'flex-start', fontWeight: 700 }}
                    />
                    <Typography variant="h3" sx={{ maxWidth: 720 }}>
                      {t('catalog.overview.lineTitle', 'Configure, validate and download the final M3U by lineId')}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 760 }}>
                      {t(
                        'catalog.overview.lineDescription',
                        'This screen guides the operator through one line at a time: choose the line, save provider settings, tune the Xtream template and only then run import or download.'
                      )}
                    </Typography>
                  </Stack>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                    <Button variant="contained" endIcon={<ArrowForwardRoundedIcon />} onClick={() => navigate('/liontv/catalog-curation')}>
                      {t('catalog.actions.openCatalog', 'Open base catalog')}
                    </Button>
                    <Button
                      variant="text"
                      startIcon={<RouteOutlinedIcon />}
                      onClick={() => activeLineId && loadLineSourceConfig(activeLineId)}
                      disabled={!activeLineId || loadingLineSource}
                    >
                      {loadingLineSource ? t('catalog.source.loading', 'Loading...') : t('catalog.source.load', 'Load configuration')}
                    </Button>
                  </Stack>
                </Stack>
              </Grid>

              <Grid item xs={12} lg={5}>
                <Grid container spacing={1.25}>
                  {summaryCards.map((card) => (
                    <Grid item xs={12} sm={6} key={card.label}>
                      <StatusCard label={card.label} value={card.value} helper={card.helper} tone={card.tone} />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Paper>

          <Grid container spacing={2.5}>
            <Grid item xs={12} lg={5}>
              <Paper variant="outlined" sx={{ p: 2.25, height: '100%' }}>
                <Stack spacing={1.5}>
                  <Stack spacing={0.5}>
                    <Typography variant="overline" color="primary.main" sx={{ fontWeight: 700, letterSpacing: 1 }}>
                      {t('catalog.flow.title', 'Operator flow')}
                    </Typography>
                    <Typography variant="h5">{t('catalog.lineSources.howItWorks', 'How this module works')}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t(
                        'catalog.lineSources.flowSummary',
                        'The screen is now separated by operational step, so the user can see what is already configured and what is still blocking the run.'
                      )}
                    </Typography>
                  </Stack>

                  <Stack spacing={1}>
                    {workflowSteps.map((step) => (
                      <FlowCard
                        key={step.step}
                        {...step}
                        readyLabel={t('catalog.status.readyValue', 'Ready')}
                        pendingLabel={t('catalog.status.pendingValue', 'Pending')}
                      />
                    ))}
                  </Stack>

                  <Alert severity={flowReady ? 'success' : 'info'}>
                    {flowReady
                      ? t('catalog.lineSources.readyHint', 'This line is ready for import and final download.')
                      : t(
                          'catalog.lineSources.pendingHint',
                          'Finish the pending steps below. The system resolves the real Xtream credentials automatically from the active line.'
                        )}
                  </Alert>
                </Stack>
              </Paper>
            </Grid>

            <Grid item xs={12} lg={7}>
              <Paper variant="outlined" sx={{ p: 2.25, height: '100%' }}>
                <Stack spacing={2}>
                  <Stack spacing={0.5}>
                    <Typography variant="overline" color="primary.main" sx={{ fontWeight: 700, letterSpacing: 1 }}>
                      {t('catalog.flow.lineAssignTitle', 'Save line settings')}
                    </Typography>
                    <Typography variant="h5">{t('catalog.lineSources.configTitle', 'Per-line source configuration')}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t(
                        'catalog.lineSources.configBody',
                        'Start by identifying the line visually, then save the provider and cache policy that the backend should use for this line.'
                      )}
                    </Typography>
                  </Stack>

                  <Alert severity="info">
                    {t(
                      'catalog.hints.dynamicUrl',
                      'The source URL is not stored per line. Only the provider and cache rules are saved; the backend builds the real Xtream URL with the active line credentials.'
                    )}
                  </Alert>

                  <Grid container spacing={1.5}>
                    <Grid item xs={12} md={7}>
                      <TextField
                        select
                        fullWidth
                        label={t('catalog.lineSources.lineSelect', 'Select line (lineId / usernameEncode)')}
                        value={selectedLineId}
                        onChange={(event) => setSelectedLineId(event.target.value)}
                        helperText={t(
                          'catalog.lineSources.lineSelectHelper',
                          'This selector uses /api/v1/line-sources/line-options and no longer depends on token.'
                        )}
                      >
                        <MenuItem value="">{t('catalog.lineSources.lineSelectPlaceholder', 'Select line...')}</MenuItem>
                        {lineOptions.map((option) => (
                          <MenuItem key={option.lineId} value={option.lineId}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid item xs={12} md={5}>
                      <Paper
                        variant="outlined"
                        sx={(theme) => ({
                          p: 1.5,
                          height: '100%',
                          borderColor: alpha(theme.palette.info.main, 0.25),
                          backgroundColor: alpha(theme.palette.info.main, 0.05)
                        })}
                      >
                        <Stack spacing={1}>
                          <Typography variant="subtitle2">{t('catalog.status.lineSnapshot', 'Line snapshot')}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {selectedLineOption?.label || t('catalog.status.lineSnapshotEmpty', 'Pick a line to see its current identity and provider hint.')}
                          </Typography>
                          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            <Chip size="small" label={`${t('catalog.source.lineId', 'Line ID')}: ${lineSourceForm.lineId || '-'}`} />
                            <Chip size="small" label={`${t('catalog.source.provider', 'Assigned provider')}: ${lineSourceForm.sourceProviderName || '-'}`} />
                          </Stack>
                        </Stack>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label={t('catalog.source.lineId', 'Line ID')}
                        value={lineSourceForm.lineId}
                        InputProps={{ readOnly: true }}
                        helperText={t('catalog.source.lineIdHelper', 'Technical identifier of selected line.')}
                      />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label={t('catalog.source.usernameEncode', 'Visible username')}
                        value={lineSourceForm.usernameEncode}
                        InputProps={{ readOnly: true }}
                        helperText={t(
                          'catalog.source.usernameEncodeHelper',
                          'Display value to identify the line; the backend resolves the current technical username internally.'
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <TextField
                        select
                        fullWidth
                        label={t('catalog.source.provider', 'Assigned provider')}
                        value={lineSourceForm.sourceProviderName}
                        onChange={(event) => {
                          const value = event.target.value;
                          setLineSourceForm((previous) => ({ ...previous, sourceProviderName: value }));
                          setSelectedProviderCode(value);
                        }}
                        helperText={t('catalog.source.providerHelper', 'Select the provider whose Xtream template should be used for this line.')}
                      >
                        <MenuItem value="">{t('catalog.providerTemplates.providerPlaceholder', 'Select provider...')}</MenuItem>
                        {providerOptions.map((providerOption) => (
                          <MenuItem key={providerOption} value={providerOption}>
                            {providerOption}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        type="number"
                        label={t('catalog.source.ttl', 'TTL cache (min)')}
                        value={lineSourceForm.cacheTtlMinutes}
                        onChange={(event) => setLineSourceForm((previous) => ({ ...previous, cacheTtlMinutes: event.target.value }))}
                        inputProps={{ min: 1 }}
                        helperText={t('catalog.source.ttlHelper', 'Cache time for final lineId playlist.')}
                      />
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <Paper variant="outlined" sx={{ p: 1.25, height: '100%', display: 'flex', alignItems: 'center' }}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={Boolean(lineSourceForm.active)}
                              onChange={(event) => setLineSourceForm((previous) => ({ ...previous, active: event.target.checked }))}
                            />
                          }
                          label={t('catalog.source.active', 'Source active')}
                        />
                      </Paper>
                    </Grid>

                    <Grid item xs={12} md={5}>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="flex-end" sx={{ height: '100%' }}>
                        <Button variant="outlined" onClick={() => loadLineSourceConfig(lineSourceForm.lineId)} disabled={loadingLineSource}>
                          {loadingLineSource ? t('catalog.source.loading', 'Loading...') : t('catalog.source.load', 'Load configuration')}
                        </Button>
                        <Button variant="contained" startIcon={<SaveOutlinedIcon />} onClick={saveLineSourceConfig} disabled={savingLineSource}>
                          {savingLineSource ? t('catalog.source.saving', 'Saving...') : t('catalog.source.save', 'Save configuration')}
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>

                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} flexWrap="wrap" useFlexGap>
                    <Chip
                      size="small"
                      variant="outlined"
                      label={`${t('catalog.source.lastDownload', 'Last download')}: ${formatDate(lineSourceForm.lastDownloadedAt)}`}
                    />
                    <Chip size="small" variant="outlined" label={`${t('catalog.source.updatedAt', 'Updated at')}: ${formatDate(lineSourceForm.updatedAt)}`} />
                  </Stack>
                </Stack>
              </Paper>
            </Grid>
          </Grid>

          <Grid container spacing={2.5}>
            <Grid item xs={12} lg={7}>
              <Paper variant="outlined" sx={{ p: 2.25, height: '100%' }}>
                <Stack spacing={2}>
                  <Stack spacing={0.5}>
                    <Typography variant="overline" color="primary.main" sx={{ fontWeight: 700, letterSpacing: 1 }}>
                      {t('catalog.flow.templateTitle', 'Tune provider template')}
                    </Typography>
                    <Typography variant="h5">{t('catalog.providerTemplates.title', 'Xtream template per provider')}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t(
                        'catalog.providerTemplates.body',
                        'This template defines the common host and response format for a provider. The line credentials are injected automatically when the flow runs.'
                      )}
                    </Typography>
                  </Stack>

                  <Grid container spacing={1.5}>
                    <Grid item xs={12} md={4}>
                      <TextField
                        select
                        fullWidth
                        label={t('catalog.providerTemplates.provider', 'Provider')}
                        value={selectedProviderCode}
                        onChange={(event) => setSelectedProviderCode(event.target.value)}
                        helperText={t(
                          'catalog.providerTemplates.providerHelper',
                          'The template defines the common Xtream host/base; the backend appends the current line credentials.'
                        )}
                      >
                        <MenuItem value="">{t('catalog.providerTemplates.providerPlaceholder', 'Select provider...')}</MenuItem>
                        {providerOptions.map((providerOption) => (
                          <MenuItem key={providerOption} value={providerOption}>
                            {providerOption}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label={t('catalog.providerTemplates.baseUrl', 'Xtream base URL')}
                        value={providerTemplateForm.baseUrl}
                        onChange={(event) => setProviderTemplateForm((previous) => ({ ...previous, baseUrl: event.target.value }))}
                        placeholder="http://provider.example.com:80"
                      />
                    </Grid>

                    <Grid item xs={12} md={2}>
                      <TextField
                        fullWidth
                        label={t('catalog.providerTemplates.playlistType', 'Playlist type')}
                        value={providerTemplateForm.playlistType}
                        onChange={(event) => setProviderTemplateForm((previous) => ({ ...previous, playlistType: event.target.value }))}
                        placeholder="m3u_plus"
                      />
                    </Grid>

                    <Grid item xs={12} md={2}>
                      <TextField
                        fullWidth
                        label={t('catalog.providerTemplates.outputFormat', 'Output')}
                        value={providerTemplateForm.outputFormat}
                        onChange={(event) => setProviderTemplateForm((previous) => ({ ...previous, outputFormat: event.target.value }))}
                        placeholder="ts"
                      />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Paper variant="outlined" sx={{ p: 1.25, height: '100%', display: 'flex', alignItems: 'center' }}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={Boolean(providerTemplateForm.active)}
                              onChange={(event) => setProviderTemplateForm((previous) => ({ ...previous, active: event.target.checked }))}
                            />
                          }
                          label={t('catalog.providerTemplates.active', 'Template active')}
                        />
                      </Paper>
                    </Grid>

                    <Grid item xs={12} md={8}>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="flex-end">
                        <Button variant="outlined" onClick={() => loadProviderTemplateConfig(selectedProviderCode)} disabled={loadingProviderTemplate}>
                          {loadingProviderTemplate
                            ? t('catalog.providerTemplates.loading', 'Loading...')
                            : t('catalog.providerTemplates.load', 'Load template')}
                        </Button>
                        <Button
                          variant="contained"
                          startIcon={<SaveOutlinedIcon />}
                          onClick={saveProviderTemplateConfig}
                          disabled={savingProviderTemplate}
                        >
                          {savingProviderTemplate
                            ? t('catalog.providerTemplates.saving', 'Saving...')
                            : t('catalog.providerTemplates.save', 'Save template')}
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>

                  <Divider />

                  <Grid container spacing={1.5}>
                    <Grid item xs={12} md={8}>
                      <Alert severity={templateConfigured ? 'success' : 'info'} icon={<TuneOutlinedIcon fontSize="inherit" />}>
                        <Stack spacing={0.75}>
                          <Typography variant="subtitle2">{t('catalog.hints.dynamicPreview', 'Resolved Xtream preview')}</Typography>
                          <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                            {templatePreview}
                          </Typography>
                        </Stack>
                      </Alert>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Stack spacing={1}>
                        <Chip
                          size="small"
                          variant="outlined"
                          label={`${t('catalog.providerTemplates.updatedAt', 'Updated at')}: ${formatDate(providerTemplateForm.updatedAt)}`}
                        />
                        <Chip
                          size="small"
                          variant="outlined"
                          label={`${t('catalog.status.template', 'Template')}: ${
                            providerTemplateForm.active ? t('catalog.status.activeValue', 'Active') : t('catalog.status.inactiveValue', 'Inactive')
                          }`}
                        />
                      </Stack>
                    </Grid>
                  </Grid>
                </Stack>
              </Paper>
            </Grid>

            <Grid item xs={12} lg={5}>
              <Paper variant="outlined" sx={{ p: 2.25, height: '100%' }}>
                <Stack spacing={2}>
                  <Stack spacing={0.5}>
                    <Typography variant="overline" color="primary.main" sx={{ fontWeight: 700, letterSpacing: 1 }}>
                      {t('catalog.flow.runTitle', 'Import and download')}
                    </Typography>
                    <Typography variant="h5">{t('catalog.import.title', 'Operational flow test by lineId')}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t(
                        'catalog.import.body',
                        'Use these actions only after the line and the provider template are both saved. This section is intentionally action-focused.'
                      )}
                    </Typography>
                  </Stack>

                  <Alert severity="info">
                    {t(
                      'catalog.import.lineFlowHelper',
                      'Import and final download now use /api/v1/catalog/import/line/{lineId} and /api/v1/m3u/line/{lineId}.'
                    )}
                  </Alert>

                  <Paper
                    variant="outlined"
                    sx={(theme) => ({
                      p: 1.75,
                      borderColor: alpha(theme.palette.secondary.main, 0.2),
                      backgroundColor: alpha(theme.palette.secondary.main, 0.05)
                    })}
                  >
                    <Stack spacing={1.25}>
                      <Typography variant="subtitle2">{t('catalog.status.prerequisites', 'Run checklist')}</Typography>
                      {operationalChecklist.map((item) => (
                        <ChecklistItem key={item.key} done={item.done} label={item.label} />
                      ))}
                    </Stack>
                  </Paper>

                  <TextField
                    fullWidth
                    label={t('catalog.import.lineId', 'Selected lineId')}
                    value={activeLineId}
                    InputProps={{ readOnly: true }}
                    helperText={t('catalog.import.lineIdHelper', 'Select a line above to operate the complete flow.')}
                  />

                  <Stack spacing={1}>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<CloudDownloadIcon />}
                      disabled={importing || !flowReady}
                      onClick={handleImportCatalog}
                    >
                      {importing ? t('catalog.actions.importing', 'Importing...') : t('catalog.actions.import', 'Import catalog')}
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={<FileDownloadIcon />}
                      disabled={downloading || !flowReady}
                      onClick={handleDownloadPlaylist}
                    >
                      {downloading ? t('catalog.actions.downloading', 'Downloading...') : t('catalog.actions.downloadM3u', 'Download M3U')}
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      size="large"
                      startIcon={<AssignmentTurnedInIcon />}
                      disabled={fullTestLoading || !flowReady}
                      onClick={handleFullFlowTest}
                    >
                      {fullTestLoading ? t('catalog.actions.testing', 'Testing...') : t('catalog.actions.fullFlowTest', 'Test full flow')}
                    </Button>
                  </Stack>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Stack>
      </MainCard>
    </Box>
  );
}
