import {
  Navigate,
  Outlet,
  useLocation
} from 'react-router-dom';

import type {
  Role
} from '../constants/roles';

import {
  useAppSelector
} from '../store/hooks';

interface ProtectedRouteProps {
  allowedRoles?: Role[];
}

function ProtectedRoute({
  allowedRoles
}: ProtectedRouteProps) {

  const location = useLocation();

  const { isAuthenticated, token, user } = useAppSelector(
    (state) => state.auth
  );

  // Check if user is authenticated (either isAuthenticated flag or token exists)
  const isLoggedIn = isAuthenticated || Boolean(token);

  // If not logged in, redirect to login
  if (!isLoggedIn) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // If allowedRoles is specified, check if user has the required role
  if (allowedRoles && allowedRoles.length > 0) {
    if (!user || !allowedRoles.includes(user.role)) {
      return (
        <Navigate
          to="/login"
          replace
        />
      );
    }
  }

  return <Outlet />;
}

export default ProtectedRoute;
