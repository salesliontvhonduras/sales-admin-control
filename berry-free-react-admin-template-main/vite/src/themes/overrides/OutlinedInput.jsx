import { withAlpha } from 'utils/colorUtils';

// ==============================|| OVERRIDES - OUTLINED INPUT ||============================== //

export default function OutlinedInput(theme, borderRadius, outlinedFilled) {
  const radius = Math.max(Number(borderRadius || 8), 8);
  return {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          background: outlinedFilled
            ? theme.palette.mode === 'dark'
              ? withAlpha(theme.vars.palette.surface.muted, 0.86)
              : theme.vars.palette.surface.sunken
            : theme.vars.palette.surface.card,
          borderRadius: `${radius}px`,
          transition: 'border-color 120ms ease, box-shadow 120ms ease, background-color 120ms ease',
          backgroundClip: 'padding-box',
          boxShadow: 'none',

          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.vars.palette.divider,
            borderWidth: 1
          },

          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: withAlpha(theme.vars.palette.primary.main, 0.62)
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.vars.palette.primary.main,
            borderWidth: 1
          },
          '&.Mui-focused': {
            boxShadow: `0 0 0 3px ${withAlpha(theme.vars.palette.primary.main, theme.palette.mode === 'dark' ? 0.18 : 0.12)}`
          },
          '&.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderWidth: 1
          },
          '&.Mui-disabled': {
            backgroundColor:
              theme.palette.mode === 'dark'
                ? withAlpha(theme.vars.palette.surface.muted, 0.6)
                : withAlpha(theme.vars.palette.grey[100], 0.75)
          },

          '&.MuiInputBase-multiline': {
            padding: 1
          }
        },
        input: {
          fontWeight: 500,
          background: 'transparent',
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
        adornedStart: {
          paddingLeft: 10
        },
        adornedEnd: {
          paddingRight: 10
        },
        notchedOutline: {
          borderRadius: `${radius}px`
        }
      }
    }
  };
}
