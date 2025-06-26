const express = require("express");
const router = express.Router();
const authController = require("../controller/authController.js");
const {identifier} = require("../middleware/identifier.js")

router.get("/validateToken", authController.validateToken);

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", identifier, authController.logout);
router.post("/forgot", authController.forgotPassword);
router.post("/resetPassword", authController.resetPassword);
router.post("/changePassword", identifier, authController.changePassword);

module.exports = router;