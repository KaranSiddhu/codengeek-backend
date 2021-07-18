const Category = require("../models/Category")

exports.createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);

    res.status(200).json({
      success:true,
      category
    });

  } catch (error) {
    res.status(404).json({
      success:false,
      error
    });
  }
}

exports.getAllCategory = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({
      success:true,
      categories
    });
  } catch (error) {
    res.status(404).json({
      success:false,
      error
    });
  }
}