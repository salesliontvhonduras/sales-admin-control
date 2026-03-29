import { withAlpha } from 'utils/colorUtils';

// ==============================|| OVERRIDES - PAPER ||============================== //

export default function Paper(borderRadius) {
  const radius = Math.max(Number(borderRadius || 8), 8);
  return {
    MuiPaper: {
      defaultProps: {
        elevation: 0
      },
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundImage: 'none',
          backgroundColor: theme.vars.palette.surface.card
        }),
        rounded: {
          borderRadius: `${radius}px`
        },
        elevation1: ({ theme }) => ({
          border: `1px solid ${withAlpha(theme.vars.palette.divider, 0.95)}`,
          boxShadow:
            theme.palette.mode === 'dark' ? `0 14px 34px ${withAlpha('#020817', 0.45)}` : `0 10px 24px ${withAlpha('#0f172a', 0.1)}`
        })
      }
    }
  };
}
