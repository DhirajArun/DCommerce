const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { Token } = require("../models/token");
const { User } = require("../models/user");
const config = require("config");

async function getPasswordResetLink(email) {
  const user = await User.findOne({ email });
  if (!user) throw new Error("No such user exists");

  const token = await Token.findOne({ userId: user._id });
  if (token) await token.deleteOne();

  const resetToken = crypto.randomBytes(32).toString("hex");
  const hash = await bcrypt.hash(resetToken, 10);

  await new Token({ userId: user._id, token: hash }).save();

  const link = `${config.get(
    "host"
  )}/api/users/passwordReset?token=${resetToken}&id=${user._id}`;
  return link;
}

async function resetPassword(userId, token, password) {
  if (!token) throw new Error("no reset token provide");
  if (!userId) throw new Error("no userID provided");

  const tokenDoc = await Token.findOne({ userId });
  if (!tokenDoc) throw new Error("no token correspond with this user");

  const isValid = await bcrypt.compare(token, tokenDoc.token);
  if (!isValid) {
    throw new Error("invalid or expired token provided");
  }

  const hashed = await bcrypt.hash(password, 10);

  await User.updateOne(
    { _id: userId },
    { $set: { password: hashed } },
    { new: true }
  );

  await tokenDoc.deleteOne();

  return true;
}

exports.getPasswordResetLink = getPasswordResetLink;
exports.resetPassword = resetPassword;
