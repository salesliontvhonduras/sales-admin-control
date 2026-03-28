// ==============================|| OVERRIDES - OUTLINED INPUT ||============================== //

export default function OutlinedInput(theme, borderRadius, outlinedFilled) {
  const radius = Math.max(Number(borderRadius || 8), 8);
  return {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          background: outlinedFilled ? theme.vars.palette.grey[50] : 'transparent',
          borderRadius: `${radius}px`,
          transition: 'all 160ms ease',

          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.vars.palette.grey[400],
            borderWidth: 1
          },

          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.vars.palette.primary.light
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.vars.palette.primary.main,
            borderWidth: 1.6
          },
          '&.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderWidth: 1.4
          },

          '&.MuiInputBase-multiline': {
            padding: 1
          }
        },
        input: {
          fontWeight: 500,
          background: outlinedFilled ? theme.vars.palette.grey[50] : 'transparent',
          padding: '15.5px 14px',
          borderRadius: `${radius}px`,

          '&.MuiInputBase-inputSizeSmall': {
            padding: '10px 14px',

            '&.MuiInputBase-inputAdornedStart': {
              paddingLeft: 0
            }
          }
        },
        inputAdornedStart: {
          paddingLeft: 4
        },
        notchedOutline: {
          borderRadius: `${radius}px`
        }
      }
    }
  };
}
