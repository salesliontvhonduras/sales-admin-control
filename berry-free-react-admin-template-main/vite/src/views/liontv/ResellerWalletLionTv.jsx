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
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import LinearProgress from '@mui/material/LinearProgress';
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
import Avatar from '@mui/material/Avatar';

import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import CreditScoreOutlinedIcon from '@mui/icons-material/CreditScoreOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined';
import TrendingDownOutlinedIcon from '@mui/icons-material/TrendingDownOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined';
import { alpha } from '@mui/material/styles';

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

function premiumSurface(theme, color = 'primary') {
  const palette = theme.palette[color] || theme.palette.primary;
  return {
    borderRadius: 3.5,
    border: '1px solid',
    borderColor:
      theme.palette.mode === 'dark' ? alpha(palette.main, 0.18) : alpha(palette.main, 0.14),
    boxShadow:
      theme.palette.mode === 'dark'
        ? '0 18px 34px rgba(2,8,23,0.26)'
        : `0 16px 30px ${alpha(theme.palette.common.black, 0.08)}`,
    background:
      theme.palette.mode === 'dark'
        ? 'linear-gradient(160deg, rgba(11,18,32,0.98) 0%, rgba(9,16,29,0.98) 100%)'
        : `linear-gradient(160deg, ${alpha(theme.palette.background.paper, 0.98)} 0%, ${alpha(palette.light, 0.14)} 100%)`
  };
}

function insetSurface(theme, color = 'primary') {
  const palette = theme.palette[color] || theme.palette.primary;
  return {
    borderRadius: 3,
    borderColor:
      theme.palette.mode === 'dark' ? alpha(palette.main, 0.18) : alpha(palette.main, 0.12),
    background:
      theme.palette.mode === 'dark'
        ? `linear-gradient(180deg, ${alpha(theme.palette.background.paper, 0.94)} 0%, ${alpha(palette.main, 0.14)} 100%)`
        : `linear-gradient(180deg, ${alpha(theme.palette.background.paper, 0.98)} 0%, ${alpha(palette.light, 0.12)} 100%)`
  };
}

function heroInsetSurface(theme) {
  return {
    borderRadius: 3.2,
    background:
      theme.palette.mode === 'dark'
        ? `linear-gradient(180deg, ${alpha(theme.palette.background.paper, 0.96)} 0%, ${alpha(theme.palette.primary.main, 0.16)} 100%)`
        : `linear-gradient(180deg, ${alpha(theme.palette.background.paper, 0.98)} 0%, ${alpha(theme.palette.primary.light, 0.16)} 100%)`,
    border: `1px solid ${alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.2 : 0.18)}`,
    boxShadow:
      theme.palette.mode === 'dark'
        ? `0 12px 24px ${alpha(theme.palette.common.black, 0.24)}`
        : `0 10px 24px ${alpha(theme.palette.common.black, 0.1)}`
  };
}

function formatDateTime(value, locale = 'es-HN') {
  if (!value) return '-';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString(locale);
}

function walletMetric(icon, title, value, helper, color = 'primary') {
  const Icon = icon;
  return (
    <Card
      sx={(theme) => ({
        ...premiumSurface(theme, color),
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at top right, ${alpha(theme.palette[color].main, theme.palette.mode === 'dark' ? 0.12 : 0.1)} 0%, transparent 56%)`,
          pointerEvents: 'none'
        }
      })}
    >
      <CardContent>
        <Stack spacing={1.5}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: '0.12em', fontWeight: 700 }}>
              {title}
            </Typography>
            <Avatar
              sx={(theme) => ({
                width: 46,
                height: 46,
                borderRadius: 2.8,
                color: theme.palette[color].main,
                bgcolor: `${theme.palette[color].main}16`,
                border: '1px solid',
                borderColor: `${theme.palette[color].main}24`
              })}
            >
              <Icon fontSize="small" />
            </Avatar>
          </Stack>
          <Typography variant="h3" sx={{ lineHeight: 1.05 }}>
            {value}
          </Typography>
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

function SectionHeader({ eyebrow, title, description, action }) {
  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      justifyContent="space-between"
      alignItems={{ xs: 'flex-start', md: 'flex-end' }}
      spacing={1.25}
    >
      <Box>
        {eyebrow ? (
          <Typography variant="overline" color="primary.main" sx={{ letterSpacing: '0.16em', fontWeight: 800 }}>
            {eyebrow}
          </Typography>
        ) : null}
        <Typography variant="h3" sx={{ mt: 0.25 }}>
          {title}
        </Typography>
        {description ? (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, maxWidth: 720 }}>
            {description}
          </Typography>
        ) : null}
      </Box>
      {action ? <Box>{action}</Box> : null}
    </Stack>
  );
}

export default function ResellerWalletLionTv() {
  const { t, i18n } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { accessToken, user } = useAuth();
  const locale = String(i18n?.resolvedLanguage || i18n?.language || 'es').toLowerCase().startsWith('en') ? 'en-US' : 'es-HN';
  const language = locale === 'en-US' ? 'en' : 'es';
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
  const lastRequest = useMemo(() => (creditRequests.length ? creditRequests[0] : null), [creditRequests]);
  const lowBalanceThreshold = Number(summary?.lowBalanceThreshold || 0);
  const availableCredits = Number(summary?.availableCredits || 0);
  const thresholdProgress = lowBalanceThreshold > 0 ? Math.min((availableCredits / lowBalanceThreshold) * 100, 100) : 100;
  const walletCopy = useMemo(
    () =>
      language === 'en'
        ? {
            heroBadge: 'Commercial wallet',
            heroTitle: 'Request credits with a flow that feels premium and fast',
            heroSubtitle:
              'This module now behaves like a reseller finance console: clear balance, clean request experience, pending status visibility and movement history in one place.',
            sections: {
              requestEyebrow: 'Request flow',
              requestTitle: 'Ask for credits without internal friction',
              requestDescription:
                'Pick the amount, leave a short note if needed and send the request. Admin receives it as a pending internal purchase.',
              activityEyebrow: 'Wallet intelligence',
              activityTitle: 'Signals you should watch before selling more',
              activityDescription: 'These cards tell you if balance is healthy, if requests are still pending and what changed recently.',
              ledgerEyebrow: 'Movement history',
              ledgerTitle: 'Full wallet ledger',
              ledgerDescription: 'Use this table as your financial trace for credits consumed, manual top-ups and wallet adjustments.'
            }
          }
        : {
            heroBadge: 'Wallet comercial',
            heroTitle: 'Solicita créditos con una experiencia más premium y rápida',
            heroSubtitle:
              'Este módulo ahora funciona como una consola financiera reseller: saldo claro, solicitud limpia, visibilidad de pendientes e historial de movimientos en un solo lugar.',
            sections: {
              requestEyebrow: 'Flujo de solicitud',
              requestTitle: 'Pide créditos sin fricción interna',
              requestDescription:
                'Define la cantidad, deja una nota corta si hace falta y envía la solicitud. Admin la recibe como una compra interna pendiente.',
              activityEyebrow: 'Inteligencia del wallet',
              activityTitle: 'Señales que debes vigilar antes de vender más',
              activityDescription:
                'Estas tarjetas te dicen si el saldo está saludable, si aún hay solicitudes abiertas y qué cambió recientemente.',
              ledgerEyebrow: 'Historial de movimientos',
              ledgerTitle: 'Ledger completo del wallet',
              ledgerDescription:
                'Usa esta tabla como trazabilidad financiera de créditos consumidos, recargas manuales y ajustes del wallet.'
            }
          },
    [language]
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
              borderColor: theme.palette.mode === 'dark' ? 'rgba(148, 163, 184, 0.12)' : 'rgba(15, 23, 42, 0.08)',
              color: 'common.white',
              background:
                theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, #07111f 0%, #0f172a 32%, #133b5c 64%, #164e63 100%)'
                  : 'linear-gradient(135deg, #0f172a 0%, #1d4ed8 34%, #0f766e 68%, #16a34a 120%)',
              boxShadow: theme.palette.mode === 'dark' ? '0 28px 52px rgba(2, 8, 23, 0.42)' : '0 24px 46px rgba(15, 23, 42, 0.18)'
            })}
          >
            <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={8}>
                  <Stack spacing={1.25}>
                    <Chip
                      icon={<CreditScoreOutlinedIcon />}
                      label={walletCopy.heroBadge}
                      sx={{ alignSelf: 'flex-start', bgcolor: 'rgba(255,255,255,0.14)', color: 'common.white', fontWeight: 700 }}
                    />
                    <Typography variant="h2" sx={{ fontSize: { xs: '1.9rem', md: '2.4rem' } }}>
                      {walletCopy.heroTitle}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.82)', maxWidth: 720 }}>
                      {walletCopy.heroSubtitle}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card sx={(theme) => heroInsetSurface(theme)}>
                    <CardContent>
                      <Stack spacing={1.1}>
                        <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.72)', letterSpacing: '0.12em', fontWeight: 700 }}>
                          {t('resellerWallet.hero.balanceLabel', 'Saldo disponible')}
                        </Typography>
                        <Typography variant="h1" sx={{ lineHeight: 1 }}>
                          {availableCredits}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.72)' }}>
                          {t('resellerWallet.hero.balanceHelper', 'Créditos listos para ventas nuevas y renovaciones.')}
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={thresholdProgress}
                          sx={{
                            height: 8,
                            borderRadius: 999,
                            bgcolor: 'rgba(255,255,255,0.12)',
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 999,
                              bgcolor: summary.lowBalance ? '#f59e0b' : '#22c55e'
                            }
                          }}
                        />
                        <Chip
                          color={summary.lowBalance ? 'warning' : 'success'}
                          label={
                            summary.lowBalance
                              ? t('resellerWallet.hero.balanceLow', 'Recarga recomendada')
                              : t('resellerWallet.hero.balanceHealthy', 'Saldo saludable')
                          }
                          sx={{ alignSelf: 'flex-start', fontWeight: 700 }}
                        />
                        <Grid container spacing={1.2}>
                          <Grid item xs={6}>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.68)' }}>
                              {language === 'en' ? 'Threshold' : 'Umbral'}
                            </Typography>
                            <Typography variant="h6" color="common.white">
                              {lowBalanceThreshold || 0}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.68)' }}>
                              {language === 'en' ? 'Pending' : 'Pendientes'}
                            </Typography>
                            <Typography variant="h6" color="common.white">
                              {pendingRequests}
                            </Typography>
                          </Grid>
                        </Grid>
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
            <Grid item xs={12}>
              <SectionHeader
                eyebrow={walletCopy.sections.activityEyebrow}
                title={walletCopy.sections.activityTitle}
                description={walletCopy.sections.activityDescription}
              />
            </Grid>
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
              <Card
                sx={(theme) => ({
                  ...premiumSurface(theme, 'primary'),
                  height: '100%'
                })}
              >
                <CardContent>
                  <Stack spacing={2.25}>
                    <SectionHeader
                      eyebrow={walletCopy.sections.requestEyebrow}
                      title={walletCopy.sections.requestTitle}
                      description={walletCopy.sections.requestDescription}
                    />

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

                    <Grid container spacing={1.5}>
                      {[
                        {
                          icon: BoltOutlinedIcon,
                          title: language === 'en' ? 'No internal codes' : 'Sin códigos internos',
                          text:
                            language === 'en'
                              ? 'The reseller only chooses quantity and sends the request.'
                              : 'El reseller solo elige cantidad y envía la solicitud.'
                        },
                        {
                          icon: TaskAltOutlinedIcon,
                          title: language === 'en' ? 'Admin receives it' : 'Admin la recibe',
                          text:
                            language === 'en'
                              ? 'The request lands as a pending admin purchase ready to process.'
                              : 'La solicitud cae como compra admin pendiente lista para procesar.'
                        },
                        {
                          icon: InsightsOutlinedIcon,
                          title: language === 'en' ? 'Traceable flow' : 'Flujo trazable',
                          text:
                            language === 'en'
                              ? 'The wallet and the request history keep the operation auditable.'
                              : 'El wallet y el historial de solicitudes mantienen la operación auditable.'
                        }
                      ].map((item) => (
                        <Grid item xs={12} md={4} key={item.title}>
                          <Card
                            variant="outlined"
                            sx={(theme) => ({
                              ...insetSurface(theme, 'primary'),
                              height: '100%'
                            })}
                          >
                            <CardContent>
                              <Stack spacing={1}>
                                <Avatar
                                  variant="rounded"
                                  sx={(theme) => ({
                                    width: 38,
                                    height: 38,
                                    borderRadius: 2.4,
                                    bgcolor: `${theme.palette.primary.main}16`,
                                    color: 'primary.main'
                                  })}
                                >
                                  <item.icon fontSize="small" />
                                </Avatar>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                  {item.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {item.text}
                                </Typography>
                              </Stack>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>

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
              <Stack spacing={gridSpacing} sx={{ height: '100%' }}>
                <Card
                  sx={(theme) => ({
                    ...premiumSurface(theme, 'secondary')
                  })}
                >
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
                            <Card
                              key={request.id}
                              variant="outlined"
                              sx={(theme) => ({
                                ...insetSurface(theme, statusColor(request.status) === 'default' ? 'primary' : statusColor(request.status)),
                                borderRadius: 2.8
                              })}
                            >
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

                <Card
                  sx={(theme) => ({
                    ...premiumSurface(theme, 'info')
                  })}
                >
                  <CardContent>
                    <Stack spacing={1.4}>
                      <Typography variant="h4">{language === 'en' ? 'Wallet snapshot' : 'Snapshot del wallet'}</Typography>
                      <Divider />
                      <Grid container spacing={1.5}>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">
                            {language === 'en' ? 'Last movement' : 'Último movimiento'}
                          </Typography>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                            {formatDateTime(summary.lastEventAt, locale)}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">
                            {language === 'en' ? 'Open requests' : 'Solicitudes abiertas'}
                          </Typography>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                            {pendingRequests}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">
                            {language === 'en' ? 'Low balance threshold' : 'Umbral de saldo bajo'}
                          </Typography>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                            {lowBalanceThreshold}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">
                            {language === 'en' ? 'Last request' : 'Última solicitud'}
                          </Typography>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                            {lastRequest ? `${Number(lastRequest.quantity || 0)} cr` : '-'}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
          </Grid>

          <SectionHeader
            eyebrow={walletCopy.sections.ledgerEyebrow}
            title={walletCopy.sections.ledgerTitle}
            description={walletCopy.sections.ledgerDescription}
          />

          <Card
            sx={(theme) => ({
              ...premiumSurface(theme, 'primary')
            })}
          >
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
