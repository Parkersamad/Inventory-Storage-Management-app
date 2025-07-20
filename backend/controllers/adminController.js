const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Item = require("../models/itemsModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Token = require("../models/tokenModel");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
}

//Regiter a new admin
const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  // Validation
  if (!name || !email || !password || !phone) {
    res.status(400);
    throw new Error("Please fill all fields");
  }
  // validate password length
  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters");
  }

  // check if admin email already exists
  const adminExists = await User.findOne({ email });

  if (adminExists) {
    res.status(400);
    throw new Error("Admin already exists");
  }

  // Create new admin
  const admin = await User.create({
    name,
    email,
    password,
    phone,
    role: 'admin',
  });

  // generate token
  const token = generateToken(admin._id);

  // Send HTTP-only cookie
  res.cookie("token", token, {
    path: "/",
    expires: new Date(Date.now() + 1000 * 86400), // 1 day
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  if(admin){
    const { _id, name, email, phone, photo } = admin;
    res.status(201).json({
      _id,
        name,
        email,
        phone,
        token,
  });
}else {
    res.status(400);
    throw new Error("Invalid admin data");
  }
  
});

module.exports = {
  registerAdmin
};