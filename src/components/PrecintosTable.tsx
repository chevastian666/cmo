import React from 'react';
import { formatTime24h } from '../lib/utils';
import type { Precinto } from '../types/monitoring';
import { Battery, MapPin, Radio, Lock, LockOpen, ShieldAlert } from 'lucide-react';
import { cn } from '../lib/utils';

interface PrecintosTableProps {
  precintos: Precinto[];
}

export const PrecintosTable: React.FC<PrecintosTableProps> = ({ precintos }) => {
  const getEstadoColor = (estado: Precinto['estado']) => {
    switch (estado) {
      case 'SAL':
        return 'text-blue-400 bg-blue-900/20';
      case 'LLE':
        return 'text-green-400 bg-green-900/20';
      case 'FMF':
        return 'text-yellow-400 bg-yellow-900/20';
      case 'CFM':
        return 'text-purple-400 bg-purple-900/20';
      case 'CNP':
        return 'text-red-400 bg-red-900/20';
    }
  };


  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-white">Precintos Activos</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Viaje
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                MOV
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Ubicación
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Batería
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Sensores
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Última Lectura
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {precintos.map((precinto) => (
              <tr key={precinto.id} className="hover:bg-gray-750">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-white">{precinto.numeroViaje}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-cyan-400">{precinto.mov}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={cn(
                    "inline-flex px-2 py-1 text-xs font-medium rounded-full",
                    getEstadoColor(precinto.estado)
                  )}>
                    {precinto.estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-300">
                    <MapPin className="h-4 w-4 mr-1" />
                    {precinto.ubicacionActual.direccion || 
                     `${precinto.ubicacionActual.lat.toFixed(4)}, ${precinto.ubicacionActual.lng.toFixed(4)}`}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Battery className={cn(
                      "h-4 w-4 mr-1",
                      precinto.bateria < 20 ? "text-red-400" : 
                      precinto.bateria < 50 ? "text-yellow-400" : "text-green-400"
                    )} />
                    <span className="text-sm text-gray-300">{precinto.bateria}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="flex items-center">
                      <Radio className={cn(
                        "h-4 w-4 mr-1",
                        precinto.gps.activo ? "text-green-400" : "text-gray-500"
                      )} />
                      <span className={cn(
                        precinto.gps.activo ? "text-gray-300" : "text-gray-500"
                      )}>
                        GPS {precinto.gps.activo ? `${precinto.gps.señal}%` : 'OFF'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      {precinto.eslinga.estado === 'cerrada' && (
                        <>
                          <Lock className="h-4 w-4 mr-1 text-green-400" />
                          <span className="text-green-400">Cerrada</span>
                        </>
                      )}
                      {precinto.eslinga.estado === 'abierta' && (
                        <>
                          <LockOpen className="h-4 w-4 mr-1 text-yellow-400" />
                          <span className="text-yellow-400">Abierta</span>
                        </>
                      )}
                      {precinto.eslinga.estado === 'violada' && (
                        <>
                          <ShieldAlert className="h-4 w-4 mr-1 text-red-400" />
                          <span className="text-red-400">Violada</span>
                        </>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {formatTime24h(precinto.fechaUltimaLectura)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};