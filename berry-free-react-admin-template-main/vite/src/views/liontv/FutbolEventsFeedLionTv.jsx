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
    />
  );
}
