import React, { useState } from 'react';
import { cn } from '../../utils/utils';
import { Card } from './Card';
import { StatusBadge } from './StatusBadge';

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  type: 'origin' | 'destination' | 'waypoint' | 'alert' | 'vehicle';
  label?: string;
  status?: 'active' | 'inactive' | 'alert';
  metadata?: Record<string, any>;
}

export interface MapRoute {
  id: string;
  points: Array<{ lat: number; lng: number }>;
  color?: string;
  style?: 'solid' | 'dashed' | 'dotted';
}

interface MapModuleProps {
  markers?: MapMarker[];
  routes?: MapRoute[];
  center?: { lat: number; lng: number };
  zoom?: number;
  className?: string;
  height?: string;
  showControls?: boolean;
  showLegend?: boolean;
  onMarkerClick?: (marker: MapMarker) => void;
  variant?: 'default' | 'fullscreen' | 'compact';
}

export const MapModule: React.FC<MapModuleProps> = ({
  markers = [],
  routes = [],
  center = { lat: -34.6037, lng: -58.3816 }, // Buenos Aires
  zoom = 10,
  className,
  height = '400px',
  showControls = true,
  showLegend = true,
  onMarkerClick,
  variant = 'default'
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);

  const getMarkerIcon = (type: MapMarker['type']) => {
    switch (type) {
      case 'origin':
        return (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        );
      case 'destination':
        return (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
          </svg>
        );
      case 'vehicle':
        return (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
          </svg>
        );
      case 'alert':
        return (
          <svg className="w-6 h-6 text-red-500 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L1 21h22L12 2zm0 3.83L19.53 19H4.47L12 5.83zM11 16v2h2v-2h-2zm0-6v4h2v-4h-2z"/>
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="8"/>
          </svg>
        );
    }
  };

  const getMarkerColor = (marker: MapMarker) => {
    if (marker.status === 'alert') return 'text-red-500';
    if (marker.status === 'inactive') return 'text-gray-500';
    
    switch (marker.type) {
      case 'origin': return 'text-green-500';
      case 'destination': return 'text-blue-500';
      case 'vehicle': return 'text-yellow-500';
      case 'alert': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };

  const handleMarkerClick = (marker: MapMarker) => {
    setSelectedMarker(marker.id);
    onMarkerClick?.(marker);
  };

  const MapPlaceholder = () => (
    <div className="relative w-full h-full bg-gray-900 rounded-lg overflow-hidden">
      {/* Grid Background */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, #4b5563 1px, transparent 1px),
            linear-gradient(to bottom, #4b5563 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
      
      {/* Routes */}
      {routes.map((route) => (
        <svg
          key={route.id}
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <polyline
            points={route.points.map((p, i) => `${(p.lng + 180) / 3.6},${(90 - p.lat) / 1.8}`).join(' ')}
            fill="none"
            stroke={route.color || '#3b82f6'}
            strokeWidth="2"
            strokeDasharray={route.style === 'dashed' ? '5,5' : route.style === 'dotted' ? '2,2' : undefined}
            opacity="0.6"
          />
        </svg>
      ))}
      
      {/* Markers */}
      {markers.map((marker) => (
        <div
          key={marker.id}
          className={cn(
            'absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer',
            'transition-all hover:scale-110',
            selectedMarker === marker.id && 'scale-125 z-10',
            getMarkerColor(marker)
          )}
          style={{
            left: `${((marker.lng + 180) / 3.6)}%`,
            top: `${((90 - marker.lat) / 1.8)}%`
          }}
          onClick={() => handleMarkerClick(marker)}
        >
          {getMarkerIcon(marker.type)}
          {marker.label && (
            <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-xs whitespace-nowrap bg-gray-800 px-1 py-0.5 rounded">
              {marker.label}
            </span>
          )}
        </div>
      ))}
      
      {/* Center Indicator */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-2 h-2 bg-white rounded-full opacity-50" />
      </div>
    </div>
  );

  const mapContent = (
    <>
      <div style={{ height: variant === 'fullscreen' ? '100vh' : height }}>
        <MapPlaceholder />
      </div>
      
      {/* Controls */}
      {showControls && (
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-lg shadow-lg">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
          <button className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-lg shadow-lg">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          {variant !== 'fullscreen' && (
            <button 
              className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-lg shadow-lg"
              onClick={() => setIsFullscreen(true)}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
          )}
        </div>
      )}
      
      {/* Legend */}
      {showLegend && markers.length > 0 && (
        <div className="absolute bottom-4 left-4 bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <h4 className="text-sm font-medium text-gray-100 mb-2">Leyenda</h4>
          <div className="space-y-1">
            {Array.from(new Set(markers.map(m => m.type))).map((type) => (
              <div key={type} className="flex items-center gap-2">
                <span className={cn('w-4 h-4', getMarkerColor({ type } as MapMarker))}>
                  {getMarkerIcon(type as MapMarker['type'])}
                </span>
                <span className="text-xs text-gray-400 capitalize">{type}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );

  if (variant === 'compact') {
    return (
      <div className={cn('relative rounded-lg overflow-hidden', className)}>
        {mapContent}
      </div>
    );
  }

  return (
    <Card className={cn('relative overflow-hidden', className)} noPadding>
      {mapContent}
      
      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-gray-900">
          <div className="relative w-full h-full">
            <MapModule
              {...{ markers, routes, center, zoom, showControls, showLegend, onMarkerClick }}
              variant="fullscreen"
              height="100vh"
            />
            <button
              className="absolute top-4 left-4 bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-lg shadow-lg"
              onClick={() => setIsFullscreen(false)}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </Card>
  );
};