const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      maxLength: 50,
      minLength: 4,
    },
    lastName: {
      type: String,
      maxLength: 50,
      minLength: 4,
    },
    emailId: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("invalid email address" + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("ENTER A STRONG PASSWORD");
        }
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "DEV@TINDER", {
    expiresIn: "1hr",
  });
  return token;
};
userSchema.methods.validatePassword = async function (password) {
  const userPassword = this.password;
  const cmp = await bcrypt.compare(password, userPassword);
  return cmp;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
