export interface Transito {
  id: string;
  dua: string;
  precinto: string;
  estado: 'en_viaje' | 'desprecintado' | 'con_alerta';
  fechaSalida: string;
  eta?: string;
  tiempoRestante?: number; // en minutos
  encargado: string;
  origen: string;
  destino: string;
  empresa: string;
  matricula: string;
  chofer: string;
  telefonoConductor?: string;
  ubicacionActual?: {
    lat: number;
    lng: number;
  };
  progreso: number; // 0-100
  alertas?: string[];
  observaciones?: string;
}