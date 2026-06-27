import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import PremiumDialog from '../components/PremiumDialog';
import { colors } from '../styles';

export default function ConfirmDialog({ confirmColor = 'error', confirmLabel = 'Confirmar', loading, message, onClose, onConfirm, open, title }) {
  return (
    <PremiumDialog
      open={open}
      onClose={onClose}
      title={title}
      actions={
        <Stack direction="row" spacing={1} sx={{ width: '100%', justifyContent: 'flex-end' }}>
          <Button onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button variant="contained" color={confirmColor} disabled={loading} startIcon={loading ? <CircularProgress size={16} /> : null} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </Stack>
      }
    >
      <Typography sx={{ color: colors.muted }}>{message}</Typography>
    </PremiumDialog>
  );
}
