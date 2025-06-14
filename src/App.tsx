import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout, LayoutOptimized } from './features/common';
import { Dashboard } from './features/dashboard/components/Dashboard';
import { ArmadoPage } from './features/armado';
import { TransitosPage } from './features/transitos';
import { PrecintosPage, ErrorBoundary } from './features/precintos';
import { AlertasPage } from './features/alertas';
import { DespachantesPage } from './features/despachantes';
import { DepositosPage } from './features/depositos';
import { ZonasDescansoPage } from './features/zonas-descanso';
import { TorreControl } from './features/torre-control/components/TorreControl';
import { CentroDocumentacion } from './features/documentacion';
import { LibroNovedades } from './features/novedades';
import { CamionesPage } from './features/camiones/pages/CamionesPage';
import { CamionerosPage } from './features/camioneros/pages/CamionerosPage';
import { ModoTVPage } from './features/modo-tv/pages/ModoTVPage';
import { LoginPage } from './features/auth/LoginPage';
import { initializeStores, setupAutoRefresh } from './store';
import { useSharedIntegration, useSyncStoreActions } from './hooks/useSharedIntegration';
import { useAuth } from './hooks/useAuth';
import { useWebSocket } from './hooks/useWebSocket';
import { notificationService } from './services/shared/notification.service';
import { sharedWebSocketService } from './services/shared/sharedWebSocket.service';
import { SHARED_CONFIG } from './config/shared.config';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5000,
      retry: false, // Desactiva reintentos para desarrollo sin API
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const { isAuthenticated, canAccessCMO } = useAuth();
  
  // Initialize shared services integration
  useSharedIntegration();
  useSyncStoreActions();
  
  // Initialize WebSocket with authentication
  const { isConnected } = useWebSocket({
    onConnect: () => {
      console.log('Connected to real-time updates');
    },
    onDisconnect: () => {
      console.log('Disconnected from real-time updates');
    },
    onReconnect: () => {
      console.log('Reconnected to real-time updates');
      notificationService.info('Conexión Restaurada', 'La conexión en tiempo real ha sido restaurada');
    }
  });
  
  useEffect(() => {
    // Set up notification handlers for real-time events
    const unsubscribers: (() => void)[] = [];
    
    // New alert notifications
    unsubscribers.push(
      sharedWebSocketService.onAlertNew((data) => {
        notificationService.newAlert(data.alert || data);
      })
    );
    
    // Transit delay notifications
    unsubscribers.push(
      sharedWebSocketService.on(SHARED_CONFIG.WS_EVENTS.TRANSIT_UPDATE, (data) => {
        if (data.status === 'delayed') {
          notificationService.transitDelayed(data.transit);
        }
      })
    );
    
    // CMO message notifications
    unsubscribers.push(
      sharedWebSocketService.on(SHARED_CONFIG.WS_EVENTS.CMO_MESSAGE, (data) => {
        notificationService.cmoMessage(data.message || data);
      })
    );
    
    // Initialize stores and fetch initial data
    initializeStores();
    
    // Set up auto-refresh intervals (as fallback)
    const cleanup = setupAutoRefresh();
    
    return () => {
      unsubscribers.forEach(unsub => unsub());
      cleanup?.();
    };
  }, []);
  
  // Show login if not authenticated
  if (!isAuthenticated) {
    return (
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </QueryClientProvider>
    );
  }
  
  // Check authorization for CMO panel
  if (!canAccessCMO()) {
    return (
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <LayoutOptimized>
            <div className="flex items-center justify-center h-screen">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-red-400 mb-4">Acceso Denegado</h1>
                <p className="text-lg text-gray-400">No tienes permisos para acceder al Centro de Monitoreo de Operaciones.</p>
                <p className="text-base text-gray-500 mt-2">Contacta a tu administrador si crees que esto es un error.</p>
              </div>
            </div>
          </LayoutOptimized>
        </BrowserRouter>
      </QueryClientProvider>
    );
  }

  console.log('App: Rendering authenticated user routes');
  
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/modo-tv" element={<ModoTVPage />} />
          <Route path="*" element={
            <LayoutOptimized>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/armado" element={<ArmadoPage />} />
                <Route path="/transitos" element={<TransitosPage />} />
                <Route path="/precintos" element={
                  <ErrorBoundary componentName="PrecintosPage">
                    <PrecintosPage />
                  </ErrorBoundary>
                } />
                <Route path="/alertas" element={<AlertasPage />} />
                <Route path="/despachantes" element={<DespachantesPage />} />
                <Route path="/depositos" element={<DepositosPage />} />
                <Route path="/zonas-descanso" element={<ZonasDescansoPage />} />
                <Route path="/torre-control" element={<TorreControl />} />
                <Route path="/documentacion" element={<CentroDocumentacion />} />
                <Route path="/novedades" element={<LibroNovedades />} />
                <Route path="/camiones" element={<CamionesPage />} />
                <Route path="/camioneros" element={<CamionerosPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </LayoutOptimized>
          } />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;