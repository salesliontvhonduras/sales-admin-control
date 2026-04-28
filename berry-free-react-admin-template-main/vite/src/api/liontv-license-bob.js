import { lionTvApi } from 'utils/api';

function headers(accessToken) {
  return { Authorization: `Bearer ${accessToken}` };
}

export async function startLicenseBobCaptcha(licenseId, accessToken, config = {}) {
  const response = await lionTvApi.post(`/licenses/v1/${licenseId}/bob/captcha/start`, {}, {
    headers: headers(accessToken),
    skipAuthRedirect: true,
    ...config
  });
  return response?.data?.data || response?.data;
}

export async function completeLicenseBobCaptcha(licenseId, payload, accessToken, config = {}) {
  const response = await lionTvApi.post(`/licenses/v1/${licenseId}/bob/captcha/complete`, payload, {
    headers: headers(accessToken),
    skipAuthRedirect: true,
    ...config
  });
  return response?.data?.data || response?.data;
}

export async function clearLicenseBobSession(licenseId, accessToken, config = {}) {
  const response = await lionTvApi.post(`/licenses/v1/${licenseId}/bob/session/clear`, {}, {
    headers: headers(accessToken),
    skipAuthRedirect: true,
    ...config
  });
  return response?.data?.data || response?.data;
}

export async function getLicenseBobSessionStatus(licenseId, accessToken, config = {}) {
  const response = await lionTvApi.get(`/licenses/v1/${licenseId}/bob/session/status`, {
    headers: headers(accessToken),
    skipAuthRedirect: true,
    ...config
  });
  return response?.data?.data || response?.data;
}
