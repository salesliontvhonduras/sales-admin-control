import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import useAuth from 'hooks/useAuth';
import { hasResellerPortalAccess } from 'utils/rbac';
import { useSnackbar } from 'notistack';

export default function ResellerLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [values, setValues] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const res = await login(values.email, values.password, true);
      const user = res?.data?.data?.user;
      if (!hasResellerPortalAccess(user)) {
        enqueueSnackbar('Esta cuenta no tiene acceso reseller.', { variant: 'error' });
        return;
      }
      navigate('/reseller/youtube-premium', { replace: true });
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || 'Credenciales inválidas.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        bgcolor: '#050505',
        color: '#fff',
        display: 'grid',
        placeItems: 'center',
        px: 2
      }}
    >
      <Box
        component="form"
        onSubmit={onSubmit}
        sx={{
          width: '100%',
          maxWidth: 430,
          bgcolor: '#101010',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 3,
          p: { xs: 2.5, sm: 4 },
          boxShadow: '0 24px 80px rgba(0,0,0,0.45)'
        }}
      >
        <Stack spacing={2.25}>
          <Stack spacing={0.75}>
            <Typography variant="h2" sx={{ color: '#fff' }}>
              Reseller Portal
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.64)' }}>
              Gestiona cuentas premium, créditos, sesiones y renovaciones de YouTube/SmartTube.
            </Typography>
          </Stack>

          <TextField
            label="Correo"
            type="email"
            value={values.email}
            onChange={(event) => setValues((prev) => ({ ...prev, email: event.target.value }))}
            fullWidth
            required
          />
          <TextField
            label="Contraseña"
            type={showPassword ? 'text' : 'password'}
            value={values.password}
            onChange={(event) => setValues((prev) => ({ ...prev, password: event.target.value }))}
            fullWidth
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <Button type="submit" variant="contained" size="large" disabled={loading} startIcon={loading ? <CircularProgress size={18} /> : null}>
            Entrar
          </Button>
          <Button component={Link} to="/pages/login" color="inherit">
            Acceso administrativo
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
