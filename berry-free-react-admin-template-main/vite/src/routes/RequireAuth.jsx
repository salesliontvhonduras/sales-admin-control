import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function RequireAuth() {
  const { accessToken } = useAuth();

  if (!accessToken) {
    return <Navigate to="pages/login" replace />;
  }

  return <Outlet />; 
}
