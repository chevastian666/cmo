import React, { useState, Fragment } from 'react';
import { ChevronUp, ChevronDown, MapPin, Eye, Send, History, Unlink, XCircle, FileText, Edit } from 'lucide-react';
import { cn } from '../../../utils/utils';
import { PrecintoStatusBadge } from './PrecintoStatusBadge';
import { BatteryIndicator } from './BatteryIndicator';
import { SignalIndicator } from './SignalIndicator';
import { PrecintoStatus, PrecintoStatusText } from '../types';
import type { Precinto } from '../types';

interface PrecintoTableProps {
  precintos: Precinto[];
  loading: boolean;
  onViewDetail: (precinto: Precinto) => void;
  onViewMap: (precinto: Precinto) => void;
  onAssign: (precinto: Precinto) => void;
  onSendCommand: (precinto: Precinto) => void;
  onViewHistory: (precinto: Precinto) => void;
  onMarkAsBroken?: (precinto: Precinto) => void;
  onStatusChange?: (precinto: Precinto, newStatus: PrecintoStatus) => void;
}

type SortField = keyof Precinto;

export const PrecintoTable: React.FC<PrecintoTableProps> = ({
  precintos,
  loading,
  onViewDetail,
  onViewMap,
  onAssign,
  onSendCommand,
  onViewHistory,
  onMarkAsBroken,
  onStatusChange
}) => {
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newPrecintoId, setNewPrecintoId] = useState<{ [key: string]: string }>({});
  const itemsPerPage = 20;

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedPrecintos = [...precintos].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (aValue === undefined) aValue = '';
    if (bValue === undefined) bValue = '';

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const paginatedPrecintos = sortedPrecintos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.max(1, Math.ceil(sortedPrecintos.length / itemsPerPage));

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <div className="w-4 h-4" />;
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-4 w-4" /> : 
      <ChevronDown className="h-4 w-4" />;
  };

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <th 
      onClick={() => handleSort(field)}
      className="px-4 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white whitespace-nowrap"
    >
      <div className="flex items-center gap-1">
        {children}
        <SortIcon field={field} />
      </div>
    </th>
  );

  const formatLastReport = (timestamp?: string) => {
    if (!timestamp) return '-';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 365) return `${Math.floor(diffDays / 365)} años`;
    if (diffDays > 30) return `${Math.floor(diffDays / 30)} meses`;
    if (diffDays > 0) return `${diffDays} días`;
    if (diffHours > 0) return `${diffHours} horas`;
    if (diffMins > 0) return `${diffMins} minutos`;
    return 'Ahora';
  };

  const handleStatusClick = (precinto: Precinto, newStatus: PrecintoStatus) => {
    if (onStatusChange && precinto.status !== newStatus) {
      onStatusChange(precinto, newStatus);
    }
  };

  const getStatusIcon = (status: PrecintoStatus) => {
    switch (status) {
      case PrecintoStatus.LISTO:
        return '✓';
      case PrecintoStatus.ARMADO:
        return '🔒';
      case PrecintoStatus.ALARMA:
        return '⚠️';
      case PrecintoStatus.FIN_MONITOREO:
        return '✓';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="text-gray-400 mt-4">Cargando precintos...</p>
      </div>
    );
  }

  if (precintos.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-8 text-center border border-gray-700">
        <Unlink className="h-12 w-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">No se encontraron precintos</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-900/50 border-b border-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <SortableHeader field="id">Id Precinto</SortableHeader>
              <SortableHeader field="nserie">N° Serie</SortableHeader>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">
                Batería
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">
                GPS
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">
                Señal
              </th>
              <SortableHeader field="nqr">Identificador</SortableHeader>
              <SortableHeader field="telefono">Teléfono</SortableHeader>
              <SortableHeader field="ultimoReporte">Último Reporte</SortableHeader>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-400 uppercase tracking-wider">
                Acciones
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-400 uppercase tracking-wider">
                Log
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {paginatedPrecintos.map((precinto) => (
              <tr key={precinto.id} className={cn(
                "hover:bg-gray-700/50 transition-colors",
                precinto.status === PrecintoStatus.ROTO && "bg-red-900/20 hover:bg-red-900/30"
              )}>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    {[PrecintoStatus.LISTO, PrecintoStatus.ARMADO, PrecintoStatus.ALARMA, PrecintoStatus.FIN_MONITOREO].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusClick(precinto, status)}
                        className={cn(
                          "px-3 py-1.5 text-sm rounded transition-all",
                          precinto.status === status
                            ? "bg-blue-600 text-white shadow-lg"
                            : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                        )}
                        title={PrecintoStatusText[status]}
                      >
                        {getStatusIcon(status)}
                      </button>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {editingId === precinto.id ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={newPrecintoId[precinto.id] || precinto.id}
                        onChange={(e) => setNewPrecintoId({ ...newPrecintoId, [precinto.id]: e.target.value })}
                        className="w-24 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                      />
                      <button
                        onClick={() => {
                          // Handle save
                          setEditingId(null);
                        }}
                        className="text-green-400 hover:text-green-300"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setNewPrecintoId({ ...newPrecintoId, [precinto.id]: '' });
                        }}
                        className="text-red-400 hover:text-red-300"
                      >
                        ✗
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <a href={`/precinto/${precinto.id}`} className="text-blue-400 hover:text-blue-300 text-base font-medium">
                        {precinto.id}
                      </a>
                      {precinto.status === PrecintoStatus.LISTO && (
                        <>
                          <span className="px-2 py-0.5 bg-green-600 text-white text-xs rounded ml-2">Nuevo</span>
                          <button
                            onClick={() => {
                              setEditingId(precinto.id);
                              setNewPrecintoId({ ...newPrecintoId, [precinto.id]: precinto.id });
                            }}
                            className="text-gray-400 hover:text-white"
                          >
                            <Edit className="h-3 w-3" />
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 font-mono text-gray-300">
                  {precinto.nserie}
                </td>
                <td className="px-4 py-3">
                  <BatteryIndicator level={precinto.bateria || 0} size="sm" />
                </td>
                <td className="px-4 py-3 text-center">
                  <button className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded">
                    Ver
                  </button>
                </td>
                <td className="px-4 py-3">
                  <SignalIndicator strength={precinto.signal || 0} size="sm" />
                </td>
                <td className="px-4 py-3 text-gray-300">
                  {precinto.nqr || '-'}
                </td>
                <td className="px-4 py-3 text-gray-300">
                  {precinto.telefono || '-'}
                </td>
                <td className="px-4 py-3 text-gray-300">
                  {formatLastReport(precinto.ultimoReporte)}
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => onViewDetail(precinto)}
                      className="p-1 hover:bg-gray-600 rounded transition-colors"
                      title="Ver detalle"
                    >
                      <Eye className="h-4 w-4 text-gray-400" />
                    </button>
                    {precinto.gps && (
                      <button
                        onClick={() => onViewMap(precinto)}
                        className="p-1 hover:bg-gray-600 rounded transition-colors"
                        title="Ver en mapa"
                      >
                        <MapPin className="h-4 w-4 text-blue-400" />
                      </button>
                    )}
                    <button
                      onClick={() => onSendCommand(precinto)}
                      className="p-1 hover:bg-gray-600 rounded transition-colors"
                      title="Enviar comando"
                      disabled={precinto.status === PrecintoStatus.ROTO}
                    >
                      <Send className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => onViewHistory(precinto)}
                    className="p-1 hover:bg-gray-600 rounded transition-colors"
                    title="Ver historial"
                  >
                    <FileText className="h-4 w-4 text-gray-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-700 flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, sortedPrecintos.length)} de {sortedPrecintos.length} precintos
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <span className="text-sm text-gray-400">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};