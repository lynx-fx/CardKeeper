const express = require("express");
const router = express.Router();
const cardController = require("../controller/cardController.js");
const upload = require("../middleware/multer.js");

router.get("/getCard", cardController.getCard);
router.get("/getImages", cardController.getImages);

router.post("/createCard", upload.single("img"), cardController.createCard);
router.delete("/deleteCard", cardController.deleteCard);

router.post("/addImages", upload.array("img", 5), cardController.addImages);

router.put("/updateCard", cardController.updateCard);

module.exports = router;
