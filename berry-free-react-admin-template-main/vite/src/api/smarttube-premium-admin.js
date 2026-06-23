import { authApi } from 'utils/api';

function unwrap(response) {
  return response?.data?.data ?? response?.data ?? null;
}

export async function listSmartTubePremiumUsers(params = {}, config = {}) {
  const response = await authApi.get('/auth/v1/admin/smarttube-premium/users', {
    ...config,
    params
  });
  return unwrap(response);
}

export async function createSmartTubePremiumUser(payload, config = {}) {
  const response = await authApi.post('/auth/v1/admin/smarttube-premium/users', payload, config);
  return unwrap(response);
}

export async function updateSmartTubePremiumUserStatus(userId, active, config = {}) {
  const response = await authApi.patch(`/auth/v1/admin/smarttube-premium/users/${userId}/status`, { active }, config);
  return unwrap(response);
}

export async function resetSmartTubePremiumPassword(userId, password, config = {}) {
  const response = await authApi.post(`/auth/v1/admin/smarttube-premium/users/${userId}/password`, { password }, config);
  return unwrap(response);
}

export async function renewSmartTubePremiumLicense(userId, payload, config = {}) {
  const response = await authApi.post(`/auth/v1/admin/smarttube-premium/users/${userId}/renew`, payload, config);
  return unwrap(response);
}

export async function listSmartTubePremiumDevices(userId, config = {}) {
  const response = await authApi.get(`/auth/v1/admin/smarttube-premium/users/${userId}/devices`, config);
  return unwrap(response);
}

export async function revokeSmartTubePremiumDevice(userId, deviceId, config = {}) {
  const response = await authApi.post(`/auth/v1/admin/smarttube-premium/users/${userId}/devices/${deviceId}/revoke`, {}, config);
  return unwrap(response);
}

export async function resetSmartTubePremiumDevices(userId, config = {}) {
  const response = await authApi.post(`/auth/v1/admin/smarttube-premium/users/${userId}/devices/reset`, {}, config);
  return unwrap(response);
}

export async function updateSmartTubePremiumDeviceLimit(userId, deviceLimit, config = {}) {
  const response = await authApi.patch(`/auth/v1/admin/smarttube-premium/users/${userId}/device-limit`, { deviceLimit }, config);
  return unwrap(response);
}

export async function listSmartTubePremiumAccountRequests(params = {}, config = {}) {
  const response = await authApi.get('/auth/v1/admin/smarttube-premium/account-requests', {
    ...config,
    params
  });
  return unwrap(response);
}

export async function confirmSmartTubePremiumAccountRequest(requestId, payload, config = {}) {
  const response = await authApi.post(`/auth/v1/admin/smarttube-premium/account-requests/${requestId}/confirm-payment`, payload, config);
  return unwrap(response);
}

export async function rejectSmartTubePremiumAccountRequest(requestId, reason, config = {}) {
  const response = await authApi.post(`/auth/v1/admin/smarttube-premium/account-requests/${requestId}/reject`, { reason }, config);
  return unwrap(response);
}
