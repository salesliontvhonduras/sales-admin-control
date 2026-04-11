// ==============================|| OVERRIDES - CARD HEADER ||============================== //

export default function CardHeader(theme) {
  return {
    MuiCardHeader: {
      styleOverrides: {
        root: {
          color: theme.vars.palette.text.primary,
          padding: '18px 20px',
          [theme.breakpoints.down('sm')]: {
            padding: '14px',
            alignItems: 'stretch'
          }
        },
        title: {
          fontSize: '1.03rem',
          fontWeight: 700,
          lineHeight: 1.25,
          whiteSpace: 'normal',
          overflowWrap: 'anywhere',
          wordBreak: 'break-word',
          [theme.breakpoints.down('sm')]: {
            fontSize: '0.96rem',
            lineHeight: 1.32
          }
        },
        subheader: {
          fontSize: '0.78rem',
          lineHeight: 1.35,
          whiteSpace: 'normal',
          overflowWrap: 'anywhere',
          [theme.breakpoints.down('sm')]: {
            fontSize: '0.74rem'
          }
        }
      }
    }
  };
}
