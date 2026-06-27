import AddRoundedIcon from '@mui/icons-material/AddRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import EmptyState from './components/EmptyState';
import StatusBadge from './components/StatusBadge';
import { formatCreditsFromUnits, resellerCreditUnits, rowsOf } from './constants';
import { colors, surfaceSx } from './styles';

export default function ResellerNetworkView({ network, onCreateChild, onTransfer }) {
  const rows = rowsOf(network);

  return (
    <Stack spacing={2}>
      <Paper sx={{ ...surfaceSx, p: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' } }}>
          <Box>
            <Typography variant="h2" sx={{ color: colors.text }}>
              Red de Resellers
            </Typography>
            <Typography sx={{ color: colors.muted }}>Crea hijos, transfiere créditos y controla el estado operativo de tu red.</Typography>
          </Box>
          <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={onCreateChild}>
            Nuevo reseller
          </Button>
        </Stack>
      </Paper>

      {rows.length ? (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, minmax(0, 1fr))' }, gap: 1.5 }}>
          {rows.map((row) => (
            <Paper key={row.username || row.id} sx={{ ...surfaceSx, p: 2 }}>
              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1.5} sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="h4" sx={{ color: colors.text }}>
                      {row.displayName || row.display_name || row.username}
                    </Typography>
                    <Typography sx={{ color: colors.muted, fontSize: 13 }}>{row.username}</Typography>
                  </Box>
                  <StatusBadge status={row.active === false ? 'SUSPENDED' : 'ACTIVE'} />
                </Stack>
                <Stack direction="row" spacing={0.75} sx={{ flexWrap: 'wrap', rowGap: 0.75 }}>
                  <Chip
                    icon={<AccountBalanceWalletRoundedIcon />}
                    label={`${formatCreditsFromUnits(resellerCreditUnits(row))} créditos`}
                    sx={{ color: colors.text, bgcolor: colors.surface2, borderRadius: '8px' }}
                  />
                  <Chip label={row.resellerType || row.reseller_type || 'RESELLER'} sx={{ color: colors.text, bgcolor: colors.surface2, borderRadius: '8px' }} />
                </Stack>
                <Button variant="outlined" startIcon={<SendRoundedIcon />} onClick={() => onTransfer(row)} sx={{ alignSelf: 'flex-start' }}>
                  Transferir créditos
                </Button>
              </Stack>
            </Paper>
          ))}
        </Box>
      ) : (
        <EmptyState title="Sin resellers hijos" text="Crea el primer reseller hijo para empezar a distribuir créditos." actionLabel="Nuevo reseller" onAction={onCreateChild} />
      )}
    </Stack>
  );
}
