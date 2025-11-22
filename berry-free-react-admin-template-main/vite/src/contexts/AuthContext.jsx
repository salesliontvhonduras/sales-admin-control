import { createContext, useState, useEffect } from 'react';
import { authApi } from '../utils/api';

export const AuthContext = createContext(null);

const getStoredValue = (key) => localStorage.getItem(key) ?? sessionStorage.getItem(key);

export default function AuthProvider({ children }) {
  // Inicializar desde localStorage
  const [accessToken, setAccessToken] = useState(() => getStoredValue('token'));
  const [user, setUser] = useState(() => {
    const storedUser = getStoredValue('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

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
    const res = await authApi.post('/auth/v1/login', { email, password });

    const { accessToken, user } = res.data.data;

    const storage = remember ? localStorage : sessionStorage;
    storage.setItem('token', accessToken);
    storage.setItem('user', JSON.stringify(user));

    setAccessToken(accessToken);
    setUser(user);

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

    // El backend devuelve más o menos: data: { accessToken, user }
    // const { accessToken, user } = res.data.data;

    // localStorage.setItem('token', accessToken);
    // localStorage.setItem('user', JSON.stringify(user));

    // setAccessToken(accessToken);
    // setUser(user);

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
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, loginWithGoogle, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
