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
      lighter: '#e8f1ff',
      light: '#d7e8ff',
      main: '#3b82f6',
      dark: '#2563eb',
      darker: '#1d4ed8',
      contrastText: '#1e3a8a',
      200: colors.primary200,
      800: colors.primary800
    },
    secondary: {
      lighter: '#f3e8ff',
      light: '#e9d5ff',
      main: '#8b5cf6',
      dark: '#7c3aed',
      darker: '#6d28d9',
      contrastText: '#5b21b6',
      200: colors.secondary200,
      800: colors.secondary800
    },
    error: {
      lighter: '#fee2e2',
      light: '#fecaca',
      main: '#ef4444',
      dark: '#dc2626',
      darker: '#b91c1c',
      contrastText: '#991b1b'
    },
    info: {
      lighter: '#e0f2fe',
      light: '#bae6fd',
      main: '#0ea5e9',
      dark: '#0284c7',
      darker: '#0369a1',
      contrastText: '#0c4a6e'
    },
    orange: {
      light: colors.orangeLight,
      main: colors.orangeMain,
      dark: colors.orangeDark
    },
    warning: {
      lighter: '#fff7d6',
      light: '#ffec99',
      main: '#f59e0b',
      dark: '#d97706',
      darker: '#b45309',
      contrastText: colors.grey700
    },
    success: {
      lighter: '#dcfce7',
      light: '#bbf7d0',
      200: colors.success200,
      main: '#22c55e',
      dark: '#16a34a',
      darker: '#15803d',
      contrastText: '#166534'
    },
    grey: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: colors.grey500,
      600: colors.grey600,
      700: '#334155',
      800: '#1e293b',
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
      primary: '#111827',
      secondary: '#64748b',
      dark: '#0f172a',
      hint: colors.grey100,
      heading: '#0b1220'
    },
    divider: 'rgba(15, 23, 42, 0.1)',
    background: {
      paper: '#ffffff',
      default: '#f4f7fb'
    },
    surface: {
      sunken: '#edf3fb',
      card: '#ffffff',
      sidebar: '#f8fbff',
      header: '#ffffff',
      muted: '#f1f5fb'
    },
    action: {
      hover: 'rgba(59, 130, 246, 0.08)',
      selected: 'rgba(59, 130, 246, 0.14)',
      focus: 'rgba(59, 130, 246, 0.22)',
      disabledBackground: '#e5e7eb'
    }
  };

  const darkColors = {
    primary: {
      lighter: '#1d3a6a',
      light: '#315fa5',
      main: '#60a5fa',
      dark: '#3b82f6',
      darker: '#2563eb',
      contrastText: '#dbeafe',
      200: colors.darkPrimary200,
      800: colors.darkPrimary800
    },
    secondary: {
      lighter: '#3b2b66',
      light: '#5b3d9d',
      main: '#a78bfa',
      dark: '#8b5cf6',
      darker: '#7c3aed',
      contrastText: '#ede9fe',
      200: colors.darkSecondary200,
      800: colors.darkSecondary800
    },
    error: {
      lighter: '#4b1f26',
      light: '#7f1d1d',
      main: '#f87171',
      dark: '#ef4444',
      darker: '#dc2626',
      contrastText: '#fee2e2'
    },
    info: {
      lighter: '#163b4d',
      light: '#1f5268',
      main: '#38bdf8',
      dark: '#0ea5e9',
      darker: '#0284c7',
      contrastText: '#e0f2fe'
    },
    orange: {
      light: colors.orangeLight,
      main: colors.orangeMain,
      dark: colors.orangeDark
    },
    warning: {
      lighter: '#4b3b1a',
      light: '#7c5a10',
      main: '#fbbf24',
      dark: '#f59e0b',
      darker: '#d97706',
      contrastText: '#111827'
    },
    success: {
      lighter: '#15372a',
      light: '#1f5b41',
      200: colors.success200,
      main: '#4ade80',
      dark: '#22c55e',
      darker: '#16a34a',
      contrastText: '#dcfce7'
    },
    grey: {
      50: '#0f172a',
      100: '#111b32',
      200: '#1b2741',
      300: '#273451',
      400: '#3b4a68',
      500: '#94a3b8',
      600: '#c3d0e5',
      700: '#d7dfef',
      800: '#e5eaf5',
      900: '#f8fbff'
    },
    dark: {
      light: '#22304b',
      main: '#101a30',
      dark: '#0b1324',
      800: '#0b1220',
      900: '#101a30'
    },
    text: {
      primary: '#e6ecf8',
      secondary: '#9fb0cc',
      dark: '#f8fbff',
      hint: withAlpha('#9fb0cc', 0.6),
      heading: '#f8fbff'
    },
    divider: withAlpha('#a5b4d6', 0.22),
    background: {
      paper: '#111a2e',
      default: '#0b1220'
    },
    surface: {
      sunken: '#0d1729',
      card: '#121f35',
      sidebar: '#0f1a2f',
      header: '#0f1a2f',
      muted: '#15233b'
    },
    action: {
      hover: withAlpha('#60a5fa', 0.16),
      selected: withAlpha('#60a5fa', 0.24),
      focus: withAlpha('#60a5fa', 0.34),
      disabledBackground: withAlpha('#94a3b8', 0.2)
    }
  };

  const commonColor = { common: { black: '#0b1220', white: '#ffffff' } };

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
