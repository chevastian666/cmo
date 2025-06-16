// Main router exports
export { AppRouter } from './components/AppRouter';
export { ProtectedRoute, withProtectedRoute } from './components/ProtectedRoute';
export { RouteLayout } from './components/RouteLayout';
export { Breadcrumbs, useBreadcrumbs } from './components/Breadcrumbs';

// Route configuration
export { routes, flattenRoutes } from './routes';

// Guards
export * from './guards';

// Hooks
export * from './hooks';

// Types
export type * from './types';