import { useEffect } from 'react';
import { useHealthStore } from '../context/healthContext';
import { healthApi } from '../services/health.api';

export const useHealth = () => {
  const {
    health,
    setHealth,
    isChecking,
    setIsChecking,
    latencyMs,
    setLatencyMs,
    error,
    setError,
  } = useHealthStore();

  const checkHealth = async () => {
    setIsChecking(true);
    setError(null);
    const start = performance.now();
    try {
      const data = await healthApi.getHealth();
      const end = performance.now();
      setLatencyMs(Math.round(end - start));
      setHealth(data);
    } catch (err: any) {
      const end = performance.now();
      setLatencyMs(Math.round(end - start));
      setError(err.response?.data?.message || err.message || 'Server is unreachable');
      setHealth({
        server: 'unhealthy',
        database: 'disconnected',
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return {
    health,
    isChecking,
    latencyMs,
    error,
    checkHealth,
  };
};

