// ==============================|| OVERRIDES - SELECT ||============================== //

export default function Select() {
  return {
    MuiSelect: {
      defaultProps: {
        MenuProps: {
          transitionDuration: 0,
          disableScrollLock: true
        }
      },
      styleOverrides: {
        select: {
          minHeight: '20px',
          '&:focus': {
            backgroundColor: 'transparent'
          }
        }
      }
    }
  };
}
