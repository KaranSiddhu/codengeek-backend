const express = require("express");
const router = express.Router();

const { getPrivateData } = require("../controller/privateController");
const { protect } = require("../middlewares/auth");

router.get('/private', protect, getPrivateData);

module.exports = router;
