import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Avatar from '@mui/material/Avatar';
import Skeleton from '@mui/material/Skeleton';

import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import CreditScoreOutlinedIcon from '@mui/icons-material/CreditScoreOutlined';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import ApprovalOutlinedIcon from '@mui/icons-material/ApprovalOutlined';

import MainCard from 'ui-component/cards/MainCard';
import DialogTitleWithClose from 'ui-component/dialogs/DialogTitleWithClose';
import ResponsiveMetricGrid from 'ui-component/responsive/ResponsiveMetricGrid';
import { PageErrorState, PageLoadingState } from 'ui-component/feedback/PageState';
import { listAdminCreditRequests, approveAdminCreditRequest } from 'api/liontv-credit-requests-admin';
import { withAlpha } from 'utils/colorUtils';

function formatDateTime(value, locale = 'es-HN') {
  if (!value) return '-';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);
  return parsed.toLocaleString(locale);
}

function toSafeNumber(value) {
  if (value === null || value === undefined || value === '') return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function statusColor(status) {
  const normalized = String(status || '').toUpperCase();
  if (normalized === 'PAID') return 'success';
  if (normalized === 'PENDING') return 'warning';
  if (normalized === 'PARTIAL') return 'info';
  if (normalized === 'CANCELLED') return 'error';
  return 'default';
}

function metricCard(theme, color = 'primary') {
  const palette = theme.palette[color] || theme.palette.primary;
  const main = theme.vars?.palette?.[color]?.main || palette.main;
  const paper = theme.vars?.palette?.surface?.card || theme.palette.background.paper;
  return {
    borderRadius: 3,
    border: '1px solid',
    borderColor: withAlpha(main, theme.palette.mode === 'dark' ? 0.2 : 0.12),
    background:
      theme.palette.mode === 'dark'
        ? `linear-gradient(160deg, ${withAlpha(main, 0.12)} 0%, ${paper} 100%)`
        : `linear-gradient(160deg, ${withAlpha(main, 0.08)} 0%, ${paper} 100%)`,
    boxShadow:
      theme.palette.mode === 'dark'
        ? '0 14px 28px rgba(2,8,23,0.2)'
        : '0 10px 22px rgba(15,23,42,0.06)'
  };
}

function MetricCard({ icon, label, value, helper, color = 'primary' }) {
  const Icon = icon;
  return (
    <Card sx={(theme) => ({ ...metricCard(theme, color), height: '100%' })}>
      <CardContent>
        <Stack spacing={1.2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800, letterSpacing: '0.12em' }}>
              {label}
            </Typography>
            <Avatar
              sx={(theme) => ({
                width: 40,
                height: 40,
                bgcolor: withAlpha(theme.palette[color].main, 0.14),
                color: theme.palette[color].main
              })}
            >
              <Icon fontSize="small" />
            </Avatar>
          </Stack>
          <Typography variant="h4">{value}</Typography>
          <Typography variant="body2" color="text.secondary">
            {helper}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function CreditRequestsLionTv() {
  const { t, i18n } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const locale = String(i18n?.resolvedLanguage || i18n?.language || 'es').toLowerCase().startsWith('en') ? 'en-US' : 'es-HN';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [approvingRow, setApprovingRow] = useState(null);
  const [approveSaving, setApproveSaving] = useState(false);

  const loadRequests = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const payload = await listAdminCreditRequests(
        {
          index: 0,
          size: 5000,
          status: statusFilter || undefined,
          searchText: search.trim() || undefined
        },
        { skipAuthRedirect: true }
      );
      setRows(Array.isArray(payload?.data) ? payload.data : []);
    } catch (err) {
      setError(err?.response?.data?.message || t('creditRequests.errors.load', 'Could not load credit requests.'));
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, t]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const visibleRows = useMemo(
    () => rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [page, rows, rowsPerPage]
  );

  const stats = useMemo(() => {
    const pending = rows.filter((item) => String(item.status || '').toUpperCase() === 'PENDING').length;
    const approved = rows.filter((item) => String(item.status || '').toUpperCase() === 'PAID').length;
    const requestedCredits = rows.reduce((sum, item) => sum + toSafeNumber(item.quantity), 0);
    return {
      total: rows.length,
      pending,
      approved,
      requestedCredits
    };
  }, [rows]);

  const handleApprove = useCallback(async () => {
    if (!approvingRow?.id) return;
    setApproveSaving(true);
    try {
      await approveAdminCreditRequest(approvingRow.id, { skipAuthRedirect: true });
      enqueueSnackbar(
        t('creditRequests.messages.approved', {
          credits: toSafeNumber(approvingRow.quantity),
          username: approvingRow.username || '-',
          defaultValue: '{{credits}} credits were approved and credited to {{username}}.'
        }),
        { variant: 'success' }
      );
      setApprovingRow(null);
      await loadRequests();
    } catch (err) {
      enqueueSnackbar(err?.response?.data?.message || t('creditRequests.errors.approve', 'Could not approve this credit request.'), {
        variant: 'error'
      });
    } finally {
      setApproveSaving(false);
    }
  }, [approvingRow, enqueueSnackbar, loadRequests, t]);

  if (loading && !rows.length && !error) {
    return (
      <PageLoadingState
        title={t('menu.creditRequests', 'Credit Requests')}
        description={t('creditRequests.loading', 'Loading reseller credit requests...')}
      />
    );
  }

  if (error && !rows.length) {
    return <PageErrorState title={t('menu.creditRequests', 'Credit Requests')} description={error} onRetry={loadRequests} />;
  }

  return (
    <Stack spacing={2.5}>
      <MainCard
        title={t('menu.creditRequests', 'Credit Requests')}
        secondary={
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadRequests}
            sx={{ textTransform: 'none', fontWeight: 700 }}
          >
            {t('actions.refresh', 'Refresh')}
          </Button>
        }
      >
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {t(
            'creditRequests.subtitle',
            'Approve reseller credit requests from one screen and automatically credit the wallet of the reseller who created the request.'
          )}
        </Typography>

        <ResponsiveMetricGrid columns={{ xs: 1, sm: 2, xl: 4 }}>
          <MetricCard
            icon={CreditScoreOutlinedIcon}
            label={t('creditRequests.kpi.total', 'Visible requests')}
            value={stats.total}
            helper={t('creditRequests.kpi.totalHelper', 'Requests that match the current admin filters.')}
            color="primary"
          />
          <MetricCard
            icon={PendingActionsIcon}
            label={t('creditRequests.kpi.pending', 'Pending')}
            value={stats.pending}
            helper={t('creditRequests.kpi.pendingHelper', 'Requests still waiting for approval.')}
            color="warning"
          />
          <MetricCard
            icon={TaskAltOutlinedIcon}
            label={t('creditRequests.kpi.approved', 'Approved')}
            value={stats.approved}
            helper={t('creditRequests.kpi.approvedHelper', 'Requests already credited to reseller wallets.')}
            color="success"
          />
          <MetricCard
            icon={AccountBalanceWalletOutlinedIcon}
            label={t('creditRequests.kpi.credits', 'Credits requested')}
            value={stats.requestedCredits}
            helper={t('creditRequests.kpi.creditsHelper', 'Total credits represented by the visible requests.')}
            color="info"
          />
        </ResponsiveMetricGrid>
      </MainCard>

      <MainCard>
        <Stack spacing={2}>
          <Stack direction={{ xs: 'column', lg: 'row' }} spacing={1.2}>
            <TextField
              fullWidth
              size="small"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(0);
              }}
              placeholder={t('creditRequests.filters.search', 'Search by reseller, code, note or request name')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                )
              }}
            />
            <FormControl size="small" sx={{ minWidth: { xs: '100%', lg: 220 } }}>
              <InputLabel>{t('creditRequests.filters.status', 'Status')}</InputLabel>
              <Select
                value={statusFilter}
                label={t('creditRequests.filters.status', 'Status')}
                onChange={(event) => {
                  setStatusFilter(event.target.value);
                  setPage(0);
                }}
              >
                <MenuItem value="">{t('creditRequests.filters.allStatuses', 'All statuses')}</MenuItem>
                <MenuItem value="PENDING">{t('creditRequests.status.pending', 'Pending')}</MenuItem>
                <MenuItem value="PAID">{t('creditRequests.status.paid', 'Approved')}</MenuItem>
                <MenuItem value="CANCELLED">{t('creditRequests.status.cancelled', 'Cancelled')}</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          <Alert severity="info">
            {t(
              'creditRequests.helper',
              'Approving a request marks it as paid and credits the wallet of the reseller who created it. Approval is idempotent and will not duplicate credits.'
            )}
          </Alert>

          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t('creditRequests.headers.request', 'Request')}</TableCell>
                  <TableCell>{t('creditRequests.headers.reseller', 'Reseller')}</TableCell>
                  <TableCell>{t('creditRequests.headers.credits', 'Credits')}</TableCell>
                  <TableCell>{t('creditRequests.headers.created', 'Created')}</TableCell>
                  <TableCell>{t('creditRequests.headers.status', 'Status')}</TableCell>
                  {!isMobile ? <TableCell>{t('creditRequests.headers.notes', 'Notes')}</TableCell> : null}
                  <TableCell align="right">{t('creditRequests.headers.actions', 'Actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  Array.from({ length: 6 }).map((_, idx) => (
                    <TableRow key={`credit-req-skel-${idx}`}>
                      <TableCell colSpan={isMobile ? 6 : 7}>
                        <Skeleton variant="rounded" height={42} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : visibleRows.length ? (
                  visibleRows.map((row) => {
                    const status = String(row.status || '').toUpperCase();
                    const canApprove = status === 'PENDING' || status === 'PARTIAL';
                    return (
                      <TableRow hover key={row.id}>
                        <TableCell>
                          <Stack spacing={0.25}>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                              {row.itemName || t('creditRequests.labels.fallbackName', 'Credit request')}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              #{row.id} · {row.purchaseCode || '-'}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Stack spacing={0.25}>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                              {row.username || '-'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {row.providerName || 'LION_TV_PLATFORM'}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Chip size="small" color="primary" variant="outlined" label={`${toSafeNumber(row.quantity)} cr`} />
                        </TableCell>
                        <TableCell>{formatDateTime(row.createdAt || row.purchaseDate, locale)}</TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            color={statusColor(status)}
                            label={
                              status === 'PAID'
                                ? t('creditRequests.status.paid', 'Approved')
                                : status === 'PENDING'
                                  ? t('creditRequests.status.pending', 'Pending')
                                  : status === 'CANCELLED'
                                    ? t('creditRequests.status.cancelled', 'Cancelled')
                                    : status || '-'
                            }
                          />
                        </TableCell>
                        {!isMobile ? <TableCell>{row.notes || '-'}</TableCell> : null}
                        <TableCell align="right">
                          {canApprove ? (
                            <Button
                              size="small"
                              variant="contained"
                              startIcon={<ApprovalOutlinedIcon />}
                              onClick={() => setApprovingRow(row)}
                              sx={{ textTransform: 'none', fontWeight: 700 }}
                            >
                              {t('creditRequests.actions.approve', 'Approve')}
                            </Button>
                          ) : (
                            <Typography variant="caption" color="text.secondary">
                              {status === 'PAID'
                                ? t('creditRequests.labels.alreadyApproved', 'Already approved')
                                : t('creditRequests.labels.noAction', 'No action')}
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={isMobile ? 6 : 7} sx={{ py: 5 }}>
                      <Stack spacing={1} alignItems="center">
                        <Avatar
                          sx={(theme) => ({
                            bgcolor: withAlpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.22 : 0.12),
                            color: theme.palette.primary.main
                          })}
                        >
                          <CreditScoreOutlinedIcon />
                        </Avatar>
                        <Typography variant="subtitle1">{t('creditRequests.empty.title', 'No credit requests found')}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {t('creditRequests.empty.description', 'Try another status or wait for new reseller requests.')}
                        </Typography>
                      </Stack>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Divider />

          <TablePagination
            component="div"
            count={rows.length}
            page={page}
            onPageChange={(_, nextPage) => setPage(nextPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(Number(event.target.value));
              setPage(0);
            }}
            rowsPerPageOptions={[10, 25, 50]}
          />
        </Stack>
      </MainCard>

      <Dialog open={Boolean(approvingRow)} onClose={() => !approveSaving && setApprovingRow(null)} fullWidth maxWidth="sm">
        <DialogTitleWithClose onClose={() => !approveSaving && setApprovingRow(null)}>
          {t('creditRequests.dialog.title', 'Approve credit request')}
        </DialogTitleWithClose>
        <DialogContent>
          {!approvingRow ? null : (
            <Stack spacing={1.5} sx={{ pt: 1 }}>
              <Alert severity="warning">
                {t(
                  'creditRequests.dialog.helper',
                  'This action will mark the request as approved and credit the reseller wallet automatically.'
                )}
              </Alert>
              <Card variant="outlined">
                <CardContent>
                  <Stack spacing={0.75}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                      {approvingRow.itemName || t('creditRequests.labels.fallbackName', 'Credit request')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('creditRequests.dialog.reseller', {
                        username: approvingRow.username || '-',
                        defaultValue: 'Reseller: {{username}}'
                      })}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('creditRequests.dialog.credits', {
                        credits: toSafeNumber(approvingRow.quantity),
                        defaultValue: 'Credits: {{credits}}'
                      })}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('creditRequests.dialog.requestCode', {
                        code: approvingRow.purchaseCode || '-',
                        defaultValue: 'Request code: {{code}}'
                      })}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('creditRequests.dialog.notes', {
                        notes: approvingRow.notes || '-',
                        defaultValue: 'Notes: {{notes}}'
                      })}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApprovingRow(null)} disabled={approveSaving}>
            {t('actions.cancel', 'Cancel')}
          </Button>
          <Button variant="contained" onClick={handleApprove} disabled={approveSaving}>
            {approveSaving ? t('creditRequests.actions.approving', 'Approving...') : t('creditRequests.actions.confirmApprove', 'Approve and credit')}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
