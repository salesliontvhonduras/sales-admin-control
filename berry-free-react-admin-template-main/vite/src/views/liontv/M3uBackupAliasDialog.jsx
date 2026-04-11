import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import useAuth from 'hooks/useAuth';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LinkIcon from '@mui/icons-material/Link';
import RefreshIcon from '@mui/icons-material/Refresh';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';

import DialogTitleWithClose from 'ui-component/dialogs/DialogTitleWithClose';
import {
  buildClientAliasDownloadUrl,
  buildClientAliasDeliveryUrl,
  getClientAliasByLine,
  getLineSourceByLine,
  listLineOptions,
  upsertClientAlias,
  upsertLineSource
} from 'api/m3u-catalog';

const defaultForm = {
  lineId: '',
  usernameEncode: '',
  providerHint: '',
  aliasId: null,
  aliasUsername: '',
  aliasPasswordPlain: '',
  aliasActive: true,
  sourcePlaylistUrl: '',
  sourceProviderName: '',
  sourceActive: true,
  cacheTtlMinutes: 30,
  lastServedAt: null,
  lastError: '',
  updatedAt: null
};

function generateSimplePassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function extractErrorMessage(error, fallback) {
  return error?.response?.data?.message || error?.message || fallback;
}

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString();
}

export default function M3uBackupAliasDialog({ open, onClose, line = null, lockLine = false, onSaved }) {
  const { accessToken } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [lineOptions, setLineOptions] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [loadingConfig, setLoadingConfig] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(defaultForm);

  const selectedLineOption = useMemo(() => {
    if (!form.lineId) return null;
    return lineOptions.find((item) => item.lineId === form.lineId) || null;
  }, [form.lineId, lineOptions]);

  const previewUrl = useMemo(
    () =>
      buildClientAliasDeliveryUrl({
        aliasUsername: form.aliasUsername,
        aliasPasswordPlain: form.aliasPasswordPlain
      }),
    [form.aliasPasswordPlain, form.aliasUsername]
  );
  const downloadUrl = useMemo(
    () =>
      buildClientAliasDownloadUrl({
        aliasUsername: form.aliasUsername,
        aliasPasswordPlain: form.aliasPasswordPlain
      }),
    [form.aliasPasswordPlain, form.aliasUsername]
  );

  const loadLineOptions = useCallback(async () => {
    if (!accessToken || lockLine) return;
    setLoadingOptions(true);
    try {
      const options = await listLineOptions({ accessToken });
      setLineOptions(options);
    } catch (error) {
      enqueueSnackbar(extractErrorMessage(error, t('m3uBackup.errors.loadLines', 'Could not load active lines.')), { variant: 'error' });
    } finally {
      setLoadingOptions(false);
    }
  }, [accessToken, enqueueSnackbar, lockLine, t]);

  const applyInitialLine = useCallback(() => {
    if (!open) return;

    const nextLineId = String(line?.lineId || line?.id || '').trim();
    const nextUsernameEncode = String(line?.usernameEncode || line?.username || '').trim();
    const nextProvider = String(line?.provider || '').trim();

    setForm((previous) => ({
      ...defaultForm,
      lineId: nextLineId,
      usernameEncode: nextUsernameEncode,
      providerHint: nextProvider,
      sourceProviderName: nextProvider
    }));
  }, [line, open]);

  const loadConfiguration = useCallback(
    async (lineIdValue) => {
      const safeLineId = String(lineIdValue || '').trim();
      if (!accessToken || !safeLineId) return;

      setLoadingConfig(true);
      try {
        const [lineSourceResult, aliasResult] = await Promise.allSettled([
          getLineSourceByLine({ accessToken, lineId: safeLineId }),
          getClientAliasByLine({ accessToken, lineId: safeLineId })
        ]);

        setForm((previous) => {
          const lineSource =
            lineSourceResult.status === 'fulfilled'
              ? lineSourceResult.value
              : { sourcePlaylistUrl: '', sourceProviderName: previous.providerHint || '', cacheTtlMinutes: 30, active: true };
          const alias =
            aliasResult.status === 'fulfilled'
              ? aliasResult.value
              : { id: null, aliasUsername: '', aliasPasswordPlain: '', active: true, lastServedAt: null, lastError: '' };

          return {
            ...previous,
            lineId: safeLineId,
            usernameEncode: lineSource.usernameEncode || previous.usernameEncode || selectedLineOption?.usernameEncode || '',
            providerHint: previous.providerHint || selectedLineOption?.provider || '',
            aliasId: alias.id ?? null,
            aliasUsername: alias.aliasUsername || '',
            aliasPasswordPlain: alias.aliasPasswordPlain || '',
            aliasActive: alias.active !== undefined ? Boolean(alias.active) : true,
            sourcePlaylistUrl: lineSource.sourcePlaylistUrl || '',
            sourceProviderName: lineSource.sourceProviderName || previous.providerHint || selectedLineOption?.provider || '',
            sourceActive: lineSource.active !== undefined ? Boolean(lineSource.active) : true,
            cacheTtlMinutes: lineSource.cacheTtlMinutes ?? 30,
            lastServedAt: alias.lastServedAt || null,
            lastError: alias.lastError || '',
            updatedAt: alias.updatedAt || lineSource.updatedAt || null
          };
        });
      } catch (error) {
        enqueueSnackbar(
          extractErrorMessage(error, t('m3uBackup.errors.loadConfig', 'Could not load the backup configuration for this line.')),
          { variant: 'error' }
        );
      } finally {
        setLoadingConfig(false);
      }
    },
    [accessToken, enqueueSnackbar, selectedLineOption?.provider, selectedLineOption?.usernameEncode, t]
  );

  useEffect(() => {
    if (!open) return;
    applyInitialLine();
  }, [applyInitialLine, open]);

  useEffect(() => {
    if (!open) return;
    loadLineOptions();
  }, [loadLineOptions, open]);

  useEffect(() => {
    if (!open || !form.lineId) return;
    loadConfiguration(form.lineId);
  }, [form.lineId, loadConfiguration, open]);

  useEffect(() => {
    if (!open || lockLine) return;
    if (!selectedLineOption) return;
    setForm((previous) => ({
      ...previous,
      usernameEncode: previous.usernameEncode || selectedLineOption.usernameEncode || '',
      providerHint: selectedLineOption.provider || '',
      sourceProviderName: previous.sourceProviderName || selectedLineOption.provider || ''
    }));
  }, [lockLine, open, selectedLineOption]);

  const handleGeneratePassword = () => {
    setForm((previous) => ({ ...previous, aliasPasswordPlain: generateSimplePassword() }));
  };

  const handleCopyLink = async () => {
    if (!form.aliasUsername || !form.aliasPasswordPlain) {
      enqueueSnackbar(t('m3uBackup.messages.missingPreview', 'Define alias username and password first.'), { variant: 'warning' });
      return;
    }
    await navigator.clipboard.writeText(previewUrl);
    enqueueSnackbar(t('m3uBackup.messages.linkCopied', 'Player link copied.'), { variant: 'success' });
  };

  const handleCopyDownloadLink = async () => {
    if (!form.aliasUsername || !form.aliasPasswordPlain) {
      enqueueSnackbar(t('m3uBackup.messages.missingPreview', 'Define alias username and password first.'), { variant: 'warning' });
      return;
    }
    await navigator.clipboard.writeText(downloadUrl);
    enqueueSnackbar(t('m3uBackup.messages.downloadLinkCopied', 'Download link copied.'), { variant: 'success' });
  };

  const handleSave = async () => {
    const lineId = String(form.lineId || '').trim();
    const aliasUsername = String(form.aliasUsername || '').trim();
    const aliasPasswordPlain = String(form.aliasPasswordPlain || '').trim();
    const sourcePlaylistUrl = String(form.sourcePlaylistUrl || '').trim();
    const sourceProviderName = String(form.sourceProviderName || '').trim();

    if (!lineId || !aliasUsername || !aliasPasswordPlain) {
      enqueueSnackbar(t('m3uBackup.errors.required', 'Line, alias username and alias password are required.'), { variant: 'warning' });
      return;
    }

    if (!sourcePlaylistUrl && !sourceProviderName) {
      enqueueSnackbar(t('m3uBackup.errors.sourceRequired', 'Provide a source URL or a provider for this line.'), { variant: 'warning' });
      return;
    }

    setSaving(true);
    try {
      const source = await upsertLineSource({
        accessToken,
        payload: {
          lineId,
          sourcePlaylistUrl,
          sourceProviderName,
          cacheTtlMinutes: Number(form.cacheTtlMinutes) || 30,
          active: form.sourceActive
        }
      });

      const alias = await upsertClientAlias({
        accessToken,
        payload: {
          lineId,
          aliasUsername,
          aliasPasswordPlain,
          active: form.aliasActive
        }
      });

      setForm((previous) => ({
        ...previous,
        aliasId: alias.id ?? previous.aliasId,
        aliasUsername: alias.aliasUsername || previous.aliasUsername,
        aliasPasswordPlain: alias.aliasPasswordPlain || previous.aliasPasswordPlain,
        aliasActive: alias.active !== undefined ? Boolean(alias.active) : previous.aliasActive,
        sourcePlaylistUrl: source.sourcePlaylistUrl || previous.sourcePlaylistUrl,
        sourceProviderName: source.sourceProviderName || previous.sourceProviderName,
        sourceActive: source.active !== undefined ? Boolean(source.active) : previous.sourceActive,
        cacheTtlMinutes: source.cacheTtlMinutes ?? previous.cacheTtlMinutes,
        lastServedAt: alias.lastServedAt || previous.lastServedAt,
        lastError: alias.lastError || '',
        updatedAt: alias.updatedAt || source.updatedAt || previous.updatedAt
      }));

      enqueueSnackbar(t('m3uBackup.messages.saved', 'Backup alias saved successfully.'), { variant: 'success' });
      onSaved?.({ alias, source });
    } catch (error) {
      enqueueSnackbar(extractErrorMessage(error, t('m3uBackup.errors.save', 'Could not save the backup alias.')), { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={saving ? undefined : onClose} fullWidth maxWidth="md" fullScreen={isMobile}>
      <DialogTitleWithClose onClose={saving ? () => {} : onClose}>
        <Stack spacing={0.5}>
          <Typography variant="h6">{t('m3uBackup.title', 'M3U Backup Link')}</Typography>
          <Typography variant="body2" color="text.secondary">
            {t(
              'm3uBackup.subtitle',
              'Bind a simple alias to an active real line. The client receives the alias link, but the download uses the original line credentials.'
            )}
          </Typography>
        </Stack>
      </DialogTitleWithClose>

      <DialogContent dividers sx={{ px: { xs: 1.5, sm: 3 }, py: { xs: 1.5, sm: 2 } }}>
        <Stack spacing={2}>
          <Alert severity="info">
            {t(
              'm3uBackup.helper',
              'The original line must stay active. If the line is inactive, expired or banned, the middleware will reject the download.'
            )}
          </Alert>

          <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2.5 }}>
            <Stack spacing={1.5}>
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                <Chip size="small" color="primary" icon={<LinkIcon fontSize="small" />} label={t('m3uBackup.badge', 'Xtream backup alias')} />
                {form.updatedAt ? <Chip size="small" variant="outlined" label={`${t('m3uBackup.updatedAt', 'Updated')}: ${formatDate(form.updatedAt)}`} /> : null}
                {form.lastServedAt ? (
                  <Chip size="small" color="success" variant="outlined" label={`${t('m3uBackup.lastServedAt', 'Last served')}: ${formatDate(form.lastServedAt)}`} />
                ) : null}
              </Stack>

              <Box
                sx={{
                  display: 'grid',
                  gap: 2,
                  gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, minmax(0, 1fr))' }
                }}
              >
                <TextField
                  select
                  fullWidth
                  disabled={lockLine || loadingOptions}
                  label={t('m3uBackup.line', 'Line')}
                  value={form.lineId}
                  onChange={(event) => setForm((previous) => ({ ...previous, lineId: event.target.value, usernameEncode: '', aliasId: null }))}
                  helperText={
                    lockLine
                      ? t('m3uBackup.lineLocked', 'This backup link is bound to the selected line.')
                      : t('m3uBackup.lineHelper', 'Select the active line that should back this alias.')
                  }
                >
                  <MenuItem value="">{t('m3uBackup.linePlaceholder', 'Select line...')}</MenuItem>
                  {lineOptions.map((option) => (
                    <MenuItem key={option.lineId} value={option.lineId}>
                      {`${option.lineId} / ${option.usernameEncode || option.lineId}${option.provider ? ` (${option.provider})` : ''}`}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  fullWidth
                  label={t('m3uBackup.usernameEncode', 'Real visible username')}
                  value={form.usernameEncode}
                  InputProps={{ readOnly: true }}
                  helperText={t('m3uBackup.usernameEncodeHelper', 'The client does not receive this value; it is only the real line reference.')}
                />

                <TextField
                  fullWidth
                  label={t('m3uBackup.aliasUsername', 'Alias username')}
                  value={form.aliasUsername}
                  onChange={(event) => setForm((previous) => ({ ...previous, aliasUsername: event.target.value }))}
                  helperText={t('m3uBackup.aliasUsernameHelper', 'Simple username delivered to the client.')}
                />

                <TextField
                  fullWidth
                  label={t('m3uBackup.aliasPassword', 'Alias password')}
                  value={form.aliasPasswordPlain}
                  onChange={(event) => setForm((previous) => ({ ...previous, aliasPasswordPlain: event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6) }))}
                  helperText={t('m3uBackup.aliasPasswordHelper', 'Exactly 6 alphanumeric characters. The backend stores it plain and signed.')}
                  InputProps={{
                    endAdornment: (
                      <Button size="small" onClick={handleGeneratePassword} startIcon={<AutoAwesomeIcon fontSize="small" />}>
                        {t('m3uBackup.generate', 'Generate')}
                      </Button>
                    )
                  }}
                />

                <TextField
                  fullWidth
                  label={t('m3uBackup.sourceUrl', 'Source playlist URL')}
                  value={form.sourcePlaylistUrl}
                  onChange={(event) => setForm((previous) => ({ ...previous, sourcePlaylistUrl: event.target.value }))}
                  placeholder="https://provider.example.com/get.php?username={username_encode}&password={password_encode}&type=m3u_plus&output=ts"
                  helperText={t(
                    'm3uBackup.sourceUrlHelper',
                    'Optional but recommended. Supports {username_encode} and {password_encode}. If empty, the provider template fallback is used.'
                  )}
                />

                <TextField
                  fullWidth
                  label={t('m3uBackup.provider', 'Provider label')}
                  value={form.sourceProviderName}
                  onChange={(event) => setForm((previous) => ({ ...previous, sourceProviderName: event.target.value }))}
                  placeholder={form.providerHint || 'LION_TV'}
                  helperText={t('m3uBackup.providerHelper', 'Optional label or provider template code for fallback resolution.')}
                />

                <TextField
                  fullWidth
                  type="number"
                  label={t('m3uBackup.cacheTtl', 'Cache TTL (min)')}
                  value={form.cacheTtlMinutes}
                  onChange={(event) => setForm((previous) => ({ ...previous, cacheTtlMinutes: event.target.value }))}
                  inputProps={{ min: 1 }}
                />

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={Boolean(form.aliasActive)}
                        onChange={(event) => setForm((previous) => ({ ...previous, aliasActive: event.target.checked }))}
                      />
                    }
                    label={t('m3uBackup.active', 'Alias active')}
                  />
                </Box>
              </Box>
            </Stack>
          </Paper>

          <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2.5 }}>
            <Stack spacing={1}>
              <Typography variant="subtitle2">{t('m3uBackup.previewTitle', 'Client link preview')}</Typography>
              <TextField
                fullWidth
                value={previewUrl}
                InputProps={{ readOnly: true }}
                helperText={t('m3uBackup.previewHelper', 'Use this URL inside IPTV players or apps that consume M3U by URL.')}
              />
              <TextField
                fullWidth
                value={downloadUrl}
                InputProps={{ readOnly: true }}
                helperText={t('m3uBackup.downloadHelper', 'Use this URL in a browser when you want the .m3u file to download directly.')}
              />
              {form.lastError ? <Alert severity="warning">{form.lastError}</Alert> : null}
            </Stack>
          </Paper>
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          px: { xs: 1.5, sm: 3 },
          py: { xs: 1.5, sm: 2 },
          gap: 1,
          flexDirection: { xs: 'column-reverse', sm: 'row' },
          '& > *': { width: { xs: '100%', sm: 'auto' } }
        }}
      >
        <Button variant="outlined" onClick={onClose} disabled={saving}>
          {t('common.close', 'Close')}
        </Button>
        <Button variant="outlined" onClick={() => loadConfiguration(form.lineId)} disabled={loadingConfig || !form.lineId}>
          {loadingConfig ? t('m3uBackup.loading', 'Loading...') : t('m3uBackup.reload', 'Reload')}
        </Button>
        <Button variant="outlined" startIcon={<ContentCopyIcon />} onClick={handleCopyLink} disabled={!form.aliasUsername || !form.aliasPasswordPlain}>
          {t('m3uBackup.copyLink', 'Copy player link')}
        </Button>
        <Button variant="outlined" startIcon={<ContentCopyIcon />} onClick={handleCopyDownloadLink} disabled={!form.aliasUsername || !form.aliasPasswordPlain}>
          {t('m3uBackup.copyDownloadLink', 'Copy download link')}
        </Button>
        <Button variant="contained" startIcon={<SaveOutlinedIcon />} onClick={handleSave} disabled={saving || !form.lineId}>
          {saving ? t('common.saving', 'Saving...') : t('common.save', 'Save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
