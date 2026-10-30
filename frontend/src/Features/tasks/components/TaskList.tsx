import React from 'react';
import type { Task } from '../../../types';
import { TaskCard } from './TaskCard';
import { ClipboardList, Inbox, Loader2 } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  hasFilterActive: boolean;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, isLoading, hasFilterActive }) => {
  if (isLoading && tasks.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 sm:p-12 border border-slate-200/80 text-center shadow-xs">
        <Loader2 className="w-6 h-6 animate-spin mx-auto text-indigo-600 mb-2" />
        <p className="text-xs text-slate-500 font-medium">Loading tasks from database...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 sm:p-12 border border-slate-200/80 text-center shadow-xs">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
          {hasFilterActive ? (
            <ClipboardList className="w-6 h-6" />
          ) : (
            <Inbox className="w-6 h-6" />
          )}
        </div>
        <h3 className="text-sm font-semibold text-slate-800">
          {hasFilterActive ? 'No matching tasks found' : 'No tasks created yet'}
        </h3>
        <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
          {hasFilterActive
            ? 'Try adjusting your filters or search terms to find what you are looking for.'
            : 'Get started by creating your first task using the form above.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5 sm:space-y-3">
      {tasks.map((task) => (
        <TaskCard key={task._id} task={task} />
      ))}
    </div>
  );
};

