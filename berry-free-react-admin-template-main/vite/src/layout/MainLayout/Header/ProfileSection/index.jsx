import { useEffect, useRef, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import OutlinedInput from '@mui/material/OutlinedInput';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { useNavigate } from 'react-router-dom';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import useConfig from 'hooks/useConfig';
import useAuth from 'hooks/useAuth';
import { useSnackbar } from 'notistack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { authApi } from 'utils/api';
import IconButton from '@mui/material/IconButton';
import LanguageIcon from '@mui/icons-material/Language';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LanguageSwitcher from 'ui-component/LanguageSwitcher';
import ThemeModeSwitcher from 'ui-component/ThemeModeSwitcher';

// assets
import User1 from 'assets/images/users/user-round.svg';
import { IconLogout, IconSearch, IconSettings, IconUser, IconLock, IconKey, IconEye, IconEyeOff } from '@tabler/icons-react';

// ==============================|| PROFILE MENU ||============================== //

const BASE_URL = import.meta.env.VITE_APP_BASE_NAME;

export default function ProfileSection() {
  const theme = useTheme();
  const {
    state: { borderRadius }
  } = useConfig();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);
  const [openPwd, setOpenPwd] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdForm, setPwdForm] = useState({ current: '', next: '', confirm: '' });
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  /**
   * anchorRef is used on different components and specifying one type leads to other components throwing an error
   * */
  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const handleLogout = () => {
    logout();
    enqueueSnackbar('Sesión cerrada.', { variant: 'success' });
    setOpen(false);
    navigate(BASE_URL + '/pages/login');
  };

  const handleChangePwd = async () => {
    if (!pwdForm.current || !pwdForm.next || !pwdForm.confirm) {
      enqueueSnackbar('Completa todos los campos.', { variant: 'warning' });
      return;
    }
    if (pwdForm.next !== pwdForm.confirm) {
      enqueueSnackbar('Las contraseñas no coinciden.', { variant: 'warning' });
      return;
    }
    setPwdLoading(true);
    try {
      await authApi.post('/auth/v1/password/change', {
        currentPassword: pwdForm.current,
        newPassword: pwdForm.next
      });
      enqueueSnackbar('Contraseña actualizada.', { variant: 'success' });
      setOpenPwd(false);
      setPwdForm({ current: '', next: '', confirm: '' });
    } catch (err) {
      const msg = err?.response?.data?.message || 'No se pudo actualizar la contraseña.';
      enqueueSnackbar(msg, { variant: 'error' });
    } finally {
      setPwdLoading(false);
    }
  };

  return (
    <>
      <Avatar
        src={User1}
        alt="user-images"
        sx={{ typography: 'mediumAvatar', marginLeft: 2, cursor: 'pointer', boxShadow: theme.shadows[3] }}
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        color="inherit"
        onClick={handleToggle}
      />
      <Popper
        placement="bottom"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        modifiers={[
          {
            name: 'offset',
            options: {
              offset: [0, 14]
            }
          }
        ]}
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={handleClose}>
            <Transitions in={open} {...TransitionProps}>
              <Paper>
                {open && (
                  <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                    <Box sx={{ p: 2, pb: 0 }}>
                      <Stack>
                        <Stack direction="row" sx={{ alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                          <Box>
                            <Typography variant="h4">Good Morning,</Typography>
                            <Typography component="span" variant="h4" sx={{ fontWeight: 400 }}>
                              {user?.name || 'User'}
                            </Typography>
                            <Typography variant="subtitle2" color="text.secondary">
                              {user?.role || 'Project Admin'}
                            </Typography>
                          </Box>
                          <Box sx={{ flexGrow: 1 }} />
                        </Stack>
                      </Stack>
                      <OutlinedInput
                        sx={{ width: '100%', pr: 1, pl: 2, my: 2 }}
                        id="input-search-profile"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="Search profile options"
                        startAdornment={
                          <InputAdornment position="start">
                            <IconSearch stroke={1.5} size="16px" />
                          </InputAdornment>
                        }
                        aria-describedby="search-helper-text"
                        slotProps={{ input: { 'aria-label': 'weight' } }}
                      />
                      <Divider />
                    </Box>
                    <Box
                      sx={{
                        p: 2,
                        py: 0,
                        height: '100%',
                        maxHeight: 'calc(100vh - 250px)',
                        overflowX: 'hidden',
                        '&::-webkit-scrollbar': { width: 5 }
                      }}
                    >
                      <List
                        component="nav"
                        sx={{
                          width: '100%',
                          maxWidth: 350,
                          minWidth: 300,
                          borderRadius: `${borderRadius}px`,
                          '& .MuiListItemButton-root': { mt: 0.5 }
                        }}
                      >
                        <ListItemButton
                          sx={{
                            borderRadius: `${borderRadius}px`,
                            px: 1.5,
                            py: 1
                          }}
                        >
                          <ListItemIcon>
                            <LanguageIcon fontSize="small" color="primary" />
                          </ListItemIcon>
                          <Stack spacing={0.5} sx={{ width: '100%' }}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              Change language
                            </Typography>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                p: 0.75,
                                borderRadius: 1.5,
                                border: '1px solid',
                                borderColor: 'divider',
                                bgcolor: 'background.default',
                                boxShadow: theme.shadows[1]
                              }}
                            >
                              <Typography variant="caption" color="text.secondary">
                                Current
                              </Typography>
                              <LanguageSwitcher overlay />
                            </Box>
                          </Stack>
                        </ListItemButton>
                        <ListItemButton
                          sx={{
                            borderRadius: `${borderRadius}px`,
                            px: 1.5,
                            py: 1
                          }}
                        >
                          <ListItemIcon>
                            <DarkModeRoundedIcon fontSize="small" color="primary" />
                          </ListItemIcon>
                          <Stack spacing={0.5} sx={{ width: '100%' }}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              Color theme
                            </Typography>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                p: 0.75,
                                borderRadius: 1.5,
                                border: '1px solid',
                                borderColor: 'divider',
                                bgcolor: 'background.default',
                                boxShadow: theme.shadows[1]
                              }}
                            >
                              <Typography variant="caption" color="text.secondary">
                                Current
                              </Typography>
                              <ThemeModeSwitcher compact />
                            </Box>
                          </Stack>
                        </ListItemButton>
                        <ListItemButton sx={{ borderRadius: `${borderRadius}px` }}>
                          <ListItemIcon>
                            <IconSettings stroke={1.5} size="20px" />
                          </ListItemIcon>
                          <ListItemText primary={<Typography variant="body2">Account Settings</Typography>} />
                        </ListItemButton>
                        <ListItemButton sx={{ borderRadius: `${borderRadius}px` }} onClick={() => setOpenPwd(true)}>
                          <ListItemIcon>
                            <IconUser stroke={1.5} size="20px" />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="body2">Change Password</Typography>
                              </Stack>
                            }
                          />
                        </ListItemButton>
                        <ListItemButton sx={{ borderRadius: `${borderRadius}px` }} onClick={handleLogout}>
                          <ListItemIcon>
                            <IconLogout stroke={1.5} size="20px" />
                          </ListItemIcon>
                          <ListItemText primary={<Typography variant="body2">Logout</Typography>} />
                        </ListItemButton>
                      </List>
                    </Box>
                  </MainCard>
                )}
              </Paper>
            </Transitions>
          </ClickAwayListener>
        )}
      </Popper>

      <Dialog open={openPwd} onClose={() => setOpenPwd(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle
          sx={{
            pb: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.light}30 0%, ${theme.palette.background.paper} 100%)`
          }}
        >
          <Avatar sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', width: 40, height: 40, boxShadow: 2 }}>
            <IconLock size={20} />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ lineHeight: 1 }}>
              Cambiar contraseña
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Mantén tu cuenta segura con una contraseña fuerte.
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
            pt: 2,
            background: (theme) =>
              theme.palette.mode === 'light'
                ? `linear-gradient(180deg, ${theme.palette.primary.light}12 0%, ${theme.palette.background.paper} 60%)`
                : theme.palette.background.default
          }}
        >
          <TextField
            label="Contraseña actual"
            type="password"
            value={pwdForm.current}
            onChange={(e) => setPwdForm((p) => ({ ...p, current: e.target.value }))}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconKey size={18} />
                </InputAdornment>
              )
            }}
          />
          <TextField
            label="Nueva contraseña"
            type={showNew ? 'text' : 'password'}
            value={pwdForm.next}
            onChange={(e) => setPwdForm((p) => ({ ...p, next: e.target.value }))}
            fullWidth
            helperText="Usa al menos 8 caracteres, mezcla letras, números y símbolos."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconLock size={18} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={() => setShowNew((v) => !v)} size="small">
                    {showNew ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <TextField
            label="Confirmar nueva contraseña"
            type={showConfirm ? 'text' : 'password'}
            value={pwdForm.confirm}
            onChange={(e) => setPwdForm((p) => ({ ...p, confirm: e.target.value }))}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconLock size={18} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={() => setShowConfirm((v) => !v)} size="small">
                    {showConfirm ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <Box
            sx={{
              mt: 0.5,
              p: 1.25,
              borderRadius: 2,
              bgcolor: 'primary.lighter',
              color: 'primary.dark',
              border: '1px dashed',
              borderColor: 'primary.main',
              fontSize: 13
            }}
          >
            Consejo: evita reutilizar contraseñas y no compartas este cambio.
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setOpenPwd(false)} disabled={pwdLoading}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleChangePwd} disabled={pwdLoading}>
            {pwdLoading ? <CircularProgress size={18} color="inherit" /> : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
