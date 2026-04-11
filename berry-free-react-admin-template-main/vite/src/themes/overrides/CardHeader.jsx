// ==============================|| OVERRIDES - CARD HEADER ||============================== //

export default function CardHeader(theme) {
  return {
    MuiCardHeader: {
      styleOverrides: {
        root: {
          color: theme.vars.palette.text.primary,
          padding: '18px 20px',
          [theme.breakpoints.down('sm')]: {
            padding: '14px'
          }
        },
        title: {
          fontSize: '1.03rem',
          fontWeight: 700,
          lineHeight: 1.25,
          whiteSpace: 'normal',
          overflowWrap: 'anywhere'
        },
        subheader: {
          fontSize: '0.78rem',
          lineHeight: 1.35,
          whiteSpace: 'normal',
          overflowWrap: 'anywhere'
        }
      }
    }
  };
}
