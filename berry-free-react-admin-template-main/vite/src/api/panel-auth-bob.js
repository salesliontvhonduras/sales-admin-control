import { lionTvApi } from 'utils/api';

const BASE_PATH = '/panel-integrations/bob/v1';

export async function getBobSessionStatus(integrationId, config = {}) {
  const response = await lionTvApi.get(`${BASE_PATH}/${integrationId}/session/status`, config);
  return response?.data?.data || response?.data;
}

export async function startBobCaptcha(integrationId, config = {}) {
  const response = await lionTvApi.post(`${BASE_PATH}/${integrationId}/captcha/start`, {}, config);
  return response?.data?.data || response?.data;
}

export async function completeBobCaptcha(integrationId, payload, config = {}) {
  const response = await lionTvApi.post(`${BASE_PATH}/${integrationId}/captcha/complete`, payload, config);
  return response?.data?.data || response?.data;
}

export async function clearBobSession(integrationId, config = {}) {
  const response = await lionTvApi.post(`${BASE_PATH}/${integrationId}/session/clear`, {}, config);
  return response?.data?.data || response?.data;
}
