const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendLoginEmail } = require("../services/emailService");

const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, username: user.username, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );
};

const signup = async (username, email, password, role) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("User already exists");
    
    // Hash password with lower salt rounds
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Save user
    const newUser = new User({ username, email, password: hashedPassword, role });
    await newUser.save();
    return { ...newUser._doc, id: newUser._id, token: generateToken(newUser) };
};

const login = async (email, password) => {
    console.log("🔵 LOGIN STARTED");
    console.time("⏱️ TOTAL_LOGIN_TIME");
    
    // Step 1: Find user
    console.time("1️⃣ Database Query");
    const user = await User.findOne({ email });
    console.timeEnd("1️⃣ Database Query");
    
    if (!user) throw new Error("User not found");
    
    // Step 2: Compare passwords
    console.time("2️⃣ Password Compare");
    const isMatch = await bcrypt.compare(password, user.password);
    console.timeEnd("2️⃣ Password Compare");
    
    if (!isMatch) throw new Error("Invalid credentials");
    
    // Step 3: Send email
    console.time("3️⃣ Send Email");
    try {
        await sendLoginEmail(user.username, email, user.role);
        console.timeEnd("3️⃣ Send Email");
    } catch (emailError) {
        console.timeEnd("3️⃣ Send Email");
        console.error("⚠️ Email send failed:", emailError.message);
        // Don't throw - continue with login even if email fails
    }
    
    // Step 4: Generate token
    console.time("4️⃣ Generate Token");
    const token = generateToken(user);
    console.timeEnd("4️⃣ Generate Token");
    
    console.timeEnd("⏱️ TOTAL_LOGIN_TIME");
    console.log("✅ LOGIN COMPLETED");
    
    return { ...user._doc, id: user._id, token };
};

module.exports = { signup, login };
