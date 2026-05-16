import { lionTvApi } from 'utils/api';

const unwrap = (response) => response?.data?.data ?? response?.data ?? null;

export async function getEcommerceContactRoutingConfig(config = {}) {
  return unwrap(await lionTvApi.get('/ecommerce-contact-routing/v1/admin/config', config));
}

export async function updateEcommerceContactRoutingConfig(payload, config = {}) {
  return unwrap(await lionTvApi.put('/ecommerce-contact-routing/v1/admin/config', payload, config));
}
