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
    />
  );
}
