import FeedCrudManager from './FeedCrudManager';
import { useTranslation } from 'react-i18next';

export default function SeriesFeedLionTv() {
  const { t } = useTranslation();
  return (
    <FeedCrudManager
      title={t('feeds.series.title')}
      endpointBase="/new-series-feed"
      createButtonLabel={t('feeds.series.create')}
      emptyMessage={t('feeds.series.empty')}
      createSuccessMessage={t('feeds.series.created')}
      updateSuccessMessage={t('feeds.series.updated')}
      deleteSuccessMessage={t('feeds.series.deleted')}
      remoteImportConfig={{
        endpoint: '/new-series-feed/v1/import-alluko',
        buttonLabel: t('feeds.series.import.button', 'Importar desde Alluko'),
        title: t('feeds.series.import.title', 'Importación desde Alluko'),
        helper: t(
          'feeds.series.import.helper',
          'Autentícate manualmente en Alluko, copia el valor del header Cookie desde un request autenticado y úsalo para traer el JSON al payload.'
        ),
        cookieLabel: t('feeds.series.import.cookieLabel', 'Cookie header autenticado'),
        cookiePlaceholder: t(
          'feeds.series.import.cookiePlaceholder',
          'PHPSESSID=...; xm_simple_security_check=...; saved_access_code=subadmin; ...'
        ),
        categoryLabel: t('feeds.series.import.categoryLabel', 'Categoría (opcional)'),
        categoryPlaceholder: t('feeds.series.import.categoryPlaceholder', 'Vacío para todas'),
        fetchLabel: t('feeds.series.import.fetch', 'Traer desde Alluko'),
        fetchingLabel: t('feeds.series.import.fetching', 'Importando...'),
        successMessage: t('feeds.series.import.success', 'Payload importado desde Alluko.'),
        errorMessage: t('feeds.series.import.error', 'No se pudo importar desde Alluko.')
      }}
    />
  );
}
