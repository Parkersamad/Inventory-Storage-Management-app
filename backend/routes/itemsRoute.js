const express = require("express");
const { createItem, getAllItems } = require("../controllers/itemsController");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

router.post("/", protect, createItem);
router.get("/", protect, getAllItems);

module.exports = router;
