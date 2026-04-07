import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import { alpha } from '@mui/material/styles';
import useAuth from 'hooks/useAuth';

import Alert from '@mui/material/Alert';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RefreshIcon from '@mui/icons-material/Refresh';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

import MainCard from 'ui-component/cards/MainCard';
import DialogTitleWithClose from 'ui-component/dialogs/DialogTitleWithClose';
import {
  assignBaseCatalogItemCategory,
  createCategory,
  getBaseCatalogItem,
  getBaseSource,
  importBaseCatalog,
  listLineOptions,
  listBaseCatalogItems,
  listCategories,
  upsertBaseSource
} from 'api/m3u-catalog';

const CONTENT_TYPES = ['LIVE_CHANNEL', 'SPORT_EVENT', 'SPORT_REPLAY', 'VOD_MOVIE', 'VOD_SERIES_EPISODE', 'REALITY_LIVE', 'UNKNOWN'];

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString();
}

function extractErrorMessage(error, fallback) {
  return error?.response?.data?.message || error?.message || fallback;
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

const defaultAssignForm = {
  categoryId: null,
  isPrimary: true,
  assignedBy: 'frontend-admin'
};

const defaultCreateCategoryForm = {
  name: '',
  active: true
};

const defaultBaseSourceForm = {
  sourcePlaylistUrl: '',
  sourceProviderName: '',
  cacheTtlMinutes: 180,
  active: true,
  lastDownloadedAt: null,
  updatedAt: null
};

export default function CatalogCurationLionTv() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const { accessToken } = useAuth();

  const [baseSourceForm, setBaseSourceForm] = useState(defaultBaseSourceForm);
  const [loadingBaseSource, setLoadingBaseSource] = useState(false);
  const [savingBaseSource, setSavingBaseSource] = useState(false);
  const [importingBase, setImportingBase] = useState(false);
  const [providerOptions, setProviderOptions] = useState([]);
  const [loadingProviderOptions, setLoadingProviderOptions] = useState(false);

  const [typeFilter, setTypeFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('true');
  const [queryFilter, setQueryFilter] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const [items, setItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [totalItems, setTotalItems] = useState(0);

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [createCategoryDialog, setCreateCategoryDialog] = useState(false);
  const [createCategoryForm, setCreateCategoryForm] = useState(defaultCreateCategoryForm);
  const [savingCategory, setSavingCategory] = useState(false);

  const [detailDialog, setDetailDialog] = useState({ open: false, item: null, loading: false });
  const [assignDialog, setAssignDialog] = useState({ open: false, item: null });
  const [assignForm, setAssignForm] = useState(defaultAssignForm);
  const [assigning, setAssigning] = useState(false);

  const categoryOptions = useMemo(
    () =>
      categories.map((category) => ({
        label: `${category.name}${category.active ? '' : ` (${t('catalog.status.inactiveValue', 'Inactive')})`}`,
        value: category.id
      })),
    [categories, t]
  );

  const selectedAssignCategory = useMemo(
    () => categoryOptions.find((option) => option.value === assignForm.categoryId) || null,
    [assignForm.categoryId, categoryOptions]
  );

  const resolvedProviderOptions = useMemo(() => {
    const values = [...providerOptions];
    const current = String(baseSourceForm.sourceProviderName || '').trim();
    if (current && !values.includes(current)) {
      values.push(current);
    }
    return values.sort((a, b) => a.localeCompare(b));
  }, [baseSourceForm.sourceProviderName, providerOptions]);

  const assignedItemsOnPage = useMemo(() => items.filter((item) => Boolean(item.primaryCategoryName)).length, [items]);

  const loadBaseSource = useCallback(async () => {
    if (!accessToken) return;
    setLoadingBaseSource(true);
    try {
      const source = await getBaseSource({ accessToken });
      setBaseSourceForm({
        sourcePlaylistUrl: source.sourcePlaylistUrl || '',
        sourceProviderName: source.sourceProviderName || '',
        cacheTtlMinutes: source.cacheTtlMinutes ?? 180,
        active: source.active !== undefined ? Boolean(source.active) : true,
        lastDownloadedAt: source.lastDownloadedAt || null,
        updatedAt: source.updatedAt || null
      });
    } catch (error) {
      enqueueSnackbar(extractErrorMessage(error, t('catalog.messages.baseSourceLoadError', 'Could not load base source.')), {
        variant: 'error'
      });
    } finally {
      setLoadingBaseSource(false);
    }
  }, [accessToken, enqueueSnackbar, t]);

  const saveBaseSource = useCallback(async () => {
    const sourcePlaylistUrl = baseSourceForm.sourcePlaylistUrl.trim();
    if (!sourcePlaylistUrl) {
      enqueueSnackbar(t('catalog.messages.baseSourceRequired', 'Base URL is required.'), { variant: 'warning' });
      return;
    }

    setSavingBaseSource(true);
    try {
      const saved = await upsertBaseSource({
        accessToken,
        payload: {
          sourcePlaylistUrl,
          sourceProviderName: baseSourceForm.sourceProviderName?.trim() || null,
          cacheTtlMinutes: Number(baseSourceForm.cacheTtlMinutes) || 180,
          active: Boolean(baseSourceForm.active)
        }
      });

      setBaseSourceForm({
        sourcePlaylistUrl: saved.sourcePlaylistUrl || sourcePlaylistUrl,
        sourceProviderName: saved.sourceProviderName || '',
        cacheTtlMinutes: saved.cacheTtlMinutes ?? 180,
        active: saved.active !== undefined ? Boolean(saved.active) : true,
        lastDownloadedAt: saved.lastDownloadedAt || null,
        updatedAt: saved.updatedAt || null
      });
      enqueueSnackbar(t('catalog.messages.baseSourceSaved', 'Base source saved successfully.'), { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(extractErrorMessage(error, t('catalog.messages.baseSourceSaveError', 'Could not save base source.')), {
        variant: 'error'
      });
    } finally {
      setSavingBaseSource(false);
    }
  }, [
    accessToken,
    baseSourceForm.active,
    baseSourceForm.cacheTtlMinutes,
    baseSourceForm.sourcePlaylistUrl,
    baseSourceForm.sourceProviderName,
    enqueueSnackbar,
    t
  ]);

  const handleImportBaseCatalog = useCallback(async () => {
    setImportingBase(true);
    try {
      const result = await importBaseCatalog({ accessToken });
      enqueueSnackbar(
        t('catalog.messages.baseImportSuccess', 'Base import completed.') +
          ` parsed=${result?.parsedItems ?? 0}, inserted=${result?.insertedItems ?? 0}, updated=${result?.updatedItems ?? 0}`,
        { variant: 'success' }
      );
      setPage(0);
      setRefreshKey((value) => value + 1);
      await loadBaseSource();
    } catch (error) {
      enqueueSnackbar(extractErrorMessage(error, t('catalog.messages.baseImportError', 'Could not import base list.')), {
        variant: 'error'
      });
    } finally {
      setImportingBase(false);
    }
  }, [accessToken, enqueueSnackbar, loadBaseSource, t]);

  const loadItems = useCallback(async () => {
    if (!accessToken) return;
    setItemsLoading(true);
    try {
      const activeParam = activeFilter === '' ? undefined : activeFilter === 'true';
      const response = await listBaseCatalogItems({
        accessToken,
        detectedType: typeFilter || '',
        active: activeParam,
        query: queryFilter.trim(),
        page,
        size: rowsPerPage
      });
      setItems(response.items);
      setTotalItems(response.totalItems);
    } catch (error) {
      enqueueSnackbar(extractErrorMessage(error, t('catalog.messages.loadItemsError', 'Could not load base catalog.')), {
        variant: 'error'
      });
    } finally {
      setItemsLoading(false);
    }
  }, [accessToken, activeFilter, enqueueSnackbar, page, queryFilter, rowsPerPage, t, typeFilter]);

  const loadCategoriesData = useCallback(async () => {
    if (!accessToken) return;
    setCategoriesLoading(true);
    try {
      const response = await listCategories({ accessToken });
      setCategories(response);
    } catch (error) {
      enqueueSnackbar(extractErrorMessage(error, t('catalog.messages.loadCategoriesError', 'Could not load categories.')), {
        variant: 'error'
      });
    } finally {
      setCategoriesLoading(false);
    }
  }, [accessToken, enqueueSnackbar, t]);

  const loadProviderOptions = useCallback(async () => {
    if (!accessToken) return;
    setLoadingProviderOptions(true);
    try {
      const options = await listLineOptions({ accessToken });
      const providers = Array.from(
        new Set(
          (Array.isArray(options) ? options : [])
            .map((option) => String(option.provider || '').trim())
            .filter(Boolean)
        )
      ).sort((a, b) => a.localeCompare(b));
      setProviderOptions(providers);
    } catch (_) {
      setProviderOptions([]);
    } finally {
      setLoadingProviderOptions(false);
    }
  }, [accessToken]);

  useEffect(() => {
    loadBaseSource();
  }, [loadBaseSource]);

  useEffect(() => {
    loadItems();
  }, [loadItems, refreshKey]);

  useEffect(() => {
    loadCategoriesData();
  }, [loadCategoriesData]);

  useEffect(() => {
    loadProviderOptions();
  }, [loadProviderOptions]);

  const openDetailDialog = useCallback(
    async (item) => {
      setDetailDialog({ open: true, item: null, loading: true });
      try {
        const detail = await getBaseCatalogItem({ accessToken, id: item.id });
        setDetailDialog({ open: true, item: detail, loading: false });
      } catch (error) {
        setDetailDialog({ open: false, item: null, loading: false });
        enqueueSnackbar(extractErrorMessage(error, t('catalog.messages.itemDetailError', 'Could not load item detail.')), {
          variant: 'error'
        });
      }
    },
    [accessToken, enqueueSnackbar, t]
  );

  const openAssignDialog = useCallback((item) => {
    setAssignForm({
      categoryId: item.primaryCategoryId ?? null,
      isPrimary: true,
      assignedBy: 'frontend-admin'
    });
    setAssignDialog({ open: true, item });
  }, []);

  const closeAssignDialog = useCallback(() => {
    if (assigning) return;
    setAssignDialog({ open: false, item: null });
    setAssignForm(defaultAssignForm);
  }, [assigning]);

  const submitAssignCategory = useCallback(async () => {
    if (!assignDialog.item?.id) return;
    setAssigning(true);
    try {
      await assignBaseCatalogItemCategory({
        accessToken,
        id: assignDialog.item.id,
        payload: {
          categoryId: assignForm.categoryId,
          isPrimary: assignForm.isPrimary,
          assignedBy: assignForm.assignedBy
        }
      });
      enqueueSnackbar(t('catalog.messages.assignSuccess', 'Assignment updated.'), { variant: 'success' });
      closeAssignDialog();
      setRefreshKey((value) => value + 1);
    } catch (error) {
      enqueueSnackbar(extractErrorMessage(error, t('catalog.messages.assignError', 'Could not update assignment.')), {
        variant: 'error'
      });
    } finally {
      setAssigning(false);
    }
  }, [
    accessToken,
    assignDialog.item?.id,
    assignForm.assignedBy,
    assignForm.categoryId,
    assignForm.isPrimary,
    closeAssignDialog,
    enqueueSnackbar,
    t
  ]);

  const submitCreateCategory = useCallback(async () => {
    const name = createCategoryForm.name.trim();
    if (!name) {
      enqueueSnackbar(t('catalog.messages.categoryNameRequired', 'Category name is required.'), { variant: 'warning' });
      return;
    }

    setSavingCategory(true);
    try {
      await createCategory({
        accessToken,
        payload: {
          name,
          active: createCategoryForm.active
        }
      });
      enqueueSnackbar(t('catalog.messages.categoryCreateSuccess', 'Category created successfully.'), { variant: 'success' });
      setCreateCategoryDialog(false);
      setCreateCategoryForm(defaultCreateCategoryForm);
      await loadCategoriesData();
    } catch (error) {
      enqueueSnackbar(extractErrorMessage(error, t('catalog.messages.categoryCreateError', 'Could not create category.')), {
        variant: 'error'
      });
    } finally {
      setSavingCategory(false);
    }
  }, [accessToken, createCategoryForm.active, createCategoryForm.name, enqueueSnackbar, loadCategoriesData, t]);

  const baseSourceReady = Boolean(baseSourceForm.sourcePlaylistUrl.trim());
  const baseImportReady = Boolean(baseSourceReady && totalItems > 0);
  const categoriesReady = Boolean(categories.length > 0);
  const workflowSteps = [
    {
      step: '01',
      title: t('catalog.flow.baseSetupTitle', 'Save global base source'),
      description: t('catalog.flow.baseSetupBody', 'Define the master playlist URL and provider used to curate the shared catalog.'),
      complete: baseSourceReady
    },
    {
      step: '02',
      title: t('catalog.flow.baseImportTitle', 'Import the shared catalog'),
      description: t('catalog.flow.baseImportBody', 'Run the base import to populate items that later feed category matching.'),
      complete: baseImportReady
    },
    {
      step: '03',
      title: t('catalog.flow.curateTitle', 'Assign manual categories'),
      description: t('catalog.flow.curateBody', 'Review titles, refine filters and assign categories that should override the final output.'),
      complete: categoriesReady
    },
    {
      step: '04',
      title: t('catalog.flow.lineRunTitle', 'Continue to per-line M3U'),
      description: t('catalog.flow.lineRunBody', 'Move to the per-line screen only after the base catalog feels ready.'),
      complete: false
    }
  ];

  const workflowChecklist = [
    { key: 'source', done: baseSourceReady, label: t('catalog.flow.baseSetupBody', 'Define the master playlist URL and provider used to curate the shared catalog.') },
    { key: 'import', done: baseImportReady, label: t('catalog.flow.baseImportBody', 'Run the base import to populate items that later feed category matching.') },
    { key: 'curation', done: categoriesReady, label: t('catalog.flow.curateBody', 'Review titles, refine filters and assign categories that should override the final output.') }
  ];

  const summaryCards = [
    {
      label: t('catalog.status.baseSource', 'Base source'),
      value: baseSourceReady ? t('catalog.status.readyValue', 'Ready') : t('catalog.status.missingValue', 'Missing'),
      helper: baseSourceForm.sourceProviderName || t('catalog.status.providerUnset', 'Provider not selected'),
      tone: baseSourceReady ? 'primary' : 'warning'
    },
    {
      label: t('catalog.status.lastDownload', 'Last download'),
      value: formatDate(baseSourceForm.lastDownloadedAt),
      helper: baseSourceForm.active ? t('catalog.status.activeValue', 'Active') : t('catalog.status.inactiveValue', 'Inactive'),
      tone: baseSourceForm.lastDownloadedAt ? 'info' : 'warning'
    },
    {
      label: t('catalog.status.catalogItems', 'Catalog items'),
      value: String(totalItems),
      helper: t('catalog.status.assignedItems', '{{count}} assigned on this page', { count: assignedItemsOnPage }),
      tone: totalItems > 0 ? 'success' : 'warning'
    },
    {
      label: t('catalog.status.categories', 'Categories'),
      value: String(categories.length),
      helper: categoriesReady ? t('catalog.status.readyValue', 'Ready') : t('catalog.status.pendingValue', 'Pending'),
      tone: categoriesReady ? 'success' : 'warning'
    }
  ];

  return (
    <Box sx={{ width: '100%', maxWidth: 1680, mx: 'auto' }}>
      <MainCard
        title={t('catalog.title', 'Global Base Catalog Curation')}
        secondary={
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => setRefreshKey((value) => value + 1)}>
            {t('catalog.actions.refresh', 'Refresh')}
          </Button>
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
                theme.palette.success.main,
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
                      label={t('catalog.overview.baseEyebrow', 'Global catalog preparation')}
                      sx={{ alignSelf: 'flex-start', fontWeight: 700 }}
                    />
                    <Typography variant="h3" sx={{ maxWidth: 760 }}>
                      {t('catalog.overview.baseTitle', 'Prepare the master catalog before touching individual lines')}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 780 }}>
                      {t(
                        'catalog.overview.baseDescription',
                        'This screen is the shared preparation layer: save the global source, import the master playlist, classify titles and define the categories that later shape the final M3U grouping.'
                      )}
                    </Typography>
                  </Stack>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                    <Button variant="contained" endIcon={<ArrowForwardRoundedIcon />} onClick={() => navigate('/liontv/m3u-line-sources')}>
                      {t('catalog.actions.openLineSources', 'Open M3U line sources')}
                    </Button>
                    <Button variant="text" startIcon={<CategoryOutlinedIcon />} onClick={() => setCreateCategoryDialog(true)}>
                      {t('catalog.categories.new', 'New category')}
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
                    <Typography variant="h5">{t('catalog.baseHowItWorks.title', 'Recommended flow')}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t(
                        'catalog.baseHowItWorks.summary',
                        'The operator should feel a clear sequence here: define the shared source, import the catalog, curate categories and only then move to the per-line execution module.'
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

                  <Alert severity={baseImportReady ? 'success' : 'info'}>
                    {baseImportReady
                      ? t('catalog.hints.nextAfterBase', 'The base catalog is ready enough to continue with line-specific M3U work.')
                      : t('catalog.hints.baseScope', 'This screen is global. It does not save per-line credentials or provider templates.')}
                  </Alert>
                </Stack>
              </Paper>
            </Grid>

            <Grid item xs={12} lg={7}>
              <Paper variant="outlined" sx={{ p: 2.25, height: '100%' }}>
                <Stack spacing={2}>
                  <Stack spacing={0.5}>
                    <Typography variant="overline" color="primary.main" sx={{ fontWeight: 700, letterSpacing: 1 }}>
                      {t('catalog.flow.baseSetupTitle', 'Save global base source')}
                    </Typography>
                    <Typography variant="h5">{t('catalog.baseSource.title', 'Global Base M3U Source')}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t(
                        'catalog.baseSource.body',
                        'Use one shared playlist as the master catalog. This is where global categorization starts, not where per-line playback is configured.'
                      )}
                    </Typography>
                  </Stack>

                  <Alert severity="info">
                    {t(
                      'catalog.hints.categoryImpact',
                      'Manual categories defined from this base catalog are reused later when the final M3U is generated for each line.'
                    )}
                  </Alert>

                  <Grid container spacing={1.5}>
                    <Grid item xs={12} md={7}>
                      <TextField
                        fullWidth
                        label={t('catalog.baseSource.url', 'Base playlist URL')}
                        value={baseSourceForm.sourcePlaylistUrl}
                        onChange={(event) => setBaseSourceForm((previous) => ({ ...previous, sourcePlaylistUrl: event.target.value }))}
                        placeholder="https://provider.com/get.php?username=...&password=...&type=m3u_plus&output=ts"
                        helperText={t('catalog.baseSource.urlHelper', 'This list is your global master catalog for categorization and override.')}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        select
                        fullWidth
                        label={t('catalog.baseSource.provider', 'Base provider')}
                        value={baseSourceForm.sourceProviderName}
                        onChange={(event) => setBaseSourceForm((previous) => ({ ...previous, sourceProviderName: event.target.value }))}
                        helperText={t('catalog.baseSource.providerHelper', 'Reference name for the global base source.')}
                      >
                        <MenuItem value="">
                          {loadingProviderOptions ? t('catalog.actions.loading', 'Loading...') : t('catalog.filters.all', 'All')}
                        </MenuItem>
                        {resolvedProviderOptions.map((providerOption) => (
                          <MenuItem key={providerOption} value={providerOption}>
                            {providerOption}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField
                        fullWidth
                        type="number"
                        label={t('catalog.baseSource.ttl', 'TTL (min)')}
                        value={baseSourceForm.cacheTtlMinutes}
                        onChange={(event) => setBaseSourceForm((previous) => ({ ...previous, cacheTtlMinutes: event.target.value }))}
                        inputProps={{ min: 1 }}
                        helperText={t('catalog.baseSource.ttlHelper', 'Reference refresh window for base catalog.')}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Paper variant="outlined" sx={{ p: 1.25, height: '100%', display: 'flex', alignItems: 'center' }}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={Boolean(baseSourceForm.active)}
                              onChange={(event) => setBaseSourceForm((previous) => ({ ...previous, active: event.target.checked }))}
                            />
                          }
                          label={t('catalog.baseSource.active', 'Source active')}
                        />
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="flex-end">
                        <Button variant="outlined" onClick={loadBaseSource} disabled={loadingBaseSource}>
                          {loadingBaseSource ? t('catalog.baseSource.loading', 'Loading...') : t('catalog.baseSource.reload', 'Reload')}
                        </Button>
                        <Button variant="contained" startIcon={<SaveOutlinedIcon />} onClick={saveBaseSource} disabled={savingBaseSource}>
                          {savingBaseSource ? t('catalog.baseSource.saving', 'Saving...') : t('catalog.baseSource.save', 'Save base source')}
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          startIcon={<CloudDownloadIcon />}
                          onClick={handleImportBaseCatalog}
                          disabled={importingBase || !baseSourceReady}
                        >
                          {importingBase ? t('catalog.baseSource.importing', 'Importing...') : t('catalog.baseSource.import', 'Import base')}
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>

                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} flexWrap="wrap" useFlexGap>
                    <Chip
                      size="small"
                      variant="outlined"
                      label={`${t('catalog.baseSource.lastDownload', 'Last download')}: ${formatDate(baseSourceForm.lastDownloadedAt)}`}
                    />
                    <Chip size="small" variant="outlined" label={`${t('catalog.baseSource.updatedAt', 'Updated at')}: ${formatDate(baseSourceForm.updatedAt)}`} />
                  </Stack>

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
                      {workflowChecklist.map((item) => (
                        <ChecklistItem key={item.key} done={item.done} label={item.label} />
                      ))}
                    </Stack>
                  </Paper>
                </Stack>
              </Paper>
            </Grid>
          </Grid>

          <Grid container spacing={2.5}>
            <Grid item xs={12} xl={8}>
              <Paper variant="outlined" sx={{ p: 2.25 }}>
                <Stack spacing={2}>
                  <Stack spacing={0.5}>
                    <Typography variant="overline" color="primary.main" sx={{ fontWeight: 700, letterSpacing: 1 }}>
                      {t('catalog.flow.curateTitle', 'Assign manual categories')}
                    </Typography>
                    <Typography variant="h5">{t('catalog.filters.title', 'Base catalog filters')}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t(
                        'catalog.filters.body',
                        'Filter aggressively, review the current page and assign manual categories only where the global catalog really needs guidance.'
                      )}
                    </Typography>
                  </Stack>

                  <Alert severity="info">
                    {t(
                      'catalog.table.helper',
                      'These manual categories are the clearest place to curate the final grouping. Use filters first, then open item detail or assign directly from the table.'
                    )}
                  </Alert>

                  <Grid container spacing={1.5}>
                    <Grid item xs={12} md={3}>
                      <TextField
                        select
                        fullWidth
                        label={t('catalog.filters.type', 'Detected type')}
                        value={typeFilter}
                        onChange={(event) => setTypeFilter(event.target.value)}
                      >
                        <MenuItem value="">{t('catalog.filters.all', 'All')}</MenuItem>
                        {CONTENT_TYPES.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        select
                        fullWidth
                        label={t('catalog.filters.active', 'Active')}
                        value={activeFilter}
                        onChange={(event) => setActiveFilter(event.target.value)}
                      >
                        <MenuItem value="">{t('catalog.filters.all', 'All')}</MenuItem>
                        <MenuItem value="true">true</MenuItem>
                        <MenuItem value="false">false</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label={t('catalog.filters.search', 'Search')}
                        value={queryFilter}
                        onChange={(event) => setQueryFilter(event.target.value)}
                        placeholder={t('catalog.filters.searchPlaceholder', 'rawTitle, canonicalTitle, groupTitle, tvgName')}
                      />
                    </Grid>
                  </Grid>

                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} justifyContent="space-between" alignItems={{ xs: 'stretch', md: 'center' }}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} flexWrap="wrap" useFlexGap>
                      <Chip color="primary" label={`${t('catalog.summary.totalItems', 'Total items')}: ${totalItems}`} />
                      <Chip color="info" label={`${t('catalog.summary.categories', 'Categories')}: ${categories.length}`} />
                      <Chip
                        color={assignedItemsOnPage > 0 ? 'success' : 'default'}
                        label={t('catalog.summary.pageAssigned', '{{count}} assigned on this page', { count: assignedItemsOnPage })}
                      />
                    </Stack>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                      <Button
                        variant="text"
                        onClick={() => {
                          setTypeFilter('');
                          setActiveFilter('true');
                          setQueryFilter('');
                          setPage(0);
                          setRefreshKey((value) => value + 1);
                        }}
                      >
                        {t('catalog.actions.clearFilters', 'Clear filters')}
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => {
                          setPage(0);
                          setRefreshKey((value) => value + 1);
                        }}
                      >
                        {t('catalog.actions.applyFilters', 'Apply filters')}
                      </Button>
                    </Stack>
                  </Stack>

                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>{t('catalog.table.title', 'Title')}</TableCell>
                          <TableCell>{t('catalog.table.type', 'Type')}</TableCell>
                          <TableCell>{t('catalog.table.groupTitle', 'Original group')}</TableCell>
                          <TableCell>{t('catalog.table.primaryCategory', 'Manual category')}</TableCell>
                          <TableCell>{t('catalog.table.active', 'Active')}</TableCell>
                          <TableCell>{t('catalog.table.updated', 'Updated')}</TableCell>
                          <TableCell align="right">{t('catalog.table.actions', 'Actions')}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {itemsLoading &&
                          Array.from({ length: 6 }).map((_, index) => (
                            <TableRow key={`items-loading-${index}`}>
                              {Array.from({ length: 8 }).map((__, cIndex) => (
                                <TableCell key={`items-loading-${index}-${cIndex}`}>
                                  <Skeleton variant="text" />
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}

                        {!itemsLoading &&
                          items.map((item) => (
                            <TableRow key={item.id} hover>
                              <TableCell>{item.id}</TableCell>
                              <TableCell>
                                <Typography variant="body2">{item.rawTitle || '-'}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {item.canonicalTitle || '-'}
                                </Typography>
                              </TableCell>
                              <TableCell>{item.detectedType}</TableCell>
                              <TableCell>{item.groupTitle || '-'}</TableCell>
                              <TableCell>
                                <Chip
                                  size="small"
                                  color={item.primaryCategoryName ? 'success' : 'default'}
                                  label={item.primaryCategoryName || t('catalog.table.noManualCategory', 'No manual assignment')}
                                />
                              </TableCell>
                              <TableCell>{item.active ? 'true' : 'false'}</TableCell>
                              <TableCell>{formatDate(item.updatedAt)}</TableCell>
                              <TableCell align="right">
                                <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                                  <IconButton size="small" color="primary" onClick={() => openDetailDialog(item)}>
                                    <VisibilityOutlinedIcon fontSize="small" />
                                  </IconButton>
                                  <IconButton size="small" color="secondary" onClick={() => openAssignDialog(item)}>
                                    <SaveOutlinedIcon fontSize="small" />
                                  </IconButton>
                                </Stack>
                              </TableCell>
                            </TableRow>
                          ))}

                        {!itemsLoading && items.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={8} align="center">
                              {t('catalog.messages.noItems', 'No items found with current filters.')}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <TablePagination
                    component="div"
                    count={totalItems}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={(_, nextPage) => setPage(nextPage)}
                    onRowsPerPageChange={(event) => {
                      setRowsPerPage(Number(event.target.value));
                      setPage(0);
                    }}
                    rowsPerPageOptions={[10, 25, 50, 100]}
                  />
                </Stack>
              </Paper>
            </Grid>

            <Grid item xs={12} xl={4}>
              <Stack spacing={2.5}>
                <Paper variant="outlined" sx={{ p: 2.25 }}>
                  <Stack spacing={1.5}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Typography variant="h5">{t('catalog.categories.title', 'Category management')}</Typography>
                      <Button variant="contained" size="small" startIcon={<AddCircleOutlineIcon />} onClick={() => setCreateCategoryDialog(true)}>
                        {t('catalog.categories.new', 'New category')}
                      </Button>
                    </Stack>

                    <Typography variant="body2" color="text.secondary">
                      {t(
                        'catalog.categories.body',
                        'Categories defined here are the shared language for later M3U grouping. Keep the taxonomy clean and easy to scan.'
                      )}
                    </Typography>

                    {categoriesLoading ? (
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {Array.from({ length: 6 }).map((_, index) => (
                          <Skeleton key={`cat-skeleton-${index}`} width={150} height={32} />
                        ))}
                      </Stack>
                    ) : (
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {categories.map((category) => (
                          <Chip
                            key={category.id}
                            label={`${category.name} (${category.slug})`}
                            color={category.active ? 'primary' : 'default'}
                            variant="outlined"
                          />
                        ))}
                      </Stack>
                    )}
                  </Stack>
                </Paper>

                <Paper
                  variant="outlined"
                  sx={(theme) => ({
                    p: 2.25,
                    borderColor: alpha(theme.palette.info.main, 0.22),
                    backgroundColor: alpha(theme.palette.info.main, 0.05)
                  })}
                >
                  <Stack spacing={1.5}>
                    <Typography variant="h6">{t('catalog.flow.lineRunTitle', 'Continue to per-line M3U')}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t(
                        'catalog.flow.lineRunBody',
                        'Once the base catalog feels stable, jump to the per-line module to assign provider templates, import by lineId and download the final playlist.'
                      )}
                    </Typography>
                    <Button variant="contained" endIcon={<ArrowForwardRoundedIcon />} onClick={() => navigate('/liontv/m3u-line-sources')}>
                      {t('catalog.actions.openLineSources', 'Open M3U line sources')}
                    </Button>
                  </Stack>
                </Paper>
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </MainCard>

      <Dialog open={createCategoryDialog} onClose={() => (savingCategory ? null : setCreateCategoryDialog(false))} maxWidth="sm" fullWidth>
        <DialogTitleWithClose onClose={() => (savingCategory ? null : setCreateCategoryDialog(false))}>
          {t('catalog.categories.createTitle', 'Create category')}
        </DialogTitleWithClose>
        <DialogContent dividers>
          <Stack spacing={2}>
            <TextField
              label={t('catalog.categories.name', 'Name')}
              value={createCategoryForm.name}
              onChange={(event) => setCreateCategoryForm((previous) => ({ ...previous, name: event.target.value }))}
              fullWidth
            />
            <FormControlLabel
              control={
                <Switch
                  checked={createCategoryForm.active}
                  onChange={(event) => setCreateCategoryForm((previous) => ({ ...previous, active: event.target.checked }))}
                />
              }
              label={t('catalog.categories.active', 'Active')}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => (savingCategory ? null : setCreateCategoryDialog(false))} disabled={savingCategory}>
            {t('actions.cancel', 'Cancel')}
          </Button>
          <Button variant="contained" onClick={submitCreateCategory} disabled={savingCategory}>
            {savingCategory ? t('actions.saving', 'Saving...') : t('actions.create', 'Create')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={assignDialog.open} onClose={closeAssignDialog} maxWidth="sm" fullWidth>
        <DialogTitleWithClose onClose={closeAssignDialog}>{t('catalog.assign.title', 'Assign manual category')}</DialogTitleWithClose>
        <DialogContent dividers>
          <Stack spacing={2}>
            <TextField label={t('catalog.assign.item', 'Item')} value={assignDialog.item?.rawTitle || ''} disabled fullWidth />

            <Autocomplete
              options={categoryOptions}
              value={selectedAssignCategory}
              onChange={(_, value) => {
                setAssignForm((previous) => ({ ...previous, categoryId: value?.value ?? null }));
              }}
              renderInput={(params) => <TextField {...params} label={t('catalog.assign.category', 'Category')} />}
            />

            <Button
              variant="text"
              onClick={() => {
                setAssignForm((previous) => ({ ...previous, categoryId: null }));
              }}
            >
              {t('catalog.assign.clearPrimary', 'Clear primary manual category')}
            </Button>

            <FormControlLabel
              control={
                <Switch
                  checked={assignForm.isPrimary}
                  onChange={(event) => setAssignForm((previous) => ({ ...previous, isPrimary: event.target.checked }))}
                />
              }
              label={t('catalog.assign.primary', 'Assign as primary')}
            />

            <TextField
              label={t('catalog.assign.assignedBy', 'Assigned by')}
              value={assignForm.assignedBy}
              onChange={(event) => setAssignForm((previous) => ({ ...previous, assignedBy: event.target.value }))}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAssignDialog} disabled={assigning}>
            {t('actions.cancel', 'Cancel')}
          </Button>
          <Button variant="contained" onClick={submitAssignCategory} disabled={assigning}>
            {assigning ? t('actions.saving', 'Saving...') : t('actions.save', 'Save')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={detailDialog.open} onClose={() => setDetailDialog({ open: false, item: null, loading: false })} maxWidth="md" fullWidth>
        <DialogTitleWithClose onClose={() => setDetailDialog({ open: false, item: null, loading: false })}>
          {t('catalog.detail.title', 'Item detail')}
        </DialogTitleWithClose>
        <DialogContent dividers>
          {detailDialog.loading ? (
            <Stack spacing={1}>
              {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton key={`detail-skeleton-${index}`} variant="text" />
              ))}
            </Stack>
          ) : (
            <Grid container spacing={1.5}>
              {Object.entries(detailDialog.item || {}).map(([key, value]) => (
                <Grid item xs={12} md={6} key={key}>
                  <Paper variant="outlined" sx={{ p: 1.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      {key}
                    </Typography>
                    <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                      {value === null || value === undefined || value === '' ? '-' : String(value)}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialog({ open: false, item: null, loading: false })}>{t('actions.cancel', 'Close')}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
