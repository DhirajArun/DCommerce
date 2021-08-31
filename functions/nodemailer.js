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
async function sendOTP({ otp, to, type }) {
  if (!transporter) transporter = await getTransporter();

  const mailOption = {
    from: '"Dhiraj Arun" "<dhrjarun@gmail.com>"',
    to,
    subject: genrateSubject(type),
    text: genrateMessage(otp, type),
  };

  const result = await transporter.sendMail(mailOption);
  return result;
}

function genrateMessage(otp, type) {
  if (type === "verify") {
    return `Dear user,\nOTP for your email verification is: \n${otp}\n\nThis is auto generated email. please do not reply.\n\nRegards\nDhiraj Arun\n`;
  }
  if (type === "reset") {
    return `Dear user,\nOTP for reset password is: \n${otp}\n\nThis is auto generated email. please do not reply.\n\nRegards\nDhiraj Arun\n`;
  }
  if (type === "login") {
    return `Dear user,\nOTP for login is: \n${otp}\n\nThis is auto generated email. please do not reply.\n\nRegards\nDhiraj Arun\n`;
  }
}

function genrateSubject(type) {
  if (type === "verify") {
    return "OTP for Verification";
  }
  if (type === "reset") {
    return "OTP for resetting password";
  }
  if (type === "login") {
    return "OTP for login";
  }
}

exports.getTransporter = getTransporter;
exports.sendOTP = sendOTP;
