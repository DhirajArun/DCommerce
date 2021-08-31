const Joi = require("joi");
const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  otp: {
    type: String,
    required: true,
  },
  expireAt: {
    type: Date,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 10 * 60,
  },
});

function validateOtp(data) {
  const schema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    type: Joi.string().valid("verify", "reset", "login").required(),
  });
  return schema.validate(data);
}

function validateOtpVerification(data) {
  const schema = Joi.object({
    otp: Joi.number().integer().required(),
    key: Joi.string().required(),
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
  });
  return schema.validate(data);
}

const Model = mongoose.model("otps", otpSchema);

exports.OTP = Model;
exports.validateOtp = validateOtp;
exports.validateOtpVerification = validateOtpVerification;
