# Milestone 2

This document should be completed and submitted during **Unit 6** of this course. You **must** check off all completed tasks in this document in order to receive credit for your work.

## Checklist

This unit, be sure to complete all tasks listed below. To complete a task, place an `x` between the brackets.

- [x] In `planning/wireframes.md`: add wireframes for at least three pages in your web app.
  - [x] Include a list of pages in your app
- [x] In `planning/entity_relationship_diagram.md`: add the entity relationship diagram you developed for your database.
  - [x] Your entity relationship diagram should include the tables in your database.
- [ ] Prepare your three-minute pitch presentation, to be presented during Unit 7 (the next unit).
  - [ ] You do **not** need to submit any materials in advance of your pitch.
- [x] In this document, complete all three questions in the **Reflection** section below

## Reflection

### 1. What went well during this unit?

We turned the written plan into visuals. The wireframes for the trips list, create trip, trip details, and expenses pages made the user flow concrete, including where voting, date filtering, and validation messages appear. The ERD mapped directly onto the planned features: `trip_members` and `activity_votes` cover the two many-to-many relationships, and trips have one-to-many relationships with activities and expenses.

### 2. What were some challenges your group faced in this unit?

The main challenge was deciding how much to put on the trip details page, since members, the itinerary, voting, and the activity form all live there. We also had to decide how to store invite codes and how to handle activities without a date. Without authentication, we have to decide how the demo-user selector enforces organizer-only actions. Fitting the pitch into three minutes is another challenge.

### 3. What additional support will you need in upcoming units as you continue to work on your final project?

We would like feedback on the schema, especially the `trip_members` role design and the voting constraint, and on whether the trip details page is too crowded. In the next unit we need help setting up GitHub issues and a project board, and later help connecting the React frontend to the Express API and deploying both with PostgreSQL on Render.
