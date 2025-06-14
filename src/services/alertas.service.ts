import axios from 'axios';
import type { Alerta } from '../types/monitoring';
import { API_CONFIG } from '../config';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface AlertaFilters {
  activa?: boolean;
  tipo?: string;
  severidad?: string;
  atendida?: boolean;
  precintoId?: string;
  desde?: number;
  hasta?: number;
}

export const alertasService = {
  getAll: async (filters?: AlertaFilters): Promise<Alerta[]> => {
    const { data } = await api.get('/alertas', { params: filters });
    return data;
  },

  getActivas: async (): Promise<Alerta[]> => {
    const { data } = await api.get('/alertas/activas');
    return data;
  },

  getById: async (id: string): Promise<Alerta> => {
    const { data } = await api.get(`/alertas/${id}`);
    return data;
  },

  atender: async (id: string, observaciones?: string): Promise<void> => {
    await api.patch(`/alertas/${id}/atender`, { observaciones });
  },

  crear: async (alerta: Omit<Alerta, 'id' | 'timestamp'>): Promise<Alerta> => {
    const { data } = await api.post('/alertas', alerta);
    return data;
  },

  getEstadisticas: async (horas = 24): Promise<Array<{ timestamp: number; cantidad: number; tipo: string }>> => {
    const { data } = await api.get(`/alertas/estadisticas`, {
      params: { horas }
    });
    return data;
  },
};