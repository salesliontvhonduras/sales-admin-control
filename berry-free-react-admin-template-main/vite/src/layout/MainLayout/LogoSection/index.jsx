import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// material-ui
import Link from '@mui/material/Link';

// project imports
import { DASHBOARD_PATH } from 'config';
import Logo from 'ui-component/Logo';

// ==============================|| MAIN LOGO ||============================== //

export default function LogoSection() {
  const { t } = useTranslation();

  return (
    <Link component={RouterLink} to={DASHBOARD_PATH} aria-label={t('layout.aria.themeLogo')}>
      <Logo />
    </Link>
  );
}
