const otpGenerator = require("otp-generator");

function generate() {
  return otpGenerator.generate(6, {
    alphabets: false,
    upperCase: false,
    specialChars: false,
  });
}

exports.generate = generate;
