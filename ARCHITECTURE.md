# 🏛️ Architecture & System Design Documentation

This document provides an end-to-end architectural deep dive into the **TaskPulse** full-stack task management and monitoring system. It explains the flow of code, backend architecture, frontend 4-layer feature-sliced design, API specifications, and database modeling.

---

## 📌 Table of Contents
1. [High-Level System Architecture](#1-high-level-system-architecture)
2. [Frontend Architecture (4-Layer Feature-Sliced Design)](#2-frontend-architecture-4-layer-feature-sliced-design)
3. [Backend Architecture (Modular MVC / Layered REST API)](#3-backend-architecture-modular-mvc--layered-rest-api)
4. [End-to-End Data & Code Flow](#4-end-to-end-data--code-flow)
5. [Complete REST API Specification](#5-complete-rest-api-specification)
6. [Database Schema & Data Model](#6-database-schema--data-model)
7. [Responsive UI Design Strategy](#7-responsive-ui-design-strategy)
8. [Edge Cases & Error Handling Mechanisms](#8-edge-cases--error-handling-mechanisms)

---

## 1. High-Level System Architecture

The application is structured into two decoupled subsystems communicating over HTTP via REST:
- **Client (Frontend)**: React 19 + TypeScript + Vite + Tailwind CSS v4.
- **Server (Backend)**: Node.js + Express 5 + TypeScript + MongoDB (Mongoose).

```
┌────────────────────────────────────────────────────────────────────────┐
│                          CLIENT (BROWSER)                              │
│                                                                        │
│   ┌────────────────┐      ┌───────────────┐      ┌─────────────────┐   │
│   │ /dashboard     │      │ /tasks        │      │ /health         │   │
│   │ Overview Stats │      │ CRUD Manager  │      │ Live Monitor    │   │
│   └───────┬────────┘      └───────┬───────┘      └────────┬────────┘   │
│           │                       │                       │            │
│           ▼                       ▼                       ▼            │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │               4-Layer Architecture (Per Feature)               │   │
│   │   [UI Layer]  ──▶  [Hooks Layer]  ──▶  [State Layer / Store]   │   │
│   │                                                │               │   │
│   │                                        [API Services]          │   │
│   └────────────────────────────────────────────────┬───────────────┘   │
└────────────────────────────────────────────────────┼───────────────────┘
                                                     │ HTTP (Axios)
                                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                          BACKEND (EXPRESS API)                         │
│                                                                        │
│   ┌────────────────┐      ┌───────────────┐      ┌─────────────────┐   │
│   │ CORS & Parsing │ ──▶  │ Route Routing │ ──▶  │ Controllers     │   │
│   │ Middleware     │      │ /api/v1/...   │      │ (Async Handlers)│   │
│   └────────────────┘      └───────────────┘      └────────┬────────┘   │
│                                                           │            │
│                                                           ▼            │
│                                                   ┌────────────────┐   │
│                                                   │ Mongoose Model │   │
│                                                   │ Validation     │   │
│                                                   └───────┬────────┘   │
└───────────────────────────────────────────────────────────┼────────────┘
                                                            │ TCP
                                                            ▼
                                                   ┌─────────────────┐
                                                   │ MongoDB Storage │
                                                   │ (Atlas / Local) │
                                                   └─────────────────┘
```

---

## 2. Frontend Architecture (4-Layer Feature-Sliced Design)

The frontend departs from monolithic component trees by adhering strictly to a **4-Layer Architecture** scoped into domain **Features**:

```
frontend/src/
├── Features/
│   ├── dashboard/                  # Domain: Analytics & Metrics
│   │   ├── services/               # [Layer 4] dashboard.api.ts
│   │   ├── context/                # [Layer 3] dashboardContext.tsx
│   │   ├── hooks/                  # [Layer 2] useDashboard.ts
│   │   ├── components/             # [Layer 1] StatCard, ProgressBar, CategoryBreakdown
│   │   └── pages/                  # [Layer 1] DashboardPage.tsx
│   │
│   ├── tasks/                      # Domain: Task Lifecycle (CRUD & Filters)
│   │   ├── services/               # [Layer 4] task.api.ts
│   │   ├── context/                # [Layer 3] taskContext.tsx
│   │   ├── hooks/                  # [Layer 2] useTasks.ts
│   │   ├── components/             # [Layer 1] TaskForm, TaskFilterBar, TaskCard, TaskList
│   │   └── pages/                  # [Layer 1] TasksPage.tsx
│   │
│   └── health/                     # Domain: Infrastructure Health
│       ├── services/               # [Layer 4] health.api.ts
│       ├── context/                # [Layer 3] healthContext.tsx
│       ├── hooks/                  # [Layer 2] useHealth.ts
│       ├── components/             # [Layer 1] HealthCard, HealthBadge
│       └── pages/                  # [Layer 1] HealthPage.tsx
│
├── shared/                         # Cross-feature reusables
│   ├── services/                   # apiClient.ts (Axios base instance)
│   └── components/                 # Navbar.tsx, Layout.tsx, NotFoundPage.tsx
│
├── types/                          # Shared domain data contracts
│   └── index.ts
│
├── App.tsx                         # Global Provider wiring & React Router routes
├── main.tsx                        # DOM Root mounting
└── index.css                       # Tailwind CSS v4 base & typography
```

### Layer Responsibilities:

| Layer | Responsibility | Key Rules |
| :--- | :--- | :--- |
| **1. UI Layer (`components/` & `pages/`)** | Pure presentation and user event capture. | Never makes direct network calls. Calls hooks from Layer 2. |
| **2. Hooks Layer (`hooks/`)** | Business logic, controller orchestration, lifecycle side-effects. | Consumes Context from Layer 3, executes API calls from Layer 4, manages `try/catch/finally`. |
| **3. State Layer (`context/`)** | Pure reactive store. | Holds data (`tasks`, `stats`, `health`), loading states, error states. No side effects. |
| **4. API Layer (`services/`)** | HTTP requests and network serialization. | Pure async functions returning typed promises. Uses `apiClient`. |

---

## 3. Backend Architecture (Modular MVC / Layered REST API)

The backend is built with **Node.js + Express 5 + TypeScript**, following clean modular separations:

```
backend/src/
├── config/config.ts                # Environment variable reader with strict validation
├── controllers/
│   └── task.controller.ts          # Core logic: createTask, getAllTasks, toggleTask, deleteTask, getHealth, getStats
├── db/db.ts                        # Mongoose database connector
├── middleware/
│   ├── error.middleware.ts         # Global centralized error handler
│   ├── notFound.middleware.ts      # 404 Route catch-all
│   └── multer.middleware.ts        # Multipart form data parser
├── models/
│   └── Task.ts                     # Schema, validators, enum constraints, timestamps
├── routes/
│   └── tasks.routes.ts             # Route definitions mapped to controller functions
├── Types/type.ts                   # Backend TypeScript interfaces
├── utils/
│   ├── ApiError.ts                 # Standardized Error class with HTTP status codes
│   ├── ApiResponse.ts              # Standardized JSON response envelope
│   └── asyncHandler.ts             # Promise wrapper eliminating try/catch boilerplate
├── App.ts                          # Express configuration, CORS, and route mounting
└── server.ts                       # Server bootstrap & port listener
```

### Key Architectural Utilities:
* **`asyncHandler`**: Wraps asynchronous controllers to catch unhandled rejections automatically and pass them to Express `next(error)`.
* **`ApiError`**: Custom error class capturing `statusCode` (e.g. `400 Bad Request`, `404 Not Found`, `503 Unavailable`).
* **`ApiResponse`**: Enforces a consistent JSON contract for all successful responses:
  ```json
  {
    "statusCode": 200,
    "message": "Tasks fetched successfully",
    "data": [ ... ],
    "success": true
  }
  ```

---

## 4. End-to-End Data & Code Flow

### Scenario A: Creating a New Task

```
User enters title & category in TaskForm
                      │
                      ▼
[TaskForm.tsx] validates non-empty title string
                      │ (Calls addTask())
                      ▼
[useTasks.ts] executes taskApi.createTask(dto)
                      │ (HTTP POST /api/v1/tasks/create)
                      ▼
[tasks.routes.ts] routes request to createTask controller
                      │
                      ▼
[task.controller.ts] validates body fields & trims input
                      │
                      ▼
[Task.ts] Mongoose creates document with status="Pending", timestamps=now
                      │
                      ▼
MongoDB persists task document & returns generated _id
                      │
                      ▼
Backend sends HTTP 201 ApiResponse back to client
                      │
                      ▼
[useTasks.ts] receives new task & prepends to state: [newTask, ...prev]
                      │
                      ▼
[TaskList.tsx] immediately displays new task at the top without page reload
```

---

### Scenario B: Live Health Monitoring & Ping

```
User visits /health or clicks "Ping Endpoint" / "Refresh"
                      │
                      ▼
[useHealth.ts] captures start time: performance.now()
                      │ (HTTP GET /api/v1/health)
                      ▼
[task.controller.ts] checks mongoose.connection.readyState === 1
                      │
                      ▼
Backend returns: { server: "healthy", database: "connected" }
                      │
                      ▼
[useHealth.ts] computes latency: Math.round(end - start) ms
                      │
                      ▼
[healthContext.tsx] updates health state & latency
                      │
                      ▼
[HealthCard.tsx] & [Navbar.tsx] display live green status badge & latency
```

---

## 5. Complete REST API Specification

**Base URL**: `http://localhost:3000/api/v1`

### 1. Health Check
* **Endpoint**: `GET /health`
* **Purpose**: Observability of server process and MongoDB connection pool.
* **Response (200 OK)**:
  ```json
  {
    "statusCode": 200,
    "message": "Server and database are healthy",
    "data": {
      "server": "healthy",
      "database": "connected"
    },
    "success": true
  }
  ```
* **Response (503 Service Unavailable)** (when DB is disconnected):
  ```json
  {
    "statusCode": 503,
    "message": "Database is unavailable",
    "data": {
      "server": "healthy",
      "database": "disconnected"
    },
    "success": false
  }
  ```

---

### 2. Dashboard Statistics Aggregation
* **Endpoint**: `GET /tasks/stats`
* **Purpose**: Aggregates all dashboard metrics on the server in parallel via `Promise.all`.
* **Response (200 OK)**:
  ```json
  {
    "statusCode": 200,
    "message": "Task statistics fetched successfully",
    "data": {
      "totalTasks": 12,
      "completedTasks": 8,
      "pendingTasks": 4,
      "completionPercentage": 67,
      "categoryCounts": {
        "Development": 6,
        "Design": 4,
        "Marketing": 2
      }
    },
    "success": true
  }
  ```

---

### 3. Fetch Tasks (With Filtering & Sorting)
* **Endpoint**: `GET /tasks`
* **Query Parameters**:
  * `status`: Optional (`Pending` | `Completed`)
  * `category`: Optional (`Development` | `Design` | `Marketing`)
* **Behavior**: Returns documents sorted in descending order by `createdAt` (`.sort({ createdAt: -1 })`).
* **Response (200 OK)**:
  ```json
  {
    "statusCode": 200,
    "message": "Tasks fetched successfully",
    "data": [
      {
        "_id": "67226f8d1c7a8b2345e12345",
        "title": "Set up production MongoDB cluster",
        "description": "Configure replica set and connection pool",
        "category": "Development",
        "status": "Completed",
        "createdAt": "2026-10-30T16:00:00.000Z",
        "updatedAt": "2026-10-30T16:30:00.000Z"
      }
    ],
    "success": true
  }
  ```

---

### 4. Create Task
* **Endpoint**: `POST /tasks/create`
* **Headers**: `Content-Type: application/json`
* **Payload**:
  ```json
  {
    "title": "Build responsive navigation",
    "category": "Development",
    "description": "Ensure mobile bottom nav displays smoothly"
  }
  ```
* **Validation**:
  * `title`: Required, non-empty, auto-trimmed.
  * `category`: Must be one of `Development`, `Design`, `Marketing`.
* **Response (201 Created)**:
  ```json
  {
    "statusCode": 201,
    "message": "Task Created Successfully",
    "data": {
      "_id": "6722709a1c7a8b2345e67890",
      "title": "Build responsive navigation",
      "category": "Development",
      "description": "Ensure mobile bottom nav displays smoothly",
      "status": "Pending",
      "createdAt": "2026-10-30T16:45:00.000Z"
    },
    "success": true
  }
  ```

---

### 5. Toggle Status
* **Endpoint**: `PATCH /tasks/:id/status`
* **Behavior**: Atomically flips `Pending` $\longleftrightarrow$ `Completed`.
* **Response (200 OK)**:
  ```json
  {
    "statusCode": 200,
    "message": "Task status updated successfully",
    "data": { ... }
  }
  ```

---

### 6. Delete Task
* **Endpoint**: `DELETE /tasks/:id`
* **Response (200 OK)**:
  ```json
  {
    "statusCode": 200,
    "message": "Task successfully deleted from database",
    "success": true
  }
  ```

---

## 6. Database Schema & Data Model

The task model is defined using **Mongoose** at `backend/src/models/Task.ts`:

```typescript
const taskSchema = new mongoose.Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    category: {
      type: String,
      enum: ['Development', 'Design', 'Marketing'],
      required: [true, 'Category is required'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Completed'],
      default: 'Pending',
    },
  },
  {
    timestamps: true, // Automatically provides createdAt and updatedAt
  }
);
```

---

## 7. Responsive UI Design Strategy

The application layout is built with **Tailwind CSS v4** and designed mobile-first:

1. **Dual Navigation Modes**:
   * **Desktop (`md:` breakpoint and above)**: Sticky header with horizontal navigation tabs and full health status badge.
   * **Mobile (`< md`)**: Sleek bottom navigation bar (`Dashboard`, `Tasks`, `Health`) for thumb navigation, with a compact status badge (`Online` / `Offline`) in the header.
2. **Flexible Grids**:
   * Summary metric cards dynamically scale from 1 column (`grid-cols-1`) on mobile to 3 columns (`sm:grid-cols-3`) on tablets and desktop.
3. **Touch-Optimized Controls**:
   * Buttons (`w-full sm:w-auto`) provide full touch targets on mobile and compact sizes on desktop.
4. **Horizontal Overflow Prevention**:
   * Root layout uses `overflow-x-hidden` and `min-w-0` to prevent horizontal scrolling or awkward layout snapping on narrow mobile screens.

---

## 8. Edge Cases & Error Handling Mechanisms

| Edge Case | Solution |
| :--- | :--- |
| **0 Total Tasks (Division-by-zero)** | `completionPercentage` safely checks `totalTasks === 0 ? 0 : Math.round(...)`. Displays `0%` cleanly without `NaN%`. |
| **Whitespace-only Titles (`"   "`)** | Caught on frontend before submission (`!title.trim()`) and rejected by backend controller with HTTP 400 `ApiError`. |
| **MongoDB Disconnection** | `/health` checks `mongoose.connection.readyState === 1`. Returns `503 Service Unavailable`; UI turns red without crashing. |
| **Unmatched Routes** | React Router catch-all route `*` displays a clean 404 page with navigation recovery buttons. |
| **Out-of-Order Task Display** | Both backend query (`.sort({ createdAt: -1 })`) and frontend hook enforce latest-first sorting at all times. |

