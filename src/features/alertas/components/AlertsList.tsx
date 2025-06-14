import React, { useState } from 'react';
import { AlertTriangle, Shield, Battery, MapPin, Radio, Thermometer, Package, Clock, User, MessageSquare, CheckCircle, Unlock, Navigation, BatteryLow, LogOut, WifiOff, Satellite } from 'lucide-react';
import { cn } from '../../../utils/utils';
import { formatTimeAgo } from '../../../utils/formatters';
import type { Alerta } from '../../../types';
import { useAlertasActivas, useAlertaExtendida } from '../../../store/hooks/useAlertas';
import { AlertaDetalleModal } from './AlertaDetalleModal';

// Alarm codes mapping
interface AlarmCode {
  code: string;
  tipo: string;
  descripcion: string;
  prioridad: 'alta' | 'media';
  icon: React.ReactNode;
}

const ALARM_CODES: Record<string, AlarmCode> = {
  PTN: {
    code: 'PTN',
    tipo: 'precinto_abierto',
    descripcion: 'Precinto abierto sin autorización',
    prioridad: 'alta',
    icon: <Unlock className="h-5 w-5" />
  },
  DTN: {
    code: 'DTN',
    tipo: 'detencion_no_autorizada',
    descripcion: 'Transporte detenido en zona no autorizada',
    prioridad: 'media',
    icon: <Navigation className="h-5 w-5" />
  },
  BBJ: {
    code: 'BBJ',
    tipo: 'bateria_baja',
    descripcion: 'Precinto con batería baja',
    prioridad: 'alta',
    icon: <BatteryLow className="h-5 w-5" />
  },
  SNA: {
    code: 'SNA',
    tipo: 'salida_no_autorizada',
    descripcion: 'Tránsito salió sin autorización',
    prioridad: 'alta',
    icon: <LogOut className="h-5 w-5" />
  },
  AAR: {
    code: 'AAR',
    tipo: 'atraso_reportes',
    descripcion: 'Precinto con atraso de reportes',
    prioridad: 'media',
    icon: <Clock className="h-5 w-5" />
  },
  NPN: {
    code: 'NPN',
    tipo: 'sin_signal',
    descripcion: 'Precinto sin señal',
    prioridad: 'alta',
    icon: <WifiOff className="h-5 w-5" />
  },
  NPG: {
    code: 'NPG',
    tipo: 'sin_gps',
    descripcion: 'Precinto sin GPS',
    prioridad: 'alta',
    icon: <Satellite className="h-5 w-5" />
  }
};

export const AlertsList: React.FC = () => {
  const { alertas, loading, error, actions } = useAlertasActivas();
  const [selectedAlertaId, setSelectedAlertaId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAlertClick = (alertaId: string) => {
    setSelectedAlertaId(alertaId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAlertaId(null);
  };

  const getAlarmByTipo = (tipo: string): AlarmCode | null => {
    return Object.values(ALARM_CODES).find(alarm => alarm.tipo === tipo) || null;
  };

  const getIcon = (tipo: string) => {
    const alarm = getAlarmByTipo(tipo);
    if (alarm) return alarm.icon;
    
    // Legacy support
    switch (tipo) {
      case 'violacion':
        return <Shield className="h-5 w-5" />;
      case 'bateria_baja':
        return <Battery className="h-5 w-5" />;
      case 'fuera_de_ruta':
        return <MapPin className="h-5 w-5" />;
      case 'temperatura':
        return <Thermometer className="h-5 w-5" />;
      case 'sin_signal':
        return <Radio className="h-5 w-5" />;
      case 'intrusion':
        return <Package className="h-5 w-5" />;
      default:
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const getSeveridadColor = (severidad: string) => {
    switch (severidad) {
      case 'critica':
        return 'text-red-400 bg-red-900/20 border-red-800';
      case 'alta':
        return 'text-orange-400 bg-orange-900/20 border-orange-800';
      case 'media':
        return 'text-yellow-400 bg-yellow-900/20 border-yellow-800';
      case 'baja':
        return 'text-blue-400 bg-blue-900/20 border-blue-800';
      default:
        return 'text-gray-400 bg-gray-900/20 border-gray-800';
    }
  };

  const getAlarmCode = (tipo: string): string => {
    const entry = Object.entries(ALARM_CODES).find(([_, alarm]) => alarm.tipo === tipo);
    return entry ? entry[0] : tipo.toUpperCase().substring(0, 3);
  };

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="animate-pulse space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-700 h-20 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
        <p className="text-red-400">Error cargando alertas: {error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-800 rounded-lg">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Alarmas Activas</h2>
            <span className="text-sm text-gray-400">{alertas.length} alarmas</span>
          </div>
        </div>
        
        <div className="divide-y divide-gray-700 max-h-[600px] overflow-y-auto">
          {alertas.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <AlertTriangle className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No hay alarmas activas</p>
            </div>
          ) : (
            alertas.map((alerta) => (
              <div
                key={alerta.id}
                onClick={() => handleAlertClick(alerta.id)}
                className={cn(
                  'p-4 hover:bg-gray-700/50 cursor-pointer transition-colors',
                  'border-l-4',
                  getSeveridadColor(alerta.severidad)
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={cn('p-2 rounded-lg', getSeveridadColor(alerta.severidad))}>
                      {getIcon(alerta.tipo)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-white bg-gray-700 px-2 py-1 rounded">
                          {getAlarmCode(alerta.tipo)}
                        </span>
                        <p className="font-medium text-white">{alerta.codigoPrecinto}</p>
                        <span className={cn(
                          'px-2 py-0.5 rounded-full text-xs font-medium',
                          getSeveridadColor(alerta.severidad)
                        )}>
                          {alerta.severidad === 'alta' || alerta.severidad === 'critica' ? 'ALTA' : 'MEDIA'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 mt-1">
                        {getAlarmByTipo(alerta.tipo)?.descripcion || alerta.mensaje}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-xs text-gray-400 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTimeAgo(alerta.timestamp)}
                        </span>
                        {alerta.ubicacion && (
                          <span className="text-xs text-gray-400 flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {alerta.ubicacion.lat.toFixed(4)}, {alerta.ubicacion.lng.toFixed(4)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    {alerta.atendida && (
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Alert Detail Modal */}
      {selectedAlertaId && (
        <AlertDetailModalWrapper
          alertaId={selectedAlertaId}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </>
  );
};

// Wrapper component to handle the extended alert data
const AlertDetailModalWrapper: React.FC<{
  alertaId: string;
  isOpen: boolean;
  onClose: () => void;
}> = ({ alertaId, isOpen, onClose }) => {
  const { alerta, loading, actions } = useAlertaExtendida(alertaId);

  if (!alerta || loading) {
    return null;
  }

  return (
    <AlertaDetalleModal
      alerta={alerta}
      isOpen={isOpen}
      onClose={onClose}
      onAsignar={actions.asignar}
      onComentar={actions.comentar}
      onResolver={actions.resolver}
    />
  );
};