// ==============================|| OVERRIDES - CARD CONTENT ||============================== //

export default function CardContent(theme) {
  return {
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '20px',
          [theme.breakpoints.down('sm')]: {
            padding: '14px'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid rgba(15, 23, 42, 0.06)',
          borderRadius: 14,
          boxShadow: '0 12px 26px rgba(15, 23, 42, 0.08)',
          overflow: 'hidden'
        }
      }
    }
  };
}
