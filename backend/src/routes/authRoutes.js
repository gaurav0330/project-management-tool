const express = require("express");
const { registerUser, loginUser, getUserProfile } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// User Signup
router.post("/signup", registerUser);

// User Login
router.post("/login", loginUser);

// Get User Profile (Protected Route)
router.get("/profile", authMiddleware, getUserProfile);

module.exports = router;
