import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import useAuth from 'hooks/useAuth';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Skeleton from '@mui/material/Skeleton';
import Autocomplete from '@mui/material/Autocomplete';
import Alert from '@mui/material/Alert';

import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';

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
        label: `${category.name}${category.active ? '' : ' (INACTIVA)'}`,
        value: category.id
      })),
    [categories]
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
      enqueueSnackbar(extractErrorMessage(error, t('catalog.messages.baseSourceLoadError', 'No se pudo cargar la fuente base.')), {
        variant: 'error'
      });
    } finally {
      setLoadingBaseSource(false);
    }
  }, [accessToken, enqueueSnackbar, t]);

  const saveBaseSource = useCallback(async () => {
    const sourcePlaylistUrl = baseSourceForm.sourcePlaylistUrl.trim();
    if (!sourcePlaylistUrl) {
      enqueueSnackbar(t('catalog.messages.baseSourceRequired', 'La URL base es obligatoria.'), { variant: 'warning' });
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
      enqueueSnackbar(t('catalog.messages.baseSourceSaved', 'Fuente base guardada correctamente.'), { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(extractErrorMessage(error, t('catalog.messages.baseSourceSaveError', 'No se pudo guardar la fuente base.')), {
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
        t('catalog.messages.baseImportSuccess', 'Importación base completada.') +
          ` parsed=${result?.parsedItems ?? 0}, inserted=${result?.insertedItems ?? 0}, updated=${result?.updatedItems ?? 0}`,
        { variant: 'success' }
      );
      setPage(0);
      setRefreshKey((value) => value + 1);
      await loadBaseSource();
    } catch (error) {
      enqueueSnackbar(extractErrorMessage(error, t('catalog.messages.baseImportError', 'No se pudo importar la lista base.')), {
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
      enqueueSnackbar(extractErrorMessage(error, t('catalog.messages.loadItemsError', 'No se pudo cargar el catálogo base.')), {
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
      enqueueSnackbar(extractErrorMessage(error, t('catalog.messages.loadCategoriesError', 'No se pudieron cargar las categorías.')), {
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
        enqueueSnackbar(extractErrorMessage(error, t('catalog.messages.itemDetailError', 'No se pudo cargar el detalle.')), {
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
      enqueueSnackbar(t('catalog.messages.assignSuccess', 'Asignación actualizada.'), { variant: 'success' });
      closeAssignDialog();
      setRefreshKey((value) => value + 1);
    } catch (error) {
      enqueueSnackbar(extractErrorMessage(error, t('catalog.messages.assignError', 'No se pudo actualizar la asignación.')), {
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
      enqueueSnackbar(t('catalog.messages.categoryNameRequired', 'El nombre de categoría es obligatorio.'), { variant: 'warning' });
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
      enqueueSnackbar(t('catalog.messages.categoryCreateSuccess', 'Categoría creada correctamente.'), { variant: 'success' });
      setCreateCategoryDialog(false);
      setCreateCategoryForm(defaultCreateCategoryForm);
      await loadCategoriesData();
    } catch (error) {
      enqueueSnackbar(extractErrorMessage(error, t('catalog.messages.categoryCreateError', 'No se pudo crear la categoría.')), {
        variant: 'error'
      });
    } finally {
      setSavingCategory(false);
    }
  }, [accessToken, createCategoryForm.active, createCategoryForm.name, enqueueSnackbar, loadCategoriesData, t]);

  return (
    <Box sx={{ width: '100%', maxWidth: 1600, mx: 'auto' }}>
      <MainCard
        title={t('catalog.title', 'Curación Catálogo Base Global')}
        secondary={
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => setRefreshKey((value) => value + 1)}>
            {t('catalog.actions.refresh', 'Refrescar')}
          </Button>
        }
      >
        <Stack spacing={2.5}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Stack spacing={1.25}>
              <Typography variant="subtitle1">{t('catalog.baseHowItWorks.title', 'Proceso recomendado')}</Typography>
              <Alert severity="info">
                <Stack spacing={0.5}>
                  <Typography variant="body2">
                    {t('catalog.baseHowItWorks.step1', '1) Configura aquí una única URL base global y guarda.')}
                  </Typography>
                  <Typography variant="body2">
                    {t('catalog.baseHowItWorks.step2', '2) Ejecuta “Importar base” para poblar el catálogo base y asignar categorías manuales.')}
                  </Typography>
                  <Typography variant="body2">
                    {t(
                      'catalog.baseHowItWorks.step3',
                      '3) La configuración por línea (source playlist, token de prueba) se hace en la pantalla “M3U Line Sources”.'
                    )}
                  </Typography>
                </Stack>
              </Alert>
            </Stack>
          </Paper>

          <Paper variant="outlined" sx={{ p: 2 }}>
            <Stack spacing={1.5}>
              <Typography variant="subtitle1">{t('catalog.baseSource.title', 'Fuente M3U Base Global')}</Typography>
              <Grid container spacing={1.5}>
                <Grid item xs={12} md={7}>
                  <TextField
                    fullWidth
                    label={t('catalog.baseSource.url', 'URL playlist base')}
                    value={baseSourceForm.sourcePlaylistUrl}
                    onChange={(event) => setBaseSourceForm((previous) => ({ ...previous, sourcePlaylistUrl: event.target.value }))}
                    placeholder="https://proveedor.com/get.php?username=...&password=...&type=m3u_plus&output=ts"
                    helperText={t('catalog.baseSource.urlHelper', 'Esta lista es el catálogo maestro para categorizar y hacer override global.')}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    select
                    fullWidth
                    label={t('catalog.baseSource.provider', 'Proveedor base')}
                    value={baseSourceForm.sourceProviderName}
                    onChange={(event) => setBaseSourceForm((previous) => ({ ...previous, sourceProviderName: event.target.value }))}
                    helperText={t(
                      'catalog.baseSource.providerHelper',
                      'Catálogo cargado desde providers de líneas (mismo origen que Subscriptions).'
                    )}
                  >
                    <MenuItem value="">{loadingProviderOptions ? t('catalog.actions.loading', 'Cargando...') : t('catalog.filters.all', 'Todos')}</MenuItem>
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
                    helperText={t('catalog.baseSource.ttlHelper', 'Tiempo de referencia para refresco del catálogo base.')}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={Boolean(baseSourceForm.active)}
                        onChange={(event) => setBaseSourceForm((previous) => ({ ...previous, active: event.target.checked }))}
                      />
                    }
                    label={t('catalog.baseSource.active', 'Fuente activa')}
                  />
                </Grid>
                <Grid item xs={12} md={9}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="flex-end">
                    <Button variant="outlined" onClick={loadBaseSource} disabled={loadingBaseSource}>
                      {loadingBaseSource ? t('catalog.baseSource.loading', 'Cargando...') : t('catalog.baseSource.reload', 'Recargar')}
                    </Button>
                    <Button variant="contained" onClick={saveBaseSource} disabled={savingBaseSource}>
                      {savingBaseSource ? t('catalog.baseSource.saving', 'Guardando...') : t('catalog.baseSource.save', 'Guardar fuente base')}
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      startIcon={<CloudDownloadIcon />}
                      onClick={handleImportBaseCatalog}
                      disabled={importingBase}
                    >
                      {importingBase ? t('catalog.baseSource.importing', 'Importando...') : t('catalog.baseSource.import', 'Importar base')}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={1}>
                <Chip
                  size="small"
                  variant="outlined"
                  label={`${t('catalog.baseSource.lastDownload', 'Última descarga')}: ${formatDate(baseSourceForm.lastDownloadedAt)}`}
                />
                <Chip size="small" variant="outlined" label={`${t('catalog.baseSource.updatedAt', 'Actualizado')}: ${formatDate(baseSourceForm.updatedAt)}`} />
              </Stack>
            </Stack>
          </Paper>

          <Paper variant="outlined" sx={{ p: 2 }}>
            <Stack spacing={1.5}>
              <Typography variant="subtitle1">{t('catalog.filters.title', 'Filtros catálogo base')}</Typography>
              <Grid container spacing={1.5}>
                <Grid item xs={12} md={3}>
                  <TextField
                    select
                    fullWidth
                    label={t('catalog.filters.type', 'Tipo detectado')}
                    value={typeFilter}
                    onChange={(event) => setTypeFilter(event.target.value)}
                  >
                    <MenuItem value="">{t('catalog.filters.all', 'Todos')}</MenuItem>
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
                    label={t('catalog.filters.active', 'Activo')}
                    value={activeFilter}
                    onChange={(event) => setActiveFilter(event.target.value)}
                  >
                    <MenuItem value="">{t('catalog.filters.all', 'Todos')}</MenuItem>
                    <MenuItem value="true">true</MenuItem>
                    <MenuItem value="false">false</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t('catalog.filters.search', 'Buscar')}
                    value={queryFilter}
                    onChange={(event) => setQueryFilter(event.target.value)}
                    placeholder={t('catalog.filters.searchPlaceholder', 'rawTitle, canonicalTitle, groupTitle, tvgName')}
                  />
                </Grid>
              </Grid>
              <Stack direction="row" spacing={1} justifyContent="flex-end">
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
                  {t('catalog.actions.clearFilters', 'Limpiar filtros')}
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    setPage(0);
                    setRefreshKey((value) => value + 1);
                  }}
                >
                  {t('catalog.actions.applyFilters', 'Aplicar filtros')}
                </Button>
              </Stack>
            </Stack>
          </Paper>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} alignItems={{ xs: 'flex-start', md: 'center' }}>
            <Chip color="primary" label={`${t('catalog.summary.totalItems', 'Total items')}: ${totalItems}`} />
            <Chip color="info" label={`${t('catalog.summary.categories', 'Categorías')}: ${categories.length}`} />
          </Stack>

          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>{t('catalog.table.title', 'Título')}</TableCell>
                  <TableCell>{t('catalog.table.type', 'Tipo')}</TableCell>
                  <TableCell>{t('catalog.table.groupTitle', 'Group Original')}</TableCell>
                  <TableCell>{t('catalog.table.primaryCategory', 'Categoría manual')}</TableCell>
                  <TableCell>{t('catalog.table.active', 'Activo')}</TableCell>
                  <TableCell>{t('catalog.table.updated', 'Actualizado')}</TableCell>
                  <TableCell align="right">{t('catalog.table.actions', 'Acciones')}</TableCell>
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
                          label={item.primaryCategoryName || t('catalog.table.noManualCategory', 'Sin asignación manual')}
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
                      {t('catalog.messages.noItems', 'No se encontraron items con los filtros actuales.')}
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

          <Divider />

          <Paper variant="outlined" sx={{ p: 2 }}>
            <Stack spacing={1.5}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="subtitle1">{t('catalog.categories.title', 'Gestión de categorías')}</Typography>
                <Button variant="contained" size="small" startIcon={<AddCircleOutlineIcon />} onClick={() => setCreateCategoryDialog(true)}>
                  {t('catalog.categories.new', 'Nueva categoría')}
                </Button>
              </Stack>

              {categoriesLoading ? (
                <Stack direction="row" spacing={1}>
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={`cat-skeleton-${index}`} width={160} height={32} />
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
        </Stack>
      </MainCard>

      <Dialog open={createCategoryDialog} onClose={() => (savingCategory ? null : setCreateCategoryDialog(false))} maxWidth="sm" fullWidth>
        <DialogTitleWithClose onClose={() => (savingCategory ? null : setCreateCategoryDialog(false))}>
          {t('catalog.categories.createTitle', 'Crear categoría')}
        </DialogTitleWithClose>
        <DialogContent dividers>
          <Stack spacing={2}>
            <TextField
              label={t('catalog.categories.name', 'Nombre')}
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
              label={t('catalog.categories.active', 'Activa')}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => (savingCategory ? null : setCreateCategoryDialog(false))} disabled={savingCategory}>
            {t('actions.cancel', 'Cancelar')}
          </Button>
          <Button variant="contained" onClick={submitCreateCategory} disabled={savingCategory}>
            {savingCategory ? t('actions.saving', 'Guardando...') : t('actions.create', 'Crear')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={assignDialog.open} onClose={closeAssignDialog} maxWidth="sm" fullWidth>
        <DialogTitleWithClose onClose={closeAssignDialog}>{t('catalog.assign.title', 'Asignar categoría manual')}</DialogTitleWithClose>
        <DialogContent dividers>
          <Stack spacing={2}>
            <TextField label={t('catalog.assign.item', 'Item')} value={assignDialog.item?.rawTitle || ''} disabled fullWidth />

            <Autocomplete
              options={categoryOptions}
              value={selectedAssignCategory}
              onChange={(_, value) => {
                setAssignForm((previous) => ({ ...previous, categoryId: value?.value ?? null }));
              }}
              renderInput={(params) => <TextField {...params} label={t('catalog.assign.category', 'Categoría')} />}
            />

            <Button
              variant="text"
              onClick={() => {
                setAssignForm((previous) => ({ ...previous, categoryId: null }));
              }}
            >
              {t('catalog.assign.clearPrimary', 'Quitar categoría manual primaria')}
            </Button>

            <FormControlLabel
              control={
                <Switch
                  checked={assignForm.isPrimary}
                  onChange={(event) => setAssignForm((previous) => ({ ...previous, isPrimary: event.target.checked }))}
                />
              }
              label={t('catalog.assign.primary', 'Asignar como primaria')}
            />

            <TextField
              label={t('catalog.assign.assignedBy', 'Asignado por')}
              value={assignForm.assignedBy}
              onChange={(event) => setAssignForm((previous) => ({ ...previous, assignedBy: event.target.value }))}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAssignDialog} disabled={assigning}>
            {t('actions.cancel', 'Cancelar')}
          </Button>
          <Button variant="contained" onClick={submitAssignCategory} disabled={assigning}>
            {assigning ? t('actions.saving', 'Guardando...') : t('actions.save', 'Guardar')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={detailDialog.open} onClose={() => setDetailDialog({ open: false, item: null, loading: false })} maxWidth="md" fullWidth>
        <DialogTitleWithClose onClose={() => setDetailDialog({ open: false, item: null, loading: false })}>
          {t('catalog.detail.title', 'Detalle del item')}
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
          <Button onClick={() => setDetailDialog({ open: false, item: null, loading: false })}>{t('actions.cancel', 'Cerrar')}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
