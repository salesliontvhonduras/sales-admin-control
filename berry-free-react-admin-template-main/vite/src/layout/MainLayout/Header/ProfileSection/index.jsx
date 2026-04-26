import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Avatar from '@mui/material/Avatar';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
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
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { useNavigate } from 'react-router-dom';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import DialogTitleWithClose from 'ui-component/dialogs/DialogTitleWithClose';
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
import { canSwitchLionTvViewMode, isResellerConsoleUser, LIONTV_VIEW_MODE } from 'utils/rbac';

// ==============================|| PROFILE MENU ||============================== //

const BASE_URL = import.meta.env.VITE_APP_BASE_NAME;

export default function ProfileSection() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const {
    state: { borderRadius }
  } = useConfig();
  const navigate = useNavigate();
  const { logout, user, lionTvViewMode, setLionTvViewMode } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const canToggleLionTvViewMode = canSwitchLionTvViewMode(user);
  const activeLionTvViewMode = isResellerConsoleUser(user, lionTvViewMode) ? LIONTV_VIEW_MODE.RESELLER : LIONTV_VIEW_MODE.ADMIN;

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
    enqueueSnackbar(t('profileMenu.messages.logoutSuccess'), { variant: 'success' });
    setOpen(false);
    navigate(BASE_URL + '/pages/login');
  };

  const handleLionTvViewModeChange = (_event, nextMode) => {
    if (!nextMode) return;

    const resolvedMode = setLionTvViewMode(nextMode);
    enqueueSnackbar(
      t('profileMenu.messages.viewModeUpdated', {
        mode: resolvedMode === LIONTV_VIEW_MODE.RESELLER ? t('profileMenu.viewMode.reseller') : t('profileMenu.viewMode.admin')
      }),
      { variant: 'info' }
    );
    setOpen(false);
    navigate('/liontv/dashboard');
  };

  const handleChangePwd = async () => {
    if (!pwdForm.current || !pwdForm.next || !pwdForm.confirm) {
      enqueueSnackbar(t('profileMenu.messages.fillAllFields'), { variant: 'warning' });
      return;
    }
    if (pwdForm.next !== pwdForm.confirm) {
      enqueueSnackbar(t('profileMenu.messages.passwordMismatch'), { variant: 'warning' });
      return;
    }
    setPwdLoading(true);
    try {
      await authApi.post('/auth/v1/password/change', {
        currentPassword: pwdForm.current,
        newPassword: pwdForm.next
      });
      enqueueSnackbar(t('profileMenu.messages.passwordUpdated'), { variant: 'success' });
      setOpenPwd(false);
      setPwdForm({ current: '', next: '', confirm: '' });
    } catch (err) {
      const msg = err?.response?.data?.message || t('profileMenu.messages.passwordUpdateError');
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
        sx={{
          typography: 'mediumAvatar',
          marginLeft: 2,
          cursor: 'pointer',
          boxShadow: theme.shadows[3],
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper'
        }}
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
                            <Typography variant="h4">{t('profileMenu.greeting')}</Typography>
                            <Typography component="span" variant="h4" sx={{ fontWeight: 400 }}>
                              {user?.name || t('profileMenu.userFallback')}
                            </Typography>
                            <Typography variant="subtitle2" color="text.secondary">
                              {user?.role || t('profileMenu.roleFallback')}
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
                        placeholder={t('profileMenu.searchPlaceholder')}
                        startAdornment={
                          <InputAdornment position="start">
                            <IconSearch stroke={1.5} size="16px" />
                          </InputAdornment>
                        }
                        aria-describedby="search-helper-text"
                        slotProps={{ input: { 'aria-label': t('common.search') } }}
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
                              {t('profileMenu.changeLanguage')}
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
                                {t('profileMenu.current')}
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
                              {t('profileMenu.colorTheme')}
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
                                {t('profileMenu.current')}
                              </Typography>
                              <ThemeModeSwitcher compact />
                            </Box>
                          </Stack>
                        </ListItemButton>
                        {canToggleLionTvViewMode ? (
                          <Box
                            sx={{
                              mt: 0.5,
                              px: 1.5,
                              py: 1.25,
                              borderRadius: `${borderRadius}px`,
                              border: '1px solid',
                              borderColor: 'divider',
                              bgcolor: 'background.default',
                              boxShadow: theme.shadows[1]
                            }}
                          >
                            <Stack spacing={1}>
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {t('profileMenu.viewMode.title')}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {t('profileMenu.viewMode.subtitle')}
                                </Typography>
                              </Box>
                              <ToggleButtonGroup
                                exclusive
                                fullWidth
                                size="small"
                                color="primary"
                                value={activeLionTvViewMode}
                                onChange={handleLionTvViewModeChange}
                                sx={{
                                  '& .MuiToggleButton-root': {
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    py: 0.75
                                  }
                                }}
                              >
                                <ToggleButton value={LIONTV_VIEW_MODE.ADMIN}>{t('profileMenu.viewMode.admin')}</ToggleButton>
                                <ToggleButton value={LIONTV_VIEW_MODE.RESELLER}>{t('profileMenu.viewMode.reseller')}</ToggleButton>
                              </ToggleButtonGroup>
                            </Stack>
                          </Box>
                        ) : null}
                        <ListItemButton sx={{ borderRadius: `${borderRadius}px` }}>
                          <ListItemIcon>
                            <IconSettings stroke={1.5} size="20px" />
                          </ListItemIcon>
                          <ListItemText primary={<Typography variant="body2">{t('profileMenu.accountSettings')}</Typography>} />
                        </ListItemButton>
                        <ListItemButton sx={{ borderRadius: `${borderRadius}px` }} onClick={() => setOpenPwd(true)}>
                          <ListItemIcon>
                            <IconUser stroke={1.5} size="20px" />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="body2">{t('profileMenu.changePassword')}</Typography>
                              </Stack>
                            }
                          />
                        </ListItemButton>
                        <ListItemButton sx={{ borderRadius: `${borderRadius}px` }} onClick={handleLogout}>
                          <ListItemIcon>
                            <IconLogout stroke={1.5} size="20px" />
                          </ListItemIcon>
                          <ListItemText primary={<Typography variant="body2">{t('profileMenu.logout')}</Typography>} />
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

      <Dialog open={openPwd} onClose={() => setOpenPwd(false)} maxWidth="xs" fullWidth fullScreen={isMobile} PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitleWithClose
          onClose={() => setOpenPwd(false)}
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
              {t('profileMenu.passwordDialog.title')}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t('profileMenu.passwordDialog.subtitle')}
            </Typography>
          </Box>
        </DialogTitleWithClose>
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
            label={t('profileMenu.passwordDialog.currentPassword')}
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
            label={t('profileMenu.passwordDialog.newPassword')}
            type={showNew ? 'text' : 'password'}
            value={pwdForm.next}
            onChange={(e) => setPwdForm((p) => ({ ...p, next: e.target.value }))}
            fullWidth
            helperText={t('profileMenu.passwordDialog.newPasswordHelper')}
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
            label={t('profileMenu.passwordDialog.confirmPassword')}
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
            {t('profileMenu.passwordDialog.tip')}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setOpenPwd(false)} disabled={pwdLoading}>
            {t('common.cancel')}
          </Button>
          <Button variant="contained" onClick={handleChangePwd} disabled={pwdLoading}>
            {pwdLoading ? <CircularProgress size={18} color="inherit" /> : t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
