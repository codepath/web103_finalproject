# Milestone 4

This document should be completed and submitted during **Unit 8** of this course. You **must** check off all completed tasks in this document in order to receive credit for your work.

## Checklist

This unit, be sure to complete all tasks listed below. To complete a task, place an `x` between the brackets.

- [ ] Update the completion percentage of each GitHub Milestone. The milestone for this unit (Milestone 4 - Unit 8) should be 100% completed when you submit for full points.
- [ ] In `readme.md`, check off the features you have completed in this unit by adding a ✅ emoji in front of the feature's name.
  - [ ] Under each feature you have completed, include a GIF showing feature functionality.
- [ ] In this document, complete all five questions in the **Reflection** section below.

## Reflection

### 1. What went well during this unit?

We finished the full task flow end to end. The Express API now validates every
request and returns clear status codes (400, 404, 201, 204), and it is covered
by 74 automated tests that run against a separate test database so our real
data is never touched. On the frontend we built the React app shell with React
Router, a Tasks page with create, edit, delete, and complete, a task details
page, category tagging, filtering and sorting, and a dashboard whose numbers
come from real data. Working in one branch per phase with a pull request at
the end of each phase kept our changes small and easy to review.

### 2. What were some challenges your group faced in this unit?

Our biggest challenge was Git and GitHub coordination. Because our repository
is a fork of the CodePath template, one pull request was accidentally opened
against CodePath's repository instead of ours, and some work ended up on a
branch that had not been merged into main yet. We fixed this by checking the
base repository on every pull request and agreeing on one branch per phase.
We also found that our seed data did not link any tasks to categories, and
that the task form had no way to choose categories, so we added both. Making
backend tests safe was another challenge: the tests reset the database, so we
added a guard that refuses to run unless the database is a dedicated test
database.

### Did you finish all of your tasks in your sprint plan for this week? If you did not finish all of the planned tasks, how would you prioritize the remaining tasks on your list?

We did not finish everything. We completed the task API, the Tasks and
Dashboard pages, and validation, filtering, sorting, and error handling
(issues #1, #2, #3, and #5). Habits and completion streaks (#4) were moved to
the final milestone so we could finish the task flow properly instead of
leaving several features half done. Our priorities for the remaining work are:
(1) habits CRUD and completion streaks, (2) adding habit streaks to the
dashboard and building the weekly insights page, (3) deploying the frontend
and backend to Render, and (4) recording the remaining GIFs and final
documentation.

### Which features and user stories would you consider “at risk”? How will you change your plan if those items remain “at risk”?

Habits and streaks (#4) and weekly insights are at risk because they are
the largest remaining features and both depend on habit completion data.
Deployment is also at risk because we have not yet deployed the frontend and
backend together on Render. If these stay at risk, we will build habits CRUD
and "complete today" first and keep the streak calculation simple (consecutive
days), calculate insights from the database instead of using AI, and deploy as
early as possible in the unit so there is time to fix configuration problems.

### 5. What additional support will you need in upcoming units as you continue to work on your final project?

We would like guidance on deploying a React frontend and an Express backend
as separate Render services, including environment variables, CORS, and
making direct links to frontend routes work. We would also appreciate feedback
on a simple, reliable way to calculate habit streaks, and a quick review of
our project board and milestones to confirm they meet the grading
requirements.
