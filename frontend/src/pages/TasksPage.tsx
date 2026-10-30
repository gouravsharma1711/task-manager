import React, { useState, useMemo } from 'react';
import { useTasks } from '../context/TaskContext';
import { TaskForm } from '../components/tasks/TaskForm';
import { TaskFilterBar } from '../components/tasks/TaskFilterBar';
import { TaskList } from '../components/tasks/TaskList';
import type { TaskCategory, TaskStatus } from '../types';
import { CheckSquare } from 'lucide-react';

export const TasksPage: React.FC = () => {
  const { tasks } = useTasks();

  const [statusFilter, setStatusFilter] = useState<'All' | TaskStatus>('All');
  const [categoryFilter, setCategoryFilter] = useState<'All' | TaskCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter tasks in real-time
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Status filter
      if (statusFilter !== 'All' && task.status !== statusFilter) {
        return false;
      }
      // Category filter
      if (categoryFilter !== 'All' && task.category !== categoryFilter) {
        return false;
      }
      // Search query (matches title or description)
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDesc = task.description
          ? task.description.toLowerCase().includes(query)
          : false;
        if (!matchesTitle && !matchesDesc) {
          return false;
        }
      }
      return true;
    });
  }, [tasks, statusFilter, categoryFilter, searchQuery]);

  const hasFilterActive =
    statusFilter !== 'All' || categoryFilter !== 'All' || searchQuery !== '';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-indigo-600" />
            <span>Task Management</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Create, filter, update status, and manage team tasks.
          </p>
        </div>
      </div>

      {/* Task Creation Form */}
      <TaskForm />

      {/* Filters & Search Control Bar */}
      <TaskFilterBar
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filteredCount={filteredTasks.length}
        totalCount={tasks.length}
      />

      {/* Task List */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Task Records
          </h2>
          <span className="text-xs text-slate-400">
            Click checkbox to toggle status &bull; Bin icon to delete
          </span>
        </div>
        <TaskList tasks={filteredTasks} hasFilterActive={hasFilterActive} />
      </div>
    </div>
  );
};
