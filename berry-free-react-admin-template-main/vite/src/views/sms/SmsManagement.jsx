import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import RefreshIcon from '@mui/icons-material/Refresh';
import SendIcon from '@mui/icons-material/Send';
import ClearIcon from '@mui/icons-material/Clear';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import useAuth from 'hooks/useAuth';

import MainCard from 'ui-component/cards/MainCard';
import { smsApi } from 'utils/api';

const statusColors = {
  PENDING: 'warning',
  IN_PROGRESS: 'info',
  WAITING: 'info',
  SENT: 'success',
  FAILED: 'error',
  CANCELLED: 'default'
};

const defaultForm = {
  phoneNumbersText: '',
  messageText: '',
  scheduledAt: '',
  priority: 0,
  sourceSystem: 'SALES_PANEL',
  externalId: ''
};

const BASE_URL = import.meta.env.VITE_APP_BASE_NAME;
const MAX_MESSAGE_LEN = 160;

const statusOptions = ['ALL', 'PENDING','WAITING', 'IN_PROGRESS', 'SENT', 'FAILED', 'CANCELLED'];
const filterFieldSx = {
  '& .MuiInputBase-root': { minHeight: 44 },
  '& .MuiInputLabel-root': { transform: 'translate(14px, 12px) scale(1)' },
  '& .MuiInputLabel-shrink': { transform: 'translate(14px, -6px) scale(0.75)' }
};

function normalizeRow(item = {}) {
  return {
    id: item.id,
    username: item.username ?? item.user_name ?? '',
    phoneNumber: item.phoneNumber ?? item.phone_number ?? '',
    messageText: item.messageText ?? item.message_text ?? '',
    status: (item.status ?? '').toUpperCase(),
    scheduledAt: item.scheduledAt ?? item.scheduled_at ?? null,
    sentAt: item.sentAt ?? item.sent_at ?? null,
    failReason: item.failReason ?? item.fail_reason ?? '',
    retryCount: item.retryCount ?? item.retry_count ?? 0,
    maxRetries: item.maxRetries ?? item.max_retries ?? 0,
    priority: item.priority ?? 0,
    sourceSystem: item.sourceSystem ?? item.source_system ?? '',
    externalId: item.externalId ?? item.external_id ?? '',
    createdAt: item.createdAt ?? item.created_at ?? null,
    updatedAt: item.updatedAt ?? item.updated_at ?? null
  };
}

function parsePhones(text) {
  if (!text) return [];
  return text
    .split(/[\n,; ]+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

function sanitizeMessage(value) {
  if (!value) return '';
  const noDiacritics = value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const asciiOnly = noDiacritics.replace(/[^\x00-\x7F]/g, '');
  return asciiOnly.slice(0, MAX_MESSAGE_LEN);
}

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

function StatusChip({ status }) {
  const color = statusColors[status] || 'default';
  return <Chip size="small" color={color} label={status || '-'} />;
}

export default function SmsManagement() {
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { accessToken } = useAuth();
  const { t } = useTranslation();

  const [form, setForm] = useState(defaultForm);
  const [sending, setSending] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [detailModal, setDetailModal] = useState({ open: false, row: null });

  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [filters, setFilters] = useState({
    search: '',
    status: 'ALL',
    dateFrom: '',
    dateTo: ''
  });

  const parsedPhones = useMemo(() => parsePhones(form.phoneNumbersText), [form.phoneNumbersText]);
  const estimatedCost = useMemo(() => parsedPhones.length * 1, [parsedPhones.length]);

  const loadMessages = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const response = await smsApi.get('/sms/v1/messages', {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: {
          page,
          size: rowsPerPage,
          search: filters.search || undefined,
          status: filters.status === 'ALL' ? undefined : filters.status,
          dateFrom: filters.dateFrom || undefined,
          dateTo: filters.dateTo || undefined
        }
      });
      const payload = response?.data?.data ?? {};
      const collection = payload.data ?? payload.content ?? payload.items ?? [];
      const normalized = collection.map(normalizeRow);

      setRows(normalized);
      setTotal(payload.total ?? payload.totalElements ?? payload.count ?? normalized.length);
    } catch (err) {
      const status = err?.response?.status || err?.request?.status;
      if (status === 401) {
        window.location.replace(BASE_URL + '/pages/login');
        return;
      }
      const message = err?.response?.data?.message || err?.message || 'No se pudo cargar el historial de SMS.';
      enqueueSnackbar(message, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar, page, rowsPerPage, accessToken, filters]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages, refreshKey]);

  const handleFormChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleMessageChange = (event) => {
    const sanitized = sanitizeMessage(event.target.value);
    setForm((prev) => ({ ...prev, messageText: sanitized }));
  };

  const handleReset = () => {
    setForm({ ...defaultForm });
  };

  const handleSend = async () => {
    const phoneNumbers = parsedPhones;
    if (!phoneNumbers.length) {
      enqueueSnackbar(t('messages.enterEmail') || 'Agrega al menos un numero de telefono.', { variant: 'warning' });
      return;
    }
    const sanitizedMessage = sanitizeMessage(form.messageText || '');
    if (!sanitizedMessage.trim()) {
      enqueueSnackbar(t('messages.enterCode') || 'El mensaje no puede estar vacio ni contener acentos/emojis.', { variant: 'warning' });
      return;
    }

    const payload = {
      phoneNumbers,
      messageText: sanitizedMessage.trim(),
      scheduledAt: form.scheduledAt ? new Date(form.scheduledAt).toISOString() : null,
      priority: form.priority === '' ? null : Number(form.priority),
      sourceSystem: form.sourceSystem || undefined,
      externalId: form.externalId || undefined
    };

    setSending(true);
    try {
      const response = await smsApi.post('/sms/v1/enqueue', payload, {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined
      });
      const ids = response?.data?.data ?? [];
      const totalQueued = Array.isArray(ids) ? ids.length : 0;
      enqueueSnackbar(
        totalQueued ? t('sms.chips.ready', { count: totalQueued }) : t('messages.resendOk'),
        { variant: 'success' }
      );
      setRefreshKey((prev) => prev + 1);
      setOpenModal(false);
    } catch (err) {
      const status = err?.response?.status || err?.request?.status;
      if (status === 401) {
        window.location.replace(BASE_URL + '/pages/login');
        return;
      }
      const message = err?.response?.data?.message || err?.message || t('messages.invalidCreds');
      enqueueSnackbar(message, { variant: 'error' });
    } finally {
      setSending(false);
    }
  };

  const handleChangePage = (_event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleFilterChange = (field) => (event) => {
    setFilters((prev) => ({
      ...prev,
      [field]: event.target.value
    }));
    setPage(0);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 1400, mx: 'auto', display: 'flex', flexDirection: 'column', gap: { xs: 2, md: 3 }, pb: 3 }}>
      <MainCard
        title={t('sms.title')}
        secondary={
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip label="Secure" size="small" color="primary" />
            <Button variant="contained" startIcon={<SendIcon />} onClick={() => setOpenModal(true)}>
              {t('sms.enqueue')}
            </Button>
          </Stack>
        }
        contentSX={{ display: 'flex', flexDirection: 'column', gap: 1 }}
      >
        
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <Chip label={t('sms.chips.ready', { count: parsedPhones.length })} size="small" color="secondary" variant="outlined" />
          <Chip label={t('sms.chips.total', { count: total })} size="small" variant="outlined" />
        </Stack>
      </MainCard>

      <MainCard
        title={t('sms.history')}
        secondary={
          <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <Chip label={t('sms.chips.total', { count: total })} size="small" variant="outlined" />
            <Button size="small" variant="outlined" startIcon={<RefreshIcon />} onClick={handleRefresh} disabled={loading}>
              {t('actions.refresh')}
            </Button>
          </Stack>
        }
      >
        <Stack spacing={2}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' },
              gap: 1.5
            }}
          >
            <TextField
              label={t('sms.search')}
              value={filters.search}
              onChange={handleFilterChange('search')}
              size="small"
              InputLabelProps={{ shrink: true }}
              sx={filterFieldSx}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                )
              }}
            />
            <TextField
              label={t('sms.filters.from')}
              type="date"
              InputLabelProps={{ shrink: true }}
              value={filters.dateFrom}
              onChange={handleFilterChange('dateFrom')}
              size="small"
              sx={filterFieldSx}
            />
            <TextField
              label={t('sms.filters.to')}
              type="date"
              InputLabelProps={{ shrink: true }}
              value={filters.dateTo}
              onChange={handleFilterChange('dateTo')}
              size="small"
              sx={filterFieldSx}
            />
            <FormControl size="small" sx={{ ...filterFieldSx }}>
              <InputLabel id="status-filter-label">{t('sms.filters.status')}</InputLabel>
              <Select
                labelId="status-filter-label"
                label={t('sms.filters.status')}
                value={filters.status}
                onChange={handleFilterChange('status')}
              >
                {statusOptions.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt === 'ALL' ? t('sms.filters.all') : opt}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ width: '100%', overflowX: 'auto' }}>
              <TableContainer component={Paper} variant="outlined" sx={{ minWidth: 880 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('sms.headers.phone')}</TableCell>
                      <TableCell>{t('sms.headers.message')}</TableCell>
                      <TableCell>{t('sms.headers.status')}</TableCell>
                      <TableCell>{t('sms.headers.scheduled')}</TableCell>
                      <TableCell align="right">{t('sms.headers.detail')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => (
                      <TableRow key={row.id ?? `${row.phoneNumber}-${row.createdAt}`}>
                        <TableCell>{row.phoneNumber || '-'}</TableCell>
                        <TableCell sx={{ maxWidth: 220 }}>
                          <Tooltip title={row.messageText || ''} placement="top" arrow>
                            <span style={{ display: 'inline-block', maxWidth: 220, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {row.messageText || '-'}
                            </span>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <StatusChip status={row.status} />
                        </TableCell>
                        <TableCell>{formatDate(row.scheduledAt)}</TableCell>
                        <TableCell align="right">
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<InfoOutlinedIcon />}
                            onClick={() => setDetailModal({ open: true, row })}
                          >
                            {t('sms.headers.detail')}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {!loading && rows.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={10} align="center">
                        <Typography variant="body2" color="text.secondary">
                          {t('sms.table.empty')}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                  {loading && (
                    <TableRow>
                      <TableCell colSpan={10} align="center">
                        <Typography variant="body2" color="text.secondary">
                          {t('sms.table.loading')}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Divider />
            <Box display="flex" justifyContent="flex-end">
              <TablePagination
                component="div"
                count={total}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 20, 50]}
            />
          </Box>
        </Stack>
      </MainCard>

      {isMobile && (
        <Stack spacing={1.5}>
          {rows.map((row) => (
            <Paper key={row.id ?? `${row.phoneNumber}-${row.createdAt}`} variant="outlined" sx={{ p: 2 }}>
              <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1">{row.phoneNumber || '-'}</Typography>
                  <StatusChip status={row.status} />
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {row.messageText || '-'}
                </Typography>
                  <Typography variant="caption" color="text.secondary">
                  {t('sms.mobile.scheduled')}: {formatDate(row.scheduledAt)}
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<InfoOutlinedIcon />}
                  onClick={() => setDetailModal({ open: true, row })}
                >
                  {t('sms.mobile.view')}
                </Button>
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}

      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="md">
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {t('sms.enqueue')}
          <IconButton onClick={() => setOpenModal(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
            background: (theme) =>
              theme.palette.mode === 'light'
                ? 'linear-gradient(180deg, rgba(80,108,255,0.06) 0%, rgba(80,108,255,0.02) 45%, transparent 100%)'
                : undefined
          }}
        >
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'flex-start', sm: 'center' }} flexWrap="wrap">
            <Chip label={t('sms.form.chips.numbers', { count: parsedPhones.length })} color="primary" variant="outlined" />
            <Chip label={t('sms.form.chips.chars', { count: form.messageText.length, max: MAX_MESSAGE_LEN })} variant="outlined" />
            <Chip
              label={
                form.scheduledAt
                  ? t('sms.form.chips.scheduled', { value: formatDate(form.scheduledAt) })
                  : t('sms.form.chips.immediate')
              }
              variant="outlined"
            />
            <Chip label={t('sms.form.chips.cost', { cost: estimatedCost })} variant="outlined" />
          </Stack>

          <TextField
            label={t('sms.form.numbers')}
            placeholder={t('sms.form.numbersPlaceholder')}
            minRows={3}
            multiline
            value={form.phoneNumbersText}
            onChange={handleFormChange('phoneNumbersText')}
            helperText={t('sms.form.numbersHelper')}
            fullWidth
          />
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: (theme) => theme.shadows[0]
            }}
          >
            <TextField
              label={t('sms.form.message')}
              placeholder={t('sms.form.messagePlaceholder')}
              minRows={4}
              multiline
              value={form.messageText}
              inputProps={{ maxLength: MAX_MESSAGE_LEN }}
              onChange={handleMessageChange}
              helperText={t('sms.form.messageHelper', { count: form.messageText.length, max: MAX_MESSAGE_LEN })}
              fullWidth
            />
          </Box>
          <Grid container spacing={1.5}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label={t('sms.form.schedule')}
                type="datetime-local"
                InputLabelProps={{ shrink: true }}
                value={form.scheduledAt}
                onChange={handleFormChange('scheduledAt')}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label={t('sms.form.priority')}
                type="number"
                value={form.priority}
                onChange={handleFormChange('priority')}
                helperText={t('sms.form.priorityHelper')}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField label={t('sms.form.externalId')} value={form.externalId} onChange={handleFormChange('externalId')} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField label={t('sms.form.sourceSystem')} value={form.sourceSystem} onChange={handleFormChange('sourceSystem')} fullWidth />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<ClearIcon />}
            onClick={handleReset}
            sx={{ minWidth: 150 }}
          >
            {t('sms.form.actions.clear')}
          </Button>
          <Button
          variant="contained"
          startIcon={<SendIcon />}
          onClick={handleSend}
          disabled={sending}
          sx={{ minWidth: 150 }}
        >
            {sending ? t('sms.form.actions.sending') : t('sms.form.actions.send')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={detailModal.open} onClose={() => setDetailModal({ open: false, row: null })} fullWidth maxWidth="sm">
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {t('sms.detail.title')}
          <IconButton onClick={() => setDetailModal({ open: false, row: null })} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            background: (theme) =>
              theme.palette.mode === 'light'
                ? 'linear-gradient(180deg, rgba(80,108,255,0.08) 0%, rgba(80,108,255,0.02) 40%, transparent 100%)'
                : undefined
          }}
        >
          {detailModal.row ? (
            <Stack spacing={2.5}>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                justifyContent="space-between"
                flexWrap="wrap"
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  boxShadow: (theme) => theme.shadows[1]
                }}
              >
                <Stack spacing={0.5}>
                  <Typography variant="overline" color="text.secondary">
                    {t('sms.detail.phone')}
                  </Typography>
                  <Typography variant="h6">{detailModal.row.phoneNumber || '-'}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('sms.detail.created')}: {formatDate(detailModal.row.createdAt)}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <StatusChip status={detailModal.row.status} />
                  <Chip size="small" label={`${t('sms.detail.priority')} ${detailModal.row.priority ?? '-'}`} variant="outlined" />
                </Stack>
              </Stack>

              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  border: '1px dashed',
                  borderColor: 'divider'
                }}
              >
                <Typography variant="subtitle2" gutterBottom>
                  {t('sms.detail.message')}
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {detailModal.row.messageText || '-'}
                </Typography>
              </Box>

              <Grid container spacing={1.5}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">{t('sms.detail.scheduled')}</Typography>
                  <Typography variant="body2">{formatDate(detailModal.row.scheduledAt)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">{t('sms.detail.sent')}</Typography>
                  <Typography variant="body2">{formatDate(detailModal.row.sentAt)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">{t('sms.detail.externalId')}</Typography>
                  <Typography variant="body2">{detailModal.row.externalId || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">{t('sms.detail.user')}</Typography>
                  <Typography variant="body2">{detailModal.row.username || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">{t('sms.detail.source')}</Typography>
                  <Typography variant="body2">{detailModal.row.sourceSystem || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">{t('sms.detail.retries')}</Typography>
                  <Typography variant="body2">
                    {detailModal.row.retryCount ?? 0} / {detailModal.row.maxRetries ?? '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">{t('sms.detail.failReason')}</Typography>
                  <Typography variant="body2">{detailModal.row.failReason || '-'}</Typography>
                </Grid>
              </Grid>
            </Stack>
          ) : (
            <Typography variant="body2" color="text.secondary">
              {t('sms.detail.none')}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailModal({ open: false, row: null })}>{t('sms.detail.close')}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
