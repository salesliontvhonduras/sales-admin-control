import { withAlpha } from 'utils/colorUtils';

// ==============================|| OVERRIDES - SELECT ||============================== //

export default function Select(theme) {
  return {
    MuiSelect: {
      defaultProps: {
        MenuProps: {
          transitionDuration: 0,
          disableScrollLock: true
        }
      },
      styleOverrides: {
        icon: {
          color: theme.vars.palette.text.secondary
        },
        select: {
          minHeight: '20px',
          display: 'flex',
          alignItems: 'center',
          borderRadius: 12,
          '&:focus': {
            backgroundColor: 'transparent'
          }
        },
        outlined: {
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.vars.palette.primary.main
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.vars.palette.divider
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: withAlpha(theme.vars.palette.primary.main, 0.62)
          }
        }
      }
    }
  };
}
