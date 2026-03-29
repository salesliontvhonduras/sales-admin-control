// material-ui
import { styled } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';

// project imports
import { drawerWidth } from 'store/constant';

function openedMixin(theme) {
  return {
    width: drawerWidth,
    borderRight: `1px solid ${theme.vars.palette.divider}`,
    zIndex: 1099,
    background: theme.vars.palette.surface.sidebar,
    overflowX: 'hidden',
    boxShadow: theme.palette.mode === 'dark' ? '6px 0 26px rgba(2, 8, 23, 0.32)' : '6px 0 20px rgba(15, 23, 42, 0.06)',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen + 200
    })
  };
}

function closedMixin(theme) {
  return {
    borderRight: `1px solid ${theme.vars.palette.divider}`,
    zIndex: 1099,
    background: theme.vars.palette.surface.sidebar,
    overflowX: 'hidden',
    width: 72,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen + 200
    })
  };
}

// ==============================|| DRAWER - MINI STYLED ||============================== //

const MiniDrawerStyled = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  width: drawerWidth,
  borderRight: '0px',
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme)
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme)
  })
}));

export default MiniDrawerStyled;
