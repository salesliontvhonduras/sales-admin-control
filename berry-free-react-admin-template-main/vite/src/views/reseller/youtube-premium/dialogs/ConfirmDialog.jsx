import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import PremiumDialog from '../components/PremiumDialog';
import { colors, mobileActionsSx } from '../styles';

export default function ConfirmDialog({ confirmColor = 'error', confirmLabel = 'Confirmar', loading, message, onClose, onConfirm, open, title }) {
  return (
    <PremiumDialog
      open={open}
      onClose={onClose}
      title={title}
      actions={
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={mobileActionsSx}>
          <Button onClick={onClose} disabled={loading} fullWidth>Cancelar</Button>
          <Button variant="contained" color={confirmColor} disabled={loading} startIcon={loading ? <CircularProgress size={16} /> : null} onClick={onConfirm} fullWidth>
            {confirmLabel}
          </Button>
        </Stack>
      }
    >
      <Stack sx={{ p: 1.75, bgcolor: colors.surface2, borderRadius: '8px', border: `1px solid ${colors.border}` }}>
        <Typography sx={{ color: colors.muted, lineHeight: 1.55 }}>{message}</Typography>
      </Stack>
    </PremiumDialog>
  );
}
