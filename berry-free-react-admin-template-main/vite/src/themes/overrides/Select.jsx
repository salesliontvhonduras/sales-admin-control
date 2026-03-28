// ==============================|| OVERRIDES - SELECT ||============================== //

export default function Select() {
  return {
    MuiSelect: {
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
