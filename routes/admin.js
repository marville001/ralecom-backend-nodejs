const express = require("express");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const _ = require("lodash");
const router = express.Router();
const { Admin } = require("../models/admin");
const auth = require("../middleware/auth");

router.get("/me", auth, async (req, res) => {
  const admin = await Admin.findById(req.user._id).select("-password");
  res.send({
    success: true,
    admin: _.pick(admin, ["_id", "name", "email", "isAdmin"]),
  });
});

router.post("/auth", async (req, res) => {
  const { error } = validate(req.body);
  if (error)
    return res
      .status(400)
      .send({ success: false, message: error.details[0].message });

  const admin = await Admin.findOne({ email: req.body.email });
  if (!admin)
    return admin
      .status(400)
      .send({ success: false, message: "Invalid email or password..." });

  const validPassword = await bcrypt.compare(req.body.password, admin.password);
  if (!validPassword)
    return res
      .status(400)
      .send({ success: false, message: "Invalid email or password..." });

  res.send({
    success: true,
    admin: _.pick(admin, ["_id", "name", "email", "isAdmin"]),
    token: admin.generateAuthToken(),
  });
});

function validate(req) {
  const schema = {
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(255).required(),
  };
  return Joi.validate(req, schema);
}

module.exports = router;
