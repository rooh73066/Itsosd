const User = require("../models/userScema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const isApiRequest = (req) => req.originalUrl.startsWith("/api/");

const publicUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  phone: user.phone,
  address: user.address,
  role: user.role,
  isVerified: user.isVerified,
});

const createAccessToken = (user) =>
  jwt.sign(
    { sub: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

const startUserSession = (req, user) =>
  new Promise((resolve, reject) => {
    req.session.regenerate((error) => {
      if (error) return reject(error);

      req.session.userId = user._id.toString();
      req.session.role = user.role;
      req.session.save((saveError) => {
        if (saveError) return reject(saveError);
        resolve();
      });
    });
  });

const signupError = (req, res, status, message) => {
  if (isApiRequest(req)) {
    return res.status(status).json({ success: false, message });
  }
  return res.status(status).render("user/signup", { errorMessage: message });
};

// =========================================================
// SIGN UP
// =========================================================

const signup = async (req, res) => {
  try {
    const { username, email, password, phone, address } = req.body;

    // Check required fields
    if (
      typeof username !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      typeof phone !== "string" ||
      !username.trim() ||
      !email.trim() ||
      !password ||
      !phone.trim()
    ) {
      return signupError(req, res, 400, "Please fill in all required fields.");
    }

    // Check if email already exists
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return signupError(req, res, 409, "An account with this email already exists.");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      phone: phone.trim(),
      address: address ? address.trim() : "",
    });

    await startUserSession(req, user);

    if (isApiRequest(req)) {
      return res.status(201).json({
        success: true,
        message: "Account created successfully.",
        user: publicUser(user),
        token: createAccessToken(user),
      });
    }
    return res.redirect(303, "/user/me");
  } catch (error) {
    console.error("Signup Error:", error);

    if (error.code === 11000) {
      return signupError(req, res, 409, "An account with this email already exists.");
    }

    if (error.name === "ValidationError") {
      return signupError(req, res, 400, error.message);
    }

    return signupError(req, res, 500, "Something went wrong while creating your account.");
  }
};

// =========================================================
// LOGIN
// =========================================================

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check fields
    if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
      if (!isApiRequest(req)) {
        return res.status(400).render("user/sigin", {
          errorMessage: "Email and password are required.",
        });
      }
      return res.status(400).json({
        success: false,

        message: "Email and password are required.",
      });
    }

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      if (!isApiRequest(req)) {
        return res.status(401).render("user/sigin", {
          errorMessage: "Invalid email or password.",
        });
      }
      return res.status(401).json({
        success: false,

        message: "Invalid email or password.",
      });
    }

    // Check account status
    if (!user.isActive) {
      if (!isApiRequest(req)) {
        return res.status(403).render("user/sigin", {
          errorMessage: "Your account has been deactivated.",
        });
      }
      return res.status(403).json({
        success: false,

        message: "Your account has been deactivated.",
      });
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      if (!isApiRequest(req)) {
        return res.status(401).render("user/sigin", {
          errorMessage: "Invalid email or password.",
        });
      }
      return res.status(401).json({
        success: false,

        message: "Invalid email or password.",
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();
    await startUserSession(req, user);

    if (!isApiRequest(req)) {
      return res.redirect(303, "/user/me");
    }

    // Return user information
    return res.status(200).json({
      success: true,
      message: "Login successful.",
      user: publicUser(user),
      token: createAccessToken(user),
    });
  } catch (error) {
    console.error("Login Error:", error);
    if (!isApiRequest(req)) {
      return res.status(500).render("user/sigin", {
        errorMessage: "Something went wrong while logging in.",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Something went wrong while logging in.",
    });
  }
};

// =========================================================
// GET CURRENT USER
// =========================================================

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
  
    return res.status(200).json({
      success: true,

      user,
    });
  } catch (error) {
    console.error("Get User Error:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to get user information.",
    });
  }
};

const renderProfile = (req, res) => res.render("user/me");

const logout = (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error("Logout Error:", error);
      return res.status(500).send("Unable to log out. Please try again.");
    }
    res.clearCookie("itsosd.sid", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    return res.redirect(303, "/sigin");
  });
};

const getsignup= async(req , res)=>{
  res.render("user/signup")
}
module.exports = {
  getsignup,
  signup,
  login,
  getCurrentUser,
  renderProfile,
  logout,
};
