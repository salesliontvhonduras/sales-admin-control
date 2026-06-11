import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import useAuth from 'hooks/useAuth';

import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { getAdminEcommerceSiteConfig, updateAdminEcommerceSiteConfig, uploadAdminEcommerceStoryMedia } from 'api/liontv-ecommerce-site';
import MainCard from 'ui-component/cards/MainCard';
import { PageErrorState, PageLoadingState } from 'ui-component/feedback/PageState';
import { gridSpacing } from 'store/constant';

const DEFAULT_PLAN_SPECS = [
  {
    id: 'includedContent',
    label: { es: 'Contenido incluido', en: 'Included content' },
    value: { es: 'Películas, series, canales y deportes', en: 'Movies, series, channels and sports' },
    order: 1,
    active: true
  },
  {
    id: 'compatibleDevices',
    label: { es: 'Dispositivos compatibles', en: 'Compatible devices' },
    value: { es: 'TV, computadora, celular, tablet', en: 'TV, computer, phone, tablet' },
    order: 2,
    active: true
  },
  {
    id: 'simultaneousDevices',
    label: { es: 'Dispositivos simultáneos', en: 'Simultaneous devices' },
    value: { es: '{devicesLabel}', en: '{devicesLabel}' },
    order: 3,
    active: true
  },
  {
    id: 'support',
    label: { es: 'Atención', en: 'Support' },
    value: { es: 'Soporte por WhatsApp', en: 'WhatsApp support' },
    order: 4,
    active: true
  }
];

const TOUR_TARGET_OPTIONS = [
  { value: 'email-capture', label: 'Campo de correo' },
  { value: 'start-button', label: 'Botón Comenzar' },
  { value: 'plans-section', label: 'Sección planes' },
  { value: 'plan-card', label: 'Tarjeta de plan' },
  { value: 'connections-selector', label: 'Selector conexiones' },
  { value: 'payment-buttons', label: 'Botones de pago' },
  { value: 'demo-button', label: 'Botón demo' },
  { value: 'demo-vivo-player', label: 'Guía Vivo Player' },
  { value: 'demo-form', label: 'Formulario demo/OTP' },
  { value: 'referral-button', label: 'Botón referidos' }
];

const TOUR_ACTION_OPTIONS = [
  { value: 'none', label: 'Sin acción' },
  { value: 'scrollToHero', label: 'Ir al hero' },
  { value: 'scrollToPlans', label: 'Ir a planes' },
  { value: 'openDemoModal', label: 'Abrir demo' },
  { value: 'openReferralModal', label: 'Abrir referidos' }
];

const DEFAULT_GUIDED_TOUR_STEPS = [
  {
    id: 'email',
    target: 'email-capture',
    action: 'scrollToHero',
    title: { es: 'Ingresa tu correo', en: 'Enter your email' },
    description: {
      es: 'Escribe tu correo y presiona Comenzar para ver planes o tu suscripción actual.',
      en: 'Enter your email and press Get Started to see plans or your current subscription.'
    },
    order: 1,
    active: true
  },
  {
    id: 'start',
    target: 'start-button',
    action: 'scrollToHero',
    title: { es: 'Presiona Comenzar', en: 'Press Get Started' },
    description: {
      es: 'Validamos tu correo para mostrar planes si eres nuevo o tu cuenta si ya eres cliente.',
      en: 'We validate your email to show plans if you are new or your account if you are a customer.'
    },
    order: 2,
    active: true
  },
  {
    id: 'plans',
    target: 'plans-section',
    action: 'scrollToPlans',
    title: { es: 'Selecciona tu plan', en: 'Choose your plan' },
    description: {
      es: 'Compara Básico, Prime y Premium. La tarjeta activa queda marcada.',
      en: 'Compare Basic, Prime and Premium. The active card is marked.'
    },
    order: 3,
    active: true
  },
  {
    id: 'connections',
    target: 'connections-selector',
    action: 'scrollToPlans',
    title: { es: 'Elige conexiones', en: 'Choose connections' },
    description: {
      es: 'Selecciona 1, 2, 3, 4 o 5 conexiones según los dispositivos simultáneos que necesitas.',
      en: 'Select 1, 2, 3, 4 or 5 connections based on the simultaneous devices you need.'
    },
    order: 4,
    active: true
  },
  {
    id: 'payments',
    target: 'payment-buttons',
    action: 'scrollToPlans',
    title: { es: 'Paga tu plan', en: 'Pay your plan' },
    description: {
      es: 'Elige PayPal, tarjeta o débito automático con descuento cuando esté configurado.',
      en: 'Choose PayPal, card or automatic debit with discount when configured.'
    },
    order: 5,
    active: true
  },
  {
    id: 'demo-vivo',
    target: 'demo-vivo-player',
    action: 'openDemoModal',
    title: { es: 'Descarga Vivo Player', en: 'Download Vivo Player' },
    description: {
      es: 'Para la demo debes descargar o abrir Vivo Player y copiar la MAC del dispositivo.',
      en: 'For the demo you must download or open Vivo Player and copy the device MAC.'
    },
    order: 6,
    active: true
  },
  {
    id: 'demo-form',
    target: 'demo-form',
    action: 'openDemoModal',
    title: { es: 'Valida el OTP', en: 'Validate the OTP' },
    description: {
      es: 'Completa tus datos, valida el OTP enviado por correo y activa la demo Prime.',
      en: 'Complete your information, validate the OTP sent by email and activate the Prime demo.'
    },
    order: 7,
    active: true
  }
];

const DEFAULT_CONFIG = {
  language: { default: 'es', supported: ['es', 'en'] },
  brand: {
    name: 'Lion TV Premium',
    logoUrl: '/assets/lion-tv-premium-logo.png',
    iconUrl: '/assets/lion-tv-premium-logo.png',
    planIconUrl: '/assets/lion-tv-premium-logo.png'
  },
  home: {
    headline: {
      es: 'Películas, series y deportes en vivo en un solo lugar',
      en: 'Movies, series and live sports in one place'
    },
    subheadline: {
      es: 'Disfruta Lion TV Premium en tus dispositivos favoritos. Ingresa tu correo para renovar, mejorar o contratar tu plan.',
      en: 'Enjoy Lion TV Premium on your favorite devices. Enter your email to renew, upgrade or subscribe.'
    },
    priceLine: {
      es: 'A partir de USD 4. Cancela cuando quieras.',
      en: 'Starting at USD 4. Cancel anytime.'
    },
    emailPlaceholder: { es: 'Correo electrónico', en: 'Email address' },
    ctaText: { es: 'Comenzar', en: 'Get Started' },
    heroBannerUrl: ''
  },
  whatsapp: {
    hirePhone: '50488204404',
    hireMessage: {
      es: 'Hola, quiero contratar Lion TV Premium.',
      en: 'Hi, I want to subscribe to Lion TV Premium.'
    },
    resellerPhone: '50488204404',
    resellerMessage: {
      es: 'Hola, quiero información para ser reseller de Lion TV Premium.',
      en: 'Hi, I want information about becoming a Lion TV Premium reseller.'
    }
  },
  features: { demoOnlineEnabled: true, referralsEnabled: true },
  content: { newMoviesUrl: '', newFutbolEventsUrl: '', featuredSportsEventsUrl: '' },
  stories: {
    enabled: true,
    title: { es: 'Historias', en: 'Stories' },
    autoplayMs: 6000,
    items: [
      {
        id: 'mundial-2026',
        title: { es: 'Mundial 2026', en: 'World Cup 2026' },
        subtitle: { es: 'México, Canadá y USA en Lion TV Premium', en: 'Mexico, Canada and USA on Lion TV Premium' },
        mediaType: 'image',
        mediaUrl: '',
        thumbnailUrl: '',
        ctaText: { es: 'Ver planes', en: 'See plans' },
        ctaUrl: '#plans',
        startsAt: '',
        endsAt: '',
        order: 1,
        active: true
      }
    ]
  },
  guidedTour: {
    enabled: true,
    autoStart: true,
    version: 'v1',
    buttonText: { es: 'Cómo comprar', en: 'How to buy' },
    steps: clone(DEFAULT_GUIDED_TOUR_STEPS)
  },
  demo: {
    apiBaseUrl: '',
    appCode: 'VIVO_PLAYER',
    appIconUrl: 'https://play-lh.googleusercontent.com/wrPb4PMamAVMDlB3enhOkHJpiFLx2Cppl9a_EbMxKiJ9Wd2NVOfd9oGOu2L0ubkfw3k=s96-rw',
    androidApkUrl: 'https://drive.google.com/uc?export=download&id=1So_FuKnx85mPRjB_SlaR60lSlvquvOak',
    androidBrowserUrl: 'http://webtv.vivo-player.com/',
    browserDemoUrl: 'http://webtv.vivo-player.com/',
    macosAppUrl: 'https://apps.apple.com/us/app/vivo-player-smart-iptv-player/id6479256394'
  },
  referrals: { apiBaseUrl: '' },
  payment: {
    paypalDefaultUrl: '',
    cardDefaultUrl: '',
    automaticDebitDefaultUrl: '',
    automaticDebitDiscountPercent: 5,
    postPaymentRedirectUrl: '',
    methods: ['PAYPAL', 'CARD', 'AUTOMATIC_DEBIT']
  },
  points: { enabled: true, renewalMessage: 'Puedes aplicar tus puntos disponibles al renovar con nuestro equipo.' },
  externalLinks: {
    speedTestUrl: 'https://fast.com',
    whatsappChannelUrl: 'https://whatsapp.com/channel/0029Vb74eCk9Bb61cxYPCN1J'
  },
  messages: {
    existingCustomerTitle: 'Tu cuenta Lion TV Premium',
    newCustomerTitle: 'Elige tu plan',
    expirationMessage: 'Renueva antes de la fecha de expiración para mantener tu acceso activo.'
  },
  moreReasons: {
    title: { es: 'Más motivos para unirte', en: 'More reasons to join' },
    cards: [
      {
        id: 'devices',
        title: { es: 'Disfruta en todos tus dispositivos', en: 'Watch on all your devices' },
        description: { es: 'TV, celular, tablet o computadora con una experiencia fluida.', en: 'TV, phone, tablet or computer with a smooth experience.' },
        icon: 'devices',
        order: 1,
        active: true
      },
      {
        id: 'entertainment',
        title: { es: 'Todo en un solo lugar', en: 'Everything in one place' },
        description: { es: 'Deportes, películas, canales y entretenimiento para toda la familia.', en: 'Sports, movies, channels and entertainment for the whole family.' },
        icon: 'entertainment',
        order: 2,
        active: true
      },
      {
        id: 'price',
        title: { es: 'Planes desde USD 4.99', en: 'Plans from USD 4.99' },
        description: { es: 'Elige el plan y la cantidad de dispositivos que necesitas.', en: 'Choose the plan and number of devices you need.' },
        icon: 'price',
        order: 3,
        active: true
      }
    ]
  },
  plans: [
    {
      code: 'BASIC',
      name: 'Básico',
      description: 'Acceso mensual Lion TV Premium',
      featured: false,
      specs: clone(DEFAULT_PLAN_SPECS),
      variants: [4.99, 5.99, 6.99, 7.99, 8.99].map((price, index) => ({
        connections: index + 1,
        price,
        currency: 'USD',
        packageId: null,
        paypalUrl: '',
        cardUrl: '',
        automaticDebitUrl: ''
      }))
    },
    {
      code: 'PRIME',
      name: 'Prime',
      description: 'Acceso mensual Lion TV Premium',
      featured: true,
      specs: clone(DEFAULT_PLAN_SPECS),
      variants: [9.99, 10.99, 11.99, 13.99, 15.99].map((price, index) => ({
        connections: index + 1,
        price,
        currency: 'USD',
        packageId: null,
        paypalUrl: '',
        cardUrl: '',
        automaticDebitUrl: ''
      }))
    },
    {
      code: 'PREMIUM',
      name: 'Premium',
      description: 'Acceso mensual Lion TV Premium',
      featured: false,
      specs: clone(DEFAULT_PLAN_SPECS),
      variants: [10.99, 11.99, 12.99, 14.99, 16.99].map((price, index) => ({
        connections: index + 1,
        price,
        currency: 'USD',
        packageId: null,
        paypalUrl: '',
        cardUrl: '',
        automaticDebitUrl: ''
      }))
    }
  ]
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function localized(value, fallback) {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return {
      es: value.es ?? fallback.es ?? '',
      en: value.en ?? fallback.en ?? value.es ?? fallback.es ?? ''
    };
  }
  if (typeof value === 'string') {
    return {
      es: value,
      en: fallback.en ?? fallback.es ?? value
    };
  }
  return clone(fallback);
}

function normalizeVariant(variant = {}, planCode = '', index = 0) {
  const nextPrices = {
    BASIC: [4.99, 5.99, 6.99, 7.99, 8.99],
    PRIME: [9.99, 10.99, 11.99, 13.99, 15.99],
    PREMIUM: [10.99, 11.99, 12.99, 14.99, 16.99]
  }[String(planCode || '').toUpperCase()];
  const legacyPrices = {
    BASIC: [4, 5, 6, 7, 8],
    PRIME: [6, 7, 8, 9, 10],
    PREMIUM: [10, 11, 12, 14, 16]
  }[String(planCode || '').toUpperCase()];
  const legacyPrice = legacyPrices?.[index];
  const migratedPrice = Number(variant.price) === legacyPrice && nextPrices?.[index] ? nextPrices[index] : variant.price;
  return {
    connections: Number(variant.connections || index + 1),
    price: Number(migratedPrice ?? 0),
    currency: variant.currency || 'USD',
    packageId: variant.packageId ?? null,
    paypalUrl: variant.paypalUrl || '',
    cardUrl: variant.cardUrl || '',
    automaticDebitUrl: variant.automaticDebitUrl || ''
  };
}

function normalizePlanSpec(spec = {}, index = 0) {
  const fallback = DEFAULT_PLAN_SPECS[index] || {
    id: `spec-${index + 1}`,
    label: { es: '', en: '' },
    value: { es: '', en: '' },
    order: index + 1,
    active: true
  };
  return {
    id: spec.id || fallback.id,
    label: localized(spec.label, fallback.label),
    value: localized(spec.value, fallback.value),
    order: Number(spec.order || fallback.order || index + 1),
    active: spec.active !== false
  };
}

function normalizePlan(plan = {}, index = 0) {
  const fallback = DEFAULT_CONFIG.plans[index] || {};
  const code = plan.code || fallback.code || `PLAN_${index + 1}`;
  const variants = Array.isArray(plan.variants) && plan.variants.length ? plan.variants : fallback.variants || [];
  const specs = Array.isArray(plan.specs) && plan.specs.length ? plan.specs : DEFAULT_PLAN_SPECS;
  return {
    ...fallback,
    ...plan,
    code,
    specs: specs.map((spec, specIndex) => normalizePlanSpec(spec, specIndex)),
    variants: variants.map((variant, variantIndex) => normalizeVariant(variant, code, variantIndex))
  };
}

function normalizeStoryItem(item = {}, index = 0) {
  const fallback = DEFAULT_CONFIG.stories.items[index] || {
    id: `story-${index + 1}`,
    title: { es: '', en: '' },
    subtitle: { es: '', en: '' },
    ctaText: { es: '', en: '' },
    order: index + 1,
    active: true
  };
  return {
    id: item.id || fallback.id || `story-${index + 1}`,
    title: localized(item.title, fallback.title || { es: '', en: '' }),
    subtitle: localized(item.subtitle, fallback.subtitle || { es: '', en: '' }),
    mediaType: item.mediaType === 'video' ? 'video' : 'image',
    mediaUrl: item.mediaUrl || '',
    thumbnailUrl: item.thumbnailUrl || '',
    ctaText: localized(item.ctaText, fallback.ctaText || { es: '', en: '' }),
    ctaUrl: item.ctaUrl || '',
    startsAt: item.startsAt || '',
    endsAt: item.endsAt || '',
    order: Number(item.order || fallback.order || index + 1),
    active: item.active !== false
  };
}

function normalizeTourStep(step = {}, index = 0) {
  const fallback = DEFAULT_GUIDED_TOUR_STEPS[index] || {
    id: `tour-step-${index + 1}`,
    target: 'email-capture',
    action: 'none',
    title: { es: '', en: '' },
    description: { es: '', en: '' },
    order: index + 1,
    active: true
  };
  return {
    id: step.id || fallback.id || `tour-step-${index + 1}`,
    target: step.target || fallback.target || 'email-capture',
    action: step.action || fallback.action || 'none',
    title: localized(step.title, fallback.title || { es: '', en: '' }),
    description: localized(step.description, fallback.description || { es: '', en: '' }),
    order: Number(step.order || fallback.order || index + 1),
    active: step.active !== false
  };
}

function normalizeConfig(payload) {
  const next = {
    ...clone(DEFAULT_CONFIG),
    ...(payload || {}),
    language: { ...DEFAULT_CONFIG.language, ...(payload?.language || {}) },
    brand: { ...DEFAULT_CONFIG.brand, ...(payload?.brand || {}) },
    home: { ...DEFAULT_CONFIG.home, ...(payload?.home || {}) },
    whatsapp: { ...DEFAULT_CONFIG.whatsapp, ...(payload?.whatsapp || {}) },
    features: { ...DEFAULT_CONFIG.features, ...(payload?.features || {}) },
    content: { ...DEFAULT_CONFIG.content, ...(payload?.content || {}) },
    stories: {
      ...DEFAULT_CONFIG.stories,
      ...(payload?.stories || {}),
      items:
        Array.isArray(payload?.stories?.items) && payload.stories.items.length
          ? payload.stories.items
          : clone(DEFAULT_CONFIG.stories.items)
    },
    guidedTour: {
      ...DEFAULT_CONFIG.guidedTour,
      ...(payload?.guidedTour || {}),
      steps:
        Array.isArray(payload?.guidedTour?.steps) && payload.guidedTour.steps.length
          ? payload.guidedTour.steps
          : clone(DEFAULT_CONFIG.guidedTour.steps)
    },
    demo: { ...DEFAULT_CONFIG.demo, ...(payload?.demo || {}) },
    referrals: { ...DEFAULT_CONFIG.referrals, ...(payload?.referrals || {}) },
    payment: { ...DEFAULT_CONFIG.payment, ...(payload?.payment || {}) },
    points: { ...DEFAULT_CONFIG.points, ...(payload?.points || {}) },
    externalLinks: { ...DEFAULT_CONFIG.externalLinks, ...(payload?.externalLinks || {}) },
    messages: { ...DEFAULT_CONFIG.messages, ...(payload?.messages || {}) },
    moreReasons: {
      ...DEFAULT_CONFIG.moreReasons,
      ...(payload?.moreReasons || {}),
      cards:
        Array.isArray(payload?.moreReasons?.cards) && payload.moreReasons.cards.length
          ? payload.moreReasons.cards
          : clone(DEFAULT_CONFIG.moreReasons.cards)
    },
    plans: Array.isArray(payload?.plans) && payload.plans.length ? payload.plans : clone(DEFAULT_CONFIG.plans)
  };
  next.home.headline = localized(next.home.headline, DEFAULT_CONFIG.home.headline);
  next.home.subheadline = localized(next.home.subheadline, DEFAULT_CONFIG.home.subheadline);
  next.home.priceLine = localized(next.home.priceLine, DEFAULT_CONFIG.home.priceLine);
  next.home.emailPlaceholder = localized(next.home.emailPlaceholder, DEFAULT_CONFIG.home.emailPlaceholder);
  next.home.ctaText = localized(next.home.ctaText, DEFAULT_CONFIG.home.ctaText);
  next.whatsapp.hireMessage = localized(next.whatsapp.hireMessage, DEFAULT_CONFIG.whatsapp.hireMessage);
  next.whatsapp.resellerMessage = localized(next.whatsapp.resellerMessage, DEFAULT_CONFIG.whatsapp.resellerMessage);
  next.stories.title = localized(next.stories.title, DEFAULT_CONFIG.stories.title);
  next.stories.autoplayMs = Number(next.stories.autoplayMs || DEFAULT_CONFIG.stories.autoplayMs);
  next.stories.items = (next.stories.items || []).map((item, index) => normalizeStoryItem(item, index));
  next.guidedTour.buttonText = localized(next.guidedTour.buttonText, DEFAULT_CONFIG.guidedTour.buttonText);
  next.guidedTour.version = next.guidedTour.version || DEFAULT_CONFIG.guidedTour.version;
  next.guidedTour.steps = (next.guidedTour.steps || []).map((step, index) => normalizeTourStep(step, index));
  next.moreReasons.title = localized(next.moreReasons.title, DEFAULT_CONFIG.moreReasons.title);
  next.moreReasons.cards = (next.moreReasons.cards || []).map((card, index) => ({
    id: card.id || `reason-${index + 1}`,
    title: localized(card.title, { es: '', en: '' }),
    description: localized(card.description, { es: '', en: '' }),
    icon: card.icon || 'devices',
    order: Number(card.order || index + 1),
    active: card.active !== false
  }));
  next.payment.automaticDebitDiscountPercent = Number(next.payment.automaticDebitDiscountPercent ?? 5);
  next.payment.methods = Array.from(new Set([...(next.payment.methods || []), 'AUTOMATIC_DEBIT']));
  next.plans = (next.plans || []).map((plan, index) => normalizePlan(plan, index));
  return next;
}

export default function EcommerceSettingsLionTv() {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { accessToken } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingStoryId, setUploadingStoryId] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState(normalizeConfig(DEFAULT_CONFIG));

  const loadConfig = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError('');
    try {
      const payload = await getAdminEcommerceSiteConfig({ skipAuthRedirect: true });
      setForm(normalizeConfig(payload));
    } catch (err) {
      setError(err?.response?.data?.message || 'No se pudo cargar la configuración del ecommerce.');
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  const planCount = form.plans?.length || 0;
  const variantCount = useMemo(
    () => (form.plans || []).reduce((total, plan) => total + (Array.isArray(plan.variants) ? plan.variants.length : 0), 0),
    [form.plans]
  );
  const demoEnabledHelper = form.features.demoOnlineEnabled
    ? t('ecommerceSettings.demoControl.enabledHelper', 'Los clientes pueden crear demos en línea.')
    : t('ecommerceSettings.demoControl.disabledHelper', 'El ecommerce mostrará solo Activación inmediata.');

  const setPath = (path, value) => {
    setForm((prev) => {
      const next = clone(prev);
      let cursor = next;
      path.slice(0, -1).forEach((key) => {
        if (!cursor[key] || typeof cursor[key] !== 'object') cursor[key] = {};
        cursor = cursor[key];
      });
      cursor[path[path.length - 1]] = value;
      return next;
    });
  };

  const updatePlan = (planIndex, field, value) => {
    setForm((prev) => {
      const next = clone(prev);
      next.plans[planIndex][field] = value;
      return next;
    });
  };

  const updateVariant = (planIndex, variantIndex, field, value) => {
    setForm((prev) => {
      const next = clone(prev);
      next.plans[planIndex].variants[variantIndex][field] = value;
      return next;
    });
  };

  const updatePlanSpec = (planIndex, specIndex, path, value) => {
    setForm((prev) => {
      const next = clone(prev);
      let cursor = next.plans[planIndex].specs[specIndex];
      path.slice(0, -1).forEach((key) => {
        if (!cursor[key] || typeof cursor[key] !== 'object') cursor[key] = {};
        cursor = cursor[key];
      });
      cursor[path[path.length - 1]] = value;
      return next;
    });
  };

  const addPlanSpec = (planIndex) => {
    setForm((prev) => {
      const next = clone(prev);
      const specs = next.plans[planIndex].specs || [];
      specs.push({
        id: `spec-${Date.now()}`,
        label: { es: 'Nueva opción', en: 'New option' },
        value: { es: '', en: '' },
        order: specs.length + 1,
        active: true
      });
      next.plans[planIndex].specs = specs;
      return next;
    });
  };

  const removePlanSpec = (planIndex, specIndex) => {
    setForm((prev) => {
      const next = clone(prev);
      next.plans[planIndex].specs = next.plans[planIndex].specs.filter((_, index) => index !== specIndex);
      return next;
    });
  };

  const addVariant = (planIndex) => {
    setForm((prev) => {
      const next = clone(prev);
      const variants = next.plans[planIndex].variants || [];
      variants.push({
        connections: variants.length + 1,
        price: 0,
        currency: 'USD',
        packageId: null,
        paypalUrl: '',
        cardUrl: '',
        automaticDebitUrl: ''
      });
      next.plans[planIndex].variants = variants;
      return next;
    });
  };

  const removeVariant = (planIndex, variantIndex) => {
    setForm((prev) => {
      const next = clone(prev);
      next.plans[planIndex].variants = next.plans[planIndex].variants.filter((_, index) => index !== variantIndex);
      return next;
    });
  };

  const updateReasonCard = (cardIndex, path, value) => {
    setForm((prev) => {
      const next = clone(prev);
      let cursor = next.moreReasons.cards[cardIndex];
      path.slice(0, -1).forEach((key) => {
        if (!cursor[key] || typeof cursor[key] !== 'object') cursor[key] = {};
        cursor = cursor[key];
      });
      cursor[path[path.length - 1]] = value;
      return next;
    });
  };

  const addReasonCard = () => {
    setForm((prev) => {
      const next = clone(prev);
      const cards = next.moreReasons.cards || [];
      cards.push({
        id: `reason-${Date.now()}`,
        title: { es: 'Nuevo motivo', en: 'New reason' },
        description: { es: '', en: '' },
        icon: 'devices',
        order: cards.length + 1,
        active: true
      });
      next.moreReasons.cards = cards;
      return next;
    });
  };

  const removeReasonCard = (cardIndex) => {
    setForm((prev) => {
      const next = clone(prev);
      next.moreReasons.cards = next.moreReasons.cards.filter((_, index) => index !== cardIndex);
      return next;
    });
  };

  const updateStoryItem = (storyIndex, path, value) => {
    setForm((prev) => {
      const next = clone(prev);
      let cursor = next.stories.items[storyIndex];
      path.slice(0, -1).forEach((key) => {
        if (!cursor[key] || typeof cursor[key] !== 'object') cursor[key] = {};
        cursor = cursor[key];
      });
      cursor[path[path.length - 1]] = value;
      return next;
    });
  };

  const addStoryItem = () => {
    setForm((prev) => {
      const next = clone(prev);
      const items = next.stories.items || [];
      items.push({
        id: `story-${Date.now()}`,
        title: { es: 'Nueva historia', en: 'New story' },
        subtitle: { es: '', en: '' },
        mediaType: 'image',
        mediaUrl: '',
        thumbnailUrl: '',
        ctaText: { es: 'Ver más', en: 'See more' },
        ctaUrl: '#plans',
        startsAt: '',
        endsAt: '',
        order: items.length + 1,
        active: true
      });
      next.stories.items = items;
      return next;
    });
  };

  const removeStoryItem = (storyIndex) => {
    setForm((prev) => {
      const next = clone(prev);
      next.stories.items = next.stories.items.filter((_, index) => index !== storyIndex);
      return next;
    });
  };

  const updateTourStep = (stepIndex, path, value) => {
    setForm((prev) => {
      const next = clone(prev);
      let cursor = next.guidedTour.steps[stepIndex];
      path.slice(0, -1).forEach((key) => {
        if (!cursor[key] || typeof cursor[key] !== 'object') cursor[key] = {};
        cursor = cursor[key];
      });
      cursor[path[path.length - 1]] = value;
      return next;
    });
  };

  const addTourStep = () => {
    setForm((prev) => {
      const next = clone(prev);
      const steps = next.guidedTour.steps || [];
      steps.push({
        id: `tour-step-${Date.now()}`,
        target: 'email-capture',
        action: 'none',
        title: { es: 'Nuevo paso', en: 'New step' },
        description: { es: '', en: '' },
        order: steps.length + 1,
        active: true
      });
      next.guidedTour.steps = steps;
      return next;
    });
  };

  const removeTourStep = (stepIndex) => {
    setForm((prev) => {
      const next = clone(prev);
      next.guidedTour.steps = next.guidedTour.steps.filter((_, index) => index !== stepIndex);
      return next;
    });
  };

  const handleStoryFileSelected = async (storyIndex, file) => {
    if (!file || typeof file.size !== 'number' || file.size <= 0) {
      enqueueSnackbar('Selecciona un archivo válido para subir.', { variant: 'warning' });
      return;
    }
    const storyId = form.stories.items?.[storyIndex]?.id || `story-${storyIndex}`;
    setUploadingStoryId(storyId);
    try {
      const payload = await uploadAdminEcommerceStoryMedia(file, { skipAuthRedirect: true });
      setForm((prev) => {
        const next = clone(prev);
        const item = next.stories.items[storyIndex];
        if (!item) return next;
        item.mediaUrl = payload?.url || item.mediaUrl;
        item.mediaType = payload?.mediaType || item.mediaType || 'image';
        if (!item.thumbnailUrl && payload?.mediaType === 'image') {
          item.thumbnailUrl = payload.url;
        }
        return next;
      });
      enqueueSnackbar('Archivo de historia subido.', { variant: 'success' });
    } catch (err) {
      const message = err?.response?.data?.message || 'No se pudo subir el archivo de historia.';
      enqueueSnackbar(message, { variant: 'error' });
    } finally {
      setUploadingStoryId('');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const payload = await updateAdminEcommerceSiteConfig(form, { skipAuthRedirect: true });
      setForm(normalizeConfig(payload));
      enqueueSnackbar('Configuración ecommerce guardada.', { variant: 'success' });
    } catch (err) {
      const message = err?.response?.data?.message || 'No se pudo guardar la configuración ecommerce.';
      setError(message);
      enqueueSnackbar(message, { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageLoadingState
        title={t('menu.ecommerceSettings', 'Configuración ecommerce')}
        description="Cargando configuración pública del storefront..."
      />
    );
  }

  if (error && !form) {
    return (
      <PageErrorState
        title={t('menu.ecommerceSettings', 'Configuración ecommerce')}
        description={error}
        onRetry={loadConfig}
      />
    );
  }

  return (
    <MainCard
      title={t('menu.ecommerceSettings', 'Configuración ecommerce')}
      secondary={
        <Button variant="contained" startIcon={<SaveOutlinedIcon />} onClick={handleSave} disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </Button>
      }
    >
      <Stack spacing={gridSpacing}>
        <Alert severity="info">
          Esta configuración alimenta el nuevo ecommerce público de Lion TV Premium. Los links de pago se mantienen privados y
          solo se resuelven desde el backend en el endpoint de redirección.
        </Alert>
        {error ? <Alert severity="warning">{error}</Alert> : null}

        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={4}>
            <SummaryCard icon={<StorefrontOutlinedIcon />} label="Planes" value={planCount} helper={`${variantCount} variantes configuradas`} />
          </Grid>
          <Grid item xs={12} md={4}>
            <SummaryCard
              label={t('ecommerceSettings.demoControl.summaryLabel', 'Demos ecommerce')}
              value={
                form.features.demoOnlineEnabled
                  ? t('ecommerceSettings.demoControl.enabledValue', 'Permitidas')
                  : t('ecommerceSettings.demoControl.disabledValue', 'Solo activación inmediata')
              }
              helper={demoEnabledHelper}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <SummaryCard
              label="Referidos"
              value={form.features.referralsEnabled ? 'Activos' : 'Inactivos'}
              helper={form.referrals.apiBaseUrl || 'Usará VITE_API_SHOPIFY_DEMOS'}
            />
          </Grid>
        </Grid>

        <SettingsSection title="Marca, idioma y home" description="Logo, banner, idioma por defecto y textos principales del flujo inicial tipo Netflix.">
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="Nombre de marca" value={form.brand.name} onChange={(event) => setPath(['brand', 'name'], event.target.value)} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="Logo URL" value={form.brand.logoUrl} onChange={(event) => setPath(['brand', 'logoUrl'], event.target.value)} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="Icon URL" value={form.brand.iconUrl} onChange={(event) => setPath(['brand', 'iconUrl'], event.target.value)} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                label="Idioma por defecto"
                value={form.language.default || 'es'}
                onChange={(event) => setPath(['language', 'default'], event.target.value)}
              >
                <MenuItem value="es">Español</MenuItem>
                <MenuItem value="en">Inglés</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Banner principal URL"
                value={form.home.heroBannerUrl}
                onChange={(event) => setPath(['home', 'heroBannerUrl'], event.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Headline ES"
                value={form.home.headline.es}
                onChange={(event) => setPath(['home', 'headline', 'es'], event.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Headline EN"
                value={form.home.headline.en}
                onChange={(event) => setPath(['home', 'headline', 'en'], event.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                multiline
                minRows={2}
                label="Subheadline ES"
                value={form.home.subheadline.es}
                onChange={(event) => setPath(['home', 'subheadline', 'es'], event.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                multiline
                minRows={2}
                label="Subheadline EN"
                value={form.home.subheadline.en}
                onChange={(event) => setPath(['home', 'subheadline', 'en'], event.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Texto precio ES"
                value={form.home.priceLine.es}
                onChange={(event) => setPath(['home', 'priceLine', 'es'], event.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Texto precio EN"
                value={form.home.priceLine.en}
                onChange={(event) => setPath(['home', 'priceLine', 'en'], event.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Placeholder correo ES"
                value={form.home.emailPlaceholder.es}
                onChange={(event) => setPath(['home', 'emailPlaceholder', 'es'], event.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Placeholder correo EN"
                value={form.home.emailPlaceholder.en}
                onChange={(event) => setPath(['home', 'emailPlaceholder', 'en'], event.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="CTA ES" value={form.home.ctaText.es} onChange={(event) => setPath(['home', 'ctaText', 'es'], event.target.value)} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="CTA EN" value={form.home.ctaText.en} onChange={(event) => setPath(['home', 'ctaText', 'en'], event.target.value)} />
            </Grid>
          </Grid>
        </SettingsSection>

        <SettingsSection title="WhatsApp y enlaces externos" description="Botones públicos de contratación, reseller y link de test de velocidad.">
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="WhatsApp contratación"
                value={form.whatsapp.hirePhone}
                onChange={(event) => setPath(['whatsapp', 'hirePhone'], event.target.value)}
                helperText="Solo números. Ejemplo: 50488204404."
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="WhatsApp reseller"
                value={form.whatsapp.resellerPhone}
                onChange={(event) => setPath(['whatsapp', 'resellerPhone'], event.target.value)}
                helperText="Solo números. Si queda vacío, el botón se oculta."
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                multiline
                minRows={2}
                label="Mensaje contratación ES"
                value={form.whatsapp.hireMessage.es}
                onChange={(event) => setPath(['whatsapp', 'hireMessage', 'es'], event.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                multiline
                minRows={2}
                label="Mensaje contratación EN"
                value={form.whatsapp.hireMessage.en}
                onChange={(event) => setPath(['whatsapp', 'hireMessage', 'en'], event.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                multiline
                minRows={2}
                label="Mensaje reseller ES"
                value={form.whatsapp.resellerMessage.es}
                onChange={(event) => setPath(['whatsapp', 'resellerMessage', 'es'], event.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                multiline
                minRows={2}
                label="Mensaje reseller EN"
                value={form.whatsapp.resellerMessage.en}
                onChange={(event) => setPath(['whatsapp', 'resellerMessage', 'en'], event.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Link test de velocidad"
                value={form.externalLinks.speedTestUrl}
                onChange={(event) => setPath(['externalLinks', 'speedTestUrl'], event.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Canal de WhatsApp"
                value={form.externalLinks.whatsappChannelUrl}
                onChange={(event) => setPath(['externalLinks', 'whatsappChannelUrl'], event.target.value)}
                helperText="Se muestra como link horizontal en el footer del ecommerce."
              />
            </Grid>
          </Grid>
        </SettingsSection>

        <SettingsSection title="Más motivos para unirte" description="Tarjetas visuales del storefront. Se muestran solo las activas y se ordenan por orden ascendente.">
          <Stack spacing={2}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Título sección ES"
                  value={form.moreReasons.title.es}
                  onChange={(event) => setPath(['moreReasons', 'title', 'es'], event.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Título sección EN"
                  value={form.moreReasons.title.en}
                  onChange={(event) => setPath(['moreReasons', 'title', 'en'], event.target.value)}
                />
              </Grid>
            </Grid>

            {(form.moreReasons.cards || []).map((card, cardIndex) => (
              <Card variant="outlined" key={card.id || cardIndex}>
                <CardContent>
                  <Grid container spacing={1.5} alignItems="center">
                    <Grid item xs={12} md={2}>
                      <TextField fullWidth label="ID" value={card.id} onChange={(event) => updateReasonCard(cardIndex, ['id'], event.target.value)} />
                    </Grid>
                    <Grid item xs={6} md={1}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Orden"
                        value={card.order}
                        onChange={(event) => updateReasonCard(cardIndex, ['order'], Number(event.target.value || 0))}
                      />
                    </Grid>
                    <Grid item xs={6} md={2}>
                      <TextField fullWidth select label="Icono" value={card.icon} onChange={(event) => updateReasonCard(cardIndex, ['icon'], event.target.value)}>
                        {['devices', 'entertainment', 'sports', 'price', 'cancel', 'demo', 'support'].map((icon) => (
                          <MenuItem value={icon} key={icon}>
                            {icon}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        label="Título ES"
                        value={card.title.es}
                        onChange={(event) => updateReasonCard(cardIndex, ['title', 'es'], event.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        label="Título EN"
                        value={card.title.en}
                        onChange={(event) => updateReasonCard(cardIndex, ['title', 'en'], event.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} md={1}>
                      <FormControlLabel
                        control={<Switch checked={Boolean(card.active)} onChange={(event) => updateReasonCard(cardIndex, ['active'], event.target.checked)} />}
                        label="Activa"
                      />
                    </Grid>
                    <Grid item xs={12} md={1}>
                      <Tooltip title="Eliminar card">
                        <span>
                          <IconButton color="error" onClick={() => removeReasonCard(cardIndex)}>
                            <DeleteOutlineOutlinedIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        multiline
                        minRows={2}
                        label="Descripción ES"
                        value={card.description.es}
                        onChange={(event) => updateReasonCard(cardIndex, ['description', 'es'], event.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        multiline
                        minRows={2}
                        label="Descripción EN"
                        value={card.description.en}
                        onChange={(event) => updateReasonCard(cardIndex, ['description', 'en'], event.target.value)}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}

            <Box>
              <Button variant="outlined" startIcon={<AddCircleOutlineOutlinedIcon />} onClick={addReasonCard}>
                Agregar motivo
              </Button>
            </Box>
          </Stack>
        </SettingsSection>

        <SettingsSection title="Historias estilo Instagram" description="Contenido corto para mostrar debajo del hero del ecommerce. Puedes usar URLs externas o subir archivos al servidor.">
          <Stack spacing={2}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={3}>
                <FormControlLabel
                  control={<Switch checked={Boolean(form.stories.enabled)} onChange={(event) => setPath(['stories', 'enabled'], event.target.checked)} />}
                  label="Activar historias"
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  type="number"
                  label="Duración por historia (ms)"
                  value={form.stories.autoplayMs}
                  onChange={(event) => setPath(['stories', 'autoplayMs'], Number(event.target.value || 0))}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Título sección ES"
                  value={form.stories.title.es}
                  onChange={(event) => setPath(['stories', 'title', 'es'], event.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Título sección EN"
                  value={form.stories.title.en}
                  onChange={(event) => setPath(['stories', 'title', 'en'], event.target.value)}
                />
              </Grid>
            </Grid>

            {(form.stories.items || []).map((story, storyIndex) => {
              const uploading = uploadingStoryId === story.id;
              const previewUrl = story.thumbnailUrl || story.mediaUrl;
              return (
                <Card variant="outlined" key={story.id || storyIndex}>
                  <CardContent>
                    <Grid container spacing={1.5} alignItems="center">
                      <Grid item xs={12} sm={3} md={2}>
                        <Stack spacing={1} alignItems="center">
                          <Box
                            sx={{
                              width: 86,
                              height: 86,
                              p: '3px',
                              borderRadius: '999px',
                              background: 'linear-gradient(135deg, #e50914, #f6b94d, #7a0008)'
                            }}
                          >
                            <Box
                              sx={{
                                width: '100%',
                                height: '100%',
                                overflow: 'hidden',
                                borderRadius: '999px',
                                bgcolor: '#111',
                                display: 'grid',
                                placeItems: 'center',
                                color: '#fff',
                                fontWeight: 700,
                                fontSize: 12,
                                textAlign: 'center'
                              }}
                            >
                              {previewUrl ? (
                                story.mediaType === 'video' && !story.thumbnailUrl ? (
                                  'VIDEO'
                                ) : (
                                  <Box component="img" src={previewUrl} alt={story.title.es || 'Historia'} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                )
                              ) : (
                                'Historia'
                              )}
                            </Box>
                          </Box>
                          <Button size="small" variant="outlined" startIcon={<CloudUploadOutlinedIcon />} component="label" disabled={uploading}>
                            {uploading ? 'Subiendo...' : 'Subir'}
                            <input
                              hidden
                              type="file"
                              accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
                              onChange={(event) => {
                                handleStoryFileSelected(storyIndex, event.target.files?.[0]);
                                event.target.value = '';
                              }}
                            />
                          </Button>
                        </Stack>
                      </Grid>

                      <Grid item xs={12} sm={9} md={10}>
                        <Grid container spacing={1.5} alignItems="center">
                          <Grid item xs={12} md={2}>
                            <TextField fullWidth label="ID" value={story.id} onChange={(event) => updateStoryItem(storyIndex, ['id'], event.target.value)} />
                          </Grid>
                          <Grid item xs={6} md={1}>
                            <TextField
                              fullWidth
                              type="number"
                              label="Orden"
                              value={story.order}
                              onChange={(event) => updateStoryItem(storyIndex, ['order'], Number(event.target.value || 0))}
                            />
                          </Grid>
                          <Grid item xs={6} md={2}>
                            <TextField
                              fullWidth
                              select
                              label="Tipo"
                              value={story.mediaType}
                              onChange={(event) => updateStoryItem(storyIndex, ['mediaType'], event.target.value)}
                            >
                              <MenuItem value="image">Imagen</MenuItem>
                              <MenuItem value="video">Video</MenuItem>
                            </TextField>
                          </Grid>
                          <Grid item xs={6} md={2}>
                            <FormControlLabel
                              control={<Switch checked={Boolean(story.active)} onChange={(event) => updateStoryItem(storyIndex, ['active'], event.target.checked)} />}
                              label="Activa"
                            />
                          </Grid>
                          <Grid item xs={6} md={1}>
                            <Tooltip title="Eliminar historia">
                              <span>
                                <IconButton color="error" onClick={() => removeStoryItem(storyIndex)}>
                                  <DeleteOutlineOutlinedIcon />
                                </IconButton>
                              </span>
                            </Tooltip>
                          </Grid>
                          <Grid item xs={12} md={2}>
                            <TextField
                              fullWidth
                              type="date"
                              label="Inicio"
                              InputLabelProps={{ shrink: true }}
                              value={story.startsAt || ''}
                              onChange={(event) => updateStoryItem(storyIndex, ['startsAt'], event.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12} md={2}>
                            <TextField
                              fullWidth
                              type="date"
                              label="Fin"
                              InputLabelProps={{ shrink: true }}
                              value={story.endsAt || ''}
                              onChange={(event) => updateStoryItem(storyIndex, ['endsAt'], event.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Título ES"
                              value={story.title.es}
                              onChange={(event) => updateStoryItem(storyIndex, ['title', 'es'], event.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Título EN"
                              value={story.title.en}
                              onChange={(event) => updateStoryItem(storyIndex, ['title', 'en'], event.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Subtítulo ES"
                              value={story.subtitle.es}
                              onChange={(event) => updateStoryItem(storyIndex, ['subtitle', 'es'], event.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Subtítulo EN"
                              value={story.subtitle.en}
                              onChange={(event) => updateStoryItem(storyIndex, ['subtitle', 'en'], event.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Media URL"
                              value={story.mediaUrl}
                              onChange={(event) => updateStoryItem(storyIndex, ['mediaUrl'], event.target.value)}
                              helperText="Puedes pegar una URL externa o usar el botón Subir."
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Thumbnail URL"
                              value={story.thumbnailUrl}
                              onChange={(event) => updateStoryItem(storyIndex, ['thumbnailUrl'], event.target.value)}
                              helperText="Recomendado para videos."
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="CTA ES"
                              value={story.ctaText.es}
                              onChange={(event) => updateStoryItem(storyIndex, ['ctaText', 'es'], event.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="CTA EN"
                              value={story.ctaText.en}
                              onChange={(event) => updateStoryItem(storyIndex, ['ctaText', 'en'], event.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="CTA URL"
                              value={story.ctaUrl}
                              onChange={(event) => updateStoryItem(storyIndex, ['ctaUrl'], event.target.value)}
                              helperText="#plans, #demo, #referidos o URL HTTPS."
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              );
            })}

            <Box>
              <Button variant="outlined" startIcon={<AddCircleOutlineOutlinedIcon />} onClick={addStoryItem}>
                Agregar historia
              </Button>
            </Box>
          </Stack>
        </SettingsSection>

        <SettingsSection title="Tour guiado" description="Onboarding visible en el ecommerce para explicar cómo comprar un plan y cómo crear una demo.">
          <Stack spacing={2}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={3}>
                <FormControlLabel
                  control={<Switch checked={Boolean(form.guidedTour.enabled)} onChange={(event) => setPath(['guidedTour', 'enabled'], event.target.checked)} />}
                  label="Activar tour"
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControlLabel
                  control={<Switch checked={Boolean(form.guidedTour.autoStart)} onChange={(event) => setPath(['guidedTour', 'autoStart'], event.target.checked)} />}
                  label="Abrir en primera visita"
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  label="Versión"
                  value={form.guidedTour.version}
                  onChange={(event) => setPath(['guidedTour', 'version'], event.target.value)}
                  helperText="Cambia este valor para reabrirlo a usuarios que ya lo vieron."
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  label="Botón ES"
                  value={form.guidedTour.buttonText.es}
                  onChange={(event) => setPath(['guidedTour', 'buttonText', 'es'], event.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  label="Botón EN"
                  value={form.guidedTour.buttonText.en}
                  onChange={(event) => setPath(['guidedTour', 'buttonText', 'en'], event.target.value)}
                />
              </Grid>
            </Grid>

            <Alert severity="info">
              Los targets deben existir en el ecommerce. Para pasos de demo usa la acción “Abrir demo” para que el modal se abra antes de enfocar Vivo Player u OTP.
            </Alert>

            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              {(form.guidedTour.steps || [])
                .slice()
                .sort((a, b) => Number(a.order || 0) - Number(b.order || 0))
                .map((step) => (
                  <Chip
                    key={`tour-preview-${step.id}`}
                    label={`${step.order}. ${step.target} · ${step.action}`}
                    color={step.active ? 'primary' : 'default'}
                    variant={step.active ? 'filled' : 'outlined'}
                    size="small"
                  />
                ))}
            </Stack>

            {(form.guidedTour.steps || []).map((step, stepIndex) => (
              <Card variant="outlined" key={step.id || stepIndex}>
                <CardContent>
                  <Grid container spacing={1.5} alignItems="center">
                    <Grid item xs={12} md={2}>
                      <TextField fullWidth label="ID" value={step.id} onChange={(event) => updateTourStep(stepIndex, ['id'], event.target.value)} />
                    </Grid>
                    <Grid item xs={6} md={1}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Orden"
                        value={step.order}
                        onChange={(event) => updateTourStep(stepIndex, ['order'], Number(event.target.value || 0))}
                      />
                    </Grid>
                    <Grid item xs={6} md={2}>
                      <TextField
                        fullWidth
                        select
                        label="Target"
                        value={step.target}
                        onChange={(event) => updateTourStep(stepIndex, ['target'], event.target.value)}
                      >
                        {TOUR_TARGET_OPTIONS.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField
                        fullWidth
                        select
                        label="Acción"
                        value={step.action}
                        onChange={(event) => updateTourStep(stepIndex, ['action'], event.target.value)}
                      >
                        {TOUR_ACTION_OPTIONS.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={8} md={2}>
                      <FormControlLabel
                        control={<Switch checked={Boolean(step.active)} onChange={(event) => updateTourStep(stepIndex, ['active'], event.target.checked)} />}
                        label="Activo"
                      />
                    </Grid>
                    <Grid item xs={4} md={1}>
                      <Tooltip title="Eliminar paso">
                        <span>
                          <IconButton color="error" onClick={() => removeTourStep(stepIndex)}>
                            <DeleteOutlineOutlinedIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Título ES"
                        value={step.title.es}
                        onChange={(event) => updateTourStep(stepIndex, ['title', 'es'], event.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Título EN"
                        value={step.title.en}
                        onChange={(event) => updateTourStep(stepIndex, ['title', 'en'], event.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        multiline
                        minRows={2}
                        label="Descripción ES"
                        value={step.description.es}
                        onChange={(event) => updateTourStep(stepIndex, ['description', 'es'], event.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        multiline
                        minRows={2}
                        label="Descripción EN"
                        value={step.description.en}
                        onChange={(event) => updateTourStep(stepIndex, ['description', 'en'], event.target.value)}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}

            <Box>
              <Button variant="outlined" startIcon={<AddCircleOutlineOutlinedIcon />} onClick={addTourStep}>
                Agregar paso
              </Button>
            </Box>
          </Stack>
        </SettingsSection>

        <SettingsSection
          title={t('ecommerceSettings.sections.featuresTitle', 'Funciones y APIs')}
          description={t('ecommerceSettings.sections.featuresDescription', 'Controla demos, referidos y URLs públicas de contenido.')}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Stack spacing={0.75}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={Boolean(form.features.demoOnlineEnabled)}
                      onChange={(event) => setPath(['features', 'demoOnlineEnabled'], event.target.checked)}
                    />
                  }
                  label={t('ecommerceSettings.demoControl.switchLabel', 'Permitir crear demos desde ecommerce')}
                />
                <Typography variant="caption" color="text.secondary">
                  {demoEnabledHelper}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={Boolean(form.features.referralsEnabled)}
                    onChange={(event) => setPath(['features', 'referralsEnabled'], event.target.checked)}
                  />
                }
                label="Activar referidos"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="API base demo"
                value={form.demo.apiBaseUrl}
                onChange={(event) => setPath(['demo', 'apiBaseUrl'], event.target.value)}
                helperText="Vacío usa VITE_API_SHOPIFY_DEMOS del ecommerce."
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="App code demo" value={form.demo.appCode} onChange={(event) => setPath(['demo', 'appCode'], event.target.value)} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Icono Vivo Player URL"
                value={form.demo.appIconUrl}
                onChange={(event) => setPath(['demo', 'appIconUrl'], event.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Android APK URL"
                value={form.demo.androidApkUrl}
                onChange={(event) => setPath(['demo', 'androidApkUrl'], event.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Android navegador URL"
                value={form.demo.androidBrowserUrl}
                onChange={(event) => setPath(['demo', 'androidBrowserUrl'], event.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Demo web desktop URL"
                value={form.demo.browserDemoUrl}
                onChange={(event) => setPath(['demo', 'browserDemoUrl'], event.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="macOS App Store URL"
                value={form.demo.macosAppUrl}
                onChange={(event) => setPath(['demo', 'macosAppUrl'], event.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="API base referidos"
                value={form.referrals.apiBaseUrl}
                onChange={(event) => setPath(['referrals', 'apiBaseUrl'], event.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tendencia películas URL"
                value={form.content.newMoviesUrl}
                onChange={(event) => setPath(['content', 'newMoviesUrl'], event.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Deportes hoy URL"
                value={form.content.newFutbolEventsUrl}
                onChange={(event) => setPath(['content', 'newFutbolEventsUrl'], event.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Featured sports URL"
                value={form.content.featuredSportsEventsUrl}
                onChange={(event) => setPath(['content', 'featuredSportsEventsUrl'], event.target.value)}
              />
            </Grid>
          </Grid>
        </SettingsSection>

        <SettingsSection title="Pagos y redirecciones" description="Links default y parámetros post-pago. Los links por variante se editan en cada plan.">
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="PayPal default URL"
                value={form.payment.paypalDefaultUrl}
                onChange={(event) => setPath(['payment', 'paypalDefaultUrl'], event.target.value)}
                helperText="Soporta {email}, {planCode}, {connections}, {price}."
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Tarjeta default URL"
                value={form.payment.cardDefaultUrl}
                onChange={(event) => setPath(['payment', 'cardDefaultUrl'], event.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Débito automático default URL"
                value={form.payment.automaticDebitDefaultUrl}
                onChange={(event) => setPath(['payment', 'automaticDebitDefaultUrl'], event.target.value)}
                helperText="Solo se usa para el botón Con débito automático."
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Descuento débito automático (%)"
                value={form.payment.automaticDebitDiscountPercent}
                onChange={(event) => setPath(['payment', 'automaticDebitDiscountPercent'], Number(event.target.value || 0))}
                helperText="Default 5. Placeholders: {price}, {originalPrice}, {discountAmount}, {discountPercent}."
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Post-pago redirect URL"
                value={form.payment.postPaymentRedirectUrl}
                onChange={(event) => setPath(['payment', 'postPaymentRedirectUrl'], event.target.value)}
              />
            </Grid>
          </Grid>
        </SettingsSection>

        <SettingsSection title="Planes, precios y conexiones" description="Matriz comercial editable. Cada variante puede tener links PayPal/tarjeta propios.">
          <Stack spacing={2.5}>
            {(form.plans || []).map((plan, planIndex) => (
              <Card variant="outlined" key={`${plan.code}-${planIndex}`}>
                <CardContent>
                  <Stack spacing={2}>
                    <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip color={plan.featured ? 'secondary' : 'default'} label={plan.featured ? 'Destacado' : 'Plan'} />
                        <Typography variant="h4">{plan.name || plan.code}</Typography>
                      </Stack>
                      <FormControlLabel
                        control={<Switch checked={Boolean(plan.featured)} onChange={(event) => updatePlan(planIndex, 'featured', event.target.checked)} />}
                        label="Destacado"
                      />
                    </Stack>

                    <Grid container spacing={2}>
                      <Grid item xs={12} md={3}>
                        <TextField fullWidth label="Código" value={plan.code} onChange={(event) => updatePlan(planIndex, 'code', event.target.value)} />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <TextField fullWidth label="Nombre" value={plan.name} onChange={(event) => updatePlan(planIndex, 'name', event.target.value)} />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Descripción"
                          value={plan.description}
                          onChange={(event) => updatePlan(planIndex, 'description', event.target.value)}
                        />
                      </Grid>
	                    </Grid>

	                    <Divider />

	                    <Stack spacing={1.5}>
	                      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1}>
	                        <Box>
	                          <Typography variant="h5">Opciones visibles del plan</Typography>
	                          <Typography variant="caption" color="text.secondary">
	                            Puedes usar placeholders: {'{connections}'}, {'{devicesLabel}'} y {'{support}'}.
	                          </Typography>
	                        </Box>
	                        <Button size="small" variant="outlined" startIcon={<AddCircleOutlineOutlinedIcon />} onClick={() => addPlanSpec(planIndex)}>
	                          Agregar opción
	                        </Button>
	                      </Stack>

	                      {(plan.specs || []).map((spec, specIndex) => (
	                        <Card variant="outlined" key={`${plan.code}-spec-${spec.id || specIndex}`}>
	                          <CardContent>
	                            <Grid container spacing={1.5} alignItems="center">
	                              <Grid item xs={12} md={2}>
	                                <TextField fullWidth label="ID" value={spec.id} onChange={(event) => updatePlanSpec(planIndex, specIndex, ['id'], event.target.value)} />
	                              </Grid>
	                              <Grid item xs={6} md={1}>
	                                <TextField
	                                  fullWidth
	                                  type="number"
	                                  label="Orden"
	                                  value={spec.order}
	                                  onChange={(event) => updatePlanSpec(planIndex, specIndex, ['order'], Number(event.target.value || 0))}
	                                />
	                              </Grid>
	                              <Grid item xs={6} md={2}>
	                                <FormControlLabel
	                                  control={<Switch checked={Boolean(spec.active)} onChange={(event) => updatePlanSpec(planIndex, specIndex, ['active'], event.target.checked)} />}
	                                  label="Activa"
	                                />
	                              </Grid>
	                              <Grid item xs={12} md={3}>
	                                <TextField
	                                  fullWidth
	                                  label="Label ES"
	                                  value={spec.label?.es || ''}
	                                  onChange={(event) => updatePlanSpec(planIndex, specIndex, ['label', 'es'], event.target.value)}
	                                />
	                              </Grid>
	                              <Grid item xs={12} md={3}>
	                                <TextField
	                                  fullWidth
	                                  label="Label EN"
	                                  value={spec.label?.en || ''}
	                                  onChange={(event) => updatePlanSpec(planIndex, specIndex, ['label', 'en'], event.target.value)}
	                                />
	                              </Grid>
	                              <Grid item xs={12} md={1}>
	                                <Tooltip title="Eliminar opción">
	                                  <span>
	                                    <IconButton color="error" onClick={() => removePlanSpec(planIndex, specIndex)} disabled={(plan.specs || []).length <= 1}>
	                                      <DeleteOutlineOutlinedIcon />
	                                    </IconButton>
	                                  </span>
	                                </Tooltip>
	                              </Grid>
	                              <Grid item xs={12} md={6}>
	                                <TextField
	                                  fullWidth
	                                  label="Valor ES"
	                                  value={spec.value?.es || ''}
	                                  onChange={(event) => updatePlanSpec(planIndex, specIndex, ['value', 'es'], event.target.value)}
	                                />
	                              </Grid>
	                              <Grid item xs={12} md={6}>
	                                <TextField
	                                  fullWidth
	                                  label="Valor EN"
	                                  value={spec.value?.en || ''}
	                                  onChange={(event) => updatePlanSpec(planIndex, specIndex, ['value', 'en'], event.target.value)}
	                                />
	                              </Grid>
	                            </Grid>
	                          </CardContent>
	                        </Card>
	                      ))}
	                    </Stack>

	                    <Divider />

	                    <Stack spacing={1.5}>
                      {(plan.variants || []).map((variant, variantIndex) => (
                        <Grid container spacing={1.5} alignItems="center" key={`${plan.code}-${variantIndex}`}>
                          <Grid item xs={6} md={1}>
                            <TextField
                              fullWidth
                              type="number"
                              label="Dispositivos"
                              value={variant.connections ?? ''}
                              onChange={(event) => updateVariant(planIndex, variantIndex, 'connections', Number(event.target.value || 0))}
                            />
                          </Grid>
                          <Grid item xs={6} md={1}>
                            <TextField
                              fullWidth
                              type="number"
                              label="Precio"
                              value={variant.price ?? ''}
                              onChange={(event) => updateVariant(planIndex, variantIndex, 'price', Number(event.target.value || 0))}
                            />
                          </Grid>
                          <Grid item xs={6} md={1}>
                            <TextField
                              fullWidth
                              label="Moneda"
                              value={variant.currency || 'USD'}
                              onChange={(event) => updateVariant(planIndex, variantIndex, 'currency', event.target.value)}
                            />
                          </Grid>
                          <Grid item xs={6} md={1}>
                            <TextField
                              fullWidth
                              type="number"
                              label="Package ID"
                              value={variant.packageId ?? ''}
                              onChange={(event) =>
                                updateVariant(planIndex, variantIndex, 'packageId', event.target.value ? Number(event.target.value) : null)
                              }
                            />
                          </Grid>
	                          <Grid item xs={12} md={2}>
	                            <TextField
	                              fullWidth
	                              label="PayPal URL"
	                              value={variant.paypalUrl || ''}
	                              onChange={(event) => updateVariant(planIndex, variantIndex, 'paypalUrl', event.target.value)}
	                            />
	                          </Grid>
	                          <Grid item xs={12} md={2}>
	                            <TextField
	                              fullWidth
	                              label="Tarjeta URL"
	                              value={variant.cardUrl || ''}
	                              onChange={(event) => updateVariant(planIndex, variantIndex, 'cardUrl', event.target.value)}
	                            />
	                          </Grid>
	                          <Grid item xs={12} md={2}>
	                            <TextField
	                              fullWidth
	                              label="Débito automático URL"
	                              value={variant.automaticDebitUrl || ''}
	                              onChange={(event) => updateVariant(planIndex, variantIndex, 'automaticDebitUrl', event.target.value)}
	                            />
	                          </Grid>
                          <Grid item xs={12} md={1}>
                            <Tooltip title="Eliminar variante">
                              <span>
                                <IconButton color="error" onClick={() => removeVariant(planIndex, variantIndex)} disabled={(plan.variants || []).length <= 1}>
                                  <DeleteOutlineOutlinedIcon />
                                </IconButton>
                              </span>
                            </Tooltip>
                          </Grid>
                        </Grid>
                      ))}
                    </Stack>

                    <Box>
                      <Button variant="outlined" startIcon={<AddCircleOutlineOutlinedIcon />} onClick={() => addVariant(planIndex)}>
                        Agregar variante
                      </Button>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </SettingsSection>

        <SettingsSection title="Puntos y mensajes" description="Textos comerciales para cliente existente, cliente nuevo y renovación.">
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={<Switch checked={Boolean(form.points.enabled)} onChange={(event) => setPath(['points', 'enabled'], event.target.checked)} />}
                label="Puntos activos"
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Mensaje de puntos"
                value={form.points.renewalMessage}
                onChange={(event) => setPath(['points', 'renewalMessage'], event.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Título cliente existente"
                value={form.messages.existingCustomerTitle}
                onChange={(event) => setPath(['messages', 'existingCustomerTitle'], event.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Título cliente nuevo"
                value={form.messages.newCustomerTitle}
                onChange={(event) => setPath(['messages', 'newCustomerTitle'], event.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Mensaje expiración/renovación"
                value={form.messages.expirationMessage}
                onChange={(event) => setPath(['messages', 'expirationMessage'], event.target.value)}
              />
            </Grid>
          </Grid>
        </SettingsSection>
      </Stack>
    </MainCard>
  );
}

function SettingsSection({ title, description, children }) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2.5}>
          <Box>
            <Typography variant="h3">{title}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {description}
            </Typography>
          </Box>
          {children}
        </Stack>
      </CardContent>
    </Card>
  );
}

function SummaryCard({ icon, label, value, helper }) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            {icon}
            <Typography variant="overline" color="text.secondary">
              {label}
            </Typography>
          </Stack>
          <Typography variant="h3">{value}</Typography>
          <Typography variant="body2" color="text.secondary" noWrap title={helper}>
            {helper}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
