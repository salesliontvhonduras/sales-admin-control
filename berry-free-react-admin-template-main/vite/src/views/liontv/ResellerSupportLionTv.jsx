import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import useAuth from 'hooks/useAuth';

import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';

import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import RocketLaunchOutlinedIcon from '@mui/icons-material/RocketLaunchOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';

import MainCard from 'ui-component/cards/MainCard';
import { PageErrorState, PageLoadingState } from 'ui-component/feedback/PageState';
import { gridSpacing } from 'store/constant';
import { getResellerSupportProfile, updateResellerSupportProfile } from 'api/liontv-reseller-wallet';

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

function normalizeDigits(value = '') {
  return String(value).replace(/\D/g, '');
}

export default function ResellerSupportLionTv() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { accessToken } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [supportProfile, setSupportProfile] = useState(null);
  const [supportPhone, setSupportPhone] = useState('');

  const loadSupportProfile = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError('');
    try {
      const payload = await getResellerSupportProfile({ skipAuthRedirect: true });
      setSupportProfile(payload);
      setSupportPhone(payload?.supportPhone || '');
    } catch (err) {
      setError(err?.response?.data?.message || t('resellerSupport.errors.load', 'No se pudo cargar la configuración de soporte.'));
    } finally {
      setLoading(false);
    }
  }, [accessToken, t]);

  useEffect(() => {
    loadSupportProfile();
  }, [loadSupportProfile]);

  const phoneDigits = useMemo(() => normalizeDigits(supportPhone), [supportPhone]);
  const hasValidPhone = phoneDigits.length >= 8 && phoneDigits.length <= 15;
  const previewWhatsappUrl = hasValidPhone ? `https://wa.me/${phoneDigits}` : supportProfile?.whatsappUrl || 'https://wa.me/50488204404';
  const dirty = phoneDigits !== normalizeDigits(supportProfile?.supportPhone || '');

  const handleSave = async () => {
    if (!hasValidPhone) {
      enqueueSnackbar(t('resellerSupport.errors.invalidPhone', 'Ingresa un WhatsApp válido de 8 a 15 dígitos.'), {
        variant: 'warning'
      });
      return;
    }

    setSaving(true);
    try {
      const payload = await updateResellerSupportProfile(
        {
          supportPhone: phoneDigits
        },
        { skipAuthRedirect: true }
      );
      setSupportProfile(payload);
      setSupportPhone(payload?.supportPhone || '');
      enqueueSnackbar(
        t(
          'resellerSupport.messages.saved',
          'El WhatsApp de soporte quedó guardado. Las notificaciones por email ahora usarán este enlace para tus clientes.'
        ),
        { variant: 'success' }
      );
    } catch (err) {
      enqueueSnackbar(err?.response?.data?.message || t('resellerSupport.errors.save', 'No se pudo guardar la configuración de soporte.'), {
        variant: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <PageLoadingState title={t('menu.resellerSupport', 'Support Center')} description={t('resellerSupport.loading', 'Cargando configuración de soporte...')} />;
  }

  if (error && !supportProfile) {
    return <PageErrorState title={t('menu.resellerSupport', 'Support Center')} description={error} onRetry={loadSupportProfile} />;
  }

  return (
    <MainCard title={t('menu.resellerSupport', 'Support Center')}>
      <Stack spacing={gridSpacing}>
        <Alert severity="info">
          {t(
            'resellerSupport.intro',
            'Fase 1 opera con onboarding privado y recargas manuales. Usa este centro para definir el WhatsApp que verán tus clientes en correos y para tener a mano el flujo operativo de soporte.'
          )}
        </Alert>

        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} lg={7}>
            <Card
              sx={{
                borderRadius: 4,
                border: '1px solid',
                borderColor: 'divider',
                background: 'linear-gradient(180deg, rgba(16,24,40,0.98) 0%, rgba(9,16,29,0.98) 100%)',
                color: 'common.white'
              }}
            >
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <Stack spacing={2.5}>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    spacing={1.5}
                  >
                    <Stack spacing={0.75}>
                      <Typography variant="h4" color="common.white">
                        {t('resellerSupport.profile.title', 'WhatsApp de soporte para tus notificaciones')}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.74)', maxWidth: 620 }}>
                        {t(
                          'resellerSupport.profile.description',
                          'Cuando tus campañas o correos automáticos salgan desde tu cuenta reseller, el botón de WhatsApp abrirá este número. Si no configuras nada, el sistema seguirá usando el contacto global.'
                        )}
                      </Typography>
                    </Stack>
                    <Chip
                      color={supportProfile?.configured ? 'success' : 'warning'}
                      label={
                        supportProfile?.configured
                          ? t('resellerSupport.profile.configured', 'Configurado')
                          : t('resellerSupport.profile.notConfigured', 'Usando fallback global')
                      }
                    />
                  </Stack>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={7}>
                      <TextField
                        fullWidth
                        label={t('resellerSupport.profile.phoneLabel', 'Número de WhatsApp')}
                        value={supportPhone}
                        onChange={(event) => setSupportPhone(event.target.value)}
                        helperText={t(
                          'resellerSupport.profile.phoneHelper',
                          'Solo importa el número. Puedes escribirlo con espacios, + o guiones; el sistema guardará solo dígitos.'
                        )}
                        placeholder="50499999999"
                        inputProps={{ inputMode: 'numeric', maxLength: 18 }}
                        sx={{
                          '& .MuiInputBase-root': {
                            borderRadius: 3,
                            bgcolor: 'rgba(255,255,255,0.06)',
                            color: 'common.white'
                          },
                          '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.72)' },
                          '& .MuiFormHelperText-root': { color: 'rgba(255,255,255,0.64)' }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={5}>
                      <Card
                        sx={{
                          height: '100%',
                          borderRadius: 3,
                          border: '1px solid rgba(255,255,255,0.10)',
                          bgcolor: 'rgba(255,255,255,0.04)'
                        }}
                      >
                        <CardContent>
                          <Stack spacing={1.25}>
                            <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.65)' }}>
                              {t('resellerSupport.profile.previewTitle', 'Preview del enlace')}
                            </Typography>
                            <Typography variant="h5" color="common.white">
                              {hasValidPhone ? `+${phoneDigits}` : t('resellerSupport.profile.previewFallback', 'Se usará el contacto global')}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', wordBreak: 'break-all' }}>
                              {previewWhatsappUrl}
                            </Typography>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>

                  <Alert
                    severity={supportProfile?.configured ? 'success' : 'warning'}
                    sx={{
                      borderRadius: 3,
                      bgcolor: supportProfile?.configured ? 'rgba(46, 125, 50, 0.16)' : 'rgba(237, 108, 2, 0.16)',
                      color: 'common.white',
                      '& .MuiAlert-icon': { color: 'inherit' }
                    }}
                  >
                    {supportProfile?.configured
                      ? t(
                          'resellerSupport.profile.activeNotice',
                          'Tus correos transaccionales y tus campañas email ya podrán dirigir al cliente a tu propio WhatsApp.'
                        )
                      : t(
                          'resellerSupport.profile.fallbackNotice',
                          'Todavía no has configurado tu WhatsApp reseller. Mientras tanto, los correos seguirán apuntando al número global del sistema.'
                        )}
                  </Alert>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                    <Button
                      variant="contained"
                      startIcon={<SaveOutlinedIcon />}
                      onClick={handleSave}
                      disabled={saving || !dirty || !hasValidPhone}
                    >
                      {saving ? t('actions.saving', 'Saving...') : t('resellerSupport.profile.save', 'Guardar WhatsApp')}
                    </Button>
                    <Button
                      variant="outlined"
                      color="inherit"
                      startIcon={<OpenInNewOutlinedIcon />}
                      href={previewWhatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t('resellerSupport.profile.testLink', 'Probar enlace')}
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg={5}>
            <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', height: '100%' }}>
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={1.25} alignItems="center">
                    <WhatsAppIcon color="success" />
                    <Typography variant="h5">{t('resellerSupport.profile.usageTitle', 'Dónde se usará este número')}</Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {t(
                      'resellerSupport.profile.usageDescription',
                      'Este WhatsApp se usa como referencia comercial cuando el correo fue generado por tu cuenta reseller. Admin conserva el flujo actual con el número global.'
                    )}
                  </Typography>
                  <Divider />
                  <Stack spacing={1.25}>
                    {[
                      t('resellerSupport.profile.usage.notifications', 'Correos operativos: bienvenida, renovación, expiración, factura y puntos.'),
                      t('resellerSupport.profile.usage.campaigns', 'Campañas email y templates con botón de soporte por WhatsApp.'),
                      t('resellerSupport.profile.usage.preview', 'Preview de templates y envíos de prueba desde el módulo de Email Templates / Campaigns.')
                    ].map((text) => (
                      <Stack key={text} direction="row" spacing={1.25} alignItems="flex-start">
                        <Chip size="small" color="success" label="WA" />
                        <Typography variant="body2" color="text.secondary">
                          {text}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                  <Button variant="outlined" onClick={() => navigate('/liontv/reseller-wallet')}>
                    {t('resellerSupport.contact.primary', 'Abrir wallet')}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

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
      </Stack>
    </MainCard>
  );
}
