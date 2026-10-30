import React from 'react';
import { Code, Palette, Megaphone } from 'lucide-react';
import type { TaskCategory } from '../../types';

interface CategoryBreakdownProps {
  categoryCounts: {
    Development: number;
    Design: number;
    Marketing: number;
  };
  totalTasks: number;
}

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({
  categoryCounts,
  totalTasks,
}) => {
  const categories: {
    name: TaskCategory;
    count: number;
    icon: React.ElementType;
    colorBadge: string;
    barColor: string;
  }[] = [
    {
      name: 'Development',
      count: categoryCounts.Development,
      icon: Code,
      colorBadge: 'bg-blue-50 text-blue-700 border-blue-200',
      barColor: 'bg-blue-500',
    },
    {
      name: 'Design',
      count: categoryCounts.Design,
      icon: Palette,
      colorBadge: 'bg-purple-50 text-purple-700 border-purple-200',
      barColor: 'bg-purple-500',
    },
    {
      name: 'Marketing',
      count: categoryCounts.Marketing,
      icon: Megaphone,
      colorBadge: 'bg-amber-50 text-amber-700 border-amber-200',
      barColor: 'bg-amber-500',
    },
  ];

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-700 mb-4">
        Category Breakdown
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const percentage =
            totalTasks === 0 ? 0 : Math.round((cat.count / totalTasks) * 100);

          return (
            <div
              key={cat.name}
              className="p-4 rounded-lg bg-slate-50/80 border border-slate-100 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`p-1.5 rounded-md border ${cat.colorBadge}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-xs font-semibold text-slate-700">
                    {cat.name}
                  </span>
                </div>
                <span className="text-lg font-bold text-slate-900">
                  {cat.count}
                </span>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                  <span>Share</span>
                  <span className="font-medium text-slate-700">{percentage}%</span>
                </div>
                <div className="w-full bg-slate-200/70 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`${cat.barColor} h-full rounded-full transition-all duration-300`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
