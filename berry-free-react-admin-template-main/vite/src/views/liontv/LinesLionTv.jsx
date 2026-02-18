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
import Card from '@mui/material/Card';
import Skeleton from '@mui/material/Skeleton';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

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
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { lionTvApi } from 'utils/api';
import SpeedIcon from '@mui/icons-material/Speed';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const detailCardSx = {
  p: 2,
  borderRadius: 2.5,
  border: '1px solid',
  borderColor: 'divider',
  bgcolor: 'background.paper',
  boxShadow: '0 10px 24px rgba(0,0,0,0.08)'
};

const infoCardBase = (theme) => ({
  ...detailCardSx,
  p: 2.25,
  height: '100%',
  display: 'flex',
  alignItems: 'stretch',
  background: `linear-gradient(160deg, ${theme.palette.background.paper} 0%, ${theme.palette.primary.light}08 100%)`
});

const heroCardSx = (theme) => ({
  p: 2.5,
  borderRadius: 3,
  border: '1px solid',
  borderColor: theme.palette.primary.main,
  background: `linear-gradient(135deg, ${theme.palette.primary.light}30 0%, ${theme.palette.secondary.light}18 60%, ${theme.palette.background.paper} 100%)`,
  boxShadow: '0 18px 44px rgba(0,0,0,0.14)',
  display: 'flex',
  gap: 2,
  alignItems: 'center'
});

const pillSx = {
  borderRadius: 999,
  px: 1.5,
  py: 0.25,
  fontWeight: 700,
  letterSpacing: 0.2
};

const glassCard = (theme) => ({
  p: 2.5,
  borderRadius: 3,
  border: '1px solid',
  borderColor: theme.palette.divider,
  boxShadow: '0 16px 42px rgba(0,0,0,0.14)',
  background: theme.palette.mode === 'light'
    ? `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.primary.light}15 60%, #fff 100%)`
    : `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.primary.dark}30 100%)`
});

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [detail, setDetail] = useState({ open: false, row: null });
  const [showPassword, setShowPassword] = useState(false);
  const [visibleRowPassword, setVisibleRowPassword] = useState({});

  const copyCredentials = useCallback(
    (row) => {
      if (!row) return;
      const text = `${row.username || ''}\n${row.password || ''}`;
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(text);
        enqueueSnackbar(t('lines.detail.copied', 'Credenciales copiadas'), { variant: 'success' });
      } else {
        enqueueSnackbar(t('lines.detail.copyFallback', 'No se pudo copiar, inténtalo manualmente'), { variant: 'warning' });
      }
    },
    [enqueueSnackbar, t]
  );

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
        enqueueSnackbar(err?.response?.data?.message || err.message || t('lines.errors.load', 'No se pudieron cargar las líneas.'), {
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
      >
        <Grid container spacing={gridSpacing}>
            {[
              { icon: <SpeedIcon fontSize="small" />, label: t('lines.summary.totalLabel', 'Líneas totales'), value: total, color: 'primary.main' },
              { icon: <CloudDoneIcon fontSize="small" />, label: t('lines.summary.activeLabel', 'Activas'), value: summary.enabled, color: 'success.main' },
              { icon: <ErrorOutlineIcon fontSize="small" />, label: t('lines.summary.expiredLabel', 'Expiradas'), value: summary.expired, color: 'warning.main' }
            ].map((item, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Card
                  sx={(theme) => ({
                    ...glassCard(theme),
                    py: 1.5,
                    px: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    background:
                      theme.palette.mode === 'light'
                        ? `linear-gradient(155deg, ${theme.palette.primary.main}1F 0%, ${theme.palette.secondary.main}20 55%, #ffffff 100%)`
                        : theme.palette.background.paper
                  })}
                >
                <Avatar
                  sx={(theme) => ({
                    width: 40,
                    height: 40,
                    bgcolor: item.color,
                    color: theme.palette.getContrastText(theme.palette.primary.main),
                    fontWeight: 700,
                    boxShadow: 3,
                    border: '2px solid',
                    borderColor: 'background.paper'
                  })}
                >
                  {item.icon}
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    {item.value}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item.label}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </MainCard>

      <MainCard title={null}>
        <Box
          sx={(theme) => ({
            mb: 2,
            p: 2,
            borderRadius: 2.5,
            border: '1px solid',
            borderColor: theme.palette.divider,
            background:
              theme.palette.mode === 'light'
                ? `linear-gradient(135deg, ${theme.palette.primary.light}12 0%, ${theme.palette.secondary.light}10 100%)`
                : theme.palette.background.paper,
            boxShadow: '0 10px 28px rgba(0,0,0,0.08)'
          })}
        >
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems="stretch">
            <TextField
              size="small"
              placeholder={t('lines.search')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
              sx={{ '& .MuiOutlinedInput-root': { minHeight: 46, borderRadius: 2 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                )
              }}
            />
            <FormControl size="small" sx={{ minWidth: isMobile ? '100%' : 200, '& .MuiOutlinedInput-root': { minHeight: 46, borderRadius: 2 } }}>
              <InputLabel>{t('lines.filters.status')}</InputLabel>
              <Select
                value={statusFilter}
                label={t('lines.filters.status')}
                onChange={(e) => setStatusFilter(e.target.value)}
                startAdornment={
                  <InputAdornment position="start" sx={{ pl: 1 }}>
                    <FilterAltOutlinedIcon fontSize="small" color="action" />
                  </InputAdornment>
                }
              >
              <MenuItem value="">
                <em>{t('lines.filters.all')}</em>
              </MenuItem>
              {['ACTIVE', 'EXPIRED', 'INACTIVE'].map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {t(`lines.status.${opt.toLowerCase()}`, opt)}
                </MenuItem>
              ))}
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<RefreshIcon />}
              onClick={() => setRefreshKey((v) => v + 1)}
              sx={{ minWidth: isMobile ? '100%' : 140, borderRadius: 2, textTransform: 'none' }}
            >
              {t('actions.refresh')}
            </Button>
          </Stack>
        </Box>
        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 14px 32px rgba(0,0,0,0.08)' }}>
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
              {loading &&
                Array.from({ length: 4 }).map((_, idx) => (
                  <TableRow key={`skeleton-${idx}`}>
                    {Array.from({ length: 10 }).map((__, cidx) => (
                      <TableCell key={cidx}>
                        <Skeleton variant="text" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              {!loading && paginatedRows.map((row) => (
                <TableRow key={row.id || row.username} hover sx={{ cursor: 'pointer' }} onClick={() => setDetail({ open: true, row })}>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light', color: 'primary.dark' }}>
                        <WifiTetheringIcon fontSize="small" />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2">{row.username}</Typography>
                        <Tooltip title={`${t('lines.detail.password')}: ${visibleRowPassword[row.id || row.username] ? row.password : '••••••'}`}>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <KeyIcon fontSize="inherit" color="action" />
                            <Typography variant="caption" color="text.secondary">
                              {visibleRowPassword[row.id || row.username] ? row.passwordEncode || row.password : '••••••'}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                setVisibleRowPassword((prev) => ({
                                  ...prev,
                                  [row.id || row.username]: !prev[row.id || row.username]
                                }));
                              }}
                            >
                              {visibleRowPassword[row.id || row.username] ? (
                                <VisibilityOffIcon fontSize="inherit" />
                              ) : (
                                <VisibilityIcon fontSize="inherit" />
                              )}
                            </IconButton>
                          </Stack>
                        </Tooltip>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <StatusChip enabled={row.enabled} expired={row.expired} t={t} />
                  </TableCell>
                  <TableCell>
                    <Stack spacing={0.5}>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Avatar sx={{ width: 24, height: 24, bgcolor: 'warning.light', color: 'warning.dark' }}>
                          <BoltIcon fontSize="inherit" />
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {row.packageName || '-'}
                        </Typography>
                      </Stack>
                      <Typography variant="caption" color="text.secondary">
                        {t('common.id', 'ID')}: {row.packageId ?? '-'}
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
                  <TableCell>
                    <Stack direction="row" spacing={0.75} alignItems="center">
                      <PersonOutlineIcon fontSize="small" color="action" />
                      <Typography variant="body2">{row.ownerName || '-'}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack spacing={0.25}>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <PlayCircleOutlineIcon fontSize="small" color="primary" />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {row.lastWatchedName || '-'}
                        </Typography>
                      </Stack>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(row.lastWatchedTime)}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <PublicIcon fontSize="small" color="action" />
                      <Typography variant="body2">{row.lastWatchedIp || '-'}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDetail({ open: true, row });
                      }}
                      aria-label={t('lines.detail.title')}
                      sx={(theme) => ({
                        bgcolor: theme.palette.primary.lighter,
                        color: theme.palette.primary.main,
                        '&:hover': { bgcolor: theme.palette.primary.light }
                      })}
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
        fullWidth
        maxWidth="md"
        fullScreen={isMobile}
        PaperProps={{
          sx: (theme) => ({
            borderRadius: 3,
            boxShadow: '0 18px 40px rgba(0,0,0,0.18)',
            border: '1px solid',
            borderColor: theme.palette.primary.light,
            backgroundImage:
              theme.palette.mode === 'light'
                ? `linear-gradient(150deg, ${theme.palette.primary.light}18 0%, ${theme.palette.secondary.light}08 45%, #ffffff 100%)`
                : undefined
          })
        }}
      >
        <DialogTitle
          sx={(theme) => ({
            pb: 1,
            background: `linear-gradient(135deg, ${theme.palette.primary.light}36 0%, ${theme.palette.secondary.light}26 40%, ${theme.palette.background.paper} 100%)`
          })}
        >
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Avatar
              sx={{
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                width: 40,
                height: 40,
                boxShadow: 3
              }}
            >
              <WifiTetheringIcon fontSize="small" />
            </Avatar>
            <Box>
              <Typography variant="h6">{t('lines.detail.title')}</Typography>
              <Typography variant="caption" color="text.secondary">
                {detail.row?.username || '-'}
              </Typography>
            </Box>
            <Chip
              label={detail.row?.trial ? t('lines.status.trial') : t('lines.status.active')}
              size="small"
              color={detail.row?.trial ? 'info' : 'success'}
              sx={{ ml: 'auto', fontWeight: 700, borderRadius: 1.5 }}
            />
          </Stack>
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            bgcolor: 'background.default',
            px: { xs: 1.5, sm: 3 },
            py: { xs: 1.5, sm: 2 },
            background: (theme) =>
              theme.palette.mode === 'light'
                ? `linear-gradient(180deg, ${theme.palette.primary.light}14 0%, ${theme.palette.secondary.light}10 50%, ${theme.palette.background.paper} 80%)`
                : theme.palette.background.default,
            position: 'relative',
            '&:before': {
              content: '\"\"',
              position: 'absolute',
              inset: 12,
              zIndex: 0,
              borderRadius: 20,
              background:
                'radial-gradient(circle at 20% 20%, rgba(33,150,243,0.10), transparent 45%), radial-gradient(circle at 82% 0%, rgba(156,39,176,0.10), transparent 35%)'
            }
          }}
        >
          <Stack spacing={2.25} sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={(theme) => heroCardSx(theme)}>
              <Avatar
                sx={{
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  width: 52,
                  height: 52,
                  boxShadow: 5
                }}
              >
                <KeyIcon fontSize="medium" />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1 }}>
                  {t('lines.detail.user')}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
                  {detail.row?.username || '-'}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5, flexWrap: 'wrap' }}>
                  <Chip
                    label={`${t('lines.detail.password')}: ${showPassword ? detail.row?.password || '-' : '••••••'}`}
                    size="small"
                    variant="outlined"
                    color="secondary"
                    sx={{ borderRadius: 2 }}
                    icon={
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowPassword((v) => !v);
                        }}
                      >
                        {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                      </IconButton>
                    }
                  />
                  {detail.row?.ownerName ? (
                    <Chip
                      icon={<PersonOutlineIcon fontSize="small" />}
                      label={detail.row.ownerName}
                      size="small"
                      variant="outlined"
                      sx={{ borderRadius: 2 }}
                    />
                  ) : null}
                </Stack>
              </Box>
              <Stack spacing={1} direction="column" alignItems="flex-end" justifyContent="center">
                <Chip
                  label={detail.row?.enabled ? t('lines.status.active') : t('lines.status.inactive')}
                  color={detail.row?.enabled ? 'success' : 'default'}
                  size="small"
                  sx={pillSx}
                />
                {detail.row?.trial ? <Chip size="small" color="info" label={t('lines.status.trial')} sx={pillSx} /> : null}
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<ContentCopyIcon fontSize="small" />}
                  onClick={() => copyCredentials(detail.row)}
                  sx={{ borderRadius: 2, textTransform: 'none' }}
                >
                  {t('lines.detail.copy', 'Copiar')}
                </Button>
              </Stack>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box
                  sx={(theme) => ({
                    ...infoCardBase(theme),
                    background: `linear-gradient(160deg, ${theme.palette.warning.light}22 0%, ${theme.palette.background.paper} 90%)`
                  })}
                >
                  <Stack direction="row" alignItems="center" spacing={1.5} sx={{ width: '100%' }}>
                    <Avatar sx={{ bgcolor: 'warning.light', color: 'warning.dark', width: 36, height: 36 }}>
                      <BoltIcon fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography variant="overline" color="text.secondary">
                        {t('lines.detail.package')}
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                        {detail.row?.packageName || t('lines.detail.noPackage', 'No package')}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5, flexWrap: 'wrap' }}>
                        <Chip size="small" label={`${t('common.id', 'ID')}: ${detail.row?.packageId ?? '-'}`} variant="outlined" />
                        <Chip size="small" label={`${t('lines.detail.type')}: ${detail.row?.type || '-'}`} color="primary" variant="outlined" />
                      </Stack>
                    </Box>
                  </Stack>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box
                  sx={(theme) => ({
                    ...infoCardBase(theme),
                    background: `linear-gradient(160deg, ${theme.palette.success.light}18 0%, ${theme.palette.background.paper} 92%)`
                  })}
                >
                  <Stack direction="row" alignItems="center" spacing={1.5} sx={{ width: '100%' }}>
                    <Avatar sx={{ bgcolor: 'success.light', color: 'success.dark', width: 36, height: 36 }}>
                      <LanIcon fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography variant="overline" color="text.secondary">
                        {t('lines.headers.max')}
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                        {detail.row?.maxConnections ?? '-'}
                      </Typography>
                      <Chip
                        size="small"
                        label={`${t('lines.headers.status')}: ${detail.row?.enabledLabel || '-'}`}
                        variant="outlined"
                        color={detail.row?.enabled ? 'success' : 'default'}
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                  </Stack>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box
                  sx={(theme) => ({
                    ...infoCardBase(theme),
                    background: `linear-gradient(160deg, ${theme.palette.info.light}18 0%, ${theme.palette.background.paper} 92%)`
                  })}
                >
                  <Stack direction="row" alignItems="center" spacing={1.5} sx={{ width: '100%' }}>
                    <Avatar sx={{ bgcolor: 'info.light', color: 'info.dark', width: 36, height: 36 }}>
                      <AccessTimeIcon fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography variant="overline" color="text.secondary">
                        {t('lines.detail.expires')}
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                        {formatDate(detail.row?.expDate)}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box
                  sx={(theme) => ({
                    ...infoCardBase(theme),
                    background: `linear-gradient(160deg, ${theme.palette.secondary.light}18 0%, ${theme.palette.background.paper} 92%)`
                  })}
                >
                  <Stack direction="row" alignItems="center" spacing={1.5} sx={{ width: '100%' }}>
                    <Avatar sx={{ bgcolor: 'secondary.light', color: 'secondary.dark', width: 36, height: 36 }}>
                      <CalendarMonthIcon fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography variant="overline" color="text.secondary">
                        {t('lines.detail.created')}
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                        {formatDate(detail.row?.createdAt)}
                      </Typography>
                      <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mt: 0.25 }}>
                        <PersonOutlineIcon fontSize="inherit" color="action" />
                        <Typography variant="caption" color="text.secondary">
                          {t('lines.detail.owner')}: {detail.row?.ownerName || '-'}
                        </Typography>
                      </Stack>
                    </Box>
                  </Stack>
                </Box>
              </Grid>
            </Grid>

            <Box
              sx={(theme) => ({
                ...detailCardSx,
                borderStyle: 'dashed',
                mt: 2,
                p: 2.25,
                background: `linear-gradient(145deg, ${theme.palette.primary.light}10 0%, ${theme.palette.background.paper} 100%)`
              })}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar sx={{ bgcolor: 'primary.lighter', color: 'primary.dark', width: 36, height: 36 }}>
                  <AccessTimeIcon fontSize="small" />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="overline" color="text.secondary">
                    {t('lines.detail.lastStreamLabel')}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                    {detail.row?.lastWatchedName || t('lines.detail.noStream', 'No recent stream')}
                  </Typography>
                  <Stack direction="row" spacing={1.5} sx={{ mt: 0.5, flexWrap: 'wrap' }}>
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
              </Stack>
            </Box>

            {detail.row?.resellerNotes ? (
              <Box
                sx={{
                  ...detailCardSx,
                  borderStyle: 'dashed',
                  gap: 0.5,
                  mt: 2
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
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setDetail({ open: false, row: null })} variant="outlined" startIcon={<CloseIcon />}>
            {t('lines.detail.close')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
