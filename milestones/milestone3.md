# Milestone 3

This document should be completed and submitted during **Unit 7** of this course. Completed requirements are checked below; pending or unverified requirements remain unchecked.

## Submission Tracking

- Project: **TripTogether**
- Tracking issue: [#11 — Complete Milestone 3 (Unit 7) requirements and submission documentation](https://github.com/codepath-12/web103_finalproject/issues/11)
- Working branch: `yingshu/milestone3`
- Milestone 3 task status: **100% complete** — all 5 tasks assigned to Milestone 3 are completed. This refers to this unit's assigned tasks, not completion of all five project milestones or every planned application feature.
- Scope: project management, feature completion evidence, and all five reflection answers. Issue #11 tracks this entire milestone; it does not replace the required feature issues.

## Checklist

- [ ] In your repo, create a project board.
  - Board link and current status: not yet verified.
  - [ ] Share the project board with the grading team's GitHub **codepathreview**. This is separate from repository sharing settings.
- [ ] In your repo, create at least 5 issues from the features on your feature list.
  - Only the overall tracking issue #11 was found when checking the repository. The feature issues below still need to be created or verified; replace these proposed titles with the actual issue titles and links:
    1. Create and Manage Trips — pending feature issue.
    2. Join Trips and View Members — pending feature issue.
    3. Suggest and Manage Activities — pending feature issue.
    4. View a Daily Itinerary — pending feature issue.
    5. Vote on Activities — pending feature issue.
    6. Track Shared Expenses — pending feature issue.
- [ ] In your repo, update the status of issues in your project board.
  - Add the feature issues and track their actual progress using the board's status fields.
- [ ] In your repo, create a GitHub Milestone for each final project unit, corresponding to each of the 5 milestones in your `milestones/` directory.
  - Existing milestones:
    1. [Milestone 1 - Unit 5 DONE!](https://github.com/codepath-12/web103_finalproject/milestone/1)
    2. [Milestone 2 - Unit 6 DONE!](https://github.com/codepath-12/web103_finalproject/milestone/2)
    3. [Milestone 3 - Unit 7](https://github.com/codepath-12/web103_finalproject/milestone/3)
  - Still to create or verify:
    4. Milestone 4 - Unit 8
    5. Milestone 5 - Unit 9
  - [ ] Verify the completion percentage of each milestone. The GitHub Milestone for this unit (Milestone 3 - Unit 7) should be 100% completed when submitting for full points.
    - Milestone 3 is **100% complete**: all 5 assigned tasks are completed, with 0 remaining. The other project milestones have their own tasks and completion status.
- [ ] In `README.md`, check off features completed in this unit by adding a ✅ emoji in front of the feature's name.
  - The current branch contains frontend routing, page scaffolding, database schema and seed data, and an initial backend trips query. These establish the foundation but do not demonstrate completion of the full user-facing features.
  - [ ] Under each completed feature, include a GIF showing feature functionality.
    - A recorded GIF has been added locally under `docs/gifs/`. Its demonstrated functionality still needs to be reviewed and matched to the appropriate README section.
    - A local GIF alone does not complete this requirement; it must be committed and embedded under the relevant completed feature in README.md.
- [x] In this document, complete all five questions in the **Reflection** section below.

## Reflection

### 1. What went well during this unit?

We moved from the planning documents toward an application foundation. The React app now has routes for the trips list, creating a trip, trip details, expenses, and trip settings, along with a shared layout. The backend has an Express server and an initial route for querying trips from PostgreSQL. The database schema and seed script translate our ERD into tables and sample data. We also prepared a recorded GIF and created an overall tracking issue for the Milestone 3 submission.

### 2. What were some challenges your group faced in this unit?

One challenge is coordinating work across branches so that the frontend, backend, and database fit together. The frontend routes currently provide page scaffolding, while most feature APIs and interactions still need implementation and integration. We also needed to distinguish application setup from completed user stories: a working route or page does not mean that creating, editing, voting, or tracking expenses is finished. Another challenge is organizing the GitHub submission requirements, because the project board, feature issues, milestones, README demonstrations, and reflection document all require separate updates.

### 3. Did you finish all of your tasks in your sprint plan for this week? If you did not finish all of the planned tasks, how would you prioritize the remaining tasks on your list?

Yes. We completed all 5 tasks assigned to Milestone 3, bringing this unit's milestone to 100% completion with no assigned tasks remaining. This completes the Milestone 3 sprint scope; it does not mean that all five project milestones or all planned application features are finished. In upcoming units, we will prioritize an end-to-end trip workflow, then activity management and the daily itinerary, followed by voting and shared expenses. The separate submission requirements listed above retain their own completion or verification status.

### 4. Which features and user stories would you consider “at risk”? How will you change your plan if those items remain “at risk”?

Trip membership, activity voting, and shared expenses are at risk because they depend on the core trip workflow, user context, and database-backed API integration. Ownership checks, duplicate-vote prevention, and validation also need coordination between the API and database. If these items remain at risk, we would prioritize a smaller, working trip-and-activity flow before extending it. We would use the planned seeded demo-user approach, defer optional secure authentication and automatic debt settlement, and divide the remaining features into smaller issues with clear owners and acceptance criteria. Unfinished features would remain unchecked rather than being presented as complete.

### 5. What additional support will you need in upcoming units as you continue to work on your final project?

We need guidance on connecting React forms and page data to the Express API, implementing validation and membership or ownership checks, and handling database errors in the interface. Feedback on task priorities and API contracts would help the team integrate work across branches. We also need to verify the project board's access for codepathreview and the remaining GitHub milestone setup. Later, we will need support deploying the frontend, backend, and PostgreSQL database on Render and checking the complete user workflows before recording final feature demonstrations.
