import { withAlpha } from 'utils/colorUtils';

// ==============================|| OVERRIDES - BUTTON ||============================== //

export default function Button(theme) {
  return {
    MuiButton: {
      defaultProps: {
        disableElevation: true
      },
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 650,
          letterSpacing: '0.01em',
          transition: 'all 120ms ease',
          textTransform: 'none'
        },
        contained: {
          boxShadow:
            theme.palette.mode === 'dark'
              ? `0 12px 26px ${withAlpha(theme.vars.palette.primary.main, 0.35)}`
              : `0 8px 20px ${withAlpha(theme.vars.palette.primary.main, 0.26)}`,
          '&:hover': {
            boxShadow:
              theme.palette.mode === 'dark'
                ? `0 14px 30px ${withAlpha(theme.vars.palette.primary.main, 0.42)}`
                : `0 10px 24px ${withAlpha(theme.vars.palette.primary.main, 0.34)}`,
            transform: 'translateY(-1px)'
          },
          '&:active': {
            transform: 'translateY(0px)'
          }
        },
        outlined: {
          borderWidth: 1.2,
          '&:hover': {
            borderWidth: 1.2,
            backgroundColor:
              theme.palette.mode === 'dark'
                ? withAlpha(theme.vars.palette.primary.main, 0.14)
                : withAlpha(theme.vars.palette.primary.main, 0.08)
          }
        },
        text: {
          '&:hover': {
            backgroundColor:
              theme.palette.mode === 'dark'
                ? withAlpha(theme.vars.palette.primary.main, 0.14)
                : withAlpha(theme.vars.palette.primary.main, 0.08)
          }
        },
        sizeSmall: {
          minHeight: 30,
          paddingInline: 10
        },
        sizeMedium: {
          minHeight: 36,
          paddingInline: 14
        },
        sizeLarge: {
          minHeight: 42,
          paddingInline: 18
        }
      }
    }
  };
}
