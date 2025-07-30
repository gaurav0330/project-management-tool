const mongoose = require('mongoose');

// Define the Skill schema
const SkillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  proficiency: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true,
  },
});

// Define the Profile schema
const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User schema
    required: true,
  },
  skills: [SkillSchema], // Array of skills
  availability: {
    type: String,
    enum: ['available', 'busy', 'offline'],
    default: 'available',
  },
  workload: {
    type: Number,
    default: 0, // Represents the current workload of the user
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the Profile model
const Profile = mongoose.model('Profile', ProfileSchema);

module.exports = Profile;