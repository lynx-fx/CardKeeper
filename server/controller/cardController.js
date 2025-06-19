const express = require("express");
const tokenExtractor = require("../utils/tokenExtractor");
const jwt = require("jsonwebtoken");

// models
const Card = require("../model/cardModel");
const User = require("../model/userModel");
const Image = require("../model/imagesModel");

// middelwares
const {
  cardValidationSchema,
  cardUpdateValidationSchema,
} = require("../middleware/validator");

// TODO: integrate all API's with the frontend and recheck functionality

// DONE: get cards
exports.getCard = async (req, res) => {
  try {
    const token = tokenExtractor(req);
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided." });
    }
    // getting all cards details
    const decode = jwt.verify(token, process.env.TOKEN_SECRET);
    const cards = await Card.find({ user: existingUser._id });

    if (!cards) {
      return res
        .status(404)
        .json({ success: false, message: "No cards found." });
    }

    return res.status(200).json({ success: false, cards });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// DONE: create cards
// DONE: Handle properly saving images
exports.createCard = async (req, res) => {
  try {
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
      isActive: true,
      user: existingUser._id,
    });
    await card.save();

    // saving image to image model for easier retrieval
    const imageHandler = new Image({
      imageUri,
      card: card._id,
    });
    await imageHandler.save();
    return res
      .status(200)
      .json({ success: true, message: "Card created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// DONE: update cards
exports.updateCard = async (req, res) => {
  try {
    const {
      brand,
      category,
      purchaseDate,
      warrantyPeriod,
      purchasePrice,
      store,
      warrantyType,
      description,
      cardId,
    } = req.body;

    // validating inputs
    const { error, value } = cardUpdateValidationSchema.validate(
      brand,
      category,
      purchaseDate,
      warrantyPeriod,
      purchasePrice,
      store,
      warrantyType,
      description
    );

    // extracting auth token
    const token = tokenExtractor(req);

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided." });
    }

    // getting user details via token
    const decode = jwt.verify(token, process.env.TOKEN_SECRET);
    const existingUser = await User.findOne({ email: decode.email });

    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // getting card details
    const existingCard = await Card.findById(cardId);

    // checking whether card belongs to user or not
    if (existingUser._id !== existingCard.user) {
      return res
        .status(403)
        .json({ success: false, message: "Card doesn't belong to the user." });
    }

    //updating card
    if (brand !== null) existingCard.brand = brand;
    if (category !== null) existingCard.category = category;
    if (purchaseDate !== null) existingCard.purchaseDate = purchaseDate;
    if (warrantyPeriod !== null) existingCard.warrantyPeriod = warrantyPeriod;
    if (purchasePrice !== null) existingCard.purchasePrice = purchasePrice;
    if (store !== null) existingCard.store = store;
    if (warrantyType !== null) existingCard.warrantyType = warrantyType;
    if (description !== null) existingCard.description = description;
    await existingCard.save();
    return res
      .status(200)
      .json({ success: true, message: "Card updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// DONE: delete cards
exports.deleteCard = async (req, res) => {
  try {
    const { cardId } = req.body;

    // extracting auth token
    const token = tokenExtractor(req);

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided." });
    }

    // getting user details via token
    const decode = jwt.verify(token, process.env.TOKEN_SECRET);
    const existingUser = await User.findOne({ email: decode.email });

    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // getting card details
    const existingCard = await Card.findById(cardId);

    // checking whether card belongs to user or not
    if (existingUser._id !== existingCard.user) {
      return res
        .status(403)
        .json({ success: false, message: "Card doesn't belong to the user." });
    }

    existingCard.isActive = false;
    await existingCard.save();
    return res
      .status(200)
      .json({ success: true, message: "Card deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// DONE: get images for card
exports.getImages = async (req, res) => {
  try {
    const { cardId } = req.body;

    // extracting auth token
    const token = tokenExtractor(req);

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided." });
    }

    // getting user details via token
    const decode = jwt.verify(token, process.env.TOKEN_SECRET);
    const existingUser = await User.findOne({ email: decode.email });

    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // getting card details
    const existingCard = await Card.findById(cardId);

    // checking whether card belongs to user or not
    if (existingUser._id !== existingCard.user) {
      return res
        .status(403)
        .json({ success: false, message: "Card doesn't belong to the user." });
    }

    const images = await Image.find({ card: existingCard._id });
    if (!images) {
      return res
        .status(404)
        .json({ success: false, message: "No images found." });
    }
    return res.status(200).json({ success: true, images });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
