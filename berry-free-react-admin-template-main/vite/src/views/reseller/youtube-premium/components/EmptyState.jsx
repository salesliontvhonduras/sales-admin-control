import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { colors } from '../styles';

export default function EmptyState({ title, text, actionLabel, onAction }) {
  return (
    <Box
      sx={{
        p: { xs: 2.5, sm: 4 },
        textAlign: 'center',
        border: `1px dashed ${colors.strongBorder}`,
        borderRadius: '8px',
        bgcolor: colors.surface
      }}
    >
      <Stack spacing={1.5} sx={{ alignItems: 'center' }}>
        <Typography variant="h3" sx={{ color: colors.text }}>
          {title || 'Sin datos'}
        </Typography>
        {text ? <Typography sx={{ color: colors.muted, maxWidth: 520 }}>{text}</Typography> : null}
        {actionLabel && onAction ? (
          <Button variant="contained" onClick={onAction} sx={{ mt: 1 }}>
            {actionLabel}
          </Button>
        ) : null}
      </Stack>
    </Box>
  );
}
