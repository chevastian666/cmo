import type { StateCreator } from 'zustand';
import type { PrecintosStore } from '../types';
import { precintosService } from '../../services';
import { generateMockPrecinto, generateMockPrecintoActivo } from '../../utils/mockData';

export const createPrecintosSlice: StateCreator<PrecintosStore> = (set, get) => ({
  // State
  precintos: [],
  precintosActivos: [],
  loading: false,
  error: null,
  lastUpdate: null,

  // Actions
  setPrecintos: (precintos) => set({ precintos, lastUpdate: Date.now() }),
  
  setPrecintosActivos: (precintosActivos) => set({ precintosActivos, lastUpdate: Date.now() }),
  
  updatePrecinto: (id, data) => set((state) => ({
    precintos: state.precintos.map(p => p.id === id ? { ...p, ...data } : p),
    precintosActivos: state.precintosActivos.map(p => p.id === id ? { ...p, ...data } : p),
  })),
  
  removePrecinto: (id) => set((state) => ({
    precintos: state.precintos.filter(p => p.id !== id),
    precintosActivos: state.precintosActivos.filter(p => p.id !== id),
  })),
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
  
  fetchPrecintos: async () => {
    const { setLoading, setError, setPrecintos } = get();
    setLoading(true);
    setError(null);
    
    try {
      const data = await precintosService.getAll();
      setPrecintos(data);
    } catch (error) {
      // En desarrollo, usar datos mock
      const mockData = Array.from({ length: 20 }, (_, i) => generateMockPrecinto(i));
      setPrecintos(mockData);
      console.warn('Using mock data for precintos:', error);
    } finally {
      setLoading(false);
    }
  },
  
  fetchPrecintosActivos: async () => {
    const { setLoading, setError, setPrecintosActivos } = get();
    setLoading(true);
    setError(null);
    
    try {
      console.log('fetchPrecintosActivos - llamando servicio...');
      const data = await precintosService.getActivos();
      console.log('fetchPrecintosActivos - data del servicio:', data);
      setPrecintosActivos(data);
    } catch (error) {
      // En desarrollo, usar datos mock
      console.log('fetchPrecintosActivos - error, usando mock data');
      const mockData = Array.from({ length: 10 }, (_, i) => generateMockPrecintoActivo(i));
      console.log('fetchPrecintosActivos - mock data generada:', mockData);
      setPrecintosActivos(mockData);
      console.warn('Using mock data for precintos activos:', error);
    } finally {
      setLoading(false);
    }
  },
});