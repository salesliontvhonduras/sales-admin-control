import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAuth from '../../../hooks/useAuth';
import { useSnackbar } from 'notistack';

export default function GoogleLoginButton() {

  const { enqueueSnackbar } = useSnackbar();
  const { loginWithGoogle } = useAuth();
  const { t } = useTranslation();
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
            enqueueSnackbar(t('messages.welcome'), { variant: 'success' });
            navigate('/dashboard/default');
          } else {
            enqueueSnackbar(data?.message || t('auth.googleLogin.failed'), { variant: 'error' });
          }
        } catch (err) {
          const errorMessage = err?.response?.data?.message || err?.message || t('auth.googleLogin.unexpectedError');
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
  }, [loginWithGoogle, navigate, t]);

  return <div ref={buttonRef} />;
}
