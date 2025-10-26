// ✅ Importations de base
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";

// ✅ Importation des routes
import equipesRoutes from "./routes/equipes.js";
import matchsRoutes from "./routes/matchs.js";
import classementRoutes from "./routes/classement.js";
import actusRoutes from "./routes/actus.js";
import authRoutes from "./routes/auth.js";

// 🔧 Config
dotenv.config();
connectDB();

// 📦 Préparation du dossier et des variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 5000;

// 🚀 Express app
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*", // tu peux restreindre à ton domaine plus tard
  })
);

// 📁 Permet d'accéder aux images uploadées
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ✅ Routes API
app.use("/api/equipes", equipesRoutes);
app.use("/api/matchs", matchsRoutes);
app.use("/api/classement", classementRoutes);
app.use("/api/actus", actusRoutes);
app.use("/api/auth", authRoutes);

// ✅ Route test
app.get("/", (req, res) => {
  res.json({ message: "✅ API Club Basket Oran fonctionnelle !" });
});

// 🚀 Lancement du serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur backend lancé sur le port ${PORT}`);
});
