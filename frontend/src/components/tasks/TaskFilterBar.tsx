import React from 'react';
import { Search, X } from 'lucide-react';
import type { TaskCategory, TaskStatus } from '../../types';

interface TaskFilterBarProps {
  statusFilter: 'All' | TaskStatus;
  setStatusFilter: (status: 'All' | TaskStatus) => void;
  categoryFilter: 'All' | TaskCategory;
  setCategoryFilter: (category: 'All' | TaskCategory) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredCount: number;
  totalCount: number;
}

export const TaskFilterBar: React.FC<TaskFilterBarProps> = ({
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
  searchQuery,
  setSearchQuery,
  filteredCount,
  totalCount,
}) => {
  const statusOptions: ('All' | TaskStatus)[] = ['All', 'Pending', 'Completed'];
  const categoryOptions: ('All' | TaskCategory)[] = [
    'All',
    'Development',
    'Design',
    'Marketing',
  ];

  const hasActiveFilters =
    statusFilter !== 'All' || categoryFilter !== 'All' || searchQuery !== '';

  const clearFilters = () => {
    setStatusFilter('All');
    setCategoryFilter('All');
    setSearchQuery('');
  };

  return (
    <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs space-y-3">
      {/* Top row: Search input & counts */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tasks by title or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-1.5 text-xs sm:text-sm rounded-lg border border-slate-300 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition"
          />
        </div>

        {/* Counter & Reset */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="font-medium">
            Showing <strong className="text-slate-900">{filteredCount}</strong> of{' '}
            {totalCount} tasks
          </span>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 px-2 py-1 rounded text-rose-600 hover:bg-rose-50 font-medium transition"
            >
              <X className="w-3 h-3" />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Bottom row: Filter Chips */}
      <div className="flex flex-wrap items-center gap-4 pt-1 border-t border-slate-100">
        {/* Status Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mr-1">
            Status:
          </span>
          {statusOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setStatusFilter(opt)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                statusFilter === opt
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="hidden sm:block h-4 w-px bg-slate-200" />

        {/* Category Filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mr-1">
            Category:
          </span>
          {categoryOptions.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                categoryFilter === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
