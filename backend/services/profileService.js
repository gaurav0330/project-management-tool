const Profile = require('../models/Profile');

const profileService = {
  createProfile: async (userId, skills = [], GithubUsername, availability = 'available', workload = 0, preferredRoles = []) => {
    const profile = new Profile({ 
      user: userId, 
      skills, 
      GithubUsername, 
      availability, 
      workload,
      preferredRoles,
      experience: {
        totalYears: 0,
        currentLevel: 'junior',
        projectsCompleted: 0,
        projectExperience: []
      },
      preferences: {
        projectTypes: [],
        domains: []
      },
      performance: {
        completionRate: 100,
        averageRating: 5,
        totalRatings: 0,
        collaborationScore: 5
      },
      learningGoals: []
    });
    return await profile.save();
  },

  updateProfile: async (userId, updates) => {
    const filteredUpdates = {};
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) filteredUpdates[key] = updates[key];
    });
    return await Profile.findOneAndUpdate({ user: userId }, filteredUpdates, { new: true }).populate('user');
  },

  getProfileByUserId: async (userId) => {
    return await Profile.findOne({ user: userId }).populate('user');
  },

  getAllProfiles: async () => {
    return await Profile.find().populate('user');
  },

  addProjectExperience: async (userId, projectExperience) => {
    return await Profile.findOneAndUpdate(
      { user: userId },
      { $push: { 'experience.projectExperience': projectExperience } },
      { new: true }
    ).populate('user');
  },

  updateExperience: async (userId, experienceUpdates) => {
    const updates = {};
    Object.keys(experienceUpdates).forEach(key => {
      if (experienceUpdates[key] !== undefined) {
        updates[`experience.${key}`] = experienceUpdates[key];
      }
    });
    return await Profile.findOneAndUpdate({ user: userId }, updates, { new: true }).populate('user');
  },
};

module.exports = profileService;
