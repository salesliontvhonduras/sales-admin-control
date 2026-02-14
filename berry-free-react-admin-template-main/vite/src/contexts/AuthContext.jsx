import { createContext, useState, useEffect } from 'react';
import { authApi } from '../utils/api';

export const AuthContext = createContext(null);

const BASE_URL = import.meta.env.VITE_APP_BASE_NAME;
const getStoredValue = (key) => localStorage.getItem(key) ?? sessionStorage.getItem(key);

// Extrae metadatos de 2FA de una respuesta flexible (permite varios nombres de campos)
const parseTwoFactor = (payload = {}) => {
  const twoFactorRequired =
    payload.requiresTwoFactor ??
    payload.twoFactorRequired ??
    payload.mfaRequired ??
    payload.require2fa ??
    payload.requireTwoFactor ??
    false;

  if (!twoFactorRequired) return null;

  return {
    required: true,
    // token o id de desafío devuelto por el backend
    challengeId:
      payload.challengeId ||
      payload.twoFactorChallengeId ||
      payload.twoFactorToken ||
      payload.mfaToken ||
      payload.tempToken ||
      payload.ticket ||
      null,
    destination:
      payload.destination ||
      payload.maskedDestination ||
      payload.maskedPhone ||
      payload.maskedEmail ||
      payload.to ||
      null,
    channel: payload.channel || payload.deliveryMethod || payload.via || null
  };
};

const persistSession = (accessToken, user, remember = true) => {
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem('token', accessToken);
  storage.setItem('user', JSON.stringify(user));
};

export default function AuthProvider({ children }) {
  // Inicializar desde localStorage
  const [accessToken, setAccessToken] = useState(() => getStoredValue('token'));
  const [user, setUser] = useState(() => {
    const storedUser = getStoredValue('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  // Si se requiere 2FA, guardamos el desafío pendiente aquí
  const [pendingTwoFactor, setPendingTwoFactor] = useState(null);

  useEffect(() => {
    if (!accessToken) {
      setUser(null);
      return;
    }
    // Aquí podrías llamar /auth/me para validar token si quisieras
  }, [accessToken]);

  // ======================
  // LOGIN NORMAL (luego lo haremos)
  // ======================
  const login = async (email, password, remember = true) => {
    const res = await authApi.post('/auth/v1/session', { email, password, remember });

    const payload = res.data?.data ?? {};
    const twoFactor = parseTwoFactor(payload);

    // Si requiere 2FA: no guardamos token aún; dejamos desafío pendiente
    if (twoFactor?.required) {
      setPendingTwoFactor({
        ...twoFactor,
        email,
        remember
      });
      return { ...res, twoFactor };
    }

    const { accessToken: token, user: userData } = payload;

    persistSession(token, userData, remember);

    setAccessToken(token);
    setUser(userData);
    setPendingTwoFactor(null);

    return res;
  };

  // ======================
  // VERIFICAR OTP 2FA
  // ======================
  const verifyOtp = async (code, challengeId) => {
    const activeChallenge = challengeId || pendingTwoFactor?.challengeId;
    if (!activeChallenge) throw new Error('No hay desafío de 2FA activo');

    const res = await authApi.post('/auth/v1/session/otp/verify', {
      challengeId: activeChallenge,
      code
    });

    const payload = res.data?.data ?? {};
    const { accessToken: token, user: userData } = payload;

    const remember = pendingTwoFactor?.remember ?? true;
    persistSession(token, userData, remember);

    setAccessToken(token);
    setUser(userData);
    setPendingTwoFactor(null);

    return res;
  };

  // ======================
  // REENVIAR OTP 2FA
  // ======================
  const resendOtp = async () => {
    const activeChallenge = pendingTwoFactor?.challengeId;
    const email = pendingTwoFactor?.email;
    if (!activeChallenge && !email) throw new Error('No hay desafío de 2FA activo');

    const res = await authApi.post('/auth/v1/session/otp/resend', {
      challengeId: activeChallenge,
      email
    });
    return res;
  };

  // ======================
  // LOGIN CON GOOGLE
  // ======================
  const loginWithGoogle = async (credential) => {
    // ⚠️ IMPORTANTE: tu endpoint correcto sería /v1/auth/google
    const res = await authApi.post('/auth/v1/google', { credential });

    const { accessToken, user } = res.data.data;

    localStorage.setItem('token', accessToken);
    localStorage.setItem('user', JSON.stringify(user));

    setAccessToken(accessToken);
    setUser(user);

    return res; // 🔥 necesario para validación en el callback
  };

  // ======================
  // SIGN UP (REGISTRO)
  // ======================
  const register = async ({ name, email, serialCode, password }) => {

    const res = await authApi.post('/auth/v1/register', { name, email, serialCode, password });

    return res;
  };

  // ======================
  // LOGOUT
  // ======================
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setAccessToken(null);
    setUser(null);
    setPendingTwoFactor(null);
    window.location.replace(BASE_URL + '/pages/login');
  };

  return (
    <AuthContext.Provider
      value={{ user, accessToken, pendingTwoFactor, login, verifyOtp, resendOtp, loginWithGoogle, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
