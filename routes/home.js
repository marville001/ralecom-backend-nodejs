const express = require("express");
// const auth = require("../middleware/auth");
const router = express.Router();

router.get("/", (req, res) => {
  res.send({ success: true, info: "Welcome to.........." });
});
module.exports = router;
