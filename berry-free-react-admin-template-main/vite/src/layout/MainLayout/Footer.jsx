import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// material-ui
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <Stack
      direction="row"
      sx={{
        alignItems: 'center',
        justifyContent: 'space-between',
        pt: 3,
        mt: 'auto',
        borderTop: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Typography variant="caption">
        &copy; {t('layout.footer.allRightsReserved')}{' '}
        <Typography component={Link} href="https://liontvpremium.com" underline="hover" target="_blank" sx={{ color: 'secondary.main' }}>
          Lion Services
        </Typography>
      </Typography>
      <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', justifyContent: 'space-between' }}>
        <Link
          component={RouterLink}
          to="https://x.com/codedthemes"
          underline="hover"
          target="_blank"
          variant="caption"
          color="text.primary"
        >
          {t('layout.footer.x')}
        </Link>
        <Link
          component={RouterLink}
          to="https://discord.com/invite/p2E2WhCb6s"
          underline="hover"
          target="_blank"
          variant="caption"
          color="text.primary"
        >
          {t('layout.footer.discord')}
        </Link>
      </Stack>
    </Stack>
  );
}
