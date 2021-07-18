const express = require("express");
const { createCategory, getAllCategory } = require("../controller/categoryController");
const { protect, isAdmin } = require("../middlewares/auth");
const router = express.Router();

//NOTE create category
router.post("/category", protect, isAdmin, createCategory);

//NOTE get all category
router.get("/categories", protect, getAllCategory);

module.exports = router;
