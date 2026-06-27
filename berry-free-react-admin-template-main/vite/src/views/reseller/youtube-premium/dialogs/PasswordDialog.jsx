import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import PremiumDialog from '../components/PremiumDialog';
import { accountName, copyText } from '../constants';
import { inputSx } from '../styles';

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
        <Stack direction="row" spacing={1} sx={{ width: '100%', justifyContent: 'space-between' }}>
          <Button onClick={copyPassword} startIcon={<ContentCopyRoundedIcon />} disabled={!password}>
            Copiar
          </Button>
          <Stack direction="row" spacing={1}>
            <Button onClick={onClose} disabled={saving}>Cancelar</Button>
            <Button variant="contained" disabled={saving || password.length < 6} startIcon={saving ? <CircularProgress size={16} /> : null} onClick={() => onSubmit(password)}>
              Actualizar
            </Button>
          </Stack>
        </Stack>
      }
    >
      <TextField
        label="Nueva contraseña temporal"
        value={password}
        type={show ? 'text' : 'password'}
        onChange={(event) => setPassword(event.target.value)}
        fullWidth
        sx={inputSx}
        helperText="Entrega esta contraseña al cliente y recomiéndale cambiarla si el flujo lo permite."
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
    </PremiumDialog>
  );
}
