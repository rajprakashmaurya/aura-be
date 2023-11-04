// Signup
exports.signup = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the username already exists

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({ username, password: hashedPassword });

    // Save the user to the database

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Error signing up" });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username

    // Compare the provided password with the stored hashed password

    // If the passwords match, generate a JWT token

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Error logging in" });
  }
};
