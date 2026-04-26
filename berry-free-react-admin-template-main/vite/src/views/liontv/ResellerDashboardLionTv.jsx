import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import CreditScoreOutlinedIcon from '@mui/icons-material/CreditScoreOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import HubOutlinedIcon from '@mui/icons-material/HubOutlined';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import RocketLaunchOutlinedIcon from '@mui/icons-material/RocketLaunchOutlined';
import RouterOutlinedIcon from '@mui/icons-material/RouterOutlined';
import SubscriptionsOutlinedIcon from '@mui/icons-material/SubscriptionsOutlined';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import ViewTimelineOutlinedIcon from '@mui/icons-material/ViewTimelineOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';

import MainCard from 'ui-component/cards/MainCard';
import { PageErrorState, PageLoadingState } from 'ui-component/feedback/PageState';
import { gridSpacing } from 'store/constant';
import { getResellerWalletSummary } from 'api/liontv-reseller-wallet';

function metricCard(icon, title, value, helper, color = 'primary') {
  const Icon = icon;
  return (
    <Card
      sx={(theme) => ({
        height: '100%',
        borderRadius: 3.5,
        border: '1px solid',
        borderColor: theme.palette.mode === 'dark' ? 'rgba(148, 163, 184, 0.12)' : 'rgba(15, 23, 42, 0.08)',
        overflow: 'hidden',
        boxShadow: theme.palette.mode === 'dark' ? '0 18px 34px rgba(2,8,23,0.26)' : '0 16px 28px rgba(15,23,42,0.06)',
        background:
          theme.palette.mode === 'dark'
            ? 'linear-gradient(160deg, rgba(11,18,32,0.98) 0%, rgba(9,16,29,0.98) 100%)'
            : 'linear-gradient(160deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at top right, ${theme.palette[color].main}22 0%, transparent 56%)`,
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
            <Box
              sx={(theme) => ({
                width: 46,
                height: 46,
                borderRadius: 2.8,
                display: 'grid',
                placeItems: 'center',
                color: theme.palette[color].main,
                bgcolor: `${theme.palette[color].main}16`,
                border: '1px solid',
                borderColor: `${theme.palette[color].main}24`
              })}
            >
              <Icon fontSize="small" />
            </Box>
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

function quickActionCard({ icon, title, helper, actionLabel, onClick, color = 'primary' }) {
  const Icon = icon;
  return (
    <Card
      sx={(theme) => ({
        height: '100%',
        borderRadius: 3.5,
        border: '1px solid',
        borderColor: theme.palette.mode === 'dark' ? 'rgba(148, 163, 184, 0.12)' : 'rgba(15, 23, 42, 0.08)',
        cursor: 'pointer',
        transition: 'transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease, background 0.18s ease',
        background:
          theme.palette.mode === 'dark'
            ? 'linear-gradient(160deg, rgba(11,18,32,0.98) 0%, rgba(9,16,29,0.98) 100%)'
            : 'linear-gradient(160deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: theme.palette.mode === 'dark' ? '0 18px 34px rgba(2,8,23,0.26)' : theme.shadows[8],
          borderColor: `${theme.palette[color].main}55`,
          background:
            theme.palette.mode === 'dark'
              ? `linear-gradient(160deg, rgba(11,18,32,0.98) 0%, ${theme.palette[color].dark}20 100%)`
              : `linear-gradient(160deg, rgba(255,255,255,0.98) 0%, ${theme.palette[color].light}18 100%)`
        }
      })}
      onClick={onClick}
    >
      <CardContent>
        <Stack spacing={1.5}>
          <Box
            sx={(theme) => ({
              width: 50,
              height: 50,
              borderRadius: 3,
              display: 'grid',
              placeItems: 'center',
              color: theme.palette[color].main,
              bgcolor: `${theme.palette[color].main}16`
            })}
          >
            <Icon fontSize="small" />
          </Box>
          <Box>
            <Typography variant="h5">{title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {helper}
            </Typography>
          </Box>
          <Button variant="text" sx={{ p: 0, justifyContent: 'flex-start', textTransform: 'none', fontWeight: 700 }}>
            {actionLabel}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

function focusCard({ title, value, helper, buttonLabel, onClick, color = 'primary' }) {
  return (
    <Card
      sx={(theme) => ({
        height: '100%',
        borderRadius: 3.5,
        border: '1px solid',
        borderColor: theme.palette.mode === 'dark' ? 'rgba(148, 163, 184, 0.12)' : 'rgba(15, 23, 42, 0.08)',
        background:
          theme.palette.mode === 'dark'
            ? 'linear-gradient(160deg, rgba(11,18,32,0.98) 0%, rgba(9,16,29,0.98) 100%)'
            : 'linear-gradient(160deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)'
      })}
    >
      <CardContent>
        <Stack spacing={1.5}>
          <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: '0.12em', fontWeight: 700 }}>
            {title}
          </Typography>
          <Typography variant="h3" color={`${color}.main`}>
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {helper}
          </Typography>
          <Button variant="outlined" color={color} onClick={onClick} sx={{ alignSelf: 'flex-start', textTransform: 'none' }}>
            {buttonLabel}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function ResellerDashboardLionTv({
  customers,
  subscriptions,
  licenses,
  invoices,
  expirationAttentionCount,
  sharedRiskKpi,
  loadingCore,
  errorMessage,
  onRefresh
}) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const locale = String(i18n?.resolvedLanguage || i18n?.language || 'es').toLowerCase().startsWith('en') ? 'en' : 'es';
  const [walletSummary, setWalletSummary] = useState(null);
  const [walletLoading, setWalletLoading] = useState(true);
  const [walletError, setWalletError] = useState('');

  const loadWallet = useCallback(async () => {
    setWalletLoading(true);
    setWalletError('');
    try {
      const summaryPayload = await getResellerWalletSummary({ skipAuthRedirect: true });
      setWalletSummary(summaryPayload);
    } catch (error) {
      setWalletError(error?.response?.data?.message || t('resellerDashboard.errors.wallet', 'No se pudo cargar el saldo reseller.'));
    } finally {
      setWalletLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadWallet();
  }, [loadWallet]);

  const activeSubscriptions = useMemo(
    () => subscriptions.filter((item) => String(item.status || '').toUpperCase() === 'ACTIVE').length,
    [subscriptions]
  );
  const activeLicenses = useMemo(
    () => licenses.filter((item) => ['ACTIVE', 'IN_USE'].includes(String(item.status || '').toUpperCase())).length,
    [licenses]
  );
  const pendingInvoices = useMemo(
    () => invoices.filter((item) => String(item.status || '').toUpperCase() === 'PENDING').length,
    [invoices]
  );

  const quickActions = useMemo(
    () => [
      {
        icon: GroupsOutlinedIcon,
        title: t('resellerDashboard.quick.customers.title', 'Clientes'),
        helper: t('resellerDashboard.quick.customers.helper', 'Administra tu cartera y crea nuevos clientes.'),
        actionLabel: t('resellerDashboard.quick.customers.action', 'Abrir clientes'),
        onClick: () => navigate('/liontv/customers'),
        color: 'primary'
      },
      {
        icon: SubscriptionsOutlinedIcon,
        title: t('resellerDashboard.quick.subscriptions.title', 'Suscripciones'),
        helper: t('resellerDashboard.quick.subscriptions.helper', 'Crea, renueva y reorganiza planes rápidamente.'),
        actionLabel: t('resellerDashboard.quick.subscriptions.action', 'Abrir suscripciones'),
        onClick: () => navigate('/liontv/subscriptions'),
        color: 'info'
      },
      {
        icon: VpnKeyOutlinedIcon,
        title: t('resellerDashboard.quick.licenses.title', 'Licencias'),
        helper: t('resellerDashboard.quick.licenses.helper', 'Gestiona activaciones, cambios de server y soporte.'),
        actionLabel: t('resellerDashboard.quick.licenses.action', 'Abrir licencias'),
        onClick: () => navigate('/liontv/licenses'),
        color: 'warning'
      },
      {
        icon: RouterOutlinedIcon,
        title: t('resellerDashboard.quick.lines.title', 'Lines'),
        helper: t('resellerDashboard.quick.lines.helper', 'Revisa líneas activas, capacidad y vencimientos.'),
        actionLabel: t('resellerDashboard.quick.lines.action', 'Abrir lines'),
        onClick: () => navigate('/liontv/lines'),
        color: 'secondary'
      },
      {
        icon: ViewTimelineOutlinedIcon,
        title: t('resellerDashboard.quick.plusLines.title', 'Plus Lines'),
        helper: t('resellerDashboard.quick.plusLines.helper', 'Consulta líneas plus y su estado actual.'),
        actionLabel: t('resellerDashboard.quick.plusLines.action', 'Abrir plus lines'),
        onClick: () => navigate('/liontv/plus-lines'),
        color: 'success'
      },
      {
        icon: HubOutlinedIcon,
        title: t('resellerDashboard.quick.shared.title', 'Shared Subscriptions'),
        helper: t('resellerDashboard.quick.shared.helper', 'Ordena hosts, shared y buckets por día.'),
        actionLabel: t('resellerDashboard.quick.shared.action', 'Abrir shared'),
        onClick: () => navigate('/liontv/subscription-sharing'),
        color: 'error'
      }
    ],
    [navigate, t]
  );

  if (loadingCore && walletLoading) {
    return (
      <PageLoadingState
        title={t('menu.liontvDashboard', 'Lion TV Dashboard')}
        description={t('resellerDashboard.loading', 'Preparando consola reseller...')}
      />
    );
  }

  if (errorMessage && !customers.length && !walletSummary) {
    return (
      <PageErrorState
        title={t('menu.liontvDashboard', 'Lion TV Dashboard')}
        description={errorMessage}
        onRetry={() => {
          onRefresh?.();
          loadWallet();
        }}
      />
    );
  }

  return (
    <Stack spacing={gridSpacing}>
      <MainCard
        title={t('menu.liontvDashboard', 'Lion TV Dashboard')}
        secondary={
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<RefreshOutlinedIcon />} onClick={onRefresh}>
              {t('actions.refresh', 'Recargar')}
            </Button>
            <Button variant="contained" startIcon={<AddCircleOutlineOutlinedIcon />} onClick={() => navigate('/liontv/reseller-wallet')}>
              {t('resellerDashboard.actions.buyCredits', 'Solicitar créditos')}
            </Button>
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
                  <Stack spacing={1.5}>
                    <Chip
                      label={locale === 'en' ? 'Reseller command center' : 'Centro reseller'}
                      sx={{ alignSelf: 'flex-start', bgcolor: 'rgba(255,255,255,0.14)', color: 'common.white', fontWeight: 700 }}
                    />
                    <Typography variant="h2" sx={{ fontSize: { xs: '1.9rem', md: '2.5rem' } }}>
                      {locale === 'en'
                        ? 'Sell faster, protect service and watch your credit balance from one console'
                        : 'Vende más rápido, protege el servicio y vigila tu saldo desde una sola consola'}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.82)', maxWidth: 700 }}>
                      {locale === 'en'
                        ? 'The reseller dashboard now prioritizes what actually moves the business: available credits, fast access to customers and subscriptions, and clear risk visibility for lines and shared accounts.'
                        : 'El dashboard reseller ahora prioriza lo que sí mueve el negocio: créditos disponibles, acceso rápido a clientes y suscripciones, y visibilidad clara del riesgo en lines y shared accounts.'}
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25}>
                      <Button
                        variant="contained"
                        color="inherit"
                        startIcon={<CreditScoreOutlinedIcon />}
                        onClick={() => navigate('/liontv/reseller-wallet')}
                        sx={{ color: 'primary.main', fontWeight: 700 }}
                      >
                        {t('resellerDashboard.hero.primary', 'Solicitar créditos')}
                      </Button>
                      <Button
                        variant="outlined"
                        color="inherit"
                        startIcon={<RouterOutlinedIcon />}
                        onClick={() => navigate('/liontv/lines')}
                        sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'common.white' }}
                      >
                        {t('resellerDashboard.hero.secondary', 'Revisar lines')}
                      </Button>
                    </Stack>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card sx={{ borderRadius: 3.2, bgcolor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)' }}>
                    <CardContent>
                      <Stack spacing={1.25}>
                        <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.72)', letterSpacing: '0.12em', fontWeight: 700 }}>
                          {t('resellerDashboard.hero.balanceLabel', 'Créditos disponibles')}
                        </Typography>
                        <Typography variant="h1" sx={{ lineHeight: 1 }}>
                          {walletSummary?.availableCredits ?? 0}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.72)' }}>
                          {t('resellerDashboard.hero.balanceHelper', 'Úsalos para nuevas activaciones y renovaciones.')}
                        </Typography>
                        <Chip
                          color={walletSummary?.lowBalance ? 'warning' : 'success'}
                          label={
                            walletSummary?.lowBalance
                              ? t('resellerDashboard.hero.balanceStatusLow', 'Saldo bajo')
                              : t('resellerDashboard.hero.balanceStatusGood', 'Saldo saludable')
                          }
                          sx={{ alignSelf: 'flex-start', fontWeight: 700 }}
                        />
                        <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />
                        <Grid container spacing={1.2}>
                          <Grid item xs={6}>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.68)' }}>
                              {locale === 'en' ? 'Pending invoices' : 'Facturas pendientes'}
                            </Typography>
                            <Typography variant="h5" color="common.white">
                              {pendingInvoices}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.68)' }}>
                              {locale === 'en' ? 'Shared risk' : 'Riesgo shared'}
                            </Typography>
                            <Typography variant="h5" color="common.white">
                              {Number(sharedRiskKpi?.criticalClusters || 0)}
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

          {walletSummary?.lowBalance ? (
            <Alert severity="warning" icon={<WarningAmberOutlinedIcon />}>
              {t(
                'resellerDashboard.lowBalance',
                'Tu saldo está bajo. Solicita créditos ahora para no frenar ventas o renovaciones durante el día.'
              )}
            </Alert>
          ) : null}
          {walletError ? <Alert severity="error">{walletError}</Alert> : null}

          <Grid container spacing={gridSpacing}>
            <Grid item xs={12} md={4}>
              {metricCard(
                AccountBalanceWalletOutlinedIcon,
                t('resellerDashboard.cards.balance', 'Saldo disponible'),
                walletSummary?.availableCredits ?? 0,
                t('resellerDashboard.cards.balanceHelper', 'Créditos listos para nuevas activaciones.'),
                'primary'
              )}
            </Grid>
            <Grid item xs={12} md={4}>
              {metricCard(
                GroupsOutlinedIcon,
                t('resellerDashboard.cards.customers', 'Clientes activos'),
                customers.length,
                t('resellerDashboard.cards.customersHelper', 'Base activa bajo tu cuenta reseller.'),
                'success'
              )}
            </Grid>
            <Grid item xs={12} md={4}>
              {metricCard(
                SubscriptionsOutlinedIcon,
                t('resellerDashboard.cards.subscriptions', 'Suscripciones activas'),
                activeSubscriptions,
                t('resellerDashboard.cards.subscriptionsHelper', 'Planes actualmente en producción.'),
                'info'
              )}
            </Grid>
            <Grid item xs={12} md={4}>
              {metricCard(
                VpnKeyOutlinedIcon,
                t('resellerDashboard.cards.licenses', 'Licencias activas'),
                activeLicenses,
                t('resellerDashboard.cards.licensesHelper', 'Licencias listas o ya en uso.'),
                'warning'
              )}
            </Grid>
            <Grid item xs={12} md={4}>
              {metricCard(
                PaidOutlinedIcon,
                t('resellerDashboard.cards.pendingInvoices', 'Facturas pendientes'),
                pendingInvoices,
                t('resellerDashboard.cards.pendingInvoicesHelper', 'Cobros manuales todavía abiertos.'),
                'secondary'
              )}
            </Grid>
            <Grid item xs={12} md={4}>
              {metricCard(
                RocketLaunchOutlinedIcon,
                t('resellerDashboard.cards.consumed', 'Consumo histórico'),
                walletSummary?.lifetimeConsumed ?? 0,
                t('resellerDashboard.cards.consumedHelper', 'Créditos gastados por activaciones del reseller.'),
                'error'
              )}
            </Grid>
          </Grid>

          <Box>
            <Typography variant="overline" color="primary.main" sx={{ letterSpacing: '0.16em', fontWeight: 800 }}>
              {locale === 'en' ? 'Operate faster' : 'Opera más rápido'}
            </Typography>
            <Typography variant="h3" sx={{ mb: 0.5 }}>
              {t('resellerDashboard.quick.title', 'Accesos rápidos que sí sirven')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t(
                'resellerDashboard.quick.subtitle',
                'Todo lo necesario para vender, revisar capacidad y reorganizar cuentas sin entrar a módulos internos que no te aportan.'
              )}
            </Typography>
            <Grid container spacing={gridSpacing}>
              {quickActions.map((item) => (
                <Grid item xs={12} sm={6} lg={4} key={item.title}>
                  {quickActionCard(item)}
                </Grid>
              ))}
            </Grid>
          </Box>

          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
              <Typography variant="overline" color="primary.main" sx={{ letterSpacing: '0.16em', fontWeight: 800 }}>
                {locale === 'en' ? 'Commercial focus' : 'Foco comercial'}
              </Typography>
              <Typography variant="h3" sx={{ mb: 0.5 }}>
                {locale === 'en' ? 'Three signals you should not ignore today' : 'Tres señales que no debes ignorar hoy'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {locale === 'en'
                  ? 'These cards tell the reseller where money, service quality or renewals may break first.'
                  : 'Estas tarjetas le dicen al reseller dónde puede romperse primero el dinero, la calidad del servicio o las renovaciones.'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              {focusCard({
                title: t('resellerDashboard.focus.renewals.title', 'Renovaciones críticas'),
                value: expirationAttentionCount,
                helper: t(
                  'resellerDashboard.focus.renewals.helper',
                  'Si este número sube, revisa suscripciones por vencer antes de ofrecer nuevos movimientos.'
                ),
                buttonLabel: t('resellerDashboard.focus.renewals.action', 'Abrir suscripciones'),
                onClick: () => navigate('/liontv/subscriptions'),
                color: expirationAttentionCount > 0 ? 'error' : 'primary'
              })}
            </Grid>
            <Grid item xs={12} md={4}>
              {focusCard({
                title: t('resellerDashboard.focus.shared.title', 'Shared en riesgo'),
                value: Number(sharedRiskKpi?.criticalClusters || 0),
                helper: t(
                  'resellerDashboard.focus.shared.helper',
                  'Aquí detectas hosts y shared que debes reorganizar antes de que afecten el servicio.'
                ),
                buttonLabel: t('resellerDashboard.focus.shared.action', 'Abrir shared'),
                onClick: () => navigate('/liontv/subscription-sharing'),
                color: Number(sharedRiskKpi?.criticalClusters || 0) > 0 ? 'warning' : 'primary'
              })}
            </Grid>
            <Grid item xs={12} md={4}>
              {focusCard({
                title: t('resellerDashboard.focus.collections.title', 'Cobros pendientes'),
                value: pendingInvoices,
                helper: t(
                  'resellerDashboard.focus.collections.helper',
                  'Mantén cobros al día para no descapitalizarte mientras sigues activando cuentas.'
                ),
                buttonLabel: t('resellerDashboard.focus.collections.action', 'Abrir facturas'),
                onClick: () => navigate('/liontv/invoices'),
                color: pendingInvoices > 0 ? 'secondary' : 'primary'
              })}
            </Grid>
          </Grid>
        </Stack>
      </MainCard>
    </Stack>
  );
}
