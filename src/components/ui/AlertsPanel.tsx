import React from 'react';
import { cn } from '../../utils/utils';
import { StatusBadge } from './StatusBadge';
import { EmptyState } from './EmptyState';

export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export interface Alert {
  id: string;
  title: string;
  description?: string;
  severity: AlertSeverity;
  timestamp: Date | string;
  source?: string;
  status?: 'active' | 'acknowledged' | 'resolved';
  metadata?: Record<string, any>;
}

interface AlertsPanelProps {
  alerts: Alert[];
  className?: string;
  maxHeight?: string;
  onAlertClick?: (alert: Alert) => void;
  showHeader?: boolean;
  title?: string;
  emptyMessage?: string;
  variant?: 'default' | 'compact';
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({
  alerts,
  className,
  maxHeight = '400px',
  onAlertClick,
  showHeader = true,
  title = 'Alertas Activas',
  emptyMessage = 'No hay alertas activas',
  variant = 'default'
}) => {
  const getSeverityColor = (severity: AlertSeverity) => {
    const colors = {
      critical: 'border-red-500 bg-red-500/10',
      high: 'border-orange-500 bg-orange-500/10',
      medium: 'border-yellow-500 bg-yellow-500/10',
      low: 'border-blue-500 bg-blue-500/10',
      info: 'border-gray-500 bg-gray-500/10'
    };
    return colors[severity];
  };

  const getSeverityBadgeVariant = (severity: AlertSeverity): 'danger' | 'warning' | 'info' | 'default' => {
    const variants = {
      critical: 'danger' as const,
      high: 'danger' as const,
      medium: 'warning' as const,
      low: 'info' as const,
      info: 'default' as const
    };
    return variants[severity];
  };

  const formatTimestamp = (timestamp: Date | string) => {
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'Hace un momento';
    if (diff < 3600000) return `Hace ${Math.floor(diff / 60000)} min`;
    if (diff < 86400000) return `Hace ${Math.floor(diff / 3600000)} horas`;
    return date.toLocaleDateString();
  };

  return (
    <div className={cn('bg-gray-800 rounded-lg', className)}>
      {showHeader && (
        <div className="px-4 py-3 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-gray-100 flex items-center justify-between">
            {title}
            {alerts.length > 0 && (
              <span className="text-sm font-normal text-gray-400">
                {alerts.length} {alerts.length === 1 ? 'alerta' : 'alertas'}
              </span>
            )}
          </h3>
        </div>
      )}
      
      <div 
        className="overflow-y-auto"
        style={{ maxHeight }}
      >
        {alerts.length === 0 ? (
          <EmptyState
            message={emptyMessage}
            icon="alert"
            className="py-8"
          />
        ) : (
          <div className={cn(
            'divide-y divide-gray-700',
            variant === 'compact' ? 'space-y-0' : 'space-y-1 p-2'
          )}>
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={cn(
                  'transition-all cursor-pointer',
                  'hover:bg-gray-700/50',
                  variant === 'default' && 'rounded-lg border-l-4 p-3',
                  variant === 'compact' && 'px-4 py-2',
                  getSeverityColor(alert.severity)
                )}
                onClick={() => onAlertClick?.(alert)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={cn(
                        'font-medium text-gray-100 truncate',
                        variant === 'compact' && 'text-sm'
                      )}>
                        {alert.title}
                      </h4>
                      <StatusBadge
                        variant={getSeverityBadgeVariant(alert.severity)}
                        size="sm"
                      >
                        {alert.severity.toUpperCase()}
                      </StatusBadge>
                    </div>
                    
                    {alert.description && variant === 'default' && (
                      <p className="text-sm text-gray-400 line-clamp-2">
                        {alert.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-gray-500">
                        {formatTimestamp(alert.timestamp)}
                      </span>
                      {alert.source && (
                        <span className="text-xs text-gray-500">
                          {alert.source}
                        </span>
                      )}
                      {alert.status && alert.status !== 'active' && (
                        <StatusBadge variant="default" size="xs">
                          {alert.status === 'acknowledged' ? 'Reconocida' : 'Resuelta'}
                        </StatusBadge>
                      )}
                    </div>
                  </div>
                  
                  {variant === 'default' && (
                    <svg 
                      className="w-5 h-5 text-gray-400 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M9 5l7 7-7 7" 
                      />
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};