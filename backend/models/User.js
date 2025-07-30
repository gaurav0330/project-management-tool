const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Project_Manager", "Team_Lead", "Team_Member"], required: true },
  profile: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }, // Link to Profile
});

module.exports = mongoose.model('User', userSchema);