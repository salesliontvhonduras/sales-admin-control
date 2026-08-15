import { shopifyDemosApi } from 'utils/api';

const BASE_PATH = '/paypal-checkout/v1/admin';

function unwrap(response) {
  return response?.data?.data ?? response?.data ?? null;
}

function buildConfig(extra = {}) {
  return {
    ...extra,
    skipAuthRedirect: true
  };
}

function normalizePage(payload = {}, fallbackPage = 0, fallbackSize = 25) {
  return {
    items: Array.isArray(payload.items) ? payload.items : Array.isArray(payload.data) ? payload.data : [],
    total: Number(payload.total ?? payload.totalItems ?? payload.count ?? 0),
    page: Number(payload.page ?? payload.index ?? fallbackPage),
    size: Number(payload.size ?? fallbackSize)
  };
}

export async function getPayPalCheckoutOverview(params = {}, config = {}) {
  const response = await shopifyDemosApi.get(`${BASE_PATH}/overview`, buildConfig({ ...config, params }));
  return unwrap(response) || {};
}

export async function listPayPalProducts(params = {}, config = {}) {
  const response = await shopifyDemosApi.get(`${BASE_PATH}/products`, buildConfig({ ...config, params }));
  const payload = unwrap(response);
  return Array.isArray(payload) ? payload : [];
}

export async function listPayPalPlans(params = {}, config = {}) {
  const response = await shopifyDemosApi.get(`${BASE_PATH}/plans`, buildConfig({ ...config, params }));
  const payload = unwrap(response);
  return Array.isArray(payload) ? payload : [];
}

export async function syncPayPalPlan(planCode, params = {}, config = {}) {
  const response = await shopifyDemosApi.post(
    `${BASE_PATH}/plans/${encodeURIComponent(planCode)}/sync-paypal`,
    {},
    buildConfig({ ...config, params })
  );
  return unwrap(response) || {};
}

export async function listPayPalSessions(params = {}, config = {}) {
  const response = await shopifyDemosApi.get(`${BASE_PATH}/sessions`, buildConfig({ ...config, params }));
  return normalizePage(unwrap(response) || {}, params.page ?? 0, params.size ?? 25);
}

export async function getPayPalSession(checkoutId, config = {}) {
  const response = await shopifyDemosApi.get(`${BASE_PATH}/sessions/${encodeURIComponent(checkoutId)}`, buildConfig(config));
  return unwrap(response) || {};
}

export async function refreshPayPalSession(checkoutId, config = {}) {
  const response = await shopifyDemosApi.post(
    `${BASE_PATH}/sessions/${encodeURIComponent(checkoutId)}/refresh-paypal`,
    {},
    buildConfig(config)
  );
  return unwrap(response) || {};
}

export async function listPayPalWebhooks(params = {}, config = {}) {
  const response = await shopifyDemosApi.get(`${BASE_PATH}/webhooks`, buildConfig({ ...config, params }));
  return normalizePage(unwrap(response) || {}, params.page ?? 0, params.size ?? 25);
}

export async function reprocessPayPalWebhook(eventId, config = {}) {
  const response = await shopifyDemosApi.post(
    `${BASE_PATH}/webhooks/${encodeURIComponent(eventId)}/reprocess`,
    {},
    buildConfig(config)
  );
  return unwrap(response) || {};
}
