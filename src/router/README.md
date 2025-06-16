# Sistema de Rutas Avanzado

## Descripción

Sistema de enrutamiento avanzado para CMO basado en React Router v6 con características empresariales.

## Características

### 1. **Configuración Centralizada**
```typescript
const route: RouteConfig = {
  path: '/precintos',
  element: PrecintosPage,
  title: 'Precintos',
  icon: <Package />,
  requireAuth: true,
  requireRoles: ['operator', 'admin'],
  showInMenu: true,
  layout: 'default'
};
```

### 2. **Rutas Protegidas**
- Autenticación automática
- Verificación de roles
- Verificación de permisos
- Redirección inteligente

### 3. **Lazy Loading Automático**
Todas las páginas se cargan bajo demanda:
```typescript
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
```

### 4. **Breadcrumbs Automáticos**
Sistema inteligente que genera breadcrumbs basado en la estructura de rutas:
```tsx
<Breadcrumbs maxItems={4} showHome={true} />
```

### 5. **Rutas Anidadas**
Soporte completo para módulos con sub-rutas:
```typescript
{
  path: 'precintos',
  children: [
    { index: true, element: ListPage },
    { path: 'armado', element: ArmadoPage },
    { path: ':id', element: DetailPage }
  ]
}
```

## Uso

### Configuración Básica
```tsx
import { AppRouter } from '@/router';

function App() {
  return <AppRouter />;
}
```

### Navegación Programática
```tsx
import { useNavigation } from '@/router';

function MyComponent() {
  const { navigateTo, goBack } = useNavigation();
  
  const handleSubmit = () => {
    navigateTo('/precintos/armado', {
      params: { id: '123' },
      query: { status: 'active' }
    });
  };
}
```

### Protección de Rutas
```tsx
// En la configuración de rutas
{
  path: 'admin',
  element: AdminPage,
  requireAuth: true,
  requireRoles: ['admin'],
  requirePermissions: ['manage_users']
}

// O como componente
<ProtectedRoute requireRoles={['admin']}>
  <AdminContent />
</ProtectedRoute>
```

### Guards Personalizados
```typescript
const customGuard: RouteGuard = async (context, route) => {
  // Lógica personalizada
  return context.user.isVerified;
};
```

### Hooks Disponibles

#### useNavigation
```tsx
const {
  navigateTo,
  navigateToRoute,
  goBack,
  goForward,
  goHome,
  canGoBack,
  currentPath,
  currentQuery
} = useNavigation();
```

#### useBreadcrumbs
```tsx
const breadcrumbs = useBreadcrumbs();
// [{ label: 'Inicio', path: '/' }, { label: 'Precintos', path: '/precintos' }]
```

#### useRouteTransition
```tsx
const { isTransitioning, direction } = useRouteTransition();
```

## Layouts

El sistema soporta múltiples layouts:

- **default**: Layout completo con sidebar y header
- **blank**: Sin layout (para login, etc.)
- **fullscreen**: Pantalla completa (modo TV)
- **minimal**: Layout mínimo con solo container

## Guards Incluidos

- **authGuard**: Verifica autenticación
- **roleGuard**: Verifica roles de usuario
- **permissionGuard**: Verifica permisos específicos
- **timeBasedGuard**: Restricciones por horario
- **maintenanceGuard**: Modo mantenimiento

## Estructura de Archivos

```
router/
├── components/
│   ├── AppRouter.tsx      # Router principal
│   ├── ProtectedRoute.tsx # Rutas protegidas
│   ├── RouteLayout.tsx    # Layouts
│   └── Breadcrumbs.tsx    # Breadcrumbs
├── routes/
│   └── index.ts          # Configuración de rutas
├── guards/
│   ├── authGuard.ts      # Guards de autenticación
│   └── timeBasedGuard.ts # Guards temporales
├── hooks/
│   ├── useNavigation.ts  # Hook de navegación
│   └── useRouteTransition.ts # Transiciones
└── types.ts              # Tipos TypeScript
```

## Mejores Prácticas

1. **Organización**: Agrupa rutas relacionadas bajo un padre común
2. **Lazy Loading**: Usa para todas las páginas principales
3. **Guards**: Aplica el principio de menor privilegio
4. **Breadcrumbs**: Define labels descriptivos
5. **Errores**: Proporciona páginas de error personalizadas

By Cheva