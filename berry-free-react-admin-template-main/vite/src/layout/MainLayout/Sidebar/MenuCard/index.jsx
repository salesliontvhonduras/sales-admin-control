import { memo, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import useAuth from 'hooks/useAuth';
import { useLionTvOverview } from 'api/liontv-overview';

// assets
import RadarRoundedIcon from '@mui/icons-material/RadarRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import PaidRoundedIcon from '@mui/icons-material/PaidRounded';
import LaunchRoundedIcon from '@mui/icons-material/LaunchRounded';

const STATUS_EXCLUDED = new Set(['CANCELLED', 'REMOVED', 'INACTIVE']);

function pickFirst(item, keys, fallback = null) {
  for (const key of keys) {
    const value = item?.[key];
    if (value !== undefined && value !== null && value !== '') return value;
  }
  return fallback;
}

function toUpper(value) {
  return String(value || '')
    .trim()
    .toUpperCase();
}

function parseDate(value) {
  if (!value) return null;
  const raw = String(value).trim();
  if (!raw) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    const date = new Date(`${raw}T00:00:00`);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date;
}

function startOfDay(date = new Date()) {
  const cloned = new Date(date);
  cloned.setHours(0, 0, 0, 0);
  return cloned;
}

function daysUntil(value) {
  const target = parseDate(value);
  if (!target) return null;
  return Math.round((startOfDay(target).getTime() - startOfDay(new Date()).getTime()) / 86400000);
}

function money(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function formatMoney(value) {
  return new Intl.NumberFormat('es-HN', {
    style: 'currency',
    currency: 'HNL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(money(value));
}

function countDue(items, dateFields, statusResolver = (item) => pickFirst(item, ['status'], '')) {
  return items.reduce(
    (acc, item) => {
      const status = toUpper(statusResolver(item));
      if (STATUS_EXCLUDED.has(status)) return acc;

      const dueDate = pickFirst(item, dateFields, null);
      const days = daysUntil(dueDate);
      if (days === null) return acc;
      if (days === 0) acc.today += 1;
      else if (days === 1) acc.tomorrow += 1;
      else if (days >= 2 && days <= 7) acc.next7 += 1;
      return acc;
    },
    { today: 0, tomorrow: 0, next7: 0 }
  );
}

function ProgressItem({ label, value, color = 'primary', total }) {
  const progress = total > 0 ? Math.min((value / total) * 100, 100) : 0;
  return (
    <Stack spacing={0.4}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Chip size="small" color={color} variant="outlined" label={value} />
      </Stack>
      <LinearProgress
        variant="determinate"
        value={progress}
        color={color}
        sx={{
          height: 8,
          borderRadius: 999,
          '& .MuiLinearProgress-bar': {
            borderRadius: 999
          }
        }}
      />
    </Stack>
  );
}

// ==============================|| SIDEBAR - RADAR CARD ||============================== //

function MenuCard() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const {
    data: overviewData,
    error: overviewError,
    isLoading: loading
  } = useLionTvOverview({
    enabled: Boolean(accessToken),
    scope: 'core'
  });

  const radar = useMemo(() => {
    const subscriptions = overviewData?.subscriptions || [];
    const licenses = overviewData?.licenses || [];
    const lines = overviewData?.lines || [];
    const managedAccounts = overviewData?.managedAccounts || [];
    const invoices = overviewData?.invoices || [];
    const commitments = overviewData?.commitments || [];

    const base = { today: 0, tomorrow: 0, next7: 0 };
    const add = (target, source) => ({
      today: target.today + source.today,
      tomorrow: target.tomorrow + source.tomorrow,
      next7: target.next7 + source.next7
    });

    let due = { ...base };
    due = add(due, countDue(subscriptions, ['renewalDate', 'renewal_date', 'expDate', 'exp_date']));
    due = add(due, countDue(licenses, ['expireAt', 'expire_at', 'expDate', 'exp_date']));
    due = add(
      due,
      countDue(lines, ['exp_date', 'expDate'], (line) =>
        pickFirst(line, ['status'], pickFirst(line, ['enabled'], true) ? 'ACTIVE' : 'INACTIVE')
      )
    );
    due = add(
      due,
      countDue(managedAccounts, ['expirationDate', 'expiration_date'], (account) =>
        pickFirst(account, ['accountStatus', 'status'], 'ACTIVE')
      )
    );

    const pendingInvoices = invoices.filter((invoice) => {
      const status = toUpper(pickFirst(invoice, ['status'], 'PENDING'));
      const amountDue = money(pickFirst(invoice, ['amountDue', 'amount_due', 'totalAmount', 'total_amount'], 0));
      const amountPaid = money(pickFirst(invoice, ['amountPaid', 'amount_paid'], 0));
      const pendingAmount = money(pickFirst(invoice, ['pendingAmount', 'pending_amount'], Math.max(amountDue - amountPaid, 0)));
      return status === 'PENDING' || pendingAmount > 0;
    });

    const pendingCommitments = commitments.filter((commitment) => {
      const status = toUpper(pickFirst(commitment, ['status'], 'PENDING'));
      const amountDue = money(pickFirst(commitment, ['amountDue', 'amount_due'], 0));
      const amountPaid = money(pickFirst(commitment, ['amountPaid', 'amount_paid'], 0));
      const pendingAmount = money(pickFirst(commitment, ['pendingAmount', 'pending_amount'], Math.max(amountDue - amountPaid, 0)));
      return status === 'PENDING' || pendingAmount > 0;
    });

    const pendingInvoicesTotal = pendingInvoices.reduce((acc, invoice) => {
      const amountDue = money(pickFirst(invoice, ['amountDue', 'amount_due', 'totalAmount', 'total_amount'], 0));
      const amountPaid = money(pickFirst(invoice, ['amountPaid', 'amount_paid'], 0));
      const pendingAmount = money(pickFirst(invoice, ['pendingAmount', 'pending_amount'], Math.max(amountDue - amountPaid, 0)));
      return acc + pendingAmount;
    }, 0);

    const pendingCommitmentsTotal = pendingCommitments.reduce((acc, commitment) => {
      const amountDue = money(pickFirst(commitment, ['amountDue', 'amount_due'], 0));
      const amountPaid = money(pickFirst(commitment, ['amountPaid', 'amount_paid'], 0));
      const pendingAmount = money(pickFirst(commitment, ['pendingAmount', 'pending_amount'], Math.max(amountDue - amountPaid, 0)));
      return acc + pendingAmount;
    }, 0);

    return {
      today: due.today,
      tomorrow: due.tomorrow,
      next7: due.next7,
      pendingInvoicesCount: pendingInvoices.length,
      pendingCommitmentsCount: pendingCommitments.length,
      pendingTotalAmount: pendingInvoicesTotal + pendingCommitmentsTotal
    };
  }, [overviewData]);

  const lastSyncAt = useMemo(() => {
    const fetchedAt = overviewData?.meta?.fetchedAt;
    return fetchedAt ? new Date(fetchedAt) : null;
  }, [overviewData?.meta?.fetchedAt]);

  const errorMessage = useMemo(() => {
    if (!accessToken) return '';
    if (overviewData?.meta?.partial) return 'Radar parcial: algunos módulos no cargaron.';
    const status = overviewError?.response?.status || overviewError?.request?.status;
    if (overviewError && status !== 401) return overviewError?.response?.data?.message || 'No se pudo cargar el radar operativo.';
    return '';
  }, [accessToken, overviewData?.meta?.partial, overviewError]);

  const totalDue = useMemo(() => radar.today + radar.tomorrow + radar.next7, [radar.today, radar.tomorrow, radar.next7]);

  return (
    <Card
      sx={{
        mb: 2.75,
        overflow: 'hidden',
        borderRadius: 2.5,
        border: '1px solid',
        borderColor: 'divider',
        background: `linear-gradient(165deg, ${theme.palette.primary.lighter || theme.palette.primary.light}35 0%, ${theme.palette.background.paper} 72%)`
      }}
    >
      <Box sx={{ p: 2 }}>
        <Stack spacing={1.35}>
          <Stack direction="row" alignItems="center" spacing={1.2}>
            <Avatar
              variant="rounded"
              sx={{
                ...theme.typography.largeAvatar,
                borderRadius: 2,
                color: 'primary.main',
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <RadarRoundedIcon fontSize="inherit" />
            </Avatar>
            <Stack sx={{ minWidth: 0 }}>
              <Typography variant="subtitle1" sx={{ color: 'text.primary' }}>
                Radar Operativo
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                Vencimientos y cobranza
              </Typography>
            </Stack>
          </Stack>

          {loading ? <LinearProgress /> : null}

          <ProgressItem label="Hoy" value={radar.today} color="error" total={Math.max(totalDue, 1)} />
          <ProgressItem label="Mañana" value={radar.tomorrow} color="warning" total={Math.max(totalDue, 1)} />
          <ProgressItem label="Próximos 7 días" value={radar.next7} color="info" total={Math.max(totalDue, 1)} />

          <Stack direction="row" alignItems="center" spacing={0.8}>
            <PaidRoundedIcon fontSize="small" color="action" />
            <Typography variant="caption" color="text.secondary">
              Cobranza pendiente
            </Typography>
          </Stack>

          <Stack direction="row" spacing={0.8} flexWrap="wrap" useFlexGap>
            <Chip size="small" icon={<CalendarMonthRoundedIcon />} label={`Facturas: ${radar.pendingInvoicesCount}`} variant="outlined" />
            <Chip
              size="small"
              icon={<CalendarMonthRoundedIcon />}
              label={`Compromisos: ${radar.pendingCommitmentsCount}`}
              variant="outlined"
            />
          </Stack>

          <Typography variant="h5">{formatMoney(radar.pendingTotalAmount)}</Typography>

          {errorMessage ? (
            <Typography variant="caption" color="warning.main">
              {errorMessage}
            </Typography>
          ) : null}

          {lastSyncAt ? (
            <Typography variant="caption" color="text.secondary">
              Actualizado: {lastSyncAt.toLocaleTimeString('es-HN')}
            </Typography>
          ) : null}

          <Button
            size="small"
            variant="outlined"
            endIcon={<LaunchRoundedIcon fontSize="small" />}
            onClick={() => navigate('/liontv/dashboard')}
          >
            Abrir seguimiento
          </Button>
        </Stack>
      </Box>
    </Card>
  );
}

export default memo(MenuCard);
