import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { isCookieSessionMode } from '../utils/authSession';

export default function RequireAuth() {
  const { accessToken, user } = useAuth();
  const cookieMode = isCookieSessionMode();
  const authenticated = cookieMode ? Boolean(user || accessToken) : Boolean(accessToken);

  if (!authenticated) {
    return <Navigate to="pages/login" replace />;
  }

  return <Outlet />;
}
