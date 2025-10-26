import express from "express";
import Match from "../models/Match.js";
import Classement from "../models/Classement.js";

const router = express.Router();

// ➕ Ajouter un match
router.post("/", async (req, res) => {
  try {
    const match = new Match({
      ...req.body,
      scoreDomicile:
        req.body.scoreDomicile !== undefined
          ? Number(req.body.scoreDomicile)
          : null,
      scoreExterieur:
        req.body.scoreExterieur !== undefined
          ? Number(req.body.scoreExterieur)
          : null,
    });

    await match.save();

    // 🏆 Mettre à jour le classement si scores disponibles
    if (match.scoreDomicile != null && match.scoreExterieur != null) {
      await updateClassement(match);
    }

    res.status(201).json(match);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 📜 Récupérer tous les matchs
router.get("/", async (req, res) => {
  try {
    const matchs = await Match.find()
      .populate("equipeDomicile", "nom")
      .populate("equipeExterieur", "nom")
      .sort({ date: -1 });
    res.json(matchs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📅 Récupérer le match le plus proche de la date actuelle
router.get("/prochain", async (req, res) => {
  try {
    const match = await Match.find({ date: { $gte: new Date() } })
      .sort({ date: 1 })
      .limit(1)
      .populate("equipeDomicile", "nom")
      .populate("equipeExterieur", "nom");

    if (!match.length) {
      return res.status(404).json({ message: "Aucun match à venir." });
    }

    res.json(match[0]);
  } catch (err) {
    console.error("Erreur :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// 🗑️ Supprimer un match
router.delete("/:id", async (req, res) => {
  try {
    await Match.findByIdAndDelete(req.params.id);
    res.json({ message: "Match supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✏️ Modifier un match
router.put("/:id", async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) return res.status(404).json({ message: "Match introuvable" });

    // 🧹 Si le match avait déjà un score, on retire son effet du classement
    if (match.scoreDomicile != null && match.scoreExterieur != null) {
      await revertClassement(match);
    }

    // ✍️ Mettre à jour les nouvelles infos (avec conversion des scores)
    Object.assign(match, {
      ...req.body,
      scoreDomicile:
        req.body.scoreDomicile !== undefined
          ? Number(req.body.scoreDomicile)
          : match.scoreDomicile,
      scoreExterieur:
        req.body.scoreExterieur !== undefined
          ? Number(req.body.scoreExterieur)
          : match.scoreExterieur,
    });

    await match.save();

    // 🧮 Réappliquer le nouveau résultat
    if (match.scoreDomicile != null && match.scoreExterieur != null) {
      await updateClassement(match);
    }

    res.json({ message: "Match modifié et classement mis à jour", match });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 🔧 Fonction de mise à jour du classement
async function updateClassement(match) {
  const { equipeDomicile, equipeExterieur, scoreDomicile, scoreExterieur } =
    match;

  const home =
    (await Classement.findOne({ equipe: equipeDomicile })) ||
    new Classement({ equipe: equipeDomicile });
  const away =
    (await Classement.findOne({ equipe: equipeExterieur })) ||
    new Classement({ equipe: equipeExterieur });

  home.matchsJoues += 1;
  away.matchsJoues += 1;

  home.panierMarques += scoreDomicile;
  home.panierEncaisses += scoreExterieur;
  away.panierMarques += scoreExterieur;
  away.panierEncaisses += scoreDomicile;

  if (scoreDomicile > scoreExterieur) {
    home.victoires += 1;
    home.points += 2;
    away.defaites += 1;
    away.points += 1;
  } else if (scoreExterieur > scoreDomicile) {
    away.victoires += 1;
    away.points += 2;
    home.defaites += 1;
    home.points += 1;
  }

  home.difference = home.panierMarques - home.panierEncaisses;
  away.difference = away.panierMarques - away.panierEncaisses;

  await home.save();
  await away.save();
}

export default router;
