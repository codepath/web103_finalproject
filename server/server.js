import express from "express";
import cors from "cors";
import sneakersRoutes from "./routes/sneakers.js";
import reviewRoutes from "./routes/reviews.js";
import cartRoutes from "./routes/cart.js";
import passport from "passport";
import session from "express-session";
import authRoutes from "./routes/auth.js";
import { Google } from "./config/auth.js";
// create express app
const app = express();
const DOMAIN = process.env.DOMAIN;
app.use(express.json());
app.use(
  cors({
    origin: DOMAIN,
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
passport.use(Google);
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get("/", (req, res) => {
  res
    .status(200)
    .send(
      '<h1 style="text-align: center; margin-top: 50px;">👟 Sneaker World API</h1>'
    );
});

app.use("api/auth", authRoutes);
app.use("/api/sneakers", sneakersRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/cart", cartRoutes);
// Payment Setup
const stripe = require("stripe")(process.env.STRIPE_KEY);
app.post("/create-checkout-session", async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null; // Assuming user authentication
    const orderId = req.body.orderId; // Pass the order ID from your front end

    // Fetch order details from the database, adjust the query based on your schema
    const orderResult = await pool.query(
      "SELECT * FROM ordedetails WHERE orderid = $1 AND userid = $2",
      [orderId, userId]
    );

    const order = orderResult.rows[0];

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const totalAmount = calculateTotalAmount(order);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: order.items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.sneaker_name, // Adjust based on your schema
          },
          unit_amount: item.price * 100, // Amount in cents
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${DOMAIN}?success=true`,
      cancel_url: `${DOMAIN}?canceled=true`,
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Function to calculate the total amount
function calculateTotalAmount(order) {
  return order.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
}
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
