// project imports
import { extendPaletteWithChannels, withAlpha } from 'utils/colorUtils';

// assets
import defaultColor from 'assets/scss/_themes-vars.module.scss';

// ==============================|| DEFAULT THEME - PALETTE ||============================== //

export function buildPalette(presetColor) {
  let colors;
  switch (presetColor) {
    case 'default':
    default:
      colors = defaultColor;
  }

  const lightColors = {
    primary: {
      light: colors.primaryLight,
      main: colors.primaryMain,
      dark: colors.primaryDark,
      200: colors.primary200,
      800: colors.primary800
    },
    secondary: {
      light: colors.secondaryLight,
      main: colors.secondaryMain,
      dark: colors.secondaryDark,
      200: colors.secondary200,
      800: colors.secondary800
    },
    error: {
      light: colors.errorLight,
      main: colors.errorMain,
      dark: colors.errorDark
    },
    orange: {
      light: colors.orangeLight,
      main: colors.orangeMain,
      dark: colors.orangeDark
    },
    warning: {
      light: colors.warningLight,
      main: colors.warningMain,
      dark: colors.warningDark,
      contrastText: colors.grey700
    },
    success: {
      light: colors.successLight,
      200: colors.success200,
      main: colors.successMain,
      dark: colors.successDark
    },
    grey: {
      50: colors.grey50,
      100: colors.grey100,
      500: colors.grey500,
      600: colors.grey600,
      700: colors.grey700,
      900: colors.grey900
    },
    dark: {
      light: colors.darkTextPrimary,
      main: colors.darkLevel1,
      dark: colors.darkLevel2,
      800: colors.darkBackground,
      900: colors.darkPaper
    },
    text: {
      primary: colors.grey700,
      secondary: colors.grey500,
      dark: colors.grey900,
      hint: colors.grey100,
      heading: colors.grey900
    },
    divider: colors.grey200,
    background: {
      paper: colors.paper,
      default: '#f6f8fc'
    },
    action: {
      hover: 'rgba(25, 118, 210, 0.06)',
      selected: 'rgba(25, 118, 210, 0.12)',
      focus: 'rgba(25, 118, 210, 0.18)',
      disabledBackground: colors.grey100
    }
  };

  const darkColors = {
    primary: {
      light: colors.darkPrimaryLight,
      main: colors.darkPrimaryMain,
      dark: colors.darkPrimaryDark,
      200: colors.darkPrimary200,
      800: colors.darkPrimary800
    },
    secondary: {
      light: colors.darkSecondaryLight,
      main: colors.darkSecondaryMain,
      dark: colors.darkSecondaryDark,
      200: colors.darkSecondary200,
      800: colors.darkSecondary800
    },
    error: {
      light: colors.errorLight,
      main: colors.errorMain,
      dark: colors.errorDark
    },
    orange: {
      light: colors.orangeLight,
      main: colors.orangeMain,
      dark: colors.orangeDark
    },
    warning: {
      light: colors.warningLight,
      main: colors.warningMain,
      dark: colors.warningDark,
      contrastText: colors.darkPaper
    },
    success: {
      light: colors.successLight,
      200: colors.success200,
      main: colors.successMain,
      dark: colors.successDark
    },
    grey: {
      50: '#182039',
      100: '#1e2742',
      200: '#273153',
      300: '#33406a',
      500: colors.darkTextSecondary,
      600: colors.darkTextPrimary,
      700: colors.darkTextTitle,
      900: '#f4f7ff'
    },
    dark: {
      light: colors.darkTextPrimary,
      main: colors.darkLevel1,
      dark: colors.darkLevel2,
      800: colors.darkBackground,
      900: colors.darkPaper
    },
    text: {
      primary: colors.darkTextTitle,
      secondary: colors.darkTextPrimary,
      dark: '#ffffff',
      hint: withAlpha(colors.darkTextSecondary, 0.58),
      heading: '#f5f7ff'
    },
    divider: withAlpha(colors.darkTextSecondary, 0.22),
    background: {
      paper: colors.darkPaper,
      default: colors.darkBackground
    },
    action: {
      hover: withAlpha(colors.darkPrimaryMain, 0.16),
      selected: withAlpha(colors.darkPrimaryMain, 0.24),
      focus: withAlpha(colors.darkPrimaryMain, 0.34),
      disabledBackground: withAlpha(colors.darkTextSecondary, 0.16)
    }
  };

  const commonColor = { common: { black: colors.darkPaper, white: '#fff' } };

  const extendedLight = extendPaletteWithChannels(lightColors);
  const extendedDark = extendPaletteWithChannels(darkColors);
  const extendedCommon = extendPaletteWithChannels(commonColor);

  return {
    light: {
      mode: 'light',
      ...extendedCommon,
      ...extendedLight
    },
    dark: {
      mode: 'dark',
      ...extendedCommon,
      ...extendedDark
    }
  };
}
