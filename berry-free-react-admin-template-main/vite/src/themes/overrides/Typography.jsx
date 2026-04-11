// ==============================|| OVERRIDES - TYPOGRAPHY ||============================== //

export default function Typography(theme) {
  const headingColor = theme.vars.palette.text.heading;

  return {
    MuiTypography: {
      styleOverrides: {
        root: {
          minWidth: 0,
          overflowWrap: 'anywhere',
          variants: [
            {
              props: { variant: 'h1' },
              style: { color: headingColor, overflowWrap: 'anywhere', lineHeight: 1.08 }
            },
            {
              props: { variant: 'h2' },
              style: { color: headingColor, overflowWrap: 'anywhere', lineHeight: 1.12 }
            },
            {
              props: { variant: 'h3' },
              style: { color: headingColor, lineHeight: 1.2, overflowWrap: 'anywhere' }
            },
            {
              props: { variant: 'h4' },
              style: { color: headingColor, lineHeight: 1.22, overflowWrap: 'anywhere' }
            },
            {
              props: { variant: 'h5' },
              style: { color: headingColor, lineHeight: 1.24, overflowWrap: 'anywhere' }
            },
            {
              props: { variant: 'h6' },
              style: { color: headingColor, lineHeight: 1.26, overflowWrap: 'anywhere' }
            },
            {
              props: { variant: 'subtitle1' },
              style: { color: theme.vars.palette.text.dark }
            },
            {
              props: { variant: 'subtitle2' },
              style: { color: theme.vars.palette.text.secondary }
            },
            {
              props: { variant: 'caption' },
              style: { color: theme.vars.palette.text.secondary }
            },
            {
              props: { variant: 'body2' },
              style: { color: theme.vars.palette.text.primary }
            }
          ]
        }
      }
    }
  };
}
