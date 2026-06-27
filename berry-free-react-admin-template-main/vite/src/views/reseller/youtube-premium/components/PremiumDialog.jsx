import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { colors } from '../styles';

export default function PremiumDialog({ open, title, subtitle, children, actions, onClose, maxWidth = 'sm', fullScreen = false }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      fullScreen={fullScreen}
      PaperProps={{
        sx: {
          bgcolor: colors.surface,
          color: colors.text,
          borderRadius: fullScreen ? 0 : '8px',
          border: `1px solid ${colors.border}`,
          backgroundImage: 'none',
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{ p: 0 }}>
        <Stack
          direction="row"
          spacing={2}
          sx={{
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            p: { xs: 2, sm: 2.5 },
            borderBottom: `1px solid ${colors.border}`
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h3" sx={{ color: colors.text, lineHeight: 1.15 }}>
              {title}
            </Typography>
            {subtitle ? (
              <Typography sx={{ color: colors.muted, mt: 0.5, fontSize: 13 }}>
                {subtitle}
              </Typography>
            ) : null}
          </Box>
          <IconButton
            aria-label="Cerrar"
            onClick={onClose}
            size="small"
            sx={{ color: colors.muted, bgcolor: colors.surface2, '&:hover': { bgcolor: colors.surface3 } }}
          >
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ p: { xs: 2, sm: 2.5 }, bgcolor: colors.surface }}>
        {children}
      </DialogContent>
      {actions ? (
        <DialogActions sx={{ p: { xs: 2, sm: 2.5 }, pt: 0, bgcolor: colors.surface, borderTop: `1px solid ${colors.border}` }}>
          {actions}
        </DialogActions>
      ) : null}
    </Dialog>
  );
}
