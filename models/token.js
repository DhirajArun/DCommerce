const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  userId: {
    userId: Schema.Types.ObjectId,
    required: true,
    ref: "users",
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: 3600, // time in second
  },
});

exports.Token = mongoose.model("Token", schema);
