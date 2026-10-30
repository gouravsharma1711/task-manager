import React from 'react';
import { HealthCard } from '../components/HealthCard';
import { Activity } from 'lucide-react';

export const HealthPage: React.FC = () => {
  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="pb-1">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
          <span>System & Backend Health</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Live monitoring of Node.js Express server, MongoDB connectivity, and latency diagnostics.
        </p>
      </div>

      <HealthCard />
    </div>
  );
};

