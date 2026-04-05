import { vivoPlayerApi } from 'utils/api';

const BASE_PATH = '/auth/v1/admin/panel-auths';

export async function listPanelAuths(params = {}, config = {}) {
  const response = await vivoPlayerApi.get(BASE_PATH, { params, ...config });
  return response?.data?.data || response?.data;
}

export async function getPanelAuthById(id, config = {}) {
  const response = await vivoPlayerApi.get(`${BASE_PATH}/${id}`, config);
  return response?.data?.data || response?.data;
}

export async function createPanelAuth(payload, config = {}) {
  const response = await vivoPlayerApi.post(BASE_PATH, payload, config);
  return response?.data?.data || response?.data;
}

export async function updatePanelAuth(id, payload, config = {}) {
  const response = await vivoPlayerApi.put(`${BASE_PATH}/${id}`, payload, config);
  return response?.data?.data || response?.data;
}

export async function updatePanelAuthStatus(id, active, config = {}) {
  const response = await vivoPlayerApi.patch(`${BASE_PATH}/${id}/status`, { active }, config);
  return response?.data?.data || response?.data;
}

export async function deletePanelAuth(id, config = {}) {
  const response = await vivoPlayerApi.delete(`${BASE_PATH}/${id}`, config);
  return response?.data?.data || response?.data;
}
