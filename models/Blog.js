const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    desc: {
      type: String,
      required: true
    },
    photo: {
      data:Buffer,
      contentType:String
    },
    userEmail: {
      type: String,
      required: true
    },
    categories: {
      type: Array
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);