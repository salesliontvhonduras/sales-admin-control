import FeedCrudManager from './FeedCrudManager';

export default function MoviesFeedLionTv() {
  return (
    <FeedCrudManager
      title="Movies Feed"
      endpointBase="/new-movies-feed"
      createButtonLabel="New Movie Feed"
      emptyMessage="No movie feed records found."
      createSuccessMessage="Movie feed created."
      updateSuccessMessage="Movie feed updated."
      deleteSuccessMessage="Movie feed deleted."
    />
  );
}
