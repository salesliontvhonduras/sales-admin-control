import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import useAuth from 'hooks/useAuth';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

import CardGiftcardRoundedIcon from '@mui/icons-material/CardGiftcardRounded';
import LoyaltyRoundedIcon from '@mui/icons-material/LoyaltyRounded';
import RefreshIcon from '@mui/icons-material/Refresh';
import SavingsRoundedIcon from '@mui/icons-material/SavingsRounded';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';

import MainCard from 'ui-component/cards/MainCard';
import LionMetricCard from 'ui-component/cards/LionMetricCard';
import DialogTitleWithClose from 'ui-component/dialogs/DialogTitleWithClose';
import ResponsiveActionBar from 'ui-component/responsive/ResponsiveActionBar';
import ResponsiveMetricGrid from 'ui-component/responsive/ResponsiveMetricGrid';
import {
  adjustLoyaltyPoints,
  getLoyaltyConfig,
  listLoyaltyCustomers,
  listLoyaltyLedger,
  updateLoyaltyConfig
} from 'api/liontv-engagement';
import { hasPermissionExact } from 'utils/rbac';

const fieldSx = {
  '& .MuiInputBase-root': { borderRadius: 2, minHeight: 46 }
};

function emptyConfig() {
  return {
    active: false,
    pointsPerUnit: 1,
    amountUnit: 10,
    roundingMode: 'FLOOR',
    effectiveFrom: '',
    notes: ''
  };
}

function formatDateTime(value) {
  if (!value) return '-';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString('es-HN');
}

function formatLoyaltyMovementType(value, t) {
  const normalized = String(value || '').trim().toUpperCase();
  if (!normalized) return '-';
  return t(`loyalty.movementTypes.${normalized}`, { defaultValue: normalized.replaceAll('_', ' ') });
}

function getAvailablePoints(row) {
  const points = Number(row?.availablePoints ?? 0);
  return Number.isFinite(points) ? points : 0;
}

function isIntegerInput(value) {
  return /^-?\d+$/.test(String(value ?? '').trim());
}

export default function LoyaltyLionTv() {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const { user } = useAuth();
  const canAdjust = hasPermissionExact(user, {
    any: ['LIONTV_LOYALTY_ADJUST', 'ROLE_LIONTV_LOYALTY_ADJUST', 'ADMIN', 'ROLE_ADMIN']
  });

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({ search: '', status: '', minimumPoints: '' });
  const [config, setConfig] = useState(emptyConfig());
  const [configOpen, setConfigOpen] = useState(false);
  const [ledgerDialog, setLedgerDialog] = useState({ open: false, row: null, data: [], total: 0 });
  const [adjustDialog, setAdjustDialog] = useState({ open: false, row: null, pointsDelta: '', reason: '' });

  const customerStatusLabel = useCallback((value) => {
    if (!value) return '-';
    return t(`customers.status.${value}`, { defaultValue: value });
  }, [t]);

  const channelLabel = useCallback((value) => {
    const normalized = String(value ?? '').trim().toLowerCase();
    if (normalized === 'red social') return t('customers.channels.social');
    if (normalized === 'google') return t('customers.channels.google');
    if (normalized === 'familiares') return t('customers.channels.family');
    if (normalized === 'amigos') return t('customers.channels.friends');
    return value || '-';
  }, [t]);

  const loadConfig = useCallback(async () => {
    try {
      const response = await getLoyaltyConfig();
      setConfig({
        ...(response || emptyConfig()),
        effectiveFrom: response?.effectiveFrom ? String(response.effectiveFrom).slice(0, 16) : ''
      });
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || error.message || t('loyalty.messages.loadConfigError'), {
        variant: 'error'
      });
    }
  }, [enqueueSnackbar, t]);

  const loadRows = useCallback(async () => {
    setLoading(true);
    try {
      const response = await listLoyaltyCustomers({
        index: page,
        size: rowsPerPage,
        search: filters.search || undefined,
        status: filters.status || undefined,
        minimumPoints: filters.minimumPoints || undefined
      });
      setRows(response?.data || []);
      setTotal(response?.total || 0);
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || error.message || t('loyalty.messages.loadModuleError'), {
        variant: 'error'
      });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar, filters.minimumPoints, filters.search, filters.status, page, rowsPerPage, t]);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  useEffect(() => {
    loadRows();
  }, [loadRows]);

  const metrics = useMemo(() => {
    const customersWithPoints = rows.filter((row) => Number(row.availablePoints || 0) > 0).length;
    const totalPoints = rows.reduce((acc, row) => acc + Number(row.availablePoints || 0), 0);
    return { customersWithPoints, totalPoints };
  }, [rows]);

  const adjustmentRaw = String(adjustDialog.pointsDelta ?? '').trim();
  const adjustmentDelta = Number(adjustmentRaw);
  const hasAdjustmentDelta = adjustmentRaw !== '';
  const adjustmentDeltaIsInteger =
    hasAdjustmentDelta && isIntegerInput(adjustmentRaw) && Number.isFinite(adjustmentDelta) && Number.isSafeInteger(adjustmentDelta);
  const currentAdjustmentBalance = getAvailablePoints(adjustDialog.row);
  const resultingAdjustmentBalance = adjustmentDeltaIsInteger ? currentAdjustmentBalance + adjustmentDelta : currentAdjustmentBalance;
  const adjustmentWouldBeNegative = adjustmentDeltaIsInteger && resultingAdjustmentBalance < 0;
  const adjustmentReason = String(adjustDialog.reason ?? '').trim();
  const adjustmentCanSubmit =
    canAdjust &&
    !saving &&
    adjustmentDeltaIsInteger &&
    adjustmentDelta !== 0 &&
    !adjustmentWouldBeNegative &&
    Boolean(adjustmentReason);
  const adjustmentPointsHelperText =
    hasAdjustmentDelta && (!adjustmentDeltaIsInteger || adjustmentDelta === 0)
      ? t('loyalty.messages.invalidAdjustmentDelta')
      : adjustmentWouldBeNegative
        ? t('loyalty.messages.adjustmentWouldBeNegative')
        : t('loyalty.dialogs.adjustHelper');

  const handleOpenLedger = async (row) => {
    try {
      const response = await listLoyaltyLedger(row.customerId, { index: 0, size: 20 });
      setLedgerDialog({ open: true, row, data: response?.data || [], total: response?.total || 0 });
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || error.message || t('loyalty.messages.loadLedgerError'), { variant: 'error' });
    }
  };

  const handleSaveConfig = async () => {
    setSaving(true);
    try {
      await updateLoyaltyConfig({
        ...config,
        effectiveFrom: config.effectiveFrom ? new Date(config.effectiveFrom).toISOString() : null
      });
      enqueueSnackbar(t('loyalty.messages.configUpdated'), { variant: 'success' });
      setConfigOpen(false);
      await Promise.all([loadConfig(), loadRows()]);
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || error.message || t('loyalty.messages.saveConfigError'), { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleAdjustPoints = async () => {
    if (!adjustDialog.row?.customerId) return;
    if (!canAdjust) {
      enqueueSnackbar(t('loyalty.messages.adjustmentForbidden'), { variant: 'error' });
      return;
    }

    const pointsDelta = Number(String(adjustDialog.pointsDelta ?? '').trim());
    const reason = String(adjustDialog.reason ?? '').trim();
    if (!isIntegerInput(adjustDialog.pointsDelta) || !Number.isFinite(pointsDelta) || !Number.isSafeInteger(pointsDelta) || pointsDelta === 0) {
      enqueueSnackbar(t('loyalty.messages.invalidAdjustmentDelta'), { variant: 'warning' });
      return;
    }
    if (!reason) {
      enqueueSnackbar(t('loyalty.messages.adjustmentReasonRequired'), { variant: 'warning' });
      return;
    }
    if (getAvailablePoints(adjustDialog.row) + pointsDelta < 0) {
      enqueueSnackbar(t('loyalty.messages.adjustmentWouldBeNegative'), { variant: 'warning' });
      return;
    }

    setSaving(true);
    try {
      await adjustLoyaltyPoints(adjustDialog.row.customerId, {
        pointsDelta,
        reason
      });
      enqueueSnackbar(t('loyalty.messages.adjustmentApplied'), { variant: 'success' });
      setAdjustDialog({ open: false, row: null, pointsDelta: '', reason: '' });
      await loadRows();
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || error.message || t('loyalty.messages.adjustmentError'), { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 1500, mx: 'auto' }}>
      <MainCard
        title={t('loyalty.title')}
        secondary={
          <ResponsiveActionBar>
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={loadRows} disabled={loading || saving}>
              {t('actions.refresh')}
            </Button>
            <Button variant="contained" startIcon={<TuneRoundedIcon />} onClick={() => setConfigOpen(true)} disabled={saving}>
              {t('loyalty.actions.config')}
            </Button>
          </ResponsiveActionBar>
        }
      >
        <Stack spacing={2.5}>
          <Alert severity={config.active ? 'success' : 'warning'}>
            {config.active
              ? t('loyalty.alerts.active', {
                  date: config.effectiveFrom ? formatDateTime(config.effectiveFrom) : t('loyalty.alerts.noDate')
                })
              : t('loyalty.alerts.inactive')}
          </Alert>

          <ResponsiveMetricGrid columns={{ xs: 1, sm: 2, lg: 4 }}>
            <LionMetricCard
              title={t('loyalty.metrics.listedCustomers')}
              value={total}
              helper={t('loyalty.metrics.listedCustomersHelper')}
              color="primary"
              icon={<LoyaltyRoundedIcon />}
            />
            <LionMetricCard
              title={t('loyalty.metrics.customersWithPoints')}
              value={metrics.customersWithPoints}
              helper={t('loyalty.metrics.customersWithPointsHelper')}
              color="success"
              icon={<CardGiftcardRoundedIcon />}
            />
            <LionMetricCard
              title={t('loyalty.metrics.visiblePoints')}
              value={metrics.totalPoints}
              helper={t('loyalty.metrics.visiblePointsHelper')}
              color="warning"
              icon={<SavingsRoundedIcon />}
            />
            <LionMetricCard
              title={t('loyalty.metrics.baseRule')}
              value={t('loyalty.metrics.baseRuleValue', {
                points: config.pointsPerUnit || 1,
                amount: config.amountUnit || 10
              })}
              helper={t('loyalty.metrics.baseRuleHelper', { mode: config.roundingMode || 'FLOOR' })}
              color="secondary"
              icon={<TuneRoundedIcon />}
            />
          </ResponsiveMetricGrid>

          <Paper sx={{ p: 2.5, borderRadius: 3 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
              <TextField
                label={t('loyalty.filters.search')}
                value={filters.search}
                onChange={(event) => {
                  setPage(0);
                  setFilters((prev) => ({ ...prev, search: event.target.value }));
                }}
                fullWidth
                sx={fieldSx}
              />
              <FormControl sx={{ minWidth: 160 }}>
                <InputLabel>{t('loyalty.filters.status')}</InputLabel>
                <Select
                  label={t('loyalty.filters.status')}
                  value={filters.status}
                  onChange={(event) => {
                    setPage(0);
                    setFilters((prev) => ({ ...prev, status: event.target.value }));
                  }}
                >
                  <MenuItem value="">{t('loyalty.filters.all')}</MenuItem>
                  <MenuItem value="ACTIVE">{customerStatusLabel('ACTIVE')}</MenuItem>
                  <MenuItem value="INACTIVE">{customerStatusLabel('INACTIVE')}</MenuItem>
                  <MenuItem value="SUSPENDED">{customerStatusLabel('SUSPENDED')}</MenuItem>
                </Select>
              </FormControl>
              <TextField
                type="number"
                label={t('loyalty.filters.minimumPoints')}
                value={filters.minimumPoints}
                onChange={(event) => {
                  setPage(0);
                  setFilters((prev) => ({ ...prev, minimumPoints: event.target.value }));
                }}
                sx={{ ...fieldSx, minWidth: 180 }}
              />
            </Stack>
          </Paper>

          <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t('loyalty.table.customer')}</TableCell>
                  <TableCell>{t('loyalty.table.status')}</TableCell>
                  <TableCell>{t('loyalty.table.channel')}</TableCell>
                  <TableCell>{t('loyalty.table.availablePoints')}</TableCell>
                  <TableCell>{t('loyalty.table.lifetimeEarned')}</TableCell>
                  <TableCell>{t('loyalty.table.lifetimeAdjusted')}</TableCell>
                  <TableCell>{t('loyalty.table.lastMovement')}</TableCell>
                  <TableCell align="right">{t('loyalty.table.actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.customerId} hover>
                    <TableCell>
                      <Stack spacing={0.25}>
                        <Typography variant="subtitle2">{row.customerFullname || '-'}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {row.customerMail || '-'}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{customerStatusLabel(row.customerStatus)}</TableCell>
                    <TableCell>{channelLabel(row.channel)}</TableCell>
                    <TableCell>{row.availablePoints || 0}</TableCell>
                    <TableCell>{row.lifetimeEarned || 0}</TableCell>
                    <TableCell>{row.lifetimeAdjusted || 0}</TableCell>
                    <TableCell>{formatDateTime(row.lastEventAt)}</TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Button size="small" variant="outlined" onClick={() => handleOpenLedger(row)}>
                          {t('loyalty.actions.ledger')}
                        </Button>
                        {canAdjust ? (
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => setAdjustDialog({ open: true, row, pointsDelta: '', reason: '' })}
                          >
                            {t('loyalty.actions.adjust')}
                          </Button>
                        ) : null}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
                {!loading && rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                      {t('loyalty.table.empty')}
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
            onPageChange={(_, nextPage) => setPage(nextPage)}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
          />
        </Stack>
      </MainCard>

      <Dialog open={configOpen} onClose={() => setConfigOpen(false)} fullWidth maxWidth="sm">
        <DialogTitleWithClose onClose={() => setConfigOpen(false)}>{t('loyalty.dialogs.configTitle')}</DialogTitleWithClose>
        <DialogContent dividers>
          <Stack spacing={2.5} sx={{ pt: 0.5 }}>
            <FormControlLabel
              control={<Switch checked={Boolean(config.active)} onChange={(event) => setConfig((prev) => ({ ...prev, active: event.target.checked }))} />}
              label={t('loyalty.dialogs.programActive')}
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <TextField
                type="number"
                label={t('loyalty.dialogs.pointsPerUnit')}
                value={config.pointsPerUnit ?? 1}
                onChange={(event) => setConfig((prev) => ({ ...prev, pointsPerUnit: Number(event.target.value) }))}
                fullWidth
                sx={fieldSx}
              />
              <TextField
                type="number"
                label={t('loyalty.dialogs.amountPerUnit')}
                value={config.amountUnit ?? 10}
                onChange={(event) => setConfig((prev) => ({ ...prev, amountUnit: Number(event.target.value) }))}
                fullWidth
                sx={fieldSx}
              />
            </Stack>
            <FormControl fullWidth>
              <InputLabel>{t('loyalty.dialogs.rounding')}</InputLabel>
              <Select
                label={t('loyalty.dialogs.rounding')}
                value={config.roundingMode || 'FLOOR'}
                onChange={(event) => setConfig((prev) => ({ ...prev, roundingMode: event.target.value }))}
              >
                <MenuItem value="FLOOR">FLOOR</MenuItem>
                <MenuItem value="ROUND">ROUND</MenuItem>
                <MenuItem value="CEILING">CEILING</MenuItem>
              </Select>
            </FormControl>
            <TextField
              type="datetime-local"
              label={t('loyalty.dialogs.effectiveFrom')}
              value={config.effectiveFrom || ''}
              onChange={(event) => setConfig((prev) => ({ ...prev, effectiveFrom: event.target.value }))}
              InputLabelProps={{ shrink: true }}
              fullWidth
              sx={fieldSx}
            />
            <TextField
              label={t('loyalty.dialogs.notes')}
              value={config.notes || ''}
              onChange={(event) => setConfig((prev) => ({ ...prev, notes: event.target.value }))}
              fullWidth
              multiline
              minRows={2}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfigOpen(false)}>{t('actions.cancel')}</Button>
          <Button variant="contained" startIcon={<SaveOutlinedIcon />} onClick={handleSaveConfig} disabled={saving}>
            {t('actions.save')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={ledgerDialog.open} onClose={() => setLedgerDialog({ open: false, row: null, data: [], total: 0 })} fullWidth maxWidth="md">
        <DialogTitleWithClose onClose={() => setLedgerDialog({ open: false, row: null, data: [], total: 0 })}>
          {t('loyalty.dialogs.ledgerTitle')}
        </DialogTitleWithClose>
        <DialogContent dividers>
          <Stack spacing={2}>
            <Typography variant="body2" color="text.secondary">
              {t('loyalty.dialogs.ledgerShown', {
                name: ledgerDialog.row?.customerFullname || '-',
                count: ledgerDialog.total || 0
              })}
            </Typography>
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>{t('loyalty.dialogs.date')}</TableCell>
                    <TableCell>{t('loyalty.dialogs.type')}</TableCell>
                    <TableCell>{t('loyalty.dialogs.source')}</TableCell>
                    <TableCell>{t('loyalty.dialogs.points')}</TableCell>
                    <TableCell>{t('loyalty.dialogs.balance')}</TableCell>
                    <TableCell>{t('loyalty.dialogs.reason')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ledgerDialog.data.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{formatDateTime(entry.createdAt)}</TableCell>
                      <TableCell>{formatLoyaltyMovementType(entry.movementType, t)}</TableCell>
                      <TableCell>
                        {entry.sourceType || '-'}
                        {entry.sourceId ? ` #${entry.sourceId}` : ''}
                      </TableCell>
                      <TableCell>{entry.pointsDelta}</TableCell>
                      <TableCell>{entry.balanceAfter}</TableCell>
                      <TableCell>{entry.reason || '-'}</TableCell>
                    </TableRow>
                  ))}
                  {!ledgerDialog.data.length ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                        {t('loyalty.dialogs.ledgerEmpty')}
                      </TableCell>
                    </TableRow>
                  ) : null}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        </DialogContent>
      </Dialog>

      <Dialog open={adjustDialog.open} onClose={() => setAdjustDialog({ open: false, row: null, pointsDelta: '', reason: '' })} fullWidth maxWidth="sm">
        <DialogTitleWithClose onClose={() => setAdjustDialog({ open: false, row: null, pointsDelta: '', reason: '' })}>
          {t('loyalty.dialogs.adjustTitle')}
        </DialogTitleWithClose>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ pt: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              {adjustDialog.row?.customerFullname || '-'}
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    {t('loyalty.dialogs.currentBalance')}
                  </Typography>
                  <Typography variant="h5">{currentAdjustmentBalance}</Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    {t('loyalty.dialogs.resultingBalance')}
                  </Typography>
                  <Typography variant="h5" color={adjustmentWouldBeNegative ? 'error.main' : 'text.primary'}>
                    {resultingAdjustmentBalance}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
            <TextField
              type="number"
              label={t('loyalty.dialogs.adjustPoints')}
              value={adjustDialog.pointsDelta}
              onChange={(event) => setAdjustDialog((prev) => ({ ...prev, pointsDelta: event.target.value }))}
              fullWidth
              error={hasAdjustmentDelta && (!adjustmentDeltaIsInteger || adjustmentDelta === 0 || adjustmentWouldBeNegative)}
              sx={fieldSx}
              inputProps={{ step: 1 }}
              helperText={adjustmentPointsHelperText}
            />
            <TextField
              label={t('loyalty.dialogs.adjustReason')}
              value={adjustDialog.reason}
              onChange={(event) => setAdjustDialog((prev) => ({ ...prev, reason: event.target.value }))}
              fullWidth
              multiline
              minRows={3}
              required
              helperText={t('loyalty.dialogs.adjustReasonHelper')}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAdjustDialog({ open: false, row: null, pointsDelta: '', reason: '' })} disabled={saving}>
            {t('actions.cancel')}
          </Button>
          <Button variant="contained" onClick={handleAdjustPoints} disabled={!adjustmentCanSubmit}>
            {t('loyalty.actions.apply')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
