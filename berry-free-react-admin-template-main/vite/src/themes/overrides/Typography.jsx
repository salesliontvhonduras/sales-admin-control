// ==============================|| OVERRIDES - TYPOGRAPHY ||============================== //

export default function Typography(theme) {
  const headingColor = theme.vars.palette.text.heading;
  const headingStyle = (fontSize, mobileFontSize, lineHeight = 1.2) => ({
    color: headingColor,
    lineHeight,
    overflowWrap: 'anywhere',
    wordBreak: 'break-word',
    fontSize,
    [theme.breakpoints.down('sm')]: {
      fontSize: mobileFontSize,
      lineHeight: lineHeight + 0.04
    }
  });

  return {
    MuiTypography: {
      styleOverrides: {
        root: {
          minWidth: 0,
          overflowWrap: 'anywhere',
          variants: [
            {
              props: { variant: 'h1' },
              style: headingStyle('2.5rem', '1.85rem', 1.08)
            },
            {
              props: { variant: 'h2' },
              style: headingStyle('2rem', '1.55rem', 1.12)
            },
            {
              props: { variant: 'h3' },
              style: headingStyle('1.65rem', '1.35rem', 1.2)
            },
            {
              props: { variant: 'h4' },
              style: headingStyle('1.35rem', '1.15rem', 1.22)
            },
            {
              props: { variant: 'h5' },
              style: headingStyle('1.15rem', '1.02rem', 1.24)
            },
            {
              props: { variant: 'h6' },
              style: headingStyle('1rem', '0.94rem', 1.26)
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
