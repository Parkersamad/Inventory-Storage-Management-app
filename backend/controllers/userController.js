const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const registerUser = asyncHandler (async (req, res) => {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please fill all fields");
    }
   // validate password length
   if (password.lenght < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters");
   }

   // check if user email already exists
   const userExixts = await User.findOne ({ email })

   if (userExixts) {
    res.status(400);
    throw new Error("User already exists");
   }

   // Create new user
   const user = await User.create({
    name,
    email,
    password,
   });

   if (user){
    const {_id, name , email, password, phone, photo} = user;
    res.status(201).json({
        _id,
        name,
        email,
        password,
        phone,
        photo,
    })
   }
   else {
    res.status(400);
    throw new Error("User not found");
}

});

module.exports = {
    registerUser
};