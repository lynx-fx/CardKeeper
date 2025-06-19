const express = require("express");

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
  const {} = req.body;
  
  try {
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
