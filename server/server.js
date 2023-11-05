import express from "express";
import cors from "cors";
import listingsRoutes from "./routes/listings.js";
// import tripRoutes from "./routes/trips.js";
// import activityRoutes from "./routes/activities.js";
// import destinationRoutes from "./routes/destinations.js";
// import tripDestinationRoutes from "./routes/trips_destinations.js";
// import authRoutes from "./routes/auth.js";
// import passport from "passport";
// import session from "express-session";
// import { GitHub } from "./config/auth.js";
import "./config/dotenv.js";

const app = express();

// app.use(
//   session({
//     secret: process.env.CLIENT_SECRET, //need random string in .env
//     resave: false,
//     saveUninitialized: true,
//   })
// );

app.use(express.json());
app.use(cors());
// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//     credentials: true,
//   })
// );

// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(GitHub);

//to implement own strategy, can these functions in a custom way
// passport.serializeUser((user, done) => {
//   done(null, user);
// });

// passport.deserializeUser((user, done) => {
//   done(null, user);
// });

app.get("/", (req, res) => {
  res.redirect("http://localhost:3000");
});

// app.use("/auth", authRoutes);
// app.use("/api/trips", tripRoutes);
// app.use("/api/activities", activityRoutes);
// app.use("/api/destinations", destinationRoutes);
// app.use("/api/trips-destinations", tripDestinationRoutes);

app.use("/api", listingsRoutes);
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
