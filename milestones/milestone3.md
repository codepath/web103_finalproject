# Milestone 3

This document should be completed and submitted during **Unit 7** of this course. You **must** check off all completed tasks in this document in order to receive credit for your work.

## Checklist

This unit, be sure to complete all tasks listed below. To complete a task, place an `x` between the brackets.

You will need to reference the GitHub Project Management guide in the course portal for more information about how to complete each of these steps.

- [x] In your repo, create a project board.
  - Project board: `web103_finalproject`.
  - The project owner confirmed that the grading account `codepathreview` has been granted access.
- [x] In your repo, create at least 5 issues from the features on your feature list.
  - List the title of each issue created by our team:
    1. Assignment Creation (#42)
    2. Study Plan Creation (#43)
    3. Course Tracking (#44)
    4. Comments (#45)
    5. Filtering (#49)
- [x] In your repo, update the status of issues in your project board.
  - Issues are organized into Backlog, Ready, In progress, In review, and Done.
- [x] In your repo, create a GitHub Milestone for each final project unit, corresponding to each of the 5 milestones in your `milestones/` directory.
  - List the name of each milestone created:
    1. 1
    2. 2
    3. 3
    4. 4
    5. 5
  - [ ] Set the completion percentage of each milestone. The GitHub Milestone for this unit (Milestone 3 - Unit 7) should be 100% completed when you submit for full points.
    - Current progress as of October 31, 2026: 41% complete, with 10 closed and 14 open issues.
    - The team plans to finish priority issues and move unfinished work to later milestones as appropriate.
- [ ] In `readme.md`, check off the features you have completed in this unit by adding a ✅ emoji in front of the feature's name.
  - [ ] Under each feature you have completed, include a GIF showing feature functionality.
- [x] In this document, complete all five questions in the **Reflection** section below.

## Reflection

### 1. What went well during this unit?

During this unit, our team made progress in establishing the foundation for StudySync. We organized our development tasks using GitHub issues, a project board, and five milestones. We also improved our development workflow through pull requests, code reviews, and automated testing.

For Course Tracking, we created a user story and implemented initial API endpoints for retrieving courses. We also added automated endpoint tests, a reusable course input validation utility, and five additional validation tests. Both Course Tracking pull requests (#66 and #67) were reviewed, passed the required GitHub Actions checks, and were successfully merged into the main branch.

Our team also integrated a shared PostgreSQL connection pool through PR #65 and added the deployed backend URL to the README through PR #64. These changes established a stronger foundation for the next phase of development.

### 2. What were some challenges your group faced in this unit?

One of our main challenges was coordinating development across multiple contributors. Several pull requests involved related backend files, so we needed to communicate about merge order and dependencies to avoid conflicts.

Another challenge was that some features depended on infrastructure that was still being developed. For example, Course Tracking required a shared database connection before its API endpoints could be connected to persistent data.

We also faced time constraints while balancing feature implementation, testing, documentation, and project management. GitHub issues, pull request discussions, and code reviews helped us clarify responsibilities and identify blockers.

### 3. Did you finish all of your tasks in your sprint plan for this week? If you did not finish all of the planned tasks, how would you prioritize the remaining tasks on your list?

We completed several important tasks, but not all planned features were fully implemented.

For Course Tracking, we completed the user story, initial API placeholders, automated endpoint tests, and input validation tests. These changes have been merged into the main branch. However, the feature still requires database integration, complete course management functionality, and the ability to link courses to assignments.

Our next priorities are completing foundational features such as Dashboard (#41), Assignment Creation (#42), and Study Plan Creation (#43), while continuing development of the core backend and frontend.

We will prioritize tasks based on dependencies and importance, focusing first on the functionality needed for a working application. After that, we will address additional features, integration testing, documentation, and demonstrations.

### 4. Which features and user stories would you consider “at risk”? How will you change your plan if those items remain “at risk”?

Course Tracking, Assignment Creation, and Study Plan Creation remain at risk because they depend on coordinated development across the database, backend API, and frontend.

Other features, such as Filtering, Comments, and Assignment Completion, could also be delayed if the underlying assignment and course functionality is not completed.

To reduce these risks, we plan to break larger features into smaller tasks, prioritize core functionality, and identify dependencies earlier. We will also use our GitHub project board to track progress and communicate blockers.

If some features cannot be completed within the current milestone, we will reassess their priority and move unfinished work to future milestones, as discussed by the team.

### 5. What additional support will you need in upcoming units as you continue to work on your final project?

Our team would benefit from continued technical guidance on connecting PostgreSQL to Express API endpoints, integrating the frontend with backend services, and deploying the complete StudySync application.

We would also appreciate support with testing database-dependent features, resolving merge conflicts, and coordinating development tasks across multiple team members.

Additional feedback from our teaching staff on feature prioritization, project scope, and milestone requirements would help us focus on the most important functionality and prepare for the final project demonstration.
