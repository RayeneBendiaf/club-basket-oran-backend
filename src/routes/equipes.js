import express from "express";
import Equipe from "../models/Equipe.js";

const router = express.Router();

// ➕ Ajouter une équipe
router.post("/", async (req, res) => {
  try {
    const equipe = new Equipe(req.body);
    await equipe.save();
    res.status(201).json(equipe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 🗑️ Supprimer une équipe
router.delete("/:id", async (req, res) => {
  try {
    await Equipe.findByIdAndDelete(req.params.id);
    res.json({ message: "Équipe supprimée avec succès" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📜 Récupérer toutes les équipes
router.get("/", async (req, res) => {
  try {
    const equipes = await Equipe.find();
    res.json(equipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
