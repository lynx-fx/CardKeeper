const express = require("express");
const router = express.Router();

const userController = require("../controller/userController");

router.get("/getDetails", userController.getUserDetail);

module.exports = router;
