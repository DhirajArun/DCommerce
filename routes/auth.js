const express = require("express");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const _ = require("lodash");
const { User } = require("../models/user");

const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(_.pick(req.body, ["email", "password", "phone"]));
  if (error) return res.status(400).send(error.details[0].message);

  let user;
  if (req.body.email) {
    user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("username or password is incorrect");
    if (!user.isEmailVerified) res.status(401).send("email is not verified");
  } else {
    user = await User.findOne({ phone: req.body.phone });
    if (!user) return res.status(400).send("username or password is incorrect");
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).send("username or password is incorrect");

  const token = user.generateAuthToken();
  res.send(token);
});

function validate(data) {
  const schema = Joi.object({
    phone: Joi.string()
      .max(10)
      .pattern(/[\d]{10}/),
    email: Joi.string().min(5).max(255).email(),
    password: Joi.string().min(6).max(255).required(),
  }).xor("phone", "email");
  return schema.validate(data);
}

module.exports = router;
