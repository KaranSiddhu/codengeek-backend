const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

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
      // data: Buffer,
      // contentType: String
      type: String,
    },
    // userEmail: {
    //   type: String,
    //   required: true
    // },
    categories: {
      type: Array
    },

    user: {
      type: ObjectId,
      ref: "User",
      required:true
    },
    cloudinary_id: {
      type: String,
    }

  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
