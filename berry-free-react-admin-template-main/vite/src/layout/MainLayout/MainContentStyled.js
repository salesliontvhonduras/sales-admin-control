// material-ui
import { styled } from '@mui/material/styles';

// project imports
import { drawerWidth } from 'store/constant';

// ==============================|| MAIN LAYOUT - STYLED ||============================== //

const MainContentStyled = styled('main', {
  shouldForwardProp: (prop) => prop !== 'open' && prop !== 'borderRadius'
})(({ theme, open, borderRadius }) => ({
  background:
    theme.palette.mode === 'dark'
      ? `linear-gradient(180deg, ${theme.vars.palette.surface.sunken} 0%, ${theme.vars.palette.background.default} 100%)`
      : `linear-gradient(180deg, ${theme.vars.palette.surface.sunken} 0%, ${theme.vars.palette.background.default} 100%)`,
  minWidth: '1%',
  width: '100%',
  minHeight: 'calc(100vh - 88px)',
  flexGrow: 1,
  padding: 20,
  marginTop: 82,
  marginRight: 16,
  borderRadius: `${Math.max(Number(borderRadius || 8), 8) + 6}px`,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  boxShadow: theme.palette.mode === 'dark' ? 'inset 0 1px 0 rgba(203, 213, 225, 0.04)' : 'inset 0 1px 0 rgba(15, 23, 42, 0.04)',
  ...(!open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: 180
    }),
    [theme.breakpoints.up('md')]: {
      marginLeft: -(drawerWidth - 72),
      width: `calc(100% - ${drawerWidth}px)`,
      marginTop: 82
    }
  }),
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: 180
    }),
    marginLeft: 0,
    marginTop: 82,
    width: `calc(100% - ${drawerWidth}px)`,
    [theme.breakpoints.up('md')]: {
      marginTop: 82
    }
  }),
  [theme.breakpoints.down('md')]: {
    marginLeft: 16,
    padding: 14,
    marginTop: 82,
    ...(!open && {
      width: `calc(100% - ${drawerWidth}px)`
    })
  },
  [theme.breakpoints.down('sm')]: {
    marginLeft: 10,
    marginRight: 10
  }
}));

export default MainContentStyled;
