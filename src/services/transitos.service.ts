import axios from 'axios';
import type { TransitoPendiente } from '../types/monitoring';
import { API_CONFIG } from '../config';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface TransitoFilters {
  estado?: 'pendiente' | 'en_proceso' | 'precintado';
  despachante?: string;
  origen?: string;
  destino?: string;
  desde?: number;
  hasta?: number;
}

export const transitosService = {
  getPendientes: async (filters?: TransitoFilters): Promise<TransitoPendiente[]> => {
    const { data } = await api.get('/transitos/pendientes', { params: filters });
    return data;
  },

  getAll: async (filters?: TransitoFilters): Promise<TransitoPendiente[]> => {
    const { data } = await api.get('/transitos', { params: filters });
    return data;
  },

  getById: async (id: string): Promise<TransitoPendiente> => {
    const { data } = await api.get(`/transitos/${id}`);
    return data;
  },

  actualizarEstado: async (id: string, estado: TransitoPendiente['estado']): Promise<void> => {
    await api.patch(`/transitos/${id}/estado`, { estado });
  },

  precintar: async (transitoId: string, precintoId: string): Promise<void> => {
    await api.post(`/transitos/${transitoId}/precintar`, { precintoId });
  },

  getEstadisticas: async (): Promise<{
    pendientes: number;
    enProceso: number;
    precintados: number;
    tiempoPromedio: number;
  }> => {
    const { data } = await api.get('/transitos/estadisticas');
    return data;
  },
};