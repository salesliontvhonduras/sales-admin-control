export default function Typography(fontFamily) {
  return {
    fontFamily,
    h6: {
      fontWeight: 700,
      fontSize: '0.8rem',
      letterSpacing: '0.03em'
    },
    h5: {
      fontSize: '0.95rem',
      fontWeight: 650,
      lineHeight: 1.38
    },
    h4: {
      fontSize: '1.12rem',
      fontWeight: 700,
      lineHeight: 1.34
    },
    h3: {
      fontSize: '1.45rem',
      fontWeight: 750,
      lineHeight: 1.28
    },
    h2: {
      fontSize: '1.9rem',
      fontWeight: 800,
      lineHeight: 1.22
    },
    h1: {
      fontSize: '2.55rem',
      fontWeight: 800,
      lineHeight: 1.18
    },
    subtitle1: {
      fontSize: '0.94rem',
      fontWeight: 620,
      lineHeight: 1.4
    },
    subtitle2: {
      fontSize: '0.8rem',
      fontWeight: 600,
      lineHeight: 1.35
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 500,
      lineHeight: 1.4
    },
    body1: {
      fontSize: '0.92rem',
      fontWeight: 400,
      lineHeight: '1.52em'
    },
    body2: {
      letterSpacing: '0em',
      fontWeight: 400,
      fontSize: '0.85rem',
      lineHeight: '1.5em'
    },
    button: {
      textTransform: 'none',
      fontWeight: 650,
      letterSpacing: '0.01em'
    },
    commonAvatar: {
      cursor: 'pointer',
      borderRadius: '12px'
    },
    smallAvatar: {
      width: '22px',
      height: '22px',
      fontSize: '1rem'
    },
    mediumAvatar: {
      width: '34px',
      height: '34px',
      fontSize: '1.2rem'
    },
    largeAvatar: {
      width: '44px',
      height: '44px',
      fontSize: '1.5rem'
    }
  };
}
