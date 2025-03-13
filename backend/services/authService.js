const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendLoginEmail } = require("../services/emailService");
const axios = require("axios");

const generateToken = (user) => {
    return jwt.sign(

        { id: user.id,  username: user.username, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
};

const verifyEmail = async (email) => {
    const apiKey = process.env.MAILEROO_API_KEY;
  
    try {
      const response = await axios.post(
        "https://verify.maileroo.net/check",
        {
          api_key: apiKey,
          email_address: email,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      const { success, data } = response.data || {};
  
      if (!success || !data) throw new Error("Invalid response from Maileroo API");
  
      // Check for valid format, MX record, and non-disposable email
      if (!data.format_valid || !data.mx_found || data.disposable) {
        throw new Error("Invalid or temporary email");
      }
  
      return true; // Email is valid
    } catch (error) {
      console.error("Maileroo API Error:", error.message || error);
      throw new Error("Email verification failed");
    }
  };
  

const signup = async (username, email, password, role) => {

     await verifyEmail(email);

    if (!emailVerificationResponse.data.mx_found || emailVerificationResponse.data.disposable) {
      throw new Error("Invalid or temporary email. Please use a valid email.");
    }
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

     // Send a login email notification
     await sendLoginEmail(user.username, email, user.role);

    return { ...user._doc, id: user._id, token: generateToken(user) };
};

module.exports = { signup, login };
