
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

import authRoutes from "./routes/authRoutes.js";
import kitchenRoutes from "./routes/kitchenRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import referenceRoutes from "./routes/referenceRoutes.js";
import pantryRoutes from "./routes/pantryRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";
import shoppingRoutes from "./routes/shoppingRoutes.js";
import mealPlanRoutes from "./routes/mealPlanRoutes.js";
import savedRecipesRoutes from "./routes/savedRecipesRoutes.js";
import mealdbRoutes from "./routes/mealdbRoutes.js";

import {
  requireAuth,
  protectWrites,
} from "./middleware/auth.js";

import {
  notFound,
  errorHandler,
} from "./middleware/errorHandler.js";

// ==========================================
// APP CONFIGURATION
// ==========================================

const app = express();

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const frontendPath = path.resolve(
  __dirname,
  "../frontend/dist"
);

app.use(
  express.json({
    limit: "3mb",
  })
);

// Serve uploaded images.

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

// Do not cache private API responses.

app.use("/api", (_req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

// Protect database-changing requests.

app.use("/api", protectWrites);

// ==========================================
// PUBLIC API ROUTES
// ==========================================

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRoutes);

// ==========================================
// AUTHENTICATED API ROUTES
// ==========================================

app.use("/api", requireAuth);

app.use("/api", referenceRoutes);

app.use("/api/pantry-items", pantryRoutes);

app.use("/api/recipes", recipeRoutes);

app.use("/api/shopping-list", shoppingRoutes);

app.use("/api/meal-plan", mealPlanRoutes);

app.use("/api/saved-recipes", savedRecipesRoutes);

app.use("/api/mealdb", mealdbRoutes);

app.use("/api/chat", chatRoutes);

// Kitchen Studio and Grocery Scanner 2.0.

app.use("/api/kitchen/product", productRoutes);

app.use("/api/kitchen", kitchenRoutes);

// Handle unknown API routes.

app.use("/api", notFound);

// ==========================================
// SERVE THE REACT WEBSITE ON RENDER
// ==========================================

if (process.env.NODE_ENV === "production") {

  app.use(
    express.static(frontendPath)
  );

  // Support React Router pages when users
  // open links directly or refresh the page.

  app.get("*", (_req, res) => {
    res.sendFile(
      path.join(frontendPath, "index.html")
    );
  });
}

// ==========================================
// ERROR HANDLING
// ==========================================

app.use(errorHandler);

// ==========================================
// START SERVER
// ==========================================

const PORT = process.env.PORT || 3001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `PrepWise is running on port ${PORT}`
  );
});
