import { withAlpha } from 'utils/colorUtils';

// ==============================|| OVERRIDES - MENU ||============================== //

export default function Menu(theme) {
  return {
    MuiMenu: {
      defaultProps: {
        transitionDuration: 0
      },
      styleOverrides: {
        paper: {
          borderRadius: 14,
          border: `1px solid ${theme.vars.palette.divider}`,
          backgroundImage: 'none',
          backgroundColor: theme.vars.palette.surface.card,
          boxShadow:
            theme.palette.mode === 'dark' ? `0 18px 42px ${withAlpha('#020617', 0.58)}` : `0 14px 34px ${withAlpha('#0f172a', 0.16)}`
        }
      }
    },
    MuiPopover: {
      defaultProps: {
        transitionDuration: 0
      }
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '2px 6px',
          '&.Mui-selected': {
            backgroundColor: withAlpha(theme.vars.palette.primary.main, theme.palette.mode === 'dark' ? 0.22 : 0.1)
          },
          '&.Mui-selected:hover': {
            backgroundColor: withAlpha(theme.vars.palette.primary.main, theme.palette.mode === 'dark' ? 0.28 : 0.14)
          }
        }
      }
    }
  };
}
