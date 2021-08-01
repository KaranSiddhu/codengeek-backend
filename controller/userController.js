const User = require("../models/User");
const Blog = require("../models/Blog");

exports.getPrivateData = (req, res) => {

  res.status(200).json({
    success: true,
    user: req.user
  });

  console.log(req.user);
};

exports.updateUser = async (req, res) => {
  const userId = req.params.id;

  const { fullName, email, password } = req.body; 

  try {
    
    const user = await User.findById( userId ).select("+password");
    
    if (!user) {
      res.status(404).json({
        success: false,
        error: "User not found"
      });
    }

    user.email = email;
    user.isEmailVerified = false;
    user.fullName = fullName;
    user.password = password;

    await user.save();

    //NOTE i cant use findByIdAndUpdate because i am hashing my passwords in a pre and pre does not get run/hash password by using this updates mongoose methods  
    // const updateUser = await User.findByIdAndUpdate(
    //   userId,
    //   {
    //     $set: req.body
    //   },
    //   { new: true, runValidators: true }
    // );

    res.status(200).json({
      success: true,
      user: user
    });

  } catch (err) {
    res.status(404).json({
      success: false,
      error: err,
      message:"Something wet wrong"
    });
  }
};


exports.deleteUser = async (req, res) => {
  const userId = req.params.id;

  try{
    const user =  await User.findById(userId);
    try {
      
      await Blog.deleteMany({ userEmail: user.email });
      await User.findByIdAndDelete(userId);

      res
      .cookie("token", "", {
        httpOnly: true,
        sameSite:
          process.env.NODE_ENV === "development"
            ? "lax"
            : process.env.NODE_ENV === "production" && "none",
        secure:
          process.env.NODE_ENV === "development"
            ? false
            : process.env.NODE_ENV === "production" && true,
        expires: new Date(0),
      })
      
      res.status(200).json({
        success:true,
        message:"Successfully deleted your account"
      });

    } catch (err) {
      res.status(500).json({
        success: false,
        error
      });
    }
  

  }catch(error){
    res.status(404).json({
      success: false,
      error
    });
  }

}