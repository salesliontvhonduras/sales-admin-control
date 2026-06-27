import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect, useMemo, useState } from 'react';
import PremiumDialog from '../components/PremiumDialog';
import { DEMO_OPTIONS } from '../constants';
import { colors, inputSx, mobileActionsSx, selectMenuProps } from '../styles';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const emptyForm = {
  name: '',
  email: '',
  password: '',
  demoHours: 1,
  deviceLimit: 1
};

export default function DemoAccountDialog({ open, onClose, onSubmit, saving }) {
  const [form, setForm] = useState(emptyForm);
  const [showPassword, setShowPassword] = useState(false);
  const selectedDemo = useMemo(
    () => DEMO_OPTIONS.find((item) => Number(item.value) === Number(form.demoHours)) || DEMO_OPTIONS[0],
    [form.demoHours]
  );

  useEffect(() => {
    if (open) {
      setForm(emptyForm);
      setShowPassword(false);
    }
  }, [open]);

  const valid = form.name.trim() && emailRegex.test(form.email.trim()) && form.password.trim().length >= 8 && [1, 3, 6].includes(Number(form.demoHours));
  const update = (patch) => setForm((prev) => ({ ...prev, ...patch }));

  const actions = (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ ...mobileActionsSx, justifyContent: 'space-between' }}>
      <Button onClick={onClose} disabled={saving} fullWidth>
        Cancelar
      </Button>
      <Button
        variant="contained"
        disabled={!valid || saving}
        onClick={() => onSubmit({ ...form, demoHours: Number(form.demoHours), deviceLimit: 1 })}
        startIcon={saving ? <CircularProgress size={16} /> : <CheckCircleRoundedIcon />}
      >
        Crear demo
      </Button>
    </Stack>
  );

  return (
    <PremiumDialog
      open={open}
      onClose={onClose}
      title="Crear demo del app"
      subtitle="Acceso temporal YouTube Premium para probar la APK"
      maxWidth="md"
      actions={actions}
    >
      <Stack spacing={2.5}>
        <Box sx={{ p: 2, borderRadius: '8px', bgcolor: 'rgba(246,199,107,0.1)', border: '1px solid rgba(246,199,107,0.26)' }}>
          <Stack direction="row" spacing={1.5}>
            <AccessTimeRoundedIcon sx={{ color: colors.warning }} />
            <Box>
              <Typography sx={{ color: colors.text, fontWeight: 900 }}>Demo sin débito de créditos</Typography>
              <Typography sx={{ color: colors.muted, fontSize: 13 }}>
                El cliente podrá iniciar sesión durante {selectedDemo.label}. Al vencer, la cuenta quedará expirada automáticamente.
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField label="Nombre del cliente" value={form.name} onChange={(event) => update({ name: event.target.value })} fullWidth sx={inputSx} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Correo de acceso"
              value={form.email}
              onChange={(event) => update({ email: event.target.value })}
              fullWidth
              sx={inputSx}
              error={Boolean(form.email) && !emailRegex.test(form.email)}
              helperText={form.email && !emailRegex.test(form.email) ? 'Ingresa un correo válido.' : ' '}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Contraseña temporal"
              value={form.password}
              type={showPassword ? 'text' : 'password'}
              onChange={(event) => update({ password: event.target.value })}
              fullWidth
              sx={inputSx}
              helperText="Mínimo 8 caracteres."
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
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              label="Duración demo"
              value={form.demoHours}
              onChange={(event) => update({ demoHours: Number(event.target.value) })}
              fullWidth
              sx={inputSx}
              SelectProps={{ MenuProps: selectMenuProps }}
            >
              {DEMO_OPTIONS.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        <Box sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: '8px', bgcolor: colors.surface2, border: `1px solid ${colors.border}` }}>
          <Typography sx={{ color: colors.dim, fontSize: 12, fontWeight: 900, textTransform: 'uppercase' }}>Resumen</Typography>
          <Typography sx={{ color: colors.text, fontWeight: 900, mt: 0.75 }}>
            Demo {selectedDemo.label} · 1 dispositivo · 0.00 créditos
          </Typography>
          <Typography sx={{ color: colors.muted, mt: 0.75, fontSize: 13 }}>
            Este botón es solo para demos temporales. Para vender una cuenta real usa “Nueva cuenta”.
          </Typography>
        </Box>
      </Stack>
    </PremiumDialog>
  );
}
