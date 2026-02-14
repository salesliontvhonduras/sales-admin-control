import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import useAuth from 'hooks/useAuth';
import { useTranslation } from 'react-i18next';

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
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

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

const detailCardSx = {
  p: 2,
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
  bgcolor: 'background.paper',
  boxShadow: 2,
  display: 'flex',
  flexDirection: 'column',
  gap: 0.75,
  minHeight: 140,
  justifyContent: 'space-between'
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

function StatusChip({ enabled, expired, t }) {
  const color = enabled ? (expired ? 'warning' : 'success') : 'default';
  const label = expired ? t('lines.status.expired') : enabled ? t('lines.status.active') : t('lines.status.inactive');
  return <Chip size="small" color={color} label={label} />;
}

export default function LinesLionTv() {
  const { enqueueSnackbar } = useSnackbar();
  const { accessToken } = useAuth();
  const { t } = useTranslation();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
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
    if (!search && !statusFilter) return rows;
    const term = search.toLowerCase();
    return rows.filter((row) => {
      const statusValue = row.enabled ? (row.expired ? 'EXPIRED' : 'ACTIVE') : 'INACTIVE';
      if (statusFilter && statusValue.toLowerCase() !== statusFilter.toLowerCase()) return false;
      return (
        (row.username || '').toLowerCase().includes(term) ||
        (row.packageName || '').toLowerCase().includes(term) ||
        (row.ownerName || '').toLowerCase().includes(term) ||
        (row.lastWatchedIp || '').toLowerCase().includes(term) ||
        (row.enabledLabel || '').toLowerCase().includes(term)
      );
    });
  }, [rows, search, statusFilter]);

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
        title={t('lines.title')}
        secondary={
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => setRefreshKey((v) => v + 1)}>
              {t('actions.refresh')}
            </Button>
          </Stack>
        }
      >
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} sm={4}>
            <Chip label={t('lines.summary.total', { count: total })} color="primary" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Chip label={t('lines.summary.active', { count: summary.enabled })} color="success" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Chip label={t('lines.summary.expired', { count: summary.expired })} color="warning" />
          </Grid>
        </Grid>
      </MainCard>

      <MainCard
        title={t('lines.listTitle')}
        secondary={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: { xs: '100%', sm: 480 } }}>
            <TextField
              size="small"
              placeholder={t('lines.search')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
              sx={{ '& .MuiOutlinedInput-root': { minHeight: 40 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
            <FormControl size="small" sx={{ minWidth: 140, '& .MuiOutlinedInput-root': { minHeight: 40 } }}>
              <InputLabel>{t('lines.filters.status')}</InputLabel>
              <Select value={statusFilter} label={t('lines.filters.status')} onChange={(e) => setStatusFilter(e.target.value)}>
                <MenuItem value="">
                  <em>{t('lines.filters.all')}</em>
                </MenuItem>
                <MenuItem value="ACTIVE">{t('lines.status.active')}</MenuItem>
                <MenuItem value="EXPIRED">{t('lines.status.expired')}</MenuItem>
                <MenuItem value="INACTIVE">{t('lines.status.inactive')}</MenuItem>
              </Select>
            </FormControl>
          </Box>
        }
      >
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t('lines.headers.user')}</TableCell>
                <TableCell>{t('lines.headers.status')}</TableCell>
                <TableCell>{t('lines.headers.package')}</TableCell>
                <TableCell>{t('lines.headers.expires')}</TableCell>
                <TableCell>{t('lines.headers.max')}</TableCell>
                <TableCell>{t('lines.headers.created')}</TableCell>
                <TableCell>{t('lines.headers.owner')}</TableCell>
                <TableCell>{t('lines.headers.lastWatch')}</TableCell>
                <TableCell>{t('lines.headers.lastIp')}</TableCell>
                <TableCell>{t('lines.headers.actions')}</TableCell>
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
                        <Tooltip title={`${t('lines.detail.password')}: ${row.password}`}>
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
                    <StatusChip enabled={row.enabled} expired={row.expired} t={t} />
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
                      aria-label={t('lines.detail.title')}
                    >
                      <InfoOutlinedIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && paginatedRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    {t('lines.table.empty')}
                  </TableCell>
                </TableRow>
              )}
              {loading && (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    {t('lines.table.loading')}
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
                {t('lines.detail.title')}
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
                boxShadow: 8,
                background: (theme) =>
                  `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.background.paper} 80%)`
              }}
            >
              <Box>
                <Typography variant="overline" color="text.secondary">
                  {t('lines.detail.user')}
                </Typography>
                <Typography variant="h6" sx={{ lineHeight: 1.1 }}>
                  {detail.row?.username || '-'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t('lines.detail.password')}: {detail.row?.password || '-'}
                </Typography>
              </Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <StatusChip enabled={detail.row?.enabled} expired={detail.row?.expired} t={t} />
                {detail.row?.trial ? <Chip size="small" color="info" label={t('lines.status.trial')} /> : null}
              </Stack>
            </Box>

          

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={detailCardSx}>
                  <Stack spacing={0.75}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <BoltIcon color="warning" fontSize="small" />
                      <Typography variant="caption" color="text.secondary">
                        {t('lines.detail.package')}
                      </Typography>
                    </Stack>
                    <Typography variant="subtitle2">{detail.row?.packageName || '-'}</Typography>
                    <Stack spacing={0.5} alignItems="flex-start">
                      <Typography variant="caption" color="text.secondary">
                        ID: {detail.row?.packageId ?? '-'}
                      </Typography>
                      <Chip size="small" label={`${t('lines.detail.type')}: ${detail.row?.type || '-'}`} variant="outlined" />
                    </Stack>
                  </Stack>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={detailCardSx}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <LanIcon color="action" fontSize="small" />
                    <Typography variant="caption" color="text.secondary">
                      {t('lines.headers.max')}
                    </Typography>
                  </Stack>
                  <Typography variant="subtitle2">{detail.row?.maxConnections ?? '-'}</Typography>
                  <Chip size="small" label={`${t('lines.headers.status')}: ${detail.row?.enabledLabel || '-'}`} variant="outlined" />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ ...detailCardSx, minHeight: 120 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <AccessTimeIcon color="action" fontSize="small" />
                    <Typography variant="caption" color="text.secondary">
                      {t('lines.detail.expires')}
                    </Typography>
                  </Stack>
                  <Typography variant="subtitle2">{formatDate(detail.row?.expDate)}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ ...detailCardSx, minHeight: 120 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CalendarMonthIcon color="action" fontSize="small" />
                    <Typography variant="caption" color="text.secondary">
                      {t('lines.detail.created')}
                    </Typography>
                  </Stack>
                  <Typography variant="subtitle2">{formatDate(detail.row?.createdAt)}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t('lines.detail.owner')}: {detail.row?.ownerName || '-'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Box
              sx={{
                ...detailCardSx,
                borderStyle: 'dashed'
              }}
            >
              <Typography variant="caption" color="text.secondary">
                {t('lines.detail.lastStreamLabel')}
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
                  ...detailCardSx,
                  borderStyle: 'dashed',
                  gap: 0.5
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  {t('lines.detail.notes')}
                </Typography>
                <Typography variant="body2">{detail.row.resellerNotes}</Typography>
              </Box>
            ) : null}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setDetail({ open: false, row: null })} variant="outlined">
            {t('lines.detail.close')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
