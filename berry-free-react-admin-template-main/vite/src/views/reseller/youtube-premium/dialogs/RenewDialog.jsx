import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect, useMemo, useState } from 'react';
import PremiumDialog from '../components/PremiumDialog';
import {
  EMPTY_RENEW_FORM,
  PACKAGE_OPTIONS,
  PLAN_OPTIONS,
  accountName,
  formatCreditsFromUnits,
  packageLabel,
  planLabel,
  quoteCostUnits,
  shortDate
} from '../constants';
import { colors, inputSx, selectMenuProps } from '../styles';

export default function RenewDialog({ account, open, onClose, onSubmit, saving }) {
  const [form, setForm] = useState(EMPTY_RENEW_FORM);
  const costUnits = useMemo(() => quoteCostUnits(form), [form]);

  useEffect(() => {
    if (open) {
      setForm({
        planCode: account?.planCode || 'INDIVIDUAL',
        packageCode: 'MONTHLY',
        deviceLimit: account?.deviceLimit || 1
      });
    }
  }, [account, open]);

  const update = (patch) => setForm((prev) => ({ ...prev, ...patch }));

  return (
    <PremiumDialog
      open={open}
      onClose={onClose}
      title="Renovar cuenta"
      subtitle={account ? accountName(account) : ''}
      actions={
        <Stack direction="row" spacing={1} sx={{ width: '100%', justifyContent: 'flex-end' }}>
          <Button onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            disabled={saving || Number(form.deviceLimit || 0) < 1}
            startIcon={saving ? <CircularProgress size={16} /> : <CheckCircleRoundedIcon />}
            onClick={() => onSubmit(form)}
          >
            Confirmar renovación
          </Button>
        </Stack>
      }
    >
      <Stack spacing={2}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <Info label="Vence actualmente" value={shortDate(account?.expiresAt)} />
          <Info label="Plan actual" value={planLabel(account?.planCode)} />
          <Info label="Dispositivos" value={account?.deviceLimit || 1} />
        </Stack>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField select label="Plan" value={form.planCode} onChange={(event) => update({ planCode: event.target.value })} fullWidth sx={inputSx} SelectProps={{ MenuProps: selectMenuProps }}>
              {PLAN_OPTIONS.map((item) => (
                <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField select label="Paquete" value={form.packageCode} onChange={(event) => update({ packageCode: event.target.value })} fullWidth sx={inputSx} SelectProps={{ MenuProps: selectMenuProps }}>
              {PACKAGE_OPTIONS.map((item) => (
                <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
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
        </Grid>
        <Info label="Costo de renovación" value={`${formatCreditsFromUnits(costUnits)} créditos · ${packageLabel(form.packageCode)}`} large />
      </Stack>
    </PremiumDialog>
  );
}

function Info({ label, value, large = false }) {
  return (
    <Stack sx={{ flex: 1, p: 1.5, bgcolor: colors.surface2, borderRadius: '8px', border: `1px solid ${colors.border}` }}>
      <Typography sx={{ color: colors.dim, fontSize: 12, fontWeight: 900, textTransform: 'uppercase' }}>{label}</Typography>
      <Typography sx={{ color: colors.text, fontWeight: 900, fontSize: large ? 22 : 15 }}>{value || '-'}</Typography>
    </Stack>
  );
}
