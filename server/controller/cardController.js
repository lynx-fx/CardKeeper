require("dotenv").config("../.env");
const express = require("express");
const { tokenExtractor } = require("../utils/tokenExtractor");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

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
        .json({ success: false, message: "Unauthorized user" });
    }
    // getting all cards details
    const decode = jwt.verify(token, process.env.TOKEN_SECRET);
    const cards = await Card.find({ user: decode.id });

    if (cards.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Add cards to view" });
    }

    return res.status(200).json({ success: true, cards });
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
      productName,
      brand,
      purchaseDate,
      warrantyExpiry,
      category,
      purchasePrice,
      store,
      serialNumber,
      warrantyType,
      description,
    } = req.body;

    const imageUri = req.file ? req.file.filename : "default.png";
    // validating inputs
    const { error, value } = cardValidationSchema.validate({
      productName,
      brand,
      purchaseDate,
      warrantyExpiry,
      category,
      purchasePrice,
      store,
      serialNumber,
      warrantyType,
      description,
      imageUri,
    });

    if (error) {
      console.log(error);

      return res
        .status(400)
        .json({ success: false, message: "Invalid inputs" });
    }

    // extracting auth token
    const token = tokenExtractor(req);

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized user" });
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
      productName,
      brand,
      purchaseDate,
      warrantyExpiry,
      category,
      purchasePrice,
      store,
      serialNumber,
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
// TODO: recheck parameters
exports.updateCard = async (req, res) => {
  try {
    const {
      productName,
      brand,
      purchaseDate,
      warrantyExpiry,
      category,
      purchasePrice,
      store,
      serialNumber,
      warrantyType,
      description,
      cardId,
    } = req.body;

    // validating inputs
    const { error, value } = cardUpdateValidationSchema.validate({
      productName,
      brand,
      purchaseDate,
      warrantyExpiry,
      category,
      purchasePrice,
      store,
      serialNumber,
      warrantyType,
      description,
    });

    if (error) {
      console.log(error);
      return res
        .status(400)
        .json({ success: false, message: "Invalid inputs" });
    }

    // extracting auth token
    const token = tokenExtractor(req);

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized user" });
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

    if (!existingCard) {
      return res
        .status(404)
        .json({ success: false, message: "Card not found." });
    }

    // checking whether card belongs to user or not
    if (existingUser._id.toString() !== existingCard.user.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Card doesn't belong to the user." });
    }

    //updating card
    if (brand !== null) existingCard.brand = brand;
    if (category !== null) existingCard.category = category;
    if (purchaseDate !== null) existingCard.purchaseDate = purchaseDate;
    if (warrantyExpiry !== null) existingCard.warrantyExpiry = warrantyExpiry;
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
        .json({ success: false, message: "Unauthorized user" });
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

    if (!existingCard) {
      return res
        .status(404)
        .json({ success: false, message: "Card not found." });
    }

    // checking whether card belongs to user or not
    if (existingUser._id.toString() !== existingCard.user.toString()) {
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

// DONE:add images to card
// DONE: handle multiple images
exports.addImages = async (req, res) => {
  try {
    const { cardId } = req.body;

    // const imageUri = req.file ? req.file.filename : "default";
    const images = req.files; // array of uploaded files

    if (!images || images.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No image uploaded." });
    }

    // extracting auth token
    const token = tokenExtractor(req);

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized user" });
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

    if (!existingCard) {
      return res
        .status(404)
        .json({ success: false, message: "Card not found." });
    }

    if (!existingCard) {
      return res
        .status(404)
        .json({ success: false, message: "Card not found." });
    }

    // checking whether card belongs to user or not
    if (existingUser._id.toString() !== existingCard.user.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Card doesn't belong to the user." });
    }

    for (const image of images) {
      const newImage = new Image({
        imageUri: image.filename,
        card: existingCard._id,
      });
      await newImage.save();
    }

    return res
      .status(200)
      .json({ success: true, message: "Images uploaded successfully." });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// DONE: get images for card
exports.getImages = async (req, res) => {
  try {
    const { cardId } = req.query;

    // extracting auth token
    const token = tokenExtractor(req);

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized user" });
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

    if (!existingCard) {
      return res
        .status(404)
        .json({ success: false, message: "Card not found." });
    }

    // checking whether card belongs to user or not
    if (existingUser._id.toString() !== existingCard.user.toString()) {
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

exports.deleteImage = async (req, res) => {
  try {
    const { imageId } = req.body;

    const token = tokenExtractor(req);
    if (!token) {
      return res
        .status(400)
        .json({ success: false, message: "Unauthorized user" });
    }

    const decode = jwt.verify(token, process.env.TOKEN_SECRET);
    const existingUser = await User.findOne({ email: decode.email });

    const existingImage = await Image.findById(imageId);
    if (!existingImage) {
      return res
        .status(404)
        .json({ success: false, message: "Image not found" });
    }

    const existingCard = await Card.findById(existingImage.card);
    if (!existingCard) {
      return res
        .status(404)
        .json({ success: false, message: "Card not found" });
    }

    const cardUser = await User.findById(existingCard.user);
    if (cardUser.id !== existingUser.id) {
      return res
        .status(400)
        .json({ success: false, message: "Unauthorized user" });
    }

    await Image.findByIdAndDelete(imageId);

    return res
      .status(200)
      .json({ success: true, message: "Image deleted successfully" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
