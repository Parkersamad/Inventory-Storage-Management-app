const express = require('express');
const { createItem } = require('../controllers/itemsController');
const router = express.Router();

router.post("/createitems", createItem);

module.exports = router;
