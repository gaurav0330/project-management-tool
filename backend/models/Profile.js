const mongoose = require('mongoose');

// Define the Skill schema with additional fields
const SkillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  proficiency: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
  experienceYears: { type: Number, default: 0 },
  lastUsed: { type: Date, default: Date.now },
  certifications: [String],
});

// Define the Project Experience schema
const ProjectExperienceSchema = new mongoose.Schema({
  projectType: { type: String, required: true },
  domain: { type: String, required: true },
  role: { type: String, enum: ['lead', 'developer', 'designer', 'tester'], required: true },
  duration: { type: Number, required: true },
  technologies: [String],
  completedAt: { type: Date, default: Date.now },
});

// Enhanced Profile schema
const ProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  GithubUsername: { type: String, required: true },
  skills: [SkillSchema],
  availability: { type: String, enum: ['available', 'busy', 'offline'], default: 'available' },
  workload: { type: Number, default: 0 },
  
  // New fields for better task assignment
  preferredRoles: [{
    type: String,
    enum: ['frontend', 'backend', 'fullstack', 'mobile', 'devops', 'ui-ux', 'testing', 'database']
  }],
  
  experience: {
    totalYears: { type: Number, default: 0 },
    currentLevel: { type: String, enum: ['junior', 'mid', 'senior', 'lead'], default: 'junior' },
    projectsCompleted: { type: Number, default: 0 },
    projectExperience: [ProjectExperienceSchema]
  },
  
  preferences: {
    projectTypes: [String],
    domains: [String],
  },
  
  performance: {
    completionRate: { type: Number, default: 100, max: 100 },
    averageRating: { type: Number, default: 5, max: 5 },
    totalRatings: { type: Number, default: 0 },
    collaborationScore: { type: Number, default: 5, max: 5 },
  },
  
  learningGoals: [String],
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

ProfileSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Profile', ProfileSchema);
