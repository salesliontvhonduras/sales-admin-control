import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import useAuth from 'hooks/useAuth';

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
import DialogTitle from '@mui/material/DialogTitle';
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
import { alpha } from '@mui/material/styles';

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
import { gridSpacing } from 'store/constant';
import {
  createAdminUser,
  fetchAccessCatalog,
  fetchAdminUserById,
  fetchAdminUsers,
  updateAdminUserAccess,
  updateAdminUserStatus
} from 'api/auth-admin';

const statusFilterOptions = [
  { value: 'ALL', label: 'Todos' },
  { value: 'ACTIVE', label: 'Activos' },
  { value: 'INACTIVE', label: 'Inactivos' }
];

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
  boxShadow: '0 10px 26px rgba(18, 38, 63, 0.08)',
  background:
    theme.palette.mode === 'light'
      ? `linear-gradient(145deg, #ffffff 0%, ${alpha(theme.palette.primary.light, 0.11)} 46%, ${alpha(theme.palette.success.light, 0.08)} 100%)`
      : theme.palette.background.default
});

const modalPaperSx = (theme) => ({
  borderRadius: 3,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: '0 24px 60px rgba(16, 24, 40, 0.2)',
  overflow: 'hidden'
});

const modalHeaderSx = (theme) => ({
  px: 3,
  py: 2.2,
  borderBottom: `1px solid ${theme.palette.divider}`,
  background:
    theme.palette.mode === 'light'
      ? `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.2)} 0%, ${alpha(theme.palette.info.light, 0.1)} 100%)`
      : alpha(theme.palette.background.paper, 0.9)
});

const modalContentSx = {
  px: 3,
  py: 2.5
};

const modalActionsSx = (theme) => ({
  px: 3,
  py: 2,
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: alpha(theme.palette.background.default, 0.6)
});

function boolFilter(value) {
  if (value === 'ACTIVE') return true;
  if (value === 'INACTIVE') return false;
  return null;
}

function formatDateTime(value) {
  if (!value) return '-';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '-';
  return parsed.toLocaleString('es-HN');
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

  const headers = useMemo(() => ({ Authorization: `Bearer ${accessToken}` }), [accessToken]);

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
      onError(error, 'No se pudo cargar el catálogo de acceso.');
    } finally {
      setCatalogLoading(false);
    }
  }, [accessToken, headers, onError]);

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
        onError(error, 'No se pudo cargar el listado de usuarios.');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [accessToken, headers, index, onError, search, size, statusFilter]
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
      enqueueSnackbar('Completa nombre, email, password y serial.', { variant: 'warning' });
      return;
    }

    setCreateSaving(true);
    try {
      await createAdminUser(createForm, { headers, skipAuthRedirect: true });
      enqueueSnackbar('Usuario creado correctamente.', { variant: 'success' });
      setCreateOpen(false);
      resetCreateForm();
      await loadUsers({ nextIndex: 0, silent: true });
      setIndex(0);
    } catch (error) {
      onError(error, 'No se pudo crear el usuario.');
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
      onError(error, 'No se pudo cargar el detalle del usuario.');
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
      enqueueSnackbar('Accesos actualizados.', { variant: 'success' });
      setAccessOpen(false);
      setSelectedUser(null);
      await loadUsers({ silent: true });
    } catch (error) {
      onError(error, 'No se pudo actualizar los accesos.');
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
      enqueueSnackbar('Estado de usuario actualizado.', { variant: 'success' });
      setStatusOpen(false);
      setStatusTargetUser(null);
      await loadUsers({ silent: true });
    } catch (error) {
      onError(error, 'No se pudo actualizar el estado.');
    } finally {
      setStatusSaving(false);
    }
  };

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <MainCard
          title="Administración de Usuarios y Accesos"
          secondary={
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={() => loadUsers({ silent: true })}
                disabled={loading || refreshing}
              >
                Refrescar
              </Button>
              <Button variant="contained" startIcon={<PersonAddAlt1OutlinedIcon />} onClick={() => setCreateOpen(true)}>
                Nuevo usuario
              </Button>
            </Stack>
          }
        >
          <Typography variant="body2" color="text.secondary">
            Configura altas de usuarios, roles y permisos efectivos desde un solo panel. El alta usa serial/licencia para mantener
            coherencia con el flujo actual.
          </Typography>
        </MainCard>
      </Grid>

      <Grid item xs={12} md={3}>
        <MetricCard title="Usuarios en página" value={users.length} helper={`Total filtrado: ${total}`} icon={<BadgeOutlinedIcon />} />
      </Grid>
      <Grid item xs={12} md={3}>
        <MetricCard
          title="Activos"
          value={metrics.activeCount}
          helper="Cuentas habilitadas"
          color="success"
          icon={<VerifiedUserOutlinedIcon />}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <MetricCard
          title="Admins (página)"
          value={metrics.adminCount}
          helper="Rol principal con ADMIN"
          color="error"
          icon={<AdminPanelSettingsOutlinedIcon />}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <MetricCard
          title="Sin licencia activa"
          value={metrics.noLicense}
          helper="No podrán iniciar sesión"
          color="warning"
          icon={<BlockOutlinedIcon />}
        />
      </Grid>

      <Grid item xs={12}>
        <MainCard title="Listado de Usuarios">
          <Stack spacing={2.5}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={5}>
                <TextField
                  fullWidth
                  value={search}
                  label="Buscar por nombre o email"
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
                  label="Estado"
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
                <Alert severity="info" variant="outlined">
                  Catálogo cargado:{' '}
                  {catalogLoading ? 'cargando...' : `${roleTemplates.length} roles plantilla / ${permissionCatalog.length} permisos`}
                </Alert>
              </Grid>
            </Grid>

            {(loading || refreshing) && <LinearProgress />}

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Usuario</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Rol Principal</TableCell>
                    <TableCell>Licencia</TableCell>
                    <TableCell>Permisos</TableCell>
                    <TableCell align="right">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell>
                        <Stack spacing={0.4}>
                          <Typography variant="subtitle2">{item.name || '-'}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {item.email} | {item.provider || 'LOCAL'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Alta: {formatDateTime(item.createdAt)}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip size="small" color={statusColor(item.active)} label={item.active ? 'ACTIVO' : 'INACTIVO'} />
                      </TableCell>
                      <TableCell>
                        <Chip size="small" color={roleColor(item.primaryRole)} label={item.primaryRole || 'SIN_ROL'} />
                      </TableCell>
                      <TableCell>
                        <Stack spacing={0.4}>
                          <Chip
                            size="small"
                            color={item.hasActiveLicense ? 'success' : 'warning'}
                            label={item.hasActiveLicense ? 'LICENCIA ACTIVA' : 'SIN LICENCIA ACTIVA'}
                          />
                          <Typography variant="caption" color="text.secondary">
                            Expira: {formatDateTime(item.licenseExpiresAt)}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.6} flexWrap="wrap" useFlexGap>
                          {(item.permissions || []).slice(0, 3).map((permission) => (
                            <Chip key={`${item.id}-${permission}`} size="small" variant="outlined" label={permission} />
                          ))}
                          {(item.permissions || []).length > 3 && (
                            <Chip size="small" variant="outlined" label={`+${item.permissions.length - 3} más`} />
                          )}
                        </Stack>
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" justifyContent="flex-end" spacing={1}>
                          <Tooltip title="Editar roles y permisos">
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<SecurityOutlinedIcon />}
                              onClick={() => openAccessModal(item.id)}
                            >
                              Accesos
                            </Button>
                          </Tooltip>
                          <Tooltip title="Activar/Inactivar">
                            <Button
                              size="small"
                              variant="contained"
                              color="secondary"
                              startIcon={<ManageAccountsOutlinedIcon />}
                              onClick={() => openStatusModal(item)}
                            >
                              Estado
                            </Button>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!loading && users.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <Alert severity="warning" variant="outlined">
                          No hay usuarios para los filtros actuales.
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
        <DialogTitle sx={modalHeaderSx}>Nuevo Usuario</DialogTitle>
        <DialogContent sx={modalContentSx}>
          <Stack spacing={2}>
            <Alert severity="info" variant="outlined">
              Este alta usa el flujo actual con serial/licencia, por lo tanto el usuario quedará listo para autenticarse según su licencia.
            </Alert>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nombre"
                  value={createForm.name}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, name: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={createForm.email}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, email: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Password temporal"
                  type="password"
                  value={createForm.password}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, password: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Serial de licencia"
                  value={createForm.serialCode}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, serialCode: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="create-roles-label">Roles</InputLabel>
                  <Select
                    labelId="create-roles-label"
                    multiple
                    value={createForm.roles}
                    onChange={(event) => setCreateForm((prev) => ({ ...prev, roles: event.target.value }))}
                    input={<OutlinedInput label="Roles" />}
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
                  <InputLabel id="create-permissions-label">Permisos extra</InputLabel>
                  <Select
                    labelId="create-permissions-label"
                    multiple
                    value={createForm.permissions}
                    onChange={(event) => setCreateForm((prev) => ({ ...prev, permissions: event.target.value }))}
                    input={<OutlinedInput label="Permisos extra" />}
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
            Cancelar
          </Button>
          <Button onClick={handleCreateUser} variant="contained" disabled={createSaving} startIcon={<PersonAddAlt1OutlinedIcon />}>
            Crear usuario
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
        <DialogTitle sx={modalHeaderSx}>Configurar Accesos</DialogTitle>
        <DialogContent sx={modalContentSx}>
          <Stack spacing={2}>
            <Typography variant="subtitle2">
              Usuario: {selectedUser?.name} ({selectedUser?.email})
            </Typography>
            <Divider />
            <FormControl fullWidth>
              <InputLabel id="edit-roles-label">Roles</InputLabel>
              <Select
                labelId="edit-roles-label"
                multiple
                value={selectedRoles}
                onChange={(event) => setSelectedRoles(event.target.value)}
                input={<OutlinedInput label="Roles" />}
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
              <InputLabel id="edit-permissions-label">Permisos extra</InputLabel>
              <Select
                labelId="edit-permissions-label"
                multiple
                value={selectedPermissions}
                onChange={(event) => setSelectedPermissions(event.target.value)}
                input={<OutlinedInput label="Permisos extra" />}
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
            Cancelar
          </Button>
          <Button onClick={handleSaveAccess} variant="contained" disabled={accessSaving} startIcon={<SecurityOutlinedIcon />}>
            Guardar accesos
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
        <DialogTitle sx={modalHeaderSx}>Actualizar Estado del Usuario</DialogTitle>
        <DialogContent sx={modalContentSx}>
          <Stack spacing={2}>
            <Typography variant="subtitle2">
              {statusTargetUser?.name} ({statusTargetUser?.email})
            </Typography>
            <Alert severity={nextStatusValue ? 'success' : 'warning'} variant="outlined">
              Nuevo estado: {nextStatusValue ? 'ACTIVO' : 'INACTIVO'}
            </Alert>
          </Stack>
        </DialogContent>
        <DialogActions sx={modalActionsSx}>
          <Button onClick={() => setStatusOpen(false)} disabled={statusSaving}>
            Cancelar
          </Button>
          <Button
            onClick={handleUpdateStatus}
            variant="contained"
            color="secondary"
            disabled={statusSaving}
            startIcon={<ManageAccountsOutlinedIcon />}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
