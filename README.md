# MomentumAI / HabitFlow

CodePath WEB103 Final Project

Designed and developed by: Mithun Venkatesh Gowda, Bailey Perillo

🔗 Link to deployed app:

## About

### Description and Purpose

A full-stack productivity dashboard and habit tracker designed to help users build consistent daily routines, manage tasks efficiently, and receive AI-driven weekly coaching insights, bottleneck analysis, and automated priority suggestions to optimize their personal workflows.

### Inspiration

Inspired by the need for intelligent productivity tools that don't just act as static checklists, but actively provide actionable feedback and data-driven insights on habit formation and time management.

## Tech Stack

Frontend: React, Vite, React Router, Tailwind CSS

Backend: Node.js, Express.js, RESTful API

Database: PostgreSQL (with one-to-many and many-to-many relationships)

Deployment: Render

## Current Development Progress

The initial backend vertical slice is complete:

- PostgreSQL schema created for users, tasks, habits, habit completions,
  categories, and task-category relationships.
- Seed data added for a demo user, sample tasks, sample habits, and the
  Health, Career, Learning, Personal, and Finance categories.
- `GET /api/health` returns the backend health status.
- `GET /api/tasks` returns seeded tasks with their related categories.

### Task API Reference (backend only)

| Method | Route | Success | Notes |
| --- | --- | --- | --- |
| `GET` | `/api/health` | `200` | Health check |
| `GET` | `/api/tasks` | `200` | Supports filters and sorting below |
| `GET` | `/api/tasks/:id` | `200` | Includes related `categories` |
| `POST` | `/api/tasks` | `201` | Requires `title` and an existing `user_id` |
| `PATCH` | `/api/tasks/:id` | `200` | Partial update; `due_date: null` clears the date |
| `DELETE` | `/api/tasks/:id` | `204` | No response body |

Task fields: `title` (non-empty string), `description` (string),
`priority` (`low`, `medium`, `high`), `due_date` (`YYYY-MM-DD` or `null`),
`completed` (`true`/`false`), and `user_id` (create only).

List query parameters:

```text
GET /api/tasks?completed=false
GET /api/tasks?priority=high
GET /api/tasks?category=Learning
GET /api/tasks?sort=due_date            # due_date | priority | created_at | title
GET /api/tasks?sort=title&order=desc    # order is optional: asc | desc
```

Error responses use the shape `{ "error": "message" }`: `400` for invalid IDs,
fields, query parameters, or malformed JSON; `404` for missing tasks; and `500`
only for unexpected server failures.

The remaining CRUD, frontend, validation, filtering, and insights features are
planned for the next milestone and are not marked as completed below.

## GitHub Project Management

Repository: https://github.com/HabitFlowProject/web103_finalproject

Project board: https://github.com/orgs/HabitFlowProject/projects/2

### Completed Unit 7 Issues

- [#6 Complete HabitFlow planning documents](https://github.com/HabitFlowProject/web103_finalproject/issues/6)
- [#7 Create and configure HabitFlow project board](https://github.com/HabitFlowProject/web103_finalproject/issues/7)
- [#8 Present HabitFlow pitch and record feedback](https://github.com/HabitFlowProject/web103_finalproject/issues/8)

### Completed Backend Foundation

- [#2 Create PostgreSQL schema and seed data](https://github.com/HabitFlowProject/web103_finalproject/issues/2) ✅

The database schema and seed data are connected to the Express API. The
walkthrough below shows the health check and seeded task response without
exposing database credentials.

![Backend foundation walkthrough](images/backend-foundation.gif)

### Upcoming Implementation Issues

- [#1 Implement task REST API CRUD](https://github.com/HabitFlowProject/web103_finalproject/issues/1)
- [#3 Build Dashboard and Tasks pages](https://github.com/HabitFlowProject/web103_finalproject/issues/3)
- [#4 Implement habits and completion streaks](https://github.com/HabitFlowProject/web103_finalproject/issues/4)
- [#5 Add validation, filtering, sorting, and error handling](https://github.com/HabitFlowProject/web103_finalproject/issues/5)

## Features

### User Dashboard Overview:

A centralized analytics view displaying daily completion rates, active habit streaks, and productivity scores.

Planned feature; a walkthrough will be added after implementation.

### Habit & Task CRUD Management:

Full create, read, update, edit, and delete capabilities for managing daily habits, recurring tasks, and completion logs.

Planned feature; a walkthrough will be added after implementation.

### Category Tagging System (Many-to-Many):

Organize habits and tasks into custom categories (e.g., Health, Career, Learning) with a join table allowing flexible categorization.

Planned feature; a walkthrough will be added after implementation.

### AI Weekly Coaching & Insights Panel:

A dedicated view where users receive automated, LLM-generated summaries and recommendations based on their weekly habit completion patterns.

### Interactive Filtering & Sorting:

Filter tasks and habits by completion status, priority level, or category tags.

### Data Validation & Error Handling:

Robust backend validation on all POST and PATCH requests to ensure clean data input and graceful error messaging across the UI.

## Installation Instructions

### Backend

```bash
cd backend
npm install
npm run db:schema
npm run db:seed
npm start
```

The backend requires a local ignored `.env` file containing the Render
PostgreSQL connection variables:

```env
PGUSER=
PGPASSWORD=
PGHOST=
PGPORT=5432
PGDATABASE=
NODE_ENV=development
PORT=3000
```

Do not commit `.env` or database credentials.

### Backend Tests

The task API tests use Node's built-in test runner (Node 22 or newer) against
a dedicated local PostgreSQL database. The tests drop and recreate every table
on each run, so they refuse to start unless the database name ends in `_test`
and the host is not on Render.

```bash
createdb habitflow_test
cd backend
cp .env.test.example .env.test   # fill in local credentials; ignored by Git
npm test
```

Values in `backend/.env.test` take priority over `backend/.env` during tests,
so the development and Render databases are never touched.
