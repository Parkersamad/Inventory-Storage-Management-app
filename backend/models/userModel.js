const mongoose = require('mongoose');

const userSchema = mongoose.Schema ({

name: {
    type: String,
    required : [true, "Please add a name"],
    trim: true,
},
email: {
    type: String,
    required : [true, "Please add an email"],
    unique: true,
    trim: true,
    match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/,
        "Please add a valid email",
    ],
},
phone: {
    type: String,
    default: "+234",
    required : [true, "Please add a phone number"],
    unique: true,
    trim: true,
    match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/,
        "Please add a valid phone number",
    ],
},
password: {
    type: String,
    required : [true, "Please add a password"],
    minLength: [6, "Password must be at least 6 characters"],
    maxLength: [23, "Password must be less than 23 characters"],
    trim: true,
},
photo: {
    type: String,
    required : [true, "Please add a photo"],
    default: "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-Clipart-Background.png",
},


},{
    timestamps: true,
})

const user = mongoose.model(user, userSchema)
module.exports = user;