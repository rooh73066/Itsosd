const express = require("express");
const {
  getsignup,
  signup,
  login,
  getCurrentUser,
  renderProfile,
  logout,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// =========================================================
// AUTH ROUTES
// =========================================================

// POST /api/auth/signup
router.post("/signup", signup);
router.get("/signup", getsignup);
// POST /api/auth/login
router.post("/login", login);
router.post("/logout", authMiddleware, logout);

// GET /api/auth/me
// Protected route
router.get("/me", authMiddleware, getCurrentUser);
router.get("/user/me", authMiddleware, renderProfile);

module.exports = router;
