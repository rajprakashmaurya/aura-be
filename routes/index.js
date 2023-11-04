const express = require("express");
const userRoute = require("./authRoutes");

const router = express.Router();

router.use("/user", userRoute);

// router.get("/router", (req, res) => {
//   res.status(200).json({
//     message: "router",
//   });
// });

module.exports = router;
