const express = require("express");

const app = express();

app.listen(8080, (req, res) => {
  console.log("server is running at port 8080");
});
