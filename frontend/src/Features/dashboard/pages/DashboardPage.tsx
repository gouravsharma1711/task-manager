import React from 'react';
import { Link } from 'react-router-dom';
import {
  ListTodo,
  CheckCircle2,
  Clock,
  PlusCircle,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';

import { useDashboard } from '../hooks/useDashboard';
import { StatCard } from '../components/StatCard';
import { ProgressBar } from '../components/ProgressBar';
import { CategoryBreakdown } from '../components/CategoryBreakdown';

export const DashboardPage: React.FC = () => {
  const { stats, isLoading, error, refreshStats } = useDashboard();

  // Fallback stats so the UI never crashes
  const displayStats = stats || {
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    completionPercentage: 0,
    categoryCounts: {
      Development: 0,
      Design: 0,
      Marketing: 0,
    },
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <span>Overview & Monitoring</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time tracking of task delivery metrics, categories, and system state.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refreshStats()}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition active:scale-98 disabled:opacity-50"
            title="Refresh statistics"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <Link
            to="/tasks"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition active:scale-98 shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Manage Tasks</span>
          </Link>
        </div>
      </div>

      {/* Error Banner (if API fails) */}
      {error && (
        <div className="flex items-center justify-between p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => refreshStats()}
            className="text-xs font-semibold underline hover:no-underline ml-4"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Tasks"
          value={displayStats.totalTasks}
          subtitle="across all categories"
          icon={ListTodo}
          variant="default"
        />
        <StatCard
          title="Completed"
          value={displayStats.completedTasks}
          subtitle="resolved items"
          icon={CheckCircle2}
          variant="success"
        />
        <StatCard
          title="Pending"
          value={displayStats.pendingTasks}
          subtitle="in progress or queue"
          icon={Clock}
          variant="warning"
        />
      </div>

      {/* Completion Progress Bar (handles 0% safely) */}
      <ProgressBar
        percentage={displayStats.completionPercentage}
        total={displayStats.totalTasks}
        completed={displayStats.completedTasks}
      />

      {/* Category Breakdown (Development, Design, Marketing) */}
      <CategoryBreakdown
        categoryCounts={displayStats.categoryCounts}
        totalTasks={displayStats.totalTasks}
      />
    </div>
  );
};