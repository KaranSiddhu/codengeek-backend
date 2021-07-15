const express = require("express");
const router = express.Router();

const {
  register,
  login,
  forgotPassword,
  resetpassword,
  verifyEmail,
  signOut,
  loggedIn,
  sendVerifyEmail
} = require("../controller/authController");

router.post("/auth/register", register);

router.post("/auth/login", login);

router.post("/auth/forgotpassword", forgotPassword);

router.put("/auth/resetpassword/:resetToken", resetpassword);

router.post("/auth/email/verify", sendVerifyEmail);

router.get("/auth/email/verify/:verifyEmailToken", verifyEmail);

router.get("/auth/loggedin", loggedIn);

router.get("/auth/signout", signOut);

module.exports = router;
