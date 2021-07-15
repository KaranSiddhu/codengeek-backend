const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  let token = req.cookies.token;
  console.log("TOKEN - ", token);
  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Not authorized to access the route"
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "No user found with this id"
      });
    }
    console.log("U got access to private data");
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: "Not authorized to access this route"
    });
  }
};

// exports.emailVerify = async (req, res, next) => {
//   const { email } = req.body;

//   try {
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         error: "User not found"
//       });
//     }

//   } catch (error) {}
// };
