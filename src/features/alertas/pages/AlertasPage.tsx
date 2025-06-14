import React from 'react';
import { AlertTriangle, Shield, TrendingUp, Clock, Users, CheckCircle } from 'lucide-react';
import { AlertsTable } from '../components/AlertsTable';
import { useAlertasStore } from '../../../store';

export const AlertasPage: React.FC = () => {
  const alertas = useAlertasStore(state => state.alertas);
  const alertasActivas = useAlertasStore(state => state.alertasActivas);

  // Calculate statistics
  const stats = {
    total: alertas.length,
    activas: alertasActivas.length,
    atendidas: alertas.filter(a => a.atendida).length,
    criticas: alertasActivas.filter(a => a.severidad === 'critica').length,
    altas: alertasActivas.filter(a => a.severidad === 'alta').length,
    medias: alertasActivas.filter(a => a.severidad === 'media').length,
    bajas: alertasActivas.filter(a => a.severidad === 'baja').length,
    porTipo: {
      violacion: alertasActivas.filter(a => a.tipo === 'violacion').length,
      bateria_baja: alertasActivas.filter(a => a.tipo === 'bateria_baja').length,
      fuera_de_ruta: alertasActivas.filter(a => a.tipo === 'fuera_de_ruta').length,
      temperatura: alertasActivas.filter(a => a.tipo === 'temperatura').length,
      sin_signal: alertasActivas.filter(a => a.tipo === 'sin_signal').length,
      intrusion: alertasActivas.filter(a => a.tipo === 'intrusion').length,
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Gestión de Alarmas</h1>
        <p className="text-gray-400 mt-1">
          Monitoreo y gestión centralizada de todas las alarmas del sistema
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Alarmas</p>
              <p className="text-2xl font-semibold text-white mt-1">{stats.total}</p>
              <p className="text-xs text-gray-500 mt-1">Historial completo</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-gray-600" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Activas</p>
              <p className="text-2xl font-semibold text-red-400 mt-1">{stats.activas}</p>
              <div className="flex space-x-2 mt-1">
                <span className="text-xs text-red-400">{stats.criticas} críticas</span>
                <span className="text-xs text-orange-400">{stats.altas} altas</span>
              </div>
            </div>
            <Shield className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Atendidas</p>
              <p className="text-2xl font-semibold text-green-400 mt-1">{stats.atendidas}</p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.total > 0 ? Math.round((stats.atendidas / stats.total) * 100) : 0}% resueltas
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Tipos más frecuentes</p>
              <div className="mt-2 space-y-1">
                {Object.entries(stats.porTipo)
                  .filter(([_, count]) => count > 0)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 3)
                  .map(([tipo, count]) => (
                    <div key={tipo} className="flex justify-between text-xs">
                      <span className="text-gray-300 capitalize">{tipo.replace('_', ' ')}</span>
                      <span className="text-gray-400">{count}</span>
                    </div>
                  ))}
              </div>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Severity Distribution */}
      {stats.activas > 0 && (
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h3 className="text-sm font-medium text-gray-400 mb-3">Distribución por Severidad</h3>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="flex h-4 rounded-full overflow-hidden bg-gray-700">
                {stats.criticas > 0 && (
                  <div 
                    className="bg-red-500" 
                    style={{ width: `${(stats.criticas / stats.activas) * 100}%` }}
                  />
                )}
                {stats.altas > 0 && (
                  <div 
                    className="bg-orange-500" 
                    style={{ width: `${(stats.altas / stats.activas) * 100}%` }}
                  />
                )}
                {stats.medias > 0 && (
                  <div 
                    className="bg-yellow-500" 
                    style={{ width: `${(stats.medias / stats.activas) * 100}%` }}
                  />
                )}
                {stats.bajas > 0 && (
                  <div 
                    className="bg-blue-500" 
                    style={{ width: `${(stats.bajas / stats.activas) * 100}%` }}
                  />
                )}
              </div>
            </div>
            <div className="flex space-x-4 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-1" />
                <span className="text-gray-400">Crítica ({stats.criticas})</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-orange-500 rounded-full mr-1" />
                <span className="text-gray-400">Alta ({stats.altas})</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1" />
                <span className="text-gray-400">Media ({stats.medias})</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-1" />
                <span className="text-gray-400">Baja ({stats.bajas})</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alerts Table */}
      <AlertsTable />
    </div>
  );
};