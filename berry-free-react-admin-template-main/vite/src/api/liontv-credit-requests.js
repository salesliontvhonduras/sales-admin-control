import { lionTvApi } from 'utils/api';

const unwrap = (response) => response?.data?.data ?? response?.data ?? null;

export async function listCreditRequests(params = {}, config = {}) {
  return unwrap(
    await lionTvApi.get('/business-purchases/v1', {
      ...config,
      params: {
        category: 'CREDITS',
        purchaseType: 'LION_TV_CREDITS',
        ...params
      }
    })
  );
}

export async function createCreditRequest(payload, config = {}) {
  return unwrap(await lionTvApi.post('/business-purchases/v1', payload, config));
}
