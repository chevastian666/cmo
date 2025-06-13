export interface Precinto {
  id: string;
  codigo: string;
  numeroViaje: string;
  mov: number;
  tipo: 'RFID' | 'GPS' | 'HYBRID';
  estado: 'SAL' | 'LLE' | 'FMF' | 'CFM' | 'CNP';
  fechaActivacion: number;
  fechaUltimaLectura: number;
  ubicacionActual: {
    lat: number;
    lng: number;
    direccion?: string;
  };
  contenedor?: {
    numero: string;
    tipo: string;
    destino: string;
  };
  ruta?: {
    origen: string;
    destino: string;
    aduanaOrigen?: string;
    aduanaDestino?: string;
  };
  bateria: number;
  temperatura?: number;
  humedad?: number;
  gps: {
    activo: boolean;
    señal: number; // 0-100
  };
  eslinga: {
    estado: 'cerrada' | 'abierta' | 'violada';
    ultimoCambio: number;
  };
}

export interface EventoPrecinto {
  id: string;
  precintoId: string;
  tipo: 'activacion' | 'lectura' | 'alerta' | 'desactivacion' | 'violacion';
  timestamp: number;
  ubicacion: {
    lat: number;
    lng: number;
  };
  detalles: string;
  severidad: 'info' | 'warning' | 'critical';
}

export interface EstadisticasMonitoreo {
  precintosActivos: number;
  precintosEnTransito: number;
  precintosViolados: number;
  alertasActivas: number;
  lecturasPorHora: number;
  tiempoPromedioTransito: number;
  tasaExito: number;
  precintosConBateriaBaja: number;
  smsPendientes: number;
  dbStats: {
    memoriaUsada: number;
    discoUsado: number;
  };
  apiStats: {
    memoriaUsada: number;
    discoUsado: number;
  };
  reportesPendientes: number;
}

export interface Alerta {
  id: string;
  tipo: 'violacion' | 'bateria_baja' | 'fuera_de_ruta' | 'sin_signal' | 'temperatura' | 'intrusion';
  precintoId: string;
  codigoPrecinto: string;
  mensaje: string;
  timestamp: number;
  ubicacion?: {
    lat: number;
    lng: number;
  };
  severidad: 'baja' | 'media' | 'alta' | 'critica';
  atendida: boolean;
}

export interface PuntoControl {
  id: string;
  nombre: string;
  tipo: 'aduana' | 'puerto' | 'deposito' | 'checkpoint';
  ubicacion: {
    lat: number;
    lng: number;
  };
  precintosActivos: number;
  ultimaActividad: number;
}

export interface TransitoPendiente {
  id: string;
  numeroViaje: string;
  mov: string;
  dua: string;
  tipoCarga: string;
  matricula: string;
  origen: string;
  destino: string;
  despachante: string;
  fechaIngreso: number;
  estado: 'pendiente' | 'en_proceso' | 'precintado';
}