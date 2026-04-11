// project imports
import { withAlpha } from 'utils/colorUtils';

// ===============================||  OVERRIDES - CHIP  ||=============================== //

export default function Chip(theme) {
  const resolveChipColor = (colorKey) => {
    if (colorKey === 'default' || !colorKey) {
      return {
        main: theme.vars.palette.text.secondary,
        light: withAlpha(theme.vars.palette.text.secondary, theme.palette.mode === 'dark' ? 0.22 : 0.12),
        dark: theme.vars.palette.text.primary
      };
    }

    const paletteColor = theme.vars.palette[colorKey] || theme.palette[colorKey];
    if (!paletteColor) {
      return {
        main: theme.vars.palette.primary.main,
        light: withAlpha(theme.vars.palette.primary.main, theme.palette.mode === 'dark' ? 0.2 : 0.12),
        dark: theme.vars.palette.primary.dark
      };
    }

    return {
      main: paletteColor.main,
      light: paletteColor.light || paletteColor.lighter || withAlpha(paletteColor.main, 0.14),
      dark: paletteColor.dark || paletteColor.darker || paletteColor.main
    };
  };

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
          borderWidth: 1,
          variants: [
            {
              props: { variant: 'light' }, // Variant for light Chip
              style: ({ ownerState, theme }) => {
                const paletteColor = resolveChipColor(ownerState.color);

                return {
                  color: paletteColor.main,
                  backgroundColor: theme.palette.mode === 'dark' ? withAlpha(paletteColor.main, 0.2) : paletteColor.light,
                  borderColor: theme.palette.mode === 'dark' ? withAlpha(paletteColor.main, 0.28) : withAlpha(paletteColor.main, 0.14),
                  borderStyle: 'solid',

                  '&.MuiChip-clickable': {
                    '&:hover': {
                      color: theme.palette.mode === 'dark' ? paletteColor.main : paletteColor.dark,
                      backgroundColor: theme.palette.mode === 'dark' ? withAlpha(paletteColor.main, 0.28) : withAlpha(paletteColor.main, 0.18)
                    }
                  }
                };
              }
            },
            {
              props: { variant: 'outlined' },
              style: ({ ownerState, theme }) => {
                const paletteColor = resolveChipColor(ownerState.color);
                return {
                  backgroundColor: theme.palette.mode === 'dark' ? withAlpha(paletteColor.main, 0.08) : 'transparent',
                  borderColor: theme.palette.mode === 'dark' ? withAlpha(paletteColor.main, 0.5) : withAlpha(paletteColor.main, 0.34),
                  color: theme.palette.mode === 'dark' ? paletteColor.main : paletteColor.dark
                };
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
