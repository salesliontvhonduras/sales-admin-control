import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import useAuth from 'hooks/useAuth';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
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
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';

import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import WifiTetheringIcon from '@mui/icons-material/WifiTethering';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import KeyIcon from '@mui/icons-material/Key';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LanIcon from '@mui/icons-material/Lan';
import PublicIcon from '@mui/icons-material/Public';
import BoltIcon from '@mui/icons-material/Bolt';

import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { lionTvApi } from 'utils/api';

const fieldSx = {
  '& .MuiInputBase-root': { borderRadius: 2, minHeight: 48 },
  '& .MuiInputLabel-root': { fontWeight: 500 }
};

function formatDate(value) {
  if (!value) return '-';
  const d = new Date(value.replace(' ', 'T'));
  if (!Number.isNaN(d.getTime())) return d.toLocaleString();
  return value;
}

function normalizeLine(item = {}) {
  return {
    id: item.id ?? '',
    username: item.username ?? '',
    password: item.password ?? '',
    usernameEncode: item.username_encode ?? '',
    passwordEncode: item.password_encode ?? '',
    expDate: item.exp_date ?? '',
    enabled: Boolean(item.enabled),
    enabledLabel: item.enabled_label ?? '',
    maxConnections: item.max_connections ?? 0,
    type: item.type ?? '',
    resellerNotes: item.reseller_notes ?? '',
    packageId: item.package_id ?? null,
    packageName: item.package_name ?? '',
    createdAt: item.created_at ?? '',
    ownerName: item.owner_name ?? '',
    lastWatchedIp: item.last_watched_from_ip ?? '',
    lastWatchedTime: item.last_watched_stream_time ?? '',
    lastWatchedName: item.last_watched_stream_name ?? '',
    expired: Boolean(item._expired),
    trial: Boolean(item._trial)
  };
}

function StatusChip({ enabled, expired }) {
  const color = enabled ? (expired ? 'warning' : 'success') : 'default';
  const label = expired ? 'Expirada' : enabled ? 'Activa' : 'Inactiva';
  return <Chip size="small" color={color} label={label} />;
}

export default function LinesLionTv() {
  const { enqueueSnackbar } = useSnackbar();
  const { accessToken } = useAuth();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [detail, setDetail] = useState({ open: false, row: null });

  const handleUnauthorized = (err) => {
    const status = err?.response?.status || err?.request?.status;
    return status === 401;
  };

  const loadLines = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const res = await lionTvApi.get('/lines/v1/list-lines', {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { index: 0, size: 5000, start: 0, filters: '', sorting: '' },
        skipAuthRedirect: true
      });
      const payload = res?.data?.data ?? res?.data ?? {};
      const raw = payload.data ?? payload.items ?? payload.content ?? payload ?? [];
      const list = Array.isArray(raw) ? raw : [];
      const normalized = list.map(normalizeLine);
      setRows(normalized);
      setTotal(payload.rowCount ?? payload.rowTotal ?? normalized.length);
    } catch (err) {
      if (!handleUnauthorized(err)) {
        enqueueSnackbar(err?.response?.data?.message || err.message || 'No se pudieron cargar las líneas.', {
          variant: 'error'
        });
      }
    } finally {
      setLoading(false);
    }
  }, [accessToken, enqueueSnackbar]);

  useEffect(() => {
    loadLines();
  }, [loadLines, refreshKey]);

  const filteredRows = useMemo(() => {
    if (!search) return rows;
    const term = search.toLowerCase();
    return rows.filter((row) => {
      return (
        (row.username || '').toLowerCase().includes(term) ||
        (row.packageName || '').toLowerCase().includes(term) ||
        (row.ownerName || '').toLowerCase().includes(term) ||
        (row.lastWatchedIp || '').toLowerCase().includes(term) ||
        (row.enabledLabel || '').toLowerCase().includes(term)
      );
    });
  }, [rows, search]);

  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredRows.slice(start, start + rowsPerPage);
  }, [filteredRows, page, rowsPerPage]);

  useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(filteredRows.length / rowsPerPage) - 1);
    if (page > maxPage) setPage(0);
  }, [filteredRows.length, page, rowsPerPage]);

  const summary = useMemo(
    () =>
      rows.reduce(
        (acc, row) => {
          if (row.enabled) acc.enabled += 1;
          if (row.expired) acc.expired += 1;
          return acc;
        },
        { enabled: 0, expired: 0 }
      ),
    [rows]
  );

  return (
    <Box sx={{ width: '100%', maxWidth: 1400, mx: 'auto' }}>
      <MainCard
        title="Líneas"
        secondary={
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => setRefreshKey((v) => v + 1)}>
              Recargar
            </Button>
          </Stack>
        }
      >
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} sm={4}>
            <Chip label={`${total} líneas`} color="primary" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Chip label={`Activas: ${summary.enabled}`} color="success" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Chip label={`Expiradas: ${summary.expired}`} color="warning" />
          </Grid>
        </Grid>
      </MainCard>

      <MainCard
        title="Listado de líneas"
        secondary={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: { xs: '100%', sm: 360 } }}>
            <TextField
              size="small"
              placeholder="Buscar (usuario, paquete, dueño, IP)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
              sx={fieldSx}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
          </Box>
        }
      >
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Usuario</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Paquete</TableCell>
                <TableCell>Expira</TableCell>
                <TableCell>Conexiones</TableCell>
                <TableCell>Creada</TableCell>
                <TableCell>Owner</TableCell>
                <TableCell>Último stream</TableCell>
                <TableCell>IP</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.map((row) => (
                <TableRow key={row.id || row.username}>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light', color: 'primary.dark' }}>
                        <WifiTetheringIcon fontSize="small" />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2">{row.username}</Typography>
                        <Tooltip title={`Password: ${row.password}`}>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <KeyIcon fontSize="inherit" color="action" />
                            <Typography variant="caption" color="text.secondary">
                              {row.passwordEncode || row.password}
                            </Typography>
                          </Stack>
                        </Tooltip>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <StatusChip enabled={row.enabled} expired={row.expired} />
                  </TableCell>
                  <TableCell>
                    <Stack spacing={0.25}>
                      <Typography variant="body2">{row.packageName || '-'}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {row.packageId ?? '-'}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <CalendarMonthIcon fontSize="small" color="action" />
                      <Typography variant="body2">{formatDate(row.expDate)}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{row.maxConnections}</TableCell>
                  <TableCell>{formatDate(row.createdAt)}</TableCell>
                  <TableCell>{row.ownerName || '-'}</TableCell>
                  <TableCell>
                    <Stack spacing={0.25}>
                      <Typography variant="body2">{row.lastWatchedName || '-'}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(row.lastWatchedTime)}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{row.lastWatchedIp || '-'}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => setDetail({ open: true, row })}
                      aria-label="Ver detalles de la línea"
                    >
                      <InfoOutlinedIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && paginatedRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    No hay líneas registradas.
                  </TableCell>
                </TableRow>
              )}
              {loading && (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    Cargando...
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider sx={{ my: 1 }} />

        <TablePagination
          component="div"
          count={filteredRows.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(e, p) => setPage(p)}
          onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
        />
      </MainCard>

      <Dialog
        open={detail.open}
        onClose={() => setDetail({ open: false, row: null })}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: 12,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider'
          }
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pr: 1,
            bgcolor: 'background.default',
            background: (theme) =>
              `linear-gradient(120deg, ${theme.palette.primary.light}20 0%, ${theme.palette.primary.main}15 45%, ${theme.palette.background.paper} 100%)`,
            borderBottom: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar
              sx={{
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                width: 40,
                height: 40,
                boxShadow: 4
              }}
            >
              <WifiTetheringIcon fontSize="small" />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ lineHeight: 1 }}>
                Detalle de línea
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {detail.row?.username || '-'}
              </Typography>
            </Box>
          </Stack>
          <IconButton onClick={() => setDetail({ open: false, row: null })} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            bgcolor: 'background.paper',
            px: { xs: 2, sm: 3 },
            py: { xs: 2, sm: 3 }
          }}
        >
          <Stack spacing={2}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2.5,
                bgcolor: 'primary.lighter',
                border: '1px solid',
                borderColor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
                boxShadow: 6,
                background: (theme) =>
                  `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.background.paper} 80%)`
              }}
            >
              <Box>
                <Typography variant="overline" color="text.secondary">
                  Usuario
                </Typography>
                <Typography variant="h6" sx={{ lineHeight: 1.1 }}>
                  {detail.row?.username || '-'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Password: {detail.row?.password || '-'}
                </Typography>
              </Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <StatusChip enabled={detail.row?.enabled} expired={detail.row?.expired} />
                {detail.row?.trial ? <Chip size="small" color="info" label="Trial" /> : null}
              </Stack>
            </Box>

          

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: '1px dashed',
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                    boxShadow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.75,
                    minHeight: 120,
                    justifyContent: 'space-between'
                  }}
                >
                  <Stack spacing={0.75}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <BoltIcon color="warning" fontSize="small" />
                      <Typography variant="caption" color="text.secondary">
                        Paquete
                      </Typography>
                    </Stack>
                    <Typography variant="subtitle2">{detail.row?.packageName || '-'}</Typography>
                    <Stack spacing={0.5} alignItems="flex-start">
                      <Typography variant="caption" color="text.secondary">
                        ID: {detail.row?.packageId ?? '-'}
                      </Typography>
                      <Chip size="small" label={`Tipo: ${detail.row?.type || '-'}`} variant="outlined" />
                    </Stack>
                  </Stack>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: '1px dashed',
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                    boxShadow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.75,
                    minHeight: 120,
                    justifyContent: 'space-between'
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <LanIcon color="action" fontSize="small" />
                    <Typography variant="caption" color="text.secondary">
                      Conexiones
                    </Typography>
                  </Stack>
                  <Typography variant="subtitle2">{detail.row?.maxConnections ?? '-'}</Typography>
                  <Chip size="small" label={`Estado: ${detail.row?.enabledLabel || '-'}`} variant="outlined" />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: '1px dashed',
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                    boxShadow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.75,
                    minHeight: 110,
                    justifyContent: 'space-between'
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <AccessTimeIcon color="action" fontSize="small" />
                    <Typography variant="caption" color="text.secondary">
                      Expira
                    </Typography>
                  </Stack>
                  <Typography variant="subtitle2">{formatDate(detail.row?.expDate)}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: '1px dashed',
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                    boxShadow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.75,
                    minHeight: 110,
                    justifyContent: 'space-between'
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CalendarMonthIcon color="action" fontSize="small" />
                    <Typography variant="caption" color="text.secondary">
                      Creada
                    </Typography>
                  </Stack>
                  <Typography variant="subtitle2">{formatDate(detail.row?.createdAt)}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Owner: {detail.row?.ownerName || '-'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                border: '1px dashed',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                boxShadow: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 0.75,
                minHeight: 120,
                justifyContent: 'space-between'
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Último stream
              </Typography>
              <Typography variant="subtitle2">{detail.row?.lastWatchedName || '-'}</Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="flex-start">
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <AccessTimeIcon fontSize="inherit" color="action" />
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(detail.row?.lastWatchedTime)}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <PublicIcon fontSize="inherit" color="action" />
                  <Typography variant="caption" color="text.secondary">
                    {detail.row?.lastWatchedIp || '-'}
                  </Typography>
                </Stack>
              </Stack>
            </Box>

            {detail.row?.resellerNotes ? (
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'background.default',
                  border: '1px dashed',
                  borderColor: 'divider',
                  boxShadow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.5,
                  minHeight: 110,
                  justifyContent: 'space-between'
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Notas
                </Typography>
                <Typography variant="body2">{detail.row.resellerNotes}</Typography>
              </Box>
            ) : null}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setDetail({ open: false, row: null })} variant="outlined">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
