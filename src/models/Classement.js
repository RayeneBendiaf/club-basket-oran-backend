import mongoose from "mongoose";

const classementSchema = new mongoose.Schema({
  equipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Equipe",
    required: true,
    unique: true,
  },
  points: { type: Number, default: 0 },
  matchsJoues: { type: Number, default: 0 },
  victoires: { type: Number, default: 0 },
  defaites: { type: Number, default: 0 },
  panierMarques: { type: Number, default: 0 }, // total points marqués
  panierEncaisses: { type: Number, default: 0 }, // total points encaissés
  difference: { type: Number, default: 0 }, // panierMarques - panierEncaisses
});

export default mongoose.model("Classement", classementSchema);
