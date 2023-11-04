const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const router = require("./routes");
const connectDB = require("./config/db");

const app = express();

// Load environment variables
dotenv.config();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use("/api/v1/", router);

// Start the server
const port = process.env.PORT || 8080;
app.listen(port, async () => {
  //db.connect
  await connectDB();
  console.log(`Server is running on port ${port}`);
});
