const asyncHandler = require("express-async-handler");
const Item = require("../models/itemsModel");

// Create item
const createItem = asyncHandler(async (req, res) => {
    res.send ("create user route")
});

module.exports = {
    createItem,
}
;