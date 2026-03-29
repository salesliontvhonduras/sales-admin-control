import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { styled, useColorScheme } from '@mui/material/styles';
import { withAlpha } from 'utils/colorUtils';

import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import SettingsBrightnessRoundedIcon from '@mui/icons-material/SettingsBrightnessRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';

const StyledChip = styled(Chip)(({ theme }) => ({
  borderRadius: 18,
  height: 36,
  padding: '0 10px',
  fontWeight: 700,
  letterSpacing: 0.1,
  background:
    theme.palette.mode === 'dark'
      ? withAlpha(theme.palette.primary.main, 0.2)
      : `linear-gradient(120deg, ${withAlpha(theme.palette.primary.main, 0.12)} 0%, ${withAlpha(
          theme.palette.primary.light,
          0.16
        )} 45%, ${withAlpha(theme.palette.background.paper, 0.92)} 100%)`,
  borderColor: withAlpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.7 : 0.5),
  color: theme.palette.text.primary,
  boxShadow: theme.palette.mode === 'dark' ? '0 10px 20px rgba(2,8,23,0.32)' : '0 8px 18px rgba(15,23,42,0.12)',
  '&:hover': {
    background: theme.palette.mode === 'dark' ? withAlpha(theme.palette.primary.main, 0.24) : withAlpha(theme.palette.primary.light, 0.3)
  }
}));

const modeOptions = [
  { value: 'light', icon: <LightModeRoundedIcon fontSize="small" /> },
  { value: 'dark', icon: <DarkModeRoundedIcon fontSize="small" /> },
  { value: 'system', icon: <SettingsBrightnessRoundedIcon fontSize="small" /> }
];

export default function ThemeModeSwitcher({ compact = false }) {
  const { t } = useTranslation();
  const colorSchemeApi = useColorScheme();
  const mode = colorSchemeApi?.mode ?? colorSchemeApi?.colorScheme ?? 'system';
  const systemMode = colorSchemeApi?.systemMode ?? 'light';
  const apply = colorSchemeApi?.setMode ?? colorSchemeApi?.setColorScheme;
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const effectiveMode = mode === 'system' ? systemMode : mode;

  const modeLabel = useMemo(
    () => ({
      light: t('themeMode.light'),
      dark: t('themeMode.dark'),
      system: t('themeMode.system')
    }),
    [t]
  );
  const currentOption = useMemo(() => modeOptions.find((option) => option.value === mode) || modeOptions[2], [mode]);
  const currentIcon = effectiveMode === 'dark' ? <DarkModeRoundedIcon fontSize="small" /> : <LightModeRoundedIcon fontSize="small" />;

  const applyMode = (nextMode) => {
    if (typeof apply === 'function') {
      apply(nextMode);
    }
    setAnchorEl(null);
  };

  return (
    <>
      <StyledChip
        clickable
        onClick={(event) => setAnchorEl(event.currentTarget)}
        avatar={<Avatar sx={{ bgcolor: 'transparent', width: 24, height: 24 }}>{currentIcon}</Avatar>}
        label={compact ? `${modeLabel[currentOption.value]}` : `${t('themeMode.labelPrefix')}: ${modeLabel[currentOption.value]}`}
        variant="outlined"
        size="small"
      />
      <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)} keepMounted>
        {modeOptions.map((option) => (
          <MenuItem key={option.value} selected={mode === option.value} onClick={() => applyMode(option.value)}>
            <ListItemIcon sx={{ minWidth: 30 }}>{option.icon}</ListItemIcon>
            <ListItemText
              primary={modeLabel[option.value]}
              secondary={option.value === 'system' ? `${t('themeMode.currentPrefix')}: ${modeLabel[systemMode] || modeLabel.light}` : null}
            />
            {mode === option.value ? <CheckRoundedIcon fontSize="small" color="primary" /> : null}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
