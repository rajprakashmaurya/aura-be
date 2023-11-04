const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Signup
exports.signup = async (req, res) => {
  try {
    const {
      hospitalName,
      email,
      password,
      cfPassword,
      phoneNumber,
      addresses,
      address,
      city,
      state,
      pincode,
      hospitalReDate,
      hospitalReNum,
      emWdNum,
      certificate,
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
    // Save the user to the database

    const user = await new userModel({
      hospitalName,
      email,
      password: hashedPassword,
      cfPassword,
      phoneNumber,
      addresses,
      address,
      city,
      state,
      pincode,
      hospitalReDate,
      hospitalReNum,
      emWdNum,
      certificate,
    }).save();
    await res.status(201).send({
      success: true,
      message: "User Register Successfully",
      user,
    });
    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Error signup up", message: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
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
        addresses: user.addresses,
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

//get all user
// router.get('/users', async (req, res) => {
//   try {
//     const users = await userModel.find();
//     res.status(200).json(users);
//   } catch (error) {
//     res.status(500).json({ error: "Error fetching users" });
//   }
// });

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
