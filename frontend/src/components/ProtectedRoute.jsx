// src/components/ProtectedRoute.jsx
// Guards routes based on authentication and role.

import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

// Requires login — guests are redirected to /login
export function ProtectedRoute({ children }) {
  const { user } = useSelector((state) => state.auth);
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

// Requires admin role
// - Guests → /login
// - Regular users → /dashboard
export function AdminRoute({ children }) {
  const { user } = useSelector((state) => state.auth);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
}

// Requires regular user (non-admin) role
// - Guests → /login
// - Admins → /admin/dashboard (admins have no favourites, dashboard, etc.)
export function UserOnlyRoute({ children }) {
  const { user } = useSelector((state) => state.auth);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  return children;
}
