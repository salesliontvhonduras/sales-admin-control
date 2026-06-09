import axios from 'axios';
import { clearSessionStorage, dispatchAuthLogout, getStoredAccessToken, isCookieSessionMode, persistAccessToken } from './authSession';

const API_AUTH = import.meta.env.VITE_API_AUTH;
const API_USERS = import.meta.env.VITE_API_USERS;
const API_PRODUCTS = import.meta.env.VITE_API_PRODUCTS;
const API_RESERVATIONS = import.meta.env.VITE_API_RESERVATIONS;
const API_SMS = import.meta.env.VITE_API_SMS;
const BASE_URL = import.meta.env.VITE_APP_BASE_NAME;
const API_CATALOGS = import.meta.env.VITE_API_CATALOGS;
const API_LIONTV = import.meta.env.VITE_API_LIONTV;
const trimTrailingSlash = (value) => String(value || '').replace(/\/+$/, '');
const normalizeContentAutomationBaseUrl = (value) => {
  if (!value) return '';

  let normalized = trimTrailingSlash(value);

  if (normalized.includes('/panel-lion-tv')) {
    normalized = normalized.replace('/panel-lion-tv', '/content-automation');
  } else if (normalized.endsWith('/liontv')) {
    normalized = `${normalized}/content-automation`;
  }

  return normalized;
};
const API_CONTENT_AUTOMATION = (() => {
  const direct = normalizeContentAutomationBaseUrl(import.meta.env.VITE_API_CONTENT_AUTOMATION);
  if (direct) return direct;

  const lionTv = normalizeContentAutomationBaseUrl(import.meta.env.VITE_API_LIONTV);
  if (lionTv) return lionTv;

  return '';
})();

const normalizeM3uBaseUrl = (value) => {
  if (!value) return '';

  let normalized = trimTrailingSlash(value);

  if (normalized.includes('/sales/catalogs')) {
    normalized = normalized.replace('/sales/catalogs', '/sales/m3u');
  } else if (normalized.endsWith('/catalogs')) {
    normalized = `${normalized.slice(0, -'/catalogs'.length)}/m3u`;
  } else if (normalized.endsWith('/panel-lion-tv')) {
    normalized = `${normalized.slice(0, -'/panel-lion-tv'.length)}/m3u`;
  }

  return normalized;
};

const normalizeCatalogsBaseUrl = (value) => {
  if (!value) return '';

  let normalized = trimTrailingSlash(value);

  if (normalized.includes('/sales/m3u')) {
    normalized = normalized.replace('/sales/m3u', '/sales/catalogs');
  } else if (normalized.endsWith('/m3u')) {
    normalized = `${normalized.slice(0, -'/m3u'.length)}/catalogs`;
  } else if (normalized.endsWith('/panel-lion-tv')) {
    normalized = `${normalized.slice(0, -'/panel-lion-tv'.length)}/catalogs`;
  }

  return normalized;
};

const API_M3U_CATALOG = (() => {
  const direct = normalizeM3uBaseUrl(import.meta.env.VITE_API_M3U_CATALOG);
  if (direct) return direct;

  const lionTv = normalizeM3uBaseUrl(import.meta.env.VITE_API_LIONTV);
  if (lionTv) return lionTv;

  return '';
})();
const API_M3U_CATALOG_FALLBACK = (() => {
  const directCatalogs = trimTrailingSlash(API_CATALOGS);
  if (directCatalogs && directCatalogs !== API_M3U_CATALOG) return directCatalogs;

  const explicitCatalogs = normalizeCatalogsBaseUrl(import.meta.env.VITE_API_M3U_CATALOG);
  if (explicitCatalogs && explicitCatalogs !== API_M3U_CATALOG) return explicitCatalogs;

  const lionTvCatalogs = normalizeCatalogsBaseUrl(import.meta.env.VITE_API_LIONTV);
  if (lionTvCatalogs && lionTvCatalogs !== API_M3U_CATALOG) return lionTvCatalogs;

  return '';
})();
const API_SAGA = import.meta.env.VITE_API_SAGA;
const API_SHOPIFY_DEMOS = import.meta.env.VITE_API_SHOPIFY_DEMOS;
const API_VIVO_PLAYER = (() => {
  const direct = import.meta.env.VITE_API_VIVO_PLAYER;
  if (direct) return direct;

  const lionTv = import.meta.env.VITE_API_LIONTV;
  if (!lionTv) return '';

  const trimmed = String(lionTv).replace(/\/+$/, '');
  if (trimmed.endsWith('/panel-lion-tv')) {
    return `${trimmed.slice(0, -'/panel-lion-tv'.length)}/vivo-player`;
  }

  return '';
})();
const COOKIE_MODE = isCookieSessionMode();
const REFRESH_PATH = import.meta.env.VITE_AUTH_REFRESH_PATH || '/auth/v1/session/refresh';
const REFRESH_ENABLED = String(import.meta.env.VITE_AUTH_REFRESH_ENABLED || 'true').toLowerCase() !== 'false';
const REFRESH_TIMEOUT_MS = Number(import.meta.env.VITE_AUTH_REFRESH_TIMEOUT_MS || 2000);

export const sagaApi = axios.create({
  baseURL: API_SAGA,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: COOKIE_MODE
});

export const lionTvApi = axios.create({
  baseURL: API_LIONTV,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: COOKIE_MODE
});

export const lionTvFormApi = axios.create({
  baseURL: API_LIONTV,
  withCredentials: COOKIE_MODE
});

export const contentAutomationApi = axios.create({
  baseURL: API_CONTENT_AUTOMATION,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: COOKIE_MODE
});

export const m3uCatalogApi = axios.create({
  baseURL: API_M3U_CATALOG,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: COOKIE_MODE
});

export const catalogsApi = axios.create({
  baseURL: API_CATALOGS,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: COOKIE_MODE
});

export const shopifyDemosApi = axios.create({
  baseURL: API_SHOPIFY_DEMOS,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: COOKIE_MODE
});

export const vivoPlayerApi = axios.create({
  baseURL: API_VIVO_PLAYER,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: COOKIE_MODE
});

export const authApi = axios.create({
  baseURL: API_AUTH,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: COOKIE_MODE
});

export const usersApi = axios.create({
  baseURL: API_USERS,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: COOKIE_MODE
});

export const productsApi = axios.create({
  baseURL: API_PRODUCTS,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: COOKIE_MODE
});

export const reservationsApi = axios.create({
  baseURL: API_RESERVATIONS,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: COOKIE_MODE
});

export const smsApi = axios.create({
  baseURL: API_SMS,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: COOKIE_MODE
});

// =======================
// INTERCEPTORES
// =======================

const isFormDataPayload = (value) => typeof FormData !== 'undefined' && value instanceof FormData;

const removeHeader = (headers, headerName) => {
  if (!headers) return;

  if (typeof headers.delete === 'function') {
    headers.delete(headerName);
    return;
  }

  Object.keys(headers).forEach((key) => {
    if (key.toLowerCase() === headerName.toLowerCase()) {
      delete headers[key];
    }
  });
};

// Función general para añadir el token (intenta localStorage y sessionStorage)
const attachToken = (config) => {
  if (isFormDataPayload(config?.data)) {
    config.headers = config.headers || {};
    removeHeader(config.headers, 'Content-Type');
    removeHeader(config.headers, 'content-type');
  }

  if (config?.skipAuthHeader || COOKIE_MODE) return config;
  const token = getStoredAccessToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

// Asignar el interceptor a cada instancia
authApi.interceptors.request.use(attachToken);
usersApi.interceptors.request.use(attachToken);
productsApi.interceptors.request.use(attachToken);
reservationsApi.interceptors.request.use(attachToken);
smsApi.interceptors.request.use(attachToken);
lionTvApi.interceptors.request.use(attachToken);
lionTvFormApi.interceptors.request.use(attachToken);
contentAutomationApi.interceptors.request.use(attachToken);
m3uCatalogApi.interceptors.request.use(attachToken);
catalogsApi.interceptors.request.use(attachToken);
sagaApi.interceptors.request.use(attachToken);
shopifyDemosApi.interceptors.request.use(attachToken);
vivoPlayerApi.interceptors.request.use(attachToken);

function shouldRetryM3uCatalogRequest(error) {
  if (!API_M3U_CATALOG_FALLBACK) return false;

  const originalRequest = error?.config;
  if (!originalRequest || originalRequest._m3uCatalogFallbackRetried) return false;

  const status = Number(error?.response?.status ?? 0);
  const message = String(error?.response?.data?.message || error?.message || '').toLowerCase();
  const currentBaseUrl = trimTrailingSlash(originalRequest.baseURL || API_M3U_CATALOG);

  return (
    status === 503 &&
    message.includes('name resolution failed') &&
    currentBaseUrl === trimTrailingSlash(API_M3U_CATALOG)
  );
}

// Kong currently exposes some M3U routes through the catalogs upstream when the /sales/m3u upstream cannot resolve.
m3uCatalogApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!shouldRetryM3uCatalogRequest(error)) {
      return Promise.reject(error);
    }

    return m3uCatalogApi.request({
      ...error.config,
      baseURL: API_M3U_CATALOG_FALLBACK,
      _m3uCatalogFallbackRetried: true
    });
  }
);

// (Opcional) Manejo global de errores
authApi.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('API AUTH Error:', err.response);
    return Promise.reject(err);
  }
);

usersApi.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('API USERS Error:', err.response);
    return Promise.reject(err);
  }
);

smsApi.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('API SMS Error:', err.response);
    return Promise.reject(err);
  }
);

const apiClients = [
  authApi,
  usersApi,
  productsApi,
  reservationsApi,
  smsApi,
  lionTvApi,
  lionTvFormApi,
  contentAutomationApi,
  m3uCatalogApi,
  catalogsApi,
  sagaApi,
  shopifyDemosApi,
  vivoPlayerApi
];

let refreshPromise = null;

function getRefreshUrl() {
  if (!API_AUTH) return null;
  if (REFRESH_PATH.startsWith('http://') || REFRESH_PATH.startsWith('https://')) return REFRESH_PATH;
  return `${API_AUTH}${REFRESH_PATH}`;
}

function extractAccessToken(responseData) {
  const data = responseData?.data ?? responseData;
  return data?.accessToken || data?.token || data?.jwt || data?.sessionToken || data?.authToken || null;
}

async function refreshSessionToken() {
  if (!REFRESH_ENABLED || !API_AUTH) {
    return null;
  }

  if (!refreshPromise) {
    const refreshUrl = getRefreshUrl();
    const currentToken = getStoredAccessToken();
    const refreshHeaders = { 'Content-Type': 'application/json' };
    if (!COOKIE_MODE && currentToken) {
      refreshHeaders.Authorization = `Bearer ${currentToken}`;
    }

    refreshPromise = axios
      .post(
        refreshUrl,
        {},
        {
          withCredentials: true,
          headers: refreshHeaders,
          timeout: REFRESH_TIMEOUT_MS,
          skipAuthRedirect: true
        }
      )
      .then((response) => {
        const nextToken = extractAccessToken(response?.data);
        if (nextToken) {
          persistAccessToken(nextToken);
        }
        return nextToken || getStoredAccessToken();
      })
      .catch(() => null)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

// Redireccionar a login en 401 (evita loops)
let isRedirecting401 = false;
const handleUnauthorized = async (error) => {
  const originalRequest = error?.config || {};
  const status = error?.response?.status ?? error?.request?.status;
  const isNetworkErr =
    (!status || status === 0) && (error?.code === 'ERR_NETWORK' || (error?.message || '').toLowerCase().includes('network'));

  const unauthorized = status === 401 || isNetworkErr;
  if (!unauthorized || originalRequest?.skipAuthRedirect) {
    return Promise.reject(error);
  }

  if (!originalRequest?._retry && status === 401) {
    originalRequest._retry = true;
    const refreshedToken = await refreshSessionToken();
    if (COOKIE_MODE || refreshedToken) {
      if (!COOKIE_MODE && refreshedToken) {
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${refreshedToken}`;
      }
      return axios(originalRequest);
    }
  }

  if (!isRedirecting401) {
    isRedirecting401 = true;
    clearSessionStorage();
    dispatchAuthLogout(status === 401 ? 'UNAUTHORIZED' : 'NETWORK');
    window.location.replace(`${BASE_URL}/pages/login`);
  }
  return Promise.reject(error);
};

apiClients.forEach((client) => {
  client.interceptors.response.use((response) => response, handleUnauthorized);
});

// Catch-all por si se usa axios directo en algún punto
axios.interceptors.response.use((res) => res, handleUnauthorized);
