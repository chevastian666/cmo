import React from 'react';
import { cn } from '@/utils/utils';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Info,
  Shield,
  Package,
  Truck
} from 'lucide-react';

export type StatusType = 'success' | 'error' | 'warning' | 'info' | 'pending' | 'default';
export type StatusVariant = 'badge' | 'pill' | 'icon-only' | 'compact';
export type StatusSize = 'xs' | 'sm' | 'md' | 'lg';

interface StatusIndicatorProps {
  status: string;
  type?: StatusType;
  variant?: StatusVariant;
  size?: StatusSize;
  icon?: React.ReactNode;
  label?: string;
  className?: string;
  showIcon?: boolean;
  showLabel?: boolean;
}

const statusConfig: Record<string, { type: StatusType; icon: React.ReactNode; label?: string }> = {
  // Precinto states
  'armado': { type: 'success', icon: <Shield className="h-4 w-4" />, label: 'Armado' },
  'alarma': { type: 'error', icon: <AlertTriangle className="h-4 w-4" />, label: 'Alarma' },
  'inactivo': { type: 'default', icon: <XCircle className="h-4 w-4" />, label: 'Inactivo' },
  
  // Transit states
  'pendiente': { type: 'pending', icon: <Clock className="h-4 w-4" />, label: 'Pendiente' },
  'en_proceso': { type: 'info', icon: <Truck className="h-4 w-4" />, label: 'En Proceso' },
  'completado': { type: 'success', icon: <CheckCircle className="h-4 w-4" />, label: 'Completado' },
  'cancelado': { type: 'error', icon: <XCircle className="h-4 w-4" />, label: 'Cancelado' },
  
  // Alert states
  'alta': { type: 'error', icon: <AlertTriangle className="h-4 w-4" />, label: 'Alta' },
  'media': { type: 'warning', icon: <AlertTriangle className="h-4 w-4" />, label: 'Media' },
  'baja': { type: 'info', icon: <Info className="h-4 w-4" />, label: 'Baja' },
  
  // Generic states
  'activo': { type: 'success', icon: <CheckCircle className="h-4 w-4" />, label: 'Activo' },
  'error': { type: 'error', icon: <XCircle className="h-4 w-4" />, label: 'Error' },
  'warning': { type: 'warning', icon: <AlertTriangle className="h-4 w-4" />, label: 'Advertencia' },
};

const typeStyles: Record<StatusType, string> = {
  success: 'bg-green-500/20 text-green-400 border-green-500/30',
  error: 'bg-red-500/20 text-red-400 border-red-500/30',
  warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  info: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  pending: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  default: 'bg-gray-700/50 text-gray-300 border-gray-600',
};

const sizeStyles: Record<StatusSize, { base: string; icon: string }> = {
  xs: { base: 'text-xs px-1.5 py-0.5', icon: 'h-3 w-3' },
  sm: { base: 'text-sm px-2 py-1', icon: 'h-3.5 w-3.5' },
  md: { base: 'text-base px-2.5 py-1.5', icon: 'h-4 w-4' },
  lg: { base: 'text-lg px-3 py-2', icon: 'h-5 w-5' },
};

const variantStyles: Record<StatusVariant, string> = {
  badge: 'inline-flex items-center gap-1 rounded border',
  pill: 'inline-flex items-center gap-1 rounded-full border',
  'icon-only': 'inline-flex items-center justify-center rounded-full border p-1',
  compact: 'inline-flex items-center gap-1',
};

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  type,
  variant = 'badge',
  size = 'sm',
  icon,
  label,
  className,
  showIcon = true,
  showLabel = true,
}) => {
  const config = statusConfig[status.toLowerCase()] || { 
    type: type || 'default', 
    icon: icon || <Info className="h-4 w-4" />,
    label: label || status
  };

  const finalType = type || config.type;
  const finalIcon = icon || config.icon;
  const finalLabel = label || config.label || status;

  const iconElement = React.isValidElement(finalIcon) 
    ? React.cloneElement(finalIcon as React.ReactElement<any>, {
        className: cn(sizeStyles[size].icon, (finalIcon as React.ReactElement<any>).props.className)
      })
    : finalIcon;

  if (variant === 'icon-only') {
    return (
      <span
        className={cn(
          variantStyles[variant],
          typeStyles[finalType],
          sizeStyles[size].base,
          className
        )}
        title={finalLabel}
      >
        {iconElement}
      </span>
    );
  }

  return (
    <span
      className={cn(
        variantStyles[variant],
        typeStyles[finalType],
        sizeStyles[size].base,
        className
      )}
    >
      {showIcon && iconElement}
      {showLabel && variant !== 'icon-only' && (
        <span className="capitalize">{finalLabel}</span>
      )}
    </span>
  );
};

// Export specific variants for convenience
export const StatusBadge: React.FC<Omit<StatusIndicatorProps, 'variant'>> = (props) => (
  <StatusIndicator {...props} variant="badge" />
);

export const StatusPill: React.FC<Omit<StatusIndicatorProps, 'variant'>> = (props) => (
  <StatusIndicator {...props} variant="pill" />
);

export const StatusIcon: React.FC<Omit<StatusIndicatorProps, 'variant'>> = (props) => (
  <StatusIndicator {...props} variant="icon-only" />
);