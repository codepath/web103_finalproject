# Milestone 1

This document should be completed and submitted during **Unit 5** of this course. You **must** check off all completed tasks in this document in order to receive credit for your work.

## Checklist

This unit, be sure to complete all tasks listed below. To complete a task, place an `x` between the brackets.

- [x] Read and understand all required features
  - [x] Understand you **must** implement **all** baseline features and **two** custom features
- [x] In `readme.md`: update app name to your app's name (**WayGo**)
- [x] In `readme.md`: add all group members' names (**Venkatesh Kelam**, [Partner Name])
- [x] In `readme.md`: complete the **Description and Purpose** section
- [x] In `readme.md`: complete the **Inspiration** section
- [x] In `readme.md`: list a name and description for all features (minimum 6 for full points) you intend to include in your app (we listed 12)
- [x] In `planning/user_stories.md`: add all user stories (minimum 10 for full points)
- [x] In `planning/user_stories.md`: use 1–3 unique user roles in your user stories (Passenger, Driver, Admin)
- [x] In this document, complete all three questions in the **Reflection** section below

## Reflection

### 1. What went well during this unit?
We aligned quickly on a clear, real-world concept (**WayGo**, a carpooling app) and mapped it to the rubric. We defined a concise feature set focused on discovery (filters + sorting), a smooth booking flow (join/leave), and safety (future-date validation). Roles and data relationships were straightforward (users ↔ rides via a join table, routes → rides), making it easy to plan our API and UI. We also set up the repo, division of work, and a branch workflow that will scale to development.

### 2. What were some challenges your group faced in this unit?
Scope control. Carpooling invites features like maps, chat, payments, and verification, which can bloat the MVP. We decided to defer real-time chat, live maps, and payments, and instead focus on course-critical items: RESTful CRUD, many-to-many passengers, filtering with URL sync, quick-view modal, and validation (future times, seat caps). Another challenge was choosing the right filters to implement first; we selected origin/destination, date window, seats≥, price range, and driver rating.

### 3. What additional support will you need in upcoming units as you continue to work on your final project?
1) Feedback on our ERD (especially ratings aggregation and route normalization).  
2) Best practices for performant server-side filtering & pagination in Postgres (indexes, JOIN patterns).  
3) UI/UX guidance for an accessible modal (focus trap, keyboard nav) and filter a11y (ARIA patterns).  
4) Deployment pointers for Render (service health checks, environment variables for DB).  
If time allows, advice on safely adding a map view (stretch) later.
