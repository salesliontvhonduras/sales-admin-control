import PropTypes from 'prop-types';
import { useMemo } from 'react';

// material-ui
import { createTheme, ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// project imports
import { CSS_VAR_PREFIX, DEFAULT_THEME_MODE } from 'config';
import CustomShadows from './custom-shadows';
import useConfig from 'hooks/useConfig';
import { buildPalette } from './palette';
import Typography from './typography';
import componentsOverrides from './overrides';

// ==============================|| DEFAULT THEME - MAIN ||============================== //

export default function ThemeCustomization({ children }) {
  const {
    state: { borderRadius, fontFamily, outlinedFilled, presetColor }
  } = useConfig();

  const palette = useMemo(() => buildPalette(presetColor), [presetColor]);

  const themeTypography = useMemo(() => Typography(fontFamily), [fontFamily]);

  const themeOptions = useMemo(
    () => ({
      direction: 'ltr',
      shape: {
        borderRadius: Math.max(Number(borderRadius || 10), 10)
      },
      mixins: {
        toolbar: {
          minHeight: '64px',
          padding: '14px 18px',
          '@media (min-width: 600px)': {
            minHeight: '64px'
          }
        }
      },
      typography: themeTypography,
      colorSchemes: {
        light: {
          palette: palette.light,
          customShadows: CustomShadows(palette.light, 'light')
        },
        dark: {
          palette: palette.dark,
          customShadows: CustomShadows(palette.dark, 'dark')
        }
      },
      cssVariables: {
        cssVarPrefix: CSS_VAR_PREFIX,
        colorSchemeSelector: 'data-color-scheme'
      },
      shadows: [
        'none',
        '0 1px 2px rgba(2, 8, 23, 0.06)',
        '0 2px 6px rgba(2, 8, 23, 0.08)',
        '0 4px 10px rgba(2, 8, 23, 0.1)',
        '0 6px 14px rgba(2, 8, 23, 0.11)',
        '0 8px 18px rgba(2, 8, 23, 0.12)',
        '0 10px 22px rgba(2, 8, 23, 0.13)',
        '0 12px 26px rgba(2, 8, 23, 0.14)',
        '0 14px 30px rgba(2, 8, 23, 0.15)',
        '0 16px 32px rgba(2, 8, 23, 0.16)',
        '0 18px 36px rgba(2, 8, 23, 0.16)',
        '0 20px 40px rgba(2, 8, 23, 0.17)',
        '0 22px 42px rgba(2, 8, 23, 0.18)',
        '0 24px 46px rgba(2, 8, 23, 0.19)',
        '0 26px 48px rgba(2, 8, 23, 0.2)',
        '0 28px 52px rgba(2, 8, 23, 0.2)',
        '0 30px 54px rgba(2, 8, 23, 0.21)',
        '0 32px 56px rgba(2, 8, 23, 0.22)',
        '0 34px 60px rgba(2, 8, 23, 0.22)',
        '0 36px 62px rgba(2, 8, 23, 0.23)',
        '0 38px 64px rgba(2, 8, 23, 0.24)',
        '0 40px 66px rgba(2, 8, 23, 0.24)',
        '0 42px 70px rgba(2, 8, 23, 0.25)',
        '0 44px 72px rgba(2, 8, 23, 0.26)',
        '0 46px 74px rgba(2, 8, 23, 0.26)'
      ]
    }),
    [themeTypography, palette, borderRadius]
  );

  const themes = createTheme(themeOptions);

  // Keep frequently used surface/text tokens aligned with active CSS variables.
  // This avoids stale light values in custom sx callbacks during dark mode.
  if (themes.vars?.palette) {
    themes.palette.background = themes.vars.palette.background;
    themes.palette.surface = themes.vars.palette.surface;
    themes.palette.grey = themes.vars.palette.grey;
    themes.palette.text = themes.vars.palette.text;
    themes.palette.divider = themes.vars.palette.divider;
  }

  // In CSS variables mode, some components rely on `theme.palette.mode` to branch styles.
  // We normalize it to the active `data-color-scheme` so light/dark branches stay accurate.
  const initialMode = themes.palette.mode;
  const resolveActiveMode = () => {
    if (typeof document !== 'undefined') {
      const attrFromHtml = document.documentElement?.getAttribute('data-color-scheme');
      if (attrFromHtml === 'light' || attrFromHtml === 'dark') return attrFromHtml;

      const attrFromBody = document.body?.getAttribute('data-color-scheme');
      if (attrFromBody === 'light' || attrFromBody === 'dark') return attrFromBody;

      const scoped = document.querySelector('[data-color-scheme]');
      const scopedAttr = scoped?.getAttribute('data-color-scheme');
      if (scopedAttr === 'light' || scopedAttr === 'dark') return scopedAttr;
    }
    return initialMode;
  };

  try {
    Object.defineProperty(themes.palette, 'mode', {
      configurable: true,
      enumerable: true,
      get: resolveActiveMode
    });
  } catch {
    // non-fatal in case palette.mode is not configurable
  }

  themes.components = useMemo(() => componentsOverrides(themes, borderRadius, outlinedFilled), [themes, borderRadius, outlinedFilled]);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider disableTransitionOnChange theme={themes} modeStorageKey="theme-mode" defaultMode={DEFAULT_THEME_MODE}>
        <CssBaseline enableColorScheme />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

ThemeCustomization.propTypes = { children: PropTypes.node };
