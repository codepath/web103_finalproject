# Milestone 1

This document should be completed and submitted during **Unit 5** of this course. You **must** check off all completed tasks in this document in order to receive credit for your work.

## Checklist

This unit, be sure to complete all tasks listed below. To complete a task, place an `x` between the brackets.

- [X] Read and understand all required features
  - [X] Understand you **must** implement **all** baseline features and **two** custom features
- [X] In `readme.md`: update app name to your app's name
- [X] In `readme.md`: add all group members' names
- [X] In `readme.md`: complete the **Description and Purpose** section
- [X] In `readme.md`: complete the **Inspiration** section
- [X] In `readme.md`: list a name and description for all features (minimum 6 for full points) you intend to include in your app (in future units, you will check off features as you complete them and add GIFs demonstrating the features)
- [X] In `planning/user_stories.md`: add all user stories (minimum 10 for full points)
- [X] In `planning/user_stories.md`: use 1-3 unique user roles in your user stories
- [X] In this document, complete all thre questions in the **Reflection** section below

## Reflection

### 1. What went well during this unit?

This unit's success centered on establishing a strong foundation for our web application. We effectively collaborated to choose a unique concept, which we documented in the readme.md, along with the names of all group members. We successfully developed more than the required ten detailed user stories across multiple user roles, which clearly defined the core functionality and user journeys. Finally, we created a comprehensive initial feature list, ensuring all baseline features and our planned two custom features are accounted for, putting us in a great position to start the design phase in Milestone 2.

### 2. What were some challenges your group faced in this unit?

Given that our project is a dating app, the main challenge we faced in Milestone 1 was scoping the project's core functionality against the required database features. Specifically, we spent significant time mapping the complex many-to-many relationship (i.e., how two users become a "Match") and ensuring this was accurately represented in our initial set of user stories. This required us to carefully define the boundaries for our two custom features—such as deciding which kind of filtering or validation would add the most value without becoming overly complex—to ensure we could still meet all the required baseline features while maintaining a manageable workload for the upcoming development units.

### 3. What additional support will you need in upcoming units as you continue to work on your final project?

As we transition into the development phases (Milestones 3 and Final), our group anticipates needing the most support with configuring our relational data for the Express server and integrating our full-stack deployment. For the dating app, the core logic relies on complex Postgres queries that efficiently handle the required text many-to-many "Match" relationship and custom user filtering. We'll need guidance from TFs or instructors on best practices for writing these SQL queries within our Node/Express controllers, specifically around preventing performance bottlenecks. Furthermore, we expect to require assistance during the final unit to successfully deploy the separate React frontend and Express backend to Render, ensuring proper CORS configuration and correct handling of React Router dynamic routes on the live service.