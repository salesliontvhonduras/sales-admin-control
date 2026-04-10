import FeedCrudManager from './FeedCrudManager';
import { useTranslation } from 'react-i18next';

export default function FutbolEventsFeedLionTv() {
  const { t } = useTranslation();
  return (
    <FeedCrudManager
      title={t('feeds.futbol.title')}
      endpointBase="/new-futbol-events-feed"
      createButtonLabel={t('feeds.futbol.create')}
      emptyMessage={t('feeds.futbol.empty')}
      createSuccessMessage={t('feeds.futbol.created')}
      updateSuccessMessage={t('feeds.futbol.updated')}
      deleteSuccessMessage={t('feeds.futbol.deleted')}
      remoteImportConfig={{
        endpoint: '/new-futbol-events-feed/v1/import-alluko',
        buttonLabel: t('feeds.futbol.import.button', 'Importar desde Alluko'),
        title: t('feeds.futbol.import.title', 'Importación desde Alluko'),
        helper: t(
          'feeds.futbol.import.helper',
          'Autentícate manualmente en Alluko, pega el Cookie header de una sesión válida y usa la categoría 536 para traer los eventos de fútbol.'
        ),
        cookieLabel: t('feeds.futbol.import.cookieLabel', 'Cookie header autenticado'),
        cookiePlaceholder: t(
          'feeds.futbol.import.cookiePlaceholder',
          'PHPSESSID=...; xm_simple_security_check=...; saved_access_code=subadmin; ...'
        ),
        categoryLabel: t('feeds.futbol.import.categoryLabel', 'Categoría'),
        categoryPlaceholder: t('feeds.futbol.import.categoryPlaceholder', '536'),
        fetchLabel: t('feeds.futbol.import.fetch', 'Traer desde Alluko'),
        fetchingLabel: t('feeds.futbol.import.fetching', 'Importando...'),
        successMessage: t('feeds.futbol.import.success', 'Payload importado desde Alluko.'),
        errorMessage: t('feeds.futbol.import.error', 'No se pudo importar desde Alluko.')
      }}
    />
  );
}
