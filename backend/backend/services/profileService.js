const mongoose = require('mongoose');

// Define the Skill schema
const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  proficiency: {
    type: String, // e.g., 'beginner', 'intermediate', 'advanced'
    required: true,
  },
});

// Define the Profile schema
const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User schema
    required: true,
  },
  skills: [skillSchema], // Array of skills
  availability: {
    type: String, // e.g., 'available', 'busy', 'on leave'
    default: 'available',
  },
  workload: {
    type: Number, // A number representing the current workload (e.g., number of tasks)
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the Profile model
const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;