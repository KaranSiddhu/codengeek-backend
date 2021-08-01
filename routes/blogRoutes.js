const express = require("express");
const router = express.Router();
const {
  createBlog,
  updateBlog,
  deleteBlog,
  getBlog,
  getAllBlog,
  photo
} = require("../controller/blogController");
const { protect } = require("../middlewares/auth");
const uploadImg = require("../middlewares/uploadImg");

//NOTE Create blog
router.post("/blog", uploadImg, createBlog);

//NOTE update blog
router.put("/blog/update/:blogId", protect, updateBlog);

//NOTE delete blog
router.delete("/blog/delete/:blogId", protect, deleteBlog);

//NOTE get a blog
router.get("/blog/:blogId", getBlog);
// router.get("/blog/photo/:blogId",  getBlog);

//NOTE get all blog
router.get("/blogs", getAllBlog);

module.exports = router;
