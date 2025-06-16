# CMO - Centro de Monitoreo de Operaciones

Sistema de Monitoreo de Precintos Electrónicos - Block Tracker

## 🚀 Descripción

CMO es una aplicación web de monitoreo en tiempo real para la gestión y seguimiento de precintos electrónicos en operaciones de transporte y logística. Desarrollado con React, TypeScript y Vite.

## 📋 Características Principales

- **Dashboard en Tiempo Real**: Visualización de métricas y KPIs operacionales
- **Gestión de Precintos**: Monitoreo de estado, batería y ubicación
- **Control de Tránsitos**: Seguimiento de rutas y vehículos
- **Sistema de Alertas**: Notificaciones automáticas por eventos críticos
- **Torre de Control**: Vista operacional completa
- **Modo TV**: Visualización optimizada para pantallas grandes

## 🏗️ Arquitectura

```
src/
├── components/         # Componentes reutilizables
│   ├── common/        # UI básicos (Badge, Card, Tabs, etc.)
│   ├── layout/        # Layout, Sidebar, Header
│   ├── charts/        # Visualizaciones y gráficos
│   └── modals/        # Modales compartidos
├── pages/             # Vistas principales (rutas)
├── features/          # Módulos por funcionalidad
├── hooks/             # Custom React hooks
├── services/          # APIs y lógica de negocio
├── store/             # Estado global (Zustand)
├── utils/             # Funciones utilitarias
├── types/             # TypeScript types
├── constants/         # Constantes
└── config/            # Configuración
```

Ver [ARCHITECTURE.md](./src/ARCHITECTURE.md) para más detalles.

## 🛠️ Tecnologías

- **Frontend**: React 18, TypeScript
- **Build Tool**: Vite
- **Estado**: Zustand
- **Routing**: React Router v6
- **Estilos**: Tailwind CSS
- **API**: REST + WebSocket
- **Mapas**: Google Maps API
- **Testing**: Vitest + React Testing Library

## 📦 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/your-org/cmo.git

# Instalar dependencias
cd cmo
npm install

# Configurar variables de entorno
cp .env.example .env
```

## 🚀 Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar tests
npm test

# Linting
npm run lint
```

## 🔧 Configuración

### Variables de Entorno

```env
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
VITE_GOOGLE_MAPS_API_KEY=your_api_key
VITE_USE_REAL_API=false
```

### Alias de Importación

El proyecto usa alias de importación para rutas más limpias:

```typescript
import { Badge } from '@/components/common';
import { useAuth } from '@/hooks';
import { precintosService } from '@/services';
```

## 📝 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run preview` - Preview del build
- `npm run lint` - Ejecutar ESLint
- `npm test` - Ejecutar tests
- `npm run test:coverage` - Coverage de tests

## 🧪 Testing

```bash
# Ejecutar todos los tests
npm test

# Ejecutar en modo watch
npm test -- --watch

# Coverage
npm run test:coverage
```

## 📚 Documentación

- [Arquitectura](./src/ARCHITECTURE.md) - Estructura del proyecto
- [API](./docs/API.md) - Documentación de la API
- [Componentes](./docs/COMPONENTS.md) - Catálogo de componentes

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Propietario - Todos los derechos reservados

## 👥 Equipo

Desarrollado por **Cheva**

---

Para más información, contactar al equipo de desarrollo.