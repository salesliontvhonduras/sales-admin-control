import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import { IconEdit, IconPlus, IconRefresh, IconTrash } from '@tabler/icons-react';
import MainCard from 'ui-component/cards/MainCard';
import DialogTitleWithClose from 'ui-component/dialogs/DialogTitleWithClose';
import LionMetricCard from 'ui-component/cards/LionMetricCard';
import MobileFieldGrid from 'ui-component/responsive/MobileFieldGrid';
import MobileSummaryCard from 'ui-component/responsive/MobileSummaryCard';
import ResponsiveActionBar from 'ui-component/responsive/ResponsiveActionBar';
import ResponsiveFilters from 'ui-component/responsive/ResponsiveFilters';
import ResponsiveListSection from 'ui-component/responsive/ResponsiveListSection';
import ResponsiveMetricGrid from 'ui-component/responsive/ResponsiveMetricGrid';
import {
  createPanelAuth,
  deletePanelAuth,
  listPanelAuths,
  updatePanelAuth,
  updatePanelAuthStatus
} from 'api/panel-auth-admin';
import { clearBobSession, completeBobCaptcha, getBobSessionStatus, startBobCaptcha } from 'api/panel-auth-bob';

const PROVIDERS = ['VIVO_PLAYER', 'NINEXTREAM', 'BOB_PLAYER'];
const ACTIVE_FILTERS = ['all', 'active', 'inactive'];

const EMPTY_FORM = {
  username: '',
  provider: 'VIVO_PLAYER',
  usernamePanel: '',
  password: '',
  apiBaseUrl: '',
  cmsBaseUrl: '',
  active: true
};

function formatDateTime(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString();
}

export default function PanelAuthMultiAppAdmin() {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const apiConfigured = useMemo(() => {
    if (import.meta.env.VITE_API_VIVO_PLAYER) return true;
    const lionTv = import.meta.env.VITE_API_LIONTV;
    return Boolean(lionTv && String(lionTv).includes('/panel-lion-tv'));
  }, []);

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [filterUsername, setFilterUsername] = useState('');
  const [filterProvider, setFilterProvider] = useState('');
  const [filterActive, setFilterActive] = useState('all');

  const [openForm, setOpenForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [bobSessionMap, setBobSessionMap] = useState({});
  const [sessionLoadingMap, setSessionLoadingMap] = useState({});
  const [bobAuthDialog, setBobAuthDialog] = useState({
    open: false,
    row: null,
    challengeId: '',
    captchaSvg: '',
    captchaAnswer: '',
    session: null,
    loading: false
  });

  const [deleteTarget, setDeleteTarget] = useState(null);

  const statusFilterValue = useMemo(() => {
    if (filterActive === 'active') return true;
    if (filterActive === 'inactive') return false;
    return undefined;
  }, [filterActive]);

  const fetchRows = useCallback(async () => {
    if (!apiConfigured) return;
    setLoading(true);
    try {
      const payload = await listPanelAuths({
        index: page,
        size: rowsPerPage,
        username: filterUsername || undefined,
        provider: filterProvider || undefined,
        active: statusFilterValue
      });
      setRows(Array.isArray(payload?.items) ? payload.items : []);
      setTotal(Number(payload?.total || 0));
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || t('panelAuthAdmin.messages.loadError'), { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [apiConfigured, page, rowsPerPage, filterUsername, filterProvider, statusFilterValue, enqueueSnackbar, t]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  const loadBobStatuses = useCallback(
    async (currentRows) => {
      const bobRows = (Array.isArray(currentRows) ? currentRows : []).filter((row) => row.provider === 'BOB_PLAYER' && row.id);
      if (!bobRows.length) {
        setBobSessionMap({});
        return;
      }

      setSessionLoadingMap((prev) => ({
        ...prev,
        ...Object.fromEntries(bobRows.map((row) => [row.id, true]))
      }));

      const results = await Promise.allSettled(bobRows.map((row) => getBobSessionStatus(row.id)));
      setBobSessionMap((prev) => {
        const next = { ...prev };
        bobRows.forEach((row, index) => {
          const result = results[index];
          if (result.status === 'fulfilled') {
            next[row.id] = result.value;
          }
        });
        return next;
      });
      setSessionLoadingMap((prev) => {
        const next = { ...prev };
        bobRows.forEach((row) => {
          next[row.id] = false;
        });
        return next;
      });
    },
    [setBobSessionMap, setSessionLoadingMap]
  );

  useEffect(() => {
    loadBobStatuses(rows);
  }, [loadBobStatuses, rows]);

  const resetForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const openCreate = () => {
    resetForm();
    setOpenForm(true);
  };

  const openEdit = (row) => {
    setEditingId(row.id);
    setForm({
      username: row.username || '',
      provider: row.provider || 'VIVO_PLAYER',
      usernamePanel: row.usernamePanel || '',
      password: '',
      apiBaseUrl: row.apiBaseUrl || '',
      cmsBaseUrl: row.cmsBaseUrl || '',
      active: Boolean(row.active)
    });
    setOpenForm(true);
  };

  const closeForm = () => {
    setOpenForm(false);
    resetForm();
  };

  const onSubmit = async () => {
    if (!form.username || !form.provider || !form.usernamePanel) {
      enqueueSnackbar(t('panelAuthAdmin.messages.requiredFields'), { variant: 'warning' });
      return;
    }
    if (!editingId && !form.password) {
      enqueueSnackbar(t('panelAuthAdmin.messages.passwordRequired'), { variant: 'warning' });
      return;
    }

    const payload = {
      username: form.username.trim(),
      provider: form.provider,
      usernamePanel: form.usernamePanel.trim(),
      password: form.password || null,
      apiBaseUrl: form.apiBaseUrl || null,
      cmsBaseUrl: form.cmsBaseUrl || null,
      active: Boolean(form.active)
    };

    setSaving(true);
    try {
      if (editingId) {
        await updatePanelAuth(editingId, payload);
        enqueueSnackbar(t('panelAuthAdmin.messages.updated'), { variant: 'success' });
      } else {
        await createPanelAuth(payload);
        enqueueSnackbar(t('panelAuthAdmin.messages.created'), { variant: 'success' });
      }
      closeForm();
      await fetchRows();
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || t('panelAuthAdmin.messages.saveError'), { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const onToggleStatus = async (row) => {
    setSaving(true);
    try {
      await updatePanelAuthStatus(row.id, !row.active);
      enqueueSnackbar(t('panelAuthAdmin.messages.statusUpdated'), { variant: 'success' });
      await fetchRows();
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || t('panelAuthAdmin.messages.statusError'), { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!deleteTarget) return;
    setSaving(true);
    try {
      await deletePanelAuth(deleteTarget.id);
      enqueueSnackbar(t('panelAuthAdmin.messages.deleted'), { variant: 'success' });
      setDeleteTarget(null);
      await fetchRows();
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || t('panelAuthAdmin.messages.deleteError'), { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const providerLabel = (provider) => {
    if (provider === 'NINEXTREAM') return '9xtream';
    if (provider === 'BOB_PLAYER') return 'Bob Player';
    return 'Vivo Player';
  };

  const providerColor = (provider) => {
    if (provider === 'NINEXTREAM') return 'secondary';
    if (provider === 'BOB_PLAYER') return 'warning';
    return 'primary';
  };

  const sessionLabel = (status) => {
    const normalized = String(status || '').toUpperCase();
    if (normalized === 'READY') return t('panelAuthAdmin.session.ready', 'Ready');
    if (normalized === 'CAPTCHA_REQUIRED') return t('panelAuthAdmin.session.captchaRequired', 'Captcha required');
    if (normalized === 'AUTH_BLOCKED') return t('panelAuthAdmin.session.authBlocked', 'Auth blocked');
    if (normalized === 'INVALID') return t('panelAuthAdmin.session.invalid', 'Invalid');
    return t('panelAuthAdmin.session.notApplicable', 'N/A');
  };

  const sessionColor = (status) => {
    const normalized = String(status || '').toUpperCase();
    if (normalized === 'READY') return 'success';
    if (normalized === 'CAPTCHA_REQUIRED') return 'warning';
    if (normalized === 'AUTH_BLOCKED' || normalized === 'INVALID') return 'error';
    return 'default';
  };

  const renderBobSessionCell = (row) => {
    const session = bobSessionMap[row.id];
    const isLoadingSession = Boolean(sessionLoadingMap[row.id]);

    return (
      <Stack spacing={0.5} alignItems="flex-start">
        <Chip
          size="small"
          color={sessionColor(session?.sessionStatus)}
          label={isLoadingSession ? t('panelAuthAdmin.session.loading', 'Loading...') : sessionLabel(session?.sessionStatus)}
          variant="outlined"
        />
        <Typography variant="caption" color="text.secondary">
          {`${t('panelAuthAdmin.form.lastRefreshed', 'Last refreshed')}: ${formatDateTime(session?.sessionRefreshedAt)}`}
        </Typography>
      </Stack>
    );
  };

  const refreshBobStatus = useCallback(async (integrationId) => {
    if (!integrationId) return null;
    setSessionLoadingMap((prev) => ({ ...prev, [integrationId]: true }));
    try {
      const status = await getBobSessionStatus(integrationId);
      setBobSessionMap((prev) => ({ ...prev, [integrationId]: status }));
      return status;
    } finally {
      setSessionLoadingMap((prev) => ({ ...prev, [integrationId]: false }));
    }
  }, []);

  const openBobAuth = useCallback(
    async (row) => {
      setBobAuthDialog({
        open: true,
        row,
        challengeId: '',
        captchaSvg: '',
        captchaAnswer: '',
        session: bobSessionMap[row.id] || null,
        loading: true
      });
      try {
        const response = await startBobCaptcha(row.id);
        setBobAuthDialog((prev) => ({
          ...prev,
          row,
          challengeId: response.challengeId || '',
          captchaSvg: response.captchaSvg || '',
          session: {
            integrationId: response.integrationId,
            provider: response.provider,
            macAddress: response.macAddress,
            deviceKeyMasked: response.deviceKeyMasked,
            sessionStatus: response.sessionStatus,
            hasSession: response.hasSession,
            sessionRefreshedAt: response.sessionRefreshedAt,
            lastAuthError: response.lastAuthError
          },
          loading: false
        }));
      } catch (error) {
        enqueueSnackbar(error?.response?.data?.message || t('panelAuthAdmin.messages.bobStartError', 'Could not start Bob Player authentication.'), {
          variant: 'error'
        });
        setBobAuthDialog((prev) => ({ ...prev, open: false, loading: false }));
      }
    },
    [bobSessionMap, enqueueSnackbar, t]
  );

  const closeBobAuth = () => {
    setBobAuthDialog({
      open: false,
      row: null,
      challengeId: '',
      captchaSvg: '',
      captchaAnswer: '',
      session: null,
      loading: false
    });
  };

  const handleCompleteBobCaptcha = useCallback(async () => {
    if (!bobAuthDialog.row?.id || !bobAuthDialog.challengeId || !bobAuthDialog.captchaAnswer) {
      enqueueSnackbar(t('panelAuthAdmin.messages.captchaAnswerRequired', 'Enter the captcha before continuing.'), { variant: 'warning' });
      return;
    }
    setBobAuthDialog((prev) => ({ ...prev, loading: true }));
    try {
      const status = await completeBobCaptcha(bobAuthDialog.row.id, {
        challengeId: bobAuthDialog.challengeId,
        captchaAnswer: bobAuthDialog.captchaAnswer
      });
      setBobSessionMap((prev) => ({ ...prev, [bobAuthDialog.row.id]: status }));
      enqueueSnackbar(t('panelAuthAdmin.messages.bobLoginSuccess', 'Bob Player session authenticated successfully.'), { variant: 'success' });
      setBobAuthDialog((prev) => ({ ...prev, session: status, loading: false, captchaAnswer: '' }));
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || t('panelAuthAdmin.messages.bobCompleteError', 'Could not complete Bob Player authentication.'), {
        variant: 'error'
      });
      await refreshBobStatus(bobAuthDialog.row?.id);
      setBobAuthDialog((prev) => ({ ...prev, loading: false }));
    }
  }, [bobAuthDialog, enqueueSnackbar, refreshBobStatus, t]);

  const handleClearBobSession = useCallback(async () => {
    if (!bobAuthDialog.row?.id) return;
    setBobAuthDialog((prev) => ({ ...prev, loading: true }));
    try {
      const status = await clearBobSession(bobAuthDialog.row.id);
      setBobSessionMap((prev) => ({ ...prev, [bobAuthDialog.row.id]: status }));
      enqueueSnackbar(t('panelAuthAdmin.messages.bobSessionCleared', 'Bob Player session cleared.'), { variant: 'success' });
      setBobAuthDialog((prev) => ({ ...prev, session: status, loading: false, captchaAnswer: '' }));
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || t('panelAuthAdmin.messages.bobClearError', 'Could not clear Bob Player session.'), {
        variant: 'error'
      });
      setBobAuthDialog((prev) => ({ ...prev, loading: false }));
    }
  }, [bobAuthDialog.row?.id, enqueueSnackbar, t]);

  const metrics = useMemo(() => {
    const activeCount = rows.filter((row) => row.active).length;
    const bobCount = rows.filter((row) => row.provider === 'BOB_PLAYER').length;
    const bobReadyCount = rows.filter((row) => row.provider === 'BOB_PLAYER' && String(bobSessionMap[row.id]?.sessionStatus || '').toUpperCase() === 'READY').length;
    return [
      {
        title: t('panelAuthAdmin.metrics.total', { defaultValue: 'Configuraciones' }),
        value: total,
        helper: t('panelAuthAdmin.subtitle'),
        color: 'primary',
        icon: <IconPlus size={18} />
      },
      {
        title: t('panelAuthAdmin.metrics.active', { defaultValue: 'Activas' }),
        value: activeCount,
        helper: t('panelAuthAdmin.status.active'),
        color: 'success',
        icon: <IconRefresh size={18} />
      },
      {
        title: 'Bob Player',
        value: bobCount,
        helper: t('panelAuthAdmin.metrics.bobTotal', { defaultValue: 'Integrations' }),
        color: 'warning',
        icon: <IconEdit size={18} />
      },
      {
        title: t('panelAuthAdmin.metrics.bobReady', { defaultValue: 'Bob ready' }),
        value: bobReadyCount,
        helper: t('panelAuthAdmin.session.ready', { defaultValue: 'Ready' }),
        color: 'success',
        icon: <IconEdit size={18} />
      }
    ];
  }, [bobSessionMap, rows, t, total]);

  return (
    <Stack spacing={2}>
      <ResponsiveMetricGrid columns={{ xs: 1, md: 2, lg: 4 }}>
        {metrics.map((metric) => (
          <LionMetricCard {...metric} key={`${metric.title}-${metric.value}`} />
        ))}
      </ResponsiveMetricGrid>

      <MainCard
        title={t('panelAuthAdmin.title')}
        secondary={
          <ResponsiveActionBar justifyContent="flex-end">
            <Button
              variant="outlined"
              startIcon={<IconRefresh size={16} />}
              onClick={fetchRows}
              disabled={loading || saving || !apiConfigured}
            >
              {t('panelAuthAdmin.actions.refresh')}
            </Button>
            <Button variant="contained" startIcon={<IconPlus size={16} />} onClick={openCreate} disabled={!apiConfigured}>
              {t('panelAuthAdmin.actions.new')}
            </Button>
          </ResponsiveActionBar>
        }
      >
        <Stack spacing={2}>
          <Typography variant="body2" color="text.secondary">
            {t('panelAuthAdmin.subtitle')}
          </Typography>

          {!apiConfigured && <Alert severity="warning">{t('panelAuthAdmin.messages.apiMissing')}</Alert>}

          <ResponsiveFilters
            sx={{
              '& .filter-username': { flex: { md: 1 }, minWidth: { md: 260 } },
              '& .filter-select': { minWidth: { md: 190 } }
            }}
          >
            <TextField
              className="filter-username"
              fullWidth
              label={t('panelAuthAdmin.filters.username')}
              value={filterUsername}
              onChange={(event) => {
                setPage(0);
                setFilterUsername(event.target.value);
              }}
            />
            <TextField
              className="filter-select"
              fullWidth
              select
              label={t('panelAuthAdmin.filters.provider')}
              value={filterProvider}
              onChange={(event) => {
                setPage(0);
                setFilterProvider(event.target.value);
              }}
            >
              <MenuItem value="">{t('panelAuthAdmin.filters.all')}</MenuItem>
              {PROVIDERS.map((provider) => (
                <MenuItem key={provider} value={provider}>
                  {providerLabel(provider)}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              className="filter-select"
              fullWidth
              select
              label={t('panelAuthAdmin.filters.status')}
              value={filterActive}
              onChange={(event) => {
                setPage(0);
                setFilterActive(event.target.value);
              }}
            >
              {ACTIVE_FILTERS.map((status) => (
                <MenuItem key={status} value={status}>
                  {t(`panelAuthAdmin.filters.${status}`)}
                </MenuItem>
              ))}
            </TextField>
          </ResponsiveFilters>

          <ResponsiveListSection
            isMobile={isMobile}
            desktopContent={
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('panelAuthAdmin.table.user')}</TableCell>
                      <TableCell>{t('panelAuthAdmin.table.provider')}</TableCell>
                      <TableCell>{t('panelAuthAdmin.table.panelUser')}</TableCell>
                      <TableCell>{t('panelAuthAdmin.table.apiUrl')}</TableCell>
                      <TableCell>{t('panelAuthAdmin.table.cmsUrl')}</TableCell>
                      <TableCell>{t('panelAuthAdmin.table.session', 'Session')}</TableCell>
                      <TableCell>{t('panelAuthAdmin.table.status')}</TableCell>
                      <TableCell>{t('panelAuthAdmin.table.updatedAt')}</TableCell>
                      <TableCell align="right">{t('panelAuthAdmin.table.actions')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {!loading && rows.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={9}>
                          <Typography variant="body2" color="text.secondary">
                            {t('panelAuthAdmin.table.empty')}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                    {rows.map((row) => (
                      <TableRow key={row.id} hover>
                        <TableCell>{row.username}</TableCell>
                        <TableCell>
                          <Chip size="small" label={providerLabel(row.provider)} color={providerColor(row.provider)} />
                        </TableCell>
                        <TableCell>{row.usernamePanel}</TableCell>
                        <TableCell>{row.apiBaseUrl || '-'}</TableCell>
                        <TableCell>{row.cmsBaseUrl || '-'}</TableCell>
                        <TableCell>
                          {row.provider === 'BOB_PLAYER' ? renderBobSessionCell(row) : (
                            <Typography variant="caption" color="text.secondary">
                              {t('panelAuthAdmin.session.notApplicable', 'N/A')}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={row.active ? t('panelAuthAdmin.status.active') : t('panelAuthAdmin.status.inactive')}
                            color={row.active ? 'success' : 'default'}
                          />
                        </TableCell>
                        <TableCell>{formatDateTime(row.updatedAt)}</TableCell>
                        <TableCell align="right">
                          <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                            <Tooltip title={t('panelAuthAdmin.actions.edit')}>
                              <IconButton color="primary" size="small" onClick={() => openEdit(row)}>
                                <IconEdit size={16} />
                              </IconButton>
                            </Tooltip>
                            {row.provider === 'BOB_PLAYER' ? (
                              <Tooltip title={t('panelAuthAdmin.actions.authenticateBob', 'Authenticate Bob Player')}>
                                <IconButton color="warning" size="small" onClick={() => openBobAuth(row)}>
                                  <VpnKeyOutlinedIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            ) : null}
                            <Tooltip title={row.active ? t('panelAuthAdmin.actions.deactivate') : t('panelAuthAdmin.actions.activate')}>
                              <Switch size="small" checked={Boolean(row.active)} onChange={() => onToggleStatus(row)} />
                            </Tooltip>
                            <Tooltip title={t('panelAuthAdmin.actions.delete')}>
                              <IconButton color="error" size="small" onClick={() => setDeleteTarget(row)}>
                                <IconTrash size={16} />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            }
            mobileContent={
              <Stack spacing={1.5}>
                {rows.map((row) => (
                  <MobileSummaryCard
                    key={row.id}
                    title={row.username}
                    subtitle={row.usernamePanel || '-'}
                    chips={[
                      <Chip
                        key="provider"
                        size="small"
                        label={providerLabel(row.provider)}
                        color={providerColor(row.provider)}
                      />,
                      <Chip
                        key="status"
                        size="small"
                        label={row.active ? t('panelAuthAdmin.status.active') : t('panelAuthAdmin.status.inactive')}
                        color={row.active ? 'success' : 'default'}
                      />,
                      row.provider === 'BOB_PLAYER' ? (
                        <Chip
                          key="bob-session"
                          size="small"
                          label={
                            sessionLoadingMap[row.id]
                              ? t('panelAuthAdmin.session.loading', 'Loading...')
                              : sessionLabel(bobSessionMap[row.id]?.sessionStatus)
                          }
                          color={sessionColor(bobSessionMap[row.id]?.sessionStatus)}
                          variant="outlined"
                        />
                      ) : null
                    ]}
                    actions={
                      <ResponsiveActionBar>
                        <Button size="small" variant="outlined" startIcon={<IconEdit size={16} />} onClick={() => openEdit(row)}>
                          {t('panelAuthAdmin.actions.edit')}
                        </Button>
                        {row.provider === 'BOB_PLAYER' ? (
                          <Button size="small" variant="outlined" color="warning" startIcon={<VpnKeyOutlinedIcon fontSize="small" />} onClick={() => openBobAuth(row)}>
                            {t('panelAuthAdmin.actions.authenticateBob', 'Authenticate Bob Player')}
                          </Button>
                        ) : null}
                        <Button size="small" variant="outlined" color="error" startIcon={<IconTrash size={16} />} onClick={() => setDeleteTarget(row)}>
                          {t('panelAuthAdmin.actions.delete')}
                        </Button>
                      </ResponsiveActionBar>
                    }
                  >
                    <MobileFieldGrid
                      fields={[
                        { label: t('panelAuthAdmin.table.apiUrl'), value: row.apiBaseUrl || '-' },
                        { label: t('panelAuthAdmin.table.cmsUrl'), value: row.cmsBaseUrl || '-' },
                        {
                          label: t('panelAuthAdmin.table.session', 'Session'),
                          value:
                            row.provider === 'BOB_PLAYER'
                              ? `${sessionLoadingMap[row.id] ? t('panelAuthAdmin.session.loading', 'Loading...') : sessionLabel(bobSessionMap[row.id]?.sessionStatus)} · ${t('panelAuthAdmin.form.lastRefreshed', 'Last refreshed')}: ${formatDateTime(bobSessionMap[row.id]?.sessionRefreshedAt)}`
                              : t('panelAuthAdmin.session.notApplicable', 'N/A')
                        },
                        { label: t('panelAuthAdmin.table.updatedAt'), value: formatDateTime(row.updatedAt) }
                      ]}
                    />
                    <Box sx={{ pt: 1 }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="caption" color="text.secondary">
                          {row.active ? t('panelAuthAdmin.actions.deactivate') : t('panelAuthAdmin.actions.activate')}
                        </Typography>
                        <Switch size="small" checked={Boolean(row.active)} onChange={() => onToggleStatus(row)} />
                      </Stack>
                    </Box>
                  </MobileSummaryCard>
                ))}
                {!loading && rows.length === 0 ? (
                  <Alert severity="info" variant="outlined">
                    {t('panelAuthAdmin.table.empty')}
                  </Alert>
                ) : null}
              </Stack>
            }
            pagination={
              <TablePagination
                component="div"
                count={total}
                page={page}
                onPageChange={(_, nextPage) => setPage(nextPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(event) => {
                  setPage(0);
                  setRowsPerPage(Number(event.target.value));
                }}
                rowsPerPageOptions={[10, 20, 50]}
              />
            }
          />
        </Stack>
      </MainCard>

      <Dialog open={openForm} onClose={closeForm} fullWidth fullScreen={isMobile} maxWidth="sm">
        <DialogTitleWithClose onClose={closeForm}>
          {editingId ? t('panelAuthAdmin.dialogs.editTitle') : t('panelAuthAdmin.dialogs.createTitle')}
        </DialogTitleWithClose>
        <DialogContent dividers>
          <Stack spacing={2}>
            <TextField
              label={t('panelAuthAdmin.form.username')}
              value={form.username}
              onChange={(event) => setForm((prev) => ({ ...prev, username: event.target.value }))}
              fullWidth
            />
            <TextField
              select
              label={t('panelAuthAdmin.form.provider')}
              value={form.provider}
              onChange={(event) => setForm((prev) => ({ ...prev, provider: event.target.value }))}
              fullWidth
            >
              {PROVIDERS.map((provider) => (
                <MenuItem key={provider} value={provider}>
                  {providerLabel(provider)}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label={
                form.provider === 'BOB_PLAYER'
                  ? t('panelAuthAdmin.form.macAddress', 'MAC address')
                  : t('panelAuthAdmin.form.usernamePanel')
              }
              value={form.usernamePanel}
              onChange={(event) => setForm((prev) => ({ ...prev, usernamePanel: event.target.value }))}
              fullWidth
            />
            <TextField
              type="password"
              label={
                form.provider === 'BOB_PLAYER'
                  ? editingId
                    ? t('panelAuthAdmin.form.deviceKeyOptional', 'Device key (optional)')
                    : t('panelAuthAdmin.form.deviceKey', 'Device key')
                  : editingId
                    ? t('panelAuthAdmin.form.passwordOptional')
                    : t('panelAuthAdmin.form.password')
              }
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              fullWidth
            />
            {form.provider === 'BOB_PLAYER' ? (
              <Alert severity="info" variant="outlined">
                {t(
                  'panelAuthAdmin.messages.bobProviderHint',
                  'For Bob Player, the panel user field stores the MAC address and the password field stores the device key. The captcha flow is completed later from the row action.'
                )}
              </Alert>
            ) : null}
            <TextField
              label={t('panelAuthAdmin.form.apiBaseUrl')}
              value={form.apiBaseUrl}
              onChange={(event) => setForm((prev) => ({ ...prev, apiBaseUrl: event.target.value }))}
              fullWidth
            />
            <TextField
              label={t('panelAuthAdmin.form.cmsBaseUrl')}
              value={form.cmsBaseUrl}
              onChange={(event) => setForm((prev) => ({ ...prev, cmsBaseUrl: event.target.value }))}
              fullWidth
            />
            <Box>
              <Chip
                label={form.active ? t('panelAuthAdmin.status.active') : t('panelAuthAdmin.status.inactive')}
                color={form.active ? 'success' : 'default'}
                size="small"
                sx={{ mb: 1 }}
              />
              <Switch checked={Boolean(form.active)} onChange={(event) => setForm((prev) => ({ ...prev, active: event.target.checked }))} />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <ResponsiveActionBar>
            <Button onClick={closeForm}>{t('panelAuthAdmin.actions.cancel')}</Button>
            <Button onClick={onSubmit} variant="contained" disabled={saving}>
              {editingId ? t('panelAuthAdmin.actions.save') : t('panelAuthAdmin.actions.create')}
            </Button>
          </ResponsiveActionBar>
        </DialogActions>
      </Dialog>

      <Dialog open={bobAuthDialog.open} onClose={closeBobAuth} fullWidth fullScreen={isMobile} maxWidth="sm">
        <DialogTitleWithClose onClose={closeBobAuth}>{t('panelAuthAdmin.dialogs.bobAuthTitle', 'Authenticate Bob Player')}</DialogTitleWithClose>
        <DialogContent dividers>
          <Stack spacing={2}>
            <Typography variant="body2" color="text.secondary">
              {t(
                'panelAuthAdmin.dialogs.bobAuthHelper',
                'The system uses the stored MAC address and device key, fetches the live captcha from Bob Player and only asks the operator for the captcha answer.'
              )}
            </Typography>

            {bobAuthDialog.session ? (
              <Grid container spacing={1.5}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth disabled label={t('panelAuthAdmin.form.username', 'System user')} value={bobAuthDialog.row?.username || ''} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth disabled label={t('panelAuthAdmin.form.macAddress', 'MAC address')} value={bobAuthDialog.session.macAddress || bobAuthDialog.row?.usernamePanel || ''} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth disabled label={t('panelAuthAdmin.form.deviceKeyMasked', 'Stored device key')} value={bobAuthDialog.session.deviceKeyMasked || '-'} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    disabled
                    label={t('panelAuthAdmin.table.session', 'Session')}
                    value={sessionLabel(bobAuthDialog.session.sessionStatus)}
                  />
                </Grid>
              </Grid>
            ) : null}

            {bobAuthDialog.session?.lastAuthError ? <Alert severity="warning">{bobAuthDialog.session.lastAuthError}</Alert> : null}

            <Box
              sx={(theme) => ({
                p: 2,
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                bgcolor: theme.palette.background.default
              })}
            >
              {bobAuthDialog.captchaSvg ? (
                <Box dangerouslySetInnerHTML={{ __html: bobAuthDialog.captchaSvg }} sx={{ '& svg': { maxWidth: '100%', height: 'auto' } }} />
              ) : (
                <Typography variant="body2" color="text.secondary">
                  {t('panelAuthAdmin.messages.captchaUnavailable', 'Captcha preview unavailable. Refresh the challenge.')}
                </Typography>
              )}
            </Box>

            <TextField
              label={t('panelAuthAdmin.form.captchaAnswer', 'Captcha')}
              value={bobAuthDialog.captchaAnswer}
              onChange={(event) => setBobAuthDialog((prev) => ({ ...prev, captchaAnswer: event.target.value }))}
              fullWidth
            />

            <Typography variant="caption" color="text.secondary">
              {t('panelAuthAdmin.form.lastRefreshed', 'Last refreshed')}: {formatDateTime(bobAuthDialog.session?.sessionRefreshedAt)}
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <ResponsiveActionBar>
            <Button onClick={closeBobAuth}>{t('panelAuthAdmin.actions.cancel')}</Button>
            <Button
              variant="outlined"
              startIcon={<IconRefresh size={16} />}
              onClick={() => bobAuthDialog.row && openBobAuth(bobAuthDialog.row)}
              disabled={bobAuthDialog.loading}
            >
              {t('panelAuthAdmin.actions.refreshCaptcha', 'Refresh captcha')}
            </Button>
            <Button variant="outlined" color="warning" onClick={handleClearBobSession} disabled={bobAuthDialog.loading}>
              {t('panelAuthAdmin.actions.clearSession', 'Clear session')}
            </Button>
            <Button variant="contained" startIcon={<VpnKeyOutlinedIcon fontSize="small" />} onClick={handleCompleteBobCaptcha} disabled={bobAuthDialog.loading}>
              {t('panelAuthAdmin.actions.completeBobLogin', 'Complete login')}
            </Button>
          </ResponsiveActionBar>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} fullWidth fullScreen={isMobile} maxWidth="xs">
        <DialogTitleWithClose onClose={() => setDeleteTarget(null)}>
          {t('panelAuthAdmin.dialogs.deleteTitle')}
        </DialogTitleWithClose>
        <DialogContent dividers>
          <Typography variant="body2">{t('panelAuthAdmin.dialogs.deleteMessage')}</Typography>
        </DialogContent>
        <DialogActions>
          <ResponsiveActionBar>
            <Button onClick={() => setDeleteTarget(null)}>{t('panelAuthAdmin.actions.cancel')}</Button>
            <Button color="error" variant="contained" onClick={onDelete} disabled={saving}>
              {t('panelAuthAdmin.actions.delete')}
            </Button>
          </ResponsiveActionBar>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
