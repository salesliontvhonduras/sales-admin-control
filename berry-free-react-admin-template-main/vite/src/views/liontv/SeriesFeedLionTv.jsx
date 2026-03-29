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
    />
  );
}
