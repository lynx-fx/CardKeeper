const express = require("express");
const tokenExtractor = require("../utils/tokenExtractor");
const jwt = require("jsonwebtoken");

// models
const Card = require("../model/cardModel");
const User = require("../model/userModel");

// middelwares
const { cardValidationSchema } = require("../middleware/validator");

// TODO: get cards
exports.getCard = async (req, res) => {
  try {
    return res.status(200);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// TODO: create cards
exports.createCard = async (req, res) => {
  const {
    brand,
    category,
    purchaseDate,
    warrantyPeriod,
    purchasePrice,
    store,
    warrantyType,
    description,
  } = req.body;

  const imageUri = req.file ? req.file.filename : "default";

  try {
    // validating inputs
    const { error, value } = cardValidationSchema.validate(
      brand,
      category,
      purchaseDate,
      warrantyPeriod,
      purchasePrice,
      store,
      warrantyType,
      description,
      imageUri
    );

    // extracting auth token
    const token = tokenExtractor(req);

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided." });
    }

    // getting user details
    const decode = jwt.verify(token, process.env.TOKEN_SECRET);
    const existingUser = await User.findOne({ email: decode.email });

    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // creating new card object and saving into database
    const card = new Card({
      brand,
      category,
      purchaseDate,
      warrantyPeriod,
      purchasePrice,
      store,
      warrantyType,
      description,
      imageUri,
      active: true,
      user: existingUser._id,
    });
    await card.save();
    return res
      .status(200)
      .json({ success: true, message: "Card created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// TODO: update cards
exports.updateCard = async (req, res) => {
  try {
    return res
      .status(200)
      .json({ success: true, message: "Card updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// TODO: delete cards
exports.deleteCard = async (req, res) => {
  try {
    return res
      .status(200)
      .json({ success: true, message: "Card deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
