import { withAlpha } from 'utils/colorUtils';

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
          lineHeight: 1.25,
          overflowWrap: 'anywhere',
          background:
            theme.palette.mode === 'dark'
              ? `linear-gradient(120deg, ${withAlpha(theme.vars.palette.primary.main, 0.24)} 0%, ${theme.vars.palette.surface.card} 80%)`
              : `linear-gradient(120deg, ${theme.vars.palette.primary.light}25 0%, ${theme.vars.palette.background.paper} 75%)`,
          [theme.breakpoints.down('sm')]: {
            padding: '14px 14px',
            fontSize: '1rem'
          }
        }
      }
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '18px 20px',
          [theme.breakpoints.down('sm')]: {
            padding: '14px'
          }
        }
      }
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '14px 20px',
          borderTop: `1px solid ${theme.vars.palette.divider}`,
          background: theme.palette.mode === 'dark' ? withAlpha(theme.vars.palette.surface.muted, 0.88) : theme.vars.palette.grey[50],
          [theme.breakpoints.down('sm')]: {
            padding: '12px 14px'
          }
        }
      }
    }
  };
}
