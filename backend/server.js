import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";

dotenv.config();

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cors({
  origin: "*", // o si quieres restringirlo: "http://localhost:8081"
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(morgan("dev"));

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Conectado a MongoDB Atlas"))
  .catch((err) => console.error("❌ Error al conectar a MongoDB:", err.message));

// Prefijos de rutas
app.use("/auth", authRoutes);    // → /auth/register, /auth/login, /auth/logout
app.use("/api", postRoutes);   // → /posts/create, /posts/feed
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.json({ message: "Servidor FlashGram funcionando correctamente 🚀" });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
