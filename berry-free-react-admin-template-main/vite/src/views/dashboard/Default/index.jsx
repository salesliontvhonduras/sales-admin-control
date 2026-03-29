import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import useAuth from 'hooks/useAuth';

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import { useTheme } from '@mui/material/styles';

import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import KeyIcon from '@mui/icons-material/Key';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import TimelineIcon from '@mui/icons-material/Timeline';
import AssessmentIcon from '@mui/icons-material/Assessment';
import RefreshIcon from '@mui/icons-material/Refresh';

import { gridSpacing } from 'store/constant';
import { useLionTvOverview } from 'api/liontv-overview';
import LazyApexChart from 'ui-component/charts/LazyApexChart';
import { PageEmptyState, PageErrorState, PageLoadingState } from 'ui-component/feedback/PageState';
import { withAlpha } from 'utils/colorUtils';

function toUpper(value) {
  return String(value || '')
    .trim()
    .toUpperCase();
}

function money(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function parseDate(value) {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  const raw = String(value).trim();
  if (!raw) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    const d = new Date(`${raw}T00:00:00`);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d;
}

function daysUntil(value) {
  const target = parseDate(value);
  if (!target) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(target);
  due.setHours(0, 0, 0, 0);
  return Math.round((due.getTime() - today.getTime()) / 86400000);
}

function bucketByDays(values) {
  const bucket = { overdue: 0, today: 0, week: 0, month: 0 };
  values.forEach((value) => {
    const days = daysUntil(value);
    if (days === null) return;
    if (days < 0) bucket.overdue += 1;
    else if (days === 0) bucket.today += 1;
    else if (days <= 7) bucket.week += 1;
    else if (days <= 30) bucket.month += 1;
  });
  return bucket;
}

function formatMoney(value, locale = 'es-HN') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'HNL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(money(value));
}

function formatPercent(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return '0.0%';
  return `${n.toFixed(1)}%`;
}

function isTruthyFlag(raw) {
  return raw === true || raw === 1 || raw === '1' || String(raw).toLowerCase() === 'true';
}

const surfaceCardSx = (theme) => ({
  borderRadius: 2.5,
  border: '1px solid',
  borderColor: 'divider',
  background: `linear-gradient(180deg, ${theme.vars.palette.surface.card} 0%, ${theme.vars.palette.surface.muted} 100%)`,
  boxShadow: `0 14px 34px ${withAlpha('#020617', 0.44)}`,
  ...theme.applyStyles('light', {
    boxShadow: `0 12px 28px ${withAlpha('#0f172a', 0.1)}`
  })
});

const infoAlertSx = (theme) => ({
  borderColor: withAlpha(theme.vars.palette.info.main, 0.34),
  backgroundColor: withAlpha(theme.vars.palette.info.main, 0.1),
  color: theme.vars.palette.text.primary,
  '& .MuiAlert-icon': {
    color: theme.vars.palette.info.main
  }
});

const warningAlertSx = (theme) => ({
  borderColor: withAlpha(theme.vars.palette.warning.main, 0.34),
  backgroundColor: withAlpha(theme.vars.palette.warning.main, 0.1),
  color: theme.vars.palette.text.primary,
  '& .MuiAlert-icon': {
    color: theme.vars.palette.warning.main
  }
});

const errorAlertSx = (theme) => ({
  borderColor: withAlpha(theme.vars.palette.error.main, 0.34),
  backgroundColor: withAlpha(theme.vars.palette.error.main, 0.1),
  color: theme.vars.palette.text.primary,
  '& .MuiAlert-icon': {
    color: theme.vars.palette.error.main
  }
});

function KpiCard({ title, value, helper, color = 'primary', icon }) {
  return (
    <Card
      sx={(theme) => ({
        ...surfaceCardSx(theme),
        background: `linear-gradient(135deg, ${withAlpha(theme.vars.palette[color]?.main || theme.vars.palette.primary.main, 0.16)} 0%, ${theme.vars.palette.surface.card} 58%, ${theme.vars.palette.surface.muted} 100%)`
      })}
    >
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1.5}>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">
              {title}
            </Typography>
            <Typography
              variant="h2"
              sx={{
                mt: 0.5,
                lineHeight: 1.15,
                overflowWrap: 'anywhere',
                fontSize: { xs: '1.5rem', md: '1.75rem' }
              }}
            >
              {value}
            </Typography>
            {helper ? (
              <Typography variant="caption" color="text.secondary">
                {helper}
              </Typography>
            ) : null}
          </Box>
          <Avatar
            variant="rounded"
            sx={(theme) => ({
              width: 46,
              height: 46,
              flexShrink: 0,
              bgcolor: withAlpha(theme.vars.palette[color]?.main || theme.vars.palette.primary.main, 0.2),
              color: theme.vars.palette[color]?.main || theme.vars.palette.primary.main,
              border: `1px solid ${withAlpha(theme.vars.palette[color]?.main || theme.vars.palette.primary.main, 0.35)}`
            })}
          >
            {icon}
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
}

function ChartCard({ title, helper, children }) {
  return (
    <Card
      sx={(theme) => ({
        ...surfaceCardSx(theme),
        height: '100%'
      })}
    >
      <CardContent>
        <Stack spacing={1.5}>
          <Box>
            <Typography variant="h4">{title}</Typography>
            {helper ? (
              <Typography variant="caption" color="text.secondary">
                {helper}
              </Typography>
            ) : null}
          </Box>
          <Divider />
          {children}
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function DashboardDefault() {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const { accessToken } = useAuth();
  const locale = (i18n?.resolvedLanguage || i18n?.language || 'es').startsWith('en') ? 'en-US' : 'es-HN';

  const {
    data: overviewData,
    error: overviewError,
    isLoading: loading,
    isValidating,
    refresh
  } = useLionTvOverview({
    enabled: Boolean(accessToken),
    scope: 'extended'
  });

  const collections = useMemo(
    () => ({
      customers: overviewData?.customers || [],
      subscriptions: overviewData?.subscriptions || [],
      invoices: overviewData?.invoices || [],
      licenses: overviewData?.licenses || [],
      lines: overviewData?.lines || [],
      commitments: overviewData?.commitments || [],
      managedAccounts: overviewData?.managedAccounts || [],
      purchases: overviewData?.purchases || [],
      potentialCustomers: overviewData?.potentialCustomers || []
    }),
    [overviewData]
  );

  const { customers, subscriptions, invoices, licenses, lines, commitments, managedAccounts, purchases, potentialCustomers } = collections;
  const totalRecords = useMemo(
    () =>
      customers.length +
      subscriptions.length +
      invoices.length +
      licenses.length +
      lines.length +
      commitments.length +
      managedAccounts.length +
      purchases.length +
      potentialCustomers.length,
    [customers, subscriptions, invoices, licenses, lines, commitments, managedAccounts, purchases, potentialCustomers]
  );

  const chartTheme = useMemo(() => {
    const textSecondary = theme.vars.palette.text.secondary;
    const dividerColor = withAlpha(theme.vars.palette.divider, 0.72);
    const crosshairFill = withAlpha(theme.vars.palette.primary.main, theme.palette.mode === 'dark' ? 0.16 : 0.08);

    return {
      baseChart: {
        fontFamily: theme.typography.fontFamily,
        foreColor: textSecondary,
        toolbar: { show: false },
        background: 'transparent'
      },
      states: {
        hover: { filter: { type: 'none' } },
        active: { filter: { type: 'none' } }
      },
      legend: (position = 'bottom', horizontalAlign = 'center') => ({
        position,
        horizontalAlign,
        labels: { colors: textSecondary },
        itemMargin: { horizontal: 10, vertical: 4 }
      }),
      xaxis: (categories) => ({
        categories,
        axisBorder: { color: dividerColor },
        axisTicks: { color: dividerColor },
        crosshairs: {
          show: true,
          position: 'back',
          stroke: {
            color: dividerColor,
            width: 1,
            dashArray: 0
          },
          fill: {
            type: 'solid',
            color: crosshairFill
          }
        },
        tooltip: {
          enabled: true,
          style: {
            color: textSecondary
          }
        },
        labels: {
          style: {
            colors: Array.isArray(categories) ? categories.map(() => textSecondary) : [textSecondary]
          }
        }
      }),
      yaxis: (formatter) => ({
        labels: {
          style: { colors: [textSecondary] },
          formatter
        }
      }),
      grid: {
        borderColor: dividerColor,
        strokeDashArray: 4
      },
      tooltip: {
        theme: theme.palette.mode === 'dark' ? 'dark' : 'light'
      }
    };
  }, [theme]);

  const metrics = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const customerTotal = customers.length;
    const customerActive = customers.filter((c) => toUpper(c.customerStatus ?? c.status) === 'ACTIVE').length;
    const customerInactive = customerTotal - customerActive;

    const subTotal = subscriptions.length;
    const subActive = subscriptions.filter((s) => toUpper(s.status) === 'ACTIVE').length;
    const subAutoPay = subscriptions.filter((s) => Boolean(s.automaticPay)).length;
    const subExpired = subscriptions.filter((s) => {
      const status = toUpper(s.status);
      const expiryDays = daysUntil(s.renewalDate ?? s.renewal_date ?? s.expDate ?? s.exp_date);
      return status === 'EXPIRED' || (expiryDays !== null && expiryDays < 0);
    }).length;
    const subExpiring7 = subscriptions.filter((s) => {
      const expiryDays = daysUntil(s.renewalDate ?? s.renewal_date ?? s.expDate ?? s.exp_date);
      return expiryDays !== null && expiryDays >= 0 && expiryDays <= 7;
    }).length;
    const subExpiring30 = subscriptions.filter((s) => {
      const expiryDays = daysUntil(s.renewalDate ?? s.renewal_date ?? s.expDate ?? s.exp_date);
      return expiryDays !== null && expiryDays >= 0 && expiryDays <= 30;
    }).length;
    const subAutoPayRate = subTotal > 0 ? (subAutoPay / subTotal) * 100 : 0;

    const invoicePaidList = invoices.filter((i) => toUpper(i.status) === 'PAID');
    const invoicePaid = invoicePaidList.length;
    const invoicePendingList = invoices.filter((i) => toUpper(i.status) === 'PENDING');
    const invoicePending = invoicePendingList.length;
    const invoiceOverdue = invoices.filter((i) => {
      const status = toUpper(i.status);
      const dueDays = daysUntil(i.dueDate ?? i.due_date ?? i.expirationDate ?? i.expiration_date);
      return status === 'OVERDUE' || (status === 'PENDING' && dueDays !== null && dueDays < 0);
    }).length;

    const invoicePaidAmount = invoices.reduce((acc, i) => acc + money(i.amountPaid ?? i.amount_paid), 0);
    const invoiceDiscountTotal = invoices.reduce((acc, i) => acc + money(i.amountDiscount ?? i.amount_discount), 0);
    const invoicePendingAmount = invoices.reduce((acc, i) => {
      const due = money(i.amountDue ?? i.amount_due ?? i.totalAmount ?? i.total_amount);
      const paid = money(i.amountPaid ?? i.amount_paid);
      const pending = money(i.pendingAmount ?? i.pending_amount ?? Math.max(due - paid, 0));
      return acc + pending;
    }, 0);
    const invoiceNet = invoicePaidAmount - invoiceDiscountTotal;
    const invoiceAvgTicket = invoicePaid > 0 ? invoiceNet / invoicePaid : 0;
    const invoiceCollectionRate =
      invoicePaidAmount + invoicePendingAmount > 0 ? (invoicePaidAmount / (invoicePaidAmount + invoicePendingAmount)) * 100 : 0;
    const invoiceCashThisMonth = invoices.reduce((acc, i) => {
      const date = parseDate(i.paymentDate ?? i.payment_date ?? i.invoiceDate ?? i.invoice_date ?? i.createdAt ?? i.created_at);
      if (!date || date.getFullYear() !== currentYear || date.getMonth() !== currentMonth) return acc;
      return acc + money(i.amountPaid ?? i.amount_paid) - money(i.amountDiscount ?? i.amount_discount);
    }, 0);

    const licenseTotal = licenses.length;
    const licensePaid = licenses.filter((l) => isTruthyFlag(l.isPaid ?? l.is_paid ?? l.paid)).length;
    const licenseUnpaid = licenseTotal - licensePaid;
    const licenseAvailable = licenses.filter((l) => toUpper(l.status) === 'AVAILABLE').length;
    const licenseAssigned = licenseTotal - licenseAvailable;
    const licenseExpiring30 = licenses.filter((l) => {
      const expiryDays = daysUntil(l.expireAt ?? l.expire_at ?? l.expDate ?? l.exp_date);
      return expiryDays !== null && expiryDays >= 0 && expiryDays <= 30;
    }).length;
    const licenseExpired = licenses.filter((l) => {
      const expiryDays = daysUntil(l.expireAt ?? l.expire_at ?? l.expDate ?? l.exp_date);
      return expiryDays !== null && expiryDays < 0;
    }).length;

    const commitmentTotal = commitments.length;
    const commitmentPaid = commitments.filter((c) => toUpper(c.status) === 'PAID').length;
    const commitmentRecoveredAmount = commitments.reduce((acc, c) => acc + money(c.amountPaid ?? c.amount_paid), 0);
    const commitmentPendingAmount = commitments.reduce((acc, c) => {
      const due = money(c.amountDue ?? c.amount_due);
      const paid = money(c.amountPaid ?? c.amount_paid);
      const pending = money(c.pendingAmount ?? c.pending_amount ?? Math.max(due - paid, 0));
      return acc + pending;
    }, 0);
    const commitmentOverdue = commitments.filter((c) => {
      const due = money(c.amountDue ?? c.amount_due);
      const paid = money(c.amountPaid ?? c.amount_paid);
      const pending = money(c.pendingAmount ?? c.pending_amount ?? Math.max(due - paid, 0));
      const dueDays = daysUntil(c.commitmentDate ?? c.commitment_date ?? c.dueDate ?? c.due_date);
      return pending > 0 && dueDays !== null && dueDays < 0;
    }).length;

    const managedTotal = managedAccounts.length;
    const managedActive = managedAccounts.filter((m) => toUpper(m.accountStatus ?? m.status) === 'ACTIVE').length;
    const managedExpired = managedAccounts.filter((m) => {
      const status = toUpper(m.accountStatus ?? m.status);
      const expiryDays = daysUntil(m.expirationDate ?? m.expiration_date);
      return status === 'EXPIRED' || (expiryDays !== null && expiryDays < 0);
    }).length;
    const managedExpiring30 = managedAccounts.filter((m) => {
      const expiryDays = daysUntil(m.expirationDate ?? m.expiration_date);
      return expiryDays !== null && expiryDays >= 0 && expiryDays <= 30;
    }).length;
    const managedDistributionEnabled = managedAccounts.filter((m) => Boolean(m.allowDistribution ?? m.allow_distribution)).length;

    const potentialTotal = potentialCustomers.length;
    const potentialConverted = potentialCustomers.filter((p) => toUpper(p.status) === 'CONVERTED').length;
    const potentialOpen = potentialTotal - potentialConverted;
    const potentialConversionRate = potentialTotal > 0 ? (potentialConverted / potentialTotal) * 100 : 0;

    const purchasesYear = purchases.reduce((acc, p) => {
      const date = parseDate(p.purchaseDate ?? p.purchase_date ?? p.createdAt ?? p.created_at);
      if (!date || date.getFullYear() !== currentYear) return acc;
      return acc + money(p.totalAmount ?? p.total_amount);
    }, 0);
    const purchasesThisMonth = purchases.reduce((acc, p) => {
      const date = parseDate(p.purchaseDate ?? p.purchase_date ?? p.createdAt ?? p.created_at);
      if (!date || date.getFullYear() !== currentYear || date.getMonth() !== currentMonth) return acc;
      return acc + money(p.totalAmount ?? p.total_amount);
    }, 0);

    const linesTotal = lines.length;
    const linesEnabled = lines.filter((l) => l.enabled === true || l.enabled === 1 || l.enabled === '1').length;
    const linesDisabled = linesTotal - linesEnabled;
    const linesExpired = lines.filter((l) => {
      const expiryDays = daysUntil(l.expDate ?? l.exp_date);
      return expiryDays !== null && expiryDays < 0;
    }).length;
    const linesExpiring7 = lines.filter((l) => {
      const expiryDays = daysUntil(l.expDate ?? l.exp_date);
      return expiryDays !== null && expiryDays >= 0 && expiryDays <= 7;
    }).length;
    const linesExpiring30 = lines.filter((l) => {
      const expiryDays = daysUntil(l.expDate ?? l.exp_date);
      return expiryDays !== null && expiryDays >= 0 && expiryDays <= 30;
    }).length;
    const linePlusCount = lines.filter((l) =>
      String(l.packageName ?? l.package_name ?? '')
        .toUpperCase()
        .includes('LION_PLUS+')
    ).length;

    return {
      customerTotal,
      customerActive,
      customerInactive,
      subTotal,
      subActive,
      subAutoPay,
      subExpired,
      subExpiring7,
      subExpiring30,
      subAutoPayRate,
      invoicePaid,
      invoicePending,
      invoiceOverdue,
      invoicePaidAmount,
      invoicePendingAmount,
      invoiceDiscountTotal,
      invoiceNet,
      invoiceAvgTicket,
      invoiceCollectionRate,
      invoiceCashThisMonth,
      licenseTotal,
      licensePaid,
      licenseUnpaid,
      licenseAvailable,
      licenseAssigned,
      licenseExpiring30,
      licenseExpired,
      commitmentTotal,
      commitmentPaid,
      commitmentOverdue,
      commitmentRecoveredAmount,
      commitmentPendingAmount,
      managedTotal,
      managedActive,
      managedExpired,
      managedExpiring30,
      managedDistributionEnabled,
      potentialTotal,
      potentialConverted,
      potentialOpen,
      potentialConversionRate,
      linesTotal,
      linesEnabled,
      linesDisabled,
      linesExpired,
      linesExpiring7,
      linesExpiring30,
      linePlusCount,
      purchasesThisMonth,
      purchasesYear
    };
  }, [customers, subscriptions, invoices, licenses, commitments, managedAccounts, potentialCustomers, purchases, lines]);

  const donutChart = useMemo(() => {
    const labels = [
      t('dashboardDefault.labels.customers'),
      t('dashboardDefault.labels.subscriptions'),
      t('dashboardDefault.labels.invoices'),
      t('dashboardDefault.labels.lines'),
      t('dashboardDefault.labels.licenses'),
      t('dashboardDefault.labels.managedAccounts')
    ];
    const series = [customers.length, subscriptions.length, invoices.length, lines.length, licenses.length, managedAccounts.length];
    return {
      series,
      options: {
        chart: { ...chartTheme.baseChart, type: 'donut' },
        states: chartTheme.states,
        labels,
        dataLabels: { enabled: false },
        legend: chartTheme.legend('bottom', 'center'),
        stroke: { colors: [theme.vars.palette.surface.card] },
        colors: [
          theme.palette.primary.main,
          theme.palette.success.main,
          theme.palette.info.main,
          theme.palette.warning.main,
          theme.palette.secondary.main,
          theme.palette.error.main
        ],
        tooltip: {
          ...chartTheme.tooltip,
          y: {
            formatter: (value) => `${value}`
          }
        }
      }
    };
  }, [customers.length, subscriptions.length, invoices.length, lines.length, licenses.length, managedAccounts.length, theme, chartTheme, t]);

  const statusBar = useMemo(() => {
    const subsRisk = subscriptions.filter((s) => {
      const status = toUpper(s.status);
      const days = daysUntil(s.renewalDate);
      return status !== 'ACTIVE' || (days !== null && days <= 30);
    }).length;

    const invoiceRisk = invoices.filter((i) => toUpper(i.status) === 'PENDING').length;

    const licenseOk = licenses.filter((l) => {
      const status = toUpper(l.status);
      const raw = l.isPaid ?? l.is_paid ?? l.paid;
      const isPaid = raw === true || raw === 1 || raw === '1' || String(raw).toLowerCase() === 'true';
      return status === 'ACTIVE' && isPaid;
    }).length;

    const licenseRisk = licenses.length - licenseOk;

    const commitOk = commitments.filter((c) => toUpper(c.status) === 'PAID').length;
    const commitRisk = commitments.length - commitOk;

    const managedOk = managedAccounts.filter((m) => {
      const status = toUpper(m.accountStatus ?? m.status);
      const days = daysUntil(m.expirationDate ?? m.expiration_date);
      return status === 'ACTIVE' && (days === null || days > 30);
    }).length;
    const managedRisk = managedAccounts.length - managedOk;

    return {
      series: [
        { name: t('dashboardDefault.series.ok'), data: [metrics.subActive, metrics.invoicePaid, licenseOk, commitOk, managedOk] },
        {
          name: t('dashboardDefault.series.riskPending'),
          data: [subsRisk, invoiceRisk, licenseRisk, commitRisk, managedRisk]
        }
      ],
      options: {
        chart: { ...chartTheme.baseChart, type: 'bar', stacked: true },
        states: chartTheme.states,
        plotOptions: { bar: { columnWidth: '42%', borderRadius: 4 } },
        xaxis: chartTheme.xaxis([
          t('dashboardDefault.categories.subsShort'),
          t('dashboardDefault.categories.invoices'),
          t('dashboardDefault.categories.licenses'),
          t('dashboardDefault.categories.commitments'),
          t('dashboardDefault.categories.managedShort')
        ]),
        yaxis: chartTheme.yaxis((v) => Math.round(v)),
        grid: chartTheme.grid,
        colors: [theme.palette.success.main, theme.palette.warning.main],
        legend: chartTheme.legend('top', 'right'),
        dataLabels: { enabled: false },
        tooltip: chartTheme.tooltip
      }
    };
  }, [subscriptions, invoices, licenses, commitments, managedAccounts, metrics.subActive, metrics.invoicePaid, theme, chartTheme, t]);

  const monthlyTrend = useMemo(() => {
    const months = [
      t('dashboardDefault.months.jan'),
      t('dashboardDefault.months.feb'),
      t('dashboardDefault.months.mar'),
      t('dashboardDefault.months.apr'),
      t('dashboardDefault.months.may'),
      t('dashboardDefault.months.jun'),
      t('dashboardDefault.months.jul'),
      t('dashboardDefault.months.aug'),
      t('dashboardDefault.months.sep'),
      t('dashboardDefault.months.oct'),
      t('dashboardDefault.months.nov'),
      t('dashboardDefault.months.dec')
    ];
    const year = new Date().getFullYear();

    const income = new Array(12).fill(0);
    invoices.forEach((inv) => {
      const date = parseDate(inv.paymentDate);
      if (!date || date.getFullYear() !== year) return;
      income[date.getMonth()] += money(inv.amountPaid) - money(inv.amountDiscount);
    });

    const expenses = new Array(12).fill(0);
    purchases.forEach((purchase) => {
      const date = parseDate(purchase.purchaseDate ?? purchase.purchase_date);
      if (!date || date.getFullYear() !== year) return;
      expenses[date.getMonth()] += money(purchase.totalAmount ?? purchase.total_amount);
    });

    return {
      series: [
        { name: t('dashboardDefault.series.income'), data: income.map((v) => Number(v.toFixed(2))) },
        { name: t('dashboardDefault.series.expenses'), data: expenses.map((v) => Number(v.toFixed(2))) }
      ],
      options: {
        chart: { ...chartTheme.baseChart, type: 'area' },
        states: chartTheme.states,
        stroke: { curve: 'smooth', width: 3 },
        fill: { type: 'gradient', gradient: { shadeIntensity: 0.3, opacityFrom: 0.45, opacityTo: 0.08, stops: [0, 90, 100] } },
        dataLabels: { enabled: false },
        xaxis: chartTheme.xaxis(months),
        yaxis: chartTheme.yaxis((v) => {
          if (Math.abs(v) >= 1000) return `${(v / 1000).toFixed(1)}k`;
          return `${Math.round(v)}`;
        }),
        grid: chartTheme.grid,
        tooltip: { ...chartTheme.tooltip, y: { formatter: (v) => formatMoney(v, locale) } },
        colors: [theme.palette.success.main, theme.palette.error.main],
        legend: chartTheme.legend('top', 'right')
      }
    };
  }, [invoices, purchases, theme, chartTheme, t, locale]);

  const expiryChart = useMemo(() => {
    const sub = bucketByDays(subscriptions.map((s) => s.renewalDate ?? s.renewal_date ?? s.expDate ?? s.exp_date));
    const lic = bucketByDays(licenses.map((l) => l.expireAt ?? l.expire_at));
    const managed = bucketByDays(managedAccounts.map((m) => m.expirationDate ?? m.expiration_date));

    return {
      series: [
        { name: t('dashboardDefault.labels.subscriptions'), data: [sub.overdue, sub.today, sub.week, sub.month] },
        { name: t('dashboardDefault.labels.licenses'), data: [lic.overdue, lic.today, lic.week, lic.month] },
        { name: t('dashboardDefault.labels.managedAccounts'), data: [managed.overdue, managed.today, managed.week, managed.month] }
      ],
      options: {
        chart: { ...chartTheme.baseChart, type: 'bar' },
        states: chartTheme.states,
        plotOptions: { bar: { horizontal: false, borderRadius: 3, columnWidth: '45%' } },
        xaxis: chartTheme.xaxis([
          t('dashboardDefault.categories.overdue'),
          t('dashboardDefault.categories.today'),
          t('dashboardDefault.categories.oneToSevenDays'),
          t('dashboardDefault.categories.eightToThirtyDays')
        ]),
        yaxis: chartTheme.yaxis((v) => Math.round(v)),
        grid: chartTheme.grid,
        colors: [theme.palette.primary.main, theme.palette.secondary.main, theme.palette.info.main],
        dataLabels: { enabled: false },
        legend: chartTheme.legend('top', 'right'),
        tooltip: chartTheme.tooltip
      }
    };
  }, [subscriptions, licenses, managedAccounts, theme, chartTheme, t]);

  const providerMixChart = useMemo(() => {
    const providerCount = new Map();
    lines.forEach((line) => {
      const providerName = String(line.provider ?? line.providerName ?? line.provider_name ?? t('dashboardDefault.provider.noProvider')).trim();
      providerCount.set(providerName, (providerCount.get(providerName) || 0) + 1);
    });

    if (providerCount.size === 0) {
      subscriptions.forEach((sub) => {
        const providerName = String(sub.provider ?? sub.providerName ?? sub.provider_name ?? t('dashboardDefault.provider.noProvider')).trim();
        providerCount.set(providerName, (providerCount.get(providerName) || 0) + 1);
      });
    }

    const sorted = Array.from(providerCount.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    return {
      series: [{ name: t('dashboardDefault.series.records'), data: sorted.map((x) => x.count) }],
      options: {
        chart: { ...chartTheme.baseChart, type: 'bar' },
        states: chartTheme.states,
        plotOptions: { bar: { horizontal: true, borderRadius: 4, barHeight: '42%' } },
        xaxis: chartTheme.xaxis(sorted.map((x) => x.name)),
        yaxis: chartTheme.yaxis((v) => `${v}`),
        grid: chartTheme.grid,
        dataLabels: { enabled: false },
        colors: [theme.palette.primary.main],
        legend: chartTheme.legend('top', 'right'),
        tooltip: chartTheme.tooltip
      }
    };
  }, [lines, subscriptions, theme, chartTheme, t]);

  const commitmentsChart = useMemo(() => {
    const pending = Math.max(metrics.commitmentTotal - metrics.commitmentPaid - metrics.commitmentOverdue, 0);

    return {
      series: [metrics.commitmentPaid, pending, metrics.commitmentOverdue],
      options: {
        chart: { ...chartTheme.baseChart, type: 'donut' },
        states: chartTheme.states,
        labels: [t('dashboardDefault.labels.paid'), t('dashboardDefault.labels.pending'), t('dashboardDefault.labels.overdue')],
        legend: chartTheme.legend('bottom', 'center'),
        dataLabels: { enabled: false },
        colors: [theme.palette.success.main, theme.palette.warning.main, theme.palette.error.main],
        stroke: { colors: [theme.vars.palette.surface.card] },
        tooltip: chartTheme.tooltip
      }
    };
  }, [metrics.commitmentOverdue, metrics.commitmentPaid, metrics.commitmentTotal, theme, chartTheme, t]);

  const funnelChart = useMemo(() => {
    return {
      series: [
        {
          name: t('dashboardDefault.series.pipeline'),
          data: [metrics.potentialTotal, metrics.customerTotal, metrics.customerActive, metrics.subActive, metrics.invoicePaid]
        }
      ],
      options: {
        chart: { ...chartTheme.baseChart, type: 'bar' },
        states: chartTheme.states,
        plotOptions: { bar: { borderRadius: 4, columnWidth: '48%' } },
        xaxis: chartTheme.xaxis([
          t('dashboardDefault.categories.prospects'),
          t('dashboardDefault.categories.customers'),
          t('dashboardDefault.categories.activeCustomers'),
          t('dashboardDefault.categories.activeSubscriptions'),
          t('dashboardDefault.categories.paidInvoices')
        ]),
        yaxis: chartTheme.yaxis((v) => Math.round(v)),
        grid: chartTheme.grid,
        dataLabels: { enabled: false },
        colors: [theme.palette.info.main],
        legend: chartTheme.legend('top', 'right'),
        tooltip: chartTheme.tooltip
      }
    };
  }, [metrics.customerActive, metrics.customerTotal, metrics.invoicePaid, metrics.potentialTotal, metrics.subActive, theme, chartTheme, t]);

  const executiveKpis = useMemo(
    () => [
      {
        key: 'customer-active',
        title: t('dashboardDefault.kpis.executive.customerActive.title'),
        value: metrics.customerActive,
        helper: t('dashboardDefault.kpis.executive.customerActive.helper', { total: metrics.customerTotal }),
        icon: <PeopleAltIcon fontSize="small" />,
        color: 'primary'
      },
      {
        key: 'sub-active',
        title: t('dashboardDefault.kpis.executive.subscriptionsActive.title'),
        value: metrics.subActive,
        helper: t('dashboardDefault.kpis.executive.subscriptionsActive.helper', { total: metrics.subTotal }),
        icon: <CreditCardIcon fontSize="small" />,
        color: 'success'
      },
      {
        key: 'income-net',
        title: t('dashboardDefault.kpis.executive.netIncome.title'),
        value: formatMoney(metrics.invoiceNet, locale),
        helper: t('dashboardDefault.kpis.executive.netIncome.helper', {
          paid: metrics.invoicePaid,
          pending: metrics.invoicePending
        }),
        icon: <AttachMoneyIcon fontSize="small" />,
        color: 'info'
      },
      {
        key: 'annual-balance',
        title: t('dashboardDefault.kpis.executive.annualBalance.title'),
        value: formatMoney(metrics.invoiceNet - metrics.purchasesYear, locale),
        helper: t('dashboardDefault.kpis.executive.annualBalance.helper', { expenses: formatMoney(metrics.purchasesYear, locale) }),
        icon: <AccountBalanceWalletIcon fontSize="small" />,
        color: metrics.invoiceNet - metrics.purchasesYear >= 0 ? 'success' : 'error'
      },
      {
        key: 'pending-commitments',
        title: t('dashboardDefault.kpis.executive.pendingCommitments.title'),
        value: formatMoney(metrics.commitmentPendingAmount, locale),
        helper: t('dashboardDefault.kpis.executive.pendingCommitments.helper', { total: metrics.commitmentTotal }),
        icon: <ReceiptLongIcon fontSize="small" />,
        color: 'warning'
      },
      {
        key: 'managed-active',
        title: t('dashboardDefault.kpis.executive.managedActive.title'),
        value: `${metrics.managedActive}/${metrics.managedTotal}`,
        helper: t('dashboardDefault.kpis.executive.managedActive.helper', { expiring: metrics.managedExpiring30 }),
        icon: <AssessmentIcon fontSize="small" />,
        color: 'secondary'
      }
    ],
    [metrics, t, locale]
  );

  const financialKpis = useMemo(
    () => [
      {
        key: 'collection-rate',
        title: t('dashboardDefault.kpis.financial.collectionRate.title'),
        value: formatPercent(metrics.invoiceCollectionRate),
        helper: t('dashboardDefault.kpis.financial.collectionRate.helper', {
          amount: formatMoney(metrics.invoicePaidAmount, locale)
        }),
        icon: <TrendingUpIcon fontSize="small" />,
        color: 'success'
      },
      {
        key: 'avg-ticket',
        title: t('dashboardDefault.kpis.financial.averageTicket.title'),
        value: formatMoney(metrics.invoiceAvgTicket, locale),
        helper: t('dashboardDefault.kpis.financial.averageTicket.helper', { paid: metrics.invoicePaid }),
        icon: <AttachMoneyIcon fontSize="small" />,
        color: 'info'
      },
      {
        key: 'pending-invoice-amount',
        title: t('dashboardDefault.kpis.financial.pendingAmount.title'),
        value: formatMoney(metrics.invoicePendingAmount, locale),
        helper: t('dashboardDefault.kpis.financial.pendingAmount.helper', { overdue: metrics.invoiceOverdue }),
        icon: <TrendingDownIcon fontSize="small" />,
        color: 'warning'
      },
      {
        key: 'discount-total',
        title: t('dashboardDefault.kpis.financial.discountTotal.title'),
        value: formatMoney(metrics.invoiceDiscountTotal, locale),
        helper: t('dashboardDefault.kpis.financial.discountTotal.helper'),
        icon: <ReceiptLongIcon fontSize="small" />,
        color: 'secondary'
      },
      {
        key: 'cash-month',
        title: t('dashboardDefault.kpis.financial.cashMonth.title'),
        value: formatMoney(metrics.invoiceCashThisMonth, locale),
        helper: t('dashboardDefault.kpis.financial.cashMonth.helper', { purchases: formatMoney(metrics.purchasesThisMonth, locale) }),
        icon: <TimelineIcon fontSize="small" />,
        color: metrics.invoiceCashThisMonth - metrics.purchasesThisMonth >= 0 ? 'success' : 'error'
      },
      {
        key: 'commitment-recovered',
        title: t('dashboardDefault.kpis.financial.recoveredCommitments.title'),
        value: formatMoney(metrics.commitmentRecoveredAmount, locale),
        helper: t('dashboardDefault.kpis.financial.recoveredCommitments.helper', { paid: metrics.commitmentPaid }),
        icon: <AutorenewIcon fontSize="small" />,
        color: 'primary'
      }
    ],
    [metrics, t, locale]
  );

  const operationalKpis = useMemo(
    () => [
      {
        key: 'sub-expiring',
        title: t('dashboardDefault.kpis.operational.subsExpiring.title'),
        value: metrics.subExpiring7,
        helper: t('dashboardDefault.kpis.operational.subsExpiring.helper', { within30: metrics.subExpiring30 }),
        icon: <WarningAmberIcon fontSize="small" />,
        color: 'warning'
      },
      {
        key: 'sub-autopay',
        title: t('dashboardDefault.kpis.operational.autoPay.title'),
        value: formatPercent(metrics.subAutoPayRate),
        helper: t('dashboardDefault.kpis.operational.autoPay.helper', { autoPay: metrics.subAutoPay, total: metrics.subTotal }),
        icon: <AutorenewIcon fontSize="small" />,
        color: 'success'
      },
      {
        key: 'license-paid',
        title: t('dashboardDefault.kpis.operational.licensesPaid.title'),
        value: `${metrics.licensePaid}/${metrics.licenseTotal}`,
        helper: t('dashboardDefault.kpis.operational.licensesPaid.helper', { unpaid: metrics.licenseUnpaid }),
        icon: <KeyIcon fontSize="small" />,
        color: 'secondary'
      },
      {
        key: 'license-availability',
        title: t('dashboardDefault.kpis.operational.licensesAvailable.title'),
        value: `${metrics.licenseAvailable}/${metrics.licenseTotal}`,
        helper: t('dashboardDefault.kpis.operational.licensesAvailable.helper', { assigned: metrics.licenseAssigned }),
        icon: <KeyIcon fontSize="small" />,
        color: 'info'
      },
      {
        key: 'line-plus',
        title: t('dashboardDefault.kpis.operational.linePlus.title'),
        value: `${metrics.linePlusCount}/${metrics.linesTotal}`,
        helper: t('dashboardDefault.kpis.operational.linePlus.helper', { expiring7: metrics.linesExpiring7 }),
        icon: <CreditCardIcon fontSize="small" />,
        color: 'primary'
      },
      {
        key: 'prospect-conversion',
        title: t('dashboardDefault.kpis.operational.prospectConversion.title'),
        value: formatPercent(metrics.potentialConversionRate),
        helper: t('dashboardDefault.kpis.operational.prospectConversion.helper', {
          converted: metrics.potentialConverted,
          total: metrics.potentialTotal
        }),
        icon: <PeopleAltIcon fontSize="small" />,
        color: 'info'
      }
    ],
    [metrics, t]
  );

  if (loading && totalRecords === 0) {
    return <PageLoadingState label={t('dashboardDefault.states.loading')} />;
  }

  if (overviewError && totalRecords === 0) {
    return (
      <PageErrorState
        message={overviewError?.response?.data?.message || t('dashboardDefault.states.loadError')}
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (!loading && !overviewError && totalRecords === 0) {
    return <PageEmptyState message={t('dashboardDefault.states.empty')} />;
  }

  return (
    <Grid container spacing={gridSpacing}>
      <Grid size={12}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between">
          <Box>
            <Typography variant="h3">{t('dashboardDefault.title', 'Dashboard ejecutivo')}</Typography>
            <Typography variant="body2" color="text.secondary">
              {t('dashboardDefault.subtitle', 'KPIs financieros, operativos y comerciales en tiempo real.')}
            </Typography>
          </Box>
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => refresh()} disabled={isValidating}>
            {isValidating ? t('dashboardDefault.actions.refreshing', 'Actualizando...') : t('dashboardDefault.actions.refresh', 'Refrescar')}
          </Button>
        </Stack>
      </Grid>

      <Grid size={12}>
        <Alert severity="info" variant="outlined" sx={infoAlertSx}>
          {t('dashboardDefault.states.kpiSubtitle')}
        </Alert>
      </Grid>

      {overviewData?.meta?.partial ? (
        <Grid size={12}>
          <Alert severity="warning" variant="outlined" sx={warningAlertSx}>
            {t('dashboardDefault.states.partial')}
          </Alert>
        </Grid>
      ) : null}

      {overviewError ? (
        <Grid size={12}>
          <Alert severity="error" variant="outlined" sx={errorAlertSx}>
            {overviewError?.response?.data?.message || t('dashboardDefault.states.loadError')}
          </Alert>
        </Grid>
      ) : null}

      <Grid size={12}>
        <Typography variant="h4">{t('dashboardDefault.sections.executive')}</Typography>
      </Grid>
      {executiveKpis.map((card) => (
        <Grid key={card.key} size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <KpiCard title={card.title} value={card.value} helper={card.helper} icon={card.icon} color={card.color} />
        </Grid>
      ))}

      <Grid size={12}>
        <Typography variant="h4">{t('dashboardDefault.sections.financial')}</Typography>
      </Grid>
      {financialKpis.map((card) => (
        <Grid key={card.key} size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <KpiCard title={card.title} value={card.value} helper={card.helper} icon={card.icon} color={card.color} />
        </Grid>
      ))}

      <Grid size={12}>
        <Typography variant="h4">{t('dashboardDefault.sections.operational')}</Typography>
      </Grid>
      {operationalKpis.map((card) => (
        <Grid key={card.key} size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <KpiCard title={card.title} value={card.value} helper={card.helper} icon={card.icon} color={card.color} />
        </Grid>
      ))}

      <Grid size={{ xs: 12, md: 4 }}>
        <ChartCard
          title={t('dashboardDefault.charts.portfolio.title')}
          helper={t('dashboardDefault.charts.portfolio.helper')}
        >
          <LazyApexChart options={donutChart.options} series={donutChart.series} type="donut" height={330} />
        </ChartCard>
      </Grid>

      <Grid size={{ xs: 12, md: 8 }}>
        <ChartCard
          title={t('dashboardDefault.charts.status.title')}
          helper={t('dashboardDefault.charts.status.helper')}
        >
          <LazyApexChart options={statusBar.options} series={statusBar.series} type="bar" height={330} />
        </ChartCard>
      </Grid>

      <Grid size={{ xs: 12, md: 8 }}>
        <ChartCard
          title={t('dashboardDefault.charts.cashflow.title')}
          helper={t('dashboardDefault.charts.cashflow.helper')}
        >
          <LazyApexChart options={monthlyTrend.options} series={monthlyTrend.series} type="area" height={350} />
        </ChartCard>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <ChartCard
          title={t('dashboardDefault.charts.expiry.title')}
          helper={t('dashboardDefault.charts.expiry.helper')}
        >
          <LazyApexChart options={expiryChart.options} series={expiryChart.series} type="bar" height={350} />
          <Divider />
          <Stack spacing={0.8} sx={{ mt: 0.5 }}>
            <Chip
              size="small"
              color="success"
              variant="outlined"
              label={t('dashboardDefault.chips.autoPay', { autoPay: metrics.subAutoPay, total: metrics.subTotal })}
            />
            <Chip
              size="small"
              color="info"
              variant="outlined"
              label={t('dashboardDefault.chips.managedActive', { active: metrics.managedActive, total: metrics.managedTotal })}
            />
            <Chip
              size="small"
              color="warning"
              variant="outlined"
              label={t('dashboardDefault.chips.prospectsConverted', {
                converted: metrics.potentialConverted,
                total: metrics.potentialTotal
              })}
            />
          </Stack>
        </ChartCard>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <ChartCard title={t('dashboardDefault.charts.commitments.title')} helper={t('dashboardDefault.charts.commitments.helper')}>
          <LazyApexChart options={commitmentsChart.options} series={commitmentsChart.series} type="donut" height={330} />
          <Divider />
          <Stack spacing={0.8} sx={{ mt: 0.5 }}>
            <Chip
              size="small"
              color="success"
              variant="outlined"
              label={t('dashboardDefault.chips.recovered', { amount: formatMoney(metrics.commitmentRecoveredAmount, locale) })}
            />
            <Chip
              size="small"
              color="warning"
              variant="outlined"
              label={t('dashboardDefault.chips.pending', { amount: formatMoney(metrics.commitmentPendingAmount, locale) })}
            />
          </Stack>
        </ChartCard>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <ChartCard title={t('dashboardDefault.charts.providerMix.title')} helper={t('dashboardDefault.charts.providerMix.helper')}>
          <LazyApexChart options={providerMixChart.options} series={providerMixChart.series} type="bar" height={330} />
          <Divider />
          <Stack spacing={0.8} sx={{ mt: 0.5 }}>
            <Chip size="small" color="primary" variant="outlined" label={t('dashboardDefault.chips.linePlus', { count: metrics.linePlusCount })} />
            <Chip size="small" color="warning" variant="outlined" label={t('dashboardDefault.chips.linesExpired', { count: metrics.linesExpired })} />
          </Stack>
        </ChartCard>
      </Grid>

      <Grid size={12}>
        <ChartCard title={t('dashboardDefault.charts.funnel.title')} helper={t('dashboardDefault.charts.funnel.helper')}>
          <LazyApexChart options={funnelChart.options} series={funnelChart.series} type="bar" height={290} />
          <Divider />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Chip size="small" color="info" variant="outlined" label={t('dashboardDefault.chips.openProspects', { count: metrics.potentialOpen })} />
            <Chip size="small" color="success" variant="outlined" label={t('dashboardDefault.chips.inactiveCustomers', { count: metrics.customerInactive })} />
            <Chip size="small" color="warning" variant="outlined" label={t('dashboardDefault.chips.expiredSubs', { count: metrics.subExpired })} />
            <Chip size="small" color="secondary" variant="outlined" label={t('dashboardDefault.chips.expiringLicenses30d', { count: metrics.licenseExpiring30 })} />
          </Stack>
        </ChartCard>
      </Grid>
    </Grid>
  );
}
