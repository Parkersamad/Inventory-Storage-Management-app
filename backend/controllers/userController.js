const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};
// Register a new user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  // Validation
  if (!name || !email || !password || !phone) {
    res.status(400);
    throw new Error("Please fill all fields");
  }
  // validate password length
  if (password.lenght < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters");
  }

  // check if user email already exists
  const userExixts = await User.findOne({ email });

  if (userExixts) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Create new user
  const user = await User.create({
    name,
    email,
    password,
    phone,
  });

  // generate token
  const token = generateToken(user._id);

  // Send HTTP-only cookie
  res.cookie("token", token, {
    path: "/",
    expires: new Date(Date.now() + 1000 * 86400), // 1 day
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

  if (user) {
    const { _id, name, email, password, phone, photo } = user;
    res.status(201).json({
      _id,
      name,
      email,
      password,
      phone,
      photo,
      token,
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

// Login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //validation
  if (!email || !password) {
    res.status(400);
    throw new Error("Please add email and password");
  }

  // check if user email already exists
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error("User not found please signup");
  }

  // User exists, check if passowrd is correct
  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  // generate token
  const token = generateToken(user._id);

  // Send HTTP-only cookie
  res.cookie("token", token, {
    path: "/",
    expires: new Date(Date.now() + 1000 * 86400), // 1 day
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

  if (user && isPasswordCorrect) {
    const { _id, name, email, password, phone, photo } = user;
    res.status(200).json({
      _id,
      name,
      email,
      password,
      phone,
      photo,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
});

// Logout user
const logout = asyncHandler(async (req, res) => {
  // Send HTTP-only cookie
  res.cookie("token", "", {
    path: "/",
    expires: new Date(0), // expire the cookie right away
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  return res.status(200).json({ message: "Logged out successfully" });
});

// Get user data
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const { _id, name, email, password, phone, photo } = user;
    res.status(200).json({
      _id,
      name,
      email,
      password,
      phone,
      photo,
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

// Get loggen status
const loginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    res.json(false);
  }
  // verify token
  const verified = jwt.verify(token, process.env.JWT_SECRET);
  if (verified) {
    res.json(true);
  } else {
    res.json(false);
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const { name, email, phone, photo } = user;
    user.email = email;
    user.name = req.body.name || name;
    user.phone = req.body.phone || phone;
    user.photo = req.body.photo || photo;

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      photo: updatedUser.photo,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { oldPassword, password } = req.body;

  if (!user) {
    res.status(404);
    throw new Error("User not found, Please sign up");
  }
  // validate
  if (!oldPassword || !password) {
    res.status(400);
    throw new Error("Please add old and new password");
  }

  // check if  old passworrd matches password in DB
  const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password);

  // Save new passowrd
  if (user && passwordIsCorrect) {
    user.password = password;
    await user.save();
    res.status(200).json({
      message: "Password changed successfully",
    });
  }
  else {
    res.status(400);
    throw new Error("Old password is incorrect");
  }
});
module.exports = {
  registerUser,
  loginUser,
  logout,
  getUser,
  loginStatus,
  updateUser,
  changePassword,
};
