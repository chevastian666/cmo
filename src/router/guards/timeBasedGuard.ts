import { RouteGuardContext, RouteConfig } from '../types';

// Guard for time-based access restrictions
export const timeBasedGuard = async (
  context: RouteGuardContext,
  route: RouteConfig
): Promise<boolean> => {
  const now = new Date();
  const currentHour = now.getHours();
  
  // Example: Restrict access to certain routes during maintenance hours (2 AM - 4 AM)
  const maintenanceStart = 2;
  const maintenanceEnd = 4;
  
  if (currentHour >= maintenanceStart && currentHour < maintenanceEnd) {
    // Allow admins to access during maintenance
    if (context.roles.includes('admin')) {
      return true;
    }
    
    console.warn('Access denied: System under maintenance');
    return false;
  }
  
  return true;
};

// Guard for checking if system is in maintenance mode
export const maintenanceGuard = async (
  context: RouteGuardContext,
  route: RouteConfig
): Promise<boolean> => {
  // Check if maintenance mode is enabled (could be from env var or API)
  const isMaintenanceMode = import.meta.env.VITE_MAINTENANCE_MODE === 'true';
  
  if (isMaintenanceMode) {
    // Allow admins to access during maintenance
    if (context.roles.includes('admin')) {
      return true;
    }
    
    // Allow access to maintenance page
    if (route.path === '/maintenance') {
      return true;
    }
    
    console.warn('Access denied: System in maintenance mode');
    return false;
  }
  
  return true;
};