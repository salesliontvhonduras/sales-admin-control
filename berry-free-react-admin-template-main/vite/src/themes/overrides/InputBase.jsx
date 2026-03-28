// ==============================|| OVERRIDES - INPUT BASE ||============================== //

export default function InputBase(theme) {
  return {
    MuiInputBase: {
      styleOverrides: {
        input: {
          color: theme.vars.palette.text.dark,
          fontSize: '0.9rem',
          '&::placeholder': {
            color: theme.vars.palette.text.secondary,
            fontSize: '0.875rem'
          }
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '0.85rem',
          fontWeight: 500,
          color: theme.vars.palette.text.secondary
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
