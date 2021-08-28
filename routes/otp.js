const { OTP } = require("../models/otp");
const otpGenerator = require("otp-generator");
const { encode } = require("../middleware/crypt");

const router = require("express").Router();

function addMinutesToDate(date, minute) {
  return new Date(date.getTime() + minute * 60000);
}

router.post("/", async (req, res, next) => {
  const { email } = req.body;
  if (!email) return res.status(400).send("no email provided");

  //generate otp
  const otp = otpGenerator.generate(6, {
    upperCase: false,
    specialChars: false,
  });

  //putting otp in database
  const time = new Date();
  const otpValidity = 10; // in minute
  const expireAt = addMinutesToDate(time, otpValidity);
  const otpDoc = new OTP({ otp, expireAt });
  await otpDoc.save();

  //creating encrypted details to send
  const otpDetails = {
    timeStamp: time,
    otpId: otp._id,
    email,
  };
  const encoded = encode(JSON.stringify(otpDetails));

  res.send({ status: "success", details: encoded });
});

module.exports = router;
