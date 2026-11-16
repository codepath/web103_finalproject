# Milestone 5

This document should be completed and submitted during **Unit 9** of this course. You **must** check off all completed tasks in this document in order to receive credit for your work.

Live project: [TripTogether](https://triptogether-planner.onrender.com).

Implementation evidence is listed below. The final live walkthrough, full
multi-account acceptance pass, and new feature recordings are still pending.
Existing core-feature GIFs predate the final UI and authentication. Reflection
answers are a draft for the team's review before submission.

## Checklist

This unit, be sure to complete all tasks listed below. To complete a task, place an `x` between the brackets.

- [x] Deploy your project on Render
  - [x] In `readme.md`, add the link to your deployed project
- [ ] Update the status of issues in your project board as you complete them
- [x] In `readme.md`, check off the features you have completed in this unit by adding a ✅ emoji in front of their title
  - [ ] Under each feature you have completed, **include a GIF** showing feature functionality
- [x] In this document, complete the **Reflection** section below
- [x] 🚩🚩🚩**Complete the Final Project Feature Checklist section below**, detailing each feature you completed in the project (ONLY include features you implemented, not features you planned)
- [ ] 🚩🚩🚩**Record a GIF showing a complete run-through of your app** that displays all the components included in the **Final Project Feature Checklist** below
  - [ ] Include this GIF in the **Final Demo GIF** section below

## Final Project Feature Checklist

Complete the checklist below detailing each baseline, custom, and stretch feature you completed in your project. This checklist will help graders look for each feature in the GIF you submit.

### Baseline Features

- [x] The project includes an Express backend app and a React frontend app
- [x] The project includes these backend-specific features:
  - [x] At least one of each of the following database relationships in Postgres
    - [x] one-to-many
    - [x] many-to-many with a join table
  - [x] A well-designed RESTful API that:
    - [x] supports all four main request types for a single entity (ex. tasks in a to-do list app): GET, POST, PATCH, and DELETE
      - [x] the user can **view** items, such as tasks
      - [x] the user can **create** a new item, such as a task
      - [x] the user can **update** an existing item by changing some or all of its values, such as changing the title of task
      - [x] the user can **delete** an existing item, such as a task
    - [x] Routes follow proper naming conventions
  - [x] The web app includes the ability to reset the database to its default state
- [x] The project includes these frontend-specific features:
  - [x] At least one redirection, where users are able to navigate to a new page with a new URL within the app
  - [x] At least one interaction that the user can initiate and complete on the same page without navigating to a new page
  - [x] Dynamic frontend routes created with React Router
  - [x] Hierarchically designed React components
    - [x] Components broken down into categories, including Page and Component types
    - [x] Corresponding container components and presenter components as appropriate
- [x] The project includes dynamic routes for both frontend and backend apps
- [ ] The project is deployed on Render with all pages and features that are visible to the user are working as intended

### Custom Features

- [x] The project gracefully handles errors
- [x] The project includes a one-to-one database relationship
- [x] The project includes a slide-out pane or modal as appropriate for your use case that pops up and covers the page content without navigating away from the current page
- [ ] The project includes a unique field within the join table
- [x] The project includes a custom non-RESTful route with corresponding controller actions
- [x] The user can filter or sort items based on particular criteria as appropriate for your use case
- [x] Data is automatically generated in response to a certain event or user action. Examples include generating a default inventory for a new user starting a game or creating a starter set of tasks for a user creating a new task app account
- [x] Data submitted via a POST or PATCH request is validated before the database is updated (e.g. validating that an event is in the future before allowing a new event to be created)
  - [ ] *To receive full credit, please be sure to demonstrate in your walkthrough that for certain inputs, the item will NOT be successfully created or updated.*

### Stretch Features

- [x] A subset of pages require the user to log in before accessing the content
  - [x] Users can log in and log out via GitHub OAuth with Passport.js
- [x] Restrict available user options dynamically, such as restricting available purchases based on a user's currency
- [x] Show a spinner while a page or page element is loading
- [x] Disable buttons and inputs during the form submission process
- [x] Disable buttons after they have been clicked
  - *At least 75% of buttons in your app must exhibit this behavior to receive full credit*
- [ ] Users can upload images to the app and have them be stored on a cloud service
  - *A user profile picture does **NOT** count for this rubric item **only if** the app also includes "Login via GitHub" functionality.*
  - *Adding a photo via a URL does **NOT** count for this rubric item (for example, if the user provides a URL with an image to attach it to the post).*
  - *Selecting a photo from a list of provided photos does **NOT** count for this rubric item.*
- [x] 🍞 [Toast messages](https://www.patternfly.org/v3/pattern-library/communication/toast-notifications/index.html) deliver simple feedback in response to user events

## Implementation evidence and remaining verification

| Feature | Implemented evidence |
| --- | --- |
| Express/React and CRUD | `server/app.js`, `server/routes/`, `server/controllers/`, and `client/src/pages/`; activities expose GET/POST/PATCH/DELETE. |
| One-to-many and many-to-many | `trips` → `activities`/`expenses`; `users` ↔ `trips` through `trip_members`, with foreign keys and a composite primary key in the implemented schema. |
| One-to-one identity | `user_github_accounts.user_id` is both primary key and foreign key to `users.id`; `github_id` is unique. |
| Reset | `server/scripts/reset.js`, `server/db/schema.sql`, and `server/db/seed.sql`; use only against a disposable development database. |
| Routes and component structure | React Router page routes, reusable cards/forms, create/join redirects and same-page voting/filtering. |
| Slide-out | `client/src/components/SlideOver.jsx`; [existing activity panel GIF](../docs/gifs/activity-slideout.gif). |
| Non-RESTful route and filtering | `POST /api/trips/join` with `joinTrip`; date selector in `ActivityList`. |
| Generated data | Random invitation code and organizer membership on trip creation; starter trip plus three activities on first GitHub registration. |
| Validation and errors | Required text, amount/date checks, membership/creator/organizer checks, JSON errors, inline form errors and API/connection error Toasts. |
| Login and restrictions | GitHub Passport strategy, PostgreSQL sessions, `requireAuth`, membership/organizer middleware, and creator-only edit/delete controls. |
| Loading and submission states | Spinner component, disabled form fieldsets, shared mutation lock and request-button states. |
| Notifications | Feedback provider shows success/error Toasts across navigation, with dismissal and hover/focus timeout pause. |
| Deployment | One Render web service serves built React files and `/api`; new resources and database health were checked after the final UI release. |

The full deployed-feature checkbox remains open until the live acceptance pass
in [the validation guide](../docs/final-validation.md) is completed. Deployment
itself is complete; the checkbox also requires all visible features to be tested.

The join-table field item is not claimed yet: `trip_members.role` and `joined_at`
are extra relationship attributes, and `(trip_id, user_id)` is a composite primary
key. `role` itself is **not** SQL-unique. Confirm the course's intended meaning of
“unique field within the join table” before checking this item.

Pending-control source audit: 17 of the 18 native button templates in the current
UI have a disabled condition; the exception is immediate notification dismissal.
The synchronous guard also rejects a repeated submit before React rerenders.
This is implementation evidence, not a substitute for recording visible pending
behavior under a slow network. Links are not native buttons.

User image uploads are not implemented and are not claimed. The GitHub avatar
and bundled decorative travel illustration do not count as cloud image uploads.

Validation already performed: production builds, six frontend feedback tests and
six server authentication/routing tests; six isolated PostgreSQL starter-trip
scenarios cover first/repeated/concurrent login, existing users, deletion, separate
ownership and rollback/retry. The database integration suite is opt-in and skips
during normal builds. Browser visual acceptance of the latest UI was not performed.

### Evidence still to add

- [ ] Complete the live multi-account acceptance checklist.
- [ ] Capture first-login starter-trip behavior with a genuinely new GitHub account.
- [ ] Add actual GitHub login, starter-trip and polish GIFs to README.
- [ ] Add the final live walkthrough GIF and show a server-rejected invalid date submission.
- [ ] Review the Reflection draft as a team and confirm project-board statuses.

## Final Demo GIF

Pending: Yugant is tracking the final live walkthrough in
[Issue #32](https://github.com/codepath-12/web103_finalproject/issues/32).
The final GIF has not yet been added; no placeholder image link is claimed as evidence.

Use [the final validation and recording guide](../docs/final-validation.md) to cover
all checked features, including server validation failure and two-account workflows.

## Reflection

### 1. What went well during this unit?

We integrated the six core planning features with GitHub authentication and deployed the React frontend and Express API together on Render. PostgreSQL-backed sessions and a shared origin made the local and live authentication flows more consistent. We also improved the interface with a slide-out activity form, loading states, Toast feedback, and a cohesive travel-themed design.

### 2. What were some challenges your group faced in this unit?

Environment configuration and integration were the main challenges. The database connection code and local environment variables initially used different formats, database access depended on the current public IP, and the first authentication implementation did not match the agreed GitHub approach. We resolved these issues by supporting the existing database URL, updating connection rules, implementing GitHub sessions, and documenting setup for each teammate. Coordinating changes also required checking the latest main branch before merging work.

### 3. What were some of the highlights or achievements that you are most proud of in this project?

The project now combines collaborative itineraries, voting and shared expenses in one deployed app. We are especially proud of preserving existing database records while updating authentication, adding a one-to-one GitHub identity relationship, and creating starter trips atomically for new users. The starter-trip tests also cover concurrent logins and rollback after failure, rather than only the successful path.

### 4. Reflecting on your web development journey so far, how have you grown since the beginning of the course?

This project gave us more practice tracing a complete feature from a React form through an authenticated Express route to PostgreSQL and back to the interface. We also learned that deployment involves more than getting a server to start: callback URLs, cookies, database connectivity, direct page refreshes, and clear setup instructions all affect whether others can use the app.

### 5. Looking ahead, what are your goals related to web development, and what steps do you plan to take to achieve them?

Our next goals are to strengthen automated coverage for collaborative workflows, make local setup easier to reproduce, and improve accessibility and release verification. Useful next steps include a repeatable multi-account acceptance checklist, continuous integration for builds/tests, and keeping demo recordings aligned with the deployed version.
