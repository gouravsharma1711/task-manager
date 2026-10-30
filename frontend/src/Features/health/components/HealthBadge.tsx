import React from 'react';
import { RefreshCw } from 'lucide-react';
import { useHealth } from '../hooks/useHealth';

export const HealthBadge: React.FC = () => {
  const { health, isChecking, checkHealth } = useHealth();

  const isConnected =
    health?.server === 'healthy' && health?.database === 'connected';

  return (
    <button
      onClick={() => checkHealth()}
      title="Check API health status"
      className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-200 hover:shadow-xs active:scale-95 cursor-pointer shrink-0"
      style={{
        borderColor: isConnected ? '#bbf7d0' : '#fecaca',
        backgroundColor: isConnected ? '#f0fdf4' : '#fef2f2',
        color: isConnected ? '#15803d' : '#b91c1c',
      }}
    >
      <span className="relative flex h-2 w-2 shrink-0">
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
            isConnected ? 'bg-emerald-400' : 'bg-rose-400'
          }`}
        />
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${
            isConnected ? 'bg-emerald-500' : 'bg-rose-500'
          }`}
        />
      </span>

      {/* Responsive text: compact on mobile, full on tablet/desktop */}
      <span className="font-semibold text-[11px] sm:text-xs">
        {isChecking ? (
          'Checking...'
        ) : isConnected ? (
          <>
            <span className="hidden sm:inline">API & DB Connected</span>
            <span className="sm:hidden">Online</span>
          </>
        ) : (
          <>
            <span className="hidden sm:inline">API Offline</span>
            <span className="sm:hidden">Offline</span>
          </>
        )}
      </span>

      <RefreshCw
        className={`w-3 h-3 ml-0.5 text-slate-400 hover:text-slate-600 shrink-0 ${
          isChecking ? 'animate-spin' : ''
        }`}
      />
    </button>
  );
};

