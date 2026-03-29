const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  REMEMBER: 'auth.remember'
};

const AUTH_LOGOUT_EVENT = 'app:auth:logout';
const AUTH_MODE = String(import.meta.env.VITE_AUTH_MODE || 'bearer').toLowerCase();
const COOKIE_MODE = AUTH_MODE === 'cookie';

function readStorageValue(key) {
  return localStorage.getItem(key) ?? sessionStorage.getItem(key);
}

export function isCookieSessionMode() {
  return COOKIE_MODE;
}

export function getRememberPreference() {
  const rememberRaw = readStorageValue(STORAGE_KEYS.REMEMBER);
  if (rememberRaw === null) return true;
  return rememberRaw === 'true';
}

export function getStoredAccessToken() {
  if (COOKIE_MODE) return null;
  return readStorageValue(STORAGE_KEYS.TOKEN);
}

export function getStoredUser() {
  const userRaw = readStorageValue(STORAGE_KEYS.USER);
  if (!userRaw) return null;
  try {
    return JSON.parse(userRaw);
  } catch {
    return null;
  }
}

export function persistSession({ accessToken, user, remember = true }) {
  const storage = remember ? localStorage : sessionStorage;
  const otherStorage = remember ? sessionStorage : localStorage;

  otherStorage.removeItem(STORAGE_KEYS.TOKEN);
  otherStorage.removeItem(STORAGE_KEYS.USER);
  otherStorage.removeItem(STORAGE_KEYS.REMEMBER);

  if (!COOKIE_MODE && accessToken) {
    storage.setItem(STORAGE_KEYS.TOKEN, accessToken);
  } else {
    storage.removeItem(STORAGE_KEYS.TOKEN);
  }

  if (user) {
    storage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } else {
    storage.removeItem(STORAGE_KEYS.USER);
  }

  storage.setItem(STORAGE_KEYS.REMEMBER, String(remember));
}

export function persistAccessToken(accessToken) {
  if (COOKIE_MODE) return;
  if (!accessToken) return;
  const remember = getRememberPreference();
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem(STORAGE_KEYS.TOKEN, accessToken);
}

export function clearSessionStorage() {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
  localStorage.removeItem(STORAGE_KEYS.REMEMBER);
  sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
  sessionStorage.removeItem(STORAGE_KEYS.USER);
  sessionStorage.removeItem(STORAGE_KEYS.REMEMBER);
}

export function dispatchAuthLogout(reason = 'UNAUTHORIZED') {
  window.dispatchEvent(
    new CustomEvent(AUTH_LOGOUT_EVENT, {
      detail: { reason }
    })
  );
}

export function listenAuthLogout(listener) {
  const wrappedListener = (event) => {
    listener(event?.detail || { reason: 'UNKNOWN' });
  };
  window.addEventListener(AUTH_LOGOUT_EVENT, wrappedListener);
  return () => window.removeEventListener(AUTH_LOGOUT_EVENT, wrappedListener);
}
