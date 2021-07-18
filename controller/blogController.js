const Blog = require("../models/Blog");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

exports.createBlog = async (req, res) => {
  console.log("USER WHO IS CREATING POST", req.user);

  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  // try {
  //   const blog = await Blog.create(req.body);
  //   res.status(200).json({
  //     success: true,
  //     blog,
  //     message: "Successfully created a blog"
  //   });
  // } catch (error) {
  //   res.status(500).json({
  //     success: false,
  //     error:error.message
  //   });
  // }

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: "Problem with image",
        err
      });
    }

    const { title, desc, userEmail } = fields;

    if (!title || !desc || !userEmail) {
      return res.status(400).json({
        success: false,
        message: "Please includes all the fields"
      });
    }

    let blog = new Blog(fields);

    //NOTE handle file ( image )
    if (file.photo) {
      //* file size should not be greater than 3 mb
      if (file.photo.size > 3 * 1024 * 1024) {
        return res.status(400).json({
          success: false,
          messsage: "File size to big"
        });
      }

      blog.photo.data = fs.readFileSync(file.photo.path);
      blog.photo.contentType = file.photo.type;
    }

    console.log("FIELDs - ", fields);
    console.log("FILE 🥂- ", file);

    //NOTE save to DB
    blog.save((error, savedBlog) => {
      if (error) {
        return res.status(400).json({
          success: false,
          message: "saving the picture failed",
          error
        });
      }

      res.status(200).json({
        success: true,
        blog: savedBlog
      });
    });
  });
};

exports.updateBlog = async (req, res) => {
  const blogId = req.params.blogId;
  console.log("UPDATING THE BLOG");
  // let form = new formidable.IncomingForm();
  // form.keepExtensions = true;

  // form.parse(req, async (err, fields, file) => {
  //   if (err) {
  //     return res.status(400).json({
  //       success: false,
  //       message: "Problem with image",
  //       err
  //     });
  //   }

  //   //NOTE updating blog
  //   try {
  //     let blog = await Blog.findById(blogId);

  //     if (blog.userEmail === req.body.userEmail) {
  //       blog = _.extend(blog, fields);

  //       //NOTE Handle File
  //       if (file.photo) {
  //         //NOTE file size should not be greater than 3 mb
  //         if (file.photo.size > 3 * 1024 * 1024) {
  //           return res.status(400).json({
  //             success: false,
  //             messsage: "File size to big"
  //           });
  //         }

  //         blog.photo.data = fs.readFileSync(file.photo.path);
  //         blog.photo.contentType = file.photo.type;
  //       }

  //       //NOTE Save To DB
  //       blog.save((error, savedBlog) => {
  //         if (error) {
  //           return res.status(400).json({
  //             success: false,
  //             message: "updation of blog failed",
  //             error
  //           });
  //         }

  //         res.status(200).json({
  //           success: true,
  //           blog: savedBlog
  //         });
  //       });
  //     } else {
  //       res.status(400).json({
  //         success: false,
  //         message: "You are not authorized to edit this blog."
  //       });
  //     }
  //   } catch (error) {
  //     res.status(400).json({
  //       success: false,
  //       error
  //     });
  //   }
  // });

  try {
    const blog = await Blog.findById(blogId);

    if (blog.userEmail === req.body.userEmail) {
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

    if (blog.userEmail === req.body.userEmail) {
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
    const blog = await Blog.findById(blogId);
 
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

exports.photo = async (req, res, next) => {
  const blogId = req.params.blogId;
  try {
    const blog = await Blog.findById(blogId);
    if(blog.photo.data){
      res.set("Content-Type", blog.photo.contentType);
      return res.send(blog.photo.data);
    }
    next();
  } catch (error) {
    res.status(404).json({
      success: false,
      error
    });
  }
}

exports.getAllBlog = async (req, res) => {
  const userEmail = req.query.user;
  const category = req.query.cat;

  try {
    let blogs;
    if (userEmail) {
      blogs = await Blog.find({ userEmail });
    } else if (category) {
      blogs = await Blog.find({
        categories: {
          $in: [category]
        }
      });
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
      error
    });
  }
};
