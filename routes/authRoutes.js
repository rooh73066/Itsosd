const express = require("express");

const {
signup,
login,
getCurrentUser
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// =========================================================
// AUTH ROUTES
// =========================================================

// POST /api/auth/signup
router.post("/signup", signup);

// POST /api/auth/login
router.post("/login", login);

// GET /api/auth/me
// Protected route
router.get("/me", authMiddleware, getCurrentUser);

module.exports = router;
