import { lionTvApi } from 'utils/api';

const unwrap = (response) => response?.data?.data ?? response?.data ?? null;

export async function listAdminCreditRequests(params = {}, config = {}) {
  return unwrap(
    await lionTvApi.get('/business-purchases/v1/credit-requests', {
      ...config,
      params
    })
  );
}

export async function approveAdminCreditRequest(purchaseId, config = {}) {
  return unwrap(await lionTvApi.post(`/business-purchases/v1/credit-requests/${purchaseId}/approve`, null, config));
}
