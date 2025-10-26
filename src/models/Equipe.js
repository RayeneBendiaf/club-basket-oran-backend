import mongoose from "mongoose";
import Classement from "./Classement.js";

const equipeSchema = new mongoose.Schema({
  nom: { type: String, required: true, unique: true },
});
// 🟢 Lorsqu'une équipe est créée → créer un classement associé
equipeSchema.post("save", async function (doc, next) {
  try {
    const exist = await Classement.findOne({ equipe: doc._id });
    if (!exist) {
      await Classement.create({ equipe: doc._id });
    }
    next();
  } catch (err) {
    console.error("Erreur création classement:", err.message);
    next(err);
  }
});

// 🔴 Lorsqu'une équipe est supprimée → supprimer son classement
equipeSchema.post("findOneAndDelete", async function (doc, next) {
  try {
    if (doc) {
      await Classement.deleteOne({ equipe: doc._id });
    }
    next();
  } catch (err) {
    console.error("Erreur suppression classement:", err.message);
    next(err);
  }
});

export default mongoose.model("Equipe", equipeSchema);
