import React, { useState } from 'react';
import { Check, Trash2, Calendar, Tag } from 'lucide-react';
import type { Task, TaskCategory } from '../../types';
import { useTasks } from '../../context/TaskContext';

interface TaskCardProps {
  task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { toggleTaskStatus, deleteTask } = useTasks();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const isCompleted = task.status === 'Completed';

  const categoryBadgeColors: Record<TaskCategory, string> = {
    Development: 'bg-blue-50 text-blue-700 border-blue-200',
    Design: 'bg-purple-50 text-purple-700 border-purple-200',
    Marketing: 'bg-amber-50 text-amber-700 border-amber-200',
  };

  const formattedDate = new Date(task.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const handleToggle = async () => {
    setIsToggling(true);
    await toggleTaskStatus(task._id);
    setIsToggling(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteTask(task._id);
    setIsDeleting(false);
  };

  return (
    <div
      className={`group bg-white rounded-xl p-5 border transition-all duration-200 shadow-2xs hover:shadow-sm ${
        isCompleted
          ? 'border-slate-200/60 bg-slate-50/50'
          : 'border-slate-200/90 hover:border-slate-300'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Checkbox / Toggle & Title */}
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          <button
            onClick={handleToggle}
            disabled={isToggling}
            aria-label={isCompleted ? 'Mark as pending' : 'Mark as completed'}
            className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition shrink-0 ${
              isCompleted
                ? 'bg-emerald-600 border-emerald-600 text-white'
                : 'border-slate-300 hover:border-indigo-500 bg-white text-transparent'
            }`}
          >
            <Check className={`w-3.5 h-3.5 ${isCompleted ? 'opacity-100' : 'opacity-0'}`} />
          </button>

          <div className="flex-1 min-w-0">
            <h4
              className={`text-sm font-semibold transition tracking-tight break-words ${
                isCompleted
                  ? 'text-slate-400 line-through font-normal'
                  : 'text-slate-900'
              }`}
            >
              {task.title}
            </h4>

            {task.description && (
              <p
                className={`mt-1 text-xs leading-relaxed break-words ${
                  isCompleted ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                {task.description}
              </p>
            )}

            {/* Badges / Metadata row */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border ${
                  categoryBadgeColors[task.category]
                }`}
              >
                <Tag className="w-2.5 h-2.5" />
                {task.category}
              </span>

              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border ${
                  isCompleted
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
              >
                {task.status}
              </span>

              <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                <Calendar className="w-3 h-3" />
                {formattedDate}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {showConfirmDelete ? (
            <div className="flex items-center gap-1 bg-rose-50 border border-rose-200 rounded-lg p-1 animate-fade-in">
              <span className="text-[11px] font-medium text-rose-700 px-1">
                Delete?
              </span>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-2 py-0.5 text-[11px] font-semibold bg-rose-600 text-white rounded hover:bg-rose-700 transition"
              >
                Yes
              </button>
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="px-1.5 py-0.5 text-[11px] text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirmDelete(true)}
              title="Delete task"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
