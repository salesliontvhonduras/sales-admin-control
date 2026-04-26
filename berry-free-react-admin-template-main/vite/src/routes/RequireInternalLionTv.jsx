import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import useAuth from 'hooks/useAuth';
import { isResellerConsoleUser } from 'utils/rbac';

export default function RequireInternalLionTv({ children, fallbackPath = '/liontv/dashboard' }) {
  const { user } = useAuth();

  if (isResellerConsoleUser(user)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
}

RequireInternalLionTv.propTypes = {
  children: PropTypes.node.isRequired,
  fallbackPath: PropTypes.string
};
