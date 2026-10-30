import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Activity } from 'lucide-react';
import { HealthBadge } from '../../Features/health/components/HealthBadge';

export const Navbar: React.FC = () => {
  const desktopNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
      isActive
        ? 'bg-slate-900 text-white shadow-xs'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center justify-center gap-1 py-1.5 px-3 rounded-lg text-[11px] font-medium transition-colors ${
      isActive
        ? 'text-indigo-600 font-semibold'
        : 'text-slate-500 hover:text-slate-800'
    }`;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-4 sm:gap-8 min-w-0">
          <NavLink to="/dashboard" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs group-hover:bg-indigo-700 transition">
              <CheckSquare className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-slate-900 tracking-tight text-base leading-none">
                TaskPulse
              </span>
              <span className="hidden sm:inline text-[11px] text-slate-500 font-medium tracking-wide mt-0.5">
                Management & Health
              </span>
            </div>
          </NavLink>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/dashboard" className={desktopNavLinkClass}>
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/tasks" className={desktopNavLinkClass}>
              <CheckSquare className="w-4 h-4" />
              <span>Tasks</span>
            </NavLink>
            <NavLink to="/health" className={desktopNavLinkClass}>
              <Activity className="w-4 h-4" />
              <span>System Health</span>
            </NavLink>
          </nav>
        </div>

        {/* Live Top Header Health Badge */}
        <HealthBadge />
      </div>

      {/* Mobile Bottom Navigation Bar (Visible only on smaller screens) */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-200/70 py-1 bg-white/95 px-2">
        <NavLink to="/dashboard" className={mobileNavLinkClass}>
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/tasks" className={mobileNavLinkClass}>
          <CheckSquare className="w-4 h-4" />
          <span>Tasks</span>
        </NavLink>
        <NavLink to="/health" className={mobileNavLinkClass}>
          <Activity className="w-4 h-4" />
          <span>Health</span>
        </NavLink>
      </div>
    </header>
  );
};

