// ==============================|| OVERRIDES - CSS BASELINE ||============================== //

export default function CssBaseline(theme) {
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
          background: `linear-gradient(180deg, ${theme.vars.palette.background.default} 0%, ${theme.vars.palette.grey[100]} 100%)`
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
          background: theme.vars.palette.grey[100]
        },
        '::-webkit-scrollbar-thumb': {
          background: theme.vars.palette.grey[400],
          borderRadius: 999
        },
        '::-webkit-scrollbar-thumb:hover': {
          background: theme.vars.palette.grey[500]
        }
      }
    }
  };
}
