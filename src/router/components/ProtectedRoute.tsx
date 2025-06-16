import React, { useEffect } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoadingOverlay } from '@/components/common/LoadingState';
import { RouteConfig } from '../types';

interface ProtectedRouteProps {
  route?: RouteConfig;
  children?: React.ReactNode;
  requireAuth?: boolean;
  requireRoles?: string[];
  requirePermissions?: string[];
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  route,
  children,
  requireAuth = true,
  requireRoles = [],
  requirePermissions = [],
  redirectTo = '/login',
  fallback = <LoadingOverlay visible />
}) => {
  const location = useLocation();
  const { isAuthenticated, isLoading, user, hasRole, hasPermission } = useAuth();
  
  // Merge route config with props
  const authRequired = route?.requireAuth ?? requireAuth;
  const rolesRequired = route?.requireRoles ?? requireRoles;
  const permissionsRequired = route?.requirePermissions ?? requirePermissions;

  useEffect(() => {
    // Log access attempts for security monitoring
    if (authRequired && !isLoading) {
      console.log('Route access attempt:', {
        path: location.pathname,
        authenticated: isAuthenticated,
        user: user?.email,
        requiredRoles: rolesRequired,
        requiredPermissions: permissionsRequired
      });
    }
  }, [location.pathname, isAuthenticated, isLoading]);

  // Show loading state while checking auth
  if (isLoading) {
    return <>{fallback}</>;
  }

  // Check authentication
  if (authRequired && !isAuthenticated) {
    // Save the attempted location for redirect after login
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role requirements
  if (rolesRequired.length > 0) {
    const hasRequiredRole = rolesRequired.some(role => hasRole(role));
    if (!hasRequiredRole) {
      console.warn(`Access denied: User lacks required roles for ${location.pathname}`);
      return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }
  }

  // Check permission requirements
  if (permissionsRequired.length > 0) {
    const hasRequiredPermission = permissionsRequired.some(perm => hasPermission(perm));
    if (!hasRequiredPermission) {
      console.warn(`Access denied: User lacks required permissions for ${location.pathname}`);
      return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }
  }

  // Render children or outlet
  return <>{children || <Outlet />}</>;
};

// HOC for protecting individual components
export function withProtectedRoute<P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<ProtectedRouteProps, 'children'>
): React.FC<P> {
  return (props: P) => (
    <ProtectedRoute {...options}>
      <Component {...props} />
    </ProtectedRoute>
  );
}