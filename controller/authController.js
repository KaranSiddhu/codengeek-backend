const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const user = await User.create(req.body);

    sendToken(user, 201, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Email already exists",
      error: error.message
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({
      success: false,
      error: "The email and password field is required"
    });
  }

  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      res.status(404).json({
        success: false,
        error: "User not found"
      });
    }

    const isMatch = await user.matchPasswords(password);

    if (!isMatch) {
      res.status(404).json({
        success: false,
        error: "Invalid scredentials"
      });
    }

    sendToken(user, 200, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Please enter correct email and password"
    });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "User not found"
      });
    }

    const resetToken = user.getResetPasswordToken();

    await user.save();

    const resetUrl = `https://www.codengeek.tech/passwordreset/${resetToken}`;

    const message = `
        <h1>You have requested a password reset</h1>
        <p>Please use the following link to change your password. (the link will expire in 10 minutes) :</p>
        <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
      `;

    try {
      sendEmail({
        to: user.email,
        subject: "Password Reset Request",
        text: message
      });

      res.status(200).json({ success: true, data: "Email Sent successfully" });
    } catch (err) {
      console.log(err);

      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();

      return res.status(500).json({
        success: false,
        error: "Something went wrong"
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Something went wrong"
    });
  }
};

exports.resetpassword = async (req, res) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: "Invalid reset token"
      });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Something went wrong"
    });
  }
};

exports.sendVerifyEmail = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  const emailVerifyToken = user.getEmailVerifyToken();

  await user.save();

  const verifyUrl = `https://www.codengeek.tech/email/verify/${emailVerifyToken}`;

  const message = `
            <h1>Please use the following link to Verify your email. (the link will expire in 10 minutes) :</h1>
            <a href=${verifyUrl} clicktracking=off>${verifyUrl}</a>
          `;

  try {
    sendEmail({
      to: user.email,
      subject: "Verify Your Email",
      text: message
    });

    res.status(200).json({ success: true, message: "Email Sent successfully" });
  } catch (err) {
    console.log("ERROR - ", err);

    user.emailVerifyToken = undefined;
    user.emailVerifyTokenExpire = undefined;

    await user.save();
    return res.status(500).json({
      success: false,
      message: "Something went wrong could not send email. Please try again later",
      error: err
    });
  }
};

exports.verifyEmail = async (req, res) => {
  const emailVerifyToken = crypto
    .createHash("sha256")
    .update(req.params.verifyEmailToken)
    .digest("hex");

  try {
    const user = await User.findOne({
      emailVerifyToken,
      emailVerifyTokenExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: "Invalid token"
      });
    }
    user.isEmailVerified = true;
    user.emailVerifyToken = undefined;
    user.emailVerifyTokenExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Email verified successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error
    });
  }
};

exports.signOut = (req, res) => {
  // res
  // .cookie("token", "", {
  //   httpOnly: true,
  //   expires: new Date(0),
  //   secure: true,
  //   sameSite: "none",
  // })
  // .send();

  res.clearCookie("token");
  res.status(200).json({
    status: "success",
    message: "Sign Out Successfully"
  });
};

exports.loggedIn = (req, res) => {
  try {
    let token = req.cookies.token;

    if (!token) {
      return res.json(false);
    }

    jwt.verify(token, process.env.JWT_KEY);
    res.send(true);
  } catch (err) {
    console.log("ERROR - ",err);
    res.json(false);
  }
};

const sendToken = (user, statusCode, res) => {
  const token = user.getSignedToken();
  res
    .status(statusCode)
    .cookie("token", token, { httpOnly: true, samesite: "none", secure: true })
    .send("Cookie Send");
  
  // res.status(statusCode).json({
  //   success: true,
  //   token,
  //   user
  // });
};
