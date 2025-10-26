import express from "express";
import multer from "multer";
import Actu from "../models/Actu.js";

const router = express.Router();

// 📁 Configuration de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // dossier où seront stockées les images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ➕ Ajouter une actu avec image
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { titre, description } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const actu = new Actu({ titre, description, image: imagePath });
    await actu.save();

    res.status(201).json(actu);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 📜 Récupérer toutes les actus
router.get("/", async (req, res) => {
  try {
    const actus = await Actu.find().sort({ datePublication: -1 });
    res.json(actus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🗑️ Supprimer une actu
router.delete("/:id", async (req, res) => {
  try {
    await Actu.findByIdAndDelete(req.params.id);
    res.json({ message: "Actu supprimée avec succès" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✏️ Modifier une actu (avec possibilité de changer l’image)
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { titre, description } = req.body;
    const imagePath = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.image;

    const actu = await Actu.findByIdAndUpdate(
      req.params.id,
      { titre, description, image: imagePath },
      { new: true }
    );

    res.json(actu);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
