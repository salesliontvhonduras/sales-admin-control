import { createContext, useState, useEffect } from 'react';
import { authApi } from '../utils/api';
import {
  clearSessionStorage,
  getStoredAccessToken,
  getStoredLionTvViewMode,
  getStoredUser,
  isCookieSessionMode,
  listenAuthLogout,
  persistLionTvViewMode,
  persistSession
} from '../utils/authSession';
import { getDefaultLionTvViewMode, resolveLionTvViewMode } from '../utils/rbac';

export const AuthContext = createContext(null);

const BASE_URL = import.meta.env.VITE_APP_BASE_NAME;
const COOKIE_MODE = isCookieSessionMode();

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
    destination: payload.destination || payload.maskedDestination || payload.maskedPhone || payload.maskedEmail || payload.to || null,
    channel: payload.channel || payload.deliveryMethod || payload.via || null
  };
};

export default function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(() => getStoredAccessToken());
  const [user, setUser] = useState(() => getStoredUser());
  const [lionTvViewMode, setLionTvViewModeState] = useState(() => resolveLionTvViewMode(getStoredUser(), getStoredLionTvViewMode()));
  // Si se requiere 2FA, guardamos el desafío pendiente aquí
  const [pendingTwoFactor, setPendingTwoFactor] = useState(null);

  useEffect(() => {
    if (!accessToken && !COOKIE_MODE) {
      setUser(null);
      return;
    }
    // Aquí podrías llamar /auth/me para validar token si quisieras
  }, [accessToken]);

  useEffect(() => {
    const unsubscribe = listenAuthLogout(() => {
      setAccessToken(null);
      setUser(null);
      setLionTvViewModeState(getDefaultLionTvViewMode(null));
      setPendingTwoFactor(null);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) {
      setLionTvViewModeState(getDefaultLionTvViewMode(null));
      return;
    }

    const resolvedMode = resolveLionTvViewMode(user, getStoredLionTvViewMode());
    setLionTvViewModeState((currentMode) => (currentMode === resolvedMode ? currentMode : resolvedMode));
    persistLionTvViewMode(resolvedMode);
  }, [user]);

  const setLionTvViewMode = (nextMode) => {
    const resolvedMode = resolveLionTvViewMode(user, nextMode);
    persistLionTvViewMode(resolvedMode);
    setLionTvViewModeState(resolvedMode);
    return resolvedMode;
  };

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
    const defaultViewMode = getDefaultLionTvViewMode(userData);

    persistSession({ accessToken: token, user: userData, remember });
    persistLionTvViewMode(defaultViewMode);

    setAccessToken(token);
    setUser(userData);
    setLionTvViewModeState(defaultViewMode);
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
    const defaultViewMode = getDefaultLionTvViewMode(userData);

    const remember = pendingTwoFactor?.remember ?? true;
    persistSession({ accessToken: token, user: userData, remember });
    persistLionTvViewMode(defaultViewMode);

    setAccessToken(token);
    setUser(userData);
    setLionTvViewModeState(defaultViewMode);
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
    const defaultViewMode = getDefaultLionTvViewMode(user);

    persistSession({ accessToken, user, remember: true });
    persistLionTvViewMode(defaultViewMode);

    setAccessToken(accessToken);
    setUser(user);
    setLionTvViewModeState(defaultViewMode);

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
    clearSessionStorage();
    setAccessToken(null);
    setUser(null);
    setLionTvViewModeState(getDefaultLionTvViewMode(null));
    setPendingTwoFactor(null);
    window.location.replace(`${BASE_URL}/pages/login`);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        lionTvViewMode,
        setLionTvViewMode,
        pendingTwoFactor,
        login,
        verifyOtp,
        resendOtp,
        loginWithGoogle,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
