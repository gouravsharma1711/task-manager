import React from 'react';
import { TrendingUp } from 'lucide-react';

interface ProgressBarProps {
  percentage: number;
  total: number;
  completed: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  total,
  completed,
}) => {
  // Safe edge-case handling: fallback to 0% if total is 0 or NaN
  const safePercentage = Math.min(100, Math.max(0, isNaN(percentage) ? 0 : percentage));

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-700">
              Overall Progress
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {total === 0
              ? 'No tasks created yet'
              : `${completed} of ${total} tasks marked as completed`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-slate-900 tracking-tight">
            {safePercentage}%
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
            {safePercentage === 100 && total > 0 ? 'All Completed!' : 'In Progress'}
          </span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200/60">
        <div
          className="bg-linear-to-r from-indigo-500 to-indigo-600 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${safePercentage}%` }}
        />
      </div>

      {/* Sub-label indicators */}
      <div className="flex justify-between items-center text-[11px] text-slate-400 mt-2 font-medium">
        <span>0% Start</span>
        <span>50% Halfway</span>
        <span>100% Complete</span>
      </div>
    </div>
  );
};
