const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async ({ req }) => {
  if (!req || !req.headers) return { user: null }; // ✅ Ensure req exists

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return { user: null }; // ✅ Validate header

  const token = authHeader.split(" ")[1]; // ✅ Extract token
  if (!token) return { user: null };

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.id) return { user: null };

    const user = await User.findById(decoded.id).select("-password"); // ✅ Exclude password for security
    if (!user) return { user: null };

    console.log("Authenticated User:", user); // 🔍 Debugging
    return { user };
  } catch (err) {
    console.error("Auth Middleware Error:", err.message); // 🔍 Log error
    return { user: null };
  }
};

module.exports = authMiddleware;
