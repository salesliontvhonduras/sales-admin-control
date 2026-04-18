import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FormControl from '@mui/material/FormControl';
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
import FormControlLabel from '@mui/material/FormControlLabel';
import { useTranslation } from 'react-i18next';

import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import RefreshIcon from '@mui/icons-material/Refresh';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';

import MainCard from 'ui-component/cards/MainCard';
import LionMetricCard from 'ui-component/cards/LionMetricCard';
import DialogTitleWithClose from 'ui-component/dialogs/DialogTitleWithClose';
import ResponsiveActionBar from 'ui-component/responsive/ResponsiveActionBar';
import ResponsiveMetricGrid from 'ui-component/responsive/ResponsiveMetricGrid';
import {
  getVipConfig,
  listVipCustomers,
  overrideVipCustomer,
  recomputeVipCustomer,
  recomputeVipCustomers,
  updateVipConfig
} from 'api/liontv-engagement';

const fieldSx = {
  '& .MuiInputBase-root': { borderRadius: 2, minHeight: 46 }
};

function formatCurrency(value) {
  return Number(value || 0).toLocaleString('es-HN', { style: 'currency', currency: 'HNL', minimumFractionDigits: 2 });
}

function formatScore(value) {
  return Number(value || 0).toFixed(2);
}

function TierChip({ tierCode, tiers }) {
  const tier = tiers.find((item) => item.code === tierCode) || null;
  const color = tier?.colorHex || '#475569';
  return (
    <Chip
      size="small"
      label={tier?.displayName || tierCode || '-'}
      sx={{
        bgcolor: `${color}22`,
        color,
        border: '1px solid',
        borderColor: `${color}55`,
        fontWeight: 700
      }}
    />
  );
}

function emptyConfig() {
  return {
    active: true,
    seniorityWeight: 0.3,
    billingWeight: 0.45,
    subscriptionsWeight: 0.25,
    seniorityFullScoreDays: 365,
    billingFullScoreAmount: 10000,
    subscriptionsFullScoreCount: 6,
    notes: '',
    tiers: []
  };
}

export default function VipCustomersLionTv() {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({ search: '', status: '', tierCode: '', overrideOnly: false });
  const [config, setConfig] = useState(emptyConfig());
  const [configOpen, setConfigOpen] = useState(false);
  const [overrideDialog, setOverrideDialog] = useState({ open: false, row: null, tierCode: '', reason: '' });

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
      const response = await getVipConfig();
      setConfig(response || emptyConfig());
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || error.message || t('vipCustomers.messages.loadConfigError'), { variant: 'error' });
    }
  }, [enqueueSnackbar, t]);

  const loadRows = useCallback(async () => {
    setLoading(true);
    try {
      const response = await listVipCustomers({
        index: page,
        size: rowsPerPage,
        search: filters.search || undefined,
        status: filters.status || undefined,
        tierCode: filters.tierCode || undefined,
        overrideOnly: filters.overrideOnly || undefined
      });
      setRows(response?.data || []);
      setTotal(response?.total || 0);
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || error.message || t('vipCustomers.messages.loadRankingError'), { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar, filters.overrideOnly, filters.search, filters.status, filters.tierCode, page, rowsPerPage, t]);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  useEffect(() => {
    loadRows();
  }, [loadRows]);

  const metrics = useMemo(() => {
    const overrides = rows.filter((row) => row.overrideApplied).length;
    const averageScore = rows.length ? rows.reduce((acc, row) => acc + Number(row.computedScore || 0), 0) / rows.length : 0;
    const topTier = rows[0]?.finalTierCode || '-';
    return { overrides, averageScore, topTier };
  }, [rows]);

  const handleTierChange = (index, field, value) => {
    setConfig((prev) => ({
      ...prev,
      tiers: prev.tiers.map((tier, tierIndex) => (tierIndex === index ? { ...tier, [field]: value } : tier))
    }));
  };

  const handleSaveConfig = async () => {
    setSaving(true);
    try {
      await updateVipConfig(config);
      enqueueSnackbar(t('vipCustomers.messages.configUpdated'), { variant: 'success' });
      setConfigOpen(false);
      await Promise.all([loadConfig(), loadRows()]);
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || error.message || t('vipCustomers.messages.saveConfigError'), { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleRecomputeAll = async () => {
    setSaving(true);
    try {
      await recomputeVipCustomers();
      enqueueSnackbar(t('vipCustomers.messages.rankingRecomputed'), { variant: 'success' });
      await loadRows();
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || error.message || t('vipCustomers.messages.recomputeError'), { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleRecomputeCustomer = async (customerId) => {
    setSaving(true);
    try {
      await recomputeVipCustomer(customerId);
      enqueueSnackbar(t('vipCustomers.messages.customerRecomputed'), { variant: 'success' });
      await loadRows();
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || error.message || t('vipCustomers.messages.recomputeCustomerError'), {
        variant: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveOverride = async () => {
    if (!overrideDialog.row?.customerId) return;
    setSaving(true);
    try {
      await overrideVipCustomer(overrideDialog.row.customerId, {
        tierCode: overrideDialog.tierCode,
        reason: overrideDialog.reason
      });
      enqueueSnackbar(t('vipCustomers.messages.overrideApplied'), { variant: 'success' });
      setOverrideDialog({ open: false, row: null, tierCode: '', reason: '' });
      await loadRows();
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || error.message || t('vipCustomers.messages.overrideError'), { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 1500, mx: 'auto' }}>
      <MainCard
        title={t('vipCustomers.title')}
        secondary={
          <ResponsiveActionBar>
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={loadRows} disabled={loading || saving}>
              {t('actions.refresh')}
            </Button>
            <Button variant="outlined" startIcon={<AutoAwesomeIcon />} onClick={() => setConfigOpen(true)} disabled={saving}>
              {t('vipCustomers.actions.config')}
            </Button>
            <Button variant="contained" startIcon={<WorkspacePremiumRoundedIcon />} onClick={handleRecomputeAll} disabled={saving}>
              {t('vipCustomers.actions.recompute')}
            </Button>
          </ResponsiveActionBar>
        }
      >
        <Stack spacing={2.5}>
          <Alert severity="info">{t('vipCustomers.alerts.scoreInfo')}</Alert>

          <ResponsiveMetricGrid columns={{ xs: 1, sm: 2, lg: 4 }}>
            <LionMetricCard
              title={t('vipCustomers.metrics.profilesLoaded')}
              value={total}
              helper={t('vipCustomers.metrics.profilesLoadedHelper')}
              color="primary"
              icon={<WorkspacePremiumRoundedIcon />}
            />
            <LionMetricCard
              title={t('vipCustomers.metrics.overridesVisible')}
              value={metrics.overrides}
              helper={t('vipCustomers.metrics.overridesVisibleHelper')}
              color="warning"
              icon={<StarRoundedIcon />}
            />
            <LionMetricCard
              title={t('vipCustomers.metrics.averageScore')}
              value={formatScore(metrics.averageScore)}
              helper={t('vipCustomers.metrics.averageScoreHelper')}
              color="secondary"
              icon={<AutoAwesomeIcon />}
            />
            <LionMetricCard
              title={t('vipCustomers.metrics.topTier')}
              value={metrics.topTier}
              helper={t('vipCustomers.metrics.topTierHelper')}
              color="success"
              icon={<WorkspacePremiumRoundedIcon />}
            />
          </ResponsiveMetricGrid>

          <Paper sx={{ p: 2.5, borderRadius: 3 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
              <TextField
                label={t('vipCustomers.filters.search')}
                value={filters.search}
                onChange={(event) => {
                  setPage(0);
                  setFilters((prev) => ({ ...prev, search: event.target.value }));
                }}
                fullWidth
                sx={fieldSx}
              />
              <FormControl sx={{ minWidth: 160 }}>
                <InputLabel>{t('vipCustomers.filters.status')}</InputLabel>
                <Select
                  label={t('vipCustomers.filters.status')}
                  value={filters.status}
                  onChange={(event) => {
                    setPage(0);
                    setFilters((prev) => ({ ...prev, status: event.target.value }));
                  }}
                >
                  <MenuItem value="">{t('vipCustomers.filters.all')}</MenuItem>
                  <MenuItem value="ACTIVE">{customerStatusLabel('ACTIVE')}</MenuItem>
                  <MenuItem value="INACTIVE">{customerStatusLabel('INACTIVE')}</MenuItem>
                  <MenuItem value="SUSPENDED">{customerStatusLabel('SUSPENDED')}</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 160 }}>
                <InputLabel>{t('vipCustomers.filters.finalTier')}</InputLabel>
                <Select
                  label={t('vipCustomers.filters.finalTier')}
                  value={filters.tierCode}
                  onChange={(event) => {
                    setPage(0);
                    setFilters((prev) => ({ ...prev, tierCode: event.target.value }));
                  }}
                >
                  <MenuItem value="">{t('vipCustomers.filters.all')}</MenuItem>
                  {config.tiers?.map((tier) => (
                    <MenuItem key={tier.code} value={tier.code}>
                      {tier.displayName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControlLabel
                control={
                  <Switch
                    checked={filters.overrideOnly}
                    onChange={(event) => {
                      setPage(0);
                      setFilters((prev) => ({ ...prev, overrideOnly: event.target.checked }));
                    }}
                  />
                }
                label={t('vipCustomers.filters.overrideOnly')}
              />
            </Stack>
          </Paper>

          <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t('vipCustomers.table.customer')}</TableCell>
                  <TableCell>{t('vipCustomers.table.status')}</TableCell>
                  <TableCell>{t('vipCustomers.table.channel')}</TableCell>
                  <TableCell>{t('vipCustomers.table.seniority')}</TableCell>
                  <TableCell>{t('vipCustomers.table.billing')}</TableCell>
                  <TableCell>{t('vipCustomers.table.subscriptions')}</TableCell>
                  <TableCell>{t('vipCustomers.table.score')}</TableCell>
                  <TableCell>{t('vipCustomers.table.computedTier')}</TableCell>
                  <TableCell>{t('vipCustomers.table.finalTier')}</TableCell>
                  <TableCell align="right">{t('vipCustomers.table.actions')}</TableCell>
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
                    <TableCell>{t('vipCustomers.units.days', { count: row.seniorityDays || 0 })}</TableCell>
                    <TableCell>
                      <Stack spacing={0.25}>
                        <Typography variant="body2">{formatCurrency(row.totalPaidAmount)}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {t('vipCustomers.table.paidInvoices', { count: row.paidInvoiceCount || 0 })}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {t('vipCustomers.table.subscriptionsSplit', {
                        active: row.activeSubscriptions || 0,
                        total: row.totalSubscriptions || 0
                      })}
                    </TableCell>
                    <TableCell>{formatScore(row.computedScore)}</TableCell>
                    <TableCell>
                      <TierChip tierCode={row.computedTierCode} tiers={config.tiers || []} />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.75} alignItems="center">
                        <TierChip tierCode={row.finalTierCode} tiers={config.tiers || []} />
                        {row.overrideApplied ? <Chip size="small" color="warning" label={t('vipCustomers.table.manual')} /> : null}
                      </Stack>
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Button size="small" variant="outlined" onClick={() => handleRecomputeCustomer(row.customerId)} disabled={saving}>
                          {t('vipCustomers.actions.recomputeCustomer')}
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() =>
                            setOverrideDialog({
                              open: true,
                              row,
                              tierCode: row.overrideTierCode || row.finalTierCode || '',
                              reason: row.overrideReason || ''
                            })
                          }
                        >
                          {t('vipCustomers.actions.override')}
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
                {!loading && rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} align="center" sx={{ py: 6 }}>
                      {t('vipCustomers.table.empty')}
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

      <Dialog open={configOpen} onClose={() => setConfigOpen(false)} fullWidth maxWidth="md">
        <DialogTitleWithClose onClose={() => setConfigOpen(false)}>{t('vipCustomers.dialogs.configTitle')}</DialogTitleWithClose>
        <DialogContent dividers>
          <Stack spacing={2.5} sx={{ pt: 0.5 }}>
            <FormControlLabel
              control={<Switch checked={Boolean(config.active)} onChange={(event) => setConfig((prev) => ({ ...prev, active: event.target.checked }))} />}
              label={t('vipCustomers.dialogs.activeConfig')}
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <TextField
                type="number"
                label={t('vipCustomers.dialogs.seniorityWeight')}
                value={config.seniorityWeight ?? 0}
                onChange={(event) => setConfig((prev) => ({ ...prev, seniorityWeight: Number(event.target.value) }))}
                fullWidth
                sx={fieldSx}
              />
              <TextField
                type="number"
                label={t('vipCustomers.dialogs.billingWeight')}
                value={config.billingWeight ?? 0}
                onChange={(event) => setConfig((prev) => ({ ...prev, billingWeight: Number(event.target.value) }))}
                fullWidth
                sx={fieldSx}
              />
              <TextField
                type="number"
                label={t('vipCustomers.dialogs.subscriptionsWeight')}
                value={config.subscriptionsWeight ?? 0}
                onChange={(event) => setConfig((prev) => ({ ...prev, subscriptionsWeight: Number(event.target.value) }))}
                fullWidth
                sx={fieldSx}
              />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <TextField
                type="number"
                label={t('vipCustomers.dialogs.fullScoreDays')}
                value={config.seniorityFullScoreDays ?? 365}
                onChange={(event) => setConfig((prev) => ({ ...prev, seniorityFullScoreDays: Number(event.target.value) }))}
                fullWidth
                sx={fieldSx}
              />
              <TextField
                type="number"
                label={t('vipCustomers.dialogs.fullScoreAmount')}
                value={config.billingFullScoreAmount ?? 10000}
                onChange={(event) => setConfig((prev) => ({ ...prev, billingFullScoreAmount: Number(event.target.value) }))}
                fullWidth
                sx={fieldSx}
              />
              <TextField
                type="number"
                label={t('vipCustomers.dialogs.fullScoreSubscriptions')}
                value={config.subscriptionsFullScoreCount ?? 6}
                onChange={(event) => setConfig((prev) => ({ ...prev, subscriptionsFullScoreCount: Number(event.target.value) }))}
                fullWidth
                sx={fieldSx}
              />
            </Stack>
            <TextField
              label={t('vipCustomers.dialogs.notes')}
              value={config.notes || ''}
              onChange={(event) => setConfig((prev) => ({ ...prev, notes: event.target.value }))}
              fullWidth
              multiline
              minRows={2}
            />
            <Stack spacing={1.25}>
              <Typography variant="subtitle2">{t('vipCustomers.dialogs.tiers')}</Typography>
              {config.tiers?.map((tier, index) => (
                <Paper key={tier.code || index} sx={{ p: 1.5, borderRadius: 2 }}>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems={{ md: 'center' }}>
                    <TextField label={t('vipCustomers.dialogs.code')} value={tier.code || ''} disabled sx={{ ...fieldSx, minWidth: 120 }} />
                    <TextField
                      label={t('vipCustomers.dialogs.name')}
                      value={tier.displayName || ''}
                      onChange={(event) => handleTierChange(index, 'displayName', event.target.value)}
                      sx={{ ...fieldSx, minWidth: 160 }}
                    />
                    <TextField
                      type="number"
                      label={t('vipCustomers.dialogs.minScore')}
                      value={tier.minScore ?? 0}
                      onChange={(event) => handleTierChange(index, 'minScore', Number(event.target.value))}
                      sx={{ ...fieldSx, minWidth: 140 }}
                    />
                    <TextField
                      type="number"
                      label={t('vipCustomers.dialogs.order')}
                      value={tier.rankOrder ?? 0}
                      onChange={(event) => handleTierChange(index, 'rankOrder', Number(event.target.value))}
                      sx={{ ...fieldSx, minWidth: 120 }}
                    />
                    <TextField
                      label={t('vipCustomers.dialogs.color')}
                      value={tier.colorHex || ''}
                      onChange={(event) => handleTierChange(index, 'colorHex', event.target.value)}
                      sx={{ ...fieldSx, minWidth: 140 }}
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={Boolean(tier.active)}
                          onChange={(event) => handleTierChange(index, 'active', event.target.checked)}
                        />
                      }
                      label={t('vipCustomers.dialogs.active')}
                    />
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfigOpen(false)}>{t('actions.cancel')}</Button>
          <Button variant="contained" startIcon={<SaveOutlinedIcon />} onClick={handleSaveConfig} disabled={saving}>
            {t('actions.save')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={overrideDialog.open} onClose={() => setOverrideDialog({ open: false, row: null, tierCode: '', reason: '' })} fullWidth maxWidth="sm">
        <DialogTitleWithClose onClose={() => setOverrideDialog({ open: false, row: null, tierCode: '', reason: '' })}>
          {t('vipCustomers.dialogs.overrideTitle')}
        </DialogTitleWithClose>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ pt: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              {overrideDialog.row?.customerFullname || '-'}
            </Typography>
            <FormControl fullWidth>
              <InputLabel>{t('vipCustomers.dialogs.finalTier')}</InputLabel>
              <Select
                label={t('vipCustomers.dialogs.finalTier')}
                value={overrideDialog.tierCode}
                onChange={(event) => setOverrideDialog((prev) => ({ ...prev, tierCode: event.target.value }))}
              >
                <MenuItem value="">{t('vipCustomers.dialogs.clearOverride')}</MenuItem>
                {config.tiers?.map((tier) => (
                  <MenuItem key={tier.code} value={tier.code}>
                    {tier.displayName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label={t('vipCustomers.dialogs.reason')}
              value={overrideDialog.reason}
              onChange={(event) => setOverrideDialog((prev) => ({ ...prev, reason: event.target.value }))}
              fullWidth
              multiline
              minRows={3}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOverrideDialog({ open: false, row: null, tierCode: '', reason: '' })}>{t('actions.cancel')}</Button>
          <Button variant="contained" onClick={handleSaveOverride} disabled={saving}>
            {t('vipCustomers.actions.apply')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
