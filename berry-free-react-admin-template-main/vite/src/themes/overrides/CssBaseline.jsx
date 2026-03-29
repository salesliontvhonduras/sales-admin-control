import { withAlpha } from 'utils/colorUtils';

// ==============================|| OVERRIDES - CSS BASELINE ||============================== //

export default function CssBaseline(theme) {
  const isDark = theme.palette.mode === 'dark';

  return {
    MuiCssBaseline: {
      styleOverrides: {
        '*, *::before, *::after': {
          boxSizing: 'border-box'
        },
        html: {
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale'
        },
        body: {
          background: isDark
            ? `radial-gradient(circle at 15% -5%, ${withAlpha(theme.vars.palette.primary.main, 0.18)} 0%, transparent 34%), radial-gradient(circle at 85% -15%, ${withAlpha(theme.vars.palette.secondary.main, 0.16)} 0%, transparent 35%), ${theme.vars.palette.background.default}`
            : `radial-gradient(circle at 12% -8%, ${withAlpha(theme.vars.palette.primary.main, 0.08)} 0%, transparent 34%), radial-gradient(circle at 92% -10%, ${withAlpha(theme.vars.palette.secondary.main, 0.07)} 0%, transparent 30%), linear-gradient(180deg, ${theme.vars.palette.background.default} 0%, ${theme.vars.palette.surface.sunken} 100%)`
        },
        ':focus-visible': {
          outline: `2px solid ${theme.vars.palette.primary.main}`,
          outlineOffset: 2,
          borderRadius: 6
        },
        '::-webkit-scrollbar': {
          width: 9,
          height: 9
        },
        '::-webkit-scrollbar-track': {
          background: isDark ? withAlpha(theme.vars.palette.surface.muted, 0.92) : theme.vars.palette.surface.sunken
        },
        '::-webkit-scrollbar-thumb': {
          background: isDark ? withAlpha(theme.vars.palette.grey[500], 0.8) : theme.vars.palette.grey[300],
          borderRadius: 999
        },
        '::-webkit-scrollbar-thumb:hover': {
          background: isDark ? theme.vars.palette.grey[600] : theme.vars.palette.grey[400]
        },
        '#root': {
          minHeight: '100vh'
        }
      }
    }
  };
}
