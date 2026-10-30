import React from 'react';
import { Activity, Server, Database, Clock, RefreshCw, Cpu, AlertCircle } from 'lucide-react';
import { useHealth } from '../hooks/useHealth';

export const HealthCard: React.FC = () => {
  const { health, isChecking, latencyMs, error, checkHealth } = useHealth();

  const isServerHealthy = health?.server === 'healthy';
  const isDbConnected = health?.database === 'connected';

  const formatUptime = (seconds?: number) => {
    if (!seconds) return '1h 00m';
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 sm:gap-4">
          <div
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 ${
              isServerHealthy && isDbConnected
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-rose-50 text-rose-600'
            }`}
          >
            <Activity className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                System Connectivity
              </h2>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wider ${
                  isServerHealthy && isDbConnected
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {isServerHealthy && isDbConnected ? 'Operational' : 'Degraded'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 break-all">
              Target Endpoint: <code className="text-indigo-600 font-mono">GET /api/v1/health</code>
            </p>
          </div>
        </div>

        <button
          onClick={() => checkHealth()}
          disabled={isChecking}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 active:scale-98 transition shadow-xs disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isChecking ? 'animate-spin' : ''}`}
          />
          <span>{isChecking ? 'Testing...' : 'Ping Endpoint'}</span>
        </button>
      </div>

      {/* Error alert if offline */}
      {error && (
        <div className="flex items-center gap-2 p-3.5 sm:p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm">
          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Microservices Status Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
        {/* Express Server */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Express Server
            </span>
            <Server className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2.5 sm:mt-3 flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isServerHealthy ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
            />
            <span className="text-lg sm:text-xl font-bold text-slate-900 capitalize">
              {health?.server || 'Checking...'}
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-1">HTTP 200 OK Response</p>
        </div>

        {/* MongoDB Database */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              MongoDB Database
            </span>
            <Database className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2.5 sm:mt-3 flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isDbConnected ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
            />
            <span className="text-lg sm:text-xl font-bold text-slate-900 capitalize">
              {health?.database || 'Checking...'}
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-1">Mongoose connection pool ready</p>
        </div>

        {/* Latency */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Roundtrip Latency
            </span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2.5 sm:mt-3 flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-bold text-slate-900">
              ~{latencyMs}
            </span>
            <span className="text-xs font-semibold text-slate-500">ms</span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-1">Live endpoint ping</p>
        </div>
      </div>

      {/* JSON Payload Inspector */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-slate-500 shrink-0" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              Live Health Payload Inspection
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Last Checked: {health ? new Date(health.timestamp).toLocaleTimeString() : 'N/A'}
          </span>
        </div>

        <pre className="p-3 sm:p-4 rounded-lg bg-slate-900 text-emerald-400 text-[11px] sm:text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800">
{JSON.stringify(
  {
    statusCode: isServerHealthy && isDbConnected ? 200 : 503,
    message:
      isServerHealthy && isDbConnected
        ? 'Server and database are healthy'
        : 'Database is unavailable',
    data: {
      server: health?.server || 'unknown',
      database: health?.database || 'unknown',
      uptime: formatUptime(health?.uptimeSeconds),
      timestamp: health?.timestamp,
    },
    success: isServerHealthy && isDbConnected,
  },
  null,
  2
)}
        </pre>
      </div>
    </div>
  );
};

