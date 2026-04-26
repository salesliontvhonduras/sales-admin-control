import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';

import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import SubscriptionsOutlinedIcon from '@mui/icons-material/SubscriptionsOutlined';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import RocketLaunchOutlinedIcon from '@mui/icons-material/RocketLaunchOutlined';
import HeadsetMicOutlinedIcon from '@mui/icons-material/HeadsetMicOutlined';

import MainCard from 'ui-component/cards/MainCard';
import { PageErrorState, PageLoadingState } from 'ui-component/feedback/PageState';
import { gridSpacing } from 'store/constant';
import { lionTvApi } from 'utils/api';
import { getResellerWalletSummary } from 'api/liontv-reseller-wallet';

function metricCard(icon, title, value, helper, color = 'primary') {
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
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [walletSummary, setWalletSummary] = useState(null);
  const [packages, setPackages] = useState([]);
  const [walletLoading, setWalletLoading] = useState(true);
  const [walletError, setWalletError] = useState('');

  const loadWallet = useCallback(async () => {
    setWalletLoading(true);
    setWalletError('');
    try {
      const [summaryPayload, packagesResponse] = await Promise.all([
        getResellerWalletSummary({ skipAuthRedirect: true }),
        lionTvApi.get('/packages/v1', { skipAuthRedirect: true })
      ]);
      setWalletSummary(summaryPayload);
      setPackages(Array.isArray(packagesResponse?.data?.data) ? packagesResponse.data.data : []);
    } catch (error) {
      setWalletError(error?.response?.data?.message || t('resellerDashboard.errors.wallet', 'No se pudo cargar el wallet reseller.'));
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
  const creditRules = useMemo(
    () =>
      packages
        .map((item) => ({ name: item.name || `#${item.packageId || item.id || '-'}`, credits: Number(item.officialCredits || 0) }))
        .filter((item) => item.credits > 0)
        .sort((a, b) => a.credits - b.credits)
        .slice(0, 6),
    [packages]
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
            <Button variant="outlined" onClick={onRefresh}>
              {t('actions.refresh', 'Recargar')}
            </Button>
            <Button variant="contained" onClick={() => navigate('/liontv/reseller-wallet')}>
              {t('menu.resellerWallet', 'Credit Wallet')}
            </Button>
          </Stack>
        }
      >
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4">{t('resellerDashboard.title', 'Consola comercial reseller')}</Typography>
            <Typography variant="body1" color="text.secondary">
              {t(
                'resellerDashboard.subtitle',
                'Vista simplificada para vender, activar y controlar saldo de créditos sin entrar a módulos internos de operación.'
              )}
            </Typography>
          </Box>

          {walletSummary?.lowBalance ? (
            <Alert severity="warning">
              {t(
                'resellerDashboard.lowBalance',
                'Saldo bajo: conviene solicitar recarga manual antes de nuevas activaciones para no frenar ventas.'
              )}
            </Alert>
          ) : null}
          {expirationAttentionCount > 0 ? (
            <Alert severity="error">
              {t(
                'resellerDashboard.expirationAlert',
                'Hay suscripciones con vencimiento crítico o pendientes de revisión. Prioriza renovaciones antes de seguir vendiendo.'
              )}
            </Alert>
          ) : null}
          {sharedRiskKpi?.criticalClusters > 0 ? (
            <Alert severity="warning">
              {t(
                'resellerDashboard.sharedAlert',
                'Existen shared subscriptions atadas a hosts críticos. Revisa el módulo de Shared Subscriptions para reorganizar antes del vencimiento.'
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
                t('resellerDashboard.cards.customersHelper', 'Base de clientes bajo tu cuenta reseller.'),
                'success'
              )}
            </Grid>
            <Grid item xs={12} md={4}>
              {metricCard(
                SubscriptionsOutlinedIcon,
                t('resellerDashboard.cards.subscriptions', 'Suscripciones activas'),
                activeSubscriptions,
                t('resellerDashboard.cards.subscriptionsHelper', 'Planes en producción y generando consumo.'),
                'info'
              )}
            </Grid>
            <Grid item xs={12} md={4}>
              {metricCard(
                VpnKeyOutlinedIcon,
                t('resellerDashboard.cards.licenses', 'Licencias activas'),
                activeLicenses,
                t('resellerDashboard.cards.licensesHelper', 'Licencias listas o en uso por tus clientes.'),
                'warning'
              )}
            </Grid>
            <Grid item xs={12} md={4}>
              {metricCard(
                ReceiptLongOutlinedIcon,
                t('resellerDashboard.cards.pendingInvoices', 'Facturas pendientes'),
                pendingInvoices,
                t('resellerDashboard.cards.pendingInvoicesHelper', 'Cobros manuales aún no cerrados.'),
                'secondary'
              )}
            </Grid>
            <Grid item xs={12} md={4}>
              {metricCard(
                RocketLaunchOutlinedIcon,
                t('resellerDashboard.cards.consumed', 'Créditos consumidos'),
                walletSummary?.lifetimeConsumed ?? 0,
                t('resellerDashboard.cards.consumedHelper', 'Consumo acumulado por activaciones del reseller.'),
                'error'
              )}
            </Grid>
          </Grid>

          <Grid container spacing={gridSpacing}>
            <Grid item xs={12} lg={7}>
              <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                <CardContent>
                  <Stack spacing={2}>
                    <Typography variant="h5">{t('resellerDashboard.nextActions.title', 'Próximas acciones')}</Typography>
                    <Stack spacing={1.25}>
                      <Button variant="outlined" onClick={() => navigate('/liontv/customers')} sx={{ justifyContent: 'space-between' }}>
                        {t('resellerDashboard.nextActions.customers', 'Administrar clientes')}
                      </Button>
                      <Button variant="outlined" onClick={() => navigate('/liontv/subscriptions')} sx={{ justifyContent: 'space-between' }}>
                        {t('resellerDashboard.nextActions.subscriptions', 'Crear o revisar suscripciones')}
                      </Button>
                      <Button variant="outlined" onClick={() => navigate('/liontv/licenses')} sx={{ justifyContent: 'space-between' }}>
                        {t('resellerDashboard.nextActions.licenses', 'Gestionar licencias')}
                      </Button>
                      <Button variant="outlined" onClick={() => navigate('/liontv/invoices')} sx={{ justifyContent: 'space-between' }}>
                        {t('resellerDashboard.nextActions.invoices', 'Confirmar cobros manuales')}
                      </Button>
                      <Button variant="outlined" onClick={() => navigate('/liontv/support')} sx={{ justifyContent: 'space-between' }}>
                        {t('resellerDashboard.nextActions.support', 'Abrir soporte')}
                      </Button>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} lg={5}>
              <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                <CardContent>
                  <Stack spacing={2}>
                    <Typography variant="h5">{t('resellerDashboard.rules.title', 'Costo por paquete')}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t(
                        'resellerDashboard.rules.subtitle',
                        'La fase 1 consume créditos al crear suscripciones según el valor oficial configurado en el paquete.'
                      )}
                    </Typography>
                    <Divider />
                    {creditRules.length ? (
                      creditRules.map((rule) => (
                        <Stack key={rule.name} direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="subtitle2">{rule.name}</Typography>
                          <Chip color="primary" size="small" label={`${rule.credits} cr`} />
                        </Stack>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        {t('resellerDashboard.rules.empty', 'Todavía no hay reglas comerciales configuradas con créditos oficiales.')}
                      </Typography>
                    )}
                    <Alert severity="info" icon={<HeadsetMicOutlinedIcon />}>
                      {t(
                        'resellerDashboard.rules.note',
                        'Si necesitas corregir un cobro o una activación, usa wallet manual + invoices mientras llega la compra automática de créditos en fase 2.'
                      )}
                    </Alert>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Stack>
      </MainCard>
    </Stack>
  );
}
