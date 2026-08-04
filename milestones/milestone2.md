# Milestone 2

This document should be completed and submitted during **Unit 6** of this course. You **must** check off all completed tasks in this document in order to receive credit for your work.

## Checklist

This unit, be sure to complete all tasks listed below. To complete a task, place an `x` between the brackets.

- [x] In `planning/wireframes.md`: add wireframes for at least three pages in your web app.
  - [x] Include a list of pages in your app
- [x] In `planning/entity_relationship_diagram.md`: add the entity relationship diagram you developed for your database.
  - [x] Your entity relationship diagram should include the tables in your database.
- [x] Prepare your three-minute pitch presentation, to be presented during Unit 7 (the next unit).
  - [x] You do **not** need to submit any materials in advance of your pitch.
- [x] In this document, complete all three questions in the **Reflection** section below

## Reflection

### 1. What went well during this unit?

Wireframing our key pages first gave the whole team a shared picture of what we're building, which made designing the database much easier. Walking through our features one by one, we were able to identify the core entities (users, ingredients, recipes) and reason out where each many-to-many relationship needed a join table.

### 2. What were some challenges your group faced in this unit?

The trickiest part was the entity relationship diagram. We initially wanted to store things like calories and star ratings as single columns, but realized that data like a user's rating or the quantity of an ingredient in a recipe depends on *two* tables at once, so it belongs on a join table instead. Deciding what deserved its own table versus a column took a few iterations.

### 3. What additional support will you need in upcoming units as you continue to work on your final project?

As we move into development, we'd appreciate guidance on translating this ERD into actual PostgreSQL schema/migration files and wiring the Express API routes to it. Some dedicated lab time for team collaboration would also help us divide the feature work and stay in sync.
