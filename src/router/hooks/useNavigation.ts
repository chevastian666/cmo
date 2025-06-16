import { useNavigate, useLocation, NavigateOptions } from 'react-router-dom';
import { useCallback } from 'react';
import { routes, flattenRoutes } from '../routes';

interface NavigationOptions extends NavigateOptions {
  params?: Record<string, string>;
  query?: Record<string, string>;
  preserveQuery?: boolean;
}

export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Navigate to a route by name/path
  const navigateTo = useCallback((
    path: string,
    options?: NavigationOptions
  ) => {
    let finalPath = path;
    
    // Replace params in path
    if (options?.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        finalPath = finalPath.replace(`:${key}`, value);
      });
    }
    
    // Add query params
    if (options?.query || options?.preserveQuery) {
      const searchParams = new URLSearchParams();
      
      // Preserve existing query params if requested
      if (options.preserveQuery) {
        const currentParams = new URLSearchParams(location.search);
        currentParams.forEach((value, key) => {
          searchParams.set(key, value);
        });
      }
      
      // Add new query params
      if (options.query) {
        Object.entries(options.query).forEach(([key, value]) => {
          searchParams.set(key, value);
        });
      }
      
      const queryString = searchParams.toString();
      if (queryString) {
        finalPath += `?${queryString}`;
      }
    }
    
    navigate(finalPath, options);
  }, [navigate, location.search]);
  
  // Navigate to a route by its title
  const navigateToRoute = useCallback((
    routeTitle: string,
    options?: NavigationOptions
  ) => {
    const flatRoutes = flattenRoutes(routes);
    const route = flatRoutes.find(r => r.title === routeTitle);
    
    if (!route?.path) {
      console.error(`Route with title "${routeTitle}" not found`);
      return;
    }
    
    navigateTo(route.path, options);
  }, [navigateTo]);
  
  // Go back
  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);
  
  // Go forward
  const goForward = useCallback(() => {
    navigate(1);
  }, [navigate]);
  
  // Navigate to home
  const goHome = useCallback(() => {
    navigate('/');
  }, [navigate]);
  
  // Check if can go back
  const canGoBack = window.history.length > 1;
  
  return {
    navigateTo,
    navigateToRoute,
    goBack,
    goForward,
    goHome,
    canGoBack,
    currentPath: location.pathname,
    currentQuery: Object.fromEntries(new URLSearchParams(location.search))
  };
};

// Hook for programmatic navigation with confirmation
export const useConfirmNavigation = () => {
  const { navigateTo } = useNavigation();
  
  const navigateWithConfirm = useCallback(async (
    path: string,
    confirmMessage: string = '¿Estás seguro de que quieres salir de esta página?',
    options?: NavigationOptions
  ) => {
    const confirmed = window.confirm(confirmMessage);
    
    if (confirmed) {
      navigateTo(path, options);
    }
  }, [navigateTo]);
  
  return { navigateWithConfirm };
};