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

All six core features below are implemented. Each has a demonstration GIF.

### ✅ GitHub Sign-in

Users sign in with GitHub through Passport. Sessions are stored in PostgreSQL with an HTTP-only session cookie. Trip pages and APIs require authentication; membership and organizer permissions still apply. The recordings below were made with the previous demo selector.

### ✅ 1. Create and Manage Trips

- [x] Users can create a trip with a title, destination, start date, end date, and budget. They can view trip details, update the information, and delete a trip they organize.

The recording demonstrates browsing trips, creating a trip, editing its budget in Settings, and deleting it.

![Creating, editing, and deleting a trip](docs/gifs/create-manage-trips.gif)

### ✅ 2. Join Trips and View Members

- [x] Users can join an existing trip using its invitation code and view the trip’s members. Each membership records whether the user is an organizer or a member.

The recording demonstrates Arnold joining the Portland trip with its invitation code and then seeing the member list with roles.

![Joining a trip with an invitation code](docs/gifs/join-trips-members.gif)

### ✅ 3. Suggest and Manage Activities

- [x] Trip participants can add activities with a title, location, scheduled date, description, and estimated cost. They can view activities and edit or delete their own suggestions.

The recording demonstrates adding an activity, editing its cost, and deleting it. Only the person who added an activity can change it, and scheduled dates must fall within the trip dates.

![Adding, editing, and deleting an activity](docs/gifs/activities.gif)

### ✅ 4. View a Daily Itinerary

- [x] Participants can view activities grouped by day and filter the itinerary by date to find the plans for a specific day.

The recording demonstrates activities grouped by day and the date filter, including a day with nothing planned and the group of unscheduled activities.

![Filtering the itinerary by day](docs/gifs/itinerary.gif)

### ✅ 5. Vote on Activities

- [x] Participants can vote for activities they want to include and remove their votes. Each activity displays its vote count, with one vote per participant per activity.

The recording demonstrates voting, removing a vote, and a second participant voting, with the count updating each time.

![Voting on an activity](docs/gifs/voting.gif)

### ✅ 6. Track Shared Expenses

- [x] Participants can record an expense’s description, amount, and payer, view the trip’s total spending compared with its budget, and edit or delete their own expense entries. Automatic debt settlement is outside the initial scope.

The recording demonstrates the budget summary, adding an expense paid by another member, editing it past the budget, and deleting it.

![Recording and editing shared expenses](docs/gifs/expenses.gif)

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

The app supports GitHub authentication. Seeded demo accounts remain sample data and cannot be selected as an authenticated identity.

## Installation Instructions

- Server: cd server, npm install, copy .env.example to .env and fill in the PostgreSQL values for your local database, npm run reset, npm run dev (http://localhost:3001)
- Client: cd client, npm install, npm run dev (http://localhost:5173). The client sends /api requests to the server on port 3001.

### GitHub authentication setup

1. Register a GitHub OAuth App with homepage `http://localhost:5173` and callback `http://localhost:5173/api/auth/github/callback`.
2. Copy `server/.env.example` to `server/.env` only if you do not already have a local configuration. Set `DATABASE_URL` to your database's external connection URL for local development, and fill in `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`.
3. Generate `SESSION_SECRET` with `openssl rand -hex 32`. Set `CLIENT_URL=http://localhost:5173`. Keep all secrets out of Git.
4. Run `cd server` then `npm run migrate`. This adds the one-to-one `user_github_accounts` table and PostgreSQL session storage, allows users without email, and preserves existing application data. A fresh development database can use `npm run reset`, which deletes existing application data.
5. Start server and client, then open `http://localhost:5173` and choose **Continue with GitHub**. Use port 5173 consistently; Vite forwards `/api` requests to the backend on 3001.

Each GitHub identity creates a separate user. Existing demo users are not automatically linked by email. New users can create trips or join seeded trips with `SEATTLE26` or `PORTLAND26`.

Sessions are stored in PostgreSQL, with a seven-day cookie containing only a signed session ID. Logout deletes the server session. GitHub access and refresh tokens are not stored. Production requires HTTPS, `NODE_ENV=production`, a production `CLIENT_URL` and matching registered callback URL. The server trusts one reverse proxy and uses secure cookies in production.

### Validation

Run `cd server && node --test tests/auth.test.js`, then `cd client && npm run lint && npm run build`. Manually verify real GitHub authorization, cancelled login, page refresh, logout, return to a protected page, and two users joining/voting with separate accounts.
