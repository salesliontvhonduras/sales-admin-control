// ==============================|| OVERRIDES - DIALOG TITLE ||============================== //

export default function DialogTitle(theme) {
  return {
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: '1.1rem',
          fontWeight: 700,
          padding: '16px 20px',
          borderBottom: `1px solid ${theme.vars.palette.divider}`,
          background: `linear-gradient(120deg, ${theme.vars.palette.primary.light}25 0%, ${theme.vars.palette.background.paper} 75%)`
        }
      }
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '18px 20px'
        }
      }
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '14px 20px',
          borderTop: `1px solid ${theme.vars.palette.divider}`,
          background: theme.vars.palette.grey[50]
        }
      }
    }
  };
}
