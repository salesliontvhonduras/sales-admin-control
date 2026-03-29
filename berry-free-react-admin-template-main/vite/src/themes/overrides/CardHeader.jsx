// ==============================|| OVERRIDES - CARD HEADER ||============================== //

export default function CardHeader(theme) {
  return {
    MuiCardHeader: {
      styleOverrides: {
        root: {
          color: theme.vars.palette.text.primary,
          padding: '18px 20px'
        },
        title: {
          fontSize: '1.03rem',
          fontWeight: 700
        },
        subheader: {
          fontSize: '0.78rem'
        }
      }
    }
  };
}
