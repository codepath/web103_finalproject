# Milestone 3

This document should be completed and submitted during **Unit 7** of this course. You **must** check off all completed tasks in this document in order to receive credit for your work.

## Checklist

This unit, be sure to complete all tasks listed below. To complete a task, place an `x` between the brackets.

You will need to reference the GitHub Project Management guide in the course portal for more information about how to complete each of these steps.

- [ ✅ ] In your repo, create a project board. 
  - *Please be sure to share your project board with the grading team's GitHub **codepathreview**. This is separate from your repository's sharing settings.*
- [ ✅ ] In your repo, create at least 5 issues from the features on your feature list.
- [ ✅ ] In your repo, update the status of issues in your project board.
- [ ✅ ] In your repo, create a GitHub Milestone for each final project unit, corresponding to each of the 5 milestones in your `milestones/` directory. 
  - [ ✅ ] Set the completion percentage of each milestone. The GitHub Milestone for this unit (Milestone 3 - Unit 7) should be 100% completed when you submit for full points.
- [ ✅ ] In `readme.md`, check off the features you have completed in this unit by adding a ✅ emoji in front of the feature's name.
  - [ ✅ ] Under each feature you have completed, include a GIF showing feature functionality.
- [ ✅ ] In this documents, complete all five questions in the **Reflection** section below.

## DEMO - Product Management
![Submit Demo](assets/demo.gif)

## Reflection

### 1. What went well during this unit?

Our group made strong progress on the core MVP and got the most important full-stack flow working end-to-end. We successfully set up the backend structure, seeded the PostgreSQL database, implemented the Entries API and Companies API, connected the frontend to the backend, and built a working feed plus a multi-step submission form. One major thing that went well was testing: instead of only checking whether the UI looked correct, we also verified the data directly through the API endpoints and SQL queries

### 2. What were some challenges your group faced in this unit?

A major challenge was coordination and timing. Some team members were not able to start as early in the week, so progress was uneven at first and some features ended up overlapping. Because of that, a lot of work lived on separate branches and open PRs rather than main, which made it harder to know what the latest working version was. Another challenge was integrating different implementations of the same feature, especially the multi-step submit form. We had to compare branches, preserve the tested backend logic, and carefully bring over UI ideas without breaking the data flow.

### Did you finish all of your tasks in your sprint plan for this week? If you did not finish all of the planned tasks, how would you prioritize the remaining tasks on your list?

We finished the highest-priority tasks for the week, especially the MVP functionality: browsing stories, submitting stories, backend APIs, seeded database, and frontend/backend integration. However, we did not finish every planned feature. Some items such as authentication, filtering/sorting, modal views, company pages, and the stats dashboard are still incomplete. Going forward, we would prioritize the remaining tasks based on what most improves the core user experience first. That means finishing the submit flow polish and UI consistency, then implementing feed improvements like modals or filtering, and only after that moving on to secondary features like stats or stretch goals.

### Which features and user stories would you consider “at risk”? How will you change your plan if those items remain “at risk”?

The most at-risk features are authentication, filtering/sorting, the entry modal, the company page, and the stats dashboard. These are at risk because they either require additional backend logic, more frontend complexity, or stronger team coordination to implement cleanly. If these items remain at risk, we will narrow our scope and focus first on making the current MVP feel complete and stable rather than spreading ourselves across too many unfinished features.

### 5. What additional support will you need in upcoming units as you continue to work on your final project?

The biggest support we need is continued coordination and clearer merge/review timing across the group. Having teammates review and merge PRs faster will help keep main closer to the real current state of the project. It would also help to continue using documented testing steps and branch workflow so everyone works from the same baseline. From a technical perspective, support around best practices for integrating larger frontend features, handling authentication, and organizing more advanced React state/UI flows would be especially useful as the project grows.
