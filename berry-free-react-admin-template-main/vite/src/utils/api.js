import axios from 'axios';


const API_AUTH = import.meta.env.VITE_API_AUTH;
const API_USERS = import.meta.env.VITE_API_USERS;
const API_PRODUCTS = import.meta.env.VITE_API_PRODUCTS;
const API_RESERVATIONS = import.meta.env.VITE_API_RESERVATIONS;
const API_SMS = import.meta.env.VITE_API_SMS;
const BASE_URL = import.meta.env.VITE_APP_BASE_NAME;
const API_CATALOGS = import.meta.env.VITE_API_CATALOGS;
const API_LIONTV = import.meta.env.VITE_API_LIONTV;
const API_SAGA = import.meta.env.VITE_API_SAGA;
const API_SHOPIFY_DEMOS = import.meta.env.VITE_API_SHOPIFY_DEMOS;


export const sagaApi = axios.create({
  baseURL: API_SAGA,
  headers: { 'Content-Type': 'application/json' }
});


export const lionTvApi = axios.create({
  baseURL: API_LIONTV,
  headers: { 'Content-Type': 'application/json' }
});

export const catalogsApi = axios.create({
  baseURL: API_CATALOGS,
  headers: { 'Content-Type': 'application/json' }
});

export const shopifyDemosApi = axios.create({
  baseURL: API_SHOPIFY_DEMOS,
  headers: { 'Content-Type': 'application/json' }
});


export const authApi = axios.create({
  baseURL: API_AUTH,
  headers: { 'Content-Type': 'application/json' }
});

export const usersApi = axios.create({
  baseURL: API_USERS,
  headers: { 'Content-Type': 'application/json' }
});

export const productsApi = axios.create({
  baseURL: API_PRODUCTS,
  headers: { 'Content-Type': 'application/json' }
});

export const reservationsApi = axios.create({
  baseURL: API_RESERVATIONS,
  headers: { 'Content-Type': 'application/json' }
});

export const smsApi = axios.create({
  baseURL: API_SMS,
  headers: { 'Content-Type': 'application/json' }
});

// =======================
// INTERCEPTORES
// =======================

// Función general para añadir el token (intenta localStorage y sessionStorage)
const attachToken = (config) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (token) {
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
catalogsApi.interceptors.request.use(attachToken);
sagaApi.interceptors.request.use(attachToken);
shopifyDemosApi.interceptors.request.use(attachToken);



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

// Redireccionar a login en 401 (evita loops)
let isRedirecting401 = false;
const handleUnauthorized = (error) => {
  const status = error?.response?.status ?? error?.request?.status;
  const isNetworkErr =
    (!status || status === 0) &&
    (error?.code === 'ERR_NETWORK' || (error?.message || '').toLowerCase().includes('network'));

  if ((status === 401 || isNetworkErr) && !isRedirecting401) {
    isRedirecting401 = true;
    // Limpia estado local antes de salir
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    window.location.replace(BASE_URL + '/pages/login');
  }
  return Promise.reject(error);
};

authApi.interceptors.response.use((res) => res, handleUnauthorized);
usersApi.interceptors.response.use((res) => res, handleUnauthorized);
productsApi.interceptors.response.use((res) => res, handleUnauthorized);
reservationsApi.interceptors.response.use((res) => res, handleUnauthorized);
smsApi.interceptors.response.use((res) => res, handleUnauthorized);
lionTvApi.interceptors.response.use((res) => res, handleUnauthorized);
catalogsApi.interceptors.response.use((res) => res, handleUnauthorized);
sagaApi.interceptors.response.use((res) => res, handleUnauthorized);
shopifyDemosApi.interceptors.response.use((res) => res, handleUnauthorized);

// Catch-all por si se usa axios directo en algún punto
axios.interceptors.response.use((res) => res, handleUnauthorized);
