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

  const loadConfig = useCallback(async () => {
    try {
      const response = await getVipConfig();
      setConfig(response || emptyConfig());
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || error.message || 'No se pudo cargar la configuración VIP.', { variant: 'error' });
    }
  }, [enqueueSnackbar]);

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
      enqueueSnackbar(error?.response?.data?.message || error.message || 'No se pudo cargar el ranking VIP.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar, filters.overrideOnly, filters.search, filters.status, filters.tierCode, page, rowsPerPage]);

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
      enqueueSnackbar('Configuración VIP actualizada.', { variant: 'success' });
      setConfigOpen(false);
      await Promise.all([loadConfig(), loadRows()]);
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || error.message || 'No se pudo guardar la configuración VIP.', { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleRecomputeAll = async () => {
    setSaving(true);
    try {
      await recomputeVipCustomers();
      enqueueSnackbar('Ranking VIP recalculado.', { variant: 'success' });
      await loadRows();
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || error.message || 'No se pudo recalcular VIP.', { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleRecomputeCustomer = async (customerId) => {
    setSaving(true);
    try {
      await recomputeVipCustomer(customerId);
      enqueueSnackbar('Cliente VIP recalculado.', { variant: 'success' });
      await loadRows();
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || error.message || 'No se pudo recalcular el cliente.', { variant: 'error' });
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
      enqueueSnackbar('Override VIP aplicado.', { variant: 'success' });
      setOverrideDialog({ open: false, row: null, tierCode: '', reason: '' });
      await loadRows();
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || error.message || 'No se pudo aplicar el override.', { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 1500, mx: 'auto' }}>
      <MainCard
        title="Clientes VIP"
        secondary={
          <ResponsiveActionBar>
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={loadRows} disabled={loading || saving}>
              Recargar
            </Button>
            <Button variant="outlined" startIcon={<AutoAwesomeIcon />} onClick={() => setConfigOpen(true)} disabled={saving}>
              Configuración
            </Button>
            <Button variant="contained" startIcon={<WorkspacePremiumRoundedIcon />} onClick={handleRecomputeAll} disabled={saving}>
              Recalcular
            </Button>
          </ResponsiveActionBar>
        }
      >
        <Stack spacing={2.5}>
          <Alert severity="info">El score VIP combina antigüedad, facturación pagada e historial de suscripciones por usuario.</Alert>

          <ResponsiveMetricGrid columns={{ xs: 1, sm: 2, lg: 4 }}>
            <LionMetricCard title="Perfiles cargados" value={total} helper="Snapshots VIP activos" color="primary" icon={<WorkspacePremiumRoundedIcon />} />
            <LionMetricCard title="Overrides visibles" value={metrics.overrides} helper="Clientes con tier manual" color="warning" icon={<StarRoundedIcon />} />
            <LionMetricCard title="Score promedio" value={formatScore(metrics.averageScore)} helper="Media de la página actual" color="secondary" icon={<AutoAwesomeIcon />} />
            <LionMetricCard title="Tier líder" value={metrics.topTier} helper="Primer registro del ranking actual" color="success" icon={<WorkspacePremiumRoundedIcon />} />
          </ResponsiveMetricGrid>

          <Paper sx={{ p: 2.5, borderRadius: 3 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
              <TextField
                label="Buscar"
                value={filters.search}
                onChange={(event) => {
                  setPage(0);
                  setFilters((prev) => ({ ...prev, search: event.target.value }));
                }}
                fullWidth
                sx={fieldSx}
              />
              <FormControl sx={{ minWidth: 160 }}>
                <InputLabel>Estado</InputLabel>
                <Select
                  label="Estado"
                  value={filters.status}
                  onChange={(event) => {
                    setPage(0);
                    setFilters((prev) => ({ ...prev, status: event.target.value }));
                  }}
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                  <MenuItem value="INACTIVE">INACTIVE</MenuItem>
                  <MenuItem value="SUSPENDED">SUSPENDED</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 160 }}>
                <InputLabel>Tier final</InputLabel>
                <Select
                  label="Tier final"
                  value={filters.tierCode}
                  onChange={(event) => {
                    setPage(0);
                    setFilters((prev) => ({ ...prev, tierCode: event.target.value }));
                  }}
                >
                  <MenuItem value="">Todos</MenuItem>
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
                label="Solo overrides"
              />
            </Stack>
          </Paper>

          <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Canal</TableCell>
                  <TableCell>Antigüedad</TableCell>
                  <TableCell>Facturación</TableCell>
                  <TableCell>Suscripciones</TableCell>
                  <TableCell>Score</TableCell>
                  <TableCell>Tier calculado</TableCell>
                  <TableCell>Tier final</TableCell>
                  <TableCell align="right">Acciones</TableCell>
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
                    <TableCell>{row.customerStatus || '-'}</TableCell>
                    <TableCell>{row.channel || '-'}</TableCell>
                    <TableCell>{row.seniorityDays || 0} días</TableCell>
                    <TableCell>
                      <Stack spacing={0.25}>
                        <Typography variant="body2">{formatCurrency(row.totalPaidAmount)}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Facturas pagadas: {row.paidInvoiceCount || 0}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {row.activeSubscriptions || 0} activas / {row.totalSubscriptions || 0} históricas
                    </TableCell>
                    <TableCell>{formatScore(row.computedScore)}</TableCell>
                    <TableCell>
                      <TierChip tierCode={row.computedTierCode} tiers={config.tiers || []} />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.75} alignItems="center">
                        <TierChip tierCode={row.finalTierCode} tiers={config.tiers || []} />
                        {row.overrideApplied ? <Chip size="small" color="warning" label="Manual" /> : null}
                      </Stack>
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Button size="small" variant="outlined" onClick={() => handleRecomputeCustomer(row.customerId)} disabled={saving}>
                          Recalcular
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
                          Override
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
                {!loading && rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} align="center" sx={{ py: 6 }}>
                      No hay perfiles VIP para mostrar.
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
        <DialogTitleWithClose onClose={() => setConfigOpen(false)}>Configuración VIP</DialogTitleWithClose>
        <DialogContent dividers>
          <Stack spacing={2.5} sx={{ pt: 0.5 }}>
            <FormControlLabel
              control={<Switch checked={Boolean(config.active)} onChange={(event) => setConfig((prev) => ({ ...prev, active: event.target.checked }))} />}
              label="Configuración activa"
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <TextField
                type="number"
                label="Peso antigüedad"
                value={config.seniorityWeight ?? 0}
                onChange={(event) => setConfig((prev) => ({ ...prev, seniorityWeight: Number(event.target.value) }))}
                fullWidth
                sx={fieldSx}
              />
              <TextField
                type="number"
                label="Peso facturación"
                value={config.billingWeight ?? 0}
                onChange={(event) => setConfig((prev) => ({ ...prev, billingWeight: Number(event.target.value) }))}
                fullWidth
                sx={fieldSx}
              />
              <TextField
                type="number"
                label="Peso suscripciones"
                value={config.subscriptionsWeight ?? 0}
                onChange={(event) => setConfig((prev) => ({ ...prev, subscriptionsWeight: Number(event.target.value) }))}
                fullWidth
                sx={fieldSx}
              />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <TextField
                type="number"
                label="Días para score máximo"
                value={config.seniorityFullScoreDays ?? 365}
                onChange={(event) => setConfig((prev) => ({ ...prev, seniorityFullScoreDays: Number(event.target.value) }))}
                fullWidth
                sx={fieldSx}
              />
              <TextField
                type="number"
                label="Facturación para score máximo"
                value={config.billingFullScoreAmount ?? 10000}
                onChange={(event) => setConfig((prev) => ({ ...prev, billingFullScoreAmount: Number(event.target.value) }))}
                fullWidth
                sx={fieldSx}
              />
              <TextField
                type="number"
                label="Suscripciones para score máximo"
                value={config.subscriptionsFullScoreCount ?? 6}
                onChange={(event) => setConfig((prev) => ({ ...prev, subscriptionsFullScoreCount: Number(event.target.value) }))}
                fullWidth
                sx={fieldSx}
              />
            </Stack>
            <TextField
              label="Notas"
              value={config.notes || ''}
              onChange={(event) => setConfig((prev) => ({ ...prev, notes: event.target.value }))}
              fullWidth
              multiline
              minRows={2}
            />
            <Stack spacing={1.25}>
              <Typography variant="subtitle2">Tiers</Typography>
              {config.tiers?.map((tier, index) => (
                <Paper key={tier.code || index} sx={{ p: 1.5, borderRadius: 2 }}>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems={{ md: 'center' }}>
                    <TextField label="Código" value={tier.code || ''} disabled sx={{ ...fieldSx, minWidth: 120 }} />
                    <TextField
                      label="Nombre"
                      value={tier.displayName || ''}
                      onChange={(event) => handleTierChange(index, 'displayName', event.target.value)}
                      sx={{ ...fieldSx, minWidth: 160 }}
                    />
                    <TextField
                      type="number"
                      label="Score mínimo"
                      value={tier.minScore ?? 0}
                      onChange={(event) => handleTierChange(index, 'minScore', Number(event.target.value))}
                      sx={{ ...fieldSx, minWidth: 140 }}
                    />
                    <TextField
                      type="number"
                      label="Orden"
                      value={tier.rankOrder ?? 0}
                      onChange={(event) => handleTierChange(index, 'rankOrder', Number(event.target.value))}
                      sx={{ ...fieldSx, minWidth: 120 }}
                    />
                    <TextField
                      label="Color"
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
                      label="Activo"
                    />
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfigOpen(false)}>Cancelar</Button>
          <Button variant="contained" startIcon={<SaveOutlinedIcon />} onClick={handleSaveConfig} disabled={saving}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={overrideDialog.open} onClose={() => setOverrideDialog({ open: false, row: null, tierCode: '', reason: '' })} fullWidth maxWidth="sm">
        <DialogTitleWithClose onClose={() => setOverrideDialog({ open: false, row: null, tierCode: '', reason: '' })}>
          Override VIP
        </DialogTitleWithClose>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ pt: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              {overrideDialog.row?.customerFullname || '-'}
            </Typography>
            <FormControl fullWidth>
              <InputLabel>Tier final</InputLabel>
              <Select
                label="Tier final"
                value={overrideDialog.tierCode}
                onChange={(event) => setOverrideDialog((prev) => ({ ...prev, tierCode: event.target.value }))}
              >
                <MenuItem value="">Limpiar override</MenuItem>
                {config.tiers?.map((tier) => (
                  <MenuItem key={tier.code} value={tier.code}>
                    {tier.displayName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Motivo"
              value={overrideDialog.reason}
              onChange={(event) => setOverrideDialog((prev) => ({ ...prev, reason: event.target.value }))}
              fullWidth
              multiline
              minRows={3}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOverrideDialog({ open: false, row: null, tierCode: '', reason: '' })}>Cancelar</Button>
          <Button variant="contained" onClick={handleSaveOverride} disabled={saving}>
            Aplicar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
