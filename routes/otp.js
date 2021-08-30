const { OTP } = require("../models/otp");
const jwt = require("jsonwebtoken");
const moment = require("moment");

const { sendOTP } = require("../functions/nodemailer");
const { generate } = require("../functions/otp");

const router = require("express").Router();

function addMinutesToDate(date, minute) {
  return new Date(date.getTime() + minute * 60000);
}

router.post("/", async (req, res, next) => {
  const { email } = req.body;
  if (!email) return res.status(400).send("no email provided");

  //generate otp
  const otp = generate();

  //putting otp in database
  const time = new Date();
  const otpValidity = 10; // in minute
  const expireAt = addMinutesToDate(time, otpValidity);
  const otpDoc = new OTP({ otp, expireAt });
  await otpDoc.save();

  //creating encrypted details to send
  const otpDetails = {
    otpId: otpDoc._id,
    email,
  };

  const encoded = jwt.sign(otpDetails, process.env["JWT_KEY"]);

  //sending the mail
  try {
    const result = await sendOTP({ otp, to: "msvinitakri@gmail.com" });
    res.send({ status: "success", details: encoded, result });
  } catch (error) {
    res.status(500).send({ status: "failure", error });
  }
});

router.post("/verify/", async (req, res, next) => {
  const { otp, key, email } = req.body;

  if (!otp) return res.status(400).send("otp not provided");
  if (!key) return res.status(400).send("key not provided");
  if (!email) return res.status(400).send("email not provided");

  let otpDetails;
  try {
    otpDetails = jwt.verify(key, process.env["JWT_KEY"]);
  } catch (err) {
    res.status(400).details("wrong key provided");
  }

  //email checking
  if (!otpDetails.email == email)
    return res.status(400).send("wrong email provided");

  //otp validity and otp checking
  try {
    const otpDoc = await OTP.find({ _id: otpDetails.otpId });

    //isValid
    const isValid = moment().isBefore(moment(otpDoc.expireAt));
    if (!isValid) return res.status(400).send("otp expired");

    //isCorectOtp
    if (otpDoc.otp !== otp) return res.status(400).send("wrong otp provided");
  } catch (err) {
    return res.status(400).send("wrong key provided");
  }

  await OTP.updateOne(
    { _id: otpDetails.otpId },
    { $set: { isVerified: true } }
  );
  res.send({ status: "success" });
});

module.exports = router;
