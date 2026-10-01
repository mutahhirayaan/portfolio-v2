import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

/** Requires a signed-in admin (JWT with Admin role, or the Firebase admin account). */
export default function ProtectedRoute({ children, role = 'Admin' }) {
  const { token, user, authReady } = useSelector((s) => s.auth);
  const location = useLocation();
  if (!authReady) return <div className="grid min-h-screen place-items-center text-sm text-muted" role="status">Checking sign-in...</div>;
  const expired = user?.exp && user.exp < Date.now();
  const allowed = token && user && !expired && user.roles.includes(role);
  if (!allowed) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  return children;
}
