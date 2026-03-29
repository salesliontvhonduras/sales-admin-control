import { withAlpha } from 'utils/colorUtils';

// ==============================|| OVERRIDES - DIALOG ||============================== //

export default function Dialog(theme) {
  return {
    MuiDialog: {
      defaultProps: {
        fullWidth: true
      },
      styleOverrides: {
        root: {
          '& .MuiBackdrop-root': {
            backdropFilter: 'blur(5px)',
            backgroundColor: withAlpha('#020617', theme.palette.mode === 'dark' ? 0.68 : 0.4)
          }
        },
        paper: {
          padding: '0',
          borderRadius: 18,
          border: `1px solid ${theme.vars.palette.divider}`,
          backgroundColor: theme.vars.palette.surface.card,
          boxShadow:
            theme.palette.mode === 'dark' ? `0 30px 70px ${withAlpha('#020617', 0.62)}` : `0 24px 56px ${withAlpha('#0f172a', 0.26)}`
        }
      }
    }
  };
}
