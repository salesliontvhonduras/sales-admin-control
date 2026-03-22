import FeedCrudManager from './FeedCrudManager';

export default function FutbolEventsFeedLionTv() {
  return (
    <FeedCrudManager
      title="Futbol Events Feed"
      endpointBase="/new-futbol-events-feed"
      createButtonLabel="New Futbol Events Feed"
      emptyMessage="No futbol events feed records found."
      createSuccessMessage="Futbol events feed created."
      updateSuccessMessage="Futbol events feed updated."
      deleteSuccessMessage="Futbol events feed deleted."
    />
  );
}
