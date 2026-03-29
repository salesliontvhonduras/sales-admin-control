// material-ui
import { alpha, styled } from '@mui/material/styles';

// ==============================|| AUTHENTICATION 1 WRAPPER ||============================== //

const AuthWrapper1 = styled('div')(({ theme }) => ({
  background:
    theme.palette.mode === 'dark'
      ? `radial-gradient(circle at 12% 12%, ${alpha(theme.vars.palette.primary.main, 0.18)} 0%, transparent 45%), linear-gradient(180deg, ${theme.vars.palette.background.default} 0%, ${theme.vars.palette.dark.main} 100%)`
      : `radial-gradient(circle at 12% 12%, ${alpha(theme.vars.palette.primary.main, 0.1)} 0%, transparent 45%), linear-gradient(180deg, ${theme.vars.palette.grey[50]} 0%, ${theme.vars.palette.grey[100]} 100%)`,
  minHeight: '100vh'
}));

export default AuthWrapper1;
