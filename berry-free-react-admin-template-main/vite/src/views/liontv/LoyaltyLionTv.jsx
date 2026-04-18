import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';

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

export default function LoyaltyLionTv() {
  const { enqueueSnackbar } = useSnackbar();

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

  const loadConfig = useCallback(async () => {
    try {
      const response = await getLoyaltyConfig();
      setConfig({
        ...(response || emptyConfig()),
        effectiveFrom: response?.effectiveFrom ? String(response.effectiveFrom).slice(0, 16) : ''
      });
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || error.message || 'No se pudo cargar la configuración de lealtad.', {
        variant: 'error'
      });
    }
  }, [enqueueSnackbar]);

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
      enqueueSnackbar(error?.response?.data?.message || error.message || 'No se pudo cargar el módulo de lealtad.', {
        variant: 'error'
      });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar, filters.minimumPoints, filters.search, filters.status, page, rowsPerPage]);

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

  const handleOpenLedger = async (row) => {
    try {
      const response = await listLoyaltyLedger(row.customerId, { index: 0, size: 20 });
      setLedgerDialog({ open: true, row, data: response?.data || [], total: response?.total || 0 });
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || error.message || 'No se pudo cargar el ledger del cliente.', { variant: 'error' });
    }
  };

  const handleSaveConfig = async () => {
    setSaving(true);
    try {
      await updateLoyaltyConfig({
        ...config,
        effectiveFrom: config.effectiveFrom ? new Date(config.effectiveFrom).toISOString() : null
      });
      enqueueSnackbar('Configuración de lealtad actualizada.', { variant: 'success' });
      setConfigOpen(false);
      await Promise.all([loadConfig(), loadRows()]);
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || error.message || 'No se pudo guardar la configuración.', { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleAdjustPoints = async () => {
    if (!adjustDialog.row?.customerId) return;
    setSaving(true);
    try {
      await adjustLoyaltyPoints(adjustDialog.row.customerId, {
        pointsDelta: Number(adjustDialog.pointsDelta),
        reason: adjustDialog.reason
      });
      enqueueSnackbar('Ajuste de puntos aplicado.', { variant: 'success' });
      setAdjustDialog({ open: false, row: null, pointsDelta: '', reason: '' });
      await loadRows();
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || error.message || 'No se pudo aplicar el ajuste.', { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 1500, mx: 'auto' }}>
      <MainCard
        title="Lealtad"
        secondary={
          <ResponsiveActionBar>
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={loadRows} disabled={loading || saving}>
              Recargar
            </Button>
            <Button variant="contained" startIcon={<TuneRoundedIcon />} onClick={() => setConfigOpen(true)} disabled={saving}>
              Configuración
            </Button>
          </ResponsiveActionBar>
        }
      >
        <Stack spacing={2.5}>
          <Alert severity={config.active ? 'success' : 'warning'}>
            {config.active
              ? `Programa activo desde ${config.effectiveFrom ? formatDateTime(config.effectiveFrom) : 'sin fecha definida'}.`
              : 'El programa está inactivo. No se acreditarán puntos nuevos hasta activarlo.'}
          </Alert>

          <ResponsiveMetricGrid columns={{ xs: 1, sm: 2, lg: 4 }}>
            <LionMetricCard title="Clientes listados" value={total} helper="Balances visibles" color="primary" icon={<LoyaltyRoundedIcon />} />
            <LionMetricCard
              title="Clientes con puntos"
              value={metrics.customersWithPoints}
              helper="Con saldo disponible mayor a cero"
              color="success"
              icon={<CardGiftcardRoundedIcon />}
            />
            <LionMetricCard title="Puntos visibles" value={metrics.totalPoints} helper="Total de la página actual" color="warning" icon={<SavingsRoundedIcon />} />
            <LionMetricCard
              title="Regla base"
              value={`${config.pointsPerUnit || 1} / L${config.amountUnit || 10}`}
              helper={`Rounding: ${config.roundingMode || 'FLOOR'}`}
              color="secondary"
              icon={<TuneRoundedIcon />}
            />
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
              <TextField
                type="number"
                label="Puntos mínimos"
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
                  <TableCell>Cliente</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Canal</TableCell>
                  <TableCell>Puntos disponibles</TableCell>
                  <TableCell>Lifetime earned</TableCell>
                  <TableCell>Lifetime adjusted</TableCell>
                  <TableCell>Último movimiento</TableCell>
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
                    <TableCell>{row.availablePoints || 0}</TableCell>
                    <TableCell>{row.lifetimeEarned || 0}</TableCell>
                    <TableCell>{row.lifetimeAdjusted || 0}</TableCell>
                    <TableCell>{formatDateTime(row.lastEventAt)}</TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Button size="small" variant="outlined" onClick={() => handleOpenLedger(row)}>
                          Ledger
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => setAdjustDialog({ open: true, row, pointsDelta: '', reason: '' })}
                        >
                          Ajustar
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
                {!loading && rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                      No hay balances de lealtad para mostrar.
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
        <DialogTitleWithClose onClose={() => setConfigOpen(false)}>Configuración de lealtad</DialogTitleWithClose>
        <DialogContent dividers>
          <Stack spacing={2.5} sx={{ pt: 0.5 }}>
            <FormControlLabel
              control={<Switch checked={Boolean(config.active)} onChange={(event) => setConfig((prev) => ({ ...prev, active: event.target.checked }))} />}
              label="Programa activo"
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <TextField
                type="number"
                label="Puntos por unidad"
                value={config.pointsPerUnit ?? 1}
                onChange={(event) => setConfig((prev) => ({ ...prev, pointsPerUnit: Number(event.target.value) }))}
                fullWidth
                sx={fieldSx}
              />
              <TextField
                type="number"
                label="Monto por unidad"
                value={config.amountUnit ?? 10}
                onChange={(event) => setConfig((prev) => ({ ...prev, amountUnit: Number(event.target.value) }))}
                fullWidth
                sx={fieldSx}
              />
            </Stack>
            <FormControl fullWidth>
              <InputLabel>Rounding</InputLabel>
              <Select
                label="Rounding"
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
              label="Vigente desde"
              value={config.effectiveFrom || ''}
              onChange={(event) => setConfig((prev) => ({ ...prev, effectiveFrom: event.target.value }))}
              InputLabelProps={{ shrink: true }}
              fullWidth
              sx={fieldSx}
            />
            <TextField
              label="Notas"
              value={config.notes || ''}
              onChange={(event) => setConfig((prev) => ({ ...prev, notes: event.target.value }))}
              fullWidth
              multiline
              minRows={2}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfigOpen(false)}>Cancelar</Button>
          <Button variant="contained" startIcon={<SaveOutlinedIcon />} onClick={handleSaveConfig} disabled={saving}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={ledgerDialog.open} onClose={() => setLedgerDialog({ open: false, row: null, data: [], total: 0 })} fullWidth maxWidth="md">
        <DialogTitleWithClose onClose={() => setLedgerDialog({ open: false, row: null, data: [], total: 0 })}>
          Ledger de puntos
        </DialogTitleWithClose>
        <DialogContent dividers>
          <Stack spacing={2}>
            <Typography variant="body2" color="text.secondary">
              {ledgerDialog.row?.customerFullname || '-'} · registros mostrados: {ledgerDialog.total || 0}
            </Typography>
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Origen</TableCell>
                    <TableCell>Puntos</TableCell>
                    <TableCell>Balance</TableCell>
                    <TableCell>Motivo</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ledgerDialog.data.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{formatDateTime(entry.createdAt)}</TableCell>
                      <TableCell>{entry.movementType || '-'}</TableCell>
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
                        No hay movimientos todavía.
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
          Ajustar puntos
        </DialogTitleWithClose>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ pt: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              {adjustDialog.row?.customerFullname || '-'}
            </Typography>
            <TextField
              type="number"
              label="Puntos"
              value={adjustDialog.pointsDelta}
              onChange={(event) => setAdjustDialog((prev) => ({ ...prev, pointsDelta: event.target.value }))}
              fullWidth
              sx={fieldSx}
              helperText="Usa positivos para sumar y negativos para restar."
            />
            <TextField
              label="Motivo"
              value={adjustDialog.reason}
              onChange={(event) => setAdjustDialog((prev) => ({ ...prev, reason: event.target.value }))}
              fullWidth
              multiline
              minRows={3}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAdjustDialog({ open: false, row: null, pointsDelta: '', reason: '' })}>Cancelar</Button>
          <Button variant="contained" onClick={handleAdjustPoints} disabled={saving}>
            Aplicar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
