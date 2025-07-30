const mongoose = require('mongoose');

// Define the Profile schema
const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User schema
    required: true,
    unique: true, // Each user should have one profile
  },
  skills: {
    type: [String], // Array of skills
    required: true,
  },
  experience: {
    type: Number, // Years of experience
    default: 0,
  },
  availability: {
    type: String, // e.g., 'full-time', 'part-time', 'available', 'busy'
    enum: ['full-time', 'part-time', 'available', 'busy'],
    default: 'available',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the Profile model
const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;