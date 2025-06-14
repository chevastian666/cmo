import React from 'react';
import { 
  X, 
  Truck, 
  User, 
  MapPin, 
  Clock, 
  Package, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Battery,
  Wifi,
  Navigation
} from 'lucide-react';
import { 
  Card,
  CardHeader,
  CardContent,
  StatusBadge,
  InfoRow,
  InfoGrid,
  InfoSection,
  Badge,
  BadgeGroup,
  AlertsPanel
} from '../../../components/ui';
import { cn } from '../../../utils/utils';
import type { TransitoTorreControl, EstadoSemaforo } from '../types';

interface TransitoDetailModalProps {
  transito: TransitoTorreControl;
  isOpen: boolean;
  onClose: () => void;
}

export const TransitoDetailModal: React.FC<TransitoDetailModalProps> = ({
  transito,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const getSemaforoIcon = (semaforo: EstadoSemaforo) => {
    switch (semaforo) {
      case 'verde':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'amarillo':
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      case 'rojo':
        return <XCircle className="h-6 w-6 text-red-500" />;
    }
  };

  const getSemaforoLabel = (semaforo: EstadoSemaforo) => {
    switch (semaforo) {
      case 'verde':
        return 'Sin problemas';
      case 'amarillo':
        return 'Advertencia';
      case 'rojo':
        return 'Problemas detectados';
    }
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('es-UY', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateDuration = () => {
    const duration = transito.eta.getTime() - transito.fechaSalida.getTime();
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const alerts = transito.alertas?.map((alerta, index) => ({
    id: `alert-${index}`,
    title: `Alerta #${index + 1}`,
    message: alerta,
    severity: 'alta' as const,
    timestamp: Date.now() / 1000
  })) || [];

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-75 z-40"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <Card variant="elevated" className="max-w-3xl w-full max-h-[90vh] overflow-hidden bg-gray-900">
          {/* Header */}
          <CardHeader className="border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Truck className="h-6 w-6 text-blue-500" />
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Tránsito {transito.pvid}
                  </h2>
                  <p className="text-sm text-gray-400">
                    {transito.matricula}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getSemaforoIcon(transito.semaforo)}
                  <span className={cn(
                    "text-sm font-medium",
                    transito.semaforo === 'verde' ? "text-green-400" :
                    transito.semaforo === 'amarillo' ? "text-yellow-400" : "text-red-400"
                  )}>
                    {getSemaforoLabel(transito.semaforo)}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </CardHeader>

          {/* Content */}
          <CardContent className="overflow-y-auto max-h-[calc(90vh-100px)]">
            <div className="space-y-6">
              {/* Información del Viaje */}
              <InfoSection title="Información del Viaje">
                <InfoGrid>
                  <InfoRow 
                    label="Origen" 
                    value={transito.origen}
                    icon={<MapPin className="h-4 w-4" />}
                  />
                  <InfoRow 
                    label="Destino" 
                    value={transito.destino}
                    icon={<MapPin className="h-4 w-4" />}
                  />
                  <InfoRow 
                    label="Hora de Salida" 
                    value={formatDateTime(transito.fechaSalida)}
                    icon={<Clock className="h-4 w-4" />}
                  />
                  <InfoRow 
                    label="ETA" 
                    value={formatDateTime(transito.eta)}
                    icon={<Clock className="h-4 w-4" />}
                  />
                  <InfoRow 
                    label="Duración Estimada" 
                    value={calculateDuration()}
                  />
                  <InfoRow 
                    label="Progreso" 
                    value={`${transito.progreso}%`}
                  />
                </InfoGrid>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div
                      className={cn(
                        "h-3 rounded-full transition-all",
                        transito.semaforo === 'verde' ? "bg-green-500" :
                        transito.semaforo === 'amarillo' ? "bg-yellow-500" : "bg-red-500"
                      )}
                      style={{ width: `${transito.progreso}%` }}
                    />
                  </div>
                </div>
              </InfoSection>

              {/* Información del Chofer */}
              <InfoSection title="Información del Chofer">
                <InfoGrid>
                  <InfoRow 
                    label="Nombre" 
                    value={transito.chofer}
                    icon={<User className="h-4 w-4" />}
                  />
                  <InfoRow 
                    label="CI" 
                    value={transito.choferCI}
                    copyable
                  />
                </InfoGrid>
              </InfoSection>

              {/* Información del Precinto */}
              <InfoSection title="Información del Precinto">
                <InfoGrid>
                  <InfoRow 
                    label="Código" 
                    value={transito.precinto || 'No asignado'}
                    icon={<Package className="h-4 w-4" />}
                    valueClassName={!transito.precinto ? 'text-red-400' : ''}
                  />
                  <InfoRow 
                    label="Eslinga Larga" 
                    value={transito.eslinga_larga ? 'Colocada' : 'No colocada'}
                    valueClassName={transito.eslinga_larga ? 'text-green-400' : 'text-red-400'}
                  />
                  <InfoRow 
                    label="Eslinga Corta" 
                    value={transito.eslinga_corta ? 'Colocada' : 'No colocada'}
                    valueClassName={transito.eslinga_corta ? 'text-green-400' : 'text-red-400'}
                  />
                </InfoGrid>
              </InfoSection>

              {/* Ubicación Actual */}
              {transito.ubicacionActual && (
                <InfoSection title="Ubicación Actual">
                  <InfoGrid>
                    <InfoRow 
                      label="Coordenadas" 
                      value={`${transito.ubicacionActual.lat.toFixed(6)}, ${transito.ubicacionActual.lng.toFixed(6)}`}
                      icon={<Navigation className="h-4 w-4" />}
                      copyable
                    />
                  </InfoGrid>
                </InfoSection>
              )}

              {/* Observaciones */}
              {transito.observaciones && (
                <InfoSection title="Observaciones">
                  <p className="text-gray-300">{transito.observaciones}</p>
                </InfoSection>
              )}

              {/* Alertas */}
              {alerts.length > 0 && (
                <InfoSection title="Alertas Activas">
                  <AlertsPanel 
                    alerts={alerts}
                    variant="compact"
                  />
                </InfoSection>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};