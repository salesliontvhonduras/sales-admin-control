import { lionTvApi, lionTvFormApi } from 'utils/api';

const unwrap = (response) => response?.data?.data ?? response?.data ?? null;

export async function getAdminEcommerceSiteConfig(config = {}) {
  return unwrap(await lionTvApi.get('/ecommerce-site/v1/admin/config', config));
}

export async function updateAdminEcommerceSiteConfig(payload, config = {}) {
  return unwrap(await lionTvApi.put('/ecommerce-site/v1/admin/config', payload, config));
}

export async function uploadAdminEcommerceStoryMedia(file, config = {}) {
  const formData = new FormData();
  formData.append('file', file);
  return unwrap(await lionTvFormApi.post('/ecommerce-site/v1/admin/story-media', formData, config));
}
