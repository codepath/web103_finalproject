import express from "express";
import cors from "cors";
import sneakersRoutes from "./routes/sneakers.js";
import reviewRoutes from "./routes/reviews.js";
import cartRoutes from "./routes/cart.js";
import passport from "passport";
import session from "express-session";
import authRoutes from "./routes/auth.js";
import { GitHub } from "./config/auth.js";
import orderRoutes from "./routes/order.js";
// create express app
const app = express();
const DOMAIN = process.env.DOMAIN;
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3001",
    methods: "GET,POST,PUT,DELETE,PATCH",
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.Session_Secret,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(GitHub);
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get("/", (req, res) => {
  res.redirect("http://localhost:3001");
});

app.use("/auth", authRoutes);
app.use("/api/sneakers", sneakersRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);

// // Payment Setupimport createStripe from "stripe";
// import { pool } from "./config/database.js";
// import createStripe from "stripe";
// const stripe = createStripe(process.env.STRIPE_KEY);

// app.post("/create-checkout-session", async (req, res) => {
//   const session = await stripe.checkout.sessions.create({
//     line_items: [
//       {
//         // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
//         price: "23",
//         quantity: 1,
//       },
//     ],
//     mode: "payment",
//     success_url: `${DOMAIN}?success=true`,
//     cancel_url: `${DOMAIN}?canceled=true`,
//   });

//   res.redirect(303, session.url);
// });
// // Function to calculate the total amount
// function calculateTotalAmount(order) {
//   return order.items.reduce(
//     (total, item) => total + item.price * item.quantity,
//     0
//   );
// }

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
