import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import useAuth from 'hooks/useAuth';

import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import RocketLaunchOutlinedIcon from '@mui/icons-material/RocketLaunchOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import ChecklistOutlinedIcon from '@mui/icons-material/ChecklistOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';

import MainCard from 'ui-component/cards/MainCard';
import { PageErrorState, PageLoadingState } from 'ui-component/feedback/PageState';
import { gridSpacing } from 'store/constant';
import { getResellerSupportProfile, updateResellerSupportProfile } from 'api/liontv-reseller-wallet';

function normalizeDigits(value = '') {
  return String(value).replace(/\D/g, '');
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
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, maxWidth: 760 }}>
            {description}
          </Typography>
        ) : null}
      </Box>
      {action ? <Box>{action}</Box> : null}
    </Stack>
  );
}

function MetricCard({ title, value, helper, icon, color = 'primary' }) {
  return (
    <Card
      sx={(theme) => ({
        height: '100%',
        borderRadius: 3.5,
        border: '1px solid',
        borderColor: theme.palette.mode === 'dark' ? 'rgba(148, 163, 184, 0.12)' : 'rgba(15, 23, 42, 0.08)',
        boxShadow: theme.palette.mode === 'dark' ? '0 18px 34px rgba(2,8,23,0.26)' : '0 16px 28px rgba(15,23,42,0.06)',
        background:
          theme.palette.mode === 'dark'
            ? 'linear-gradient(160deg, rgba(11,18,32,0.98) 0%, rgba(9,16,29,0.98) 100%)'
            : 'linear-gradient(160deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at top right, ${theme.palette[color].main}20 0%, transparent 56%)`,
          pointerEvents: 'none'
        }
      })}
    >
      <CardContent>
        <Stack spacing={1.4}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: '0.12em', fontWeight: 700 }}>
              {title}
            </Typography>
            <Avatar
              variant="rounded"
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
              {icon}
            </Avatar>
          </Stack>
          <Typography variant="h3" sx={{ lineHeight: 1.05, wordBreak: 'break-word' }}>
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

function ActionCard({ icon, title, description, actionLabel, onClick, color = 'primary' }) {
  const Icon = icon;
  return (
    <Card
      sx={(theme) => ({
        height: '100%',
        borderRadius: 3.5,
        border: '1px solid',
        borderColor: theme.palette.mode === 'dark' ? 'rgba(148, 163, 184, 0.12)' : 'rgba(15, 23, 42, 0.08)',
        cursor: 'pointer',
        transition: 'transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease',
        background:
          theme.palette.mode === 'dark'
            ? 'linear-gradient(160deg, rgba(11,18,32,0.98) 0%, rgba(9,16,29,0.98) 100%)'
            : 'linear-gradient(160deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: theme.palette.mode === 'dark' ? '0 18px 34px rgba(2,8,23,0.26)' : theme.shadows[8],
          borderColor: `${theme.palette[color].main}55`
        }
      })}
      onClick={onClick}
    >
      <CardContent>
        <Stack spacing={1.5}>
          <Avatar
            variant="rounded"
            sx={(theme) => ({
              width: 50,
              height: 50,
              borderRadius: 3,
              color: theme.palette[color].main,
              bgcolor: `${theme.palette[color].main}16`
            })}
          >
            <Icon fontSize="small" />
          </Avatar>
          <Box>
            <Typography variant="h5">{title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {description}
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

function SupportStep({ icon: Icon, title, description, color = 'primary' }) {
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
          <Avatar
            variant="rounded"
            sx={(theme) => ({
              width: 44,
              height: 44,
              borderRadius: 2.8,
              color: theme.palette[color].main,
              bgcolor: `${theme.palette[color].main}16`
            })}
          >
            <Icon fontSize="small" />
          </Avatar>
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
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { accessToken } = useAuth();
  const language = String(i18n?.resolvedLanguage || i18n?.language || 'es').toLowerCase().startsWith('en') ? 'en' : 'es';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [supportProfile, setSupportProfile] = useState(null);
  const [supportPhone, setSupportPhone] = useState('');

  const supportCopy = useMemo(
    () =>
      language === 'en'
        ? {
            heroBadge: 'Support command center',
            heroTitle: 'Configure how customers reach you and keep reseller support aligned',
            heroSubtitle:
              'This module now behaves like a real support console: your WhatsApp endpoint, mail support behavior, quick operational links and a clean Phase 1 playbook.',
            sections: {
              configEyebrow: 'Channel setup',
              configTitle: 'Own the WhatsApp shown in your emails',
              configDescription:
                'When a transactional email or email campaign is generated from your reseller account, the support button can point to your own WhatsApp instead of the global platform number.',
              actionsEyebrow: 'Support routes',
              actionsTitle: 'Jump straight into the support tools that matter',
              actionsDescription: 'Keep wallet, templates and campaign touchpoints close so support and sales stay aligned.',
              playbookEyebrow: 'Operational playbook',
              playbookTitle: 'What your team should do in Phase 1',
              playbookDescription:
                'The platform still runs with manual top-ups and private onboarding, so the support flow must stay disciplined and predictable.'
            }
          }
        : {
            heroBadge: 'Centro de soporte',
            heroTitle: 'Configura cómo te contactan tus clientes y mantén alineado el soporte reseller',
            heroSubtitle:
              'Este módulo ahora funciona como una consola real de soporte: tu WhatsApp de atención, el comportamiento de los correos, accesos rápidos operativos y un playbook claro para la fase 1.',
            sections: {
              configEyebrow: 'Configuración del canal',
              configTitle: 'Controla el WhatsApp que verán tus clientes en correos',
              configDescription:
                'Cuando un correo transaccional o una campaña email salga desde tu cuenta reseller, el botón de soporte puede apuntar a tu propio WhatsApp en lugar del número global de la plataforma.',
              actionsEyebrow: 'Rutas de soporte',
              actionsTitle: 'Salta directo a las herramientas de soporte que sí importan',
              actionsDescription:
                'Mantén wallet, templates y campañas cerca para que soporte y ventas se muevan en la misma dirección.',
              playbookEyebrow: 'Playbook operativo',
              playbookTitle: 'Qué debe hacer tu equipo en fase 1',
              playbookDescription:
                'La plataforma todavía opera con recargas manuales y onboarding privado, así que el flujo de soporte debe mantenerse disciplinado y predecible.'
            }
          },
    [language]
  );

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
  const supportHealth = supportProfile?.configured ? 100 : 38;

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
        <Card
          sx={(theme) => ({
            borderRadius: 4,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: theme.palette.mode === 'dark' ? 'rgba(148, 163, 184, 0.12)' : 'rgba(15, 23, 42, 0.08)',
            color: 'common.white',
            background:
              theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, #07111f 0%, #0f172a 30%, #163047 64%, #0f4c5c 100%)'
                : 'linear-gradient(135deg, #0f172a 0%, #1d4ed8 32%, #0f766e 68%, #16a34a 120%)',
            boxShadow: theme.palette.mode === 'dark' ? '0 28px 52px rgba(2, 8, 23, 0.42)' : '0 24px 46px rgba(15, 23, 42, 0.18)'
          })}
        >
          <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
            <Grid container spacing={3} alignItems="stretch">
              <Grid item xs={12} lg={7}>
                <Stack spacing={1.5}>
                  <Chip
                    icon={<SupportAgentOutlinedIcon />}
                    label={supportCopy.heroBadge}
                    sx={{ alignSelf: 'flex-start', bgcolor: 'rgba(255,255,255,0.14)', color: 'common.white', fontWeight: 700 }}
                  />
                  <Typography variant="h2" sx={{ fontSize: { xs: '1.9rem', md: '2.6rem' }, maxWidth: 760 }}>
                    {supportCopy.heroTitle}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.82)', maxWidth: 760 }}>
                    {supportCopy.heroSubtitle}
                  </Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25}>
                    <Button
                      variant="contained"
                      color="inherit"
                      startIcon={<WhatsAppIcon />}
                      href={previewWhatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                      sx={{ color: 'primary.main', fontWeight: 700 }}
                    >
                      {t('resellerSupport.profile.testLink', 'Probar enlace')}
                    </Button>
                    <Button
                      variant="outlined"
                      color="inherit"
                      startIcon={<EmailOutlinedIcon />}
                      onClick={() => navigate('/liontv/email-templates')}
                      sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'common.white' }}
                    >
                      {language === 'en' ? 'Open email templates' : 'Abrir email templates'}
                    </Button>
                  </Stack>
                </Stack>
              </Grid>

              <Grid item xs={12} lg={5}>
                <Grid container spacing={1.5}>
                  <Grid item xs={12} sm={6}>
                    <Card sx={{ height: '100%', borderRadius: 3, bgcolor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)' }}>
                      <CardContent>
                        <Stack spacing={0.8}>
                          <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.72)', letterSpacing: '0.12em', fontWeight: 700 }}>
                            {language === 'en' ? 'Support status' : 'Estado soporte'}
                          </Typography>
                          <Typography variant="h4" color="common.white">
                            {supportProfile?.configured
                              ? t('resellerSupport.profile.configured', 'Configurado')
                              : t('resellerSupport.profile.notConfigured', 'Usando fallback global')}
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={supportHealth}
                            sx={{
                              height: 8,
                              borderRadius: 999,
                              bgcolor: 'rgba(255,255,255,0.12)',
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 999,
                                bgcolor: supportProfile?.configured ? '#22c55e' : '#f59e0b'
                              }
                            }}
                          />
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Card sx={{ height: '100%', borderRadius: 3, bgcolor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)' }}>
                      <CardContent>
                        <Stack spacing={0.8}>
                          <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.72)', letterSpacing: '0.12em', fontWeight: 700 }}>
                            {language === 'en' ? 'Visible number' : 'Número visible'}
                          </Typography>
                          <Typography variant="h4" color="common.white" sx={{ wordBreak: 'break-word' }}>
                            {hasValidPhone ? `+${phoneDigits}` : language === 'en' ? 'Global contact' : 'Contacto global'}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.72)' }}>
                            {previewWhatsappUrl}
                          </Typography>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12}>
                    <Card sx={{ borderRadius: 3, bgcolor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)' }}>
                      <CardContent>
                        <Stack spacing={0.8}>
                          <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.72)', letterSpacing: '0.12em', fontWeight: 700 }}>
                            {language === 'en' ? 'Applied on' : 'Se aplica en'}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.82)' }}>
                            {language === 'en'
                              ? 'Transactional emails, loyalty summaries, expiration notices and email campaigns generated from your reseller account.'
                              : 'Correos transaccionales, resúmenes de loyalty, avisos de expiración y campañas email generadas desde tu cuenta reseller.'}
                          </Typography>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {supportProfile?.configured ? (
          <Alert severity="success">
            {t(
              'resellerSupport.profile.activeNotice',
              'Tus correos transaccionales y tus campañas email ya podrán dirigir al cliente a tu propio WhatsApp.'
            )}
          </Alert>
        ) : (
          <Alert severity="warning">
            {t(
              'resellerSupport.profile.fallbackNotice',
              'Todavía no has configurado tu WhatsApp reseller. Mientras tanto, los correos seguirán apuntando al número global del sistema.'
            )}
          </Alert>
        )}

        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} lg={7}>
            <Card
              sx={(theme) => ({
                borderRadius: 4,
                border: '1px solid',
                borderColor: theme.palette.mode === 'dark' ? 'rgba(148, 163, 184, 0.12)' : 'rgba(15, 23, 42, 0.08)',
                background:
                  theme.palette.mode === 'dark'
                    ? 'linear-gradient(180deg, rgba(16,24,40,0.98) 0%, rgba(9,16,29,0.98) 100%)'
                    : 'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)'
              })}
            >
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <Stack spacing={2.5}>
                  <SectionHeader
                    eyebrow={supportCopy.sections.configEyebrow}
                    title={supportCopy.sections.configTitle}
                    description={supportCopy.sections.configDescription}
                    action={
                      <Chip
                        color={supportProfile?.configured ? 'success' : 'warning'}
                        label={
                          supportProfile?.configured
                            ? t('resellerSupport.profile.configured', 'Configurado')
                            : t('resellerSupport.profile.notConfigured', 'Usando fallback global')
                        }
                      />
                    }
                  />

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
                            borderRadius: 3
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={5}>
                      <Card
                        sx={(theme) => ({
                          height: '100%',
                          borderRadius: 3,
                          border: '1px solid',
                          borderColor: theme.palette.mode === 'dark' ? 'rgba(148, 163, 184, 0.12)' : 'rgba(15, 23, 42, 0.08)',
                          background:
                            theme.palette.mode === 'dark'
                              ? 'linear-gradient(180deg, rgba(15,23,42,0.76) 0%, rgba(10,16,29,0.82) 100%)'
                              : 'linear-gradient(180deg, rgba(248,250,252,0.96) 0%, rgba(241,245,249,0.98) 100%)'
                        })}
                      >
                        <CardContent>
                          <Stack spacing={1.25}>
                            <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: '0.12em', fontWeight: 700 }}>
                              {t('resellerSupport.profile.previewTitle', 'Preview del enlace')}
                            </Typography>
                            <Typography variant="h5" sx={{ wordBreak: 'break-word' }}>
                              {hasValidPhone ? `+${phoneDigits}` : t('resellerSupport.profile.previewFallback', 'Se usará el contacto global')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
                              {previewWhatsappUrl}
                            </Typography>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>

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
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <SectionHeader
          eyebrow={supportCopy.sections.actionsEyebrow}
          title={supportCopy.sections.actionsTitle}
          description={supportCopy.sections.actionsDescription}
        />

        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={4}>
            <ActionCard
              icon={AccountBalanceWalletOutlinedIcon}
              title={language === 'en' ? 'Credit wallet' : 'Credit wallet'}
              description={
                language === 'en'
                  ? 'Review balance, pending requests and manual credit flow before opening commercial incidents.'
                  : 'Revisa saldo, solicitudes pendientes y el flujo manual de créditos antes de abrir incidencias comerciales.'
              }
              actionLabel={language === 'en' ? 'Open wallet' : 'Abrir wallet'}
              onClick={() => navigate('/liontv/reseller-wallet')}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <ActionCard
              icon={EmailOutlinedIcon}
              title={language === 'en' ? 'Email templates' : 'Email templates'}
              description={
                language === 'en'
                  ? 'Make sure support CTAs and reseller-facing messaging look right before sending.'
                  : 'Verifica que los CTA de soporte y el mensaje reseller se vean bien antes de enviar.'
              }
              actionLabel={language === 'en' ? 'Open templates' : 'Abrir templates'}
              onClick={() => navigate('/liontv/email-templates')}
              color="success"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <ActionCard
              icon={CampaignOutlinedIcon}
              title={language === 'en' ? 'Email campaigns' : 'Email campaigns'}
              description={
                language === 'en'
                  ? 'Preview, test and launch campaigns that already inherit your reseller WhatsApp.'
                  : 'Previsualiza, prueba y lanza campañas que ya heredan tu WhatsApp reseller.'
              }
              actionLabel={language === 'en' ? 'Open campaigns' : 'Abrir campaigns'}
              onClick={() => navigate('/liontv/email-campaigns')}
              color="warning"
            />
          </Grid>
        </Grid>

        <SectionHeader
          eyebrow={supportCopy.sections.playbookEyebrow}
          title={supportCopy.sections.playbookTitle}
          description={supportCopy.sections.playbookDescription}
        />

        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={3}>
            <SupportStep
              icon={RocketLaunchOutlinedIcon}
              title={t('resellerSupport.steps.onboarding.title', 'Onboarding privado')}
              description={t(
                'resellerSupport.steps.onboarding.description',
                'La plataforma crea manualmente la cuenta reseller, asigna permisos, carga saldo inicial y entrega el acceso.'
              )}
              color="primary"
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
              color="warning"
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
              color="success"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <SupportStep
              icon={ChecklistOutlinedIcon}
              title={t('resellerSupport.steps.support.title', 'Escalamiento')}
              description={t(
                'resellerSupport.steps.support.description',
                'Si una activación requiere corrección, documenta invoice, cliente y motivo. Luego escala por soporte para ajuste comercial.'
              )}
              color="secondary"
            />
          </Grid>
        </Grid>

        <Alert severity="info" icon={<AutoAwesomeOutlinedIcon />}>
          {language === 'en'
            ? 'Support is now connected to your reseller identity: the saved WhatsApp can flow into operational emails and email campaigns without touching global admin behavior.'
            : 'El soporte ahora está conectado a tu identidad reseller: el WhatsApp guardado puede fluir a correos operativos y campañas email sin tocar el comportamiento global de admin.'}
        </Alert>
      </Stack>
    </MainCard>
  );
}
