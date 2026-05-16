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
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

import { getEcommerceContactRoutingConfig, updateEcommerceContactRoutingConfig } from 'api/liontv-ecommerce-contact-routing';
import { PageErrorState, PageLoadingState } from 'ui-component/feedback/PageState';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { withAlpha } from 'utils/colorUtils';

function normalizeDigits(value = '') {
  return String(value).replace(/\D/g, '');
}

function premiumSurface(theme, color = 'primary') {
  const palette = theme.palette[color] || theme.palette.primary;
  const paletteMain = theme.vars?.palette?.[color]?.main || palette.main;
  const paletteLight = theme.vars?.palette?.[color]?.light || palette.light;
  const surfaceCard = theme.vars?.palette?.surface?.card || theme.palette.background.paper;
  return {
    borderRadius: 3.5,
    border: '1px solid',
    borderColor:
      theme.palette.mode === 'dark' ? withAlpha(paletteMain, 0.18) : withAlpha(paletteMain, 0.14),
    boxShadow:
      theme.palette.mode === 'dark'
        ? '0 18px 34px rgba(2,8,23,0.26)'
        : `0 16px 30px ${alpha(theme.palette.common.black, 0.08)}`,
    background:
      theme.palette.mode === 'dark'
        ? 'linear-gradient(160deg, rgba(11,18,32,0.98) 0%, rgba(9,16,29,0.98) 100%)'
        : `linear-gradient(160deg, ${surfaceCard} 0%, ${withAlpha(paletteLight, 0.14)} 100%)`
  };
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
          <Typography variant="overline" color="secondary.main" sx={{ letterSpacing: '0.16em', fontWeight: 800 }}>
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

export default function EcommerceContactRoutingLionTv() {
  const { t, i18n } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { accessToken } = useAuth();
  const language = String(i18n?.resolvedLanguage || i18n?.language || 'es').toLowerCase().startsWith('en') ? 'en' : 'es';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [routingConfig, setRoutingConfig] = useState(null);
  const [routingForm, setRoutingForm] = useState({
    enabled: true,
    primaryPhone: '50488204404',
    secondaryPhone: '50489240565'
  });

  const loadConfig = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError('');
    try {
      const payload = await getEcommerceContactRoutingConfig({ skipAuthRedirect: true });
      setRoutingConfig(payload);
      setRoutingForm({
        enabled: Boolean(payload?.enabled),
        primaryPhone: payload?.primaryPhone || '50488204404',
        secondaryPhone: payload?.secondaryPhone || '50489240565'
      });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          t('ecommerceContactRouting.errors.load', 'No se pudo cargar la configuración global del ecommerce.')
      );
    } finally {
      setLoading(false);
    }
  }, [accessToken, t]);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  const routingEnabled = Boolean(routingForm.enabled);
  const routingPrimaryDigits = useMemo(() => normalizeDigits(routingForm.primaryPhone), [routingForm.primaryPhone]);
  const routingSecondaryDigits = useMemo(() => normalizeDigits(routingForm.secondaryPhone), [routingForm.secondaryPhone]);
  const routingPrimaryValid = routingPrimaryDigits.length >= 8 && routingPrimaryDigits.length <= 15;
  const routingSecondaryValid = !routingEnabled || (routingSecondaryDigits.length >= 8 && routingSecondaryDigits.length <= 15);
  const routingPreviewUrl = `https://wa.me/${routingPrimaryValid ? routingPrimaryDigits : '50488204404'}`;
  const routingDirty =
    routingEnabled !== Boolean(routingConfig?.enabled) ||
    routingPrimaryDigits !== normalizeDigits(routingConfig?.primaryPhone || '') ||
    routingSecondaryDigits !== normalizeDigits(routingConfig?.secondaryPhone || '');

  const handleSave = async () => {
    if (!routingPrimaryValid) {
      enqueueSnackbar(
        t('ecommerceContactRouting.errors.invalidPrimary', 'Ingresa un Primary WhatsApp válido de 8 a 15 dígitos.'),
        { variant: 'warning' }
      );
      return;
    }
    if (!routingSecondaryValid) {
      enqueueSnackbar(
        t('ecommerceContactRouting.errors.invalidSecondary', 'Ingresa un Secondary WhatsApp válido de 8 a 15 dígitos.'),
        { variant: 'warning' }
      );
      return;
    }

    setSaving(true);
    setError('');
    try {
      const payload = await updateEcommerceContactRoutingConfig(
        {
          enabled: routingEnabled,
          primaryPhone: routingPrimaryDigits,
          secondaryPhone: routingSecondaryDigits || null
        },
        { skipAuthRedirect: true }
      );
      setRoutingConfig(payload);
      setRoutingForm({
        enabled: Boolean(payload?.enabled),
        primaryPhone: payload?.primaryPhone || '50488204404',
        secondaryPhone: payload?.secondaryPhone || ''
      });
      enqueueSnackbar(
        t(
          'ecommerceContactRouting.messages.saved',
          'La configuración global de round robin del ecommerce quedó guardada.'
        ),
        { variant: 'success' }
      );
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        t('ecommerceContactRouting.errors.save', 'No se pudo guardar la configuración global del ecommerce.');
      setError(message);
      enqueueSnackbar(message, { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageLoadingState
        title={t('menu.ecommerceContactRouting', 'Ecommerce Contact Routing')}
        description={t('ecommerceContactRouting.loading', 'Cargando configuración global del ecommerce...')}
      />
    );
  }

  if (error && !routingConfig) {
    return (
      <PageErrorState
        title={t('menu.ecommerceContactRouting', 'Ecommerce Contact Routing')}
        description={error}
        onRetry={loadConfig}
      />
    );
  }

  return (
    <MainCard title={t('menu.ecommerceContactRouting', 'Ecommerce Contact Routing')}>
      <Stack spacing={gridSpacing}>
        <Alert severity="info">
          {language === 'en'
            ? 'This option is global and admin-only. Resellers do not configure storefront WhatsApp rotation.'
            : 'Esta opción es global y solo de admin. Los resellers no configuran la rotación de WhatsApp del storefront.'}
        </Alert>

        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} lg={7}>
            <Card
              sx={(theme) => ({
                ...premiumSurface(theme, 'secondary'),
                borderRadius: 4
              })}
            >
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <Stack spacing={2.5}>
                  <SectionHeader
                    eyebrow={language === 'en' ? 'Global ecommerce routing' : 'Routing global ecommerce'}
                    title={
                      language === 'en'
                        ? 'Round robin for storefront WhatsApp CTAs'
                        : 'Round robin para CTA WhatsApp del storefront'
                    }
                    description={
                      language === 'en'
                        ? 'New visitors rotate between two WhatsApp numbers and keep the same assignment for 24 hours. If you disable it or the public resolver fails, the storefront falls back to 50488204404.'
                        : 'Los visitantes nuevos rotan entre dos números de WhatsApp y conservan la misma asignación por 24 horas. Si lo deshabilitas o falla el resolvedor público, el storefront cae a 50488204404.'
                    }
                    action={
                      <Chip
                        color={routingEnabled ? 'secondary' : 'default'}
                        label={
                          routingEnabled
                            ? language === 'en'
                              ? 'Round robin enabled'
                              : 'Round robin activo'
                            : language === 'en'
                              ? 'Primary fallback only'
                              : 'Solo fallback primary'
                        }
                      />
                    }
                  />

                  {error ? <Alert severity="warning">{error}</Alert> : null}

                  <FormControlLabel
                    control={
                      <Switch
                        checked={routingEnabled}
                        onChange={(event) =>
                          setRoutingForm((prev) => ({
                            ...prev,
                            enabled: event.target.checked
                          }))
                        }
                      />
                    }
                    label={
                      routingEnabled
                        ? language === 'en'
                          ? 'Round robin enabled'
                          : 'Round robin habilitado'
                        : language === 'en'
                          ? 'Round robin disabled'
                          : 'Round robin deshabilitado'
                    }
                  />

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Primary WhatsApp"
                        value={routingForm.primaryPhone}
                        onChange={(event) =>
                          setRoutingForm((prev) => ({
                            ...prev,
                            primaryPhone: event.target.value
                          }))
                        }
                        helperText={
                          language === 'en'
                            ? 'Mandatory. When routing is disabled or an error happens, this is the number the ecommerce will always use.'
                            : 'Obligatorio. Cuando el routing está deshabilitado o ocurre un error, este será el número que siempre usará el ecommerce.'
                        }
                        placeholder="50488204404"
                        inputProps={{ inputMode: 'numeric', maxLength: 18 }}
                        sx={{ '& .MuiInputBase-root': { borderRadius: 3 } }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Secondary WhatsApp"
                        value={routingForm.secondaryPhone}
                        onChange={(event) =>
                          setRoutingForm((prev) => ({
                            ...prev,
                            secondaryPhone: event.target.value
                          }))
                        }
                        helperText={
                          routingEnabled
                            ? language === 'en'
                              ? 'Required while round robin is enabled.'
                              : 'Requerido mientras el round robin esté activo.'
                            : language === 'en'
                              ? 'Optional while disabled. The storefront will keep using primary only.'
                              : 'Opcional mientras esté deshabilitado. El storefront seguirá usando solo el primary.'
                        }
                        placeholder="50489240565"
                        inputProps={{ inputMode: 'numeric', maxLength: 18 }}
                        sx={{ '& .MuiInputBase-root': { borderRadius: 3 } }}
                      />
                    </Grid>
                  </Grid>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                    <Button
                      variant="contained"
                      color="secondary"
                      startIcon={<SaveOutlinedIcon />}
                      onClick={handleSave}
                      disabled={saving || !routingDirty || !routingPrimaryValid || !routingSecondaryValid}
                    >
                      {saving
                        ? t('actions.saving', 'Saving...')
                        : language === 'en'
                          ? 'Save storefront routing'
                          : 'Guardar routing storefront'}
                    </Button>
                    <Button variant="outlined" startIcon={<OpenInNewOutlinedIcon />} href={routingPreviewUrl} target="_blank" rel="noreferrer">
                      {language === 'en' ? 'Open primary fallback' : 'Abrir fallback primary'}
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg={5}>
            <Card sx={(theme) => ({ ...premiumSurface(theme, 'info'), borderRadius: 4, height: '100%' })}>
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={1.25} alignItems="center">
                    <SupportAgentOutlinedIcon color="info" />
                    <Typography variant="h5">
                      {language === 'en' ? 'How storefront resolution behaves' : 'Cómo se resuelve en el storefront'}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {language === 'en'
                      ? 'Enabled: new visitors rotate globally and keep the same WhatsApp for 24 hours. Disabled or runtime error: everything falls back to 50488204404.'
                      : 'Activo: los visitantes nuevos rotan de forma global y conservan el mismo WhatsApp por 24 horas. Deshabilitado o con error runtime: todo cae a 50488204404.'}
                  </Typography>
                  <Divider />
                  <Stack spacing={1.25}>
                    {[
                      language === 'en'
                        ? 'Applies to home, product, collection, demo, loyalty, referral, sticky CTA, header, footer and support banners.'
                        : 'Aplica a home, product, collection, demo, loyalty, referidos, sticky CTA, header, footer y banners de soporte.',
                      language === 'en'
                        ? 'Each CTA preserves its own ?text message; only the destination WhatsApp number changes.'
                        : 'Cada CTA conserva su propio ?text; solo cambia el número destino de WhatsApp.',
                      language === 'en'
                        ? 'If the proxy fails, the theme still renders fallback links to 50488204404.'
                        : 'Si el proxy falla, el theme sigue renderizando enlaces fallback a 50488204404.'
                    ].map((text) => (
                      <Stack key={text} direction="row" spacing={1.25} alignItems="flex-start">
                        <Chip size="small" color="info" label="RR" />
                        <Typography variant="body2" color="text.secondary">
                          {text}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                  <Divider />
                  <Stack direction="row" spacing={1.25} alignItems="center">
                    <WhatsAppIcon color="success" />
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        {language === 'en' ? 'Fallback preview' : 'Preview de fallback'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {routingPreviewUrl}
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Stack>
    </MainCard>
  );
}
