import axios from 'axios';

const API_AUTH = import.meta.env.VITE_API_AUTH;
const API_USERS = import.meta.env.VITE_API_USERS;
const API_PRODUCTS = import.meta.env.VITE_API_PRODUCTS;
const API_RESERVATIONS = import.meta.env.VITE_API_RESERVATIONS;

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


// =======================
// INTERCEPTORES
// =======================

// Función general para añadir el token
const attachToken = (config) => {
  const token = localStorage.getItem('token');
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