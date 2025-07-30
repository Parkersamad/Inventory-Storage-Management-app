const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { resolveContent } = require("nodemailer/lib/shared");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      trim: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/,
        "Please add a valid email",
      ],

    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minLength: [6, "Password must be at least 6 characters"],
      // maxLenght: [23, "Password must be at most 23 characters"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Please add a phone number"],
      trim: true,
      match: [/^((\+91-?)|0)?[789]\d{9}$/, "Please add a valid phone number"],
    },
    photo: {
      type: String,
      required: [true, "Please add a photo"],
      default:
        "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-Clipart-Background.png",
    },
    role: {
      type: String,
      enum: ["admin", "manager","supervisor","user"],
      default: "user",
    },
    permissions: {
      createItem: { type: Boolean, default: true },
      updateItem: { type: Boolean, default: true },
      deleteItem: { type: Boolean, default: false },
      viewReports: { type: Boolean, default: false },
      manageUsers: { type: Boolean, default: false },
      deleteUsers: { type: Boolean, default: false },
      manageItems: { type: Boolean, default: false },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    lastLogout: {
      type: Date,
      default: Date.now,
    },
    
  },
  {
    timestamps: true,
  }
);

// Encrypt password before saving to DB
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;