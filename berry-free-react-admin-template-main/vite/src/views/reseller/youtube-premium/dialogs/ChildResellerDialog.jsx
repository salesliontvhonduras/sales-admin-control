import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import PremiumDialog from '../components/PremiumDialog';
import { colors, inputSx, mobileActionsSx, selectMenuProps } from '../styles';

const emptyForm = { username: '', displayName: '', active: true };

export default function ChildResellerDialog({ open, onClose, onSubmit, saving }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (open) setForm(emptyForm);
  }, [open]);

  const update = (patch) => setForm((prev) => ({ ...prev, ...patch }));
  const valid = form.username.trim() && form.displayName.trim();

  return (
    <PremiumDialog
      open={open}
      onClose={onClose}
      title="Nuevo reseller hijo"
      subtitle="El reseller quedará aislado bajo tu red de superreseller."
      actions={
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={mobileActionsSx}>
          <Button onClick={onClose} disabled={saving} fullWidth>Cancelar</Button>
          <Button variant="contained" disabled={saving || !valid} startIcon={saving ? <CircularProgress size={16} /> : null} onClick={() => onSubmit(form)} fullWidth>
            Crear reseller
          </Button>
        </Stack>
      }
    >
      <Stack spacing={2}>
        <Box sx={{ p: 1.5, bgcolor: colors.surface2, borderRadius: '8px', border: `1px solid ${colors.border}` }}>
          <Typography sx={{ color: colors.text, fontWeight: 900 }}>Acceso aislado al portal reseller</Typography>
          <Typography sx={{ color: colors.muted, fontSize: 13, mt: 0.5 }}>
            Este usuario solo operará cuentas YouTube Premium dentro de tu red.
          </Typography>
        </Box>
        <TextField label="Usuario o email" value={form.username} onChange={(event) => update({ username: event.target.value })} fullWidth sx={inputSx} />
        <TextField label="Nombre comercial" value={form.displayName} onChange={(event) => update({ displayName: event.target.value })} fullWidth sx={inputSx} />
        <TextField
          select
          label="Estado"
          value={form.active ? 'true' : 'false'}
          onChange={(event) => update({ active: event.target.value === 'true' })}
          fullWidth
          sx={inputSx}
          SelectProps={{ MenuProps: selectMenuProps }}
        >
          <MenuItem value="true">Activo</MenuItem>
          <MenuItem value="false">Deshabilitado</MenuItem>
        </TextField>
      </Stack>
    </PremiumDialog>
  );
}
