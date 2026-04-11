import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import { useSnackbar } from 'notistack';
import AuthWrapper1 from './AuthWrapper1';
import AuthCardWrapper from './AuthCardWrapper';
import Logo from 'ui-component/Logo';
import AuthFooter from 'ui-component/cards/AuthFooter';
import { authApi } from 'utils/api';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from 'ui-component/LanguageSwitcher';
import ThemeModeSwitcher from 'ui-component/ThemeModeSwitcher';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function ForgotPassword() {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [step, setStep] = useState('email'); // email | reset
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendEmail = async () => {
    if (!email.trim()) {
      enqueueSnackbar(t('messages.enterEmail'), { variant: 'warning' });
      return;
    }
    setLoading(true);
    try {
      await authApi.post('/auth/v1/password/forgot', { email });
      enqueueSnackbar(t('messages.codeSent'), { variant: 'info' });
      setStep('reset');
    } catch (err) {
      const msg = err?.response?.data?.message || t('auth.forgotErrors.sendEmail');
      enqueueSnackbar(msg, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!token.trim() || !password.trim()) {
      enqueueSnackbar(t('messages.fillTokenPass'), { variant: 'warning' });
      return;
    }
    setLoading(true);
    try {
      await authApi.post('/auth/v1/password/reset', { token, newPassword: password });
      enqueueSnackbar(t('messages.passUpdated'), { variant: 'success' });
      setStep('email');
      setToken('');
      setPassword('');
      navigate('/pages/login', { replace: true, state: { email } });
    } catch (err) {
      const msg = err?.response?.data?.message || t('auth.forgotErrors.resetPassword');
      enqueueSnackbar(msg, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthWrapper1>
      <Stack sx={{ justifyContent: 'space-between', minHeight: { xs: '100dvh', sm: '100vh' } }}>
        <Stack
          sx={{
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: { xs: 'auto', sm: 'calc(100vh - 72px)' },
            px: { xs: 1, sm: 2.5 },
            py: { xs: 1.5, sm: 3 },
            flex: 1
          }}
        >
          <Box sx={{ width: '100%', maxWidth: { xs: '100%', sm: 480, md: 520 }, position: 'relative', minWidth: 0 }}>
            <AuthCardWrapper>
              <Stack sx={{ alignItems: 'center', justifyContent: 'center', gap: { xs: 1.5, sm: 2 }, minWidth: 0 }}>
                <Box sx={{ mb: { xs: 1, sm: 3 } }}>
                  <Link to="#" aria-label={t('auth.logoAriaLabel')}>
                    <Logo />
                  </Link>
                </Box>
                <Stack sx={{ alignItems: 'center', justifyContent: 'center', gap: 0.75, width: '100%', minWidth: 0 }}>
                  <Typography variant={isMobile ? 'h5' : 'h4'} sx={{ color: 'secondary.main', textAlign: 'center', width: '100%' }}>
                    {t('auth.recoverTitle')}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontSize: { xs: '0.95rem', sm: '1rem' }, textAlign: 'center', color: 'text.secondary', maxWidth: 420 }}
                  >
                    {t('auth.recoverSubtitle')}
                  </Typography>
                </Stack>
                <Stack spacing={2} sx={{ width: 1 }}>
                  {step === 'email' ? (
                    <>
                      <TextField label={t('auth.email')} type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleSendEmail}
                        disabled={loading}
                        startIcon={loading ? <CircularProgress color="inherit" size={16} /> : null}
                      >
                        {loading ? t('auth.sendingToken') : t('auth.sendToken')}
                      </Button>
                    </>
                  ) : (
                    <>
                      <TextField label={t('auth.codeLabel')} value={token} onChange={(e) => setToken(e.target.value)} fullWidth />
                      <TextField
                        label={t('auth.password')}
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                      />
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleReset}
                        disabled={loading}
                        startIcon={loading ? <CircularProgress color="inherit" size={16} /> : null}
                      >
                        {loading ? t('auth.savingPass') : t('auth.resetPass')}
                      </Button>
                      <Button size="small" onClick={() => setStep('email')} sx={{ alignSelf: { xs: 'stretch', sm: 'flex-start' } }}>
                        {t('auth.sendAnother')}
                      </Button>
                    </>
                  )}
                </Stack>
                <Divider sx={{ width: 1 }} />
                <Stack sx={{ alignItems: 'center' }}>
                  <Typography component={Link} to="/pages/login" variant="subtitle1" sx={{ textDecoration: 'none', textAlign: 'center' }}>
                    {t('auth.login')}
                  </Typography>
                </Stack>
                <Divider sx={{ width: 1 }} />
                <Stack direction="row" spacing={1} sx={{ alignItems: 'stretch', justifyContent: 'center', width: '100%' }}>
                  <ThemeModeSwitcher
                    compact={isMobile}
                    sx={{
                      flex: 1,
                      minWidth: 0,
                      maxWidth: { xs: 'none', sm: 180 },
                      width: '100%',
                      justifyContent: 'center',
                      '& .MuiChip-label': {
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }
                    }}
                  />
                  <LanguageSwitcher
                    compact={isMobile}
                    sx={{
                      flex: 1,
                      minWidth: 0,
                      maxWidth: { xs: 'none', sm: 180 },
                      width: '100%',
                      justifyContent: 'center',
                      '& .MuiChip-label': {
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }
                    }}
                  />
                </Stack>
              </Stack>
            </AuthCardWrapper>
          </Box>
        </Stack>
        <Box sx={{ px: { xs: 1.25, sm: 3 }, py: { xs: 1.5, sm: 3 } }}>
          <AuthFooter />
        </Box>
      </Stack>
    </AuthWrapper1>
  );
}
