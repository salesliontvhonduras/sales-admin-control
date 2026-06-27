import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import PremiumDialog from '../components/PremiumDialog';
import { accountName, copyText } from '../constants';
import { colors, inputSx, mobileActionsSx } from '../styles';

function randomPassword() {
  return `YT${Math.random().toString(36).slice(2, 8).toUpperCase()}${Math.floor(100 + Math.random() * 900)}`;
}

export default function PasswordDialog({ account, open, onClose, onCopied, onSubmit, saving }) {
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (open) {
      setPassword(randomPassword());
      setShow(false);
    }
  }, [open]);

  const copyPassword = async () => {
    const copied = await copyText(password);
    if (copied) onCopied?.();
  };

  return (
    <PremiumDialog
      open={open}
      onClose={onClose}
      title="Reset password"
      subtitle={account ? accountName(account) : ''}
      actions={
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ ...mobileActionsSx, justifyContent: 'space-between' }}>
          <Button onClick={copyPassword} startIcon={<ContentCopyRoundedIcon />} disabled={!password} fullWidth>
            Copiar
          </Button>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ width: { xs: '100%', sm: 'auto' } }}>
            <Button onClick={onClose} disabled={saving} fullWidth>Cancelar</Button>
            <Button variant="contained" disabled={saving || password.length < 8} startIcon={saving ? <CircularProgress size={16} /> : null} onClick={() => onSubmit(password)} fullWidth>
              Actualizar
            </Button>
          </Stack>
        </Stack>
      }
    >
      <Stack spacing={2}>
        <Box sx={{ p: 1.5, bgcolor: colors.surface2, borderRadius: '8px', border: `1px solid ${colors.border}` }}>
          <Typography sx={{ color: colors.text, fontWeight: 900 }}>Contraseña temporal segura</Typography>
          <Typography sx={{ color: colors.muted, fontSize: 13, mt: 0.5 }}>
            El reseller puede copiarla y entregarla al cliente sin salir del flujo.
          </Typography>
        </Box>
        <TextField
          label="Nueva contraseña temporal"
          value={password}
          type={show ? 'text' : 'password'}
          onChange={(event) => setPassword(event.target.value)}
          fullWidth
          sx={inputSx}
          helperText="Mínimo 8 caracteres. Recomienda cambiarla cuando el flujo lo permita."
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShow((prev) => !prev)} edge="end">
                  {show ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Stack>
    </PremiumDialog>
  );
}
