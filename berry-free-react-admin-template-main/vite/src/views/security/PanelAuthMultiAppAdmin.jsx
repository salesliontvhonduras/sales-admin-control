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
import { IconEdit, IconPlus, IconRefresh, IconTrash } from '@tabler/icons-react';
import useAuth from 'hooks/useAuth';
import MainCard from 'ui-component/cards/MainCard';
import DialogTitleWithClose from 'ui-component/dialogs/DialogTitleWithClose';
import LionMetricCard from 'ui-component/cards/LionMetricCard';
import MobileFieldGrid from 'ui-component/responsive/MobileFieldGrid';
import MobileSummaryCard from 'ui-component/responsive/MobileSummaryCard';
import ResponsiveActionBar from 'ui-component/responsive/ResponsiveActionBar';
import ResponsiveFilters from 'ui-component/responsive/ResponsiveFilters';
import ResponsiveListSection from 'ui-component/responsive/ResponsiveListSection';
import ResponsiveMetricGrid from 'ui-component/responsive/ResponsiveMetricGrid';
import { hasPermissionExact } from 'utils/rbac';
import {
  createPanelAuth,
  deletePanelAuth,
  listPanelAuths,
  updatePanelAuth,
  updatePanelAuthStatus
} from 'api/panel-auth-admin';

const PROVIDERS = ['VIVO_PLAYER', 'NINEXTREAM'];
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
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isGlobalPanelAuthManager = hasPermissionExact(user, {
    any: ['USER_MANAGEMENT_VIEW', 'ROLE_USER_MANAGEMENT_VIEW', 'ROLE_ADMIN', 'ADMIN']
  });
  const isResellerOwner = hasPermissionExact(user, {
    any: ['ROLE_LIONTV_RESELLER_OWNER', 'LIONTV_RESELLER_OWNER']
  });
  const isResellerScopedView = isResellerOwner && !isGlobalPanelAuthManager;
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
  const [deleteTarget, setDeleteTarget] = useState(null);

  const statusFilterValue = useMemo(() => {
    if (filterActive === 'active') return true;
    if (filterActive === 'inactive') return false;
    return undefined;
  }, [filterActive]);

  const providerLabel = useCallback((provider) => {
    if (provider === 'NINEXTREAM') return '9xtream';
    return 'Vivo Player';
  }, []);

  const providerColor = useCallback((provider) => {
    if (provider === 'NINEXTREAM') return 'secondary';
    return 'primary';
  }, []);

  const fetchRows = useCallback(async () => {
    if (!apiConfigured) return;
    setLoading(true);
    try {
      const payload = await listPanelAuths({
        index: page,
        size: rowsPerPage,
        username: isResellerScopedView ? undefined : filterUsername || undefined,
        provider: filterProvider || undefined,
        active: statusFilterValue
      });
      const pageItems = Array.isArray(payload?.items) ? payload.items : [];
      const visibleItems = pageItems.filter((row) => PROVIDERS.includes(row.provider));
      const hiddenItems = pageItems.length - visibleItems.length;

      setRows(visibleItems);
      setTotal(Math.max(0, Number(payload?.total || 0) - hiddenItems));
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || t('panelAuthAdmin.messages.loadError'), { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [apiConfigured, enqueueSnackbar, filterProvider, filterUsername, isResellerScopedView, page, rowsPerPage, statusFilterValue, t]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  const closeForm = () => {
    setOpenForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setOpenForm(true);
  };

  const openEdit = (row) => {
    setEditingId(row.id);
    setForm({
      username: row.username || '',
      provider: PROVIDERS.includes(row.provider) ? row.provider : 'VIVO_PLAYER',
      usernamePanel: row.usernamePanel || '',
      password: '',
      apiBaseUrl: row.apiBaseUrl || '',
      cmsBaseUrl: row.cmsBaseUrl || '',
      active: Boolean(row.active)
    });
    setOpenForm(true);
  };

  const onSubmit = async () => {
    if ((!isResellerScopedView && !form.username) || !form.provider || !form.usernamePanel) {
      enqueueSnackbar(
        t(
          isResellerScopedView ? 'panelAuthAdmin.messages.requiredFieldsReseller' : 'panelAuthAdmin.messages.requiredFields',
          isResellerScopedView ? 'Complete provider and panel user.' : 'Complete user, provider and panel user.'
        ),
        { variant: 'warning' }
      );
      return;
    }
    if (!editingId && !form.password) {
      enqueueSnackbar(t('panelAuthAdmin.messages.passwordRequired'), { variant: 'warning' });
      return;
    }

    const payload = {
      username: isResellerScopedView ? null : form.username.trim(),
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

  const metrics = useMemo(() => {
    const activeCount = rows.filter((row) => row.active).length;
    const inactiveCount = rows.filter((row) => !row.active).length;
    return [
      {
        title: t('panelAuthAdmin.metrics.total', { defaultValue: 'Integrations' }),
        value: total,
        helper: t('panelAuthAdmin.subtitle'),
        color: 'primary',
        icon: <IconPlus size={18} />
      },
      {
        title: t('panelAuthAdmin.metrics.active', { defaultValue: 'Active' }),
        value: activeCount,
        helper: t('panelAuthAdmin.status.active'),
        color: 'success',
        icon: <IconRefresh size={18} />
      },
      {
        title: t('panelAuthAdmin.metrics.inactive', { defaultValue: 'Inactive' }),
        value: inactiveCount,
        helper: t('panelAuthAdmin.status.inactive'),
        color: 'warning',
        icon: <IconEdit size={18} />
      }
    ];
  }, [rows, t, total]);

  return (
    <Stack spacing={2}>
      <ResponsiveMetricGrid columns={{ xs: 1, md: 2, lg: 3 }}>
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

          {!apiConfigured ? <Alert severity="warning">{t('panelAuthAdmin.messages.apiMissing')}</Alert> : null}
          {isResellerScopedView ? (
            <Alert severity="info" variant="outlined">
              {t(
                'panelAuthAdmin.messages.resellerScope',
                'This module is scoped to your reseller account. You can only see and manage your own panel integrations.'
              )}
            </Alert>
          ) : null}

          <ResponsiveFilters
            sx={{
              '& .filter-username': { flex: { md: 1 }, minWidth: { md: 260 } },
              '& .filter-select': { minWidth: { md: 190 } }
            }}
          >
            {!isResellerScopedView ? (
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
            ) : null}
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
                      <TableCell>{t('panelAuthAdmin.table.status')}</TableCell>
                      <TableCell>{t('panelAuthAdmin.table.updatedAt')}</TableCell>
                      <TableCell align="right">{t('panelAuthAdmin.table.actions')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {!loading && rows.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8}>
                          <Typography variant="body2" color="text.secondary">
                            {t('panelAuthAdmin.table.empty')}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : null}
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
                      <Chip key="provider" size="small" label={providerLabel(row.provider)} color={providerColor(row.provider)} />,
                      <Chip
                        key="status"
                        size="small"
                        label={row.active ? t('panelAuthAdmin.status.active') : t('panelAuthAdmin.status.inactive')}
                        color={row.active ? 'success' : 'default'}
                      />
                    ]}
                    actions={
                      <ResponsiveActionBar>
                        <Button size="small" variant="outlined" startIcon={<IconEdit size={16} />} onClick={() => openEdit(row)}>
                          {t('panelAuthAdmin.actions.edit')}
                        </Button>
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
            {!isResellerScopedView ? (
              <TextField
                label={t('panelAuthAdmin.form.username')}
                value={form.username}
                onChange={(event) => setForm((prev) => ({ ...prev, username: event.target.value }))}
                fullWidth
              />
            ) : null}
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
              label={t('panelAuthAdmin.form.usernamePanel')}
              value={form.usernamePanel}
              onChange={(event) => setForm((prev) => ({ ...prev, usernamePanel: event.target.value }))}
              fullWidth
            />
            <TextField
              type="password"
              label={editingId ? t('panelAuthAdmin.form.passwordOptional') : t('panelAuthAdmin.form.password')}
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              fullWidth
            />
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

      <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} fullWidth fullScreen={isMobile} maxWidth="xs">
        <DialogTitleWithClose onClose={() => setDeleteTarget(null)}>{t('panelAuthAdmin.dialogs.deleteTitle')}</DialogTitleWithClose>
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
