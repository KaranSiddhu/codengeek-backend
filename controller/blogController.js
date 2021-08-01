const Blog = require("../models/Blog");
const User = require("../models/User");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const multer = require("multer");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const cloudinary = require("../utils/cloudinary");

exports.createBlog = async (req, res) => {
  if (req.uploadError) {
    return res.status(406).json({
      success: false,
      message: "file size should be under 1mb and it can only be of type .png, .jpg, .jpeg",
      error: req.uploadError
    });
  }

  try {
    // const blog = await Blog.create(req.body);
    const blog = new Blog(req.body);
    const result = await cloudinary.uploader.upload(req.file.path);

    blog.photo = result.secure_url;

    blog.cloudinary_id = result.public_id;

    await blog.save();

    res.status(200).json({
      success: true,
      blog,
      message: "Successfully created a blog"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

//NOTE This is create blog using formidible
// exports.createBlog = async (req, res) => {
//   console.log("USER WHO IS CREATING POST", req.user);

//   let form = new formidable.IncomingForm();
//   form.keepExtensions = true;

//   // try {
//   //   const blog = await Blog.create(req.body);
//   //   res.status(200).json({
//   //     success: true,
//   //     blog,
//   //     message: "Successfully created a blog"
//   //   });
//   // } catch (error) {
//   //   res.status(500).json({
//   //     success: false,
//   //     error:error.message
//   //   });
//   // }

//   form.parse(req,(err, fields, file) => {
//     if (err) {
//       return res.status(400).json({
//         success: false,
//         message: "Problem with image",
//         err
//       });
//     }

//     const { title, desc, userEmail, user } = fields;

//     if (!title || !desc || !userEmail) {
//       return res.status(400).json({
//         success: false,
//         message: "Please includes all the fields"
//       });
//     }

//     let blog = new Blog(fields);

//     //NOTE handle file ( image )
//     if (file.photo) {
//       //* file size should not be greater than 3 mb
//       if (file.photo.size > 3 * 1024 * 1024) {
//         return res.status(400).json({
//           success: false,
//           messsage: "File size to big"
//         });
//       }

//       blog.photo.data = fs.readFileSync(file.photo.path);
//       blog.photo.contentType = file.photo.type;
//     }

//     // console.log("FIELDs - ", fields);
//     // console.log("FILE 🥂- ", file);

//     //NOTE save to DB
//     blog.save( async (error, savedBlog) => {
//       if (error) {
//         return res.status(400).json({
//           success: false,
//           message: "saving the picture failed",
//           error
//         });
//       }

//       //NOTE Saving this blog to his rightfull owner
//       try {

//         // console.log("USER  ", user);
//         let user1 = await User.findById(user).select("+password");
//         user1.blogs = blog._id
//         await user1.save();

//       } catch (error1) {
//         console.log("POPULATE USER fail", error1);
//       }

//       res.status(200).json({
//         success: true,
//         blog: savedBlog
//       });
//     });
//   });

// };

exports.updateBlog = async (req, res) => {
  const blogId = req.params.blogId;

  // try {
  //   const updateBlog = await Blog.findByIdAndUpdate(
  //     blogId,
  //     {
  //       $set: req.body
  //     },
  //     { new: true }
  //   );

  //   res.status(200).json({
  //     success: true,
  //     updateBlog
  //   });
  // } catch (error) {
  //   res.status(401).json({
  //     success: false,
  //     error
  //   });
  // }

  try {
    const blog = await Blog.findById(blogId);
    // console.log("BLOG USER - ", blog.user)
    // console.log("BLOG USER type - ", ( typeof (""+blog.user)))
    // console.log("req USER - ", req.user._id);
    // console.log("req USER type - ", ( typeof (""+req.user._id)))
    if ("" + blog.user === "" + req.user._id) {
      try {
        const updateBlog = await Blog.findByIdAndUpdate(
          blogId,
          {
            $set: req.body
          },
          { new: true }
        );

        res.status(200).json({
          success: true,
          updateBlog
        });
      } catch (error) {
        res.status(404).json({
          success: false,
          error
        });
      }
    } else {
      res.status(400).json({
        success: false,
        message: "You are not authorized to edit this blog."
      });
    }
  } catch (error) {
    res.status(401).json({
      success: false,
      error
    });
  }
};

exports.deleteBlog = async (req, res) => {
  const blogId = req.params.blogId;

  try {
    const blog = await Blog.findById(blogId);

    //NOTE Deleting images from cloudinary 
    await cloudinary.uploader.destroy(blog.cloudinary_id);

    //NOTE Deleting images locally
    // fs.unlink(`images/${blog.photo}`, (err) => {
    //   if (err) console.log("ERROR IN DELETING IMG", err);
    //   console.log("DELETED pic ");
    // });

    if ("" + blog.user === "" + req.user._id) {
      try {
        await blog.delete();
        res.status(200).json({
          success: true,
          message: "Blog deleted successfully."
        });
      } catch (error) {
        res.status(404).json({
          success: false,
          error
        });
      }
    } else {
      res.status(400).json({
        success: false,
        message: "You are not authorized to delete this blog."
      });
    }
  } catch (error) {
    res.status(401).json({
      success: false,
      error
    });
  }
};

exports.getBlog = async (req, res) => {
  const blogId = req.params.blogId;
  try {
    const blog = await Blog.findById(blogId).populate("user", "_id fullName email");

    res.status(200).json({
      success: true,
      blog
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error
    });
  }
};

// exports.photo = async (req, res, next) => {
//   const blogId = req.params.blogId;
//   try {
//     const blog = await Blog.findById(blogId);
//     if (blog.photo.data) {
//       res.set("Content-Type", blog.photo.contentType);
//       return res.send(blog.photo.data);
//     }
//     next();
//   } catch (error) {
//     res.status(404).json({
//       success: false,
//       error
//     });
//   }
// };

exports.getAllBlog = async (req, res) => {
  const userId = req.query.user;
  // const category = req.query.cat;
  try {
    let blogs;
    if (userId) {
      blogs = await Blog.find({ user: userId });
    } else {
      blogs = await Blog.find();
    }

    res.status(200).json({
      success: true,
      blogs
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message
    });
  }
};
