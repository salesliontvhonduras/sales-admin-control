import FeedCrudManager from './FeedCrudManager';
import { useTranslation } from 'react-i18next';

export default function MoviesFeedLionTv() {
  const { t } = useTranslation();
  return (
    <FeedCrudManager
      title={t('feeds.movies.title')}
      endpointBase="/new-movies-feed"
      createButtonLabel={t('feeds.movies.create')}
      emptyMessage={t('feeds.movies.empty')}
      createSuccessMessage={t('feeds.movies.created')}
      updateSuccessMessage={t('feeds.movies.updated')}
      deleteSuccessMessage={t('feeds.movies.deleted')}
      remoteImportConfig={{
        endpoint: '/new-movies-feed/v1/import-alluko',
        buttonLabel: t('feeds.movies.import.button', 'Importar desde Alluko'),
        title: t('feeds.movies.import.title', 'Importación desde Alluko'),
        helper: t(
          'feeds.movies.import.helper',
          'Autentícate manualmente en Alluko, copia el valor del header Cookie desde un request autenticado y úsalo para traer el JSON al payload.'
        ),
        cookieLabel: t('feeds.movies.import.cookieLabel', 'Cookie header autenticado'),
        cookiePlaceholder: t(
          'feeds.movies.import.cookiePlaceholder',
          'PHPSESSID=...; xm_simple_security_check=...; saved_access_code=subadmin; ...'
        ),
        categoryLabel: t('feeds.movies.import.categoryLabel', 'Categoría (opcional)'),
        categoryPlaceholder: t('feeds.movies.import.categoryPlaceholder', 'Vacío para todas'),
        fetchLabel: t('feeds.movies.import.fetch', 'Traer desde Alluko'),
        fetchingLabel: t('feeds.movies.import.fetching', 'Importando...'),
        successMessage: t('feeds.movies.import.success', 'Payload importado desde Alluko.'),
        errorMessage: t('feeds.movies.import.error', 'No se pudo importar desde Alluko.')
      }}
    />
  );
}
