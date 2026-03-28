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
          fontWeight: 600,
          letterSpacing: '0.01em',
          transition: 'all 180ms ease',
          textTransform: 'none'
        },
        contained: {
          boxShadow: '0 8px 18px rgba(15, 23, 42, 0.14)',
          '&:hover': {
            boxShadow: '0 10px 22px rgba(15, 23, 42, 0.2)',
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
            backgroundColor: theme.vars.palette.secondary.light
          }
        },
        text: {
          '&:hover': {
            backgroundColor: theme.vars.palette.secondary.light
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
