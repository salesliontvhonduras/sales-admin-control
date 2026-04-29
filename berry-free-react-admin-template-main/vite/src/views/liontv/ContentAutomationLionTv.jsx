import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import useAuth from 'hooks/useAuth';

import Alert from '@mui/material/Alert';
import Autocomplete from '@mui/material/Autocomplete';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import ImageSearchOutlinedIcon from '@mui/icons-material/ImageSearchOutlined';
import PublishedWithChangesOutlinedIcon from '@mui/icons-material/PublishedWithChangesOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
import TodayOutlinedIcon from '@mui/icons-material/TodayOutlined';
import ViewListOutlinedIcon from '@mui/icons-material/ViewListOutlined';
import WbTwilightOutlinedIcon from '@mui/icons-material/WbTwilightOutlined';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import NightsStayOutlinedIcon from '@mui/icons-material/NightsStayOutlined';

import {
  approveContentAutomationPost,
  generateContentAutomationByDate,
  getContentAutomationPostsByDate,
  getContentAutomationPostEvents,
  getContentAutomationPreviewImageBlob,
  getContentAutomationSafePreview,
  getContentAutomationTomorrowEvents,
  publishContentAutomationPost,
  regenerateContentAutomationCaptions,
  regenerateContentAutomationImage,
  updateContentAutomationPostSelectedEvents
} from 'api/content-automation';
import { getAdminResellerSupportProfile, searchAdminResellerSupportProfiles } from 'api/liontv-reseller-wallet';
import MainCard from 'ui-component/cards/MainCard';
import DialogTitleWithClose from 'ui-component/dialogs/DialogTitleWithClose';
import { PageEmptyState, PageErrorState, PageLoadingState } from 'ui-component/feedback/PageState';
import ResponsiveActionBar from 'ui-component/responsive/ResponsiveActionBar';
import ResponsiveFilters from 'ui-component/responsive/ResponsiveFilters';
import ResponsiveMetricGrid from 'ui-component/responsive/ResponsiveMetricGrid';
import { gridSpacing } from 'store/constant';
import { withAlpha } from 'utils/colorUtils';
import { hasPermissionExact } from 'utils/rbac';

const SLOT_ORDER = ['ALL_DAY', 'MORNING', 'AFTERNOON', 'NIGHT'];
const URL_PATTERN = /(https?:\/\/|www\.)/i;
const BRANDING_MODE_GENERIC = 'GENERIC';
const BRANDING_MODE_RESELLER = 'RESELLER';

function formatDateTime(value, locale = 'es-HN') {
  if (!value) return '-';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);
  return parsed.toLocaleString(locale, {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
}

function formatEventTime(value, locale = 'es-HN') {
  if (!value) return '-';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);
  return parsed.toLocaleString(locale, {
    hour: 'numeric',
    minute: '2-digit'
  });
}

function formatEventLabel(event = {}) {
  const home = event?.homeTeam || '-';
  const away = event?.awayTeam || '';
  return away ? `${home} vs ${away}` : home;
}

function normalizeSupportProfile(profile) {
  if (!profile?.username) return null;
  return {
    username: String(profile.username),
    supportPhone: profile?.supportPhone || '',
    configured: Boolean(profile?.configured),
    updatedAt: profile?.updatedAt || null
  };
}

function resellerOptionLabel(option, t) {
  if (!option?.username) return '';
  if (!option?.supportPhone) return option.username;
  return `${option.username} · ${option.supportPhone}`;
}

function toIsoDateInTimeZone(timeZone, dayOffset = 0) {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  const parts = formatter.formatToParts(now).reduce((acc, part) => {
    if (part.type !== 'literal') acc[part.type] = part.value;
    return acc;
  }, {});
  const base = new Date(`${parts.year}-${parts.month}-${parts.day}T00:00:00`);
  base.setDate(base.getDate() + dayOffset);
  const year = base.getFullYear();
  const month = String(base.getMonth() + 1).padStart(2, '0');
  const day = String(base.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function slotTone(slot) {
  switch (slot) {
    case 'ALL_DAY':
      return 'info';
    case 'MORNING':
      return 'warning';
    case 'AFTERNOON':
      return 'primary';
    case 'NIGHT':
      return 'secondary';
    default:
      return 'info';
  }
}

function slotIcon(slot) {
  switch (slot) {
    case 'ALL_DAY':
      return TodayOutlinedIcon;
    case 'MORNING':
      return WbSunnyOutlinedIcon;
    case 'AFTERNOON':
      return WbTwilightOutlinedIcon;
    case 'NIGHT':
      return NightsStayOutlinedIcon;
    default:
      return ScheduleOutlinedIcon;
  }
}

function statusColor(status) {
  switch (String(status || '').toUpperCase()) {
    case 'GENERATED':
      return 'info';
    case 'APPROVED':
      return 'warning';
    case 'PUBLISHED':
      return 'success';
    case 'FAILED':
      return 'error';
    case 'DRAFT':
      return 'default';
    default:
      return 'default';
  }
}

function metricSurface(theme, color = 'primary') {
  const palette = theme.palette[color] || theme.palette.primary;
  const main = theme.vars?.palette?.[color]?.main || palette.main;
  const light = theme.vars?.palette?.[color]?.light || palette.light;
  const surfaceCard = theme.vars?.palette?.surface?.card || theme.palette.background.paper;
  return {
    borderRadius: 3,
    border: '1px solid',
    borderColor: withAlpha(main, theme.palette.mode === 'dark' ? 0.2 : 0.14),
    background:
      theme.palette.mode === 'dark'
        ? `linear-gradient(165deg, ${withAlpha(surfaceCard, 0.98)} 0%, ${withAlpha(main, 0.14)} 100%)`
        : `linear-gradient(165deg, ${surfaceCard} 0%, ${withAlpha(light, 0.14)} 100%)`,
    boxShadow:
      theme.palette.mode === 'dark'
        ? `0 16px 30px ${alpha(theme.palette.common.black, 0.28)}`
        : `0 12px 24px ${alpha(theme.palette.common.black, 0.08)}`
  };
}

function slotSurface(theme, slot) {
  const color = slotTone(slot);
  const palette = theme.palette[color] || theme.palette.primary;
  const main = theme.vars?.palette?.[color]?.main || palette.main;
  const light = theme.vars?.palette?.[color]?.light || palette.light;
  const surfaceCard = theme.vars?.palette?.surface?.card || theme.palette.background.paper;
  return {
    borderRadius: 3.5,
    border: '1px solid',
    borderColor: withAlpha(main, theme.palette.mode === 'dark' ? 0.22 : 0.14),
    background:
      theme.palette.mode === 'dark'
        ? `linear-gradient(160deg, ${withAlpha(surfaceCard, 0.98)} 0%, ${withAlpha(main, 0.12)} 100%)`
        : `linear-gradient(160deg, ${surfaceCard} 0%, ${withAlpha(light, 0.12)} 100%)`,
    boxShadow:
      theme.palette.mode === 'dark'
        ? `0 18px 34px ${alpha(theme.palette.common.black, 0.26)}`
        : `0 14px 30px ${alpha(theme.palette.common.black, 0.08)}`
  };
}

function clampText(lines = 3) {
  return {
    display: '-webkit-box',
    WebkitLineClamp: lines,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  };
}

function MetricCard({ icon: Icon, label, value, helper, color = 'primary' }) {
  return (
    <Card sx={(theme) => ({ ...metricSurface(theme, color), height: '100%' })}>
      <CardContent>
        <Stack spacing={1.25}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800, letterSpacing: '0.12em' }}>
              {label}
            </Typography>
            <Avatar
              sx={(theme) => ({
                width: 42,
                height: 42,
                bgcolor: withAlpha(theme.palette[color].main, 0.15),
                color: theme.palette[color].main
              })}
            >
              <Icon fontSize="small" />
            </Avatar>
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

function EventStrip({ slot, title, events, locale, t }) {
  const Icon = slotIcon(slot);
  const color = slotTone(slot);
  return (
    <Card variant="outlined" sx={(theme) => ({ ...metricSurface(theme, color), height: '100%' })}>
      <CardContent>
        <Stack spacing={1.25}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={1.25} alignItems="center">
              <Avatar
                sx={(theme) => ({
                  width: 42,
                  height: 42,
                  bgcolor: withAlpha(theme.palette[color].main, 0.14),
                  color: theme.palette[color].main
                })}
              >
                <Icon fontSize="small" />
              </Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                  {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('contentAutomation.events.count', {
                    count: Array.isArray(events) ? events.length : 0,
                    defaultValue: '{{count}} real events'
                  })}
                </Typography>
              </Box>
            </Stack>
            <Chip size="small" color={color} label={Array.isArray(events) ? events.length : 0} />
          </Stack>

          {Array.isArray(events) && events.length ? (
            <Stack spacing={1}>
              {events.slice(0, 3).map((event) => (
                <Box key={`${event.externalId || event.id}-${event.eventTime}`}>
                  <Typography variant="body2" sx={{ fontWeight: 700, ...clampText(1) }}>
                    {formatEventLabel(event)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {event.leagueName || '-'} · {formatEventTime(event.eventTime, locale)}
                  </Typography>
                </Box>
              ))}
            </Stack>
          ) : (
            <Typography variant="body2" color="text.secondary">
              {t('contentAutomation.events.emptySlot', 'No featured events were detected in this block.')}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

function SlotPostCard({
  slot,
  post,
  previewUrl,
  previewLoading,
  previewError,
  inlineError,
  locale,
  canGenerate,
  canApprove,
  canPublish,
  busyAction,
  onPreview,
  onSafePreview,
  onSelectEvents,
  onRegenerateImage,
  onRegenerateCaptions,
  onApprove,
  onPublish,
  t
}) {
  const Icon = slotIcon(slot);
  const color = slotTone(slot);
  const hasPost = Boolean(post?.id);
  const previewReady = Boolean(previewUrl);
  const status = String(post?.status || 'DRAFT').toUpperCase();
  const brandingMode = String(post?.brandingMode || BRANDING_MODE_GENERIC).toUpperCase();
  const canApprovePost = hasPost && status === 'GENERATED' && canApprove;
  const canPublishPost = hasPost && status === 'APPROVED' && canPublish;
  const actionDisabled = Object.values(busyAction || {}).some(Boolean);

  return (
    <Card sx={(theme) => ({ ...slotSurface(theme, slot), height: '100%' })}>
      <CardContent sx={{ p: 2.5 }}>
        <Stack spacing={2.25} sx={{ height: '100%' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1.5}>
            <Stack direction="row" spacing={1.25} alignItems="center" minWidth={0}>
              <Avatar
                sx={(theme) => ({
                  width: 48,
                  height: 48,
                  bgcolor: withAlpha(theme.palette[color].main, 0.16),
                  color: theme.palette[color].main
                })}
              >
                <Icon fontSize="small" />
              </Avatar>
              <Box minWidth={0}>
                <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: '0.12em', fontWeight: 700 }}>
                  {t(`contentAutomation.slots.${slot.toLowerCase()}`, slot)}
                </Typography>
                <Typography variant="h4" sx={{ mt: 0.25 }}>
                  {post?.title || t('contentAutomation.slotCard.emptyTitle', 'No generated post yet')}
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap" justifyContent="flex-end">
              <Chip size="small" color={statusColor(status)} label={t(`contentAutomation.status.${status}`, status)} />
              {post?.safeModeEnabled ? (
                <Chip
                  size="small"
                  color="success"
                  variant="outlined"
                  icon={<ShieldOutlinedIcon fontSize="small" />}
                  label={t('contentAutomation.safeMode', 'SAFE mode')}
                />
              ) : null}
            </Stack>
          </Stack>

          <Divider />

          <Box
            sx={(theme) => ({
              position: 'relative',
              borderRadius: 3,
              overflow: 'hidden',
              minHeight: 230,
              border: '1px solid',
              borderColor: withAlpha(theme.palette[color].main, theme.palette.mode === 'dark' ? 0.2 : 0.16),
              bgcolor: theme.vars?.palette?.surface?.muted || withAlpha(theme.palette[color].main, 0.06)
            })}
          >
            {previewLoading ? <Skeleton variant="rectangular" width="100%" height={230} /> : null}
            {!previewLoading && previewReady ? (
              <Box component="img" src={previewUrl} alt={post?.title || slot} sx={{ width: '100%', height: 230, objectFit: 'cover' }} />
            ) : null}
            {!previewLoading && !previewReady ? (
              <Stack justifyContent="center" alignItems="center" spacing={1} sx={{ minHeight: 230, px: 2 }}>
                <ImageSearchOutlinedIcon color="disabled" />
                <Typography variant="body2" color="text.secondary" align="center">
                  {previewError || t('contentAutomation.slotCard.previewPending', 'Preview image is not available yet.')}
                </Typography>
              </Stack>
            ) : null}
          </Box>

          <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
            <Chip
              size="small"
              variant="outlined"
              label={t('contentAutomation.slotCard.eventCount', {
                count: post?.eventCount || 0,
                defaultValue: '{{count}} real events'
              })}
            />
            <Chip
              size="small"
              variant="outlined"
              color={post?.manualEventSelectionEnabled ? 'warning' : 'default'}
              label={t('contentAutomation.slotCard.selectedEvents', {
                count: post?.selectedEventCount || 0,
                defaultValue: '{{count}} selected for image'
              })}
            />
            <Chip
              size="small"
              variant="outlined"
              label={t('contentAutomation.slotCard.updatedAt', {
                value: formatDateTime(post?.updatedAt, locale),
                defaultValue: 'Updated {{value}}'
              })}
            />
            <Chip
              size="small"
              color={brandingMode === BRANDING_MODE_RESELLER ? 'secondary' : 'default'}
              variant={brandingMode === BRANDING_MODE_RESELLER ? 'filled' : 'outlined'}
              label={
                brandingMode === BRANDING_MODE_RESELLER
                  ? t('contentAutomation.branding.modeReseller', 'Reseller watermark')
                  : t('contentAutomation.branding.modeGeneric', 'Generic watermark')
              }
            />
            {post?.targetResellerUsername ? (
              <Chip
                size="small"
                variant="outlined"
                label={t('contentAutomation.slotCard.resellerLabel', {
                  username: post.targetResellerUsername,
                  defaultValue: 'Reseller: {{username}}'
                })}
              />
            ) : null}
            {post?.targetResellerPhoneMasked ? (
              <Chip
                size="small"
                variant="outlined"
                label={t('contentAutomation.slotCard.phoneLabel', {
                  phone: post.targetResellerPhoneMasked,
                  defaultValue: 'Phone: {{phone}}'
                })}
              />
            ) : null}
          </Stack>

          <Box sx={{ minHeight: 86 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.75 }}>
              {t('contentAutomation.slotCard.captionLabel', 'Caption summary')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={clampText(4)}>
              {post?.caption || t('contentAutomation.slotCard.emptyCaption', 'Generate this slot to prepare the review copy and image.')}
            </Typography>
          </Box>

          {status === 'FAILED' || inlineError ? (
            <Alert severity="error" variant="outlined">
              {inlineError || post?.errorMessage || t('contentAutomation.errors.slotFailed', 'This slot failed and needs attention.')}
            </Alert>
          ) : null}

          <ResponsiveActionBar justifyContent="flex-start" sx={{ mt: 'auto' }}>
            <Button
              variant="outlined"
              startIcon={<ImageSearchOutlinedIcon />}
              onClick={() => onPreview(post)}
              disabled={!hasPost || !previewReady}
            >
              {t('contentAutomation.actions.previewImage', 'Preview image')}
            </Button>
            <Button variant="outlined" startIcon={<ShieldOutlinedIcon />} onClick={() => onSafePreview(post)} disabled={!hasPost}>
              {t('contentAutomation.actions.safePreview', 'Safe preview')}
            </Button>
            <Button
              variant="outlined"
              startIcon={<ViewListOutlinedIcon />}
              onClick={() => onSelectEvents(post)}
              disabled={!hasPost || !canGenerate || actionDisabled}
            >
              {t('contentAutomation.actions.selectEvents', 'Select events')}
            </Button>
            <Button
              variant="outlined"
              startIcon={<RefreshOutlinedIcon />}
              onClick={() => onRegenerateImage(post)}
              disabled={!hasPost || !canGenerate || actionDisabled}
            >
              {t('contentAutomation.actions.regenerateImage', 'Regenerate image')}
            </Button>
            <Button
              variant="outlined"
              startIcon={<TextSnippetOutlinedIcon />}
              onClick={() => onRegenerateCaptions(post)}
              disabled={!hasPost || !canGenerate || actionDisabled}
            >
              {t('contentAutomation.actions.regenerateCaptions', 'Regenerate captions')}
            </Button>
            <Button
              variant="contained"
              color="warning"
              startIcon={<CheckCircleOutlineOutlinedIcon />}
              onClick={() => onApprove(post)}
              disabled={!canApprovePost || actionDisabled}
            >
              {t('contentAutomation.actions.approve', 'Approve')}
            </Button>
            <Button
              variant="contained"
              color="success"
              startIcon={<PublishedWithChangesOutlinedIcon />}
              onClick={() => onPublish(post)}
              disabled={!canPublishPost || actionDisabled}
            >
              {t('contentAutomation.actions.publish', 'Publish')}
            </Button>
          </ResponsiveActionBar>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function ContentAutomationLionTv() {
  const { t, i18n } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { accessToken, user } = useAuth();
  const locale = String(i18n?.resolvedLanguage || i18n?.language || 'es').toLowerCase().startsWith('en') ? 'en-US' : 'es-HN';
  const timeZone = 'America/Tegucigalpa';
  const todayIso = useMemo(() => toIsoDateInTimeZone(timeZone, 0), []);
  const tomorrowIso = useMemo(() => toIsoDateInTimeZone(timeZone, 1), []);
  const [selectedDate, setSelectedDate] = useState(tomorrowIso);
  const [postsPayload, setPostsPayload] = useState({ date: tomorrowIso, total: 0, posts: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [eventsPayload, setEventsPayload] = useState(null);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsError, setEventsError] = useState('');
  const [generating, setGenerating] = useState(false);
  const [busyActions, setBusyActions] = useState({});
  const [inlineErrors, setInlineErrors] = useState({});
  const [previewUrls, setPreviewUrls] = useState({});
  const [previewLoadErrors, setPreviewLoadErrors] = useState({});
  const [previewDialog, setPreviewDialog] = useState({ open: false, post: null });
  const [safeDialog, setSafeDialog] = useState({ open: false, post: null, data: null, loading: false, error: '' });
  const [selectionDialog, setSelectionDialog] = useState({
    open: false,
    post: null,
    loading: false,
    saving: false,
    error: '',
    events: [],
    selectedEventIds: [],
    manualEventSelectionEnabled: false
  });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, type: '', post: null });

  const canGenerate = hasPermissionExact(user, {
    any: ['LIONTV_CONTENT_AUTOMATION_GENERATE', 'ROLE_LIONTV_CONTENT_AUTOMATION_GENERATE', 'ROLE_ADMIN', 'ADMIN']
  });
  const canApprove = hasPermissionExact(user, {
    any: ['LIONTV_CONTENT_AUTOMATION_APPROVE', 'ROLE_LIONTV_CONTENT_AUTOMATION_APPROVE', 'ROLE_ADMIN', 'ADMIN']
  });
  const canPublish = hasPermissionExact(user, {
    any: ['LIONTV_CONTENT_AUTOMATION_PUBLISH', 'ROLE_LIONTV_CONTENT_AUTOMATION_PUBLISH', 'ROLE_ADMIN', 'ADMIN']
  });
  const isAdminUser = hasPermissionExact(user, {
    any: ['ROLE_ADMIN', 'ADMIN']
  });

  const isTomorrowSelected = selectedDate === tomorrowIso;
  const hasPosts = Array.isArray(postsPayload?.posts) && postsPayload.posts.length > 0;
  const [brandingMode, setBrandingMode] = useState(BRANDING_MODE_GENERIC);
  const [resellerOptions, setResellerOptions] = useState([]);
  const [resellerSearchInput, setResellerSearchInput] = useState('');
  const [resellerLookupLoading, setResellerLookupLoading] = useState(false);
  const [selectedReseller, setSelectedReseller] = useState(null);
  const [resellerSelectionError, setResellerSelectionError] = useState('');
  const resellerBrandingEnabled = isAdminUser && brandingMode === BRANDING_MODE_RESELLER;
  const selectedResellerReady = Boolean(selectedReseller?.username && selectedReseller?.configured && selectedReseller?.supportPhone);

  useEffect(() => {
    if (!resellerBrandingEnabled) {
      setResellerSelectionError('');
      return;
    }
    if (!selectedReseller?.username) {
      setResellerSelectionError(t('contentAutomation.branding.errors.resellerRequired', 'Select a reseller to generate branded content.'));
      return;
    }
    if (!selectedReseller?.configured || !selectedReseller?.supportPhone) {
      setResellerSelectionError(
        t(
          'contentAutomation.branding.errors.supportMissing',
          'The selected reseller does not have a support phone configured in Support Center.'
        )
      );
      return;
    }
    setResellerSelectionError('');
  }, [resellerBrandingEnabled, selectedReseller, t]);

  useEffect(() => {
    if (!accessToken || !isAdminUser || !resellerBrandingEnabled) {
      setResellerLookupLoading(false);
      return undefined;
    }

    let active = true;
    const timer = window.setTimeout(async () => {
      setResellerLookupLoading(true);
      try {
        const payload = await searchAdminResellerSupportProfiles(
          {
            search: resellerSearchInput?.trim() || '',
            size: 12
          },
          { skipAuthRedirect: true }
        );
        if (!active) return;
        const items = Array.isArray(payload) ? payload.map(normalizeSupportProfile).filter(Boolean) : [];
        setResellerOptions(items);
      } catch (apiError) {
        if (!active) return;
        setResellerOptions([]);
        setResellerSelectionError(
          apiError?.response?.data?.message ||
            t('contentAutomation.branding.errors.lookup', 'Could not load reseller support profiles.')
        );
      } finally {
        if (active) {
          setResellerLookupLoading(false);
        }
      }
    }, 250);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [accessToken, isAdminUser, resellerBrandingEnabled, resellerSearchInput, t]);

  const loadPosts = useCallback(
    async ({ silent = false } = {}) => {
      if (!accessToken) return;
      if (!silent) setLoading(true);
      setError('');
      try {
        const payload = await getContentAutomationPostsByDate(selectedDate, { skipAuthRedirect: true });
        setPostsPayload({
          date: payload?.date || selectedDate,
          total: Number(payload?.total || 0),
          posts: Array.isArray(payload?.posts) ? payload.posts : []
        });
      } catch (apiError) {
        setError(apiError?.response?.data?.message || t('contentAutomation.errors.loadPosts', 'Could not load content automation posts.'));
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [accessToken, selectedDate, t]
  );

  const loadTomorrowEvents = useCallback(async () => {
    if (!accessToken || !isTomorrowSelected) return;
    setEventsLoading(true);
    setEventsError('');
    try {
      const payload = await getContentAutomationTomorrowEvents({ skipAuthRedirect: true });
      setEventsPayload(payload);
    } catch (apiError) {
      setEventsError(apiError?.response?.data?.message || t('contentAutomation.errors.loadEvents', 'Could not load tomorrow events.'));
    } finally {
      setEventsLoading(false);
    }
  }, [accessToken, isTomorrowSelected, t]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  useEffect(() => {
    if (isTomorrowSelected) {
      loadTomorrowEvents();
      return;
    }
    setEventsPayload(null);
    setEventsError('');
  }, [isTomorrowSelected, loadTomorrowEvents]);

  useEffect(() => {
    const posts = Array.isArray(postsPayload?.posts) ? postsPayload.posts : [];
    let cancelled = false;
    const urlsToRevoke = [];

    async function loadPreviews() {
      if (!posts.length) {
        setPreviewUrls({});
        setPreviewLoadErrors({});
        return;
      }

      const results = await Promise.all(
        posts.map(async (post) => {
          try {
            const blob = await getContentAutomationPreviewImageBlob(post.id, { skipAuthRedirect: true });
            if (!blob) {
              return [post.id, null, t('contentAutomation.errors.previewMissing', 'Preview image is not available yet.')];
            }
            const objectUrl = URL.createObjectURL(blob);
            urlsToRevoke.push(objectUrl);
            return [post.id, objectUrl, ''];
          } catch (apiError) {
            return [
              post.id,
              null,
              apiError?.response?.data?.message || t('contentAutomation.errors.previewMissing', 'Preview image is not available yet.')
            ];
          }
        })
      );

      if (cancelled) {
        urlsToRevoke.forEach((url) => URL.revokeObjectURL(url));
        return;
      }

      setPreviewUrls(
        results.reduce((acc, [postId, url]) => {
          if (url) acc[postId] = url;
          return acc;
        }, {})
      );
      setPreviewLoadErrors(
        results.reduce((acc, [postId, , errorMessage]) => {
          if (errorMessage) acc[postId] = errorMessage;
          return acc;
        }, {})
      );
    }

    loadPreviews();

    return () => {
      cancelled = true;
      urlsToRevoke.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [postsPayload?.posts, t]);

  const postsBySlot = useMemo(() => {
    const map = {};
    SLOT_ORDER.forEach((slot) => {
      map[slot] = null;
    });
    (postsPayload?.posts || []).forEach((post) => {
      map[post.slot] = post;
    });
    return map;
  }, [postsPayload?.posts]);

  const stats = useMemo(() => {
    const rows = postsPayload?.posts || [];
    return {
      total: rows.length,
      generated: rows.filter((item) => String(item.status || '').toUpperCase() === 'GENERATED').length,
      approved: rows.filter((item) => String(item.status || '').toUpperCase() === 'APPROVED').length,
      published: rows.filter((item) => String(item.status || '').toUpperCase() === 'PUBLISHED').length,
      failed: rows.filter((item) => String(item.status || '').toUpperCase() === 'FAILED').length
    };
  }, [postsPayload?.posts]);

  const updatePost = useCallback((updatedPost) => {
    setPostsPayload((prev) => ({
      ...prev,
      posts: SLOT_ORDER.map((slot) =>
        slot === updatedPost?.slot
          ? updatedPost
          : prev.posts.find((item) => item.slot === slot) || null
      ).filter(Boolean)
    }));
  }, []);

  const setBusyForPost = useCallback((postId, key, value) => {
    setBusyActions((prev) => {
      const current = prev[postId] || {};
      return {
        ...prev,
        [postId]: {
          ...current,
          [key]: value
        }
      };
    });
  }, []);

  const handleGenerateSelectedDate = useCallback(async () => {
    if (!canGenerate || !selectedDate) return;
    if (resellerBrandingEnabled && !selectedResellerReady) {
      enqueueSnackbar(
        resellerSelectionError ||
          t('contentAutomation.branding.errors.resellerRequired', 'Select a reseller to generate branded content.'),
        { variant: 'warning' }
      );
      return;
    }
    setGenerating(true);
    try {
      const payload = await generateContentAutomationByDate(
        {
          date: selectedDate,
          resellerUsername: resellerBrandingEnabled ? selectedReseller?.username : null
        },
        { skipAuthRedirect: true }
      );
      enqueueSnackbar(
        t('contentAutomation.messages.generated', {
          date: payload?.targetDate || selectedDate,
          count: Array.isArray(payload?.posts) ? payload.posts.length : 0,
          defaultValue: '{{count}} posts were refreshed for {{date}}.'
        }),
        { variant: 'success' }
      );
      setPostsPayload({
        date: payload?.targetDate || selectedDate,
        total: Array.isArray(payload?.posts) ? payload.posts.length : 0,
        posts: Array.isArray(payload?.posts) ? payload.posts : []
      });
      if (isTomorrowSelected) {
        await loadTomorrowEvents();
      }
    } catch (apiError) {
      enqueueSnackbar(
        apiError?.response?.data?.message ||
          t('contentAutomation.errors.generate', 'Could not generate posts for the selected date.'),
        {
          variant: 'error'
        }
      );
    } finally {
      setGenerating(false);
    }
  }, [
    canGenerate,
    enqueueSnackbar,
    isTomorrowSelected,
    loadTomorrowEvents,
    resellerBrandingEnabled,
    resellerSelectionError,
    selectedDate,
    selectedReseller?.username,
    selectedResellerReady,
    t
  ]);

  const handleAction = useCallback(
    async (post, actionKey, request, successMessageKey, fallbackMessage) => {
      if (!post?.id) return;
      setBusyForPost(post.id, actionKey, true);
      setInlineErrors((prev) => ({ ...prev, [post.slot]: '' }));
      try {
        const updated = await request(post.id);
        updatePost(updated);
        enqueueSnackbar(t(successMessageKey, fallbackMessage), { variant: 'success' });
      } catch (apiError) {
        const message = apiError?.response?.data?.message || fallbackMessage;
        setInlineErrors((prev) => ({ ...prev, [post.slot]: message }));
        enqueueSnackbar(message, { variant: 'error' });
      } finally {
        setBusyForPost(post.id, actionKey, false);
      }
    },
    [enqueueSnackbar, setBusyForPost, t, updatePost]
  );

  const openSafePreview = useCallback(
    async (post) => {
      if (!post?.id) return;
      setSafeDialog({ open: true, post, data: null, loading: true, error: '' });
      try {
        const data = await getContentAutomationSafePreview(post.id, { skipAuthRedirect: true });
        setSafeDialog({ open: true, post, data, loading: false, error: '' });
      } catch (apiError) {
        setSafeDialog({
          open: true,
          post,
          data: null,
          loading: false,
          error: apiError?.response?.data?.message || t('contentAutomation.errors.safePreview', 'Could not load the safe preview.')
        });
      }
    },
    [t]
  );

  const safePreviewPassed = useMemo(() => {
    if (!safeDialog?.data?.caption) return false;
    return !URL_PATTERN.test(safeDialog.data.caption);
  }, [safeDialog]);

  const closeSelectionDialog = useCallback(() => {
    setSelectionDialog({
      open: false,
      post: null,
      loading: false,
      saving: false,
      error: '',
      events: [],
      selectedEventIds: [],
      manualEventSelectionEnabled: false
    });
  }, []);

  const openSelectionDialog = useCallback(
    async (post) => {
      if (!post?.id) return;
      setSelectionDialog({
        open: true,
        post,
        loading: true,
        saving: false,
        error: '',
        events: [],
        selectedEventIds: [],
        manualEventSelectionEnabled: false
      });
      try {
        const payload = await getContentAutomationPostEvents(post.id, { skipAuthRedirect: true });
        setSelectionDialog({
          open: true,
          post,
          loading: false,
          saving: false,
          error: '',
          events: Array.isArray(payload?.events) ? payload.events : [],
          selectedEventIds: Array.isArray(payload?.selectedEventIds) ? payload.selectedEventIds : [],
          manualEventSelectionEnabled: Boolean(payload?.manualEventSelectionEnabled)
        });
      } catch (apiError) {
        setSelectionDialog({
          open: true,
          post,
          loading: false,
          saving: false,
          error:
            apiError?.response?.data?.message ||
            t('contentAutomation.errors.loadSelectableEvents', 'Could not load the available events for this slot.'),
          events: [],
          selectedEventIds: [],
          manualEventSelectionEnabled: false
        });
      }
    },
    [t]
  );

  const toggleSelectedEvent = useCallback(
    (eventId) => {
      setSelectionDialog((prev) => {
        const current = Array.isArray(prev.selectedEventIds) ? prev.selectedEventIds : [];
        const alreadySelected = current.includes(eventId);
        if (alreadySelected) {
          return {
            ...prev,
            selectedEventIds: current.filter((id) => id !== eventId)
          };
        }
        if (current.length >= 5) {
          enqueueSnackbar(
            t('contentAutomation.errors.selectionLimit', 'You can only place up to 5 events in the image template.'),
            { variant: 'warning' }
          );
          return prev;
        }
        return {
          ...prev,
          selectedEventIds: [...current, eventId]
        };
      });
    },
    [enqueueSnackbar, t]
  );

  const handleSaveSelectedEvents = useCallback(async () => {
    if (!selectionDialog.post?.id) return;
    setSelectionDialog((prev) => ({ ...prev, saving: true, error: '' }));
    try {
      const updatedPost = await updateContentAutomationPostSelectedEvents(
        selectionDialog.post.id,
        selectionDialog.selectedEventIds,
        { skipAuthRedirect: true }
      );
      updatePost(updatedPost);
      enqueueSnackbar(
        t('contentAutomation.messages.eventsSelectionSaved', 'The post was regenerated with your selected events.'),
        { variant: 'success' }
      );
      closeSelectionDialog();
    } catch (apiError) {
      setSelectionDialog((prev) => ({
        ...prev,
        saving: false,
        error:
          apiError?.response?.data?.message ||
          t('contentAutomation.errors.saveSelectedEvents', 'Could not apply the selected events to this post.')
      }));
    }
  }, [closeSelectionDialog, enqueueSnackbar, selectionDialog.post?.id, selectionDialog.selectedEventIds, t, updatePost]);

  const handleResetSelectedEvents = useCallback(async () => {
    if (!selectionDialog.post?.id) return;
    setSelectionDialog((prev) => ({ ...prev, saving: true, error: '' }));
    try {
      const updatedPost = await updateContentAutomationPostSelectedEvents(selectionDialog.post.id, [], {
        skipAuthRedirect: true
      });
      updatePost(updatedPost);
      enqueueSnackbar(
        t('contentAutomation.messages.eventsSelectionReset', 'The slot returned to the automatic featured selection.'),
        { variant: 'success' }
      );
      closeSelectionDialog();
    } catch (apiError) {
      setSelectionDialog((prev) => ({
        ...prev,
        saving: false,
        error:
          apiError?.response?.data?.message ||
          t('contentAutomation.errors.resetSelectedEvents', 'Could not restore the automatic event selection.')
      }));
    }
  }, [closeSelectionDialog, enqueueSnackbar, selectionDialog.post?.id, t, updatePost]);

  const confirmPrimaryLabel = useMemo(() => {
    if (confirmDialog.type === 'approve') return t('contentAutomation.actions.confirmApprove', 'Approve post');
    if (confirmDialog.type === 'publish') return t('contentAutomation.actions.confirmPublish', 'Publish post');
    return t('actions.save', 'Save');
  }, [confirmDialog.type, t]);

  const handleConfirmAction = useCallback(async () => {
    const post = confirmDialog.post;
    if (!post?.id) return;
    if (confirmDialog.type === 'approve') {
      await handleAction(
        post,
        'approve',
        (postId) => approveContentAutomationPost(postId, { skipAuthRedirect: true }),
        'contentAutomation.messages.approved',
        t('contentAutomation.messages.approved', 'The post is now approved for publishing.')
      );
    }
    if (confirmDialog.type === 'publish') {
      await handleAction(
        post,
        'publish',
        (postId) => publishContentAutomationPost(postId, { skipAuthRedirect: true }),
        'contentAutomation.messages.published',
        t('contentAutomation.messages.published', 'The post was published successfully.')
      );
    }
    setConfirmDialog({ open: false, type: '', post: null });
  }, [confirmDialog, handleAction, t]);

  if (loading && !hasPosts && !error) {
    return <PageLoadingState label={t('contentAutomation.loading', 'Loading content automation review console...')} />;
  }

  if (error && !hasPosts) {
    return <PageErrorState message={error} onRetry={() => loadPosts()} />;
  }

  return (
    <Stack spacing={2.5}>
      <MainCard
        title={t('menu.contentAutomation', 'Content Automation')}
        secondary={
          <ResponsiveActionBar>
            <Button
              variant="outlined"
              startIcon={<TodayOutlinedIcon />}
              onClick={() => setSelectedDate(todayIso)}
              color={selectedDate === todayIso ? 'primary' : 'inherit'}
            >
              {t('contentAutomation.filters.today', 'Today')}
            </Button>
            <Button
              variant="outlined"
              startIcon={<ScheduleOutlinedIcon />}
              onClick={() => setSelectedDate(tomorrowIso)}
              color={selectedDate === tomorrowIso ? 'primary' : 'inherit'}
            >
              {t('contentAutomation.filters.tomorrow', 'Tomorrow')}
            </Button>
            <Button variant="outlined" startIcon={<RefreshOutlinedIcon />} onClick={() => loadPosts({ silent: false })}>
              {t('actions.refresh', 'Refresh')}
            </Button>
            <Button
              variant="contained"
              startIcon={<AutoAwesomeOutlinedIcon />}
              onClick={handleGenerateSelectedDate}
              disabled={!canGenerate || generating || !selectedDate || (resellerBrandingEnabled && !selectedResellerReady)}
            >
              {generating
                ? t('contentAutomation.actions.generating', 'Generating...')
                : isTomorrowSelected
                  ? t('contentAutomation.actions.generateTomorrow', 'Generate tomorrow')
                  : t('contentAutomation.actions.generateDate', 'Generate selected date')}
            </Button>
          </ResponsiveActionBar>
        }
      >
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {t(
            'contentAutomation.subtitle',
            'Review the four daily sports posts, validate the SAFE copy, and publish only after manual approval.'
          )}
        </Typography>

        <ResponsiveFilters paperSx={{ mb: 2 }}>
          <TextField
            label={t('contentAutomation.filters.date', 'Date')}
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          {isAdminUser ? (
            <ToggleButtonGroup
              exclusive
              size="small"
              color="primary"
              value={brandingMode}
              onChange={(_, nextValue) => {
                if (!nextValue) return;
                setBrandingMode(nextValue);
              }}
            >
              <ToggleButton value={BRANDING_MODE_GENERIC}>
                {t('contentAutomation.branding.modeGeneric', 'Generic watermark')}
              </ToggleButton>
              <ToggleButton value={BRANDING_MODE_RESELLER}>
                {t('contentAutomation.branding.modeReseller', 'Reseller watermark')}
              </ToggleButton>
            </ToggleButtonGroup>
          ) : null}
          {isAdminUser && resellerBrandingEnabled ? (
            <Autocomplete
              options={resellerOptions}
              loading={resellerLookupLoading}
              value={selectedReseller}
              inputValue={resellerSearchInput}
              onInputChange={(_, nextInput) => setResellerSearchInput(nextInput)}
              onChange={async (_, nextValue) => {
                const normalized = normalizeSupportProfile(nextValue);
                setSelectedReseller(normalized);
                if (!normalized?.username) {
                  return;
                }
                if (normalized.supportPhone || normalized.configured) {
                  return;
                }
                try {
                  const resolved = await getAdminResellerSupportProfile(normalized.username, { skipAuthRedirect: true });
                  setSelectedReseller(normalizeSupportProfile(resolved));
                } catch (apiError) {
                  setResellerSelectionError(
                    apiError?.response?.data?.message ||
                      t('contentAutomation.branding.errors.lookup', 'Could not load reseller support profiles.')
                  );
                }
              }}
              isOptionEqualToValue={(option, value) => String(option?.username || '') === String(value?.username || '')}
              getOptionLabel={(option) => resellerOptionLabel(option, t)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t('contentAutomation.branding.resellerLabel', 'Reseller')}
                  placeholder={t('contentAutomation.branding.resellerPlaceholder', 'Search by username')}
                />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Stack spacing={0.25}>
                    <Typography variant="subtitle2">{option.username}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.configured && option.supportPhone
                        ? t('contentAutomation.branding.resellerConfigured', {
                            phone: option.supportPhone,
                            defaultValue: 'Support phone: {{phone}}'
                          })
                        : t('contentAutomation.branding.resellerMissing', 'Support phone not configured')}
                    </Typography>
                  </Stack>
                </Box>
              )}
              sx={{ minWidth: { xs: '100%', md: 320 } }}
            />
          ) : null}
          <Alert severity="info" variant="outlined" sx={{ flex: 1 }}>
            {isTomorrowSelected
              ? t(
                  'contentAutomation.filters.tomorrowHelper',
                  'Tomorrow is the default review date because this console is designed to validate what will be published next.'
                )
              : t(
                  'contentAutomation.filters.historyHelper',
                  'You are reviewing a specific date snapshot. You can generate posts for this exact day whenever you need a manual batch.'
                )}
          </Alert>
        </ResponsiveFilters>

        {isAdminUser ? (
          <Stack spacing={1.25} sx={{ mb: 2 }}>
            <Alert severity={resellerBrandingEnabled ? (selectedResellerReady ? 'success' : 'warning') : 'info'} variant="outlined">
              {resellerBrandingEnabled
                ? selectedResellerReady
                  ? t('contentAutomation.branding.previewReady', {
                      username: selectedReseller?.username,
                      phone: selectedReseller?.supportPhone,
                      defaultValue: 'The poster watermark will use {{phone}} for reseller {{username}}.'
                    })
                  : resellerSelectionError ||
                    t(
                      'contentAutomation.branding.previewMissing',
                      'Choose a reseller with a configured support phone to generate branded content.'
                    )
                : t(
                    'contentAutomation.branding.previewGeneric',
                    'The poster watermark will stay on the generic Lion TV brand for this generation batch.'
                  )}
            </Alert>
          </Stack>
        ) : null}

        <ResponsiveMetricGrid columns={{ xs: 1, md: 2, xl: 5 }} gap={gridSpacing}>
          <MetricCard
            icon={ScheduleOutlinedIcon}
            label={t('contentAutomation.kpis.posts', 'Posts')}
            value={stats.total}
            helper={t('contentAutomation.kpis.postsHelper', 'Posts currently loaded for the selected review date.')}
            color="primary"
          />
          <MetricCard
            icon={AutoAwesomeOutlinedIcon}
            label={t('contentAutomation.kpis.generated', 'Generated')}
            value={stats.generated}
            helper={t('contentAutomation.kpis.generatedHelper', 'Posts ready for editorial review and approval.')}
            color="info"
          />
          <MetricCard
            icon={CheckCircleOutlineOutlinedIcon}
            label={t('contentAutomation.kpis.approved', 'Approved')}
            value={stats.approved}
            helper={t('contentAutomation.kpis.approvedHelper', 'Posts already validated and ready to publish.')}
            color="warning"
          />
          <MetricCard
            icon={PublishedWithChangesOutlinedIcon}
            label={t('contentAutomation.kpis.published', 'Published')}
            value={stats.published}
            helper={t('contentAutomation.kpis.publishedHelper', 'Posts that were sent to the selected publishing flow.')}
            color="success"
          />
          <MetricCard
            icon={ErrorOutlineOutlinedIcon}
            label={t('contentAutomation.kpis.failed', 'Failed')}
            value={stats.failed}
            helper={t('contentAutomation.kpis.failedHelper', 'Posts that need manual intervention before they can move forward.')}
            color="error"
          />
        </ResponsiveMetricGrid>
      </MainCard>

      {isTomorrowSelected ? (
        <MainCard title={t('contentAutomation.events.title', 'Tomorrow events')} secondary={null}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t(
              'contentAutomation.events.subtitle',
              'Real fixtures detected for tomorrow in Honduras time. The cards below use the slot distribution plus the full-day pool to build the review content.'
            )}
          </Typography>

          {eventsError ? (
            <Alert severity="warning" variant="outlined" sx={{ mb: 2 }}>
              {eventsError}
            </Alert>
          ) : null}

          {eventsLoading ? (
            <ResponsiveMetricGrid columns={{ xs: 1, md: 2, xl: 4 }} gap={gridSpacing}>
              {SLOT_ORDER.map((slot) => (
                <Skeleton key={slot} variant="rectangular" height={180} sx={{ borderRadius: 3 }} />
              ))}
            </ResponsiveMetricGrid>
          ) : (
            <ResponsiveMetricGrid columns={{ xs: 1, md: 2, xl: 4 }} gap={gridSpacing}>
              {SLOT_ORDER.map((slot) => (
                <EventStrip
                  key={slot}
                  slot={slot}
                  title={t(`contentAutomation.slots.${slot.toLowerCase()}`, slot)}
                  events={eventsPayload?.slots?.[slot] || []}
                  locale={locale}
                  t={t}
                />
              ))}
            </ResponsiveMetricGrid>
          )}
        </MainCard>
      ) : null}

      {!hasPosts ? (
        <MainCard title={t('contentAutomation.slotsReviewTitle', 'Daily slot review')}>
          <PageEmptyState
            message={
              isTomorrowSelected
                ? t(
                    'contentAutomation.empty.tomorrow',
                    'No daily posts were generated for tomorrow yet. Use "Generate tomorrow" to build the review set.'
                  )
                : t(
                    'contentAutomation.empty.history',
                    'No posts were stored for this date yet. Select another day or generate this specific review batch.'
                  )
            }
          />
        </MainCard>
      ) : null}

      <MainCard title={t('contentAutomation.slotsReviewTitle', 'Daily slot review')}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {t(
            'contentAutomation.slotsReviewSubtitle',
            'Each slot keeps one professional review card with the final status, sanitized copy and image preview.'
          )}
        </Typography>

        {error && hasPosts ? (
          <Alert severity="warning" variant="outlined" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : null}

        <ResponsiveMetricGrid columns={{ xs: 1, md: 2, xl: 4 }} gap={gridSpacing}>
          {SLOT_ORDER.map((slot) => {
            const post = postsBySlot[slot];
            return (
              <SlotPostCard
                key={slot}
                slot={slot}
                post={post}
                previewUrl={post?.id ? previewUrls[post.id] : ''}
                previewLoading={Boolean(post?.id) && !previewUrls[post.id] && !previewLoadErrors[post.id]}
                previewError={post?.id ? previewLoadErrors[post.id] : ''}
                inlineError={inlineErrors[slot]}
                locale={locale}
                canGenerate={canGenerate}
                canApprove={canApprove}
                canPublish={canPublish}
                busyAction={post?.id ? busyActions[post.id] : null}
                onPreview={(selectedPost) => setPreviewDialog({ open: true, post: selectedPost })}
                onSafePreview={openSafePreview}
                onSelectEvents={(selectedPost) => openSelectionDialog(selectedPost)}
                onRegenerateImage={(selectedPost) =>
                  handleAction(
                    selectedPost,
                    'image',
                    (postId) => regenerateContentAutomationImage(postId, { skipAuthRedirect: true }),
                    'contentAutomation.messages.imageRegenerated',
                    t('contentAutomation.messages.imageRegenerated', 'The preview image was regenerated successfully.')
                  )
                }
                onRegenerateCaptions={(selectedPost) =>
                  handleAction(
                    selectedPost,
                    'captions',
                    (postId) => regenerateContentAutomationCaptions(postId, { skipAuthRedirect: true }),
                    'contentAutomation.messages.captionsRegenerated',
                    t('contentAutomation.messages.captionsRegenerated', 'The captions were regenerated successfully.')
                  )
                }
                onApprove={(selectedPost) => setConfirmDialog({ open: true, type: 'approve', post: selectedPost })}
                onPublish={(selectedPost) => setConfirmDialog({ open: true, type: 'publish', post: selectedPost })}
                t={t}
              />
            );
          })}
        </ResponsiveMetricGrid>
      </MainCard>

      <Dialog
        open={selectionDialog.open}
        onClose={selectionDialog.saving ? undefined : closeSelectionDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitleWithClose onClose={selectionDialog.saving ? undefined : closeSelectionDialog}>
          {t('contentAutomation.selectionDialog.title', 'Select the events that should appear in the image')}
        </DialogTitleWithClose>
        <DialogContent dividers>
          {selectionDialog.loading ? (
            <PageLoadingState label={t('contentAutomation.selectionDialog.loading', 'Loading selectable events...')} />
          ) : (
            <Stack spacing={2}>
              <Typography variant="body2" color="text.secondary">
                {selectionDialog.post?.slot === 'ALL_DAY'
                  ? t(
                      'contentAutomation.selectionDialog.subtitleAllDay',
                      'Choose up to 5 real events from the full day. The system will regenerate the image and captions using exactly this editorial selection.'
                    )
                  : t(
                      'contentAutomation.selectionDialog.subtitle',
                      'Choose up to 5 real events for this slot. The system will regenerate the image and captions using exactly this editorial selection.'
                    )}
              </Typography>

              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                <Chip
                  color="primary"
                  variant="outlined"
                  label={t('contentAutomation.selectionDialog.selectedCount', {
                    count: selectionDialog.selectedEventIds.length,
                    defaultValue: '{{count}} selected'
                  })}
                />
                <Chip
                  variant="outlined"
                  label={t('contentAutomation.selectionDialog.limit', 'Maximum 5 events in the image')}
                />
                {selectionDialog.manualEventSelectionEnabled ? (
                  <Chip
                    color="warning"
                    variant="outlined"
                    label={t('contentAutomation.selectionDialog.manual', 'Manual selection currently active')}
                  />
                ) : (
                  <Chip
                    color="default"
                    variant="outlined"
                    label={t('contentAutomation.selectionDialog.automatic', 'Automatic featured selection is currently active')}
                  />
                )}
              </Stack>

              {selectionDialog.error ? (
                <Alert severity="error" variant="outlined">
                  {selectionDialog.error}
                </Alert>
              ) : null}

              {!selectionDialog.events.length ? (
                <PageEmptyState
                  message={
                    selectionDialog.post?.slot === 'ALL_DAY'
                      ? t(
                          'contentAutomation.selectionDialog.emptyAllDay',
                          'No real events are available for this day yet. Generate or import events first.'
                        )
                      : t(
                          'contentAutomation.selectionDialog.empty',
                          'No real events are available for this slot yet. Generate or import events first.'
                        )
                  }
                />
              ) : (
                <Stack spacing={1.25}>
                  {selectionDialog.events.map((event) => {
                    const checked = selectionDialog.selectedEventIds.includes(event.id);
                    const limitReached = selectionDialog.selectedEventIds.length >= 5 && !checked;
                    return (
                      <Box
                        key={`${event.id}-${event.eventTime}`}
                        sx={(theme) => ({
                          borderRadius: 3,
                          border: '1px solid',
                          borderColor: checked
                            ? withAlpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.42 : 0.24)
                            : 'divider',
                          background:
                            checked
                              ? theme.palette.mode === 'dark'
                                ? `linear-gradient(165deg, ${withAlpha(theme.vars?.palette?.surface?.card || theme.palette.background.paper, 0.98)} 0%, ${withAlpha(theme.palette.primary.main, 0.14)} 100%)`
                                : `linear-gradient(165deg, ${theme.vars?.palette?.surface?.card || theme.palette.background.paper} 0%, ${withAlpha(theme.palette.primary.light, 0.16)} 100%)`
                              : theme.vars?.palette?.surface?.card || theme.palette.background.paper
                        })}
                      >
                        <FormControlLabel
                          sx={{ m: 0, alignItems: 'flex-start', width: '100%', px: 2, py: 1.5 }}
                          control={
                            <Checkbox
                              checked={checked}
                              disabled={limitReached || selectionDialog.saving}
                              onChange={() => toggleSelectedEvent(event.id)}
                            />
                          }
                          label={
                            <Stack spacing={0.5} sx={{ pt: 0.5 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                                {formatEventLabel(event)}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {(event.leagueName || t('contentAutomation.selectionDialog.fallbackLeague', 'Sporting event')) +
                                  ' · ' +
                                  formatEventTime(event.eventTime, locale)}
                              </Typography>
                            </Stack>
                          }
                        />
                      </Box>
                    );
                  })}
                </Stack>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeSelectionDialog} disabled={selectionDialog.saving}>
            {t('actions.cancel', 'Cancel')}
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            onClick={handleResetSelectedEvents}
            disabled={selectionDialog.loading || selectionDialog.saving || !selectionDialog.events.length}
          >
            {t('contentAutomation.actions.useAutomaticSelection', 'Use automatic selection')}
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveSelectedEvents}
            disabled={
              selectionDialog.loading ||
              selectionDialog.saving ||
              !selectionDialog.events.length ||
              !selectionDialog.selectedEventIds.length
            }
          >
            {selectionDialog.saving
              ? t('contentAutomation.actions.applyingSelection', 'Applying selection...')
              : t('contentAutomation.actions.applySelectedEvents', 'Apply selected events')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={previewDialog.open}
        onClose={() => setPreviewDialog({ open: false, post: null })}
        fullWidth
        maxWidth="md"
      >
        <DialogTitleWithClose onClose={() => setPreviewDialog({ open: false, post: null })}>
          {t('contentAutomation.previewDialog.title', 'Rendered image preview')}
        </DialogTitleWithClose>
        <DialogContent dividers>
          <Stack spacing={2}>
            <Typography variant="body2" color="text.secondary">
              {previewDialog.post?.title || '-'}
            </Typography>
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              <Chip
                size="small"
                color={String(previewDialog.post?.brandingMode || BRANDING_MODE_GENERIC).toUpperCase() === BRANDING_MODE_RESELLER ? 'secondary' : 'default'}
                variant={String(previewDialog.post?.brandingMode || BRANDING_MODE_GENERIC).toUpperCase() === BRANDING_MODE_RESELLER ? 'filled' : 'outlined'}
                label={
                  String(previewDialog.post?.brandingMode || BRANDING_MODE_GENERIC).toUpperCase() === BRANDING_MODE_RESELLER
                    ? t('contentAutomation.branding.modeReseller', 'Reseller watermark')
                    : t('contentAutomation.branding.modeGeneric', 'Generic watermark')
                }
              />
              {previewDialog.post?.targetResellerUsername ? (
                <Chip
                  size="small"
                  variant="outlined"
                  label={t('contentAutomation.slotCard.resellerLabel', {
                    username: previewDialog.post.targetResellerUsername,
                    defaultValue: 'Reseller: {{username}}'
                  })}
                />
              ) : null}
              {previewDialog.post?.targetResellerPhoneMasked ? (
                <Chip
                  size="small"
                  variant="outlined"
                  label={t('contentAutomation.slotCard.phoneLabel', {
                    phone: previewDialog.post.targetResellerPhoneMasked,
                    defaultValue: 'Phone: {{phone}}'
                  })}
                />
              ) : null}
            </Stack>
            {previewDialog.post?.id && previewUrls[previewDialog.post.id] ? (
              <Box
                component="img"
                src={previewUrls[previewDialog.post.id]}
                alt={previewDialog.post?.title || 'content-preview'}
                sx={{ width: '100%', borderRadius: 3, border: '1px solid', borderColor: 'divider' }}
              />
            ) : (
              <Alert severity="info" variant="outlined">
                {previewDialog.post?.id
                  ? previewLoadErrors[previewDialog.post.id] || t('contentAutomation.errors.previewMissing', 'Preview image is not available yet.')
                  : t('contentAutomation.errors.previewMissing', 'Preview image is not available yet.')}
              </Alert>
            )}
          </Stack>
        </DialogContent>
      </Dialog>

      <Dialog
        open={safeDialog.open}
        onClose={() => setSafeDialog({ open: false, post: null, data: null, loading: false, error: '' })}
        fullWidth
        maxWidth="md"
      >
        <DialogTitleWithClose onClose={() => setSafeDialog({ open: false, post: null, data: null, loading: false, error: '' })}>
          {t('contentAutomation.safePreviewDialog.title', 'SAFE preview')}
        </DialogTitleWithClose>
        <DialogContent dividers>
          {safeDialog.loading ? (
            <PageLoadingState label={t('contentAutomation.safePreviewDialog.loading', 'Loading SAFE preview...')} />
          ) : safeDialog.error ? (
            <PageErrorState message={safeDialog.error} />
          ) : (
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip color="success" label={safeDialog.data?.safeModeEnabled ? t('contentAutomation.safeMode', 'SAFE mode') : t('contentAutomation.safeModeOff', 'SAFE mode disabled')} />
                <Chip
                  color={safePreviewPassed ? 'success' : 'warning'}
                  variant="outlined"
                  label={
                    safePreviewPassed
                      ? t('contentAutomation.safePreviewDialog.clean', 'No direct URL or domain detected')
                      : t('contentAutomation.safePreviewDialog.review', 'Review CTA and remove direct URL references')
                  }
                />
                <Chip
                  size="small"
                  color={String(safeDialog.data?.brandingMode || BRANDING_MODE_GENERIC).toUpperCase() === BRANDING_MODE_RESELLER ? 'secondary' : 'default'}
                  variant={String(safeDialog.data?.brandingMode || BRANDING_MODE_GENERIC).toUpperCase() === BRANDING_MODE_RESELLER ? 'filled' : 'outlined'}
                  label={
                    String(safeDialog.data?.brandingMode || BRANDING_MODE_GENERIC).toUpperCase() === BRANDING_MODE_RESELLER
                      ? t('contentAutomation.branding.modeReseller', 'Reseller watermark')
                      : t('contentAutomation.branding.modeGeneric', 'Generic watermark')
                  }
                />
                {safeDialog.data?.targetResellerUsername ? (
                  <Chip
                    size="small"
                    variant="outlined"
                    label={t('contentAutomation.slotCard.resellerLabel', {
                      username: safeDialog.data.targetResellerUsername,
                      defaultValue: 'Reseller: {{username}}'
                    })}
                  />
                ) : null}
                {safeDialog.data?.targetResellerPhoneMasked ? (
                  <Chip
                    size="small"
                    variant="outlined"
                    label={t('contentAutomation.slotCard.phoneLabel', {
                      phone: safeDialog.data.targetResellerPhoneMasked,
                      defaultValue: 'Phone: {{phone}}'
                    })}
                  />
                ) : null}
              </Stack>

              {safeDialog.post?.id && previewUrls[safeDialog.post.id] ? (
                <Box
                  component="img"
                  src={previewUrls[safeDialog.post.id]}
                  alt={safeDialog.post?.title || 'safe-preview'}
                  sx={{ width: '100%', borderRadius: 3, border: '1px solid', borderColor: 'divider' }}
                />
              ) : null}

              <Box
                sx={(theme) => ({
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: theme.vars?.palette?.surface?.card || theme.palette.background.paper,
                  p: 2
                })}
              >
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  {t('contentAutomation.safePreviewDialog.caption', 'Sanitized caption')}
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {safeDialog.data?.caption || '-'}
                </Typography>
              </Box>
            </Stack>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, type: '', post: null })}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitleWithClose onClose={() => setConfirmDialog({ open: false, type: '', post: null })}>
          {confirmDialog.type === 'approve'
            ? t('contentAutomation.confirm.approveTitle', 'Approve generated post')
            : t('contentAutomation.confirm.publishTitle', 'Publish approved post')}
        </DialogTitleWithClose>
        <DialogContent dividers>
          <Stack spacing={1.5}>
            <Typography variant="body2" color="text.secondary">
              {confirmDialog.type === 'approve'
                ? t(
                    'contentAutomation.confirm.approveDescription',
                    'This will mark the slot as approved and keep it ready for manual publishing.'
                  )
                : t(
                    'contentAutomation.confirm.publishDescription',
                    'This will send the slot through the configured publishing flow and mark it as published.'
                  )}
            </Typography>
            {confirmDialog.post ? (
              <Alert severity="info" variant="outlined">
                {confirmDialog.post.title} · {t(`contentAutomation.slots.${String(confirmDialog.post.slot || '').toLowerCase()}`, confirmDialog.post.slot)}
              </Alert>
            ) : null}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, type: '', post: null })}>{t('actions.cancel', 'Cancel')}</Button>
          <Button
            variant="contained"
            color={confirmDialog.type === 'publish' ? 'success' : 'warning'}
            onClick={handleConfirmAction}
          >
            {confirmPrimaryLabel}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
