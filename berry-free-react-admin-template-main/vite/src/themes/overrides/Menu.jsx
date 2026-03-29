// ==============================|| OVERRIDES - MENU ||============================== //

export default function Menu() {
  return {
    MuiMenu: {
      defaultProps: {
        transitionDuration: 0
      }
    },
    MuiPopover: {
      defaultProps: {
        transitionDuration: 0
      }
    }
  };
}
