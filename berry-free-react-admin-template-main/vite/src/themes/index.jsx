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
        borderRadius: Math.max(Number(borderRadius || 8), 8)
      },
      mixins: {
        toolbar: {
          minHeight: '56px',
          padding: '16px',
          '@media (min-width: 600px)': {
            minHeight: '56px'
          }
        }
      },
      typography: themeTypography,
      colorSchemes: {
        light: {
          palette: palette.light,
          customShadows: CustomShadows(palette.light, 'light')
        }
      },
      cssVariables: {
        cssVarPrefix: CSS_VAR_PREFIX,
        colorSchemeSelector: 'data-color-scheme'
      },
      shadows: [
        'none',
        '0 1px 2px rgba(15, 23, 42, 0.08)',
        '0 2px 6px rgba(15, 23, 42, 0.1)',
        '0 4px 10px rgba(15, 23, 42, 0.12)',
        '0 6px 14px rgba(15, 23, 42, 0.13)',
        '0 8px 18px rgba(15, 23, 42, 0.15)',
        '0 10px 22px rgba(15, 23, 42, 0.16)',
        '0 12px 24px rgba(15, 23, 42, 0.16)',
        '0 12px 28px rgba(15, 23, 42, 0.17)',
        '0 14px 30px rgba(15, 23, 42, 0.18)',
        '0 16px 34px rgba(15, 23, 42, 0.18)',
        '0 18px 36px rgba(15, 23, 42, 0.19)',
        '0 20px 38px rgba(15, 23, 42, 0.19)',
        '0 22px 40px rgba(15, 23, 42, 0.2)',
        '0 24px 44px rgba(15, 23, 42, 0.2)',
        '0 26px 46px rgba(15, 23, 42, 0.2)',
        '0 28px 48px rgba(15, 23, 42, 0.21)',
        '0 30px 52px rgba(15, 23, 42, 0.21)',
        '0 32px 54px rgba(15, 23, 42, 0.22)',
        '0 34px 56px rgba(15, 23, 42, 0.22)',
        '0 36px 58px rgba(15, 23, 42, 0.23)',
        '0 38px 62px rgba(15, 23, 42, 0.23)',
        '0 40px 64px rgba(15, 23, 42, 0.24)',
        '0 42px 66px rgba(15, 23, 42, 0.24)',
        '0 44px 68px rgba(15, 23, 42, 0.25)'
      ]
    }),
    [themeTypography, palette, borderRadius]
  );

  const themes = createTheme(themeOptions);
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
