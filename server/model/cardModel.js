const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  purchaseDate: {
    type: Date,
    required: true,
  },
  warrantyExpiry: {
    type: Date,
    required: true,
  },
  purchasePrice: {
    type: Number,
    required: true,
  },
  store: {
    type: String,
    required: true,
  },
  serialNumber: {
    type: String,
    required: true,
  },
  warrantyType: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  imageUri: {
    type: String,
  },
  isActive: {
    type: Boolean,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Card = mongoose.model("Card", cardSchema);
module.exports = Card;
