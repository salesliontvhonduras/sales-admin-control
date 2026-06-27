import Chip from '@mui/material/Chip';
import { statusLabel, statusTone } from '../constants';
import { colors } from '../styles';

const toneStyles = {
  success: { color: colors.success, bgcolor: 'rgba(99,212,113,0.12)', borderColor: 'rgba(99,212,113,0.26)' },
  warning: { color: colors.warning, bgcolor: 'rgba(246,199,107,0.12)', borderColor: 'rgba(246,199,107,0.28)' },
  error: { color: colors.danger, bgcolor: 'rgba(255,107,107,0.12)', borderColor: 'rgba(255,107,107,0.26)' },
  default: { color: colors.muted, bgcolor: 'rgba(255,255,255,0.06)', borderColor: colors.border }
};

export default function StatusBadge({ status, label, size = 'small' }) {
  const styles = toneStyles[statusTone(status)] || toneStyles.default;

  return (
    <Chip
      size={size}
      label={label || statusLabel(status)}
      variant="outlined"
      sx={{
        height: size === 'small' ? 24 : 30,
        fontWeight: 800,
        letterSpacing: 0,
        borderRadius: '8px',
        ...styles
      }}
    />
  );
}
