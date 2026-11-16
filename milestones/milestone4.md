# Milestone 4

This document should be completed and submitted during **Unit 8** of this course. You **must** check off all completed tasks in this document in order to receive credit for your work.

## Submission Tracking

- Project: **TripTogether**
- Tracking issue: [#20 — Complete Milestone 4 (Unit 8) documentation](https://github.com/codepath-12/web103_finalproject/issues/20)
- GitHub Milestone: [Milestone 4 - Unit 8](https://github.com/codepath-12/web103_finalproject/milestone/4), 100% complete
- Feature issues closed this unit: #14, #15, #16, #17, #18, and #19, each through its own merged pull request
- Progress report: [progress_report_4.md](progress_report_4.md)

## Checklist

This unit, be sure to complete all tasks listed below. To complete a task, place an `x` between the brackets.

- [x] Update the completion percentage of each GitHub Milestone. The milestone for this unit (Milestone 4 - Unit 8) should be 100% completed when you submit for full points.
- [x] In `readme.md`, check off the features you have completed in this unit by adding a ✅ emoji in front of the feature's name.
  - [x] Under each feature you have completed, include a GIF showing feature functionality.
- [x] In this document, complete all five questions in the **Reflection** section below.

## Reflection

### 1. What went well during this unit?

All six core features from the README now work end to end: creating and managing trips, joining with an invite code, activities, the daily itinerary with a date filter, voting, and shared expenses. Each feature went through its own issue, branch, and pull request, and each has a GIF in the README. The server now exposes a consistent `/api` router with shared middleware for the acting demo user and trip membership, which kept the later features quick to add.

### 2. What were some challenges your group faced in this unit?

The database connection forced SSL, which broke a local PostgreSQL setup, so it now applies only to remote hosts. PostgreSQL returned BIGINT ids as strings and DATE values as timestamps, which caused subtle bugs until the connection parsed them as numbers and plain date strings. Because the demo user selector is not real authentication, the API has to enforce who may edit or delete things (organizers for trips, creators for activities and expenses) with the acting user's id instead of relying on sessions. The Vite proxy also rewrote `/api`, which did not match the documented routes, so it was removed.

### Did you finish all of your tasks in your sprint plan for this week? If you did not finish all of the planned tasks, how would you prioritize the remaining tasks on your list?

Yes. Every issue planned for this unit (#14 to #19) is finished and merged, and the Milestone 4 GitHub Milestone is at 100%. The next priorities, in order, are deploying the client and server to Render with a hosted PostgreSQL database, adding automated API tests, and polishing the interface (loading and error states, mobile layout).

### Which features and user stories would you consider “at risk”? How will you change your plan if those items remain “at risk”?

Deployment is the biggest risk, since the app has so far only run against a local database and the Render setup, environment variables, and CORS and proxy configuration are untested. The demo user selector is not secure authentication, so any visitor can act as any seeded user; this is documented as demonstration only, and real login would be stretch work. There are no automated tests for the API yet. If deployment slips, the plan is to deploy the server and database first, confirm the health check, and then deploy the client against it before adding any new features.

### 5. What additional support will you need in upcoming units as you continue to work on your final project?

Help from a TA on the Render deployment would be most useful, in particular hosting a single-page React app next to an Express API and keeping the API and client origins consistent. A review of how to protect trip data without full authentication would also help, because the demo user selector only identifies the acting user.
