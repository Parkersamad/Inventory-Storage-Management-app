const asyncHandler = require("express-async-handler");
const Item = require("../models/itemsModel");

// Create a new Item
const createItem = asyncHandler(async (req, res) => {
  const {
    name,
    category,
    quantity,
    unit,
    location,
    description,
    costPrice,
    sellingPrice,
  } = req.body;

  // Validation
  if (
    !name ||
    !category ||
    !quantity ||
    !unit ||
    !location ||
    !description ||
    !costPrice ||
    !sellingPrice
  ) {
    res.status(400);
    throw new Error("Please fill all fields");
  }
});

module.exports = {
  createItem,
};
