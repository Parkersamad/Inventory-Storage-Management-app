const express = require("express");
const { createItem, getAllItems, getItemByName, updateItem } = require("../controllers/itemsController");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

router.post("/", protect, createItem);
router.get("/", protect, getAllItems);
router.get("/:name", protect, getItemByName); // Assuming you want to get all items by user name
router.patch("/:name", protect, updateItem); // Assuming you want to update an item by its ID

module.exports = router;
