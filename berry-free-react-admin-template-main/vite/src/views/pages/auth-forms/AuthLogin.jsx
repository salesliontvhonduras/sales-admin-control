import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
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

// ===============================|| JWT - LOGIN ||=============================== //

export default function AuthLogin() {
  const { login, verifyOtp, resendOtp, pendingTwoFactor } = useAuth();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

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
        enqueueSnackbar('Ingresa el código que enviamos para completar el acceso.', { variant: 'info' });
        return;
      }

      if (success) {
        enqueueSnackbar('Welcome back! 👋', { variant: 'success' });
        navigate('/dashboard/default');
      } else {
        enqueueSnackbar('Invalid credentials', { variant: 'error' });
      }
    } catch (err) {
      enqueueSnackbar('Invalid email or password', { variant: 'error' });
      console.error(err);
    } finally {
      setLoading((prev) => ({ ...prev, creds: false }));
    }
  };

  // Paso 2: OTP
  const handleVerifyOtp = async () => {
    if (!otpCode.trim()) {
      enqueueSnackbar('Ingresa el código que recibiste.', { variant: 'warning' });
      return;
    }
    setLoading((prev) => ({ ...prev, otp: true }));
    try {
      await verifyOtp(otpCode.trim());
      enqueueSnackbar('Acceso verificado ✅', { variant: 'success' });
      navigate('/dashboard/default');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Código inválido, inténtalo nuevamente.';
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
      enqueueSnackbar('Hemos reenviado el código.', { variant: 'info' });
    } catch (err) {
      const msg = err?.response?.data?.message || 'No pudimos reenviar el código.';
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
        <>
          <CustomFormControl fullWidth>
            <InputLabel htmlFor="outlined-adornment-email-login">Email Address</InputLabel>
            <OutlinedInput
              id="outlined-adornment-email-login"
              type="email"
              value={values.email}
              name="email"
              onChange={handleChange}
              label="Email Address"
            />
          </CustomFormControl>

          <CustomFormControl fullWidth>
            <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
            <OutlinedInput
              id="outlined-adornment-password-login"
              type={showPassword ? 'text' : 'password'}
              value={values.password}
              name="password"
              onChange={handleChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    size="large"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </CustomFormControl>

          <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <Grid>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checked}
                    onChange={(event) => setChecked(event.target.checked)}
                    name="checked"
                    color="primary"
                  />
                }
                label="Keep me logged in"
              />
            </Grid>
            <Grid>
              <Typography
                variant="subtitle1"
                component={Link}
                to="#!"
                sx={{ textDecoration: 'none', color: 'secondary.main' }}
              >
                Forgot Password?
              </Typography>
            </Grid>
          </Grid>

          <Box sx={{ mt: 2 }}>
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
                {loading.creds ? 'Signing in...' : 'Sign In'}
              </Button>
            </AnimateButton>
          </Box>
        </>
      ) : (
        <Stack spacing={2}>
          <Typography variant="subtitle1" sx={{ color: 'secondary.main' }}>
            Verificación en dos pasos
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Ingresa el código enviado a {destinationLabel || 'tu dispositivo registrado'}.
          </Typography>
          <TextField
            label="Código de verificación"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value.replace(/\\s+/g, ''))}
            inputProps={{ inputMode: 'numeric', maxLength: 8 }}
            autoFocus
          />
          <Stack direction="row" spacing={1} justifyContent="space-between">
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleResend}
              disabled={loading.resend}
              startIcon={loading.resend ? <CircularProgress size={16} /> : null}
            >
              {loading.resend ? 'Enviando...' : 'Reenviar código'}
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleVerifyOtp}
              disabled={loading.otp}
              startIcon={loading.otp ? <CircularProgress color="inherit" size={16} /> : null}
            >
              {loading.otp ? 'Verificando...' : 'Confirmar'}
            </Button>
          </Stack>
          <Button size="small" onClick={() => setStep('creds')} sx={{ alignSelf: 'flex-start' }}>
            Volver a credenciales
          </Button>
        </Stack>
      )}
    </form>
  );
}
