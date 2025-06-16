import React, { useMemo } from 'react';
import { Link, useLocation, useParams, useMatches } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/utils/utils';
import { BreadcrumbItem } from '../types';
import { routes, flattenRoutes } from '../routes';

interface BreadcrumbsProps {
  className?: string;
  separator?: React.ReactNode;
  homeIcon?: React.ReactNode;
  showHome?: boolean;
  maxItems?: number;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  className,
  separator = <ChevronRight className="h-4 w-4 text-gray-500" />,
  homeIcon = <Home className="h-4 w-4" />,
  showHome = true,
  maxItems
}) => {
  const location = useLocation();
  const params = useParams();
  const matches = useMatches();
  
  const breadcrumbs = useMemo(() => {
    const items: BreadcrumbItem[] = [];
    
    // Add home if enabled
    if (showHome) {
      items.push({
        label: 'Inicio',
        path: '/',
        icon: homeIcon
      });
    }
    
    // Get all routes in a flat structure
    const flatRoutes = flattenRoutes(routes);
    
    // Build breadcrumb path
    const pathSegments = location.pathname.split('/').filter(Boolean);
    let currentPath = '';
    
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Find matching route
      const route = flatRoutes.find(r => {
        const routePath = r.path?.replace(/:\w+/g, (match) => {
          const paramName = match.slice(1);
          return params[paramName] || match;
        });
        return routePath === currentPath;
      });
      
      if (route && route.showInBreadcrumb !== false) {
        let label = route.breadcrumbLabel || route.title || segment;
        
        // Handle dynamic labels
        if (typeof label === 'function') {
          label = label(params);
        }
        
        // Only add path if not the last item
        const isLast = index === pathSegments.length - 1;
        
        items.push({
          label,
          path: isLast ? undefined : currentPath,
          icon: route.icon
        });
      }
    });
    
    // Handle max items with ellipsis
    if (maxItems && items.length > maxItems) {
      const firstItem = items[0];
      const lastItems = items.slice(-(maxItems - 2));
      return [
        firstItem,
        { label: '...', path: undefined },
        ...lastItems
      ];
    }
    
    return items;
  }, [location.pathname, params, showHome, homeIcon, maxItems]);

  if (breadcrumbs.length <= 1) {
    return null; // Don't show breadcrumbs on home page
  }

  return (
    <nav 
      className={cn(
        "flex items-center space-x-2 text-sm",
        className
      )}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-2">
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;
          
          return (
            <li key={index} className="flex items-center">
              {index > 0 && <span className="mx-2">{separator}</span>}
              
              {item.path ? (
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-1 text-gray-400 hover:text-white transition-colors",
                    "hover:underline underline-offset-4"
                  )}
                >
                  {item.icon && <span className="shrink-0">{item.icon}</span>}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span 
                  className={cn(
                    "flex items-center gap-1",
                    isLast ? "text-white font-medium" : "text-gray-500"
                  )}
                >
                  {item.icon && <span className="shrink-0">{item.icon}</span>}
                  <span>{item.label}</span>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

// Hook to get current breadcrumbs
export const useBreadcrumbs = () => {
  const location = useLocation();
  const params = useParams();
  
  return useMemo(() => {
    const items: BreadcrumbItem[] = [];
    const flatRoutes = flattenRoutes(routes);
    
    const pathSegments = location.pathname.split('/').filter(Boolean);
    let currentPath = '';
    
    pathSegments.forEach((segment) => {
      currentPath += `/${segment}`;
      
      const route = flatRoutes.find(r => {
        const routePath = r.path?.replace(/:\w+/g, (match) => {
          const paramName = match.slice(1);
          return params[paramName] || match;
        });
        return routePath === currentPath;
      });
      
      if (route) {
        let label = route.breadcrumbLabel || route.title || segment;
        if (typeof label === 'function') {
          label = label(params);
        }
        
        items.push({
          label,
          path: currentPath,
          icon: route.icon
        });
      }
    });
    
    return items;
  }, [location.pathname, params]);
};