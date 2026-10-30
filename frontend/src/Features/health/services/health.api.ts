import apiClient from '../../../shared/services/apiClient';
import type { HealthStatus } from '../../../types';

export const healthApi = {
  // Fetch live health status from backend
  async getHealth(): Promise<HealthStatus> {
    const response = await apiClient.get('/health');
    console.log("response : ",response);
    
    return {
      server: response.data.data.server,
      database: response.data.data.database,
      timestamp: new Date().toISOString(),
      uptimeSeconds: response.data.data.uptimeSeconds || 3600,
      version: 'v1.0.0',
    };
  },
};

