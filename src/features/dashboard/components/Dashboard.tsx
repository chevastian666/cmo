import React from 'react';
import { AlertTriangle, Battery, MapPin, Clock } from 'lucide-react';
import { SystemStatusCard } from './SystemStatusCard';
import { PrecintosActivosTable } from './PrecintosActivosTable';
import { TransitosPendientesTable } from '../../transitos';
import { AlertsList } from '../../alertas';
import { RealtimeIndicator } from './RealtimeIndicator';
import { 
  usePrecintosActivos, 
  useTransitosPendientes, 
  useAlertasActivas, 
  useSystemStatus 
} from '../../../store/hooks';

export const Dashboard: React.FC = () => {
  const { precintos } = usePrecintosActivos();
  const { estadisticas, smsPendientes, dbStats, apiStats, reportesPendientes } = useSystemStatus();
  const { alertas } = useAlertasActivas();
  const { transitos } = useTransitosPendientes();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Panel de Control</h2>
          <p className="text-gray-400 mt-1 text-base sm:text-lg">Sistema de Monitoreo de Precintos Electrónicos - Block Tracker</p>
        </div>
        <RealtimeIndicator />
      </div>

      <SystemStatusCard
        smsPendientes={smsPendientes}
        dbStats={dbStats}
        apiStats={apiStats}
        reportesPendientes={reportesPendientes}
      />

      <div className="">
        <TransitosPendientesTable transitos={transitos} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PrecintosActivosTable precintos={precintos} />
        </div>
        <div>
          <AlertsList />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base text-gray-400">Tiempo Promedio Tránsito</p>
              <p className="text-3xl font-semibold text-white mt-1">{estadisticas?.tiempoPromedioTransito || 0}h</p>
            </div>
            <Clock className="h-8 w-8 text-gray-600" />
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base text-gray-400">Batería Baja</p>
              <p className="text-3xl font-semibold text-white mt-1">{estadisticas?.precintosConBateriaBaja || 0}</p>
              <p className="text-sm text-gray-500 mt-1">Requieren atención</p>
            </div>
            <Battery className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base text-gray-400">Cobertura</p>
              <p className="text-3xl font-semibold text-white mt-1">98.5%</p>
              <p className="text-sm text-gray-500 mt-1">Red nacional</p>
            </div>
            <MapPin className="h-8 w-8 text-blue-500" />
          </div>
        </div>
      </div>
    </div>
  );
};