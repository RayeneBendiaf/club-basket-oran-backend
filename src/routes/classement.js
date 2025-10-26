// routes/classement.js
import express from "express";
import Classement from "../models/Classement.js";

const router = express.Router();

// GET /api/classements  (existant)
router.get("/", async (req, res) => {
  try {
    const classement = await Classement.find()
      .populate("equipe", "nom")
      .sort({ points: -1, difference: -1 });
    res.json(classement);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/classements/:id  (existant) - mise à jour individuelle
router.put("/:id", async (req, res) => {
  try {
    const classement = await Classement.findById(req.params.id);
    if (!classement)
      return res.status(404).json({ message: "Classement non trouvé" });

    const fields = [
      "points",
      "matchsJoues",
      "victoires",
      "defaites",
      "panierMarques",
      "panierEncaisses",
    ];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) classement[f] = req.body[f];
    });
    classement.difference =
      classement.panierMarques - classement.panierEncaisses;
    const updated = await classement.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/classements/:id/reset  (existant) - reset individuel
router.put("/:id/reset", async (req, res) => {
  try {
    const classement = await Classement.findById(req.params.id);
    if (!classement)
      return res.status(404).json({ message: "Classement non trouvé" });

    classement.points = 0;
    classement.matchsJoues = 0;
    classement.victoires = 0;
    classement.defaites = 0;
    classement.panierMarques = 0;
    classement.panierEncaisses = 0;
    classement.difference = 0;

    const reset = await classement.save();
    res.json({ message: "Classement réinitialisé", reset });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ❌ Supprimer un classement par ID
router.delete("/:id", async (req, res) => {
  try {
    await Classement.findByIdAndDelete(req.params.id);
    res.json({ message: "Classement supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
