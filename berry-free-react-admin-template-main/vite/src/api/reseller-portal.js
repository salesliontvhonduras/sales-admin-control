import { lionTvApi } from 'utils/api';

const unwrap = (response) => response?.data?.data ?? response?.data ?? null;

export const getResellerDashboard = async (config = {}) => unwrap(await lionTvApi.get('/reseller-portal/v1/dashboard', config));

export const listResellerCustomers = async (params = {}, config = {}) =>
  unwrap(await lionTvApi.get('/reseller-portal/v1/customers', { ...config, params }));

export const createResellerCustomer = async (payload, idempotencyKey, config = {}) =>
  unwrap(
    await lionTvApi.post('/reseller-portal/v1/customers', payload, {
      ...config,
      headers: { ...(config.headers || {}), ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}) }
    })
  );

export const renewResellerCustomer = async (userId, payload, idempotencyKey, config = {}) =>
  unwrap(
    await lionTvApi.post(`/reseller-portal/v1/customers/${userId}/renew`, payload, {
      ...config,
      headers: { ...(config.headers || {}), ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}) }
    })
  );

export const updateResellerCustomerStatus = async (userId, active, config = {}) =>
  unwrap(await lionTvApi.patch(`/reseller-portal/v1/customers/${userId}/status`, { active }, config));

export const resetResellerCustomerPassword = async (userId, password, config = {}) =>
  unwrap(await lionTvApi.post(`/reseller-portal/v1/customers/${userId}/password`, { password }, config));

export const listResellerSessions = async (params = {}, config = {}) =>
  unwrap(await lionTvApi.get('/reseller-portal/v1/sessions', { ...config, params }));

export const revokeResellerSession = async (sessionId, config = {}) =>
  unwrap(await lionTvApi.post(`/reseller-portal/v1/sessions/${sessionId}/revoke`, {}, config));

export const getResellerWalletSummary = async (config = {}) => unwrap(await lionTvApi.get('/reseller-portal/v1/wallet/summary', config));

export const getResellerWalletLedger = async (params = {}, config = {}) =>
  unwrap(await lionTvApi.get('/reseller-portal/v1/wallet/ledger', { ...config, params }));

export const listResellerNotifications = async (params = {}, config = {}) =>
  unwrap(await lionTvApi.get('/reseller-portal/v1/notifications', { ...config, params }));

export const markResellerNotificationRead = async (notificationId, config = {}) =>
  unwrap(await lionTvApi.patch(`/reseller-portal/v1/notifications/${notificationId}/read`, {}, config));

export const sendResellerNotification = async (payload, config = {}) =>
  unwrap(await lionTvApi.post('/reseller-portal/v1/admin/notifications', payload, config));

export const listResellerProfiles = async (params = {}, config = {}) =>
  unwrap(await lionTvApi.get('/reseller-portal/v1/admin/resellers', { ...config, params }));

export const upsertResellerProfile = async (payload, config = {}) =>
  unwrap(await lionTvApi.post('/reseller-portal/v1/admin/resellers', payload, config));

export const transferResellerCredits = async (username, payload, config = {}) =>
  unwrap(await lionTvApi.post(`/reseller-portal/v1/superreseller/resellers/${encodeURIComponent(username)}/credits`, payload, config));

export const adminCreditReseller = async (username, payload, config = {}) =>
  unwrap(await lionTvApi.post(`/reseller-portal/v1/admin/resellers/${encodeURIComponent(username)}/credits`, payload, config));
