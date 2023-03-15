const User = require("../Model/AuthMuduler");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const express = require("express");
const crypto = require("crypto");
const { ReturnDocument } = require("mongodb");
const multer = require("multer");
const sendEmail = require("./../Email");
const sharp = require("sharp");
const app = express();
// express middleware
app.use(express.json());

const storagemulter = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/image/user"), // cb -> callback
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

// const storagemulter = multer.memoryStorage();

const handleMultipartData = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: storagemulter,
  fileFilter: handleMultipartData,
});

// image middleware
exports.userPhoto = upload.single("photo");

//image resize middware
exports.resizephoto = async (req, res, next) => {
  if (!req.file) return next();
  const filedata = await req.file.filename;
  console.log("__+++++++++", filedata);
  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quaility: 90 })
    .toFile(`public/image/user/${filedata}`);
  next();
};

// default time out
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(" req", req.headers);
  next();
});

const signInToken = (id) => {
  return jwt.sign({ id }, "secret", { expiresIn: "1day" });
};

exports.singUp = async (req, res, next) => {
  try {
    res.status(201).json({
      status: "Success",
      data: {
        user: NewUser,
      },
    });
  } catch (error) {
    res.status(401).json({
      status: "fail",
      message: "email and password are not correct",
      error,
    });
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { password, email } = req.body;
    // if check email and password is exit
    if (!password || !email) {
      res.status(404).json({
        status: "fail",
        message: "please provide email and password",
      });
    }
    //check if user exists && password is correct
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.correctPassword(password, user.password))) {
      res.status(401).json({
        status: "fail",
        message: "email and password are not correct",
      });
    }

    // if every thing ok send token to the client
    const token = signInToken(User._id);
    res.status(200).json({
      createdAt: req.requestTime,
      token,
      status: "Success",
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: "err",
      error,
    });
  }
};

exports.Protect = async (req, res, next) => {
  let tokens;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    tokens = req.headers.authorization.split(" ")[1];
    // console.log("tokens", tokens);
  }
  if (!tokens) {
    return res.status(401).json({
      status: "fail",
      message: "You are not logged in! Please Log in  to give access ",
    });
  }
  // veryfy token
  const decoded = await jwt.verify(tokens, "secret");

  // checck if user still exit

  const FreshUser = await User.findById(decoded.id);
  if (!FreshUser) {
    return res.status(401).json({
      status: "fail",
      message: "User staill not  exit",
    });
  }
  if (FreshUser.passwordChangedAt(decoded.iat)) {
    return res.status(401).json({
      status: "fail",
      message: "User recently changed password",
    });
  }

  next();
};

exports.Forgetpassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(401).json({
      status: "fail",
      message: "No User found",
    });
  }
  const resetToken = user.createPasswordResetToken();
  console.log("resetToken", resetToken);
  await user.save({ validateBeforeSave: false });
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/resetPassword/${resetToken}`;

  const message = `Forgot your Password? Submit your new password and confirm your password at ${resetURL}.\n If you didn't forgot your password, please ignore this email.`;
  try {
    await sendEmail({
      email: user.email,
      subject: "your password reset token(valid for 10 mint)",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token send to email",
    });
  } catch (error) {
    user.passwordResetExpires = undefined;
    user.passwordResettoken = undefined;
    await user.save({ validateBeforeSave: false });
    return res.status(500).json({
      status: "fail",
      message: "There was a error sending the email",
    });
  }

  const resettoken = await user;
  next();
};
exports.Resetpassword = async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResettoken: hashedToken,
    passwordResetExpires: Date.now() / 1000 + 60 * 2,
  });
  if (!user) {
    res.status(400).json({
      status: "fail",
      message: "Token Has Invalid expired",
    });
  }
  user.password = req.body.password;
  user.confirmpassword = req.body.confirmpassword;
  user.passwordResettoken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  const token = signInToken(user._id);
  res.status(200).json({
    createdAt: req.requestTime,
    token,
    status: "Success",
  });
  next();
};

exports.updatedPassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.User.id).select("+password");

    if (
      !(await user.correctPassword(req.body.confirmpassword, user.password))
    ) {
      return res.status(401).json({
        status: "fail",
        message: "Your current password are wrong",
      });
    }
    user.password = req.body.password;
    user.confirmpassword = req.body.confirmpassword;
    await user.save();
    const token = signInToken(user._id);
    return res.status(200).json({
      status: "Success",
      token,
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
  next();
};

exports.putphoto = async (req, res, next) => {
  const image = await req.files;
  console.log("___", req.files);
  try {
    res.status(201).json({
      status: "Success file uploaded",
      data: {
        image,
      },
    });
  } catch (error) {
    res.status(401).json({
      status: "fail",
      message: "something went wrong",
    });
  }
};
