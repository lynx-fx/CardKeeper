const express = require("express");

exports.getUserDetail = async () => {
  try {
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
