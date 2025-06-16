export * from './authGuard';
export * from './timeBasedGuard';

// Re-export all guards as a collection
import { authGuard, roleGuard, permissionGuard, compositeGuard } from './authGuard';
import { timeBasedGuard, maintenanceGuard } from './timeBasedGuard';

export const guards = {
  auth: authGuard,
  role: roleGuard,
  permission: permissionGuard,
  composite: compositeGuard,
  timeBased: timeBasedGuard,
  maintenance: maintenanceGuard,
};