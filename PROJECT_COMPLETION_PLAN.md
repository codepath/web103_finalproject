# HabitFlow Project Completion Plan

This document is the implementation guide for completing the CodePath WEB103
HabitFlow final project. Use it with an AI coding assistant or as a personal
development checklist.

## Project Overview

HabitFlow is a full-stack productivity dashboard and habit tracker. Users
should be able to manage tasks and habits, track completion streaks, organize
work with categories, and review calculated productivity insights.

The required technical stack is:

- Frontend: React, Vite, and React Router
- Backend: Node.js and Express
- Database: PostgreSQL
- Deployment: Render

Real AI/LLM integration and GitHub OAuth are optional stretch features. Do not
prioritize them over the required application functionality.

## Repository and GitHub Resources

- Repository:
  https://github.com/HabitFlowProject/web103_finalproject
- Organization:
  https://github.com/HabitFlowProject
- Project board:
  https://github.com/orgs/HabitFlowProject/projects/2
- Issues:
  https://github.com/HabitFlowProject/web103_finalproject/issues

## Current Repository State

The repository currently contains:

```text
backend/
  config/db.js
  scripts/runSql.js
  sql/schema.sql
  sql/seed.sql
  src/app.js
  src/server.js
  src/controllers/taskController.js
  src/models/taskModel.js
  src/routes/taskRoutes.js
images/
planning/
milestones/
README.md
.gitignore
```

The backend already provides:

```text
GET    /api/health
GET    /api/tasks
GET    /api/tasks/:id
POST   /api/tasks
PATCH  /api/tasks/:id
DELETE /api/tasks/:id
```

The database schema already includes:

```text
users
tasks
habits
habit_completions
categories
task_categories
```

The current database relationships include:

- Users to tasks: one-to-many.
- Users to habits: one-to-many.
- Habits to completions: one-to-many.
- Tasks to categories: many-to-many through `task_categories`.

There is currently no React frontend. The frontend must be added under
`frontend/`.

## Working Rules

1. Inspect the repository before changing files.
2. Preserve unrelated work and existing contributors' changes.
3. Keep changes small and reviewable.
4. Use the existing PostgreSQL environment variables:
   - `PGUSER`
   - `PGPASSWORD`
   - `PGHOST`
   - `PGPORT`
   - `PGDATABASE`
5. Never read, print, commit, or expose the values in `backend/.env`.
6. Keep secrets, credentials, and tokens out of Git.
7. Follow existing naming, formatting, and error-handling patterns.
8. Use proper types, validation, and explicit error responses.
9. Run focused validation after each phase.
10. Do not close a GitHub issue until its behavior works and has been tested.
11. Do not mark a README feature complete until it is implemented and
    demonstrated.
12. Prefer calculated weekly insights over external AI integration.
13. Do not add authentication until the required application is working.
14. Do not use broad silent catches or success-shaped error fallbacks.
15. Keep the final Git worktree clean.

## Phase 1: Stabilize the Task Backend

Inspect:

- `backend/config/db.js`
- `backend/sql/schema.sql`
- `backend/sql/seed.sql`
- `backend/src/models/taskModel.js`
- `backend/src/controllers/taskController.js`
- `backend/src/routes/taskRoutes.js`

Tasks:

1. Remove or intentionally use the empty duplicate route file
   `backend/src/routes/tasks.js`.
2. Validate numeric task IDs before database queries.
3. Return `400` for invalid IDs and input.
4. Return `404` for missing tasks.
5. Return `201` for successful creation.
6. Return `204` for successful deletion.
7. Return `500` only for unexpected server failures.
8. Ensure `GET /api/tasks/:id` includes related categories.
9. Validate task titles as non-empty strings.
10. Validate `user_id` as a valid existing user.
11. Validate priority as `low`, `medium`, or `high`.
12. Validate dates and boolean completion values.
13. Support partial PATCH updates.
14. Allow nullable fields such as `due_date` to be cleared intentionally.
15. Add filtering and sorting:

```text
GET /api/tasks?completed=false
GET /api/tasks?priority=high
GET /api/tasks?category=Learning
GET /api/tasks?sort=due_date
```

## Phase 2: Add Backend Tests

Add focused tests for:

- Health endpoint.
- Listing tasks.
- Retrieving a task.
- Invalid task IDs.
- Missing tasks.
- Creating a valid task.
- Rejecting a blank title.
- Rejecting an invalid priority.
- Updating a task.
- Rejecting invalid updates.
- Deleting a task.
- Deleting a missing task.
- Filtering.
- Sorting.

Use a safe test strategy that does not destroy real development or production
data. Add an `npm test` command or document the selected test command.

After this phase, verify:

```bash
node --check src/app.js
npm test
```

from the `backend/` directory, using the repository's actual test setup.

## Phase 3: Create the React Frontend

Create this general structure:

```text
frontend/
  package.json
  index.html
  src/
    main.jsx
    App.jsx
    api/
      client.js
      tasks.js
      habits.js
    components/
      Layout.jsx
      Navigation.jsx
      TaskCard.jsx
      TaskForm.jsx
      TaskList.jsx
      HabitCard.jsx
      HabitForm.jsx
      LoadingState.jsx
      ErrorMessage.jsx
      Modal.jsx
    pages/
      DashboardPage.jsx
      TasksPage.jsx
      TaskDetailsPage.jsx
      HabitsPage.jsx
      HabitDetailsPage.jsx
      InsightsPage.jsx
    styles/
      app.css
```

Configure React Router routes:

```text
/
/tasks
/tasks/:taskId
/habits
/habits/:habitId
/insights
```

Build the shared layout and navigation first. Then connect the Tasks page to
the backend and verify the full task flow before beginning habits.

## Phase 4: Build Task Features

The Tasks page must support:

- Listing tasks.
- Creating a task.
- Editing a task.
- Deleting a task.
- Marking a task complete.
- Showing priority, due date, and categories.
- Loading state.
- Empty state.
- Error state.

Use a modal or slide-out panel for task creation and editing. Add the dynamic
task details route at `/tasks/:taskId`.

Validate on both the frontend and backend:

- Required title.
- Valid priority.
- Valid date.
- Valid completion value.

## Phase 5: Implement Habits and Streaks

Add backend routes:

```text
GET    /api/habits
GET    /api/habits/:id
POST   /api/habits
PATCH  /api/habits/:id
DELETE /api/habits/:id
POST   /api/habits/:id/completions
GET    /api/habits/:id/completions
```

Implement:

- Habit CRUD.
- Completion records.
- Duplicate completion prevention.
- Completion history.
- Current streak calculation.
- Same-page “Complete today” interaction.

Build:

```text
/habits
/habits/:habitId
```

The habits page should show the habit name, frequency, current streak, edit
action, delete action, and completion action.

## Phase 6: Dashboard and Insights

Build the dashboard using calculated database-backed values:

- Total tasks.
- Completed tasks.
- Incomplete tasks.
- Overdue tasks.
- Completion percentage.
- Active habit streak count.

Build the Insights page using calculated weekly information:

- Tasks completed this week.
- Habit completions this week.
- Most-used category.
- Current streak summary.
- Overdue task count.

Do not label calculated summaries as AI-generated unless real AI integration is
actually implemented.

## Phase 7: Validation, Filtering, Sorting, and UX

Implement task filters for:

- Completion status.
- Priority.
- Category.
- Due date.

Implement sorting by:

- Due date.
- Priority.
- Created date.
- Title.

Handle these states clearly in the frontend:

- Loading.
- Empty results.
- Network failure.
- Invalid input.
- Missing task.
- Missing habit.
- Server failure.
- Delete failure.

Use clear messages such as:

```text
Task title is required.
Task not found.
Unable to load tasks. Please try again.
```

## Phase 8: Deployment

Deploy the backend and frontend to Render.

Backend requirements:

- Use the Render PostgreSQL database.
- Configure environment variables securely.
- Preserve SSL behavior for Render.
- Respect the Render-provided `PORT`.
- Configure CORS when frontend and backend use different origins.

Frontend requirements:

- Use a production API base URL.
- Do not hardcode `localhost` for production.
- Verify direct navigation to frontend routes.

Verify at minimum:

```text
GET /api/health
GET /api/tasks
GET /api/habits
```

Update the README with the live frontend URL, backend URL, local setup steps,
production notes, and environment variable names only.

## GitHub Project Updates

Current issue status:

### Closed

- #1 — Implement task REST API CRUD
- #2 — Create PostgreSQL schema and seed data
- #6 — Complete HabitFlow planning documents
- #7 — Create and configure HabitFlow project board
- #8 — Present HabitFlow pitch and record feedback

### Open

- #3 — Build Dashboard and Tasks pages
- #4 — Implement habits and completion streaks
- #5 — Add validation, filtering, sorting, and error handling

Update the board as follows:

1. Move #3 to `In Progress` when frontend work begins.
2. Keep #4 and #5 in `Todo` until their work begins.
3. Close #3 only after dashboard and task pages work.
4. Close #4 only after habit CRUD and streaks work.
5. Close #5 only after validation, filtering, sorting, and error handling work.
6. Assign issues to the correct GitHub milestone.
7. Add issue comments summarizing completed work.
8. Keep `codepathreview` access to the project board.

## Documentation and Evidence

Update these files as the project progresses:

- `README.md`
- `milestones/milestone4.md`
- `milestones/milestone5.md`

README updates should include:

- Live application URL.
- Backend URL.
- Local setup instructions.
- Production setup notes.
- API route summary.
- Completed feature markers.
- GIF evidence for completed features.
- Project board link.
- Repository link.

Record GIFs under `images/`. At minimum, demonstrate:

1. Dashboard loading.
2. Task creation.
3. Task editing.
4. Task completion.
5. Task deletion.
6. Filtering.
7. Sorting.
8. Validation failure.
9. Habit completion.
10. Streak update.
11. Weekly insights.
12. Final complete walkthrough.

Never show `.env`, passwords, database credentials, API keys, or private
tokens in screenshots or GIFs.

## Final Acceptance Criteria

The project is complete only when:

- Backend starts successfully.
- Frontend starts successfully.
- Frontend communicates with backend.
- Tasks support GET, POST, PATCH, and DELETE.
- Habits support CRUD.
- Habit completion updates streaks.
- Database relationships are used by the application.
- Categories are displayed and usable.
- Filtering works.
- Sorting works.
- Invalid input is rejected.
- Missing records return useful errors.
- Dashboard values come from real data.
- Insights come from real data.
- The application is deployed.
- README contains the deployment URL.
- GIF evidence exists for completed features.
- GitHub issues and project cards are accurate.
- Milestone 4 and Milestone 5 documents are complete.
- No secrets are committed.
- Final `git status` is clean.

## Required Workflow

After every phase:

1. Inspect changed files.
2. Run the smallest relevant test or validation command.
3. Run syntax checks or a production build.
4. Run `git diff --check`.
5. Update documentation.
6. Report files changed, commands run, results, and remaining risks.
7. Do not proceed if the current phase is broken.

Recommended order:

```text
1. Stabilize and test the task API
2. Create the React app shell
3. Build the task UI
4. Build the dashboard
5. Build habits and streaks
6. Add filtering, sorting, validation, and errors
7. Add insights
8. Deploy
9. Record GIFs
10. Update README and milestone documents
11. Update GitHub issues and the project board
12. Perform final verification
```
