import { useEffect, useRef } from 'react';
import useAuth from '../../../hooks/useAuth'; // RUTA RELATIVA CORRECTA

export default function GoogleLoginButton() {
  const { loginWithGoogle } = useAuth();
  const buttonRef = useRef(null);

  useEffect(() => {
    if (!window.google || !buttonRef.current) return;

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: (response) => {
        const credential = response.credential;
        loginWithGoogle(credential);
      }
    });

    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: 'outline',
      size: 'large',
      width: 250
    });
  }, []);

  return <div ref={buttonRef}></div>;
}
