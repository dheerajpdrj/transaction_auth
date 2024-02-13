const express = require("express");
const {
  signupController,
  loginController,
  changePassword,
} = require("../controllers/authController");
const { authenticateToken } = require("../utils/authMiddleware");

const router = express.Router();

router.post("/signup", signupController);
router.post("/login", loginController);
router.put("/change-password", authenticateToken, changePassword);

module.exports = router;
