import { lionTvApi } from 'utils/api';

const unwrap = (response) => response?.data?.data ?? response?.data ?? null;
const base = '/reseller-youtube-premium/v1';

export const getYoutubePremiumDashboard = async (config = {}) => unwrap(await lionTvApi.get(`${base}/dashboard`, config));

export const listYoutubePremiumAccounts = async (params = {}, config = {}) =>
  unwrap(await lionTvApi.get(`${base}/accounts`, { ...config, params }));

export const createYoutubePremiumAccount = async (payload, idempotencyKey, config = {}) =>
  unwrap(
    await lionTvApi.post(`${base}/accounts`, payload, {
      ...config,
      headers: { ...(config.headers || {}), ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}) }
    })
  );

export const renewYoutubePremiumAccount = async (accountId, payload, idempotencyKey, config = {}) =>
  unwrap(
    await lionTvApi.post(`${base}/accounts/${accountId}/renew`, payload, {
      ...config,
      headers: { ...(config.headers || {}), ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}) }
    })
  );

export const updateYoutubePremiumAccountStatus = async (accountId, active, config = {}) =>
  unwrap(await lionTvApi.patch(`${base}/accounts/${accountId}/status`, { active }, config));

export const resetYoutubePremiumAccountPassword = async (accountId, password, config = {}) =>
  unwrap(await lionTvApi.post(`${base}/accounts/${accountId}/password`, { password }, config));

export const updateYoutubePremiumAccountDeviceLimit = async (accountId, deviceLimit, idempotencyKey, config = {}) =>
  unwrap(
    await lionTvApi.patch(
      `${base}/accounts/${accountId}/device-limit`,
      { deviceLimit },
      {
        ...config,
        headers: { ...(config.headers || {}), ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}) }
      }
    )
  );

export const deleteYoutubePremiumAccount = async (accountId, config = {}) =>
  unwrap(await lionTvApi.delete(`${base}/accounts/${accountId}`, config));

export const listYoutubePremiumSessions = async (params = {}, config = {}) =>
  unwrap(await lionTvApi.get(`${base}/sessions`, { ...config, params }));

export const revokeYoutubePremiumSession = async (sessionId, config = {}) =>
  unwrap(await lionTvApi.post(`${base}/sessions/${sessionId}/revoke`, {}, config));

export const getYoutubePremiumWallet = async (config = {}) => unwrap(await lionTvApi.get(`${base}/wallet`, config));

export const getYoutubePremiumWalletLedger = async (params = {}, config = {}) =>
  unwrap(await lionTvApi.get(`${base}/wallet/ledger`, { ...config, params }));

export const listYoutubePremiumNotifications = async (params = {}, config = {}) =>
  unwrap(await lionTvApi.get(`${base}/notifications`, { ...config, params }));

export const markYoutubePremiumNotificationRead = async (notificationId, config = {}) =>
  unwrap(await lionTvApi.patch(`${base}/notifications/${notificationId}/read`, {}, config));

export const listYoutubePremiumChildResellers = async (params = {}, config = {}) =>
  unwrap(await lionTvApi.get(`${base}/superreseller/resellers`, { ...config, params }));

export const upsertYoutubePremiumChildReseller = async (payload, config = {}) =>
  unwrap(await lionTvApi.post(`${base}/superreseller/resellers`, payload, config));

export const transferYoutubePremiumCredits = async (username, payload, config = {}) =>
  unwrap(await lionTvApi.post(`${base}/superreseller/resellers/${encodeURIComponent(username)}/credits`, payload, config));
