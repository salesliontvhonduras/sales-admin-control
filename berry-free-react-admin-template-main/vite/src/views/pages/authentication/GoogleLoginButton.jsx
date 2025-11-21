import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import { useSnackbar } from 'notistack';

export default function GoogleLoginButton() {

  const { enqueueSnackbar } = useSnackbar();
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
          const { status, data } = responseBackend;

          if (status === 201 && data?.success) {
            enqueueSnackbar('Welcome back! 👋', { variant: 'success' });
            navigate('/dashboard/default');
          } else {
            enqueueSnackbar(data?.message || 'No se pudo iniciar sesión con Google.', { variant: 'error' });
          }
        } catch (err) {
          const errorMessage = err?.response?.data?.message || err?.message || 'Error inesperado al iniciar sesión con Google.';
          enqueueSnackbar(errorMessage, { variant: 'error' });
          console.error(err);
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
