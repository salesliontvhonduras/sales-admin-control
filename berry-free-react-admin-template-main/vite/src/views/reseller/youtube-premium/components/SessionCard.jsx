import PowerSettingsNewRoundedIcon from '@mui/icons-material/PowerSettingsNewRounded';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { displayDate } from '../constants';
import { colors, surfaceSx } from '../styles';
import StatusBadge from './StatusBadge';

export default function SessionCard({ row, onDisconnect }) {
  return (
    <Paper sx={{ ...surfaceSx, p: 2 }}>
      <Stack spacing={1.5}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', gap: 2, alignItems: 'flex-start' }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h4" sx={{ color: colors.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {row?.name || row?.email || 'Cuenta Premium'}
            </Typography>
            <Typography sx={{ color: colors.muted, fontSize: 13 }}>{row?.deviceName || 'Dispositivo sin nombre'}</Typography>
          </Box>
          <StatusBadge status={row?.status || 'ACTIVE'} />
        </Stack>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1 }}>
          <Box sx={{ p: 1.25, bgcolor: colors.surface2, borderRadius: '8px', border: `1px solid ${colors.border}` }}>
            <Typography sx={{ color: colors.dim, fontSize: 12 }}>Último heartbeat</Typography>
            <Typography sx={{ color: colors.text, fontWeight: 800 }}>{displayDate(row?.lastSeenAt)}</Typography>
          </Box>
          <Box sx={{ p: 1.25, bgcolor: colors.surface2, borderRadius: '8px', border: `1px solid ${colors.border}` }}>
            <Typography sx={{ color: colors.dim, fontSize: 12 }}>Licencia</Typography>
            <Typography sx={{ color: colors.text, fontWeight: 800 }}>{row?.serialCode || row?.licenseId || '-'}</Typography>
          </Box>
        </Box>

        <Button color="error" variant="outlined" startIcon={<PowerSettingsNewRoundedIcon />} onClick={() => onDisconnect(row)} sx={{ alignSelf: 'flex-start' }}>
          Desconectar sesión
        </Button>
      </Stack>
    </Paper>
  );
}
