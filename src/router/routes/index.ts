import { lazy } from 'react';
import { RouteConfig } from '../types';
import { 
  Home, 
  Package, 
  Truck, 
  AlertTriangle, 
  Users, 
  Building2, 
  FileText,
  Shield,
  Monitor,
  Radio,
  Wrench,
  MapPin,
  Book
} from 'lucide-react';

// Lazy load all pages
const DashboardPage = lazy(() => import('@/pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const PrecintosPage = lazy(() => import('@/pages/PrecintosPage'));
const TransitosPage = lazy(() => import('@/pages/TransitosPage'));
const AlertasPage = lazy(() => import('@/pages/AlertasPage'));
const ArmadoPage = lazy(() => import('@/pages/ArmadoPage'));
const ArmadoWaitingPage = lazy(() => import('@/pages/ArmadoWaitingPage'));
const PrearmadoPage = lazy(() => import('@/pages/PrearmadoPage'));
const DespachantesPage = lazy(() => import('@/pages/DespachantesPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const ModoTVPage = lazy(() => import('@/pages/ModoTVPage'));

// Feature pages that need to be moved
const TorreControl = lazy(() => import('@/features/torre-control/components/TorreControl').then(m => ({ default: m.TorreControl })));
const CentroDocumentacion = lazy(() => import('@/features/documentacion').then(m => ({ default: m.CentroDocumentacion })));
const LibroNovedades = lazy(() => import('@/features/novedades').then(m => ({ default: m.LibroNovedades })));
const DepositosPage = lazy(() => import('@/features/depositos').then(m => ({ default: m.DepositosPage })));
const ZonasDescansoPage = lazy(() => import('@/features/zonas-descanso').then(m => ({ default: m.ZonasDescansoPage })));
const CamionesPage = lazy(() => import('@/features/camiones/pages/CamionesPage').then(m => ({ default: m.CamionesPage })));
const CamionerosPage = lazy(() => import('@/features/camioneros/pages/CamionerosPage').then(m => ({ default: m.CamionerosPage })));
const RolesPage = lazy(() => import('@/features/roles').then(m => ({ default: m.RolesPage })));

export const routes: RouteConfig[] = [
  {
    path: '/login',
    element: LoginPage,
    title: 'Iniciar Sesión',
    layout: 'blank',
    requireAuth: false,
    showInMenu: false
  },
  {
    path: '/modo-tv',
    element: ModoTVPage,
    title: 'Modo TV',
    icon: <Monitor className="h-4 w-4" />,
    layout: 'fullscreen',
    requireAuth: true,
    showInMenu: false
  },
  {
    path: '/',
    requireAuth: true,
    layout: 'default',
    children: [
      {
        index: true,
        element: DashboardPage,
        title: 'Dashboard',
        icon: <Home className="h-4 w-4" />,
        showInMenu: true,
        breadcrumbLabel: 'Inicio'
      },
      {
        path: 'precintos',
        title: 'Precintos',
        icon: <Package className="h-4 w-4" />,
        showInMenu: true,
        children: [
          {
            index: true,
            element: PrecintosPage,
            title: 'Lista de Precintos',
            breadcrumbLabel: 'Lista'
          },
          {
            path: 'armado',
            element: ArmadoPage,
            title: 'Armado de Precintos',
            icon: <Wrench className="h-4 w-4" />,
            showInMenu: true,
            breadcrumbLabel: 'Armado'
          },
          {
            path: 'armado/waiting/:transitId',
            element: ArmadoWaitingPage,
            title: 'Esperando Armado',
            showInMenu: false,
            breadcrumbLabel: params => `Tránsito ${params.transitId}`
          },
          {
            path: 'prearmado',
            element: PrearmadoPage,
            title: 'Pre-armado',
            icon: <Shield className="h-4 w-4" />,
            showInMenu: true,
            breadcrumbLabel: 'Pre-armado'
          }
        ]
      },
      {
        path: 'transitos',
        element: TransitosPage,
        title: 'Tránsitos',
        icon: <Truck className="h-4 w-4" />,
        showInMenu: true,
        breadcrumbLabel: 'Tránsitos'
      },
      {
        path: 'alertas',
        element: AlertasPage,
        title: 'Alertas',
        icon: <AlertTriangle className="h-4 w-4" />,
        showInMenu: true,
        breadcrumbLabel: 'Alertas'
      },
      {
        path: 'torre-control',
        element: TorreControl,
        title: 'Torre de Control',
        icon: <Radio className="h-4 w-4" />,
        showInMenu: true,
        requireRoles: ['supervisor', 'admin'],
        breadcrumbLabel: 'Torre de Control'
      },
      {
        path: 'operaciones',
        title: 'Operaciones',
        icon: <Building2 className="h-4 w-4" />,
        showInMenu: true,
        children: [
          {
            path: 'despachantes',
            element: DespachantesPage,
            title: 'Despachantes',
            icon: <Users className="h-4 w-4" />,
            showInMenu: true,
            breadcrumbLabel: 'Despachantes'
          },
          {
            path: 'depositos',
            element: DepositosPage,
            title: 'Depósitos',
            icon: <Building2 className="h-4 w-4" />,
            showInMenu: true,
            breadcrumbLabel: 'Depósitos'
          },
          {
            path: 'zonas-descanso',
            element: ZonasDescansoPage,
            title: 'Zonas de Descanso',
            icon: <MapPin className="h-4 w-4" />,
            showInMenu: true,
            breadcrumbLabel: 'Zonas de Descanso'
          }
        ]
      },
      {
        path: 'vehiculos',
        title: 'Vehículos',
        icon: <Truck className="h-4 w-4" />,
        showInMenu: true,
        children: [
          {
            path: 'camiones',
            element: CamionesPage,
            title: 'Camiones',
            showInMenu: true,
            breadcrumbLabel: 'Camiones'
          },
          {
            path: 'camioneros',
            element: CamionerosPage,
            title: 'Camioneros',
            icon: <Users className="h-4 w-4" />,
            showInMenu: true,
            breadcrumbLabel: 'Camioneros'
          }
        ]
      },
      {
        path: 'administracion',
        title: 'Administración',
        icon: <Shield className="h-4 w-4" />,
        showInMenu: true,
        requireRoles: ['admin'],
        children: [
          {
            path: 'roles',
            element: RolesPage,
            title: 'Roles y Permisos',
            showInMenu: true,
            breadcrumbLabel: 'Roles'
          },
          {
            path: 'novedades',
            element: LibroNovedades,
            title: 'Libro de Novedades',
            icon: <Book className="h-4 w-4" />,
            showInMenu: true,
            breadcrumbLabel: 'Novedades'
          }
        ]
      },
      {
        path: 'documentacion',
        element: CentroDocumentacion,
        title: 'Documentación',
        icon: <FileText className="h-4 w-4" />,
        showInMenu: true,
        breadcrumbLabel: 'Documentación'
      }
    ]
  }
];

// Utility function to flatten routes
export function flattenRoutes(routes: RouteConfig[], parentPath = ''): RouteConfig[] {
  return routes.reduce((acc, route) => {
    const fullPath = parentPath + (route.path || '');
    const flatRoute = { ...route, path: fullPath };
    
    if (route.children) {
      return [...acc, flatRoute, ...flattenRoutes(route.children, fullPath + '/')];
    }
    
    return [...acc, flatRoute];
  }, [] as RouteConfig[]);
}