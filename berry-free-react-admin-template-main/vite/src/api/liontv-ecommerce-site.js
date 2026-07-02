import { lionTvApi, lionTvFormApi } from 'utils/api';

const unwrap = (response) => response?.data?.data ?? response?.data ?? null;

export async function getAdminEcommerceSiteConfig(config = {}) {
  return unwrap(await lionTvApi.get('/ecommerce-site/v1/admin/config', config));
}

export async function updateAdminEcommerceSiteConfig(payload, config = {}) {
  return unwrap(await lionTvApi.put('/ecommerce-site/v1/admin/config', payload, config));
}

export async function uploadAdminEcommerceStoryMedia(file, config = {}) {
  if (!file || typeof file.size !== 'number' || file.size <= 0) {
    throw new Error('Selecciona un archivo para subir.');
  }
  const formData = new FormData();
  formData.append('file', file, file.name || 'story-media');
  return unwrap(await lionTvFormApi.post('/ecommerce-site/v1/admin/story-media', formData, config));
}

export async function listAdminDeviceSetupRequests(params = {}, config = {}) {
  return unwrap(await lionTvApi.get('/ecommerce-site/v1/admin/device-setup-requests', { ...config, params }));
}

export async function confirmAdminDeviceSetupPayment(requestId, config = {}) {
  return unwrap(await lionTvApi.post(`/ecommerce-site/v1/admin/device-setup-requests/${requestId}/confirm-payment`, null, config));
}

export async function retryAdminDeviceSetupRequest(requestId, config = {}) {
  return unwrap(await lionTvApi.post(`/ecommerce-site/v1/admin/device-setup-requests/${requestId}/retry`, null, config));
}

export async function listAdminPayPerViewPurchases(params = {}, config = {}) {
  return unwrap(await lionTvApi.get('/ecommerce-site/v1/admin/pay-per-view/purchases', { ...config, params }));
}

export async function confirmAdminPayPerViewPurchase(purchaseId, config = {}) {
  return unwrap(await lionTvApi.post(`/ecommerce-site/v1/admin/pay-per-view/purchases/${purchaseId}/confirm`, null, config));
}

export async function revokeAdminPayPerViewPurchase(purchaseId, config = {}) {
  return unwrap(await lionTvApi.post(`/ecommerce-site/v1/admin/pay-per-view/purchases/${purchaseId}/revoke`, null, config));
}
