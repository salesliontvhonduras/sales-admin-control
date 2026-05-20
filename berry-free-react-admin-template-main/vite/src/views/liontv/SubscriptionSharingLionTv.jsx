import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import useAuth from 'hooks/useAuth';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import Skeleton from '@mui/material/Skeleton';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import HubIcon from '@mui/icons-material/Hub';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import LinkIcon from '@mui/icons-material/Link';
import RuleIcon from '@mui/icons-material/Rule';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import BlockIcon from '@mui/icons-material/Block';
import TuneIcon from '@mui/icons-material/Tune';
import ViewTimelineIcon from '@mui/icons-material/ViewTimeline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import MainCard from 'ui-component/cards/MainCard';
import DialogTitleWithClose from 'ui-component/dialogs/DialogTitleWithClose';
import ResponsiveFilters from 'ui-component/responsive/ResponsiveFilters';
import ResponsiveMetricGrid from 'ui-component/responsive/ResponsiveMetricGrid';
import { lionTvApi } from 'utils/api';
import { withAlpha } from 'utils/colorUtils';

function normalizeRow(item = {}) {
  return {
    subscriptionId: item.subscriptionId ?? null,
    customerId: item.customerId ?? null,
    customerName: item.customerName ?? item.customer_name ?? '-',
    lineId: item.lineId ?? '-',
    lineName: item.lineName ?? item.line_name ?? '',
    linePlusId: item.linePlusId ?? '-',
    provider: item.provider ?? '-',
    packageId: item.packageId ?? null,
    packageName: item.packageName ?? item.package_name ?? '',
    packageType: item.packageType ?? item.package_type ?? '',
    packageDescription: item.packageDescription ?? item.package_description ?? '',
    subscriptionStatus: String(item.subscriptionStatus || item.status || '').toUpperCase(),
    billing: item.billing ?? '-',
    startDate: item.startDate ?? null,
    renewalDate: item.renewalDate ?? null,
    renewalDayOfMonth: item.renewalDayOfMonth != null ? Number(item.renewalDayOfMonth) : null,
    termMonths: Number(item.termMonths || 0),
    activatedScreens: Number(item.activatedScreens || 0),
    estimatedCustomerUsage: Number(item.estimatedCustomerUsage || 0),
    availableCapacity: Number(item.availableCapacity || 0),
    eligible: Boolean(item.eligible),
    eligibilityReason: String(item.eligibilityReason || 'ELIGIBLE').toUpperCase(),
    minimumEligibleMonths: Number(item.minimumEligibleMonths || 3),
    sharingRole: String(item.sharingRole || 'NONE').toUpperCase(),
    rolePreference: String(item.rolePreference || 'AUTO').toUpperCase(),
    sharedCluster: Boolean(item.sharedCluster),
    sharedHostSubscriptionId: item.sharedHostSubscriptionId ?? null,
    sharedClusterSize: Number(item.sharedClusterSize || 0),
    hostRenewalDate: item.hostRenewalDate ?? item.renewalDate ?? null,
    hostRenewalDayOfMonth: item.hostRenewalDayOfMonth != null ? Number(item.hostRenewalDayOfMonth) : null,
    hostDaysToRenewal: item.hostDaysToRenewal != null ? Number(item.hostDaysToRenewal) : null,
    hostRiskBucket: String(item.hostRiskBucket || 'UNKNOWN').toUpperCase(),
    hostAtRisk: Boolean(item.hostAtRisk),
    alignedWithHost: Boolean(item.alignedWithHost),
    alignmentStatus: String(item.alignmentStatus || '').toUpperCase(),
    alignmentReason: String(item.alignmentReason || '').toUpperCase(),
    requiredScreensToMove: item.requiredScreensToMove != null ? Number(item.requiredScreensToMove) : null,
    moveRecommendationAvailable: Boolean(item.moveRecommendationAvailable),
    moveRecommendationPriority: String(item.moveRecommendationPriority || 'NONE').toUpperCase(),
    moveRecommendationReason: String(item.moveRecommendationReason || '').toUpperCase(),
    recommendedDestinationSubscriptionId: item.recommendedDestinationSubscriptionId ?? null,
    recommendedDestinationCustomerId: item.recommendedDestinationCustomerId ?? null,
    recommendedDestinationCustomerName: item.recommendedDestinationCustomerName ?? '-',
    recommendedDestinationLineId: item.recommendedDestinationLineId ?? null,
    recommendedDestinationLineName: item.recommendedDestinationLineName ?? '',
    recommendedDestinationLinePlusId: item.recommendedDestinationLinePlusId ?? null,
    recommendedDestinationHostRenewalDate: item.recommendedDestinationHostRenewalDate ?? null,
    recommendedDestinationHostRenewalDayOfMonth:
      item.recommendedDestinationHostRenewalDayOfMonth != null ? Number(item.recommendedDestinationHostRenewalDayOfMonth) : null,
    recommendedDestinationHostDaysToRenewal:
      item.recommendedDestinationHostDaysToRenewal != null ? Number(item.recommendedDestinationHostDaysToRenewal) : null,
    recommendedDestinationHostRiskBucket: String(item.recommendedDestinationHostRiskBucket || 'UNKNOWN').toUpperCase()
  };
}

function normalizeDiagnostics(item = {}) {
  return {
    subscriptionId: item.subscriptionId ?? null,
    customerId: item.customerId ?? null,
    customerName: item.customerName ?? item.customer_name ?? '-',
    lineId: item.lineId ?? '-',
    lineName: item.lineName ?? item.line_name ?? '',
    linePlusId: item.linePlusId ?? '-',
    provider: item.provider ?? '-',
    packageId: item.packageId ?? null,
    packageName: item.packageName ?? item.package_name ?? '',
    packageType: item.packageType ?? item.package_type ?? '',
    packageDescription: item.packageDescription ?? item.package_description ?? '',
    subscriptionStatus: String(item.subscriptionStatus || item.status || '').toUpperCase(),
    billing: item.billing ?? '-',
    startDate: item.startDate ?? null,
    renewalDate: item.renewalDate ?? null,
    renewalDayOfMonth: item.renewalDayOfMonth != null ? Number(item.renewalDayOfMonth) : null,
    termMonths: Number(item.termMonths || 0),
    minimumEligibleMonths: Number(item.minimumEligibleMonths || 3),
    activatedScreens: Number(item.activatedScreens || 0),
    estimatedUsage: Number(item.estimatedUsage || item.estimatedCustomerUsage || 0),
    availableCapacity: Number(item.availableCapacity || 0),
    sharingActive: Boolean(item.sharingActive),
    eligible: Boolean(item.eligible),
    eligibilityReason: String(item.eligibilityReason || 'ELIGIBLE').toUpperCase(),
    sharingRole: String(item.sharingRole || 'NONE').toUpperCase(),
    rolePreference: String(item.rolePreference || 'AUTO').toUpperCase(),
    sharedCluster: Boolean(item.sharedCluster),
    sharedHostSubscriptionId: item.sharedHostSubscriptionId ?? null,
    sharedClusterSize: Number(item.sharedClusterSize || 0),
    hostRenewalDate: item.hostRenewalDate ?? item.renewalDate ?? null,
    hostRenewalDayOfMonth: item.hostRenewalDayOfMonth != null ? Number(item.hostRenewalDayOfMonth) : null,
    hostDaysToRenewal: item.hostDaysToRenewal != null ? Number(item.hostDaysToRenewal) : null,
    hostRiskBucket: String(item.hostRiskBucket || 'UNKNOWN').toUpperCase(),
    hostAtRisk: Boolean(item.hostAtRisk),
    alignedWithHost: Boolean(item.alignedWithHost),
    alignmentStatus: String(item.alignmentStatus || '').toUpperCase(),
    alignmentReason: String(item.alignmentReason || '').toUpperCase(),
    requiredScreensToMove: item.requiredScreensToMove != null ? Number(item.requiredScreensToMove) : null,
    moveRecommendationAvailable: Boolean(item.moveRecommendationAvailable),
    moveRecommendationPriority: String(item.moveRecommendationPriority || 'NONE').toUpperCase(),
    moveRecommendationReason: String(item.moveRecommendationReason || '').toUpperCase(),
    recommendedDestinationSubscriptionId: item.recommendedDestinationSubscriptionId ?? null,
    recommendedDestinationCustomerId: item.recommendedDestinationCustomerId ?? null,
    recommendedDestinationCustomerName: item.recommendedDestinationCustomerName ?? '-',
    recommendedDestinationLineId: item.recommendedDestinationLineId ?? null,
    recommendedDestinationLineName: item.recommendedDestinationLineName ?? '',
    recommendedDestinationLinePlusId: item.recommendedDestinationLinePlusId ?? null,
    recommendedDestinationHostRenewalDate: item.recommendedDestinationHostRenewalDate ?? null,
    recommendedDestinationHostRenewalDayOfMonth:
      item.recommendedDestinationHostRenewalDayOfMonth != null ? Number(item.recommendedDestinationHostRenewalDayOfMonth) : null,
    recommendedDestinationHostDaysToRenewal:
      item.recommendedDestinationHostDaysToRenewal != null ? Number(item.recommendedDestinationHostDaysToRenewal) : null,
    recommendedDestinationHostRiskBucket: String(item.recommendedDestinationHostRiskBucket || 'UNKNOWN').toUpperCase()
  };
}

function normalizeOversoldRow(item = {}) {
  return {
    subscriptionId: item.subscriptionId ?? null,
    customerId: item.customerId ?? null,
    customerName: item.customerName ?? item.customer_name ?? '-',
    lineId: item.lineId ?? '-',
    lineName: item.lineName ?? item.line_name ?? '',
    provider: item.provider ?? '-',
    packageName: item.packageName ?? item.package_name ?? '',
    packageType: item.packageType ?? item.package_type ?? '',
    packageDisplayText: item.packageDisplayText ?? item.package_display_text ?? '',
    packageCapacityToken: String(item.packageCapacityToken || item.package_capacity_token || '').toUpperCase(),
    contractedConnections: Number(item.contractedConnections || item.contracted_connections || 0),
    activeLinkedLicenses: Number(item.activeLinkedLicenses || item.active_linked_licenses || 0),
    oversoldBy: Number(item.oversoldBy || item.oversold_by || 0),
    subscriptionStatus: String(item.subscriptionStatus || item.status || '').toUpperCase(),
    renewalDate: item.renewalDate ?? null,
    sharingRole: String(item.sharingRole || 'NONE').toUpperCase()
  };
}

function normalizeOversoldDetail(item = {}) {
  return {
    ...normalizeOversoldRow(item),
    affectedLicenseCount: Number(item.affectedLicenseCount || item.affected_license_count || 0),
    licenses: Array.isArray(item.licenses)
      ? item.licenses.map((license) => ({
          licenseId: license?.licenseId ?? null,
          macAddress: license?.macAddress ?? license?.mac_address ?? '-',
          app: license?.app ?? '-',
          status: String(license?.status || '').toUpperCase(),
          name: license?.name ?? '-'
        }))
      : []
  };
}

function formatDate(value) {
  if (!value) return '-';
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? String(value) : parsed.toLocaleDateString();
}

function formatLineDisplay(lineName, lineId) {
  const safeLineId = String(lineId || '').trim();
  const safeLineName = String(lineName || '').trim();
  if (!safeLineName || safeLineName === safeLineId) return safeLineId || '-';
  return `${safeLineName} · ${safeLineId}`;
}

function formatPackageDisplay(packageName, packageId) {
  const safePackageName = String(packageName || '').trim();
  if (safePackageName) return safePackageName;
  return packageId != null ? `#${packageId}` : '-';
}

function normalizeFilterValue(value, allowedValues, fallback = 'ALL') {
  const normalized = String(value || '')
    .trim()
    .toUpperCase();
  return allowedValues.includes(normalized) ? normalized : fallback;
}

function parseRenewalDayFilter(value) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 1 && parsed <= 31 ? String(parsed) : 'ALL';
}

function matchesRoleFilter(row, statusFilter) {
  if (!row || statusFilter === 'ALL') return true;
  return String(row.sharingRole || '').toUpperCase() === String(statusFilter || '').toUpperCase();
}

function matchesEligibleFilter(row, eligibleFilter) {
  if (!row || eligibleFilter === 'ALL') return true;
  return eligibleFilter === 'YES' ? Boolean(row.eligible) : !Boolean(row.eligible);
}

function matchesRiskBucketFilter(row, riskBucketFilter) {
  if (!row || riskBucketFilter === 'ALL') return true;
  return String(row.hostRiskBucket || '').toUpperCase() === String(riskBucketFilter || '').toUpperCase();
}

function matchesHostAtRiskFilter(row, atRiskFilter) {
  if (!row || atRiskFilter === 'ALL') return true;
  return atRiskFilter === 'YES' ? Boolean(row.hostAtRisk) : !Boolean(row.hostAtRisk);
}

function matchesHostRenewalDayFilter(row, renewalDayFilter) {
  if (!row || renewalDayFilter === 'ALL') return true;
  return row.hostRenewalDayOfMonth === Number(renewalDayFilter);
}

function matchesOwnRenewalDayFilter(row, ownRenewalDayFilter) {
  if (!row || ownRenewalDayFilter === 'ALL') return true;
  return row.renewalDayOfMonth === Number(ownRenewalDayFilter);
}

function isOperationallyActiveStatus(status) {
  const normalized = String(status || '').toUpperCase();
  return Boolean(normalized) && !['CANCELLED', 'INACTIVE', 'EXPIRED'].includes(normalized);
}

function isCapacityOpportunityRow(row) {
  const normalizedLineId = String(row?.lineId || '').trim();
  return (
    row &&
    row.sharingRole !== 'SHARED' &&
    isOperationallyActiveStatus(row.subscriptionStatus) &&
    normalizedLineId &&
    normalizedLineId !== '-' &&
    Number(row.availableCapacity || 0) > 0
  );
}

function roleColor(role) {
  if (role === 'HOST') return 'warning';
  if (role === 'SHARED') return 'info';
  return 'default';
}

function riskBucketMeta(bucket, t) {
  switch (String(bucket || '').toUpperCase()) {
    case 'OVERDUE':
      return {
        label: t('subscriptionSharing.risk.overdue', 'Overdue'),
        color: 'error'
      };
    case '0_7':
      return {
        label: t('subscriptionSharing.risk.zeroToSeven', '0-7 days'),
        color: 'warning'
      };
    case '8_15':
      return {
        label: t('subscriptionSharing.risk.eightToFifteen', '8-15 days'),
        color: 'info'
      };
    case '16_30':
      return {
        label: t('subscriptionSharing.risk.sixteenToThirty', '16-30 days'),
        color: 'primary'
      };
    case '31_PLUS':
      return {
        label: t('subscriptionSharing.risk.thirtyOnePlus', '31+ days'),
        color: 'success'
      };
    default:
      return {
        label: t('subscriptionSharing.risk.unknown', 'No renewal date'),
        color: 'default'
      };
  }
}

function formatHostRenewalDay(day, t) {
  return day ? t('subscriptionSharing.risk.dayOfMonth', { day, defaultValue: 'Day {{day}}' }) : t('subscriptionSharing.risk.dayUnknown', 'Without date');
}

function formatHostDays(days, t) {
  if (days == null) return t('subscriptionSharing.risk.unknownDays', 'Missing date');
  if (days < 0) return t('subscriptionSharing.risk.overdueDays', { days: Math.abs(days), defaultValue: 'Overdue {{days}}d' });
  if (days === 0) return t('subscriptionSharing.risk.today', 'Due today');
  return t('subscriptionSharing.risk.inDays', { days, defaultValue: 'In {{days}}d' });
}

function subscriptionStatusColor(status) {
  const normalized = String(status || '').toUpperCase();
  if (normalized === 'ACTIVE') return 'success';
  if (normalized === 'PENDING') return 'warning';
  if (normalized === 'CANCELLED' || normalized === 'EXPIRED' || normalized === 'INACTIVE') return 'default';
  return 'info';
}

function eligibilityReasonMeta(reason, minimumEligibleMonths, t) {
  switch (String(reason || '').toUpperCase()) {
    case 'INACTIVE_STATUS':
      return {
        label: t('subscriptionSharing.reason.inactive', 'Inactive'),
        color: 'default'
      };
    case 'TERM_BELOW_MINIMUM':
      return {
        label: t('subscriptionSharing.reason.minimumTerm', {
          count: minimumEligibleMonths || 3,
          defaultValue: 'Minimum {{count}} months'
        }),
        color: 'warning'
      };
    case 'NO_AVAILABLE_CAPACITY':
      return {
        label: t('subscriptionSharing.reason.noCapacity', 'No available capacity'),
        color: 'error'
      };
    default:
      return {
        label: t('subscriptionSharing.card.eligible', 'Eligible'),
        color: 'success'
      };
  }
}

function RoleChip({ role, t }) {
  return (
    <Chip
      size="small"
      label={
        role === 'HOST'
          ? t('subscriptionSharing.role.host', 'HOST')
          : role === 'SHARED'
            ? t('subscriptionSharing.role.shared', 'SHARED')
            : t('subscriptionSharing.role.none', 'NONE')
      }
      color={roleColor(role)}
      variant={role === 'NONE' ? 'outlined' : 'filled'}
      sx={{ fontWeight: 700 }}
    />
  );
}

function StatusChip({ status, t }) {
  return (
    <Chip
      size="small"
      color={subscriptionStatusColor(status)}
      variant="outlined"
      label={`${t('subscriptionSharing.card.status', 'Status')}: ${status || '-'}`}
      sx={{ fontWeight: 700 }}
    />
  );
}

function EligibilityChips({ eligible, eligibilityReason, minimumEligibleMonths, t }) {
  const reason = eligibilityReasonMeta(eligibilityReason, minimumEligibleMonths, t);

  return (
    <Stack direction="row" spacing={0.75} alignItems="center" useFlexGap flexWrap="wrap">
      <Chip
        size="small"
        label={
          eligible
            ? t('subscriptionSharing.card.eligible', 'Eligible')
            : t('subscriptionSharing.card.notEligible', 'Not eligible')
        }
        color={eligible ? 'success' : 'default'}
        variant={eligible ? 'filled' : 'outlined'}
        sx={{ fontWeight: 700 }}
      />
      {!eligible ? <Chip size="small" color={reason.color} variant="outlined" label={reason.label} sx={{ fontWeight: 700 }} /> : null}
    </Stack>
  );
}

function RiskChip({ bucket, t }) {
  const meta = riskBucketMeta(bucket, t);
  return <Chip size="small" color={meta.color} variant="outlined" label={meta.label} sx={{ fontWeight: 700 }} />;
}

function alignmentMeta(status, t) {
  switch (String(status || '').toUpperCase()) {
    case 'ALIGNED':
      return { label: t('subscriptionSharing.alignment.aligned', 'Aligned'), color: 'success' };
    case 'MISALIGNED':
      return { label: t('subscriptionSharing.alignment.misaligned', 'Misaligned'), color: 'warning' };
    case 'NO_HOST_DATE':
      return { label: t('subscriptionSharing.alignment.noHostDate', 'Host date missing'), color: 'default' };
    case 'NO_OWN_DATE':
      return { label: t('subscriptionSharing.alignment.noOwnDate', 'Own date missing'), color: 'default' };
    default:
      return { label: t('subscriptionSharing.alignment.unknown', 'Alignment unknown'), color: 'default' };
  }
}

function alignmentReasonLabel(reason, t) {
  switch (String(reason || '').toUpperCase()) {
    case 'ALREADY_ALIGNED':
      return t('subscriptionSharing.alignmentReason.alreadyAligned', 'Own renewal day already matches the host.');
    case 'HOST_DAY_DIFFERS':
      return t('subscriptionSharing.alignmentReason.hostDayDiffers', 'Own renewal day does not match the current host day.');
    case 'NO_HOST_DATE':
      return t('subscriptionSharing.alignmentReason.noHostDate', 'Current host does not have a renewal date.');
    case 'NO_OWN_DATE':
      return t('subscriptionSharing.alignmentReason.noOwnDate', 'This subscription does not have a renewal date.');
    default:
      return t('subscriptionSharing.alignmentReason.unknown', 'Renewal alignment could not be determined.');
  }
}

function AlignmentChip({ status, t }) {
  const meta = alignmentMeta(status, t);
  return <Chip size="small" color={meta.color} variant="outlined" label={meta.label} sx={{ fontWeight: 700 }} />;
}

function movePriorityMeta(priority, t) {
  switch (String(priority || '').toUpperCase()) {
    case 'URGENT':
      return { label: t('subscriptionSharing.move.priority.urgent', 'Urgent move'), color: 'error' };
    case 'REVIEW':
      return { label: t('subscriptionSharing.move.priority.review', 'Review move'), color: 'warning' };
    default:
      return { label: t('subscriptionSharing.move.priority.none', 'No move'), color: 'default' };
  }
}

function moveReasonLabel(reason, t) {
  switch (String(reason || '').toUpperCase()) {
    case 'RECOMMENDED':
      return t('subscriptionSharing.move.reason.recommended', 'A host with the exact same renewal day is available.');
    case 'ALREADY_ALIGNED':
      return t('subscriptionSharing.move.reason.alreadyAligned', 'This shared subscription is already aligned with its host.');
    case 'MISSING_RENEWAL_DATE':
      return t('subscriptionSharing.move.reason.missingRenewalDate', 'Own renewal day or host renewal day is missing.');
    case 'NO_CAPACITY':
      return t('subscriptionSharing.move.reason.noCapacity', 'The exact-day destination exists, but it does not have enough capacity.');
    case 'INCOMPATIBLE_SERVICE':
      return t('subscriptionSharing.move.reason.incompatibleService', 'Exact-day hosts exist, but they are not compatible by service.');
    case 'NO_EXACT_DAY_HOST':
      return t('subscriptionSharing.move.reason.noExactDayHost', 'No exact-day host or eligible account was found.');
    default:
      return t('subscriptionSharing.move.reason.none', 'No move recommendation yet.');
  }
}

function MovePriorityChip({ priority, t }) {
  const meta = movePriorityMeta(priority, t);
  return <Chip size="small" color={meta.color} variant="outlined" label={meta.label} sx={{ fontWeight: 700 }} />;
}

function RolePreferenceSelector({ value, loading, onChange, t }) {
  return (
    <FormControl size="small" sx={{ minWidth: 140 }}>
      <InputLabel>{t('subscriptionSharing.actions.rolePreference', 'Role')}</InputLabel>
      <Select
        value={value || 'AUTO'}
        label={t('subscriptionSharing.actions.rolePreference', 'Role')}
        onChange={(event) => onChange?.(event.target.value)}
        disabled={loading}
        sx={{ borderRadius: 2 }}
      >
        <MenuItem value="AUTO">{t('subscriptionSharing.actions.roleAuto', 'Auto')}</MenuItem>
        <MenuItem value="HOST">{t('subscriptionSharing.actions.roleHost', 'Host')}</MenuItem>
        <MenuItem value="SHARED">{t('subscriptionSharing.actions.roleShared', 'Shared')}</MenuItem>
      </Select>
    </FormControl>
  );
}

function SectionTitle({ title, count, subtitle }) {
  return (
    <Stack spacing={0.35}>
      <Stack direction="row" spacing={1} alignItems="center" useFlexGap flexWrap="wrap">
        <Typography variant="h4">{title}</Typography>
        <Chip size="small" variant="outlined" label={count} sx={{ fontWeight: 700 }} />
      </Stack>
      {subtitle ? (
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      ) : null}
    </Stack>
  );
}

function KpiCard({ icon, label, value, color }) {
  return (
    <Card
      variant="outlined"
      sx={(theme) => ({
        borderRadius: 3,
        p: 2,
        minHeight: 118,
        borderColor: withAlpha(color, theme.palette.mode === 'dark' ? 0.42 : 0.24),
        backgroundColor: theme.vars?.palette?.surface?.card || theme.palette.background.paper,
        backgroundImage:
          theme.palette.mode === 'dark'
            ? `linear-gradient(145deg, ${withAlpha(color, 0.2)} 0%, ${withAlpha(theme.palette.background.default, 0.88)} 100%)`
            : `linear-gradient(145deg, ${withAlpha(color, 0.12)} 0%, ${theme.palette.background.paper} 100%)`
      })}
    >
      <Stack direction="row" spacing={1.25} alignItems="center">
        <Avatar sx={{ bgcolor: withAlpha(color, 0.22), color }}>{icon}</Avatar>
        <Box>
          <Typography variant="h4" sx={{ lineHeight: 1.1 }}>
            {value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {label}
          </Typography>
        </Box>
      </Stack>
    </Card>
  );
}

function MetricTile({ label, value, helper, color }) {
  return (
    <Card
      variant="outlined"
      sx={(theme) => ({
        borderRadius: 2.5,
        p: 1.35,
        minHeight: 112,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderColor: withAlpha(color || theme.palette.divider, theme.palette.mode === 'dark' ? 0.36 : 0.24),
        backgroundColor: theme.vars?.palette?.surface?.sunken || theme.palette.background.default,
        backgroundImage:
          theme.palette.mode === 'dark'
            ? `linear-gradient(160deg, ${withAlpha(color || theme.palette.primary.main, 0.12)} 0%, ${withAlpha(
                theme.vars?.palette?.surface?.sunken || theme.palette.background.default,
                0.96
              )} 100%)`
            : `linear-gradient(160deg, ${withAlpha(color || theme.palette.primary.main, 0.08)} 0%, ${theme.vars?.palette?.surface?.sunken || theme.palette.background.default} 100%)`
      })}
    >
      <Stack spacing={0.5} sx={{ height: '100%', justifyContent: 'space-between' }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
          {label}
        </Typography>
        <Typography variant="h5" sx={{ mt: 0.35, lineHeight: 1.1 }}>
          {value}
        </Typography>
        {helper ? (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              mt: 0.35,
              minHeight: 34,
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2
            }}
          >
            {helper}
          </Typography>
        ) : null}
      </Stack>
    </Card>
  );
}

function InlineMetric({ label, value, helper, color }) {
  return (
    <Box
      sx={(theme) => ({
        minHeight: 78,
        px: 1.15,
        py: 1,
        borderRadius: 2,
        border: '1px solid',
        borderColor: withAlpha(color || theme.palette.divider, theme.palette.mode === 'dark' ? 0.28 : 0.18),
        bgcolor: theme.vars?.palette?.surface?.sunken || theme.palette.background.default,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      })}
    >
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, lineHeight: 1.15 }}>
        {label}
      </Typography>
      <Typography variant="h6" sx={{ mt: 0.25, lineHeight: 1.15, fontWeight: 800 }}>
        {value}
      </Typography>
      {helper ? (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            mt: 0.25,
            display: '-webkit-box',
            overflow: 'hidden',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2
          }}
        >
          {helper}
        </Typography>
      ) : null}
    </Box>
  );
}

function OperationalSubscriptionRow({ row, mode, t, theme, onViewDiagnostics }) {
  const slotValue = String(row.availableCapacity || 0);
  const usageValue = `${row.estimatedCustomerUsage || 0} / ${row.activatedScreens || 0}`;
  const termValue = t('subscriptionSharing.card.termValue', {
    months: row.termMonths || 0,
    defaultValue: '{{months}} months'
  });
  const accent = mode === 'pending' ? theme.palette.info.main : theme.palette.success.main;
  const lineMeta = [
    `${t('subscriptionSharing.card.line', 'Line')}: ${formatLineDisplay(row.lineName, row.lineId)}`,
    row.linePlusId && row.linePlusId !== '-' ? `${t('subscriptionSharing.card.linePlus', 'Line plus')}: ${row.linePlusId}` : null,
    row.provider ? `${t('subscriptionSharing.card.provider', 'Provider')}: ${row.provider}` : null,
    mode === 'capacity'
      ? `${t('subscriptionSharing.actions.rolePreference', 'Role')}: ${
          row.sharingRole === 'HOST'
            ? t('subscriptionSharing.role.host', 'HOST')
            : t('subscriptionSharing.role.none', 'NONE')
        }`
      : null
  ]
    .filter(Boolean)
    .join(' · ');
  const packageMeta = [
    `${t('subscriptionSharing.card.package', 'Package')}: ${formatPackageDisplay(row.packageName, row.packageId)}`,
    row.packageType ? `${t('subscriptionSharing.card.subscriptionType', 'Subscription type')}: ${row.packageType}` : null,
    row.billing ? `${t('subscriptionSharing.capacity.card.billing', 'Billing')}: ${row.billing}` : null
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <Box
      sx={{
        py: 1.35,
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', xl: 'minmax(0, 1fr) auto auto' },
        gap: 1.25,
        alignItems: 'center'
      }}
    >
      <Stack spacing={0.45} sx={{ minWidth: 0 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
          #{row.subscriptionId} · {row.customerName || '-'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 0 }}>
          {lineMeta}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 0 }}>
          {packageMeta}
        </Typography>
        {row.packageDescription ? (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 1
            }}
          >
            {t('subscriptionSharing.card.packageDescription', 'Description')}: {row.packageDescription}
          </Typography>
        ) : null}
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(3, minmax(0, 1fr))', md: 'repeat(3, minmax(110px, 1fr))' },
          gap: 1,
          width: '100%',
          maxWidth: { xs: '100%', xl: 430 }
        }}
      >
        <InlineMetric
          label={
            mode === 'pending'
              ? t('subscriptionSharing.pendingSetup.slots', 'Pending slots')
              : t('subscriptionSharing.capacity.card.availableSlots', 'Available 1-screen slots')
          }
          value={slotValue}
          helper={
            mode === 'pending'
              ? t('subscriptionSharing.pendingSetup.slotsHelper', 'Screens still available to configure for this customer.')
              : t('subscriptionSharing.capacity.card.salesHelper', {
                  count: row.availableCapacity || 0,
                  defaultValue: 'You can place {{count}} sale(s) of 1 screen here'
                })
          }
          color={accent}
        />
        <InlineMetric
          label={t('subscriptionSharing.capacity.card.currentUsage', 'Current usage')}
          value={usageValue}
          helper={t('subscriptionSharing.pendingSetup.usageHelper', 'Configured licenses versus contracted screens.')}
          color={theme.palette.warning.main}
        />
        <InlineMetric
          label={t('subscriptionSharing.card.termLabel', 'Term')}
          value={termValue}
          helper={row.billing || row.packageType || '-'}
          color={theme.palette.primary.main}
        />
      </Box>

      <Button
        size="small"
        variant="outlined"
        onClick={() => onViewDiagnostics(row.subscriptionId)}
        sx={{
          textTransform: 'none',
          fontWeight: 700,
          borderRadius: 2,
          minWidth: { xs: '100%', xl: 148 },
          alignSelf: { xs: 'stretch', xl: 'center' }
        }}
      >
        {t('subscriptionSharing.actions.viewDiagnostics', 'View diagnostics')}
      </Button>
    </Box>
  );
}

export default function SubscriptionSharingLionTv() {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { accessToken } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchParams] = useSearchParams();

  const headers = useMemo(() => ({ Authorization: `Bearer ${accessToken}` }), [accessToken]);

  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(() => normalizeFilterValue(searchParams.get('status'), ['ALL', 'HOST', 'SHARED', 'NONE']));
  const [eligibleFilter, setEligibleFilter] = useState(() => normalizeFilterValue(searchParams.get('eligible'), ['ALL', 'YES', 'NO']));
  const [riskBucketFilter, setRiskBucketFilter] = useState(() =>
    normalizeFilterValue(searchParams.get('riskBucket'), ['ALL', 'OVERDUE', '0_7', '8_15', '16_30', '31_PLUS', 'UNKNOWN'])
  );
  const [atRiskFilter, setAtRiskFilter] = useState(() =>
    normalizeFilterValue(
      searchParams.get('hostAtRisk') === 'true' ? 'YES' : searchParams.get('hostAtRisk') === 'false' ? 'NO' : searchParams.get('hostAtRisk'),
      ['ALL', 'YES', 'NO']
    )
  );
  const [renewalDayFilter, setRenewalDayFilter] = useState(() => parseRenewalDayFilter(searchParams.get('hostRenewalDay')));
  const [ownRenewalDayFilter, setOwnRenewalDayFilter] = useState('ALL');
  const [misalignedFilter, setMisalignedFilter] = useState('ALL');
  const [recommendationFilter, setRecommendationFilter] = useState('ALL');
  const [rows, setRows] = useState([]);
  const [, setKpi] = useState({
    totalSubscriptions: 0,
    activeSubscriptions: 0,
    sharedClusters: 0,
    hostSubscriptions: 0,
    sharedSubscriptions: 0,
    eligibleSubscriptions: 0,
    overdueClusters: 0,
    criticalClusters: 0,
    atRiskSubscriptions: 0
  });
  const [diagnosticsOpen, setDiagnosticsOpen] = useState(false);
  const [diagnosticsLoading, setDiagnosticsLoading] = useState(false);
  const [diagnosticsData, setDiagnosticsData] = useState(null);
  const [roleSavingBySubscriptionId, setRoleSavingBySubscriptionId] = useState({});
  const [moveDialogRow, setMoveDialogRow] = useState(null);
  const [moveSaving, setMoveSaving] = useState(false);
  const [viewTab, setViewTab] = useState('capacity');
  const [oversoldRows, setOversoldRows] = useState([]);
  const [oversoldLoading, setOversoldLoading] = useState(false);
  const [oversoldKpi, setOversoldKpi] = useState({
    oversoldSubscriptions: 0,
    excessLicenses: 0,
    affectedCustomers: 0
  });
  const [oversoldDetailOpen, setOversoldDetailOpen] = useState(false);
  const [oversoldDetailLoading, setOversoldDetailLoading] = useState(false);
  const [oversoldDetailData, setOversoldDetailData] = useState(null);

  const loadOverview = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const res = await lionTvApi.get('/subscription-sharing/v1/overview', {
        headers,
        params: {
          index: 0,
          size: 5000
        },
        skipAuthRedirect: true
      });

      const payload = res?.data?.data ?? res?.data ?? {};
      const rowsPayload = payload.rows ?? {};
      const data = Array.isArray(rowsPayload?.data) ? rowsPayload.data : [];

      setRows(data.map(normalizeRow));
      setKpi({
        totalSubscriptions: Number(payload?.kpi?.totalSubscriptions || 0),
        activeSubscriptions: Number(payload?.kpi?.activeSubscriptions || 0),
        sharedClusters: Number(payload?.kpi?.sharedClusters || 0),
        hostSubscriptions: Number(payload?.kpi?.hostSubscriptions || 0),
        sharedSubscriptions: Number(payload?.kpi?.sharedSubscriptions || 0),
        eligibleSubscriptions: Number(payload?.kpi?.eligibleSubscriptions || 0),
        overdueClusters: Number(payload?.kpi?.overdueClusters || 0),
        criticalClusters: Number(payload?.kpi?.criticalClusters || 0),
        atRiskSubscriptions: Number(payload?.kpi?.atRiskSubscriptions || 0)
      });
    } catch (err) {
      enqueueSnackbar(err?.response?.data?.message || t('subscriptionSharing.errors.loadError', 'Could not load shared overview.'), {
        variant: 'error'
      });
    } finally {
      setLoading(false);
    }
  }, [accessToken, headers, t, enqueueSnackbar]);

  const loadOversoldOverview = useCallback(async () => {
    if (!accessToken) return;
    setOversoldLoading(true);
    try {
      const res = await lionTvApi.get('/subscription-sharing/v1/oversold', {
        headers,
        params: {
          index: 0,
          size: 5000
        },
        skipAuthRedirect: true
      });

      const payload = res?.data?.data ?? res?.data ?? {};
      const rowsPayload = payload.rows ?? {};
      const data = Array.isArray(rowsPayload?.data) ? rowsPayload.data : [];

      setOversoldRows(data.map(normalizeOversoldRow));
      setOversoldKpi({
        oversoldSubscriptions: Number(payload?.kpi?.oversoldSubscriptions || 0),
        excessLicenses: Number(payload?.kpi?.excessLicenses || 0),
        affectedCustomers: Number(payload?.kpi?.affectedCustomers || 0)
      });
    } catch (err) {
      enqueueSnackbar(err?.response?.data?.message || t('subscriptionSharing.errors.loadOversold', 'Could not load oversold subscriptions.'), {
        variant: 'error'
      });
    } finally {
      setOversoldLoading(false);
    }
  }, [accessToken, enqueueSnackbar, headers, t]);

  const loadDiagnostics = useCallback(
    async (subscriptionId) => {
      if (!subscriptionId || !accessToken) return;
      setDiagnosticsOpen(true);
      setDiagnosticsLoading(true);
      setDiagnosticsData(null);
      try {
        const res = await lionTvApi.get(`/subscription-sharing/v1/subscriptions/${subscriptionId}/diagnostics`, {
          headers,
          skipAuthRedirect: true
        });
        const payload = res?.data?.data ?? res?.data ?? {};
        setDiagnosticsData(normalizeDiagnostics(payload));
      } catch (err) {
        setDiagnosticsData(null);
        enqueueSnackbar(
          err?.response?.data?.message || t('subscriptionSharing.errors.loadDiagnostics', 'Could not load subscription diagnostics.'),
          {
            variant: 'error'
          }
        );
      } finally {
        setDiagnosticsLoading(false);
      }
    },
    [accessToken, enqueueSnackbar, headers, t]
  );

  const loadOversoldDetail = useCallback(
    async (subscriptionId) => {
      if (!subscriptionId || !accessToken) return;
      setOversoldDetailOpen(true);
      setOversoldDetailLoading(true);
      setOversoldDetailData(null);
      try {
        const res = await lionTvApi.get(`/subscription-sharing/v1/subscriptions/${subscriptionId}/oversold-detail`, {
          headers,
          skipAuthRedirect: true
        });
        const payload = res?.data?.data ?? res?.data ?? {};
        setOversoldDetailData(normalizeOversoldDetail(payload));
      } catch (err) {
        setOversoldDetailData(null);
        enqueueSnackbar(
          err?.response?.data?.message || t('subscriptionSharing.errors.loadOversoldDetail', 'Could not load oversold detail.'),
          {
            variant: 'error'
          }
        );
      } finally {
        setOversoldDetailLoading(false);
      }
    },
    [accessToken, enqueueSnackbar, headers, t]
  );

  useEffect(() => {
    if (viewTab === 'oversold') {
      loadOversoldOverview();
      return;
    }
    loadOverview();
  }, [loadOverview, loadOversoldOverview, refreshKey, viewTab]);

  const handleRolePreferenceChange = useCallback(
    async (subscriptionId, sharingRole) => {
      if (!subscriptionId || !accessToken) return;

      setRoleSavingBySubscriptionId((prev) => ({ ...prev, [subscriptionId]: true }));
      try {
        await lionTvApi.patch(
          `/subscription-sharing/v1/subscriptions/${subscriptionId}/role`,
          { sharingRole },
          { headers, skipAuthRedirect: true }
        );

        enqueueSnackbar(t('subscriptionSharing.messages.roleUpdated', 'Sharing role preference updated.'), {
          variant: 'success'
        });

        await loadOverview();
        if (diagnosticsOpen && diagnosticsData?.subscriptionId === subscriptionId) {
          await loadDiagnostics(subscriptionId);
        }
      } catch (err) {
        enqueueSnackbar(
          err?.response?.data?.message || t('subscriptionSharing.errors.updateRole', 'Could not update sharing role preference.'),
          { variant: 'error' }
        );
      } finally {
        setRoleSavingBySubscriptionId((prev) => {
          const next = { ...prev };
          delete next[subscriptionId];
          return next;
        });
      }
    },
    [accessToken, diagnosticsData?.subscriptionId, diagnosticsOpen, enqueueSnackbar, headers, loadDiagnostics, loadOverview, t]
  );

  const handleMoveSubscription = useCallback(async () => {
    if (!moveDialogRow?.subscriptionId || !moveDialogRow?.recommendedDestinationSubscriptionId || !accessToken) return;
    setMoveSaving(true);
    try {
      const res = await lionTvApi.post(
        `/subscription-sharing/v1/subscriptions/${moveDialogRow.subscriptionId}/move`,
        { destinationSubscriptionId: moveDialogRow.recommendedDestinationSubscriptionId },
        { headers, skipAuthRedirect: true }
      );

      const payload = res?.data?.data ?? {};
      enqueueSnackbar(
        t('subscriptionSharing.messages.moveCompleted', {
          sourceId: moveDialogRow.subscriptionId,
          destinationId: payload.destinationSubscriptionId || moveDialogRow.recommendedDestinationSubscriptionId,
          defaultValue: 'Subscription #{{sourceId}} moved to host #{{destinationId}}.'
        }),
        { variant: 'success' }
      );

      setMoveDialogRow(null);
      await loadOverview();
      if (diagnosticsOpen && diagnosticsData?.subscriptionId === moveDialogRow.subscriptionId) {
        await loadDiagnostics(moveDialogRow.subscriptionId);
      }
    } catch (err) {
      enqueueSnackbar(
        err?.response?.data?.message || t('subscriptionSharing.errors.moveSubscription', 'Could not move the shared subscription.'),
        { variant: 'error' }
      );
    } finally {
      setMoveSaving(false);
    }
  }, [accessToken, diagnosticsData?.subscriptionId, diagnosticsOpen, enqueueSnackbar, headers, loadDiagnostics, loadOverview, moveDialogRow, t]);

  const searchedRows = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((row) => {
      return (
        String(row.subscriptionId || '').toLowerCase().includes(term) ||
        String(row.customerName || '').toLowerCase().includes(term) ||
        String(row.lineId || '').toLowerCase().includes(term) ||
        String(row.lineName || '').toLowerCase().includes(term) ||
        String(row.linePlusId || '').toLowerCase().includes(term) ||
        String(row.provider || '').toLowerCase().includes(term) ||
        String(row.packageName || '').toLowerCase().includes(term) ||
        String(row.packageType || '').toLowerCase().includes(term) ||
        String(row.packageDescription || '').toLowerCase().includes(term) ||
        String(row.billing || '').toLowerCase().includes(term) ||
        String(row.subscriptionStatus || '').toLowerCase().includes(term) ||
        String(row.eligibilityReason || '').toLowerCase().includes(term) ||
        String(row.alignmentStatus || '').toLowerCase().includes(term) ||
        String(row.alignmentReason || '').toLowerCase().includes(term) ||
        String(row.hostRiskBucket || '').toLowerCase().includes(term) ||
        String(row.hostRenewalDayOfMonth || '').toLowerCase().includes(term) ||
        String(row.renewalDayOfMonth || '').toLowerCase().includes(term)
      );
    });
  }, [rows, search]);

  const searchedOversoldRows = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return oversoldRows;
    return oversoldRows.filter((row) => {
      return (
        String(row.subscriptionId || '').toLowerCase().includes(term) ||
        String(row.customerId || '').toLowerCase().includes(term) ||
        String(row.customerName || '').toLowerCase().includes(term) ||
        String(row.lineId || '').toLowerCase().includes(term) ||
        String(row.lineName || '').toLowerCase().includes(term) ||
        String(row.provider || '').toLowerCase().includes(term) ||
        String(row.packageName || '').toLowerCase().includes(term) ||
        String(row.packageType || '').toLowerCase().includes(term) ||
        String(row.packageDisplayText || '').toLowerCase().includes(term) ||
        String(row.packageCapacityToken || '').toLowerCase().includes(term) ||
        String(row.subscriptionStatus || '').toLowerCase().includes(term)
      );
    });
  }, [oversoldRows, search]);

  const oversoldSummary = useMemo(() => {
    const affectedCustomers = new Set(
      searchedOversoldRows.map((row) => row.customerId).filter((value) => value != null && value !== '')
    ).size;

    return {
      visibleSubscriptions: searchedOversoldRows.length,
      excessLicenses: searchedOversoldRows.reduce((sum, row) => sum + Math.max(Number(row.oversoldBy || 0), 0), 0),
      affectedCustomers
    };
  }, [searchedOversoldRows]);

  const filteredRows = useMemo(() => {
    return searchedRows.filter((row) => {
      return (
        matchesRoleFilter(row, statusFilter) &&
        matchesEligibleFilter(row, eligibleFilter) &&
        matchesRiskBucketFilter(row, riskBucketFilter) &&
        matchesHostAtRiskFilter(row, atRiskFilter) &&
        matchesHostRenewalDayFilter(row, renewalDayFilter)
      );
    });
  }, [atRiskFilter, eligibleFilter, renewalDayFilter, riskBucketFilter, searchedRows, statusFilter]);

  const alignedRows = useMemo(() => {
    return filteredRows.filter((row) => {
      if (ownRenewalDayFilter !== 'ALL' && row.renewalDayOfMonth !== Number(ownRenewalDayFilter)) {
        return false;
      }
      if (misalignedFilter === 'YES' && !(row.sharingRole === 'SHARED' && row.alignmentStatus === 'MISALIGNED')) {
        return false;
      }
      return true;
    });
  }, [filteredRows, misalignedFilter, ownRenewalDayFilter]);

  const hostRows = useMemo(() => alignedRows.filter((row) => row.sharingRole === 'HOST'), [alignedRows]);
  const eligibleNotSharedRows = useMemo(
    () => (recommendationFilter === 'YES' || misalignedFilter === 'YES' ? [] : alignedRows.filter((row) => row.eligible && row.sharingRole === 'NONE')),
    [alignedRows, misalignedFilter, recommendationFilter]
  );
  const notEligibleRows = useMemo(
    () => (recommendationFilter === 'YES' || misalignedFilter === 'YES' ? [] : alignedRows.filter((row) => !row.eligible && row.sharingRole === 'NONE')),
    [alignedRows, misalignedFilter, recommendationFilter]
  );
  const beneficiariesByHost = useMemo(() => {
    const map = {};
    alignedRows.forEach((row) => {
      if (row.sharingRole !== 'SHARED') return;
      if (recommendationFilter === 'YES' && !row.moveRecommendationAvailable) return;
       if (misalignedFilter === 'YES' && row.alignmentStatus !== 'MISALIGNED') return;
      const hostId = row.sharedHostSubscriptionId;
      if (!hostId) return;
      if (!map[hostId]) map[hostId] = [];
      map[hostId].push(row);
    });
    return map;
  }, [alignedRows, misalignedFilter, recommendationFilter]);

  const filteredSummary = useMemo(
    () => {
      const filteredSharedRows = alignedRows.filter((row) => row.sharingRole === 'SHARED');
      const visibleHostCount =
        recommendationFilter === 'YES' || misalignedFilter === 'YES'
          ? hostRows.filter((row) => (beneficiariesByHost[row.subscriptionId] || []).length > 0).length
          : hostRows.length;
      const visibleBeneficiaries =
        recommendationFilter === 'YES' || misalignedFilter === 'YES'
          ? Object.values(beneficiariesByHost).reduce((sum, items) => sum + items.length, 0)
          : filteredSharedRows.length;

      return {
        total:
          recommendationFilter === 'YES' || misalignedFilter === 'YES'
            ? visibleHostCount + visibleBeneficiaries
            : alignedRows.length,
        hosts: visibleHostCount,
        beneficiaries: visibleBeneficiaries,
        misalignedShared: filteredSharedRows.filter((row) => row.alignmentStatus === 'MISALIGNED').length,
        recommendedMoves: filteredSharedRows.filter((row) => row.moveRecommendationAvailable).length,
        eligibleStandalone: eligibleNotSharedRows.length,
        blockedStandalone: notEligibleRows.length,
        criticalHosts: recommendationFilter === 'YES' || misalignedFilter === 'YES'
          ? hostRows.filter((row) => (beneficiariesByHost[row.subscriptionId] || []).length > 0 && (row.hostRiskBucket === 'OVERDUE' || row.hostRiskBucket === '0_7')).length
          : hostRows.filter((row) => row.hostRiskBucket === 'OVERDUE' || row.hostRiskBucket === '0_7').length,
        overdueHosts: recommendationFilter === 'YES' || misalignedFilter === 'YES'
          ? hostRows.filter((row) => (beneficiariesByHost[row.subscriptionId] || []).length > 0 && row.hostRiskBucket === 'OVERDUE').length
          : hostRows.filter((row) => row.hostRiskBucket === 'OVERDUE').length
      };
    },
    [alignedRows, beneficiariesByHost, eligibleNotSharedRows.length, hostRows, misalignedFilter, notEligibleRows.length, recommendationFilter]
  );

  const hostDayBuckets = useMemo(() => {
    const groups = new Map();

    hostRows.forEach((host) => {
      const key = host.hostRenewalDayOfMonth != null ? String(host.hostRenewalDayOfMonth) : 'UNKNOWN';
      const beneficiaries = (beneficiariesByHost[host.subscriptionId] || []).slice().sort((left, right) => {
        const leftPriority = left.moveRecommendationAvailable ? 0 : 1;
        const rightPriority = right.moveRecommendationAvailable ? 0 : 1;
        if (leftPriority !== rightPriority) return leftPriority - rightPriority;
        return String(left.customerName || '').localeCompare(String(right.customerName || ''));
      });
      if (recommendationFilter === 'YES' && beneficiaries.length === 0) {
        return;
      }
      const current = groups.get(key) || {
        key,
        day: host.hostRenewalDayOfMonth,
        hosts: [],
        hostCount: 0,
        sharedCount: 0,
        misalignedCount: 0,
        recommendedMoves: 0,
        nearestDate: null,
        hasCritical: false,
        hasOverdue: false
      };

      current.hosts.push({ ...host, beneficiaries });
      current.hostCount += 1;
      current.sharedCount += beneficiaries.length;
      current.misalignedCount += beneficiaries.filter((item) => item.alignmentStatus === 'MISALIGNED').length;
      current.recommendedMoves += beneficiaries.filter((item) => item.moveRecommendationAvailable).length;
      current.hasCritical = current.hasCritical || Boolean(host.hostAtRisk);
      current.hasOverdue = current.hasOverdue || host.hostRiskBucket === 'OVERDUE';
      if (host.hostRenewalDate && (!current.nearestDate || new Date(host.hostRenewalDate) < new Date(current.nearestDate))) {
        current.nearestDate = host.hostRenewalDate;
      }

      groups.set(key, current);
    });

    return Array.from(groups.values()).sort((a, b) => {
      if (a.day == null && b.day == null) return 0;
      if (a.day == null) return 1;
      if (b.day == null) return -1;
      return a.day - b.day;
    });
  }, [beneficiariesByHost, hostRows, recommendationFilter]);

  const capacityOpportunityRows = useMemo(() => {
    return searchedRows
      .filter((row) => matchesRoleFilter(row, statusFilter))
      .filter((row) => matchesRiskBucketFilter(row, riskBucketFilter))
      .filter((row) => matchesHostAtRiskFilter(row, atRiskFilter))
      .filter((row) => matchesHostRenewalDayFilter(row, renewalDayFilter))
      .filter((row) => matchesOwnRenewalDayFilter(row, ownRenewalDayFilter))
      .filter(isCapacityOpportunityRow);
  }, [atRiskFilter, ownRenewalDayFilter, renewalDayFilter, riskBucketFilter, searchedRows, statusFilter]);

  const capacitySummary = useMemo(() => {
    return {
      lines: capacityOpportunityRows.length,
      totalSlots: capacityOpportunityRows.reduce((sum, row) => sum + Math.max(Number(row.availableCapacity || 0), 0), 0),
      hostLines: capacityOpportunityRows.filter((row) => row.sharingRole === 'HOST').length,
      standaloneLines: capacityOpportunityRows.filter((row) => row.sharingRole === 'NONE').length
    };
  }, [capacityOpportunityRows]);

  const pendingSetupRows = useMemo(() => {
    return searchedRows
      .filter((row) => matchesHostRenewalDayFilter(row, renewalDayFilter))
      .filter((row) => matchesOwnRenewalDayFilter(row, ownRenewalDayFilter))
      .filter((row) => isOperationallyActiveStatus(row.subscriptionStatus))
      .filter((row) => row.sharingRole === 'NONE')
      .filter((row) => Number(row.availableCapacity || 0) > 0)
      .sort((left, right) => {
        const leftDay = left.renewalDayOfMonth ?? 99;
        const rightDay = right.renewalDayOfMonth ?? 99;
        if (leftDay !== rightDay) return leftDay - rightDay;
        const slotDiff = Number(right.availableCapacity || 0) - Number(left.availableCapacity || 0);
        if (slotDiff !== 0) return slotDiff;
        return String(left.customerName || '').localeCompare(String(right.customerName || ''));
      });
  }, [ownRenewalDayFilter, renewalDayFilter, searchedRows]);

  const pendingSetupDayBuckets = useMemo(() => {
    const groups = new Map();

    pendingSetupRows.forEach((row) => {
      const day = row.renewalDayOfMonth ?? null;
      const key = day != null ? String(day) : 'UNKNOWN';
      const current = groups.get(key) || {
        key,
        day,
        rows: [],
        customerCount: 0,
        totalSlots: 0,
        nearestDate: null
      };

      current.rows.push(row);
      current.customerCount += 1;
      current.totalSlots += Math.max(Number(row.availableCapacity || 0), 0);

      if (row.renewalDate && (!current.nearestDate || new Date(row.renewalDate) < new Date(current.nearestDate))) {
        current.nearestDate = row.renewalDate;
      }

      groups.set(key, current);
    });

    return Array.from(groups.values()).sort((a, b) => {
      if (a.day == null && b.day == null) return 0;
      if (a.day == null) return 1;
      if (b.day == null) return -1;
      return a.day - b.day;
    });
  }, [pendingSetupRows]);

  const capacityDayBuckets = useMemo(() => {
    const groups = new Map();

    capacityOpportunityRows.forEach((row) => {
      const day = row.renewalDayOfMonth ?? row.hostRenewalDayOfMonth ?? null;
      const key = day != null ? String(day) : 'UNKNOWN';
      const current = groups.get(key) || {
        key,
        day,
        rows: [],
        lineCount: 0,
        totalSlots: 0,
        hostCount: 0,
        standaloneCount: 0,
        nearestDate: null
      };

      current.rows.push(row);
      current.lineCount += 1;
      current.totalSlots += Math.max(Number(row.availableCapacity || 0), 0);
      current.hostCount += row.sharingRole === 'HOST' ? 1 : 0;
      current.standaloneCount += row.sharingRole === 'NONE' ? 1 : 0;

      const renewalDate = row.renewalDate ?? row.hostRenewalDate ?? null;
      if (renewalDate && (!current.nearestDate || new Date(renewalDate) < new Date(current.nearestDate))) {
        current.nearestDate = renewalDate;
      }

      groups.set(key, current);
    });

    return Array.from(groups.values())
      .map((bucket) => ({
        ...bucket,
        rows: bucket.rows.slice().sort((left, right) => {
          const slotDiff = Number(right.availableCapacity || 0) - Number(left.availableCapacity || 0);
          if (slotDiff !== 0) return slotDiff;
          const roleDiff = (left.sharingRole === 'HOST' ? 0 : 1) - (right.sharingRole === 'HOST' ? 0 : 1);
          if (roleDiff !== 0) return roleDiff;
          return String(left.customerName || '').localeCompare(String(right.customerName || ''));
        })
      }))
      .sort((a, b) => {
        if (a.day == null && b.day == null) return 0;
        if (a.day == null) return 1;
        if (b.day == null) return -1;
        return a.day - b.day;
      });
  }, [capacityOpportunityRows]);

  const sectionCardSx = {
    borderRadius: 3,
    border: '1px solid',
    borderColor: 'divider',
    bgcolor: 'background.paper',
    p: { xs: 1.5, sm: 2 }
  };
  const diagnosticsSurfaceSx = {
    borderRadius: 3,
    border: '1px solid',
    borderColor: 'divider',
    bgcolor: 'background.paper',
    p: { xs: 1.5, sm: 2 }
  };

  const dashboardKpis = useMemo(() => {
    if (viewTab === 'capacity') {
      return [
        {
          icon: <CalendarMonthIcon />,
          label: t('subscriptionSharing.kpi.renewalBuckets', 'Renewal buckets'),
          value: capacityDayBuckets.length,
          color: theme.vars?.palette?.info?.main || theme.palette.info.main
        },
        {
          icon: <ViewTimelineIcon />,
          label: t('subscriptionSharing.kpi.capacityLines', 'Lines with space'),
          value: capacitySummary.lines,
          color: theme.vars?.palette?.primary?.main || theme.palette.primary.main
        },
        {
          icon: <SignalCellularAltIcon />,
          label: t('subscriptionSharing.kpi.capacitySlots', '1-screen slots'),
          value: capacitySummary.totalSlots,
          color: theme.vars?.palette?.success?.main || theme.palette.success.main
        },
        {
          icon: <TuneIcon />,
          label: t('subscriptionSharing.kpi.pendingSetupCustomers', 'Pending setup'),
          value: pendingSetupRows.length,
          color: theme.vars?.palette?.warning?.main || theme.palette.warning.main
        }
      ];
    }

    if (viewTab === 'oversold') {
      return [
        {
          icon: <WarningAmberIcon />,
          label: t('subscriptionSharing.kpi.oversoldSubscriptions', 'Oversold subscriptions'),
          value: search.trim() ? oversoldSummary.visibleSubscriptions : oversoldKpi.oversoldSubscriptions,
          color: theme.vars?.palette?.warning?.main || theme.palette.warning.main
        },
        {
          icon: <SignalCellularAltIcon />,
          label: t('subscriptionSharing.kpi.excessLicenses', 'Excess licenses'),
          value: search.trim() ? oversoldSummary.excessLicenses : oversoldKpi.excessLicenses,
          color: theme.vars?.palette?.error?.main || theme.palette.error.main
        },
        {
          icon: <GroupWorkIcon />,
          label: t('subscriptionSharing.kpi.affectedCustomers', 'Affected customers'),
          value: search.trim() ? oversoldSummary.affectedCustomers : oversoldKpi.affectedCustomers,
          color: theme.vars?.palette?.info?.main || theme.palette.info.main
        }
      ];
    }

    return [
      {
        icon: <HubIcon />,
        label: t('subscriptionSharing.kpi.hosts', 'Hosts'),
        value: filteredSummary.hosts,
        color: theme.vars?.palette?.warning?.main || theme.palette.warning.main
      },
      {
        icon: <LinkIcon />,
        label: t('subscriptionSharing.kpi.sharedSubscriptions', 'Shared subscriptions'),
        value: filteredSummary.beneficiaries,
        color: theme.vars?.palette?.info?.main || theme.palette.info.main
      },
      {
        icon: <RuleIcon />,
        label: t('subscriptionSharing.kpi.misalignedShared', 'Misaligned shared'),
        value: filteredSummary.misalignedShared,
        color: theme.vars?.palette?.secondary?.main || theme.palette.secondary.main
      },
      {
        icon: <BlockIcon />,
        label: t('subscriptionSharing.kpi.overdueClusters', 'Overdue hosts'),
        value: filteredSummary.overdueHosts,
        color: theme.vars?.palette?.error?.main || theme.palette.error.main
      },
      {
        icon: <WarningAmberIcon />,
        label: t('subscriptionSharing.kpi.criticalClusters', 'Critical hosts'),
        value: filteredSummary.criticalHosts,
        color: theme.vars?.palette?.warning?.main || theme.palette.warning.main
      },
      {
        icon: <GroupWorkIcon />,
        label: t('subscriptionSharing.kpi.recommendedMoves', 'Recommended moves'),
        value: filteredSummary.recommendedMoves,
        color: theme.vars?.palette?.primary?.main || theme.palette.primary.main
      }
    ];
  }, [
    capacityDayBuckets.length,
    capacitySummary.lines,
    capacitySummary.totalSlots,
    filteredSummary.beneficiaries,
    filteredSummary.criticalHosts,
    filteredSummary.hosts,
    filteredSummary.misalignedShared,
    filteredSummary.overdueHosts,
    filteredSummary.recommendedMoves,
    oversoldKpi.affectedCustomers,
    oversoldKpi.excessLicenses,
    oversoldKpi.oversoldSubscriptions,
    oversoldSummary.affectedCustomers,
    oversoldSummary.excessLicenses,
    oversoldSummary.visibleSubscriptions,
    pendingSetupRows.length,
    search,
    t,
    theme.palette.error.main,
    theme.palette.info.main,
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.vars?.palette?.error?.main,
    theme.vars?.palette?.info?.main,
    theme.vars?.palette?.primary?.main,
    theme.vars?.palette?.secondary?.main,
    theme.vars?.palette?.success?.main,
    theme.vars?.palette?.warning?.main,
    viewTab
  ]);

  const filterSummaryItems = useMemo(() => {
    if (viewTab === 'capacity') {
      return [
        {
          key: 'capacity-lines',
          icon: <ViewTimelineIcon />,
          label: t('subscriptionSharing.capacity.summary.lines', {
            count: capacitySummary.lines,
            defaultValue: 'Lines with space: {{count}}'
          }),
          color: 'default',
          variant: 'filled'
        },
        {
          key: 'capacity-slots',
          icon: <SignalCellularAltIcon />,
          label: t('subscriptionSharing.capacity.summary.slots', {
            count: capacitySummary.totalSlots,
            defaultValue: '1-screen slots: {{count}}'
          }),
          color: 'success',
          variant: 'outlined'
        },
        {
          key: 'pending-setup',
          icon: <TuneIcon />,
          label: t('subscriptionSharing.kpi.pendingSetupCustomers', {
            count: pendingSetupRows.length,
            defaultValue: 'Pending setup: {{count}}'
          }),
          color: 'info',
          variant: 'outlined'
        }
      ];
    }

    if (viewTab === 'oversold') {
      return [
        {
          key: 'oversold-visible',
          icon: <WarningAmberIcon />,
          label: t('subscriptionSharing.oversold.summary.visible', {
            count: oversoldSummary.visibleSubscriptions,
            defaultValue: 'Oversold: {{count}}'
          }),
          color: 'default',
          variant: 'filled'
        },
        {
          key: 'oversold-excess',
          icon: <SignalCellularAltIcon />,
          label: t('subscriptionSharing.oversold.summary.excess', {
            count: oversoldSummary.excessLicenses,
            defaultValue: 'Excess licenses: {{count}}'
          }),
          color: oversoldSummary.excessLicenses > 0 ? 'error' : 'default',
          variant: 'outlined'
        },
        {
          key: 'oversold-customers',
          icon: <GroupWorkIcon />,
          label: t('subscriptionSharing.oversold.summary.customers', {
            count: oversoldSummary.affectedCustomers,
            defaultValue: 'Affected customers: {{count}}'
          }),
          color: oversoldSummary.affectedCustomers > 0 ? 'info' : 'default',
          variant: 'outlined'
        }
      ];
    }

    return [
      {
        key: 'visible-hosts',
        icon: <HubIcon />,
        label: t('subscriptionSharing.filters.hostsVisible', { count: filteredSummary.hosts, defaultValue: 'Hosts: {{count}}' }),
        color: 'default',
        variant: 'filled'
      },
      {
        key: 'visible-shared',
        icon: <LinkIcon />,
        label: t('subscriptionSharing.filters.sharedVisible', {
          count: filteredSummary.beneficiaries,
          defaultValue: 'Shared: {{count}}'
        }),
        color: 'info',
        variant: 'outlined'
      },
      {
        key: 'misaligned',
        icon: <RuleIcon />,
        label: t('subscriptionSharing.filters.misalignedVisible', {
          count: filteredSummary.misalignedShared,
          defaultValue: 'Misaligned: {{count}}'
        }),
        color: filteredSummary.misalignedShared > 0 ? 'warning' : 'default',
        variant: 'outlined'
      },
      {
        key: 'recommended',
        icon: <LinkIcon />,
        label: t('subscriptionSharing.filters.recommendedVisible', {
          count: filteredSummary.recommendedMoves,
          defaultValue: 'Recommended moves: {{count}}'
        }),
        color: filteredSummary.recommendedMoves > 0 ? 'secondary' : 'default',
        variant: 'outlined'
      },
      {
        key: 'overdue',
        icon: <BlockIcon />,
        label: t('subscriptionSharing.filters.overdueVisible', {
          count: filteredSummary.overdueHosts,
          defaultValue: 'Overdue hosts: {{count}}'
        }),
        color: filteredSummary.overdueHosts > 0 ? 'error' : 'default',
        variant: 'outlined'
      }
    ];
  }, [
    capacitySummary.lines,
    capacitySummary.totalSlots,
    filteredSummary.beneficiaries,
    filteredSummary.hosts,
    filteredSummary.misalignedShared,
    filteredSummary.overdueHosts,
    filteredSummary.recommendedMoves,
    oversoldSummary.affectedCustomers,
    oversoldSummary.excessLicenses,
    oversoldSummary.visibleSubscriptions,
    pendingSetupRows.length,
    t,
    viewTab
  ]);

  return (
    <Box sx={{ width: '100%', maxWidth: { xs: '100%', xl: 1450 }, mx: 'auto' }}>
      <MainCard
        title={t('subscriptionSharing.title', 'Shared subscriptions monitoring')}
        secondary={
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => setRefreshKey((prev) => prev + 1)}
            sx={{ borderRadius: 2.5, textTransform: 'none', fontWeight: 700 }}
            fullWidth={isMobile}
          >
            {t('actions.refresh', 'Refresh')}
          </Button>
        }
      >
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {viewTab === 'capacity'
            ? t(
                'subscriptionSharing.capacity.subtitle',
                'Use this operational view to place new 1-screen sales on lines that still have real capacity on that exact renewal day.'
              )
            : viewTab === 'oversold'
              ? t(
                  'subscriptionSharing.oversold.subtitle',
                  'Detect subscriptions where the package contract allows fewer connections than the active linked licenses currently configured.'
                )
            : t(
                'subscriptionSharing.subtitle',
                'Visual monitoring based on subscriptions that reuse the same line_id across different customers.'
              )}
        </Typography>

        <ResponsiveMetricGrid columns={{ xs: 1, md: 2, xl: viewTab === 'capacity' ? 4 : 3 }}>
          {dashboardKpis.map((item) => (
            <KpiCard key={item.label} icon={item.icon} label={item.label} value={item.value} color={item.color} />
          ))}
        </ResponsiveMetricGrid>
      </MainCard>

      <MainCard
        title={
          <SectionTitle
            title={t('subscriptionSharing.filters.title', 'Filters and quick reading')}
            count={viewTab === 'capacity' ? capacitySummary.lines : viewTab === 'oversold' ? oversoldSummary.visibleSubscriptions : filteredSummary.total}
            subtitle={
              viewTab === 'oversold'
                ? t(
                    'subscriptionSharing.oversold.filtersSubtitle',
                    'This tab only uses the global search so you can inspect oversold subscriptions without mixing sharing eligibility filters.'
                  )
                : t(
                    'subscriptionSharing.filters.subtitle',
                    'Use the current filters to isolate hosts, beneficiaries or blocked subscriptions and open diagnostics from the same screen.'
                  )
            }
          />
        }
      >
        <Stack spacing={1.5}>
          <ResponsiveFilters
            paperSx={(muiTheme) => ({
              borderRadius: 2.5,
              borderColor: withAlpha(muiTheme.vars?.palette?.divider || muiTheme.palette.divider, 0.95),
              backgroundColor: muiTheme.vars?.palette?.surface?.sunken || muiTheme.palette.background.default,
              backgroundImage: 'none',
              boxShadow: 'none'
            })}
            sx={{
              flexWrap: 'wrap',
              '& > *': {
                minWidth: 0
              }
            }}
          >
            <TextField
              fullWidth
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('subscriptionSharing.filters.searchPlaceholder', 'Search by subscription, customer, line, provider, status')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                )
              }}
              sx={{
                flex: { xs: '1 1 100%', md: '1 1 320px' },
                minWidth: { xs: '100%', md: 280 }
              }}
            />
            {viewTab !== 'oversold' ? (
            <FormControl size="small" sx={{ minWidth: { xs: '100%', md: 200 }, flex: { md: '0 1 200px' } }}>
              <InputLabel>{t('subscriptionSharing.filters.status', 'Sharing role')}</InputLabel>
              <Select value={statusFilter} label={t('subscriptionSharing.filters.status', 'Sharing role')} onChange={(e) => setStatusFilter(e.target.value)}>
                <MenuItem value="ALL">{t('subscriptionSharing.filters.options.all', 'All')}</MenuItem>
                <MenuItem value="HOST">{t('subscriptionSharing.filters.options.host', 'Host')}</MenuItem>
                <MenuItem value="SHARED">{t('subscriptionSharing.filters.options.shared', 'Shared')}</MenuItem>
                <MenuItem value="NONE">{t('subscriptionSharing.filters.options.none', 'None')}</MenuItem>
              </Select>
            </FormControl>
            ) : null}
            {viewTab !== 'oversold' ? (
            <FormControl size="small" sx={{ minWidth: { xs: '100%', md: 200 }, flex: { md: '0 1 200px' } }}>
              <InputLabel>{t('subscriptionSharing.filters.eligible', 'Eligible')}</InputLabel>
              <Select
                value={eligibleFilter}
                label={t('subscriptionSharing.filters.eligible', 'Eligible')}
                onChange={(e) => setEligibleFilter(e.target.value)}
              >
                <MenuItem value="ALL">{t('subscriptionSharing.filters.eligibleOptions.all', 'All')}</MenuItem>
                <MenuItem value="YES">{t('subscriptionSharing.filters.eligibleOptions.yes', 'Yes')}</MenuItem>
                <MenuItem value="NO">{t('subscriptionSharing.filters.eligibleOptions.no', 'No')}</MenuItem>
              </Select>
            </FormControl>
            ) : null}
            {viewTab !== 'oversold' ? (
            <FormControl size="small" sx={{ minWidth: { xs: '100%', md: 210 }, flex: { md: '0 1 210px' } }}>
              <InputLabel>{t('subscriptionSharing.filters.riskBucket', 'Risk bucket')}</InputLabel>
              <Select
                value={riskBucketFilter}
                label={t('subscriptionSharing.filters.riskBucket', 'Risk bucket')}
                onChange={(e) => setRiskBucketFilter(e.target.value)}
              >
                <MenuItem value="ALL">{t('subscriptionSharing.filters.riskOptions.all', 'All')}</MenuItem>
                <MenuItem value="OVERDUE">{t('subscriptionSharing.risk.overdue', 'Overdue')}</MenuItem>
                <MenuItem value="0_7">{t('subscriptionSharing.risk.zeroToSeven', '0-7 days')}</MenuItem>
                <MenuItem value="8_15">{t('subscriptionSharing.risk.eightToFifteen', '8-15 days')}</MenuItem>
                <MenuItem value="16_30">{t('subscriptionSharing.risk.sixteenToThirty', '16-30 days')}</MenuItem>
                <MenuItem value="31_PLUS">{t('subscriptionSharing.risk.thirtyOnePlus', '31+ days')}</MenuItem>
                <MenuItem value="UNKNOWN">{t('subscriptionSharing.risk.unknown', 'No renewal date')}</MenuItem>
              </Select>
            </FormControl>
            ) : null}
            {viewTab !== 'oversold' ? (
            <FormControl size="small" sx={{ minWidth: { xs: '100%', md: 190 }, flex: { md: '0 1 190px' } }}>
              <InputLabel>{t('subscriptionSharing.filters.atRiskOnly', 'At risk')}</InputLabel>
              <Select value={atRiskFilter} label={t('subscriptionSharing.filters.atRiskOnly', 'At risk')} onChange={(e) => setAtRiskFilter(e.target.value)}>
                <MenuItem value="ALL">{t('subscriptionSharing.filters.atRiskOptions.all', 'All')}</MenuItem>
                <MenuItem value="YES">{t('subscriptionSharing.filters.atRiskOptions.yes', 'Yes')}</MenuItem>
                <MenuItem value="NO">{t('subscriptionSharing.filters.atRiskOptions.no', 'No')}</MenuItem>
              </Select>
            </FormControl>
            ) : null}
            {viewTab !== 'oversold' ? (
            <FormControl size="small" sx={{ minWidth: { xs: '100%', md: 170 }, flex: { md: '0 1 170px' } }}>
              <InputLabel>{t('subscriptionSharing.filters.renewalDay', 'Renewal day')}</InputLabel>
              <Select
                value={renewalDayFilter}
                label={t('subscriptionSharing.filters.renewalDay', 'Renewal day')}
                onChange={(e) => setRenewalDayFilter(e.target.value)}
              >
                <MenuItem value="ALL">{t('subscriptionSharing.filters.renewalDayAll', 'All days')}</MenuItem>
                {Array.from({ length: 31 }, (_, idx) => idx + 1).map((day) => (
                  <MenuItem key={`renewal-day-${day}`} value={String(day)}>
                    {formatHostRenewalDay(day, t)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            ) : null}
            {viewTab !== 'oversold' ? (
            <FormControl size="small" sx={{ minWidth: { xs: '100%', md: 170 }, flex: { md: '0 1 170px' } }}>
              <InputLabel>{t('subscriptionSharing.filters.ownRenewalDay', 'Own renewal day')}</InputLabel>
              <Select
                value={ownRenewalDayFilter}
                label={t('subscriptionSharing.filters.ownRenewalDay', 'Own renewal day')}
                onChange={(e) => setOwnRenewalDayFilter(e.target.value)}
              >
                <MenuItem value="ALL">{t('subscriptionSharing.filters.renewalDayAll', 'All days')}</MenuItem>
                {Array.from({ length: 31 }, (_, idx) => idx + 1).map((day) => (
                  <MenuItem key={`own-renewal-day-${day}`} value={String(day)}>
                    {formatHostRenewalDay(day, t)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            ) : null}
            {viewTab !== 'oversold' ? (
            <FormControl size="small" sx={{ minWidth: { xs: '100%', md: 180 }, flex: { md: '0 1 180px' } }}>
              <InputLabel>{t('subscriptionSharing.filters.misalignedOnly', 'Misaligned')}</InputLabel>
              <Select
                value={misalignedFilter}
                label={t('subscriptionSharing.filters.misalignedOnly', 'Misaligned')}
                onChange={(e) => setMisalignedFilter(e.target.value)}
              >
                <MenuItem value="ALL">{t('subscriptionSharing.filters.misalignedOptions.all', 'All')}</MenuItem>
                <MenuItem value="YES">{t('subscriptionSharing.filters.misalignedOptions.yes', 'Misaligned only')}</MenuItem>
              </Select>
            </FormControl>
            ) : null}
            {viewTab !== 'oversold' ? (
            <FormControl size="small" sx={{ minWidth: { xs: '100%', md: 210 }, flex: { md: '0 1 210px' } }}>
              <InputLabel>{t('subscriptionSharing.filters.recommendedMoves', 'Recommended moves')}</InputLabel>
              <Select
                value={recommendationFilter}
                label={t('subscriptionSharing.filters.recommendedMoves', 'Recommended moves')}
                onChange={(e) => setRecommendationFilter(e.target.value)}
              >
                <MenuItem value="ALL">{t('subscriptionSharing.filters.recommendationOptions.all', 'All')}</MenuItem>
                <MenuItem value="YES">{t('subscriptionSharing.filters.recommendationOptions.yes', 'Recommended only')}</MenuItem>
              </Select>
            </FormControl>
            ) : null}
          </ResponsiveFilters>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} alignItems={{ xs: 'stretch', md: 'center' }} sx={{ mt: 1.5 }}>
            <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
              {filterSummaryItems.map((item) => (
                <Chip
                  key={item.key}
                  size="small"
                  color={item.color}
                  variant={item.variant}
                  icon={item.icon}
                  label={item.label}
                />
              ))}
            </Stack>
            <Box sx={{ flexGrow: 1 }} />
            <Button
              variant="text"
              startIcon={<TuneIcon />}
              onClick={() => {
                setSearch('');
                setStatusFilter('ALL');
                setEligibleFilter('ALL');
                setRiskBucketFilter('ALL');
                setAtRiskFilter('ALL');
                setRenewalDayFilter('ALL');
                setOwnRenewalDayFilter('ALL');
                setMisalignedFilter('ALL');
                setRecommendationFilter('ALL');
              }}
              sx={{ textTransform: 'none', fontWeight: 700, alignSelf: { xs: 'flex-start', md: 'center' } }}
            >
              {t('subscriptionSharing.filters.reset', 'Reset filters')}
            </Button>
          </Stack>

          {viewTab === 'clusters' && filteredSummary.blockedStandalone > 0 ? (
            <Alert severity="warning" sx={{ mt: 1.5 }}>
              {t(
                'subscriptionSharing.filters.blockedHint',
                'There are blocked subscriptions in this view. Open diagnostics to confirm if the cause is inactive status, minimum term or no available capacity.'
              )}
            </Alert>
          ) : viewTab === 'oversold' ? (
            <Alert severity="info" sx={{ mt: 1.5 }}>
              {t(
                'subscriptionSharing.oversold.info',
                'Oversale is calculated by comparing active linked licenses against the 1P..5P token detected in the package text.'
              )}
            </Alert>
          ) : null}
        </Stack>
      </MainCard>

      <MainCard content={false}>
        <Box sx={{ px: { xs: 1.5, sm: 2 }, pt: 1.25, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Tabs
            value={viewTab}
            onChange={(_, nextValue) => setViewTab(nextValue)}
            variant={isMobile ? 'fullWidth' : 'standard'}
            sx={{
              minHeight: 52,
              '& .MuiTab-root': {
                minHeight: 52,
                textTransform: 'none',
                fontWeight: 700
              }
            }}
          >
            <Tab value="capacity" label={t('subscriptionSharing.tabs.capacity', 'Available spaces by day')} />
            <Tab value="clusters" label={t('subscriptionSharing.tabs.clusters', 'Shared clusters')} />
            <Tab value="oversold" label={t('subscriptionSharing.tabs.oversold', 'Oversold subscriptions')} />
          </Tabs>
        </Box>
      </MainCard>

      {viewTab === 'oversold' ? (
        <MainCard
          title={
            <SectionTitle
              title={t('subscriptionSharing.oversold.title', 'Oversold subscriptions by package capacity')}
              count={searchedOversoldRows.length}
              subtitle={t(
                'subscriptionSharing.oversold.listSubtitle',
                'These subscriptions have more active linked licenses than the 1P..5P package token currently contracted.'
              )}
            />
          }
        >
          {oversoldLoading ? (
            <Stack spacing={1.25}>
              {Array.from({ length: 4 }).map((_, idx) => (
                <Skeleton key={`oversold-skel-${idx}`} variant="rounded" height={132} />
              ))}
            </Stack>
          ) : searchedOversoldRows.length === 0 ? (
            <Alert severity="success">
              {t('subscriptionSharing.oversold.empty', 'No oversold subscriptions were found for the current search.')}
            </Alert>
          ) : (
            <Stack spacing={1.5}>
              {searchedOversoldRows.map((row) => (
                <Card
                  key={`oversold-${row.subscriptionId}`}
                  sx={(muiTheme) => ({
                    ...sectionCardSx,
                    borderRadius: 3.25,
                    borderColor: withAlpha(muiTheme.palette.error.main, muiTheme.palette.mode === 'dark' ? 0.28 : 0.2),
                    backgroundImage:
                      muiTheme.palette.mode === 'dark'
                        ? `linear-gradient(160deg, ${withAlpha(muiTheme.palette.error.main, 0.14)} 0%, ${withAlpha(muiTheme.palette.background.paper, 0.96)} 54%)`
                        : `linear-gradient(160deg, ${withAlpha(muiTheme.palette.error.main, 0.08)} 0%, ${muiTheme.palette.background.paper} 54%)`
                  })}
                >
                  <Stack spacing={1.4}>
                    <Stack direction={{ xs: 'column', lg: 'row' }} spacing={1.1} justifyContent="space-between">
                      <Stack spacing={1}>
                        <Stack direction="row" spacing={0.75} alignItems="center" useFlexGap flexWrap="wrap">
                          <Typography variant="h6" sx={{ fontWeight: 800 }}>
                            #{row.subscriptionId} · {row.customerName || '-'}
                          </Typography>
                          <RoleChip role={row.sharingRole} t={t} />
                          <StatusChip status={row.subscriptionStatus} t={t} />
                          <Chip
                            size="small"
                            color="error"
                            variant="filled"
                            label={t('subscriptionSharing.oversold.card.oversoldBy', {
                              count: row.oversoldBy || 0,
                              defaultValue: 'Oversold by {{count}}'
                            })}
                            sx={{ fontWeight: 700 }}
                          />
                        </Stack>
                        <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
                          <Chip
                            size="small"
                            variant="outlined"
                            label={`${t('subscriptionSharing.card.line', 'Line')}: ${formatLineDisplay(row.lineName, row.lineId)}`}
                          />
                          <Chip size="small" variant="outlined" label={`${t('subscriptionSharing.card.provider', 'Provider')}: ${row.provider || '-'}`} />
                          <Chip
                            size="small"
                            variant="outlined"
                            label={`${t('subscriptionSharing.card.package', 'Package')}: ${formatPackageDisplay(row.packageName, row.subscriptionId)}`}
                          />
                          <Chip
                            size="small"
                            color="warning"
                            variant="outlined"
                            label={t('subscriptionSharing.oversold.card.capacityToken', {
                              token: row.packageCapacityToken || '-',
                              defaultValue: 'Token: {{token}}'
                            })}
                          />
                        </Stack>
                        {row.packageDisplayText ? (
                          <Typography variant="body2" color="text.secondary">
                            {t('subscriptionSharing.card.packageDescription', 'Description')}: {row.packageDisplayText}
                          </Typography>
                        ) : null}
                      </Stack>

                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        onClick={() => loadOversoldDetail(row.subscriptionId)}
                        sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2, alignSelf: { xs: 'stretch', lg: 'flex-start' } }}
                      >
                        {t('subscriptionSharing.actions.viewOversoldDetail', 'View oversale detail')}
                      </Button>
                    </Stack>

                    <Grid container spacing={1.25}>
                      <Grid item xs={12} sm={6} md={3}>
                        <MetricTile
                          label={t('subscriptionSharing.oversold.card.contractedConnections', 'Contracted connections')}
                          value={String(row.contractedConnections || 0)}
                          helper={row.packageCapacityToken || '-'}
                          color={theme.palette.primary.main}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <MetricTile
                          label={t('subscriptionSharing.oversold.card.activeLinkedLicenses', 'Active linked licenses')}
                          value={String(row.activeLinkedLicenses || 0)}
                          helper={t('subscriptionSharing.oversold.card.renewalDate', {
                            date: formatDate(row.renewalDate),
                            defaultValue: 'Renewal: {{date}}'
                          })}
                          color={theme.palette.info.main}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <MetricTile
                          label={t('subscriptionSharing.oversold.card.oversoldLabel', 'Excess')}
                          value={String(row.oversoldBy || 0)}
                          helper={t('subscriptionSharing.oversold.card.customerId', {
                            id: row.customerId || '-',
                            defaultValue: 'Customer #{{id}}'
                          })}
                          color={theme.palette.error.main}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <MetricTile
                          label={t('subscriptionSharing.card.subscriptionType', 'Subscription type')}
                          value={row.packageType || '-'}
                          helper={row.sharingRole || '-'}
                          color={theme.palette.warning.main}
                        />
                      </Grid>
                    </Grid>
                  </Stack>
                </Card>
              ))}
            </Stack>
          )}
        </MainCard>
      ) : viewTab === 'clusters' ? (
        <>
      <MainCard
        title={
          <SectionTitle
            title={t('subscriptionSharing.sections.sharedClusters', 'Shared clusters grouped by host renewal day')}
            count={hostDayBuckets.length}
            subtitle={t(
              'subscriptionSharing.sections.sharedClustersHint',
              'Hosts are grouped by their renewal day of month so you can see in advance which shared clusters are affected when a host gets close to expiration.'
            )}
          />
        }
      >
        {loading ? (
          <Stack spacing={1.25}>
            {Array.from({ length: 4 }).map((_, idx) => (
              <Skeleton key={`shared-skel-${idx}`} variant="rounded" height={120} />
            ))}
          </Stack>
        ) : hostDayBuckets.length === 0 ? (
          <Alert severity="info">{t('subscriptionSharing.sections.noSharedClusters', 'No shared clusters found with current filters.')}</Alert>
        ) : (
          <Stack spacing={1.5}>
            {hostDayBuckets.map((bucket) => (
              <Card
                key={`host-day-${bucket.key}`}
                sx={(muiTheme) => ({
                  ...sectionCardSx,
                  borderRadius: 3.5,
                  boxShadow:
                    muiTheme.palette.mode === 'dark'
                      ? '0 18px 34px rgba(2,8,23,0.18)'
                      : '0 12px 26px rgba(15,23,42,0.06)',
                  backgroundImage:
                    bucket.hasOverdue
                      ? `linear-gradient(160deg, ${withAlpha(muiTheme.palette.error.main, muiTheme.palette.mode === 'dark' ? 0.16 : 0.08)} 0%, ${withAlpha(
                          muiTheme.palette.background.paper,
                          0.98
                        )} 54%)`
                      : bucket.hasCritical
                        ? `linear-gradient(160deg, ${withAlpha(muiTheme.palette.warning.main, muiTheme.palette.mode === 'dark' ? 0.16 : 0.08)} 0%, ${withAlpha(
                            muiTheme.palette.background.paper,
                            0.98
                          )} 54%)`
                        : 'none'
                })}
              >
                  <Stack spacing={1.5}>
                    <Stack direction={{ xs: 'column', lg: 'row' }} spacing={1.1} justifyContent="space-between">
                    <Stack spacing={0.6}>
                      <Stack direction="row" spacing={0.75} alignItems="center" useFlexGap flexWrap="wrap">
                        <Avatar sx={{ width: 34, height: 34, bgcolor: bucket.hasCritical ? 'warning.main' : 'primary.main', color: 'common.white' }}>
                          <CalendarMonthIcon fontSize="small" />
                        </Avatar>
                        <Typography variant="h5" sx={{ fontWeight: 800 }}>
                          {formatHostRenewalDay(bucket.day, t)}
                        </Typography>
                        <Chip
                          size="small"
                          variant="outlined"
                          label={t('subscriptionSharing.bucket.hostCount', { count: bucket.hostCount, defaultValue: 'Hosts: {{count}}' })}
                        />
                        <Chip
                          size="small"
                          variant="outlined"
                          color="info"
                          label={t('subscriptionSharing.bucket.sharedCount', { count: bucket.sharedCount, defaultValue: 'Shared: {{count}}' })}
                        />
                        <Chip
                          size="small"
                          variant="outlined"
                          color={bucket.misalignedCount > 0 ? 'warning' : 'default'}
                          label={t('subscriptionSharing.bucket.misalignedCount', {
                            count: bucket.misalignedCount,
                            defaultValue: 'Misaligned: {{count}}'
                          })}
                        />
                        <Chip
                          size="small"
                          variant="outlined"
                          color={bucket.recommendedMoves > 0 ? 'secondary' : 'default'}
                          label={t('subscriptionSharing.bucket.recommendedCount', {
                            count: bucket.recommendedMoves,
                            defaultValue: 'Recommended: {{count}}'
                          })}
                        />
                        {bucket.hasOverdue ? <RiskChip bucket="OVERDUE" t={t} /> : bucket.hasCritical ? <RiskChip bucket="0_7" t={t} /> : null}
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        {bucket.nearestDate
                          ? t('subscriptionSharing.bucket.nearestDate', {
                              date: formatDate(bucket.nearestDate),
                              defaultValue: 'Nearest host renewal: {{date}}'
                            })
                          : t('subscriptionSharing.bucket.nearestDateUnknown', 'Hosts without renewal date in this bucket.')}
                      </Typography>
                    </Stack>
                    {bucket.hasCritical ? (
                      <Alert severity={bucket.hasOverdue ? 'error' : 'warning'} sx={{ py: 0 }}>
                        {bucket.hasOverdue
                          ? t('subscriptionSharing.bucket.overdueAlert', 'This renewal bucket already has overdue hosts affecting shared subscriptions.')
                          : t('subscriptionSharing.bucket.criticalAlert', 'This renewal bucket includes hosts that will affect shared subscriptions within 7 days.')}
                      </Alert>
                    ) : null}
                  </Stack>

                  <Stack spacing={1.25}>
                    {bucket.hosts.map((host) => {
                      const beneficiaries = host.beneficiaries || [];
                      const misalignedBeneficiaries = beneficiaries.filter((item) => item.alignmentStatus === 'MISALIGNED');
                      const alignedBeneficiaries = beneficiaries.filter((item) => item.alignmentStatus !== 'MISALIGNED');
                      const recommendedBeneficiaries = beneficiaries.filter((item) => item.moveRecommendationAvailable);
                      const renderBeneficiarySection = (items, sectionKey, sectionTitle, sectionColor) => {
                        if (!items.length) return null;
                        return (
                          <Stack spacing={1}>
                            <Stack direction="row" spacing={0.75} alignItems="center" useFlexGap flexWrap="wrap">
                              <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                                {sectionTitle}
                              </Typography>
                              <Chip
                                size="small"
                                color={sectionColor}
                                variant="outlined"
                                label={t('subscriptionSharing.card.sectionCount', {
                                  count: items.length,
                                  defaultValue: '{{count}} items'
                                })}
                              />
                            </Stack>
                            <Grid container spacing={1.1}>
                              {items.map((item) => (
                                <Grid item xs={12} lg={6} key={`${sectionKey}-${item.subscriptionId}`}>
                                  <Box
                                    sx={(muiTheme) => ({
                                      p: 1.25,
                                      borderRadius: 2.25,
                                      border: '1px solid',
                                      borderColor:
                                        item.alignmentStatus === 'MISALIGNED'
                                          ? withAlpha(muiTheme.palette.warning.main, muiTheme.palette.mode === 'dark' ? 0.42 : 0.24)
                                          : 'divider',
                                      minHeight: '100%',
                                      height: '100%',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      bgcolor: muiTheme.vars?.palette?.surface?.sunken || muiTheme.palette.background.default,
                                      backgroundImage:
                                        item.alignmentStatus === 'MISALIGNED'
                                          ? `linear-gradient(160deg, ${withAlpha(
                                              muiTheme.palette.warning.main,
                                              muiTheme.palette.mode === 'dark' ? 0.14 : 0.08
                                            )} 0%, ${withAlpha(muiTheme.palette.background.paper, 0.98)} 100%)`
                                          : `linear-gradient(160deg, ${withAlpha(
                                              muiTheme.palette.info.main,
                                              muiTheme.palette.mode === 'dark' ? 0.1 : 0.05
                                            )} 0%, ${withAlpha(muiTheme.palette.background.paper, 0.98)} 100%)`
                                    })}
                                  >
                                    <Stack spacing={1.1} sx={{ height: '100%', justifyContent: 'space-between' }}>
                                      <Stack spacing={1.1}>
                                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={0.9} alignItems={{ xs: 'flex-start', sm: 'center' }} useFlexGap flexWrap="wrap">
                                        <Stack direction="row" spacing={0.75} alignItems="center">
                                          <Avatar sx={{ width: 24, height: 24, bgcolor: 'info.main', color: 'info.contrastText' }}>
                                            <LinkIcon fontSize="inherit" />
                                          </Avatar>
                                          <Typography variant="body2" sx={{ fontWeight: 800 }}>
                                            #{item.subscriptionId} · {item.customerName || '-'}
                                          </Typography>
                                        </Stack>
                                        <RoleChip role={item.sharingRole} t={t} />
                                        <AlignmentChip status={item.alignmentStatus} t={t} />
                                        <EligibilityChips
                                          eligible={item.eligible}
                                          eligibilityReason={item.eligibilityReason}
                                          minimumEligibleMonths={item.minimumEligibleMonths}
                                          t={t}
                                        />
                                        <RiskChip bucket={item.hostRiskBucket} t={t} />
                                        <MovePriorityChip priority={item.moveRecommendationPriority} t={t} />
                                        <StatusChip status={item.subscriptionStatus} t={t} />
                                      </Stack>
                                      <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
                                        <Chip
                                          size="small"
                                          color="warning"
                                          variant="outlined"
                                          label={t('subscriptionSharing.card.inheritedRisk', {
                                            hostId: item.sharedHostSubscriptionId || '-',
                                            defaultValue: 'Inherited risk from host #{{hostId}}'
                                          })}
                                        />
                                        <Chip
                                          size="small"
                                          variant="outlined"
                                          label={t('subscriptionSharing.card.ownRenewalDayValue', {
                                            day: formatHostRenewalDay(item.renewalDayOfMonth, t),
                                            defaultValue: 'Own day: {{day}}'
                                          })}
                                        />
                                        <Chip
                                          size="small"
                                          variant="outlined"
                                          label={t('subscriptionSharing.card.currentHostDayValue', {
                                            day: formatHostRenewalDay(item.hostRenewalDayOfMonth, t),
                                            defaultValue: 'Host day: {{day}}'
                                          })}
                                        />
                                        <Chip
                                          size="small"
                                          variant="outlined"
                                          label={`${t('subscriptionSharing.card.line', 'Line')}: ${formatLineDisplay(item.lineName, item.lineId)}`}
                                        />
                                        <Chip
                                          size="small"
                                          variant="outlined"
                                          label={`${t('subscriptionSharing.card.package', 'Package')}: ${formatPackageDisplay(item.packageName, item.packageId)}`}
                                        />
                                        <Chip
                                          size="small"
                                          variant="outlined"
                                          label={`${t('subscriptionSharing.card.subscriptionType', 'Subscription type')}: ${item.packageType || item.billing || '-'}`}
                                        />
                                        {item.moveRecommendationAvailable ? (
                                          <Chip
                                            size="small"
                                            color="secondary"
                                            variant="outlined"
                                            label={t('subscriptionSharing.move.recommendedBadge', 'Recommended move')}
                                          />
                                          ) : null}
                                        </Stack>
                                      {item.packageDescription ? (
                                        <Typography variant="body2" color="text.secondary">
                                          {t('subscriptionSharing.card.packageDescription', 'Description')}: {item.packageDescription}
                                        </Typography>
                                      ) : null}
                                      <Card
                                        variant="outlined"
                                        sx={(muiTheme) => ({
                                          p: 1.1,
                                          borderRadius: 2,
                                          borderColor:
                                            item.moveRecommendationAvailable || item.alignmentStatus === 'MISALIGNED'
                                              ? withAlpha(muiTheme.palette.warning.main, muiTheme.palette.mode === 'dark' ? 0.5 : 0.28)
                                              : 'divider',
                                          bgcolor: muiTheme.vars?.palette?.surface?.card || muiTheme.palette.background.paper
                                        })}
                                      >
                                        <Stack spacing={0.9}>
                                          <Stack direction="row" spacing={0.75} alignItems="center" useFlexGap flexWrap="wrap">
                                            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                                              {t('subscriptionSharing.move.title', 'Move recommendation')}
                                            </Typography>
                                            {item.moveRecommendationAvailable ? <RiskChip bucket={item.recommendedDestinationHostRiskBucket} t={t} /> : null}
                                          </Stack>
                                          <Typography variant="body2" color="text.secondary">
                                            {alignmentReasonLabel(item.alignmentReason, t)}
                                          </Typography>
                                          <Typography variant="body2" color="text.secondary">
                                            {moveReasonLabel(item.moveRecommendationReason, t)}
                                          </Typography>
                                          <Grid container spacing={1}>
                                            <Grid item xs={6} md={4}>
                                              <MetricTile
                                                label={t('subscriptionSharing.card.termLabel', 'Term')}
                                                value={t('subscriptionSharing.card.termValue', {
                                                  months: item.termMonths || 0,
                                                  defaultValue: '{{months}} months'
                                                })}
                                                helper={item.packageType || item.billing || '-'}
                                                color={theme.palette.primary.main}
                                              />
                                            </Grid>
                                            <Grid item xs={6} md={4}>
                                              <MetricTile
                                                label={t('subscriptionSharing.move.requiredScreens', 'Screens to move')}
                                                value={String(item.requiredScreensToMove || 1)}
                                                helper={t('subscriptionSharing.card.capacityShort', {
                                                  available: item.availableCapacity || 0,
                                                  defaultValue: 'Available {{available}}'
                                                })}
                                                color={item.moveRecommendationAvailable ? theme.palette.secondary.main : theme.palette.success.main}
                                              />
                                            </Grid>
                                            <Grid item xs={12} md={4}>
                                              <MetricTile
                                                label={
                                                  item.moveRecommendationAvailable
                                                    ? t('subscriptionSharing.move.recommendedDay', 'Recommended day')
                                                    : t('subscriptionSharing.move.currentDay', 'Current host day')
                                                }
                                                value={
                                                  item.moveRecommendationAvailable
                                                    ? formatHostRenewalDay(item.recommendedDestinationHostRenewalDayOfMonth, t)
                                                    : formatHostRenewalDay(item.hostRenewalDayOfMonth, t)
                                                }
                                                helper={
                                                  item.moveRecommendationAvailable
                                                    ? t('subscriptionSharing.move.recommendedHost', {
                                                        id: item.recommendedDestinationSubscriptionId || '-',
                                                        defaultValue: 'Host #{{id}}'
                                                      })
                                                    : formatHostDays(item.hostDaysToRenewal, t)
                                                }
                                                color={item.moveRecommendationAvailable ? theme.palette.success.main : theme.palette.warning.main}
                                              />
                                            </Grid>
                                          </Grid>
                                          {item.moveRecommendationAvailable ? (
                                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={0.75} useFlexGap flexWrap="wrap">
                                              <Chip
                                                size="small"
                                                variant="outlined"
                                                label={t('subscriptionSharing.move.recommendedCustomer', {
                                                  customer: item.recommendedDestinationCustomerName || '-',
                                                  defaultValue: 'Customer: {{customer}}'
                                                })}
                                              />
                                              <Chip
                                                size="small"
                                                variant="outlined"
                                                label={t('subscriptionSharing.move.recommendedLine', {
                                                  line: formatLineDisplay(item.recommendedDestinationLineName, item.recommendedDestinationLineId),
                                                  defaultValue: 'Line: {{line}}'
                                                })}
                                              />
                                            </Stack>
                                          ) : null}
                                        </Stack>
                                      </Card>
                                      </Stack>
                                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'stretch', sm: 'center' }}>
                                        <RolePreferenceSelector
                                          value={item.rolePreference}
                                          loading={Boolean(roleSavingBySubscriptionId[item.subscriptionId])}
                                          onChange={(value) => handleRolePreferenceChange(item.subscriptionId, value)}
                                          t={t}
                                        />
                                        {item.moveRecommendationAvailable ? (
                                          <Button
                                            size="small"
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => setMoveDialogRow(item)}
                                            sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2, alignSelf: 'flex-start' }}
                                          >
                                            {t('subscriptionSharing.actions.moveToHost', {
                                              id: item.recommendedDestinationSubscriptionId || '-',
                                              defaultValue: 'Move to host #{{id}}'
                                            })}
                                          </Button>
                                        ) : null}
                                        <Button
                                          size="small"
                                          variant="text"
                                          onClick={() => loadDiagnostics(item.subscriptionId)}
                                          sx={{ textTransform: 'none', fontWeight: 700, alignSelf: 'flex-start' }}
                                        >
                                          {t('subscriptionSharing.actions.viewDiagnostics', 'View diagnostics')}
                                        </Button>
                                      </Stack>
                                    </Stack>
                                  </Box>
                                </Grid>
                              ))}
                            </Grid>
                          </Stack>
                        );
                      };
                      return (
                        <Card
                          key={`host-${host.subscriptionId}`}
                          sx={(muiTheme) => ({
                            ...sectionCardSx,
                            borderRadius: 3.25,
                            boxShadow:
                              muiTheme.palette.mode === 'dark'
                                ? '0 16px 30px rgba(2,8,23,0.16)'
                                : '0 10px 24px rgba(15,23,42,0.06)',
                            backgroundImage:
                              muiTheme.palette.mode === 'dark'
                                ? `linear-gradient(160deg, ${withAlpha(muiTheme.palette.warning.main, 0.12)} 0%, ${withAlpha(muiTheme.palette.background.paper, 0.96)} 48%)`
                                : `linear-gradient(160deg, ${withAlpha(muiTheme.palette.warning.main, 0.08)} 0%, ${muiTheme.palette.background.paper} 48%)`
                          })}
                        >
                          <Stack spacing={1.5}>
                            <Stack direction={{ xs: 'column', lg: 'row' }} spacing={1.25} justifyContent="space-between">
                              <Stack spacing={1}>
                                <Stack direction="row" spacing={0.75} alignItems="center" useFlexGap flexWrap="wrap">
                                  <Avatar sx={{ width: 34, height: 34, bgcolor: 'warning.main', color: 'warning.contrastText' }}>
                                    <HubIcon fontSize="small" />
                                  </Avatar>
                                  <Typography variant="h5" sx={{ fontWeight: 800 }}>
                                    {t('subscriptionSharing.card.hostSubscription', 'Host subscription')} #{host.subscriptionId}
                                  </Typography>
                                  <RoleChip role={host.sharingRole} t={t} />
                                  <EligibilityChips
                                    eligible={host.eligible}
                                    eligibilityReason={host.eligibilityReason}
                                    minimumEligibleMonths={host.minimumEligibleMonths}
                                    t={t}
                                  />
                                  <RiskChip bucket={host.hostRiskBucket} t={t} />
                                  <Chip
                                    size="small"
                                    color={host.hostAtRisk ? 'warning' : 'default'}
                                    variant="outlined"
                                    label={t('subscriptionSharing.card.affectsShared', {
                                      count: beneficiaries.length,
                                      defaultValue: 'Affects {{count}} shared'
                                    })}
                                  />
                                  <StatusChip status={host.subscriptionStatus} t={t} />
                                </Stack>
                                <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
                                  <Chip size="small" variant="outlined" label={`${t('subscriptionSharing.card.customer', 'Customer')}: ${host.customerName || '-'}`} />
                                  <Chip
                                    size="small"
                                    variant="outlined"
                                    label={`${t('subscriptionSharing.card.line', 'Line')}: ${formatLineDisplay(host.lineName, host.lineId)}`}
                                  />
                                  {host.linePlusId && host.linePlusId !== '-' ? (
                                    <Chip size="small" variant="outlined" label={`${t('subscriptionSharing.card.linePlus', 'Line plus')}: ${host.linePlusId}`} />
                                  ) : null}
                                  <Chip size="small" variant="outlined" label={`${t('subscriptionSharing.card.provider', 'Provider')}: ${host.provider || '-'}`} />
                                  <Chip
                                    size="small"
                                    variant="outlined"
                                    label={`${t('subscriptionSharing.card.package', 'Package')}: ${formatPackageDisplay(host.packageName, host.packageId)}`}
                                  />
                                  <Chip
                                    size="small"
                                    variant="outlined"
                                    label={`${t('subscriptionSharing.card.subscriptionType', 'Subscription type')}: ${host.packageType || host.billing || '-'}`}
                                  />
                                </Stack>
                                {host.packageDescription ? (
                                  <Typography variant="body2" color="text.secondary">
                                    {t('subscriptionSharing.card.packageDescription', 'Description')}: {host.packageDescription}
                                  </Typography>
                                ) : null}
                              </Stack>
                              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'stretch', lg: 'flex-start' }}>
                                <RolePreferenceSelector
                                  value={host.rolePreference}
                                  loading={Boolean(roleSavingBySubscriptionId[host.subscriptionId])}
                                  onChange={(value) => handleRolePreferenceChange(host.subscriptionId, value)}
                                  t={t}
                                />
                                <Button
                                  size="small"
                                  variant="contained"
                                  onClick={() => loadDiagnostics(host.subscriptionId)}
                                  sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2, alignSelf: { xs: 'stretch', lg: 'flex-start' } }}
                                >
                                  {t('subscriptionSharing.actions.viewDiagnostics', 'View diagnostics')}
                                </Button>
                              </Stack>
                            </Stack>

                            <Grid container spacing={1.25}>
                              <Grid item xs={6} md={3}>
                                <MetricTile
                                  label={t('subscriptionSharing.card.hostRenewal', 'Host renewal')}
                                  value={formatDate(host.hostRenewalDate)}
                                  color={theme.palette.primary.main}
                                />
                              </Grid>
                              <Grid item xs={6} md={3}>
                                <MetricTile
                                  label={t('subscriptionSharing.card.renewalDay', 'Renewal day')}
                                  value={formatHostRenewalDay(host.hostRenewalDayOfMonth, t)}
                                  color={theme.palette.info.main}
                                  helper={formatHostDays(host.hostDaysToRenewal, t)}
                                />
                              </Grid>
                              <Grid item xs={6} md={3}>
                                <MetricTile
                                  label={t('subscriptionSharing.card.termLabel', 'Term')}
                                  value={t('subscriptionSharing.card.termValue', { months: host.termMonths || 0, defaultValue: '{{months}} months' })}
                                  helper={t('subscriptionSharing.card.minimumHint', {
                                    count: host.minimumEligibleMonths || 3,
                                    defaultValue: 'Minimum {{count}} months'
                                  })}
                                  color={theme.palette.warning.main}
                                />
                              </Grid>
                              <Grid item xs={6} md={3}>
                                <MetricTile
                                  label={t('subscriptionSharing.card.usageLabel', 'Usage pressure')}
                                  value={`${host.estimatedCustomerUsage || 0} / ${host.activatedScreens || 0}`}
                                  helper={t('subscriptionSharing.card.sharedClusterSize', {
                                    count: beneficiaries.length,
                                    defaultValue: 'Cluster size {{count}}'
                                  })}
                                  color={host.availableCapacity > 0 ? theme.palette.success.main : theme.palette.error.main}
                                />
                              </Grid>
                            </Grid>

                            <Divider />
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'flex-start', sm: 'center' }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                                {t('subscriptionSharing.card.beneficiaries', 'Beneficiaries')}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {t(
                                  'subscriptionSharing.card.beneficiariesHint',
                                  'Each shared subscription should renew on the same day as the host. Misaligned accounts are shown first so you can reorganize them.'
                                )}
                              </Typography>
                            </Stack>

                            {misalignedBeneficiaries.length > 0 ? (
                              <Alert severity={recommendedBeneficiaries.length > 0 ? 'warning' : 'info'}>
                                {t('subscriptionSharing.move.hostAlert', {
                                  count: misalignedBeneficiaries.length,
                                  defaultValue: '{{count}} beneficiary(ies) do not renew on the same day as this host.'
                                })}
                              </Alert>
                            ) : null}

                            {beneficiaries.length === 0 ? (
                              <Alert severity="warning">{t('subscriptionSharing.card.noBeneficiaries', 'No SHARED subscriptions linked to this host.')}</Alert>
                            ) : (
                              <Stack spacing={1.5}>
                                {renderBeneficiarySection(
                                  misalignedBeneficiaries,
                                  'misaligned',
                                  t('subscriptionSharing.card.misalignedShared', 'Misaligned shared'),
                                  'warning'
                                )}
                                {renderBeneficiarySection(
                                  alignedBeneficiaries,
                                  'aligned',
                                  t('subscriptionSharing.card.alignedShared', 'Aligned shared'),
                                  'success'
                                )}
                              </Stack>
                            )}
                          </Stack>
                        </Card>
                      );
                    })}
                  </Stack>
                </Stack>
              </Card>
            ))}
          </Stack>
        )}
      </MainCard>

      <MainCard
        title={
          <SectionTitle
            title={t('subscriptionSharing.sections.eligibleNotShared', 'Eligible and not shared')}
            count={eligibleNotSharedRows.length}
            subtitle={t(
              'subscriptionSharing.sections.eligibleHint',
              'These subscriptions already satisfy the sharing rule and still are not part of any shared cluster.'
            )}
          />
        }
      >
        {loading ? (
          <Stack spacing={1.25}>
            {Array.from({ length: 3 }).map((_, idx) => (
              <Skeleton key={`eligible-skel-${idx}`} variant="rounded" height={90} />
            ))}
          </Stack>
        ) : eligibleNotSharedRows.length === 0 ? (
          <Alert severity="info">{t('subscriptionSharing.sections.noEligible', 'No eligible subscriptions pending share.')}</Alert>
        ) : (
          <Stack spacing={1}>
            {eligibleNotSharedRows.map((row) => (
              <Card
                key={`eligible-${row.subscriptionId}`}
                sx={(muiTheme) => ({
                  ...sectionCardSx,
                  borderRadius: 3.25,
                  boxShadow:
                    muiTheme.palette.mode === 'dark'
                      ? '0 14px 28px rgba(2,8,23,0.14)'
                      : '0 10px 22px rgba(15,23,42,0.05)',
                  backgroundImage:
                    muiTheme.palette.mode === 'dark'
                      ? `linear-gradient(160deg, ${withAlpha(muiTheme.palette.success.main, 0.1)} 0%, ${withAlpha(muiTheme.palette.background.paper, 0.96)} 54%)`
                      : `linear-gradient(160deg, ${withAlpha(muiTheme.palette.success.main, 0.08)} 0%, ${muiTheme.palette.background.paper} 54%)`
                })}
              >
                <Stack spacing={1.4}>
                  <Stack direction={{ xs: 'column', lg: 'row' }} spacing={1.1} justifyContent="space-between">
                    <Stack spacing={1}>
                      <Stack direction="row" spacing={0.75} alignItems="center" useFlexGap flexWrap="wrap">
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>
                          #{row.subscriptionId} · {row.customerName || '-'}
                        </Typography>
                        <RoleChip role={row.sharingRole} t={t} />
                        <EligibilityChips
                          eligible={row.eligible}
                          eligibilityReason={row.eligibilityReason}
                          minimumEligibleMonths={row.minimumEligibleMonths}
                          t={t}
                        />
                        <RiskChip bucket={row.hostRiskBucket} t={t} />
                        <StatusChip status={row.subscriptionStatus} t={t} />
                      </Stack>
                      <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
                        <Chip
                          size="small"
                          variant="outlined"
                          label={`${t('subscriptionSharing.card.line', 'Line')}: ${formatLineDisplay(row.lineName, row.lineId)}`}
                        />
                        {row.linePlusId && row.linePlusId !== '-' ? (
                          <Chip size="small" variant="outlined" label={`${t('subscriptionSharing.card.linePlus', 'Line plus')}: ${row.linePlusId}`} />
                        ) : null}
                        <Chip size="small" variant="outlined" label={`${t('subscriptionSharing.card.provider', 'Provider')}: ${row.provider || '-'}`} />
                        <Chip
                          size="small"
                          variant="outlined"
                          label={`${t('subscriptionSharing.card.package', 'Package')}: ${formatPackageDisplay(row.packageName, row.packageId)}`}
                        />
                        <Chip
                          size="small"
                          variant="outlined"
                          label={`${t('subscriptionSharing.card.subscriptionType', 'Subscription type')}: ${row.packageType || row.billing || '-'}`}
                        />
                      </Stack>
                      {row.packageDescription ? (
                        <Typography variant="body2" color="text.secondary">
                          {t('subscriptionSharing.card.packageDescription', 'Description')}: {row.packageDescription}
                        </Typography>
                      ) : null}
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'stretch', lg: 'flex-start' }}>
                      <RolePreferenceSelector
                        value={row.rolePreference}
                        loading={Boolean(roleSavingBySubscriptionId[row.subscriptionId])}
                        onChange={(value) => handleRolePreferenceChange(row.subscriptionId, value)}
                        t={t}
                      />
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => loadDiagnostics(row.subscriptionId)}
                        sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2, alignSelf: { xs: 'stretch', lg: 'flex-start' } }}
                      >
                        {t('subscriptionSharing.actions.viewDiagnostics', 'View diagnostics')}
                      </Button>
                    </Stack>
                  </Stack>

                    <Grid container spacing={1.25}>
                    <Grid item xs={6} md={3}>
                      <MetricTile label={t('subscriptionSharing.card.hostRenewal', 'Host renewal')} value={formatDate(row.hostRenewalDate)} color={theme.palette.primary.main} />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <MetricTile
                        label={t('subscriptionSharing.card.renewalDay', 'Renewal day')}
                        value={formatHostRenewalDay(row.hostRenewalDayOfMonth, t)}
                        helper={formatHostDays(row.hostDaysToRenewal, t)}
                        color={row.hostAtRisk ? theme.palette.warning.main : theme.palette.info.main}
                      />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <MetricTile
                        label={t('subscriptionSharing.card.termLabel', 'Term')}
                        value={t('subscriptionSharing.card.termValue', { months: row.termMonths || 0, defaultValue: '{{months}} months' })}
                        color={theme.palette.success.main}
                      />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <MetricTile
                        label={t('subscriptionSharing.card.usageLabel', 'Usage pressure')}
                        value={`${row.estimatedCustomerUsage || 0} / ${row.activatedScreens || 0}`}
                        helper={t('subscriptionSharing.card.capacityShort', {
                          available: row.availableCapacity || 0,
                          defaultValue: 'Available {{available}}'
                        })}
                        color={theme.palette.success.main}
                      />
                    </Grid>
                  </Grid>
                </Stack>
                </Card>
              ))}
          </Stack>
        )}
      </MainCard>

      <MainCard
        title={
          <SectionTitle
            title={t('subscriptionSharing.sections.notEligible', 'Not eligible right now')}
            count={notEligibleRows.length}
            subtitle={t(
              'subscriptionSharing.sections.notEligibleHint',
              'This list surfaces subscriptions that stay outside sharing and explains whether the block is status, term or available capacity.'
            )}
          />
        }
      >
        {loading ? (
          <Stack spacing={1.25}>
            {Array.from({ length: 3 }).map((_, idx) => (
              <Skeleton key={`not-eligible-skel-${idx}`} variant="rounded" height={90} />
            ))}
          </Stack>
        ) : notEligibleRows.length === 0 ? (
          <Alert severity="info">{t('subscriptionSharing.sections.noNotEligible', 'No non-eligible subscriptions matched current filters.')}</Alert>
        ) : (
          <Stack spacing={1}>
            {notEligibleRows.map((row) => (
              <Card
                key={`not-eligible-${row.subscriptionId}`}
                sx={(muiTheme) => ({
                  ...sectionCardSx,
                  borderRadius: 3.25,
                  boxShadow:
                    muiTheme.palette.mode === 'dark'
                      ? '0 14px 28px rgba(2,8,23,0.14)'
                      : '0 10px 22px rgba(15,23,42,0.05)',
                  backgroundImage:
                    muiTheme.palette.mode === 'dark'
                      ? `linear-gradient(160deg, ${withAlpha(muiTheme.palette.error.main, 0.1)} 0%, ${withAlpha(muiTheme.palette.background.paper, 0.96)} 54%)`
                      : `linear-gradient(160deg, ${withAlpha(muiTheme.palette.error.main, 0.06)} 0%, ${muiTheme.palette.background.paper} 54%)`
                })}
              >
                <Stack spacing={1.4}>
                  <Stack direction={{ xs: 'column', lg: 'row' }} spacing={1.1} justifyContent="space-between">
                    <Stack spacing={1}>
                      <Stack direction="row" spacing={0.75} alignItems="center" useFlexGap flexWrap="wrap">
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>
                          #{row.subscriptionId} · {row.customerName || '-'}
                        </Typography>
                        <RoleChip role={row.sharingRole} t={t} />
                        <EligibilityChips
                          eligible={row.eligible}
                          eligibilityReason={row.eligibilityReason}
                          minimumEligibleMonths={row.minimumEligibleMonths}
                          t={t}
                        />
                        <RiskChip bucket={row.hostRiskBucket} t={t} />
                        <StatusChip status={row.subscriptionStatus} t={t} />
                      </Stack>
                      <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
                        <Chip
                          size="small"
                          variant="outlined"
                          label={`${t('subscriptionSharing.card.line', 'Line')}: ${formatLineDisplay(row.lineName, row.lineId)}`}
                        />
                        {row.linePlusId && row.linePlusId !== '-' ? (
                          <Chip size="small" variant="outlined" label={`${t('subscriptionSharing.card.linePlus', 'Line plus')}: ${row.linePlusId}`} />
                        ) : null}
                        <Chip size="small" variant="outlined" label={`${t('subscriptionSharing.card.provider', 'Provider')}: ${row.provider || '-'}`} />
                        <Chip
                          size="small"
                          variant="outlined"
                          label={`${t('subscriptionSharing.card.package', 'Package')}: ${formatPackageDisplay(row.packageName, row.packageId)}`}
                        />
                        <Chip
                          size="small"
                          variant="outlined"
                          label={`${t('subscriptionSharing.card.subscriptionType', 'Subscription type')}: ${row.packageType || row.billing || '-'}`}
                        />
                      </Stack>
                      {row.packageDescription ? (
                        <Typography variant="body2" color="text.secondary">
                          {t('subscriptionSharing.card.packageDescription', 'Description')}: {row.packageDescription}
                        </Typography>
                      ) : null}
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'stretch', lg: 'flex-start' }}>
                      <RolePreferenceSelector
                        value={row.rolePreference}
                        loading={Boolean(roleSavingBySubscriptionId[row.subscriptionId])}
                        onChange={(value) => handleRolePreferenceChange(row.subscriptionId, value)}
                        t={t}
                      />
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => loadDiagnostics(row.subscriptionId)}
                        sx={{
                          textTransform: 'none',
                          fontWeight: 700,
                          borderRadius: 2,
                          alignSelf: { xs: 'stretch', lg: 'flex-start' },
                          color: 'common.white',
                          backgroundImage: `linear-gradient(135deg, ${withAlpha(theme.palette.error.main, 0.92)} 0%, ${withAlpha(theme.palette.warning.dark, 0.92)} 100%)`,
                          boxShadow: `0 10px 24px ${withAlpha(theme.palette.error.main, 0.24)}`,
                          '&:hover': {
                            backgroundImage: `linear-gradient(135deg, ${theme.palette.error.dark} 0%, ${theme.palette.warning.main} 100%)`
                          }
                        }}
                      >
                        {t('subscriptionSharing.actions.viewDiagnostics', 'View diagnostics')}
                      </Button>
                    </Stack>
                  </Stack>

                    <Grid container spacing={1.25}>
                    <Grid item xs={6} md={3}>
                      <MetricTile label={t('subscriptionSharing.card.hostRenewal', 'Host renewal')} value={formatDate(row.hostRenewalDate)} color={theme.palette.primary.main} />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <MetricTile
                        label={t('subscriptionSharing.card.renewalDay', 'Renewal day')}
                        value={formatHostRenewalDay(row.hostRenewalDayOfMonth, t)}
                        helper={formatHostDays(row.hostDaysToRenewal, t)}
                        color={row.hostAtRisk ? theme.palette.warning.main : theme.palette.info.main}
                      />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <MetricTile
                        label={t('subscriptionSharing.card.termLabel', 'Term')}
                        value={t('subscriptionSharing.card.termValue', { months: row.termMonths || 0, defaultValue: '{{months}} months' })}
                        helper={eligibilityReasonMeta(row.eligibilityReason, row.minimumEligibleMonths, t).label}
                        color={theme.palette.warning.main}
                      />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <MetricTile
                        label={t('subscriptionSharing.card.usageLabel', 'Usage pressure')}
                        value={`${row.estimatedCustomerUsage || 0} / ${row.activatedScreens || 0}`}
                        helper={t('subscriptionSharing.card.capacityShort', {
                          available: row.availableCapacity || 0,
                          defaultValue: 'Available {{available}}'
                        })}
                        color={row.availableCapacity > 0 ? theme.palette.warning.main : theme.palette.error.main}
                      />
                    </Grid>
                    </Grid>
                  </Stack>
                </Card>
              ))}
          </Stack>
        )}
      </MainCard>
        </>
      ) : (
        <MainCard
          title={
            <SectionTitle
              title={t('subscriptionSharing.capacity.title', 'Available spaces grouped by renewal day')}
              count={capacityDayBuckets.length}
              subtitle={t(
                'subscriptionSharing.capacity.subtitle',
                'Use this operational view to place new 1-screen sales on lines that still have real capacity on that exact renewal day.'
              )}
            />
          }
        >
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            {t(
              'subscriptionSharing.capacity.info',
              'This tab is operational. It uses active capacity available right now and ignores the Eligible / Misaligned / Recommended filters so monthly accounts with free space are still visible.'
            )}
          </Typography>

          <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap" sx={{ mb: 1.5 }}>
            <Chip
              size="small"
              icon={<ViewTimelineIcon />}
              label={t('subscriptionSharing.capacity.summary.lines', {
                count: capacitySummary.lines,
                defaultValue: 'Lines with space: {{count}}'
              })}
            />
            <Chip
              size="small"
              color="success"
              variant="outlined"
              icon={<SignalCellularAltIcon />}
              label={t('subscriptionSharing.capacity.summary.slots', {
                count: capacitySummary.totalSlots,
                defaultValue: '1-screen slots: {{count}}'
              })}
            />
            <Chip
              size="small"
              color="info"
              variant="outlined"
              icon={<TuneIcon />}
              label={t('subscriptionSharing.kpi.pendingSetupCustomers', {
                count: pendingSetupRows.length,
                defaultValue: 'Pending setup: {{count}}'
              })}
            />
          </Stack>

          {loading ? (
            <Stack spacing={1.25}>
              {Array.from({ length: 4 }).map((_, idx) => (
                <Skeleton key={`capacity-skel-${idx}`} variant="rounded" height={110} />
              ))}
            </Stack>
          ) : capacityDayBuckets.length === 0 ? (
            <Alert severity="info">
              {t('subscriptionSharing.capacity.empty', 'No active lines with spare capacity were found for the current filters.')}
            </Alert>
          ) : (
            <Stack spacing={1.5}>
              {capacityDayBuckets.map((bucket) => (
                <Card
                  key={`capacity-day-${bucket.key}`}
                  sx={(muiTheme) => ({
                    ...sectionCardSx,
                    borderRadius: 3.25,
                    borderColor: withAlpha(muiTheme.palette.success.main, muiTheme.palette.mode === 'dark' ? 0.24 : 0.16)
                  })}
                >
                  <Stack spacing={1.1}>
                    <Stack spacing={0.55}>
                      <Stack direction="row" spacing={0.75} alignItems="center" useFlexGap flexWrap="wrap">
                        <Typography variant="h5" sx={{ fontWeight: 800 }}>
                          {formatHostRenewalDay(bucket.day, t)}
                        </Typography>
                        <Chip
                          size="small"
                          color="success"
                          variant="outlined"
                          label={t('subscriptionSharing.capacity.bucket.slotCount', {
                            count: bucket.totalSlots,
                            defaultValue: '1-screen slots: {{count}}'
                          })}
                        />
                        <Chip
                          size="small"
                          variant="outlined"
                          label={t('subscriptionSharing.capacity.bucket.lineCount', {
                            count: bucket.lineCount,
                            defaultValue: 'Lines: {{count}}'
                          })}
                        />
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        {bucket.nearestDate
                          ? t('subscriptionSharing.capacity.bucket.helper', {
                              date: formatDate(bucket.nearestDate),
                              defaultValue: 'Use this bucket for new 1-screen customers that should renew on this day. Nearest renewal: {{date}}'
                            })
                          : t(
                              'subscriptionSharing.capacity.bucket.helperNoDate',
                              'Use this bucket for lines without a visible renewal date only after manual validation.'
                            )}
                      </Typography>
                    </Stack>

                    <Stack divider={<Divider flexItem />} spacing={0}>
                      {bucket.rows.map((row) => (
                        <OperationalSubscriptionRow
                          key={`capacity-row-${row.subscriptionId}`}
                          row={row}
                          mode="capacity"
                          t={t}
                          theme={theme}
                          onViewDiagnostics={loadDiagnostics}
                        />
                      ))}
                    </Stack>
                  </Stack>
                </Card>
              ))}
            </Stack>
          )}

          <Divider sx={{ my: 2.5 }} />

          <SectionTitle
            title={t('subscriptionSharing.pendingSetup.title', 'Customers pending license setup')}
            count={pendingSetupRows.length}
            subtitle={t(
              'subscriptionSharing.pendingSetup.subtitle',
              'These are active standalone subscriptions that still have contracted screens available to configure.'
            )}
          />

          <Box sx={{ mt: 1.5 }}>
            {pendingSetupDayBuckets.length === 0 ? (
              <Alert severity="success">
                {t(
                  'subscriptionSharing.pendingSetup.empty',
                  'No standalone customers with pending license setup were found for the current filters.'
                )}
              </Alert>
            ) : (
              <Stack spacing={1.5}>
                {pendingSetupDayBuckets.map((bucket) => (
                  <Card
                    key={`pending-setup-bucket-${bucket.key}`}
                    sx={(muiTheme) => ({
                      ...sectionCardSx,
                      borderRadius: 3.25,
                      borderColor: withAlpha(muiTheme.palette.info.main, muiTheme.palette.mode === 'dark' ? 0.24 : 0.16)
                    })}
                  >
                    <Stack spacing={1.1}>
                      <Stack spacing={0.55}>
                        <Stack direction="row" spacing={0.75} alignItems="center" useFlexGap flexWrap="wrap">
                          <Typography variant="h5" sx={{ fontWeight: 800 }}>
                            {formatHostRenewalDay(bucket.day, t)}
                          </Typography>
                          <Chip
                            size="small"
                            color="info"
                            variant="outlined"
                            label={t('subscriptionSharing.pendingSetup.bucket.customers', {
                              count: bucket.customerCount,
                              defaultValue: 'Customers: {{count}}'
                            })}
                          />
                          <Chip
                            size="small"
                            color="success"
                            variant="outlined"
                            label={t('subscriptionSharing.pendingSetup.bucket.slots', {
                              count: bucket.totalSlots,
                              defaultValue: 'Pending slots: {{count}}'
                            })}
                          />
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                          {bucket.nearestDate
                            ? t('subscriptionSharing.pendingSetup.bucket.helper', {
                                date: formatDate(bucket.nearestDate),
                                defaultValue: 'Active standalone customers in this renewal day still need license setup. Nearest renewal: {{date}}'
                              })
                            : t(
                                'subscriptionSharing.pendingSetup.bucket.helperNoDate',
                                'These standalone customers still need license setup, but their renewal date should be validated manually.'
                              )}
                        </Typography>
                      </Stack>

                      <Stack divider={<Divider flexItem />} spacing={0}>
                        {bucket.rows.map((row) => (
                          <OperationalSubscriptionRow
                            key={`pending-setup-${row.subscriptionId}`}
                            row={row}
                            mode="pending"
                            t={t}
                            theme={theme}
                            onViewDiagnostics={loadDiagnostics}
                          />
                        ))}
                      </Stack>
                    </Stack>
                  </Card>
                ))}
              </Stack>
            )}
          </Box>
        </MainCard>
      )}

      <Dialog
        open={Boolean(moveDialogRow)}
        onClose={() => {
          if (!moveSaving) {
            setMoveDialogRow(null);
          }
        }}
        fullWidth
        maxWidth="sm"
        fullScreen={isMobile}
      >
        <DialogTitleWithClose
          onClose={() => {
            if (!moveSaving) {
              setMoveDialogRow(null);
            }
          }}
        >
          <Stack spacing={0.35}>
            <Typography variant="h4">{t('subscriptionSharing.move.confirmTitle', 'Move beneficiary to exact-day host')}</Typography>
            <Typography variant="body2" color="text.secondary">
              {moveDialogRow
                ? t('subscriptionSharing.move.confirmSubtitle', {
                    subscriptionId: moveDialogRow.subscriptionId,
                    defaultValue: 'Subscription #{{subscriptionId}}'
                  })
                : t('subscriptionSharing.move.confirmSubtitleFallback', 'Confirm the recommended move')}
            </Typography>
          </Stack>
        </DialogTitleWithClose>
        <DialogContent dividers>
          {!moveDialogRow ? null : (
            <Stack spacing={1.5}>
              <DialogContentText>
                {t(
                  'subscriptionSharing.move.confirmBody',
                  'This will move the shared subscription to a host that renews on the same day and keep the destination pinned as HOST.'
                )}
              </DialogContentText>
              <Grid container spacing={1.2}>
                <Grid item xs={12} sm={6}>
                  <Card sx={diagnosticsSurfaceSx}>
                    <Typography variant="overline" color="text.secondary">
                      {t('subscriptionSharing.move.currentAssignment', 'Current assignment')}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      #{moveDialogRow.subscriptionId} · {moveDialogRow.customerName || '-'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('subscriptionSharing.move.currentHost', {
                        id: moveDialogRow.sharedHostSubscriptionId || '-',
                        defaultValue: 'Host #{{id}}'
                      })}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('subscriptionSharing.move.currentLine', {
                        line: formatLineDisplay(moveDialogRow.lineName, moveDialogRow.lineId),
                        defaultValue: 'Line: {{line}}'
                      })}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('subscriptionSharing.move.currentDayValue', {
                        day: formatHostRenewalDay(moveDialogRow.hostRenewalDayOfMonth, t),
                        defaultValue: 'Day: {{day}}'
                      })}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('subscriptionSharing.move.ownDayValue', {
                        day: formatHostRenewalDay(moveDialogRow.renewalDayOfMonth, t),
                        defaultValue: 'Own day: {{day}}'
                      })}
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Card sx={diagnosticsSurfaceSx}>
                    <Typography variant="overline" color="text.secondary">
                      {t('subscriptionSharing.move.destinationAssignment', 'Recommended destination')}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      {t('subscriptionSharing.move.recommendedHost', {
                        id: moveDialogRow.recommendedDestinationSubscriptionId || '-',
                        defaultValue: 'Host #{{id}}'
                      })}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {moveDialogRow.recommendedDestinationCustomerName || '-'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('subscriptionSharing.move.recommendedLine', {
                        line: formatLineDisplay(moveDialogRow.recommendedDestinationLineName, moveDialogRow.recommendedDestinationLineId),
                        defaultValue: 'Line: {{line}}'
                      })}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('subscriptionSharing.move.currentDayValue', {
                        day: formatHostRenewalDay(moveDialogRow.recommendedDestinationHostRenewalDayOfMonth, t),
                        defaultValue: 'Day: {{day}}'
                      })}
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
              <Alert severity="warning">
                {t(
                  'subscriptionSharing.move.confirmWarning',
                  'This action changes lineId/linePlusId of the beneficiary subscription and immediately affects how the shared cluster is organized.'
                )}
              </Alert>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMoveDialogRow(null)} disabled={moveSaving} sx={{ textTransform: 'none', fontWeight: 700 }}>
            {t('actions.cancel', 'Cancel')}
          </Button>
            <Button
              onClick={handleMoveSubscription}
              disabled={moveSaving || !moveDialogRow?.moveRecommendationAvailable}
              variant="contained"
              color="secondary"
              sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
            >
            {moveSaving
              ? t('subscriptionSharing.actions.moving', 'Moving...')
              : t('subscriptionSharing.actions.moveToHost', {
                  id: moveDialogRow?.recommendedDestinationSubscriptionId || '-',
                  defaultValue: 'Move to host #{{id}}'
                })}
            </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={oversoldDetailOpen}
        onClose={() => {
          setOversoldDetailOpen(false);
          setOversoldDetailData(null);
        }}
        fullWidth
        maxWidth="md"
        fullScreen={isMobile}
      >
        <DialogTitleWithClose
          onClose={() => {
            setOversoldDetailOpen(false);
            setOversoldDetailData(null);
          }}
        >
          <Stack spacing={0.25}>
            <Typography variant="h4">{t('subscriptionSharing.oversold.detail.title', 'Oversold detail')}</Typography>
            <Typography variant="body2" color="text.secondary">
              {oversoldDetailData?.subscriptionId
                ? t('subscriptionSharing.oversold.detail.subtitle', {
                    subscriptionId: oversoldDetailData.subscriptionId,
                    defaultValue: 'Subscription #{{subscriptionId}}'
                  })
                : t('subscriptionSharing.oversold.detail.subtitleFallback', 'Live oversale snapshot')}
            </Typography>
          </Stack>
        </DialogTitleWithClose>
        <DialogContent dividers>
          {oversoldDetailLoading ? (
            <Stack spacing={1.25}>
              {Array.from({ length: 5 }).map((_, idx) => (
                <Skeleton key={`oversold-detail-skel-${idx}`} variant="rounded" height={52} />
              ))}
            </Stack>
          ) : !oversoldDetailData ? (
            <Alert severity="warning">{t('subscriptionSharing.oversold.detail.empty', 'No oversold detail available for this subscription.')}</Alert>
          ) : (
            <Stack spacing={2}>
              <Box
                sx={(muiTheme) => ({
                  p: { xs: 1.6, sm: 2 },
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: withAlpha(muiTheme.palette.error.main, muiTheme.palette.mode === 'dark' ? 0.38 : 0.2),
                  backgroundImage:
                    muiTheme.palette.mode === 'dark'
                      ? `linear-gradient(135deg, ${withAlpha(muiTheme.palette.error.main, 0.16)} 0%, ${withAlpha(
                          muiTheme.palette.warning.main,
                          0.12
                        )} 56%, ${withAlpha(muiTheme.palette.background.paper, 0.96)} 100%)`
                      : `linear-gradient(135deg, ${withAlpha(muiTheme.palette.error.main, 0.08)} 0%, ${withAlpha(
                          muiTheme.palette.warning.main,
                          0.08
                        )} 56%, ${muiTheme.palette.background.paper} 100%)`
                })}
              >
                <Stack spacing={1.2}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
                    <Box>
                      <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1.1 }}>
                        {t('subscriptionSharing.oversold.detail.summaryTitle', 'Oversale summary')}
                      </Typography>
                      <Typography variant="h4" sx={{ lineHeight: 1.15 }}>
                        #{oversoldDetailData.subscriptionId} · {oversoldDetailData.customerName || '-'}
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
                      <RoleChip role={oversoldDetailData.sharingRole} t={t} />
                      <StatusChip status={oversoldDetailData.subscriptionStatus} t={t} />
                      <Chip
                        size="small"
                        color="error"
                        variant="filled"
                        label={t('subscriptionSharing.oversold.card.oversoldBy', {
                          count: oversoldDetailData.oversoldBy || 0,
                          defaultValue: 'Oversold by {{count}}'
                        })}
                        sx={{ fontWeight: 700 }}
                      />
                    </Stack>
                  </Stack>
                  <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
                    <Chip
                      size="small"
                      variant="outlined"
                      label={`${t('subscriptionSharing.card.line', 'Line')}: ${formatLineDisplay(oversoldDetailData.lineName, oversoldDetailData.lineId)}`}
                    />
                    <Chip size="small" variant="outlined" label={`${t('subscriptionSharing.card.provider', 'Provider')}: ${oversoldDetailData.provider || '-'}`} />
                    <Chip
                      size="small"
                      variant="outlined"
                      label={`${t('subscriptionSharing.card.package', 'Package')}: ${formatPackageDisplay(
                        oversoldDetailData.packageName,
                        oversoldDetailData.subscriptionId
                      )}`}
                    />
                    <Chip
                      size="small"
                      color="warning"
                      variant="outlined"
                      label={t('subscriptionSharing.oversold.card.capacityToken', {
                        token: oversoldDetailData.packageCapacityToken || '-',
                        defaultValue: 'Token: {{token}}'
                      })}
                    />
                  </Stack>
                </Stack>
              </Box>

              <Grid container spacing={1.25}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={diagnosticsSurfaceSx}>
                    <Typography variant="caption" color="text.secondary">
                      {t('subscriptionSharing.oversold.card.contractedConnections', 'Contracted connections')}
                    </Typography>
                    <Typography variant="h4">{oversoldDetailData.contractedConnections || 0}</Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={diagnosticsSurfaceSx}>
                    <Typography variant="caption" color="text.secondary">
                      {t('subscriptionSharing.oversold.card.activeLinkedLicenses', 'Active linked licenses')}
                    </Typography>
                    <Typography variant="h4">{oversoldDetailData.activeLinkedLicenses || 0}</Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={diagnosticsSurfaceSx}>
                    <Typography variant="caption" color="text.secondary">
                      {t('subscriptionSharing.oversold.card.oversoldLabel', 'Excess')}
                    </Typography>
                    <Typography variant="h4">{oversoldDetailData.oversoldBy || 0}</Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={diagnosticsSurfaceSx}>
                    <Typography variant="caption" color="text.secondary">
                      {t('subscriptionSharing.oversold.detail.affectedLicenseCount', 'Affected licenses')}
                    </Typography>
                    <Typography variant="h4">{oversoldDetailData.affectedLicenseCount || 0}</Typography>
                  </Card>
                </Grid>
              </Grid>

              {oversoldDetailData.packageDisplayText ? (
                <Card sx={diagnosticsSurfaceSx}>
                  <Typography variant="caption" color="text.secondary">
                    {t('subscriptionSharing.card.packageDescription', 'Description')}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                    {oversoldDetailData.packageDisplayText}
                  </Typography>
                </Card>
              ) : null}

              <Card sx={diagnosticsSurfaceSx}>
                <Stack spacing={1.1}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      {t('subscriptionSharing.oversold.detail.licensesTitle', 'Operational linked licenses')}
                    </Typography>
                    <Chip
                      size="small"
                      variant="outlined"
                      label={t('subscriptionSharing.oversold.detail.licensesCount', {
                        count: oversoldDetailData.affectedLicenseCount || 0,
                        defaultValue: 'Licenses: {{count}}'
                      })}
                    />
                  </Stack>

                  {oversoldDetailData.licenses.length === 0 ? (
                    <Alert severity="info">
                      {t('subscriptionSharing.oversold.detail.noLicenses', 'No operational linked licenses were found for this subscription.')}
                    </Alert>
                  ) : (
                    <Stack spacing={1}>
                      {oversoldDetailData.licenses.map((license) => (
                        <Card
                          key={`oversold-license-${license.licenseId}`}
                          variant="outlined"
                          sx={{
                            p: 1.15,
                            borderRadius: 2.25,
                            bgcolor: theme.vars?.palette?.surface?.sunken || theme.palette.background.default
                          }}
                        >
                          <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }}>
                            <Stack spacing={0.35}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                                #{license.licenseId} · {license.name || '-'}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {license.macAddress || '-'}
                              </Typography>
                            </Stack>
                            <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
                              <Chip size="small" variant="outlined" label={license.app || '-'} />
                              <Chip size="small" variant="outlined" label={`${t('subscriptionSharing.card.status', 'Status')}: ${license.status || '-'}`} />
                            </Stack>
                          </Stack>
                        </Card>
                      ))}
                    </Stack>
                  )}
                </Stack>
              </Card>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOversoldDetailOpen(false);
              setOversoldDetailData(null);
            }}
            variant="contained"
            color="error"
            sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
          >
            {t('subscriptionSharing.actions.closeOversoldDetail', 'Close oversale detail')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={diagnosticsOpen}
        onClose={() => {
          setDiagnosticsOpen(false);
          setDiagnosticsData(null);
        }}
        fullWidth
        maxWidth="md"
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: { xs: 0, sm: 4 },
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
            backgroundImage: (muiTheme) =>
              muiTheme.palette.mode === 'dark'
                ? `linear-gradient(180deg, ${withAlpha(muiTheme.palette.primary.main, 0.12)} 0%, ${withAlpha(
                    muiTheme.palette.background.paper,
                    0.98
                  )} 18%, ${muiTheme.palette.background.paper} 100%)`
                : `linear-gradient(180deg, ${withAlpha(muiTheme.palette.primary.main, 0.08)} 0%, ${muiTheme.palette.background.paper} 18%, ${muiTheme.palette.background.paper} 100%)`
          }
        }}
      >
        <DialogTitleWithClose
          sx={{
            borderBottom: '1px solid',
            borderColor: 'divider',
            backgroundColor: (muiTheme) => withAlpha(muiTheme.palette.background.default, muiTheme.palette.mode === 'dark' ? 0.72 : 0.82)
          }}
          closeButtonSx={{
            bgcolor: (muiTheme) => withAlpha(muiTheme.palette.background.paper, muiTheme.palette.mode === 'dark' ? 0.96 : 0.92)
          }}
          onClose={() => {
            setDiagnosticsOpen(false);
            setDiagnosticsData(null);
          }}
        >
          <Stack spacing={0.25}>
            <Typography variant="h4">{t('subscriptionSharing.diagnostics.title', 'Subscription diagnostics')}</Typography>
            <Typography variant="body2" color="text.secondary">
              {diagnosticsData?.subscriptionId
                ? t('subscriptionSharing.diagnostics.subtitle', {
                    subscriptionId: diagnosticsData.subscriptionId,
                    defaultValue: 'Subscription #{{subscriptionId}}'
                  })
                : t('subscriptionSharing.diagnostics.subtitleFallback', 'Live eligibility snapshot')}
            </Typography>
          </Stack>
        </DialogTitleWithClose>

        <DialogContent
          dividers
          sx={{
            px: { xs: 1.5, sm: 3 },
            py: { xs: 1.5, sm: 2 },
            backgroundColor: (muiTheme) => withAlpha(muiTheme.palette.background.default, muiTheme.palette.mode === 'dark' ? 0.26 : 0.4)
          }}
        >
          {diagnosticsLoading ? (
            <Stack spacing={1.25}>
              {Array.from({ length: 6 }).map((_, idx) => (
                <Skeleton key={`diag-skel-${idx}`} variant="rounded" height={48} />
              ))}
            </Stack>
          ) : !diagnosticsData ? (
            <Alert severity="warning">{t('subscriptionSharing.diagnostics.empty', 'No diagnostics available for this subscription.')}</Alert>
          ) : (
            <Stack spacing={2}>
              <Box
                sx={(muiTheme) => ({
                  p: { xs: 1.6, sm: 2 },
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: withAlpha(muiTheme.palette.primary.main, muiTheme.palette.mode === 'dark' ? 0.4 : 0.18),
                  backgroundImage:
                    muiTheme.palette.mode === 'dark'
                      ? `linear-gradient(135deg, ${withAlpha(muiTheme.palette.primary.main, 0.18)} 0%, ${withAlpha(
                          muiTheme.palette.info.main,
                          0.12
                        )} 56%, ${withAlpha(muiTheme.palette.background.paper, 0.96)} 100%)`
                      : `linear-gradient(135deg, ${withAlpha(muiTheme.palette.primary.main, 0.1)} 0%, ${withAlpha(
                          muiTheme.palette.info.main,
                          0.06
                        )} 56%, ${muiTheme.palette.background.paper} 100%)`
                })}
              >
                <Stack spacing={1.2}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
                    <Box>
                      <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1.1 }}>
                        {t('subscriptionSharing.diagnostics.summaryTitle', 'Sharing summary')}
                      </Typography>
                      <Typography variant="h4" sx={{ lineHeight: 1.15 }}>
                        #{diagnosticsData.subscriptionId} · {diagnosticsData.customerName || '-'}
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
                      <RoleChip role={diagnosticsData.sharingRole} t={t} />
                      <EligibilityChips
                        eligible={diagnosticsData.eligible}
                        eligibilityReason={diagnosticsData.eligibilityReason}
                        minimumEligibleMonths={diagnosticsData.minimumEligibleMonths}
                        t={t}
                      />
                      <RiskChip bucket={diagnosticsData.hostRiskBucket} t={t} />
                    </Stack>
                  </Stack>
                  <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
                    <Chip
                      size="small"
                      variant="outlined"
                      color={diagnosticsData.sharingActive ? 'success' : 'default'}
                      label={
                        diagnosticsData.sharingActive
                          ? t('subscriptionSharing.diagnostics.sharingActive', 'Active for sharing')
                          : t('subscriptionSharing.diagnostics.sharingInactive', 'Inactive for sharing')
                      }
                      sx={{ fontWeight: 700 }}
                    />
                    <Chip
                      size="small"
                      variant="outlined"
                      color={diagnosticsData.sharedCluster ? 'info' : 'default'}
                      label={
                        diagnosticsData.sharedCluster
                          ? t('subscriptionSharing.diagnostics.sharedCluster', {
                              count: diagnosticsData.sharedClusterSize || 0,
                              defaultValue: 'Shared cluster · {{count}}'
                            })
                          : t('subscriptionSharing.diagnostics.standalone', 'Standalone subscription')
                      }
                      sx={{ fontWeight: 700 }}
                    />
                    <Chip
                      size="small"
                      variant="outlined"
                      color={diagnosticsData.hostAtRisk ? 'warning' : 'default'}
                      label={
                        diagnosticsData.hostAtRisk
                          ? t('subscriptionSharing.diagnostics.hostAtRisk', 'Host risk affects shared subscriptions')
                          : t('subscriptionSharing.diagnostics.hostStable', 'Host currently stable')
                      }
                      sx={{ fontWeight: 700 }}
                    />
                    <Chip
                      size="small"
                      variant="outlined"
                      color={diagnosticsData.rolePreference === 'AUTO' ? 'default' : 'secondary'}
                      label={t('subscriptionSharing.actions.roleCurrent', {
                        role:
                          diagnosticsData.rolePreference === 'HOST'
                            ? t('subscriptionSharing.actions.roleHost', 'Host')
                            : diagnosticsData.rolePreference === 'SHARED'
                              ? t('subscriptionSharing.actions.roleShared', 'Shared')
                              : t('subscriptionSharing.actions.roleAuto', 'Auto'),
                        defaultValue: 'Role mode: {{role}}'
                      })}
                      sx={{ fontWeight: 700 }}
                    />
                    <AlignmentChip status={diagnosticsData.alignmentStatus} t={t} />
                    <Chip size="small" variant="outlined" label={`${t('subscriptionSharing.card.provider', 'Provider')}: ${diagnosticsData.provider || '-'}`} />
                    <Chip
                      size="small"
                      variant="outlined"
                      label={`${t('subscriptionSharing.card.line', 'Line')}: ${formatLineDisplay(diagnosticsData.lineName, diagnosticsData.lineId)}`}
                    />
                  </Stack>
                </Stack>
              </Box>

              <Card sx={diagnosticsSurfaceSx}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {t('subscriptionSharing.actions.rolePreference', 'Role')}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      {t(
                        'subscriptionSharing.actions.roleHelp',
                        'Choose who should behave as host inside this shared line. Auto keeps the system decision.'
                      )}
                    </Typography>
                  </Box>
                  <RolePreferenceSelector
                    value={diagnosticsData.rolePreference}
                    loading={Boolean(roleSavingBySubscriptionId[diagnosticsData.subscriptionId])}
                    onChange={(value) => handleRolePreferenceChange(diagnosticsData.subscriptionId, value)}
                    t={t}
                  />
                </Stack>
              </Card>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} useFlexGap flexWrap="wrap">
                <Chip size="small" variant="outlined" label={`Sub #${diagnosticsData.subscriptionId || '-'}`} />
                <Chip size="small" variant="outlined" label={`Cust #${diagnosticsData.customerId || '-'}`} />
                {diagnosticsData.sharedHostSubscriptionId ? (
                  <Chip
                    size="small"
                    variant="outlined"
                    label={t('subscriptionSharing.diagnostics.hostSubscription', {
                      id: diagnosticsData.sharedHostSubscriptionId,
                      defaultValue: 'Host #{{id}}'
                    })}
                  />
                ) : null}
              </Stack>

              <Grid container spacing={1.25}>
                <Grid item xs={12} sm={6} md={4}>
                  <Card sx={diagnosticsSurfaceSx}>
                    <Typography variant="caption" color="text.secondary">
                      {t('subscriptionSharing.diagnostics.customer', 'Customer')}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      {diagnosticsData.customerName || '-'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      #{diagnosticsData.customerId || '-'}
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Card sx={diagnosticsSurfaceSx}>
                    <Typography variant="caption" color="text.secondary">
                      {t('subscriptionSharing.diagnostics.line', 'Line')}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      {formatLineDisplay(diagnosticsData.lineName, diagnosticsData.lineId)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('subscriptionSharing.diagnostics.linePlus', { value: diagnosticsData.linePlusId || '-', defaultValue: 'Plus: {{value}}' })}
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Card sx={diagnosticsSurfaceSx}>
                    <Typography variant="caption" color="text.secondary">
                      {t('subscriptionSharing.diagnostics.provider', 'Provider')}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      {diagnosticsData.provider || '-'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('subscriptionSharing.diagnostics.status', { value: diagnosticsData.subscriptionStatus || '-', defaultValue: 'Status: {{value}}' })}
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Card sx={diagnosticsSurfaceSx}>
                    <Typography variant="caption" color="text.secondary">
                      {t('subscriptionSharing.diagnostics.package', 'Package')}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      {formatPackageDisplay(diagnosticsData.packageName, diagnosticsData.packageId)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('subscriptionSharing.diagnostics.packageType', {
                        value: diagnosticsData.packageType || diagnosticsData.billing || '-',
                        defaultValue: 'Type: {{value}}'
                      })}
                    </Typography>
                  </Card>
                </Grid>
              </Grid>

              <Grid container spacing={1.25}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={diagnosticsSurfaceSx}>
                    <Typography variant="caption" color="text.secondary">
                      {t('subscriptionSharing.diagnostics.ownRenewalDay', 'Own renewal day')}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      {formatHostRenewalDay(diagnosticsData.renewalDayOfMonth, t)}
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={diagnosticsSurfaceSx}>
                    <Typography variant="caption" color="text.secondary">
                      {t('subscriptionSharing.diagnostics.hostRenewalDate', 'Host renewal date')}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      {formatDate(diagnosticsData.hostRenewalDate)}
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={diagnosticsSurfaceSx}>
                    <Typography variant="caption" color="text.secondary">
                      {t('subscriptionSharing.diagnostics.hostRenewalDay', 'Renewal day')}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      {formatHostRenewalDay(diagnosticsData.hostRenewalDayOfMonth, t)}
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={diagnosticsSurfaceSx}>
                    <Typography variant="caption" color="text.secondary">
                      {t('subscriptionSharing.diagnostics.hostDaysToRenewal', 'Days to host renewal')}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      {formatHostDays(diagnosticsData.hostDaysToRenewal, t)}
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={diagnosticsSurfaceSx}>
                    <Typography variant="caption" color="text.secondary">
                      {t('subscriptionSharing.diagnostics.hostRiskBucket', 'Host risk bucket')}
                    </Typography>
                    <Box sx={{ mt: 0.8 }}>
                      <RiskChip bucket={diagnosticsData.hostRiskBucket} t={t} />
                    </Box>
                  </Card>
                </Grid>
              </Grid>

              <Card sx={diagnosticsSurfaceSx}>
                <Stack spacing={1}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                    {t('subscriptionSharing.diagnostics.alignmentTitle', 'Renewal alignment')}
                  </Typography>
                  <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
                    <AlignmentChip status={diagnosticsData.alignmentStatus} t={t} />
                    {diagnosticsData.sharingRole === 'SHARED' ? (
                      <Chip
                        size="small"
                        variant="outlined"
                        label={t('subscriptionSharing.diagnostics.hostSubscription', {
                          id: diagnosticsData.sharedHostSubscriptionId || '-',
                          defaultValue: 'Host #{{id}}'
                        })}
                      />
                    ) : null}
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {alignmentReasonLabel(diagnosticsData.alignmentReason, t)}
                  </Typography>
                </Stack>
              </Card>

              {diagnosticsData.packageDescription ? (
                <Card sx={diagnosticsSurfaceSx}>
                  <Typography variant="caption" color="text.secondary">
                    {t('subscriptionSharing.diagnostics.packageDescription', 'Subscription description')}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                    {diagnosticsData.packageDescription}
                  </Typography>
                </Card>
              ) : null}

              <Grid container spacing={1.25}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={diagnosticsSurfaceSx}>
                    <Typography variant="caption" color="text.secondary">
                      {t('subscriptionSharing.diagnostics.billing', 'Billing')}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      {diagnosticsData.billing || '-'}
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={diagnosticsSurfaceSx}>
                    <Typography variant="caption" color="text.secondary">
                      {t('subscriptionSharing.diagnostics.startDate', 'Start date')}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      {formatDate(diagnosticsData.startDate)}
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={diagnosticsSurfaceSx}>
                    <Typography variant="caption" color="text.secondary">
                      {t('subscriptionSharing.diagnostics.renewalDate', 'Renewal date')}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      {formatDate(diagnosticsData.renewalDate)}
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={diagnosticsSurfaceSx}>
                    <Typography variant="caption" color="text.secondary">
                      {t('subscriptionSharing.diagnostics.termMonths', 'Calculated months')}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      {diagnosticsData.termMonths || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('subscriptionSharing.diagnostics.minimumEligibleMonths', {
                        count: diagnosticsData.minimumEligibleMonths || 3,
                        defaultValue: 'Minimum: {{count}}'
                      })}
                    </Typography>
                  </Card>
                </Grid>
              </Grid>

              <Grid container spacing={1.25}>
                <Grid item xs={12} sm={4}>
                  <Card sx={diagnosticsSurfaceSx}>
                    <Typography variant="caption" color="text.secondary">
                      {t('subscriptionSharing.diagnostics.activatedScreens', 'Activated screens')}
                    </Typography>
                    <Typography variant="h4">{diagnosticsData.activatedScreens || 0}</Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card sx={diagnosticsSurfaceSx}>
                    <Typography variant="caption" color="text.secondary">
                      {t('subscriptionSharing.diagnostics.estimatedUsage', 'Estimated usage')}
                    </Typography>
                    <Typography variant="h4">{diagnosticsData.estimatedUsage || 0}</Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card sx={diagnosticsSurfaceSx}>
                    <Typography variant="caption" color="text.secondary">
                      {t('subscriptionSharing.diagnostics.availableCapacity', 'Available capacity')}
                    </Typography>
                    <Typography variant="h4">{diagnosticsData.availableCapacity || 0}</Typography>
                  </Card>
                </Grid>
              </Grid>

              {diagnosticsData.sharingRole === 'SHARED' ? (
                <Card sx={diagnosticsSurfaceSx}>
                  <Stack spacing={1.15}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                          {t('subscriptionSharing.move.title', 'Move recommendation')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {alignmentReasonLabel(diagnosticsData.alignmentReason, t)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {moveReasonLabel(diagnosticsData.moveRecommendationReason, t)}
                        </Typography>
                      </Box>
                      <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
                        <MovePriorityChip priority={diagnosticsData.moveRecommendationPriority} t={t} />
                        {diagnosticsData.moveRecommendationAvailable ? (
                          <RiskChip bucket={diagnosticsData.recommendedDestinationHostRiskBucket} t={t} />
                        ) : null}
                      </Stack>
                    </Stack>

                    <Grid container spacing={1.25}>
                      <Grid item xs={12} sm={4}>
                        <Card sx={diagnosticsSurfaceSx}>
                          <Typography variant="caption" color="text.secondary">
                            {t('subscriptionSharing.move.ownDay', 'Own renewal day')}
                          </Typography>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                            {formatHostRenewalDay(diagnosticsData.renewalDayOfMonth, t)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(diagnosticsData.renewalDate)}
                          </Typography>
                        </Card>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Card sx={diagnosticsSurfaceSx}>
                          <Typography variant="caption" color="text.secondary">
                            {t('subscriptionSharing.move.requiredScreens', 'Screens to move')}
                          </Typography>
                          <Typography variant="h4">{diagnosticsData.requiredScreensToMove || 1}</Typography>
                        </Card>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Card sx={diagnosticsSurfaceSx}>
                          <Typography variant="caption" color="text.secondary">
                            {t('subscriptionSharing.move.currentDay', 'Current host day')}
                          </Typography>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                            {formatHostRenewalDay(diagnosticsData.hostRenewalDayOfMonth, t)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {formatHostDays(diagnosticsData.hostDaysToRenewal, t)}
                          </Typography>
                        </Card>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Card sx={diagnosticsSurfaceSx}>
                          <Typography variant="caption" color="text.secondary">
                            {t('subscriptionSharing.move.recommendedDay', 'Recommended day')}
                          </Typography>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                            {formatHostRenewalDay(diagnosticsData.recommendedDestinationHostRenewalDayOfMonth, t)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {formatHostDays(diagnosticsData.recommendedDestinationHostDaysToRenewal, t)}
                          </Typography>
                        </Card>
                      </Grid>
                    </Grid>

                    {diagnosticsData.moveRecommendationAvailable ? (
                      <>
                        <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
                          <Chip
                            size="small"
                            variant="outlined"
                            label={t('subscriptionSharing.move.recommendedHost', {
                              id: diagnosticsData.recommendedDestinationSubscriptionId || '-',
                              defaultValue: 'Host #{{id}}'
                            })}
                          />
                          <Chip
                            size="small"
                            variant="outlined"
                            label={t('subscriptionSharing.move.recommendedCustomer', {
                              customer: diagnosticsData.recommendedDestinationCustomerName || '-',
                              defaultValue: 'Customer: {{customer}}'
                            })}
                          />
                          <Chip
                            size="small"
                            variant="outlined"
                            label={t('subscriptionSharing.move.recommendedLine', {
                              line: formatLineDisplay(diagnosticsData.recommendedDestinationLineName, diagnosticsData.recommendedDestinationLineId),
                              defaultValue: 'Line: {{line}}'
                            })}
                          />
                        </Stack>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => setMoveDialogRow(normalizeRow(diagnosticsData))}
                          sx={{ textTransform: 'none', fontWeight: 700, alignSelf: 'flex-start', borderRadius: 2 }}
                        >
                          {t('subscriptionSharing.actions.moveToHost', {
                            id: diagnosticsData.recommendedDestinationSubscriptionId || '-',
                            defaultValue: 'Move to host #{{id}}'
                          })}
                        </Button>
                      </>
                    ) : null}
                  </Stack>
                </Card>
              ) : null}

              <Card
                sx={(muiTheme) => ({
                  ...diagnosticsSurfaceSx,
                  backgroundColor: muiTheme.vars?.palette?.surface?.sunken || muiTheme.palette.background.default
                })}
              >
                <Stack spacing={0.75}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                    {t('subscriptionSharing.diagnostics.readingTitle', 'How to read this result')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {diagnosticsData.eligible
                      ? t(
                          'subscriptionSharing.diagnostics.readingEligible',
                          'This subscription is active, meets the minimum term and still has available capacity to be considered for sharing.'
                        )
                      : t(
                          'subscriptionSharing.diagnostics.readingBlocked',
                          'This subscription is blocked by the main reason shown above. Review term, status and available capacity before trying to share it.'
                        )}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {diagnosticsData.sharedCluster
                      ? t(
                          'subscriptionSharing.diagnostics.readingHostImpact',
                          'For shared clusters, the host renewal date controls the operational bucket. If the host expires, all linked shared subscriptions are affected.'
                        )
                      : t(
                          'subscriptionSharing.diagnostics.readingStandalone',
                          'This subscription is not linked to a shared cluster, so its own renewal date drives the operational bucket.'
                        )}
                  </Typography>
                </Stack>
              </Card>
            </Stack>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            px: { xs: 1.5, sm: 3 },
            py: 1.5,
            borderTop: '1px solid',
            borderColor: 'divider',
            backgroundColor: (muiTheme) => withAlpha(muiTheme.palette.background.default, muiTheme.palette.mode === 'dark' ? 0.72 : 0.82)
          }}
        >
          <Button
            onClick={() => {
              setDiagnosticsOpen(false);
              setDiagnosticsData(null);
            }}
            variant="contained"
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: 2,
              backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.info.main} 100%)`
            }}
          >
            {t('subscriptionSharing.actions.closeDiagnostics', 'Close diagnostics')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
