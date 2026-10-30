import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 overflow-x-hidden">
      <Navbar />
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 py-5 sm:py-8 min-w-0">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200/60 py-6 px-4 text-center text-xs text-slate-400">
        TaskPulse Minimalist Management Application &bull; Full-Stack React + Node.js + MongoDB
      </footer>
    </div>
  );
};

