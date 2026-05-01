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
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Pagination from '@mui/material/Pagination';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import ImageSearchOutlinedIcon from '@mui/icons-material/ImageSearchOutlined';
import LocalMoviesOutlinedIcon from '@mui/icons-material/LocalMoviesOutlined';
import PublishedWithChangesOutlinedIcon from '@mui/icons-material/PublishedWithChangesOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import SmartDisplayOutlinedIcon from '@mui/icons-material/SmartDisplayOutlined';
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
import TvOutlinedIcon from '@mui/icons-material/TvOutlined';
import ViewCarouselOutlinedIcon from '@mui/icons-material/ViewCarouselOutlined';
import ViewComfyOutlinedIcon from '@mui/icons-material/ViewComfyOutlined';
import CropPortraitOutlinedIcon from '@mui/icons-material/CropPortraitOutlined';

import {
  approveVodPost,
  createVodPost,
  getVodPostPreviewImageBlob,
  getVodPostSafePreview,
  getVodPosts,
  getVodPostsCatalog,
  publishVodPost,
  regenerateVodPostCaptions,
  regenerateVodPostImage,
  updateVodPostSelection
} from 'api/vod-posts';
import { getAdminResellerSupportProfile, searchAdminResellerSupportProfiles } from 'api/liontv-reseller-wallet';
import MainCard from 'ui-component/cards/MainCard';
import DialogTitleWithClose from 'ui-component/dialogs/DialogTitleWithClose';
import { PageEmptyState, PageErrorState, PageLoadingState } from 'ui-component/feedback/PageState';
import { withAlpha } from 'utils/colorUtils';
import { hasPermissionExact } from 'utils/rbac';

const BRANDING_MODE_GENERIC = 'GENERIC';
const BRANDING_MODE_RESELLER = 'RESELLER';
const CONTENT_TYPES = ['MOVIE', 'SERIES'];
const LAYOUT_MODES = ['SINGLE', 'GRID', 'HERO_STACK'];
const CATALOG_PAGE_SIZE = 24;
const CATEGORY_OPTION_ALL = '__ALL__';
const CATEGORY_OPTION_UNCATEGORIZED = '__UNCATEGORIZED__';

const LAYOUT_RULES = {
  SINGLE: { min: 1, max: 1 },
  GRID: { min: 2, max: 6 },
  HERO_STACK: { min: 2, max: 5 }
};

function clampText(lines = 2) {
  return {
    display: '-webkit-box',
    WebkitLineClamp: lines,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  };
}

function normalizeCategoryValue(value) {
  const normalized = String(value || '').trim();
  return normalized || CATEGORY_OPTION_UNCATEGORIZED;
}

function formatDateTime(value, locale = 'es-HN') {
  if (!value) return '-';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);
  return parsed.toLocaleString(locale, {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
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

function normalizeSupportProfile(profile) {
  if (!profile?.username) return null;
  const supportPhone = profile?.supportPhone || '';
  const configured = Boolean(profile?.configured);
  return {
    username: String(profile.username),
    supportPhone,
    configured,
    ready: configured && Boolean(supportPhone),
    updatedAt: profile?.updatedAt || null
  };
}

function resellerOptionLabel(option) {
  if (!option?.username) return '';
  return option?.supportPhone ? `${option.username} · ${option.supportPhone}` : option.username;
}

function createPostBrandingPayload(post) {
  return {
    brandingMode: post?.brandingMode || BRANDING_MODE_GENERIC,
    resellerUsername: post?.targetResellerUsername || null
  };
}

function contentTypeIcon(contentType) {
  return contentType === 'SERIES' ? TvOutlinedIcon : LocalMoviesOutlinedIcon;
}

function layoutIcon(layoutMode) {
  switch (layoutMode) {
    case 'SINGLE':
      return CropPortraitOutlinedIcon;
    case 'HERO_STACK':
      return ViewCarouselOutlinedIcon;
    case 'GRID':
    default:
      return ViewComfyOutlinedIcon;
  }
}

function VodMetricCard({ icon: Icon, label, value, helper, color = 'primary' }) {
  return (
    <Card
      sx={(theme) => ({
        borderRadius: 3,
        border: '1px solid',
        borderColor: withAlpha(theme.palette[color].main, theme.palette.mode === 'dark' ? 0.22 : 0.16),
        background:
          theme.palette.mode === 'dark'
            ? `linear-gradient(165deg, ${withAlpha(theme.palette.background.paper, 0.98)} 0%, ${withAlpha(theme.palette[color].main, 0.14)} 100%)`
            : `linear-gradient(165deg, ${theme.palette.background.paper} 0%, ${withAlpha(theme.palette[color].light, 0.18)} 100%)`,
        boxShadow:
          theme.palette.mode === 'dark'
            ? `0 16px 30px ${alpha(theme.palette.common.black, 0.28)}`
            : `0 12px 24px ${alpha(theme.palette.common.black, 0.08)}`,
        height: '100%'
      })}
    >
      <CardContent>
        <Stack spacing={1.2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800, letterSpacing: '0.12em' }}>
              {label}
            </Typography>
            <Avatar
              sx={(theme) => ({
                width: 40,
                height: 40,
                bgcolor: withAlpha(theme.palette[color].main, 0.16),
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

function CatalogPosterCard({
  item,
  selected,
  disabled,
  onToggle,
  contentType,
  t
}) {
  const AccentIcon = contentTypeIcon(contentType);

  return (
    <Card
      sx={(theme) => ({
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 3.5,
        border: '1px solid',
        borderColor: selected
          ? withAlpha(theme.palette.primary.main, 0.75)
          : withAlpha(theme.palette.divider, theme.palette.mode === 'dark' ? 0.85 : 1),
        boxShadow: selected
          ? `0 20px 36px ${withAlpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.28 : 0.16)}`
          : `0 12px 28px ${alpha(theme.palette.common.black, theme.palette.mode === 'dark' ? 0.28 : 0.08)}`,
        transition: 'transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease',
        opacity: disabled ? 0.62 : 1,
        '&:hover': {
          transform: disabled ? 'none' : 'translateY(-2px)',
          borderColor: withAlpha(theme.palette.primary.main, 0.66)
        }
      })}
    >
      <CardActionArea onClick={onToggle} disabled={disabled} sx={{ alignItems: 'stretch', height: '100%' }}>
        <Box
          sx={(theme) => ({
            position: 'relative',
            aspectRatio: '2 / 3',
            background:
              item?.posterUrl
                ? `linear-gradient(180deg, ${withAlpha('#04070d', 0.06)} 0%, ${withAlpha('#04070d', 0.78)} 100%), url(${item.posterUrl}) center/cover no-repeat`
                : `linear-gradient(180deg, ${withAlpha(theme.palette.primary.main, 0.24)} 0%, ${withAlpha('#04070d', 0.94)} 100%)`
          })}
        >
          {!item?.posterUrl ? (
            <Stack alignItems="center" justifyContent="center" spacing={1} sx={{ height: '100%' }}>
              <Avatar
                sx={(theme) => ({
                  width: 64,
                  height: 64,
                  bgcolor: withAlpha(theme.palette.primary.main, 0.2),
                  color: theme.palette.primary.main
                })}
              >
                <AccentIcon fontSize="medium" />
              </Avatar>
              <Typography variant="body2" color="common.white" sx={{ fontWeight: 700 }}>
                {t('vodPosts.catalog.posterFallback', 'Poster pending')}
              </Typography>
            </Stack>
          ) : null}

          <Stack direction="row" spacing={1} sx={{ position: 'absolute', top: 14, left: 14, right: 14, justifyContent: 'space-between' }}>
            <Chip
              size="small"
              color={selected ? 'primary' : 'default'}
              label={
                selected
                  ? t('vodPosts.catalog.selected', 'Selected')
                  : t(`vodPosts.contentTypes.${String(contentType || '').toLowerCase()}`, contentType)
              }
            />
            {item?.year ? <Chip size="small" variant="outlined" label={item.year} /> : null}
          </Stack>

          <Stack spacing={1} sx={{ position: 'absolute', right: 14, bottom: 14, left: 14 }}>
            {Array.isArray(item?.metaBadges) && item.metaBadges.length ? (
              <Stack direction="row" spacing={0.75} sx={{ flexWrap: 'wrap' }}>
                {item.metaBadges.slice(0, 3).map((badge) => (
                  <Chip key={badge} size="small" label={badge} sx={{ bgcolor: withAlpha('#08111d', 0.72) }} />
                ))}
              </Stack>
            ) : null}
            <Typography variant="h4" color="common.white" sx={{ fontWeight: 900, lineHeight: 1.02, ...clampText(3) }}>
              {item?.title || '-'}
            </Typography>
            {item?.genreLabel ? (
              <Typography variant="caption" color="grey.300" sx={{ fontWeight: 700, letterSpacing: '0.08em' }}>
                {item.genreLabel}
              </Typography>
            ) : null}
          </Stack>
        </Box>
      </CardActionArea>
    </Card>
  );
}

function VodPostCard({
  post,
  t,
  canGenerate,
  canApprove,
  canPublish,
  busyState,
  onEditSelection,
  onPreviewImage,
  onSafePreview,
  onRegenerateImage,
  onRegenerateCaptions,
  onApprove,
  onPublish
}) {
  const LayoutIcon = layoutIcon(post?.layoutMode);
  const ContentTypeIcon = contentTypeIcon(post?.contentType);

  return (
    <Card
      sx={(theme) => ({
        borderRadius: 3.5,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: withAlpha(theme.palette.divider, theme.palette.mode === 'dark' ? 0.8 : 1),
        background:
          theme.palette.mode === 'dark'
            ? `linear-gradient(180deg, ${withAlpha(theme.palette.background.paper, 0.98)} 0%, ${withAlpha('#09101b', 0.96)} 100%)`
            : theme.palette.background.paper,
        boxShadow:
          theme.palette.mode === 'dark'
            ? `0 18px 32px ${alpha(theme.palette.common.black, 0.26)}`
            : `0 12px 24px ${alpha(theme.palette.common.black, 0.08)}`
      })}
    >
      <Box
        sx={(theme) => ({
          position: 'relative',
          aspectRatio: '16 / 9',
          background:
            post?.imageUrl
              ? `linear-gradient(180deg, ${withAlpha('#04070d', 0.06)} 0%, ${withAlpha('#04070d', 0.78)} 100%), url(${post.imageUrl}) center/cover no-repeat`
              : `linear-gradient(160deg, ${withAlpha(theme.palette.primary.main, 0.18)} 0%, ${withAlpha('#05070d', 0.96)} 100%)`
        })}
      >
        <Stack direction="row" spacing={1} sx={{ position: 'absolute', top: 14, left: 14, right: 14, justifyContent: 'space-between' }}>
          <Chip size="small" color={statusColor(post?.status)} label={t(`vodPosts.status.${String(post?.status || '').toLowerCase()}`, post?.status)} />
          <Stack direction="row" spacing={0.75}>
            {post?.safeModeEnabled ? <Chip size="small" color="success" label={t('vodPosts.safeMode', 'SAFE mode')} /> : null}
            <Chip
              size="small"
              variant="outlined"
              label={t(`vodPosts.layouts.${String(post?.layoutMode || '').toLowerCase()}`, post?.layoutMode)}
            />
          </Stack>
        </Stack>
      </Box>

      <CardContent>
        <Stack spacing={2}>
          <Stack spacing={1}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar sx={{ width: 38, height: 38, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                <ContentTypeIcon fontSize="small" />
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="h4" sx={{ lineHeight: 1.15 }}>
                  {post?.title || t('vodPosts.posts.untitled', 'VOD draft')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t(`vodPosts.contentTypes.${String(post?.contentType || '').toLowerCase()}`, post?.contentType)} ·{' '}
                  {post?.selectedItemCount || 0}{' '}
                  {t('vodPosts.posts.selectedItems', 'selected titles')}
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
              <Chip
                size="small"
                icon={<LayoutIcon fontSize="small" />}
                label={t(`vodPosts.layouts.${String(post?.layoutMode || '').toLowerCase()}`, post?.layoutMode)}
              />
              <Chip
                size="small"
                label={
                  post?.brandingMode === BRANDING_MODE_RESELLER
                    ? t('vodPosts.branding.modeReseller', 'Reseller watermark')
                    : t('vodPosts.branding.modeGeneric', 'Generic watermark')
                }
              />
              {post?.targetResellerUsername ? (
                <Chip
                  size="small"
                  color="secondary"
                  label={t('vodPosts.posts.reseller', {
                    defaultValue: 'Reseller: {{username}}',
                    username: post.targetResellerUsername
                  })}
                />
              ) : null}
              {post?.sourceFeedId ? (
                <Chip
                  size="small"
                  variant="outlined"
                  label={t('vodPosts.posts.feed', {
                    defaultValue: 'Feed #{{id}}',
                    id: post.sourceFeedId
                  })}
                />
              ) : null}
            </Stack>
          </Stack>

          <Typography variant="body2" color="text.secondary" sx={clampText(3)}>
            {post?.caption || t('vodPosts.posts.captionPending', 'Generate captions to complete the publishing copy.')}
          </Typography>

          {post?.errorMessage ? <Alert severity="error" variant="outlined">{post.errorMessage}</Alert> : null}

          <Typography variant="caption" color="text.secondary">
            {t('vodPosts.posts.updatedAt', {
              defaultValue: 'Updated {{date}}',
              date: formatDateTime(post?.updatedAt)
            })}
          </Typography>

          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
            <Button size="small" variant="outlined" startIcon={<ImageSearchOutlinedIcon />} onClick={onPreviewImage}>
              {t('vodPosts.actions.previewImage', 'Preview image')}
            </Button>
            <Button size="small" variant="outlined" startIcon={<ShieldOutlinedIcon />} onClick={onSafePreview}>
              {t('vodPosts.actions.safePreview', 'Safe preview')}
            </Button>
            <Button size="small" variant="outlined" startIcon={<ViewComfyOutlinedIcon />} onClick={onEditSelection}>
              {t('vodPosts.actions.editSelection', 'Edit selection')}
            </Button>
            <Button
              size="small"
              variant="outlined"
              startIcon={<RefreshOutlinedIcon />}
              onClick={onRegenerateImage}
              disabled={!canGenerate || busyState?.image}
            >
              {busyState?.image
                ? t('vodPosts.actions.regeneratingImage', 'Regenerating...')
                : t('vodPosts.actions.regenerateImage', 'Regenerate image')}
            </Button>
            <Button
              size="small"
              variant="outlined"
              startIcon={<TextSnippetOutlinedIcon />}
              onClick={onRegenerateCaptions}
              disabled={!canGenerate || busyState?.captions}
            >
              {busyState?.captions
                ? t('vodPosts.actions.regeneratingCaptions', 'Regenerating...')
                : t('vodPosts.actions.regenerateCaptions', 'Regenerate captions')}
            </Button>
            <Button
              size="small"
              color="warning"
              variant="contained"
              startIcon={<CheckCircleOutlineOutlinedIcon />}
              onClick={onApprove}
              disabled={!canApprove || post?.status !== 'GENERATED' || busyState?.approve}
            >
              {busyState?.approve ? t('vodPosts.actions.approving', 'Approving...') : t('vodPosts.actions.approve', 'Approve')}
            </Button>
            <Button
              size="small"
              color="success"
              variant="contained"
              startIcon={<PublishedWithChangesOutlinedIcon />}
              onClick={onPublish}
              disabled={!canPublish || post?.status !== 'APPROVED' || busyState?.publish}
            >
              {busyState?.publish ? t('vodPosts.actions.publishing', 'Publishing...') : t('vodPosts.actions.publish', 'Publish')}
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function VodPostsLionTv() {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { user, accessToken } = useAuth();

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

  const [contentType, setContentType] = useState('MOVIE');
  const [layoutMode, setLayoutMode] = useState('GRID');
  const [brandingMode, setBrandingMode] = useState(BRANDING_MODE_GENERIC);
  const [safeModeEnabled, setSafeModeEnabled] = useState(true);
  const [selectedItemIds, setSelectedItemIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(CATEGORY_OPTION_ALL);
  const [editingPost, setEditingPost] = useState(null);

  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState('');
  const [catalogPayload, setCatalogPayload] = useState(null);

  const [postsLoading, setPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState('');
  const [postsPayload, setPostsPayload] = useState({ posts: [], total: 0 });

  const [savingComposer, setSavingComposer] = useState(false);
  const [busyActions, setBusyActions] = useState({});
  const [catalogPage, setCatalogPage] = useState(1);

  const [resellerOptions, setResellerOptions] = useState([]);
  const [resellerSearchInput, setResellerSearchInput] = useState('');
  const [resellerLookupLoading, setResellerLookupLoading] = useState(false);
  const [selectedReseller, setSelectedReseller] = useState(null);
  const [resellerSelectionError, setResellerSelectionError] = useState('');

  const [previewDialog, setPreviewDialog] = useState({ open: false, post: null, url: '', loading: false, error: '' });
  const [safePreviewDialog, setSafePreviewDialog] = useState({ open: false, post: null, data: null, loading: false, error: '' });

  const resellerBrandingEnabled = isAdminUser && brandingMode === BRANDING_MODE_RESELLER;
  const selectedResellerReady = Boolean(selectedReseller?.username && selectedReseller?.ready);

  useEffect(() => {
    return () => {
      if (previewDialog.url) {
        URL.revokeObjectURL(previewDialog.url);
      }
    };
  }, [previewDialog.url]);

  const setBusyForPost = useCallback((postId, actionKey, value) => {
    setBusyActions((prev) => ({
      ...prev,
      [postId]: {
        ...(prev[postId] || {}),
        [actionKey]: value
      }
    }));
  }, []);

  const loadCatalog = useCallback(async () => {
    if (!accessToken) return;
    setCatalogLoading(true);
    setCatalogError('');
    try {
      const payload = await getVodPostsCatalog(contentType, { skipAuthRedirect: true });
      setCatalogPayload({
        ...payload,
        items: Array.isArray(payload?.items) ? payload.items : []
      });
    } catch (apiError) {
      setCatalogPayload(null);
      setCatalogError(apiError?.response?.data?.message || t('vodPosts.errors.loadCatalog', 'Could not load the active catalog feed.'));
    } finally {
      setCatalogLoading(false);
    }
  }, [accessToken, contentType, t]);

  const loadPosts = useCallback(async () => {
    if (!accessToken) return;
    setPostsLoading(true);
    setPostsError('');
    try {
      const payload = await getVodPosts(contentType, { skipAuthRedirect: true });
      setPostsPayload({
        total: Number(payload?.total || 0),
        posts: Array.isArray(payload?.posts) ? payload.posts : []
      });
    } catch (apiError) {
      setPostsPayload({ total: 0, posts: [] });
      setPostsError(apiError?.response?.data?.message || t('vodPosts.errors.loadPosts', 'Could not load existing VOD drafts.'));
    } finally {
      setPostsLoading(false);
    }
  }, [accessToken, contentType, t]);

  useEffect(() => {
    loadCatalog();
    loadPosts();
  }, [loadCatalog, loadPosts]);

  useEffect(() => {
    setCatalogPage(1);
  }, [contentType, searchTerm, selectedCategory]);

  useEffect(() => {
    if (!resellerBrandingEnabled) {
      setResellerSelectionError('');
      return;
    }
    if (!selectedReseller?.username) {
      setResellerSelectionError(t('vodPosts.branding.errors.resellerRequired', 'Select a reseller before generating branded VOD content.'));
      return;
    }
    if (!selectedReseller?.ready) {
      setResellerSelectionError(
        t(
          'vodPosts.branding.errors.supportMissing',
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
        setResellerOptions(Array.isArray(payload) ? payload.map(normalizeSupportProfile).filter(Boolean) : []);
      } catch (apiError) {
        if (!active) return;
        setResellerOptions([]);
        setResellerSelectionError(
          apiError?.response?.data?.message || t('vodPosts.branding.errors.lookup', 'Could not load reseller support profiles.')
        );
      } finally {
        if (active) setResellerLookupLoading(false);
      }
    }, 250);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [accessToken, isAdminUser, resellerBrandingEnabled, resellerSearchInput, t]);

  const catalogItems = useMemo(() => (Array.isArray(catalogPayload?.items) ? catalogPayload.items : []), [catalogPayload]);

  const categoryOptions = useMemo(() => {
    const values = new Set();
    catalogItems.forEach((item) => {
      values.add(normalizeCategoryValue(item?.genreLabel));
    });
    const sortedValues = Array.from(values).sort((left, right) => {
      if (left === CATEGORY_OPTION_UNCATEGORIZED) return 1;
      if (right === CATEGORY_OPTION_UNCATEGORIZED) return -1;
      return left.localeCompare(right);
    });
    return [
      {
        value: CATEGORY_OPTION_ALL,
        label: t('vodPosts.catalog.categoryAll', 'All categories')
      },
      ...sortedValues.map((value) => ({
        value,
        label:
          value === CATEGORY_OPTION_UNCATEGORIZED
            ? t('vodPosts.catalog.categoryUncategorized', 'Uncategorized')
            : value
      }))
    ];
  }, [catalogItems, t]);

  useEffect(() => {
    if (selectedCategory === CATEGORY_OPTION_ALL) return;
    const stillAvailable = categoryOptions.some((option) => option.value === selectedCategory);
    if (!stillAvailable) {
      setSelectedCategory(CATEGORY_OPTION_ALL);
    }
  }, [categoryOptions, selectedCategory]);

  const filteredCatalogItems = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return catalogItems.filter((item) => {
      const matchesCategory =
        selectedCategory === CATEGORY_OPTION_ALL || normalizeCategoryValue(item?.genreLabel) === selectedCategory;
      if (!matchesCategory) return false;
      if (!query) return true;
      const haystack = [item?.title, item?.year, item?.genreLabel, ...(item?.metaBadges || [])]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [catalogItems, searchTerm, selectedCategory]);

  const catalogPageCount = useMemo(
    () => Math.max(1, Math.ceil(filteredCatalogItems.length / CATALOG_PAGE_SIZE)),
    [filteredCatalogItems.length]
  );

  useEffect(() => {
    setCatalogPage((prev) => Math.min(prev, catalogPageCount));
  }, [catalogPageCount]);

  const paginatedCatalogItems = useMemo(() => {
    const start = (catalogPage - 1) * CATALOG_PAGE_SIZE;
    return filteredCatalogItems.slice(start, start + CATALOG_PAGE_SIZE);
  }, [catalogPage, filteredCatalogItems]);

  const catalogIndex = useMemo(() => {
    const map = new Map();
    catalogItems.forEach((item) => {
      if (item?.itemId) map.set(item.itemId, item);
    });
    return map;
  }, [catalogItems]);

  const selectedItems = useMemo(
    () => selectedItemIds.map((itemId) => catalogIndex.get(itemId)).filter(Boolean),
    [catalogIndex, selectedItemIds]
  );

  const missingSelectedCount = selectedItemIds.length - selectedItems.length;
  const layoutRule = LAYOUT_RULES[layoutMode] || LAYOUT_RULES.GRID;
  const selectionCount = selectedItemIds.length;
  const selectionTooLow = selectionCount < layoutRule.min;
  const selectionTooHigh = selectionCount > layoutRule.max;
  const selectionValid = !selectionTooLow && !selectionTooHigh;
  const selectedCategoryOption =
    categoryOptions.find((option) => option.value === selectedCategory) ||
    categoryOptions[0] || {
      value: CATEGORY_OPTION_ALL,
      label: t('vodPosts.catalog.categoryAll', 'All categories')
    };
  const hasActiveCatalogFilters = Boolean(searchTerm.trim()) || selectedCategory !== CATEGORY_OPTION_ALL;
  const activeCatalogFilterSummary = useMemo(() => {
    const filters = [];
    if (searchTerm.trim()) {
      filters.push(t('vodPosts.catalog.activeFilterSearch', 'Search'));
    }
    if (selectedCategory !== CATEGORY_OPTION_ALL) {
      filters.push(
        t('vodPosts.catalog.activeFilterCategory', {
          defaultValue: 'Category: {{category}}',
          category: selectedCategoryOption.label
        })
      );
    }
    return filters.join(' · ');
  }, [searchTerm, selectedCategory, selectedCategoryOption.label, t]);

  const stats = useMemo(() => {
    const rows = postsPayload?.posts || [];
    return {
      total: rows.length,
      generated: rows.filter((item) => String(item.status || '').toUpperCase() === 'GENERATED').length,
      approved: rows.filter((item) => String(item.status || '').toUpperCase() === 'APPROVED').length,
      published: rows.filter((item) => String(item.status || '').toUpperCase() === 'PUBLISHED').length
    };
  }, [postsPayload?.posts]);

  const clearComposer = useCallback(() => {
    setEditingPost(null);
    setSelectedItemIds([]);
    setSearchTerm('');
    setSafeModeEnabled(true);
    setBrandingMode(BRANDING_MODE_GENERIC);
    setSelectedReseller(null);
    setResellerSearchInput('');
    setResellerSelectionError('');
  }, []);

  const hydrateResellerSelection = useCallback(
    async (username, maskedPhone) => {
      if (!isAdminUser || !username) return;
      try {
        const payload = await getAdminResellerSupportProfile(username, { skipAuthRedirect: true });
        const normalized = normalizeSupportProfile(payload);
        setSelectedReseller(
          normalized || {
            username,
            supportPhone: maskedPhone || '',
            configured: true,
            ready: true
          }
        );
      } catch (apiError) {
        setSelectedReseller({
          username,
          supportPhone: maskedPhone || '',
          configured: true,
          ready: true
        });
        enqueueSnackbar(
          apiError?.response?.data?.message || t('vodPosts.branding.errors.lookup', 'Could not load reseller support profiles.'),
          { variant: 'warning' }
        );
      }
    },
    [enqueueSnackbar, isAdminUser, t]
  );

  const handleEditSelection = useCallback(
    async (post) => {
      setEditingPost(post);
      setContentType(post?.contentType || 'MOVIE');
      setLayoutMode(post?.layoutMode || 'GRID');
      setSelectedItemIds(Array.isArray(post?.selectedItemIds) ? post.selectedItemIds : []);
      setSafeModeEnabled(Boolean(post?.safeModeEnabled));
      setBrandingMode(post?.brandingMode || BRANDING_MODE_GENERIC);
      if (post?.brandingMode === BRANDING_MODE_RESELLER && post?.targetResellerUsername) {
        await hydrateResellerSelection(post.targetResellerUsername, post.targetResellerPhoneMasked);
      } else {
        setSelectedReseller(null);
        setResellerSearchInput('');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [hydrateResellerSelection]
  );

  const handleToggleItem = useCallback(
    (itemId) => {
      setSelectedItemIds((prev) => {
        if (prev.includes(itemId)) {
          return prev.filter((value) => value !== itemId);
        }
        if (prev.length >= layoutRule.max) {
          enqueueSnackbar(
            t('vodPosts.errors.selectionLimit', {
              defaultValue: 'This layout supports up to {{count}} titles.',
              count: layoutRule.max
            }),
            { variant: 'warning' }
          );
          return prev;
        }
        return [...prev, itemId];
      });
    },
    [enqueueSnackbar, layoutRule.max, t]
  );

  const refreshPostInList = useCallback((updatedPost) => {
    if (!updatedPost?.id) return;
    setPostsPayload((prev) => {
      const existing = Array.isArray(prev?.posts) ? prev.posts : [];
      const index = existing.findIndex((item) => item.id === updatedPost.id);
      if (index === -1) {
        return {
          total: existing.length + 1,
          posts: [updatedPost, ...existing]
        };
      }
      const next = [...existing];
      next[index] = updatedPost;
      return {
        total: next.length,
        posts: next
      };
    });
  }, []);

  const handleSaveComposer = useCallback(async () => {
    if (!canGenerate) return;
    if (!selectionValid) {
      enqueueSnackbar(
        t(`vodPosts.validation.${String(layoutMode || '').toLowerCase()}`, {
          defaultValue:
            layoutMode === 'SINGLE'
              ? 'Select exactly 1 title.'
              : layoutMode === 'GRID'
                ? 'Select between 2 and 6 titles.'
                : 'Select between 2 and 5 titles.'
        }),
        { variant: 'warning' }
      );
      return;
    }
    if (resellerBrandingEnabled && !selectedResellerReady) {
      enqueueSnackbar(
        resellerSelectionError || t('vodPosts.branding.errors.resellerRequired', 'Select a reseller before generating branded VOD content.'),
        { variant: 'warning' }
      );
      return;
    }

    setSavingComposer(true);
    try {
      if (editingPost?.id) {
        const updatedPost = await updateVodPostSelection(
          editingPost.id,
          {
            selectedItemIds,
            brandingMode: resellerBrandingEnabled ? BRANDING_MODE_RESELLER : BRANDING_MODE_GENERIC,
            resellerUsername: resellerBrandingEnabled ? selectedReseller?.username || null : null
          },
          { skipAuthRedirect: true }
        );
        refreshPostInList(updatedPost);
        setEditingPost(updatedPost);
        enqueueSnackbar(t('vodPosts.messages.selectionUpdated', 'The VOD draft was updated with your selected titles.'), {
          variant: 'success'
        });
      } else {
        const createdPost = await createVodPost(
          {
            contentType,
            layoutMode,
            selectedItemIds,
            brandingMode: resellerBrandingEnabled ? BRANDING_MODE_RESELLER : BRANDING_MODE_GENERIC,
            resellerUsername: resellerBrandingEnabled ? selectedReseller?.username || null : null,
            safeModeEnabled
          },
          { skipAuthRedirect: true }
        );
        refreshPostInList(createdPost);
        enqueueSnackbar(t('vodPosts.messages.created', 'The VOD draft was created successfully.'), {
          variant: 'success'
        });
        clearComposer();
      }
    } catch (apiError) {
      enqueueSnackbar(
        apiError?.response?.data?.message ||
          (editingPost?.id
            ? t('vodPosts.errors.updateSelection', 'Could not update the selected titles for this draft.')
            : t('vodPosts.errors.create', 'Could not create the VOD draft.')),
        { variant: 'error' }
      );
    } finally {
      setSavingComposer(false);
    }
  }, [
    canGenerate,
    clearComposer,
    contentType,
    editingPost?.id,
    enqueueSnackbar,
    layoutMode,
    refreshPostInList,
    resellerBrandingEnabled,
    resellerSelectionError,
    selectedItemIds,
    selectedReseller?.username,
    selectedResellerReady,
    selectionValid,
    safeModeEnabled,
    t
  ]);

  const handlePreviewImage = useCallback(
    async (post) => {
      if (previewDialog.url) {
        URL.revokeObjectURL(previewDialog.url);
      }
      setPreviewDialog({ open: true, post, url: '', loading: true, error: '' });
      try {
        const blob = await getVodPostPreviewImageBlob(post.id, { skipAuthRedirect: true });
        if (!blob) {
          throw new Error(t('vodPosts.errors.previewImage', 'Preview image is not available yet.'));
        }
        const objectUrl = URL.createObjectURL(blob);
        setPreviewDialog({ open: true, post, url: objectUrl, loading: false, error: '' });
      } catch (apiError) {
        setPreviewDialog({
          open: true,
          post,
          url: '',
          loading: false,
          error: apiError?.response?.data?.message || apiError?.message || t('vodPosts.errors.previewImage', 'Preview image is not available yet.')
        });
      }
    },
    [previewDialog.url, t]
  );

  const closePreviewDialog = useCallback(() => {
    if (previewDialog.url) {
      URL.revokeObjectURL(previewDialog.url);
    }
    setPreviewDialog({ open: false, post: null, url: '', loading: false, error: '' });
  }, [previewDialog.url]);

  const handleSafePreview = useCallback(async (post) => {
    setSafePreviewDialog({ open: true, post, data: null, loading: true, error: '' });
    try {
      const payload = await getVodPostSafePreview(post.id, { skipAuthRedirect: true });
      setSafePreviewDialog({ open: true, post, data: payload, loading: false, error: '' });
    } catch (apiError) {
      setSafePreviewDialog({
        open: true,
        post,
        data: null,
        loading: false,
        error: apiError?.response?.data?.message || t('vodPosts.errors.safePreview', 'Could not load the SAFE preview.')
      });
    }
  }, [t]);

  const closeSafePreviewDialog = useCallback(() => {
    setSafePreviewDialog({ open: false, post: null, data: null, loading: false, error: '' });
  }, []);

  const runPostAction = useCallback(
    async (post, actionKey, action) => {
      setBusyForPost(post.id, actionKey, true);
      try {
        const updatedPost = await action();
        refreshPostInList(updatedPost);
        return updatedPost;
      } finally {
        setBusyForPost(post.id, actionKey, false);
      }
    },
    [refreshPostInList, setBusyForPost]
  );

  const handleRegenerateImage = useCallback(
    async (post) => {
      try {
        await runPostAction(post, 'image', () =>
          regenerateVodPostImage(post.id, {
            skipAuthRedirect: true,
            brandingPayload: createPostBrandingPayload(post)
          })
        );
        enqueueSnackbar(t('vodPosts.messages.imageRegenerated', 'The preview image was regenerated successfully.'), {
          variant: 'success'
        });
      } catch (apiError) {
        enqueueSnackbar(
          apiError?.response?.data?.message || t('vodPosts.errors.regenerateImage', 'Could not regenerate the image.'),
          { variant: 'error' }
        );
      }
    },
    [enqueueSnackbar, runPostAction, t]
  );

  const handleRegenerateCaptions = useCallback(
    async (post) => {
      try {
        await runPostAction(post, 'captions', () =>
          regenerateVodPostCaptions(post.id, {
            skipAuthRedirect: true,
            brandingPayload: createPostBrandingPayload(post)
          })
        );
        enqueueSnackbar(t('vodPosts.messages.captionsRegenerated', 'The captions were regenerated successfully.'), {
          variant: 'success'
        });
      } catch (apiError) {
        enqueueSnackbar(
          apiError?.response?.data?.message || t('vodPosts.errors.regenerateCaptions', 'Could not regenerate the captions.'),
          { variant: 'error' }
        );
      }
    },
    [enqueueSnackbar, runPostAction, t]
  );

  const handleApprove = useCallback(
    async (post) => {
      try {
        await runPostAction(post, 'approve', () => approveVodPost(post.id, { skipAuthRedirect: true }));
        enqueueSnackbar(t('vodPosts.messages.approved', 'The VOD draft is now approved.'), { variant: 'success' });
      } catch (apiError) {
        enqueueSnackbar(apiError?.response?.data?.message || t('vodPosts.errors.approve', 'Could not approve this VOD draft.'), {
          variant: 'error'
        });
      }
    },
    [enqueueSnackbar, runPostAction, t]
  );

  const handlePublish = useCallback(
    async (post) => {
      try {
        await runPostAction(post, 'publish', () => publishVodPost(post.id, { skipAuthRedirect: true }));
        enqueueSnackbar(t('vodPosts.messages.published', 'The VOD draft was published successfully.'), { variant: 'success' });
      } catch (apiError) {
        enqueueSnackbar(apiError?.response?.data?.message || t('vodPosts.errors.publish', 'Could not publish this VOD draft.'), {
          variant: 'error'
        });
      }
    },
    [enqueueSnackbar, runPostAction, t]
  );

  const catalogHeadline = useMemo(() => {
    if (!catalogPayload?.sourceFeedId) return null;
    return t('vodPosts.catalog.feedSnapshot', {
      defaultValue: 'Active feed #{{id}} · Updated {{date}}',
      id: catalogPayload.sourceFeedId,
      date: formatDateTime(catalogPayload.sourceFeedPublishedAt)
    });
  }, [catalogPayload?.sourceFeedId, catalogPayload?.sourceFeedPublishedAt, t]);

  if (catalogLoading && postsLoading) {
    return <PageLoadingState label={t('vodPosts.loading', 'Loading VOD publishing console...')} />;
  }

  return (
    <>
      <Stack spacing={3}>
        <MainCard
          title={t('menu.moviesSeriesPosts', 'Movies & Series Posts')}
          secondary={
            <Chip
              color="primary"
              icon={<AutoAwesomeOutlinedIcon />}
              label={t('vodPosts.subtitle', 'Manual VOD drafts with preview, approval and publishing flow.')}
            />
          }
        >
          <Stack spacing={3}>
            <Alert severity="info" variant="outlined">
              {t(
                'vodPosts.intro',
                'Build premium VOD posts from the latest active movies or series feed, choose the visual layout and publish with the same editorial flow used by sports automation.'
              )}
            </Alert>

            <Box
              sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: {
                  xs: '1fr',
                  md: 'repeat(2, minmax(0, 1fr))',
                  xl: 'repeat(4, minmax(0, 1fr))'
                }
              }}
            >
              <VodMetricCard
                icon={SmartDisplayOutlinedIcon}
                label={t('vodPosts.kpis.catalogItems', 'Catalog titles')}
                value={catalogPayload?.total || 0}
                helper={catalogHeadline || t('vodPosts.kpis.catalogItemsHelper', 'Available titles in the latest active feed.')}
                color="primary"
              />
              <VodMetricCard
                icon={ViewComfyOutlinedIcon}
                label={t('vodPosts.kpis.drafts', 'Drafts')}
                value={stats.total}
                helper={t('vodPosts.kpis.draftsHelper', 'Recent posts stored for this content type.')}
                color="info"
              />
              <VodMetricCard
                icon={CheckCircleOutlineOutlinedIcon}
                label={t('vodPosts.kpis.approved', 'Approved')}
                value={stats.approved}
                helper={t('vodPosts.kpis.approvedHelper', 'Drafts already validated and ready to publish.')}
                color="warning"
              />
              <VodMetricCard
                icon={PublishedWithChangesOutlinedIcon}
                label={t('vodPosts.kpis.published', 'Published')}
                value={stats.published}
                helper={t('vodPosts.kpis.publishedHelper', 'Drafts already sent to the publishing flow.')}
                color="success"
              />
            </Box>
          </Stack>
        </MainCard>

        <MainCard title={t('vodPosts.composer.title', 'VOD composer')}>
          <Stack spacing={3}>
            <Box
              sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: {
                  xs: '1fr',
                  lg: 'repeat(3, minmax(0, 1fr))'
                }
              }}
            >
              <Stack spacing={1.25}>
                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800, letterSpacing: '0.12em' }}>
                  {t('vodPosts.composer.contentType', 'Content type')}
                </Typography>
                <ToggleButtonGroup
                  value={contentType}
                  exclusive
                  onChange={(_, value) => {
                    if (!value) return;
                    setContentType(value);
                    setEditingPost(null);
                    setSelectedItemIds([]);
                  }}
                  color="primary"
                  sx={{ flexWrap: 'wrap', gap: 1 }}
                >
                  {CONTENT_TYPES.map((type) => {
                    const Icon = contentTypeIcon(type);
                    return (
                      <ToggleButton key={type} value={type}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Icon fontSize="small" />
                          <span>{t(`vodPosts.contentTypes.${type.toLowerCase()}`, type)}</span>
                        </Stack>
                      </ToggleButton>
                    );
                  })}
                </ToggleButtonGroup>
              </Stack>

              <Stack spacing={1.25}>
                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800, letterSpacing: '0.12em' }}>
                  {t('vodPosts.composer.layoutMode', 'Layout mode')}
                </Typography>
                <ToggleButtonGroup
                  value={layoutMode}
                  exclusive
                  onChange={(_, value) => {
                    if (!value) return;
                    setLayoutMode(value);
                  }}
                  color="primary"
                  sx={{ flexWrap: 'wrap', gap: 1 }}
                >
                  {LAYOUT_MODES.map((mode) => {
                    const Icon = layoutIcon(mode);
                    return (
                      <ToggleButton key={mode} value={mode}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Icon fontSize="small" />
                          <span>{t(`vodPosts.layouts.${mode.toLowerCase()}`, mode)}</span>
                        </Stack>
                      </ToggleButton>
                    );
                  })}
                </ToggleButtonGroup>
                <Typography variant="body2" color="text.secondary">
                  {t(`vodPosts.layoutHints.${layoutMode.toLowerCase()}`, {
                    defaultValue:
                      layoutMode === 'SINGLE'
                        ? 'One title with dominant poster and premium CTA.'
                        : layoutMode === 'GRID'
                          ? 'A premium poster mosaic for 2 to 6 selected titles.'
                          : 'One main title with a stacked set of supporting titles.'
                  })}
                </Typography>
              </Stack>

              <Stack spacing={1.25}>
                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800, letterSpacing: '0.12em' }}>
                  {t('vodPosts.composer.branding', 'Branding')}
                </Typography>
                {isAdminUser ? (
                  <ToggleButtonGroup
                    value={brandingMode}
                    exclusive
                    onChange={(_, value) => {
                      if (!value) return;
                      setBrandingMode(value);
                    }}
                    color="primary"
                    sx={{ flexWrap: 'wrap', gap: 1 }}
                  >
                    <ToggleButton value={BRANDING_MODE_GENERIC}>{t('vodPosts.branding.modeGeneric', 'Generic watermark')}</ToggleButton>
                    <ToggleButton value={BRANDING_MODE_RESELLER}>{t('vodPosts.branding.modeReseller', 'Reseller watermark')}</ToggleButton>
                  </ToggleButtonGroup>
                ) : (
                  <Chip color="primary" label={t('vodPosts.branding.modeGeneric', 'Generic watermark')} />
                )}

                {!editingPost ? (
                  <FormControlLabel
                    control={<Switch checked={safeModeEnabled} onChange={(event) => setSafeModeEnabled(event.target.checked)} />}
                    label={t('vodPosts.safeMode', 'SAFE mode')}
                  />
                ) : (
                  <Chip
                    size="small"
                    color={editingPost?.safeModeEnabled ? 'success' : 'default'}
                    label={
                      editingPost?.safeModeEnabled
                        ? t('vodPosts.safeModeLocked', 'SAFE mode is enabled for this draft')
                        : t('vodPosts.safeModeUnlocked', 'SAFE mode is disabled for this draft')
                    }
                  />
                )}
              </Stack>
            </Box>

            {resellerBrandingEnabled ? (
              <Autocomplete
                options={resellerOptions}
                value={selectedReseller}
                loading={resellerLookupLoading}
                inputValue={resellerSearchInput}
                onInputChange={(_, value) => setResellerSearchInput(value)}
                onChange={(_, value) => setSelectedReseller(value)}
                getOptionLabel={(option) => resellerOptionLabel(option)}
                isOptionEqualToValue={(option, value) => option?.username === value?.username}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t('vodPosts.branding.resellerLabel', 'Reseller')}
                    placeholder={t('vodPosts.branding.resellerPlaceholder', 'Search by username')}
                    error={Boolean(resellerSelectionError)}
                    helperText={
                      resellerSelectionError ||
                      (selectedReseller?.ready
                        ? t('vodPosts.branding.resellerConfigured', {
                            defaultValue: 'Support phone ready: {{phone}}',
                            phone: selectedReseller.supportPhone
                          })
                        : t('vodPosts.branding.resellerMissing', 'Support phone pending configuration'))
                    }
                  />
                )}
              />
            ) : null}

            {missingSelectedCount > 0 ? (
              <Alert severity="warning" variant="outlined">
                {t('vodPosts.warnings.missingTitles', {
                  defaultValue:
                    '{{count}} selected title(s) no longer exist in the active feed. Keep this draft for preview/publish or replace the selection to refresh it.',
                  count: missingSelectedCount
                })}
              </Alert>
            ) : null}

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.25} alignItems={{ xs: 'stretch', md: 'center' }}>
              <TextField
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                label={t('vodPosts.catalog.search', 'Search title')}
                placeholder={t('vodPosts.catalog.searchPlaceholder', 'Title, year or genre')}
                fullWidth
              />
              <Autocomplete
                options={categoryOptions}
                value={selectedCategoryOption}
                onChange={(_, option) => setSelectedCategory(option?.value || CATEGORY_OPTION_ALL)}
                isOptionEqualToValue={(option, value) => option?.value === value?.value}
                getOptionLabel={(option) => option?.label || ''}
                sx={{ minWidth: { xs: '100%', md: 260 } }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t('vodPosts.catalog.category', 'Category')}
                    placeholder={t('vodPosts.catalog.categoryAll', 'All categories')}
                  />
                )}
              />
              <Chip
                color={selectionValid ? 'success' : 'warning'}
                label={t('vodPosts.composer.selectionCounter', {
                  defaultValue: '{{selected}} selected · required {{min}}-{{max}}',
                  selected: selectionCount,
                  min: layoutRule.min,
                  max: layoutRule.max
                })}
              />
              <Chip
                variant="outlined"
                label={t('vodPosts.catalog.pageSummary', {
                  defaultValue: 'Page {{page}} of {{pages}} · {{count}} visible',
                  page: catalogPage,
                  pages: catalogPageCount,
                  count: filteredCatalogItems.length
                })}
              />
              {hasActiveCatalogFilters ? (
                <Chip
                  variant="outlined"
                  color="info"
                  label={t('vodPosts.catalog.activeFilters', {
                    defaultValue: 'Filters · {{summary}}',
                    summary: activeCatalogFilterSummary
                  })}
                />
              ) : null}
              {editingPost ? (
                <Button variant="text" color="inherit" onClick={clearComposer}>
                  {t('vodPosts.actions.cancelEdit', 'Cancel edit')}
                </Button>
              ) : null}
            </Stack>

            {catalogError ? (
              <PageErrorState message={catalogError} onRetry={loadCatalog} />
            ) : catalogLoading ? (
              <Box
                sx={{
                  display: 'grid',
                  gap: 2,
                  gridTemplateColumns: {
                    xs: 'repeat(2, minmax(0, 1fr))',
                    md: 'repeat(3, minmax(0, 1fr))',
                    xl: 'repeat(6, minmax(0, 1fr))'
                  }
                }}
              >
                {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={index} variant="rounded" sx={{ aspectRatio: '2 / 3', borderRadius: 3 }} />
                ))}
              </Box>
            ) : filteredCatalogItems.length ? (
              <Stack spacing={2}>
                {catalogPageCount > 1 ? (
                  <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={1.25} alignItems={{ xs: 'stretch', md: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      {t(
                        'vodPosts.catalog.selectionPersistence',
                        'Selections stay active across pages. You can mark titles here and continue selecting on the next pages.'
                      )}
                    </Typography>
                    <Pagination
                      color="primary"
                      page={catalogPage}
                      count={catalogPageCount}
                      onChange={(_, value) => setCatalogPage(value)}
                      shape="rounded"
                      siblingCount={0}
                      boundaryCount={1}
                    />
                  </Stack>
                ) : null}

                <Box
                  sx={{
                    display: 'grid',
                    gap: 2,
                    gridTemplateColumns: {
                      xs: 'repeat(2, minmax(0, 1fr))',
                      md: 'repeat(3, minmax(0, 1fr))',
                      xl: 'repeat(6, minmax(0, 1fr))'
                    }
                  }}
                >
                  {paginatedCatalogItems.map((item) => {
                    const selected = selectedItemIds.includes(item.itemId);
                    const disabled = !selected && selectedItemIds.length >= layoutRule.max;
                    return (
                      <CatalogPosterCard
                        key={item.itemId}
                        item={item}
                        selected={selected}
                        disabled={disabled}
                        onToggle={() => handleToggleItem(item.itemId)}
                        contentType={contentType}
                        t={t}
                      />
                    );
                  })}
                </Box>

                {catalogPageCount > 1 ? (
                  <Stack direction="row" justifyContent="center">
                    <Pagination
                      color="primary"
                      page={catalogPage}
                      count={catalogPageCount}
                      onChange={(_, value) => setCatalogPage(value)}
                      shape="rounded"
                    />
                  </Stack>
                ) : null}
              </Stack>
            ) : (
              <PageEmptyState
                message={
                  catalogItems.length
                    ? hasActiveCatalogFilters
                      ? t('vodPosts.empty.filtered', 'No titles match the current filters.')
                      : t('vodPosts.empty.search', 'No titles match the current search.')
                    : t('vodPosts.empty.catalog', 'The active feed does not contain publishable titles yet.')
                }
              />
            )}

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.25} justifyContent="space-between" alignItems={{ xs: 'stretch', md: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {editingPost
                  ? t('vodPosts.composer.editing', {
                      defaultValue: 'Editing draft #{{id}} · changes regenerate the image and captions from the new snapshot.',
                      id: editingPost.id
                    })
                  : t('vodPosts.composer.createHint', 'Select titles, choose the layout and create a premium draft preview.')}
              </Typography>

              <Button
                variant="contained"
                size="large"
                startIcon={<AutoAwesomeOutlinedIcon />}
                onClick={handleSaveComposer}
                disabled={
                  !canGenerate ||
                  savingComposer ||
                  !selectionValid ||
                  (resellerBrandingEnabled && !selectedResellerReady)
                }
              >
                {savingComposer
                  ? t('vodPosts.actions.saving', 'Saving...')
                  : editingPost
                    ? t('vodPosts.actions.updateSelection', 'Update selection')
                    : t('vodPosts.actions.createDraft', 'Create draft')}
              </Button>
            </Stack>
          </Stack>
        </MainCard>

        <MainCard title={t('vodPosts.posts.title', 'Recent VOD drafts')}>
          {postsError ? (
            <PageErrorState message={postsError} onRetry={loadPosts} />
          ) : postsLoading ? (
            <PageLoadingState label={t('vodPosts.posts.loading', 'Loading VOD drafts...')} />
          ) : Array.isArray(postsPayload?.posts) && postsPayload.posts.length ? (
            <Box
              sx={{
                display: 'grid',
                gap: 2.5,
                gridTemplateColumns: {
                  xs: '1fr',
                  xl: 'repeat(2, minmax(0, 1fr))'
                }
              }}
            >
              {postsPayload.posts.map((post) => (
                <VodPostCard
                  key={post.id}
                  post={post}
                  t={t}
                  canGenerate={canGenerate}
                  canApprove={canApprove}
                  canPublish={canPublish}
                  busyState={busyActions[post.id] || {}}
                  onEditSelection={() => handleEditSelection(post)}
                  onPreviewImage={() => handlePreviewImage(post)}
                  onSafePreview={() => handleSafePreview(post)}
                  onRegenerateImage={() => handleRegenerateImage(post)}
                  onRegenerateCaptions={() => handleRegenerateCaptions(post)}
                  onApprove={() => handleApprove(post)}
                  onPublish={() => handlePublish(post)}
                />
              ))}
            </Box>
          ) : (
            <PageEmptyState message={t('vodPosts.empty.posts', 'No VOD drafts have been created for this content type yet.')} />
          )}
        </MainCard>
      </Stack>

      <Dialog open={previewDialog.open} onClose={closePreviewDialog} fullWidth maxWidth="lg">
        <DialogTitleWithClose onClose={closePreviewDialog}>
          {t('vodPosts.previewDialog.title', 'Rendered image preview')}
        </DialogTitleWithClose>
        <DialogContent dividers>
          {previewDialog.loading ? (
            <PageLoadingState label={t('vodPosts.previewDialog.loading', 'Loading rendered image...')} />
          ) : previewDialog.error ? (
            <PageErrorState message={previewDialog.error} />
          ) : (
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                <Chip
                  color={statusColor(previewDialog.post?.status)}
                  label={t(`vodPosts.status.${String(previewDialog.post?.status || '').toLowerCase()}`, previewDialog.post?.status)}
                />
                <Chip label={t(`vodPosts.layouts.${String(previewDialog.post?.layoutMode || '').toLowerCase()}`, previewDialog.post?.layoutMode)} />
                <Chip
                  color={previewDialog.post?.brandingMode === BRANDING_MODE_RESELLER ? 'secondary' : 'default'}
                  label={
                    previewDialog.post?.brandingMode === BRANDING_MODE_RESELLER
                      ? t('vodPosts.branding.modeReseller', 'Reseller watermark')
                      : t('vodPosts.branding.modeGeneric', 'Generic watermark')
                  }
                />
              </Stack>
              <Box
                component="img"
                src={previewDialog.url}
                alt={previewDialog.post?.title || t('vodPosts.previewDialog.alt', 'Generated VOD post')}
                sx={{
                  width: '100%',
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closePreviewDialog}>{t('common.close', 'Close')}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={safePreviewDialog.open} onClose={closeSafePreviewDialog} fullWidth maxWidth="md">
        <DialogTitleWithClose onClose={closeSafePreviewDialog}>
          {t('vodPosts.safePreviewDialog.title', 'SAFE preview')}
        </DialogTitleWithClose>
        <DialogContent dividers>
          {safePreviewDialog.loading ? (
            <PageLoadingState label={t('vodPosts.safePreviewDialog.loading', 'Loading SAFE preview...')} />
          ) : safePreviewDialog.error ? (
            <PageErrorState message={safePreviewDialog.error} />
          ) : (
            <Stack spacing={2.5}>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                <Chip color="success" label={safePreviewDialog.data?.safeModeEnabled ? t('vodPosts.safeMode', 'SAFE mode') : t('vodPosts.safeModeOff', 'SAFE mode disabled')} />
                <Chip
                  color={safePreviewDialog.data?.brandingMode === BRANDING_MODE_RESELLER ? 'secondary' : 'default'}
                  label={
                    safePreviewDialog.data?.brandingMode === BRANDING_MODE_RESELLER
                      ? t('vodPosts.branding.modeReseller', 'Reseller watermark')
                      : t('vodPosts.branding.modeGeneric', 'Generic watermark')
                  }
                />
                {safePreviewDialog.data?.targetResellerUsername ? (
                  <Chip
                    size="small"
                    variant="outlined"
                    label={t('vodPosts.safePreviewDialog.phone', {
                      defaultValue: 'Support {{phone}}',
                      phone: safePreviewDialog.data.targetResellerPhoneMasked || '***'
                    })}
                  />
                ) : null}
              </Stack>

              <Alert severity="info" variant="outlined">
                {t(
                  'vodPosts.safePreviewDialog.helper',
                  'Use this view to confirm the sanitized caption before approving or publishing the VOD post.'
                )}
              </Alert>

              <Divider />

              <Stack spacing={1}>
                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800, letterSpacing: '0.12em' }}>
                  {t('vodPosts.safePreviewDialog.caption', 'Sanitized caption')}
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {safePreviewDialog.data?.caption || '-'}
                </Typography>
              </Stack>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeSafePreviewDialog}>{t('common.close', 'Close')}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
