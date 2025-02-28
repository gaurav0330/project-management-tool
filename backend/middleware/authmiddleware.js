const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async ({ req }) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return { user: null };

  const token = authHeader.split(" ")[1]; // Extract token after "Bearer"
  if (!token) return { user: null };

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.id) return { user: null };

    const user = await User.findById(decoded.id);
    if (!user) return { user: null };

    return { user }; // ✅ Return full user object
  } catch (err) {
    console.error("Auth Error:", err.message); // Debugging
    return { user: null };
  }
};

module.exports = authMiddleware;
