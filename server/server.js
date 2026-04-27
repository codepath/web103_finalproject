import express from "express";
import cors from "cors";
import flowerRoutes from "./routes/flowers.js";
import userRoutes from "./routes/users.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/flowers", flowerRoutes);
app.use("/api/users", userRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong" });
});


// app.get("/", (req, res) => {
//   res
//     .status(200)
//     .send(
//       '<h1 style="text-align: center; margin-top: 50px;">🌸FlowerHunt API</h1>',
//     );
// });

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});