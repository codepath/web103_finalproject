# Milestone 5

This document should be completed and submitted during **Unit 9** of this course. You **must** check off all completed tasks in this document in order to receive credit for your work.

## Checklist

This unit, be sure to complete all tasks listed below. To complete a task, place an `x` between the brackets.

- [ ] Deploy your project on Railway
  - [ ] In `readme.md`, add the link to your deployed project
- [x] Update the status of issues in your project board as you complete them
- [x] In `readme.md`, check off the features you have completed in this unit by adding a ✅ emoji in front of their title
  - [x] Under each feature you have completed, **include a GIF** showing feature functionality
- [x] In this document, complete the **Reflection** section below
- [x] 🚩🚩🚩**Complete the Final Project Feature Checklist section below**, detailing each feature you completed in the project (ONLY include features you implemented, not features you planned)
- [x] 🚩🚩🚩**Record a GIF showing a complete run-through of your app** that displays all the components included in the **Final Project Feature Checklist** below
  - [x] Include this GIF in the **Final Demo GIF** section below

## Final Project Feature Checklist

Complete the checklist below detailing each baseline, custom, and stretch feature you completed in your project. This checklist will help graders look for each feature in the GIF you submit.

### Baseline Features

👉🏾👉🏾👉🏾 Check off each completed feature below.

- [x] The project includes an Express backend app and a React frontend app
- [x] The project includes these backend-specific features:
  - [x] At least one of each of the following database relationship in Postgres
    - [x] one-to-many
    - [x] many-to-many with a join table
  - [x] A well-designed RESTful API
    - [x] The API can respond to at least one of each type of request: GET, POST, PATCH, and DELETE
    - [x] Routes follow proper naming conventions
  - [x] The ability to reset the database to its default state
- [x] The project includes these frontend-specific features:
  - [x] At least one redirection
  - [x] At least one interaction that the user can initiate and complete on the same page without navigating to a new page
  - [x] Dynamic frontend routes created with React Router
  - [x] Hierarchically designed React components
    - [x] Components broken down into categories, including Page and Component types
    - [x] Corresponding container components and presenter components as appropriate
- [x] The project includes dynamic routes for both frontend and backend apps
- [ ] The project is deployed on Railway with all pages and features working

### Custom Features

👉🏾👉🏾👉🏾 Check off each completed feature below.

- [x] The project gracefully handles errors
- [ ] The project includes a one-to-one database relationship
- [ ] The project includes a slide-out pane or modal as appropriate for your use case
- [x] The project includes a unique field within the join table
- [ ] The project includes a custom non-RESTful route with corresponding controller actions
- [ ] The project allows filtering and/or sorting as appropriate for your use case
- [ ] Data is automatically generated in response to a certain event or user action. Examples include generating a default inventory for a new user starting a game or creating a starter set of tasks for a user creating a new task app account
- [x] Data submitted via a POST or PATCH request is validated before the database is updated

### Stretch Features

👉🏾👉🏾👉🏾 Check off each completed feature below.

- [x] A subset of pages require the user to log in before accessing the content
  - [x] Users can log in and log out via GitHub OAuth with Passport.js
- [x] Restrict available user options dynamically, such as restricting available purchases based on a user's currency
- [ ] Show a spinner while a page or page element is loading
- [ ] Disable buttons and inputs during the form submission process
- [ ] Disable buttons after they have been clicked
- [ ] Users can upload images to the app and have them be stored on a cloud service
- [ ] 🍞 [Toast messages](https://www.patternfly.org/v3/pattern-library/communication/toast-notifications/index.html) deliver simple feedback in response to user events

## Final Demo GIF

<img src="../others/codepath_full_project.gif" alt = "codepath_project"/>

## Reflection

### 1. What went well during this unit?

We successfully improved the project by integrating a grid system for session selection, which enhanced its functionality and user experience. Undertaking this task allowed us to learn a great deal about practical implementations and teamwork.


### 2. What were some challenges your group faced in this unit?

One major challenge was understanding and implementing CSS. Getting the design to match our vision was difficult due to the syntax and nuances of CSS. Another hurdle was dealing with Railway; while the database updates were correct and functional, the dashboard wasn't updating, making it hard to view data in a table format.

### 3. What were some of the highlights or achievements that you are most proud of in this project?

I am most proud of my perseverance. I never thought I would make it through this course, given the challenges of time management, teamwork, communication, and everything in between. However, we kept pushing forward and overcame these obstacles, which is a significant achievement.

### 4. Reflecting on your web development journey so far, how have you grown since the beginning of the course?

I’ve grown in my understanding of full-stack development, particularly around authorization using tools like Passport and OAuth for authentication. I’ve also gained a better understanding of project structuring and the importance of separating concerns for maintainability.

### 5. Looking ahead, what are your goals related to web development, and what steps do you plan to take to achieve them?

My goal is to integrate parts of this project into a larger project I’ve been working on. I’m happy to have made progress by successfully creating a login page with GitHub authentication and a scheduling feature, which are crucial components of my broader vision.
