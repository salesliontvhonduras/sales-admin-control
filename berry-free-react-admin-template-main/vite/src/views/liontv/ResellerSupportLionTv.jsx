import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import RocketLaunchOutlinedIcon from '@mui/icons-material/RocketLaunchOutlined';

import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

function SupportStep({ icon: Icon, title, description }) {
  return (
    <Card sx={{ height: '100%', borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
      <CardContent>
        <Stack spacing={1.5}>
          <Icon color="primary" />
          <Typography variant="h5">{title}</Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function ResellerSupportLionTv() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <MainCard title={t('menu.resellerSupport', 'Support Center')}>
      <Stack spacing={gridSpacing}>
        <Alert severity="info">
          {t(
            'resellerSupport.intro',
            'Fase 1 opera con onboarding privado y recargas manuales. Usa este centro como guía rápida para activar cuentas, validar cobros y escalar soporte.'
          )}
        </Alert>

        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={3}>
            <SupportStep
              icon={RocketLaunchOutlinedIcon}
              title={t('resellerSupport.steps.onboarding.title', 'Onboarding privado')}
              description={t(
                'resellerSupport.steps.onboarding.description',
                'La plataforma crea manualmente la cuenta reseller, asigna permisos, carga saldo inicial y entrega el acceso.'
              )}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <SupportStep
              icon={ReceiptLongOutlinedIcon}
              title={t('resellerSupport.steps.billing.title', 'Cobro manual')}
              description={t(
                'resellerSupport.steps.billing.description',
                'El cobro en fase 1 se registra por fuera. Usa invoices y referencias internas para dejar trazabilidad antes de acreditar créditos.'
              )}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <SupportStep
              icon={AccountBalanceWalletOutlinedIcon}
              title={t('resellerSupport.steps.wallet.title', 'Acreditación de créditos')}
              description={t(
                'resellerSupport.steps.wallet.description',
                'Después de confirmar el pago, el admin aplica la recarga manual en el wallet. El ledger queda como respaldo del movimiento.'
              )}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <SupportStep
              icon={SupportAgentOutlinedIcon}
              title={t('resellerSupport.steps.support.title', 'Escalamiento')}
              description={t(
                'resellerSupport.steps.support.description',
                'Si una activación requiere corrección, documenta invoice, cliente y motivo. Luego escala por soporte para ajuste comercial.'
              )}
            />
          </Grid>
        </Grid>

        <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h5">{t('resellerSupport.contact.title', 'Canal de soporte')}</Typography>
              <Typography variant="body2" color="text.secondary">
                {t(
                  'resellerSupport.contact.description',
                  'Mantén un solo canal operativo para incidencias, acreditaciones y activaciones con prioridad. En fase 2 este bloque puede conectarse con WhatsApp campaigns y soporte automatizado.'
                )}
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <Button variant="contained" onClick={() => navigate('/liontv/reseller-wallet')}>
                  {t('resellerSupport.contact.primary', 'Abrir wallet')}
                </Button>
                <Button variant="outlined" href="mailto:soporte@liontvpremium.com">
                  {t('resellerSupport.contact.secondary', 'Enviar correo')}
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </MainCard>
  );
}
