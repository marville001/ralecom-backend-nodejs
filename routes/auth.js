const express = require("express");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const router = express.Router();
const { User } = require("../models/user");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error)
    return res
      .status(400)
      .send({ success: false, message: error.details[0].message });
  let user = await User.findOne({ email: req.body.email });

  if (!user)
    return res
      .status(400)
      .send({ success: false, message: "Invalid email or password..." });

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res
      .status(400)
      .send({ success: false, message: "Invalid email or password..." });

  res.send({
    success: true,
    user: _.pick(user, ["_id", "name", "email", "isAdmin"]),
    token: user.generateAuthToken()
  });
});

function validate(req) {
  const schema = {
    email: Joi.string()
      .min(6)
      .max(255)
      .required()
      .email(),
    password: Joi.string()
      .min(6)
      .max(255)
      .required()
  };
  return Joi.validate(req, schema);
}

module.exports = router;
