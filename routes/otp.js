const { OTP } = require("../models/otp");
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const moment = require("moment");

const clientId =
  "674763652682-5hlm5jo8cglvusp5vrnjrlbmodm2e143.apps.googleusercontent.com";
const clientSecret = "w26gINkDY6_D3jdujlJ8HzOu";
const redirectUri = "https://developers.google.com/oauthplayground";
const refreshToken =
  "1//04GDqBni2Ut8fCgYIARAAGAQSNwF-L9IrQ8nXzsdKiZMEN_NylXwpZRneUN7WIh6NZb7eln560nD6m1H-yffgOMOCUTxLoonoQTs";

const oAuth2Client = new google.auth.OAuth2(
  clientId,
  clientSecret,
  redirectUri
);

oAuth2Client.setCredentials({ refresh_token: refreshToken });

const router = require("express").Router();

function addMinutesToDate(date, minute) {
  return new Date(date.getTime() + minute * 60000);
}

router.post("/", async (req, res, next) => {
  const { email } = req.body;
  if (!email) return res.status(400).send("no email provided");

  //generate otp
  const otp = otpGenerator.generate(6, {
    alphabets: false,
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
    otpId: otpDoc._id,
    email,
  };

  const encoded = jwt.sign(otpDetails, process.env["JWT_KEY"]);

  //sending the mail

  try {
    const accessToken = await oAuth2Client.getAccessToken();

    let transporter = nodemailer.createTransport({
      service: "gmail",
      secure: false,
      auth: {
        user: "dhrjarun@gmail.com",
        type: "oAuth2",
        clientId,
        clientSecret,
        refreshToken,
        accessToken,
      },
    });

    const mailOption = {
      from: '"Dhiraj Arun" "<dhrjarun@gmail.com>"',
      to: email,
      subject: "OTP",
      text: `your otp is ${otp}.`,
    };

    const result = await transporter.sendMail(mailOption);
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
    console.log(otpDetails);
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

  res.send({ status: "success" });
});

module.exports = router;
