import React from 'react';
import { cn } from '../../utils/utils';
import { Card } from './Card';
import { StatusBadge } from './StatusBadge';
import { InfoRow } from './InfoRow';

export interface TransitInfo {
  id: string;
  origin: string;
  destination: string;
  status: 'in-transit' | 'arrived' | 'delayed' | 'stopped' | 'completed';
  progress?: number;
  startTime: Date | string;
  estimatedArrival?: Date | string;
  actualArrival?: Date | string;
  vehicle?: {
    type: string;
    plate: string;
    driver?: string;
  };
  cargo?: {
    description: string;
    weight?: number;
    units?: number;
  };
  metadata?: Record<string, any>;
}

interface TransitCardProps {
  transit: TransitInfo;
  className?: string;
  onClick?: (transit: TransitInfo) => void;
  variant?: 'default' | 'compact' | 'detailed';
  showProgress?: boolean;
}

export const TransitCard: React.FC<TransitCardProps> = ({
  transit,
  className,
  onClick,
  variant = 'default',
  showProgress = true
}) => {
  const getStatusVariant = (status: TransitInfo['status']): 'success' | 'warning' | 'danger' | 'info' | 'default' => {
    const variants = {
      'in-transit': 'info' as const,
      'arrived': 'success' as const,
      'delayed': 'warning' as const,
      'stopped': 'danger' as const,
      'completed': 'default' as const
    };
    return variants[status];
  };

  const getStatusText = (status: TransitInfo['status']) => {
    const texts = {
      'in-transit': 'En Tránsito',
      'arrived': 'Arribado',
      'delayed': 'Demorado',
      'stopped': 'Detenido',
      'completed': 'Completado'
    };
    return texts[status];
  };

  const formatDate = (date: Date | string) => {
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateTimeRemaining = () => {
    if (!transit.estimatedArrival || transit.status === 'arrived' || transit.status === 'completed') {
      return null;
    }
    
    const now = new Date();
    const arrival = transit.estimatedArrival instanceof Date 
      ? transit.estimatedArrival 
      : new Date(transit.estimatedArrival);
    
    const diff = arrival.getTime() - now.getTime();
    if (diff < 0) return 'Demorado';
    
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    
    if (hours > 0) return `${hours}h ${minutes}min`;
    return `${minutes}min`;
  };

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:shadow-lg',
        onClick && 'hover:border-blue-500',
        className
      )}
      onClick={() => onClick?.(transit)}
      variant="elevated"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-100 mb-1">
            {transit.origin} → {transit.destination}
          </h3>
          <p className="text-sm text-gray-400">ID: {transit.id}</p>
        </div>
        <StatusBadge
          variant={getStatusVariant(transit.status)}
          size="md"
        >
          {getStatusText(transit.status)}
        </StatusBadge>
      </div>

      {/* Progress Bar */}
      {showProgress && transit.progress !== undefined && variant !== 'compact' && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Progreso</span>
            <span>{transit.progress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className={cn(
                'h-2 rounded-full transition-all',
                transit.status === 'delayed' ? 'bg-yellow-500' :
                transit.status === 'stopped' ? 'bg-red-500' :
                'bg-blue-500'
              )}
              style={{ width: `${transit.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Info Rows */}
      <div className="space-y-2">
        <InfoRow label="Inicio" value={formatDate(transit.startTime)} />
        
        {transit.estimatedArrival && (
          <InfoRow 
            label="Llegada Estimada" 
            value={formatDate(transit.estimatedArrival)}
            extra={calculateTimeRemaining()}
          />
        )}
        
        {transit.actualArrival && (
          <InfoRow 
            label="Llegada Real" 
            value={formatDate(transit.actualArrival)}
            variant="highlight"
          />
        )}

        {variant === 'detailed' && (
          <>
            {transit.vehicle && (
              <>
                <InfoRow label="Vehículo" value={`${transit.vehicle.type} - ${transit.vehicle.plate}`} />
                {transit.vehicle.driver && (
                  <InfoRow label="Conductor" value={transit.vehicle.driver} />
                )}
              </>
            )}
            
            {transit.cargo && (
              <>
                <InfoRow label="Carga" value={transit.cargo.description} />
                {transit.cargo.weight && (
                  <InfoRow label="Peso" value={`${transit.cargo.weight} kg`} />
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* Footer Actions */}
      {variant !== 'compact' && (
        <div className="mt-4 pt-4 border-t border-gray-700 flex items-center justify-between">
          <button className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Ver Ruta
          </button>
          
          <button className="text-sm text-gray-400 hover:text-gray-300">
            Más detalles
          </button>
        </div>
      )}
    </Card>
  );
};