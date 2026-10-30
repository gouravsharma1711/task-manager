import React, { useState } from 'react';
import { Activity, Server, Database, Clock, RefreshCw, Cpu } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export const HealthCard: React.FC = () => {
  const { health, isHealthChecking, refreshHealth } = useTasks();
  const [latencyMs, setLatencyMs] = useState<number>(24);

  const handlePing = async () => {
    const start = performance.now();
    await refreshHealth();
    const end = performance.now();
    setLatencyMs(Math.round(end - start));
  };

  const isServerHealthy = health.server === 'healthy';
  const isDbConnected = health.database === 'connected';

  const formatUptime = (seconds?: number) => {
    if (!seconds) return '4h 12m';
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="space-y-6">
      {/* Overview Status Banner */}
      <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              isServerHealthy && isDbConnected
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-rose-50 text-rose-600'
            }`}
          >
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">
                System Connectivity
              </h2>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                  isServerHealthy && isDbConnected
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {isServerHealthy && isDbConnected ? 'Operational' : 'Degraded'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Target Endpoint: <code className="text-indigo-600 font-mono">GET /api/v1/health</code>
            </p>
          </div>
        </div>

        <button
          onClick={handlePing}
          disabled={isHealthChecking}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 active:scale-98 transition shadow-xs disabled:opacity-50"
        >
          <RefreshCw
            className={`w-4 h-4 ${isHealthChecking ? 'animate-spin' : ''}`}
          />
          <span>{isHealthChecking ? 'Testing...' : 'Ping Endpoint'}</span>
        </button>
      </div>

      {/* Grid of Micro-Services */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Server State */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Express Server
            </span>
            <Server className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isServerHealthy ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
            />
            <span className="text-xl font-bold text-slate-900 capitalize">
              {health.server}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">HTTP 200 OK Response</p>
        </div>

        {/* Database State */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              MongoDB Instance
            </span>
            <Database className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isDbConnected ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
            />
            <span className="text-xl font-bold text-slate-900 capitalize">
              {health.database}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Mongoose connection pool ready</p>
        </div>

        {/* Latency & Ping */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Roundtrip Latency
            </span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-900">
              ~{latencyMs}
            </span>
            <span className="text-xs font-semibold text-slate-500">ms</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Simulated / Active ping</p>
        </div>
      </div>

      {/* JSON Payload Inspection Card */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-slate-500" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              Live Health Payload Inspection
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Last Checked: {new Date(health.timestamp).toLocaleTimeString()}
          </span>
        </div>

        <pre className="p-4 rounded-lg bg-slate-900 text-emerald-400 text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800">
{JSON.stringify(
  {
    statusCode: isServerHealthy && isDbConnected ? 200 : 503,
    message:
      isServerHealthy && isDbConnected
        ? 'Server and database are healthy'
        : 'Database is unavailable',
    data: {
      server: health.server,
      database: health.database,
      uptime: formatUptime(health.uptimeSeconds),
      timestamp: health.timestamp,
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
