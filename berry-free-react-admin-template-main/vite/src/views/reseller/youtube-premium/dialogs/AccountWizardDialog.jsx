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
import {
  EMPTY_ACCOUNT_FORM,
  PACKAGE_OPTIONS,
  PLAN_OPTIONS,
  formatCreditsFromUnits,
  packageLabel,
  planLabel,
  quoteCostUnits
} from '../constants';
import { colors, inputSx, mobileActionsSx, selectMenuProps } from '../styles';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AccountWizardDialog({ open, onClose, onSubmit, saving }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(EMPTY_ACCOUNT_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const costUnits = useMemo(() => quoteCostUnits(form), [form]);

  useEffect(() => {
    if (open) {
      setStep(0);
      setForm(EMPTY_ACCOUNT_FORM);
      setShowPassword(false);
    }
  }, [open]);

  const accountValid = form.name.trim() && emailRegex.test(form.email.trim()) && form.password.trim().length >= 8;
  const planValid = Number(form.deviceLimit || 0) >= 1;
  const canContinue = step === 0 ? accountValid : planValid;

  const update = (patch) => setForm((prev) => ({ ...prev, ...patch }));

  const actions = (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ ...mobileActionsSx, justifyContent: 'space-between' }}>
      <Button onClick={onClose} disabled={saving} fullWidth>
        Cancelar
      </Button>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ width: { xs: '100%', sm: 'auto' }, '& .MuiButton-root': { width: { xs: '100%', sm: 'auto' } } }}>
        {step > 0 ? (
          <Button onClick={() => setStep((prev) => prev - 1)} disabled={saving}>
            Atrás
          </Button>
        ) : null}
        {step < 2 ? (
          <Button variant="contained" disabled={!canContinue || saving} onClick={() => setStep((prev) => prev + 1)}>
            Continuar
          </Button>
        ) : (
          <Button
            variant="contained"
            disabled={!accountValid || !planValid || saving}
            onClick={() => onSubmit(form)}
            startIcon={saving ? <CircularProgress size={16} /> : <CheckCircleRoundedIcon />}
          >
            Crear cuenta
          </Button>
        )}
      </Stack>
    </Stack>
  );

  return (
    <PremiumDialog
      open={open}
      onClose={onClose}
      title="Nueva cuenta Premium"
      subtitle={step === 0 ? 'Datos de acceso del cliente' : step === 1 ? 'Plan, paquete y dispositivos' : 'Revisa el costo antes de crear'}
      maxWidth="md"
      actions={actions}
    >
      <Stack spacing={2.5}>
        <Stepper step={step} />
        {step === 0 ? (
          <Stack spacing={2}>
            <TextField label="Nombre del cliente" value={form.name} onChange={(event) => update({ name: event.target.value })} fullWidth sx={inputSx} />
            <TextField
              label="Correo de acceso"
              value={form.email}
              onChange={(event) => update({ email: event.target.value })}
              fullWidth
              sx={inputSx}
              error={Boolean(form.email) && !emailRegex.test(form.email)}
              helperText={form.email && !emailRegex.test(form.email) ? 'Ingresa un correo válido.' : ' '}
            />
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
          </Stack>
        ) : null}

        {step === 1 ? (
          <PlanFields form={form} update={update} />
        ) : null}

        {step === 2 ? (
          <Stack spacing={2}>
            <Box sx={{ p: 2, borderRadius: '8px', bgcolor: colors.surface2, border: `1px solid ${colors.border}` }}>
              <SummaryRow label="Cliente" value={`${form.name} · ${form.email}`} />
              <SummaryRow label="Plan" value={`${planLabel(form.planCode)} · ${packageLabel(form.packageCode)}`} />
              <SummaryRow label="Dispositivos" value={`${form.deviceLimit} permitido${Number(form.deviceLimit) === 1 ? '' : 's'}`} last />
            </Box>
            <Box sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: '8px', bgcolor: 'rgba(255,45,45,0.12)', border: '1px solid rgba(255,45,45,0.34)' }}>
              <Typography sx={{ color: colors.dim, fontSize: 12, fontWeight: 900, textTransform: 'uppercase' }}>Costo total</Typography>
              <Typography variant="h2" sx={{ color: colors.text, mt: 0.5, fontSize: { xs: 32, sm: 38 }, lineHeight: 1 }}>
                {formatCreditsFromUnits(costUnits)} créditos
              </Typography>
              <Typography sx={{ color: colors.muted, mt: 1, fontSize: 13 }}>
                Se debitará del saldo disponible cuando confirmes la creación.
              </Typography>
            </Box>
          </Stack>
        ) : null}
      </Stack>
    </PremiumDialog>
  );
}

function Stepper({ step }) {
  const labels = ['Cuenta', 'Plan', 'Confirmación'];
  return (
    <Grid container spacing={1}>
      {labels.map((label, index) => (
        <Grid item xs={4} key={label}>
          <Box
            sx={{
              p: { xs: 1, sm: 1.25 },
              borderRadius: '8px',
              bgcolor: index <= step ? 'rgba(255,45,45,0.13)' : colors.surface2,
              border: `1px solid ${index <= step ? 'rgba(255,45,45,0.34)' : colors.border}`,
              minHeight: { xs: 56, sm: 62 }
            }}
          >
            <Typography sx={{ color: index <= step ? colors.text : colors.muted, fontWeight: 900, fontSize: 11 }}>
              {String(index + 1).padStart(2, '0')}
            </Typography>
            <Typography sx={{ color: index <= step ? colors.text : colors.muted, fontWeight: 900, fontSize: { xs: 12, sm: 13 }, lineHeight: 1.15 }}>
              {label}
            </Typography>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
}

function PlanFields({ form, update }) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <TextField
          select
          label="Plan"
          value={form.planCode}
          onChange={(event) => update({ planCode: event.target.value })}
          fullWidth
          sx={inputSx}
          SelectProps={{ MenuProps: selectMenuProps }}
        >
          {PLAN_OPTIONS.map((item) => (
            <MenuItem key={item.value} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          select
          label="Paquete"
          value={form.packageCode}
          onChange={(event) => update({ packageCode: event.target.value })}
          fullWidth
          sx={inputSx}
          SelectProps={{ MenuProps: selectMenuProps }}
        >
          {PACKAGE_OPTIONS.map((item) => (
            <MenuItem key={item.value} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          label="Dispositivos"
          type="number"
          value={form.deviceLimit}
          onChange={(event) => update({ deviceLimit: Math.max(Number(event.target.value || 1), 1) })}
          fullWidth
          sx={inputSx}
          inputProps={{ min: 1 }}
        />
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ p: 1.5, borderRadius: '8px', bgcolor: 'rgba(255,255,255,0.06)', border: `1px solid ${colors.border}` }}>
          <Typography sx={{ color: colors.muted, fontSize: 13 }}>
            Individual cuesta 1.00 crédito por mes. Family cuesta 1.25 créditos por mes. Cada dispositivo adicional cuesta 0.50 crédito por mes.
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
}

function SummaryRow({ label, value, last = false }) {
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={0.5} sx={{ justifyContent: 'space-between', py: 1.25, borderBottom: last ? 'none' : `1px solid ${colors.border}` }}>
      <Typography sx={{ color: colors.dim }}>{label}</Typography>
      <Typography sx={{ color: colors.text, fontWeight: 900, overflowWrap: 'anywhere' }}>{value}</Typography>
    </Stack>
  );
}
