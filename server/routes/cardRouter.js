const express = require("express");
const router = express.Router();
const cardController = require("../controller/cardController.js");
const upload = require("../middleware/multer.js")

router.get("/get", cardController.getCard);

router.post("/create", upload.single("img"),cardController.createCard);
router.post("/delete", cardController.deleteCard);
router.put("/update", cardController.updateCard);

module.exports = router;