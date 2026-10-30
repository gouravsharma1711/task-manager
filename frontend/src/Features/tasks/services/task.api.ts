import apiClient from '../../../shared/services/apiClient';
import type { Task, TaskCategory, TaskStatus } from '../../../types';

export interface TaskFilterParams {
  status?: 'All' | TaskStatus;
  category?: 'All' | TaskCategory;
}

export interface CreateTaskDto {
  title: string;
  category: TaskCategory;
  description?: string;
}

export const taskApi = {
  async getTasks(filters?: TaskFilterParams): Promise<Task[]> {
    const params: Record<string, string> = {};
    if (filters?.status && filters.status !== 'All') {
      params.status = filters.status;
    }
    if (filters?.category && filters.category !== 'All') {
      params.category = filters.category;
    }

    const response = await apiClient.get('/tasks', { params });
    
    return response.data.data;
  },

  // Create a new task
  async createTask(taskData: CreateTaskDto): Promise<Task> {
    const response = await apiClient.post('/tasks/create', taskData);
    return response.data.data;
  },

  // Toggle task status (Pending <-> Completed)
  async toggleTaskStatus(id: string): Promise<Task> {
    const response = await apiClient.patch(`/tasks/${id}/status`);
    return response.data.data;
  },

  // Delete a task by ID
  async deleteTask(id: string): Promise<void> {
    await apiClient.delete(`/tasks/${id}`);
  },
};

