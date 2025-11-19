import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('token'));

  // Cargar usuario desde token si existe
  useEffect(() => {
    if (accessToken) {
      setUser({ name: 'Authenticated User' }); // luego conectamos con backend
    }
  }, [accessToken]);

  const login = async (email, password) => {
    // luego lo reemplazas para llamar tu API real
    console.log('TODO: login normal', email, password);

    localStorage.setItem('token', 'FAKE_TOKEN');
    setAccessToken('FAKE_TOKEN');
    setUser({ name: 'User logged in' });
  };

  const loginWithGoogle = async (credential) => {
    console.log('credential Google:', credential);

    // Aquí llamas tu backend
    // const res = await axios.post('/auth/google', { credential });

    localStorage.setItem('token', credential);
    setAccessToken(credential);
    setUser({ name: 'Google User' });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
