import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth'; // ajusta ruta si es distinta

export default function GoogleLoginButton() {
  const { loginWithGoogle } = useAuth();
  const buttonRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!window.google || !buttonRef.current) return;

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: async (response) => {
        const credential = response.credential;

        try {
          const responseBackend = await loginWithGoogle(credential); 
          if (responseBackend.status === 201 && responseBackend.data.success) {
              navigate('/dashboard/default');
          } else {
              console.warn("Login con Google falló:", responseBackend);
          }
        } catch (e) {
          console.error('Google login error', e);
        }
      }
    });

    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: 'outline',
      size: 'large',
      width: 250
    });
  }, [loginWithGoogle, navigate]);

  return <div ref={buttonRef} />;
}
