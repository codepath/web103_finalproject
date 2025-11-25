# Milestone 2

This document should be completed and submitted during **Unit 6** of this course. You **must** check off all completed tasks in this document in order to receive credit for your work.

## Checklist

This unit, be sure to complete all tasks listed below. To complete a task, place an `x` between the brackets.

- [X] In `planning/wireframes.md`: add wireframes for at least three pages in your web app.
  - [X] Include a list of pages in your app
- [X] In `planning/entity_relationship_diagram.md`: add the entity relationship diagram you developed for your database.
  - [X] Your entity relationship diagram should include the tables in your database.
- [X] Prepare your three-minute pitch presentation, to be presented during Unit 7 (the next unit).
  - [X] You do **not** need to submit any materials in advance of your pitch.
- [X] In this document, complete all three questions in the **Reflection** section below

## Reflection

### 1. What went well during this unit?

The transition from abstract concepts (Milestone 1) to concrete blueprints (Milestone 2) was highly productive. What went best was the collaboration on the Entity Relationship Diagram (ERD). We successfully mapped the complex relationships required for our app's core functionality, specifically:
* Many-to-Many: We clearly defined the User Group and User text Course relationships, which are critical for both the search and group formation features.
* One-to-One: We successfully integrated the planned User Block List as a 1:1 relationship, satisfying a Custom Feature requirement early in the planning process.
* Pitch Preparation: Preparing the three-minute pitch was also efficient. The clarity gained from the ERD and wireframes allowed us to concisely articulate the app's value proposition and technical complexity, making our presentation preparation time very focused.

### 2. What were some challenges your group faced in this unit?

Our main challenge centered on wireframing the key user interactions and ensuring they were intuitive for a commuter college environment.
* Mapping the Swipe Feature: Translating the "Swipe Functionality" user story into a clean wireframe required several revisions. We struggled initially to clearly indicate how a user would swipe (a required same-page interaction) versus how they would filter their results, which is key to finding the right study buddies. We resolved this by including clear Filter and Settings icons on the discovery page.
* Group Scheduling Logic: Designing the flow for the "Group formation" feature was complex, particularly deciding where to place the logic for scheduling hangout plans within the wireframes (e.g., as a slide-out modal vs. a separate page). This required us to review the ERD and chat features concurrently to ensure the flow made sense before committing to the final wireframe design.

### 3. What additional support will you need in upcoming units as you continue to work on your final project?

Complex Postgres Querying: Our app relies heavily on filtering (by course, major, time) and complex join operations to display accurate match results and group rosters. We anticipate needing focused guidance or examples on writing efficient SQL queries that utilize the many-to-many join tables without creating performance bottlenecks.Custom Non-RESTful Route: We are planning a custom, non-RESTful route for handling the specific action of a user liking a profile (a successful swipe), and would appreciate a review of the controller and Express route structure for this specific type of endpoint before implementation.
