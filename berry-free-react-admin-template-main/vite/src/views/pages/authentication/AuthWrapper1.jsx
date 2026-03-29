// material-ui
import { styled } from '@mui/material/styles';
import { withAlpha } from 'utils/colorUtils';

// ==============================|| AUTHENTICATION 1 WRAPPER ||============================== //

const AuthWrapper1 = styled('div')(({ theme }) => ({
  background:
    theme.palette.mode === 'dark'
      ? `radial-gradient(circle at 12% 12%, ${withAlpha(theme.vars.palette.primary.main, 0.22)} 0%, transparent 42%), radial-gradient(circle at 88% 6%, ${withAlpha(theme.vars.palette.secondary.main, 0.2)} 0%, transparent 36%), linear-gradient(180deg, ${theme.vars.palette.background.default} 0%, ${theme.vars.palette.dark.main} 100%)`
      : `radial-gradient(circle at 12% 12%, ${withAlpha(theme.vars.palette.primary.main, 0.12)} 0%, transparent 40%), radial-gradient(circle at 86% 6%, ${withAlpha(theme.vars.palette.secondary.main, 0.08)} 0%, transparent 34%), linear-gradient(180deg, ${theme.vars.palette.grey[50]} 0%, ${theme.vars.palette.grey[100]} 100%)`,
  minHeight: '100vh'
}));

export default AuthWrapper1;
