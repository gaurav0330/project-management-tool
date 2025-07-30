const mongoose = require('mongoose');

// Define the Skill schema
const SkillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  proficiency: {
    type: String, // e.g., 'beginner', 'intermediate', 'expert'
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
  tasksAssigned: {
    type: Number,
    default: 0, // To track the number of tasks assigned
  },
  loadBalance: {
    type: Number,
    default: 0, // To track the load balance for AI-based assignment
  },
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt fields
});

// Create the Profile model
const Profile = mongoose.model('Profile', ProfileSchema);

module.exports = Profile;