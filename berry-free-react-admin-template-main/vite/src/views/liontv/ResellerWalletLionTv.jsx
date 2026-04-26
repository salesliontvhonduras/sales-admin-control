import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import useAuth from 'hooks/useAuth';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import CreditScoreOutlinedIcon from '@mui/icons-material/CreditScoreOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined';
import TrendingDownOutlinedIcon from '@mui/icons-material/TrendingDownOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';

import MainCard from 'ui-component/cards/MainCard';
import DialogTitleWithClose from 'ui-component/dialogs/DialogTitleWithClose';
import { PageEmptyState, PageErrorState, PageLoadingState } from 'ui-component/feedback/PageState';
import { gridSpacing } from 'store/constant';
import { createCreditRequest, listCreditRequests } from 'api/liontv-credit-requests';
import { createResellerWalletAdjustment, getResellerWalletLedger, getResellerWalletSummary } from 'api/liontv-reseller-wallet';
import { hasPermissionExact } from 'utils/rbac';

const DEFAULT_ADJUSTMENT_FORM = {
  creditsDelta: '',
  reason: '',
  sourceType: 'MANUAL',
  sourceId: ''
};

const DEFAULT_REQUEST_FORM = {
  credits: 25,
  notes: ''
};

const QUICK_CREDIT_OPTIONS = [10, 25, 50, 100, 250, 500];

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

function statusColor(status) {
  const normalized = String(status || '').toUpperCase();
  if (normalized === 'PAID') return 'success';
  if (normalized === 'PENDING') return 'warning';
  if (normalized === 'PARTIAL') return 'info';
  if (normalized === 'CANCELLED') return 'error';
  return 'default';
}

function createCreditPurchaseCode() {
  return `CR-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
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
  const [creditRequests, setCreditRequests] = useState([]);
  const [index, setIndex] = useState(0);
  const [size, setSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adjustDialogOpen, setAdjustDialogOpen] = useState(false);
  const [adjustSaving, setAdjustSaving] = useState(false);
  const [requestSaving, setRequestSaving] = useState(false);
  const [adjustForm, setAdjustForm] = useState(DEFAULT_ADJUSTMENT_FORM);
  const [requestForm, setRequestForm] = useState(DEFAULT_REQUEST_FORM);

  const loadData = useCallback(
    async ({ silent = false } = {}) => {
      if (!accessToken) return;
      if (!silent) setLoading(true);
      setError('');
      try {
        const [summaryPayload, ledgerPayload, requestsPayload] = await Promise.all([
          getResellerWalletSummary({ skipAuthRedirect: true }),
          getResellerWalletLedger({ index, size }, { skipAuthRedirect: true }),
          listCreditRequests({ index: 0, size: 6 }, { skipAuthRedirect: true })
        ]);

        setSummary(summaryPayload);
        setLedgerRows(Array.isArray(ledgerPayload?.data) ? ledgerPayload.data : []);
        setLedgerTotal(Number(ledgerPayload?.total || 0));
        setCreditRequests(Array.isArray(requestsPayload?.data) ? requestsPayload.data : []);
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

  const pendingRequests = useMemo(
    () => creditRequests.filter((item) => String(item.status || '').toUpperCase() === 'PENDING').length,
    [creditRequests]
  );

  const handleSubmitAdjustment = async () => {
    const creditsDelta = Number(adjustForm.creditsDelta);
    if (!Number.isFinite(creditsDelta) || creditsDelta === 0) {
      enqueueSnackbar(t('resellerWallet.messages.invalidDelta', 'Ingresa un ajuste distinto de cero.'), { variant: 'warning' });
      return;
    }

    setAdjustSaving(true);
    try {
      await createResellerWalletAdjustment(
        {
          creditsDelta,
          reason: adjustForm.reason || null,
          sourceType: adjustForm.sourceType || 'MANUAL',
          sourceId: adjustForm.sourceId ? Number(adjustForm.sourceId) : null
        },
        { skipAuthRedirect: true }
      );
      enqueueSnackbar(t('resellerWallet.messages.adjusted', 'Wallet actualizado correctamente.'), { variant: 'success' });
      setAdjustDialogOpen(false);
      setAdjustForm(DEFAULT_ADJUSTMENT_FORM);
      await loadData({ silent: true });
    } catch (err) {
      enqueueSnackbar(err?.response?.data?.message || t('resellerWallet.errors.adjust', 'No se pudo aplicar el ajuste.'), {
        variant: 'error'
      });
    } finally {
      setAdjustSaving(false);
    }
  };

  const handleCreateRequest = async () => {
    const credits = Number(requestForm.credits);
    if (!Number.isFinite(credits) || credits <= 0) {
      enqueueSnackbar(t('resellerWallet.messages.invalidRequestCredits', 'Ingresa una cantidad válida de créditos.'), {
        variant: 'warning'
      });
      return;
    }

    setRequestSaving(true);
    try {
      await createCreditRequest(
        {
          purchaseCode: createCreditPurchaseCode(),
          purchaseType: 'LION_TV_CREDITS',
          category: 'CREDITS',
          providerName: 'LION_TV_PLATFORM',
          itemName: `Solicitud de ${credits} créditos`,
          description: `Solicitud manual de recarga reseller por ${credits} créditos`,
          quantity: credits,
          unitCost: 0,
          totalAmount: 0,
          currency: 'HNL',
          purchaseDate: todayIsoDate(),
          paymentMethod: 'OTHER',
          businessArea: 'IPTV',
          status: 'PENDING',
          isRecurring: false,
          recurrenceType: 'NONE',
          notes: requestForm.notes || null
        },
        { skipAuthRedirect: true }
      );
      enqueueSnackbar(
        t(
          'resellerWallet.messages.requestCreated',
          'La solicitud de créditos fue enviada a administración. Te notificarán cuando la recarga quede acreditada.'
        ),
        { variant: 'success' }
      );
      setRequestForm(DEFAULT_REQUEST_FORM);
      await loadData({ silent: true });
    } catch (err) {
      enqueueSnackbar(err?.response?.data?.message || t('resellerWallet.errors.request', 'No se pudo crear la solicitud de créditos.'), {
        variant: 'error'
      });
    } finally {
      setRequestSaving(false);
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
              <Button startIcon={<AddCircleOutlineOutlinedIcon />} variant="contained" onClick={() => setAdjustDialogOpen(true)}>
                {t('resellerWallet.actions.manualTopUp', 'Ajuste admin')}
              </Button>
            ) : null}
          </Stack>
        }
      >
        <Stack spacing={3}>
          <Card
            sx={(theme) => ({
              borderRadius: 4,
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'divider',
              color: 'common.white',
              background:
                theme.palette.mode === 'dark'
                  ? `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 52%, #020617 100%)`
                  : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 52%, #111827 100%)`
            })}
          >
            <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={8}>
                  <Stack spacing={1.25}>
                    <Chip
                      icon={<CreditScoreOutlinedIcon />}
                      label={t('resellerWallet.hero.badge', 'Saldo y recargas')}
                      sx={{ alignSelf: 'flex-start', bgcolor: 'rgba(255,255,255,0.14)', color: 'common.white', fontWeight: 700 }}
                    />
                    <Typography variant="h2" sx={{ fontSize: { xs: '1.9rem', md: '2.4rem' } }}>
                      {t('resellerWallet.hero.title', 'Pide créditos sin escribir códigos ni referencias internas')}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.82)', maxWidth: 720 }}>
                      {t(
                        'resellerWallet.hero.subtitle',
                        'Solo define cuántos créditos necesitas y envía la solicitud. Administración la recibe en su módulo interno y luego acredita tu saldo.'
                      )}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card sx={{ borderRadius: 3, bgcolor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)' }}>
                    <CardContent>
                      <Stack spacing={1}>
                        <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.72)' }}>
                          {t('resellerWallet.hero.balanceLabel', 'Saldo disponible')}
                        </Typography>
                        <Typography variant="h1" sx={{ lineHeight: 1 }}>
                          {summary.availableCredits ?? 0}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.72)' }}>
                          {t('resellerWallet.hero.balanceHelper', 'Créditos listos para ventas nuevas y renovaciones.')}
                        </Typography>
                        <Chip
                          color={summary.lowBalance ? 'warning' : 'success'}
                          label={
                            summary.lowBalance
                              ? t('resellerWallet.hero.balanceLow', 'Recarga recomendada')
                              : t('resellerWallet.hero.balanceHealthy', 'Saldo saludable')
                          }
                          sx={{ alignSelf: 'flex-start', fontWeight: 700 }}
                        />
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {summary.lowBalance ? (
            <Alert severity="warning" icon={<WarningAmberOutlinedIcon />}>
              {t(
                'resellerWallet.lowBalance',
                'Tu saldo está por debajo del umbral recomendado. Solicita más créditos antes de seguir activando cuentas.'
              )}
            </Alert>
          ) : null}

          <Grid container spacing={gridSpacing}>
            <Grid item xs={12} md={3}>
              {walletMetric(
                AccountBalanceWalletOutlinedIcon,
                t('resellerWallet.cards.available', 'Saldo disponible'),
                summary.availableCredits ?? 0,
                t('resellerWallet.cards.availableHelper', 'Disponible para activaciones inmediatas.'),
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
                RequestQuoteOutlinedIcon,
                t('resellerWallet.cards.pendingRequests', 'Solicitudes pendientes'),
                pendingRequests,
                t('resellerWallet.cards.pendingRequestsHelper', 'Recargas enviadas a administración y aún no procesadas.'),
                'secondary'
              )}
            </Grid>
          </Grid>

          <Grid container spacing={gridSpacing}>
            <Grid item xs={12} lg={7}>
              <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', height: '100%' }}>
                <CardContent>
                  <Stack spacing={2.25}>
                    <Box>
                      <Typography variant="h4">{t('resellerWallet.buy.title', 'Solicitar créditos')}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t(
                          'resellerWallet.buy.subtitle',
                          'Elige cuántos créditos necesitas. La solicitud llega al módulo admin y tu saldo se acredita cuando el pago sea confirmado.'
                        )}
                      </Typography>
                    </Box>

                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {QUICK_CREDIT_OPTIONS.map((option) => (
                        <Chip
                          key={option}
                          clickable
                          color={Number(requestForm.credits) === option ? 'primary' : 'default'}
                          variant={Number(requestForm.credits) === option ? 'filled' : 'outlined'}
                          label={`${option} cr`}
                          onClick={() => setRequestForm((prev) => ({ ...prev, credits: option }))}
                          sx={{ fontWeight: 700 }}
                        />
                      ))}
                    </Stack>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          type="number"
                          label={t('resellerWallet.buy.credits', 'Créditos deseados')}
                          value={requestForm.credits}
                          onChange={(event) => setRequestForm((prev) => ({ ...prev, credits: event.target.value }))}
                        />
                      </Grid>
                      <Grid item xs={12} sm={8}>
                        <TextField
                          fullWidth
                          label={t('resellerWallet.buy.notes', 'Nota opcional')}
                          placeholder={t('resellerWallet.buy.notesPlaceholder', 'Ejemplo: necesito recargar antes de las renovaciones del día 2')}
                          value={requestForm.notes}
                          onChange={(event) => setRequestForm((prev) => ({ ...prev, notes: event.target.value }))}
                        />
                      </Grid>
                    </Grid>

                    <Alert severity="info">
                      {t(
                        'resellerWallet.buy.helper',
                        'No necesitas digitar IDs ni referencias internas. El sistema genera la solicitud y administración la recibe como compra pendiente de créditos.'
                      )}
                    </Alert>

                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<CreditScoreOutlinedIcon />}
                      onClick={handleCreateRequest}
                      disabled={requestSaving}
                      sx={{ alignSelf: 'flex-start', minWidth: 220 }}
                    >
                      {requestSaving ? t('resellerWallet.buy.sending', 'Enviando...') : t('resellerWallet.buy.action', 'Enviar solicitud')}
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} lg={5}>
              <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', height: '100%' }}>
                <CardContent>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="h4">{t('resellerWallet.requests.title', 'Últimas solicitudes')}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t(
                          'resellerWallet.requests.subtitle',
                          'Aquí ves el estado de tus recargas recientes mientras administración las procesa.'
                        )}
                      </Typography>
                    </Box>

                    {creditRequests.length ? (
                      <Stack spacing={1.25}>
                        {creditRequests.map((request) => (
                          <Card key={request.id} variant="outlined" sx={{ borderRadius: 2.5 }}>
                            <CardContent sx={{ p: 2 }}>
                              <Stack spacing={1}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                    {request.itemName || t('resellerWallet.requests.fallback', 'Solicitud de créditos')}
                                  </Typography>
                                  <Chip size="small" color={statusColor(request.status)} label={request.status || 'PENDING'} />
                                </Stack>
                                <Stack direction="row" spacing={1} flexWrap="wrap">
                                  <Chip
                                    size="small"
                                    variant="outlined"
                                    icon={<CreditScoreOutlinedIcon fontSize="small" />}
                                    label={`${Number(request.quantity || 0)} cr`}
                                  />
                                  <Chip
                                    size="small"
                                    variant="outlined"
                                    icon={<HistoryOutlinedIcon fontSize="small" />}
                                    label={formatDateTime(request.createdAt || request.purchaseDate, locale)}
                                  />
                                </Stack>
                                <Typography variant="body2" color="text.secondary">
                                  {request.notes || t('resellerWallet.requests.noNotes', 'Sin notas adicionales en esta solicitud.')}
                                </Typography>
                              </Stack>
                            </CardContent>
                          </Card>
                        ))}
                      </Stack>
                    ) : (
                      <Alert severity="info">
                        {t('resellerWallet.requests.empty', 'Todavía no has enviado solicitudes de créditos.')}
                      </Alert>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
            <CardContent>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="h4">{t('resellerWallet.ledger.title', 'Historial de movimientos')}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('resellerWallet.ledger.subtitle', 'Consulta recargas acreditadas y consumos históricos del wallet.')}
                  </Typography>
                </Box>
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
                              <Chip size="small" color={Number(row.creditsDelta) >= 0 ? 'success' : 'warning'} label={row.movementType || '-'} />
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
        </Stack>
      </MainCard>

      <Dialog open={adjustDialogOpen} onClose={() => !adjustSaving && setAdjustDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitleWithClose onClose={() => !adjustSaving && setAdjustDialogOpen(false)}>
          {t('resellerWallet.dialog.title', 'Ajuste manual de créditos')}
        </DialogTitleWithClose>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Alert severity="info">
              {t(
                'resellerWallet.dialog.helper',
                'Este formulario es solo para operación interna. Usa valores positivos para recargas y negativos para descuentos.'
              )}
            </Alert>
            <TextField
              fullWidth
              type="number"
              label={t('resellerWallet.dialog.creditsDelta', 'Créditos')}
              value={adjustForm.creditsDelta}
              onChange={(event) => setAdjustForm((prev) => ({ ...prev, creditsDelta: event.target.value }))}
            />
            <TextField
              fullWidth
              select
              label={t('resellerWallet.dialog.sourceType', 'Origen')}
              value={adjustForm.sourceType}
              onChange={(event) => setAdjustForm((prev) => ({ ...prev, sourceType: event.target.value }))}
            >
              <MenuItem value="MANUAL">MANUAL</MenuItem>
              <MenuItem value="INVOICE">INVOICE</MenuItem>
              <MenuItem value="BUSINESS_PURCHASE">BUSINESS_PURCHASE</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label={t('resellerWallet.dialog.sourceId', 'ID de referencia')}
              value={adjustForm.sourceId}
              onChange={(event) => setAdjustForm((prev) => ({ ...prev, sourceId: event.target.value }))}
            />
            <TextField
              fullWidth
              multiline
              minRows={3}
              label={t('resellerWallet.dialog.reason', 'Motivo')}
              value={adjustForm.reason}
              onChange={(event) => setAdjustForm((prev) => ({ ...prev, reason: event.target.value }))}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAdjustDialogOpen(false)} disabled={adjustSaving}>
            {t('actions.cancel', 'Cancelar')}
          </Button>
          <Button variant="contained" onClick={handleSubmitAdjustment} disabled={adjustSaving}>
            {adjustSaving ? <Skeleton width={80} /> : t('resellerWallet.actions.apply', 'Aplicar ajuste')}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
