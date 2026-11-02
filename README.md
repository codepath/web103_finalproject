# MomentumAI / HabitFlow

CodePath WEB103 Final Project

Designed and developed by: Mithun Venkatesh Gowda

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

### Upcoming Implementation Issues

- [#1 Implement task REST API CRUD](https://github.com/HabitFlowProject/web103_finalproject/issues/1)
- [#3 Build Dashboard and Tasks pages](https://github.com/HabitFlowProject/web103_finalproject/issues/3)
- [#4 Implement habits and completion streaks](https://github.com/HabitFlowProject/web103_finalproject/issues/4)
- [#5 Add validation, filtering, sorting, and error handling](https://github.com/HabitFlowProject/web103_finalproject/issues/5)

## Features

### User Dashboard Overview:

A centralized analytics view displaying daily completion rates, active habit streaks, and productivity scores.

[gif goes here]

### Habit & Task CRUD Management:

Full create, read, update, and delete capabilities for managing daily habits, recurring tasks, and completion logs.

[gif goes here]

### Category Tagging System (Many-to-Many):

Organize habits and tasks into custom categories (e.g., Health, Career, Learning) with a join table allowing flexible categorization.

[gif goes here]

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
