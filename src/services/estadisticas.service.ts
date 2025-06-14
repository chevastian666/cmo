import axios from 'axios';
import type { EstadisticasMonitoreo } from '../types/monitoring';
import { API_CONFIG } from '../config';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface EstadisticasFilters {
  desde?: number;
  hasta?: number;
  intervalo?: 'hora' | 'dia' | 'semana' | 'mes';
}

export const estadisticasService = {
  getGenerales: async (): Promise<EstadisticasMonitoreo> => {
    const { data } = await api.get('/estadisticas');
    return data;
  },

  getHistoricoLecturas: async (horas = 24): Promise<Array<{ timestamp: number; cantidad: number }>> => {
    const { data } = await api.get('/estadisticas/lecturas', {
      params: { horas }
    });
    return data;
  },

  getHistoricoAlertas: async (horas = 24): Promise<Array<{ timestamp: number; cantidad: number; tipo: string }>> => {
    const { data } = await api.get('/estadisticas/alertas', {
      params: { horas }
    });
    return data;
  },

  getRendimiento: async (filters?: EstadisticasFilters): Promise<{
    tasaExito: number;
    tiempoPromedioTransito: number;
    lecturasPromedioPorHora: number;
    alertasPromedioPorDia: number;
  }> => {
    const { data } = await api.get('/estadisticas/rendimiento', { params: filters });
    return data;
  },

  getEstadoSistema: async (): Promise<{
    smsPendientes: number;
    dbStats: {
      memoriaUsada: number;
      discoUsado: number;
      conexionesActivas: number;
    };
    apiStats: {
      memoriaUsada: number;
      discoUsado: number;
      solicitudesPorMinuto: number;
    };
    reportesPendientes: number;
  }> => {
    const { data } = await api.get('/estadisticas/sistema');
    return data;
  },
};