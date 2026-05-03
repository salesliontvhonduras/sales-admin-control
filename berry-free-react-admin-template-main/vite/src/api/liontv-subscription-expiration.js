import useSWR from 'swr';
import { lionTvApi } from 'utils/api';

const DEFAULT_REFRESH_INTERVAL = 60000;

const unwrap = (response) => response?.data?.data ?? response?.data ?? null;

export async function getSubscriptionExpirationOverview() {
  const response = await lionTvApi.get('/subscription-expiration/v1/overview', { skipAuthRedirect: true });
  return unwrap(response);
}

export async function listSubscriptionExpirationJobs(params = {}) {
  const response = await lionTvApi.get('/subscription-expiration/v1/jobs', {
    params,
    skipAuthRedirect: true
  });
  return unwrap(response);
}

export async function getSubscriptionExpirationJobDetail(jobId) {
  const response = await lionTvApi.get(`/subscription-expiration/v1/jobs/${jobId}`, {
    skipAuthRedirect: true
  });
  return unwrap(response);
}

export async function getSubscriptionExpirationDiagnostics(subscriptionId) {
  const response = await lionTvApi.get(`/subscription-expiration/v1/subscriptions/${subscriptionId}/diagnostics`, {
    skipAuthRedirect: true
  });
  return unwrap(response);
}

export async function enqueueSubscriptionExpiration(subscriptionId) {
  const response = await lionTvApi.post(`/subscription-expiration/v1/subscriptions/${subscriptionId}/enqueue`, null, {
    skipAuthRedirect: true
  });
  return unwrap(response);
}

export async function retrySubscriptionExpirationJob(jobId) {
  const response = await lionTvApi.post(`/subscription-expiration/v1/jobs/${jobId}/retry`, null, {
    skipAuthRedirect: true
  });
  return unwrap(response);
}

export async function markSubscriptionExpirationJobReviewed(jobId) {
  const response = await lionTvApi.post(`/subscription-expiration/v1/jobs/${jobId}/mark-reviewed`, null, {
    skipAuthRedirect: true
  });
  return unwrap(response);
}

export async function runSubscriptionExpirationDetector() {
  const response = await lionTvApi.post('/subscription-expiration/v1/detector/run', null, {
    skipAuthRedirect: true
  });
  return unwrap(response);
}

export async function runSubscriptionExpirationWorker() {
  const response = await lionTvApi.post('/subscription-expiration/v1/worker/run', null, {
    skipAuthRedirect: true
  });
  return unwrap(response);
}

export function useSubscriptionExpirationOverview({ enabled = true, refreshInterval = DEFAULT_REFRESH_INTERVAL } = {}) {
  const swrKey = enabled ? 'api/liontv/subscription-expiration/overview' : null;
  const { data, error, isLoading, isValidating, mutate } = useSWR(swrKey, getSubscriptionExpirationOverview, {
    refreshInterval,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 20000,
    keepPreviousData: true,
    shouldRetryOnError: false
  });

  return {
    data,
    error,
    isLoading,
    isValidating,
    refresh: () => mutate(),
    mutate
  };
}
