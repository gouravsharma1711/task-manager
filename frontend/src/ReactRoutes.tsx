import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Shared Layout & Pages
import { Layout } from './shared/components/Layout';
import { NotFoundPage } from './shared/components/NotFoundPage';

// Feature Pages (UI Layer)
import { DashboardPage } from './Features/dashboard/pages/DashboardPage';
import { TasksPage } from './Features/tasks/pages/TasksPage';
import { HealthPage } from './Features/health/pages/HealthPage';


export default function ReactRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Shell layout containing Navbar & Health badge */}
        <Route path="/" element={<Layout />}>
          {/* Default route redirects to dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />

          {/* Feature 1: Overview & Monitoring Dashboard */}
          <Route path="dashboard" element={<DashboardPage />} />

          {/* Feature 2: Task Management (Create, Filter, Toggle, Delete) */}
          <Route path="tasks" element={<TasksPage />} />

          {/* Feature 3: System & DB Diagnostics */}
          <Route path="health" element={<HealthPage />} />

          {/* Fallback 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
