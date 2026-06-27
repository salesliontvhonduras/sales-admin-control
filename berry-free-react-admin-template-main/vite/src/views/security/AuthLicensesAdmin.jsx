import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import useAuth from 'hooks/useAuth';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import LinearProgress from '@mui/material/LinearProgress';
import MenuItem from '@mui/material/MenuItem';
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
import { useTheme } from '@mui/material/styles';
import { withAlpha } from 'utils/colorUtils';

import AddIcon from '@mui/icons-material/Add';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';

import MainCard from 'ui-component/cards/MainCard';
import LionMetricCard from 'ui-component/cards/LionMetricCard';
import DialogTitleWithClose from 'ui-component/dialogs/DialogTitleWithClose';
import ResponsiveActionBar from 'ui-component/responsive/ResponsiveActionBar';
import ResponsiveFilters from 'ui-component/responsive/ResponsiveFilters';
import ResponsiveMetricGrid from 'ui-component/responsive/ResponsiveMetricGrid';
import { hasPermissionExact } from 'utils/rbac';
import { createAuthLicense, createAuthLicensesBulk, fetchAuthLicenses, updateAuthLicenseStatus } from 'api/auth-admin';

const statusOptions = [
  { value: '', label: 'Todos' },
  { value: 'AVAILABLE', label: 'Disponibles' },
  { value: 'ASSIGNED', label: 'Asignadas' },
  { value: 'CANCELLED', label: 'Canceladas' }
];

const defaultCreateForm = {
  serialCode: '',
  moduleCode: 'PANEL_AUTH',
  emailLock: '',
  expiresAt: ''
};

const defaultBulkForm = {
  quantity: 10,
  moduleCode: 'PANEL_AUTH',
  serialPrefix: 'PANEL',
  emailLock: '',
  expiresAt: ''
};

const writePermissions = [
  'ROLE_ADMIN',
  'ADMIN',
  'USER_MANAGEMENT_CREATE_USER',
  'ROLE_USER_MANAGEMENT_CREATE_USER',
  'USER_MANAGEMENT_EDIT_USER',
  'ROLE_USER_MANAGEMENT_EDIT_USER'
];

function statusColor(status) {
  const value = String(status || '').toUpperCase();
  if (value === 'AVAILABLE') return 'success';
  if (value === 'ASSIGNED') return 'primary';
  if (value === 'CANCELLED') return 'default';
  return 'warning';
}

function formatDateTime(value, locale = 'es-HN') {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString(locale);
}

function getErrorMessage(error, fallback) {
  return error?.response?.data?.message || error?.message || fallback;
}

const surfaceSx = (theme) => ({
  borderRadius: 2.5,
  border: '1px solid',
  borderColor: withAlpha(theme.palette.divider, 0.9),
  backgroundColor: theme.vars?.palette?.surface?.card || theme.palette.background.paper,
  boxShadow: theme.palette.mode === 'dark' ? `0 14px 30px ${withAlpha('#020617', 0.36)}` : `0 12px 24px ${withAlpha('#0f172a', 0.08)}`
});

const tableContainerSx = (theme) => ({
  ...surfaceSx(theme),
  overflowX: 'auto'
});

const modalPaperSx = (theme) => ({
  borderRadius: 2.5,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.vars?.palette?.surface?.card || theme.palette.background.paper,
  overflow: 'hidden'
});

const modalContentSx = {
  px: { xs: 1.5, sm: 3 },
  py: { xs: 1.75, sm: 2.5 },
  '& .MuiTextField-root': {
    width: '100%'
  }
};

const modalActionsSx = (theme) => ({
  px: { xs: 1.5, sm: 3 },
  py: { xs: 1.5, sm: 2 },
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: withAlpha(theme.vars?.palette?.surface?.muted || theme.palette.background.default, 0.86),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column-reverse',
    alignItems: 'stretch',
    gap: 1,
    '& > .MuiButton-root': {
      width: '100%'
    }
  }
});

export default function AuthLicensesAdmin() {
  const { accessToken, user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const headers = useMemo(() => ({ Authorization: `Bearer ${accessToken}` }), [accessToken]);
  const canWrite = hasPermissionExact(user, { any: writePermissions });

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [moduleCode, setModuleCode] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [createForm, setCreateForm] = useState(defaultCreateForm);
  const [bulkForm, setBulkForm] = useState(defaultBulkForm);

  const loadRows = useCallback(async () => {
    setLoading(true);
    try {
      const payload = await fetchAuthLicenses(
        {
          index: page,
          size: rowsPerPage,
          search: search || undefined,
          status: status || undefined,
          moduleCode: moduleCode || undefined
        },
        { headers, skipAuthRedirect: true }
      );
      setRows(Array.isArray(payload?.data) ? payload.data : []);
      setTotal(Number(payload?.total || 0));
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error, 'No se pudieron cargar las licencias Auth.'), { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar, headers, moduleCode, page, rowsPerPage, search, status]);

  useEffect(() => {
    loadRows();
  }, [loadRows]);

  const metrics = useMemo(() => {
    const available = rows.filter((row) => row.status === 'AVAILABLE').length;
    const assigned = rows.filter((row) => row.status === 'ASSIGNED').length;
    const cancelled = rows.filter((row) => row.status === 'CANCELLED').length;
    const expired = rows.filter((row) => row.expiresAt && new Date(row.expiresAt).getTime() <= Date.now()).length;
    return [
      { title: 'Total filtradas', value: total, helper: 'Coincidencias del filtro actual', color: 'primary' },
      { title: 'Disponibles', value: available, helper: 'En la página actual', color: 'success' },
      { title: 'Asignadas', value: assigned, helper: 'En la página actual', color: 'secondary' },
      { title: 'Vencidas / canceladas', value: expired + cancelled, helper: 'En la página actual', color: 'warning' }
    ];
  }, [rows, total]);

  const resetCreateForm = () => setCreateForm(defaultCreateForm);
  const resetBulkForm = () => setBulkForm(defaultBulkForm);

  const handleCreate = async () => {
    if (!canWrite) {
      enqueueSnackbar('No tienes permiso para crear licencias Auth.', { variant: 'warning' });
      return;
    }
    setSaving(true);
    try {
      await createAuthLicense(
        {
          ...createForm,
          serialCode: createForm.serialCode || undefined,
          emailLock: createForm.emailLock || undefined,
          expiresAt: createForm.expiresAt || undefined
        },
        { headers, skipAuthRedirect: true }
      );
      enqueueSnackbar('Licencia Auth creada.', { variant: 'success' });
      setCreateOpen(false);
      resetCreateForm();
      setPage(0);
      await loadRows();
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error, 'No se pudo crear la licencia Auth.'), { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleBulkCreate = async () => {
    if (!canWrite) {
      enqueueSnackbar('No tienes permiso para crear licencias Auth.', { variant: 'warning' });
      return;
    }
    setSaving(true);
    try {
      const created = await createAuthLicensesBulk(
        {
          ...bulkForm,
          quantity: Number(bulkForm.quantity || 1),
          serialPrefix: bulkForm.serialPrefix || undefined,
          emailLock: bulkForm.emailLock || undefined,
          expiresAt: bulkForm.expiresAt || undefined
        },
        { headers, skipAuthRedirect: true }
      );
      enqueueSnackbar(`${Array.isArray(created) ? created.length : Number(bulkForm.quantity || 1)} licencia(s) creadas.`, { variant: 'success' });
      setBulkOpen(false);
      resetBulkForm();
      setPage(0);
      await loadRows();
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error, 'No se pudieron crear las licencias.'), { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (row) => {
    if (!canWrite || !row?.licenseId) return;
    const nextStatus = row.status === 'CANCELLED' ? 'AVAILABLE' : 'CANCELLED';
    setSaving(true);
    try {
      await updateAuthLicenseStatus(row.licenseId, nextStatus, { headers, skipAuthRedirect: true });
      enqueueSnackbar(nextStatus === 'AVAILABLE' ? 'Licencia reactivada.' : 'Licencia cancelada.', { variant: 'success' });
      await loadRows();
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error, 'No se pudo actualizar la licencia.'), { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const copySerial = async (serialCode) => {
    if (!serialCode) return;
    try {
      await navigator.clipboard.writeText(serialCode);
      enqueueSnackbar('Serial copiado.', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('No se pudo copiar el serial.', { variant: 'warning' });
    }
  };

  return (
    <MainCard
      title="Licencias Auth"
      secondary={
        <ResponsiveActionBar>
          <Button startIcon={<RefreshIcon />} variant="outlined" onClick={loadRows} disabled={loading}>
            Actualizar
          </Button>
          {canWrite ? (
            <>
              <Button startIcon={<AddIcon />} variant="contained" onClick={() => setCreateOpen(true)}>
                Crear licencia
              </Button>
              <Button startIcon={<LibraryAddIcon />} variant="outlined" onClick={() => setBulkOpen(true)}>
                Crear lote
              </Button>
            </>
          ) : null}
        </ResponsiveActionBar>
      }
    >
      <Stack spacing={2.5}>
        <Card variant="outlined" sx={(themeValue) => surfaceSx(themeValue)}>
          <CardContent sx={{ p: { xs: 1.75, sm: 2.25 }, '&:last-child': { pb: { xs: 1.75, sm: 2.25 } } }}>
            <Typography variant="h3" sx={{ fontWeight: 850 }}>
              Registro de seriales para usuarios internos
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Crea seriales disponibles antes de registrar usuarios admin, operadores o resellers en Control de Accesos.
            </Typography>
          </CardContent>
        </Card>

        <ResponsiveMetricGrid columns={{ xs: 1, sm: 2, lg: 4 }}>
          {metrics.map((metric) => (
            <LionMetricCard key={metric.title} {...metric} />
          ))}
        </ResponsiveMetricGrid>

        <ResponsiveFilters>
          <TextField
            label="Buscar"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(0);
            }}
            placeholder="Serial, email o usuario"
            InputProps={{ startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} /> }}
          />
          <TextField
            select
            label="Estado"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(0);
            }}
          >
            {statusOptions.map((option) => (
              <MenuItem key={option.value || 'all'} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Módulo"
            value={moduleCode}
            onChange={(event) => {
              setModuleCode(event.target.value);
              setPage(0);
            }}
            placeholder="PANEL_AUTH"
          />
        </ResponsiveFilters>

        {loading ? <LinearProgress /> : null}

        <TableContainer sx={tableContainerSx(theme)}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Serial</TableCell>
                <TableCell>Módulo</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Vence</TableCell>
                <TableCell>Email lock</TableCell>
                <TableCell>Usuario</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => {
                const assigned = row.status === 'ASSIGNED' || row.userId;
                return (
                  <TableRow key={row.licenseId} hover>
                    <TableCell>
                      <Stack direction="row" spacing={0.75} alignItems="center">
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 700 }}>
                          {row.serialCode}
                        </Typography>
                        <Tooltip title="Copiar serial">
                          <Button size="small" variant="text" onClick={() => copySerial(row.serialCode)} sx={{ minWidth: 0 }}>
                            <ContentCopyIcon fontSize="small" />
                          </Button>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                    <TableCell>{row.moduleCode || '-'}</TableCell>
                    <TableCell>
                      <Chip size="small" color={statusColor(row.status)} label={row.status || '-'} />
                    </TableCell>
                    <TableCell>{formatDateTime(row.expiresAt)}</TableCell>
                    <TableCell>{row.emailLock || '-'}</TableCell>
                    <TableCell>
                      <Stack spacing={0.2}>
                        <Typography variant="body2">{row.userName || '-'}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {row.userEmail || '-'}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="right">
                      {canWrite && !assigned ? (
                        <Button
                          size="small"
                          color={row.status === 'CANCELLED' ? 'success' : 'warning'}
                          variant="outlined"
                          startIcon={row.status === 'CANCELLED' ? <CheckCircleIcon /> : <BlockIcon />}
                          disabled={saving}
                          onClick={() => handleToggleStatus(row)}
                        >
                          {row.status === 'CANCELLED' ? 'Reactivar' : 'Cancelar'}
                        </Button>
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          {assigned ? 'Asignada' : '-'}
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
              {!loading && rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7}>
                    <Box sx={{ py: 5, textAlign: 'center' }}>
                      <Typography color="text.secondary">No hay licencias Auth con esos filtros.</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={total}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(event, nextPage) => setPage(nextPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </Stack>

      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} fullWidth maxWidth="sm" PaperProps={{ sx: modalPaperSx }}>
        <DialogTitleWithClose onClose={() => setCreateOpen(false)}>
          <Typography variant="h4">Crear licencia Auth</Typography>
        </DialogTitleWithClose>
        <DialogContent sx={modalContentSx}>
          <Stack spacing={2}>
            <TextField
              label="Serial"
              value={createForm.serialCode}
              onChange={(event) => setCreateForm((form) => ({ ...form, serialCode: event.target.value }))}
              helperText="Opcional. Si lo dejas vacío, el backend genera un serial único."
            />
            <TextField label="Módulo" value={createForm.moduleCode} onChange={(event) => setCreateForm((form) => ({ ...form, moduleCode: event.target.value }))} />
            <TextField label="Email lock" value={createForm.emailLock} onChange={(event) => setCreateForm((form) => ({ ...form, emailLock: event.target.value }))} />
            <TextField
              label="Vencimiento"
              type="datetime-local"
              value={createForm.expiresAt}
              onChange={(event) => setCreateForm((form) => ({ ...form, expiresAt: event.target.value }))}
              InputLabelProps={{ shrink: true }}
              helperText="Opcional. Si lo dejas vacío, se usará 30 días."
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={modalActionsSx}>
          <Button onClick={() => setCreateOpen(false)} disabled={saving}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleCreate} disabled={saving}>
            Crear
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={bulkOpen} onClose={() => setBulkOpen(false)} fullWidth maxWidth="sm" PaperProps={{ sx: modalPaperSx }}>
        <DialogTitleWithClose onClose={() => setBulkOpen(false)}>
          <Typography variant="h4">Crear lote de licencias</Typography>
        </DialogTitleWithClose>
        <DialogContent sx={modalContentSx}>
          <Stack spacing={2}>
            <TextField
              label="Cantidad"
              type="number"
              value={bulkForm.quantity}
              onChange={(event) => setBulkForm((form) => ({ ...form, quantity: event.target.value }))}
              helperText="Máximo 500 por lote."
            />
            <TextField label="Módulo" value={bulkForm.moduleCode} onChange={(event) => setBulkForm((form) => ({ ...form, moduleCode: event.target.value }))} />
            <TextField label="Prefijo" value={bulkForm.serialPrefix} onChange={(event) => setBulkForm((form) => ({ ...form, serialPrefix: event.target.value }))} />
            <TextField label="Email lock" value={bulkForm.emailLock} onChange={(event) => setBulkForm((form) => ({ ...form, emailLock: event.target.value }))} />
            <TextField
              label="Vencimiento"
              type="datetime-local"
              value={bulkForm.expiresAt}
              onChange={(event) => setBulkForm((form) => ({ ...form, expiresAt: event.target.value }))}
              InputLabelProps={{ shrink: true }}
              helperText="Opcional. Si lo dejas vacío, se usará 30 días."
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={modalActionsSx}>
          <Button onClick={() => setBulkOpen(false)} disabled={saving}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleBulkCreate} disabled={saving || Number(bulkForm.quantity || 0) < 1}>
            Crear lote
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
}
