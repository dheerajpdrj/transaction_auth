const express = require("express");
const { addNumbers } = require("../controllers/transactionController");
const { authenticateToken } = require("../utils/authMiddleware");

const router = express.Router();

router.post("/add", authenticateToken, addNumbers);

module.exports = router;
