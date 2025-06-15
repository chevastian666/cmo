import { SHARED_CONFIG, getAuthHeaders, formatApiEndpoint } from '../../config/shared.config';
import type { 
  Precinto, 
  TransitoPendiente, 
  Alerta, 
  EstadisticasMonitoreo,
  Usuario 
} from '../../types';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

class SharedApiService {
  private cache = new Map<string, CacheItem<any>>();
  private pendingRequests = new Map<string, Promise<any>>();

  // Cache management
  private getCacheKey(endpoint: string, params?: any): string {
    const paramStr = params ? JSON.stringify(params) : '';
    return `${SHARED_CONFIG.CACHE_PREFIX}${endpoint}_${paramStr}`;
  }

  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > SHARED_CONFIG.CACHE_DURATION;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  private setCache<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  private clearCache(pattern?: string): void {
    if (!pattern) {
      this.cache.clear();
      return;
    }

    const keys = Array.from(this.cache.keys());
    keys.forEach(key => {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    });
  }

  // Generic request handler
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    useCache = true
  ): Promise<T> {
    const url = formatApiEndpoint(endpoint);
    const cacheKey = this.getCacheKey(endpoint, options.body);

    // Check cache first for GET requests
    if (options.method === 'GET' && useCache) {
      const cached = this.getFromCache<T>(cacheKey);
      if (cached) return cached;

      // Check if request is already pending
      const pending = this.pendingRequests.get(cacheKey);
      if (pending) return pending;
    }

    // In development/mock mode, return mock data
    if (SHARED_CONFIG.IS_DEVELOPMENT || SHARED_CONFIG.ENABLE_MOCK_DATA) {
      const mockData = await this.getMockData<T>(endpoint, options);
      if (mockData !== null) {
        // Cache mock data
        if (options.method === 'GET' && useCache) {
          this.setCache(cacheKey, mockData);
        }
        return mockData;
      }
    }

    // Create request promise
    const requestPromise = fetch(url, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers
      }
    })
      .then(async (response) => {
        if (!response.ok) {
          const error = await response.json().catch(() => ({ message: 'Request failed' }));
          throw new Error(error.message || `HTTP ${response.status}`);
        }
        return response.json();
      })
      .then((data: ApiResponse<T>) => {
        if (!data.success && data.error) {
          throw new Error(data.error);
        }
        
        const result = data.data || data as T;
        
        // Cache successful GET requests
        if (options.method === 'GET' && useCache) {
          this.setCache(cacheKey, result);
        }
        
        return result;
      })
      .catch(async (error) => {
        // In development, try mock data on error
        if (SHARED_CONFIG.IS_DEVELOPMENT) {
          const mockData = await this.getMockData<T>(endpoint, options);
          if (mockData !== null) {
            if (options.method === 'GET' && useCache) {
              this.setCache(cacheKey, mockData);
            }
            return mockData;
          }
        }
        throw error;
      })
      .finally(() => {
        this.pendingRequests.delete(cacheKey);
      });

    // Store pending request
    if (options.method === 'GET') {
      this.pendingRequests.set(cacheKey, requestPromise);
    }

    return requestPromise;
  }

  // Authentication endpoints
  async login(email: string, password: string): Promise<{ token: string; user: Usuario }> {
    // Mock authentication for development
    if (SHARED_CONFIG.IS_DEVELOPMENT || SHARED_CONFIG.ENABLE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock users
      const mockUsers: Record<string, Usuario> = {
        'sebastian.saucedo@blocktracker.uy': {
          id: 'usr-1',
          nombre: 'Sebastian Saucedo',
          email: 'sebastian.saucedo@blocktracker.uy',
          rol: 'admin',
          avatar: 'https://ui-avatars.com/api/?name=Sebastian+Saucedo&background=3b82f6&color=fff',
          activo: true
        },
        'maria.fernandez@blocktracker.uy': {
          id: 'usr-2',
          nombre: 'María Fernández',
          email: 'maria.fernandez@blocktracker.uy',
          rol: 'supervisor',
          avatar: 'https://ui-avatars.com/api/?name=Maria+Fernandez&background=8b5cf6&color=fff',
          activo: true
        },
        'juan.perez@blocktracker.uy': {
          id: 'usr-3',
          nombre: 'Juan Pérez',
          email: 'juan.perez@blocktracker.uy',
          rol: 'operador',
          avatar: 'https://ui-avatars.com/api/?name=Juan+Perez&background=10b981&color=fff',
          activo: true
        }
      };
      
      const user = mockUsers[email];
      
      if (user && password === 'password123') {
        const token = `mock-token-${Date.now()}`;
        
        // Store auth data
        localStorage.setItem(SHARED_CONFIG.AUTH_TOKEN_KEY, token);
        localStorage.setItem(SHARED_CONFIG.AUTH_USER_KEY, JSON.stringify(user));
        
        return { token, user };
      } else {
        throw new Error('Credenciales inválidas');
      }
    }
    
    try {
      const response = await this.request<{ token: string; user: Usuario }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      }, false);

      // Store auth data
      localStorage.setItem(SHARED_CONFIG.AUTH_TOKEN_KEY, response.token);
      localStorage.setItem(SHARED_CONFIG.AUTH_USER_KEY, JSON.stringify(response.user));

      return response;
    } catch (error) {
      // If API fails in development, try mock login
      if (SHARED_CONFIG.IS_DEVELOPMENT) {
        return this.login(email, password);
      }
      throw error;
    }
  }

  async logout(): Promise<void> {
    if (SHARED_CONFIG.IS_DEVELOPMENT || SHARED_CONFIG.ENABLE_MOCK_DATA) {
      // Mock logout
      localStorage.removeItem(SHARED_CONFIG.AUTH_TOKEN_KEY);
      localStorage.removeItem(SHARED_CONFIG.AUTH_USER_KEY);
      this.clearCache();
      return;
    }
    
    try {
      await this.request('/auth/logout', { method: 'POST' }, false);
    } finally {
      localStorage.removeItem(SHARED_CONFIG.AUTH_TOKEN_KEY);
      localStorage.removeItem(SHARED_CONFIG.AUTH_USER_KEY);
      this.clearCache();
    }
  }

  async getCurrentUser(): Promise<Usuario | null> {
    const stored = localStorage.getItem(SHARED_CONFIG.AUTH_USER_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }

    // In development, return null if no stored user
    if (SHARED_CONFIG.IS_DEVELOPMENT || SHARED_CONFIG.ENABLE_MOCK_DATA) {
      return null;
    }

    try {
      const user = await this.request<Usuario>('/auth/me');
      localStorage.setItem(SHARED_CONFIG.AUTH_USER_KEY, JSON.stringify(user));
      return user;
    } catch {
      return null;
    }
  }

  // Transit endpoints (shared between panels)
  async getTransitosPendientes(): Promise<TransitoPendiente[]> {
    return this.request<TransitoPendiente[]>('/transitos/pendientes');
  }

  async getTransito(id: string): Promise<TransitoPendiente> {
    return this.request<TransitoPendiente>(`/transitos/${id}`);
  }

  async updateTransito(id: string, data: Partial<TransitoPendiente>): Promise<TransitoPendiente> {
    const result = await this.request<TransitoPendiente>(`/transitos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    this.clearCache('transitos');
    return result;
  }

  async precintarTransito(transitoId: string, precintoData: any): Promise<Precinto> {
    const result = await this.request<Precinto>(`/transitos/${transitoId}/precintar`, {
      method: 'POST',
      body: JSON.stringify(precintoData)
    });
    this.clearCache('transitos');
    this.clearCache('precintos');
    return result;
  }

  async addObservacion(transitoId: string, observacion: string): Promise<void> {
    await this.request(`/transitos/${transitoId}/observaciones`, {
      method: 'POST',
      body: JSON.stringify({ observacion })
    });
    this.clearCache(`transitos/${transitoId}`);
  }

  // Precinto endpoints
  async getPrecintosActivos(): Promise<Precinto[]> {
    return this.request<Precinto[]>('/precintos/activos');
  }

  async getPrecinto(id: string): Promise<Precinto> {
    return this.request<Precinto>(`/precintos/${id}`);
  }

  async updatePrecinto(id: string, data: Partial<Precinto>): Promise<Precinto> {
    const result = await this.request<Precinto>(`/precintos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    this.clearCache('precintos');
    return result;
  }

  async finalizarPrecinto(id: string, motivo: string): Promise<void> {
    await this.request(`/precintos/${id}/finalizar`, {
      method: 'POST',
      body: JSON.stringify({ motivo })
    });
    this.clearCache('precintos');
  }

  // Alert endpoints
  async getAlertas(filtros?: any): Promise<Alerta[]> {
    const params = new URLSearchParams(filtros).toString();
    const endpoint = params ? `/alertas?${params}` : '/alertas';
    return this.request<Alerta[]>(endpoint);
  }

  async getAlertasActivas(): Promise<Alerta[]> {
    return this.request<Alerta[]>('/alertas/activas');
  }

  async atenderAlerta(id: string): Promise<void> {
    await this.request(`/alertas/${id}/atender`, {
      method: 'POST'
    });
    this.clearCache('alertas');
  }

  async asignarAlerta(alertaId: string, usuarioId: string, notas?: string): Promise<void> {
    await this.request(`/alertas/${alertaId}/asignar`, {
      method: 'POST',
      body: JSON.stringify({ usuarioId, notas })
    });
    this.clearCache('alertas');
  }

  async comentarAlerta(alertaId: string, mensaje: string): Promise<void> {
    await this.request(`/alertas/${alertaId}/comentarios`, {
      method: 'POST',
      body: JSON.stringify({ mensaje })
    });
  }

  async resolverAlerta(
    alertaId: string, 
    tipo: string, 
    descripcion: string, 
    acciones?: string[]
  ): Promise<void> {
    await this.request(`/alertas/${alertaId}/resolver`, {
      method: 'POST',
      body: JSON.stringify({ tipo, descripcion, acciones })
    });
    this.clearCache('alertas');
  }

  // Statistics endpoints
  async getEstadisticas(): Promise<EstadisticasMonitoreo> {
    return this.request<EstadisticasMonitoreo>('/estadisticas');
  }

  async getEstadisticasTransitos(periodo?: string): Promise<any> {
    const params = periodo ? `?periodo=${periodo}` : '';
    return this.request(`/estadisticas/transitos${params}`);
  }

  async getEstadisticasAlertas(periodo?: string): Promise<any> {
    const params = periodo ? `?periodo=${periodo}` : '';
    return this.request(`/estadisticas/alertas${params}`);
  }

  // Vehicle endpoints (for encargados)
  async getVehiculosEnRuta(): Promise<any[]> {
    return this.request('/vehiculos/en-ruta');
  }

  async buscarVehiculo(criterio: string): Promise<any[]> {
    return this.request(`/vehiculos/buscar?q=${encodeURIComponent(criterio)}`);
  }

  // Stock endpoints (for encargados)
  async getStock(): Promise<any> {
    return this.request('/stock');
  }

  async updateStock(location: string, cantidad: number): Promise<void> {
    await this.request('/stock', {
      method: 'PUT',
      body: JSON.stringify({ location, cantidad })
    });
    this.clearCache('stock');
  }

  // CMO messaging endpoints
  async getCMOMessages(unreadOnly = false): Promise<any[]> {
    const params = unreadOnly ? '?unread=true' : '';
    return this.request(`/cmo/messages${params}`);
  }

  async markMessageAsRead(messageId: string): Promise<void> {
    await this.request(`/cmo/messages/${messageId}/read`, {
      method: 'POST'
    });
  }

  async respondToMessage(messageId: string, response: string): Promise<void> {
    await this.request(`/cmo/messages/${messageId}/respond`, {
      method: 'POST',
      body: JSON.stringify({ response })
    });
  }

  // System status endpoints
  async getSystemStatus(): Promise<any> {
    return this.request('/system/status');
  }

  async getSystemHealth(): Promise<any> {
    return this.request('/system/health', {}, false);
  }

  // Export endpoints
  async exportData(
    type: 'transitos' | 'precintos' | 'alertas',
    format: 'csv' | 'xlsx' | 'pdf',
    filtros?: any
  ): Promise<Blob> {
    const params = new URLSearchParams({ format, ...filtros }).toString();
    const response = await fetch(
      formatApiEndpoint(`/export/${type}?${params}`),
      {
        headers: getAuthHeaders()
      }
    );

    if (!response.ok) {
      throw new Error('Export failed');
    }

    return response.blob();
  }

  // Real-time subscription management
  subscribeToUpdates(eventType: string, callback: (data: any) => void): () => void {
    // This will be handled by the WebSocket service
    // Return unsubscribe function
    return () => {};
  }

  // Mock data generator
  private async getMockData<T>(endpoint: string, options: RequestInit): Promise<T | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200));

    // Generate mock data based on endpoint
    if (endpoint.includes('/transitos/pendientes')) {
      const { generateMockTransitos } = await import('../../utils/mockData');
      return generateMockTransitos() as T;
    }
    
    if (endpoint.includes('/precintos/activos')) {
      const { generateMockPrecintos } = await import('../../utils/mockData');
      return generateMockPrecintos() as T;
    }
    
    if (endpoint.includes('/alertas/activas')) {
      const { generateMockAlertas } = await import('../../utils/mockData');
      return generateMockAlertas().filter(a => !a.atendida) as T;
    }
    
    if (endpoint.includes('/alertas')) {
      const { generateMockAlertas } = await import('../../utils/mockData');
      return generateMockAlertas() as T;
    }
    
    if (endpoint.includes('/estadisticas')) {
      const mockStats: EstadisticasMonitoreo = {
        precintosActivos: 127,
        alertasActivas: 3,
        transitosEnCurso: 45,
        tiempoPromedioTransito: 4.5,
        lecturasPorHora: 850,
        alertasPorHora: 12,
        precintosConBateriaBaja: 8
      };
      return mockStats as T;
    }
    
    if (endpoint.includes('/system/status') || endpoint.includes('/system/health')) {
      return {
        smsPendientes: Math.floor(Math.random() * 200),
        dbStats: {
          memoriaUsada: 60 + Math.random() * 30,
          discoUsado: 40 + Math.random() * 20
        },
        apiStats: {
          memoriaUsada: 50 + Math.random() * 40,
          discoUsado: 20 + Math.random() * 30
        },
        reportesPendientes: Math.floor(Math.random() * 30),
        estadisticas: {
          precintosActivos: 127,
          alertasActivas: 3,
          transitosEnCurso: 45,
          tiempoPromedioTransito: 4.5,
          lecturasPorHora: 850,
          alertasPorHora: 12,
          precintosConBateriaBaja: 8
        }
      } as T;
    }

    // For POST/PUT/DELETE, just return success
    if (options.method !== 'GET') {
      return {} as T;
    }

    return null;
  }

  // Utility methods
  clearAllCache(): void {
    this.clearCache();
  }

  refreshToken(): Promise<void> {
    if (SHARED_CONFIG.IS_DEVELOPMENT || SHARED_CONFIG.ENABLE_MOCK_DATA) {
      return Promise.resolve();
    }
    return this.request('/auth/refresh', { method: 'POST' }, false);
  }
}

// Export singleton instance
export const sharedApiService = new SharedApiService();