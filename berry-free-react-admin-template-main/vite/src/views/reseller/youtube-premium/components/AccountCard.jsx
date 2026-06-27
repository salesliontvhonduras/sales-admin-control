import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import PowerSettingsNewRoundedIcon from '@mui/icons-material/PowerSettingsNewRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { accountName, accountStatus, packageLabel, planLabel, shortDate } from '../constants';
import { colors, surfaceSx } from '../styles';
import StatusBadge from './StatusBadge';

export default function AccountCard({ row, onRenew, onResetPassword, onToggleStatus }) {
  const active = row?.active !== false;

  return (
    <Paper sx={{ ...surfaceSx, p: 2 }}>
      <Stack spacing={1.5}>
        <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h4" sx={{ color: colors.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {accountName(row)}
            </Typography>
            <Typography sx={{ color: colors.muted, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {row?.email || '-'}
            </Typography>
          </Box>
          <StatusBadge status={accountStatus(row)} />
        </Stack>

        <Stack direction="row" spacing={0.75} sx={{ flexWrap: 'wrap', rowGap: 0.75 }}>
          <Chip size="small" label={planLabel(row?.planCode)} sx={{ bgcolor: colors.surface2, color: colors.text, borderRadius: '8px' }} />
          <Chip size="small" label={packageLabel(row?.packageCode)} sx={{ bgcolor: colors.surface2, color: colors.text, borderRadius: '8px' }} />
          <Chip
            size="small"
            label={`${row?.deviceCount || 0}/${row?.deviceLimit || 1} dispositivos`}
            sx={{ bgcolor: colors.surface2, color: colors.text, borderRadius: '8px' }}
          />
        </Stack>

        <Box sx={{ px: 1.25, py: 1, bgcolor: colors.surface2, borderRadius: '8px', border: `1px solid ${colors.border}` }}>
          <Typography sx={{ color: colors.dim, fontSize: 12 }}>Vencimiento</Typography>
          <Typography sx={{ color: colors.text, fontWeight: 900 }}>{shortDate(row?.expiresAt)}</Typography>
        </Box>

        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
          <Button size="small" variant="contained" startIcon={<RefreshRoundedIcon />} onClick={() => onRenew(row)}>
            Renovar
          </Button>
          <Button size="small" variant="outlined" startIcon={<KeyRoundedIcon />} onClick={() => onResetPassword(row)}>
            Password
          </Button>
          <Button size="small" color={active ? 'warning' : 'success'} variant="outlined" startIcon={<PowerSettingsNewRoundedIcon />} onClick={() => onToggleStatus(row)}>
            {active ? 'Suspender' : 'Activar'}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
