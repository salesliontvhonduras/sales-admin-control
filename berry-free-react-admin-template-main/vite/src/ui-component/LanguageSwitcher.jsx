import { useTranslation } from 'react-i18next';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

const StyledChip = styled(Chip)(({ theme }) => ({
  borderRadius: 16,
  height: 34,
  padding: '0 8px',
  fontWeight: 600,
  background: theme.palette.mode === 'dark' ? theme.palette.background.default : '#f5f7fb',
  borderColor: theme.palette.divider,
  color: theme.palette.text.primary,
  boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
  '&:hover': {
    background: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eef2f7'
  }
}));

export default function LanguageSwitcher({ overlay = false }) {
  const { i18n, t } = useTranslation();
  const isEs = i18n.language === 'es';
  const next = isEs ? 'en' : 'es';
  const flag = isEs ? '🇪🇸' : '🇺🇸';
  const label = isEs ? t('actions.spanish') : t('actions.english');

  const toggle = () => {
    i18n.changeLanguage(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lng', next);
    }
  };

  const chip = (
    <StyledChip
      clickable
      onClick={toggle}
      avatar={<Avatar sx={{ bgcolor: 'transparent', fontSize: 16 }}>{flag}</Avatar>}
      label={`${t('actions.language')}: ${label}`}
      variant="outlined"
      size="small"
    />
  );

  if (overlay) {
    return (
      <Box sx={{ position: 'absolute', top: 12, right: 12, zIndex: 2 }}>
        {chip}
      </Box>
    );
  }

  return (
    <Stack direction="row" justifyContent="flex-end">
      {chip}
    </Stack>
  );
}
