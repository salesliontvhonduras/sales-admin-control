import { catalogsApi, lionTvApi } from 'utils/api';

function unwrap(response) {
  return response?.data?.data ?? response?.data ?? null;
}

export async function listBanks(config = {}) {
  return unwrap(await catalogsApi.get('/banks/v1', config));
}

export async function createBank(payload, config = {}) {
  return unwrap(await catalogsApi.post('/banks/v1', payload, config));
}

export async function updateBank(id, payload, config = {}) {
  return unwrap(await catalogsApi.put(`/banks/v1/${id}`, payload, config));
}

export async function deleteBank(id, config = {}) {
  return unwrap(await catalogsApi.delete(`/banks/v1/${id}`, config));
}

export async function listServices(config = {}) {
  return unwrap(await catalogsApi.get('/services/v1', config));
}

export async function createService(payload, config = {}) {
  return unwrap(await catalogsApi.post('/services/v1', payload, config));
}

export async function updateService(id, payload, config = {}) {
  return unwrap(await catalogsApi.put(`/services/v1/${id}`, payload, config));
}

export async function deleteService(id, config = {}) {
  return unwrap(await catalogsApi.delete(`/services/v1/${id}`, config));
}

export async function listLicenseApps(config = {}) {
  return unwrap(await catalogsApi.get('/license-apps/v1', config));
}

export async function createLicenseApp(payload, config = {}) {
  return unwrap(await catalogsApi.post('/license-apps/v1', payload, config));
}

export async function updateLicenseApp(id, payload, config = {}) {
  return unwrap(await catalogsApi.put(`/license-apps/v1/${id}`, payload, config));
}

export async function deleteLicenseApp(id, config = {}) {
  return unwrap(await catalogsApi.delete(`/license-apps/v1/${id}`, config));
}

export async function listCountryPhoneCodes(config = {}) {
  try {
    return unwrap(await catalogsApi.get('/countries/v1', config));
  } catch (error) {
    if (error?.response?.status !== 404) {
      throw error;
    }

    const fallback = unwrap(await catalogsApi.get('/countries/v1/list-all', config));
    return Array.isArray(fallback)
      ? fallback.map((item, index) => ({
          id: item?.id ?? `legacy-${index}`,
          ...item
        }))
      : [];
  }
}

export async function createCountryPhoneCode(payload, config = {}) {
  return unwrap(await catalogsApi.post('/countries/v1', payload, config));
}

export async function updateCountryPhoneCode(id, payload, config = {}) {
  return unwrap(await catalogsApi.put(`/countries/v1/${id}`, payload, config));
}

export async function deleteCountryPhoneCode(id, config = {}) {
  return unwrap(await catalogsApi.delete(`/countries/v1/${id}`, config));
}

export async function listPackagesCatalog(config = {}) {
  return unwrap(await lionTvApi.get('/packages/v1', config));
}

export async function createPackageCatalog(payload, config = {}) {
  return unwrap(await lionTvApi.post('/packages/v1', payload, config));
}

export async function updatePackageCatalog(id, payload, config = {}) {
  return unwrap(await lionTvApi.put(`/packages/v1/${id}`, payload, config));
}

export async function deletePackageCatalog(id, config = {}) {
  return unwrap(await lionTvApi.delete(`/packages/v1/${id}`, config));
}
