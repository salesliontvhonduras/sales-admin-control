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
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';

import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import RefreshIcon from '@mui/icons-material/Refresh';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';

import MainCard from 'ui-component/cards/MainCard';
import {
  downloadM3uByToken,
  getLineSourceByLine,
  importCatalogByToken,
  listLineOptions,
  upsertLineSource
} from 'api/m3u-catalog';

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString();
}

function buildDownloadFilename(token, contentDisposition) {
  const fromHeader = /filename="?([^"]+)"?/i.exec(contentDisposition || '')?.[1];
  if (fromHeader) return fromHeader;
  return `playlist_${String(token || 'test').replace(/[^a-zA-Z0-9_-]/g, '_')}.m3u`;
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

const defaultLineSourceForm = {
  lineId: '',
  username: '',
  sourcePlaylistUrl: '',
  sourceProviderName: '',
  cacheTtlMinutes: 30,
  active: true,
  lastDownloadedAt: null,
  updatedAt: null
};

const LINE_PROVIDER_OPTIONS = [
  'LION_TV',
  'TITAN',
  'LION_PLUS+',
  'SPOTIFY',
  'NETFLIX',
  'AMAZON_PRIME',
  'YOUTUBE_PREMIUM',
  'DISNEY_PLUS_PREMIUM'
];

export default function M3uLineSourcesLionTv() {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const { accessToken } = useAuth();

  const [lineOptions, setLineOptions] = useState([]);
  const [loadingLineOptions, setLoadingLineOptions] = useState(false);
  const [selectedLineKey, setSelectedLineKey] = useState('');
  const [lineSourceForm, setLineSourceForm] = useState(defaultLineSourceForm);
  const [loadingLineSource, setLoadingLineSource] = useState(false);
  const [savingLineSource, setSavingLineSource] = useState(false);

  const [tokenInput, setTokenInput] = useState('');
  const [importing, setImporting] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [fullTestLoading, setFullTestLoading] = useState(false);

  const selectedLineOption = useMemo(() => lineOptions.find((option) => option.key === selectedLineKey) || null, [lineOptions, selectedLineKey]);
  const providerOptions = useMemo(() => {
    const values = [...LINE_PROVIDER_OPTIONS];
    const current = String(lineSourceForm.sourceProviderName || '').trim();
    if (current && !values.includes(current)) {
      values.push(current);
    }
    return values;
  }, [lineSourceForm.sourceProviderName]);

  const refreshLineOptions = useCallback(async () => {
    if (!accessToken) return;
    setLoadingLineOptions(true);
    try {
      const options = await listLineOptions({ accessToken });
      const normalized = options.map((option) => ({
        ...option,
        provider: option.provider || 'LION_TV',
        key: `${option.lineId}::${option.username}`,
        label: `${option.lineId} / ${option.username}${option.provider ? ` (${option.provider})` : ''}`
      }));
      setLineOptions(normalized);
    } catch (error) {
      enqueueSnackbar(extractErrorMessage(error, t('catalog.messages.lineOptionsLoadError', 'No se pudieron cargar las líneas activas.')), {
        variant: 'error'
      });
    } finally {
      setLoadingLineOptions(false);
    }
  }, [accessToken, enqueueSnackbar, t]);

  const loadLineSourceConfig = useCallback(
    async (lineIdValue, usernameValue) => {
      const lineId = String(lineIdValue || lineSourceForm.lineId || '').trim();
      const username = String(usernameValue || lineSourceForm.username || '').trim();
      if (!lineId || !username) {
        enqueueSnackbar(t('catalog.messages.lineAndUserRequired', 'Line ID y Username son obligatorios.'), { variant: 'warning' });
        return;
      }

      setLoadingLineSource(true);
      try {
        const source = await getLineSourceByLine({ accessToken, lineId, username });
        setLineSourceForm({
          lineId: source.lineId || lineId,
          username: source.username || username,
          sourcePlaylistUrl: source.sourcePlaylistUrl || '',
          sourceProviderName: source.sourceProviderName || selectedLineOption?.provider || 'LION_TV',
          cacheTtlMinutes: source.cacheTtlMinutes ?? 30,
          active: source.active !== undefined ? Boolean(source.active) : true,
          lastDownloadedAt: source.lastDownloadedAt || null,
          updatedAt: source.updatedAt || null
        });
      } catch (error) {
        if (error?.response?.status === 404) {
          setLineSourceForm((previous) => ({
            ...previous,
            lineId,
            username,
            sourcePlaylistUrl: '',
            sourceProviderName: selectedLineOption?.provider || 'LION_TV',
            cacheTtlMinutes: 30,
            active: true,
            lastDownloadedAt: null,
            updatedAt: null
          }));
          enqueueSnackbar(t('catalog.messages.lineSourceNotFound', 'No existe configuración guardada para esa línea.'), { variant: 'info' });
        } else {
          enqueueSnackbar(extractErrorMessage(error, t('catalog.messages.lineSourceLoadError', 'No se pudo cargar la fuente de línea.')), {
            variant: 'error'
          });
        }
      } finally {
        setLoadingLineSource(false);
      }
    },
    [accessToken, enqueueSnackbar, lineSourceForm.lineId, lineSourceForm.username, selectedLineOption?.provider, t]
  );

  const saveLineSourceConfig = useCallback(async () => {
    const lineId = lineSourceForm.lineId.trim();
    const username = lineSourceForm.username.trim();
    const sourcePlaylistUrl = lineSourceForm.sourcePlaylistUrl.trim();
    if (!lineId || !username || !sourcePlaylistUrl) {
      enqueueSnackbar(t('catalog.messages.lineSourceRequiredFields', 'Line ID, Username y URL origen son obligatorios.'), {
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
          username,
          sourcePlaylistUrl,
          sourceProviderName: lineSourceForm.sourceProviderName?.trim() || null,
          cacheTtlMinutes: Number(lineSourceForm.cacheTtlMinutes) || 30,
          active: Boolean(lineSourceForm.active)
        }
      });

      setLineSourceForm({
        lineId: saved.lineId || lineId,
        username: saved.username || username,
        sourcePlaylistUrl: saved.sourcePlaylistUrl || sourcePlaylistUrl,
        sourceProviderName: saved.sourceProviderName || '',
        cacheTtlMinutes: saved.cacheTtlMinutes ?? 30,
        active: saved.active !== undefined ? Boolean(saved.active) : true,
        lastDownloadedAt: saved.lastDownloadedAt || null,
        updatedAt: saved.updatedAt || null
      });
      enqueueSnackbar(t('catalog.messages.lineSourceSaved', 'Fuente guardada correctamente.'), { variant: 'success' });
      await refreshLineOptions();
    } catch (error) {
      enqueueSnackbar(extractErrorMessage(error, t('catalog.messages.lineSourceSaveError', 'No se pudo guardar la fuente.')), {
        variant: 'error'
      });
    } finally {
      setSavingLineSource(false);
    }
  }, [
    accessToken,
    enqueueSnackbar,
    lineSourceForm.active,
    lineSourceForm.cacheTtlMinutes,
    lineSourceForm.lineId,
    lineSourceForm.sourcePlaylistUrl,
    lineSourceForm.sourceProviderName,
    lineSourceForm.username,
    refreshLineOptions,
    t
  ]);

  const handleImportCatalog = useCallback(async () => {
    const token = tokenInput.trim();
    if (!token) {
      enqueueSnackbar(t('catalog.messages.tokenRequired', 'Ingresa un token para importar.'), { variant: 'warning' });
      return;
    }

    setImporting(true);
    try {
      const result = await importCatalogByToken({ accessToken, token });
      enqueueSnackbar(
        t('catalog.messages.importSuccess', 'Importación completada.') +
          ` parsed=${result?.parsedItems ?? 0}, inserted=${result?.insertedItems ?? 0}, updated=${result?.updatedItems ?? 0}`,
        { variant: 'success' }
      );
    } catch (error) {
      enqueueSnackbar(extractErrorMessage(error, t('catalog.messages.importError', 'No se pudo importar el catálogo.')), {
        variant: 'error'
      });
    } finally {
      setImporting(false);
    }
  }, [accessToken, enqueueSnackbar, t, tokenInput]);

  const handleDownloadPlaylist = useCallback(async () => {
    const token = tokenInput.trim();
    if (!token) {
      enqueueSnackbar(t('catalog.messages.tokenRequiredForDownload', 'Ingresa un token para descargar la playlist.'), {
        variant: 'warning'
      });
      return;
    }

    setDownloading(true);
    try {
      const { blob, contentDisposition } = await downloadM3uByToken({ accessToken, token });
      triggerBrowserDownload(blob, buildDownloadFilename(token, contentDisposition));
      enqueueSnackbar(t('catalog.messages.downloadSuccess', 'Playlist descargada correctamente.'), { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(extractErrorMessage(error, t('catalog.messages.downloadError', 'No se pudo descargar la playlist.')), {
        variant: 'error'
      });
    } finally {
      setDownloading(false);
    }
  }, [accessToken, enqueueSnackbar, t, tokenInput]);

  const handleFullFlowTest = useCallback(async () => {
    const token = tokenInput.trim();
    if (!token) {
      enqueueSnackbar(t('catalog.messages.tokenRequired', 'Ingresa un token para importar.'), { variant: 'warning' });
      return;
    }

    setFullTestLoading(true);
    try {
      const importResult = await importCatalogByToken({ accessToken, token });
      const { blob, contentDisposition } = await downloadM3uByToken({ accessToken, token });
      triggerBrowserDownload(blob, buildDownloadFilename(token, contentDisposition));

      enqueueSnackbar(
        t('catalog.messages.fullFlowSuccess', 'Flujo completo OK: importación + descarga.') + ` parsed=${importResult?.parsedItems ?? 0}`,
        { variant: 'success' }
      );
    } catch (error) {
      enqueueSnackbar(extractErrorMessage(error, t('catalog.messages.fullFlowError', 'Falló la prueba completa del flujo.')), {
        variant: 'error'
      });
    } finally {
      setFullTestLoading(false);
    }
  }, [accessToken, enqueueSnackbar, t, tokenInput]);

  useEffect(() => {
    refreshLineOptions();
  }, [refreshLineOptions]);

  useEffect(() => {
    if (!selectedLineOption) {
      return;
    }

    setLineSourceForm((previous) => ({
      ...previous,
      lineId: selectedLineOption.lineId,
      username: selectedLineOption.username,
      sourceProviderName: previous.sourceProviderName || selectedLineOption.provider || 'LION_TV'
    }));
    setTokenInput((previous) => previous || selectedLineOption.token || '');
    loadLineSourceConfig(selectedLineOption.lineId, selectedLineOption.username);
  }, [loadLineSourceConfig, selectedLineOption]);

  return (
    <Box sx={{ width: '100%', maxWidth: 1400, mx: 'auto' }}>
      <MainCard
        title={t('catalog.lineSources.title', 'Configuración de Fuentes por Línea')}
        secondary={
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={refreshLineOptions} disabled={loadingLineOptions}>
            {loadingLineOptions ? t('catalog.actions.loading', 'Cargando...') : t('catalog.actions.refresh', 'Refrescar')}
          </Button>
        }
      >
        <Stack spacing={2.5}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Stack spacing={1.25}>
              <Typography variant="subtitle1">{t('catalog.lineSources.howItWorks', 'Cómo configurar este módulo')}</Typography>
              <Alert severity="info" sx={{ alignItems: 'center' }}>
                <Stack spacing={0.5}>
                  <Typography variant="body2">
                    {t(
                      'catalog.lineSources.step1',
                      '1) Selecciona la llave de línea (lineId + username) desde el selector. Este listado usa el endpoint line-options de M3U y la llave exacta de lines_data.'
                    )}
                  </Typography>
                  <Typography variant="body2">
                    {t(
                      'catalog.lineSources.step2',
                      '2) Configura la URL source M3U original y provider, luego guarda.'
                    )}
                  </Typography>
                  <Typography variant="body2">
                    {t(
                      'catalog.lineSources.step3',
                      '3) Para probar flujo, usa el Token de línea (lines_data.token): importar catálogo y/o descargar M3U final.'
                    )}
                  </Typography>
                </Stack>
              </Alert>
            </Stack>
          </Paper>

          <Paper variant="outlined" sx={{ p: 2 }}>
            <Stack spacing={1.5}>
              <Typography variant="subtitle1">{t('catalog.lineSources.configTitle', 'Configuración de source playlist por línea')}</Typography>

              <Grid container spacing={1.5}>
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    label={t('catalog.lineSources.lineSelect', 'Selecciona la línea (lineId / username)')}
                    value={selectedLineKey}
                    onChange={(event) => setSelectedLineKey(event.target.value)}
                    helperText={t(
                      'catalog.lineSources.lineSelectHelper',
                      'Este selector usa /api/v1/line-sources/line-options y devuelve la llave exacta requerida por M3U.'
                    )}
                  >
                    <MenuItem value="">{t('catalog.lineSources.lineSelectPlaceholder', 'Seleccionar línea...')}</MenuItem>
                    {lineOptions.map((option) => (
                      <MenuItem key={option.key} value={option.key}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label={t('catalog.source.lineId', 'Line ID')}
                    value={lineSourceForm.lineId}
                    InputProps={{ readOnly: true }}
                    helperText={t('catalog.source.lineIdHelper', 'Identificador técnico de la línea seleccionada.')}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label={t('catalog.source.username', 'Username de busqueda')}
                    value={lineSourceForm.username}
                    InputProps={{ readOnly: true }}
                    helperText={t('catalog.source.usernameHelper', 'Username interno que usa el servicio M3U para buscar la línea.')}
                  />
                </Grid>

                <Grid item xs={12} md={7}>
                  <TextField
                    fullWidth
                    label={t('catalog.source.url', 'URL playlist original')}
                    value={lineSourceForm.sourcePlaylistUrl}
                    onChange={(event) => setLineSourceForm((previous) => ({ ...previous, sourcePlaylistUrl: event.target.value }))}
                    placeholder="https://proveedor.com/get.php?username=...&password=...&type=m3u_plus&output=ts"
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    select
                    fullWidth
                    label={t('catalog.source.provider', 'Proveedor')}
                    value={lineSourceForm.sourceProviderName}
                    onChange={(event) => setLineSourceForm((previous) => ({ ...previous, sourceProviderName: event.target.value }))}
                    helperText={t('catalog.source.providerHelper', 'Usa el mismo catálogo de provider del módulo Lines.')}
                  >
                    {providerOptions.map((providerOption) => (
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
                    label={t('catalog.source.ttl', 'TTL cache (min)')}
                    value={lineSourceForm.cacheTtlMinutes}
                    onChange={(event) => setLineSourceForm((previous) => ({ ...previous, cacheTtlMinutes: event.target.value }))}
                    inputProps={{ min: 1 }}
                    helperText={t('catalog.source.ttlHelper', 'Tiempo de cache para playlist final por token.')}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={Boolean(lineSourceForm.active)}
                        onChange={(event) => setLineSourceForm((previous) => ({ ...previous, active: event.target.checked }))}
                      />
                    }
                    label={t('catalog.source.active', 'Fuente activa')}
                  />
                </Grid>

                <Grid item xs={12} md={9}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="flex-end">
                    <Button
                      variant="outlined"
                      onClick={() => loadLineSourceConfig(lineSourceForm.lineId, lineSourceForm.username)}
                      disabled={loadingLineSource}
                    >
                      {loadingLineSource ? t('catalog.source.loading', 'Cargando...') : t('catalog.source.load', 'Cargar configuración')}
                    </Button>
                    <Button variant="contained" startIcon={<SaveOutlinedIcon />} onClick={saveLineSourceConfig} disabled={savingLineSource}>
                      {savingLineSource ? t('catalog.source.saving', 'Guardando...') : t('catalog.source.save', 'Guardar configuración')}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={1}>
                <Chip
                  size="small"
                  variant="outlined"
                  label={`${t('catalog.source.lastDownload', 'Última descarga')}: ${formatDate(lineSourceForm.lastDownloadedAt)}`}
                />
                <Chip size="small" variant="outlined" label={`${t('catalog.source.updatedAt', 'Actualizado')}: ${formatDate(lineSourceForm.updatedAt)}`} />
              </Stack>
            </Stack>
          </Paper>

          <Paper variant="outlined" sx={{ p: 2 }}>
            <Stack spacing={1.5}>
              <Typography variant="subtitle1">{t('catalog.import.title', 'Prueba operativa de flujo por token')}</Typography>
              <Grid container spacing={1.5}>
                <Grid item xs={12} md={5}>
                  <Stack spacing={0.75}>
                    <TextField
                      fullWidth
                      label={t('catalog.import.token', 'Token de línea')}
                      value={tokenInput}
                      onChange={(event) => setTokenInput(event.target.value)}
                      placeholder="token..."
                      helperText={t(
                        'catalog.import.tokenHelper',
                        'Este token es lines_data.token. Si seleccionas una línea, se autocompleta.'
                      )}
                    />
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Button
                        size="small"
                        variant="text"
                        disabled={!selectedLineOption?.token}
                        onClick={() => setTokenInput(selectedLineOption?.token || '')}
                      >
                        {t('catalog.import.useSelectedToken', 'Usar token de la línea seleccionada')}
                      </Button>
                      {selectedLineOption?.token ? <Chip size="small" color="info" label={t('catalog.import.tokenDetected', 'Token detectado')} /> : null}
                    </Stack>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={7}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                    <Button variant="contained" startIcon={<CloudDownloadIcon />} disabled={importing} onClick={handleImportCatalog}>
                      {importing ? t('catalog.actions.importing', 'Importando...') : t('catalog.actions.import', 'Importar catálogo')}
                    </Button>
                    <Button variant="outlined" startIcon={<FileDownloadIcon />} disabled={downloading} onClick={handleDownloadPlaylist}>
                      {downloading ? t('catalog.actions.downloading', 'Descargando...') : t('catalog.actions.downloadM3u', 'Descargar M3U')}
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      startIcon={<AssignmentTurnedInIcon />}
                      disabled={fullTestLoading}
                      onClick={handleFullFlowTest}
                    >
                      {fullTestLoading ? t('catalog.actions.testing', 'Probando...') : t('catalog.actions.fullFlowTest', 'Probar flujo completo')}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </Stack>
          </Paper>
        </Stack>
      </MainCard>
    </Box>
  );
}
