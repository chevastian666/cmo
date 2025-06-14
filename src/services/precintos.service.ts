import axios from 'axios';
import type { Precinto, EventoPrecinto } from '../types/monitoring';
import { API_CONFIG } from '../config';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface PrecintoFilters {
  estado?: string;
  tipo?: string;
  bateriaBaja?: boolean;
  page?: number;
  limit?: number;
}

export const precintosService = {
  getAll: async (filters?: PrecintoFilters): Promise<Precinto[]> => {
    const { data } = await api.get('/precintos', { params: filters });
    return data;
  },

  getById: async (id: string): Promise<Precinto> => {
    const { data } = await api.get(`/precintos/${id}`);
    return data;
  },

  getActivos: async (): Promise<Precinto[]> => {
    const { data } = await api.get('/precintos/activos');
    return data;
  },

  getEventos: async (precintoId: string, limit = 50): Promise<EventoPrecinto[]> => {
    const { data } = await api.get(`/precintos/${precintoId}/eventos`, { 
      params: { limit } 
    });
    return data;
  },

  activar: async (precintoData: Partial<Precinto>): Promise<Precinto> => {
    const { data } = await api.post('/precintos/activar', precintoData);
    return data;
  },

  desactivar: async (id: string, motivo?: string): Promise<void> => {
    await api.post(`/precintos/${id}/desactivar`, { motivo });
  },

  actualizarUbicacion: async (id: string, lat: number, lng: number): Promise<void> => {
    await api.patch(`/precintos/${id}/ubicacion`, { lat, lng });
  },
};