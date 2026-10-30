import type { Task, TaskStats, HealthStatus } from '../types';

export const initialTasks: Task[] = [
  {
    _id: '67c1e5a201a4b23c91d8e001',
    title: 'Architect MongoDB schema & Mongoose indexes',
    description: 'Define models for Tasks, indexes on status and category for optimized query filtering.',
    category: 'Development',
    status: 'Completed',
    createdAt: '2026-10-28T09:30:00.000Z',
  },
  {
    _id: '67c1e5a201a4b23c91d8e002',
    title: 'Design high-fidelity dashboard wireframes in Figma',
    description: 'Create responsive UI components for task cards, category badges, and health monitors.',
    category: 'Design',
    status: 'Completed',
    createdAt: '2026-10-28T14:15:00.000Z',
  },
  {
    _id: '67c1e5a201a4b23c91d8e003',
    title: 'Implement RESTful endpoints for CRUD & status toggle',
    description: 'Build POST /tasks/create, GET /tasks with filters, PATCH /tasks/:id/status, and DELETE endpoints.',
    category: 'Development',
    status: 'Completed',
    createdAt: '2026-10-29T11:00:00.000Z',
  },
  {
    _id: '67c1e5a201a4b23c91d8e004',
    title: 'Prepare product launch email & announcement campaign',
    description: 'Draft copy for the beta release newsletter and coordinate social assets with the design team.',
    category: 'Marketing',
    status: 'Pending',
    createdAt: '2026-10-29T16:45:00.000Z',
  },
  {
    _id: '67c1e5a201a4b23c91d8e005',
    title: 'Refactor Tailwind color palette and dark/light accents',
    description: 'Ensure accessible contrast ratios for status tags and minimalist card borders.',
    category: 'Design',
    status: 'Pending',
    createdAt: '2026-10-30T08:20:00.000Z',
  },
  {
    _id: '67c1e5a201a4b23c91d8e006',
    title: 'Conduct end-to-end load testing on the health endpoint',
    description: 'Verify MongoDB connection pool behavior under simulated concurrent traffic.',
    category: 'Development',
    status: 'Pending',
    createdAt: '2026-10-30T10:10:00.000Z',
  },
];

export const calculateStats = (tasks: Task[]): TaskStats => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
  const pendingTasks = tasks.filter((t) => t.status === 'Pending').length;
  const completionPercentage =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const categoryCounts = {
    Development: tasks.filter((t) => t.category === 'Development').length,
    Design: tasks.filter((t) => t.category === 'Design').length,
    Marketing: tasks.filter((t) => t.category === 'Marketing').length,
  };

  return {
    totalTasks,
    completedTasks,
    pendingTasks,
    completionPercentage,
    categoryCounts,
  };
};

export const initialHealth: HealthStatus = {
  server: 'healthy',
  database: 'connected',
  uptimeSeconds: 14820,
  timestamp: new Date().toISOString(),
  version: 'v1.0.0',
};
