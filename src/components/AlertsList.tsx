import React from 'react';
import { AlertCircle, AlertTriangle, Info, X, Shield, Battery, MapPin, Thermometer, Radio, Package } from 'lucide-react';
import type { Alerta } from '../types/monitoring';
import { cn } from '../lib/utils';
import { formatTimestamp } from '../lib/utils';

interface AlertsListProps {
  alerts: Alerta[];
  onDismiss: (id: string) => void;
}

export const AlertsList: React.FC<AlertsListProps> = ({ alerts, onDismiss }) => {
  const getIcon = (tipo: Alerta['tipo']) => {
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
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getStyles = (severidad: Alerta['severidad']) => {
    switch (severidad) {
      case 'critica':
        return 'bg-red-900/20 border-red-800 text-red-400';
      case 'alta':
        return 'bg-orange-900/20 border-orange-800 text-orange-400';
      case 'media':
        return 'bg-yellow-900/20 border-yellow-800 text-yellow-400';
      case 'baja':
        return 'bg-blue-900/20 border-blue-800 text-blue-400';
    }
  };

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={cn(
            'rounded-lg border p-4 flex items-start space-x-3',
            getStyles(alert.severidad)
          )}
        >
          <div className="flex-shrink-0">{getIcon(alert.tipo)}</div>
          <div className="flex-1">
            <h4 className="font-medium">Precinto {alert.codigoPrecinto}</h4>
            <p className="text-sm mt-1 opacity-90">{alert.mensaje}</p>
            <p className="text-xs mt-2 opacity-70">
              {formatTimestamp(alert.timestamp)}
            </p>
          </div>
          <button
            onClick={() => onDismiss(alert.id)}
            className="flex-shrink-0 p-1 hover:bg-white/10 rounded"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
};