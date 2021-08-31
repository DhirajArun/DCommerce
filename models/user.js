const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlenght: 50,
  },
  email: {
    type: String,
    minlength: 5,
    maxlength: 255,
    unique: true,
    sparse: true,
  },
  phone: {
    type: String,
    match: /[\d]{10}/,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 1024,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  isPhoneVerified: {
    type: Boolean,
    default: false,
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    _.pick(this, ["_id", "name", "email", "phone"]),
    process.env.JWTKEY
  );
  return token;
};

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().max(50).required(),
    email: Joi.string().min(5).max(255).email(),
    phone: Joi.string()
      .max(10)
      .pattern(/[\d]{10}/)
      .required(),
    password: Joi.string().min(6).max(1024).required(),
  });
  return schema.validate(user);
}

const User = mongoose.model("User", userSchema);

exports.User = User;
exports.validateUser = validateUser;
