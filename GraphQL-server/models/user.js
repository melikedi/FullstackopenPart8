const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
    },
    passwordHash: String,
    favoriteGenre: String,
  },
  { collection: "users" }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
