const { Router } = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Plese select the name!"],
  },
  email: {
    type: String,
    required: [true, "Please Provide Valid email"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "please provide a valid email"],
    minLength: 6,
    select: false,
  },
  confirmpassword: {
    type: String,
    required: [true, "please conform your password"],
    validate: {
      // this work only save
      validator: function (el) {
        return el === this.password;
      },
      message: "password does not same",
    },
  },
  passwordChangedAt: Date,
  passwordResettoken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmpassword = undefined;
  next();
});
// userSchema.pre("save", function next() {
//   if (!this.isModified("password") || this.isNew) return next();
//   this.passwordChangedAt = Date.now() - 1000;
//   next();
// });

userSchema.methods.correctPassword = async function (
  passwordToMatch,
  password
) {
  return await bcrypt.compare(passwordToMatch, password);
};
userSchema.methods.changedPasswordAfter = async function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 7000,
      10
    );
    return JWTTimeStamp > changedTimeStamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  console.log({ resetToken }, this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 7000;
  return resetToken;
};

const User = mongoose.model("datas", userSchema);
module.exports = User;
