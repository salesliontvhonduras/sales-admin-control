import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect, useMemo, useState } from 'react';
import PremiumDialog from '../components/PremiumDialog';
import { formatCreditsFromUnits, resellerCreditUnits, walletCreditUnits } from '../constants';
import { colors, inputSx, mobileActionsSx } from '../styles';

export default function TransferCreditsDialog({ open, reseller, wallet, onClose, onSubmit, saving }) {
  const [credits, setCredits] = useState('');
  const currentUnits = resellerCreditUnits(reseller);
  const myUnits = walletCreditUnits(wallet);
  const transferUnits = useMemo(() => Number(credits || 0) * 100, [credits]);
  const insufficient = transferUnits > myUnits;

  useEffect(() => {
    if (open) setCredits('');
  }, [open]);

  return (
    <PremiumDialog
      open={open}
      onClose={onClose}
      title="Transferir créditos"
      subtitle={reseller?.displayName || reseller?.display_name || reseller?.username || ''}
      actions={
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={mobileActionsSx}>
          <Button onClick={onClose} disabled={saving} fullWidth>Cancelar</Button>
          <Button variant="contained" disabled={saving || Number(credits || 0) <= 0 || insufficient} startIcon={saving ? <CircularProgress size={16} /> : null} onClick={() => onSubmit(Number(credits))} fullWidth>
            Transferir
          </Button>
        </Stack>
      }
    >
      <Stack spacing={2}>
        <TextField
          label="Créditos a transferir"
          type="number"
          value={credits}
          onChange={(event) => setCredits(event.target.value)}
          fullWidth
          sx={inputSx}
          inputProps={{ min: 0, step: 0.25 }}
        />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <Info label="Tu saldo actual" value={`${formatCreditsFromUnits(myUnits)} créditos`} />
          <Info label="Saldo actual del reseller" value={`${formatCreditsFromUnits(currentUnits)} créditos`} />
          <Info label="Saldo esperado" value={`${formatCreditsFromUnits(currentUnits + transferUnits)} créditos`} highlight />
        </Stack>
        {insufficient ? (
          <Typography sx={{ color: colors.danger, fontSize: 13, fontWeight: 800 }}>
            El monto supera tu saldo disponible. Ajusta la cantidad antes de transferir.
          </Typography>
        ) : null}
        <Typography sx={{ color: colors.muted, fontSize: 13 }}>
          La transferencia genera movimientos de ledger para ambos resellers y descuenta de tu saldo disponible.
        </Typography>
      </Stack>
    </PremiumDialog>
  );
}

function Info({ label, value, highlight = false }) {
  return (
    <Stack
      sx={{
        flex: 1,
        p: 1.5,
        bgcolor: highlight ? 'rgba(229,9,20,0.1)' : colors.surface2,
        borderRadius: '8px',
        border: `1px solid ${highlight ? 'rgba(229,9,20,0.34)' : colors.border}`
      }}
    >
      <Typography sx={{ color: colors.dim, fontSize: 12 }}>{label}</Typography>
      <Typography sx={{ color: colors.text, fontWeight: 900 }}>{value}</Typography>
    </Stack>
  );
}
