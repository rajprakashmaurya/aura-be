const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Signup
exports.signup = async (req, res, next) => {
  try {
    const {
      hospitalName,
      email,
      password,
      cfPassword,
      phoneNumber,
      address,
      city,
      state,
      pincode,
      hosRegDate,
      hosResNum,
      emgWrdNum,
      certificate,
      numAmb,
    } = req.body;

    // Check if the username already exists
    if (!hospitalName) {
      return res.send({ error: "Hospital Name is Required" });
    }
    if (!email) {
      return res.send({ message: "Email is Required" });
    }
    if (!password) {
      return res.send({ message: "Password is Required" });
    }
    if (!phoneNumber) {
      return res.send({ message: "Phone number is Required" });
    }

    // Create a new user
    const exisitingUser = await userModel.findOne({ email });
    //exisiting user
    if (exisitingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Register please login",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedCfPassword = await bcrypt.hash(cfPassword, 10);
    // Save the user to the database

    const user = await userModel.create({
      hospitalName,
      email,
      password: hashedPassword,
      cfPassword: hashedCfPassword,
      phoneNumber,
      address,
      city,
      state,
      pincode,
      hosRegDate,
      hosResNum,
      emgWrdNum,
      numAmb,
      certificate,
    });

    return res.status(201).send({
      success: true,
      message: "User Register Successfully",
      user,
    });
    // Generate a JWT token
    // const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    // return res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Error signup up", message: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password, hospitalName, cfPassword } = req.body;
    //validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    //check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registerd",
      });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }

    //token
    const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        _id: user._id,
        hospitalName: user.hospitalName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        city: user.city,
        state: user.state,
        pincode: user.pincode,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: error,
    });
  }
};

exports.getAllUser = async (req, res) => {
  try {
    const users = await userModel.find({});
    if (users) {
      return res.status(202).json({
        users: users,
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching users", message: error.message });
  }
};

exports.getSearchedUsers = async (req, res) => {
  try {
    const { query } = req;
    const searchTerm = query.searchTerm || "";

    if (!searchTerm) {
      return res.status(400).json({ message: "Search term is required" });
    }

    // Search for users with hospitalName containing the searchTerm
    const filteredUsers = await userModel.find({
      hospitalName: { $regex: new RegExp(searchTerm, "i") }, // Case-insensitive search
    });

    if (filteredUsers.length === 0) {
      return res
        .status(404)
        .json({ message: "No users found with the given search term" });
    }

    res.status(200).json({ users: filteredUsers });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching users", message: error.message });
  }
};
