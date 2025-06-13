import React from 'react';
import { Shield, Package, AlertTriangle, Battery, MapPin, Activity, Radio, Clock, MessageSquare, Database, Server, FileText } from 'lucide-react';
import { SystemStatusCard } from '../components/SystemStatusCard';
import { PrecintosTable } from '../components/PrecintosTable';
import { TransitosPendientesTable } from '../components/TransitosPendientesTable';
import { AlertsList } from '../components/AlertsList';
import { 
  usePrecintos, 
  useEstadisticas, 
  useAlertas, 
  useAtenderAlerta,
  useTransitosPendientes
} from '../hooks/useMonitoring';
import { formatNumber } from '../lib/utils';

export const Dashboard: React.FC = () => {
  const { data: precintos = [] } = usePrecintos({ estado: 'activo' });
  const { data: estadisticas } = useEstadisticas();
  const { data: alertas = [] } = useAlertas(true);
  const { data: transitosPendientes = [] } = useTransitosPendientes();
  const atenderAlerta = useAtenderAlerta();

  const handleDismissAlert = (id: string) => {
    atenderAlerta.mutate(id);
  };

  // Datos mock para desarrollo
  const mockStats = {
    precintosActivos: 1247,
    precintosEnTransito: 892,
    precintosViolados: 3,
    alertasActivas: 8,
    lecturasPorHora: 3456,
    tiempoPromedioTransito: 48.5,
    tasaExito: 99.7,
    precintosConBateriaBaja: 23,
    smsPendientes: 127,
    dbStats: {
      memoriaUsada: 73.4,
      discoUsado: 45.2
    },
    apiStats: {
      memoriaUsada: 67.8,
      discoUsado: 23.1
    },
    reportesPendientes: 15
  };

  const mockTransitos = Array.from({ length: 12 }, (_, i) => ({
    id: `tr-${i}`,
    numeroViaje: String(1000000 + Math.floor(Math.random() * 8999999)),
    mov: `MOV${String(1000 + i).padStart(6, '0')}`,
    dua: `${24}/${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`,
    tipoCarga: ['Contenedor', 'Carga Suelta', 'Granel', 'Refrigerado'][Math.floor(Math.random() * 4)],
    matricula: ['UY', 'AR', 'BR'][Math.floor(Math.random() * 3)] + '-' + String(Math.floor(Math.random() * 9999)).padStart(4, '0'),
    origen: ['Montevideo', 'Fray Bentos', 'Colonia', 'Rivera', 'Chuy'][Math.floor(Math.random() * 5)],
    destino: ['Buenos Aires', 'Asunción', 'São Paulo', 'Porto Alegre', 'Santiago'][Math.floor(Math.random() * 5)],
    despachante: ['Despachante Silva', 'Aduanas Express', 'LogiTrade SA', 'Comercio Exterior SRL'][Math.floor(Math.random() * 4)],
    fechaIngreso: Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 7200),
    estado: i < 8 ? 'pendiente' : 'en_proceso' as 'pendiente' | 'en_proceso'
  }));

  const mockPrecintos = Array.from({ length: 10 }, (_, i) => {
    const estado = ['SAL', 'LLE', 'FMF', 'CFM', 'CNP'][Math.floor(Math.random() * 5)] as 'SAL' | 'LLE' | 'FMF' | 'CFM' | 'CNP';
    return {
      id: `pr-${i}`,
      codigo: `BT${String(2024000 + i).padStart(8, '0')}`,
      numeroViaje: String(1000000 + Math.floor(Math.random() * 8999999)),
      mov: Math.floor(Math.random() * 999) + 1,
      tipo: ['GPS', 'RFID', 'HYBRID'][Math.floor(Math.random() * 3)] as 'GPS' | 'RFID' | 'HYBRID',
      estado: estado,
      fechaActivacion: Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 86400 * 7),
      fechaUltimaLectura: Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 3600),
      ubicacionActual: {
        lat: -34.9011 + (Math.random() - 0.5) * 0.1,
        lng: -56.1645 + (Math.random() - 0.5) * 0.1,
        direccion: ['Puerto de Montevideo', 'Aduana Carrasco', 'Ruta 1 Km 45', 'Deposito Fiscal Zona Franca'][Math.floor(Math.random() * 4)]
      },
      contenedor: {
        numero: `MSKU${Math.floor(Math.random() * 9000000 + 1000000)}`,
        tipo: '40HC',
        destino: ['Buenos Aires', 'Asunción', 'São Paulo'][Math.floor(Math.random() * 3)]
      },
      bateria: Math.floor(Math.random() * 80 + 20),
      temperatura: Math.floor(Math.random() * 10 + 18),
      humedad: Math.floor(Math.random() * 30 + 40),
      gps: {
        activo: Math.random() > 0.1,
        señal: Math.floor(Math.random() * 30 + 70)
      },
      eslinga: {
        estado: i === 2 || estado === 'CNP' ? 'violada' : Math.random() > 0.9 ? 'abierta' : 'cerrada' as 'cerrada' | 'abierta' | 'violada',
        ultimoCambio: Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 3600)
      }
    };
  });

  const mockAlertas = [
    {
      id: '1',
      tipo: 'violacion' as const,
      precintoId: 'pr-2',
      codigoPrecinto: 'BT20240002',
      mensaje: 'Intento de violación detectado en contenedor MSKU7234561',
      timestamp: Math.floor(Date.now() / 1000) - 300,
      ubicacion: { lat: -34.9011, lng: -56.1645 },
      severidad: 'critica' as const,
      atendida: false
    },
    {
      id: '2',
      tipo: 'bateria_baja' as const,
      precintoId: 'pr-5',
      codigoPrecinto: 'BT20240045',
      mensaje: 'Batería al 15% - Requiere reemplazo urgente',
      timestamp: Math.floor(Date.now() / 1000) - 1800,
      severidad: 'alta' as const,
      atendida: false
    },
    {
      id: '3',
      tipo: 'fuera_de_ruta' as const,
      precintoId: 'pr-7',
      codigoPrecinto: 'BT20240067',
      mensaje: 'Desvío detectado de ruta autorizada - 5km fuera del corredor',
      timestamp: Math.floor(Date.now() / 1000) - 3600,
      ubicacion: { lat: -34.8511, lng: -56.1045 },
      severidad: 'media' as const,
      atendida: false
    }
  ];

  const stats = estadisticas || mockStats;
  const precintosActivos = precintos.length > 0 ? precintos : mockPrecintos;
  const alertasActivas = alertas.length > 0 ? alertas : mockAlertas;
  const transitosActivos = transitosPendientes.length > 0 ? transitosPendientes : mockTransitos;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Panel de Control</h2>
        <p className="text-gray-400 mt-1">Sistema de Monitoreo de Precintos Electrónicos - Block Tracker</p>
      </div>

      <SystemStatusCard
        smsPendientes={stats.smsPendientes}
        dbStats={stats.dbStats}
        apiStats={stats.apiStats}
        reportesPendientes={stats.reportesPendientes}
      />

      <div className="">
        <TransitosPendientesTable transitos={transitosActivos} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PrecintosTable precintos={precintosActivos} />
        </div>
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Alarmas</h3>
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
          </div>
          <AlertsList alerts={alertasActivas} onDismiss={handleDismissAlert} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Tiempo Promedio Tránsito</p>
              <p className="text-2xl font-semibold text-white mt-1">{stats.tiempoPromedioTransito}h</p>
            </div>
            <Clock className="h-8 w-8 text-gray-600" />
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Batería Baja</p>
              <p className="text-2xl font-semibold text-white mt-1">{stats.precintosConBateriaBaja}</p>
              <p className="text-xs text-gray-500 mt-1">Requieren atención</p>
            </div>
            <Battery className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Cobertura</p>
              <p className="text-2xl font-semibold text-white mt-1">98.5%</p>
              <p className="text-xs text-gray-500 mt-1">Red nacional</p>
            </div>
            <MapPin className="h-8 w-8 text-blue-500" />
          </div>
        </div>
      </div>
    </div>
  );
};