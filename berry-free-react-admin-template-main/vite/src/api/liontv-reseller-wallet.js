import { lionTvApi } from 'utils/api';

const unwrap = (response) => response?.data?.data ?? response?.data ?? null;

export async function getResellerWalletSummary(config = {}) {
  return unwrap(await lionTvApi.get('/reseller-wallet/v1/summary', config));
}

export async function getResellerSupportProfile(config = {}) {
  return unwrap(await lionTvApi.get('/reseller-wallet/v1/support-profile', config));
}

export async function updateResellerSupportProfile(payload, config = {}) {
  return unwrap(await lionTvApi.put('/reseller-wallet/v1/support-profile', payload, config));
}

export async function getResellerWalletLedger(params = {}, config = {}) {
  return unwrap(
    await lionTvApi.get('/reseller-wallet/v1/ledger', {
      ...config,
      params
    })
  );
}

export async function createResellerWalletAdjustment(payload, config = {}) {
  return unwrap(await lionTvApi.post('/reseller-wallet/v1/adjustments', payload, config));
}
