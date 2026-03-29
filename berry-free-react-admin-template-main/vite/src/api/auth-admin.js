import { authApi } from 'utils/api';

function unwrap(response) {
  return response?.data?.data ?? response?.data ?? null;
}

export async function fetchAccessCatalog(config = {}) {
  const response = await authApi.get('/auth/v1/admin/access/catalog', config);
  return unwrap(response);
}

export async function fetchAdminUsers(params = {}, config = {}) {
  const response = await authApi.get('/auth/v1/admin/users', {
    ...config,
    params
  });
  return unwrap(response);
}

export async function fetchAdminUserById(userId, config = {}) {
  const response = await authApi.get(`/auth/v1/admin/users/${userId}`, config);
  return unwrap(response);
}

export async function createAdminUser(payload, config = {}) {
  const response = await authApi.post('/auth/v1/admin/users', payload, config);
  return unwrap(response);
}

export async function updateAdminUserStatus(userId, active, config = {}) {
  const response = await authApi.patch(`/auth/v1/admin/users/${userId}/status`, { active }, config);
  return unwrap(response);
}

export async function updateAdminUserAccess(userId, payload, config = {}) {
  const response = await authApi.put(`/auth/v1/admin/users/${userId}/access`, payload, config);
  return unwrap(response);
}
