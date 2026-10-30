import React, { createContext, useContext, useState } from 'react';
import type { HealthStatus } from '../../../types';

interface HealthContextType {
  health: HealthStatus | null;
  setHealth: React.Dispatch<React.SetStateAction<HealthStatus | null>>;
  isChecking: boolean;
  setIsChecking: React.Dispatch<React.SetStateAction<boolean>>;
  latencyMs: number;
  setLatencyMs: React.Dispatch<React.SetStateAction<number>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

export const HealthContext = createContext<HealthContextType | undefined>(undefined);

export const HealthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [health, setHealth] = useState<HealthStatus | null>({
    server: 'healthy',
    database: 'connected',
    timestamp: new Date().toISOString(),
  });
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [latencyMs, setLatencyMs] = useState<number>(18);
  const [error, setError] = useState<string | null>(null);

  return (
    <HealthContext.Provider
      value={{
        health,
        setHealth,
        isChecking,
        setIsChecking,
        latencyMs,
        setLatencyMs,
        error,
        setError,
      }}
    >
      {children}
    </HealthContext.Provider>
  );
};

export const useHealthStore = () => {
  const context = useContext(HealthContext);
  if (!context) {
    throw new Error('useHealthStore must be used within a HealthProvider');
  }
  return context;
};

