import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import CustomFormControl from 'ui-component/extended/Form/CustomFormControl';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// hooks
import useAuth from 'hooks/useAuth';
import { useSnackbar } from 'notistack';


// ===========================|| JWT - REGISTER ||=========================== //

const BASE_URL = import.meta.env.VITE_APP_BASE_NAME;

export default function AuthRegister() {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { register } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const [strength, setStrength] = useState(0);
  const [level, setLevel] = useState();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    serialCode: '',
    password: ''
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setStrength(temp);
    setLevel(strengthColor(temp));
  };

  // Inicializa la barra de password
  useEffect(() => {
    changePassword('');
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));

    if (name === 'password') {
      changePassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = `${form.firstName} ${form.lastName}`.trim();

    try {
      const res = await register({
        name,
        email: form.email,
        serialCode: form.serialCode,
        password: form.password
      });

      if (res.status === 201 && res.data.success) {
        enqueueSnackbar('User registered successfuly.', { variant: 'success' });
        navigate(BASE_URL + '/pages/login');
      } else {
        const backendMessage = res?.data?.message || 'Registration failed.';
        enqueueSnackbar(backendMessage, { variant: 'error' });
      }
      
    } catch (error) {
      console.error('Register error:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Unexpected error while registering.';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack sx={{ mb: 2, alignItems: 'center' }}>
        <Typography variant="subtitle1">Sign up with Email address </Typography>
      </Stack>

      <Grid container spacing={{ xs: 0, sm: 2 }}>
        <Grid item xs={12} sm={6}>
          <CustomFormControl fullWidth>
            <InputLabel htmlFor="outlined-adornment-first-register">First Name</InputLabel>
            <OutlinedInput
              id="outlined-adornment-first-register"
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              label="First Name"
            />
          </CustomFormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomFormControl fullWidth>
            <InputLabel htmlFor="outlined-adornment-last-register">Last Name</InputLabel>
            <OutlinedInput
              id="outlined-adornment-last-register"
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              label="Last Name"
            />
          </CustomFormControl>
        </Grid>
      </Grid>

      <CustomFormControl fullWidth>
        <InputLabel htmlFor="outlined-adornment-email-register">Email Address / Username</InputLabel>
        <OutlinedInput
          id="outlined-adornment-email-register"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          label="Email Address / Username"
        />
      </CustomFormControl>

      <CustomFormControl fullWidth>
        <InputLabel htmlFor="outlined-adornment-serial-register">Serial Code</InputLabel>
        <OutlinedInput
          id="outlined-adornment-serial-register"
          type="text"
          name="serialCode"
          value={form.serialCode}
          onChange={handleChange}
          label="Serial Code"
        />
      </CustomFormControl>

      <CustomFormControl fullWidth>
        <InputLabel htmlFor="outlined-adornment-password-register">Password</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password-register"
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={form.password}
          onChange={handleChange}
          label="Password"
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
        />
      </CustomFormControl>

      {strength !== 0 && (
        <FormControl fullWidth>
          <Box sx={{ mb: 2 }}>
            <Stack direction="row" sx={{ gap: 2, alignItems: 'center' }}>
              <Box sx={{ width: 85, height: 8, borderRadius: '7px', bgcolor: level?.color }} />
              <Typography variant="subtitle1" sx={{ fontSize: '0.75rem' }}>
                {level?.label}
              </Typography>
            </Stack>
          </Box>
        </FormControl>
      )}

      <Box sx={{ mt: 2 }}>
        <AnimateButton>
          <Button disableElevation fullWidth size="large" type="submit" variant="contained" color="secondary">
            Sign up
          </Button>
        </AnimateButton>
      </Box>
    </form>
  );
}
