const express = require("express");
const router = express.Router();
const cardController = require("../controller/cardController.js");
const upload = require("../middleware/multer.js");
const { identifier } = require("../middleware/identifier.js");

router.get("/getCard", identifier, cardController.getCard);
router.get("/getImages", identifier, cardController.getImages);

router.post(
  "/createCard",
  upload.array("img", 5),
  identifier,
  cardController.createCard
);
router.delete("/deleteCard", identifier, cardController.deleteCard);

router.post(
  "/addImages",
  upload.array("img", 5),
  identifier,
  cardController.addImages
);
router.delete("/removeImage", identifier, cardController.deleteImage);

router.put("/updateCard", identifier, cardController.updateCard);

module.exports = router;
