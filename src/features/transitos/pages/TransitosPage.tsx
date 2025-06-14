import React, { useState, useEffect } from 'react';
import { Truck, Download, MapPin } from 'lucide-react';
import { TransitTable } from '../components/TransitTable';
import { TransitFilters } from '../components/TransitFilters';
import { TransitDetailModal } from '../components/TransitDetailModal';
import { notificationService } from '../../../services/shared/notification.service';
import { transitosService } from '../services/transitos.service';
import type { Transito } from '../types';

export const TransitosPage: React.FC = () => {
  const [transitos, setTransitos] = useState<Transito[]>([]);
  const [filteredTransitos, setFilteredTransitos] = useState<Transito[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransito, setSelectedTransito] = useState<Transito | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // Filters state
  const [filters, setFilters] = useState({
    estado: '',
    fechaDesde: '',
    fechaHasta: '',
    precinto: '',
    empresa: '',
    origen: '',
    destino: '',
    searchText: ''
  });

  // Load transitos
  useEffect(() => {
    loadTransitos();
    const interval = setInterval(loadTransitos, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Apply filters
  useEffect(() => {
    applyFilters();
  }, [transitos, filters]);

  const loadTransitos = async () => {
    try {
      const data = await transitosService.getTransitos();
      setTransitos(data);
    } catch (error) {
      console.error('Error loading transitos:', error);
      notificationService.error('Error', 'No se pudieron cargar los tránsitos');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...transitos];

    // Estado filter
    if (filters.estado) {
      filtered = filtered.filter(t => t.estado === filters.estado);
    }

    // Date range filter
    if (filters.fechaDesde) {
      const desde = new Date(filters.fechaDesde).getTime();
      filtered = filtered.filter(t => new Date(t.fechaSalida).getTime() >= desde);
    }
    if (filters.fechaHasta) {
      const hasta = new Date(filters.fechaHasta).getTime();
      filtered = filtered.filter(t => new Date(t.fechaSalida).getTime() <= hasta);
    }

    // Other filters
    if (filters.precinto) {
      filtered = filtered.filter(t => 
        t.precinto.toLowerCase().includes(filters.precinto.toLowerCase())
      );
    }
    if (filters.empresa) {
      filtered = filtered.filter(t => t.empresa === filters.empresa);
    }
    if (filters.origen) {
      filtered = filtered.filter(t => t.origen === filters.origen);
    }
    if (filters.destino) {
      filtered = filtered.filter(t => t.destino === filters.destino);
    }

    // Search text filter (searches in DUA, precinto, empresa)
    if (filters.searchText) {
      const search = filters.searchText.toLowerCase();
      filtered = filtered.filter(t => 
        t.dua.toLowerCase().includes(search) ||
        t.precinto.toLowerCase().includes(search) ||
        t.empresa.toLowerCase().includes(search)
      );
    }

    setFilteredTransitos(filtered);
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const handleViewDetail = (transito: Transito) => {
    setSelectedTransito(transito);
    setShowDetailModal(true);
  };

  const handleViewMap = (transito: Transito) => {
    // Open map in new tab or modal
    window.open(`/map/${transito.id}`, '_blank');
  };

  const handleMarkDesprecintado = async (transito: Transito) => {
    try {
      await transitosService.markDesprecintado(transito.id);
      notificationService.success('Éxito', `Tránsito ${transito.dua} marcado como desprecintado`);
      loadTransitos();
    } catch (error) {
      notificationService.error('Error', 'No se pudo actualizar el tránsito');
    }
  };

  const handleExport = () => {
    const csvContent = generateCSV(filteredTransitos);
    downloadCSV(csvContent, `transitos_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const generateCSV = (data: Transito[]) => {
    const headers = ['DUA', 'Precinto', 'Estado', 'Fecha Salida', 'ETA', 'Origen', 'Destino', 'Empresa', 'Encargado'];
    const rows = data.map(t => [
      t.dua,
      t.precinto,
      t.estado,
      new Date(t.fechaSalida).toLocaleDateString(),
      t.eta ? new Date(t.eta).toLocaleDateString() : 'N/A',
      t.origen,
      t.destino,
      t.empresa,
      t.encargado
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Truck className="h-8 w-8 text-blue-500" />
            Gestión de Tránsitos
          </h1>
          <p className="text-gray-400 mt-1">
            Monitoreo y control de todos los tránsitos activos y finalizados
          </p>
        </div>
        
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Exportar
        </button>
      </div>

      {/* Filters */}
      <TransitFilters 
        filters={filters}
        onChange={handleFilterChange}
        transitos={transitos}
      />

      {/* Table */}
      <TransitTable
        transitos={filteredTransitos}
        loading={loading}
        onViewDetail={handleViewDetail}
        onViewMap={handleViewMap}
        onMarkDesprecintado={handleMarkDesprecintado}
      />

      {/* Detail Modal */}
      {selectedTransito && (
        <TransitDetailModal
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedTransito(null);
          }}
          transito={selectedTransito}
        />
      )}
    </div>
  );
};