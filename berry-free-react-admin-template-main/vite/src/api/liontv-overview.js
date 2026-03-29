import useSWR from 'swr';
import { lionTvApi } from 'utils/api';

const DEFAULT_REFRESH_INTERVAL = 180000;
const AGGREGATE_OVERVIEW_ENABLED = String(import.meta.env.VITE_LIONTV_OVERVIEW_AGGREGATE_ENABLED || 'true').toLowerCase() !== 'false';
const AGGREGATE_OVERVIEW_PATH = import.meta.env.VITE_LIONTV_OVERVIEW_AGGREGATE_PATH || '/dashboard/v1/overview';
const OVERVIEW_KEYS = [
  'customers',
  'subscriptions',
  'licenses',
  'lines',
  'managedAccounts',
  'invoices',
  'commitments',
  'purchases',
  'potentialCustomers'
];

const CORE_RESOURCES = [
  { key: 'customers', path: '/customers/v1', params: { index: 0, size: 5000 } },
  { key: 'subscriptions', path: '/subscriptions/v1', params: { index: 0, size: 5000 } },
  { key: 'licenses', path: '/licenses/v1', params: { index: 0, size: 5000 } },
  { key: 'lines', path: '/lines/v1/list-lines', params: { index: 0, start: 0, size: 5000, filters: '', sorting: '' } },
  { key: 'managedAccounts', path: '/managed-accounts/v1', params: { index: 0, size: 5000 } },
  { key: 'invoices', path: '/invoices/v1', params: { index: 0, size: 5000 } },
  { key: 'commitments', path: '/payment-commitments/v1', params: { index: 0, size: 5000 } }
];

const EXTENDED_RESOURCES = [
  ...CORE_RESOURCES,
  { key: 'purchases', path: '/business-purchases/v1', params: { index: 0, size: 5000 } },
  { key: 'potentialCustomers', path: '/potential-customers/v1', params: { index: 0, size: 5000 } }
];

const EMPTY_OVERVIEW = {
  customers: [],
  subscriptions: [],
  licenses: [],
  lines: [],
  managedAccounts: [],
  invoices: [],
  commitments: [],
  purchases: [],
  potentialCustomers: [],
  meta: {
    scope: 'core',
    partial: false,
    failedEndpoints: [],
    fetchedAt: null,
    source: 'empty'
  }
};

function unwrap(res) {
  return res?.data?.data ?? res?.data ?? null;
}

function parseCollection(res) {
  const payload = unwrap(res);
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.content)) return payload.content;
  return [];
}

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeOverviewPayload(rawPayload = {}) {
  const payload = rawPayload?.overview || rawPayload?.kpis || rawPayload?.datasets || rawPayload;
  return {
    customers: toArray(payload?.customers),
    subscriptions: toArray(payload?.subscriptions),
    licenses: toArray(payload?.licenses),
    lines: toArray(payload?.lines),
    managedAccounts: toArray(payload?.managedAccounts),
    invoices: toArray(payload?.invoices),
    commitments: toArray(payload?.commitments),
    purchases: toArray(payload?.purchases),
    potentialCustomers: toArray(payload?.potentialCustomers)
  };
}

function hasOverviewPayload(payload) {
  return OVERVIEW_KEYS.some((key) => Array.isArray(payload?.[key]));
}

async function fetchCollection(resource) {
  const res = await lionTvApi.get(resource.path, {
    params: resource.params,
    skipAuthRedirect: true
  });
  return parseCollection(res);
}

async function fetchCollectionsFallback(scope = 'core') {
  const resources = scope === 'extended' ? EXTENDED_RESOURCES : CORE_RESOURCES;
  const tasks = await Promise.allSettled(resources.map((resource) => fetchCollection(resource)));
  const result = normalizeOverviewPayload();
  const failedEndpoints = [];

  tasks.forEach((task, index) => {
    const resource = resources[index];
    if (task.status === 'fulfilled') {
      result[resource.key] = task.value;
      return;
    }
    failedEndpoints.push(resource.path);
    result[resource.key] = [];
  });

  return {
    ...result,
    meta: {
      scope,
      partial: failedEndpoints.length > 0,
      failedEndpoints,
      fetchedAt: new Date().toISOString(),
      source: 'fallback'
    }
  };
}

async function fetchAggregateOverview(scope = 'core') {
  if (!AGGREGATE_OVERVIEW_ENABLED) return null;

  try {
    const response = await lionTvApi.get(AGGREGATE_OVERVIEW_PATH, {
      params: { scope },
      skipAuthRedirect: true
    });
    const normalized = normalizeOverviewPayload(unwrap(response));
    if (!hasOverviewPayload(normalized)) return null;

    return {
      ...normalized,
      meta: {
        scope,
        partial: false,
        failedEndpoints: [],
        fetchedAt: new Date().toISOString(),
        source: 'aggregate'
      }
    };
  } catch {
    return null;
  }
}

async function fetchOverview(scope = 'core') {
  const aggregateOverview = await fetchAggregateOverview(scope);
  if (aggregateOverview) return aggregateOverview;
  return fetchCollectionsFallback(scope);
}

export function useLionTvOverview({ enabled = true, scope = 'core', refreshInterval = DEFAULT_REFRESH_INTERVAL } = {}) {
  const swrKey = enabled ? `api/liontv/overview:${scope}` : null;

  const { data, error, isLoading, isValidating, mutate } = useSWR(swrKey, () => fetchOverview(scope), {
    refreshInterval,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 25000,
    keepPreviousData: true,
    shouldRetryOnError: false
  });

  return {
    data: data || { ...EMPTY_OVERVIEW, meta: { ...EMPTY_OVERVIEW.meta, scope } },
    error,
    isLoading,
    isValidating,
    refresh: () => mutate(),
    mutate
  };
}
