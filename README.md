# TripTogether

CodePath WEB103 Final Project

Designed and developed by: Yugant Nagralawala, Arnold Waigwa, and Yingshu Wang

🔗 Link to deployed app: Coming soon — planned deployment on Render.

## About

### Description and Purpose

TripTogether is a full-stack web app that helps friends plan trips together in one shared space. Users can create trips, join a trip, suggest activities, organize a daily itinerary, vote on activities, and record shared expenses. The app helps groups keep travel plans organized and make decisions together without losing important information in group chats.

### Inspiration

Planning a trip with friends often involves scattered messages, separate lists of places to visit, and expense records in different apps. TripTogether brings these details together so that everyone can contribute to the plan and see the latest updates. The project is also inspired by the course’s GOATPath exemplar, which organizes related items into a clear workflow. TripTogether applies that approach to collaborative trip planning.

## Tech Stack

Frontend: React, React Router, HTML, and CSS.

Backend: Node.js and Express with a RESTful API.

Database: PostgreSQL.

Deployment: Render.

## Features

The features below are planned. Checkboxes will be checked and demonstration GIFs added as features are implemented.

### 1. Create and Manage Trips

- [ ] Users can create a trip with a title, destination, start date, end date, and budget. They can view trip details, update the information, and delete a trip they organize.

### 2. Join Trips and View Members

- [ ] Users can join an existing trip using its invitation code and view the trip’s members. Each membership records whether the user is an organizer or a member.

### 3. Suggest and Manage Activities

- [ ] Trip participants can add activities with a title, location, scheduled date, description, and estimated cost. They can view activities and edit or delete their own suggestions.

### 4. View a Daily Itinerary

- [ ] Participants can view activities grouped by day and filter the itinerary by date to find the plans for a specific day.

### 5. Vote on Activities

- [ ] Participants can vote for activities they want to include and remove their votes. Each activity displays its vote count, with one vote per participant per activity.

### 6. Track Shared Expenses

- [ ] Participants can record an expense’s description, amount, and payer, view the trip’s total spending compared with its budget, and edit or delete their own expense entries. Automatic debt settlement is outside the initial scope.

## Initial Technical Plan

### Database Relationships

- One-to-many: A trip has many activities and many expenses. Each activity and expense belongs to one trip.
- Many-to-many: Users can participate in multiple trips, and each trip can have multiple users. A `trip_members` join table connects `users` and `trips` and stores each membership’s role.
- Voting: An `activity_votes` join table connects users and activities. A unique constraint on `(user_id, activity_id)` prevents duplicate votes.

### Backend and API

- Use Express routes and controllers to expose a RESTful API backed by PostgreSQL.
- Support complete activity CRUD with `GET /api/trips/:tripId/activities`, `GET /api/activities/:activityId`, `POST /api/trips/:tripId/activities`, `PATCH /api/activities/:activityId`, and `DELETE /api/activities/:activityId`.
- Add routes for trips, memberships, votes, and expenses as needed for the planned features.
- Include a development database reset/seed script that restores sample users, trips, memberships, activities, votes, and expenses.

### Frontend Structure and Interactions

- Use React Router for a trip list page (`/trips`), a trip details page (`/trips/:tripId`), and an expenses page (`/trips/:tripId/expenses`).
- Redirect users to the new trip’s details page after creating a trip.
- Allow voting and date filtering on the trip details page without navigating away.
- Organize page components such as `TripsPage`, `TripDetailsPage`, and `ExpensesPage`, with reusable components such as `TripCard`, `ActivityList`, `ActivityCard`, and `ExpenseForm`. Page/container components manage data and pass it to presentation components through props.
- Deploy the React frontend and Express backend on Render with a PostgreSQL database. Verify all visible pages, links, forms, and buttons before submission.

### Selected Custom Features

1. **Filtering:** Filter trip activities by date in the daily itinerary.
2. **Server-side validation:** Validate POST and PATCH data before updating PostgreSQL, including required fields, trip date order, activity dates within the trip, positive expense amounts, and nonnegative budgets or estimated costs. Return useful validation messages to the frontend.

### Scope Notes

The initial version focuses on trip planning, voting, and expense records. User accounts are represented in the database; secure authentication and protected routes are optional stretch work. During development, a seeded demo-user selector can provide the active user context for demonstrating organizer and member workflows. This selector is for demonstration and does not provide secure access control.

## Installation Instructions

To be added when the frontend, backend, and database setup are implemented.
