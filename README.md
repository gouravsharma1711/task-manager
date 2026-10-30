# 📋 TaskPulse — Full-Stack Task Management & Live Monitoring Dashboard

A modern, production-grade full-stack web application designed for team task lifecycle management and real-time backend/database observability. Built with a clean **4-Layer Feature-Sliced Architecture** on the frontend, and a modular **TypeScript + Express + MongoDB** REST API on the backend.

> 📖 **Deep Dive Documentation**: For an in-depth breakdown of code flow, design patterns, and layer interactions, please see [`ARCHITECTURE.md`](./ARCHITECTURE.md).

---

## 🌟 Key Features

### 1. 📊 Overview & Monitoring Dashboard (`/dashboard`)
* **Summary Metric Cards**: Live tracking of **Total Tasks**, **Completed Tasks**, and **Pending Tasks**.
* **Visual Progress Bar**: Animated percentage completion bar (e.g. `60% Completed`).
* **Zero-Task Edge Case Protection**: If `0` tasks exist, displays `0%` cleanly without `NaN` or layout collapse.
* **Category Breakdown**: Instant distribution of workload across **Development**, **Design**, and **Marketing** with progress share bars.
* **On-Demand Refresh**: Interactive reload trigger to pull fresh metrics directly from `/api/v1/tasks/stats`.

### 2. ✅ Task Management System (`/tasks`)
* **Form with Strict Validation**: Rejects empty or whitespace-only task titles with both client-side and server-side errors.
* **Category & Description Support**: Assign tasks to *Development*, *Design*, or *Marketing*, with optional descriptive notes.
* **Multi-Axis Filter Bar**:
  * Filter by **Status**: `All`, `Pending`, `Completed`.
  * Filter by **Category**: `All`, `Development`, `Design`, `Marketing`.
  * **Real-time Keyword Search**: Instant search through titles and descriptions.
  * **One-Click Reset**: Clears all active filters and search terms.
* **Latest-First Sorting**: Newly created tasks and fetched tasks are automatically sorted with the newest items on top.
* **Instant Dynamic UI**: Toggling status or deleting a task updates the UI immediately without a browser refresh.

### 3. 🩺 Live System & Health Monitor (`/health`)
* **Dual-State Diagnostics**: Real-time status for the **Node.js Express Server** and the **MongoDB Connection Pool** (`readyState === 1`).
* **Roundtrip Latency**: Measures actual network ping time in milliseconds (`~ms`).
* **Live JSON Payload Inspection**: Interactive terminal viewer displaying the raw response from `GET /api/v1/health`.
* **Sticky Top Navbar Health Badge**: Pulse indicator present in the navigation header across all routes (`API & DB Connected` vs. `API Offline`).

### 4. 🧭 Route Navigation & 404 Recovery
* Built with **React Router Dom (v7)**.
* Wildcard catch-all route (`*`) rendering a minimalist **404 Not Found** page with instant recovery buttons.

---

## 🏗️ Architecture & Code Flow

The frontend strictly implements a **4-Layer Architecture** scoped into domain **Features**:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. UI Layer (Pages & Components)                           │
│    • DashboardPage, TasksPage, HealthPage                   │
│    • TaskCard, TaskForm, StatCard, ProgressBar              │
└───────────────────────────┬─────────────────────────────────┘
                            │ Calls custom hooks & reads state
┌───────────────────────────▼─────────────────────────────────┐
│ 2. Hooks Layer (Controllers & Orchestration)                │
│    • useTasks, useDashboard, useHealth                      │
│    • Coordinates API requests, handles try/catch & sorting  │
└───────────────────────────┬─────────────────────────────────┘
                            │ Updates context & calls services
┌───────────────────────────▼─────────────────────────────────┐
│ 3. State Layer (Pure Store Context)                         │
│    • taskContext, dashboardContext, healthContext           │
│    • Stores state: data, isLoading, error                   │
└───────────────────────────┬─────────────────────────────────┘
                            │ Executes HTTP requests
┌───────────────────────────▼─────────────────────────────────┐
│ 4. API Layer (Network Services)                             │
│    • task.api, dashboard.api, health.api                    │
│    • Powered by shared Axios client (apiClient.ts)          │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTP GET / POST / PATCH / DELETE
┌───────────────────────────▼─────────────────────────────────┐
│ BACKEND REST API (Express + TypeScript + MongoDB / Mongoose)│
│    • /api/v1/tasks                                          │
│    • /api/v1/tasks/stats                                    │
│    • /api/v1/health                                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Repository Directory Structure

```
task-manager/
├── backend/
│   ├── src/
│   │   ├── config/config.ts         # Environment variable validator
│   │   ├── controllers/
│   │   │   └── task.controller.ts   # CRUD handlers, stats aggregation, health check
│   │   ├── db/db.ts                 # Mongoose connection logic
│   │   ├── middleware/
│   │   │   ├── error.middleware.ts  # Centralized error handler
│   │   │   ├── notFound.middleware.ts
│   │   │   └── multer.middleware.ts
│   │   ├── models/
│   │   │   └── Task.ts              # Mongoose schema (Title, Category, Status, Timestamps)
│   │   ├── routes/
│   │   │   └── tasks.routes.ts      # REST API route definitions
│   │   ├── Types/type.ts            # Backend TypeScript interfaces
│   │   ├── utils/
│   │   │   ├── ApiError.ts          # Custom API error class
│   │   │   ├── ApiResponse.ts        # Standardized API response format
│   │   │   └── asyncHandler.ts       # Async error wrapper
│   │   └── App.ts                   # Express application setup & CORS
│   ├── server.ts                    # Server startup entry point
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── Features/
│   │   │   ├── dashboard/           # Feature 1: Dashboard
│   │   │   │   ├── components/      # StatCard, ProgressBar, CategoryBreakdown
│   │   │   │   ├── context/         # dashboardContext.tsx (Pure store)
│   │   │   │   ├── hooks/           # useDashboard.ts (Smart controller)
│   │   │   │   ├── pages/           # DashboardPage.tsx
│   │   │   │   └── services/        # dashboard.api.ts (GET /tasks/stats)
│   │   │   │
│   │   │   ├── tasks/               # Feature 2: Task Management
│   │   │   │   ├── components/      # TaskForm, TaskFilterBar, TaskCard, TaskList
│   │   │   │   ├── context/         # taskContext.tsx (Pure store)
│   │   │   │   ├── hooks/           # useTasks.ts (CRUD orchestration)
│   │   │   │   ├── pages/           # TasksPage.tsx
│   │   │   │   └── services/        # task.api.ts (REST endpoints)
│   │   │   │
│   │   │   └── health/              # Feature 3: Health Diagnostics
│   │   │       ├── components/      # HealthCard, HealthBadge
│   │   │       ├── context/         # healthContext.tsx (Pure store)
│   │   │       ├── hooks/           # useHealth.ts (Ping & latency calculation)
│   │   │       ├── pages/           # HealthPage.tsx
│   │   │       └── services/        # health.api.ts (GET /health)
│   │   │
│   │   ├── shared/
│   │   │   ├── components/          # Navbar.tsx, Layout.tsx, NotFoundPage.tsx
│   │   │   └── services/            # apiClient.ts (Axios base instance)
│   │   │
│   │   ├── types/index.ts           # Shared TypeScript interfaces
│   │   ├── App.tsx                  # Global Providers + React Router
│   │   ├── main.tsx                 # Application root
│   │   └── index.css                # Tailwind CSS v4 styling
│   │
│   ├── .env.example
│   ├── package.json
│   └── vite.config.ts
│
├── .gitignore                       # Clean root ignore (node_modules, .env, dist)
├── ARCHITECTURE.md                  # Comprehensive architectural deep dive
└── README.md                        # Quick start documentation
```

---

## 🔌 Backend REST API Reference

**Base URL**: `http://localhost:3000/api/v1`

| Method | Endpoint | Description | Query / Body Parameters |
| :--- | :--- | :--- | :--- |
| **`GET`** | `/health` | Server & DB health check | None |
| **`GET`** | `/tasks/stats` | Aggregated statistics for dashboard | None |
| **`GET`** | `/tasks` | List tasks (supports filtering) | `?status=Pending&category=Development` |
| **`POST`** | `/tasks/create` | Create a new task | `{ "title": "...", "category": "Development", "description": "..." }` |
| **`PATCH`** | `/tasks/:id/status`| Toggle Pending / Completed | None |
| **`DELETE`** | `/tasks/:id` | Delete task from database | None |

---

## 🚀 Step-by-Step Installation & Run Guide

### Prerequisites
* **Node.js** (v18.0.0 or higher recommended)
* **npm** (v9.0.0 or higher)
* **MongoDB** (Local instance or MongoDB Atlas connection string)

---

### Step 1: Clone the Repository
```bash
git clone <your-repository-url>
cd task-manager
```

---

### Step 2: Setup and Start Backend Server

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file inside the `backend` directory (copy from `.env.example`):
   ```env
   PORT=3000
   MONGO_URL=mongodb://localhost:27017
   MONGO_DB_NAME=TASK-MANAGER
   NODE_ENV=development
   ```
   *(Replace `MONGO_URL` with your MongoDB Atlas connection string if using cloud storage)*

4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server will start at:* **`http://localhost:3000`**  
   *Log output:* `Db connect successfully 😊 | Server is running on http://localhost:3000/`

---

### Step 3: Setup and Start Frontend Application

1. Open a new terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file inside the `frontend` directory:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api/v1
   ```

4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *Open your browser at:* **`http://localhost:5173`**

---

## 🛡️ Edge Cases Handled

1. **Zero Tasks on Dashboard**: When database has 0 tasks, completion percentage safely displays **0%** without `NaN` or crashes.
2. **Whitespace-Only Titles**: Attempting to submit `"   "` is caught and rejected both by the frontend form validator and the backend `ApiError`.
3. **Database Disconnection Handling**: If MongoDB stops or disconnects, `/health` returns `503 Service Unavailable`, and the frontend badges turn red (`API Offline` / `Degraded`) without crashing the React UI.
4. **Persistent Real-Time Sync**: Adding, toggling, or deleting a task syncs both the task list and the dashboard metrics automatically.

---

## 📜 License
This project is open-source and created as an assessment deliverable.

