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

// Payment Setupimport createStripe from "stripe";
import { pool } from "./config/database.js";
import createStripe from "stripe";
const stripe = createStripe(process.env.STRIPE_KEY);

app.post("/create-checkout-session", async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const orderId = req.body.orderId;

    // Fetch order details from the database
    const orderResult = await pool.query(
      "SELECT * FROM order_details WHERE order_id = $1 AND user_id = $2",
      [orderId, userId]
    );

    const order = orderResult.rows[0];

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const totalAmount = calculateTotalAmount(order);

    // Start a database transaction
    const client = await pool.connect();
    try {
      // Insert payment information into the payments table
      const paymentResult = await client.query(
        "INSERT INTO payments (order_id,  payment_date, amount, status) VALUES ($1, NOW(), $2,'Paid') RETURNING id",
        [orderId, totalAmount]
      );

      const paymentId = paymentResult.rows[0].id;

      // Create a payment session with Stripe
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: order.items.map((item) => ({
          price_data: {
            currency: "usd",
            product_data: {
              name: item.sneaker_name,
            },
            unit_amount: item.price * 100,
          },
          quantity: item.quantity,
        })),
        mode: "payment",
        success_url: `${DOMAIN}?success=true&paymentId=${paymentId}`,
        cancel_url: `${DOMAIN}?canceled=true`,
      });

      // Commit the transaction
      await client.query("COMMIT");

      res.status(200).json({ sessionId: session.id, paymentId });
    } catch (error) {
      // Rollback the transaction in case of an error
      await client.query("ROLLBACK");
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    } finally {
      // Release the client back to the pool
      client.release();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
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
