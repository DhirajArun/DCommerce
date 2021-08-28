const { OTP } = require("../models/otp");
const otpGenerator = require("otp-generator");

const router = require("express").Router();

function addMinutesToDate(date, minute) {
  return newDate(date.getTime() + minute * 60000);
}

router.post("/", (req, res, next) => {
  const otp = otpGenerator.generate(6, {
    upperCase: false,
    specialChars: false,
  });

  const time = new Date();
  const otpValidity = 10; // in minute
  const expireAt = addMinutesToDate(time, otpValidity);

  const otp = new OTP({ otp, expireAt });
  await otp.save();

  const otpDetails = {
    timeStamp: time,
    otpId: otp._id,
  };
});

module.exports = router;
