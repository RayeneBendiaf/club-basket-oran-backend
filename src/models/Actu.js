import mongoose from "mongoose";

const actuSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true }, // Multer stocke ici le chemin de l’image
  datePublication: { type: Date, default: Date.now },
});

export default mongoose.model("Actu", actuSchema);
