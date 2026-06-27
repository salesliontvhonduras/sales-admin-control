import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import EmptyState from './components/EmptyState';
import MetricStrip from './components/MetricStrip';
import { cleanProductText, displayDate, formatCreditsFromUnits, ledgerDeltaUnits, ledgerMovementLabel, rowsOf, walletCreditUnits } from './constants';
import { colors, surfaceSx } from './styles';

export default function CreditsView({ ledger, onRequestTopUp, wallet }) {
  const rows = rowsOf(ledger);
  const availableUnits = walletCreditUnits(wallet);

  return (
    <Stack spacing={2}>
      <MetricStrip
        metrics={[
          {
            label: 'Saldo disponible',
            value: formatCreditsFromUnits(availableUnits),
            helper: 'créditos',
            icon: AccountBalanceWalletRoundedIcon,
            color: colors.accent
          }
        ]}
      />

      <Paper sx={{ ...surfaceSx, p: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' } }}>
          <Box>
            <Typography variant="h2" sx={{ color: colors.text }}>
              Créditos
            </Typography>
            <Typography sx={{ color: colors.muted }}>Balance y movimientos generados por ventas, renovaciones y transferencias.</Typography>
          </Box>
          <Button variant="outlined" startIcon={<SendRoundedIcon />} onClick={onRequestTopUp}>
            Solicitar recarga
          </Button>
        </Stack>
      </Paper>

      <Paper sx={{ ...surfaceSx, overflow: 'hidden' }}>
        <Box sx={{ p: 2, borderBottom: `1px solid ${colors.border}` }}>
          <Typography variant="h3" sx={{ color: colors.text }}>
            Historial de movimientos
          </Typography>
        </Box>
        <Stack spacing={0} sx={{ p: 1 }}>
          {rows.length ? (
            rows.map((row) => {
              const delta = ledgerDeltaUnits(row);
              return (
                <Box
                  key={row.id || row.ledgerId || `${row.createdAt}-${delta}`}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: 'minmax(0, 1fr) auto' },
                    gap: 1,
                    p: 1.5,
                    borderRadius: '8px',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.04)' }
                  }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ color: colors.text, fontWeight: 900 }}>{ledgerMovementLabel(row.movementType || row.type)}</Typography>
                    <Typography sx={{ color: colors.muted, fontSize: 13 }}>
                      {cleanProductText(row.reason || row.description)} · {displayDate(row.createdAt)}
                    </Typography>
                  </Box>
                  <Typography sx={{ color: delta < 0 ? colors.danger : colors.success, fontWeight: 900, fontSize: 16 }}>
                    {delta > 0 ? '+' : ''}
                    {formatCreditsFromUnits(delta)}
                  </Typography>
                </Box>
              );
            })
          ) : (
            <Box sx={{ p: 2 }}>
              <EmptyState title="Sin movimientos" text="Las ventas y renovaciones aparecerán en este historial." />
            </Box>
          )}
        </Stack>
      </Paper>
    </Stack>
  );
}
