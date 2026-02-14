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

export default function ForgotPassword() {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
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
      const msg = err?.response?.data?.message || 'No pudimos enviar el correo, intenta más tarde.';
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
      const msg = err?.response?.data?.message || 'No se pudo actualizar la contraseña.';
      enqueueSnackbar(msg, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthWrapper1>
      <Stack sx={{ justifyContent: 'flex-end', minHeight: '100vh' }}>
        <Stack sx={{ justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 68px)' }}>
          <Box sx={{ m: { xs: 1, sm: 3 }, mb: 0, position: 'relative' }}>
            <AuthCardWrapper>
              <Stack sx={{ alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                <Box sx={{ mb: 3 }}>
                  <Link to="#" aria-label="logo">
                    <Logo />
                  </Link>
                </Box>
                <Stack sx={{ alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <Typography variant="h4" sx={{ color: 'secondary.main' }}>
                    {t('auth.recoverTitle')}
                  </Typography>
                  <Typography variant="caption" sx={{ fontSize: '16px', textAlign: { xs: 'center', md: 'inherit' } }}>
                    {t('auth.recoverSubtitle')}
                  </Typography>
                </Stack>
                <Stack spacing={2} sx={{ width: 1 }}>
                  {step === 'email' ? (
                    <>
                      <TextField
                        label={t('auth.email')}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                      />
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
                      <TextField
                        label="Token"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        fullWidth
                      />
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
                      <Button size="small" onClick={() => setStep('email')} sx={{ alignSelf: 'flex-start' }}>
                        {t('auth.sendAnother')}
                      </Button>
                    </>
                  )}
                </Stack>
                <Divider sx={{ width: 1 }} />
                <Stack sx={{ alignItems: 'center' }}>
                  <Typography component={Link} to="/pages/login" variant="subtitle1" sx={{ textDecoration: 'none' }}>
                    {t('auth.login')}
                  </Typography>
                </Stack>
              </Stack>
            </AuthCardWrapper>
          </Box>
        </Stack>
        <Box sx={{ px: 3, my: 3 }}>
          <AuthFooter />
        </Box>
      </Stack>
    </AuthWrapper1>
  );
}
