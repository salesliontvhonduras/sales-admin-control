import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';

import { withAlpha } from 'utils/colorUtils';

function resolveMetricColor(theme, color = 'primary') {
  if (color === 'default') {
    return {
      main: theme.vars.palette.text.secondary,
      contrastText: theme.vars.palette.text.primary,
      lighter: withAlpha(theme.vars.palette.text.secondary, theme.palette.mode === 'dark' ? 0.2 : 0.12)
    };
  }

  const paletteColor = theme.palette[color] || theme.vars?.palette?.[color];
  if (paletteColor?.main) {
    return {
      main: paletteColor.main,
      contrastText: paletteColor.contrastText || theme.palette.getContrastText(paletteColor.main),
      lighter: paletteColor.lighter || paletteColor.light || withAlpha(paletteColor.main, 0.14)
    };
  }

  if (typeof color === 'string' && color) {
    return {
      main: color,
      contrastText: theme.palette.getContrastText(color),
      lighter: withAlpha(color, theme.palette.mode === 'dark' ? 0.22 : 0.14)
    };
  }

  return {
    main: theme.vars.palette.primary.main,
    contrastText: theme.vars.palette.primary.contrastText,
    lighter: theme.vars.palette.primary.lighter
  };
}

export function lionMetricCardSx(theme, color = 'primary') {
  const paletteColor = resolveMetricColor(theme, color);

  return {
    borderRadius: 3,
    border: '1px solid',
    borderColor: withAlpha(paletteColor.main, theme.palette.mode === 'dark' ? 0.3 : 0.16),
    backgroundColor: theme.vars.palette.surface.card,
    backgroundImage:
      theme.palette.mode === 'dark'
        ? `linear-gradient(145deg, ${withAlpha(paletteColor.main, 0.22)} 0%, ${withAlpha(theme.vars.palette.surface.muted, 0.96)} 48%, ${theme.vars.palette.surface.card} 100%)`
        : `linear-gradient(145deg, ${withAlpha(paletteColor.main, 0.14)} 0%, ${withAlpha(paletteColor.main, 0.05)} 34%, ${theme.vars.palette.background.paper} 100%)`,
    boxShadow:
      theme.palette.mode === 'dark'
        ? `0 14px 32px ${withAlpha('#020617', 0.5)}`
        : `0 12px 28px ${withAlpha('#0f172a', 0.1)}`,
    height: '100%'
  };
}

export default function LionMetricCard({
  title,
  value,
  helper,
  icon,
  color = 'primary',
  valueVariant = 'h3',
  sx = {}
}) {
  return (
    <Card sx={(theme) => ({ ...lionMetricCardSx(theme, color), ...(typeof sx === 'function' ? sx(theme) : sx) })}>
      <CardContent sx={{ p: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1.5}>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
                overflow: 'hidden',
                lineHeight: 1.35,
                fontWeight: 700,
                letterSpacing: 0.2,
                textTransform: 'uppercase'
              }}
            >
              {title}
            </Typography>
            <Typography
              variant={valueVariant}
              sx={{
                mt: 0.75,
                fontWeight: 800,
                lineHeight: 1.1,
                fontSize: {
                  xs: valueVariant === 'h2' ? '1.55rem' : '1.4rem',
                  sm: valueVariant === 'h2' ? '1.95rem' : '1.7rem'
                },
                overflowWrap: 'anywhere'
              }}
            >
              {value}
            </Typography>
            {helper ? (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  mt: 0.5,
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 2,
                  overflow: 'hidden',
                  lineHeight: 1.35
                }}
              >
                {helper}
              </Typography>
            ) : null}
          </Box>
          {icon ? (
            <Avatar
              variant="rounded"
              sx={(theme) => {
                const paletteColor = resolveMetricColor(theme, color);
                return {
                  width: { xs: 42, sm: 46 },
                  height: { xs: 42, sm: 46 },
                  flexShrink: 0,
                  bgcolor: paletteColor.lighter,
                  color: paletteColor.main,
                  boxShadow:
                    theme.palette.mode === 'dark'
                      ? `0 10px 22px ${withAlpha('#020617', 0.42)}`
                      : `0 8px 16px ${withAlpha('#0f172a', 0.12)}`
                };
              }}
            >
              {icon}
            </Avatar>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
}
