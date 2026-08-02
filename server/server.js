import express from "express";
import path from "path";
import dotenv from "dotenv";
import tripsRouter from "./routes/trips.js";
import activitiesRouter from "./routes/activities.js";
import expensesRouter from "./routes/expenses.js";
import expensesForTripRouter from "./routes/expensesForTrip.js";
import packingListRouter from "./routes/packingList.js";
import packingListForTripRouter from "./routes/packingListForTrip.js";
import usersRouter from "./routes/users.js";
import destinationsForTripRouter from "./routes/destinationsForTrip.js";
import destinationsRouter from "./routes/destinations.js";
import activitiesForDestinationRouter from "./routes/activitiesForDestination.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

if (process.env.NODE_ENV === "production") {
  app.use(express.static("public"));
}

app.use("/api/trips", tripsRouter);
app.use("/api/activities", activitiesRouter);
app.use("/api/expenses", expensesRouter);
app.use("/api/trips/:tripId/expenses", expensesForTripRouter);
app.use("/api/packing-list", packingListRouter);
app.use("/api/trips/:tripId/packing-list", packingListForTripRouter);
app.use("/api/users", usersRouter);
app.use("/api/trips/:tripId/destinations", destinationsForTripRouter);
app.use("/api/destinations", destinationsRouter);
// :destinationId here only reaches activitiesForDestinationRouter's handlers
// because that router was created with mergeParams: true -- see
// routes/activitiesForDestination.js for the full explanation.
//
// Alternative that avoids mergeParams entirely (not used here, just noting
// it's possible): skip the sub-router and register each method directly on
// app instead of app.use, e.g.
//   app.get("/api/destinations/:destinationId/activities", getActivitiesForDestination);
//   app.post("/api/destinations/:destinationId/activities", createActivity);
// Since the whole path (including :destinationId) is registered in one call,
// there's no separate router layer for the param to get stuck at.
app.use("/api/destinations/:destinationId/activities", activitiesForDestinationRouter);

if (process.env.NODE_ENV === "production") {
  app.get("/*", (_, res) => res.sendFile(path.resolve("public", "index.html")));
}

app.listen(PORT, () => {
  console.log(`server listening on http://localhost:${PORT}`);
});
