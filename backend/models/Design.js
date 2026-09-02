const mongoose = require("mongoose");

const designSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, default: "Untitled Design" },
    sketchImage: { type: String, required: true }, // path/URL to uploaded sketch
    generatedImage: { type: String, default: null }, // path/URL to AI/GAN generated 3D-gold render
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Design", designSchema);
