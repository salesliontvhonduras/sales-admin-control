import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import useAuth from 'hooks/useAuth';

import Grid from '@mui/material/Grid';
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

import { gridSpacing } from 'store/constant';
import { useLionTvOverview } from 'api/liontv-overview';
import LazyApexChart from 'ui-component/charts/LazyApexChart';
import { PageEmptyState, PageErrorState, PageLoadingState } from 'ui-component/feedback/PageState';

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

function formatMoney(value) {
  return new Intl.NumberFormat('es-HN', {
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

function KpiCard({ title, value, helper, color = 'primary', icon }) {
  return (
    <Card
      sx={(theme) => ({
        borderRadius: 2.5,
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 10px 26px rgba(15, 23, 42, 0.08)',
        background:
          theme.palette.mode === 'light'
            ? `linear-gradient(135deg, ${theme.palette[color]?.light || theme.palette.primary.light}1f 0%, ${theme.palette.background.paper} 70%)`
            : theme.palette.background.paper
      })}
    >
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1.5}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {title}
            </Typography>
            <Typography variant="h2" sx={{ mt: 0.5 }}>
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
              bgcolor: theme.palette[color]?.lighter || theme.palette.primary.lighter,
              color: theme.palette[color]?.main || theme.palette.primary.main
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
    <Card sx={{ borderRadius: 2.5, border: '1px solid', borderColor: 'divider', height: '100%' }}>
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
  const { t } = useTranslation();
  const { accessToken } = useAuth();

  const {
    data: overviewData,
    error: overviewError,
    isLoading: loading
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
    const labels = ['Clientes', 'Suscripciones', 'Facturas', 'Líneas', 'Licencias', 'Managed'];
    const series = [customers.length, subscriptions.length, invoices.length, lines.length, licenses.length, managedAccounts.length];
    return {
      series,
      options: {
        chart: { type: 'donut', fontFamily: theme.typography.fontFamily },
        labels,
        dataLabels: { enabled: false },
        legend: { position: 'bottom' },
        stroke: { colors: [theme.palette.background.paper] },
        colors: [
          theme.palette.primary.main,
          theme.palette.success.main,
          theme.palette.info.main,
          theme.palette.warning.main,
          theme.palette.secondary.main,
          theme.palette.error.main
        ],
        tooltip: {
          y: {
            formatter: (value) => `${value}`
          }
        }
      }
    };
  }, [customers.length, subscriptions.length, invoices.length, lines.length, licenses.length, managedAccounts.length, theme]);

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
        { name: 'OK', data: [metrics.subActive, metrics.invoicePaid, licenseOk, commitOk, managedOk] },
        { name: 'Riesgo/Pendiente', data: [subsRisk, invoiceRisk, licenseRisk, commitRisk, managedRisk] }
      ],
      options: {
        chart: { type: 'bar', stacked: true, fontFamily: theme.typography.fontFamily, toolbar: { show: false } },
        plotOptions: { bar: { columnWidth: '42%', borderRadius: 4 } },
        xaxis: { categories: ['Subs', 'Facturas', 'Licencias', 'Compromisos', 'Managed'] },
        yaxis: { labels: { formatter: (v) => Math.round(v) } },
        colors: [theme.palette.success.main, theme.palette.warning.main],
        legend: { position: 'top', horizontalAlign: 'right' },
        dataLabels: { enabled: false }
      }
    };
  }, [subscriptions, invoices, licenses, commitments, managedAccounts, metrics.subActive, metrics.invoicePaid, theme]);

  const monthlyTrend = useMemo(() => {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
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
        { name: 'Ingresos', data: income.map((v) => Number(v.toFixed(2))) },
        { name: 'Gastos', data: expenses.map((v) => Number(v.toFixed(2))) }
      ],
      options: {
        chart: { type: 'area', fontFamily: theme.typography.fontFamily, toolbar: { show: false } },
        stroke: { curve: 'smooth', width: 3 },
        fill: { type: 'gradient', gradient: { shadeIntensity: 0.3, opacityFrom: 0.45, opacityTo: 0.08, stops: [0, 90, 100] } },
        dataLabels: { enabled: false },
        xaxis: { categories: months },
        yaxis: {
          labels: {
            formatter: (v) => {
              if (Math.abs(v) >= 1000) return `${(v / 1000).toFixed(1)}k`;
              return `${Math.round(v)}`;
            }
          }
        },
        tooltip: { y: { formatter: (v) => formatMoney(v) } },
        colors: [theme.palette.success.main, theme.palette.error.main],
        legend: { position: 'top', horizontalAlign: 'right' }
      }
    };
  }, [invoices, purchases, theme]);

  const expiryChart = useMemo(() => {
    const sub = bucketByDays(subscriptions.map((s) => s.renewalDate ?? s.renewal_date ?? s.expDate ?? s.exp_date));
    const lic = bucketByDays(licenses.map((l) => l.expireAt ?? l.expire_at));
    const managed = bucketByDays(managedAccounts.map((m) => m.expirationDate ?? m.expiration_date));

    return {
      series: [
        { name: 'Suscripciones', data: [sub.overdue, sub.today, sub.week, sub.month] },
        { name: 'Licencias', data: [lic.overdue, lic.today, lic.week, lic.month] },
        { name: 'Managed', data: [managed.overdue, managed.today, managed.week, managed.month] }
      ],
      options: {
        chart: { type: 'bar', fontFamily: theme.typography.fontFamily, toolbar: { show: false } },
        plotOptions: { bar: { horizontal: false, borderRadius: 3, columnWidth: '45%' } },
        xaxis: { categories: ['Vencidos', 'Hoy', '1-7 días', '8-30 días'] },
        colors: [theme.palette.primary.main, theme.palette.secondary.main, theme.palette.info.main],
        dataLabels: { enabled: false },
        legend: { position: 'top', horizontalAlign: 'right' }
      }
    };
  }, [subscriptions, licenses, managedAccounts, theme]);

  const providerMixChart = useMemo(() => {
    const providerCount = new Map();
    lines.forEach((line) => {
      const providerName = String(line.provider ?? line.providerName ?? line.provider_name ?? 'Sin proveedor').trim();
      providerCount.set(providerName, (providerCount.get(providerName) || 0) + 1);
    });

    if (providerCount.size === 0) {
      subscriptions.forEach((sub) => {
        const providerName = String(sub.provider ?? sub.providerName ?? sub.provider_name ?? 'Sin proveedor').trim();
        providerCount.set(providerName, (providerCount.get(providerName) || 0) + 1);
      });
    }

    const sorted = Array.from(providerCount.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    return {
      series: [{ name: 'Registros', data: sorted.map((x) => x.count) }],
      options: {
        chart: { type: 'bar', fontFamily: theme.typography.fontFamily, toolbar: { show: false } },
        plotOptions: { bar: { horizontal: true, borderRadius: 4, barHeight: '42%' } },
        xaxis: { categories: sorted.map((x) => x.name) },
        dataLabels: { enabled: false },
        colors: [theme.palette.primary.main]
      }
    };
  }, [lines, subscriptions, theme]);

  const commitmentsChart = useMemo(() => {
    const pending = Math.max(metrics.commitmentTotal - metrics.commitmentPaid - metrics.commitmentOverdue, 0);

    return {
      series: [metrics.commitmentPaid, pending, metrics.commitmentOverdue],
      options: {
        chart: { type: 'donut', fontFamily: theme.typography.fontFamily },
        labels: ['Pagados', 'Pendientes', 'Vencidos'],
        legend: { position: 'bottom' },
        dataLabels: { enabled: false },
        colors: [theme.palette.success.main, theme.palette.warning.main, theme.palette.error.main]
      }
    };
  }, [metrics.commitmentOverdue, metrics.commitmentPaid, metrics.commitmentTotal, theme]);

  const funnelChart = useMemo(() => {
    return {
      series: [
        {
          name: 'Pipeline',
          data: [metrics.potentialTotal, metrics.customerTotal, metrics.customerActive, metrics.subActive, metrics.invoicePaid]
        }
      ],
      options: {
        chart: { type: 'bar', fontFamily: theme.typography.fontFamily, toolbar: { show: false } },
        plotOptions: { bar: { borderRadius: 4, columnWidth: '48%' } },
        xaxis: { categories: ['Prospectos', 'Clientes', 'Clientes Activos', 'Subs Activas', 'Facturas Pagadas'] },
        dataLabels: { enabled: false },
        colors: [theme.palette.info.main]
      }
    };
  }, [metrics.customerActive, metrics.customerTotal, metrics.invoicePaid, metrics.potentialTotal, metrics.subActive, theme]);

  const executiveKpis = useMemo(
    () => [
      {
        key: 'customer-active',
        title: 'Clientes activos',
        value: metrics.customerActive,
        helper: `${metrics.customerTotal} total`,
        icon: <PeopleAltIcon fontSize="small" />,
        color: 'primary'
      },
      {
        key: 'sub-active',
        title: 'Subs activas',
        value: metrics.subActive,
        helper: `${metrics.subTotal} total`,
        icon: <CreditCardIcon fontSize="small" />,
        color: 'success'
      },
      {
        key: 'income-net',
        title: 'Ingreso neto',
        value: formatMoney(metrics.invoiceNet),
        helper: `${metrics.invoicePaid} pagadas · ${metrics.invoicePending} pendientes`,
        icon: <AttachMoneyIcon fontSize="small" />,
        color: 'info'
      },
      {
        key: 'annual-balance',
        title: 'Balance anual',
        value: formatMoney(metrics.invoiceNet - metrics.purchasesYear),
        helper: `${formatMoney(metrics.purchasesYear)} gastos`,
        icon: <AccountBalanceWalletIcon fontSize="small" />,
        color: metrics.invoiceNet - metrics.purchasesYear >= 0 ? 'success' : 'error'
      },
      {
        key: 'pending-commitments',
        title: 'Compromisos pendientes',
        value: formatMoney(metrics.commitmentPendingAmount),
        helper: `${metrics.commitmentTotal} compromisos`,
        icon: <ReceiptLongIcon fontSize="small" />,
        color: 'warning'
      },
      {
        key: 'managed-active',
        title: 'Managed activas',
        value: `${metrics.managedActive}/${metrics.managedTotal}`,
        helper: `${metrics.managedExpiring30} vencen en 30 días`,
        icon: <AssessmentIcon fontSize="small" />,
        color: 'secondary'
      }
    ],
    [metrics]
  );

  const financialKpis = useMemo(
    () => [
      {
        key: 'collection-rate',
        title: 'Tasa de cobranza',
        value: formatPercent(metrics.invoiceCollectionRate),
        helper: `${formatMoney(metrics.invoicePaidAmount)} cobrado`,
        icon: <TrendingUpIcon fontSize="small" />,
        color: 'success'
      },
      {
        key: 'avg-ticket',
        title: 'Ticket promedio',
        value: formatMoney(metrics.invoiceAvgTicket),
        helper: `sobre ${metrics.invoicePaid} facturas pagadas`,
        icon: <AttachMoneyIcon fontSize="small" />,
        color: 'info'
      },
      {
        key: 'pending-invoice-amount',
        title: 'Monto por cobrar',
        value: formatMoney(metrics.invoicePendingAmount),
        helper: `${metrics.invoiceOverdue} vencidas`,
        icon: <TrendingDownIcon fontSize="small" />,
        color: 'warning'
      },
      {
        key: 'discount-total',
        title: 'Descuento aplicado',
        value: formatMoney(metrics.invoiceDiscountTotal),
        helper: 'acumulado de facturación',
        icon: <ReceiptLongIcon fontSize="small" />,
        color: 'secondary'
      },
      {
        key: 'cash-month',
        title: 'Caja mes actual',
        value: formatMoney(metrics.invoiceCashThisMonth),
        helper: `compras mes ${formatMoney(metrics.purchasesThisMonth)}`,
        icon: <TimelineIcon fontSize="small" />,
        color: metrics.invoiceCashThisMonth - metrics.purchasesThisMonth >= 0 ? 'success' : 'error'
      },
      {
        key: 'commitment-recovered',
        title: 'Recuperado compromisos',
        value: formatMoney(metrics.commitmentRecoveredAmount),
        helper: `${metrics.commitmentPaid} pagados`,
        icon: <AutorenewIcon fontSize="small" />,
        color: 'primary'
      }
    ],
    [metrics]
  );

  const operationalKpis = useMemo(
    () => [
      {
        key: 'sub-expiring',
        title: 'Subs vencen 7 días',
        value: metrics.subExpiring7,
        helper: `${metrics.subExpiring30} dentro de 30 días`,
        icon: <WarningAmberIcon fontSize="small" />,
        color: 'warning'
      },
      {
        key: 'sub-autopay',
        title: 'Cobro automático',
        value: formatPercent(metrics.subAutoPayRate),
        helper: `${metrics.subAutoPay}/${metrics.subTotal} suscripciones`,
        icon: <AutorenewIcon fontSize="small" />,
        color: 'success'
      },
      {
        key: 'license-paid',
        title: 'Licencias pagadas',
        value: `${metrics.licensePaid}/${metrics.licenseTotal}`,
        helper: `${metrics.licenseUnpaid} sin pago`,
        icon: <KeyIcon fontSize="small" />,
        color: 'secondary'
      },
      {
        key: 'license-availability',
        title: 'Licencias disponibles',
        value: `${metrics.licenseAvailable}/${metrics.licenseTotal}`,
        helper: `${metrics.licenseAssigned} asignadas`,
        icon: <KeyIcon fontSize="small" />,
        color: 'info'
      },
      {
        key: 'line-plus',
        title: 'Line Plus (LION_PLUS+)',
        value: `${metrics.linePlusCount}/${metrics.linesTotal}`,
        helper: `${metrics.linesExpiring7} vencen en 7 días`,
        icon: <CreditCardIcon fontSize="small" />,
        color: 'primary'
      },
      {
        key: 'prospect-conversion',
        title: 'Conversión prospectos',
        value: formatPercent(metrics.potentialConversionRate),
        helper: `${metrics.potentialConverted}/${metrics.potentialTotal} convertidos`,
        icon: <PeopleAltIcon fontSize="small" />,
        color: 'info'
      }
    ],
    [metrics]
  );

  if (loading && totalRecords === 0) {
    return <PageLoadingState label={t('dashboard.loading', 'Cargando dashboard...')} />;
  }

  if (overviewError && totalRecords === 0) {
    return (
      <PageErrorState
        message={overviewError?.response?.data?.message || t('dashboard.loadError', 'No se pudo cargar el dashboard.')}
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (!loading && !overviewError && totalRecords === 0) {
    return <PageEmptyState message={t('dashboard.empty', 'No hay información para construir los KPI todavía.')} />;
  }

  return (
    <Grid container spacing={gridSpacing}>
      <Grid size={12}>
        <Alert severity="info" variant="outlined">
          {t('dashboard.kpiSubtitle', 'Dashboard con KPI y gráficos en tiempo real del ecosistema LionTV.')}
        </Alert>
      </Grid>

      {overviewData?.meta?.partial ? (
        <Grid size={12}>
          <Alert severity="warning" variant="outlined">
            {t('dashboard.partial', 'Se cargaron datos parciales para los KPI.')}
          </Alert>
        </Grid>
      ) : null}

      {overviewError ? (
        <Grid size={12}>
          <Alert severity="error" variant="outlined">
            {overviewError?.response?.data?.message || t('dashboard.loadError', 'No se pudo cargar el dashboard.')}
          </Alert>
        </Grid>
      ) : null}

      <Grid size={12}>
        <Typography variant="h4">Resumen ejecutivo</Typography>
      </Grid>
      {executiveKpis.map((card) => (
        <Grid key={card.key} size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <KpiCard title={card.title} value={card.value} helper={card.helper} icon={card.icon} color={card.color} />
        </Grid>
      ))}

      <Grid size={12}>
        <Typography variant="h4">KPIs financieros</Typography>
      </Grid>
      {financialKpis.map((card) => (
        <Grid key={card.key} size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <KpiCard title={card.title} value={card.value} helper={card.helper} icon={card.icon} color={card.color} />
        </Grid>
      ))}

      <Grid size={12}>
        <Typography variant="h4">KPIs operativos y riesgo</Typography>
      </Grid>
      {operationalKpis.map((card) => (
        <Grid key={card.key} size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <KpiCard title={card.title} value={card.value} helper={card.helper} icon={card.icon} color={card.color} />
        </Grid>
      ))}

      <Grid size={{ xs: 12, md: 4 }}>
        <ChartCard
          title={t('dashboard.charts.portfolio', 'Portafolio por módulo')}
          helper={t('dashboard.charts.portfolioHelper', 'Volumen de registros por entidad')}
        >
          <LazyApexChart options={donutChart.options} series={donutChart.series} type="donut" height={330} />
        </ChartCard>
      </Grid>

      <Grid size={{ xs: 12, md: 8 }}>
        <ChartCard
          title={t('dashboard.charts.status', 'Estado operativo por módulo')}
          helper={t('dashboard.charts.statusHelper', 'Comparativo entre OK y riesgo/pendiente')}
        >
          <LazyApexChart options={statusBar.options} series={statusBar.series} type="bar" height={330} />
        </ChartCard>
      </Grid>

      <Grid size={{ xs: 12, md: 8 }}>
        <ChartCard
          title={t('dashboard.charts.cashflow', 'Tendencia mensual: ingresos vs gastos')}
          helper={t('dashboard.charts.cashflowHelper', 'Año actual consolidado')}
        >
          <LazyApexChart options={monthlyTrend.options} series={monthlyTrend.series} type="area" height={350} />
        </ChartCard>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <ChartCard
          title={t('dashboard.charts.expiry', 'Vencimientos próximos')}
          helper={t('dashboard.charts.expiryHelper', 'Buckets de riesgo de 30 días')}
        >
          <LazyApexChart options={expiryChart.options} series={expiryChart.series} type="bar" height={350} />
          <Divider />
          <Stack spacing={0.8} sx={{ mt: 0.5 }}>
            <Chip size="small" color="success" variant="outlined" label={`Autopay: ${metrics.subAutoPay}/${metrics.subTotal}`} />
            <Chip
              size="small"
              color="info"
              variant="outlined"
              label={`Managed activos: ${metrics.managedActive}/${metrics.managedTotal}`}
            />
            <Chip
              size="small"
              color="warning"
              variant="outlined"
              label={`Prospectos convertidos: ${metrics.potentialConverted}/${metrics.potentialTotal}`}
            />
          </Stack>
        </ChartCard>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <ChartCard title="Compromisos de pago" helper="Distribución por estado operativo">
          <LazyApexChart options={commitmentsChart.options} series={commitmentsChart.series} type="donut" height={330} />
          <Divider />
          <Stack spacing={0.8} sx={{ mt: 0.5 }}>
            <Chip size="small" color="success" variant="outlined" label={`Recuperado: ${formatMoney(metrics.commitmentRecoveredAmount)}`} />
            <Chip size="small" color="warning" variant="outlined" label={`Pendiente: ${formatMoney(metrics.commitmentPendingAmount)}`} />
          </Stack>
        </ChartCard>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <ChartCard title="Mix por proveedor" helper="Top proveedores por volumen de líneas/subs">
          <LazyApexChart options={providerMixChart.options} series={providerMixChart.series} type="bar" height={330} />
          <Divider />
          <Stack spacing={0.8} sx={{ mt: 0.5 }}>
            <Chip size="small" color="primary" variant="outlined" label={`Line Plus: ${metrics.linePlusCount}`} />
            <Chip size="small" color="warning" variant="outlined" label={`Líneas vencidas: ${metrics.linesExpired}`} />
          </Stack>
        </ChartCard>
      </Grid>

      <Grid size={12}>
        <ChartCard title="Embudo comercial-operativo" helper="Del prospecto hasta facturación cobrada">
          <LazyApexChart options={funnelChart.options} series={funnelChart.series} type="bar" height={290} />
          <Divider />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Chip size="small" color="info" variant="outlined" label={`Prospectos abiertos: ${metrics.potentialOpen}`} />
            <Chip size="small" color="success" variant="outlined" label={`Clientes inactivos: ${metrics.customerInactive}`} />
            <Chip size="small" color="warning" variant="outlined" label={`Subs expiradas: ${metrics.subExpired}`} />
            <Chip size="small" color="secondary" variant="outlined" label={`Licencias por vencer (30d): ${metrics.licenseExpiring30}`} />
          </Stack>
        </ChartCard>
      </Grid>
    </Grid>
  );
}
