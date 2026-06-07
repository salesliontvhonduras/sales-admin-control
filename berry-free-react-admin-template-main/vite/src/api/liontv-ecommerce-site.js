import { lionTvApi } from 'utils/api';

const unwrap = (response) => response?.data?.data ?? response?.data ?? null;

export async function getAdminEcommerceSiteConfig(config = {}) {
  return unwrap(await lionTvApi.get('/ecommerce-site/v1/admin/config', config));
}

export async function updateAdminEcommerceSiteConfig(payload, config = {}) {
  return unwrap(await lionTvApi.put('/ecommerce-site/v1/admin/config', payload, config));
}
