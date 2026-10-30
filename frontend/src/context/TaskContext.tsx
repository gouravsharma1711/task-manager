import React, { createContext, useContext, useState, useMemo } from 'react';
import type { Task, TaskStats, HealthStatus, TaskCategory } from '../types';
import { initialTasks, initialHealth, calculateStats } from '../data/mockData';

interface TaskContextType {
  tasks: Task[];
  stats: TaskStats;
  health: HealthStatus;
  isHealthChecking: boolean;
  createTask: (data: { title: string; category: TaskCategory; description?: string }) => Promise<{ success: boolean; error?: string }>;
  toggleTaskStatus: (id: string) => Promise<{ success: boolean; error?: string }>;
  deleteTask: (id: string) => Promise<{ success: boolean; error?: string }>;
  refreshHealth: () => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [health, setHealth] = useState<HealthStatus>(initialHealth);
  const [isHealthChecking, setIsHealthChecking] = useState<boolean>(false);

  // Compute live stats dynamically whenever tasks change
  const stats = useMemo(() => calculateStats(tasks), [tasks]);

  // Create Task (Mock - ready to plug fetch('/api/v1/tasks/create'))
  const createTask = async (data: {
    title: string;
    category: TaskCategory;
    description?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    const trimmedTitle = data.title.trim();
    if (!trimmedTitle) {
      return { success: false, error: 'Title is required and cannot be empty.' };
    }

    /* 
      // Ready for real API call:
      // const res = await fetch('http://localhost:5000/api/v1/tasks/create', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });
      // const json = await res.json();
    */

    const newTask: Task = {
      _id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title: trimmedTitle,
      category: data.category,
      description: data.description?.trim() || '',
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) => [newTask, ...prev]);
    return { success: true };
  };

  // Toggle Task Status (Mock - ready to plug fetch('/api/v1/tasks/:id/status'))
  const toggleTaskStatus = async (id: string): Promise<{ success: boolean; error?: string }> => {
    /* 
      // Ready for real API call:
      // const res = await fetch(`http://localhost:5000/api/v1/tasks/${id}/status`, { method: 'PATCH' });
    */

    setTasks((prev) =>
      prev.map((task) =>
        task._id === id
          ? { ...task, status: task.status === 'Pending' ? 'Completed' : 'Pending' }
          : task
      )
    );
    return { success: true };
  };

  // Delete Task (Mock - ready to plug fetch('/api/v1/tasks/:id'))
  const deleteTask = async (id: string): Promise<{ success: boolean; error?: string }> => {
    /* 
      // Ready for real API call:
      // const res = await fetch(`http://localhost:5000/api/v1/tasks/${id}`, { method: 'DELETE' });
    */

    setTasks((prev) => prev.filter((task) => task._id !== id));
    return { success: true };
  };

  // Refresh Health Check (Mock - ready to plug fetch('/api/v1/health'))
  const refreshHealth = async (): Promise<void> => {
    setIsHealthChecking(true);
    try {
      /* 
        // Ready for real API call:
        // const res = await fetch('http://localhost:5000/api/v1/health');
        // const data = await res.json();
      */
      await new Promise((resolve) => setTimeout(resolve, 600)); // Simulate realistic network ping
      setHealth({
        server: 'healthy',
        database: 'connected',
        uptimeSeconds: Math.floor(Math.random() * 5000) + 15000,
        timestamp: new Date().toISOString(),
        version: 'v1.0.0',
      });
    } catch {
      setHealth((prev) => ({
        ...prev,
        server: 'unhealthy',
        database: 'disconnected',
        timestamp: new Date().toISOString(),
      }));
    } finally {
      setIsHealthChecking(false);
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        stats,
        health,
        isHealthChecking,
        createTask,
        toggleTaskStatus,
        deleteTask,
        refreshHealth,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
