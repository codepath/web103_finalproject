import express from "express";
import cors from "cors";
import listingsRoutes from "./routes/listings.js";
import propertiesRoutes from "./routes/properties.js";
import authRoutes from "./routes/auth.js";
import passport from "passport";
import session from "express-session";
// import { GitHub } from "./config/auth.js";
import "./config/dotenv.js";
import cookieParser from "cookie-parser";
import "./strategies/local.js";

const app = express();
const PORT = process.env.PORT || 3001;
const memoryStore = new session.MemoryStore();
app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    secret: process.env.CLIENT_SECRET,
    resave: false,
    saveUninitialized: false,
    store: memoryStore,
  })
);
// app.use(cors());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
// passport.use(GitHub);

//to implement own strategy, can these functions in a custom way
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get("/", (req, res) => {
  res.redirect("http://localhost:3001");
});

app.use((req, res, next) => {
  console.log("Incoming Request Body:", req.body);
  next();
});
// app.use("/api/trips", tripRoutes);
// app.use("/api/activities", activityRoutes);
// app.use("/api/destinations", destinationRoutes);
// app.use("/api/trips-destinations", tripDestinationRoutes);

app.use("/api", listingsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertiesRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
