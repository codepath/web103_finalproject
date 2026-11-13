import express from "express";
import cors from "cors";
import path from "path";
import chatRoutes from "./routes/chatRoutes.js";
import referenceRoutes from "./routes/referenceRoutes.js";
import pantryRoutes from "./routes/pantryRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";
import shoppingRoutes from "./routes/shoppingRoutes.js";
import mealPlanRoutes from "./routes/mealPlanRoutes.js";
import savedRecipesRoutes from "./routes/savedRecipesRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import resetRoutes from "./routes/resetRoutes.js";
import mealdbRoutes from "./routes/mealdbRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api", referenceRoutes);

app.use("/api/pantry-items", pantryRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/shopping-list", shoppingRoutes);
app.use("/api/meal-plan", mealPlanRoutes);
app.use("/api/saved-recipes", savedRecipesRoutes);
app.use("/api/mealdb", mealdbRoutes);

app.use("/api/reset", resetRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api", notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`PrepWise API on http://localhost:${PORT}`));