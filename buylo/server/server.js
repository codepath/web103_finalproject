import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { client } from "./config/database.js";
import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/productRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import orderRouter from "./routes/orderRoutes.js";

const app = express();

app.use(express.json());
app.use(cors());

dotenv.config();

app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);

const port = process.env.PORT || 3001;

app.listen(port, () => console.log(`Listening on Port: ${port}`));
