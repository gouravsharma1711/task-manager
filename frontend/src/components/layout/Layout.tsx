import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      <Navbar />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200/60 py-6 text-center text-xs text-slate-400">
        TaskPulse Minimalist Management Application &bull; RESTful Node.js + MongoDB backend ready
      </footer>
    </div>
  );
};
