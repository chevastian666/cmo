import React, { useState, useEffect } from 'react';
import { Clock, RefreshCw, Filter, Monitor } from 'lucide-react';
import { cn } from '../../../utils/utils';

interface TorreControlHeaderProps {
  lastUpdate: Date;
  transitosCount: number;
  onRefresh: () => void;
  onToggleFilters: () => void;
  showFilters: boolean;
}

export const TorreControlHeader: React.FC<TorreControlHeaderProps> = ({
  lastUpdate,
  transitosCount,
  onRefresh,
  onToggleFilters,
  showFilters
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-full mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <Monitor className="h-8 w-8 text-blue-500" />
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  Torre de Control
                </h1>
                <p className="text-sm text-gray-400">
                  {transitosCount} tránsitos activos
                </p>
              </div>
            </div>
            
            <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg">
              <Clock className="h-5 w-5 text-blue-400" />
              <span className="text-lg font-mono text-blue-400">
                {currentTime.toLocaleTimeString('es-UY')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right mr-4">
              <p className="text-xs text-gray-400">Última actualización</p>
              <p className="text-sm font-mono text-gray-300">
                {lastUpdate.toLocaleTimeString('es-UY')}
              </p>
            </div>

            <button
              onClick={onToggleFilters}
              className={cn(
                "p-3 rounded-lg transition-all duration-200",
                showFilters 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              )}
              title="Filtros"
            >
              <Filter className="h-5 w-5" />
            </button>

            <button
              onClick={onRefresh}
              className="p-3 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg transition-all duration-200 group"
              title="Actualizar"
            >
              <RefreshCw className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};