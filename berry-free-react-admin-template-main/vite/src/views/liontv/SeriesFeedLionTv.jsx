import FeedCrudManager from './FeedCrudManager';

export default function SeriesFeedLionTv() {
  return (
    <FeedCrudManager
      title="Series Feed"
      endpointBase="/new-series-feed"
      createButtonLabel="New Series Feed"
      emptyMessage="No series feed records found."
      createSuccessMessage="Series feed created."
      updateSuccessMessage="Series feed updated."
      deleteSuccessMessage="Series feed deleted."
    />
  );
}
