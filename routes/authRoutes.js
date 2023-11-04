const express = require("express");
const userRoute = express.Router();
const createUser = require("../controllers/authControllers");

// Signup route
userRoute.post("/signup", createUser.signup);

// Login route
userRoute.post("/login", createUser.login);

//get all user
userRoute.get("/user", createUser.getAllUser);

// userRoute.get("/router", (req, res) => {
//   res.status(200).json({
//     message: "User router",
//   });
// });

module.exports = userRoute;
