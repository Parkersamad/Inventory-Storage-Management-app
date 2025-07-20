const express= require("express");
const protect = require("../middleware/authMiddleware");
const { registerAdmin } = require("../controllers/adminController");
const router = express.Router();

router.post("/register", protect, registerAdmin);
module.exports = router
