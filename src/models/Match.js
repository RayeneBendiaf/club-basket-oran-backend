import mongoose from "mongoose";

const matchSchema = new mongoose.Schema(
  {
    equipeDomicile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Equipe",
      required: true,
    },
    equipeExterieur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Equipe",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    heure: {
      type: String,
      required: true,
    },
    lieu: {
      type: String,
      required: true,
    },
    scoreDomicile: {
      type: Number,
      default: null,
    },
    scoreExterieur: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Match", matchSchema);
