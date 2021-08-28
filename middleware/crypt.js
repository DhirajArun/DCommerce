const crypto = require("crypto");

const iv = crypto.randomBytes(16);
const pwd = "12345678123456781234567812345678";
const algo = "aes-256-cbc";

function encode(string) {
  let cipher = crypto.createCipheriv(algo, pwd, iv);
  let encrypted = cipher.update(string, "utf-8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

function decode(encrypted) {
  let decipher = crypto.createDecipheriv(algo, pwd, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf-8");
  decrypted += decipher.final("utf-8");
  return decrypted;
}

module.exports = { encode, decode };
