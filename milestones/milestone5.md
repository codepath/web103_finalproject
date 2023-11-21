# Milestone 5

This document should be completed and submitted during **Unit 9** of this course. You **must** check off all completed tasks in this document in order to receive credit for your work.

## Checklist

This unit, be sure to complete all tasks listed below. To complete a task, place an `x` between the brackets.

- [ ] Deploy your project on Railway (I am going to launch to real customers, so needed a bit more time before launching to production)
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
  - [x] At least one of each of the following database relationships in Postgres
    - [ ] one-to-many
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
- [ ] The project is deployed on Railway with all pages and features working (I did not do this because I am not done with the app. I am going to launch to actual customers, so need a bit more time)

### Custom Features

👉🏾👉🏾👉🏾 Check off each completed feature below.

- [x] The project gracefully handles errors
- [ ] The project includes a one-to-one database relationship
- [ ] The project includes a slide-out pane or modal as appropriate for your use case
- [ ] The project includes a unique field within the join table
- [x] The project includes a custom non-RESTful route with corresponding controller actions
- [x] The project allows filtering and/or sorting as appropriate for your use case
- [x] Data is automatically generated in response to a certain event or user action. Examples include generating a default inventory for a new user starting a game or creating a starter set of tasks for a user creating a new task app account
- [x] Data submitted via a POST or PATCH request is validated before the database is updated

### Stretch Features

👉🏾👉🏾👉🏾 Check off each completed feature below.

- [x] A subset of pages require the user to log in before accessing the content
  - [ ] Users can log in and log out via GitHub OAuth with Passport.js
- [ ] Restrict available user options dynamically, such as restricting available purchases based on a user's currency
- [ ] Show a spinner while a page or page element is loading
- [ ] Disable buttons and inputs during the form submission process
- [ ] Disable buttons after they have been clicked
- [ ] Users can upload images to the app and have them be stored on a cloud service
- [ ] 🍞 [Toast messages](https://www.patternfly.org/v3/pattern-library/communication/toast-notifications/index.html) deliver simple feedback in response to user events

## Final Demo GIF

🔗 <img src='jewelryStore7.gif' />
Sorry if I couldn't get all the features shown in the video. I wasn't sure how to show things such as "The project includes dynamic routes for both frontend and backend apps". I just assumed that things like this are evident through the showcase of the app. I tried to show as much backend as I could, but the GIF had to be under a minute.

## Reflection

### 1. What went well during this unit?

I made the UI well. I also learned a lot about making routes to join data and other things.

### 2. What were some challenges your group faced in this unit?

I kept facing syntax errors when making and calling routes which took so much time to debug

### 3. What were some of the highlights or achievements that you are most proud of in this project?

I really liked the UI and responsiveness of my app. In many of my past assignments, UI and UX were the last thing on my mind, but since I am making this site for someone, I wanted it to be perfect to the best of my ability. I also made some cool routes. I made one route that not only filtered data, but made a new column based on whether a user liked that item. This involved joining two tables. It was cool to see things such as joins and making custom columns that I learned in class come to life.

### 4. Reflecting on your web development journey so far, how have you grown since the beginning of the course?

I grew a lot. Before, I only knew how to use an API-based and less involved backends such as Supabase. However, this course taught me how to use PostgreSQL and make my own routes! It's awesome what you can do with backend engineering/development. I really wanted to learn about the backend this semester, and I accomplished that! 

### 5. Looking ahead, what are your goals related to web development, and what steps do you plan to take to achieve them?

I want to complete this site and make it production-ready. I love working on this site because I know my work is for something that will be used. I love it. I love continuously adding to the site and seeing my work evolve and grow. Making something production-ready is the biggest challenge. You have to test and try breaking your site. You have to make sure user info is protected and every corner is checked. With that said, I plan to continue my path in web development/full stack development.

-Special Thanks to CodePath. I can't say how wonderful this journey has been. After three classes, I think I will take a break from CodePath courses for a bit, but I will spread the word about how wonderful CodePath is. THANK YOU.
