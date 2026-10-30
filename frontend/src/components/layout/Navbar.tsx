import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Activity, RefreshCw } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export const Navbar: React.FC = () => {
  const { health, isHealthChecking, refreshHealth } = useTasks();

  const isConnected = health.server === 'healthy' && health.database === 'connected';

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
      isActive
        ? 'bg-slate-900 text-white shadow-sm'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-8">
          <NavLink to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm group-hover:bg-indigo-700 transition">
              <CheckSquare className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-slate-900 tracking-tight text-base leading-none">
                TaskPulse
              </span>
              <span className="text-[11px] text-slate-500 font-medium tracking-wide">
                Management & Health
              </span>
            </div>
          </NavLink>

          {/* Navigation Links */}
          <nav className="hidden sm:flex items-center gap-1.5">
            <NavLink to="/dashboard" className={navLinkClass}>
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/tasks" className={navLinkClass}>
              <CheckSquare className="w-4 h-4" />
              <span>Tasks</span>
            </NavLink>
            <NavLink to="/health" className={navLinkClass}>
              <Activity className="w-4 h-4" />
              <span>System Health</span>
            </NavLink>
          </nav>
        </div>

        {/* Top Header Health Badge */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => refreshHealth()}
            title="Check API health status"
            className="flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-200 hover:shadow-xs active:scale-95"
            style={{
              borderColor: isConnected ? '#bbf7d0' : '#fecaca',
              backgroundColor: isConnected ? '#f0fdf4' : '#fef2f2',
              color: isConnected ? '#15803d' : '#b91c1c',
            }}
          >
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isConnected ? 'bg-emerald-400' : 'bg-rose-400'
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isConnected ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
              />
            </span>
            <span className="font-semibold">
              {isHealthChecking
                ? 'Checking...'
                : isConnected
                ? 'API & DB Connected'
                : 'API Offline'}
            </span>
            <RefreshCw
              className={`w-3 h-3 ml-0.5 text-slate-400 hover:text-slate-600 ${
                isHealthChecking ? 'animate-spin' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="sm:hidden flex items-center justify-around border-t border-slate-100 py-2 bg-slate-50/70">
        <NavLink to="/dashboard" className={navLinkClass}>
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/tasks" className={navLinkClass}>
          <CheckSquare className="w-4 h-4" />
          <span>Tasks</span>
        </NavLink>
        <NavLink to="/health" className={navLinkClass}>
          <Activity className="w-4 h-4" />
          <span>Health</span>
        </NavLink>
      </div>
    </header>
  );
};
