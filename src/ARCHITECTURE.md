# Arquitectura del Proyecto CMO

## Estructura de Carpetas

La aplicación sigue una arquitectura modular con clara separación de responsabilidades:

```
src/
├── components/         # Componentes reutilizables
│   ├── common/        # Componentes UI básicos (botones, cards, badges, etc.)
│   ├── layout/        # Componentes de diseño (Header, Sidebar, Layout)
│   ├── charts/        # Componentes de visualización y gráficos
│   ├── modals/        # Componentes de modales compartidos
│   └── ui/            # Componentes UI específicos del dominio
├── pages/             # Vistas principales (rutas)
├── features/          # Módulos de funcionalidades específicas
├── hooks/             # Custom React hooks
├── services/          # Servicios de API y lógica de negocio
├── store/             # Estado global (Zustand)
├── utils/             # Funciones utilitarias
├── types/             # Definiciones de TypeScript
├── constants/         # Constantes de la aplicación
├── config/            # Configuración
├── styles/            # Estilos globales
└── assets/            # Imágenes, fuentes, etc.
```

## Principios de Organización

### 1. **Componentes Comunes** (`components/common/`)
- Componentes UI genéricos sin lógica de negocio
- Altamente reutilizables en toda la aplicación
- Ejemplos: Badge, Card, Tabs, LoadingState, EmptyState

### 2. **Componentes de Layout** (`components/layout/`)
- Estructura principal de la aplicación
- Header, Sidebar, Layout wrappers
- Sistema de notificaciones y estado de conexión

### 3. **Páginas** (`pages/`)
- Componentes de nivel superior que representan rutas
- Contienen la lógica de orquestación de cada vista
- Se importan directamente en el router

### 4. **Features** (`features/`)
- Módulos auto-contenidos por funcionalidad
- Cada feature tiene su propia estructura interna:
  - `components/` - Componentes específicos del feature
  - `services/` - Lógica de negocio
  - `types/` - Tipos TypeScript
  - `hooks/` - Hooks específicos

### 5. **Servicios** (`services/`)
- Capa de abstracción para APIs
- Lógica de negocio compartida
- Manejo de WebSocket y comunicación en tiempo real

### 6. **Store** (`store/`)
- Estado global con Zustand
- Organizado por slices (dominios)
- Hooks personalizados para acceso al store

## Convenciones de Importación

```typescript
// Componentes comunes
import { Badge, Card, LoadingState } from '@/components/common';

// Componentes de layout
import { Layout, Sidebar } from '@/components/layout';

// Páginas
import { DashboardPage, LoginPage } from '@/pages';

// Hooks
import { useAuth, useWebSocket } from '@/hooks';

// Servicios
import { precintosService, transitosService } from '@/services';

// Store
import { usePrecintosStore, useAlertasStore } from '@/store';
```

## Beneficios de esta Arquitectura

1. **Escalabilidad**: Fácil agregar nuevos features sin afectar otros
2. **Mantenibilidad**: Clara separación de responsabilidades
3. **Reutilización**: Componentes comunes disponibles globalmente
4. **Performance**: Lazy loading de páginas y features
5. **Testabilidad**: Componentes aislados fáciles de testear

## Migración desde la Estructura Anterior

Los siguientes cambios fueron realizados:

1. Componentes UI básicos movidos de `components/ui` a `components/common`
2. Componentes de layout extraídos a `components/layout`
3. Páginas principales movidas de `features/*/pages` a `pages/`
4. Consolidación de componentes duplicados
5. Eliminación del directorio redundante `stores/`

By Cheva