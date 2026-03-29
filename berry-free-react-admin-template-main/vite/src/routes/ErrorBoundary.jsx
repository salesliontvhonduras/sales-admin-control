import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// material-ui
import Alert from '@mui/material/Alert';

// ==============================|| ELEMENT ERROR - COMMON ||============================== //

export default function ErrorBoundary() {
  const error = useRouteError();
  const { t } = useTranslation();

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return <Alert color="error">{t('errorBoundary.404')}</Alert>;
    }

    if (error.status === 401) {
      return <Alert color="error">{t('errorBoundary.401')}</Alert>;
    }

    if (error.status === 503) {
      return <Alert color="error">{t('errorBoundary.503')}</Alert>;
    }

    if (error.status === 418) {
      return <Alert color="error">{t('errorBoundary.418')}</Alert>;
    }
  }

  return <Alert color="error">{t('errorBoundary.default')}</Alert>;
}
