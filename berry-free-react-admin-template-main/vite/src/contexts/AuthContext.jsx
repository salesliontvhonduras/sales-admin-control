import { createContext, useState, useEffect } from 'react';
// Usa el axios del template Berry. Si no lo tienes, puedes usar `import axios from 'axios';`
import { authApi } from '../utils/api';


export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  // Inicializar desde localStorage
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Cuando cambia el token, podrías en el futuro validar o decodificar el JWT
  useEffect(() => {
    if (!accessToken) {
      setUser(null);
      return;
    }
    // Aquí podrías llamar a /v1/auth/me si quieres validar el token en backend
  }, [accessToken]);

  // Login normal (lo dejamos de momento como TODO)
  const login = async (email, password) => {
    console.log('TODO: login normal', email, password);
    // Ejemplo futuro:
    // const res = await axios.post('/v1/auth/login', { email, password });
    // const { accessToken, user } = res.data.data;
    // setSession(accessToken, user);
  };

  const loginWithGoogle = async (credential) => {
    const res = await authApi.post('/auth/v1/google', { credential });
    console.log(res);
    const { accessToken, user } = res.data.data;

    localStorage.setItem('token', accessToken);
    localStorage.setItem('user', JSON.stringify(user));

    setAccessToken(accessToken);
    setUser(user);

    return res;
  };

  

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
