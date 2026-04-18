import { lionTvApi } from 'utils/api';

const unwrap = (response) => response?.data?.data ?? response?.data ?? null;

export async function listVipCustomers(params = {}) {
  const response = await lionTvApi.get('/vip-customers/v1', { params });
  return unwrap(response);
}

export async function getVipConfig() {
  const response = await lionTvApi.get('/vip-customers/v1/config');
  return unwrap(response);
}

export async function updateVipConfig(payload) {
  const response = await lionTvApi.put('/vip-customers/v1/config', payload);
  return unwrap(response);
}

export async function recomputeVipCustomers() {
  const response = await lionTvApi.post('/vip-customers/v1/recompute');
  return unwrap(response);
}

export async function recomputeVipCustomer(customerId) {
  const response = await lionTvApi.post(`/vip-customers/v1/${customerId}/recompute`);
  return unwrap(response);
}

export async function overrideVipCustomer(customerId, payload) {
  const response = await lionTvApi.post(`/vip-customers/v1/${customerId}/override`, payload);
  return unwrap(response);
}

export async function listLoyaltyCustomers(params = {}) {
  const response = await lionTvApi.get('/loyalty/v1/customers', { params });
  return unwrap(response);
}

export async function getLoyaltyCustomerBalance(customerId) {
  const response = await lionTvApi.get('/loyalty/v1/customers', {
    params: { customerIds: customerId, index: 0, size: 1 }
  });
  const payload = unwrap(response);
  return payload?.data?.[0] || null;
}

export async function getLoyaltyConfig() {
  const response = await lionTvApi.get('/loyalty/v1/config');
  return unwrap(response);
}

export async function updateLoyaltyConfig(payload) {
  const response = await lionTvApi.put('/loyalty/v1/config', payload);
  return unwrap(response);
}

export async function listLoyaltyLedger(customerId, params = {}) {
  const response = await lionTvApi.get(`/loyalty/v1/${customerId}/ledger`, { params });
  return unwrap(response);
}

export async function adjustLoyaltyPoints(customerId, payload) {
  const response = await lionTvApi.post(`/loyalty/v1/${customerId}/adjustments`, payload);
  return unwrap(response);
}

export async function listRaffleTemplates() {
  const response = await lionTvApi.get('/raffle-templates/v1');
  return unwrap(response);
}

export async function createRaffleTemplate(payload) {
  const response = await lionTvApi.post('/raffle-templates/v1', payload);
  return unwrap(response);
}

export async function updateRaffleTemplate(templateId, payload) {
  const response = await lionTvApi.put(`/raffle-templates/v1/${templateId}`, payload);
  return unwrap(response);
}

export async function listRaffles(params = {}) {
  const response = await lionTvApi.get('/raffles/v1', { params });
  return unwrap(response);
}

export async function getRaffle(raffleId) {
  const response = await lionTvApi.get(`/raffles/v1/${raffleId}`);
  return unwrap(response);
}

export async function createRaffle(payload) {
  const response = await lionTvApi.post('/raffles/v1', payload);
  return unwrap(response);
}

export async function updateRaffle(raffleId, payload) {
  const response = await lionTvApi.put(`/raffles/v1/${raffleId}`, payload);
  return unwrap(response);
}

export async function previewRaffleAudience(payload) {
  const response = await lionTvApi.post('/raffles/v1/preview', payload);
  return unwrap(response);
}

export async function freezeRaffleAudience(raffleId) {
  const response = await lionTvApi.post(`/raffles/v1/${raffleId}/freeze-audience`);
  return unwrap(response);
}

export async function listRaffleEntries(raffleId) {
  const response = await lionTvApi.get(`/raffles/v1/${raffleId}/entries`);
  return unwrap(response);
}

export async function drawRaffle(raffleId) {
  const response = await lionTvApi.post(`/raffles/v1/${raffleId}/draw`);
  return unwrap(response);
}

export async function listRaffleWinners(raffleId) {
  const response = await lionTvApi.get(`/raffles/v1/${raffleId}/winners`);
  return unwrap(response);
}
