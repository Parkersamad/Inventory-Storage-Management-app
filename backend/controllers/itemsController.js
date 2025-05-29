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

  // check if item already exists
  const itemExixts = await Item.findOne({ name });

  if (itemExixts) {
    res.status(400);
    throw new Error("Item already exixts");
  }

  // create new item
  const item = await Item.create({
    addedBy: req.user.id,
    name,
    category,
    quantity,
    unit,
    location,
    description,
    costPrice,
    sellingPrice,
  });
  res.status(201).json(item);

  // populate the addedBy field with user details
  const populatedItem = await Item.findById(item._id).populate(
    "addedBy",
    "name email"
  );
  if (!populatedItem) {
    res.status(201).json(populatedItem);
  }
});

// Get all items
const getAllItems = asyncHandler(async (req, res) => {
  const items = await Item.find({})
    .sort("-createdAt")
    .populate("addedBy", "name email")
    .populate("lastUpdatedBy", "name email");
  res.status(200).json(items);
});

// Get a single item by name

const getItemByName = asyncHandler(async (req, res) => {
  const itemName = req.params.name;

  //find item by matching name and populate the addedBy field
  // Also make it cahse insensitive
  const item = await Item.findOne({ name: new RegExp(itemName, "i") })
    .populate("addedBy", "name email")
    .populate("lastUpdatedBy", "name email");

  if (!item) {
    res.status(404);
    throw new Error("Item not found");
  } else {
    res.status(200).json(item);
  }
});

module.exports = {
  createItem,
  getAllItems,
  getItemByName,
};
