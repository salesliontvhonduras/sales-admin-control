import DevicesRoundedIcon from '@mui/icons-material/DevicesRounded';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect, useMemo, useState } from 'react';
import PremiumDialog from '../components/PremiumDialog';
import { accountName, formatCreditsFromUnits, quoteDeviceLimitChangeUnits } from '../constants';
import { colors, inputSx, mobileActionsSx } from '../styles';

export default function DeviceLimitDialog({ account, open, onClose, onSubmit, saving }) {
  const currentLimit = Math.max(Number(account?.deviceLimit || 1), 1);
  const [deviceLimit, setDeviceLimit] = useState(currentLimit);
  const chargeUnits = useMemo(() => quoteDeviceLimitChangeUnits(currentLimit, deviceLimit), [currentLimit, deviceLimit]);
  const addedDevices = Math.max(Number(deviceLimit || 1) - currentLimit, 0);

  useEffect(() => {
    if (open) setDeviceLimit(currentLimit);
  }, [currentLimit, open]);

  return (
    <PremiumDialog
      open={open}
      onClose={onClose}
      title="Cambiar dispositivos"
      subtitle={account ? accountName(account) : ''}
      actions={
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={mobileActionsSx}>
          <Button onClick={onClose} disabled={saving} fullWidth>
            Cancelar
          </Button>
          <Button
            variant="contained"
            disabled={saving || Number(deviceLimit || 0) < 1}
            startIcon={saving ? <CircularProgress size={16} /> : <DevicesRoundedIcon />}
            onClick={() => onSubmit({ deviceLimit: Number(deviceLimit) })}
            fullWidth
          >
            Guardar límite
          </Button>
        </Stack>
      }
    >
      <Stack spacing={2}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <Summary label="Uso actual" value={`${Number(account?.deviceCount || 0)} de ${currentLimit}`} />
          <Summary label="Límite nuevo" value={`${Math.max(Number(deviceLimit || 1), 1)} dispositivos`} />
        </Stack>

        <TextField
          label="Límite de dispositivos"
          type="number"
          value={deviceLimit}
          onChange={(event) => setDeviceLimit(Math.max(Number(event.target.value || 1), 1))}
          fullWidth
          sx={inputSx}
          inputProps={{ min: 1 }}
          helperText="Reducir el límite no genera reembolso. Solo se cobra cuando agregas dispositivos."
        />

        <Stack sx={{ p: 2, bgcolor: 'rgba(255,45,45,0.12)', borderRadius: '8px', border: '1px solid rgba(255,45,45,0.34)' }}>
          <Typography sx={{ color: colors.dim, fontSize: 12, fontWeight: 900, textTransform: 'uppercase' }}>
            Costo del cambio
          </Typography>
          <Typography variant="h2" sx={{ color: colors.text, fontSize: { xs: 30, sm: 36 }, lineHeight: 1, mt: 0.5 }}>
            {formatCreditsFromUnits(chargeUnits)} créditos
          </Typography>
          <Typography sx={{ color: colors.muted, fontSize: 13, mt: 1 }}>
            {addedDevices > 0
              ? `${addedDevices} dispositivo${addedDevices === 1 ? '' : 's'} agregado${addedDevices === 1 ? '' : 's'} × 0.50 créditos.`
              : 'No hay cobro porque no estás agregando dispositivos.'}
          </Typography>
        </Stack>
      </Stack>
    </PremiumDialog>
  );
}

function Summary({ label, value }) {
  return (
    <Stack sx={{ flex: 1, p: 1.5, bgcolor: colors.surface2, borderRadius: '8px', border: `1px solid ${colors.border}` }}>
      <Typography sx={{ color: colors.dim, fontSize: 12, fontWeight: 900, textTransform: 'uppercase' }}>{label}</Typography>
      <Typography sx={{ color: colors.text, fontWeight: 900 }}>{value}</Typography>
    </Stack>
  );
}
