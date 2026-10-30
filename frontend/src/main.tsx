import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// Providers (State Layer)
import { DashboardProvider } from "./Features/dashboard/context/dashboardContext";
import { TaskProvider } from "./Features/tasks/context/taskContext";
import { HealthProvider } from "./Features/health/context/healthContext";

createRoot(document.getElementById("root")!).render(
  <HealthProvider>
    <DashboardProvider>
      <TaskProvider>
        <StrictMode>
          <App />
        </StrictMode>
      </TaskProvider>
    </DashboardProvider>
  </HealthProvider>
);
