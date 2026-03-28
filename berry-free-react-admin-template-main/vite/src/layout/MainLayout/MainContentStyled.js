// material-ui
import { styled } from '@mui/material/styles';

// project imports
import { drawerWidth } from 'store/constant';

// ==============================|| MAIN LAYOUT - STYLED ||============================== //

const MainContentStyled = styled('main', {
  shouldForwardProp: (prop) => prop !== 'open' && prop !== 'borderRadius'
})(({ theme, open, borderRadius }) => ({
  background: `linear-gradient(180deg, ${theme.vars.palette.grey[100]} 0%, ${theme.vars.palette.background.default} 100%)`,
  minWidth: '1%',
  width: '100%',
  minHeight: 'calc(100vh - 88px)',
  flexGrow: 1,
  padding: 22,
  marginTop: 88,
  marginRight: 20,
  borderRadius: `${Math.max(Number(borderRadius || 8), 8) + 4}px`,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  boxShadow: 'inset 0 1px 0 rgba(15, 23, 42, 0.04)',
  ...(!open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: 220
    }),
    [theme.breakpoints.up('md')]: {
      marginLeft: -(drawerWidth - 72),
      width: `calc(100% - ${drawerWidth}px)`,
      marginTop: 88
    }
  }),
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: 220
    }),
    marginLeft: 0,
    marginTop: 88,
    width: `calc(100% - ${drawerWidth}px)`,
    [theme.breakpoints.up('md')]: {
      marginTop: 88
    }
  }),
  [theme.breakpoints.down('md')]: {
    marginLeft: 20,
    padding: 14,
    marginTop: 88,
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
