import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleRoute = ({ children, roles }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const normalizeRole = (r) => (r || "").toString().toUpperCase().trim();
  const required = (roles || []).map((r) => normalizeRole(r)).filter(Boolean);

  const hasRole = (user?.roles || []).some((userRoleRaw) => {
    const userRole = normalizeRole(userRoleRaw);
    if (!userRole) return false;

    return required.some((req) => {
      // Backend returns authorities like "ROLE_ADMIN"
      if (userRole === req) return true;
      if (userRole === `ROLE_${req}`) return true;
      return false;
    });
  });

  if (!hasRole) return <Navigate to="/" replace />;

  return children;
};

export default RoleRoute;