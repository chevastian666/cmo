import React from 'react';
import { Link2, Battery, MapPin, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../../utils/utils';

interface PrecintoActivo {
  id: string;
  nserie: string;
  nqr: string;
  estado: 'armado' | 'alarma';
  bateria?: number;
  destino?: string;
  viaje?: string;
  movimiento?: string;
  ultimoReporte?: string;
  transitoId?: string;
}

interface PrecintosActivosTableProps {
  precintos?: PrecintoActivo[];
}

export const PrecintosActivosTable: React.FC<PrecintosActivosTableProps> = ({ precintos = [] }) => {
  // Generate mock data if no precintos provided
  const mockPrecintos: PrecintoActivo[] = precintos.length > 0 ? precintos : [
    {
      id: '1',
      nserie: 'BT123456',
      nqr: 'AB123',
      estado: 'armado',
      bateria: 85,
      destino: 'Montecon',
      viaje: 'MVD-BA-001',
      movimiento: 'Exportación',
      ultimoReporte: '5 minutos',
      transitoId: 'TR-00001'
    },
    {
      id: '2',
      nserie: 'BT123457',
      nqr: 'CD456',
      estado: 'alarma',
      bateria: 45,
      destino: 'TCP',
      viaje: 'MVD-SP-015',
      movimiento: 'Importación',
      ultimoReporte: '2 horas',
      transitoId: 'TR-00002'
    },
    {
      id: '3',
      nserie: 'BT123458',
      nqr: 'EF789',
      estado: 'armado',
      bateria: 92,
      destino: 'Zonamerica',
      viaje: 'MVD-RJ-023',
      movimiento: 'Tránsito',
      ultimoReporte: '15 minutos',
      transitoId: 'TR-00003'
    },
    {
      id: '4',
      nserie: 'BT123459',
      nqr: 'GH012',
      estado: 'armado',
      bateria: 15,
      destino: 'Puerto Nueva Palmira',
      viaje: 'MVD-ASU-007',
      movimiento: 'Exportación',
      ultimoReporte: '1 hora',
      transitoId: 'TR-00004'
    },
    {
      id: '5',
      nserie: 'BT123460',
      nqr: 'IJ345',
      estado: 'alarma',
      bateria: 70,
      destino: 'Rilcomar',
      viaje: 'MVD-BA-009',
      movimiento: 'Importación',
      ultimoReporte: '30 minutos',
      transitoId: 'TR-00005'
    }
  ];

  const getBatteryColor = (level?: number) => {
    if (!level) return 'text-gray-500';
    if (level >= 60) return 'text-green-500';
    if (level >= 30) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700">
      <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white">Precintos Activos</h3>
        <Link 
          to="/precintos" 
          className="text-base text-blue-400 hover:text-blue-300"
        >
          Ver todos →
        </Link>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-900/50 border-b border-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">
                Precinto
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">
                Viaje / Movimiento
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">
                Batería
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">
                Destino
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">
                Último Reporte
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {mockPrecintos.map((precinto) => (
              <tr key={precinto.id} className="hover:bg-gray-700/50 transition-colors">
                <td className="px-4 py-3">
                  <div>
                    <div className="text-base font-medium text-white">{precinto.nserie}</div>
                    <div className="text-sm text-gray-400">NQR: {precinto.nqr}</div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div>
                    <div className="text-base font-medium text-blue-400">{precinto.viaje}</div>
                    <div className="text-sm text-gray-400">{precinto.movimiento}</div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className={cn(
                    "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-sm font-medium",
                    precinto.estado === 'armado' 
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-red-500/20 text-red-400"
                  )}>
                    {precinto.estado === 'armado' ? (
                      <Link2 className="h-3 w-3" />
                    ) : (
                      <AlertTriangle className="h-3 w-3 animate-pulse" />
                    )}
                    {precinto.estado === 'armado' ? 'Armado' : 'Alarma'}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {precinto.bateria && (
                    <div className="flex items-center gap-1">
                      <Battery className={cn("h-4 w-4", getBatteryColor(precinto.bateria))} />
                      <span className={cn("text-base", getBatteryColor(precinto.bateria))}>
                        {precinto.bateria}%
                      </span>
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-base text-gray-300">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    {precinto.destino}
                  </div>
                </td>
                <td className="px-4 py-3 text-base text-gray-400">
                  {precinto.ultimoReporte}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {mockPrecintos.length === 0 && (
        <div className="px-6 py-8 text-center">
          <p className="text-lg text-gray-400">No hay precintos activos en este momento</p>
        </div>
      )}
    </div>
  );
};