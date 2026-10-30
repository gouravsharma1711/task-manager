import React from 'react';
import { HealthCard } from '../components/health/HealthCard';
import { Activity } from 'lucide-react';

export const HealthPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Activity className="w-6 h-6 text-emerald-600" />
          <span>System & Backend Health</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Live monitoring of Node.js Express server, MongoDB connectivity, and latency diagnostics.
        </p>
      </div>

      {/* Main Health Card & Diagnostics */}
      <HealthCard />
    </div>
  );
};
