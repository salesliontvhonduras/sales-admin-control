import AddRoundedIcon from '@mui/icons-material/AddRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import EventBusyRoundedIcon from '@mui/icons-material/EventBusyRounded';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import WifiTetheringRoundedIcon from '@mui/icons-material/WifiTetheringRounded';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AccountCard from './components/AccountCard';
import EmptyState from './components/EmptyState';
import MetricStrip from './components/MetricStrip';
import SessionCard from './components/SessionCard';
import {
  formatCreditsFromUnits,
  firstValue,
  rowsOf,
  walletCreditUnits
} from './constants';
import { colors, surfaceSx } from './styles';

export default function DashboardView({
  dashboard,
  loading,
  onCreateAccount,
  onCreateDemo,
  onDelete,
  onDeviceLimit,
  onDisconnectSession,
  onRenew,
  onResetPassword,
  onToggleAccount,
  onViewChange
}) {
  const wallet = dashboard?.wallet || dashboard?.walletSummary || {};
  const recentAccounts = rowsOf(dashboard?.recentCustomers || dashboard?.recentAccounts || []);
  const recentSessions = rowsOf(dashboard?.recentSessions || dashboard?.onlineSessionList || []);
  const expiring = rowsOf(dashboard?.expiringCustomers || dashboard?.expiringThisWeekAccounts || []);

  const metrics = [
    {
      label: 'Saldo disponible',
      value: formatCreditsFromUnits(walletCreditUnits(wallet)),
      helper: 'créditos para vender',
      icon: AccountBalanceWalletRoundedIcon,
      color: colors.accent
    },
    {
      label: 'Cuentas activas',
      value: firstValue(dashboard, ['activeCustomers', 'activeAccounts', 'totalActiveAccounts'], 0),
      helper: `${firstValue(dashboard, ['totalCustomers', 'totalAccounts'], 0)} cuentas totales`,
      icon: AddRoundedIcon
    },
    {
      label: 'Expiran en 7 días',
      value: firstValue(dashboard, ['expiringThisWeek', 'expiringInSevenDays'], 0),
      helper: 'requieren renovación',
      icon: ScheduleRoundedIcon,
      color: colors.warning
    },
    {
      label: 'Sesiones online',
      value: firstValue(dashboard, ['onlineSessions', 'activeSessions'], 0),
      helper: 'con heartbeat reciente',
      icon: WifiTetheringRoundedIcon,
      color: colors.success
    }
  ];

  return (
    <Stack spacing={2.5}>
      <Paper sx={{ ...surfaceSx, p: { xs: 2, lg: 2.5 }, overflow: 'hidden' }}>
        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2} sx={{ alignItems: { lg: 'center' }, justifyContent: 'space-between' }}>
          <Box>
            <Typography sx={{ color: colors.dim, fontSize: 12, fontWeight: 900, textTransform: 'uppercase' }}>
              Operación de hoy
            </Typography>
            <Typography variant="h2" sx={{ color: colors.text, fontSize: { xs: 26, sm: 34 }, mt: 0.5 }}>
              Vende, renueva y controla sesiones desde una sola consola.
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', sm: 'repeat(4, minmax(0, 1fr))', lg: 'repeat(2, minmax(150px, 1fr))' },
              gap: 1,
              minWidth: { lg: 344 },
              '& .MuiButton-root': {
                minWidth: 0,
                minHeight: 46,
                px: 1,
                borderRadius: '8px',
                fontWeight: 900,
                textTransform: 'none',
                justifyContent: 'center',
                whiteSpace: 'nowrap'
              },
              '& .MuiButton-startIcon': {
                mr: 0.75,
                ml: 0,
                '& .MuiSvgIcon-root': { fontSize: 18 }
              }
            }}
          >
            <Button variant="outlined" startIcon={<AccessTimeRoundedIcon />} onClick={onCreateDemo}>
              Crear demo
            </Button>
            <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={onCreateAccount}>
              Crear cuenta
            </Button>
            <Button variant="outlined" onClick={() => onViewChange('sessions')}>
              Ver sesiones
            </Button>
            <Button variant="outlined" onClick={() => onViewChange('credits')}>
              Créditos
            </Button>
          </Box>
        </Stack>
      </Paper>

      <MetricStrip metrics={metrics} loading={loading} />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', xl: 'minmax(0, 1.35fr) minmax(360px, 0.65fr)' }, gap: 2 }}>
        <Stack spacing={2}>
          <Section title="Cuentas próximas a vencer" action={<Button onClick={() => onViewChange('accounts')}>Ver cuentas</Button>}>
            {expiring.length ? (
              <Stack spacing={1.5}>
                {expiring.slice(0, 4).map((row) => (
                  <AccountCard
                    key={row.userId || row.id || row.email}
                    row={row}
                    onDelete={onDelete}
                    onDeviceLimit={onDeviceLimit}
                    onRenew={onRenew}
                    onResetPassword={onResetPassword}
                    onToggleStatus={onToggleAccount}
                  />
                ))}
              </Stack>
            ) : (
              <EmptyState title="Sin vencimientos urgentes" text="No hay cuentas venciendo esta semana." />
            )}
          </Section>

          <Section title="Últimas cuentas gestionadas" action={<Button onClick={() => onViewChange('accounts')}>Administrar</Button>}>
            {recentAccounts.length ? (
              <Stack spacing={1.5}>
                {recentAccounts.slice(0, 4).map((row) => (
                  <AccountCard
                    key={row.userId || row.id || row.email}
                    row={row}
                    onDelete={onDelete}
                    onDeviceLimit={onDeviceLimit}
                    onRenew={onRenew}
                    onResetPassword={onResetPassword}
                    onToggleStatus={onToggleAccount}
                  />
                ))}
              </Stack>
            ) : (
              <EmptyState title="No hay cuentas todavía" text="Crea la primera cuenta premium o una demo temporal para probar el app." actionLabel="Nueva cuenta" onAction={onCreateAccount} />
            )}
          </Section>
        </Stack>

        <Section title="Sesiones recientes" action={<Button onClick={() => onViewChange('sessions')}>Ver online</Button>}>
          {recentSessions.length ? (
            <Stack spacing={1.5}>
              {recentSessions.slice(0, 5).map((row) => (
                <SessionCard key={row.sessionId || row.id} row={row} onDisconnect={onDisconnectSession} />
              ))}
            </Stack>
          ) : (
            <EmptyState title="Sin sesiones activas" text="Cuando tus cuentas estén conectadas, aparecerán aquí." />
          )}
          <Box sx={{ mt: 2, p: 1.5, borderRadius: '8px', bgcolor: 'rgba(246,199,107,0.08)', border: '1px solid rgba(246,199,107,0.24)' }}>
            <Stack direction="row" spacing={1.25}>
              <EventBusyRoundedIcon sx={{ color: colors.warning }} />
              <Typography sx={{ color: colors.muted, fontSize: 13 }}>
                Desconectar una sesión no desvincula el dispositivo. Solo corta la reproducción activa hasta que el cliente vuelva a validar.
              </Typography>
            </Stack>
          </Box>
        </Section>
      </Box>
    </Stack>
  );
}

function Section({ title, action, children }) {
  return (
    <Paper sx={{ ...surfaceSx, overflow: 'hidden' }}>
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between', p: 2, borderBottom: `1px solid ${colors.border}` }}>
        <Typography variant="h3" sx={{ color: colors.text }}>
          {title}
        </Typography>
        {action}
      </Stack>
      <Box sx={{ p: 2 }}>{children}</Box>
    </Paper>
  );
}
