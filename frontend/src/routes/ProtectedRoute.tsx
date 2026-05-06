import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import type { Role } from '../constants/roles';
import { refreshToken } from '../services/authService';
import { setAccessToken } from '../store/authSlice';
import { useAppDispatch } from '../store/hooks';
import { useAppSelector } from '../store/hooks';

interface ProtectedRouteProps {
  allowedRoles?: Role[];
}

function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isAuthenticated, token, user } = useAppSelector((state) => state.auth);
  const [isRestoring, setIsRestoring] = useState(
    () => Boolean(!isAuthenticated && !token && user && localStorage.getItem('refreshToken'))
  );
  const [restoreFailed, setRestoreFailed] = useState(false);

  useEffect(() => {
    const storedRefreshToken = localStorage.getItem('refreshToken');

    if (isAuthenticated || token || !user || !storedRefreshToken || restoreFailed) {
      return;
    }

    setIsRestoring(true);
    refreshToken()
      .then((result) => {
        dispatch(setAccessToken(result.accessToken));
      })
      .catch(() => {
        setRestoreFailed(true);
      })
      .finally(() => {
        setIsRestoring(false);
      });
  }, [dispatch, isAuthenticated, restoreFailed, token, user]);

  if (isRestoring) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-secondary)] text-sm text-[var(--text-secondary)]">
        Restoring session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
