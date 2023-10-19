# Sneak-Peak

CodePath WEB103 Final Project

Designed and developed by: Noel Alfaro & Mohamed Reda Falhi

🔗 Link to deployed app:

## Table of Contents

- [Backend and Frontend Configuration](#backend-and-frontend-configuration)
- [Backend Features](#backend-features)
- [Frontend Features](#frontend-features)
- [Getting Started](#getting-started)
- [Contributing](#contributing)

## About

### Description and Purpose

Sneak-Peak is a web application designed to cater to sneaker enthusiasts, and newcomers.
It is a web app built with Node.js/Express and PostgresSQL on the backend and React on the frontend.
The purpose of this app is to allow users to be able to manage, share & showcase their shoe collections.

### Inspiration

We were inspired by shoe buying apps like GOAT, which allow users to buy new and vintage shoes.
We wanted to create an app that users can treat as their digital locker room to store & update their collections, upvote other users shoes, and highlight their favorites.

## Tech Stack

Frontend: React, Tailwind CSS

Backend: Node, Express, PostgresSQL database

## Backend and Frontend Configuration

- Built using an Express backend and a React frontend.
- Dynamic routes implemented for both frontend and backend.
- Hosted and deployed via Railway.

## Backend Features

### Database Relationships in Postgres

- **User & Sneaker**: One-to-many relationship where each user can upload multiple shoes.
- **User & Sneaker**: Many-to-many relationship where many users can upvote/downvote multiple shoes.
- **User & Profile**: One-to-One relationship is established between users and their profiles. Users can customize their profiles to add additional information, enhancing their personalization within the app.
<!-- 2. **User & SneakPeak Comments**: Many-to-many relationship with a join table to facilitate user comments on Sneak-Peak. -->

### RESTful API Endpoints

- **GET** `/shoes`: Fetch all shoe collections.
- **POST** `/shoes`: Add a new shoe to a user's collection.
- **PATCH** `/shoes/:id`: Update shoe details.
- **DELETE** `/shoes/:id`: Remove a shoe from the collection.

### Database Management

- API endpoint to reset the database to its initial state.

### User log in via Github

- The user can log in via Github

## Frontend Features

### Uploading a Shoe

- The user should be able to fill out a form to upload a new 'Shoe' to add to their collection
  [gif goes here]

### Redirection

- After creating a Shoe, users are navigated to the Sneak-Peak gallery.
  [gif goes here]

### User Interactions

- Users can upvote/downvote shoes in the highlight gallery.
  [gif goes here]

### "Highlighting"

- The user should be able to 'Highlight' a shoe so that their shoe can be added to the highlighted dashboard on the homepage
  [gif goes here]

### User can Edit/Delete shoe from their collection

- Logged in Users edit or delete shoes listed in their collection
  [gif goes here]

### Dynamic Routing

- Landing page, user profiles, individual shoe details, and Sneak-Peak Dashboard, all facilitated via React Router.

### React Component Structure

- Hierarchically designed components segmented into pages and component types.

## Getting Started

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Start the server using `npm start`.
4. Navigate to `localhost:3000` to see the app in action.

## Contributing

Feel free to fork the repository, make changes, and submit a pull request. We appreciate all contributions!
