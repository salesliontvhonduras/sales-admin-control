import { useTranslation } from 'react-i18next';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import { styled, alpha } from '@mui/material/styles';

const StyledChip = styled(Chip)(({ theme }) => ({
  borderRadius: 18,
  height: 38,
  padding: '0 10px',
  fontWeight: 700,
  letterSpacing: 0.1,
  background:
    theme.palette.mode === 'dark'
      ? alpha(theme.palette.primary.main, 0.14)
      : `linear-gradient(120deg, ${alpha(theme.palette.primary.main, 0.12)} 0%, ${alpha(
          theme.palette.primary.light,
          0.16
        )} 45%, ${alpha(theme.palette.background.paper, 0.92)} 100%)`,
  borderColor: alpha(theme.palette.primary.main, 0.5),
  color: theme.palette.text.primary,
  boxShadow: '0 8px 18px rgba(0,0,0,0.12)',
  '&:hover': {
    background:
      theme.palette.mode === 'dark'
        ? alpha(theme.palette.primary.main, 0.22)
        : alpha(theme.palette.primary.light, 0.28)
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

  return (
    <StyledChip
      clickable
      onClick={toggle}
      avatar={<Avatar sx={{ bgcolor: 'transparent', fontSize: 16 }}>{flag}</Avatar>}
      label={`${t('actions.language')}: ${label}`}
      variant="outlined"
      size="small"
    />
  );
}
