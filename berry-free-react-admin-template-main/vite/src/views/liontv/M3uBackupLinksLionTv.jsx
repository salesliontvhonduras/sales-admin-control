import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import useAuth from 'hooks/useAuth';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import LinkIcon from '@mui/icons-material/Link';
import RefreshIcon from '@mui/icons-material/Refresh';
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet';
import SyncIcon from '@mui/icons-material/Sync';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

import {
  buildClientAliasDeliveryUrl,
  deleteClientAlias,
  listClientAliases,
  updateClientAliasStatus
} from 'api/m3u-catalog';
import LionMetricCard from 'ui-component/cards/LionMetricCard';
import MainCard from 'ui-component/cards/MainCard';
import DialogTitleWithClose from 'ui-component/dialogs/DialogTitleWithClose';
import MobileFieldGrid from 'ui-component/responsive/MobileFieldGrid';
import MobileSummaryCard from 'ui-component/responsive/MobileSummaryCard';
import ResponsiveActionBar from 'ui-component/responsive/ResponsiveActionBar';
import ResponsiveFilters from 'ui-component/responsive/ResponsiveFilters';
import ResponsiveListSection from 'ui-component/responsive/ResponsiveListSection';
import ResponsiveMetricGrid from 'ui-component/responsive/ResponsiveMetricGrid';
import M3uBackupAliasDialog from './M3uBackupAliasDialog';

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString();
}

function extractErrorMessage(error, fallback) {
  return error?.response?.data?.message || error?.message || fallback;
}

export default function M3uBackupLinksLionTv() {
  const { accessToken } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dialog, setDialog] = useState({ open: false, line: null, lockLine: false });
  const [deleteState, setDeleteState] = useState({ open: false, row: null });
  const [actionLoading, setActionLoading] = useState(false);

  const loadAliases = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const items = await listClientAliases({ accessToken });
      setRows(items);
    } catch (error) {
      enqueueSnackbar(extractErrorMessage(error, t('m3uBackup.errors.loadList', 'Could not load backup aliases.')), { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [accessToken, enqueueSnackbar, t]);

  useEffect(() => {
    loadAliases();
  }, [loadAliases]);

  const filteredRows = useMemo(() => {
    const term = String(search || '').trim().toLowerCase();
    return rows.filter((item) => {
      if (statusFilter === 'ACTIVE' && !item.active) return false;
      if (statusFilter === 'INACTIVE' && item.active) return false;
      if (!term) return true;
      return (
        String(item.aliasUsername || '').toLowerCase().includes(term) ||
        String(item.lineId || '').toLowerCase().includes(term) ||
        String(item.lastError || '').toLowerCase().includes(term)
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

  const metrics = useMemo(() => {
    return rows.reduce(
      (acc, item) => {
        acc.total += 1;
        if (item.active) acc.active += 1;
        if (item.lastServedAt) acc.served += 1;
        if (item.lastError) acc.errors += 1;
        return acc;
      },
      { total: 0, active: 0, served: 0, errors: 0 }
    );
  }, [rows]);

  const handleCopyLink = async (row) => {
    const link = buildClientAliasDeliveryUrl({
      aliasUsername: row.aliasUsername,
      aliasPasswordPlain: row.aliasPasswordPlain
    });
    await navigator.clipboard.writeText(link);
    enqueueSnackbar(t('m3uBackup.messages.linkCopied', 'Backup link copied.'), { variant: 'success' });
  };

  const handleToggleStatus = async (row) => {
    setActionLoading(true);
    try {
      await updateClientAliasStatus({ accessToken, id: row.id, active: !row.active });
      enqueueSnackbar(t('m3uBackup.messages.statusUpdated', 'Backup alias status updated.'), { variant: 'success' });
      await loadAliases();
    } catch (error) {
      enqueueSnackbar(extractErrorMessage(error, t('m3uBackup.errors.status', 'Could not update the alias status.')), { variant: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteState.row?.id) {
      setDeleteState({ open: false, row: null });
      return;
    }
    setActionLoading(true);
    try {
      await deleteClientAlias({ accessToken, id: deleteState.row.id });
      enqueueSnackbar(t('m3uBackup.messages.deleted', 'Backup alias deleted.'), { variant: 'success' });
      setDeleteState({ open: false, row: null });
      await loadAliases();
    } catch (error) {
      enqueueSnackbar(extractErrorMessage(error, t('m3uBackup.errors.delete', 'Could not delete the backup alias.')), { variant: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 1400, mx: 'auto' }}>
      <MainCard
        title={t('m3uBackup.pageTitle', 'M3U Backup Links')}
        secondary={
          <ResponsiveActionBar>
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={loadAliases}>
              {t('actions.refresh', 'Refresh')}
            </Button>
            <Button
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
              onClick={() => setDialog({ open: true, line: null, lockLine: false })}
              fullWidth={isMobile}
            >
              {t('m3uBackup.new', 'New backup link')}
            </Button>
          </ResponsiveActionBar>
        }
      >
        <Stack spacing={2}>
          <Alert severity="info">
            {t(
              'm3uBackup.pageHelper',
              'Use this module to bind friendly alias credentials to active real lines. The delivered playlist always comes from the original line source.'
            )}
          </Alert>

          <ResponsiveMetricGrid columns={{ xs: 1, md: 2, lg: 4 }}>
            <LionMetricCard title={t('m3uBackup.metrics.total', 'Backup aliases')} value={metrics.total} helper={t('m3uBackup.metrics.totalHelper', 'Configured aliases')} icon={<LinkIcon fontSize="small" />} color="primary" />
            <LionMetricCard title={t('m3uBackup.metrics.active', 'Active aliases')} value={metrics.active} helper={t('m3uBackup.metrics.activeHelper', 'Ready for delivery')} icon={<SettingsEthernetIcon fontSize="small" />} color="success" />
            <LionMetricCard title={t('m3uBackup.metrics.served', 'Aliases used')} value={metrics.served} helper={t('m3uBackup.metrics.servedHelper', 'Delivered at least once')} icon={<SyncIcon fontSize="small" />} color="info" />
            <LionMetricCard title={t('m3uBackup.metrics.errors', 'With last error')} value={metrics.errors} helper={t('m3uBackup.metrics.errorsHelper', 'Require review')} icon={<WarningAmberIcon fontSize="small" />} color="warning" />
          </ResponsiveMetricGrid>
        </Stack>
      </MainCard>

      <MainCard title={null}>
        <ResponsiveFilters paperSx={{ mb: 2 }}>
          <TextField
            fullWidth
            size="small"
            label={t('common.search', 'Search')}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t('m3uBackup.searchPlaceholder', 'Alias username, lineId or last error')}
          />
          <TextField
            select
            size="small"
            label={t('common.status', 'Status')}
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            sx={{ minWidth: { xs: '100%', sm: 200 } }}
          >
            <MenuItem value="">{t('common.all', 'All')}</MenuItem>
            <MenuItem value="ACTIVE">{t('m3uBackup.status.active', 'Active')}</MenuItem>
            <MenuItem value="INACTIVE">{t('m3uBackup.status.inactive', 'Inactive')}</MenuItem>
          </TextField>
        </ResponsiveFilters>

        <ResponsiveListSection
          isMobile={isMobile}
          mobileContent={
            <Stack spacing={1.5}>
              {paginatedRows.map((row) => (
                <MobileSummaryCard
                  key={row.id || row.aliasUsername}
                  icon={<Chip size="small" color={row.active ? 'success' : 'default'} label={row.active ? t('m3uBackup.status.active', 'Active') : t('m3uBackup.status.inactive', 'Inactive')} />}
                  title={row.aliasUsername}
                  subtitle={`${t('m3uBackup.line', 'Line')}: ${row.lineId}`}
                  chips={[
                    <Chip key="status" size="small" color={row.active ? 'success' : 'default'} label={row.active ? t('m3uBackup.status.active', 'Active') : t('m3uBackup.status.inactive', 'Inactive')} />,
                    row.lastError ? <Chip key="error" size="small" color="warning" variant="outlined" label={t('m3uBackup.lastError', 'Last error')} /> : null
                  ].filter(Boolean)}
                  actions={
                    <ResponsiveActionBar>
                      <Button size="small" variant="outlined" startIcon={<ContentCopyIcon />} onClick={() => handleCopyLink(row)}>
                        {t('m3uBackup.copyLink', 'Copy link')}
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => setDialog({ open: true, line: { lineId: row.lineId, usernameEncode: row.lineId }, lockLine: true })}
                      >
                        {t('actions.edit', 'Edit')}
                      </Button>
                      <Button size="small" variant="contained" color="secondary" onClick={() => handleToggleStatus(row)} disabled={actionLoading}>
                        {row.active ? t('m3uBackup.disable', 'Disable') : t('m3uBackup.enable', 'Enable')}
                      </Button>
                      <Button size="small" color="error" onClick={() => setDeleteState({ open: true, row })}>
                        {t('actions.delete', 'Delete')}
                      </Button>
                    </ResponsiveActionBar>
                  }
                >
                  <MobileFieldGrid
                    fields={[
                      { label: t('m3uBackup.aliasPassword', 'Alias password'), value: row.aliasPasswordPlain || '-' },
                      { label: t('m3uBackup.lastServedAt', 'Last served'), value: formatDate(row.lastServedAt) },
                      { label: t('m3uBackup.updatedAt', 'Updated'), value: formatDate(row.updatedAt) }
                    ]}
                  />
                  {row.lastError ? (
                    <Alert severity="warning" sx={{ mt: 1 }}>
                      {row.lastError}
                    </Alert>
                  ) : null}
                </MobileSummaryCard>
              ))}
              {!loading && paginatedRows.length === 0 ? <Alert severity="info">{t('m3uBackup.empty', 'No backup aliases configured yet.')}</Alert> : null}
            </Stack>
          }
          desktopContent={
            <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
              <Table size="small" sx={{ minWidth: 980 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('m3uBackup.aliasUsername', 'Alias username')}</TableCell>
                    <TableCell>{t('m3uBackup.line', 'Line')}</TableCell>
                    <TableCell>{t('m3uBackup.aliasPassword', 'Alias password')}</TableCell>
                    <TableCell>{t('common.status', 'Status')}</TableCell>
                    <TableCell>{t('m3uBackup.lastServedAt', 'Last served')}</TableCell>
                    <TableCell>{t('m3uBackup.updatedAt', 'Updated')}</TableCell>
                    <TableCell>{t('m3uBackup.lastError', 'Last error')}</TableCell>
                    <TableCell align="right">{t('actions.actions', 'Actions')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedRows.map((row) => (
                    <TableRow key={row.id || row.aliasUsername} hover>
                      <TableCell>
                        <Typography variant="subtitle2">{row.aliasUsername}</Typography>
                      </TableCell>
                      <TableCell>{row.lineId}</TableCell>
                      <TableCell>{row.aliasPasswordPlain || '-'}</TableCell>
                      <TableCell>
                        <Chip size="small" color={row.active ? 'success' : 'default'} label={row.active ? t('m3uBackup.status.active', 'Active') : t('m3uBackup.status.inactive', 'Inactive')} />
                      </TableCell>
                      <TableCell>{formatDate(row.lastServedAt)}</TableCell>
                      <TableCell>{formatDate(row.updatedAt)}</TableCell>
                      <TableCell>
                        <Typography variant="body2" color={row.lastError ? 'warning.main' : 'text.secondary'} sx={{ maxWidth: 220, whiteSpace: 'normal' }}>
                          {row.lastError || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <ResponsiveActionBar spacing={0.75}>
                          <Button size="small" variant="outlined" startIcon={<ContentCopyIcon />} onClick={() => handleCopyLink(row)}>
                            {t('m3uBackup.copyLink', 'Copy link')}
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => setDialog({ open: true, line: { lineId: row.lineId, usernameEncode: row.lineId }, lockLine: true })}
                          >
                            {t('actions.edit', 'Edit')}
                          </Button>
                          <Button size="small" variant="contained" color="secondary" onClick={() => handleToggleStatus(row)} disabled={actionLoading}>
                            {row.active ? t('m3uBackup.disable', 'Disable') : t('m3uBackup.enable', 'Enable')}
                          </Button>
                          <Button size="small" color="error" onClick={() => setDeleteState({ open: true, row })}>
                            {t('actions.delete', 'Delete')}
                          </Button>
                        </ResponsiveActionBar>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!loading && paginatedRows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8}>
                        <Alert severity="info">{t('m3uBackup.empty', 'No backup aliases configured yet.')}</Alert>
                      </TableCell>
                    </TableRow>
                  ) : null}
                </TableBody>
              </Table>
            </TableContainer>
          }
          pagination={
            <TablePagination
              component="div"
              count={filteredRows.length}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setPage(0);
              }}
            />
          }
        />
      </MainCard>

      <M3uBackupAliasDialog
        open={dialog.open}
        line={dialog.line}
        lockLine={dialog.lockLine}
        onClose={() => setDialog({ open: false, line: null, lockLine: false })}
        onSaved={loadAliases}
      />

      <Dialog open={deleteState.open} onClose={() => setDeleteState({ open: false, row: null })} maxWidth="xs" fullWidth>
        <DialogTitleWithClose onClose={() => setDeleteState({ open: false, row: null })}>
          {t('m3uBackup.deleteTitle', 'Delete backup alias')}
        </DialogTitleWithClose>
        <DialogContent dividers>
          <Typography>
            {t('m3uBackup.deleteBody', 'Delete backup alias {{alias}}?', { alias: deleteState.row?.aliasUsername || '-' })}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteState({ open: false, row: null })}>{t('actions.cancel', 'Cancel')}</Button>
          <Button color="error" variant="contained" onClick={handleDelete} disabled={actionLoading}>
            {actionLoading ? t('actions.deleting', 'Deleting...') : t('actions.delete', 'Delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
