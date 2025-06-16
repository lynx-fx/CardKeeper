const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  Brand: {
    type: String,
    required: true,
  },
  Category: {
    type: String,
    required: true,
  },
  purchaseDate: {
    type: Date,
    required: true,
  },
  warrantyPeriod: {
    type: Number,
    required: true,
  },
  purchasePrice: {
    type: Number,
    required: true,
  },
  Store: {
    type: String,
    required: true,
  },
  WarrantyType: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    required: false,
  },
  active: {
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
