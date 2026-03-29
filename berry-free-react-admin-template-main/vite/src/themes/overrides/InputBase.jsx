// ==============================|| OVERRIDES - INPUT BASE ||============================== //

export default function InputBase(theme) {
  return {
    MuiInputBase: {
      styleOverrides: {
        input: {
          color: theme.vars.palette.text.primary,
          fontSize: '0.9rem',
          fontWeight: 500,
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
