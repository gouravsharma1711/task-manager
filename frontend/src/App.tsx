import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TaskProvider } from './context/TaskContext';
import { Layout } from './components/layout/Layout';
import { DashboardPage } from './Features/dashboard/pages/DashboardPage';
import { TasksPage } from './pages/TasksPage';
import { HealthPage } from './pages/HealthPage';
import { NotFoundPage } from './pages/NotFoundPage';

export function App() {
  return (
    <TaskProvider>
      <BrowserRouter>
        <Routes>
          {/* Main Layout wrapper containing Navbar and Outlet */}
          <Route path="/" element={<Layout />}>
            {/* Default index route redirects to /dashboard */}
            <Route index element={<Navigate to="/dashboard" replace />} />

            {/* 1) Dashboard Route: Summary cards, progress bar, category counts */}
            <Route path="dashboard" element={<DashboardPage />} />

            {/* 2) Tasks Route: Create task form, filter controls, task list with toggle & delete */}
            <Route path="tasks" element={<TasksPage />} />

            {/* 3) Health Route: Server & MongoDB connectivity monitor with live ping */}
            <Route path="health" element={<HealthPage />} />

            {/* 4) Fallback 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TaskProvider>
  );
}

export default App;
