export default function Typography(fontFamily) {
  return {
    fontFamily,
    h6: {
      fontWeight: 600,
      fontSize: '0.78rem',
      letterSpacing: '0.01em'
    },
    h5: {
      fontSize: '0.9rem',
      fontWeight: 600,
      lineHeight: 1.35
    },
    h4: {
      fontSize: '1.05rem',
      fontWeight: 700,
      lineHeight: 1.35
    },
    h3: {
      fontSize: '1.35rem',
      fontWeight: 700,
      lineHeight: 1.3
    },
    h2: {
      fontSize: '1.72rem',
      fontWeight: 800,
      lineHeight: 1.25
    },
    h1: {
      fontSize: '2.35rem',
      fontWeight: 800,
      lineHeight: 1.2
    },
    subtitle1: {
      fontSize: '0.9rem',
      fontWeight: 600
    },
    subtitle2: {
      fontSize: '0.78rem',
      fontWeight: 500
    },
    caption: {
      fontSize: '0.74rem',
      fontWeight: 500
    },
    body1: {
      fontSize: '0.9rem',
      fontWeight: 400,
      lineHeight: '1.45em'
    },
    body2: {
      letterSpacing: '0em',
      fontWeight: 400,
      fontSize: '0.83rem',
      lineHeight: '1.45em'
    },
    button: {
      textTransform: 'none',
      fontWeight: 600
    },
    commonAvatar: {
      cursor: 'pointer',
      borderRadius: '10px'
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
