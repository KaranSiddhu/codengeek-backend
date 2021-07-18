const express = require("express");
const router = express.Router();

const { getPrivateData, updateUser, deleteUser } = require("../controller/userController");
const { protect } = require("../middlewares/auth");

//NOTE Get a user
router.get("/user", protect, getPrivateData);

//NOTE update
router.put("/user/update/:id", protect, updateUser);

//NOTE delete
router.delete("/user/delete/:id", protect, deleteUser);

module.exports = router;
