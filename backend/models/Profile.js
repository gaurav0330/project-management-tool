const mongoose = require('mongoose');

// Define the Skill schema
const SkillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  proficiency: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
});

// Define the Profile schema
const ProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  GithubUsername: { type: String, required: true },
  skills: [SkillSchema],
  availability: { type: String, enum: ['available', 'busy', 'offline'], default: 'available' },
  workload: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Profile', ProfileSchema);