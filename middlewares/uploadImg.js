const multer = require("multer");

const multerStorage = multer.diskStorage({});
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "images");
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
    
//     cb(null, `BlogImg-${Date.now()}.${ext}`);
//     // cb(null, req.body.name);
//   }
// });

const multerFilter = (req, file, cb) => {
  if (
    file.mimetype == "image/png" ||
    file.mimetype == "image/jpg" ||
    file.mimetype == "image/jpeg"
  ) {
    cb(null, true);
  } else {
    console.log(122);
    return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    //   return cb();
  }
};

const upload = multer({
  storage: multerStorage,
  limits: { fileSize: 1024*1024 },
  fileFilter: multerFilter
}).single("photo");

function uploadImg(req, res, next) {
  upload(req, res, function (err) {
    req.uploadError = err;
    next();
  });
}

module.exports = uploadImg;
