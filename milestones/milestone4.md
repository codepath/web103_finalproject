# Milestone 4

This document should be completed and submitted during **Unit 8** of this course. You **must** check off all completed tasks in this document in order to receive credit for your work.

## Checklist

This unit, be sure to complete all tasks listed below. To complete a task, place an `x` between the brackets.

- [x] Update the completion percentage of each GitHub Milestone. The milestone for this unit (Milestone 4 - Unit 8) should be 100% completed when you submit for full points.
- [x] In `readme.md`, check off the features you have completed in this unit by adding a ✅ emoji in front of the feature's name.
  - [ ] Under each feature you have completed, include a GIF showing feature functionality.
- [x] In this document, complete all five questions in the **Reflection** section below.

## Reflection

### 1. What went well during this unit?

We finished every feature issue we planned for this sprint and merged each one through its own pull request (#33–#38). The backend now supports filtering events by activity type, budget tier, and tag, plus creating, editing, and deleting events. Each event and its tags are saved in a single database transaction, so a failed save never leaves a half-created event behind. On the frontend we added a filter bar to the dashboard, a Create Event form with a multi-tag picker, and Edit and Delete buttons on the event page that reuse the same form. Keeping each issue small, with one branch and one PR per issue, made reviews quick and kept merge conflicts rare.

### 2. What were some challenges your group faced in this unit?

Several issues depended on each other. For example, the edit page reuses the create form, so we had to merge pull requests in the right order and keep branches up to date with `main`. We also had to keep the budget tier price ranges consistent between the client and the server. Converting event times between the database and the form's date-time inputs needed care so that saving an event without changes doesn't shift its times. Finally, we felt pressure to add extra features, such as a distance filter and real venue data, and had to decide what to postpone to avoid scope creep.

### Did you finish all of your tasks in your sprint plan for this week? If you did not finish all of the planned tasks, how would you prioritize the remaining tasks on your list?

Yes. We finished all six feature issues planned for Milestone 4: the filter API, the dashboard filter bar, the create, update, and delete API routes, the Create Event form, and the Edit/Delete flow. We moved the distance/radius filter, the Quick-View Slide-Out Modal, strict form validation, and deployment to Milestone 5 so we could finish the core features first. In the next sprint, we will start with deployment to Render, then form validation, then the Quick-View modal, and finally the distance filter.

### Which features and user stories would you consider “at risk”? How will you change your plan if those items remain “at risk”?

The distance/radius filter (user story 3) is the most at risk, because it needs the user's location and distance calculations. The Quick-View Slide-Out Modal (user story 4) and photo uploads to cloud storage (user story 12) are also at risk. Deployment to Render carries some risk as well, since event times may display differently once the server runs in UTC. If these remain at risk, we will prioritize deploying a stable app with validated forms, simplify the distance filter to a city filter, and drop photo uploads in favor of image URLs.

### 5. What additional support will you need in upcoming units as you continue to work on your final project?

We would like guidance on deploying a React and Express app with PostgreSQL to Render, including environment variables and serving the client build. We would also like advice on storing event times with time zones so that they display correctly after deployment. Finally, we need confirmation that our GitHub Project board is shared correctly with the codepathreview grading account.
