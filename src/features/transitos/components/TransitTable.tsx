import React, { useState, Fragment } from 'react';
import { ChevronUp, ChevronDown, Map, Unlock, Eye, AlertTriangle, Clock, CheckCircle, Truck } from 'lucide-react';
import { cn } from '../../../utils/utils';
import { TransitStatus } from './TransitStatus';
import type { Transito } from '../types';

interface TransitTableProps {
  transitos: Transito[];
  loading: boolean;
  onViewDetail: (transito: Transito) => void;
  onViewMap: (transito: Transito) => void;
  onMarkDesprecintado: (transito: Transito) => void;
}

type SortField = 'dua' | 'precinto' | 'estado' | 'fechaSalida' | 'eta' | 'origen' | 'destino' | 'empresa';

export const TransitTable: React.FC<TransitTableProps> = ({
  transitos,
  loading,
  onViewDetail,
  onViewMap,
  onMarkDesprecintado
}) => {
  const [sortField, setSortField] = useState<SortField>('fechaSalida');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedTransitos = [...transitos].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (sortField === 'fechaSalida' || sortField === 'eta') {
      aValue = new Date(aValue || '').getTime();
      bValue = new Date(bValue || '').getTime();
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const paginatedTransitos = sortedTransitos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.max(1, Math.ceil(sortedTransitos.length / itemsPerPage));

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <div className="w-4 h-4" />;
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-4 w-4" /> : 
      <ChevronDown className="h-4 w-4" />;
  };

  const getTimeRemaining = (eta?: string) => {
    if (!eta) return null;
    const now = new Date().getTime();
    const etaTime = new Date(eta).getTime();
    const diff = etaTime - now;
    
    if (diff < 0) return { text: 'Retrasado', color: 'text-red-400' };
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return { text: `${days}d ${hours % 24}h`, color: 'text-green-400' };
    } else if (hours > 12) {
      return { text: `${hours}h`, color: 'text-green-400' };
    } else if (hours > 3) {
      return { text: `${hours}h`, color: 'text-yellow-400' };
    } else {
      return { text: `${hours}h`, color: 'text-red-400' };
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="text-gray-400 mt-4">Cargando tránsitos...</p>
      </div>
    );
  }

  if (transitos.length === 0 && !loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-8 text-center border border-gray-700">
        <Truck className="h-12 w-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">No se encontraron tránsitos</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-900/50 border-b border-gray-700">
            <tr>
              <th 
                onClick={() => handleSort('dua')}
                className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
              >
                <div className="flex items-center gap-1">
                  DUA
                  <SortIcon field="dua" />
                </div>
              </th>
              <th 
                onClick={() => handleSort('precinto')}
                className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
              >
                <div className="flex items-center gap-1">
                  Precinto
                  <SortIcon field="precinto" />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Viaje/MOV
              </th>
              <th 
                onClick={() => handleSort('estado')}
                className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
              >
                <div className="flex items-center gap-1">
                  Estado
                  <SortIcon field="estado" />
                </div>
              </th>
              <th 
                onClick={() => handleSort('fechaSalida')}
                className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
              >
                <div className="flex items-center gap-1">
                  Fecha Salida
                  <SortIcon field="fechaSalida" />
                </div>
              </th>
              <th 
                onClick={() => handleSort('eta')}
                className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
              >
                <div className="flex items-center gap-1">
                  Fecha llegada
                  <SortIcon field="eta" />
                </div>
              </th>
              <th 
                onClick={() => handleSort('origen')}
                className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
              >
                <div className="flex items-center gap-1">
                  Origen
                  <SortIcon field="origen" />
                </div>
              </th>
              <th 
                onClick={() => handleSort('destino')}
                className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
              >
                <div className="flex items-center gap-1">
                  Destino
                  <SortIcon field="destino" />
                </div>
              </th>
              <th 
                onClick={() => handleSort('empresa')}
                className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
              >
                <div className="flex items-center gap-1">
                  Despachante
                  <SortIcon field="empresa" />
                </div>
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {paginatedTransitos.map((transito) => {
              const timeRemaining = getTimeRemaining(transito.eta);
              return (
                <tr key={transito.id} className="hover:bg-gray-700/50 transition-colors">
                  <td className="px-4 py-3 text-sm text-white font-medium">
                    {transito.dua}
                  </td>
                  <td className="px-4 py-3 text-sm text-white font-mono">
                    {transito.precinto}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-blue-400">
                        {transito.viaje || '-'}
                      </span>
                      <span className="text-xs text-gray-400">
                        MOV {transito.mov || '-'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <TransitStatus estado={transito.estado} />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {new Date(transito.fechaSalida).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {transito.eta ? new Date(transito.eta).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {transito.origen}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {transito.destino}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {transito.empresa}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onViewDetail(transito)}
                        className="p-1 hover:bg-gray-600 rounded transition-colors"
                        title="Ver detalle"
                      >
                        <Eye className="h-4 w-4 text-gray-400" />
                      </button>
                      <button
                        onClick={() => onViewMap(transito)}
                        className="p-1 hover:bg-gray-600 rounded transition-colors"
                        title="Ver en mapa"
                      >
                        <Map className="h-4 w-4 text-blue-400" />
                      </button>
                      {transito.estado === 'en_viaje' && (
                        <button
                          onClick={() => onMarkDesprecintado(transito)}
                          className="p-1 hover:bg-gray-600 rounded transition-colors"
                          title="Marcar como desprecintado"
                        >
                          <Unlock className="h-4 w-4 text-green-400" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 border-t border-gray-700 flex items-center justify-between">
        <div className="text-sm text-gray-400">
          Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, transitos.length)} de {transitos.length} tránsitos
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-700 text-white rounded text-sm hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => 
                page === 1 || 
                page === totalPages || 
                Math.abs(page - currentPage) <= 1
              )
              .map((page, index, array) => (
                <Fragment key={page}>
                  {index > 0 && array[index - 1] !== page - 1 && (
                    <span className="px-2 py-1 text-gray-500">...</span>
                  )}
                  <button
                    onClick={() => setCurrentPage(page)}
                    className={cn(
                      "px-3 py-1 rounded text-sm",
                      page === currentPage
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-white hover:bg-gray-600"
                    )}
                  >
                    {page}
                  </button>
                </Fragment>
              ))}
          </div>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-700 text-white rounded text-sm hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};