/**
 * CMO - Centro de Monitoreo de Operaciones
 * Sistema de Monitoreo de Precintos Electrónicos - Block Tracker
 * By Cheva
 */

import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppRouter } from '@/router';
import { initializeStores, setupAutoRefresh } from '@/store';
import { useSharedIntegration, useSyncStoreActions } from '@/hooks/useSharedIntegration';
import { useWebSocket } from '@/hooks/useWebSocket';
import { notificationService } from '@/services/shared/notification.service';
import { sharedWebSocketService } from '@/services/shared/sharedWebSocket.service';
import { SHARED_CONFIG } from '@/config/shared.config';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

function AppContent() {
  // Initialize WebSocket connection
  const { isConnected, reconnect } = useWebSocket();
  
  // Initialize shared state integration
  useSharedIntegration();
  
  // Sync store actions with shared state
  useSyncStoreActions();
  
  useEffect(() => {
    // Subscribe to WebSocket events
    const unsubscribers: (() => void)[] = [];
    
    // Connection state changes
    unsubscribers.push(
      sharedWebSocketService.on(SHARED_CONFIG.WS_EVENTS.CONNECTION_STATE, ({ state }) => {
        switch (state) {
          case 'connected':
            notificationService.success('Conexión establecida');
            break;
          case 'disconnected':
            notificationService.error('Conexión perdida');
            break;
          case 'reconnecting':
            notificationService.warning('Reconectando...');
            break;
        }
      })
    );
    
    // Precinto updates
    unsubscribers.push(
      sharedWebSocketService.on(SHARED_CONFIG.WS_EVENTS.PRECINTO_UPDATE, (data) => {
        console.log('Precinto update received:', data);
      })
    );
    
    // Alerta updates
    unsubscribers.push(
      sharedWebSocketService.on(SHARED_CONFIG.WS_EVENTS.ALERTA_UPDATE, (data) => {
        console.log('Alerta update received:', data);
        notificationService.warning(`Nueva alerta: ${data.message || 'Alerta recibida'}`, {
          duration: 5000,
          action: data.precintoId ? {
            label: 'Ver',
            onClick: () => window.location.href = `/precintos/${data.precintoId}`
          } : undefined
        });
      })
    );
    
    // Transito updates
    unsubscribers.push(
      sharedWebSocketService.on(SHARED_CONFIG.WS_EVENTS.TRANSITO_UPDATE, (data) => {
        console.log('Transito update received:', data);
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
  
  return <AppRouter />;
}

export default function App() {
  console.log('App: Rendering main application');
  
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}