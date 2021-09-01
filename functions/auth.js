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

  const link = `${config.get("host")}/passwordReset?token=${resetToken}&id=${
    user._id
  }`;
  return link;
}

exports.getPasswordResetLink = getPasswordResetLink;
