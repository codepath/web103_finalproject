# WayGo — Smarter Carpooling for Everyone

**Team:** Venkatesh Kelam

---

## 📝 Description & Purpose
WayGo connects drivers and passengers heading in the same direction — simplifying how people coordinate rides.  
Users can search by **origin, destination, date, and available seats** and join a ride with one click.  
Drivers can post, edit, or cancel rides effortlessly, while passengers enjoy flexible, low-cost, and sustainable travel options.  

WayGo focuses on **trust, simplicity, and intelligent route matching** to make daily commuting smoother and community-driven.

---

## 💡 Inspiration
Coordinating rides through random chats, spreadsheets, or social media is chaotic.  
Existing apps are either **too complex** or limited to specific cities and use cases.  
WayGo fills that gap with a **lightweight, user-friendly carpooling platform** that makes shared travel accessible for students and professionals alike.  

Our goal is to promote **eco-friendly commuting** and **shared mobility**, one ride at a time.

---

## 🚀 Tagline
> **Find your way. Go together.**

---

## 🧰 Tech Stack
**Frontend:** React, React Router, Tailwind CSS (or CSS Modules)  
**Backend:** Node.js, Express, REST API, Input Validation (Zod/Yup)  
**Database:** PostgreSQL with One-to-Many and Many-to-Many relationships  
**Deployment:** Render (client + server) with database seeding and reset scripts  

---

## 🗺️ Data Model (ERD Sketch)
| Table | Purpose | Relationships |
|--------|----------|----------------|
| **users** | Stores user login info | 1–M with rides (driver) |
| **profiles** | Extra user info (display name, phone, etc.) | 1–1 with users |
| **routes** | Stores city pairs (origin ↔ destination) | 1–M with rides |
| **rides** | Core entity: driver’s offer with date, seats, price | M–M with passengers, M–M with ratings |
| **ride_passengers** | Join table linking rides and passengers | M–M |
| **ratings** | Passenger feedback after rides | M–M (users ↔ rides) |
| **favorites** | Saved routes for quick reuse | M–M (users ↔ routes) |

**Key Relationships:**  
- One-to-Many → user → rides, route → rides  
- Many-to-Many → rides ↔ passengers (join table)  
- One-to-One → user ↔ profile  

---

## ⚙️ Planned Features (≥ 6)
| # | Feature | Description |
|---|----------|-------------|
| 1 | **Browse & Search Rides (GET)** | List all open rides with filters. |
| 2 | **Offer a Ride (POST)** | Drivers can create rides with route, time, seats, and price. |
| 3 | **Edit Ride (PATCH)** | Update details (time, price, seats, or notes). |
| 4 | **Cancel/Delete Ride (DELETE)** | Drivers can close or remove rides. |
| 5 | **Join/Leave Ride (POST/DELETE)** | Passengers can manage their seat reservations. |
| 6 | **Advanced Filter Panel (Custom #1)** | Search by origin, destination, date, price, rating, or available seats — synced with URL params. |
| 7 | **Quick-View Modal (Custom #2)** | Open ride details and join directly without navigating away. |
| 8 | **Input Validation** | Ensure valid data — future date, positive price, seats ≥ 1, no overbooking. |
| 9 | **Database Reset/Seed** | Admin endpoint to restore default demo data. |
| 10 | **Driver Ratings** | Passengers can rate drivers after a completed ride. |
| 11 | **Favorites** | Save preferred routes (e.g., “Campus ↔ Airport”) for quick searches. |
| 12 | **Graceful Error States** | Helpful UI messages and toasts for better feedback. |

✅ **Custom Features:**  
- (1) Advanced Filtering with URL sync  
- (2) Quick-View Modal for rides  

✅ **Validation Implemented:**  
- Future date checks  
- Seat and price limits  
- Prevent overbooking

---

## 🧩 REST API (Draft)
GET /api/rides?origin=&dest=&dateFrom=&dateTo=&seatsMin=&priceMin=&priceMax=&ratingMin=&page=&sort=
GET /api/rides/:id
POST /api/rides
PATCH /api/rides/:id
DELETE /api/rides/:id
POST /api/rides/:id/join
DELETE /api/rides/:id/leave
POST /api/ratings
POST /api/admin/reset-db


---

## 📋 Baseline Feature Mapping
- Express backend + React frontend ✅  
- Dynamic routes (server + client) ✅  
- PostgreSQL with **one-to-many** & **many-to-many** ✅  
- RESTful API with GET/POST/PATCH/DELETE ✅  
- Database reset functionality ✅  
- Dynamic navigation with React Router ✅  
- On-page interactivity (modal + filters) ✅  
- Deployed to Render ✅  

---

## 💫 Future Stretch Features
- Login with Google or GitHub OAuth  
- Map integration (pickup & drop-off visualization)  
- Push notifications for ride reminders  
- Image upload for profile pictures  
- Admin dashboard for managing rides  

---

## 📜 Mission Statement
> **WayGo empowers communities to travel smarter by connecting people going the same way.**  
> Whether it’s a daily commute or weekend trip, WayGo makes shared rides simpler, safer, and more sustainable.
