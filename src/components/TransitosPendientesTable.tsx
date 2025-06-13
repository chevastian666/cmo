import React from 'react';
import { formatTimeAgo } from '../lib/utils';
import type { TransitoPendiente } from '../types/monitoring';
import { cn } from '../lib/utils';
import { Clock, Truck } from 'lucide-react';

interface TransitosPendientesTableProps {
  transitos: TransitoPendiente[];
}

export const TransitosPendientesTable: React.FC<TransitosPendientesTableProps> = ({ transitos }) => {
  const getTiempoColor = (timestamp: number) => {
    const now = Math.floor(Date.now() / 1000);
    const diff = now - timestamp;
    
    if (diff < 3600) { // Menos de 1 hora
      return 'text-green-400';
    } else if (diff < 7200) { // Menos de 2 horas
      return 'text-yellow-400';
    } else if (diff < 14400) { // Menos de 4 horas
      return 'text-orange-400';
    } else { // Más de 4 horas
      return 'text-red-400';
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center">
          <Truck className="h-5 w-5 text-blue-500 mr-2" />
          <h3 className="text-lg font-semibold text-white">Tránsitos Pendientes en LUCIA</h3>
        </div>
        <div className="flex items-center text-sm text-gray-400">
          <Clock className="h-4 w-4 mr-1" />
          {transitos.length} pendientes de precintar
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                N° de Viaje
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                MOV
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                DUA
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Tipo de Carga
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Matrícula
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Origen
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Destino
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Despachante
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Tiempo Pendiente
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {transitos.map((transito) => (
              <tr key={transito.id} className="hover:bg-gray-750">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-white">{transito.numeroViaje}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-cyan-400">{transito.mov}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {transito.dua}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {transito.tipoCarga}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-300">{transito.matricula}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {transito.origen}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {transito.destino}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {transito.despachante}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-gray-500" />
                    <span className={cn(
                      "text-sm font-medium",
                      getTiempoColor(transito.fechaIngreso)
                    )}>
                      {formatTimeAgo(transito.fechaIngreso)}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};