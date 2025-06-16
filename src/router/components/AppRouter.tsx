import React, { Suspense } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
  Outlet
} from 'react-router-dom';
import { LoadingOverlay } from '@/components/common/LoadingState';
import { ProtectedRoute } from './ProtectedRoute';
import { RouteLayout } from './RouteLayout';
import { ErrorBoundary } from '@/features/precintos/components/ErrorBoundary';
import { RouteConfig } from '../types';
import { routes } from '../routes';

// Fallback component for lazy loading
const RouteFallback = () => <LoadingOverlay visible />;

// Error fallback component
const ErrorFallback = () => (
  <div className="min-h-screen bg-gray-900 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-red-500 mb-4">Oops!</h1>
      <p className="text-lg text-gray-300 mb-8">Algo salió mal. Por favor, intenta de nuevo.</p>
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Recargar página
      </button>
    </div>
  </div>
);

// Create route element from config
const createRouteElement = (route: RouteConfig): React.ReactElement => {
  const { 
    element: Component, 
    requireAuth, 
    requireRoles, 
    requirePermissions,
    layout,
    errorElement: ErrorComponent = ErrorFallback
  } = route;

  // Wrap in layout if specified
  let element = Component ? (
    <Suspense fallback={<RouteFallback />}>
      <ErrorBoundary componentName={route.title || 'Route'}>
        <Component />
      </ErrorBoundary>
    </Suspense>
  ) : (
    <Outlet />
  );

  // Apply layout
  if (layout) {
    element = <RouteLayout layout={layout}>{element}</RouteLayout>;
  }

  // Apply protection if needed
  if (requireAuth || requireRoles?.length || requirePermissions?.length) {
    element = (
      <ProtectedRoute
        requireAuth={requireAuth}
        requireRoles={requireRoles}
        requirePermissions={requirePermissions}
      >
        {element}
      </ProtectedRoute>
    );
  }

  return element;
};

// Recursively create routes from config
const createRoutes = (routeConfigs: RouteConfig[]): React.ReactElement[] => {
  return routeConfigs.map((route, index) => {
    const { path, index: isIndex, children, loader, handle } = route;
    
    const routeElement = createRouteElement(route);
    
    if (children && children.length > 0) {
      return (
        <Route
          key={path || index}
          path={path}
          index={isIndex}
          element={routeElement}
          loader={loader}
          handle={handle}
          errorElement={<ErrorFallback />}
        >
          {createRoutes(children)}
        </Route>
      );
    }
    
    return (
      <Route
        key={path || index}
        path={path}
        index={isIndex}
        element={routeElement}
        loader={loader}
        handle={handle}
        errorElement={<ErrorFallback />}
      />
    );
  });
};

// Create the router
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {createRoutes(routes)}
      {/* Catch all route for 404 */}
      <Route
        path="*"
        element={
          <RouteLayout layout="default">
            <div className="min-h-[60vh] flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-600 mb-4">404</h1>
                <p className="text-xl text-gray-400 mb-8">Página no encontrada</p>
                <a
                  href="/"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-block"
                >
                  Volver al inicio
                </a>
              </div>
            </div>
          </RouteLayout>
        }
      />
      {/* Unauthorized route */}
      <Route
        path="/unauthorized"
        element={
          <RouteLayout layout="default">
            <div className="min-h-[60vh] flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-red-500 mb-4">Acceso Denegado</h1>
                <p className="text-lg text-gray-300 mb-8">
                  No tienes permisos para acceder a esta página.
                </p>
                <a
                  href="/"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-block"
                >
                  Volver al inicio
                </a>
              </div>
            </div>
          </RouteLayout>
        }
      />
    </>
  )
);

export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};