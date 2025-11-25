# Milestone 5

This document should be completed and submitted during **Unit 9** of this course. You **must** check off all completed tasks in this document in order to receive credit for your work.

## Checklist

This unit, be sure to complete all tasks listed below. To complete a task, place an `x` between the brackets.

- [ ] Deploy your project on Render
  - [ ] In `readme.md`, add the link to your deployed project
- [ ] Update the status of issues in your project board as you complete them
- [ ] In `readme.md`, check off the features you have completed in this unit by adding a ✅ emoji in front of their title
  - [ ] Under each feature you have completed, **include a GIF** showing feature functionality
- [ ] In this document, complete the **Reflection** section below
- [ ] 🚩🚩🚩**Complete the Final Project Feature Checklist section below**, detailing each feature you completed in the project (ONLY include features you implemented, not features you planned)
- [ ] 🚩🚩🚩**Record a GIF showing a complete run-through of your app** that displays all the components included in the **Final Project Feature Checklist** below
  - [ ] Include this GIF in the **Final Demo GIF** section below

## Final Project Feature Checklist

### Baseline Features

👉🏾👉🏾👉🏾 Check off each completed feature below.

- [✅] The project includes an Express backend app and a React frontend app
- [✅] The project includes these backend-specific features:
  - [✅] At least one of each of the following database relationships in Postgres
    - [✅] one-to-many (user → posts, user → messages)
    - [✅] many-to-many with a join table (users ↔ conversations via conversations table)
  - [✅] A well-designed RESTful API that:
    - [✅] supports all four main request types for a single entity (ex. tasks in a to-do list app): GET, POST, PATCH, and DELETE
      - [✅] the user can **view** items, such as tasks (GET /api/users, GET /api/posts)
      - [✅] the user can **create** a new item, such as a task (POST /api/users, POST /api/posts)
      - [✅] the user can **update** an existing item by changing some or all of its values, such as changing the title of task (PATCH /api/users/:id)
      - [✅] the user can **delete** an existing item, such as a task (DELETE /api/users/:id, DELETE /api/posts/:id)
    - [✅] Routes follow proper naming conventions
  - [ ] The web app includes the ability to reset the database to its default state
- [✅] The project includes these frontend-specific features:
  - [✅] At least one redirection, where users are able to navigate to a new page with a new URL within the app
  - [✅] At least one interaction that the user can initiate and complete on the same page without navigating to a new page
  - [✅] Dynamic frontend routes created with React Router
  - [✅] Hierarchically designed React components
    - [✅] Components broken down into categories, including Page and Component types
    - [✅] Corresponding container components and presenter components as appropriate
- [✅] The project includes dynamic routes for both frontend and backend apps
- [ ] The project is deployed on Render with all pages and features that are visible to the user are working as intended

### Custom Features

👉🏾👉🏾👉🏾 Check off each completed feature below.

- [✅] The project gracefully handles errors
- [ ] The project includes a one-to-one database relationship
- [ ] The project includes a slide-out pane or modal as appropriate for your use case that pops up and covers the page content without navigating away from the current page
- [✅] The project includes a unique field within the join table (conversations table has last_message_at timestamp)
- [✅] The project includes a custom non-RESTful route with corresponding controller actions (POST /api/users/addFriend, GET /api/users/:userId/friends)
- [ ] The user can filter or sort items based on particular criteria as appropriate for your use case
- [✅] Data is automatically generated in response to a certain event or user action. Examples include generating a default inventory for a new user starting a game or creating a starter set of tasks for a user creating a new task app account (Default user profile data created on signup with empty interests and follows_ids objects)
- [ ] Data submitted via a POST or PATCH request is validated before the database is updated (e.g. validating that an event is in the future before allowing a new event to be created)
  - [ ] *To receive full credit, please be sure to demonstrate in your walkthrough that for certain inputs, the item will NOT be successfully created or updated.*

### Stretch Features

👉🏾👉🏾👉🏾 Check off each completed feature below.

- [✅] A subset of pages require the user to log in before accessing the content (All routes except /login and /signup are protected with ProtectedRoute wrapper)
  - [ ] Users can log in and log out via GitHub OAuth with Passport.js
- [✅] Restrict available user options dynamically, such as restricting available purchases based on a user's currency (Users cannot add themselves as friends; "Add Friend" button hidden for own profile)
- [ ] Show a spinner while a page or page element is loading
- [✅] Disable buttons and inputs during the form submission process (Loading states on signup, login, and add friend buttons)
- [ ] Disable buttons after they have been clicked
  - *At least 75% of buttons in your app must exhibit this behavior to receive full credit*
- [ ] Users can upload images to the app and have them be stored on a cloud service
  - *A user profile picture does **NOT** count for this rubric item **only if** the app also includes "Login via GitHub" functionality.*
  - *Adding a photo via a URL does **NOT** count for this rubric item (for example, if the user provides a URL with an image to attach it to the post).*
  - *Selecting a photo from a list of provided photos does **NOT** count for this rubric item.*
- [ ] 🍞 [Toast messages](https://www.patternfly.org/v3/pattern-library/communication/toast-notifications/index.html) deliver simple feedback in response to user events

## Final Demo GIF

🔗 [Here's a GIF walkthrough of the final project](👉🏾👉🏾👉🏾 your link here)

## Reflection

### 1. What went well during this unit?

Merging our branches went pretty smoothly once we figured out the workflow. The authentication features integrated nicely with our posts and messaging system. It took some back and forth to get the database schema sorted out, but once we had the UUID migration working everything clicked into place.

### 2. What were some challenges your group faced in this unit?

The biggest headache was definitely dealing with the user and profiles tables being set up differently because we had to completely rework the database to get them merged. Also, switching from regular number IDs to those UUID strings was way more work than I expected since it broke a bunch of foreign key relationships. Lastly, the Row Level Security in Supabase kept blocking our friend requests even though we thought we configured it correctly.

### 3. What were some of the highlights or achievements that you are most proud of in this project?

We're really proud of getting the database migration to work without breaking key features. The authentication flow with protected routes turned out really clean, where users get redirected to login if they're not signed in, which is exactly what we wanted. The messaging system is probably our favorite feature since it uses proper conversation structures and handles UUIDs correctly.

### 4. Reflecting on your web development journey so far, how have you grown since the beginning of the course?

We've learned a lot about how real authentication works, working first with Auth_Simulation and then to real authentication. Working with merge conflicts was time consuming at first but now we developed a good system to work with it. Building RESTful APIs makes way more sense now, and we're comfortable with setting up Express.js contexts and controllers.

### 5. Looking ahead, what are your goals related to web development, and what steps do you plan to take to achieve them?

Our main goal is to use web development as a way to showcase data projects with polished, interactive frontends. We want to get better at building visualizations and user interfaces that make complex data easy to understand and engaging to explore. This project taught us a lot about full-stack development, and we plan to apply those skills to create data-driven applications that look professional and function smoothly.
