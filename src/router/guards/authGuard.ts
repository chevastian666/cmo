import { RouteGuardContext, RouteConfig } from '../types';

export const authGuard = async (
  context: RouteGuardContext,
  route: RouteConfig
): Promise<boolean> => {
  const { isAuthenticated } = context;
  
  // If route doesn't require auth, allow access
  if (!route.requireAuth) {
    return true;
  }
  
  // Check if user is authenticated
  if (!isAuthenticated) {
    console.warn('Access denied: User not authenticated');
    return false;
  }
  
  return true;
};

export const roleGuard = async (
  context: RouteGuardContext,
  route: RouteConfig
): Promise<boolean> => {
  const { roles } = context;
  const requiredRoles = route.requireRoles || [];
  
  // If no roles required, allow access
  if (requiredRoles.length === 0) {
    return true;
  }
  
  // Check if user has at least one required role
  const hasRequiredRole = requiredRoles.some(role => roles.includes(role));
  
  if (!hasRequiredRole) {
    console.warn(`Access denied: User lacks required roles [${requiredRoles.join(', ')}]`);
    return false;
  }
  
  return true;
};

export const permissionGuard = async (
  context: RouteGuardContext,
  route: RouteConfig
): Promise<boolean> => {
  const { permissions } = context;
  const requiredPermissions = route.requirePermissions || [];
  
  // If no permissions required, allow access
  if (requiredPermissions.length === 0) {
    return true;
  }
  
  // Check if user has all required permissions
  const hasAllPermissions = requiredPermissions.every(perm => 
    permissions.includes(perm)
  );
  
  if (!hasAllPermissions) {
    console.warn(`Access denied: User lacks required permissions [${requiredPermissions.join(', ')}]`);
    return false;
  }
  
  return true;
};

// Composite guard that runs all guards
export const compositeGuard = async (
  context: RouteGuardContext,
  route: RouteConfig
): Promise<boolean> => {
  const guards = [authGuard, roleGuard, permissionGuard];
  
  for (const guard of guards) {
    const result = await guard(context, route);
    if (!result) {
      return false;
    }
  }
  
  return true;
};