const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
};

const signup = async (username, email, password, role) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("User already exists");

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Save user
    const newUser = new User({ username, email, password: hashedPassword, role });
    await newUser.save();

    return { ...newUser._doc, id: newUser._id, token: generateToken(newUser) };
};

const login = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    return { ...user._doc, id: user._id, token: generateToken(user) };
};

module.exports = { signup, login };
