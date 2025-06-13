import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { monitoringApi } from '../services/api';

export const usePrecintos = (filtros?: { estado?: string; tipo?: string }) => {
  return useQuery({
    queryKey: ['precintos', filtros],
    queryFn: () => monitoringApi.getPrecintos(filtros),
    refetchInterval: 5000,
  });
};

export const useEstadisticas = () => {
  return useQuery({
    queryKey: ['estadisticas'],
    queryFn: monitoringApi.getEstadisticas,
    refetchInterval: 3000,
  });
};

export const useAlertas = (activas = true) => {
  return useQuery({
    queryKey: ['alertas', activas],
    queryFn: () => monitoringApi.getAlertas(activas),
    refetchInterval: 5000,
  });
};

export const useAtenderAlerta = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: monitoringApi.atenderAlerta,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alertas'] });
      queryClient.invalidateQueries({ queryKey: ['estadisticas'] });
    },
  });
};

export const useEventos = (precintoId?: string) => {
  return useQuery({
    queryKey: ['eventos', precintoId],
    queryFn: () => monitoringApi.getEventos(precintoId),
    refetchInterval: 10000,
  });
};

export const usePuntosControl = () => {
  return useQuery({
    queryKey: ['puntosControl'],
    queryFn: monitoringApi.getPuntosControl,
    refetchInterval: 30000,
  });
};

export const useHistoricoLecturas = (horas = 24) => {
  return useQuery({
    queryKey: ['historicoLecturas', horas],
    queryFn: () => monitoringApi.getHistoricoLecturas(horas),
    refetchInterval: 60000,
  });
};

export const useHistoricoAlertas = (horas = 24) => {
  return useQuery({
    queryKey: ['historicoAlertas', horas],
    queryFn: () => monitoringApi.getHistoricoAlertas(horas),
    refetchInterval: 60000,
  });
};

export const useTransitosPendientes = () => {
  return useQuery({
    queryKey: ['transitosPendientes'],
    queryFn: monitoringApi.getTransitosPendientes,
    refetchInterval: 30000,
  });
};