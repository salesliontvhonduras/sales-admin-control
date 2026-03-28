// ==============================|| OVERRIDES - PAPER ||============================== //

export default function Paper(borderRadius) {
  const radius = Math.max(Number(borderRadius || 8), 8);
  return {
    MuiPaper: {
      defaultProps: {
        elevation: 0
      },
      styleOverrides: {
        root: {
          backgroundImage: 'none'
        },
        rounded: {
          borderRadius: `${radius}px`
        },
        elevation1: {
          border: '1px solid rgba(15, 23, 42, 0.06)',
          boxShadow: '0 8px 18px rgba(15, 23, 42, 0.08)'
        }
      }
    }
  };
}
