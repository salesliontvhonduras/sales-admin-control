import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import useAuth from 'hooks/useAuth';
import { useTranslation } from 'react-i18next';

import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import LinearProgress from '@mui/material/LinearProgress';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
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
import { withAlpha } from 'utils/colorUtils';

import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';

import MainCard from 'ui-component/cards/MainCard';
import DialogTitleWithClose from 'ui-component/dialogs/DialogTitleWithClose';
import { gridSpacing } from 'store/constant';
import {
  createAdminUser,
  fetchAccessCatalog,
  fetchAdminUserById,
  fetchAdminUsers,
  updateAdminUserAccess,
  updateAdminUserStatus
} from 'api/auth-admin';

const defaultCreateForm = {
  name: '',
  email: '',
  password: '',
  serialCode: '',
  active: true,
  roles: ['ROLE_USER'],
  permissions: []
};

const cardGlassSx = (theme) => ({
  borderRadius: 2.5,
  border: '1px solid',
  borderColor: 'divider',
  boxShadow: `0 14px 32px ${withAlpha('#020617', 0.5)}`,
  background: `linear-gradient(145deg, ${theme.vars.palette.surface.card} 0%, ${theme.vars.palette.surface.muted} 100%)`,
  ...theme.applyStyles('light', {
    boxShadow: `0 12px 26px ${withAlpha('#0f172a', 0.1)}`,
    background: `linear-gradient(145deg, ${theme.vars.palette.surface.card} 0%, ${withAlpha(theme.vars.palette.primary.main, 0.08)} 46%, ${theme.vars.palette.surface.muted} 100%)`
  })
});

const sectionCardSx = (theme) => ({
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: 3,
  background: `linear-gradient(180deg, ${theme.vars.palette.surface.card} 0%, ${theme.vars.palette.surface.muted} 100%)`,
  boxShadow: `0 16px 34px ${withAlpha('#020617', 0.44)}`,
  ...theme.applyStyles('light', {
    boxShadow: `0 14px 30px ${withAlpha('#0f172a', 0.11)}`
  })
});

const modalPaperSx = (theme) => ({
  borderRadius: 3,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.vars.palette.surface.card,
  boxShadow: `0 24px 60px ${withAlpha('#020617', 0.58)}`,
  ...theme.applyStyles('light', {
    boxShadow: `0 24px 60px ${withAlpha('#0f172a', 0.2)}`
  }),
  overflow: 'hidden'
});

const modalHeaderSx = (theme) => ({
  px: 3,
  py: 2.2,
  borderBottom: `1px solid ${theme.palette.divider}`,
  background: `linear-gradient(135deg, ${withAlpha(theme.vars.palette.primary.main, 0.18)} 0%, ${withAlpha(theme.vars.palette.secondary.main, 0.14)} 100%)`
});

const modalContentSx = {
  px: 3,
  py: 2.5
};

const modalActionsSx = (theme) => ({
  px: 3,
  py: 2,
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: withAlpha(theme.vars.palette.surface.muted, 0.86)
});

const filterPanelSx = (theme) => ({
  borderRadius: 2.5,
  border: '1px solid',
  borderColor: 'divider',
  p: 2,
  backgroundColor: withAlpha(theme.vars.palette.surface.muted, 0.56)
});

const tableContainerSx = (theme) => ({
  borderRadius: 2.5,
  border: '1px solid',
  borderColor: 'divider',
  background: `linear-gradient(180deg, ${theme.vars.palette.surface.card} 0%, ${theme.vars.palette.surface.muted} 100%)`,
  '& .MuiTableCell-head': {
    backgroundColor: withAlpha(theme.vars.palette.background.default, 0.56),
    color: theme.vars.palette.text.secondary,
    borderBottom: `1px solid ${theme.palette.divider}`,
    fontWeight: 700,
    letterSpacing: 0.2
  },
  '& .MuiTableCell-root': {
    borderBottom: `1px solid ${withAlpha(theme.palette.divider, 0.7)}`
  },
  '& .MuiTableRow-root:last-of-type .MuiTableCell-root': {
    borderBottom: 'none'
  },
  '& .MuiTableRow-hover:hover': {
    backgroundColor: withAlpha(theme.vars.palette.primary.main, 0.11)
  }
});

const infoAlertSx = (theme) => ({
  borderColor: withAlpha(theme.vars.palette.info.main, 0.34),
  backgroundColor: withAlpha(theme.vars.palette.info.main, 0.1),
  color: theme.vars.palette.text.primary,
  '& .MuiAlert-icon': {
    color: theme.vars.palette.info.main
  }
});

const warningAlertSx = (theme) => ({
  borderColor: withAlpha(theme.vars.palette.warning.main, 0.34),
  backgroundColor: withAlpha(theme.vars.palette.warning.main, 0.1),
  color: theme.vars.palette.text.primary,
  '& .MuiAlert-icon': {
    color: theme.vars.palette.warning.main
  }
});

function boolFilter(value) {
  if (value === 'ACTIVE') return true;
  if (value === 'INACTIVE') return false;
  return null;
}

function formatDateTime(value, locale = 'es-HN') {
  if (!value) return '-';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '-';
  return parsed.toLocaleString(locale);
}

function roleColor(role) {
  const normalized = String(role || '').toUpperCase();
  if (normalized.includes('ADMIN')) return 'error';
  if (normalized.includes('USER')) return 'primary';
  if (normalized.includes('LION')) return 'secondary';
  return 'default';
}

function statusColor(active) {
  return active ? 'success' : 'default';
}

function MetricCard({ title, value, helper, icon, color = 'primary' }) {
  return (
    <Card sx={(theme) => cardGlassSx(theme)}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1.5}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {title}
            </Typography>
            <Typography variant="h2" sx={{ mt: 0.75 }}>
              {value}
            </Typography>
            {helper ? (
              <Typography variant="caption" color="text.secondary">
                {helper}
              </Typography>
            ) : null}
          </Box>
          <Avatar
            variant="rounded"
            sx={(theme) => ({
              width: 46,
              height: 46,
              bgcolor: theme.palette[color]?.lighter || theme.palette.primary.lighter,
              color: theme.palette[color]?.main || theme.palette.primary.main
            })}
          >
            {icon}
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function UserAccessAdmin() {
  const { accessToken } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const { t, i18n } = useTranslation();
  const locale = (i18n?.resolvedLanguage || i18n?.language || 'es').startsWith('en') ? 'en-US' : 'es-HN';

  const headers = useMemo(() => ({ Authorization: `Bearer ${accessToken}` }), [accessToken]);
  const statusFilterOptions = useMemo(
    () => [
      { value: 'ALL', label: t('userAccess.filters.all') },
      { value: 'ACTIVE', label: t('userAccess.filters.active') },
      { value: 'INACTIVE', label: t('userAccess.filters.inactive') }
    ],
    [t]
  );

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [index, setIndex] = useState(0);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [catalogLoading, setCatalogLoading] = useState(false);
  const [roleTemplates, setRoleTemplates] = useState([]);
  const [permissionCatalog, setPermissionCatalog] = useState([]);

  const [createOpen, setCreateOpen] = useState(false);
  const [createSaving, setCreateSaving] = useState(false);
  const [createForm, setCreateForm] = useState(defaultCreateForm);

  const [accessOpen, setAccessOpen] = useState(false);
  const [accessSaving, setAccessSaving] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const [statusOpen, setStatusOpen] = useState(false);
  const [statusSaving, setStatusSaving] = useState(false);
  const [statusTargetUser, setStatusTargetUser] = useState(null);
  const [nextStatusValue, setNextStatusValue] = useState(true);

  const onError = useCallback(
    (error, fallback) => {
      if ((error?.response?.status || error?.request?.status) === 401) return;
      enqueueSnackbar(error?.response?.data?.message || error?.message || fallback, { variant: 'error' });
    },
    [enqueueSnackbar]
  );

  const loadCatalog = useCallback(async () => {
    if (!accessToken) return;
    setCatalogLoading(true);
    try {
      const payload = await fetchAccessCatalog({ headers, skipAuthRedirect: true });
      setRoleTemplates(Array.isArray(payload?.roleTemplates) ? payload.roleTemplates : []);
      setPermissionCatalog(
        Array.isArray(payload?.permissionCatalog) ? [...payload.permissionCatalog].sort((a, b) => String(a).localeCompare(String(b))) : []
      );
    } catch (error) {
      onError(error, t('userAccess.errors.loadCatalog'));
    } finally {
      setCatalogLoading(false);
    }
  }, [accessToken, headers, onError, t]);

  const loadUsers = useCallback(
    async ({ nextIndex = index, nextSize = size, nextSearch = search, nextStatus = statusFilter, silent = false } = {}) => {
      if (!accessToken) return;
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      try {
        const payload = await fetchAdminUsers(
          {
            index: nextIndex,
            size: nextSize,
            search: nextSearch || undefined,
            active: boolFilter(nextStatus)
          },
          { headers, skipAuthRedirect: true }
        );
        setUsers(Array.isArray(payload?.data) ? payload.data : []);
        setTotal(Number(payload?.total || 0));
      } catch (error) {
        onError(error, t('userAccess.errors.loadUsers'));
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [accessToken, headers, index, onError, search, size, statusFilter, t]
  );

  useEffect(() => {
    loadCatalog();
  }, [loadCatalog]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const metrics = useMemo(() => {
    const activeCount = users.filter((item) => item.active).length;
    const inactiveCount = users.length - activeCount;
    const adminCount = users.filter((item) =>
      String(item.primaryRole || '')
        .toUpperCase()
        .includes('ADMIN')
    ).length;
    const noLicense = users.filter((item) => !item.hasActiveLicense).length;
    return { activeCount, inactiveCount, adminCount, noLicense };
  }, [users]);

  const resetCreateForm = () => {
    setCreateForm(defaultCreateForm);
  };

  const handleCreateUser = async () => {
    if (!createForm.name || !createForm.email || !createForm.password || !createForm.serialCode) {
      enqueueSnackbar(t('userAccess.messages.requiredFields'), { variant: 'warning' });
      return;
    }

    setCreateSaving(true);
    try {
      await createAdminUser(createForm, { headers, skipAuthRedirect: true });
      enqueueSnackbar(t('userAccess.messages.userCreated'), { variant: 'success' });
      setCreateOpen(false);
      resetCreateForm();
      await loadUsers({ nextIndex: 0, silent: true });
      setIndex(0);
    } catch (error) {
      onError(error, t('userAccess.errors.createUser'));
    } finally {
      setCreateSaving(false);
    }
  };

  const openAccessModal = async (userId) => {
    try {
      const detail = await fetchAdminUserById(userId, { headers, skipAuthRedirect: true });
      const storedRoles = Array.isArray(detail?.roles) ? detail.roles : [];
      setSelectedUser(detail);
      setSelectedRoles(storedRoles.filter((value) => value.startsWith('ROLE_')));
      setSelectedPermissions(storedRoles.filter((value) => !value.startsWith('ROLE_')));
      setAccessOpen(true);
    } catch (error) {
      onError(error, t('userAccess.errors.loadUserDetail'));
    }
  };

  const handleSaveAccess = async () => {
    if (!selectedUser?.id) return;
    setAccessSaving(true);
    try {
      await updateAdminUserAccess(
        selectedUser.id,
        {
          roles: selectedRoles,
          permissions: selectedPermissions
        },
        { headers, skipAuthRedirect: true }
      );
      enqueueSnackbar(t('userAccess.messages.accessUpdated'), { variant: 'success' });
      setAccessOpen(false);
      setSelectedUser(null);
      await loadUsers({ silent: true });
    } catch (error) {
      onError(error, t('userAccess.errors.updateAccess'));
    } finally {
      setAccessSaving(false);
    }
  };

  const openStatusModal = (user) => {
    setStatusTargetUser(user);
    setNextStatusValue(!user.active);
    setStatusOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!statusTargetUser?.id) return;
    setStatusSaving(true);
    try {
      await updateAdminUserStatus(statusTargetUser.id, nextStatusValue, { headers, skipAuthRedirect: true });
      enqueueSnackbar(t('userAccess.messages.statusUpdated'), { variant: 'success' });
      setStatusOpen(false);
      setStatusTargetUser(null);
      await loadUsers({ silent: true });
    } catch (error) {
      onError(error, t('userAccess.errors.updateStatus'));
    } finally {
      setStatusSaving(false);
    }
  };

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <MainCard
          sx={sectionCardSx}
          title={t('userAccess.title')}
          secondary={
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={() => loadUsers({ silent: true })}
                disabled={loading || refreshing}
              >
                {t('userAccess.actions.refresh')}
              </Button>
              <Button variant="contained" startIcon={<PersonAddAlt1OutlinedIcon />} onClick={() => setCreateOpen(true)}>
                {t('userAccess.actions.newUser')}
              </Button>
            </Stack>
          }
        >
          <Typography variant="body2" color="text.secondary">
            {t('userAccess.subtitle')}
          </Typography>
        </MainCard>
      </Grid>

      <Grid item xs={12} md={3}>
        <MetricCard
          title={t('userAccess.metrics.usersInPage')}
          value={users.length}
          helper={t('userAccess.metrics.filteredTotal', { count: total })}
          icon={<BadgeOutlinedIcon />}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <MetricCard
          title={t('userAccess.metrics.active')}
          value={metrics.activeCount}
          helper={t('userAccess.metrics.activeHelper')}
          color="success"
          icon={<VerifiedUserOutlinedIcon />}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <MetricCard
          title={t('userAccess.metrics.adminsInPage')}
          value={metrics.adminCount}
          helper={t('userAccess.metrics.adminsHelper')}
          color="error"
          icon={<AdminPanelSettingsOutlinedIcon />}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <MetricCard
          title={t('userAccess.metrics.noActiveLicense')}
          value={metrics.noLicense}
          helper={t('userAccess.metrics.noActiveLicenseHelper')}
          color="warning"
          icon={<BlockOutlinedIcon />}
        />
      </Grid>

      <Grid item xs={12}>
        <MainCard title={t('userAccess.listTitle')} sx={sectionCardSx}>
          <Stack spacing={2.5}>
            <Box sx={filterPanelSx}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={5}>
                  <TextField
                    fullWidth
                    value={search}
                    label={t('userAccess.filters.search')}
                    onChange={(event) => {
                      setIndex(0);
                      setSearch(event.target.value);
                    }}
                    InputProps={{
                      startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    select
                    label={t('userAccess.filters.status')}
                    value={statusFilter}
                    onChange={(event) => {
                      setIndex(0);
                      setStatusFilter(event.target.value);
                    }}
                  >
                    {statusFilterOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Alert severity="info" variant="outlined" sx={infoAlertSx}>
                    {t('userAccess.catalog.loaded')}{' '}
                    {catalogLoading
                      ? t('userAccess.catalog.loading')
                      : t('userAccess.catalog.ready', { roles: roleTemplates.length, permissions: permissionCatalog.length })}
                  </Alert>
                </Grid>
              </Grid>
            </Box>

            {(loading || refreshing) && <LinearProgress sx={{ borderRadius: 999, height: 7 }} />}

            <TableContainer sx={tableContainerSx}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>{t('userAccess.table.user')}</TableCell>
                    <TableCell>{t('userAccess.table.status')}</TableCell>
                    <TableCell>{t('userAccess.table.primaryRole')}</TableCell>
                    <TableCell>{t('userAccess.table.license')}</TableCell>
                    <TableCell>{t('userAccess.table.permissions')}</TableCell>
                    <TableCell align="right">{t('userAccess.table.actions')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell>
                        <Stack spacing={0.4}>
                          <Typography variant="subtitle2">{item.name || '-'}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {item.email} | {item.provider || t('userAccess.table.localProvider')}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {t('userAccess.table.createdAt', { value: formatDateTime(item.createdAt, locale) })}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          color={statusColor(item.active)}
                          label={item.active ? t('userAccess.status.active') : t('userAccess.status.inactive')}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip size="small" color={roleColor(item.primaryRole)} label={item.primaryRole || t('userAccess.table.noRole')} />
                      </TableCell>
                      <TableCell>
                        <Stack spacing={0.4}>
                          <Chip
                            size="small"
                            color={item.hasActiveLicense ? 'success' : 'warning'}
                            label={item.hasActiveLicense ? t('userAccess.license.active') : t('userAccess.license.inactive')}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {t('userAccess.table.expiresAt', { value: formatDateTime(item.licenseExpiresAt, locale) })}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.6} flexWrap="wrap" useFlexGap>
                          {(item.permissions || []).slice(0, 3).map((permission) => (
                            <Chip key={`${item.id}-${permission}`} size="small" variant="outlined" label={permission} />
                          ))}
                          {(item.permissions || []).length > 3 && (
                            <Chip size="small" variant="outlined" label={t('userAccess.table.morePermissions', { count: item.permissions.length - 3 })} />
                          )}
                        </Stack>
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" justifyContent="flex-end" spacing={1}>
                          <Tooltip title={t('userAccess.tooltips.editAccess')}>
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<SecurityOutlinedIcon />}
                              onClick={() => openAccessModal(item.id)}
                            >
                              {t('userAccess.actions.access')}
                            </Button>
                          </Tooltip>
                          <Tooltip title={t('userAccess.tooltips.toggleStatus')}>
                            <Button
                              size="small"
                              variant="contained"
                              color="secondary"
                              startIcon={<ManageAccountsOutlinedIcon />}
                              onClick={() => openStatusModal(item)}
                            >
                              {t('userAccess.actions.status')}
                            </Button>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!loading && users.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <Alert severity="warning" variant="outlined" sx={warningAlertSx}>
                          {t('userAccess.table.empty')}
                        </Alert>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={total}
              page={index}
              onPageChange={(_, newPage) => setIndex(newPage)}
              rowsPerPage={size}
              onRowsPerPageChange={(event) => {
                setSize(parseInt(event.target.value, 10));
                setIndex(0);
              }}
              rowsPerPageOptions={[10, 25, 50]}
              labelRowsPerPage={t('userAccess.pagination.rowsPerPage')}
            />
          </Stack>
        </MainCard>
      </Grid>

      <Dialog
        open={createOpen}
        onClose={() => !createSaving && setCreateOpen(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{ sx: modalPaperSx }}
      >
        <DialogTitleWithClose sx={modalHeaderSx} onClose={() => !createSaving && setCreateOpen(false)}>
          {t('userAccess.dialogs.create.title')}
        </DialogTitleWithClose>
        <DialogContent sx={modalContentSx}>
          <Stack spacing={2}>
            <Alert severity="info" variant="outlined" sx={infoAlertSx}>
              {t('userAccess.dialogs.create.info')}
            </Alert>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={t('userAccess.form.name')}
                  value={createForm.name}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, name: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={t('userAccess.form.email')}
                  type="email"
                  value={createForm.email}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, email: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={t('userAccess.form.tempPassword')}
                  type="password"
                  value={createForm.password}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, password: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={t('userAccess.form.serialCode')}
                  value={createForm.serialCode}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, serialCode: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="create-roles-label">{t('userAccess.form.roles')}</InputLabel>
                  <Select
                    labelId="create-roles-label"
                    multiple
                    value={createForm.roles}
                    onChange={(event) => setCreateForm((prev) => ({ ...prev, roles: event.target.value }))}
                    input={<OutlinedInput label={t('userAccess.form.roles')} />}
                    renderValue={(selected) => selected.join(', ')}
                  >
                    {roleTemplates.map((role) => (
                      <MenuItem key={role.code} value={role.code}>
                        <Checkbox checked={createForm.roles.includes(role.code)} />
                        <ListItemText primary={role.code} secondary={role.description} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="create-permissions-label">{t('userAccess.form.extraPermissions')}</InputLabel>
                  <Select
                    labelId="create-permissions-label"
                    multiple
                    value={createForm.permissions}
                    onChange={(event) => setCreateForm((prev) => ({ ...prev, permissions: event.target.value }))}
                    input={<OutlinedInput label={t('userAccess.form.extraPermissions')} />}
                    renderValue={(selected) => selected.join(', ')}
                  >
                    {permissionCatalog.map((permission) => (
                      <MenuItem key={permission} value={permission}>
                        <Checkbox checked={createForm.permissions.includes(permission)} />
                        <ListItemText primary={permission} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Stack>
        </DialogContent>
        <DialogActions sx={modalActionsSx}>
          <Button onClick={() => setCreateOpen(false)} disabled={createSaving}>
            {t('userAccess.actions.cancel')}
          </Button>
          <Button onClick={handleCreateUser} variant="contained" disabled={createSaving} startIcon={<PersonAddAlt1OutlinedIcon />}>
            {t('userAccess.actions.createUser')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={accessOpen}
        onClose={() => !accessSaving && setAccessOpen(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{ sx: modalPaperSx }}
      >
        <DialogTitleWithClose sx={modalHeaderSx} onClose={() => !accessSaving && setAccessOpen(false)}>
          {t('userAccess.dialogs.access.title')}
        </DialogTitleWithClose>
        <DialogContent sx={modalContentSx}>
          <Stack spacing={2}>
            <Typography variant="subtitle2">
              {t('userAccess.dialogs.access.user', { name: selectedUser?.name, email: selectedUser?.email })}
            </Typography>
            <Divider />
            <FormControl fullWidth>
              <InputLabel id="edit-roles-label">{t('userAccess.form.roles')}</InputLabel>
              <Select
                labelId="edit-roles-label"
                multiple
                value={selectedRoles}
                onChange={(event) => setSelectedRoles(event.target.value)}
                input={<OutlinedInput label={t('userAccess.form.roles')} />}
                renderValue={(selected) => selected.join(', ')}
              >
                {roleTemplates.map((role) => (
                  <MenuItem key={role.code} value={role.code}>
                    <Checkbox checked={selectedRoles.includes(role.code)} />
                    <ListItemText primary={role.code} secondary={role.description} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="edit-permissions-label">{t('userAccess.form.extraPermissions')}</InputLabel>
              <Select
                labelId="edit-permissions-label"
                multiple
                value={selectedPermissions}
                onChange={(event) => setSelectedPermissions(event.target.value)}
                input={<OutlinedInput label={t('userAccess.form.extraPermissions')} />}
                renderValue={(selected) => selected.join(', ')}
              >
                {permissionCatalog.map((permission) => (
                  <MenuItem key={permission} value={permission}>
                    <Checkbox checked={selectedPermissions.includes(permission)} />
                    <ListItemText primary={permission} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={modalActionsSx}>
          <Button onClick={() => setAccessOpen(false)} disabled={accessSaving}>
            {t('userAccess.actions.cancel')}
          </Button>
          <Button onClick={handleSaveAccess} variant="contained" disabled={accessSaving} startIcon={<SecurityOutlinedIcon />}>
            {t('userAccess.actions.saveAccess')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={statusOpen}
        onClose={() => !statusSaving && setStatusOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: modalPaperSx }}
      >
        <DialogTitleWithClose sx={modalHeaderSx} onClose={() => !statusSaving && setStatusOpen(false)}>
          {t('userAccess.dialogs.status.title')}
        </DialogTitleWithClose>
        <DialogContent sx={modalContentSx}>
          <Stack spacing={2}>
            <Typography variant="subtitle2">
              {statusTargetUser?.name} ({statusTargetUser?.email})
            </Typography>
            <Alert
              severity={nextStatusValue ? 'success' : 'warning'}
              variant="outlined"
              sx={(theme) => ({
                borderColor: withAlpha(
                  nextStatusValue ? theme.vars.palette.success.main : theme.vars.palette.warning.main,
                  0.35
                ),
                backgroundColor: withAlpha(
                  nextStatusValue ? theme.vars.palette.success.main : theme.vars.palette.warning.main,
                  0.1
                ),
                color: theme.vars.palette.text.primary,
                '& .MuiAlert-icon': {
                  color: nextStatusValue ? theme.vars.palette.success.main : theme.vars.palette.warning.main
                }
              })}
            >
              {t('userAccess.dialogs.status.newStatus', {
                status: nextStatusValue ? t('userAccess.status.active') : t('userAccess.status.inactive')
              })}
            </Alert>
          </Stack>
        </DialogContent>
        <DialogActions sx={modalActionsSx}>
          <Button onClick={() => setStatusOpen(false)} disabled={statusSaving}>
            {t('userAccess.actions.cancel')}
          </Button>
          <Button
            onClick={handleUpdateStatus}
            variant="contained"
            color="secondary"
            disabled={statusSaving}
            startIcon={<ManageAccountsOutlinedIcon />}
          >
            {t('userAccess.actions.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
