const express = require('express');
const router = express.Router();
const cardController = require('../controller/cardController.js');

router.post('/create', cardController.createCard);

module.exports = router;