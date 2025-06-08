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
  // Also make it case insensitive
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

// updating an item
const updateItem = asyncHandler(async (req, res) => {
  const {
    category,
    quantity,
    unit,
    location,
    description,
    costPrice,
    sellingPrice,
  } = req.body;
  const { name } = req.params.name;

  const item = await Item.findOne({ name: new RegExp(name, "i") });
  if (!item) {
    res.status(404);
    throw new Error("Item not found");

    //match item to it user
    if (item.addedBy.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error("You are not authorized to update this item");
    }
  }

  // Update item fields
  const updatedItem = await Item.findByIdAndUpdate(
    item._id,
    {
      category: category || item.category,
      quantity: quantity || item.quantity,
      unit: unit || item.unit,
      location: location || item.location,
      description: description || item.description,
      costPrice: costPrice || item.costPrice,
      sellingPrice: sellingPrice || item.sellingPrice,
      lastUpdatedBy: req.user.id, // Update the lastUpdatedBy field
    },
    {
      new: true,
      runValidators: true, // Ensure that the updated fields are validated
    } // Return the updated document
  )
    .populate("addedBy", "name email")
    .populate("lastUpdatedBy", "name email");
  res.status(200).json(updatedItem);
});

// delete an item
const deleteItem = asyncHandler(async (req, res) => {
  const { name } = req.params;
  // Find the item by name
  // Make it case insensitive
  const item = await Item.findOne({ name: new RegExp(name, "i") });
  if (!item) {
    res.status(404);
    throw new Error("Item not found");
  }
  // Check if the user is authorized to delete the item
  if (item.addedBy.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("You are not authorized to delete this item");
  }
  // Delete the item by name
  // Use deleteOne to remove the item from the database
  await Item.deleteOne({ _id: item._id });
  res.status(200).json({ message: "Item deleted successfully" });
});

module.exports = {
  createItem,
  getAllItems,
  getItemByName,
  updateItem,
  deleteItem,
};
