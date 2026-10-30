import React, { useState } from 'react';
import { PlusCircle, AlertCircle, Check } from 'lucide-react';
import type { TaskCategory } from '../../types';
import { useTasks } from '../../context/TaskContext';

interface TaskFormProps {
  onSuccess?: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onSuccess }) => {
  const { createTask } = useTasks();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory>('Development');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Front-end validation: check for empty or whitespace-only title
    if (!title.trim()) {
      setError('Task title is required and cannot be empty.');
      return;
    }

    setIsSubmitting(true);
    const result = await createTask({
      title,
      category,
      description,
    });
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error || 'Failed to create task');
      return;
    }

    // Reset form
    setTitle('');
    setDescription('');
    setCategory('Development');
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 2500);

    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Create New Task</h2>
          <p className="text-xs text-slate-500">
            Add task details to assign to your team
          </p>
        </div>
        {showSuccessToast && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 transition-all animate-fade-in">
            <Check className="w-3.5 h-3.5" />
            Task added!
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Error message */}
        {error && (
          <div className="flex items-center gap-2 p-3 text-xs rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Title Input */}
          <div className="sm:col-span-2">
            <label
              htmlFor="task-title"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1"
            >
              Task Title <span className="text-rose-500">*</span>
            </label>
            <input
              id="task-title"
              type="text"
              placeholder="e.g. Implement OAuth login flow"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError(null);
              }}
              className={`w-full px-3.5 py-2 text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 transition ${
                error
                  ? 'border-rose-300 focus:ring-rose-200'
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
              }`}
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label
              htmlFor="task-category"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1"
            >
              Category <span className="text-rose-500">*</span>
            </label>
            <select
              id="task-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as TaskCategory)}
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:border-indigo-500 focus:ring-indigo-100 transition"
            >
              <option value="Development">Development</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>
        </div>

        {/* Description Textarea */}
        <div>
          <label
            htmlFor="task-description"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1"
          >
            Description <span className="text-slate-400 font-normal lowercase">(optional)</span>
          </label>
          <textarea
            id="task-description"
            rows={2}
            placeholder="Add relevant acceptance criteria, links, or context..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:border-indigo-500 focus:ring-indigo-100 transition resize-none"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-lg text-white bg-slate-900 hover:bg-slate-800 active:scale-98 transition shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{isSubmitting ? 'Adding Task...' : 'Create Task'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
