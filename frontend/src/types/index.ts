export type TaskCategory = 'Development' | 'Design' | 'Marketing';

export type TaskStatus = 'Pending' | 'Completed';

export interface Task {
  _id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  status: TaskStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface TaskStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  completionPercentage: number;
  categoryCounts: {
    Development: number;
    Design: number;
    Marketing: number;
  };
}

export interface HealthStatus {
  server: 'healthy' | 'unhealthy' | 'checking';
  database: 'connected' | 'disconnected' | 'checking';
  timestamp: string;
  version?: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  success: boolean;
}
