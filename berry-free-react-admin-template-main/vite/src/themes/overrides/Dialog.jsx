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
            backdropFilter: 'blur(2px)'
          }
        },
        paper: {
          padding: '0',
          borderRadius: 18,
          border: `1px solid ${theme.vars.palette.divider}`,
          boxShadow: '0 26px 60px rgba(2, 8, 20, 0.28)'
        }
      }
    }
  };
}
