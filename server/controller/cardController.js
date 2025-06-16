const express = require("express");

// TODO
exports.create = async (req, res) => {
  try {
    return res
      .status(200)
      .json({ success: true, message: "Card created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
