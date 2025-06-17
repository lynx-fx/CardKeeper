const express = require("express");
const router = express.Router();
const cardController = require("../controller/cardController.js");

router.get("/get", cardController.get);

router.post("/create", cardController.createCard);
router.post("/delete", cardController.deleteCard);
router.put("/update", cardController.updateCard);

module.exports = router;