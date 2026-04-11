// ==============================|| OVERRIDES - INPUT BASE ||============================== //

export default function InputBase(theme) {
  return {
    MuiInputBase: {
      styleOverrides: {
        root: {
          minWidth: 0
        },
        input: {
          color: theme.vars.palette.text.primary,
          fontSize: '0.9rem',
          fontWeight: 500,
          lineHeight: 1.45,
          '&::placeholder': {
            color: theme.vars.palette.text.secondary,
            fontSize: '0.875rem'
          },
          '&.Mui-disabled': {
            WebkitTextFillColor: theme.vars.palette.text.secondary
          }
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '0.85rem',
          fontWeight: 600,
          color: theme.vars.palette.text.secondary,
          overflowWrap: 'anywhere',
          '&.MuiInputLabel-shrink': {
            backgroundColor: theme.vars.palette.surface.card,
            paddingInline: 4,
            borderRadius: 6,
            transform: 'translate(12px, -9px) scale(0.85)',
            maxWidth: 'calc(100% - 24px)'
          }
        }
      }
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginTop: 6,
          fontSize: '0.74rem'
        }
      }
    }
  };
}
