// material-ui
import { styled } from '@mui/material/styles';

// ==============================|| MAIN LAYOUT - STYLED ||============================== //

const MainContentStyled = styled('main', {
  shouldForwardProp: (prop) => prop !== 'open' && prop !== 'borderRadius'
})(({ theme, open, borderRadius }) => ({
  background:
    theme.palette.mode === 'dark'
      ? `linear-gradient(180deg, ${theme.vars.palette.surface.sunken} 0%, ${theme.vars.palette.background.default} 100%)`
      : `linear-gradient(180deg, ${theme.vars.palette.surface.sunken} 0%, ${theme.vars.palette.background.default} 100%)`,
  minWidth: 0,
  width: '100%',
  maxWidth: '100%',
  minHeight: 'calc(100vh - 84px)',
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  padding: 'clamp(10px, 2vw, 20px)',
  paddingBottom: { xs: 16, sm: 20 },
  marginTop: 78,
  marginRight: { xs: 0, md: 12 },
  marginLeft: 0,
  borderRadius: `${Math.max(Number(borderRadius || 8), 8) + 6}px`,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  boxShadow: theme.palette.mode === 'dark' ? 'inset 0 1px 0 rgba(203, 213, 225, 0.04)' : 'inset 0 1px 0 rgba(15, 23, 42, 0.04)',
  transition: theme.transitions.create(['padding', 'margin-top'], {
    easing: theme.transitions.easing.easeOut,
    duration: 180
  }),
  [theme.breakpoints.down('md')]: {
    marginTop: 76,
    marginRight: 0,
    minHeight: 'calc(100vh - 80px)'
  },
  [theme.breakpoints.down('sm')]: {
    padding: 10,
    borderRadius: `${Math.max(Number(borderRadius || 8), 8) + 2}px`
  }
}));

export default MainContentStyled;
