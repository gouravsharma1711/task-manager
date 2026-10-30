import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  subtitle: string;
  icon: LucideIcon;
  variant?: 'default' | 'success' | 'warning';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'default',
}) => {
  const variantStyles = {
    default: {
      border: 'border-slate-200/80',
      bgIcon: 'bg-indigo-50 text-indigo-600',
    },
    success: {
      border: 'border-emerald-200/80',
      bgIcon: 'bg-emerald-50 text-emerald-600',
    },
    warning: {
      border: 'border-amber-200/80',
      bgIcon: 'bg-amber-50 text-amber-600',
    },
  }[variant];

  return (
    <div
      className={`bg-white rounded-xl p-5 border ${variantStyles.border} shadow-xs hover:shadow-sm transition-all duration-200`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${variantStyles.bgIcon}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-3xl font-bold tracking-tight text-slate-900">
          {value}
        </span>
        <span className="text-xs text-slate-400 font-medium">
          {subtitle}
        </span>
      </div>
    </div>
  );
};
