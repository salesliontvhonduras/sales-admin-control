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
  DialogTitle,
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
import { IconEdit, IconPlus, IconRefresh, IconTrash, IconX } from '@tabler/icons-react';
import MainCard from 'ui-component/cards/MainCard';
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

  const providerLabel = (provider) => (provider === 'NINEXTREAM' ? '9xtream' : 'Vivo Player');

  return (
    <Stack spacing={2}>
      <MainCard
        title={t('panelAuthAdmin.title')}
        secondary={
          <Stack direction="row" spacing={1}>
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
          </Stack>
        }
      >
        <Stack spacing={2}>
          <Typography variant="body2" color="text.secondary">
            {t('panelAuthAdmin.subtitle')}
          </Typography>

          {!apiConfigured && <Alert severity="warning">{t('panelAuthAdmin.messages.apiMissing')}</Alert>}

          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label={t('panelAuthAdmin.filters.username')}
                value={filterUsername}
                onChange={(event) => {
                  setPage(0);
                  setFilterUsername(event.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
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
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
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
            </Grid>
          </Grid>

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
                {!loading && rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8}>
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
                      <Chip size="small" label={providerLabel(row.provider)} color={row.provider === 'NINEXTREAM' ? 'secondary' : 'primary'} />
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
        </Stack>
      </MainCard>

      <Dialog open={openForm} onClose={closeForm} fullWidth maxWidth="sm">
        <DialogTitle sx={{ pr: 7 }}>
          {editingId ? t('panelAuthAdmin.dialogs.editTitle') : t('panelAuthAdmin.dialogs.createTitle')}
          <IconButton onClick={closeForm} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <IconX size={18} />
          </IconButton>
        </DialogTitle>
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
          <Button onClick={closeForm}>{t('panelAuthAdmin.actions.cancel')}</Button>
          <Button onClick={onSubmit} variant="contained" disabled={saving}>
            {editingId ? t('panelAuthAdmin.actions.save') : t('panelAuthAdmin.actions.create')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ pr: 7 }}>
          {t('panelAuthAdmin.dialogs.deleteTitle')}
          <IconButton onClick={() => setDeleteTarget(null)} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <IconX size={18} />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2">{t('panelAuthAdmin.dialogs.deleteMessage')}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>{t('panelAuthAdmin.actions.cancel')}</Button>
          <Button color="error" variant="contained" onClick={onDelete} disabled={saving}>
            {t('panelAuthAdmin.actions.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
