const express = require("express");
const { createItem, getAllItems, getItemByName } = require("../controllers/itemsController");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

router.post("/", protect, createItem);
router.get("/", protect, getAllItems);
router.get("/:name", protect, getItemByName); // Assuming you want to get all items by user name

module.exports = router;
