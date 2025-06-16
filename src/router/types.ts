import { ComponentType, LazyExoticComponent } from 'react';
import { LoaderFunction } from 'react-router-dom';

export interface RouteConfig {
  path: string;
  element?: ComponentType<any> | LazyExoticComponent<ComponentType<any>>;
  title?: string;
  icon?: React.ReactNode;
  children?: RouteConfig[];
  index?: boolean;
  loader?: LoaderFunction;
  errorElement?: ComponentType<any>;
  handle?: RouteHandle;
  
  // Security
  requireAuth?: boolean;
  requireRoles?: string[];
  requirePermissions?: string[];
  
  // UI
  showInMenu?: boolean;
  showInBreadcrumb?: boolean;
  breadcrumbLabel?: string | ((params: any) => string);
  
  // Layout
  layout?: 'default' | 'blank' | 'fullscreen' | 'minimal';
  
  // Meta
  meta?: {
    description?: string;
    keywords?: string[];
    [key: string]: any;
  };
}

export interface RouteHandle {
  breadcrumb?: string | ((params: any) => string);
  title?: string;
  icon?: React.ReactNode;
  requireAuth?: boolean;
  requireRoles?: string[];
  requirePermissions?: string[];
}

export interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: React.ReactNode;
}

export interface RouteGuardContext {
  isAuthenticated: boolean;
  user: any;
  roles: string[];
  permissions: string[];
}

export type RouteGuard = (context: RouteGuardContext, route: RouteConfig) => boolean | Promise<boolean>;