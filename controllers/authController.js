const User = require("../models/User");
const bcrypt = require("bcrypt");

// =========================================================
// SIGN UP
// =========================================================

const signup = async (req, res) => {
  try {
    const { username, email, password, phone, address } = req.body;

    // Check required fields
    if (!username || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields.",
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
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

    // Don't send password to client
    const userResponse = {
      id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role,
      isVerified: user.isVerified,
    };

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      user: userResponse,
    });
  } catch (error) {
    console.error("Signup Error:", error);

    return res.status(500).json({
      success: false,

      message: "Something went wrong while creating your account.",
    });
  }
};

// =========================================================
// LOGIN
// =========================================================

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check fields
    if (!email || !password) {
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
      return res.status(401).json({
        success: false,

        message: "Invalid email or password.",
      });
    }

    // Check account status
    if (!user.isActive) {
      return res.status(403).json({
        success: false,

        message: "Your account has been deactivated.",
      });
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,

        message: "Invalid email or password.",
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();
    // Return user information
    return res.status(200).json({
      success: true,
      message: "Login successful.",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
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
const getsignup= async(req , res)=>{
  res.render("user/signup")
}
module.exports = {
  getsignup,
  signup,
  login,
  getCurrentUser,
};
