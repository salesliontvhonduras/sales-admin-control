import { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import CustomFormControl from 'ui-component/extended/Form/CustomFormControl';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// hooks
import useAuth from 'hooks/useAuth';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';

// ===============================|| JWT - LOGIN ||=============================== //

export default function AuthLogin() {
  const { login, verifyOtp, resendOtp, pendingTwoFactor } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();

  const [checked, setChecked] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState('creds'); // creds | otp
  const [loading, setLoading] = useState({ creds: false, otp: false, resend: false });

  const [values, setValues] = useState({
    email: '',
    password: ''
  });
  const [otpCode, setOtpCode] = useState('');
  const [twoFactorInfo, setTwoFactorInfo] = useState(null);

  const destinationLabel = useMemo(() => {
    const dest = twoFactorInfo?.destination || pendingTwoFactor?.destination;
    const channel = twoFactorInfo?.channel || pendingTwoFactor?.channel;
    if (!dest) return '';
    return channel ? `${dest} (${channel})` : dest;
  }, [twoFactorInfo, pendingTwoFactor]);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Prefill email if coming from reset password flow
  useEffect(() => {
    const navEmail = location.state?.email;
    if (navEmail && !values.email) {
      setValues((prev) => ({ ...prev, email: navEmail }));
    }
  }, [location.state, values.email]);

  // Paso 1: credenciales
  const handleSubmitCreds = async () => {
    setLoading((prev) => ({ ...prev, creds: true }));
    try {
      const res = await login(values.email, values.password, checked);

      const success = res.status === 200 && res.data?.success !== false;
      const twoFactor = res.twoFactor ?? res.data?.data?.twoFactor ?? null;

      if (twoFactor?.required) {
        setTwoFactorInfo(twoFactor);
        setStep('otp');
        enqueueSnackbar(t('messages.codeInfo'), { variant: 'info' });
        return;
      }

      if (success) {
        enqueueSnackbar(t('messages.welcome'), { variant: 'success' });
        navigate('/dashboard/default');
      } else {
        enqueueSnackbar(t('messages.invalidCreds'), { variant: 'error' });
      }
    } catch (err) {
      enqueueSnackbar(t('messages.invalidCreds'), { variant: 'error' });
      console.error(err);
    } finally {
      setLoading((prev) => ({ ...prev, creds: false }));
    }
  };

  // Paso 2: OTP
  const handleVerifyOtp = async () => {
    if (!otpCode.trim()) {
      enqueueSnackbar(t('messages.enterCode'), { variant: 'warning' });
      return;
    }
    setLoading((prev) => ({ ...prev, otp: true }));
    try {
      await verifyOtp(otpCode.trim());
      enqueueSnackbar(t('messages.welcome'), { variant: 'success' });
      navigate('/dashboard/default');
    } catch (err) {
      const msg = err?.response?.data?.message || t('messages.invalidCreds');
      enqueueSnackbar(msg, { variant: 'error' });
      console.error(err);
    } finally {
      setLoading((prev) => ({ ...prev, otp: false }));
    }
  };

  const handleResend = async () => {
    setLoading((prev) => ({ ...prev, resend: true }));
    try {
      await resendOtp();
      enqueueSnackbar(t('messages.resendOk'), { variant: 'info' });
    } catch (err) {
      const msg = err?.response?.data?.message || t('auth.otpResendError');
      enqueueSnackbar(msg, { variant: 'error' });
      console.error(err);
    } finally {
      setLoading((prev) => ({ ...prev, resend: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 'creds') {
      await handleSubmitCreds();
    } else {
      await handleVerifyOtp();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {step === 'creds' ? (
        <Stack spacing={1.25}>
          <CustomFormControl fullWidth>
            <InputLabel htmlFor="outlined-adornment-email-login">{t('auth.email')}</InputLabel>
            <OutlinedInput
              id="outlined-adornment-email-login"
              type="email"
              value={values.email}
              name="email"
              onChange={handleChange}
              label={t('auth.email')}
            />
          </CustomFormControl>

          <CustomFormControl fullWidth>
            <InputLabel htmlFor="outlined-adornment-password-login">{t('auth.password')}</InputLabel>
            <OutlinedInput
              id="outlined-adornment-password-login"
              type={showPassword ? 'text' : 'password'}
              value={values.password}
              name="password"
              onChange={handleChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label={t('auth.togglePasswordVisibility')}
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    size="large"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              label={t('auth.password')}
            />
          </CustomFormControl>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={0.5}
            sx={{ alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', width: '100%' }}
          >
            <FormControlLabel
              sx={{ mr: 0, ml: -0.5 }}
              control={
                <Checkbox
                  checked={checked}
                  onChange={(event) => setChecked(event.target.checked)}
                  name="checked"
                  color="primary"
                />
              }
              label={t('auth.keepLogged')}
            />
            <Typography
              variant="subtitle1"
              component={Link}
              to="/pages/forgot-password"
              sx={{ textDecoration: 'none', color: 'secondary.main', display: 'inline-flex' }}
            >
              {t('auth.forgot')}
            </Typography>
          </Stack>

          <Box sx={{ mt: 1 }}>
            <AnimateButton>
              <Button
                color="secondary"
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                disabled={loading.creds}
                startIcon={loading.creds ? <CircularProgress color="inherit" size={18} /> : null}
              >
                {loading.creds ? t('auth.sending') : t('auth.signIn')}
              </Button>
            </AnimateButton>
          </Box>
        </Stack>
      ) : (
        <Stack spacing={2}>
          <Typography variant="subtitle1" sx={{ color: 'secondary.main' }}>
            {t('auth.otpTitle')}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t('auth.otpInstruction', { dest: destinationLabel || t('auth.otpDestinationFallback') })}
          </Typography>
          <TextField
            label={t('auth.codeLabel')}
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value.replace(/\\s+/g, ''))}
            inputProps={{ inputMode: 'numeric', maxLength: 8 }}
            autoFocus
          />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="space-between">
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleResend}
              disabled={loading.resend}
              startIcon={loading.resend ? <CircularProgress size={16} /> : null}
              fullWidth
            >
              {loading.resend ? t('auth.sendingCode') : t('auth.resend')}
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleVerifyOtp}
              disabled={loading.otp}
              startIcon={loading.otp ? <CircularProgress color="inherit" size={16} /> : null}
              fullWidth
            >
              {loading.otp ? t('auth.verifyingCode') : t('auth.confirm')}
            </Button>
          </Stack>
          <Button size="small" onClick={() => setStep('creds')} sx={{ alignSelf: 'flex-start' }}>
            {t('auth.backToCreds')}
          </Button>
        </Stack>
      )}
    </form>
  );
}
