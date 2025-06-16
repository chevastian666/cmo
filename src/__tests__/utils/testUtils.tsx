import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

// Create a new QueryClient for each test to ensure isolation
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: 0,
      staleTime: 0,
    },
  },
});

interface AllTheProvidersProps {
  children: React.ReactNode;
}

const AllTheProviders: React.FC<AllTheProvidersProps> = ({ children }) => {
  const queryClient = createTestQueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { customRender as render };

// Test data factories
export const createMockPrecinto = (overrides = {}) => ({
  id: 'test-precinto-1',
  codigo: 'BT20240001',
  estado: 'armado',
  bateria: 85,
  ubicacionActual: {
    lat: -34.9011,
    lng: -56.1645,
    direccion: 'Montevideo, Uruguay'
  },
  ...overrides
});

export const createMockTransito = (overrides = {}) => ({
  id: 'test-transito-1',
  numeroTransito: 'TRANS-2024-0001',
  origen: 'Montevideo',
  destino: 'Buenos Aires',
  estado: 'en_proceso',
  progreso: 45,
  ...overrides
});

export const createMockAlerta = (overrides = {}) => ({
  id: 'test-alerta-1',
  tipo: 'BBJ',
  mensaje: 'Batería baja',
  severidad: 'alta',
  timestamp: Date.now(),
  ...overrides
});