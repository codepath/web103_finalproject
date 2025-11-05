# Milestone 2 — WayGo

This document should be completed and submitted during **Unit 6** of this course.  
You **must** check off all completed tasks in this document in order to receive credit for your work.

---

## ✅ Checklist

This unit, be sure to complete all tasks listed below.  
To complete a task, place an `x` between the brackets.

- [x] In `planning/wireframes.md`: add wireframes for at least three pages in your web app.  
  - [x] Include a list of pages in your app
- [x] In `planning/entity_relationship_diagram.md`: add the entity relationship diagram you developed for your database.  
  - [x] Your entity relationship diagram should include the tables in your database.
- [x] Prepare your three-minute pitch presentation, to be presented during Unit 7 (the next unit).  
  - [x] You do **not** need to submit any materials in advance of your pitch.
- [x] In this document, complete all three questions in the **Reflection** section below

---

## 🎨 Wireframes Overview

The following pages have been wireframed for the *WayGo* Carpooling App:

1. **Home / Search Page** – Displays available rides, filters, and quick navigation.  
2. **Ride Details Page** – Shows ride info (driver, route, seats, price, date) with “Join Ride” option.  
3. **Offer a Ride Page** – Allows drivers to post new rides (origin, destination, time, price).  
4. **Profile Page (optional stretch)** – Displays user info, ratings, and saved routes.  
5. **Favorites / Saved Routes (optional stretch)** – Lists frequently used routes for faster booking.

Low-fidelity wireframes were created in **Figma**, focusing on structure and functionality over styling.

---

## 🧩 Entity Relationship Diagram (ERD)

**Tables:**

- **users** → stores account information  
- **profiles** → holds user metadata (name, contact, rating)  
- **routes** → origin & destination pairs  
- **rides** → connects drivers, routes, and passengers  
- **ride_passengers** → join table linking rides ↔ passengers  
- **ratings** → feedback system between passengers and drivers  
- **favorites** → saved routes for users  

**Key Relationships:**

- `users (1) → rides (M)`  
- `routes (1) → rides (M)`  
- `users (M) ↔ rides (M)` via `ride_passengers`  
- `users (M) ↔ rides (M)` via `ratings`  
- `users (M) ↔ routes (M)` via `favorites`  
- `users (1) ↔ profiles (1)`

---

## 💬 Reflection

### 1. What went well during this unit?

This unit helped solidify the project’s structure and vision.  
Creating wireframes in Figma clarified how users will navigate between searching, offering, and joining rides.  
Designing the ERD was smooth because the project idea (carpooling) naturally fits relational data patterns such as many-to-many relationships for passengers and rides.  
The planning stage gave a clear direction for what to build in code later.

---

### 2. What were some challenges your group faced in this unit?

Balancing between simplicity and feature-richness was tricky — it’s easy to overcomplicate ride management.  
Designing an intuitive UI for filters and quick ride joining took some thought.  
Additionally, making sure the ERD covered both baseline and custom features (like favorites and ratings) without redundancy required several iterations.

---

### 3. What additional support will you need in upcoming units as you continue to work on your final project?

- Guidance on implementing **real-time updates** (e.g., when a seat is booked or canceled).  
- Tips for connecting the **frontend React components** to the **Express + PostgreSQL** backend efficiently.  
- Clarification on deployment steps to Render (especially with client + server setup).  
- Possibly integrating a **chatbot** later to assist users with booking and ride info.

---

✅ **WayGo — Smarter Carpooling for Everyone**  
> “Find your way. Go together.”
