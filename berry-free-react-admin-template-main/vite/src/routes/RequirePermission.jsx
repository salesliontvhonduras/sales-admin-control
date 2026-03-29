import PropTypes from 'prop-types';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from 'hooks/useAuth';
import { hasPermission } from 'utils/rbac';

export default function RequirePermission({ permission, fallbackPath = '/dashboard/default', children = null }) {
  const { user } = useAuth();
  const allowed = hasPermission(user, permission);

  if (!allowed) {
    return <Navigate to={fallbackPath} replace />;
  }

  if (children) return children;

  return <Outlet />;
}

RequirePermission.propTypes = {
  permission: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.shape({
      any: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
      all: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)])
    })
  ]),
  fallbackPath: PropTypes.string,
  children: PropTypes.node
};
