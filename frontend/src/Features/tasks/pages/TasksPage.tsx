import React, { useState, useEffect, useMemo } from 'react';
import { useTasks } from '../hooks/useTasks';
import { TaskForm } from '../components/TaskForm';
import { TaskFilterBar } from '../components/TaskFilterBar';
import { TaskList } from '../components/TaskList';
import type { TaskCategory, TaskStatus } from '../../../types';
import { CheckSquare, AlertCircle, RefreshCw } from 'lucide-react';

export const TasksPage: React.FC = () => {
  const { tasks, isLoading, error, fetchTasks } = useTasks();

  const [statusFilter, setStatusFilter] = useState<'All' | TaskStatus>('All');
  const [categoryFilter, setCategoryFilter] = useState<'All' | TaskCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch tasks from backend whenever status or category filter changes
  useEffect(() => {
    fetchTasks({
      status: statusFilter,
      category: categoryFilter,
    });
  }, [statusFilter, categoryFilter]);

  // Client-side quick keyword search across filtered results, sorted latest first
  const displayedTasks = useMemo(() => {
    let result = tasks;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = tasks.filter((task) => {
        const matchTitle = task.title.toLowerCase().includes(query);
        const matchDesc = task.description?.toLowerCase().includes(query);
        return matchTitle || matchDesc;
      });
    }
    return [...result].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [tasks, searchQuery]);

  const hasFilterActive =
    statusFilter !== 'All' || categoryFilter !== 'All' || searchQuery !== '';

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Responsive Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
            <span>Task Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Create, filter, update status, and manage team tasks.
          </p>
        </div>

        <button
          onClick={() => fetchTasks({ status: statusFilter, category: categoryFilter })}
          disabled={isLoading}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition active:scale-98 disabled:opacity-50 cursor-pointer"
          title="Reload tasks"
        >
          <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Reload</span>
        </button>
      </div>

      {/* Error alert */}
      {error && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 sm:p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => fetchTasks({ status: statusFilter, category: categoryFilter })}
            className="text-xs font-semibold underline hover:no-underline self-end sm:self-auto"
          >
            Retry
          </button>
        </div>
      )}

      {/* Task Creation Form */}
      <TaskForm />

      {/* Filter and Search Bar */}
      <TaskFilterBar
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filteredCount={displayedTasks.length}
        totalCount={tasks.length}
      />

      {/* Task Records List */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 px-1 gap-1">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Task Records
          </h2>
          <span className="text-[11px] sm:text-xs text-slate-400">
            Click checkbox to toggle status &bull; Bin icon to delete
          </span>
        </div>
        <TaskList
          tasks={displayedTasks}
          isLoading={isLoading}
          hasFilterActive={hasFilterActive}
        />
      </div>
    </div>
  );
};

