const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authorization = req.get("authorization");

  if (authorization) {
    const [scheme, token] = authorization.split(" ");
    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format.",
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = {
        id: decoded.sub,
        role: decoded.role,
      };
      return next();
    } catch (error) {
      console.error("JWT Authentication Error:", error.message);
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token.",
      });
    }
  }

  if (!req.session || !req.session.userId) {
    if (req.originalUrl.startsWith("/api/") || req.path === "/me") {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }
    return res.redirect("/sigin");
  }

  req.user = {
    id: req.session.userId,
    role: req.session.role,
  };
  return next();
};

module.exports = authMiddleware;
