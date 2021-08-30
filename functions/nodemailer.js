const nodemailer = require("nodemailer");
const { google } = require("googleapis");

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

let accessToken;
async function getTransporter() {
  if (!accessToken) accessToken = await oAuth2Client.getAccessToken();

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
  return transporter;
}

let transporter;
async function sendOTP({ otp, to }) {
  if (!transporter) transporter = await getTransporter();

  const mailOption = {
    from: '"Dhiraj Arun" "<dhrjarun@gmail.com>"',
    to,
    subject: "OTP",
    text: `your otp is ${otp}.`,
  };

  const result = await transporter.sendMail(mailOption);
  return result;
}

exports.getTransporter = getTransporter;
exports.sendOTP = sendOTP;
