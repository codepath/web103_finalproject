import express from "express";
import cors from "cors";
import "./config/db.js";
import referenceRoutes from "./routes/referenceRoutes.js";
import pantryRoutes from "./routes/pantryRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api", referenceRoutes);

// Feature routes are mounted here
app.use("/api/pantry-items", pantryRoutes);

app.use("/api", notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`PrepWise API on http://localhost:${PORT}`));
