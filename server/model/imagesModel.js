const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    imageUri: {
      type: String,
      required: true,
    },
    card: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Card",
      required: true,
    },
  },
  { timestamps: true }
);

const Image = mongoose.model("Image", imageSchema);
