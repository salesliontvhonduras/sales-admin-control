import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import useAuth from 'hooks/useAuth';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Skeleton from '@mui/material/Skeleton';

import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import TrendingDownOutlinedIcon from '@mui/icons-material/TrendingDownOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';

import MainCard from 'ui-component/cards/MainCard';
import DialogTitleWithClose from 'ui-component/dialogs/DialogTitleWithClose';
import { PageEmptyState, PageErrorState, PageLoadingState } from 'ui-component/feedback/PageState';
import { gridSpacing } from 'store/constant';
import { lionTvApi } from 'utils/api';
import { createResellerWalletAdjustment, getResellerWalletLedger, getResellerWalletSummary } from 'api/liontv-reseller-wallet';
import { hasPermissionExact } from 'utils/rbac';

const DEFAULT_FORM = {
  creditsDelta: '',
  reason: '',
  sourceType: 'MANUAL',
  sourceId: ''
};

function formatDateTime(value, locale = 'es-HN') {
  if (!value) return '-';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString(locale);
}

function walletMetric(icon, title, value, helper, color = 'primary') {
  const Icon = icon;
  return (
    <Card sx={{ height: '100%', borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
      <CardContent>
        <Stack spacing={1.5}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle2" color="text.secondary">
              {title}
            </Typography>
            <Box
              sx={(theme) => ({
                width: 42,
                height: 42,
                borderRadius: 2,
                display: 'grid',
                placeItems: 'center',
                color: theme.palette[color].main,
                bgcolor: `${theme.palette[color].main}14`
              })}
            >
              <Icon fontSize="small" />
            </Box>
          </Stack>
          <Typography variant="h3">{value}</Typography>
          <Typography variant="body2" color="text.secondary">
            {helper}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function ResellerWalletLionTv() {
  const { t, i18n } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { accessToken, user } = useAuth();
  const locale = String(i18n?.resolvedLanguage || i18n?.language || 'es').toLowerCase().startsWith('en') ? 'en-US' : 'es-HN';
  const canAdjust = hasPermissionExact(user, { any: ['LIONTV_RESELLER_WALLET_ADJUST', 'ROLE_LIONTV_RESELLER_WALLET_ADJUST', 'ROLE_ADMIN', 'ADMIN'] });

  const [summary, setSummary] = useState(null);
  const [ledgerRows, setLedgerRows] = useState([]);
  const [ledgerTotal, setLedgerTotal] = useState(0);
  const [packages, setPackages] = useState([]);
  const [index, setIndex] = useState(0);
  const [size, setSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(DEFAULT_FORM);

  const loadData = useCallback(
    async ({ silent = false } = {}) => {
      if (!accessToken) return;
      if (!silent) setLoading(true);
      setError('');
      try {
        const [summaryPayload, ledgerPayload, packagesResponse] = await Promise.all([
          getResellerWalletSummary({ skipAuthRedirect: true }),
          getResellerWalletLedger({ index, size }, { skipAuthRedirect: true }),
          lionTvApi.get('/packages/v1', { skipAuthRedirect: true })
        ]);

        setSummary(summaryPayload);
        setLedgerRows(Array.isArray(ledgerPayload?.data) ? ledgerPayload.data : []);
        setLedgerTotal(Number(ledgerPayload?.total || 0));
        setPackages(Array.isArray(packagesResponse?.data?.data) ? packagesResponse.data.data : []);
      } catch (err) {
        setError(err?.response?.data?.message || t('resellerWallet.errors.load', 'No se pudo cargar el wallet de créditos.'));
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [accessToken, index, size, t]
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  const packageRules = useMemo(
    () =>
      packages
        .map((item) => ({
          packageId: item.packageId ?? item.id ?? null,
          name: item.name || `#${item.packageId ?? item.id ?? '-'}`,
          officialCredits: item.officialCredits ?? '0'
        }))
        .filter((item) => Number(item.officialCredits) > 0)
        .sort((a, b) => Number(a.officialCredits) - Number(b.officialCredits)),
    [packages]
  );

  const handleSubmitAdjustment = async () => {
    const creditsDelta = Number(form.creditsDelta);
    if (!Number.isFinite(creditsDelta) || creditsDelta === 0) {
      enqueueSnackbar(t('resellerWallet.messages.invalidDelta', 'Ingresa un ajuste distinto de cero.'), { variant: 'warning' });
      return;
    }

    setSaving(true);
    try {
      await createResellerWalletAdjustment(
        {
          creditsDelta,
          reason: form.reason || null,
          sourceType: form.sourceType || 'MANUAL',
          sourceId: form.sourceId ? Number(form.sourceId) : null
        },
        { skipAuthRedirect: true }
      );
      enqueueSnackbar(t('resellerWallet.messages.adjusted', 'Wallet actualizado correctamente.'), { variant: 'success' });
      setDialogOpen(false);
      setForm(DEFAULT_FORM);
      await loadData({ silent: true });
    } catch (err) {
      enqueueSnackbar(err?.response?.data?.message || t('resellerWallet.errors.adjust', 'No se pudo aplicar el ajuste.'), {
        variant: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <PageLoadingState title={t('menu.resellerWallet', 'Credit Wallet')} description={t('resellerWallet.loading', 'Cargando wallet...')} />;
  }

  if (error && !summary) {
    return <PageErrorState title={t('menu.resellerWallet', 'Credit Wallet')} description={error} onRetry={() => loadData()} />;
  }

  if (!summary) {
    return <PageEmptyState title={t('menu.resellerWallet', 'Credit Wallet')} description={t('resellerWallet.empty', 'Todavía no hay datos del wallet.')} />;
  }

  return (
    <Stack spacing={gridSpacing}>
      <MainCard
        title={t('menu.resellerWallet', 'Credit Wallet')}
        secondary={
          <Stack direction="row" spacing={1}>
            <Button startIcon={<RefreshOutlinedIcon />} variant="outlined" onClick={() => loadData()} disabled={loading}>
              {t('actions.refresh', 'Recargar')}
            </Button>
            {canAdjust ? (
              <Button startIcon={<AddCircleOutlineOutlinedIcon />} variant="contained" onClick={() => setDialogOpen(true)}>
                {t('resellerWallet.actions.manualTopUp', 'Ajuste manual')}
              </Button>
            ) : null}
          </Stack>
        }
      >
        <Stack spacing={3}>
          <Box>
            <Typography variant="body1" color="text.secondary">
              {t(
                'resellerWallet.subtitle',
                'Saldo actual, historial de movimientos y consumo comercial del reseller. Las recargas se acreditan manualmente después del cobro externo.'
              )}
            </Typography>
          </Box>

          {summary.lowBalance ? (
            <Alert severity="warning" icon={<WarningAmberOutlinedIcon />}>
              {t(
                'resellerWallet.lowBalance',
                'El saldo está por debajo del umbral recomendado. Considera cargar créditos antes de nuevas activaciones.'
              )}
            </Alert>
          ) : null}

          <Grid container spacing={gridSpacing}>
            <Grid item xs={12} md={3}>
              {walletMetric(
                AccountBalanceWalletOutlinedIcon,
                t('resellerWallet.cards.available', 'Saldo disponible'),
                summary.availableCredits ?? 0,
                t('resellerWallet.cards.availableHelper', 'Créditos listos para activar nuevas ventas.'),
                'primary'
              )}
            </Grid>
            <Grid item xs={12} md={3}>
              {walletMetric(
                TrendingUpOutlinedIcon,
                t('resellerWallet.cards.credited', 'Créditos acreditados'),
                summary.lifetimeCredited ?? 0,
                t('resellerWallet.cards.creditedHelper', 'Total histórico de recargas manuales.'),
                'success'
              )}
            </Grid>
            <Grid item xs={12} md={3}>
              {walletMetric(
                TrendingDownOutlinedIcon,
                t('resellerWallet.cards.consumed', 'Créditos consumidos'),
                summary.lifetimeConsumed ?? 0,
                t('resellerWallet.cards.consumedHelper', 'Consumo acumulado por operaciones cobrables.'),
                'warning'
              )}
            </Grid>
            <Grid item xs={12} md={3}>
              {walletMetric(
                WarningAmberOutlinedIcon,
                t('resellerWallet.cards.threshold', 'Umbral de alerta'),
                summary.lowBalanceThreshold ?? 10,
                t('resellerWallet.cards.thresholdHelper', 'Cuando el saldo cae a este nivel, el dashboard marca alerta.'),
                'info'
              )}
            </Grid>
          </Grid>

          <Grid container spacing={gridSpacing}>
            <Grid item xs={12} lg={7}>
              <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                <CardContent>
                  <Stack spacing={2}>
                    <Typography variant="h5">{t('resellerWallet.ledger.title', 'Historial de movimientos')}</Typography>
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>{t('resellerWallet.ledger.headers.date', 'Fecha')}</TableCell>
                            <TableCell>{t('resellerWallet.ledger.headers.type', 'Tipo')}</TableCell>
                            <TableCell>{t('resellerWallet.ledger.headers.delta', 'Delta')}</TableCell>
                            <TableCell>{t('resellerWallet.ledger.headers.balance', 'Saldo')}</TableCell>
                            <TableCell>{t('resellerWallet.ledger.headers.reason', 'Motivo')}</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {ledgerRows.length ? (
                            ledgerRows.map((row) => (
                              <TableRow hover key={row.id}>
                                <TableCell>{formatDateTime(row.createdAt, locale)}</TableCell>
                                <TableCell>
                                  <Chip
                                    size="small"
                                    color={Number(row.creditsDelta) >= 0 ? 'success' : 'warning'}
                                    label={row.movementType || '-'}
                                  />
                                </TableCell>
                                <TableCell sx={{ fontWeight: 700, color: Number(row.creditsDelta) >= 0 ? 'success.main' : 'warning.main' }}>
                                  {Number(row.creditsDelta) > 0 ? '+' : ''}
                                  {row.creditsDelta}
                                </TableCell>
                                <TableCell>{row.balanceAfter}</TableCell>
                                <TableCell>{row.reason || '-'}</TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={5}>
                                <Typography variant="body2" color="text.secondary">
                                  {t('resellerWallet.ledger.empty', 'Todavía no hay movimientos registrados.')}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <TablePagination
                      component="div"
                      count={ledgerTotal}
                      page={index}
                      onPageChange={(_, nextPage) => setIndex(nextPage)}
                      rowsPerPage={size}
                      onRowsPerPageChange={(event) => {
                        setSize(Number(event.target.value));
                        setIndex(0);
                      }}
                      rowsPerPageOptions={[10, 20, 50]}
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} lg={5}>
              <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                <CardContent>
                  <Stack spacing={2}>
                    <Typography variant="h5">{t('resellerWallet.rules.title', 'Costo por operación')}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t(
                        'resellerWallet.rules.subtitle',
                        'En fase 1 el consumo automático se descuenta al crear suscripciones, usando los créditos oficiales configurados en cada paquete.'
                      )}
                    </Typography>
                    <Divider />
                    {packageRules.length ? (
                      packageRules.slice(0, 10).map((item) => (
                        <Stack key={item.packageId || item.name} direction="row" justifyContent="space-between" alignItems="center">
                          <Box>
                            <Typography variant="subtitle2">{item.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {t('resellerWallet.rules.helper', 'Se consume al crear la suscripción.')}
                            </Typography>
                          </Box>
                          <Chip color="primary" size="small" label={`${item.officialCredits} cr`} />
                        </Stack>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        {t('resellerWallet.rules.empty', 'No hay paquetes con créditos oficiales configurados todavía.')}
                      </Typography>
                    )}
                    <Alert severity="info">
                      {t(
                        'resellerWallet.rules.note',
                        'Si una operación requiere corrección comercial, ajusta el wallet manualmente mientras la compra automática de créditos llega en fase 2.'
                      )}
                    </Alert>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Stack>
      </MainCard>

      <Dialog open={dialogOpen} onClose={() => !saving && setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitleWithClose onClose={() => !saving && setDialogOpen(false)}>
          {t('resellerWallet.dialog.title', 'Ajuste manual de créditos')}
        </DialogTitleWithClose>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Alert severity="info">
              {t(
                'resellerWallet.dialog.helper',
                'Usa valores positivos para recargas y negativos para descuentos. Puedes enlazar la operación con una factura o compra si ya existe.'
              )}
            </Alert>
            <TextField
              fullWidth
              type="number"
              label={t('resellerWallet.dialog.creditsDelta', 'Créditos')}
              value={form.creditsDelta}
              onChange={(event) => setForm((prev) => ({ ...prev, creditsDelta: event.target.value }))}
            />
            <TextField
              fullWidth
              select
              label={t('resellerWallet.dialog.sourceType', 'Origen')}
              value={form.sourceType}
              onChange={(event) => setForm((prev) => ({ ...prev, sourceType: event.target.value }))}
            >
              <MenuItem value="MANUAL">MANUAL</MenuItem>
              <MenuItem value="INVOICE">INVOICE</MenuItem>
              <MenuItem value="BUSINESS_PURCHASE">BUSINESS_PURCHASE</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label={t('resellerWallet.dialog.sourceId', 'ID de referencia')}
              value={form.sourceId}
              onChange={(event) => setForm((prev) => ({ ...prev, sourceId: event.target.value }))}
            />
            <TextField
              fullWidth
              multiline
              minRows={3}
              label={t('resellerWallet.dialog.reason', 'Motivo')}
              value={form.reason}
              onChange={(event) => setForm((prev) => ({ ...prev, reason: event.target.value }))}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} disabled={saving}>
            {t('actions.cancel', 'Cancelar')}
          </Button>
          <Button variant="contained" onClick={handleSubmitAdjustment} disabled={saving}>
            {saving ? <Skeleton width={80} /> : t('resellerWallet.actions.apply', 'Aplicar ajuste')}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
