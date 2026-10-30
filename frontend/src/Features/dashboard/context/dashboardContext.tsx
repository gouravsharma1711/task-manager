import React, { createContext, useContext, useState } from 'react';
import type { TaskStats } from '../../../types';


interface DashboardContextType {
  stats: TaskStats | null;
  setStats: React.Dispatch<React.SetStateAction<TaskStats | null>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

export const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  return (
    <DashboardContext.Provider
      value={{
        stats,
        setStats,
        isLoading,
        setIsLoading,
        error,
        setError,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};


export const useDashboardStore = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboardStore must be used within a DashboardProvider');
  }
  return context;
};