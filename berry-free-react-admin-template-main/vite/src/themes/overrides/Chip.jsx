// project imports
import { withAlpha } from 'utils/colorUtils';

// ===============================||  OVERRIDES - CHIP  ||=============================== //

export default function Chip(theme) {
  return {
    MuiChip: {
      defaultProps: {
        color: 'primary',
        variant: 'light'
      },
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 600,
          variants: [
            {
              props: { variant: 'light' }, // Variant for light Chip
              style: ({ ownerState, theme }) => {
                // Make sure color exists and is a key of palette
                const colorKey = ownerState.color;
                const paletteColor = theme.vars.palette[colorKey];

                if (!paletteColor) return {};

                return {
                  color: paletteColor.main,
                  backgroundColor: paletteColor.light,

                  ...(ownerState.color === 'error' && {
                    backgroundColor: withAlpha(paletteColor.light, 0.25)
                  }),
                  ...(ownerState.color === 'success' && {
                    backgroundColor: withAlpha(paletteColor.light, 0.5)
                  }),
                  ...((ownerState.color === 'warning' || ownerState.color === 'success') && {
                    color: paletteColor.dark
                  }),

                  '&.MuiChip-clickable': {
                    '&:hover': {
                      color: paletteColor.light,
                      backgroundColor: paletteColor.dark
                    }
                  }
                };
              }
            },
            {
              props: { variant: 'outlined', color: 'warning' },
              style: {
                borderColor: theme.vars.palette.warning.dark,
                color: theme.vars.palette.warning.dark
              }
            },
            {
              props: { variant: 'outlined', color: 'success' },
              style: {
                borderColor: theme.vars.palette.success.dark,
                color: theme.vars.palette.success.dark
              }
            }
          ],
          '&.MuiChip-deletable .MuiChip-deleteIcon': {
            color: 'inherit'
          }
        },
        sizeSmall: {
          height: 24,
          fontSize: '0.68rem'
        },
        sizeMedium: {
          height: 30,
          fontSize: '0.75rem'
        }
      }
    }
  };
}
