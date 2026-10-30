import { useEffect } from 'react';
import { useDashboardStore } from '../context/dashboardContext';
import { getDashBoardStats } from '../services/dashboard.api';


export const useDashboard = () => {
  const { stats, setStats, isLoading, setIsLoading, error, setError } = useDashboardStore();
  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getDashBoardStats();
      setStats(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load statistics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  
  return {
    stats,
    isLoading,
    error,
    refreshStats: fetchStats,
  };
};